/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "2d7307156263"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("db0c5662903e");
 // The words live in the component's language files (localization study LC-4):
// one place for every language, as the Smart components keep them.

 // Every word this part says. A product adds a language with
// SF.language.register('sf-swiper', code, words); a ternary on «ru» allowed two
// and no more.

const SWIPER_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value)); // A press becomes a drag after this many pixels; below it a press stays a
// click (a link, a button inside the slide). It is a gesture tolerance, not
// something drawn.


const DRAG_SLOP = 6; // A drag pages when it travelled this part of one slide, or moved fast.

const DRAG_RATIO = 0.15;
const FLICK_SPEED = 0.4; // px per ms
// A scroll that has not moved for this long has come to rest (where the
// browser has no scrollend event). A gesture timing, not something drawn.

const SCROLL_REST = 120; // A programmatic scroll that never arrives (the strip was hidden, the person
// took it over) gives up after its own speed and this much more.

const SCROLL_GIVE_UP = 700; // A wheel step counted in lines (deltaMode 1) is this many pixels, as
// browsers scroll a line. A gesture tolerance, not something drawn.

const WHEEL_LINE = 40;
const EDITABLE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], .swiper-no-swiping';

const prefersReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value); // Swiper's own message words: {{index}} and {{slidesLength}}.


const formatMessage = (template, index, length) => String(template).replaceAll('{{index}}', String(index + 1)).replaceAll('{{slidesLength}}', String(length));

const numeric = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback; // The engine owns the strip's accessibility (owner decision C245): hidden
// slides inert, an edge button really disabled, slide names counted again on
// update(), no autoplay under reduced motion. a11y: false (or
// {enabled: false}) leaves all four to the caller.


const a11yOn = params => params.a11y !== false && !(isPlainObject(params.a11y) && params.a11y.enabled === false); // The <button> of a navigation element: the element itself, or the one button
// inside a host (an sf-button-icon around its .sf-icon-button).


const buttonOf = element => {
  if (!(element instanceof Element)) return null;
  if (element instanceof HTMLButtonElement) return element;
  const inner = element.querySelectorAll('button');
  return inner.length === 1 ? inner[0] : null;
};

function resolveElement(value, root) {
  if (value instanceof Element) return value;
  if (typeof value === 'string') return root.closest('body')?.querySelector(value) || document.querySelector(value);
  return null;
}

class SimaiSlider {
  constructor(root, options = {}) {
    if (!(root instanceof Element)) throw new TypeError('Slider root must be an Element');
    this.el = root;
    this.originalParams = { ...options
    };
    this.params = { ...options
    };
    this.events = new Map();
    this.activeIndex = 0;
    this.realIndex = 0;
    this.previousIndex = 0;
    this.destroyed = false;
    this.enabled = true;
    this.rtlTranslate = getComputedStyle(root).direction === 'rtl';
    this.wrapperEl = root.querySelector('.swiper-wrapper') || root.firstElementChild; // The track is the browser's own scroll with snap points (owner decision
    // 2026-11-21, carousel study): a finger, a trackpad's two fingers, the
    // momentum and the rubber band at an end are the browser's; the arrows,
    // the dots, the keys and the mouse drag move the scroll. cssMode false
    // (Swiper's name) keeps the former transform strip.

    this.css = options.cssMode !== false;
    this._target = null;
    this.navigation = {};
    this.pagination = {};
    this.autoplay = this.createAutoplay();
    this.attachControls();
    this.attachKeyboard();
    if (this.css) this.attachScrollTrack();else this.attachPointer();
    this.attachResize();
    root.swiper = this;
    root.classList.add('swiper-initialized', 'swiper-horizontal');
    if (this.css) root.classList.add('swiper-css-mode');
    this.update();
    this.slideTo(numeric(options.initialSlide, 0), 0, false);
    queueMicrotask(() => this.emit('init'));
  }

  on(name, listener) {
    if (!this.events.has(name)) this.events.set(name, new Set());
    this.events.get(name).add(listener);
    return this;
  }

  off(name, listener) {
    this.events.get(name)?.delete(listener);
    return this;
  }

  emit(name, ...args) {
    for (const listener of this.events.get(name) || []) listener(this, ...args);
  }

  attachControls() {
    const navigation = this.params.navigation || {};
    this.navigation.prevEl = resolveElement(navigation.prevEl, this.el);
    this.navigation.nextEl = resolveElement(navigation.nextEl, this.el);

    this._previous = () => this.slidePrev();

    this._next = () => this.slideNext();

    this.navigation.prevEl?.addEventListener('click', this._previous);
    this.navigation.nextEl?.addEventListener('click', this._next);
    this.pagination.el = resolveElement(this.params.pagination?.el, this.el);

    this.pagination.render = () => this.renderPagination();

    this.pagination.update = () => this.sync();
  } // The keys listen on keyboard.el when the caller names one (sf-slider names
  // its whole block: the arrows and dots sit outside the strip, and a key
  // pressed on them moved nothing, SL-3), else on the strip. A key pressed in
  // a field inside a slide stays the field's.


  attachKeyboard() {
    this._keyboard = event => {
      const enabled = this.params.keyboard === true || this.params.keyboard?.enabled;
      if (!enabled || !this.enabled || this.destroyed) return;
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest(EDITABLE)) return;
      const rtl = this.isRtl();
      if (event.key === 'ArrowRight') rtl ? this.slidePrev() : this.slideNext();else if (event.key === 'ArrowLeft') rtl ? this.slideNext() : this.slidePrev();else return;
      event.preventDefault();
    };

