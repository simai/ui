/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_LADDER: () => (/* binding */ FIELD_LADDER),
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   inputSize: () => (/* binding */ inputSize),
/* harmony export */   ladderSize: () => (/* binding */ ladderSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.
//
// The fields of the field ladder below are the exception: they stand on all
// five steps, as sf-input does.

const FIELD_SIZES = Object.freeze(['1/2', '1', '2']);
const RETIRED_FIELD_SIZES = Object.freeze({
  '1/3': '1/2',
  '3': '2'
});
const warned = new Set(); // A control placed inside something with the whole scale (a list item, say)
// takes the nearest form size, quietly: the list is not wrong to be 1/3.

function nearestFieldSize(value) {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;
  return Object.hasOwn(RETIRED_FIELD_SIZES, size) ? RETIRED_FIELD_SIZES[size] : '1';
}
function fieldSize(value, component = 'field', fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;

  if (Object.hasOwn(RETIRED_FIELD_SIZES, size)) {
    const kept = RETIRED_FIELD_SIZES[size];
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      kind: 'value',
      attribute: 'size',
      from: size,
      to: kept
    });
    const key = `${component}:${size}`;

    if (!warned.has(key) && typeof console !== 'undefined') {
      warned.add(key);
      console.warn(`[SIMAI Framework] ${component}: size ${size} is retired for form fields; rendering size ${kept}.`);
    }

    return kept;
  }

  return fallback;
} // The field ladder (fields ladder, 2026-11-14): one height per step for every
// field that stands on it, the control ladder sf-button and sf-button-icon
// stand on (--sf-ui-<size>--control-height: 28 / 32 / 40 / 48 / 56 on a
// desktop). A text field kept the outer steps first (actions block item 4,
// 2026-11-08: a toolbar search or a hero search stands beside buttons of 1/3
// and 3); sf-input-lookup, -quantity, -date, -code, -color and -country drew
// 32 / 48 or 40 at 1/3 and 3 beside it, so they take the same five steps and
// the stylesheets size their parts from the same steps
// (component/inputs/scss/_field-ladder.scss). The textarea and the rich text
// followed (2026-11-14), then the dropdown, the file upload area and the image
// field (queue #70, 2026-11-16): every field of the family stands on the
// ladder. FIELD_SIZES, fieldSize and retireFieldSizeClass stay for the lines
// of tags, badges and avatars and for a file's row, which keep three sizes.

const FIELD_LADDER = Object.freeze(['1/3', ...FIELD_SIZES, '3']);
const INPUT_SIZES = FIELD_LADDER;
/** A size on the field ladder: one of the five steps, else the fallback. */

function ladderSize(value, fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  return FIELD_LADDER.includes(size) ? size : fallback;
}
function inputSize(value, fallback = '1') {
  return ladderSize(value, fallback);
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "46dcc01f14ec"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindRangeSlider: () => (/* binding */ bindRangeSlider),
/* harmony export */   formatRangeSliderNumber: () => (/* binding */ formatNumberOnly),
/* harmony export */   formatRangeSliderText: () => (/* binding */ formatRangeText),
/* harmony export */   getRangeSliderValue: () => (/* binding */ getRangeSliderValue),
/* harmony export */   initExistingRangeSliders: () => (/* binding */ initExistingRangeSliders),
/* harmony export */   setRangeSliderValue: () => (/* binding */ setRangeSliderValue),
/* harmony export */   unbindRangeSlider: () => (/* binding */ unbindRangeSlider)
/* harmony export */ });
/* harmony import */ var _native_slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("390e88cf2860");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);


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
} // Digits after the decimal mark: data-precision, as sf-input-quantity names it
// (S1); data-decimals is its former name and is still read until 2027-01-01.
// Unset, the step's digits (0.5 has one). Never fewer than the step's: a value
// on its step is not shown rounded off it (2.6 with step 0.1 is «2,6», not «3»).


function getValueDecimals(root) {
  const stepDecimals = getDecimalPlaces(root.getAttribute('data-step'));
  const decimalsAttr = root.getAttribute('data-precision') ?? root.getAttribute('data-decimals');

  if (decimalsAttr !== null && decimalsAttr !== '') {
    return Math.min(100, Math.max(stepDecimals, Math.trunc(toNumber(decimalsAttr, 0))));
  }

  return stepDecimals;
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
} // A unit is held to its number by a no-break space (S1): «20 000 ₽» never
// breaks before «₽». An author's ordinary space at the joint becomes one.


function unitText(text, side) {
  const value = String(text || '');
  return side === 'prefix' ? value.replace(/[ \t]+$/u, '\u00a0') : value.replace(/^[ \t]+/u, '\u00a0');
}

function formatValue(root, value) {
  const decimals = getValueDecimals(root);
  const prefix = unitText(root.getAttribute('data-prefix'), 'prefix');
  const suffix = unitText(root.getAttribute('data-suffix'), 'suffix');
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return `${prefix}${value ?? ''}${suffix}`;
  }

  return `${prefix}${formatDecimal(root, numeric, decimals)}${suffix}`;
} // The number in the page's language, as sf-input-quantity writes it: a Russian
// page reads «1,23 кг», not «1.23 кг» (docs pre-check 2026-11-10 CRS-01). The
// `data-locale` of the slider wins over the page's `lang`. Thousands are
// grouped the locale's way unless data-grouping="false" (a year, a code).
// Number.toFixed is the fallback where Intl refuses the digits.


