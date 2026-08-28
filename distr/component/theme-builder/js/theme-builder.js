/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "d45e1e8d65ea"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a4465fb0d4f3");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ce4c5d18e9c8");
/* harmony import */ var _utils_colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("db624dd59390");
/* harmony import */ var vanilla_picker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("76af9d08392d");




const THEME_BUILDER_CLASS = 'sf-theme-builder';
const INIT_ATTR = 'data-sf-theme-builder-init';
const OPTIONS_ATTR = 'data-theme-builder';
const STORAGE_KEY = 'sf-theme-builder:primary-hex';
const STATE_STORAGE_KEY = 'sf-theme-builder:state';
const APPLIED_THEME_KEY = 'sf-theme-builder:applied-hex';
const SAVED_THEMES_KEY = 'sf-theme-builder:saved';
const instanceSet = new Set();
const DEFAULT_OPTIONS = {
  autoInit: true,
  initialHex: null,
  initialHct: null,
  autoApply: false,
  storageKey: STORAGE_KEY,
  storePrimaryColor: true,
  drawer: false,
  drawerTrigger: 'auto',
  // auto | custom
  drawerToggleInline: 'inline-end-d2',
  drawerToggleBlock: 'block-end-d2',
  drawerToggleLeft: null,
  drawerToggleRight: null,
  drawerToggleTop: null,
  drawerToggleBottom: null
};
const DEFAULT_TONE_VALUES = [98, 95, 90, 85, 80, 70, 60, 50, 40, 35, 30, 25, 20, 15, 10, 5];
const BASE_ROLES = ['primary', 'secondary', 'tertiary', 'neutral', 'error', 'success', 'info', 'warning'];
let instanceCounter = 0;
const instanceMap = new WeakMap();

function getPaletteMenuPosition(direction) {
  const inlineEndOffset = 'calc(100% + 6px)';
  return {
    left: direction === 'rtl' ? inlineEndOffset : 'auto',
    right: direction === 'rtl' ? 'auto' : inlineEndOffset,
    insetInlineStart: 'auto',
    insetInlineEnd: inlineEndOffset
  };
}

function getPaletteMenuPositionStyle(direction) {
  const position = getPaletteMenuPosition(direction);
  return [`left: ${position.left}`, `right: ${position.right}`, `inset-inline-start: ${position.insetInlineStart}`, `inset-inline-end: ${position.insetInlineEnd}`].join('; ');
}

function createRangeSliderTemplate({
  min = 0,
  max = 100,
  step = 1,
  value = 0
}) {
  return `
    <div
      class="sf-range-slider"
      data-min="${min}"
      data-max="${max}"
      data-step="${step}"
      data-value="${value}"
    ></div>
  `;
}

function parseOptions(node) {
  const raw = node.getAttribute(OPTIONS_ATTR);

  if (!raw) {
    return {};
  }

  const trimmed = raw.trim();

  if (trimmed === 'drawer') {
    return {
      drawer: true
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.warn(err);
    return {};
  }
}

class ThemeBuilder {
  constructor(root, options) {
    this.root = root;
    const inlineMode = this.root.getAttribute('data-theme-builder-mode');
    const triggerAttr = this.root.getAttribute('data-theme-builder-trigger');
    const attrOptions = {};
    const rawLeft = this.root.getAttribute('left');
    const rawRight = this.root.getAttribute('right');
    const rawTop = this.root.getAttribute('top');
    const rawBottom = this.root.getAttribute('bottom');
    if (rawLeft) attrOptions.drawerToggleLeft = rawLeft.trim();
    if (rawRight) attrOptions.drawerToggleRight = rawRight.trim();
    if (rawTop) attrOptions.drawerToggleTop = rawTop.trim();
    if (rawBottom) attrOptions.drawerToggleBottom = rawBottom.trim();
    const extra = inlineMode && inlineMode.trim().toLowerCase() === 'drawer' ? {
      drawer: true
    } : {};

    if (triggerAttr && triggerAttr.trim().toLowerCase() === 'custom') {
      extra.drawerTrigger = 'custom';
    }

    this.options = { ...DEFAULT_OPTIONS,
      ...options,
      ...extra,
      ...attrOptions
    };
    this.options.drawer = Boolean(this.options.drawer) || this.options.drawerTrigger === 'custom';
    this.state = {
      theme: null,
      preview: null,
      mixed: null,
      secondaryNames: [],
      secondaryColors: {},
      secondaryPalettes: {},
      lastStepColors: {},
      stepThreeBlocks: {},
      paletteOverrides: {},
      syncSecondaryWithPrimary: true,
      savedThemes: [],
      activeSavedTheme: ''
    };
    this.modalId = `sf-theme-builder-modal-${++instanceCounter}`;
    this.refs = {};
    this.isSyncing = false;
    this.isPickerSyncing = false;
    this.isPickerOpen = false;
    this.modalMode = null;
    this.activePalette = null;
    this.pendingHct = null;
    this.modalContainer = null;
    this.paletteModal = null;
    this.savedThemesModal = null;
    this.drawerOverlay = null;
    this.drawerToggleEl = null;
    this.isDrawerOpen = false;
    this.drawerToggleHandler = null;
    this.drawerOverlayHandler = null;
    this.hasSavedColors = false;
    this.init();
  }

  init() {
    this.root.setAttribute(INIT_ATTR, '1');
    this.root.classList.add('color-on-surface');
    this.ensureModalService();
    this.ensureBaseLayout();
    this.initModals();
    this.setupDrawer();
    this.cacheRefs();
    this.restoreStateFromStorage();
    this.initPicker();

    if (this.refs.hexInput) {
      this.updatePreviewSwatch(this.refs.hexInput.value);
    }

    this.bindBaseEvents();
    this.bindModalEvents();
    this.dispatch('theme-builder:init', {
      state: this.state
    });
    this.bootstrapFromOptions();
  }

  destroy() {
    this.unbindBaseEvents();
    this.unbindModalEvents();
    this.destroyModals();
    this.teardownDrawer();
    this.destroyPicker();
    this.dispatch('theme-builder:destroy', {});
    this.root.removeAttribute(INIT_ATTR);
    instanceMap.delete(this.root);
    instanceSet.delete(this);
  }

  resetTheme() {
    const defaultHex = this.options.initialHex || '#0073ed';
    this.clearStoredHex();
    this.clearStateStorage();
    this.updateState({
      imageHex: null,
      secondaryNames: [],
      secondaryColors: {},
      secondaryPalettes: {},
      paletteOverrides: {},
      lastStepColors: {},
      stepThreeBlocks: {},
      syncSecondaryWithPrimary: true,
      activeSavedTheme: ''
    });
    const baseRoles = ['primary', 'secondary', 'tertiary', 'neutral', 'error', 'success', 'info', 'warning'];

    if (this.refs.paletteList) {
      this.refs.paletteList.querySelectorAll('[data-tb-palette-item]').forEach(node => {
        const key = node.getAttribute('data-tb-palette-item');

        if (key && !baseRoles.includes(key)) {
          node.remove();
        }
      });
    }

    if (this.refs.tonals) {
      this.refs.tonals.querySelectorAll('[data-tonal-group]').forEach(node => {
        const key = node.getAttribute('data-tonal-group');

        if (key && !baseRoles.includes(key)) {
          node.remove();
        }
      });
    }

    this.resetImageUpload();
    this.applyBaseHex(defaultHex);
    this.generateFromHex(defaultHex);
    this.updateSavedThemesUI();

    try {
      window.localStorage.removeItem(`${SAVED_THEMES_KEY}:active`);
    } catch (err) {
      console.warn(err);
    }
  }

  resetImageUpload() {
    if (this.refs.dropzone) {
      this.refs.dropzone.classList.remove('has-image', 'is-dragover', 'bg-primary-container', 'border-primary');
      this.refs.dropzone.classList.add('bg-surface-0', 'border-outline-variant');
    }

    if (this.refs.imagePreview) {
      this.refs.imagePreview.src = '';
    }

    this.togglePreviewVisibility(false);
    this.updateImageMeta('No file selected', 'PNG, JPG, GIF');
    this.updateImageProgress(0, {
      hide: true
    });
  }

  persistState() {
    const payload = {
      paletteOverrides: this.state.paletteOverrides || {},
      secondaryNames: this.state.secondaryNames || [],
      secondaryColors: this.state.secondaryColors || {},
      syncSecondaryWithPrimary: this.state.syncSecondaryWithPrimary
    };

    try {
      window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn(err);
    }
  }

  restoreStateFromStorage() {
    try {
      const raw = window.localStorage.getItem(STATE_STORAGE_KEY);
      const restoredActive = this.restoreSavedThemes();

      if (!raw) {
        this.updateSavedThemesUI(restoredActive || this.state.activeSavedTheme || '');
        return;
      }

      const parsed = JSON.parse(raw);
      const secondaryNames = Array.isArray(parsed?.secondaryNames) ? parsed.secondaryNames : [];
      const secondaryColors = parsed && typeof parsed.secondaryColors === 'object' ? parsed.secondaryColors : {};
      const syncSecondaryWithPrimary = typeof parsed?.syncSecondaryWithPrimary === 'boolean' ? parsed.syncSecondaryWithPrimary : true;
      const paletteOverrides = parsed && typeof parsed.paletteOverrides === 'object' ? parsed.paletteOverrides : {};

      if (secondaryNames.length) {
        this.setSecondaryNames(secondaryNames);
        Object.entries(secondaryColors).forEach(([name, value]) => {
          if (value?.color) {
            this.updateSecondaryColor(name, value.color);
          }
        });
        this.buildSecondaryPalettes();
      }

      if (Object.keys(paletteOverrides).length) {
        this.updateState({
          paletteOverrides
        });
      }

      this.updateState({
        syncSecondaryWithPrimary
      });

      if (this.state.imageHex) {
        this.togglePreviewVisibility(true);
      }

      this.updateSavedThemesUI(restoredActive || this.state.activeSavedTheme || '');
    } catch (err) {
      console.warn(err);
    }
  }

  updateState(patch) {
    this.state = { ...this.state,
      ...patch
    };
    this.dispatch('theme-builder:change', {
      state: this.state
    });
  }

  restoreSavedThemes() {
    try {
      const raw = window.localStorage.getItem(SAVED_THEMES_KEY);

      if (!raw) {
        return '';
      }

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        this.updateState({
          savedThemes: parsed
        });
      }

      const activeName = window.localStorage.getItem(`${SAVED_THEMES_KEY}:active`) || '';

      if (activeName) {
        this.updateState({
          activeSavedTheme: activeName
        });
      }

      return activeName;
    } catch (err) {
      console.warn(err);
      return '';
    }
  }

  persistSavedThemes(list) {
    try {
      window.localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(list));

      if (this.state.activeSavedTheme) {
        window.localStorage.setItem(`${SAVED_THEMES_KEY}:active`, this.state.activeSavedTheme);
      } else {
        window.localStorage.removeItem(`${SAVED_THEMES_KEY}:active`);
      }

      if (Array.isArray(list) && list.length > 0) {
        this.hasSavedColors = true;
      }
    } catch (err) {
      console.warn(err);
    }
  }

  togglePreviewVisibility(hasImage) {
    if (!this.refs.imagePreviewWrap) {
      return;
    }

    this.refs.imagePreviewWrap.classList.toggle('hidden', !hasImage);
  }

  openDrawer() {
    if (!this.options.drawer) return;
    this.root.removeAttribute('style');
    requestAnimationFrame(() => {
      this.root.classList.add('is-open');
      this.isDrawerOpen = true;

      if (this.drawerOverlay) {
        this.drawerOverlay.classList.remove('opacity-0', 'pointer-events-none', 'hidden');
        this.drawerOverlay.classList.add('opacity-6', 'pointer-events-auto');
      }

      if (this.drawerToggleEl) {
        this.drawerToggleEl.classList.add('hidden');
      }
    });
  }

  closeDrawer() {
    if (!this.options.drawer) return;
    this.root.classList.remove('is-open');
    this.isDrawerOpen = false;

    if (this.drawerOverlay) {
      this.drawerOverlay.classList.add('opacity-0', 'pointer-events-none', 'hidden');
      this.drawerOverlay.classList.remove('opacity-6', 'pointer-events-auto');
    }

    if (this.drawerToggleEl) {
      this.drawerToggleEl.classList.remove('hidden');
    }
  }

  toggleDrawer() {
    if (!this.options.drawer) return;

    if (this.isDrawerOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  bootstrapFromOptions() {
    const appliedHex = this.loadAppliedHex();
    const storedHex = this.options.storePrimaryColor === true ? this.loadStoredHex() : null;
    const hasSavedThemes = Array.isArray(this.state.savedThemes) && this.state.savedThemes.length > 0;
    this.hasSavedColors = Boolean(appliedHex || storedHex || hasSavedThemes);

    if (appliedHex) {
      this.applyBaseHex(appliedHex);
      this.generateFromHex(appliedHex).then(theme => {
        this.applyTheme(theme, {
          target: document.documentElement
        });
      });
      return;
    }

    if (this.options.initialHex) {
      this.applyBaseHex(this.options.initialHex);
      this.generateFromHex(this.options.initialHex);
    } else if (this.options.storePrimaryColor && storedHex) {
      this.applyBaseHex(storedHex);
      this.generateFromHex(storedHex).then(theme => {
        this.applyTheme(theme, {
          target: document.documentElement
        });
      });
      return;
    } else if (this.options.storePrimaryColor) {
      const fallbackHex = this.refs.hexInput && this.refs.hexInput.value || '#0073ed';
      this.applyBaseHex(fallbackHex);
      this.generateFromHex(fallbackHex);
    } else if (this.options.initialHct) {
      const {
        hue,
        chroma,
        tone
      } = this.options.initialHct;

      if (typeof hue === 'number' && typeof chroma === 'number' && typeof tone === 'number') {
        this.generateColorPreview({
          hue,
          chroma,
          tone
        });
      }
    } else {
      const fallbackHex = this.refs.hexInput && this.refs.hexInput.value || '#0073ed';
      this.applyBaseHex(fallbackHex);
      this.generateFromHex(fallbackHex);
    }
  }

  generateFromHex(hex) {
    return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.buildTheme)({
      color: hex
    }).then(theme => {
      this.updateState({
        theme,
        sourceHex: hex
      });
      this.storeHex(hex);
      this.updateThemePreview(theme);
      const shouldAutoApply = this.options.autoApply && this.hasSavedColors;

      if (shouldAutoApply) {
        this.applyTheme(theme, {});
      }

      this.dispatch('theme-builder:theme', {
        theme
      });
      return theme;
    });
  }

  applyBaseHex(hex) {
    if (!this.isValidHex(hex)) {
      return;
    }

    this.syncHexInput(hex);
    this.syncSlidersFromHex(hex);
  }

  generateFromArgb(argb) {
    return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.buildTheme)({
      argb
    }).then(theme => {
      this.updateState({
        theme,
        sourceArgb: argb
      });
      this.updateThemePreview(theme);
      const shouldAutoApply = this.options.autoApply && this.hasSavedColors;

      if (shouldAutoApply) {
        this.applyTheme(theme, {});
      }

      this.dispatch('theme-builder:theme', {
        theme
      });
      return theme;
    });
  }

  generateFromImage(imageEl) {
    return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.buildTheme)({
      image: imageEl
    }).then(hex => {
      this.updateState({
        imageHex: hex
      });
      this.togglePreviewVisibility(true);
      this.dispatch('theme-builder:image', {
        hex
      });
      return hex;
    });
  }

  generateMixed({
    colors,
    secondary = {}
  }) {
    return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.buildTheme)({
      mixed: true,
      colors,
      secondary
    }).then(mixed => {
      this.updateState({
        mixed
      });
      this.dispatch('theme-builder:mixed', {
        mixed
      });
      return mixed;
    });
  }

  generateColorPreview({
    hue,
    chroma,
    tone,
    hexes = false
  }) {
    const preview = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getColor)(hue, tone, chroma, hexes);
    this.updateState({
      preview
    });
    this.dispatch('theme-builder:preview', {
      preview
    });
    this.updatePreviewSwatch(preview?.hex);
    return preview;
  }

  buildThemeSnapshot(name, container = this.root) {
    const hexInput = container.querySelector('[data-tb-input="hex"]') || this.refs.hexInput;
    const hex = hexInput ? hexInput.value : null;
    return {
      name,
      hex,
      secondaryNames: this.state.secondaryNames || [],
      secondaryColors: this.state.secondaryColors || {},
      paletteOverrides: this.state.paletteOverrides || {},
      syncSecondaryWithPrimary: typeof this.state.syncSecondaryWithPrimary === 'boolean' ? this.state.syncSecondaryWithPrimary : true
    };
  }

  saveCurrentTheme(container = this.root) {
    const nameInput = document.querySelector('[data-tb-save-name]') || this.refs.saveName;
    if (!nameInput) return;
    const name = nameInput.value.trim();
    if (!name) return;
    const snapshot = this.buildThemeSnapshot(name, container);
    const list = Array.isArray(this.state.savedThemes) ? [...this.state.savedThemes.filter(item => item.name !== name), snapshot] : [snapshot];
    this.updateState({
      savedThemes: list,
      activeSavedTheme: name
    });
    this.hasSavedColors = true;
    this.persistSavedThemes(list);
    this.updateSavedThemesUI(name);
  }

  deleteSavedTheme(name) {
    if (!name) return;
    const list = Array.isArray(this.state.savedThemes) ? this.state.savedThemes.filter(item => item.name !== name) : [];
    this.updateState({
      savedThemes: list,
      activeSavedTheme: ''
    });
    this.persistSavedThemes(list);
    const hasAppliedHex = Boolean(this.loadAppliedHex());
    const hasStoredHex = this.options.storePrimaryColor === true && Boolean(this.loadStoredHex());
    this.hasSavedColors = Boolean(list.length || hasAppliedHex || hasStoredHex);
    this.updateSavedThemesUI('');
  }

  applySavedTheme(name) {
    if (!name) return;
    const list = Array.isArray(this.state.savedThemes) ? this.state.savedThemes : [];
    const entry = list.find(item => item.name === name);
    if (!entry) return;
    this.hasSavedColors = true;
    const nextHex = entry.hex || this.options.initialHex || '#0073ed';
    this.updateState({
      secondaryNames: entry.secondaryNames || [],
      secondaryColors: entry.secondaryColors || {},
      paletteOverrides: entry.paletteOverrides || {},
      syncSecondaryWithPrimary: typeof entry.syncSecondaryWithPrimary === 'boolean' ? entry.syncSecondaryWithPrimary : true
    });
    this.syncHexInput(nextHex);
    this.syncSlidersFromHex(nextHex);
    this.generateFromHex(nextHex);

    if (Array.isArray(entry.secondaryNames) && entry.secondaryNames.length) {
      this.setSecondaryNames(entry.secondaryNames);
      Object.entries(entry.secondaryColors || {}).forEach(([key, value]) => {
        if (value?.color) {
          this.updateSecondaryColor(key, value.color);
        }
      });
      this.buildSecondaryPalettes().then(palettes => {
        this.updateSecondaryPalettes(palettes);
      });
    }

    this.applyPaletteOverrides();
    this.updateState({
      activeSavedTheme: name
    });
    this.persistSavedThemes(this.state.savedThemes || []);
    this.updateSavedThemesUI(name);
  }

  updateSavedThemesUI(activeName = '') {
    const targetName = activeName || this.state.activeSavedTheme || '';
    const list = Array.isArray(this.state.savedThemes) ? this.state.savedThemes : [];
    const selects = Array.from(document.querySelectorAll('[data-tb-saved-select]'));
    selects.forEach(select => {
      const prevValue = targetName || select.value;
      select.innerHTML = '<option value="">Select saved theme</option>' + list.map(item => `<option value="${item.name}">${item.name}</option>`).join('');

      if (prevValue && list.some(item => item.name === prevValue)) {
        select.value = prevValue;
      } else {
        select.value = '';
      }

      const opts = select.querySelectorAll('option');
      opts.forEach(opt => {
        opt.selected = opt.value === select.value;
      });
      const container = select.closest('.sf-modal') || select.closest('.sf-theme-builder') || this.root;
      const dropdown = container.querySelector('[data-tb-saved-dropdown]');
      const dropdownInput = dropdown?.querySelector('.sf-dropdown-field input');
      const dropdownList = dropdown?.querySelector('[data-tb-saved-dropdown-list]');
      const hasOptions = list.length > 0;

      if (dropdown && dropdownList) {
        const itemsMarkup = list.map(item => {
          const isSelected = item.name === select.value;
          return `
              <div
                tabindex="0"
                role="button"
                data-value="${item.name}"
                class="sf-list-item transition cursor-pointer ${isSelected ? 'selected ' : ''}sf-list-item--text flex items-cross-center sf-list-item--size-1/2"
              >
                <div class="sf-list-item-wrap flex flex-1">
                  <div class="sf-list-item-container">${item.name}</div>
                </div>
                ${isSelected ? '<div class="sf-list-item-selected-item flex"><i class="sf-icon">check</i></div>' : ''}
              </div>
            `;
        }).join('');
        dropdownList.innerHTML = itemsMarkup;
        dropdown.dataset.selectedValue = select.value || '';
      }

      if (dropdownInput) {
        dropdownInput.value = select.value || '';
        dropdownInput.placeholder = hasOptions ? 'Select saved theme' : 'No saved themes';
      }

      const loadBtn = container.querySelector('[data-tb-load-theme]');
      const deleteBtn = container.querySelector('[data-tb-delete-theme]');
      const hasValue = Boolean(select.value);
      if (loadBtn) loadBtn.disabled = !hasValue;
      if (deleteBtn) deleteBtn.disabled = !hasValue;
    });
  }

  applyTheme(theme, options) {
    (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.applyTheme)(theme, options);
    this.applyPaletteVariables(theme);
    this.applyPaletteOverrides();
    this.updateState({
      themeApplied: Date.now()
    });
    this.persistState();
    const hex = this.refs.hexInput && this.isValidHex(this.refs.hexInput.value) ? this.refs.hexInput.value : this.state.sourceHex;

    if (hex) {
      this.storeAppliedHex(hex);
    }
  }

  setSecondaryNames(names) {
    const uniqueNames = Array.from(new Set(names || [])).filter(Boolean);
    const nextColors = { ...this.state.secondaryColors
    };
    uniqueNames.forEach(name => {
      if (!nextColors[name]) {
        nextColors[name] = {
          color: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.generateRandomColor)(),
          name
        };
      }
    });
    this.updateState({
      secondaryNames: uniqueNames,
      secondaryColors: nextColors
    });
    this.persistState();
    return nextColors;
  }

  updateSecondaryColor(name, color) {
    if (!name || !color) {
      return;
    }

    const nextColors = { ...this.state.secondaryColors,
      [name]: {
        color,
        name
      }
    };
    this.updateState({
      secondaryColors: nextColors
    });
    this.persistState();
  }

  buildSecondaryPalettes() {
    const colors = this.state.secondaryColors || {};

    if (!Object.keys(colors).length) {
      this.updateState({
        secondaryPalettes: {}
      });
      return Promise.resolve({});
    }

    return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getSecondColors)({
      colors
    }).then(palettes => {
      this.updateState({
        secondaryPalettes: palettes
      });
      return palettes;
    });
  }

  generateSingleColor(name, colorPalette) {
    if (!name || !colorPalette) {
      return Promise.resolve({});
    }

    return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getSingleThemeColor)(colorPalette, name).then(singleColor => {
      const merged = { ...this.state.lastStepColors,
        ...singleColor
      };
      this.updateState({
        lastStepColors: merged
      });
      return singleColor;
    });
  }

  generateTonalBlocks({
    name,
    tonals,
    hue,
    chroma
  }) {
    if (!name || !tonals || typeof hue !== 'number' || typeof chroma !== 'number') {
      return {};
    }

    const payload = {
      tonals,
      name,
      hue,
      chroma
    };
    const blocks = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getColorFromTonal)(payload);
    const merged = { ...this.state.stepThreeBlocks,
      ...blocks
    };
    this.updateState({
      stepThreeBlocks: merged
    });
    return blocks;
  }

  ensureBaseLayout() {
    const hasContent = this.root.children && this.root.children.length > 0;
    const forceTemplate = this.root.getAttribute('data-theme-builder-template') === 'base';

    if (hasContent && !forceTemplate) {
      return;
    }

    this.root.innerHTML = this.getBaseTemplate();
  }

  setupDrawer() {
    if (!this.options.drawer) {
      return;
    }

    this.root.classList.add('sf-theme-builder--drawer', 'sf-theme-builder--drawer-init', 'fixed', 'inset-block-0', 'inline-end-0', 'w-full', 'max-w-full', 'md:w-full', 'md:max-w-full', 'lg:w-1/3', 'xl:w-1/4', 'h-full', 'max-h-full', 'overflow-auto', 'z-9', 'block');
    this.root.style.display = 'none';
    this.closeDrawer();
    this.createDrawerChrome();
    this.drawerToggleHandler = this.toggleDrawer.bind(this);
    this.drawerOverlayHandler = this.closeDrawer.bind(this);
    requestAnimationFrame(() => {
      this.root.classList.remove('sf-theme-builder--drawer-init');
    });

    if (this.drawerToggleEl) {
      this.drawerToggleEl.addEventListener('click', this.drawerToggleHandler);
    }

    if (this.drawerOverlay) {
      this.drawerOverlay.addEventListener('click', this.drawerOverlayHandler);
    }
  }

  createDrawerChrome() {
    if (this.drawerToggleEl || this.drawerOverlay) {
      return;
    }

    if (this.options.drawerTrigger !== 'custom') {
      const inlinePos = (() => {
        if (typeof this.options.drawerToggleLeft === 'string' && this.options.drawerToggleLeft.trim().length) {
          return `inline-start-${this.options.drawerToggleLeft.trim()}`;
        }

        if (typeof this.options.drawerToggleRight === 'string' && this.options.drawerToggleRight.trim().length) {
          return `inline-end-${this.options.drawerToggleRight.trim()}`;
        }

        if (typeof this.options.drawerToggleInline === 'string' && this.options.drawerToggleInline.trim().length) {
          return this.options.drawerToggleInline.trim();
        }

        return 'inline-end-d2';
      })();

      const blockPos = (() => {
        if (typeof this.options.drawerToggleTop === 'string' && this.options.drawerToggleTop.trim().length) {
          return `block-start-${this.options.drawerToggleTop.trim()}`;
        }

        if (typeof this.options.drawerToggleBottom === 'string' && this.options.drawerToggleBottom.trim().length) {
          return `block-end-${this.options.drawerToggleBottom.trim()}`;
        }

        if (typeof this.options.drawerToggleBlock === 'string' && this.options.drawerToggleBlock.trim().length) {
          return this.options.drawerToggleBlock.trim();
        }

        return 'block-end-d2';
      })();

      const positionClasses = [inlinePos, blockPos].filter(Boolean).join(' ');
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = `sf-icon-button sf-icon-button--link sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--size-1 radius-rounded sf-theme-builder__drawer-toggle fixed ${positionClasses} z-31`;
      toggle.innerHTML = '<i class="sf-icon">palette</i>';
      document.body.appendChild(toggle);
      this.drawerToggleEl = toggle;
    }

    const overlay = document.createElement('div');
    overlay.className = 'sf-theme-builder__drawer-overlay fixed inset-0 z-20 opacity-0 pointer-events-none hidden transition';
    document.body.appendChild(overlay);
    this.drawerOverlay = overlay;
  }

  teardownDrawer() {
    if (this.drawerToggleEl && this.drawerToggleHandler) {
      this.drawerToggleEl.removeEventListener('click', this.drawerToggleHandler);
    }

    if (this.drawerOverlay && this.drawerOverlayHandler) {
      this.drawerOverlay.removeEventListener('click', this.drawerOverlayHandler);
    }

    if (this.drawerToggleEl) {
      this.drawerToggleEl.remove();
      this.drawerToggleEl = null;
    }

    if (this.drawerOverlay) {
      this.drawerOverlay.remove();
      this.drawerOverlay = null;
    }

    this.drawerToggleHandler = null;
    this.drawerOverlayHandler = null;
    this.isDrawerOpen = false;
    this.root.classList.remove('is-open', 'sf-theme-builder--drawer');
  }

  getBaseTemplate() {
    const defaultHex = this.options.initialHex || '#0073ed';
    return `
        <div class="sf-theme-builder__panel flex flex-column ${this.options.drawer ? 'gap-2' : 'gap-4'} bg-surface-1 border-outline shadow-2 color-on-surface p-2 min-h-full z-9 radius-2">
        <div class="sf-theme-builder__tabs flex gap-2 bg-surface-2 radius-1">
          <button class="sf-theme-builder__tab sf-button sf-button--size-1 sf-button--outline bg-primary-container sf-button--primary is-active flex-1 radius-default" data-tb-tab="custom">
            <span class="sf-button-text-container">Custom</span>
          </button>
          <button class="sf-theme-builder__tab sf-button sf-button--size-1 sf-button--outline sf-button--on-surface flex-1 radius-default" data-tb-tab="dynamic">
            <span class="sf-button-text-container">Dynamic</span>
          </button>
        </div>

        <div class="sf-theme-builder__panel-body flex flex-column flex-1 basis-0 gap-3 is-active" data-tb-panel="custom">
          <div class="sf-theme-builder__section border-outline-variant border-bottom-1 border-solid border-transparent p-bottom-4">
          <div class="sf-theme-builder__section-heading flex flex-column gap-2">
              <div class="sf-theme-builder__section-title text-large weight-7">Color Input</div>
            <div class="sf-theme-builder__section-desc text-small color-inherit m-top-1/2">
                This step allows you to input your desired source color. Pick a color by adjusting its Hue and its
                Chroma. See the selected color displayed in real-time and proceed to the next step once you're satisfied.
              </div>
            </div>
            <div class="sf-theme-builder__section-body grid gap-3 items-cross-center m-top-3">
              <div class="sf-theme-builder__controls flex items-cross-center gap-2 flex-wrap">
                <div class="sf-theme-builder__input-row flex items-cross-center gap-2">
                  <button
                    class="sf-theme-builder__picker sf-icon-button sf-icon-button--size-3 sf-icon-button--default sf-icon-button--on-surface radius-default ${this.options.drawer ? 'w-c8 h-c8' : 'w-d2 h-d2'}"
                    data-tb-picker
                    data-tb-preview
                    id="${this.modalId}-picker"
                    type="button"
                  ></button>
                  <input class="sf-theme-builder__input flex-1 text-small weight-6 color-on-surface p-1 bg-transparent" data-tb-input="hex" type="text" value="${defaultHex}" />
                </div>
              </div>
            </div>
          </div>

          <div class="sf-theme-builder__palette-header flex items-cross-center content-main-between">
            <div class="sf-theme-builder__section-title text-large weight-7">Palettes</div>
            <button class="sf-button sf-button--size-1 sf-button--outline sf-button--on-surface" data-tb-toggle-palettes aria-expanded="false" type="button">
              <span class="sf-button-text-container">Show</span>
            </button>
          </div>
        <div class="sf-theme-builder__palette-panel flex flex-col gap-2 flex-1 basis-0 overflow-y-auto min-h-0 hidden" data-tb-palette-panel>
          <div class="sf-theme-builder__palette-list grid gap-2">
            ${this.getPaletteItem('Primary')}
            ${this.getPaletteItem('Secondary')}
            ${this.getPaletteItem('Tertiary')}
            ${this.getPaletteItem('Neutral')}
            ${this.getPaletteItem('Error')}
            ${this.getPaletteItem('Success')}
            ${this.getPaletteItem('Info')}
            ${this.getPaletteItem('Warning')}
      <div class="sf-theme-builder__palette-item grid items-cross-center ${this.options.drawer ? 'gap-1' : 'gap-3'} is-add bg-surface-container p-1 relative radius-default" data-tb-add-item>
        <button class="sf-theme-builder__palette-swatch is-add sf-icon-button sf-icon-button--icon sf-icon-button--default sf-icon-button--primary  sf-icon-button--size-${this.options.drawer ? '1/2' : '3'}" data-tb-add-toggle type="button">
          <span class="sf-icon">add</span>
        </button>
        <div class="sf-theme-builder__palette-label ${this.options.drawer ? 'sf-text-1/2' : 'sf-text-1'} weight-6" data-tb-add-label>Add</div>
        <label class="sf-theme-builder__palette-add-input sf-input sf-input--size-${this.options.drawer ? '1/2' : '1'} sf-input--bordered sf-input--on-surface flex flex-col flex-1 m-0 hidden" data-tb-add-input-wrap>
          <span class="sf-input-field items-cross-center transition flex">
            <input data-tb-add-input type="text" aria-label="New color name" />
          </span>
        </label>
      </div>
          </div>

        <div class="sf-theme-builder__tonals grid ${this.options.drawer ? 'gap-2' : 'gap-4'}">
          ${this.getTonalGroup('primary')}
          ${this.getTonalGroup('secondary')}
          ${this.getTonalGroup('tertiary')}
          ${this.getTonalGroup('neutral')}
          ${this.getTonalGroup('error')}
          ${this.getTonalGroup('success')}
          ${this.getTonalGroup('info')}
          ${this.getTonalGroup('warning')}
        </div>
          </div>

        </div>

        <div class="sf-theme-builder__panel-body flex flex-column flex-1 basis-0 gap-3 hidden" data-tb-panel="dynamic">
          <div class="sf-theme-builder__section border-outline-variant border-bottom-1 border-solid border-transparent p-bottom-4">
          <div class="sf-theme-builder__section-heading flex flex-column gap-2">
              <div class="sf-theme-builder__section-title text-large weight-7">Image Upload</div>
              <div class="sf-theme-builder__section-desc text-small color-inherit">
                This step allows you to input your desired source color from an image. Upload an image, and the theme
                will be generated based on the dominant palette.
              </div>
            </div>
            <div class="sf-theme-builder__section-body grid gap-3 items-cross-center m-top-3">
              <div class="sf-theme-builder__dynamic-copy text-small color-inherit">
                Drag and drop an image, or use the upload button below.
              </div>
              <div class="sf-theme-builder__swatch is-dynamic h-e5 flex items-cross-center content-main-center bg-surface-inverse p-3 radius-default" data-tb-preview-dynamic>

                <i class="sf-icon">visibility</i>

              </div>
            </div>
          </div>
          <div class="sf-theme-builder__dropzone grid gap-3 bg-surface-0 border-dashed border-1 border-transparent p-4 radius-1" data-tb-dropzone>
            <div class="sf-theme-builder__drop-header flex items-cross-center gap-2">
              <div class="sf-theme-builder__drop-icon ${this.options.drawer ? 'w-c6 h-c6' : 'w-d0 h-d0'} grid items-cross-center content-main-center bg-primary-container color-on-primary-container radius-default">
                <span class="sf-icon">add</span>
              </div>
              <div class="sf-theme-builder__drop-meta">
                <div class="sf-theme-builder__drop-name text weight-6" data-tb-image-name>No file selected</div>
                <div class="sf-theme-builder__drop-size label color-inherit" data-tb-image-size>PNG, JPG, GIF</div>
              </div>
            </div>
            <div class="sf-theme-builder__drop-progress h-a8 bg-surface-2 relative hidden radius-rounded overflow-hidden" data-tb-drop-progress>
              <div class="sf-theme-builder__drop-bar bg-primary absolute top-0 inline-start-0 h-full" data-tb-image-progress-bar></div>
              <div class="sf-theme-builder__drop-percent label-small color-inherit absolute inline-end-0" data-tb-image-progress>0%</div>
            </div>
            <div class="sf-theme-builder__drop-actions flex items-cross-center gap-2 flex-wrap">
              <input
                class="sf-theme-builder__file-input hidden"
                type="file"
                accept="image/png,image/jpeg,image/gif"
                data-tb-file
              />
              <button type="button" class="sf-theme-builder__upload-btn sf-button sf-button--size-1 sf-button--default sf-button--primary" data-tb-upload>
                <span class="sf-button-text-container">Click to upload</span>
              </button>
              <span class="sf-theme-builder__drop-hint label color-inherit">or drag and drop</span>
            </div>
              <div class="sf-theme-builder__drop-preview flex items-cross-center content-main-center bg-surface-1 hidden radius-1 overflow-hidden" data-tb-image-preview-wrap>
              <img class="object-cover" data-tb-image-preview alt="preview" />
            </div>
          </div>
        </div>

        <div class="sf-theme-builder__row flex items-cross-center content-main-start gap-2 m-top-auto">
          <button class="sf-button sf-button--size-1 sf-button--outline sf-button--on-surface flex-1 wrap-none" data-tb-action="reset-theme"><span class="sf-button-text-container">Reset</span></button>
          <button class="sf-button sf-button--size-1 sf-button--outline sf-button--primary flex-1 wrap-none" data-tb-action="apply-theme"><span class="sf-button-text-container">Apply theme</span></button>
        </div>
        <div class="sf-theme-builder__row flex items-cross-center content-main-start gap-2 ${this.options.drawer ? '' : 'hidden'}">
          <button class="sf-button sf-button--size-1 sf-button--outline sf-button--on-surface flex-1 wrap-none" type="button" data-sf-modal-open="${this.modalId}-saved-modal"><span class="sf-button-text-container">Saved themes</span></button>
        </div>
      </div>
    `;
  }

  getSavedThemesModalContent() {
    const size = this.options.drawer ? '1/2' : '1';
    return `
      <div class="sf-theme-builder__modal-inner flex flex-column gap-3">
        <div class="flex items-cross-center gap-2 flex-wrap">
          <label class="sf-theme-builder__palette-add-input sf-input sf-input--size-${size} sf-input--bordered sf-input--on-surface flex flex-col flex-1 w-full m-0">
            <span class="sf-input-field items-cross-center transition flex">
              <input data-tb-save-name name="theme_save" type="text" placeholder="Theme name" aria-label="Theme name" />
            </span>
          </label>
          <button class="sf-button sf-button--outline sf-button--on-surface sf-button--size-${size}" type="button" data-tb-save-theme><span class="sf-button-text-container">Save</span></button>
        </div>
        <div class="flex items-cross-center gap-2 flex-wrap">
          <div portal class="sf-dropdown sf-dropdown--size-${size} sf-dropdown--text sf-dropdown--outlined flex flex-col flex-1 w-full" data-tb-saved-dropdown>
            <label class="sf-dropdown-field cursor-pointer items-cross-center transition flex">
              <input
                type="text"
                value=""
                placeholder="Select saved theme"
                aria-label="Saved themes"
                readonly
              />
              <button
                type="button"
                class="sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${size} radius-default"
              >
                <i class="sf-icon">keyboard_arrow_down</i>
              </button>
            </label>
            <div class="sf-list flex flex-col">
              <div class="sf-list-container-wrap">
                <div class="sf-list-container flex flex-col" data-tb-saved-dropdown-list>
                </div>
              </div>
            </div>
          </div>
          <select data-tb-saved-select aria-label="Saved themes" class="hidden">
            <option value="">Select saved theme</option>
          </select>
          <button class="sf-button sf-button--outline sf-button--on-surface sf-button--size-${size}" type="button" data-tb-load-theme disabled><span class="sf-button-text-container">Load</span></button>
          <button class="sf-button sf-button--outline sf-button--on-surface sf-button--size-${size}" type="button" data-tb-delete-theme disabled><span class="sf-button-text-container">Delete</span></button>
        </div>
      </div>
    `;
  }

  getPaletteModalContent() {
    const hct = this.state.preview || this.state.mixed || this.state.theme?.hct || {
      hue: 0,
      chroma: 0,
      tone: 0
    };
    return `
      <div class="sf-theme-builder__modal-inner flex flex-column gap-4">
        <div class="sf-theme-builder__modal-sync flex items-cross-center gap-2" data-tb-sync-secondary-wrap>
          <label class="sf-checkbox sf-checkbox--size-1 flex">
            <span class="sf-checkbox-box transition flex">
              <input
                type="checkbox"
                class="sf-theme-builder__sync-toggle"
                data-tb-sync-secondary
                id="${this.modalId}-sync-secondary"
              />
              <span class="sf-icon" aria-hidden="true"></span>
            </span>
            <span class="sf-checkbox-container flex flex-col">
              <span class="sf-checkbox-top flex">
                <span class="sf-checkbox-label">Update secondary palettes when primary changes</span>
              </span>
            </span>
          </label>
        </div>
        ${this.getSliderTemplate('Hue', 'hue', hct.hue, 0, 360)}
        ${this.getSliderTemplate('Chroma', 'chroma', hct.chroma, 0, 150)}
        ${this.getSliderTemplate('Tone', 'tone', hct.tone, 0, 100)}
        <div class="sf-theme-builder__modal-actions flex content-main-end gap-2">
          <button
            class="sf-button sf-button--size-1 sf-button--outline sf-button--on-surface"
            data-tb-modal-cancel
            data-sf-modal-close="${this.modalId}-palette-modal"
            type="button"
          >
            <span class="sf-button-text-container">Cancel</span>
          </button>
          <button
            class="sf-button sf-button--size-1 sf-button--default sf-button--primary"
            data-tb-modal-accept
            data-sf-modal-close="${this.modalId}-palette-modal"
            type="button"
          >
            <span class="sf-button-text-container">Accept</span>
          </button>
        </div>
      </div>
    `;
  }

  getSliderTemplate(label, key, value, min, max, step = 1) {
    const sliderMarkup = createRangeSliderTemplate({
      min,
      max,
      step,
      value
    });
    return `
      <div class="sf-theme-builder__slider" data-range="${key}">
        <div class="sf-theme-builder__slider-label text-small color-inherit">${label}</div>
        ${sliderMarkup}
        <div class="sf-theme-builder__slider-bar p-1/2 w-full radius-default" data-tb-slider-bar="${key}"></div>
      </div>
    `;
  }

  getSliderControl(slider) {
    if (!(slider instanceof HTMLElement)) {
      return null;
    }

    return slider.querySelector('.sf-range-slider');
  }

  getSliderValue(slider) {
    const control = this.getSliderControl(slider);

    if (!(control instanceof HTMLElement)) {
      return null;
    }

    const apiValue = window.SF?.RangeSlider?.getValue?.(control);
    const value = Array.isArray(apiValue) ? apiValue[0] : apiValue;
    const numeric = Number(value ?? control.dataset.value ?? control.getAttribute('data-value'));
    return Number.isFinite(numeric) ? numeric : null;
  }

  setSliderControlValue(slider, value) {
    const control = this.getSliderControl(slider);

    if (!(control instanceof HTMLElement)) {
      return;
    }

    const nextValue = Number(value);

    if (!Number.isFinite(nextValue)) {
      return;
    }

    control.setAttribute('data-value', String(nextValue));
    control.dataset.value = String(nextValue);

    if (window.SF?.RangeSlider?.setValue?.(control, nextValue)) {
      return;
    }

    window.SF?.RangeSlider?.bind?.(control);
    window.SF?.RangeSlider?.setValue?.(control, nextValue);
  }

  getPaletteItem(label) {
    const key = label.toLowerCase();
    const paddingClass = this.options.drawer ? 'p-1' : 'p-3';
    const gapClass = this.options.drawer ? 'gap-1' : 'gap-3';
    const menuPositionStyle = this.options.drawer ? `style="${getPaletteMenuPositionStyle(getComputedStyle(this.root).direction)}"` : '';
    return `
      <div class="sf-theme-builder__palette-item grid items-cross-center ${gapClass} bg-surface-container ${paddingClass} radius-default" data-tb-palette-item="${key}">
        <button
          class="sf-theme-builder__palette-swatch sf-icon-button sf-icon-button--size-${this.options.drawer ? '1/2' : '3'} ${this.options.drawer ? 'w-c6 h-c6' : 'w-d0 h-d0'} sf-icon-button--default sf-icon-button--on-surface bg-primary cursor-pointer radius-default"
          data-palette="${key}"
          data-tb-open-modal="${key}"
          data-sf-modal-open="${this.modalId}-palette-modal"
          type="button"
        ></button>
        <div class="sf-theme-builder__palette-label ${this.options.drawer ? 'sf-text-1/2' : 'sf-text-1'} weight-6">${label}</div>
        ${BASE_ROLES.includes(key) ? '' : `<div class="sf-theme-builder__palette-actions absolute inline-flex items-cross-center inline-end-0 m-0 content-main-end" data-tb-palette-actions="${key}">
                <button class="sf-theme-builder__palette-menu-btn text-small cursor-pointer grid items-cross-center content-main-center bg-transparent p-1 z-2 radius-default" type="button" data-tb-palette-menu-toggle aria-label="Actions">?</button>
                <div class="sf-theme-builder__palette-menu bg-surface-overlay absolute p-2 hidden radius-default" data-tb-palette-menu ${menuPositionStyle}>
                  <button class="text-small cursor-pointer p-1 radius-default text-start" type="button" data-tb-palette-rename>Rename</button>
                  <button class="text-small cursor-pointer p-1 radius-default text-start" type="button" data-tb-palette-delete>Delete</button>
                </div>
              </div>`}
      </div>
    `;
  }

  getTonalGroup(label) {
    return `
      <div class="sf-theme-builder__tonal-group" data-tonal-group="${label}">
        <div class="sf-theme-builder__tonal-title capitalize text-small weight-7 m-bottom-1/2">${label}</div>
        <div class="sf-theme-builder__tonal-grid grid ${this.options.drawer ? 'gap-1' : 'gap-2'}">
          ${DEFAULT_TONE_VALUES.map(value => this.getTonalChip(value)).join('')}
        </div>
      </div>
    `;
  }

  getTonalChip(value) {
    return `
      <div class="sf-theme-builder__tonal-chip grid ${this.options.drawer ? 'gap-1/3' : 'gap-3'} items-cross-center items-main-center" data-tonal-value="${value}">
        <div class="sf-theme-builder__tonal-swatch ${this.options.drawer ? 'w-c6 h-c6' : 'w-d0 h-d0'} grid items-center content-main-center bg-surface-inverse color-on-surface-inverse label weight-7 radius-default" data-tonal-swatch>${value}</div>
        <div class="sf-theme-builder__tonal-hex label-small color-inherit" data-tonal-hex>#000000</div>
      </div>
    `;
  }

  cacheRefs() {
    this.refs.hexInput = this.root.querySelector('[data-tb-input="hex"]');
    this.refs.preview = this.root.querySelector('[data-tb-preview]');
    this.refs.previewLarge = this.root.querySelector('[data-tb-preview-large]');
    this.refs.previewDynamic = this.root.querySelector('[data-tb-preview-dynamic]');
    this.refs.picker = this.root.querySelector('[data-tb-picker]');
    this.refs.modalTitle = this.root.querySelector('[data-tb-modal-title]');
    this.refs.modalPreview = this.root.querySelector('[data-tb-modal-preview]');
    this.refs.modalAccept = this.root.querySelector('[data-tb-modal-accept]');
    this.refs.modalCancel = this.root.querySelector('[data-tb-modal-cancel]');
    this.refs.modalOpenButtons = Array.from(this.root.querySelectorAll('[data-tb-open-modal]'));
    this.refs.syncSecondaryToggle = this.root.querySelector('[data-tb-sync-secondary]');
    this.refs.tabs = Array.from(this.root.querySelectorAll('[data-tb-tab]'));
    this.refs.panels = Array.from(this.root.querySelectorAll('[data-tb-panel]'));
    this.refs.dropzone = this.root.querySelector('[data-tb-dropzone]');
    this.refs.fileInput = this.root.querySelector('[data-tb-file]');
    this.refs.uploadBtn = this.root.querySelector('[data-tb-upload]');
    this.refs.imagePreview = this.root.querySelector('[data-tb-image-preview]');
    this.refs.imagePreviewWrap = this.root.querySelector('[data-tb-image-preview-wrap]');
    this.refs.imageName = this.root.querySelector('[data-tb-image-name]');
    this.refs.imageSize = this.root.querySelector('[data-tb-image-size]');
    this.refs.imageProgress = this.root.querySelector('[data-tb-image-progress]');
    this.refs.imageProgressBar = this.root.querySelector('[data-tb-image-progress-bar]');
    this.refs.dropProgress = this.root.querySelector('[data-tb-drop-progress]');
    this.refs.sliders = Array.from(this.root.querySelectorAll('.sf-theme-builder__slider'));
    this.refs.secondaryInput = this.root.querySelector('[data-tb-input="secondary"]');
    this.refs.tonalNameInput = this.root.querySelector('[data-tb-input="tonal-name"]');
    this.refs.tonalsInput = this.root.querySelector('[data-tb-input="tonals"]');
    this.refs.actionApply = this.root.querySelector('[data-tb-action="apply-theme"]');
    this.refs.actionReset = this.root.querySelector('[data-tb-action="reset-theme"]');
    this.refs.actionSecondary = this.root.querySelector('[data-tb-action="secondary-apply"]');
    this.refs.actionTonals = this.root.querySelector('[data-tb-action="tonal-generate"]');
    this.refs.paletteList = this.root.querySelector('.sf-theme-builder__palette-list');
    this.refs.palettePanel = this.root.querySelector('[data-tb-palette-panel]');
    this.refs.paletteToggle = this.root.querySelector('[data-tb-toggle-palettes]');
    this.refs.tonals = this.root.querySelector('.sf-theme-builder__tonals');
    this.refs.syncSecondaryToggle = this.root.querySelector('[data-tb-sync-secondary]');
    this.refs.addItem = this.root.querySelector('[data-tb-add-item]');
    this.refs.addToggle = this.root.querySelector('[data-tb-add-toggle]');
    this.refs.addInput = this.root.querySelector('[data-tb-add-input]');
    this.refs.addInputWrap = this.root.querySelector('[data-tb-add-input-wrap]');
    this.refs.addLabel = this.root.querySelector('[data-tb-add-label]');
    this.refs.actionReset = this.root.querySelector('[data-tb-action="reset-theme"]');
  }

  bindBaseEvents() {
    if (this.refs.tabs && this.refs.tabs.length) {
      this.onTabClick = event => {
        const tab = event.currentTarget;
        const target = tab.getAttribute('data-tb-tab');

        if (target) {
          this.setActiveTab(target);
        }
      };

      this.refs.tabs.forEach(tab => {
        tab.addEventListener('click', this.onTabClick);
      });
    }

    if (this.refs.modalOpenButtons && this.refs.modalOpenButtons.length) {
      this.onModalOpen = event => {
        const target = event.currentTarget.getAttribute('data-tb-open-modal');

        if (target) {
          this.prepareModalForPalette(target);
        }
      };

      this.refs.modalOpenButtons.forEach(button => {
        button.addEventListener('click', this.onModalOpen);
      });
    }

    if (this.refs.uploadBtn && this.refs.fileInput) {
      this.onUploadClick = () => {
        this.refs.fileInput.click();
      };

      this.refs.uploadBtn.addEventListener('click', this.onUploadClick);
    }

    if (this.refs.fileInput) {
      this.onFileChange = event => {
        const file = event.target.files && event.target.files[0];

        if (file) {
          this.handleImageFile(file);
        }
      };

      this.refs.fileInput.addEventListener('change', this.onFileChange);
    }

    if (this.refs.dropzone) {
      this.onDropzoneEnter = event => {
        this.preventDefaults(event);
        this.setDropzoneDragState(true);
      };

      this.onDropzoneLeave = event => {
        this.preventDefaults(event);
        this.setDropzoneDragState(false);
      };

      this.onDropzoneOver = event => {
        this.preventDefaults(event);
      };

      this.onDropzoneDrop = event => {
        this.preventDefaults(event);
        this.setDropzoneDragState(false);
        const files = event.dataTransfer ? event.dataTransfer.files : null;

        if (files && files.length) {
          this.handleImageFile(files[0]);
        }
      };

      this.refs.dropzone.addEventListener('dragenter', this.onDropzoneEnter);
      this.refs.dropzone.addEventListener('dragover', this.onDropzoneOver);
      this.refs.dropzone.addEventListener('dragleave', this.onDropzoneLeave);
      this.refs.dropzone.addEventListener('drop', this.onDropzoneDrop);
    }

    if (this.refs.hexInput) {
      this.onHexInput = event => {
        const val = (event.target.value || '').trim();

        if (this.isValidHex(val)) {
          this.updatePreviewSwatch(val);
          this.syncSlidersFromHex(val);
          this.syncPickerFromHex(val);
          this.generateFromHex(val);
        }
      };

      this.refs.hexInput.addEventListener('input', this.onHexInput);
    }

    if (this.refs.sliders && this.refs.sliders.length) {
      this.onSliderInput = () => {
        if (this.isSyncing) {
          return;
        }

        const hct = this.getHctFromSliders();

        if (hct) {
          this.pendingHct = hct;
          const preview = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getColor)(hct.hue, hct.tone, hct.chroma, false);

          if (preview?.hex) {
            this.updateModalPreview(preview.hex);

            if (!this.modalMode) {
              this.syncHexInput(preview.hex);
            }
          }
        }
      };

      this.refs.sliders.forEach(slider => {
        const control = this.getSliderControl(slider);
        control?.addEventListener('sf-range-slider-update', this.onSliderInput);
        control?.addEventListener('sf-range-slider-change', this.onSliderInput);
      });
    }

    if (this.refs.paletteToggle && this.refs.palettePanel) {
      this.onPaletteToggle = () => {
        const isHidden = this.refs.palettePanel.classList.toggle('hidden');
        this.refs.paletteToggle.setAttribute('aria-expanded', (!isHidden).toString());
        const label = isHidden ? 'Show' : 'Hide';
        const textEl = this.refs.paletteToggle.querySelector('.sf-button-text-container');

        if (textEl) {
          textEl.textContent = label;
        }
      };

      this.refs.paletteToggle.addEventListener('click', this.onPaletteToggle);
    }

    if (this.refs.actionApply) {
      this.onApplyClick = () => {
        const currentHex = this.refs.hexInput && this.isValidHex(this.refs.hexInput.value) ? this.refs.hexInput.value : null;
        const needsBuild = !this.state.theme || currentHex && this.state.sourceHex && currentHex.toUpperCase() !== this.state.sourceHex.toUpperCase();

        if (needsBuild && currentHex) {
          this.generateFromHex(currentHex).then(nextTheme => {
            if (nextTheme) {
              this.applyTheme(nextTheme, {
                target: document.documentElement
              });
              this.applyPaletteOverrides();
            }
          });
          return;
        }

        if (this.state.theme) {
          this.applyTheme(this.state.theme, {
            target: document.documentElement
          });
          this.applyPaletteOverrides();
        }
      };

      this.refs.actionApply.addEventListener('click', this.onApplyClick);
    }

    if (this.refs.actionReset) {
      this.onResetClick = () => {
        this.resetTheme();
      };

      this.refs.actionReset.addEventListener('click', this.onResetClick);
    }

    this.onSavedChange = e => {
      if (!e.target.matches('[data-tb-saved-select]')) return;
      const select = e.target;
      const container = select.closest('.sf-modal') || select.closest('.sf-theme-builder') || this.root;
      const loadBtn = container.querySelector('[data-tb-load-theme]');
      const deleteBtn = container.querySelector('[data-tb-delete-theme]');
      const hasValue = Boolean(select.value);
      if (loadBtn) loadBtn.disabled = !hasValue;
      if (deleteBtn) deleteBtn.disabled = !hasValue;
    };

    document.addEventListener('change', this.onSavedChange);

    this.onSavedDropdownChange = event => {
      const dropdown = event.target.closest?.('[data-tb-saved-dropdown]');
      if (!dropdown) return;
      const container = dropdown.closest('.sf-modal') || this.root;
      const select = container.querySelector('[data-tb-saved-select]');
      const value = event.detail?.value || '';
      if (!select) return;
      select.value = value;
      select.dispatchEvent(new Event('change', {
        bubbles: true
      }));
    };

    document.addEventListener('sf-dropdown:change', this.onSavedDropdownChange);

    this.onSavedClick = e => {
      const saveBtn = e.target.closest('[data-tb-save-theme]');
      const loadBtn = e.target.closest('[data-tb-load-theme]');
      const deleteBtn = e.target.closest('[data-tb-delete-theme]');
      if (!saveBtn && !loadBtn && !deleteBtn) return;
      const container = e.target.closest('.sf-modal') || this.root;

      if (saveBtn) {
        this.saveCurrentTheme(container);
      } else if (loadBtn) {
        const select = container.querySelector('[data-tb-saved-select]');

        if (select?.value) {
          this.applySavedTheme(select.value);
        }
      } else if (deleteBtn) {
        const select = container.querySelector('[data-tb-saved-select]');

        if (select?.value) {
          this.deleteSavedTheme(select.value);
        }
      }
    };

    document.addEventListener('click', this.onSavedClick);

    if (this.refs.actionSecondary) {
      this.onSecondaryClick = () => {
        const raw = this.refs.secondaryInput ? this.refs.secondaryInput.value : '';
        const names = raw.split(',').map(value => value.trim()).filter(Boolean);
        this.setSecondaryNames(names);
        this.buildSecondaryPalettes().then(palettes => {
          this.dispatch('theme-builder:secondary', {
            palettes
          });
        });
      };

      this.refs.actionSecondary.addEventListener('click', this.onSecondaryClick);
    }

    if (this.refs.actionTonals) {
      this.onTonalsClick = () => {
        const name = this.refs.tonalNameInput ? this.refs.tonalNameInput.value.trim() : '';
        const raw = this.refs.tonalsInput ? this.refs.tonalsInput.value : '';
        const tonals = raw.split(',').map(value => value.trim()).filter(Boolean);
        const hct = this.getHctFromSliders();

        if (name && tonals.length && hct) {
          const blocks = this.generateTonalBlocks({
            name,
            tonals,
            hue: hct.hue,
            chroma: hct.chroma
          });
          this.dispatch('theme-builder:tonals', {
            blocks
          });
        }
      };

      this.refs.actionTonals.addEventListener('click', this.onTonalsClick);
    }

    if (this.refs.addToggle) {
      this.onAddToggle = () => {
        if (!this.refs.addItem) {
          return;
        }

        const isEditing = this.refs.addItem.classList.toggle('is-editing');

        if (this.refs.addInputWrap) {
          this.refs.addInputWrap.classList.toggle('hidden', !isEditing);
        }

        if (this.refs.addLabel) {
          this.refs.addLabel.classList.toggle('hidden', isEditing);
        }

        if (isEditing) {
          const count = Object.keys(this.state.secondaryColors || {}).length;
          const nextName = `Custom color ${count + 1}`;

          if (this.refs.addInput) {
            this.refs.addInput.value = nextName;
            this.refs.addInput.focus();
            this.refs.addInput.select();
          }

          if (this.refs.addToggle) {
            const addIcon = this.refs.addToggle.querySelector('.sf-icon');

            if (addIcon) {
              addIcon.textContent = 'check';
            }
          }

          if (this.refs.addLabel) {
            this.refs.addLabel.textContent = 'Save';
          }
        } else {
          this.commitAddColor();
        }
      };

      this.refs.addToggle.addEventListener('click', this.onAddToggle);
    }

    if (this.refs.addInput) {
      this.onAddInputKeydown = event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.commitAddColor();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          this.cancelAddColor();
        }
      };

      this.refs.addInput.addEventListener('keydown', this.onAddInputKeydown);
    }
  }

  unbindBaseEvents() {
    if (this.refs.tabs && this.refs.tabs.length && this.onTabClick) {
      this.refs.tabs.forEach(tab => {
        tab.removeEventListener('click', this.onTabClick);
      });
    }

    if (this.refs.modalOpenButtons && this.refs.modalOpenButtons.length && this.onModalOpen) {
      this.refs.modalOpenButtons.forEach(button => {
        button.removeEventListener('click', this.onModalOpen);
      });
    }

    if (this.refs.uploadBtn && this.onUploadClick) {
      this.refs.uploadBtn.removeEventListener('click', this.onUploadClick);
    }

    if (this.refs.fileInput && this.onFileChange) {
      this.refs.fileInput.removeEventListener('change', this.onFileChange);
    }

    if (this.refs.dropzone) {
      if (this.onDropzoneEnter) {
        this.refs.dropzone.removeEventListener('dragenter', this.onDropzoneEnter);
      }

      if (this.onDropzoneOver) {
        this.refs.dropzone.removeEventListener('dragover', this.onDropzoneOver);
      }

      if (this.onDropzoneLeave) {
        this.refs.dropzone.removeEventListener('dragleave', this.onDropzoneLeave);
      }

      if (this.onDropzoneDrop) {
        this.refs.dropzone.removeEventListener('drop', this.onDropzoneDrop);
      }
    }

    if (this.refs.hexInput && this.onHexInput) {
      this.refs.hexInput.removeEventListener('input', this.onHexInput);
    }

    if (this.refs.sliders && this.refs.sliders.length && this.onSliderInput) {
      this.refs.sliders.forEach(slider => {
        const control = this.getSliderControl(slider);
        control?.removeEventListener('sf-range-slider-update', this.onSliderInput);
        control?.removeEventListener('sf-range-slider-change', this.onSliderInput);
      });
    }

    if (this.refs.paletteToggle && this.onPaletteToggle) {
      this.refs.paletteToggle.removeEventListener('click', this.onPaletteToggle);
    }

    if (this.refs.actionApply && this.onApplyClick) {
      this.refs.actionApply.removeEventListener('click', this.onApplyClick);
    }

    if (this.refs.actionReset && this.onResetClick) {
      this.refs.actionReset.removeEventListener('click', this.onResetClick);
    }

    if (this.onSavedChange) {
      document.removeEventListener('change', this.onSavedChange);
    }

    if (this.onSavedDropdownChange) {
      document.removeEventListener('sf-dropdown:change', this.onSavedDropdownChange);
    }

    if (this.onSavedClick) {
      document.removeEventListener('click', this.onSavedClick);
    }

    if (this.refs.actionSecondary && this.onSecondaryClick) {
      this.refs.actionSecondary.removeEventListener('click', this.onSecondaryClick);
    }

    if (this.refs.actionReset && this.onResetClick) {
      this.refs.actionReset.removeEventListener('click', this.onResetClick);
    }

    if (this.refs.actionTonals && this.onTonalsClick) {
      this.refs.actionTonals.removeEventListener('click', this.onTonalsClick);
    }

    if (this.refs.addToggle && this.onAddToggle) {
      this.refs.addToggle.removeEventListener('click', this.onAddToggle);
    }

    if (this.refs.addInput && this.onAddInputKeydown) {
      this.refs.addInput.removeEventListener('keydown', this.onAddInputKeydown);
    }
  }

  getHctFromSliders() {
    const values = {};
    this.refs.sliders.forEach(slider => {
      const key = slider.getAttribute('data-range');
      const value = this.getSliderValue(slider);

      if (key && value !== null) {
        values[key] = value;
      }
    });

    if (typeof values.hue === 'number' && typeof values.chroma === 'number' && typeof values.tone === 'number') {
      return {
        hue: values.hue,
        chroma: values.chroma,
        tone: values.tone
      };
    }

    return null;
  }

  updatePreviewSwatch(hex) {
    if (this.refs.preview && hex) {
      this.refs.preview.style.backgroundColor = hex;
    }

    if (this.refs.previewLarge && hex) {
      this.refs.previewLarge.style.backgroundColor = hex;
    }

    if (this.refs.previewDynamic && hex) {
      this.refs.previewDynamic.style.backgroundColor = hex;
    }
  }

  isValidHex(value) {
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
  }

  syncHexInput(hex) {
    if (!this.refs.hexInput || !hex) {
      return;
    }

    this.refs.hexInput.value = hex.toUpperCase();
    this.updatePreviewSwatch(hex);
    this.syncPickerFromHex(hex);
    this.storeHex(hex);
  }

  syncSlidersFromHex(hex) {
    try {
      const argb = (0,_utils_colors__WEBPACK_IMPORTED_MODULE_2__.hex2argb)(hex.replace('#', ''));
      const hct = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(argb);
      this.syncSlidersFromHct({
        hue: Math.round(hct.internalHue),
        chroma: Math.round(hct.internalChroma),
        tone: Math.round(hct.internalTone)
      });
    } catch (err) {
      console.warn(err); // Ignore invalid conversion; input validation handles it.
    }
  }

  syncSlidersFromHct({
    hue,
    chroma,
    tone
  }) {
    this.isSyncing = true;
    this.setSliderValue('hue', hue);
    this.setSliderValue('chroma', chroma);
    this.setSliderValue('tone', tone);
    this.isSyncing = false;
  }

  setSliderValue(key, value) {
    const slider = this.refs.sliders.find(item => item.getAttribute('data-range') === key);

    if (!slider) {
      return;
    }

    this.setSliderControlValue(slider, value);
  }

  updateModalPreview(hex) {
    const preview = this.modalPreviewEl || this.refs.modalPreview;

    if (preview && hex) {
      preview.style.backgroundColor = hex;
    }
  }

  updateModalBars(hct) {
    if (!this.modalBars || !this.modalBars.length || !hct) {
      return;
    }

    const hue = Number(hct.hue);
    const chroma = Number(hct.chroma);
    const tone = Number(hct.tone);
    this.modalBars.forEach(bar => {
      const type = bar.getAttribute('data-tb-slider-bar');

      if (type === 'hue') {
        const angles = [0, 60, 120, 180, 240, 300, 360];
        const colors = angles.map(angle => {
          const argb = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_0__.Hct.from(angle, chroma, tone).toInt();
          return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(argb);
        });
        bar.style.background = `linear-gradient(90deg, ${colors.join(',')})`;
      } else if (type === 'chroma') {
        const stops = [0, 25, 50, 75, 100, 125, 150];
        const colors = stops.map(c => {
          const argb = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_0__.Hct.from(hue, c, tone).toInt();
          return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(argb);
        });
        bar.style.background = `linear-gradient(90deg, ${colors.join(',')})`;
      } else if (type === 'tone') {
        const stops = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const colors = stops.map(t => {
          const argb = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_0__.Hct.from(hue, chroma, t).toInt();
          return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(argb);
        });
        bar.style.background = `linear-gradient(90deg, ${colors.join(',')})`;
      }
    });
  }

  updateModalSliderUI(slider) {
    const control = this.getSliderControl(slider);

    if (!(control instanceof HTMLElement)) {
      return;
    }

    const value = this.getSliderValue(slider);

    if (value === null) {
      return;
    }

    control.setAttribute('data-value', String(value));
    control.dataset.value = String(value);
  }

  prepareModalForPalette(name) {
    this.activePalette = name;
    this.modalMode = name === 'primary' ? 'primary' : 'palette';
    this.setModalTitle(name);
    const hct = this.getPaletteHct(name);

    if (hct) {
      this.pendingHct = hct;

      if (this.modalSliders && this.modalSliders.length) {
        this.setModalSlidersFromHct(hct);
      } else {
        this.syncSlidersFromHct(hct);
      }

      const preview = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getColor)(hct.hue, hct.tone, hct.chroma, false);

      if (preview?.hex) {
        this.updateModalPreview(preview.hex);
      }
    }

    if (this.modalSyncToggle) {
      this.modalSyncToggle.hidden = name !== 'primary';

      if (this.modalSyncWrap) {
        this.modalSyncWrap.style.display = name === 'primary' ? '' : 'none';
      }

      if (window.SF?.Checkbox?.setState) {
        window.SF.Checkbox.setState(this.modalSyncToggle, {
          checked: !!this.state.syncSecondaryWithPrimary
        });
      } else {
        this.modalSyncToggle.checked = !!this.state.syncSecondaryWithPrimary;
        this.modalSyncToggle.dispatchEvent(new Event('change', {
          bubbles: true
        }));
      }
    }
  }

  resetModalState() {
    this.modalMode = null;
    this.activePalette = null;
    this.pendingHct = null;
    this.modalSliders = null;
    this.modalPreviewEl = null;
    this.modalTitleEl = null;
    this.modalAcceptEl = null;
    this.modalCancelEl = null;
  }

  closeModalContainer() {
    let modal = null;
    const modalId = this.modalContainer?.getAttribute?.('data-sf-modal-id');

    if (modalId === `${this.modalId}-palette-modal`) {
      modal = this.paletteModal;
    } else if (modalId === `${this.modalId}-saved-modal`) {
      modal = this.savedThemesModal;
    } else if (this.paletteModal?.isOpen) {
      modal = this.paletteModal;
    } else if (this.savedThemesModal?.isOpen) {
      modal = this.savedThemesModal;
    }

    modal?.close?.();
  }

  applyModalChanges() {
    const hct = this.pendingHct || this.getHctFromModalSliders() || this.getHctFromSliders();

    if (!hct) {
      this.resetModalState();
      return;
    }

    const preview = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getColor)(hct.hue, hct.tone, hct.chroma, false);
    const hex = preview?.hex;

    if (!hex || !this.activePalette) {
      this.resetModalState();
      return;
    }

    if (this.activePalette === 'primary') {
      if (this.state.syncSecondaryWithPrimary) {
        const overrides = { ...(this.state.paletteOverrides || {})
        };
        Object.keys(overrides).forEach(key => {
          if (BASE_ROLES.includes(key) && key !== 'primary') {
            delete overrides[key];
          }
        });
        this.updateState({
          paletteOverrides: overrides
        });
        this.persistState();
      }

      this.syncHexInput(hex);
      this.syncSlidersFromHct(hct);
      this.updatePaletteSwatch('primary', hex);
      this.updateTonalGroupFromOverride('primary', {
        hue: hct.hue,
        chroma: hct.chroma,
        tone: hct.tone,
        hex
      });
      this.generateFromHex(hex).then(theme => {
        if (this.state.syncSecondaryWithPrimary) {
          const overrides = this.state.paletteOverrides || {};
          Object.entries(theme?.palettes || {}).forEach(([name, palette]) => {
            if (overrides[name]) {
              return;
            }

            if (palette?.tone) {
              const swatchHex = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(palette.tone(40));
              this.updatePaletteSwatch(name, swatchHex);
              this.updateTonalGroup(name, palette);
            }
          });

          if (this.state.secondaryPalettes) {
            this.updateSecondaryPalettes(this.state.secondaryPalettes);
          }
        }
      });
    } else {
      this.setPaletteOverride(this.activePalette, {
        hue: hct.hue,
        chroma: hct.chroma,
        tone: hct.tone,
        hex
      });
      this.updatePaletteSwatch(this.activePalette, hex);
      this.updateTonalGroupFromOverride(this.activePalette, {
        hue: hct.hue,
        chroma: hct.chroma,
        tone: hct.tone,
        hex
      });
    }

    this.resetModalState();
  }

  setPaletteOverride(name, payload) {
    const overrides = { ...this.state.paletteOverrides,
      [name]: payload
    };
    this.updateState({
      paletteOverrides: overrides
    });
    this.persistState();
  }

  applyPaletteOverrides() {
    const overrides = this.state.paletteOverrides || {};
    Object.keys(overrides).forEach(name => {
      const override = overrides[name];

      if (override?.hex) {
        this.updatePaletteSwatch(name, override.hex);
        this.updateTonalGroupFromOverride(name, override);
        this.applyOverrideCssVars(name, override);
      }
    });
  }

  updatePaletteSwatch(name, hex) {
    const swatch = this.root.querySelector(`[data-palette="${name}"]`);

    if (swatch && hex) {
      swatch.style.backgroundColor = hex;
    }
  }

  updateTonalGroupFromOverride(name, override) {
    if (!override) {
      return;
    }

    const blocks = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getColorFromTonal)({
      name,
      tonals: DEFAULT_TONE_VALUES,
      hue: override.hue,
      chroma: override.chroma
    });
    const group = this.root.querySelector(`[data-tonal-group="${name}"]`);

    if (!group || !blocks[name]) {
      return;
    }

    const chips = group.querySelectorAll('[data-tonal-value]');
    chips.forEach(chip => {
      const value = chip.getAttribute('data-tonal-value');
      const hex = blocks[name][value];

      if (!hex) {
        return;
      }

      const swatch = chip.querySelector('[data-tonal-swatch]');
      const hexLabel = chip.querySelector('[data-tonal-hex]');

      if (swatch) {
        swatch.style.backgroundColor = hex;
        swatch.style.color = this.getReadableTextColor(hex);
      }

      if (hexLabel) {
        hexLabel.textContent = hex;
      }
    });
  }

  bindModalEvents() {
    this.onModalAfterOpenEvent = event => {
      const modal = event.detail?.modal || null;
      const container = event.target;

      if (!container) {
        return;
      }

      this.modalContainer = container;

      if (modal === this.savedThemesModal) {
        this.updateSavedThemesUI(this.state.activeSavedTheme || '');
        return;
      }

      if (container.id === `${this.modalId}-saved` || container.classList.contains('sf-theme-builder__modal-saved')) {
        this.updateSavedThemesUI(this.state.activeSavedTheme || '');
        return;
      }

      const hasSliders = container.querySelector('.sf-theme-builder__slider') !== null;

      if (!hasSliders) {
        return;
      }

      this.bindModalSliders(container);

      if (this.pendingHct) {
        this.setModalSlidersFromHct(this.pendingHct);
      }

      if (this.modalSliders && this.modalSliders.length) {
        this.modalSliders.forEach(slider => {
          this.updateModalSliderUI(slider);
        });
      }
    };

    this.onModalBeforeCloseEvent = event => {
      const container = event.target;

      if (container) {
        this.unbindModalSliders();
        this.resetModalState();
        this.modalContainer = null;
      }
    };

    document.addEventListener('modal:after-open', this.onModalAfterOpenEvent, true);
    document.addEventListener('modal:before-close', this.onModalBeforeCloseEvent, true);
  }

  unbindModalEvents() {
    if (this.onModalAfterOpenEvent) {
      document.removeEventListener('modal:after-open', this.onModalAfterOpenEvent, true);
    }

    if (this.onModalBeforeCloseEvent) {
      document.removeEventListener('modal:before-close', this.onModalBeforeCloseEvent, true);
    }

    this.unbindModalSliders();
  }

  bindModalSliders(modalRoot) {
    this.unbindModalSliders();
    this.modalSliders = Array.from(modalRoot.querySelectorAll('.sf-theme-builder__slider'));
    this.modalPreviewEl = modalRoot.querySelector('[data-tb-modal-preview]');
    this.modalTitleEl = modalRoot.querySelector('[data-tb-modal-title]');
    this.modalAcceptEl = modalRoot.querySelector('[data-tb-modal-accept]');
    this.modalCancelEl = modalRoot.querySelector('[data-tb-modal-cancel]');
    this.modalBars = Array.from(modalRoot.querySelectorAll('[data-tb-slider-bar]'));
    this.modalSyncToggle = modalRoot.querySelector('[data-tb-sync-secondary]');
    this.modalSyncWrap = modalRoot.querySelector('[data-tb-sync-secondary-wrap]');

    if (this.modalSyncToggle) {
      if (window.SF?.Checkbox?.setState) {
        window.SF.Checkbox.setState(this.modalSyncToggle, {
          checked: !!this.state.syncSecondaryWithPrimary
        });
      } else {
        this.modalSyncToggle.checked = !!this.state.syncSecondaryWithPrimary;
        this.modalSyncToggle.dispatchEvent(new Event('change', {
          bubbles: true
        }));
      }

      this.modalSyncToggle.hidden = this.activePalette !== 'primary';

      if (this.modalSyncWrap) {
        this.modalSyncWrap.style.display = this.activePalette === 'primary' ? '' : 'none';
      }

      this.onSyncToggleChange = event => {
        const checked = !!event.target.checked;
        this.updateState({
          syncSecondaryWithPrimary: checked
        });
        this.persistState();
      };

      this.modalSyncToggle.addEventListener('change', this.onSyncToggleChange);
    }

    if (this.modalAcceptEl) {
      this.onModalAccept = () => {
        this.applyModalChanges();
        this.closeModalContainer();
      };

      this.modalAcceptEl.addEventListener('click', this.onModalAccept);
    }

    if (this.modalCancelEl) {
      this.onModalCancel = () => {
        this.closeModalContainer();
        this.resetModalState();
      };

      this.modalCancelEl.addEventListener('click', this.onModalCancel);
    }

    if (this.activePalette) {
      this.setModalTitle(this.activePalette);
    }

    this.onModalSliderInput = event => {
      const slider = event?.target?.closest ? event.target.closest('.sf-range-slider') : null;

      if (slider) {
        this.updateModalSliderUI(slider.closest('.sf-theme-builder__slider'));
      }

      const hct = this.getHctFromModalSliders();

      if (hct) {
        this.pendingHct = hct;
        const preview = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getColor)(hct.hue, hct.tone, hct.chroma, false);

        if (preview?.hex) {
          this.updateModalPreview(preview.hex);
        }

        this.updateModalBars(hct);
      }
    };

    if (this.modalBars && this.modalBars.length) {
      const initHct = this.getHctFromModalSliders();

      if (initHct) {
        this.updateModalBars(initHct);
      }
    }

    this.modalSliders.forEach(slider => {
      const control = this.getSliderControl(slider);
      control?.addEventListener('sf-range-slider-update', this.onModalSliderInput);
      control?.addEventListener('sf-range-slider-change', this.onModalSliderInput);
      this.updateModalSliderUI(slider);
    });
  }

  unbindModalSliders() {
    if (this.modalSliders && this.modalSliders.length && this.onModalSliderInput) {
      this.modalSliders.forEach(slider => {
        const control = this.getSliderControl(slider);
        control?.removeEventListener('sf-range-slider-update', this.onModalSliderInput);
        control?.removeEventListener('sf-range-slider-change', this.onModalSliderInput);
      });
    }

    if (this.modalAcceptEl && this.onModalAccept) {
      this.modalAcceptEl.removeEventListener('click', this.onModalAccept);
    }

    if (this.modalCancelEl && this.onModalCancel) {
      this.modalCancelEl.removeEventListener('click', this.onModalCancel);
    }

    if (this.modalSyncToggle && this.onSyncToggleChange) {
      this.modalSyncToggle.removeEventListener('change', this.onSyncToggleChange);
    }

    this.modalSliders = null;
    this.modalPreviewEl = null;
    this.modalTitleEl = null;
    this.modalAcceptEl = null;
    this.modalCancelEl = null;
    this.modalBars = null;
    this.modalSyncToggle = null;
    this.modalSyncWrap = null;
  }

  getHctFromModalSliders() {
    if (!this.modalSliders || !this.modalSliders.length) {
      return null;
    }

    const values = {};
    this.modalSliders.forEach(slider => {
      const key = slider.getAttribute('data-range');
      const value = this.getSliderValue(slider);

      if (key && value !== null) {
        values[key] = value;
      }
    });

    if (typeof values.hue === 'number' && typeof values.chroma === 'number' && typeof values.tone === 'number') {
      return {
        hue: values.hue,
        chroma: values.chroma,
        tone: values.tone
      };
    }

    return null;
  }

  setModalSlidersFromHct({
    hue,
    chroma,
    tone
  }) {
    if (!this.modalSliders || !this.modalSliders.length) {
      return;
    }

    this.modalSliders.forEach(slider => {
      const key = slider.getAttribute('data-range');
      const nextValue = key === 'hue' ? hue : key === 'chroma' ? chroma : tone;
      this.setSliderControlValue(slider, nextValue);
      this.updateModalSliderUI(slider);
    });
    this.updateModalBars({
      hue,
      chroma,
      tone
    });
  }

  setModalTitle(text) {
    const title = this.modalTitleEl || this.refs.modalTitle;

    if (title) {
      title.textContent = this.capitalizeFirstLetter(text);
    }
  }

  capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  getPaletteHct(name) {
    const override = this.state.paletteOverrides[name];

    if (override) {
      return {
        hue: override.hue,
        chroma: override.chroma,
        tone: override.tone
      };
    }

    if (name === 'primary') {
      const baseHex = this.refs.hexInput?.value;

      if (baseHex && this.isValidHex(baseHex)) {
        try {
          const argb = (0,_utils_colors__WEBPACK_IMPORTED_MODULE_2__.hex2argb)(baseHex.replace('#', ''));
          const hct = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(argb);
          return {
            hue: Math.round(hct.internalHue),
            chroma: Math.round(hct.internalChroma),
            tone: Math.round(hct.internalTone)
          };
        } catch (err) {
          console.warn(err);
          return null;
        }
      }

      return this.getHctFromSliders();
    }

    const secondaryPalette = this.state.secondaryPalettes?.[name];

    if (secondaryPalette?.keyColor) {
      return {
        hue: Math.round(secondaryPalette.keyColor.iHue),
        chroma: Math.round(secondaryPalette.keyColor.iChroma),
        tone: Math.round(secondaryPalette.keyColor.iTone)
      };
    }

    const palette = this.state.theme?.palettes?.[name];

    if (palette?.keyColor) {
      return {
        hue: Math.round(palette.keyColor.iHue),
        chroma: Math.round(palette.keyColor.iChroma),
        tone: Math.round(palette.keyColor.iTone)
      };
    }

    return this.getHctFromSliders();
  }

  updateThemePreview(theme) {
    if (!theme || !theme.palettes) {
      return;
    }

    if (Number.isFinite(theme.main)) {
      const mainHex = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(theme.main);
      this.updatePreviewSwatch(mainHex);
      this.syncPickerFromHex(mainHex);
    }

    this.updatePaletteList(theme.palettes, theme.main);
    this.updateTonalGroup('primary', theme.palettes.primary);
    this.updateTonalGroup('secondary', theme.palettes.secondary);
    this.updateTonalGroup('tertiary', theme.palettes.tertiary);
    this.updateTonalGroup('neutral', theme.palettes.neutral);
    this.updateTonalGroup('error', theme.palettes.error);
    this.updateTonalGroup('success', theme.palettes.success);
    this.updateTonalGroup('info', theme.palettes.info);
    this.updateTonalGroup('warning', theme.palettes.warning);

    if (this.state.secondaryPalettes) {
      this.updateSecondaryPalettes(this.state.secondaryPalettes);
    }

    if (typeof this.applyPaletteOverrides === 'function') {
      this.applyPaletteOverrides();
    }
  }

  commitAddColor() {
    const raw = this.refs.addInput ? this.refs.addInput.value : '';
    const name = raw.trim();

    if (!name) {
      this.cancelAddColor();
      return;
    }

    this.addSecondaryColor(name);
    this.cancelAddColor();
  }

  cancelAddColor() {
    if (this.refs.addItem) {
      this.refs.addItem.classList.remove('is-editing');
    }

    if (this.refs.addInputWrap) {
      this.refs.addInputWrap.classList.add('hidden');
    }

    if (this.refs.addLabel) {
      this.refs.addLabel.classList.remove('hidden');
    }

    if (this.refs.addToggle) {
      const addIcon = this.refs.addToggle.querySelector('.sf-icon');

      if (addIcon) {
        addIcon.textContent = 'add';
      }
    }

    if (this.refs.addLabel) {
      this.refs.addLabel.textContent = 'Add';
    }

    if (this.refs.addInput) {
      this.refs.addInput.value = '';
    }
  }

  addSecondaryColor(name) {
    const nextNames = [...(this.state.secondaryNames || [])];

    if (nextNames.includes(name)) {
      return;
    }

    nextNames.push(name);
    this.setSecondaryNames(nextNames);

    if (!this.state.secondaryColors[name]) {
      this.updateSecondaryColor(name, (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.generateRandomColor)());
    }

    this.ensureSecondaryPaletteItem(name);
    this.ensureSecondaryTonalGroup(name);
    this.buildSecondaryPalettes().then(palettes => {
      this.updateSecondaryPalettes(palettes);
    });
  }

  ensureSecondaryPaletteItem(name) {
    if (!this.refs.paletteList) {
      return;
    }

    const existing = this.refs.paletteList.querySelector(`[data-tb-palette-item="${name}"]`);

    if (existing) {
      return;
    }

    const item = document.createElement('div');
    const basePadding = this.options.drawer ? 'p-1' : 'p-3';
    const gapClass = this.options.drawer ? 'gap-1' : 'gap-3';
    item.className = `sf-theme-builder__palette-item grid items-cross-center ${gapClass} bg-surface-container ${basePadding} relative`;
    item.setAttribute('data-tb-palette-item', name);
    const swatch = document.createElement('button');
    const swatchSize = this.options.drawer ? '1/2' : '3';
    swatch.className = `sf-theme-builder__palette-swatch sf-icon-button sf-icon-button--size-${swatchSize} sf-icon-button--default sf-icon-button--on-surface bg-primary cursor-pointer`;
    swatch.setAttribute('data-palette', name);
    swatch.setAttribute('data-tb-open-modal', name);
    swatch.setAttribute('data-sf-modal-open', `${this.modalId}-palette-modal`);
    swatch.type = 'button';
    const label = document.createElement('div');
    label.className = `sf-theme-builder__palette-label ${this.options.drawer ? 'sf-text-1/2' : 'sf-text-1'} weight-6`;
    label.textContent = name;
    item.appendChild(swatch);
    item.appendChild(label);

    if (!BASE_ROLES.includes(name)) {
      const actions = document.createElement('div');
      actions.className = 'sf-theme-builder__palette-actions absolute inline-flex items-cross-center inline-end-0 m-0 content-main-end';
      actions.setAttribute('data-tb-palette-actions', name);
      const toggle = document.createElement('button');
      const icon = document.createElement('span');
      icon.className = 'sf-icon';
      icon.textContent = 'more_vert';
      toggle.appendChild(icon);
      toggle.className = 'sf-icon-button sf-icon-button--size-1 sf-icon-button--link sf-icon-button--on-surface';
      toggle.type = 'button';
      toggle.setAttribute('data-tb-palette-menu-toggle', '');
      toggle.setAttribute('aria-label', 'Actions');
      const menu = document.createElement('div');
      menu.className = 'sf-theme-builder__palette-menu bg-surface-overlay absolute hidden';

      if (this.options.drawer) {
        const position = getPaletteMenuPosition(getComputedStyle(this.root).direction);
        menu.style.left = position.left;
        menu.style.right = position.right;
        menu.style.insetInlineStart = position.insetInlineStart;
        menu.style.insetInlineEnd = position.insetInlineEnd;
      }

      menu.setAttribute('data-tb-palette-menu', '');
      const renameBtn = this.createButton({
        variant: 'link',
        scheme: 'on-surface',
        size: '1/2',
        text: 'Rename'
      });
      renameBtn.classList.add('text-left', 'text-small');
      renameBtn.setAttribute('data-tb-palette-rename', '');
      const deleteBtn = this.createButton({
        variant: 'link',
        scheme: 'on-surface',
        size: '1/2',
        text: 'Delete'
      });
      deleteBtn.classList.add('text-left', 'text-small');
      deleteBtn.setAttribute('data-tb-palette-delete', '');
      menu.appendChild(renameBtn);
      menu.appendChild(deleteBtn);
      actions.appendChild(toggle);
      actions.appendChild(menu);
      item.appendChild(actions);
      this.attachPaletteMenu(item, name);
    }

    if (this.refs.addItem) {
      this.refs.paletteList.insertBefore(item, this.refs.addItem);
    } else {
      this.refs.paletteList.appendChild(item);
    }

    if (this.onModalOpen) {
      swatch.addEventListener('click', this.onModalOpen);
    }
  }

  ensureSecondaryTonalGroup(name) {
    if (!this.refs.tonals) {
      return;
    }

    const existing = this.refs.tonals.querySelector(`[data-tonal-group="${name}"]`);

    if (existing) {
      return;
    }

    const group = document.createElement('div');
    group.className = 'sf-theme-builder__tonal-group';
    group.setAttribute('data-tonal-group', name);
    const title = document.createElement('div');
    title.className = 'sf-theme-builder__tonal-title text-small weight-7 m-bottom-2';
    title.textContent = name;
    const grid = document.createElement('div');
    grid.className = `sf-theme-builder__tonal-grid grid ${this.options.drawer ? 'gap-1' : 'gap-2'}`;
    grid.innerHTML = DEFAULT_TONE_VALUES.map(value => this.getTonalChip(value)).join('');
    group.appendChild(title);
    group.appendChild(grid);
    this.refs.tonals.appendChild(group);
  }

  updateSecondaryPalettes(palettes) {
    if (!palettes) {
      return;
    }

    Object.entries(palettes).forEach(([name, palette]) => {
      this.ensureSecondaryPaletteItem(name);
      this.ensureSecondaryTonalGroup(name);

      if (palette?.tone) {
        const swatchHex = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(palette.tone(40));
        this.updatePaletteSwatch(name, swatchHex);
        this.updateTonalGroup(name, palette);
      }
    });
  }

  attachPaletteMenu(item, name) {
    if (!item || BASE_ROLES.includes(name)) {
      return;
    }

    const toggle = item.querySelector('[data-tb-palette-menu-toggle]');
    const menu = item.querySelector('[data-tb-palette-menu]');
    const renameBtn = item.querySelector('[data-tb-palette-rename]');
    const deleteBtn = item.querySelector('[data-tb-palette-delete]');

    const closeMenu = () => {
      if (menu) {
        menu.classList.add('hidden');
      }
    };

    if (toggle && menu) {
      toggle.addEventListener('click', event => {
        event.stopPropagation();
        menu.classList.toggle('hidden');
      });
      document.addEventListener('click', closeMenu, {
        once: false
      });
    }

    if (renameBtn) {
      renameBtn.addEventListener('click', event => {
        event.preventDefault();
        const currentName = item.getAttribute('data-tb-palette-item');
        const nextName = prompt('Rename color', currentName || name);

        if (!nextName || nextName === currentName) {
          closeMenu();
          return;
        }

        this.renameSecondaryColor(currentName, nextName.trim());
        closeMenu();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', event => {
        event.preventDefault();
        const currentName = item.getAttribute('data-tb-palette-item');
        this.removeSecondaryColor(currentName);
        closeMenu();
      });
    }
  }

  removeSecondaryColor(name) {
    if (!name || BASE_ROLES.includes(name)) {
      return;
    }

    const nextNames = (this.state.secondaryNames || []).filter(key => key !== name);
    const nextColors = { ...this.state.secondaryColors
    };
    delete nextColors[name];
    const nextPalettes = { ...this.state.secondaryPalettes
    };
    delete nextPalettes[name];
    const nextOverrides = { ...this.state.paletteOverrides
    };
    delete nextOverrides[name];
    this.updateState({
      secondaryNames: nextNames,
      secondaryColors: nextColors,
      secondaryPalettes: nextPalettes,
      paletteOverrides: nextOverrides
    });
    this.persistState();
    const paletteNode = this.refs.paletteList?.querySelector(`[data-tb-palette-item="${name}"]`);

    if (paletteNode) {
      paletteNode.remove();
    }

    const tonalNode = this.refs.tonals?.querySelector(`[data-tonal-group="${name}"]`);

    if (tonalNode) {
      tonalNode.remove();
    }
  }
  /**
   * Utility to build a framework button with text container.
   * @param {Object} options
   * @param {string} [options.variant='outline'] - visual variant: outline|default|tonal|ghost.
   * @param {string} [options.scheme='primary'] - color scheme: primary|on-surface|secondary|success|warning|info|error.
   * @param {string|number} [options.size=1] - size modifier, e.g. 1,2,3.
   * @param {string} [options.text=''] - text to render inside sf-button-text-container.
   * @param {string[]} [options.extraClasses=[]] - additional classes to append.
   * @returns {HTMLButtonElement}
   */


  createButton({
    variant = 'outline',
    scheme = 'primary',
    size = 1,
    text = '',
    extraClasses = []
  } = {}) {
    const button = document.createElement('button');
    button.type = 'button';
    const classes = ['sf-button', `sf-button--size-${size}`, `sf-button--${variant}`, `sf-button--${scheme}`, ...extraClasses].filter(Boolean);
    button.className = classes.join(' ');
    const textContainer = document.createElement('span');
    textContainer.className = 'sf-button-text-container';
    textContainer.textContent = text;
    button.appendChild(textContainer);
    return button;
  }

  renameSecondaryColor(oldName, newName) {
    if (!oldName || !newName || BASE_ROLES.includes(oldName)) {
      return;
    }

    if (BASE_ROLES.includes(newName)) {
      return;
    }

    const names = this.state.secondaryNames || [];

    if (!names.includes(oldName)) {
      return;
    }

    const filtered = names.filter(n => n !== oldName);
    filtered.push(newName);
    const colors = { ...this.state.secondaryColors
    };
    const palettes = { ...this.state.secondaryPalettes
    };
    const overrides = { ...this.state.paletteOverrides
    };

    if (colors[oldName]) {
      colors[newName] = { ...colors[oldName],
        name: newName
      };
      delete colors[oldName];
    }

    if (palettes[oldName]) {
      palettes[newName] = palettes[oldName];
      delete palettes[oldName];
    }

    if (overrides[oldName]) {
      overrides[newName] = overrides[oldName];
      delete overrides[oldName];
    }

    this.updateState({
      secondaryNames: filtered,
      secondaryColors: colors,
      secondaryPalettes: palettes,
      paletteOverrides: overrides
    });
    this.persistState();
    const paletteNode = this.refs.paletteList?.querySelector(`[data-tb-palette-item="${oldName}"]`);

    if (paletteNode) {
      paletteNode.setAttribute('data-tb-palette-item', newName);
      const swatch = paletteNode.querySelector('[data-palette]');
      const modalBtn = paletteNode.querySelector('[data-tb-open-modal]');
      const label = paletteNode.querySelector('.sf-theme-builder__palette-label');

      if (swatch) {
        swatch.setAttribute('data-palette', newName);
        swatch.setAttribute('data-tb-open-modal', newName);
      }

      if (modalBtn) {
        modalBtn.setAttribute('data-tb-open-modal', newName);
      }

      if (label) {
        label.textContent = newName;
      }

      const actions = paletteNode.querySelector('[data-tb-palette-actions]');

      if (actions) {
        actions.setAttribute('data-tb-palette-actions', newName);
      }

      this.attachPaletteMenu(paletteNode, newName);
    }

    const tonalNode = this.refs.tonals?.querySelector(`[data-tonal-group="${oldName}"]`);

    if (tonalNode) {
      tonalNode.setAttribute('data-tonal-group', newName);
      const title = tonalNode.querySelector('.sf-theme-builder__tonal-title');

      if (title) {
        title.textContent = newName;
      }
    }
  }

  getReadableTextColor(hex) {
    if (!hex) {
      return '#fff';
    }

    const raw = hex.replace('#', '');
    const normalized = raw.length === 3 ? raw.split('').map(ch => ch + ch).join('') : raw;

    if (normalized.length < 6) {
      return '#fff';
    }

    const r = parseInt(normalized.slice(0, 2), 16) / 255;
    const g = parseInt(normalized.slice(2, 4), 16) / 255;
    const b = parseInt(normalized.slice(4, 6), 16) / 255;

    const toLinear = value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

    const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    return luminance > 0.5 ? '#111' : '#fff';
  }

  applyPaletteVariables(theme) {
    const target = document.documentElement;
    const roles = ['primary', 'secondary', 'tertiary', 'neutral', 'error', 'success', 'info', 'warning'];
    const tones = [98, 95, 90, 85, 80, 70, 60, 50, 40, 35, 30, 25, 20, 15, 10, 5];
    const alphaMap = {
      90: [4, 8, 12, 24, 48],
      50: [12, 16, 20, 24, 28, 32, 36, 40, 44],
      10: [4, 8, 12, 24, 48],
      40: [20, 30, 40]
    };
    roles.forEach(role => {
      const palette = theme.palettes?.[role];

      if (!palette || typeof palette.tone !== 'function') {
        return;
      }

      tones.forEach(tone => {
        const hex = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(palette.tone(tone));
        target.style.setProperty(`--sf-${role}-${tone}`, hex);

        if (alphaMap[tone]) {
          alphaMap[tone].forEach(alpha => {
            const alphaHex = this.hexWithAlpha(hex, alpha);
            target.style.setProperty(`--sf-${role}-${tone}--alfa-${alpha}`, alphaHex);
          });
        }
      });
    });
  }

  applyOverrideCssVars(role, override) {
    if (!override || !Number.isFinite(override.hue) || !Number.isFinite(override.chroma)) {
      return;
    }

    const target = document.documentElement;
    const tones = [98, 95, 90, 85, 80, 70, 60, 50, 40, 35, 30, 25, 20, 15, 10, 5];
    const alphaMap = {
      90: [4, 8, 12, 24, 48],
      50: [12, 16, 20, 24, 28, 32, 36, 40, 44],
      10: [4, 8, 12, 24, 48],
      40: [20, 30, 40]
    };
    tones.forEach(tone => {
      const argb = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_0__.Hct.from(override.hue, override.chroma, tone).toInt();
      const hex = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(argb);
      target.style.setProperty(`--sf-${role}-${tone}`, hex);

      if (alphaMap[tone]) {
        alphaMap[tone].forEach(alpha => {
          const alphaHex = this.hexWithAlpha(hex, alpha);
          target.style.setProperty(`--sf-${role}-${tone}--alfa-${alpha}`, alphaHex);
        });
      }
    });
  }

  hexWithAlpha(hex, alphaPercent) {
    if (!hex || !this.isValidHex(hex)) {
      return hex;
    }

    const alpha = Math.round(255 * (alphaPercent / 100));
    const alphaHex = alpha.toString(16).padStart(2, '0');
    return `${hex}${alphaHex}`;
  }

  updatePaletteList(palettes, mainArgb) {
    const keys = ['primary', 'secondary', 'tertiary', 'neutral', 'error', 'success', 'info', 'warning'];
    keys.forEach(key => {
      const palette = palettes[key];
      const swatch = this.root.querySelector(`[data-palette="${key}"]`);

      if (!palette || !swatch) {
        return;
      }

      const override = this.state.paletteOverrides[key];
      let color = null;

      if (key === 'primary' && Number.isFinite(mainArgb)) {
        color = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(mainArgb);
      } else if (override?.hex) {
        color = override.hex;
      } else if (palette.keyColor && palette.keyColor.argb) {
        color = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(palette.keyColor.argb);
      } else if (typeof palette.tone === 'function') {
        color = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(palette.tone(40));
      }

      if (color) {
        swatch.style.backgroundColor = color;
      }
    });
  }

  updateTonalGroup(name, palette) {
    const override = this.state.paletteOverrides[name];

    if (override) {
      this.updateTonalGroupFromOverride(name, override);
      return;
    }

    if (!palette || typeof palette.tone !== 'function') {
      return;
    }

    const group = this.root.querySelector(`[data-tonal-group="${name}"]`);

    if (!group) {
      return;
    }

    const chips = group.querySelectorAll('[data-tonal-value]');
    chips.forEach(chip => {
      const value = Number(chip.getAttribute('data-tonal-value'));

      if (!Number.isFinite(value)) {
        return;
      }

      const swatch = chip.querySelector('[data-tonal-swatch]');
      const hexLabel = chip.querySelector('[data-tonal-hex]');
      const hex = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.hexFromArgb)(palette.tone(value));

      if (swatch) {
        swatch.style.backgroundColor = hex;
        swatch.style.color = this.getReadableTextColor(hex);
      }

      if (hexLabel) {
        hexLabel.textContent = hex;
      }
    });
  }

  initPicker() {
    if (!this.refs.picker || this.picker) {
      return;
    }

    const color = this.refs.hexInput?.value || '#0073ed';
    const picker = new vanilla_picker__WEBPACK_IMPORTED_MODULE_3__["default"]({
      parent: this.refs.picker,
      id: this.refs.picker.id || `${this.modalId}-picker`,
      color,
      alpha: false
    });

    picker.onOpen = () => {
      this.isPickerOpen = true;
    };

    picker.onClose = () => {
      this.isPickerOpen = false;
    };

    picker.onDone = picked => {
      const nextHex = this.normalizeHexValue(picked?.hex);

      if (nextHex) {
        this.syncHexInput(nextHex);
        this.syncSlidersFromHex(nextHex);
        this.generateFromHex(nextHex);
      }
    };

    this.picker = picker;
  }

  destroyPicker() {
    if (this.picker && typeof this.picker.destroy === 'function') {
      this.picker.destroy();
    }

    this.picker = null;
  }

  normalizeHexValue(value) {
    if (!value) {
      return null;
    }

    const normalized = value.startsWith('#') ? value : `#${value}`;

    if (normalized.length === 9) {
      return normalized.slice(0, 7);
    }

    return this.isValidHex(normalized) ? normalized : null;
  }

  syncPickerFromHex(hex) {
    if (!this.picker || !this.isValidHex(hex) || this.isPickerSyncing) {
      return;
    }

    this.isPickerSyncing = true;

    try {
      if (typeof this.picker.setColor === 'function') {
        this.picker.setColor(hex);
      }
    } finally {
      this.isPickerSyncing = false;
    }
  }

  preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleImageFile(file) {
    if (!file) {
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.updateImageMeta(file.name, 'File too large');
      return;
    }

    this.updateImageMeta(file.name, this.formatBytes(file.size));
    this.updateImageProgress(0);

    if (this.refs.dropProgress) {
      this.refs.dropProgress.classList.remove('hidden');
    }

    const reader = new FileReader();

    reader.onprogress = event => {
      if (event.lengthComputable) {
        const percent = Math.round(event.loaded / event.total * 100);
        this.updateImageProgress(percent);
      }
    };

    reader.onload = event => {
      if (this.refs.imagePreview) {
        this.refs.imagePreview.src = event.target.result;

        this.refs.imagePreview.onload = () => {
          if (this.refs.dropzone) {
            this.refs.dropzone.classList.add('has-image');
          }

          this.generateFromImage(this.refs.imagePreview).then(hex => {
            const nextHex = hex ? `#${hex}` : null;

            if (nextHex && this.isValidHex(nextHex)) {
              this.syncHexInput(nextHex);
              this.syncSlidersFromHex(nextHex);
              this.generateFromHex(nextHex);
            }
          });
        };
      }
    };

    reader.readAsDataURL(file);
  }

  updateImageMeta(name, size) {
    if (this.refs.imageName) {
      this.refs.imageName.textContent = name || 'No file selected';
    }

    if (this.refs.imageSize) {
      this.refs.imageSize.textContent = size || '';
    }
  }

  updateImageProgress(percent, options = {}) {
    const safePercent = Number.isFinite(percent) ? percent : 0;

    if (this.refs.dropProgress) {
      this.refs.dropProgress.classList.toggle('hidden', options.hide === true);
    }

    if (this.refs.imageProgress) {
      this.refs.imageProgress.textContent = `${safePercent}%`;
    }

    if (this.refs.imageProgressBar) {
      this.refs.imageProgressBar.style.width = `${safePercent}%`;
    }
  }

  formatBytes(bytes) {
    if (!bytes || Number.isNaN(bytes)) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = index === 0 ? bytes : bytes / 1024 ** index;
    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  }

  setDropzoneDragState(isActive) {
    if (!this.refs.dropzone) {
      return;
    }

    if (isActive) {
      this.refs.dropzone.classList.add('is-dragover');
      this.refs.dropzone.classList.remove('bg-surface-0', 'border-outline-variant');
      this.refs.dropzone.classList.add('bg-primary-container', 'border-primary');
      return;
    }

    this.refs.dropzone.classList.remove('is-dragover', 'bg-primary-container', 'border-primary');
    this.refs.dropzone.classList.add('bg-surface-0', 'border-outline-variant');
  }

  setActiveTab(name) {
    if (!name) {
      return;
    }

    const activeClasses = ['bg-primary-container', 'color-on-primary-container', 'border-outline-variant'];
    const inactiveClasses = ['color-inherit'];
    this.refs.tabs.forEach(tab => {
      const isActive = tab.getAttribute('data-tb-tab') === name;
      tab.classList.toggle('is-active', isActive);

      if (isActive) {
        inactiveClasses.forEach(className => tab.classList.remove(className));
        activeClasses.forEach(className => tab.classList.add(className));
      } else {
        activeClasses.forEach(className => tab.classList.remove(className));
        inactiveClasses.forEach(className => tab.classList.add(className));
      }
    });
    this.refs.panels.forEach(panel => {
      panel.classList.toggle('is-active', panel.getAttribute('data-tb-panel') === name);
      const isPanelActive = panel.getAttribute('data-tb-panel') === name;
      panel.classList.toggle('hidden', !isPanelActive);

      if (isPanelActive) {
        panel.classList.add('flex', 'flex-column', 'gap-3');
      }
    });
  }

  loadStoredHex() {
    if (!this.options.storePrimaryColor) {
      return null;
    }

    const key = this.options.storageKey || STORAGE_KEY;

    try {
      const stored = window.localStorage.getItem(key);

      if (stored && this.isValidHex(stored)) {
        return stored;
      }
    } catch (err) {
      console.warn(err); // Ignore storage access errors (private mode, disabled storage).
    }

    return null;
  }

  storeHex(hex) {
    if (!this.options.storePrimaryColor || !this.isValidHex(hex)) {
      return;
    }

    const key = this.options.storageKey || STORAGE_KEY;

    try {
      window.localStorage.setItem(key, hex.toUpperCase());
    } catch (err) {
      console.warn(err); // Ignore storage access errors (private mode, disabled storage).
    }
  }

  clearStoredHex() {
    const key = this.options.storageKey || STORAGE_KEY;

    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn(err);
    }
  }

  clearStateStorage() {
    try {
      window.localStorage.removeItem(STATE_STORAGE_KEY);
      window.localStorage.removeItem(APPLIED_THEME_KEY);
    } catch (err) {
      console.warn(err);
    }
  }

  loadAppliedHex() {
    try {
      const raw = window.localStorage.getItem(APPLIED_THEME_KEY);

      if (raw && this.isValidHex(raw)) {
        return raw;
      }
    } catch (err) {
      console.warn(err);
    }

    return null;
  }

  storeAppliedHex(hex) {
    try {
      if (this.isValidHex(hex)) {
        window.localStorage.setItem(APPLIED_THEME_KEY, hex.toUpperCase());
        this.hasSavedColors = true;
      }
    } catch (err) {
      console.warn(err);
    }
  }

  dispatch(name, detail) {
    this.root.dispatchEvent(new CustomEvent(name, {
      detail: {
        instance: this,
        ...detail
      }
    }));
  }

  initModals() {
    const registry = window.SF?.Loader?.ComponentRegistry || window.SF?.ComponentRegistry || {};
    const ModalClass = registry.Modal;

    if (!ModalClass) {
      return false;
    }

    if (!this.paletteModal) {
      const title = document.createElement('div');
      title.className = 'sf-theme-builder__modal-title text weight-6';
      title.setAttribute('data-tb-modal-title', '');
      title.textContent = 'Palette';
      const preview = document.createElement('div');
      preview.className = 'sf-theme-builder__modal-preview w-c8 h-c8 bg-primary radius-default';
      preview.setAttribute('data-tb-modal-preview', '');
      this.paletteModal = new ModalClass({
        id: `${this.modalId}-palette-modal`,
        param: {
          mode: 'inline',
          display: 'modal',
          overlay: true,
          closeOnOverlay: true,
          showClose: true,
          headerNodes: [title, preview],
          headerClass: 'sf-theme-builder__modal-header flex items-cross-center content-main-between gap-2',
          html: this.getPaletteModalContent()
        },
        attrs: {}
      });
      this.paletteModal.render?.();
    }

    if (!this.savedThemesModal) {
      const title = document.createElement('div');
      title.className = 'sf-theme-builder__modal-title text-large weight-7';
      title.textContent = 'Saved themes';
      this.savedThemesModal = new ModalClass({
        id: `${this.modalId}-saved-modal`,
        param: {
          mode: 'inline',
          display: 'modal',
          overlay: true,
          closeOnOverlay: true,
          showClose: true,
          headerNodes: [title],
          headerClass: 'sf-theme-builder__modal-header flex items-cross-center content-main-between gap-2',
          html: this.getSavedThemesModalContent()
        },
        attrs: {}
      });
      this.savedThemesModal.render?.();
    }

    return Boolean(this.paletteModal || this.savedThemesModal);
  }

  destroyModals() {
    this.paletteModal?.destroy?.();
    this.savedThemesModal?.destroy?.();
    this.paletteModal = null;
    this.savedThemesModal = null;
    this.modalContainer = null;
  }

  ensureModalService() {
    const selector = '[data-name*="sf-service-bottom-area"]';

    if (document.querySelector(selector)) {
      return;
    }

    const service = document.createElement('div');
    service.setAttribute('data-name', 'sf-service-bottom-area');
    document.body.appendChild(service);
  }

}

function initThemeBuilderNode(node) {
  if (!node || !node.classList || !node.classList.contains(THEME_BUILDER_CLASS)) {
    return null;
  }

  if (node.hasAttribute(INIT_ATTR)) {
    return instanceMap.get(node) || null;
  }

  const options = parseOptions(node);
  const instance = new ThemeBuilder(node, options);
  instanceMap.set(node, instance);
  instanceSet.add(instance);
  return instance;
}

function initThemeBuilder(root) {
  const host = root || document;
  const nodes = host.querySelectorAll(`.${THEME_BUILDER_CLASS}`);
  nodes.forEach(node => initThemeBuilderNode(node));
}

ThemeBuilder.initAll = initThemeBuilder;

ThemeBuilder.getInstance = node => instanceMap.get(node) || null;

ThemeBuilder.destroyAll = () => {
  instanceSet.forEach(inst => {
    if (inst && typeof inst.destroy === 'function') {
      inst.destroy();
    }
  });
  instanceSet.clear();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initThemeBuilder(document));
} else {
  initThemeBuilder(document);
}

document.addEventListener('turbo:load', () => initThemeBuilder(document));
document.addEventListener('turbo:before-cache', () => ThemeBuilder.destroyAll());

/***/ },

/***/ "0789749c5bc2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cam16)
/* harmony export */ });
class Cam16 {
  constructor(hue, chroma, j, q, m, s, jstar, astar, bstar) {
    this.hue = hue;
    this.chroma = chroma;
    this.j = j;
    this.q = q;
    this.m = m;
    this.s = s;
    this.jstar = jstar;
    this.astar = astar;
    this.bstar = bstar;
  }

}

/***/ },

/***/ "789aa2ede179"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImageResult: () => (/* binding */ ImageResult)
/* harmony export */ });
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("710690b9ec6a");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("07d1b93a2bb7");
/* harmony import */ var _smc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0ee1af918537");




function compare(a, b) {
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  }

  return 0;
}

class ImageResult {
  constructor() {}

  static score(colorsToPopulation, options) {
    const {
      desired,
      fallbackColorARGB,
      filter
    } = { ..._utils_constants__WEBPACK_IMPORTED_MODULE_1__.S_O_D,
      ...options
    };
    const colorsHct = [];
    const huePopulation = new Array(360).fill(0);
    let populationSum = 0;

    for (const [argb, population] of colorsToPopulation.entries()) {
      const smc = _smc__WEBPACK_IMPORTED_MODULE_2__.SMC.fromArgb(argb);
      colorsHct.push(smc);
      const hue = Math.floor(smc.iHue);
      huePopulation[hue] += population;
      populationSum += population;
    }

    const hueExcitedProportions = new Array(360).fill(0.0);

    for (let hue = 0; hue < 360; hue++) {
      const proportion = huePopulation[hue] / populationSum;

      for (let i = hue - 14; i < hue + 16; i++) {
        const neighborHue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_0__.sanitizeDegreesInt(i);
        hueExcitedProportions[neighborHue] += proportion;
      }
    }

    const scoredHct = [];

    for (const smc of colorsHct) {
      const hue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_0__.sanitizeDegreesInt(Math.round(smc.iHue));
      const proportion = hueExcitedProportions[hue];

      if (filter && (smc.iChroma < ImageResult.CUTOFF_CHROMA || proportion <= ImageResult.CUTOFF_EXCITED_PROPORTION)) {
        continue;
      }

      const proportionScore = proportion * 100.0 * ImageResult.WEIGHT_PROPORTION;
      const chromaWeight = smc.iChroma < ImageResult.TARGET_CHROMA ? ImageResult.WEIGHT_CHROMA_BELOW : ImageResult.WEIGHT_CHROMA_ABOVE;
      const chromaScore = (smc.iChroma - ImageResult.TARGET_CHROMA) * chromaWeight;
      const score = proportionScore + chromaScore;
      scoredHct.push({
        smc,
        score
      });
    }

    scoredHct.sort(compare);
    const chosenColors = [];

    for (let differenceDegrees = 90; differenceDegrees >= 15; differenceDegrees--) {
      chosenColors.length = 0;

      for (const {
        smc
      } of scoredHct) {
        const duplicateHue = chosenColors.find(chosenHct => {
          return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_0__.differenceDegrees(smc.iHue, chosenHct.iHue) < differenceDegrees;
        });

        if (!duplicateHue) {
          chosenColors.push(smc);
        }

        if (chosenColors.length >= desired) break;
      }

      if (chosenColors.length >= desired) break;
    }

    const colors = [];

    if (chosenColors.length === 0) {
      colors.push(fallbackColorARGB);
    }

    for (const chosenHct of chosenColors) {
      colors.push(chosenHct.argb);
    }

    return colors;
  }

}
ImageResult.TARGET_CHROMA = 48.0; // A1 Chroma

ImageResult.WEIGHT_PROPORTION = 0.7;
ImageResult.WEIGHT_CHROMA_ABOVE = 0.3;
ImageResult.WEIGHT_CHROMA_BELOW = 0.1;
ImageResult.CUTOFF_CHROMA = 5.0;
ImageResult.CUTOFF_EXCITED_PROPORTION = 0.01;

/***/ },

/***/ "86073f4268f3"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorPalette: () => (/* binding */ ColorPalette),
/* harmony export */   Palette: () => (/* binding */ Palette)
/* harmony export */ });
/* harmony import */ var _smc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0ee1af918537");
/* harmony import */ var _tonalPalette__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4d3a1f1d5e72");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ce4c5d18e9c8");



class Palette {
  constructor(props) {
    this.smc = new _smc__WEBPACK_IMPORTED_MODULE_0__.SMC({
      argb: props.argb
    });
    this.colorsTC = {};
    this.types = {
      surface: {
        key: 'surface',
        colors: {
          neutral: {
            '0': {
              light: 100,
              dark: 5
            },
            '1': {
              light: 98,
              dark: 10
            },
            '2': {
              light: 96,
              dark: 15
            },
            '3': {
              light: 90,
              dark: 20
            },
            '4': {
              light: 85,
              dark: 25
            },
            'inverse-fixed': {
              light: 20,
              dark: 20
            },
            'inverse': {
              light: 20,
              dark: 90
            },
            'container': {
              light: 90,
              dark: 30
            },
            'container-hover': {
              light: 85,
              dark: 35
            },
            'container-active': {
              light: 80,
              dark: 40
            },
            'surface': {
              light: 10,
              dark: 90
            },
            'on-surface-fixed': {
              light: 10,
              dark: 10
            },
            'on-surface-hover': {
              light: 15,
              dark: 85
            },
            'on-surface-active': {
              light: 20,
              dark: 80
            },
            'on-surface-variant': {
              light: 40,
              dark: 60
            },
            'on-surface-inverse': {
              light: 90,
              dark: 10
            },
            'on-surface-inverse-fixed': {
              light: 90,
              dark: 90
            },
            'transparent': {
              light: 50,
              dark: 90
            }
          }
        }
      },
      text: {
        key: 'text',
        colors: {
          neutral: {
            'primary': {
              light: 20,
              dark: 90
            },
            'secondary': {
              light: 40,
              dark: 50
            },
            'tertiary': {
              light: 60,
              dark: 70
            },
            'inverse': {
              light: 96,
              dark: 6
            }
          }
        }
      },
      primary: {
        key: 'primary',
        colors: {
          primary: {
            'default': {
              light: 40,
              dark: 80
            },
            'hover': {
              light: 35,
              dark: 80
            },
            'active': {
              light: 30,
              dark: 90
            },
            'container': {
              light: 90,
              dark: 30
            },
            'container-hover': {
              light: 85,
              dark: 35
            },
            'container-active': {
              light: 80,
              dark: 40
            },
            'transparent': {
              light: 50,
              dark: 90
            },
            'on-primary': {
              light: 100,
              dark: 20
            },
            'on-primary-container': {
              light: 10,
              dark: 90
            },
            'on-primary-container-graphic': {
              light: 50,
              dark: 60
            },
            'outline-primary': {
              light: 50,
              dark: 60
            }
          }
        }
      },
      secondary: {
        key: 'secondary',
        colors: {
          secondary: {
            'default': {
              light: 40,
              dark: 80
            },
            'hover': {
              light: 35,
              dark: 85
            },
            'active': {
              light: 30,
              dark: 90
            },
            'container': {
              light: 90,
              dark: 30
            },
            'container-hover': {
              light: 85,
              dark: 35
            },
            'container-active': {
              light: 80,
              dark: 40
            },
            'transparent': {
              light: 50,
              dark: 90
            },
            'on-secondary': {
              light: 100,
              dark: 20
            },
            'on-secondary-container': {
              light: 10,
              dark: 90
            },
            'on-secondary-container-graphic': {
              light: 50,
              dark: 60
            },
            'outline-secondary': {
              light: 50,
              dark: 60
            }
          }
        }
      },
      tertiary: {
        key: 'tertiary',
        colors: {
          tertiary: {
            'default': {
              light: 40,
              dark: 80
            },
            'hover': {
              light: 35,
              dark: 85
            },
            'active': {
              light: 30,
              dark: 90
            },
            'container': {
              light: 90,
              dark: 30
            },
            'container-hover': {
              light: 85,
              dark: 35
            },
            'container-active': {
              light: 80,
              dark: 40
            },
            'transparent': {
              light: 50,
              dark: 90
            },
            'on-tertiary': {
              light: 100,
              dark: 20
            },
            'on-tertiary-container': {
              light: 10,
              dark: 90
            },
            'on-tertiary-container-graphic': {
              light: 50,
              dark: 60
            },
            'outline-tertiary': {
              light: 50,
              dark: 60
            }
          }
        }
      },
      outlines: {
        key: 'outline',
        colors: {
          neutral: {
            'default': {
              light: 50,
              dark: 60
            },
            'variant': {
              light: 50,
              dark: 90
            }
          }
        }
      },
      link: {
        key: 'link',
        colors: {
          primary: {
            default: {
              light: 40,
              dark: 80
            },
            hover: {
              light: 35,
              dark: 85
            },
            active: {
              light: 30,
              dark: 90
            },
            visited: {
              light: 40,
              dark: 80
            }
          }
        }
      },
      info: {
        key: 'info',
        colors: {
          info: {
            default: {
              light: 40,
              dark: 50
            },
            primary: {
              light: 50,
              dark: 80
            },
            inverse: {
              light: 98,
              dark: 6
            },
            tonal: {
              light: 90,
              dark: 30
            },
            text: {
              light: 20,
              dark: 90
            }
          }
        }
      },
      success: {
        key: 'success',
        colors: {
          success: {
            default: {
              light: 40,
              dark: 50
            },
            primary: {
              light: 50,
              dark: 80
            },
            inverse: {
              light: 98,
              dark: 6
            },
            tonal: {
              light: 90,
              dark: 30
            },
            text: {
              light: 20,
              dark: 90
            }
          }
        }
      },
      warning: {
        key: 'warning',
        colors: {
          warning: {
            'default': {
              light: 40,
              dark: 80
            },
            'hover': {
              light: 35,
              dark: 85
            },
            'active': {
              light: 30,
              dark: 90
            },
            'container': {
              light: 90,
              dark: 30
            },
            'container-hover': {
              light: 85,
              dark: 35
            },
            'container-active': {
              light: 80,
              dark: 40
            },
            'transparent': {
              light: 50,
              dark: 90
            },
            'on-warning': {
              light: 100,
              dark: 20
            },
            'on-warning-container': {
              light: 10,
              dark: 90
            },
            'on-warning-container-graphic': {
              light: 50,
              dark: 60
            },
            'outline-warning': {
              light: 50,
              dark: 60
            }
          }
        }
      },
      error: {
        key: 'error',
        colors: {
          error: {
            'default': {
              light: 40,
              dark: 80
            },
            'hover': {
              light: 35,
              dark: 85
            },
            'active': {
              light: 30,
              dark: 90
            },
            'container': {
              light: 90,
              dark: 30
            },
            'container-hover': {
              light: 85,
              dark: 35
            },
            'container-active': {
              light: 80,
              dark: 40
            },
            'transparent': {
              light: 50,
              dark: 90
            },
            'on-error': {
              light: 100,
              dark: 20
            },
            'on-error-container': {
              light: 10,
              dark: 90
            },
            'on-error-container-graphic': {
              light: 50,
              dark: 60
            },
            'outline-error': {
              light: 50,
              dark: 60
            }
          }
        }
      }
    };
    this.defaultTypes = {
      neutral: {
        0: {
          tone: 100,
          chroma: 0
        },
        1: {
          tone: 98,
          chroma: 4
        },
        2: {
          tone: 96,
          chroma: 4
        },
        3: {
          tone: 94,
          chroma: 5
        },
        4: {
          tone: 92,
          chroma: 6
        },
        5: {
          tone: 90,
          chroma: 6
        },
        6: {
          tone: 87,
          chroma: 8
        },
        7: {
          tone: 80,
          chroma: 8
        },
        8: {
          tone: 70,
          chroma: 8
        },
        9: {
          tone: 60,
          chroma: 8
        },
        10: {
          tone: 50,
          chroma: 8
        },
        11: {
          tone: 40,
          chroma: 8
        },
        12: {
          tone: 30,
          chroma: 8
        },
        13: {
          tone: 22,
          chroma: 8
        },
        14: {
          tone: 20,
          chroma: 8
        },
        15: {
          tone: 18,
          chroma: 8
        },
        16: {
          tone: 14,
          chroma: 8
        },
        17: {
          tone: 10,
          chroma: 8
        },
        18: {
          tone: 6,
          chroma: 8
        },
        19: {
          tone: 0,
          chroma: 0
        }
      },
      primary: {
        0: {
          tone: 100,
          chroma: 0
        },
        1: {
          tone: 98,
          chroma: 5
        },
        2: {
          tone: 96,
          chroma: 9
        },
        3: {
          tone: 94,
          chroma: 12
        },
        4: {
          tone: 92,
          chroma: 15
        },
        5: {
          tone: 90,
          chroma: 20
        },
        6: {
          tone: 87,
          chroma: 25
        },
        7: {
          tone: 80,
          chroma: 36
        },
        8: {
          tone: 70,
          chroma: 40
        },
        9: {
          tone: 60,
          chroma: 50
        },
        10: {
          tone: 50,
          chroma: 55
        },
        11: {
          tone: 40,
          chroma: 54
        },
        12: {
          tone: 30,
          chroma: 46
        },
        13: {
          tone: 22,
          chroma: 39
        },
        14: {
          tone: 20,
          chroma: 37
        },
        15: {
          tone: 18,
          chroma: 33
        },
        16: {
          tone: 14,
          chroma: 29
        },
        17: {
          tone: 10,
          chroma: 28
        },
        18: {
          tone: 6,
          chroma: 24
        },
        19: {
          tone: 0,
          chroma: 0
        }
      },
      secondary: {
        0: {
          tone: 100,
          chroma: 0
        },
        1: {
          tone: 98,
          chroma: 6
        },
        2: {
          tone: 96,
          chroma: 6
        },
        3: {
          tone: 94,
          chroma: 8
        },
        4: {
          tone: 92,
          chroma: 10
        },
        5: {
          tone: 90,
          chroma: 15
        },
        6: {
          tone: 87,
          chroma: 20
        },
        7: {
          tone: 80,
          chroma: 20
        },
        8: {
          tone: 70,
          chroma: 20
        },
        9: {
          tone: 60,
          chroma: 20
        },
        10: {
          tone: 50,
          chroma: 20
        },
        11: {
          tone: 40,
          chroma: 20
        },
        12: {
          tone: 30,
          chroma: 20
        },
        13: {
          tone: 22,
          chroma: 20
        },
        14: {
          tone: 20,
          chroma: 20
        },
        15: {
          tone: 18,
          chroma: 20
        },
        16: {
          tone: 14,
          chroma: 20
        },
        17: {
          tone: 10,
          chroma: 20
        },
        18: {
          tone: 6,
          chroma: 20
        },
        19: {
          tone: 0,
          chroma: 0
        }
      },
      tertiary: {
        0: {
          tone: 100,
          chroma: 0
        },
        1: {
          tone: 98,
          chroma: 6
        },
        2: {
          tone: 96,
          chroma: 6
        },
        3: {
          tone: 94,
          chroma: 8
        },
        4: {
          tone: 92,
          chroma: 10
        },
        5: {
          tone: 90,
          chroma: 15
        },
        6: {
          tone: 87,
          chroma: 20
        },
        7: {
          tone: 80,
          chroma: 20
        },
        8: {
          tone: 70,
          chroma: 20
        },
        9: {
          tone: 60,
          chroma: 20
        },
        10: {
          tone: 50,
          chroma: 20
        },
        11: {
          tone: 40,
          chroma: 20
        },
        12: {
          tone: 30,
          chroma: 20
        },
        13: {
          tone: 22,
          chroma: 20
        },
        14: {
          tone: 20,
          chroma: 20
        },
        15: {
          tone: 18,
          chroma: 20
        },
        16: {
          tone: 14,
          chroma: 20
        },
        17: {
          tone: 10,
          chroma: 20
        },
        18: {
          tone: 6,
          chroma: 20
        },
        19: {
          tone: 0,
          chroma: 0
        }
      },
      success: {
        0: {
          tone: 100,
          chroma: 0
        },
        1: {
          tone: 98,
          chroma: 6
        },
        2: {
          tone: 96,
          chroma: 6
        },
        3: {
          tone: 94,
          chroma: 8
        },
        4: {
          tone: 92,
          chroma: 10
        },
        5: {
          tone: 90,
          chroma: 15
        },
        6: {
          tone: 87,
          chroma: 20
        },
        7: {
          tone: 80,
          chroma: 20
        },
        8: {
          tone: 70,
          chroma: 20
        },
        9: {
          tone: 60,
          chroma: 20
        },
        10: {
          tone: 50,
          chroma: 20
        },
        11: {
          tone: 40,
          chroma: 20
        },
        12: {
          tone: 30,
          chroma: 20
        },
        13: {
          tone: 22,
          chroma: 20
        },
        14: {
          tone: 20,
          chroma: 20
        },
        15: {
          tone: 18,
          chroma: 20
        },
        16: {
          tone: 14,
          chroma: 20
        },
        17: {
          tone: 10,
          chroma: 20
        },
        18: {
          tone: 6,
          chroma: 20
        },
        19: {
          tone: 0,
          chroma: 0
        }
      },
      warning: {
        0: {
          tone: 100,
          chroma: 0
        },
        1: {
          tone: 98,
          chroma: 6
        },
        2: {
          tone: 96,
          chroma: 6
        },
        3: {
          tone: 94,
          chroma: 8
        },
        4: {
          tone: 92,
          chroma: 10
        },
        5: {
          tone: 90,
          chroma: 15
        },
        6: {
          tone: 87,
          chroma: 20
        },
        7: {
          tone: 80,
          chroma: 20
        },
        8: {
          tone: 70,
          chroma: 20
        },
        9: {
          tone: 60,
          chroma: 20
        },
        10: {
          tone: 50,
          chroma: 20
        },
        11: {
          tone: 40,
          chroma: 20
        },
        12: {
          tone: 30,
          chroma: 20
        },
        13: {
          tone: 22,
          chroma: 20
        },
        14: {
          tone: 20,
          chroma: 20
        },
        15: {
          tone: 18,
          chroma: 20
        },
        16: {
          tone: 14,
          chroma: 20
        },
        17: {
          tone: 10,
          chroma: 20
        },
        18: {
          tone: 6,
          chroma: 20
        },
        19: {
          tone: 0,
          chroma: 0
        }
      },
      info: {
        0: {
          tone: 100,
          chroma: 0
        },
        1: {
          tone: 98,
          chroma: 6
        },
        2: {
          tone: 96,
          chroma: 6
        },
        3: {
          tone: 94,
          chroma: 8
        },
        4: {
          tone: 92,
          chroma: 10
        },
        5: {
          tone: 90,
          chroma: 15
        },
        6: {
          tone: 87,
          chroma: 20
        },
        7: {
          tone: 80,
          chroma: 20
        },
        8: {
          tone: 70,
          chroma: 20
        },
        9: {
          tone: 60,
          chroma: 20
        },
        10: {
          tone: 50,
          chroma: 20
        },
        11: {
          tone: 40,
          chroma: 20
        },
        12: {
          tone: 30,
          chroma: 20
        },
        13: {
          tone: 22,
          chroma: 20
        },
        14: {
          tone: 20,
          chroma: 20
        },
        15: {
          tone: 18,
          chroma: 20
        },
        16: {
          tone: 14,
          chroma: 20
        },
        17: {
          tone: 10,
          chroma: 20
        },
        18: {
          tone: 6,
          chroma: 20
        },
        19: {
          tone: 0,
          chroma: 0
        }
      },
      error: {
        0: {
          tone: 100,
          chroma: 0
        },
        1: {
          tone: 98,
          chroma: 6
        },
        2: {
          tone: 96,
          chroma: 6
        },
        3: {
          tone: 94,
          chroma: 8
        },
        4: {
          tone: 92,
          chroma: 10
        },
        5: {
          tone: 90,
          chroma: 15
        },
        6: {
          tone: 87,
          chroma: 20
        },
        7: {
          tone: 80,
          chroma: 20
        },
        8: {
          tone: 70,
          chroma: 20
        },
        9: {
          tone: 60,
          chroma: 20
        },
        10: {
          tone: 50,
          chroma: 20
        },
        11: {
          tone: 40,
          chroma: 20
        },
        12: {
          tone: 30,
          chroma: 20
        },
        13: {
          tone: 22,
          chroma: 20
        },
        14: {
          tone: 20,
          chroma: 20
        },
        15: {
          tone: 18,
          chroma: 20
        },
        16: {
          tone: 14,
          chroma: 20
        },
        17: {
          tone: 10,
          chroma: 20
        },
        18: {
          tone: 6,
          chroma: 20
        },
        19: {
          tone: 0,
          chroma: 0
        }
      }
    };
    this.hue = this.smc.iHue;
    this.chroma = props.c ? props.c : this.smc.iChroma;
    this.tone = props.t ? props.t : this.smc.iTone;

    if (props.image) {
      this.main1 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, this.chroma);
      this.main2 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, this.chroma / 3);
      this.main3 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue + 60, this.chroma / 2);
      this.secondary1 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, Math.min(this.chroma / 12, 4));
      this.secondary2 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, Math.min(this.chroma / 6, 8));
    } else {
      this.main1 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, Math.max(48, this.chroma));
      this.main2 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, 16);
      this.main3 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue + 60, 24);
      this.secondary1 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, 4);
      this.secondary2 = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, 8);
    }

    this.error = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(25, Math.max(85, this.chroma));
    this.success = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(145, Math.max(65, this.chroma));
    this.info = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(255, this.chroma);
    this.secondaryColors = {};
    this.warning = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(80, this.chroma);
    this.newColors = {
      primary: _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, Math.max(55, this.chroma)),
      secondary: _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, Math.max(20, this.chroma))
    };
    this.primaryColorHex = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(_smc__WEBPACK_IMPORTED_MODULE_0__.SMC.solveToInt(this.newColors.primary.keyColor.iHue, this.newColors.primary.keyColor.iChroma, this.newColors.primary.keyColor.iTone));
    this.tertiary = this.hexToHSL(this.primaryColorHex);
    this.complement = this.harmonize(this.tertiary, 180, 180, 1); // Это нужный комплиментарный цвет 100%

    this.complementHex = this.hslToHex(this.complement[1][0], this.complement[1][1], this.complement[1][2]);
    this.normalHex = this.hslToHex(this.complement[0][0], this.complement[0][1], this.complement[0][2]);
    this.complementColors = {
      normal: this.normalHex,
      complement: this.complementHex,
      argbComplement: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.makeArgb)(this.complementHex)
    };
    this.complementSMC = new _smc__WEBPACK_IMPORTED_MODULE_0__.SMC({
      argb: this.complementColors.argbComplement
    });
    this.newColors.tertiary = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.complementSMC.iHue, Math.max(20, this.complementSMC.iChroma));
    this.mainFullTC = this.makeColorTC();
    this.makeHigherAndLower();

    if (props.name) {
      this.secondaryColors[props.name] = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.hue, this.chroma);
    }
  }

  makeSecondary = colors => {
    if (colors && Object.keys(colors).length) {
      Object.keys(colors).map(key => {
        this.secondaryColors[key] = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(25, this.chroma);
      });
    }
  };

  hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;

    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };

    return `#${f(0)}${f(8)}${f(4)}`;
  }

  parseHSL(str) {
    let hsl, h, s, l;
    hsl = str.replace(/[^\d,]/g, '').split(',');
    h = Number(hsl[0]);
    s = Number(hsl[1]);
    l = Number(hsl[2]);
    return [h, s, l];
  }

  harmonize(color, start, end, interval) {
    const colors = [color];
    const [h, s, l] = color;

    for (let i = start; i <= end; i += interval) {
      const h1 = (h + i) % 360;
      const c1 = [h1, s, l];
      colors.push(c1);
    }

    return colors;
  }

  hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0,
        g = 0,
        b = 0;

    if (H.length === 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    } // Then to HSL


    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    if (delta === 0) h = 0;else if (cmax === r) h = (g - b) / delta % 6;else if (cmax === g) h = (b - r) / delta + 2;else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return [h, s, l];
  }

  padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  invertColor(hex) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    } // convert 3-digit hex to 6-digits.


    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }

    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
  }

  singleColorTC(props) {
    let obj = {};

    if (this.defaultTypes[props.type]) {
      obj[props.type] = {};

      for (let k in this.defaultTypes[props.type]) {
        let item = this.defaultTypes[props.type][k];
        obj[props.type][k] = {
          tone: item.tone,
          chroma: item.chroma,
          hue: props.hue,
          color: _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(props.hue, item.chroma).tone(item.tone)
        };
      }

      return {
        object: obj,
        color: _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHCT(props.hue, props.chroma, props.tonal).tone(props.tonal)
      };
    }
  }

  makeHigherAndLower() {
    let obj = {};
    Object.keys(this.defaultTypes).map(el => {
      obj[el] = {
        higher: _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(el === 'tertiary' ? this.newColors[el].hue : this.hue, 100).tone(50),
        lower: _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(el === 'tertiary' ? this.newColors[el].hue : this.hue, 0).tone(50)
      };
    });
  }

  makeColorTC() {
    let obj = {};
    Object.keys(this.defaultTypes).map(el => {
      obj[el] = {};

      for (let k in this.defaultTypes[el]) {
        const type = this.defaultTypes[el][k];
        let hue = el === 'tertiary' ? this.newColors[el].hue : this.hue;
        let secondary = {
          success: 145,
          info: 255,
          warning: 60,
          error: 25
        };

        if (secondary[el]) {
          hue = secondary[el];
        }

        obj[el][k] = {
          tone: type.tone,
          chroma: type.chroma,
          hue: hue,
          color: _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(hue, type.chroma).tone(type.tone)
        };
      }
    });
    this.colorsTC = obj;
    return this.colorsTC;
  }

}
class ColorPalette {
  constructor(props) {
    this.h = props.hue;
    this.c = props.chroma;
    this.t = props.tonal;
    this.color = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, this.c).tone(this.t);
    this.lower = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, 0).tone(this.t);
    this.higher = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, 100).tone(this.t);
    this.middle = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, 50).tone(this.t);
    this.halfLower = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, 25).tone(this.t);
    this.halfHigher = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, 75).tone(this.t);
    this.toneBackground = {
      lower: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(_tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, this.c).tone(0)),
      higher: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(_tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, this.c).tone(100)),
      middle: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(_tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, this.c).tone(50)),
      halfLower: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(_tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, this.c).tone(25)),
      halfHigher: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(_tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, this.c).tone(75))
    };
    this.hex = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(this.color);
    this.hexLower = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(this.lower);
    this.hexHalfLower = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(this.halfLower);
    this.hexHalfHigher = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(this.halfHigher);
    this.hexMiddle = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(this.middle);
    this.hexHigher = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(this.higher);
    this.colors = {};
    this.getColorArray();

    if (props.hexes) {
      this.hexes = this.getLinearColors(props.chroma, props.tonal);
    }
  }

  getColorArray() {
    let tonal = [0, 6, 10, 14, 18, 20, 22, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 96, 98, 100];

    for (let k in tonal) {
      let t = tonal[k];
      this.colors[tonal[k]] = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, this.c).tone(t);
    }
  }

  getLinearColors(c, t) {
    let hues = [0, 60, 120, 180, 240, 300],
        colors = [];
    hues.forEach(hue => {
      colors.push((0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(_tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(hue, c).tone(t)));
    });
    return colors;
  }

  static getHue(color) {
    if (color.length === 3) {
      color = `${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`;
    }

    let r = parseInt(color.substring(0, 2), 16) / 255;
    let g = parseInt(color.substring(2, 4), 16) / 255;
    let b = parseInt(color.substring(4, 6), 16) / 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, tone;
    let d = max - min; // Saturation

    s = max === 0 ? 0 : d / max; // Hue

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    } // Tone = perceived brightness (Lightness from HSL)


    let l = (max + min) / 2;
    tone = Math.round(l * 100);
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      t: tone
    };
  }

  getColorFromChroma(chroma) {
    let color = _tonalPalette__WEBPACK_IMPORTED_MODULE_1__.TPalette.fHAC(this.h, chroma).tone(this.t);
    return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(color);
  }

}

/***/ },

/***/ "8c86bfc570d8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LabPointProvider: () => (/* binding */ LabPointProvider)
/* harmony export */ });
/* harmony import */ var _utils_functions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ce4c5d18e9c8");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class LabPointProvider {
  fromInt(argb) {
    return (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_0__.lFa)(argb);
  }

  toInt(point) {
    return (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_0__.aFl)(point[0], point[1], point[2]);
  }

  distance(from, to) {
    const dL = from[0] - to[0];
    const dA = from[1] - to[1];
    const dB = from[2] - to[2];
    return dL * dL + dA * dA + dB * dB;
  }

}

/***/ },

/***/ "3fa91098d5c9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantizerCelebi: () => (/* binding */ QuantizerCelebi)
/* harmony export */ });
/* harmony import */ var _quantizer_wsmeans_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5f1c9daf0716");
/* harmony import */ var _quantizer_wu_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d9460302a8a1");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * An image quantizer that improves on the quality of a standard K-Means
 * algorithm by setting the K-Means initial state to the output of a Wu
 * quantizer, instead of random centroids. Improves on speed by several
 * optimizations, as implemented in Wsmeans, or Weighted Square Means, K-Means
 * with those optimizations.
 *
 * This algorithm was designed by M. Emre Celebi, and was found in their 2011
 * paper, Improving the Performance of K-Means for Color Quantization.
 * https://arxiv.org/abs/1101.0395
 */
// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable-next-line:class-as-namespace

class QuantizerCelebi {
  /**
   * @param pixels Colors in ARGB format.
   * @param maxColors The number of colors to divide the image into. A lower
   *     number of colors may be returned.
   * @return Map with keys of colors in ARGB format, and values of number of
   *     pixels in the original image that correspond to the color in the
   *     quantized image.
   */
  static quantize(pixels, maxColors) {
    const wu = new _quantizer_wu_js__WEBPACK_IMPORTED_MODULE_1__.QuantizerWu();
    const wuResult = wu.quantize(pixels, maxColors);
    return _quantizer_wsmeans_js__WEBPACK_IMPORTED_MODULE_0__.QuantizerWsmeans.quantize(pixels, wuResult, maxColors);
  }

}

/***/ },

/***/ "8ff974b46843"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantizerMap: () => (/* binding */ QuantizerMap)
/* harmony export */ });
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ce4c5d18e9c8");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class QuantizerMap {
  /**
   * @param pixels Colors in ARGB format.
   * @return A Map with keys of ARGB colors, and values of the number of times
   *     the color appears in the image.
   */
  static quantize(pixels) {
    const countByColor = new Map();

    for (let i = 0; i < pixels.length; i++) {
      const pixel = pixels[i];

      if ((0,_utils_functions__WEBPACK_IMPORTED_MODULE_0__.aFA)(pixel) < 255) {
        continue;
      }

      countByColor.set(pixel, (countByColor.get(pixel) ?? 0) + 1);
    }

    return countByColor;
  }

}

/***/ },

/***/ "5f1c9daf0716"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantizerWsmeans: () => (/* binding */ QuantizerWsmeans)
/* harmony export */ });
/* harmony import */ var _lab_point_provider_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8c86bfc570d8");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const MAX_ITERATIONS = 10;
const MIN_MOVEMENT_DISTANCE = 3.0;
class QuantizerWsmeans {
  static quantize(inputPixels, startingClusters, maxColors) {
    const pixelToCount = new Map();
    const points = [];
    const pixels = [];
    const pointProvider = new _lab_point_provider_js__WEBPACK_IMPORTED_MODULE_0__.LabPointProvider();
    let pointCount = 0;

    for (let i = 0; i < inputPixels.length; i++) {
      const inputPixel = inputPixels[i];
      const pixelCount = pixelToCount.get(inputPixel);

      if (pixelCount === undefined) {
        pointCount++;
        points.push(pointProvider.fromInt(inputPixel));
        pixels.push(inputPixel);
        pixelToCount.set(inputPixel, 1);
      } else {
        pixelToCount.set(inputPixel, pixelCount + 1);
      }
    }

    const counts = [];

    for (let i = 0; i < pointCount; i++) {
      const pixel = pixels[i];
      const count = pixelToCount.get(pixel);

      if (count !== undefined) {
        counts[i] = count;
      }
    }

    let clusterCount = Math.min(maxColors, pointCount);

    if (startingClusters.length > 0) {
      clusterCount = Math.min(clusterCount, startingClusters.length);
    }

    const clusters = [];

    for (let i = 0; i < startingClusters.length; i++) {
      // console.log(startingClusters[i]);
      clusters.push(pointProvider.fromInt(startingClusters[i]));
    }

    const additionalClustersNeeded = clusterCount - clusters.length;

    if (startingClusters.length === 0 && additionalClustersNeeded > 0) {
      for (let i = 0; i < additionalClustersNeeded; i++) {
        const l = Math.random() * 100.0;
        const a = Math.random() * (100.0 - -100.0 + 1) + -100;
        const b = Math.random() * (100.0 - -100.0 + 1) + -100;
        clusters.push([l, a, b]);
      }
    }

    const clusterIndices = [];

    for (let i = 0; i < pointCount; i++) {
      clusterIndices.push(Math.floor(Math.random() * clusterCount));
    }

    const indexMatrix = [];

    for (let i = 0; i < clusterCount; i++) {
      indexMatrix.push([]);

      for (let j = 0; j < clusterCount; j++) {
        indexMatrix[i].push(0);
      }
    }

    const distanceToIndexMatrix = [];

    for (let i = 0; i < clusterCount; i++) {
      distanceToIndexMatrix.push([]);

      for (let j = 0; j < clusterCount; j++) {
        distanceToIndexMatrix[i].push(new DistanceAndIndex());
      }
    }

    const pixelCountSums = [];

    for (let i = 0; i < clusterCount; i++) {
      pixelCountSums.push(0);
    }

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
      for (let i = 0; i < clusterCount; i++) {
        for (let j = i + 1; j < clusterCount; j++) {
          const distance = pointProvider.distance(clusters[i], clusters[j]);
          distanceToIndexMatrix[j][i].distance = distance;
          distanceToIndexMatrix[j][i].index = i;
          distanceToIndexMatrix[i][j].distance = distance;
          distanceToIndexMatrix[i][j].index = j;
        }

        distanceToIndexMatrix[i].sort();

        for (let j = 0; j < clusterCount; j++) {
          indexMatrix[i][j] = distanceToIndexMatrix[i][j].index;
        }
      }

      let pointsMoved = 0;

      for (let i = 0; i < pointCount; i++) {
        const point = points[i];
        const previousClusterIndex = clusterIndices[i];
        const previousCluster = clusters[previousClusterIndex];
        const previousDistance = pointProvider.distance(point, previousCluster);
        let minimumDistance = previousDistance;
        let newClusterIndex = -1;

        for (let j = 0; j < clusterCount; j++) {
          if (distanceToIndexMatrix[previousClusterIndex][j].distance >= 4 * previousDistance) {
            continue;
          }

          const distance = pointProvider.distance(point, clusters[j]);

          if (distance < minimumDistance) {
            minimumDistance = distance;
            newClusterIndex = j;
          }
        }

        if (newClusterIndex !== -1) {
          const distanceChange = Math.abs(Math.sqrt(minimumDistance) - Math.sqrt(previousDistance));

          if (distanceChange > MIN_MOVEMENT_DISTANCE) {
            pointsMoved++;
            clusterIndices[i] = newClusterIndex;
          }
        }
      }

      if (pointsMoved === 0 && iteration !== 0) {
        break;
      }

      const componentASums = new Array(clusterCount).fill(0);
      const componentBSums = new Array(clusterCount).fill(0);
      const componentCSums = new Array(clusterCount).fill(0);

      for (let i = 0; i < clusterCount; i++) {
        pixelCountSums[i] = 0;
      }

      for (let i = 0; i < pointCount; i++) {
        const clusterIndex = clusterIndices[i];
        const point = points[i];
        const count = counts[i];
        pixelCountSums[clusterIndex] += count;
        componentASums[clusterIndex] += point[0] * count;
        componentBSums[clusterIndex] += point[1] * count;
        componentCSums[clusterIndex] += point[2] * count;
      }

      for (let i = 0; i < clusterCount; i++) {
        const count = pixelCountSums[i];

        if (count === 0) {
          clusters[i] = [0.0, 0.0, 0.0];
          continue;
        }

        const a = componentASums[i] / count;
        const b = componentBSums[i] / count;
        const c = componentCSums[i] / count;
        clusters[i] = [a, b, c];
      }
    } // console.log(clusters[0]);


    const argbToPopulation = new Map();

    for (let i = 0; i < clusterCount; i++) {
      const count = pixelCountSums[i];

      if (count === 0) {
        continue;
      }

      const possibleNewCluster = pointProvider.toInt(clusters[i]);

      if (argbToPopulation.has(possibleNewCluster)) {
        continue;
      }

      argbToPopulation.set(possibleNewCluster, count);
    }

    return argbToPopulation;
  }

}

class DistanceAndIndex {
  constructor() {
    this.distance = -1;
    this.index = -1;
  }

}

/***/ },

/***/ "d9460302a8a1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantizerWu: () => (/* binding */ QuantizerWu)
/* harmony export */ });
/* harmony import */ var _quantizer_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8ff974b46843");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const INDEX_BITS = 5;
const SIDE_LENGTH = 33; // ((1 << INDEX_INDEX_BITS) + 1)

const TOTAL_SIZE = 35937; // SIDE_LENGTH * SIDE_LENGTH * SIDE_LENGTH

const directions = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue'
};
class QuantizerWu {
  constructor(weights = [], momentsR = [], momentsG = [], momentsB = [], moments = [], cubes = []) {
    this.weights = weights;
    this.momentsR = momentsR;
    this.momentsG = momentsG;
    this.momentsB = momentsB;
    this.moments = moments;
    this.cubes = cubes;
  }
  /**
   * @param pixels Colors in ARGB format.
   * @param maxColors The number of colors to divide the image into. A lower
   *     number of colors may be returned.
   * @return Colors in ARGB format.
   */


  quantize(pixels, maxColors) {
    this.constructHistogram(pixels);
    this.computeMoments();
    const createBoxesResult = this.createBoxes(maxColors);
    return this.createResult(createBoxesResult.resultCount);
  }

  constructHistogram(pixels) {
    this.weights = Array.from({
      length: TOTAL_SIZE
    }).fill(0);
    this.momentsR = Array.from({
      length: TOTAL_SIZE
    }).fill(0);
    this.momentsG = Array.from({
      length: TOTAL_SIZE
    }).fill(0);
    this.momentsB = Array.from({
      length: TOTAL_SIZE
    }).fill(0);
    this.moments = Array.from({
      length: TOTAL_SIZE
    }).fill(0);
    const countByColor = _quantizer_map_js__WEBPACK_IMPORTED_MODULE_0__.QuantizerMap.quantize(pixels);

    for (const [pixel, count] of countByColor.entries()) {
      const red = pixel >> 16 & 255;
      const green = pixel >> 8 & 255;
      const blue = pixel & 255;
      const bitsToRemove = 8 - INDEX_BITS;
      const iR = (red >> bitsToRemove) + 1;
      const iG = (green >> bitsToRemove) + 1;
      const iB = (blue >> bitsToRemove) + 1;
      const index = this.getIndex(iR, iG, iB);
      this.weights[index] = (this.weights[index] ?? 0) + count;
      this.momentsR[index] += count * red;
      this.momentsG[index] += count * green;
      this.momentsB[index] += count * blue;
      this.moments[index] += count * (red * red + green * green + blue * blue);
    }
  }

  computeMoments() {
    for (let r = 1; r < SIDE_LENGTH; r++) {
      const area = Array.from({
        length: SIDE_LENGTH
      }).fill(0);
      const areaR = Array.from({
        length: SIDE_LENGTH
      }).fill(0);
      const areaG = Array.from({
        length: SIDE_LENGTH
      }).fill(0);
      const areaB = Array.from({
        length: SIDE_LENGTH
      }).fill(0);
      const area2 = Array.from({
        length: SIDE_LENGTH
      }).fill(0.0);

      for (let g = 1; g < SIDE_LENGTH; g++) {
        let line = 0;
        let lineR = 0;
        let lineG = 0;
        let lineB = 0;
        let line2 = 0.0;

        for (let b = 1; b < SIDE_LENGTH; b++) {
          const index = this.getIndex(r, g, b);
          line += this.weights[index];
          lineR += this.momentsR[index];
          lineG += this.momentsG[index];
          lineB += this.momentsB[index];
          line2 += this.moments[index];
          area[b] += line;
          areaR[b] += lineR;
          areaG[b] += lineG;
          areaB[b] += lineB;
          area2[b] += line2;
          const previousIndex = this.getIndex(r - 1, g, b);
          this.weights[index] = this.weights[previousIndex] + area[b];
          this.momentsR[index] = this.momentsR[previousIndex] + areaR[b];
          this.momentsG[index] = this.momentsG[previousIndex] + areaG[b];
          this.momentsB[index] = this.momentsB[previousIndex] + areaB[b];
          this.moments[index] = this.moments[previousIndex] + area2[b];
        }
      }
    }
  }

  createBoxes(maxColors) {
    this.cubes = Array.from({
      length: maxColors
    }).fill(0).map(() => new Box());
    const volumeVariance = Array.from({
      length: maxColors
    }).fill(0.0);
    this.cubes[0].r0 = 0;
    this.cubes[0].g0 = 0;
    this.cubes[0].b0 = 0;
    this.cubes[0].r1 = SIDE_LENGTH - 1;
    this.cubes[0].g1 = SIDE_LENGTH - 1;
    this.cubes[0].b1 = SIDE_LENGTH - 1;
    let generatedColorCount = maxColors;
    let next = 0;

    for (let i = 1; i < maxColors; i++) {
      if (this.cut(this.cubes[next], this.cubes[i])) {
        volumeVariance[next] = this.cubes[next].vol > 1 ? this.variance(this.cubes[next]) : 0.0;
        volumeVariance[i] = this.cubes[i].vol > 1 ? this.variance(this.cubes[i]) : 0.0;
      } else {
        volumeVariance[next] = 0.0;
        i--;
      }

      next = 0;
      let temp = volumeVariance[0];

      for (let j = 1; j <= i; j++) {
        if (volumeVariance[j] > temp) {
          temp = volumeVariance[j];
          next = j;
        }
      }

      if (temp <= 0.0) {
        generatedColorCount = i + 1;
        break;
      }
    }

    return new CreateBoxesResult(maxColors, generatedColorCount);
  }

  createResult(colorCount) {
    const colors = [];

    for (let i = 0; i < colorCount; ++i) {
      const cube = this.cubes[i];
      const weight = this.volume(cube, this.weights);

      if (weight > 0) {
        const r = Math.round(this.volume(cube, this.momentsR) / weight);
        const g = Math.round(this.volume(cube, this.momentsG) / weight);
        const b = Math.round(this.volume(cube, this.momentsB) / weight);
        const color = 255 << 24 | (r & 0x0ff) << 16 | (g & 0x0ff) << 8 | b & 0x0ff;
        colors.push(color);
      }
    }

    return colors;
  }

  variance(cube) {
    const dr = this.volume(cube, this.momentsR);
    const dg = this.volume(cube, this.momentsG);
    const db = this.volume(cube, this.momentsB);
    const xx = this.moments[this.getIndex(cube.r1, cube.g1, cube.b1)] - this.moments[this.getIndex(cube.r1, cube.g1, cube.b0)] - this.moments[this.getIndex(cube.r1, cube.g0, cube.b1)] + this.moments[this.getIndex(cube.r1, cube.g0, cube.b0)] - this.moments[this.getIndex(cube.r0, cube.g1, cube.b1)] + this.moments[this.getIndex(cube.r0, cube.g1, cube.b0)] + this.moments[this.getIndex(cube.r0, cube.g0, cube.b1)] - this.moments[this.getIndex(cube.r0, cube.g0, cube.b0)];
    const hypotenuse = dr * dr + dg * dg + db * db;
    const volume = this.volume(cube, this.weights);
    return xx - hypotenuse / volume;
  }

  cut(one, two) {
    const wholeR = this.volume(one, this.momentsR);
    const wholeG = this.volume(one, this.momentsG);
    const wholeB = this.volume(one, this.momentsB);
    const wholeW = this.volume(one, this.weights);
    const maxRResult = this.maximize(one, directions.RED, one.r0 + 1, one.r1, wholeR, wholeG, wholeB, wholeW);
    const maxGResult = this.maximize(one, directions.GREEN, one.g0 + 1, one.g1, wholeR, wholeG, wholeB, wholeW);
    const maxBResult = this.maximize(one, directions.BLUE, one.b0 + 1, one.b1, wholeR, wholeG, wholeB, wholeW);
    let direction;
    const maxR = maxRResult.maximum;
    const maxG = maxGResult.maximum;
    const maxB = maxBResult.maximum;

    if (maxR >= maxG && maxR >= maxB) {
      if (maxRResult.cutLocation < 0) {
        return false;
      }

      direction = directions.RED;
    } else if (maxG >= maxR && maxG >= maxB) {
      direction = directions.GREEN;
    } else {
      direction = directions.BLUE;
    }

    two.r1 = one.r1;
    two.g1 = one.g1;
    two.b1 = one.b1;

    switch (direction) {
      case directions.RED:
        one.r1 = maxRResult.cutLocation;
        two.r0 = one.r1;
        two.g0 = one.g0;
        two.b0 = one.b0;
        break;

      case directions.GREEN:
        one.g1 = maxGResult.cutLocation;
        two.r0 = one.r0;
        two.g0 = one.g1;
        two.b0 = one.b0;
        break;

      case directions.BLUE:
        one.b1 = maxBResult.cutLocation;
        two.r0 = one.r0;
        two.g0 = one.g0;
        two.b0 = one.b1;
        break;

      default:
        throw new Error('unexpected direction ' + direction);
    }

    one.vol = (one.r1 - one.r0) * (one.g1 - one.g0) * (one.b1 - one.b0);
    two.vol = (two.r1 - two.r0) * (two.g1 - two.g0) * (two.b1 - two.b0);
    return true;
  }

  maximize(cube, direction, first, last, wholeR, wholeG, wholeB, wholeW) {
    const bottomR = this.bottom(cube, direction, this.momentsR);
    const bottomG = this.bottom(cube, direction, this.momentsG);
    const bottomB = this.bottom(cube, direction, this.momentsB);
    const bottomW = this.bottom(cube, direction, this.weights);
    let max = 0.0;
    let cut = -1;
    let halfR = 0;
    let halfG = 0;
    let halfB = 0;
    let halfW = 0;

    for (let i = first; i < last; i++) {
      halfR = bottomR + this.top(cube, direction, i, this.momentsR);
      halfG = bottomG + this.top(cube, direction, i, this.momentsG);
      halfB = bottomB + this.top(cube, direction, i, this.momentsB);
      halfW = bottomW + this.top(cube, direction, i, this.weights);

      if (halfW === 0) {
        continue;
      }

      let tempNumerator = (halfR * halfR + halfG * halfG + halfB * halfB) * 1.0;
      let tempDenominator = halfW * 1.0;
      let temp = tempNumerator / tempDenominator;
      halfR = wholeR - halfR;
      halfG = wholeG - halfG;
      halfB = wholeB - halfB;
      halfW = wholeW - halfW;

      if (halfW === 0) {
        continue;
      }

      tempNumerator = (halfR * halfR + halfG * halfG + halfB * halfB) * 1.0;
      tempDenominator = halfW * 1.0;
      temp += tempNumerator / tempDenominator;

      if (temp > max) {
        max = temp;
        cut = i;
      }
    }

    return new MaximizeResult(cut, max);
  }

  volume(cube, moment) {
    return moment[this.getIndex(cube.r1, cube.g1, cube.b1)] - moment[this.getIndex(cube.r1, cube.g1, cube.b0)] - moment[this.getIndex(cube.r1, cube.g0, cube.b1)] + moment[this.getIndex(cube.r1, cube.g0, cube.b0)] - moment[this.getIndex(cube.r0, cube.g1, cube.b1)] + moment[this.getIndex(cube.r0, cube.g1, cube.b0)] + moment[this.getIndex(cube.r0, cube.g0, cube.b1)] - moment[this.getIndex(cube.r0, cube.g0, cube.b0)];
  }

  bottom(cube, direction, moment) {
    switch (direction) {
      case directions.RED:
        return -moment[this.getIndex(cube.r0, cube.g1, cube.b1)] + moment[this.getIndex(cube.r0, cube.g1, cube.b0)] + moment[this.getIndex(cube.r0, cube.g0, cube.b1)] - moment[this.getIndex(cube.r0, cube.g0, cube.b0)];

      case directions.GREEN:
        return -moment[this.getIndex(cube.r1, cube.g0, cube.b1)] + moment[this.getIndex(cube.r1, cube.g0, cube.b0)] + moment[this.getIndex(cube.r0, cube.g0, cube.b1)] - moment[this.getIndex(cube.r0, cube.g0, cube.b0)];

      case directions.BLUE:
        return -moment[this.getIndex(cube.r1, cube.g1, cube.b0)] + moment[this.getIndex(cube.r1, cube.g0, cube.b0)] + moment[this.getIndex(cube.r0, cube.g1, cube.b0)] - moment[this.getIndex(cube.r0, cube.g0, cube.b0)];

      default:
        throw new Error('unexpected direction $direction');
    }
  }

  top(cube, direction, position, moment) {
    switch (direction) {
      case directions.RED:
        return moment[this.getIndex(position, cube.g1, cube.b1)] - moment[this.getIndex(position, cube.g1, cube.b0)] - moment[this.getIndex(position, cube.g0, cube.b1)] + moment[this.getIndex(position, cube.g0, cube.b0)];

      case directions.GREEN:
        return moment[this.getIndex(cube.r1, position, cube.b1)] - moment[this.getIndex(cube.r1, position, cube.b0)] - moment[this.getIndex(cube.r0, position, cube.b1)] + moment[this.getIndex(cube.r0, position, cube.b0)];

      case directions.BLUE:
        return moment[this.getIndex(cube.r1, cube.g1, position)] - moment[this.getIndex(cube.r1, cube.g0, position)] - moment[this.getIndex(cube.r0, cube.g1, position)] + moment[this.getIndex(cube.r0, cube.g0, position)];

      default:
        throw new Error('unexpected direction $direction');
    }
  }

  getIndex(r, g, b) {
    return (r << INDEX_BITS * 2) + (r << INDEX_BITS + 1) + r + (g << INDEX_BITS) + g + b;
  }

}
/**
 * Keeps track of the state of each box created as the Wu  quantization
 * algorithm progresses through dividing the image's pixels as plotted in RGB.
 */

class Box {
  constructor(r0 = 0, r1 = 0, g0 = 0, g1 = 0, b0 = 0, b1 = 0, vol = 0) {
    this.r0 = r0;
    this.r1 = r1;
    this.g0 = g0;
    this.g1 = g1;
    this.b0 = b0;
    this.b1 = b1;
    this.vol = vol;
  }

}
/**
 * Represents final result of Wu algorithm.
 */


class CreateBoxesResult {
  /**
   * @param requestedCount how many colors the caller asked to be returned from
   *     quantization.
   * @param resultCount the actual number of colors achieved from quantization.
   *     May be lower than the requested count.
   */
  constructor(requestedCount, resultCount) {
    this.requestedCount = requestedCount;
    this.resultCount = resultCount;
  }

}
/**
 * Represents the result of calculating where to cut an existing box in such
 * a way to maximize variance between the two new boxes created by a cut.
 */


class MaximizeResult {
  constructor(cutLocation, maximum) {
    this.cutLocation = cutLocation;
    this.maximum = maximum;
  }

}

/***/ },

/***/ "0ee1af918537"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SMC: () => (/* binding */ SMC)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5c7297c4cd4f");
/* harmony import */ var _utils_math_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("710690b9ec6a");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ce4c5d18e9c8");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("07d1b93a2bb7");




class SMC {
  static from(h, c, t) {
    return new SMC({
      argb: SMC.solveToInt(h, c, t)
    });
  }

  static fromArgb(argb) {
    return new SMC({
      argb: argb
    });
  }

  static inverseChromaticAdaptation(adapted) {
    const adaptedAbs = Math.abs(adapted);
    const base = Math.max(0, 27.13 * adaptedAbs / (400.0 - adaptedAbs));
    return _utils_math_utils__WEBPACK_IMPORTED_MODULE_1__.signum(adapted) * Math.pow(base, 1.0 / 0.42);
  }

  static findResultByJ(hueRadians, chroma, y) {
    let j = Math.sqrt(y) * 11.0;
    const tInnerCoeff = 1 / Math.pow(1.64 - Math.pow(0.29, _utils_constants__WEBPACK_IMPORTED_MODULE_3__.position[0]), 0.73);
    const eHue = 0.25 * (Math.cos(hueRadians + 2.0) + 3.8);
    const p1 = eHue * (50000.0 / 13.0) * _utils_constants__WEBPACK_IMPORTED_MODULE_3__.position[5] * _utils_constants__WEBPACK_IMPORTED_MODULE_3__.position[3];
    const hSin = Math.sin(hueRadians);
    const hCos = Math.cos(hueRadians);

    for (let iterationRound = 0; iterationRound < 5; iterationRound++) {
      const jNormalized = j / 100.0;
      const alpha = chroma === 0.0 || j === 0.0 ? 0.0 : chroma / Math.sqrt(jNormalized);
      const t = Math.pow(alpha * tInnerCoeff, 1.0 / 0.9);
      const ac = _utils_constants__WEBPACK_IMPORTED_MODULE_3__.position[1] * Math.pow(jNormalized, 1.0 / _utils_constants__WEBPACK_IMPORTED_MODULE_3__.position[4] / _utils_constants__WEBPACK_IMPORTED_MODULE_3__.position[9]);
      const p2 = ac / _utils_constants__WEBPACK_IMPORTED_MODULE_3__.position[2];
      const gamma = 23.0 * (p2 + 0.305) * t / (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
      const a = gamma * hCos;
      const b = gamma * hSin;
      const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
      const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
      const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
      const rCScaled = SMC.inverseChromaticAdaptation(rA);
      const gCScaled = SMC.inverseChromaticAdaptation(gA);
      const bCScaled = SMC.inverseChromaticAdaptation(bA);
      const linrgb = _utils_math_utils__WEBPACK_IMPORTED_MODULE_1__.matrixMultiply([rCScaled, gCScaled, bCScaled], _utils_constants__WEBPACK_IMPORTED_MODULE_3__.L_F_S_D);

      if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) {
        return 0;
      }

      const fnj = _utils_constants__WEBPACK_IMPORTED_MODULE_3__.Y_F_L[0] * linrgb[0] + _utils_constants__WEBPACK_IMPORTED_MODULE_3__.Y_F_L[1] * linrgb[1] + _utils_constants__WEBPACK_IMPORTED_MODULE_3__.Y_F_L[2] * linrgb[2];

      if (fnj <= 0) {
        return 0;
      }

      if (iterationRound === 4 || Math.abs(fnj - y) < 0.002) {
        if (linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01) {
          return 0;
        }

        return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.argbFromLinrgb)(linrgb);
      }

      j = j - (fnj - y) * j / (2 * fnj);
    }

    return 0;
  }

  static chromaticAdaptation(component) {
    const af = Math.pow(Math.abs(component), 0.42);
    return _utils_math_utils__WEBPACK_IMPORTED_MODULE_1__.signum(component) * 400.0 * af / (af + 27.13);
  }

  static hueOf(linrgb) {
    const scaledDiscount = _utils_math_utils__WEBPACK_IMPORTED_MODULE_1__.matrixMultiply(linrgb, _utils_constants__WEBPACK_IMPORTED_MODULE_3__.S_D_F_L);
    const rA = SMC.chromaticAdaptation(scaledDiscount[0]);
    const gA = SMC.chromaticAdaptation(scaledDiscount[1]);
    const bA = SMC.chromaticAdaptation(scaledDiscount[2]); // redness-greenness

    const a = (11.0 * rA + -12.0 * gA + bA) / 11.0; // yellowness-blueness

    const b = (rA + gA - 2.0 * bA) / 9.0;
    return Math.atan2(b, a);
  }

  static criticalPlaneBelow(x) {
    return Math.floor(x - 0.5);
  }

  static criticalPlaneAbove(x) {
    return Math.ceil(x - 0.5);
  }

  static intercept(source, mid, target) {
    return (mid - source) / (target - source);
  }

  static lerpPoint(source, t, target) {
    return [source[0] + (target[0] - source[0]) * t, source[1] + (target[1] - source[1]) * t, source[2] + (target[2] - source[2]) * t];
  }

  static trueDelinearized(rgbComponent) {
    const normalized = rgbComponent / 100.0;
    let delinearized = 0.0;

    if (normalized <= 0.0031308) {
      delinearized = normalized * 12.92;
    } else {
      delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
    }

    return delinearized * 255.0;
  }

  static setCoordinate(source, coordinate, target, axis) {
    const t = SMC.intercept(source[axis], coordinate, target[axis]);
    return SMC.lerpPoint(source, t, target);
  }

  static isBounded(x) {
    return 0.0 <= x && x <= 100.0;
  }

  static nthVertex(y, n) {
    const kR = _utils_constants__WEBPACK_IMPORTED_MODULE_3__.Y_F_L[0];
    const kG = _utils_constants__WEBPACK_IMPORTED_MODULE_3__.Y_F_L[1];
    const kB = _utils_constants__WEBPACK_IMPORTED_MODULE_3__.Y_F_L[2];
    const coordA = n % 4 <= 1 ? 0.0 : 100.0;
    const coordB = n % 2 === 0 ? 0.0 : 100.0;

    if (n < 4) {
      const g = coordA;
      const b = coordB;
      const r = (y - g * kG - b * kB) / kR;

      if (SMC.isBounded(r)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    } else if (n < 8) {
      const b = coordA;
      const r = coordB;
      const g = (y - r * kR - b * kB) / kG;

      if (SMC.isBounded(g)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    } else {
      const r = coordA;
      const g = coordB;
      const b = (y - r * kR - g * kG) / kB;

      if (SMC.isBounded(b)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    }
  }

  static sanitizeRadians(angle) {
    return (angle + Math.PI * 8) % (Math.PI * 2);
  }

  static areInCyclicOrder(a, b, c) {
    const deltaAB = SMC.sanitizeRadians(b - a);
    const deltaAC = SMC.sanitizeRadians(c - a);
    return deltaAB < deltaAC;
  }

  static bisectToSegment(y, targetHue) {
    let left = [-1.0, -1.0, -1.0];
    let right = left;
    let leftHue = 0.0;
    let rightHue = 0.0;
    let initialized = false;
    let uncut = true;

    for (let n = 0; n < 12; n++) {
      const mid = SMC.nthVertex(y, n);

      if (mid[0] < 0) {
        continue;
      }

      const midHue = SMC.hueOf(mid);

      if (!initialized) {
        left = mid;
        right = mid;
        leftHue = midHue;
        rightHue = midHue;
        initialized = true;
        continue;
      }

      if (uncut || SMC.areInCyclicOrder(leftHue, midHue, rightHue)) {
        uncut = false;

        if (SMC.areInCyclicOrder(leftHue, targetHue, midHue)) {
          right = mid;
          rightHue = midHue;
        } else {
          left = mid;
          leftHue = midHue;
        }
      }
    }

    return [left, right];
  }

  static bisectToLimit(y, targetHue) {
    const segment = SMC.bisectToSegment(y, targetHue);
    let left = segment[0];
    let leftHue = SMC.hueOf(left);
    let right = segment[1];

    for (let axis = 0; axis < 3; axis++) {
      if (left[axis] !== right[axis]) {
        let lPlane = -1;
        let rPlane = 255;

        if (left[axis] < right[axis]) {
          lPlane = SMC.criticalPlaneBelow(SMC.trueDelinearized(left[axis]));
          rPlane = SMC.criticalPlaneAbove(SMC.trueDelinearized(right[axis]));
        } else {
          lPlane = SMC.criticalPlaneAbove(SMC.trueDelinearized(left[axis]));
          rPlane = SMC.criticalPlaneBelow(SMC.trueDelinearized(right[axis]));
        }

        for (let i = 0; i < 8; i++) {
          if (Math.abs(rPlane - lPlane) <= 1) {
            break;
          } else {
            const mPlane = Math.floor((lPlane + rPlane) / 2.0);
            const midPlaneCoordinate = _utils_constants__WEBPACK_IMPORTED_MODULE_3__.C_P[mPlane];
            const mid = SMC.setCoordinate(left, midPlaneCoordinate, right, axis);
            const midHue = SMC.hueOf(mid);

            if (SMC.areInCyclicOrder(leftHue, targetHue, midHue)) {
              right = mid;
              rPlane = mPlane;
            } else {
              left = mid;
              leftHue = midHue;
              lPlane = mPlane;
            }
          }
        }
      }
    }

    return SMC.midpoint(left, right);
  }

  static midpoint(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  }

  static solveToInt(h, c, l) {
    if (c < 0.0001 || l < 0.0001 || l > 99.9999) {
      return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.argbFromLstar)(l);
    }

    h = _utils_math_utils__WEBPACK_IMPORTED_MODULE_1__.sanitizeDegreesDouble(h);
    const hueRadians = h / 180 * Math.PI;
    const y = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.yFromLstar)(l);
    const exactAnswer = SMC.findResultByJ(hueRadians, c, y);

    if (exactAnswer !== 0) {
      return exactAnswer;
    }

    const linrgb = SMC.bisectToLimit(y, hueRadians);
    return (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.argbFromLinrgb)(linrgb);
  }

  constructor(props) {
    this.argb = props.argb;
    this.pow = new _view__WEBPACK_IMPORTED_MODULE_0__["default"]({
      color: this.argb
    });
    this.cam16 = this.pow.makeMainColor(this.argb);
    this.iHue = this.cam16.hue;
    this.iChroma = this.cam16.chroma;
    this.iTone = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.lstarFromArgb)(this.argb);
  }

  init = () => {// this.pow = new POW({
    //     color: this.color
    // })
  };
}

/***/ },

/***/ "cc73a8c3a24d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Theme: () => (/* binding */ Theme)
/* harmony export */ });
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("86073f4268f3");

class Theme {
  constructor(props) {
    this.props = props;
  }

  toJSON() {
    return { ...this.props
    };
  }

  static getMainColors(palette) {
    return {
      primary: palette.main1,
      secondary: palette.main2,
      tertiary: palette.main3,
      error: palette.error,
      neutral1: palette.secondary1,
      neutral2: palette.secondary2
    };
  }

  static light(argb) {
    const palette = new _palette__WEBPACK_IMPORTED_MODULE_0__.Palette({
      argb: argb
    });
    return Theme.getLightTheme(palette);
  }

  static getTonal(argb = null, arr = [], argbTonal = {}) {
    let tonal = {};

    if (arr.length) {
      if (argb) {
        const palette = new _palette__WEBPACK_IMPORTED_MODULE_0__.Palette({
          argb: argb
        });
        const colors = Theme.getMainColors(palette);

        for (let k in colors) {
          tonal[k] = {};
          arr.map(el => {
            tonal[k][el] = colors[k].tone(+el);
          });
        }
      } else {
        arr.map(el => {
          tonal[el] = argbTonal.tone(+el);
        });
      }
    } else {
      const palette = new _palette__WEBPACK_IMPORTED_MODULE_0__.Palette({
        argb: argb
      });
      const colors = Theme.getMainColors(palette);

      for (let k in colors) {
        tonal[k] = {};

        for (let i = 0; i <= 100;) {
          tonal[k][i] = colors[k].tone(i);
          i = i + 10;
        }
      }
    }

    return tonal;
  }
  /**
   * @param argb ARGB representation of a color.
   * @return Theme Material color scheme, based on the color's hue.
   */


  static dark(argb) {
    const palette = new _palette__WEBPACK_IMPORTED_MODULE_0__.Palette({
      argb: argb
    });
    return Theme.getDarkTheme(palette);
  }

  static getDarkTheme(palette) {
    return new Theme({
      primary: palette.main1.tone(80),
      onPrimary: palette.main1.tone(20),
      primaryContainer: palette.main1.tone(30),
      onPrimaryContainer: palette.main1.tone(90),
      secondary: palette.main2.tone(80),
      onSecondary: palette.main2.tone(20),
      secondaryContainer: palette.main2.tone(30),
      onSecondaryContainer: palette.main2.tone(90),
      tertiary: palette.main3.tone(80),
      onTertiary: palette.main3.tone(20),
      tertiaryContainer: palette.main3.tone(30),
      onTertiaryContainer: palette.main3.tone(90),
      error: palette.error.tone(80),
      onError: palette.error.tone(20),
      errorContainer: palette.error.tone(30),
      onErrorContainer: palette.error.tone(80),
      success: palette.success.tone(80),
      onSuccess: palette.success.tone(20),
      successContainer: palette.success.tone(30),
      onSuccessContainer: palette.success.tone(80),
      background: palette.secondary1.tone(10),
      onBackground: palette.secondary1.tone(90),
      surface: palette.secondary1.tone(10),
      onSurface: palette.secondary1.tone(90),
      surfaceVariant: palette.secondary2.tone(30),
      onSurfaceVariant: palette.secondary2.tone(80),
      outline: palette.secondary2.tone(60),
      outlineVariant: palette.secondary2.tone(30),
      shadow: palette.secondary1.tone(0),
      scrim: palette.secondary1.tone(0),
      inverseSurface: palette.secondary1.tone(90),
      inverseOnSurface: palette.secondary1.tone(20),
      inversePrimary: palette.main1.tone(40)
    });
  }

  static getLightTheme(palette) {
    return new Theme({
      primary: palette.main1.tone(40),
      onPrimary: palette.main1.tone(100),
      primaryContainer: palette.main1.tone(90),
      onPrimaryContainer: palette.main1.tone(10),
      secondary: palette.main2.tone(40),
      onSecondary: palette.main2.tone(100),
      secondaryContainer: palette.main2.tone(90),
      onSecondaryContainer: palette.main2.tone(10),
      tertiary: palette.main3.tone(40),
      onTertiary: palette.main3.tone(100),
      tertiaryContainer: palette.main3.tone(90),
      onTertiaryContainer: palette.main3.tone(10),
      error: palette.error.tone(40),
      onError: palette.error.tone(100),
      errorContainer: palette.error.tone(90),
      onErrorContainer: palette.error.tone(10),
      background: palette.secondary1.tone(99),
      onBackground: palette.secondary1.tone(10),
      surface: palette.secondary1.tone(99),
      onSurface: palette.secondary1.tone(10),
      surfaceVariant: palette.secondary2.tone(90),
      onSurfaceVariant: palette.secondary2.tone(30),
      outline: palette.secondary2.tone(50),
      outlineVariant: palette.secondary2.tone(80),
      shadow: palette.secondary1.tone(0),
      scrim: palette.secondary1.tone(0),
      inverseSurface: palette.secondary1.tone(20),
      inverseOnSurface: palette.secondary1.tone(95),
      inversePrimary: palette.main1.tone(80)
    });
  }

}

/***/ },

/***/ "4d3a1f1d5e72"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TPalette: () => (/* binding */ TPalette)
/* harmony export */ });
/* harmony import */ var _smc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0ee1af918537");

class TPalette {
  static fHAC(hue, chroma) {
    hue = (hue % 360 + 360) % 360;
    return new TPalette(hue, chroma, TPalette.createKey(hue, chroma));
  }

  static fHCT(hue, chroma, tonal) {
    hue = (hue % 360 + 360) % 360;
    return new TPalette(hue, chroma, tonal);
  }

  static createKey(h, c) {
    const startTone = 50.0;
    let smallestDeltaHct = _smc__WEBPACK_IMPORTED_MODULE_0__.SMC.from(h, c, startTone);
    let smallestDelta = Math.abs(smallestDeltaHct.iChroma - c);

    for (let delta = 1.0; delta < 50.0; delta += 1.0) {
      if (Math.round(c) === Math.round(smallestDeltaHct.iChroma)) {
        return smallestDeltaHct;
      }

      const hctAdd = _smc__WEBPACK_IMPORTED_MODULE_0__.SMC.from(h, c, startTone + delta);
      const hctAddDelta = Math.abs(hctAdd.iChroma - c);

      if (hctAddDelta < smallestDelta) {
        smallestDelta = hctAddDelta;
        smallestDeltaHct = hctAdd;
      }

      const hctSubtract = _smc__WEBPACK_IMPORTED_MODULE_0__.SMC.from(h, c, startTone - delta);
      const hctSubtractDelta = Math.abs(hctSubtract.iChroma - c);

      if (hctSubtractDelta < smallestDelta) {
        smallestDelta = hctSubtractDelta;
        smallestDeltaHct = hctSubtract;
      }
    }

    return smallestDeltaHct;
  }

  tone(tone) {
    let argb = this.cache.get(tone);

    if (argb === undefined) {
      let smc = _smc__WEBPACK_IMPORTED_MODULE_0__.SMC.from(this.hue, this.chroma, tone);
      this.cache.set(tone, smc.argb);
      return smc.argb;
    } else {
      return argb;
    }
  }

  constructor(h, c, t) {
    this.hue = (h % 360 + 360) % 360;
    this.chroma = c;
    this.keyColor = t;
    this.cache = new Map();
  }

}

/***/ },

/***/ "5c7297c4cd4f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ POW)
/* harmony export */ });
/* harmony import */ var _cam16__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0789749c5bc2");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("07d1b93a2bb7");


class POW {
  constructor(props) {
    this.color = props.color;
    this.position = _utils_constants__WEBPACK_IMPORTED_MODULE_1__.position;
  }

  compare = (m1, m2, i) => {
    if (i < m1) {
      return m1;
    } else if (i > m2) {
      return m2;
    }

    return i;
  };
  makeLinearized = color16 => {
    const n = color16 / 255.0;
    return n <= 0.040449936 ? n / 12.92 * 100.0 : Math.pow((n + 0.055) / 1.055, 2.4) * 100.0;
  };
  makeF = (d, position) => {
    return Math.pow(position * Math.abs(d) / 100.0, 0.42);
  };
  makeS = n => {
    if (n < 0) {
      return -1;
    } else if (n === 0) {
      return 0;
    } else {
      return 1;
    }
  };
  makeA = color => {
    const linearizedColors = [this.makeLinearized((color & 0x00ff0000) >> 16), this.makeLinearized((color & 0x0000ff00) >> 8), this.makeLinearized(color & 0x000000ff)];
    const xyz = [0.41233895 * linearizedColors[0] + 0.35762064 * linearizedColors[1] + 0.18051042 * linearizedColors[2], 0.2126 * linearizedColors[0] + 0.7152 * linearizedColors[1] + 0.0722 * linearizedColors[2], 0.01932141 * linearizedColors[0] + 0.11916382 * linearizedColors[1] + 0.95034478 * linearizedColors[2]];
    const c = [0.401288 * xyz[0] + 0.650173 * xyz[1] - 0.051461 * xyz[2], -0.250268 * xyz[0] + 1.204414 * xyz[1] + 0.045854 * xyz[2], -0.002079 * xyz[0] + 0.048952 * xyz[1] + 0.953127 * xyz[2]];
    const d = [this.position[6][0] * c[0], this.position[6][1] * c[1], this.position[6][2] * c[2]];
    const f = [this.makeF(d[0], this.position[7]), this.makeF(d[1], this.position[7]), this.makeF(d[2], this.position[7])];
    return [this.makeS(d[0]) * 400.0 * f[0] / (f[0] + 27.13), this.makeS(d[1]) * 400.0 * f[1] / (f[1] + 27.13), this.makeS(d[2]) * 400.0 * f[2] / (f[2] + 27.13)];
  };
  makeMainColor = color => {
    const colorsA = this.makeA(color);
    const a = (11.0 * colorsA[0] + -12.0 * colorsA[1] + colorsA[2]) / 11.0;
    const b = (colorsA[0] + colorsA[1] - 2.0 * colorsA[2]) / 9.0;
    const u = (20.0 * colorsA[0] + 20.0 * colorsA[1] + 21.0 * colorsA[2]) / 20.0;
    const p2 = (40.0 * colorsA[0] + 20.0 * colorsA[1] + colorsA[2]) / 20.0;
    const atan2 = Math.atan2(b, a);
    const atanDegrees = atan2 * 180.0 / Math.PI;
    const hue = atanDegrees < 0 ? atanDegrees + 360.0 : atanDegrees >= 360 ? atanDegrees - 360.0 : atanDegrees;
    const hueRadians = hue * Math.PI / 180.0;
    const ac = p2 * this.position[2];
    const j = 100.0 * Math.pow(ac / this.position[1], this.position[4] * this.position[9]);
    const q = 4.0 / this.position[4] * Math.sqrt(j / 100.0) * (this.position[1] + 4.0) * this.position[8];
    const huePrime = hue < 20.14 ? hue + 360 : hue;
    const eHue = 0.25 * (Math.cos(huePrime * Math.PI / 180.0 + 2.0) + 3.8);
    const p1 = 50000.0 / 13.0 * eHue * this.position[5] * this.position[3];
    const t = p1 * Math.sqrt(a * a + b * b) / (u + 0.305);
    const alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, this.position[0]), 0.73);
    const c = alpha * Math.sqrt(j / 100.0);
    const m = c * this.position[8];
    const s = 50.0 * Math.sqrt(alpha * this.position[4] / (this.position[1] + 4.0));
    const jstar = (1.0 + 100.0 * 0.007) * j / (1.0 + 0.007 * j);
    const mstar = 1.0 / 0.0228 * Math.log(1.0 + 0.0228 * m);
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new _cam16__WEBPACK_IMPORTED_MODULE_0__["default"](hue, c, j, q, m, s, jstar, astar, bstar);
  };
}

/***/ },

/***/ "b3343415bd1d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _theme_builder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d45e1e8d65ea");
/*
 * Main JS file for including JS for component.
 */


/***/ },

/***/ "853e8cba90b9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Mixed)
/* harmony export */ });
/* harmony import */ var _helpers_theme__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cc73a8c3a24d");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ce4c5d18e9c8");
/* harmony import */ var _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a4465fb0d4f3");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2ab7307f2ed7");
/* harmony import */ var _helpers_tonalPalette__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4d3a1f1d5e72");
/* harmony import */ var _helpers_smc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("0ee1af918537");






class Mixed {
  colorBuilder = {};

  constructor(props) {
    this.tfc = {
      0: {
        tone: 100,
        chroma: 0
      },
      1: {
        tone: 98,
        chroma: 5
      },
      2: {
        tone: 96,
        chroma: 9
      },
      3: {
        tone: 94,
        chroma: 12
      },
      4: {
        tone: 92,
        chroma: 15
      },
      5: {
        tone: 90,
        chroma: 20
      },
      6: {
        tone: 87,
        chroma: 25
      },
      7: {
        tone: 80,
        chroma: 36
      },
      8: {
        tone: 70,
        chroma: 40
      },
      9: {
        tone: 60,
        chroma: 50
      },
      10: {
        tone: 50,
        chroma: 55
      },
      11: {
        tone: 40,
        chroma: 54
      },
      12: {
        tone: 30,
        chroma: 46
      },
      13: {
        tone: 22,
        chroma: 39
      },
      14: {
        tone: 20,
        chroma: 37
      },
      15: {
        tone: 18,
        chroma: 33
      },
      16: {
        tone: 14,
        chroma: 29
      },
      17: {
        tone: 10,
        chroma: 28
      },
      18: {
        tone: 6,
        chroma: 24
      },
      19: {
        tone: 0,
        chroma: 0
      }
    };
    this.colors = props.colors;
    this.secondary = props.secondary;
    this.tonals = {};
    this.secondColors = {};
    this.additionalColors = {};
    this.initPalettes();
  }

  generateTypes(alias, hue) {
    this.secondColors[alias] = {};

    for (let k in this.tfc) {
      const type = this.tfc[k];
      this.secondColors[alias][k] = {
        tone: type.tone,
        chroma: type.chroma,
        color: _helpers_tonalPalette__WEBPACK_IMPORTED_MODULE_4__.TPalette.fHAC(hue, type.chroma).tone(type.tone)
      };
    }
  }

  initPalettes() {
    const main = this.colors['main'];

    for (let k in this.colors) {
      if (k === 'main') {
        const mainColor = this.colors[k];
        this.colorBuilder = new _theme__WEBPACK_IMPORTED_MODULE_3__["default"]({
          name: mainColor.name || false,
          argb: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.makeArgb)(mainColor.color),
          c: mainColor.c,
          h: mainColor.h,
          t: mainColor.t,
          secondary: this.secondary
        });
        const tonals = _helpers_theme__WEBPACK_IMPORTED_MODULE_0__.Theme.getTonal((0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.makeArgb)(mainColor.color), mainColor.tonal, '');
        Object.keys(tonals).map(el => {
          this.tonals[el] = tonals[el];
        });
      } else {
        if (Object.keys(this.colors[k]).length) {
          for (let s in this.colors[k]) {
            const secondColor = this.colors[k][s];
            const color = this.customColor((0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.makeArgb)(main.color), (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.makeArgb)(secondColor.color));
            const smc = new _helpers_smc__WEBPACK_IMPORTED_MODULE_5__.SMC({
              argb: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.makeArgb)(secondColor.color)
            });
            this.generateTypes(secondColor.name, smc.iHue);
            this.tonals[secondColor.name] = _helpers_theme__WEBPACK_IMPORTED_MODULE_0__.Theme.getTonal('', secondColor.tonal, color);
            this.additionalColors[secondColor.name] = {
              light: {
                color: color.tone(40),
                onColor: color.tone(100),
                colorContainer: color.tone(90),
                onColorContainer: color.tone(10)
              },
              dark: {
                color: color.tone(80),
                onColor: color.tone(20),
                colorContainer: color.tone(30),
                onColorContainer: color.tone(90)
              },
              smc: smc,
              color: color
            };
          }
        }
      }
    }
  }

  customColor(source, color) {
    let value = color;
    const from = value;
    const to = source;

    if (color.blend) {
      value = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_2__.Blend.harmonize(from, to);
    }

    const palette = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_2__.CorePalette.of(value, true);
    const tones = palette.a1;
    return tones;
  }

}

/***/ },

/***/ "2ab7307f2ed7"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ColorBuilder)
/* harmony export */ });
/* harmony import */ var _helpers_palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("86073f4268f3");
/* harmony import */ var _helpers_theme__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("cc73a8c3a24d");


class ColorBuilder {
  constructor(props) {
    this.name = props.name;
    this.argb = props.argb;
    this.h = props.h;
    this.c = props.c;
    this.t = props.t;
    this.s = props.secondary;
    this.palette = new _helpers_palette__WEBPACK_IMPORTED_MODULE_0__.Palette({
      argb: this.argb,
      c: this.c,
      h: this.c,
      t: this.t,
      name: this.name,
      image: false,
      secondary: this.s
    });
    return {
      main: this.argb,
      schemes: {
        light: _helpers_theme__WEBPACK_IMPORTED_MODULE_1__.Theme.light(this.argb),
        dark: _helpers_theme__WEBPACK_IMPORTED_MODULE_1__.Theme.dark(this.argb)
      },
      tonals: _helpers_theme__WEBPACK_IMPORTED_MODULE_1__.Theme.getTonal(this.argb),
      palettes: {
        primary: this.palette.main1,
        secondary: this.palette.main2,
        tertiary: this.palette.main3,
        neutral: this.palette.secondary1,
        error: this.palette.error,
        success: this.palette.success,
        info: this.palette.info,
        warning: this.palette.warning,
        ...this.palette.secondaryColors
      },
      secondaryColors: this.palette.secondaryColors,
      colorsSMC: this.palette.mainFullTC,
      newColors: this.palette.newColors,
      types: this.palette.types,
      makeSingleColor: props => {
        return this.palette.singleColorTC(props);
      } // customColors: customColors.map((c) => customColor(source, c)),

    };
  }

  init = () => {
    console.log('init');
    console.log(this);
  };
}

/***/ },

/***/ "db624dd59390"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hex2argb: () => (/* binding */ hex2argb),
/* harmony export */   radX16: () => (/* binding */ radX16),
/* harmony export */   rgba2hex: () => (/* binding */ rgba2hex)
/* harmony export */ });
function rgba2hex(orig) {
  let rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
      alpha = (rgb && rgb[4] || "").trim(),
      hex = rgb ? (rgb[1] | 1 << 8).toString(16).slice(1) + (rgb[2] | 1 << 8).toString(16).slice(1) + (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
  hex = hex + (rgb ? ((alpha !== "" ? alpha : 0o1) * 255 | 1 << 8).toString(16).slice(1) : '');
  return hex.replace('#', '');
}
function radX16(num) {
  return parseInt(num, 16);
}
function hex2argb(hex) {
  let r = 0;
  let g = 0;
  let b = 0;
  const l = hex.length;

  switch (l) {
    case 3:
      r = radX16(hex.slice(0, 1).repeat(2));
      g = radX16(hex.slice(1, 2).repeat(2));
      b = radX16(hex.slice(2, 3).repeat(2));
      break;

    case 6:
      r = radX16(hex.slice(0, 2));
      g = radX16(hex.slice(2, 4));
      b = radX16(hex.slice(4, 6));
      break;

    case 8:
      r = radX16(hex.slice(2, 4));
      g = radX16(hex.slice(4, 6));
      b = radX16(hex.slice(6, 8));
      break;
  }

  return (255 << 24 | (r & 0x0ff) << 16 | (g & 0x0ff) << 8 | b & 0x0ff) >>> 0;
}

/***/ },

/***/ "07d1b93a2bb7"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C_P: () => (/* binding */ C_P),
/* harmony export */   L_F_S_D: () => (/* binding */ L_F_S_D),
/* harmony export */   STX: () => (/* binding */ STX),
/* harmony export */   S_D_F_L: () => (/* binding */ S_D_F_L),
/* harmony export */   S_O_D: () => (/* binding */ S_O_D),
/* harmony export */   S_T_X: () => (/* binding */ S_T_X),
/* harmony export */   WP65: () => (/* binding */ WP65),
/* harmony export */   XTS: () => (/* binding */ XTS),
/* harmony export */   Y_F_L: () => (/* binding */ Y_F_L),
/* harmony export */   aL: () => (/* binding */ aL),
/* harmony export */   bL: () => (/* binding */ bL),
/* harmony export */   d65: () => (/* binding */ d65),
/* harmony export */   dL: () => (/* binding */ dL),
/* harmony export */   isDark: () => (/* binding */ isDark),
/* harmony export */   position: () => (/* binding */ position),
/* harmony export */   sR: () => (/* binding */ sR)
/* harmony export */ });
/* harmony import */ var _math_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("710690b9ec6a");

const STX = [[0.41233895, 0.35762064, 0.18051042], [0.2126, 0.7152, 0.0722], [0.01932141, 0.11916382, 0.95034478]];
const bL = 50.0;
const sR = 2.0;
const dL = false;

const setAl = (Lstar = 50.0) => {
  const g = 100.0;
  const res = (Lstar + 16.0) / 116.0;
  const e = 216.0 / 24389.0;
  const kappa = 24389.0 / 27.0;
  const degree = res ** 3;

  if (degree > e) {
    return g * degree;
  } else {
    return g * (116 * res - 16) / kappa;
  }
};

const aL = 200.0 / Math.PI * setAl() / 100.0;
const d65 = [95.047, 100.0, 108.883];
const XTS = [[3.2413774792388685, -1.5376652402851851, -0.49885366846268053], [-0.9691452513005321, 1.8758853451067872, 0.04156585616912061], [0.05562093689691305, -0.20395524564742123, 1.0571799111220335]];
const S_D_F_L = [[0.001200833568784504, 0.002389694492170889, 0.0002795742885861124], [0.0005891086651375999, 0.0029785502573438758, 0.0003270666104008398], [0.00010146692491640572, 0.0005364214359186694, 0.0032979401770712076]];
const S_O_D = {
  desired: 4,
  fallbackColorARGB: 0xff4285f4,
  filter: true
};
const S_T_X = [[0.41233895, 0.35762064, 0.18051042], [0.2126, 0.7152, 0.0722], [0.01932141, 0.11916382, 0.95034478]];
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const Y_F_L = [0.2126, 0.7152, 0.0722];
const C_P = [0.015176349177441876, 0.045529047532325624, 0.07588174588720938, 0.10623444424209313, 0.13658714259697685, 0.16693984095186062, 0.19729253930674434, 0.2276452376616281, 0.2579979360165119, 0.28835063437139563, 0.3188300904430532, 0.350925934958123, 0.3848314933096426, 0.42057480301049466, 0.458183274052838, 0.4976837250274023, 0.5391024159806381, 0.5824650784040898, 0.6277969426914107, 0.6751227633498623, 0.7244668422128921, 0.775853049866786, 0.829304845476233, 0.8848452951698498, 0.942497089126609, 1.0022825574869039, 1.0642236851973577, 1.1283421258858297, 1.1946592148522128, 1.2631959812511864, 1.3339731595349034, 1.407011200216447, 1.4823302800086415, 1.5599503113873272, 1.6398909516233677, 1.7221716113234105, 1.8068114625156377, 1.8938294463134073, 1.9832442801866852, 2.075074464868551, 2.1693382909216234, 2.2660538449872063, 2.36523901573795, 2.4669114995532007, 2.5710888059345764, 2.6777882626779785, 2.7870270208169257, 2.898822059350997, 3.0131901897720907, 3.1301480604002863, 3.2497121605402226, 3.3718988244681087, 3.4967242352587946, 3.624204428461639, 3.754355295633311, 3.887192587735158, 4.022731918402185, 4.160988767090289, 4.301978482107941, 4.445716283538092, 4.592217266055746, 4.741496401646282, 4.893568542229298, 5.048448422192488, 5.20615066083972, 5.3666897647573375, 5.5300801301023865, 5.696336044816294, 5.865471690767354, 6.037501145825082, 6.212438385869475, 6.390297286737924, 6.571091626112461, 6.7548350853498045, 6.941541251256611, 7.131223617812143, 7.323895587840543, 7.5195704746346665, 7.7182615035334345, 7.919981813454504, 8.124744458384042, 8.332562408825165, 8.543448553206703, 8.757415699253682, 8.974476575321063, 9.194643831691977, 9.417930041841839, 9.644347703669503, 9.873909240696694, 10.106627003236781, 10.342513269534024, 10.58158024687427, 10.8238400726681, 11.069304815507364, 11.317986476196008, 11.569896988756009, 11.825048221409341, 12.083451977536606, 12.345119996613247, 12.610063955123938, 12.878295467455942, 13.149826086772048, 13.42466730586372, 13.702830557985108, 13.984327217668513, 14.269168601521828, 14.55736596900856, 14.848930523210871, 15.143873411576273, 15.44220572664832, 15.743938506781891, 16.04908273684337, 16.35764934889634, 16.66964922287304, 16.985093187232053, 17.30399201960269, 17.62635644741625, 17.95219714852476, 18.281524751807332, 18.614349837764564, 18.95068293910138, 19.290534541298456, 19.633915083172692, 19.98083495742689, 20.331304511189067, 20.685334046541502, 21.042933821039977, 21.404114048223256, 21.76888489811322, 22.137256497705877, 22.50923893145328, 22.884842241736916, 23.264076429332462, 23.6469514538663, 24.033477234264016, 24.42366364919083, 24.817520537484558, 25.21505769858089, 25.61628489293138, 26.021211842414342, 26.429848230738664, 26.842203703840827, 27.258287870275353, 27.678110301598522, 28.10168053274597, 28.529008062403893, 28.96010235337422, 29.39497283293396, 29.83362889318845, 30.276079891419332, 30.722335150426627, 31.172403958865512, 31.62629557157785, 32.08401920991837, 32.54558406207592, 33.010999283389665, 33.4802739966603, 33.953417292456834, 34.430438229418264, 34.911345834551085, 35.39614910352207, 35.88485700094671, 36.37747846067349, 36.87402238606382, 37.37449765026789, 37.87891309649659, 38.38727753828926, 38.89959975977785, 39.41588851594697, 39.93615253289054, 40.460400508064545, 40.98864111053629, 41.520882981230194, 42.05713473317016, 42.597404951718396, 43.141702194811224, 43.6900349931913, 44.24241185063697, 44.798841244188324, 45.35933162437017, 45.92389141541209, 46.49252901546552, 47.065252796817916, 47.64207110610409, 48.22299226451468, 48.808024568002054, 49.3971762874833, 49.9904556690408, 50.587870934119984, 51.189430279724725, 51.79514187861014, 52.40501387947288, 53.0190544071392, 53.637271562750364, 54.259673423945976, 54.88626804504493, 55.517063457223934, 56.15206766869424, 56.79128866487574, 57.43473440856916, 58.08241284012621, 58.734331877617365, 59.39049941699807, 60.05092333227251, 60.715611475655585, 61.38457167773311, 62.057811747619894, 62.7353394731159, 63.417162620860914, 64.10328893648692, 64.79372614476921, 65.48848194977529, 66.18756403501224, 66.89098006357258, 67.59873767827808, 68.31084450182222, 69.02730813691093, 69.74813616640164, 70.47333615344107, 71.20291564160104, 71.93688215501312, 72.67524319850172, 73.41800625771542, 74.16517879925733, 74.9167682708136, 75.67278210128072, 76.43322770089146, 77.1981124613393, 77.96744375590167, 78.74122893956174, 79.51947534912904, 80.30219030335869, 81.08938110306934, 81.88105503125999, 82.67721935322541, 83.4778813166706, 84.28304815182372, 85.09272707154808, 85.90692527145302, 86.72564993000343, 87.54890820862819, 88.3767072518277, 89.2090541872801, 90.04595612594655, 90.88742016217518, 91.73345337380438, 92.58406282226491, 93.43925555268066, 94.29903859396902, 95.16341895893969, 96.03240364439274, 96.9059996312159, 97.78421388448044, 98.6670533535366, 99.55452497210776];
const L_F_S_D = [[1373.2198709594231, -1100.4251190754821, -7.278681089101213], [-271.815969077903, 559.6580465940733, -32.46047482791194], [1.9622899599665666, -57.173814538844006, 308.7233197812385]];
const WP65 = [95.047, 100.0, 108.883];

const makeRGB = () => {
  const red = d65[0] * 0.401288 + d65[1] * 0.650173 + d65[2] * -0.051461;
  const green = d65[0] * -0.250268 + d65[1] * 1.204414 + d65[2] * 0.045854;
  const blue = d65[0] * -0.002079 + d65[1] * 0.048952 + d65[2] * 0.953127;
  return [red, green, blue];
};

const makeRGBD = (rgb, d) => {
  return [d * (100.0 / rgb[0]) + 1.0 - d, d * (100.0 / rgb[1]) + 1.0 - d, d * (100.0 / rgb[2]) + 1.0 - d];
};

const makeRitems = (fl, rgbd, rgb) => {
  const rg1 = Math.pow(fl * rgbd[0] * rgb[0] / 100.0, 0.42);
  const rg2 = Math.pow(fl * rgbd[1] * rgb[1] / 100.0, 0.42);
  const rg3 = Math.pow(fl * rgbd[2] * rgb[2] / 100.0, 0.42);
  return [400.0 * rg1 / (rg1 + 27.13), 400.0 * rg2 / (rg2 + 27.13), 400.0 * rg3 / (rg3 + 27.13)];
};

const makePosition = () => {
  const rgb = makeRGB();
  const f = 0.8 + sR / 10.0;
  let b1 = f >= 0.9 ? (0,_math_utils__WEBPACK_IMPORTED_MODULE_0__.lerp)(0.59, 0.69, (f - 0.9) * 10.0) : (0,_math_utils__WEBPACK_IMPORTED_MODULE_0__.lerp)(0.525, 0.59, (f - 0.8) * 10.0);
  let d = dL ? 1.0 : f * (1.0 - 1.0 / 3.6 * Math.exp((-aL - 42.0) / 92.0));
  d = d > 1.0 ? 1.0 : d < 0.0 ? 0.0 : d;
  let b2 = f,
      b3 = setAl(bL) / d65[1],
      b4 = 1.48 + Math.sqrt(b3),
      b5 = 0.725 / Math.pow(b3, 0.2);
  const rgbd = makeRGBD(rgb, d);
  const k = 1.0 / (5.0 * aL + 1.0);
  const k4 = k * k * k * k;
  const k4F = 1.0 - k4;
  const fl = k4 * aL + 0.1 * k4F * k4F * Math.cbrt(5.0 * aL);
  const rgbA = makeRitems(fl, rgbd, rgb);
  let b7 = (2.0 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * b5,
      b8 = Math.pow(fl, 0.25); // TODO - возможно проблема из-за замены NBB и NCB на NBB (this.b5)

  return [b3, b7, b5, b5, b1, b2, rgbd, fl, b8, b4];
};

const position = makePosition();

/***/ },

/***/ "ce4c5d18e9c8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aFA: () => (/* binding */ aFA),
/* harmony export */   aFl: () => (/* binding */ aFl),
/* harmony export */   applyTheme: () => (/* binding */ applyTheme),
/* harmony export */   argbFromLinrgb: () => (/* binding */ argbFromLinrgb),
/* harmony export */   argbFromLstar: () => (/* binding */ argbFromLstar),
/* harmony export */   argbFromRgb: () => (/* binding */ argbFromRgb),
/* harmony export */   argbFromXyz: () => (/* binding */ argbFromXyz),
/* harmony export */   bFA: () => (/* binding */ bFA),
/* harmony export */   buildTheme: () => (/* binding */ buildTheme),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   delinearized: () => (/* binding */ delinearized),
/* harmony export */   gFA: () => (/* binding */ gFA),
/* harmony export */   generateRandomColor: () => (/* binding */ generateRandomColor),
/* harmony export */   generateTheme: () => (/* binding */ generateTheme),
/* harmony export */   getColor: () => (/* binding */ getColor),
/* harmony export */   getColorFromTonal: () => (/* binding */ getColorFromTonal),
/* harmony export */   getPaletteFromImage: () => (/* binding */ getPaletteFromImage),
/* harmony export */   getSecondColors: () => (/* binding */ getSecondColors),
/* harmony export */   getSingleThemeColor: () => (/* binding */ getSingleThemeColor),
/* harmony export */   getSmc: () => (/* binding */ getSmc),
/* harmony export */   hexFromArgb: () => (/* binding */ hexFromArgb),
/* harmony export */   hexToRgb: () => (/* binding */ hexToRgb),
/* harmony export */   lFa: () => (/* binding */ lFa),
/* harmony export */   labF: () => (/* binding */ labF),
/* harmony export */   labInvf: () => (/* binding */ labInvf),
/* harmony export */   linearized: () => (/* binding */ linearized),
/* harmony export */   lstarFromArgb: () => (/* binding */ lstarFromArgb),
/* harmony export */   makeArgb: () => (/* binding */ makeArgb),
/* harmony export */   rFA: () => (/* binding */ rFA),
/* harmony export */   xyzFromArgb: () => (/* binding */ xyzFromArgb),
/* harmony export */   yFromLstar: () => (/* binding */ yFromLstar)
/* harmony export */ });
/* harmony import */ var _math_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("710690b9ec6a");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("07d1b93a2bb7");
/* harmony import */ var _colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("db624dd59390");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2ab7307f2ed7");
/* harmony import */ var _helpers_image_results__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("789aa2ede179");
/* harmony import */ var _helpers_quantize_quantizer_celebi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("3fa91098d5c9");
/* harmony import */ var _mixed__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("853e8cba90b9");
/* harmony import */ var _helpers_palette__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("86073f4268f3");
/* harmony import */ var _helpers_smc__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0ee1af918537");
/* harmony import */ var _helpers_tonalPalette__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("4d3a1f1d5e72");
/* harmony import */ var _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("a4465fb0d4f3");






 // Use the browser build to avoid Node-specific paths (sharp/toBuffer, Buffer, etc.).





function lstarFromArgb(argb) {
  const y = xyzFromArgb(argb)[1];
  return 116.0 * labF(y / 100.0) - 16.0;
}
function argbFromLstar(lstar) {
  const y = yFromLstar(lstar);
  const component = delinearized(y);
  return argbFromRgb(component, component, component);
}
function delinearized(rgbComponent) {
  const normalized = rgbComponent / 100.0;
  let delinearized = 0.0;

  if (normalized <= 0.0031308) {
    delinearized = normalized * 12.92;
  } else {
    delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
  }

  return _math_utils__WEBPACK_IMPORTED_MODULE_0__.clampInt(0, 255, Math.round(delinearized * 255.0));
}
function argbFromRgb(red, green, blue) {
  return (255 << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255) >>> 0;
}
function yFromLstar(lstar) {
  return 100.0 * labInvf((lstar + 16.0) / 116.0);
}
function labInvf(ft) {
  const e = 216.0 / 24389.0;
  const kappa = 24389.0 / 27.0;
  const ft3 = ft * ft * ft;

  if (ft3 > e) {
    return ft3;
  } else {
    return (116 * ft - 16) / kappa;
  }
}
function xyzFromArgb(argb) {
  const r = linearized(rFA(argb));
  const g = linearized(gFA(argb));
  const b = linearized(bFA(argb));
  return _math_utils__WEBPACK_IMPORTED_MODULE_0__.matrixMultiply([r, g, b], _constants__WEBPACK_IMPORTED_MODULE_1__.STX);
}
function linearized(rgbComponent) {
  const normalized = rgbComponent / 255.0;

  if (normalized <= 0.040449936) {
    return normalized / 12.92 * 100.0;
  } else {
    return Math.pow((normalized + 0.055) / 1.055, 2.4) * 100.0;
  }
}
function labF(t) {
  const e = 216.0 / 24389.0;
  const kappa = 24389.0 / 27.0;

  if (t > e) {
    return Math.pow(t, 1.0 / 3.0);
  } else {
    return (kappa * t + 16) / 116;
  }
}
function argbFromLinrgb(linrgb) {
  const r = delinearized(linrgb[0]);
  const g = delinearized(linrgb[1]);
  const b = delinearized(linrgb[2]);
  return argbFromRgb(r, g, b);
}
function getColor(h, t, c, hexes = false) {
  return new _helpers_palette__WEBPACK_IMPORTED_MODULE_7__.ColorPalette({
    hue: +h,
    chroma: +c,
    tonal: +t,
    hexes: hexes
  });
}
function aFA(argb) {
  return argb >> 24 & 255;
}
function rFA(argb) {
  return argb >> 16 & 255;
}
function gFA(argb) {
  return argb >> 8 & 255;
}
function bFA(argb) {
  return argb & 255;
}
function generateTheme(theme, dark) {
  const body = document.body;
  theme = dark ? theme.dark : theme.light;
  theme.forEach(item => {
    body.style.setProperty(item[0], item[1]);
  });
}
function applyTheme(theme, options) {
  const target = options?.target || document.body;
  const isDark = options?.dark ?? false;
  let scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  scheme = scheme.toJSON();

  if (options.additionalColors) {
    for (let k in options.additionalColors) {
      const item = options.additionalColors[k];
      const custom = isDark ? item.dark : item.light;
      setSchemeProperties(target, custom, '', k);
    }
  }

  if (options.tonal) {
    setTonalProperties(target, options.tonal);
  } // if(theme.tonals) {
  //     setTonalProperties(target, theme.tonals)
  // }


  setSchemeProperties(target, scheme);

  if (options?.brightnessSuffix) {
    setSchemeProperties(target, theme.schemes.dark, '-dark');
    setSchemeProperties(target, theme.schemes.light, '-light');
  }

  if (options?.paletteTones) {
    const tones = options?.paletteTones ?? [];

    for (const [key, palette] of Object.entries(theme.palettes)) {
      const paletteKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

      for (const tone of tones) {
        const token = `--md-ref-palette-${paletteKey}-${paletteKey}${tone}`;
        const color = hexFromArgb(palette.tone(tone));
        target.style.setProperty(token, color);
      }
    }
  }

  makePrimarySurface(target);
}
function hexToRgb(hex) {
  var arrBuff = new ArrayBuffer(4);
  var vw = new DataView(arrBuff);
  vw.setUint32(0, parseInt(hex, 16), false);
  var arrByte = new Uint8Array(arrBuff);
  return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];
}
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
          args = arguments;

    const later = () => {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
function hexFromArgb(argb, clear = false) {
  const r = rFA(argb);
  const g = gFA(argb);
  const b = bFA(argb);
  const outParts = [r.toString(16), g.toString(16), b.toString(16)]; // Pad single-digit output values

  for (const [i, part] of outParts.entries()) {
    if (part.length === 1) {
      outParts[i] = '0' + part;
    }
  }

  return clear ? outParts.join('') : '#' + outParts.join('');
}

function makePrimarySurface(target) {
  target.style.setProperty('--md-sys-color-surface-1', `rgb(var(--md-sys-color-primary-rgb) / 0.05)`);
  target.style.setProperty('--md-sys-color-surface-2', `rgb(var(--md-sys-color-primary-rgb) / 0.15)`);
}

function setTonalProperties(target, tonals) {
  for (let k in tonals) {
    for (let g in tonals[k]) {
      const name = `--md-sys-tonal-${k}-${g}`;
      const color = hexFromArgb(tonals[k][g]);
      target.style.setProperty(name, color);
    }
  }
}

function setSchemeProperties(target, scheme, suffix = '', colorKey = '') {
  for (const [key, value] of Object.entries(scheme)) {
    const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const color = hexFromArgb(value);
    const name = `--sf-sui-${colorKey.length ? colorKey + '-' : ''}${token}${suffix}`;
    let rgbColor = hexToRgb(hexFromArgb(value, true));
    rgbColor = rgbColor.split(',');
    rgbColor = rgbColor.join(' ');
    target.style.setProperty(name, color);
    target.style.setProperty(name + '-rgb', rgbColor);
  }
}

const getPaletteFromImage = async image => {
  const imageArray = await new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const callback = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      let rect = [0, 0, image.width, image.height];
      const area = image.dataset['area'];

      if (area && /^\d+(\s*,\s*\d+){3}$/.test(area)) {
        rect = area.split(/\s*,\s*/).map(s => {
          return parseInt(s, 10);
        });
      }

      const [sx, sy, sw, sh] = rect;
      let imageData = context.getImageData(sx, sy, sw, sh).data;
      resolve(imageData);
    };

    if (image.complete) {
      callback();
    } else {
      image.onload = callback;
    }
  });
  const pixels = [];

  for (let i = 0; i < imageArray.length; i += 4) {
    const r = imageArray[i];
    const g = imageArray[i + 1];
    const b = imageArray[i + 2];
    const a = imageArray[i + 3];

    if (a < 255) {
      continue;
    }

    const argb = argbFromRgb(r, g, b);
    pixels.push(argb);
  }

  const result = _helpers_quantize_quantizer_celebi__WEBPACK_IMPORTED_MODULE_5__.QuantizerCelebi.quantize(pixels, 128);
  const ranked = _helpers_image_results__WEBPACK_IMPORTED_MODULE_4__.ImageResult.score(result);
  return ranked[0];
};
function lFa(argb) {
  const linearR = linearized(rFA(argb));
  const linearG = linearized(gFA(argb));
  const linearB = linearized(bFA(argb));
  const x = _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[0][0] * linearR + _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[0][1] * linearG + _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[0][2] * linearB;
  const y = _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[1][0] * linearR + _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[1][1] * linearG + _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[1][2] * linearB;
  const z = _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[2][0] * linearR + _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[2][1] * linearG + _constants__WEBPACK_IMPORTED_MODULE_1__.S_T_X[2][2] * linearB;
  const xNormalized = x / _constants__WEBPACK_IMPORTED_MODULE_1__.d65[0];
  const yNormalized = y / _constants__WEBPACK_IMPORTED_MODULE_1__.d65[1];
  const zNormalized = z / _constants__WEBPACK_IMPORTED_MODULE_1__.d65[2];
  const fx = labF(xNormalized);
  const fy = labF(yNormalized);
  const fz = labF(zNormalized);
  const l = 116.0 * fy - 16;
  const a = 500.0 * (fx - fy);
  const b = 200.0 * (fy - fz);
  return [l, a, b];
}
function aFl(l, a, b) {
  const fy = (l + 16.0) / 116.0;
  const fx = a / 500.0 + fy;
  const fz = fy - b / 200.0;
  const xNormalized = labInvf(fx);
  const yNormalized = labInvf(fy);
  const zNormalized = labInvf(fz);
  const x = xNormalized * _constants__WEBPACK_IMPORTED_MODULE_1__.d65[0];
  const y = yNormalized * _constants__WEBPACK_IMPORTED_MODULE_1__.d65[1];
  const z = zNormalized * _constants__WEBPACK_IMPORTED_MODULE_1__.d65[2];
  return argbFromXyz(x, y, z);
}
function argbFromXyz(x, y, z) {
  const linearR = _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[0][0] * x + _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[0][1] * y + _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[0][2] * z;
  const linearG = _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[1][0] * x + _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[1][1] * y + _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[1][2] * z;
  const linearB = _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[2][0] * x + _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[2][1] * y + _constants__WEBPACK_IMPORTED_MODULE_1__.XTS[2][2] * z;
  const r = delinearized(linearR);
  const g = delinearized(linearG);
  const b = delinearized(linearB);
  return argbFromRgb(r, g, b);
}
function makeArgb(color) {
  const rgba = (0,_colors__WEBPACK_IMPORTED_MODULE_2__.rgba2hex)(color);
  return (0,_colors__WEBPACK_IMPORTED_MODULE_2__.hex2argb)(rgba);
}
async function getSingleThemeColor(hg, name, secondary = {}) {
  let arr = {
    main: {
      name: name,
      color: hg.hex,
      h: hg.h,
      c: hg.c,
      tonal: [0, 6, 10, 14, 18, 20, 22, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 96, 98, 100]
    },
    secondary: secondary
  };
  let colors = buildTheme({
    colors: arr,
    mixed: true
  });
  return colors.then(e => {
    let needColors = { ...e.colorBuilder.colorsSMC,
      ...e.secondColors
    };
    return {
      [name]: needColors[name]
    };
  });
}
function getColorFromTonal(item) {
  let {
    tonals,
    name,
    hue,
    chroma
  } = item;
  let obj = {};

  for (let k in tonals) {
    let t = tonals[k];
    obj[tonals[k]] = hexFromArgb(_helpers_smc__WEBPACK_IMPORTED_MODULE_8__.SMC.from(hue, chroma, +t).argb);
  }

  return {
    [name]: obj
  };
}
const getSmc = async props => {
  return new _helpers_smc__WEBPACK_IMPORTED_MODULE_8__.SMC({
    argb: props.argb
  });
};
const generateRandomColor = () => {
  let randomColorString = "#";
  const arrayOfColorFunctions = "0123456789abcdef";

  for (let x = 0; x < 6; x++) {
    let index = Math.floor(Math.random() * 16);
    let value = arrayOfColorFunctions[index];
    randomColorString += value;
  }

  return randomColorString;
};
const getSecondColors = async ({
  colors
}) => {
  // TPalette.fHAC(this.hue, Math.min(this.chroma / 12, 4))
  let palettes = {};
  Object.keys(colors).map(i => {
    let mainColor = _material_material_color_utilities__WEBPACK_IMPORTED_MODULE_10__.Hct.fromInt((0,_colors__WEBPACK_IMPORTED_MODULE_2__.hex2argb)(colors[i].color.replace('#', '')));
    palettes[i] = _helpers_tonalPalette__WEBPACK_IMPORTED_MODULE_9__.TPalette.fHAC(mainColor.internalHue, mainColor.internalChroma);
  });
  return palettes;
};
const buildTheme = async props => {
  let color;

  if (props.mixed) {
    const mixed = new _mixed__WEBPACK_IMPORTED_MODULE_6__["default"]({
      colors: props.colors,
      secondary: props.secondary
    });
    return mixed;
  } else {
    if (!props.image && !props.hex) {
      color = props.argb ? props.argb : makeArgb(props.color);
    } else if (props.hex) {
      return _helpers_palette__WEBPACK_IMPORTED_MODULE_7__.ColorPalette.getHue(props.hex);
    } else {
      color = await getPaletteFromImage(props.image);
      let hex = hexFromArgb(color, true);
      return hex;
    }

    return new _theme__WEBPACK_IMPORTED_MODULE_3__["default"]({
      argb: color
    });
  }
};

/***/ },

/***/ "710690b9ec6a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clampDouble: () => (/* binding */ clampDouble),
/* harmony export */   clampInt: () => (/* binding */ clampInt),
/* harmony export */   differenceDegrees: () => (/* binding */ differenceDegrees),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   matrixMultiply: () => (/* binding */ matrixMultiply),
/* harmony export */   rotationDirection: () => (/* binding */ rotationDirection),
/* harmony export */   sanitizeDegreesDouble: () => (/* binding */ sanitizeDegreesDouble),
/* harmony export */   sanitizeDegreesInt: () => (/* binding */ sanitizeDegreesInt),
/* harmony export */   signum: () => (/* binding */ signum)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.

/**
 * Utility methods for mathematical operations.
 */

/**
 * The signum function.
 *
 * @return 1 if num > 0, -1 if num < 0, and 0 if num = 0
 */
function signum(num) {
  if (num < 0) {
    return -1;
  } else if (num === 0) {
    return 0;
  } else {
    return 1;
  }
}
/**
 * The linear interpolation function.
 *
 * @return start if amount = 0 and stop if amount = 1
 */

function lerp(start, stop, amount) {
  return (1.0 - amount) * start + amount * stop;
}
/**
 * Clamps an integer between two integers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */

function clampInt(min, max, input) {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  }

  return input;
}
/**
 * Clamps an integer between two floating-point numbers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */

function clampDouble(min, max, input) {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  }

  return input;
}
/**
 * Sanitizes a degree measure as an integer.
 *
 * @return a degree measure between 0 (inclusive) and 360
 * (exclusive).
 */

function sanitizeDegreesInt(degrees) {
  degrees = degrees % 360;

  if (degrees < 0) {
    degrees = degrees + 360;
  }

  return degrees;
}
/**
 * Sanitizes a degree measure as a floating-point number.
 *
 * @return a degree measure between 0.0 (inclusive) and 360.0
 * (exclusive).
 */

function sanitizeDegreesDouble(degrees) {
  degrees = degrees % 360.0;

  if (degrees < 0) {
    degrees = degrees + 360.0;
  }

  return degrees;
}
/**
 * Sign of direction change needed to travel from one angle to
 * another.
 *
 * For angles that are 180 degrees apart from each other, both
 * directions have the same travel distance, so either direction is
 * shortest. The value 1.0 is returned in this case.
 *
 * @param from The angle travel starts from, in degrees.
 * @param to The angle travel ends at, in degrees.
 * @return -1 if decreasing from leads to the shortest travel
 * distance, 1 if increasing from leads to the shortest travel
 * distance.
 */

function rotationDirection(from, to) {
  const increasingDifference = sanitizeDegreesDouble(to - from);
  return increasingDifference <= 180.0 ? 1.0 : -1.0;
}
/**
 * Distance of two points on a circle, represented using degrees.
 */

function differenceDegrees(a, b) {
  return 180.0 - Math.abs(Math.abs(a - b) - 180.0);
}
/**
 * Multiplies a 1x3 row vector with a 3x3 matrix.
 */

function matrixMultiply(row, matrix) {
  const a = row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2];
  const b = row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2];
  const c = row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2];
  return [a, b, c];
}

/***/ },

/***/ "d7c1d03a3f73"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "95860925e668"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Blend: () => (/* binding */ Blend)
/* harmony export */ });
/* harmony import */ var _hct_cam16_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bcd1e8163538");
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("3cdc1bb3fe85");
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.




// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable:class-as-namespace
/**
 * Functions for blending in HCT and CAM16.
 */
class Blend {
    /**
     * Blend the design color's HCT hue towards the key color's HCT
     * hue, in a way that leaves the original color recognizable and
     * recognizably shifted towards the key color.
     *
     * @param designColor ARGB representation of an arbitrary color.
     * @param sourceColor ARGB representation of the main theme color.
     * @return The design color with a hue shifted towards the
     * system's color, a slightly warmer/cooler variant of the design
     * color's hue.
     */
    static harmonize(designColor, sourceColor) {
        const fromHct = _hct_hct_js__WEBPACK_IMPORTED_MODULE_1__.Hct.fromInt(designColor);
        const toHct = _hct_hct_js__WEBPACK_IMPORTED_MODULE_1__.Hct.fromInt(sourceColor);
        const differenceDegrees = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__.differenceDegrees(fromHct.hue, toHct.hue);
        const rotationDegrees = Math.min(differenceDegrees * 0.5, 15.0);
        const outputHue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeDegreesDouble(fromHct.hue +
            rotationDegrees * _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__.rotationDirection(fromHct.hue, toHct.hue));
        return _hct_hct_js__WEBPACK_IMPORTED_MODULE_1__.Hct.from(outputHue, fromHct.chroma, fromHct.tone).toInt();
    }
    /**
     * Blends hue from one color into another. The chroma and tone of
     * the original color are maintained.
     *
     * @param from ARGB representation of color
     * @param to ARGB representation of color
     * @param amount how much blending to perform; 0.0 >= and <= 1.0
     * @return from, with a hue blended towards to. Chroma and tone
     * are constant.
     */
    static hctHue(from, to, amount) {
        const ucs = Blend.cam16Ucs(from, to, amount);
        const ucsCam = _hct_cam16_js__WEBPACK_IMPORTED_MODULE_0__.Cam16.fromInt(ucs);
        const fromCam = _hct_cam16_js__WEBPACK_IMPORTED_MODULE_0__.Cam16.fromInt(from);
        const blended = _hct_hct_js__WEBPACK_IMPORTED_MODULE_1__.Hct.from(ucsCam.hue, fromCam.chroma, _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_2__.lstarFromArgb(from));
        return blended.toInt();
    }
    /**
     * Blend in CAM16-UCS space.
     *
     * @param from ARGB representation of color
     * @param to ARGB representation of color
     * @param amount how much blending to perform; 0.0 >= and <= 1.0
     * @return from, blended towards to. Hue, chroma, and tone will
     * change.
     */
    static cam16Ucs(from, to, amount) {
        const fromCam = _hct_cam16_js__WEBPACK_IMPORTED_MODULE_0__.Cam16.fromInt(from);
        const toCam = _hct_cam16_js__WEBPACK_IMPORTED_MODULE_0__.Cam16.fromInt(to);
        const fromJ = fromCam.jstar;
        const fromA = fromCam.astar;
        const fromB = fromCam.bstar;
        const toJ = toCam.jstar;
        const toA = toCam.astar;
        const toB = toCam.bstar;
        const jstar = fromJ + (toJ - fromJ) * amount;
        const astar = fromA + (toA - fromA) * amount;
        const bstar = fromB + (toB - fromB) * amount;
        return _hct_cam16_js__WEBPACK_IMPORTED_MODULE_0__.Cam16.fromUcs(jstar, astar, bstar).toInt();
    }
}
//# sourceMappingURL=blend.js.map

/***/ },

/***/ "517e90600719"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Contrast: () => (/* binding */ Contrast)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable:class-as-namespace


/**
 * Utility methods for calculating contrast given two colors, or calculating a
 * color given one color and a contrast ratio.
 *
 * Contrast ratio is calculated using XYZ's Y. When linearized to match human
 * perception, Y becomes HCT's tone and L*a*b*'s' L*. Informally, this is the
 * lightness of a color.
 *
 * Methods refer to tone, T in the the HCT color space.
 * Tone is equivalent to L* in the L*a*b* color space, or L in the LCH color
 * space.
 */
class Contrast {
    /**
     * Returns a contrast ratio, which ranges from 1 to 21.
     *
     * @param toneA Tone between 0 and 100. Values outside will be clamped.
     * @param toneB Tone between 0 and 100. Values outside will be clamped.
     */
    static ratioOfTones(toneA, toneB) {
        toneA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.clampDouble(0.0, 100.0, toneA);
        toneB = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.clampDouble(0.0, 100.0, toneB);
        return Contrast.ratioOfYs(_utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(toneA), _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(toneB));
    }
    static ratioOfYs(y1, y2) {
        const lighter = y1 > y2 ? y1 : y2;
        const darker = (lighter === y2) ? y1 : y2;
        return (lighter + 5.0) / (darker + 5.0);
    }
    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns -1 if ratio cannot be achieved with tone parameter.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in -1 being returned.
     * @param ratio Contrast ratio of return value and tone.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
    static lighter(tone, ratio) {
        if (tone < 0.0 || tone > 100.0) {
            return -1.0;
        }
        const darkY = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(tone);
        const lightY = ratio * (darkY + 5.0) - 5.0;
        const realContrast = Contrast.ratioOfYs(lightY, darkY);
        const delta = Math.abs(realContrast - ratio);
        if (realContrast < ratio && delta > 0.04) {
            return -1;
        }
        // Ensure gamut mapping, which requires a 'range' on tone, will still result
        // the correct ratio by darkening slightly.
        const returnValue = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.lstarFromY(lightY) + 0.4;
        if (returnValue < 0 || returnValue > 100) {
            return -1;
        }
        return returnValue;
    }
    /**
     * Returns a tone <= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns -1 if ratio cannot be achieved with tone parameter.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in -1 being returned.
     * @param ratio Contrast ratio of return value and tone.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
    static darker(tone, ratio) {
        if (tone < 0.0 || tone > 100.0) {
            return -1.0;
        }
        const lightY = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(tone);
        const darkY = ((lightY + 5.0) / ratio) - 5.0;
        const realContrast = Contrast.ratioOfYs(lightY, darkY);
        const delta = Math.abs(realContrast - ratio);
        if (realContrast < ratio && delta > 0.04) {
            return -1;
        }
        // Ensure gamut mapping, which requires a 'range' on tone, will still result
        // the correct ratio by darkening slightly.
        const returnValue = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.lstarFromY(darkY) - 0.4;
        if (returnValue < 0 || returnValue > 100) {
            return -1;
        }
        return returnValue;
    }
    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns 100 if ratio cannot be achieved with tone parameter.
     *
     * This method is unsafe because the returned value is guaranteed to be in
     * bounds for tone, i.e. between 0 and 100. However, that value may not reach
     * the ratio with tone. For example, there is no color lighter than T100.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in 100 being returned.
     * @param ratio Desired contrast ratio of return value and tone parameter.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
    static lighterUnsafe(tone, ratio) {
        const lighterSafe = Contrast.lighter(tone, ratio);
        return (lighterSafe < 0.0) ? 100.0 : lighterSafe;
    }
    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns 100 if ratio cannot be achieved with tone parameter.
     *
     * This method is unsafe because the returned value is guaranteed to be in
     * bounds for tone, i.e. between 0 and 100. However, that value may not reach
     * the [ratio with [tone]. For example, there is no color darker than T0.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in 0 being returned.
     * @param ratio Desired contrast ratio of return value and tone parameter.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
    static darkerUnsafe(tone, ratio) {
        const darkerSafe = Contrast.darker(tone, ratio);
        return (darkerSafe < 0.0) ? 0.0 : darkerSafe;
    }
}
//# sourceMappingURL=contrast.js.map

/***/ },

/***/ "c14890e64efd"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DislikeAnalyzer: () => (/* binding */ DislikeAnalyzer)
/* harmony export */ });
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3cdc1bb3fe85");
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable:class-as-namespace
/**
 * Check and/or fix universally disliked colors.
 * Color science studies of color preference indicate universal distaste for
 * dark yellow-greens, and also show this is correlated to distate for
 * biological waste and rotting food.
 *
 * See Palmer and Schloss, 2010 or Schloss and Palmer's Chapter 21 in Handbook
 * of Color Psychology (2015).
 */
class DislikeAnalyzer {
    /**
     * Returns true if a color is disliked.
     *
     * @param hct A color to be judged.
     * @return Whether the color is disliked.
     *
     * Disliked is defined as a dark yellow-green that is not neutral.
     */
    static isDisliked(hct) {
        const huePasses = Math.round(hct.hue) >= 90.0 && Math.round(hct.hue) <= 111.0;
        const chromaPasses = Math.round(hct.chroma) > 16.0;
        const tonePasses = Math.round(hct.tone) < 65.0;
        return huePasses && chromaPasses && tonePasses;
    }
    /**
     * If a color is disliked, lighten it to make it likable.
     *
     * @param hct A color to be judged.
     * @return A new color if the original color is disliked, or the original
     *   color if it is acceptable.
     */
    static fixIfDisliked(hct) {
        if (DislikeAnalyzer.isDisliked(hct)) {
            return _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(hct.hue, hct.chroma, 70.0);
        }
        return hct;
    }
}
//# sourceMappingURL=dislike_analyzer.js.map

/***/ },

/***/ "e25d88b1069e"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContrastCurve: () => (/* binding */ ContrastCurve)
/* harmony export */ });
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A class containing a value that changes with the contrast level.
 *
 * Usually represents the contrast requirements for a dynamic color on its
 * background. The four values correspond to values for contrast levels -1.0,
 * 0.0, 0.5, and 1.0, respectively.
 */
class ContrastCurve {
    /**
     * Creates a `ContrastCurve` object.
     *
     * @param low Value for contrast level -1.0
     * @param normal Value for contrast level 0.0
     * @param medium Value for contrast level 0.5
     * @param high Value for contrast level 1.0
     */
    constructor(low, normal, medium, high) {
        this.low = low;
        this.normal = normal;
        this.medium = medium;
        this.high = high;
    }
    /**
     * Returns the value at a given contrast level.
     *
     * @param contrastLevel The contrast level. 0.0 is the default (normal); -1.0
     *     is the lowest; 1.0 is the highest.
     * @return The value. For contrast ratios, a number between 1.0 and 21.0.
     */
    get(contrastLevel) {
        if (contrastLevel <= -1.0) {
            return this.low;
        }
        else if (contrastLevel < 0.0) {
            return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_0__.lerp(this.low, this.normal, (contrastLevel - (-1)) / 1);
        }
        else if (contrastLevel < 0.5) {
            return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_0__.lerp(this.normal, this.medium, (contrastLevel - 0) / 0.5);
        }
        else if (contrastLevel < 1.0) {
            return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_0__.lerp(this.medium, this.high, (contrastLevel - 0.5) / 0.5);
        }
        else {
            return this.high;
        }
    }
}
//# sourceMappingURL=contrast_curve.js.map

/***/ },

/***/ "10cdd4ea39cc"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DynamicColor: () => (/* binding */ DynamicColor)
/* harmony export */ });
/* harmony import */ var _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("517e90600719");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A color that adjusts itself based on UI state provided by DynamicScheme.
 *
 * Colors without backgrounds do not change tone when contrast changes. Colors
 * with backgrounds become closer to their background as contrast lowers, and
 * further when contrast increases.
 *
 * Prefer static constructors. They require either a hexcode, a palette and
 * tone, or a hue and chroma. Optionally, they can provide a background
 * DynamicColor.
 */
class DynamicColor {
    /**
     * Create a DynamicColor defined by a TonalPalette and HCT tone.
     *
     * @param args Functions with DynamicScheme as input. Must provide a palette
     * and tone. May provide a background DynamicColor and ToneDeltaConstraint.
     */
    static fromPalette(args) {
        return new DynamicColor(args.name ?? '', args.palette, args.tone, args.isBackground ?? false, args.background, args.secondBackground, args.contrastCurve, args.toneDeltaPair);
    }
    /**
     * The base constructor for DynamicColor.
     *
     * _Strongly_ prefer using one of the convenience constructors. This class is
     * arguably too flexible to ensure it can support any scenario. Functional
     * arguments allow  overriding without risks that come with subclasses.
     *
     * For example, the default behavior of adjust tone at max contrast
     * to be at a 7.0 ratio with its background is principled and
     * matches accessibility guidance. That does not mean it's the desired
     * approach for _every_ design system, and every color pairing,
     * always, in every case.
     *
     * @param name The name of the dynamic color. Defaults to empty.
     * @param palette Function that provides a TonalPalette given
     * DynamicScheme. A TonalPalette is defined by a hue and chroma, so this
     * replaces the need to specify hue/chroma. By providing a tonal palette, when
     * contrast adjustments are made, intended chroma can be preserved.
     * @param tone Function that provides a tone, given a DynamicScheme.
     * @param isBackground Whether this dynamic color is a background, with
     * some other color as the foreground. Defaults to false.
     * @param background The background of the dynamic color (as a function of a
     *     `DynamicScheme`), if it exists.
     * @param secondBackground A second background of the dynamic color (as a
     *     function of a `DynamicScheme`), if it
     * exists.
     * @param contrastCurve A `ContrastCurve` object specifying how its contrast
     * against its background should behave in various contrast levels options.
     * @param toneDeltaPair A `ToneDeltaPair` object specifying a tone delta
     * constraint between two colors. One of them must be the color being
     * constructed.
     */
    constructor(name, palette, tone, isBackground, background, secondBackground, contrastCurve, toneDeltaPair) {
        this.name = name;
        this.palette = palette;
        this.tone = tone;
        this.isBackground = isBackground;
        this.background = background;
        this.secondBackground = secondBackground;
        this.contrastCurve = contrastCurve;
        this.toneDeltaPair = toneDeltaPair;
        this.hctCache = new Map();
        if ((!background) && secondBackground) {
            throw new Error(`Color ${name} has secondBackground` +
                `defined, but background is not defined.`);
        }
        if ((!background) && contrastCurve) {
            throw new Error(`Color ${name} has contrastCurve` +
                `defined, but background is not defined.`);
        }
        if (background && !contrastCurve) {
            throw new Error(`Color ${name} has background` +
                `defined, but contrastCurve is not defined.`);
        }
    }
    /**
     * Return a ARGB integer (i.e. a hex code).
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getArgb(scheme) {
        return this.getHct(scheme).toInt();
    }
    /**
     * Return a color, expressed in the HCT color space, that this
     * DynamicColor is under the conditions in scheme.
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getHct(scheme) {
        const cachedAnswer = this.hctCache.get(scheme);
        if (cachedAnswer != null) {
            return cachedAnswer;
        }
        const tone = this.getTone(scheme);
        const answer = this.palette(scheme).getHct(tone);
        if (this.hctCache.size > 4) {
            this.hctCache.clear();
        }
        this.hctCache.set(scheme, answer);
        return answer;
    }
    /**
     * Return a tone, T in the HCT color space, that this DynamicColor is under
     * the conditions in scheme.
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getTone(scheme) {
        const decreasingContrast = scheme.contrastLevel < 0;
        // Case 1: dual foreground, pair of colors with delta constraint.
        if (this.toneDeltaPair) {
            const toneDeltaPair = this.toneDeltaPair(scheme);
            const roleA = toneDeltaPair.roleA;
            const roleB = toneDeltaPair.roleB;
            const delta = toneDeltaPair.delta;
            const polarity = toneDeltaPair.polarity;
            const stayTogether = toneDeltaPair.stayTogether;
            const bg = this.background(scheme);
            const bgTone = bg.getTone(scheme);
            const aIsNearer = (polarity === 'nearer' ||
                (polarity === 'lighter' && !scheme.isDark) ||
                (polarity === 'darker' && scheme.isDark));
            const nearer = aIsNearer ? roleA : roleB;
            const farther = aIsNearer ? roleB : roleA;
            const amNearer = this.name === nearer.name;
            const expansionDir = scheme.isDark ? 1 : -1;
            // 1st round: solve to min, each
            const nContrast = nearer.contrastCurve.get(scheme.contrastLevel);
            const fContrast = farther.contrastCurve.get(scheme.contrastLevel);
            // If a color is good enough, it is not adjusted.
            // Initial and adjusted tones for `nearer`
            const nInitialTone = nearer.tone(scheme);
            let nTone = _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.ratioOfTones(bgTone, nInitialTone) >= nContrast ?
                nInitialTone :
                DynamicColor.foregroundTone(bgTone, nContrast);
            // Initial and adjusted tones for `farther`
            const fInitialTone = farther.tone(scheme);
            let fTone = _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.ratioOfTones(bgTone, fInitialTone) >= fContrast ?
                fInitialTone :
                DynamicColor.foregroundTone(bgTone, fContrast);
            if (decreasingContrast) {
                // If decreasing contrast, adjust color to the "bare minimum"
                // that satisfies contrast.
                nTone = DynamicColor.foregroundTone(bgTone, nContrast);
                fTone = DynamicColor.foregroundTone(bgTone, fContrast);
            }
            if ((fTone - nTone) * expansionDir >= delta) {
                // Good! Tones satisfy the constraint; no change needed.
            }
            else {
                // 2nd round: expand farther to match delta.
                fTone = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.clampDouble(0, 100, nTone + delta * expansionDir);
                if ((fTone - nTone) * expansionDir >= delta) {
                    // Good! Tones now satisfy the constraint; no change needed.
                }
                else {
                    // 3rd round: contract nearer to match delta.
                    nTone = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.clampDouble(0, 100, fTone - delta * expansionDir);
                }
            }
            // Avoids the 50-59 awkward zone.
            if (50 <= nTone && nTone < 60) {
                // If `nearer` is in the awkward zone, move it away, together with
                // `farther`.
                if (expansionDir > 0) {
                    nTone = 60;
                    fTone = Math.max(fTone, nTone + delta * expansionDir);
                }
                else {
                    nTone = 49;
                    fTone = Math.min(fTone, nTone + delta * expansionDir);
                }
            }
            else if (50 <= fTone && fTone < 60) {
                if (stayTogether) {
                    // Fixes both, to avoid two colors on opposite sides of the "awkward
                    // zone".
                    if (expansionDir > 0) {
                        nTone = 60;
                        fTone = Math.max(fTone, nTone + delta * expansionDir);
                    }
                    else {
                        nTone = 49;
                        fTone = Math.min(fTone, nTone + delta * expansionDir);
                    }
                }
                else {
                    // Not required to stay together; fixes just one.
                    if (expansionDir > 0) {
                        fTone = 60;
                    }
                    else {
                        fTone = 49;
                    }
                }
            }
            // Returns `nTone` if this color is `nearer`, otherwise `fTone`.
            return amNearer ? nTone : fTone;
        }
        else {
            // Case 2: No contrast pair; just solve for itself.
            let answer = this.tone(scheme);
            if (this.background == null) {
                return answer; // No adjustment for colors with no background.
            }
            const bgTone = this.background(scheme).getTone(scheme);
            const desiredRatio = this.contrastCurve.get(scheme.contrastLevel);
            if (_contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.ratioOfTones(bgTone, answer) >= desiredRatio) {
                // Don't "improve" what's good enough.
            }
            else {
                // Rough improvement.
                answer = DynamicColor.foregroundTone(bgTone, desiredRatio);
            }
            if (decreasingContrast) {
                answer = DynamicColor.foregroundTone(bgTone, desiredRatio);
            }
            if (this.isBackground && 50 <= answer && answer < 60) {
                // Must adjust
                if (_contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.ratioOfTones(49, bgTone) >= desiredRatio) {
                    answer = 49;
                }
                else {
                    answer = 60;
                }
            }
            if (this.secondBackground) {
                // Case 3: Adjust for dual backgrounds.
                const [bg1, bg2] = [this.background, this.secondBackground];
                const [bgTone1, bgTone2] = [bg1(scheme).getTone(scheme), bg2(scheme).getTone(scheme)];
                const [upper, lower] = [Math.max(bgTone1, bgTone2), Math.min(bgTone1, bgTone2)];
                if (_contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.ratioOfTones(upper, answer) >= desiredRatio &&
                    _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.ratioOfTones(lower, answer) >= desiredRatio) {
                    return answer;
                }
                // The darkest light tone that satisfies the desired ratio,
                // or -1 if such ratio cannot be reached.
                const lightOption = _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.lighter(upper, desiredRatio);
                // The lightest dark tone that satisfies the desired ratio,
                // or -1 if such ratio cannot be reached.
                const darkOption = _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.darker(lower, desiredRatio);
                // Tones suitable for the foreground.
                const availables = [];
                if (lightOption !== -1)
                    availables.push(lightOption);
                if (darkOption !== -1)
                    availables.push(darkOption);
                const prefersLight = DynamicColor.tonePrefersLightForeground(bgTone1) ||
                    DynamicColor.tonePrefersLightForeground(bgTone2);
                if (prefersLight) {
                    return (lightOption < 0) ? 100 : lightOption;
                }
                if (availables.length === 1) {
                    return availables[0];
                }
                return (darkOption < 0) ? 0 : darkOption;
            }
            return answer;
        }
    }
    /**
     * Given a background tone, find a foreground tone, while ensuring they reach
     * a contrast ratio that is as close to [ratio] as possible.
     *
     * @param bgTone Tone in HCT. Range is 0 to 100, undefined behavior when it
     *     falls outside that range.
     * @param ratio The contrast ratio desired between bgTone and the return
     *     value.
     */
    static foregroundTone(bgTone, ratio) {
        const lighterTone = _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.lighterUnsafe(bgTone, ratio);
        const darkerTone = _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.darkerUnsafe(bgTone, ratio);
        const lighterRatio = _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.ratioOfTones(lighterTone, bgTone);
        const darkerRatio = _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_0__.Contrast.ratioOfTones(darkerTone, bgTone);
        const preferLighter = DynamicColor.tonePrefersLightForeground(bgTone);
        if (preferLighter) {
            // This handles an edge case where the initial contrast ratio is high
            // (ex. 13.0), and the ratio passed to the function is that high
            // ratio, and both the lighter and darker ratio fails to pass that
            // ratio.
            //
            // This was observed with Tonal Spot's On Primary Container turning
            // black momentarily between high and max contrast in light mode. PC's
            // standard tone was T90, OPC's was T10, it was light mode, and the
            // contrast value was 0.6568521221032331.
            const negligibleDifference = Math.abs(lighterRatio - darkerRatio) < 0.1 &&
                lighterRatio < ratio && darkerRatio < ratio;
            return lighterRatio >= ratio || lighterRatio >= darkerRatio ||
                negligibleDifference ?
                lighterTone :
                darkerTone;
        }
        else {
            return darkerRatio >= ratio || darkerRatio >= lighterRatio ? darkerTone :
                lighterTone;
        }
    }
    /**
     * Returns whether [tone] prefers a light foreground.
     *
     * People prefer white foregrounds on ~T60-70. Observed over time, and also
     * by Andrew Somers during research for APCA.
     *
     * T60 used as to create the smallest discontinuity possible when skipping
     * down to T49 in order to ensure light foregrounds.
     * Since `tertiaryContainer` in dark monochrome scheme requires a tone of
     * 60, it should not be adjusted. Therefore, 60 is excluded here.
     */
    static tonePrefersLightForeground(tone) {
        return Math.round(tone) < 60.0;
    }
    /**
     * Returns whether [tone] can reach a contrast ratio of 4.5 with a lighter
     * color.
     */
    static toneAllowsLightForeground(tone) {
        return Math.round(tone) <= 49.0;
    }
    /**
     * Adjust a tone such that white has 4.5 contrast, if the tone is
     * reasonably close to supporting it.
     */
    static enableLightForeground(tone) {
        if (DynamicColor.tonePrefersLightForeground(tone) &&
            !DynamicColor.toneAllowsLightForeground(tone)) {
            return 49.0;
        }
        return tone;
    }
}
//# sourceMappingURL=dynamic_color.js.map

/***/ },

/***/ "18c2b362ecf9"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DynamicScheme: () => (/* binding */ DynamicScheme)
/* harmony export */ });
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3cdc1bb3fe85");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6a8d616d58de");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6d41ddc214ee");
/* harmony import */ var _material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bcc70d254bcd");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




/**
 * Constructed by a set of values representing the current UI state (such as
 * whether or not its dark theme, what the theme style is, etc.), and
 * provides a set of TonalPalettes that can create colors that fit in
 * with the theme style. Used by DynamicColor to resolve into a color.
 */
class DynamicScheme {
    constructor(args) {
        this.sourceColorArgb = args.sourceColorArgb;
        this.variant = args.variant;
        this.contrastLevel = args.contrastLevel;
        this.isDark = args.isDark;
        this.sourceColorHct = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(args.sourceColorArgb);
        this.primaryPalette = args.primaryPalette;
        this.secondaryPalette = args.secondaryPalette;
        this.tertiaryPalette = args.tertiaryPalette;
        this.neutralPalette = args.neutralPalette;
        this.neutralVariantPalette = args.neutralVariantPalette;
        this.errorPalette = _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(25.0, 84.0);
    }
    /**
     * Support design spec'ing Dynamic Color by schemes that specify hue
     * rotations that should be applied at certain breakpoints.
     * @param sourceColor the source color of the theme, in HCT.
     * @param hues The "breakpoints", i.e. the hues at which a rotation should
     * be apply.
     * @param rotations The rotation that should be applied when source color's
     * hue is >= the same index in hues array, and <= the hue at the next index
     * in hues array.
     */
    static getRotatedHue(sourceColor, hues, rotations) {
        const sourceHue = sourceColor.hue;
        if (hues.length !== rotations.length) {
            throw new Error(`mismatch between hue length ${hues.length} & rotations ${rotations.length}`);
        }
        if (rotations.length === 1) {
            return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__.sanitizeDegreesDouble(sourceColor.hue + rotations[0]);
        }
        const size = hues.length;
        for (let i = 0; i <= size - 2; i++) {
            const thisHue = hues[i];
            const nextHue = hues[i + 1];
            if (thisHue < sourceHue && sourceHue < nextHue) {
                return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__.sanitizeDegreesDouble(sourceHue + rotations[i]);
            }
        }
        // If this statement executes, something is wrong, there should have been a
        // rotation found using the arrays.
        return sourceHue;
    }
    getArgb(dynamicColor) {
        return dynamicColor.getArgb(this);
    }
    getHct(dynamicColor) {
        return dynamicColor.getHct(this);
    }
    get primaryPaletteKeyColor() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.primaryPaletteKeyColor);
    }
    get secondaryPaletteKeyColor() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.secondaryPaletteKeyColor);
    }
    get tertiaryPaletteKeyColor() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.tertiaryPaletteKeyColor);
    }
    get neutralPaletteKeyColor() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.neutralPaletteKeyColor);
    }
    get neutralVariantPaletteKeyColor() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.neutralVariantPaletteKeyColor);
    }
    get background() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.background);
    }
    get onBackground() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onBackground);
    }
    get surface() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surface);
    }
    get surfaceDim() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceDim);
    }
    get surfaceBright() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceBright);
    }
    get surfaceContainerLowest() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceContainerLowest);
    }
    get surfaceContainerLow() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceContainerLow);
    }
    get surfaceContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceContainer);
    }
    get surfaceContainerHigh() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceContainerHigh);
    }
    get surfaceContainerHighest() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceContainerHighest);
    }
    get onSurface() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onSurface);
    }
    get surfaceVariant() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceVariant);
    }
    get onSurfaceVariant() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onSurfaceVariant);
    }
    get inverseSurface() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.inverseSurface);
    }
    get inverseOnSurface() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.inverseOnSurface);
    }
    get outline() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.outline);
    }
    get outlineVariant() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.outlineVariant);
    }
    get shadow() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.shadow);
    }
    get scrim() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.scrim);
    }
    get surfaceTint() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.surfaceTint);
    }
    get primary() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.primary);
    }
    get onPrimary() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onPrimary);
    }
    get primaryContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.primaryContainer);
    }
    get onPrimaryContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onPrimaryContainer);
    }
    get inversePrimary() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.inversePrimary);
    }
    get secondary() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.secondary);
    }
    get onSecondary() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onSecondary);
    }
    get secondaryContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.secondaryContainer);
    }
    get onSecondaryContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onSecondaryContainer);
    }
    get tertiary() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.tertiary);
    }
    get onTertiary() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onTertiary);
    }
    get tertiaryContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.tertiaryContainer);
    }
    get onTertiaryContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onTertiaryContainer);
    }
    get error() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.error);
    }
    get onError() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onError);
    }
    get errorContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.errorContainer);
    }
    get onErrorContainer() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onErrorContainer);
    }
    get primaryFixed() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.primaryFixed);
    }
    get primaryFixedDim() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.primaryFixedDim);
    }
    get onPrimaryFixed() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onPrimaryFixed);
    }
    get onPrimaryFixedVariant() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onPrimaryFixedVariant);
    }
    get secondaryFixed() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.secondaryFixed);
    }
    get secondaryFixedDim() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.secondaryFixedDim);
    }
    get onSecondaryFixed() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onSecondaryFixed);
    }
    get onSecondaryFixedVariant() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onSecondaryFixedVariant);
    }
    get tertiaryFixed() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.tertiaryFixed);
    }
    get tertiaryFixedDim() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.tertiaryFixedDim);
    }
    get onTertiaryFixed() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onTertiaryFixed);
    }
    get onTertiaryFixedVariant() {
        return this.getArgb(_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_3__.MaterialDynamicColors.onTertiaryFixedVariant);
    }
}
//# sourceMappingURL=dynamic_scheme.js.map

/***/ },

/***/ "bcc70d254bcd"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MaterialDynamicColors: () => (/* binding */ MaterialDynamicColors)
/* harmony export */ });
/* harmony import */ var _dislike_dislike_analyzer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c14890e64efd");
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("3cdc1bb3fe85");
/* harmony import */ var _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e25d88b1069e");
/* harmony import */ var _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("10cdd4ea39cc");
/* harmony import */ var _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("a5c05756fc8b");
/* harmony import */ var _variant_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("5c8e12e65ddb");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






function isFidelity(scheme) {
    return scheme.variant === _variant_js__WEBPACK_IMPORTED_MODULE_5__.Variant.FIDELITY ||
        scheme.variant === _variant_js__WEBPACK_IMPORTED_MODULE_5__.Variant.CONTENT;
}
function isMonochrome(scheme) {
    return scheme.variant === _variant_js__WEBPACK_IMPORTED_MODULE_5__.Variant.MONOCHROME;
}
function findDesiredChromaByTone(hue, chroma, tone, byDecreasingTone) {
    let answer = tone;
    let closestToChroma = _hct_hct_js__WEBPACK_IMPORTED_MODULE_1__.Hct.from(hue, chroma, tone);
    if (closestToChroma.chroma < chroma) {
        let chromaPeak = closestToChroma.chroma;
        while (closestToChroma.chroma < chroma) {
            answer += byDecreasingTone ? -1.0 : 1.0;
            const potentialSolution = _hct_hct_js__WEBPACK_IMPORTED_MODULE_1__.Hct.from(hue, chroma, answer);
            if (chromaPeak > potentialSolution.chroma) {
                break;
            }
            if (Math.abs(potentialSolution.chroma - chroma) < 0.4) {
                break;
            }
            const potentialDelta = Math.abs(potentialSolution.chroma - chroma);
            const currentDelta = Math.abs(closestToChroma.chroma - chroma);
            if (potentialDelta < currentDelta) {
                closestToChroma = potentialSolution;
            }
            chromaPeak = Math.max(chromaPeak, potentialSolution.chroma);
        }
    }
    return answer;
}
/**
 * DynamicColors for the colors in the Material Design system.
 */
// Material Color Utilities namespaces the various utilities it provides.
// tslint:disable-next-line:class-as-namespace
class MaterialDynamicColors {
    static highestSurface(s) {
        return s.isDark ? MaterialDynamicColors.surfaceBright :
            MaterialDynamicColors.surfaceDim;
    }
}
MaterialDynamicColors.contentAccentToneDelta = 15.0;
MaterialDynamicColors.primaryPaletteKeyColor = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'primary_palette_key_color',
    palette: (s) => s.primaryPalette,
    tone: (s) => s.primaryPalette.keyColor.tone,
});
MaterialDynamicColors.secondaryPaletteKeyColor = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'secondary_palette_key_color',
    palette: (s) => s.secondaryPalette,
    tone: (s) => s.secondaryPalette.keyColor.tone,
});
MaterialDynamicColors.tertiaryPaletteKeyColor = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'tertiary_palette_key_color',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => s.tertiaryPalette.keyColor.tone,
});
MaterialDynamicColors.neutralPaletteKeyColor = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'neutral_palette_key_color',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.neutralPalette.keyColor.tone,
});
MaterialDynamicColors.neutralVariantPaletteKeyColor = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'neutral_variant_palette_key_color',
    palette: (s) => s.neutralVariantPalette,
    tone: (s) => s.neutralVariantPalette.keyColor.tone,
});
MaterialDynamicColors.background = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'background',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? 6 : 98,
    isBackground: true,
});
MaterialDynamicColors.onBackground = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_background',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? 90 : 10,
    background: (s) => MaterialDynamicColors.background,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 3, 4.5, 7),
});
MaterialDynamicColors.surface = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? 6 : 98,
    isBackground: true,
});
MaterialDynamicColors.surfaceDim = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_dim',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? 6 : new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(87, 87, 80, 75).get(s.contrastLevel),
    isBackground: true,
});
MaterialDynamicColors.surfaceBright = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_bright',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(24, 24, 29, 34).get(s.contrastLevel) : 98,
    isBackground: true,
});
MaterialDynamicColors.surfaceContainerLowest = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_container_lowest',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4, 4, 2, 0).get(s.contrastLevel) : 100,
    isBackground: true,
});
MaterialDynamicColors.surfaceContainerLow = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_container_low',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ?
        new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(10, 10, 11, 12).get(s.contrastLevel) :
        new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(96, 96, 96, 95).get(s.contrastLevel),
    isBackground: true,
});
MaterialDynamicColors.surfaceContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_container',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ?
        new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(12, 12, 16, 20).get(s.contrastLevel) :
        new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(94, 94, 92, 90).get(s.contrastLevel),
    isBackground: true,
});
MaterialDynamicColors.surfaceContainerHigh = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_container_high',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ?
        new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(17, 17, 21, 25).get(s.contrastLevel) :
        new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(92, 92, 88, 85).get(s.contrastLevel),
    isBackground: true,
});
MaterialDynamicColors.surfaceContainerHighest = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_container_highest',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ?
        new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(22, 22, 26, 30).get(s.contrastLevel) :
        new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(90, 90, 84, 80).get(s.contrastLevel),
    isBackground: true,
});
MaterialDynamicColors.onSurface = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_surface',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? 90 : 10,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.surfaceVariant = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_variant',
    palette: (s) => s.neutralVariantPalette,
    tone: (s) => s.isDark ? 30 : 90,
    isBackground: true,
});
MaterialDynamicColors.onSurfaceVariant = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_surface_variant',
    palette: (s) => s.neutralVariantPalette,
    tone: (s) => s.isDark ? 80 : 30,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 11),
});
MaterialDynamicColors.inverseSurface = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'inverse_surface',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? 90 : 20,
});
MaterialDynamicColors.inverseOnSurface = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'inverse_on_surface',
    palette: (s) => s.neutralPalette,
    tone: (s) => s.isDark ? 20 : 95,
    background: (s) => MaterialDynamicColors.inverseSurface,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.outline = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'outline',
    palette: (s) => s.neutralVariantPalette,
    tone: (s) => s.isDark ? 60 : 50,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1.5, 3, 4.5, 7),
});
MaterialDynamicColors.outlineVariant = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'outline_variant',
    palette: (s) => s.neutralVariantPalette,
    tone: (s) => s.isDark ? 30 : 80,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
});
MaterialDynamicColors.shadow = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'shadow',
    palette: (s) => s.neutralPalette,
    tone: (s) => 0,
});
MaterialDynamicColors.scrim = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'scrim',
    palette: (s) => s.neutralPalette,
    tone: (s) => 0,
});
MaterialDynamicColors.surfaceTint = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'surface_tint',
    palette: (s) => s.primaryPalette,
    tone: (s) => s.isDark ? 80 : 40,
    isBackground: true,
});
MaterialDynamicColors.primary = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'primary',
    palette: (s) => s.primaryPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 100 : 0;
        }
        return s.isDark ? 80 : 40;
    },
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 7),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.primaryContainer, MaterialDynamicColors.primary, 10, 'nearer', false),
});
MaterialDynamicColors.onPrimary = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_primary',
    palette: (s) => s.primaryPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 10 : 90;
        }
        return s.isDark ? 20 : 100;
    },
    background: (s) => MaterialDynamicColors.primary,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.primaryContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'primary_container',
    palette: (s) => s.primaryPalette,
    tone: (s) => {
        if (isFidelity(s)) {
            return s.sourceColorHct.tone;
        }
        if (isMonochrome(s)) {
            return s.isDark ? 85 : 25;
        }
        return s.isDark ? 30 : 90;
    },
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.primaryContainer, MaterialDynamicColors.primary, 10, 'nearer', false),
});
MaterialDynamicColors.onPrimaryContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_primary_container',
    palette: (s) => s.primaryPalette,
    tone: (s) => {
        if (isFidelity(s)) {
            return _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.foregroundTone(MaterialDynamicColors.primaryContainer.tone(s), 4.5);
        }
        if (isMonochrome(s)) {
            return s.isDark ? 0 : 100;
        }
        return s.isDark ? 90 : 30;
    },
    background: (s) => MaterialDynamicColors.primaryContainer,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 11),
});
MaterialDynamicColors.inversePrimary = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'inverse_primary',
    palette: (s) => s.primaryPalette,
    tone: (s) => s.isDark ? 40 : 80,
    background: (s) => MaterialDynamicColors.inverseSurface,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 7),
});
MaterialDynamicColors.secondary = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'secondary',
    palette: (s) => s.secondaryPalette,
    tone: (s) => s.isDark ? 80 : 40,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 7),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.secondaryContainer, MaterialDynamicColors.secondary, 10, 'nearer', false),
});
MaterialDynamicColors.onSecondary = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_secondary',
    palette: (s) => s.secondaryPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 10 : 100;
        }
        else {
            return s.isDark ? 20 : 100;
        }
    },
    background: (s) => MaterialDynamicColors.secondary,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.secondaryContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'secondary_container',
    palette: (s) => s.secondaryPalette,
    tone: (s) => {
        const initialTone = s.isDark ? 30 : 90;
        if (isMonochrome(s)) {
            return s.isDark ? 30 : 85;
        }
        if (!isFidelity(s)) {
            return initialTone;
        }
        return findDesiredChromaByTone(s.secondaryPalette.hue, s.secondaryPalette.chroma, initialTone, s.isDark ? false : true);
    },
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.secondaryContainer, MaterialDynamicColors.secondary, 10, 'nearer', false),
});
MaterialDynamicColors.onSecondaryContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_secondary_container',
    palette: (s) => s.secondaryPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 90 : 10;
        }
        if (!isFidelity(s)) {
            return s.isDark ? 90 : 30;
        }
        return _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.foregroundTone(MaterialDynamicColors.secondaryContainer.tone(s), 4.5);
    },
    background: (s) => MaterialDynamicColors.secondaryContainer,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 11),
});
MaterialDynamicColors.tertiary = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'tertiary',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 90 : 25;
        }
        return s.isDark ? 80 : 40;
    },
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 7),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.tertiaryContainer, MaterialDynamicColors.tertiary, 10, 'nearer', false),
});
MaterialDynamicColors.onTertiary = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_tertiary',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 10 : 90;
        }
        return s.isDark ? 20 : 100;
    },
    background: (s) => MaterialDynamicColors.tertiary,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.tertiaryContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'tertiary_container',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 60 : 49;
        }
        if (!isFidelity(s)) {
            return s.isDark ? 30 : 90;
        }
        const proposedHct = s.tertiaryPalette.getHct(s.sourceColorHct.tone);
        return _dislike_dislike_analyzer_js__WEBPACK_IMPORTED_MODULE_0__.DislikeAnalyzer.fixIfDisliked(proposedHct).tone;
    },
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.tertiaryContainer, MaterialDynamicColors.tertiary, 10, 'nearer', false),
});
MaterialDynamicColors.onTertiaryContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_tertiary_container',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 0 : 100;
        }
        if (!isFidelity(s)) {
            return s.isDark ? 90 : 30;
        }
        return _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.foregroundTone(MaterialDynamicColors.tertiaryContainer.tone(s), 4.5);
    },
    background: (s) => MaterialDynamicColors.tertiaryContainer,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 11),
});
MaterialDynamicColors.error = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'error',
    palette: (s) => s.errorPalette,
    tone: (s) => s.isDark ? 80 : 40,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 7),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.errorContainer, MaterialDynamicColors.error, 10, 'nearer', false),
});
MaterialDynamicColors.onError = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_error',
    palette: (s) => s.errorPalette,
    tone: (s) => s.isDark ? 20 : 100,
    background: (s) => MaterialDynamicColors.error,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.errorContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'error_container',
    palette: (s) => s.errorPalette,
    tone: (s) => s.isDark ? 30 : 90,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.errorContainer, MaterialDynamicColors.error, 10, 'nearer', false),
});
MaterialDynamicColors.onErrorContainer = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_error_container',
    palette: (s) => s.errorPalette,
    tone: (s) => {
        if (isMonochrome(s)) {
            return s.isDark ? 90 : 10;
        }
        return s.isDark ? 90 : 30;
    },
    background: (s) => MaterialDynamicColors.errorContainer,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 11),
});
MaterialDynamicColors.primaryFixed = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'primary_fixed',
    palette: (s) => s.primaryPalette,
    tone: (s) => isMonochrome(s) ? 40.0 : 90.0,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.primaryFixed, MaterialDynamicColors.primaryFixedDim, 10, 'lighter', true),
});
MaterialDynamicColors.primaryFixedDim = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'primary_fixed_dim',
    palette: (s) => s.primaryPalette,
    tone: (s) => isMonochrome(s) ? 30.0 : 80.0,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.primaryFixed, MaterialDynamicColors.primaryFixedDim, 10, 'lighter', true),
});
MaterialDynamicColors.onPrimaryFixed = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_primary_fixed',
    palette: (s) => s.primaryPalette,
    tone: (s) => isMonochrome(s) ? 100.0 : 10.0,
    background: (s) => MaterialDynamicColors.primaryFixedDim,
    secondBackground: (s) => MaterialDynamicColors.primaryFixed,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.onPrimaryFixedVariant = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_primary_fixed_variant',
    palette: (s) => s.primaryPalette,
    tone: (s) => isMonochrome(s) ? 90.0 : 30.0,
    background: (s) => MaterialDynamicColors.primaryFixedDim,
    secondBackground: (s) => MaterialDynamicColors.primaryFixed,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 11),
});
MaterialDynamicColors.secondaryFixed = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'secondary_fixed',
    palette: (s) => s.secondaryPalette,
    tone: (s) => isMonochrome(s) ? 80.0 : 90.0,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.secondaryFixed, MaterialDynamicColors.secondaryFixedDim, 10, 'lighter', true),
});
MaterialDynamicColors.secondaryFixedDim = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'secondary_fixed_dim',
    palette: (s) => s.secondaryPalette,
    tone: (s) => isMonochrome(s) ? 70.0 : 80.0,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.secondaryFixed, MaterialDynamicColors.secondaryFixedDim, 10, 'lighter', true),
});
MaterialDynamicColors.onSecondaryFixed = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_secondary_fixed',
    palette: (s) => s.secondaryPalette,
    tone: (s) => 10.0,
    background: (s) => MaterialDynamicColors.secondaryFixedDim,
    secondBackground: (s) => MaterialDynamicColors.secondaryFixed,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.onSecondaryFixedVariant = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_secondary_fixed_variant',
    palette: (s) => s.secondaryPalette,
    tone: (s) => isMonochrome(s) ? 25.0 : 30.0,
    background: (s) => MaterialDynamicColors.secondaryFixedDim,
    secondBackground: (s) => MaterialDynamicColors.secondaryFixed,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 11),
});
MaterialDynamicColors.tertiaryFixed = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'tertiary_fixed',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => isMonochrome(s) ? 40.0 : 90.0,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.tertiaryFixed, MaterialDynamicColors.tertiaryFixedDim, 10, 'lighter', true),
});
MaterialDynamicColors.tertiaryFixedDim = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'tertiary_fixed_dim',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => isMonochrome(s) ? 30.0 : 80.0,
    isBackground: true,
    background: (s) => MaterialDynamicColors.highestSurface(s),
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(1, 1, 3, 4.5),
    toneDeltaPair: (s) => new _tone_delta_pair_js__WEBPACK_IMPORTED_MODULE_4__.ToneDeltaPair(MaterialDynamicColors.tertiaryFixed, MaterialDynamicColors.tertiaryFixedDim, 10, 'lighter', true),
});
MaterialDynamicColors.onTertiaryFixed = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_tertiary_fixed',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => isMonochrome(s) ? 100.0 : 10.0,
    background: (s) => MaterialDynamicColors.tertiaryFixedDim,
    secondBackground: (s) => MaterialDynamicColors.tertiaryFixed,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(4.5, 7, 11, 21),
});
MaterialDynamicColors.onTertiaryFixedVariant = _dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor.fromPalette({
    name: 'on_tertiary_fixed_variant',
    palette: (s) => s.tertiaryPalette,
    tone: (s) => isMonochrome(s) ? 90.0 : 30.0,
    background: (s) => MaterialDynamicColors.tertiaryFixedDim,
    secondBackground: (s) => MaterialDynamicColors.tertiaryFixed,
    contrastCurve: new _contrast_curve_js__WEBPACK_IMPORTED_MODULE_2__.ContrastCurve(3, 4.5, 7, 11),
});
//# sourceMappingURL=material_dynamic_colors.js.map

/***/ },

/***/ "a5c05756fc8b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToneDeltaPair: () => (/* binding */ ToneDeltaPair)
/* harmony export */ });
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Documents a constraint between two DynamicColors, in which their tones must
 * have a certain distance from each other.
 *
 * Prefer a DynamicColor with a background, this is for special cases when
 * designers want tonal distance, literally contrast, between two colors that
 * don't have a background / foreground relationship or a contrast guarantee.
 */
class ToneDeltaPair {
    /**
     * Documents a constraint in tone distance between two DynamicColors.
     *
     * The polarity is an adjective that describes "A", compared to "B".
     *
     * For instance, ToneDeltaPair(A, B, 15, 'darker', stayTogether) states that
     * A's tone should be at least 15 darker than B's.
     *
     * 'nearer' and 'farther' describes closeness to the surface roles. For
     * instance, ToneDeltaPair(A, B, 10, 'nearer', stayTogether) states that A
     * should be 10 lighter than B in light mode, and 10 darker than B in dark
     * mode.
     *
     * @param roleA The first role in a pair.
     * @param roleB The second role in a pair.
     * @param delta Required difference between tones. Absolute value, negative
     * values have undefined behavior.
     * @param polarity The relative relation between tones of roleA and roleB,
     * as described above.
     * @param stayTogether Whether these two roles should stay on the same side of
     * the "awkward zone" (T50-59). This is necessary for certain cases where
     * one role has two backgrounds.
     */
    constructor(roleA, roleB, delta, polarity, stayTogether) {
        this.roleA = roleA;
        this.roleB = roleB;
        this.delta = delta;
        this.polarity = polarity;
        this.stayTogether = stayTogether;
    }
}
//# sourceMappingURL=tone_delta_pair.js.map

/***/ },

/***/ "5c8e12e65ddb"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Variant: () => (/* binding */ Variant)
/* harmony export */ });
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Set of themes supported by Dynamic Color.
 * Instantiate the corresponding subclass, ex. SchemeTonalSpot, to create
 * colors corresponding to the theme.
 */
var Variant;
(function (Variant) {
    Variant[Variant["MONOCHROME"] = 0] = "MONOCHROME";
    Variant[Variant["NEUTRAL"] = 1] = "NEUTRAL";
    Variant[Variant["TONAL_SPOT"] = 2] = "TONAL_SPOT";
    Variant[Variant["VIBRANT"] = 3] = "VIBRANT";
    Variant[Variant["EXPRESSIVE"] = 4] = "EXPRESSIVE";
    Variant[Variant["FIDELITY"] = 5] = "FIDELITY";
    Variant[Variant["CONTENT"] = 6] = "CONTENT";
    Variant[Variant["RAINBOW"] = 7] = "RAINBOW";
    Variant[Variant["FRUIT_SALAD"] = 8] = "FRUIT_SALAD";
})(Variant || (Variant = {}));
//# sourceMappingURL=variant.js.map

/***/ },

/***/ "bcd1e8163538"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cam16: () => (/* binding */ Cam16)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6d41ddc214ee");
/* harmony import */ var _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0052ca963f59");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * CAM16, a color appearance model. Colors are not just defined by their hex
 * code, but rather, a hex code and viewing conditions.
 *
 * CAM16 instances also have coordinates in the CAM16-UCS space, called J*, a*,
 * b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
 * specification, and should be used when measuring distances between colors.
 *
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 */
class Cam16 {
    /**
     * All of the CAM16 dimensions can be calculated from 3 of the dimensions, in
     * the following combinations:
     *      -  {j or q} and {c, m, or s} and hue
     *      - jstar, astar, bstar
     * Prefer using a static method that constructs from 3 of those dimensions.
     * This constructor is intended for those methods to use to return all
     * possible dimensions.
     *
     * @param hue
     * @param chroma informally, colorfulness / color intensity. like saturation
     *     in HSL, except perceptually accurate.
     * @param j lightness
     * @param q brightness; ratio of lightness to white point's lightness
     * @param m colorfulness
     * @param s saturation; ratio of chroma to white point's chroma
     * @param jstar CAM16-UCS J coordinate
     * @param astar CAM16-UCS a coordinate
     * @param bstar CAM16-UCS b coordinate
     */
    constructor(hue, chroma, j, q, m, s, jstar, astar, bstar) {
        this.hue = hue;
        this.chroma = chroma;
        this.j = j;
        this.q = q;
        this.m = m;
        this.s = s;
        this.jstar = jstar;
        this.astar = astar;
        this.bstar = bstar;
    }
    /**
     * CAM16 instances also have coordinates in the CAM16-UCS space, called J*,
     * a*, b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
     * specification, and is used to measure distances between colors.
     */
    distance(other) {
        const dJ = this.jstar - other.jstar;
        const dA = this.astar - other.astar;
        const dB = this.bstar - other.bstar;
        const dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
        const dE = 1.41 * Math.pow(dEPrime, 0.63);
        return dE;
    }
    /**
     * @param argb ARGB representation of a color.
     * @return CAM16 color, assuming the color was viewed in default viewing
     *     conditions.
     */
    static fromInt(argb) {
        return Cam16.fromIntInViewingConditions(argb, _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__.ViewingConditions.DEFAULT);
    }
    /**
     * @param argb ARGB representation of a color.
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     * @return CAM16 color.
     */
    static fromIntInViewingConditions(argb, viewingConditions) {
        const red = (argb & 0x00ff0000) >> 16;
        const green = (argb & 0x0000ff00) >> 8;
        const blue = (argb & 0x000000ff);
        const redL = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.linearized(red);
        const greenL = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.linearized(green);
        const blueL = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.linearized(blue);
        const x = 0.41233895 * redL + 0.35762064 * greenL + 0.18051042 * blueL;
        const y = 0.2126 * redL + 0.7152 * greenL + 0.0722 * blueL;
        const z = 0.01932141 * redL + 0.11916382 * greenL + 0.95034478 * blueL;
        const rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
        const gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
        const bC = -0.002079 * x + 0.048952 * y + 0.953127 * z;
        const rD = viewingConditions.rgbD[0] * rC;
        const gD = viewingConditions.rgbD[1] * gC;
        const bD = viewingConditions.rgbD[2] * bC;
        const rAF = Math.pow((viewingConditions.fl * Math.abs(rD)) / 100.0, 0.42);
        const gAF = Math.pow((viewingConditions.fl * Math.abs(gD)) / 100.0, 0.42);
        const bAF = Math.pow((viewingConditions.fl * Math.abs(bD)) / 100.0, 0.42);
        const rA = (_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(rD) * 400.0 * rAF) / (rAF + 27.13);
        const gA = (_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(gD) * 400.0 * gAF) / (gAF + 27.13);
        const bA = (_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(bD) * 400.0 * bAF) / (bAF + 27.13);
        const a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
        const b = (rA + gA - 2.0 * bA) / 9.0;
        const u = (20.0 * rA + 20.0 * gA + 21.0 * bA) / 20.0;
        const p2 = (40.0 * rA + 20.0 * gA + bA) / 20.0;
        const atan2 = Math.atan2(b, a);
        const atanDegrees = (atan2 * 180.0) / Math.PI;
        const hue = atanDegrees < 0 ? atanDegrees + 360.0 :
            atanDegrees >= 360 ? atanDegrees - 360.0 :
                atanDegrees;
        const hueRadians = (hue * Math.PI) / 180.0;
        const ac = p2 * viewingConditions.nbb;
        const j = 100.0 *
            Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
        const q = (4.0 / viewingConditions.c) * Math.sqrt(j / 100.0) *
            (viewingConditions.aw + 4.0) * viewingConditions.fLRoot;
        const huePrime = hue < 20.14 ? hue + 360 : hue;
        const eHue = 0.25 * (Math.cos((huePrime * Math.PI) / 180.0 + 2.0) + 3.8);
        const p1 = (50000.0 / 13.0) * eHue * viewingConditions.nc * viewingConditions.ncb;
        const t = (p1 * Math.sqrt(a * a + b * b)) / (u + 0.305);
        const alpha = Math.pow(t, 0.9) *
            Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
        const c = alpha * Math.sqrt(j / 100.0);
        const m = c * viewingConditions.fLRoot;
        const s = 50.0 *
            Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4.0));
        const jstar = ((1.0 + 100.0 * 0.007) * j) / (1.0 + 0.007 * j);
        const mstar = (1.0 / 0.0228) * Math.log(1.0 + 0.0228 * m);
        const astar = mstar * Math.cos(hueRadians);
        const bstar = mstar * Math.sin(hueRadians);
        return new Cam16(hue, c, j, q, m, s, jstar, astar, bstar);
    }
    /**
     * @param j CAM16 lightness
     * @param c CAM16 chroma
     * @param h CAM16 hue
     */
    static fromJch(j, c, h) {
        return Cam16.fromJchInViewingConditions(j, c, h, _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__.ViewingConditions.DEFAULT);
    }
    /**
     * @param j CAM16 lightness
     * @param c CAM16 chroma
     * @param h CAM16 hue
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     */
    static fromJchInViewingConditions(j, c, h, viewingConditions) {
        const q = (4.0 / viewingConditions.c) * Math.sqrt(j / 100.0) *
            (viewingConditions.aw + 4.0) * viewingConditions.fLRoot;
        const m = c * viewingConditions.fLRoot;
        const alpha = c / Math.sqrt(j / 100.0);
        const s = 50.0 *
            Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4.0));
        const hueRadians = (h * Math.PI) / 180.0;
        const jstar = ((1.0 + 100.0 * 0.007) * j) / (1.0 + 0.007 * j);
        const mstar = (1.0 / 0.0228) * Math.log(1.0 + 0.0228 * m);
        const astar = mstar * Math.cos(hueRadians);
        const bstar = mstar * Math.sin(hueRadians);
        return new Cam16(h, c, j, q, m, s, jstar, astar, bstar);
    }
    /**
     * @param jstar CAM16-UCS lightness.
     * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the Y axis.
     * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the X axis.
     */
    static fromUcs(jstar, astar, bstar) {
        return Cam16.fromUcsInViewingConditions(jstar, astar, bstar, _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__.ViewingConditions.DEFAULT);
    }
    /**
     * @param jstar CAM16-UCS lightness.
     * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the Y axis.
     * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the X axis.
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     */
    static fromUcsInViewingConditions(jstar, astar, bstar, viewingConditions) {
        const a = astar;
        const b = bstar;
        const m = Math.sqrt(a * a + b * b);
        const M = (Math.exp(m * 0.0228) - 1.0) / 0.0228;
        const c = M / viewingConditions.fLRoot;
        let h = Math.atan2(b, a) * (180.0 / Math.PI);
        if (h < 0.0) {
            h += 360.0;
        }
        const j = jstar / (1 - (jstar - 100) * 0.007);
        return Cam16.fromJchInViewingConditions(j, c, h, viewingConditions);
    }
    /**
     *  @return ARGB representation of color, assuming the color was viewed in
     *     default viewing conditions, which are near-identical to the default
     *     viewing conditions for sRGB.
     */
    toInt() {
        return this.viewed(_viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__.ViewingConditions.DEFAULT);
    }
    /**
     * @param viewingConditions Information about the environment where the color
     *     will be viewed.
     * @return ARGB representation of color
     */
    viewed(viewingConditions) {
        const alpha = this.chroma === 0.0 || this.j === 0.0 ?
            0.0 :
            this.chroma / Math.sqrt(this.j / 100.0);
        const t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1.0 / 0.9);
        const hRad = (this.hue * Math.PI) / 180.0;
        const eHue = 0.25 * (Math.cos(hRad + 2.0) + 3.8);
        const ac = viewingConditions.aw *
            Math.pow(this.j / 100.0, 1.0 / viewingConditions.c / viewingConditions.z);
        const p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
        const p2 = ac / viewingConditions.nbb;
        const hSin = Math.sin(hRad);
        const hCos = Math.cos(hRad);
        const gamma = (23.0 * (p2 + 0.305) * t) /
            (23.0 * p1 + 11.0 * t * hCos + 108.0 * t * hSin);
        const a = gamma * hCos;
        const b = gamma * hSin;
        const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
        const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
        const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
        const rCBase = Math.max(0, (27.13 * Math.abs(rA)) / (400.0 - Math.abs(rA)));
        const rC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(rA) * (100.0 / viewingConditions.fl) *
            Math.pow(rCBase, 1.0 / 0.42);
        const gCBase = Math.max(0, (27.13 * Math.abs(gA)) / (400.0 - Math.abs(gA)));
        const gC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(gA) * (100.0 / viewingConditions.fl) *
            Math.pow(gCBase, 1.0 / 0.42);
        const bCBase = Math.max(0, (27.13 * Math.abs(bA)) / (400.0 - Math.abs(bA)));
        const bC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(bA) * (100.0 / viewingConditions.fl) *
            Math.pow(bCBase, 1.0 / 0.42);
        const rF = rC / viewingConditions.rgbD[0];
        const gF = gC / viewingConditions.rgbD[1];
        const bF = bC / viewingConditions.rgbD[2];
        const x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
        const y = 0.38752654 * rF + 0.62144744 * gF - 0.00897398 * bF;
        const z = -0.01584150 * rF - 0.03412294 * gF + 1.04996444 * bF;
        const argb = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromXyz(x, y, z);
        return argb;
    }
    /// Given color expressed in XYZ and viewed in [viewingConditions], convert to
    /// CAM16.
    static fromXyzInViewingConditions(x, y, z, viewingConditions) {
        // Transform XYZ to 'cone'/'rgb' responses
        const rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
        const gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
        const bC = -0.002079 * x + 0.048952 * y + 0.953127 * z;
        // Discount illuminant
        const rD = viewingConditions.rgbD[0] * rC;
        const gD = viewingConditions.rgbD[1] * gC;
        const bD = viewingConditions.rgbD[2] * bC;
        // chromatic adaptation
        const rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100.0, 0.42);
        const gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100.0, 0.42);
        const bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100.0, 0.42);
        const rA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(rD) * 400.0 * rAF / (rAF + 27.13);
        const gA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(gD) * 400.0 * gAF / (gAF + 27.13);
        const bA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(bD) * 400.0 * bAF / (bAF + 27.13);
        // redness-greenness
        const a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
        // yellowness-blueness
        const b = (rA + gA - 2.0 * bA) / 9.0;
        // auxiliary components
        const u = (20.0 * rA + 20.0 * gA + 21.0 * bA) / 20.0;
        const p2 = (40.0 * rA + 20.0 * gA + bA) / 20.0;
        // hue
        const atan2 = Math.atan2(b, a);
        const atanDegrees = atan2 * 180.0 / Math.PI;
        const hue = atanDegrees < 0 ? atanDegrees + 360.0 :
            atanDegrees >= 360 ? atanDegrees - 360 :
                atanDegrees;
        const hueRadians = hue * Math.PI / 180.0;
        // achromatic response to color
        const ac = p2 * viewingConditions.nbb;
        // CAM16 lightness and brightness
        const J = 100.0 *
            Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
        const Q = (4.0 / viewingConditions.c) * Math.sqrt(J / 100.0) *
            (viewingConditions.aw + 4.0) * (viewingConditions.fLRoot);
        const huePrime = (hue < 20.14) ? hue + 360 : hue;
        const eHue = (1.0 / 4.0) * (Math.cos(huePrime * Math.PI / 180.0 + 2.0) + 3.8);
        const p1 = 50000.0 / 13.0 * eHue * viewingConditions.nc * viewingConditions.ncb;
        const t = p1 * Math.sqrt(a * a + b * b) / (u + 0.305);
        const alpha = Math.pow(t, 0.9) *
            Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
        // CAM16 chroma, colorfulness, chroma
        const C = alpha * Math.sqrt(J / 100.0);
        const M = C * viewingConditions.fLRoot;
        const s = 50.0 *
            Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4.0));
        // CAM16-UCS components
        const jstar = (1.0 + 100.0 * 0.007) * J / (1.0 + 0.007 * J);
        const mstar = Math.log(1.0 + 0.0228 * M) / 0.0228;
        const astar = mstar * Math.cos(hueRadians);
        const bstar = mstar * Math.sin(hueRadians);
        return new Cam16(hue, C, J, Q, M, s, jstar, astar, bstar);
    }
    /// XYZ representation of CAM16 seen in [viewingConditions].
    xyzInViewingConditions(viewingConditions) {
        const alpha = (this.chroma === 0.0 || this.j === 0.0) ?
            0.0 :
            this.chroma / Math.sqrt(this.j / 100.0);
        const t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1.0 / 0.9);
        const hRad = this.hue * Math.PI / 180.0;
        const eHue = 0.25 * (Math.cos(hRad + 2.0) + 3.8);
        const ac = viewingConditions.aw *
            Math.pow(this.j / 100.0, 1.0 / viewingConditions.c / viewingConditions.z);
        const p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
        const p2 = (ac / viewingConditions.nbb);
        const hSin = Math.sin(hRad);
        const hCos = Math.cos(hRad);
        const gamma = 23.0 * (p2 + 0.305) * t /
            (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
        const a = gamma * hCos;
        const b = gamma * hSin;
        const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
        const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
        const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
        const rCBase = Math.max(0, (27.13 * Math.abs(rA)) / (400.0 - Math.abs(rA)));
        const rC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(rA) * (100.0 / viewingConditions.fl) *
            Math.pow(rCBase, 1.0 / 0.42);
        const gCBase = Math.max(0, (27.13 * Math.abs(gA)) / (400.0 - Math.abs(gA)));
        const gC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(gA) * (100.0 / viewingConditions.fl) *
            Math.pow(gCBase, 1.0 / 0.42);
        const bCBase = Math.max(0, (27.13 * Math.abs(bA)) / (400.0 - Math.abs(bA)));
        const bC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(bA) * (100.0 / viewingConditions.fl) *
            Math.pow(bCBase, 1.0 / 0.42);
        const rF = rC / viewingConditions.rgbD[0];
        const gF = gC / viewingConditions.rgbD[1];
        const bF = bC / viewingConditions.rgbD[2];
        const x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
        const y = 0.38752654 * rF + 0.62144744 * gF - 0.00897398 * bF;
        const z = -0.01584150 * rF - 0.03412294 * gF + 1.04996444 * bF;
        return [x, y, z];
    }
}
//# sourceMappingURL=cam16.js.map

/***/ },

/***/ "3cdc1bb3fe85"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Hct: () => (/* binding */ Hct)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _cam16_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("bcd1e8163538");
/* harmony import */ var _hct_solver_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f0f125eadff5");
/* harmony import */ var _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("0052ca963f59");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A color system built using CAM16 hue and chroma, and L* from
 * L*a*b*.
 *
 * Using L* creates a link between the color system, contrast, and thus
 * accessibility. Contrast ratio depends on relative luminance, or Y in the XYZ
 * color space. L*, or perceptual luminance can be calculated from Y.
 *
 * Unlike Y, L* is linear to human perception, allowing trivial creation of
 * accurate color tones.
 *
 * Unlike contrast ratio, measuring contrast in L* is linear, and simple to
 * calculate. A difference of 40 in HCT tone guarantees a contrast ratio >= 3.0,
 * and a difference of 50 guarantees a contrast ratio >= 4.5.
 */




/**
 * HCT, hue, chroma, and tone. A color system that provides a perceptually
 * accurate color measurement system that can also accurately render what colors
 * will appear as in different lighting environments.
 */
class Hct {
    static from(hue, chroma, tone) {
        return new Hct(_hct_solver_js__WEBPACK_IMPORTED_MODULE_2__.HctSolver.solveToInt(hue, chroma, tone));
    }
    /**
     * @param argb ARGB representation of a color.
     * @return HCT representation of a color in default viewing conditions
     */
    static fromInt(argb) {
        return new Hct(argb);
    }
    toInt() {
        return this.argb;
    }
    /**
     * A number, in degrees, representing ex. red, orange, yellow, etc.
     * Ranges from 0 <= hue < 360.
     */
    get hue() {
        return this.internalHue;
    }
    /**
     * @param newHue 0 <= newHue < 360; invalid values are corrected.
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set hue(newHue) {
        this.setInternalState(_hct_solver_js__WEBPACK_IMPORTED_MODULE_2__.HctSolver.solveToInt(newHue, this.internalChroma, this.internalTone));
    }
    get chroma() {
        return this.internalChroma;
    }
    /**
     * @param newChroma 0 <= newChroma < ?
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set chroma(newChroma) {
        this.setInternalState(_hct_solver_js__WEBPACK_IMPORTED_MODULE_2__.HctSolver.solveToInt(this.internalHue, newChroma, this.internalTone));
    }
    /** Lightness. Ranges from 0 to 100. */
    get tone() {
        return this.internalTone;
    }
    /**
     * @param newTone 0 <= newTone <= 100; invalid valids are corrected.
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set tone(newTone) {
        this.setInternalState(_hct_solver_js__WEBPACK_IMPORTED_MODULE_2__.HctSolver.solveToInt(this.internalHue, this.internalChroma, newTone));
    }
    constructor(argb) {
        this.argb = argb;
        const cam = _cam16_js__WEBPACK_IMPORTED_MODULE_1__.Cam16.fromInt(argb);
        this.internalHue = cam.hue;
        this.internalChroma = cam.chroma;
        this.internalTone = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.lstarFromArgb(argb);
        this.argb = argb;
    }
    setInternalState(argb) {
        const cam = _cam16_js__WEBPACK_IMPORTED_MODULE_1__.Cam16.fromInt(argb);
        this.internalHue = cam.hue;
        this.internalChroma = cam.chroma;
        this.internalTone = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.lstarFromArgb(argb);
        this.argb = argb;
    }
    /**
     * Translates a color into different [ViewingConditions].
     *
     * Colors change appearance. They look different with lights on versus off,
     * the same color, as in hex code, on white looks different when on black.
     * This is called color relativity, most famously explicated by Josef Albers
     * in Interaction of Color.
     *
     * In color science, color appearance models can account for this and
     * calculate the appearance of a color in different settings. HCT is based on
     * CAM16, a color appearance model, and uses it to make these calculations.
     *
     * See [ViewingConditions.make] for parameters affecting color appearance.
     */
    inViewingConditions(vc) {
        // 1. Use CAM16 to find XYZ coordinates of color in specified VC.
        const cam = _cam16_js__WEBPACK_IMPORTED_MODULE_1__.Cam16.fromInt(this.toInt());
        const viewedInVc = cam.xyzInViewingConditions(vc);
        // 2. Create CAM16 of those XYZ coordinates in default VC.
        const recastInVc = _cam16_js__WEBPACK_IMPORTED_MODULE_1__.Cam16.fromXyzInViewingConditions(viewedInVc[0], viewedInVc[1], viewedInVc[2], _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_3__.ViewingConditions.make());
        // 3. Create HCT from:
        // - CAM16 using default VC with XYZ coordinates in specified VC.
        // - L* converted from Y in XYZ coordinates in specified VC.
        const recastHct = Hct.from(recastInVc.hue, recastInVc.chroma, _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.lstarFromY(viewedInVc[1]));
        return recastHct;
    }
}
//# sourceMappingURL=hct.js.map

/***/ },

/***/ "f0f125eadff5"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HctSolver: () => (/* binding */ HctSolver)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6d41ddc214ee");
/* harmony import */ var _cam16_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bcd1e8163538");
/* harmony import */ var _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("0052ca963f59");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.




// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable:class-as-namespace
/**
 * A class that solves the HCT equation.
 */
class HctSolver {
    /**
     * Sanitizes a small enough angle in radians.
     *
     * @param angle An angle in radians; must not deviate too much
     * from 0.
     * @return A coterminal angle between 0 and 2pi.
     */
    static sanitizeRadians(angle) {
        return (angle + Math.PI * 8) % (Math.PI * 2);
    }
    /**
     * Delinearizes an RGB component, returning a floating-point
     * number.
     *
     * @param rgbComponent 0.0 <= rgb_component <= 100.0, represents
     * linear R/G/B channel
     * @return 0.0 <= output <= 255.0, color channel converted to
     * regular RGB space
     */
    static trueDelinearized(rgbComponent) {
        const normalized = rgbComponent / 100.0;
        let delinearized = 0.0;
        if (normalized <= 0.0031308) {
            delinearized = normalized * 12.92;
        }
        else {
            delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
        }
        return delinearized * 255.0;
    }
    static chromaticAdaptation(component) {
        const af = Math.pow(Math.abs(component), 0.42);
        return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(component) * 400.0 * af / (af + 27.13);
    }
    /**
     * Returns the hue of a linear RGB color in CAM16.
     *
     * @param linrgb The linear RGB coordinates of a color.
     * @return The hue of the color in CAM16, in radians.
     */
    static hueOf(linrgb) {
        const scaledDiscount = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.matrixMultiply(linrgb, HctSolver.SCALED_DISCOUNT_FROM_LINRGB);
        const rA = HctSolver.chromaticAdaptation(scaledDiscount[0]);
        const gA = HctSolver.chromaticAdaptation(scaledDiscount[1]);
        const bA = HctSolver.chromaticAdaptation(scaledDiscount[2]);
        // redness-greenness
        const a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
        // yellowness-blueness
        const b = (rA + gA - 2.0 * bA) / 9.0;
        return Math.atan2(b, a);
    }
    static areInCyclicOrder(a, b, c) {
        const deltaAB = HctSolver.sanitizeRadians(b - a);
        const deltaAC = HctSolver.sanitizeRadians(c - a);
        return deltaAB < deltaAC;
    }
    /**
     * Solves the lerp equation.
     *
     * @param source The starting number.
     * @param mid The number in the middle.
     * @param target The ending number.
     * @return A number t such that lerp(source, target, t) = mid.
     */
    static intercept(source, mid, target) {
        return (mid - source) / (target - source);
    }
    static lerpPoint(source, t, target) {
        return [
            source[0] + (target[0] - source[0]) * t,
            source[1] + (target[1] - source[1]) * t,
            source[2] + (target[2] - source[2]) * t,
        ];
    }
    /**
     * Intersects a segment with a plane.
     *
     * @param source The coordinates of point A.
     * @param coordinate The R-, G-, or B-coordinate of the plane.
     * @param target The coordinates of point B.
     * @param axis The axis the plane is perpendicular with. (0: R, 1:
     * G, 2: B)
     * @return The intersection point of the segment AB with the plane
     * R=coordinate, G=coordinate, or B=coordinate
     */
    static setCoordinate(source, coordinate, target, axis) {
        const t = HctSolver.intercept(source[axis], coordinate, target[axis]);
        return HctSolver.lerpPoint(source, t, target);
    }
    static isBounded(x) {
        return 0.0 <= x && x <= 100.0;
    }
    /**
     * Returns the nth possible vertex of the polygonal intersection.
     *
     * @param y The Y value of the plane.
     * @param n The zero-based index of the point. 0 <= n <= 11.
     * @return The nth possible vertex of the polygonal intersection
     * of the y plane and the RGB cube, in linear RGB coordinates, if
     * it exists. If this possible vertex lies outside of the cube,
     * [-1.0, -1.0, -1.0] is returned.
     */
    static nthVertex(y, n) {
        const kR = HctSolver.Y_FROM_LINRGB[0];
        const kG = HctSolver.Y_FROM_LINRGB[1];
        const kB = HctSolver.Y_FROM_LINRGB[2];
        const coordA = n % 4 <= 1 ? 0.0 : 100.0;
        const coordB = n % 2 === 0 ? 0.0 : 100.0;
        if (n < 4) {
            const g = coordA;
            const b = coordB;
            const r = (y - g * kG - b * kB) / kR;
            if (HctSolver.isBounded(r)) {
                return [r, g, b];
            }
            else {
                return [-1.0, -1.0, -1.0];
            }
        }
        else if (n < 8) {
            const b = coordA;
            const r = coordB;
            const g = (y - r * kR - b * kB) / kG;
            if (HctSolver.isBounded(g)) {
                return [r, g, b];
            }
            else {
                return [-1.0, -1.0, -1.0];
            }
        }
        else {
            const r = coordA;
            const g = coordB;
            const b = (y - r * kR - g * kG) / kB;
            if (HctSolver.isBounded(b)) {
                return [r, g, b];
            }
            else {
                return [-1.0, -1.0, -1.0];
            }
        }
    }
    /**
     * Finds the segment containing the desired color.
     *
     * @param y The Y value of the color.
     * @param targetHue The hue of the color.
     * @return A list of two sets of linear RGB coordinates, each
     * corresponding to an endpoint of the segment containing the
     * desired color.
     */
    static bisectToSegment(y, targetHue) {
        let left = [-1.0, -1.0, -1.0];
        let right = left;
        let leftHue = 0.0;
        let rightHue = 0.0;
        let initialized = false;
        let uncut = true;
        for (let n = 0; n < 12; n++) {
            const mid = HctSolver.nthVertex(y, n);
            if (mid[0] < 0) {
                continue;
            }
            const midHue = HctSolver.hueOf(mid);
            if (!initialized) {
                left = mid;
                right = mid;
                leftHue = midHue;
                rightHue = midHue;
                initialized = true;
                continue;
            }
            if (uncut || HctSolver.areInCyclicOrder(leftHue, midHue, rightHue)) {
                uncut = false;
                if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
                    right = mid;
                    rightHue = midHue;
                }
                else {
                    left = mid;
                    leftHue = midHue;
                }
            }
        }
        return [left, right];
    }
    static midpoint(a, b) {
        return [
            (a[0] + b[0]) / 2,
            (a[1] + b[1]) / 2,
            (a[2] + b[2]) / 2,
        ];
    }
    static criticalPlaneBelow(x) {
        return Math.floor(x - 0.5);
    }
    static criticalPlaneAbove(x) {
        return Math.ceil(x - 0.5);
    }
    /**
     * Finds a color with the given Y and hue on the boundary of the
     * cube.
     *
     * @param y The Y value of the color.
     * @param targetHue The hue of the color.
     * @return The desired color, in linear RGB coordinates.
     */
    static bisectToLimit(y, targetHue) {
        const segment = HctSolver.bisectToSegment(y, targetHue);
        let left = segment[0];
        let leftHue = HctSolver.hueOf(left);
        let right = segment[1];
        for (let axis = 0; axis < 3; axis++) {
            if (left[axis] !== right[axis]) {
                let lPlane = -1;
                let rPlane = 255;
                if (left[axis] < right[axis]) {
                    lPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(left[axis]));
                    rPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(right[axis]));
                }
                else {
                    lPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(left[axis]));
                    rPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(right[axis]));
                }
                for (let i = 0; i < 8; i++) {
                    if (Math.abs(rPlane - lPlane) <= 1) {
                        break;
                    }
                    else {
                        const mPlane = Math.floor((lPlane + rPlane) / 2.0);
                        const midPlaneCoordinate = HctSolver.CRITICAL_PLANES[mPlane];
                        const mid = HctSolver.setCoordinate(left, midPlaneCoordinate, right, axis);
                        const midHue = HctSolver.hueOf(mid);
                        if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
                            right = mid;
                            rPlane = mPlane;
                        }
                        else {
                            left = mid;
                            leftHue = midHue;
                            lPlane = mPlane;
                        }
                    }
                }
            }
        }
        return HctSolver.midpoint(left, right);
    }
    static inverseChromaticAdaptation(adapted) {
        const adaptedAbs = Math.abs(adapted);
        const base = Math.max(0, 27.13 * adaptedAbs / (400.0 - adaptedAbs));
        return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(adapted) * Math.pow(base, 1.0 / 0.42);
    }
    /**
     * Finds a color with the given hue, chroma, and Y.
     *
     * @param hueRadians The desired hue in radians.
     * @param chroma The desired chroma.
     * @param y The desired Y.
     * @return The desired color as a hexadecimal integer, if found; 0
     * otherwise.
     */
    static findResultByJ(hueRadians, chroma, y) {
        // Initial estimate of j.
        let j = Math.sqrt(y) * 11.0;
        // ===========================================================
        // Operations inlined from Cam16 to avoid repeated calculation
        // ===========================================================
        const viewingConditions = _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_3__.ViewingConditions.DEFAULT;
        const tInnerCoeff = 1 / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
        const eHue = 0.25 * (Math.cos(hueRadians + 2.0) + 3.8);
        const p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
        const hSin = Math.sin(hueRadians);
        const hCos = Math.cos(hueRadians);
        for (let iterationRound = 0; iterationRound < 5; iterationRound++) {
            // ===========================================================
            // Operations inlined from Cam16 to avoid repeated calculation
            // ===========================================================
            const jNormalized = j / 100.0;
            const alpha = chroma === 0.0 || j === 0.0 ? 0.0 : chroma / Math.sqrt(jNormalized);
            const t = Math.pow(alpha * tInnerCoeff, 1.0 / 0.9);
            const ac = viewingConditions.aw *
                Math.pow(jNormalized, 1.0 / viewingConditions.c / viewingConditions.z);
            const p2 = ac / viewingConditions.nbb;
            const gamma = 23.0 * (p2 + 0.305) * t /
                (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
            const a = gamma * hCos;
            const b = gamma * hSin;
            const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
            const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
            const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
            const rCScaled = HctSolver.inverseChromaticAdaptation(rA);
            const gCScaled = HctSolver.inverseChromaticAdaptation(gA);
            const bCScaled = HctSolver.inverseChromaticAdaptation(bA);
            const linrgb = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.matrixMultiply([rCScaled, gCScaled, bCScaled], HctSolver.LINRGB_FROM_SCALED_DISCOUNT);
            // ===========================================================
            // Operations inlined from Cam16 to avoid repeated calculation
            // ===========================================================
            if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) {
                return 0;
            }
            const kR = HctSolver.Y_FROM_LINRGB[0];
            const kG = HctSolver.Y_FROM_LINRGB[1];
            const kB = HctSolver.Y_FROM_LINRGB[2];
            const fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];
            if (fnj <= 0) {
                return 0;
            }
            if (iterationRound === 4 || Math.abs(fnj - y) < 0.002) {
                if (linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01) {
                    return 0;
                }
                return _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromLinrgb(linrgb);
            }
            // Iterates with Newton method,
            // Using 2 * fn(j) / j as the approximation of fn'(j)
            j = j - (fnj - y) * j / (2 * fnj);
        }
        return 0;
    }
    /**
     * Finds an sRGB color with the given hue, chroma, and L*, if
     * possible.
     *
     * @param hueDegrees The desired hue, in degrees.
     * @param chroma The desired chroma.
     * @param lstar The desired L*.
     * @return A hexadecimal representing the sRGB color. The color
     * has sufficiently close hue, chroma, and L* to the desired
     * values, if possible; otherwise, the hue and L* will be
     * sufficiently close, and chroma will be maximized.
     */
    static solveToInt(hueDegrees, chroma, lstar) {
        if (chroma < 0.0001 || lstar < 0.0001 || lstar > 99.9999) {
            return _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromLstar(lstar);
        }
        hueDegrees = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.sanitizeDegreesDouble(hueDegrees);
        const hueRadians = hueDegrees / 180 * Math.PI;
        const y = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(lstar);
        const exactAnswer = HctSolver.findResultByJ(hueRadians, chroma, y);
        if (exactAnswer !== 0) {
            return exactAnswer;
        }
        const linrgb = HctSolver.bisectToLimit(y, hueRadians);
        return _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromLinrgb(linrgb);
    }
    /**
     * Finds an sRGB color with the given hue, chroma, and L*, if
     * possible.
     *
     * @param hueDegrees The desired hue, in degrees.
     * @param chroma The desired chroma.
     * @param lstar The desired L*.
     * @return An CAM16 object representing the sRGB color. The color
     * has sufficiently close hue, chroma, and L* to the desired
     * values, if possible; otherwise, the hue and L* will be
     * sufficiently close, and chroma will be maximized.
     */
    static solveToCam(hueDegrees, chroma, lstar) {
        return _cam16_js__WEBPACK_IMPORTED_MODULE_2__.Cam16.fromInt(HctSolver.solveToInt(hueDegrees, chroma, lstar));
    }
}
HctSolver.SCALED_DISCOUNT_FROM_LINRGB = [
    [
        0.001200833568784504,
        0.002389694492170889,
        0.0002795742885861124,
    ],
    [
        0.0005891086651375999,
        0.0029785502573438758,
        0.0003270666104008398,
    ],
    [
        0.00010146692491640572,
        0.0005364214359186694,
        0.0032979401770712076,
    ],
];
HctSolver.LINRGB_FROM_SCALED_DISCOUNT = [
    [
        1373.2198709594231,
        -1100.4251190754821,
        -7.278681089101213,
    ],
    [
        -271.815969077903,
        559.6580465940733,
        -32.46047482791194,
    ],
    [
        1.9622899599665666,
        -57.173814538844006,
        308.7233197812385,
    ],
];
HctSolver.Y_FROM_LINRGB = [0.2126, 0.7152, 0.0722];
HctSolver.CRITICAL_PLANES = [
    0.015176349177441876, 0.045529047532325624, 0.07588174588720938,
    0.10623444424209313, 0.13658714259697685, 0.16693984095186062,
    0.19729253930674434, 0.2276452376616281, 0.2579979360165119,
    0.28835063437139563, 0.3188300904430532, 0.350925934958123,
    0.3848314933096426, 0.42057480301049466, 0.458183274052838,
    0.4976837250274023, 0.5391024159806381, 0.5824650784040898,
    0.6277969426914107, 0.6751227633498623, 0.7244668422128921,
    0.775853049866786, 0.829304845476233, 0.8848452951698498,
    0.942497089126609, 1.0022825574869039, 1.0642236851973577,
    1.1283421258858297, 1.1946592148522128, 1.2631959812511864,
    1.3339731595349034, 1.407011200216447, 1.4823302800086415,
    1.5599503113873272, 1.6398909516233677, 1.7221716113234105,
    1.8068114625156377, 1.8938294463134073, 1.9832442801866852,
    2.075074464868551, 2.1693382909216234, 2.2660538449872063,
    2.36523901573795, 2.4669114995532007, 2.5710888059345764,
    2.6777882626779785, 2.7870270208169257, 2.898822059350997,
    3.0131901897720907, 3.1301480604002863, 3.2497121605402226,
    3.3718988244681087, 3.4967242352587946, 3.624204428461639,
    3.754355295633311, 3.887192587735158, 4.022731918402185,
    4.160988767090289, 4.301978482107941, 4.445716283538092,
    4.592217266055746, 4.741496401646282, 4.893568542229298,
    5.048448422192488, 5.20615066083972, 5.3666897647573375,
    5.5300801301023865, 5.696336044816294, 5.865471690767354,
    6.037501145825082, 6.212438385869475, 6.390297286737924,
    6.571091626112461, 6.7548350853498045, 6.941541251256611,
    7.131223617812143, 7.323895587840543, 7.5195704746346665,
    7.7182615035334345, 7.919981813454504, 8.124744458384042,
    8.332562408825165, 8.543448553206703, 8.757415699253682,
    8.974476575321063, 9.194643831691977, 9.417930041841839,
    9.644347703669503, 9.873909240696694, 10.106627003236781,
    10.342513269534024, 10.58158024687427, 10.8238400726681,
    11.069304815507364, 11.317986476196008, 11.569896988756009,
    11.825048221409341, 12.083451977536606, 12.345119996613247,
    12.610063955123938, 12.878295467455942, 13.149826086772048,
    13.42466730586372, 13.702830557985108, 13.984327217668513,
    14.269168601521828, 14.55736596900856, 14.848930523210871,
    15.143873411576273, 15.44220572664832, 15.743938506781891,
    16.04908273684337, 16.35764934889634, 16.66964922287304,
    16.985093187232053, 17.30399201960269, 17.62635644741625,
    17.95219714852476, 18.281524751807332, 18.614349837764564,
    18.95068293910138, 19.290534541298456, 19.633915083172692,
    19.98083495742689, 20.331304511189067, 20.685334046541502,
    21.042933821039977, 21.404114048223256, 21.76888489811322,
    22.137256497705877, 22.50923893145328, 22.884842241736916,
    23.264076429332462, 23.6469514538663, 24.033477234264016,
    24.42366364919083, 24.817520537484558, 25.21505769858089,
    25.61628489293138, 26.021211842414342, 26.429848230738664,
    26.842203703840827, 27.258287870275353, 27.678110301598522,
    28.10168053274597, 28.529008062403893, 28.96010235337422,
    29.39497283293396, 29.83362889318845, 30.276079891419332,
    30.722335150426627, 31.172403958865512, 31.62629557157785,
    32.08401920991837, 32.54558406207592, 33.010999283389665,
    33.4802739966603, 33.953417292456834, 34.430438229418264,
    34.911345834551085, 35.39614910352207, 35.88485700094671,
    36.37747846067349, 36.87402238606382, 37.37449765026789,
    37.87891309649659, 38.38727753828926, 38.89959975977785,
    39.41588851594697, 39.93615253289054, 40.460400508064545,
    40.98864111053629, 41.520882981230194, 42.05713473317016,
    42.597404951718396, 43.141702194811224, 43.6900349931913,
    44.24241185063697, 44.798841244188324, 45.35933162437017,
    45.92389141541209, 46.49252901546552, 47.065252796817916,
    47.64207110610409, 48.22299226451468, 48.808024568002054,
    49.3971762874833, 49.9904556690408, 50.587870934119984,
    51.189430279724725, 51.79514187861014, 52.40501387947288,
    53.0190544071392, 53.637271562750364, 54.259673423945976,
    54.88626804504493, 55.517063457223934, 56.15206766869424,
    56.79128866487574, 57.43473440856916, 58.08241284012621,
    58.734331877617365, 59.39049941699807, 60.05092333227251,
    60.715611475655585, 61.38457167773311, 62.057811747619894,
    62.7353394731159, 63.417162620860914, 64.10328893648692,
    64.79372614476921, 65.48848194977529, 66.18756403501224,
    66.89098006357258, 67.59873767827808, 68.31084450182222,
    69.02730813691093, 69.74813616640164, 70.47333615344107,
    71.20291564160104, 71.93688215501312, 72.67524319850172,
    73.41800625771542, 74.16517879925733, 74.9167682708136,
    75.67278210128072, 76.43322770089146, 77.1981124613393,
    77.96744375590167, 78.74122893956174, 79.51947534912904,
    80.30219030335869, 81.08938110306934, 81.88105503125999,
    82.67721935322541, 83.4778813166706, 84.28304815182372,
    85.09272707154808, 85.90692527145302, 86.72564993000343,
    87.54890820862819, 88.3767072518277, 89.2090541872801,
    90.04595612594655, 90.88742016217518, 91.73345337380438,
    92.58406282226491, 93.43925555268066, 94.29903859396902,
    95.16341895893969, 96.03240364439274, 96.9059996312159,
    97.78421388448044, 98.6670533535366, 99.55452497210776,
];
//# sourceMappingURL=hct_solver.js.map

/***/ },

/***/ "0052ca963f59"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewingConditions: () => (/* binding */ ViewingConditions)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 *
 * This class caches intermediate values of the CAM16 conversion process that
 * depend only on viewing conditions, enabling speed ups.
 */
class ViewingConditions {
    /**
     * Create ViewingConditions from a simple, physically relevant, set of
     * parameters.
     *
     * @param whitePoint White point, measured in the XYZ color space.
     *     default = D65, or sunny day afternoon
     * @param adaptingLuminance The luminance of the adapting field. Informally,
     *     how bright it is in the room where the color is viewed. Can be
     *     calculated from lux by multiplying lux by 0.0586. default = 11.72,
     *     or 200 lux.
     * @param backgroundLstar The lightness of the area surrounding the color.
     *     measured by L* in L*a*b*. default = 50.0
     * @param surround A general description of the lighting surrounding the
     *     color. 0 is pitch dark, like watching a movie in a theater. 1.0 is a
     *     dimly light room, like watching TV at home at night. 2.0 means there
     *     is no difference between the lighting on the color and around it.
     *     default = 2.0
     * @param discountingIlluminant Whether the eye accounts for the tint of the
     *     ambient lighting, such as knowing an apple is still red in green light.
     *     default = false, the eye does not perform this process on
     *       self-luminous objects like displays.
     */
    static make(whitePoint = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.whitePointD65(), adaptingLuminance = (200.0 / Math.PI) * _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(50.0) / 100.0, backgroundLstar = 50.0, surround = 2.0, discountingIlluminant = false) {
        const xyz = whitePoint;
        const rW = xyz[0] * 0.401288 + xyz[1] * 0.650173 + xyz[2] * -0.051461;
        const gW = xyz[0] * -0.250268 + xyz[1] * 1.204414 + xyz[2] * 0.045854;
        const bW = xyz[0] * -0.002079 + xyz[1] * 0.048952 + xyz[2] * 0.953127;
        const f = 0.8 + surround / 10.0;
        const c = f >= 0.9 ? _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.lerp(0.59, 0.69, (f - 0.9) * 10.0) :
            _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.lerp(0.525, 0.59, (f - 0.8) * 10.0);
        let d = discountingIlluminant ?
            1.0 :
            f * (1.0 - (1.0 / 3.6) * Math.exp((-adaptingLuminance - 42.0) / 92.0));
        d = d > 1.0 ? 1.0 : d < 0.0 ? 0.0 : d;
        const nc = f;
        const rgbD = [
            d * (100.0 / rW) + 1.0 - d,
            d * (100.0 / gW) + 1.0 - d,
            d * (100.0 / bW) + 1.0 - d,
        ];
        const k = 1.0 / (5.0 * adaptingLuminance + 1.0);
        const k4 = k * k * k * k;
        const k4F = 1.0 - k4;
        const fl = k4 * adaptingLuminance +
            0.1 * k4F * k4F * Math.cbrt(5.0 * adaptingLuminance);
        const n = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(backgroundLstar) / whitePoint[1];
        const z = 1.48 + Math.sqrt(n);
        const nbb = 0.725 / Math.pow(n, 0.2);
        const ncb = nbb;
        const rgbAFactors = [
            Math.pow((fl * rgbD[0] * rW) / 100.0, 0.42),
            Math.pow((fl * rgbD[1] * gW) / 100.0, 0.42),
            Math.pow((fl * rgbD[2] * bW) / 100.0, 0.42),
        ];
        const rgbA = [
            (400.0 * rgbAFactors[0]) / (rgbAFactors[0] + 27.13),
            (400.0 * rgbAFactors[1]) / (rgbAFactors[1] + 27.13),
            (400.0 * rgbAFactors[2]) / (rgbAFactors[2] + 27.13),
        ];
        const aw = (2.0 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;
        return new ViewingConditions(n, aw, nbb, ncb, c, nc, rgbD, fl, Math.pow(fl, 0.25), z);
    }
    /**
     * Parameters are intermediate values of the CAM16 conversion process. Their
     * names are shorthand for technical color science terminology, this class
     * would not benefit from documenting them individually. A brief overview
     * is available in the CAM16 specification, and a complete overview requires
     * a color science textbook, such as Fairchild's Color Appearance Models.
     */
    constructor(n, aw, nbb, ncb, c, nc, rgbD, fl, fLRoot, z) {
        this.n = n;
        this.aw = aw;
        this.nbb = nbb;
        this.ncb = ncb;
        this.c = c;
        this.nc = nc;
        this.rgbD = rgbD;
        this.fl = fl;
        this.fLRoot = fLRoot;
        this.z = z;
    }
}
/** sRGB-like viewing conditions.  */
ViewingConditions.DEFAULT = ViewingConditions.make();
//# sourceMappingURL=viewing_conditions.js.map

/***/ },

/***/ "a4465fb0d4f3"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Blend: () => (/* reexport safe */ _blend_blend_js__WEBPACK_IMPORTED_MODULE_0__.Blend),
/* harmony export */   Cam16: () => (/* reexport safe */ _hct_cam16_js__WEBPACK_IMPORTED_MODULE_6__.Cam16),
/* harmony export */   Contrast: () => (/* reexport safe */ _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_1__.Contrast),
/* harmony export */   CorePalette: () => (/* reexport safe */ _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_9__.CorePalette),
/* harmony export */   DislikeAnalyzer: () => (/* reexport safe */ _dislike_dislike_analyzer_js__WEBPACK_IMPORTED_MODULE_2__.DislikeAnalyzer),
/* harmony export */   DynamicColor: () => (/* reexport safe */ _dynamiccolor_dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__.DynamicColor),
/* harmony export */   DynamicScheme: () => (/* reexport safe */ _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_4__.DynamicScheme),
/* harmony export */   Hct: () => (/* reexport safe */ _hct_hct_js__WEBPACK_IMPORTED_MODULE_7__.Hct),
/* harmony export */   MaterialDynamicColors: () => (/* reexport safe */ _dynamiccolor_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_5__.MaterialDynamicColors),
/* harmony export */   QuantizerCelebi: () => (/* reexport safe */ _quantize_quantizer_celebi_js__WEBPACK_IMPORTED_MODULE_11__.QuantizerCelebi),
/* harmony export */   QuantizerMap: () => (/* reexport safe */ _quantize_quantizer_map_js__WEBPACK_IMPORTED_MODULE_12__.QuantizerMap),
/* harmony export */   QuantizerWsmeans: () => (/* reexport safe */ _quantize_quantizer_wsmeans_js__WEBPACK_IMPORTED_MODULE_13__.QuantizerWsmeans),
/* harmony export */   QuantizerWu: () => (/* reexport safe */ _quantize_quantizer_wu_js__WEBPACK_IMPORTED_MODULE_14__.QuantizerWu),
/* harmony export */   Scheme: () => (/* reexport safe */ _scheme_scheme_js__WEBPACK_IMPORTED_MODULE_15__.Scheme),
/* harmony export */   SchemeAndroid: () => (/* reexport safe */ _scheme_scheme_android_js__WEBPACK_IMPORTED_MODULE_16__.SchemeAndroid),
/* harmony export */   SchemeContent: () => (/* reexport safe */ _scheme_scheme_content_js__WEBPACK_IMPORTED_MODULE_17__.SchemeContent),
/* harmony export */   SchemeExpressive: () => (/* reexport safe */ _scheme_scheme_expressive_js__WEBPACK_IMPORTED_MODULE_18__.SchemeExpressive),
/* harmony export */   SchemeFidelity: () => (/* reexport safe */ _scheme_scheme_fidelity_js__WEBPACK_IMPORTED_MODULE_19__.SchemeFidelity),
/* harmony export */   SchemeFruitSalad: () => (/* reexport safe */ _scheme_scheme_fruit_salad_js__WEBPACK_IMPORTED_MODULE_20__.SchemeFruitSalad),
/* harmony export */   SchemeMonochrome: () => (/* reexport safe */ _scheme_scheme_monochrome_js__WEBPACK_IMPORTED_MODULE_21__.SchemeMonochrome),
/* harmony export */   SchemeNeutral: () => (/* reexport safe */ _scheme_scheme_neutral_js__WEBPACK_IMPORTED_MODULE_22__.SchemeNeutral),
/* harmony export */   SchemeRainbow: () => (/* reexport safe */ _scheme_scheme_rainbow_js__WEBPACK_IMPORTED_MODULE_23__.SchemeRainbow),
/* harmony export */   SchemeTonalSpot: () => (/* reexport safe */ _scheme_scheme_tonal_spot_js__WEBPACK_IMPORTED_MODULE_24__.SchemeTonalSpot),
/* harmony export */   SchemeVibrant: () => (/* reexport safe */ _scheme_scheme_vibrant_js__WEBPACK_IMPORTED_MODULE_25__.SchemeVibrant),
/* harmony export */   Score: () => (/* reexport safe */ _score_score_js__WEBPACK_IMPORTED_MODULE_26__.Score),
/* harmony export */   TemperatureCache: () => (/* reexport safe */ _temperature_temperature_cache_js__WEBPACK_IMPORTED_MODULE_27__.TemperatureCache),
/* harmony export */   TonalPalette: () => (/* reexport safe */ _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_10__.TonalPalette),
/* harmony export */   ViewingConditions: () => (/* reexport safe */ _hct_viewing_conditions_js__WEBPACK_IMPORTED_MODULE_8__.ViewingConditions),
/* harmony export */   alphaFromArgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.alphaFromArgb),
/* harmony export */   applyTheme: () => (/* reexport safe */ _utils_theme_utils_js__WEBPACK_IMPORTED_MODULE_32__.applyTheme),
/* harmony export */   argbFromHex: () => (/* reexport safe */ _utils_string_utils_js__WEBPACK_IMPORTED_MODULE_30__.argbFromHex),
/* harmony export */   argbFromLab: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.argbFromLab),
/* harmony export */   argbFromLinrgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.argbFromLinrgb),
/* harmony export */   argbFromLstar: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.argbFromLstar),
/* harmony export */   argbFromRgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.argbFromRgb),
/* harmony export */   argbFromRgba: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.argbFromRgba),
/* harmony export */   argbFromXyz: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.argbFromXyz),
/* harmony export */   blueFromArgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.blueFromArgb),
/* harmony export */   clampDouble: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.clampDouble),
/* harmony export */   clampInt: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.clampInt),
/* harmony export */   customColor: () => (/* reexport safe */ _utils_theme_utils_js__WEBPACK_IMPORTED_MODULE_32__.customColor),
/* harmony export */   delinearized: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.delinearized),
/* harmony export */   differenceDegrees: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.differenceDegrees),
/* harmony export */   greenFromArgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.greenFromArgb),
/* harmony export */   hexFromArgb: () => (/* reexport safe */ _utils_string_utils_js__WEBPACK_IMPORTED_MODULE_30__.hexFromArgb),
/* harmony export */   isOpaque: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.isOpaque),
/* harmony export */   labFromArgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.labFromArgb),
/* harmony export */   lerp: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.lerp),
/* harmony export */   linearized: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.linearized),
/* harmony export */   lstarFromArgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.lstarFromArgb),
/* harmony export */   lstarFromY: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.lstarFromY),
/* harmony export */   matrixMultiply: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.matrixMultiply),
/* harmony export */   redFromArgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.redFromArgb),
/* harmony export */   rgbaFromArgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.rgbaFromArgb),
/* harmony export */   rotationDirection: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.rotationDirection),
/* harmony export */   sanitizeDegreesDouble: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.sanitizeDegreesDouble),
/* harmony export */   sanitizeDegreesInt: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.sanitizeDegreesInt),
/* harmony export */   signum: () => (/* reexport safe */ _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__.signum),
/* harmony export */   sourceColorFromImage: () => (/* reexport safe */ _utils_image_utils_js__WEBPACK_IMPORTED_MODULE_31__.sourceColorFromImage),
/* harmony export */   themeFromImage: () => (/* reexport safe */ _utils_theme_utils_js__WEBPACK_IMPORTED_MODULE_32__.themeFromImage),
/* harmony export */   themeFromSourceColor: () => (/* reexport safe */ _utils_theme_utils_js__WEBPACK_IMPORTED_MODULE_32__.themeFromSourceColor),
/* harmony export */   whitePointD65: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.whitePointD65),
/* harmony export */   xyzFromArgb: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.xyzFromArgb),
/* harmony export */   yFromLstar: () => (/* reexport safe */ _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__.yFromLstar)
/* harmony export */ });
/* harmony import */ var _blend_blend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("95860925e668");
/* harmony import */ var _contrast_contrast_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("517e90600719");
/* harmony import */ var _dislike_dislike_analyzer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c14890e64efd");
/* harmony import */ var _dynamiccolor_dynamic_color_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("10cdd4ea39cc");
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_material_dynamic_colors_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("bcc70d254bcd");
/* harmony import */ var _hct_cam16_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("bcd1e8163538");
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("3cdc1bb3fe85");
/* harmony import */ var _hct_viewing_conditions_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0052ca963f59");
/* harmony import */ var _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("47393141bc89");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("6a8d616d58de");
/* harmony import */ var _quantize_quantizer_celebi_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("738ea086586b");
/* harmony import */ var _quantize_quantizer_map_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("853cb20da992");
/* harmony import */ var _quantize_quantizer_wsmeans_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("92b533a80928");
/* harmony import */ var _quantize_quantizer_wu_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("2583849a43b9");
/* harmony import */ var _scheme_scheme_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("bcf9088bc193");
/* harmony import */ var _scheme_scheme_android_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("4ac550de11ee");
/* harmony import */ var _scheme_scheme_content_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("fb83e96bf2a5");
/* harmony import */ var _scheme_scheme_expressive_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("55748f5fcbea");
/* harmony import */ var _scheme_scheme_fidelity_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("47e5916d4368");
/* harmony import */ var _scheme_scheme_fruit_salad_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("2d3aad516aec");
/* harmony import */ var _scheme_scheme_monochrome_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("b7825d1e757b");
/* harmony import */ var _scheme_scheme_neutral_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("227ca002a784");
/* harmony import */ var _scheme_scheme_rainbow_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("30c0afe3afd5");
/* harmony import */ var _scheme_scheme_tonal_spot_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("5a6ca393b43b");
/* harmony import */ var _scheme_scheme_vibrant_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("574234a1cfe3");
/* harmony import */ var _score_score_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("217abdf950e0");
/* harmony import */ var _temperature_temperature_cache_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("6e2844c45242");
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__("6d41ddc214ee");
/* harmony import */ var _utils_string_utils_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__("12b386736c08");
/* harmony import */ var _utils_image_utils_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__("e666a2135778");
/* harmony import */ var _utils_theme_utils_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__("b26f78deb86d");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

































//# sourceMappingURL=index.js.map

/***/ },

/***/ "47393141bc89"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CorePalette: () => (/* binding */ CorePalette)
/* harmony export */ });
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3cdc1bb3fe85");
/* harmony import */ var _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6a8d616d58de");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * An intermediate concept between the key color for a UI theme, and a full
 * color scheme. 5 sets of tones are generated, all except one use the same hue
 * as the key color, and all vary in chroma.
 */
class CorePalette {
    /**
     * @param argb ARGB representation of a color
     */
    static of(argb) {
        return new CorePalette(argb, false);
    }
    /**
     * @param argb ARGB representation of a color
     */
    static contentOf(argb) {
        return new CorePalette(argb, true);
    }
    /**
     * Create a [CorePalette] from a set of colors
     */
    static fromColors(colors) {
        return CorePalette.createPaletteFromColors(false, colors);
    }
    /**
     * Create a content [CorePalette] from a set of colors
     */
    static contentFromColors(colors) {
        return CorePalette.createPaletteFromColors(true, colors);
    }
    static createPaletteFromColors(content, colors) {
        const palette = new CorePalette(colors.primary, content);
        if (colors.secondary) {
            const p = new CorePalette(colors.secondary, content);
            palette.a2 = p.a1;
        }
        if (colors.tertiary) {
            const p = new CorePalette(colors.tertiary, content);
            palette.a3 = p.a1;
        }
        if (colors.error) {
            const p = new CorePalette(colors.error, content);
            palette.error = p.a1;
        }
        if (colors.neutral) {
            const p = new CorePalette(colors.neutral, content);
            palette.n1 = p.n1;
        }
        if (colors.neutralVariant) {
            const p = new CorePalette(colors.neutralVariant, content);
            palette.n2 = p.n2;
        }
        return palette;
    }
    constructor(argb, isContent) {
        const hct = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(argb);
        const hue = hct.hue;
        const chroma = hct.chroma;
        if (isContent) {
            this.a1 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue, chroma);
            this.a2 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue, chroma / 3);
            this.a3 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue + 60, chroma / 2);
            this.n1 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 12, 4));
            this.n2 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 6, 8));
        }
        else {
            this.a1 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue, Math.max(48, chroma));
            this.a2 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue, 16);
            this.a3 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue + 60, 24);
            this.n1 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue, 4);
            this.n2 = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(hue, 8);
        }
        this.error = _tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma(25, 84);
    }
}
//# sourceMappingURL=core_palette.js.map

/***/ },

/***/ "6a8d616d58de"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TonalPalette: () => (/* binding */ TonalPalette)
/* harmony export */ });
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3cdc1bb3fe85");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *  A convenience class for retrieving colors that are constant in hue and
 *  chroma, but vary in tone.
 */
class TonalPalette {
    /**
     * @param argb ARGB representation of a color
     * @return Tones matching that color's hue and chroma.
     */
    static fromInt(argb) {
        const hct = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(argb);
        return TonalPalette.fromHct(hct);
    }
    /**
     * @param hct Hct
     * @return Tones matching that color's hue and chroma.
     */
    static fromHct(hct) {
        return new TonalPalette(hct.hue, hct.chroma, hct);
    }
    /**
     * @param hue HCT hue
     * @param chroma HCT chroma
     * @return Tones matching hue and chroma.
     */
    static fromHueAndChroma(hue, chroma) {
        const keyColor = new KeyColor(hue, chroma).create();
        return new TonalPalette(hue, chroma, keyColor);
    }
    constructor(hue, chroma, keyColor) {
        this.hue = hue;
        this.chroma = chroma;
        this.keyColor = keyColor;
        this.cache = new Map();
    }
    /**
     * @param tone HCT tone, measured from 0 to 100.
     * @return ARGB representation of a color with that tone.
     */
    tone(tone) {
        let argb = this.cache.get(tone);
        if (argb === undefined) {
            argb = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(this.hue, this.chroma, tone).toInt();
            this.cache.set(tone, argb);
        }
        return argb;
    }
    /**
     * @param tone HCT tone.
     * @return HCT representation of a color with that tone.
     */
    getHct(tone) {
        return _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(this.tone(tone));
    }
}
/**
 * Key color is a color that represents the hue and chroma of a tonal palette
 */
class KeyColor {
    constructor(hue, requestedChroma) {
        this.hue = hue;
        this.requestedChroma = requestedChroma;
        // Cache that maps tone to max chroma to avoid duplicated HCT calculation.
        this.chromaCache = new Map();
        this.maxChromaValue = 200.0;
    }
    /**
     * Creates a key color from a [hue] and a [chroma].
     * The key color is the first tone, starting from T50, matching the given hue
     * and chroma.
     *
     * @return Key color [Hct]
     */
    create() {
        // Pivot around T50 because T50 has the most chroma available, on
        // average. Thus it is most likely to have a direct answer.
        const pivotTone = 50;
        const toneStepSize = 1;
        // Epsilon to accept values slightly higher than the requested chroma.
        const epsilon = 0.01;
        // Binary search to find the tone that can provide a chroma that is closest
        // to the requested chroma.
        let lowerTone = 0;
        let upperTone = 100;
        while (lowerTone < upperTone) {
            const midTone = Math.floor((lowerTone + upperTone) / 2);
            const isAscending = this.maxChroma(midTone) < this.maxChroma(midTone + toneStepSize);
            const sufficientChroma = this.maxChroma(midTone) >= this.requestedChroma - epsilon;
            if (sufficientChroma) {
                // Either range [lowerTone, midTone] or [midTone, upperTone] has
                // the answer, so search in the range that is closer the pivot tone.
                if (Math.abs(lowerTone - pivotTone) < Math.abs(upperTone - pivotTone)) {
                    upperTone = midTone;
                }
                else {
                    if (lowerTone === midTone) {
                        return _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(this.hue, this.requestedChroma, lowerTone);
                    }
                    lowerTone = midTone;
                }
            }
            else {
                // As there is no sufficient chroma in the midTone, follow the direction
                // to the chroma peak.
                if (isAscending) {
                    lowerTone = midTone + toneStepSize;
                }
                else {
                    // Keep midTone for potential chroma peak.
                    upperTone = midTone;
                }
            }
        }
        return _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(this.hue, this.requestedChroma, lowerTone);
    }
    // Find the maximum chroma for a given tone
    maxChroma(tone) {
        if (this.chromaCache.has(tone)) {
            return this.chromaCache.get(tone);
        }
        const chroma = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(this.hue, this.maxChromaValue, tone).chroma;
        this.chromaCache.set(tone, chroma);
        return chroma;
    }
}
//# sourceMappingURL=tonal_palette.js.map

/***/ },

/***/ "8d7b463281c5"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LabPointProvider: () => (/* binding */ LabPointProvider)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provides conversions needed for K-Means quantization. Converting input to
 * points, and converting the final state of the K-Means algorithm to colors.
 */
class LabPointProvider {
    /**
     * Convert a color represented in ARGB to a 3-element array of L*a*b*
     * coordinates of the color.
     */
    fromInt(argb) {
        return _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.labFromArgb(argb);
    }
    /**
     * Convert a 3-element array to a color represented in ARGB.
     */
    toInt(point) {
        return _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromLab(point[0], point[1], point[2]);
    }
    /**
     * Standard CIE 1976 delta E formula also takes the square root, unneeded
     * here. This method is used by quantization algorithms to compare distance,
     * and the relative ordering is the same, with or without a square root.
     *
     * This relatively minor optimization is helpful because this method is
     * called at least once for each pixel in an image.
     */
    distance(from, to) {
        const dL = from[0] - to[0];
        const dA = from[1] - to[1];
        const dB = from[2] - to[2];
        return dL * dL + dA * dA + dB * dB;
    }
}
//# sourceMappingURL=lab_point_provider.js.map

/***/ },

/***/ "738ea086586b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantizerCelebi: () => (/* binding */ QuantizerCelebi)
/* harmony export */ });
/* harmony import */ var _quantizer_wsmeans_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("92b533a80928");
/* harmony import */ var _quantizer_wu_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2583849a43b9");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * An image quantizer that improves on the quality of a standard K-Means
 * algorithm by setting the K-Means initial state to the output of a Wu
 * quantizer, instead of random centroids. Improves on speed by several
 * optimizations, as implemented in Wsmeans, or Weighted Square Means, K-Means
 * with those optimizations.
 *
 * This algorithm was designed by M. Emre Celebi, and was found in their 2011
 * paper, Improving the Performance of K-Means for Color Quantization.
 * https://arxiv.org/abs/1101.0395
 */
// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable-next-line:class-as-namespace
class QuantizerCelebi {
    /**
     * @param pixels Colors in ARGB format.
     * @param maxColors The number of colors to divide the image into. A lower
     *     number of colors may be returned.
     * @return Map with keys of colors in ARGB format, and values of number of
     *     pixels in the original image that correspond to the color in the
     *     quantized image.
     */
    static quantize(pixels, maxColors) {
        const wu = new _quantizer_wu_js__WEBPACK_IMPORTED_MODULE_1__.QuantizerWu();
        const wuResult = wu.quantize(pixels, maxColors);
        return _quantizer_wsmeans_js__WEBPACK_IMPORTED_MODULE_0__.QuantizerWsmeans.quantize(pixels, wuResult, maxColors);
    }
}
//# sourceMappingURL=quantizer_celebi.js.map

/***/ },

/***/ "853cb20da992"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantizerMap: () => (/* binding */ QuantizerMap)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Quantizes an image into a map, with keys of ARGB colors, and values of the
 * number of times that color appears in the image.
 */
// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable-next-line:class-as-namespace
class QuantizerMap {
    /**
     * @param pixels Colors in ARGB format.
     * @return A Map with keys of ARGB colors, and values of the number of times
     *     the color appears in the image.
     */
    static quantize(pixels) {
        const countByColor = new Map();
        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i];
            const alpha = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.alphaFromArgb(pixel);
            if (alpha < 255) {
                continue;
            }
            countByColor.set(pixel, (countByColor.get(pixel) ?? 0) + 1);
        }
        return countByColor;
    }
}
//# sourceMappingURL=quantizer_map.js.map

/***/ },

/***/ "92b533a80928"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantizerWsmeans: () => (/* binding */ QuantizerWsmeans)
/* harmony export */ });
/* harmony import */ var _lab_point_provider_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8d7b463281c5");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const MAX_ITERATIONS = 10;
const MIN_MOVEMENT_DISTANCE = 3.0;
/**
 * An image quantizer that improves on the speed of a standard K-Means algorithm
 * by implementing several optimizations, including deduping identical pixels
 * and a triangle inequality rule that reduces the number of comparisons needed
 * to identify which cluster a point should be moved to.
 *
 * Wsmeans stands for Weighted Square Means.
 *
 * This algorithm was designed by M. Emre Celebi, and was found in their 2011
 * paper, Improving the Performance of K-Means for Color Quantization.
 * https://arxiv.org/abs/1101.0395
 */
// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable-next-line:class-as-namespace
class QuantizerWsmeans {
    /**
     * @param inputPixels Colors in ARGB format.
     * @param startingClusters Defines the initial state of the quantizer. Passing
     *     an empty array is fine, the implementation will create its own initial
     *     state that leads to reproducible results for the same inputs.
     *     Passing an array that is the result of Wu quantization leads to higher
     *     quality results.
     * @param maxColors The number of colors to divide the image into. A lower
     *     number of colors may be returned.
     * @return Colors in ARGB format.
     */
    static quantize(inputPixels, startingClusters, maxColors) {
        const pixelToCount = new Map();
        const points = new Array();
        const pixels = new Array();
        const pointProvider = new _lab_point_provider_js__WEBPACK_IMPORTED_MODULE_0__.LabPointProvider();
        let pointCount = 0;
        for (let i = 0; i < inputPixels.length; i++) {
            const inputPixel = inputPixels[i];
            const pixelCount = pixelToCount.get(inputPixel);
            if (pixelCount === undefined) {
                pointCount++;
                points.push(pointProvider.fromInt(inputPixel));
                pixels.push(inputPixel);
                pixelToCount.set(inputPixel, 1);
            }
            else {
                pixelToCount.set(inputPixel, pixelCount + 1);
            }
        }
        const counts = new Array();
        for (let i = 0; i < pointCount; i++) {
            const pixel = pixels[i];
            const count = pixelToCount.get(pixel);
            if (count !== undefined) {
                counts[i] = count;
            }
        }
        let clusterCount = Math.min(maxColors, pointCount);
        if (startingClusters.length > 0) {
            clusterCount = Math.min(clusterCount, startingClusters.length);
        }
        const clusters = new Array();
        for (let i = 0; i < startingClusters.length; i++) {
            clusters.push(pointProvider.fromInt(startingClusters[i]));
        }
        const additionalClustersNeeded = clusterCount - clusters.length;
        if (startingClusters.length === 0 && additionalClustersNeeded > 0) {
            for (let i = 0; i < additionalClustersNeeded; i++) {
                const l = Math.random() * 100.0;
                const a = Math.random() * (100.0 - (-100.0) + 1) + -100;
                const b = Math.random() * (100.0 - (-100.0) + 1) + -100;
                clusters.push(new Array(l, a, b));
            }
        }
        const clusterIndices = new Array();
        for (let i = 0; i < pointCount; i++) {
            clusterIndices.push(Math.floor(Math.random() * clusterCount));
        }
        const indexMatrix = new Array();
        for (let i = 0; i < clusterCount; i++) {
            indexMatrix.push(new Array());
            for (let j = 0; j < clusterCount; j++) {
                indexMatrix[i].push(0);
            }
        }
        const distanceToIndexMatrix = new Array();
        for (let i = 0; i < clusterCount; i++) {
            distanceToIndexMatrix.push(new Array());
            for (let j = 0; j < clusterCount; j++) {
                distanceToIndexMatrix[i].push(new DistanceAndIndex());
            }
        }
        const pixelCountSums = new Array();
        for (let i = 0; i < clusterCount; i++) {
            pixelCountSums.push(0);
        }
        for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
            for (let i = 0; i < clusterCount; i++) {
                for (let j = i + 1; j < clusterCount; j++) {
                    const distance = pointProvider.distance(clusters[i], clusters[j]);
                    distanceToIndexMatrix[j][i].distance = distance;
                    distanceToIndexMatrix[j][i].index = i;
                    distanceToIndexMatrix[i][j].distance = distance;
                    distanceToIndexMatrix[i][j].index = j;
                }
                distanceToIndexMatrix[i].sort();
                for (let j = 0; j < clusterCount; j++) {
                    indexMatrix[i][j] = distanceToIndexMatrix[i][j].index;
                }
            }
            let pointsMoved = 0;
            for (let i = 0; i < pointCount; i++) {
                const point = points[i];
                const previousClusterIndex = clusterIndices[i];
                const previousCluster = clusters[previousClusterIndex];
                const previousDistance = pointProvider.distance(point, previousCluster);
                let minimumDistance = previousDistance;
                let newClusterIndex = -1;
                for (let j = 0; j < clusterCount; j++) {
                    if (distanceToIndexMatrix[previousClusterIndex][j].distance >=
                        4 * previousDistance) {
                        continue;
                    }
                    const distance = pointProvider.distance(point, clusters[j]);
                    if (distance < minimumDistance) {
                        minimumDistance = distance;
                        newClusterIndex = j;
                    }
                }
                if (newClusterIndex !== -1) {
                    const distanceChange = Math.abs((Math.sqrt(minimumDistance) - Math.sqrt(previousDistance)));
                    if (distanceChange > MIN_MOVEMENT_DISTANCE) {
                        pointsMoved++;
                        clusterIndices[i] = newClusterIndex;
                    }
                }
            }
            if (pointsMoved === 0 && iteration !== 0) {
                break;
            }
            const componentASums = new Array(clusterCount).fill(0);
            const componentBSums = new Array(clusterCount).fill(0);
            const componentCSums = new Array(clusterCount).fill(0);
            for (let i = 0; i < clusterCount; i++) {
                pixelCountSums[i] = 0;
            }
            for (let i = 0; i < pointCount; i++) {
                const clusterIndex = clusterIndices[i];
                const point = points[i];
                const count = counts[i];
                pixelCountSums[clusterIndex] += count;
                componentASums[clusterIndex] += (point[0] * count);
                componentBSums[clusterIndex] += (point[1] * count);
                componentCSums[clusterIndex] += (point[2] * count);
            }
            for (let i = 0; i < clusterCount; i++) {
                const count = pixelCountSums[i];
                if (count === 0) {
                    clusters[i] = [0.0, 0.0, 0.0];
                    continue;
                }
                const a = componentASums[i] / count;
                const b = componentBSums[i] / count;
                const c = componentCSums[i] / count;
                clusters[i] = [a, b, c];
            }
        }
        const argbToPopulation = new Map();
        for (let i = 0; i < clusterCount; i++) {
            const count = pixelCountSums[i];
            if (count === 0) {
                continue;
            }
            const possibleNewCluster = pointProvider.toInt(clusters[i]);
            if (argbToPopulation.has(possibleNewCluster)) {
                continue;
            }
            argbToPopulation.set(possibleNewCluster, count);
        }
        return argbToPopulation;
    }
}
/**
 *  A wrapper for maintaining a table of distances between K-Means clusters.
 */
class DistanceAndIndex {
    constructor() {
        this.distance = -1;
        this.index = -1;
    }
}
//# sourceMappingURL=quantizer_wsmeans.js.map

/***/ },

/***/ "2583849a43b9"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantizerWu: () => (/* binding */ QuantizerWu)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _quantizer_map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("853cb20da992");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const INDEX_BITS = 5;
const SIDE_LENGTH = 33; // ((1 << INDEX_INDEX_BITS) + 1)
const TOTAL_SIZE = 35937; // SIDE_LENGTH * SIDE_LENGTH * SIDE_LENGTH
const directions = {
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue',
};
/**
 * An image quantizer that divides the image's pixels into clusters by
 * recursively cutting an RGB cube, based on the weight of pixels in each area
 * of the cube.
 *
 * The algorithm was described by Xiaolin Wu in Graphic Gems II, published in
 * 1991.
 */
class QuantizerWu {
    constructor(weights = [], momentsR = [], momentsG = [], momentsB = [], moments = [], cubes = []) {
        this.weights = weights;
        this.momentsR = momentsR;
        this.momentsG = momentsG;
        this.momentsB = momentsB;
        this.moments = moments;
        this.cubes = cubes;
    }
    /**
     * @param pixels Colors in ARGB format.
     * @param maxColors The number of colors to divide the image into. A lower
     *     number of colors may be returned.
     * @return Colors in ARGB format.
     */
    quantize(pixels, maxColors) {
        this.constructHistogram(pixels);
        this.computeMoments();
        const createBoxesResult = this.createBoxes(maxColors);
        const results = this.createResult(createBoxesResult.resultCount);
        return results;
    }
    constructHistogram(pixels) {
        this.weights = Array.from({ length: TOTAL_SIZE }).fill(0);
        this.momentsR = Array.from({ length: TOTAL_SIZE }).fill(0);
        this.momentsG = Array.from({ length: TOTAL_SIZE }).fill(0);
        this.momentsB = Array.from({ length: TOTAL_SIZE }).fill(0);
        this.moments = Array.from({ length: TOTAL_SIZE }).fill(0);
        const countByColor = _quantizer_map_js__WEBPACK_IMPORTED_MODULE_1__.QuantizerMap.quantize(pixels);
        for (const [pixel, count] of countByColor.entries()) {
            const red = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.redFromArgb(pixel);
            const green = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.greenFromArgb(pixel);
            const blue = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.blueFromArgb(pixel);
            const bitsToRemove = 8 - INDEX_BITS;
            const iR = (red >> bitsToRemove) + 1;
            const iG = (green >> bitsToRemove) + 1;
            const iB = (blue >> bitsToRemove) + 1;
            const index = this.getIndex(iR, iG, iB);
            this.weights[index] = (this.weights[index] ?? 0) + count;
            this.momentsR[index] += count * red;
            this.momentsG[index] += count * green;
            this.momentsB[index] += count * blue;
            this.moments[index] += count * (red * red + green * green + blue * blue);
        }
    }
    computeMoments() {
        for (let r = 1; r < SIDE_LENGTH; r++) {
            const area = Array.from({ length: SIDE_LENGTH }).fill(0);
            const areaR = Array.from({ length: SIDE_LENGTH }).fill(0);
            const areaG = Array.from({ length: SIDE_LENGTH }).fill(0);
            const areaB = Array.from({ length: SIDE_LENGTH }).fill(0);
            const area2 = Array.from({ length: SIDE_LENGTH }).fill(0.0);
            for (let g = 1; g < SIDE_LENGTH; g++) {
                let line = 0;
                let lineR = 0;
                let lineG = 0;
                let lineB = 0;
                let line2 = 0.0;
                for (let b = 1; b < SIDE_LENGTH; b++) {
                    const index = this.getIndex(r, g, b);
                    line += this.weights[index];
                    lineR += this.momentsR[index];
                    lineG += this.momentsG[index];
                    lineB += this.momentsB[index];
                    line2 += this.moments[index];
                    area[b] += line;
                    areaR[b] += lineR;
                    areaG[b] += lineG;
                    areaB[b] += lineB;
                    area2[b] += line2;
                    const previousIndex = this.getIndex(r - 1, g, b);
                    this.weights[index] = this.weights[previousIndex] + area[b];
                    this.momentsR[index] = this.momentsR[previousIndex] + areaR[b];
                    this.momentsG[index] = this.momentsG[previousIndex] + areaG[b];
                    this.momentsB[index] = this.momentsB[previousIndex] + areaB[b];
                    this.moments[index] = this.moments[previousIndex] + area2[b];
                }
            }
        }
    }
    createBoxes(maxColors) {
        this.cubes =
            Array.from({ length: maxColors }).fill(0).map(() => new Box());
        const volumeVariance = Array.from({ length: maxColors }).fill(0.0);
        this.cubes[0].r0 = 0;
        this.cubes[0].g0 = 0;
        this.cubes[0].b0 = 0;
        this.cubes[0].r1 = SIDE_LENGTH - 1;
        this.cubes[0].g1 = SIDE_LENGTH - 1;
        this.cubes[0].b1 = SIDE_LENGTH - 1;
        let generatedColorCount = maxColors;
        let next = 0;
        for (let i = 1; i < maxColors; i++) {
            if (this.cut(this.cubes[next], this.cubes[i])) {
                volumeVariance[next] =
                    this.cubes[next].vol > 1 ? this.variance(this.cubes[next]) : 0.0;
                volumeVariance[i] =
                    this.cubes[i].vol > 1 ? this.variance(this.cubes[i]) : 0.0;
            }
            else {
                volumeVariance[next] = 0.0;
                i--;
            }
            next = 0;
            let temp = volumeVariance[0];
            for (let j = 1; j <= i; j++) {
                if (volumeVariance[j] > temp) {
                    temp = volumeVariance[j];
                    next = j;
                }
            }
            if (temp <= 0.0) {
                generatedColorCount = i + 1;
                break;
            }
        }
        return new CreateBoxesResult(maxColors, generatedColorCount);
    }
    createResult(colorCount) {
        const colors = [];
        for (let i = 0; i < colorCount; ++i) {
            const cube = this.cubes[i];
            const weight = this.volume(cube, this.weights);
            if (weight > 0) {
                const r = Math.round(this.volume(cube, this.momentsR) / weight);
                const g = Math.round(this.volume(cube, this.momentsG) / weight);
                const b = Math.round(this.volume(cube, this.momentsB) / weight);
                const color = (255 << 24) | ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) |
                    (b & 0x0ff);
                colors.push(color);
            }
        }
        return colors;
    }
    variance(cube) {
        const dr = this.volume(cube, this.momentsR);
        const dg = this.volume(cube, this.momentsG);
        const db = this.volume(cube, this.momentsB);
        const xx = this.moments[this.getIndex(cube.r1, cube.g1, cube.b1)] -
            this.moments[this.getIndex(cube.r1, cube.g1, cube.b0)] -
            this.moments[this.getIndex(cube.r1, cube.g0, cube.b1)] +
            this.moments[this.getIndex(cube.r1, cube.g0, cube.b0)] -
            this.moments[this.getIndex(cube.r0, cube.g1, cube.b1)] +
            this.moments[this.getIndex(cube.r0, cube.g1, cube.b0)] +
            this.moments[this.getIndex(cube.r0, cube.g0, cube.b1)] -
            this.moments[this.getIndex(cube.r0, cube.g0, cube.b0)];
        const hypotenuse = dr * dr + dg * dg + db * db;
        const volume = this.volume(cube, this.weights);
        return xx - hypotenuse / volume;
    }
    cut(one, two) {
        const wholeR = this.volume(one, this.momentsR);
        const wholeG = this.volume(one, this.momentsG);
        const wholeB = this.volume(one, this.momentsB);
        const wholeW = this.volume(one, this.weights);
        const maxRResult = this.maximize(one, directions.RED, one.r0 + 1, one.r1, wholeR, wholeG, wholeB, wholeW);
        const maxGResult = this.maximize(one, directions.GREEN, one.g0 + 1, one.g1, wholeR, wholeG, wholeB, wholeW);
        const maxBResult = this.maximize(one, directions.BLUE, one.b0 + 1, one.b1, wholeR, wholeG, wholeB, wholeW);
        let direction;
        const maxR = maxRResult.maximum;
        const maxG = maxGResult.maximum;
        const maxB = maxBResult.maximum;
        if (maxR >= maxG && maxR >= maxB) {
            if (maxRResult.cutLocation < 0) {
                return false;
            }
            direction = directions.RED;
        }
        else if (maxG >= maxR && maxG >= maxB) {
            direction = directions.GREEN;
        }
        else {
            direction = directions.BLUE;
        }
        two.r1 = one.r1;
        two.g1 = one.g1;
        two.b1 = one.b1;
        switch (direction) {
            case directions.RED:
                one.r1 = maxRResult.cutLocation;
                two.r0 = one.r1;
                two.g0 = one.g0;
                two.b0 = one.b0;
                break;
            case directions.GREEN:
                one.g1 = maxGResult.cutLocation;
                two.r0 = one.r0;
                two.g0 = one.g1;
                two.b0 = one.b0;
                break;
            case directions.BLUE:
                one.b1 = maxBResult.cutLocation;
                two.r0 = one.r0;
                two.g0 = one.g0;
                two.b0 = one.b1;
                break;
            default:
                throw new Error('unexpected direction ' + direction);
        }
        one.vol = (one.r1 - one.r0) * (one.g1 - one.g0) * (one.b1 - one.b0);
        two.vol = (two.r1 - two.r0) * (two.g1 - two.g0) * (two.b1 - two.b0);
        return true;
    }
    maximize(cube, direction, first, last, wholeR, wholeG, wholeB, wholeW) {
        const bottomR = this.bottom(cube, direction, this.momentsR);
        const bottomG = this.bottom(cube, direction, this.momentsG);
        const bottomB = this.bottom(cube, direction, this.momentsB);
        const bottomW = this.bottom(cube, direction, this.weights);
        let max = 0.0;
        let cut = -1;
        let halfR = 0;
        let halfG = 0;
        let halfB = 0;
        let halfW = 0;
        for (let i = first; i < last; i++) {
            halfR = bottomR + this.top(cube, direction, i, this.momentsR);
            halfG = bottomG + this.top(cube, direction, i, this.momentsG);
            halfB = bottomB + this.top(cube, direction, i, this.momentsB);
            halfW = bottomW + this.top(cube, direction, i, this.weights);
            if (halfW === 0) {
                continue;
            }
            let tempNumerator = (halfR * halfR + halfG * halfG + halfB * halfB) * 1.0;
            let tempDenominator = halfW * 1.0;
            let temp = tempNumerator / tempDenominator;
            halfR = wholeR - halfR;
            halfG = wholeG - halfG;
            halfB = wholeB - halfB;
            halfW = wholeW - halfW;
            if (halfW === 0) {
                continue;
            }
            tempNumerator = (halfR * halfR + halfG * halfG + halfB * halfB) * 1.0;
            tempDenominator = halfW * 1.0;
            temp += tempNumerator / tempDenominator;
            if (temp > max) {
                max = temp;
                cut = i;
            }
        }
        return new MaximizeResult(cut, max);
    }
    volume(cube, moment) {
        return (moment[this.getIndex(cube.r1, cube.g1, cube.b1)] -
            moment[this.getIndex(cube.r1, cube.g1, cube.b0)] -
            moment[this.getIndex(cube.r1, cube.g0, cube.b1)] +
            moment[this.getIndex(cube.r1, cube.g0, cube.b0)] -
            moment[this.getIndex(cube.r0, cube.g1, cube.b1)] +
            moment[this.getIndex(cube.r0, cube.g1, cube.b0)] +
            moment[this.getIndex(cube.r0, cube.g0, cube.b1)] -
            moment[this.getIndex(cube.r0, cube.g0, cube.b0)]);
    }
    bottom(cube, direction, moment) {
        switch (direction) {
            case directions.RED:
                return (-moment[this.getIndex(cube.r0, cube.g1, cube.b1)] +
                    moment[this.getIndex(cube.r0, cube.g1, cube.b0)] +
                    moment[this.getIndex(cube.r0, cube.g0, cube.b1)] -
                    moment[this.getIndex(cube.r0, cube.g0, cube.b0)]);
            case directions.GREEN:
                return (-moment[this.getIndex(cube.r1, cube.g0, cube.b1)] +
                    moment[this.getIndex(cube.r1, cube.g0, cube.b0)] +
                    moment[this.getIndex(cube.r0, cube.g0, cube.b1)] -
                    moment[this.getIndex(cube.r0, cube.g0, cube.b0)]);
            case directions.BLUE:
                return (-moment[this.getIndex(cube.r1, cube.g1, cube.b0)] +
                    moment[this.getIndex(cube.r1, cube.g0, cube.b0)] +
                    moment[this.getIndex(cube.r0, cube.g1, cube.b0)] -
                    moment[this.getIndex(cube.r0, cube.g0, cube.b0)]);
            default:
                throw new Error('unexpected direction $direction');
        }
    }
    top(cube, direction, position, moment) {
        switch (direction) {
            case directions.RED:
                return (moment[this.getIndex(position, cube.g1, cube.b1)] -
                    moment[this.getIndex(position, cube.g1, cube.b0)] -
                    moment[this.getIndex(position, cube.g0, cube.b1)] +
                    moment[this.getIndex(position, cube.g0, cube.b0)]);
            case directions.GREEN:
                return (moment[this.getIndex(cube.r1, position, cube.b1)] -
                    moment[this.getIndex(cube.r1, position, cube.b0)] -
                    moment[this.getIndex(cube.r0, position, cube.b1)] +
                    moment[this.getIndex(cube.r0, position, cube.b0)]);
            case directions.BLUE:
                return (moment[this.getIndex(cube.r1, cube.g1, position)] -
                    moment[this.getIndex(cube.r1, cube.g0, position)] -
                    moment[this.getIndex(cube.r0, cube.g1, position)] +
                    moment[this.getIndex(cube.r0, cube.g0, position)]);
            default:
                throw new Error('unexpected direction $direction');
        }
    }
    getIndex(r, g, b) {
        return (r << (INDEX_BITS * 2)) + (r << (INDEX_BITS + 1)) + r +
            (g << INDEX_BITS) + g + b;
    }
}
/**
 * Keeps track of the state of each box created as the Wu  quantization
 * algorithm progresses through dividing the image's pixels as plotted in RGB.
 */
class Box {
    constructor(r0 = 0, r1 = 0, g0 = 0, g1 = 0, b0 = 0, b1 = 0, vol = 0) {
        this.r0 = r0;
        this.r1 = r1;
        this.g0 = g0;
        this.g1 = g1;
        this.b0 = b0;
        this.b1 = b1;
        this.vol = vol;
    }
}
/**
 * Represents final result of Wu algorithm.
 */
class CreateBoxesResult {
    /**
     * @param requestedCount how many colors the caller asked to be returned from
     *     quantization.
     * @param resultCount the actual number of colors achieved from quantization.
     *     May be lower than the requested count.
     */
    constructor(requestedCount, resultCount) {
        this.requestedCount = requestedCount;
        this.resultCount = resultCount;
    }
}
/**
 * Represents the result of calculating where to cut an existing box in such
 * a way to maximize variance between the two new boxes created by a cut.
 */
class MaximizeResult {
    constructor(cutLocation, maximum) {
        this.cutLocation = cutLocation;
        this.maximum = maximum;
    }
}
//# sourceMappingURL=quantizer_wu.js.map

/***/ },

/***/ "bcf9088bc193"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scheme: () => (/* binding */ Scheme)
/* harmony export */ });
/* harmony import */ var _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("47393141bc89");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.

/**
 * DEPRECATED. The `Scheme` class is deprecated in favor of `DynamicScheme`.
 * Please see
 * https://github.com/material-foundation/material-color-utilities/blob/main/make_schemes.md
 * for migration guidance.
 *
 * Represents a Material color scheme, a mapping of color roles to colors.
 */
class Scheme {
    get primary() {
        return this.props.primary;
    }
    get onPrimary() {
        return this.props.onPrimary;
    }
    get primaryContainer() {
        return this.props.primaryContainer;
    }
    get onPrimaryContainer() {
        return this.props.onPrimaryContainer;
    }
    get secondary() {
        return this.props.secondary;
    }
    get onSecondary() {
        return this.props.onSecondary;
    }
    get secondaryContainer() {
        return this.props.secondaryContainer;
    }
    get onSecondaryContainer() {
        return this.props.onSecondaryContainer;
    }
    get tertiary() {
        return this.props.tertiary;
    }
    get onTertiary() {
        return this.props.onTertiary;
    }
    get tertiaryContainer() {
        return this.props.tertiaryContainer;
    }
    get onTertiaryContainer() {
        return this.props.onTertiaryContainer;
    }
    get error() {
        return this.props.error;
    }
    get onError() {
        return this.props.onError;
    }
    get errorContainer() {
        return this.props.errorContainer;
    }
    get onErrorContainer() {
        return this.props.onErrorContainer;
    }
    get background() {
        return this.props.background;
    }
    get onBackground() {
        return this.props.onBackground;
    }
    get surface() {
        return this.props.surface;
    }
    get onSurface() {
        return this.props.onSurface;
    }
    get surfaceVariant() {
        return this.props.surfaceVariant;
    }
    get onSurfaceVariant() {
        return this.props.onSurfaceVariant;
    }
    get outline() {
        return this.props.outline;
    }
    get outlineVariant() {
        return this.props.outlineVariant;
    }
    get shadow() {
        return this.props.shadow;
    }
    get scrim() {
        return this.props.scrim;
    }
    get inverseSurface() {
        return this.props.inverseSurface;
    }
    get inverseOnSurface() {
        return this.props.inverseOnSurface;
    }
    get inversePrimary() {
        return this.props.inversePrimary;
    }
    /**
     * @param argb ARGB representation of a color.
     * @return Light Material color scheme, based on the color's hue.
     */
    static light(argb) {
        return Scheme.lightFromCorePalette(_palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__.CorePalette.of(argb));
    }
    /**
     * @param argb ARGB representation of a color.
     * @return Dark Material color scheme, based on the color's hue.
     */
    static dark(argb) {
        return Scheme.darkFromCorePalette(_palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__.CorePalette.of(argb));
    }
    /**
     * @param argb ARGB representation of a color.
     * @return Light Material content color scheme, based on the color's hue.
     */
    static lightContent(argb) {
        return Scheme.lightFromCorePalette(_palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__.CorePalette.contentOf(argb));
    }
    /**
     * @param argb ARGB representation of a color.
     * @return Dark Material content color scheme, based on the color's hue.
     */
    static darkContent(argb) {
        return Scheme.darkFromCorePalette(_palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__.CorePalette.contentOf(argb));
    }
    /**
     * Light scheme from core palette
     */
    static lightFromCorePalette(core) {
        return new Scheme({
            primary: core.a1.tone(40),
            onPrimary: core.a1.tone(100),
            primaryContainer: core.a1.tone(90),
            onPrimaryContainer: core.a1.tone(10),
            secondary: core.a2.tone(40),
            onSecondary: core.a2.tone(100),
            secondaryContainer: core.a2.tone(90),
            onSecondaryContainer: core.a2.tone(10),
            tertiary: core.a3.tone(40),
            onTertiary: core.a3.tone(100),
            tertiaryContainer: core.a3.tone(90),
            onTertiaryContainer: core.a3.tone(10),
            error: core.error.tone(40),
            onError: core.error.tone(100),
            errorContainer: core.error.tone(90),
            onErrorContainer: core.error.tone(10),
            background: core.n1.tone(99),
            onBackground: core.n1.tone(10),
            surface: core.n1.tone(99),
            onSurface: core.n1.tone(10),
            surfaceVariant: core.n2.tone(90),
            onSurfaceVariant: core.n2.tone(30),
            outline: core.n2.tone(50),
            outlineVariant: core.n2.tone(80),
            shadow: core.n1.tone(0),
            scrim: core.n1.tone(0),
            inverseSurface: core.n1.tone(20),
            inverseOnSurface: core.n1.tone(95),
            inversePrimary: core.a1.tone(80)
        });
    }
    /**
     * Dark scheme from core palette
     */
    static darkFromCorePalette(core) {
        return new Scheme({
            primary: core.a1.tone(80),
            onPrimary: core.a1.tone(20),
            primaryContainer: core.a1.tone(30),
            onPrimaryContainer: core.a1.tone(90),
            secondary: core.a2.tone(80),
            onSecondary: core.a2.tone(20),
            secondaryContainer: core.a2.tone(30),
            onSecondaryContainer: core.a2.tone(90),
            tertiary: core.a3.tone(80),
            onTertiary: core.a3.tone(20),
            tertiaryContainer: core.a3.tone(30),
            onTertiaryContainer: core.a3.tone(90),
            error: core.error.tone(80),
            onError: core.error.tone(20),
            errorContainer: core.error.tone(30),
            onErrorContainer: core.error.tone(80),
            background: core.n1.tone(10),
            onBackground: core.n1.tone(90),
            surface: core.n1.tone(10),
            onSurface: core.n1.tone(90),
            surfaceVariant: core.n2.tone(30),
            onSurfaceVariant: core.n2.tone(80),
            outline: core.n2.tone(60),
            outlineVariant: core.n2.tone(30),
            shadow: core.n1.tone(0),
            scrim: core.n1.tone(0),
            inverseSurface: core.n1.tone(90),
            inverseOnSurface: core.n1.tone(20),
            inversePrimary: core.a1.tone(40)
        });
    }
    constructor(props) {
        this.props = props;
    }
    toJSON() {
        return {
            ...this.props
        };
    }
}
//# sourceMappingURL=scheme.js.map

/***/ },

/***/ "4ac550de11ee"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeAndroid: () => (/* binding */ SchemeAndroid)
/* harmony export */ });
/* harmony import */ var _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("47393141bc89");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Represents an Android 12 color scheme, a mapping of color roles to colors.
 */
class SchemeAndroid {
    get colorAccentPrimary() {
        return this.props.colorAccentPrimary;
    }
    get colorAccentPrimaryVariant() {
        return this.props.colorAccentPrimaryVariant;
    }
    get colorAccentSecondary() {
        return this.props.colorAccentSecondary;
    }
    get colorAccentSecondaryVariant() {
        return this.props.colorAccentSecondaryVariant;
    }
    get colorAccentTertiary() {
        return this.props.colorAccentTertiary;
    }
    get colorAccentTertiaryVariant() {
        return this.props.colorAccentTertiaryVariant;
    }
    get textColorPrimary() {
        return this.props.textColorPrimary;
    }
    get textColorSecondary() {
        return this.props.textColorSecondary;
    }
    get textColorTertiary() {
        return this.props.textColorTertiary;
    }
    get textColorPrimaryInverse() {
        return this.props.textColorPrimaryInverse;
    }
    get textColorSecondaryInverse() {
        return this.props.textColorSecondaryInverse;
    }
    get textColorTertiaryInverse() {
        return this.props.textColorTertiaryInverse;
    }
    get colorBackground() {
        return this.props.colorBackground;
    }
    get colorBackgroundFloating() {
        return this.props.colorBackgroundFloating;
    }
    get colorSurface() {
        return this.props.colorSurface;
    }
    get colorSurfaceVariant() {
        return this.props.colorSurfaceVariant;
    }
    get colorSurfaceHighlight() {
        return this.props.colorSurfaceHighlight;
    }
    get surfaceHeader() {
        return this.props.surfaceHeader;
    }
    get underSurface() {
        return this.props.underSurface;
    }
    get offState() {
        return this.props.offState;
    }
    get accentSurface() {
        return this.props.accentSurface;
    }
    get textPrimaryOnAccent() {
        return this.props.textPrimaryOnAccent;
    }
    get textSecondaryOnAccent() {
        return this.props.textSecondaryOnAccent;
    }
    get volumeBackground() {
        return this.props.volumeBackground;
    }
    get scrim() {
        return this.props.scrim;
    }
    /**
     * @param argb ARGB representation of a color.
     * @return Light Material color scheme, based on the color's hue.
     */
    static light(argb) {
        const core = _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__.CorePalette.of(argb);
        return SchemeAndroid.lightFromCorePalette(core);
    }
    /**
     * @param argb ARGB representation of a color.
     * @return Dark Material color scheme, based on the color's hue.
     */
    static dark(argb) {
        const core = _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__.CorePalette.of(argb);
        return SchemeAndroid.darkFromCorePalette(core);
    }
    /**
     * @param argb ARGB representation of a color.
     * @return Light Android color scheme, based on the color's hue.
     */
    static lightContent(argb) {
        const core = _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__.CorePalette.contentOf(argb);
        return SchemeAndroid.lightFromCorePalette(core);
    }
    /**
     * @param argb ARGB representation of a color.
     * @return Dark Android color scheme, based on the color's hue.
     */
    static darkContent(argb) {
        const core = _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_0__.CorePalette.contentOf(argb);
        return SchemeAndroid.darkFromCorePalette(core);
    }
    /**
     * Light scheme from core palette
     */
    static lightFromCorePalette(core) {
        return new SchemeAndroid({
            colorAccentPrimary: core.a1.tone(90),
            colorAccentPrimaryVariant: core.a1.tone(40),
            colorAccentSecondary: core.a2.tone(90),
            colorAccentSecondaryVariant: core.a2.tone(40),
            colorAccentTertiary: core.a3.tone(90),
            colorAccentTertiaryVariant: core.a3.tone(40),
            textColorPrimary: core.n1.tone(10),
            textColorSecondary: core.n2.tone(30),
            textColorTertiary: core.n2.tone(50),
            textColorPrimaryInverse: core.n1.tone(95),
            textColorSecondaryInverse: core.n1.tone(80),
            textColorTertiaryInverse: core.n1.tone(60),
            colorBackground: core.n1.tone(95),
            colorBackgroundFloating: core.n1.tone(98),
            colorSurface: core.n1.tone(98),
            colorSurfaceVariant: core.n1.tone(90),
            colorSurfaceHighlight: core.n1.tone(100),
            surfaceHeader: core.n1.tone(90),
            underSurface: core.n1.tone(0),
            offState: core.n1.tone(20),
            accentSurface: core.a2.tone(95),
            textPrimaryOnAccent: core.n1.tone(10),
            textSecondaryOnAccent: core.n2.tone(30),
            volumeBackground: core.n1.tone(25),
            scrim: core.n1.tone(80),
        });
    }
    /**
     * Dark scheme from core palette
     */
    static darkFromCorePalette(core) {
        return new SchemeAndroid({
            colorAccentPrimary: core.a1.tone(90),
            colorAccentPrimaryVariant: core.a1.tone(70),
            colorAccentSecondary: core.a2.tone(90),
            colorAccentSecondaryVariant: core.a2.tone(70),
            colorAccentTertiary: core.a3.tone(90),
            colorAccentTertiaryVariant: core.a3.tone(70),
            textColorPrimary: core.n1.tone(95),
            textColorSecondary: core.n2.tone(80),
            textColorTertiary: core.n2.tone(60),
            textColorPrimaryInverse: core.n1.tone(10),
            textColorSecondaryInverse: core.n1.tone(30),
            textColorTertiaryInverse: core.n1.tone(50),
            colorBackground: core.n1.tone(10),
            colorBackgroundFloating: core.n1.tone(10),
            colorSurface: core.n1.tone(20),
            colorSurfaceVariant: core.n1.tone(30),
            colorSurfaceHighlight: core.n1.tone(35),
            surfaceHeader: core.n1.tone(30),
            underSurface: core.n1.tone(0),
            offState: core.n1.tone(20),
            accentSurface: core.a2.tone(95),
            textPrimaryOnAccent: core.n1.tone(10),
            textSecondaryOnAccent: core.n2.tone(30),
            volumeBackground: core.n1.tone(25),
            scrim: core.n1.tone(80),
        });
    }
    constructor(props) {
        this.props = props;
    }
    toJSON() {
        return { ...this.props };
    }
}
//# sourceMappingURL=scheme_android.js.map

/***/ },

/***/ "fb83e96bf2a5"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeContent: () => (/* binding */ SchemeContent)
/* harmony export */ });
/* harmony import */ var _dislike_dislike_analyzer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c14890e64efd");
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6a8d616d58de");
/* harmony import */ var _temperature_temperature_cache_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6e2844c45242");
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */





/**
 * A scheme that places the source color in `Scheme.primaryContainer`.
 *
 * Primary Container is the source color, adjusted for color relativity.
 * It maintains constant appearance in light mode and dark mode.
 * This adds ~5 tone in light mode, and subtracts ~5 tone in dark mode.
 * Tertiary Container is the complement to the source color, using
 * `TemperatureCache`. It also maintains constant appearance.
 */
class SchemeContent extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_1__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_2__.Variant.CONTENT,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, Math.max(sourceColorHct.chroma - 32.0, sourceColorHct.chroma * 0.5)),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromInt(_dislike_dislike_analyzer_js__WEBPACK_IMPORTED_MODULE_0__.DislikeAnalyzer
                .fixIfDisliked(new _temperature_temperature_cache_js__WEBPACK_IMPORTED_MODULE_4__.TemperatureCache(sourceColorHct).analogous(3, 6)[2])
                .toInt()),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / 8.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / 8.0 + 4.0),
        });
    }
}
//# sourceMappingURL=scheme_content.js.map

/***/ },

/***/ "55748f5fcbea"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeExpressive: () => (/* binding */ SchemeExpressive)
/* harmony export */ });
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6a8d616d58de");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




/**
 * A Dynamic Color theme that is intentionally detached from the source color.
 */
class SchemeExpressive extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__.Variant.EXPRESSIVE,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeDegreesDouble(sourceColorHct.hue + 240.0), 40.0),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme.getRotatedHue(sourceColorHct, SchemeExpressive.hues, SchemeExpressive.secondaryRotations), 24.0),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme.getRotatedHue(sourceColorHct, SchemeExpressive.hues, SchemeExpressive.tertiaryRotations), 32.0),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue + 15, 8.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue + 15, 12.0),
        });
    }
}
/**
 * Hues (in degrees) used at breakpoints such that designers can specify a
 * hue rotation that occurs at a given break point.
 */
SchemeExpressive.hues = [
    0.0,
    21.0,
    51.0,
    121.0,
    151.0,
    191.0,
    271.0,
    321.0,
    360.0,
];
/**
 * Hue rotations (in degrees) of the Secondary [TonalPalette],
 * corresponding to the breakpoints in [hues].
 */
SchemeExpressive.secondaryRotations = [
    45.0,
    95.0,
    45.0,
    20.0,
    45.0,
    90.0,
    45.0,
    45.0,
    45.0,
];
/**
 * Hue rotations (in degrees) of the Tertiary [TonalPalette],
 * corresponding to the breakpoints in [hues].
 */
SchemeExpressive.tertiaryRotations = [
    120.0,
    120.0,
    20.0,
    45.0,
    20.0,
    15.0,
    20.0,
    120.0,
    120.0,
];
//# sourceMappingURL=scheme_expressive.js.map

/***/ },

/***/ "47e5916d4368"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeFidelity: () => (/* binding */ SchemeFidelity)
/* harmony export */ });
/* harmony import */ var _dislike_dislike_analyzer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c14890e64efd");
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6a8d616d58de");
/* harmony import */ var _temperature_temperature_cache_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6e2844c45242");
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */





/**
 * A scheme that places the source color in `Scheme.primaryContainer`.
 *
 * Primary Container is the source color, adjusted for color relativity.
 * It maintains constant appearance in light mode and dark mode.
 * This adds ~5 tone in light mode, and subtracts ~5 tone in dark mode.
 * Tertiary Container is the complement to the source color, using
 * `TemperatureCache`. It also maintains constant appearance.
 */
class SchemeFidelity extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_1__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_2__.Variant.FIDELITY,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, Math.max(sourceColorHct.chroma - 32.0, sourceColorHct.chroma * 0.5)),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromInt(_dislike_dislike_analyzer_js__WEBPACK_IMPORTED_MODULE_0__.DislikeAnalyzer
                .fixIfDisliked(new _temperature_temperature_cache_js__WEBPACK_IMPORTED_MODULE_4__.TemperatureCache(sourceColorHct).complement)
                .toInt()),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / 8.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_3__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / 8.0 + 4.0),
        });
    }
}
//# sourceMappingURL=scheme_fidelity.js.map

/***/ },

/***/ "2d3aad516aec"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeFruitSalad: () => (/* binding */ SchemeFruitSalad)
/* harmony export */ });
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6a8d616d58de");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




/**
 * A playful theme - the source color's hue does not appear in the theme.
 */
class SchemeFruitSalad extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__.Variant.FRUIT_SALAD,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeDegreesDouble(sourceColorHct.hue - 50.0), 48.0),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeDegreesDouble(sourceColorHct.hue - 50.0), 36.0),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 36.0),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 10.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16.0),
        });
    }
}
//# sourceMappingURL=scheme_fruit_salad.js.map

/***/ },

/***/ "b7825d1e757b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeMonochrome: () => (/* binding */ SchemeMonochrome)
/* harmony export */ });
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6a8d616d58de");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/** A Dynamic Color theme that is grayscale. */
class SchemeMonochrome extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__.Variant.MONOCHROME,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0.0),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0.0),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0.0),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0.0),
        });
    }
}
//# sourceMappingURL=scheme_monochrome.js.map

/***/ },

/***/ "227ca002a784"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeNeutral: () => (/* binding */ SchemeNeutral)
/* harmony export */ });
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6a8d616d58de");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/** A Dynamic Color theme that is near grayscale. */
class SchemeNeutral extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__.Variant.NEUTRAL,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 12.0),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 8.0),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16.0),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 2.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 2.0),
        });
    }
}
//# sourceMappingURL=scheme_neutral.js.map

/***/ },

/***/ "30c0afe3afd5"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeRainbow: () => (/* binding */ SchemeRainbow)
/* harmony export */ });
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6a8d616d58de");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




/**
 * A playful theme - the source color's hue does not appear in the theme.
 */
class SchemeRainbow extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__.Variant.RAINBOW,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 48.0),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16.0),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeDegreesDouble(sourceColorHct.hue + 60.0), 24.0),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0.0),
        });
    }
}
//# sourceMappingURL=scheme_rainbow.js.map

/***/ },

/***/ "5a6ca393b43b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeTonalSpot: () => (/* binding */ SchemeTonalSpot)
/* harmony export */ });
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6a8d616d58de");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




/**
 * A Dynamic Color theme with low to medium colorfulness and a Tertiary
 * TonalPalette with a hue related to the source color.
 *
 * The default Material You theme on Android 12 and 13.
 */
class SchemeTonalSpot extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__.Variant.TONAL_SPOT,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 36.0),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16.0),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeDegreesDouble(sourceColorHct.hue + 60.0), 24.0),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 6.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 8.0),
        });
    }
}
//# sourceMappingURL=scheme_tonal_spot.js.map

/***/ },

/***/ "574234a1cfe3"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchemeVibrant: () => (/* binding */ SchemeVibrant)
/* harmony export */ });
/* harmony import */ var _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("18c2b362ecf9");
/* harmony import */ var _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c8e12e65ddb");
/* harmony import */ var _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6a8d616d58de");
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * A Dynamic Color theme that maxes out colorfulness at each position in the
 * Primary Tonal Palette.
 */
class SchemeVibrant extends _dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
        super({
            sourceColorArgb: sourceColorHct.toInt(),
            variant: _dynamiccolor_variant_js__WEBPACK_IMPORTED_MODULE_1__.Variant.VIBRANT,
            contrastLevel,
            isDark,
            primaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 200.0),
            secondaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme.getRotatedHue(sourceColorHct, SchemeVibrant.hues, SchemeVibrant.secondaryRotations), 24.0),
            tertiaryPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(_dynamiccolor_dynamic_scheme_js__WEBPACK_IMPORTED_MODULE_0__.DynamicScheme.getRotatedHue(sourceColorHct, SchemeVibrant.hues, SchemeVibrant.tertiaryRotations), 32.0),
            neutralPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 10.0),
            neutralVariantPalette: _palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_2__.TonalPalette.fromHueAndChroma(sourceColorHct.hue, 12.0),
        });
    }
}
/**
 * Hues (in degrees) used at breakpoints such that designers can specify a
 * hue rotation that occurs at a given break point.
 */
SchemeVibrant.hues = [
    0.0,
    41.0,
    61.0,
    101.0,
    131.0,
    181.0,
    251.0,
    301.0,
    360.0,
];
/**
 * Hue rotations (in degrees) of the Secondary [TonalPalette],
 * corresponding to the breakpoints in [hues].
 */
SchemeVibrant.secondaryRotations = [
    18.0,
    15.0,
    10.0,
    12.0,
    15.0,
    18.0,
    15.0,
    12.0,
    12.0,
];
/**
 * Hue rotations (in degrees) of the Tertiary [TonalPalette],
 * corresponding to the breakpoints in [hues].
 */
SchemeVibrant.tertiaryRotations = [
    35.0,
    30.0,
    20.0,
    25.0,
    30.0,
    35.0,
    30.0,
    25.0,
    25.0,
];
//# sourceMappingURL=scheme_vibrant.js.map

/***/ },

/***/ "217abdf950e0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Score: () => (/* binding */ Score)
/* harmony export */ });
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3cdc1bb3fe85");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const SCORE_OPTION_DEFAULTS = {
    desired: 4,
    fallbackColorARGB: 0xff4285f4,
    filter: true, // Avoid unsuitable colors.
};
function compare(a, b) {
    if (a.score > b.score) {
        return -1;
    }
    else if (a.score < b.score) {
        return 1;
    }
    return 0;
}
/**
 *  Given a large set of colors, remove colors that are unsuitable for a UI
 *  theme, and rank the rest based on suitability.
 *
 *  Enables use of a high cluster count for image quantization, thus ensuring
 *  colors aren't muddied, while curating the high cluster count to a much
 *  smaller number of appropriate choices.
 */
class Score {
    constructor() { }
    /**
     * Given a map with keys of colors and values of how often the color appears,
     * rank the colors based on suitability for being used for a UI theme.
     *
     * @param colorsToPopulation map with keys of colors and values of how often
     *     the color appears, usually from a source image.
     * @param {ScoreOptions} options optional parameters.
     * @return Colors sorted by suitability for a UI theme. The most suitable
     *     color is the first item, the least suitable is the last. There will
     *     always be at least one color returned. If all the input colors
     *     were not suitable for a theme, a default fallback color will be
     *     provided, Google Blue.
     */
    static score(colorsToPopulation, options) {
        const { desired, fallbackColorARGB, filter } = { ...SCORE_OPTION_DEFAULTS, ...options };
        // Get the HCT color for each Argb value, while finding the per hue count and
        // total count.
        const colorsHct = [];
        const huePopulation = new Array(360).fill(0);
        let populationSum = 0;
        for (const [argb, population] of colorsToPopulation.entries()) {
            const hct = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(argb);
            colorsHct.push(hct);
            const hue = Math.floor(hct.hue);
            huePopulation[hue] += population;
            populationSum += population;
        }
        // Hues with more usage in neighboring 30 degree slice get a larger number.
        const hueExcitedProportions = new Array(360).fill(0.0);
        for (let hue = 0; hue < 360; hue++) {
            const proportion = huePopulation[hue] / populationSum;
            for (let i = hue - 14; i < hue + 16; i++) {
                const neighborHue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.sanitizeDegreesInt(i);
                hueExcitedProportions[neighborHue] += proportion;
            }
        }
        // Scores each HCT color based on usage and chroma, while optionally
        // filtering out values that do not have enough chroma or usage.
        const scoredHct = new Array();
        for (const hct of colorsHct) {
            const hue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.sanitizeDegreesInt(Math.round(hct.hue));
            const proportion = hueExcitedProportions[hue];
            if (filter && (hct.chroma < Score.CUTOFF_CHROMA || proportion <= Score.CUTOFF_EXCITED_PROPORTION)) {
                continue;
            }
            const proportionScore = proportion * 100.0 * Score.WEIGHT_PROPORTION;
            const chromaWeight = hct.chroma < Score.TARGET_CHROMA ? Score.WEIGHT_CHROMA_BELOW : Score.WEIGHT_CHROMA_ABOVE;
            const chromaScore = (hct.chroma - Score.TARGET_CHROMA) * chromaWeight;
            const score = proportionScore + chromaScore;
            scoredHct.push({ hct, score });
        }
        // Sorted so that colors with higher scores come first.
        scoredHct.sort(compare);
        // Iterates through potential hue differences in degrees in order to select
        // the colors with the largest distribution of hues possible. Starting at
        // 90 degrees(maximum difference for 4 colors) then decreasing down to a
        // 15 degree minimum.
        const chosenColors = [];
        for (let differenceDegrees = 90; differenceDegrees >= 15; differenceDegrees--) {
            chosenColors.length = 0;
            for (const { hct } of scoredHct) {
                const duplicateHue = chosenColors.find(chosenHct => {
                    return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.differenceDegrees(hct.hue, chosenHct.hue) < differenceDegrees;
                });
                if (!duplicateHue) {
                    chosenColors.push(hct);
                }
                if (chosenColors.length >= desired)
                    break;
            }
            if (chosenColors.length >= desired)
                break;
        }
        const colors = [];
        if (chosenColors.length === 0) {
            colors.push(fallbackColorARGB);
        }
        for (const chosenHct of chosenColors) {
            colors.push(chosenHct.toInt());
        }
        return colors;
    }
}
Score.TARGET_CHROMA = 48.0; // A1 Chroma
Score.WEIGHT_PROPORTION = 0.7;
Score.WEIGHT_CHROMA_ABOVE = 0.3;
Score.WEIGHT_CHROMA_BELOW = 0.1;
Score.CUTOFF_CHROMA = 5.0;
Score.CUTOFF_EXCITED_PROPORTION = 0.01;
//# sourceMappingURL=score.js.map

/***/ },

/***/ "6e2844c45242"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemperatureCache: () => (/* binding */ TemperatureCache)
/* harmony export */ });
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3cdc1bb3fe85");
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d94c5d6ff17a");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.



/**
 * Design utilities using color temperature theory.
 *
 * Analogous colors, complementary color, and cache to efficiently, lazily,
 * generate data for calculations when needed.
 */
class TemperatureCache {
    constructor(input) {
        this.input = input;
        this.hctsByTempCache = [];
        this.hctsByHueCache = [];
        this.tempsByHctCache = new Map();
        this.inputRelativeTemperatureCache = -1.0;
        this.complementCache = null;
    }
    get hctsByTemp() {
        if (this.hctsByTempCache.length > 0) {
            return this.hctsByTempCache;
        }
        const hcts = this.hctsByHue.concat([this.input]);
        const temperaturesByHct = this.tempsByHct;
        hcts.sort((a, b) => temperaturesByHct.get(a) - temperaturesByHct.get(b));
        this.hctsByTempCache = hcts;
        return hcts;
    }
    get warmest() {
        return this.hctsByTemp[this.hctsByTemp.length - 1];
    }
    get coldest() {
        return this.hctsByTemp[0];
    }
    /**
     * A set of colors with differing hues, equidistant in temperature.
     *
     * In art, this is usually described as a set of 5 colors on a color wheel
     * divided into 12 sections. This method allows provision of either of those
     * values.
     *
     * Behavior is undefined when [count] or [divisions] is 0.
     * When divisions < count, colors repeat.
     *
     * [count] The number of colors to return, includes the input color.
     * [divisions] The number of divisions on the color wheel.
     */
    analogous(count = 5, divisions = 12) {
        const startHue = Math.round(this.input.hue);
        const startHct = this.hctsByHue[startHue];
        let lastTemp = this.relativeTemperature(startHct);
        const allColors = [startHct];
        let absoluteTotalTempDelta = 0.0;
        for (let i = 0; i < 360; i++) {
            const hue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__.sanitizeDegreesInt(startHue + i);
            const hct = this.hctsByHue[hue];
            const temp = this.relativeTemperature(hct);
            const tempDelta = Math.abs(temp - lastTemp);
            lastTemp = temp;
            absoluteTotalTempDelta += tempDelta;
        }
        let hueAddend = 1;
        const tempStep = absoluteTotalTempDelta / divisions;
        let totalTempDelta = 0.0;
        lastTemp = this.relativeTemperature(startHct);
        while (allColors.length < divisions) {
            const hue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__.sanitizeDegreesInt(startHue + hueAddend);
            const hct = this.hctsByHue[hue];
            const temp = this.relativeTemperature(hct);
            const tempDelta = Math.abs(temp - lastTemp);
            totalTempDelta += tempDelta;
            const desiredTotalTempDeltaForIndex = allColors.length * tempStep;
            let indexSatisfied = totalTempDelta >= desiredTotalTempDeltaForIndex;
            let indexAddend = 1;
            // Keep adding this hue to the answers until its temperature is
            // insufficient. This ensures consistent behavior when there aren't
            // [divisions] discrete steps between 0 and 360 in hue with [tempStep]
            // delta in temperature between them.
            //
            // For example, white and black have no analogues: there are no other
            // colors at T100/T0. Therefore, they should just be added to the array
            // as answers.
            while (indexSatisfied && allColors.length < divisions) {
                allColors.push(hct);
                const desiredTotalTempDeltaForIndex = ((allColors.length + indexAddend) * tempStep);
                indexSatisfied = totalTempDelta >= desiredTotalTempDeltaForIndex;
                indexAddend++;
            }
            lastTemp = temp;
            hueAddend++;
            if (hueAddend > 360) {
                while (allColors.length < divisions) {
                    allColors.push(hct);
                }
                break;
            }
        }
        const answers = [this.input];
        // First, generate analogues from rotating counter-clockwise.
        const increaseHueCount = Math.floor((count - 1) / 2.0);
        for (let i = 1; i < (increaseHueCount + 1); i++) {
            let index = 0 - i;
            while (index < 0) {
                index = allColors.length + index;
            }
            if (index >= allColors.length) {
                index = index % allColors.length;
            }
            answers.splice(0, 0, allColors[index]);
        }
        // Second, generate analogues from rotating clockwise.
        const decreaseHueCount = count - increaseHueCount - 1;
        for (let i = 1; i < (decreaseHueCount + 1); i++) {
            let index = i;
            while (index < 0) {
                index = allColors.length + index;
            }
            if (index >= allColors.length) {
                index = index % allColors.length;
            }
            answers.push(allColors[index]);
        }
        return answers;
    }
    /**
     * A color that complements the input color aesthetically.
     *
     * In art, this is usually described as being across the color wheel.
     * History of this shows intent as a color that is just as cool-warm as the
     * input color is warm-cool.
     */
    get complement() {
        if (this.complementCache != null) {
            return this.complementCache;
        }
        const coldestHue = this.coldest.hue;
        const coldestTemp = this.tempsByHct.get(this.coldest);
        const warmestHue = this.warmest.hue;
        const warmestTemp = this.tempsByHct.get(this.warmest);
        const range = warmestTemp - coldestTemp;
        const startHueIsColdestToWarmest = TemperatureCache.isBetween(this.input.hue, coldestHue, warmestHue);
        const startHue = startHueIsColdestToWarmest ? warmestHue : coldestHue;
        const endHue = startHueIsColdestToWarmest ? coldestHue : warmestHue;
        const directionOfRotation = 1.0;
        let smallestError = 1000.0;
        let answer = this.hctsByHue[Math.round(this.input.hue)];
        const complementRelativeTemp = 1.0 - this.inputRelativeTemperature;
        // Find the color in the other section, closest to the inverse percentile
        // of the input color. This is the complement.
        for (let hueAddend = 0.0; hueAddend <= 360.0; hueAddend += 1.0) {
            const hue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__.sanitizeDegreesDouble(startHue + directionOfRotation * hueAddend);
            if (!TemperatureCache.isBetween(hue, startHue, endHue)) {
                continue;
            }
            const possibleAnswer = this.hctsByHue[Math.round(hue)];
            const relativeTemp = (this.tempsByHct.get(possibleAnswer) - coldestTemp) / range;
            const error = Math.abs(complementRelativeTemp - relativeTemp);
            if (error < smallestError) {
                smallestError = error;
                answer = possibleAnswer;
            }
        }
        this.complementCache = answer;
        return this.complementCache;
    }
    /**
     * Temperature relative to all colors with the same chroma and tone.
     * Value on a scale from 0 to 1.
     */
    relativeTemperature(hct) {
        const range = this.tempsByHct.get(this.warmest) - this.tempsByHct.get(this.coldest);
        const differenceFromColdest = this.tempsByHct.get(hct) - this.tempsByHct.get(this.coldest);
        // Handle when there's no difference in temperature between warmest and
        // coldest: for example, at T100, only one color is available, white.
        if (range === 0.0) {
            return 0.5;
        }
        return differenceFromColdest / range;
    }
    /** Relative temperature of the input color. See [relativeTemperature]. */
    get inputRelativeTemperature() {
        if (this.inputRelativeTemperatureCache >= 0.0) {
            return this.inputRelativeTemperatureCache;
        }
        this.inputRelativeTemperatureCache = this.relativeTemperature(this.input);
        return this.inputRelativeTemperatureCache;
    }
    /** A Map with keys of HCTs in [hctsByTemp], values of raw temperature. */
    get tempsByHct() {
        if (this.tempsByHctCache.size > 0) {
            return this.tempsByHctCache;
        }
        const allHcts = this.hctsByHue.concat([this.input]);
        const temperaturesByHct = new Map();
        for (const e of allHcts) {
            temperaturesByHct.set(e, TemperatureCache.rawTemperature(e));
        }
        this.tempsByHctCache = temperaturesByHct;
        return temperaturesByHct;
    }
    /**
     * HCTs for all hues, with the same chroma/tone as the input.
     * Sorted ascending, hue 0 to 360.
     */
    get hctsByHue() {
        if (this.hctsByHueCache.length > 0) {
            return this.hctsByHueCache;
        }
        const hcts = [];
        for (let hue = 0.0; hue <= 360.0; hue += 1.0) {
            const colorAtHue = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(hue, this.input.chroma, this.input.tone);
            hcts.push(colorAtHue);
        }
        this.hctsByHueCache = hcts;
        return this.hctsByHueCache;
    }
    /** Determines if an angle is between two other angles, rotating clockwise. */
    static isBetween(angle, a, b) {
        if (a < b) {
            return a <= angle && angle <= b;
        }
        return a <= angle || angle <= b;
    }
    /**
     * Value representing cool-warm factor of a color.
     * Values below 0 are considered cool, above, warm.
     *
     * Color science has researched emotion and harmony, which art uses to select
     * colors. Warm-cool is the foundation of analogous and complementary colors.
     * See:
     * - Li-Chen Ou's Chapter 19 in Handbook of Color Psychology (2015).
     * - Josef Albers' Interaction of Color chapters 19 and 21.
     *
     * Implementation of Ou, Woodcock and Wright's algorithm, which uses
     * L*a*b* / LCH color space.
     * Return value has these properties:
     * - Values below 0 are cool, above 0 are warm.
     * - Lower bound: -0.52 - (chroma ^ 1.07 / 20). L*a*b* chroma is infinite.
     *   Assuming max of 130 chroma, -9.66.
     * - Upper bound: -0.52 + (chroma ^ 1.07 / 20). L*a*b* chroma is infinite.
     *   Assuming max of 130 chroma, 8.61.
     */
    static rawTemperature(color) {
        const lab = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_1__.labFromArgb(color.toInt());
        const hue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__.sanitizeDegreesDouble(Math.atan2(lab[2], lab[1]) * 180.0 / Math.PI);
        const chroma = Math.sqrt((lab[1] * lab[1]) + (lab[2] * lab[2]));
        const temperature = -0.5 +
            0.02 * Math.pow(chroma, 1.07) *
                Math.cos(_utils_math_utils_js__WEBPACK_IMPORTED_MODULE_2__.sanitizeDegreesDouble(hue - 50.0) * Math.PI / 180.0);
        return temperature;
    }
}
//# sourceMappingURL=temperature_cache.js.map

/***/ },

/***/ "d94c5d6ff17a"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alphaFromArgb: () => (/* binding */ alphaFromArgb),
/* harmony export */   argbFromLab: () => (/* binding */ argbFromLab),
/* harmony export */   argbFromLinrgb: () => (/* binding */ argbFromLinrgb),
/* harmony export */   argbFromLstar: () => (/* binding */ argbFromLstar),
/* harmony export */   argbFromRgb: () => (/* binding */ argbFromRgb),
/* harmony export */   argbFromRgba: () => (/* binding */ argbFromRgba),
/* harmony export */   argbFromXyz: () => (/* binding */ argbFromXyz),
/* harmony export */   blueFromArgb: () => (/* binding */ blueFromArgb),
/* harmony export */   delinearized: () => (/* binding */ delinearized),
/* harmony export */   greenFromArgb: () => (/* binding */ greenFromArgb),
/* harmony export */   isOpaque: () => (/* binding */ isOpaque),
/* harmony export */   labFromArgb: () => (/* binding */ labFromArgb),
/* harmony export */   linearized: () => (/* binding */ linearized),
/* harmony export */   lstarFromArgb: () => (/* binding */ lstarFromArgb),
/* harmony export */   lstarFromY: () => (/* binding */ lstarFromY),
/* harmony export */   redFromArgb: () => (/* binding */ redFromArgb),
/* harmony export */   rgbaFromArgb: () => (/* binding */ rgbaFromArgb),
/* harmony export */   whitePointD65: () => (/* binding */ whitePointD65),
/* harmony export */   xyzFromArgb: () => (/* binding */ xyzFromArgb),
/* harmony export */   yFromLstar: () => (/* binding */ yFromLstar)
/* harmony export */ });
/* harmony import */ var _math_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6d41ddc214ee");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.

/**
 * Color science utilities.
 *
 * Utility methods for color science constants and color space
 * conversions that aren't HCT or CAM16.
 */
const SRGB_TO_XYZ = [
    [0.41233895, 0.35762064, 0.18051042],
    [0.2126, 0.7152, 0.0722],
    [0.01932141, 0.11916382, 0.95034478],
];
const XYZ_TO_SRGB = [
    [
        3.2413774792388685,
        -1.5376652402851851,
        -0.49885366846268053,
    ],
    [
        -0.9691452513005321,
        1.8758853451067872,
        0.04156585616912061,
    ],
    [
        0.05562093689691305,
        -0.20395524564742123,
        1.0571799111220335,
    ],
];
const WHITE_POINT_D65 = [95.047, 100.0, 108.883];
/**
 * Converts a color from RGB components to ARGB format.
 */
function argbFromRgb(red, green, blue) {
    return (255 << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255) >>>
        0;
}
/**
 * Converts a color from linear RGB components to ARGB format.
 */
function argbFromLinrgb(linrgb) {
    const r = delinearized(linrgb[0]);
    const g = delinearized(linrgb[1]);
    const b = delinearized(linrgb[2]);
    return argbFromRgb(r, g, b);
}
/**
 * Returns the alpha component of a color in ARGB format.
 */
function alphaFromArgb(argb) {
    return argb >> 24 & 255;
}
/**
 * Returns the red component of a color in ARGB format.
 */
function redFromArgb(argb) {
    return argb >> 16 & 255;
}
/**
 * Returns the green component of a color in ARGB format.
 */
function greenFromArgb(argb) {
    return argb >> 8 & 255;
}
/**
 * Returns the blue component of a color in ARGB format.
 */
function blueFromArgb(argb) {
    return argb & 255;
}
/**
 * Returns whether a color in ARGB format is opaque.
 */
function isOpaque(argb) {
    return alphaFromArgb(argb) >= 255;
}
/**
 * Converts a color from ARGB to XYZ.
 */
function argbFromXyz(x, y, z) {
    const matrix = XYZ_TO_SRGB;
    const linearR = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
    const linearG = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
    const linearB = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
    const r = delinearized(linearR);
    const g = delinearized(linearG);
    const b = delinearized(linearB);
    return argbFromRgb(r, g, b);
}
/**
 * Converts a color from XYZ to ARGB.
 */
function xyzFromArgb(argb) {
    const r = linearized(redFromArgb(argb));
    const g = linearized(greenFromArgb(argb));
    const b = linearized(blueFromArgb(argb));
    return _math_utils_js__WEBPACK_IMPORTED_MODULE_0__.matrixMultiply([r, g, b], SRGB_TO_XYZ);
}
/**
 * Converts a color represented in Lab color space into an ARGB
 * integer.
 */
function argbFromLab(l, a, b) {
    const whitePoint = WHITE_POINT_D65;
    const fy = (l + 16.0) / 116.0;
    const fx = a / 500.0 + fy;
    const fz = fy - b / 200.0;
    const xNormalized = labInvf(fx);
    const yNormalized = labInvf(fy);
    const zNormalized = labInvf(fz);
    const x = xNormalized * whitePoint[0];
    const y = yNormalized * whitePoint[1];
    const z = zNormalized * whitePoint[2];
    return argbFromXyz(x, y, z);
}
/**
 * Converts a color from ARGB representation to L*a*b*
 * representation.
 *
 * @param argb the ARGB representation of a color
 * @return a Lab object representing the color
 */
function labFromArgb(argb) {
    const linearR = linearized(redFromArgb(argb));
    const linearG = linearized(greenFromArgb(argb));
    const linearB = linearized(blueFromArgb(argb));
    const matrix = SRGB_TO_XYZ;
    const x = matrix[0][0] * linearR + matrix[0][1] * linearG + matrix[0][2] * linearB;
    const y = matrix[1][0] * linearR + matrix[1][1] * linearG + matrix[1][2] * linearB;
    const z = matrix[2][0] * linearR + matrix[2][1] * linearG + matrix[2][2] * linearB;
    const whitePoint = WHITE_POINT_D65;
    const xNormalized = x / whitePoint[0];
    const yNormalized = y / whitePoint[1];
    const zNormalized = z / whitePoint[2];
    const fx = labF(xNormalized);
    const fy = labF(yNormalized);
    const fz = labF(zNormalized);
    const l = 116.0 * fy - 16;
    const a = 500.0 * (fx - fy);
    const b = 200.0 * (fy - fz);
    return [l, a, b];
}
/**
 * Converts an L* value to an ARGB representation.
 *
 * @param lstar L* in L*a*b*
 * @return ARGB representation of grayscale color with lightness
 * matching L*
 */
function argbFromLstar(lstar) {
    const y = yFromLstar(lstar);
    const component = delinearized(y);
    return argbFromRgb(component, component, component);
}
/**
 * Computes the L* value of a color in ARGB representation.
 *
 * @param argb ARGB representation of a color
 * @return L*, from L*a*b*, coordinate of the color
 */
function lstarFromArgb(argb) {
    const y = xyzFromArgb(argb)[1];
    return 116.0 * labF(y / 100.0) - 16.0;
}
/**
 * Converts an L* value to a Y value.
 *
 * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
 *
 * L* measures perceptual luminance, a linear scale. Y in XYZ
 * measures relative luminance, a logarithmic scale.
 *
 * @param lstar L* in L*a*b*
 * @return Y in XYZ
 */
function yFromLstar(lstar) {
    return 100.0 * labInvf((lstar + 16.0) / 116.0);
}
/**
 * Converts a Y value to an L* value.
 *
 * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
 *
 * L* measures perceptual luminance, a linear scale. Y in XYZ
 * measures relative luminance, a logarithmic scale.
 *
 * @param y Y in XYZ
 * @return L* in L*a*b*
 */
function lstarFromY(y) {
    return labF(y / 100.0) * 116.0 - 16.0;
}
/**
 * Linearizes an RGB component.
 *
 * @param rgbComponent 0 <= rgb_component <= 255, represents R/G/B
 * channel
 * @return 0.0 <= output <= 100.0, color channel converted to
 * linear RGB space
 */
function linearized(rgbComponent) {
    const normalized = rgbComponent / 255.0;
    if (normalized <= 0.040449936) {
        return normalized / 12.92 * 100.0;
    }
    else {
        return Math.pow((normalized + 0.055) / 1.055, 2.4) * 100.0;
    }
}
/**
 * Delinearizes an RGB component.
 *
 * @param rgbComponent 0.0 <= rgb_component <= 100.0, represents
 * linear R/G/B channel
 * @return 0 <= output <= 255, color channel converted to regular
 * RGB space
 */
function delinearized(rgbComponent) {
    const normalized = rgbComponent / 100.0;
    let delinearized = 0.0;
    if (normalized <= 0.0031308) {
        delinearized = normalized * 12.92;
    }
    else {
        delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
    }
    return _math_utils_js__WEBPACK_IMPORTED_MODULE_0__.clampInt(0, 255, Math.round(delinearized * 255.0));
}
/**
 * Returns the standard white point; white on a sunny day.
 *
 * @return The white point
 */
function whitePointD65() {
    return WHITE_POINT_D65;
}
/**
 * Return RGBA from a given int32 color
 *
 * @param argb ARGB representation of a int32 color.
 * @return RGBA representation of a int32 color.
 */
function rgbaFromArgb(argb) {
    const r = redFromArgb(argb);
    const g = greenFromArgb(argb);
    const b = blueFromArgb(argb);
    const a = alphaFromArgb(argb);
    return { r, g, b, a };
}
/**
 * Return int32 color from a given RGBA component
 *
 * @param rgba RGBA representation of a int32 color.
 * @returns ARGB representation of a int32 color.
 */
function argbFromRgba({ r, g, b, a }) {
    const rValue = clampComponent(r);
    const gValue = clampComponent(g);
    const bValue = clampComponent(b);
    const aValue = clampComponent(a);
    return (aValue << 24) | (rValue << 16) | (gValue << 8) | bValue;
}
function clampComponent(value) {
    if (value < 0)
        return 0;
    if (value > 255)
        return 255;
    return value;
}
function labF(t) {
    const e = 216.0 / 24389.0;
    const kappa = 24389.0 / 27.0;
    if (t > e) {
        return Math.pow(t, 1.0 / 3.0);
    }
    else {
        return (kappa * t + 16) / 116;
    }
}
function labInvf(ft) {
    const e = 216.0 / 24389.0;
    const kappa = 24389.0 / 27.0;
    const ft3 = ft * ft * ft;
    if (ft3 > e) {
        return ft3;
    }
    else {
        return (116 * ft - 16) / kappa;
    }
}
//# sourceMappingURL=color_utils.js.map

/***/ },

/***/ "e666a2135778"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sourceColorFromImage: () => (/* binding */ sourceColorFromImage)
/* harmony export */ });
/* harmony import */ var _quantize_quantizer_celebi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("738ea086586b");
/* harmony import */ var _score_score_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("217abdf950e0");
/* harmony import */ var _color_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d94c5d6ff17a");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * Get the source color from an image.
 *
 * @param image The image element
 * @return Source color - the color most suitable for creating a UI theme
 */
async function sourceColorFromImage(image) {
    // Convert Image data to Pixel Array
    const imageBytes = await new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            reject(new Error('Could not get canvas context'));
            return;
        }
        const loadCallback = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            let rect = [0, 0, image.width, image.height];
            const area = image.dataset['area'];
            if (area && /^\d+(\s*,\s*\d+){3}$/.test(area)) {
                rect = area.split(/\s*,\s*/).map(s => {
                    // tslint:disable-next-line:ban
                    return parseInt(s, 10);
                });
            }
            const [sx, sy, sw, sh] = rect;
            resolve(context.getImageData(sx, sy, sw, sh).data);
        };
        const errorCallback = () => {
            reject(new Error('Image load failed'));
        };
        if (image.complete) {
            loadCallback();
        }
        else {
            image.onload = loadCallback;
            image.onerror = errorCallback;
        }
    });
    // Convert Image data to Pixel Array
    const pixels = [];
    for (let i = 0; i < imageBytes.length; i += 4) {
        const r = imageBytes[i];
        const g = imageBytes[i + 1];
        const b = imageBytes[i + 2];
        const a = imageBytes[i + 3];
        if (a < 255) {
            continue;
        }
        const argb = (0,_color_utils_js__WEBPACK_IMPORTED_MODULE_2__.argbFromRgb)(r, g, b);
        pixels.push(argb);
    }
    // Convert Pixels to Material Colors
    const result = _quantize_quantizer_celebi_js__WEBPACK_IMPORTED_MODULE_0__.QuantizerCelebi.quantize(pixels, 128);
    const ranked = _score_score_js__WEBPACK_IMPORTED_MODULE_1__.Score.score(result);
    const top = ranked[0];
    return top;
}
//# sourceMappingURL=image_utils.js.map

/***/ },

/***/ "6d41ddc214ee"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clampDouble: () => (/* binding */ clampDouble),
/* harmony export */   clampInt: () => (/* binding */ clampInt),
/* harmony export */   differenceDegrees: () => (/* binding */ differenceDegrees),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   matrixMultiply: () => (/* binding */ matrixMultiply),
/* harmony export */   rotationDirection: () => (/* binding */ rotationDirection),
/* harmony export */   sanitizeDegreesDouble: () => (/* binding */ sanitizeDegreesDouble),
/* harmony export */   sanitizeDegreesInt: () => (/* binding */ sanitizeDegreesInt),
/* harmony export */   signum: () => (/* binding */ signum)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.
/**
 * Utility methods for mathematical operations.
 */
/**
 * The signum function.
 *
 * @return 1 if num > 0, -1 if num < 0, and 0 if num = 0
 */
function signum(num) {
    if (num < 0) {
        return -1;
    }
    else if (num === 0) {
        return 0;
    }
    else {
        return 1;
    }
}
/**
 * The linear interpolation function.
 *
 * @return start if amount = 0 and stop if amount = 1
 */
function lerp(start, stop, amount) {
    return (1.0 - amount) * start + amount * stop;
}
/**
 * Clamps an integer between two integers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */
function clampInt(min, max, input) {
    if (input < min) {
        return min;
    }
    else if (input > max) {
        return max;
    }
    return input;
}
/**
 * Clamps an integer between two floating-point numbers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */
function clampDouble(min, max, input) {
    if (input < min) {
        return min;
    }
    else if (input > max) {
        return max;
    }
    return input;
}
/**
 * Sanitizes a degree measure as an integer.
 *
 * @return a degree measure between 0 (inclusive) and 360
 * (exclusive).
 */
function sanitizeDegreesInt(degrees) {
    degrees = degrees % 360;
    if (degrees < 0) {
        degrees = degrees + 360;
    }
    return degrees;
}
/**
 * Sanitizes a degree measure as a floating-point number.
 *
 * @return a degree measure between 0.0 (inclusive) and 360.0
 * (exclusive).
 */
function sanitizeDegreesDouble(degrees) {
    degrees = degrees % 360.0;
    if (degrees < 0) {
        degrees = degrees + 360.0;
    }
    return degrees;
}
/**
 * Sign of direction change needed to travel from one angle to
 * another.
 *
 * For angles that are 180 degrees apart from each other, both
 * directions have the same travel distance, so either direction is
 * shortest. The value 1.0 is returned in this case.
 *
 * @param from The angle travel starts from, in degrees.
 * @param to The angle travel ends at, in degrees.
 * @return -1 if decreasing from leads to the shortest travel
 * distance, 1 if increasing from leads to the shortest travel
 * distance.
 */
function rotationDirection(from, to) {
    const increasingDifference = sanitizeDegreesDouble(to - from);
    return increasingDifference <= 180.0 ? 1.0 : -1.0;
}
/**
 * Distance of two points on a circle, represented using degrees.
 */
function differenceDegrees(a, b) {
    return 180.0 - Math.abs(Math.abs(a - b) - 180.0);
}
/**
 * Multiplies a 1x3 row vector with a 3x3 matrix.
 */
function matrixMultiply(row, matrix) {
    const a = row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2];
    const b = row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2];
    const c = row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2];
    return [a, b, c];
}
//# sourceMappingURL=math_utils.js.map

/***/ },

/***/ "12b386736c08"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   argbFromHex: () => (/* binding */ argbFromHex),
/* harmony export */   hexFromArgb: () => (/* binding */ hexFromArgb)
/* harmony export */ });
/* harmony import */ var _color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d94c5d6ff17a");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Utility methods for hexadecimal representations of colors.
 */
/**
 * @param argb ARGB representation of a color.
 * @return Hex string representing color, ex. #ff0000 for red.
 */
function hexFromArgb(argb) {
    const r = _color_utils_js__WEBPACK_IMPORTED_MODULE_0__.redFromArgb(argb);
    const g = _color_utils_js__WEBPACK_IMPORTED_MODULE_0__.greenFromArgb(argb);
    const b = _color_utils_js__WEBPACK_IMPORTED_MODULE_0__.blueFromArgb(argb);
    const outParts = [r.toString(16), g.toString(16), b.toString(16)];
    // Pad single-digit output values
    for (const [i, part] of outParts.entries()) {
        if (part.length === 1) {
            outParts[i] = '0' + part;
        }
    }
    return '#' + outParts.join('');
}
/**
 * @param hex String representing color as hex code. Accepts strings with or
 *     without leading #, and string representing the color using 3, 6, or 8
 *     hex characters.
 * @return ARGB representation of color.
 */
function argbFromHex(hex) {
    hex = hex.replace('#', '');
    const isThree = hex.length === 3;
    const isSix = hex.length === 6;
    const isEight = hex.length === 8;
    if (!isThree && !isSix && !isEight) {
        throw new Error('unexpected hex ' + hex);
    }
    let r = 0;
    let g = 0;
    let b = 0;
    if (isThree) {
        r = parseIntHex(hex.slice(0, 1).repeat(2));
        g = parseIntHex(hex.slice(1, 2).repeat(2));
        b = parseIntHex(hex.slice(2, 3).repeat(2));
    }
    else if (isSix) {
        r = parseIntHex(hex.slice(0, 2));
        g = parseIntHex(hex.slice(2, 4));
        b = parseIntHex(hex.slice(4, 6));
    }
    else if (isEight) {
        r = parseIntHex(hex.slice(2, 4));
        g = parseIntHex(hex.slice(4, 6));
        b = parseIntHex(hex.slice(6, 8));
    }
    return (((255 << 24) | ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff)) >>>
        0);
}
function parseIntHex(value) {
    // tslint:disable-next-line:ban
    return parseInt(value, 16);
}
//# sourceMappingURL=string_utils.js.map

/***/ },

/***/ "b26f78deb86d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyTheme: () => (/* binding */ applyTheme),
/* harmony export */   customColor: () => (/* binding */ customColor),
/* harmony export */   themeFromImage: () => (/* binding */ themeFromImage),
/* harmony export */   themeFromSourceColor: () => (/* binding */ themeFromSourceColor)
/* harmony export */ });
/* harmony import */ var _blend_blend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("95860925e668");
/* harmony import */ var _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("47393141bc89");
/* harmony import */ var _scheme_scheme_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bcf9088bc193");
/* harmony import */ var _image_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e666a2135778");
/* harmony import */ var _string_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("12b386736c08");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */





/**
 * Generate a theme from a source color
 *
 * @param source Source color
 * @param customColors Array of custom colors
 * @return Theme object
 */
function themeFromSourceColor(source, customColors = []) {
    const palette = _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_1__.CorePalette.of(source);
    return {
        source,
        schemes: {
            light: _scheme_scheme_js__WEBPACK_IMPORTED_MODULE_2__.Scheme.light(source),
            dark: _scheme_scheme_js__WEBPACK_IMPORTED_MODULE_2__.Scheme.dark(source),
        },
        palettes: {
            primary: palette.a1,
            secondary: palette.a2,
            tertiary: palette.a3,
            neutral: palette.n1,
            neutralVariant: palette.n2,
            error: palette.error,
        },
        customColors: customColors.map((c) => customColor(source, c)),
    };
}
/**
 * Generate a theme from an image source
 *
 * @param image Image element
 * @param customColors Array of custom colors
 * @return Theme object
 */
async function themeFromImage(image, customColors = []) {
    const source = await (0,_image_utils_js__WEBPACK_IMPORTED_MODULE_3__.sourceColorFromImage)(image);
    return themeFromSourceColor(source, customColors);
}
/**
 * Generate custom color group from source and target color
 *
 * @param source Source color
 * @param color Custom color
 * @return Custom color group
 *
 * @link https://m3.material.io/styles/color/the-color-system/color-roles
 */
function customColor(source, color) {
    let value = color.value;
    const from = value;
    const to = source;
    if (color.blend) {
        value = _blend_blend_js__WEBPACK_IMPORTED_MODULE_0__.Blend.harmonize(from, to);
    }
    const palette = _palettes_core_palette_js__WEBPACK_IMPORTED_MODULE_1__.CorePalette.of(value);
    const tones = palette.a1;
    return {
        color,
        value,
        light: {
            color: tones.tone(40),
            onColor: tones.tone(100),
            colorContainer: tones.tone(90),
            onColorContainer: tones.tone(10),
        },
        dark: {
            color: tones.tone(80),
            onColor: tones.tone(20),
            colorContainer: tones.tone(30),
            onColorContainer: tones.tone(90),
        },
    };
}
/**
 * Apply a theme to an element
 *
 * @param theme Theme object
 * @param options Options
 */
function applyTheme(theme, options) {
    const target = options?.target || document.body;
    const isDark = options?.dark ?? false;
    const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
    setSchemeProperties(target, scheme);
    if (options?.brightnessSuffix) {
        setSchemeProperties(target, theme.schemes.dark, '-dark');
        setSchemeProperties(target, theme.schemes.light, '-light');
    }
    if (options?.paletteTones) {
        const tones = options?.paletteTones ?? [];
        for (const [key, palette] of Object.entries(theme.palettes)) {
            const paletteKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            for (const tone of tones) {
                const token = `--md-ref-palette-${paletteKey}-${paletteKey}${tone}`;
                const color = (0,_string_utils_js__WEBPACK_IMPORTED_MODULE_4__.hexFromArgb)(palette.tone(tone));
                target.style.setProperty(token, color);
            }
        }
    }
}
function setSchemeProperties(target, scheme, suffix = '') {
    for (const [key, value] of Object.entries(scheme.toJSON())) {
        const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const color = (0,_string_utils_js__WEBPACK_IMPORTED_MODULE_4__.hexFromArgb)(value);
        target.style.setProperty(`--md-sys-color-${token}${suffix}`, color);
    }
}
//# sourceMappingURL=theme_utils.js.map

/***/ },

/***/ "76af9d08392d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Picker)
/* harmony export */ });
/*!
 * vanilla-picker v2.12.3
 * https://vanilla-picker.js.org
 *
 * Copyright 2017-2024 Andreas Borgen (https://github.com/Sphinxxxx), Adam Brooks (https://github.com/dissimulate)
 * Released under the ISC license.
 */
var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

String.prototype.startsWith = String.prototype.startsWith || function (needle) {
    return this.indexOf(needle) === 0;
};
String.prototype.padStart = String.prototype.padStart || function (len, pad) {
    var str = this;while (str.length < len) {
        str = pad + str;
    }return str;
};

var colorNames = { cb: '0f8ff', tqw: 'aebd7', q: '-ffff', qmrn: '7fffd4', zr: '0ffff', bg: '5f5dc', bsq: 'e4c4', bck: '---', nch: 'ebcd', b: '--ff', bvt: '8a2be2', brwn: 'a52a2a', brw: 'deb887', ctb: '5f9ea0', hrt: '7fff-', chcT: 'd2691e', cr: '7f50', rnw: '6495ed', crns: '8dc', crms: 'dc143c', cn: '-ffff', Db: '--8b', Dcn: '-8b8b', Dgnr: 'b8860b', Dgr: 'a9a9a9', Dgrn: '-64-', Dkhk: 'bdb76b', Dmgn: '8b-8b', Dvgr: '556b2f', Drng: '8c-', Drch: '9932cc', Dr: '8b--', Dsmn: 'e9967a', Dsgr: '8fbc8f', DsTb: '483d8b', DsTg: '2f4f4f', Dtrq: '-ced1', Dvt: '94-d3', ppnk: '1493', pskb: '-bfff', mgr: '696969', grb: '1e90ff', rbrc: 'b22222', rwht: 'af0', stg: '228b22', chs: '-ff', gnsb: 'dcdcdc', st: '8f8ff', g: 'd7-', gnr: 'daa520', gr: '808080', grn: '-8-0', grnw: 'adff2f', hnw: '0fff0', htpn: '69b4', nnr: 'cd5c5c', ng: '4b-82', vr: '0', khk: '0e68c', vnr: 'e6e6fa', nrb: '0f5', wngr: '7cfc-', mnch: 'acd', Lb: 'add8e6', Lcr: '08080', Lcn: 'e0ffff', Lgnr: 'afad2', Lgr: 'd3d3d3', Lgrn: '90ee90', Lpnk: 'b6c1', Lsmn: 'a07a', Lsgr: '20b2aa', Lskb: '87cefa', LsTg: '778899', Lstb: 'b0c4de', Lw: 'e0', m: '-ff-', mgrn: '32cd32', nn: 'af0e6', mgnt: '-ff', mrn: '8--0', mqm: '66cdaa', mmb: '--cd', mmrc: 'ba55d3', mmpr: '9370db', msg: '3cb371', mmsT: '7b68ee', '': '-fa9a', mtr: '48d1cc', mmvt: 'c71585', mnLb: '191970', ntc: '5fffa', mstr: 'e4e1', mccs: 'e4b5', vjw: 'dead', nv: '--80', c: 'df5e6', v: '808-0', vrb: '6b8e23', rng: 'a5-', rngr: '45-', rch: 'da70d6', pgnr: 'eee8aa', pgrn: '98fb98', ptrq: 'afeeee', pvtr: 'db7093', ppwh: 'efd5', pchp: 'dab9', pr: 'cd853f', pnk: 'c0cb', pm: 'dda0dd', pwrb: 'b0e0e6', prp: '8-080', cc: '663399', r: '--', sbr: 'bc8f8f', rb: '4169e1', sbrw: '8b4513', smn: 'a8072', nbr: '4a460', sgrn: '2e8b57', ssh: '5ee', snn: 'a0522d', svr: 'c0c0c0', skb: '87ceeb', sTb: '6a5acd', sTgr: '708090', snw: 'afa', n: '-ff7f', stb: '4682b4', tn: 'd2b48c', t: '-8080', thst: 'd8bfd8', tmT: '6347', trqs: '40e0d0', vt: 'ee82ee', whT: '5deb3', wht: '', hts: '5f5f5', w: '-', wgrn: '9acd32' };

function printNum(num) {
    var decs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var str = decs > 0 ? num.toFixed(decs).replace(/0+$/, '').replace(/\.$/, '') : num.toString();
    return str || '0';
}

var Color = function () {
    function Color(r, g, b, a) {
        classCallCheck(this, Color);


        var that = this;
        function parseString(input) {

            if (input.startsWith('hsl')) {
                var _input$match$map = input.match(/([\-\d\.e]+)/g).map(Number),
                    _input$match$map2 = slicedToArray(_input$match$map, 4),
                    h = _input$match$map2[0],
                    s = _input$match$map2[1],
                    l = _input$match$map2[2],
                    _a = _input$match$map2[3];

                if (_a === undefined) {
                    _a = 1;
                }

                h /= 360;
                s /= 100;
                l /= 100;
                that.hsla = [h, s, l, _a];
            } else if (input.startsWith('rgb')) {
                var _input$match$map3 = input.match(/([\-\d\.e]+)/g).map(Number),
                    _input$match$map4 = slicedToArray(_input$match$map3, 4),
                    _r = _input$match$map4[0],
                    _g = _input$match$map4[1],
                    _b = _input$match$map4[2],
                    _a2 = _input$match$map4[3];

                if (_a2 === undefined) {
                    _a2 = 1;
                }

                that.rgba = [_r, _g, _b, _a2];
            } else {
                if (input.startsWith('#')) {
                    that.rgba = Color.hexToRgb(input);
                } else {
                    that.rgba = Color.nameToRgb(input) || Color.hexToRgb(input);
                }
            }
        }

        if (r === undefined) ; else if (Array.isArray(r)) {
            this.rgba = r;
        } else if (b === undefined) {
            var color = r && '' + r;
            if (color) {
                parseString(color.toLowerCase());
            }
        } else {
            this.rgba = [r, g, b, a === undefined ? 1 : a];
        }
    }

    createClass(Color, [{
        key: 'printRGB',
        value: function printRGB(alpha) {
            var rgb = alpha ? this.rgba : this.rgba.slice(0, 3),
                vals = rgb.map(function (x, i) {
                return printNum(x, i === 3 ? 3 : 0);
            });

            return alpha ? 'rgba(' + vals + ')' : 'rgb(' + vals + ')';
        }
    }, {
        key: 'printHSL',
        value: function printHSL(alpha) {
            var mults = [360, 100, 100, 1],
                suff = ['', '%', '%', ''];

            var hsl = alpha ? this.hsla : this.hsla.slice(0, 3),
                vals = hsl.map(function (x, i) {
                return printNum(x * mults[i], i === 3 ? 3 : 1) + suff[i];
            });

            return alpha ? 'hsla(' + vals + ')' : 'hsl(' + vals + ')';
        }
    }, {
        key: 'printHex',
        value: function printHex(alpha) {
            var hex = this.hex;
            return alpha ? hex : hex.substring(0, 7);
        }
    }, {
        key: 'rgba',
        get: function get() {
            if (this._rgba) {
                return this._rgba;
            }
            if (!this._hsla) {
                throw new Error('No color is set');
            }

            return this._rgba = Color.hslToRgb(this._hsla);
        },
        set: function set(rgb) {
            if (rgb.length === 3) {
                rgb[3] = 1;
            }

            this._rgba = rgb;
            this._hsla = null;
        }
    }, {
        key: 'rgbString',
        get: function get() {
            return this.printRGB();
        }
    }, {
        key: 'rgbaString',
        get: function get() {
            return this.printRGB(true);
        }
    }, {
        key: 'hsla',
        get: function get() {
            if (this._hsla) {
                return this._hsla;
            }
            if (!this._rgba) {
                throw new Error('No color is set');
            }

            return this._hsla = Color.rgbToHsl(this._rgba);
        },
        set: function set(hsl) {
            if (hsl.length === 3) {
                hsl[3] = 1;
            }

            this._hsla = hsl;
            this._rgba = null;
        }
    }, {
        key: 'hslString',
        get: function get() {
            return this.printHSL();
        }
    }, {
        key: 'hslaString',
        get: function get() {
            return this.printHSL(true);
        }
    }, {
        key: 'hex',
        get: function get() {
            var rgb = this.rgba,
                hex = rgb.map(function (x, i) {
                return i < 3 ? x.toString(16) : Math.round(x * 255).toString(16);
            });

            return '#' + hex.map(function (x) {
                return x.padStart(2, '0');
            }).join('');
        },
        set: function set(hex) {
            this.rgba = Color.hexToRgb(hex);
        }
    }], [{
        key: 'hexToRgb',
        value: function hexToRgb(input) {

            var hex = (input.startsWith('#') ? input.slice(1) : input).replace(/^(\w{3})$/, '$1F').replace(/^(\w)(\w)(\w)(\w)$/, '$1$1$2$2$3$3$4$4').replace(/^(\w{6})$/, '$1FF');

            if (!hex.match(/^([0-9a-fA-F]{8})$/)) {
                throw new Error('Unknown hex color; ' + input);
            }

            var rgba = hex.match(/^(\w\w)(\w\w)(\w\w)(\w\w)$/).slice(1).map(function (x) {
                return parseInt(x, 16);
            });

            rgba[3] = rgba[3] / 255;
            return rgba;
        }
    }, {
        key: 'nameToRgb',
        value: function nameToRgb(input) {

            var hash = input.toLowerCase().replace('at', 'T').replace(/[aeiouyldf]/g, '').replace('ght', 'L').replace('rk', 'D').slice(-5, 4),
                hex = colorNames[hash];
            return hex === undefined ? hex : Color.hexToRgb(hex.replace(/\-/g, '00').padStart(6, 'f'));
        }
    }, {
        key: 'rgbToHsl',
        value: function rgbToHsl(_ref) {
            var _ref2 = slicedToArray(_ref, 4),
                r = _ref2[0],
                g = _ref2[1],
                b = _ref2[2],
                a = _ref2[3];

            r /= 255;
            g /= 255;
            b /= 255;

            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h = void 0,
                s = void 0,
                l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);break;
                    case g:
                        h = (b - r) / d + 2;break;
                    case b:
                        h = (r - g) / d + 4;break;
                }

                h /= 6;
            }

            return [h, s, l, a];
        }
    }, {
        key: 'hslToRgb',
        value: function hslToRgb(_ref3) {
            var _ref4 = slicedToArray(_ref3, 4),
                h = _ref4[0],
                s = _ref4[1],
                l = _ref4[2],
                a = _ref4[3];

            var r = void 0,
                g = void 0,
                b = void 0;

            if (s === 0) {
                r = g = b = l;
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                    p = 2 * l - q;

                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            var rgba = [r * 255, g * 255, b * 255].map(Math.round);
            rgba[3] = a;

            return rgba;
        }
    }]);
    return Color;
}();

var EventBucket = function () {
    function EventBucket() {
        classCallCheck(this, EventBucket);

        this._events = [];
    }

    createClass(EventBucket, [{
        key: 'add',
        value: function add(target, type, handler) {
            target.addEventListener(type, handler, false);
            this._events.push({
                target: target,
                type: type,
                handler: handler
            });
        }
    }, {
        key: 'remove',
        value: function remove(target, type, handler) {
            this._events = this._events.filter(function (e) {
                var isMatch = true;
                if (target && target !== e.target) {
                    isMatch = false;
                }
                if (type && type !== e.type) {
                    isMatch = false;
                }
                if (handler && handler !== e.handler) {
                    isMatch = false;
                }

                if (isMatch) {
                    EventBucket._doRemove(e.target, e.type, e.handler);
                }
                return !isMatch;
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._events.forEach(function (e) {
                return EventBucket._doRemove(e.target, e.type, e.handler);
            });
            this._events = [];
        }
    }], [{
        key: '_doRemove',
        value: function _doRemove(target, type, handler) {
            target.removeEventListener(type, handler, false);
        }
    }]);
    return EventBucket;
}();

function parseHTML(htmlString) {

    var div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.firstElementChild;
}

function dragTrack(eventBucket, area, callback) {
    var dragging = false;

    function clamp(val, min, max) {
        return Math.max(min, Math.min(val, max));
    }

    function onMove(e, info, starting) {
        if (starting) {
            dragging = true;
        }
        if (!dragging) {
            return;
        }

        e.preventDefault();

        var bounds = area.getBoundingClientRect(),
            w = bounds.width,
            h = bounds.height,
            x = info.clientX,
            y = info.clientY;

        var relX = clamp(x - bounds.left, 0, w),
            relY = clamp(y - bounds.top, 0, h);

        callback(relX / w, relY / h);
    }

    function onMouse(e, starting) {
        var button = e.buttons === undefined ? e.which : e.buttons;
        if (button === 1) {
            onMove(e, e, starting);
        } else {
            dragging = false;
        }
    }

    function onTouch(e, starting) {
        if (e.touches.length === 1) {
            onMove(e, e.touches[0], starting);
        } else {
            dragging = false;
        }
    }

    eventBucket.add(area, 'mousedown', function (e) {
        onMouse(e, true);
    });
    eventBucket.add(area, 'touchstart', function (e) {
        onTouch(e, true);
    });
    eventBucket.add(window, 'mousemove', onMouse);
    eventBucket.add(area, 'touchmove', onTouch);
    eventBucket.add(window, 'mouseup', function (e) {
        dragging = false;
    });
    eventBucket.add(area, 'touchend', function (e) {
        dragging = false;
    });
    eventBucket.add(area, 'touchcancel', function (e) {
        dragging = false;
    });
}

var BG_TRANSP = 'linear-gradient(45deg, lightgrey 25%, transparent 25%, transparent 75%, lightgrey 75%) 0 0 / 2em 2em,\n                   linear-gradient(45deg, lightgrey 25%,       white 25%,       white 75%, lightgrey 75%) 1em 1em / 2em 2em';
var HUES = 360;

var EVENT_KEY = 'keydown',
    EVENT_CLICK_OUTSIDE = 'mousedown',
    EVENT_TAB_MOVE = 'focusin';

function $(selector, context) {
    return (context || document).querySelector(selector);
}

function stopEvent(e) {

    e.preventDefault();
    e.stopPropagation();
}
function onKey(bucket, target, keys, handler, stop) {
    bucket.add(target, EVENT_KEY, function (e) {
        if (keys.indexOf(e.key) >= 0) {
            if (stop) {
                stopEvent(e);
            }
            handler(e);
        }
    });
}

var Picker = function () {
    function Picker(options) {
        classCallCheck(this, Picker);


        this.settings = {

            popup: 'right',
            layout: 'default',
            alpha: true,
            editor: true,
            editorFormat: 'hex',
            cancelButton: false,
            defaultColor: '#0cf'
        };

        this._events = new EventBucket();

        this.onChange = null;

        this.onDone = null;

        this.onOpen = null;

        this.onClose = null;

        this.setOptions(options);
    }

    createClass(Picker, [{
        key: 'setOptions',
        value: function setOptions(options) {
            var _this = this;

            if (!options) {
                return;
            }
            var settings = this.settings;

            function transfer(source, target, skipKeys) {
                for (var key in source) {
                    if (skipKeys && skipKeys.indexOf(key) >= 0) {
                        continue;
                    }

                    target[key] = source[key];
                }
            }

            if (options instanceof HTMLElement) {
                settings.parent = options;
            } else {

                if (settings.parent && options.parent && settings.parent !== options.parent) {
                    this._events.remove(settings.parent);
                    this._popupInited = false;
                }

                transfer(options, settings);

                if (options.onChange) {
                    this.onChange = options.onChange;
                }
                if (options.onDone) {
                    this.onDone = options.onDone;
                }
                if (options.onOpen) {
                    this.onOpen = options.onOpen;
                }
                if (options.onClose) {
                    this.onClose = options.onClose;
                }

                var col = options.color || options.colour;
                if (col) {
                    this._setColor(col);
                }
            }

            var parent = settings.parent;
            if (parent && settings.popup && !this._popupInited) {

                var openProxy = function openProxy(e) {
                    return _this.openHandler(e);
                };

                this._events.add(parent, 'click', openProxy);

                onKey(this._events, parent, [' ', 'Spacebar', 'Enter'], openProxy);

                this._popupInited = true;
            } else if (options.parent && !settings.popup) {
                this.show();
            }
        }
    }, {
        key: 'openHandler',
        value: function openHandler(e) {
            if (this.show()) {

                e && e.preventDefault();

                this.settings.parent.style.pointerEvents = 'none';

                var toFocus = e && e.type === EVENT_KEY ? this._domEdit : this.domElement;
                setTimeout(function () {
                    return toFocus.focus();
                }, 100);

                if (this.onOpen) {
                    this.onOpen(this.colour);
                }
            }
        }
    }, {
        key: 'closeHandler',
        value: function closeHandler(e) {
            var event = e && e.type;
            var doHide = false;

            if (!e) {
                doHide = true;
            } else if (event === EVENT_CLICK_OUTSIDE || event === EVENT_TAB_MOVE) {

                var knownTime = (this.__containedEvent || 0) + 100;
                if (e.timeStamp > knownTime) {
                    doHide = true;
                }
            } else {

                stopEvent(e);

                doHide = true;
            }

            if (doHide && this.hide()) {
                this.settings.parent.style.pointerEvents = '';

                if (event !== EVENT_CLICK_OUTSIDE) {
                    this.settings.parent.focus();
                }

                if (this.onClose) {
                    this.onClose(this.colour);
                }
            }
        }
    }, {
        key: 'movePopup',
        value: function movePopup(options, open) {

            this.closeHandler();

            this.setOptions(options);
            if (open) {
                this.openHandler();
            }
        }
    }, {
        key: 'setColor',
        value: function setColor(color, silent) {
            this._setColor(color, { silent: silent });
        }
    }, {
        key: '_setColor',
        value: function _setColor(color, flags) {
            if (typeof color === 'string') {
                color = color.trim();
            }
            if (!color) {
                return;
            }

            flags = flags || {};
            var c = void 0;
            try {

                c = new Color(color);
            } catch (ex) {
                if (flags.failSilently) {
                    return;
                }
                throw ex;
            }

            if (!this.settings.alpha) {
                var hsla = c.hsla;
                hsla[3] = 1;
                c.hsla = hsla;
            }
            this.colour = this.color = c;
            this._setHSLA(null, null, null, null, flags);
        }
    }, {
        key: 'setColour',
        value: function setColour(colour, silent) {
            this.setColor(colour, silent);
        }
    }, {
        key: 'show',
        value: function show() {
            var parent = this.settings.parent;
            if (!parent) {
                return false;
            }

            if (this.domElement) {
                var toggled = this._toggleDOM(true);

                this._setPosition();

                return toggled;
            }

            var html = this.settings.template || '<div class="picker_wrapper" tabindex="-1"><div class="picker_arrow"></div><div class="picker_hue picker_slider"><div class="picker_selector"></div></div><div class="picker_sl"><div class="picker_selector"></div></div><div class="picker_alpha picker_slider"><div class="picker_selector"></div></div><div class="picker_editor"><input aria-label="Type a color name or hex value"/></div><div class="picker_sample"></div><div class="picker_done"><button>Ok</button></div><div class="picker_cancel"><button>Cancel</button></div></div>';
            var wrapper = parseHTML(html);

            this.domElement = wrapper;
            this._domH = $('.picker_hue', wrapper);
            this._domSL = $('.picker_sl', wrapper);
            this._domA = $('.picker_alpha', wrapper);
            this._domEdit = $('.picker_editor input', wrapper);
            this._domSample = $('.picker_sample', wrapper);
            this._domOkay = $('.picker_done button', wrapper);
            this._domCancel = $('.picker_cancel button', wrapper);

            wrapper.classList.add('layout_' + this.settings.layout);
            if (!this.settings.alpha) {
                wrapper.classList.add('no_alpha');
            }
            if (!this.settings.editor) {
                wrapper.classList.add('no_editor');
            }
            if (!this.settings.cancelButton) {
                wrapper.classList.add('no_cancel');
            }
            this._ifPopup(function () {
                return wrapper.classList.add('popup');
            });

            this._setPosition();

            if (this.colour) {
                this._updateUI();
            } else {
                this._setColor(this.settings.defaultColor);
            }
            this._bindEvents();

            return true;
        }
    }, {
        key: 'hide',
        value: function hide() {
            return this._toggleDOM(false);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._events.destroy();
            if (this.domElement) {
                this.settings.parent.removeChild(this.domElement);
            }
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this2 = this;

            var that = this,
                dom = this.domElement,
                events = this._events;

            function addEvent(target, type, handler) {
                events.add(target, type, handler);
            }

            addEvent(dom, 'click', function (e) {
                return e.preventDefault();
            });

            dragTrack(events, this._domH, function (x, y) {
                return that._setHSLA(x);
            });

            dragTrack(events, this._domSL, function (x, y) {
                return that._setHSLA(null, x, 1 - y);
            });

            if (this.settings.alpha) {
                dragTrack(events, this._domA, function (x, y) {
                    return that._setHSLA(null, null, null, 1 - y);
                });
            }

            var editInput = this._domEdit;
            {
                addEvent(editInput, 'input', function (e) {
                    that._setColor(this.value, { fromEditor: true, failSilently: true });
                });

                addEvent(editInput, 'focus', function (e) {
                    var input = this;

                    if (input.selectionStart === input.selectionEnd) {
                        input.select();
                    }
                });
            }

            this._ifPopup(function () {

                var popupCloseProxy = function popupCloseProxy(e) {
                    return _this2.closeHandler(e);
                };

                addEvent(window, EVENT_CLICK_OUTSIDE, popupCloseProxy);
                addEvent(window, EVENT_TAB_MOVE, popupCloseProxy);
                onKey(events, dom, ['Esc', 'Escape'], popupCloseProxy);

                var timeKeeper = function timeKeeper(e) {
                    _this2.__containedEvent = e.timeStamp;
                };
                addEvent(dom, EVENT_CLICK_OUTSIDE, timeKeeper);

                addEvent(dom, EVENT_TAB_MOVE, timeKeeper);

                addEvent(_this2._domCancel, 'click', popupCloseProxy);
            });

            var onDoneProxy = function onDoneProxy(e) {
                _this2._ifPopup(function () {
                    return _this2.closeHandler(e);
                });
                if (_this2.onDone) {
                    _this2.onDone(_this2.colour);
                }
            };
            addEvent(this._domOkay, 'click', onDoneProxy);
            onKey(events, dom, ['Enter'], onDoneProxy);
        }
    }, {
        key: '_setPosition',
        value: function _setPosition() {
            var parent = this.settings.parent,
                elm = this.domElement;

            if (parent !== elm.parentNode) {
                parent.appendChild(elm);
            }

            this._ifPopup(function (popup) {

                if (getComputedStyle(parent).position === 'static') {
                    parent.style.position = 'relative';
                }

                var cssClass = popup === true ? 'popup_right' : 'popup_' + popup;

                ['popup_top', 'popup_bottom', 'popup_left', 'popup_right'].forEach(function (c) {

                    if (c === cssClass) {
                        elm.classList.add(c);
                    } else {
                        elm.classList.remove(c);
                    }
                });

                elm.classList.add(cssClass);
            });
        }
    }, {
        key: '_setHSLA',
        value: function _setHSLA(h, s, l, a, flags) {
            flags = flags || {};

            var col = this.colour,
                hsla = col.hsla;

            [h, s, l, a].forEach(function (x, i) {
                if (x || x === 0) {
                    hsla[i] = x;
                }
            });
            col.hsla = hsla;

            this._updateUI(flags);

            if (this.onChange && !flags.silent) {
                this.onChange(col);
            }
        }
    }, {
        key: '_updateUI',
        value: function _updateUI(flags) {
            if (!this.domElement) {
                return;
            }
            flags = flags || {};

            var col = this.colour,
                hsl = col.hsla,
                cssHue = 'hsl(' + hsl[0] * HUES + ', 100%, 50%)',
                cssHSL = col.hslString,
                cssHSLA = col.hslaString;

            var uiH = this._domH,
                uiSL = this._domSL,
                uiA = this._domA,
                thumbH = $('.picker_selector', uiH),
                thumbSL = $('.picker_selector', uiSL),
                thumbA = $('.picker_selector', uiA);

            function posX(parent, child, relX) {
                child.style.left = relX * 100 + '%';
            }
            function posY(parent, child, relY) {
                child.style.top = relY * 100 + '%';
            }

            posX(uiH, thumbH, hsl[0]);

            this._domSL.style.backgroundColor = this._domH.style.color = cssHue;

            posX(uiSL, thumbSL, hsl[1]);
            posY(uiSL, thumbSL, 1 - hsl[2]);

            uiSL.style.color = cssHSL;

            posY(uiA, thumbA, 1 - hsl[3]);

            var opaque = cssHSL,
                transp = opaque.replace('hsl', 'hsla').replace(')', ', 0)'),
                bg = 'linear-gradient(' + [opaque, transp] + ')';

            this._domA.style.background = bg + ', ' + BG_TRANSP;

            if (!flags.fromEditor) {
                var format = this.settings.editorFormat,
                    alpha = this.settings.alpha;

                var value = void 0;
                switch (format) {
                    case 'rgb':
                        value = col.printRGB(alpha);break;
                    case 'hsl':
                        value = col.printHSL(alpha);break;
                    default:
                        value = col.printHex(alpha);
                }
                this._domEdit.value = value;
            }

            this._domSample.style.color = cssHSLA;
        }
    }, {
        key: '_ifPopup',
        value: function _ifPopup(actionIf, actionElse) {
            if (this.settings.parent && this.settings.popup) {
                actionIf && actionIf(this.settings.popup);
            } else {
                actionElse && actionElse();
            }
        }
    }, {
        key: '_toggleDOM',
        value: function _toggleDOM(toVisible) {
            var dom = this.domElement;
            if (!dom) {
                return false;
            }

            var displayStyle = toVisible ? '' : 'none',
                toggle = dom.style.display !== displayStyle;

            if (toggle) {
                dom.style.display = displayStyle;
            }
            return toggle;
        }
    }]);
    return Picker;
}();

{
    var style = document.createElement('style');
    style.textContent = '.picker_wrapper.no_alpha .picker_alpha{display:none}.picker_wrapper.no_editor .picker_editor{position:absolute;z-index:-1;opacity:0}.picker_wrapper.no_cancel .picker_cancel{display:none}.layout_default.picker_wrapper{display:flex;flex-flow:row wrap;justify-content:space-between;align-items:stretch;font-size:10px;width:25em;padding:.5em}.layout_default.picker_wrapper input,.layout_default.picker_wrapper button{font-size:1rem}.layout_default.picker_wrapper>*{margin:.5em}.layout_default.picker_wrapper::before{content:"";display:block;width:100%;height:0;order:1}.layout_default .picker_slider,.layout_default .picker_selector{padding:1em}.layout_default .picker_hue{width:100%}.layout_default .picker_sl{flex:1 1 auto}.layout_default .picker_sl::before{content:"";display:block;padding-bottom:100%}.layout_default .picker_editor{order:1;width:6.5rem}.layout_default .picker_editor input{width:100%;height:100%}.layout_default .picker_sample{order:1;flex:1 1 auto}.layout_default .picker_done,.layout_default .picker_cancel{order:1}.picker_wrapper{box-sizing:border-box;background:#f2f2f2;box-shadow:0 0 0 1px silver;cursor:default;font-family:sans-serif;color:#444;pointer-events:auto}.picker_wrapper:focus{outline:none}.picker_wrapper button,.picker_wrapper input{box-sizing:border-box;border:none;box-shadow:0 0 0 1px silver;outline:none}.picker_wrapper button:focus,.picker_wrapper button:active,.picker_wrapper input:focus,.picker_wrapper input:active{box-shadow:0 0 2px 1px #1e90ff}.picker_wrapper button{padding:.4em .6em;cursor:pointer;background-color:#f5f5f5;background-image:linear-gradient(0deg, gainsboro, transparent)}.picker_wrapper button:active{background-image:linear-gradient(0deg, transparent, gainsboro)}.picker_wrapper button:hover{background-color:#fff}.picker_selector{position:absolute;z-index:1;display:block;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);border:2px solid #fff;border-radius:100%;box-shadow:0 0 3px 1px #67b9ff;background:currentColor;cursor:pointer}.picker_slider .picker_selector{border-radius:2px}.picker_hue{position:relative;background-image:linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red);box-shadow:0 0 0 1px silver}.picker_sl{position:relative;box-shadow:0 0 0 1px silver;background-image:linear-gradient(180deg, white, rgba(255, 255, 255, 0) 50%),linear-gradient(0deg, black, rgba(0, 0, 0, 0) 50%),linear-gradient(90deg, #808080, rgba(128, 128, 128, 0))}.picker_alpha,.picker_sample{position:relative;background:linear-gradient(45deg, lightgrey 25%, transparent 25%, transparent 75%, lightgrey 75%) 0 0/2em 2em,linear-gradient(45deg, lightgrey 25%, white 25%, white 75%, lightgrey 75%) 1em 1em/2em 2em;box-shadow:0 0 0 1px silver}.picker_alpha .picker_selector,.picker_sample .picker_selector{background:none}.picker_editor input{font-family:monospace;padding:.2em .4em}.picker_sample::before{content:"";position:absolute;display:block;width:100%;height:100%;background:currentColor}.picker_arrow{position:absolute;z-index:-1}.picker_wrapper.popup{position:absolute;z-index:2;margin:1.5em}.picker_wrapper.popup,.picker_wrapper.popup .picker_arrow::before,.picker_wrapper.popup .picker_arrow::after{background:#f2f2f2;box-shadow:0 0 10px 1px rgba(0,0,0,.4)}.picker_wrapper.popup .picker_arrow{width:3em;height:3em;margin:0}.picker_wrapper.popup .picker_arrow::before,.picker_wrapper.popup .picker_arrow::after{content:"";display:block;position:absolute;top:0;left:0;z-index:-99}.picker_wrapper.popup .picker_arrow::before{width:100%;height:100%;-webkit-transform:skew(45deg);transform:skew(45deg);-webkit-transform-origin:0 100%;transform-origin:0 100%}.picker_wrapper.popup .picker_arrow::after{width:150%;height:150%;box-shadow:none}.popup.popup_top{bottom:100%;left:0}.popup.popup_top .picker_arrow{bottom:0;left:0;-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.popup.popup_bottom{top:100%;left:0}.popup.popup_bottom .picker_arrow{top:0;left:0;-webkit-transform:rotate(90deg) scale(1, -1);transform:rotate(90deg) scale(1, -1)}.popup.popup_left{top:0;right:100%}.popup.popup_left .picker_arrow{top:0;right:0;-webkit-transform:scale(-1, 1);transform:scale(-1, 1)}.popup.popup_right{top:0;left:100%}.popup.popup_right .picker_arrow{top:0;left:0}';
    document.documentElement.firstElementChild.appendChild(style);

    Picker.StyleElement = style;
}




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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7c1d03a3f73");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("b3343415bd1d");
/**
 * SIMAI Framework
 * Copyright 2008-2026 SIMAI Ltd
 * http://simai.studio
 *
 * THEME BUILDER
 *
 * Entry point for importing component assets.
 */


})();

/******/ })()
;