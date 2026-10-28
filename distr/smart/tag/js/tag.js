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

/***/ "fed59e5c8a07"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("a038e9885b82");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("7eee137ec5ff");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e01b02206b25");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d65b1989605d");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("277f66a1ef9b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__);









const TAG_KINDS = ['checkbox', 'icon', 'default', 'color', 'avatar'];
const TAG_STATUSES = ['', 'info', 'success', 'warning', 'error'];

const normalize = value => String(value ?? '').trim().toLowerCase(); // `type` answered two questions from one list: what the tag carries (kind)
// and what it reports (status). It is not a setting any more and not a dated
// alias either -- an alias names one target and cannot split -- so the routing
// stays here, and each use is noted with the dates of journal
// attribute-tag-type-split. `quantity` was renamed to `default` before either
// axis was named: a dated value alias of kind (aliases.json), still read here
// for type="quantity".


const TYPE_SPLIT = {
  since: '2026-10-27',
  remove_after: '2026-12-01'
};

function legacyType(element, axis) {
  const legacy = normalize(element?.getAttribute?.('type'));
  if (!legacy) return '';
  const kind = legacy === 'quantity' ? 'default' : legacy;
  const fits = axis === 'kind' ? TAG_KINDS.includes(kind) : TAG_STATUSES.includes(kind);
  if (fits) (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
    component: 'sf-tag',
    tag: 'sf-tag',
    kind: 'attribute',
    from: 'type',
    to: axis,
    ...TYPE_SPLIT
  });
  return fits ? kind : '';
}

function resolveTagKind(element, raw, fallback) {
  const requested = normalize(raw);

  if (requested) {
    return requested === 'quantity' ? 'default' : TAG_KINDS.includes(requested) ? requested : fallback;
  }

  return legacyType(element, 'kind') || fallback;
}

function resolveTagStatus(element, raw, fallback) {
  const requested = normalize(raw);

  if (requested) {
    return TAG_STATUSES.includes(requested) ? requested : fallback;
  }

  return legacyType(element, 'status') || fallback;
} // sf-tag from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest; kind and status keep
// their parsers for the split of type. change keeps the browser's name with
// {active}; close is sf-tag-close, the old name close its dated alias.


const TagElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
});

