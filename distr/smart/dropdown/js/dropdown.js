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
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("695f21e50358");
 // Option checkboxes are selection indicators, not independent form controls.
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
} // A part's id is its owner's path id and its local name (standard 1.3.8
// §7.1.1, simai/ui-source#41): <path>--<local>, the same in every bundle and
// in server markup. A module counter gave a class and a Smart dropdown on one
// page ids that followed creation order.

function identify(node, owner, local) {
  if (!node.id) node.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.instancePath)(owner, {
    kind: 'sf-dropdown'
  }), local);
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

  const owner = adapter.owner || root;
  let summary = document.createElement('span');
  summary.className = 'sf-dropdown-value';
  root.append(summary);
  identify(summary, owner, 'value');

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
    const labelId = label?.textContent.trim() ? identify(label, owner, 'label') : '';
    const ownerLabel = owner.getAttribute('aria-label') || root.getAttribute('aria-label');
    const ownerRefs = owner.getAttribute('aria-labelledby') || root.getAttribute('aria-labelledby');
    const buttonId = identify(button, owner, 'trigger');
    const authorButtonLabel = button.hasAttribute('aria-label') && assigned.get(button)?.['aria-label'] !== button.getAttribute('aria-label');
    own(button, 'aria-labelledby', ownerRefs || (!ownerLabel && labelId ? authorButtonLabel ? `${buttonId} ${labelId}` : labelId : ''));
    own(button, 'aria-label', ownerLabel);
    if (button.tagName !== 'BUTTON') button.setAttribute('role', 'button');
    button.tabIndex = adapter.isDisabled() ? -1 : 0;
    button.setAttribute('aria-expanded', String(adapter.isOpen()));
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-controls', identify(container, owner, 'listbox'));
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

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable)
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
}

/***/ },

/***/ "28b603686dcc"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aliasExpired: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired),
/* harmony export */   aliasesOf: () => (/* binding */ aliasesOf),
/* harmony export */   aliasesStrict: () => (/* binding */ aliasesStrict),
/* harmony export */   dispatchAliased: () => (/* binding */ dispatchAliased),
/* harmony export */   installAliases: () => (/* binding */ installAliases),
/* harmony export */   readAliasTable: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable),
/* harmony export */   setAliasClock: () => (/* binding */ setAliasClock),
/* harmony export */   uninstallAliases: () => (/* binding */ uninstallAliases)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
// Dated aliases on an element (standard simai.smart-component 1.3.8 §16.20,
// §8, §16 items 6, 7, 13, 26, 32, 41; vocabulary 1.1.5 §9). When a component
// renames an event, a setting, an attribute, an action or a value, the old
// name keeps working until its `remove_after` day, and each use of it is
// noted in SF.deprecations with its dates, so a person, a probe or an AI can
// read off a running page which old names it still leans on.
//
//   const handle = SF.aliases.install(element, table, {signal});
//   SF.aliases.dispatch(element, 'sf-menu-navigate', {detail, cancelable: true});
//   handle.uninstall();   // or abort `signal`
//
// The table is a component's aliases.json (core/js/alias-table.js reads it).
// What an installed element does:
//
// Events.
//   - One dispatch sends the new name first, then each open old name, with
//     the same `detail` object and the same bubbles / composed / cancelable.
//   - Cancel is shared: preventDefault() on any of them cancels all at once,
//     so a listener that runs later on the other name already sees
//     defaultPrevented, and the dispatch answers false.
//   - stopPropagation() is not shared: the names have different listeners.
//   - It works for today's components without a change in them: the element's
//     own dispatchEvent is wrapped, so a component that still sends the old
//     name (sf-accordion:toggle) sends the new one first through the shim, and
//     a component that sends the new name has the old ones follow. The event
//     object the component made is the one dispatched under its name, so a
//     component that reads its own event's defaultPrevented sees the shared
//     cancel.
//   - A use is a listener that touches the old event (its detail, target,
//     currentTarget, composedPath, preventDefault or the stop methods). It is
//     noted once per dispatch, into one record per name. An old event that
//     nobody listens to is not a use, so a page that moved is not reported.
//     No global prototype is patched to learn this.
//   - `detail-adds` sends the new, larger detail to the old name too: the old
//     fields are all there. `when` sends an old name only for a matching
//     detail (two old names folded into one new name). `split` needs an
//     adapter that makes the old detail from the new one; without it the row
//     is refused. A component that sends the old name of a `detail-adds` or
//     `split` row is not promoted: its old detail cannot make the new one.
//
// Settings and attributes. Writing the old attribute writes the new one (the
// component hears the new one); writing the new one updates the old one when
// the page still has it, so getAttribute(old) stays true. Equal values are
// never written again, which is what ends a round. A setting also gets its
// property: the old property reads and writes the new one.
//
// Actions. The old method calls the new one with the same arguments.
//
// Values. An attribute set to an old value is written with the new one.
//
// A name that the browser's own element owns (title, blur, spellcheck,
// remove, …) is not shadowed as a property or a method unless the component
// already overrides it: the attribute alias still works.
//
// Expiry (decision, §16.20 "after that date the old name is expired"). After
// `remove_after` an old name is `expired`: it is still delivered in 1.x, its
// record carries `expired: true` and a console warning is printed once
// whatever the page opted into. A date passing in a running page must not
// break it between two deploys, and dropping a name inside a major is the
// sweep's job: the release that deletes the row is the removal, under the
// change journal. A page or a host that wants to rehearse the sweep sets
// strict mode, <html data-sf-aliases="strict"> or SF.aliases.strict = true:
// an expired old name is then not delivered — its events are not sent, its
// attribute is not mapped, its property reads undefined, its method throws.
//
// Every bundle carries its own copy of this module, so all state lives on the
// shared global (SF.__aliases, not enumerable) and the first copy's API stays
// on SF.aliases; nothing else is added to the page. Per element state is in a
// WeakMap, the wrappers are own properties of the element and leave with
// uninstall(), and the only listener is on the caller's AbortSignal, itself
// removed by an AbortController of the install.



const VERSION = 1;
const WRAPPED = ['dispatchEvent', 'setAttribute', 'removeAttribute', 'toggleAttribute'];
const TOUCH_GETTERS = ['detail', 'target', 'currentTarget', 'srcElement'];
const TOUCH_METHODS = ['composedPath', 'preventDefault', 'stopPropagation', 'stopImmediatePropagation'];

function shared() {
  const SF = globalThis.SF = globalThis.SF || {};

  if (!SF.__aliases || typeof SF.__aliases !== 'object') {
    Object.defineProperty(SF, '__aliases', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: {
        elements: new WeakMap(),
        ours: new WeakSet(),
        now: () => Date.now()
      }
    });
  }

  return SF.__aliases;
} // A test or a sweep rehearsal sets the clock; null puts the real one back.


function setAliasClock(clock) {
  shared().now = typeof clock === 'function' ? clock : () => Date.now();
}
function aliasesStrict() {
  return globalThis.document?.documentElement?.dataset?.sfAliases === 'strict' || globalThis.SF?.aliases?.strict === true;
}

function life(row) {
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, shared().now());
  return {
    expired,
    usable: !expired || !aliasesStrict()
  };
}

function note(row, expired) {
  const attribute = row.kind === 'value' ? row.setting : row.kind === 'setting' || row.kind === 'attribute' ? row.from : '';
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.tag,
    tag: row.tag,
    kind: row.kind,
    attribute,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    ...(expired ? {
      expired: true
    } : {})
  });
} // --- events ---------------------------------------------------------------


const eventGet = name => Object.getOwnPropertyDescriptor(globalThis.Event.prototype, name)?.get;

const nativePrevent = () => globalThis.Event.prototype.preventDefault;

function flagsOf(event) {
  return {
    bubbles: eventGet('bubbles').call(event),
    cancelable: eventGet('cancelable').call(event),
    composed: eventGet('composed').call(event)
  };
}

function detailOf(event) {
  const get = globalThis.CustomEvent && Object.getOwnPropertyDescriptor(globalThis.CustomEvent.prototype, 'detail')?.get;
  return get && event instanceof globalThis.CustomEvent ? get.call(event) : null;
}

function matches(detail, when) {
  if (!when) return true;
  if (!detail || typeof detail !== 'object') return false;
  return Object.entries(when).every(([field, value]) => detail[field] === value);
}

function makeEvent(element, type, detail, flags) {
  const Custom = element.ownerDocument?.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  return new Custom(type, { ...flags,
    detail
  });
} // The first touch of an old event by a listener is a use of the old name.


function instrument(event, row, expired, detail) {
  let used = false;

  const use = () => {
    if (used) return;
    used = true;
    note(row, expired);
  };

  for (const name of TOUCH_GETTERS) {
    const get = name === 'detail' ? () => detail : eventGet(name);
    if (!get) continue;
    Object.defineProperty(event, name, {
      configurable: true,

      get() {
        use();
        return get.call(this);
      }

    });
  }

  for (const name of TOUCH_METHODS) {
    const method = event[name];
    if (typeof method !== 'function') continue;
    Object.defineProperty(event, name, {
      configurable: true,
      writable: true,

      value(...args) {
        use();
        return method.apply(this, args);
      }

    });
  }
}

function shareCancel(events) {
  const cancel = nativePrevent();

  for (const event of events) {
    Object.defineProperty(event, 'preventDefault', {
      configurable: true,
      writable: true,

      value() {
        for (const one of events) cancel.call(one);
      }

    });
  }
} // The old events that go with one new event: open (or expired outside strict)
// rows whose `when` matches, made from the same detail, or from the adapter's
// detail for a split row. `own` is the component's own event when it sent an
// old name: it is reused under that name.


function oldEventsFor(state, element, newType, detail, flags, own) {
  const out = [];
  const names = new Set();

  for (const row of state.byNew.get(newType) ?? []) {
    if (names.has(row.from) || !matches(detail, row.when)) continue;
    const {
      expired,
      usable
    } = life(row);
    if (!usable) continue;
    let oldDetail = detail;

    if (row.mode === 'split') {
      oldDetail = state.adapters[row.from]?.(detail, newType);
      if (oldDetail === undefined) continue;
    }

    names.add(row.from);
    const event = own && own.type === row.from && oldDetail === detail ? own : makeEvent(element, row.from, oldDetail, flags);
    out.push({
      event,
      row,
      expired,
      detail: oldDetail
    });
  }

  return out;
} // Sends the new event, then the old ones, with one cancel. The cancel is
// shared first and the old events instrumented after, so a listener's
// preventDefault() on an old name both cancels all and counts as a use.