function formatDecimal(root, numeric, decimals) {
  const locale = root.getAttribute('data-locale') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageLocale)(root);
  const grouping = String(root.getAttribute('data-grouping') ?? '').trim().toLowerCase() !== 'false';

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: Math.min(20, decimals),
      useGrouping: grouping
    }).format(numeric);
  } catch {
    return numeric.toFixed(decimals);
  }
} // The number alone, in the slider's language and digits: the joined value of a
// range and the from/to field write each number this way, the unit once.


function formatNumberOnly(root, value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? formatDecimal(root, numeric, getValueDecimals(root)) : String(value ?? '');
} // One value with its prefix and unit; a range as «от 5 000 – 20 000 ₽»: the
// prefix before the first number, the unit after the last (C78 name line).


function formatRangeText(root, values = []) {
  const list = (Array.isArray(values) ? values : [values]).map(Number);
  if (list.length < 2) return formatValue(root, list[0]);
  const prefix = unitText(root.getAttribute('data-prefix'), 'prefix');
  const suffix = unitText(root.getAttribute('data-suffix'), 'suffix');
  return `${prefix}${formatNumberOnly(root, list[0])} – ${formatNumberOnly(root, list[1])}${suffix}`;
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
    }); // The visible name of the field (C78: label above the slider, as every
    // field) names a handle nothing else names.

    const visibleName = root.getAttribute('data-labelledby');

    if (visibleName && !handle.hasAttribute('aria-label') && !handle.hasAttribute('aria-labelledby')) {
      handle.setAttribute('aria-labelledby', visibleName);
      next['aria-labelledby'] = visibleName;
    } // The field's help line (data-describedby: its id, as sf-input's hint)
    // describes a handle nothing else describes.


    const description = root.getAttribute('data-describedby');

    if (description && !handle.hasAttribute('aria-describedby')) {
      handle.setAttribute('aria-describedby', description);
      next['aria-describedby'] = description;
    }

    if (isDisabledRoot(root)) {
      handle.setAttribute('aria-disabled', 'true');
      next['aria-disabled'] = 'true';
    }

    state.assigned.set(handle, next);
  });

  sync();
  state.observer = new MutationObserver(sync);
  const ownerFilter = owner === root ? [...accessibleAttributes, ...handleLabelAttributes] : [...accessibleAttributes, 'lower-label', 'upper-label'];
  ownerFilter.push('data-labelledby', 'data-describedby');

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
      attributeFilter: [...handleLabelAttributes, 'data-labelledby', 'data-describedby', 'disabled', 'class']
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
  const entries = getHandles(root).map((handle, index) => {
    const label = handle.querySelector(mode === 'tooltip' ? '.sf-tooltip' : '.sf-thumb-text'); // The sheet shows a tooltip only while its own handle is dragged or
    // keyboard-focused (C78), so each label knows its handle.

    label.dataset.handle = String(index);
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
    row.classList.toggle('sf-range-slider-labels--merged', plan.merged);

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

function isReadonlyRoot(root) {
  if (typeof root?.hasAttribute !== 'function') return false;
  return root.hasAttribute('readonly') || Boolean(root.classList?.contains?.('readonly')) || toBoolean(root.getAttribute('data-readonly'), false);
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
    pageStep: toNumber(root.getAttribute('data-page-step'), 0) > 0 ? toNumber(root.getAttribute('data-page-step'), 0) : undefined,
    margin: multiple && root.hasAttribute('data-margin') && toNumber(root.getAttribute('data-margin'), 0) > 0 ? Math.min(max - min, toNumber(root.getAttribute('data-margin'), 0)) : undefined,
    range: {
      min,
      max
    },
    readonly: isReadonlyRoot(root),
    ticks: toBoolean(root.getAttribute('data-ticks'), false),
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
      node.setAttribute('aria-valuenow', String(numericValues[index])); // Rounded to the step's digits, as the values are (S2): 0.2 + 0.1 is 0.3.

      const digits = Math.max(getDecimalPlaces(slider.options.step ?? ''), getDecimalPlaces(range.min));

      const bound = number => String(Number(Number(number).toFixed(Math.min(20, Math.max(digits, getDecimalPlaces(margin))))));

      node.setAttribute('aria-valuemin', index > 0 ? bound(Math.max(range.min, numericValues[index - 1] + margin)) : String(range.min));
      node.setAttribute('aria-valuemax', index < numericValues.length - 1 ? bound(Math.min(range.max, numericValues[index + 1] - margin)) : String(range.max));
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

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "390e88cf2860"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNativeSlider: () => (/* binding */ createNativeSlider),
/* harmony export */   decimalPlaces: () => (/* binding */ decimalPlaces),
/* harmony export */   roundToDigits: () => (/* binding */ roundToDigits)
/* harmony export */ });
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

function numericList(value) {
  return (Array.isArray(value) ? value : [value]).map(Number);
} // Digits after the point a number is written with: 0.1 has one, 2.5e-3 four,
// 500 none. A value is rounded to the digits of its step and its minimum, so
// three steps of 0.1 are 0.3, not 0.30000000000000004 (S2).


function decimalPlaces(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text || !Number.isFinite(Number(text))) return 0;
  const [coefficient, exponent = '0'] = text.split('e');
  const fraction = coefficient.split('.')[1]?.length || 0;
  return Math.min(20, Math.max(0, fraction - Number(exponent)));
}
function roundToDigits(value, digits) {
  const rounded = Number(Number(value).toFixed(Math.min(20, Math.max(0, digits))));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function span(range) {
  return range.max - range.min;
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
  const step = Number(options.step || 1); // PageUp, PageDown and Shift with an arrow move by the large step: ten
  // steps unless page-step says otherwise, as sf-input-quantity (S4; APG,
  // Radix, Carbon).

  const pageStep = Number(options.pageStep) > 0 ? Number(options.pageStep) : step * 10;
  const digits = Math.max(decimalPlaces(step), decimalPlaces(range.min));
  const listeners = new Map();
  let disabled = false; // Read-only (C80): focusable and read out, but neither keys nor a pointer move it.

  let readonly = Boolean(options.readonly);
  let values = numericList(options.start).map(value => clamp(value, range.min, range.max));
  root.classList.add(classes.target, classes.horizontal, options.direction === 'rtl' ? classes.textDirectionRtl : classes.textDirectionLtr);
  root.replaceChildren();
  const base = createNode('div', classes.base);
  const track = createNode('div', 'sf-range-slider-track');
  const connects = createNode('div', classes.connects);
  const connect = createNode('div', classes.connect);
  connects.append(connect);
  base.append(track, connects);
  root.append(base); // Ticks T1 (C80): a dot per step, at most twenty, over the rail and the fill.

  const tickCount = span(range) / step;

  if (options.ticks && Number.isFinite(tickCount) && tickCount >= 1 && tickCount <= 20) {
    const ticks = createNode('div', 'sf-range-slider-ticks');
    ticks.setAttribute('aria-hidden', 'true');

    for (let index = 0; index <= Math.floor(tickCount + 1e-9); index += 1) {
      const tick = createNode('span', 'sf-range-slider-tick');
      tick.style.insetInlineStart = `${Math.min(100, index * step / span(range) * 100)}%`;
      ticks.append(tick);
    }

    base.append(ticks);
  }

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
    min: index > 0 ? roundToDigits(values[index - 1] + margin, digits) : range.min,
    max: index < values.length - 1 ? roundToDigits(values[index + 1] - margin, digits) : range.max
  });

  const normalize = (value, index) => {
    const bounds = boundsFor(index);
    const stepped = roundToDigits(range.min + Math.round((Number(value) - range.min) / step) * step, digits);
    return roundToDigits(clamp(stepped, bounds.min, bounds.max), digits);
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
      if (readonly) handle.setAttribute('aria-readonly', 'true');else handle.removeAttribute('aria-readonly');
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
    if (disabled || readonly || event.button !== 0) return;
    const value = valueFromPointer(event);
    const index = values.length === 1 || Math.abs(values[0] - value) <= Math.abs(values[1] - value) ? 0 : 1;
    event.preventDefault(); // Marks the handle being dragged: its value bubble shows only meanwhile (C78).

    const dragged = handles[index].handle;
    dragged.classList.add('sf-range-slider-handle--dragging');
    emit('start', index);
    setHandle(index, value);

    const move = next => setHandle(index, valueFromPointer(next));

    const end = next => {
      setHandle(index, valueFromPointer(next), true);
      dragged.classList.remove('sf-range-slider-handle--dragging');
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
    const by = event.shiftKey ? pageStep : step;
    const delta = {
      ArrowRight: by * direction,
      ArrowLeft: -by * direction,
      ArrowUp: by,
      ArrowDown: -by,
      PageUp: pageStep,
      PageDown: -pageStep
    }[event.key];
    let next = delta === undefined ? null : values[index] + delta;
    if (event.key === 'Home') next = boundsFor(index).min;
    if (event.key === 'End') next = boundsFor(index).max;
    if (next === null) return;
    event.preventDefault();
    if (readonly) return;
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

    setReadonly(next = true) {
      readonly = Boolean(next);
      render();
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

/***/ "f39dc444b059"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fieldHelpLabel: () => (/* binding */ fieldHelpLabel),
/* harmony export */   fieldHelpSize: () => (/* binding */ fieldHelpSize),
/* harmony export */   renderFieldHelp: () => (/* binding */ renderFieldHelp)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The «?» after a field's label (owner decision C153 (8), C133's look): the
// `help` setting of every member of the field family draws sf-help-mark after
// the label text and its required mark. The mark stands a step below the
// value, as the label does -- 1/3 under the small steps, 1/2 from size 1 up --
// and each sheet holds it to the label's line, so the label row keeps its
// height. Its button is named by its subject (the component's word `help`,
// «Подробнее: {label}»). A press on it opens the explanation and never reaches
// the label row, whose own press focuses the field.

const HELP_SIZE = Object.freeze({
  '1/3': '1/3',
  '1/2': '1/3',
  1: '1/2',
  2: '1/2',
  3: '1/2'
});
/** The help mark's step for a field of `size`. */

function fieldHelpSize(size) {
  return HELP_SIZE[size] || '1/2';
}
/** The mark's name: the component's `help` word with the label, or the mark's own default. */

function fieldHelpLabel(component, label) {
  if (!label || typeof component?.sfWord !== 'function') return '';
  return component.sfWord('help', {
    vars: {
      label
    }
  });
}
/** sf-help-mark for `help`, or nothing without one. */

function renderFieldHelp({
  help,
  label = '',
  size = '1',
  className = '',
  component = null
} = {}) {
  if (!help) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark
    class=${className || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    size=${fieldHelpSize(size)}
    text=${help}
    label=${fieldHelpLabel(component, label) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    @click=${event => event.stopPropagation()}
  ></sf-help-mark>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "4d5a6e4e3291"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("46dcc01f14ec");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("68aa98f1301b");
/* harmony import */ var _helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("870b5dfddc25");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("c73b7ddd1da4");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("57a7b9f33b50");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("7ba3bc6a6535");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__, _component_field_size__WEBPACK_IMPORTED_MODULE_6__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__, _component_field_size__WEBPACK_IMPORTED_MODULE_6__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__);










 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

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
} // label was how each handle showed its value (none | text | tooltip) until
// 1.4.0; it is the visible name of the field now, as on every field (owner
// decision C78), and that setting is value-display. Those three words in label
// keep their old meaning until 2027-01-01 and are noted in SF.deprecations
// (change journal attribute-slider-range-c78).


const VALUE_DISPLAYS = ['none', 'text', 'tooltip'];

function legacyValueDisplay(element) {
  const label = String(element.getAttribute('label') ?? '').trim().toLowerCase();
  return VALUE_DISPLAYS.includes(label) ? label : null;
} // The marks of the scale, placed on the range: the ends (scale) or the
// author's list "value:text,...", each at its share of the track.


function scaleMarks(element) {
  const min = Number(element.min ?? 0);
  const max = Number(element.max ?? 100);
  const span = max - min;
  if (!(span > 0)) return [];
  const raw = String(element.getAttribute('marks') ?? '').trim();
  const list = raw ? raw.split(',').map(item => {
    const at = item.indexOf(':');
    const value = Number((at < 0 ? item : item.slice(0, at)).trim());
    return {
      value,
      text: at < 0 ? null : item.slice(at + 1).trim()
    };
  }).filter(mark => Number.isFinite(mark.value) && mark.value >= min && mark.value <= max) : element.hasAttribute('scale') && element.getAttribute('scale') !== 'false' ? [{
    value: min,
    text: null
  }, {
    value: max,
    text: null
  }] : [];
  return list.map(mark => ({ ...mark,
    percent: (mark.value - min) / span * 100,
    edge: mark.value === min ? 'start' : mark.value === max ? 'end' : ''
  }));
} // A number typed in the from/to field, read the way the slider writes it:
// the locale's group marks and spaces go, its decimal mark (and the other of
// «.» and «,» where the locale does not group with it) is a point. NaN for
// text that is not a number.


function parseTyped(text, locale, units = []) {
  let group = ',';
  let decimal = '.';

  try {
    const parts = new Intl.NumberFormat(locale || undefined).formatToParts(12345.6);
    group = parts.find(part => part.type === 'group')?.value ?? group;
    decimal = parts.find(part => part.type === 'decimal')?.value ?? decimal;
  } catch {
    /* the platform's default marks */
  } // The field's own unit and any currency sign go as the spaces do (RF-1,
  // C202): «12500 ₽», «12 500₽» and «$ 12,500» are the number the box shows.


  let value = String(text ?? '');

  for (const unit of units) {
    const own = String(unit ?? '').trim();
    if (own) value = value.split(own).join('');
  }

  value = value.replace(/\p{Sc}/gu, '').replace(/[\s\u00a0\u202f]/gu, '').replace(/[\u2212\u2013]/gu, '-');
  const groupMark = group.replace(/[\s\u00a0\u202f]/gu, '');
  if (groupMark && groupMark !== decimal) value = value.split(groupMark).join('');
  value = value.split(decimal).join('.');
  if (decimal !== ',' && groupMark !== ',') value = value.split(',').join('.');
  if (!/^-?\d*(?:\.\d*)?$/u.test(value) || !/\d/u.test(value)) return Number.NaN;
  return Number(value);
}

function getSliderHandleCount(root) {
  if (!(root instanceof HTMLElement)) {
    return 0;
  }

  return root.querySelectorAll('.sf-range-slider-handle').length || 0;
} // sf-slider-range from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8, §16.20): the settings are attributes and properties made by
// core/js/element-manifest.js and its dated aliases are aliases.json -- prefix
// is prefix-text, and the old change names follow change.


const RangeSliderElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_10__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__
}); // The class component's events, copied onto the host under their old method
// names. Outside the interface: change is the host's own (sfEmit), and the
// shim sends sf-range-slider-change and onSliderChange after it.

const sliderEventAliases = {
  'sf-range-slider-update': 'onSliderUpdate',
  'sf-range-slider-set': 'onSliderSet',
  'sf-range-slider-start': 'onSliderStart',
  'sf-range-slider-end': 'onSliderEnd'
};

class SfRangeSlider extends RangeSliderElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // A number or null, read as the manifest's accessor reads it (§4.2).
      step: {
        type: Number,
        default: null,
        parser: (raw, fallback) => raw !== undefined && raw !== null && String(raw).trim() !== '' && Number.isFinite(Number(raw)) ? Number(raw) : fallback
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

  get step() {
    return this.getProp('step');
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

  get margin() {
    return this.getAttribute('margin') || '';
  }

  get connect() {
    return this.getAttribute('connect') || '';
  }

  get keyboard() {
    return this.getBooleanAttr('keyboard', true);
  } // The visible name above the slider (C78). A former value-display word is
  // not a name.


  get label() {
    if (legacyValueDisplay(this)) return '';
    return this.getAttribute('label') || '';
  } // The three form sizes (S5): the slider row is the control height of the step.


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_6__.fieldSize)(this.getAttribute('size') || '1', 'sf-slider-range');
  }

  get valueDisplay() {
    const own = String(this.getAttribute('value-display') ?? '').trim().toLowerCase();
    if (VALUE_DISPLAYS.includes(own)) return own;
    const legacy = legacyValueDisplay(this);

    if (legacy) {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__.noteDeprecated)({
        component: 'sf-slider-range',
        kind: 'attribute',
        from: `label="${legacy}"`,
        to: `value-display="${legacy}"`,
        since: '2026-11-12',
        remove_after: '2027-01-01'
      });
      return legacy;
    }

    return 'none';
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
    const valueDisplay = this.valueDisplay;
    const name = this.label;
    return this.createTemplateContext({ ...props,
      component: this,
      rootClass: this.getRootClass(),
      multiple: this.multiple,
      start: this.initialValue,
      name,
      nameId: name ? `${(0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__.instancePath)(this, {
        kind: 'sf-range-slider'
      }))}--name` : '',
      // The help line under the field and the «?» after its label (C153,
      // field parity with sf-input): the line describes the handles and the
      // from/to boxes.
      hint: props.hint || '',
      help: name ? props.help || '' : '',
      hintId: props.hint ? `${(0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__.instancePath)(this, {
        kind: 'sf-range-slider'
      }))}--hint` : '',
      valueDisplay,
      size: this.size,
      // The class draws a tooltip over each handle; the value as text sits at
      // the end of the name line, drawn here (C78).
      handleLabel: valueDisplay === 'tooltip' ? 'tooltip' : 'none',
      outputText: this.outputText(),
      scaleMarks: scaleMarks(this),
      field: this.hasAttribute('field') && this.getAttribute('field') !== 'false',
      fieldLabels: this.fieldLabels(),
      fieldWords: [this.sfWord('from'), this.sfWord('to')],
      fieldUnit: [this.prefixText, this.suffix].map(unit => String(unit ?? '').trim()).filter(Boolean).join(' '),
      fieldDecimal: String(this.step ?? '').includes('.') || Number(this.getAttribute('precision')) > 0,
      ticks: this.hasAttribute('ticks') && this.getAttribute('ticks') !== 'false'
    });
  } // Each number of the from/to field is named as its handle is: lower-label and
  // upper-label, else one phrase of the language with the field's name or the
  // host's aria-label in it (from-label «{name}, от»), else the word alone.
  // The name has its place in the phrase, not glued before or after it (C177).


  fieldLabels() {
    const name = this.label || this.getAttribute('aria-label') || '';
    if (!this.multiple) return [name];
    return [[this.lowerLabel, 'from'], [this.upperLabel, 'to']].map(([own, key]) => own || (name ? this.sfWord(`${key}-label`, {
      vars: {
        name
      }
    }) : this.sfWord(key)));
  } // The numbers of the from/to field follow the handles; the box being typed in
  // is left alone. The rulers beside each box hold the ends of the range in the
  // slider's writing, so every box is as wide as the wider end: a value never
  // outgrows its box (C80, acceptance R2). A ruler takes the box's text size,
  // which core raises to 16px on a touch phone (touch_fields, no zoom on focus).


  syncField(values) {
    const root = this.getSliderRoot();
    const inputs = this.querySelectorAll('.sf-range-slider-field-input');
    if (!root || !inputs.length) return;
    const list = values ?? String(this.value || '').split(',').map(Number).filter(Number.isFinite);
    const ends = [this.min, this.max].map(bound => (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.formatRangeSliderNumber)(root, bound));
    this.querySelectorAll('.sf-range-slider-field-box').forEach(box => {
      const input = box.querySelector('.sf-range-slider-field-input');
      const size = input ? getComputedStyle(input).fontSize : '';
      box.querySelectorAll('.sf-range-slider-field-ruler').forEach((ruler, index) => {
        if (ruler.textContent !== ends[index]) ruler.textContent = ends[index];
        if (size && getComputedStyle(ruler).fontSize !== size) ruler.style.fontSize = size;
      });
    });
    inputs.forEach((input, index) => {
      if (document.activeElement !== input && list[index] !== undefined) {
        const text = (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.formatRangeSliderNumber)(root, list[index]); // The default value too (the value attribute): a printed first frame
        // (static markup, RF-3) shows the numbers before any code.

        if (input.defaultValue !== text) input.defaultValue = text;
        input.value = text;
      }
    });
  }

  onFieldKeyDown(event, index) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    this.commitField(index);
  } // Enter or leaving the box puts the typed number on the handle (C80): the
  // slider admits it within range, step and the other handle, the box then shows
  // what was admitted, and a person's change is a change.


  commitField(index) {
    const root = this.getSliderRoot();
    const input = this.querySelectorAll('.sf-range-slider-field-input')[index];
    if (!root || !input || this.disabled || this.readonly) return;
    const typed = parseTyped(input.value, root.getAttribute('data-locale') || root.closest('[lang]')?.getAttribute('lang'), [this.prefixText, this.suffix]);
    const before = (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.getRangeSliderValue)(root);
    const current = Array.isArray(before) ? [...before] : [before];
    if (Number.isFinite(typed)) current[index] = typed;
    this.setValue(this.multiple ? current : current[0]);
    const after = (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.getRangeSliderValue)(root);
    const values = Array.isArray(after) ? after : [after];
    input.value = (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.formatRangeSliderNumber)(root, values[index]);

    if (String(after) !== String(before)) {
      this.syncOutput(values);
      this.emitChange({
        values,
        value: this.multiple ? values : values[0],
        handleCount: values.length,
        handle: index
      });
    }
  } // A mark without text of its own writes its number the slider's way.


  syncScale() {
    const root = this.getSliderRoot();
    if (!root) return;
    this.querySelectorAll('.sf-range-slider-scale-mark').forEach((mark, index) => {
      const own = scaleMarks(this)[index];
      if (own && own.text === null) mark.textContent = (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.formatRangeSliderNumber)(root, own.value);
    });
  } // The value as the name line writes it: «45 %», «5 000 – 20 000 ₽».


  outputText(values) {
    const root = this.getSliderRoot();
    const list = values ?? String(this.value || '').split(',').map(Number).filter(Number.isFinite);
    if (!root || !list.length) return '';
    return (0,_component_range_slider_js_range_slider__WEBPACK_IMPORTED_MODULE_1__.formatRangeSliderText)(root, list);
  }

  syncOutput(values) {
    const output = this.querySelector('.sf-range-slider-output');
    if (output) output.textContent = this.outputText(values);
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

    const requiresRerender = changedAttributes.some(name => ['template', 'connected', 'min', 'max', 'start', 'multiple', 'step', 'page-step', 'margin', 'connect', 'keyboard', 'label', 'value-display', 'size', 'prefix-text', 'suffix', 'lower-label', 'upper-label', 'precision', 'grouping', 'locale', 'tooltip-position', 'text-position', 'label-position', 'root-class', // Disabled is drawn by the template from the setting (§5.3), not
    // toggled on the root by a script.
    'disabled', 'readonly', 'ticks', 'scale', 'marks', 'field'].includes(name));
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
      } // The first render had no slider to format with.


      this.syncOutput();
      this.syncScale();
      this.syncField();
    }

    this.sfSyncForm();
  } // A form control (1.3.1, §17.1): the value a form gets is the one the slider
  // shows; nothing while disabled. A range submits two entries under one name
  // (price=5000&price=20000, as Radix and a pair of native inputs do: S3), so a
  // server reads both without splitting a string. The value written first is
  // the one a reset puts back.


  connectedCallback() {
    if (this._defaultValue === undefined) this._defaultValue = this.getAttribute('value');
    super.connectedCallback?.();
  }

  sfFormValue() {
    if (this.disabled || this.sfFormDisabled) return null;
    const value = this.value;
    if (value === undefined || value === null) return null;
    const parts = String(value).split(',').map(part => part.trim()).filter(part => part !== '');
    const name = this.getAttribute('name') || '';

    if (parts.length > 1 && name && typeof FormData === 'function') {
      const data = new FormData();
      parts.slice(0, 2).forEach(part => data.append(name, part));
      return data;
    }

    return String(value);
  }

  formResetCallback() {
    const initial = this._defaultValue;
    this.setValue(initial === null || initial === undefined ? this.start || this.min || '0' : initial);
    this.sfSyncForm();
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
    root.addEventListener('sf-range-slider-change', this._handleInnerChange);
    root.addEventListener('change', this._handleInnerChange);
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
    root.removeEventListener('sf-range-slider-change', this._handleInnerChange);
    root.removeEventListener('change', this._handleInnerChange);
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

    this.syncOutput(this.multiple ? values : values.slice(0, 1));
    this.syncField(this.multiple ? values : values.slice(0, 1));
    const serialized = serializeValue(this.multiple ? values : values[0]);

    if ((this.getAttribute('value') || '') === serialized) {
      return;
    }

    this._syncingValueAttribute = true;
    this.setAttribute('value', serialized);
    this._syncingValueAttribute = false;
    this.sfSyncForm();
  }; // The class component's change and sf-range-slider-change stop at the
  // host: a person's change leaves it once, as the host's own event, without
  // the element in its detail (§8), and the shim sends the old names after it
  // with the same detail (aliases.json). A value set from code sends nothing.

  _handleInnerChange = event => {
    event.stopPropagation();
    if (event.type !== 'change' || event.target !== this.getSliderRoot()) return;
    const {
      values,
      value,
      handleCount,
      handle
    } = event.detail || {};
    this.emitChange({
      values,
      value,
      handleCount,
      handle
    });
  }; // change keeps its native name (§8, §17.3); a drag, a key or the from/to
  // field all send it from here, once per person's change.

  emitChange(detail) {
    this.sfEmit('change', detail);
  }

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
      this.sfSyncForm();
      return this;
    }

    this.setAttribute('value', serialized);
    this.sfSyncForm();
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
      pageStep: this.pageStep,
      margin: this.margin,
      connect: this.connect,
      keyboard: this.keyboard,
      label: this.label,
      valueDisplay: this.valueDisplay,
      size: this.size,
      prefixText: this.prefixText,
      suffix: this.suffix,
      lowerLabel: this.lowerLabel,
      upperLabel: this.upperLabel,
      precision: this.precision,
      grouping: this.grouping,
      locale: this.locale,
      tooltipPosition: this.tooltipPosition,
      textPosition: this.textPosition,
      labelPosition: this.labelPosition,
      disabled: this.disabled,
      readonly: this.readonly,
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

