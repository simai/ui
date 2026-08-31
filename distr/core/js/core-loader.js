"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[66700837013363],{

/***/ "09d27e26e137"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initIconSubsetState: () => (/* binding */ initIconSubsetState),
/* harmony export */   installIconSubsetRuntime: () => (/* binding */ installIconSubsetRuntime),
/* harmony export */   normalizeIconFontLoadWeight: () => (/* binding */ normalizeIconFontLoadWeight)
/* harmony export */ });
function initIconSubsetState(loader) {
  loader.iconFontReady = false;
  loader.iconSubsetPending = false;
  loader.loadedIcons = new Set();
  loader.iconSubsetReady = false;
  loader.iconSubsetPromise = null;
  loader.iconSubsetNeedsReload = false;
  loader.iconSubsetManifest = null;
  loader.iconSubsetHash = "";
  loader.iconManifestStorageKey = "SF_ICON_SUBSET_MANIFEST";
  loader.iconSubsetManifests = new Map();
  loader.iconSubsetHashes = new Map();
  loader.iconSubsetWarnings = new Set();
  loader.pendingIconScanCount = 0;
  loader.isSyncingStaticIconState = false;
  loader.staticIconDescriptorKeys = new WeakMap();
  return loader;
}
function normalizeIconFontLoadWeight(value = "400") {
  const normalized = String(value || "").trim().replace(/\s+/g, " ");
  const range = normalized.match(/^([1-9]00)\s+([1-9]00)$/);

  if (!range) {
    return normalized || "400";
  }

  const start = Number(range[1]);
  const end = Number(range[2]);
  const minimum = Math.min(start, end);
  const maximum = Math.max(start, end);
  return String(Math.min(maximum, Math.max(minimum, 400)));
}
function installIconSubsetRuntime(SFLoaderPlugin, {
  safeSetItem,
  safeRemoveItem
} = {}) {
  const normalizeConfigList = (value = []) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      return value.split(",").map(item => item.trim()).filter(Boolean);
    }

    if (value == null || value === false) {
      return [];
    }

    return [value];
  };

  const iconWeightClassMap = new Map([["sf-icon-thin", "100"], ["sf-icon-extra-light", "200"], ["sf-icon-light", "300"], ["sf-icon-regular", "400"], ["sf-icon-medium", "500"], ["sf-icon-semi-bold", "600"], ["sf-icon-bold", "700"]]);
  const defaultIconWeight = "400";
  const iconTypeClassMap = new Map([["sf-icon-rounded", "rounded"], ["sf-icon-shape", "sharp"]]);
  const iconFamilyTypeMap = new Map([["material symbols outlined", "outlined"], ["material symbols rounded", "rounded"], ["material symbols sharp", "sharp"]]);
  const iconFallbackFontFiles = Object.freeze({
    outlined: {
      family: "Material Symbols Outlined",
      file: "MaterialSymbols-Outlined.woff2",
      format: "woff2",
      weight: "100 700"
    },
    rounded: {
      family: "Material Icons Round",
      file: "MaterialIconsRound-Regular.otf",
      format: "opentype",
      weight: "400"
    },
    sharp: {
      family: "Material Icons Sharp",
      file: "MaterialIconsSharp-Regular.otf",
      format: "opentype",
      weight: "400"
    }
  });

  const isTruthyIconFlag = (value, fallback = false) => {
    if (value === "" || value === true) return true;
    if (value === false || value == null) return fallback;
    const normalized = String(value).trim().toLowerCase();
    if (!normalized) return true;
    return !["0", "false", "no", "off", "none"].includes(normalized);
  };

  SFLoaderPlugin.prototype.normalizeIconType = function (type = "") {
    const normalized = String(type || "").trim().toLowerCase();

    if (!normalized || normalized === "outlined" || normalized === "outline") {
      return "outlined";
    }

    if (normalized === "shape") {
      return "sharp";
    }

    if (normalized === "rounded" || normalized === "sharp") {
      return normalized;
    }

    return "outlined";
  };

  SFLoaderPlugin.prototype.isIconSubsetEnabled = function () {
    const configValue = window.SF_BOOT_CONFIG?.icons?.enabled;
    const globalValue = window.SF_ICON_SUBSET_ENABLED;

    if (typeof configValue === "boolean") {
      return configValue;
    }

    if (typeof globalValue === "boolean") {
      return globalValue;
    }

    return true;
  };

  SFLoaderPlugin.prototype.getDefaultIconType = function () {
    return this.normalizeIconType(window.SF_BOOT_CONFIG?.icons?.type || window.SF_ICON_TYPE || "outlined");
  };

  SFLoaderPlugin.prototype.getIconManifestStorageKey = function (type = "") {
    const normalizedType = this.normalizeIconType(type);
    return normalizedType === "outlined" ? this.iconManifestStorageKey : `${this.iconManifestStorageKey}:${normalizedType}`;
  };

  SFLoaderPlugin.prototype.getIconManifestForType = function (type = "") {
    const normalizedType = this.normalizeIconType(type);
    return this.iconSubsetManifests?.get(normalizedType) || (this.iconSubsetManifest && this.getIconManifestType(this.iconSubsetManifest) === normalizedType ? this.iconSubsetManifest : null);
  };

  SFLoaderPlugin.prototype.setIconManifestForType = function (type = "", manifest = null) {
    const normalizedType = this.normalizeIconType(type);

    if (!this.iconSubsetManifests) {
      this.iconSubsetManifests = new Map();
    }

    if (!this.iconSubsetHashes) {
      this.iconSubsetHashes = new Map();
    }

    if (!manifest) {
      this.iconSubsetManifests.delete(normalizedType);
      this.iconSubsetHashes.delete(normalizedType);
    } else {
      this.iconSubsetManifests.set(normalizedType, manifest);
      this.iconSubsetHashes.set(normalizedType, manifest.hash || manifest.packet_sha256 || "");
    }

    if (normalizedType === this.getDefaultIconType()) {
      this.iconSubsetManifest = manifest;
      this.iconSubsetHash = manifest?.hash || manifest?.packet_sha256 || "";
    }
  };

  SFLoaderPlugin.prototype.getConfiguredIconSubsetConfig = function () {
    const rawConfig = window.SF_BOOT_CONFIG?.icons?.staticSubset || window.SF_ICON_STATIC_SUBSET;

    if (!rawConfig || typeof rawConfig !== "object") {
      return null;
    }

    const icons = Array.from(new Set(normalizeConfigList(rawConfig.icons || rawConfig.icon_names).map(icon => String(icon || "").trim()))).filter(Boolean);

    if (!icons.length) {
      return null;
    }

    const weights = new Set(normalizeConfigList(rawConfig.weights || rawConfig.weight).map(item => String(item).trim()));
    const fills = new Set(normalizeConfigList(rawConfig.fill ?? rawConfig.filled).map(item => String(item).trim()));
    const grades = new Set(normalizeConfigList(rawConfig.grade).map(item => String(item).trim()));
    const defaultType = this.normalizeIconType(rawConfig.type || this.getDefaultIconType());
    const types = new Set(normalizeConfigList(rawConfig.type || defaultType).map(item => this.normalizeIconType(item)));
    return {
      icons,
      weights,
      fills,
      grades,
      types,
      fill: fills.size > 0,
      grade: grades.size ? [...grades].join(",") : "",
      defaultType
    };
  };

  SFLoaderPlugin.prototype.hasConfiguredIconSubset = function () {
    return Boolean(this.getConfiguredIconSubsetConfig());
  };

  SFLoaderPlugin.prototype.ensureConfiguredIconSubsetState = function (options = {}) {
    const config = this.getConfiguredIconSubsetConfig();

    if (!config) {
      return false;
    }

    const {
      forceLoaded = false
    } = options;
    config.icons.forEach(icon => {
      const iconAttrs = this.uniqueIcons.has(icon) ? this.uniqueIcons.get(icon) : new Map();

      if (config.weights.size) {
        iconAttrs.set("weight", new Set(config.weights));
      }

      if (config.fills.size) {
        iconAttrs.set("filled", new Set(config.fills));
      }

      if (config.grades.size) {
        iconAttrs.set("grade", new Set(config.grades));
      }

      if (config.types.size) {
        iconAttrs.set("type", new Set(config.types));
      }

      if (forceLoaded) {
        iconAttrs.set("loading", true);
      } else if (iconAttrs.get("loading") !== true) {
        iconAttrs.set("loading", false);
      }

      this.uniqueIcons.set(icon, iconAttrs);
    });
    return true;
  };

  SFLoaderPlugin.prototype.getManifestAxisValue = function (manifest = {}, axisName = "") {
    if (!manifest || !axisName) return "";
    const axes = manifest.axes || {};
    const axis = axes[axisName] || axes[axisName.toLowerCase()] || axes[axisName.toUpperCase()];

    if (axis == null) {
      return "";
    }

    if (typeof axis === "object") {
      if (typeof axis.value !== "undefined" && axis.value !== null) {
        return String(axis.value).trim();
      }

      if (typeof axis.raw !== "undefined" && axis.raw !== null) {
        return String(axis.raw).trim();
      }
    }

    return String(axis).trim();
  };

  SFLoaderPlugin.prototype.getManifestAxis = function (manifest = {}, axisName = "") {
    if (!manifest || !axisName) return null;
    const axes = manifest.axes || {};
    return axes[axisName] || axes[axisName.toLowerCase()] || axes[axisName.toUpperCase()] || null;
  };

  SFLoaderPlugin.prototype.manifestAxisIncludesValue = function (manifest = {}, axisName = "", value = "") {
    const normalizedValue = String(value ?? "").trim();
    if (!normalizedValue) return true;
    const axis = this.getManifestAxis(manifest, axisName);
    if (axis == null) return true;

    if (typeof axis !== "object") {
      return String(axis).trim() === normalizedValue;
    }

    if (typeof axis.value !== "undefined" && axis.value !== null && String(axis.value).trim()) {
      return String(axis.value).trim() === normalizedValue;
    }

    if (Array.isArray(axis.values)) {
      return axis.values.map(item => String(item).trim()).includes(normalizedValue);
    }

    const min = typeof axis.min !== "undefined" && axis.min !== null ? Number(axis.min) : null;
    const max = typeof axis.max !== "undefined" && axis.max !== null ? Number(axis.max) : null;
    const numericValue = Number(normalizedValue);

    if (min !== null && max !== null && !Number.isNaN(min) && !Number.isNaN(max) && !Number.isNaN(numericValue)) {
      return numericValue >= min && numericValue <= max;
    }

    if (typeof axis.raw !== "undefined" && axis.raw !== null) {
      const raw = String(axis.raw).trim();
      if (!raw) return true;

      if (raw.includes(",")) {
        return raw.split(",").map(item => item.trim()).includes(normalizedValue);
      }

      return raw === normalizedValue;
    }

    return true;
  };

  SFLoaderPlugin.prototype.isIconCoveredByManifest = function (icon = "", attrs = {}) {
    const attrType = this.normalizeIconType(attrs.type || this.getDefaultIconType());
    const manifest = this.getIconManifestForType(attrType);
    if (!manifest || typeof manifest !== "object") return false;
    const manifestIcons = Array.isArray(manifest.icons) ? manifest.icons : [];
    if (!manifestIcons.includes(icon)) return false;
    const manifestType = this.getIconManifestType(manifest);

    if (manifestType !== attrType) {
      return false;
    }

    if (attrs.weight && !this.manifestAxisIncludesValue(manifest, "wght", attrs.weight)) {
      return false;
    }

    if (attrs.filled && (!this.getManifestAxis(manifest, "FILL") || !this.manifestAxisIncludesValue(manifest, "FILL", attrs.filled))) {
      return false;
    }

    return true;
  };

  SFLoaderPlugin.prototype.isManifestCoveredByConfiguredSubset = function (manifest = {}) {
    const config = this.getConfiguredIconSubsetConfig();
    if (!config) return true;
    const manifestIcons = Array.isArray(manifest.icons) ? manifest.icons : [];

    if (!config.icons.every(icon => manifestIcons.includes(icon))) {
      return false;
    }

    const manifestType = this.getIconManifestType(manifest);

    if ([...config.types].some(type => type !== manifestType)) {
      return false;
    }

    if ([...config.weights].some(weight => !this.manifestAxisIncludesValue(manifest, "wght", weight))) {
      return false;
    }

    if ([...config.fills].some(fill => !this.getManifestAxis(manifest, "FILL") || !this.manifestAxisIncludesValue(manifest, "FILL", fill))) {
      return false;
    }

    if ([...config.grades].some(grade => !this.manifestAxisIncludesValue(manifest, "GRAD", grade))) {
      return false;
    }

    return true;
  };

  SFLoaderPlugin.prototype.trackIconDescriptor = function (icon = "", attrs = {}) {
    if (!this.isIconSubsetEnabled()) return 0;
    if (this.hasConfiguredIconSubset()) return 0;
    const normalizedIcon = String(icon || "").trim();
    if (!normalizedIcon) return 0;
    const isNewIcon = !this.uniqueIcons.has(normalizedIcon);
    const iconAttrs = isNewIcon ? new Map() : this.uniqueIcons.get(normalizedIcon);
    let hasNewAttrs = false;
    Object.entries(attrs).forEach(([key, value]) => {
      if (value == null || value === "") return;
      const normalizedValue = String(value).trim();
      if (!normalizedValue) return;

      if (!iconAttrs.has(key)) {
        iconAttrs.set(key, new Set());
        hasNewAttrs = true;
      }

      if (!iconAttrs.get(key).has(normalizedValue)) {
        iconAttrs.get(key).add(normalizedValue);
        hasNewAttrs = true;
      }
    });
    const loadAttrs = this.getIconLoadAttrs(attrs);

    if (this.isIconCoveredByManifest(normalizedIcon, loadAttrs)) {
      iconAttrs.set("loading", true);
      this.uniqueIcons.set(normalizedIcon, iconAttrs);
      return 0;
    }

    if (!isNewIcon && !hasNewAttrs) {
      return 0;
    }

    iconAttrs.set("loading", false);
    this.uniqueIcons.set(normalizedIcon, iconAttrs);
    return 1;
  };

  SFLoaderPlugin.prototype.getStaticIconDescriptorKey = function (icon = "", attrs = {}) {
    const normalizedAttrs = Object.entries(attrs).filter(([, value]) => value != null && value !== "").map(([key, value]) => [key, String(value).trim()]).sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify([String(icon || "").trim(), normalizedAttrs]);
  };

  SFLoaderPlugin.prototype.getIconLoadAttrs = function (attrs = {}) {
    const normalized = {};
    ["weight", "filled", "grade", "type"].forEach(key => {
      const value = attrs?.[key];

      if (value == null || value === "") {
        return;
      }

      normalized[key] = String(value).trim();
    });

    if (!normalized.weight) {
      normalized.weight = defaultIconWeight;
    }

    if (!normalized.type) {
      normalized.type = this.getDefaultIconType();
    }

    return normalized;
  };

  SFLoaderPlugin.prototype.getLoadedIconDescriptorKey = function (icon = "", attrs = {}) {
    return this.getStaticIconDescriptorKey(icon, this.getIconLoadAttrs(attrs));
  };

  SFLoaderPlugin.prototype.getLoadedDescriptorKeysForIconState = function (icon = "", iconAttrs = new Map()) {
    const iconName = String(icon || "").trim();

    if (!iconName) {
      return [];
    }

    const weights = iconAttrs.get("weight");
    const fills = iconAttrs.get("filled");
    const grades = iconAttrs.get("grade");
    const types = iconAttrs.get("type");
    const weightValues = weights instanceof Set && weights.size ? [...weights].map(value => String(value).trim()).filter(Boolean) : [defaultIconWeight];
    const fillValues = fills instanceof Set && fills.size ? [...fills].map(value => String(value).trim()).filter(Boolean) : [""];
    const gradeValues = grades instanceof Set && grades.size ? [...grades].map(value => String(value).trim()).filter(Boolean) : [""];
    const typeValues = types instanceof Set && types.size ? [...types].map(value => this.normalizeIconType(value)).filter(Boolean) : [this.getDefaultIconType()];
    const keys = new Set();
    weightValues.forEach(weight => {
      fillValues.forEach(filled => {
        gradeValues.forEach(grade => {
          typeValues.forEach(type => {
            keys.add(this.getLoadedIconDescriptorKey(iconName, {
              weight,
              filled,
              grade,
              type
            }));
          });
        });
      });
    });
    return [...keys];
  };

  SFLoaderPlugin.prototype.isTrackedIconLoaded = function (tracked) {
    if (!tracked?.icon) {
      return false;
    }

    const loadAttrs = this.getIconLoadAttrs(tracked.attrs);

    if (this.isIconCoveredByManifest(tracked.icon, loadAttrs)) {
      return true;
    }

    const descriptorKey = this.getLoadedIconDescriptorKey(tracked.icon, tracked.attrs);
    return this.loadedIcons.has(descriptorKey);
  };

  SFLoaderPlugin.prototype.getStaticIconElement = function (node) {
    const host = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement || null;
    const iconElement = host?.classList?.contains("sf-icon") ? host : host?.closest?.(".sf-icon") || null;
    if (!iconElement || iconElement.nodeType !== Node.ELEMENT_NODE) return null;
    if (iconElement.tagName?.toLowerCase?.() === "sf-icon") return null;
    if (!iconElement.classList?.contains("sf-icon")) return null;
    if (iconElement.closest?.("sf-icon")) return null;
    if (this.shouldSkipNode(iconElement)) return null;
    return iconElement;
  };

  SFLoaderPlugin.prototype.isStaticIconLoadedStateCurrent = function (el, tracked) {
    if (!el || !tracked) return false;
    return el.classList.contains("sf-icon-loaded") === this.isTrackedIconLoaded(tracked);
  };

  SFLoaderPlugin.prototype.syncTrackedStaticIconElement = function (el, tracked) {
    if (!el || !tracked || !this.staticIconDescriptorKeys) return;
    const nextKey = this.getLoadedIconDescriptorKey(tracked.icon, tracked.attrs);
    const prevKey = this.staticIconDescriptorKeys.get(el);

    if (prevKey && prevKey !== nextKey && !this.isTrackedIconLoaded(tracked)) {
      el.classList.remove("sf-icon-loaded");
    }

    this.staticIconDescriptorKeys.set(el, nextKey);
    return prevKey !== nextKey;
  };

  SFLoaderPlugin.prototype.getTrackedIconAttrs = function (el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;
    const icon = String(el.getAttribute("icon") || "").trim();
    if (!icon) return null;
    const attrs = {};
    ["weight", "size"].forEach(attr => {
      const value = el.getAttribute(attr);

      if (value != null) {
        attrs[attr] = String(value).trim();
      }
    });

    if (el.hasAttribute("filled")) {
      const value = el.getAttribute("filled");

      if (isTruthyIconFlag(value)) {
        attrs.filled = "1";
      }
    }

    attrs.type = this.getDefaultIconType();
    return {
      icon,
      attrs
    };
  };

  SFLoaderPlugin.prototype.getTrackedStaticIconAttrs = function (el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;
    if (!el.classList?.contains("sf-icon")) return null;
    if (el.closest?.("sf-icon")) return null;
    const icon = String(el.getAttribute("data-icon") || el.textContent || "").trim();
    if (!icon) return null;
    const attrs = {
      weight: defaultIconWeight
    };
    const sizeClass = Array.from(el.classList).find(className => className.startsWith("sf-icon--size-"));

    if (sizeClass) {
      attrs.size = sizeClass.replace("sf-icon--size-", "").trim();
    }

    for (const [className, weight] of iconWeightClassMap.entries()) {
      if (el.classList.contains(className)) {
        attrs.weight = weight;
        break;
      }
    }

    for (const [className, type] of iconTypeClassMap.entries()) {
      if (el.classList.contains(className)) {
        attrs.type = type;
        break;
      }
    }

    const attrWeight = el.getAttribute("data-weight") || el.getAttribute("weight") || el.style?.getPropertyValue?.("--sf-icon--weight");

    if (attrWeight) {
      attrs.weight = String(attrWeight).trim();
    }

    const styleFill = String(el.style?.getPropertyValue?.("--sf-icon--fill") || "").trim();
    const isFilled = el.classList.contains("sf-icon-filled") || el.hasAttribute("data-filled") && isTruthyIconFlag(el.getAttribute("data-filled")) || el.hasAttribute("filled") && isTruthyIconFlag(el.getAttribute("filled")) || isTruthyIconFlag(styleFill, false);

    if (isFilled) {
      attrs.filled = "1";
    }

    const attrType = el.getAttribute("data-type") || el.getAttribute("type") || el.style?.getPropertyValue?.("--sf-icon--type");

    if (attrType) {
      attrs.type = this.normalizeIconType(attrType);
    }

    return {
      icon,
      attrs
    };
  };

  SFLoaderPlugin.prototype.trackIconComponent = function (el) {
    if (!this.isIconSubsetEnabled()) return 0;
    const tracked = this.getTrackedStaticIconAttrs(el);
    if (!tracked) return 0;
    const didDescriptorChange = this.syncTrackedStaticIconElement(el, tracked);

    if (!didDescriptorChange && this.isStaticIconLoadedStateCurrent(el, tracked)) {
      return 0;
    }

    return this.trackIconDescriptor(tracked.icon, tracked.attrs);
  };

  SFLoaderPlugin.prototype.processStaticIconMutation = function (node, autoLoad = true) {
    if (!this.isIconSubsetEnabled()) {
      return {
        handled: false,
        iconCount: 0
      };
    }

    const iconElement = this.getStaticIconElement(node);

    if (!iconElement) {
      return {
        handled: false,
        iconCount: 0
      };
    }

    const tracked = this.getTrackedStaticIconAttrs(iconElement);

    if (!tracked) {
      this.staticIconDescriptorKeys?.delete?.(iconElement);
      iconElement.classList.remove("sf-icon-loaded");
      return {
        handled: true,
        iconCount: 0
      };
    }

    const iconCount = this.trackIconComponent(iconElement);

    if (autoLoad && iconCount > 0) {
      this.mutate(() => this.loadFonts());
      return {
        handled: true,
        iconCount
      };
    }

    this.syncStaticIconLoadedState(iconElement);
    return {
      handled: true,
      iconCount
    };
  };

  SFLoaderPlugin.prototype.syncStaticIconLoadedState = function (root = null) {
    if (!this.isIconSubsetEnabled()) return;
    const host = root || document.body;
    if (!host) return;

    const updateLoadedClass = (el, shouldBeLoaded) => {
      const hasLoadedClass = el.classList.contains("sf-icon-loaded");

      if (hasLoadedClass === shouldBeLoaded) {
        return;
      }

      if (shouldBeLoaded) {
        el.classList.add("sf-icon-loaded");
      } else {
        el.classList.remove("sf-icon-loaded");
      }
    };

    const processNode = el => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
      if (el.tagName?.toLowerCase?.() === "sf-icon") return;
      if (el.closest?.("sf-icon")) return;
      if (!el.classList?.contains("sf-icon")) return;
      const tracked = this.getTrackedStaticIconAttrs(el);

      if (!tracked) {
        updateLoadedClass(el, false);
        return;
      }

      updateLoadedClass(el, this.isTrackedIconLoaded(tracked));
    };

    this.isSyncingStaticIconState = true;

    try {
      if (host.nodeType === Node.ELEMENT_NODE) {
        processNode(host);
      }

      if (host.querySelectorAll) {
        host.querySelectorAll(".sf-icon").forEach(processNode);
      }
    } finally {
      this.isSyncingStaticIconState = false;
    }
  };

  SFLoaderPlugin.prototype.scanStaticIcons = function (root = null, autoLoad = true) {
    if (!this.isIconSubsetEnabled()) {
      return {
        iconCount: 0
      };
    }

    const host = root?.nodeType === Node.ELEMENT_NODE ? root : root?.parentElement || document.body;

    if (!host) {
      return {
        iconCount: 0
      };
    }

    if (this.shouldSkipNode(host)) {
      return {
        iconCount: 0
      };
    }

    if (this.hasConfiguredIconSubset()) {
      this.syncStaticIconLoadedState(host);
      return {
        iconCount: 0
      };
    }

    let iconItemCount = 0;

    const processNode = el => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE || this.shouldSkipNode(el)) {
        return;
      }

      iconItemCount += this.trackIconComponent(el);
    };

    if (host.nodeType === Node.ELEMENT_NODE) {
      processNode(host);
    }

    if (host.querySelectorAll) {
      host.querySelectorAll(".sf-icon").forEach(processNode);
    }

    const result = {
      iconCount: iconItemCount
    };

    if (autoLoad && iconItemCount > 0) {
      this.mutate(() => this.loadFonts());
      return result;
    }

    this.syncStaticIconLoadedState(host);
    return result;
  };

  SFLoaderPlugin.prototype.trackIconElement = function (el) {
    if (!this.isIconSubsetEnabled()) return 0;
    const tracked = this.getTrackedIconAttrs(el);
    if (!tracked) return 0;
    return this.trackIconDescriptor(tracked.icon, tracked.attrs);
  };

  SFLoaderPlugin.prototype.trackPendingIconScan = function (scanResult = {}) {
    if (!this.isIconSubsetEnabled()) return 0;
    const iconCount = Number(scanResult.iconCount || 0);

    if (iconCount > 0) {
      this.pendingIconScanCount += iconCount;
    }

    return iconCount;
  };

  SFLoaderPlugin.prototype.markManifestIconsAsLoaded = function (manifest = {}) {
    if (!manifest || typeof manifest !== "object") return false;
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
    if (!icons.length) return false;
    const loadedDescriptorKeys = new Set(this.loadedIcons);
    const manifestType = this.getIconManifestType(manifest);
    const weightAxis = this.getManifestAxis(manifest, "wght");
    const fillAxis = this.getManifestAxis(manifest, "FILL");
    const weights = Array.isArray(weightAxis?.values) ? weightAxis.values : weightAxis?.value ? [weightAxis.value] : [400];
    const fills = Array.isArray(fillAxis?.values) ? fillAxis.values : fillAxis?.value ? [fillAxis.value] : [""];
    icons.forEach(icon => {
      weights.forEach(weight => {
        fills.forEach(filled => {
          loadedDescriptorKeys.add(this.getLoadedIconDescriptorKey(icon, {
            weight,
            filled,
            type: manifestType
          }));
        });
      });
    });
    this.loadedIcons = loadedDescriptorKeys;
    return true;
  };

  SFLoaderPlugin.prototype.flushPendingIconScan = function ({
    defer = false
  } = {}) {
    if (!this.isIconSubsetEnabled()) return false;
    const iconCount = this.pendingIconScanCount;

    if (!iconCount) {
      return false;
    }

    if (defer) {
      return false;
    }

    this.pendingIconScanCount = 0;
    this.mutate(() => this.loadFonts());
    return true;
  };

  SFLoaderPlugin.prototype.handleCustomElementScanResult = function (scanResult = {}, autoLoad = true) {
    const normalized = { ...scanResult,
      keys: Array.isArray(scanResult.keys) ? scanResult.keys : [],
      count: Number(scanResult.count || 0),
      iconCount: Number(scanResult.iconCount || 0)
    };

    if (!autoLoad) {
      return normalized;
    }

    if (normalized.count > 0) {
      this.mutate(() => this.getLoader(this.module, true));
      return normalized;
    }

    if (this.isIconSubsetEnabled() && normalized.iconCount > 0) {
      this.mutate(() => this.loadFonts());
    }

    return normalized;
  };

  SFLoaderPlugin.prototype.getIconSubsetHost = function () {
    return window.SF_BOOT_CONFIG?.icons?.subsetHost || window.SF_ICON_SUBSET_HOST || "https://icons.simai.io" // 'http://127.0.0.1:3189'
    ;
  };

  SFLoaderPlugin.prototype.decodeIconManifestHeader = function (manifestRaw = "") {
    if (!manifestRaw) return null;

    try {
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(manifestRaw.replace(/-/g, "+").replace(/_/g, "/")), char => char.charCodeAt(0))));
    } catch (error) {
      console.warn("SFLoader icon manifest decode failed", error);
      return null;
    }
  };

  SFLoaderPlugin.prototype.getStoredIconManifest = function (type = "") {
    const raw = localStorage.getItem(this.getIconManifestStorageKey(type));
    if (!raw) return null;

    try {
      const manifest = JSON.parse(raw);
      return manifest && typeof manifest === "object" ? manifest : null;
    } catch (error) {
      console.warn("SFLoader icon manifest cache parse failed", error);
      return null;
    }
  };

  SFLoaderPlugin.prototype.getIconManifestFontFamily = function (manifest = {}) {
    if (manifest.font_family) return String(manifest.font_family);
    return `${(manifest.schema === "sf.icon_subset.v1" ? iconFallbackFontFiles[this.getIconManifestType(manifest)]?.family : manifest.family) || "Material Symbols Outlined"} Subset`;
  };

  SFLoaderPlugin.prototype.getIconManifestType = function (manifest = {}) {
    const manifestType = String(manifest.type || (manifest.schema === "sf.icon_subset.v1" ? manifest.family : "") || "").trim().toLowerCase();

    if (manifestType) {
      return this.normalizeIconType(manifestType);
    }

    const familyKey = String(manifest.family || "").trim().toLowerCase();
    return this.normalizeIconType(iconFamilyTypeMap.get(familyKey) || "outlined");
  };

  SFLoaderPlugin.prototype.getIconSubsetSelector = function (manifest = {}) {
    const type = this.getIconManifestType(manifest);

    if (type === "rounded") {
      return ".sf-icon.sf-icon-rounded";
    }

    if (type === "sharp") {
      return ".sf-icon.sf-icon-shape";
    }

    return ".sf-icon:not(.sf-icon-rounded):not(.sf-icon-shape)";
  };

  SFLoaderPlugin.prototype.getIconFallbackFontUrl = function (type = "") {
    const fallbackFonts = window.SF_BOOT_CONFIG?.icons?.fallbackFonts || window.SF_ICON_FALLBACK_FONTS || {};
    const normalizedType = this.normalizeIconType(type);
    const configuredUrl = fallbackFonts[normalizedType] || fallbackFonts.outlined || window.SF_BOOT_CONFIG?.icons?.fallbackFontUrl || window.SF_ICON_FALLBACK_FONT_URL;

    if (configuredUrl) {
      return configuredUrl;
    }

    const file = iconFallbackFontFiles[normalizedType]?.file;
    const root = String(window.sfPath || "").replace(/\/+$/, "");

    if (!file || !root) {
      return "";
    }

    return `${root}/component/icons/fonts/${file}`;
  };

  SFLoaderPlugin.prototype.buildIconFallbackCss = function (options = {}) {
    const type = this.normalizeIconType(options.type || this.getDefaultIconType());
    const url = this.getIconFallbackFontUrl(type);
    const fallbackFont = iconFallbackFontFiles[type];

    if (!url || !fallbackFont) {
      return "";
    }

    const selector = this.getIconSubsetSelector({
      type,
      family: fallbackFont.family
    });
    return `@font-face {\n` + `  font-family: '${fallbackFont.family}';\n` + `  src: url('${url}') format('${fallbackFont.format}');\n` + `  font-style: normal;\n` + `  font-weight: ${fallbackFont.weight};\n` + `  font-display: block;\n` + `}\n\n` + `${selector} {\n` + `  --sf-icon--font-family: '${fallbackFont.family}';\n` + `  font-family: '${fallbackFont.family}';\n` + `  font-feature-settings: 'liga';\n` + `  font-variation-settings: ` + `'FILL' var(--sf-icon--fill, 0), ` + `'wght' var(--sf-icon--weight, 400), ` + `'GRAD' var(--sf-icon--grade, 0), ` + `'opsz' var(--sf-icon--optical-size, 24);\n` + `}\n`;
  };

  SFLoaderPlugin.prototype.applyIconFontFallback = function (options = {}) {
    const icons = Array.isArray(options.icons) ? options.icons : [];
    const type = this.normalizeIconType(options.type || this.getDefaultIconType());
    const prev = document.querySelector(`style[data-sf-icons-fallback="${type}"]`);
    const style = document.createElement("style");
    style.setAttribute("data-sf-icons-fallback", type);

    if (icons.length) {
      style.setAttribute("data-sf-icons-fallback-icons", icons.join(","));
    }

    style.textContent = this.buildIconFallbackCss({
      type
    });

    if (!style.textContent) {
      return false;
    }

    document.head.appendChild(style);

    if (prev) {
      prev.remove();
    }

    const loadedDescriptorKeys = new Set(this.loadedIcons);
    icons.forEach(icon => {
      const iconAttrs = this.uniqueIcons.has(icon) ? this.uniqueIcons.get(icon) : new Map();
      iconAttrs.set("loading", true);
      this.uniqueIcons.set(icon, iconAttrs);
      this.getLoadedDescriptorKeysForIconState(icon, iconAttrs).forEach(key => loadedDescriptorKeys.add(key));
    });
    this.loadedIcons = loadedDescriptorKeys;
    this.iconSubsetPending = false;
    this.iconSubsetReady = true;
    this.iconFontReady = true;
    document.body?.classList?.add("sf-icons-loaded");
    this.syncStaticIconLoadedState();
    const warningKey = `fallback:${type}`;

    if (!this.iconSubsetWarnings?.has(warningKey)) {
      this.iconSubsetWarnings?.add(warningKey);
      console.warn("SFLoader icon subset font fallback applied", {
        type,
        icons,
        reason: options.reason || null,
        url: this.getIconFallbackFontUrl(type)
      });
    }

    window.dispatchEvent(new CustomEvent("sf-icons-subset:ready", {
      detail: {
        icons: new Set(icons),
        weights: [],
        loader: this,
        fallback: true
      }
    }));
    return true;
  };

  SFLoaderPlugin.prototype.buildIconSubsetCssFromManifest = function (manifest = {}) {
    const fonts = Array.isArray(manifest.fonts) ? manifest.fonts : [];

    if (!fonts.length) {
      return {
        cssText: "",
        family: "",
        weights: []
      };
    }

    const family = this.getIconManifestFontFamily(manifest);
    const selector = this.getIconSubsetSelector(manifest);
    const weights = new Set();
    const fontFaces = fonts.filter(font => font?.url).map(font => {
      const weight = font.weight || manifest.axes?.wght?.value || 400;
      weights.add(String(weight));
      return `@font-face {\n` + `  font-family: '${family}';\n` + `  src: url('${font.url}') format('woff2');\n` + `  font-style: normal;\n` + `  font-weight: ${weight};\n` + `  font-display: block;\n` + `}\n`;
    }).join("\n");

    if (!fontFaces) {
      return {
        cssText: "",
        family,
        weights: [...weights]
      };
    }

    const cssText = fontFaces + `\n` + `${selector} {\n` + `  --sf-icon--font-family: '${family}';\n` + `  --sf-icon--font--weight: var(--sf-icon--weight, 400);\n` + `  font-feature-settings: 'liga';\n` + `  font-variation-settings: ` + `'FILL' var(--sf-icon--fill, 0), ` + `'wght' var(--sf-icon--weight, 400), ` + `'GRAD' var(--sf-icon--grade, 0), ` + `'opsz' var(--sf-icon--optical-size, 24);\n` + `}\n`;
    return {
      cssText,
      weights: [...weights]
    };
  };

  SFLoaderPlugin.prototype.applyIconManifest = function (manifest = {}, options = {}) {
    if (!this.isIconSubsetEnabled()) return false;
    if (!manifest || typeof manifest !== "object") return false;
    const {
      cssText: builtCssText,
      weights
    } = this.buildIconSubsetCssFromManifest(manifest);
    const cssText = options.cssText || builtCssText;
    if (!cssText) return false;
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
    const type = this.getIconManifestType(manifest);
    const prev = document.querySelector(`style[data-sf-icons-subset-family="${type}"]`);
    const style = document.createElement("style");
    style.setAttribute("data-sf-icons-subset", icons.join(","));
    style.setAttribute("data-sf-icons-subset-family", type);

    if (manifest.hash) {
      style.setAttribute("data-sf-icons-subset-hash", manifest.hash);
    }

    style.textContent = cssText;
    this.setIconManifestForType(type, manifest);
    this.markManifestIconsAsLoaded(manifest);
    this.iconSubsetPending = true;
    this.iconSubsetReady = false;
    document.head.appendChild(style);
    const fontVerification = Array.isArray(manifest.fonts) && manifest.fonts.length ? this.verifyIconManifestFonts(manifest, {
      icons,
      weights
    }) : this.verifyIconCssFonts(cssText, {
      icons
    });
    this.iconSubsetPromise = fontVerification.then(async () => {
      this.ensureConfiguredIconSubsetState({
        forceLoaded: true
      });
      icons.forEach(icon => {
        const iconAttrs = this.uniqueIcons.has(icon) ? this.uniqueIcons.get(icon) : new Map();
        const keepDirtyState = iconAttrs.get("loading") === false;

        if (!keepDirtyState) {
          iconAttrs.set("loading", true);
        }

        if (weights.length) {
          if (!iconAttrs.has("weight")) {
            iconAttrs.set("weight", new Set());
          }

          weights.forEach(weight => {
            iconAttrs.get("weight").add(String(weight));
          });
        }

        this.uniqueIcons.set(icon, iconAttrs);
      });
      const loadedDescriptorKeys = new Set(this.loadedIcons);
      icons.forEach(icon => {
        const iconAttrs = this.uniqueIcons.get(icon);
        this.getLoadedDescriptorKeysForIconState(icon, iconAttrs).forEach(key => loadedDescriptorKeys.add(key));
      });
      this.loadedIcons = loadedDescriptorKeys;
      this.iconSubsetPending = false;
      this.iconSubsetReady = true;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));

      if (prev) {
        prev.remove();
      }

      window.dispatchEvent(new CustomEvent("sf-icons-subset:ready", {
        detail: {
          icons: new Set(icons),
          weights,
          loader: this,
          fromCache: !!options.fromCache
        }
      }));
      this.syncStaticIconLoadedState();
    }).catch(error => {
      this.iconSubsetPending = false;
      this.iconSubsetReady = false;
      this.setIconManifestForType(type, null);
      style.remove();
      safeRemoveItem?.(this.getIconManifestStorageKey(type));
      console.warn("SFLoader cached icon manifest failed", error);
      this.applyIconFontFallback({
        icons,
        type: this.getIconManifestType(manifest),
        reason: error
      });

      if (!options.fromCache) {
        void this.loadFonts();
      }
    }).finally(() => {
      const needsReload = this.iconSubsetNeedsReload;
      this.iconSubsetNeedsReload = false;
      this.iconSubsetPromise = null;

      if (needsReload) {
        void this.loadFonts();
      }
    });
    return true;
  };

  SFLoaderPlugin.prototype.verifyIconManifestFonts = async function (manifest = {}, options = {}) {
    if (!this.isIconSubsetEnabled()) {
      return false;
    }

    const icons = options.icons || (Array.isArray(manifest.icons) ? manifest.icons : []);
    const fonts = Array.isArray(manifest.fonts) ? manifest.fonts : [];

    if (!icons.length || !fonts.length) {
      throw new Error("Icon manifest has no icons or fonts");
    }

    if (!document.fonts?.load) {
      return true;
    }

    const family = this.getIconManifestFontFamily(manifest);
    const sampleText = icons.join(" ");
    await new Promise(resolve => requestAnimationFrame(resolve));
    const results = await Promise.all(fonts.map(font => {
      const weight = normalizeIconFontLoadWeight(font.weight || manifest.axes?.wght?.value || defaultIconWeight);
      return document.fonts.load(`${weight} 16px "${family}"`, sampleText);
    }));
    const loadedCount = results.reduce((sum, fontFaces) => sum + fontFaces.length, 0);

    if (!loadedCount) {
      throw new Error("Icon manifest fonts were not loaded");
    }

    if (document.fonts.ready) {
      await document.fonts.ready;
    }

    return true;
  };

  SFLoaderPlugin.prototype.extractIconFontFacesFromCss = function (cssText = "") {
    const fontFaces = [];
    const blocks = String(cssText || "").match(/@font-face\s*{[^}]*}/gim) || [];
    blocks.forEach(block => {
      const familyMatch = block.match(/font-family\s*:\s*['"]?([^;'"}]+)['"]?/i);
      const weightMatch = block.match(/font-weight\s*:\s*([^;]+)/i);
      const family = familyMatch?.[1]?.trim();

      if (!family) {
        return;
      }

      fontFaces.push({
        family,
        weight: weightMatch?.[1]?.trim() || defaultIconWeight
      });
    });
    return fontFaces;
  };

  SFLoaderPlugin.prototype.extractIconFontFaceCss = function (cssText = "") {
    return (String(cssText || "").match(/@font-face\s*{[^}]*}/gim) || []).join("\n");
  };

  SFLoaderPlugin.prototype.verifyIconCssFonts = async function (cssText = "", options = {}) {
    if (!this.isIconSubsetEnabled()) {
      return false;
    }

    if (!document.fonts?.load) {
      return true;
    }

    const icons = options.icons || [];
    const sampleText = Array.isArray(icons) ? icons.join(" ") : String(icons || "");
    const fontFaces = this.extractIconFontFacesFromCss(cssText);

    if (!fontFaces.length || !sampleText) {
      return true;
    }

    await new Promise(resolve => requestAnimationFrame(resolve));
    const results = await Promise.all(fontFaces.map(({
      family,
      weight
    }) => document.fonts.load(`${normalizeIconFontLoadWeight(weight)} 16px "${family}"`, sampleText)));
    const loadedCount = results.reduce((sum, fontFaceList) => sum + fontFaceList.length, 0);

    if (!loadedCount) {
      throw new Error("Icon subset CSS fonts were not loaded");
    }

    if (document.fonts.ready) {
      await document.fonts.ready;
    }

    return true;
  };

  SFLoaderPlugin.prototype.restoreIconManifestFromCache = function () {
    if (!this.isIconSubsetEnabled()) return false;
    const currentDefaultType = this.getIconSubsetRequestConfig().defaultType;
    const manifest = this.getStoredIconManifest(currentDefaultType);
    if (!manifest) return false;
    const manifestType = this.getIconManifestType(manifest);

    if (manifestType !== currentDefaultType || !this.isManifestCoveredByConfiguredSubset(manifest)) {
      safeRemoveItem?.(this.getIconManifestStorageKey(currentDefaultType));
      this.setIconManifestForType(currentDefaultType, null);
      return false;
    }

    return this.applyIconManifest(manifest, {
      fromCache: true
    });
  };

  SFLoaderPlugin.prototype.getIconSubsetRequestConfig = function () {
    const accumulate = window.SF_BOOT_CONFIG?.icons?.accumulate === true;

    if (!this.isIconSubsetEnabled()) {
      return {
        icons: [],
        weights: new Set(),
        fill: false,
        types: new Set(),
        defaultType: this.getDefaultIconType(),
        accumulate
      };
    }

    const configured = this.getConfiguredIconSubsetConfig();

    if (configured) {
      this.ensureConfiguredIconSubsetState();
      return {
        icons: configured.icons,
        weights: configured.weights,
        fill: configured.fill,
        grade: configured.grade,
        types: configured.types,
        defaultType: configured.defaultType,
        accumulate
      };
    }

    const icons = [...this.uniqueIcons.keys()];
    const weights = new Set();
    const types = new Set();
    let fill = false;
    const grades = new Set();
    const defaultType = this.getDefaultIconType();
    this.uniqueIcons.forEach(attrs => {
      const weight = attrs.get("weight");
      const filled = attrs.get("filled");
      const grade = attrs.get("grade");
      const type = attrs.get("type");

      if (filled) {
        fill = true;
      }

      if (type) {
        const normalizedTypes = type instanceof Set || Array.isArray(type) ? type : [type];
        normalizedTypes.forEach(item => {
          const normalizedType = this.normalizeIconType(item);

          if (normalizedType !== defaultType) {
            types.add(normalizedType);
          }
        });
      }

      if (!weight) {
        if (grade instanceof Set || Array.isArray(grade)) {
          grade.forEach(item => grades.add(String(item)));
        } else if (grade) {
          grades.add(String(grade));
        }

        return;
      }

      if (weight instanceof Set || Array.isArray(weight)) {
        weight.forEach(item => weights.add(String(item)));
      } else {
        weights.add(String(weight));
      }

      if (grade instanceof Set || Array.isArray(grade)) {
        grade.forEach(item => grades.add(String(item)));
      } else if (grade) {
        grades.add(String(grade));
      }
    });
    return {
      icons,
      weights,
      fill,
      grade: grades.size ? [...grades].join(",") : "",
      types,
      defaultType,
      accumulate
    };
  };

  SFLoaderPlugin.prototype.bootstrapConfiguredIconSubset = function () {
    if (!this.isIconSubsetEnabled()) return false;
    if (!this.hasConfiguredIconSubset()) return false;
    this.ensureConfiguredIconSubsetState();

    if (this.iconSubsetPending || this.iconSubsetReady || this.iconSubsetPromise) {
      return true;
    }

    this.mutate(() => this.loadFonts());
    return true;
  };

  SFLoaderPlugin.prototype.getIconSubsetRequestConfigs = function () {
    const baseConfig = this.getIconSubsetRequestConfig();
    const configs = new Map();

    const getConfig = type => {
      const normalizedType = this.normalizeIconType(type);

      if (!configs.has(normalizedType)) {
        configs.set(normalizedType, {
          accumulate: baseConfig.accumulate,
          defaultType: normalizedType,
          fill: false,
          grade: new Set(),
          icons: new Set(),
          weights: new Set()
        });
      }

      return configs.get(normalizedType);
    };

    this.uniqueIcons.forEach((attrs, icon) => {
      const rawTypes = attrs.get("type");
      const types = rawTypes instanceof Set || Array.isArray(rawTypes) ? [...rawTypes] : [rawTypes || baseConfig.defaultType];
      const rawWeights = attrs.get("weight");
      const weights = rawWeights instanceof Set || Array.isArray(rawWeights) ? [...rawWeights] : rawWeights ? [rawWeights] : [];
      const rawGrades = attrs.get("grade");
      const grades = rawGrades instanceof Set || Array.isArray(rawGrades) ? [...rawGrades] : rawGrades ? [rawGrades] : [];
      types.forEach(type => {
        const config = getConfig(type);
        config.icons.add(icon);
        weights.forEach(weight => config.weights.add(String(weight)));
        grades.forEach(grade => config.grade.add(String(grade)));

        if (attrs.get("filled")) {
          config.fill = true;
        }
      });
    });

    if (!configs.size && baseConfig.icons.length) {
      const types = baseConfig.types?.size ? [...baseConfig.types] : [baseConfig.defaultType];
      types.forEach(type => {
        const config = getConfig(type);
        baseConfig.icons.forEach(icon => config.icons.add(icon));
        baseConfig.weights.forEach(weight => config.weights.add(weight));
        String(baseConfig.grade || "").split(",").filter(Boolean).forEach(grade => config.grade.add(grade));
        config.fill = baseConfig.fill;
      });
    }

    return [...configs.values()].map(config => ({ ...config,
      grade: [...config.grade].sort().join(","),
      icons: [...config.icons].sort()
    })).sort((left, right) => left.defaultType.localeCompare(right.defaultType));
  };

  SFLoaderPlugin.prototype.loadIconSubsetFamily = async function (requestConfig) {
    const {
      defaultType: type,
      icons
    } = requestConfig;
    if (!icons.length) return false;
    const host = this.getIconSubsetHost();
    const query = new URLSearchParams({
      icon_names: icons.join(","),
      type
    });

    if (requestConfig.weights.size) {
      query.set("weight", [...requestConfig.weights].sort().join(","));
    }

    if (requestConfig.fill) query.set("fill", "1");
    if (requestConfig.grade) query.set("grade", requestConfig.grade);
    if (requestConfig.accumulate) query.set("accumulate", "true");
    let manifest = null;
    let appliedStyle = null;

    try {
      const response = await fetch(`${host}/ms/css?${query.toString()}`, {
        cache: "reload"
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      manifest = this.decodeIconManifestHeader(response.headers.get("X-SIMAI-Font-Manifest"));
      const cssText = await response.text();
      const manifestType = manifest ? this.getIconManifestType(manifest) : type;

      if (manifest && manifestType !== type) {
        throw new Error(`Icon subset family mismatch: requested ${type}, received ${manifestType}`);
      }

      const previous = document.querySelector(`style[data-sf-icons-subset-family="${type}"]`);
      const style = document.createElement("style");
      style.setAttribute("data-sf-icons-subset", icons.join(","));
      style.setAttribute("data-sf-icons-subset-family", type);
      style.textContent = cssText;
      document.head.appendChild(style);
      appliedStyle = style;

      if (manifest) {
        safeSetItem?.(this.getIconManifestStorageKey(type), JSON.stringify(manifest));
        this.setIconManifestForType(type, manifest);
        this.markManifestIconsAsLoaded(manifest);

        if (Array.isArray(manifest.fonts) && manifest.fonts.length) {
          await this.verifyIconManifestFonts(manifest, {
            icons
          });
        } else {
          await this.verifyIconCssFonts(cssText, {
            icons
          });
        }
      } else {
        await this.verifyIconCssFonts(cssText, {
          icons
        });
      }

      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));
      previous?.remove?.();
      window.dispatchEvent(new CustomEvent("sf-icons-subset:ready", {
        detail: {
          icons: new Set(icons),
          loader: this,
          type,
          weights: [...requestConfig.weights]
        }
      }));
      return true;
    } catch (error) {
      appliedStyle?.remove?.();
      this.setIconManifestForType(type, null);
      safeRemoveItem?.(this.getIconManifestStorageKey(type));
      return this.applyIconFontFallback({
        icons,
        reason: error,
        type
      });
    }
  };

  SFLoaderPlugin.prototype.loadFonts = async function () {
    if (!this.isIconSubsetEnabled()) {
      return false;
    }

    this.ensureConfiguredIconSubsetState();

    if (this.iconSubsetPending && this.iconSubsetPromise) {
      this.iconSubsetNeedsReload = true;
      return this.iconSubsetPromise;
    }

    const unloadedIcons = Array.from(this.uniqueIcons).filter(([, attrs]) => attrs.get("loading") === false);

    if (!unloadedIcons.length) {
      return this.iconSubsetPromise || false;
    }

    unloadedIcons.forEach(([, attrs]) => attrs.set("loading", true));
    this.iconSubsetPending = true;
    this.iconSubsetReady = false;
    const requestConfigs = this.getIconSubsetRequestConfigs();
    this.iconSubsetPromise = Promise.all(requestConfigs.map(config => this.loadIconSubsetFamily(config))).then(results => {
      const loadedDescriptorKeys = new Set(this.loadedIcons);
      unloadedIcons.forEach(([icon, attrs]) => {
        this.getLoadedDescriptorKeysForIconState(icon, attrs).forEach(key => loadedDescriptorKeys.add(key));
      });
      this.loadedIcons = loadedDescriptorKeys;
      this.iconSubsetPending = false;
      this.iconSubsetReady = results.every(Boolean);
      this.syncStaticIconLoadedState();
      return this.iconSubsetReady;
    }).finally(() => {
      const needsReload = this.iconSubsetNeedsReload;
      this.iconSubsetNeedsReload = false;
      this.iconSubsetPromise = null;
      if (needsReload) void this.loadFonts();
    });
    return this.iconSubsetPromise;
  };
}

