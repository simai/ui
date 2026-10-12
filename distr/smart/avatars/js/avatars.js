/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

const SIZE_MAP = {
  tiny: '1/4',
  extra_small: '1/3',
  extraSmall: '1/3',
  small: '1/2',
  default: '',
  big: '2',
  extra_big: '3',
  extraBig: '3'
};
const PROFILE_CHECK_SIZE_MAP = {
  small: '3',
  big: '5'
};

function normalizeSize(value) {
  const normalized = String(value || '').trim();
  return SIZE_MAP[normalized] ?? normalized;
}

function roundClass(size) {
  const normalized = normalizeSize(size);
  return normalized ? `sf-avatar-round--${normalized}` : '';
}

function indicatorClass(size, prefix) {
  const normalized = normalizeSize(size);
  return normalized ? `${prefix}--${normalized}` : '';
}

function imageStyle(imageUrl) {
  return imageUrl ? `background-image: url(${imageUrl});` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function checkIcon() {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon">check</i>`;
}

function renderDefaultTemplate(context) {
  const size = context.roundSize || context.avatarSize;
  const avatarClasses = ['sf-avatar', 'sf-avatar-round', roundClass(size), context.rootClass].filter(Boolean);
  const activeClass = indicatorClass(size, 'sf-avatar-cir');
  const checkClass = indicatorClass(size, 'sf-avatar-check');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${avatarClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <button
        type="button"
        class="sf-avatar--image"
        style=${imageStyle(context.imageUrl)}
      >
        ${context.active ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
              class=${['sf-avatar-cir', 'sf-avatar-cir-green', activeClass].filter(Boolean).join(' ')}
            ></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.check ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
              class=${['sf-avatar-check', checkClass].filter(Boolean).join(' ')}
            >
              ${checkIcon()}
            </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </button>
    </div>
  `;
}

function renderUserTemplate(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-avatar', 'sf-avatar--user', context.rootClass].filter(Boolean).join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${context.imageUrl ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img src=${context.imageUrl} alt="" />` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <div class="sf-avatar--user-description">
        <span class="sf-avatar--name">${context.name}</span>
        <span class="sf-avatar--additional">
          <i class="sf-icon">link</i>
          <span>${context.source}</span>
        </span>
      </div>
    </div>
  `;
}

function renderGroupTemplate(context) {
  const groupClasses = ['sf-avatar-group', roundClass(context.roundSize).replace('sf-avatar-round', 'sf-avatar-group'), context.rootClass].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${groupClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${context.avatars.map(avatar => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class=${['sf-avatar', 'sf-avatar-round', roundClass(context.roundSize)].filter(Boolean).join(' ')}>
          <button
            type="button"
            class="sf-avatar--image"
            style=${imageStyle(avatar.imageUrl || avatar.image_url)}
          ></button>
        </div>
      `)}
      ${context.avatarsMore ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class=${['sf-avatar-round', roundClass(context.roundSize)].filter(Boolean).join(' ')}>
              <button type="button" class="sf-avatar--image">
                <span>${context.avatarsMore}&gt;</span>
              </button>
            </div>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}

function renderLabelTemplate(context) {
  const labelClasses = ['sf-avatar-label', context.labelSize ? `sf-avatar-label--${normalizeSize(context.labelSize)}` : '', context.rootClass].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${labelClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${renderDefaultTemplate({ ...context,
    imageUrl: context.avatarUrl,
    roundSize: context.avatarSize,
    active: false,
    check: false,
    rootClass: '',
    rootStyle: ''
  })}
      <div class="sf-avatar-label--text">
        <span>${context.labelText}</span>
        <span>${context.labelSecondText}</span>
      </div>
    </div>
  `;
}

function renderProfileTemplate(context) {
  const profileSize = context.profileSize;
  const checkSize = PROFILE_CHECK_SIZE_MAP[profileSize] || '4';
  const profileClasses = ['sf-avatar', 'sf-avatar-profile', profileSize ? `sf-avatar-profile--${normalizeSize(profileSize)}` : '', context.rootClass].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${profileClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${context.imageUrl ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img src=${context.imageUrl} alt="" />` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <span class=${['sf-avatar-check', `sf-avatar-check--${checkSize}`].join(' ')}>
        ${checkIcon()}
      </span>
    </div>
  `;
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