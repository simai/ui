/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "46dcc01f14ec"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindRangeSlider: () => (/* binding */ bindRangeSlider),
/* harmony export */   getRangeSliderValue: () => (/* binding */ getRangeSliderValue),
/* harmony export */   initExistingRangeSliders: () => (/* binding */ initExistingRangeSliders),
/* harmony export */   setRangeSliderValue: () => (/* binding */ setRangeSliderValue),
/* harmony export */   unbindRangeSlider: () => (/* binding */ unbindRangeSlider)
/* harmony export */ });
/* harmony import */ var _native_slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("390e88cf2860");

const RANGE_SLIDER_SELECTOR = '.sf-range-slider';
const RANGE_SLIDER_BOUND_FLAG = 'sfRangeSliderBound'; // Instance-owned state is shared by separately bundled Component/Smart code.

const SLIDER_ACCESSIBILITY_STATE = '__sfRangeSliderAccessibility';
const SLIDER_LABEL_STATE = '__sfRangeSliderLabels';
const accessibleAttributes = ['aria-label', 'aria-labelledby', 'aria-describedby'];
const handleLabelAttributes = ['data-lower-label', 'data-upper-label'];

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'disabled'].includes(String(value).toLowerCase());
}

function toNumber(value, fallback) {
  const parsed = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getNormalizedRange(root) {
  let min = toNumber(root.getAttribute('data-min'), 0);
  let max = toNumber(root.getAttribute('data-max'), 100);

  if (min > max) {
    [min, max] = [max, min];
  }

  if (!(max > min) || !Number.isFinite(max - min)) {
    return {
      min: 0,
      max: 100
    };
  }

  return {
    min,
    max
  };
}

function clampValue(value, min, max, fallback) {
  const numeric = toNumber(value, fallback);
  return Math.min(max, Math.max(min, numeric));
}

function getConnect(root, multiple) {
  const fallback = multiple ? true : 'lower';
  if (!root.hasAttribute('data-connect')) return fallback;
  const value = String(root.getAttribute('data-connect') ?? '').trim().toLowerCase();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'lower' || value === 'upper') return value;
  return fallback;
}

function getDecimalPlaces(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (!normalized || !Number.isFinite(Number(normalized))) return 0;
  const [coefficient, exponent = '0'] = normalized.split('e');
  const fraction = coefficient.split('.')[1]?.replace(/0+$/, '').length || 0;
  return Math.min(100, Math.max(0, fraction - Number(exponent)));
}

function getValueDecimals(root) {
  const decimalsAttr = root.getAttribute('data-decimals');

  if (decimalsAttr !== null && decimalsAttr !== '') {
    return Math.min(100, Math.max(0, Math.trunc(toNumber(decimalsAttr, 0))));
  }

  return getDecimalPlaces(root.getAttribute('data-step'));
}

function isMultipleRoot(root) {
  return toBoolean(root.getAttribute('data-multiple'), false);
}

function parseStart(root) {
  const raw = root.getAttribute('data-start') || root.getAttribute('data-value') || '0';
  const parts = String(raw).split(',');
  const {
    min,
    max
  } = getNormalizedRange(root);

  if (parts.length > 1 && isMultipleRoot(root)) {
    return [clampValue(parts[0].trim(), min, max, min), clampValue(parts[1].trim(), min, max, max)].sort((a, b) => a - b);
  }

  return [clampValue(parts[0].trim(), min, max, min)];
}

function getHandleLabelMode(root) {
  const mode = String(root.getAttribute('data-label') || 'none').toLowerCase();
  return ['none', 'text', 'tooltip'].includes(mode) ? mode : 'none';
}

function getHandleLabelPosition(root, mode = 'none') {
  const specificAttribute = mode === 'tooltip' ? 'data-tooltip-position' : 'data-text-position';
  const raw = root.getAttribute(specificAttribute) || root.getAttribute('data-label-position') || '';
  const normalized = String(raw).toLowerCase();

  if (['top', 'bottom'].includes(normalized)) {
    return normalized;
  }

  return mode === 'text' ? 'bottom' : 'top';
}

