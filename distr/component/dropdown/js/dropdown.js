/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

function getAvailableItems(root) {
  return getItems(root).filter(item => {
    if (!(item instanceof HTMLElement)) return false;
    if (item.hidden) return false;
    if (item.classList.contains("disabled")) return false;
    if (item.getAttribute("aria-hidden") === "true") return false;
    return true;
  });
}

function containsDropdownTarget(root, target) {
  if (!root || !target) return false;
  if (root.contains(target)) return true;
  return Boolean(root.__sfDropdownPortalList?.contains(target));
}

function positionPortalList(root) {
  if (!root || !isPortalDropdown(root)) return;
  const field = getField(root);
  const list = getList(root);
  if (!field || !list || list.parentNode !== document.body) return;
  const rect = field.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const viewportMargin = 8;
  const offset = 4;
  const listRect = list.getBoundingClientRect();
  const listHeight = listRect.height || list.scrollHeight || 0;
  const spaceBelow = viewportHeight - rect.bottom - viewportMargin;
  const spaceAbove = rect.top - viewportMargin;
  const openAbove = listHeight > spaceBelow && spaceAbove > spaceBelow;
  const top = openAbove ? Math.max(viewportMargin, rect.top - listHeight - offset) : rect.bottom + offset;
  list.style.position = "fixed";
  list.style.top = `${Math.round(top)}px`;
  list.style.left = `${Math.round(rect.left)}px`;
  list.style.width = `${Math.round(rect.width)}px`;
  list.style.zIndex = "9999";
  list.style.maxWidth = `${Math.round(rect.width)}px`;
  list.dataset.placement = openAbove ? "top" : "bottom";
  root.dataset.placement = openAbove ? "top" : "bottom";
  root.classList.toggle("sf-dropdown--drop-up", openAbove);
  root.classList.toggle("sf-dropdown--drop-down", !openAbove);
}

function ensurePortalList(root) {
  if (!root || !isPortalDropdown(root)) return;
  const list = getList(root);

  if (!list || list.parentNode === document.body) {
    positionPortalList(root);
    return;
  }

  root.__sfDropdownListParent = list.parentNode;
  root.__sfDropdownListNextSibling = list.nextSibling;
  root.__sfDropdownPortalList = list;
  list.__sfDropdownRoot = root;
  document.body.append(list);
  positionPortalList(root);

  if (!root.__sfDropdownPortalOnViewportChange) {
    root.__sfDropdownPortalOnViewportChange = () => {
      if (!root.classList.contains("sf-dropdown--open")) return;
      positionPortalList(root);
    };
  }

  window.addEventListener("resize", root.__sfDropdownPortalOnViewportChange);
  document.addEventListener("scroll", root.__sfDropdownPortalOnViewportChange, true);
}

function restorePortalList(root) {
  if (!root) return;
  const list = root.__sfDropdownPortalList;
  const parent = root.__sfDropdownListParent;

  if (list && parent && list.parentNode === document.body) {
    if (root.__sfDropdownListNextSibling?.parentNode === parent) {
      parent.insertBefore(list, root.__sfDropdownListNextSibling);
    } else {
      parent.append(list);
    }
  }

  if (root.__sfDropdownPortalOnViewportChange) {
    window.removeEventListener("resize", root.__sfDropdownPortalOnViewportChange);
    document.removeEventListener("scroll", root.__sfDropdownPortalOnViewportChange, true);
  }

  if (list) {
    delete list.__sfDropdownRoot;
    delete list.dataset.placement;
    list.style.position = "";
    list.style.top = "";
    list.style.left = "";
    list.style.width = "";
    list.style.zIndex = "";
    list.style.maxWidth = "";
  }

  delete root.dataset.placement;
  root.classList.remove("sf-dropdown--drop-up", "sf-dropdown--drop-down");
  delete root.__sfDropdownPortalList;
  delete root.__sfDropdownListParent;
  delete root.__sfDropdownListNextSibling;
  delete root.__sfDropdownPortalOnViewportChange;
}

function getItemValue(item) {
  return item?.dataset?.value || getItemLabel(item);
}

