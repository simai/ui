/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3a03d4610486"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDropdownInteraction: () => (/* binding */ createDropdownInteraction),
/* harmony export */   syncDropdownCheckbox: () => (/* binding */ syncDropdownCheckbox)
/* harmony export */ });
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e92fd2d1a38c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__);
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
      released = false,
      typed = '',
      typedAt = 0;
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

  const input = () => field()?.querySelector('input:not([type="hidden"])'); // The search header (.sf-list-search, since R029) or a search field written
  // as an sf-input before it.


  const search = () => adapter.getList()?.querySelector('.sf-list-search-input, .sf-input input');

  const items = () => [...(adapter.getList()?.querySelectorAll('.sf-list-item') || [])];

  const available = () => items().filter(e => !e.hidden && !e.classList.contains('disabled') && e.getAttribute('aria-disabled') !== 'true' && e.getAttribute('aria-hidden') !== 'true');

  const contains = node => node && (root.contains(node) || adapter.getList()?.contains(node));

  const text = item => item.querySelector('.sf-list-item-container, .sf-avatar-label-group-title, .sf-tag-container')?.textContent?.trim() || item.dataset.value || ''; // The focused option is brought into view at once and only as far as it
  // needs: a smooth page scroll would leave it out of view while the next key
  // already moves on.


  const focus = node => {
    if (node && !node.disabled) {
      node.focus({
        preventScroll: true
      });
      node.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'instant'
      });
    }
  }; // PageDown/PageUp move by what the rows' scroll area shows: to the last
  // option that still fits one viewful away, at least one option.


  const scroller = node => {
    for (let e = node?.parentElement; e && e !== document.body; e = e.parentElement) {
      const y = getComputedStyle(e).overflowY;
      if ((y === 'auto' || y === 'scroll') && e.scrollHeight > e.clientHeight) return e;
    }

    return null;
  };

  const page = (options, index, step) => {
    const from = options[index],
          box = scroller(from);
    if (!from || !box) return step > 0 ? options.length - 1 : 0;
    const top = from.getBoundingClientRect().top,
          span = box.clientHeight;
    let next = Math.max(0, Math.min(options.length - 1, index + step));

    for (let i = next + step; i >= 0 && i < options.length; i += step) {
      const r = options[i].getBoundingClientRect();
      if ((step > 0 ? r.bottom - top : top + from.offsetHeight - r.top) > span) break;
      next = i;
    }

    return next;
  }; // Type-ahead: printable keys typed within half a second form a prefix; the
  // same letter again walks the options that start with it.


  const typeahead = (key, option) => {
    const now = Date.now();
    typed = now - typedAt > 500 ? key : typed + key;
    typedAt = now;
    const options = available(),
          query = typed.toLocaleLowerCase();
    const repeat = [...query].every(c => c === query[0]);
    const start = Math.max(0, options.indexOf(option));
    const order = [...options.slice(start + 1), ...options.slice(0, start + 1)];

    const starts = item => text(item).toLocaleLowerCase().startsWith(query);

    return (query.length > 1 ? [options[start], ...order].find(starts) : null) || order.find(item => text(item).toLocaleLowerCase().startsWith(repeat ? query[0] : query));
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
    } else if (option && inPopup && ['PageDown', 'PageUp'].includes(event.key)) {
      const options = available(),
            index = Math.max(0, options.indexOf(option));
      focus(options[page(options, index, event.key === 'PageUp' ? -1 : 1)]);
      handled = true;
    } else if (option && inPopup && event.key.length === 1 && (event.key !== ' ' || typed && Date.now() - typedAt <= 500)) {
      const found = typeahead(event.key, option);
      if (found) focus(found);
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
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a0f23dca0b37"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignDropdownInPlace: () => (/* binding */ alignDropdownInPlace),
/* harmony export */   closeDropdownPortal: () => (/* binding */ closeDropdownPortal),
/* harmony export */   fitDropdownInPlace: () => (/* binding */ fitDropdownInPlace),
/* harmony export */   openDropdownPortal: () => (/* binding */ openDropdownPortal),
/* harmony export */   positionDropdownPortal: () => (/* binding */ positionDropdownPortal),
/* harmony export */   scrolledInside: () => (/* binding */ scrolledInside),
/* harmony export */   triggerOf: () => (/* binding */ triggerOf)
/* harmony export */ });
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _panel_scrollbar_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("cb6d39a52a42");
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
} // A list that stays in place (portal="false") cannot move to stay inside the
// screen, but it can grow the other way: when the width C32 gives it would
// cross the screen's inline end, it hangs from the field's end instead of its
// start (data-sf-align="end"). Measured with the attribute off, each opening.

function alignDropdownInPlace(list) {
  if (!list || list.hidden || list.hasAttribute('data-sf-portal')) {
    list?.removeAttribute('data-sf-align');
    list?.style.removeProperty(ROOM);
    return;
  }

  list.removeAttribute('data-sf-align');
  const rect = list.getBoundingClientRect();
  const field = (list.offsetParent ?? list.parentElement)?.getBoundingClientRect();
  if (!field || !rect.width) return;
  fitDropdownInPlace(list, rect);
  const rtl = getComputedStyle(list).direction === 'rtl';
  const screen = document.documentElement.clientWidth;
  const over = rtl ? rect.left < 0 : rect.right > screen; // Hung from the end it must fit better: the room on the other side of the
  // field is larger than the room it had.

  const room = rtl ? screen - field.left : field.right;
  if (over && room > (rtl ? field.right : screen - field.left)) list.setAttribute('data-sf-align', 'end');
} // The height an anchored list is given, for a list in place. Anchored, a list
// takes the room the screen has on the side it opens to (below, or above when
// that side has more), less the panel's edge padding, and scrolls its rows
// beyond that (SF.Position fitHeight). In place it had no cap at all: sixty
// options made a list 2.4k px tall that pushed the page, and the wheel over it
// scrolled the page (R171 follow-up, 2026-11-12). In place the list cannot
// flip, so it takes the larger of the two rooms the anchored list chooses
// from: opened near the screen's bottom it is as tall as the anchored list
// would be above, and a page scroll brings the whole of it into view. A list
// short of its room by less than the padding takes its whole height, as
// anchored (R018). The stylesheet reads the value (--sf-dropdown-available-
// block-size) and caps a list the script never measured by the screen.

const ROOM = '--sf-dropdown-available-block-size';
const OFFSET = 'var(--sf-space-1\\/4)';
const PADDING = 'var(--sf-space-1\\/2)';
function fitDropdownInPlace(list, rect = list.getBoundingClientRect()) {
  const root = list.closest('.sf-dropdown');
  const trigger = (triggerOf(root) ?? root ?? list.parentElement)?.getBoundingClientRect();
  if (!trigger) return null;
  const context = list.parentElement;
  const padding = position().resolveLength(PADDING, context);
  const offset = position().resolveLength(OFFSET, context);
  const screen = document.documentElement.clientHeight;
  const below = screen - padding - rect.top;
  const above = trigger.top - offset - padding;
  const room = Math.max(0, below, above); // The whole list: its box plus what its rows' area hides under a cap.

  const wrap = list.querySelector('.sf-list-container-wrap');
  const hidden = wrap ? Math.max(0, wrap.scrollHeight - wrap.clientHeight) : 0;
  const whole = Math.ceil(rect.height + hidden);
  const cap = whole > room && whole <= room + padding ? whole : room;
  list.style.setProperty(ROOM, `${Math.floor(cap)}px`);
  return cap;
} // A scroll that happened inside the list itself (its rows' scroll area): the
// field did not move, so the panel stays where it is. Repositioning for it
// interrupted the wheel on every step (owner R171, 2026-11-12).

function scrolledInside(list, event) {
  if (event?.type !== 'scroll' || !list) return false;
  const target = event.composedPath?.()[0] ?? event.target;
  return target instanceof Node && list.contains(target);
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
      // A list at a field is at least the field (decision C32): it grows with
      // its longest option up to the list's step (--sf-popup-list-max-width)
      // or the field, whichever is wider, and never stands narrower than the
      // field. A trigger of the consumer's own is not a field: an icon button
      // would make the list the width of a glyph.
      matchWidth: field.classList.contains('sf-dropdown-field') ? 'min' : false,
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
  } // A panel the viewport made shorter keeps its rows' scroll but may now end
  // above the option the keyboard is on: that option is brought back into view.


  state.anchor.update().then(() => {
    const active = document.activeElement;

    if (!list.hidden && active?.classList?.contains('sf-list-item') && list.contains(active)) {
      active.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'instant'
      });
    }
  });
  state.scrollbar?.mark();
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
    root.__sfDropdownPortalList = list; // Marked before it is placed: the list's cap (C32) is read as it is
    // anchored, and a list in place keeps the field's box for its own.

    list.setAttribute('data-sf-portal', '');
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
      list.style.zIndex = 'var(--sf-layer--popover)';
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
    window.visualViewport?.addEventListener('scroll', state.schedule); // The rows' scroll area gives up its inline-end inset to a scrollbar that
    // takes room (owner C07, docs review R029).

    if (state.wrap) {
      state.scrollbar = new _panel_scrollbar_js__WEBPACK_IMPORTED_MODULE_1__.PanelScrollbar();
      state.scrollbar.watch(state.wrap, 'sf-list-container-wrap--scrollbar');
    }
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
  state.scrollbar?.disconnect();
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
  list.removeAttribute('data-sf-portal');
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
// (component/inputs/scss/_field-ladder.scss). The other fields (textarea,
// dropdown, file upload, image, rich text) keep the three sizes for now.

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

/***/ "67eed2647f47"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindFormReset: () => (/* binding */ bindFormReset)
/* harmony export */ });
// Reset fires before the browser restores default values. Synchronize afterwards
// without synthesizing input/change events or retaining detached controls.
//
// One capture listener per document, while a control is bound to it: the first
// binding adds it and the last release takes it away, so a removed instance
// leaves nothing on the document. It used to stay for the page's life, added
// by whichever instance bound first; when that was an instance placed after
// the page settled (a closed layer's field starting late), the instance scope
// gate read it as that instance's leak (gate 36, 2026-11-11). Every bundle
// carries its own copy of this module, so the listener and the subscriptions
// live on the document, shared by the copies: one listener, not one per bundle.
const REGISTRY = Symbol.for('sf.formReset');

function registryOf(doc) {
  let registry = doc[REGISTRY];

  if (!registry) {
    registry = {
      subscriptions: new WeakMap(),
      bound: 0,
      listener: null
    };
    Object.defineProperty(doc, REGISTRY, {
      value: registry,
      configurable: true
    });
  }

  return registry;
}

function listen(doc, registry) {
  registry.listener = event => {
    const form = event.target;
    if (form?.tagName !== 'FORM') return;
    const controls = Array.from(form.elements);
    setTimeout(() => {
      if (event.defaultPrevented) return;

      for (const control of controls) {
        if (!control.isConnected || control.form !== form) continue;

        for (const callback of registry.subscriptions.get(control) || []) callback();
      }
    }, 0);
  };

  doc.addEventListener('reset', registry.listener, true);
}

function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;
  const registry = registryOf(doc);
  if (!registry.listener) listen(doc, registry);
  let callbacks = registry.subscriptions.get(input);
  if (!callbacks) registry.subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  registry.bound += 1;
  let released = false;
  return () => {
    if (released) return false;
    released = true;
    callbacks.delete(synchronize);
    registry.bound -= 1;

    if (registry.bound <= 0 && registry.listener) {
      doc.removeEventListener('reset', registry.listener, true);
      registry.listener = null;
      registry.bound = 0;
    }

    return true;
  };
}

