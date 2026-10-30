"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[66700837013363],{

/***/ "d0f4f6f9dbe0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decodeCacheValue: () => (/* binding */ decodeCacheValue),
/* harmony export */   encodeCacheValue: () => (/* binding */ encodeCacheValue)
/* harmony export */ });
const FORMAT_PREFIX = 'sf-json-v1:';
function encodeCacheValue(value) {
  return `${FORMAT_PREFIX}${String(value ?? '')}`;
}
function decodeCacheValue(value) {
  if (typeof value !== 'string') return 'null';
  if (value.startsWith(FORMAT_PREFIX)) return value.slice(FORMAT_PREFIX.length); // Values written before the pure-JavaScript cache format cannot be decoded
  // without the retired compression library. Ignore them and rebuild cache.

  const trimmed = value.trim();
  if (/^(?:\{|\[|"|null|true|false|-?\d)/.test(trimmed)) return value;
  return 'null';
}

/***/ },

/***/ "09d27e26e137"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initIconSubsetState: () => (/* binding */ initIconSubsetState),
/* harmony export */   installIconSubsetRuntime: () => (/* binding */ installIconSubsetRuntime),
/* harmony export */   normalizeIconFontLoadWeight: () => (/* binding */ normalizeIconFontLoadWeight)
/* harmony export */ });
/* harmony import */ var _page_storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cda569e6042b");

function initIconSubsetState(loader) {
  loader.iconFontReady = false;
  loader.iconSubsetPending = false;
  loader.loadedIcons = new Set();
  loader.iconDescriptorStates = new Map();
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
  loader.pendingIconFlushQueued = false;
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

  const iconWeightClassMap = new Map([["sf-icon--weight-thin", "100"], ["sf-icon-thin", "100"], ["sf-icon--weight-extra-light", "200"], ["sf-icon-extra-light", "200"], ["sf-icon--weight-light", "300"], ["sf-icon-light", "300"], ["sf-icon--weight-regular", "400"], ["sf-icon-regular", "400"], ["sf-icon--weight-medium", "500"], ["sf-icon-medium", "500"], ["sf-icon--weight-semi-bold", "600"], ["sf-icon-semi-bold", "600"], ["sf-icon--weight-bold", "700"], ["sf-icon-bold", "700"]]);
  const defaultIconWeight = "400";
  const iconTypeClassMap = new Map([["sf-icon--rounded", "rounded"], ["sf-icon-rounded", "rounded"], ["sf-icon--sharp", "sharp"], ["sf-icon-shape", "sharp"]]);
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
  }; // The core runtime sets data-sf-icons="subset-pending" so icons wait in the
  // subset family instead of fetching the full font; lifted here once a font
  // that draws them -- the subset or the full-font fallback -- is in place.


  SFLoaderPlugin.prototype.liftIconSubsetPending = function () {
    const root = document.documentElement;

    if (root?.getAttribute("data-sf-icons") === "subset-pending") {
      root.removeAttribute("data-sf-icons");
    }
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
  }; // With the subset disabled the icons stylesheet draws from the full local
  // font, and nothing ever marked an icon loaded: every readiness signal came
  // from the subset path, so `.sf-icon:not(.sf-icon-loaded)` kept each icon at
  // font-size 0 while the font sat loaded (ui-chat, 2026-10-22). An icon is
  // loaded once the family it is drawn in is ready -- the same promise the
  // subset path keeps, so the ligature text still never flashes.


  const localIconFontFamilies = Object.freeze({
    outlined: "Material Symbols Outlined",
    rounded: "Material Symbols Rounded",
    sharp: "Material Symbols Sharp"
  });

  SFLoaderPlugin.prototype.getLocalIconFontFaces = function (type = "") {
    const family = localIconFontFamilies[this.normalizeIconType(type)] || localIconFontFamilies.outlined;
    const faces = [];
    document.fonts?.forEach?.(face => {
      if (String(face.family || "").replace(/["']/g, "").trim() === family) {
        faces.push(face);
      }
    });
    return faces;
  }; // Ready means a face of the family is declared and has loaded (or failed,
  // which settles it too). A family that is not declared yet is not ready:
  // the icons stylesheet arrives after the first scan, and asking the browser
  // before it does answered «nothing to load» -- the ligature text then drew in
  // a system font until the face arrived.


  SFLoaderPlugin.prototype.isLocalIconFontReady = function (type = "") {
    const normalizedType = this.normalizeIconType(type);
    if (!this.localIconFontsReady) this.localIconFontsReady = new Set();
    if (this.localIconFontsReady.has(normalizedType)) return true;
    if (!document.fonts?.forEach) return true;
    const settled = this.getLocalIconFontFaces(normalizedType).some(face => face.status === "loaded" || face.status === "error");

    if (settled) {
      this.localIconFontsReady.add(normalizedType);
      return true;
    }

    this.waitForLocalIconFont(normalizedType);
    return false;
  };

  SFLoaderPlugin.prototype.waitForLocalIconFont = function (type = "") {
    const normalizedType = this.normalizeIconType(type);
    if (!this.localIconFontWaits) this.localIconFontWaits = new Map();

    if (this.localIconFontWaits.has(normalizedType)) {
      return this.localIconFontWaits.get(normalizedType);
    }

    const fonts = document.fonts;
    const wait = new Promise(resolve => {
      let done = false;
      let poll = 0;
      let timer = 0;

      const finish = () => {
        if (done) return;
        done = true;
        clearInterval(poll);
        clearTimeout(timer);
        fonts.removeEventListener?.("loadingdone", check);
        fonts.removeEventListener?.("loadingerror", check);
        resolve();
      };

      const check = () => {
        const faces = this.getLocalIconFontFaces(normalizedType);

        if (faces.some(face => face.status === "loaded" || face.status === "error")) {
          finish();
          return;
        } // An icon at font-size 0 may not make the browser fetch the face, so
        // the face is asked for as soon as a stylesheet declares it.


        faces.forEach(face => {
          if (face.status === "unloaded") face.load().then(check, check);
        });
      };

      fonts.addEventListener?.("loadingdone", check);
      fonts.addEventListener?.("loadingerror", check); // A stylesheet that declares the face sends no font event; look for it.

      poll = setInterval(check, 50); // A family no stylesheet ever declares (a rounded or sharp icon with no
      // fallback face) still settles, the way subset-pending lifts on its
      // timer: the icon then shows as it would with no Framework at all,
      // instead of staying zero-sized for good.

      timer = setTimeout(finish, 6000);
      check();
    }).then(() => {
      this.localIconFontsReady.add(normalizedType);
      this.iconFontReady = true;
      document.body?.classList?.add("sf-icons-loaded");
      this.syncStaticIconLoadedState();
      window.dispatchEvent(new CustomEvent("sf-icons-subset:ready", {
        detail: {
          icons: new Set(),
          all: true,
          local: true,
          types: [normalizedType],
          loader: this
        }
      }));
      return true;
    });
    this.localIconFontWaits.set(normalizedType, wait);
    return wait;
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
    const opticalSizes = new Set(normalizeConfigList(rawConfig.optical_size ?? rawConfig.opticalSize ?? rawConfig.opsz).map(item => String(item).trim()));
    const defaultType = this.normalizeIconType(rawConfig.type || this.getDefaultIconType());
    const types = new Set(normalizeConfigList(rawConfig.type || defaultType).map(item => this.normalizeIconType(item)));
    return {
      icons,
      weights,
      fills,
      grades,
      opticalSizes,
      types,
      fill: fills.size > 0,
      grade: grades.size ? [...grades].join(",") : "",
      opticalSize: opticalSizes.size ? [...opticalSizes].join(",") : "",
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

      if (config.opticalSizes.size) {
        iconAttrs.set("optical-size", new Set(config.opticalSizes));
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

    if (attrs.grade && !this.manifestAxisIncludesValue(manifest, "GRAD", attrs.grade)) {
      return false;
    }

    if (attrs["optical-size"] && !this.manifestAxisIncludesValue(manifest, "opsz", attrs["optical-size"])) {
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

    if ([...config.opticalSizes].some(size => !this.manifestAxisIncludesValue(manifest, "opsz", size))) {
      return false;
    }

    return true;
  };

  SFLoaderPlugin.prototype.trackIconDescriptor = function (icon = "", attrs = {}) {
    if (!this.isIconSubsetEnabled()) return 0;
    if (this.hasConfiguredIconSubset()) return 0;
    const normalizedIcon = String(icon || "").trim();
    if (!normalizedIcon) return 0;
    const loadAttrs = this.getIconLoadAttrs(attrs);
    const descriptorKey = this.getLoadedIconDescriptorKey(normalizedIcon, loadAttrs);

    if (!this.iconDescriptorStates) {
      this.iconDescriptorStates = new Map();
    }

    const knownDescriptor = this.iconDescriptorStates.get(descriptorKey);

    if (knownDescriptor || this.loadedIcons.has(descriptorKey) || this.isIconCoveredByManifest(normalizedIcon, loadAttrs)) {
      return 0;
    }

    this.iconDescriptorStates.set(descriptorKey, {
      attrs: loadAttrs,
      icon: normalizedIcon,
      loading: false
    });
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
  }; // Icons a page knows it will draw before it draws them: the ones that come
  // with data, after the first request has gone. Each request returns one
  // whole accumulated font, so an icon found late costs a second font; one
  // declared here goes in the first request, tracked exactly as a scanned one
  // so the scan that finds it later sees it already asked for. Entries are
  // names or {icon, weight, filled, grade, opticalSize, type}.


  const normalizeIconPreloadEntries = value => normalizeConfigList(value).map(entry => {
    if (typeof entry === "string") {
      return {
        icon: entry.trim(),
        attrs: {}
      };
    }

    if (!entry || typeof entry !== "object") return null;
    return {
      icon: String(entry.icon || entry.name || "").trim(),
      attrs: {
        weight: entry.weight,
        filled: isTruthyIconFlag(entry.filled ?? entry.fill) ? "1" : undefined,
        grade: entry.grade,
        "optical-size": entry.opticalSize ?? entry["optical-size"],
        type: entry.type
      }
    };
  }).filter(entry => entry?.icon);

  SFLoaderPlugin.prototype.trackIconPreload = function (entries = []) {
    let added = 0;
    normalizeIconPreloadEntries(entries).forEach(({
      icon,
      attrs
    }) => {
      added += this.trackIconDescriptor(icon, { ...attrs,
        weight: attrs.weight ?? defaultIconWeight,
        type: this.normalizeIconType(attrs.type || this.getDefaultIconType())
      });
    });
    return added;
  };

  SFLoaderPlugin.prototype.preloadIcons = function (entries = []) {
    if (!this.isIconSubsetEnabled()) return 0;
    const added = this.trackIconPreload(entries);

    if (added) {
      this.pendingIconScanCount += added;
      this.flushPendingIconScan();
    }

    return added;
  };

  SFLoaderPlugin.prototype.preloadConfiguredIcons = function () {
    if (this.iconPreloadApplied) return 0;
    this.iconPreloadApplied = true;
    return this.trackIconPreload(window.SF_BOOT_CONFIG?.icons?.preload ?? window.SF_ICON_PRELOAD);
  };

  SFLoaderPlugin.prototype.getStaticIconDescriptorKey = function (icon = "", attrs = {}) {
    const normalizedAttrs = Object.entries(attrs).filter(([, value]) => value != null && value !== "").map(([key, value]) => [key, String(value).trim()]).sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify([String(icon || "").trim(), normalizedAttrs]);
  };

  SFLoaderPlugin.prototype.getIconLoadAttrs = function (attrs = {}) {
    const normalized = {};
    ["weight", "filled", "grade", "optical-size", "type"].forEach(key => {
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

    if (!this.isIconSubsetEnabled()) {
      return this.isLocalIconFontReady(loadAttrs.type);
    }

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
    ["weight", "size", "grade", "optical-size", "type"].forEach(attr => {
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

    attrs.type = this.normalizeIconType(attrs.type || this.getDefaultIconType());
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
    const isFilled = el.classList.contains("sf-icon--filled") || el.classList.contains("sf-icon-filled") || el.hasAttribute("data-filled") && isTruthyIconFlag(el.getAttribute("data-filled")) || el.hasAttribute("filled") && isTruthyIconFlag(el.getAttribute("filled")) || styleFill !== "" && isTruthyIconFlag(styleFill, false);

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
      const localIcon = this.getStaticIconElement(node);
      if (!localIcon) return {
        handled: false,
        iconCount: 0
      };
      this.syncStaticIconLoadedState(localIcon);
      return {
        handled: true,
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

    if (!this.isIconSubsetEnabled()) {
      // Ask for the default family now: an <sf-icon> drawn before this scan
      // waits on the ready event this wait sends.
      this.isLocalIconFontReady(this.getDefaultIconType());
      this.syncStaticIconLoadedState(host);
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
      // Deferred, not dropped. The caller defers when the same batch of
      // mutations also loads modules, so the fetch waits for them -- but the
      // count stayed pending and nothing flushed it afterwards, so a glyph that
      // appeared alongside a new component never arrived at all. Entering a mode
      // that draws both at once is exactly that: the handles, the eyes and the
      // arrows stayed blank squares until some later, unrelated mutation
      // happened to flush them, and usually none did.
      if (!this.pendingIconFlushQueued) {
        this.pendingIconFlushQueued = true;
        this.mutate(() => {
          this.pendingIconFlushQueued = false;
          this.flushPendingIconScan();
        });
      }

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
    const raw = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_0__["default"])().getItem(this.getIconManifestStorageKey(type));
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
      return ".sf-icon:is(.sf-icon--rounded, .sf-icon-rounded)";
    }

    if (type === "sharp") {
      return ".sf-icon:is(.sf-icon--sharp, .sf-icon-shape)";
    }

    return ".sf-icon:not(.sf-icon--rounded):not(.sf-icon-rounded):not(.sf-icon--sharp):not(.sf-icon-shape)";
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
    this.liftIconSubsetPending();
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
      this.liftIconSubsetPending();
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
        opticalSize: configured.opticalSize,
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
    const opticalSizes = new Set();
    const defaultType = this.getDefaultIconType();
    this.uniqueIcons.forEach(attrs => {
      const weight = attrs.get("weight");
      const filled = attrs.get("filled");
      const grade = attrs.get("grade");
      const opticalSize = attrs.get("optical-size");
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

        if (opticalSize instanceof Set || Array.isArray(opticalSize)) {
          opticalSize.forEach(item => opticalSizes.add(String(item)));
        } else if (opticalSize) {
          opticalSizes.add(String(opticalSize));
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

      if (opticalSize instanceof Set || Array.isArray(opticalSize)) {
        opticalSize.forEach(item => opticalSizes.add(String(item)));
      } else if (opticalSize) {
        opticalSizes.add(String(opticalSize));
      }
    });
    return {
      icons,
      weights,
      fill,
      grade: grades.size ? [...grades].join(",") : "",
      opticalSize: opticalSizes.size ? [...opticalSizes].join(",") : "",
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
          opticalSize: new Set(),
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
      const rawOpticalSizes = attrs.get("optical-size");
      const opticalSizes = rawOpticalSizes instanceof Set || Array.isArray(rawOpticalSizes) ? [...rawOpticalSizes] : rawOpticalSizes ? [rawOpticalSizes] : [];
      types.forEach(type => {
        const config = getConfig(type);
        config.icons.add(icon);
        weights.forEach(weight => config.weights.add(String(weight)));
        grades.forEach(grade => config.grade.add(String(grade)));
        opticalSizes.forEach(size => config.opticalSize.add(String(size)));

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
        String(baseConfig.opticalSize || "").split(",").filter(Boolean).forEach(size => config.opticalSize.add(size));
        config.fill = baseConfig.fill;
      });
    }

    return [...configs.values()].map(config => ({ ...config,
      grade: [...config.grade].sort().join(","),
      opticalSize: [...config.opticalSize].sort().join(","),
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

    if (requestConfig.opticalSize) {
      query.set("optical_size", requestConfig.opticalSize);
    }

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
      this.liftIconSubsetPending();
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));
      previous?.remove?.();
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
    } // The first request waits for the page's first ready. Sent with the first
    // icon scanned, it asked for one glyph; the page's other icons, scanned a
    // moment later, then waited for that font to arrive before they could be
    // asked for, and every request returns a whole font -- two fonts in a row
    // before the page showed its icons. A frame after ready, the elements have
    // drawn theirs and one request carries them all. A page that is slow to
    // become ready sends it on the timer.


    if (this.eventSend === false && !this.iconFirstRequestReleased) {
      if (!this.iconFirstRequestHeld) {
        this.iconFirstRequestHeld = new Promise(resolve => {
          let timer = 0;

          const release = () => {
            window.removeEventListener("sf-loader-ready", release);
            clearTimeout(timer);
            requestAnimationFrame(() => setTimeout(resolve, 0));
          };

          timer = setTimeout(release, 2500);
          window.addEventListener("sf-loader-ready", release);
        }).then(() => {
          this.iconFirstRequestReleased = true;
          this.iconFirstRequestHeld = null;
          return this.loadFonts();
        });
      }

      return this.iconFirstRequestHeld;
    }

    this.ensureConfiguredIconSubsetState();
    this.preloadConfiguredIcons();

    if (this.iconSubsetPending && this.iconSubsetPromise) {
      this.iconSubsetNeedsReload = true;
      return this.iconSubsetPromise;
    }

    const unloadedIcons = Array.from(this.uniqueIcons).filter(([, attrs]) => attrs.get("loading") === false);
    const unloadedDescriptors = Array.from(this.iconDescriptorStates || new Map()).filter(([, descriptor]) => descriptor.loading === false);

    if (!unloadedIcons.length && !unloadedDescriptors.length) {
      return this.iconSubsetPromise || false;
    }

    unloadedIcons.forEach(([, attrs]) => attrs.set("loading", true));
    unloadedDescriptors.forEach(([, descriptor]) => {
      descriptor.loading = true;
    });
    this.iconSubsetPending = true;
    this.iconSubsetReady = false;
    const requestConfigs = this.getIconSubsetRequestConfigs();
    this.iconSubsetPromise = Promise.all(requestConfigs.map(config => this.loadIconSubsetFamily(config))).then(results => {
      const loadedDescriptorKeys = new Set(this.loadedIcons);

      if (unloadedDescriptors.length) {
        unloadedDescriptors.forEach(([key]) => loadedDescriptorKeys.add(key));
      } else {
        unloadedIcons.forEach(([icon, attrs]) => {
          this.getLoadedDescriptorKeysForIconState(icon, attrs).forEach(key => loadedDescriptorKeys.add(key));
        });
      }

      this.loadedIcons = loadedDescriptorKeys;
      this.iconSubsetPending = false;
      this.iconSubsetReady = results.every(Boolean);
      window.dispatchEvent?.(new CustomEvent("sf-icons-subset:ready", {
        detail: {
          icons: new Set([...unloadedIcons.map(([icon]) => icon), ...unloadedDescriptors.map(([, descriptor]) => descriptor.icon)]),
          loader: this,
          types: requestConfigs.map(config => config.defaultType)
        }
      }));
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
/* harmony import */ var _cacheCodec__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d0f4f6f9dbe0");
/* harmony import */ var _stableHash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("af3c1d41479b");
/* harmony import */ var _page_storage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cda569e6042b");
/* harmony import */ var _tailwind_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("3f02a73d71b2");
/* harmony import */ var _contracts_utility_module_aliases_v1_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b3ed17287563");
/* harmony import */ var _contracts_smart_rule_forwards_v1_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("8a67fe9caf0a");
/* harmony import */ var _template_utilities_generated_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e7acc025fab1");
/* harmony import */ var _utilityModuleAliases__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("98e08d2c9eb6");
/* harmony import */ var _iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("09d27e26e137");
/* harmony import */ var _preloader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("6c7f357fe960");
/* harmony import */ var lit_static_html_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("ee5035470810");
/* harmony import */ var _pending_tags_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("3c79afd07eeb");












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
})(); // Made when it is sent: made once when this file ran, its timestamp was the
// moment the Loader was evaluated, not the moment the page was ready.


const createReadyEvent = () => new CustomEvent('sf-loader-ready', {
  detail: {
    message: 'All components loaded.',
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
} // Where Smart is served from. From release ui-6b4a0c3887d6 the `ui`
// distribution carries Smart in `distr/smart`, beside `distr/core`, so a page
// that names only `sfPath` gets `<sfPath>/smart` -- that is the layout, not a
// fallback. `sfSmartPath` stays for the pages that still serve the separate
// ui-smart repository from its own root. An empty value counts as not set: a
// lab writes `sfSmartPath = ''` and means the default, and an empty root would
// otherwise resolve every Smart file against the page's own directory.


function resolveSmartRoot(url, smartUrl) {
  const own = typeof smartUrl === 'string' ? smartUrl.trim() : '';
  return own || url;
} // Component packages: bundles of Smart components served from their own base
// and carrying their own rules (Larena's components are the first; standard
// simai.component-package). A page declares
// them in `SF_BOOT_CONFIG.packages`; docs/developer/component-packages.md has
// the contract. The name is also the prefix of the package's entries in the
// missing-file cache, so it is kept to characters that cannot collide with a
// rule name's own.


const PACKAGE_NAME = /^[a-z][a-z0-9-]*$/;
const PACKAGE_MISS_SEPARATOR = '::';

function normalisePackageUrl(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\/+$/, '');
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
  (0,_iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_8__.initIconSubsetState)(this);
  this.eventSend = false;
  this.uniqueIcons = new Map();
  this.pendingRegex = true;
  this.url = params.url ?? '/simai/asset/simai.framework/sf5.master';
  this.smartUrl = resolveSmartRoot(this.url, params.smartUrl);
  this.observeElements = [];
  this.module = {};
  this.phpScriptsLoaded = [];
  this.pluginListRelation = [];
  this.lastLoadHash = null;
  this.theme = 'light';
  this.themeEnabled = params.theme !== false;
  this.preloaderWrap = window.SF_BOOT_CONFIG.preloader?.wrap || null; // SIMAI Framework 5 resolves versioned static assets in the browser.
  // Keep the public flag for compatibility, but do not enable the retired
  // server-side PHP bundler when callers pass `standAlone: false`.

  this.standAlone = true;
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
  this.heavyModules = params.heavyModules || [];
  this.priorityModules = params.priorityModules || ['container', 'display', 'flex', 'grid', 'gap', 'column', 'width', 'height', 'aspect-ratio', 'element-position', 'element-position-ext', 'headers', 'theme', 'skeleton'];
  this.preloader = {
    color: (0,_preloader__WEBPACK_IMPORTED_MODULE_9__.getPreloaderColor)(),
    width: _preloader__WEBPACK_IMPORTED_MODULE_9__.DEFAULT_PRELOADER.width,
    height: _preloader__WEBPACK_IMPORTED_MODULE_9__.DEFAULT_PRELOADER.height
  };
  this.timingStart = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  this.turboEventsBound = false;
  this.smartChildScanEventsBound = false;
  this.totalLoadPlugin = 0;
  this.notFoundFiles = {};
  this.lazyRelations = new Set();
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
  this.findPlugins = params.findPlugins ? params.findPlugins : {}; // A Smart bundle's former name (a folder renamed by standard 1.3.8 §3, §21)
  // keeps loading the bundle until its remove_after: a rule with no element and
  // no assets of its own whose one relation is the new name. It lives here, not
  // in a rule.js, because the distribution's rule inventory counts every rule of
  // type smart as a Smart component (contracts/smart-rule-forwards.v1.json).
  // A relation that names a forward is taken as its target (setRelation), so
  // the element waits for the bundle itself, not for a rule with no assets.

  this.ruleForwards = {};
  Object.entries(_contracts_smart_rule_forwards_v1_json__WEBPACK_IMPORTED_MODULE_5__.forwards || {}).forEach(([name, forward]) => {
    if (!forward?.to || Object.hasOwn(this.findPlugins, name)) return;
    this.ruleForwards[name] = forward.to;
    this.findPlugins[name] = {
      tags: [],
      type: 'smart',
      mode: 'smart',
      js: false,
      css: false,
      relation: [{
        name: forward.to
      }]
    };
  });
  this.requiredPlugins = params.requiredPlugins ? params.requiredPlugins : [];
  this.isLoadPluginCookie = params.isLoadPluginCookie ? params.isLoadPluginCookie : false;
  this.contentPreloaderText = params.contentPreloaderText ? params.contentPreloaderText : 'LOADING';
  this.arrowInterval = null;
  this.contentPreloader = '';
  this.backgroundPreloader = params.backgroundPreloader ? params.backgroundPreloader : (0,_preloader__WEBPACK_IMPORTED_MODULE_9__.getPreloaderBackground)();
  this.tempLoaderStyles = 'inset: 0;position: fixed;width: 100%;height: 100vh;opacity: 1;z-index: 1000;background-color: var(--sf-color--surface-highest, var(--sf-surface-0, #fff));text-align: center;';
  this.modifierPreloader = params.modifierPreloader ? params.modifierPreloader : 'loader-default';
  this.isDebug = false; // Minified bundles unless someone is debugging: every bundle ships
  // <name>.min.js and <name>.min.css beside the readable files, at about 40 %
  // of the size, and the Loader used to fetch the readable ones on every page
  // (measured on the admin: 7 MB of script where 3 would do). A page asks for
  // the readable files with SF_BOOT_CONFIG.minified = false, ?sf-debug in its
  // address, or data-sf-debug on <html>.

  this.minified = resolveMinified(params);
  this.profileLoader = params.profileLoader ?? window.SF_BOOT_CONFIG?.profileLoader ?? this.isDebug;
  this.profileThreshold = params.profileThreshold ?? window.SF_BOOT_CONFIG?.profileThreshold ?? 2;
  this.usePreloader = true;
  this.debugStr = {
    initLoader: 'SFLoaderPlugin: script is run',
    requiredPluginsNotEmpty: 'SFLoaderPlugin: the required plugins parameter is not empty',
    regexpPlugins: 'SFLoaderPlugin: findPlugins list ',
    isExistFileOnreadystatechange: 'SFLoaderPlugin: checking that the plugin files exist',
    isExistFilestatus200: 'SFLoaderPlugin: status 200',
    isExistFilestatusNo200: 'SFLoaderPlugin: status is not 200',
    isExistFileReadyStateNo4: 'SFLoaderPlugin: Ready State no 4',
    searchRegexpRun: 'SFLoaderPlugin: searchRegexp is run'
  };
  this.plugin = {};
  this.searchEnd = false;
  this.packages = Object.create(null);
  this.packageWarnings = new Set();
  this.installPackageApi();
  this.declarePackages({ ...(window.SF_BOOT_CONFIG?.packages || {}),
    ...(params.packages || {})
  }); // A declared package's rules are fetched before the first scan, so its tags
  // are known when the page is first read and a cached plugin list never names
  // a rule that has not arrived yet. A page without packages starts exactly as
  // before, synchronously.

  const packageRulesReady = this.loadDeclaredPackageRules();

  const start = () => packageRulesReady ? packageRulesReady.then(() => this.init()) : this.init();

  if (this.smart.base === true) {
    this.smartBaseReady = this.loadSmartBase().finally(start);
  } else {
    // Settles when the base arrives, however it arrives: SF.loadSmartBase() or
    // the first Smart bundle. It used to resolve at once with null, so
    // `await SF.smartBaseReady` waited for nothing (documentation trial).
    this.smartBaseReady = window.SF?.smart?.SfBaseElement ? Promise.resolve(window.SF.smart) : new Promise(resolve => {
      window.addEventListener('sf-smart-base-ready', () => resolve(window.SF?.smart || null), {
        once: true
      });
    });
    start();
  }
}

SFLoaderPlugin.prototype.installPackageApi = function () {
  const rules = this.findPlugins;
  if (!rules || typeof rules !== 'object') return; // Not enumerable: everything that reads the rule map walks its entries, and
  // a function among them would be read as a rule.

  Object.defineProperty(rules, 'registerPackage', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: (name, options) => this.registerPackage(name, options)
  });
};

SFLoaderPlugin.prototype.warnPackage = function (key, message) {
  if (this.packageWarnings.has(key)) return;
  this.packageWarnings.add(key);
  console.warn(`SFLoader: ${message}`);
};

SFLoaderPlugin.prototype.declarePackages = function (declared) {
  Object.entries(declared || {}).forEach(([name, config]) => {
    if (!PACKAGE_NAME.test(name)) {
      this.warnPackage(`name:${name}`, `"${name}" in SF_BOOT_CONFIG.packages is not a package name ` + '(lower-case letters, digits and hyphens); it is ignored');
      return;
    }

    const base = normalisePackageUrl(config?.base);

    if (!base) {
      this.warnPackage(`base:${name}`, `package "${name}" is declared without a base, so none of its ` + 'components can load; set SF_BOOT_CONFIG.packages.' + `${name}.base to the directory holding its component folders`);
    }

    this.packages[name] = {
      name,
      base,
      rule: normalisePackageUrl(config?.rule) || (base ? `${base}/rule.js` : ''),
      declared: true,
      registered: false
    };
  });
};

SFLoaderPlugin.prototype.loadDeclaredPackageRules = function () {
  const loads = Object.values(this.packages).filter(pkg => pkg.declared && pkg.rule).map(pkg => this.addScript(pkg.rule).then(() => {
    if (!pkg.registered) {
      this.warnPackage(`empty:${pkg.name}`, `${pkg.rule} loaded but registered nothing for package ` + `"${pkg.name}"; it must call SF.RuleLoader.registerPackage(` + `"${pkg.name}", {rules})`);
    }
  }).catch(() => {
    this.warnPackage(`rule:${pkg.name}`, `the rules of package "${pkg.name}" could not be loaded from ` + `${pkg.rule}; its components stay undefined`);
  }));
  return loads.length ? Promise.all(loads) : null;
}; // The one way a package adds rules. It may run before the first scan (the
// rule file the Loader fetched for a declared package) or long after it (a
// page registering a package of its own), so it rebuilds what the Loader
// derived from the rule map and reads the page again.
//
// A package rule may replace a Core rule of the same name: while a component
// moves into a package, Core still ships its old rule, and a page that
// declared the package chose the package's bytes. A rule that has already
// been loaded is not replaced -- a custom element cannot be defined twice.


SFLoaderPlugin.prototype.registerPackage = function (name, options = {}) {
  const packageName = String(name ?? '').trim();

  if (!PACKAGE_NAME.test(packageName)) {
    this.warnPackage(`name:${packageName}`, `"${packageName}" is not a package name (lower-case letters, digits ` + 'and hyphens); its rules are not registered');
    return [];
  }

  const rules = options?.rules;

  if (!rules || typeof rules !== 'object' || Array.isArray(rules)) {
    this.warnPackage(`rules:${packageName}`, `package "${packageName}" was registered without a rules object`);
    return [];
  }

  if (!this.packages[packageName]) {
    this.packages[packageName] = {
      name: packageName,
      base: '',
      rule: '',
      declared: false,
      registered: false
    };
  }

  const pkg = this.packages[packageName]; // Where the bytes are served is the page's decision, so a base the page
  // declared wins over the one a bundle suggests.

  if (!pkg.base) pkg.base = normalisePackageUrl(options.base);
  pkg.registered = true;
  const added = [];
  Object.entries(rules).forEach(([key, rule]) => {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
      this.warnPackage(`rule:${packageName}:${key}`, `package "${packageName}" rule "${key}" is not an object; skipped`);
      return;
    }

    const current = this.findPlugins[key];

    if (current?.package && current.package !== packageName) {
      this.warnPackage(`owner:${packageName}:${key}`, `rule "${key}" already belongs to package "${current.package}"; ` + `package "${packageName}" cannot take it`);
      return;
    }

    if (current && (this.module[key] || this.loadedPlugins[key])) {
      this.warnPackage(`loaded:${packageName}:${key}`, `rule "${key}" is already loaded from ` + `${current.package ? `package "${current.package}"` : 'the Smart base'}; ` + `the copy in package "${packageName}" is not used on this page`);
      return;
    }

    this.findPlugins[key] = { ...rule,
      package: packageName
    };
    added.push(key);
  });
  if (added.length) this.rulesChanged();
  return added;
}; // Everything the Loader derived from the rule map, dropped so the next read
// sees the new rules, and the page read again so elements that were on it
// before their rule arrived are loaded now. Before the first scan there is
// nothing to read again: that scan reads the new rules itself.


SFLoaderPlugin.prototype.rulesChanged = function () {
  this.customElementRules = null;
  this.clearAttributeRuleIndex();
  this.clearRegexpScanRules();
  this.attrMatchCache.clear();
  this.regexMatchCache.clear();

  if (!this.prepareInit || typeof document === 'undefined' || !document.body) {
    return;
  }

  this.mutate(() => {
    this.scanCustomElements(document.body);
    this.scanAttributes(document.body);
    if (!this.pendingRegex) this.searchRegexp('');
  });
}; // The base a Smart rule's files are fetched from: its package's, or the Smart
// base when it has none. A package rule whose package is unknown or has no
// base resolves to nothing, said once per rule, and is never quietly fetched
// from the Smart base -- that would load whatever an older Core shipped under
// the same name, or 404 and be cached as missing there.


SFLoaderPlugin.prototype.resolveSmartBase = function (name) {
  const rule = this.findPlugins?.[name];
  const packageName = rule && typeof rule === 'object' ? rule.package : '';
  if (!packageName) return this.smartPath;
  const pkg = this.packages[packageName];
  if (pkg?.base) return pkg.base;
  const tags = Array.isArray(rule.tags) && rule.tags.length ? rule.tags.map(tag => `<${tag}>`).join(', ') : name;
  this.warnPackage(`resolve:${packageName}:${name}`, pkg ? `${tags} belongs to package "${packageName}", which has no base; ` + `set SF_BOOT_CONFIG.packages.${packageName}.base. It is not loaded ` + 'from the Smart base.' : `${tags} belongs to package "${packageName}", which this page has not ` + `declared; add SF_BOOT_CONFIG.packages.${packageName} = {base: ...}. ` + 'It is not loaded from the Smart base.');
  return null;
};

SFLoaderPlugin.prototype.isPluginResolvable = function (name) {
  const rule = this.findPlugins?.[name];
  if (!rule || typeof rule !== 'object' || !rule.package) return true;
  return this.resolveSmartBase(name) !== null;
};

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
  } // The base arrives with the shared runtime, in one chunk with the modules the
  // Smart bundles are built against.


  this.smartBaseLoadPromise = window.SF.loadRuntime().then(() => {
    // The base announces itself (sf-smart-base-ready) when it publishes
    // SF.smart, once per page, so it is not announced again here.
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

const SHORTCODE_SKIPPED = 'script, style, yamap, head, meta, link, [data-sf-observer="ignore"]';

SFLoaderPlugin.prototype.findShortCodes = function (node) {
  const regex = /\[!([a-zA-Z0-9_-]+)(?:\s+([^\](]+?))?](?:\(([^)]*)\))?(?:#([a-zA-Z0-9_-]+))?/g;
  const host = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement || null;

  if (this.shouldSkipNode(host)) {
    return;
  } // Both text and comment placeholders (the boot script hides a shortcode in
  // a comment). The walk is the browser's: a recursive walk in script over
  // every node of the page, for a `[!` that is almost never there, was the
  // larger part of the Loader's task at the window's load (stand 25, D9:
  // 378 ms on the admin at 4x CPU). Text is read only when the subtree's text
  // holds a `[!` at all; comments are few and the browser filters them.


  if (node.nodeType === Node.ELEMENT_NODE) {
    const show = (node.textContent || '').includes('[!') ? NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT : NodeFilter.SHOW_COMMENT;
    const walker = document.createTreeWalker(node, show);
    const found = [];

    while (walker.nextNode()) {
      const child = walker.currentNode;
      const value = child.nodeValue || '';

      if (child.nodeType === Node.COMMENT_NODE ? value.startsWith('sf-shortcode ') : value.includes('[!')) {
        found.push(child);
      }
    } // What the recursive walk did not enter: an ignored subtree, and a
    // script, a style or another excluded element at any depth.


    found.forEach(child => {
      if (child.parentElement?.closest?.(SHORTCODE_SKIPPED)) return;
      this.findShortCodes(child);
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

  const shortcodeSegments = segments.filter(seg => seg.type === 'shortcode'); // requestIdleCallback is throttled in a hidden tab and rAF is paused there, so
  // the fallback goes through the loader's own scheduler.

  const schedule = (typeof document !== 'undefined' && document.hidden ? null : window.requestIdleCallback) || function (cb) {
    return scheduleLoaderWork(() => cb());
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

      this.loadScriptOnCall(originItem);
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
    (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().setItem(key, value);
  } catch (e) {
    console.warn('localStorage setItem failed', key, e);
  }
}

function safeRemoveItem(key) {
  try {
    (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().removeItem(key);
  } catch (e) {
    console.warn('localStorage removeItem failed', key, e);
  }
}

(0,_iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_8__.installIconSubsetRuntime)(SFLoaderPlugin, {
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
  (0,_preloader__WEBPACK_IMPORTED_MODULE_9__.startPreloaderMotion)(this.preloaderWrap, () => this.preloaderRun, this.preloader);
};

SFLoaderPlugin.prototype.stopAnimation = function () {
  clearInterval(this.arrowInterval);
  if (!this.preloaderWrap) return;
  (0,_preloader__WEBPACK_IMPORTED_MODULE_9__.stopPreloaderMotion)(this.preloaderWrap);
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
  } // The Smart bundles define their elements once the shared runtime has
  // arrived; the page is ready when they have, not when their scripts have.


  const runtime = window.SF?.__internal?.runtimeLoading;

  if (runtime && !window.SF.__internal.runtimeSettled) {
    if (!this.readyWaitsForRuntime) {
      this.readyWaitsForRuntime = true;
      runtime.catch(() => null).then(() => new Promise(settle => setTimeout(settle, 0))).then(() => {
        this.readyWaitsForRuntime = false;
        this.dispatchReadyOnce();
      });
    }

    return false;
  }

  try {
    window.dispatchEvent(createReadyEvent());
    this.eventSend = true; // A lazy relation is fetched when it is first used, not in idle time
    // (standard simai.smart-component 1.3.8 §7.2.1; simai/ui-source#47). A
    // page that wants the old warm-up asks for it:
    // SF_BOOT_CONFIG.prefetchLazyRelations = true.

    if (this.params?.prefetchLazyRelations === true || window.SF_BOOT_CONFIG?.prefetchLazyRelations === true) {
      this.prefetchLazyRelations();
    }

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

  try {
    document.cookie = name + '=' + encodeURIComponent(value) + (expiredays == null ? '' : '; expires=' + exdate.toUTCString()) + '; path=/';
    return true;
  } catch {
    return false;
  }
};

SFLoaderPlugin.prototype.getCookie = function (name) {
  let cookies = '';

  try {
    cookies = document.cookie;
  } catch {
    return '';
  }

  if (cookies.length > 0) {
    let start = cookies.indexOf(name + '=');

    if (start !== -1) {
      start = start + name.length + 1;
      let end = cookies.indexOf(';', start);

      if (end === -1) {
        end = cookies.length;
      }

      return encodeURI(cookies.substring(start, end));
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
  // A sandboxed document throws on reading its cookies, as getCookie knows.
  let cookies = '';

  try {
    cookies = document.cookie;
  } catch {
    cookies = '';
  }

  if (cookies.length > 0) {
    let start = cookies.indexOf(name + '=');

    if (start !== -1) {
      start = start + name.length + 1;
      let end = cookies.indexOf(';', start);
      if (end === -1) end = cookies.length;
      return encodeURI(cookies.substring(start, end)).split(',');
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
  return null;
};

SFLoaderPlugin.prototype.checkEventsPlugins = function (name) {
  if (this.eventsPlugins.indexOf(name) === -1) {
    this.eventsPlugins.push(name);
  }
};

SFLoaderPlugin.prototype.checkFake = async function () {
  return null;
};

SFLoaderPlugin.prototype.setLocalStorage = function (templates, fake) {
  const data = JSON.stringify({
    templates,
    cache: fake
  });
  safeSetItem(`SF_SMART_LIST-${this.urlHash}`, (0,_cacheCodec__WEBPACK_IMPORTED_MODULE_0__.encodeCacheValue)(data));
};

SFLoaderPlugin.prototype.setCacheContent = async function (templates, fake) {
  this.setLocalStorage(templates, fake);
  return true;
};

function resolveMinified(params = {}) {
  if (typeof params.minified === 'boolean') return params.minified;
  const configured = globalThis.window?.SF_BOOT_CONFIG?.minified;
  if (typeof configured === 'boolean') return configured;

  try {
    if (new URLSearchParams(globalThis.location?.search || '').has('sf-debug')) return false;
  } catch {
    /* no readable address: the attribute decides */
  }

  return !globalThis.document?.documentElement?.hasAttribute?.('data-sf-debug');
} // x.min.js <-> x.js, x.min.css <-> x.css; null for anything else.


function otherForm(url) {
  const value = String(url || '');
  if (/\.min\.(js|css)(?=$|[?#])/.test(value)) return value.replace(/\.min\.(js|css)(?=$|[?#])/, '.$1');
  if (/\.(js|css)(?=$|[?#])/.test(value)) return value.replace(/\.(js|css)(?=$|[?#])/, '.min.$1');
  return null;
}

SFLoaderPlugin.prototype.isLoaded = function (pluginURL, type) {
  // Either form of a file counts: a page that included the readable file by
  // hand has it, and the Loader must not fetch the minified one beside it.
  for (const url of [pluginURL, otherForm(pluginURL)]) {
    if (!url) continue;
    const selector = type === 'style' ? `link[href*="${url}"]` : `script[src*="${url}"]`;
    if (document.querySelector(selector) !== null) return true;
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
// An inline SVG is scanned like any other markup: its classes are the
// fill-*, stroke-* and svg-* utilities the documentation gives a brand mark
// and an icon drawn in place, and they loaded nothing while svg, path and g
// were skipped (documentation trial 6, 2026-10-18).


SFLoaderPlugin.prototype.excludedTags = function (tag) {
  return ['script', 'style', 'yamap', 'head', 'meta', 'link'].indexOf(tag) === -1;
};

const OBSERVER_IGNORE_SELECTOR = '[data-sf-observer="ignore"]'; // The host is checked by the caller, and a rejected node takes its subtree
// with it -- so a node the walker reaches has no ignored ancestor inside the
// host, and needs only its own test, not a `closest()` up to the document for
// every one of a table's two thousand nodes.

SFLoaderPlugin.prototype.createFilteredElementWalker = function (host) {
  return document.createTreeWalker(host, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => this.shouldSkipOwnNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  });
};

SFLoaderPlugin.prototype.shouldSkipOwnNode = function (node) {
  if (!node?.tagName) return true;
  if (node.matches?.(OBSERVER_IGNORE_SELECTOR)) return true;
  return !this.excludedTags(node.tagName.toLowerCase());
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
}; // A rule that matches one whole class token and nothing else: anchored at
// both ends of the tested string, with no character in it that an attribute
// string always carries (`=`, `"`) and no class that could stand for one. It
// can only ever match a single token, so the attribute string need not be
// tested against it (doesRuleMatchAttributes tests both).


const TOKEN_RULE = /^\^\(\?:([\s\S]*)\)\(\?!\[\\s\\S\]\)$/u;

function isTokenOnlyRule(source, rule) {
  if (!source) return false;
  const regex = rule?.regex ? rule.regex : rule;
  if (regex instanceof RegExp && /[mgy]/u.test(regex.flags)) return false;
  const body = source.match(TOKEN_RULE)?.[1];
  if (body === undefined) return false;
  return !/["'=.]|\\[SWDsdw]|\[\^|\\u|\\x/u.test(body);
} // The literal characters every match of a whole-token rule starts with: the
// body's leading plain characters, when the body has no alternation outside
// a group (`a|b` at the top may start either way). '' when there are none.


function tokenRuleHead(source) {
  const body = source.match(TOKEN_RULE)?.[1] || '';
  let depth = 0;

  for (let index = 0; index < body.length; index++) {
    const char = body[index];

    if (char === '\\') {
      index++;
      continue;
    }

    if (char === '[') {
      while (index < body.length && body[index] !== ']') index += body[index] === '\\' ? 2 : 1;

      continue;
    }

    if (char === '(') depth++;else if (char === ')') depth--;else if (char === '|' && depth === 0) return '';
  }

  const head = body.match(/^[a-z0-9_:-]+/iu)?.[0] || ''; // A quantifier after the head's last character makes that character optional.

  const next = body[head.length];
  return next === '?' || next === '*' || next === '{' ? head.slice(0, -1) : head;
}

SFLoaderPlugin.prototype.getAttributeRuleIndex = function () {
  if (this.attributeRuleIndex) {
    return this.attributeRuleIndex;
  }

  const byAttr = new Map();
  const byClassHint = new Map();
  const classPrefixRules = [];
  const classFallback = [];
  const tokenRules = [];
  const prefixRules = [];
  const fallback = [];
  Object.entries(this.findPlugins || {}).forEach(([key, rule]) => {
    const hasRegex = rule instanceof RegExp || typeof rule === 'string' || rule && typeof rule === 'object' && rule.regex;
    if (!hasRegex || this.module[key]) return;
    const indexedRule = {
      key,
      rule,
      classHints: this.extractRuleClassHints(rule),
      tokenOnly: isTokenOnlyRule(this.getRuleRegexSource(rule), rule)
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
        if (indexedRule.tokenOnly) {
          tokenRules.push(indexedRule);
          return;
        }

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
  }); // A whole-token rule is tested only on a token that starts with its
  // literal head (`md:items-cross-` of `^(?:md:items-cross-(?:…))`); one
  // with no head (an alternation at the top) is tested on every token.

  const tokenRulesByFirst = new Map();
  const tokenRulesAlways = [];
  tokenRules.forEach(indexedRule => {
    const regex = indexedRule.rule?.regex ? indexedRule.rule.regex : indexedRule.rule;
    indexedRule.tokenPrefix = regex instanceof RegExp && regex.flags.includes('i') ? '' : tokenRuleHead(this.getRuleRegexSource(indexedRule.rule));

    if (!indexedRule.tokenPrefix) {
      tokenRulesAlways.push(indexedRule);
      return;
    }

    const first = indexedRule.tokenPrefix[0];
    if (!tokenRulesByFirst.has(first)) tokenRulesByFirst.set(first, []);
    tokenRulesByFirst.get(first).push(indexedRule);
  });
  this.attributeRuleIndex = {
    byAttr,
    byClassHint,
    classPrefixRules,
    classFallback,
    tokenRules,
    tokenRulesByFirst,
    tokenRulesAlways,
    prefixRules,
    fallback
  };
  return this.attributeRuleIndex;
};

SFLoaderPlugin.prototype.clearAttributeRuleIndex = function () {
  this.attributeRuleIndex = null;
  this.tokenRuleMatches = null;
}; // The keys of the whole-token rules (a utility's `^(?:…)(?![\s\S])`) one
// class token matches, worked out once per token for the page: a token is
// matched or not whatever element carries it, so the ~760 utility rules are
// tested once per distinct class name instead of once per distinct attribute
// string. On the admin every row's attribute string was new (its id, its
// record), and each cost 760 tests: scanAttributes took 480 ms of the load
// task at 4x CPU, a row batch 380 ms (stand 25, D9).


SFLoaderPlugin.prototype.getTokenRuleKeys = function (token) {
  if (!this.tokenRuleMatches) this.tokenRuleMatches = new Map();
  const known = this.tokenRuleMatches.get(token);
  if (known) return known;
  const keys = [];
  const {
    tokenRulesByFirst,
    tokenRulesAlways
  } = this.getAttributeRuleIndex();
  const rules = [...(tokenRulesByFirst.get(token[0]) || []), ...tokenRulesAlways];

  for (let index = 0; index < rules.length; index++) {
    const {
      key,
      rule,
      tokenPrefix
    } = rules[index];
    if (tokenPrefix && !token.startsWith(tokenPrefix)) continue;
    const regex = rule?.regex ? rule.regex : rule;
    const re = regex instanceof RegExp ? regex : new RegExp(regex, regex?.flags || '');
    if (re.global || re.sticky) re.lastIndex = 0;
    if (re.test(token)) keys.push(key);
  }

  this.tokenRuleMatches.set(token, keys);
  return keys;
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

SFLoaderPlugin.prototype.doesRuleMatchAttributes = function (rule, attributeString, className = '') {
  const regex = rule?.regex ? rule.regex : rule;
  const re = regex instanceof RegExp ? regex : new RegExp(regex, regex?.flags || '');

  const test = value => {
    if (re.global || re.sticky) re.lastIndex = 0;
    return re.test(value);
  };

  if (test(attributeString)) return true;
  return String(className).split(/\s+/).filter(Boolean).some(token => test(token));
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
        const converted = (0,_tailwind_map__WEBPACK_IMPORTED_MODULE_3__.convertTailwindClasses)(value);

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
  const tokenMatched = new Set();
  const className = HtmlElement.getAttribute('class') || '';
  attributes.forEach(attrName => {
    const normalizedAttrName = attrName.toLowerCase();

    if (normalizedAttrName === 'class') {
      const classTokens = className.toLowerCase().split(/\s+/).filter(Boolean); // A token rule is tested on the token as written, as before.

      className.split(/\s+/).forEach(token => {
        if (token) this.getTokenRuleKeys(token).forEach(key => tokenMatched.add(key));
      });
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

  for (const key of tokenMatched) {
    if (this.module[key] || candidates.has(key)) continue;
    keys.push(key);
    totalItemCount++;
    this.setExistCookie(key);
  }

  for (const [key, rule] of candidates) {
    if (this.module[key]) continue;
    const hasRegex = rule instanceof RegExp || typeof rule === 'string' || rule && typeof rule === 'object' && rule.regex;
    if (!hasRegex) continue;
    const match = this.doesRuleMatchAttributes(rule, string, className);

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
}; // A Smart element inside a closed container is not a reason to fetch its code
// (standard simai.smart-component 1.3.8 §7.2.1, simai/ui-source#47): a tab
// panel or anything else with `hidden`, an `inert` subtree (a closed sf-modal's
// root, a slide out of view), a closed <details> past its summary, a closed
// <dialog>, and a part its assembly has not started yet (§7.2.1: SF.Assembly
// marks a part with a deferred start `data-sf-start` and adds
// `data-sf-started` when it starts). The Loader watches the container and
// reads it again when it opens; the module is fetched then, once. This is the
// one deferral of the first paint: an unstarted part is a closed container
// for itself and for everything inside it.


const UNSTARTED_PART = '[data-sf-start]:not([data-sf-started])';
const CLOSED_CONTAINER = `[hidden], [inert], details:not([open]), dialog:not([open]), ${UNSTARTED_PART}`;
const CLOSED_CONTAINER_ATTRIBUTES = ['hidden', 'inert', 'open', 'data-sf-start', 'data-sf-started'];

function isClosedContainer(node) {
  return node?.nodeType === 1 && node.matches(CLOSED_CONTAINER);
}

function closedContainerOf(el) {
  if (el?.nodeType === 1 && el.matches(UNSTARTED_PART)) return el;

  for (let node = el?.parentElement; node; node = node.parentElement) {
    if (!isClosedContainer(node)) continue; // A closed <details> still shows its summary.

    if (node.localName === 'details' && el.closest('summary')?.parentElement === node) continue;
    return node;
  }

  return null;
} // A Smart tag is one a rule claims. The Framework's own are sf- names; a
// component package may name its elements with its owner's prefix (standard
// simai.component-package, own-element-prefix), and the rule it registers is
// where it says so -- every rule lists its tags. Only a package rule may claim a
// tag outside sf-, so the Framework's names stay its own (owner, 2026-10-12;
// before that the Loader skipped every other tag and a package element with its
// own prefix never loaded).


const CUSTOM_ELEMENT_NAME = /^[a-z][a-z0-9]*-[a-z0-9-]*$/;

function isClaimableTag(tagName, rule) {
  if (tagName.startsWith('sf-')) return true;
  return Boolean(rule?.package) && CUSTOM_ELEMENT_NAME.test(tagName);
} // The tag map is read for every element a walk meets (and every ancestor of
// a nested Smart element), so it is built once per rule set: again after
// rulesChanged, or when a rule file added rules to the map directly.


SFLoaderPlugin.prototype.getCustomElementRules = function () {
  const ruleCount = Object.keys(this.findPlugins || {}).length;

  if (this.customElementRules && this.customElementRulesCount === ruleCount) {
    return this.customElementRules;
  }

  const tagRules = {};
  Object.entries(this.findPlugins || {}).forEach(([componentName, rule]) => {
    if (!rule || typeof rule !== 'object' || !Array.isArray(rule.tags)) return;
    rule.tags.forEach(tagName => {
      const normalizedTag = String(tagName || '').trim().toLowerCase();
      if (!isClaimableTag(normalizedTag, rule)) return;
      tagRules[normalizedTag] = componentName;
    });
  });
  this.customElementRules = tagRules;
  this.customElementRulesCount = ruleCount;
  return tagRules;
};

SFLoaderPlugin.prototype.getSmartElementRuleName = function (el) {
  const tagName = el?.tagName?.toLowerCase?.() || '';

  if (!tagName.includes('-')) {
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
}; // Leaves the element for later when it sits in a closed container: the
// container is watched, and read again when it opens. The element's tag is
// held meanwhile (pending-tags.js), in case the container is one that still
// shows it (an inert region).


SFLoaderPlugin.prototype.deferClosedSmartElement = function (el) {
  const container = closedContainerOf(el);
  if (!container) return false;
  (0,_pending_tags_js__WEBPACK_IMPORTED_MODULE_11__.installPendingTags)(window).hold(el.localName);
  this.watchClosedContainer(container);
  return true;
};

SFLoaderPlugin.prototype.watchClosedContainer = function (container) {
  if (!this.closedContainers) {
    this.closedContainers = new WeakSet();
    this.closedContainerObserver = new MutationObserver(records => {
      const opened = new Set();
      records.forEach(({
        target
      }) => {
        if (this.closedContainers.has(target) && !isClosedContainer(target)) opened.add(target);
      });
      opened.forEach(target => {
        this.closedContainers.delete(target);
        if (target.isConnected) this.scanCustomElements(target);
      });
    });
  }

  if (this.closedContainers.has(container)) return;
  this.closedContainers.add(container);
  this.closedContainerObserver.observe(container, {
    attributes: true,
    attributeFilter: CLOSED_CONTAINER_ATTRIBUTES
  });
}; // The tag's elements stay invisible while its module is on the way, unless
// they carry static markup or a skeleton shape (pending-tags.js).


SFLoaderPlugin.prototype.holdSmartTag = function (tagName) {
  (0,_pending_tags_js__WEBPACK_IMPORTED_MODULE_11__.installPendingTags)(window).hold(tagName, {
    asked: true
  });
};

SFLoaderPlugin.prototype.prepareSmartChildScanEvents = function () {
  if (this.smartChildScanEventsBound) {
    return;
  }

  this.smartChildScanEventsBound = true; // Collected and scanned once per task: a table's render renders the
  // elements in its cells, each one announced its own render, and its
  // subtree was scanned again inside the table's -- 104 scans for the first
  // page of the admin's list (stand 25). An element inside another collected
  // one is covered by that one's scan.

  const rendered = new Set();

  const scanRendered = () => {
    const targets = [...rendered].filter(target => target.isConnected);
    rendered.clear();
    targets.filter(target => !targets.some(other => other !== target && other.contains(target))).forEach(target => this.scanCustomElements(target, true));
  };

  document.addEventListener('sf-after-render', event => {
    const target = event.target;

    if (!(target instanceof Element) || !this.getSmartElementRuleName(target)) {
      return;
    }

    if (!rendered.size) queueMicrotask(scanRendered);
    rendered.add(target);
  });
};

SFLoaderPlugin.prototype.scanCustomElements = function (root = null, autoLoad = true, {
  subtree = true
} = {}) {
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

  const processNode = (el, filtered = false) => {
    if (!el || el.nodeType !== Node.ELEMENT_NODE || !filtered && this.shouldSkipNode(el)) {
      return;
    }

    scannedNodes++;
    const tagName = el.tagName?.toLowerCase?.();

    if (!tagName || !tagName.includes('-')) {
      return;
    } // An element added later with a declared port (§4.9): its first call
    // leaves now, before its code is asked for.


    if (tagName.startsWith('sf-') && !customElements.get(tagName)) {
      window.SF?.EarlyPort?.declareIn?.(el);
    }

    const componentName = tagRules[tagName];

    if (componentName === 'cl-icon') {
      iconItemCount += this.trackIconElement(el);
    }

    if (!componentName || this.module[componentName] || this.shouldDeferNestedSmartElement(el) || this.deferClosedSmartElement(el)) {
      return;
    }

    this.holdSmartTag(tagName);
    keys.push(componentName);
    totalItemCount++;
    this.setExistCookie(componentName);
  };

  if (host.nodeType === Node.ELEMENT_NODE) {
    processNode(host);
  }

  if (subtree) {
    const walker = this.createFilteredElementWalker(host);

    while (walker.nextNode()) {
      processNode(walker.currentNode, true);
    }
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
  let skippedNodes = 0; // The walker rejects an ignored or excluded subtree, so a node it reaches
  // needs no closest() of its own (one per node of a two-thousand-node table).

  const processNode = (el, filtered = false) => {
    if (!filtered && this.shouldSkipNode(el)) return;

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
    processNode(walker.currentNode, true);
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
}; // scanAttributes in slices (the window's load reads the whole page): the
// modules found are asked for when the walk is done, as scanAttributes does.


SFLoaderPlugin.prototype.scanAttributesInSlices = async function (root = null) {
  const host = root || document.body;

  if (!host || host.nodeType === Node.ELEMENT_NODE && this.shouldSkipNode(host)) {
    return {
      keys: [],
      count: 0
    };
  } // The window's load task ends here; the rule index (a thousand rules read
  // once) is built in a task of its own.


  await yieldToPage();
  this.getAttributeRuleIndex();
  await yieldToPage();
  const keys = [];
  let totalItemCount = 0;

  const processNode = el => {
    if (!this.hasRelevantRuleAttributes(el)) return;
    const result = this.getAttributes(el);
    totalItemCount += result.count;
    keys.push(...result.keys);
  }; // The nodes are listed first, in one go (the walk alone is cheap), and
  // read in slices: a walker left between slices loses its place when the
  // page removes the node it stands on. A node gone meanwhile is passed over;
  // one added meanwhile is the mutation observer's.


  const nodes = host.nodeType === Node.ELEMENT_NODE ? [host] : [];
  const walker = this.createFilteredElementWalker(host);

  while (walker.nextNode()) nodes.push(walker.currentNode);

  const clock = sliceClock();

  for (let index = 0; index < nodes.length; index++) {
    if (nodes[index].isConnected) processNode(nodes[index]);
    if (clock.due() && index < nodes.length - 1) await clock.next();
  }

  if (totalItemCount > 0) {
    this.mutate(() => this.getLoader(this.module, true));
  }

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

    if (tagName?.includes('-')) {
      const componentName = tagRules[tagName];

      if (componentName === 'cl-icon') {
        customIconCount += this.trackIconElement(el);
      }

      if (componentName && !this.module[componentName] && !this.shouldDeferNestedSmartElement(el) && !this.deferClosedSmartElement(el)) {
        this.holdSmartTag(tagName);
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
}; // Whether a node is one of the roots or inside one: up the parents, a few
// steps, instead of asking every root -- a list re-rendered adds hundreds of
// roots, and asking each of them about each of the others was a hundred
// thousand `contains` calls for one search (rules of the road, 2026-10-15).


SFLoaderPlugin.prototype.isCoveredByMutationRoots = function (node, rootSet, {
  self = true
} = {}) {
  if (!node || !rootSet.size) return false;
  if (self && rootSet.has(node)) return true;
  let parent = node.parentNode;

  while (parent) {
    if (rootSet.has(parent)) return true;
    parent = parent.parentNode;
  }

  return false;
};

SFLoaderPlugin.prototype.collectUniqueAddedMutationRoots = function (changeList = []) {
  const candidates = new Set();

  for (let index = 0; index < changeList.length; index++) {
    const change = changeList[index];

    if (!change || change.type !== 'childList' || !change.addedNodes?.length) {
      continue;
    }

    for (let nodeIndex = 0; nodeIndex < change.addedNodes.length; nodeIndex++) {
      const node = change.addedNodes[nodeIndex];
      if (!node || this.shouldSkipNode(node)) continue;
      candidates.add(node);
    }
  } // A root inside another root is scanned with it.


  return [...candidates].filter(node => !this.isCoveredByMutationRoots(node, candidates, {
    self: false
  }));
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
  const DEBOUNCE_MS = 100; // A batch is read in slices (sliceClock): a table's page of rows is a
  // few thousand nodes, and reading them in one task held the page for
  // 240-500 ms at 4x CPU (stand 25, D9). Batches are read one after another.

  const processChanges = async changeList => {
    if (this.stopObserver) {
      return false;
    }

    const profile = this.profileStart('MutationObserver.processChanges');
    const addedRoots = this.collectUniqueAddedMutationRoots(changeList);
    const addedRootSet = new Set(addedRoots);
    let processedAddedRoots = 0;
    let processedAttributeTargetsCount = 0;
    const clock = sliceClock();

    const processAddedNode = async objHTML => {
      if (this.shouldSkipNode(objHTML)) return; // Taken out again before its turn came: nothing of it is on the page.

      if (objHTML.isConnected === false) return;
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
      } // The root passed shouldSkipNode; the walker rejects an ignored or
      // excluded subtree below it, and only an element with an attribute a
      // rule reads is read (scanAttributes does the same).


      const nodes = [objHTML];
      const walker = this.createFilteredElementWalker(objHTML);

      while (walker.nextNode()) nodes.push(walker.currentNode);

      for (let index = 0; index < nodes.length; index++) {
        const el = nodes[index];

        if (el.isConnected && this.hasRelevantRuleAttributes(el)) {
          const {
            count,
            keys
          } = this.getAttributes(el);
          totalItemCount += count;
          newPlugins.push(...keys);
        }

        if (clock.due()) await clock.next();
      }
    };

    for (const root of addedRoots) {
      if (this.stopObserver) return false;
      await processAddedNode(root);
    }

    const processedAttributeTargets = new Set();

    for (let o = 0; o < changeList.length; o++) {
      const change = changeList[o];
      if (clock.due()) await clock.next();

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
            if (processedAttributeTargets.has(change.target) || this.isCoveredByMutationRoots(change.target, addedRootSet)) {
              continue;
            }

            processedAttributeTargets.add(change.target);
            processedAttributeTargetsCount++;
            const staticIconMutation = this.processStaticIconMutation(change.target, false);

            if (staticIconMutation.handled) {
              this.trackPendingIconScan(staticIconMutation);
              continue;
            } // An attribute changes the element, not what is inside it: its
            // children were scanned when they were added, and stay as they were.
            // Only the ignore marker opens a subtree that was not scanned. Scanning
            // everything below for any attribute made a table's «loading» mark a
            // walk over its two thousand nodes, several times a search.


            const opensSubtree = change.attributeName === 'data-sf-observer';
            const customScan = this.scanCustomElements(change.target, false, {
              subtree: opensSubtree
            });
            this.trackPendingIconScan(customScan);
            if (opensSubtree) this.trackPendingIconScan(this.scanStaticIcons(change.target, false));
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

  let changesRead = Promise.resolve();

  const queueChanges = changeList => {
    changesRead = changesRead.then(() => processChanges(changeList)).catch(error => console.warn('SFLoader: a batch of changes failed', error));
    return changesRead;
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
        queueChanges(bufferedChanges);
      }, DEBOUNCE_MS);
    } else {
      _this.observeElements.push(...relevantChanges);
    }
  }; // Changes met while the search was still running wait in observeElements;
  // they are processed when it ends, not dropped.


  this.flushObservedChanges = () => {
    if (!_this.observeElements.length) return;
    queueChanges(_this.observeElements.splice(0));
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
  name = (0,_utilityModuleAliases__WEBPACK_IMPORTED_MODULE_7__.resolveUtilityModule)(name, _contracts_utility_module_aliases_v1_json__WEBPACK_IMPORTED_MODULE_4__.aliases, this.findPlugins, this.productionPlanActive); // A package rule without a usable base is not marked for loading at all; the
  // warning names it, and nothing is fetched from the Smart base in its place.

  if (!this.isPluginResolvable(name)) {
    return;
  }

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
  } // A Smart component's templates draw with utility classes; they are its
  // relations too, so they are asked for in the wave that asks for the
  // component instead of after it has rendered (scripts/
  // generate-template-utilities.mjs; simai.interaction-rules,
  // assets-asked-together).


  const drawnWith = mode === 'smart' ? (_template_utilities_generated_json__WEBPACK_IMPORTED_MODULE_6__[name] || []).map(key => ({
    name: key
  })) : [];
  const relations = [...(param && Array.isArray(param.relation) ? param.relation : []), ...drawnWith];

  if (relations.length) {
    this.setRelation(relations, name, output);
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
  relation.forEach(named => {
    const forwardTo = named?.name && this.ruleForwards?.[named.name];
    const rel = forwardTo && this.findPlugins?.[named.name]?.package === undefined ? { ...named,
      name: forwardTo
    } : named;

    if (!rel?.name || !this.isPluginResolvable(rel.name)) {
      return;
    } // A lazy relation is something a component may render later -- a filter
    // editor, a date picker, a cell renderer for a type the page may not hold.
    // It does not hold up the page: it is fetched once the page is ready, in
    // the browser's idle time, or at once when it is asked for (2026-10-12;
    // the table's editors were a third of the admin's script at boot).


    if (rel.lazy === true) {
      this.lazyRelations.add(rel.name);
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
  const breakpoints = ['default', 'sm', 'md', 'lg', 'xl', 'xxl', 'hover', 'focus', 'focus-visible', 'active'];

  for (const point of breakpoints) {
    this.sortPlugin(plugin[point] || [], point, module, arPathCss, arPathJs);
  }
};

SFLoaderPlugin.prototype.pathPluginJs = function (name, smart, point, type) {
  let pathPlugin;

  if (smart) {
    const base = this.resolveSmartBase(name);
    if (base === null) return null; // A Smart bundle is built against the shared runtime; it is asked for now,
    // so it arrives with the first bundle rather than after it.

    globalThis.SF?.loadRuntime?.();
    name = name.substring(3);
    pathPlugin = `${base}/${name}`;
  } else {
    pathPlugin = `${type === 'component' ? this.componentPath : this.utilyPath}/${name}`;
  } // A component's or Smart element's script has a minified twin; a utility's
  // script does not, and keeps its readable name.


  const file = type === 'component' || smart ? name : point;
  return `${pathPlugin}/js/${file}${this.minified && (type === 'component' || smart) ? '.min' : ''}.js`;
};

SFLoaderPlugin.prototype.pathPluginCss = function (name, type, point) {
  let url = '';

  switch (type) {
    case 'component':
      url += this.componentPath;
      break;

    case 'smart':
      {
        const base = this.resolveSmartBase(name);
        if (base === null) return null;
        url += base;
        name = name.substring(3);
        break;
      }

    default:
      url += this.utilyPath;
      break;
  }

  return `${url}/${name}/css/${['component', 'smart'].includes(type) ? name : point}${this.minified ? '.min' : ''}.css`;
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
}; // Whether every tag of a Smart rule is already defined: a page that loads a
// part's bundle itself (Larena's admin: the table and the data view as
// <script defer> in <head>) had the Loader fetch and run the same part's
// bundle again -- 190 KB gzipped at fast-4G, the table's and the data view's
// code run twice, on the admin's list (stand 25). Its script is not asked for
// again; its sheets and relations are, as before.


function smartTagsDefined(rule) {
  const tags = Array.isArray(rule?.tags) ? rule.tags : [];
  return tags.length > 0 && typeof customElements !== 'undefined' && tags.every(tag => Boolean(customElements.get(String(tag).toLowerCase())));
}

SFLoaderPlugin.prototype.loadPlugin = function (pluginName, smart, point, module, plugins) {
  if (this.disableSmart && (module === 'smart' || smart)) {
    return;
  } // A cached plugin list reaches here without passing setExistCookie, so the
  // package check is repeated rather than trusted.


  if (!this.isPluginResolvable(pluginName)) {
    return;
  }

  const missKey = this.getMissingFileKey(pluginName);
  const ruleMeta = SF.RuleLoader?.[pluginName];
  const skipJs = typeof ruleMeta?.js === 'undefined' || module && module.js === false || ruleMeta?.js === false || (module === 'smart' || smart) && smartTagsDefined(ruleMeta);
  const skipCss = this.shouldSkipPluginCss(pluginName, module);
  const jsFile = skipJs ? null : this.pathPluginJs(pluginName, smart, point, module);

  if (!skipJs && !this.notFoundFiles[missKey] || this.notFoundFiles[missKey] && !this.notFoundFiles[missKey].js) {
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
  } // The sheets a Smart element's style gate waits for (ensureStylesReady) are
  // asked for with its script, not when it first draws: the utilities its
  // templates use that no relation asked for came a round trip after the
  // element was defined, and the element waited for them.


  if (module === 'smart' || smart) {
    this.styleSheetsOfRule(pluginName).forEach(file => {
      if (!linkedSheet(file)) this.addStyleEitherForm(file);
    });
  }

  if (!skipCss) {
    if (!this.notFoundFiles[missKey] || this.notFoundFiles[missKey] && (!this.notFoundFiles[missKey].css || !this.notFoundFiles[missKey].missingMin)) {
      const cssFile = this.pathPluginCss(pluginName, module, point);

      if (module === 'component' || module === 'smart') {
        this.checkEventsPlugins(pluginName);
      }

      if (!this.resolverAll[cssFile]) {
        this.resolverAll[cssFile] = this.addStyle(`${cssFile}`).then(() => {
          this.loadedPlugins[pluginName].css = true;
        }).catch(() => {
          this.addToMissingFiles(pluginName, 'css', false); // The other form of the file: the readable one when the minified
          // was asked for and is missing, the minified one otherwise.

          const min = otherForm(cssFile);
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
    }; // An element waits for its relations before its script runs, and it used
    // to wait for them before its script was even asked for: the admin's
    // table was fetched after its relations had run, and the data view after
    // the table (2026-10-13). The browser is told about the script now; it
    // still runs after the relations, from the cache.

    if (!skipJs && jsFile) this.preloadScript(jsFile);
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
          console.warn(`The dependent plugin is in a different category than ${module}, or missing: ${relationPlugin}`);
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
          skipJs: typeof relationMainRule?.js === 'undefined' || relationMainRule?.js === false || relationMainSmart && smartTagsDefined(relationMainRule)
        }; // The element that waits on this relation is fetched now too (the
        // same reason as in loadRelationPlugins: a data view waiting on its
        // table was asked for only once the table had run).

        const waiting = this.totalRelationsPlugins[relationMainPlugin];
        if (!waiting.skipJs && waiting.jsFile) this.preloadScript(waiting.jsFile);
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
  //     const hash = stableHash(url).substring(0, 16)
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
  const smartCache = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().getItem(`SF_SMART_LIST-${this.urlHash}`);

  if (smartCache) {
    try {
      this.smartCache = JSON.parse((0,_cacheCodec__WEBPACK_IMPORTED_MODULE_0__.decodeCacheValue)(smartCache));
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

SFLoaderPlugin.prototype.ensureThemePreferenceListener = function () {
  if (!this.themeEnabled || this.themeMediaQuery) {
    return this.themeMediaQuery || null;
  }

  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (!media) return null;
  this.themeMediaQuery = media;

  this.themeMediaListener = () => {
    if (this.themePreference === 'system') this.checkTheme();
  };

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', this.themeMediaListener);
  } else {
    media.addListener?.(this.themeMediaListener);
  }

  return media;
};

SFLoaderPlugin.prototype.setTheme = function (preference) {
  if (!this.themeEnabled) return false;
  const supported = ['system', 'light', 'dark'];
  if (!supported.includes(preference)) return false;

  if (preference === 'system') {
    try {
      document.cookie = 'sf-theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
    } catch {// Sandboxed documents retain the session theme without persistence.
    }

    this.themeSessionPreference = this.getCookie('sf-theme') ? 'system' : null;
  } else {
    const persisted = this.setCookie('sf-theme', preference) && this.getCookie('sf-theme') === preference;
    this.themeSessionPreference = persisted ? null : preference;
  }

  this.checkTheme();
  return true;
};

SFLoaderPlugin.prototype.changeTheme = function () {
  if (!this.themeEnabled) return false;
  return this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
};

SFLoaderPlugin.prototype.turboFontCheck = function (body) {
  if (this.iconFontReady) {
    body.classList.add('sf-icons-loaded');
  }
};

SFLoaderPlugin.prototype.checkTheme = function (body = null) {
  if (!this.themeEnabled) return false;
  const classes = ['theme-dark', 'theme-light'];
  const savedTheme = this.getCookie('sf-theme');
  const sessionPreference = this.themeSessionPreference;
  const preference = ['system', 'light', 'dark'].includes(sessionPreference) ? sessionPreference : ['light', 'dark'].includes(savedTheme) ? savedTheme : 'system';
  const media = this.ensureThemePreferenceListener();
  const isDark = preference === 'dark' || preference === 'system' && media?.matches;
  const theme = isDark ? 'dark' : 'light';
  const previousTheme = this.theme;
  const previousPreference = this.themePreference;
  this.theme = theme;
  this.themePreference = preference;
  body = body || document.documentElement;
  body.classList.remove(...classes);
  body.classList.add(isDark ? classes[0] : classes[1]);
  this.sendThemeToPlayground();

  if (body === document.documentElement && (theme !== previousTheme || preference !== previousPreference)) {
    window.dispatchEvent(new CustomEvent('sf-theme-change', {
      detail: {
        theme,
        preference
      }
    }));
  }

  return theme;
};

SFLoaderPlugin.prototype.checkForCache = function () {
  for (let i = 0; i < (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().length; i++) {
    const key = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().key(i);

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
  for (let i = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().length - 1; i >= 0; i--) {
    const key = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().key(i);

    if (key.startsWith('SF_PLUGIN_LIST-') || key.startsWith('SF_SMART_LIST-')) {
      safeRemoveItem(key);
    }
  }

  safeRemoveItem('SF_MISSING_PLUGINS');
};

SFLoaderPlugin.prototype.clearAllSfCache = function () {
  for (let i = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().length - 1; i >= 0; i--) {
    const key = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().key(i);

    if (key && key.startsWith('SF_')) {
      safeRemoveItem(key);
    }
  }
};

SFLoaderPlugin.prototype.ensureCacheVersion = function () {
  const versionKey = 'SF_CACHE_VERSION';
  const storedVersion = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().getItem(versionKey);
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
  const storedVersion = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().getItem(versionKey);
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
    const stored = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().getItem('SF_MISSING_PLUGINS');
    if (!stored) return;
    const parsed = JSON.parse((0,_cacheCodec__WEBPACK_IMPORTED_MODULE_0__.decodeCacheValue)(stored));
    if (!parsed || typeof parsed !== 'object') return;
    const remaining = {};
    Object.keys(parsed).forEach(key => {
      if (!key) return; // An entry is dropped once its rule is known again in the same place:
      // a package entry only by a rule of that package.

      const at = key.indexOf(PACKAGE_MISS_SEPARATOR);
      const packageName = at > 0 ? key.slice(0, at) : '';
      const name = at > 0 ? key.slice(at + PACKAGE_MISS_SEPARATOR.length) : key;
      const rule = SF.RuleLoader?.[name];

      if (rule && (rule.package || '') === packageName || !packageName && this.loadedPlugins[name]) {
        return;
      }

      remaining[key] = parsed[key];
    });

    if (Object.keys(remaining).length) {
      (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().setItem('SF_MISSING_PLUGINS', (0,_cacheCodec__WEBPACK_IMPORTED_MODULE_0__.encodeCacheValue)(JSON.stringify(remaining)));
    } else {
      (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().removeItem('SF_MISSING_PLUGINS');
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
  } // Announced after the module that registered finishes its own synchronous
  // work: every class component registers first and publishes SF.<Name> (its
  // state API) on the next lines, so a listener told at once found no API --
  // all 17 of them (documentation trial, 2026-10-12). The registry is filled
  // now, so ready() resolves synchronously as before.


  queueMicrotask(() => {
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
  });
};

SFLoaderPlugin.prototype.ready = function (className, callback) {
  const variants = Array.from(new Set([className, className && className[0] ? className[0].toUpperCase() + className.slice(1) : className, className && className.toLowerCase ? className.toLowerCase() : className].filter(Boolean))); // A component registers a class, and an API module an object (the theme
  // palette registers SF.ThemePalette): either is what ready() hands over.
  // Only a class was taken, so ready('theme-palette') never answered. The
  // callback runs once, whichever spelling's event comes.

  let answered = false;

  const tryResolve = () => {
    if (answered) return true;

    for (const name of variants) {
      const cls = this.ComponentRegistry[name];

      if (typeof cls === 'function' || cls && typeof cls === 'object') {
        answered = true;
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
    // Only the first 4096 characters are read below: the page's markup is
    // written up to there, not cloned and serialised whole (stand 25: the
    // whole admin cloned, its defined elements constructed again, for 4 KB).
    htmlString = document.body ? this.getObserverFilteredHTMLPrefix(document.body, 4096) : '';
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
  ignoredNodes.forEach(ignoredNode => ignoredNode.remove()); // A Smart element left for later (in a closed container) is not read here
  // either: its tag would match a class component's rule by name (`sf-modal`
  // matches the modal's) and fetch that code before the container opens.

  const tags = Object.keys(this.getCustomElementRules());

  if (tags.length && clone.querySelectorAll) {
    const hostClosed = node.nodeType === Node.ELEMENT_NODE && Boolean(closedContainerOf(node) || isClosedContainer(node));
    clone.querySelectorAll(tags.join(',')).forEach(el => {
      if (hostClosed || closedContainerOf(el)) el.remove();
    });
  }

  if (clone.innerHTML !== undefined) return clone.innerHTML;
  if (clone.outerHTML !== undefined) return clone.outerHTML;
  if (clone.textContent !== undefined) return clone.textContent;
  return '';
};

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

const escapeText = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\u00a0/g, '&nbsp;');

const escapeAttribute = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/\u00a0/g, '&nbsp;'); // The markup getObserverFilteredHTML would give, with stripIgnoredBlocks
// already applied (<code>, <pre> and ignored blocks left out), written only
// until it is `limit` characters long.


SFLoaderPlugin.prototype.getObserverFilteredHTMLPrefix = function (node, limit) {
  if (!node || this.shouldSkipNode(node)) return '';
  const tags = this.getCustomElementRules();
  const hostClosed = node.nodeType === Node.ELEMENT_NODE && Boolean(closedContainerOf(node) || isClosedContainer(node));
  let out = '';

  const write = current => {
    for (let child = current.firstChild; child && out.length < limit; child = child.nextSibling) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parent = current.localName;
        out += parent === 'script' || parent === 'style' ? child.data : escapeText(child.data);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        out += `<!--${child.data}-->`;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const name = child.localName;
        if (name === 'code' || name === 'pre' || child.matches(OBSERVER_IGNORE_SELECTOR)) continue;
        if (tags[name] && (hostClosed || closedContainerOf(child))) continue;
        out += `<${name}`;

        for (const attribute of child.attributes) out += ` ${attribute.name}="${escapeAttribute(attribute.value)}"`;

        out += '>';
        if (VOID_ELEMENTS.has(name)) continue;
        write(name === 'template' ? child.content : child);
        if (out.length < limit) out += `</${name}>`;
      }
    }
  };

  write(node);
  return out;
};

SFLoaderPlugin.prototype.stripIgnoredBlocks = function (html) {
  if (!html) return '';
  const patterns = [/<code\b[^>]*>.*?<\/code>/gims, /<pre\b[^>]*>.*?<\/pre>/gims, /<([a-z][\w:-]*)\b[^>]*data-sf-observer=["']ignore["'][^>]*>.*?<\/\1>/gims];
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

  PluginList = [...new Set(PluginList.map(name => (0,_utilityModuleAliases__WEBPACK_IMPORTED_MODULE_7__.resolveUtilityModule)(name, _contracts_utility_module_aliases_v1_json__WEBPACK_IMPORTED_MODULE_4__.aliases, this.findPlugins, this.productionPlanActive)))];

  if (!this.productionPlanActive) {
    PluginList.forEach(name => this.setModule(name));
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
    }); // The parts of an element holding a declared port (§4.9, §7.3; stand 27)
    // come right after the base utilities: its rule, the rules of the parts
    // inside it and their relations, relations first. The list is asked for
    // and defined before the menu, the header and the inputs.

    const portFirst = this.portFirstModules();

    if (portFirst.length) {
      const wanted = new Set(rest);
      const first = portFirst.filter(mod => wanted.has(mod));
      const firstSet = new Set(first);
      PluginList = [...priorityFirst, ...first, ...rest.filter(mod => !firstSet.has(mod))];
    } else {
      PluginList = [...priorityFirst, ...rest];
    }
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

  safeSetItem(`SF_PLUGIN_LIST-${this.urlHash}`, (0,_cacheCodec__WEBPACK_IMPORTED_MODULE_0__.encodeCacheValue)(JSON.stringify(this.module)));

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
  }

  return true;
}; // The rules an element holding a declared port needs (SF.EarlyPort,
// core/js/early-port.js): its own, those of the undefined parts inside it, and
// their relations, a relation before the rule naming it. Their tags are handed
// back to SF.EarlyPort, so the Smart base defines them in a batch of their own.


SFLoaderPlugin.prototype.portFirstModules = function () {
  const early = window.SF?.EarlyPort;
  const elements = early?.waiting?.() ?? [];
  if (!elements.length) return [];
  const ordered = [];
  const seen = new Set();

  const visit = name => {
    if (!name || seen.has(name)) return;
    seen.add(name);
    const rule = this.findPlugins?.[name];
    const relations = [...(this.relationPlugins?.[name] || []), ...(Array.isArray(rule?.relation) ? rule.relation : []).filter(named => named && named.lazy !== true).map(named => typeof named === 'string' ? named : named.name)];
    relations.forEach(visit);
    ordered.push(name);
  };

  elements.forEach(element => {
    visit(this.getSmartElementRuleName(element));
    element.querySelectorAll?.('*').forEach(inner => {
      if (inner.localName?.startsWith('sf-') && !customElements.get(inner.localName)) {
        visit(this.getSmartElementRuleName(inner));
      }
    });
  });
  const tags = [];
  ordered.forEach(name => {
    const rule = this.findPlugins?.[name];
    if (Array.isArray(rule?.tags)) tags.push(...rule.tags.map(tag => String(tag).trim().toLowerCase()).filter(tag => tag.startsWith('sf-')));
  });
  early.preferTags?.(tags);
  return ordered;
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
}; // A failed stylesheet may be a temporary network error. Keep CSS failures in
// this document so repeated scans do not loop, but retry them after reload.
// JavaScript failures remain persistent because evaluating a partial script
// twice can leave an inconsistent runtime.


SFLoaderPlugin.prototype.getPersistentMissingFiles = function (files = this.notFoundFiles) {
  const result = Object.create(null);

  if (!files || typeof files !== 'object' || Array.isArray(files)) {
    return result;
  }

  for (const [name, state] of Object.entries(files)) {
    if (state && typeof state === 'object' && state.js === true) {
      result[name] = {
        js: true
      };
    }
  }

  return result;
}; // A file is missing from one base, not everywhere. A package rule's entry is
// kept under `<package>::<rule>`, so a 404 from a package base never marks the
// same name missing in the Smart base -- or the other way round, which matters
// while a component moves from Core into a package under the same rule name.
// Smart-base entries keep their bare name, the format browsers already hold.


SFLoaderPlugin.prototype.getMissingFileKey = function (name) {
  const packageName = this.findPlugins?.[name]?.package;
  return packageName ? `${packageName}${PACKAGE_MISS_SEPARATOR}${name}` : name;
};

SFLoaderPlugin.prototype.addToMissingFiles = function (pluginName, type, missingMin = true) {
  const name = this.getMissingFileKey(pluginName);

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

  safeSetItem('SF_MISSING_PLUGINS', (0,_cacheCodec__WEBPACK_IMPORTED_MODULE_0__.encodeCacheValue)(JSON.stringify(this.getPersistentMissingFiles())));
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
  const src = this.versionAssetUrl(pluginURL); // A sheet the page already links (in either form) is not linked again: a
  // standard page links the sheets its first paint needs in <head>, and the
  // Loader added a second <link> for each one its parts named -- 62 of 73 on
  // the admin's list, every rule twice in every style recalculation of the
  // opening (stand 25). The Loader waits for the page's link instead.
  // Only the page's own links: one the Loader inserted is its own load, and
  // a failed one is tried again in its other form (insertStyle's callers).

  return onceByUrl('styles', src, () => {
    const linked = typeof document !== 'undefined' ? linkedSheet(src) : null;
    return linked && !linked.hasAttribute?.('data-sf-loader-link') ? pageSheetLoaded(linked, pluginURL) : this.insertStyle(src, pluginURL);
  });
}; // A sheet the page linked: settled when it is applied, refused when it failed
// (the caller then asks for its other form, as for a sheet the Loader links).


function pageSheetLoaded(link, pluginURL) {
  if (link.sheet) return Promise.resolve();
  return new Promise((resolve, reject) => {
    link.addEventListener('load', () => resolve(), {
      once: true
    });
    link.addEventListener('error', () => reject(new Error(`Failed to load styles: ${pluginURL}`)), {
      once: true
    });
  });
}

SFLoaderPlugin.prototype.insertStyle = function (src, pluginURL) {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('link');
    style.href = src;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.setAttribute?.('data-sf-loader-link', '');
    style.addEventListener('load', () => {
      resolve();
    }, {
      once: true
    });
    style.addEventListener('error', () => {
      style.remove();
      reject(new Error(`Failed to load styles: ${pluginURL}`));
    }, {
      once: true
    }); // The sheets asked for in one task go into <head> together, at the end
    // of it: one change of the page's sheet list, not one per sheet.

    this.pendingStyleLinks = this.pendingStyleLinks || [];
    this.pendingStyleLinks.push(style);

    if (this.pendingStyleLinks.length === 1) {
      Promise.resolve().then(() => {
        const links = this.pendingStyleLinks.splice(0);
        head.append(...links);
      });
    }
  });
}; // One insertion per asset URL, shared by every Loader on the page
// (simai/ui-source#12 follow-up). A dependency named by several plugins --
// badges, by sf-avatar, sf-icon, sf-icon-button and sf-badge -- had its script
// inserted once per plugin, and a runtime with module-scope state then ran
// once per copy. The registry lives on a shared global, not in this module,
// because each bundle carries its own copy of the module: a pending load hands
// back the same promise, a loaded one stays resolved, a failed one is
// forgotten so a later call may try again.


const ASSET_REGISTRY = Symbol.for('simai.sf.loader.assets');

function assetRegistry() {
  const scope = globalThis;

  if (!scope[ASSET_REGISTRY]) {
    Object.defineProperty(scope, ASSET_REGISTRY, {
      value: {
        scripts: new Map(),
        styles: new Map()
      },
      configurable: true
    });
  }

  return scope[ASSET_REGISTRY];
}

function assetKey(src) {
  try {
    return new URL(src, globalThis.document?.baseURI || globalThis.location?.href).href;
  } catch {
    return String(src);
  }
}

function onceByUrl(kind, src, insert) {
  const loads = assetRegistry()[kind];
  const key = assetKey(src);
  const known = loads.get(key);
  if (known) return known;
  const load = insert();
  loads.set(key, load);
  load.catch(() => {
    if (loads.get(key) === load) loads.delete(key);
  });
  return load;
}

SFLoaderPlugin.prototype.preloadScript = function (pluginURL) {
  if (typeof document === 'undefined' || !pluginURL) return;
  const href = this.versionAssetUrl(pluginURL);
  this.preloadedScripts = this.preloadedScripts || new Set();
  if (this.preloadedScripts.has(href)) return;
  this.preloadedScripts.add(href);
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = href;
  document.head.append(link);
};

SFLoaderPlugin.prototype.addScript = function (pluginURL, param = {}) {
  const src = this.versionAssetUrl(pluginURL);
  return onceByUrl('scripts', src, () => this.insertScript(src, pluginURL, param));
};

SFLoaderPlugin.prototype.insertScript = function (src, pluginURL, param = {}) {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => {
      resolve();
    });
    script.addEventListener('error', () => {
      // The other form of the file, once: the readable one when the minified
      // was asked for and is missing, the minified one when debug asked for
      // the readable one and the distribution ships only the minified (the
      // npm package does, simai/ui-source#8). Sheets already did this; scripts
      // went one way only, so ?sf-debug left every Smart tag undefined.
      const other = param?.otherFormTried ? null : otherForm(pluginURL);

      if (other) {
        script.remove();
        this.addScript(other, { ...param,
          otherFormTried: true
        }).then(resolve, reject);
        return;
      }

      reject(new Error(`Failed to load script: ${pluginURL}`));
    });

    if (param && param.attributes) {
      for (const k in param.attributes) {
        script.setAttribute(k, param.attributes[k]);
      }
    } // Smart definitions wait for the next frame in a batch (smart-base); a
    // script asked for now may name them as relations, and a relation is
    // defined before the element that names it runs.


    globalThis[Symbol.for('simai.sf.smart-base.definitions')]?.flush?.();
    head.append(script);
  });
};

SFLoaderPlugin.prototype.setPreloaderParams = function () {
  if (this.params.preloader) {
    for (const key in this.params.preloader) {
      this.preloader[key] = this.params.preloader[key];
    }
  }

  this.contentPreloader = this.params.contentPreloader ? this.params.contentPreloader : (0,_preloader__WEBPACK_IMPORTED_MODULE_9__.createPreloaderContent)(this.preloader);
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

  return (0,_stableHash__WEBPACK_IMPORTED_MODULE_1__["default"])(pageUrl).substring(0, 16);
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

SFLoaderPlugin.prototype.endSearch = function () {
  this.searchEnd = true;
  this.flushObservedChanges?.();
}; // The search ends at the window's load. The Loader is a chunk of its own and
// can prepare after load has fired -- and a Turbo visit prepares with no load
// to come -- and listening for it then waited forever: searchEnd stayed false
// and every element added to the page from then on was queued where nothing
// read it. A component inserted later never loaded, one page in two
// (loader-packages.browser.mjs saw it as a flaky case). A load already past
// ends the search on the next task.


SFLoaderPlugin.prototype.scheduleSearchEnd = function () {
  if (document.readyState === 'complete') {
    setTimeout(() => this.endSearch(), 0);
  } else if (!this.searchEndListening) {
    this.searchEndListening = true;
    window.addEventListener('load', () => {
      this.searchEndListening = false;
      this.endSearch();
    }, {
      once: true
    });
  }
};

SFLoaderPlugin.prototype.prepare = function (observer = null) {
  let PluginList = [];
  this.logTiming('prepare start');
  this.searchEnd = false;
  this.scheduleSearchEnd();
  this.checkTheme();

  if (this.standAlone) {
    const localMissingPlugins = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().getItem('SF_MISSING_PLUGINS');

    try {
      this.notFoundFiles = localMissingPlugins ? this.getPersistentMissingFiles(JSON.parse((0,_cacheCodec__WEBPACK_IMPORTED_MODULE_0__.decodeCacheValue)(localMissingPlugins))) : {};
    } catch (e) {
      console.warn(e);
    }
  }

  let plugins = this.productionPlanActive ? null : (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().getItem(`SF_PLUGIN_LIST-${this.urlHash}`); // fallback: если есть bundle-id, пробуем его ключ даже в standAlone

  if (!this.productionPlanActive && !plugins && window.BUNDLE_ID) {
    plugins = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().getItem(`SF_PLUGIN_LIST-${window.BUNDLE_ID}`);
  }

  if (!this.standAlone) {
    this.firstLoad = !window.BUNDLE_LOADED;
  } else {
    this.firstLoad = typeof plugins !== 'string';
  }

  this.findShortCodes(document.body);

  if (plugins) {
    try {
      PluginList = JSON.parse((0,_cacheCodec__WEBPACK_IMPORTED_MODULE_0__.decodeCacheValue)(plugins));
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
    } // The elements first: they ask for their modules at once. The page's
    // attributes are read in slices after the observer is on (search), so
    // the load is not one long task and nothing added meanwhile is missed.
    // Each step after the first in a task of its own: together they were
    // one task of 100-130 ms at 4x CPU (searchRegexp's getLoader alone 60).


    this.scanCustomElements(document.body);
    this.search();
    (async () => {
      await yieldToPage();
      this.scanStaticIcons(document.body);
      this.searchAttr(false);
      await yieldToPage();
      this.searchRegexp('');
      await this.scanAttributesInSlices(document.body);

      if (Object.keys(this.module || {}).length) {
        this.getLoader(this.module, true);
      }

      this.revalidateMissingPlugins();
      this.logTiming('onWindowLoad search done');
    })().catch(error => console.warn('SFLoader: the page scan failed', error));
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
}; // A hidden tab pauses requestAnimationFrame, and a tab can be hidden for its
// whole load: opened in the background, restored with a session, or behind
// another window. Scheduling the loader's work through rAF alone meant such a
// tab waited to be shown before anything was mutated -- the bootstrap included
// -- so it showed un-upgraded markup indefinitely. A consumer found it as a
// filter window whose rows had no radio and no label: their automation tab is
// hidden, and the module arrived about five seconds after the window opened.
// A timer runs in a hidden tab, so that is what a hidden tab gets. No caller
// uses the handle either of them returns.
//
// A frame is not promised either: an iframe out of view (a documentation
// example below the fold) gets none while its document is still «visible», and
// the work waited for a frame that never came -- tags created there stayed
// undefined until someone scrolled (DEV, 2026-10-15). So the work runs on the
// frame or on a short timer, whichever comes first, and once.


const LOADER_FRAME_FALLBACK_MS = 100;

function scheduleLoaderWork(fn) {
  if (typeof document !== 'undefined' && document.hidden) {
    return setTimeout(fn, 0);
  }

  let done = false;
  let timer = null;

  const run = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    fn();
  };

  const frame = requestAnimationFrame(run);
  timer = setTimeout(run, LOADER_FRAME_FALLBACK_MS);
  return frame;
} // The Loader's walks give the page back between slices (stand 25, D9: a
// 378 ms task at the window's load and a 241-498 ms one per batch of rows on
// the admin at 4x CPU). A slice ends after SLICE_MS of work; the rest runs in
// a task of its own, before other queued work when the browser has
// scheduler.yield, and on a message otherwise (a timer in a hidden tab is
// throttled to a second).


const SLICE_MS = 16;

function yieldToPage() {
  if (typeof globalThis.scheduler?.yield === 'function') {
    return globalThis.scheduler.yield();
  }

  return new Promise(resolve => {
    const channel = new MessageChannel();

    channel.port1.onmessage = () => {
      channel.port1.close();
      resolve();
    };

    channel.port2.postMessage(null);
  });
}

function sliceClock() {
  const now = () => globalThis.performance?.now ? performance.now() : Date.now();

  let deadline = now() + SLICE_MS;
  return {
    due: () => now() >= deadline,

    async next() {
      await yieldToPage();
      deadline = now() + SLICE_MS;
    }

  };
}

SFLoaderPlugin.prototype.mutate = function (fn) {
  return scheduleLoaderWork(fn);
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
        this.endSearch();
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
    scheduleLoaderWork(bootstrapPrepare);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      scheduleLoaderWork(bootstrapPrepare);
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
  this.scheduleSearchEnd();

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

  if (normalized.startsWith('sf-')) return normalized; // A package's own element is named in full; a short name is a Framework one.

  if (globalThis.SF?.Loader?.getCustomElementRules?.()[normalized]) return normalized;
  return `sf-${normalized}`;
}

function normalizeWhenDefinedInput(input = []) {
  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === 'string') {
    return [input];
  }

  return Array.from(arguments).filter(Boolean);
} // A short name the rules do not know yet may be a package's own element whose
// rules have not loaded (acme-counter) or a Framework one (data-view ->
// sf-data-view). It used to be read as the Framework's, and
// SF.whenDefined('acme-counter') waited forever for sf-acme-counter. Until the
// rules say, whichever of the two is defined first is the element; a name with
// no hyphen can only be the Framework's.


function definedTag(input) {
  const tag = normalizeSmartTagName(input);
  const short = String(input || '').trim().toLowerCase();

  if (!tag || tag === short || !short.includes('-')) {
    return window.customElements.whenDefined(tag).then(() => tag);
  }

  return Promise.race([window.customElements.whenDefined(short).then(() => short), window.customElements.whenDefined(tag).then(() => tag)]);
}

function whenSmartDefined() {
  const inputs = normalizeWhenDefinedInput.apply(null, arguments).filter(input => normalizeSmartTagName(input));

  if (!inputs.length) {
    return Promise.resolve([]);
  }

  if (!window.customElements?.whenDefined) {
    return Promise.resolve(inputs.map(normalizeSmartTagName));
  }

  return Promise.all(inputs.map(definedTag));
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
      // Modal and drawer lifecycle events bubble; a handler given to create()
      // belongs to this element and must not hear a nested modal or drawer.
      const handler = /^(modal|drawer):/.test(eventName) ? event => {
        if (event.target === element) value.call(element, event);
      } : value;
      element.addEventListener(eventName, handler);

      if (!element.__sfCreateEventHandlers) {
        Object.defineProperty(element, '__sfCreateEventHandlers', {
          configurable: true,
          enumerable: false,
          value: []
        });
      }

      element.__sfCreateEventHandlers.push({
        eventName,
        handler
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
} // Loads a rule by its name -- a component, a Smart element, a lazy relation --
// unless it is loaded or on its way.
// The style gate (smart-base whenRenderedStylesReady, stand 25 D2): a Smart
// element draws visibly only once the sheets it draws with are applied -- its
// own sheet and those of the components and utilities it relates to (not the
// lazy ones). A sheet already linked in <head> and loaded counts at once, so
// a page that links its parts' sheets pays nothing; a sheet linked but on its
// way is waited for; one nobody asked for yet is asked for now (autoLoad;
// without it, it is not waited for: a printed first paint waits only for what
// the page linked),
// through addStyle, which the Loader's own request then shares. A sheet that
// fails to load does not hold the element. Settles per tag, once.


SFLoaderPlugin.prototype.styleSheetsOfRule = function (requested, visited = new Set()) {
  const sheets = []; // The module the Loader itself would load under this name (setExistCookie).

  const name = requested ? (0,_utilityModuleAliases__WEBPACK_IMPORTED_MODULE_7__.resolveUtilityModule)(requested, _contracts_utility_module_aliases_v1_json__WEBPACK_IMPORTED_MODULE_4__.aliases, this.findPlugins, this.productionPlanActive) : requested;
  if (!name || visited.has(name)) return sheets;
  visited.add(name);
  const rule = this.findPlugins?.[name];
  if (!rule || typeof rule !== 'object') return sheets;
  const type = rule.type === 'smart' ? 'smart' : rule.type === 'component' || rule.type === 'attribute' ? 'component' : 'utility';

  if (rule.css === true || type === 'utility' && rule.css !== false) {
    const point = name.includes('/') ? name.split('/').pop() : 'default';
    const unit = type === 'utility' && !name.includes('/') ? `${name}/${point}` : name;
    const file = this.pathPluginCss(unit, type, point);
    if (file) sheets.push(file);
  }

  const drawnWith = type === 'smart' ? (_template_utilities_generated_json__WEBPACK_IMPORTED_MODULE_6__[name] || []).map(key => ({
    name: key
  })) : [];
  [...(Array.isArray(rule.relation) ? rule.relation : []), ...drawnWith].forEach(relation => {
    if (!relation?.name || relation.lazy === true) return;
    const target = this.ruleForwards?.[relation.name] || relation.name;
    sheets.push(...this.styleSheetsOfRule(target, visited));
  });
  return sheets;
}; // The page's stylesheet links by path (either form, minified or readable),
// read again only when the list of links has changed.


let linkedSheets = {
  count: -1,
  byPath: new Map()
};

function linkedSheet(href) {
  let path;

  try {
    path = new URL(href, document.baseURI).pathname;
  } catch {
    return null;
  }

  const links = document.querySelectorAll('link[rel~="stylesheet"][href]');

  if (linkedSheets.count !== links.length) {
    const byPath = new Map();
    links.forEach(link => {
      try {
        byPath.set(new URL(link.href, document.baseURI).pathname, link);
      } catch {// not a URL: not a sheet the Loader names
      }
    });
    linkedSheets = {
      count: links.length,
      byPath
    };
  }

  return linkedSheets.byPath.get(path) || linkedSheets.byPath.get(otherForm(path)) || null;
}

function sheetApplied(link) {
  if (link.sheet) return Promise.resolve();
  return new Promise(resolve => {
    link.addEventListener('load', () => resolve(), {
      once: true
    });
    link.addEventListener('error', () => resolve(), {
      once: true
    });
  });
} // A sheet in the form asked for, else its other form (minified or readable),
// as loadPlugin does; settles either way.


SFLoaderPlugin.prototype.addStyleEitherForm = function (file) {
  return this.addStyle(file).catch(() => {
    const other = otherForm(file);
    return other ? this.addStyle(other) : null;
  }).catch(() => {});
};

SFLoaderPlugin.prototype.ensureStylesReady = function (element, {
  autoLoad = true
} = {}) {
  const tagName = element?.localName || '';
  const ruleName = tagName ? this.getCustomElementRules()[tagName] : '';
  if (!ruleName) return Promise.resolve(true);
  this.styleGates = this.styleGates || new Map();
  const known = this.styleGates.get(ruleName);
  if (known) return known;
  const waits = this.styleSheetsOfRule(ruleName).map(file => {
    const linked = linkedSheet(file);
    if (linked) return sheetApplied(linked);
    if (!autoLoad) return Promise.resolve();
    return this.addStyleEitherForm(file);
  });
  const gate = Promise.all(waits).then(() => true); // Without autoLoad only the linked sheets were waited for: not kept, so a
  // later call that may ask for the rest still does.

  if (autoLoad) this.styleGates.set(ruleName, gate);
  return gate;
};

SFLoaderPlugin.prototype.ensurePlugin = function (name) {
  const key = String(name || '').trim();
  if (!key || !this.findPlugins?.[key]) return false;
  this.loadScriptOnCall(key);
  if (this.module[key]) return true;
  this.setExistCookie(key);
  this.mutate(() => this.getLoader(this.module, true));
  return true;
}; // A rule whose script serves only an API (`js: false, jsOnCall: true`): its
// class on the page fetches the sheet alone, and the script comes when the API
// is called -- a shortcode, or SF.Loader.ensurePlugin(name). The skeleton is
// the first: its bars are CSS and show before any code; the script is the
// constructor behind [!skeleton ...] (simai/ui-source#47).


SFLoaderPlugin.prototype.loadScriptOnCall = function (name) {
  const rule = this.findPlugins?.[name];
  if (!rule || rule.jsOnCall !== true || this.ComponentRegistry?.[name]) return false;
  const type = rule.type === 'component' || rule.type === 'attribute' ? 'component' : 'utility';
  const file = this.pathPluginJs(name, false, name, type);
  if (!file) return false;
  this.addScript(file).catch(error => console.warn(error));
  return true;
}; // The lazy relations, fetched after the page is ready while the browser is
// idle, a few at a time. Only on a page that asks for it
// (SF_BOOT_CONFIG.prefetchLazyRelations = true): by default a lazy relation is
// fetched when it is first used.


SFLoaderPlugin.prototype.prefetchLazyRelations = function () {
  const pending = [...this.lazyRelations].filter(name => !this.module[name]);
  if (!pending.length) return;
  const idle = globalThis.requestIdleCallback ? fn => globalThis.requestIdleCallback(fn, {
    timeout: 2000
  }) : fn => setTimeout(fn, 200);

  const step = () => {
    const batch = pending.splice(0, 4);

    for (const name of batch) this.ensurePlugin(name);

    if (pending.length) idle(step);
  };

  idle(step);
};

SFLoaderPlugin.prototype.ensureSmartElementLoaded = function (tagName) {
  const normalizedTag = String(tagName || '').trim().toLowerCase();

  if (!normalizedTag.includes('-')) {
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

SF.Loader = new SFLoaderPlugin(props); // Read live: SF.loadSmartBase() replaces the Loader's promise, and a copy taken
// here once would never see it.

Object.defineProperty(SF, 'smartBaseReady', {
  configurable: true,
  enumerable: true,
  get: () => SF.Loader.smartBaseReady || Promise.resolve(SF.smart || null)
});

SF.loadSmartBase = function loadSmartBase() {
  return SF.Loader.loadSmartBase();
}; // The field renderer set is a module, not an element: no tag brings it, so a
// page that renders fields without a composite that carries the set used to
// add the script by hand and poll for SF.fieldRenderers. This asks for it once,
// from the Smart base, and settles with the set when it has published itself
// -- from this script or from any bundle that carries a copy of it.


let fieldRenderersReady = null;

SF.whenFieldRenderers = function whenFieldRenderers() {
  if (SF.fieldRenderers?.renderEditField) return Promise.resolve(SF.fieldRenderers);
  if (fieldRenderersReady) return fieldRenderersReady;
  fieldRenderersReady = new Promise((resolve, reject) => {
    const settle = () => {
      if (!SF.fieldRenderers?.renderEditField) return false;
      document.removeEventListener('sf-field-renderers-ready', settle);
      resolve(SF.fieldRenderers);
      return true;
    };

    document.addEventListener('sf-field-renderers-ready', settle);
    if (settle()) return;
    const asked = [...document.scripts].some(script => /\/field-renderers\/js\/field-renderers(?:\.min)?\.js(?:[?#]|$)/u.test(script.src));
    if (asked) return;
    SF.loadRuntime?.();
    const loader = SF.Loader;
    loader.addScript(`${loader.smartPath}/field-renderers/js/field-renderers${loader.minified ? '.min' : ''}.js`).then(() => settle()).catch(error => {
      fieldRenderersReady = null;
      document.removeEventListener('sf-field-renderers-ready', settle);
      reject(error);
    });
  });
  return fieldRenderersReady;
};

SF.create = createSmartElement;
SF.createAsync = createSmartElementAsync;

SF.__internal.litHtml = (tagName, props = {}) => {
  if (!/^sf-[a-z0-9-]+$/.test(tagName) && !SF.Loader.getCustomElementRules()[tagName]) {
    tagName = `sf-${tagName}`;

    if (!/^sf-[a-z0-9-]+$/.test(tagName)) {
      throw new Error(`Invalid SF tag name: ${tagName}`);
    }
  }

  const tag = (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_10__.unsafeStatic)(tagName);
  return (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_10__.html)`<${tag} ...=${props}></${tag}>`;
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

/***/ "cda569e6042b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ pageStorage)
/* harmony export */ });
// The page's localStorage, or a store in memory where there is none to have.
//
// A sandboxed document without allow-same-origin -- a documentation example in
// an iframe -- throws on the mere read of window.localStorage, and the Loader,
// which reads it to cache its plugin lists, stopped there: nothing it found was
// ever fetched (DEV, 2026-10-15). In memory the caches live as long as the
// page, which is all such a page can keep anyway.
const memory = new Map();
const memoryStorage = {
  get length() {
    return memory.size;
  },

  key: index => [...memory.keys()][index] ?? null,
  getItem: key => memory.has(key) ? memory.get(key) : null,
  setItem: (key, value) => {
    memory.set(String(key), String(value));
  },
  removeItem: key => {
    memory.delete(String(key));
  },
  clear: () => memory.clear()
};
function pageStorage() {
  try {
    const storage = globalThis.localStorage;
    if (storage) return storage;
  } catch {// Sandboxed: fall through to memory.
  }

  return memoryStorage;
}

/***/ },

/***/ "af3c1d41479b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   stableHash: () => (/* binding */ stableHash)
/* harmony export */ });
function mix(value, seed) {
  let hash = seed >>> 0;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return hash.toString(16).padStart(8, '0');
}
/**
 * Stable non-cryptographic identifier for cache and DOM bookkeeping.
 * It is deliberately local: security decisions must use Web Crypto instead.
 */


function stableHash(value) {
  const source = String(value ?? '');
  return `${mix(source, 0x811c9dc5)}${mix(source, 0x9e3779b9)}`;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stableHash);

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
  } // items-start|end|center|stretch are the Framework's own place-items classes
  // (utility/place-items), not Tailwind's align-items: rewriting them to
  // items-cross-* dropped justify-items in a grid (docs trial 5). Only
  // items-baseline, which the Framework does not name, is Tailwind's.


  if (base === 'items-baseline') {
    return 'items-cross-baseline';
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

/***/ },

/***/ "98e08d2c9eb6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveUtilityModule: () => (/* binding */ resolveUtilityModule)
/* harmony export */ });
// Only compiled, verified compatibility records participate in auto discovery.
// A pinned production asset plan owns its own URLs and is never rewritten here.
function resolveUtilityModule(name, aliases, rules, productionPlanActive = false) {
  if (productionPlanActive || !Object.hasOwn(aliases, name)) return name;
  const visited = new Set();
  let current = name;

  while (Object.hasOwn(aliases, current)) {
    if (visited.has(current)) return name;
    visited.add(current);
    const next = aliases[current];
    if (typeof next !== 'string' || !/^[a-z][a-z0-9-]*\/(default|sm|md|lg|xl|xxl)$/.test(next) || next.split('/')[1] !== current.split('/')[1]) return name;
    const source = rules[current],
          target = rules[next];
    if (!source || !target || source.type && source.type !== 'utility' || target.type && target.type !== 'utility') return name;
    current = next;
  }

  return current;
}

/***/ },

/***/ "f550d360fd36"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ j),
/* harmony export */   html: () => (/* binding */ b),
/* harmony export */   mathml: () => (/* binding */ T),
/* harmony export */   noChange: () => (/* binding */ E),
/* harmony export */   nothing: () => (/* binding */ A),
/* harmony export */   render: () => (/* binding */ D),
/* harmony export */   svg: () => (/* binding */ w)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t=>t,s=t.trustedTypes,e=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),T=x(3),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o+x):s+o+(-2===d?i:x)}return[V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t)}else t.startsWith(o)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o),i=t.length-1;if(i>0){r.textContent=s?s.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c())}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else{let t=-1;for(;-1!==(t=r.data.indexOf(o,t+1));)d.push({type:7,index:l}),t+=o.length-1}l++}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n]}o!==r?.index&&(h=P.nextNode(),o++)}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i(t).nextSibling;i(t).remove(),t=s}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r}o&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class I extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class L extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const j={M:h,P:o,A:n,C:1,L:N,R,D:d,V:M,I:k,H,N:L,U:z,B:I,F:Z},B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{})}return h._$AI(t),h};
//# sourceMappingURL=lit-html.js.map


/***/ },

/***/ "ba5a8db95d92"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* binding */ u),
/* harmony export */   literal: () => (/* binding */ i),
/* harmony export */   mathml: () => (/* binding */ $),
/* harmony export */   svg: () => (/* binding */ c),
/* harmony export */   unsafeStatic: () => (/* binding */ s),
/* harmony export */   withStatic: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const a=Symbol.for(""),o=t=>{if(t?.r===a)return t?._$litStatic$},s=t=>({_$litStatic$:t,r:a}),i=(t,...r)=>({_$litStatic$:r.reduce((r,e,a)=>r+(t=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(e)+t[a+1],t[0]),r:a}),l=new Map,n=t=>(r,...e)=>{const a=e.length;let s,i;const n=[],u=[];let c,$=0,f=!1;for(;$<a;){for(c=r[$];$<a&&void 0!==(i=e[$],s=o(i));)c+=s+r[++$],f=!0;$!==a&&u.push(i),n.push(c),$++}if($===a&&n.push(r[a]),f){const t=n.join("$$lit$$");void 0===(r=l.get(t))&&(n.raw=n,l.set(t,r=n)),e=u}return t(r,...e)},u=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.html),c=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.svg),$=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.mathml);
//# sourceMappingURL=static.js.map


/***/ },

/***/ "ee5035470810"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.html),
/* harmony export */   literal: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.literal),
/* harmony export */   mathml: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.mathml),
/* harmony export */   svg: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.svg),
/* harmony export */   unsafeStatic: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.unsafeStatic),
/* harmony export */   withStatic: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.withStatic)
/* harmony export */ });
/* harmony import */ var lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ba5a8db95d92");

//# sourceMappingURL=static-html.js.map


/***/ },

/***/ "8a67fe9caf0a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"version":1,"$comment":"Former Smart bundle names the Loader still answers to. A forward is not a rule in the distribution (a rule of type smart is a Smart component to the registry, and a forward has no element); the Loader installs it at start as a rule with no tags, no assets and one relation, the new name, unless a rule of that name is already defined, and a relation that names a forward is taken as its target, so the element waits for the bundle itself. Each forward is dated and has a change journal record; remove it on remove_after.","forwards":{"cl-inputs":{"to":"cl-input","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-inputs-to-input"},"cl-buttons":{"to":"cl-button","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-buttons-to-button"},"cl-icon-buttons":{"to":"cl-icon-button","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-icon-buttons-to-icon-button"},"cl-icons":{"to":"cl-icon","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-icons-to-icon"},"cl-badges":{"to":"cl-badge","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-badges-to-badge"},"cl-tags":{"to":"cl-tag","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-tags-to-tag"}}}');

/***/ },

/***/ "b3ed17287563"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"version":1,"aliases":{"column-gap/default":"gap/default","column-gap/sm":"gap/sm","column-gap/md":"gap/md","column-gap/lg":"gap/lg","column-gap/xl":"gap/xl","column-gap/xxl":"gap/xxl"}}');

/***/ },

/***/ "e7acc025fab1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"cl-accordion":["display/default","flex-direction/default","gap/default","position/default"],"cl-alert":["display/default","flex-direction/default","flex-wrap/default","flex/default","place-items/default","position/default"],"cl-avatar":["align-items/default","background-color/default","display/default","element-position/default","flex-direction/default","flex/default","height/default","justify-content/default","overflow/default","place-items/default","position/default","text-overflow/default","transition-property/default","white-space/default","width/default"],"cl-avatars":["align-items/default","display/default","flex-direction/default","position/default"],"cl-badge":["display/default","flex-direction/default","flex-wrap/default","justify-content/default","place-items/default","position/default","sr-only/default"],"cl-breadcrumbs":["align-items/default","container/default","display/default","position/default","visibility/default"],"cl-button":["align-items/default","display/default","flex/default","pointer-events/default"],"cl-button-group":["align-items/default","display/default","isolate/default","pointer-events/default","position/default","text-align/default"],"cl-checkbox":["cursor/default","display/default","flex-direction/default","position/default","transition-property/default"],"cl-close":["display/default","justify-content/default","place-items/default"],"cl-code-input":["position/default","sr-only/default"],"cl-color":["display/default","position/default"],"cl-contents":["display/default","isolate/default","position/default","resize/default","width/default"],"cl-context-menu":["display/default","flex-direction/default","flex/default","position/default","text-decoration/default"],"cl-copy-button":["display/default","position/default"],"cl-country-code":["display/default","flex-direction/default","place-items/default","position/default","transition-property/default"],"cl-datepicker":["align-content/default","align-items/default","display/default","element-position/default","flex-direction/default","font-transform/default","gap/default","grid-template-columns/default","isolate/default","justify-content/default","overflow/default","position/default","resize/default"],"cl-download-file":["cursor/default","display/default","transition-property/default"],"cl-drawer":["display/default","isolate/default","justify-content/default","margin/default","place-items/default","position/default","resize/default","visibility/default"],"cl-dropdown":["align-items/default","background-color/default","background-size/default","cursor/default","display/default","flex-direction/default","flex-wrap/default","flex/default","place-items/default","position/default","resize/default","transition-property/default","visibility/default"],"cl-empty-state":["display/default","isolate/default","position/default"],"cl-file-preview":["isolate/default","position/default"],"cl-file-upload":["align-items/default","align-self/default","cursor/default","display/default","flex-direction/default","flex/default","gap/default","grid-template-columns/default","justify-content/default","justify-items/default","position/default","width/default"],"cl-gallery":["align-items/default","backdrop-filter-blur/default","background-color/default","border-radius/default","border-width/default","box-shadow/default","display/default","filter-blur/default","flex-direction/default","gap/default","height/default","justify-content/default","margin/default","max-width/default","min-height/default","min-width/default","padding/default","position/default","text-color/default","width/default"],"cl-help-mark":["display/default","isolate/default"],"cl-icon":["font-weight/default","position/default"],"cl-icon-button":["align-items/default","display/default","pointer-events/default"],"cl-image-field":["position/default"],"cl-input":["align-items/default","display/default","flex-direction/default","position/default","text-align/default","transition-property/default"],"cl-list-item":["align-items/default","background-color/default","background-size/default","cursor/default","display/default","flex-direction/default","flex-wrap/default","flex/default","gap/default","justify-content/default","place-items/default"],"cl-lookup":["align-items/default","display/default","flex-direction/default","flex-wrap/default","flex/default","isolate/default","justify-content/default","overflow/default","position/default"],"cl-menu":["display/default","isolate/default","position/default","resize/default","text-max-width/default"],"cl-modal":["align-items/default","backdrop-filter-blur/default","border-radius/default","border-width/default","display/default","element-position/default","filter-blur/default","flex-direction/default","flex-wrap/default","font-size/default","gap/default","height/default","justify-content/default","margin/default","min-width/default","overflow/default","padding/default","place-items/default","position/default","text-color/default","title/default","width/default","z-index/default"],"cl-page-header":["align-items/default","display/default","flex-direction/default","flex-grow/default","flex-wrap/default","margin/default","min-width/default","text-overflow/default"],"cl-pager":["position/default","sr-only/default"],"cl-pagination":["align-items/default","display/default","flex-direction/default","justify-content/default","position/default"],"cl-popover":["display/default","position/default"],"cl-profile-picker":["display/default","position/default"],"cl-progress-bar":["align-items/default","display/default","flex-direction/default","position/default","transition-property/default"],"cl-progress-ring":["display/default","position/default"],"cl-progress-scale":["align-items/default","display/default","flex-direction/default","grid-template-columns/default","overflow/default","position/default"],"cl-quantity":["display/default","filter-blur/default","flex-direction/default","flex-wrap/default","justify-content/default","place-items/default","position/default"],"cl-radio":["align-items/default","display/default","flex-direction/default","justify-content/default","position/default","transition-property/default"],"cl-range-slider":["flex/default","isolate/default","position/default"],"cl-reference-link":["align-items/default","display/default"],"cl-resizer":["display/default","position/default","resize/default","text-max-width/default"],"cl-rich-text":["align-items/default","container/default","display/default","flex-direction/default","flex-wrap/default","font-style/default","font-weight/default","position/default"],"cl-search":["display/default","sr-only/default"],"cl-site-header":["container/default","display/default","margin/default","position/default","width/default"],"cl-skeleton":["animation/default","display/default","flex/default","position/default"],"cl-slider":["background-color/default","border-radius/default","display/default","padding/default","position/default","text-color/default"],"cl-spinner":["position/default","stroke-color/default"],"cl-steps":["cursor/default","display/default","flex-direction/default","justify-content/default","place-items/default","position/default"],"cl-switch":["align-items/default","display/default","flex-direction/default","justify-content/default","position/default","transition-property/default"],"cl-tabs":["container/default","display/default","flex-direction/default","position/default","resize/default","visibility/default"],"cl-tag":["background-size/default","display/default","flex-direction/default","flex-wrap/default","justify-content/default","min-width/default","place-items/default","position/default"],"cl-textarea":["display/default","flex-direction/default","isolate/default","position/default","transition-property/default"],"cl-toast":["align-items/default","display/default","flex-direction/default","flex/default","justify-content/default","place-items/default","position/default"],"cl-toggle":["display/default","justify-content/default","place-items/default","transition-property/default"],"cl-tooltip":["display/default","flex-direction/default","position/default"],"cl-tree":["display/default","flex-direction/default","isolate/default","resize/default","text-max-width/default"],"cl-tree-item":["align-items/default","container/default","display/default","flex-direction/default","position/default"]}');

/***/ }

}]);