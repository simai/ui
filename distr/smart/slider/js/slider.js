/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "4130d35a368a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeSlideContent: () => (/* binding */ normalizeSlideContent)
/* harmony export */ });
// Ignore source formatting, not authored slide boundaries. Non-Node values are
// retained for the existing Slider template context (including Lit results).
function normalizeSlideContent(content) {
  const items = Array.isArray(content) ? content : [content];
  return items.filter(item => {
    if (!(item instanceof Node)) return true;
    if (item.nodeType === Node.COMMENT_NODE) return false;
    return item.nodeType !== Node.TEXT_NODE || item.textContent.trim() !== '';
  });
}

/***/ },

/***/ "9e5aefb3c7c5"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindSlider: () => (/* binding */ bindSlider),
/* harmony export */   initExistingSliders: () => (/* binding */ initExistingSliders),
/* harmony export */   refreshSlider: () => (/* binding */ refreshSlider),
/* harmony export */   unbindSlider: () => (/* binding */ unbindSlider)
/* harmony export */ });
const SLIDER_SELECTOR = '.sf-slider';
const SLIDER_BOUND_FLAG = 'sfSliderBound';
const SLIDER_WAITING_FLAG = 'sfSliderWaiting';
const SWIPER_NESTED_OPTION_PREFIXES = ['a11y', 'autoplay', 'cardsEffect', 'coverflowEffect', 'creativeEffect', 'cubeEffect', 'fadeEffect', 'flipEffect', 'freeMode', 'grid', 'keyboard', 'mousewheel', 'scrollbar', 'thumbs', 'virtual'];

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function toNumber(value, fallback) {
  const parsed = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toSlidesPerView(value, fallback = 1) {
  if (String(value || '').trim().toLowerCase() === 'auto') return 'auto';
  return toNumber(value, fallback);
}

function resolveCssLength(element, property, fallback = 0) {
  if (!(element instanceof HTMLElement)) return fallback;
  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = ['position:absolute', 'visibility:hidden', 'pointer-events:none', 'inline-size:0', `margin-inline-start:var(${property})`].join(';');
  element.append(probe);
  const value = Number.parseFloat(getComputedStyle(probe).marginInlineStart);
  probe.remove();
  return Number.isFinite(value) ? value : fallback;
}

function resolveCssDuration(element, property, fallback = 300) {
  if (!(element instanceof HTMLElement)) return fallback;
  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = ['position:absolute', 'visibility:hidden', 'pointer-events:none', `transition-duration:var(${property})`].join(';');
  element.append(probe);
  const value = getComputedStyle(probe).transitionDuration.trim();
  probe.remove();
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return value.endsWith('ms') ? parsed : parsed * 1000;
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getOption(root, element, name) {
  return element?.dataset?.[name] ?? root?.dataset?.[name];
}

function lowerFirst(value = '') {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : '';
}

function parseDataValue(value) {
  const normalized = String(value ?? '').trim();
  if (normalized === '') return '';
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  if (normalized === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(normalized)) return Number(normalized);

  if (normalized.startsWith('{') && normalized.endsWith('}') || normalized.startsWith('[') && normalized.endsWith(']')) {
    try {
      return JSON.parse(normalized);
    } catch (error) {
      console.warn('SF slider: invalid data-swiper-options JSON', error);
    }
  }

  return normalized;
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Element);
}

function deepMerge(target = {}, source = {}) {
  const result = { ...target
  };
  Object.entries(source || {}).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key], value);
      return;
    }

    result[key] = value;
  });
  return result;
}

function setSwiperDataOption(options, datasetKey, value) {
  if (!datasetKey.startsWith('swiper') || datasetKey === 'swiperOptions') {
    return;
  }

  const optionName = lowerFirst(datasetKey.slice('swiper'.length));
  if (!optionName) return;
  const nestedPrefix = SWIPER_NESTED_OPTION_PREFIXES.find(prefix => {
    const rest = optionName.slice(prefix.length);
    return optionName === prefix || optionName.startsWith(prefix) && /^[A-Z]/.test(rest);
  });

  if (nestedPrefix && optionName !== nestedPrefix) {
    const nestedName = lowerFirst(optionName.slice(nestedPrefix.length));
    options[nestedPrefix] = { ...(isPlainObject(options[nestedPrefix]) ? options[nestedPrefix] : {}),
      [nestedName]: value
    };
    return;
  }

  options[optionName] = value;
}

