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
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindSlider: () => (/* binding */ bindSlider),
/* harmony export */   initExistingSliders: () => (/* binding */ initExistingSliders),
/* harmony export */   refreshSlider: () => (/* binding */ refreshSlider),
/* harmony export */   unbindSlider: () => (/* binding */ unbindSlider)
/* harmony export */ });
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1373e294ec38");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);


 // The words a slider says about itself (SL-5), for the class block; sf-slider
// hands its own from lang/ through the root's attributes, which win. A product
// adds a language with SF.language.register('sf-slider', code, words).

const SLIDER_TEXT = {
  en: {
    label: 'Slides',
    carousel: 'carousel',
    slide: 'slide',
    position: '{n} of {count}',
    pause: 'Stop slides',
    play: 'Start slides',
    thumb: 'Go to slide {n}'
  },
  ru: {
    label: 'Слайды',
    carousel: 'карусель',
    slide: 'слайд',
    position: '{n} из {count}',
    pause: 'Остановить прокрутку',
    play: 'Запустить прокрутку',
    thumb: 'Перейти к слайду {n}'
  }
};
const SLIDER_SELECTOR = '.sf-slider'; // Up to seven slides are dots; from eight a counter «2 / 12» stands in their
// place (C143 (4), as sf-gallery counts pictures, C97).

const DOTS_LIMIT = 7; // Cards (sf-slider--content: news, reviews, products) show the next card's
// edge (C143 (7)): 1.15 cards on a phone, 2.2 from the sm step up.

const PEEK_PER_VIEW = 1.15;
const PEEK_PER_VIEW_WIDE = 2.2; // The parts of a slider block. sf-carousel, the slider's former name until
// 2027-01-01, binds through the same code with its own class names and keeps
// its look (owner decision C247): one path, one set of keys, names and words.

