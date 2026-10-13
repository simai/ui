/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "4f7ae7ea9e1c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   avatarButton: () => (/* binding */ avatarButton),
/* harmony export */   avatarClasses: () => (/* binding */ avatarClasses),
/* harmony export */   avatarContent: () => (/* binding */ avatarContent),
/* harmony export */   onlineIndicator: () => (/* binding */ onlineIndicator),
/* harmony export */   statusBadge: () => (/* binding */ statusBadge)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function getCompanyBadge(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span aria-hidden="true"
            class="sf-avatar-badge sf-avatar-badge--size-${context.size} sf-avatar-badge--company overflow-hidden flex absolute bottom-0 inline-end-0"
    >
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M56 0H0V55.9998H56V0Z" fill="#E81123"></path>
      <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.12891 28.0004L23.1261 12.9463L27.9999 17.8386L17.8754 28.0016L27.998 38.1627L23.1254 43.0538L8.12891 28.0004Z"
              fill="#F7F7F7"
      ></path>
      <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M47.8706 28.0004L32.8735 12.9463L27.9996 17.8386L38.1241 28.0016L28.0015 38.1627L32.8741 43.0538L47.8706 28.0004Z"
              fill="#F7F7F7"
      ></path>
    </svg>
  </span>`;
}

function getVerifiedBadge(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span aria-hidden="true"
                class="sf-avatar-badge sf-avatar-badge--size-${context.size} sf-avatar-badge--verified overflow-hidden flex absolute bottom-0 inline-end-0"
        >
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#sf-avatar-verified-badge)">
          <path
                  d="M15.4447 3.54197C15.6347 4.00136 15.9993 4.36651 16.4584 4.55716L18.0683 5.22398C18.5277 5.41428 18.8927 5.7793 19.083 6.23872C19.2733 6.69815 19.2733 7.21436 19.083 7.67379L18.4167 9.28249C18.2263 9.74212 18.226 10.2589 18.4173 10.7183L19.0824 12.3265C19.1768 12.554 19.2254 12.7979 19.2254 13.0443C19.2254 13.2906 19.1769 13.5345 19.0827 13.7621C18.9884 13.9897 18.8502 14.1965 18.676 14.3706C18.5018 14.5448 18.295 14.6829 18.0674 14.7771L16.4587 15.4434C15.9993 15.6334 15.6341 15.998 15.4435 16.4571L14.7767 18.067C14.5864 18.5264 14.2213 18.8914 13.7619 19.0817C13.3025 19.272 12.7863 19.272 12.3269 19.0817L10.7181 18.4153C10.2587 18.2255 9.74268 18.2259 9.28353 18.4164L7.67367 19.0823C7.2145 19.2722 6.69874 19.272 6.23969 19.0818C5.78063 18.8917 5.41582 18.5271 5.22539 18.0682L4.55837 16.4578C4.36841 15.9985 4.00381 15.6333 3.5447 15.4427L1.93484 14.7758C1.47561 14.5856 1.11071 14.2208 0.920338 13.7617C0.729967 13.3025 0.729708 12.7865 0.91962 12.3272L1.58597 10.7185C1.7758 10.259 1.77541 9.74301 1.58489 9.28386L0.919499 7.67284C0.82516 7.44529 0.776583 7.20139 0.776543 6.95506C0.776504 6.70873 0.825003 6.4648 0.919269 6.23723C1.01354 6.00965 1.15172 5.80287 1.32593 5.62872C1.50014 5.45457 1.70696 5.31645 1.93457 5.22225L3.54327 4.55591C4.00226 4.36612 4.3672 4.00197 4.55798 3.5434L5.22481 1.93354C5.41511 1.47411 5.78012 1.10909 6.23955 0.918793C6.69898 0.728492 7.21519 0.728492 7.67461 0.918793L9.28332 1.58514C9.74276 1.77497 10.2588 1.77459 10.7179 1.58406L12.3285 0.919827C12.7878 0.729632 13.3039 0.729671 13.7633 0.919935C14.2226 1.1102 14.5876 1.47511 14.7779 1.93442L15.4449 3.54475L15.4447 3.54197Z"
                  fill="#005BBE"
          ></path>
          <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.9166 7.37864C14.0502 7.16879 14.0949 6.91446 14.041 6.6716C13.9871 6.42874 13.8389 6.21724 13.6291 6.08364C13.4192 5.95004 13.1649 5.90527 12.922 5.95919C12.6792 6.0131 12.4677 6.16129 12.3341 6.37114L8.66283 12.1399L6.98283 10.0399C6.82751 9.84562 6.60138 9.72101 6.35418 9.69346C6.10699 9.66592 5.85897 9.7377 5.6647 9.89302C5.47043 10.0483 5.34582 10.2745 5.31827 10.5217C5.29073 10.7689 5.36251 11.0169 5.51783 11.2111L8.01783 14.3361C8.111 14.4528 8.23066 14.5454 8.36687 14.6065C8.50308 14.6675 8.65189 14.6951 8.80093 14.6871C8.94998 14.679 9.09494 14.6355 9.22376 14.5601C9.35258 14.4847 9.46154 14.3796 9.54158 14.2536L13.9166 7.37864V7.37864Z"
                  fill="white"
          ></path>
        </g>
        <defs>
          <clipPath id="sf-avatar-verified-badge">
            <rect width="20" height="20" fill="white"></rect>
          </clipPath>
        </defs>
      </svg>
    </span>
    `;
}

