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
/* harmony import */ var _position_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("2e9112dbdda9");
/* harmony import */ var _preloader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("6c7f357fe960");







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
      background: (0,_preloader__WEBPACK_IMPORTED_MODULE_5__.getPreloaderBackground)(),
      modifier: 'loader-default',
      tempStyles: 'inset: 0;position: fixed;width: 100%;height: 100vh;opacity: 1;z-index: 1000;background-color: var(--sf-color--surface-highest, var(--sf-surface-0, #fff));text-align: center;',
      color: (0,_preloader__WEBPACK_IMPORTED_MODULE_5__.getPreloaderColor)(),
      width: _preloader__WEBPACK_IMPORTED_MODULE_5__.DEFAULT_PRELOADER.width,
      height: _preloader__WEBPACK_IMPORTED_MODULE_5__.DEFAULT_PRELOADER.height,
      content: '',
      delay: 300,
      ...(window.SF_BOOT_CONFIG?.preloader || {})
    };
    if (cfg.enabled === false || document.querySelector('.sf-loader')) return;
    const svgContent = cfg.content || (0,_preloader__WEBPACK_IMPORTED_MODULE_5__.createPreloaderContent)(cfg);
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
        (0,_preloader__WEBPACK_IMPORTED_MODULE_5__.stopPreloaderMotion)(preloaderWrap);
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
      (0,_preloader__WEBPACK_IMPORTED_MODULE_5__.startPreloaderMotion)(preloaderWrap, () => preloaderRun, cfg);
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

/***/ "14baf2d02711"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logicalSide: () => (/* binding */ logicalSide),
/* harmony export */   physicalPlacement: () => (/* binding */ physicalPlacement)
/* harmony export */ });
// Pure logical ⇄ physical placement mapping for SF.Position. No DOM and no
// dependencies, so it is testable without Floating UI installed.
const SIDES = ['block-start', 'block-end', 'inline-start', 'inline-end'];
const ALIGNS = ['start', 'center', 'end'];
/** Maps a logical side and alignment to a Floating UI placement. */

function physicalPlacement(side = 'block-end', align = 'start', rtl = false) {
  if (!SIDES.includes(side)) throw new TypeError(`Unknown placement side: ${side}`);
  if (!ALIGNS.includes(align)) throw new TypeError(`Unknown placement alignment: ${align}`);
  const physical = side === 'block-start' ? 'top' : side === 'block-end' ? 'bottom' : side === 'inline-start' ? rtl ? 'right' : 'left' : rtl ? 'left' : 'right'; // Floating UI mirrors start/end alignment itself for right-to-left elements.

  return align === 'center' ? physical : `${physical}-${align}`;
}
/** Maps a Floating UI placement back to the logical side. */

function logicalSide(placement, rtl = false) {
  const physical = String(placement).split('-')[0];
  if (physical === 'top') return 'block-start';
  if (physical === 'bottom') return 'block-end';
  if (physical === 'left') return rtl ? 'inline-end' : 'inline-start';
  return rtl ? 'inline-start' : 'inline-end';
}

/***/ },

/***/ "2e9112dbdda9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   anchor: () => (/* binding */ anchor),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   resolveLength: () => (/* binding */ resolveLength)
/* harmony export */ });
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6d338aa773af");
/* harmony import */ var _position_placement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("14baf2d02711");
// One anchored-positioning contract for Framework floating surfaces (dropdown
// lists, date panels, menus, tooltips). Geometry comes from Floating UI; this
// module adds logical placements, Framework token lengths and the author's
// size caps, so every component opens, flips and shifts the same way.



function isRtl(element) {
  return getComputedStyle(element).direction === 'rtl';
}
/** Resolves a number or CSS length (tokens included) to pixels in context. */


function resolveLength(value, context = document.body) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string' || value.trim() === '') return 0;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;block-size:0;padding:0;border:0';
  probe.style.inlineSize = value;
  (context?.isConnected ? context : document.body).append(probe);
  const pixels = parseFloat(getComputedStyle(probe).width) || 0;
  probe.remove();
  return pixels;
}
/**
 * Keeps `floating` anchored to `reference`.
 * options: {side, align, offset, alignmentOffset, padding, flip, shift,
 *           matchWidth, fitHeight, autoUpdate, onPosition({side, placement, x, y})}
 * Returns {update(): Promise, stop(), side}.
 */

function anchor(reference, floating, options = {}) {
  if (!(reference instanceof Element) || !(floating instanceof HTMLElement)) {
    throw new TypeError('Anchored positioning needs a reference element and a floating element');
  }

  const settings = {
    side: 'block-end',
    align: 'start',
    offset: 'var(--sf-space-1\\/4)',
    alignmentOffset: 0,
    padding: 'var(--sf-space-1\\/2)',
    flip: true,
    shift: true,
    matchWidth: false,
    fitHeight: true,
    autoUpdate: true,
    onPosition: null,
    ...options
  }; // Inline styles this helper writes are restored on stop(); the author's caps
  // are kept, so viewport fitting may only tighten them.

  const written = ['position', 'left', 'top', 'right', 'bottom', 'margin', 'max-height', 'max-width', ...(settings.matchWidth ? ['width'] : [])];
  const saved = written.map(name => [name, floating.style.getPropertyValue(name), floating.style.getPropertyPriority(name)]);
  const authored = {
    maxHeight: floating.style.getPropertyValue('max-height')
  }; // Stylesheet caps (max-height, max-width) are read before this helper writes
  // inline values, so fitting the viewport never loosens them.

  const floatingStyle = getComputedStyle(floating);
  const computedCap = parseFloat(floatingStyle.maxHeight);
  const heightCap = Number.isFinite(computedCap) ? computedCap : Infinity;
  const computedWidthCap = parseFloat(floatingStyle.maxWidth);
  const widthCap = Number.isFinite(computedWidthCap) ? computedWidthCap : Infinity;
  const controller = {
    side: settings.side,
    stopped: false
  };
  let running = null;
  let pending = false;

  const run = async () => {
    const rtl = isRtl(reference);
    const gap = resolveLength(settings.offset, reference.parentElement);
    const padding = resolveLength(settings.padding, reference.parentElement); // Measure the natural size so flipping compares the real panel height.

    if (settings.fitHeight) floating.style.maxHeight = authored.maxHeight || ''; // alignmentOffset moves a start/end-aligned panel along its edge (mirrored
    // for end), e.g. so a tail points at the middle of a small trigger.

    const middleware = [(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.offset)({
      mainAxis: gap,
      alignmentAxis: resolveLength(settings.alignmentOffset, reference.parentElement)
    })];
    if (settings.flip) middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.flip)({
      padding,
      crossAxis: false
    })); // Shift before size: a panel near the inline edge moves inside the viewport
    // instead of being squeezed to the space left of its field.

    if (settings.shift) middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.shift)({
      padding,
      crossAxis: false
    }));
    middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.size)({
      padding,

      apply({
        availableWidth,
        availableHeight,
        rects,
        elements
      }) {
        if (controller.stopped) return;
        const viewportWidth = document.documentElement.clientWidth - padding * 2;
        if (settings.matchWidth) elements.floating.style.width = `${Math.max(0, Math.min(rects.reference.width, viewportWidth))}px`;
        elements.floating.style.maxWidth = `${Math.max(0, Math.min(availableWidth, viewportWidth, widthCap))}px`;
        if (settings.fitHeight) elements.floating.style.maxHeight = `${Math.max(0, Math.min(availableHeight, heightCap))}px`;
      }

    }));
    const result = await (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
      strategy: 'fixed',
      placement: (0,_position_placement_js__WEBPACK_IMPORTED_MODULE_1__.physicalPlacement)(settings.side, settings.align, rtl),
      middleware
    });
    if (controller.stopped) return result; // right/bottom are cleared so logical insets from the component stylesheet
    // (for example inset-inline-start in RTL) cannot over-constrain the box.

    Object.assign(floating.style, {
      position: 'fixed',
      left: `${result.x}px`,
      top: `${result.y}px`,
      right: 'auto',
      bottom: 'auto',
      margin: '0'
    });
    controller.side = (0,_position_placement_js__WEBPACK_IMPORTED_MODULE_1__.logicalSide)(result.placement, rtl);
    floating.dataset.sfSide = controller.side;
    settings.onPosition?.({
      side: controller.side,
      placement: result.placement,
      x: result.x,
      y: result.y
    });
    return result;
  }; // Coalesce bursts (scroll, resize, observers) into one computation at a time.


  controller.update = () => {
    if (controller.stopped) return Promise.resolve(null);

    if (running) {
      pending = true;
      return running;
    }

    running = run().finally(() => {
      running = null;

      if (pending && !controller.stopped) {
        pending = false;
        controller.update();
      }
    });
    return running;
  };

  const cleanup = settings.autoUpdate ? (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoUpdate)(reference, floating, controller.update) : null;

  controller.stop = () => {
    controller.stopped = true;
    cleanup?.();
    delete floating.dataset.sfSide;

    for (const [name, value, priority] of saved) {
      if (value) floating.style.setProperty(name, value, priority);else floating.style.removeProperty(name);
    }
  };

  if (!settings.autoUpdate) controller.update();
  return controller;
}
const Position = Object.freeze({
  anchor,
  logicalSide: _position_placement_js__WEBPACK_IMPORTED_MODULE_1__.logicalSide,
  physicalPlacement: _position_placement_js__WEBPACK_IMPORTED_MODULE_1__.physicalPlacement,
  resolveLength
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Position) globalThis.SF.Position = Position;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Position);

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

/***/ "b4b2e395e4eb"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("56345afd9e11");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  if (alignment) {
    coords[alignmentAxis] += commonAlign * (alignment === 'end' ? 1 : -1) * (rtl && isVertical ? -1 : 1);
  }
  return coords;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) && (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

// Maximum number of resets that can occur before bailing to avoid infinite reset loops.
const MAX_RESET_COUNT = 50;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const platformWithDetectOverflow = platform.detectOverflow ? platform : {
    ...platform,
    detectOverflow
  };
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData[name] = {
      ...middlewareData[name],
      ...data
    };
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(minPadding, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects,
        platform
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);

      // No rects (e.g. a hidden or detached reference, or a collapsed range) —
      // keep the existing reference rect rather than resetting to an invalid
      // one with non-finite values.
      if (!nativeClientRects.length) {
        return {};
      }
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && (clientRects[0].left > clientRects[1].right || clientRects[1].left > clientRects[0].right) && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
              x: left,
              y: top,
              width: right - left,
              height: bottom - top
            });
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
            x: minLeft,
            y: top,
            width: maxRight - minLeft,
            height: bottom - top
          });
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const clampCoord = (axis, coord) => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(coord + overflow[axis === 'y' ? 'top' : 'left'], coord, coord - overflow[axis === 'y' ? 'bottom' : 'right']);
      if (checkMainAxis) {
        mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
      }
      if (checkCrossAxis) {
        crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      var _rawOffset$mainAxis, _rawOffset$crossAxis;
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
        crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

// Method syntax keeps callback parameters bivariant, but expressing the
// explicit `| undefined` required by `exactOptionalPropertyTypes` needs
// property syntax, which is contravariant under `strictFunctionTypes`.
// Extracting the function from a method position restores that bivariance so
// consumers can still assign callbacks with narrower parameter types.

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const shiftData = state.middlewareData.shift;
      const noShift = !shiftData;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (shiftData != null && shiftData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if (shiftData != null && shiftData.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        if (isYAxis) {
          availableWidth = width - 2 * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right);
        } else {
          availableHeight = height - 2 * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom);
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ },

/***/ "6d338aa773af"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* empty/unused harmony star reexport */
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b4b2e395e4eb");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("56345afd9e11");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d7f28916ed76");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(width) !== offsetWidth || (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  return !!floatingOffsetParent && isFixed && floatingOffsetParent === (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement && offsetParent) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(domElement);
    const offsetWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    while (currentIFrame && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return element.getClientRects ? Array.from(element.getClientRects()) : [];
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(html) {
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(html);
  const body = html.ownerDocument.body;
  const width = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(html);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
  if (rootBoundary === void 0) {
    rootBoundary = 'viewport';
  }
  const isLayoutViewport = rootBoundary === 'layoutViewport';
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    // Client coordinates are relative to the layout viewport, except in
    // WebKit with an `absolute` strategy, where they are relative to the
    // visual viewport.
    const layoutRelativeClientCoords = !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || strategy === 'fixed';
    if (isLayoutViewport) {
      if (!layoutRelativeClientCoords) {
        x = -visualViewport.offsetLeft;
        y = -visualViewport.offsetTop;
      }
    } else {
      width = visualViewport.width;
      height = visualViewport.height;
      if (layoutRelativeClientCoords) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  // `scrollbar-gutter: stable` on the <html> reserves gutter space that shrinks
  // the visual width but isn't reflected in `html.clientWidth`, so subtract it.
  // Only the inline-end (right) gutter can hold the scrollbar; `both-edges` also
  // reserves an empty inline-start gutter that clips nothing, so exclude just
  // the one scrollbar-side gutter — halve the measured (two-gutter) total. A
  // left-side scrollbar (`windowScrollbarX > 0`) is already handled by
  // `getHTMLOffset`/`visualViewport.width`; skip it here.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    const gutter = getComputedStyle(html).scrollbarGutter === 'stable both-edges' ? reservedWidth / 2 : reservedWidth;
    if (gutter <= SCROLLBAR_MAX) {
      width -= gutter;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = getScale(element);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport' || clippingAncestor === 'layoutViewport') {
    rect = getViewportRect(element, strategy, clippingAncestor);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)(rect);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(el) !== 'body');
  let lastKeptComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(currentNode);
    // Position of the containing block chain below the current node. A fixed
    // element whose containing block hasn't been found yet is a fixed chain.
    const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? 'fixed' : '';

    // A non-containing ancestor does not clip the element when the chain
    // below it escapes it: a fixed chain escapes all ancestors up to the
    // next containing block, an absolute chain escapes static ancestors.
    const shouldDropCurrentNode = !currentNodeIsContaining && (lastPosition === 'fixed' || lastPosition === 'absolute' && computedStyle.position === 'static');
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // The kept node carries the chain position for the next iteration.
      lastKeptComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.top, top);
    right = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.right, right);
    bottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.bottom, bottom);
    left = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  if (isOffsetParentAnElement || !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  if (!isOffsetParentAnElement && documentElement) {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove, ancestorResize) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(top);
    const insetRight = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(0, (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;

      // The entry is a snapshot, so the reference may have moved since the
      // intersection was computed (under performance constraints, or between
      // consecutive frames of a multi-frame layout shift). The reported ratio
      // and the observed area are stale in that case and cannot be trusted to
      // detect subsequent movement, so refresh regardless of the ratio.
      if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        return refresh();
      }
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped in place, the ratio is 0. Throttle
          // the refresh to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  // The window is a resize ancestor, so when `ancestorResize` is enabled its
  // listener already runs the update on resize. Here we only need to rebuild
  // the `IntersectionObserver` for the new root size, skipping a redundant
  // update. When `ancestorResize` is disabled, this becomes the sole update.
  const handleResize = () => refresh(ancestorResize);
  win.addEventListener('resize', handleResize);
  refresh(true);
  return () => {
    win.removeEventListener('resize', handleResize);
    cleanup();
  };
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(referenceEl) : []), ...(floating ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(floating) : [])] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update);
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    if (floating) {
      resizeObserver.observe(floating);
    }
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = options != null ? options : {};
  const platformWithCache = {
    ...platform,
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ },

/***/ "d7f28916ed76"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== 'inline' && display !== 'contents';
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(':popover-open')) {
      return true;
    }
  } catch (_e) {
    // no-op
  }
  try {
    return element.matches(':modal');
  } catch (_e) {
    return false;
  }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = value => !!value && value !== 'none';
let isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || '') || containRe.test(css.contain || '');
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none');
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return (node.ownerDocument || node).body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ },

/***/ "56345afd9e11"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === 't' || firstChar === 'b' ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes('start') ? placement.replace('start', 'end') : placement.replace('end', 'start');
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  var _padding$top, _padding$right, _padding$bottom, _padding$left;
  return {
    top: (_padding$top = padding.top) != null ? _padding$top : 0,
    right: (_padding$right = padding.right) != null ? _padding$right : 0,
    bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
    left: (_padding$left = padding.left) != null ? _padding$left : 0
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




/***/ },

/***/ "08e5033c490a"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_EDITOR_MANIFESTS: () => (/* binding */ BUILTIN_EDITOR_MANIFESTS),
/* harmony export */   BUILTIN_PORT_MANIFESTS: () => (/* binding */ BUILTIN_PORT_MANIFESTS),
/* harmony export */   BUILTIN_TYPE_MANIFESTS: () => (/* binding */ BUILTIN_TYPE_MANIFESTS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("68efac8c1b57");


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

const routeEnd = {
          type: 'object',
          required: ['endpoint', 'port'],
          additionalProperties: false,
          properties: {
            endpoint: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,31}$' },
            port: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,31}$' },
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
  {
    schema: 'simai.composition.type-manifest.v1',
    type: 'layout.regions',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: emptyObjectSchema,
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {
      regions: { min: 1, max: 12, types: ['layout.region'] },
    },
    renderer: { kind: 'builtin', name: 'layout.regions' },
    assets: [],
    capabilities: ['html', 'regions'],
  },
  {
    schema: 'simai.composition.type-manifest.v1',
    type: 'layout.region',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: {
      type: 'object',
      required: ['name', 'landmark'],
      additionalProperties: false,
      properties: {
        name: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,31}$' },
        landmark: { enum: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_LANDMARKS] },
        placement: { enum: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_PLACEMENTS] },
        label: { type: 'string', minLength: 1, maxLength: 120 },
        sticky: { type: 'boolean' },
        accepts: { type: 'array', minItems: 1, uniqueItems: true, items: { enum: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_ACCEPTS] } },
        min_items: { type: 'integer', minimum: 0, maximum: 500 },
        max_items: { type: 'integer', minimum: 0, maximum: 500 },
      },
    },
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {
      default: { min: 0, max: 500, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.region' },
    assets: [],
    capabilities: ['html', 'regions'],
  },  {
    schema: 'simai.composition.type-manifest.v1',
    type: 'layout.scope',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: {
      type: 'object',
      required: ['routes'],
      additionalProperties: false,
      properties: {
        routes: {
          type: 'array',
          minItems: 1,
          maxItems: 32,
          items: {
            type: 'object',
            required: ['id', 'from', 'to'],
            additionalProperties: false,
            properties: {
              id: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,63}$' },
              from: routeEnd,
              to: routeEnd,
            },
          },
        },
      },
    },
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {
      default: { min: 1, max: 500, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.scope' },
    assets: [],
    capabilities: ['html', 'hydration', 'routing'],
  },
]);

// Published typed ports. Framework owns the element protocol; the product owns
// what a request means, data access and authorization.
const BUILTIN_PORT_MANIFESTS = Object.freeze([
  {
    schema: 'simai.composition.port-manifest.v1',
    element: 'sf-table',
    version: '1.0.0',
    component: 'smart.data-view',
    component_version: '1.2.0',
    outputs: {
      selection: {
        value: 'record-ids.v1',
        summary: 'Explicit current-result selection of this instance, emitted once per change, including clearing.',
      },
    },
    inputs: {
      context: {
        value: 'record-ids.v1',
        effect: 'request',
        summary: 'Restricts this collection to records related to the given identities. The table clears its selection, enters loading and emits sf-table-query-intent with the route sequence; the host resolves the relation and access and answers with applyQueryResult.',
        request_event: 'sf-table-query-intent',
        result_method: 'applyQueryResult',
      },
    },
  },
]);