/***/ },

/***/ "eb03d104e275"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lz_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f5f39becdb6a");
/* harmony import */ var lz_string__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lz_string__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var blueimp_md5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e36a87dff0c9");
/* harmony import */ var blueimp_md5__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(blueimp_md5__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tailwind_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("3f02a73d71b2");
/* harmony import */ var _iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("09d27e26e137");
/* harmony import */ var _preloader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6c7f357fe960");
/* harmony import */ var lit_static_html_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("ee5035470810");






/* global __SF_CACHE_VERSION__, __SF_PLUGIN_LIST_VERSION__ */

(() => {
  const pending = window.SF_PENDING_COMPONENTS = window.SF_PENDING_COMPONENTS || [];

  window.registerSfComponent = function registerSfComponent(name, cls) {
    if (!name || !cls) return;
    if (window.SF?.ComponentRegistry?.[name]) return;

    if (window.SF?.Loader?.registerComponent) {
      try {
        window.SF.Loader.registerComponent(name, cls);
      } catch (e) {
        console.warn('component:ready dispatch failed', e);
      }
    } else {
      pending.push([name, cls]);
    }
  };

  window.addEventListener('sf-loader-ready', () => {
    if (!window.SF?.Loader?.registerComponent) return;

    while (pending.length) {
      const [n, c] = pending.shift() || [];
      if (!n || !c) continue;
      if (window.SF?.ComponentRegistry?.[n]) continue;

      try {
        window.SF.Loader.registerComponent(n, c);
      } catch (e) {
        console.warn(e);
      }
    }
  });
})();

const sfEvent = new CustomEvent('sf-loader-ready', {
  detail: {
    message: 'Все компоненты успешно загружены!',
    timestamp: Date.now()
  }
});

function firstFilledValue(...values) {
  for (const value of values) {
    if (value === null || typeof value === 'undefined') {
      continue;
    }

    const normalized = String(value).trim();

    if (normalized !== '') {
      return normalized;
    }
  }

  return '';
}

function SFLoaderPlugin(params) {
  if (params.url && params.url.endsWith('/')) {
    params.url = params.url.slice(0, params.url.length - 1);
  }

  if (params.smartUrl && params.smartUrl.endsWith('/')) {
    params.smartUrl = params.smartUrl.slice(0, params.smartUrl.length - 1);
  }

  this.loadPage = false;
  this.turboEnabled = false;
  this.ComponentRegistry = {};
  this.shortCodes = {
    copy: 'clipboard'
  };
  this.componentTemplates = {};
  this.prepareInit = false;
  (0,_iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_3__.initIconSubsetState)(this);
  this.eventSend = false;
  this.uniqueIcons = new Map();
  this.pendingRegex = true;
  this.url = params.url ?? '/simai/asset/simai.framework/sf5.master';
  this.smartUrl = params.smartUrl ?? this.url;
  this.observeElements = [];
  this.module = {};
  this.phpScriptsLoaded = [];
  this.pluginListRelation = [];
  this.lastLoadHash = null;
  this.theme = 'light';
  this.themeEnabled = params.theme !== false;
  this.preloaderWrap = window.SF_BOOT_CONFIG.preloader?.wrap || null;
  this.standAlone = params.standAlone ?? false;
  this.disableSmart = !!params.disableSmart;
  this.smart = { ...(window.SF_BOOT_CONFIG?.smart || {}),
    ...(params.smart || {})
  };
  this.smartBaseReady = null;
  this.smartBaseLoadPromise = null;
  this.sfDir = '/simai/';
  this.utilyPath = `${this.url}/utility`;
  this.smartPath = `${this.smartUrl}/smart`;
  this.componentPath = `${this.url}/component`;
  this.smartCache = null;
  this.resolverAll = {};
  this.mutationObserver = null;
  this.prepareObserver = null;
  this.stopObserver = false;
  this.dragObserverLockCount = 0;
  this.eventsPlugins = [];
  this.urlHash = '';
  this.preloaderRun = window.SF_BOOT_CONFIG.preloader?.preloaderActive || false;
  this.pendingLoadPlugins = new Set();
  this.pendingShortcodeLoads = new Set();
  this.relationPlugins = {};
  this.totalRelationsPlugins = {};
  this.shortcodeReadyCache = new Map();
  this.heavyModules = params.heavyModules || ['monaco'];
  this.priorityModules = params.priorityModules || ['container', 'display', 'flex', 'grid', 'gap', 'column', 'width', 'height', 'aspect-ratio', 'element-position', 'element-position-ext', 'headers', 'theme', 'skeleton'];
  this.preloader = {
    color: (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.getPreloaderColor)(),
    width: _preloader__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PRELOADER.width,
    height: _preloader__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PRELOADER.height
  };
  this.timingStart = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  this.turboEventsBound = false;
  this.smartChildScanEventsBound = false;
  this.totalLoadPlugin = 0;
  this.notFoundFiles = {};
  this.cachedPlugins = [];
  this.loadedPlugins = {};
  this.attrMatchCache = new Map();
  this.regexMatchCache = new Map();
  this.cacheVersion = firstFilledValue(params.cacheVersion, typeof __SF_CACHE_VERSION__ !== 'undefined' ? __SF_CACHE_VERSION__ : null, window.SF_BOOT_CONFIG?.cacheVersion, window.SF_CACHE_VERSION);
  this.pluginListVersion = firstFilledValue(params.pluginListVersion, typeof __SF_PLUGIN_LIST_VERSION__ !== 'undefined' ? __SF_PLUGIN_LIST_VERSION__ : null, window.SF_BOOT_CONFIG?.pluginListVersion, window.SF_PLUGIN_LIST_VERSION);
  this.params = params;
  this.firstLoad = true;
  this.attr = params.attr ? params.attr : 'sf-asset';
  this.turboEventsBound = false;
  this.turboRenderHandled = false;
  this.delimiterURL = params.delimiterURL ? params.delimiterURL : '/';
  this.frameworkPath = params.frameworkPath ? params.frameworkPath : '/simai/asset/simai.framework/sf5.master/utility/';
  this.findPlugins = params.findPlugins ? params.findPlugins : {};
  this.requiredPlugins = params.requiredPlugins ? params.requiredPlugins : [];
  this.isLoadPluginCookie = params.isLoadPluginCookie ? params.isLoadPluginCookie : false;
  this.contentPreloaderText = params.contentPreloaderText ? params.contentPreloaderText : 'LOADING';
  this.arrowInterval = null;
  this.contentPreloader = '';
  this.backgroundPreloader = params.backgroundPreloader ? params.backgroundPreloader : (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.getPreloaderBackground)();
  this.tempLoaderStyles = 'inset: 0;position: fixed;width: 100%;height: 100vh;opacity: 1;z-index: 1000;background-color: var(--sf-color--surface-highest, var(--sf-surface-0, #fff));text-align: center;';
  this.modifierPreloader = params.modifierPreloader ? params.modifierPreloader : 'loader-default';
  this.isDebug = false;
  this.profileLoader = params.profileLoader ?? window.SF_BOOT_CONFIG?.profileLoader ?? this.isDebug;
  this.profileThreshold = params.profileThreshold ?? window.SF_BOOT_CONFIG?.profileThreshold ?? 2;
  this.usePreloader = true;
  this.debugStr = {
    initLoader: 'SFLoaderPlugin: script is run',
    requiredPluginsNotEmpty: 'SFLoaderPlugin: Параметр обязательных плагинов не пустой',
    regexpPlugins: 'SFLoaderPlugin: Список плагинов findPlugins ',
    isExistFileOnreadystatechange: 'SFLoaderPlugin: Проверяем на существование файлов плагина',
    isExistFilestatus200: 'SFLoaderPlugin: Статус 200',
    isExistFilestatusNo200: 'SFLoaderPlugin: Статус не 200',
    isExistFileReadyStateNo4: 'SFLoaderPlugin: Ready State no 4',
    searchRegexpRun: 'SFLoaderPlugin: searchRegexp is run'
  };
  this.plugin = {};
  this.searchEnd = false;

  if (this.smart.base === true) {
    this.smartBaseReady = this.loadSmartBase().finally(() => {
      this.init();
    });
  } else {
    this.smartBaseReady = Promise.resolve(window.SF?.smart || null);
    this.init();
  }
}

SFLoaderPlugin.prototype.debug = function (str) {
  if (this.isDebug) {
    console.log(str);
  }
};

SFLoaderPlugin.prototype.logTiming = function (label) {
  if (!this.isDebug) return;
  const now = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  console.log(`SFLoader timing ${label}: ${(now - this.timingStart).toFixed(1)}ms`);
};

SFLoaderPlugin.prototype.now = function () {
  return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
};

SFLoaderPlugin.prototype.profileStart = function (label) {
  if (!this.profileLoader) return null;
  return {
    label,
    start: this.now()
  };
};

SFLoaderPlugin.prototype.profileEnd = function (profile, detail = {}) {
  if (!profile || !this.profileLoader) return;
  const duration = this.now() - profile.start;
  if (duration < this.profileThreshold) return;
  const roundedDuration = Number(duration.toFixed(2));
  console.log(`SFLoader profile ${profile.label}: ${roundedDuration}ms`, {
    duration: roundedDuration,
    ...detail
  });
};

SFLoaderPlugin.prototype.loadSmartBase = function () {
  if (window.SF?.smart?.SfBaseElement) {
    return Promise.resolve(window.SF.smart);
  }

  if (this.smartBaseLoadPromise) {
    return this.smartBaseLoadPromise;
  }

  this.smartBaseLoadPromise = Promise.all(/* import() | smart-base */[__webpack_require__.e(33924592978152), __webpack_require__.e(51805064141692)]).then(__webpack_require__.bind(__webpack_require__, "7aae0f825ba6")).then(() => {
    try {
      window.dispatchEvent(new CustomEvent('sf-smart-base-ready', {
        detail: {
          smart: window.SF?.smart || null,
          loader: this,
          timestamp: Date.now()
        }
      }));
    } catch (e) {
      console.warn('sf-smart-base-ready dispatch failed', e);
    }

    return window.SF?.smart || null;
  }).catch(error => {
    console.warn('smart base load failed', error);
    return null;
  });
  this.smartBaseReady = this.smartBaseLoadPromise;
  return this.smartBaseLoadPromise;
};
/**
 * Получает значение GET-параметра
 * @param {*} param GET-параметр
 * @returns string
 */


SFLoaderPlugin.prototype.getUrlParam = function (param = false) {
  if (param) {
    const getParam = new URL(window.location.href);
    return getParam.searchParams.get(param);
  } else {
    return '';
  }
};

function parseParams(str) {
  const result = {};
  const re = /([a-zA-Z0-9_]+)\s*=\s*(?:(?:'([^']*)')|(?:"([^"]*)")|(?:\[([^\]]*)\])|(\S+))/g;
  let match;

  while ((match = re.exec(str)) !== null) {
    const key = match[1];
    let val;

    if (match[2] !== undefined) {
      val = match[2];
    } else if (match[3] !== undefined) {
      val = match[3];
    } else if (match[4] !== undefined) {
      val = match[4].split(',').map(s => s.trim());
    } else if (match[5] !== undefined) {
      val = match[5];
    }

    result[key] = val;
  }

  return result;
}

SFLoaderPlugin.prototype.findShortCodes = function (node) {
  const regex = /\[!([a-zA-Z0-9_-]+)(?:\s+([^\](]+?))?](?:\(([^)]*)\))?(?:#([a-zA-Z0-9_-]+))?/g;
  const host = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement || null;

  if (this.shouldSkipNode(host)) {
    return;
  } // Разбираем и TEXT, и COMMENT плейсхолдеры, чтобы поддержать boot-скрытие.


  if (node.nodeType === Node.ELEMENT_NODE) {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.COMMENT_NODE) {
        this.findShortCodes(child);
      } else if (child.nodeType === Node.ELEMENT_NODE && !this.shouldSkipNode(child)) {
        this.findShortCodes(child);
      }
    });
    return;
  }

  const isComment = node.nodeType === Node.COMMENT_NODE && node.nodeValue?.startsWith('sf-shortcode ');
  const isText = node.nodeType === Node.TEXT_NODE;
  if (!isText && !isComment) return;
  const textContent = isComment ? node.nodeValue.slice('sf-shortcode '.length) : node.textContent;
  if (!textContent) return;
  const matches = [...textContent.matchAll(regex)];
  if (matches.length === 0) return;
  const profile = this.profileStart('findShortCodes');
  const segments = [];
  let lastIndex = 0;
  matches.forEach(match => {
    const raw = match[0];
    const start = match.index !== undefined ? match.index : textContent.indexOf(raw, lastIndex);
    const end = start + raw.length;

    if (start > lastIndex) {
      segments.push({
        type: 'text',
        text: textContent.slice(lastIndex, start)
      });
    }

    const [, name, attrs, param, id] = match;
    segments.push({
      type: 'shortcode',
      data: {
        name,
        attrs: generateTemplateParamsFromString(attrs),
        param: parseParams(param),
        id,
        raw
      }
    });
    lastIndex = end;
  });

  if (lastIndex < node.textContent.length) {
    segments.push({
      type: 'text',
      text: textContent.slice(lastIndex)
    });
  } // Hide raw shortcode text immediately to avoid flicker before processing


  if (isComment) {
    node.nodeValue = '';
  } else {
    node.textContent = '';
  }

  const shortcodeSegments = segments.filter(seg => seg.type === 'shortcode');

  const schedule = window.requestIdleCallback || function (cb) {
    return requestAnimationFrame(() => cb());
  };

  const processShortcodes = () => {
    const newlyAddedModules = new Set();
    const interimNodes = segments.map(seg => {
      if (seg.type === 'text') {
        return document.createTextNode(seg.text);
      }

      const placeholder = document.createComment('sf-shortcode');
      seg.placeholder = placeholder;
      return placeholder;
    });

    const replacePlaceholders = () => node.replaceWith(...interimNodes);

    const canReplaceSync = shortcodeSegments.length <= 10;

    if (canReplaceSync) {
      replacePlaceholders();
    } else {
      this.mutate(() => replacePlaceholders());
    }

    const promises = shortcodeSegments.map(seg => {
      const entry = seg.data;
      const originItem = this.shortCodes[entry.name.toLowerCase()] || entry.name.toLowerCase();
      const rule = SF.RuleLoader[originItem];

      if (rule && !this.module[originItem]) {
        this.setExistCookie(originItem);
        newlyAddedModules.add(originItem);
      } else if (!rule) {
        return Promise.resolve(null);
      }

      const targetName = originItem || entry.name;
      const cacheKey = originItem || entry.name || targetName;
      const names = Array.from(new Set([targetName, originItem, entry.name].filter(Boolean))); // Fast path: если класс уже зарегистрирован — рендерим сразу

      const LoadedClass = names.map(n => this.ComponentRegistry?.[n]).find(cls => cls) || null;

      if (LoadedClass) {
        try {
          const comp = new LoadedClass({
            id: entry.id,
            param: entry.param,
            attrs: entry.attrs
          });
          return Promise.resolve(comp.render());
        } catch (e) {
          console.warn('shortcode render failed', originItem, e);
          return Promise.resolve(null);
        }
      }

      if (!this.shortcodeReadyCache.has(cacheKey)) {
        const readyPromise = new Promise(resolve => {
          try {
            let resolved = false;

            const resolveOnce = ResolvedClass => {
              if (resolved || !ResolvedClass) return;
              resolved = true;
              resolve(ResolvedClass);
            };

            if (newlyAddedModules.size && !this.pendingRegex) {
              this.getLoader(this.module, true);
            }

            names.forEach(name => this.ready(name, resolveOnce));
            setTimeout(() => {
              if (!resolved) {
                if (this.isDebug) {
                  console.warn('SFLoader shortcode resolution timeout', {
                    targetName,
                    names,
                    entry
                  });
                }

                resolve(null);
              }
            }, 8000);
          } catch (e) {
            console.warn(e);
            resolve(null);
          }
        });
        this.shortcodeReadyCache.set(cacheKey, readyPromise);
      }

      return this.shortcodeReadyCache.get(cacheKey).then(ResolvedClass => {
        if (!ResolvedClass) return null;
        const comp = new ResolvedClass({
          id: entry.id,
          param: entry.param,
          attrs: entry.attrs
        });
        return comp.render();
      });
    }); // Запускаем загрузку новых модулей один раз на батч, если не в pending.

    const toLoad = Array.from(newlyAddedModules).filter(name => !this.pendingLoadPlugins.has(name));

    if (toLoad.length && !this.pendingRegex) {
      toLoad.forEach(name => this.pendingShortcodeLoads.add(name));
      this.getLoader(this.module, true);
    }

    Promise.allSettled(promises).then(results => {
      if (this.isDebug) {
        console.log('SFLoader.shortcodes results', results);
      }

      if (toLoad.length) {
        toLoad.forEach(name => this.pendingShortcodeLoads.delete(name));
      }

      let idx = 0;
      results.forEach(res => {
        if (res.status === 'fulfilled') {
          shortcodeSegments[idx].nodes = normalizeToNodes(res.value);
        } else {
          shortcodeSegments[idx].nodes = [];
        }

        idx++;
      });
      this.mutate(() => {
        shortcodeSegments.forEach(seg => {
          const target = seg.placeholder;
          if (!target || !target.parentNode) return;

          if (seg.nodes && seg.nodes.length) {
            target.replaceWith(...seg.nodes);
          } else {
            target.remove();
          }
        });
      });
    });
  };

  if (shortcodeSegments.length <= 10) {
    processShortcodes();
  } else {
    schedule(processShortcodes);
  }

  this.profileEnd(profile, {
    shortcodes: shortcodeSegments.length,
    textLength: textContent.length,
    nodeType: isComment ? 'comment' : 'text'
  });
};