function deliver(state, element, first, olds, alsoCancel = []) {
  const ours = shared().ours;
  const events = [first, ...olds.map(one => one.event)];
  const all = [...events, ...alsoCancel.filter(event => !events.includes(event))];
  if (all.some(event => eventGet('cancelable').call(event))) shareCancel(all);

  for (const one of olds) instrument(one.event, one.row, one.expired, one.detail);

  for (const event of events) {
    ours.add(event);
    state.native.dispatchEvent.call(element, event);
  }

  const prevented = eventGet('defaultPrevented');
  return !all.some(event => prevented.call(event));
}

function wrappedDispatch(state, element, event) {
  const native = state.native.dispatchEvent;
  if (!event || shared().ours.has(event)) return native.call(element, event);
  const type = event.type;

  if (state.byNew.has(type)) {
    const detail = detailOf(event);
    return deliver(state, element, event, oldEventsFor(state, element, type, detail, flagsOf(event), null));
  }

  const rows = state.byOld.get(type);
  if (!rows) return native.call(element, event);
  const detail = detailOf(event);
  const flags = flagsOf(event); // An old name with one plain new name is promoted: the new name first.

  const targets = new Set(rows.filter(row => row.mode === 'same-detail' && !row.when).map(row => row.to));

  if (targets.size === 1 && rows.every(row => row.mode === 'same-detail' && !row.when)) {
    const [to] = targets;
    const fresh = makeEvent(element, to, detail, flags);
    const olds = oldEventsFor(state, element, to, detail, flags, event); // A strict page whose old name expired still has the component's own
    // event in the cancel group, though it is not sent.

    return deliver(state, element, fresh, olds, [event]);
  } // Not promotable (detail-adds, split, folded): delivered as it is, a use
  // noted when touched.


  const {
    expired,
    usable
  } = life(rows[0]);
  if (!usable) return true;
  instrument(event, rows[0], expired, detail);
  shared().ours.add(event);
  return native.call(element, event);
} // --- attributes, values -----------------------------------------------------


function mapValue(state, attribute, value, {
  quiet = false
} = {}) {
  const row = state.values.get(attribute)?.get(String(value));
  if (!row) return value;
  const {
    expired,
    usable
  } = life(row);
  if (!quiet) note(row, expired);
  return usable ? row.to : value;
}

function writeIfDifferent(state, element, name, value) {
  const text = String(value);
  if (state.native.getAttribute.call(element, name) !== text) state.native.setAttribute.call(element, name, text);
}

function removeIfPresent(state, element, name) {
  if (state.native.hasAttribute.call(element, name)) state.native.removeAttribute.call(element, name);
}

function wrappedSet(state, element, name, value) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    state.native.setAttribute.call(element, attribute, value);
    if (usable) writeIfDifferent(state, element, row.to, mapValue(state, row.to, value));
    return;
  }

  const mapped = mapValue(state, attribute, value);
  state.native.setAttribute.call(element, attribute, mapped);

  for (const old of state.attrByNew.get(attribute) ?? []) {
    if (state.native.hasAttribute.call(element, old.from)) writeIfDifferent(state, element, old.from, mapped);
  }
}

function wrappedRemove(state, element, name) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);
  state.native.removeAttribute.call(element, attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable) removeIfPresent(state, element, row.to);
    return;
  }

  for (const old of state.attrByNew.get(attribute) ?? []) removeIfPresent(state, element, old.from);
}

function wrappedToggle(state, element, name, force) {
  const attribute = String(name).toLowerCase();
  const has = state.native.hasAttribute.call(element, attribute);
  const want = force === undefined ? !has : Boolean(force);
  if (want && !has) wrappedSet(state, element, attribute, '');
  if (!want && has) wrappedRemove(state, element, attribute);
  return want;
} // Changes that did not come through the element's own methods (the parser,
// an Attr node, a framework that calls the prototype): the later change of
// each name wins, and only differing values are written.


function reconcile(state, element, records) {
  const last = new Map();
  records.forEach((record, order) => last.set(record.attributeName, order));
  const names = [...last.keys()].sort((a, b) => last.get(a) - last.get(b));

  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const name of names) {
    const row = state.attrByOld.get(name);

    if (row) {
      const {
        expired,
        usable
      } = life(row);
      if (!usable) continue;

      if (has(name)) {
        if (get(row.to) !== mapValue(state, row.to, get(name), {
          quiet: true
        })) {
          note(row, expired);
          writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
        }
      } else {
        removeIfPresent(state, element, row.to);
      }

      continue;
    }

    if (state.values.has(name) && has(name)) {
      const mapped = mapValue(state, name, get(name));
      if (mapped !== get(name)) writeIfDifferent(state, element, name, mapped);
    }

    for (const old of state.attrByNew.get(name) ?? []) {
      // The old name changed after this one: its own turn decides.
      if (!has(old.from) || (last.get(old.from) ?? -1) > last.get(name)) continue;
      if (has(name)) writeIfDifferent(state, element, old.from, get(name));else state.native.removeAttribute.call(element, old.from);
    }
  }
} // What the markup already holds: an old attribute is a use and fills the new
// one when that is absent (a new one the page also wrote wins); an old value
// is rewritten.


function adopt(state, element) {
  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const [name, row] of state.attrByOld) {
    if (!has(name)) continue;
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable && !has(row.to)) writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
  }

  for (const name of state.values.keys()) {
    if (has(name)) writeIfDifferent(state, element, name, mapValue(state, name, get(name)));
  }
} // --- members -----------------------------------------------------------------


function nativePrototypes() {
  const protos = new Set([Object.prototype]);

  for (let proto = globalThis.HTMLElement?.prototype; proto; proto = Object.getPrototypeOf(proto)) protos.add(proto);

  if (globalThis.EventTarget) protos.add(globalThis.EventTarget.prototype);
  return protos;
} // May `name` be defined on the element? Not when the browser's element owns
// it and the component does not override it.


function ownableMember(element, name) {
  const natives = nativePrototypes();

  for (let proto = Object.getPrototypeOf(element); proto; proto = Object.getPrototypeOf(proto)) {
    if (Object.prototype.hasOwnProperty.call(proto, name)) return !natives.has(proto);
  }

  return true;
}

function defineOwn(state, element, name, descriptor) {
  const before = Object.getOwnPropertyDescriptor(element, name);
  state.restore.push(() => {
    delete element[name];
    if (before) Object.defineProperty(element, name, before);
  });
  Object.defineProperty(element, name, {
    configurable: true,
    enumerable: false,
    ...descriptor
  });
  return before;
}

function writable(element, name) {
  for (let object = element; object; object = Object.getPrototypeOf(object)) {
    const own = Object.getOwnPropertyDescriptor(object, name);
    if (own) return Boolean(own.set) || own.writable === true;
  }

  return true;
} // Today's Smart base exposes a setting as a read-only property over its
// attribute; such a setting is written through the attribute.


function writeSetting(state, element, row, property, value) {
  if (writable(element, property)) {
    element[property] = value;
  } else if (value === null || value === undefined || value === false) {
    removeIfPresent(state, element, row.to);
  } else {
    writeIfDifferent(state, element, row.to, value === true ? '' : typeof value === 'object' ? JSON.stringify(value) : value);
  }
}

function installProperty(state, element, row, refuse) {
  const from = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.from);
  const to = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.to);
  if (!ownableMember(element, from)) return refuse(row, 'native-member');
  if (!(to in element)) return refuse(row, 'no-new-property');
  const before = defineOwn(state, element, from, {
    get() {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      return usable ? element[to] : undefined;
    },

    set(value) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (usable) writeSetting(state, element, row, to, value);
    }

  }); // A value the page set before the element was installed moves to the new name.

  if (before && 'value' in before && before.value !== undefined) element[from] = before.value;
  return true;
}

function installAction(state, element, row, refuse) {
  if (!ownableMember(element, row.from)) return refuse(row, 'native-member');
  if (typeof element[row.to] !== 'function') return refuse(row, 'no-new-action');
  defineOwn(state, element, row.from, {
    writable: true,

    value(...args) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (!usable) throw new TypeError(`[SIMAI Framework] ${row.tag || element.localName}: ${row.from}() was removed after ${row.remove_after}; call ${row.to}().`);
      return element[row.to](...args);
    }

  });
  return true;
} // --- install ----------------------------------------------------------------