const SLIDER_PARTS = {
  main: '.sf-slider-main.swiper, .swiper',
  prev: '.sf-slider-button-prev',
  next: '.sf-slider-button-next',
  pagination: '.sf-slider-pagination',
  thumbs: '.sf-slider-thumbnails.swiper',
  rotation: '.sf-slider-rotation',
  bulletClass: 'sf-slider-dots-dot',
  bulletActiveClass: 'active',
  // From eight slides a counter stands in the dots' place.
  counter: true,
  // The motion: the slider's own duration token.
  speed: undefined,
  delay: 3000,
  stopped: 'stopped'
};
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
    } // Only the data-swiper-* attributes are options; the block's own words
    // (data-slide-label «{n} из {count}») are not JSON and stay unread here.


    Object.entries(element.dataset).forEach(([key, value]) => {
      if (!key.startsWith('swiper') || key === 'swiperOptions') return;
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

function createPaginationOptions(paginationEl, slidesCount, parts = SLIDER_PARTS) {
  if (!paginationEl) return undefined; // From eight slides the dots give way to a counter; the slides' own names
  // («2 из 12») and the live strip say it to a reader, so the counter is
  // only drawn.

  if (parts.counter && slidesCount > DOTS_LIMIT) {
    paginationEl.classList.add('sf-slider-dots--count');
    paginationEl.setAttribute('aria-hidden', 'true');
    return {
      el: paginationEl,
      type: 'fraction',
      currentClass: 'sf-slider-dots-current',
      totalClass: 'sf-slider-dots-total'
    };
  }

  paginationEl.classList.remove('sf-slider-dots--count');
  paginationEl.removeAttribute('aria-hidden');
  return {
    el: paginationEl,
    bulletActiveClass: parts.bulletActiveClass,
    bulletClass: parts.bulletClass,
    bulletElement: 'button',
    clickable: true,
    // One Tab stop for all the dots; the arrow keys page (C143 (5)).
    keyboard: true
  };
}

function isContentSlider(root) {
  return root.classList.contains('sf-slider--content');
} // Cards peek (C143 (7)) unless the page chose how many are in view.


function hasAuthoredPerView(root, element) {
  return getOption(root, element, 'slidesPerView') !== undefined || [root, element].some(node => node?.dataset?.swiperSlidesPerView !== undefined || /slidesPerView|breakpoints/.test(node?.dataset?.swiperOptions || ''));
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
// A thumbnail is a button (GL-2, SL-12): named by its picture's alt, else
// «Перейти к слайду 2»; the thumbnails are one Tab stop -- the current one --
// and ArrowLeft / ArrowRight (mirrored right to left), Home and End move the
// slide and the focus with it, as the dots do (C143 (5)); Enter and Space
// press it.


function thumbnailName(root, slide, index) {
  const alt = slide.querySelector('img[alt], [aria-label]');
  const own = alt?.getAttribute('alt') ?? alt?.getAttribute('aria-label');
  return own?.trim() || sliderWord(root, 'thumb').replaceAll('{n}', String(index + 1));
}

function linkThumbnails(root, slider, thumbs) {
  if (!slider || !thumbs?.slides?.length) return () => {};
  const slides = Array.from(thumbs.slides);
  const authored = slides.map(slide => ({
    role: slide.getAttribute('role'),
    tabindex: slide.getAttribute('tabindex'),
    label: slide.getAttribute('aria-label')
  })); // The page's own name, as the engine kept it before writing «1 / 6».

  const names = slides.map((slide, index) => (slide.__sfAuthoredLabel ?? authored[index].label)?.trim?.() || thumbnailName(root, slide, index));

  const name = () => slides.forEach((slide, index) => {
    slide.setAttribute('role', 'button');
    slide.setAttribute('aria-label', names[index]);
  });

  const mark = () => {
    slides.forEach((slide, index) => {
      const active = index === slider.activeIndex;
      slide.classList.toggle('swiper-slide-thumb-active', active);
      slide.tabIndex = active ? 0 : -1;
      if (active) slide.setAttribute('aria-current', 'true');else slide.removeAttribute('aria-current');
    });
  };

  const listeners = slides.map((slide, index) => {
    const listener = () => slider.slideTo(index);

    slide.addEventListener('click', listener);
    return [slide, listener];
  });

  const onKey = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const slide = event.target instanceof Element ? event.target.closest('.swiper-slide') : null;
    const at = slides.indexOf(slide);
    if (at < 0) return;
    const rtl = getComputedStyle(thumbs.el).direction === 'rtl';
    const last = slides.length - 1;
    let next;
    if (event.key === 'Enter' || event.key === ' ') next = at;else if (event.key === 'ArrowRight') next = at + (rtl ? -1 : 1);else if (event.key === 'ArrowLeft') next = at + (rtl ? 1 : -1);else if (event.key === 'Home') next = 0;else if (event.key === 'End') next = last;else return;
    event.preventDefault(); // The thumbnails' own keys: the strip's keyboard option does not page twice.

    event.stopPropagation();
    if (slider.params?.loop) next = (next % (last + 1) + last + 1) % (last + 1);
    next = Math.min(Math.max(next, 0), last);
    slider.slideTo(next);
    mark();
    slides[next]?.focus?.();
  }; // The thumbnails' engine names its slides again on every update.


  const onUpdate = () => {
    name();
    mark();
  };

  thumbs.el.addEventListener('keydown', onKey);
  thumbs.on?.('update', onUpdate);
  slider.on?.('slideChange', mark);
  name();
  mark();
  return () => {
    listeners.forEach(([slide, listener]) => slide.removeEventListener('click', listener));
    thumbs.el.removeEventListener('keydown', onKey);
    thumbs.off?.('update', onUpdate);
    slider.off?.('slideChange', mark);
    slides.forEach((slide, index) => {
      if (!slide.isConnected) return;
      [['role', authored[index].role], ['tabindex', authored[index].tabindex], ['aria-label', authored[index].label]].forEach(([attr, value]) => value === null ? slide.removeAttribute(attr) : slide.setAttribute(attr, value));
      slide.removeAttribute('aria-current');
    });
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

function createAutoplayOptions(root, element, parts = SLIDER_PARTS) {
  const autoplay = toBoolean(getOption(root, element, 'autoplay'), false);
  if (!autoplay) return undefined;
  return {
    enabled: true,
    // data-delay is the carousel's former word for the same delay.
    delay: toNumber(getOption(root, element, 'autoplayDelay') ?? getOption(root, element, 'delay'), parts.delay),
    disableOnInteraction: toBoolean(getOption(root, element, 'autoplayDisableOnInteraction'), true),
    pauseOnMouseEnter: toBoolean(getOption(root, element, 'autoplayPauseOnMouseEnter'), false),
    reverseDirection: toBoolean(getOption(root, element, 'autoplayReverseDirection'), false),
    stopOnLastSlide: toBoolean(getOption(root, element, 'autoplayStopOnLastSlide'), false)
  };
}

function createBaseOptions(root, element, fallbackSlidesPerView = 1, parts = SLIDER_PARTS) {
  const peek = element instanceof Element && !element.classList.contains('sf-slider-thumbnails') && isContentSlider(root) && !hasAuthoredPerView(root, element);
  let options = {
    centeredSlides: toBoolean(getOption(root, element, 'centeredSlides'), false),
    loop: toBoolean(getOption(root, element, 'loop'), false),
    slidesPerView: toSlidesPerView(getOption(root, element, 'slidesPerView'), fallbackSlidesPerView),
    spaceBetween: toNumber(getOption(root, element, 'spaceBetween'), resolveCssLength(root, '--sf-slider--space-between', 0)),
    speed: toNumber(getOption(root, element, 'speed'), parts.speed ?? resolveCssDuration(root, '--sf-slider--duration', 300)),
    watchSlidesProgress: true
  };

  if (peek) {
    options.slidesPerView = PEEK_PER_VIEW; // From the sm step of the Framework's ladder (rem, as the sheets write it),
    // read against the slider's own width, not the window's (C181 (2), RG-OT
    // 7): a 264 column on a wide screen shows 1.15 cards, not 2.2 cards of 113.

    const from = Number.parseFloat(_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_2__.BREAKPOINTS.sm) * 16;
    options.breakpoints = {
      [from]: {
        slidesPerView: PEEK_PER_VIEW_WIDE
      }
    };
    options.breakpointsBase = 'container';
  }

  const autoplay = createAutoplayOptions(root, element, parts);

  if (autoplay) {
    options.autoplay = autoplay;
  }

  options = deepMerge(options, collectSwiperDataOptions(root, element));

  if (prefersReducedMotion()) {
    options.speed = 0;
    delete options.autoplay;
  }

  return normalizeAutoplayOptions(options);
} // Hidden slides leave the Tab order and an edge arrow is a disabled button:
// the engine does both since swiper 1.2.0 (owner decision C245), so the
// slider, the carousel and any later strip get them from one place.
// Autoplay turns the slides only with a pause button the person can see
// (C143 (6), WCAG 2.2.2, as sf-carousel required): .sf-slider-rotation, a
// button or an sf-button-icon host whose button carries it. Without one the
// slider does not turn.


function findRotationButton(root, selector = '.sf-slider-rotation') {
  const marked = root.querySelector(selector);
  if (!(marked instanceof HTMLElement)) return null;
  const button = marked.matches('button') ? marked : marked.querySelector('button');
  return button instanceof HTMLButtonElement ? button : null;
}

function isShown(element) {
  if (typeof element.checkVisibility === 'function') {
    return element.checkVisibility({
      checkOpacity: true,
      checkVisibilityCSS: true
    });
  }

  return element.getClientRects().length > 0;
} // The rotation is the person's: the pause button stops and starts it, and a
// keyboard focus inside the slider stops it until the button starts it again
// (APG carousel). The pointer over the slider and a hidden tab only hold it
// while they last. The button is named by what it does next (C12: no
// aria-pressed on a toggle whose name changes).
// The glyph shows the action the name says (C12): «pause» while the slides
// turn, «play_arrow» when stopped. The Smart host takes it as its icon
// attribute; class markup (a button with an .sf-icon inside) had its name
// changed and kept the pause glyph (RG-OT 8, 13). A glyph the page drew in
// another way (a picture, its own word) is left alone.


const ROTATION_GLYPHS = ['pause', 'play_arrow'];

function paintRotationGlyph(button, stopped) {
  const glyph = button.querySelector('.sf-icon');
  if (!glyph || !ROTATION_GLYPHS.includes(glyph.textContent.trim())) return;
  const next = stopped ? 'play_arrow' : 'pause';
  if (glyph.textContent.trim() !== next) glyph.textContent = next;
}

function createAutoplayGuard(root, slider, rotationButton, words = {}) {
  if (!slider?.autoplay || !slider.params?.autoplay || prefersReducedMotion()) return () => {};
  const holds = new Set();
  let stopped = false;
  let applying = false;
  const host = rotationButton?.closest?.((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.tagSelector)('sf-button-icon')) || null;

  const label = key => (key === 'pause' ? root.dataset.pauseLabel : root.dataset.playLabel) || sliderWord(root, key);

  const paint = () => {
    if (!rotationButton) return;
    const key = stopped ? 'play' : 'pause';
    rotationButton.removeAttribute('aria-pressed');

    if (host) {
      host.setAttribute('icon', stopped ? 'play_arrow' : 'pause');
      host.setAttribute('aria-label', label(key));
    } else {
      rotationButton.setAttribute('aria-label', label(key));
      paintRotationGlyph(rotationButton, stopped);
    }

    root.dataset.rotation = stopped ? words.stopped || 'stopped' : 'playing';
  };

  const apply = () => {
    const run = !stopped && holds.size === 0 && root.isConnected;
    if (run === slider.autoplay.running) return;
    applying = true;
    if (run) slider.autoplay.start();else slider.autoplay.stop();
    applying = false;
  };

  const stop = () => {
    stopped = true;
    paint();
    apply();
  };

  const start = () => {
    stopped = false;
    paint();
    apply();
  };

  const hold = reason => {
    holds.add(reason);
    apply();
  };

  const release = reason => {
    holds.delete(reason);
    apply();
  }; // The engine stops by itself on a swipe (disableOnInteraction): that is the
  // person's stop too, and the button says so.


  const onEngineStop = () => {
    if (!applying) {
      stopped = true;
      paint();
    }
  };

  const onRotation = event => {
    event.preventDefault();
    if (stopped) start();else stop();
  };

  const onFocusIn = event => {
    if (event.target === rotationButton) return;
    if (event.target instanceof Element && event.target.matches(':focus-visible')) stop();
  };

  const onPointerEnter = () => hold('pointer');

  const onPointerLeave = () => release('pointer');

  const onVisibilityChange = () => {
    if (document.hidden) hold('visibility');else release('visibility');
  };

  slider.on?.('autoplayStop', onEngineStop);
  rotationButton?.addEventListener('click', onRotation);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('pointerenter', onPointerEnter);
  root.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibilityChange);
  onVisibilityChange();
  paint(); // The page's own stop and start (SF.Carousel.pause / play) are the person's.

  root._sfSliderRotation = {
    start,
    stop
  };
  return () => {
    delete root._sfSliderRotation;
    slider.off?.('autoplayStop', onEngineStop);
    rotationButton?.removeEventListener('click', onRotation);
    root.removeEventListener('focusin', onFocusIn);
    root.removeEventListener('pointerenter', onPointerEnter);
    root.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    delete root.dataset.rotation;
  };
} // The block is a region the reader can find and leave, named and described as
// a carousel, its slides «слайд, 2 из 5» (SL-5, as the APG carousel and
// sf-carousel). A name or role the page wrote stays; unbinding puts back what
// was there before.


function sliderWord(root, key) {
  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(SLIDER_TEXT, key, root, 'sf-slider');
}

function applyRegionSemantics(root) {
  const authored = {
    role: root.getAttribute('role'),
    roleDescription: root.getAttribute('aria-roledescription'),
    label: root.getAttribute('aria-label')
  };
  if (!authored.role) root.setAttribute('role', 'region');
  if (!authored.roleDescription) root.setAttribute('aria-roledescription', sliderWord(root, 'carousel'));

  if (!authored.label && !root.hasAttribute('aria-labelledby')) {
    root.setAttribute('aria-label', root.dataset.label || sliderWord(root, 'label'));
  }

  return authored;
}

function restoreRegionSemantics(root, authored) {
  if (!authored) return;
  [['role', authored.role], ['aria-roledescription', authored.roleDescription], ['aria-label', authored.label]].forEach(([name, value]) => {
    if (value === null) root.removeAttribute(name);else root.setAttribute(name, value);
  });
}

function slideMessages(root) {
  const position = root.dataset.slideLabel || sliderWord(root, 'position');
  return {
    itemRoleDescriptionMessage: root.dataset.slideRoledescription || sliderWord(root, 'slide'),
    // {n} / {count}, or the former carousel words {{index}} / {{count}}.
    slideLabelMessage: position.replaceAll('{n}', '{{index}}').replaceAll('{{count}}', '{{slidesLength}}').replaceAll('{count}', '{{slidesLength}}')
  };
} // While autoplay turns the slides, the change is not announced; stopped, the
// new slide is announced politely (APG carousel).


function createLiveRegionGuard(slider, mainEl) {
  if (!(mainEl instanceof HTMLElement) || typeof slider?.on !== 'function') return () => {};
  const authored = mainEl.getAttribute('aria-live');

  const sync = () => mainEl.setAttribute('aria-live', slider.autoplay?.running ? 'off' : 'polite');

  const events = ['init', 'autoplayStart', 'autoplayStop'];
  events.forEach(name => slider.on(name, sync));
  sync();
  return () => {
    events.forEach(name => slider.off?.(name, sync));
    if (authored === null) mainEl.removeAttribute('aria-live');else mainEl.setAttribute('aria-live', authored);
  };
}

function getSlidesCount(element) {
  return element?.querySelectorAll?.('.swiper-wrapper > .swiper-slide')?.length || 0;
}

function hasPendingSmartArrowRender(root) {
  const arrowHosts = Array.from(root.querySelectorAll?.(`${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.tagSelector)('sf-button-icon')}[root-class*="sf-slider-button-"]`) || []);
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

function bindSlider(root, parts) {
  if (!(root instanceof HTMLElement)) return null;
  if (root.dataset[SLIDER_BOUND_FLAG] === 'true') return root._sfSlider;
  if (parts) root._sfSliderParts = { ...SLIDER_PARTS,
    ...parts
  };
  parts = root._sfSliderParts || SLIDER_PARTS;

  if (typeof window === 'undefined' || typeof window.Swiper !== 'function') {
    return waitForSliderReady(root);
  }

  const mainEl = root.querySelector(parts.main);
  if (!(mainEl instanceof HTMLElement)) return null;

  if (hasPendingSmartArrowRender(root)) {
    return waitForSliderReady(root);
  }

  const prevEl = root.querySelector(parts.prev);
  const nextEl = root.querySelector(parts.next);
  const paginationEl = root.querySelector(parts.pagination);
  const thumbsEl = parts.thumbs ? root.querySelector(parts.thumbs) : null;
  let thumbs = null;
  const thumbsCount = getSlidesCount(thumbsEl);

  if (thumbsEl instanceof HTMLElement && thumbsCount > 0) {
    thumbs = new window.Swiper(thumbsEl, { ...createBaseOptions(root, thumbsEl, Math.min(thumbsCount, 6), parts),
      loop: false,
      centeredSlides: false,
      spaceBetween: toNumber(getOption(root, thumbsEl, 'spaceBetween'), resolveCssLength(root, '--sf-slider-thumbnails--space-between', 0)),
      slidesPerView: Math.min(thumbsCount, 6),
      slideToClickedSlide: false,
      // A thumbnail is pressed, not dragged: the strip is as wide as they are.
      allowTouchMove: false,
      // The thumbnails never turn by themselves; data-autoplay is the slides'.
      autoplay: false
    });
  }

  const sliderOptions = { ...createBaseOptions(root, mainEl, 1, parts)
  };
  const navigation = createNavigationOptions(prevEl, nextEl);
  const pagination = createPaginationOptions(paginationEl, getSlidesCount(mainEl), parts);
  const rotationButton = findRotationButton(root, parts.rotation);

  if (sliderOptions.autoplay && !(rotationButton && isShown(rotationButton))) {
    delete sliderOptions.autoplay;
  } // A pause button with nothing to pause (no autoplay, or reduced motion) is
  // not shown.


  const rotationHost = rotationButton?.closest?.((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.tagSelector)('sf-button-icon')) || rotationButton;

  if (rotationHost && !sliderOptions.autoplay) {
    rotationHost.hidden = true;
    root._sfSliderRotationHidden = rotationHost;
  }

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
  } // The keys listen on the whole block: the arrows and the dots, where the
  // focus is, sit outside the strip (SL-3).


  if (sliderOptions.keyboard === true || sliderOptions.keyboard?.enabled) {
    sliderOptions.keyboard = { ...(isPlainObject(sliderOptions.keyboard) ? sliderOptions.keyboard : {}),
      enabled: true,
      el: root
    };
  }

  const navigationLabels = getNavigationLabels(prevEl, nextEl);
  applyNavigationLabelDefaults(sliderOptions, navigationLabels);

  if (sliderOptions.a11y !== false) {
    sliderOptions.a11y = { ...slideMessages(root),
      ...sliderOptions.a11y
    };
  }

  root._sfSliderRegion = applyRegionSemantics(root);
  const slider = new window.Swiper(mainEl, sliderOptions);
  root._sfSliderCleanup = [createAutoplayGuard(root, slider, rotationButton, parts), linkThumbnails(root, slider, thumbs), createLiveRegionGuard(slider, mainEl)];
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
  if (root._sfSliderRotationHidden) root._sfSliderRotationHidden.hidden = false;
  delete root._sfSliderRotationHidden;
  restoreRegionSemantics(root, root._sfSliderRegion);
  delete root._sfSliderRegion;
  delete root._sfSliderNavigationLabels;
  delete root._sfSliderCleanup;
  delete root._sfSlider;
  delete root._sfSliderThumbs;
  delete root._sfSliderParts;
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

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1373e294ec38"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   breakpointMedia: () => (/* binding */ breakpointMedia),
/* harmony export */   breakpointQuery: () => (/* binding */ breakpointQuery),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   matchesBreakpoint: () => (/* binding */ matchesBreakpoint)
/* harmony export */ });
// The Framework's breakpoints for scripts (reuse audit 2026-11-02, finding 6).
// The sheets switch at the steps of core/scss/vars/_sf_var__breakpoint.scss;
// a component that also decides in script (sf-contents, sf-site-header,
// sf-search) had copied the steps by hand, word for word, and nine such
// constants (48rem, 60rem, 1023px, 1024) had drifted apart elsewhere, so one
// admin screen switched at two points. The same values here, and
// tests/breakpoint-ladder.contract.test.mjs holds the two files equal.

/** The ladder: each name is the width it starts at, in rem as the sheets write it. */
const BREAKPOINTS = Object.freeze({
  xs: '0rem',
  sm: '32rem',
  // g6, 512px
  md: '44rem',
  // h1, 704px
  lg: '60rem',
  // h5, 960px
  xl: '72rem',
  // h8, 1152px
  xxl: '80rem' // i0, 1280px

}); // The step under a threshold, as the sheets' media-breakpoint-down writes it:
// one pixel less, in rem (_mix__breakpoint.scss breakpoint-max).

const PIXEL_REM = 1 / 16;
/**
 * The media query of a breakpoint: from its width up, or with `below: true`
 * the widths under it -- the two sides the sheets switch on. An unknown name
 * is null, so a typo is not a query that always matches.
 *
 *   breakpointQuery('md')                  (min-width: 44rem)
 *   breakpointQuery('md', {below: true})   (max-width: 43.9375rem)
 */

function breakpointQuery(name, {
  below = false
} = {}) {
  if (!Object.hasOwn(BREAKPOINTS, name)) return null;
  const rem = Number.parseFloat(BREAKPOINTS[name]);
  if (below) return rem > 0 ? `(max-width: ${rem - PIXEL_REM}rem)` : 'not all';
  return `(min-width: ${rem}rem)`;
}
/** The page's MediaQueryList for a breakpoint, to read and to follow; null without matchMedia or for an unknown name. */

function breakpointMedia(name, {
  below = false,
  view = globalThis
} = {}) {
  const query = breakpointQuery(name, {
    below
  });
  return query && typeof view?.matchMedia === 'function' ? view.matchMedia(query) : null;
}
/** Whether the page is at least as wide as the breakpoint now (or under it, with `below`). */

function matchesBreakpoint(name, options = {}) {
  return breakpointMedia(name, options)?.matches === true;
}
const Breakpoints = Object.freeze({
  ladder: BREAKPOINTS,
  query: breakpointQuery,
  media: breakpointMedia,
  matches: matchesBreakpoint
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.breakpoints) globalThis.SF.breakpoints = Breakpoints;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Breakpoints);

/***/ },

/***/ "f28a9d913ce0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated from the `tag` rows of src/smart/*/aliases.json and the element_aliases of
// src/core/contracts/packages/*.package.json by scripts/tag-alias-table.mjs; do not edit.
// The dated tag aliases of the Framework and of its component packages, read by core/js/tag-aliases.js.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze([Object.freeze({
  from: 'sf-avatars',
  to: 'sf-avatar-group',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-button-group',
  to: 'sf-segmented',
  since: '2026-11-08',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-change-confirm',
  to: 'sf-confirm-change',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-close',
  to: 'sf-button-close',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-code-input',
  to: 'sf-input-code',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-color',
  to: 'sf-input-color',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-composition-overlay',
  to: 'sf-editor-overlay',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-content-editor',
  to: 'sf-editor-content',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-context-menu',
  to: 'sf-menu-context',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-copy-button',
  to: 'sf-button-copy',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-country-code',
  to: 'sf-input-country',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-data-view',
  to: 'sf-view',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-datepicker',
  to: 'sf-input-date',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-download-file',
  to: 'sf-file-download',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-icon-button',
  to: 'sf-button-icon',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-image-field',
  to: 'sf-input-image',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-inline-editor',
  to: 'sf-editor-inline',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-lookup',
  to: 'sf-input-lookup',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-page-header',
  to: 'sf-header-page',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-property-view',
  to: 'sf-view-properties',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-quantity',
  to: 'sf-input-quantity',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-range-slider',
  to: 'sf-slider-range',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-rich-text',
  to: 'sf-input-rich',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-site-header',
  to: 'sf-header-site',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-table',
  to: 'sf-view-table',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
})]));