const BUILTIN_EDITOR_MANIFESTS = Object.freeze([
  {
    schema: 'simai.composition.editor-manifest.v1',
    type: 'layout.section',
    type_version: '1.0.0',
    fields: [
      {
        key: 'surface',
        plane: 'presentation',
        target: 'preset',
        property: { type: 'string', version: 2 },
        constraints: { min_length: 1, max_length: 32 },
        group: 'preset',
        visibility: 'visible',
        choices: ['surface', 'contrast'],
        default: 'surface',
        label_key: 'sf.composition.layout_section.surface',
        help_key: 'sf.composition.layout_section.surface_help',
        capability_hints: ['composition.presentation.preset'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
    ],
  },
  {
    schema: 'simai.composition.editor-manifest.v1',
    type: 'layout.columns',
    type_version: '1.0.0',
    fields: [
      {
        key: 'columns',
        plane: 'props',
        target: 'columns',
        property: { type: 'integer', version: 1 },
        constraints: { min: 1, max: 12 },
        group: 'basic',
        visibility: 'visible',
        default: 2,
        label_key: 'sf.composition.layout_columns.columns',
        help_key: 'sf.composition.layout_columns.columns_help',
        capability_hints: ['composition.props.columns'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
    ],
  },
  {
    schema: 'simai.composition.editor-manifest.v1',
    type: 'content.heading',
    type_version: '1.0.0',
    fields: [
      {
        key: 'level',
        plane: 'data',
        target: 'level',
        property: { type: 'integer', version: 1 },
        constraints: { min: 1, max: 6 },
        group: 'advanced',
        visibility: 'collapsed',
        default: 2,
        label_key: 'sf.composition.content_heading.level',
        help_key: 'sf.composition.content_heading.level_help',
        capability_hints: ['composition.data.level'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
    ],
  },  {
    schema: 'simai.composition.editor-manifest.v1',
    type: 'layout.region',
    type_version: '1.0.0',
    fields: [
      {
        key: 'placement',
        plane: 'props',
        target: 'placement',
        property: { type: 'string', version: 2 },
        constraints: { min_length: 1, max_length: 16 },
        group: 'basic',
        visibility: 'visible',
        choices: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_PLACEMENTS],
        default: 'block',
        label_key: 'sf.composition.layout_region.placement',
        help_key: 'sf.composition.layout_region.placement_help',
        capability_hints: ['composition.props.placement'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
      {
        key: 'label',
        plane: 'props',
        target: 'label',
        property: { type: 'string', version: 2 },
        constraints: { min_length: 1, max_length: 120 },
        group: 'basic',
        visibility: 'visible',
        label_key: 'sf.composition.layout_region.label',
        help_key: 'sf.composition.layout_region.label_help',
        capability_hints: ['composition.props.label'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
      {
        key: 'landmark',
        plane: 'props',
        target: 'landmark',
        property: { type: 'string', version: 2 },
        constraints: { min_length: 1, max_length: 16 },
        group: 'advanced',
        visibility: 'collapsed',
        choices: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_LANDMARKS],
        label_key: 'sf.composition.layout_region.landmark',
        help_key: 'sf.composition.layout_region.landmark_help',
        capability_hints: ['composition.props.landmark'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
      {
        key: 'sticky',
        plane: 'props',
        target: 'sticky',
        property: { type: 'boolean', version: 1 },
        constraints: {},
        group: 'advanced',
        visibility: 'collapsed',
        default: false,
        label_key: 'sf.composition.layout_region.sticky',
        help_key: 'sf.composition.layout_region.sticky_help',
        capability_hints: ['composition.props.sticky'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
    ],
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

/***/ "3765e2c966fd"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   projectDocumentEditorFields: () => (/* binding */ projectDocumentEditorFields),
/* harmony export */   projectEditorFields: () => (/* binding */ projectEditorFields),
/* harmony export */   validateEditorManifest: () => (/* binding */ validateEditorManifest)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");


const SCHEMA = 'simai.composition.editor-manifest.v1';
const MANIFEST_FIELDS = new Set(['schema', 'type', 'type_version', 'applies_to', 'fields']);
const APPLIES_FIELDS = new Set(['views', 'presets', 'modifiers']);
const FIELD_FIELDS = new Set([
  'key', 'plane', 'target', 'property', 'constraints', 'group', 'visibility',
  'choices', 'default', 'label_key', 'help_key', 'capability_hints',
  'permission_hints', 'owner',
]);
const PROPERTY_FIELDS = new Set(['type', 'version']);
const PLANES = new Set(['props', 'data', 'presentation']);
const GROUPS = new Set(['preset', 'basic', 'advanced']);
const VISIBILITIES = new Set(['visible', 'collapsed', 'hidden']);
const PRESENTATION_TARGETS = new Set(['view', 'preset']);
const FORBIDDEN_KEYS = new Set([
  'actor', 'authorization', 'class', 'classname', 'cookie', 'endpoint', 'eval',
  'expression', 'function', 'handler', 'html', 'innerhtml', 'javascript', 'method',
  'password', 'php', 'query', 'request', 'script', 'secret', 'sql', 'token',
]);

const diagnostic = (code, path, message) => ({ code, path, message });
const stableKey = (value) => typeof value === 'string' && /^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)*$/u.test(value);
const componentType = (value) => typeof value === 'string' && /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/u.test(value);
const version = (value) => typeof value === 'string' && /^[0-9]+\.[0-9]+\.[0-9]+$/u.test(value);
const owner = (value) => typeof value === 'string' && /^[a-z][a-z0-9.-]*\/[a-z][a-z0-9.-]*$/u.test(value);
const scalar = (value) => value === null
  || typeof value === 'string'
  || typeof value === 'boolean'
  || (typeof value === 'number' && Number.isFinite(value));
const forbiddenIdentity = (value) => typeof value === 'string'
  && value.split('.').some((part) => FORBIDDEN_KEYS.has(part.toLowerCase().replaceAll('-', '').replaceAll('_', '')));

function unknownFields(value, allowed, path, diagnostics) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) diagnostics.push(diagnostic('editor_unknown_field', `${path}.${key}`, `Unknown editor field ${key}`));
  }
}

function scanForbidden(value, path, diagnostics) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanForbidden(entry, `${path}[${index}]`, diagnostics));
    return;
  }
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    const normalized = key.toLowerCase().replaceAll('-', '').replaceAll('_', '');
    if (FORBIDDEN_KEYS.has(normalized)) {
      diagnostics.push(diagnostic('editor_executable_or_secret_field_forbidden', `${path}.${key}`, `Field ${key} is not portable editor metadata`));
    }
    scanForbidden(entry, `${path}.${key}`, diagnostics);
  }
}

function propertyIdentities(propertyTypes) {
  if (propertyTypes === undefined) return null;
  const identities = new Set();
  for (const entry of propertyTypes) {
    if (typeof entry === 'string') identities.add(entry);
    else if ((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(entry)) identities.add(`${entry.type}@${entry.version}`);
  }
  return identities;
}

function validateHintList(value, path, diagnostics) {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.length > 50 || value.some((entry) => !stableKey(entry)) || new Set(value).size !== value.length) {
    diagnostics.push(diagnostic('editor_hint_list_invalid', path, 'Hints must be a bounded unique stable-key list'));
  }
}

function selectionValues(typeManifest, target) {
  if (target === 'view') return typeManifest.presentation?.views || [];
  if (target === 'preset') return typeManifest.presentation?.presets || [];
  return [];
}

function validateAppliesTo(value, typeManifest, diagnostics) {
  if (value === undefined) return;
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) {
    diagnostics.push(diagnostic('editor_applies_to_invalid', '$.applies_to', 'applies_to must be an object'));
    return;
  }
  unknownFields(value, APPLIES_FIELDS, '$.applies_to', diagnostics);
  for (const [key, registeredKey] of [['views', 'views'], ['presets', 'presets'], ['modifiers', 'modifiers']]) {
    if (value[key] === undefined) continue;
    if (!Array.isArray(value[key]) || value[key].length === 0 || value[key].some((entry) => typeof entry !== 'string') || new Set(value[key]).size !== value[key].length) {
      diagnostics.push(diagnostic('editor_applies_to_invalid', `$.applies_to.${key}`, `${key} must be a non-empty unique string list`));
      continue;
    }
    const registered = new Set(typeManifest.presentation?.[registeredKey] || []);
    for (const entry of value[key]) {
      if (!registered.has(entry)) diagnostics.push(diagnostic('editor_presentation_choice_unknown', `$.applies_to.${key}`, `${entry} is not registered by the type manifest`));
    }
  }
}

function validateEditorManifest(editorManifest, typeManifest, options = {}) {
  const diagnostics = [];
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(editorManifest)) return { valid: false, diagnostics: [diagnostic('editor_manifest_invalid', '$', 'Editor manifest must be an object')] };
  unknownFields(editorManifest, MANIFEST_FIELDS, '$', diagnostics);
  scanForbidden(editorManifest, '$', diagnostics);
  if (editorManifest.schema !== SCHEMA) diagnostics.push(diagnostic('editor_schema_unknown', '$.schema', `Expected ${SCHEMA}`));
  if (!componentType(editorManifest.type)) diagnostics.push(diagnostic('editor_type_invalid', '$.type', 'Component type is invalid'));
  if (!version(editorManifest.type_version)) diagnostics.push(diagnostic('editor_type_version_invalid', '$.type_version', 'Component type version is invalid'));
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(typeManifest) || typeManifest.type !== editorManifest.type || typeManifest.version !== editorManifest.type_version) {
    diagnostics.push(diagnostic('editor_type_registration_mismatch', '$.type', 'Editor manifest must bind one exact registered type revision'));
  }
  validateAppliesTo(editorManifest.applies_to, typeManifest || {}, diagnostics);
  if (!Array.isArray(editorManifest.fields) || editorManifest.fields.length > 200) {
    diagnostics.push(diagnostic('editor_fields_invalid', '$.fields', 'fields must be a bounded array'));
    return { valid: false, diagnostics };
  }

  const keys = new Set();
  const destinations = new Set();
  const availablePropertyTypes = propertyIdentities(options.propertyTypes);
  editorManifest.fields.forEach((field, index) => {
    const path = `$.fields[${index}]`;
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field)) {
      diagnostics.push(diagnostic('editor_field_invalid', path, 'Editor field must be an object'));
      return;
    }
    unknownFields(field, FIELD_FIELDS, path, diagnostics);
    if (!stableKey(field.key)) diagnostics.push(diagnostic('editor_field_key_invalid', `${path}.key`, 'Field key must be stable'));
    else if (keys.has(field.key)) diagnostics.push(diagnostic('editor_field_key_duplicate', `${path}.key`, `Duplicate field key ${field.key}`));
    else keys.add(field.key);
    if (!PLANES.has(field.plane)) diagnostics.push(diagnostic('editor_plane_unknown', `${path}.plane`, 'Field plane is unknown'));
    if (!stableKey(field.target)) diagnostics.push(diagnostic('editor_target_invalid', `${path}.target`, 'Field target must be stable'));
    if (forbiddenIdentity(field.key)) diagnostics.push(diagnostic('editor_executable_or_secret_field_forbidden', `${path}.key`, 'Field key names executable or secret data'));
    if (forbiddenIdentity(field.target)) diagnostics.push(diagnostic('editor_executable_or_secret_field_forbidden', `${path}.target`, 'Field target names executable or secret data'));
    const destination = `${field.plane}.${field.target}`;
    if (destinations.has(destination)) diagnostics.push(diagnostic('editor_destination_duplicate', `${path}.target`, `Duplicate destination ${destination}`));
    else destinations.add(destination);
    if (!GROUPS.has(field.group)) diagnostics.push(diagnostic('editor_group_unknown', `${path}.group`, 'Field group is unknown'));
    if (!VISIBILITIES.has(field.visibility)) diagnostics.push(diagnostic('editor_visibility_unknown', `${path}.visibility`, 'Field visibility is unknown'));
    if (!stableKey(field.label_key)) diagnostics.push(diagnostic('editor_label_key_invalid', `${path}.label_key`, 'Localization key must be stable'));
    if (field.help_key !== undefined && !stableKey(field.help_key)) diagnostics.push(diagnostic('editor_help_key_invalid', `${path}.help_key`, 'Help localization key must be stable'));
    validateHintList(field.capability_hints, `${path}.capability_hints`, diagnostics);
    validateHintList(field.permission_hints, `${path}.permission_hints`, diagnostics);
    if (!owner(field.owner)) diagnostics.push(diagnostic('editor_owner_invalid', `${path}.owner`, 'Owner must be a portable owner id'));
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field.constraints)) diagnostics.push(diagnostic('editor_constraints_invalid', `${path}.constraints`, 'Constraints must be an object'));

    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field.property)) diagnostics.push(diagnostic('editor_property_invalid', `${path}.property`, 'Property identity must be an object'));
    else {
      unknownFields(field.property, PROPERTY_FIELDS, `${path}.property`, diagnostics);
      if (!stableKey(field.property.type)) diagnostics.push(diagnostic('editor_property_type_invalid', `${path}.property.type`, 'Property type must be stable'));
      if (!Number.isInteger(field.property.version) || field.property.version < 1) diagnostics.push(diagnostic('editor_property_version_invalid', `${path}.property.version`, 'Property version must be positive'));
      if (availablePropertyTypes && !availablePropertyTypes.has(`${field.property.type}@${field.property.version}`)) {
        diagnostics.push(diagnostic('editor_property_registration_unknown', `${path}.property`, 'Property type and version are not registered by the host'));
      }
    }

    if (field.choices !== undefined && (!Array.isArray(field.choices) || field.choices.length === 0 || field.choices.length > 200 || field.choices.some((entry) => !scalar(entry)) || new Set(field.choices.map(_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)).size !== field.choices.length)) {
      diagnostics.push(diagnostic('editor_choices_invalid', `${path}.choices`, 'Choices must be a bounded unique scalar list'));
    }
    if ('default' in field && !scalar(field.default)) diagnostics.push(diagnostic('editor_default_invalid', `${path}.default`, 'Default must be scalar'));
    if ('default' in field && Array.isArray(field.choices) && !field.choices.some((choice) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(choice) === (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(field.default))) {
      diagnostics.push(diagnostic('editor_default_choice_unknown', `${path}.default`, 'Default must be one of the allowed choices'));
    }

    if (field.plane === 'presentation') {
      if (!PRESENTATION_TARGETS.has(field.target)) diagnostics.push(diagnostic('editor_presentation_target_unsupported', `${path}.target`, 'Only view and preset are scalar editable presentation targets'));
      const registered = new Set(selectionValues(typeManifest || {}, field.target));
      for (const choice of field.choices || []) {
        if (typeof choice !== 'string' || !registered.has(choice)) diagnostics.push(diagnostic('editor_presentation_choice_unknown', `${path}.choices`, `${String(choice)} is not registered by the type manifest`));
      }
    } else if (PLANES.has(field.plane) && (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(typeManifest)) {
      const schema = field.plane === 'props' ? typeManifest.props_schema : typeManifest.data_schema;
      if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(schema?.properties) || !(field.target in schema.properties)) diagnostics.push(diagnostic('editor_destination_unknown', `${path}.target`, `${destination} is not declared by the type manifest`));
    }
  });
  return { valid: diagnostics.length === 0, diagnostics };
}

function nodeValue(node, field) {
  const plane = node?.[field.plane];
  if ((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(plane) && field.target in plane) return { value: plane[field.target], source: 'node' };
  if ('default' in field) return { value: field.default, source: 'default' };
  return { value: null, source: 'unset' };
}

function projectEditorFields(editorManifest, typeManifest, node, options = {}) {
  const checked = validateEditorManifest(editorManifest, typeManifest, options);
  if (!checked.valid) return { valid: false, fields: [], diagnostics: checked.diagnostics };
  const diagnostics = [];
  const fields = editorManifest.fields.map((field) => {
    const current = nodeValue(node, field);
    if (current.source !== 'unset' && field.choices && !field.choices.some((choice) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(choice) === (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(current.value))) {
      diagnostics.push(diagnostic('editor_choice_unknown', `node:${node?.id || ''}.${field.plane}.${field.target}`, 'Current value is not an allowed choice'));
    }
    return (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)({ ...field, destination: `${field.plane}.${field.target}`, ...current });
  });
  return { valid: diagnostics.length === 0, fields, diagnostics };
}

function projectDocumentEditorFields(document, typeRegistry, editorManifests, options = {}) {
  const byType = new Map();
  for (const manifest of editorManifests || []) {
    const identity = `${manifest.type}@${manifest.type_version}`;
    if (byType.has(identity)) return { valid: false, instances: [], diagnostics: [diagnostic('editor_manifest_duplicate', '$', `Duplicate editor manifest ${identity}`)] };
    byType.set(identity, manifest);
  }
  const instances = [];
  const diagnostics = [];
  const visit = (node) => {
    const typeManifest = typeRegistry?.types instanceof Map ? typeRegistry.types.get(node.type) : undefined;
    if (typeManifest) {
      const editorManifest = byType.get(`${typeManifest.type}@${typeManifest.version}`);
      if (editorManifest) {
        const projected = projectEditorFields(editorManifest, typeManifest, node, options);
        diagnostics.push(...projected.diagnostics.map((entry) => ({ ...entry, instance: node.id })));
        instances.push({ id: node.id, type: node.type, fields: projected.fields });
      }
    }
    for (const children of Object.values(node.slots || {})) for (const child of children) visit(child);
  };
  if (document?.root) visit(document.root);
  return { valid: diagnostics.length === 0, instances, diagnostics };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ projectDocumentEditorFields, projectEditorFields, validateEditorManifest });


/***/ },

/***/ "4e6fc63bed81"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_FIELD_KINDS: () => (/* binding */ BUILTIN_FIELD_KINDS),
/* harmony export */   applyFieldValue: () => (/* binding */ applyFieldValue),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fieldKindRegistry: () => (/* binding */ fieldKindRegistry),
/* harmony export */   parseFieldSubmission: () => (/* binding */ parseFieldSubmission),
/* harmony export */   renderFieldFallback: () => (/* binding */ renderFieldFallback),
/* harmony export */   resolveFieldKind: () => (/* binding */ resolveFieldKind),
/* harmony export */   validateFieldKinds: () => (/* binding */ validateFieldKinds),
/* harmony export */   validateFieldValue: () => (/* binding */ validateFieldValue)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");


// Editor field kinds. A kind is derived from the exact host Property identity
// and the presence of choices in a simai.composition.editor-manifest.v1 field;
// the editor manifest schema is unchanged. Each kind fixes value schema,
// default, normalization, validation, accessibility, themes, localization and
// the server-rendered fallback control. Hosts keep persistence and access.

const STABLE_SEGMENT = /^[a-z][a-z0-9_]*$/u;
const INTEGER_TEXT = /^-?(?:0|[1-9][0-9]*)$/u;

