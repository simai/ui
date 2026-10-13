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

function dispatchSliderEvent(root, name, unencoded = [], meta = {}, eventName = `sf-range-slider-${name}`) {
  const values = getNumericValues(unencoded);
  const eventValues = isMultipleRoot(root) ? values.slice(0, 2) : values.slice(0, 1);
  const eventValue = isMultipleRoot(root) ? eventValues : eventValues[0];
  root.dataset.value = Array.isArray(eventValue) ? eventValue.join(',') : String(eventValue ?? '');
  root.dispatchEvent(new CustomEvent(eventName, {
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
    }); // `change` is the name every form value control reports a committed change
    // by; sf-range-slider-change is its legacy name with the same detail. Like
    // a native control, a value set from code is not a change. It bubbles to a
    // Smart host, which does not repeat it.

    if (!root._sfSettingValue) {
      dispatchSliderEvent(root, 'change', unencoded, {
        handle
      }, 'change');
    }
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
  root._sfSettingValue = true;

  try {
    root.noUiSlider.set(nextValue);
  } finally {
    root._sfSettingValue = false;
  }

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
    const end = values.length > 1 ? percents[1] : options.connect === false ? percents[0] : options.connect === 'upper' ? 100 : percents[0]; // connect: false draws no fill at all; it drew one from the start of the
    // track, which is what connect: 'lower' means.

    const none = options.connect === false;
    connect.style.insetInlineStart = `${none ? 0 : Math.min(start, end)}%`;
    connect.style.inlineSize = `${none ? 0 : Math.abs(end - start)}%`;
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

/***/ "870b5dfddc25"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setLoaderDragState: () => (/* binding */ setLoaderDragState)
/* harmony export */ });
function setLoaderDragState(value) {
  if (typeof SF === "undefined" || !SF.Loader) return;
  const loader = SF.Loader;
  const currentCount = Number(loader.dragObserverLockCount || 0);
  loader.dragObserverLockCount = value ? currentCount + 1 : Math.max(currentCount - 1, 0);
  loader.stopObserver = loader.dragObserverLockCount > 0;
}

/***/ },

/***/ "d0c990891b2a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("46dcc01f14ec");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ca25fbb74070");
/* harmony import */ var _helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("870b5dfddc25");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);





function serializeValue(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item ?? '')).join(',');
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function firstValue(value) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return String(value ?? '').split(',')[0] ?? '';
}

function getValueHandleCount(value) {
  if (Array.isArray(value)) {
    return Math.min(Math.max(value.length, 1), 2);
  }

  const normalized = String(value ?? '');

  if (normalized.includes(',')) {
    return 2;
  }

  return 1;
}

function getSliderHandleCount(root) {
  if (!(root instanceof HTMLElement)) {
    return 0;
  }

  return root.querySelectorAll('.sf-range-slider-handle').length || 0;
}

const sliderEventAliases = {
  'sf-range-slider-update': 'onSliderUpdate',
  'sf-range-slider-change': 'onSliderChange',
  'sf-range-slider-set': 'onSliderSet',
  'sf-range-slider-start': 'onSliderStart',
  'sf-range-slider-end': 'onSliderEnd'
};