function generateTemplateParamsFromString(string) {
  if (!string || !string.length) return null;
  const splitString = string.split(' ');
  const paramObj = {};
  splitString.forEach(el => {
    if (el.match('=')) {
      const [name, value] = el.split('=');
      paramObj[name] = value;
    } else {
      paramObj[el] = true;
    }
  });
  return paramObj;
}

function normalizeToNodes(value) {
  if (value == null) return [];
  if (value instanceof Node) return [value];
  if (value instanceof DocumentFragment) return Array.from(value.childNodes);

  if (Array.isArray(value)) {
    return value.reduce((acc, item) => acc.concat(normalizeToNodes(item)), []);
  }

  if (typeof value === 'string') {
    const template = document.createElement('template');
    template.innerHTML = value;
    return Array.from(template.content.childNodes);
  }

  return [];
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('localStorage setItem failed', key, e);
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('localStorage removeItem failed', key, e);
  }
}

(0,_iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_3__.installIconSubsetRuntime)(SFLoaderPlugin, {
  safeSetItem,
  safeRemoveItem
});

SFLoaderPlugin.prototype.setModule = function (module = false) {
  if (module) {
    this.module[module] = module;
  }
};
/**
 * Преобразовать список модулей из объекта в массив
 * @returns array
 */


SFLoaderPlugin.prototype.getModuleArray = function () {
  const module = [];

  if (this.module) {
    for (const mod in this.module) {
      module.push(mod);
    }
  }

  return module;
};