const BUILTIN_FIELD_KINDS = Object.freeze([
  {
    schema: 'simai.composition.editor-field-kind.v1',
    kind: 'choice',
    version: 1,
    status: 'formalized-existing',
    match: { property: [{ type: 'string', version: 1 }, { type: 'string', version: 2 }], choices: 'required' },
    value_schema: { type: 'string', minLength: 1 },
    default: { kind: null, field: 'must-be-a-choice' },
    constraints: { allowed: ['min_length', 'max_length'] },
    normalization: { form: 'exact-string', unset: 'absent-field', stored: 'value' },
    validation: ['choice-member'],
    accessibility: { control: 'select', role: 'combobox', name: 'label_key', description: 'help_key via aria-describedby', keyboard: ['Tab', 'ArrowUp', 'ArrowDown', 'Enter', 'Space', 'Escape'] },
    themes: { modes: ['light', 'dark'], tokens: ['--sf-surface-1', '--sf-on-surface', '--sf-outline', '--sf-primary'], contrast: 'WCAG 2.2 AA' },
    localization: { label: 'label_key', help: 'help_key', value_labels: '<label_key>.<choice> when the choice is a stable segment, otherwise the raw choice', direction: 'logical' },
    server_fallback: { element: 'select', value: 'option value', enhanced_control: 'sf-dropdown' },
  },
  {
    schema: 'simai.composition.editor-field-kind.v1',
    kind: 'integer',
    version: 1,
    status: 'formalized-existing',
    match: { property: [{ type: 'integer', version: 1 }], choices: 'forbidden' },
    value_schema: { type: 'integer', minimum: -9007199254740991, maximum: 9007199254740991 },
    default: { kind: null, field: 'must-satisfy-constraints' },
    constraints: { allowed: ['min', 'max'], required: ['min', 'max'] },
    normalization: { form: 'decimal-integer-text', unset: 'empty-text', stored: 'safe-integer' },
    validation: ['integer-text', 'range'],
    accessibility: { control: 'input[type=number]', role: 'spinbutton', name: 'label_key', description: 'help_key via aria-describedby', keyboard: ['Tab', 'ArrowUp', 'ArrowDown', 'digits'] },
    themes: { modes: ['light', 'dark'], tokens: ['--sf-surface-1', '--sf-on-surface', '--sf-outline', '--sf-primary'], contrast: 'WCAG 2.2 AA' },
    localization: { label: 'label_key', help: 'help_key', value_labels: 'none', direction: 'logical', digits: 'ASCII decimal' },
    server_fallback: { element: 'input', type: 'number', attributes: ['min', 'max', 'step=1', 'inputmode=numeric'], enhanced_control: 'sf-input' },
  },
  {
    schema: 'simai.composition.editor-field-kind.v1',
    kind: 'text',
    version: 1,
    status: 'new',
    match: { property: [{ type: 'string', version: 2 }], choices: 'forbidden' },
    value_schema: { type: 'string', minLength: 1, maxLength: 2000 },
    default: { kind: null, field: 'must-satisfy-constraints' },
    constraints: { allowed: ['min_length', 'max_length'], required: ['max_length'] },
    normalization: { form: 'exact-string-no-trim-no-unicode-normalization', unset: 'empty-text', stored: 'value' },
    validation: ['code-point-length', 'no-control-characters', 'well-formed-unicode'],
    accessibility: { control: 'input[type=text]', role: 'textbox', name: 'label_key', description: 'help_key via aria-describedby', keyboard: ['Tab', 'text entry'], attributes: ['dir=auto', 'maxlength'] },
    themes: { modes: ['light', 'dark'], tokens: ['--sf-surface-1', '--sf-on-surface', '--sf-outline', '--sf-primary'], contrast: 'WCAG 2.2 AA' },
    localization: { label: 'label_key', help: 'help_key', value_labels: 'none', direction: 'dir=auto per value; value is author content in the Document locale' },
    server_fallback: { element: 'input', type: 'text', attributes: ['maxlength', 'dir=auto'], enhanced_control: 'sf-input' },
  },
  {
    schema: 'simai.composition.editor-field-kind.v1',
    kind: 'toggle',
    version: 1,
    status: 'new',
    match: { property: [{ type: 'boolean', version: 1 }], choices: 'forbidden' },
    value_schema: { type: 'boolean' },
    default: { kind: false, field: 'false-or-absent' },
    constraints: { allowed: [] },
    normalization: { form: 'present-true-absent-false', unset: 'false', stored: 'true only; false removes the key' },
    validation: ['strict-boolean'],
    accessibility: { control: 'input[type=checkbox][role=switch]', role: 'switch', name: 'label_key', description: 'help_key via aria-describedby', keyboard: ['Tab', 'Space'], states: ['checked'] },
    themes: { modes: ['light', 'dark'], tokens: ['--sf-surface-1', '--sf-on-surface', '--sf-outline', '--sf-primary'], contrast: 'WCAG 2.2 AA' },
    localization: { label: 'label_key', help: 'help_key', value_labels: 'none', direction: 'logical' },
    server_fallback: { element: 'input', type: 'checkbox', attributes: ['role=switch', 'value=true'], enhanced_control: 'sf-switch' },
  },
]);

const diagnostic = (code, path, message) => ({ code, path, message });

function codePoints(value) {
  return [...value].length;
}

function wellFormed(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return false;
    }
  }
  return true;
}

function hasControl(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 32 || code === 127) return true;
  }
  return false;
}

/** Returns the kind manifest that governs an editor field, or null. */
function resolveFieldKind(field, kinds = BUILTIN_FIELD_KINDS) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field?.property)) return null;
  const hasChoices = Array.isArray(field.choices);
  const matches = kinds.filter((kind) => kind.match.property.some((property) => property.type === field.property.type && property.version === field.property.version)
    && (kind.match.choices === 'required' ? hasChoices : !hasChoices));
  return matches.length === 1 ? matches[0] : null;
}

/** Checks one normalized value against its field; returns diagnostics. */
function validateFieldValue(field, value, path = '$') {
  const kind = resolveFieldKind(field);
  if (!kind) return [diagnostic('field_kind_unknown', path, 'The field does not map to exactly one published kind')];
  const constraints = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field.constraints) ? field.constraints : {};
  const problems = [];
  if (kind.kind === 'choice') {
    if (typeof value !== 'string' || !field.choices.includes(value)) problems.push(diagnostic('field_value_choice', path, 'Value is not an allowed choice'));
  } else if (kind.kind === 'integer') {
    if (!Number.isSafeInteger(value)) problems.push(diagnostic('field_value_type', path, 'Value must be a safe integer'));
    else if ((Number.isInteger(constraints.min) && value < constraints.min) || (Number.isInteger(constraints.max) && value > constraints.max)) problems.push(diagnostic('field_value_range', path, 'Value is outside the allowed range'));
  } else if (kind.kind === 'text') {
    if (typeof value !== 'string') problems.push(diagnostic('field_value_type', path, 'Value must be a string'));
    else if (!wellFormed(value)) problems.push(diagnostic('field_value_unicode', path, 'Value must be well-formed Unicode'));
    else if (hasControl(value)) problems.push(diagnostic('field_value_control', path, 'Value cannot contain control characters'));
    else {
      const length = codePoints(value);
      const min = Math.max(1, Number.isInteger(constraints.min_length) ? constraints.min_length : 1);
      const max = Math.min(2000, Number.isInteger(constraints.max_length) ? constraints.max_length : 2000);
      if (length < min || length > max) problems.push(diagnostic('field_value_length', path, 'Value length is outside the allowed range'));
    }
  } else if (kind.kind === 'toggle' && typeof value !== 'boolean') {
    problems.push(diagnostic('field_value_type', path, 'Value must be a boolean'));
  }
  return problems;
}

/** Kind-specific manifest rules added on top of validateEditorManifest. */
function validateFieldKinds(editorManifest) {
  const problems = [];
  (Array.isArray(editorManifest?.fields) ? editorManifest.fields : []).forEach((field, index) => {
    const path = `$.fields[${index}]`;
    const kind = resolveFieldKind(field);
    if (!kind) {
      problems.push(diagnostic('field_kind_unknown', path, 'The field does not map to exactly one published kind'));
      return;
    }
    const constraints = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field.constraints) ? field.constraints : {};
    for (const key of Object.keys(constraints)) {
      if (!kind.constraints.allowed.includes(key)) problems.push(diagnostic('field_constraint_unknown', `${path}.constraints.${key}`, `${key} is not a ${kind.kind} constraint`));
    }
    for (const key of kind.constraints.required || []) {
      if (!Number.isInteger(constraints[key])) problems.push(diagnostic('field_constraint_required', `${path}.constraints.${key}`, `${kind.kind} requires ${key}`));
    }
    if (kind.kind === 'choice') {
      const min = Number.isInteger(constraints.min_length) ? constraints.min_length : 0;
      const max = Number.isInteger(constraints.max_length) ? constraints.max_length : Infinity;
      if (min > max) problems.push(diagnostic('field_constraint_invalid', `${path}.constraints`, 'min_length must not exceed max_length'));
      for (const choice of field.choices) {
        if (typeof choice !== 'string' || codePoints(choice) < min || codePoints(choice) > max) problems.push(diagnostic('field_choice_invalid', `${path}.choices`, `${String(choice)} violates the choice constraints`));
      }
    }
    if (kind.kind === 'integer' && Number.isInteger(constraints.min) && Number.isInteger(constraints.max) && constraints.min > constraints.max) {
      problems.push(diagnostic('field_constraint_invalid', `${path}.constraints`, 'min must not exceed max'));
    }
    if (kind.kind === 'text' && Number.isInteger(constraints.min_length) && Number.isInteger(constraints.max_length) && constraints.min_length > constraints.max_length) {
      problems.push(diagnostic('field_constraint_invalid', `${path}.constraints`, 'min_length must not exceed max_length'));
    }
    if (kind.kind === 'toggle' && 'default' in field && field.default !== false) problems.push(diagnostic('field_default_invalid', `${path}.default`, 'A toggle default must be false or absent'));
    if (kind.kind !== 'toggle' && 'default' in field) problems.push(...validateFieldValue(field, field.default, `${path}.default`).map((entry) => ({ ...entry, code: 'field_default_invalid' })));
  });
  return problems;
}

/**
 * Normalizes one submitted form value. raw is the submitted string, or null
 * when the control sent nothing. Returns {value} or {unset: true} or {error}.
 */
function parseFieldSubmission(field, raw) {
  const kind = resolveFieldKind(field);
  if (!kind) return { error: diagnostic('field_kind_unknown', '$', 'The field does not map to exactly one published kind') };
  if (raw !== null && typeof raw !== 'string') return { error: diagnostic('field_submission_invalid', '$', 'A submission must be a string or absent') };
  let value;
  if (kind.kind === 'toggle') {
    if (raw !== null && raw !== 'true') return { error: diagnostic('field_submission_invalid', '$', 'A toggle submits only true') };
    return raw === 'true' ? { value: true } : { unset: true };
  }
  if (raw === null || raw === '') return { unset: true };
  if (kind.kind === 'integer') {
    if (!INTEGER_TEXT.test(raw)) return { error: diagnostic('field_value_type', '$', 'Value must be a decimal integer') };
    value = Number(raw);
  } else {
    value = raw;
  }
  const problems = validateFieldValue(field, value);
  return problems.length ? { error: problems[0] } : { value };
}

/** Returns a new node with the field value set, or the key removed when unset. */
function applyFieldValue(node, field, result) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(result) || result.error || (result.unset !== true && !('value' in result))) {
    throw new TypeError('applyFieldValue requires a successful parseFieldSubmission result');
  }
  const next = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)(JSON.parse(JSON.stringify(node)));
  const plane = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(next[field.plane]) ? { ...next[field.plane] } : {};
  if (result.unset || (resolveFieldKind(field)?.kind === 'toggle' && result.value === false)) delete plane[field.target];
  else plane[field.target] = result.value;
  if (Object.keys(plane).length) next[field.plane] = plane;
  else delete next[field.plane];
  return (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)(next);
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function controlId(instance, field) {
  return `sf-field-${instance}-${field.key}`.replace(/[^A-Za-z0-9_-]/gu, '-');
}

/**
 * Server-rendered fallback control for one projected field (the output of
 * projectEditorFields plus its instance id). Works without JavaScript; the
 * submitted name is "<instance>.<destination>". Missing translations fall back
 * to the stable key text.
 */
function renderFieldFallback(field, { instance, messages = {} } = {}) {
  const kind = resolveFieldKind(field);
  if (!kind) throw new TypeError('field_kind_unknown');
  // Hidden fields are not rendered; a form handler must skip them so that
  // their stored values stay unchanged.
  if (field.visibility === 'hidden') return '';
  const id = controlId(instance, field);
  const name = escapeHtml(`${instance}.${field.plane}.${field.target}`);
  const label = escapeHtml(messages[field.label_key] ?? field.label_key);
  const helpId = field.help_key ? `${id}-help` : null;
  const described = helpId ? ` aria-describedby="${helpId}"` : '';
  const help = helpId ? `<small class="sf-editor-field-help" id="${helpId}">${escapeHtml(messages[field.help_key] ?? field.help_key)}</small>` : '';
  const value = field.value ?? field.default ?? null;
  const constraints = field.constraints || {};
  let control;
  if (kind.kind === 'toggle') {
    control = `<input class="sf-editor-field-control" type="checkbox" role="switch" id="${id}" name="${name}" value="true"${value === true ? ' checked' : ''}${described}><label for="${id}">${label}</label>`;
  } else if (kind.kind === 'choice') {
    const options = field.choices.map((choice) => {
      const text = STABLE_SEGMENT.test(choice) ? (messages[`${field.label_key}.${choice}`] ?? choice) : choice;
      return `<option value="${escapeHtml(choice)}"${choice === value ? ' selected' : ''}>${escapeHtml(text)}</option>`;
    }).join('');
    control = `<label for="${id}">${label}</label><select class="sf-editor-field-control" id="${id}" name="${name}"${described}>${value === null ? '<option value="" selected></option>' : ''}${options}</select>`;
  } else if (kind.kind === 'integer') {
    const bounds = `${Number.isInteger(constraints.min) ? ` min="${constraints.min}"` : ''}${Number.isInteger(constraints.max) ? ` max="${constraints.max}"` : ''}`;
    control = `<label for="${id}">${label}</label><input class="sf-editor-field-control" type="number" inputmode="numeric" step="1"${bounds} id="${id}" name="${name}" value="${value === null ? '' : escapeHtml(value)}"${described}>`;
  } else {
    const max = Math.min(2000, Number.isInteger(constraints.max_length) ? constraints.max_length : 2000);
    control = `<label for="${id}">${label}</label><input class="sf-editor-field-control" type="text" dir="auto" maxlength="${max}" id="${id}" name="${name}" value="${value === null ? '' : escapeHtml(value)}"${described}>`;
  }
  const html = `<div class="sf-editor-field" data-sf-field-kind="${kind.kind}" data-sf-field-group="${escapeHtml(field.group)}">${control}${help}</div>`;
  return field.visibility === 'collapsed'
    ? `<details class="sf-editor-field-disclosure"><summary>${label}</summary>${html}</details>`
    : html;
}