    this.keyboardEl = resolveElement(this.params.keyboard?.el, this.el) || this.el;
    this.keyboardEl.addEventListener('keydown', this._keyboard);
  }

  isRtl() {
    return this.rtlTranslate || getComputedStyle(this.el).direction === 'rtl';
  } // Swipe and drag (SL-2): a finger, a pen or the mouse pulls the strip and
  // pages when let go past DRAG_RATIO of a slide or with a flick. The strip
  // takes horizontal moves only (touch-action: pan-y in the sheet, the
  // swiper-touch class): a vertical move scrolls the page and is never taken.
  // allowTouchMove false turns it off, simulateTouch false leaves the mouse
  // out (Swiper's names). A drag never ends in a click on a link under it.


  attachPointer() {
    this._drag = null;

    const allowed = () => this.params.allowTouchMove !== false && this.enabled && !this.destroyed;

    if (this.params.allowTouchMove !== false) this.el.classList.add('swiper-touch');

    this._pointerDown = event => {
      if (!allowed() || !event.isPrimary) return;
      if (event.pointerType === 'mouse' && (event.button !== 0 || this.params.simulateTouch === false)) return;
      if (event.target instanceof Element && event.target.closest(EDITABLE)) return; // Nothing to page: every slide is in view. With a fractional count
      // (three slides at 2.2) there is one stop more than whole slides give,
      // and a drag reaches it as the button does (RG-OT 2).

      if (!this.params.loop && this.lastIndex() === 0) return;
      this._drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        t: event.timeStamp,
        dx: 0,
        state: 'pending'
      };
    };

    this._pointerMove = event => {
      const drag = this._drag;
      if (!drag || event.pointerId !== drag.id || drag.state === 'off') return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;

      if (drag.state === 'pending') {
        if (Math.abs(dx) < DRAG_SLOP && Math.abs(dy) < DRAG_SLOP) return;

        if (Math.abs(dy) >= Math.abs(dx)) {
          drag.state = 'off';
          return;
        }

        drag.state = 'drag';

        try {
          this.el.setPointerCapture(event.pointerId);
        } catch {
          /* the pointer is gone */
        }

        this.el.classList.add('swiper-dragging');
        if (this.wrapperEl) this.wrapperEl.style.transitionDuration = '0ms';
        this.emit('touchStart');
      }

      event.preventDefault();
      const last = this.lastIndex();
      const rtl = this.isRtl(); // Past an edge the strip gives a third of the move: there is nothing there.

      const forward = rtl ? dx > 0 : dx < 0;
      const atEdge = !this.params.loop && (forward && this.activeIndex >= last || !forward && this.activeIndex <= 0);
      drag.dx = atEdge ? dx / 3 : dx;
      this.place(drag.dx);
      this.emit('sliderMove');
    };

    this._pointerUp = event => {
      const drag = this._drag;
      if (!drag || event.pointerId !== drag.id) return;
      this._drag = null;
      if (drag.state !== 'drag') return;
      this.el.classList.remove('swiper-dragging');

      try {
        this.el.releasePointerCapture(event.pointerId);
      } catch {
        /* released */
      }

      const step = this.el.clientWidth / this.perView();
      const elapsed = Math.max(1, event.timeStamp - drag.t);
      const travelled = Math.abs(drag.dx);
      const pages = event.type !== 'pointercancel' && (travelled > step * DRAG_RATIO || travelled > DRAG_SLOP * 2 && travelled / elapsed > FLICK_SPEED); // The click that follows the release belongs to the drag, not to a link.

      const swallow = click => {
        click.preventDefault();
        click.stopPropagation();
      };

      this.el.addEventListener('click', swallow, {
        capture: true,
        once: true
      });
      window.setTimeout(() => this.el.removeEventListener('click', swallow, {
        capture: true
      }), 0);
      const forward = this.isRtl() ? drag.dx > 0 : drag.dx < 0;
      const before = this.activeIndex;
      if (pages) this.slideTo(this.activeIndex + (forward ? 1 : -1));

      if (this.activeIndex === before) {
        if (this.wrapperEl) this.wrapperEl.style.transitionDuration = `${this.settleSpeed()}ms`;
        this.sync();
      } else if (this.params.autoplay?.disableOnInteraction) {
        this.autoplay.stop();
      }

      this.emit('touchEnd');
    }; // A picture or a link would start the browser's own drag and steal the gesture.


    this._dragStart = event => {
      if (this.params.allowTouchMove !== false) event.preventDefault();
    };

    this.el.addEventListener('pointerdown', this._pointerDown);
    this.el.addEventListener('pointermove', this._pointerMove);
    this.el.addEventListener('pointerup', this._pointerUp);
    this.el.addEventListener('pointercancel', this._pointerUp);
    this.el.addEventListener('dragstart', this._dragStart);
  } // The scroll track (cssMode, the default since 2.0.0). The browser moves
  // the strip for a finger, a pen, a trackpad and the wheel: a horizontal
  // move pages and snaps to a slide, a vertical one scrolls the page
  // (touch-action stays the browser's). The engine follows the scroll: the
  // slide nearest to it becomes the active one. The mouse has no scroll
  // gesture of its own, so a press and drag pulls the strip (simulateTouch
  // false leaves the mouse out); allowTouchMove false leaves the strip to the
  // buttons alone. A drag never ends in a click on a link under it.


  attachScrollTrack() {
    const track = this.wrapperEl;
    if (!track) return;
    const userMoves = this.params.allowTouchMove !== false;
    if (userMoves) this.el.classList.add('swiper-touch');
    if (userMoves && this.params.simulateTouch !== false) this.el.classList.add('swiper-mouse-drag');
    this._scrollFrame = 0;
    this._restTimer = 0;

    this._scroll = () => {
      if (this.destroyed) return;
      window.clearTimeout(this._restTimer);
      this._restTimer = window.setTimeout(() => this.scrollRest(), SCROLL_REST);
      if (this._scrollFrame) return;
      this._scrollFrame = window.requestAnimationFrame(() => {
        this._scrollFrame = 0;
        this.followScroll();
      });
    };

    this._scrollEnd = () => this.scrollRest(); // A person's own scroll takes over from a programmatic one; a vertical
    // wheel scrolls the page and is not one.


    this._takeOver = event => {
      if (this._drag?.state === 'drag') return;
      if (event?.type === 'wheel' && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      this.releaseTarget();
      this._userScroll = true;
    };

    this._drag = null;

    const allowed = () => userMoves && this.params.simulateTouch !== false && this.enabled && !this.destroyed;

    this._pointerDown = event => {
      this._takeOver();

      if (event.pointerType !== 'mouse' || event.button !== 0 || !event.isPrimary || !allowed()) return;
      if (event.target instanceof Element && event.target.closest(EDITABLE)) return;
      if (!this.params.loop && this.lastIndex() === 0) return;
      this._drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        t: event.timeStamp,
        from: this.activeIndex,
        start: this.scrollPosition(),
        dx: 0,
        state: 'pending'
      };
    };

    this._pointerMove = event => {
      const drag = this._drag;
      if (!drag || event.pointerId !== drag.id || drag.state === 'off') return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;

      if (drag.state === 'pending') {
        if (Math.abs(dx) < DRAG_SLOP && Math.abs(dy) < DRAG_SLOP) return;

        if (Math.abs(dy) >= Math.abs(dx)) {
          drag.state = 'off';
          return;
        }

        drag.state = 'drag';

        try {
          this.el.setPointerCapture(event.pointerId);
        } catch {
          /* the pointer is gone */
        }

        this.el.classList.add('swiper-dragging');
        this.emit('touchStart');
      }

      event.preventDefault();
      drag.dx = dx; // The strip follows the pointer: content moves with it, mirrored right to left.

      this.setScrollPosition(drag.start - (this.isRtl() ? -dx : dx), 'instant');
      this.emit('sliderMove');
    };

    this._pointerUp = event => {
      const drag = this._drag;
      if (!drag || event.pointerId !== drag.id) return;
      this._drag = null;
      if (drag.state !== 'drag') return;

      try {
        this.el.releasePointerCapture(event.pointerId);
      } catch {
        /* released */
      }

      const step = this.stepSize();
      const elapsed = Math.max(1, event.timeStamp - drag.t);
      const travelled = Math.abs(drag.dx);
      const pages = event.type !== 'pointercancel' && (travelled > step * DRAG_RATIO || travelled > DRAG_SLOP * 2 && travelled / elapsed > FLICK_SPEED);

      const swallow = click => {
        click.preventDefault();
        click.stopPropagation();
      };

      this.el.addEventListener('click', swallow, {
        capture: true,
        once: true
      });
      window.setTimeout(() => this.el.removeEventListener('click', swallow, {
        capture: true
      }), 0);
      const forward = this.isRtl() ? drag.dx > 0 : drag.dx < 0; // The snap stays off until the strip arrives: turned on under a moving
      // strip it would jump to the nearest slide first.

      this._releaseDragging = true;
      const before = this.activeIndex;
      this.slideTo(pages ? drag.from + (forward ? 1 : -1) : drag.from);
      if (this.activeIndex !== before && this.params.autoplay?.disableOnInteraction) this.autoplay.stop();
      this.emit('touchEnd');
    };

    this._dragStart = event => {
      if (userMoves) event.preventDefault();
    }; // A trackpad's two-finger swipe (and Shift with a wheel) is a stream of
    // horizontal wheel steps, its momentum included. The strip follows the
    // stream with the snap held, and when it stops it pages as a drag does:
    // past 15 % of a slide forward or back, else back to its slide. Left to
    // the browser, a stream that paused between steps was snapped back to the
    // nearest slide before it crossed half of one. A vertical wheel and a
    // pinch (ctrl) stay the page's.


    this._wheelGesture = null;

    this._wheel = event => {
      if (!userMoves || !this.enabled || this.destroyed || event.ctrlKey) return;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      if (!this.params.loop && this.lastIndex() === 0) return;
      event.preventDefault();
      this.releaseTarget();
      this._userScroll = true;
      const unit = event.deltaMode === 1 ? WHEEL_LINE : event.deltaMode === 2 ? track.clientWidth : 1;
      let gesture = this._wheelGesture;

      if (!gesture) {
        gesture = {
          from: this.activeIndex,
          start: this.stopPosition(this.activeIndex),
          travel: 0
        };
        this._wheelGesture = gesture;
        this.el.classList.add('swiper-dragging');
        this.emit('touchStart');
      }

      const step = this.stepSize();
      gesture.travel = clamp(gesture.travel + event.deltaX * unit * (this.isRtl() ? -1 : 1), -step, step);
      this.setScrollPosition(gesture.start + gesture.travel, 'instant');
      this.emit('sliderMove');
      window.clearTimeout(gesture.timer);
      gesture.timer = window.setTimeout(() => this.endWheel(), SCROLL_REST);
    }; // A finger let go short of half a slide is snapped back by the browser;
    // past 15 % of one it pages, as the mouse drag does (a flick carries on
    // by itself).


    this._touchStart = event => {
      this._takeOver(event);

      this._touch = {
        from: this.activeIndex,
        start: this.stopPosition(this.activeIndex)
      };
    };

    this._touchEnd = () => {
      const touch = this._touch;
      this._touch = null;
      if (!touch || !userMoves || !this.enabled) return;
      window.requestAnimationFrame(() => {
        if (this.destroyed || this._target !== null || this.activeIndex !== touch.from) return;
        const travel = this.scrollPosition() - touch.start;
        if (Math.abs(travel) <= this.stepSize() * DRAG_RATIO) return;
        this.slideTo(touch.from + (travel > 0 ? 1 : -1));
        if (this.params.autoplay?.disableOnInteraction !== false) this.autoplay.stop();
      });
    };

    track.addEventListener('scroll', this._scroll, {
      passive: true
    });
    track.addEventListener('scrollend', this._scrollEnd);
    track.addEventListener('wheel', this._wheel, {
      passive: false
    });
    track.addEventListener('touchstart', this._touchStart, {
      passive: true
    });
    track.addEventListener('touchend', this._touchEnd, {
      passive: true
    });
    track.addEventListener('touchcancel', this._touchEnd, {
      passive: true
    });
    this.el.addEventListener('pointerdown', this._pointerDown);
    this.el.addEventListener('pointermove', this._pointerMove);
    this.el.addEventListener('pointerup', this._pointerUp);
    this.el.addEventListener('pointercancel', this._pointerUp);
    this.el.addEventListener('dragstart', this._dragStart);
  } // The scroll in the reading direction: 0 at the first slide, growing
  // towards the last, right to left too (there scrollLeft runs negative).


  scrollPosition() {
    const left = this.wrapperEl?.scrollLeft || 0;
    return this.isRtl() ? -left : left;
  }

  setScrollPosition(position, behavior = 'instant') {
    if (!this.wrapperEl) return;
    const value = clamp(position, 0, this.maxScroll());
    this.wrapperEl.scrollTo({
      left: this.isRtl() ? -value : value,
      behavior
    });
  }

  maxScroll() {
    const track = this.wrapperEl;
    return track ? Math.max(0, track.scrollWidth - track.clientWidth) : 0;
  } // Where slide i starts, measured from the first slide in the reading direction.


  slideStart(index) {
    const slides = this.slides;
    const first = slides[0];
    const slide = slides[index];
    if (!first || !slide) return 0;
    const a = first.getBoundingClientRect();
    const b = slide.getBoundingClientRect();
    return this.isRtl() ? a.right - b.right : b.left - a.left;
  } // The scroll at which slide i is the active one: its start, short of the end.


  stopPosition(index) {
    return Math.min(this.slideStart(index), this.maxScroll());
  }

  stepSize() {
    if (this.css && this.slides.length > 1) return Math.abs(this.slideStart(1)) || this.el.clientWidth / this.perView();
    return this.el.clientWidth / this.perView();
  } // The stop nearest to the scroll: the last one at the end of the strip.


  nearestStop() {
    const position = this.scrollPosition();
    const last = this.lastIndex();
    if (position >= this.maxScroll() - 1) return last;
    let best = 0;
    let distance = Infinity;

    for (let index = 0; index <= last; index += 1) {
      const gap = Math.abs(this.stopPosition(index) - position);

      if (gap < distance) {
        distance = gap;
        best = index;
      }
    }

    return best;
  } // The wheel stream stopped: page past DRAG_RATIO of a slide, else go back.


  endWheel() {
    const gesture = this._wheelGesture;
    this._wheelGesture = null;
    if (!gesture || this.destroyed) return;
    const pages = Math.abs(gesture.travel) > this.stepSize() * DRAG_RATIO;
    this._releaseDragging = true;
    const before = this.activeIndex;
    this.activeIndex = gesture.from;
    this.slideTo(pages ? gesture.from + (gesture.travel > 0 ? 1 : -1) : gesture.from);

    if (this.activeIndex !== before || pages) {
      if (this.params.autoplay?.disableOnInteraction !== false) this.autoplay.stop();
    }

    this.emit('touchEnd');
  } // Scroll to the active slide's stop; smooth unless the speed is 0, the
  // person asked for less motion, or the strip is placed without travelling.


  scrollToActive(speed = this.params.speed) {
    if (!this.wrapperEl) return;
    const target = this.stopPosition(this.activeIndex);

    if (Math.abs(target - this.scrollPosition()) < 1) {
      this.releaseTarget();
      this.arrive();
      return;
    }

    const smooth = numeric(speed, 300) > 0 && !prefersReducedMotion();
    this._target = this.activeIndex;
    window.clearTimeout(this._giveUp);
    this._giveUp = window.setTimeout(() => {
      this.releaseTarget();
      this.arrive();
    }, (smooth ? numeric(speed, 300) : 0) + SCROLL_GIVE_UP);
    this.setScrollPosition(target, smooth ? 'smooth' : 'instant');

    if (!smooth) {
      this.releaseTarget();
      this.arrive();
    }
  }

  releaseTarget() {
    this._target = null;
    window.clearTimeout(this._giveUp);
  } // The strip came to rest where it was sent: the snap comes back after a drag.


  arrive() {
    if (this._releaseDragging) {
      this._releaseDragging = false;
      this.el.classList.remove('swiper-dragging');
    }

    this.syncVisibility();
  } // While the strip scrolls, the slides in view are counted again; a scroll
  // the person made moves the active slide with it (a programmatic one keeps
  // the slide it was sent to).


  followScroll() {
    if (this.destroyed) return;
    this.syncVisibility();

    if (this._target !== null) {
      if (Math.abs(this.stopPosition(this._target) - this.scrollPosition()) < 1) {
        this.releaseTarget();
        this.arrive();
      }

      return;
    }

    if (this._drag?.state === 'drag' || this._wheelGesture) return;
    const next = this.nearestStop();
    if (next === this.activeIndex) return;
    this.previousIndex = this.activeIndex;
    this.activeIndex = next;
    this.realIndex = next;
    this.syncControls();
    this.emit('slideChange');
    if (this._userScroll && this.autoplay.running && this.params.autoplay?.disableOnInteraction !== false) this.autoplay.stop();else this.autoplay.restart?.();
  }

  scrollRest() {
    if (this.destroyed) return;
    window.clearTimeout(this._restTimer);

    if (this._target !== null) {
      this.releaseTarget();
      this.arrive();
    } else if (this._releaseDragging && !this._drag) {
      this.arrive();
    } else {
      this.followScroll();
    }

    const user = this._userScroll;
    this._userScroll = false;
    if (user) this.emit('transitionEnd');
  }

  perView() {
    return Math.max(1, numeric(this.params.slidesPerView, 1));
  } // With a part of the next slide in view (slidesPerView 2.2, C143 (7)) the
  // last stop lays the last slide whole at the end: one stop more than whole
  // slides would give, and that stop moves the strip only as far as it can go.


  lastIndex() {
    return Math.max(0, Math.ceil(this.slides.length - this.perView() - 1e-6));
  } // The strip's offset in slides: the active index, short of the end.


  offsetSlides() {
    return Math.min(this.activeIndex, Math.max(0, this.slides.length - this.perView()));
  } // Responsive settings (breakpoints) are read again when their width changes;
  // nothing listened before, so a slider kept the count of the width it was
  // started at. The width is the strip's own (breakpointsBase 'container', the
  // default since 1.2.0: a component follows the width of its place, C181
  // (2)); breakpointsBase 'window' keeps Swiper's window width.


  attachResize() {
    this._resizeFrame = 0;

    this._resize = () => {
      if (this._resizeFrame || this.destroyed) return;
      this._resizeFrame = window.requestAnimationFrame(() => {
        this._resizeFrame = 0;
        if (this.destroyed) return;
        const before = this.perView();
        const width = this.el.clientWidth; // The scroll track lays the active slide at its stop again when its
        // width changed (a height change, a phone's address bar, is not one).

        const moved = width !== this._width;
        this._width = width;
        if (!this.css || this.originalParams.breakpoints || moved) this.update();
        if (this.css && moved && !this._drag) this.scrollToActive(0);
        if (this.perView() !== before) this.emit('breakpoint');
        this.emit('resize');
      });
    };

    if (!this.originalParams.breakpoints && !this.css) return;

    if (this.breakpointsBase() === 'window' || typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', this._resize);
      return;
    }

    this._resizeObserver = new ResizeObserver(this._resize);

    this._resizeObserver.observe(this.el);
  }

  breakpointsBase() {
    return this.originalParams.breakpointsBase === 'window' ? 'window' : 'container';
  } // The width breakpoints are read against: the strip's own, or the window's.


  breakpointsWidth() {
    if (this.breakpointsBase() === 'window') return window.innerWidth;
    return this.el.getBoundingClientRect().width;
  }

  gap() {
    return Math.max(0, numeric(this.params.spaceBetween, 0));
  }

  settleSpeed() {
    return prefersReducedMotion() ? 0 : numeric(this.params.speed, 300);
  } // The strip's offset for the active slide, plus a drag. With spaceBetween
  // the slides stand that far apart (SL-8): each slide is (100% - gaps) / n
  // wide and one step is (100% + gap) / n.


  place(dragX = 0) {
    if (!this.wrapperEl) return;
    const perView = this.perView();
    const gap = this.gap();
    const direction = this.isRtl() ? 1 : -1;
    const offset = this.offsetSlides();
    const shift = gap && offset ? `calc(${direction * offset} * (100% + ${gap}px) / ${perView})` : `${direction * offset * (100 / perView)}%`;
    this.wrapperEl.style.transform = dragX ? `translate3d(calc(${shift} + ${dragX}px), 0, 0)` : `translate3d(${shift}, 0, 0)`;
  } // Autoplay turns a slide every delay. pause() holds the time left (a
  // pointer over the slider, a hidden tab) and resume() goes on from it, so a
  // timed indicator that froze with it stays true; stop() and start() are
  // the person's. At the last slide it goes back to the first
  // (stopOnLastSlide stops there), reverseDirection turns backwards.


  createAutoplay() {
    let timer = null;
    let startedAt = 0;
    let left = 0;
    const settings = this.params.autoplay;

    const delay = () => numeric(this.params.autoplay?.delay ?? settings?.delay, 5000);

    const clear = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    };

    const schedule = ms => {
      clear();
      startedAt = Date.now();
      left = ms;
      timer = window.setTimeout(turn, ms);
    };

    const turn = () => {
      timer = null;
      if (!api.running || api.paused || this.destroyed) return;
      const options = this.params.autoplay || {};
      const back = Boolean(options.reverseDirection);
      const last = this.lastIndex();
      const atEnd = back ? this.activeIndex <= 0 : this.activeIndex >= last;

      if (atEnd && !this.params.loop) {
        if (options.stopOnLastSlide) {
          api.stop();
          return;
        }

        this.slideTo(back ? last : 0);
      } else if (back) this.slidePrev();else this.slideNext();

      if (api.running && !api.paused && timer === null) schedule(delay());
    };

    const api = {
      running: false,
      paused: false,
      start: () => {
        if (!settings || settings.enabled === false || api.running) return false; // Under reduced motion the slides do not turn by themselves (C245).

        if (a11yOn(this.params) && prefersReducedMotion()) return false;
        api.running = true;
        api.paused = false;
        schedule(delay());
        this.emit('autoplayStart');
        return true;
      },
      stop: () => {
        clear();
        const wasRunning = api.running;
        api.running = false;
        api.paused = false;
        if (wasRunning) this.emit('autoplayStop');
        return wasRunning;
      },
      pause: () => {
        if (!api.running || api.paused) return false;
        clear();
        left = Math.max(0, left - (Date.now() - startedAt));
        api.paused = true;
        this.emit('autoplayPause');
        return true;
      },
      resume: () => {
        if (!api.running || !api.paused) return false;
        api.paused = false;
        schedule(left);
        this.emit('autoplayResume');
        return true;
      },
      // A slide changed: its own full time starts (held, it waits whole).
      restart: () => {
        if (!api.running) return;

        if (api.paused) {
          left = delay();
          return;
        }

        schedule(delay());
      }
    };
    return api;
  }

  get slides() {
    return [...(this.wrapperEl?.children || [])].filter(node => node.classList.contains('swiper-slide'));
  }

  selectedParams() {
    const width = this.breakpointsWidth();
    const points = Object.entries(this.originalParams.breakpoints || {}).map(([point, value]) => [Number(point), value]).filter(([point]) => Number.isFinite(point) && point <= width).sort((a, b) => a[0] - b[0]);
    return points.length ? { ...this.originalParams,
      ...points.at(-1)[1]
    } : { ...this.originalParams
    };
  }

  update() {
    const slides = this.slides;
    const selected = this.selectedParams();
    this.params = selected;
    const slidesPerView = this.perView();
    const gap = this.gap();
    const a11y = isPlainObject(this.params.a11y) ? this.params.a11y : {};

    if (this.wrapperEl) {
      if (gap) this.wrapperEl.style.gap = `${gap}px`;else this.wrapperEl.style.removeProperty('gap');
    }

    slides.forEach((slide, index) => {
      slide.dataset.swiperSlideIndex = String(index);
      slide.setAttribute('role', a11y.slideRole || 'group'); // «слайд» / «slide» when the caller gives the word (SL-5).

      if (a11y.itemRoleDescriptionMessage) slide.setAttribute('aria-roledescription', a11y.itemRoleDescriptionMessage); // A slide the page named keeps its name («Закат»); it used to be replaced
      // by «1 / 2» on every update, before the carousel could even remember it.
      // A name the engine wrote is counted again on every update (C245, RG-OT
      // 3): it is kept in data-swiper-slide-label, so a slide copied from
      // another («1 / 2» and its mark) is renamed «3 / 3», not taken as the
      // page's own name.

      const current = slide.getAttribute('aria-label');

      if (slide.__sfAuthoredLabel === undefined || current !== null && current !== slide.__sfAuthoredLabel && current !== slide.dataset.swiperSlideLabel) {
        slide.__sfAuthoredLabel = current !== null && current === slide.dataset.swiperSlideLabel ? '' : current ?? '';
      }

      const label = slide.__sfAuthoredLabel || formatMessage(a11y.slideLabelMessage || '{{index}} / {{slidesLength}}', index, slides.length);
      if (slide.__sfAuthoredLabel) delete slide.dataset.swiperSlideLabel;else slide.dataset.swiperSlideLabel = label;
      slide.setAttribute('aria-label', label);
      slide.style.flexBasis = gap && slidesPerView > 1 ? `calc((100% - ${(slidesPerView - 1) * gap}px) / ${slidesPerView})` : `${100 / slidesPerView}%`;
    });
    this.activeIndex = clamp(this.activeIndex, 0, this.lastIndex());
    this.realIndex = this.activeIndex;
    this.renderPagination();
    this.sync();
    if (this.css && this._target === null && !this._drag) this.scrollToActive(0);
    if (this.params.autoplay && !this.autoplay.running) this.autoplay.start();
    this.emit('update');
    return this;
  } // Pagination: bullets (a button per slide) or, with type 'fraction', the
  // words «2 / 12» (C143 (4): many slides are counted, not dotted). With
  // keyboard on, the bullets are one Tab stop: the current one takes the
  // focus, ArrowLeft / ArrowRight, Home and End move the slide and the focus
  // with it (C143 (5), the APG tabbed carousel's picker), mirrored right to
  // left.


  renderPagination() {
    const root = this.pagination.el;
    if (!root) return;
    const options = this.params.pagination || {};
    root.replaceChildren();
    root.removeEventListener('keydown', this._paginationKeys || (() => {}));

    if (options.type === 'fraction') {
      root.append(Object.assign(document.createElement('span'), {
        className: options.currentClass || 'swiper-pagination-current'
      }));
      root.append(document.createTextNode(' / '));
      root.append(Object.assign(document.createElement('span'), {
        className: options.totalClass || 'swiper-pagination-total'
      }));
      return;
    }

    this.slides.forEach((_, index) => {
      const bullet = document.createElement(options.bulletElement || 'span');
      bullet.className = options.bulletClass || 'swiper-pagination-bullet';
      if (bullet instanceof HTMLButtonElement) bullet.type = 'button'; // The number has its place in the word ({n}): «Go to slide 3», «Folie 3
      // anzeigen» (C177 (9)). A word registered before 2026-11-14 has none; it is put after.

      const go = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_0__.pageText)(SWIPER_TEXT, 'goToSlide', root, 'sf-swiper');
      const number = new Intl.NumberFormat((0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(root)).format(index + 1);
      bullet.setAttribute('aria-label', go.includes('{n}') ? go.replace('{n}', number) : `${go} ${number}`);
      if (options.clickable) bullet.addEventListener('click', () => this.slideTo(index));
      root.append(bullet);
    });

    if (options.keyboard) {
      this._paginationKeys = event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !this.enabled) return;
        const rtl = this.isRtl();
        const last = this.slides.length - 1;
        const moves = {
          ArrowRight: rtl ? -1 : 1,
          ArrowLeft: rtl ? 1 : -1
        };
        let next;
        if (event.key in moves) next = this.activeIndex + moves[event.key];else if (event.key === 'Home') next = 0;else if (event.key === 'End') next = last;else return;
        event.preventDefault(); // The picker's own keys: the strip's keyboard option does not page twice.

        event.stopPropagation();
        if (this.params.loop) next = (next % (last + 1) + last + 1) % (last + 1);
        this.slideTo(clamp(next, 0, last));
        root.children[this.activeIndex]?.focus?.();
      };

      root.addEventListener('keydown', this._paginationKeys);
    }
  }

  sync() {
    this.syncVisibility();

    if (this.wrapperEl && !this.css) {
      this.place();
      this.wrapperEl.style.transitionDuration = `${numeric(this.params.speed, 300)}ms`;
    }

    return this.syncControls();
  } // In view: every slide the window shows a part of. The transform strip
  // counts it from the offset (short of the end at the last stop) to offset +
  // slidesPerView; the scroll track measures it, as a finger may hold the
  // strip anywhere (a strip not laid out yet is counted as the transform's).


  syncVisibility() {
    const slides = this.slides;
    const a11y = a11yOn(this.params);
    const slidesPerView = this.perView();
    const offset = this.offsetSlides();
    const track = this.wrapperEl;
    const measured = this.css && track && track.clientWidth > 0;
    const position = measured ? this.scrollPosition() : 0;
    const width = measured ? track.clientWidth : 0;
    slides.forEach((slide, index) => {
      const active = index === this.activeIndex;
      let visible;

      if (measured) {
        const start = this.slideStart(index);
        const size = slide.getBoundingClientRect().width;
        visible = start + size > position + 1 && start < position + width - 1;
      } else {
        visible = index + 1 > offset + 1e-6 && index < offset + slidesPerView - 1e-6;
      }

      slide.classList.toggle('swiper-slide-active', active);
      slide.classList.toggle('swiper-slide-visible', visible);
      slide.setAttribute('aria-hidden', String(!visible)); // A hidden slide's links and buttons leave the Tab order (C245); an
      // inert the page wrote stays.

      if (a11y) {
        if (slide.__sfAuthoredInert === undefined) slide.__sfAuthoredInert = slide.hasAttribute('inert');
        slide.toggleAttribute('inert', !visible || slide.__sfAuthoredInert);
      }
    });
  } // The arrows at an edge, the dots or the counter, after the active slide moved.


  syncControls() {
    const slides = this.slides;
    const a11y = a11yOn(this.params);
    const disabledClass = this.params.navigation?.disabledClass || 'swiper-button-disabled';
    const looping = Boolean(this.params.loop);
    const edges = [[this.navigation.prevEl, !looping && this.activeIndex === 0], [this.navigation.nextEl, !looping && this.activeIndex === this.lastIndex()]];
    edges.forEach(([element, off]) => element?.classList.toggle(disabledClass, off));
    if (a11y) this.disableEdgeButtons(edges);
    const pagination = this.params.pagination || {};

    if (pagination.type === 'fraction' && this.pagination.el) {
      const current = this.pagination.el.querySelector(`.${pagination.currentClass || 'swiper-pagination-current'}`);
      const total = this.pagination.el.querySelector(`.${pagination.totalClass || 'swiper-pagination-total'}`);
      if (current) current.textContent = String(this.activeIndex + 1);
      if (total) total.textContent = String(slides.length);
      return this;
    }

    const activeClass = pagination.bulletActiveClass || 'swiper-pagination-bullet-active';
    [...(this.pagination.el?.children || [])].forEach((bullet, index) => {
      const active = index === this.activeIndex;
      bullet.classList.toggle(activeClass, active);
      if (active) bullet.setAttribute('aria-current', 'true');else bullet.removeAttribute('aria-current');
      if (pagination.keyboard) bullet.tabIndex = active ? 0 : -1;
    });
    return this;
  } // A button with nowhere to go is a disabled button (C245, RG-OT 1): out of
  // the Tab order, drawn by its own disabled look; the mark class stays for a
  // non-button arrow. When the focus is on the button that stops, it moves to
  // the other one, so it does not fall to the page.


  disableEdgeButtons(edges) {
    const buttons = edges.map(([element, off]) => {
      const button = buttonOf(element); // A button the page disabled stays disabled.

      if (button && button.__sfSwiperDisabled === undefined) button.__sfSwiperDisabled = button.disabled;
      return [button, off || Boolean(button?.__sfSwiperDisabled)];
    });
    buttons.forEach(([button, off], index) => {
      if (!button || button.disabled === off) return;

      if (off && button === button.ownerDocument?.activeElement) {
        const [other, otherOff] = buttons[1 - index];

        if (other && !otherOff) {
          other.disabled = false;
          other.focus?.();
        }
      }

      button.disabled = off;
    });
  }

  slideTo(index, speed = this.params.speed, runCallbacks = true) {
    const length = this.slides.length;
    if (!length || !this.enabled) return this;
    let next = Number(index) || 0;
    if (this.params.loop) next = (next % length + length) % length;else next = clamp(next, 0, this.lastIndex());
    const changed = next !== this.activeIndex; // The slide shown before the change (SL-7), as Swiper's previousIndex.

    if (changed) this.previousIndex = this.activeIndex;
    this.activeIndex = next;
    this.realIndex = next;

    if (this.css) {
      this.syncControls();
      this.scrollToActive(speed);
      if (changed) this.autoplay.restart();
      if (changed && runCallbacks) this.emit('slideChange');
      if (runCallbacks) queueMicrotask(() => this.emit('transitionEnd'));
      return this;
    }

    if (this.wrapperEl) this.wrapperEl.style.transitionDuration = `${numeric(speed, 300)}ms`;
    this.sync();
    if (changed) this.autoplay.restart();
    if (changed && runCallbacks) this.emit('slideChange');
    if (runCallbacks) queueMicrotask(() => this.emit('transitionEnd'));
    return this;
  }

  slideNext() {
    return this.slideTo(this.activeIndex + 1);
  }

  slidePrev() {
    return this.slideTo(this.activeIndex - 1);
  }

  changeLanguageDirection(direction) {
    this.rtlTranslate = direction === 'rtl';
    this.el.dir = direction;
    return this.sync();
  }

  enable() {
    this.enabled = true;
    return this;
  }

  disable() {
    this.enabled = false;
    return this;
  }

  destroy(deleteInstance = true, cleanStyles = true) {
    if (this.destroyed) return;
    this.autoplay.stop();
    this.navigation.prevEl?.removeEventListener('click', this._previous);
    this.navigation.nextEl?.removeEventListener('click', this._next);
    this.keyboardEl?.removeEventListener('keydown', this._keyboard);
    if (this._paginationKeys) this.pagination.el?.removeEventListener('keydown', this._paginationKeys);
    window.removeEventListener('resize', this._resize);
    this._resizeObserver?.disconnect();
    if (this._resizeFrame) window.cancelAnimationFrame(this._resizeFrame);
    this.el.removeEventListener('pointerdown', this._pointerDown);
    this.el.removeEventListener('pointermove', this._pointerMove);
    this.el.removeEventListener('pointerup', this._pointerUp);
    this.el.removeEventListener('pointercancel', this._pointerUp);
    this.el.removeEventListener('dragstart', this._dragStart);

    if (this.css && this.wrapperEl) {
      this.wrapperEl.removeEventListener('scroll', this._scroll);
      this.wrapperEl.removeEventListener('scrollend', this._scrollEnd);
      this.wrapperEl.removeEventListener('wheel', this._wheel);
      this.wrapperEl.removeEventListener('touchstart', this._touchStart);
      this.wrapperEl.removeEventListener('touchend', this._touchEnd);
      this.wrapperEl.removeEventListener('touchcancel', this._touchEnd);
    }

    if (this._wheelGesture) window.clearTimeout(this._wheelGesture.timer);
    if (this._scrollFrame) window.cancelAnimationFrame(this._scrollFrame);
    window.clearTimeout(this._restTimer);
    window.clearTimeout(this._giveUp);
    this.el.classList.remove('swiper-touch', 'swiper-dragging', 'swiper-mouse-drag', 'swiper-css-mode');
    if (cleanStyles && this.wrapperEl) this.wrapperEl.removeAttribute('style');
    this.slides.forEach(slide => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-visible');
      slide.removeAttribute('aria-hidden');
      if (slide.__sfAuthoredInert !== undefined) slide.toggleAttribute('inert', slide.__sfAuthoredInert);
      delete slide.__sfAuthoredInert;
      if (cleanStyles) slide.style.removeProperty('flex-basis');
    });
    [this.navigation.prevEl, this.navigation.nextEl].map(buttonOf).forEach(button => {
      if (!button || button.__sfSwiperDisabled === undefined) return;
      button.disabled = button.__sfSwiperDisabled;
      delete button.__sfSwiperDisabled;
    });
    this.el.classList.remove('swiper-initialized', 'swiper-horizontal');
    this.destroyed = true;
    if (deleteInstance) delete this.el.swiper;
    this.emit('destroy');
    this.events.clear();
  }

}