SFLoaderPlugin.prototype.getObjectArray = function (obj) {
  const module = [];

  if (obj) {
    for (const mod in obj) {
      module.push(mod);
    }
  }

  return module;
};

SFLoaderPlugin.prototype.runPreloader = function () {
  if (!this.usePreloader) {
    return false;
  }

  const existingWrap = document.querySelector('.sf-loader');
  const existingInner = existingWrap && existingWrap.querySelector('.sf-loader-block') && existingWrap.querySelector('.sf-loader-block');

  if (existingWrap && existingInner) {
    this.debug('SFLoaderPlugin: reuse boot preloader');
    this.preloaderWrap = existingInner;
    this.preloaderRun = true;
    existingWrap.setAttribute('data-sf-observer', 'ignore');
    existingWrap.classList.remove('hidden');
    existingWrap.style.opacity = '1';

    if (!existingInner.classList.contains('sf-loader-boot')) {
      this.rotatePreloader();
    }

    return true;
  }

  this.debug('SFLoaderPlugin: preloader is run');
  const contentPreloader = this.contentPreloader;
  this.debug('SFLoaderPlugin: sf-loader is null');
  const sfLoaderDiv = document.createElement('div');
  const sfLoaderInnerDiv = document.createElement('div');
  sfLoaderDiv.classList.add('sf-loader', this.modifierPreloader);
  sfLoaderDiv.setAttribute('data-sf-observer', 'ignore');
  sfLoaderDiv.setAttribute('style', this.tempLoaderStyles);

  if (this.backgroundPreloader !== '') {
    sfLoaderDiv.style.background = this.backgroundPreloader;
  }

  sfLoaderInnerDiv.classList.add('sf-loader-block');
  document.documentElement.style.setProperty('--rotation-angle', '0deg');
  sfLoaderInnerDiv.setAttribute('style', 'display:flex; width: 100%;height: 100%;align-items: center;justify-content: center; transition: .2s all ease-in-out;');
  sfLoaderInnerDiv.innerHTML = contentPreloader;
  sfLoaderDiv.append(sfLoaderInnerDiv);
  document.body.append(sfLoaderDiv);
  this.preloaderWrap = sfLoaderInnerDiv;
  this.rotatePreloader();
  this.preloaderRun = true;
};

SFLoaderPlugin.prototype.rotatePreloader = function () {
  (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.startPreloaderMotion)(this.preloaderWrap, () => this.preloaderRun, this.preloader);
};

SFLoaderPlugin.prototype.stopAnimation = function () {
  clearInterval(this.arrowInterval);
  if (!this.preloaderWrap) return;
  (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.stopPreloaderMotion)(this.preloaderWrap);
};

SFLoaderPlugin.prototype.stopPreloader = function () {
  const hasPreloader = !!document.querySelector('.sf-loader');
  if (!hasPreloader && !this.preloaderRun) return;
  document.body.style.opacity = '1';
  this.preloaderRun = false;

  if (window.SF_BOOT_CONFIG?.preloader) {
    window.SF_BOOT_CONFIG.preloader.preloaderActive = false;
  }

  this.debug('SFLoaderPlugin: Stop preloader');
  this.stopAnimation();
  const sfLoader = document.querySelectorAll('.sf-loader');
  sfLoader.forEach(item => {
    item.classList.add('hidden');
  });
};

SFLoaderPlugin.prototype.dispatchReadyOnce = function () {
  if (this.eventSend) {
    return false;
  }

  try {
    window.dispatchEvent(sfEvent);
    this.eventSend = true;
    return true;
  } catch (e) {
    console.warn('sf-loader-ready dispatch failed', e);
    return false;
  }
};

SFLoaderPlugin.prototype.getAssets = function (existLoadPlugins) {
  this.plugins = document.querySelectorAll('[sf-asset]');
  const PluginList = [];

  if (this.plugins.length > 0) {
    this.plugins.forEach(plugin => {
      const pluginURL = plugin.getAttribute('sf-asset');

      if (existLoadPlugins) {
        this.debug('SFLoaderPlugin: searchAttr is run!'); // this.load(pluginURL, pluginName);
      } // this.setCookie('SF_LOADER', pluginURL, 10)


      this.setModule(pluginURL);
      PluginList.push(pluginURL);
    });
    return PluginList;
  }
};

SFLoaderPlugin.prototype.searchAttr = function () {
  this.plugins = document.querySelectorAll('[sf-asset]');
  this.debug(`this.plugins.length: ${this.plugins.length}`);

  if (this.plugins.length > 0) {
    this.plugins.forEach(plugin => {
      const pluginURL = plugin.getAttribute('sf-asset');
      this.setModule(pluginURL);
    });
  }
};

SFLoaderPlugin.prototype.getPluginName = function (pluginURL) {
  if (typeof pluginURL === 'string') {
    if (pluginURL.split(this.delimiterURL).pop() !== '') {
      return pluginURL.split(this.delimiterURL).pop();
    } else {
      const arrPluginLink = pluginURL.split(this.delimiterURL);
      return arrPluginLink[arrPluginLink.length - 2];
    }
  } else {
    return false;
  }
};

SFLoaderPlugin.prototype.setCookie = function (name, value, expiredays = 30) {
  const exdate = new Date();
  exdate.setTime(exdate.getTime() + expiredays * 86400 * 1000);
  document.cookie = name + '=' + encodeURIComponent(value) + (expiredays == null ? '' : '; expires=' + exdate.toUTCString()) + '; path=/';
};

SFLoaderPlugin.prototype.getCookie = function (name) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=');

    if (start !== -1) {
      start = start + name.length + 1;
      let end = document.cookie.indexOf(';', start);

      if (end === -1) {
        end = document.cookie.length;
      }

      return encodeURI(document.cookie.substring(start, end));
    }
  }

  return '';
}; // TODO Удалить если не используется


SFLoaderPlugin.prototype.checkCookie = function (name) {
  // name = this.getCookie(name)
  name = this.module[name];

  if (name != null && name !== '') {
    return true;
  } else {
    return false;
  }
};

SFLoaderPlugin.prototype.getApartCookie = function (name) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=');

    if (start !== -1) {
      start = start + name.length + 1;
      let end = document.cookie.indexOf(';', start);
      if (end === -1) end = document.cookie.length;
      return encodeURI(document.cookie.substring(start, end)).split(',');
    }
  }

  return [];
};

SFLoaderPlugin.prototype.isExistPluginCookie = function (plugin) {
  const arrPluginsCookie = this.getApartCookie('SF_LOADER');

  if (arrPluginsCookie.length > 0) {
    for (let i = 0; i < arrPluginsCookie.length; i++) {
      if (arrPluginsCookie[i] === plugin) {
        return true;
      }
    }
  }

  return false;
};

SFLoaderPlugin.prototype.getFakeTemplates = async function () {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/simai/loader/templateLoader.php', true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');
  const body = JSON.stringify({
    getFake: true
  });
  let isNo200;

  try {
    xhr.send(body);

    xhr.onreadystatechange = function () {
      if (xhr.status === 200) {
        if (this.readyState !== 4) {
          return false;
        }
      }
    };
  } catch (e) {
    console.warn(e);
    return isNo200;
  }

  return isNo200;
};

SFLoaderPlugin.prototype.checkEventsPlugins = function (name) {
  if (this.eventsPlugins.indexOf(name) === -1) {
    this.eventsPlugins.push(name);
  }
};

SFLoaderPlugin.prototype.checkFake = async function () {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/simai/loader/templateLoader.php', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    const url = window.location.pathname;
    const body = JSON.stringify({
      checkFake: true,
      url
    });
    let isNo200;

    try {
      xhr.send(body);

      xhr.onreadystatechange = function () {
        if (xhr.status === 200) {
          if (this.readyState !== 4) return false;
          resolve(JSON.parse(xhr.response));
        }
      };
    } catch (e) {
      console.warn(e);
      return isNo200;
    }
  });
};

SFLoaderPlugin.prototype.setLocalStorage = function (templates, fake) {
  const data = JSON.stringify({
    templates,
    cache: fake
  });
  safeSetItem(`SF_SMART_LIST-${this.urlHash}`, (0,lz_string__WEBPACK_IMPORTED_MODULE_0__.compressToUTF16)(data));
};

SFLoaderPlugin.prototype.setCacheContent = async function (templates, fake) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/simai/loader/templateLoader.php', true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');
  const pathname = window.location.pathname;
  const body = JSON.stringify({
    setCacheContent: true,
    url: pathname,
    templates,
    cache: fake
  });
  let isNo200;

  try {
    xhr.send(body);

    xhr.onreadystatechange = function () {
      if (xhr.status === 200) {
        if (this.readyState !== 4) {
          return false;
        }
      }
    };
  } catch (e) {
    console.warn(e);
    return isNo200;
  }

  return isNo200;
};

SFLoaderPlugin.prototype.isLoaded = function (pluginURL, type) {
  if (type === 'style') {
    if (document.querySelector(`link[href*="${pluginURL}"]`) !== null) {
      return true;
    }
  } else {
    if (document.querySelector(`script[src*="${pluginURL}"]`) !== null) {
      return true;
    }
  }

  return false;
};
/**
 * Проверка и подключение CSS-стилей
 * @param {String} css - путь до подлючаемого файла
 * @param {String} min - путь до подключаемого файла (минимизированный)
 */
// SFLoaderPlugin.prototype.checkLoadStyle = function (css, min) {
//     if (!this.isLoaded(min, 'style') && !this.isLoaded(css, 'style')) {
//         this.addStyle(min)
//     } else if (!this.isLoaded(css, 'style') && !this.isLoaded(min, 'style')) {
//         this.addStyle(css)
//     }
// }

/**
 * Проверка и подключение JS-скриптов
 * @param {String} js - путь до подключаемого файла
 * @param {String} min - путь до подключаемого файла (минимизированный)
 */
// SFLoaderPlugin.prototype.checkLoadJS = function (js, min) {
//     if (!this.isLoaded(min, 'script') && !this.isLoaded(js, 'script')) {
//         this.addScript(min)
//     } else if (!this.isLoaded(min, 'script') && !this.isLoaded(js, 'script')) {
//         this.addScript(js)
//     }
// }

/**
 * Подключение скриптов и стилей
 * @param {String} pluginURL - относительный путь до файла
 * @param {String} pluginName - наименование файла
 * @param {Object} param - параметры
 * @param {String} mode - наименование подключаемого ресурса
 * @returns
 */
// SFLoaderPlugin.prototype.load = function (pluginURL, pluginName, param = false, mode = 'utility') {
//     const urlCss = `${this.frameworkPath}${mode}/${pluginURL}/css/${pluginName}.css`
//     const urlMinCss = `${this.frameworkPath}${mode}/${pluginURL}/css/${pluginName}.min.css`
//     const urlJs = `${this.frameworkPath}${mode}/${pluginURL}/js/${pluginName}.js`
//     const urlMinJs = `${this.frameworkPath}${mode}/${pluginURL}/js/${pluginName}.min.js`
//     if (param.css || param.js) {
//         if (param.css) {
//             this.checkLoadStyle(urlCss, urlMinCss)
//         }
//         if (param.js) {
//             this.checkLoadJS(urlJs, urlMinJs)
//         }
//     } else {
//         this.checkLoadStyle(urlCss, urlMinCss)
//     }
//     return false
// }

/**
 * Поиск
 */


SFLoaderPlugin.prototype.excludedTags = function (tag) {
  return ['script', 'style', 'yamap', 'svg', 'path', 'g', 'head', 'meta', 'link'].indexOf(tag) === -1;
};

const OBSERVER_IGNORE_SELECTOR = '[data-sf-observer="ignore"]';

SFLoaderPlugin.prototype.createFilteredElementWalker = function (host) {
  return document.createTreeWalker(host, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => this.shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  });
};

SFLoaderPlugin.prototype.shouldSkipNode = function (node) {
  if (!node) return true;
  const host = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement || null;
  if (!host || !host.tagName) return true;

  if (node.nodeType === Node.COMMENT_NODE && node.nodeValue?.startsWith('sf-shortcode ')) {
    return false;
  }

  if (host.closest?.(OBSERVER_IGNORE_SELECTOR)) return true;
  const tag = host.tagName.toLowerCase();
  if (!this.excludedTags(tag)) return true;

  if (host.closest && host.closest('.monaco-editor') && !host.closest('[data-allow-shortcodes]')) {
    return true;
  }

  return false;
};

SFLoaderPlugin.prototype.getRuleRegexSource = function (rule) {
  if (!rule) return '';
  const regex = rule.regex ? rule.regex : rule;
  if (regex instanceof RegExp) return regex.source;
  if (typeof regex === 'string') return regex;
  return '';
};

SFLoaderPlugin.prototype.extractRuleAttributeTargets = function (rule) {
  const source = this.getRuleRegexSource(rule);
  const attrs = new Set();
  const prefixes = new Set();

  if (!source) {
    return {
      attrs,
      prefixes
    };
  }

  if (rule instanceof RegExp || typeof rule === 'string' || /class|\\b|\\s|\(\?:\^\|\\s\)|sf-|[a-z0-9_-]+:/i.test(source)) {
    attrs.add('class');
  }

  const dataMatches = source.match(/data-[a-z0-9_]+(?:-[a-z0-9_]+)*/gi) || [];
  dataMatches.forEach(attr => {
    const normalized = attr.toLowerCase();
    attrs.add(normalized);

    if (source.includes(`${attr}-`)) {
      prefixes.add(`${normalized}-`);
    }
  });
  ['id', 'href', 'src', 'type', 'name', 'role', 'for'].forEach(attr => {
    if (new RegExp(`(^|[^a-z0-9_-])${attr}([^a-z0-9_-]|$)`, 'i').test(source)) {
      attrs.add(attr);
    }
  });
  return {
    attrs,
    prefixes
  };
};

SFLoaderPlugin.prototype.extractRuleClassHints = function (rule) {
  const source = this.getRuleRegexSource(rule).replace(/\\b/g, ' ').replace(/\\:/g, ':').replace(/\\-/g, '-');

  if (!source) {
    return [];
  }

  const hints = new Set();
  const alternationPrefixMatches = source.matchAll(/([a-z0-9]+:)?\(\?:([a-z0-9_|:-]+)\)-/gi);

  for (const match of alternationPrefixMatches) {
    const variantPrefix = (match[1] || '').toLowerCase();
    const variants = String(match[2] || '').split('|').map(item => item.trim().toLowerCase()).filter(Boolean);
    variants.forEach(variant => {
      hints.add(`${variantPrefix}${variant}-`);
    });
  }

  const literalMatches = source.match(/[a-z][a-z0-9_:-]{2,}/gi) || [];
  literalMatches.forEach(match => {
    const hint = match.toLowerCase();

    if (['class', 'data', 'regex', 'true', 'false', 'component', 'default'].includes(hint)) {
      return;
    }

    hints.add(hint);
  });
  const prefixMatches = source.match(/[a-z0-9]+(?::)?-/gi) || [];
  prefixMatches.forEach(match => hints.add(match.toLowerCase()));
  return [...hints].filter(hint => hint.length > 1);
};

SFLoaderPlugin.prototype.doesClassRuleMatchHints = function (indexedRule, className = '') {
  const hints = indexedRule.classHints || [];
  if (!hints.length) return true;
  const normalizedClassName = ` ${String(className).toLowerCase()} `;
  const tokens = String(className).toLowerCase().split(/\s+/).filter(Boolean);
  return hints.some(hint => {
    if (hint.endsWith('-') || hint.endsWith(':')) {
      return tokens.some(token => token.startsWith(hint));
    }

    return normalizedClassName.includes(` ${hint} `) || tokens.some(token => token.startsWith(`${hint}-`));
  });
};