/***/ },

/***/ "cb6d39a52a42"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanelScrollbar: () => (/* binding */ PanelScrollbar),
/* harmony export */   scrollbarTakesRoom: () => (/* binding */ scrollbarTakesRoom)
/* harmony export */ });
// The scrollbar of a dropping panel stands in the inline-end inset only while
// it takes room (owner C07, docs review R029, 2026-11-07): the area that
// scrolls the rows gives up its inline-end padding then, and keeps it beside an
// overlay scrollbar or none. The sheets draw the track (the inset, the thumb,
// the inset -- src/component/context-menu/scss/_panel.scss); this marks the
// area with a class while its scrollbar takes room, read from offsetWidth -
// clientWidth past the borders whenever the area is drawn or changes its size
// (a narrowed search, a panel fitted to its room, a window made smaller).
// Used by sf-menu-context, sf-dropdown's list, sf-input-lookup and
// sf-profile-picker.
function scrollbarTakesRoom(area) {
  const style = getComputedStyle(area);
  const borders = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0);
  return area.offsetWidth - area.clientWidth - borders > 0;
}
class PanelScrollbar {
  constructor() {
    this.area = null;
    this.name = '';
    this.observer = null;
  } // Watch `area` (or nothing, given null) and mark it with `name`. A new area
  // releases the old one and takes its mark off.


  watch(area, name) {
    if (area !== this.area || name !== this.name) {
      this.observer?.disconnect();
      if (this.area && this.name) this.area.classList.remove(this.name);
      this.area = area ?? null;
      this.name = name;

      if (this.area && typeof ResizeObserver === 'function') {
        // The mark moves the area's padding, so it is written on the next
        // frame: written in the observer's own call it would resize what is
        // observed while the observer delivers (a ResizeObserver loop).
        this.observer ??= new ResizeObserver(() => requestAnimationFrame(() => this.mark()));
        this.observer.observe(this.area);
      }
    }

    this.mark();
  }

  mark() {
    const area = this.area;
    if (!area?.isConnected || !this.name) return;
    const takesRoom = scrollbarTakesRoom(area);
    if (area.classList.contains(this.name) !== takesRoom) area.classList.toggle(this.name, takesRoom);
  }

  disconnect() {
    this.observer?.disconnect();
    this.observer = null;
    if (this.area && this.name) this.area.classList.remove(this.name);
    this.area = null;
    this.name = '';
  }

}

/***/ },

/***/ "1b42c5117087"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICON_CHOICES: () => (/* binding */ ICON_CHOICES),
/* harmony export */   ICON_CHOICE_WORDS: () => (/* binding */ ICON_CHOICE_WORDS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   iconWords: () => (/* binding */ iconWords)
/* harmony export */ });
// The glyphs a person may mark a part of an interface with -- a section of a
// record, a row of a menu, a tile of a dashboard. A hundred and twenty names
// from the Framework's own icon set, the ones products actually reach for,
// read in rows of what they are usually about: what a thing is, who it
// belongs to, when it happens, what it costs, what it is made of. One list,
// so every set chooses from the same glyphs.
//
// Raised from ui-pro sf-view-properties (js/icon-choices.js), which sf-admin-menu
// imported across what become two component sets (duplication audit
// 2026-11-03, A-1; owner decision 2026-11-03, component sets, point 13). A
// component imports ICON_CHOICES; a page reads SF.icons.choices, and
// SF.icons.choices.words[name] gives a glyph's Russian and English words
// (C151 point 8). The choice
// itself is drawn by sf-dropdown with options of kind icon (layout grid,
// search), as sf-view-properties and sf-admin-menu do.
// The words a person searches the choice by (owner decision C151 point 8): a
// Russian and an English word or two for each glyph, the name's own words
// among the English ones. sf-dropdown matches its icon options against them
// in either language, so «папка» finds folder and «folder» still does.
const ICON_CHOICE_WORDS = Object.freeze({
  folder: {
    ru: ["папка", "каталог"],
    en: ["folder", "directory"]
  },
  folder_open: {
    ru: ["открытая", "папка"],
    en: ["open", "folder"]
  },
  topic: {
    ru: ["тема", "раздел"],
    en: ["topic", "section"]
  },
  home: {
    ru: ["главная", "дом"],
    en: ["home", "main"]
  },
  dashboard: {
    ru: ["панель", "сводка"],
    en: ["dashboard", "overview"]
  },
  apartment: {
    ru: ["здание", "организация"],
    en: ["building", "organisation"]
  },
  store: {
    ru: ["магазин"],
    en: ["store", "shop"]
  },
  storefront: {
    ru: ["витрина", "магазин"],
    en: ["storefront", "shop"]
  },
  business_center: {
    ru: ["портфель", "бизнес"],
    en: ["business", "briefcase"]
  },
  work: {
    ru: ["работа", "портфель"],
    en: ["work", "briefcase"]
  },
  badge: {
    ru: ["пропуск", "удостоверение"],
    en: ["badge", "pass", "id"]
  },
  person: {
    ru: ["человек", "пользователь"],
    en: ["person", "user"]
  },
  group: {
    ru: ["группа", "люди"],
    en: ["group", "people"]
  },
  groups: {
    ru: ["группы", "сообщество"],
    en: ["groups", "community"]
  },
  account_circle: {
    ru: ["профиль", "аккаунт"],
    en: ["account", "profile"]
  },
  manage_accounts: {
    ru: ["управление", "пользователями"],
    en: ["manage", "accounts", "users"]
  },
  supervisor_account: {
    ru: ["руководитель", "команда"],
    en: ["supervisor", "team"]
  },
  contacts: {
    ru: ["контакты"],
    en: ["contacts"]
  },
  school: {
    ru: ["обучение", "школа"],
    en: ["school", "learning"]
  },
  menu_book: {
    ru: ["книга", "справочник"],
    en: ["book", "manual"]
  },
  assignment: {
    ru: ["задание"],
    en: ["assignment"]
  },
  task: {
    ru: ["задача"],
    en: ["task"]
  },
  description: {
    ru: ["документ", "описание"],
    en: ["document", "description"]
  },
  article: {
    ru: ["статья"],
    en: ["article"]
  },
  note_alt: {
    ru: ["заметка"],
    en: ["note"]
  },
  edit_note: {
    ru: ["правка", "заметки"],
    en: ["edit", "note"]
  },
  draft: {
    ru: ["черновик"],
    en: ["draft"]
  },
  receipt: {
    ru: ["чек", "квитанция"],
    en: ["receipt"]
  },
  receipt_long: {
    ru: ["счёт", "чек"],
    en: ["bill", "receipt"]
  },
  request_quote: {
    ru: ["смета", "предложение"],
    en: ["quote", "estimate"]
  },
  inventory_2: {
    ru: ["архив", "склад"],
    en: ["archive", "inventory"]
  },
  category: {
    ru: ["категории"],
    en: ["category"]
  },
  label: {
    ru: ["метка", "ярлык"],
    en: ["label", "tag"]
  },
  sell: {
    ru: ["цена", "продажа"],
    en: ["price", "sell"]
  },
  local_offer: {
    ru: ["скидка", "предложение"],
    en: ["offer", "discount"]
  },
  shopping_cart: {
    ru: ["корзина"],
    en: ["shopping", "cart"]
  },
  shopping_bag: {
    ru: ["покупки", "сумка"],
    en: ["shopping", "bag"]
  },
  payments: {
    ru: ["оплата", "деньги"],
    en: ["payments", "money"]
  },
  savings: {
    ru: ["сбережения", "копилка"],
    en: ["savings"]
  },
  credit_card: {
    ru: ["карта", "оплата"],
    en: ["credit", "card"]
  },
  account_balance: {
    ru: ["банк"],
    en: ["bank", "account"]
  },
  calculate: {
    ru: ["калькулятор", "расчёт"],
    en: ["calculator"]
  },
  percent: {
    ru: ["процент"],
    en: ["percent"]
  },
  trending_up: {
    ru: ["рост", "тренд"],
    en: ["trend", "growth"]
  },
  analytics: {
    ru: ["аналитика"],
    en: ["analytics"]
  },
  insights: {
    ru: ["выводы", "инсайты"],
    en: ["insights"]
  },
  monitoring: {
    ru: ["мониторинг"],
    en: ["monitoring"]
  },
  bar_chart: {
    ru: ["диаграмма", "график"],
    en: ["bar", "chart"]
  },
  pie_chart: {
    ru: ["круговая", "диаграмма"],
    en: ["pie", "chart"]
  },
  table_chart: {
    ru: ["таблица"],
    en: ["table"]
  },
  schedule: {
    ru: ["время", "часы", "расписание"],
    en: ["time", "clock", "schedule"]
  },
  event: {
    ru: ["событие"],
    en: ["event"]
  },
  today: {
    ru: ["сегодня"],
    en: ["today"]
  },
  calendar_month: {
    ru: ["календарь"],
    en: ["calendar"]
  },
  date_range: {
    ru: ["период", "даты"],
    en: ["date", "range"]
  },
  history: {
    ru: ["история"],
    en: ["history"]
  },
  alarm: {
    ru: ["будильник", "напоминание"],
    en: ["alarm"]
  },
  timer: {
    ru: ["таймер"],
    en: ["timer"]
  },
  update: {
    ru: ["обновление"],
    en: ["update"]
  },
  hourglass_top: {
    ru: ["ожидание", "песочные", "часы"],
    en: ["hourglass", "waiting"]
  },
  mail: {
    ru: ["почта", "письмо"],
    en: ["mail", "email", "letter"]
  },
  outgoing_mail: {
    ru: ["исходящие", "отправка"],
    en: ["outgoing", "mail"]
  },
  chat: {
    ru: ["чат", "сообщение"],
    en: ["chat", "message"]
  },
  forum: {
    ru: ["обсуждение", "форум"],
    en: ["forum", "discussion"]
  },
  sms: {
    ru: ["смс", "сообщение"],
    en: ["sms", "text"]
  },
  call: {
    ru: ["звонок", "телефон"],
    en: ["call", "phone"]
  },
  phone_in_talk: {
    ru: ["разговор"],
    en: ["phone", "call", "talk"]
  },
  contact_support: {
    ru: ["поддержка"],
    en: ["support", "help"]
  },
  campaign: {
    ru: ["рассылка", "объявление"],
    en: ["campaign", "announcement"]
  },
  notifications: {
    ru: ["уведомления"],
    en: ["notifications"]
  },
  language: {
    ru: ["язык", "мир"],
    en: ["language", "world"]
  },
  public: {
    ru: ["сайт", "мир", "интернет"],
    en: ["public", "web", "world"]
  },
  place: {
    ru: ["место"],
    en: ["place"]
  },
  map: {
    ru: ["карта"],
    en: ["map"]
  },
  location_on: {
    ru: ["адрес", "место"],
    en: ["location", "address"]
  },
  travel_explore: {
    ru: ["поиск", "по", "миру"],
    en: ["travel", "explore"]
  },
  flight: {
    ru: ["перелёт", "самолёт"],
    en: ["flight", "plane"]
  },
  local_shipping: {
    ru: ["доставка"],
    en: ["shipping", "delivery"]
  },
  route: {
    ru: ["маршрут"],
    en: ["route"]
  },
  directions: {
    ru: ["направление"],
    en: ["directions"]
  },
  settings: {
    ru: ["настройки"],
    en: ["settings"]
  },
  tune: {
    ru: ["фильтр", "параметры"],
    en: ["tune", "filter"]
  },
  build: {
    ru: ["инструменты", "сборка"],
    en: ["build", "tools"]
  },
  construction: {
    ru: ["стройка"],
    en: ["construction"]
  },
  handyman: {
    ru: ["ремонт", "мастер"],
    en: ["handyman", "repair"]
  },
  code: {
    ru: ["код"],
    en: ["code"]
  },
  terminal: {
    ru: ["терминал", "консоль"],
    en: ["terminal", "console"]
  },
  data_object: {
    ru: ["объект", "данные"],
    en: ["data", "object"]
  },
  api: {
    ru: ["интерфейс", "api"],
    en: ["api"]
  },
  bug_report: {
    ru: ["ошибка", "баг"],
    en: ["bug"]
  },
  database: {
    ru: ["база", "данных"],
    en: ["database"]
  },
  storage: {
    ru: ["хранилище"],
    en: ["storage"]
  },
  cloud: {
    ru: ["облако"],
    en: ["cloud"]
  },
  backup: {
    ru: ["резервная", "копия"],
    en: ["backup"]
  },
  sync: {
    ru: ["синхронизация"],
    en: ["sync"]
  },
  folder_zip: {
    ru: ["архив", "zip"],
    en: ["zip", "archive"]
  },
  upload_file: {
    ru: ["загрузка", "файла"],
    en: ["upload", "file"]
  },
  download: {
    ru: ["скачать"],
    en: ["download"]
  },
  attach_file: {
    ru: ["вложение", "скрепка"],
    en: ["attach", "file"]
  },
  link: {
    ru: ["ссылка"],
    en: ["link"]
  },
  lock: {
    ru: ["замок", "доступ"],
    en: ["lock"]
  },
  lock_open: {
    ru: ["открытый", "доступ"],
    en: ["unlock", "open"]
  },
  shield: {
    ru: ["защита"],
    en: ["shield", "protection"]
  },
  verified_user: {
    ru: ["проверено", "безопасность"],
    en: ["verified", "user"]
  },
  key: {
    ru: ["ключ"],
    en: ["key"]
  },
  admin_panel_settings: {
    ru: ["администрирование"],
    en: ["admin"]
  },
  policy: {
    ru: ["правила", "политика"],
    en: ["policy"]
  },
  gavel: {
    ru: ["закон", "право"],
    en: ["law", "gavel"]
  },
  fingerprint: {
    ru: ["отпечаток"],
    en: ["fingerprint"]
  },
  visibility: {
    ru: ["видимость", "просмотр"],
    en: ["visibility", "view"]
  },
  palette: {
    ru: ["палитра", "цвет"],
    en: ["palette", "colour", "color"]
  },
  format_paint: {
    ru: ["оформление", "кисть"],
    en: ["format", "paint"]
  },
  image: {
    ru: ["картинка", "изображение"],
    en: ["image", "picture"]
  },
  photo_library: {
    ru: ["фото", "галерея"],
    en: ["photos", "gallery"]
  },
  collections: {
    ru: ["коллекции"],
    en: ["collections"]
  },
  movie: {
    ru: ["видео", "фильм"],
    en: ["movie", "video"]
  },
  play_circle: {
    ru: ["воспроизведение"],
    en: ["play"]
  },
  mic: {
    ru: ["микрофон"],
    en: ["microphone"]
  },
  headphones: {
    ru: ["наушники", "звук"],
    en: ["headphones", "audio"]
  },
  brush: {
    ru: ["кисть", "рисование"],
    en: ["brush"]
  }
}); // The words of any glyph name: the choice's words, or the name read as words
// (folder_open -> folder open) for a glyph outside the choice.