class SfTag extends TagElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // One closed list used to answer two questions: what the tag carries and
      // what it reports. They are separate axes now, and `type` keeps answering
      // both — see contracts/public-api-axes.json. The routing lives in the prop
      // rather than in a getter, because the template reads the props context.
      kind: {
        default: 'checkbox',
        values: TAG_KINDS,
        parser: (raw, fallback, element) => resolveTagKind(element, raw, fallback)
      },
      status: {
        default: '',
        values: TAG_STATUSES,
        parser: (raw, fallback, element) => resolveTagStatus(element, raw, fallback)
      }
    };
  }

  get componentName() {
    return 'tag';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get kind() {
    return this.getProp('kind');
  }

  set kind(value) {
    super.kind = value;
  }

  get status() {
    return this.getProp('status');
  }

  set status(value) {
    super.status = value;
  } // The legacy name, which answered both questions from one list: a status when
  // one is set, the kind otherwise.


  get type() {
    return this.status || this.kind;
  }

  set size(value) {
    super.size = value;
  }

  get size() {
    // On a text line the tag is one size down, the step a dropdown's size 1/2
    // field takes for its tags, so its label sits on the line.
    const line = this.line;
    if (line) return {
      '1/2': '1/3',
      '1': '1/2',
      '2': '1'
    }[line];
    return super.size;
  } // In a table cell or beside other text the tag takes the text line of a form
  // size, so the row keeps its control height.


  get line() {
    const line = this.getAttribute('line') || '';
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(line, 'sf-tag line') : '';
  }

  set line(value) {
    super.line = value;
  }

  get inline() {
    return Boolean(this.line) || super.inline;
  }

  set inline(value) {
    super.inline = value;
  }

  get rootClass() {
    return this.getRootClass();
  } // A checkbox tag removes only when asked: it is the default kind, and a remove
  // action on every filter chip would be a surprise. Asked, it is honoured --
  // it used to be dropped without a word (documentation trial, 2026-10-12).


  set closable(value) {
    super.closable = value;
  }

  get closable() {
    if (this.type === 'checkbox') return this.hasAttribute('closable') && this.getBooleanAttr('closable', true);

    if (this.hasAttribute('closable')) {
      return this.getBooleanAttr('closable', true);
    }

    return ['icon', 'color', 'avatar'].includes(this.type);
  } // An interactive tag (for example a filter chip that opens a menu) renders
  // its label as a real button next to the remove action, so both are
  // reachable and operable from the keyboard. Checkbox tags are buttons already.


  get interactive() {
    return this.type !== 'checkbox' && super.interactive;
  }

  set interactive(value) {
    super.interactive = value;
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      // A tag on a line resolves its size and inline mode from the line; the
      // kind is resolved too, so the canonical kind="checkbox" is interactive,
      // not only the legacy type="checkbox".
      kind: this.kind,
      type: this.type,
      size: this.size,
      inline: this.inline,
      line: this.line,
      component: this,
      rootClass: this.rootClass,
      closable: this.closable,
      interactive: this.interactive,
      closeLabel: this.closeLabel,
      active: this.active,
      ariaLabel: this.getAttribute('aria-label') || ''
    });
  }

  onToggle() {
    if (this.disabled || this.type !== 'checkbox') return;
    const active = !this.active;
    this.toggleAttribute('active', active); // §8: a person's change, under the browser's name, with data only.

    this.sfEmit('change', {
      active
    });
  }

  onClose() {
    if (this.disabled || !this.closable) return; // sf-tag-close (§8); the shim sends the old name close after it.

    this.sfEmit('close', {});
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderTagTemplate)(this.templateContext());
  }

  get value() {
    return {
      template: this.templateName,
      kind: this.kind,
      status: this.status,
      type: this.type,
      appearance: this.appearance,
      size: this.size,
      spacing: this.spacing,
      inline: this.inline,
      line: this.line,
      text: this.text,
      count: this.count,
      icon: this.icon,
      colorClass: this.colorClass,
      avatarImageUrl: this.avatarImageUrl,
      avatarText: this.avatarText,
      avatarStatus: this.avatarStatus,
      rootClass: this.rootClass,
      active: this.active,
      disabled: this.disabled,
      closable: this.closable,
      ariaLabel: this.getAttribute('aria-label') || '',
      closeLabel: this.closeLabel
    };
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

}

SfTag.define('sf-tag');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a038e9885b82"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTagTemplate: () => (/* binding */ renderTagTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("eab03d52c052");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // Sizes 1, 2 and 3 take the larger close and dot; 1/2 and 1/3 the smaller.

const LARGE_SIZES = new Set(['1', '2', '3']);

function closeSize(size) {
  return LARGE_SIZES.has(size) ? '1/3' : '1/4';
}

function dotSize(size) {
  return LARGE_SIZES.has(size) ? '1/2' : '1/3';
}

function renderCheckboxIcon(context) {
  return context.component?.hasSlotContent?.('leading') ? context.component.getSlotContent('leading') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tag-check" aria-hidden="true"></span>`;
}

function renderGenericIcon(context) {
  const iconName = context.icon || 'sell';
  return context.component?.hasSlotContent?.('leading') ? context.component.getSlotContent('leading') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-tag-icon" aria-hidden="true">${iconName}</i>`;
}