class SfRangeSlider extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      min: {
        default: '0'
      },
      max: {
        default: '100'
      },
      start: {
        default: ''
      },
      value: {
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      step: {
        default: ''
      },
      margin: {
        default: ''
      },
      connect: {
        default: ''
      },
      keyboard: {
        type: Boolean,
        default: true
      },
      label: {
        default: 'none'
      },
      prefix: {
        default: ''
      },
      suffix: {
        default: ''
      },
      lowerLabel: {
        default: ''
      },
      upperLabel: {
        default: ''
      },
      decimals: {
        default: ''
      },
      tooltipPosition: {
        default: ''
      },
      textPosition: {
        default: ''
      },
      labelPosition: {
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
    this._syncingValueAttribute = false;
    this._syncingMultipleAttribute = false;
    this._loaderObserverLocked = false;
    this._autoMultiple = false;
    this._explicitMultiple = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'value' && this._syncingValueAttribute) {
      return;
    }

    if (name === 'multiple' && !this._syncingMultipleAttribute) {
      this._autoMultiple = false;
      this._explicitMultiple = newValue === null ? false : this.getBooleanAttr('multiple', true);
    }

    if (name === 'value') {
      this.syncAutoMultipleAttribute(newValue);
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get min() {
    return this.getAttribute('min') || '0';
  }

  get max() {
    return this.getAttribute('max') || '100';
  }

  get start() {
    return this.getAttribute('start') || '';
  }

  get value() {
    const sliderValue = this.getValue();

    if (sliderValue !== null && sliderValue !== undefined) {
      return serializeValue(sliderValue);
    }

    return this.getAttribute('value') || this.start || '0';
  }

  set value(nextValue) {
    this.setValue(nextValue);
  }

  get hasExplicitMultiple() {
    return this._explicitMultiple !== null || this.hasAttribute('multiple') && !this._autoMultiple;
  }

  get multiple() {
    if (this._explicitMultiple !== null) {
      return this._explicitMultiple;
    }

    if (this.hasExplicitMultiple) {
      return this.getBooleanAttr('multiple', false);
    }

    return getValueHandleCount(this.getAttribute('value') || this.start) > 1;
  }

  syncAutoMultipleAttribute(value) {
    if (this.hasExplicitMultiple) {
      return;
    }

    const shouldBeMultiple = getValueHandleCount(value) > 1;

    if (shouldBeMultiple) {
      this._autoMultiple = true;

      if (!this.hasAttribute('multiple')) {
        this._syncingMultipleAttribute = true;
        this.setAttribute('multiple', '');
        this._syncingMultipleAttribute = false;
      }

      return;
    }

    if (this._autoMultiple) {
      this._autoMultiple = false;
      this._syncingMultipleAttribute = true;
      this.removeAttribute('multiple');
      this._syncingMultipleAttribute = false;
    }
  }

  get step() {
    return this.getAttribute('step') || '';
  }

  get margin() {
    return this.getAttribute('margin') || '';
  }

  get connect() {
    return this.getAttribute('connect') || '';
  }

  get keyboard() {
    return this.getBooleanAttr('keyboard', true);
  }

  get label() {
    return this.getAttribute('label') || 'none';
  }

  get prefix() {
    return this.getAttribute('prefix') || '';
  }

  get suffix() {
    return this.getAttribute('suffix') || '';
  }

  get lowerLabel() {
    return this.getAttribute('lower-label') || '';
  }

  get upperLabel() {
    return this.getAttribute('upper-label') || '';
  }

  get decimals() {
    return this.getAttribute('decimals') || '';
  }

  get tooltipPosition() {
    return this.getAttribute('tooltip-position') || '';
  }

  get textPosition() {
    return this.getAttribute('text-position') || '';
  }

  get labelPosition() {
    return this.getAttribute('label-position') || '';
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  set disabled(nextValue) {
    this.setDisabled(!!nextValue);
  }

  get initialValue() {
    return this.getAttribute('value') || this.start || '0';
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      rootClass: this.getRootClass(),
      multiple: this.multiple,
      start: this.initialValue
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderRangeSliderTemplate)(this.templateContext());
  }

  resolveUpdateMode(changedAttributes = []) {
    if (!this.getSliderRoot()) {
      return 'lit';
    }

    if (changedAttributes.includes('value') && this.shouldRebuildForValue(this.getAttribute('value') || this.start || '0')) {
      return 'lit';
    }

    const requiresRerender = changedAttributes.some(name => ['template', 'connected', 'min', 'max', 'start', 'multiple', 'step', 'margin', 'connect', 'keyboard', 'label', 'prefix', 'suffix', 'lower-label', 'upper-label', 'decimals', 'tooltip-position', 'text-position', 'label-position', 'root-class'].includes(name));
    return requiresRerender ? 'lit' : 'dom';
  }

  updateDom(changedAttributes = []) {
    const root = this.getSliderRoot();

    if (!(root instanceof HTMLElement)) {
      return false;
    }

    if (changedAttributes.includes('style') || changedAttributes.includes('root-style')) {
      const style = this.getRootStyle();
      if (style) root.setAttribute('style', style);else root.removeAttribute('style');
    }

    if (changedAttributes.includes('value') && this.shouldRebuildForValue(this.getAttribute('value') || this.start || '0')) {
      return false;
    }

    if (changedAttributes.includes('disabled')) {
      root.classList.toggle('disabled', this.disabled);

      if (root.noUiSlider) {
        if (this.disabled) {
          root.noUiSlider.disable();
        } else {
          root.noUiSlider.enable();
        }
      }
    }

    if (changedAttributes.includes('value')) {
      (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.setRangeSliderValue)(root, this.getAttribute('value') || this.start || '0');
    }

    return true;
  }

  afterRender() {
    if (this._boundRoot) {
      this.removeSliderListeners(this._boundRoot);
      (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.unbindRangeSlider)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.getSliderRoot();

    if (this._boundRoot) {
      (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.bindRangeSlider)(this._boundRoot, this);
      this.addSliderListeners(this._boundRoot);

      if (this.disabled && this._boundRoot.noUiSlider) {
        this._boundRoot.noUiSlider.disable();
      }
    }
  }

  onDisconnected() {
    if (this._boundRoot) {
      this.removeSliderListeners(this._boundRoot);
      (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.unbindRangeSlider)(this._boundRoot);
      this._boundRoot = null;
    }

    this.unlockLoaderObserver();
  }

  addSliderListeners(root) {
    root.addEventListener('sf-range-slider-update', this._handleSliderUpdate);
    root.addEventListener('sf-range-slider-start', this._handleSliderStart);
    root.addEventListener('sf-range-slider-end', this._handleSliderEnd);
    root.addEventListener('sf-range-slider-set', this._handleSliderEnd);
    root.addEventListener('sf-range-slider-change', this._handleSliderEnd);
    Object.keys(sliderEventAliases).forEach(eventName => {
      root.addEventListener(eventName, this._handleSliderAlias);
    });
  }

  removeSliderListeners(root) {
    root.removeEventListener('sf-range-slider-update', this._handleSliderUpdate);
    root.removeEventListener('sf-range-slider-start', this._handleSliderStart);
    root.removeEventListener('sf-range-slider-end', this._handleSliderEnd);
    root.removeEventListener('sf-range-slider-set', this._handleSliderEnd);
    root.removeEventListener('sf-range-slider-change', this._handleSliderEnd);
    Object.keys(sliderEventAliases).forEach(eventName => {
      root.removeEventListener(eventName, this._handleSliderAlias);
    });
    this.unlockLoaderObserver();
  }

  lockLoaderObserver() {
    if (this._loaderObserverLocked) {
      return;
    }

    this._loaderObserverLocked = true;
    (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_3__.setLoaderDragState)(true);
  }

  unlockLoaderObserver() {
    if (!this._loaderObserverLocked) {
      return;
    }

    this._loaderObserverLocked = false;
    (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_3__.setLoaderDragState)(false);
  }

  _handleSliderStart = () => {
    this.lockLoaderObserver();
  };
  _handleSliderEnd = () => {
    this.unlockLoaderObserver();
  };
  _handleSliderUpdate = event => {
    const values = event.detail?.values;

    if (!values?.length) {
      return;
    }

    const serialized = serializeValue(this.multiple ? values : values[0]);

    if ((this.getAttribute('value') || '') === serialized) {
      return;
    }

    this._syncingValueAttribute = true;
    this.setAttribute('value', serialized);
    this._syncingValueAttribute = false;
  };
  _handleSliderAlias = event => {
    const alias = sliderEventAliases[event.type];

    if (!alias) {
      return;
    }

    this.dispatchEvent(new CustomEvent(alias, {
      bubbles: true,
      composed: true,
      detail: { ...(event.detail || {}),
        sourceEvent: event,
        rangeSlider: this
      }
    }));
  };

  getSliderRoot() {
    return this.querySelector('.sf-range-slider');
  }

  shouldRebuildForValue(value) {
    const root = this.getSliderRoot();
    const currentCount = getSliderHandleCount(root);
    const nextCount = this.multiple || !this.hasExplicitMultiple && getValueHandleCount(value) > 1 ? 2 : 1;
    return currentCount > 0 && currentCount !== nextCount;
  }

  getValue() {
    const root = this.getSliderRoot();
    return root ? (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.getRangeSliderValue)(root) : null;
  }

  setValue(nextValue) {
    const nextMultiple = this.hasExplicitMultiple ? this.multiple : getValueHandleCount(nextValue) > 1;
    const serialized = serializeValue(nextMultiple ? nextValue : firstValue(nextValue));
    const root = this.getSliderRoot();

    if (!this.hasExplicitMultiple) {
      if (nextMultiple) {
        this._autoMultiple = true;
        this._syncingMultipleAttribute = true;
        this.setAttribute('multiple', '');
        this._syncingMultipleAttribute = false;
      } else if (this._autoMultiple) {
        this._autoMultiple = false;
        this._syncingMultipleAttribute = true;
        this.removeAttribute('multiple');
        this._syncingMultipleAttribute = false;
      }
    } // The old reflected value can still imply multiple=true until the next
    // render. Decide from this request, not from that stale attribute.


    const currentCount = getSliderHandleCount(root);

    if (currentCount > 0 && currentCount !== (nextMultiple ? 2 : 1)) {
      this.setAttribute('value', serialized);
      return this;
    }

    if (root?.noUiSlider) {
      (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.setRangeSliderValue)(root, serialized);
      this._syncingValueAttribute = true; // Reflect the value actually admitted by range/step/margin constraints.

      this.setAttribute('value', serializeValue((0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.getRangeSliderValue)(root)));
      this._syncingValueAttribute = false;
      return this;
    }

    this.setAttribute('value', serialized);
    return this;
  }

  setDisabled(nextValue = false) {
    if (nextValue) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }

    this.requestComponentUpdate('disabled');
    return this;
  }

  get state() {
    return {
      min: this.min,
      max: this.max,
      start: this.start,
      value: this.value,
      multiple: this.multiple,
      step: this.step,
      margin: this.margin,
      connect: this.connect,
      keyboard: this.keyboard,
      label: this.label,
      prefix: this.prefix,
      suffix: this.suffix,
      lowerLabel: this.lowerLabel,
      upperLabel: this.upperLabel,
      decimals: this.decimals,
      tooltipPosition: this.tooltipPosition,
      textPosition: this.textPosition,
      labelPosition: this.labelPosition,
      disabled: this.disabled,
      rootClass: this.getRootClass()
    };
  }

  setState(nextState = {}) {
    Object.entries(nextState || {}).forEach(([key, value]) => {
      if (key === 'value') {
        this.setValue(value);
        return;
      }

      if (key === 'multiple') {
        this._autoMultiple = false;
        this._explicitMultiple = !!value;

        if (value) {
          this.setAttribute('multiple', '');
        } else {
          this.setAttribute('multiple', 'false');
        }

        return;
      }

      if (key === 'disabled') {
        this.setDisabled(!!value);
        return;
      }

      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toAttributeName)(key);

      if (!attr) {
        return;
      }

      if (value === false || value === null || value === undefined || value === '') {
        this.removeAttribute(attr);
        return;
      }

      if (value === true) {
        this.setAttribute(attr, '');
        return;
      }

      this.setAttribute(attr, String(value));
    });
    return this;
  }

  onUpdateValue(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-range-slider-update', event => {
        handler(event.detail?.value, event.detail, event);
      }, options);
    }

    return this;
  }

  onSliderUpdate(handler, options) {
    return this.onUpdateValue(handler, options);
  } // Binds change, the canonical name; it bound the legacy sf-range-slider-change,
  // which is emitted with the same detail but is the one to be retired.


  onChange(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('change', event => {
        if (!event.detail || !('value' in event.detail)) return;
        handler(event.detail?.value, event.detail, event);
      }, options);
    }

    return this;
  }

  onSliderChange(handler, options) {
    return this.onChange(handler, options);
  }

  onSet(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-range-slider-set', event => {
        handler(event.detail?.value, event.detail, event);
      }, options);
    }

    return this;
  }

  onSliderSet(handler, options) {
    return this.onSet(handler, options);
  }

  onStart(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-range-slider-start', event => {
        handler(event.detail?.value, event.detail, event);
      }, options);
    }

    return this;
  }

  onSliderStart(handler, options) {
    return this.onStart(handler, options);
  }

  onEnd(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-range-slider-end', event => {
        handler(event.detail?.value, event.detail, event);
      }, options);
    }

    return this;
  }

  onSliderEnd(handler, options) {
    return this.onEnd(handler, options);
  }

}