function iconWords(name) {
  const key = String(name || '').trim();
  const words = Object.hasOwn(ICON_CHOICE_WORDS, key) ? ICON_CHOICE_WORDS[key] : null;
  const own = key.split('_').filter(Boolean);
  return {
    ru: words ? [...words.ru] : [],
    en: [...new Set([...(words ? words.en : []), ...own])]
  };
}
const ICON_CHOICES = Object.freeze(Object.defineProperty(["folder", "folder_open", "topic", "home", "dashboard", "apartment", "store", "storefront", "business_center", "work", "badge", "person", "group", "groups", "account_circle", "manage_accounts", "supervisor_account", "contacts", "school", "menu_book", "assignment", "task", "description", "article", "note_alt", "edit_note", "draft", "receipt", "receipt_long", "request_quote", "inventory_2", "category", "label", "sell", "local_offer", "shopping_cart", "shopping_bag", "payments", "savings", "credit_card", "account_balance", "calculate", "percent", "trending_up", "analytics", "insights", "monitoring", "bar_chart", "pie_chart", "table_chart", "schedule", "event", "today", "calendar_month", "date_range", "history", "alarm", "timer", "update", "hourglass_top", "mail", "outgoing_mail", "chat", "forum", "sms", "call", "phone_in_talk", "contact_support", "campaign", "notifications", "language", "public", "place", "map", "location_on", "travel_explore", "flight", "local_shipping", "route", "directions", "settings", "tune", "build", "construction", "handyman", "code", "terminal", "data_object", "api", "bug_report", "database", "storage", "cloud", "backup", "sync", "folder_zip", "upload_file", "download", "attach_file", "link", "lock", "lock_open", "shield", "verified_user", "key", "admin_panel_settings", "policy", "gavel", "fingerprint", "visibility", "palette", "format_paint", "image", "photo_library", "collections", "movie", "play_circle", "mic", "headphones", "brush"], 'words', {
  value: ICON_CHOICE_WORDS,
  enumerable: false
})); // Core publishes the list; a component bundle that carries its own copy reuses
// the published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  globalThis.SF.icons = globalThis.SF.icons || {};
  if (!globalThis.SF.icons.choices) globalThis.SF.icons.choices = ICON_CHOICES;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ICON_CHOICES);

/***/ },

/***/ "c69a3dc158df"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_PLACEHOLDER_ICON: () => (/* binding */ AVATAR_PLACEHOLDER_ICON),
/* harmony export */   AVATAR_SIZES: () => (/* binding */ AVATAR_SIZES),
/* harmony export */   avatarClasses: () => (/* binding */ avatarClasses),
/* harmony export */   avatarContent: () => (/* binding */ avatarContent),
/* harmony export */   avatarPicture: () => (/* binding */ avatarPicture),
/* harmony export */   avatarPictureContext: () => (/* binding */ avatarPictureContext),
/* harmony export */   avatarPictureIcons: () => (/* binding */ avatarPictureIcons),
/* harmony export */   avatarStepText: () => (/* binding */ avatarStepText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
/* harmony import */ var _helpers_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cbce4a5232a6");
/* harmony import */ var _tone_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a6b3ed0c1589");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__);



 // One avatar drawing (avatar study AV-8, 2026-11-14). sf-avatar and every
// component that shows a person beside its own content -- sf-avatar-group,
// sf-tag, sf-list-item, sf-dropdown, sf-input-lookup, sf-menu-context, the
// signs of sf-list -- draw the picture with these functions and the avatars
// sheet's classes: a photo is an <img> filling the circle, initials stand on
// the neutral plate (or the hue the host names, C17), and with neither the
// placeholder is a glyph on the neutral plate -- person by default, the
// host's icon for a bot, a system or a service. Before, five copies drew it
// five ways: the photo as a background image in the tag, the list row and the
// dropdown, an empty transparent circle in a row with no photo, and the
// context menu's own classes on the secondary container.

/** The sizes of the avatar ladder. */

const AVATAR_SIZES = Object.freeze(["1/4", "1/3", "1/2", "1", "2", "3"]);
/** The glyph of a placeholder: a person, unless the host names another. */

const AVATAR_PLACEHOLDER_ICON = "person"; // The letters a step holds (owner decision C152 (3), 2026-11-14): two from
// 1/3 up, one at 1/4 (16 px holds one letter of a readable size, two were
// 10 px each). Only letters are cut: «+5» or a number stays whole.

function avatarStepText(text, size) {
  const value = String(text ?? "");
  if (String(size ?? "") !== "1/4") return value;
  const letters = value.match(/^(\p{L}\p{M}*)\p{L}/u);
  return letters ? letters[1] : value;
}
/**
 * The drawing context of one avatar picture, from what a host knows: the photo,
 * the initials or the name they are taken from, the hue, the placeholder's
 * glyph, the size (or the text line of a form size) and the shape.
 */

function avatarPictureContext(options = {}) {
  const imageUrl = String(options.imageUrl ?? "").trim();
  const name = String(options.name ?? "").trim();
  const explicitText = String(options.text ?? "").trim();
  const namedIcon = String(options.icon ?? "").trim();
  const size = AVATAR_SIZES.includes(String(options.size ?? "")) ? String(options.size) : ""; // The initials: the host's own, else those of the name -- unless the host
  // names a glyph (a bot, a system), which stands in for them. With a photo
  // they stand under it until it comes and when it fails (C152 (2)).

  const text = avatarStepText(namedIcon ? explicitText : explicitText || (0,_helpers_text__WEBPACK_IMPORTED_MODULE_2__.getInitials)(name), size);
  const isImage = Boolean(imageUrl); // isText: the initials are drawn (alone, or under the photo).

  const isText = Boolean(text);
  const icon = namedIcon || AVATAR_PLACEHOLDER_ICON;
  return {
    size,
    line: String(options.line ?? ""),
    shape: options.shape === "square" ? "square" : "circle",
    imageUrl,
    isImage,
    isText,
    text,
    icon,
    status: options.status || "none",
    expressive: Boolean(options.expressive),
    resolvedHue: isText && options.hue ? (0,_tone_mjs__WEBPACK_IMPORTED_MODULE_3__.resolveAvatarHue)(options.hue, name || text, "") : "",
    rootClass: options.rootClass || "",
    rootStyle: options.rootStyle || "",
    disabled: Boolean(options.disabled),
    // A long list's rows load their photos as they scroll in.
    lazy: Boolean(options.lazy),
    component: options.component
  };
}
/**
 * The classes of the avatar picture. The avatars sheet answers every class
 * this file writes. sf-avatar's own templates hand it their utility classes
 * for the box (options.layout, src/smart/avatar/js/templates/shared.js), as
 * they wrote them before; a host's picture writes none -- sf-avatar--picture
 * gives it the same box from the avatars sheet -- so a host asks the Loader
 * for no utility it did not ask for before (a menu, a tag, a list row).
 */

function avatarClasses(context, options = {}) {
  const includeRootClass = options.includeRootClass !== false;
  const layout = options.layout ?? null;
  const classes = ["sf-avatar", layout ? layout.box : "sf-avatar--picture", context.size ? `sf-avatar--size-${context.size}` : "", context.line ? `sf-avatar--line-${context.line}` : "", layout ? layout.inline : ""].filter(Boolean);

  if (context.isText) {
    classes.push("sf-avatar--text");
    if (layout) classes.push(layout.center); // The hue's role set (core .sf-hue-<name>, C17); the class sheet
    // draws the plate and the ink from it.

    if (context.resolvedHue) {
      classes.push(`sf-hue-${context.resolvedHue}`);
    }
  }

  if (!context.isText) {
    classes.push("sf-avatar--placeholder");
    if (layout) classes.push(layout.center);
  } // The decorative level (C91 level 2): the sheet turns the initials'
  // plate of the largest size into a cover of its hue.


  if (context.expressive) {
    classes.push("sf-avatar--expressive");
  }

  if (context.status && context.status !== "none" && layout) {
    classes.push(layout.anchor);
  }

  if (context.shape === "square") {
    classes.push("sf-avatar--square");
  }

  if (context.status === "online") {
    classes.push("sf-avatar--status-icon-online-indicator");
  }

  if (options.disabled) {
    classes.push("disabled");
  }

  if (includeRootClass && context.rootClass) {
    classes.push(context.rootClass);
  }

  if (options.extraClass) {
    classes.push(options.extraClass);
  }

  return classes.join(" ");
} // The photo says when it has come or failed (C152 (2)): the sheet fades it
// in over the initials when loaded and drops it on an error, so the avatar is
// never an empty circle or the browser's broken-image glyph. The state is
// the runtime mark data-sf-loaded ("true" or "error"), which the template
// does not bind, so a redraw keeps it, and which a first-paint snapshot
// leaves out (it depends on the network); a new address is a new element
// (keyed), which starts transparent again.

function onImageLoad(event) {
  event.currentTarget.dataset.sfLoaded = "true";
}

function onImageError(event) {
  event.currentTarget.dataset.sfLoaded = "error";
}
/**
 * What the circle holds: the initials, or the placeholder glyph as an sf-icon
 * element, so its name reaches the icon font request (a bare <i class="sf-icon">
 * drawn after the page's scan stayed blank: buttons review 2026-11-09); with a
 * photo, the photo over them (owner decision C152 (2)).
 */


function avatarContent(context) {
  const under = context.isText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar-text">${context.text}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.icon || AVATAR_PLACEHOLDER_ICON} aria-hidden="true"></sf-icon>`;
  if (!context.isImage) return under;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${under}${(0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(context.imageUrl, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-avatar-image" src=${context.imageUrl} alt="" loading=${context.lazy ? "lazy" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} decoding=${context.lazy ? "async" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @load=${onImageLoad} @error=${onImageError} />`)}`;
}
/** The icon names a picture draws (for a host's icon preload). */

function avatarPictureIcons(options = {}) {
  const context = avatarPictureContext(options);
  return context.isText ? [] : [context.icon];
}
/**
 * One avatar picture beside a host's own content: a span hidden from
 * assistive technology (the host's visible text names the person), drawn with
 * the avatars sheet. extraClass adds the host's own geometry class.
 */

function avatarPicture(options = {}) {
  const context = avatarPictureContext(options);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        class=${avatarClasses(context, {
    extraClass: options.extraClass,
    disabled: context.disabled
  })}
        style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-hidden="true"
    >${avatarContent(context)}</span>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "50a1017ded91"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5429d6e80991");
/* harmony import */ var _component_dropdown_interaction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("3a03d4610486");
/* harmony import */ var _component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a0f23dca0b37");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _component_panel_scrollbar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("cb6d39a52a42");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("1b42c5117087");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("b4d28078de6f");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("f15c795f1055");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("ad680c489766");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("8b3dd54aeaa8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_dropdown_interaction__WEBPACK_IMPORTED_MODULE_4__, _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_9__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_11__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_dropdown_interaction__WEBPACK_IMPORTED_MODULE_4__, _component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_9__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_11__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_11__);
















 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_15__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_16__.runtime
}; // sf-dropdown from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §17, §19): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json, and the old
// names -- type, sf-dropdown:change -- are dated aliases. Since 1.9.0 the
// host is the form control through ElementInternals (FormField): it submits
// the value, reports value-missing and the page's custom error, and the
// hidden input it still draws for the reset binding carries no name then
// (§17.1 item 6). Owner decision C55: it shows an error as sf-input does.
// The last pointer press on the page, wherever it was. A focus that arrives
// on the trigger from code right after a press elsewhere -- the browser moving
// to the first invalid field after a click on «Отправить» -- is not the
// keyboard's, so :focus-visible does not match and the field showed no ring
// (sf-input's text box always matches it). A press inside the dropdown or its
// list is the person's own focus and keeps the ring off, as before.

let lastPointerTarget = null;

if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', event => {
    lastPointerTarget = event.composedPath?.()[0] || event.target;
  }, true);
} // The action (§4.4) answers an outcome and is not a person's change, so it
// sends no event. As sf-input-quantity's: the message shown under the field
// and a custom error the form will not submit over; an empty message clears
// both.


