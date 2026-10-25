/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3a03d4610486"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDropdownInteraction: () => (/* binding */ createDropdownInteraction),
/* harmony export */   syncDropdownCheckbox: () => (/* binding */ syncDropdownCheckbox)
/* harmony export */ });
let sequence = 0; // Option checkboxes are selection indicators, not independent form controls.
// Use Checkbox's silent public state adapter when it is available; late-loaded
// Checkbox initializes from the already synchronized native checked property.

function syncDropdownCheckbox(item, selected) {
  const checkbox = item.querySelector('.sf-checkbox input[type="checkbox"]');
  if (!checkbox) return;
  const icon = item.querySelector('.sf-checkbox-box sf-icon, .sf-checkbox-box .sf-icon');
  const glyph = icon?.tagName?.toLowerCase() === 'sf-icon' ? icon.getAttribute('icon') || '' : icon?.textContent;
  const needsSync = checkbox.checked !== selected || checkbox.indeterminate || icon && glyph !== (selected ? 'check' : '');
  if (!needsSync) return;
  checkbox.checked = selected;
  checkbox.indeterminate = false;
  globalThis.SF?.Checkbox?.setState?.(checkbox, {
    checked: selected,
    indeterminate: false
  });
}

function identify(node, prefix) {
  if (!node.id) {
    let id;

    do {
      id = `${prefix}-${++sequence}`;
    } while (document.getElementById(id));

    node.id = id;
  }

  return node.id;
} // Shared keyboard/name adapter; selection and rendering remain with each owner.


function createDropdownInteraction(root, adapter) {
  let popup = null,
      pending = null,
      frame = null,
      released = false;
  const assigned = new WeakMap();

  const own = (node, name, value) => {
    const previous = assigned.get(node) || {};
    if (previous[name] !== undefined && node.getAttribute(name) === previous[name]) node.removeAttribute(name);
    delete previous[name];

    if (!node.hasAttribute(name) && value) {
      node.setAttribute(name, value);
      previous[name] = value;
    }

    assigned.set(node, previous);
  }; // The dropdown's own field, or the trigger the consumer handed in: the
  // keyboard, the focus and the aria state belong to whichever one is there.


  const field = () => root.querySelector('.sf-dropdown-field, .sf-dropdown-trigger');

  const trigger = () => field()?.querySelector(':scope > button') || field();

  const input = () => field()?.querySelector('input:not([type="hidden"])');

  const search = () => adapter.getList()?.querySelector('.sf-input input');

  const items = () => [...(adapter.getList()?.querySelectorAll('.sf-list-item') || [])];

  const available = () => items().filter(e => !e.hidden && !e.classList.contains('disabled') && e.getAttribute('aria-disabled') !== 'true' && e.getAttribute('aria-hidden') !== 'true');

  const contains = node => node && (root.contains(node) || adapter.getList()?.contains(node));

  const text = item => item.querySelector('.sf-list-item-container, .sf-avatar-label-group-title, .sf-tag-container')?.textContent?.trim() || item.dataset.value || '';

  const focus = node => {
    if (node && !node.disabled) {
      node.focus({
        preventScroll: true
      });
      node.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      });
    }
  };

  const resolvePending = () => {
    if (!pending) return;

    if (pending === 'trigger') {
      pending = null;
      focus(trigger());
      return;
    }

    if (!adapter.isOpen() || adapter.getList()?.hidden) return;
    const options = available();
    const target = pending === 'search' ? search() || options[0] || trigger() : pending === 'last' ? options.at(-1) : typeof pending === 'object' ? options.find(e => e.dataset.value === pending.value) : options[0];
    pending = null;
    focus(target);
  };

  const beforeClose = () => {
    if (adapter.getList()?.contains(document.activeElement)) pending = 'trigger';
  };

  const close = () => {
    pending = 'trigger';
    focus(trigger());
    adapter.close();
    refresh();
  };

  const open = target => {
    pending = target;
    adapter.open();
    refresh();
  };

  const onKeydown = event => {
    if (adapter.isDisabled() || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target,
          option = target.closest?.('.sf-list-item'),
          inPopup = adapter.getList()?.contains(target);
    const isTrigger = target === trigger() || target === input() || target === field();
    let handled = false;

    if (event.key === 'Escape' && adapter.isOpen()) {
      close();
      handled = true;
    } else if (event.key === 'Tab' && adapter.isOpen()) {
      // Start native Tab traversal at the trigger even when the popup is portaled.
      if (inPopup) focus(trigger());
      adapter.close();
      refresh();
      return;
    } else if (isTrigger && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      if (adapter.isOpen() && ['Enter', ' '].includes(event.key)) close();else open(event.key === 'ArrowUp' ? 'last' : 'search');
      handled = true;
    } else if (inPopup && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      const options = available(),
            index = options.indexOf(option);
      const next = index < 0 ? event.key === 'ArrowUp' ? options.length - 1 : 0 : Math.max(0, Math.min(options.length - 1, index + (event.key === 'ArrowUp' ? -1 : 1)));
      focus(options[next]);
      handled = true;
    } else if (option && inPopup && ['Home', 'End'].includes(event.key)) {
      const options = available();
      focus(event.key === 'Home' ? options[0] : options.at(-1));
      handled = true;
    } else if (option && inPopup && ['Enter', ' '].includes(event.key)) {
      if (available().includes(option)) {
        pending = adapter.isMultiple() ? {
          value: option.dataset.value
        } : 'trigger';
        adapter.select(option);
        refresh();
      }

      handled = true;
    }

    if (handled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  const onFocusout = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = null;

      if (!released && adapter.isOpen() && !pending && !contains(document.activeElement)) {
        adapter.close();
        refresh();
      }
    });
  };

  let summary = document.createElement('span');
  summary.className = 'sf-dropdown-value';
  root.append(summary);
  identify(summary, 'sf-dropdown-value');

  const refresh = () => {
    if (released) return;
    const next = adapter.getList();

    if (popup !== next) {
      popup?.removeEventListener('keydown', onKeydown, true);
      popup?.removeEventListener('focusout', onFocusout);
      popup = next;
      popup?.addEventListener('keydown', onKeydown, true);
      popup?.addEventListener('focusout', onFocusout);
    }

    const button = trigger(),
          container = popup?.querySelector('.sf-list-container');
    if (!button || !container) return;
    if (!summary.isConnected) root.append(summary);
    const label = root.querySelector('.sf-dropdown-label .sf-dropdown-text');
    const owner = adapter.owner || root;
    const labelId = label?.textContent.trim() ? identify(label, 'sf-dropdown-label') : '';
    const ownerLabel = owner.getAttribute('aria-label') || root.getAttribute('aria-label');
    const ownerRefs = owner.getAttribute('aria-labelledby') || root.getAttribute('aria-labelledby');
    const buttonId = identify(button, 'sf-dropdown-trigger');
    const authorButtonLabel = button.hasAttribute('aria-label') && assigned.get(button)?.['aria-label'] !== button.getAttribute('aria-label');
    own(button, 'aria-labelledby', ownerRefs || (!ownerLabel && labelId ? authorButtonLabel ? `${buttonId} ${labelId}` : labelId : ''));
    own(button, 'aria-label', ownerLabel);
    if (button.tagName !== 'BUTTON') button.setAttribute('role', 'button');
    button.tabIndex = adapter.isDisabled() ? -1 : 0;
    button.setAttribute('aria-expanded', String(adapter.isOpen()));
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-controls', identify(container, 'sf-dropdown-listbox'));
    button.querySelectorAll('.sf-icon').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
    if (field() !== button) field().tabIndex = -1;
    if (input()) input().tabIndex = -1;
    container.setAttribute('role', 'listbox');
    container.setAttribute('aria-multiselectable', String(adapter.isMultiple()));
    own(container, 'aria-labelledby', ownerRefs || labelId || buttonId);
    const query = search();

    if (query) {
      query.setAttribute('role', 'searchbox');
      query.setAttribute('aria-controls', container.id);
      own(query, 'aria-labelledby', query.hasAttribute('aria-label') ? '' : ownerRefs || labelId || buttonId);
    }

    items().forEach(item => {
      item.setAttribute('role', 'option');
      item.tabIndex = -1;
      item.setAttribute('aria-selected', String(item.classList.contains('selected')));
      own(item, 'aria-disabled', item.classList.contains('disabled') ? 'true' : '');
      syncDropdownCheckbox(item, item.classList.contains('selected'));
      item.querySelectorAll('.sf-checkbox').forEach(indicator => {
        if (indicator.getAttribute('aria-hidden') !== 'true') indicator.setAttribute('aria-hidden', 'true');
      });
      item.querySelectorAll('.sf-icon, sf-icon').forEach(icon => {
        if (icon.getAttribute('aria-hidden') !== 'true') icon.setAttribute('aria-hidden', 'true');
      });
      item.querySelectorAll('input, button, a[href], [tabindex]').forEach(child => {
        child.tabIndex = -1;
      });
    });
    const labels = adapter.selectedLabels?.() || items().filter(e => e.classList.contains('selected')).map(text);
    summary.textContent = labels.join(', ') || input()?.value || input()?.placeholder || '';
    const refs = new Set((button.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    refs.add(summary.id);
    button.setAttribute('aria-describedby', [...refs].join(' '));
    resolvePending();
  };

  root.addEventListener('keydown', onKeydown, true);
  root.addEventListener('focusout', onFocusout);
  refresh();
  return {
    refresh,
    beforeClose,

    release() {
      released = true;
      if (frame !== null) cancelAnimationFrame(frame);
      root.removeEventListener('keydown', onKeydown, true);
      root.removeEventListener('focusout', onFocusout);
      popup?.removeEventListener('keydown', onKeydown, true);
      popup?.removeEventListener('focusout', onFocusout);
      const button = trigger();

      if (button) {
        const refs = (button.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== summary.id);
        if (refs.length) button.setAttribute('aria-describedby', refs.join(' '));else button.removeAttribute('aria-describedby');
      }

      summary.remove();
    }

  };
}

/***/ },