/***/ },

/***/ "4a85acfb05c1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonicalTag: () => (/* binding */ canonicalTag),
/* harmony export */   defineTagAliases: () => (/* binding */ defineTagAliases),
/* harmony export */   isTag: () => (/* binding */ isTag),
/* harmony export */   listTagAliases: () => (/* binding */ listTagAliases),
/* harmony export */   noteTagAlias: () => (/* binding */ noteTagAlias),
/* harmony export */   registerTagAliasRows: () => (/* binding */ registerTagAliasRows),
/* harmony export */   registerTagAliases: () => (/* binding */ registerTagAliases),
/* harmony export */   tagNames: () => (/* binding */ tagNames),
/* harmony export */   tagSelector: () => (/* binding */ tagSelector)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5dcef5de40cf");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__]);
([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alias_table_js__WEBPACK_IMPORTED_MODULE_1__);
// Dated tag aliases (rename plan R0, ui-control RENAME-PLAN-2026-11-03; change
// lifecycle: contracts/changes/journal.json, kind "tag"). When a Smart
// component takes a new tag, the old tag keeps working until its
// `remove_after` day:
//
// - Definition. defineTagAliases(Class, tag) defines each old tag as a trivial
//   subclass of the class that defines the new one (the Smart base calls it
//   from define()). The Loader's rule lists the old tag beside the new one, so
//   markup with the old tag alone loads the bundle.
// - Note. The first old-tag element a page connects is noted in
//   SF.deprecations (kind "tag") and named once on the console with the new tag
//   and the date, whatever the page opted into: an element name is the most
//   visible thing a page writes, and the old one is going.
// - Script. Code that finds a renamed element by name asks for both names
//   through one helper instead of a literal:
//
//     import {tagSelector, isTag} from '../../core/js/smart-base';
//     host.querySelector(`.sf-tag > ${tagSelector('sf-button-close')}`);
//     if (isTag(node, 'sf-button-close')) ...
//
// - Sheets. A selector that names the new tag names the old one beside it in
//   source, `:is(sf-button-close, sf-close)`, for as long as the alias lives
//   (scripts/rename-smart-tag.mjs writes it, --sweep takes it out; the
//   contract test tests/tag-aliases.contract.test.mjs holds both).
//
// The aliases are a static table (tag-aliases.generated.js, written by
// scripts/tag-alias-table.mjs from every component's aliases.json and from the
// element_aliases of the component package references,
// contracts/packages/*.package.json), so a lookup finds an old tag before the
// renamed component's bundle has run, a package's (sf-table, rename plan R2)
// as well as the Framework's. A package's component adds its rows again when it
// is defined, which matters only for a package the pair does not reference. Every copy of this
// module shares one state on the page (a global symbol); the Smart bundles
// reach it through the shared runtime (smart-base re-exports it).



const STATE = Symbol.for('simai.sf.tag-aliases');

function state() {
  if (!globalThis[STATE]) {
    const shared = {
      byOld: new Map(),
      byNew: new Map(),
      noted: new Set()
    };
    Object.defineProperty(globalThis, STATE, {
      value: shared,
      configurable: true
    });

    for (const row of _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__["default"]) addRow(shared, row);
  }

  return globalThis[STATE];
}

function addRow(shared, row) {
  if (shared.byOld.has(row.from)) return;
  shared.byOld.set(row.from, row);
  shared.byNew.set(row.to, [...(shared.byNew.get(row.to) ?? []), row.from]);
} // Rows from a component's aliases.json (its `tag` rows); the Framework's are
// already known, a package's are added here.


function registerTagAliases(table, tag) {
  const {
    rows
  } = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readTagAliases)(table, {
    tag
  });
  const shared = state();

  for (const row of rows) addRow(shared, row);

  return rows;
} // Rows a component set gives at runtime (SF.RuleLoader.registerPackage(name,
// {aliases})): {from, to, since, remove_after}, the set's own former tags, so
// SIMAI Framework needs no table row for a set it does not know. Answers the
// rows taken; a row whose old tag is already known keeps the first.