SFLoaderPlugin.prototype.shouldUseClassFallbackRule = function (rule) {
  const source = this.getRuleRegexSource(rule);
  if (!source) return false;
  return /\\b|\\s|\(\?:|\||\[[^\]]|\^|\$|\(\?=|\(\?!/.test(source);
};

SFLoaderPlugin.prototype.getAttributeRuleIndex = function () {
  if (this.attributeRuleIndex) {
    return this.attributeRuleIndex;
  }

  const byAttr = new Map();
  const byClassHint = new Map();
  const classPrefixRules = [];
  const classFallback = [];
  const prefixRules = [];
  const fallback = [];
  Object.entries(this.findPlugins || {}).forEach(([key, rule]) => {
    const hasRegex = rule instanceof RegExp || typeof rule === 'string' || rule && typeof rule === 'object' && rule.regex;
    if (!hasRegex || this.module[key]) return;
    const indexedRule = {
      key,
      rule,
      classHints: this.extractRuleClassHints(rule)
    };
    const {
      attrs,
      prefixes
    } = this.extractRuleAttributeTargets(rule);
    const useClassFallback = attrs.has('class') && this.shouldUseClassFallbackRule(rule);

    if (!attrs.size && !prefixes.size) {
      fallback.push(indexedRule);
      return;
    }

    attrs.forEach(attr => {
      if (!byAttr.has(attr)) {
        byAttr.set(attr, []);
      }

      byAttr.get(attr).push(indexedRule);

      if (attr === 'class') {
        if (useClassFallback) {
          classFallback.push(indexedRule);
          return;
        }

        indexedRule.classHints.forEach(hint => {
          if (hint.endsWith('-') || hint.endsWith(':')) {
            classPrefixRules.push({
              prefix: hint,
              indexedRule
            });
            return;
          }

          if (!byClassHint.has(hint)) {
            byClassHint.set(hint, []);
          }

          byClassHint.get(hint).push(indexedRule);
        });
      }
    });
    prefixes.forEach(prefix => {
      prefixRules.push({
        prefix,
        indexedRule
      });
    });
  });
  this.attributeRuleIndex = {
    byAttr,
    byClassHint,
    classPrefixRules,
    classFallback,
    prefixRules,
    fallback
  };
  return this.attributeRuleIndex;
};

SFLoaderPlugin.prototype.clearAttributeRuleIndex = function () {
  this.attributeRuleIndex = null;
};

SFLoaderPlugin.prototype.shouldRuleUseRegexpScan = function (rule) {
  if (!rule) return false;
  if (rule.tags) return false;
  const source = this.getRuleRegexSource(rule);
  if (!source) return false;

  if (/data-[a-z0-9_]+(?:-[a-z0-9_]+)*/i.test(source)) {
    return true;
  }

  if (/</.test(source)) {
    return true;
  }

  return false;
};

SFLoaderPlugin.prototype.getRegexpScanRules = function () {
  if (!this.regexpScanRules) {
    this.regexpScanRules = Object.entries(SF.RuleLoader || {}).filter(([, rule]) => this.shouldRuleUseRegexpScan(rule));
  }

  return this.regexpScanRules.filter(([key]) => !this.module[key]);
};

SFLoaderPlugin.prototype.clearRegexpScanRules = function () {
  this.regexpScanRules = null;
};

SFLoaderPlugin.prototype.hasRelevantRuleAttributes = function (el) {
  if (!el || !el.getAttributeNames) return false;
  const attributeRuleIndex = this.getAttributeRuleIndex();
  const attrs = el.getAttributeNames();

  for (let index = 0; index < attrs.length; index++) {
    const attrName = attrs[index].toLowerCase();

    if (attrName === 'class' && el.getAttribute('class') && (attributeRuleIndex.byClassHint.size || attributeRuleIndex.classPrefixRules.length || attributeRuleIndex.classFallback.length)) {
      return true;
    }

    if (attributeRuleIndex.byAttr.has(attrName)) {
      return true;
    }

    if (attributeRuleIndex.prefixRules.some(({
      prefix
    }) => attrName.startsWith(prefix))) {
      return true;
    }

    if (attributeRuleIndex.fallback.length) {
      return true;
    }
  }

  return false;
};

SFLoaderPlugin.prototype.getAttributes = function (HtmlElement) {
  const profile = this.profileStart('getAttributes');
  const arr = [];
  const keys = [];
  let totalItemCount = 0;
  const isIcon = HtmlElement.classList?.contains('sf-icon');

  if (isIcon && !HtmlElement.closest?.('sf-icon')) {
    this.trackIconComponent(HtmlElement);
  }

  const attributes = HtmlElement.getAttributeNames();

  if (attributes.length) {
    for (const key in attributes) {
      const attrName = attributes[key];
      const value = HtmlElement.getAttribute(attrName);
      let nextValue = value;

      if (attrName === 'class' && value) {
        const converted = (0,_tailwind_map__WEBPACK_IMPORTED_MODULE_2__.convertTailwindClasses)(value);

        if (converted !== value) {
          HtmlElement.setAttribute('class', converted);
          nextValue = converted;
        }
      }

      arr.push(`${attrName}="${nextValue}"`);
    }
  }

  const stringRaw = arr.join(' ');
  const string = stringRaw.length > 2048 ? stringRaw.slice(0, 2048) : stringRaw;
  const result = {
    keys,
    count: totalItemCount
  };

  if (!string) {
    this.attrMatchCache.set(string, result);
    this.profileEnd(profile, {
      cacheHit: false,
      attributeCount: attributes.length,
      candidates: 0,
      found: totalItemCount,
      tagName: HtmlElement.tagName?.toLowerCase?.()
    });
    return result;
  } // cache hit


  if (this.attrMatchCache.has(string)) {
    const cached = this.attrMatchCache.get(string);
    cached.keys.forEach(k => this.setExistCookie(k));
    this.profileEnd(profile, {
      cacheHit: true,
      attributeCount: attributes.length,
      found: cached.count,
      tagName: HtmlElement.tagName?.toLowerCase?.()
    });
    return cached;
  }

  const attributeRuleIndex = this.getAttributeRuleIndex();
  const candidates = new Map();
  const className = HtmlElement.getAttribute('class') || '';
  attributes.forEach(attrName => {
    const normalizedAttrName = attrName.toLowerCase();

    if (normalizedAttrName === 'class') {
      const classTokens = className.toLowerCase().split(/\s+/).filter(Boolean);
      classTokens.forEach(token => {
        const exactRules = attributeRuleIndex.byClassHint.get(token) || [];
        exactRules.forEach(item => candidates.set(item.key, item.rule));
        attributeRuleIndex.classPrefixRules.forEach(({
          prefix,
          indexedRule
        }) => {
          if (token.startsWith(prefix)) {
            candidates.set(indexedRule.key, indexedRule.rule);
          }
        });
      });
      attributeRuleIndex.classFallback.forEach(item => {
        candidates.set(item.key, item.rule);
      });
    } else {
      const attrRules = attributeRuleIndex.byAttr.get(normalizedAttrName) || [];
      attrRules.forEach(item => candidates.set(item.key, item.rule));
    }

    attributeRuleIndex.prefixRules.forEach(({
      prefix,
      indexedRule
    }) => {
      if (normalizedAttrName.startsWith(prefix)) {
        candidates.set(indexedRule.key, indexedRule.rule);
      }
    });
  });
  attributeRuleIndex.fallback.forEach(item => {
    candidates.set(item.key, item.rule);
  });

  for (const [key, rule] of candidates) {
    if (this.module[key]) continue;
    const hasRegex = rule instanceof RegExp || typeof rule === 'string' || rule && typeof rule === 'object' && rule.regex;
    if (!hasRegex) continue;
    const regex = rule.regex ? rule.regex : rule;
    const re = regex instanceof RegExp ? regex : new RegExp(regex, regex.flags || '');
    if (re.global || re.sticky) re.lastIndex = 0;
    const match = re.test(string);

    if (match && !this.module[key]) {
      keys.push(key);
      totalItemCount++;
      this.setExistCookie(key);
    }
  }

  result.count = totalItemCount;
  this.attrMatchCache.set(string, result);
  this.profileEnd(profile, {
    cacheHit: false,
    attributeCount: attributes.length,
    candidates: candidates.size,
    found: totalItemCount,
    tagName: HtmlElement.tagName?.toLowerCase?.()
  });
  return result;
};

SFLoaderPlugin.prototype.getCustomElementRules = function () {
  const tagRules = {};
  Object.entries(this.findPlugins || {}).forEach(([componentName, rule]) => {
    if (!rule || typeof rule !== 'object' || !Array.isArray(rule.tags)) return;
    rule.tags.forEach(tagName => {
      const normalizedTag = String(tagName || '').trim().toLowerCase();
      if (!normalizedTag.startsWith('sf-')) return;
      tagRules[normalizedTag] = componentName;
    });
  });
  return tagRules;
};

SFLoaderPlugin.prototype.getSmartElementRuleName = function (el) {
  const tagName = el?.tagName?.toLowerCase?.() || '';

  if (!tagName.startsWith('sf-')) {
    return '';
  }

  return this.getCustomElementRules()[tagName] || '';
};

SFLoaderPlugin.prototype.findNearestSmartParent = function (el) {
  let parent = el?.parentElement || null;

  while (parent) {
    if (this.getSmartElementRuleName(parent)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
};

SFLoaderPlugin.prototype.shouldDeferNestedSmartElement = function (el) {
  if (!this.getSmartElementRuleName(el)) {
    return false;
  }

  const parentSmart = this.findNearestSmartParent(el);

  if (!parentSmart) {
    return false;
  }

  return parentSmart.__sfSourceCaptured !== true;
};

SFLoaderPlugin.prototype.prepareSmartChildScanEvents = function () {
  if (this.smartChildScanEventsBound) {
    return;
  }

  this.smartChildScanEventsBound = true;
  document.addEventListener('sf-after-render', event => {
    const target = event.target;

    if (!(target instanceof Element) || !this.getSmartElementRuleName(target)) {
      return;
    }

    this.scanCustomElements(target, true);
  });
};

SFLoaderPlugin.prototype.scanCustomElements = function (root = null, autoLoad = true) {
  const profile = this.profileStart('scanCustomElements');
  const host = root || document.body;

  if (!host) {
    this.profileEnd(profile, {
      skipped: true,
      reason: 'empty-host'
    });
    return {
      keys: [],
      count: 0
    };
  }

  if (host.nodeType === Node.ELEMENT_NODE && this.shouldSkipNode(host)) {
    this.profileEnd(profile, {
      skipped: true,
      reason: 'ignored-host'
    });
    return {
      keys: [],
      count: 0
    };
  }

  const tagRules = this.getCustomElementRules();
  const knownTags = Object.keys(tagRules);

  if (!knownTags.length) {
    this.profileEnd(profile, {
      skipped: true,
      reason: 'empty-tag-rules'
    });
    return {
      keys: [],
      count: 0
    };
  }

  const keys = [];
  let totalItemCount = 0;
  let iconItemCount = 0;
  let scannedNodes = 0;

  const processNode = el => {
    if (!el || el.nodeType !== Node.ELEMENT_NODE || this.shouldSkipNode(el)) {
      return;
    }

    scannedNodes++;
    const tagName = el.tagName?.toLowerCase?.();

    if (!tagName || !tagName.startsWith('sf-')) {
      return;
    }

    const componentName = tagRules[tagName];

    if (componentName === 'cl-icons') {
      iconItemCount += this.trackIconElement(el);
    }

    if (!componentName || this.module[componentName] || this.shouldDeferNestedSmartElement(el)) {
      return;
    }

    keys.push(componentName);
    totalItemCount++;
    this.setExistCookie(componentName);
  };

  if (host.nodeType === Node.ELEMENT_NODE) {
    processNode(host);
  }

  const walker = this.createFilteredElementWalker(host);

  while (walker.nextNode()) {
    processNode(walker.currentNode);
  }

  const result = this.handleCustomElementScanResult({
    keys,
    count: totalItemCount,
    iconCount: iconItemCount
  }, autoLoad);
  this.profileEnd(profile, {
    scannedNodes,
    found: totalItemCount,
    icons: iconItemCount,
    autoLoad,
    root: host === document.body ? 'body' : host.tagName?.toLowerCase?.()
  });
  return result;
};

SFLoaderPlugin.prototype.scanAttributes = function (root = null) {
  const profile = this.profileStart('scanAttributes');
  const host = root || document.body;

  if (!host) {
    this.profileEnd(profile, {
      skipped: true,
      reason: 'empty-host'
    });
    return {
      keys: [],
      count: 0
    };
  }

  if (host.nodeType === Node.ELEMENT_NODE && this.shouldSkipNode(host)) {
    this.profileEnd(profile, {
      skipped: true,
      reason: 'ignored-host'
    });
    return {
      keys: [],
      count: 0
    };
  }

  const keys = [];
  let totalItemCount = 0;
  let scannedNodes = 0;
  let skippedNodes = 0;

  const processNode = el => {
    if (this.shouldSkipNode(el)) return;

    if (!this.hasRelevantRuleAttributes(el)) {
      skippedNodes++;
      return;
    }

    scannedNodes++;
    const result = this.getAttributes(el);
    totalItemCount += result.count;
    keys.push(...result.keys);
  };

  if (host.nodeType === Node.ELEMENT_NODE) {
    processNode(host);
  }

  const walker = this.createFilteredElementWalker(host);

  while (walker.nextNode()) {
    processNode(walker.currentNode);
  }

  if (totalItemCount > 0) {
    this.mutate(() => this.getLoader(this.module, true));
  }

  this.profileEnd(profile, {
    scannedNodes,
    skippedNodes,
    found: totalItemCount,
    root: host === document.body ? 'body' : host.tagName?.toLowerCase?.()
  });
  return {
    keys,
    count: totalItemCount
  };
};

SFLoaderPlugin.prototype.scanDom = function (root = null, autoLoad = true) {
  const profile = this.profileStart('scanDom');
  const host = root || document.body;

  if (!host) {
    this.profileEnd(profile, {
      skipped: true,
      reason: 'empty-host'
    });
    return {
      custom: {
        keys: [],
        count: 0,
        iconCount: 0
      },
      attributes: {
        keys: [],
        count: 0
      },
      icons: {
        iconCount: 0
      }
    };
  }

  if (host.nodeType === Node.ELEMENT_NODE && this.shouldSkipNode(host)) {
    this.profileEnd(profile, {
      skipped: true,
      reason: 'ignored-host'
    });
    return {
      custom: {
        keys: [],
        count: 0,
        iconCount: 0
      },
      attributes: {
        keys: [],
        count: 0
      },
      icons: {
        iconCount: 0
      }
    };
  }

  const tagRules = this.getCustomElementRules();
  const customKeys = [];
  const attributeKeys = [];
  let customCount = 0;
  let attributeCount = 0;
  let customIconCount = 0;
  let staticIconCount = 0;
  let scannedNodes = 0;
  let attributeScannedNodes = 0;
  let attributeSkippedNodes = 0;

  const processNode = el => {
    if (!el || el.nodeType !== Node.ELEMENT_NODE || this.shouldSkipNode(el)) {
      return;
    }

    scannedNodes++;
    const tagName = el.tagName?.toLowerCase?.();

    if (tagName?.startsWith('sf-')) {
      const componentName = tagRules[tagName];

      if (componentName === 'cl-icons') {
        customIconCount += this.trackIconElement(el);
      }

      if (componentName && !this.module[componentName] && !this.shouldDeferNestedSmartElement(el)) {
        customKeys.push(componentName);
        customCount++;
        this.setExistCookie(componentName);
      }
    }

    if (el.classList?.contains('sf-icon') && !el.closest?.('sf-icon')) {
      staticIconCount += this.trackIconComponent(el);
    }

    if (this.hasRelevantRuleAttributes(el)) {
      attributeScannedNodes++;
      const attrResult = this.getAttributes(el);
      attributeCount += attrResult.count;
      attributeKeys.push(...attrResult.keys);
    } else {
      attributeSkippedNodes++;
    }
  };

  if (host.nodeType === Node.ELEMENT_NODE) {
    processNode(host);
  }

  const walker = this.createFilteredElementWalker(host);

  while (walker.nextNode()) {
    processNode(walker.currentNode);
  }

  const customResult = this.handleCustomElementScanResult({
    keys: customKeys,
    count: customCount,
    iconCount: customIconCount
  }, autoLoad);

  if (attributeCount > 0 && autoLoad) {
    this.mutate(() => this.getLoader(this.module, true));
  }

  if (autoLoad && staticIconCount > 0) {
    this.mutate(() => this.loadFonts());
  }

  const result = {
    custom: customResult,
    attributes: {
      keys: attributeKeys,
      count: attributeCount
    },
    icons: {
      iconCount: staticIconCount
    }
  };
  this.profileEnd(profile, {
    scannedNodes,
    customFound: customCount,
    attributeFound: attributeCount,
    customIcons: customIconCount,
    staticIcons: staticIconCount,
    attributeScannedNodes,
    attributeSkippedNodes,
    root: host === document.body ? 'body' : host.tagName?.toLowerCase?.()
  });
  return result;
};

SFLoaderPlugin.prototype.getMutationNodeHost = function (node) {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement || null;
};

SFLoaderPlugin.prototype.doesMutationRootCoverNode = function (root, node) {
  if (!root || !node) return false;
  if (root === node) return true;
  const rootHost = this.getMutationNodeHost(root);
  const nodeHost = this.getMutationNodeHost(node);
  if (!rootHost || !nodeHost) return false;

  if (root.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  return rootHost.contains(nodeHost);
};

SFLoaderPlugin.prototype.collectUniqueAddedMutationRoots = function (changeList = []) {
  const roots = [];

  for (let index = 0; index < changeList.length; index++) {
    const change = changeList[index];

    if (!change || change.type !== 'childList' || !change.addedNodes?.length) {
      continue;
    }

    for (let nodeIndex = 0; nodeIndex < change.addedNodes.length; nodeIndex++) {
      const node = change.addedNodes[nodeIndex];
      if (!node || this.shouldSkipNode(node)) continue;

      if (roots.some(root => this.doesMutationRootCoverNode(root, node))) {
        continue;
      }

      for (let rootIndex = roots.length - 1; rootIndex >= 0; rootIndex--) {
        if (this.doesMutationRootCoverNode(node, roots[rootIndex])) {
          roots.splice(rootIndex, 1);
        }
      }

      roots.push(node);
    }
  }

  return roots;
};

SFLoaderPlugin.prototype.search = function () {
  const output2 = [];
  let totalItemCount = 0;
  const newPlugins = [];

  const _this = this;

  const output = {
    utility: {},
    component: {},
    smart: {},
    relation: {}
  };
  let mutationBuffer = [];
  let debounceTimer = null;
  const DEBOUNCE_MS = 100;

  const processChanges = changeList => {
    if (this.stopObserver) {
      return false;
    }

    const profile = this.profileStart('MutationObserver.processChanges');
    const addedRoots = this.collectUniqueAddedMutationRoots(changeList);
    let processedAddedRoots = 0;
    let processedAttributeTargetsCount = 0;

    const processAddedNode = objHTML => {
      if (this.shouldSkipNode(objHTML)) return;
      processedAddedRoots++;
      this.findShortCodes(objHTML);
      const customScan = this.scanCustomElements(objHTML, false);

      if (customScan.count > 0) {
        totalItemCount += customScan.count;
        newPlugins.push(...customScan.keys);
      }

      this.trackPendingIconScan(customScan);
      this.trackPendingIconScan(this.scanStaticIcons(objHTML, false));

      if (!objHTML || objHTML.nodeType === 3 || !objHTML.tagName) {
        return;
      }

      const nodes = [objHTML, ...objHTML.querySelectorAll('*')];
      nodes.forEach(el => {
        if (this.shouldSkipNode(el)) return;

        if (!el.tagName || !this.excludedTags(el.tagName.toLowerCase())) {
          return;
        }

        const {
          count,
          keys
        } = this.getAttributes(el, output, output2);
        totalItemCount += count;
        newPlugins.push(...keys);
      });
    };

    addedRoots.forEach(processAddedNode);
    const processedAttributeTargets = new Set();

    for (let o = 0; o < changeList.length; o++) {
      const change = changeList[o];

      if (this.isSyncingStaticIconState && change.type === 'attributes' && change.attributeName === 'class') {
        continue;
      }

      if (this.shouldSkipNode(change.target)) continue;

      switch (change.type) {
        case 'childList':
          {
            const staticIconMutation = this.processStaticIconMutation(change.target, false);

            if (staticIconMutation.handled) {
              this.trackPendingIconScan(staticIconMutation);
              break;
            }

            break;
          }

        case 'characterData':
          {
            const staticIconMutation = this.processStaticIconMutation(change.target, false);

            if (staticIconMutation.handled) {
              this.trackPendingIconScan(staticIconMutation);
            }

            break;
          }

        case 'attributes':
          {
            if (processedAttributeTargets.has(change.target) || addedRoots.some(root => this.doesMutationRootCoverNode(root, change.target))) {
              continue;
            }

            processedAttributeTargets.add(change.target);
            processedAttributeTargetsCount++;
            const staticIconMutation = this.processStaticIconMutation(change.target, false);

            if (staticIconMutation.handled) {
              this.trackPendingIconScan(staticIconMutation);
              continue;
            }

            const customScan = this.scanCustomElements(change.target, false);
            this.trackPendingIconScan(customScan);
            this.trackPendingIconScan(this.scanStaticIcons(change.target, false));
            const {
              count,
              keys
            } = this.getAttributes(change.target, output, output2);
            totalItemCount += count;
            newPlugins.push(...keys);
            break;
          }

        default:
          console.warn(`action - ${change.type}`);
          break;
      }
    }

    const hasModuleLoads = totalItemCount > 0;

    if (totalItemCount > 0) {
      this.mutate(() => this.getLoader(this.module, true));
      totalItemCount = 0;
    }

    this.flushPendingIconScan({
      defer: hasModuleLoads
    });
    this.profileEnd(profile, {
      mutations: changeList.length,
      addedRoots: addedRoots.length,
      processedAddedRoots,
      processedAttributeTargets: processedAttributeTargetsCount,
      newPlugins: newPlugins.length,
      hasModuleLoads
    });
  };

  const callback = changes => {
    if (this.stopObserver) {
      mutationBuffer = [];
      clearTimeout(debounceTimer);
      return;
    }

    const relevantChanges = changes.filter(change => {
      if (change.type !== 'characterData') {
        return true;
      }

      return Boolean(this.getStaticIconElement(change.target));
    });

    if (!relevantChanges.length) {
      return;
    }

    if (_this.searchEnd) {
      mutationBuffer.push(...relevantChanges);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const bufferedChanges = [...mutationBuffer];
        mutationBuffer = [];
        processChanges(bufferedChanges);
      }, DEBOUNCE_MS);
    } else {
      _this.observeElements.push(...relevantChanges);
    }
  };

  this.mutationObserver = new MutationObserver(callback);
  const options = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true
  };
  this.mutationObserver.observe(document.documentElement, options);

  if (output2.length) {
    this.getLoader(output2);
  }
};

SFLoaderPlugin.prototype.setExistCookie = function (name, output = null, output2 = null) {
  let mode;
  const param = this.findPlugins[name] && typeof this.findPlugins[name] === 'object' ? this.findPlugins[name] : false;
  const pluginName = this.getPluginName(name + '/');

  if (this.findPlugins[name].type === 'attribute') {
    mode = 'component';
  } else if (this.findPlugins[name].type === 'component') {
    mode = 'component';
  } else if (this.findPlugins[name].type === 'smart') {
    mode = 'smart';
  } else {
    mode = 'utility';
  }

  if (output) {
    output[mode][name] = {};
  }

  if (param && param.relation) {
    this.setRelation(param.relation, name, output);
  }

  if (output) {
    if (param) {
      for (const key in param) {
        if (key !== 'regex') {
          output[mode][name][key] = param[key];
        }
      }
    }

    output[mode][name].url = name;
    output[mode][name].name = pluginName;
  }

  if (output2) {
    output2.push(name);
  }

  this.setModule(name);
};

SFLoaderPlugin.prototype.setRelation = function (relation, name, output, visited = new Set()) {
  if (!Array.isArray(relation) || visited.has(name)) {
    return;
  }

  visited.add(name);
  relation.forEach(rel => {
    if (!rel?.name) {
      return;
    }

    const relationRule = this.findPlugins?.[rel.name] || {};
    const relationModule = rel.mode || (relationRule.type === 'smart' ? 'smart' : relationRule.type === 'component' || relationRule.type === 'attribute' ? 'component' : 'utility');

    if (!this.relationPlugins[name]) {
      this.relationPlugins[name] = [rel.name];
    } else if (!this.relationPlugins[name].includes(rel.name)) {
      this.relationPlugins[name].push(rel.name);
    }

    if (!this.pluginListRelation.includes(rel.name)) {
      this.pluginListRelation.push(rel.name);
    }

    if (!this.module[rel.name]) {
      if (output) {
        const targetOutput = output[relationModule] || output.relation;
        targetOutput[rel.name] = {};
        targetOutput[rel.name].url = rel.name;
        targetOutput[rel.name].name = rel.name;
      }

      this.setModule(rel.name);
    }

    if (Array.isArray(relationRule.relation)) {
      this.setRelation(relationRule.relation, rel.name, output, visited);
    }
  });
};

SFLoaderPlugin.prototype.sortPlugins = function (module, arPathCss, arPathJs, plugin) {
  const breakpoints = ['default', 'sm', 'md', 'lg', 'xl', 'hover', 'focus', 'active'];

  for (const point of breakpoints) {
    this.sortPlugin(plugin[point] || [], point, module, arPathCss, arPathJs);
  }
};

SFLoaderPlugin.prototype.pathPluginJs = function (name, smart, point, type) {
  let pathPlugin;

  if (smart) {
    name = name.substring(3);
    pathPlugin = `${this.smartPath}/${name}`;
  } else {
    pathPlugin = `${type === 'component' ? this.componentPath : this.utilyPath}/${name}`;
  }

  return `${pathPlugin}/js/${type === 'component' || smart ? name : point}.js`;
};

SFLoaderPlugin.prototype.pathPluginCss = function (name, type, point) {
  let url = '';

  switch (type) {
    case 'component':
      url += this.componentPath;
      break;

    case 'smart':
      url += this.smartPath;
      name = name.substring(3);
      break;

    default:
      url += this.utilyPath;
      break;
  }

  return `${url}/${name}/css/${['component', 'smart'].includes(type) ? name : point}.css`;
};

SFLoaderPlugin.prototype.shouldSkipPluginCss = function (pluginName, module = {}) {
  const ruleMeta = SF.RuleLoader?.[pluginName] || {};
  const moduleConfig = module && typeof module === 'object' ? module : {
    type: module
  };
  const moduleType = moduleConfig.type || module;
  const ruleType = ruleMeta.type || '';
  const moduleMode = moduleConfig.mode || '';
  const ruleMode = ruleMeta.mode || '';
  const isSmart = moduleType === 'smart' || ruleType === 'smart' || moduleMode === 'smart' || ruleMode === 'smart';

  if (moduleConfig.css === false || ruleMeta.css === false) {
    return true;
  }

  if (isSmart) {
    return moduleConfig.css !== true && ruleMeta.css !== true;
  }

  return false;
};

SFLoaderPlugin.prototype.loadPlugin = function (pluginName, smart, point, module, plugins) {
  if (this.disableSmart && (module === 'smart' || smart)) {
    return;
  }

  const ruleMeta = SF.RuleLoader?.[pluginName];
  const skipJs = typeof ruleMeta?.js === 'undefined' || module && module.js === false || ruleMeta?.js === false;
  const skipCss = this.shouldSkipPluginCss(pluginName, module);
  const jsFile = skipJs ? null : this.pathPluginJs(pluginName, smart, point, module);

  if (!skipJs && !this.notFoundFiles[pluginName] || this.notFoundFiles[pluginName] && !this.notFoundFiles[pluginName].js) {
    if (!this.pendingLoadPlugins.has(pluginName)) {
      this.pendingLoadPlugins.add(pluginName);
    }

    if (this.relationPlugins[pluginName]) {
      this.loadRelationPlugins(pluginName, plugins, module, point, jsFile, skipJs);
    } else {
      this.isRelationPlugin(pluginName, jsFile, smart, point, module, skipJs);
    }
  } else if (skipJs) {
    if (this.relationPlugins[pluginName]) {
      this.loadRelationPlugins(pluginName, plugins, module, point, jsFile, true);
    } else {
      this.isRelationPlugin(pluginName, null, smart, point, module, true);
    }
  }

  if (!skipCss) {
    if (!this.notFoundFiles[pluginName] || this.notFoundFiles[pluginName] && (!this.notFoundFiles[pluginName].css || !this.notFoundFiles[pluginName].missingMin)) {
      const cssFile = this.pathPluginCss(pluginName, module, point);

      if (module === 'component' || module === 'smart') {
        this.checkEventsPlugins(pluginName);
      }

      if (!this.resolverAll[cssFile]) {
        this.resolverAll[cssFile] = this.addStyle(`${cssFile}`).then(() => {
          this.loadedPlugins[pluginName].css = true;
        }).catch(() => {
          this.addToMissingFiles(pluginName, 'css', false);
          const min = cssFile.replace('.css', '.min.css');
          this.resolverAll[min] = this.addStyle(`${min}`).then(() => {
            this.loadedPlugins[pluginName].minCss = true;
          }).catch(e => {
            console.warn(e);
            this.addToMissingFiles(pluginName, 'css', true);
          });
        });
      }
    }
  }
};

SFLoaderPlugin.prototype.loadRelationPlugins = function (name, plugins, module, point, jsFile, skipJs = false) {
  if (!this.totalRelationsPlugins[name]) {
    this.totalRelationsPlugins[name] = {
      load: 0,
      total: this.relationPlugins[name].length,
      canLoad: false,
      jsFile,
      skipJs,
      completed: {}
    };
  }

  if (this.totalRelationsPlugins[name].canLoad) {
    if (this.totalRelationsPlugins[name].skipJs || !jsFile) {
      if (!this.loadedPlugins[name]) {
        this.loadedPlugins[name] = {};
      }

      this.loadedPlugins[name].js = false;
      this.loadedPlugins[name].ready = true;
      return;
    }

    if (module === 'component' || module === 'smart') {
      this.checkEventsPlugins(name);
    }

    this.resolverAll[jsFile] = this.addScript(`${jsFile}`).then(() => {
      this.loadedPlugins[name].js = true;
      return this.awaitPluginAssetsReady(name, module === 'smart', point, module);
    }).catch(e => {
      console.warn(e);
      this.addToMissingFiles(name, 'js');
    });
  } else {
    this.relationPlugins[name].forEach(relationPlugin => {
      if (!this.loadedPlugins[relationPlugin]) {
        this.loadedPlugins[relationPlugin] = {};
      }

      const relationState = this.loadedPlugins[relationPlugin];
      const alreadyTracked = this.pendingLoadPlugins.has(relationPlugin) || relationState.ready || relationState.js || relationState.css || relationState.minCss;

      if (alreadyTracked) {
        const relationRule = this.findPlugins?.[relationPlugin] || {};
        const relationModule = relationRule.type === 'smart' ? 'smart' : relationRule.type === 'component' || relationRule.type === 'attribute' ? 'component' : 'utility';
        const relationSmart = relationModule === 'smart';
        const relationWaitKey = `${name}:relation:${relationPlugin}`;

        if (!this.resolverAll[relationWaitKey]) {
          this.resolverAll[relationWaitKey] = this.awaitPluginAssetsReady(relationPlugin, relationSmart, point, relationModule).then(() => {
            this.checkToFullRelationLoad(relationPlugin, name);
          });
        }

        return;
      }

      if (!this.pendingLoadPlugins.has(relationPlugin)) {
        this.pendingLoadPlugins.add(relationPlugin);
        const relationRule = this.findPlugins?.[relationPlugin] || {};
        const relationModule = relationRule.type === 'smart' ? 'smart' : relationRule.type === 'component' || relationRule.type === 'attribute' ? 'component' : 'utility';
        const relationSmart = relationModule === 'smart';
        const relationExists = plugins[relationModule]?.[relationPlugin] || relationRule;

        if (relationExists) {
          if (!plugins[relationModule]) {
            plugins[relationModule] = {};
          }

          if (!plugins[relationModule][relationPlugin]) {
            plugins[relationModule][relationPlugin] = {
              name: relationPlugin,
              url: relationPlugin
            };
          }

          this.loadPlugin(relationPlugin, relationSmart, point, relationModule, plugins);
          const relationWaitKey = `${name}:relation:${relationPlugin}`;

          if (!this.resolverAll[relationWaitKey]) {
            this.resolverAll[relationWaitKey] = this.awaitPluginAssetsReady(relationPlugin, relationSmart, point, relationModule).then(() => {
              this.checkToFullRelationLoad(relationPlugin, name);
            });
          }
        } else {
          console.warn(`Зависимый плагин находится в другой категории, чем ${module} или вовсе отсутствует - ${relationPlugin}`);
        }
      }
    });
  }
};

SFLoaderPlugin.prototype.awaitPluginAssetsReady = function (pluginName, smart, point, module, skipJs = false, skipCss = false) {
  if (!this.loadedPlugins[pluginName]) {
    this.loadedPlugins[pluginName] = {};
  }

  const waits = [];
  const rule = this.findPlugins?.[pluginName] || {};
  const needsJs = !skipJs && typeof rule?.js !== 'undefined' && rule.js !== false;
  const needsCss = !smart && !skipCss && typeof rule?.css !== 'undefined' && rule.css !== false;

  const hasLoadedAssets = () => {
    const state = this.loadedPlugins[pluginName] || {};
    const jsReady = !needsJs || state.js === true || state.ready === true;
    const cssReady = !needsCss || state.css === true || state.minCss === true || state.ready === true;
    return jsReady && cssReady;
  };

  if (hasLoadedAssets()) {
    this.loadedPlugins[pluginName].ready = true;
    return Promise.resolve();
  }

  if (needsJs) {
    const state = this.loadedPlugins[pluginName] || {};
    const jsFile = this.pathPluginJs(pluginName, smart, point, module);

    if (state.js !== true && state.ready !== true && jsFile && this.resolverAll[jsFile]) {
      waits.push(this.resolverAll[jsFile]);
    }
  }

  if (needsCss) {
    const state = this.loadedPlugins[pluginName] || {};
    const cssFile = this.pathPluginCss(pluginName, module, point);
    const minCssFile = cssFile.replace('.css', '.min.css');

    if (state.css !== true && state.minCss !== true && state.ready !== true && this.resolverAll[cssFile]) {
      waits.push(this.resolverAll[cssFile]);
    } else if (state.css !== true && state.minCss !== true && state.ready !== true && this.resolverAll[minCssFile]) {
      waits.push(this.resolverAll[minCssFile]);
    }
  }

  if (!waits.length && !hasLoadedAssets() && this.relationPlugins[pluginName]) {
    waits.push(new Promise(resolve => {
      let attempts = 0;

      const checkReady = () => {
        if (hasLoadedAssets()) {
          resolve();
          return;
        }

        attempts += 1;

        if (attempts < 200) {
          setTimeout(checkReady, 25);
        } else {
          resolve();
        }
      };

      checkReady();
    }));
  }

  return Promise.all(waits).catch(() => []).then(() => {
    this.loadedPlugins[pluginName].ready = true;
  });
};

SFLoaderPlugin.prototype.waitForResolverIdle = async function () {
  const maxPasses = 25;

  for (let pass = 0; pass < maxPasses; pass++) {
    const entries = Object.entries(this.resolverAll || {});

    if (!entries.length) {
      return [];
    }

    const keysBefore = entries.map(([key]) => key).sort().join('|');
    const result = await Promise.allSettled(entries.map(([, promise]) => promise));
    await Promise.resolve();
    await Promise.resolve();
    const keysAfter = Object.keys(this.resolverAll || {}).sort().join('|');

    if (keysAfter === keysBefore) {
      return result;
    }
  }

  console.warn('SFLoader waitForResolverIdle reached pass limit', {
    resolverAll: this.resolverAll,
    totalRelationsPlugins: this.totalRelationsPlugins
  });
  return Promise.allSettled(Object.values(this.resolverAll || {}));
};

SFLoaderPlugin.prototype.checkToFullRelationLoad = function (relationName, pluginName) {
  if (!this.totalRelationsPlugins[pluginName]) {
    return;
  }

  if (!this.totalRelationsPlugins[pluginName].completed) {
    this.totalRelationsPlugins[pluginName].completed = {};
  }

  if (this.totalRelationsPlugins[pluginName].completed[relationName]) {
    return;
  }

  if (this.totalRelationsPlugins[pluginName]?.canLoad) {
    if (this.isDebug) {
      console.warn('Duplicate relation completion', {
        relationName,
        pluginName,
        state: this.totalRelationsPlugins[pluginName]
      });
    }

    return;
  }

  this.totalRelationsPlugins[pluginName].completed[relationName] = true;
  this.totalRelationsPlugins[pluginName].load++;

  if (this.totalRelationsPlugins[pluginName].load === this.totalRelationsPlugins[pluginName].total) {
    this.totalRelationsPlugins[pluginName].canLoad = true;

    if (this.pendingLoadPlugins.has(pluginName)) {
      if (this.totalRelationsPlugins[pluginName].skipJs || !this.totalRelationsPlugins[pluginName].jsFile) {
        if (!this.loadedPlugins[pluginName]) {
          this.loadedPlugins[pluginName] = {};
        }

        this.loadedPlugins[pluginName].js = false;
        this.loadedPlugins[pluginName].ready = true;
        return;
      }

      this.resolverAll[this.totalRelationsPlugins[pluginName].jsFile] = this.addScript(`${this.totalRelationsPlugins[pluginName].jsFile}`).then(() => {
        if (!this.loadedPlugins[pluginName]) {
          this.loadedPlugins[pluginName] = {};
        }

        this.loadedPlugins[pluginName].js = true;
      }).catch(e => {
        console.warn(e);
        this.addToMissingFiles(pluginName, 'js');
      });
    }
  }
};

SFLoaderPlugin.prototype.isRelationPlugin = function (pluginName, jsFile, smart, point, module, skipJs = false) {
  const relationsMain = Object.keys(this.relationPlugins).filter(key => this.relationPlugins[key].indexOf(pluginName) !== -1);

  if (!relationsMain.length) {
    if (skipJs || !jsFile) {
      if (!this.loadedPlugins[pluginName]) {
        this.loadedPlugins[pluginName] = {};
      }

      this.loadedPlugins[pluginName].js = false;
      this.loadedPlugins[pluginName].ready = true;
      return;
    }

    if (module === 'component' || module === 'smart') {
      this.checkEventsPlugins(pluginName);
    }

    this.resolverAll[jsFile] = this.addScript(`${jsFile}`).then(() => {
      if (!this.loadedPlugins[pluginName]) {
        this.loadedPlugins[pluginName] = {};
      }

      this.loadedPlugins[pluginName].js = true;
    }).catch(e => {
      console.warn(e);
      this.addToMissingFiles(pluginName, 'js');
    });
  } else {
    relationsMain.forEach(relationMainPlugin => {
      if (!this.totalRelationsPlugins[relationMainPlugin]) {
        const relationMainRule = this.findPlugins?.[relationMainPlugin] || {};
        const relationMainModule = relationMainRule.type === 'smart' ? 'smart' : relationMainRule.type === 'component' || relationMainRule.type === 'attribute' ? 'component' : 'utility';
        const relationMainSmart = relationMainModule === 'smart';
        this.totalRelationsPlugins[relationMainPlugin] = {
          load: 0,
          total: this.relationPlugins[relationMainPlugin]?.length || 0,
          canLoad: false,
          jsFile: this.pathPluginJs(relationMainPlugin, relationMainSmart, point, relationMainModule),
          skipJs: typeof relationMainRule?.js === 'undefined' || relationMainRule?.js === false
        };
      }

      if (skipJs || !jsFile) {
        if (!this.loadedPlugins[pluginName]) {
          this.loadedPlugins[pluginName] = {};
        }

        this.loadedPlugins[pluginName].js = false;
        const relationWaitKey = `${relationMainPlugin}:relation:${pluginName}`;
        this.resolverAll[relationWaitKey] = Promise.resolve().then(() => {
          return this.awaitPluginAssetsReady(pluginName, smart, point, module, true);
        }).then(() => {
          this.checkToFullRelationLoad(pluginName, relationMainPlugin);
        });
        return;
      }

      this.resolverAll[jsFile] = this.addScript(`${jsFile}`).then(() => {
        if (!this.loadedPlugins[pluginName]) {
          this.loadedPlugins[pluginName] = {};
        }

        this.loadedPlugins[pluginName].js = true;
        return this.awaitPluginAssetsReady(pluginName, smart, point, module).then(() => {
          this.checkToFullRelationLoad(pluginName, relationMainPlugin);
        });
      }).catch(e => {
        console.warn(e);
        this.checkToFullRelationLoad(pluginName, relationMainPlugin);
        this.addToMissingFiles(pluginName, 'js');
      });
    });
  }
};

SFLoaderPlugin.prototype.sortPlugin = function (plugins, point, module) {
  const modPlugins = plugins?.[module];
  if (!modPlugins) return;

  for (const i in modPlugins) {
    const smart = module === 'smart';
    let pluginName = '';

    if (i.includes('/') || module === 'component' || smart) {
      pluginName = i;
    } else {
      pluginName = `${i}/${point}`;
    } // Skip if already marked as loaded (from SF_PRELOADED or previous pass).


    if (this.loadedPlugins && this.loadedPlugins[pluginName]) {
      continue;
    }

    if (this.pendingLoadPlugins.has(pluginName)) continue;
    this.pendingLoadPlugins.add(pluginName);

    if (!this.loadedPlugins[pluginName]) {
      this.loadedPlugins[pluginName] = {};
    }

    this.loadPlugin(pluginName, smart, point, module, plugins);
  }
};

SFLoaderPlugin.prototype.vUseMergeConfigGenerate = function (plugins) {
  const profile = this.profileStart('vUseMergeConfigGenerate');
  const inputCount = Array.isArray(plugins) ? plugins.length : 0; // const checkToFake = request.getQuery('checkFake')
  // let smartFakeContent = { status: false }
  // if (checkToFake === 'true') {
  //     const url = request.getQuery('url') || ''
  //     const hash = md5(url).substring(0, 16)
  //     smartFakeContent = templateLoader.buildObject(hash)
  // }
  // const pluginNameOld = getModule()
  // const pluginDiff = plugins.filter(plugin => !pluginNameOld.includes(plugin)).filter(Boolean)
  // const firstLoad = request.getQuery('load') === 'true'
  // const arResult = { smartFakeContent }

  plugins = Array.from(new Set([...plugins]));
  const noMinifierJs = [];
  const noMinifierCss = [];
  plugins = this.splitPluginPoint(plugins);
  let types = ['base', 'component', 'smart', 'utility'];

  if (this.disableSmart) {
    types = types.filter(t => t !== 'smart');
  }

  for (const type of types) {
    this.sortPlugins(type, noMinifierCss, noMinifierJs, plugins);
  }

  this.profileEnd(profile, {
    inputCount,
    types: types.join(','),
    resolverCount: Object.keys(this.resolverAll || {}).length,
    pendingLoadPlugins: this.pendingLoadPlugins?.size || 0
  });
};

SFLoaderPlugin.prototype.splitPluginPoint = plugins => {
  const sortLayerPlugin = {};
  plugins.forEach(idPlugin => {
    if (/cl-\S+/.test(idPlugin)) {
      // Смарт-компоненты
      if (!sortLayerPlugin.default) sortLayerPlugin.default = {};
      if (!sortLayerPlugin.default.smart) sortLayerPlugin.default.smart = {};
      sortLayerPlugin.default.smart[idPlugin] = idPlugin;
    } else if (idPlugin.includes('/') && !idPlugin.includes('component')) {
      // Утилиты
      const step = idPlugin.split('/');

      if (step[0] === 'headers' || step[0] === 'container') {
        if (!sortLayerPlugin[step[1]]) sortLayerPlugin[step[1]] = {};
        if (!sortLayerPlugin[step[1]].base) sortLayerPlugin[step[1]].base = {};
        sortLayerPlugin[step[1]].base[step[0]] = step[0];
      } else {
        if (!sortLayerPlugin[step[1]]) sortLayerPlugin[step[1]] = {};
        if (!sortLayerPlugin[step[1]].utility) sortLayerPlugin[step[1]].utility = {};
        sortLayerPlugin[step[1]].utility[step[0]] = step[0];
      }
    } else {
      // Компоненты
      if (!sortLayerPlugin.default) sortLayerPlugin.default = {};
      if (!sortLayerPlugin.default.component) sortLayerPlugin.default.component = {};
      sortLayerPlugin.default.component[idPlugin] = idPlugin;
    }
  });
  return sortLayerPlugin;
};

SFLoaderPlugin.prototype.checkSmartCache = function () {
  const smartCache = localStorage.getItem(`SF_SMART_LIST-${this.urlHash}`);

  if (smartCache) {
    try {
      this.smartCache = JSON.parse((0,lz_string__WEBPACK_IMPORTED_MODULE_0__.decompressFromUTF16)(smartCache));
    } catch (e) {
      console.warn(e);
      return false;
    }
  }
};

SFLoaderPlugin.prototype.disconnectObservers = function () {
  this.mutationObserver?.disconnect?.();
  clearInterval(this.arrowInterval);
  this.arrowInterval = null;
};

SFLoaderPlugin.prototype.checkTurbo = function () {
  if (typeof Turbo !== 'undefined') {
    this.turboEnabled = true;
    document.addEventListener('turbo:before-render', () => {
      this.stopPreloader();
      this.disconnectObservers?.();
      this.searchEnd = false;
      this.prepareInit = false;
      this.loadPage = false;
      this.cachedPlugins = [];
      this.module = {};
    });
    document.addEventListener('turbo:load', () => {
      this.urlHash = this.generatePageHash();
      this.prepareInit = false;
      this.firstLoad = true;
      this.prepare();
    });
  }
};

SFLoaderPlugin.prototype.checkToCacheClean = function () {
  const params = new URLSearchParams(window.location.search);
  const clear = params.get('loader_clear');

  if (clear && clear === 'Y') {
    this.clearCache();
  }
};

SFLoaderPlugin.prototype.sendThemeToPlayground = function (iframe = null, theme = null) {
  if (!iframe) {
    iframe = document.querySelector('iframe[src*="play.simai.io/embed.html"]');
  }

  if (!iframe) return false;
  theme = theme ?? this.theme;
  iframe?.contentWindow?.postMessage({
    type: 'sf-theme',
    theme
  }, '*');
};

SFLoaderPlugin.prototype.changeTheme = function () {
  if (!this.themeEnabled) return false;
  this.theme = this.theme === 'dark' ? 'light' : 'dark';
  this.sendThemeToPlayground();
  this.setCookie('sf-theme', this.theme);
  this.checkTheme();
};

SFLoaderPlugin.prototype.turboFontCheck = function (body) {
  if (this.iconFontReady) {
    body.classList.add('sf-icons-loaded');
  }
};

SFLoaderPlugin.prototype.checkTheme = function (body = null) {
  if (!this.themeEnabled) return false;
  const classes = ['theme-dark', 'theme-light'];
  let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = this.getCookie('sf-theme');

  if (theme) {
    isDark = theme === 'dark';
  }

  theme = isDark ? 'dark' : 'light';
  this.theme = theme;
  body = body || document.documentElement;

  if (theme || !body.classList.contains('theme-light') && !body.classList.contains('theme-dark')) {
    body.classList.remove(isDark ? classes[1] : classes[0]);
    body.classList.add(isDark ? classes[0] : classes[1]);
  }

  this.sendThemeToPlayground();
};

SFLoaderPlugin.prototype.checkForCache = function () {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith('SF_PLUGIN_LIST-')) {
      return false;
    }
  }

  return true;
};

SFLoaderPlugin.prototype.randomId = function (length = 8) {
  return Math.random().toString(36).substr(2, length);
};

SFLoaderPlugin.prototype.clearCache = function () {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);

    if (key.startsWith('SF_PLUGIN_LIST-') || key.startsWith('SF_SMART_LIST-')) {
      safeRemoveItem(key);
    }
  }

  safeRemoveItem('SF_MISSING_PLUGINS');
};