function getItemLabel(item) {
  if (!item) return "";
  const explicitValue = item.dataset?.value?.trim?.();
  if (explicitValue) return explicitValue;
  const listItemText = item.querySelector(".sf-list-item-container")?.textContent?.trim();
  if (listItemText) return listItemText;
  const tagText = item.querySelector(".sf-tag-container")?.textContent?.trim();
  if (tagText) return tagText;
  const avatarText = item.querySelector(".sf-avatar-label-group-title")?.textContent?.trim();
  if (avatarText) return avatarText;
  return item.textContent?.trim() || "";
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
    const checkbox = item.querySelector(".sf-checkbox input");

    if (isSelected) {
      ensureCheckmark(item);
    } else if (checkmark) {
      checkmark.remove();
    }

    if (checkbox) {
      checkbox.checked = isSelected;
      checkbox.dispatchEvent(new Event("input", {
        bubbles: true
      }));
      checkbox.dispatchEvent(new Event("change", {
        bubbles: true
      }));
    }
  });
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
  const isTextItem = item.classList.contains("sf-list-item--text");
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
  } else if (!isTextItem) {
    const icon = document.createElement("i");
    icon.className = "sf-icon sf-tag-icon";
    icon.textContent = "favorite";
    tag.append(icon);
  }

  tag.append(container);
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "sf-icon-button sf-icon-button--link radius-default sf-icon-button--on-surface sf-icon-button--size-1/3";
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
}

function closeDropdown(root) {
  if (!root) return;
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
}

function getSelectedItems(root) {
  return getItems(root).filter(item => item.classList.contains("selected"));
}

function syncDisabledState(root) {
  root.__sfDropdownAutoDisabled = getAvailableItems(root).length <= 1;

  const disabled = isDisabledDropdown(root) || root.__sfDropdownAutoDisabled;

  const field = getField(root);
  const triggerInput = getTriggerInput(root);
  const searchInput = getSearchInput(root);
  const toggleButton = root.querySelector(".sf-dropdown-field .sf-icon-button");
  root.classList.toggle("disabled", disabled);
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
    item.tabIndex = disabled ? -1 : 0;
  });

  if (disabled) {
    closeDropdown(root);
  }
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
    syncTags(root);
    root.dataset.selectedValue = selectedItems.map(getItemValue).join(",");
    syncHiddenInput(root);
  } else {
    syncSelected(root, [item]);
    setTriggerValue(root, label);
    root.dataset.selectedValue = value;
    syncHiddenInput(root);
  }

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
  const root = event.currentTarget.__sfDropdownRoot || event.currentTarget;

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
    syncTags(root);
    root.dataset.selectedValue = selectedItems.map(getItemValue).join(",");
    syncHiddenInput(root);
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

    if (isTagDropdown(root)) {
      syncTags(root);
      root.dataset.selectedValue = selectedItems.map(getItemValue).join(",");
      syncHiddenInput(root);
    } else {
      const selectedItem = selectedItems[0];
      setTriggerValue(root, getItemLabel(selectedItem));
      root.dataset.selectedValue = getItemValue(selectedItem);
      syncHiddenInput(root);
    }
  } else {
    const presetValue = root.getAttribute("value") || root.dataset.selectedValue || "";

    if (presetValue) {
      const presetItem = getItems(root).find(item => getItemValue(item) === presetValue);

      if (presetItem) {
        syncSelected(root, [presetItem]);

        if (isTagDropdown(root)) {
          syncTags(root);
          root.dataset.selectedValue = getSelectedItems(root).map(getItemValue).join(",");
        } else {
          setTriggerValue(root, getItemLabel(presetItem));
          root.dataset.selectedValue = getItemValue(presetItem);
        }

        syncHiddenInput(root);
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

  if (isPortalDropdown(root) && list) {
    root.__sfDropdownPortalClick = onRootClick;
    root.__sfDropdownPortalKeydown = onRootKeydown;
    list.addEventListener("click", onRootClick);
    list.addEventListener("keydown", onRootKeydown);
  }

  const searchInput = getSearchInput(root);

  if (searchInput) {
    root.__sfDropdownSearchInput = searchInput;
    root.__sfDropdownOnSearchInput = onSearchInput;
    searchInput.__sfDropdownRoot = root;
    searchInput.addEventListener("input", onSearchInput);
  }
}

function unbindDropdown(root) {
  if (!root || root.dataset[BOUND_FLAG] !== "1") return;
  restorePortalList(root);
  root.__sfDropdownItemsObserver?.disconnect?.();
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
  delete root.__sfDropdownAutoDisabled;
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
      if (!(node instanceof Element)) return;

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