function formatValue(root, value) {
  const decimals = getValueDecimals(root);
  const prefix = root.getAttribute('data-prefix') || '';
  const suffix = root.getAttribute('data-suffix') || '';
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return `${prefix}${value ?? ''}${suffix}`;
  }

  const baseValue = numeric.toFixed(decimals);
  return `${prefix}${baseValue}${suffix}`;
}

function createVisualNode(mode = 'none', position = 'top') {
  const visual = document.createElement('div');
  visual.classList.add('sf-range-slider-visual', 'flex', 'flex-col', `sf-thumb--position-${position}`);

  if (mode === 'tooltip') {
    visual.classList.add('sf-thumb--label-tooltip', 'items-cross-center');
    const tooltip = document.createElement('div');
    tooltip.className = 'sf-tooltip sf-tooltip--light sf-tooltip--arrow-none sf-tooltip--size-1/3 relative';
    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'sf-tooltip-content flex flex-col';
    const tooltipText = document.createElement('div');
    tooltipText.className = 'sf-tooltip-text';
    const tooltipTail = document.createElement('div');
    tooltipTail.className = 'sf-tooltip-tail';
    tooltipContent.append(tooltipText);
    tooltip.append(tooltipContent, tooltipTail);
    visual.append(tooltip);
  }

  const handleRow = document.createElement('div');
  handleRow.className = 'flex';
  const handle = document.createElement('span');
  handle.className = 'sf-thumb-handle flex items-cross-center content-main-center';
  const inner = document.createElement('div');
  inner.className = 'sf-thumb-inner';
  handle.append(inner);
  handleRow.append(handle);
  visual.append(handleRow);

  if (mode === 'text') {
    visual.classList.add('sf-thumb--label-text');
    const text = document.createElement('span');
    text.className = 'sf-thumb-text';
    visual.append(text);
  }

  return visual;
}

function ensureTrack(base) {
  if (!(base instanceof HTMLElement)) return;
  let track = base.querySelector(':scope > .sf-range-slider-track');
  if (track) return track;
  track = document.createElement('div');
  track.className = 'sf-range-slider-track';
  base.prepend(track);
  return track;
}

function getHandles(root) {
  return Array.from(root.querySelectorAll('.sf-range-slider-handle'));
}

function bindSliderAccessibility(root, owner = root) {
  const state = root[SLIDER_ACCESSIBILITY_STATE] || {
    assigned: new WeakMap()
  };
  state.observer?.disconnect();
  const handles = getHandles(root);

  const sync = () => getHandles(root).forEach((handle, index) => {
    const previous = state.assigned.get(handle) || {};
    Object.entries(previous).forEach(([name, value]) => {
      if (handle.getAttribute(name) === value) handle.removeAttribute(name);
    });
    const explicitName = handle.hasAttribute('aria-label') || handle.hasAttribute('aria-labelledby');
    const next = {};
    const specificName = handles.length > 1 ? root.getAttribute(handleLabelAttributes[index]) || owner.getAttribute(index === 0 ? 'lower-label' : 'upper-label') : null;

    if (!explicitName && specificName) {
      handle.setAttribute('aria-label', specificName);
      next['aria-label'] = specificName;
    }

    accessibleAttributes.forEach(name => {
      if (handle.hasAttribute(name) || (explicitName || specificName) && name !== 'aria-describedby') return;
      const value = owner.getAttribute(name);

      if (value !== null) {
        handle.setAttribute(name, value);
        next[name] = value;
      }
    });

    if (isDisabledRoot(root)) {
      handle.setAttribute('aria-disabled', 'true');
      next['aria-disabled'] = 'true';
    }

    state.assigned.set(handle, next);
  });

  sync();
  state.observer = new MutationObserver(sync);
  const ownerFilter = owner === root ? [...accessibleAttributes, ...handleLabelAttributes] : [...accessibleAttributes, 'lower-label', 'upper-label'];

  if (owner === root) {
    state.observer.observe(root, {
      attributes: true,
      attributeFilter: [...ownerFilter, 'disabled', 'class']
    });
  } else {
    state.observer.observe(owner, {
      attributes: true,
      attributeFilter: ownerFilter
    });
    state.observer.observe(root, {
      attributes: true,
      attributeFilter: [...handleLabelAttributes, 'disabled', 'class']
    });
  }

  root[SLIDER_ACCESSIBILITY_STATE] = state;
}