function fieldKindRegistry() {
  return JSON.parse((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)({ schema: 'simai.composition.editor-field-kind-registry.v1', entries: BUILTIN_FIELD_KINDS }));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ BUILTIN_FIELD_KINDS, applyFieldValue, parseFieldSubmission, renderFieldFallback, resolveFieldKind, validateFieldKinds, validateFieldValue });


/***/ },

/***/ "32dfc4431a24"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_EDITOR_MANIFESTS: () => (/* reexport safe */ _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_EDITOR_MANIFESTS),
/* harmony export */   BUILTIN_FIELD_KINDS: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.BUILTIN_FIELD_KINDS),
/* harmony export */   BUILTIN_PORT_MANIFESTS: () => (/* reexport safe */ _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_PORT_MANIFESTS),
/* harmony export */   Composition: () => (/* binding */ Composition),
/* harmony export */   INLINE_MARKS: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.INLINE_MARKS),
/* harmony export */   Recipe: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__.Recipe),
/* harmony export */   VALUE_TYPES: () => (/* reexport safe */ _routing_mjs__WEBPACK_IMPORTED_MODULE_7__.VALUE_TYPES),
/* harmony export */   applyFieldValue: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.applyFieldValue),
/* harmony export */   checkPortValue: () => (/* reexport safe */ _routing_mjs__WEBPACK_IMPORTED_MODULE_7__.checkPortValue),
/* harmony export */   compositionTypeFromSmartManifest: () => (/* binding */ compositionTypeFromSmartManifest),
/* harmony export */   createPortRegistry: () => (/* reexport safe */ _routing_mjs__WEBPACK_IMPORTED_MODULE_7__.createPortRegistry),
/* harmony export */   createRegistry: () => (/* binding */ createRegistry),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineCompositionScope: () => (/* reexport safe */ _routing_mjs__WEBPACK_IMPORTED_MODULE_7__.defineCompositionScope),
/* harmony export */   describeRegions: () => (/* reexport safe */ _regions_mjs__WEBPACK_IMPORTED_MODULE_5__.describeRegions),
/* harmony export */   inlineText: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.inlineText),
/* harmony export */   marksIn: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.marksIn),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   normalizeInline: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.normalizeInline),
/* harmony export */   parseFieldSubmission: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.parseFieldSubmission),
/* harmony export */   parseRecipeJson: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__.parseRecipeJson),
/* harmony export */   projectDocumentEditorFields: () => (/* reexport safe */ _editor_mjs__WEBPACK_IMPORTED_MODULE_2__.projectDocumentEditorFields),
/* harmony export */   projectEditorFields: () => (/* reexport safe */ _editor_mjs__WEBPACK_IMPORTED_MODULE_2__.projectEditorFields),
/* harmony export */   recipeDigest: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__.recipeDigest),
/* harmony export */   recipeNodeId: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__.recipeNodeId),
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   renderFieldFallback: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.renderFieldFallback),
/* harmony export */   replaceRange: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.replaceRange),
/* harmony export */   resolveFieldKind: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.resolveFieldKind),
/* harmony export */   resolveRecipe: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__.resolveRecipe),
/* harmony export */   setLink: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.setLink),
/* harmony export */   stableStringify: () => (/* reexport safe */ _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify),
/* harmony export */   startInlineEdit: () => (/* binding */ startInlineEdit),
/* harmony export */   toggleMark: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.toggleMark),
/* harmony export */   validate: () => (/* binding */ validate),
/* harmony export */   validateEditorManifest: () => (/* reexport safe */ _editor_mjs__WEBPACK_IMPORTED_MODULE_2__.validateEditorManifest),
/* harmony export */   validateFieldKinds: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.validateFieldKinds),
/* harmony export */   validateFieldValue: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.validateFieldValue)
/* harmony export */ });
/* harmony import */ var _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("08e5033c490a");
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _editor_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("3765e2c966fd");
/* harmony import */ var _fields_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4e6fc63bed81");
/* harmony import */ var _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6770fb69bd04");
/* harmony import */ var _regions_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("68efac8c1b57");
/* harmony import */ var _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e66d878fb4f8");
/* harmony import */ var _routing_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("4aea5d6d49c7");









const DOCUMENT_SCHEMA = 'simai.composition.document.v1';

// The editor surfaces (sf-composition-overlay, sf-sortable, sf-inline-editor)
// are Smart components loaded on demand, so pages that only render stay small.
// startInlineEdit keeps its Core name and delegates to the loaded editor.
function startInlineEdit(element, options) {
  const editor = globalThis.SF?.InlineEditor;
  if (typeof editor?.startInlineEdit !== 'function') throw new TypeError('inline_editor_not_loaded');
  return editor.startInlineEdit(element, options);
}
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
  // Browsers read "/\\host" like "//host": backslashes never form a local link.
  if (/^(?:\/|\.?\.\/|#)/u.test(value)) return !value.startsWith('//') && !value.includes('\\');
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

let defaultPorts = null;

function normalizePorts(ports) {
  if (ports?.elements instanceof Map) return ports;
  if (Array.isArray(ports)) return (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.createPortRegistry)(ports);
  if (ports && Array.isArray(ports.manifests)) return (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.createPortRegistry)(ports.manifests, { bindings: ports.bindings });
  defaultPorts = defaultPorts || (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.createPortRegistry)(_builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_PORT_MANIFESTS);
  return defaultPorts;
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
  const inputs = manifest.inputs?.properties || {};
  // Structure and request-bound data travel in separate channels: props are the
  // structure a document holds, data is what a host answers with. Both are
  // closed and both come from the component's own declared inputs.
  const pick = (names) => Object.fromEntries(Object.entries(inputs).filter(([key]) => new Set(names || []).has(key)));
  // Request-bound data is described by the component's own declared contracts,
  // not by attributes: rows and columns arrive from a host, not from markup.
  const dataProperties = Object.fromEntries(Object.entries(declaration.data || {}).map(([key, binding]) => {
    const schema = manifest.contracts?.[binding.contract];
    if (!schema) throw new TypeError(`composition_data_contract_missing:${declaration.type}:${key}`);
    return [key, schema];
  }));
  const events = Object.fromEntries((declaration.events || [])
    .filter((name) => manifest.events?.[name])
    .map((name) => [name, { summary: manifest.events[name].summary, payload: manifest.events[name].payload }]));
  const persistence = manifest.persistence
    ? {
      mode: manifest.persistence.mode,
      source_of_truth: manifest.persistence.source_of_truth,
      network_owner: manifest.persistence.network_owner,
      settings_key_prop: declaration.persistence?.settings_key_prop ?? null,
      revision_prop: declaration.persistence?.revision_prop ?? null,
    }
    : undefined;
  return {
    schema: 'simai.composition.type-manifest.v1',
    type: declaration.type,
    version: manifest.version,
    category: 'smart',
    mode: declaration.mode,
    profiles: declaration.profiles,
    data_schema: { type: 'object', additionalProperties: false, properties: dataProperties },
    props_schema: { type: 'object', additionalProperties: false, properties: pick(declaration.props) },
    presentation: declaration.presentation || { views: ['default'], presets: [], modifiers: [] },
    slots: declaration.slots || {},
    renderer: declaration.renderer,
    assets: declaration.assets || [],
    capabilities: ['html', 'hydration'],
    ...(Object.keys(events).length ? { events } : {}),
    ...(persistence ? { persistence } : {}),
  };
}

function validate(document, registry = undefined, options = {}) {
  const diagnostics = [];
  const resolvedRegistry = normalizeRegistry(registry);
  const limits = { ...DEFAULT_LIMITS, ...(options.limits || {}) };
  const supportedExtensions = new Set([_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.ENDPOINT_EXTENSION, ...(options.supportedExtensions || [])]);
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
  else {
    (0,_regions_mjs__WEBPACK_IMPORTED_MODULE_5__.validateRegionRules)(document.root, resolvedRegistry, diagnostics);
    (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.resolveRoutes)(document.root, resolvedRegistry, normalizePorts(options.ports), diagnostics);
  }
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
  'layout.columns': ({ node, slots }) => {
    const columns = Number.isInteger(node.props?.columns) ? ` data-composition-columns="${node.props.columns}"` : '';
    return `<div class="sf-composition-columns" data-sf-composition-id="${escapeHtml(node.id)}"${columns}>${(slots.columnsList || []).map((child) => `<div class="sf-composition-column">${child}</div>`).join('')}</div>`;
  },
  'content.heading': ({ node }) => `<h${node.data.level || 2} data-sf-composition-id="${escapeHtml(node.id)}">${renderInline(node.data.content)}</h${node.data.level || 2}>`,
  'content.paragraph': ({ node }) => `<p data-sf-composition-id="${escapeHtml(node.id)}">${renderInline(node.data.content)}</p>`,
  'layout.regions': ({ node, slots }) => `<div class="sf-composition-regions" data-sf-composition-id="${escapeHtml(node.id)}"><div class="sf-composition-regions-grid">${slots.regions || ''}</div></div>`,
  'layout.region': ({ node, slots }) => {
    const props = node.props;
    const element = _regions_mjs__WEBPACK_IMPORTED_MODULE_5__.REGION_ELEMENTS[props.landmark];
    const sticky = props.sticky === true ? ' data-sf-region-sticky=""' : '';
    const label = props.label !== undefined ? ` aria-label="${escapeHtml(props.label)}"` : '';
    return `<${element} class="sf-composition-region" data-sf-composition-id="${escapeHtml(node.id)}" data-sf-region="${escapeHtml(props.name)}" data-sf-region-placement="${escapeHtml(props.placement ?? 'block')}"${sticky}${label}>${slots.default || ''}</${element}>`;
  },
  'layout.scope': ({ node, slots, routes }) => `<sf-composition-scope data-sf-composition-id="${escapeHtml(node.id)}" data-sf-routes="${escapeHtml((0,_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.routesAttribute)(routes || []))}">${slots.default || ''}</sf-composition-scope>`,
};

async function render(document, context = {}) {
  const registry = normalizeRegistry(context.registry);
  const normalized = await normalize(document, registry, context.options || {});
  if (!normalized.document) return { html: '', assets: [], hydration: [], diagnostics: normalized.diagnostics, digest: null };
  const diagnostics = [];
  const hydration = [];
  const routes = (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.resolveRoutes)(normalized.document.root, registry, normalizePorts(context.options?.ports), []);
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
      renderer = ({ node: current, slots: currentSlots, endpoint }) => {
        const endpointAttribute = endpoint ? ` data-sf-endpoint="${escapeHtml(endpoint)}"` : '';
        const attributes = Object.entries(current.props || {}).map(([key, value]) => ` ${escapeHtml(key)}="${escapeHtml(value)}"`).join('') + endpointAttribute;
        hydration.push({ id: current.id, type: current.type, element: manifest.renderer.name });
        return `<${manifest.renderer.name}${attributes}>${Object.values(currentSlots).filter((value) => typeof value === 'string').join('')}</${manifest.renderer.name}>`;
      };
    }
    if (!renderer) {
      diagnostics.push(diagnostic('renderer_unavailable', `node:${node.id}`, `Renderer ${manifest.renderer.name} is unavailable`));
      return '';
    }
    if (node.type === 'layout.scope') hydration.push({ id: node.id, type: node.type, element: 'sf-composition-scope' });
    return renderer({ node, slots, context, resolvedBindings, manifest, routes: routes.get(node.id), endpoint: (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.endpointName)(node) });
  };
  const html = await renderNode(normalized.document.root);
  return { html, assets: normalized.dependencies.assets, hydration, diagnostics, digest: normalized.digest };
}