function registerTagAliasRows(rows) {
  const shared = state();
  const taken = [];

  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row.from !== 'string' || typeof row.to !== 'string') continue;
    if (shared.byOld.has(row.from)) continue;
    const clean = Object.freeze({
      from: row.from,
      to: row.to,
      since: String(row.since ?? ''),
      remove_after: String(row.remove_after ?? ''),
      ...(typeof row.package === 'string' && row.package ? {
        package: row.package
      } : {})
    });
    addRow(shared, clean);
    taken.push(clean);
  }

  return taken;
} // The open old names of a tag, its own first: ['sf-button-close', 'sf-close'].

function tagNames(tag) {
  const name = String(tag || '').toLowerCase();
  return [name, ...(state().byNew.get(name) ?? [])];
} // A selector for the tag that matches its old names too:
// ':is(sf-button-close, sf-close)', or the tag itself when it has none.

function tagSelector(tag) {
  const names = tagNames(tag);
  return names.length > 1 ? `:is(${names.join(', ')})` : names[0];
} // Whether an element is the tag, under its own or an old name.

function isTag(element, tag) {
  const name = element?.localName;
  return Boolean(name) && tagNames(tag).includes(name);
} // The current name of a tag: 'sf-button-close' for 'sf-close'. An old tag the
// page still has as an element of its own stays itself: a component package
// built before its rename (rules naming sf-table alone) beside a pair whose
// table already knows the new name, where the new tag would never upgrade.