function decorateHandles(root) {
  const mode = getHandleLabelMode(root);
  const position = getHandleLabelPosition(root, mode);
  getHandles(root).forEach(handle => {
    if (!(handle instanceof HTMLElement)) return;
    const touchArea = handle.querySelector(':scope > .sf-range-slider-touch-area');
    if (!(touchArea instanceof HTMLElement)) return;
    touchArea.classList.add('sf-thumb');
    let visual = touchArea.querySelector(':scope > .sf-range-slider-visual');

    if (!visual) {
      // noUiSlider owns the focusable slider handle; its touch area is decoration.
      visual = createVisualNode(mode, position);
      touchArea.append(visual);
    }

    visual.classList.remove('sf-thumb--position-top', 'sf-thumb--position-bottom');
    visual.classList.add(`sf-thumb--position-${position}`);
    handle.classList.toggle('disabled', isDisabledRoot(root));
  });
}

function planLabelPositions(width, centers, sizes, gap = 0) {
  const positions = centers.map((center, index) => Math.max(0, Math.min(width - sizes[index], center - sizes[index] / 2)));
  const order = positions.map((left, index) => ({
    left,
    index
  })).sort((a, b) => a.left - b.left);
  const merged = order.length === 2 && order[0].left + sizes[order[0].index] + gap > order[1].left;
  return {
    positions,
    merged
  };
}

function bindHandleLabels(root) {
  const mode = getHandleLabelMode(root);
  if (mode === 'none') return;
  const position = getHandleLabelPosition(root, mode);
  const base = root.querySelector('.sf-range-slider-base');
  const row = document.createElement('div');
  row.className = `sf-range-slider-labels sf-thumb sf-thumb--label-${mode} sf-range-slider-labels--${position}`; // Each handle exposes its exact value and units through ARIA already.

  row.setAttribute('aria-hidden', 'true');
  const entries = getHandles(root).map(handle => {
    const label = handle.querySelector(mode === 'tooltip' ? '.sf-tooltip' : '.sf-thumb-text');
    const text = mode === 'tooltip' ? label.querySelector('.sf-tooltip-text') : label;
    row.append(label);
    return {
      handle,
      label,
      text
    };
  });
  if (position === 'top') root.insertBefore(row, base);else root.append(row);
  const state = {
    entries,
    row,
    values: [],
    frame: null,
    active: true
  };

  const layout = () => {
    if (!state.active || !root.isConnected || !state.values.length) return;
    const bounds = row.getBoundingClientRect();
    if (!bounds.width) return;
    entries.forEach(({
      label,
      text
    }, index) => {
      label.style.display = '';
      text.textContent = state.values[index];
    });
    const centers = entries.map(({
      handle
    }) => {
      const rect = handle.getBoundingClientRect();
      return rect.left + rect.width / 2 - bounds.left;
    });
    const sizes = entries.map(({
      label
    }) => label.getBoundingClientRect().width);
    const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
    const plan = planLabelPositions(bounds.width, centers, sizes, gap);

    if (plan.merged) {
      entries[0].text.textContent = state.values.join(' – ');
      entries[1].label.style.display = 'none';
      const size = entries[0].label.getBoundingClientRect().width;
      entries[0].label.style.left = `${Math.max(0, Math.min(bounds.width - size, (centers[0] + centers[1] - size) / 2))}px`;
    } else {
      entries.forEach(({
        label
      }, index) => {
        label.style.left = `${plan.positions[index]}px`;
      });
    }

    const height = Math.max(...entries.map(({
      label
    }) => label.getBoundingClientRect().height));
    const blockSize = `${height}px`;
    if (row.style.blockSize !== blockSize) row.style.blockSize = blockSize;
  };

  const schedule = () => {
    if (!state.active || state.frame !== null) return;
    state.frame = requestAnimationFrame(() => {
      state.frame = null;
      layout();
    });
  };

  state.layout = layout;

  if (typeof ResizeObserver !== 'undefined') {
    state.observer = new ResizeObserver(schedule);
    state.observer.observe(base);
    entries.forEach(({
      label
    }) => state.observer.observe(label));
  }

  document.fonts?.ready.then(schedule);
  document.fonts?.addEventListener('loadingdone', schedule);

  state.release = () => {
    state.active = false;
    state.observer?.disconnect();
    if (state.frame !== null) cancelAnimationFrame(state.frame);
    document.fonts?.removeEventListener('loadingdone', schedule);
    row.remove();
  };

  root[SLIDER_LABEL_STATE] = state;
}

