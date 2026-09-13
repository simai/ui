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
  };

  const field = () => root.querySelector('.sf-dropdown-field');

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

/***/ "2914c05ad3ed"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindDropdown: () => (/* binding */ bindDropdown),
/* harmony export */   closeDropdown: () => (/* binding */ closeDropdown),
/* harmony export */   openDropdown: () => (/* binding */ openDropdown),
/* harmony export */   selectItem: () => (/* binding */ selectItem),
/* harmony export */   unbindDropdown: () => (/* binding */ unbindDropdown)
/* harmony export */ });
/* harmony import */ var _interaction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3a03d4610486");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a0f23dca0b37");



const DROPDOWN_SELECTOR = ".sf-dropdown";
const BOUND_FLAG = "sfDropdownBound";
const CHECKMARK_SELECTOR = ".sf-list-item-selected-item";

function isTagDropdown(root) {
  return root.classList.contains("sf-dropdown--tag");
}

function isSmartDropdownRoot(root) {
  const host = root?.closest?.("sf-dropdown");
  return Boolean(host?.__sfSmartElement);
}

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function isMultipleDropdown(root) {
  if (!root) return false;

  if (root.hasAttribute("multiple")) {
    return toBoolean(root.getAttribute("multiple"), true);
  }

  if (root.dataset.multiple !== undefined) {
    return toBoolean(root.dataset.multiple, false);
  }

  return isTagDropdown(root);
}

function isDisabledDropdown(root) {
  if (!root) return false;
  if (root.classList.contains("disabled")) return true;
  if (root.hasAttribute("disabled")) return toBoolean(root.getAttribute("disabled"), true);
  return false;
}

function isPortalDropdown(root) {
  if (!root) return false;

  if (root.hasAttribute("portal")) {
    return toBoolean(root.getAttribute("portal"), true);
  }

  if (root.dataset.portal !== undefined) {
    return toBoolean(root.dataset.portal, false);
  }

  return false;
}

function getField(root) {
  return root.querySelector(".sf-dropdown-field");
}

function getTriggerInput(root) {
  return root.querySelector(".sf-dropdown-field input:not(.sf-dropdown-hidden-input)");
}

function getList(root) {
  return root.__sfDropdownPortalList || root.querySelector(".sf-list");
}

function getSearchInput(root) {
  return getList(root)?.querySelector(".sf-input input") || null;
}

function getTagContainer(root) {
  return root.querySelector(".sf-dropdown-tag-container");
}

function getHiddenInput(root) {
  return root.querySelector(".sf-dropdown-hidden-input");
}

function getToggleIcon(root) {
  return root.querySelector(".sf-dropdown-field .sf-icon-button .sf-icon");
}

function getListWrap(root) {
  return getList(root)?.querySelector(".sf-list-container-wrap") || null;
}

function getListContainer(root) {
  return getList(root)?.querySelector(".sf-list-container") || null;
}

function getItems(root) {
  return Array.from(getList(root)?.querySelectorAll(".sf-list-item") || []);
}

function containsDropdownTarget(root, target) {
  if (!root || !target) return false;
  if (root.contains(target)) return true;
  return Boolean(root.__sfDropdownPortalList?.contains(target));
}

function positionPortalList(root) {
  if (!root || !isPortalDropdown(root)) return;
  (0,_portal__WEBPACK_IMPORTED_MODULE_2__.positionDropdownPortal)(root, getList(root));
}