const Composition = Object.freeze({
  BUILTIN_EDITOR_MANIFESTS: _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_EDITOR_MANIFESTS,
  BUILTIN_FIELD_KINDS: _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.BUILTIN_FIELD_KINDS,
  BUILTIN_PORT_MANIFESTS: _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_PORT_MANIFESTS,
  Recipe: _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__.Recipe,
  applyFieldValue: _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.applyFieldValue,
  parseFieldSubmission: _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.parseFieldSubmission,
  renderFieldFallback: _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.renderFieldFallback,
  resolveFieldKind: _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.resolveFieldKind,
  validateFieldKinds: _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.validateFieldKinds,
  validateFieldValue: _fields_mjs__WEBPACK_IMPORTED_MODULE_3__.validateFieldValue,
  VALUE_TYPES: _routing_mjs__WEBPACK_IMPORTED_MODULE_7__.VALUE_TYPES,
  checkPortValue: _routing_mjs__WEBPACK_IMPORTED_MODULE_7__.checkPortValue,
  createPortRegistry: _routing_mjs__WEBPACK_IMPORTED_MODULE_7__.createPortRegistry,
  defineCompositionScope: _routing_mjs__WEBPACK_IMPORTED_MODULE_7__.defineCompositionScope,
  startInlineEdit,
  normalizeInline: _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.normalizeInline,
  inlineText: _inline_model_mjs__WEBPACK_IMPORTED_MODULE_6__.inlineText,
  createRegistry,
  compositionTypeFromSmartManifest,
  describeRegions: _regions_mjs__WEBPACK_IMPORTED_MODULE_5__.describeRegions,
  normalize,
  projectDocumentEditorFields: _editor_mjs__WEBPACK_IMPORTED_MODULE_2__.projectDocumentEditorFields,
  projectEditorFields: _editor_mjs__WEBPACK_IMPORTED_MODULE_2__.projectEditorFields,
  render,
  resolveRecipe: _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__.resolveRecipe,
  parseRecipeJson: _recipe_mjs__WEBPACK_IMPORTED_MODULE_4__.parseRecipeJson,
  stableStringify: _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify,
  validate,
  validateEditorManifest: _editor_mjs__WEBPACK_IMPORTED_MODULE_2__.validateEditorManifest,
});

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  globalThis.SF.Composition = Composition;
  (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_7__.defineCompositionScope)();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Composition);









/***/ },

/***/ "e66d878fb4f8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INLINE_LIMITS: () => (/* binding */ INLINE_LIMITS),
/* harmony export */   INLINE_MARKS: () => (/* binding */ INLINE_MARKS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fromSegments: () => (/* binding */ fromSegments),
/* harmony export */   inlineText: () => (/* binding */ inlineText),
/* harmony export */   marksIn: () => (/* binding */ marksIn),
/* harmony export */   normalizeInline: () => (/* binding */ normalizeInline),
/* harmony export */   replaceRange: () => (/* binding */ replaceRange),
/* harmony export */   safeHref: () => (/* binding */ safeHref),
/* harmony export */   setLink: () => (/* binding */ setLink),
/* harmony export */   toSegments: () => (/* binding */ toSegments),
/* harmony export */   toggleMark: () => (/* binding */ toggleMark)
/* harmony export */ });
// Pure operations on the Composition inline content model used by
// content.heading and content.paragraph: text runs with strong, em and code
// marks, and links whose children are text runs. No DOM access here.

const INLINE_MARKS = Object.freeze(['strong', 'em', 'code']);
const MARK_ORDER = new Map(INLINE_MARKS.map((mark, index) => [mark, index]));
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const INLINE_LIMITS = Object.freeze({ maxTextLength: 100000, maxHrefLength: 2048 });

/** Same link rule as Document validation: relative, fragment or http(s)/mailto/tel. */
function safeHref(value) {
  if (typeof value !== 'string' || value.length < 1 || value.length > INLINE_LIMITS.maxHrefLength) return false;
  // Browsers read "/\\host" like "//host": backslashes never form a local link.
  if (/^(?:\/|\.?\.\/|#)/u.test(value)) return !value.startsWith('//') && !value.includes('\\');
  try {
    return SAFE_SCHEMES.has(new globalThis.URL(value).protocol);
  } catch {
    return false;
  }
}

function sortMarks(marks) {
  return [...new Set(marks)].filter((mark) => MARK_ORDER.has(mark)).sort((left, right) => MARK_ORDER.get(left) - MARK_ORDER.get(right));
}

/** Flat segments: {text, marks: string[], href: string|null}. */
function toSegments(content) {
  const segments = [];
  const push = (run, href) => {
    if (run?.type !== 'text' || typeof run.value !== 'string' || !run.value) return;
    segments.push({ text: run.value, marks: sortMarks(Array.isArray(run.marks) ? run.marks : []), href });
  };
  for (const entry of Array.isArray(content) ? content : []) {
    if (entry?.type === 'link') {
      const href = safeHref(entry.href) ? entry.href : null;
      for (const child of Array.isArray(entry.children) ? entry.children : []) push(child, href);
    } else push(entry, null);
  }
  return segments;
}

const sameStyle = (left, right) => left.href === right.href && left.marks.join() === right.marks.join();

/** Builds normalized content: merged runs, canonical marks, no empty parts. */
function fromSegments(segments) {
  const merged = [];
  for (const segment of segments) {
    if (!segment.text) continue;
    const clean = { text: segment.text, marks: sortMarks(segment.marks || []), href: segment.href && safeHref(segment.href) ? segment.href : null };
    const previous = merged.at(-1);
    if (previous && sameStyle(previous, clean)) previous.text += clean.text;
    else merged.push(clean);
  }
  const content = [];
  for (const segment of merged) {
    const run = { type: 'text', value: segment.text, ...(segment.marks.length ? { marks: segment.marks } : {}) };
    const previous = content.at(-1);
    if (segment.href) {
      if (previous?.type === 'link' && previous.href === segment.href) previous.children.push(run);
      else content.push({ type: 'link', href: segment.href, children: [run] });
    } else content.push(run);
  }
  return content;
}

function normalizeInline(content) {
  return fromSegments(toSegments(content));
}

function inlineText(content) {
  return toSegments(content).map(({ text }) => text).join('');
}

function split(segments, offset) {
  const output = [];
  let position = 0;
  for (const segment of segments) {
    const end = position + segment.text.length;
    if (offset > position && offset < end) {
      output.push({ ...segment, text: segment.text.slice(0, offset - position) }, { ...segment, text: segment.text.slice(offset - position) });
    } else output.push(segment);
    position = end;
  }
  return output;
}

function range(content, start, end) {
  const segments = split(split(toSegments(content), start), end);
  let position = 0;
  return segments.map((segment) => {
    const from = position;
    position += segment.text.length;
    return { segment, inside: from >= start && position <= end && position > from };
  });
}

/** Marks and link shared by every character in [start, end). */
function marksIn(content, start, end) {
  const inside = range(content, Math.min(start, end), Math.max(start, end)).filter(({ inside: isInside }) => isInside).map(({ segment }) => segment);
  if (!inside.length) return { marks: [], href: null };
  const marks = INLINE_MARKS.filter((mark) => inside.every((segment) => segment.marks.includes(mark)));
  const href = inside.every((segment) => segment.href === inside[0].href) ? inside[0].href : null;
  return { marks, href };
}

/** Adds the mark to [start, end) unless every character already has it. */
function toggleMark(content, start, end, mark) {
  if (!MARK_ORDER.has(mark) || start === end) return normalizeInline(content);
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  const remove = marksIn(content, from, to).marks.includes(mark);
  return fromSegments(range(content, from, to).map(({ segment, inside }) => (inside
    ? { ...segment, marks: remove ? segment.marks.filter((entry) => entry !== mark) : [...segment.marks, mark] }
    : segment)));
}

/** Sets or removes (href null) a link on [start, end); unsafe links are refused. */
function setLink(content, start, end, href) {
  if (href !== null && !safeHref(href)) throw new TypeError('inline_link_unsafe');
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  if (from === to) return normalizeInline(content);
  return fromSegments(range(content, from, to).map(({ segment, inside }) => (inside ? { ...segment, href } : segment)));
}

/** Replaces [start, end) with segments (typing, paste or deletion). */
function replaceRange(content, start, end, inserted) {
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  const parts = range(content, from, to);
  const before = parts.filter((_, index) => parts.slice(0, index + 1).reduce((sum, part) => sum + part.segment.text.length, 0) <= from).map(({ segment }) => segment);
  let consumed = 0;
  const after = [];
  for (const { segment } of parts) {
    const segmentStart = consumed;
    consumed += segment.text.length;
    if (segmentStart >= to) after.push(segment);
  }
  return fromSegments([...before, ...inserted, ...after]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ INLINE_MARKS, fromSegments, inlineText, marksIn, normalizeInline, replaceRange, safeHref, setLink, toSegments, toggleMark });


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
    const normalized = await normalize(document, context.registry, { limits: { maxDocumentBytes: limits.maxOutputBytes, maxDepth: limits.maxOutputDepth, maxNodes: limits.maxOutputNodes, maxChildrenPerSlot: limits.maxChildrenPerSlot }, supportedExtensions: context.supportedExtensions, ports: context.compositionPorts });
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


/***/ },

/***/ "68efac8c1b57"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REGION_ACCEPTS: () => (/* binding */ REGION_ACCEPTS),
/* harmony export */   REGION_ELEMENTS: () => (/* binding */ REGION_ELEMENTS),
/* harmony export */   REGION_LANDMARKS: () => (/* binding */ REGION_LANDMARKS),
/* harmony export */   REGION_LIMITS: () => (/* binding */ REGION_LIMITS),
/* harmony export */   REGION_PLACEMENTS: () => (/* binding */ REGION_PLACEMENTS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   describeRegions: () => (/* binding */ describeRegions),
/* harmony export */   validateRegionRules: () => (/* binding */ validateRegionRules)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");


// Declared-region layout rules. Region names are chosen by the document author;
// Framework owns only landmark semantics, placement, cardinality and nesting.
const REGION_LANDMARKS = Object.freeze(['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'none']);
const REGION_PLACEMENTS = Object.freeze(['block', 'start', 'center', 'end']);
const REGION_ACCEPTS = Object.freeze(['layout', 'content', 'smart']);
const REGION_LIMITS = Object.freeze({ maxRegionsPerLayout: 12, maxRegionLayoutNesting: 4 });
const REGION_ELEMENTS = Object.freeze({
  banner: 'header',
  navigation: 'nav',
  main: 'main',
  complementary: 'aside',
  contentinfo: 'footer',
  region: 'section',
  none: 'div',
});

const DOCUMENT_LEVEL_LANDMARKS = new Set(['banner', 'main', 'contentinfo']);
const PLACEMENT_RANK = { start: 0, center: 1, end: 2 };

const diagnostic = (code, path, message) => ({ code, path, message });

function landmarkOf(node) {
  return node?.type === 'layout.region' && typeof node.props?.landmark === 'string' ? node.props.landmark : null;
}

function validateRegionList(node, path, diagnostics) {
  const regions = Array.isArray(node.slots?.regions) ? node.slots.regions : [];
  const names = new Set();
  let bandRank = -1;
  regions.forEach((region, index) => {
    const regionPath = `${path}.slots.regions[${index}]`;
    if (region?.type !== 'layout.region') return;
    const name = region.props?.name;
    if (typeof name === 'string') {
      if (names.has(name)) diagnostics.push(diagnostic('region_name_duplicate', `${regionPath}.props.name`, `Region ${name} is declared twice in one layout`));
      names.add(name);
    }
    const placement = region.props?.placement ?? 'block';
    if (placement === 'block') {
      bandRank = -1;
      return;
    }
    const rank = PLACEMENT_RANK[placement];
    if (rank === undefined) return;
    if (rank < bandRank) diagnostics.push(diagnostic('region_order_invalid', `${regionPath}.props.placement`, 'Side-by-side regions must be declared in start, center, end order'));
    bandRank = Math.max(bandRank, rank);
  });
}

function validateRegionNode(node, path, context, diagnostics) {
  const props = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.props) ? node.props : {};
  const landmark = landmarkOf(node);
  if (landmark && DOCUMENT_LEVEL_LANDMARKS.has(landmark) && (context.insideLandmark || context.insidePage)) {
    diagnostics.push(diagnostic('region_landmark_context', `${path}.props.landmark`, `${landmark} is only allowed outside other landmarks and layout.page`));
  }
  if (landmark === 'region' && props.label === undefined) {
    diagnostics.push(diagnostic('region_label_required', `${path}.props.label`, 'A region landmark requires an accessible label'));
  }
  if (landmark === 'none' && props.label !== undefined) {
    diagnostics.push(diagnostic('region_label_forbidden', `${path}.props.label`, 'A region without a landmark cannot carry an accessible label'));
  }
  const children = Array.isArray(node.slots?.default) ? node.slots.default : [];
  const min = Number.isInteger(props.min_items) ? props.min_items : 0;
  const max = Number.isInteger(props.max_items) ? props.max_items : 500;
  if (min > max) diagnostics.push(diagnostic('region_bounds_invalid', `${path}.props`, 'min_items must not exceed max_items'));
  else if (children.length < min || children.length > max) diagnostics.push(diagnostic('region_cardinality', `${path}.slots.default`, 'Region child count is outside its declared range'));
  if (Array.isArray(props.accepts)) {
    const accepted = new Set(props.accepts);
    children.forEach((child, index) => {
      const manifest = context.registry.types.get(child?.type);
      if (manifest && !accepted.has(manifest.category)) {
        diagnostics.push(diagnostic('region_child_category_forbidden', `${path}.slots.default[${index}]`, `${manifest.category} is not accepted by this region`));
      }
    });
  }
}

/**
 * Applies declared-region rules to a structurally valid Document root.
 * The generic validator has already checked manifests, props and slot types.
 */
function validateRegionRules(root, registry, diagnostics) {
  const landmarkUse = new Map();
  const visit = (node, path, context) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node)) return;
    if (node.type === 'layout.region' && context.parentType !== 'layout.regions') {
      diagnostics.push(diagnostic('region_parent_invalid', path, 'layout.region must be a direct child of layout.regions'));
    }
    let next = { ...context, parentType: node.type };
    if (node.type === 'layout.page') next.insidePage = true;
    if (node.type === 'layout.regions') {
      next.regionDepth = context.regionDepth + 1;
      if (next.regionDepth > REGION_LIMITS.maxRegionLayoutNesting) diagnostics.push(diagnostic('region_nesting_limit', path, 'Region layouts are nested too deeply'));
      validateRegionList(node, path, diagnostics);
    }
    if (node.type === 'layout.region') {
      validateRegionNode(node, path, { ...context, registry }, diagnostics);
      const landmark = landmarkOf(node);
      if (landmark && landmark !== 'none') {
        if (!landmarkUse.has(landmark)) landmarkUse.set(landmark, []);
        landmarkUse.get(landmark).push({ path, label: node.props?.label });
        next = { ...next, insideLandmark: true };
      }
    }
    for (const [slotName, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (!Array.isArray(children)) continue;
      children.forEach((child, index) => visit(child, `${path}.slots.${slotName}[${index}]`, next));
    }
  };
  visit(root, '$.root', { parentType: null, insidePage: false, insideLandmark: false, regionDepth: 0 });
  for (const [landmark, uses] of landmarkUse) {
    if (landmark === 'main' && uses.length > 1) {
      for (const use of uses.slice(1)) diagnostics.push(diagnostic('region_landmark_duplicate', `${use.path}.props.landmark`, 'A document can contain only one main region'));
      continue;
    }
    if (uses.length < 2) continue;
    const labels = new Set();
    for (const use of uses) {
      if (use.label === undefined) {
        // A region landmark without a label is already reported once above.
        if (landmark !== 'region') diagnostics.push(diagnostic('region_label_required', `${use.path}.props.label`, `Repeated ${landmark} regions require distinct labels`));
        continue;
      }
      if (labels.has(use.label)) diagnostics.push(diagnostic('region_label_duplicate', `${use.path}.props.label`, `Repeated ${landmark} regions require distinct labels`));
      else labels.add(use.label);
    }
  }
}

async function sha256(value) {
  const bytes = new globalThis.TextEncoder().encode(value);
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Lists every declared region of an already normalized Document with a
 * digest of its canonical subtree. Products use the digest to invalidate only
 * outputs that depend on a changed region; the list order is document order.
 */
async function describeRegions(document) {
  const regions = [];
  const visit = async (node, path, layout) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node)) return;
    if (node.type === 'layout.region' && layout) {
      const props = node.props || {};
      regions.push({
        layout,
        node: node.id,
        name: props.name,
        landmark: props.landmark,
        placement: props.placement ?? 'block',
        path,
        digest: `sha256:${await sha256((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)(node)))}`,
      });
    }
    const nextLayout = node.type === 'layout.regions' ? node.id : null;
    for (const [slotName, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (!Array.isArray(children)) continue;
      for (let index = 0; index < children.length; index += 1) await visit(children[index], `${path}.slots.${slotName}[${index}]`, nextLayout);
    }
  };
  await visit(document?.root, '$.root', null);
  return regions;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ describeRegions, validateRegionRules });