SFLoaderPlugin.prototype.clearAllSfCache = function () {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);

    if (key && key.startsWith('SF_')) {
      safeRemoveItem(key);
    }
  }
};

SFLoaderPlugin.prototype.ensureCacheVersion = function () {
  const versionKey = 'SF_CACHE_VERSION';
  const storedVersion = localStorage.getItem(versionKey);
  const currentVersion = this.cacheVersion;

  if (!currentVersion) {
    this.clearAllSfCache();
    safeRemoveItem(versionKey);
    return;
  }

  if (storedVersion !== currentVersion) {
    this.clearAllSfCache();
    safeSetItem(versionKey, currentVersion);
  }
};

SFLoaderPlugin.prototype.ensurePluginListVersion = function () {
  const versionKey = 'SF_PLUGIN_LIST_VERSION';
  const storedVersion = localStorage.getItem(versionKey);
  const currentVersion = this.pluginListVersion;

  if (!currentVersion) {
    this.clearCache();
    safeRemoveItem(versionKey);
    return;
  }

  if (storedVersion !== currentVersion) {
    this.clearCache();
    safeSetItem(versionKey, currentVersion);
  }
};

SFLoaderPlugin.prototype.revalidateMissingPlugins = function () {
  try {
    const stored = localStorage.getItem('SF_MISSING_PLUGINS');
    if (!stored) return;
    const parsed = JSON.parse((0,lz_string__WEBPACK_IMPORTED_MODULE_0__.decompressFromUTF16)(stored));
    if (!parsed || typeof parsed !== 'object') return;
    const remaining = {};
    Object.keys(parsed).forEach(name => {
      if (!name) return;

      if (SF.RuleLoader?.[name] || this.loadedPlugins[name]) {
        return;
      }

      remaining[name] = parsed[name];
    });

    if (Object.keys(remaining).length) {
      localStorage.setItem('SF_MISSING_PLUGINS', (0,lz_string__WEBPACK_IMPORTED_MODULE_0__.compressToUTF16)(JSON.stringify(remaining)));
    } else {
      localStorage.removeItem('SF_MISSING_PLUGINS');
    }
  } catch (e) {
    console.warn('revalidateMissingPlugins failed', e);
  }
};

SFLoaderPlugin.prototype.registerComponent = function (name, className) {
  if (this.ComponentRegistry[name]) return;

  if (className.prototype) {
    className.prototype.componentName = name;
  }

  this.ComponentRegistry[name] = className;
  const lower = name && name.toLowerCase ? name.toLowerCase() : name;

  if (lower && !this.ComponentRegistry[lower]) {
    this.ComponentRegistry[lower] = className;
  }

  window.dispatchEvent(new CustomEvent(name + ':ready', {
    detail: className
  }));

  try {
    document.dispatchEvent(new CustomEvent('component:ready', {
      detail: {
        name
      }
    }));
  } catch (e) {
    console.warn('component:ready dispatch failed', e);
  }
};