function collectSwiperDataOptions(...elements) {
  return elements.reduce((options, element) => {
    if (!element?.dataset) return options;

    if (element.dataset.swiperOptions) {
      const parsedOptions = parseDataValue(element.dataset.swiperOptions);

      if (isPlainObject(parsedOptions)) {
        options = deepMerge(options, parsedOptions);
      }
    }

    Object.entries(element.dataset).forEach(([key, value]) => {
      setSwiperDataOption(options, key, parseDataValue(value));
    });
    return options;
  }, {});
}

function normalizeAutoplayOptions(options = {}) {
  if (options.autoplay === true) {
    options.autoplay = {
      enabled: true
    };
  } else if (isPlainObject(options.autoplay)) {
    options.autoplay = {
      enabled: true,
      ...options.autoplay
    };
  }

  return options;
}

function createPaginationOptions(paginationEl) {
  if (!paginationEl) return undefined;
  return {
    el: paginationEl,
    bulletActiveClass: 'active',
    bulletClass: 'sf-slider-dots-dot',
    bulletElement: 'button',
    clickable: true
  };
}

function createNavigationOptions(prevEl, nextEl) {
  if (!prevEl && !nextEl) return undefined;
  return {
    disabledClass: 'swiper-button-disabled',
    hiddenClass: 'swiper-button-hidden',
    lockClass: 'swiper-button-lock',
    nextEl,
    prevEl
  };
} // The Framework's slider takes no `thumbs` option, so a thumbnail was a picture
// that did nothing. A thumbnail moves the main slider to its slide, and the one
// shown is marked.


function linkThumbnails(slider, thumbs) {
  if (!slider || !thumbs?.slides?.length) return () => {};

  const mark = () => {
    thumbs.slides.forEach((slide, index) => {
      const active = index === slider.activeIndex;
      slide.classList.toggle('swiper-slide-thumb-active', active);
      if (active) slide.setAttribute('aria-current', 'true');else slide.removeAttribute('aria-current');
    });
  };

  const listeners = thumbs.slides.map((slide, index) => {
    const listener = () => slider.slideTo(index);

    slide.addEventListener('click', listener);
    return [slide, listener];
  });
  slider.on?.('slideChange', mark);
  mark();
  return () => {
    listeners.forEach(([slide, listener]) => slide.removeEventListener('click', listener));
    slider.off?.('slideChange', mark);
  };
}

function getNavigationLabels(prevEl, nextEl) {
  return [[prevEl, 'prevSlideMessage'], [nextEl, 'nextSlideMessage']].filter(([element]) => element instanceof Element).map(([element, message]) => ({
    element,
    message,
    authored: element.getAttribute('aria-label')
  }));
}

function applyNavigationLabelDefaults(options, labels) {
  if (options.a11y === false) return;
  const defaults = {};
  labels.forEach(({
    message,
    authored
  }) => {
    if (authored?.trim()) defaults[message] = authored;
  });
  options.a11y = { ...defaults,
    ...(isPlainObject(options.a11y) ? options.a11y : {})
  };
}

function createAutoplayOptions(root, element) {
  const autoplay = toBoolean(getOption(root, element, 'autoplay'), false);
  if (!autoplay) return undefined;
  return {
    enabled: true,
    delay: toNumber(getOption(root, element, 'autoplayDelay'), 3000),
    disableOnInteraction: toBoolean(getOption(root, element, 'autoplayDisableOnInteraction'), true),
    pauseOnMouseEnter: toBoolean(getOption(root, element, 'autoplayPauseOnMouseEnter'), false),
    reverseDirection: toBoolean(getOption(root, element, 'autoplayReverseDirection'), false),
    stopOnLastSlide: toBoolean(getOption(root, element, 'autoplayStopOnLastSlide'), false)
  };
}