SfRangeSlider.define('sf-slider-range');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "68aa98f1301b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderRangeSliderTemplate: () => (/* binding */ renderRangeSliderTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f39dc444b059");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function valueOrNothing(value) {
  return value === '' || value === null || value === undefined ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(value);
} // The field around the slider (C78): the visible name above, as every field's
// label, with the value at the end of that line when value-display="text";
// the slider's own track line under it. The class component draws the track
// (component/range-slider); the name line belongs to the host.


function renderHead(context) {
  const showName = Boolean(context.name); // With the from/to field the numbers are in the field; the line keeps the name.

  const showOutput = context.valueDisplay === 'text' && !context.field;
  if (!showName && !showOutput) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The «?» after the label (C153 (8), as sf-input's): beside the name, not
  // in it, so the handles' name (aria-labelledby) stays the label.

  const helpMark = showName ? (0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_1__.renderFieldHelp)({
    help: context.help,
    label: context.name,
    size: context.size,
    className: 'sf-range-slider-help',
    component: context.component
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  const nameLine = name => helpMark === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? name : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-label">${name}${helpMark}</span>`;

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-range-slider-head">
            ${showName // The unit of the from/to field joins the name when the field
  // stands under the track (C202): «Цена, ₽». Hidden in the wide
  // layout, where the field writes it; the handles say it anyway.
  ? nameLine((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-name" id=${context.nameId}>${context.name}${context.field && context.fieldUnit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-name-unit" aria-hidden="true">, ${context.fieldUnit}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${showOutput // Each handle reads its own value out (aria-valuetext); this is the sighted copy.
  // A property, not a text part: the host rewrites the text as the
  // handles move, and a text part's markers would go with it, so the
  // next render (a setting changed after the first) had nowhere to write.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-output" aria-hidden="true" .textContent=${context.outputText ?? ''}></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The scale under the track (C78, C80): the ends with scale, or the author's
// marks ("1:плохо,3:нормально,5:отлично"; a mark without text writes its
// number). Numbers are written by the host after the slider is bound, in the
// slider's own language and digits.


function renderScale(context) {
  const marks = context.scaleMarks || [];
  if (!marks.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-range-slider-scale" aria-hidden="true">
            ${marks.map(mark => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                    class=${joinClasses('sf-range-slider-scale-mark', mark.edge ? `sf-range-slider-scale-mark--${mark.edge}` : '')}
                    style=${`inset-inline-start: ${mark.percent}%`}
                    data-value=${String(mark.value)}
                    .textContent=${mark.text ?? ''}
            ></span>`)}
        </div>
    `;
} // The from/to field (owner decision C80, #r2-fields): one field
// «5 000 – 20 000 ₽» at the end of the track line, the field height of the
// step, as a period is one field (C62). Typing a number and Enter (or leaving
// the box) moves the handle; dragging rewrites the number. The numbers are
// written by the host after the slider is bound.


function renderField(context) {
  if (!context.field) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const {
    component
  } = context; // Each box sits in a one-cell grid with two hidden rulers holding the ends
  // of the range, written by the host: the cell is as wide as the wider end
  // in the box's own font, and follows a late web font, a size or a density
  // by layout alone. The box fills the cell (acceptance R2: 8ch clipped).
  // Under the track (C202) a range's boxes say «от» and «до» before the
  // number; the words are hidden while the field stands in the track's line.

  const input = index => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-field-box"
        >${context.multiple ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-field-word" aria-hidden="true">${context.fieldWords[index]}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-range-slider-field-ruler" aria-hidden="true"></span
        ><span class="sf-range-slider-field-ruler" aria-hidden="true"></span
        ><input
            type="text"
            size="1"
            class="sf-range-slider-field-input"
            data-handle=${String(index)}
            inputmode=${context.fieldDecimal ? 'decimal' : 'numeric'}
            autocomplete="off"
            spellcheck="false"
            aria-label=${context.fieldLabels[index] || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-describedby=${context.hintId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ?disabled=${context.disabled}
            ?readonly=${context.readonly}
            @focus=${event => event.target.select?.()}
            @keydown=${event => component.onFieldKeyDown(event, index)}
            @input=${event => event.stopPropagation()}
            @change=${event => {
    event.stopPropagation();
    component.commitField(index);
  }}
    ></span>`;

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-range-slider-field">
            ${context.prefixText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-field-unit" aria-hidden="true">${context.prefixText.trim()}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${input(0)}
            ${context.multiple ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-field-dash" aria-hidden="true">–</span>${input(1)}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.suffix ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-field-unit" aria-hidden="true">${context.suffix.trim()}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>
    `;
}

function renderRangeSliderTemplate(context) {
  const groupClasses = joinClasses('sf-range-slider-group', `sf-range-slider-group--size-${context.size}`, context.field ? 'sf-range-slider-group--field' : '', context.disabled ? 'disabled' : '', context.readonly && !context.disabled ? 'readonly' : '');
  const rootClasses = joinClasses('sf-range-slider', 'flex-1', `sf-range-slider--size-${context.size}`, context.rootClass, context.disabled ? 'disabled' : '', context.readonly && !context.disabled ? 'readonly' : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class=${groupClasses}>
            ${renderHead(context)}
            <div class="sf-range-slider-line">
              <div class="sf-range-slider-track-column">
                <div
                        class=${rootClasses}
                        style=${valueOrNothing(context.rootStyle)}
                        data-min=${valueOrNothing(context.min)}
                        data-max=${valueOrNothing(context.max)}
                        data-start=${valueOrNothing(context.start)}
                        data-multiple=${String(!!context.multiple)}
                        data-step=${valueOrNothing(context.step)}
                        data-page-step=${valueOrNothing(context.pageStep)}
                        data-margin=${valueOrNothing(context.margin)}
                        data-connect=${valueOrNothing(context.connect)}
                        data-keyboard=${String(!!context.keyboard)}
                        data-label=${valueOrNothing(context.handleLabel)}
                        data-prefix=${valueOrNothing(context.prefixText)}
                        data-suffix=${valueOrNothing(context.suffix)}
                        data-lower-label=${valueOrNothing(context.lowerLabel)}
                        data-upper-label=${valueOrNothing(context.upperLabel)}
                        data-labelledby=${context.name ? context.nameId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        data-describedby=${context.hintId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        data-precision=${valueOrNothing(context.precision)}
                        data-grouping=${context.grouping === false ? 'false' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        data-locale=${valueOrNothing(context.locale)}
                        data-tooltip-position=${valueOrNothing(context.tooltipPosition)}
                        data-label-position=${valueOrNothing(context.labelPosition)}
                        data-ticks=${context.ticks ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        ?disabled=${context.disabled}
                ></div>
                ${renderScale(context)}
              </div>
              ${renderField(context)}
            </div>
            ${context.hint // The help line under the field (C153, as sf-input's hint).
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-range-slider-hint" id=${context.hintId} data-field-message="hint">${context.hint}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

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

/***/ "7ba3bc6a6535"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c64f6025c3f7");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "57a7b9f33b50"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-slider-range","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"prefix","to":"prefix-text","kind":"setting","component":"sf-slider-range","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26","note":"the old attribute and property write prefix-text; the property prefix is the browser\'s own (Element.prototype.prefix), so only the attribute is mapped"},{"from":"sf-range-slider-change","to":"change","kind":"event","component":"sf-slider-range","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail"},{"from":"onSliderChange","to":"change","kind":"event","component":"sf-slider-range","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail"},{"from":"sf-range-slider","to":"sf-slider-range","kind":"tag","component":"sf-slider-range","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-slider-range; sf-range-slider is a subclass defined beside it until the date"},{"from":"decimals","to":"precision","kind":"setting","component":"sf-slider-range","since":"2026-11-12","remove_after":"2027-01-01","section":"§3.1, change journal attribute-slider-range-c78","note":"the old attribute writes precision, the name sf-input-quantity gives the same setting (S1); the class component still reads data-decimals until the date"},{"from":"label","to":"value-display","kind":"attribute","component":"sf-slider-range","since":"2026-11-12","remove_after":"2027-01-01","mode":"manifest-only","section":"§4.2, change journal attribute-slider-range-c78","note":"label is the visible name now (C78); its three former words still set value-display, read by the element itself until the date (no shim: the attribute keeps its name, only those values move)","shim":"none"}]}');

/***/ },

/***/ "c73b7ddd1da4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.slider-range","tag":"sf-slider-range","version":"1.7.3","kind":"leaf","settings":{"min":{"type":"number","default":0},"max":{"type":"number","default":100},"start":{"type":"string","default":""},"multiple":{"type":"boolean","default":false},"step":{"type":"number","nullable":true,"default":null},"page-step":{"type":"number","nullable":true},"ticks":{"type":"boolean","default":false},"scale":{"type":"boolean","default":false},"marks":{"type":"string","default":""},"field":{"type":"boolean","default":false},"margin":{"type":"string","default":""},"connect":{"type":"string","default":""},"keyboard":{"type":"boolean","default":true},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"help":{"type":"string","default":""},"value-display":{"type":"enum","values":["none","text","tooltip"],"default":"none"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"prefix-text":{"type":"string","default":""},"suffix":{"type":"string","default":""},"lower-label":{"type":"string","default":""},"upper-label":{"type":"string","default":""},"precision":{"type":"number","integer":true,"min":0,"max":20,"nullable":true,"default":null},"grouping":{"type":"boolean","default":true},"locale":{"type":"string","default":""},"tooltip-position":{"type":"string","default":""},"text-position":{"type":"string","default":""},"label-position":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"name":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""}},"events":{"change":{"carries":{"values":{"type":"list","schema":{"items":{"type":"number"}}},"value":{"type":"object","schema":{"items":{"type":"number"}}},"handle-count":"number","handle":{"type":"number"}}}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","disabled":"disabled"},"css-variables":{"--sf-range-slider-track-color":{"type":"color","state":"rest"},"--sf-range-slider-fill-color":{"type":"color","state":"rest"},"--sf-range-slider-handle-color":{"type":"color","state":"rest"},"--sf-range-slider-handle-inner-color":{"type":"color","state":"rest"},"--sf-range-slider-value-color":{"type":"color","state":"rest"}}}');

/***/ },

/***/ "c64f6025c3f7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Range Slider","runtime":{"from":"from","to":"to","from-label":"{name}, from","to-label":"{name}, to","help":"More about: {label}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("4d5a6e4e3291");
/******/
/******/ })()
;