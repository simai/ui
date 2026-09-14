/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "c7a5006ae2e0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3924cca3566b");
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_public_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _rule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("987c832cfe13");
/* harmony import */ var _rule__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_rule__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9770341d4bfa");
/* harmony import */ var _composition_index_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("32dfc4431a24");
/* harmony import */ var _preloader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6c7f357fe960");






(() => {
  const PLACEHOLDER_MARK = 'sf-shortcode ';
  const CDN_FALLBACK = 'https://cdn.jsdelivr.net/gh/simai/ui@main/distr/';

  if (!window.SF_BOOT_CONFIG) {
    window.SF_BOOT_CONFIG = {};
  }

  if (typeof window.SF_BOOT_CONFIG.preloader === 'undefined') {
    window.SF_BOOT_CONFIG.preloader = {
      wrap: null,
      preloaderActive: false
    };
  }

  const applyInitialTheme = () => {
    if (window.SF_BOOT_CONFIG?.theme === false) return;
    const classes = ['theme-dark', 'theme-light'];
    const doc = document.documentElement;
    if (!doc) return;
    let themeCookie;

    try {
      themeCookie = document.cookie.split('; ').find(c => c.startsWith('sf-theme='));
    } catch {
      themeCookie = undefined;
    }

    let savedTheme = '';

    if (themeCookie) {
      try {
        savedTheme = decodeURIComponent(themeCookie.split('=')[1]);
      } catch {
        savedTheme = '';
      }
    }

    const preference = ['light', 'dark'].includes(savedTheme) ? savedTheme : 'system';
    const isDark = preference === 'dark' || preference === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const targetClass = isDark ? classes[0] : classes[1];
    doc.classList.remove(...classes);
    doc.classList.add(targetClass);
  };

  applyInitialTheme();

  if (!window.sfPath) {
    window.sfPath = CDN_FALLBACK;
  }

  const ensureDirAttribute = () => {
    const root = document.documentElement;
    if (!root || root.getAttribute('dir')) return;
    const computedDir = window.getComputedStyle && root ? window.getComputedStyle(root).direction : '';
    root.setAttribute('dir', computedDir === 'rtl' ? 'rtl' : 'ltr');
  };

  ensureDirAttribute();

  const hideBodyUntilReady = () => {
    if (window.SF_PRELOADED && Object.keys(window.SF_PRELOADED.modules || {}).length) {
      return;
    }

    const setHidden = () => {
      if (!document.body) return false;
      document.body.style.opacity = '0';
      return true;
    };

    if (!setHidden()) {
      const mo = new MutationObserver((muts, obs) => {
        if (setHidden()) obs.disconnect();
      });
      mo.observe(document.documentElement, {
        childList: true
      });
    }

    window.addEventListener('sf-loader-ready', () => {
      if (document.body) document.body.style.opacity = '1';
    }, {
      once: true
    });
  };

  hideBodyUntilReady();

  const mountPreloader = () => {
    const cfg = {
      enabled: true,
      background: (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.getPreloaderBackground)(),
      modifier: 'loader-default',
      tempStyles: 'inset: 0;position: fixed;width: 100%;height: 100vh;opacity: 1;z-index: 1000;background-color: var(--sf-color--surface-highest, var(--sf-surface-0, #fff));text-align: center;',
      color: (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.getPreloaderColor)(),
      width: _preloader__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PRELOADER.width,
      height: _preloader__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PRELOADER.height,
      content: '',
      delay: 300,
      ...(window.SF_BOOT_CONFIG?.preloader || {})
    };
    if (cfg.enabled === false || document.querySelector('.sf-loader')) return;
    const svgContent = cfg.content || (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.createPreloaderContent)(cfg);
    let wrap = null;
    let preloaderWrap = null;
    let preloaderRun = false;
    let delayTimer = null;

    const hide = () => {
      if (wrap) {
        wrap.classList.add('hidden');
      }
    };

    const stopAnimation = () => {
      if (preloaderWrap) {
        (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.stopPreloaderMotion)(preloaderWrap);
      }
    };

    const buildPreloader = () => {
      if (preloaderRun || document.querySelector('.sf-loader')) return;
      wrap = document.createElement('div');
      const inner = document.createElement('div');
      wrap.classList.add('sf-loader', cfg.modifier);
      wrap.setAttribute('data-sf-observer', 'ignore');
      wrap.setAttribute('style', cfg.tempStyles);

      if (cfg.background) {
        wrap.style.background = cfg.background;
      }

      inner.classList.add('sf-loader-block', 'sf-loader-boot');
      inner.setAttribute('style', 'display:flex; width: 100%;height: 100%;align-items: center;justify-content: center; transition: .2s all ease-in-out;');
      inner.innerHTML = svgContent;
      wrap.append(inner);
      document.documentElement.append(wrap);
      preloaderWrap = inner;
      preloaderRun = true;
      window.SF_BOOT_CONFIG.preloader = {
        wrap: wrap,
        preloaderActive: true
      };
      (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.startPreloaderMotion)(preloaderWrap, () => preloaderRun, cfg);
    };

    const cancelBuild = () => {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
        preloaderWrap && preloaderWrap.classList.add('hidden');
      }
    };

    window.addEventListener('sf-loader-init', () => {
      if (!preloaderWrap?.classList?.contains('sf-loader-boot')) return;
      preloaderRun = false;
      stopAnimation();
    }, {
      once: true
    });
    window.addEventListener('sf-loader-ready', () => {
      cancelBuild();
      preloaderRun = false;
      stopAnimation();
      hide();
    }, {
      once: true
    });

    if (cfg.delay > 0) {
      delayTimer = setTimeout(buildPreloader, cfg.delay);
    } else {
      buildPreloader();
    }
  };

  mountPreloader();

  const hideShortCodes = root => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const toReplace = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue || !node.nodeValue.includes('[!')) continue;
      toReplace.push(node);
    }

    toReplace.forEach(textNode => {
      const text = textNode.nodeValue;
      const regex = /\[!([a-zA-Z0-9_-]+)(?:\s+[^\](]+?)?](?:\([^)]*\))?(?:#[a-zA-Z0-9_-]+)?/g;
      let lastIndex = 0;
      const frag = document.createDocumentFragment();

      for (const match of text.matchAll(regex)) {
        const start = match.index ?? text.indexOf(match[0], lastIndex);
        const end = start + match[0].length;

        if (start > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
        }

        const comment = document.createComment(PLACEHOLDER_MARK + match[0]);
        (window.SF_BOOT_SHORTCODES = window.SF_BOOT_SHORTCODES || []).push(comment);
        frag.appendChild(comment);
        lastIndex = end;
      }

      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      textNode.replaceWith(frag);
    });
  };

  const isObserverIgnored = node => {
    const host = node instanceof Element ? node : node?.parentElement || null;
    return Boolean(host?.closest?.('[data-sf-observer="ignore"]'));
  };

  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes && m.addedNodes.forEach(n => {
      if (isObserverIgnored(n)) return;

      if (n.nodeType === Node.TEXT_NODE || n instanceof Text) {
        if (n.nodeValue?.includes('[!')) hideShortCodes(n.parentNode);
      } else if (n instanceof HTMLElement) {
        hideShortCodes(n);
      }
    }));
  });
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  window.addEventListener('sf-loader-init', () => mo.disconnect(), {
    once: true
  });
})();

(async () => {
  await __webpack_require__.e(/* import() | core-rules */ 80841737880868).then(__webpack_require__.bind(__webpack_require__, "a216dbc16e89"));
  await __webpack_require__.e(/* import() | core-system */ 88616323197113).then(__webpack_require__.bind(__webpack_require__, "d55d5a9f332f"));
  await __webpack_require__.e(/* import() | core-system */ 88616323197113).then(__webpack_require__.bind(__webpack_require__, "fedbedd6b87f"));
  await __webpack_require__.e(/* import() | core-loader */ 66700837013363).then(__webpack_require__.bind(__webpack_require__, "eb03d104e275"));
})();

/***/ },

/***/ "9770341d4bfa"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyPattern: () => (/* binding */ applyPattern),
/* harmony export */   createNativeMask: () => (/* binding */ createNativeMask),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function getGlobalRoot() {
  if (!window.SF) window.SF = {};
  return window.SF;
}

function resolveElement(target) {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  if (typeof target === 'string') return document.querySelector(target);
  return null;
}

function digits(value) {
  return String(value ?? '').replace(/\D+/g, '');
}

function applyPattern(value, pattern) {
  if (typeof pattern !== 'string' || pattern === '') return String(value ?? '');
  const source = digits(value);
  let cursor = 0;
  let result = '';

  for (const character of pattern) {
    if (character === '0') {
      if (cursor >= source.length) break;
      result += source[cursor++];
    } else if (cursor > 0 || source.length > 0) {
      result += character;
    }
  }

  return result;
}

function parseNumber(value, options = {}) {
  let candidate = String(value ?? '');
  if (options.thousandsSeparator) candidate = candidate.replaceAll(options.thousandsSeparator, '');
  if (options.radix && options.radix !== '.') candidate = candidate.replace(options.radix, '.');
  const number = Number(candidate);
  return Number.isFinite(number) ? number : null;
}

function format(value, options = {}) {
  if (options.mask === Number) {
    if (value === '' || value === null || value === undefined) return '';
    const number = parseNumber(value, options);
    if (number === null) return '';
    const minimum = Number.isFinite(options.min) ? options.min : number;
    const maximum = Number.isFinite(options.max) ? options.max : number;
    const normalized = Math.min(maximum, Math.max(minimum, number));
    const precision = Math.max(0, Number(options.scale) || 0);
    const output = options.padFractionalZeros ? normalized.toFixed(precision) : String(Number(normalized.toFixed(precision)));
    return output.replace('.', options.radix || '.');
  }

  if (typeof options.mask === 'function') return String(options.mask(value));

  if (options.mask instanceof RegExp) {
    const candidate = String(value ?? '');
    return options.mask.test(candidate) ? candidate : candidate.slice(0, -1);
  }

  return applyPattern(value, options.mask);
}