function renderColorIcon(context) {
  const extraClass = context.colorClass || '';
  return context.component?.hasSlotContent?.('leading') ? context.component.getSlotContent('leading') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${['sf-tag-color-icon', extraClass].filter(Boolean).join(' ')} aria-hidden="true"></span>`;
}

function renderStatusDot(context) {
  return context.component?.hasSlotContent?.('leading') ? context.component.getSlotContent('leading') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <span class="sf-dot sf-dot--size-${dotSize(context.size)}" aria-hidden="true">
                    <div class="sf-dot-item"></div>
                </span>
        `;
}

function renderAvatar(context) {
  if (context.component?.hasSlotContent?.('avatar')) {
    return context.component.getSlotContent('avatar');
  }

  if (context.avatarImageUrl) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span
                    class="sf-avatar sf-avatar--size-1/4 bg-cover"
                    aria-hidden="true"
                    style=${`background-image: url(${context.avatarImageUrl});`}
            ></span>
        `;
  }

  if (context.avatarText) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-avatar sf-avatar--size-1/4 sf-avatar--text flex justify-center items-center" aria-hidden="true">
        ${context.avatarText}
      </span>
        `;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-avatar sf-avatar--size-1/4 sf-avatar--placeholder flex justify-center items-center" aria-hidden="true">
      <i class="sf-icon">person</i>
    </span>
    `;
}

function renderLeading(context) {
  switch (context.type) {
    case 'checkbox':
      return renderCheckboxIcon(context);

    case 'icon':
      return renderGenericIcon(context);

    case 'color':
      return renderColorIcon(context);

    case 'avatar':
      return renderAvatar(context);

    case 'success':
    case 'error':
    case 'warning':
      return renderStatusDot(context);

    default:
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }
}

function renderCount(context) {
  if (context.type !== 'default') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return context.component?.hasSlotContent?.('count') ? context.component.getSlotContent('count') // No count, no element: an empty one kept its padding and the gap
  // before it, an empty band at the end of every tag (owner, 2026-10-14).
  : context.count ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tag-count pointer-events-none flex">${context.count}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderClose(context) {
  if (!context.closable) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return context.component?.hasSlotContent?.('close') ? context.component.getSlotContent('close') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-icon-button
                        kind="close"
                        size="${closeSize(context.size)}"
                        appearance="link"
                        scheme="on-surface"
                        ?disabled=${context.disabled}
                        aria-label=${context.closeLabel}
                        @click="${e => {
    e.stopPropagation();
    context.component.onClose();
  }}"
                ></sf-icon-button>
        `;
}