function ensurePortalList(root) {
  if (!root || !isPortalDropdown(root)) return;
  const list = getList(root);
  if (!list || !(0,_portal__WEBPACK_IMPORTED_MODULE_2__.openDropdownPortal)(root, list, () => closeDropdown(root))) return;
  list.__sfDropdownRoot = root;

  if (!root.__sfDropdownPortalClick) {
    root.__sfDropdownPortalClick = onRootClick;
    root.__sfDropdownPortalKeydown = onRootKeydown;
    list.addEventListener('click', onRootClick);
    list.addEventListener('keydown', onRootKeydown);
  }

  if (!root.__sfDropdownPortalOnViewportChange) {
    root.__sfDropdownPortalOnViewportChange = () => {
      if (root.classList.contains('sf-dropdown--open')) positionPortalList(root);
    };
  }

  window.addEventListener('resize', root.__sfDropdownPortalOnViewportChange);
  document.addEventListener('scroll', root.__sfDropdownPortalOnViewportChange, true);
}

function restorePortalList(root) {
  if (!root) return;
  const list = getList(root);
  (0,_portal__WEBPACK_IMPORTED_MODULE_2__.closeDropdownPortal)(list);

  if (list && root.__sfDropdownPortalClick) {
    list.removeEventListener('click', root.__sfDropdownPortalClick);
    list.removeEventListener('keydown', root.__sfDropdownPortalKeydown);
  }

  delete root.__sfDropdownPortalClick;
  delete root.__sfDropdownPortalKeydown;

  if (root.__sfDropdownPortalOnViewportChange) {
    window.removeEventListener('resize', root.__sfDropdownPortalOnViewportChange);
    document.removeEventListener('scroll', root.__sfDropdownPortalOnViewportChange, true);
  }

  if (list) delete list.__sfDropdownRoot;
  delete root.__sfDropdownPortalOnViewportChange;
}

function getItemValue(item) {
  return item?.dataset?.value ?? getItemLabel(item);
}

function getItemLabel(item) {
  if (!item) return "";
  const listItemText = item.querySelector(".sf-list-item-container")?.textContent?.trim();
  if (listItemText) return listItemText;
  const tagText = item.querySelector(".sf-tag-container")?.textContent?.trim();
  if (tagText) return tagText;
  const avatarText = item.querySelector(".sf-avatar-label-group-title")?.textContent?.trim();
  if (avatarText) return avatarText;
  return item.dataset?.value?.trim?.() || item.textContent?.trim() || "";
}

function ensureCheckmark(item) {
  const supportsSelectedIndicator = item.classList.contains("sf-list-item--text") || item.classList.contains("sf-list-item--icon");
  if (!supportsSelectedIndicator) return;
  if (!item || item.querySelector(CHECKMARK_SELECTOR)) return;
  const selectedItem = document.createElement("div");
  selectedItem.className = "sf-list-item-selected-item flex";
  const icon = document.createElement("i");
  icon.className = "sf-icon";
  icon.textContent = "check";
  selectedItem.append(icon);
  item.append(selectedItem);
}

function syncSelected(root, selectedItems = []) {
  const selectedSet = new Set(selectedItems);
  getItems(root).forEach(item => {
    const isSelected = selectedSet.has(item);
    item.classList.toggle("selected", isSelected);
    item.setAttribute("aria-selected", isSelected ? "true" : "false");
    const checkmark = item.querySelector(CHECKMARK_SELECTOR);

    if (isSelected) {
      ensureCheckmark(item);
    } else if (checkmark) {
      checkmark.remove();
    }

    (0,_interaction__WEBPACK_IMPORTED_MODULE_0__.syncDropdownCheckbox)(item, isSelected);
  });
  root.__sfDropdownInteraction?.refresh();
}

function syncItemCheckboxInteractivity(root) {
  getItems(root).forEach(item => {
    const checkboxRoot = item.querySelector(".sf-checkbox");
    const checkbox = item.querySelector(".sf-checkbox input");
    if (!checkboxRoot || !checkbox) return;
    checkbox.tabIndex = -1;
    checkbox.dataset.dropdownManaged = "1";
    checkbox.style.pointerEvents = "none";
    checkboxRoot.style.pointerEvents = "none";

    if (isDisabledDropdown(root) || item.classList.contains("disabled")) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });
}