if (typeof window !== 'undefined') window.Swiper = SimaiSlider;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SimaiSlider);

/***/ },

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   TAG_ALIAS_KIND: () => (/* binding */ TAG_ALIAS_KIND),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable),
/* harmony export */   readTagAliases: () => (/* binding */ readTagAliases)
/* harmony export */ });
// The dated alias table of one component (standard simai.smart-component
// 1.3.8 §16.20, vocabulary 1.1.5 §9): what the migration converter writes as
// <component>/aliases.json, read and checked here before core/js/aliases.js
// installs it on an element. Pure data, no DOM, so a build, a lint and the
// runtime share one reading of it.
//
// A table is a list of rows, or {tag, aliases: [rows]}. A row:
//
//   {from, to, kind, since, remove_after, mode?, when?, setting?, tag?}
//
//   kind      event | setting | attribute | action | value
//   since     the first day the new name exists, YYYY-MM-DD
//   remove_after
//             the last day the old name is promised, YYYY-MM-DD
//   mode      events only: same-detail (default) | detail-adds | split
//   when      events only, optional: {<detail field>: <value>}; the old name
//             is sent only for a new event whose detail matches (two old
//             names folded into one new name, as modal:after-hide and
//             modal:after-show into change)
//   setting   values only: the attribute the value belongs to
//
// A row that does not hold is refused with a reason, never thrown: the rest of
// the table still installs, and the refusals are reported.
//
// A `tag` row renames the element itself ({from: 'sf-close', to:
// 'sf-button-close', kind: 'tag', since, remove_after}). It is not installed on
// an element: the Smart base defines the old tag as a subclass when it defines
// the new one (core/js/tag-aliases.js), so readAliasTable leaves it out and
// readTagAliases reads it.
const ALIAS_KINDS = Object.freeze(['event', 'setting', 'attribute', 'action', 'value']);
const ALIAS_MODES = Object.freeze(['same-detail', 'detail-adds', 'split']);
const DAY = 86400000;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const ATTRIBUTE = /^[a-z][a-z0-9-]*$/u;
const MEMBER = /^[A-Za-z_$][\w$]*$/u;