function renderTagTemplate(context) {
  const textContent = context.component?.hasSlotContent?.('text') ? context.component.getSlotContent('text') : context.text;
  const classes = ['sf-tag', // One class still carries both answers, because the styles are written
  // that way: a status wins when it is set, exactly as the single list did.
  `sf-tag--${context.status || context.kind || context.type}`, // A named appearance carries its own class, because it is a different axis
  // from the type: the default appearance adds nothing.
  context.appearance && context.appearance !== 'default' ? `sf-tag--appearance-${context.appearance}` : '', `sf-tag--size-${context.size}`, context.spacing && context.spacing !== 'normal' ? `spacing-${context.spacing}` : '', context.inline ? 'sf-tag--inline' : '', context.line ? `sf-tag--line-${context.line}` : '', 'inline-flex', 'flex-row', 'flex-nowrap', 'items-center', `${context.rootClass}`, context.type === 'checkbox' || context.interactive ? 'sf-tag--interactive' : '', context.closable ? 'sf-tag--removable' : '', context.active ? 'active' : '', context.disabled ? 'disabled' : ''].filter(Boolean);
  const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            ${renderLeading(context)}
            <span class="sf-tag-container pointer-events-none">${textContent}</span>
            ${renderCount(context)}
            ${renderClose(context)}
    `; // A removable checkbox tag is two controls side by side, the toggle and
  // the remove action, because a button cannot hold another button.

  if (context.type === 'checkbox' && context.closable) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div
                    class=${classes.join(' ')}
                    style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            >
                <button
                        type="button"
                        class="sf-tag-action inline-flex flex-row flex-nowrap items-center min-w-0"
                        aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        aria-pressed=${String(context.active)}
                        ?disabled=${context.disabled}
                        @click=${() => context.component.onToggle()}
                >
                    ${renderLeading(context)}
                    <span class="sf-tag-container pointer-events-none">${textContent}</span>
                    ${renderCount(context)}
                </button>
                ${renderClose(context)}
            </div>
        `;
  }

  if (context.type === 'checkbox') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <button
                    type="button"
                    class=${classes.join(' ')}
                    style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    aria-pressed=${String(context.active)}
                    ?disabled=${context.disabled}
                    @click=${() => context.component.onToggle()}
            >${content}</button>
        `;
  }

  if (context.interactive) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div
                    class=${classes.join(' ')}
                    style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            >
                <button
                        type="button"
                        class="sf-tag-action inline-flex flex-row flex-nowrap items-center min-w-0"
                        aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        ?disabled=${context.disabled}
                >
                    ${renderLeading(context)}
                    <span class="sf-tag-container pointer-events-none">${textContent}</span>
                    ${renderCount(context)}
                </button>
                ${renderClose(context)}
            </div>
        `;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class=${classes.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${content}</div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "eab03d52c052"
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

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e01b02206b25"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tag for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-tag","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-tag","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"close","to":"sf-tag-close","kind":"event","component":"sf-tag","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-tag-close","to":"close"},"alias-table":{"to":"sf-tag-close","status":"planned","alias_mode":"same-detail"},"section":"§8","note":"the old DOM name of the request; the element left the detail (§8), the rest is the same"},{"from":"quantity","to":"default","kind":"value","setting":"kind","section":"§16 item 20","note":"journal value-tag-quantity-to-default; the number stays in count","component":"sf-tag","since":"2026-10-27","remove_after":"2026-12-01"}]}');

/***/ },

/***/ "7eee137ec5ff"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tag","tag":"sf-tag","version":"1.1.3","kind":"leaf","settings":{"kind":{"type":"enum","values":["checkbox","icon","default","color","avatar"],"default":"checkbox"},"status":{"type":"enum","values":["","info","success","warning","error"],"default":""},"appearance":{"type":"enum","values":["default","surface","ghost"],"default":"default"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1/2"},"line":{"type":"enum","values":["","1/2","1","2"],"default":""},"spacing":{"type":"enum","values":["compact","normal","comfortable","spacious"],"default":"normal"},"inline":{"type":"boolean","default":false},"text":{"type":"string","default":""},"count":{"type":"string","default":"","summary":"The text of the count after the label: a number or a capped one such as 99+"},"icon":{"type":"icon","default":""},"color-class":{"type":"string","default":""},"avatar-image-url":{"type":"string","default":""},"avatar-text":{"type":"string","default":""},"avatar-status":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"closable":{"type":"boolean","optional":true,"summary":"Absent: removable for the icon, color and avatar kinds, not for checkbox and default; present, it says so for any kind"},"interactive":{"type":"boolean","default":false},"close-label":{"type":"string","default-from":"runtime.remove"}},"values":{"active":{"type":"boolean","default":false,"summary":"A checkbox tag is chosen; the tag toggles it and reports it with change"}},"events":{"change":{"carries":{"active":"boolean"}},"close":{"carries":{}}},"actions":{},"css-variables":{"--sf-tag-background-color":{"type":"color","state":"default"},"--sf-tag-color":{"type":"color","state":"default"},"--sf-tag-radius":{"type":"length","state":"default"},"--sf-tag-padding-inline":{"type":"length","state":"default"},"--sf-tag-padding-block":{"type":"length","state":"default"},"--sf-tag-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "d65b1989605d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tags","runtime":{"remove":"Remove"}}');

/***/ },

/***/ "277f66a1ef9b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Теги","runtime":{"remove":"Удалить"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("fed59e5c8a07");
/******/
/******/ })()
;