function updateHandleLabels(root, values = []) {
  const state = root[SLIDER_LABEL_STATE];
  if (!state) return;
  state.values = values.map(value => formatValue(root, value));
  state.layout();
}

function isDisabledRoot(root) {
  if (!(root instanceof HTMLElement)) return false;
  return root.hasAttribute('disabled') || root.classList.contains('disabled');
}

function createSliderOptions(root) {
  const {
    min,
    max
  } = getNormalizedRange(root);
  const multiple = isMultipleRoot(root);
  const parsedStart = parseStart(root);
  const start = multiple ? [parsedStart[0] ?? min, parsedStart[1] ?? max] : [parsedStart[0] ?? min];
  const handleCount = multiple ? 2 : 1;
  return {
    start: handleCount > 1 ? start : [start[0]],
    direction: getComputedStyle(root).direction === 'rtl' ? 'rtl' : 'ltr',
    ariaFormat: {
      to: value => `${root.getAttribute('data-prefix') || ''}${value}${root.getAttribute('data-suffix') || ''}`
    },
    connect: getConnect(root, multiple),
    step: root.hasAttribute('data-step') && toNumber(root.getAttribute('data-step'), 0) > 0 ? toNumber(root.getAttribute('data-step'), 1) : undefined,
    margin: multiple && root.hasAttribute('data-margin') && toNumber(root.getAttribute('data-margin'), 0) > 0 ? Math.min(max - min, toNumber(root.getAttribute('data-margin'), 0)) : undefined,
    range: {
      min,
      max
    },
    keyboardSupport: !root.hasAttribute('data-keyboard') || toBoolean(root.getAttribute('data-keyboard'), true),
    cssPrefix: '',
    cssClasses: {
      target: 'sf-range-slider-target',
      base: 'sf-range-slider-base',
      origin: 'sf-range-slider-origin',
      handle: 'sf-range-slider-handle',
      handleLower: 'sf-range-slider-handle-lower',
      handleUpper: 'sf-range-slider-handle-upper',
      touchArea: 'sf-range-slider-touch-area',
      horizontal: 'sf-range-slider-horizontal',
      vertical: 'sf-range-slider-vertical',
      background: 'sf-range-slider-background',
      connects: 'sf-range-slider-progress',
      connect: 'sf-range-slider-progress-line',
      ltr: 'sf-range-slider-ltr',
      rtl: 'sf-range-slider-rtl',
      textDirectionLtr: 'sf-range-slider-txt-dir-ltr',
      textDirectionRtl: 'sf-range-slider-txt-dir-rtl',
      draggable: 'sf-range-slider-draggable',
      drag: 'sf-range-slider-state-drag',
      tap: 'sf-range-slider-state-tap',
      active: 'active',
      tooltip: 'sf-range-slider-tooltip',
      pips: 'sf-range-slider-pips',
      pipsHorizontal: 'sf-range-slider-pips-horizontal',
      pipsVertical: 'sf-range-slider-pips-vertical',
      marker: 'sf-range-slider-marker',
      markerHorizontal: 'sf-range-slider-marker-horizontal',
      markerVertical: 'sf-range-slider-marker-vertical',
      markerNormal: 'sf-range-slider-marker-normal',
      markerLarge: 'sf-range-slider-marker-large',
      markerSub: 'sf-range-slider-marker-sub',
      value: 'sf-range-slider-value',
      valueHorizontal: 'sf-range-slider-value-horizontal',
      valueVertical: 'sf-range-slider-value-vertical',
      valueNormal: 'sf-range-slider-value-normal',
      valueLarge: 'sf-range-slider-value-large',
      valueSub: 'sf-range-slider-value-sub'
    }
  };
}