function canonicalTag(tag) {
  const name = String(tag || '').toLowerCase();
  const row = state().byOld.get(name);
  if (!row) return name;
  const own = globalThis.customElements?.get?.(name);
  if (own && !own.sfTagAliasOf) return name;
  let rules = null;

  try {
    rules = globalThis.SF?.Loader?.getCustomElementRules?.() ?? null;
  } catch {
    rules = null;
  }

  if (rules && rules[name] && !rules[row.to]) return name;
  return row.to;
} // Every open row: [{from, to, since, remove_after}].

function listTagAliases() {
  return [...state().byOld.values()].map(row => ({ ...row
  }));
} // The page met an element under an old name: once per old tag.

function noteTagAlias(row) {
  const shared = state();
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row);
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.to,
    kind: 'tag',
    from: row.from,
    to: row.to,
    tag: row.to,
    since: row.since,
    remove_after: row.remove_after,
    expired,
    package: row.package
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return; // A package's element says which package ships it now (C174 NM-3).

  const where = row.package ? ` from the component package ${row.package}` : '';
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>${where}. See contracts/changes/journal.json.`);
} // Defines each old tag of `tag` as a subclass of `Base` (the class that
// defines `tag`), through `define(name, Class)`: the Smart base passes its
// definition queue, so both names are defined in the same batch. Returns the
// rows defined.

function defineTagAliases(Base, tag, {
  table = Base?.aliases,
  define
} = {}) {
  if (table) registerTagAliases(table, tag);
  const rows = (state().byNew.get(tag) ?? []).map(from => state().byOld.get(from));
  const registry = globalThis.customElements;
  const defined = [];

  for (const row of rows) {
    if (!registry || registry.get(row.from)) continue;

    class TagAlias extends Base {
      connectedCallback() {
        noteTagAlias(row);
        super.connectedCallback?.();
      }

    }

    Object.defineProperty(TagAlias, 'sfTagAliasOf', {
      value: row.to
    });
    (define ?? ((name, Class) => registry.define(name, Class)))(row.from, TagAlias);
    defined.push(row);
  }

  return defined;
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {}; // For scripts that are not Smart bundles (class components, a page):
  // SF.tags.selector('sf-button-close').

  if (!globalThis.SF.tags) {
    globalThis.SF.tags = Object.freeze({
      names: tagNames,
      selector: tagSelector,
      is: isTag,
      canonical: canonicalTag,
      list: listTagAliases
    });
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "51896d04b17d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("9e5aefb3c7c5");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("c43a175b4439");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("85a15fb0aee7");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("2487a822fc8d");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("dd6cee132a1d");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("c9b3780c37ac");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);









 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__.runtime
}; // sf-slider from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8): its settings are attributes and properties made by
// core/js/element-manifest.js, the arrows' words are lang/<locale>.json (a
// product adds a language through SF.language.register("sf-slider", code,
// words)), and sf-slide-change and getSlider() are dated rows of aliases.json.

const SliderElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en,
    ru
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
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
      nextLabel: this.sfWord('next'),
      // The region and its slides (SL-5): the page's aria-label names the
      // region, else the word «Слайды»; «{n} из {count}» stays a pattern the
      // engine fills per slide.
      regionLabel: this.getAttribute('aria-label') || this.sfWord('label'),
      regionRoleDescription: this.sfWord('carousel'),
      slideRoleDescription: this.sfWord('slide'),
      slideLabel: this.sfWord('position'),
      // Autoplay is off unless the page asks (data-autoplay); then the pause
      // button is drawn and named by what it does (C143 (6)).
      autoplay: ['1', 'true', 'yes', 'on'].includes(String(this.getAttribute('data-autoplay') || '').toLowerCase()),
      pauseLabel: this.sfWord('pause'),
      playLabel: this.sfWord('play'),
      ratio: this.ratio
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderSliderTemplate)(this.templateContext());
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

    (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__.refreshSlider)(root);
    return true;
  }

  async waitForSliderControls(root) {
    const arrowHosts = () => Array.from(root?.querySelectorAll?.(`${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__.tagSelector)('sf-button-icon')}[root-class*="sf-slider-button-"]`) || []);

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
      (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__.unbindSlider)(this._boundRoot);
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

    (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__.unbindSlider)(this._boundRoot);
    this._boundSlider = (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__.bindSlider)(this._boundRoot);
    this.attachSliderEvents();
  }

  onDisconnected() {
    this._sliderInitToken++;

    if (this._boundRoot) {
      this.detachSliderEvents();
      (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__.unbindSlider)(this._boundRoot);
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
      since: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.since,
      remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.remove_after
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
      this._boundSlider = (0,_component_slider_js_slider__WEBPACK_IMPORTED_MODULE_4__.refreshSlider)(this._boundRoot);
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
} // Paging is no main action (decision C116, SL-11): the arrows are icon
// buttons, and by default the soft grey ones; primary stays a choice.


function getButtonOptions(type = 'secondary') {
  const normalizedType = normalizeOption(type);
  const options = {
    primary: {
      type: 'default',
      scheme: 'primary'
    },
    // The soft grey arrows (decision C116, BS-2): secondary is no colour of a
    // button any more; the button-type keeps its name.
    secondary: {
      type: 'tonal',
      scheme: 'on-surface'
    },
    dark: {
      type: 'default',
      scheme: 'on-surface'
    },
    // ghost, not its former name link: a link here was counted as the page's
    // own use in SF.deprecations (pair ui-a0370c0c99fb acceptance, F3).
    light: {
      type: 'ghost',
      scheme: 'on-surface'
    }
  };
  return options[normalizedType] || options.secondary;
} // The dots' plate by its colour role (sf-slider 1.2.0, docs precheck Q4). The
// former words are dated aliases until 2027-01-01 (the shim rewrites them on
// the host); they stay here for a value handed to the template directly.


function getDotsClasses(type = 'primary-container', size = '2', place = '') {
  const normalizedType = normalizeOption(type); // The dots' place when the page chose no plate (C143 (2), (3)): over a
  // picture a popup plate with its shadow, under cards no plate at all.

  if (place) {
    return joinClasses('sf-slider-dots', `sf-slider-dots--${place}`, `sf-slider-dots--size-${size || '2'}`, 'flex', 'sf-slider-pagination');
  }

  const typeClasses = {
    'primary-container': ['sf-slider-dots--primary', 'sf-slider-dots--dark'],
    primary: ['sf-slider-dots--primary', 'sf-slider-dots--light'],
    'surface-container': ['sf-slider-dots--clear', 'sf-slider-dots--light'],
    'surface-inverse': ['sf-slider-dots--clear', 'sf-slider-dots--dark'],
    'primary-light': ['sf-slider-dots--primary', 'sf-slider-dots--light'],
    'primary-dark': ['sf-slider-dots--primary', 'sf-slider-dots--dark'],
    light: ['sf-slider-dots--clear', 'sf-slider-dots--light'],
    dark: ['sf-slider-dots--clear', 'sf-slider-dots--dark'],
    clear: ['sf-slider-dots--clear', 'sf-slider-dots--light']
  };
  return joinClasses('sf-slider-dots', typeClasses[normalizedType] || typeClasses['primary-container'], 'sf-slider-dots--framed', `sf-slider-dots--size-${size || '2'}`, 'flex', 'sf-slider-pagination');
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
} // Over a picture the quiet arrows stand on popup plates with the overlay
// shadow (C143 (2)): a ghost button on the plate, so its hover tints the plate
// and an arrow with nowhere to go dims its glyph and keeps its plate.


function isPlated(context) {
  return !context.content && normalizeOption(context.buttonType || 'secondary') === 'secondary';
}

function renderArrows(context) {
  if (!context.arrows) return '';
  const plated = isPlated(context);
  const buttonOptions = plated ? {
    type: 'ghost',
    scheme: 'on-surface'
  } : getButtonOptions(context.buttonType);
  const buttonSize = context.buttonSize || '1'; // button-type light is the class look --light: ghost arrows on the light
  // circle (sf-slider 1.2.1, FW-B-3). The template wrote the ghost buttons
  // without the class, so their dark glyph lay on the picture, 1.28:1 on a
  // dark photo (RG-OT 9, C224: the Smart twin draws the class look).

  const light = !plated && normalizeOption(context.buttonType) === 'light';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${joinClasses('sf-slider-arrows sf-slider-arrows--size-2', plated && 'sf-slider-arrows--plate', light && 'sf-slider-arrows--light')}>
      <sf-button-icon
        root-class="sf-slider-button-prev"
        icon="keyboard_arrow_left"
        size=${buttonSize}
        appearance=${buttonOptions.type}
        scheme=${buttonOptions.scheme}
        aria-label=${context.previousLabel}
      ></sf-button-icon>
      <sf-button-icon
        root-class="sf-slider-button-next"
        icon="keyboard_arrow_right"
        size=${buttonSize}
        appearance=${buttonOptions.type}
        scheme=${buttonOptions.scheme}
        aria-label=${context.nextLabel}
      ></sf-button-icon>
    </div>
  `;
} // The pause button (C143 (6)): drawn only when the page asks for autoplay,
// first in the Tab order; the slider turns only while it is shown.