/***/ "a0f23dca0b37"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeDropdownPortal: () => (/* binding */ closeDropdownPortal),
/* harmony export */   openDropdownPortal: () => (/* binding */ openDropdownPortal),
/* harmony export */   positionDropdownPortal: () => (/* binding */ positionDropdownPortal),
/* harmony export */   triggerOf: () => (/* binding */ triggerOf)
/* harmony export */ });
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5c1dc214bb5e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_position_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_position_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_0__);
// One placement/lifecycle contract for native and body-projected panels.
 // Prefer the helper Core published; a bundle loaded without core.js (for
// example an isolated documentation frame) still positions with its own copy.

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_0___default());

const portals = new WeakMap();
const properties = ['position', 'inset', 'margin', 'width', 'max-width', 'max-height', 'overflow', 'left', 'top', 'right', 'bottom', 'z-index'];
const inherited = ['font-family', 'font-size', 'font-weight', 'font-style', 'font-stretch', 'font-variant', 'font-feature-settings', 'font-variation-settings', 'font-optical-sizing', 'font-kerning', 'line-height', 'letter-spacing', 'word-spacing', 'text-transform', 'text-indent', 'white-space', 'word-break', 'overflow-wrap', 'text-rendering', 'direction', 'writing-mode', 'text-orientation', 'color', 'color-scheme', 'text-align'];

function syncFallbackContext(root, state) {
  if (!state.context) return;
  const context = state.context,
        computed = getComputedStyle(root);
  const classes = ['sf-dropdown', ...Array.from(root.classList).filter(name => name.startsWith('sf-dropdown--') && !['sf-dropdown--open', 'sf-dropdown--drop-up', 'sf-dropdown--drop-down'].includes(name))].join(' ');
  if (context.className !== classes) context.className = classes;
  const names = [...Array.from(computed).filter(name => name.startsWith('--sf-')), ...inherited];
  const keys = new Set(names);

  for (const name of state.contextProperties || []) if (!keys.has(name)) context.style.removeProperty(name);

  for (const name of names) {
    const value = computed.getPropertyValue(name);
    if (context.style.getPropertyValue(name) !== value) context.style.setProperty(name, value);
  }

  state.contextProperties = names;
} // What the list hangs from. Usually the dropdown's own field; where the
// consumer handed a trigger in, that trigger. Looking only for the field, the
// portal never opened for such a dropdown at all -- the list stayed in the page
// where it was rendered, with no placement of its own and clipped by whatever
// box it sat in.


function triggerOf(root) {
  return root?.querySelector('.sf-dropdown-field, .sf-dropdown-trigger') ?? null;
}
function positionDropdownPortal(root, list) {
  const state = portals.get(list);
  if (!state || !root.isConnected || list.hidden) return false;
  const field = triggerOf(root);
  if (!field) return false;

  if (root.closest('[hidden], [inert], [aria-hidden="true"], dialog:not([open])') || !field.getClientRects().length || ['hidden', 'collapse'].includes(getComputedStyle(field).visibility)) {
    state.onUnavailable?.();
    return false;
  }

  syncFallbackContext(root, state);

  if (state.wrap) {
    state.wrap.style.minHeight = '0';
    state.wrap.style.overflowY = 'auto';
  } // Geometry is the shared Framework contract (SF.Position on Floating UI):
  // below the field by default, flipped above when the panel does not fit and
  // there is more room, shifted inside the viewport and height-limited by it.


  if (!state.anchor) {
    state.anchor = position().anchor(field, list, {
      side: 'block-end',
      align: 'start',
      // A list matches the width of a field, because a field is as wide as the
      // list it opens. A trigger of the consumer's own is not: an icon button
      // would make the list the width of a glyph.
      matchWidth: field.classList.contains('sf-dropdown-field'),
      fitHeight: true,
      autoUpdate: false,
      onPosition: ({
        side
      }) => {
        const up = side === 'block-start';
        list.dataset.placement = root.dataset.placement = up ? 'top' : 'bottom';
        root.classList.toggle('sf-dropdown--drop-up', up);
        root.classList.toggle('sf-dropdown--drop-down', !up);
      }
    });
  }

  state.anchor.update();
  return true;
}
function openDropdownPortal(root, list, onUnavailable) {
  if (!list?.isConnected || !triggerOf(root)) return false;
  const active = list.contains(document.activeElement) ? document.activeElement : null;

  if (!portals.has(list)) {
    const saved = properties.map(name => [name, list.style.getPropertyValue(name), list.style.getPropertyPriority(name)]);
    const state = {
      root,
      saved,
      onUnavailable,
      popover: list.getAttribute('popover'),
      frame: 0,
      native: typeof list.showPopover === 'function'
    };
    state.wrap = list.querySelector('.sf-list-container-wrap');
    state.wrapStyles = state.wrap ? ['min-height', 'overflow-y'].map(name => [name, state.wrap.style.getPropertyValue(name), state.wrap.style.getPropertyPriority(name)]) : [];

    state.schedule = () => {
      if (!state.frame) state.frame = requestAnimationFrame(() => {
        state.frame = 0;
        positionDropdownPortal(root, list);
      });
    };

    portals.set(list, state);
    root.__sfDropdownPortalList = list;
    if (state.native) list.setAttribute('popover', 'manual');else {
      state.parent = list.parentNode;
      state.next = list.nextSibling;
      state.context = document.createElement('div');
      state.context.style.cssText = 'display:contents;position:static';
      syncFallbackContext(root, state); // A body projection is inert outside a native modal dialog and sits
      // behind Framework modal stacks. Keep it in the closest modal boundary,
      // but outside the modal's clipped content panel.

      const boundary = root.closest('dialog[open], [role="dialog"][aria-modal="true"]');
      (boundary || document.body).append(state.context);
      state.context.append(list);
      list.style.zIndex = 'var(--sf-z-index-9)';
    }
    state.inheritance = new MutationObserver(state.schedule);

    for (let node = root; node; node = node.parentElement) state.inheritance.observe(node, {
      attributes: true,
      attributeFilter: ['class', 'style', 'dir', 'hidden', 'inert', 'aria-hidden', 'open']
    });

    Object.assign(list.style, {
      position: 'fixed',
      inset: 'auto',
      margin: '0',
      overflow: state.wrap ? 'hidden' : 'auto'
    });

    if (typeof ResizeObserver === 'function') {
      state.resize = new ResizeObserver(state.schedule);
      state.resize.observe(triggerOf(root));
      state.resize.observe(list);
    }

    window.visualViewport?.addEventListener('resize', state.schedule);
    window.visualViewport?.addEventListener('scroll', state.schedule);
  }

  list.hidden = false;
  if (portals.get(list).native && !list.matches(':popover-open')) list.showPopover();
  if (!positionDropdownPortal(root, list)) return false;
  if (active && document.activeElement !== active) active.focus({
    preventScroll: true
  });
  return true;
}
function closeDropdownPortal(list) {
  const state = portals.get(list);
  if (!state) return false;
  const active = list.contains(document.activeElement) ? document.activeElement : null;
  state.anchor?.stop();
  state.resize?.disconnect();
  cancelAnimationFrame(state.frame);
  state.inheritance?.disconnect();
  window.visualViewport?.removeEventListener('resize', state.schedule);
  window.visualViewport?.removeEventListener('scroll', state.schedule);

  if (state.native) {
    if (list.matches(':popover-open')) list.hidePopover();
    if (state.popover === null) list.removeAttribute('popover');else list.setAttribute('popover', state.popover);
  } else {
    if (state.next?.parentNode === state.parent) state.parent.insertBefore(list, state.next);else state.parent.append(list);
    state.context.remove();
  }

  for (const [name, value, priority] of state.saved) {
    if (value) list.style.setProperty(name, value, priority);else list.style.removeProperty(name);
  }

  for (const [name, value, priority] of state.wrapStyles) {
    if (value) state.wrap.style.setProperty(name, value, priority);else state.wrap.style.removeProperty(name);
  }

  delete list.dataset.placement;
  delete state.root.dataset.placement;
  state.root.classList.remove('sf-dropdown--drop-up', 'sf-dropdown--drop-down');
  if (state.root.__sfDropdownPortalList === list) delete state.root.__sfDropdownPortalList;
  portals.delete(list); // A mode change leaves the list open. Closing/disabled/disconnect paths do
  // not restore focus into a hidden or detached panel.

  if (active && !list.hidden && state.root.isConnected && document.activeElement !== active) active.focus({
    preventScroll: true
  });
  return true;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.

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

/***/ },