function getNumericValues(unencoded = []) {
  return (Array.isArray(unencoded) ? unencoded : [unencoded]).map(Number);
}

function dispatchSliderEvent(root, name, unencoded = [], meta = {}) {
  const values = getNumericValues(unencoded);
  const eventValues = isMultipleRoot(root) ? values.slice(0, 2) : values.slice(0, 1);
  const eventValue = isMultipleRoot(root) ? eventValues : eventValues[0];
  root.dataset.value = Array.isArray(eventValue) ? eventValue.join(',') : String(eventValue ?? '');
  root.dispatchEvent(new CustomEvent(`sf-range-slider-${name}`, {
    bubbles: true,
    composed: true,
    detail: {
      component: root,
      values: eventValues,
      value: eventValue,
      handleCount: eventValues.length,
      ...meta
    }
  }));
}

function bindRangeSlider(root, accessibilityOwner) {
  if (!(root instanceof HTMLElement) || root.dataset[RANGE_SLIDER_BOUND_FLAG] === 'true') {
    if (root?._sfRangeSliderInstance && accessibilityOwner instanceof HTMLElement) {
      bindSliderAccessibility(root, accessibilityOwner);
    }

    return root?._sfRangeSliderInstance || null;
  }

  const options = createSliderOptions(root);
  const slider = (0,_native_slider__WEBPACK_IMPORTED_MODULE_0__.createNativeSlider)(root, options);

  if (!slider) {
    return null;
  }

  const base = root.querySelector('.sf-range-slider-base');
  ensureTrack(base);
  decorateHandles(root);
  bindHandleLabels(root);
  bindSliderAccessibility(root, accessibilityOwner instanceof HTMLElement ? accessibilityOwner : root);

  if (isDisabledRoot(root)) {
    slider.disable();
  }

  slider.on('update', (values, handle, unencoded) => {
    const numericValues = getNumericValues(unencoded); // noUiSlider rounds numeric ARIA bounds to one decimal. Keep the exact
    // supported linear range and adjacent-handle margin for fractional ranges.

    const {
      range,
      margin = 0
    } = slider.options;
    getHandles(root).forEach((node, index) => {
      node.setAttribute('aria-valuenow', String(numericValues[index]));
      node.setAttribute('aria-valuemin', String(index > 0 ? Math.max(range.min, numericValues[index - 1] + margin) : range.min));
      node.setAttribute('aria-valuemax', String(index < numericValues.length - 1 ? Math.min(range.max, numericValues[index + 1] - margin) : range.max));
    });
    updateHandleLabels(root, numericValues);
    dispatchSliderEvent(root, 'update', numericValues, {
      handle
    });
  });
  slider.on('set', (values, handle, unencoded) => {
    dispatchSliderEvent(root, 'set', unencoded, {
      handle
    });
    dispatchSliderEvent(root, 'change', unencoded, {
      handle
    });
  });
  slider.on('start', (values, handle, unencoded) => {
    dispatchSliderEvent(root, 'start', unencoded, {
      handle
    });
  });
  slider.on('end', (values, handle, unencoded) => {
    dispatchSliderEvent(root, 'end', unencoded, {
      handle
    });
  });
  root.dataset[RANGE_SLIDER_BOUND_FLAG] = 'true';
  root._sfRangeSliderInstance = slider;
  return slider;
}

function unbindRangeSlider(root) {
  root?.[SLIDER_LABEL_STATE]?.release();
  if (root) delete root[SLIDER_LABEL_STATE];
  root?.[SLIDER_ACCESSIBILITY_STATE]?.observer.disconnect();
  if (root) delete root[SLIDER_ACCESSIBILITY_STATE];

  if (!(root instanceof HTMLElement) || !root.noUiSlider) {
    delete root?.dataset?.[RANGE_SLIDER_BOUND_FLAG];
    delete root?._sfRangeSliderInstance;
    return;
  }

  root.noUiSlider.destroy();
  delete root.dataset[RANGE_SLIDER_BOUND_FLAG];
  delete root._sfRangeSliderInstance;
}

function initRangeSliderTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(RANGE_SLIDER_SELECTOR)) {
    bindRangeSlider(target);
  }

  target.querySelectorAll?.(RANGE_SLIDER_SELECTOR).forEach(root => bindRangeSlider(root));
}