function createBaseOptions(root, element, fallbackSlidesPerView = 1) {
  let options = {
    centeredSlides: toBoolean(getOption(root, element, 'centeredSlides'), false),
    loop: toBoolean(getOption(root, element, 'loop'), false),
    slidesPerView: toSlidesPerView(getOption(root, element, 'slidesPerView'), fallbackSlidesPerView),
    spaceBetween: toNumber(getOption(root, element, 'spaceBetween'), resolveCssLength(root, '--sf-slider--space-between', 0)),
    speed: toNumber(getOption(root, element, 'speed'), resolveCssDuration(root, '--sf-slider--duration', 300)),
    watchSlidesProgress: true
  };
  const autoplay = createAutoplayOptions(root, element);

  if (autoplay) {
    options.autoplay = autoplay;
  }

  options = deepMerge(options, collectSwiperDataOptions(root, element));

  if (prefersReducedMotion()) {
    options.speed = 0;
    delete options.autoplay;
  }

  return normalizeAutoplayOptions(options);
}

function createSlideInteractivityGuard(slider) {
  const authoredState = new Map();

  const sync = () => {
    const slides = Array.from(slider?.slides || []);
    slides.forEach(slide => {
      if (!(slide instanceof HTMLElement)) return;

      if (!authoredState.has(slide)) {
        authoredState.set(slide, slide.hasAttribute('inert'));
      }

      const reachable = slide.classList.contains('swiper-slide-visible') || slide.classList.contains('swiper-slide-active');

      if (!reachable) {
        slide.setAttribute('inert', '');
      } else if (!authoredState.get(slide)) {
        slide.removeAttribute('inert');
      }
    });
  };

  ['init', 'slideChange', 'transitionEnd', 'update', 'resize'].forEach(event => {
    slider?.on?.(event, sync);
  });
  sync();
  return () => {
    ['init', 'slideChange', 'transitionEnd', 'update', 'resize'].forEach(event => {
      slider?.off?.(event, sync);
    });
    authoredState.forEach((authored, slide) => {
      if (!slide.isConnected) return;
      if (authored) slide.setAttribute('inert', '');else slide.removeAttribute('inert');
    });
  };
}