function createNativeMask(element, options) {
  const state = {
    destroyed: false
  };

  const sync = () => {
    if (state.destroyed) return;
    const next = format(element.value, options);
    if (next !== element.value) element.value = next;
  };

  element.addEventListener('input', sync);
  sync();
  return {
    get value() {
      return element.value;
    },

    set value(value) {
      element.value = format(value, options);
    },

    get unmaskedValue() {
      return digits(element.value);
    },

    get typedValue() {
      if (options.mask !== Number || element.value.trim() === '') return null;
      return parseNumber(element.value, options);
    },

    set typedValue(value) {
      element.value = format(value, options);
    },

    updateValue: sync,

    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      element.removeEventListener('input', sync);
    }

  };
}

const Mask = {
  async load() {
    return createNativeMask;
  },

  async create(target, options) {
    const element = resolveElement(target);
    if (!element || !options) return null;
    return createNativeMask(element, options);
  },

  async pipe(value, masked) {
    return format(value, typeof masked === 'object' ? masked : {
      mask: masked
    });
  },

  destroy(instance) {
    instance?.destroy?.();
  }

};
getGlobalRoot().Mask = Mask;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Mask);

/***/ },

/***/ "6c7f357fe960"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_PRELOADER: () => (/* binding */ DEFAULT_PRELOADER),
/* harmony export */   createPreloaderContent: () => (/* binding */ createPreloaderContent),
/* harmony export */   getPreloaderBackground: () => (/* binding */ getPreloaderBackground),
/* harmony export */   getPreloaderColor: () => (/* binding */ getPreloaderColor),
/* harmony export */   startPreloaderMotion: () => (/* binding */ startPreloaderMotion),
/* harmony export */   stopPreloaderMotion: () => (/* binding */ stopPreloaderMotion)
/* harmony export */ });
const DEFAULT_PRELOADER = Object.freeze({
  width: 31.68,
  height: 48,
  distance: 6,
  cycle: 1800,
  rotateAt: 1458,
  rotationStep: 90,
  transition: 300,
  easing: 'cubic-bezier(0.3, 1.85, 0.55, 1)'
});
const MOTION_HANDLE = '__sfPreloaderMotion';
function getPreloaderColor(root = document.documentElement) {
  const fallback = root?.classList?.contains('theme-dark') ? '#e3e2e7' : '#1a1b1f';
  return `var(--sf-on-surface, ${fallback})`;
}
function getPreloaderBackground(root = document.documentElement) {
  const fallback = root?.classList?.contains('theme-dark') ? '#0f1115' : '#ffffff';
  return `var(--sf-color--surface-highest, var(--sf-surface-0, ${fallback}))`;
}
function createPreloaderContent(preloader = {}) {
  const config = { ...DEFAULT_PRELOADER,
    ...preloader
  };
  return `<svg data-sf-preloader-mark id="sv_li_1" xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 66 100" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 50.0013L49.812 0L66 16.2495L32.3722 50.0051L65.9938 83.7543L49.8097 100L0 50.0013Z" fill="${config.color}"/>
</svg>
<svg data-sf-preloader-mark id="sv_li_2" xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 66 100" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M66 50.0013L16.188 0L0 16.2495L33.6278 50.0051L0.00615692 83.7543L16.1903 100L66 50.0013Z" fill="${config.color}"/>
</svg>`;
}
function stopPreloaderMotion(container) {
  container?.[MOTION_HANDLE]?.();
}
function startPreloaderMotion(container, isActive = () => true, options = {}) {
  if (!container) return () => {};
  stopPreloaderMotion(container);
  const config = { ...DEFAULT_PRELOADER,
    ...options
  };
  const marks = Array.from(container.querySelectorAll('[data-sf-preloader-mark]'));

  if (marks.length !== 2 || typeof marks[0].animate !== 'function') {
    return () => {};
  }

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    container.style.transition = 'none';
    container.style.transform = 'rotate(0deg)';
    marks.forEach(mark => {
      mark.style.transform = 'none';
    });

    const stop = () => {
      if (container[MOTION_HANDLE] === stop) {
        delete container[MOTION_HANDLE];
      }
    };

    container[MOTION_HANDLE] = stop;
    return stop;
  }

  container.style.transition = `${config.transition}ms transform ease-in-out`;
  let rotationAngle = 0;
  let rotationTimer = null;
  let stopped = false;
  const animations = marks.map((mark, index) => {
    const distance = index === 0 ? -config.distance : config.distance;
    return mark.animate([{
      transform: 'translateX(0)',
      offset: 0,
      easing: config.easing
    }, {
      transform: `translateX(${distance}px)`,
      offset: 0.36,
      easing: config.easing
    }, {
      transform: `translateX(${distance}px)`,
      offset: 0.48,
      easing: config.easing
    }, {
      transform: 'translateX(0)',
      offset: 0.84,
      easing: config.easing
    }, {
      transform: 'translateX(0)',
      offset: 1
    }], {
      duration: config.cycle,
      iterations: Number.POSITIVE_INFINITY
    });
  });

  const rotate = () => {
    if (stopped || !isActive()) return;
    rotationAngle += config.rotationStep;
    container.style.transform = `rotate(${rotationAngle}deg)`;
    rotationTimer = window.setTimeout(rotate, config.cycle);
  };

  rotationTimer = window.setTimeout(rotate, config.rotateAt);

  const stop = () => {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(rotationTimer);
    animations.forEach(animation => animation.cancel());
    container.style.transform = 'rotate(0deg)';
    marks.forEach(mark => {
      mark.style.transform = 'none';
    });

    if (container[MOTION_HANDLE] === stop) {
      delete container[MOTION_HANDLE];
    }
  };

  container[MOTION_HANDLE] = stop;
  return stop;
}

/***/ },

/***/ "3924cca3566b"
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* global __webpack_public_path__: writable */
(() => {
  const cdnDefault = 'https://cdn.jsdelivr.net/gh/simai/ui@main/distr/';
  if (typeof window === 'undefined') return;

  if (!window.sfPath) {
    window.sfPath = cdnDefault;
  }

  const frameworkRoot = new URL(window.sfPath, window.location?.href || cdnDefault);

  if (!frameworkRoot.pathname.endsWith('/')) {
    frameworkRoot.pathname += '/';
  }

  const configuredCoreRoot = frameworkRoot.pathname.endsWith('/core/') ? frameworkRoot : new URL('core/', frameworkRoot);
  const coreScript = typeof document === 'undefined' ? null : Array.from(document.scripts).reverse().find(script => {
    if (!script.src) return false;

    try {
      return /\/core\/js\/core(?:\.min)?\.js$/.test(new URL(script.src, document.baseURI).pathname);
    } catch {
      return false;
    }
  });
  const coreRoot = coreScript ? new URL('../', new URL(coreScript.src, document.baseURI)) : configuredCoreRoot;

  if (__webpack_require__.p !== coreRoot.href) {
    __webpack_require__.p = coreRoot.href;
  }
})();

/***/ },

/***/ "987c832cfe13"
() {

window.SF = window.SF || {};
SF.RuleLoader = {};

/***/ },

/***/ "6d5e21314f8e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "08e5033c490a"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_TYPE_MANIFESTS: () => (/* binding */ BUILTIN_TYPE_MANIFESTS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const inlineContentSchema = {
  type: 'array',
  items: {
    oneOf: [
      {
        type: 'object',
        required: ['type', 'value'],
        additionalProperties: false,
        properties: {
          type: { const: 'text' },
          value: { type: 'string', maxLength: 100000 },
          marks: {
            type: 'array',
            uniqueItems: true,
            items: { enum: ['strong', 'em', 'code'] },
          },
        },
      },
      {
        type: 'object',
        required: ['type', 'href', 'children'],
        additionalProperties: false,
        properties: {
          type: { const: 'link' },
          href: { type: 'string', minLength: 1, maxLength: 2048 },
          children: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['type', 'value'],
              additionalProperties: false,
              properties: {
                type: { const: 'text' },
                value: { type: 'string', maxLength: 100000 },
                marks: {
                  type: 'array',
                  uniqueItems: true,
                  items: { enum: ['strong', 'em', 'code'] },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const emptyObjectSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {},
};

const BUILTIN_TYPE_MANIFESTS = Object.freeze([
  {
    schema: 'simai.composition.type-manifest.v1',
    type: 'layout.page',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: emptyObjectSchema,
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {
      default: { min: 0, max: 500, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.page' },
    assets: [],
    capabilities: ['html'],
  },
  {
    schema: 'simai.composition.type-manifest.v1',
    type: 'layout.section',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: emptyObjectSchema,
    presentation: {
      views: ['default'],
      presets: ['surface', 'contrast'],
      modifiers: ['contained', 'spacious'],
    },
    slots: {
      default: { min: 0, max: 500, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.section' },
    assets: [],
    capabilities: ['html'],
  },
  {
    schema: 'simai.composition.type-manifest.v1',
    type: 'layout.columns',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        columns: { type: 'integer', minimum: 1, maximum: 12 },
      },
    },
    presentation: { views: ['default'], presets: [], modifiers: ['equal', 'responsive'] },
    slots: {
      columns: { min: 1, max: 12, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.columns' },
    assets: ['composition/layout'],
    capabilities: ['html'],
  },
  {
    schema: 'simai.composition.type-manifest.v1',
    type: 'content.heading',
    version: '1.0.0',
    category: 'content',
    mode: 'leaf',
    profiles: ['ui-layout', 'structured-content'],
    data_schema: {
      type: 'object',
      required: ['content'],
      additionalProperties: false,
      properties: {
        level: { type: 'integer', minimum: 1, maximum: 6 },
        content: inlineContentSchema,
      },
    },
    props_schema: emptyObjectSchema,
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {},
    renderer: { kind: 'builtin', name: 'content.heading' },
    assets: [],
    capabilities: ['html', 'rich-text'],
  },
  {
    schema: 'simai.composition.type-manifest.v1',
    type: 'content.paragraph',
    version: '1.0.0',
    category: 'content',
    mode: 'leaf',
    profiles: ['ui-layout', 'structured-content'],
    data_schema: {
      type: 'object',
      required: ['content'],
      additionalProperties: false,
      properties: { content: inlineContentSchema },
    },
    props_schema: emptyObjectSchema,
    presentation: { views: ['default'], presets: [], modifiers: ['lead', 'muted'] },
    slots: {},
    renderer: { kind: 'builtin', name: 'content.paragraph' },
    assets: [],
    capabilities: ['html', 'rich-text'],
  },
]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUILTIN_TYPE_MANIFESTS);


/***/ },

/***/ "6f489cc65b77"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonical: () => (/* binding */ canonical),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   stableStringify: () => (/* binding */ stableStringify)
/* harmony export */ });
function isPlainObject(value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(canonical(value));
}




/***/ },

/***/ "32dfc4431a24"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Composition: () => (/* binding */ Composition),
/* harmony export */   Recipe: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__.Recipe),
/* harmony export */   compositionTypeFromSmartManifest: () => (/* binding */ compositionTypeFromSmartManifest),
/* harmony export */   createRegistry: () => (/* binding */ createRegistry),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   parseRecipeJson: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__.parseRecipeJson),
/* harmony export */   recipeDigest: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__.recipeDigest),
/* harmony export */   recipeNodeId: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__.recipeNodeId),
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   resolveRecipe: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__.resolveRecipe),
/* harmony export */   stableStringify: () => (/* reexport safe */ _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify),
/* harmony export */   validate: () => (/* binding */ validate)
/* harmony export */ });
/* harmony import */ var _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("08e5033c490a");
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6770fb69bd04");