const actions = {
  'set-error'({
    message
  } = {}) {
    const text = String(message ?? '');

    if (text) {
      this.setAttribute('error-message', text);
      this.setAttribute('invalid', '');
    } else {
      this.removeAttribute('error-message');
      this.removeAttribute('invalid');
    }

    this.setCustomValidity(text);
  }

};
const DropdownElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_13__, {
  base: (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_9__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default())),
  lang: {
    en,
    ru
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_14__,
  actions
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

class SfDropdown extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_10__.FormField)(DropdownElement) {
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
    this._documentClickHandler = this.handleDocumentClick.bind(this); // The page's scroll moves the field, so the list follows it; the list's
    // own scroll moves nothing, and placing the panel for it only interrupts
    // the wheel (owner R171).

    this._viewportHandler = event => {
      if ((0,_component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__.scrolledInside)(this._list, event)) return;
      this.positionPortalList();
    }; // value-missing, shown: set when the form's check fails on this field
    // (a submit attempt, checkValidity(), reportValidity()), gone once it
    // holds a value or the form is reset.


    this._missingShown = false;
    this._messageRef = ''; // C153 (3): never the browser's bubble; the first wrong field of a
    // submit takes the focus (helpers/form-field.js ownInvalid).

    (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_10__.ownInvalid)(this, () => {
      if (!this.validity?.valueMissing || this._missingShown) return;
      this._missingShown = true;
      this.requestComponentUpdate('invalid');
    });
    this.addEventListener('focusin', event => this.markFocusRing(event));
    this.addEventListener('focusout', event => this.markFocusRing(event, false));
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
  } // options is data, not a setting the manifest maps to an attribute, so it
  // is observed here: a page that rewrites the attribute redraws the list.


  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'options'])];
  }

  connectedCallback() {
    // A printed JSON island first (standard 1.3.8 §5.4): what is read below may be in it.
    this.sfReadIsland(); // Options printed as an attribute (JSON) are data, as the property is: the
    // selected option's text was empty when only the property was read.

    if (!this._optionsFromData && this.hasAttribute('options')) this.options = this.getAttribute('options');
    this.captureOptions();

    if (!Object.prototype.hasOwnProperty.call(this, '_resetValues')) {
      this._resetValues = [...this.selectedValues];
    }

    super.connectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'value') this._selectedValues = splitValues(newValue);
      if (name === 'options' && this.isConnected) this.options = newValue;

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
  } // A field with nothing chosen says so (choice fields, Larena 2026-11-06):
  // without a placeholder of its own it read as an empty box, and a host that
  // could not tell «unset» from «not drawn yet» drew the first option instead.
  // The word is the page's language; the value stays empty until a person
  // picks, and nothing is chosen for them.


  get placeholder() {
    return this.getAttribute('placeholder') || this.sfWord('empty');
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
  } // The error the field shows: the page's (invalid, error-message, set-error)
  // or, while it holds nothing, the required one the form's check found.


  get shownMissing() {
    return this._missingShown && !this.hiddenValue;
  }

  get shownInvalid() {
    return Boolean(this.invalid) || this.shownMissing;
  }

  get shownMessage() {
    if (this.invalid) return this.errorMessage || '';
    return this.shownMissing ? this.sfWord('value-missing') : '';
  } // The trigger is the control: focus(), the browser's pointer at the first
  // invalid field and the error's aria all go to it.


  triggerElement() {
    return this.querySelector('.sf-dropdown-field > button');
  }

  focusDelegate() {
    return this.triggerElement();
  } // §17.2: value-missing while required and empty (an inherited value does
  // not count), with the trigger as the place the browser points at.


  fieldValidity() {
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const valueMissing = required && !this.disabled && !this.hiddenValue;
    return {
      valueMissing,
      message: valueMissing ? this.sfWord('value-missing') : '',
      anchor: this.triggerElement()
    };
  } // The browser's restore of a form (back, reload) gives the value back.


  fieldRestore(state) {
    if (typeof state === 'string') this.value = state;
  } // A person's choice that leaves a value clears the error shown, the page's
  // as well (C55: «ошибка снимается при выборе»).


  clearShownError() {
    this._missingShown = false;

    if (this.invalid || this.hasAttribute('error-message')) {
      this.removeAttribute('error-message');
      this.removeAttribute('invalid');
      this.setCustomValidity('');
    }
  } // The ring on the field for a focus from code after a press elsewhere.


  markFocusRing(event, entering = true) {
    const trigger = this.triggerElement();
    if (!trigger || event.target !== trigger) return;
    const own = lastPointerTarget instanceof Node && (this.contains(lastPointerTarget) || Boolean(this._list?.contains(lastPointerTarget)));
    trigger.toggleAttribute('data-sf-focus-ring', entering && !own);
  } // aria-invalid and the message on the trigger. The interaction keeps its own
  // description (the chosen labels) in aria-describedby; only this message's
  // id is added and taken out here.


  syncErrorState() {
    const trigger = this.triggerElement();
    if (!trigger) return;
    const message = this.querySelector('.sf-dropdown-message');
    const id = message?.id || '';
    const refs = (trigger.getAttribute('aria-describedby') || '').split(/\s+/u).filter(ref => ref && ref !== this._messageRef && ref !== id);
    if (id) refs.push(id);
    this._messageRef = id;
    if (refs.length) trigger.setAttribute('aria-describedby', refs.join(' '));else trigger.removeAttribute('aria-describedby');
    if (this.shownInvalid) trigger.setAttribute('aria-invalid', 'true');else trigger.removeAttribute('aria-invalid');
    if (this.shownInvalid && id) trigger.setAttribute('aria-errormessage', id);else trigger.removeAttribute('aria-errormessage');
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
    } // An icon option is found by its glyph's words too, in Russian and in
    // English (owner decision C151 point 8, SF.icons.choices.words): a
    // product's chooser labels its options with the glyph name, and «папка»
    // found nothing in a grid of folder_open, topic and folder.


    return this.options.filter(option => {
      if (getOptionLabel(option).toLowerCase().includes(query)) return true;
      if (!option.icon) return false;
      const words = (0,_core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_12__.iconWords)(option.icon);
      return [...words.ru, ...words.en].some(word => word.toLowerCase().includes(query));
    });
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      open: this._open,
      multiple: this.multiple,
      value: this.hiddenValue,
      // The host is the form control where the browser has ElementInternals:
      // the hidden input carries no name then (§17.1 item 6).
      controlName: (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_10__.innerControlName)(this, this.name),
      invalid: this.shownInvalid,
      message: this.shownMessage,
      messageId: (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_11__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_11__.instancePath)(this, {
        kind: 'sf-dropdown'
      }), 'message'),
      triggerText: this.triggerText,
      searchValue: this._searchValue,
      searchPlaceholder: this.searchPlaceholder,
      placeholder: this.placeholder,
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
    this.positionPortalList(); // An open list that stays in place (portal off) marks its rows' scroll
    // area itself; a portalled one is marked by the portal (owner C07, R029).

    this._scrollbar ??= new _component_panel_scrollbar__WEBPACK_IMPORTED_MODULE_8__.PanelScrollbar();

    this._scrollbar.watch(this._open && !this.portal ? this._list?.querySelector('.sf-list-container-wrap') : null, 'sf-list-container-wrap--scrollbar');

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
    this.syncErrorState();
    this.sfSyncFormState();
    const resetControl = this.querySelector('.sf-dropdown-hidden-input') || this.querySelector('.sf-dropdown-field > button');

    if (this._resetControl !== resetControl) {
      this._releaseReset?.();
      this._resetControl = resetControl;
      this._releaseReset = resetControl ? (0,_component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__.bindFormReset)(resetControl, () => {
        this._interaction?.beforeClose();
        this._selectedValues = [...this._resetValues];
        this.setAttributeValue('value', serializeValues(this._selectedValues));
        this._open = false;
        this._searchValue = '';
        this._missingShown = false; // Native reset may change the display even when Lit's cached value has
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
    this._scrollbar?.disconnect();
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
    if (values.length) this.clearShownError();
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
      (0,_component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__.closeDropdownPortal)(this._list); // In place: the list grows toward the side the screen has room on.

      if (this._open) (0,_component_dropdown_portal__WEBPACK_IMPORTED_MODULE_6__.alignDropdownInPlace)(this._list);
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f39dc444b059");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c69a3dc158df");
/* harmony import */ var _list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("c22590307c6c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__, _list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__, _list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
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
      if (next) parts.push((0,_list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderListItemHeading)(next, option.size));
    } // Where several options may be chosen, each one carries the box that says
    // so: a plain row said it was chosen with a class and aria-selected alone,
    // so on a long list nothing on screen told the person what they had picked
    // (Larena storage QA, 2026-10-22). An option that draws a picture of its
    // own -- an icon, a colour, an avatar -- keeps it, because that is the
    // place the box would take; an avatar or a colour row then draws its box
    // after the picture, and only in a multiple list (C08: a single choice
    // is the row's fill, no box).


    const withBox = multiple && (!option.type || option.type === "text");
    parts.push((0,_list_item_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderListItemOption)(withBox ? { ...option,
      type: "checkbox"
    } : option, {
      multiple
    }));
  }

  return parts;
} // A tag in the field is part of the field (owner decision C145 (1), variant
// A): inline, one size below the field, so its label is one text step under
// the field's; the field gives it its height (the field less --sf-space-1/4
// above and below) as its line. From size 1 up it was a low chip of the
// field's own size (C27), 32 in a 40 field.