function avatarClasses(context, options = {}) {
  const includeRootClass = options.includeRootClass !== false;
  const classes = ["sf-avatar", "transition", 'flex-none', `sf-avatar--size-${context.size}`, context.line ? `sf-avatar--line-${context.line}` : "", "inline-flex"].filter(Boolean);

  if (context.isImage) {
    classes.push("items-cross-center", "content-main-center");
  }

  if (context.isText) {
    classes.push("sf-avatar--text", "items-cross-center", "content-main-center");
  }

  if (!context.isImage && !context.isText) {
    classes.push("sf-avatar--placeholder", "items-cross-center", "content-main-center");
  }

  if (context.status !== "none") {
    classes.push("relative");
  }

  if (context.shape === "square") {
    classes.push("sf-avatar--square");
  }

  if (context.status === "online") {
    classes.push("sf-avatar--status-icon-online-indicator");
  }

  if (includeRootClass && context.rootClass) {
    classes.push(context.rootClass);
  }

  return classes.join(" ");
}
function avatarContent(context) {
  if (context.isText) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar-text">${context.text}</span>`;
  }

  if (context.isImage) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-avatar-image" src=${context.imageUrl} alt="" />`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">person</i>`;
}
function onlineIndicator(context) {
  if (context.component?.hasSlotContent?.("online-indicator")) {
    return context.component.getSlotContent("online-indicator");
  }

  if (!["online", "offline"].includes(context.status)) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  const sizeMap = {
    "1/4": "sf-online-indicator--size-1/4",
    "1/3": "sf-online-indicator--size-1/3",
    "1/2": "sf-online-indicator--size-1/2",
    1: "sf-online-indicator--size-1",
    2: "sf-online-indicator--size-2",
    3: "sf-online-indicator--size-3"
  };
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span aria-hidden="true"
                class="sf-online-indicator sf-online-indicator--${context.status} ${sizeMap[context.size] || ""} flex absolute bottom-0 inline-end-0"
        ></span>
    `;
}
function statusBadge(context) {
  switch (context.status) {
    case "company":
      if (context.component?.hasSlotContent?.("company-badge")) {
        return context.component.getSlotContent("company-badge");
      }

      return getCompanyBadge(context);

    case "verified":
      if (context.component?.hasSlotContent?.("verified-badge")) {
        return context.component.getSlotContent("verified-badge");
      }

      return getVerifiedBadge(context);

    default:
      return onlineIndicator(context);
  }
}
function avatarButton(context, options = {}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button
                class="${avatarClasses(context, options)}"
                style=${options.includeRootStyle === false ? "" : context.rootStyle || ""}
                aria-label=${context.ariaLabel}
                ?disabled=${context.disabled}
                type="button"
        >
            ${avatarContent(context)} ${statusBadge(context)}
        </button>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d969e7648c73"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b91d91f1eee");
/* harmony import */ var _component_avatars_scss_index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c6ba1146e496");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);