function createTagNode(root, item) {
  const value = getItemValue(item);
  const label = getItemLabel(item);
  const size = root.className.match(/sf-dropdown--size-([^\s]+)/)?.[1] || "1";
  const tagSize = size === "1/3" ? "1/2" : size === "1/2" ? "1/2" : "1";
  const isIconItem = item.classList.contains("sf-list-item--icon");
  const isAvatarItem = item.classList.contains("sf-list-item--avatar");
  const isColorItem = item.classList.contains("sf-list-item--color");
  const isDisabled = isDisabledDropdown(root);
  const tagType = isColorItem ? "color" : isAvatarItem ? "avatar" : "icon";
  const tag = document.createElement("div");
  tag.className = `sf-tag transition sf-tag--${tagType} sf-tag--size-${tagSize} flex flex-row flex-nowrap items-center active`;
  tag.dataset.value = value;

  if (isDisabled) {
    tag.classList.add("disabled");
    tag.setAttribute("aria-disabled", "true");
  }

  const container = document.createElement("span");
  container.className = "sf-tag-container";
  container.textContent = label;

  if (isColorItem) {
    const colorIcon = item.querySelector(".sf-tag-color-icon");
    const colorNode = document.createElement("span");
    colorNode.className = colorIcon?.className || "sf-tag-color-icon";
    tag.append(colorNode);
  } else if (isAvatarItem) {
    const avatarNode = item.querySelector(".sf-avatar");

    if (avatarNode) {
      tag.append(avatarNode.cloneNode(true));
    }
  } else if (isIconItem) {
    const icon = document.createElement("i");
    icon.className = "sf-icon sf-tag-icon";
    icon.textContent = item.querySelector(".sf-list-item-wrap > .sf-icon")?.textContent?.trim() || "favorite";
    tag.append(icon);
  }

  tag.append(container);
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "sf-icon-button sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3";
  closeButton.setAttribute("aria-label", `Remove ${label}`);
  closeButton.dataset.role = "remove-tag";
  closeButton.dataset.value = value;
  closeButton.disabled = isDisabled;
  closeButton.tabIndex = isDisabled ? -1 : 0;
  const close = document.createElement("div");
  close.className = "sf-close sf-close--size-1/3 flex";
  const closeIcon = document.createElement("div");
  closeIcon.className = "sf-close-icon";
  close.append(closeIcon);
  closeButton.append(close);
  tag.append(closeButton);
  return tag;
}

function syncTags(root) {
  if (!isTagDropdown(root)) return;
  const container = getTagContainer(root);
  if (!container) return;
  container.innerHTML = "";
  getItems(root).filter(item => item.classList.contains("selected")).forEach(item => {
    container.append(createTagNode(root, item));
  });
}

function syncHiddenInput(root) {
  const hiddenInput = getHiddenInput(root);
  if (!hiddenInput) return;
  hiddenInput.value = isMultipleDropdown(root) ? getSelectedItems(root).map(getItemValue).join(",") : root.dataset.selectedValue || "";
  hiddenInput.disabled = isDisabledDropdown(root);
}

function setTriggerValue(root, value) {
  if (isTagDropdown(root)) return;
  const input = getTriggerInput(root);
  if (!input) return;
  input.value = value;
}

function syncSelectionPresentation(root) {
  const selected = getSelectedItems(root);
  const visible = isMultipleDropdown(root) ? selected : selected.slice(0, 1);
  setTriggerValue(root, visible.map(getItemLabel).join(', '));
  root.dataset.selectedValue = visible.map(getItemValue).join(',');
  syncTags(root);
  syncHiddenInput(root);
}

function syncToggleIcon(root, isOpen) {
  const icon = getToggleIcon(root);
  if (!icon) return;
  icon.textContent = isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down";
}