function initExistingRangeSliders(scope = document) {
  initRangeSliderTree(scope);
}

function getRangeSliderValue(root) {
  if (!(root instanceof HTMLElement) || !root.noUiSlider) return null;
  const values = root.noUiSlider.get(true);
  return Array.isArray(values) && values.length === 1 ? values[0] : values;
}

function setRangeSliderValue(root, value) {
  if (!(root instanceof HTMLElement) || !root.noUiSlider) return false;
  const multiple = isMultipleRoot(root);
  const nextValue = multiple && typeof value === 'string' && value.includes(',') ? value.split(',').map(item => item.trim()) : !multiple && Array.isArray(value) ? value[0] : value;
  root.noUiSlider.set(nextValue);
  return true;
}

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.RangeSlider = window.SF.RangeSlider || {};
  window.SF.RangeSlider.bind = bindRangeSlider;
  window.SF.RangeSlider.unbind = unbindRangeSlider;
  window.SF.RangeSlider.getValue = getRangeSliderValue;
  window.SF.RangeSlider.setValue = setRangeSliderValue;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingRangeSliders());
} else {
  initExistingRangeSliders();
}

const rangeSliderObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initRangeSliderTree(node);
    });
    mutation.removedNodes.forEach(node => {
      if (!(node instanceof Element) || node.isConnected) return;
      if (node.matches(RANGE_SLIDER_SELECTOR)) unbindRangeSlider(node);
      node.querySelectorAll(RANGE_SLIDER_SELECTOR).forEach(root => {
        if (!root.isConnected) unbindRangeSlider(root);
      });
    });
  });
});
rangeSliderObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "cd6ba85ff5f3"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _range_slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("46dcc01f14ec");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "390e88cf2860"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNativeSlider: () => (/* binding */ createNativeSlider)
/* harmony export */ });
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

function numericList(value) {
  return (Array.isArray(value) ? value : [value]).map(Number);
}