const DOCUMENT_SCHEMA = 'simai.composition.document.v1';
const PROFILES = new Set(['ui-layout', 'structured-content']);
const DOCUMENT_FIELDS = new Set(['schema', 'id', 'profile', 'locale', 'root', 'extensions']);
const NODE_FIELDS = new Set(['id', 'type', 'data', 'props', 'slots', 'presentation', 'bindings', 'extensions']);
const PRESENTATION_FIELDS = new Set(['view', 'preset', 'modifiers']);
const BINDING_FIELDS = new Set(['owner', 'ref', 'target', 'revision']);
const FORBIDDEN_KEYS = new Set([
  'html', 'innerhtml', 'script', 'javascript', 'php', 'eval', 'function',
  'expression', 'query', 'sql', 'graphql', 'class', 'classname', 'rootclass',
  'cssclass', 'secret', 'password', 'token', 'cookie', 'authorization', 'request',
]);
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const DEFAULT_LIMITS = Object.freeze({
  maxDocumentBytes: 1024 * 1024,
  maxDepth: 32,
  maxNodes: 2000,
  maxChildrenPerSlot: 500,
});

function diagnostic(code, path, message, details = {}) {
  return { code, path, message, ...details };
}

async function sha256(value) {
  if (!globalThis.crypto?.subtle) throw new Error('composition_crypto_unavailable');
  const bytes = new globalThis.TextEncoder().encode(value);
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function pushUnknownFields(value, allowed, path, diagnostics) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) diagnostics.push(diagnostic('unknown_field', `${path}.${key}`, `Unknown field ${key}`));
  }
}

function scanForbiddenKeys(value, path, diagnostics) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanForbiddenKeys(entry, `${path}[${index}]`, diagnostics));
    return;
  }
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    const normalized = key.toLowerCase().replaceAll('-', '');
    if (FORBIDDEN_KEYS.has(normalized)) {
      diagnostics.push(diagnostic('executable_or_secret_field_forbidden', `${path}.${key}`, `Field ${key} is not portable composition data`));
    }
    scanForbiddenKeys(entry, `${path}.${key}`, diagnostics);
  }
}

function validateExtensions(value, path, diagnostics, supported = new Set()) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) {
    diagnostics.push(diagnostic('extensions_invalid', path, 'Extensions must be an object'));
    return;
  }
  for (const key of Object.keys(value)) {
    if (!/^[a-z][a-z0-9.-]*:[a-z][a-z0-9._-]*$/u.test(key)) {
      diagnostics.push(diagnostic('extension_name_invalid', `${path}.${key}`, 'Extension keys must be namespaced'));
    }
    if ((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value[key]) && value[key].required === true && !supported.has(key)) {
      diagnostics.push(diagnostic('extension_required_unknown', `${path}.${key}`, `Required extension ${key} is not supported`));
    }
  }
}

function validateJsonSchema(value, schema, path, diagnostics) {
  if (!schema) return;
  if (schema.oneOf) {
    const matches = schema.oneOf.filter((candidate) => {
      const local = [];
      validateJsonSchema(value, candidate, path, local);
      return local.length === 0;
    });
    if (matches.length !== 1) diagnostics.push(diagnostic('schema_one_of', path, 'Value must match exactly one allowed shape'));
    return;
  }
  if (schema.const !== undefined && value !== schema.const) {
    diagnostics.push(diagnostic('schema_const', path, `Value must equal ${schema.const}`));
    return;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    diagnostics.push(diagnostic('schema_enum', path, 'Value is not in the allowed list'));
    return;
  }
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (schema.type) {
    const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value === 'number' ? 'number' : typeof value;
    if (!types.includes(actual) && !(actual === 'integer' && types.includes('number')) && !(actual === 'object' && !(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value))) {
      diagnostics.push(diagnostic('schema_type', path, `Expected ${types.join(' or ')}`));
      return;
    }
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) diagnostics.push(diagnostic('schema_min_length', path, 'String is too short'));
    if (schema.maxLength !== undefined && value.length > schema.maxLength) diagnostics.push(diagnostic('schema_max_length', path, 'String is too long'));
    if (schema.pattern && !(new RegExp(schema.pattern, 'u')).test(value)) diagnostics.push(diagnostic('schema_pattern', path, 'String has an invalid format'));
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) diagnostics.push(diagnostic('schema_minimum', path, 'Number is too small'));
    if (schema.maximum !== undefined && value > schema.maximum) diagnostics.push(diagnostic('schema_maximum', path, 'Number is too large'));
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) diagnostics.push(diagnostic('schema_min_items', path, 'Array has too few items'));
    if (schema.maxItems !== undefined && value.length > schema.maxItems) diagnostics.push(diagnostic('schema_max_items', path, 'Array has too many items'));
    if (schema.uniqueItems && new Set(value.map(_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify)).size !== value.length) diagnostics.push(diagnostic('schema_unique_items', path, 'Array items must be unique'));
    if (schema.items) value.forEach((entry, index) => validateJsonSchema(entry, schema.items, `${path}[${index}]`, diagnostics));
  }
  if ((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) {
    for (const key of schema.required || []) {
      if (!(key in value)) diagnostics.push(diagnostic('schema_required', `${path}.${key}`, `Required field ${key} is missing`));
    }
    if (schema.additionalProperties === false) {
      const properties = schema.properties || {};
      for (const key of Object.keys(value)) {
        if (!(key in properties)) diagnostics.push(diagnostic('schema_additional_property', `${path}.${key}`, `Field ${key} is not allowed`));
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties || {})) {
      if (key in value) validateJsonSchema(value[key], childSchema, `${path}.${key}`, diagnostics);
    }
  }
}