SFLoaderPlugin.prototype.ready = function (className, callback) {
  const variants = Array.from(new Set([className, className && className[0] ? className[0].toUpperCase() + className.slice(1) : className, className && className.toLowerCase ? className.toLowerCase() : className].filter(Boolean)));

  const tryResolve = () => {
    for (const name of variants) {
      const cls = this.ComponentRegistry[name];

      if (typeof cls === 'function') {
        callback(cls);
        return true;
      }
    }

    return false;
  };

  if (tryResolve()) return;
  variants.forEach(name => {
    const eventName = `${name}:ready`;
    window.addEventListener(eventName, () => {
      tryResolve();
    }, {
      once: true
    });
  });
};

SFLoaderPlugin.prototype.searchRegexp = function (event, html = null) {
  const profile = this.profileStart('searchRegexp');
  const filteredRules = this.getRegexpScanRules();

  if (!filteredRules.length) {
    this.pendingRegex = false;
    this.getLoader([]);
    this.profileEnd(profile, {
      skipped: true,
      reason: 'no-regexp-rules'
    });
    return;
  }

  let htmlString = '';

  if (html) {
    if (typeof html === 'string') {
      htmlString = html;
    } else if (html.nodeType) {
      htmlString = this.getObserverFilteredHTML(html);
    } else if (html.textContent !== undefined) {
      htmlString = html.textContent;
    }
  } else {
    htmlString = document.body ? this.getObserverFilteredHTML(document.body) : '';
  }

  const bodyRaw = this.stripIgnoredBlocks(htmlString);

  if (!bodyRaw) {
    this.pendingRegex = false;
    this.getLoader([]);
    this.profileEnd(profile, {
      skipped: true,
      reason: 'empty-body'
    });
    return;
  }

  const body = bodyRaw.length > 4096 ? bodyRaw.slice(0, 4096) : bodyRaw;

  if (this.regexMatchCache.has(body)) {
    const cached = this.regexMatchCache.get(body);
    cached.forEach(key => this.setExistCookie(key));
    this.pendingRegex = false;
    this.getLoader([]);
    this.profileEnd(profile, {
      cacheHit: true,
      bodyLength: body.length,
      matched: cached.length
    });
    return;
  }

  const matched = [];

  for (const [key] of filteredRules) {
    const item = SF.RuleLoader[key];
    const regex = item.regex || item;
    const re = regex instanceof RegExp ? regex : new RegExp(regex, regex.flags || '');
    if (re.global || re.sticky) re.lastIndex = 0;

    if (re.test(body)) {
      matched.push(key);
      this.setExistCookie(key);
    }
  }

  this.regexMatchCache.set(body, matched);
  this.pendingRegex = false;
  this.getLoader([]);
  this.profileEnd(profile, {
    cacheHit: false,
    bodyLength: body.length,
    rules: filteredRules.length,
    matched: matched.length
  });
};

SFLoaderPlugin.prototype.getObserverFilteredHTML = function (node) {
  if (!node) return '';
  if (this.shouldSkipNode(node)) return '';
  const clone = node.cloneNode(true);
  const ignoredNodes = clone.querySelectorAll?.(OBSERVER_IGNORE_SELECTOR) || [];
  ignoredNodes.forEach(ignoredNode => ignoredNode.remove());
  if (clone.innerHTML !== undefined) return clone.innerHTML;
  if (clone.outerHTML !== undefined) return clone.outerHTML;
  if (clone.textContent !== undefined) return clone.textContent;
  return '';
};

SFLoaderPlugin.prototype.stripIgnoredBlocks = function (html) {
  if (!html) return '';
  const patterns = [/<code\b[^>]*>.*?<\/code>/gims, /<pre\b[^>]*>.*?<\/pre>/gims, /<([a-z][\w:-]*)\b[^>]*data-sf-observer=["']ignore["'][^>]*>.*?<\/\1>/gims, /<(div|section)\b[^>]*class=["']?[^"'>]*monaco[^"'>]*["']?[^>]*>.*?<\/\1>/gims];
  return patterns.reduce((acc, pattern) => acc.replace(pattern, ''), html);
};

SFLoaderPlugin.prototype.getLoader = async function (PluginList, temp = false, skipDefer = false) {
  this.logTiming('getLoader start');
  let clearCache = this.getUrlParam('loader_clear');

  if (clearCache) {
    clearCache = `&clear_cache=${clearCache}`;
  }

  if (!Array.isArray(PluginList)) {
    PluginList = this.getObjectArray(PluginList || {});
  }

  const profile = this.profileStart('getLoader');
  const requestedPluginCount = PluginList.length;
  const prioritySet = new Set(this.priorityModules || []);

  if (PluginList.length) {
    const priorityFirst = [];
    const rest = [];
    PluginList.forEach(mod => {
      if (prioritySet.has(mod)) {
        priorityFirst.push(mod);
      } else {
        rest.push(mod);
      }
    });
    PluginList = [...priorityFirst, ...rest];
  }

  const deferredModules = [];
  const heavyModules = this.heavyModules || [];
  const allowDefer = !skipDefer && !this.loadPage;

  if (!skipDefer && PluginList.length < 10 && !this.productionPlanActive) {
    this.debug('PluginList is empty, use Cookie');
    PluginList = this.getModuleArray();
  }

  if (allowDefer && Array.isArray(PluginList)) {
    PluginList = PluginList.filter(mod => {
      if (heavyModules.includes(mod)) {
        deferredModules.push(mod);
        return false;
      }

      return true;
    });
  }

  if (!PluginList.length && deferredModules.length) {
    this.profileEnd(profile, {
      redirectedToDeferred: true,
      requestedPluginCount,
      deferredCount: deferredModules.length
    });
    return this.getLoader(deferredModules, temp, true);
  }

  if (this.loadedPlugins && Array.isArray(PluginList)) {
    PluginList = PluginList.filter(m => {
      return !this.loadedPlugins[m];
    });
  }

  if (skipDefer && PluginList.length && this.loadedPlugins) {
    PluginList = PluginList.filter(m => !this.loadedPlugins[m]);
  }

  const lastLoadCur = this.hashCode(PluginList + '/' + this.pluginListRelation);

  if (!skipDefer && lastLoadCur === this.lastLoadHash && this.loadPage) {
    if (deferredModules.length) {
      return this.getLoader(deferredModules, temp, true);
    }

    this.stopPreloader();
    this.logTiming('getLoader skipped: same hash');
    this.profileEnd(profile, {
      skipped: true,
      reason: 'same-hash',
      requestedPluginCount,
      pluginCount: PluginList.length,
      deferredCount: deferredModules.length
    });
    return false;
  }

  safeSetItem(`SF_PLUGIN_LIST-${this.urlHash}`, (0,lz_string__WEBPACK_IMPORTED_MODULE_0__.compressToUTF16)(JSON.stringify(this.module)));

  if (this.lastLoadHash && !skipDefer && this.cachedPlugins.length) {
    PluginList = PluginList.filter(x => !this.cachedPlugins.includes(x));
  }

  if (!skipDefer) {
    this.lastLoadHash = lastLoadCur;
  } else if (PluginList.length) {
    this.cachedPlugins = Array.from(new Set([...(this.cachedPlugins || []), ...PluginList]));
  }

  if (this.standAlone) {
    this.logTiming('standalone load start');
    this.logTiming(`PluginList - ${PluginList.length} modules`);
    this.vUseMergeConfigGenerate(PluginList);
    const promises = Object.values(this.resolverAll);

    if (promises.length === 0) {
      if (!this.pendingRegex) {
        this.dispatchReadyOnce();
      }

      this.stopPreloader();
      this.logTiming('standalone: nothing to load');
      this.profileEnd(profile, {
        mode: 'standalone',
        skipped: true,
        reason: 'nothing-to-load',
        requestedPluginCount,
        pluginCount: PluginList.length
      });
      return;
    }

    this.waitForResolverIdle().then(() => {
      if (!this.eventSend && !this.pendingRegex || skipDefer) {
        this.pendingRegex = false;
        this.dispatchReadyOnce();
      }

      this.eventsPlugins = [];
      this.resolverAll = {};
      this.stopPreloader();
      this.loadPage = true;
      const totalLoaded = Object.keys(this.loadedPlugins || {}).length;
      this.logTiming(`standalone load complete: ${totalLoaded} modules`);
      this.profileEnd(profile, {
        mode: 'standalone',
        requestedPluginCount,
        pluginCount: PluginList.length,
        resolverCount: Object.keys(this.resolverAll || {}).length,
        totalLoaded,
        deferredCount: deferredModules.length
      });

      if (this.isDebug) {
        console.log('SFLoader loaded modules (standalone)', this.loadedPlugins);
      }

      if (deferredModules.length) {
        this.getLoader(deferredModules, temp, true);
      }
    });
  } else {
    this.logTiming('remote load request');
    const thisObject = this;
    const params = new URLSearchParams({
      a: PluginList,
      clear_cache: clearCache,
      relations: JSON.stringify(this.relationPlugins),
      gzipSupport: window.SUPPORTS_GZIP,
      temp,
      load: this.firstLoad,
      checkFake: true,
      url: window.location.pathname
    });
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    const linkQuery = `/simai/loader/loader.php?${params.toString()}`;
    this.firstLoad = false;
    xhr.open('GET', linkQuery);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.warn(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        const localMissingPlugins = localStorage.getItem('SF_MISSING_PLUGINS');

        if (localMissingPlugins) {
          try {
            this.notFoundFiles = JSON.parse((0,lz_string__WEBPACK_IMPORTED_MODULE_0__.decompressFromUTF16)(localMissingPlugins));
          } catch (e) {
            console.warn('Failed to parse SF_MISSING_PLUGINS', e);
          }
        }

        this.vUseMergeConfigGenerate(PluginList);
        this.waitForResolverIdle().then(() => {
          this.dispatchReadyOnce();
          this.stopPreloader();
          this.logTiming('remote load fallback complete');
          this.profileEnd(profile, {
            mode: 'remote',
            fallback: true,
            requestedPluginCount,
            pluginCount: PluginList.length,
            deferredCount: deferredModules.length
          });

          if (deferredModules.length) {
            this.getLoader(deferredModules, temp, true);
          }
        });
      } else {
        thisObject.debug(xhr.response);

        if (xhr.response && xhr.response.frameworkPath) {
          window.frameWorkPath = xhr.response.frameworkPath;
        }

        if (xhr.response) {
          const {
            smartFakeContent
          } = xhr.response;
          const promiseAll = [];

          if (xhr.response.js.length > 1) {
            const jsItem = document.querySelector(`[src="${xhr.response.js}"]`);

            if (jsItem) {
              jsItem.remove();
            }

            promiseAll.push(thisObject.addScript(xhr.response.js).catch(e => {
              console.warn(e);
            }));
          }

          if (xhr.response.css.length > 1) {
            const cssItem = document.querySelector(`[href="${xhr.response.css}"]`);

            if (cssItem) {
              cssItem.remove();
            }

            promiseAll.push(thisObject.addStyle(xhr.response.css));
          }

          Promise.allSettled(promiseAll).then(async () => {
            this.dispatchReadyOnce();

            if (smartFakeContent && smartFakeContent.status) {
              let htmlString = '';
              SF.cl.fakeLoader.cachedTemplates = smartFakeContent.fakeTemplates;
              SF.cl.cacheManager.cachedTemplates = smartFakeContent.templates ? smartFakeContent.templates : {};
              SF.cl.cacheManager.hasHash = smartFakeContent.hasHash;

              for (const key in smartFakeContent.fakeTemplates) {
                if (smartFakeContent.fakeTemplates[key]) {
                  htmlString += smartFakeContent.fakeTemplates[key];
                }
              }

              const html = SF.cl.parseFromString(htmlString);
              this.searchRegexp('', html);
            }

            await this.waitForResolverIdle();
            this.stopPreloader();
            this.loadPage = true;
            const totalLoaded = Object.keys(this.loadedPlugins || {}).length;
            this.logTiming(`remote load complete: ${totalLoaded} modules`);
            this.profileEnd(profile, {
              mode: 'remote',
              requestedPluginCount,
              pluginCount: PluginList.length,
              resourceCount: promiseAll.length,
              totalLoaded,
              deferredCount: deferredModules.length
            });

            if (this.isDebug) {
              console.log('SFLoader loaded modules (remote)', this.loadedPlugins);
            }

            if (deferredModules.length) {
              this.getLoader(deferredModules, temp, true);
            }
          });
        }
      }
    };
  }

  return true;
};

SFLoaderPlugin.prototype.hashCode = function (s) {
  if (s === '') return 0;
  return s.split('').reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
};

SFLoaderPlugin.prototype.isEmptyObject = function (obj) {
  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      return false;
    }
  }

  return true;
};

SFLoaderPlugin.prototype.addToMissingFiles = function (name, type, missingMin = true) {
  if (this.notFoundFiles[name]) {
    this.notFoundFiles[name][type] = true;
  } else {
    this.notFoundFiles[name] = {
      [type]: true
    };
  }

  if (type === 'css') {
    this.notFoundFiles[name].missingMin = missingMin;
  }

  safeSetItem('SF_MISSING_PLUGINS', (0,lz_string__WEBPACK_IMPORTED_MODULE_0__.compressToUTF16)(JSON.stringify(this.notFoundFiles)));
};

SFLoaderPlugin.prototype.getAssetVersion = function () {
  return this.cacheVersion || this.pluginListVersion || '';
};

SFLoaderPlugin.prototype.versionAssetUrl = function (pluginURL) {
  const version = this.getAssetVersion();

  if (!version || typeof pluginURL !== 'string') {
    return pluginURL;
  }

  if (/^(data:|blob:|javascript:)/i.test(pluginURL)) {
    return pluginURL;
  }

  const hashIndex = pluginURL.indexOf('#');
  const hash = hashIndex >= 0 ? pluginURL.slice(hashIndex) : '';
  const base = hashIndex >= 0 ? pluginURL.slice(0, hashIndex) : pluginURL;
  const encodedVersion = encodeURIComponent(version);

  if (/[?&]sf_v=/.test(base)) {
    return `${base.replace(/([?&])sf_v=[^&#]*/g, `$1sf_v=${encodedVersion}`)}${hash}`;
  }

  return `${base}${base.includes('?') ? '&' : '?'}sf_v=${encodedVersion}${hash}`;
};

SFLoaderPlugin.prototype.addStyle = async function (pluginURL) {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('link');
    const src = this.versionAssetUrl(pluginURL);
    style.href = src;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    head.append(style);
    style.addEventListener('load', () => {
      resolve();
    });
    style.addEventListener('error', () => {
      reject(new Error(`Ошибка загрузки скрипта - ${pluginURL}`));
    });
  });
};

SFLoaderPlugin.prototype.addScript = function (pluginURL, param = {}) {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    const src = this.versionAssetUrl(pluginURL);
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => {
      resolve();
    });
    script.addEventListener('error', () => {
      reject(new Error(`Ошибка загрузки скрипта - ${pluginURL}`));
    });

    if (param && param.attributes) {
      for (const k in param.attributes) {
        script.setAttribute(k, param.attributes[k]);
      }
    }

    head.append(script);
  });
};

SFLoaderPlugin.prototype.setPreloaderParams = function () {
  if (this.params.preloader) {
    for (const key in this.params.preloader) {
      this.preloader[key] = this.params.preloader[key];
    }
  }

  this.contentPreloader = this.params.contentPreloader ? this.params.contentPreloader : (0,_preloader__WEBPACK_IMPORTED_MODULE_4__.createPreloaderContent)(this.preloader);
};

SFLoaderPlugin.prototype.getCurrentUrl = function () {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const path = window.location.pathname;
  const url = `${protocol}//${host}${path}`.replace(/\/+$/, '');
  return url.split('?')[0];
};

SFLoaderPlugin.prototype.isDynamicPage = function (url) {
  return /\/\d+|\/[a-zA-Z_-]+\/[a-zA-Z0-9_-]+/.test(url);
};

SFLoaderPlugin.prototype.removeLastSegment = function (url) {
  return url.replace(/\/[^/]+$/, '');
};

SFLoaderPlugin.prototype.generatePageHash = function () {
  let pageUrl = this.getCurrentUrl();

  if (this.isDynamicPage(pageUrl)) {
    pageUrl = this.removeLastSegment(pageUrl);
  }

  return blueimp_md5__WEBPACK_IMPORTED_MODULE_1___default()(pageUrl).substring(0, 16);
};

SFLoaderPlugin.prototype.onWindowLoad = function (fn) {
  if (document.readyState === 'complete') {
    fn();
  } else {
    window.addEventListener('load', fn, {
      once: true
    });
  }
};

SFLoaderPlugin.prototype.prepare = function (observer = null) {
  let PluginList = [];
  this.logTiming('prepare start');
  this.searchEnd = false;
  this.checkTheme();

  if (this.standAlone) {
    const localMissingPlugins = localStorage.getItem('SF_MISSING_PLUGINS');

    try {
      this.notFoundFiles = localMissingPlugins ? JSON.parse((0,lz_string__WEBPACK_IMPORTED_MODULE_0__.decompressFromUTF16)(localMissingPlugins)) : {};
    } catch (e) {
      console.warn(e);
    }
  }

  let plugins = this.productionPlanActive ? null : localStorage.getItem(`SF_PLUGIN_LIST-${this.urlHash}`); // fallback: если есть bundle-id, пробуем его ключ даже в standAlone

  if (!this.productionPlanActive && !plugins && window.BUNDLE_ID) {
    plugins = localStorage.getItem(`SF_PLUGIN_LIST-${window.BUNDLE_ID}`);
  }

  if (!this.standAlone) {
    this.firstLoad = !window.BUNDLE_LOADED;
  } else {
    this.firstLoad = typeof plugins !== 'string';
  }

  this.findShortCodes(document.body);

  if (plugins) {
    try {
      PluginList = JSON.parse((0,lz_string__WEBPACK_IMPORTED_MODULE_0__.decompressFromUTF16)(plugins));
      this.cachedPlugins = this.getObjectArray(PluginList);
    } catch {
      PluginList = [];
    }

    if (!PluginList || !Object.keys(PluginList).length) {
      plugins = null;
    } else {
      this.module = PluginList;
      Object.keys(PluginList).forEach(key => {
        const plugin = this.findPlugins[key];

        if (plugin && plugin.relation) {
          this.setRelation(plugin.relation, key, false);
        }
      }); // Кэшированные плагины загружаем сразу, без отложенного defer

      this.getLoader(PluginList, false, true);
      this.logTiming('prepare: initial getLoader requested (cached, skipDefer)');
    }
  } else {
    this.logTiming('prepare: preloader run');
  }

  this.onWindowLoad(() => {
    if (observer) {
      observer.disconnect();
    }

    this.logTiming('onWindowLoad search start');
    this.findShortCodes(document.body);

    try {
      document.dispatchEvent(new CustomEvent('sf-shortcodes-ready', {
        detail: {
          loader: this,
          timestamp: Date.now()
        }
      }));
    } catch (e) {
      console.warn('sf-shortcodes-ready dispatch failed', e);
    }

    this.scanCustomElements(document.body);
    this.scanStaticIcons(document.body);
    this.scanAttributes(document.body);
    this.searchAttr(false);
    this.searchRegexp('');
    this.search();

    if (Object.keys(this.module || {}).length) {
      this.getLoader(this.module, true);
    }

    this.revalidateMissingPlugins();
    this.logTiming('onWindowLoad search done');
  });
};

SFLoaderPlugin.prototype.prepareTurboEvents = function () {
  if (this.turboEventsBound) return;
  this.turboEventsBound = true;
  document.addEventListener('turbo:before-render', e => {
    let {
      newBody,
      isPreview
    } = e.detail;
    if (!newBody) return;
    const root = document.documentElement;
    if (!root || root.getAttribute('dir')) return;
    const computedDir = root.getAttribute('dir') || document?.dir || document.documentElement && document.documentElement.getAttribute('dir') || '';
    root.setAttribute('dir', computedDir === 'rtl' ? 'rtl' : 'ltr');
    if (isPreview || newBody.hasAttribute('data-turbo-preview')) return;
    if (this.turboRenderHandled) return;
    this.turboRenderHandled = true;
    this.findShortCodes(newBody);
    this.scanCustomElements(newBody);
    this.scanStaticIcons(newBody);
    this.scanAttributes(newBody);
    this.searchRegexp('', newBody);
    this.turboFontCheck(newBody);
    this.checkTheme(newBody);

    e.detail.render = currentBody => currentBody.replaceWith(newBody);
  });
  document.addEventListener('turbo:load', () => {
    this.turboRenderHandled = false;
  });
};

SFLoaderPlugin.prototype.getTextNodes = function (node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode: textNode => this.shouldSkipNode(textNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  });
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  return textNodes;
};

SFLoaderPlugin.prototype.mutate = function (fn) {
  return requestAnimationFrame(fn);
};

SFLoaderPlugin.prototype.ensureLoadedModules = function () {
  if (window.SF_PRELOADED) {
    this.productionPlanActive = true;
    this.pendingRegex = false;
    this.firstLoad = false;
    const {
      modules,
      loadedPlugins
    } = window.SF_PRELOADED;

    if (Array.isArray(modules)) {
      modules.forEach(m => {
        if (m) {
          this.module[m] = m;

          if (!this.loadedPlugins[m]) {
            this.loadedPlugins[m] = {};
          }
        }
      });
    } else if (modules && typeof modules === 'object') {
      Object.keys(modules).forEach(m => {
        this.module[m] = m;

        if (!this.loadedPlugins[m]) {
          this.loadedPlugins[m] = {};
        }
      });
    }

    if (loadedPlugins && typeof loadedPlugins === 'object') {
      this.loadedPlugins = { ...this.loadedPlugins,
        ...loadedPlugins
      };
    } // If modules already present, immediately signal ready


    if (!this.eventSend && Object.keys(this.loadedPlugins || {}).length) {
      if (this.dispatchReadyOnce()) {
        this.searchEnd = true;
      }
    }
  }
};

SFLoaderPlugin.prototype.ensureDirAttribute = function () {
  const root = document.documentElement;

  if (!root || root.getAttribute('dir')) {
    return;
  }

  const computedDir = window.getComputedStyle && root ? window.getComputedStyle(root).direction : '';
  root.setAttribute('dir', computedDir === 'rtl' ? 'rtl' : 'ltr');
};