/***/ },

/***/ "4aea5d6d49c7"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CompositionRouteController: () => (/* binding */ CompositionRouteController),
/* harmony export */   ENDPOINT_EXTENSION: () => (/* binding */ ENDPOINT_EXTENSION),
/* harmony export */   PORT_OUTPUT_EVENT: () => (/* binding */ PORT_OUTPUT_EVENT),
/* harmony export */   ROUTE_STATE_EVENT: () => (/* binding */ ROUTE_STATE_EVENT),
/* harmony export */   ROUTING_LIMITS: () => (/* binding */ ROUTING_LIMITS),
/* harmony export */   VALUE_TYPES: () => (/* binding */ VALUE_TYPES),
/* harmony export */   checkPortValue: () => (/* binding */ checkPortValue),
/* harmony export */   createPortRegistry: () => (/* binding */ createPortRegistry),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineCompositionScope: () => (/* binding */ defineCompositionScope),
/* harmony export */   endpointName: () => (/* binding */ endpointName),
/* harmony export */   parseRoutesAttribute: () => (/* binding */ parseRoutesAttribute),
/* harmony export */   portsForType: () => (/* binding */ portsForType),
/* harmony export */   resolveRoutes: () => (/* binding */ resolveRoutes),
/* harmony export */   routesAttribute: () => (/* binding */ routesAttribute)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");


// Generic cross-composite routing. A layout.scope node is the common parent
// that declares typed routes between endpoint descendants. Routes name only
// endpoints and published ports; they never carry endpoints, methods, actions,
// expressions or transformations. Products keep data access and authorization.

const ENDPOINT_EXTENSION = 'simai.composition:endpoint';
const PORT_OUTPUT_EVENT = 'sf-port-output';
const ROUTE_STATE_EVENT = 'sf-composition-route-state';
const ROUTING_LIMITS = Object.freeze({
  maxRoutesPerScope: 32,
  maxEndpointsPerScope: 64,
  maxFanOut: 8,
  maxScopeNesting: 4,
  maxReentrancy: 8,
  maxValueBytes: 65536,
});

const NAME_PATTERN = /^[a-z][a-z0-9-]{0,31}$/u;
const ROUTE_ID_PATTERN = /^[a-z][a-z0-9-]{0,63}$/u;
const CONTROL = /[\u0000-\u001f\u007f]/u;

const diagnostic = (code, path, message) => ({ code, path, message });

function checkedRecordId(value) {
  if (typeof value === 'string') return value.length > 0 && value.length <= 256 && !CONTROL.test(value);
  return Number.isSafeInteger(value);
}

function freezeList(list) {
  return Object.freeze([...list]);
}

// Closed value-type vocabulary. Each validator returns an immutable copy or
// throws TypeError; there is no coercion between types.
const VALUE_TYPES = Object.freeze({
  'record-ids.v1': Object.freeze({
    summary: 'Ordered unique opaque record identities: nonempty strings up to 256 code units without control characters, or safe integers. Up to 1000 items; empty means no selection.',
    schema: {
      type: 'array',
      maxItems: 1000,
      uniqueItems: true,
      items: { oneOf: [{ type: 'string', minLength: 1, maxLength: 256 }, { type: 'integer', minimum: -9007199254740991, maximum: 9007199254740991 }] },
    },
    check(value) {
      if (!Array.isArray(value) || value.length > 1000 || !value.every(checkedRecordId)) throw new TypeError('record-ids.v1 value is invalid');
      const seen = new Set(value.map((entry) => `${typeof entry}:${entry}`));
      if (seen.size !== value.length) throw new TypeError('record-ids.v1 value has duplicates');
      return freezeList(value);
    },
  }),
  'record-id.v1': Object.freeze({
    summary: 'One opaque record identity or null for none.',
    schema: { oneOf: [{ type: 'null' }, { type: 'string', minLength: 1, maxLength: 256 }, { type: 'integer', minimum: -9007199254740991, maximum: 9007199254740991 }] },
    check(value) {
      if (value !== null && !checkedRecordId(value)) throw new TypeError('record-id.v1 value is invalid');
      return value;
    },
  }),
  'text.v1': Object.freeze({
    summary: 'Plain text up to 2000 code units; never interpreted as markup or a query language.',
    schema: { type: 'string', maxLength: 2000 },
    check(value) {
      if (typeof value !== 'string' || value.length > 2000) throw new TypeError('text.v1 value is invalid');
      return value;
    },
  }),
  'boolean.v1': Object.freeze({
    summary: 'A strict boolean.',
    schema: { type: 'boolean' },
    check(value) {
      if (typeof value !== 'boolean') throw new TypeError('boolean.v1 value is invalid');
      return value;
    },
  }),
});

const own = (object, key) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(object) && typeof key === 'string' && Object.hasOwn(object, key);
const knownValueType = (name) => own(VALUE_TYPES, name);

function checkPortValue(valueType, value) {
  if (!knownValueType(valueType)) throw new TypeError(`Unknown value type ${valueType}`);
  const type = VALUE_TYPES[valueType];
  const checked = type.check(value);
  if (new globalThis.TextEncoder().encode(JSON.stringify(checked)).byteLength > ROUTING_LIMITS.maxValueBytes) throw new TypeError('Port value is too large');
  return checked;
}

function createPortRegistry(manifests = [], options = {}) {
  const elements = new Map();
  for (const manifest of manifests) {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(manifest) || manifest.schema !== 'simai.composition.port-manifest.v1') throw new TypeError('composition_port_manifest_invalid');
    if (elements.has(manifest.element)) throw new TypeError(`composition_port_manifest_duplicate:${manifest.element}`);
    for (const port of [...Object.values(manifest.outputs || {}), ...Object.values(manifest.inputs || {})]) {
      if (!knownValueType(port.value)) throw new TypeError(`composition_port_value_type_unknown:${port.value}`);
    }
    elements.set(manifest.element, (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)(manifest));
  }
  const bindings = new Map(Object.entries(options.bindings || {}));
  for (const [type, element] of bindings) {
    if (!elements.has(element)) throw new TypeError(`composition_port_binding_unknown:${type}`);
  }
  return { elements, bindings };
}

function portsForType(typeManifest, ports) {
  if (!typeManifest || !ports) return null;
  const bound = ports.bindings.get(typeManifest.type);
  if (bound) return ports.elements.get(bound) || null;
  if (typeManifest.renderer?.kind === 'custom-element') return ports.elements.get(typeManifest.renderer.name) || null;
  return null;
}

function validEndpointExtension(extension) {
  return (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(extension) && Object.keys(extension).length === 1
    && typeof extension.name === 'string' && NAME_PATTERN.test(extension.name);
}

function endpointName(node) {
  const extension = own(node?.extensions, ENDPOINT_EXTENSION) ? node.extensions[ENDPOINT_EXTENSION] : undefined;
  return validEndpointExtension(extension) ? extension.name : undefined;
}

function collectScope(scopeNode, path) {
  const endpoints = new Map();
  const problems = [];
  const visit = (node, nodePath, nested) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node)) return;
    if (node !== scopeNode) {
      const extension = own(node.extensions, ENDPOINT_EXTENSION) ? node.extensions[ENDPOINT_EXTENSION] : undefined;
      // Shape errors are reported once for every node by resolveRoutes.
      if (validEndpointExtension(extension) && !nested) {
        if (endpoints.has(extension.name)) {
          problems.push(diagnostic('route_endpoint_duplicate', `${nodePath}.extensions.${ENDPOINT_EXTENSION}`, `Endpoint ${extension.name} is declared twice in one scope`));
        } else {
          endpoints.set(extension.name, { node, path: nodePath });
        }
      }
      // A nested scope encapsulates its own endpoints.
      if (node.type === 'layout.scope') nested = true;
    }
    for (const [slotName, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (Array.isArray(children)) children.forEach((child, index) => visit(child, `${nodePath}.slots.${slotName}[${index}]`, nested));
    }
  };
  visit(scopeNode, path, false);
  return { endpoints, problems };
}

function findCycle(edges) {
  const graph = new Map();
  for (const [from, to] of edges) {
    if (!graph.has(from)) graph.set(from, new Set());
    graph.get(from).add(to);
  }
  const state = new Map();
  const walk = (node) => {
    state.set(node, 'active');
    for (const next of graph.get(node) || []) {
      if (state.get(next) === 'active') return true;
      if (!state.has(next) && walk(next)) return true;
    }
    state.set(node, 'done');
    return false;
  };
  return [...graph.keys()].some((node) => !state.has(node) && walk(node));
}

/**
 * Resolves and validates every layout.scope in a Document. Returns a map of
 * scope node id to typed routes; problems are appended to diagnostics.
 */