function validUrl(value) {
  if (/^(?:\/|\.?\.\/|#)/u.test(value)) return !value.startsWith('//');
  try {
    return SAFE_SCHEMES.has(new globalThis.URL(value).protocol);
  } catch {
    return false;
  }
}

function validateInlineContent(value, path, diagnostics) {
  if (!Array.isArray(value)) return;
  for (let index = 0; index < value.length; index += 1) {
    const inline = value[index];
    if (inline?.type === 'link' && !validUrl(inline.href)) {
      diagnostics.push(diagnostic('unsafe_url', `${path}[${index}].href`, 'Link protocol is not allowed'));
    }
  }
}

function normalizeRegistry(registry) {
  if (registry?.types instanceof Map) return registry;
  return createRegistry(Array.isArray(registry) ? registry : _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_TYPE_MANIFESTS);
}

function createRegistry(manifests = _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_TYPE_MANIFESTS, renderers = {}) {
  const types = new Map();
  for (const manifest of manifests) {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(manifest) || manifest.schema !== 'simai.composition.type-manifest.v1') throw new TypeError('composition_manifest_invalid');
    if (types.has(manifest.type)) throw new TypeError(`composition_manifest_duplicate:${manifest.type}`);
    types.set(manifest.type, (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.canonical)(manifest));
  }
  return { types, renderers: new Map(Object.entries(renderers)) };
}

function compositionTypeFromSmartManifest(manifest) {
  const declaration = manifest?.composition?.declarative;
  if (!declaration) return null;
  const allowed = new Set(declaration.props || []);
  const properties = Object.fromEntries(Object.entries(manifest.inputs?.properties || {}).filter(([key]) => allowed.has(key)));
  return {
    schema: 'simai.composition.type-manifest.v1',
    type: declaration.type,
    version: manifest.version,
    category: 'smart',
    mode: declaration.mode,
    profiles: declaration.profiles,
    data_schema: { type: 'object', additionalProperties: false, properties: {} },
    props_schema: { type: 'object', additionalProperties: false, properties },
    presentation: declaration.presentation || { views: ['default'], presets: [], modifiers: [] },
    slots: declaration.slots || {},
    renderer: declaration.renderer,
    assets: declaration.assets || [],
    capabilities: ['html', 'hydration'],
  };
}

function validate(document, registry = undefined, options = {}) {
  const diagnostics = [];
  const resolvedRegistry = normalizeRegistry(registry);
  const limits = { ...DEFAULT_LIMITS, ...(options.limits || {}) };
  const supportedExtensions = new Set(options.supportedExtensions || []);
  let serialized;
  try {
    serialized = JSON.stringify(document);
  } catch {
    return { valid: false, diagnostics: [diagnostic('document_not_json', '$', 'Document must be JSON serializable')] };
  }
  if (new globalThis.TextEncoder().encode(serialized).byteLength > limits.maxDocumentBytes) diagnostics.push(diagnostic('document_too_large', '$', 'Document exceeds the byte limit'));
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(document)) return { valid: false, diagnostics: [diagnostic('document_invalid', '$', 'Document must be an object')] };
  pushUnknownFields(document, DOCUMENT_FIELDS, '$', diagnostics);
  if (document.schema !== DOCUMENT_SCHEMA) diagnostics.push(diagnostic('schema_unknown', '$.schema', `Expected ${DOCUMENT_SCHEMA}`));
  if (typeof document.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,119}$/u.test(document.id)) diagnostics.push(diagnostic('document_id_invalid', '$.id', 'Document id is invalid'));
  if (!PROFILES.has(document.profile)) diagnostics.push(diagnostic('profile_unknown', '$.profile', 'Profile is not supported'));
  if (document.locale !== undefined && (typeof document.locale !== 'string' || !/^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/u.test(document.locale))) diagnostics.push(diagnostic('locale_invalid', '$.locale', 'Locale is invalid'));
  if (document.extensions !== undefined) validateExtensions(document.extensions, '$.extensions', diagnostics, supportedExtensions);
  scanForbiddenKeys(document, '$', diagnostics);

  const ids = new Set();
  let nodeCount = 0;
  const visit = (node, path, depth) => {
    nodeCount += 1;
    if (nodeCount > limits.maxNodes) return;
    if (depth > limits.maxDepth) diagnostics.push(diagnostic('depth_limit', path, 'Composition is too deeply nested'));
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(node)) {
      diagnostics.push(diagnostic('node_invalid', path, 'Node must be an object'));
      return;
    }
    pushUnknownFields(node, NODE_FIELDS, path, diagnostics);
    if (typeof node.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,119}$/u.test(node.id)) diagnostics.push(diagnostic('node_id_invalid', `${path}.id`, 'Node id is invalid'));
    else if (ids.has(node.id)) diagnostics.push(diagnostic('node_id_duplicate', `${path}.id`, `Duplicate node id ${node.id}`));
    else ids.add(node.id);
    const manifest = resolvedRegistry.types.get(node.type);
    if (!manifest) {
      diagnostics.push(diagnostic('type_unknown', `${path}.type`, `Unknown type ${node.type || ''}`));
      return;
    }
    if (!manifest.profiles.includes(document.profile)) diagnostics.push(diagnostic('type_profile_unsupported', `${path}.type`, `${node.type} does not support ${document.profile}`));
    validateJsonSchema(node.data || {}, manifest.data_schema, `${path}.data`, diagnostics);
    validateJsonSchema(node.props || {}, manifest.props_schema, `${path}.props`, diagnostics);
    if (node.type === 'content.heading' || node.type === 'content.paragraph') validateInlineContent(node.data?.content, `${path}.data.content`, diagnostics);
    if (node.presentation !== undefined) {
      if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(node.presentation)) diagnostics.push(diagnostic('presentation_invalid', `${path}.presentation`, 'Presentation must be an object'));
      else {
        pushUnknownFields(node.presentation, PRESENTATION_FIELDS, `${path}.presentation`, diagnostics);
        const contract = manifest.presentation || {};
        if (node.presentation.view && !(contract.views || []).includes(node.presentation.view)) diagnostics.push(diagnostic('view_unknown', `${path}.presentation.view`, 'View is not registered'));
        if (node.presentation.preset && !(contract.presets || []).includes(node.presentation.preset)) diagnostics.push(diagnostic('preset_unknown', `${path}.presentation.preset`, 'Preset is not registered'));
        if (node.presentation.modifiers !== undefined) {
          if (!Array.isArray(node.presentation.modifiers)) diagnostics.push(diagnostic('modifiers_invalid', `${path}.presentation.modifiers`, 'Modifiers must be an array'));
          else for (const modifier of node.presentation.modifiers) if (!(contract.modifiers || []).includes(modifier)) diagnostics.push(diagnostic('modifier_unknown', `${path}.presentation.modifiers`, `Modifier ${modifier} is not registered`));
        }
      }
    }
    if (node.extensions !== undefined) validateExtensions(node.extensions, `${path}.extensions`, diagnostics, supportedExtensions);
    if (node.bindings !== undefined) {
      if (!Array.isArray(node.bindings)) diagnostics.push(diagnostic('bindings_invalid', `${path}.bindings`, 'Bindings must be an array'));
      else node.bindings.forEach((binding, index) => {
        const bindingPath = `${path}.bindings[${index}]`;
        if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(binding)) diagnostics.push(diagnostic('binding_invalid', bindingPath, 'Binding must be an object'));
        else {
          pushUnknownFields(binding, BINDING_FIELDS, bindingPath, diagnostics);
          for (const key of ['owner', 'ref', 'target']) if (typeof binding[key] !== 'string' || !binding[key]) diagnostics.push(diagnostic('binding_field_invalid', `${bindingPath}.${key}`, `${key} is required`));
          if (binding.revision !== undefined && (typeof binding.revision !== 'string' || !binding.revision)) diagnostics.push(diagnostic('binding_revision_invalid', `${bindingPath}.revision`, 'Revision must be a non-empty string'));
        }
      });
    }
    const slots = node.slots || {};
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(slots)) {
      diagnostics.push(diagnostic('slots_invalid', `${path}.slots`, 'Slots must be an object'));
      return;
    }
    if (manifest.mode === 'leaf' && Object.keys(slots).length) diagnostics.push(diagnostic('leaf_slots_forbidden', `${path}.slots`, 'Leaf type cannot contain slots'));
    for (const [slotName, children] of Object.entries(slots)) {
      const slot = manifest.slots?.[slotName];
      if (!slot) {
        diagnostics.push(diagnostic('slot_unknown', `${path}.slots.${slotName}`, `Slot ${slotName} is not registered`));
        continue;
      }
      if (!Array.isArray(children)) {
        diagnostics.push(diagnostic('slot_children_invalid', `${path}.slots.${slotName}`, 'Slot children must be an array'));
        continue;
      }
      if (children.length > limits.maxChildrenPerSlot || children.length > slot.max || children.length < slot.min) diagnostics.push(diagnostic('slot_cardinality', `${path}.slots.${slotName}`, 'Slot child count is outside the allowed range'));
      children.forEach((child, index) => {
        const childManifest = resolvedRegistry.types.get(child?.type);
        if (childManifest && slot.types && !slot.types.includes(child.type)) diagnostics.push(diagnostic('slot_child_type_forbidden', `${path}.slots.${slotName}[${index}]`, `${child.type} is not allowed in this slot`));
        if (childManifest && slot.categories && !slot.categories.includes(childManifest.category)) diagnostics.push(diagnostic('slot_child_category_forbidden', `${path}.slots.${slotName}[${index}]`, `${childManifest.category} is not allowed in this slot`));
        visit(child, `${path}.slots.${slotName}[${index}]`, depth + 1);
      });
    }
    for (const [slotName, slot] of Object.entries(manifest.slots || {})) {
      if (slot.min > 0 && !(slotName in slots)) diagnostics.push(diagnostic('slot_required', `${path}.slots.${slotName}`, `Slot ${slotName} is required`));
    }
  };
  visit(document.root, '$.root', 1);
  if (nodeCount > limits.maxNodes) diagnostics.push(diagnostic('node_limit', '$.root', 'Composition has too many nodes'));
  return { valid: diagnostics.length === 0, diagnostics };
}

function collectDependencies(node, manifest, output) {
  for (const asset of manifest.assets || []) output.assets.add(asset);
  for (const binding of node.bindings || []) output.bindings.set(`${binding.owner}:${binding.ref}:${binding.target}:${binding.revision || ''}`, (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.canonical)(binding));
}

async function normalize(document, registry = undefined, options = {}) {
  const resolvedRegistry = normalizeRegistry(registry);
  const result = validate(document, resolvedRegistry, options);
  if (!result.valid) return { document: null, digest: null, dependencies: { assets: [], bindings: [] }, diagnostics: result.diagnostics };
  const normalized = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.canonical)(JSON.parse(JSON.stringify(document)));
  const dependencies = { assets: new Set(), bindings: new Map() };
  const visit = (node) => {
    collectDependencies(node, resolvedRegistry.types.get(node.type), dependencies);
    Object.values(node.slots || {}).flat().forEach(visit);
  };
  visit(normalized.root);
  return {
    document: normalized,
    digest: await sha256((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify)(normalized)),
    dependencies: {
      assets: [...dependencies.assets].sort(),
      bindings: [...dependencies.bindings.values()].sort((left, right) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify)(left).localeCompare((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify)(right))),
    },
    diagnostics: [],
  };
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function renderInline(content) {
  return (content || []).map((inline) => {
    if (inline.type === 'link') return `<a href="${escapeHtml(inline.href)}">${renderInline(inline.children)}</a>`;
    let output = escapeHtml(inline.value);
    for (const mark of inline.marks || []) output = mark === 'strong' ? `<strong>${output}</strong>` : mark === 'em' ? `<em>${output}</em>` : `<code>${output}</code>`;
    return output;
  }).join('');
}

const BUILTIN_RENDERERS = {
  'layout.page': ({ node, slots }) => `<main data-sf-composition-id="${escapeHtml(node.id)}">${slots.default || ''}</main>`,
  'layout.section': ({ node, slots }) => `<section data-sf-composition-id="${escapeHtml(node.id)}">${slots.default || ''}</section>`,
  'layout.columns': ({ node, slots }) => `<div class="sf-composition-columns" data-sf-composition-id="${escapeHtml(node.id)}">${(slots.columnsList || []).map((child) => `<div class="sf-composition-column">${child}</div>`).join('')}</div>`,
  'content.heading': ({ node }) => `<h${node.data.level || 2} data-sf-composition-id="${escapeHtml(node.id)}">${renderInline(node.data.content)}</h${node.data.level || 2}>`,
  'content.paragraph': ({ node }) => `<p data-sf-composition-id="${escapeHtml(node.id)}">${renderInline(node.data.content)}</p>`,
};

async function render(document, context = {}) {
  const registry = normalizeRegistry(context.registry);
  const normalized = await normalize(document, registry, context.options || {});
  if (!normalized.document) return { html: '', assets: [], hydration: [], diagnostics: normalized.diagnostics, digest: null };
  const diagnostics = [];
  const hydration = [];
  const renderNode = async (node) => {
    const manifest = registry.types.get(node.type);
    const slots = {};
    for (const [name, children] of Object.entries(node.slots || {})) {
      const rendered = [];
      for (const child of children) rendered.push(await renderNode(child));
      slots[name] = rendered.join('');
      slots[`${name}List`] = rendered;
    }
    const resolvedBindings = {};
    for (const binding of node.bindings || []) {
      if (context.resolveBinding) resolvedBindings[binding.target] = await context.resolveBinding(binding, { document: normalized.document, node });
    }
    let renderer = registry.renderers.get(manifest.renderer.name) || BUILTIN_RENDERERS[manifest.renderer.name];
    if (!renderer && manifest.renderer.kind === 'custom-element' && manifest.renderer.name) {
      renderer = ({ node: current, slots: currentSlots }) => {
        const attributes = Object.entries(current.props || {}).map(([key, value]) => ` ${escapeHtml(key)}="${escapeHtml(value)}"`).join('');
        hydration.push({ id: current.id, type: current.type, element: manifest.renderer.name });
        return `<${manifest.renderer.name}${attributes}>${Object.values(currentSlots).filter((value) => typeof value === 'string').join('')}</${manifest.renderer.name}>`;
      };
    }
    if (!renderer) {
      diagnostics.push(diagnostic('renderer_unavailable', `node:${node.id}`, `Renderer ${manifest.renderer.name} is unavailable`));
      return '';
    }
    return renderer({ node, slots, context, resolvedBindings, manifest });
  };
  const html = await renderNode(normalized.document.root);
  return { html, assets: normalized.dependencies.assets, hydration, diagnostics, digest: normalized.digest };
}

