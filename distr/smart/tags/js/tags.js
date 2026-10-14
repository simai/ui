/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
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
      console.warn(`[Simai Framework] ${component}: size ${size} is retired for form fields; rendering size ${kept}.`);
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
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true.
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
  to = null
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  const existing = notes.get(key);

  if (existing) {
    existing.count += 1;
    return;
  }

  notes.set(key, {
    component,
    kind,
    attribute,
    from,
    to,
    count: 1
  });

  if (warnEnabled()) {
    const where = component ? `${component}: ` : '';
    const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
    globalThis.console?.warn?.(`[Simai Framework] ${where}${what} is a legacy name${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
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

/***/ "acce07732944"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("058e7e36258a");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);




const TAG_TEXT = {
  en: {
    remove: 'Remove'
  },
  ru: {
    remove: 'Удалить'
  }
};
const TAG_KINDS = ['checkbox', 'icon', 'default', 'color', 'avatar'];
const TAG_STATUSES = ['', 'info', 'success', 'warning', 'error'];

const normalize = value => String(value ?? '').trim().toLowerCase(); // `quantity` was renamed to `default` before either axis was named, and it is
// still accepted.


function resolveTagKind(element, raw, fallback) {
  const requested = normalize(raw);

  if (requested) {
    return requested === 'quantity' ? 'default' : TAG_KINDS.includes(requested) ? requested : fallback;
  }

  const legacy = normalize(element?.getAttribute?.('type'));

  if (legacy === 'quantity') {
    return 'default';
  }

  return TAG_KINDS.includes(legacy) ? legacy : fallback;
}

function resolveTagStatus(element, raw, fallback) {
  const requested = normalize(raw);

  if (requested) {
    return TAG_STATUSES.includes(requested) ? requested : fallback;
  }

  const legacy = normalize(element?.getAttribute?.('type'));
  return TAG_STATUSES.includes(legacy) && legacy !== '' ? legacy : fallback;
}

class SfTag extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
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
      },
      appearance: {
        default: 'default',
        values: ['default', 'surface', 'ghost']
      },
      size: {
        default: '1/2',
        values: ['1/3', '1/2', '1', '2', '3']
      },
      spacing: {
        default: 'normal',
        values: ['compact', 'normal', 'comfortable', 'spacious']
      },
      inline: {
        type: Boolean,
        default: false
      },
      line: {
        default: ''
      },
      text: {
        default: ''
      },
      count: {
        default: ''
      },
      icon: {
        default: ''
      },
      colorClass: {
        default: ''
      },
      avatarImageUrl: {
        default: ''
      },
      avatarText: {
        default: ''
      },
      rootClass: {
        default: ''
      },
      avatarStatus: {
        default: ''
      },
      active: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      closable: {
        type: Boolean,
        default: false
      },
      interactive: {
        type: Boolean,
        default: false
      },
      ariaLabel: {
        default: ''
      },
      closeLabel: {
        default: ''
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

  get status() {
    return this.getProp('status');
  } // The legacy name, which answered both questions from one list: a status when
  // one is set, the kind otherwise.


  get type() {
    return this.status || this.kind;
  } // The appearance is its own axis: what the tag looks like, not what it carries.


  get appearance() {
    return this.getEnumAttr('appearance', ['default', 'surface', 'ghost'], 'default');
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
    return this.getEnumAttr('size', ['1/3', '1/2', '1', '2', '3'], '1/2');
  } // In a table cell or beside other text the tag takes the text line of a form
  // size, so the row keeps its control height.


  get line() {
    const line = this.getAttribute('line') || '';
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.fieldSize)(line, 'sf-tag line') : '';
  }

  get spacing() {
    return this.getEnumAttr('spacing', ['compact', 'normal', 'comfortable', 'spacious'], 'normal');
  }

  get inline() {
    return Boolean(this.line) || this.getBooleanAttr('inline', false);
  }

  get text() {
    return this.getAttribute('text') || '';
  }

  get count() {
    return this.getAttribute('count') || '';
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  get colorClass() {
    return this.getAttribute('color-class') || '';
  }

  get avatarImageUrl() {
    return this.getAttribute('avatar-image-url') || '';
  }

  get avatarText() {
    return this.getAttribute('avatar-text') || '';
  }

  get avatarStatus() {
    return this.getAttribute('avatar-status') || '';
  }

  get rootClass() {
    return this.getRootClass();
  }

  get active() {
    return this.getBooleanAttr('active', false);
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  } // A checkbox tag removes only when asked: it is the default kind, and a remove
  // action on every filter chip would be a surprise. Asked, it is honoured --
  // it used to be dropped without a word (documentation trial, 2026-10-12).


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
    return this.type !== 'checkbox' && this.getBooleanAttr('interactive', false);
  }

  get ariaLabel() {
    return this.getAttribute('aria-label') || '';
  }

  get closeLabel() {
    return this.getAttribute('close-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(TAG_TEXT, 'remove', this);
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
      closeLabel: this.closeLabel
    });
  }

  onToggle() {
    if (this.disabled || this.type !== 'checkbox') return;
    const active = !this.active;
    this.toggleAttribute('active', active);
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        active,
        component: this
      }
    }));
  }

  onClose() {
    if (this.disabled || !this.closable) return;
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true,
      detail: {
        component: this
      }
    }));
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderTagTemplate)(this.templateContext());
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
      ariaLabel: this.ariaLabel,
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

/***/ "058e7e36258a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTagTemplate: () => (/* binding */ renderTagTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("201c9be55e66");
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

/***/ "201c9be55e66"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/******/ 	let __webpack_exports__ = __webpack_require__("acce07732944");
/******/
/******/ })()
;