SfRangeSlider.define('sf-range-slider');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ca25fbb74070"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderRangeSliderTemplate: () => (/* binding */ renderRangeSliderTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function valueOrNothing(value) {
  return value === '' || value === null || value === undefined ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(value);
}

function renderRangeSliderTemplate(context) {
  const rootClasses = joinClasses('sf-range-slider', 'flex-1', context.rootClass, context.disabled ? 'disabled' : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class=${rootClasses}
                style=${valueOrNothing(context.rootStyle)}
                data-min=${valueOrNothing(context.min)}
                data-max=${valueOrNothing(context.max)}
                data-start=${valueOrNothing(context.start)}
                data-multiple=${String(!!context.multiple)}
                data-step=${valueOrNothing(context.step)}
                data-margin=${valueOrNothing(context.margin)}
                data-connect=${valueOrNothing(context.connect)}
                data-keyboard=${String(!!context.keyboard)}
                data-label=${valueOrNothing(context.label)}
                data-prefix=${valueOrNothing(context.prefix)}
                data-suffix=${valueOrNothing(context.suffix)}
                data-lower-label=${valueOrNothing(context.lowerLabel)}
                data-upper-label=${valueOrNothing(context.upperLabel)}
                data-decimals=${valueOrNothing(context.decimals)}
                data-tooltip-position=${valueOrNothing(context.tooltipPosition)}
                data-text-position=${valueOrNothing(context.textPosition)}
                data-label-position=${valueOrNothing(context.labelPosition)}
                ?disabled=${context.disabled}
        ></div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
/******/ 	let __webpack_exports__ = __webpack_require__("d0c990891b2a");
/******/
/******/ })()
;