function dateOf(text) {
  if (typeof text !== 'string' || !DATE.test(text)) return NaN;
  const time = Date.parse(`${text}T00:00:00Z`); // 2026-02-30 parses in some engines; it must print back as itself.

  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== text ? NaN : time;
} // `remove_after` is the last promised day, whole, in UTC: the old name is
// open until the end of it and expired from the next midnight.


function aliasExpired(row, now = Date.now()) {
  const last = dateOf(row?.remove_after);
  return Number.isFinite(last) && now >= last + DAY;
} // kebab-case attribute -> camelCase property: backdrop-blur -> backdropBlur.

function propertyOf(attribute) {
  return String(attribute).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
}
const TAG_ALIAS_KIND = 'tag'; // A custom element name of the Framework or of a package: lower case, a hyphen.

const ELEMENT = /^[a-z][a-z0-9]*-[a-z0-9-]+$/u;

function primitive(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function checkRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return 'not-an-object';
  const {
    from,
    to,
    kind,
    since,
    mode = 'same-detail',
    when,
    setting
  } = row;
  if (!ALIAS_KINDS.includes(kind)) return 'unknown-kind';
  if (typeof from !== 'string' || !from) return 'no-from';
  if (to === null || to === undefined || to === '') return 'no-new-name';
  if (typeof to !== 'string') return 'no-to';
  if (from === to) return 'same-name';
  const start = dateOf(since);
  const end = dateOf(row.remove_after);
  if (Number.isNaN(start)) return 'bad-since';
  if (Number.isNaN(end)) return 'bad-remove-after';
  if (end < start) return 'remove-after-before-since';
  if (!ALIAS_MODES.includes(mode)) return 'unknown-mode';
  if (kind !== 'event' && mode !== 'same-detail') return 'mode-on-non-event';

  if (when !== undefined) {
    if (kind !== 'event') return 'when-on-non-event';
    if (!when || typeof when !== 'object' || Array.isArray(when) || !Object.values(when).every(primitive)) return 'bad-when';
  }

  if (kind === 'setting' || kind === 'attribute') {
    if (!ATTRIBUTE.test(from) || !ATTRIBUTE.test(to)) return 'bad-attribute-name';
  }

  if (kind === 'action' && (!MEMBER.test(from) || !MEMBER.test(to))) return 'bad-member-name';

  if (kind === 'value') {
    if (typeof setting !== 'string' || !ATTRIBUTE.test(setting)) return 'value-needs-setting';
  } else if (setting !== undefined) {
    return 'setting-on-non-value';
  }

  return null;
}