function createAutoplayGuard(root, slider) {
  if (!slider?.autoplay || prefersReducedMotion()) return () => {};
  const pauseReasons = new Set();
  let resumeOwned = false;

  const pause = reason => {
    pauseReasons.add(reason);
    if (!slider.autoplay.running) return;
    resumeOwned = true;
    slider.autoplay.stop();
  };

  const resume = reason => {
    pauseReasons.delete(reason);
    if (!resumeOwned || pauseReasons.size || !root.isConnected) return;
    resumeOwned = false;
    slider.autoplay.start();
  };

  const onFocusIn = () => pause('focus');

  const onFocusOut = event => {
    if (!root.contains(event.relatedTarget)) resume('focus');
  };

  const onVisibilityChange = () => {
    if (document.hidden) pause('visibility');else resume('visibility');
  };

  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('focusout', onFocusOut);
  document.addEventListener('visibilitychange', onVisibilityChange);
  onVisibilityChange();
  return () => {
    root.removeEventListener('focusin', onFocusIn);
    root.removeEventListener('focusout', onFocusOut);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

function getSlidesCount(element) {
  return element?.querySelectorAll?.('.swiper-wrapper > .swiper-slide')?.length || 0;
}

function hasPendingSmartArrowRender(root) {
  const arrowHosts = Array.from(root.querySelectorAll?.('sf-icon-button[root-class*="sf-slider-button-"]') || []);
  if (!arrowHosts.length) return false;
  return arrowHosts.some(host => !host.querySelector('.sf-icon-button'));
}

function waitForSliderReady(root) {
  if (root.dataset[SLIDER_WAITING_FLAG] === 'true') return null;
  root.dataset[SLIDER_WAITING_FLAG] = 'true';
  let attempts = 0;

  const retry = () => {
    if (!document.documentElement.contains(root)) {
      delete root.dataset[SLIDER_WAITING_FLAG];
      return;
    }

    if (typeof window.Swiper === 'function' && !hasPendingSmartArrowRender(root)) {
      delete root.dataset[SLIDER_WAITING_FLAG];
      bindSlider(root);
      return;
    }

    attempts += 1;

    if (attempts < 40) {
      window.setTimeout(retry, 50);
    } else {
      delete root.dataset[SLIDER_WAITING_FLAG];
    }
  };

  window.setTimeout(retry, 0);
  return null;
}

function bindSlider(root) {
  if (!(root instanceof HTMLElement)) return null;
  if (root.dataset[SLIDER_BOUND_FLAG] === 'true') return root._sfSlider;

  if (typeof window === 'undefined' || typeof window.Swiper !== 'function') {
    return waitForSliderReady(root);
  }

  const mainEl = root.querySelector('.sf-slider-main.swiper, .swiper');
  if (!(mainEl instanceof HTMLElement)) return null;

  if (hasPendingSmartArrowRender(root)) {
    return waitForSliderReady(root);
  }

  const prevEl = root.querySelector('.sf-slider-button-prev');
  const nextEl = root.querySelector('.sf-slider-button-next');
  const paginationEl = root.querySelector('.sf-slider-pagination');
  const thumbsEl = root.querySelector('.sf-slider-thumbnails.swiper');
  let thumbs = null;
  const thumbsCount = getSlidesCount(thumbsEl);

  if (thumbsEl instanceof HTMLElement && thumbsCount > 0) {
    thumbs = new window.Swiper(thumbsEl, { ...createBaseOptions(root, thumbsEl, Math.min(thumbsCount, 6)),
      loop: false,
      centeredSlides: false,
      spaceBetween: toNumber(getOption(root, thumbsEl, 'spaceBetween'), resolveCssLength(root, '--sf-slider-thumbnails--space-between', 0)),
      slidesPerView: Math.min(thumbsCount, 6),
      slideToClickedSlide: false
    });
  }

  const sliderOptions = { ...createBaseOptions(root, mainEl, 1)
  };
  const navigation = createNavigationOptions(prevEl, nextEl);
  const pagination = createPaginationOptions(paginationEl);

  if (navigation) {
    sliderOptions.navigation = navigation;
  }

  if (pagination) {
    sliderOptions.pagination = pagination;
  }

  if (thumbs) {
    sliderOptions.thumbs = {
      swiper: thumbs
    };
  }

  const navigationLabels = getNavigationLabels(prevEl, nextEl);
  applyNavigationLabelDefaults(sliderOptions, navigationLabels);
  const slider = new window.Swiper(mainEl, sliderOptions);
  root._sfSliderCleanup = [createSlideInteractivityGuard(slider), createAutoplayGuard(root, slider), linkThumbnails(slider, thumbs)];
  root._sfSliderNavigationLabels = navigationLabels.map(label => ({ ...label,
    applied: label.element.getAttribute('aria-label')
  }));
  root.dataset[SLIDER_BOUND_FLAG] = 'true';
  root._sfSlider = slider;
  root._sfSliderThumbs = thumbs;
  return slider;
}

function refreshSlider(root) {
  if (!(root instanceof HTMLElement)) return null;
  const slider = root._sfSlider || bindSlider(root);
  if (!slider) return null;
  root._sfSliderThumbs?.update?.();
  slider.update?.();
  slider.navigation?.update?.();
  slider.pagination?.update?.();

  if (typeof slider.activeIndex === 'number') {
    slider.slideTo?.(slider.activeIndex, 0, false);
  }

  return slider;
}

function unbindSlider(root) {
  if (!(root instanceof HTMLElement)) return;
  root._sfSliderCleanup?.forEach(cleanup => cleanup());
  root._sfSlider?.destroy?.(true, true);
  root._sfSliderThumbs?.destroy?.(true, true);
  root._sfSliderNavigationLabels?.forEach(({
    element,
    authored,
    applied
  }) => {
    // Do not undo a later author edit; restore only the value owned by Swiper.
    if (element.getAttribute('aria-label') !== applied) return;
    if (authored === null) element.removeAttribute('aria-label');else element.setAttribute('aria-label', authored);
  });
  delete root._sfSliderNavigationLabels;
  delete root._sfSliderCleanup;
  delete root._sfSlider;
  delete root._sfSliderThumbs;
  delete root.dataset[SLIDER_BOUND_FLAG];
}

function initSliderTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(SLIDER_SELECTOR)) {
    bindSlider(target);
  }

  target.querySelectorAll?.(SLIDER_SELECTOR).forEach(bindSlider);
}