function applyDropdownViewport(root, visibleItems = 4) {
  const wrap = getListWrap(root);
  const container = getListContainer(root);
  if (!wrap || !container || visibleItems <= 0) return;
  const items = getItems(root).filter(item => !item.hidden);
  if (!items.length) return;
  const firstItem = items[0];
  const itemHeight = firstItem.getBoundingClientRect().height;
  if (!itemHeight) return;
  const containerStyle = window.getComputedStyle(container);
  const gap = Number.parseFloat(containerStyle.rowGap || "") || Number.parseFloat(containerStyle.gap || "") || 0;
  const paddingTop = Number.parseFloat(containerStyle.paddingTop || "") || 0;
  const paddingBottom = Number.parseFloat(containerStyle.paddingBottom || "") || 0;
  const visibleCount = Math.min(visibleItems, items.length);
  const totalHeight = visibleCount * itemHeight + Math.max(visibleCount - 1, 0) * gap + paddingTop + paddingBottom;
  wrap.style.maxHeight = `${Math.ceil(totalHeight)}px`;
  wrap.style.overflowY = items.length > visibleCount ? "auto" : "hidden";
  wrap.style.overflowX = "hidden";
}

function openDropdown(root) {
  if (!root || isDisabledDropdown(root)) return;
  const triggerInput = getTriggerInput(root);
  if (triggerInput && triggerInput.disabled) return;
  const list = getList(root);
  if (!list) return;
  root.classList.add("sf-dropdown--open");
  root.setAttribute("aria-expanded", "true");
  ensurePortalList(root);
  list.hidden = false;
  syncToggleIcon(root, true);
  applyDropdownViewport(root, 4);
  positionPortalList(root);
  root.__sfDropdownInteraction?.refresh();
}

function closeDropdown(root) {
  if (!root) return; // A Smart dropdown owns its rendered nodes. Global outside-click handling
  // must request its state change, not replace Lit-managed icon text.

  if (isSmartDropdownRoot(root)) {
    root.closest("sf-dropdown").closeDropdown();
    return;
  }

  root.__sfDropdownInteraction?.beforeClose();
  const list = getList(root);
  if (!list) return;
  root.classList.remove("sf-dropdown--open");
  root.setAttribute("aria-expanded", "false");
  list.hidden = true;
  syncToggleIcon(root, false);
  restorePortalList(root);
  const searchInput = getSearchInput(root);

  if (searchInput) {
    searchInput.value = "";
    filterItems(root, "");
  }

  root.__sfDropdownInteraction?.refresh();
}

function toggleDropdown(root) {
  if (!root) return;

  if (root.classList.contains("sf-dropdown--open")) {
    closeDropdown(root);
    return;
  }

  document.querySelectorAll(`${DROPDOWN_SELECTOR}.sf-dropdown--open`).forEach(el => {
    if (el !== root) closeDropdown(el);
  });
  openDropdown(root);
}

function filterItems(root, query = "") {
  const normalized = String(query).trim().toLowerCase();
  getItems(root).forEach(item => {
    const label = getItemLabel(item).toLowerCase();
    item.hidden = Boolean(normalized) && !label.includes(normalized);
  });
  applyDropdownViewport(root, 4);
  root.__sfDropdownInteraction?.refresh();
  if (root.classList.contains('sf-dropdown--open')) positionPortalList(root);
}

function getSelectedItems(root) {
  return getItems(root).filter(item => item.classList.contains("selected"));
}