function normal(row, tag) {
  const out = {
    kind: row.kind,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    tag: typeof row.tag === 'string' && row.tag ? row.tag : tag
  };

  if (row.kind === 'event') {
    out.mode = row.mode || 'same-detail';
    if (row.when) out.when = { ...row.when
    };
  }

  if (row.kind === 'value') out.setting = row.setting;
  return Object.freeze(out);
} // -> {tag, rows: [frozen rows], refused: [{index, from, to, kind, reason}]}


function readAliasTable(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];

  if (!Array.isArray(list)) {
    refused.push({
      index: -1,
      from: null,
      to: null,
      kind: null,
      reason: 'not-a-table'
    });
    return {
      tag: owner,
      rows,
      refused
    };
  }

  const refuse = (index, row, reason) => refused.push({
    index,
    from: row?.from ?? null,
    to: row?.to ?? null,
    kind: row?.kind ?? null,
    reason
  });

  const seen = new Map();
  list.forEach((row, index) => {
    if (row?.kind === TAG_ALIAS_KIND) return;
    const reason = checkRow(row);
    if (reason) return refuse(index, row, reason);
    const one = normal(row, owner); // An attribute, a property or a method has one new name; an event's old
    // name may be sent beside several new ones (split, folded names).

    const identity = one.kind === 'event' ? `event|${one.from}|${one.to}|${JSON.stringify(one.when ?? null)}` : one.kind === 'value' ? `value|${one.setting}|${one.from}` : `${one.kind === 'action' ? 'action' : 'name'}|${one.from}`;
    const before = seen.get(identity);
    if (before) return refuse(index, row, before.to === one.to ? 'duplicate' : 'conflict');
    seen.set(identity, one);
    rows.push({
      index,
      row: one
    });
  }); // Two old names folded into one new name by their detail: without `when`
  // each would be sent on every new event, the wrong one among them.

  const folded = new Map();

  for (const entry of rows) {
    const {
      row
    } = entry;
    if (row.kind !== 'event' || row.mode === 'same-detail' || row.when) continue;
    folded.set(row.to, [...(folded.get(row.to) ?? []), entry]);
  }

  const ambiguous = new Set();

  for (const group of folded.values()) if (group.length > 1) for (const entry of group) ambiguous.add(entry);

  const kept = [];

  for (const entry of rows) {
    if (ambiguous.has(entry)) refuse(entry.index, entry.row, 'needs-when');else kept.push(entry.row);
  }

  refused.sort((a, b) => a.index - b.index);
  return {
    tag: owner,
    rows: kept,
    refused
  };
} // The `tag` rows of a table: -> {tag, rows: [{from, to, since, remove_after}],
// refused: [{index, from, to, reason}]}. A row renames the table's own tag:
// its `to` is that tag when the table names one.