const Composition = Object.freeze({
  Recipe: _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__.Recipe,
  createRegistry,
  compositionTypeFromSmartManifest,
  normalize,
  render,
  resolveRecipe: _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__.resolveRecipe,
  parseRecipeJson: _recipe_mjs__WEBPACK_IMPORTED_MODULE_2__.parseRecipeJson,
  stableStringify: _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify,
  validate,
});

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  globalThis.SF.Composition = Composition;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Composition);





/***/ },

/***/ "6770fb69bd04"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RECIPE_DEFAULT_LIMITS: () => (/* binding */ RECIPE_DEFAULT_LIMITS),
/* harmony export */   Recipe: () => (/* binding */ Recipe),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   parseRecipeJson: () => (/* binding */ parseRecipeJson),
/* harmony export */   recipeDigest: () => (/* binding */ recipeDigest),
/* harmony export */   recipeNodeId: () => (/* binding */ recipeNodeId),
/* harmony export */   resolveRecipe: () => (/* binding */ resolveRecipe)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");


const RECIPE_SCHEMA = 'simai.composition.recipe.v1';
const INPUTS_SCHEMA = 'simai.composition.inputs.v1';
const MANIFEST_SCHEMA = 'simai.composition.recipe-manifest.v1';
const DEPENDENCIES_SCHEMA = 'simai.composition.dependencies.v1';
const CANONICALIZATION = 'simai.recipe.canonical-json.v1';
const SAFE_INTEGER_MIN = -9007199254740991;
const SAFE_INTEGER_MAX = 9007199254740991;

const RECIPE_DEFAULT_LIMITS = Object.freeze({
  maxRecipeBytes: 1048576,
  maxSourceBytes: 1048576,
  maxTotalSourceBytes: 8388608,
  maxInputBytes: 1048576,
  maxTotalInputBytes: 4194304,
  maxUniqueReferences: 128,
  maxInputs: 256,
  maxReferenceDepth: 16,
  maxExpansionSteps: 10000,
  maxIntermediateBytes: 4194304,
  maxOutputBytes: 1048576,
  maxOutputNodes: 2000,
  maxOutputDepth: 32,
  maxChildrenPerSlot: 500,
  maxSelectCases: 64,
});

const HARD_LIMITS = RECIPE_DEFAULT_LIMITS;
const ENTRY_FIELDS = {
  node: new Set(['id', 'node']),
  ref: new Set(['id', 'ref', 'params', 'slots', 'extensions']),
  select: new Set(['id', 'select']),
  insertSlot: new Set(['id', 'insertSlot']),
};
const NODE_FIELDS = new Set(['type', 'data', 'props', 'presentation', 'slots', 'bindings', 'extensions']);
const RECIPE_FIELDS = new Set(['schema', 'id', 'profile', 'locale', 'inputs', 'root', 'extensions']);
const INPUT_ENVELOPE_FIELDS = new Set(['schema', 'scope', 'values', 'extensions']);
const MANIFEST_FIELDS = new Set(['schema', 'id', 'parameters', 'slots', 'body', 'extensions']);
const INPUT_DECLARATION_FIELDS = new Set(['kind', 'schema', 'default', 'expectedOrigin', 'extensions']);
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/u;

