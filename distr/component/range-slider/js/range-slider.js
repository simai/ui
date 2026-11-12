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
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8489d1f5bab4");


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

  return `${prefix}${formatDecimal(root, numeric, decimals)}${suffix}`;
} // The number in the page's language, as sf-quantity writes it: a Russian page
// reads «1,23 кг», not «1.23 кг» (docs pre-check 2026-11-10 CRS-01). The
// `data-locale` of the slider wins over the page's `lang`. Grouping follows
// the locale. Number.toFixed is the fallback where Intl refuses the digits.


function formatDecimal(root, numeric, decimals) {
  const locale = root.getAttribute('data-locale') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageLocale)(root);

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(numeric);
  } catch {
    return numeric.toFixed(decimals);
  }
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
      to: value => formatValue(root, value)
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
  expired
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
  if (removeAfter !== undefined) note.remove_after = removeAfter;
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
/* harmony export */   pageWord: () => (/* binding */ pageWord)
/* harmony export */ });
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
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
const REGISTERED = STORE.registered; // Words are kept under a component's current tag: a product that registered
// them for a renamed tag (sf-datepicker, now sf-input-date) keeps its words
// while the old tag is a dated alias, whichever name the element was written
// with (core/js/tag-aliases.js).

const wordsOf = component => REGISTERED.get((0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component));

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
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
  for (const candidate of chain(locale || 'en')) {
    const added = component ? wordsOf(component)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
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

  for (const candidate of order) {
    const registered = owner ? wordsOf(owner)?.get(candidate) : undefined;
    let added = registered?.[key];

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
    STORE.chosen = next; // The choice is the page's language: <html lang> says it too (§11.1), so
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
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
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
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
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
  remove_after: '2027-01-01'
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
  remove_after: '2027-01-01'
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
  remove_after: '2027-01-01'
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
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01'
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
      remove_after: String(row.remove_after ?? '')
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
    expired
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return;
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>. See contracts/changes/journal.json.`);
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