function readTagAliases(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.component === 'string' && table.component || !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];
  if (!Array.isArray(list)) return {
    tag: owner,
    rows,
    refused
  };
  const seen = new Set();
  list.forEach((row, index) => {
    if (row?.kind !== TAG_ALIAS_KIND) return;

    const refuse = reason => refused.push({
      index,
      from: row.from ?? null,
      to: row.to ?? null,
      reason
    });

    if (typeof row.from !== 'string' || !ELEMENT.test(row.from)) return refuse('bad-old-tag');
    if (typeof row.to !== 'string' || !ELEMENT.test(row.to)) return refuse('bad-new-tag');
    if (row.from === row.to) return refuse('same-name');
    if (owner && row.to !== owner) return refuse('not-this-tag');
    const start = dateOf(row.since);
    const end = dateOf(row.remove_after);
    if (Number.isNaN(start)) return refuse('bad-since');
    if (Number.isNaN(end)) return refuse('bad-remove-after');
    if (end < start) return refuse('remove-after-before-since');
    if (seen.has(row.from)) return refuse('duplicate');
    seen.add(row.from);
    rows.push(Object.freeze({
      from: row.from,
      to: row.to,
      since: row.since,
      remove_after: row.remove_after
    }));
  });
  return {
    tag: owner,
    rows,
    refused
  };
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
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true. A dated
// alias (core/js/aliases.js, standard simai.smart-component §16.20) also
// records `tag`, `since` and `remove_after`; once its date has passed the
// record turns `expired` and that is printed once whatever the page opted
// into, because the name can leave with the next sweep.
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
  to = null,
  tag,
  since,
  remove_after: removeAfter,
  expired,
  package: pkg
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  let note = notes.get(key);
  const firstExpiry = expired === true && note?.expired !== true;

  if (note) {
    note.count += 1;
  } else {
    note = {
      component,
      kind,
      attribute,
      from,
      to,
      count: 1
    };
    notes.set(key, note);
  } // The dated fields are kept only when a caller knows them, so the records of
  // the Framework's undated aliases keep their shape.


  if (tag !== undefined) note.tag = tag;
  if (since !== undefined) note.since = since;
  if (removeAfter !== undefined) note.remove_after = removeAfter; // The component package that ships the new name, for a package's element.

  if (pkg) note.package = pkg;
  if (expired === true) note.expired = true;

  if (firstExpiry) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} was due to leave after ${note.remove_after || 'its date'}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  } else if (note.count === 1 && warnEnabled()) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} is a legacy name${note.remove_after ? ` until ${note.remove_after}` : ''}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}

function describe({
  component,
  kind,
  attribute,
  from
}) {
  const where = component ? `${component}: ` : '';
  const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
  return `${where}${what}`;
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

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followLanguage: () => (/* binding */ followLanguage),
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   localeText: () => (/* binding */ localeText),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText),
/* harmony export */   pageWord: () => (/* binding */ pageWord),
/* harmony export */   refreshLanguage: () => (/* binding */ refreshLanguage),
/* harmony export */   registeredWord: () => (/* binding */ registeredWord)
/* harmony export */ });
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _lang_built_in_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("feccc97e5d7d");
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
 // The languages built into the bundles (owner decision C282): English; every
// other language, Russian too, is a language file (core/js/language-packs.js).



const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered; // Language packs (owner decision C177, 2026-11-14; C282, 2026-11-17): every
// language but English, the one built in, is one file per language and
// delivery, fetched only by a page that speaks it (or included before core as
// its script form, core/lang/<code>.js). A pack's words go into the same registry as words registered one
// by one -- so a bundle built before packs existed reads them too -- a
// Framework pack's beneath what is there, any other pack's over it: a product
// overrides a Framework word whichever arrived first. The fetching is core's
// (core/js/language-packs.js); each bundle only asks for a language. A STORE
// made by an older bundle has no packs yet: they are added here.

const PACKS = STORE.packs ??= {
  loaded: new Map(),
  pending: new Map(),
  request: null
}; // The languages built into the bundles: English, and in a rollback build Russian
// too (src/core/lang/built-in.json, C282).
// Which registered words came from a Framework pack and nothing has said over
// since: name -> code -> Set of keys. A Framework pack is the Framework's own
// words in a file, so for a component that names itself by a dated alias of
// its record's tag (sf-message-log, the heir of sf-list-feed, both under
// sf-list-feed's record) they are the successor's words, not its own: the
// words that component ships win over them (ui-control evidence
// 2026-11-18-pro-over-1ed6: «Лента» instead of «Переписка» once the ru pack
// was fetched). A word a product registers, or a product pack, is still over
// everything. Kept beside the words, not instead of them, so a copy of this
// module from before it reads the registry as it did. A STORE made by an older
// bundle has none yet: added here.

const FLOOR = STORE.floor ??= new Map();

const floorOf = (name, code) => {
  if (!FLOOR.has(name)) FLOOR.set(name, new Map());
  const byLanguage = FLOOR.get(name);
  if (!byLanguage.has(code)) byLanguage.set(code, new Set());
  return byLanguage.get(code);
};

const notFloor = (name, code, keys) => {
  const marked = FLOOR.get(name)?.get(code);
  if (!marked) return;

  for (const key of keys) marked.delete(key);
}; // Whether the word registered for `key` stands for the successor of the
// component asking, so that its own shipped word is said instead: the asker
// names a dated alias (its tag is not its record's), and the registered word
// is a Framework pack's that no product has said over.


function successorWord(owner, candidate, key) {
  if (!owner) return false;
  const name = normalise(owner);
  const record = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(name);
  return record !== name && Boolean(FLOOR.get(record)?.get(candidate)?.has(key));
}

const isBuiltIn = code => code === 'en' || (_lang_built_in_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]?.built_in ?? []).includes(code);
/**
 * Ask core for the pack of a language this page speaks (nothing for a
 * built-in language), and for the part that holds `component`'s words: the Framework's pack
 * comes in parts by family (core/js/language-packs.js). A core from before
 * parts takes the language alone.
 */


function needPack(code, component) {
  const wanted = normalise(code);
  const base = wanted.split('-')[0];
  if (!base || isBuiltIn(base)) return;
  const name = component ? (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component) : undefined;

  if (typeof PACKS.request !== 'function') {
    // Core has not run yet: a Smart bundle placed before core.js (a Docara
    // page and its example frames load core last) draws before anyone can
    // fetch. The ask is kept and core makes it when it starts
    // (core/js/language-packs.js), so the family's part still comes.
    const early = PACKS.early ??= new Map();
    const named = aliasOf(wanted);

    for (const one of new Set([base, wanted, ...(named ? [named] : [])])) {
      if (!early.has(one)) early.set(one, new Set());
      early.get(one).add(name ?? '');
    }

    return;
  }

  PACKS.request(base, name);
  if (wanted !== base) PACKS.request(wanted, name);
  const named = aliasOf(wanted);
  if (named && named !== wanted && named !== base) PACKS.request(named, name);
} // Words are kept under a component's current tag: a product that registered
// them for a renamed tag (sf-datepicker, now sf-input-date) keeps its words
// while the old tag is a dated alias, whichever name the element was written
// with (core/js/tag-aliases.js).