function uninstallAliases(element) {
  const store = shared();
  const state = element && store.elements.get(element);
  if (!state) return false;
  store.elements.delete(element);
  state.observer?.disconnect();
  state.controller.abort();

  for (const restore of state.restore.reverse()) restore();

  return true;
}
function installAliases(element, table, {
  signal,
  adapters = {},
  tag
} = {}) {
  if (!element || typeof element.dispatchEvent !== 'function') throw new TypeError('[SIMAI Framework] SF.aliases.install needs an element');
  uninstallAliases(element);
  const read = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable)(table, {
    tag: tag || element.localName || ''
  });
  const refused = [...read.refused];
  const handle = {
    installed: 0,
    refused,
    uninstall: () => uninstallAliases(element)
  };
  if (signal?.aborted) return handle;
  const state = {
    rows: read.rows,
    adapters,
    byNew: new Map(),
    byOld: new Map(),
    attrByOld: new Map(),
    attrByNew: new Map(),
    values: new Map(),
    restore: [],
    controller: new AbortController(),
    observer: null,
    native: {}
  };

  for (const name of [...WRAPPED, 'getAttribute', 'hasAttribute']) state.native[name] = element[name];

  const refuse = (row, reason) => {
    refused.push({
      index: -1,
      from: row.from,
      to: row.to,
      kind: row.kind,
      reason
    });
    return false;
  };

  const push = (map, key, row) => map.set(key, [...(map.get(key) ?? []), row]);

  for (const row of read.rows) {
    if (row.kind === 'event') {
      if (row.mode === 'split' && typeof adapters[row.from] !== 'function') {
        refuse(row, 'needs-adapter');
        continue;
      }

      push(state.byNew, row.to, row);
      push(state.byOld, row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'setting' || row.kind === 'attribute') {
      if (typeof state.native.setAttribute !== 'function') {
        refuse(row, 'no-attributes');
        continue;
      }

      state.attrByOld.set(row.from, row);
      push(state.attrByNew, row.to, row);
      handle.installed += 1;
      if (row.kind === 'setting') installProperty(state, element, row, refuse);
    } else if (row.kind === 'value') {
      if (!state.values.has(row.setting)) state.values.set(row.setting, new Map());
      state.values.get(row.setting).set(row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'action' && installAction(state, element, row, refuse)) {
      handle.installed += 1;
    }
  }

  if (state.byNew.size) {
    defineOwn(state, element, 'dispatchEvent', {
      writable: true,
      value: event => wrappedDispatch(state, element, event)
    });
  }

  const attributes = state.attrByOld.size || state.values.size;

  if (attributes) {
    defineOwn(state, element, 'setAttribute', {
      writable: true,
      value: (name, value) => wrappedSet(state, element, name, value)
    });
    defineOwn(state, element, 'removeAttribute', {
      writable: true,
      value: name => wrappedRemove(state, element, name)
    });

    if (typeof state.native.toggleAttribute === 'function') {
      defineOwn(state, element, 'toggleAttribute', {
        writable: true,
        value: (name, force) => wrappedToggle(state, element, name, force)
      });
    }

    adopt(state, element);
    const Observer = element.ownerDocument?.defaultView?.MutationObserver ?? globalThis.MutationObserver;

    if (typeof Observer === 'function') {
      const filter = [...new Set([...state.attrByOld.keys(), ...state.attrByNew.keys(), ...state.values.keys()])];
      state.observer = new Observer(records => reconcile(state, element, records));
      state.observer.observe(element, {
        attributes: true,
        attributeFilter: filter
      });
    }
  }

  shared().elements.set(element, state);
  signal?.addEventListener?.('abort', () => uninstallAliases(element), {
    once: true,
    signal: state.controller.signal
  });
  return handle;
} // For code that sends an event by name: through the element's aliases when
// it has them, a plain dispatch when it has none. Answers false when cancelled.

function dispatchAliased(element, name, {
  detail = null,
  bubbles = true,
  composed = true,
  cancelable = false
} = {}) {
  return element.dispatchEvent(makeEvent(element, name, detail, {
    bubbles,
    composed,
    cancelable
  }));
}
function aliasesOf(element) {
  return [...(shared().elements.get(element)?.rows ?? [])];
} // The first copy's API stays; every copy shares the state.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const current = globalThis.SF.aliases;

  if (!current || typeof current.install !== 'function') {
    globalThis.SF.aliases = {
      version: VERSION,
      strict: current?.strict === true,
      install: installAliases,
      uninstall: uninstallAliases,
      dispatch: dispatchAliased,
      of: aliasesOf,
      read: _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable,
      expired: (row, now) => (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, now ?? shared().now())
    };
  }
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

/***/ "59da34819c8b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   camelName: () => (/* binding */ camelName),
/* harmony export */   elementFromManifest: () => (/* binding */ elementFromManifest),
/* harmony export */   eventName: () => (/* binding */ eventName),
/* harmony export */   propsFromManifest: () => (/* binding */ propsFromManifest),
/* harmony export */   readManifest: () => (/* binding */ readManifest),
/* harmony export */   toOutcome: () => (/* binding */ toOutcome)
/* harmony export */ });
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("28b603686dcc");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _page_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("51e3a200cf5f");
/* harmony import */ var _host_port_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f171c5ece4b4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_1__);
// An element from its manifest (standard simai.smart-component 1.3.8 §3, §4,
// §4.1, §4.4, §7.7, §8, §11, §17.1).
//
// A component folder holds component.json, its language files and its
// aliases.json; the element's attribute and property code, the methods of its
// actions and the names of its events are not written by hand but made from
// them here:
//
//   import manifest from './component.json';
//   import en from './lang/en.json';
//   import ru from './lang/ru.json';
//   import aliases from './aliases.json';
//   const Base = elementFromManifest(manifest, {base: SfBaseElement, lang: {en, ru}, aliases, actions: {...}});
//   class SfThing extends Base { ...behaviour only... }
//
// Why at load and not in the build: ui-builder compiles a Smart component's
// index.js with webpack and babel and transforms nothing of its own, so the
// JSON files are bundled as they are (webpack reads JSON imports) and the
// plumbing is made once per class when the bundle runs. A build step can take
// this over later without a change in the components: the input is the same
// manifest.
//
// What the class gets:
//
// - settings (§4): an attribute and a property per setting, typed (`string`,
//   `enum`, `boolean`, `number`, `icon`, `date`, `id`; `list`, `object` and
//   `state` are properties only); a setting with `"default-from":
//   "runtime.<word>"` defaults to that word in the element's language;
// - values (§4, §4.3): a value with a default is also a setting of the same
//   name; the others are read-only properties that a component overrides with
//   its own getter;
// - events (§8): `sfEmit(verb, detail)` sends `<tag>-<verb>`, or the native
//   name for `change`, `input` and `"carries": "native"` (with the detail
//   when one is given), through the dated aliases, so the old names follow;
// - actions (§4.4): one method per action that takes its `with` parameters as
//   one object or in declared order and answers an outcome, `{outcome:
//   'applied'}` or `{outcome: 'refused', reason}`; `"emits"` sends its event
//   once first, and a page that cancels it makes the action refused; a
//   waiting action whose instance is removed answers `cancelled`;
// - the base action `connect-port {port}` (§4.1, §4.9): `connectPort(port)`,
//   `setHostPort` its alias, the port kept on the instance's scope and read
//   as `sfPort`, the component's `onPortConnected(port, {signal})` its hook
//   (core/js/host-port.js; the Smart base has it, another base gets it here);
// - the base values `shown` and `started` (§4.1) and the host state
//   `data-sf-started`; `sfHostState(name, on)` writes the declared
//   `host-states` (§5.3);
// - static `aliases` from aliases.json (§16.20), installed by the base;
// - words (§11, §11.1): `sfWord(key, {count, vars})`, with the element's own
//   word first, then the nearest [lang], the page's choice, <html lang>,
//   English, the source language and the key;
// - a form control (§17.1): `formAssociated` and ElementInternals where the
//   browser has them; `sfFormValue()` is what the form gets.
//
// Members the runtime adds start with `sf`, which no manifest name may
// (§3.1), so a generated setting or action never collides with them.




const RESERVED = new Set(['props', 'api', 'view', 'scope', 'parts', 'receive', 'render', 'connected', 'disconnected', 'updated', 'outside', 'data', 'template', 'root-class', 'root-style', 'focus', 'blur', 'connect-port', 'shown', 'started']);
const PROPERTY_ONLY = new Set(['list', 'object', 'state']); // core/js/smart-base.js toBoolean: what an attribute value means as true.

const TRUE_WORDS = new Set(['1', 'true', 'yes', 'on', 'checked', 'disabled', 'download', 'indeterminate', 'multiple']);
const camelName = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype; // The browser's own members (§3.1): read from the prototype, never from a copy.


function isNativeMember(property) {
  let proto = globalThis.HTMLElement?.prototype;

  while (proto) {
    if (Object.prototype.hasOwnProperty.call(proto, property)) return true;
    proto = Object.getPrototypeOf(proto);
  }

  return false;
} // The browser's own names a field reports under (§8, §17.3): a page listens
// for `change` and `input` on any form control, ours included, so they keep
// those names whatever they carry -- a detail when the component gives one,
// never `<tag>-change`. A component that holds other content and is no value
// control (sf-tabs, sf-steps, sf-pagination) declares `"x-native": false` on
// the event: it sends `<tag>-change`, so a field's change bubbling out of a
// panel is never taken for its own.


const NATIVE_EVENTS = new Set(['change', 'input']);
/** The DOM name of an event the manifest declares by its verb (§8). */

function eventName(manifest, verb) {
  const declared = manifest?.events?.[verb];
  if (declared?.carries === 'native') return verb;
  if (NATIVE_EVENTS.has(verb) && declared?.['x-native'] !== false) return verb;
  return `${manifest.tag}-${verb}`;
}
/** An action's answer as an outcome (§4.4, vocabulary §3.1). */

function toOutcome(result) {
  if (result === undefined || result === null || result === true) return {
    outcome: 'applied'
  };
  if (result === false) return {
    outcome: 'refused',
    reason: 'refused'
  };

  if (typeof result === 'string') {
    return ['applied', 'cancelled', 'conflict', 'unavailable'].includes(result) ? {
      outcome: result
    } : {
      outcome: 'refused',
      reason: result
    };
  }

  if (typeof result === 'object' && typeof result.outcome === 'string') return result;
  return {
    outcome: 'applied',
    value: result
  };
}

function typedDefault(spec) {
  if (Object.prototype.hasOwnProperty.call(spec, 'default')) return spec.default;

  switch (spec.type) {
    case 'boolean':
      return false;

    case 'number':
      return 0;

    case 'list':
      return [];

    case 'object':
    case 'state':
      return {};

    case 'enum':
      return spec.values?.[0] ?? '';

    default:
      return '';
  }
}

function runtimeWordOf(spec) {
  const from = spec?.['default-from'];
  return typeof from === 'string' && from.startsWith('runtime.') ? from.slice('runtime.'.length) : '';
}
/**
 * The members a manifest declares, read once: what the element exposes and
 * how each name is spelled on it.
 */


function readManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || !manifest.tag) {
    throw new TypeError('elementFromManifest: a manifest with a tag is required');
  }

  const members = [];
  const refused = [];

  const take = (part, name, spec, writable) => {
    const property = camelName(name);

    if (RESERVED.has(name) || name.startsWith('_') || name.startsWith('sf')) {
      refused.push({
        part,
        name,
        reason: 'reserved'
      });
      return;
    }

    members.push({
      part,
      name,
      property,
      type: spec.type || 'string',
      values: Array.isArray(spec.values) ? spec.values : null,
      default: typedDefault(spec),
      optional: spec.optional === true,
      attribute: PROPERTY_ONLY.has(spec.type) ? '' : name,
      writable,
      word: runtimeWordOf(spec),
      native: isNativeMember(property)
    });
  };

  for (const [name, spec] of Object.entries(manifest.settings || {})) take('settings', name, spec || {}, true);

  for (const [name, spec] of Object.entries(manifest.values || {})) {
    // A value a person changes is also writable as a setting (§4); one that
    // only shows (effective-*) is read.
    const writable = Object.prototype.hasOwnProperty.call(spec || {}, 'default') || Boolean(spec?.['default-from']);
    take('values', name, spec || {}, writable && !name.startsWith('effective-'));
  }

  const events = Object.fromEntries(Object.entries(manifest.events || {}).map(([verb, spec]) => [verb, {
    verb,
    name: eventName(manifest, verb),
    cancelable: spec?.cancelable === true,
    native: NATIVE_EVENTS.has(verb) || spec?.carries === 'native'
  }]));
  const actions = Object.entries(manifest.actions || {}).map(([name, spec]) => ({
    name,
    method: camelName(name),
    with: Object.keys(spec?.with || {}),
    emits: spec?.emits || ''
  }));
  return {
    tag: manifest.tag,
    members,
    events,
    actions,
    refused,
    hostStates: { ...(manifest['host-states'] || {})
    },
    form: manifest.form || null
  };
}
/** The base's `props` for the members that live in attributes or properties. */

function propsFromManifest(manifest) {
  const {
    members
  } = readManifest(manifest);
  const props = {};

  for (const member of members) {
    if (!member.writable) continue;
    const config = {
      default: member.default,
      attribute: member.attribute || false
    };
    if (member.type === 'boolean') config.type = Boolean;else if (member.type === 'number') config.type = Number;else if (member.type === 'list') config.type = Array;else if (PROPERTY_ONLY.has(member.type)) config.type = Object;
    if (member.values) config.values = member.values;

    if (PROPERTY_ONLY.has(member.type)) {
      config.parser = function readProperty(raw, fallback, element) {
        const store = element?.__sfManifestData;
        return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : fallback;
      };
    } else if (member.word) {
      config.parser = function readWord(raw, fallback, element) {
        return raw !== undefined && raw !== null ? raw : element.sfWord(member.word);
      };
    }

    props[member.property] = config;
  }

  return props;
}

function readAttribute(element, member) {
  const raw = element.getAttribute(member.attribute);

  if (member.type === 'boolean') {
    if (raw === null) return member.optional && member.default === undefined ? undefined : Boolean(member.default); // The base's reading, so the template and the property agree: present
    // and empty is true, then the words the base takes for true.

    return raw === '' || TRUE_WORDS.has(raw.toLowerCase());
  }

  if (raw === null) return member.word ? element.sfWord(member.word) : member.default;

  if (member.type === 'number') {
    const number = Number(raw);
    return raw.trim() !== '' && Number.isFinite(number) ? number : member.default;
  }

  if (member.values && !member.values.includes(raw)) return member.default;
  return raw;
}

function writeAttribute(element, member, value) {
  if (value === null || value === undefined) {
    element.removeAttribute(member.attribute);
    return;
  }

  if (member.type === 'boolean') {
    // An optional boolean keeps «off» as a value of its own (§4.2), and so
    // does one that is on by default: taking the attribute away would read
    // as the default, on (sf-pagination's count-known, total-exact).
    if (value) element.setAttribute(member.attribute, '');else if (member.optional || member.default === true) element.setAttribute(member.attribute, 'false');else element.removeAttribute(member.attribute);
    return;
  }

  element.setAttribute(member.attribute, String(value));
}

function defineMembers(target, members) {
  for (const member of members) {
    // The browser's own members stay the browser's (§3.1); a component that
    // must answer one writes its own accessor.
    if (member.native) continue;

    if (!member.writable) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          return member.default;
        }

      });
      continue;
    }

    if (!member.attribute) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          const store = this.__sfManifestData;
          return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : member.default;
        },

        set(value) {
          if (!this.__sfManifestData) this.__sfManifestData = {};
          this.__sfManifestData[member.name] = value;
          this.requestComponentUpdate?.(member.name);
        }

      });
      continue;
    }

    Object.defineProperty(target, member.property, {
      configurable: true,

      get() {
        return readAttribute(this, member);
      },

      set(value) {
        writeAttribute(this, member, value);
      }

    });
  }
}

function parameters(action, args) {
  if (args.length === 1 && isPlainObject(args[0]) && (action.with.length !== 1 || Object.keys(args[0]).every(key => action.with.includes(key)))) {
    return { ...args[0]
    };
  }

  return Object.fromEntries(action.with.map((name, index) => [name, args[index]]));
}