class SfAvatars extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      data: {
        default: ''
      },
      property: {
        default: ''
      },
      imageUrl: {
        default: ''
      },
      avatarUrl: {
        default: ''
      },
      avatarSize: {
        default: ''
      },
      active: {
        type: Boolean,
        default: false
      },
      check: {
        type: Boolean,
        default: false
      },
      name: {
        default: ''
      },
      source: {
        default: ''
      },
      labelText: {
        default: ''
      },
      labelSecondText: {
        default: ''
      },
      avatars: {
        type: Array,
        default: []
      },
      avatarsMore: {
        default: ''
      },
      roundSize: {
        default: ''
      },
      labelSize: {
        default: ''
      },
      profileSize: {
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get dataValue() {
    return (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.parseJsonAttribute)(this, 'data', {});
  }

  get propertyValue() {
    return (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.parseJsonAttribute)(this, 'property', {});
  }

  get imageUrl() {
    return this.getAttribute('image-url') || this.dataValue.imageUrl || this.dataValue.image_url || '';
  }

  get avatarUrl() {
    return this.getAttribute('avatar-url') || this.dataValue.avatarUrl || this.dataValue.avatar_url || this.imageUrl;
  }

  get avatarSize() {
    return this.getAttribute('avatar-size') || this.dataValue.avatarSize || this.dataValue.avatar_size || this.roundSize;
  }

  get active() {
    return this.hasAttribute('active') ? this.getBooleanAttr('active', true) : (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(this.dataValue.active, false);
  }

  get check() {
    return this.hasAttribute('check') ? this.getBooleanAttr('check', true) : (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(this.dataValue.check, false);
  }

  get name() {
    return this.getAttribute('name') || this.dataValue.name || '';
  }

  get source() {
    return this.getAttribute('source') || this.dataValue.source || '';
  }

  get labelText() {
    return this.getAttribute('label-text') || this.dataValue.labelText || this.dataValue.label_text || '';
  }

  get labelSecondText() {
    return this.getAttribute('label-second-text') || this.dataValue.labelSecondText || this.dataValue.label_second_text || '';
  }

  get avatars() {
    const attrValue = this.getAttribute('avatars');

    if (attrValue) {
      try {
        return JSON.parse(attrValue);
      } catch (error) {
        console.warn('sf-avatars: invalid avatars JSON', error);
      }
    }

    return Array.isArray(this.dataValue.avatars) ? this.dataValue.avatars : [];
  }

  get avatarsMore() {
    return this.getAttribute('avatars-more') || this.dataValue.avatarsMore || this.dataValue.avatars_more || '';
  }

  get roundSize() {
    return this.getAttribute('round-size') || this.propertyValue.round_size || this.propertyValue.roundSize || '';
  }

  get labelSize() {
    return this.getAttribute('label-size') || this.propertyValue.label_size || this.propertyValue.labelSize || '';
  }

  get profileSize() {
    return this.getAttribute('profile-size') || this.propertyValue.profile_size || this.propertyValue.profileSize || '';
  }

  get rootClass() {
    return this.getAttribute('root-class') || '';
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      imageUrl: this.imageUrl,
      avatarUrl: this.avatarUrl,
      avatarSize: this.avatarSize,
      active: this.active,
      check: this.check,
      name: this.name,
      source: this.source,
      labelText: this.labelText,
      labelSecondText: this.labelSecondText,
      avatars: this.avatars,
      avatarsMore: this.avatarsMore,
      roundSize: this.roundSize,
      labelSize: this.labelSize,
      profileSize: this.profileSize,
      rootClass: this.rootClass
    });
  }

  hasBuiltInTemplate(templateName = this.templateName) {
    return ['default', 'user', 'group', 'label', 'profile'].includes(templateName);
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderAvatarsTemplate)(this.templateContext());
  }

  get value() {
    return this.templateContext();
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue, {
      removeEmptyString: false
    });
  }

}

SfAvatars.define('sf-avatars');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5b91d91f1eee"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderAvatarsTemplate: () => (/* binding */ renderAvatarsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4f7ae7ea9e1c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The combinations are drawn from the avatar's own parts -- sf-avatar,
// sf-avatar-group, sf-avatar-label-group, the online indicator and the verified
// badge -- the classes the avatars sheet styles. The templates wrote an older
// set (sf-avatar-round, sf-avatar--image, sf-avatar-cir, sf-avatar-check,
// sf-avatar-profile) that no sheet in the release answered: every avatar was
// drawn with no shape and no size. Each avatar was also a button with no name
// and nothing to do; an avatar here is a picture, and the visible text names the
// person.