const wordsOf = component => REGISTERED.get((0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component));

function normalise(value) {
  return String(value ?? '').trim().toLowerCase().replace('_', '-');
} // The pack a page language takes. Two tables, both from the localization
// registry (C278) and both on the shared store, so a bundle carries neither:
// core/lang/index.json `aliases` (the shipped packs: zh-cn, zh-sg and zh take
// zh-hans, pt takes pt-br; PACKS.aliases, set by core) and the registry's
// second names of every language (STORE.aliases, core/js/language-packs.js).
// A word registered for the alias itself still comes first; any other code
// is its own.


function packOf(code) {
  const one = PACKS?.aliases?.[code] ?? STORE?.aliases?.[code];
  return typeof one === 'string' && one ? one : code;
}

function aliasOf(code) {
  const named = packOf(code);
  return named !== code ? named : null;
}
/**
 * The languages to try, most specific first, English last: the language, the
 * pack it is an alias of, the language without its region and that one's
 * pack. zh-CN: zh-cn, zh-hans, zh, en; zh-TW: zh-tw, zh, zh-hans, en; pt-PT:
 * pt-pt, pt, pt-br, en. Until 2026-11-18 a zh-CN or pt page found no pack and
 * spoke English.
 */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, packOf(wanted), base, packOf(base), 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
}; // A layer drawn in a portal carries a copy of its host's language, stamped by
// carryLayerOrigin (§19.1). When that copy came from the page itself, it has
// to follow the page before the listeners draw: a word read inside a drawer
// during SF.language.use() answered the language the page had just left, and
// the portal was carried again only later, with nothing to draw it again
// (simai/ui-source#55, found by ui-mail). A portal whose host sits in a
// section with a language of its own is not touched: that section means it.


const carryPageLanguage = () => {
  const doc = globalThis.document;
  if (!doc?.querySelectorAll) return;
  const lang = doc.documentElement?.getAttribute('lang') || '';

  for (const portal of doc.querySelectorAll('[data-sf-layer-lang="page"]')) {
    if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
  }
};

const announce = () => {
  carryPageLanguage();

  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
}; // The nearest element that says its language, looking past shadow roots: a
// pagination drawn inside a data view's shadow root found no [lang] there,
// fell back to <html lang> and spoke English inside a Russian admin whose
// language was set on the shell around it.


function langOwner(node) {
  let current = node;

  while (current) {
    const owner = typeof current.closest === 'function' ? current.closest('[lang]') : null;
    if (owner) return owner;
    const root = typeof current.getRootNode === 'function' ? current.getRootNode() : null;
    current = root && root !== current && root.host ? root.host : null;
  }

  return null;
} // The language of a part of the page wins over the language chosen for the
// whole page (owner, 2026-10-26; standard simai.smart-component 1.3.8 §11.1):
//   1. a word given on the element itself (the component's own attribute);
//   2. the nearest [lang] below <html>;
//   3. the page's choice, SF.language.use(), which also sets <html lang>;
//   4. <html lang>;
//   5. English.
// Until 2026-10-27 the choice won over a section's [lang], so an English
// section inside a Russian page that had called use('ru') spoke Russian.


function languageSource(node) {
  const owner = langOwner(node);
  const root = globalThis.document?.documentElement ?? null;
  if (owner && owner !== root) return owner.getAttribute('lang');
  if (STORE.chosen) return STORE.chosen;
  return owner?.getAttribute('lang') || root?.lang || 'en';
}
/**
 * The page's language for this node: the nearest [lang] below <html>, else
 * the language the page chose, else <html lang>, else English.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  return normalise(languageSource(node)).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  return normalise(languageSource(node)) || 'en';
}
/**
 * Follows `lang` in the document (§11.1 «changes are followed»): one observer
 * for the page, whichever bundle starts it, and the elements under a changed
 * [lang] draw again. `element.requestComponentUpdate('language')` is what a
 * Smart element does; anything else passes its own `redraw`. Returns the way
 * to stop following.
 */

function followLanguage(element, redraw = () => element.requestComponentUpdate?.('language')) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const doc = element?.ownerDocument ?? root.document;
  const Observer = doc?.defaultView?.MutationObserver ?? root.MutationObserver;
  if (!doc?.documentElement || typeof Observer !== 'function') return () => {};

  if (!root.__sfLanguageWatch || root.__sfLanguageWatch.document !== doc) {
    const watch = {
      document: doc,
      elements: new Map(),
      observer: null
    };
    watch.observer = new Observer(records => {
      const changed = [...new Set(records.map(record => record.target))];

      for (const [one, again] of [...watch.elements]) {
        if (changed.some(target => within(target, one))) {
          try {
            again();
          } catch {// One element that fails to draw does not keep the others in the
            // old language.
          }
        }
      }
    });
    watch.observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
      subtree: true
    });
    root.__sfLanguageWatch = watch;
  }

  const watch = root.__sfLanguageWatch;
  watch.elements.set(element, redraw);
  return () => watch.elements.delete(element);
} // Whether `node` is `target` or below it, across shadow roots.

function within(target, node) {
  for (let current = node; current;) {
    if (current === target) return true;
    current = current.parentNode || current.host || null;
  }

  return false;
}
/**
 * Tell the page's components that words changed without a registration: the
 * composition editor words arrive in a chunk of their own (LC-1) and the
 * forms drawn before them draw again.
 */


function refreshLanguage() {
  announce();
}
function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  return localeText(dictionary, key, pageLocale(node), component ?? componentOf(node));
}
/**
 * Text for `key` in a named language, with no node to read it from: a server
 * fallback or a form drawn before it is placed. The same order as pageText --
 * words registered for `component`, then the shipped ones, for the language,
 * the language without its region and English -- and the key last.
 */

function localeText(dictionary, key, locale, component) {
  const order = chain(locale || 'en');
  needPack(order[0], component);

  for (const candidate of order) {
    let added = component ? wordsOf(component)?.get(candidate)?.[key] : undefined;
    if (added !== undefined && dictionary?.[candidate]?.[key] !== undefined && successorWord(component, candidate, key)) added = undefined;

    if (added !== undefined) {
      if (candidate === 'en' && added !== '') warnFallback(order, component, key);
      return added;
    }

    const shipped = dictionary?.[candidate]?.[key];

    if (shipped !== undefined) {
      if (candidate === 'en' && shipped !== '') warnFallback(order, component, key);
      return shipped;
    }
  }

  return key;
} // A language the Framework does not ship (owner decision C177 (4)) may come
// partly translated: a word it lacks is said in the fallback language,
// English, and that is shown, not silent (localization study LC-6). One
// warning per page and language (de-AT and de are one), naming the first word
// missed; every word missed is kept by language for SF.language.missing(),
// and the language files' coverage is scripts/language-coverage.mjs. Kept on
// the shared global, because every bundle carries this module.

function warnFallback(order, owner, key) {
  const wanted = packOf(String(order[0] || '').split('-')[0]); // While its pack is on its way the English is a moment, not a gap (the
  // registry name's pack too: zh-hans for a zh-CN page). Before core runs
  // nothing can be on its way yet: the word is asked again when the pack core
  // fetches arrives, and only a word still missing then is one (ui-view
  // example frames reported sf-pagination "of-pages", which the ru pack holds,
  // on loads where the bundle ran before core).

  if (!wanted || wanted === 'en' || typeof PACKS.request !== 'function' || order.some(code => code !== 'en' && PACKS.pending.has(code))) return;
  const root = globalThis;
  if (!(root.__sfMissingWords instanceof Map)) root.__sfMissingWords = new Map();
  const seen = root.__sfMissingWords;

  if (!seen.has(wanted)) {
    seen.set(wanted, new Set());
    root.console?.warn?.(`[SIMAI Framework] "${wanted}": words missing, said in English (first: ${owner || 'component'} "${key}"); SF.language.missing('${wanted}') lists them`);
  }

  seen.get(wanted).add(`${owner || 'component'}|${key}`);
} // Missing words are said once per component, word and language: a page that
// draws a hundred rows must not print a hundred warnings. The marks are kept on
// the shared global, because every bundle carries this module.


function warnWord(owner, key, locale, said) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfWordWarnings instanceof Set)) root.__sfWordWarnings = new Set();
  const mark = `${owner}|${key}|${locale}|${said}`;
  if (root.__sfWordWarnings.has(mark)) return;

  root.__sfWordWarnings.add(mark);

  globalThis.console?.warn?.(`[SIMAI Framework] ${owner || 'component'}: no word "${key}" for ${locale}${said === 'key' ? '; the key is shown' : `; said in ${said}`}`);
}