function defineActions(target, actions, implementations, events) {
  for (const action of actions) {
    if (isNativeMember(action.method)) continue;
    const run = implementations?.[action.name];
    Object.defineProperty(target, action.method, {
      configurable: true,
      writable: true,
      value: function generatedAction(...args) {
        const params = parameters(action, args);

        if (action.emits) {
          const event = events[action.emits];
          const allowed = this.sfEmit(action.emits, params, {
            cancelable: event?.cancelable ?? true
          });
          if (!allowed) return {
            outcome: 'refused',
            reason: 'prevented'
          };
        }

        if (typeof run !== 'function') {
          globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: action ${action.name} has no code`);
          return {
            outcome: 'refused',
            reason: 'not-implemented'
          };
        }

        let result;

        try {
          result = run.call(this, params, {
            signal: this.sfScope
          });
        } catch (error) {
          this.reportComponentError?.(error, `action ${action.name}`);
          return {
            outcome: 'refused',
            reason: 'error'
          };
        }

        if (result && typeof result.then === 'function') {
          const signal = this.sfScope;
          return Promise.resolve(result).then(value => signal?.aborted ? {
            outcome: 'cancelled'
          } : toOutcome(value), error => {
            if (signal?.aborted || error?.name === 'AbortError') return {
              outcome: 'cancelled'
            };
            this.reportComponentError?.(error, `action ${action.name}`);
            return {
              outcome: 'refused',
              reason: 'error'
            };
          });
        }

        return toOutcome(result);
      }
    });
  }
} // The nearest closed container (§7.2.1): `hidden`, a closed <details> or
// <dialog>. What has no box in an opened container is not shown.


function isShown(element) {
  if (!element.isConnected) return false;

  for (let node = element; node && node.nodeType === 1; node = node.parentElement || node.getRootNode?.()?.host) {
    if (node.hidden) return false;
    const tag = node.localName;
    if (node !== element && (tag === 'details' || tag === 'dialog') && !node.open) return false;
  }

  return true;
}
/**
 * The class a component extends: its manifest's plumbing over `base`.
 *
 * options:
 *   base      the class to extend (the Smart base, or a trait over it);
 *   lang      `{<locale>: <lang file>}`; the `runtime` words are the element's;
 *   source    the language the component was written in (the fallback before
 *             the key; default the first file that `lang` names);
 *   aliases   the component's aliases.json;
 *   actions   `{<action>(params, {signal}) => outcome}`, the actions' code.
 */


function elementFromManifest(manifest, {
  base,
  lang = {},
  source,
  aliases,
  actions = {}
} = {}) {
  const Base = base || globalThis.SF?.smart?.SfBaseElement;
  if (typeof Base !== 'function') throw new TypeError('elementFromManifest: a base class is required');
  const read = readManifest(manifest);
  const generatedProps = propsFromManifest(manifest);
  const words = Object.fromEntries(Object.entries(lang).map(([locale, file]) => [locale.toLowerCase(), { ...(file?.runtime || {})
  }]));
  const sourceLanguage = source || Object.keys(words)[0] || '';
  const formAssociated = Boolean(read.form) && typeof globalThis.ElementInternals === 'function' && typeof globalThis.ElementInternals.prototype?.setFormValue === 'function';

  class ManifestElement extends Base {
    static get manifest() {
      return manifest;
    } // What SF.Assembly reads of a part it places (assembly/definition.mjs
    // interfaces.of): the same manifest, so a rule can ask its actions.


    static get sfInterface() {
      return manifest;
    }

    static get sfManifest() {
      return read;
    }

    static get sfWords() {
      return words;
    }

    static get formAssociated() {
      return formAssociated;
    }

    static get props() {
      return { ...super.props,
        ...generatedProps
      };
    }

    constructor() {
      super();
      this.sfInternals = formAssociated && typeof this.attachInternals === 'function' ? this.attachInternals() : null;
    }

    connectedCallback() {
      super.connectedCallback(); // A leaf outside an assembly starts with the page (§7.2.1 `now`).

      this.toggleAttribute('data-sf-started', true);
    }
    /** §4.1: the element has a box in an opened container. */


    get shown() {
      return isShown(this);
    }
    /** §4.1: its assembly has started it (a leaf on a page, once connected). */


    get started() {
      return this.hasAttribute('data-sf-started');
    }
    /** The DOM name of a declared event (§8). */


    sfEventName(verb) {
      return read.events[verb]?.name ?? eventName(manifest, verb);
    }
    /**
     * Sends a declared event by its verb. Answers false when a listener
     * refused a cancelable one.
     */


    sfEmit(verb, detail = {}, {
      cancelable
    } = {}) {
      const event = read.events[verb];
      if (!event) globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: event ${verb} is not declared`);
      return (0,_aliases_js__WEBPACK_IMPORTED_MODULE_0__.dispatchAliased)(this, this.sfEventName(verb), {
        detail,
        bubbles: true,
        composed: true,
        cancelable: cancelable ?? event?.cancelable ?? false
      });
    }
    /** A word of the element's own, in its language (§11, §11.1). */


    sfWord(key, {
      count,
      vars
    } = {}) {
      return (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(words, key, this, {
        component: this.localName,
        source: sourceLanguage,
        count,
        vars
      });
    }
    /** Writes a declared host state (§5.3). */


    sfHostState(name, value) {
      const type = read.hostStates[name];

      if (!type) {
        globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: host state ${name} is not declared`);
        return;
      }

      if (type === 'boolean') {
        if (value) this.setAttribute(name, 'true');else this.removeAttribute(name);
      } else if (value === null || value === undefined || value === '') {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, String(value));
      }
    }
    /**
     * What a form gets (§17.1): the value named by `form.submits` while the
     * value named by `form.value` holds, nothing while disabled. A boolean
     * value submits only when true. A component overrides it for a value of
     * its own shape.
     */


    sfFormValue() {
      const form = read.form;
      if (!form) return null;
      if (form.disabled && this[camelName(form.disabled)]) return null;
      const value = this[camelName(form.value)];

      if (form.submits && form.submits !== form.value) {
        if (!value) return null;
        const submitted = this[camelName(form.submits)];
        return submitted === undefined || submitted === null ? null : String(submitted);
      }

      if (value === undefined || value === null || value === false) return null;
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    /** Tells the form what the element holds now. */


    sfSyncForm() {
      if (!this.sfInternals) return;

      try {
        this.sfInternals.setFormValue(this.sfFormValue());
      } catch (error) {
        this.reportComponentError?.(error, 'form');
      }
    }

    get form() {
      return this.sfInternals?.form ?? null;
    }

    get labels() {
      return this.sfInternals?.labels ?? null;
    }

    get validity() {
      return this.sfInternals?.validity;
    }

    get validationMessage() {
      return this.sfInternals?.validationMessage ?? '';
    }

    get willValidate() {
      return this.sfInternals?.willValidate ?? false;
    }

    checkValidity() {
      return this.sfInternals ? this.sfInternals.checkValidity() : true;
    }

    reportValidity() {
      return this.sfInternals ? this.sfInternals.reportValidity() : true;
    }

    setCustomValidity(message = '') {
      if (!this.sfInternals) return;
      if (message) this.sfInternals.setValidity({
        customError: true
      }, String(message));else this.sfInternals.setValidity({});
    }

    formDisabledCallback(disabled) {
      this.sfFormDisabled = Boolean(disabled);
      this.requestComponentUpdate?.('form-disabled');
    }

  }

  defineMembers(ManifestElement.prototype, read.members); // connect-port is the base's (§4.1): a base without it gets it here.

  (0,_host_port_js__WEBPACK_IMPORTED_MODULE_3__.installPortAction)(ManifestElement.prototype);
  defineActions(ManifestElement.prototype, read.actions, actions, read.events); // data-sf-action="<id>.<action>" runs a declared action (§8 one page trigger).

  if (read.actions.length) (0,_page_actions_js__WEBPACK_IMPORTED_MODULE_2__.bindPageActions)();
  if (aliases) ManifestElement.aliases = aliases;
  return ManifestElement;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f171c5ece4b4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   connectPort: () => (/* binding */ connectPort),
/* harmony export */   installPortAction: () => (/* binding */ installPortAction),
/* harmony export */   portFromParams: () => (/* binding */ portFromParams),
/* harmony export */   portIdOf: () => (/* binding */ portIdOf),
/* harmony export */   portOf: () => (/* binding */ portOf)
/* harmony export */ });
// The base action connect-port {port} (standard simai.smart-component 1.3.8
// §4.1, §4.9): every element takes the host port it is handed, from the page
// or from the assembly it is a part of, by one method, `connectPort(port)`;
// `setHostPort(port)` is its alias.
//
// The port is kept on the instance, for its scope (§7.7): it lasts while the
// instance does and is let go when its scope ends, so an element taken out of
// the page holds no host. A component reacts through an optional hook,
// `onPortConnected(port, {signal})`, run after the port is kept; a component
// written before the base action, which overrides `setHostPort(port)` itself,
// has that override run as the hook, so it needs no change to be reached.
//
// Answers an outcome (§4.4): `{outcome: 'applied'}`; `refused` with
// `no-port` when nothing was handed, `other-port` when the port names an id
// other than the one the manifest declares, and `port-unsupported` when the
// hook throws -- the port is then not kept.
// A host adapter names its port by `id` (SF.Assembly, the port contracts) or
// by `port` (`{port, version, capabilities, raise}`, ui-pro's adapters).
function portIdOf(port) {
  if (!port || typeof port !== 'object') return '';
  if (typeof port.id === 'string' && port.id) return port.id;
  if (typeof port.port === 'string' && port.port) return port.port;
  return '';
} // connect-port takes its parameters as one object, `{port}`, or the port
// itself. An adapter whose `port` is its id (a string) is the port.

function portFromParams(params) {
  if (params && typeof params === 'object' && params.port && typeof params.port === 'object') return params.port;
  return params;
} // The port id the element's manifest declares, if any (§4.9).

function declaredPortId(element) {
  const declared = element?.constructor?.manifest?.port ?? element?.constructor?.sfInterface?.port;
  return portIdOf(declared);
}
/** The port an element holds now, or null. */


function portOf(element) {
  return element?.__sfPortEntry?.port ?? null;
}
/** connect-port {port} on `element`, with `alias` the base's own setHostPort. */

function connectPort(element, params, alias) {
  const port = portFromParams(params);
  if (!port || typeof port !== 'object') return {
    outcome: 'refused',
    reason: 'no-port'
  };
  const declared = declaredPortId(element);
  const given = portIdOf(port);
  if (declared && given && declared !== given) return {
    outcome: 'refused',
    reason: 'other-port'
  };
  const previous = element.__sfPortEntry ?? null; // Kept on the element, not in a module map: every bundle carries its own
  // copy of this module, and the element is what they share.

  const signal = element.sfScope;
  const entry = {
    port,
    signal
  };
  element.__sfPortEntry = entry; // The port lives as long as the scope it was handed in (§7.7).

  if (signal && typeof signal.addEventListener === 'function' && !signal.aborted) {
    signal.addEventListener('abort', () => {
      if (element.__sfPortEntry === entry) element.__sfPortEntry = null;
    }, {
      once: true
    });
  } // The hook. A component's own setHostPort (written before the base action)
  // is the hook when there is no onPortConnected; the guard lets such an
  // override call super.setHostPort without running itself again.


  if (element.__sfConnectingPort) return {
    outcome: 'applied'
  };
  element.__sfConnectingPort = true;

  try {
    if (typeof element.onPortConnected === 'function') {
      element.onPortConnected(port, {
        signal
      });
    } else if (typeof element.setHostPort === 'function' && element.setHostPort !== alias) {
      element.setHostPort(port);
    }
  } catch (error) {
    element.__sfPortEntry = previous;
    return {
      outcome: 'refused',
      reason: 'port-unsupported'
    };
  } finally {
    element.__sfConnectingPort = false;
  }

  element.requestComponentUpdate?.('port');
  return {
    outcome: 'applied'
  };
}
/**
 * Gives a class the base action where its base has none: `connectPort`,
 * `setHostPort` and the read-only `sfPort`.
 */

function installPortAction(proto) {
  if (!proto || typeof proto.connectPort === 'function') return;

  function setHostPort(port) {
    return connectPort(this, port, setHostPort);
  }

  Object.defineProperty(proto, 'connectPort', {
    configurable: true,
    writable: true,
    value: function connectPortAction(port) {
      return connectPort(this, port, setHostPort);
    }
  });

  if (typeof proto.setHostPort !== 'function') {
    Object.defineProperty(proto, 'setHostPort', {
      configurable: true,
      writable: true,
      value: setHostPort
    });
  }

  if (!Object.prototype.hasOwnProperty.call(proto, 'sfPort')) {
    Object.defineProperty(proto, 'sfPort', {
      configurable: true,

      get() {
        return portOf(this);
      }

    });
  }
}

/***/ },

/***/ "695f21e50358"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   instancePath: () => (/* binding */ instancePath),
/* harmony export */   partId: () => (/* binding */ partId),
/* harmony export */   pathIsSettled: () => (/* binding */ pathIsSettled)
/* harmony export */ });
// An instance's id is its role path (standard simai.smart-component 1.3.8
// §7.1.1; simai/ui-source#41).
//
//   - at the top of the page: `page/<host id or data-sf-role>`;
//   - a part with `data-sf-role` inside another instance:
//     `<parent path>/<role>`;
//   - neither: `<kind>[<n>]`, n counted in document order among the
//     instances of the same kind that have neither.
//
// Ids that templates write (`for`, `aria-controls`, `aria-labelledby`) are
// `<path with every non-word run as ->--<local name>`. A counter is never an
// id: the field ids used to come from a module-scope counter, and every
// bundle that carries the field code (eight of them) had its own, so a class
// sf-quantity and an <sf-quantity> on one page both took
// `sf-quantity-1-control` and a label pointed at the other field. Ids that
// follow creation order also swap when two instances swap, and server markup
// (§5.4) cannot repeat them. A path is read from the page, so every bundle
// gives the same answer.
//
// `kind` is the element's tag for a Smart element; class markup passes its
// root class and is told apart as `class.<root class>`.
const isElement = node => node && node.nodeType === 1 && typeof node.getAttribute === 'function';

const isCustom = node => isElement(node) && String(node.localName || '').includes('-');

function parentInstance(node) {
  for (let current = node.parentNode || node.host || null; current; current = current.parentNode || current.host || null) {
    if (isCustom(current)) return current;
  }

  return null;
}

function kindOf(owner, kind) {
  const tag = String(owner?.localName || '').toLowerCase();
  if (tag && tag.includes('-')) return tag;
  return `class.${kind || tag || 'element'}`;
}

function documentIndex(owner, kind) {
  const doc = owner?.ownerDocument;
  if (!owner?.isConnected || typeof doc?.querySelectorAll !== 'function') return 0;
  const selector = kind.startsWith('class.') ? `.${kind.slice('class.'.length)}` : kind;
  let index = 0;

  for (const one of doc.querySelectorAll(selector)) {
    if (kind.startsWith('class.') && isCustom(one)) continue;
    if (one.id || one.getAttribute('data-sf-role')) continue;
    index += 1;
    if (one === owner) return index;
  }

  return 0;
}
/** The role path of an instance (§7.1.1). */


function instancePath(owner, {
  kind = ''
} = {}) {
  const id = isElement(owner) ? String(owner.id || '').trim() : String(owner?.id || '').trim();
  if (id) return `page/${id}`;
  const role = isElement(owner) ? String(owner.getAttribute('data-sf-role') || '').trim() : '';

  if (role) {
    const parent = parentInstance(owner);
    return parent ? `${instancePath(parent, {
      kind: parent.localName
    })}/${role}` : `page/${role}`;
  }

  const resolved = kindOf(owner, kind);
  return `${resolved}[${documentIndex(owner, resolved)}]`;
}
/** An id a template writes for one of its parts: `<path as a word>--<local name>`. */

function partId(path, local) {
  const base = String(path).replace(/\W+/gu, '-').replace(/^-+|-+$/gu, '');
  return local ? `${base}--${local}` : base;
}
/** Whether the path is final: an instance in the page, or one with an id. */

function pathIsSettled(owner) {
  return Boolean(owner?.isConnected || String(owner?.id || '').trim());
}

/***/ },

/***/ "78628e837a32"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   carryLayerOrigin: () => (/* binding */ carryLayerOrigin),
/* harmony export */   closeLayer: () => (/* binding */ closeLayer),
/* harmony export */   hasLayer: () => (/* binding */ hasLayer),
/* harmony export */   hasLayerAbove: () => (/* binding */ hasLayerAbove),
/* harmony export */   isOutsideTopLayer: () => (/* binding */ isOutsideTopLayer),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   landmarksAround: () => (/* binding */ landmarksAround),
/* harmony export */   layerIndex: () => (/* binding */ layerIndex),
/* harmony export */   layerZIndex: () => (/* binding */ layerZIndex),
/* harmony export */   layerZIndexAt: () => (/* binding */ layerZIndexAt),
/* harmony export */   openLayer: () => (/* binding */ openLayer),
/* harmony export */   openLayers: () => (/* binding */ openLayers),
/* harmony export */   raiseLayer: () => (/* binding */ raiseLayer),
/* harmony export */   returnLayerFocus: () => (/* binding */ returnLayerFocus),
/* harmony export */   topLayer: () => (/* binding */ topLayer),
/* harmony export */   tryFocus: () => (/* binding */ tryFocus),
/* harmony export */   updateLayer: () => (/* binding */ updateLayer)
/* harmony export */ });
// The one document layer stack (standard simai.smart-component 1.3.8 §19).
//
// Everything that draws above the page -- a modal, a drawer, a popover, a
// dropdown list, a menu, a calendar, the toast area -- registers here when it
// opens and leaves when it closes. The stack answers three questions the
// components used to answer each for itself, from three lists and two z-index
// bases:
//
//   - which layer is on top: the one opened last. Only that layer acts on
//     Escape, an outside press and Tab; a layer below stands back
//     (simai/ui-source#36: Escape over a modal opened from a drawer closed the
//     drawer, because each kept its own stack and the drawer listened first);
//   - how high each layer is drawn: one z-index scale in opening order, read
//     from the tokens --sf-z-index-layer and --sf-z-index-layer-step
//     (simai/ui-source#37: a drawer opened from a modal was drawn under it,
//     at 90 + 2i against the modal's 9000 + 2i);
//   - where focus goes when a layer closes: back to what was active when it
//     opened; if that is gone or outside the new top layer, into the new top
//     layer; else the nearest landmark; else the body. A layer that closes
//     while another stands above it moves no focus.
//
// Kept on a shared global, not in module scope: every Smart bundle carries its
// own copy of this module, and the modal's bundle has to see the drawer the
// drawer's bundle opened. Each document (an iframe too) has its own stack.
//
// A layer is any object: a custom element, or the root element of a component
// without one. One whose `isConnected` is false is passed over, so a layer
// removed without closing cannot hold every key on the page.
const STACK_KEY = Symbol.for('sf.layerStack'); // The scale's defaults, the same as core's tokens: 9000 is where the modal
// stack always started, so nothing a page draws below it changes place.

const LAYER_BASE = 9000;
const LAYER_STEP = 2;
const LANDMARKS = 'main, section, article, [role="main"], [role="region"]';

function stack() {
  const scope = globalThis;

  if (!scope[STACK_KEY]) {
    Object.defineProperty(scope, STACK_KEY, {
      value: {
        layers: [],
        bound: false,
        lease: null,
        pressTop: new WeakMap()
      },
      configurable: true
    });
  }

  return scope[STACK_KEY];
}

const isLive = entry => entry?.owner?.isConnected !== false; // A toast does not take keys or presses: the window under it keeps them.


const takesInput = entry => entry.kind !== 'toast';

function find(owner) {
  return stack().layers.find(entry => entry.owner === owner) || null;
}

function readToken(name, fallback) {
  const root = globalThis.document?.documentElement;
  if (!root || typeof globalThis.getComputedStyle !== 'function') return fallback;
  const value = parseInt(globalThis.getComputedStyle(root).getPropertyValue(name), 10);
  return Number.isFinite(value) ? value : fallback;
}
/** The z-index of the layer at a place in the stack, as a number. */


function layerZIndexAt(index) {
  if (index < 0) return '';
  return readToken('--sf-z-index-layer', LAYER_BASE) + index * readToken('--sf-z-index-layer-step', LAYER_STEP);
} // The page lock is one lease for the whole stack, taken by the first layer
// that locks the page and given back when no such layer is left -- whichever
// kind opened first and whichever closes last. A modal and a drawer held two
// locks before, and closing them out of order unlocked the page under an open
// window.

function syncPageLock() {
  const state = stack();
  const locker = state.layers.find(entry => entry.locksPage && isLive(entry));

  if (locker && !state.lease) {
    const release = locker.lockPage?.();
    state.lease = typeof release === 'function' ? release : () => {};
  } else if (!locker && state.lease) {
    const release = state.lease;
    state.lease = null;
    release();
  }
}

function sync() {
  const state = stack();
  const top = topLayer();
  state.layers.forEach((entry, index) => {
    entry.place?.({
      index,
      zIndex: layerZIndexAt(index),
      top: entry === top
    });
  });
  syncPageLock();
}
/** The layer on top: the last opened that takes keys and presses. */


function topLayer() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && takesInput(layers[at])) return layers[at];
  }

  return null;
}
/** Whether this owner is the top layer. One that is not open is top only when nothing is. */

function isTopLayer(owner) {
  const top = topLayer();
  return top ? top.owner === owner : !find(owner);
}
function hasLayer(owner) {
  return Boolean(find(owner));
}
/** Whether a layer of one of these kinds stands above this owner. */

function hasLayerAbove(owner, kinds = ['modal', 'panel']) {
  const {
    layers
  } = stack();
  const at = layers.findIndex(entry => entry.owner === owner);
  if (at < 0) return false;
  return layers.slice(at + 1).some(entry => isLive(entry) && kinds.includes(entry.kind));
}
/** The place of this owner in the stack, -1 when it is not open. */

function layerIndex(owner) {
  return stack().layers.findIndex(entry => entry.owner === owner);
}
/** This owner's z-index, '' when it is not open. */

function layerZIndex(owner) {
  return layerZIndexAt(layerIndex(owner));
}
/** The open layers, bottom first; of one kind when `kind` is given. */

function openLayers(kind = '') {
  return stack().layers.filter(entry => !kind || entry.kind === kind).map(entry => entry.owner);
}
/**
 * Registers a layer, or raises it to the top when it is already open.
 *
 * options:
 *   kind        'modal' | 'panel' | 'surface' | 'toast'
 *   locksPage   true to hold the page lock while open; lockPage() takes it and
 *               returns the function that gives it back
 *   trapsFocus  true to keep Tab inside and to return focus on close
 *   root()      the element the layer draws, for focus and outside presses
 *   onEscape(event)  closes the layer and answers true when it took the press
 *   onTab(event)     keeps focus inside
 *   focusIn()        moves focus inside
 *   place({index, zIndex, top})  draws the layer at its height
 *   returnTo    what was active at open (default: the active element now)
 */

function openLayer(owner, options = {}) {
  if (!owner) return null;
  const state = stack();
  bindKeys();
  let entry = find(owner);

  if (entry) {
    state.layers.splice(state.layers.indexOf(entry), 1);
    Object.assign(entry, options);
  } else {
    const returnTo = options.returnTo !== undefined ? options.returnTo : globalThis.document?.activeElement ?? null;
    entry = {
      kind: 'surface',
      locksPage: false,
      trapsFocus: false,
      ...options,
      owner,
      returnTo,
      returnAncestors: landmarksAround(returnTo)
    };
  }

  state.layers.push(entry);
  sync();
  return entry;
}
/** Changes what a layer declares without moving it in the stack. */

function updateLayer(owner, options = {}) {
  const entry = find(owner);
  if (!entry) return null;
  Object.assign(entry, options);
  sync();
  return entry;
}
/** Raises an open layer to the top. */

function raiseLayer(owner) {
  const entry = find(owner);
  if (!entry) return;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  layers.push(entry);
  sync();
}
/**
 * Removes a layer. Answers whether it was the top one. With `restoreFocus`
 * (the default) a top layer that traps focus gives focus back by §19.2.
 */

function closeLayer(owner, {
  restoreFocus = true
} = {}) {
  const entry = find(owner);
  if (!entry) return false;
  const wasTop = topLayer() === entry;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  sync();

  if (restoreFocus && wasTop && entry.trapsFocus) {
    returnLayerFocus(true, entry.returnTo, entry.returnAncestors);
  }

  return wasTop;
}
/** The landmarks around a node, nearest first: where focus falls back to. */

function landmarksAround(node) {
  const found = [];

  for (let parent = node?.parentElement; parent; parent = parent.parentElement) {
    if (parent.matches?.(LANDMARKS)) found.push(parent);
  }

  return found;
}
/** Focuses a node if a person could reach it; answers whether it took focus. */

function tryFocus(node, temporaryTabIndex = false) {
  if (!node?.isConnected || typeof node.focus !== 'function' || node.matches?.(':disabled') || node.closest?.('[inert], [hidden], [aria-hidden="true"]') || !node.getClientRects?.().length || node.ownerDocument.defaultView.getComputedStyle(node).visibility !== 'visible') {
    return false;
  }

  const addTabIndex = temporaryTabIndex && !node.hasAttribute('tabindex');
  let observer;

  const cleanup = () => {
    observer?.disconnect();
    node.removeEventListener('blur', cleanup); // Keep an author's own change to the temporary attribute.

    if (addTabIndex && node.getAttribute('tabindex') === '-1') node.removeAttribute('tabindex');
  };

  if (addTabIndex) {
    node.setAttribute('tabindex', '-1');
    node.addEventListener('blur', cleanup, {
      once: true
    });
    observer = new node.ownerDocument.defaultView.MutationObserver(() => {
      if (!node.isConnected) cleanup();
    });
    observer.observe(node.ownerDocument.documentElement, {
      childList: true,
      subtree: true
    });
  }

  let focused = false;

  try {
    node.focus({
      preventScroll: true
    });
    focused = node.ownerDocument.activeElement === node;
    return focused;
  } catch {
    return false;
  } finally {
    // Removing tabindex while a non-native target is focused blurs it.
    if (addTabIndex && !focused) cleanup();
  }
} // The layer that owns focus now: the topmost one that traps it. A docked
// panel or an open list under the window does not.

function focusOwner() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && layers[at].trapsFocus) return layers[at];
  }

  return null;
}
/**
 * Gives focus back after a layer closed (§19.2): to `target` when it is still
 * there and inside the layer that now owns focus (or nothing does); else into
 * that layer; else the nearest landmark; else the body. Nothing moves when the
 * closed layer was not the top one.
 */


function returnLayerFocus(wasTop, target, ancestors = []) {
  if (!wasTop) return;
  const owner = focusOwner();
  const root = owner?.root?.();
  if ((!owner || root?.contains(target)) && tryFocus(target)) return;

  if (owner) {
    owner.focusIn?.();
    return;
  }

  const doc = globalThis.document;
  if (!doc) return;
  const candidates = new Set([...ancestors, ...doc.querySelectorAll('main, [role="main"]'), doc.body]);

  for (const candidate of candidates) {
    if (tryFocus(candidate, true)) return;
  }
} // One listener pair for the whole document, whichever bundle binds it first.
// The top layer is read when the press starts (window, capture -- before any
// component's listener) and acted on when it has passed through the page
// (window, bubble): a control inside that handled Escape keeps it, and a
// surface that closed itself on the way down does not hand the same press to
// the layer under it.

function bindKeys() {
  const state = stack();
  if (state.bound || typeof globalThis.addEventListener !== 'function') return;
  state.bound = true;
  globalThis.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'Tab') state.pressTop.set(event, topLayer());
  }, true);
  globalThis.addEventListener('keydown', event => {
    if (event.key !== 'Escape' && event.key !== 'Tab' || event.defaultPrevented) return;
    const top = state.pressTop.has(event) ? state.pressTop.get(event) : topLayer();
    if (!top || top !== topLayer()) return;

    if (event.key === 'Escape') {
      if (top.onEscape?.(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return;
    }

    top.onTab?.(event);
  });
} // A press outside the top layer, read in capture: what a layer below would
// call outside is ignored there.


function isOutsideTopLayer(event) {
  const top = topLayer();
  const root = top?.root?.();
  if (!root) return false;
  const path = event.composedPath?.() ?? [];
  return !path.includes(root) && !path.includes(top.owner);
}
const THEMES = ['theme-dark', 'theme-light'];
/**
 * A layer drawn outside its host (a portal) keeps where it came from (§19.1):
 * the host's resolved lang and dir, the theme of its nearest themed ancestor,
 * and the computed values of the host's variables that differ from those
 * where the portal stands -- `variables` by name, `prefixes` by the start of
 * the name. It looks and speaks as if it stood where its host stands.
 */

function carryLayerOrigin(portal, host, {
  variables = [],
  prefixes = []
} = {}) {
  if (!portal || !host?.isConnected) return;
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  const lang = host.closest('[lang]')?.getAttribute('lang') ?? doc.documentElement.getAttribute('lang') ?? '';
  if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
  const declared = host.closest('[dir]')?.getAttribute('dir');
  const dir = declared && declared !== 'auto' ? declared : view.getComputedStyle(host).direction;
  if (dir) portal.setAttribute('dir', dir); // The theme only when the host's differs from the portal's place: a page
  // that retunes tokens on html.theme-dark keeps them, as the class would
  // otherwise declare the core's values again on the portal.

  const parent = portal.parentElement;

  const theme = node => {
    const area = node?.closest?.(THEMES.map(name => `.${name}`).join(', '));
    return area ? THEMES.find(name => area.classList.contains(name)) : '';
  };

  const carried = portal.dataset.sfLayerTheme || '';
  const wanted = theme(host) !== theme(parent) ? theme(host) : '';
  if (carried && carried !== wanted) portal.classList.remove(carried);
  if (wanted) portal.classList.add(wanted);
  if (wanted) portal.dataset.sfLayerTheme = wanted;else delete portal.dataset.sfLayerTheme;
  if (!variables.length && !prefixes.length) return;
  const own = view.getComputedStyle(host);
  const there = parent ? view.getComputedStyle(parent) : null;
  const names = new Set(variables);

  if (prefixes.length) {
    for (const name of own) {
      if (prefixes.some(prefix => name.startsWith(prefix))) names.add(name);
    }
  }

  const previous = (portal.dataset.sfLayerVariables || '').split(' ').filter(Boolean);
  const kept = [];

  for (const name of names) {
    const value = own.getPropertyValue(name).trim();

    if (value && value !== there?.getPropertyValue(name).trim()) {
      portal.style.setProperty(name, value);
      kept.push(name);
    }
  }

  for (const name of previous) if (!kept.includes(name)) portal.style.removeProperty(name);

  if (kept.length) portal.dataset.sfLayerVariables = kept.join(' ');else delete portal.dataset.sfLayerVariables;
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
/* harmony import */ var _layer_stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("78628e837a32");
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

const held = new WeakSet(); // The same holders are layers of the one document stack (layer-stack.js,
// standard 1.3.8 §19.1): the mark answers "is anything open", the stack answers
// "is it me" -- for a surface, and for the drawer and the modal under it. Two
// surfaces that both listen on the document in capture cannot settle it with
// stopPropagation, which does not reach a listener on the same node: a calendar
// opened inside a popover closed together with the popover, and a popover closed
// over a dropdown list it held and left the list open.
//
// The list a bundle of an older pair reads (sf.openSurfaceLayers) is kept as
// well, so a package built against it still sees the surfaces this one opens.

const LAYERS_KEY = Symbol.for('sf.openSurfaceLayers');

function legacyLayers() {
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
  const layers = legacyLayers();

  if (wanted) {
    held.add(owner);
    layers.push(owner);
    (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.openLayer)(owner, {
      kind: 'surface'
    });
  } else {
    held.delete(owner);
    const at = layers.lastIndexOf(owner);
    if (at >= 0) layers.splice(at, 1); // A surface returns focus itself, to its own trigger.

    (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.closeLayer)(owner, {
      restoreFocus: false
    });
  }

  step(wanted ? 1 : -1);
} // What a surface asks before its own Escape closes it: whether it is the top
// layer of the document -- above a modal or a drawer as well as above another
// surface. A holder that left the document without releasing is passed over
// rather than allowed to hold every Escape on the page. An owner that holds
// nothing is the top only when nothing else is open.

function isTopOpenSurface(owner) {
  if (!(0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(owner)) return false; // A holder that only a bundle of an older pair registered -- it is in the
  // old list and not in the stack -- stands above whatever opened before it.

  const layers = legacyLayers();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    const layer = layers[at];
    if (layer?.isConnected === false) continue;
    return layer === owner || (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.hasLayer)(layer);
  }

  return true;
} // What a component asks before its own Escape closes something larger.

function isOpenSurfaceMarked() {
  return Boolean(globalThis.document?.documentElement?.dataset?.[OPEN_MARK]);
}
const OPEN_SURFACE_MARK = OPEN_MARK;

/***/ },

/***/ "51e3a200cf5f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindPageActions: () => (/* binding */ bindPageActions),
/* harmony export */   readPageAction: () => (/* binding */ readPageAction),
/* harmony export */   runPageAction: () => (/* binding */ runPageAction)
/* harmony export */ });
// One page trigger (standard simai.smart-component 1.3.8 §8, §16.10, §19.4):
// `data-sf-action="<element id>.<action>"` on a page control runs that action
// of the element, the same method a script or a rule calls. It replaces the
// per-component triggers (`data-sf-modal-open`, `data-sf-drawer-close`, …),
// which stay as their aliases.
//
//   <button data-sf-action="confirm-delete.open">Delete</button>
//   <sf-modal id="confirm-delete">… <button data-sf-action="confirm-delete.confirm">Yes</button></sf-modal>
//
// Only an action the element's manifest declares is run: a page trigger can
// not reach the element's other methods. The action gets no parameters; a
// trigger that needs some is a script.
//
// One click listener for the document, on a shared global: every Smart bundle
// carries its own copy of this module, and a second listener would run each
// action twice.
const KEY = Symbol.for('sf.pageActions');

const camel = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
/** `<id>.<action>` -> {id, action}; the action is the part after the last dot. */


function readPageAction(text) {
  const value = String(text || '').trim();
  const at = value.lastIndexOf('.');
  if (at <= 0 || at === value.length - 1) return null;
  return {
    id: value.slice(0, at),
    action: value.slice(at + 1)
  };
}
/** Runs a page trigger; answers the action's outcome, or null when nothing ran. */

function runPageAction(trigger) {
  const read = readPageAction(trigger?.getAttribute?.('data-sf-action'));
  if (!read) return null; // The element's id, or its instance id: a part an assembly placed is named
  // by its role path (§7.1.1, data-sf-instance="page/form/dialog").

  const doc = trigger.ownerDocument;
  const element = doc?.getElementById(read.id) ?? [...(doc?.querySelectorAll('[data-sf-instance]') ?? [])].find(one => one.getAttribute('data-sf-instance') === read.id);
  const declared = element?.constructor?.sfManifest?.actions ?? [];
  if (!declared.some(action => action.name === read.action)) return null;
  const method = element[camel(read.action)];
  return typeof method === 'function' ? method.call(element, {}) : null;
}
function bindPageActions(doc = globalThis.document) {
  if (!doc || typeof doc.addEventListener !== 'function') return;
  const scope = globalThis;
  if (!scope[KEY]) Object.defineProperty(scope, KEY, {
    value: new WeakSet(),
    configurable: true
  });
  if (scope[KEY].has(doc)) return;
  scope[KEY].add(doc);
  doc.addEventListener('click', event => {
    const trigger = event.target?.closest?.('[data-sf-action]');
    if (!trigger || trigger.matches(':disabled, [aria-disabled="true"]')) return;
    runPageAction(trigger);
  });
}

/***/ },

/***/ "50a1017ded91"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5429d6e80991");
/* harmony import */ var _component_dropdown_interaction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("3a03d4610486");
/* harmony import */ var _component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a0f23dca0b37");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("421676f72963");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("b4d28078de6f");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("f15c795f1055");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("ad680c489766");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("8b3dd54aeaa8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);












 // sf-dropdown from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §19): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json, and the old
// names -- type, sf-dropdown:change -- are dated aliases. It still submits
// through its hidden input (§16 item 11); the manifest keeps the form contract
// as x-form until the field family's ElementInternals mixin takes it.

const DropdownElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_8__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default())),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_11__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_12__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__
});

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

class SfDropdown extends DropdownElement {
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
  } // The manifest's settings, and what the dropdown reads more closely (the
  // size ladder's words, columns as text, the trait's settings).


  static get props() {
    return { ...super.props,
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
    return this.getAttribute('search-placeholder') || this.sfWord('search');
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
  } // The person's change (§8): `change` on the host with data only, then its old
  // name sf-dropdown:change with root added, through the alias table.


  dispatchDropdownChange(option = null, values = this.selectedValues) {
    this.sfEmit('change', {
      value: option?.value || '',
      label: option ? getOptionLabel(option) : '',
      values,
      item: option,
      multiple: this.multiple
    });
  } // The old name keeps its old detail (§16.20 split row): root was the element.


  sfAliasAdapters() {
    return {
      'sf-dropdown:change': detail => ({ ...detail,
        root: this
      })
    };
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
   * changes. Returns whether the field was reset. The detail names the
   * element (`tag`), as a trait event does (standard 1.3.8 §20, trait
   * field-inherit@1: sf-field-reset {tag, value, inherited-value, name}): the
   * event comes from every field of the family, and a listener on a form
   * tells them apart by it.
   */


  resetToInherited() {
    if (!this.hasInheritedValue || this.inheritedOwnValue() === '') return false;
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return false;
    const event = new CustomEvent(INHERITED_RESET_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        tag: this.localName,
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

/***/ },

/***/ "f15c795f1055"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-dropdown for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (setting rows), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"type","to":"appearance","kind":"setting","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"},{"from":"aria-label","to":null,"kind":"attribute","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-dropdown:change","to":"change","kind":"event","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","section":"§8, vocabulary §5.1","note":"the old detail adds root (the element), which §8 takes out of the new detail: the element\'s detail adapter makes it"}]}');

/***/ },

/***/ "b4d28078de6f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-dropdown\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/dropdown (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.dropdown","tag":"sf-dropdown","version":"1.4.0","kind":"leaf","family":"dropdown","traits":["field-inherit@1"],"settings":{"appearance":{"type":"enum","values":["filled","outlined"],"default":"outlined"},"columns":{"type":"number","default":6},"disabled":{"type":"boolean","default":false},"label":{"type":"string","default":""},"layout":{"type":"enum","values":["list","grid"],"default":"list"},"mode":{"type":"enum","values":["tag","select"],"default":"select"},"multiple":{"type":"boolean","default":false},"name":{"type":"string","default":""},"options":{"type":"list","default":[],"of":{"value":"string","text":"string","icon":{"type":"icon","optional":true},"disabled":{"type":"boolean","optional":true},"group":{"type":"string","optional":true}},"x-shape":"ui-source 5100227 src/smart/dropdown/smart.manifest.json inputs.options; a string or a number is both the text and the value; constant options in a manifest give only the value, the text lives in lang roles.<role>.items.<value> (standard 1.3.8 §11.3)"},"placeholder":{"type":"string","default":""},"portal":{"type":"boolean","default":true},"required":{"type":"boolean","default":false},"search":{"type":"boolean","default":true},"search-placeholder":{"type":"string","default-from":"runtime.search"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"}},"values":{"value":{"type":"string","default":""}},"events":{"change":{"carries":"native","x-detail":{"value":"string","label":"string","values":"list","item":"object","multiple":"boolean"}}},"actions":{"open-dropdown":{"x-outcomes":["applied","refused"]},"close-dropdown":{"x-outcomes":["applied","refused"]},"toggle-dropdown":{"x-outcomes":["applied","refused"]}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"side-effects":["portal"],"keyboard":{"host":{"Tab":"reach","ArrowDown":"focus:next","ArrowUp":"focus:prev","Home":"focus:first","End":"focus:last","Enter":"select","Space":"select","Escape":"close"}},"templates":{"default":{"file":"js/templates/default.js","$comment":"The Lit template in JavaScript, the migration form of §5.2 (§16)."}},"examples":"examples.json","docs":"docs/docs.md","lang":"lang/","accessibility":{"role":"combobox","name":{"from":["label","aria-label","aria-labelledby","label[for]"]},"keys":{"Tab":"reach","ArrowDown":"focus:next","ArrowUp":"focus:prev","Home":"focus:first","End":"focus:last","Enter":"select","Space":"select","Escape":"close"}},"host-states":{"data-inherited":"boolean"},"css-variables":{"--sf-dropdown-background-color":{"type":"color","state":"default"},"--sf-dropdown-border-color":{"type":"color","state":"default"},"--sf-dropdown-radius":{"type":"length","state":"default"},"--sf-dropdown-gap":{"type":"length","state":"default"},"--sf-dropdown-list-background-color":{"type":"color","state":"open"}},"x-summary":"Accessible single or multiple selection control with searchable options and optional portal projection.","x-source":{"package":"framework","folder":"dropdown","manifest":"simai/ui-source@5100227 src/smart/dropdown/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/dropdown.component.json"},"x-words":["label","placeholder","search-placeholder"],"x-renamed":["settings.aria-label: a host attribute, read by the base, never a setting (§3.1)","settings.columns: type string with the numeral default \\"6\\" → number (§16 item 29)","settings.type → appearance: the axis\'s old name (contracts/public-api-axes.json), alias dated","events.sf-dropdown:change → change: vocabulary §5.1 (a value changed), the colon name a dated alias"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"fixture","effects":"component","forbidden_client_responsibilities":["backend access decisions","host route invention"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile"],"skeleton":{"shape":"none","while_loading":"none"}},"ai_guidance":{"use_when":"Use sf-dropdown when a form needs one or several values from a concealed option set. Use direct sf-list-item children with stable machine values and visible labels. Use portal only when an ancestor clips the popup.","do_not":["Do not copy generated ui-smart code","Do not move host data or access decisions into the component","Do not use the visible label as the submitted value when a stable machine identifier exists","Do not make decorative checkbox, avatar or icon content independently focusable inside an option"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<sf-dropdown label=\\"Статус\\" name=\\"status\\" placeholder=\\"Выберите статус\\"><sf-list-item value=\\"open\\" text=\\"Открыт\\"></sf-list-item><sf-list-item value=\\"done\\" text=\\"Готов\\"></sf-list-item></sf-dropdown>","owner_commands":["npm run contract:verify","npm test"]}},"x-form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","validity":["value-missing","custom-error"]},"x-decisions":["trait-words: the shared field words (inherited, reset, described) stay with the trait field-inherit@1, as sf-switch keeps them (x-trait-words in the language files); where a trait\'s words live is Annex A item 13.","version: 1.3.0 → 1.4.0: type and sf-dropdown:change are dated aliases; change carries no element (root leaves its detail, §8).","a11y-role: combobox, one role: the trigger is a read-only box that opens a listbox (the list\'s own role); the name is the drawn label, then what the page said of the host (aria-label, aria-labelledby, a label[for]).","existing-aliases: compatibility.migrations lists the move to appearance; type folds into aliases.json as a dated setting row, sf-dropdown:change as a split event row whose old detail keeps root.","form: the dropdown still submits through its hidden input, which §16 item 11 allows until 1.4.0; the form contract of §17.1 is kept as x-form and moves in with the field family\'s FormField mixin (ElementInternals). Declaring `form` now would make the host a form control beside the hidden input.","template: templates.default names the Lit template js/templates/default.js, the migration form §5.2 allows.","examples: examples.json from studio.fixture.json and studio.scenario.json plus multiple, tags, a grid, search and an inherited value; probe.json drives the arrows, Home, End, Enter, Space, Escape and Tab (gate 16).","css-variables: five public variables read by the sheet with the role tokens as fallbacks (§6): the field\'s resting background and border, its radius, the gap, and the open list\'s background. They are not in src/core/contracts/public-variables.v1.json yet: that file and its test are shared with the field family\'s branches.","side-effects: portal -- the open list is shown in the browser\'s top layer, or, without it, moved to the end of body (or of the open modal dialog).","layer: kind surface; the open list registers through core open-surface-mark, so Escape reaches it while it is the top layer; it does not trap focus.","change: the change the person made is sent as `change` on the host (a CustomEvent with {value, label, values, item, multiple}); the old name sf-dropdown:change follows with root added, once per change."]}');

/***/ },

/***/ "ad680c489766"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Dropdown","runtime":{"search":"Search"},"x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"inherited","reset":"Reset to inherited","described":"Inherited: {value}"}}}');

/***/ },

/***/ "8b3dd54aeaa8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Выпадающий список","runtime":{"search":"Поиск"},"x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"наследуется","reset":"Сбросить к наследуемому","described":"Наследуется: {value}"}}}');

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