function initExistingSliders(scope = document) {
  initSliderTree(scope);
}

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Slider = window.SF.Slider || {};
  window.SF.Slider.bind = bindSlider;
  window.SF.Slider.refresh = refreshSlider;
  window.SF.Slider.unbind = unbindSlider;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingSliders());
} else {
  initExistingSliders();
}

const sliderObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initSliderTree(node);
    });
  });
});
sliderObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "51896d04b17d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_slider_js_slider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("9e5aefb3c7c5");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("c43a175b4439");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("85a15fb0aee7");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2487a822fc8d");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("dd6cee132a1d");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("c9b3780c37ac");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);








 // sf-slider from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8): its settings are attributes and properties made by
// core/js/element-manifest.js, the arrows' words are lang/<locale>.json (a
// product adds a language through SF.language.register("sf-slider", code,
// words)), and sf-slide-change and getSlider() are dated rows of aliases.json.

const SliderElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
});
const FORWARDED_SLIDER_DATA_ATTRIBUTES = new Set(['data-autoplay', 'data-autoplay-delay', 'data-autoplay-disable-on-interaction', 'data-autoplay-pause-on-mouse-enter', 'data-autoplay-reverse-direction', 'data-autoplay-stop-on-last-slide', 'data-centered-slides', 'data-loop', 'data-slides-per-view', 'data-space-between', 'data-speed']);

class SfSlider extends SliderElement {
  static get props() {
    return { ...super.props,
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
    this._boundSlider = null;
    this._sliderInitToken = 0;
  }

  get slides() {
    return this.getSlotContent('slide');
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      rootClass: this.getRootClass(),
      slides: this.slides,
      previousLabel: this.sfWord('previous'),
      nextLabel: this.sfWord('next')
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderSliderTemplate)(this.templateContext());
  }

  resolveUpdateMode(changedAttributes = []) {
    const cosmetic = ['class', 'root-class', 'style', 'root-style'];
    if ((this.getAttribute('template') || 'default') === 'default' && this._boundSlider && !this._boundSlider.destroyed && changedAttributes.length && changedAttributes.every(name => cosmetic.includes(name))) return 'dom';
    return 'lit';
  }

  updateDom() {
    const root = this._boundRoot;
    if (!root || root !== this.querySelector('.sf-slider')) return false;
    root.className = ['sf-slider', this.getRootClass()].filter(Boolean).join(' ');
    const style = this.getRootStyle();
    if (style) root.setAttribute('style', style);else root.removeAttribute('style'); // Keep slides, focus and Swiper ownership; only recalculate their layout.

    (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_3__.refreshSlider)(root);
    return true;
  }

  async waitForSliderControls(root) {
    const arrowHosts = () => Array.from(root?.querySelectorAll?.('sf-icon-button[root-class*="sf-slider-button-"]') || []);

    if (!arrowHosts().length) {
      return;
    }

    if (arrowHosts().every(host => host.querySelector('.sf-icon-button'))) {
      return;
    }

    await new Promise(resolve => {
      const finish = () => {
        observer.disconnect();
        clearTimeout(timeoutId);
        resolve();
      };

      const observer = new MutationObserver(() => {
        if (arrowHosts().every(host => host.querySelector('.sf-icon-button'))) {
          finish();
        }
      });
      const timeoutId = setTimeout(finish, Number(this.constructor.styleReadyTimeout) || 3000);
      observer.observe(root, {
        childList: true,
        subtree: true
      });
    });
  }