function renderRotation(context) {
  if (!context.autoplay) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const plated = !context.content;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${joinClasses('sf-slider-rotation-place', plated && 'sf-slider-arrows--plate')}>
      <sf-button-icon
        root-class="sf-slider-rotation sf-slider-button-rotation"
        icon="pause"
        size=${context.buttonSize || '1'}
        appearance=${plated ? 'ghost' : 'tonal'}
        scheme="on-surface"
        aria-label=${context.pauseLabel}
      ></sf-button-icon>
    </div>
  `;
}

function renderPosition(context) {
  if (!context.dots) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const authored = context.component?.hasAttribute?.('dots-type');
  const place = authored ? '' : context.content ? 'bare' : 'plate';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${getDotsClasses(context.dotsType, context.dotsSize, place)}></div>`;
}

const RATIOS = new Set(['16/9', '4/3', '3/2', '1/1', '21/9', 'auto']);
function renderSliderTemplate(context) {
  context = { ...context,
    content: /(^|\s)sf-slider--content(\s|$)/.test(context.rootClass || '')
  };
  const ratio = String(context.ratio || '16/9').replace(/\s+/g, '');
  const rootClasses = joinClasses('sf-slider', context.rootClass);
  const authoredSpaceBetween = context.component?.hasAttribute('space-between');
  const authoredSpeed = context.component?.hasAttribute('speed');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-roledescription=${context.regionRoleDescription || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-label=${context.regionLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-slide-label=${context.slideLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-slide-roledescription=${context.slideRoleDescription || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-ratio=${RATIOS.has(ratio) ? ratio : '16/9'}
      data-pause-label=${context.pauseLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-play-label=${context.playLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

      ${context.arrows || context.dots || context.autoplay ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-slider-controls">
              ${renderRotation(context)}
              ${context.content ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderPosition(context)}${renderArrows(context)}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderArrows(context)}${renderPosition(context)}`}
            </div>
          ` : ''}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5dcef5de40cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("alias-table", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("alias-table", 1).then(resolve, reject), { once: true })));

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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2487a822fc8d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-slider for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-slider","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-slide-change","to":"change","kind":"event","component":"sf-slider","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8","note":"the old name follows change with the same detail; component, tagName and template are no longer in it (§8)"},{"from":"getSlider","to":null,"kind":"action","component":"sf-slider","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"},{"from":"primary-dark","to":"primary-container","kind":"value","setting":"dots-type","component":"sf-slider","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role"},{"from":"primary-light","to":"primary","kind":"value","setting":"dots-type","component":"sf-slider","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role"},{"from":"light","to":"surface-container","kind":"value","setting":"dots-type","component":"sf-slider","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role"},{"from":"clear","to":"surface-container","kind":"value","setting":"dots-type","component":"sf-slider","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role"},{"from":"dark","to":"surface-inverse","kind":"value","setting":"dots-type","component":"sf-slider","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role"}]}');

/***/ },

/***/ "85a15fb0aee7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.slider","tag":"sf-slider","version":"1.3.6","kind":"leaf","settings":{"button-type":{"type":"string","default":"secondary"},"button-size":{"type":"string","default":"1"},"dots":{"type":"boolean","default":true},"dots-type":{"type":"string","default":"primary-container"},"dots-size":{"type":"string","default":"2"},"thumbs":{"type":"boolean","default":false},"thumbs-class":{"type":"string","default":""},"thumb-class":{"type":"string","default":""},"arrows":{"type":"boolean","default":true},"loop":{"type":"boolean","default":false},"space-between":{"type":"number","default":12},"speed":{"type":"number","default":450},"slide-class":{"type":"string","default":""},"ratio":{"type":"enum","values":["16/9","4/3","3/2","1/1","21/9","auto"],"default":"16/9"}},"values":{},"events":{"change":{"carries":{"active-index":"number","real-index":"number","previous-index":"number"}}},"actions":{"refresh":{},"slide-next":{},"slide-prev":{}},"css-variables":{"--sf-slider-gap":{"type":"length","state":"default"},"--sf-slider-arrow-offset-inline":{"type":"length","state":"default"},"--sf-slider-dots-offset-block":{"type":"length","state":"default"},"--sf-slider-thumbnail-size":{"type":"length","state":"default"},"--sf-slider-thumbnail-radius":{"type":"length","state":"default"}}}');

/***/ },

/***/ "dd6cee132a1d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Slider","runtime":{"next":"Next slide","previous":"Previous slide","label":"Slides","carousel":"carousel","slide":"slide","position":"{n} of {count}","pause":"Stop slides","play":"Start slides"}}');

/***/ },

/***/ "c9b3780c37ac"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Слайдер контента","runtime":{"next":"Следующий слайд","previous":"Предыдущий слайд","label":"Слайды","carousel":"карусель","slide":"слайд","position":"{n} из {count}","pause":"Остановить прокрутку","play":"Запустить прокрутку"}}');

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