function syncDisabledState(root) {
  // Search results (including zero or one match) are not disabled state.
  // Keep the author-owned class/attribute separate from derived DOM state.
  const disabled = isDisabledDropdown(root);
  const changed = root.__sfDropdownDisabledState !== disabled;
  root.__sfDropdownDisabledState = disabled;
  const field = getField(root);
  const triggerInput = getTriggerInput(root);
  const searchInput = getSearchInput(root);
  const toggleButton = root.querySelector(".sf-dropdown-field .sf-icon-button");
  root.setAttribute("aria-disabled", disabled ? "true" : "false");

  if (field) {
    field.classList.toggle("cursor-pointer", !disabled);
  }

  if (triggerInput) {
    triggerInput.disabled = disabled;
  }

  if (searchInput) {
    searchInput.disabled = disabled;
  }

  const hiddenInput = getHiddenInput(root);

  if (hiddenInput) {
    hiddenInput.disabled = disabled;
  }

  if (toggleButton) {
    toggleButton.disabled = disabled;
    toggleButton.tabIndex = disabled ? -1 : 0;
  }

  getItems(root).forEach(item => {
    item.tabIndex = disabled || item.classList.contains("disabled") ? -1 : 0;
  });

  if (disabled && root.classList.contains("sf-dropdown--open")) {
    closeDropdown(root);
  }

  root.__sfDropdownInteraction?.refresh();
  return changed;
}

function dispatchDropdownChange(root, detail) {
  if (!root) return;
  root.dispatchEvent(new CustomEvent("sf-dropdown:change", {
    bubbles: true,
    composed: true,
    detail
  }));
  root.dispatchEvent(new CustomEvent("change", {
    bubbles: true,
    composed: true,
    detail
  }));
}

function selectItem(root, item) {
  if (!root || !item || item.classList.contains("disabled") || isDisabledDropdown(root)) return;
  const label = getItemLabel(item);
  const value = getItemValue(item);
  const isMultiple = isMultipleDropdown(root);

  if (isMultiple) {
    const nextSelected = getSelectedItems(root);
    const alreadySelected = item.classList.contains("selected");
    const selectedItems = alreadySelected ? nextSelected.filter(selected => selected !== item) : [...nextSelected, item];
    syncSelected(root, selectedItems);
  } else {
    syncSelected(root, [item]);
  }

  syncSelectionPresentation(root);
  dispatchDropdownChange(root, {
    value,
    label,
    values: isMultiple ? getSelectedItems(root).map(getItemValue) : [value],
    item,
    root,
    multiple: isMultiple
  });
  syncItemCheckboxInteractivity(root);

  if (!isMultiple) {
    closeDropdown(root);
  }
}

function onDocumentClick(event) {
  document.querySelectorAll(`${DROPDOWN_SELECTOR}.sf-dropdown--open`).forEach(root => {
    if (containsDropdownTarget(root, event.target)) return;
    closeDropdown(root);
  });
}

function onRootClick(event) {
  const root = event.currentTarget.__sfDropdownRoot || event.currentTarget; // Native top-layer panels retain ancestry; the root receives this bubble.

  if (event.currentTarget !== root && root.contains(event.currentTarget)) return;

  if (isDisabledDropdown(root)) {
    event.preventDefault();
    return;
  }

  const field = getField(root);
  const item = event.target.closest(".sf-list-item");
  const removeTagButton = event.target.closest('[data-role="remove-tag"]');
  const searchWrap = event.target.closest(".sf-list .sf-input");
  const optionCheckbox = event.target.closest(".sf-list-item .sf-checkbox");

  if (searchWrap && containsDropdownTarget(root, searchWrap)) {
    return;
  }

  if (optionCheckbox && containsDropdownTarget(root, optionCheckbox)) {
    event.preventDefault();
  }

  if (removeTagButton && containsDropdownTarget(root, removeTagButton)) {
    event.preventDefault();
    event.stopPropagation();
    const value = removeTagButton.dataset.value;
    const selectedItems = getSelectedItems(root).filter(selectedItem => {
      return getItemValue(selectedItem) !== value;
    });
    syncSelected(root, selectedItems);
    syncSelectionPresentation(root);
    dispatchDropdownChange(root, {
      value: "",
      label: "",
      values: selectedItems.map(getItemValue),
      item: null,
      root,
      multiple: isMultipleDropdown(root)
    });
    syncItemCheckboxInteractivity(root);
    return;
  }

  if (item && containsDropdownTarget(root, item)) {
    event.preventDefault();
    selectItem(root, item);
    return;
  }

  if (!field?.contains(event.target)) return;
  if (event.target.closest(".sf-list")) return;
  event.preventDefault();
  toggleDropdown(root);
}