function isObject(value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function utf8Size(value) {
  return new globalThis.TextEncoder().encode(typeof value === 'string' ? value : JSON.stringify(value)).byteLength;
}

function parseRecipeJson(text) {
  if (typeof text !== 'string' || text.charCodeAt(0) === 0xfeff) throw Object.assign(new SyntaxError('Invalid JSON input'), { code: 'invalid_json', sourcePath: '$' });
  let position = 0;
  const whitespace = () => { while (/\s/u.test(text[position] || '') && !['\u00a0'].includes(text[position])) position += 1; };
  const stringToken = () => {
    if (text[position] !== '"') throw new SyntaxError('Expected string');
    const start = position++;
    while (position < text.length) {
      const code = text.charCodeAt(position);
      if (code === 34) {
        position += 1;
        const value = JSON.parse(text.slice(start, position));
        for (let index = 0; index < value.length; index += 1) {
          const unit = value.charCodeAt(index);
          if (unit >= 0xd800 && unit <= 0xdbff) {
            const next = value.charCodeAt(index + 1);
            if (!(next >= 0xdc00 && next <= 0xdfff)) throw new SyntaxError('Unpaired surrogate');
            index += 1;
          } else if (unit >= 0xdc00 && unit <= 0xdfff) throw new SyntaxError('Unpaired surrogate');
        }
        return value;
      }
      if (code < 0x20) throw new SyntaxError('Control character in string');
      if (code === 92) {
        position += 1;
        if (text[position] === 'u') {
          if (!/^[0-9a-fA-F]{4}$/u.test(text.slice(position + 1, position + 5))) throw new SyntaxError('Invalid Unicode escape');
          position += 5;
          continue;
        }
        if (!/["\\/bfnrt]/u.test(text[position] || '')) throw new SyntaxError('Invalid escape');
      }
      position += 1;
    }
    throw new SyntaxError('Unterminated string');
  };
  const valueToken = () => {
    whitespace();
    if (text[position] === '{') {
      position += 1;
      whitespace();
      const keys = new Set();
      if (text[position] === '}') { position += 1; return; }
      while (position < text.length) {
        whitespace();
        const key = stringToken();
        if (keys.has(key)) throw new SyntaxError(`Duplicate key ${key}`);
        keys.add(key);
        whitespace();
        if (text[position++] !== ':') throw new SyntaxError('Expected colon');
        valueToken();
        whitespace();
        if (text[position] === '}') { position += 1; return; }
        if (text[position++] !== ',') throw new SyntaxError('Expected comma');
      }
      throw new SyntaxError('Unterminated object');
    }
    if (text[position] === '[') {
      position += 1;
      whitespace();
      if (text[position] === ']') { position += 1; return; }
      while (position < text.length) {
        valueToken();
        whitespace();
        if (text[position] === ']') { position += 1; return; }
        if (text[position++] !== ',') throw new SyntaxError('Expected comma');
      }
      throw new SyntaxError('Unterminated array');
    }
    if (text[position] === '"') { stringToken(); return; }
    const literal = /^(?:true|false|null|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/u.exec(text.slice(position));
    if (!literal) throw new SyntaxError('Invalid JSON value');
    position += literal[0].length;
  };
  try {
    valueToken();
    whitespace();
    if (position !== text.length) throw new SyntaxError('Trailing JSON data');
    const value = JSON.parse(text);
    assertCanonicalValue(value);
    return value;
  } catch (error) {
    if (error?.code === 'invalid_value') throw error;
    throw Object.assign(new SyntaxError(error.message), { code: 'invalid_json', sourcePath: '$' });
  }
}

async function hashBytes(value) {
  if (!globalThis.crypto?.subtle) throw new Error('composition_crypto_unavailable');
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new globalThis.TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function recipeDigest(value) {
  assertCanonicalValue(value);
  return `sha256:${await hashBytes((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(value))}`;
}

async function recipeNodeId(recipeId, segments) {
  return `n-${await hashBytes((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(['sf-composition-node-v1', recipeId, segments]))}`;
}

function assertCanonicalValue(value, path = '$', seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value < SAFE_INTEGER_MIN || value > SAFE_INTEGER_MAX) {
      throw Object.assign(new TypeError('invalid canonical number'), { code: 'invalid_value', sourcePath: path });
    }
    return;
  }
  if (typeof value !== 'object' || (!Array.isArray(value) && !isObject(value)) || seen.has(value)) {
    throw Object.assign(new TypeError('value is not canonical JSON'), { code: 'invalid_json', sourcePath: path });
  }
  seen.add(value);
  if (Array.isArray(value)) value.forEach((entry, index) => assertCanonicalValue(entry, `${path}/${index}`, seen));
  else Object.entries(value).forEach(([key, entry]) => {
    if (/^[0-9]+$/u.test(key) && Number(key) > 4294967294) {
      // It remains a normal string key; the check intentionally documents the boundary.
    }
    assertCanonicalValue(entry, `${path}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`, seen);
  });
  seen.delete(value);
}

function failure(code, sourcePath, message, referenceChain = []) {
  return { code, sourcePath, referenceChain: [...referenceChain], message };
}

function normalizeLimits(overrides = {}) {
  const limits = {};
  for (const [name, hardMaximum] of Object.entries(HARD_LIMITS)) {
    const value = overrides[name] ?? hardMaximum;
    if (!Number.isInteger(value) || value <= 0) {
      throw Object.assign(new RangeError(`Invalid limit ${name}`), { code: 'invalid_value', sourcePath: `/limits/${name}` });
    }
    if (value > hardMaximum) {
      throw Object.assign(new RangeError(`Limit ${name} exceeds the hard maximum`), { code: 'limit_exceeded', sourcePath: `/limits/${name}` });
    }
    limits[name] = value;
  }
  return limits;
}

function assertFields(value, allowed, path) {
  if (!isObject(value)) throw Object.assign(new TypeError('Expected object'), { code: 'invalid_value', sourcePath: path });
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw Object.assign(new TypeError(`Unknown field ${key}`), { code: 'unknown_field', sourcePath: `${path}/${key}` });
  }
}

function assertExtensions(extensions, path, supportedExtensions) {
  if (extensions === undefined) return;
  if (!isObject(extensions)) throw Object.assign(new TypeError('Extensions must be an object'), { code: 'invalid_value', sourcePath: path });
  for (const [name, value] of Object.entries(extensions)) {
    if (!/^[a-z][a-z0-9.-]*:[a-z][a-z0-9._-]*$/u.test(name)) throw Object.assign(new TypeError('Extension name must be namespaced'), { code: 'invalid_value', sourcePath: `${path}/${name}` });
    if (isObject(value) && value.required === true && !supportedExtensions.has(name)) throw Object.assign(new Error(`Required extension ${name} is unsupported`), { code: 'unsupported_extension', sourcePath: `${path}/${name}` });
  }
}

function assertValueExpression(expression, path) {
  if (!isObject(expression)) throw Object.assign(new TypeError('Value wrapper is required'), { code: 'invalid_value', sourcePath: path });
  const forms = ['literal', 'input', 'parameter'].filter((name) => Object.hasOwn(expression, name));
  if (forms.length !== 1 || Object.keys(expression).length !== 1) throw Object.assign(new TypeError('Value must have exactly one form'), { code: 'invalid_value', sourcePath: path });
  if (forms[0] !== 'literal' && !ID.test(expression[forms[0]] || '')) throw Object.assign(new TypeError('Value reference is invalid'), { code: 'invalid_value', sourcePath: path });
}

function entryKind(entry) {
  const kinds = ['node', 'ref', 'select', 'insertSlot'].filter((key) => Object.hasOwn(entry || {}, key));
  if (kinds.length !== 1) throw Object.assign(new TypeError('Entry must contain one form'), { code: 'invalid_value' });
  return kinds[0];
}

function validateEntrySyntax(entry, path, { insertionAllowed = false, localIds = new Set(), maxSelectCases = HARD_LIMITS.maxSelectCases, supportedExtensions = new Set() } = {}) {
  if (!isObject(entry) || !ID.test(entry.id || '')) throw Object.assign(new TypeError('Invalid entry id'), { code: 'invalid_value', sourcePath: `${path}/id` });
  const kind = entryKind(entry);
  if (kind === 'insertSlot' && !insertionAllowed) throw Object.assign(new TypeError('Insertion is only valid inside a slot'), { code: 'invalid_value', sourcePath: path });
  assertFields(entry, ENTRY_FIELDS[kind], path);
  if (localIds.has(entry.id)) throw Object.assign(new TypeError('Duplicate local id'), { code: 'duplicate_id', sourcePath: `${path}/id` });
  localIds.add(entry.id);
  if (kind === 'node') {
    assertFields(entry.node, NODE_FIELDS, `${path}/node`);
    if (!/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/u.test(entry.node.type || '')) throw Object.assign(new TypeError('Node type is invalid'), { code: 'unknown_type', sourcePath: `${path}/node/type` });
    for (const [field, expressions] of Object.entries({ data: entry.node.data, props: entry.node.props, presentation: entry.node.presentation })) {
      for (const [name, expression] of Object.entries(expressions || {})) assertValueExpression(expression, `${path}/node/${field}/${name}`);
    }
    for (const [index, binding] of (entry.node.bindings || []).entries()) {
      assertFields(binding, new Set(['input', 'target']), `${path}/node/bindings/${index}`);
      if (!ID.test(binding.input || '') || !ID.test(binding.target || '')) throw Object.assign(new TypeError('Binding is invalid'), { code: 'invalid_value', sourcePath: `${path}/node/bindings/${index}` });
    }
    assertExtensions(entry.node.extensions, `${path}/node/extensions`, supportedExtensions);
    for (const [slot, children] of Object.entries(entry.node.slots || {})) {
      if (!Array.isArray(children)) throw Object.assign(new TypeError('Slot must be an array'), { code: 'invalid_value', sourcePath: `${path}/node/slots/${slot}` });
      children.forEach((child, index) => validateEntrySyntax(child, `${path}/node/slots/${slot}/${index}`, { insertionAllowed: true, localIds, maxSelectCases, supportedExtensions }));
    }
  } else if (kind === 'ref') {
    if (!isObject(entry.ref)) throw Object.assign(new TypeError('Reference is invalid'), { code: 'invalid_value', sourcePath: `${path}/ref` });
    const referenceFields = entry.ref.policy === 'pinned'
      ? new Set(['kind', 'owner', 'ref', 'policy', 'revision', 'extensions'])
      : new Set(['kind', 'owner', 'ref', 'policy', 'pointer', 'extensions']);
    assertFields(entry.ref, referenceFields, `${path}/ref`);
    if (!['template', 'fragment'].includes(entry.ref.kind) || !['pinned', 'follow-published'].includes(entry.ref.policy)) throw Object.assign(new TypeError('Reference kind or policy is invalid'), { code: 'invalid_value', sourcePath: `${path}/ref` });
    const selector = entry.ref.policy === 'pinned' ? entry.ref.revision : entry.ref.pointer;
    if (![entry.ref.owner, entry.ref.ref, selector].every((value) => typeof value === 'string' && value)) throw Object.assign(new TypeError('Reference identity is incomplete'), { code: 'invalid_value', sourcePath: `${path}/ref` });
    for (const [name, expression] of Object.entries(entry.params || {})) assertValueExpression(expression, `${path}/params/${name}`);
    assertExtensions(entry.ref.extensions, `${path}/ref/extensions`, supportedExtensions);
    assertExtensions(entry.extensions, `${path}/extensions`, supportedExtensions);
    for (const [slot, children] of Object.entries(entry.slots || {})) {
      if (!Array.isArray(children)) throw Object.assign(new TypeError('Slot must be an array'), { code: 'invalid_value', sourcePath: `${path}/slots/${slot}` });
      children.forEach((child, index) => validateEntrySyntax(child, `${path}/slots/${slot}/${index}`, { insertionAllowed: false, localIds, maxSelectCases, supportedExtensions }));
    }
  } else if (kind === 'select') {
    assertFields(entry.select, new Set(['value', 'cases', 'missingCase']), `${path}/select`);
    assertValueExpression(entry.select.value, `${path}/select/value`);
    const cases = entry.select?.cases;
    if (!isObject(cases) || Object.keys(cases).length === 0) throw Object.assign(new TypeError('Select needs cases'), { code: 'invalid_value', sourcePath: `${path}/select/cases` });
    if (Object.keys(cases).length > maxSelectCases) throw Object.assign(new RangeError('Select case limit exceeded'), { code: 'limit_exceeded', sourcePath: `${path}/select/cases` });
    if (entry.select.missingCase !== undefined && !Object.hasOwn(cases, entry.select.missingCase)) throw Object.assign(new TypeError('Missing case must name an existing case'), { code: 'invalid_value', sourcePath: `${path}/select/missingCase` });
    for (const [key, child] of Object.entries(cases)) validateEntrySyntax(child, `${path}/select/cases/${key}`, { localIds: new Set(), maxSelectCases, supportedExtensions });
  } else if (!ID.test(entry.insertSlot || '')) {
    throw Object.assign(new TypeError('Insertion slot is invalid'), { code: 'unknown_slot', sourcePath: `${path}/insertSlot` });
  }
  return kind;
}

function checkValue(value, schema, path) {
  const errors = [];
  const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value;
  if (schema.type && schema.type !== actual) errors.push(`expected ${schema.type}`);
  if (schema.const !== undefined && (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(schema.const) !== (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(value)) errors.push('const mismatch');
  if (schema.enum && !schema.enum.some((item) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(item) === (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(value))) errors.push('enum mismatch');
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push('string too short');
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push('string too long');
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push('number too small');
    if (schema.maximum !== undefined && value > schema.maximum) errors.push('number too large');
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push('array too short');
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push('array too long');
    if (schema.items) value.forEach((item, index) => checkValue(item, schema.items, `${path}/${index}`));
  }
  if (isObject(value)) {
    for (const name of schema.required || []) if (!Object.hasOwn(value, name)) errors.push(`missing ${name}`);
    if (schema.additionalProperties === false) for (const name of Object.keys(value)) if (!Object.hasOwn(schema.properties || {}, name)) errors.push(`unknown ${name}`);
    for (const [name, child] of Object.entries(schema.properties || {})) if (Object.hasOwn(value, name)) checkValue(value[name], child, `${path}/${name}`);
  }
  if (errors.length) throw Object.assign(new TypeError(errors[0]), { code: 'invalid_value', sourcePath: path });
}

function copyExtensions(value) {
  return value === undefined ? undefined : clone(value);
}

async function resolveRecipe(recipe, context = {}) {
  const trace = [];
  const diagnostics = [];
  const referenceChain = [];
  try {
    const limits = normalizeLimits(context.limits);
    assertCanonicalValue(recipe);
    if (utf8Size(recipe) > limits.maxRecipeBytes) throw Object.assign(new RangeError('Recipe byte limit exceeded'), { code: 'limit_exceeded', sourcePath: '$' });
    if (!isObject(recipe) || recipe.schema !== RECIPE_SCHEMA) throw Object.assign(new TypeError('Unsupported recipe schema'), { code: 'invalid_value', sourcePath: '/schema' });
    assertFields(recipe, RECIPE_FIELDS, '');
    if (!ID.test(recipe.id || '') || !['ui-layout', 'structured-content'].includes(recipe.profile)) throw Object.assign(new TypeError('Recipe identity or profile is invalid'), { code: 'invalid_value', sourcePath: '/' });
    const supportedExtensions = new Set(context.supportedExtensions || []);
    for (const [name, declaration] of Object.entries(recipe.inputs || {})) {
      assertFields(declaration, INPUT_DECLARATION_FIELDS, `/inputs/${name}`);
      if (!['parameter', 'setting', 'content'].includes(declaration.kind) || !isObject(declaration.schema)) throw Object.assign(new TypeError('Input declaration is invalid'), { code: 'invalid_value', sourcePath: `/inputs/${name}` });
      if (declaration.default) assertValueExpression(declaration.default, `/inputs/${name}/default`);
      if (declaration.default && !Object.hasOwn(declaration.default, 'literal')) throw Object.assign(new TypeError('Input default must be literal'), { code: 'invalid_value', sourcePath: `/inputs/${name}/default` });
      if (declaration.kind === 'content' && (!declaration.expectedOrigin?.owner || !declaration.expectedOrigin?.ref)) throw Object.assign(new TypeError('Content origin is required'), { code: 'input_origin_mismatch', sourcePath: `/inputs/${name}/expectedOrigin` });
      assertExtensions(declaration.extensions, `/inputs/${name}/extensions`, supportedExtensions);
    }
    assertExtensions(recipe.extensions, '/extensions', supportedExtensions);
    validateEntrySyntax(recipe.root, '/root', { localIds: new Set(), maxSelectCases: limits.maxSelectCases, supportedExtensions });
    if (Object.keys(recipe.inputs || {}).length > limits.maxInputs) throw Object.assign(new RangeError('Input limit exceeded'), { code: 'limit_exceeded', sourcePath: '/inputs' });
    const scope = context.trustedContext?.scope;
    if (typeof scope !== 'string' || !scope) throw Object.assign(new TypeError('Trusted scope is required'), { code: 'invalid_value', sourcePath: '/trustedContext/scope' });
    const inputsEnvelope = context.inputs || { schema: INPUTS_SCHEMA, scope, values: {} };
    assertCanonicalValue(inputsEnvelope, '/inputs');
    assertFields(inputsEnvelope, INPUT_ENVELOPE_FIELDS, '/inputs');
    if (inputsEnvelope.schema !== INPUTS_SCHEMA || inputsEnvelope.scope !== scope) throw Object.assign(new TypeError('Input scope mismatch'), { code: 'input_origin_mismatch', sourcePath: '/inputs' });

    const recipeHash = await recipeDigest(recipe);
    const limitsState = { steps: 0, sourceBytes: 0, inputBytes: 0, nodes: 0, intermediateBytes: 0 };
    const usedIds = new Set();
    const referenceCache = new Map();
    const inputCache = new Map();
    const references = [];
    const inputReceipts = [];
    const logicalPointers = [];

    const step = (sourcePath) => {
      limitsState.steps += 1;
      if (limitsState.steps > limits.maxExpansionSteps) throw Object.assign(new RangeError('Expansion step limit exceeded'), { code: 'limit_exceeded', sourcePath });
    };

    const readInput = async (name, sourcePath) => {
      step(sourcePath);
      if (inputCache.has(name)) return inputCache.get(name);
      const declaration = recipe.inputs?.[name];
      if (!declaration) throw Object.assign(new TypeError(`Unknown input ${name}`), { code: 'missing_input', sourcePath });
      trace.push({ operation: 'read-input', name, sourcePath });
      let supplied = inputsEnvelope.values?.[name];
      if (supplied === undefined && context.ports?.readInput) supplied = await context.ports.readInput(name, declaration, { scope });
      if (supplied?.status === 'denied') throw Object.assign(new Error('Input access denied'), { code: 'access_denied', sourcePath });
      if (supplied?.status === 'error') throw Object.assign(new Error('Input source failed'), { code: 'source_error', sourcePath });
      let result;
      if (supplied === undefined || supplied?.status === 'missing') {
        if (!declaration.default) throw Object.assign(new Error(`Input ${name} is missing`), { code: 'missing_input', sourcePath });
        const value = clone(declaration.default.literal);
        checkValue(value, declaration.schema, sourcePath);
        const valueDigest = await recipeDigest(value);
        const missingSource = supplied?.missingSource || (declaration.kind === 'parameter' ? undefined : { scope, owner: declaration.expectedOrigin?.owner, ref: declaration.expectedOrigin?.ref });
        if (declaration.kind !== 'parameter' && (!missingSource?.owner || !missingSource?.ref)) throw Object.assign(new Error('Missing source identity is required'), { code: 'input_origin_mismatch', sourcePath });
        result = { value, receipt: { name, kind: declaration.kind, valueDigest, ...(missingSource ? { missingSource } : {}), resolution: 'default' } };
      } else {
        limitsState.inputBytes += utf8Size(supplied);
        if (utf8Size(supplied) > limits.maxInputBytes || limitsState.inputBytes > limits.maxTotalInputBytes) throw Object.assign(new RangeError('Input byte limit exceeded'), { code: 'limit_exceeded', sourcePath });
        if (supplied.kind !== declaration.kind) throw Object.assign(new Error('Input kind mismatch'), { code: 'input_origin_mismatch', sourcePath });
        checkValue(supplied.value, declaration.schema, sourcePath);
        const valueDigest = await recipeDigest(supplied.value);
        if (valueDigest !== supplied.valueDigest) throw Object.assign(new Error('Input digest mismatch'), { code: 'input_digest_mismatch', sourcePath });
        const expected = declaration.expectedOrigin;
        if (declaration.kind !== 'parameter') {
          if (!supplied.origin || supplied.origin.scope !== scope || expected?.owner !== supplied.origin.owner || expected?.ref !== supplied.origin.ref || (expected?.revision && expected.revision !== supplied.origin.revision)) {
            throw Object.assign(new Error('Input origin mismatch'), { code: 'input_origin_mismatch', sourcePath });
          }
        }
        result = { value: clone(supplied.value), receipt: { name, kind: declaration.kind, valueDigest, ...(supplied.origin ? { origin: clone(supplied.origin) } : {}), resolution: 'provided' } };
      }
      inputCache.set(name, result);
      inputReceipts.push(result.receipt);
      return result;
    };

    const resolveValue = async (expression, parameters, sourcePath) => {
      step(sourcePath);
      if (!isObject(expression)) throw Object.assign(new TypeError('Value wrapper is required'), { code: 'invalid_value', sourcePath });
      if (Object.hasOwn(expression, 'literal')) return clone(expression.literal);
      if (Object.hasOwn(expression, 'input')) return (await readInput(expression.input, sourcePath)).value;
      if (Object.hasOwn(expression, 'parameter')) {
        if (!parameters.has(expression.parameter)) throw Object.assign(new Error(`Parameter ${expression.parameter} is missing`), { code: 'unknown_parameter', sourcePath });
        return clone(parameters.get(expression.parameter));
      }
      throw Object.assign(new TypeError('Unknown value wrapper'), { code: 'invalid_value', sourcePath });
    };

    const readReference = async (reference, sourcePath) => {
      step(sourcePath);
      const revisionKey = reference.policy === 'pinned' ? reference.revision : `pointer:${reference.pointer}`;
      const cacheKey = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)([scope, reference.kind, reference.owner, reference.ref, revisionKey]);
      if (referenceCache.has(cacheKey)) return referenceCache.get(cacheKey);
      if (referenceCache.size >= limits.maxUniqueReferences) throw Object.assign(new RangeError('Reference limit exceeded'), { code: 'limit_exceeded', sourcePath });
      if (!context.ports?.readReference) throw Object.assign(new Error('Reference port is unavailable'), { code: 'missing_reference', sourcePath });
      trace.push({ operation: 'read-reference', kind: reference.kind, owner: reference.owner, ref: reference.ref, revision: reference.revision, pointer: reference.pointer, sourcePath });
      const response = await context.ports.readReference(reference, { scope, maxBytes: limits.maxSourceBytes });
      if (response?.status === 'denied') throw Object.assign(new Error('Reference access denied'), { code: 'access_denied', sourcePath });
      if (response?.status === 'error') throw Object.assign(new Error('Reference source failed'), { code: 'source_error', sourcePath });
      if (!response?.source) throw Object.assign(new Error('Reference not found'), { code: 'missing_reference', sourcePath });
      const revision = response.revision;
      if (reference.policy === 'pinned' && revision !== reference.revision) throw Object.assign(new Error('Reference revision mismatch'), { code: 'revision_mismatch', sourcePath });
      const bytes = utf8Size(response.source);
      limitsState.sourceBytes += bytes;
      if (bytes > limits.maxSourceBytes || limitsState.sourceBytes > limits.maxTotalSourceBytes) throw Object.assign(new RangeError('Source byte limit exceeded'), { code: 'limit_exceeded', sourcePath });
      const digest = await recipeDigest(response.source);
      if (response.digest && response.digest !== digest) throw Object.assign(new Error('Reference digest mismatch'), { code: 'revision_mismatch', sourcePath });
      const result = { source: clone(response.source), revision, digest };
      referenceCache.set(cacheKey, result);
      references.push({ kind: reference.kind, owner: reference.owner, ref: reference.ref, revision, digest, scope });
      if (reference.policy === 'follow-published') logicalPointers.push({ kind: reference.kind, owner: reference.owner, ref: reference.ref, pointer: reference.pointer, generation: response.generation, resolvedRevision: revision, scope });
      return result;
    };

    const expand = async (entry, state, sourcePath) => {
      step(sourcePath);
      const kind = entryKind(entry);
      if (kind === 'select') {
        const selected = await resolveValue(entry.select.value, state.parameters, `${sourcePath}/select/value`);
        if (typeof selected !== 'string') throw Object.assign(new Error('Select value must be a string'), { code: 'invalid_value', sourcePath: `${sourcePath}/select/value` });
        let caseName = String(selected);
        if (!Object.hasOwn(entry.select.cases, caseName)) caseName = entry.select.missingCase;
        if (!caseName || !Object.hasOwn(entry.select.cases, caseName)) throw Object.assign(new Error('Select value has no case'), { code: 'invalid_value', sourcePath });
        return expand(entry.select.cases[caseName], { ...state, segments: [...state.segments, ['select', entry.id], ['case', caseName]] }, `${sourcePath}/select/cases/${caseName}`);
      }
      if (kind === 'insertSlot') {
        const entries = state.callSlots?.[entry.insertSlot] ?? state.slotDefaults?.[entry.insertSlot] ?? [];
        const output = [];
        for (let index = 0; index < entries.length; index += 1) {
          output.push(await expand(entries[index], { ...state, segments: [...state.segments, ['insertion', entry.id], ['argument-slot', entry.insertSlot]] }, `${sourcePath}/inserted/${entry.insertSlot}/${index}`));
        }
        const expanded = output.flat();
        const slot = state.slotSpecs?.[entry.insertSlot];
        if (!slot) throw Object.assign(new Error(`Unknown insertion slot ${entry.insertSlot}`), { code: 'unknown_slot', sourcePath });
        if (expanded.length < slot.min || expanded.length > slot.max) throw Object.assign(new Error(`Slot ${entry.insertSlot} has invalid cardinality`), { code: 'invalid_value', sourcePath });
        if (slot.types?.length && expanded.some((node) => !slot.types.includes(node.type))) throw Object.assign(new Error(`Slot ${entry.insertSlot} contains a forbidden type`), { code: 'unknown_type', sourcePath });
        state.usedCallSlots?.add(entry.insertSlot);
        return expanded;
      }
      if (kind === 'ref') {
        if (referenceChain.length >= limits.maxReferenceDepth) throw Object.assign(new RangeError('Reference depth exceeded'), { code: 'limit_exceeded', sourcePath });
        const refKey = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)([scope, entry.ref.kind, entry.ref.owner, entry.ref.ref, entry.ref.revision || entry.ref.pointer]);
        if (referenceChain.includes(refKey)) throw Object.assign(new Error('Reference cycle'), { code: 'reference_cycle', sourcePath });
        const resolved = await readReference(entry.ref, sourcePath);
        referenceChain.push(refKey);
        try {
          if (entry.ref.kind === 'fragment') {
            if (entry.params || entry.slots) throw Object.assign(new Error('Fragment cannot receive parameters or slots'), { code: 'invalid_value', sourcePath });
            validateEntrySyntax(resolved.source, `${sourcePath}/source`, { localIds: new Set(), maxSelectCases: limits.maxSelectCases, supportedExtensions });
            return await expand(resolved.source, { ...state, segments: [...state.segments, ['placement', entry.id]] }, `${sourcePath}/source`);
          }
          if (resolved.source.schema !== MANIFEST_SCHEMA) throw Object.assign(new Error('Template manifest is invalid'), { code: 'invalid_value', sourcePath });
          assertFields(resolved.source, MANIFEST_FIELDS, `${sourcePath}/source`);
          assertExtensions(resolved.source.extensions, `${sourcePath}/source/extensions`, supportedExtensions);
          validateEntrySyntax(resolved.source.body, `${sourcePath}/source/body`, { localIds: new Set(), maxSelectCases: limits.maxSelectCases, supportedExtensions });
          const parameters = new Map();
          for (const [name, schema] of Object.entries(resolved.source.parameters || {})) {
            const expression = entry.params?.[name] ?? schema.default;
            if (!expression) throw Object.assign(new Error(`Parameter ${name} is missing`), { code: 'unknown_parameter', sourcePath });
            const value = await resolveValue(expression, state.parameters, `${sourcePath}/params/${name}`);
            checkValue(value, schema, `${sourcePath}/params/${name}`);
            parameters.set(name, value);
          }
          for (const name of Object.keys(entry.params || {})) if (!Object.hasOwn(resolved.source.parameters || {}, name)) throw Object.assign(new Error(`Unknown parameter ${name}`), { code: 'unknown_parameter', sourcePath: `${sourcePath}/params/${name}` });
          for (const name of Object.keys(entry.slots || {})) if (!Object.hasOwn(resolved.source.slots || {}, name)) throw Object.assign(new Error(`Unknown slot ${name}`), { code: 'unknown_slot', sourcePath: `${sourcePath}/slots/${name}` });
          const defaults = Object.fromEntries(Object.entries(resolved.source.slots || {}).map(([name, spec]) => [name, spec.defaults || []]));
          for (const [name, spec] of Object.entries(resolved.source.slots || {})) {
            assertFields(spec, new Set(['min', 'max', 'types', 'defaults']), `${sourcePath}/source/slots/${name}`);
            if (!Number.isInteger(spec.min) || !Number.isInteger(spec.max) || spec.min < 0 || spec.max > limits.maxChildrenPerSlot || spec.min > spec.max) throw Object.assign(new Error(`Slot ${name} has invalid limits`), { code: 'invalid_value', sourcePath });
          }
          const usedCallSlots = new Set();
          const expanded = await expand(resolved.source.body, { ...state, parameters, callSlots: entry.slots || {}, slotDefaults: defaults, slotSpecs: resolved.source.slots || {}, usedCallSlots, segments: [...state.segments, ['placement', entry.id]] }, `${sourcePath}/source/body`);
          for (const name of Object.keys(entry.slots || {})) if (!usedCallSlots.has(name)) throw Object.assign(new Error(`Slot ${name} was not inserted`), { code: 'unknown_slot', sourcePath: `${sourcePath}/slots/${name}` });
          return expanded;
        } catch (error) {
          if (!error.referenceChain) error.referenceChain = [...referenceChain];
          throw error;
        } finally {
          referenceChain.pop();
        }
      }

      const nodePath = [...state.segments, ['node', entry.id]];
      const node = { id: await recipeNodeId(recipe.id, nodePath), type: entry.node.type };
      if (usedIds.has(node.id)) throw Object.assign(new Error('Duplicate resolved identity'), { code: 'duplicate_id', sourcePath });
      usedIds.add(node.id);
      for (const field of ['data', 'props']) {
        if (entry.node[field]) {
          node[field] = {};
          for (const [name, expression] of Object.entries(entry.node[field])) node[field][name] = await resolveValue(expression, state.parameters, `${sourcePath}/node/${field}/${name}`);
        }
      }
      if (entry.node.presentation) {
        node.presentation = {};
        for (const [name, expression] of Object.entries(entry.node.presentation)) node.presentation[name] = await resolveValue(expression, state.parameters, `${sourcePath}/node/presentation/${name}`);
      }
      if (entry.node.bindings) {
        node.bindings = [];
        for (const binding of entry.node.bindings) {
          const declaration = recipe.inputs?.[binding.input];
          if (declaration?.kind !== 'content' || !entry.node.data?.[binding.target] || entry.node.data[binding.target].input !== binding.input) throw Object.assign(new Error('Binding must match content data input'), { code: 'invalid_value', sourcePath });
          const input = await readInput(binding.input, `${sourcePath}/node/bindings/${binding.target}`);
          node.bindings.push({ owner: input.receipt.origin.owner, ref: input.receipt.origin.ref, target: binding.target, revision: input.receipt.origin.revision });
        }
      }
      if (entry.node.extensions) node.extensions = copyExtensions(entry.node.extensions);
      if (entry.node.slots) {
        node.slots = {};
        for (const [slotName, entries] of Object.entries(entry.node.slots)) {
          const children = [];
          for (let index = 0; index < entries.length; index += 1) children.push(await expand(entries[index], { ...state, segments: [...nodePath, ['slot', slotName]] }, `${sourcePath}/node/slots/${slotName}/${index}`));
          node.slots[slotName] = children.flat();
          if (node.slots[slotName].length > limits.maxChildrenPerSlot) throw Object.assign(new RangeError('Slot child limit exceeded'), { code: 'limit_exceeded', sourcePath });
        }
      }
      limitsState.nodes += 1;
      if (limitsState.nodes > limits.maxOutputNodes) throw Object.assign(new RangeError('Output node limit exceeded'), { code: 'limit_exceeded', sourcePath });
      limitsState.intermediateBytes += utf8Size(node);
      if (limitsState.intermediateBytes > limits.maxIntermediateBytes) throw Object.assign(new RangeError('Intermediate byte limit exceeded'), { code: 'limit_exceeded', sourcePath });
      return node;
    };

    const root = await expand(recipe.root, { parameters: new Map(), callSlots: {}, slotDefaults: {}, segments: [] }, '/root');
    if (Array.isArray(root)) throw Object.assign(new Error('Root must resolve to one node'), { code: 'invalid_resolved_document', sourcePath: '/root' });
    const document = { schema: 'simai.composition.document.v1', id: recipe.id, profile: recipe.profile, ...(recipe.locale ? { locale: recipe.locale } : {}), root };
    const outputDepth = (node) => 1 + Math.max(0, ...Object.values(node.slots || {}).flat().map(outputDepth));
    if (outputDepth(root) > limits.maxOutputDepth) throw Object.assign(new RangeError('Output depth limit exceeded'), { code: 'limit_exceeded', sourcePath: '/root' });
    const outputBytes = utf8Size(document);
    if (outputBytes > limits.maxOutputBytes) throw Object.assign(new RangeError('Output byte limit exceeded'), { code: 'limit_exceeded', sourcePath: '/root' });
    const { normalize } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "32dfc4431a24"));
    const normalized = await normalize(document, context.registry, { limits: { maxDocumentBytes: limits.maxOutputBytes, maxDepth: limits.maxOutputDepth, maxNodes: limits.maxOutputNodes, maxChildrenPerSlot: limits.maxChildrenPerSlot }, supportedExtensions: context.supportedExtensions });
    if (!normalized.document) throw Object.assign(new Error('Resolved document is invalid'), { code: 'invalid_resolved_document', sourcePath: '/root', details: normalized.diagnostics });
    const executionContract = context.executionContract;
    if (!executionContract?.contractDigest || !executionContract?.registryDigest || !executionContract?.rendererDigest) throw Object.assign(new Error('Execution contract is required'), { code: 'invalid_value', sourcePath: '/executionContract' });
    const dependencyReceipt = {
      schema: DEPENDENCIES_SCHEMA,
      scope,
      recipeDigest: recipeHash,
      documentDigest: `sha256:${normalized.digest}`,
      references,
      inputs: inputReceipts,
      logicalPointers,
      executionContract: { ...clone(executionContract), canonicalization: CANONICALIZATION },
    };
    return { document: normalized.document, dependencyReceipt, trace, diagnostics };
  } catch (error) {
    diagnostics.push(failure(error.code || 'source_error', error.sourcePath || '$', error.message || 'Recipe resolution failed', error.referenceChain || referenceChain));
    if (error.details) diagnostics.push(...error.details.map((entry) => ({ ...entry, sourcePath: entry.path || error.sourcePath || '$' })));
    return { document: null, dependencyReceipt: null, trace, diagnostics };
  }
}