  forwardSliderDataAttributes(root) {
    if (!root) return;
    Array.from(this.attributes || []).forEach(({
      name,
      value
    }) => {
      if (name === 'data-swiper-options' || name.startsWith('data-swiper-') || FORWARDED_SLIDER_DATA_ATTRIBUTES.has(name)) {
        root.setAttribute(name, value);
      }
    });
  }

  async afterRender(changedAttributes = []) {
    if (typeof changedAttributes === 'function') return super.afterRender(changedAttributes);
    const initToken = ++this._sliderInitToken;

    if (!this.isConnected || initToken !== this._sliderInitToken) {
      return;
    }

    if (this._boundRoot) {
      this.detachSliderEvents();
      (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_3__.unbindSlider)(this._boundRoot);
      this._boundRoot = null;
      this._boundSlider = null;
    }

    this._boundRoot = this.querySelector('.sf-slider');
    if (!this._boundRoot) return;
    this.forwardSliderDataAttributes(this._boundRoot);
    await this.waitForSliderControls(this._boundRoot);

    if (!this.isConnected || initToken !== this._sliderInitToken) {
      return;
    }

    (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_3__.unbindSlider)(this._boundRoot);
    this._boundSlider = (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_3__.bindSlider)(this._boundRoot);
    this.attachSliderEvents();
  }

  onDisconnected() {
    this._sliderInitToken++;

    if (this._boundRoot) {
      this.detachSliderEvents();
      (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_3__.unbindSlider)(this._boundRoot);
      this._boundRoot = null;
      this._boundSlider = null;
    }
  }

  attachSliderEvents() {
    if (!this._boundSlider?.on) return;

    this._boundSlider.on('slideChange', this._handleSlideChange);
  }

  detachSliderEvents() {
    if (!this._boundSlider?.off) return;

    this._boundSlider.off('slideChange', this._handleSlideChange);
  }

  _handleSlideChange = () => {
    const slider = this._boundSlider;
    if (!slider) return; // §8: the indexes only; sf-slide-change follows with the same detail.

    this.sfEmit('change', {
      activeIndex: slider.activeIndex,
      realIndex: slider.realIndex,
      previousIndex: slider.previousIndex
    });
  }; // §4.4: a reader retires; kept until the date and noted on each call.

  getSlider() {
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-slider',
      tag: 'sf-slider',
      kind: 'action',
      from: 'getSlider',
      to: null,
      since: _aliases_json__WEBPACK_IMPORTED_MODULE_6__.since,
      remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_6__.remove_after
    });
    return this._boundSlider || null;
  }

  refresh() {
    if (!this._boundRoot) {
      this._boundRoot = this.querySelector('.sf-slider');
    }

    if (this._boundRoot) {
      this.detachSliderEvents();
      this.forwardSliderDataAttributes(this._boundRoot);
      this._boundSlider = (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_3__.refreshSlider)(this._boundRoot);
      this.attachSliderEvents();
    }

    return {
      outcome: 'applied'
    };
  }

  slideNext() {
    if (!this._boundSlider?.slideNext) return {
      outcome: 'refused',
      reason: 'not-ready'
    };

    this._boundSlider.slideNext();

    return {
      outcome: 'applied'
    };
  }

  slidePrev() {
    if (!this._boundSlider?.slidePrev) return {
      outcome: 'refused',
      reason: 'not-ready'
    };

    this._boundSlider.slidePrev();

    return {
      outcome: 'applied'
    };
  }

  get state() {
    return {
      buttonType: this.buttonType,
      buttonSize: this.buttonSize,
      dots: this.dots,
      dotsType: this.dotsType,
      dotsSize: this.dotsSize,
      thumbs: this.thumbs,
      thumbsClass: this.thumbsClass,
      thumbClass: this.thumbClass,
      arrows: this.arrows,
      loop: this.loop,
      spaceBetween: this.spaceBetween,
      speed: this.speed,
      rootClass: this.getRootClass(),
      slideClass: this.slideClass
    };
  }

}

SfSlider.define('sf-slider');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c43a175b4439"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSliderTemplate: () => (/* binding */ renderSliderTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_slider_js_slide_content__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4130d35a368a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function normalizeOption(value = '') {
  return String(value || '').trim().toLowerCase();
}