function onRootKeydown(event) {
  const root = event.currentTarget.__sfDropdownRoot || event.currentTarget;
  if (event.currentTarget !== root && root.contains(event.currentTarget)) return;
  if (isDisabledDropdown(root)) return;

  if (event.key === "Escape") {
    closeDropdown(root);
    return;
  }

  const item = event.target.closest(".sf-list-item");
  if (!item) return;

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    selectItem(root, item);
  }
}

function onSearchInput(event) {
  const root = event.currentTarget.__sfDropdownRoot || event.currentTarget.closest(DROPDOWN_SELECTOR);
  if (!root || isDisabledDropdown(root)) return;
  filterItems(root, event.currentTarget.value);
}

function bindDropdown(root) {
  if (isSmartDropdownRoot(root)) return;
  if (!root || root.dataset[BOUND_FLAG] === "1") return;
  const field = getField(root);
  const list = getList(root);
  const triggerInput = getTriggerInput(root);
  if (!field || !list) return;
  root.dataset[BOUND_FLAG] = "1";
  root.setAttribute("aria-expanded", root.classList.contains("sf-dropdown--open") ? "true" : "false");

  if (triggerInput && !isTagDropdown(root)) {
    triggerInput.readOnly = true;
  }

  list.hidden = !root.classList.contains("sf-dropdown--open");
  syncToggleIcon(root, root.classList.contains("sf-dropdown--open"));
  applyDropdownViewport(root, 4);
  syncDisabledState(root);
  syncItemCheckboxInteractivity(root);
  root.__sfDropdownStateObserver = new MutationObserver(records => {
    const changed = syncDisabledState(root);
    syncItemCheckboxInteractivity(root);
    if (changed) syncTags(root);

    if (records.some(record => ['portal', 'data-portal'].includes(record.attributeName))) {
      if (root.classList.contains('sf-dropdown--open') && isPortalDropdown(root)) ensurePortalList(root);else restorePortalList(root);
      root.__sfDropdownInteraction?.refresh();
    }
  });

  root.__sfDropdownStateObserver.observe(root, {
    attributes: true,
    attributeFilter: ["class", "disabled", "portal", "data-portal"]
  });

  const listContainer = getListContainer(root);

  if (listContainer && !root.__sfDropdownItemsObserver) {
    root.__sfDropdownItemsObserver = new MutationObserver(() => {
      syncDisabledState(root);
      syncItemCheckboxInteractivity(root);
    });

    root.__sfDropdownItemsObserver.observe(listContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "aria-hidden"]
    });
  }

  const selectedItems = getSelectedItems(root);

  if (selectedItems.length > 0) {
    syncSelected(root, selectedItems);
    syncSelectionPresentation(root);
  } else {
    const presetValue = root.getAttribute("value") || root.dataset.selectedValue || "";

    if (presetValue) {
      const presetValues = isMultipleDropdown(root) ? presetValue.split(',').map(value => value.trim()).filter(Boolean) : [presetValue];
      const presetItems = getItems(root).filter(item => presetValues.includes(getItemValue(item)));
      const presetItem = presetItems[0];

      if (presetItem) {
        syncSelected(root, isMultipleDropdown(root) ? presetItems : [presetItem]);
        syncSelectionPresentation(root);
      }
    }
  }

  if (!selectedItems.length && isTagDropdown(root)) {
    syncTags(root);
    syncHiddenInput(root);
  }

  root.__sfDropdownOnClick = onRootClick;
  root.__sfDropdownOnKeydown = onRootKeydown;
  root.addEventListener("click", onRootClick);
  root.addEventListener("keydown", onRootKeydown);
  const searchInput = getSearchInput(root);

  if (searchInput) {
    root.__sfDropdownSearchInput = searchInput;
    root.__sfDropdownOnSearchInput = onSearchInput;
    searchInput.__sfDropdownRoot = root;
    searchInput.addEventListener("input", onSearchInput);
  }

  root.__sfDropdownInteraction = (0,_interaction__WEBPACK_IMPORTED_MODULE_0__.createDropdownInteraction)(root, {
    getList: () => getList(root),
    isOpen: () => root.classList.contains("sf-dropdown--open"),
    isDisabled: () => isDisabledDropdown(root),
    isMultiple: () => isMultipleDropdown(root),
    selectedLabels: () => getSelectedItems(root).map(getItemLabel),
    open: () => openDropdown(root),
    close: () => closeDropdown(root),
    select: item => selectItem(root, item)
  });

  if (!Object.prototype.hasOwnProperty.call(root, '__sfDropdownResetValues')) {
    root.__sfDropdownResetValues = getSelectedItems(root).map(getItemValue);
  }

  const resetControl = getHiddenInput(root) || field.querySelector(':scope > button') || triggerInput;

  if (resetControl) {
    root.__sfDropdownReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_1__.bindFormReset)(resetControl, () => {
      const selected = getItems(root).filter(item => root.__sfDropdownResetValues.includes(getItemValue(item)));
      const restored = isMultipleDropdown(root) ? selected : selected.slice(0, 1);
      syncSelected(root, restored);
      syncSelectionPresentation(root);
      closeDropdown(root);
    });
  }
}

