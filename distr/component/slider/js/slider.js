/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
    return optionName === prefix || /^[A-Z]/.test(rest);
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
    spaceBetween: toNumber(getOption(root, element, 'spaceBetween'), 0),
    speed: toNumber(getOption(root, element, 'speed'), 300),
    watchSlidesProgress: true
  };
  const autoplay = createAutoplayOptions(root, element);

  if (autoplay) {
    options.autoplay = autoplay;
  }

  options = deepMerge(options, collectSwiperDataOptions(root, element));
  return normalizeAutoplayOptions(options);
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
      spaceBetween: 6,
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

  const slider = new window.Swiper(mainEl, sliderOptions);
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
  root._sfSlider?.destroy?.(true, true);
  root._sfSliderThumbs?.destroy?.(true, true);
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

/***/ "211fcc82fdf0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9e5aefb3c7c5");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "83898a5e7b0c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("83898a5e7b0c");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("211fcc82fdf0");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* SLIDER
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;