const Recipe = Object.freeze({
  defaultLimits: RECIPE_DEFAULT_LIMITS,
  digest: recipeDigest,
  nodeId: recipeNodeId,
  parseJson: parseRecipeJson,
  resolve: resolveRecipe,
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Recipe);


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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/
/************************************************************************/
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "js/" + ({"80841737880868":"core-rules","88616323197113":"core-system","66700837013363":"core-loader","51805064141692":"smart-base"}[chunkId] || chunkId) + ".js";
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "css/core.css";
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		const inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			let script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					const s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/
/******/
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			const onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				const doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode?.removeChild(script);
/******/ 				doneFns?.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			const timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		let scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		const document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript?.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					let i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			20514231357218: 0
/******/ 		};
/******/
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				let installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							const promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/
/******/ 							// start chunk loading
/******/ 							const url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							const error = new Error();
/******/ 							const loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										const errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										const realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/
/******/ 		// no prefetching
/******/
/******/ 		// no preloaded
/******/
/******/ 		// no HMR
/******/
/******/ 		// no HMR manifest
/******/
/******/ 		// no on chunks loaded
/******/
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/
/******/ 		}
/******/
/******/ 		const chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c7a5006ae2e0");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6d5e21314f8e");


})();

/******/ })()
;