const FIELD_TAG = Object.freeze({
  "1/2": {
    size: "1/3",
    height: ""
  },
  "1": {
    size: "1/2",
    height: ""
  },
  "2": {
    size: "1",
    height: ""
  }
}); // A single choice shows its picture in the field as well as its label. The
// pictures of a choice -- this one and an icon tag's -- are sf-icon elements,
// as in every other component: the element tells the Loader its name, so the
// name joins the first icon font request. A bare <i class="sf-icon"> drawn
// here after the page's scan was found only later and its glyph came late
// (the defect sf-tag 1.3.2 fixed, 2026-11-09).

function renderFieldVisual(context) {
  if (context.multiple || context.selectedOptions?.length !== 1) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const option = context.selectedOptions[0];

  if (option.type === "icon" && option.icon) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${option.icon} root-class="sf-dropdown-field-visual" aria-hidden="true"></sf-icon>`;
  }

  if (option.type === "color" && option.colorClass) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tag-color-icon sf-dropdown-field-visual ${option.colorClass}" aria-hidden="true"></span>`;
  } // sf-avatar's own drawing (js/picture.js, avatar study AV-8): the photo an
  // <img>, else the initials of the option's name, else the person glyph.


  if (option.type === "avatar") {
    return (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__.avatarPicture)({
      size: "1/2",
      imageUrl: option.avatarImageUrl,
      name: option.avatarTitle || option.text,
      extraClass: "sf-dropdown-field-visual"
    });
  }

  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderTag(context, option) {
  const label = getOptionLabel(option);
  const fieldTag = FIELD_TAG[context.size] || FIELD_TAG["1"];
  const tagSize = fieldTag.size;
  const tagSpacing = fieldTag.height ? ` sf-tag--height-${fieldTag.height}` : "";
  const tagType = option.type === "color" ? "color" : option.type === "avatar" ? "avatar" : "icon";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class="sf-tag transition sf-tag--${tagType} sf-tag--size-${tagSize} sf-tag--inline${tagSpacing} flex flex-row flex-nowrap items-center active"
      data-value=${option.value}
    >
      ${option.type === "color" ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tag-color-icon ${option.colorClass}" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${option.type === "icon" ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${option.icon} root-class="sf-tag-icon" aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${option.type === "avatar" ? (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__.avatarPicture)({
    size: tagSize,
    imageUrl: option.avatarImageUrl,
    name: option.avatarTitle || option.text
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
  const rootClasses = ["sf-dropdown", context.rootClass, context.open ? "open" : "", context.open ? "sf-dropdown--open" : "", `sf-dropdown--size-${context.size}`, `sf-dropdown--${context.appearance ?? context.type}`, context.mode === "tag" ? "sf-dropdown--tag" : "", context.layout === "grid" ? "sf-dropdown--grid" : "", context.mode !== "tag" ? "sf-dropdown--text" : "", context.disabled ? "disabled" : "", // The error look, as sf-input's root carries it (owner C55).
  context.invalid ? "error" : "", "flex", "flex-col"].filter(Boolean);
  const fieldClasses = ["sf-dropdown-field", !context.disabled ? "cursor-pointer" : "", "items-cross-center", "relative", "transition", "flex"].filter(Boolean); // The chevron is the field's indicator (owner decision C123 (3)): the field
  // layer's .sf-field-action, a glyph without a plate the size of the field's
  // leading picture, quiet at rest and the text's ink while the field is
  // under the pointer. It stays the button that holds the combobox's focus
  // and names (component/dropdown/interaction.js), the field's one Tab stop
  // whose ring the field draws; the whole field opens the list.
  // The chevron and the search glyph are sf-icon elements, as the pictures
  // of a choice are (1.8.0): the element tells the Loader its name, so it
  // joins the first icon font request instead of a later round (1.8.1).
  // Their size and colour stay the field's and the list's, which reach the
  // glyph inside the sf-icon (display: contents).

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
                  name=${context.controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
            name=${context.controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
            class="sf-field-action sf-field-action--indicator sf-dropdown-chevron"
            ?disabled=${context.disabled}
          >
            <sf-icon icon=${dropdownIcon} aria-hidden="true"></sf-icon>
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
        ${(0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__.renderInheritedSlot)(context.component, {
      size: context.size,
      disabled: context.disabled
    })}
        <button
          type="button"
          class="sf-field-action sf-field-action--indicator sf-dropdown-chevron absolute"
          ?disabled=${context.disabled}
        >
          <sf-icon icon=${dropdownIcon} aria-hidden="true"></sf-icon>
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
              ${context.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-dropdown-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              ${(0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_1__.renderFieldHelp)({
    help: context.help,
    label: context.label,
    size: context.size,
    className: 'sf-dropdown-help',
    component: context.component
  })}
            </span>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${renderTrigger()}
      ${context.message // Under the field, in sf-input's field-message type, at the field's
  // own gap (owner C55). No error icon, as sf-input draws none.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
            id=${context.messageId}
            class="sf-dropdown-message"
            data-field-message=${context.invalid ? "error" : "hint"}
          >${context.message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <div
        class=${`sf-list sf-list--size-${context.size} flex flex-col${context.component?.hasSlotContent?.('trigger') ? " sf-list--free-width" : ""}`}
        style=${`--sf-list--cell: ${CELL[context.size] || CELL["1"]}`}
        ?hidden=${!context.open}
      >
        ${context.search // The search is the panel's header (owner C06, docs review R029):
  // its icon over the rows' icons, its text over their text, no frame.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <label class="sf-list-search">
                <sf-icon icon="search" root-class="sf-list-search-icon" aria-hidden="true"></sf-icon>
                <input
                  class="sf-list-search-input"
                  placeholder=${context.searchPlaceholder}
                  aria-label=${context.searchPlaceholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  type="text"
                  .value=${context.searchValue || ""}
                  ?disabled=${context.disabled}
                  @input=${event => context.component.handleSearchInput(event)}
                  @change=${event => event.stopPropagation()}
                  @click=${event => event.stopPropagation()}
                />
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

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   ShownRequired: () => (/* binding */ ShownRequired),
/* harmony export */   ShownValidity: () => (/* binding */ ShownValidity),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   VALIDITY_WORDS: () => (/* binding */ VALIDITY_WORDS),
/* harmony export */   claimFirstInvalid: () => (/* binding */ claimFirstInvalid),
/* harmony export */   forgetFormTried: () => (/* binding */ forgetFormTried),
/* harmony export */   formTried: () => (/* binding */ formTried),
/* harmony export */   hasFieldWord: () => (/* binding */ hasFieldWord),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   ownInvalid: () => (/* binding */ ownInvalid),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity),
/* harmony export */   validityWords: () => (/* binding */ validityWords)
/* harmony export */ });
// The form-control half of a field built from its component.json (standard
// simai.smart-component 1.3.8 §17.1, §17.2), shared by the field family.
//
// core/js/element-manifest.js makes the host form-associated and gives it
// ElementInternals, sfFormValue() and sfSyncForm(). What a field adds is the
// same in every member, so it is written once here:
//
// - validity (§17.2): the host reports what its inner native control knows
//   (value-missing, too-short, pattern-mismatch, ...) with the control as the
//   anchor, so reportValidity() points at the box the person types in; a
//   custom error set with setCustomValidity() or the action set-error wins
//   until it is cleared;
// - the inner controls stay out of the page's form (§17.1 item 6): they carry
//   no name while the host is the form control;
// - a field with no inner native control to read (a list of buttons, a
//   picker, a file area) says what it knows itself with `fieldValidity()`:
//   value-missing while `required` and the form value is empty by default,
//   and where the browser points;
// - form reset and fieldset[disabled] (§17.1 items 3, 4): `form.reset()`
//   calls the component's `fieldReset()` when it has one (its default back,
//   without events), and the host syncs its form value and validity after the
//   browser has reset its parts;
// - restore: `formStateRestoreCallback` hands the saved form value to
//   `fieldRestore(state)` when the component has one.
//
// Usage, over the element core/js/element-manifest.js gives:
//
//   const Element = elementFromManifest(manifest, {base: SfBaseElement, ...});
//   class SfThing extends FormField(Element) { ... }
//
// Without ElementInternals nothing here runs, and the named inner control
// submits as it always did (§16 item 11).
// ValidityState's own flags, in the order of §17.2's list.
const VALIDITY_FLAGS = Object.freeze(['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput']);
/** The name an inner native control carries: none while the host submits (§17.1 item 6). */

function innerControlName(component, name) {
  return component?.sfInternals ? '' : String(name || '');
}
/**
 * The host's validity from its inner control: the control's failed flags and
 * message, or the custom error the page set, or valid. `own` adds flags the
 * component reads itself, {flag: message} (a number field's range and step,
 * which its text box cannot know).
 */

function syncFieldValidity(component, control, own = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;

  try {
    const custom = component.sfCustomError || '';

    if (custom) {
      internals.setValidity({
        customError: true
      }, custom, control || undefined);
      return;
    }

    const validity = control?.validity;
    const flags = {};
    let message = '';

    if (validity && !validity.valid && control.willValidate !== false) {
      for (const flag of VALIDITY_FLAGS) if (validity[flag]) flags[flag] = true;

      message = control.validationMessage;
    }

    for (const [flag, text] of Object.entries(own || {})) {
      flags[flag] = true;
      message ||= String(text || '');
    }

    if (Object.keys(flags).length) internals.setValidity(flags, message || ' ', control || undefined);else internals.setValidity({});
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The host's validity from what the component says itself (fieldValidity()):
 * value-missing, too-long (a counted field past its limit, helpers/char-count.js)
 * and the custom error the page set; `anchor`, when it is a part of the host,
 * is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  tooLong = false,
  message = '',
  anchor = null
} = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;
  const custom = component.sfCustomError || '';
  const flags = {};
  let text = '';

  if (custom) {
    flags.customError = true;
    text = custom;
  }

  if (valueMissing) {
    flags.valueMissing = true;
    text ||= message || 'value-missing';
  }

  if (tooLong) {
    flags.tooLong = true;
    text ||= message || 'too-long';
  }

  try {
    if (Object.keys(flags).length) {
      const target = anchor && component.contains?.(anchor) ? anchor : undefined;
      internals.setValidity(flags, text, target);
    } else {
      internals.setValidity({});
    }
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The field family's form plumbing over a manifest element. A component
 * names the control its validity comes from with `sfValidityAnchor()`
 * (default: getInputElement()).
 */

const FormField = Base => class extends Base {
  constructor() {
    super(); // A person's edit reaches the host as input/change; the form value and
    // validity follow it without a redraw.

    this.__sfFormSync = () => this.sfSyncFormState();

    this.addEventListener('input', this.__sfFormSync);
    this.addEventListener('change', this.__sfFormSync);
  }

  sfValidityAnchor() {
    return this.getInputElement?.() || null;
  }
  /**
   * What the component knows of its validity itself, {valueMissing, message,
   * anchor}, or null when an inner native control's ValidityState is the
   * answer (sfValidityAnchor()). With no such control: value-missing while
   * `required` and the form value is empty. A component overrides it.
   */


  fieldValidity() {
    if (this.sfValidityAnchor()) return null;
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const value = this.sfFormValue?.();
    const valueMissing = required && !this.disabled && (value === null || value === undefined || value === ''); // The word only when it is said: asked on every sync, a component without
    // it warned «no word value-missing» on each optional field (simai.main,
    // sf-button-group in property-view's choice field, 2026-10-28).

    return {
      valueMissing,
      message: valueMissing ? this.sfWord?.('value-missing') || 'value-missing' : '',
      anchor: null
    };
  }
  /** The validity, now: the component's own account, or its inner control's. */


  sfSyncValidity() {
    const own = this.fieldValidity();
    if (own) syncOwnValidity(this, own);else syncFieldValidity(this, this.sfValidityAnchor());
  }
  /** The form value and the validity, now. */


  sfSyncFormState() {
    this.sfSyncForm?.();
    this.sfSyncValidity();
  }
  /** §17.2: a custom error keeps the form from submitting until it is cleared. */


  setCustomValidity(message = '') {
    this.sfCustomError = String(message ?? '');
    this.sfSyncValidity();
  } // fieldReset() puts the component's default back, without events. The
  // browser resets the parts after it calls this: the sync waits for them,
  // and once more for the parts that put their own default back a task later
  // (component/form-reset-helper.js: masks, the checkables' attributes).


  formResetCallback() {
    if (typeof this.fieldReset === 'function') {
      try {
        this.fieldReset();
      } catch (error) {
        this.reportComponentError?.(error, 'form reset');
      }
    }

    this.sfSyncFormState();
    Promise.resolve().then(() => this.sfSyncFormState());
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  formStateRestoreCallback(state) {
    if (typeof this.fieldRestore === 'function') this.fieldRestore(state);
    this.sfSyncFormState();
  }

}; // The word key a failed validity flag is said with (owner decision C153 (3)):
// each component carries these words in its lang/<locale>.json runtime
// words, in the page's language (LC-9), never the browser's.

const VALIDITY_WORDS = Object.freeze({
  valueMissing: 'value-missing',
  typeMismatch: 'type-mismatch',
  patternMismatch: 'pattern-mismatch',
  tooShort: 'too-short',
  tooLong: 'too-long',
  rangeUnderflow: 'range-underflow',
  rangeOverflow: 'range-overflow',
  stepMismatch: 'step-mismatch',
  badInput: 'bad-input'
}); // One check pass across every field of a page (C153 (3)): a submit attempt,
// reportValidity() or checkValidity() fires `invalid` on every wrong field
// in tree order, synchronously. The first wrong field of a pass the person
// started (a press or Enter in this task) takes the focus; the rest show
// their errors and keep still. The fields are separate bundles, each with its
// own copy of this module, so the pass lives on a shared global.

const CHECK_KEY = Symbol.for('simai.framework.field-check');

function fieldCheck() {
  const shared = globalThis[CHECK_KEY] || (globalThis[CHECK_KEY] = {
    activated: false,
    focused: false,
    tried: new WeakSet()
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const mark = event => {
      if (event.type === 'keydown' && event.key !== 'Enter') return;
      shared.activated = true;
      setTimeout(() => {
        shared.activated = false;
      }, 0);
    };

    document.addEventListener('click', mark, true);
    document.addEventListener('keydown', mark, true);
  }

  return shared;
}
/**
 * Says that `element` failed a check now. Returns true when it is the first
 * wrong field of a pass the person started, the one that takes the focus.
 * Every member of the field family calls it from its `invalid` listener.
 */


function claimFirstInvalid(element) {
  const check = fieldCheck();
  const form = element?.form || element?.closest?.('form') || null;
  if (form) check.tried.add(form);
  if (!check.activated || check.focused) return false;
  check.focused = true;
  setTimeout(() => {
    check.focused = false;
  }, 0);
  return true;
}
/**
 * For a member that draws its own errors on `invalid` (C153 (3)): the
 * browser's bubble is cancelled on the host and on every native control
 * inside it, `show` runs for the host's own event, and the first wrong field
 * of a submit the person made takes the focus. Returns the listener, to
 * remove with removeEventListener('invalid', listener, true).
 */

function ownInvalid(component, show) {
  fieldCheck();

  const listener = event => {
    event.preventDefault();
    if (event.target !== component) return;
    const first = claimFirstInvalid(component);
    show?.(event);

    if (first) {
      const target = component.focusDelegate?.() || component.sfValidityAnchor?.() || component;

      try {
        target.focus?.();
      } catch {
        /* a field taken out of the page while the check ran */
      }
    }
  };

  component.addEventListener('invalid', listener, true);
  return listener;
}
/** A submit attempt has failed on this field's form since its last reset. */

function formTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  return Boolean(form && fieldCheck().tried.has(form));
}
/** Forgets the failed attempt of a form (form.reset()). */

function forgetFormTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  if (form) fieldCheck().tried.delete(form);
}
/** Whether the component's dictionaries hold a word, in any language. */

function hasFieldWord(component, key) {
  const words = component?.constructor?.sfWords || {};
  return Object.values(words).some(dictionary => dictionary && dictionary[key] !== undefined && dictionary[key] !== null);
}
/**
 * The words a field says for its validity now (C153 (3)): the page's custom
 * error as written; else the first failed flag in the component's own words,
 * with the limit it broke ({min}, {max}, {step}); a type mismatch of an
 * e-mail or a web address has its own word (type-mismatch-email,
 * type-mismatch-url). A flag the component has no word for says what the
 * component itself set (its own count, range or file words), never the
 * browser's. '' while valid.
 */

function validityWords(component, control = component?.sfValidityAnchor?.()) {
  const validity = component?.validity;
  if (!validity || validity.valid) return '';
  if (validity.customError) return component.validationMessage || '';

  const read = name => control?.getAttribute?.(name) ?? component.getAttribute?.(name) ?? '';

  for (const flag of VALIDITY_FLAGS) {
    if (!validity[flag]) continue;
    let key = VALIDITY_WORDS[flag];

    if (flag === 'typeMismatch') {
      const type = String(control?.type || '').toLowerCase();
      if ((type === 'email' || type === 'url') && hasFieldWord(component, `${key}-${type}`)) key = `${key}-${type}`;
    }

    if (hasFieldWord(component, key)) {
      return component.sfWord(key, {
        vars: {
          min: read(flag === 'tooShort' ? 'minlength' : 'min'),
          max: flag === 'tooLong' ? component.maxlength ?? read('maxlength') : read('max'),
          step: read('step')
        }
      });
    }

    return component.validationMessage || '';
  }

  return component.validationMessage || '';
}
/**
 * The errors a field shows itself (owner decision C153 (3), for the whole
 * field family as C55): never the browser's bubble, always the component's
 * words in the page's language.
 *
 * - A failed check of the form -- a submit attempt, reportValidity(),
 *   checkValidity() -- shows the error on every wrong field at once, and the
 *   first wrong field of a submit the person made takes the focus
 *   (claimFirstInvalid). The browser's bubble, on the host and on the native
 *   control inside it, is cancelled.
 * - After that, or once the person has changed the value, leaving the field
 *   checks it: a wrong value shows its error, a right one clears it.
 * - While the person types, a shown error goes the moment the value is right;
 *   a still-wrong value keeps it, in the words of what is wrong now. Nothing
 *   is shown while typing into a field that showed no error.
 * - form.reset() takes every shown error away.
 *
 * The page's invalid / error-message win over it. Usage, over FormField:
 * `class SfThing extends ShownValidity(FormField(Element))`; the template
 * reads `sfShownInvalid(invalid)` and `sfShownMessage(invalid, errorMessage)`
 * instead of the bare settings. ShownRequired, its name before C153, stays
 * the same mixin.
 */

const ShownValidity = Base => class extends Base {
  constructor() {
    super();
    this.__sfErrorShown = false;
    this.__sfTouched = false; // The page-wide pass listens from the first field on, so the press that
    // submits is seen before the check it starts.

    fieldCheck(); // Capture: the host's own `invalid` and its native control's, which
    // would draw a second bubble; neither bubbles, so only capture sees both.

    this.addEventListener('invalid', event => {
      event.preventDefault();
      if (event.target !== this) return;
      const first = claimFirstInvalid(this);

      if (!this.__sfErrorShown) {
        this.__sfErrorShown = true;
        this.requestComponentUpdate?.('invalid');
      } else {
        this.requestComponentUpdate?.('validity');
      }

      if (first) this.sfFocusFirstInvalid();
    }, true);
    this.addEventListener('input', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('change', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('focusout', event => {
      if (event.relatedTarget && this.contains(event.relatedTarget)) return; // A layer of the field (a list, a picker) holds the focus for it.

      if (this.matches?.(':focus-within')) return;
      if (!this.__sfTouched && !formTried(this)) return;
      this.sfSyncValidity?.();
      const wrong = this.validity ? !this.validity.valid : false;

      if (wrong !== this.__sfErrorShown) {
        this.__sfErrorShown = wrong;
        this.requestComponentUpdate?.('validity');
      } else if (wrong) {
        this.requestComponentUpdate?.('validity');
      }
    });
  }
  /** The first wrong field of a submit takes the focus, as the browser's check did. */


  sfFocusFirstInvalid() {
    const target = this.focusDelegate?.() || this.sfValidityAnchor?.() || this;

    try {
      target.focus?.();
    } catch {
      /* a field taken out of the page while the check ran */
    }
  } // A shown error goes the moment the value is right, whatever made it right:
  // the person's input or change, a value set from script, a value attribute
  // (C55 acceptance F1 R2, D1). A still-wrong value redraws its words.


  sfSyncFormState() {
    super.sfSyncFormState?.();
    if (!this.__sfErrorShown) return;

    if (this.validity && !this.validity.valid) {
      const words = validityWords(this);

      if (words !== this.__sfShownWords) {
        this.__sfShownWords = words;
        this.requestComponentUpdate?.('validity');
      }

      return;
    }

    this.__sfErrorShown = false;
    this.__sfShownWords = '';
    this.requestComponentUpdate?.('value');
  }
  /** An error is shown now (the page's own invalid aside). */


  get sfErrorShown() {
    return this.__sfErrorShown;
  }
  /** The name before C153, kept for the components that read it. */


  get sfMissingShown() {
    return this.__sfErrorShown;
  }
  /** The invalid state the field draws: the page's, or the one it shows itself. */


  sfShownInvalid(invalid) {
    return Boolean(invalid) || this.__sfErrorShown;
  }
  /** The message under the field: the page's while it says invalid, else the shown error's words. */


  sfShownMessage(invalid, errorMessage) {
    if (invalid) return errorMessage || '';
    if (!this.__sfErrorShown) return '';
    const words = validityWords(this);
    this.__sfShownWords = words;
    return words;
  }

  formResetCallback() {
    const shown = this.__sfErrorShown;
    this.__sfErrorShown = false;
    this.__sfTouched = false;
    this.__sfShownWords = '';
    forgetFormTried(this);
    super.formResetCallback?.();
    if (shown) this.requestComponentUpdate?.('reset');
  }

};
/** The mixin's name before owner decision C153 (C55 acceptance F1). */

const ShownRequired = ShownValidity;

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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _inherited_value_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c6c9dfe31af4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__);



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
// The trait's event, one name for the whole family (§8, §20.2). The field
// sends this name; the dated `sf-field:reset` follows it, with the same detail
// and one cancel, from the alias shim (aliases.json, §16 item 20).

const INHERITED_RESET_EVENT = 'sf-field-reset'; // The marker and the reset, in the page's language. A product names its own
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
// The marker is one step down the ladder from the field it sits in, so it
// reads as a note about the value. (The reset was a button of that step too,
// a 32px button in a 40px field; since C123 it is the field's own action at
// the field's glyph size, see renderInheritedSlot.)
// sf-input's outer steps: a 3 field's marker is a 2; 1/3 is the ladder's
// foot, so its marker stays at 1/3.

const STEP_DOWN = Object.freeze({
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/2',
  '2': '1',
  '3': '2'
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
   * Back to the inherited value. Fires `sf-field-reset` first, cancellable:
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

    this.syncInheritedNote(control, inherited);
  } // A browser reads aria-describedby instead of aria-description, so a field
  // that also has a hint, an error or a description (aria-describedby) would
  // say those and drop the inherited sentence. While the inherited state
  // applies and something else describes the control, the sentence is also a
  // hidden note in the host that aria-describedby names after the ids already
  // there. Written once here for the whole family (sf-input, sf-textarea,
  // sf-quantity, sf-dropdown, sf-color, sf-switch); the id comes from the
  // instance path, never a counter.


  syncInheritedNote(control, inherited) {
    let note = this.querySelector(':scope > [data-sf-inherited-note]');
    const others = String(control.getAttribute('aria-describedby') || '').split(/\s+/u).filter(id => id && id !== note?.id);

    if (inherited && others.length && this.isConnected) {
      if (!note) {
        note = document.createElement('span');
        note.hidden = true;
        note.setAttribute('data-sf-inherited-note', '');
        this.append(note);
      }

      if (!note.id) note.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
        kind: this.localName
      }), 'inherited');
      note.textContent = this.inheritedDescription();
      const ids = [...others, note.id].join(' ');
      if (control.getAttribute('aria-describedby') !== ids) control.setAttribute('aria-describedby', ids);
    } else if (note) {
      note.remove();
      if (others.length) control.setAttribute('aria-describedby', others.join(' '));else control.removeAttribute('aria-describedby');
    }
  }

};
/**
 * The marker and the reset, for a control's trailing slot. Nothing at all
 * without an inherited value, so a field that does not use it is unchanged.
 *
 * The reset is an action of the field (owner decision C123, variant A): the
 * field layer's .sf-field-action (component.inputs), the glyph sf-input's
 * clear and reveal draw -- no plate in any state, the quiet ink at rest and the
 * text's ink under the pointer and on a press, the keyboard ring round the
 * glyph, an invisible hit area. Its glyph is the field's leading-icon size
 * (the field's text line), not a step down; the marker keeps the step down.
 * Each field says its step through --sf-field-action--glyph, --height and
 * --inset (inherited-value.css). It was a link icon button of the step below.
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
        class="sf-field-action sf-field-reset"
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

/***/ "cbce4a5232a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInitials: () => (/* binding */ getInitials),
/* harmony export */   normalizeInitialsWords: () => (/* binding */ normalizeInitialsWords)
/* harmony export */ });
const INITIALS_SKIP_WORDS = new Set(["а", "без", "в", "во", "для", "до", "за", "из", "из-за", "из-под", "и", "к", "ко", "между", "на", "над", "о", "об", "от", "по", "под", "при", "про", "с", "со", "у", "через", "the", "a", "an", "and", "for", "from", "in", "of", "on", "to"]); // Words a name carries that are not the person's or the organisation's own
// (owner decision C152 (3), 2026-11-14): legal forms (ООО «Ромашка» → Р),
// titles (Dr. John Smith → JS) and name particles (Мария фон Штейн → МШ) are
// skipped wherever they stand. Compared without case and without the dots
// around them (normalizeInitialsWords strips those).

const INITIALS_SERVICE_WORDS = new Set([// legal forms
"ооо", "оао", "зао", "пао", "ао", "нао", "ип", "нко", "ано", "гуп", "муп", "фгуп", "гбу", "мбу", "чоп", "llc", "inc", "ltd", "gmbh", "ag", "corp", "co", "llp", "plc", "lp", "bv", "oy", "ab", "srl", "sarl", // titles
"dr", "prof", "mr", "mrs", "ms", "mx", "miss", "sir", "jr", "sr", "phd", "д-р", "проф", "акад", "г-н", "г-жа", "доц", // particles
"фон", "ван", "дер", "де", "ди", "да", "дю", "ла", "ле", "ибн", "бен", "оглы", "кызы", "von", "van", "der", "den", "de", "di", "da", "du", "del", "della", "la", "le", "ten", "ter", "bin", "ibn"]);
function normalizeInitialsWords(value = "") {
  return String(value || "").trim().split(/[\s/|]+/).map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);
} // The first character a reader sees: a whole grapheme, so a letter written
// with a combining accent («E» + U+0301) or outside the basic plane keeps all
// of its code points. Array.from alone splits surrogate pairs correctly but
// not combining marks; Intl.Segmenter does both where the platform has it.

function firstGrapheme(word) {
  const Segmenter = globalThis.Intl?.Segmenter;

  if (typeof Segmenter === "function") {
    for (const {
      segment
    } of new Segmenter(undefined, {
      granularity: "grapheme"
    }).segment(word)) {
      return segment;
    }

    return "";
  }

  return Array.from(word)[0] || "";
} // The one rule for initials (reuse audit 2026-11-02, finding 10): sf-avatar,
// the context menu, the admin menu and the chat drew them by five rules that
// disagreed on a hyphen, an empty name and a letter outside the basic plane.
//
//   «Анна Смирнова»        → «АС»   the first letters of the first two words
//   «Отдел по работе»      → «ОР»   a preposition after the first word is skipped
//   «Жан-Поль»             → «ЖП»   one hyphenated word reads as its parts
//   «Анна-Мария Смирнова»  → «АС»   ...but a name of several words by its words
//   «Анна»                 → «А»
//   «ООО «Ромашка»»        → «Р»    legal forms, titles, particles skipped (C152)
//   «Мария фон Штейн»      → «МШ»
//   «Dr. John Smith»       → «JS»
//   «anna@simai.ru»        → «A»    an address: the first letter before «@»
//   «»                     → ''     or `fallback`: '?' where text must stand
//
// `maxLetters` caps the letters (two), `skipWords` replaces the skipped words,
// `locale` capitalises by a locale's rule.


function getInitials(value = "", options = {}) {
  const {
    maxLetters = 2,
    skipWords = INITIALS_SKIP_WORDS,
    fallback = "",
    locale
  } = options;
  let source = String(value ?? "").trim(); // An address reads by the name before «@»: one letter (C152 (3)),
  // anna@simai.ru → A, not the letters of its parts.

  if (/^[^\s@]+@[^\s@]+$/u.test(source)) {
    const local = normalizeInitialsWords(source.slice(0, source.indexOf("@")).replace(/[._+-]+/gu, " "));
    if (!local.length) return String(fallback);
    const letter = firstGrapheme(local[0]);
    return (locale ? letter.toLocaleUpperCase(locale) : letter.toUpperCase()) || String(fallback);
  }

  const allWords = normalizeInitialsWords(source); // Legal forms, titles and particles go first; a name made of them alone
  // keeps them, so it still has initials.

  const ownWords = allWords.filter(word => !INITIALS_SERVICE_WORDS.has(String(word).toLowerCase()));
  const words = ownWords.length ? ownWords : allWords;
  let significantWords = words.filter((word, index) => index === 0 || !skipWords.has(String(word).toLowerCase())); // One word written with a hyphen or a dash is a compound name: its parts
  // are its words. Split before the skip list, «из-за» would be two words.

  if (significantWords.length === 1) {
    const parts = significantWords[0].split(/[-\u2010-\u2015]+/u).filter(Boolean);
    if (parts.length > 1) significantWords = parts;
  }

  if (!significantWords.length) {
    return String(fallback);
  }

  const letters = significantWords.length > 1 ? significantWords.slice(0, Math.max(1, maxLetters)).map(firstGrapheme).join("") : firstGrapheme(significantWords[0]);
  return (locale ? letters.toLocaleUpperCase(locale) : letters.toUpperCase()) || String(fallback);
}

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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c69a3dc158df");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_size__WEBPACK_IMPORTED_MODULE_1__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_size__WEBPACK_IMPORTED_MODULE_1__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
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
  const classes = ["sf-list-item", "flex", "items-cross-center", `sf-list-item--${context.kind ?? context.type}`, `sf-list-item--size-${context.size}`, isOption ? "cursor-pointer" : "", context.selected ? "selected" : "", context.disabled ? "disabled" : "", twoLine ? "sf-list-item--two-line" : "", !isOption && context.interactive ? "sf-list-item--interactive" : "", handleSlot ? "sf-list-item--sortable" : "", !isOption && context.pinned ? "sf-list-item--pinned" : "", // Owner decision C148: an inset line under the row (divided), a title
  // of up to two lines (lines="2"). An option keeps neither.
  !isOption && context.divided ? "sf-list-item--divided" : "", !isOption && String(context.lines) === "2" ? "sf-list-item--lines-2" : "", context.rootClass].filter(Boolean);
  const wrapClasses = ["sf-list-item-wrap", "flex", "flex-1"];
  const isDecoratedType = ["icon", "checkbox", "avatar", "color"].includes(context.type); // The step between the picture and the text is the row's own (C105 H2,
  // HS-5): the list item sheet sets it from the size and the density. A layout
  // class here (gap-2, --sf-space-2) put 20 between them at every size.

  if (isDecoratedType) {
    wrapClasses.push("flex", "flex-row", "flex-nowrap", "items-center");
  }

  if (isOption && context.type === "avatar" || context.type === "color") {
    wrapClasses.push("justify-between");
  }

  const renderLeading = () => {
    if (leadingContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) return leadingContent; // An icon row's picture is an sf-icon element (1.2.7): its name joins the
    // first icon font request. A bare <i class="sf-icon"> printed after the
    // page's icon scan -- every option of an opened sf-dropdown -- was found a
    // round later and its glyph came late. The row's size and colour reach
    // the glyph inside it (display: contents).

    if (context.type === "icon") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.icon} aria-hidden="true"></sf-icon>`;
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
      // sf-avatar's own drawing (js/picture.js, avatar study AV-8): the photo
      // an <img>, else the initials of the title on the neutral plate, else
      // the person glyph. It was a background image, and with no photo an
      // empty circle.
      const avatarSize = context.sizeGroup.item === "1/3" || context.sizeGroup.item === "1/2" ? "1/3" : context.sizeGroup.item === "1" ? "1/2" : context.sizeGroup.item === "2" ? "1" : "2"; // A row outside a dropdown (list item study LI-5): the picture is the
      // row's leading part, as an icon row's glyph is, and the title and its
      // supporting line are the row's own text block. In the label group the
      // supporting line was dropped (a 28 row at size 1, under the ladder).
      // An option keeps the label group sf-dropdown reads.

      if (!isOption) {
        return (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__.avatarPicture)({
          size: avatarSize,
          imageUrl: context.avatarImageUrl,
          name: context.avatarTitle,
          disabled: context.disabled
        });
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-avatar-label-group sf-avatar-label-group--size-${context.sizeGroup.avatarGroup} flex items-cross-center"
        >
          ${(0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__.avatarPicture)({
        size: avatarSize,
        imageUrl: context.avatarImageUrl,
        name: context.avatarTitle,
        disabled: context.disabled
      })}
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
    if (context.type === "avatar" && isOption) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // An avatar row's title is its text, else its avatar-title (the label
    // group showed avatar-title, which defaults to text).

    const title = context.type === "avatar" && !textContent ? context.avatarTitle : textContent;

    if (twoLine) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-item-container"><span class="sf-list-item-title">${title}</span><span class="sf-list-item-supporting">${supportingContent}</span></div>`;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-item-container">${title}</div>`;
  }; // The handle stands in a slot of its own before everything else; a pinned
  // row keeps the slot empty, so its text starts where its neighbours' does.


  const renderHandle = () => {
    if (!handleSlot) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-item-handle" ?data-sf-sortable-handle=${Boolean(sortableItem)} aria-hidden="true">${sortableItem ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
  };

  const renderTrailing = () => {
    // The row's end part is one box (owner decision C148 (2), (3)): a plain
    // <span slot="trailing"> gives the slot its children (the base unwraps a
    // wrapper that only names the slot), so loose nodes -- a time and a
    // badge, two buttons -- are put back in a box of the row's own. An
    // element the page gave keeps its own box.
    if (trailingContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
      if (isOption || typeof Element !== "undefined" && trailingContent instanceof Element) return trailingContent;
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-item-trailing">${trailingContent}</span>`;
    } // The box after a picture is a dropdown option's choice, and only where
    // the list may hold several chosen. A row outside a dropdown has no choice
    // to mark (docs precheck smart content LI-01: an empty checkbox stood at
    // the end of every such row); an option of a single choice says it is
    // chosen with its fill alone (owner C08; DEV P2, owner R143, 2026-11-12).


    if (isOption && context.multiple && (context.type === "avatar" || context.type === "color")) {
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

function renderListItemOption(option = {}, {
  multiple = false
} = {}) {
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
    multiple: Boolean(multiple),
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

/***/ "9d9903b87148"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/keyed.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/keyed.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "116963e5e31b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("position", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "a6b3ed0c1589"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_HUES: () => (/* binding */ AVATAR_HUES),
/* harmony export */   AVATAR_TONES: () => (/* binding */ AVATAR_TONES),
/* harmony export */   STATIC_HUES: () => (/* binding */ STATIC_HUES),
/* harmony export */   TONE_HUES: () => (/* binding */ TONE_HUES),
/* harmony export */   avatarHue: () => (/* binding */ avatarHue),
/* harmony export */   avatarTone: () => (/* binding */ avatarTone),
/* harmony export */   avatarToneHash: () => (/* binding */ avatarToneHash),
/* harmony export */   resolveAvatarHue: () => (/* binding */ resolveAvatarHue),
/* harmony export */   resolveAvatarTone: () => (/* binding */ resolveAvatarTone)
/* harmony export */ });
// sf-avatar's hue from a name, without a document: a plain function of its
// argument, so tests/avatar-tones.contract.test.mjs runs it in Node and a server
// can print the same class in the first paint. docs/docs.md gives the algorithm
// for a server in another language.
//
// Owner decision C17 (2026-11-08): avatars have no colours of their own. The
// initials take a hue of the static palette (the hue setting, the class
// sf-hue-<name>); the eight tones of initials are gone, and `auto` picks among
// eight static hues in the old order, so a name keeps its slot: rose is pink,
// the former violet (HCT hue 325) is purple, the other six keep their names.
// A former tone moves at most 15 degrees (dispatcher, 2026-11-09).
//
// FNV-1a, 32 bits, over the UTF-8 bytes of the string exactly as given (no
// trimming, no case folding, no normalisation), its high half folded onto the
// low one, because the low bits of FNV-1a alone follow the low bits of the
// input; the remainder by the length of the list picks the tone.
//
// The list and its order are part of the algorithm: a name keeps its tone only
// while they stay. A later named tone does not join `auto`.
const AVATAR_HUES = Object.freeze(['pink', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'purple']);

// Every hue a setting may name: the static palette (theme-palette.js
// STATIC_HUES, tests/avatar-tones.contract.test.mjs holds the two equal).
const STATIC_HUES = Object.freeze(['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'pink', 'brown', 'gray']);

// The former tone setting and its names, until 2027-01-01 (journal
// attribute-c17-avatar-tone-to-hue, value-c17-avatar-rose-to-pink, which
// also carries violet to purple).
const AVATAR_TONES = Object.freeze(['rose', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'violet']);
const TONE_HUES = Object.freeze({rose: 'pink', violet: 'purple'});

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function avatarToneHash(name) {
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(String(name))) {
    hash = Math.imul(hash ^ byte, FNV_PRIME) >>> 0;
  }
  return (hash ^ (hash >>> 16)) >>> 0;
}

// No name, no hue: the neutral look.
function avatarHue(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_HUES[avatarToneHash(text) % AVATAR_HUES.length] : '';
}

// The hue a setting asks for: a named one as it is, auto the one of the name,
// empty (or a name the palette does not have) the neutral look. The former
// tone setting is read when hue is empty, its rose as pink and its violet as purple.
function resolveAvatarHue(hue, name, tone = '') {
  const setting = hue || TONE_HUES[tone] || tone || '';
  if (setting === 'auto') return avatarHue(name);
  return STATIC_HUES.includes(setting) ? setting : '';
}

// The former names (2027-01-01): the tone of a name in the old words.
function avatarTone(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_TONES[avatarToneHash(text) % AVATAR_TONES.length] : '';
}

function resolveAvatarTone(setting, name) {
  return setting === 'auto' ? avatarTone(name) : setting || '';
}


/***/ },

/***/ "f15c795f1055"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-dropdown for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (setting rows), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"type","to":"appearance","kind":"setting","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"},{"from":"aria-label","to":null,"kind":"attribute","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-dropdown:change","to":"change","kind":"event","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","section":"§8, vocabulary §5.1","note":"the old detail adds root (the element), which §8 takes out of the new detail: the element\'s detail adapter makes it"},{"from":"sf-field:reset","to":"sf-field-reset","kind":"event","component":"sf-dropdown","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, §20.2","note":"the event of the trait field-inherit@1, declared in component.json as the shared event field-reset; the field sends sf-field-reset and the shim follows it with this dated name, same detail, one cancel"}]}');