function fill(text, locale, count, vars) {
  return String(text).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => {
    if (name === 'n' && count !== undefined) {
      try {
        return new Intl.NumberFormat(locale).format(count);
      } catch {
        return String(count);
      }
    }

    return vars && Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole;
  });
}
/**
 * A component's own word (standard simai.smart-component 1.3.8 §11, §11.1).
 *
 * `dictionary` is `{<locale>: {<key>: word}}` from the component's language
 * files. A word given on the element itself is the caller's to prefer; this
 * resolves the rest: words registered for the element's language, then the
 * shipped ones, the language without its region, English, the component's
 * source language and, last, the key. The last two warn once. A word that
 * takes a number is an object of plural forms chosen by Intl.PluralRules of
 * the language the word was found in; `{n}` is the number in that language's
 * format and `{name}` takes `vars.name`.
 *
 * `former` names the key the same word had before a rename (one key or a
 * list): a product that registered its words under the old key keeps them
 * until the alias's day. For each language the word registered under the new
 * key wins, then one registered under an old key, then the shipped one; a
 * word taken by an old key is reported to `onFormer(oldKey)`, which notes the
 * deprecation.
 */


function pageWord(dictionary, key, node, {
  component,
  source = '',
  count,
  vars,
  former,
  onFormer
} = {}) {
  const owner = component ?? componentOf(node);
  const locale = pageLocale(node);
  const order = chain(locale);
  const sourceLanguage = normalise(source);
  if (sourceLanguage && !order.includes(sourceLanguage)) order.push(sourceLanguage);
  const formerKeys = former === undefined || former === null ? [] : [].concat(former);
  needPack(locale, owner);

  for (const candidate of order) {
    const registered = owner ? wordsOf(owner)?.get(candidate) : undefined;
    let added = registered?.[key];
    if (added !== undefined && dictionary?.[candidate]?.[key] !== undefined && successorWord(owner, candidate, key)) added = undefined;

    if (added === undefined && registered) {
      const old = formerKeys.find(name => registered[name] !== undefined && registered[name] !== null);

      if (old !== undefined) {
        added = registered[old];
        onFormer?.(old);
      }
    }

    const word = added !== undefined ? added : dictionary?.[candidate]?.[key];
    if (word === undefined || word === null) continue;
    if (candidate === sourceLanguage && !chain(locale).includes(candidate)) warnWord(owner, key, locale, candidate);
    if (candidate === 'en' && word !== '') warnFallback(chain(locale), owner, key);

    if (typeof word === 'object') {
      let form = 'other';

      if (count !== undefined) {
        try {
          form = new Intl.PluralRules(candidate).select(Number(count));
        } catch {
          form = 'other';
        }
      }

      const picked = word[form] ?? word.other;
      if (picked === undefined) continue;
      return fill(picked, candidate, count, vars);
    }

    return fill(word, candidate, count, vars);
  }

  warnWord(owner, key, locale, 'key');
  return key;
}
/**
 * The word a product registered (SF.language.register, or a product pack)
 * under `key` for the node's language, its base language or English; the
 * words a component ships are not read. Undefined when none is registered.
 * A removed word key kept as a dated alias reads this: the old phrase is
 * said only while a product still writes the old key.
 */

function registeredWord(component, key, node) {
  const byLanguage = wordsOf(component ?? componentOf(node));
  if (!byLanguage) return undefined;

  for (const candidate of chain(pageLocale(node))) {
    const word = byLanguage.get(candidate)?.[key];
    if (word !== undefined && word !== null) return word;
  }

  return undefined;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next;
    if (next) needPack(next); // The choice is the page's language: <html lang> says it too (§11.1), so
    // the browser, a screen reader and CSS :lang() agree with the words.
    // use(null) gives the markup's own language back.

    const root = globalThis.document?.documentElement;

    if (root) {
      const holder = globalThis;

      if (next) {
        if (holder.__sfMarkupLanguage === undefined) holder.__sfMarkupLanguage = root.getAttribute('lang');
        if (root.getAttribute('lang') !== next) root.setAttribute('lang', next);
      } else if (holder.__sfMarkupLanguage !== undefined) {
        if (holder.__sfMarkupLanguage === null) root.removeAttribute('lang');else root.setAttribute('lang', holder.__sfMarkupLanguage);
        holder.__sfMarkupLanguage = undefined;
      }
    }

    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component ?? '');
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);

    if (words === null) {
      byLanguage.delete(code);
      FLOOR.get(name)?.delete(code);
    } else {
      byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
        ...words
      });
      notFloor(name, code, Object.keys(words ?? {}));
    }

    announce();
    return this;
  },

  /**
   * A language pack (schema simai.language-pack, schema_version 1; schema
   * core/contracts/language-pack.v1.schema.json): every word of one language
   * for one delivery, by component. A Framework pack's words go beneath the
   * words already registered, any other pack's over them, as register() does.
   * The page draws again once. Answers what was taken, or null for something
   * that is not a pack.
   */
  registerPack(pack, url = null) {
    const code = normalise(pack?.lang);

    if (pack?.schema !== 'simai.language-pack' || pack.schema_version !== 1 || !code || !pack.words || typeof pack.words !== 'object') {
      globalThis.console?.warn?.(`[SIMAI Framework] not a language pack (simai.language-pack, schema_version 1)${url ? `: ${url}` : ''}`);
      return null;
    }

    const under = (pack.delivery ?? 'framework') === 'framework';
    let words = 0;

    for (const [component, byKey] of Object.entries(pack.words)) {
      if (!byKey || typeof byKey !== 'object') continue;
      const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component);
      if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
      const byLanguage = REGISTERED.get(name);
      const now = byLanguage.get(code) ?? {};
      byLanguage.set(code, under ? { ...byKey,
        ...now
      } : { ...now,
        ...byKey
      });

      if (under) {
        const marked = floorOf(name, code);

        for (const key of Object.keys(byKey)) if (!Object.prototype.hasOwnProperty.call(now, key) || marked.has(key)) marked.add(key);
      } else {
        notFloor(name, code, Object.keys(byKey));
      }

      words += Object.keys(byKey).length;
    }

    const info = {
      lang: code,
      delivery: pack.delivery ?? 'framework',
      status: pack.status ?? null,
      coverage: pack.coverage ?? null,
      words,
      url
    };
    PACKS.loaded.set(code, [...(PACKS.loaded.get(code) ?? []), info]); // Core registers the parts that arrived together and draws once
    // (PACKS.quiet while it does).

    if (!PACKS.quiet) announce();
    return info;
  },

  /**
   * Name a pack file to fetch when the page needs its language: one line for
   * a product or a page (also SF_BOOT_CONFIG.languages = {code: url}). Core
   * fetches it once, with the Framework's own pack of that language.
   */
  addPack(value, url) {
    return PACKS.add ? PACKS.add(normalise(value), url) : false;
  },

  /** Fetch the packs of a language now; resolves when they are registered. */
  load(value) {
    return PACKS.load ? PACKS.load(normalise(value)) : Promise.resolve([]);
  },

  /** The packs on the page: {code: [{lang, delivery, status, coverage, words, url}]}. */
  packs() {
    return Object.fromEntries([...PACKS.loaded].map(([code, list]) => [code, list.map(info => ({ ...info
    }))]));
  },

  /** One language across many components: `{ 'sf-input-date': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    return [...(wordsOf(component ?? '')?.keys() ?? [])];
  },

  /**
   * The words the page has said in English so far for want of one in
   * `value` (C177 (4): a language may ship partly; what it lacks is visible).
   * `['sf-pagination|pages-label', ...]`; every language's when none is named.
   */
  missing(value) {
    const seen = globalThis.__sfMissingWords instanceof Map ? globalThis.__sfMissingWords : new Map();
    if (value === undefined) return Object.fromEntries([...seen].map(([code, words]) => [code, [...words]]));
    return [...(seen.get(packOf(normalise(value).split('-')[0])) ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    FLOOR.clear();
    PACKS.loaded.clear(); // The asks kept before core ran go too: they were for the words forgotten.

    PACKS.early?.clear?.();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {}; // Every bundle publishes its copy; they share one store, so any copy
  // answers alike -- except that a bundle built before language packs
  // (an older package on the page) has no registerPack, addPack, load or
  // packs. Once a copy with them is published, an older one does not
  // replace it (C177).

  const holder = window.SF;

  if (!Object.getOwnPropertyDescriptor(holder, 'language')?.set) {
    let published = holder.language;
    Object.defineProperty(holder, 'language', {
      configurable: true,
      enumerable: true,
      get: () => published,
      set: value => {
        if (typeof value?.registerPack === 'function' || typeof published?.registerPack !== 'function') published = value;
      }
    });
  }

  holder.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

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
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
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

/***/ },

/***/ "789a76952d4b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "db0c5662903e"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c1f767b688ec");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "feccc97e5d7d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _built_in_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6a56aa4367e4");
// The languages built into the component bundles (owner decision C282),
// for page-language.js: built-in.json, the build switch
// scripts/build-language-packs.mjs reads too. A module, as lang/index.mjs, so
// the bundle and Node read the JSON alike.


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_built_in_json__WEBPACK_IMPORTED_MODULE_0__);


/***/ },

/***/ "c1f767b688ec"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"goToSlide":"Go to slide {n}"}}');

/***/ },

/***/ "6a56aa4367e4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"schema":"simai.language-built-in","schema_version":1,"$comment":"The languages built into the component bundles (owner decision C282, 2026-11-17): English only. Russian and every other language ship as language files (core/lang/<code>.js before core.js, or the parts core/lang/<code>/<family>.json core fetches). complete: the languages that must say every word (scripts/language-coverage.mjs exits 1 on a gap). Rollback: built_in [\\"en\\", \\"ru\\"], then node scripts/build-language-packs.mjs and a rebuild put Russian back into the bundles (the language files still ship, so a page that includes ru.js stays right).","built_in":["en"],"complete":["en","ru"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("789a76952d4b");
/* harmony import */ var _js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2d7307156263");


})();

/******/ })()
;