function getButtonOptions(type = 'primary') {
  const normalizedType = normalizeOption(type);
  const options = {
    primary: {
      type: 'default',
      scheme: 'primary'
    },
    secondary: {
      type: 'tonal',
      scheme: 'secondary'
    },
    dark: {
      type: 'default',
      scheme: 'on-surface'
    },
    light: {
      type: 'link',
      scheme: 'on-surface'
    }
  };
  return options[normalizedType] || options.primary;
}

function getDotsClasses(type = 'primary-dark', size = '2') {
  const normalizedType = normalizeOption(type);
  const typeClasses = {
    primary: ['sf-slider-dots--primary', 'sf-slider-dots--dark'],
    'primary-light': ['sf-slider-dots--primary', 'sf-slider-dots--light'],
    'primary-dark': ['sf-slider-dots--primary', 'sf-slider-dots--dark'],
    light: ['sf-slider-dots--clear', 'sf-slider-dots--light'],
    dark: ['sf-slider-dots--clear', 'sf-slider-dots--dark'],
    clear: ['sf-slider-dots--clear', 'sf-slider-dots--light']
  };
  return joinClasses('sf-slider-dots', typeClasses[normalizedType] || typeClasses['primary-dark'], 'sf-slider-dots--framed', `sf-slider-dots--size-${size || '2'}`, 'flex', 'sf-slider-pagination');
}

function normalizeSlides(slides) {
  if (!slides || slides === lit__WEBPACK_IMPORTED_MODULE_0__.nothing) return [];
  return (0,_component_slider_js_slide_content__WEBPACK_IMPORTED_MODULE_1__.normalizeSlideContent)(slides);
}