const SIZES = ['1/4', '1/3', '1/2', '1', '2', '3'];
const SIZE_NAMES = {
  tiny: '1/4',
  extra_small: '1/3',
  extraSmall: '1/3',
  small: '1/2',
  default: '1',
  big: '2',
  extra_big: '3',
  extraBig: '3'
};
const PROFILE_SIZES = {
  small: '2',
  big: '3'
};

function step(value, fallback = '1') {
  const text = String(value ?? '').trim();
  const named = SIZE_NAMES[text] ?? text;
  return SIZES.includes(named) ? named : fallback;
} // How far the avatars of a group overlap, by the size they are drawn at.


function groupStep(size) {
  if (size === '1/4' || size === '1/3') return 'xs';
  if (size === '1/2') return 'sm';
  return 'md';
}

function avatar(options) {
  const imageUrl = options.imageUrl || '';
  const context = {
    size: options.size,
    line: '',
    shape: 'circle',
    imageUrl,
    isImage: Boolean(imageUrl),
    text: options.text || '',
    isText: !imageUrl && Boolean(options.text),
    status: options.status || 'none',
    rootClass: options.rootClass || '',
    component: options.component
  };
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class=${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.avatarClasses)(context)} style=${options.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.avatarContent)(context)} ${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.statusBadge)(context)}
    </span>
  `;
}

function status(context) {
  if (context.check) return 'verified';
  if (context.active) return 'online';
  return 'none';
}

function renderDefaultTemplate(context) {
  return avatar({
    size: step(context.roundSize || context.avatarSize),
    imageUrl: context.imageUrl,
    status: status(context),
    rootClass: context.rootClass,
    rootStyle: context.rootStyle,
    component: context.component
  });
}

function labelGroup(context, {
  size,
  imageUrl,
  title,
  text,
  icon
}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-avatar-label-group', `sf-avatar-label-group--size-${size}`, 'flex', 'items-cross-center', context.rootClass].filter(Boolean).join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${avatar({
    size,
    imageUrl,
    component: context.component
  })}
      <div class="sf-avatar-label-group-container flex flex-col">
        ${title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-label-group-title">${title}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-label-group-text">
              ${icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              <span>${text}</span>
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>
  `;
}

function renderUserTemplate(context) {
  return labelGroup(context, {
    size: step(context.avatarSize),
    imageUrl: context.imageUrl,
    title: context.name,
    text: context.source,
    icon: context.source ? 'link' : ''
  });
}

function renderLabelTemplate(context) {
  return labelGroup(context, {
    size: step(context.labelSize || context.avatarSize),
    imageUrl: context.avatarUrl,
    title: context.labelText,
    text: context.labelSecondText
  });
}

function renderGroupTemplate(context) {
  const size = step(context.roundSize, '1/2');
  const more = String(context.avatarsMore ?? '').trim();
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-avatar-group', `sf-avatar-group--size-${groupStep(size)}`, 'flex', 'items-cross-center', context.rootClass].filter(Boolean).join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <div class="sf-avatar-group-avatars flex">
        ${context.avatars.map(item => avatar({
    size,
    imageUrl: item.imageUrl || item.image_url,
    text: item.text || item.initials,
    component: context.component
  }))}
        ${more ? avatar({
    size,
    text: /^\d+$/u.test(more) ? `+${more}` : more,
    component: context.component
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>
  `;
}

function renderProfileTemplate(context) {
  return avatar({
    size: PROFILE_SIZES[context.profileSize] || step(context.profileSize, '3'),
    imageUrl: context.imageUrl,
    status: 'verified',
    rootClass: context.rootClass,
    rootStyle: context.rootStyle,
    component: context.component
  });
}

function renderAvatarsTemplate(context) {
  switch (context.templateName) {
    case 'user':
      return renderUserTemplate(context);

    case 'group':
      return renderGroupTemplate(context);

    case 'label':
      return renderLabelTemplate(context);

    case 'profile':
      return renderProfileTemplate(context);

    default:
      return renderDefaultTemplate(context);
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c6ba1146e496"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/******/ 	let __webpack_exports__ = __webpack_require__("d969e7648c73");
/******/
/******/ })()
;