function unbindDropdown(root) {
  if (!root || root.dataset[BOUND_FLAG] !== "1") return;
  root.__sfDropdownInteraction?.release();
  delete root.__sfDropdownInteraction;
  root.__sfDropdownReleaseReset?.();
  delete root.__sfDropdownReleaseReset;
  restorePortalList(root);
  root.__sfDropdownItemsObserver?.disconnect?.();
  root.__sfDropdownStateObserver?.disconnect?.();
  root.removeEventListener("click", root.__sfDropdownOnClick);
  root.removeEventListener("keydown", root.__sfDropdownOnKeydown);
  const list = getList(root);

  if (list && root.__sfDropdownPortalClick) {
    list.removeEventListener("click", root.__sfDropdownPortalClick);
    list.removeEventListener("keydown", root.__sfDropdownPortalKeydown);
  }

  if (root.__sfDropdownSearchInput && root.__sfDropdownOnSearchInput) {
    root.__sfDropdownSearchInput.removeEventListener("input", root.__sfDropdownOnSearchInput);

    delete root.__sfDropdownSearchInput.__sfDropdownRoot;
  }

  delete root.__sfDropdownOnClick;
  delete root.__sfDropdownOnKeydown;
  delete root.__sfDropdownPortalClick;
  delete root.__sfDropdownPortalKeydown;
  delete root.__sfDropdownSearchInput;
  delete root.__sfDropdownOnSearchInput;
  delete root.__sfDropdownItemsObserver;
  delete root.__sfDropdownStateObserver;
  delete root.__sfDropdownDisabledState;
  delete root.dataset[BOUND_FLAG];
}

function initExistingDropdowns(target = document) {
  target.querySelectorAll(DROPDOWN_SELECTOR).forEach(bindDropdown);
}

if (!document.__sfDropdownDocumentClickBound) {
  document.addEventListener("click", onDocumentClick);
  document.__sfDropdownDocumentClickBound = true;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initExistingDropdowns());
} else {
  initExistingDropdowns();
}

const dropdownObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(DROPDOWN_SELECTOR)) {
        bindDropdown(node);
      }

      initExistingDropdowns(node);
    });
    mutation.removedNodes.forEach(node => {
      if (!(node instanceof Element) || node.isConnected) return;

      if (node.matches?.(DROPDOWN_SELECTOR)) {
        unbindDropdown(node);
      }

      node.querySelectorAll?.(DROPDOWN_SELECTOR).forEach(unbindDropdown);
    });
  });
});
dropdownObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "b0812c2f1b43"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dropdown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2914c05ad3ed");