/***/ },

/***/ "b4d28078de6f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.dropdown","tag":"sf-dropdown","version":"1.16.1","kind":"leaf","traits":["field-inherit@1"],"settings":{"appearance":{"type":"enum","values":["filled","outlined"],"default":"outlined"},"columns":{"type":"number","default":6},"disabled":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"invalid":{"type":"boolean","default":false},"label":{"type":"string","default":""},"help":{"type":"string","default":""},"layout":{"type":"enum","values":["list","grid"],"default":"list"},"mode":{"type":"enum","values":["tag","select"],"default":"select"},"multiple":{"type":"boolean","default":false},"name":{"type":"string","default":""},"options":{"type":"list","default":[],"of":{"value":"string","text":"string","icon":{"type":"icon","optional":true},"disabled":{"type":"boolean","optional":true},"group":{"type":"string","optional":true}}},"placeholder":{"type":"string","default-from":"runtime.empty"},"portal":{"type":"boolean","default":true},"required":{"type":"boolean","default":false},"search":{"type":"boolean","default":true},"search-placeholder":{"type":"string","default-from":"runtime.search"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"}},"values":{"value":{"type":"string","default":""}},"events":{"change":{"carries":"native"},"field-reset":{"shared":"field-inherit@1","cancelable":true,"carries":{"tag":{"type":"string"},"value":{"type":"string"},"inherited-value":{"type":"string"},"name":{"type":"string"}}}},"actions":{"open-dropdown":{},"close-dropdown":{},"toggle-dropdown":{},"set-error":{"with":{"message":{"type":"string"}}}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{"data-inherited":"boolean"},"css-variables":{"--sf-dropdown-background-color":{"type":"color","state":"default"},"--sf-dropdown-border-color":{"type":"color","state":"default"},"--sf-dropdown-radius":{"type":"length","state":"default"},"--sf-dropdown-gap":{"type":"length","state":"default"},"--sf-dropdown-list-background-color":{"type":"color","state":"open"}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","validity":["value-missing","custom-error"]}}');

/***/ },

/***/ "ad680c489766"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Dropdown","runtime":{"search":"Search","empty":"Not selected","value-missing":"Choose an option","help":"More about: {label}"},"x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"inherited","reset":"Reset to inherited","described":"Inherited: {value}"}}}');

/***/ },

/***/ "8b3dd54aeaa8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Выпадающий список","runtime":{"search":"Поиск","empty":"Не выбрано","value-missing":"Выберите вариант","help":"Подробнее: {label}"},"x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"наследуется","reset":"Сбросить к наследуемому","described":"Наследуется: {value}"}}}');

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