function renderDefaultSlides() {
  return [(0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="radius-surface bg-primary color-on-primary p-2">
        Slide 1
      </div>
    `, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="radius-surface bg-secondary color-on-secondary p-2">
        Slide 2
      </div>
    `, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="radius-surface bg-tertiary color-on-tertiary p-2">
        Slide 3
      </div>
    `];
}

function cloneSlide(slide) {
  if (slide instanceof Node) {
    return slide.cloneNode(true);
  }

  return slide;
}

function stripThumbnailStyles(node) {
  if (!(node instanceof Element)) return node;
  [node, ...node.querySelectorAll('*')].forEach(element => {
    element.removeAttribute('class');
    element.removeAttribute('style');
  });
  return node;
}

function createThumbnailContent(slide) {
  const clone = cloneSlide(slide);
  if (!(clone instanceof Element)) return clone;
  const mediaSelector = 'img, picture, video';
  const media = clone.matches(mediaSelector) ? clone : clone.querySelector(mediaSelector);
  if (!media) return clone;
  return stripThumbnailStyles(media.cloneNode(true));
}

function renderSlides(context) {
  const slides = normalizeSlides(context.slides);
  const items = slides.length ? slides : renderDefaultSlides();
  return items.map(slide => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="swiper-slide">
        <div class=${joinClasses('sf-slider-slide', context.slideClass)}>
          ${slide}
        </div>
      </div>
    `);
}

function renderThumbSlides(context) {
  const slides = normalizeSlides(context.slides);
  const items = slides.length ? slides.map(createThumbnailContent) : renderDefaultSlides();
  return items.map(slide => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="swiper-slide">
        <div class=${joinClasses('sf-slider-thumbnail', context.thumbClass)}>
          ${slide}
        </div>
      </div>
    `);
}

function renderArrows(context) {
  if (!context.arrows) return '';
  const buttonOptions = getButtonOptions(context.buttonType);
  const buttonSize = context.buttonSize || '1';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="sf-slider-arrows sf-slider-arrows--size-2">
      <sf-icon-button
        root-class="sf-slider-button-prev"
        icon="keyboard_arrow_left"
        size=${buttonSize}
        appearance=${buttonOptions.type}
        scheme=${buttonOptions.scheme}
        aria-label=${context.previousLabel}
      ></sf-icon-button>
      <sf-icon-button
        root-class="sf-slider-button-next"
        icon="keyboard_arrow_right"
        size=${buttonSize}
        appearance=${buttonOptions.type}
        scheme=${buttonOptions.scheme}
        aria-label=${context.nextLabel}
      ></sf-icon-button>
    </div>
  `;
}

function renderSliderTemplate(context) {
  const rootClasses = joinClasses('sf-slider', context.rootClass);
  const authoredSpaceBetween = context.component?.hasAttribute('space-between');
  const authoredSpeed = context.component?.hasAttribute('speed');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-loop=${String(!!context.loop)}
      data-space-between=${authoredSpaceBetween ? String(context.spaceBetween) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-speed=${authoredSpeed ? String(context.speed) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <div class="sf-slider-main swiper">
        <div class="swiper-wrapper">
          ${renderSlides(context)}
        </div>
      </div>

      ${context.thumbs ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class=${joinClasses('sf-slider-thumbnails swiper', context.thumbsClass)}>
              <div class="swiper-wrapper">
                ${renderThumbSlides(context)}
              </div>
            </div>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      ${context.arrows || context.dots ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-slider-controls">
              ${renderArrows(context)}
              ${context.dots ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${getDotsClasses(context.dotsType, context.dotsSize)}></div>` : ''}
            </div>
          ` : ''}
    </div>
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

/***/ "2487a822fc8d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-slider for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-slider","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-slide-change","to":"change","kind":"event","component":"sf-slider","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8","note":"the old name follows change with the same detail; component, tagName and template are no longer in it (§8)"},{"from":"getSlider","to":null,"kind":"action","component":"sf-slider","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"}]}');

/***/ },

/***/ "85a15fb0aee7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.slider","tag":"sf-slider","version":"1.1.4","kind":"leaf","settings":{"button-type":{"type":"string","default":"primary"},"button-size":{"type":"string","default":"1"},"dots":{"type":"boolean","default":true},"dots-type":{"type":"string","default":"primary-dark"},"dots-size":{"type":"string","default":"2"},"thumbs":{"type":"boolean","default":false},"thumbs-class":{"type":"string","default":""},"thumb-class":{"type":"string","default":""},"arrows":{"type":"boolean","default":true},"loop":{"type":"boolean","default":false},"space-between":{"type":"number","default":12},"speed":{"type":"number","default":450},"slide-class":{"type":"string","default":""}},"values":{},"events":{"change":{"carries":{"active-index":"number","real-index":"number","previous-index":"number"},"x-summary":"The shown slide changed, by an arrow, a dot, a thumbnail, a swipe or an action"}},"actions":{"refresh":{"x-outcomes":["applied"],"x-summary":"Lays the slides out again after the page changed them or their box","summary":"Rebind the slider after its slides changed: forwards the data attributes and rebuilds Swiper, keeping the events bound. Returns the element.","x-returns":{"type":"object","description":"The element, for chaining."}},"slide-next":{"x-outcomes":["applied","refused"],"x-summary":"Shows the next slide; refused (not-ready) before the slider has started","summary":"Move to the next slide, as the next arrow does. Returns the element.","x-returns":{"type":"object","description":"The element, for chaining."}},"slide-prev":{"x-outcomes":["applied","refused"],"x-summary":"Shows the previous slide; refused (not-ready) before the slider has started","summary":"Move to the previous slide, as the previous arrow does. Returns the element.","x-returns":{"type":"object","description":"The element, for chaining."}}},"css-variables":{"--sf-slider-gap":{"type":"length","state":"default"},"--sf-slider-arrow-offset-inline":{"type":"length","state":"default"},"--sf-slider-dots-offset-block":{"type":"length","state":"default"},"--sf-slider-thumbnail-size":{"type":"length","state":"default"},"--sf-slider-thumbnail-radius":{"type":"length","state":"default"}}}');

/***/ },

/***/ "dd6cee132a1d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Slider","runtime":{"next":"Next slide","previous":"Previous slide"}}');

/***/ },

/***/ "c9b3780c37ac"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Слайдер контента","runtime":{"next":"Следующий слайд","previous":"Предыдущий слайд"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("51896d04b17d");
/******/
/******/ })()
;