SFLoaderPlugin.prototype.init = function () {
  this.logTiming('init start');
  this.ensureLoadedModules();
  this.ensureDirAttribute();
  this.checkTurbo();
  this.checkToCacheClean();
  this.ensureCacheVersion();
  this.ensurePluginListVersion();
  this.restoreIconManifestFromCache();
  this.bootstrapConfiguredIconSubset();
  this.prepareSmartChildScanEvents();
  this.usePreloader = this.checkForCache();
  this.urlHash = this.generatePageHash();
  this.setPreloaderParams();
  this.checkSmartCache();

  const stopPrepareObserver = () => {
    if (!this.prepareObserver) {
      return;
    }

    this.prepareObserver.disconnect();
    this.prepareObserver = null;
  };

  const bootstrapPrepare = () => {
    if (!this.prepareInit) {
      this.prepareInit = true;
      this.prepare();
    }

    stopPrepareObserver();
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    requestAnimationFrame(bootstrapPrepare);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(bootstrapPrepare);
    });
  } // Fallback: следим за появлением body и динамическими узлами


  this.prepareObserver = new MutationObserver(mutations => {
    if (this.prepareInit) {
      stopPrepareObserver();
      return;
    }

    if (document.body && !this.prepareInit) {
      this.prepareInit = true;
      this.prepare();
      stopPrepareObserver();
      return;
    }

    for (let o = 0; o < mutations.length; o++) {
      const change = mutations[o];
      if (change.target?.classList?.contains('skip')) continue;
      if (this.shouldSkipNode(change.target)) continue;

      switch (change.type) {
        case 'childList':
          for (let t = 0; t < change.addedNodes.length; t++) {
            const node = change.addedNodes[t];
            if (this.shouldSkipNode(node)) continue;
            this.findShortCodes(node);
          }

          break;

        default:
          break;
      }
    }
  });
  this.prepareObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: false,
    attributes: false
  });
  window.addEventListener('load', () => {
    this.searchEnd = true;
  });

  if (this.turboEnabled) {
    this.prepareTurboEvents();
  }

  this.logTiming('init observers attached');
  window.addEventListener('message', e => {
    if (e.data?.type === 'sf-embed-ready') {
      this.sendThemeToPlayground();
    }
  });
};

const props = {
  attr: 'sf-asset',
  delimiterURL: '/',
  standAlone: true,
  frameworkPath: '/simai/asset/simai.framework/sf5.master/',
  pathComponent: '/simai/asset/simai.framework/sf5.master/component/',
  isLoadPluginCookie: false,
  preloader: {
    width: 66,
    height: 100
  },
  requiredPlugins: ['modal'],
  disableSmart: false,
  cacheVersion: window.SF_BOOT_CONFIG?.cacheVersion ?? (typeof __SF_CACHE_VERSION__ !== 'undefined' ? __SF_CACHE_VERSION__ : '') ?? '',
  pluginListVersion: window.SF_BOOT_CONFIG?.pluginListVersion ?? (typeof __SF_PLUGIN_LIST_VERSION__ !== 'undefined' ? __SF_PLUGIN_LIST_VERSION__ : '') ?? '',
  theme: window.SF_BOOT_CONFIG?.theme ?? true,
  smart: window.SF_BOOT_CONFIG?.smart || {},
  findPlugins: SF.RuleLoader,
  backgroundPreloader: 'var(--sf-color--surface-highest, var(--sf-surface-0, #fff))',
  modifierPreloader: 'loader-default',
  contentPreloaderText: 'LOADING'
};

if (window.sfPath) {
  props.url = window.sfPath;
}

if (window.sfSmartPath) {
  props.smartUrl = window.sfSmartPath;
}

function normalizeSmartTagName(name) {
  const normalized = String(name || '').trim().toLowerCase();

  if (!normalized) {
    return '';
  }

  return normalized.startsWith('sf-') ? normalized : `sf-${normalized}`;
}

function normalizeWhenDefinedInput(input = []) {
  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === 'string') {
    return [input];
  }

  return Array.from(arguments).filter(Boolean);
}

function whenSmartDefined() {
  const tags = normalizeWhenDefinedInput.apply(null, arguments).map(normalizeSmartTagName).filter(Boolean);

  if (!tags.length) {
    return Promise.resolve([]);
  }

  if (!window.customElements?.whenDefined) {
    return Promise.resolve(tags);
  }

  return Promise.all(tags.map(tag => window.customElements.whenDefined(tag))).then(() => tags);
}

function toAttributeName(key) {
  if (key === 'className') {
    return 'class';
  }

  return String(key || '').replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function toCssPropertyName(key) {
  const normalized = String(key || '').trim();
  if (!normalized) return '';
  if (normalized.startsWith('--')) return normalized;
  return normalized.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function styleObjectToString(style = {}) {
  return Object.entries(style).filter(([, value]) => value !== false && value !== null && typeof value !== 'undefined').map(([key, value]) => {
    const cssKey = toCssPropertyName(key);
    if (!cssKey) return '';
    return `${cssKey}: ${String(value)}`;
  }).filter(Boolean).join('; ');
}

const createEventAliases = {
  onModalReady: 'modal:ready',
  onModalUpdate: 'modal:update',
  onBeforeOpen: 'modal:before-open',
  onAfterOpen: 'modal:after-open',
  onBeforeClose: 'modal:before-close',
  onAfterClose: 'modal:after-close',
  onBeforeHide: 'modal:before-hide',
  onAfterHide: 'modal:after-hide',
  onBeforeShow: 'modal:before-show',
  onAfterShow: 'modal:after-show',
  onOpen: 'modal:after-open',
  onClose: 'modal:after-close',
  onHide: 'modal:after-hide',
  onShow: 'modal:after-show'
};

function toEventName(key) {
  const normalized = String(key || '').trim();

  if (createEventAliases[normalized]) {
    return createEventAliases[normalized];
  }

  if (!/^on[A-Z]/.test(normalized)) {
    return '';
  }

  return normalized.slice(2).replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^a-z0-9:-]/gi, '').toLowerCase();
}

function applyCreateAttribute(element, key, value) {
  if (typeof value === 'function') {
    const eventName = toEventName(key);

    if (eventName) {
      element.addEventListener(eventName, value);

      if (!element.__sfCreateEventHandlers) {
        Object.defineProperty(element, '__sfCreateEventHandlers', {
          configurable: true,
          enumerable: false,
          value: []
        });
      }

      element.__sfCreateEventHandlers.push({
        eventName,
        handler: value
      });

      return;
    }
  }

  const attr = toAttributeName(key);

  if (!attr) {
    return;
  }

  if (value === false || value === null || typeof value === 'undefined') {
    element.removeAttribute(attr);
    return;
  }

  if (value === true) {
    element.setAttribute(attr, '');
    return;
  }

  if ((attr === 'style' || attr.endsWith('-style')) && value && typeof value === 'object' && !Array.isArray(value)) {
    const style = styleObjectToString(value);

    if (style) {
      element.setAttribute(attr, style);
    } else {
      element.removeAttribute(attr);
    }

    return;
  }

  if (Array.isArray(value)) {
    element.setAttribute(attr, value.filter(item => item !== null && typeof item !== 'undefined').join(' '));
    return;
  }

  element.setAttribute(attr, String(value));
}

function appendCreateChildren(element, children) {
  const normalizedChildren = Array.isArray(children) ? children.flat(Infinity) : [children];
  normalizedChildren.filter(child => child !== null && typeof child !== 'undefined' && child !== false).forEach(child => {
    if (child instanceof Node) {
      element.append(child);
      return;
    }

    element.append(document.createTextNode(String(child)));
  });
}

function createSmartElement(name, params = {}) {
  const tagName = normalizeSmartTagName(name);

  if (!tagName) {
    throw new Error('SF.create(name, params): name is required');
  }

  const element = document.createElement(tagName);
  const nextParams = params && typeof params === 'object' ? params : {};
  const {
    attrs,
    attributes,
    dataset,
    children,
    html,
    textContent,
    ...rest
  } = nextParams;
  [rest, attrs, attributes].forEach(source => {
    if (!source || typeof source !== 'object') {
      return;
    }

    Object.entries(source).forEach(([key, value]) => {
      applyCreateAttribute(element, key, value);
    });
  });

  if (dataset && typeof dataset === 'object') {
    Object.entries(dataset).forEach(([key, value]) => {
      const dataKey = toAttributeName(key);

      if (!dataKey || value === null || typeof value === 'undefined') {
        return;
      }

      element.setAttribute(`data-${dataKey}`, String(value));
    });
  }

  if (typeof html === 'string') {
    element.innerHTML = html;
  } else if (typeof textContent !== 'undefined' && textContent !== null) {
    element.textContent = String(textContent);
  }

  if (typeof children !== 'undefined') {
    appendCreateChildren(element, children);
  }

  return element;
}

SFLoaderPlugin.prototype.ensureSmartElementLoaded = function (tagName) {
  const normalizedTag = String(tagName || '').trim().toLowerCase();

  if (!normalizedTag.startsWith('sf-')) {
    return false;
  }

  const tagRules = this.getCustomElementRules();
  const componentName = tagRules[normalizedTag];

  if (!componentName) {
    console.warn(`SFLoader: smart tag rule not found for ${normalizedTag}`);
    return false;
  }

  if (this.module[componentName]) {
    return true;
  }

  this.setExistCookie(componentName);
  this.mutate(() => this.getLoader(this.module, true));
  return true;
};

async function createSmartElementAsync(name, params = {}) {
  const element = createSmartElement(name, params);
  const tagName = element.tagName.toLowerCase();

  if (window.SF?.Loader?.ensureSmartElementLoaded) {
    window.SF.Loader.ensureSmartElementLoaded(tagName);
  }

  if (window.customElements?.whenDefined) {
    await window.customElements.whenDefined(tagName);
  }

  window.customElements?.upgrade?.(element);
  return element;
}

SF.Loader = new SFLoaderPlugin(props);
SF.smartBaseReady = SF.Loader.smartBaseReady || Promise.resolve(SF.smart || null);

SF.loadSmartBase = function loadSmartBase() {
  return SF.Loader.loadSmartBase();
};

SF.create = createSmartElement;
SF.createAsync = createSmartElementAsync;

SF.litHtml = (tagName, props = {}) => {
  if (!/^sf-[a-z0-9-]+$/.test(tagName)) {
    tagName = `sf-${tagName}`;

    if (!/^sf-[a-z0-9-]+$/.test(tagName)) {
      throw new Error(`Invalid SF tag name: ${tagName}`);
    }
  }

  const tag = (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_5__.unsafeStatic)(tagName);
  return (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_5__.html)`<${tag} ...=${props}></${tag}>`;
};

SF.whenDefine = whenSmartDefined;
SF.whenDefined = whenSmartDefined;

try {
  window.dispatchEvent(new CustomEvent('sf-loader-init', {
    detail: {
      loader: SF.Loader,
      timestamp: Date.now()
    }
  }));
} catch (e) {
  console.warn('sf-loader-init dispatch failed', e);
}

if (Array.isArray(window.SF_PENDING_COMPONENTS)) {
  while (window.SF_PENDING_COMPONENTS.length) {
    const [n, c] = window.SF_PENDING_COMPONENTS.shift() || [];
    if (!n || !c) continue;
    if (SF.Loader.ComponentRegistry[n]) continue;

    try {
      SF.Loader.registerComponent(n, c);
    } catch (err) {
      console.warn('pending component register failed', n, err);
    }
  }
}

/***/ },

/***/ "3f02a73d71b2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertTailwindClassToken: () => (/* binding */ convertTailwindClassToken),
/* harmony export */   convertTailwindClasses: () => (/* binding */ convertTailwindClasses),
/* harmony export */   mapTailwindBaseClass: () => (/* binding */ mapTailwindBaseClass)
/* harmony export */ });
function mapTailwindBaseClass(className) {
  if (!className) return null;
  const TAILWIND_COLOR_MAP = {
    gray: {
      50: '0',
      100: '1',
      200: '2',
      300: '3',
      400: '4',
      500: '5',
      600: '7',
      700: '7',
      800: '9',
      900: '9',
      950: '9'
    },
    red: {
      50: '0',
      100: '1',
      200: '1',
      300: '2',
      400: '3',
      500: '4',
      600: '6',
      700: '7',
      800: '8',
      900: '9',
      950: '9'
    },
    blue: {
      50: '0',
      100: '1',
      200: '2',
      300: '3',
      400: '3',
      500: '4',
      600: '5',
      700: '5',
      800: '7',
      900: '7',
      950: '9'
    },
    green: {
      50: '0',
      100: '1',
      200: '2',
      300: '3',
      400: '4',
      500: '4',
      600: '5',
      700: '6',
      800: '7',
      900: '8',
      950: '9'
    },
    yellow: {
      50: '0',
      100: '2',
      200: '3',
      300: '5',
      400: '6',
      500: '7',
      600: '8',
      700: '8',
      800: '9',
      900: '9',
      950: '9'
    },
    orange: {
      50: '0',
      100: '1',
      200: '2',
      300: '3',
      400: '4',
      500: '5',
      600: '6',
      700: '8',
      800: '9',
      900: '9',
      950: '9'
    },
    purple: {
      50: '0',
      100: '0',
      200: '1',
      300: '2',
      400: '3',
      500: '4',
      600: '4',
      700: '5',
      800: '6',
      900: '7',
      950: '8'
    },
    pink: {
      50: '0',
      100: '0',
      200: '1',
      300: '2',
      400: '4',
      500: '5',
      600: '6',
      700: '8',
      800: '8',
      900: '9',
      950: '9'
    }
  };
  const directMap = {
    'text-left': 'text-start',
    'text-right': 'text-end',
    'float-left': 'float-inline-start',
    'float-right': 'float-inline-end',
    'clear-left': 'clear-inline-start',
    'clear-right': 'clear-inline-end',
    'font-thin': 'weight-1',
    'font-extralight': 'weight-2',
    'font-light': 'weight-3',
    'font-normal': 'regular',
    'font-medium': 'weight-5',
    'font-semibold': 'weight-6',
    'font-bold': 'bold',
    'font-extrabold': 'weight-8',
    'font-black': 'weight-9',
    'font-sans': 'sans',
    'font-serif': 'serif',
    'font-mono': 'mono',
    'flex-column': 'flex-col',
    'flex-center': 'center-center',
    't-left': 'text-start',
    't-right': 'text-end',
    'pointer-events-none': 'pointer-event-none',
    'pointer-events-auto': 'pointer-event-auto',
    'not-italic': 'italic-none',
    'normal-case': 'normalcase',
    'no-underline': 'decoration-none',
    'text-ellipsis': 't-ellipsis',
    'text-clip': 't-clip',
    'bg-no-repeat': 'bg-repeat-none',
    'whitespace-nowrap': 'wrap-none',
    'whitespace-pre': 'pre',
    'whitespace-pre-line': 'pre-line',
    'whitespace-pre-wrap': 'pre-wrap',
    contents: 'content'
  };
  if (directMap[className]) return directMap[className];
  const negative = className.startsWith('-') ? '-' : '';
  const base = negative ? className.slice(1) : className;
  const tailwindColorMatch = base.match(/^(bg|text|border)-(gray|red|blue|green|yellow|orange|purple|pink)-(50|100|200|300|400|500|600|700|800|900|950)$/);

  if (tailwindColorMatch) {
    const [, prefix, color, shade] = tailwindColorMatch;
    const mappedShade = TAILWIND_COLOR_MAP[color]?.[shade];
    if (!mappedShade) return null;
    const mappedPrefix = prefix === 'text' ? 'color' : prefix;
    return `${mappedPrefix}-${color}-${mappedShade}`;
  }

  const tailwindMonoMatch = base.match(/^(bg|text|border)-(white|black)$/);

  if (tailwindMonoMatch) {
    const [, prefix, color] = tailwindMonoMatch;
    const mappedPrefix = prefix === 'text' ? 'color' : prefix;
    return `${mappedPrefix}-${color}`;
  }

  const sideMap = {
    mt: 'm-top',
    mr: 'm-inline-end',
    mb: 'm-bottom',
    ml: 'm-inline-start',
    pt: 'p-top',
    pr: 'p-inline-end',
    pb: 'p-bottom',
    pl: 'p-inline-start'
  };
  const sideMatch = base.match(/^(m[trbl]|p[trbl])-(.+)$/);

  if (sideMatch) {
    const [, sideKey, value] = sideMatch;
    if (negative && sideKey[0] === 'p') return null;
    return `${negative}${sideMap[sideKey]}-${value}`;
  }

  const legacySideMatch = base.match(/^(m|p)-(left|right)-(.+)$/);

  if (legacySideMatch) {
    const [, mp, side, value] = legacySideMatch;
    if (negative && mp === 'p') return null;
    const mappedSide = side === 'left' ? 'inline-start' : 'inline-end';
    return `${negative}${mp}-${mappedSide}-${value}`;
  }

  const borderSideMatch = base.match(/^border-(l|r)-(.+)$/);

  if (borderSideMatch) {
    const side = borderSideMatch[1] === 'l' ? 'inline-start' : 'inline-end';
    return `border-${side}-${borderSideMatch[2]}`;
  }

  const borderSideLegacyMatch = base.match(/^border-(left|right)-(.+)$/);

  if (borderSideLegacyMatch) {
    const side = borderSideLegacyMatch[1] === 'left' ? 'inline-start' : 'inline-end';
    return `border-${side}-${borderSideLegacyMatch[2]}`;
  }

  const gridColsMatch = base.match(/^grid-cols-(.+)$/);

  if (gridColsMatch) {
    return `grid-col-${gridColsMatch[1]}`;
  }

  if (base === 'w-100') return 'w-full';
  if (base === 'h-100') return 'h-full';
  const opacityMatch = base.match(/^opacity-(\d{2,3})$/);

  if (opacityMatch) {
    const value = parseInt(opacityMatch[1], 10);
    if (value === 100) return 'opacity-full';
    if (value === 0) return 'opacity-0';

    if (value % 10 === 0 && value >= 10 && value <= 90) {
      return `opacity-${Math.round(value / 10)}`;
    }
  }

  const zMatch = base.match(/^z-(\d{2,3})$/);

  if (zMatch) {
    const value = parseInt(zMatch[1], 10);
    if (value === 0) return `${negative}z-0`;

    if (value % 10 === 0 && value >= 10 && value <= 90) {
      return `${negative}z-${Math.round(value / 10)}`;
    }
  }

  const bgOriginMatch = base.match(/^bg-origin-(border|padding|content)$/);

  if (bgOriginMatch) {
    return `bg-origin-${bgOriginMatch[1]}`;
  }

  const bgClipMatch = base.match(/^bg-clip-(border|padding|content|text)$/);

  if (bgClipMatch) {
    return `bg-clip-${bgClipMatch[1]}`;
  }

  const leadingMatch = base.match(/^leading-(tight|snug|relaxed|loose|none|normal)$/);

  if (leadingMatch) {
    return `line-${leadingMatch[1]}`;
  }

  const alignItemsMatch = base.match(/^items-(start|end|center|baseline|stretch)$/);

  if (alignItemsMatch) {
    return `items-cross-${alignItemsMatch[1]}`;
  }

  const verticalAlignMatch = base.match(/^align-(baseline|top|middle|bottom|sub|super|text-top|text-bottom)$/);

  if (verticalAlignMatch) {
    const align = verticalAlignMatch[1];
    if (align === 'super') return 'text-sup';
    if (align === 'text-top') return 'text-top';
    if (align === 'text-bottom') return 'text-bottom';
    return `text-${align}`;
  }

  const justifyContentMatch = base.match(/^justify-(start|end|center|between|around|evenly)$/);

  if (justifyContentMatch) {
    return `content-main-${justifyContentMatch[1]}`;
  }

  const justifyItemsMatch = base.match(/^justify-items-(start|end|center|stretch)$/);

  if (justifyItemsMatch) {
    return `items-main-${justifyItemsMatch[1]}`;
  }

  const justifySelfMatch = base.match(/^justify-self-(auto|start|end|center|stretch)$/);

  if (justifySelfMatch) {
    return `self-main-${justifySelfMatch[1]}`;
  }

  const alignSelfMatch = base.match(/^self-(auto|start|end|center|stretch|baseline)$/);

  if (alignSelfMatch) {
    return `self-cross-${alignSelfMatch[1]}`;
  }

  const placeItemsMatch = base.match(/^place-items-(start|end|center|stretch)$/);

  if (placeItemsMatch) {
    return `items-${placeItemsMatch[1]}`;
  }

  const placeSelfMatch = base.match(/^place-self-(auto|start|end|center|stretch)$/);

  if (placeSelfMatch) {
    return `self-${placeSelfMatch[1]}`;
  }

  const placeContentMatch = base.match(/^place-content-(start|end|center|between|around|evenly|stretch)$/);

  if (placeContentMatch) {
    return `content-${placeContentMatch[1]}`;
  }

  if (base.startsWith('content-') && !base.includes('[')) {
    const contentMatch = base.match(/^content-(start|end|center|between|around|evenly|stretch)$/);

    if (contentMatch) {
      return `content-cross-${contentMatch[1]}`;
    }
  }

  const bgPositionMatch = base.match(/^bg-(left|right)(?:-(top|bottom|center))?$/);

  if (bgPositionMatch) {
    const side = bgPositionMatch[1] === 'left' ? 'inline-start' : 'inline-end';
    const pos = bgPositionMatch[2] ? `-${bgPositionMatch[2]}` : '';
    return `bg-${side}${pos}`;
  }

  const objectPositionMatch = base.match(/^object-(left|right)(?:-(top|bottom|center))?$/);

  if (objectPositionMatch) {
    const side = objectPositionMatch[1] === 'left' ? 'inline-start' : 'inline-end';
    const pos = objectPositionMatch[2] ? `-${objectPositionMatch[2]}` : '';
    return `object-${side}${pos}`;
  }

  const maskPositionMatch = base.match(/^mask-(left|right)(?:-(top|bottom))?$/);

  if (maskPositionMatch) {
    const side = maskPositionMatch[1] === 'left' ? 'inline-start' : 'inline-end';
    const pos = maskPositionMatch[2] ? `-${maskPositionMatch[2]}` : '';
    return `mask-${side}${pos}`;
  }

  const originMatch = base.match(/^origin-(left|right|top|bottom|center)(?:-(left|right))?$/);

  if (originMatch) {
    const [first, second] = originMatch.slice(1);
    if (first === 'left') return 'origin-inline-start';
    if (first === 'right') return 'origin-inline-end';
    if (second === 'left') return `origin-${first}-inline-start`;
    if (second === 'right') return `origin-${first}-inline-end`;
  }

  const positionMatch = base.match(/^(left|right)-(.+)$/);

  if (positionMatch) {
    const side = positionMatch[1] === 'left' ? 'inline-start' : 'inline-end';
    return `${side}-${positionMatch[2]}`;
  }

  return null;
}
function convertTailwindClassToken(token) {
  if (!token) return token;
  const parts = token.split(':');
  const base = parts.pop();
  const variants = parts;

  if (variants.length === 1 && (variants[0] === 'before' || variants[0] === 'after')) {
    const contentMatch = base.match(/^content-(none|empty)$/);

    if (contentMatch) {
      return `${variants[0]}-${contentMatch[1]}`;
    }
  }

  const mapped = mapTailwindBaseClass(base);
  if (!mapped) return token;
  parts.push(mapped);
  return parts.join(':');
}
function convertTailwindClasses(value) {
  if (!value || typeof value !== 'string') return value;
  const tokens = value.split(/\s+/).filter(Boolean);
  let changed = false;
  const nextTokens = tokens.map(token => {
    const next = convertTailwindClassToken(token);
    if (next !== token) changed = true;
    return next;
  });
  return changed ? nextTokens.join(' ') : value;
}

/***/ }

}]);