/***/ },

/***/ "a0f23dca0b37"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeDropdownPortal: () => (/* binding */ closeDropdownPortal),
/* harmony export */   openDropdownPortal: () => (/* binding */ openDropdownPortal),
/* harmony export */   positionDropdownPortal: () => (/* binding */ positionDropdownPortal)
/* harmony export */ });
// One placement/lifecycle contract for native and body-projected panels.
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
}

function positionDropdownPortal(root, list) {
  const state = portals.get(list);
  if (!state || !root.isConnected || list.hidden) return false;
  const field = root.querySelector('.sf-dropdown-field');
  if (!field) return false;

  if (root.closest('[hidden], [inert], [aria-hidden="true"], dialog:not([open])') || !field.getClientRects().length || ['hidden', 'collapse'].includes(getComputedStyle(field).visibility)) {
    state.onUnavailable?.();
    return false;
  }

  syncFallbackContext(root, state);

  if (state.wrap) {
    state.wrap.style.minHeight = '0';
    state.wrap.style.overflowY = 'auto';
  }

  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:var(--sf-space-1\\/4);height:var(--sf-space-1\\/2)';
  root.append(probe);
  const measured = getComputedStyle(probe);
  const gap = parseFloat(measured.width) || 0,
        margin = parseFloat(measured.height) || 0;
  probe.remove();
  const viewport = window.visualViewport;
  const x = viewport?.offsetLeft || 0,
        y = viewport?.offsetTop || 0;
  const width = viewport?.width || document.documentElement.clientWidth;
  const height = viewport?.height || document.documentElement.clientHeight;
  const rect = field.getBoundingClientRect();
  const panelWidth = Math.max(0, Math.min(rect.width, width - margin * 2));
  const left = Math.max(x + margin, Math.min(rect.left, x + width - margin - panelWidth));
  list.style.width = `${panelWidth}px`;
  list.style.maxWidth = `${Math.max(0, width - margin * 2)}px`; // Restore the author's cap before measuring; viewport fitting can only
  // tighten it, never enlarge a deliberately limited panel.

  const [, cap, priority] = state.saved.find(([name]) => name === 'max-height');
  if (cap) list.style.setProperty('max-height', cap, priority);else list.style.removeProperty('max-height');
  const configuredCap = parseFloat(getComputedStyle(list).maxHeight);
  const naturalHeight = list.getBoundingClientRect().height;
  const below = Math.max(0, y + height - margin - rect.bottom - gap);
  const above = Math.max(0, rect.top - gap - y - margin);
  const up = naturalHeight > below && above > below;
  const available = Math.min(up ? above : below, Number.isFinite(configuredCap) ? configuredCap : Infinity);
  list.style.maxHeight = `${available}px`;
  const panelHeight = list.getBoundingClientRect().height;
  const top = Math.max(y + margin, Math.min(up ? rect.top - gap - panelHeight : rect.bottom + gap, y + height - margin - panelHeight));
  list.style.left = `${left}px`;
  list.style.top = `${top}px`;
  list.dataset.placement = root.dataset.placement = up ? 'top' : 'bottom';
  root.classList.toggle('sf-dropdown--drop-up', up);
  root.classList.toggle('sf-dropdown--drop-down', !up);
  return true;
}
function openDropdownPortal(root, list, onUnavailable) {
  if (!list?.isConnected || !root?.querySelector('.sf-dropdown-field')) return false;
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
      state.resize.observe(root.querySelector('.sf-dropdown-field'));
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

/***/ "3679023c5b0d"
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
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b0812c2f1b43");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("3679023c5b0d");


})();

/******/ })()
;