/***/ "67eed2647f47"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindFormReset: () => (/* binding */ bindFormReset)
/* harmony export */ });
// Reset fires before the browser restores default values. Synchronize afterwards
// without synthesizing input/change events or retaining detached controls.
const subscriptions = new WeakMap();
const listeningDocuments = new WeakSet();
function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;

  if (!listeningDocuments.has(doc)) {
    doc.addEventListener('reset', event => {
      const form = event.target;
      if (form?.tagName !== 'FORM') return;
      const controls = Array.from(form.elements);
      setTimeout(() => {
        if (event.defaultPrevented) return;

        for (const control of controls) {
          if (!control.isConnected || control.form !== form) continue;

          for (const callback of subscriptions.get(control) || []) callback();
        }
      }, 0);
    }, true);
    listeningDocuments.add(doc);
  }

  let callbacks = subscriptions.get(input);
  if (!callbacks) subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  return () => callbacks.delete(synchronize);
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
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true.
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
  to = null
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  const existing = notes.get(key);

  if (existing) {
    existing.count += 1;
    return;
  }

  notes.set(key, {
    component,
    kind,
    attribute,
    from,
    to,
    count: 1
  });

  if (warnEnabled()) {
    const where = component ? `${component}: ` : '';
    const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
    globalThis.console?.warn?.(`[SIMAI Framework] ${where}${what} is a legacy name${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
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

/***/ "421676f72963"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPEN_SURFACE_MARK: () => (/* binding */ OPEN_SURFACE_MARK),
/* harmony export */   holdOpenSurfaceMark: () => (/* binding */ holdOpenSurfaceMark),
/* harmony export */   isOpenSurfaceMarked: () => (/* binding */ isOpenSurfaceMarked),
/* harmony export */   isTopOpenSurface: () => (/* binding */ isTopOpenSurface)
/* harmony export */ });
// While a transient surface is open the root says so, and a component whose own
// Escape closes something larger -- a drawer, a modal, a record panel -- stands
// back. They all listen on the document in capture, where stopPropagation
// cannot reach a listener on the same node and the one registered first wins
// whatever it is: without a shared mark, one press closed the surface and the
// window behind it together.
//
// The mark started inside sf-popover, which made it that component's state
// instead of the protocol it is: a dropdown list is the same kind of surface and
// raised nothing, so Escape over an open list closed the record panel behind it
// (Larena storage QA, 2026-10-22) -- and a drawer and a modal read the same mark,
// so the same press closed those too. It lives here now, raised by every surface
// that owns Escape while it is open and read by every component that owns Escape
// for something larger.
//
// The attribute name is unchanged, because it is already the published protocol:
// `document.documentElement.dataset.sfPopoverOpen`.
const OPEN_MARK = 'sfPopoverOpen'; // A count, not a flag: two surfaces can be open at once -- a dropdown inside a
// popover -- and the first to close must not clear the mark the second needs.

const held = new WeakSet(); // The same holders in the order they opened, so the one opened last -- the
// innermost layer -- is known. The mark answers "is anything open"; this answers
// "is it me". Two surfaces that both listen on the document in capture cannot
// settle it with stopPropagation, which does not reach a listener on the same
// node: a calendar opened inside a popover closed together with the popover, and
// a popover closed over a dropdown list it held and left the list open.
//
// Kept on a shared global, not in module scope: every Smart bundle carries its
// own copy of this module, so a module-scope list in the popover's bundle never
// saw the calendar the datepicker's bundle opened. The count lives on the root
// for the same reason.

const LAYERS_KEY = Symbol.for('sf.openSurfaceLayers');

function openLayers() {
  const scope = globalThis;
  if (!Array.isArray(scope[LAYERS_KEY])) scope[LAYERS_KEY] = [];
  return scope[LAYERS_KEY];
}

function step(delta) {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  const next = Math.max(0, Number(root.dataset[OPEN_MARK] || 0) + delta);
  if (next) root.dataset[OPEN_MARK] = String(next);else delete root.dataset[OPEN_MARK];
} // Idempotent for one owner, so a component can call it from every update with
// its own open state and only a change moves the count. An owner that is removed
// while open releases it the same way, from wherever it tears down.


function holdOpenSurfaceMark(owner, open) {
  if (!owner) return;
  const wanted = Boolean(open);
  if (wanted === held.has(owner)) return;
  const layers = openLayers();

  if (wanted) {
    held.add(owner);
    layers.push(owner);
  } else {
    held.delete(owner);
    const at = layers.lastIndexOf(owner);
    if (at >= 0) layers.splice(at, 1);
  }

  step(wanted ? 1 : -1);
} // What a surface asks before its own Escape closes it: whether it is the
// innermost open layer. A holder that left the document without releasing is
// passed over rather than allowed to hold every Escape on the page. An owner
// that holds nothing is the top only when nothing else is open.

function isTopOpenSurface(owner) {
  const layers = openLayers();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    const layer = layers[at];
    if (layer?.isConnected === false) continue;
    return layer === owner;
  }

  return true;
} // What a component asks before its own Escape closes something larger.

function isOpenSurfaceMarked() {
  return Boolean(globalThis.document?.documentElement?.dataset?.[OPEN_MARK]);
}
const OPEN_SURFACE_MARK = OPEN_MARK;

/***/ },

/***/ "50a1017ded91"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5429d6e80991");
/* harmony import */ var _component_dropdown_interaction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("3a03d4610486");
/* harmony import */ var _component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a0f23dca0b37");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("421676f72963");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("778671c79fa6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);









const DROPDOWN_TEXT = {
  en: {
    search: 'Search'
  },
  ru: {
    search: 'Поиск'
  }
};

function normalizeSize(value) {
  return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.fieldSize)(value, 'sf-dropdown');
}

function normalizeListItemType(value) {
  const normalized = String(value || '').toLowerCase();
  const supported = ['text', 'icon', 'checkbox', 'avatar', 'color'];
  return supported.includes(normalized) ? normalized : 'text';
}

function parseOptionNode(node, dropdownSize = '1') {
  if (!(node instanceof HTMLElement)) return null;
  if (node.tagName.toLowerCase() !== 'sf-list-item') return null;
  return {
    type: normalizeListItemType(node.getAttribute('kind') || node.getAttribute('type')),
    size: normalizeSize(node.getAttribute('size') || dropdownSize),
    text: node.getAttribute('text') || '',
    icon: node.getAttribute('icon') || 'person',
    checked: node.hasAttribute('checked') || (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(node.getAttribute('checked')),
    selected: node.hasAttribute('selected') || (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(node.getAttribute('selected')),
    disabled: node.hasAttribute('disabled') || (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(node.getAttribute('disabled')),
    colorClass: node.getAttribute('color-class') || 'bg-tertiary',
    avatarImageUrl: node.getAttribute('avatar-image-url') || '',
    avatarTitle: node.getAttribute('avatar-title') || node.getAttribute('text') || '',
    value: node.getAttribute('value') ?? node.getAttribute('text') ?? '',
    ariaLabel: node.getAttribute('aria-label') || '',
    // Where this option comes from. Options carrying the same group, one after
    // another, are drawn under one heading.
    group: node.getAttribute('group') || ''
  };
} // An option may also arrive as data rather than as a child element. The shape is
// the one parseOptionNode produces, so both paths answer the same questions and
// a missing field falls back the same way.


function parseOptionData(option, dropdownSize = '1') {
  if (!option || typeof option !== 'object') return null;
  const text = option.text === undefined || option.text === null ? '' : String(option.text);
  const value = option.value === undefined || option.value === null ? text : String(option.value);
  if (text === '' && value === '') return null;
  return {
    // `kind` is the list item's axis; `type` its legacy name.
    type: normalizeListItemType(option.kind || option.type),
    size: normalizeSize(option.size || dropdownSize),
    text,
    icon: option.icon ? String(option.icon) : 'person',
    checked: (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(option.checked),
    selected: (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(option.selected),
    disabled: (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(option.disabled),
    colorClass: option.colorClass ? String(option.colorClass) : 'bg-tertiary',
    avatarImageUrl: option.avatarImageUrl ? String(option.avatarImageUrl) : '',
    avatarTitle: option.avatarTitle ? String(option.avatarTitle) : text,
    value,
    ariaLabel: option.ariaLabel ? String(option.ariaLabel) : '',
    group: option.group ? String(option.group) : ''
  };
}

function parseOptionList(value, dropdownSize = '1') {
  let list = value;

  if (typeof list === 'string') {
    const text = list.trim();
    if (text === '') return [];

    try {
      list = JSON.parse(text);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(list)) return [];
  return list.map(option => typeof option === 'string' || typeof option === 'number' ? parseOptionData({
    text: String(option),
    value: String(option)
  }, dropdownSize) : parseOptionData(option, dropdownSize)).filter(Boolean);
}

function splitValues(value = '') {
  return String(value || '').split(',').map(item => item.trim()).filter(Boolean);
}

function serializeValues(values = []) {
  return values.map(value => String(value)).join(',');
}

function getOptionLabel(option = {}) {
  if (option.type === 'avatar') return option.avatarTitle || option.text || option.value || '';
  return option.text || option.avatarTitle || option.value || '';
}

class SfDropdown extends (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_8__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default())) {
  constructor() {
    super();
    this._options = [];
    this._optionsCaptured = false;
    this._optionsFromData = false;
    this._open = false;
    this._searchValue = '';
    this._selectedValues = [];
    this._dropdownRoot = null;
    this._list = null;
    this._documentClickHandler = this.handleDocumentClick.bind(this);
    this._viewportHandler = this.positionPortalList.bind(this);
  }

  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      size: {
        default: '1'
      },
      // The axis is called appearance, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      appearance: {
        default: 'outlined',
        values: ['filled', 'outlined'],
        aliases: ['type']
      },
      mode: {
        default: 'select',
        values: ['tag', 'select']
      },
      multiple: {
        type: Boolean,
        default: false
      },
      portal: {
        type: Boolean,
        default: true
      },
      value: {
        default: ''
      },
      name: {
        default: ''
      },
      label: {
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      },
      placeholder: {
        default: ''
      },
      searchPlaceholder: {
        default: ''
      },
      search: {
        type: Boolean,
        default: true
      },
      // How the options are laid out. A list is one option a row; a grid puts
      // several in a row, which is the only way a hundred icons can be looked
      // at -- a column of them is a column nobody scrolls to the end of.
      layout: {
        default: 'list',
        values: ['list', 'grid']
      },
      columns: {
        default: '6'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      ariaLabel: {
        default: ''
      },
      // The option value the field falls back to while nothing is chosen
      // (simai/ui-source#28): its label is shown as inherited, in select mode.
      inheritedValue: {
        attribute: 'inherited-value',
        default: ''
      },
      inheritedText: {
        attribute: 'inherited-text',
        default: ''
      },
      resetLabel: {
        attribute: 'reset-label',
        default: ''
      }
    };
  }

  connectedCallback() {
    this.captureOptions();

    if (!Object.prototype.hasOwnProperty.call(this, '_resetValues')) {
      this._resetValues = [...this.selectedValues];
    }

    super.connectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'value') this._selectedValues = splitValues(newValue);

      if (name === 'disabled' && this.disabled) {
        this._open = false;
        this._searchValue = '';
      }
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get componentName() {
    return 'dropdown';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get size() {
    return normalizeSize(this.getAttribute('size'));
  }

  get appearance() {
    return this.getProp('appearance');
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.appearance;
  }

  get mode() {
    return this.getEnumAttr('mode', ['tag', 'select'], 'select');
  }

  get multiple() {
    if (!this.hasAttribute('multiple')) {
      return this.mode === 'tag';
    }

    return this.getBooleanAttr('multiple', true);
  }

  get portal() {
    return this.getBooleanAttr('portal', true);
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  get selectedValue() {
    return this.getAttribute('value') || '';
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get required() {
    return this.getBooleanAttr('required', false);
  }

  get placeholder() {
    return this.getAttribute('placeholder') || '';
  } // The control a person reaches is the readonly input inside the trigger, and
  // nothing named it (simai/ui-source#32, axe «label», critical, in ui-mail):
  // the visible label is a sibling span, not the wrapping <label>, and a name
  // given to the host -- aria-label, a <label for> or aria-labelledby pointing
  // at it -- names the host, which is not the control. The name is taken in
  // that order of precedence: the drawn label, then what the page said about
  // the host.


  accessibleName() {
    if (this.getProp('label')) return this.getProp('label');
    const own = this.getAttribute('aria-label');
    if (own) return own;
    const byIds = (this.getAttribute('aria-labelledby') || '').split(/\s+/u).filter(Boolean).map(id => this.ownerDocument?.getElementById(id)?.textContent?.trim() || '').filter(Boolean).join(' ');
    if (byIds) return byIds;
    const labels = this.id && this.ownerDocument ? [...this.ownerDocument.querySelectorAll('label[for]')].filter(label => label.htmlFor === this.id) : [];
    return labels.map(label => label.textContent.trim()).filter(Boolean).join(' ');
  }

  get searchPlaceholder() {
    // The search field read «Placeholder» on every page; a native change it
    // fires when left is stopped in the template, so the dropdown's own change
    // is the only one a listener on it hears.
    return this.getAttribute('search-placeholder') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(DROPDOWN_TEXT, 'search', this);
  }

  get layout() {
    return this.getEnumAttr('layout', ['list', 'grid'], 'list');
  }

  get columns() {
    const value = Number.parseInt(this.getAttribute('columns') ?? '', 10);
    return Number.isFinite(value) && value > 0 ? String(value) : '6';
  }

  get search() {
    return this.getBooleanAttr('search', true);
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get ariaLabel() {
    return this.getAttribute('aria-label') || '';
  }

  get selectedValues() {
    return this.hasAttribute('value') ? splitValues(this.selectedValue) : this._selectedValues;
  }

  get selectedOptions() {
    const options = this.options;
    return [...new Set(this.selectedValues)].map(value => options.find(option => String(option.value) === value)).filter(Boolean);
  }

  get triggerText() {
    if (this.mode === 'tag') {
      return '';
    }

    const options = this.multiple ? this.selectedOptions : this.selectedOptions.slice(0, 1);
    return options.map(getOptionLabel).join(', ');
  }

  get hiddenValue() {
    return this.selectedValues.join(',');
  }

  captureOptions() {
    if (this._optionsFromData) {
      return;
    }

    const optionNodes = Array.from(this.children).filter(child => child instanceof HTMLElement && child.tagName.toLowerCase() === 'sf-list-item');

    if (!optionNodes.length) {
      return;
    }

    this._options = optionNodes.map(node => parseOptionNode(node, this.size)).filter(Boolean);
    this._optionsCaptured = true;

    if (!this.selectedValue && !this._selectedValues.length) {
      this._selectedValues = this._options.filter(option => option.selected).map(option => String(option.value));
    }

    optionNodes.forEach(child => child.remove());
  }
  /**
   * Options given as data instead of as child elements. A Smart parent that
   * renders this dropdown from a template owns those children, and capturing
   * them means removing them, which takes them out of the parent's hands for
   * good: it can no longer put a changed list back. Data has no owner to take
   * them from.
   */


  set options(value) {
    const next = parseOptionList(value, this.size);
    this._optionsFromData = true;
    this._options = next;
    this._optionsCaptured = true;

    if (!this.selectedValue && !this._selectedValues.length) {
      this._selectedValues = next.filter(option => option.selected).map(option => String(option.value));
    }

    this.requestComponentUpdate('options');
  }

  get options() {
    if (!Array.isArray(this._options) || !this._options.length) {
      return [];
    }

    const selectedSet = new Set(this.selectedValues);
    return this._options.map(option => ({ ...option,
      size: normalizeSize(option.size || this.size),
      selected: selectedSet.has(String(option.value))
    }));
  }

  get visibleOptions() {
    const query = String(this._searchValue || '').trim().toLowerCase();

    if (!query) {
      return this.options;
    }

    return this.options.filter(option => getOptionLabel(option).toLowerCase().includes(query));
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      open: this._open,
      multiple: this.multiple,
      value: this.hiddenValue,
      triggerText: this.triggerText,
      searchValue: this._searchValue,
      searchPlaceholder: this.searchPlaceholder,
      accessibleName: this.accessibleName(),
      selectedValues: this.selectedValues,
      selectedOptions: this.selectedOptions,
      options: this.visibleOptions,
      inheritedValue: this.inheritedValue,
      inheritedLabel: this.hasInheritedValue ? this.inheritedDisplayValue() : ''
    });
  } // The inherited-value seam. The value is the selection; what the inherited
  // value reads as is its options' labels, as a chosen value reads -- a machine
  // value in the field would be a value nobody can recognise.


  inheritedOwnValue() {
    return this.hiddenValue;
  }

  inheritedDisplayValue() {
    const options = this.options;
    return splitValues(this.inheritedValue).map(value => {
      const option = options.find(item => String(item.value) === value);
      return option ? getOptionLabel(option) : value;
    }).join(', ');
  } // The trigger is what a keyboard reaches and what names the field.


  inheritedFocusTarget() {
    return this.querySelector('.sf-dropdown-field > button');
  } // A reset is a change the person made: said as change, once, like removing
  // the last tag.


  clearOwnValue() {
    this._selectedValues = [];
    this.setAttributeValue('value', '');
    this.dispatchDropdownChange(null, []);
    this.requestComponentUpdate('reset-to-inherited');
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderDropdownTemplate)(this.templateContext());
  }

  beforeRender() {
    this.captureOptions();
  }

  afterRender() {
    const previousRoot = this._dropdownRoot;
    const previousList = this._list;
    this._dropdownRoot = this.querySelector('.sf-dropdown'); // Lit keeps references to this node even while the fallback projects it.

    this._list = this.querySelector('.sf-list') || (previousRoot === this._dropdownRoot ? previousList : null);
    if (previousList !== this._list) (0,_component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__.closeDropdownPortal)(previousList);
    this.syncDocumentListeners();
    this.syncPortalListeners();
    this.syncOpenSurfaceMark();
    this.positionPortalList();

    if (previousRoot !== this._dropdownRoot) {
      this._interaction?.release();
      this._interaction = null;
    }

    if (this._dropdownRoot && !this._interaction) {
      this._interaction = (0,_component_dropdown_interaction__WEBPACK_IMPORTED_MODULE_4__.createDropdownInteraction)(this._dropdownRoot, {
        owner: this,
        getList: () => this._list,
        isOpen: () => this._open,
        isDisabled: () => this.disabled,
        isMultiple: () => this.multiple,
        open: () => this.openDropdown(),
        close: () => this.closeDropdown(),
        select: item => this.selectValue(item.dataset.value || ''),
        selectedLabels: () => this.selectedOptions.map(getOptionLabel)
      });
    }

    this._interaction?.refresh();
    this.syncInheritedState();
    const resetControl = this.querySelector('.sf-dropdown-hidden-input') || this.querySelector('.sf-dropdown-field > button');

    if (this._resetControl !== resetControl) {
      this._releaseReset?.();
      this._resetControl = resetControl;
      this._releaseReset = resetControl ? (0,_component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__.bindFormReset)(resetControl, () => {
        this._interaction?.beforeClose();
        this._selectedValues = [...this._resetValues];
        this.setAttributeValue('value', serializeValues(this._selectedValues));
        this._open = false;
        this._searchValue = ''; // Native reset may change the display even when Lit's cached value has
        // not changed. The component owns this property synchronization.

        const display = this.querySelector('.sf-dropdown-field input:not([type="hidden"])');
        if (display) display.value = this.triggerText;
        this.requestComponentUpdate('reset');
      }) : null;
    }
  }

  onDisconnected() {
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__.holdOpenSurfaceMark)(this, false);
    (0,_component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__.closeDropdownPortal)(this._list);
    this._releaseReset?.();
    this._releaseReset = null;
    this._resetControl = null;
    this._interaction?.release();
    this._interaction = null;
    this.removeDocumentListeners();
    this.removePortalListeners();
    super.onDisconnected();
  }

  openDropdown() {
    if (this.disabled || this._open) return this;
    this._open = true;
    this.requestComponentUpdate('open');
    return this;
  }

  closeDropdown() {
    if (!this._open) return this;
    this._interaction?.beforeClose();
    this._open = false;
    this._searchValue = '';
    this.requestComponentUpdate('close');
    return this;
  }

  toggleDropdown() {
    if (this._open) {
      return this.closeDropdown();
    }

    return this.openDropdown();
  }

  handleTriggerClick(event) {
    if (this.disabled) return;
    event?.preventDefault?.();
    this.toggleDropdown();
  }

  handleSearchInput(event) {
    this._searchValue = event?.target?.value || '';
    this.requestComponentUpdate('search');
  }

  handleOptionClick(event) {
    if (this.disabled) return;
    const item = event.target?.closest?.('.sf-list-item');

    if (!item || !this.contains(item) && !this._list?.contains(item) || item.classList.contains('disabled')) {
      return;
    }

    event.preventDefault();
    this.selectValue(item.dataset.value || '');
  }

  handleOptionKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    this.handleOptionClick(event);
  }

  handleDocumentClick(event) {
    if (!this._open || this.contains(event.target) || this._list?.contains(event.target)) {
      return;
    }

    this.closeDropdown();
  }

  selectValue(value = '') {
    if (this.disabled) return this;
    const option = this.options.find(item => String(item.value) === String(value));

    if (!option || option.disabled) {
      return this;
    } // Picking the item already chosen changes nothing, so it sends no change --
    // as a native select does. It sent one per pick, the same value again.


    const unchanged = !this.multiple && this.selectedValues.length === 1 && this.selectedValues[0] === String(option.value);

    if (this.multiple) {
      const selected = new Set(this.selectedValues);

      if (selected.has(String(option.value))) {
        selected.delete(String(option.value));
      } else {
        selected.add(String(option.value));
      }

      this._selectedValues = Array.from(selected);
    } else {
      this._selectedValues = [String(option.value)];
    }

    const nextValues = [...this._selectedValues];
    this.setAttributeValue('value', serializeValues(nextValues));
    if (!unchanged) this.dispatchDropdownChange(option, nextValues);

    if (!this.multiple) {
      this._interaction?.beforeClose();
      this._open = false;
      this._searchValue = '';
    }

    this.requestComponentUpdate('select');
    return this;
  }

  removeSelectedValue(value = '') {
    if (this.disabled) return this;
    const selected = new Set(this.selectedValues);
    selected.delete(String(value));
    this._selectedValues = Array.from(selected);
    const nextValues = [...this._selectedValues];
    this.setAttributeValue('value', serializeValues(nextValues));
    this.dispatchDropdownChange(null, nextValues);
    this.requestComponentUpdate('remove-tag');
    return this;
  }

  dispatchDropdownChange(option = null, values = this.selectedValues) {
    const detail = {
      value: option?.value || '',
      label: option ? getOptionLabel(option) : '',
      values,
      item: option,
      root: this,
      multiple: this.multiple
    };
    this.dispatchEvent(new CustomEvent('sf-dropdown:change', {
      bubbles: true,
      composed: true,
      detail
    }));
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail
    }));
  } // An open list owns Escape, so the root says a surface is open and a drawer, a
  // modal or a record panel leaves that press alone -- they listen on the
  // document in capture and would otherwise close before the list saw the key.
  // Synced from the rendered state, because `_open` is set from several places
  // and every one of them ends in an update.


  syncOpenSurfaceMark() {
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__.holdOpenSurfaceMark)(this, this._open);
  }

  syncDocumentListeners() {
    if (this._open) {
      document.addEventListener('click', this._documentClickHandler);
      return;
    }

    this.removeDocumentListeners();
  }

  removeDocumentListeners() {
    document.removeEventListener('click', this._documentClickHandler);
  }

  syncPortalListeners() {
    if (this._open && this.portal) {
      window.addEventListener('resize', this._viewportHandler);
      document.addEventListener('scroll', this._viewportHandler, true);
      return;
    }

    this.removePortalListeners();
  }

  removePortalListeners() {
    window.removeEventListener('resize', this._viewportHandler);
    document.removeEventListener('scroll', this._viewportHandler, true);
  }

  positionPortalList() {
    if (!this._list || !this._dropdownRoot || !this.portal || !this._open) {
      (0,_component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__.closeDropdownPortal)(this._list);
      return;
    }

    (0,_component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__.openDropdownPortal)(this._dropdownRoot, this._list, () => this.closeDropdown());
  } // The selected machine value, as the manifest declares it: a string, values
  // joined by commas for a multiple selection. It used to return every template
  // setting as an object, so `dropdown.value` was never the value (documentation
  // trial, 2026-10-12).


  get value() {
    return this.hiddenValue;
  } // A string or an array selects; an object still sets attributes, as it did.


  set value(nextValue) {
    if (nextValue && typeof nextValue === 'object' && !Array.isArray(nextValue)) {
      this.setValueAttributes(nextValue);
      return;
    }

    const values = Array.isArray(nextValue) ? nextValue.map(String) : splitValues(nextValue == null ? '' : String(nextValue));
    this.setAttributeValue('value', serializeValues(values));
  }

}

SfDropdown.define('sf-dropdown');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5429d6e80991"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderDropdownTemplate: () => (/* binding */ renderDropdownTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c22590307c6c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__, _list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__, _list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);




function getOptionLabel(option = {}) {
  if (option.type === "avatar") return option.avatarTitle || option.text || option.value || "";
  return option.text || option.avatarTitle || option.value || "";
} // Options may say where they come from. A list of a few dozen names is read by
// its stretches rather than line by line, and the name of a stretch belongs
// above it once instead of after every name in it.


function renderOptions(options = [], multiple = false) {
  const parts = [];
  let group = null;

  for (const option of options) {
    const next = option.group ? String(option.group) : "";

    if (next !== group) {
      group = next;
      if (next) parts.push((0,_list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderListItemHeading)(next, option.size));
    } // Where several options may be chosen, each one carries the box that says
    // so: a plain row said it was chosen with a class and aria-selected alone,
    // so on a long list nothing on screen told the person what they had picked
    // (Larena storage QA, 2026-10-22). An option that draws a picture of its
    // own -- an icon, a colour, an avatar -- keeps it, because that is the
    // place the box would take.


    const withBox = multiple && (!option.type || option.type === "text");
    parts.push((0,_list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderListItemOption)(withBox ? { ...option,
      type: "checkbox"
    } : option));
  }

  return parts;
} // From size 1 up the field has room for a compact tag of its own size, with the
// field's own text. Size 1/2 does not (one pixel would be left), so its tag
// goes one size down onto the field line, rendered inline: its label is one
// text step down and it takes no block padding.


const FIELD_TAG = Object.freeze({
  "1/2": {
    size: "1/3",
    spacing: ""
  },
  "1": {
    size: "1",
    spacing: "compact"
  },
  "2": {
    size: "2",
    spacing: "compact"
  }
}); // A single choice shows its picture in the field as well as its label.

function renderFieldVisual(context) {
  if (context.multiple || context.selectedOptions?.length !== 1) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const option = context.selectedOptions[0];

  if (option.type === "icon" && option.icon) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-dropdown-field-visual" aria-hidden="true">${option.icon}</i>`;
  }

  if (option.type === "color" && option.colorClass) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tag-color-icon sf-dropdown-field-visual ${option.colorClass}" aria-hidden="true"></span>`;
  }

  if (option.type === "avatar" && option.avatarImageUrl) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar sf-avatar--size-1/2 bg-cover sf-dropdown-field-visual" aria-hidden="true" style=${`background-image: url(${option.avatarImageUrl});`}></span>`;
  }

  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderTag(context, option) {
  const label = getOptionLabel(option);
  const fieldTag = FIELD_TAG[context.size] || FIELD_TAG["1"];
  const tagSize = fieldTag.size;
  const tagSpacing = fieldTag.spacing ? ` spacing-${fieldTag.spacing}` : "";
  const tagType = option.type === "color" ? "color" : option.type === "avatar" ? "avatar" : "icon";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class="sf-tag transition sf-tag--${tagType} sf-tag--size-${tagSize} sf-tag--inline${tagSpacing} flex flex-row flex-nowrap items-center active"
      data-value=${option.value}
    >
      ${option.type === "color" ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tag-color-icon ${option.colorClass}" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${option.type === "icon" ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-tag-icon" aria-hidden="true">${option.icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${option.type === "avatar" ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span
              class="sf-avatar sf-avatar--size-${tagSize} bg-cover"
              aria-hidden="true"
              style=${option.avatarImageUrl ? `background-image: url(${option.avatarImageUrl});` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ></span>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <span class="sf-tag-container">${label}</span>
      <button
        type="button"
        class="sf-icon-button sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3"
        aria-label=${`Remove ${label}`}
        ?disabled=${context.disabled}
        @click=${event => {
    event.preventDefault();
    event.stopPropagation();
    context.component.removeSelectedValue(option.value);
  }}
      >
        <div class="sf-close sf-close--size-1/3 flex">
          <div class="sf-close-icon"></div>
        </div>
      </button>
    </div>
  `;
} // A grid cell is as tall as a field of the dropdown's size: a size-1/2 icon
// picker drew size-1 cells around its size-1/2 search (owner, 2026-10-14).


const CELL = {
  "1/2": "var(--sf-ui-1\\/2--control-height)",
  "1": "var(--sf-ui-1--control-height)",
  "2": "var(--sf-ui-2--control-height)"
};
function renderDropdownTemplate(context) {
  const rootClasses = ["sf-dropdown", context.rootClass, context.open ? "open" : "", context.open ? "sf-dropdown--open" : "", `sf-dropdown--size-${context.size}`, `sf-dropdown--${context.appearance ?? context.type}`, context.mode === "tag" ? "sf-dropdown--tag" : "", context.layout === "grid" ? "sf-dropdown--grid" : "", context.mode !== "tag" ? "sf-dropdown--text" : "", context.disabled ? "disabled" : "", "flex", "flex-col"].filter(Boolean);
  const fieldClasses = ["sf-dropdown-field", !context.disabled ? "cursor-pointer" : "", "items-cross-center", "relative", "transition", "flex"].filter(Boolean);
  const iconButtonSize = context.size === "1" || context.size === "1/2" ? "1/2" : context.size;
  const listInputSize = context.size;
  const dropdownIcon = context.open ? "keyboard_arrow_up" : "keyboard_arrow_down";

  const renderTrigger = () => {
    // A trigger the consumer supplied. The dropdown's own is a field -- a
    // border, the text of what is chosen, a chevron -- and there are places
    // that want the same list behind something else: a «+» in the head of a
    // group, a glyph, a plain button. Without this seam a consumer had to
    // either show a field where an icon belongs or hide one with styles of its
    // own, which is working around the component rather than using it.
    if (context.component?.hasSlotContent?.('trigger')) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-dropdown-trigger flex items-cross-center"
          @click=${event => context.component.handleTriggerClick(event)}
        >
          ${context.name ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <input
                  class="sf-dropdown-hidden-input"
                  type="hidden"
                  name=${context.name}
                  value=${context.value || ""}
                  ?disabled=${context.disabled}
                />
              ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ${context.component.getSlotContent('trigger')}
        </div>
      `;
    }

    const hiddenInput = context.name ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <input
            class="sf-dropdown-hidden-input"
            type="hidden"
            name=${context.name}
            value=${context.value || ""}
            ?disabled=${context.disabled}
          />
        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

    if (context.mode === "tag") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class=${fieldClasses.join(" ")}
          @click=${event => context.component.handleTriggerClick(event)}
        >
          ${hiddenInput}
          <div class="sf-dropdown-tag-container flex flex-wrap flex-1">
            ${context.selectedOptions.map(option => renderTag(context, option))}
          </div>
          <button
            type="button"
            class="sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${iconButtonSize}"
            ?disabled=${context.disabled}
          >
            <i class="sf-icon" aria-hidden="true">${dropdownIcon}</i>
          </button>
        </div>
      `;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <label
        class=${fieldClasses.join(" ")}
        @click=${event => context.component.handleTriggerClick(event)}
      >
        ${hiddenInput}
        ${renderFieldVisual(context)}
        <input
          placeholder=${context.inheritedLabel || context.placeholder}
          type="text"
          class="cursor-pointer"
          aria-label=${context.accessibleName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          .value=${context.triggerText || ""}
          readonly
          ?disabled=${context.disabled}
        />
        ${(0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__.renderInheritedSlot)(context.component, {
      size: context.size,
      disabled: context.disabled
    })}
        <button
          type="button"
          class="sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${iconButtonSize} absolute"
          ?disabled=${context.disabled}
        >
          <i class="sf-icon" aria-hidden="true">${dropdownIcon}</i>
        </button>
      </label>
    `;
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses.join(" ")}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${context.disabled}
      ?multiple=${context.multiple}
      ?portal=${context.portal}
      data-portal=${context.portal ? "true" : "false"}
    >
      ${context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-dropdown-label flex">
              <span class="sf-dropdown-text">${context.label}</span>
              ${context.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-dropdown-required">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </span>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${renderTrigger()}

      <div
        class=${`sf-list flex flex-col${context.component?.hasSlotContent?.('trigger') ? " sf-list--free-width" : ""}`}
        style=${`--sf-list--cell: ${CELL[context.size] || CELL["1"]}`}
        ?hidden=${!context.open}
      >
        ${context.search ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <label
                class="sf-input sf-input--size-${listInputSize} sf-input--filled flex flex-col"
              >
                <span class="sf-input-field items-cross-center transition flex">
                  <input
                    placeholder=${context.searchPlaceholder}
                    aria-label=${context.searchPlaceholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    type="text"
                    .value=${context.searchValue || ""}
                    ?disabled=${context.disabled}
                    @input=${event => context.component.handleSearchInput(event)}
                    @change=${event => event.stopPropagation()}
                    @click=${event => event.stopPropagation()}
                  />
                  <i class="sf-icon sf-icon-hint" aria-hidden="true">search</i>
                </span>
              </label>
            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class="sf-list-container-wrap">
          <div
            class=${`sf-list-container flex flex-col${context.layout === "grid" ? " sf-list-container--grid" : ""}`}
            style=${context.layout === "grid" ? `--sf-list-container--columns:${context.columns};` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            @click=${event => context.component.handleOptionClick(event)}
            @keydown=${event => context.component.handleOptionKeydown(event)}
          >
            ${renderOptions(context.options, context.multiple)}
          </div>
        </div>
      </div>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "778671c79fa6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INHERITED_RESET_EVENT: () => (/* binding */ INHERITED_RESET_EVENT),
/* harmony export */   INHERITED_TEXT: () => (/* binding */ INHERITED_TEXT),
/* harmony export */   InheritedValueField: () => (/* binding */ InheritedValueField),
/* harmony export */   inheritedStepDown: () => (/* binding */ inheritedStepDown),
/* harmony export */   renderInheritedSlot: () => (/* binding */ renderInheritedSlot)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _inherited_value_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c6c9dfe31af4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);


 // An inherited value, for every field of the input family (simai/ui-source#28).
//
// A setting whose empty value means «use what the parent says» -- a letter's
// colour from the brand, a page's font from the theme -- has two states a field
// must tell apart: «not set, so the parent's value applies» and «set, to
// something that may even equal it». Only the first follows the parent when the
// parent changes. A placeholder alone draws the first as if it were a value
// (ui-mail polish audit B2, P-15), and there was no way back to it once a
// person had typed.
//
// So a field that opts in takes `inherited-value`: while it holds no value of
// its own it shows that value in the placeholder ink with a small «inherited»
// marker, and the form gets an empty value. Once it holds a value of its own,
// the marker gives way to a reset button that empties the field again. The
// record views of package larena already draw a field's `inheritedValue` this
// way (property-view port 1.8.0 and later); this is the same state on the
// controls themselves, so a record view can hand it down rather than draw it
// beside them.
//
// Written once here and opted into by each control, which says only what its
// own value is, how to empty it and what takes focus: sf-input, sf-textarea,
// sf-dropdown, sf-color and sf-switch.

const INHERITED_RESET_EVENT = 'sf-field:reset'; // The marker and the reset, in the page's language. A product names its own
// words with `inherited-text` and `reset-label`, or registers a language.

const INHERITED_TEXT = {
  en: {
    inherited: 'inherited',
    reset: 'Reset to inherited',
    described: 'Inherited: {value}'
  },
  ru: {
    inherited: 'наследуется',
    reset: 'Сбросить к наследуемому',
    described: 'Наследуется: {value}'
  }
}; // Each control declares the three in its own props -- inherited-value,
// inherited-text and reset-label -- written out rather than spread from here, so
// the manifest check that reads a component's props sees them.
// The marker and the reset are one step down the ladder from the field they
// sit in, so they fit inside its box: a size 1 field (40px) holds a size 1/2
// button (32px) with the same inset on every side.

const STEP_DOWN = Object.freeze({
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
});
const inheritedStepDown = size => STEP_DOWN[String(size)] || '1/2';
/**
 * The mixin a control opts in with. The control supplies:
 *   - `inheritedOwnValue()` -- its own value as a string, '' when it has none;
 *   - `clearOwnValue()` -- empties it, firing the control's own input/change;
 *   - `inheritedFocusTarget()` -- the element that takes focus after a reset;
 * and may override `inheritedDisplayValue()` (what the inherited value reads
 * as -- a dropdown shows the option's label, not its machine value).
 */

const InheritedValueField = Base => class extends Base {
  constructor() {
    super(); // Typing changes the state without a redraw: the native field holds the
    // text, and redrawing on every key would fight it.

    this.__sfInheritedSync = () => this.syncInheritedState();

    this.addEventListener('input', this.__sfInheritedSync);
    this.addEventListener('change', this.__sfInheritedSync);
  }

  get inheritedValue() {
    return this.getAttribute('inherited-value') || '';
  }

  set inheritedValue(next) {
    if (next === null || next === undefined || next === '') this.removeAttribute('inherited-value');else this.setAttribute('inherited-value', String(next));
  }

  get inheritedText() {
    return this.getAttribute('inherited-text') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'inherited', this);
  }

  get resetLabel() {
    return this.getAttribute('reset-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'reset', this);
  }

  get hasInheritedValue() {
    return this.inheritedValue !== '';
  } // True while the field holds nothing of its own and the inherited value
  // applies. False without an inherited value: an empty field is then empty.


  get isInherited() {
    return this.hasInheritedValue && this.inheritedOwnValue() === '';
  }

  inheritedOwnValue() {
    return String(this.value ?? '');
  }

  inheritedDisplayValue() {
    return this.inheritedValue;
  }

  inheritedFocusTarget() {
    return null;
  }

  clearOwnValue() {
    this.value = '';
  } // What a screen reader hears beside the name while the value is inherited.


  inheritedDescription() {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'described', this).replace('{value}', this.inheritedDisplayValue());
  }
  /**
   * Back to the inherited value. Fires `sf-field:reset` first, cancellable:
   * a host that must confirm or refuse calls preventDefault and nothing
   * changes. Returns whether the field was reset.
   */


  resetToInherited() {
    if (!this.hasInheritedValue || this.inheritedOwnValue() === '') return false;
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return false;
    const event = new CustomEvent(INHERITED_RESET_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        value: this.inheritedOwnValue(),
        inheritedValue: this.inheritedValue,
        name: this.getAttribute('name') || ''
      }
    });
    if (!this.dispatchEvent(event)) return false;
    this.clearOwnValue();
    this.syncInheritedState(); // The button that was pressed is gone, so focus goes where the person
    // works: the control itself. Left on a hidden button, it would fall to the
    // page and a keyboard user would start over from the top.

    const focus = () => this.inheritedFocusTarget()?.focus?.({
      preventScroll: true
    });

    focus();
    if (!this.contains(document.activeElement)) requestAnimationFrame(focus);
    return true;
  } // The state, drawn without a redraw: the host says it, the marker and the
  // reset swap, and the control carries the description. Each control calls it
  // at the end of its own afterRender, which the controls override without
  // calling up, so the mixin cannot hook it for them.


  syncInheritedState() {
    if (!this.hasInheritedValue && !this.__sfInheritedDescribed) {
      this.removeAttribute('data-inherited');
      return;
    }

    const inherited = this.isInherited;
    const own = this.hasInheritedValue && !inherited;
    if (inherited) this.setAttribute('data-inherited', 'true');else this.removeAttribute('data-inherited');
    this.querySelectorAll(':scope [data-inherited-marker]').forEach(node => {
      node.hidden = !inherited;
    });
    this.querySelectorAll(':scope [data-inherited-reset]').forEach(node => {
      node.hidden = !own;
    });
    const control = this.inheritedFocusTarget();
    if (!control) return;

    if (inherited) {
      control.setAttribute('aria-description', this.inheritedDescription());
      this.__sfInheritedDescribed = control;
    } else if (this.__sfInheritedDescribed === control) {
      control.removeAttribute('aria-description');
      this.__sfInheritedDescribed = null;
    }
  }

};
/**
 * The marker and the reset, for a control's trailing slot. Nothing at all
 * without an inherited value, so a field that does not use it is unchanged.
 */

function renderInheritedSlot(component, {
  size = '1',
  disabled = false,
  className = ''
} = {}) {
  if (!component?.hasInheritedValue) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const step = inheritedStepDown(size);
  const inherited = component.isInherited;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-field-inherited-slot sf-field-inherited-slot--size-${size} flex items-cross-center ${className}">
      <span class="sf-field-inherited sf-field-inherited--size-${step}"
            data-inherited-marker
            aria-hidden="true"
            ?hidden=${!inherited}>${component.inheritedText}</span>
      <button
        type="button"
        class="sf-field-reset sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${step}"
        data-inherited-reset
        aria-label=${component.resetLabel}
        title=${component.resetLabel}
        ?hidden=${inherited}
        ?disabled=${disabled}
        @click=${event => {
    // Inside a field's <label>, a press would also reach the control the
    // label is for -- a dropdown would open, a switch would flip.
    event.preventDefault();
    event.stopPropagation();
    component.resetToInherited();
  }}
      ><i class="sf-icon" aria-hidden="true">restart_alt</i></button>
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c22590307c6c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   optionSizeGroup: () => (/* binding */ optionSizeGroup),
/* harmony export */   renderListItemHeading: () => (/* binding */ renderListItemHeading),
/* harmony export */   renderListItemOption: () => (/* binding */ renderListItemOption),
/* harmony export */   renderListItemTemplate: () => (/* binding */ renderListItemTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The mark in a row's box is bound as a property, not as an attribute. A press
// anywhere in the row reaches the label that holds this input and flips its live
// `checked`, after which the attribute controls nothing: a row unticked by its
// owner went on showing a tick, with the row's own highlight gone from under it.

function renderListItemTemplate(context) {
  const isOption = context.option === true;
  const textContent = context.component?.hasSlotContent?.("text") ? context.component.getSlotContent("text") : context.text;
  const leadingContent = context.component?.hasSlotContent?.("leading") ? context.component.getSlotContent("leading") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const trailingContent = context.component?.hasSlotContent?.("trailing") ? context.component.getSlotContent("trailing") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // A general list row (simai/ui-source#18): a second, supporting line under
  // the title; a row a person acts on (interactive); a row of an sf-sortable
  // list, which carries the list's item id and a drag handle, or is pinned and
  // carries neither. None of these exist for an option, which Dropdown owns.

  const supportingContent = !isOption && context.component?.hasSlotContent?.("supporting") ? context.component.getSlotContent("supporting") : !isOption && context.supporting || lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const twoLine = supportingContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const sortableItem = !isOption && !context.pinned ? context.sortableItem || "" : "";
  const handleSlot = !isOption && Boolean(context.sortableItem || context.pinned);
  const roving = !isOption && Boolean(context.interactive || sortableItem);
  const classes = ["sf-list-item", "flex", "items-cross-center", `sf-list-item--${context.kind ?? context.type}`, `sf-list-item--size-${context.size}`, isOption ? "cursor-pointer" : "", context.selected ? "selected" : "", context.disabled ? "disabled" : "", twoLine ? "sf-list-item--two-line" : "", !isOption && context.interactive ? "sf-list-item--interactive" : "", handleSlot ? "sf-list-item--sortable" : "", !isOption && context.pinned ? "sf-list-item--pinned" : "", context.rootClass].filter(Boolean);
  const wrapClasses = ["sf-list-item-wrap", "flex", "flex-1"];
  const isDecoratedType = ["icon", "checkbox", "avatar", "color"].includes(context.type);

  if (isDecoratedType) {
    wrapClasses.push("flex", "flex-row", "flex-nowrap", "items-center", "gap-2");
  }

  if (context.type === "avatar" || context.type === "color") {
    wrapClasses.splice(wrapClasses.indexOf("gap-2"), 1);
    wrapClasses.push("justify-between", "gap-2");
  }

  const renderLeading = () => {
    if (leadingContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) return leadingContent;

    if (context.type === "icon") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${context.icon}</i>`;
    }

    if (context.type === "checkbox") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <label
          class="sf-checkbox sf-checkbox--size-${context.sizeGroup.checkbox} flex"
          aria-hidden="true"
        >
          <span class="sf-checkbox-box flex">
            <input
              .checked=${Boolean(context.checked || context.selected)}
              ?disabled=${context.disabled}
              tabindex="-1"
              type="checkbox"
            />
            <span class="sf-icon" aria-hidden="true"></span>
          </span>
        </label>
      `;
    }

    if (context.type === "avatar") {
      const avatarClasses = ["sf-avatar", `sf-avatar--size-${context.sizeGroup.item === "1/3" || context.sizeGroup.item === "1/2" ? "1/3" : context.sizeGroup.item === "1" ? "1/2" : context.sizeGroup.item === "2" ? "1" : "2"}`, "bg-cover", context.disabled ? "disabled" : ""].filter(Boolean);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-avatar-label-group sf-avatar-label-group--size-${context.sizeGroup.avatarGroup} flex items-cross-center"
        >
          <span
            class=${avatarClasses.join(" ")}
            aria-hidden="true"
            style=${context.avatarImageUrl ? `background-image: url(${context.avatarImageUrl});` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ></span>
          <div class="sf-avatar-label-group-container flex flex-col">
            <div class="sf-avatar-label-group-title">
              ${context.avatarTitle}
            </div>
          </div>
        </div>
      `;
    }

    if (context.type === "color") {
      const tagClasses = ["sf-tag", "sf-tag--color", `sf-tag--size-${context.sizeGroup.colorTag}`, "flex", "flex-row", "flex-nowrap", "items-center", "flex-1", context.disabled ? "disabled" : ""].filter(Boolean);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class=${tagClasses.join(" ")}>
          <span class="sf-tag-color-icon ${context.colorClass}" aria-hidden="true"></span>
          <span class="sf-tag-container">${textContent}</span>
        </div>
      `;
    }

    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  };

  const renderText = () => {
    if (context.type === "color") return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    if (context.type === "avatar") return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

    if (twoLine) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-item-container"><span class="sf-list-item-title">${textContent}</span><span class="sf-list-item-supporting">${supportingContent}</span></div>`;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-item-container">${textContent}</div>`;
  }; // The handle stands in a slot of its own before everything else; a pinned
  // row keeps the slot empty, so its text starts where its neighbours' does.


  const renderHandle = () => {
    if (!handleSlot) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-item-handle" ?data-sf-sortable-handle=${Boolean(sortableItem)} aria-hidden="true">${sortableItem ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
  };

  const renderTrailing = () => {
    if (trailingContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) return trailingContent;

    if (context.type === "avatar" || context.type === "color") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <label
          class="sf-checkbox sf-checkbox--size-${context.sizeGroup.checkbox} flex"
          aria-hidden="true"
        >
          <span class="sf-checkbox-box flex">
            <input
              .checked=${Boolean(context.checked || context.selected)}
              ?disabled=${context.disabled}
              tabindex="-1"
              type="checkbox"
            />
            <span class="sf-icon" aria-hidden="true"></span>
          </span>
        </label>
      `;
    }

    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${classes.join(" ")}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role=${isOption ? "option" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      tabindex=${isOption ? "-1" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${isOption ? context.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${isOption || roving ? context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      title=${isOption ? context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${(isOption || roving) && context.disabled ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-selected=${isOption ? context.selected ? "true" : "false" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-sortable-item=${sortableItem || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?data-sf-list-roving=${roving}
      aria-current=${roving && context.selected ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      ${renderHandle()}
      <div class=${wrapClasses.join(" ")}>
        ${renderLeading()} ${renderText()} ${renderTrailing()}
      </div>
    </div>
  `;
} // A row in a listbox, which is what an option is: the same row, told that it
// takes a place in a list, so it carries the listbox roles and answers a
// pointer. The dropdown built this inline and nothing else could, which is why
// a multi-select list outside a dropdown had to be hand-made out of checkboxes.

function renderListItemOption(option = {}) {
  const size = String(option.size || "1");
  return renderListItemTemplate({
    component: {
      hasSlotContent: () => false,
      getSlotContent: () => lit__WEBPACK_IMPORTED_MODULE_0__.nothing
    },
    templateName: "default",
    type: option.type || "text",
    kind: option.kind || option.type || "text",
    size,
    sizeGroup: optionSizeGroup(size),
    text: option.text,
    icon: option.icon,
    checked: option.checked || option.selected,
    selected: option.selected,
    disabled: option.disabled,
    value: option.value,
    colorClass: option.colorClass,
    avatarImageUrl: option.avatarImageUrl,
    avatarTitle: option.avatarTitle,
    ariaLabel: option.ariaLabel,
    option: true
  });
} // What a list says about itself between its rows. A long list of names needs to
// say where each stretch of it comes from; written into every row instead, the
// origin was repeated on every line and the name it mattered for was pushed off
// the end.

function renderListItemHeading(text, size = "1") {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="sf-list-heading sf-list-heading--size-${size}" role="presentation">
      <span class="sf-list-heading-container">${text}</span>
    </div>
  `;
} // The sizes a row's own parts take beside it. A checkbox and an avatar do not
// have the row's whole ladder, so each lands on the nearest step it has.

function optionSizeGroup(value) {
  const size = String(value || "1");

  if (size === "1/3" || size === "1/2") {
    return {
      item: size,
      checkbox: (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.nearestFieldSize)(size),
      avatarGroup: "1/2",
      colorTag: "1/2"
    };
  }

  return {
    item: size,
    checkbox: (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.nearestFieldSize)(size),
    avatarGroup: size,
    colorTag: "1"
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c6c9dfe31af4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "5c1dc214bb5e"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("position")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("50a1017ded91");
/******/
/******/ })()
;