function resolveRoutes(root, registry, ports, diagnostics = []) {
  const resolved = new Map();
  const visit = (node, path, scopeDepth) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node)) return;
    if (own(node.extensions, ENDPOINT_EXTENSION) && !validEndpointExtension(node.extensions[ENDPOINT_EXTENSION])) {
      diagnostics.push(diagnostic('route_endpoint_invalid', `${path}.extensions.${ENDPOINT_EXTENSION}`, 'Endpoint extension must contain only a valid name'));
    }
    let depth = scopeDepth;
    if (node.type === 'layout.scope') {
      depth += 1;
      if (depth > ROUTING_LIMITS.maxScopeNesting) diagnostics.push(diagnostic('scope_nesting_limit', path, 'Routing scopes are nested too deeply'));
      const routes = Array.isArray(node.props?.routes) ? node.props.routes : [];
      const { endpoints, problems } = collectScope(node, path);
      diagnostics.push(...problems);
      if (endpoints.size > ROUTING_LIMITS.maxEndpointsPerScope) diagnostics.push(diagnostic('route_limit', path, 'Scope declares too many endpoints'));
      const ids = new Set();
      const inputs = new Set();
      const fanOut = new Map();
      const edges = [];
      const typed = [];
      routes.forEach((route, index) => {
        const routePath = `${path}.props.routes[${index}]`;
        if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(route) || !(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(route.from) || !(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(route.to)) return;
        if (ids.has(route.id)) diagnostics.push(diagnostic('route_id_duplicate', `${routePath}.id`, `Route ${route.id} is declared twice`));
        ids.add(route.id);
        const ends = {};
        for (const side of ['from', 'to']) {
          const endpoint = typeof route[side].endpoint === 'string' ? endpoints.get(route[side].endpoint) : undefined;
          if (!endpoint) {
            diagnostics.push(diagnostic('route_endpoint_unknown', `${routePath}.${side}.endpoint`, `Endpoint ${route[side].endpoint} is not declared in this scope`));
            continue;
          }
          const portManifest = portsForType(registry.types.get(endpoint.node.type), ports);
          const direction = side === 'from' ? 'outputs' : 'inputs';
          const opposite = side === 'from' ? 'inputs' : 'outputs';
          const port = own(portManifest?.[direction], route[side].port) ? portManifest[direction][route[side].port] : undefined;
          if (!port) {
            const wrongDirection = own(portManifest?.[opposite], route[side].port);
            diagnostics.push(wrongDirection
              ? diagnostic('route_port_direction', `${routePath}.${side}.port`, `${route[side].port} is not ${side === 'from' ? 'an output' : 'an input'}`)
              : diagnostic('route_port_unknown', `${routePath}.${side}.port`, `${endpoint.node.type} publishes no ${side === 'from' ? 'output' : 'input'} ${route[side].port}`));
            continue;
          }
          ends[side] = { endpoint: route[side].endpoint, port: route[side].port, value: port.value, element: portManifest.element };
        }
        if (route.from.endpoint === route.to.endpoint) diagnostics.push(diagnostic('route_self', routePath, 'A route cannot connect an endpoint to itself'));
        const inputKey = `${route.to.endpoint}.${route.to.port}`;
        if (inputs.has(inputKey)) diagnostics.push(diagnostic('route_input_conflict', `${routePath}.to`, `Input ${inputKey} already has a route`));
        inputs.add(inputKey);
        const outputKey = `${route.from.endpoint}.${route.from.port}`;
        fanOut.set(outputKey, (fanOut.get(outputKey) || 0) + 1);
        if (fanOut.get(outputKey) > ROUTING_LIMITS.maxFanOut) diagnostics.push(diagnostic('route_fanout_limit', `${routePath}.from`, `Output ${outputKey} feeds too many routes`));
        edges.push([route.from.endpoint, route.to.endpoint]);
        if (ends.from && ends.to) {
          if (ends.from.value !== ends.to.value) diagnostics.push(diagnostic('route_type_mismatch', routePath, `${ends.from.value} cannot feed ${ends.to.value}`));
          else typed.push({ id: route.id, from: ends.from, to: ends.to });
        }
      });
      if (findCycle(edges.filter(([from, to]) => from !== to))) diagnostics.push(diagnostic('route_cycle', `${path}.props.routes`, 'Routes form a cycle between endpoints'));
      resolved.set(node.id, typed);
    }
    for (const [slotName, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (Array.isArray(children)) children.forEach((child, index) => visit(child, `${path}.slots.${slotName}[${index}]`, depth));
    }
  };
  visit(root, '$.root', 0);
  return resolved;
}

/**
 * DOM-independent route controller used by sf-composition-scope. The host is
 * any EventTarget; endpoints are resolved lazily on every delivery so that
 * removed and remounted children never keep stale references.
 */
class CompositionRouteController {
  constructor(host, routes, options = {}) {
    this.host = host;
    this.routes = Object.freeze(routes.map((route) => Object.freeze({ ...route, from: Object.freeze({ ...route.from }), to: Object.freeze({ ...route.to }) })));
    this.options = options;
    this.sequence = 0;
    this.depth = 0;
    this.states = new Map();
    this.pending = new Map();
    this.counters = { outputs: 0, deliveries: 0, settled: 0, stale: 0, rejected: 0 };
    this.connection = null;
    this.onOutput = this.onOutput.bind(this);
  }

  get connected() {
    return this.connection !== null;
  }

  connect() {
    if (this.connection) return false;
    this.connection = new AbortController();
    this.host.addEventListener(PORT_OUTPUT_EVENT, this.onOutput, { signal: this.connection.signal });
    for (const route of this.routes) this.setState(route.id, { status: 'idle', sequence: 0 });
    return true;
  }

  disconnect() {
    if (!this.connection) return false;
    this.connection.abort();
    this.connection = null;
    for (const controller of this.pending.values()) controller.abort();
    this.pending.clear();
    for (const route of this.routes) this.setState(route.id, { status: 'disposed', sequence: this.states.get(route.id)?.sequence || 0 });
    return true;
  }

  getState(routeId) {
    const state = this.states.get(routeId);
    return state ? { ...state } : null;
  }

  setState(routeId, state) {
    const next = Object.freeze({ route: routeId, ...state });
    this.states.set(routeId, next);
    this.options.onState?.(next);
  }

  onOutput(event) {
    const source = this.options.sourceEndpoint?.(event);
    if (!source) return;
    const detail = event.detail;
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(detail) || typeof detail.port !== 'string') return;
    this.counters.outputs += 1;
    for (const route of this.routes) {
      if (route.from.endpoint !== source || route.from.port !== detail.port) continue;
      let value;
      try {
        value = checkPortValue(route.from.value, detail.value);
      } catch {
        // The newest output wins even when invalid: an older pending delivery
        // for this route becomes stale and cannot settle afterwards.
        this.counters.rejected += 1;
        this.pending.get(route.id)?.abort();
        this.pending.delete(route.id);
        this.setState(route.id, { status: 'error', error: 'value_invalid', sequence: ++this.sequence });
        continue;
      }
      this.deliver(route, value);
    }
  }

  deliver(route, value) {
    if (!this.connection) return;
    const sequence = ++this.sequence;
    this.pending.get(route.id)?.abort();
    const abort = new AbortController();
    this.pending.set(route.id, abort);
    this.setState(route.id, { status: 'pending', sequence });
    const isLatest = () => this.connection !== null && !abort.signal.aborted && this.states.get(route.id)?.sequence === sequence;
    const meta = Object.freeze({ route: route.id, sequence, signal: abort.signal, isLatest });
    const attempt = () => {
      if (!isLatest()) return;
      const target = this.options.targetEndpoint?.(route.to.endpoint);
      if (!target) {
        this.setState(route.id, { status: 'error', error: 'endpoint_unresolved', sequence });
        return;
      }
      if (typeof target.sfPortInput !== 'function') {
        const ready = this.options.whenReady?.(target);
        if (ready) {
          this.setState(route.id, { status: 'waiting', sequence });
          ready.then(attempt, () => this.setState(route.id, { status: 'error', error: 'endpoint_unavailable', sequence }));
        } else {
          this.setState(route.id, { status: 'error', error: 'port_unsupported', sequence });
        }
        return;
      }
      const declared = target.constructor?.sfPorts?.inputs?.[route.to.port];
      if (declared !== route.to.value) {
        this.counters.rejected += 1;
        this.setState(route.id, { status: 'error', error: 'port_mismatch', sequence });
        return;
      }
      if (this.depth >= ROUTING_LIMITS.maxReentrancy) {
        this.counters.rejected += 1;
        this.setState(route.id, { status: 'error', error: 'reentrancy_limit', sequence });
        return;
      }
      this.depth += 1;
      let result;
      try {
        this.counters.deliveries += 1;
        result = target.sfPortInput(route.to.port, value, meta);
      } catch {
        this.depth -= 1;
        this.counters.rejected += 1;
        this.setState(route.id, { status: 'error', error: 'port_rejected', sequence });
        return;
      }
      this.depth -= 1;
      if (result && typeof result.then === 'function') {
        this.setState(route.id, { status: 'pending', sequence });
        result.then(() => {
          if (!isLatest()) { this.counters.stale += 1; return; }
          this.counters.settled += 1;
          this.pending.delete(route.id);
          this.setState(route.id, { status: 'settled', sequence });
        }, () => {
          if (!isLatest()) { this.counters.stale += 1; return; }
          this.setState(route.id, { status: 'error', error: 'port_rejected', sequence });
        });
      } else {
        this.counters.settled += 1;
        this.pending.delete(route.id);
        this.setState(route.id, { status: 'settled', sequence });
      }
    };
    attempt();
  }
}

function nearestScope(element) {
  return element?.parentElement?.closest?.('sf-composition-scope') || null;
}

const isCustom = (element) => typeof element?.localName === 'string' && element.localName.includes('-');
const upgradePending = (element) => isCustom(element) && !globalThis.customElements?.get(element.localName);

// The endpoint element either implements the port protocol itself or wraps
// exactly one port element that belongs to the same scope.
function portElement(endpointElement, scope) {
  if (typeof endpointElement.sfPortInput === 'function' || upgradePending(endpointElement)) return endpointElement;
  const candidates = [...endpointElement.querySelectorAll('*')]
    .filter((element) => isCustom(element) && element.localName !== 'sf-composition-scope' && nearestScope(element) === scope);
  const implemented = candidates.filter((element) => typeof element.sfPortInput === 'function');
  if (implemented.length === 1) return implemented[0];
  const pending = candidates.filter(upgradePending);
  return implemented.length === 0 && pending.length === 1 ? pending[0] : null;
}

function parseRoutesAttribute(value) {
  let parsed;
  try { parsed = JSON.parse(value || '[]'); } catch { return null; }
  if (!Array.isArray(parsed) || parsed.length > ROUTING_LIMITS.maxRoutesPerScope) return null;
  const ids = new Set();
  for (const route of parsed) {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(route) || typeof route.id !== 'string' || !ROUTE_ID_PATTERN.test(route.id)) return null;
    for (const side of ['from', 'to']) {
      const end = route[side];
      if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(end) || typeof end.endpoint !== 'string' || typeof end.port !== 'string'
        || !NAME_PATTERN.test(end.endpoint) || !NAME_PATTERN.test(end.port) || !knownValueType(end.value)) return null;
    }
    if (route.from.value !== route.to.value || ids.has(route.id)) return null;
    ids.add(route.id);
  }
  return parsed;
}

function defineCompositionScope(registry = globalThis.customElements) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-composition-scope');
  if (existing) return existing;
  class SfCompositionScope extends globalThis.HTMLElement {
    constructor() {
      super();
      this.routeController = null;
      this.routeDiagnostics = [];
    }

    connectedCallback() {
      if (!this.routeController) {
        const routes = parseRoutesAttribute(this.getAttribute('data-sf-routes'));
        if (!routes) {
          this.routeDiagnostics = [{ code: 'routes_invalid', path: 'data-sf-routes', message: 'Rendered routes are invalid' }];
          this.setAttribute('data-sf-routing', 'error');
          return;
        }
        this.routeController = new CompositionRouteController(this, routes, {
          sourceEndpoint: (event) => {
            const origin = event.target?.closest?.('[data-sf-endpoint]');
            if (!origin || nearestScope(origin) !== this || portElement(origin, this) !== event.target) return null;
            return origin.getAttribute('data-sf-endpoint');
          },
          targetEndpoint: (name) => {
            const matches = [...this.querySelectorAll('[data-sf-endpoint]')]
              .filter((element) => element.getAttribute('data-sf-endpoint') === name && nearestScope(element) === this);
            return matches.length === 1 ? portElement(matches[0], this) : null;
          },
          whenReady: (element) => (element.localName?.includes('-') && globalThis.customElements
            ? globalThis.customElements.whenDefined(element.localName)
            : null),
          onState: (state) => this.dispatchEvent(new globalThis.CustomEvent(ROUTE_STATE_EVENT, { detail: state })),
        });
      }
      this.routeController.connect();
      this.setAttribute('data-sf-routing', 'connected');
    }

    disconnectedCallback() {
      this.routeController?.disconnect();
      if (this.routeController) this.setAttribute('data-sf-routing', 'disposed');
    }

    getRouteState(routeId) {
      return this.routeController?.getState(routeId) || null;
    }

    getRoutingCounters() {
      return this.routeController ? { ...this.routeController.counters } : null;
    }
  }
  registry.define('sf-composition-scope', SfCompositionScope);
  return SfCompositionScope;
}

function routesAttribute(routes) {
  return (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(routes.map((route) => ({
    id: route.id,
    from: { endpoint: route.from.endpoint, port: route.from.port, value: route.from.value },
    to: { endpoint: route.to.endpoint, port: route.to.port, value: route.to.value },
  })));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ CompositionRouteController, checkPortValue, createPortRegistry, defineCompositionScope, resolveRoutes });


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