function createNode(tag, className) {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

function createNativeSlider(root, options) {
  const classes = options.cssClasses;
  const range = options.range;
  const margin = Number(options.margin || 0);
  const step = Number(options.step || 1);
  const listeners = new Map();
  let disabled = false;
  let values = numericList(options.start).map(value => clamp(value, range.min, range.max));
  root.classList.add(classes.target, classes.horizontal, options.direction === 'rtl' ? classes.textDirectionRtl : classes.textDirectionLtr);
  root.replaceChildren();
  const base = createNode('div', classes.base);
  const track = createNode('div', 'sf-range-slider-track');
  const connects = createNode('div', classes.connects);
  const connect = createNode('div', classes.connect);
  connects.append(connect);
  base.append(track, connects);
  root.append(base);
  const handles = values.map((value, index) => {
    const origin = createNode('div', classes.origin);
    const handle = createNode('div', `${classes.handle} ${index === 0 ? classes.handleLower : classes.handleUpper}`);
    const touch = createNode('div', classes.touchArea);
    handle.setAttribute('role', 'slider');
    handle.tabIndex = options.keyboardSupport === false ? -1 : 0;
    handle.append(touch);
    origin.append(handle);
    base.append(origin);
    return {
      handle,
      origin
    };
  });

  const emit = (name, handle = 0) => {
    const display = values.map(String);

    for (const listener of listeners.get(name) || []) listener(display, handle, [...values]);
  };

  const boundsFor = index => ({
    min: index > 0 ? values[index - 1] + margin : range.min,
    max: index < values.length - 1 ? values[index + 1] - margin : range.max
  });

  const normalize = (value, index) => {
    const bounds = boundsFor(index);
    const stepped = range.min + Math.round((Number(value) - range.min) / step) * step;
    return clamp(stepped, bounds.min, bounds.max);
  };

  const render = () => {
    const span = range.max - range.min;
    const percents = values.map(value => span ? (value - range.min) / span * 100 : 0);
    handles.forEach(({
      handle,
      origin
    }, index) => {
      origin.style.insetInlineStart = `${percents[index]}%`;
      handle.setAttribute('aria-valuenow', String(values[index]));
      handle.setAttribute('aria-valuemin', String(boundsFor(index).min));
      handle.setAttribute('aria-valuemax', String(boundsFor(index).max));
      handle.setAttribute('aria-valuetext', options.ariaFormat?.to?.(values[index]) || String(values[index]));
    });
    const start = values.length > 1 ? percents[0] : options.connect === 'upper' ? percents[0] : 0;
    const end = values.length > 1 ? percents[1] : options.connect === false ? percents[0] : options.connect === 'upper' ? 100 : percents[0];
    connect.style.insetInlineStart = `${Math.min(start, end)}%`;
    connect.style.inlineSize = `${Math.abs(end - start)}%`;
  };

  const setHandle = (index, value, final = false) => {
    values[index] = normalize(value, index);
    render();
    emit('update', index);
    if (final) emit('set', index);
  };

  const valueFromPointer = event => {
    const bounds = base.getBoundingClientRect();
    if (!bounds.width) return range.min;
    let ratio = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    if (options.direction === 'rtl') ratio = 1 - ratio;
    return range.min + ratio * (range.max - range.min);
  };

  const beginPointer = event => {
    if (disabled || event.button !== 0) return;
    const value = valueFromPointer(event);
    const index = values.length === 1 || Math.abs(values[0] - value) <= Math.abs(values[1] - value) ? 0 : 1;
    event.preventDefault();
    emit('start', index);
    setHandle(index, value);

    const move = next => setHandle(index, valueFromPointer(next));

    const end = next => {
      setHandle(index, valueFromPointer(next), true);
      emit('end', index);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
  };

  base.addEventListener('pointerdown', beginPointer);
  handles.forEach(({
    handle
  }, index) => handle.addEventListener('keydown', event => {
    if (disabled || options.keyboardSupport === false) return;
    const direction = options.direction === 'rtl' ? -1 : 1;
    const delta = {
      ArrowRight: step * direction,
      ArrowLeft: -step * direction,
      ArrowUp: step,
      ArrowDown: -step
    }[event.key];
    let next = delta === undefined ? null : values[index] + delta;
    if (event.key === 'Home') next = boundsFor(index).min;
    if (event.key === 'End') next = boundsFor(index).max;
    if (next === null) return;
    event.preventDefault();
    emit('start', index);
    setHandle(index, next, true);
    emit('end', index);
  }));
  const slider = {
    options,

    on(name, listener) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(listener);
      if (name === 'update') listener(values.map(String), 0, [...values]);
    },

    get(raw = false) {
      const result = raw ? [...values] : values.map(String);
      return result.length === 1 ? result[0] : result;
    },

    set(next) {
      const incoming = numericList(next);
      incoming.slice(0, values.length).forEach((value, index) => {
        values[index] = normalize(value, index);
      });
      values = values.sort((a, b) => a - b);
      render();
      emit('update', 0);
      emit('set', 0);
    },

    disable() {
      disabled = true;
      handles.forEach(({
        handle
      }) => {
        handle.tabIndex = -1;
        handle.setAttribute('aria-disabled', 'true');
      });
    },

    enable() {
      disabled = false;
      handles.forEach(({
        handle
      }) => {
        handle.tabIndex = options.keyboardSupport === false ? -1 : 0;
        handle.removeAttribute('aria-disabled');
      });
    },

    destroy() {
      base.removeEventListener('pointerdown', beginPointer);
      root.replaceChildren();
      root.classList.remove(classes.target, classes.horizontal, classes.textDirectionLtr, classes.textDirectionRtl);
      delete root.noUiSlider;
    }

  };
  root.noUiSlider = slider;
  render();
  return slider;
}

/***/ },

/***/ "0b6229fca096"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0b6229fca096");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("cd6ba85ff5f3");
/**
 * SIMAI Framework
 * Copyright 2008-2026 SIMAI Ltd
 * http://simai.studio
 * Read the license: http://framework.simai.studio/license/
 * Documentation: http://framework.simai.studio/
 * Support: http://simai.studio/support/
 *
 * INPUTS
 *
 * Entry point for importing components from this directory.
 * Simplifies the import process in other parts of the project.
 * Instead of importing individual files, all component can be imported through this file.
 */


})();

/******/ })()
;