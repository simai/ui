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
/* harmony export */   normalizeIconFontLoadWeight: () => (/* reexport safe */ _icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.normalizeIconFontLoadWeight)
/* harmony export */ });
/* harmony import */ var _page_storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cda569e6042b");
/* harmony import */ var _icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("de1f3481c667");
/* harmony import */ var _icon_glyphs_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a1e33ce15a5e");



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
} // Re-exported: the weight a font loads at is shared with the boot-time
// re-apply of a remembered subset (icon-subset-memory.js).


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
  const defaultIconWeight = "400"; // An icon without a weight of its own draws at the weight of the label
  // beside it (owner decision C151 point 4: the icons sheet lets it inherit
  // font-weight): regular text and medium labels (buttons, tabs, headings).
  // The medium face comes in the same request as the regular one, so an icon
  // by a medium label never waits for a second font. A heavier label draws
  // the nearest face, medium.

  const labelIconWeight = "500";

  const withLabelWeight = weights => {
    const list = [...weights].map(String);

    if (list.includes(defaultIconWeight) && !list.includes(labelIconWeight)) {
      list.push(labelIconWeight);
    }

    return list;
  };

  const iconTypeClassMap = new Map([["sf-icon--rounded", "rounded"], ["sf-icon-rounded", "rounded"], ["sf-icon--sharp", "sharp"], ["sf-icon-shape", "sharp"]]);
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
  }; // An icon drawn in a face the page brought itself. A Docara example frame
  // (data-docara-example-frame) runs the Loader with the subset off and gets
  // its icon faces from the shell -- its own subset family ("Material Symbols
  // Outlined Subset 1923885bcfbd"), "Material Symbols Outlined Full", the
  // catalogue families, Rounded and Sharp -- and marks the icons it draws
  // sf-icon-loaded. The Loader knew only the faces of the plain family (subset
  // off) or of its own subset requests (subset on), so it took the class away
  // on every scan and Docara put it back (about every 104 ms; decision with
  // Docara 2026-11-11, core.runtime 1.54.1). An icon is loaded when the first family of its computed
  // font-family has a loaded face in document.fonts and is not a subset
  // family of the Loader's own: those draw only the names their manifest
  // lists, and the manifest path answers for them. A full face of the icon
  // family the Loader left in document.fonts after a fallback does not count
  // while the icon is drawn in the subset family.
  // Only a family of the icon fonts counts ("Material Symbols Outlined",
  // "Material Symbols Outlined Full", "Docara Symbols Rounded Filled …"):
  // an icon whose own stylesheet is not in yet inherits the text font, and a
  // loaded Inter face must not mark it loaded -- it would spell its name.


  const iconFacePattern = /\bSymbols (Outlined|Rounded|Sharp)\b/;

  const iconFamilyName = value => String(value || "").split(",")[0].replace(/["']/g, "").trim();

  SFLoaderPlugin.prototype.getLoaderIconSubsetFamilies = function () {
    const families = new Set(Object.values(localIconFontFamilies).map(family => `${family} Subset`));
    document.querySelectorAll?.("style[data-sf-icons-subset-family]")?.forEach?.(style => {
      const text = style.textContent || "";
      const pattern = /font-family:\s*(["'])([^"']+)\1/g;
      let match = pattern.exec(text);

      while (match) {
        families.add(match[2].trim());
        match = pattern.exec(text);
      }
    });
    return families;
  }; // The families with a loaded face that are not the Loader's subset
  // families; read once per task, every icon of a scan shares it.


  SFLoaderPlugin.prototype.getPageIconFaceFamilies = function () {
    if (this.pageIconFaceFamilies) return this.pageIconFaceFamilies;
    const fonts = globalThis.document?.fonts;
    const families = new Set();

    if (fonts?.forEach) {
      const own = this.getLoaderIconSubsetFamilies();
      fonts.forEach(face => {
        if (face.status !== "loaded") return;
        const family = iconFamilyName(face.family);

        if (iconFacePattern.test(family) && !own.has(family)) {
          families.add(family);
        }
      });
    }

    this.pageIconFaceFamilies = families;

    const forget = () => {
      this.pageIconFaceFamilies = null;
    };

    if (typeof queueMicrotask === "function") queueMicrotask(forget);else Promise.resolve().then(forget);
    return families;
  };

  SFLoaderPlugin.prototype.isIconDrawnByPageFace = function (el) {
    if (!el || typeof globalThis.getComputedStyle !== "function") return false;
    const families = this.getPageIconFaceFamilies();
    if (!families.size) return false;
    const family = iconFamilyName(globalThis.getComputedStyle(el).fontFamily);
    return Boolean(family) && families.has(family);
  }; // Once: when a page face loads later (loadingdone), or is
  // added already loaded (no font event; looked for every 100 ms for 10 s),
  // the static icons are synced, so an icon drawn in it gets the class once
  // and keeps it. A sync runs only when the set of page faces grew.


  SFLoaderPlugin.prototype.watchPageIconFaces = function () {
    const fonts = globalThis.document?.fonts;
    if (!fonts?.forEach || this.pageIconFaceWatch) return;
    this.pageIconFaceWatch = true;
    let seen = this.getPageIconFaceFamilies().size;

    const check = () => {
      this.pageIconFaceFamilies = null;
      const size = this.getPageIconFaceFamilies().size;
      if (size <= seen) return;
      seen = size;
      this.syncStaticIconLoadedState();
    };

    fonts.addEventListener?.("loadingdone", check);
    const poll = setInterval(check, 100);
    setTimeout(() => clearInterval(poll), 10000);
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
    if (!normalizedValue) return true; // Grade and optical size: a value past the font's design space is the
    // bound it is clamped to; a list or a range ("-25,0", "20..48") is covered
    // when every number it names is.

    const boundsAxis = Object.keys(_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.ICON_AXIS_BOUNDS).find(axis => axis.toLowerCase() === String(axisName).toLowerCase());

    if (boundsAxis) {
      const numbers = (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconAxisNumbers)(normalizedValue).map(number => (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.clampIconAxisValue)(boundsAxis, number));
      if (!numbers.length) return true;

      if (numbers.length > 1 || /,|\.\./u.test(normalizedValue) || String(numbers[0]) !== normalizedValue) {
        return numbers.every(number => this.manifestAxisIncludesValue(manifest, axisName, String(number)));
      }
    }

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
  }; // A disclosure swaps its glyph when it opens or closes (the menus' ⌄ / ⌃,
  // a column's › / ⌄). The glyph it swaps to goes in the same font request
  // as the one drawn, so the swap never waits for a second font with the
  // icon blank: each name here brings its partners along, with the same
  // weight, fill, grade, size and style.


  const iconSwapPartners = Object.freeze({
    keyboard_arrow_down: ["keyboard_arrow_up", "chevron_right"],
    keyboard_arrow_up: ["keyboard_arrow_down"],
    chevron_right: ["keyboard_arrow_down"],
    expand_more: ["expand_less"],
    expand_less: ["expand_more"],
    arrow_drop_down: ["arrow_drop_up"],
    arrow_drop_up: ["arrow_drop_down"]
  });

  SFLoaderPlugin.prototype.trackIconDescriptor = function (icon = "", attrs = {}) {
    const normalizedIcon = String(icon || "").trim();
    let added = this.trackIconDescriptorOnly(normalizedIcon, attrs);
    const partners = Object.hasOwn(iconSwapPartners, normalizedIcon) ? iconSwapPartners[normalizedIcon] : [];
    partners.forEach(partner => {
      added += this.trackIconDescriptorOnly(partner, attrs);
    });
    return added;
  };

  SFLoaderPlugin.prototype.trackIconDescriptorOnly = function (icon = "", attrs = {}) {
    if (!this.isIconSubsetEnabled()) return 0;
    if (this.hasConfiguredIconSubset()) return 0;
    const normalizedIcon = String(icon || "").trim();
    if (!normalizedIcon) return 0; // A registered glyph (SF.icons.register, C151 point 6) is drawn from its
    // SVG; its name never goes to the font.

    if ((0,_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_2__.registeredIcon)(normalizedIcon)) return 0;
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
    let hasNewAttrs = false; // The family goes in as the load key has it, the default one too: a name
    // drawn outlined and rounded on one page was held as rounded alone (an
    // unset type added nothing to the name's families), the outlined request
    // left it out and the outlined glyph drew its letters, reported as "no
    // icon" (content study Z1, 2026-11-16).

    Object.entries({ ...attrs,
      type: loadAttrs.type
    }).forEach(([key, value]) => {
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

  SFLoaderPlugin.prototype.isTrackedIconLoaded = function (tracked, el = null) {
    if (!tracked?.icon) {
      return false;
    }

    if ((0,_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_2__.registeredIcon)(tracked.icon)) return true;
    const loadAttrs = this.getIconLoadAttrs(tracked.attrs); // An icon drawn in a face the page brought itself (a Docara example
    // frame) is loaded once that face is: see isIconDrawnByPageFace.

    if (!this.isIconSubsetEnabled()) {
      if (this.isLocalIconFontReady(loadAttrs.type)) return true;
      if (!el) return false;
      if (this.isIconDrawnByPageFace(el)) return true;
      this.watchPageIconFaces();
      return false;
    }

    if (this.isIconCoveredByManifest(tracked.icon, loadAttrs)) {
      return true;
    }

    if (el && this.isIconDrawnByPageFace(el)) {
      return true;
    }

    if (el) this.watchPageIconFaces();
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
    return el.classList.contains("sf-icon-loaded") === this.isTrackedIconLoaded(tracked, el);
  };

  SFLoaderPlugin.prototype.syncTrackedStaticIconElement = function (el, tracked) {
    if (!el || !tracked || !this.staticIconDescriptorKeys) return;
    const nextKey = this.getLoadedIconDescriptorKey(tracked.icon, tracked.attrs);
    const prevKey = this.staticIconDescriptorKeys.get(el);

    if (prevKey && prevKey !== nextKey && !this.isTrackedIconLoaded(tracked, el)) {
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
    } // sf-icon draws one family, outlined (smart.icon 1.2.0, icons study IC-4):
    // its type rounded and sharp are dated aliases of outlined, and the page
    // is scanned before the element upgrades and rewrites the attribute. Asked
    // for here, those families had no font to load and fell back to the old
    // Material Icons font with a console warning on every load. The class
    // markup families (.sf-icon-rounded, .sf-icon-shape) are untouched: a host
    // that ships their fonts (Docara) still draws them.


    attrs.type = el.localName === "sf-icon" ? "outlined" : this.normalizeIconType(attrs.type || this.getDefaultIconType());
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
    (0,_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_2__.markCustomGlyph)(el, icon);
    (0,_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_2__.markMirrorGlyph)(el, icon);
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
  }; // Called straight from the mutation observer, ahead of its debounce: an
  // icon whose new name is not drawn by the font in place stops being marked
  // loaded, so it waits invisibly instead of spelling its name out.


  SFLoaderPlugin.prototype.holdChangedStaticIcon = function (node) {
    const el = this.getStaticIconElement(node);
    if (!el || !el.classList.contains("sf-icon-loaded")) return;
    const tracked = this.getTrackedStaticIconAttrs(el);

    if (!tracked || !this.isTrackedIconLoaded(tracked, el)) {
      el.classList.remove("sf-icon-loaded");
    }
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
        (0,_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_2__.checkIconGlyph)(el);
      } else {
        el.classList.remove("sf-icon-loaded");
      }
    }; // Every icon is read first, then every class is set (DF-9): a read of an
    // icon's computed font (isIconDrawnByPageFace) after the class of the one
    // before it changed made the browser work out the page's styles again for
    // each icon of the scan.


    const decisions = [];

    const processNode = el => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
      if (el.tagName?.toLowerCase?.() === "sf-icon") return;
      if (el.closest?.("sf-icon")) return;
      if (!el.classList?.contains("sf-icon")) return;
      const tracked = this.getTrackedStaticIconAttrs(el);

      if (!tracked) {
        decisions.push([el, false]);
        return;
      }

      decisions.push([el, this.isTrackedIconLoaded(tracked, el)]);
    };

    this.isSyncingStaticIconState = true;

    try {
      if (host.nodeType === Node.ELEMENT_NODE) {
        processNode(host);
      }

      if (host.querySelectorAll) {
        host.querySelectorAll(".sf-icon").forEach(processNode);
      }

      decisions.forEach(([el, shouldBeLoaded]) => updateLoadedClass(el, shouldBeLoaded));
    } finally {
      this.isSyncingStaticIconState = false;
    }
  }; // The class-markup glyphs a Smart element drew inside a
  // data-sf-observer="ignore" region (2026-11-11). The page scan and the
  // mutation observer pass such a region by, so a bare <i class="sf-icon">
  // there was never asked for and never marked sf-icon-loaded: it waited at
  // font-size 0 for good (an accordion's marker, a menu's icons, a badge's
  // glyph in a documentation example or a loader wrap). The element hands
  // them over after each drawing (smart-base); they are asked for like any
  // static icon and marked when their font is in, now or on the next
  // sf-icons-subset:ready. A glyph of an sf-icon element is its own.
  // Answers the number of new names asked for.


  SFLoaderPlugin.prototype.adoptStaticIcons = function (root = null) {
    if (!root?.querySelectorAll) return 0;
    const glyphs = [];

    const take = el => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
      if (el.tagName?.toLowerCase?.() === "sf-icon") return;
      if (!el.classList?.contains("sf-icon")) return;
      if (el.closest?.("sf-icon")) return;
      glyphs.push(el);
    };

    take(root);
    root.querySelectorAll(".sf-icon").forEach(take);
    if (!glyphs.length) return 0;

    if (!this.adoptedIconsPending) {
      this.adoptedIconsPending = new Set();

      const settle = () => {
        const loaded = [];
        this.adoptedIconsPending.forEach(el => {
          if (!el.isConnected) {
            this.adoptedIconsPending.delete(el);
            return;
          }

          const tracked = this.getTrackedStaticIconAttrs(el);

          if (!tracked) {
            this.adoptedIconsPending.delete(el);
            return;
          }

          if (this.isTrackedIconLoaded(tracked, el)) loaded.push(el);
        });
        loaded.forEach(el => {
          el.classList.add("sf-icon-loaded");
          (0,_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_2__.checkIconGlyph)(el);
          this.adoptedIconsPending.delete(el);
        });
      };

      window.addEventListener("sf-icons-subset:ready", settle);
    } // Read every glyph, then set the classes (as syncStaticIconLoadedState).


    let added = 0;
    const states = glyphs.map(el => {
      const tracked = this.getTrackedStaticIconAttrs(el);
      if (!tracked) return null;

      if (this.isIconSubsetEnabled()) {
        added += this.trackIconDescriptor(tracked.icon, tracked.attrs);
      }

      return this.isTrackedIconLoaded(tracked, el);
    });
    glyphs.forEach((el, index) => {
      const loaded = states[index];

      if (loaded === null) {
        el.classList.remove("sf-icon-loaded");
        this.adoptedIconsPending.delete(el);
      } else if (loaded) {
        el.classList.add("sf-icon-loaded");
        (0,_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_2__.checkIconGlyph)(el);
        this.adoptedIconsPending.delete(el);
      } else {
        // A glyph whose new name the font in place does not draw waits
        // unseen, as holdChangedStaticIcon makes a page icon wait.
        el.classList.remove("sf-icon-loaded");
        this.adoptedIconsPending.add(el);
      }
    });
    if (added > 0) this.mutate(() => this.loadFonts());
    return added;
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
    return (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconManifestFontFamily)(manifest);
  };

  SFLoaderPlugin.prototype.getIconManifestType = function (manifest = {}) {
    return this.normalizeIconType((0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconManifestType)(manifest));
  };

  SFLoaderPlugin.prototype.getIconSubsetSelector = function (manifest = {}) {
    return (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconSubsetSelector)(this.getIconManifestType(manifest));
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
    return `@font-face {\n` + `  font-family: '${fallbackFont.family}';\n` + `  src: url('${url}') format('${fallbackFont.format}');\n` + `  font-style: normal;\n` + `  font-weight: ${fallbackFont.weight};\n` + `  font-display: block;\n` + `}\n\n` + `${selector} {\n` + `  --sf-icon--font-family: '${fallbackFont.family}';\n` + `  font-family: '${fallbackFont.family}';\n` + `  font-feature-settings: 'liga';\n` + `  font-variation-settings: ` + `${_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.ICON_FILL_AXIS}, ` + `'GRAD' var(--sf-icon--grade, 0), ` + `'opsz' var(--sf-icon--optical-size, 24);\n` + `}\n`;
  }; // R074 D-A: the full font is loaded off to the side before its stylesheet
  // goes in. The fallback rule sets every icon of the family in the full
  // face; put in while that face was still on its way, it blanked every icon
  // the subset already drew (font-display: block) until the ~420 KB file
  // arrived, 2.3 s on a slow network. The face is fetched with the FontFace
  // API, joins document.fonts once its file is in, and the stylesheet that
  // follows carries no @font-face of its own. One load per family, shared by
  // the prefetch (loadIconSubsetFamily) and every fallback; a failed load is
  // forgotten, so the next fallback tries again (and the CSS face meanwhile).


  SFLoaderPlugin.prototype.loadIconFallbackFace = function (type = "") {
    const normalizedType = this.normalizeIconType(type || this.getDefaultIconType());
    if (!this.iconFallbackFaceLoads) this.iconFallbackFaceLoads = new Map();

    if (this.iconFallbackFaceLoads.has(normalizedType)) {
      return this.iconFallbackFaceLoads.get(normalizedType);
    }

    if (!this.canPreloadIconFontFaces()) return Promise.resolve(null);
    const cssText = this.buildIconFallbackCss({
      type: normalizedType
    });
    const parsed = this.parseIconFontFaceBlocks(cssText);
    if (!parsed.length) return Promise.resolve(null);
    const faces = parsed.map(({
      family,
      src,
      descriptors
    }) => new window.FontFace(family, src, descriptors));
    const load = Promise.all(faces.map(face => face.load())).then(() => ({
      faces,
      url: this.getIconFallbackFontUrl(normalizedType),
      cssText: cssText.replace(/@font-face\s*{[^}]*}\s*/gim, "").trim()
    })).catch(error => {
      this.iconFallbackFaceLoads?.delete(normalizedType);
      console.warn("SFLoader icon fallback font failed to load", error);
      return null;
    });
    this.iconFallbackFaceLoads.set(normalizedType, load);
    return load;
  };

  SFLoaderPlugin.prototype.applyIconFontFallback = async function (options = {}) {
    const icons = Array.isArray(options.icons) ? options.icons : [];
    const type = this.normalizeIconType(options.type || this.getDefaultIconType());

    const fallbackStyle = () => document.querySelector(`style[data-sf-icons-fallback="${type}"]`);

    let prev = fallbackStyle();
    let preloaded = null;

    if (!prev) {
      preloaded = await this.loadIconFallbackFace(type);
      prev = fallbackStyle(); // The request that timed out answered while the full font was on its
      // way: its subset draws every name, the full font is not needed.

      const generation = Number(options.generation) || 0;

      if (!prev && generation && (this.iconSubsetAppliedGenerations?.get(type) || 0) >= generation) {
        return true;
      }
    }

    if (prev) {
      // The full font already draws this family: it stays as it is. Writing
      // its stylesheet again would make a new face, and every icon it draws
      // would go blank until that face loaded (R074: each name that turns up
      // while the service is slow comes here).
      if (icons.length) {
        const named = new Set(String(prev.getAttribute("data-sf-icons-fallback-icons") || "").split(",").filter(Boolean));
        icons.forEach(icon => named.add(icon));
        prev.setAttribute("data-sf-icons-fallback-icons", [...named].join(","));
      }
    } else {
      const style = document.createElement("style");
      style.setAttribute("data-sf-icons-fallback", type);

      if (icons.length) {
        style.setAttribute("data-sf-icons-fallback-icons", icons.join(","));
      }

      style.setAttribute("data-sf-icons-fallback-url", this.getIconFallbackFontUrl(type));
      const family = iconFallbackFontFiles[type]?.family;

      if (preloaded) {
        preloaded.faces.forEach(face => document.fonts.add(face)); // The faces stay in document.fonts when the subset takes over
        // (the style alone leaves): a later fallback reuses them as they are.

        style.textContent = preloaded.cssText; // The face the browser matches for the family is the loaded one; a
        // same-URL CSS face (the icons stylesheet declares one) is loaded too,
        // from the cache, so no icon waits on it after the rule goes in.

        if (family && icons.length) {
          await Promise.resolve(document.fonts?.load?.(`400 16px "${family}"`, icons.join(" "))).catch(() => {});
        }

        if (fallbackStyle()) return this.applyIconFontFallback(options);
      } else {
        style.textContent = this.buildIconFallbackCss({
          type
        });
      }

      if (!style.textContent) {
        return false;
      }

      document.head.appendChild(style); // No FontFace API, or the face failed: the CSS face is asked for at
      // once (an icon at font-size 0 may not make the browser fetch it).

      if (!preloaded && family && icons.length) {
        document.fonts?.load?.(`400 16px "${family}"`, icons.join(" "))?.catch?.(() => {});
      }
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
    const {
      cssText,
      family,
      weights
    } = (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconSubsetCssFromManifest)(manifest);
    return cssText ? {
      cssText,
      weights
    } : {
      cssText: "",
      family,
      weights
    };
  };

  SFLoaderPlugin.prototype.applyIconManifest = function (manifest = {}, options = {}) {
    if (!this.isIconSubsetEnabled()) return false;
    if (!manifest || typeof manifest !== "object") return false;
    const {
      cssText: builtCssText,
      weights
    } = this.buildIconSubsetCssFromManifest(manifest); // A stylesheet handed in reads the public fill first too (DEV TG-2).

    const cssText = (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.publicIconFillAxis)(options.cssText || builtCssText);
    if (!cssText) return false;
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
    const type = this.getIconManifestType(manifest);
    let prev = document.querySelector(`style[data-sf-icons-subset-family="${type}"]`); // The core runtime already wrote this manifest's stylesheet at boot
    // (icon-subset-memory.js): it is adopted as it stands, so its face, loaded
    // or on its way, is the one the page keeps drawing with.

    const adopted = options.fromCache && prev?.hasAttribute("data-sf-icons-remembered") && prev.getAttribute("data-sf-icons-subset-hash") === String(manifest.hash || "") && prev.getAttribute("data-sf-icons-subset") === icons.join(",") ? prev : null;
    if (adopted) prev = null;
    const style = adopted || document.createElement("style");
    style.setAttribute("data-sf-icons-subset", icons.join(","));
    style.setAttribute("data-sf-icons-subset-family", type);

    if (manifest.hash) {
      style.setAttribute("data-sf-icons-subset-hash", manifest.hash);
    }

    this.setIconManifestForType(type, manifest);
    this.markManifestIconsAsLoaded(manifest);
    this.iconSubsetPending = true;
    this.iconSubsetReady = false;

    const verify = () => Array.isArray(manifest.fonts) && manifest.fonts.length ? this.verifyIconManifestFonts(manifest, {
      icons,
      weights
    }) : this.verifyIconCssFonts(cssText, {
      icons
    });

    let fontVerification;

    if (adopted) {
      // R078: the core runtime fetches a remembered face off the document's
      // load (icon-subset-memory.js) and hands its promise over on the
      // style. It is awaited before the check, and, like a subset request,
      // for no longer than the deadline: a held icon host then draws from the
      // full font instead of leaving every icon blank until it answers.
      const ready = adopted.sfIconFacesReady;

      if (ready && typeof ready.then === "function") {
        const deadlineMs = Math.max(0, Number(this.iconSubsetDeadlineMs) || 0);
        let timer = 0;
        fontVerification = Promise.race([ready, new Promise((resolve, reject) => {
          timer = setTimeout(() => reject(new Error(`remembered icon subset font not loaded after ${deadlineMs} ms`)), deadlineMs);
        })]).finally(() => clearTimeout(timer)).then(verify);
      } else {
        fontVerification = verify();
      }
    } else if (prev && this.canPreloadIconFontFaces()) {
      // A subset that already drew: load the grown face first, then swap.
      fontVerification = this.preloadIconFontFaces(cssText).then(preloaded => {
        style.textContent = preloaded ? preloaded.cssText : cssText;
        if (preloaded) style.sfIconFontFaces = preloaded.faces;
        document.head.appendChild(style);
        return verify();
      });
    } else {
      style.textContent = cssText;
      document.head.appendChild(style);
      fontVerification = verify();
    }

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
        this.retireIconSubsetStyle(prev);
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
      this.retireIconSubsetStyle(style);
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
      const weight = (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.normalizeIconFontLoadWeight)(font.weight || manifest.axes?.wght?.value || defaultIconWeight);
      return document.fonts.load(`${weight} 16px "${family}"`, sampleText);
    }));
    const loadedCount = results.reduce((sum, fontFaces) => sum + fontFaces.length, 0);

    if (!loadedCount) {
      throw new Error("Icon manifest fonts were not loaded");
    } // The face is loaded (document.fonts.load above); document.fonts.ready
    // would wait for every other font of the page as well (R074).


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
  }; // A grown subset replaces the face every icon on the page draws with. Put
  // in as a CSS rule, the new face shadows the old one while its file is on
  // the way, and with font-display: block every icon that already showed goes
  // blank until it arrives. The grown face is loaded off to the side with the
  // FontFace API first and joins document.fonts only once its file is in; the
  // stylesheet that follows carries no @font-face of its own. The faces ride
  // on the style element, a DOM node every bundle's copy of this module sees,
  // so whoever retires the style retires its faces too.


  SFLoaderPlugin.prototype.parseIconFontFaceBlocks = function (cssText = "") {
    const blocks = String(cssText || "").match(/@font-face\s*{[^}]*}/gim) || [];
    return blocks.map(block => {
      const read = name => block.match(new RegExp(`(?:^|[;{\\s])${name}\\s*:\\s*([^;}]+)`, "i"))?.[1]?.trim() || "";

      const family = read("font-family").replace(/^['"]|['"]$/g, "");
      const src = read("src");
      if (!family || !src) return null;
      const descriptors = {};
      const weight = read("font-weight");
      const style = read("font-style");
      const display = read("font-display");
      const unicodeRange = read("unicode-range");
      if (weight) descriptors.weight = weight;
      if (style) descriptors.style = style;
      if (display) descriptors.display = display;
      if (unicodeRange) descriptors.unicodeRange = unicodeRange;
      return {
        family,
        src,
        descriptors
      };
    }).filter(Boolean);
  };

  SFLoaderPlugin.prototype.canPreloadIconFontFaces = function () {
    return typeof window.FontFace === "function" && typeof document.fonts?.add === "function";
  }; // Loads every @font-face of cssText as a FontFace, adds the loaded faces to
  // document.fonts and returns the stylesheet without its @font-face blocks.
  // Returns null when there is nothing to preload or no FontFace API; throws
  // when a face fails to load, as the CSS face would have.


  SFLoaderPlugin.prototype.preloadIconFontFaces = async function (cssText = "") {
    if (!this.canPreloadIconFontFaces()) return null;
    const parsed = this.parseIconFontFaceBlocks(cssText);
    if (!parsed.length) return null;
    const faces = parsed.map(({
      family,
      src,
      descriptors
    }) => new window.FontFace(family, src, descriptors));
    await Promise.all(faces.map(face => face.load()));
    faces.forEach(face => document.fonts.add(face));
    return {
      faces,
      cssText: String(cssText || "").replace(/@font-face\s*{[^}]*}\s*/gim, "").trim()
    };
  };

  SFLoaderPlugin.prototype.retireIconSubsetStyle = function (style) {
    if (!style) return;
    const faces = Array.isArray(style.sfIconFontFaces) ? style.sfIconFontFaces : [];
    faces.forEach(face => document.fonts?.delete?.(face));
    style.sfIconFontFaces = null;
    style.remove?.();
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
    }) => document.fonts.load(`${(0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.normalizeIconFontLoadWeight)(weight)} 16px "${family}"`, sampleText)));
    const loadedCount = results.reduce((sum, fontFaceList) => sum + fontFaceList.length, 0);

    if (!loadedCount) {
      throw new Error("Icon subset CSS fonts were not loaded");
    } // The face is loaded (document.fonts.load above); document.fonts.ready
    // would wait for every other font of the page as well (R074).


    return true;
  };

  SFLoaderPlugin.prototype.isIconSubsetRemembered = function () {
    return (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.isIconSubsetRemembered)(window.SF_BOOT_CONFIG);
  };

  SFLoaderPlugin.prototype.restoreIconManifestFromCache = function () {
    if (!this.isIconSubsetEnabled()) return false;

    if (!this.isIconSubsetRemembered()) {
      ["outlined", "rounded", "sharp"].forEach(type => safeRemoveItem?.(this.getIconManifestStorageKey(type)));
      return false;
    }

    const currentDefaultType = this.getIconSubsetRequestConfig().defaultType;
    const manifest = this.getStoredIconManifest(currentDefaultType);
    if (!manifest) return false; // Only a manifest whose font files are on the configured subset host,
    // with plain icon names, is used again (icon-subset-memory.js).

    const manifestType = this.getIconManifestType(manifest);

    if (manifestType !== currentDefaultType || !(0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.isRememberedIconSubsetUsable)(manifest, {
      hostOrigin: (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconSubsetHostOrigin)(this.getIconSubsetHost(), document.baseURI),
      type: currentDefaultType
    }) || !this.isManifestCoveredByConfiguredSubset(manifest)) {
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
  }; // R074: how long a page waits for the subset service before it draws the
  // names it asked for from the full font. Every request returns a font built
  // for its own list, and the service builds the lists it has not seen one
  // after another: a click that needed a grown subset waited for every list
  // ahead of it, up to ~30 s, with the icon blank all that time and nothing
  // giving up (a slow answer is not an error, so the fallback never ran).
  // After the deadline the full font draws those names and the subset keeps
  // growing in the background; it takes over when it arrives and holds every
  // name the page draws. The background request gives up at the cap.


  SFLoaderPlugin.prototype.iconSubsetDeadlineMs = 3000;
  SFLoaderPlugin.prototype.iconSubsetBackgroundCapMs = 60000; // When a subset request still unanswered starts fetching the full font, so
  // that it is in by the deadline (R074 F1). 0 fetches it with the request.

  SFLoaderPlugin.prototype.iconFallbackPrefetchMs = 1000;

  SFLoaderPlugin.prototype.isIconFallbackActive = function (type = "") {
    const normalizedType = this.normalizeIconType(type || this.getDefaultIconType());
    return Boolean(document.querySelector(`style[data-sf-icons-fallback="${normalizedType}"]`));
  }; // Whether a subset answer holds every name the page draws in that family
  // now (and the filled form when one is drawn): only then may it take over
  // from the full font, whose rule it overrides for every icon of the family.


  SFLoaderPlugin.prototype.isIconSubsetAnswerComplete = function (type = "", icons = [], fill = false) {
    const held = new Set(icons);
    const current = this.getIconSubsetRequestConfigs().find(config => config.defaultType === type);
    if (!current) return true;
    if (current.fill && !fill) return false;
    return current.icons.every(icon => held.has(icon));
  };

  SFLoaderPlugin.prototype.loadIconSubsetFamily = async function (requestConfig) {
    const {
      defaultType: type,
      icons
    } = requestConfig;
    if (!icons.length) return false;
    if (!this.iconSubsetGenerations) this.iconSubsetGenerations = new Map();
    if (!this.iconSubsetRequests) this.iconSubsetRequests = new Map();
    const generation = (this.iconSubsetGenerations.get(type) || 0) + 1;
    this.iconSubsetGenerations.set(type, generation);
    const request = {
      type,
      generation,
      timedOut: false,
      controller: typeof AbortController === "function" ? new AbortController() : null
    };

    if (!this.iconSubsetRequests.has(type)) {
      this.iconSubsetRequests.set(type, new Set());
    }

    this.iconSubsetRequests.get(type).add(request);
    const work = this.requestIconSubsetFamily(requestConfig, request).finally(() => this.iconSubsetRequests.get(type)?.delete(request)); // With the full font already drawing this family, a new name draws from
    // it at once; the grown subset follows in the background.

    const deadlineMs = this.isIconFallbackActive(type) ? 0 : Math.max(0, Number(this.iconSubsetDeadlineMs) || 0);
    const timedOut = Symbol("timed-out");
    let timer = 0; // R074 F1: the full font is fetched before the deadline, so the fallback
    // draws at the deadline and not a whole download after it. Not at once:
    // a healthy service answers well inside the prefetch point, and a page
    // that never falls back must not pay ~420 KB for the full font.

    const prefetchMs = Math.min(deadlineMs, Math.max(0, Number(this.iconFallbackPrefetchMs) || 0)); // R-1 (re-acceptance of 0c2898a5): the timer stops when the service
    // answers, not when the answer's own font is in -- a healthy service on
    // a slow line answers in milliseconds, and its small font then took more
    // than a second, which fetched the full font for nothing.

    const prefetch = deadlineMs ? setTimeout(() => {
      if (!request.answered) void this.loadIconFallbackFace(type);
    }, prefetchMs) : 0;

    request.onAnswered = () => clearTimeout(prefetch);

    const first = await Promise.race([work, new Promise(resolve => {
      timer = setTimeout(() => resolve(timedOut), deadlineMs);
    })]);
    clearTimeout(timer);
    clearTimeout(prefetch);
    if (first !== timedOut) return first;
    request.timedOut = true;
    const cap = setTimeout(() => request.controller?.abort(), Math.max(deadlineMs, Number(this.iconSubsetBackgroundCapMs) || 0));
    work.finally(() => clearTimeout(cap));
    return this.applyIconFontFallback({
      icons,
      type,
      generation,
      reason: new Error(deadlineMs ? `icon subset request timed out after ${deadlineMs} ms; the full font draws these icons while the subset grows` : "the full font already draws this family; the subset grows in the background")
    });
  }; // The stylesheet a subset answer is drawn with. The service's stylesheet
  // names every family 'Material Symbols Outlined Subset' and sets it on every
  // .sf-icon, while its manifest says the family it sent (Rounded, Sharp): put
  // in as it came, a rounded subset redeclared the outlined family's faces and
  // the face the manifest names was never declared, so the check found no
  // font, Rounded and Sharp fell back to the old Material Icons files on every
  // load (no axes, favorite drawn filled) and outlined glyphs were judged
  // missing (content study Z1, 2026-11-16). When the stylesheet does not
  // declare the manifest's family, the sheet is written from the manifest, as
  // a remembered manifest is: the family it names, scoped to its own icons,
  // which draw in it even under the outlined answer's .sf-icon family.


  SFLoaderPlugin.prototype.iconSubsetSheetText = function (cssText = "", manifest = null) {
    // The service's rule outranks the sheet's .sf-icon and names only the
    // private --sf-icon--fill: the public --sf-icon-fill is put first in it,
    // whichever stylesheet goes in (DEV TG-2).
    if (!manifest || !Array.isArray(manifest.fonts) || !manifest.fonts.length) {
      return (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.publicIconFillAxis)(cssText);
    }

    const family = this.getIconManifestFontFamily(manifest);
    const text = String(cssText || "");

    if (text.includes(`'${family}'`) || text.includes(`"${family}"`)) {
      return (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.publicIconFillAxis)(cssText);
    }

    const rebuilt = (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconSubsetCssFromManifest)(manifest).cssText;
    if (!rebuilt) return cssText; // The outlined answer sets its family on every .sf-icon itself, not
    // through --sf-icon--font-family; the family's own selector is more
    // specific and takes the face back for its icons.

    return rebuilt + `\n${this.getIconSubsetSelector(manifest)} {\n` + `  font-family: var(--sf-icon--font-family);\n` + `}\n`;
  }; // One subset request: fetch the stylesheet, load its face, swap it in.
  // Resolves true when the subset draws, false when it was dropped (outrun
  // by a newer request, or arriving behind the full font without every name
  // the page draws); an error before the deadline falls back to the full font.


  SFLoaderPlugin.prototype.requestIconSubsetFamily = async function (requestConfig, request) {
    const {
      defaultType: type,
      icons
    } = requestConfig;
    const host = this.getIconSubsetHost();
    const query = new URLSearchParams({
      icon_names: icons.join(","),
      type
    });
    const requestWeights = withLabelWeight(requestConfig.weights);

    if (requestWeights.length) {
      query.set("weight", requestWeights.sort().join(","));
    }

    if (requestConfig.fill) query.set("fill", "1"); // Grade and optical size as the service names them, each a range kept as
    // a variable axis: the page's range, widened to the icons' own values.

    query.set(_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.ICON_AXIS_PARAMS.GRAD, (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconAxisRequestRange)("GRAD", requestConfig.grade));
    query.set(_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.ICON_AXIS_PARAMS.opsz, (0,_icon_subset_memory_js__WEBPACK_IMPORTED_MODULE_1__.iconAxisRequestRange)("opsz", requestConfig.opticalSize));
    if (requestConfig.accumulate) query.set("accumulate", "true");

    if (!this.iconSubsetAppliedGenerations) {
      this.iconSubsetAppliedGenerations = new Map();
    }

    const outrun = () => (this.iconSubsetAppliedGenerations.get(type) || 0) > request.generation;

    let manifest = null;
    let priorManifest = null;
    let appliedStyle = null;

    try {
      // No cache: "reload": the list is the cache key, and the service marks
      // the stylesheet max-age=3600, so a list asked for again (the next page
      // of the origin, a reload) is answered by the browser.
      const response = await fetch(`${host}/ms/css?${query.toString()}`, {
        signal: request.controller?.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      request.answered = true;
      request.onAnswered?.();
      manifest = this.decodeIconManifestHeader(response.headers.get("X-SIMAI-Font-Manifest"));
      const cssText = this.iconSubsetSheetText(await response.text(), manifest);
      const manifestType = manifest ? this.getIconManifestType(manifest) : type;

      if (manifest && manifestType !== type) {
        throw new Error(`Icon subset family mismatch: requested ${type}, received ${manifestType}`);
      }

      const heldIcons = Array.isArray(manifest?.icons) && manifest.icons.length ? manifest.icons : icons;

      const behindFallback = () => this.isIconFallbackActive(type);

      const dropped = () => outrun() || behindFallback() && !this.isIconSubsetAnswerComplete(type, heldIcons, Boolean(requestConfig.fill));

      if (dropped()) return false;
      const previous = document.querySelector(`style[data-sf-icons-subset-family="${type}"]`);
      const style = document.createElement("style");
      style.setAttribute("data-sf-icons-subset", icons.join(","));
      style.setAttribute("data-sf-icons-subset-family", type); // Growing a subset that already drew, or taking over from the full
      // font: the icons on the page keep their glyphs while the face loads;
      // only the new names wait for it.

      const preloaded = previous || behindFallback() ? await this.preloadIconFontFaces(cssText) : null;

      if (dropped()) {
        preloaded?.faces?.forEach(face => document.fonts?.delete?.(face));
        return false;
      }

      style.textContent = preloaded ? preloaded.cssText : cssText;
      if (preloaded) style.sfIconFontFaces = preloaded.faces;
      document.head.appendChild(style);
      appliedStyle = style;
      this.iconSubsetAppliedGenerations.set(type, request.generation); // Older requests still on their way are outrun now.

      this.iconSubsetRequests?.get(type)?.forEach(other => {
        if (other.generation < request.generation) other.controller?.abort();
      });

      if (manifest) {
        if (this.isIconSubsetRemembered()) {
          safeSetItem?.(this.getIconManifestStorageKey(type), JSON.stringify(manifest));
        }

        priorManifest = this.getIconManifestForType(type);
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
      } // Its face is in, but the page may have moved on while it loaded: a
      // request asked before the deadline (only the header's menu) answered
      // after the full font took over (chevrons and all) and then took the
      // fallback away, so every name it does not hold drew in a system font,
      // still marked loaded, until the grown subset came (the font held 6 s:
      // «ar» of keyboard_arrow_down for 2.6 s, icon-ready 2026-11-19). The
      // same rule as before its face: an answer that is outrun, or behind the
      // full font without every name the page draws, goes, and the full font
      // keeps drawing.


      if (dropped()) {
        this.retireIconSubsetStyle(appliedStyle);
        if (manifest) this.setIconManifestForType(type, priorManifest);
        return false;
      } // Not document.fonts.ready: it waits for every font of the page, the
      // text faces too; the face this request loads is awaited above.


      this.liftIconSubsetPending();
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));
      this.retireIconSubsetStyle(previous);

      if (request.timedOut) {
        // The subset that grew in the background takes over from the full
        // font: it holds every name drawn, and its face is loaded.
        const fallback = document.querySelector(`style[data-sf-icons-fallback="${type}"]`);
        fallback?.remove();
        const loadedDescriptorKeys = new Set(this.loadedIcons);
        heldIcons.forEach(icon => {
          const iconAttrs = this.uniqueIcons.get(icon);
          if (!iconAttrs) return;
          this.getLoadedDescriptorKeysForIconState(icon, iconAttrs).forEach(key => loadedDescriptorKeys.add(key));
        });
        this.loadedIcons = loadedDescriptorKeys;
        window.dispatchEvent(new CustomEvent("sf-icons-subset:ready", {
          detail: {
            icons: new Set(heldIcons),
            loader: this,
            types: [type],
            background: true
          }
        }));
        this.syncStaticIconLoadedState();
      }

      return true;
    } catch (error) {
      this.retireIconSubsetStyle(appliedStyle); // After the deadline the full font already draws these names: a
      // background request that fails or is outrun changes nothing.

      if (request.timedOut || outrun()) return false;
      this.setIconManifestForType(type, null);
      safeRemoveItem?.(this.getIconManifestStorageKey(type));
      return this.applyIconFontFallback({
        icons,
        reason: error,
        type
      });
    }
  }; // Resolves when the page's first icon request may go: after sf-loader-ready,
  // then a frame after every Smart tag the Loader asked for and still holds is
  // defined (a tag drawn by one just defined is waited for in the next round).
  // A page slow to become ready lets it go at budgetMs -- unless a Smart tag
  // the Loader asked for is still on the way: the elements that draw the
  // page's other icons are not there yet, and a request sent now holds a few
  // names and costs a second whole font a moment later (probe tag-icon-glyph
  // under load: the button's search alone at 2.5 s, the tags' names at 3 s).
  // Then it waits for those tags, up to capMs.


  SFLoaderPlugin.prototype.holdFirstIconRequest = async function (budgetMs = 2500, capMs = 8000) {
    const started = Date.now();

    const capLeft = () => Math.max(0, started + capMs - Date.now()); // Waits for the promise or what is left of the cap, whichever comes
    // first, and clears the cap's timer when the promise wins: a pending 8 s
    // timer left behind by every round showed as a leak in a page's instance
    // scope (pair-next sweep, progress-run).


    const withinCap = promise => {
      let timer = 0;
      const cap = new Promise(resolve => {
        timer = setTimeout(resolve, capLeft());
      });
      return Promise.race([promise, cap]).finally(() => clearTimeout(timer));
    };

    const frame = () => withinCap(new Promise(resolve => typeof requestAnimationFrame === "function" ? requestAnimationFrame(() => setTimeout(resolve, 0)) : setTimeout(resolve, 16)));

    const registry = window.customElements; // Asked for and not defined yet. A store installed by an older bundle has
    // no asked(); its held() also lists the tags Core held while parsing.

    const onTheWay = () => {
      const pending = window.SF?.__internal?.pendingTags;
      const tags = pending?.asked?.() || pending?.held?.() || [];
      return registry ? tags.filter(tag => !registry.get(tag)) : [];
    }; // Asked for only after ready (the page's icons met on the frame that
    // dispatched it), there is no ready to wait for: the frame and the tags on
    // the way are still waited for below.


    if (!this.eventSend) await new Promise(resolve => {
      let timer = 0;

      const release = () => {
        window.removeEventListener("sf-loader-ready", release);
        clearTimeout(timer);
        resolve();
      };

      const check = () => {
        const elapsed = Date.now() - started;

        if (elapsed >= capMs || elapsed >= budgetMs && !onTheWay().length) {
          release();
          return;
        }

        timer = setTimeout(check, Math.max(50, budgetMs - elapsed));
      };

      window.addEventListener("sf-loader-ready", release);
      timer = setTimeout(check, budgetMs);
    }); // Defined and connected, not drawn yet. A Smart element defined a frame
    // before the hold looks draws its icons a moment later; the first request
    // must carry them (menu-chevron-swap). Such an element is waited for until
    // it has drawn once, for at most drawCapMs from the first time one is
    // seen: one that waits for its data, or never draws, does not hold the
    // page's icons longer than that (a drawing takes tens of milliseconds
    // after the definition; a second font costs ten times more). An element
    // inside another's printed first paint draws with that one.

    const drawCapMs = 600;
    let drawSeen = 0;

    const undrawn = () => {
      if (drawSeen && Date.now() - drawSeen >= drawCapMs) return [];
      const page = globalThis.document;
      if (typeof page?.querySelectorAll !== "function" || typeof page.addEventListener !== "function") return [];
      const found = [];

      for (const el of page.querySelectorAll("*")) {
        if (!el.localName.startsWith("sf-") || el.isRendered !== false) continue;
        if (el.closest("[data-sf-static]") || el.sfAwaitingData?.() === true) continue;
        found.push(el);
      }

      if (found.length && !drawSeen) drawSeen = Date.now();
      return found;
    };

    const drawn = elements => {
      let timer = 0;
      let done = null;

      const left = () => elements.filter(el => el.isConnected && el.isRendered === false);

      return new Promise(resolve => {
        done = () => {
          if (left().length) return;
          resolve();
        };

        document.addEventListener("sf-after-render", done);
        timer = setTimeout(resolve, Math.max(0, Math.min(capLeft(), drawSeen + drawCapMs - Date.now())));
        done();
      }).finally(() => {
        clearTimeout(timer);
        document.removeEventListener("sf-after-render", done);
      });
    };

    for (let round = 0; round < 8 && capLeft() > 0; round += 1) {
      await frame();
      const waiting = onTheWay();
      const drawing = undrawn();
      if (!waiting.length && !drawing.length) return; // Defined or failed: a tag whose module failed to load is let go at
      // once (D2: an aborted sf-tag held the first request for the whole cap).

      const pending = window.SF?.__internal?.pendingTags;
      await withinCap(Promise.all([...waiting.map(tag => pending?.settled?.(tag) || registry.whenDefined(tag)), ...(drawing.length ? [drawn(drawing)] : [])]));
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
    //
    // Ready is not yet every element drawn: it is dispatched when the Smart
    // bundles' scripts have run, and a bundle whose element is defined a
    // moment later (sf-tag after sf-button) draws its sf-icon after the frame
    // that followed ready. Under load the first request then held the
    // button's search alone and the tags' names went in a second request,
    // their glyphs blank until a second font came back (probe tag-icon-glyph,
    // pair 1110). So the hold also waits for the Smart tags the Loader still
    // holds -- asked for, not yet defined -- and a frame after they are
    // (holdFirstIconRequest).
    // Held whether it is first asked for before ready or after it: the scan
    // runs at DOMContentLoaded (R078), and a page whose icons are first
    // flushed on the frame that dispatched ready sent its first request with
    // sf-tag still on the way, the tag's glyph in a second font (F3).


    if (!this.iconFirstRequestReleased) {
      if (!this.iconFirstRequestHeld) {
        this.iconFirstRequestHeld = this.holdFirstIconRequest().then(() => {
          this.iconFirstRequestReleased = true;
          this.iconFirstRequestHeld = null; // What the elements drew while the hold lasted is on the page, but
          // the Loader's observer may still keep those records (until its
          // search ends, then a debounce): sf-menu's chevrons, drawn before
          // the hold let go, were tracked only after the first request had
          // left with the header's menu glyph alone, and came in a second
          // whole font 600-700 ms later (menu-chevron-swap). One scan of the
          // page now tracks every drawn glyph without loading, so the first
          // request carries them all; the observer's later records find them
          // tracked and ask for nothing new.

          if (globalThis.document?.body) this.scanStaticIcons(globalThis.document.body, false);
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
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _utilityModuleAliases__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("98e08d2c9eb6");
/* harmony import */ var _iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("09d27e26e137");
/* harmony import */ var _preloader__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("6c7f357fe960");
/* harmony import */ var lit_static_html_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("ee5035470810");
/* harmony import */ var _pending_tags_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("3c79afd07eeb");
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _utility_class_aliases_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("443d1792351d");
/* harmony import */ var _sets_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("a30ed252d965");
















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
// and carrying their own rules (the SIMAI Framework Pro components, package
// pro, are the first; standard simai.component-package). A page declares
// them in `SF_BOOT_CONFIG.packages`; docs/developer/component-packages.md has
// the contract. The name is also the prefix of the package's entries in the
// missing-file cache, so it is kept to characters that cannot collide with a
// rule name's own.


const PACKAGE_NAME = /^[a-z][a-z0-9-]*$/;
const PACKAGE_MISS_SEPARATOR = '::'; // A package's former names, each kept as a dated alias of its current one
// (contracts/changes/journal.json). The Pro components were published as the
// package `larena` from 2026-10-11 to 2026-11-02 (owner decision q-4ac7d07595:
// one package name, `pro`, Larena one consumer among others). A page that
// declares packages.larena, or a package built under the old name that calls
// registerPackage('larena'), is one package with packages.pro: the same base,
// the same rules. Each use is noted in SF.deprecations.

const PACKAGE_ALIASES = Object.freeze({
  larena: Object.freeze({
    to: 'pro',
    since: '2026-11-02',
    remove_after: '2027-01-01',
    record: 'option-package-larena-to-pro'
  })
});

function normalisePackageUrl(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\/+$/, '');
} // The directory of the package rule file that is running now, when it is one
// (<base>/rule.js or rule.min.js); '' for anything else, a bundle included.


function ruleScriptBase() {
  const src = globalThis.document?.currentScript?.src || '';
  const match = /^(.*)\/rule(?:\.min)?\.js(?:[?#].*)?$/u.exec(src);
  return match ? match[1] : '';
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
  (0,_iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_9__.initIconSubsetState)(this);
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
    color: (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.getPreloaderColor)(),
    width: _preloader__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_PRELOADER.width,
    height: _preloader__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_PRELOADER.height
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
  this.backgroundPreloader = params.backgroundPreloader ? params.backgroundPreloader : (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.getPreloaderBackground)();
  this.tempLoaderStyles = 'inset: 0;position: fixed;width: 100%;height: 100vh;opacity: 1;z-index: var(--sf-layer--window, 9000);background-color: var(--sf-color--surface-highest, var(--sf-surface-page, #fff));text-align: center;';
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
  this.packageOrder = 0;
  this.packageConflicts = new Map();
  this.packageRulesSettled = false;
  this.installPackageApi(); // A set named on the core script (data-sf-sets) is declared like one in
  // SF_BOOT_CONFIG.packages; the configuration wins over the attribute.

  const named = (0,_sets_js__WEBPACK_IMPORTED_MODULE_15__.setsFromScripts)(globalThis.document);
  named.refused.forEach(word => this.warnPackage(`sets:${word}`, `"${word}" in data-sf-sets is not a set name (or name@version); it is ignored`));
  this.declarePackages({ ...named.sets,
    ...(window.SF_BOOT_CONFIG?.packages || {}),
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
  Object.defineProperty(rules, 'packageOf', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: name => this.packageOf(name)
  });
};

SFLoaderPlugin.prototype.warnPackage = function (key, message) {
  if (this.packageWarnings.has(key)) return;
  this.packageWarnings.add(key);
  console.warn(`SFLoader: ${message}`);
}; // The current name of a package named `name`, noting a former one. `via` says
// where the old name was met: the page's declaration or a package's own
// registerPackage call, which are two lines to change and two notes.


SFLoaderPlugin.prototype.packageNameOf = function (name, via = 'declaration') {
  const alias = Object.prototype.hasOwnProperty.call(PACKAGE_ALIASES, name) ? PACKAGE_ALIASES[name] : null;
  if (!alias) return name;
  const expired = Date.now() > Date.parse(`${alias.remove_after}T23:59:59.999Z`);
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_13__.noteDeprecated)({
    component: 'loader',
    kind: 'option',
    from: via === 'registration' ? `SF.RuleLoader.registerPackage('${name}')` : `SF_BOOT_CONFIG.packages.${name}`,
    to: via === 'registration' ? `SF.RuleLoader.registerPackage('${alias.to}')` : `SF_BOOT_CONFIG.packages.${alias.to}`,
    since: alias.since,
    remove_after: alias.remove_after,
    ...(expired ? {
      expired: true
    } : {})
  });
  return alias.to;
};

SFLoaderPlugin.prototype.declarePackages = function (declared) {
  Object.entries(declared || {}).forEach(([declaredName, config]) => {
    const name = PACKAGE_NAME.test(declaredName) ? this.packageNameOf(declaredName) : declaredName; // Both names declared: the current one is the page's word, the former
    // one is said aloud and not used.

    if (name !== declaredName && Object.prototype.hasOwnProperty.call(declared, name)) {
      this.warnPackage(`alias:${declaredName}`, `SF_BOOT_CONFIG.packages declares both "${name}" and its former ` + `name "${declaredName}"; "${declaredName}" is ignored`);
      return;
    }

    if (!PACKAGE_NAME.test(name)) {
      this.warnPackage(`name:${name}`, `"${name}" in SF_BOOT_CONFIG.packages is not a package name ` + '(lower-case letters, digits and hyphens); it is ignored');
      return;
    } // A set may be declared by its base, by an npm version or by name alone
    // (sets.js); a version makes the base, a name alone waits for the index.


    const read = (0,_sets_js__WEBPACK_IMPORTED_MODULE_15__.readSetDeclaration)(config);

    if (!read) {
      this.warnPackage(`base:${name}`, `package "${name}" is declared without a base, so none of its ` + 'components can load; set SF_BOOT_CONFIG.packages.' + `${name}.base to the directory holding its component folders`);
    }

    const base = read?.base || (read?.version ? (0,_sets_js__WEBPACK_IMPORTED_MODULE_15__.npmBase)(name, read.version, this.setNpmRoot()) : ''); // The page's order of declaration decides which package keeps a rule two
    // of them define (registerPackage): data-sf-sets first, then
    // SF_BOOT_CONFIG.packages, then the constructor's packages, each in the
    // order written. A name declared twice keeps its first place.

    const order = this.packages[name]?.declared ? this.packages[name].order : this.packageOrder = (this.packageOrder || 0) + 1;
    this.packages[name] = {
      name,
      order,
      base,
      rule: read?.rule || (base ? `${base}/rule.js` : ''),
      version: read?.version || '',
      byIndex: Boolean(read?.byIndex),
      set: Boolean(read?.set),
      declared: true,
      registered: false
    };
  });
};

SFLoaderPlugin.prototype.setNpmRoot = function () {
  return normalisePackageUrl(window.SF_BOOT_CONFIG?.setNpm) || _sets_js__WEBPACK_IMPORTED_MODULE_15__.SET_NPM_ROOT;
}; // The bases of the sets a page named without one, from the compatibility
// index: fetched once, only when a set needs it. A set the index cannot place
// is said aloud with the reason and stays without a base.


SFLoaderPlugin.prototype.resolveIndexedPackages = function () {
  const waiting = Object.values(this.packages).filter(pkg => pkg.byIndex && !pkg.base);
  if (!waiting.length) return null;
  const url = normalisePackageUrl(window.SF_BOOT_CONFIG?.setIndex) || _sets_js__WEBPACK_IMPORTED_MODULE_15__.SET_INDEX_URL;

  const unplaced = (pkg, why) => this.warnPackage(`index:${pkg.name}`, `set "${pkg.name}" could not be placed from the compatibility index ` + `(${why}); give it a base or a version: SF_BOOT_CONFIG.packages.` + `${pkg.name} = '<base>' or '<version>'`);

  return fetch(url, {
    credentials: 'omit'
  }).then(response => {
    if (!response.ok) throw new Error(`${url} answered ${response.status}`);
    return response.json();
  }).then(index => {
    const problems = (0,_sets_js__WEBPACK_IMPORTED_MODULE_15__.checkSetIndex)(index);
    if (problems.length) throw new Error(`${url} is not a set index: ${problems[0]}`);
    this.setIndex = index;
    waiting.forEach(pkg => {
      const chosen = (0,_sets_js__WEBPACK_IMPORTED_MODULE_15__.selectSetRelease)(index, pkg.name);

      if (!chosen.row) {
        unplaced(pkg, chosen.reason);
        return;
      }

      pkg.version = chosen.row.version;
      pkg.release = chosen.row.release;
      pkg.base = (0,_sets_js__WEBPACK_IMPORTED_MODULE_15__.npmBase)(pkg.name, chosen.row.version, this.setNpmRoot());
      pkg.rule = `${pkg.base}/rule.js`;
    });
  }).catch(error => waiting.forEach(pkg => unplaced(pkg, String(error?.message || error))));
};

SFLoaderPlugin.prototype.loadDeclaredPackageRules = function () {
  // Once every declared rule file has answered, a rule two packages define
  // has its final owner, and each pair of packages that met is said once.
  const settle = value => {
    this.packageRulesSettled = true;
    this.reportPackageConflicts();
    return value;
  };

  const loadAll = () => {
    const loading = load();
    return loading ? loading.then(settle) : settle(null);
  };

  const load = () => {
    const loads = Object.values(this.packages).filter(pkg => pkg.declared && pkg.rule).map(pkg => this.addScript(pkg.rule).then(() => {
      if (!pkg.registered) {
        this.warnPackage(`empty:${pkg.name}`, `${pkg.rule} loaded but registered nothing for package ` + `"${pkg.name}"; it must call SF.RuleLoader.registerPackage(` + `"${pkg.name}", {rules})`);
      }

      if (!this.minified && pkg.set) this.readSetPassport(pkg);
    }).catch(() => {
      this.warnPackage(`rule:${pkg.name}`, `the rules of package "${pkg.name}" could not be loaded from ` + `${pkg.rule}; its components stay undefined`);
    }));
    return loads.length ? Promise.all(loads) : null;
  };

  const indexed = this.resolveIndexedPackages();
  this.packageRulesReady = indexed ? indexed.then(loadAll) : loadAll();
  return this.packageRulesReady;
}; // Debug only (?sf-debug, data-sf-debug, minified: false): the set's passport,
// <base>/../set.json, read for diagnostics. It says which sets this one needs;
// one the page has not declared is said aloud with the line to add, and is
// never loaded on the page's behalf. Only a package the page named as a set
// (pkg.set, sets.js readSetDeclaration) has one: a component package declared
// as {base} carries no passport, and asking for it only drew a 404 on every
// debug page that used one (ui-doc and the Pro package, core.runtime 1.26.1).


SFLoaderPlugin.prototype.readSetPassport = function (pkg) {
  if (!pkg.base || typeof fetch !== 'function') return null;
  const url = `${pkg.base.replace(/\/[^/]*$/u, '')}/set.json`;
  return fetch(url, {
    credentials: 'omit'
  }).then(response => response.ok ? response.json() : null).then(passport => {
    if (!passport || passport.schema !== 'simai.framework.component-set') return;
    pkg.passport = passport;

    if (passport.id !== pkg.name) {
      this.warnPackage(`passport:${pkg.name}`, `${url} is the passport of set "${passport.id}", not "${pkg.name}"`);
    }

    (Array.isArray(passport.requires_sets) ? passport.requires_sets : []).forEach(need => {
      if (this.packages[need?.id]) return;
      this.warnPackage(`requires:${pkg.name}:${need?.id}`, `set "${pkg.name}" needs set "${need?.id}" (${need?.range}), which this ` + `page has not declared; add ${(0,_sets_js__WEBPACK_IMPORTED_MODULE_15__.declarationLine)(need?.id)}`);
    });
  }).catch(() => null);
}; // What the Loader knows of a package: frozen, safe to hand out. A bundle uses
// it to find files beside its own at the same commit (its catalogue, its
// data), since a classic script has no import.meta.url.


SFLoaderPlugin.prototype.packageOf = function (name) {
  const pkg = this.packages[String(name ?? '').trim()];
  if (!pkg) return null;
  return Object.freeze({
    name: pkg.name,
    base: pkg.base,
    declared: pkg.declared,
    registered: pkg.registered,
    version: pkg.version || '',
    release: pkg.release || '',
    api: pkg.api || '',
    exported: Boolean(pkg.exports)
  });
}; // SF.package(name) (sets.js): the set's exports, once its bundle has given
// them. The set's `api` rule (registerPackage(name, {api})) is the element
// whose bundle carries them, asked for as an element would be. A set the page
// has not declared and nothing has registered is refused with the line to add.


SFLoaderPlugin.prototype.packageExports = function (name, {
  timeout = 10000
} = {}) {
  const ready = this.packageRulesReady || Promise.resolve();
  return Promise.resolve(ready).then(() => {
    const given = String(name ?? '').trim();
    const packageName = PACKAGE_NAME.test(given) ? this.packageNameOf(given) : given;
    const pkg = this.packages[packageName];

    if (!pkg) {
      throw new Error(`SF.package: set "${given}" is not declared on this page; add ${(0,_sets_js__WEBPACK_IMPORTED_MODULE_15__.declarationLine)(given)}`);
    }

    if (pkg.exports) return pkg.exports;

    if (!pkg.exportsReady) {
      pkg.exportsReady = new Promise(resolve => {
        pkg.resolveExports = resolve;
      });
    }

    const apiTag = pkg.api ? this.findPlugins?.[pkg.api]?.tags?.[0] : '';
    if (apiTag) this.ensure([apiTag], {
      timeout
    });
    let timer = null;
    const expired = new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error(`SF.package: set "${packageName}" gave no exports within ${timeout} ms` + (pkg.api ? ` (its api rule ${pkg.api})` : ' (it names no api rule)'))), timeout);
    });
    return Promise.race([pkg.exportsReady, expired]).finally(() => clearTimeout(timer));
  });
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
  const givenName = String(name ?? '').trim(); // A package built under a former name registers under the current one, so
  // its rules land where the page's declaration (either name) put the base.

  const packageName = PACKAGE_NAME.test(givenName) ? this.packageNameOf(givenName, 'registration') : givenName;

  if (!PACKAGE_NAME.test(packageName)) {
    this.warnPackage(`name:${packageName}`, `"${packageName}" is not a package name (lower-case letters, digits ` + 'and hyphens); its rules are not registered');
    return [];
  }

  const rules = options?.rules;
  const exported = options?.exports && typeof options.exports === 'object' ? options.exports : null;
  const aliases = Array.isArray(options?.aliases) ? options.aliases : null;
  const hasRules = rules && typeof rules === 'object' && !Array.isArray(rules); // A set's bundle registers again with its exports alone (SF.package); a
  // call with neither rules nor exports nor aliases registers nothing.

  if (!hasRules && !exported && !aliases) {
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
  // declared wins over the one a bundle suggests; then the bundle's own word;
  // then, for a rule file the page loaded with a script tag of its own
  // (<script src="<base>/rule.js">), the directory it came from.

  if (!pkg.base) pkg.base = normalisePackageUrl(options.base) || ruleScriptBase();
  if (hasRules) pkg.registered = true;
  if (typeof options.api === 'string' && /^cl-[a-z][a-z0-9-]*$/u.test(options.api)) pkg.api = options.api;

  if (aliases) {
    const own = new Set(Object.values(hasRules ? rules : {}).flatMap(rule => rule?.tags || []));
    const rows = aliases.filter(row => {
      const ok = row && typeof row.from === 'string' && typeof row.to === 'string' && own.has(row.to) && typeof row.remove_after === 'string';

      if (!ok) {
        this.warnPackage(`alias:${packageName}:${row?.from}`, `package "${packageName}" alias ${JSON.stringify(row)} does not name ` + 'one of its own tags with a remove_after; skipped');
      }

      return ok;
    });
    (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_7__.registerTagAliasRows)(rows);
  }

  if (exported && !pkg.exports) {
    pkg.exports = Object.freeze({ ...exported
    });
    pkg.resolveExports?.(pkg.exports);
  }

  if (!hasRules) return [];
  const added = [];
  Object.entries(rules).forEach(([key, rule]) => {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
      this.warnPackage(`rule:${packageName}:${key}`, `package "${packageName}" rule "${key}" is not an object; skipped`);
      return;
    }

    const current = this.findPlugins[key];

    if (current?.package && current.package !== packageName) {
      // Two packages define one rule (pro bundles the sets, so a page that
      // declares pro and a set it bundles gets two copies). The rule files
      // arrive in network order, so the first to arrive must not decide: the
      // package the page declared first keeps the rule, every load the same.
      // A rule already loaded stays with its holder (an element cannot be
      // defined twice). The pair is said once, as an error, when the
      // declared rule files have all answered.
      const holder = this.packages[current.package];
      const loaded = Boolean(this.module[key] || this.loadedPlugins[key]);
      const takes = !loaded && packageRank(pkg) < packageRank(holder);
      this.notePackageConflict(current.package, packageName, key, current, takes ? packageName : current.package, loaded ? 'loaded' : 'order');
      if (!takes) return;
    } else if (current && (this.module[key] || this.loadedPlugins[key])) {
      this.warnPackage(`loaded:${packageName}:${key}`, `rule "${key}" is already loaded from ` + `${current.package ? `package "${current.package}"` : 'the Smart base'}; ` + `the copy in package "${packageName}" is not used on this page`);
      return;
    }

    this.findPlugins[key] = { ...rule,
      package: packageName
    };
    added.push(key);
  });
  if (added.length) this.rulesChanged();
  if (this.packageRulesSettled) this.reportPackageConflicts();
  return added;
}; // The place a package holds in the page's declaration; a package the page did
// not declare (registered by a script of its own) comes after every declared
// one, and among those the first registered keeps what it registered.


function packageRank(pkg) {
  return pkg?.declared && Number.isFinite(pkg.order) ? pkg.order : Number.POSITIVE_INFINITY;
}

SFLoaderPlugin.prototype.notePackageConflict = function (holderName, comerName, key, rule, winner, why) {
  const [first, second] = packageRank(this.packages[holderName]) <= packageRank(this.packages[comerName]) ? [holderName, comerName] : [comerName, holderName];
  const pair = `${first}|${second}`;
  if (!this.packageConflicts) this.packageConflicts = new Map();

  if (!this.packageConflicts.has(pair)) {
    this.packageConflicts.set(pair, {
      first,
      second,
      winner,
      why,
      rules: new Set(),
      tags: new Set(),
      said: false
    });
  }

  const row = this.packageConflicts.get(pair);
  if (!row.rules.has(key)) row.said = false;
  row.rules.add(key);
  (Array.isArray(rule?.tags) && rule.tags.length ? [rule.tags[0]] : [key]).forEach(tag => row.tags.add(tag));

  if (why === 'loaded') {
    row.winner = winner;
    row.why = why;
  }
}; // One console error per pair of packages that define the same components:
// both names, the components, which package the page gets and why.


SFLoaderPlugin.prototype.reportPackageConflicts = function () {
  (this.packageConflicts || new Map()).forEach(row => {
    if (row.said) return;
    row.said = true;
    const loser = row.winner === row.first ? row.second : row.first;
    const winnerPackage = this.packages[row.winner];
    const reason = row.why === 'loaded' ? 'its copy had already loaded' : winnerPackage?.declared ? 'the page declares it first' : 'it registered first and neither is declared';
    const tags = [...row.tags].sort();
    console.error(`SFLoader: packages "${row.first}" and "${row.second}" both define ` + `${tags.map(tag => `<${tag}>`).join(', ')}; ` + `this page uses package "${row.winner}" (${reason}), and the copies in ` + `package "${loser}" are not loaded. A page declares pro or the sets it ` + 'bundles, never both: remove one of them from its declaration.');
  });
}; // Everything the Loader derived from the rule map, dropped so the next read
// sees the new rules, and the page read again so elements that were on it
// before their rule arrived are loaded now. Before the first scan there is
// nothing to read again: that scan reads the new rules itself.


SFLoaderPlugin.prototype.rulesChanged = function () {
  this.customElementRules = null;
  this.clearAttributeRuleIndex();
  this.clearRegexpScanRules();
  this.scriptWhenRules = null;
  this.attrMatchCache.clear();
  this.regexMatchCache.clear();

  if (!this.prepareInit || typeof document === 'undefined' || !document.body) {
    return;
  }

  this.mutate(() => {
    this.scanCustomElements(document.body);
    this.scanAttributes(document.body);
    if (!this.pendingRegex) this.searchRegexp('');
    this.loadScriptsWhen(document.body);
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
} // Code shows its text as written: a [!name] in a code block or inline code
// is text, not a shortcode. A code block's line marker, // [!code ++]
// (owner decision C258), was read as the shortcode «code» and dropped
// before the highlighter saw it.


const SHORTCODE_SKIPPED = 'script, style, yamap, head, meta, link, pre, code, [data-sf-observer="ignore"]';

SFLoaderPlugin.prototype.findShortCodes = function (node) {
  const regex = /\[!([a-zA-Z0-9_-]+)(?:\s+([^\](]+?))?](?:\(([^)]*)\))?(?:#([a-zA-Z0-9_-]+))?/g;
  const host = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement || null;

  if (this.shouldSkipNode(host)) {
    return;
  }

  if (node.nodeType !== Node.COMMENT_NODE && host?.closest?.('pre, code')) return; // Both text and comment placeholders (the boot script hides a shortcode in
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

(0,_iconSubsetRuntime__WEBPACK_IMPORTED_MODULE_9__.installIconSubsetRuntime)(SFLoaderPlugin, {
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
  (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.startPreloaderMotion)(this.preloaderWrap, () => this.preloaderRun, this.preloader);
};

SFLoaderPlugin.prototype.stopAnimation = function () {
  clearInterval(this.arrowInterval);
  if (!this.preloaderWrap) return;
  (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.stopPreloaderMotion)(this.preloaderWrap);
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
  if (known) return known; // A retired class name or family (C185 (2), C186 (8), C187 (1); the one
  // table src/core/js/retired-classes.table.js) is noted once in
  // SF.deprecations; it still loads and draws as before until its date.

  (0,_utility_class_aliases_js__WEBPACK_IMPORTED_MODULE_14__.noteUtilityClassAlias)(token);
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
  } // A class of a retired utility sheet (C187 (1)) is noted the same way.


  (0,_utility_class_aliases_js__WEBPACK_IMPORTED_MODULE_14__.noteRetiredUtilitySheets)(token, keys);
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
        } // A retired modifier is noted only beside the class it modifies
        // (C212 (3): text-N heading is title-N); a bare one is the page's own.


        (0,_utility_class_aliases_js__WEBPACK_IMPORTED_MODULE_14__.noteRetiredModifiers)(HtmlElement.classList);
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
}; // A portal root: a box a Smart element renders into from its own code, outside
// its own render -- sf-view-table's window form, sf-drawer's panel at the end of the
// body, a menu a component appends to the page. What is drawn there is the
// owner's output, not source it still has to capture, so a Smart element in a
// portal does not wait for an ancestor outside it (simai/ui-pro table,
// 2026-10-31: the filter window's sf-radio never upgraded, and eleven call
// sites asked for each tag by name instead -- reuse audit 2026-11-02, finding
// 4). SF.Loader.watch(root) marks one; sf-drawer's own marker counts as well.


const PORTAL_ATTRIBUTE = 'data-sf-portal';
const PORTAL_ROOT = `[${PORTAL_ATTRIBUTE}], [data-sf-drawer-portal]`;

SFLoaderPlugin.prototype.findNearestSmartParent = function (el) {
  let parent = el?.parentElement || null;

  while (parent) {
    if (this.getSmartElementRuleName(parent)) {
      return parent;
    }

    if (parent.matches?.(PORTAL_ROOT)) return null;
    parent = parent.parentElement;
  }

  return null;
}; // A nested Smart element waits until its parent has captured its source: the
// parent may take it as a slot template, and its sf-after-render reads the
// subtree again (prepareSmartChildScanEvents). Only a Smart base element does
// either. A parent defined over another base -- sf-sortable is a composition
// host -- captures nothing and sends no sf-after-render, and its children used
// to wait for ever: sf-checkbox in sf-tabs' settings list and sf-radio in
// sf-view-table's template rows were loaded only because each was asked for by
// name. Such a parent holds nothing; one not defined yet is read again when
// its definition arrives, whichever base it turns out to have.


function capturesSource(constructor) {
  return typeof constructor?.prototype?.captureSlotTemplates === 'function';
}

SFLoaderPlugin.prototype.shouldDeferNestedSmartElement = function (el) {
  if (!this.getSmartElementRuleName(el)) {
    return false;
  }

  const parentSmart = this.findNearestSmartParent(el);

  if (!parentSmart || parentSmart.__sfSourceCaptured === true) {
    return false;
  }

  const registry = globalThis.customElements;
  const defined = registry?.get?.(parentSmart.localName);
  if (defined) return capturesSource(defined);
  this.scanWhenDefined(parentSmart);
  return true;
};

SFLoaderPlugin.prototype.scanWhenDefined = function (parent) {
  const registry = globalThis.customElements;
  if (!registry?.whenDefined) return;
  this.parentsAwaited = this.parentsAwaited || new WeakSet();
  if (this.parentsAwaited.has(parent)) return;
  this.parentsAwaited.add(parent);
  registry.whenDefined(parent.localName).then(constructor => {
    this.parentsAwaited.delete(parent); // A Smart base parent reads its subtree on its own sf-after-render.

    if (parent.isConnected && !capturesSource(constructor ?? registry.get(parent.localName))) {
      this.scanCustomElements(parent);
    }
  });
}; // Marks a root a Smart element renders into as a portal (PORTAL_ROOT) and
// reads what is in it now; the Loader's page observer reads what is drawn
// there later, as it reads the page. Returns the function that unmarks it.


SFLoaderPlugin.prototype.watch = function (root) {
  if (root?.nodeType !== 1) return () => {};
  if (!root.matches(PORTAL_ROOT)) root.setAttribute(PORTAL_ATTRIBUTE, '');
  if (root.isConnected) this.scanCustomElements(root);
  return () => this.unwatch(root);
};

SFLoaderPlugin.prototype.unwatch = function (root) {
  root?.removeAttribute?.(PORTAL_ATTRIBUTE);
}; // Leaves the element for later when it sits in a closed container: the
// container is watched, and read again when it opens. The element's tag is
// held meanwhile (pending-tags.js), in case the container is one that still
// shows it (an inert region).


SFLoaderPlugin.prototype.deferClosedSmartElement = function (el) {
  const container = closedContainerOf(el);
  if (!container) return false;
  (0,_pending_tags_js__WEBPACK_IMPORTED_MODULE_12__.installPendingTags)(window).hold(el.localName);
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
  (0,_pending_tags_js__WEBPACK_IMPORTED_MODULE_12__.installPendingTags)(window).hold(tagName, {
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
      } // An element a regexp rule names (a kbd, a pre > code) added later: the
      // attribute scan below does not see a bare tag (queue item 203).


      for (const [key, rule] of this.getRegexpScanRules()) {
        if (this.module[key] || !this.ruleMatchesElements(rule, objHTML)) continue;
        this.setExistCookie(key);
        totalItemCount++;
        newPlugins.push(key);
      }

      this.loadScriptsWhen(objHTML); // The root passed shouldSkipNode; the walker rejects an ignored or
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
            this.loadScriptsWhen(change.target);
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
    } // A static icon whose name changed to one the font does not draw yet
    // loses its loaded mark now, before the next paint: the changes below
    // wait out a debounce, and meanwhile the new name was drawn as text in a
    // fallback font -- the theme button showed "light_mode" spelled out.


    relevantChanges.forEach(change => {
      if (change.type === 'characterData' || change.type === 'childList') {
        _this.holdChangedStaticIcon?.(change.target);
      }
    }); // One record at a time: a page that draws hundreds of components in one
    // task hands over hundreds of thousands of records, and spread into
    // push() as arguments they ran past the call stack (RangeError: Maximum
    // call stack size exceeded, once a load on the 470-row sf-tabs page, C54
    // D4) and that whole batch of changes was lost.

    const keep = into => {
      for (const change of relevantChanges) into.push(change);
    };

    if (_this.searchEnd) {
      keep(mutationBuffer);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const bufferedChanges = [...mutationBuffer];
        mutationBuffer = [];
        queueChanges(bufferedChanges);
      }, DEBOUNCE_MS);
    } else {
      keep(_this.observeElements);
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
  name = (0,_utilityModuleAliases__WEBPACK_IMPORTED_MODULE_8__.resolveUtilityModule)(name, _contracts_utility_module_aliases_v1_json__WEBPACK_IMPORTED_MODULE_4__.aliases, this.findPlugins, this.productionPlanActive); // A package rule without a usable base is not marked for loading at all; the
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
}; // The rule a former bundle name leads to (contracts/smart-rule-forwards.v1.json),
// or null. The target may be a component package's rule (cl-table ->
// cl-view-table, package pro): it resolves from the package once its rules are
// registered. A package that registers the former name itself (a package built
// before the rename) took the forward's place in findPlugins: its own rule is
// used and the name is not forwarded.


SFLoaderPlugin.prototype.forwardedRule = function (name) {
  const to = name && this.ruleForwards?.[name];
  if (!to) return null;
  if (this.findPlugins?.[name]?.package !== undefined) return null;
  return to;
};

SFLoaderPlugin.prototype.setRelation = function (relation, name, output, visited = new Set()) {
  if (!Array.isArray(relation) || visited.has(name)) {
    return;
  }

  visited.add(name);
  relation.forEach(named => {
    const forwardTo = named?.name && this.forwardedRule(named.name);
    const rel = forwardTo ? { ...named,
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
}; // The remembered icon subset is kept: it is not a list of this release's
// plugins but the service's own answer, checked again on every use (its font
// files on the subset host, its face loaded before it counts). Wiped with the
// rest on every boot of a page that sets no cacheVersion -- most sites -- the
// Loader asked the subset service again on every page, and the header's icon
// buttons stood empty until it answered (effects.simai.io, 2026-11-02).


SFLoaderPlugin.prototype.clearAllSfCache = function () {
  for (let i = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().length - 1; i >= 0; i--) {
    const key = (0,_page_storage_js__WEBPACK_IMPORTED_MODULE_2__["default"])().key(i);

    if (key && key.startsWith('SF_') && !key.startsWith('SF_ICON_SUBSET_MANIFEST')) {
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

  const matched = []; // The elements a rule names by tag are looked for in the whole scope as
  // well: the markup above is its first 4 KB, without pre and code.

  const scope = html ? html.nodeType === Node.ELEMENT_NODE ? html : null : document.body;

  for (const [key] of filteredRules) {
    const item = SF.RuleLoader[key];
    const regex = item.regex || item;
    const re = regex instanceof RegExp ? regex : new RegExp(regex, regex.flags || '');
    if (re.global || re.sticky) re.lastIndex = 0;

    if (re.test(body)) {
      matched.push(key);
      this.setExistCookie(key);
    } else if (scope && this.ruleMatchesElements(item, scope)) {
      // Not cached by the prefix: the prefix alone did not match.
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
}; // The element names a regexp rule writes as markup, `<kbd\b`, `<sf-tree(?=`,
// `<pre\b[^>]*>\s*<code\b`: '' for one that names none (`<\s*i`, a class).


const RULE_ELEMENT = /<([a-z][a-z0-9]*(?:-[a-z0-9]+)*)(?=\\b|\(\?=|\[|\\s|$)/giu;

function ruleElementNames(rule) {
  const regex = rule?.regex ? rule.regex : rule;
  const source = regex instanceof RegExp ? regex.source : typeof regex === 'string' ? regex : '';
  return [...new Set([...source.matchAll(RULE_ELEMENT)].map(match => match[1].toLowerCase()))];
} // The start of an element as the markup scan writes it, with its first child
// element when only white space stands before it (`<pre><code>`).


function elementStart(el) {
  let out = `<${el.localName}`;

  for (const attribute of el.attributes) out += ` ${attribute.name}="${escapeAttribute(attribute.value)}"`;

  out += '>';
  const child = el.firstElementChild;
  if (!child) return out;
  let before = '';

  for (let node = el.firstChild; node && node !== child; node = node.nextSibling) before += node.textContent || '';

  if (before.trim()) return out;
  out += `<${child.localName}`;

  for (const attribute of child.attributes) out += ` ${attribute.name}="${escapeAttribute(attribute.value)}"`;

  return `${out}>`;
} // A regexp rule that names an element (kbd, pre > code) matches one anywhere
// in `scope`, not only in the first 4 KB of the page's markup the regexp scan
// reads (simai/ui-source loader, queue item 203: a kbd low on a long page, a bare
// pre > code, which that markup leaves out). The rule's own pattern is tested
// on the element's start, so it matches what it matched in the markup. As in
// the markup scan, nothing inside pre or code (a code sample), in an ignored
// subtree or in a script or template counts.


SFLoaderPlugin.prototype.ruleMatchesElements = function (rule, scope) {
  if (!scope?.querySelectorAll) return false;
  if (!this.ruleElementNamesCache) this.ruleElementNamesCache = new WeakMap();
  const key = rule && typeof rule === 'object' ? rule : null;
  let names = key ? this.ruleElementNamesCache.get(key) : null;

  if (!names) {
    names = ruleElementNames(rule);
    if (key) this.ruleElementNamesCache.set(key, names);
  }

  if (!names.length) return false;
  const regex = rule?.regex ? rule.regex : rule;
  const re = regex instanceof RegExp ? regex : new RegExp(regex, regex?.flags || '');
  const selector = names.join(',');
  const candidates = scope.matches?.(selector) ? [scope, ...scope.querySelectorAll(selector)] : scope.querySelectorAll(selector);

  for (const el of candidates) {
    if (el.parentElement?.closest?.('pre, code')) continue;
    if (el.closest?.(`${OBSERVER_IGNORE_SELECTOR}, script, style, template, noscript`)) continue;
    if (re.global || re.sticky) re.lastIndex = 0;
    if (re.test(elementStart(el))) return true;
  }

  return false;
}; // Rules whose script comes only where an element asks for it (`jsWhen`, a
// selector): kbd's sheet draws every <kbd>, its script only fills
// <kbd data-sf-shortcut> (C191), so a page of plain keys fetches no script
// (queue item 164). Looked for in `root` (the page, an added subtree, an element
// whose attribute changed); the script is fetched once, as loadScriptOnCall
// fetches it.


SFLoaderPlugin.prototype.loadScriptsWhen = function (root) {
  if (!root?.querySelectorAll) return 0;

  if (!this.scriptWhenRules) {
    this.scriptWhenRules = Object.entries(this.findPlugins || {}).filter(([, rule]) => rule && typeof rule.jsWhen === 'string' && rule.jsWhen.trim());
  }

  if (!this.scriptWhenRules.length) return 0;
  if (!this.scriptsWhenAsked) this.scriptsWhenAsked = new Set();
  let asked = 0;

  for (const [name, rule] of this.scriptWhenRules) {
    if (this.scriptsWhenAsked.has(name)) continue;
    const found = (root.matches?.(rule.jsWhen) ? [root] : []).concat([...root.querySelectorAll(rule.jsWhen)]);
    const real = found.some(el => !el.parentElement?.closest?.('pre, code') && !el.closest?.(`${OBSERVER_IGNORE_SELECTOR}, script, style, template, noscript`));
    if (!real) continue;
    this.scriptsWhenAsked.add(name);
    if (this.loadScriptOnCall(name)) asked++;
  }

  return asked;
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

  PluginList = [...new Set(PluginList.map(name => (0,_utilityModuleAliases__WEBPACK_IMPORTED_MODULE_8__.resolveUtilityModule)(name, _contracts_utility_module_aliases_v1_json__WEBPACK_IMPORTED_MODULE_4__.aliases, this.findPlugins, this.productionPlanActive)))];

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

  if (type === 'js') {
    // The rule's tags will not be defined: nothing waits for them (D2).
    const pending = globalThis.window?.SF?.__internal?.pendingTags;
    const tags = this.findPlugins?.[pluginName]?.tags;
    if (pending?.fail && Array.isArray(tags)) tags.forEach(tag => pending.fail(tag));
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
        // One by one, so a sheet of this batch is also placed against the
        // ones before it; the browser still recalculates once, after the task.
        for (const link of this.pendingStyleLinks.splice(0)) {
          if (!placeBeforeLaterPoint(head, link)) head.append(link);
        }
      });
    }
  });
}; // A utility's sheets per point, in the order their rules must stand: the base
// sheet first, then the breakpoints from narrow to wide, then the states.
// Each pass of the Loader asks for its sheets in this order, but a later pass
// appended its sheets after an earlier pass's: a base sheet that came second
// stood after md, so grid-col-1 beat md:grid-col-2 and a wide page drew one
// column (2026-11-10 review, P9). A sheet now goes before the first sheet of
// the same utility already in <head> whose point comes after its own.


const UTILITY_SHEET_POINTS = ['default', 'sm', 'md', 'lg', 'xl', 'xxl', 'hover', 'focus', 'focus-visible', 'active'];
const UTILITY_SHEET = /\/utility\/([^/?#]+)\/([^/?#]+)\/css\/\2(?:\.min)?\.css(?:[?#]|$)/u;

function utilitySheetPoint(href) {
  const match = UTILITY_SHEET.exec(String(href || ''));
  if (!match) return null;
  const rank = UTILITY_SHEET_POINTS.indexOf(match[2]);
  return rank < 0 ? null : {
    utility: match[1],
    rank
  };
}

function placeBeforeLaterPoint(head, link) {
  const own = utilitySheetPoint(link.getAttribute?.('href') ?? link.href);
  if (!own || typeof head.querySelectorAll !== 'function') return false;

  for (const other of head.querySelectorAll('link[rel="stylesheet"]')) {
    const point = utilitySheetPoint(other.getAttribute('href'));

    if (point && point.utility === own.utility && point.rank > own.rank) {
      head.insertBefore(link, other);
      return true;
    }
  }

  return false;
} // One insertion per asset URL, shared by every Loader on the page
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
}; // The page's language file while it is on its way (owner decision C282,
// 2026-11-17). English is the only language built into the components; a page
// in any other language takes its words from a language file. When the page
// included its script form before core (core/lang/<code>.js) the words are
// here and nothing waits. Otherwise core fetches the parts of the page's
// language when it starts (core/js/language-packs.js), and a component whose
// script ran before they arrived drew English first and the page's language a
// moment later (study 2026-11-17: 9 of 9 loads at a 300 ms file). So the
// scripts the Loader adds wait for those words, at most `languageWait` ms
// (SF_BOOT_CONFIG.languageWait, 800 by default, 0 never waits); they are
// preloaded meanwhile, so nothing is fetched later than without the wait.
// Past the limit they run, say English and draw again when the words come.


const LANGUAGE_WAIT_MS = 800;
const languageHoldSince = new WeakMap();

function languageWaitLimit() {
  const configured = Number(globalThis.SF_BOOT_CONFIG?.languageWait);
  return Number.isFinite(configured) && configured >= 0 ? configured : LANGUAGE_WAIT_MS;
}
/** A promise that settles when the page's language words are here (or the limit passes), or null when nothing is on its way. */


function languageHold() {
  const store = globalThis.__sfPageLanguage;
  const pending = store?.packs?.pending;
  if (!pending?.size) return null;
  const limit = languageWaitLimit();
  if (!limit) return null;
  const root = globalThis.document?.documentElement;
  const wanted = String(store.chosen || root?.getAttribute?.('lang') || '').trim().toLowerCase().replace('_', '-'); // A registry alias waits for its pack (zh-cn: zh-hans, pt: pt-br).

  const pack = code => store.packs.aliases?.[code] ?? code;

  const base = wanted.split('-')[0];
  const waits = [...new Set([wanted, pack(wanted), base, pack(base)])].filter(Boolean).map(code => pending.get(code)).filter(Boolean);
  if (!waits.length) return null;

  const now = () => globalThis.performance?.now?.() ?? Date.now();

  const holds = waits.map(words => {
    if (!languageHoldSince.has(words)) languageHoldSince.set(words, now());
    const left = limit - (now() - languageHoldSince.get(words));
    if (left <= 0) return null;
    return Promise.race([Promise.resolve(words).catch(() => null), new Promise(resolve => {
      setTimeout(resolve, left);
    })]);
  }).filter(Boolean);
  return holds.length ? Promise.all(holds) : null;
}

SFLoaderPlugin.prototype.addScript = function (pluginURL, param = {}) {
  const src = this.versionAssetUrl(pluginURL);
  return onceByUrl('scripts', src, () => {
    const hold = languageHold();
    if (!hold) return this.insertScript(src, pluginURL, param);
    this.preloadScript(pluginURL);
    return hold.then(() => this.insertScript(src, pluginURL, param));
  });
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

  this.contentPreloader = this.params.contentPreloader ? this.params.contentPreloader : (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.createPreloaderContent)(this.preloader);
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
}; // R078: the page is scanned once it is parsed, not at the window's load. A
// font or image still on its way held load -- 25.9 s with the icon host held
// on a warm profile -- and the scan, sf-loader-ready and the splash with it.


SFLoaderPlugin.prototype.onDomParsed = function (fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => fn(), {
      once: true
    });
  } else {
    fn();
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

  this.onDomParsed(() => {
    if (observer) {
      observer.disconnect();
    }

    this.logTiming('page scan start');
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
      this.loadScriptsWhen(document.body);
      await this.scanAttributesInSlices(document.body);

      if (Object.keys(this.module || {}).length) {
        this.getLoader(this.module, true);
      }

      this.revalidateMissingPlugins(); // Changes met during the scan are read now, not at the window's load
      // (scheduleSearchEnd still ends it there for a page whose scan is
      // slower than its load).

      this.endSearch();
      this.logTiming('page scan done');
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
    this.loadScriptsWhen(newBody);
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
  backgroundPreloader: 'var(--sf-color--surface-highest, var(--sf-surface-page, #fff))',
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
// sf-view). It used to be read as the Framework's, and
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
  // An old name of a renamed tag creates the current one (tag-aliases.js).
  const tagName = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_7__.canonicalTag)(normalizeSmartTagName(name));

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
// a page that links its parts' sheets pays nothing, and so does one the page
// reports as held (SF_PRELOADED.loadedPlugins css: true); a sheet linked but on its
// way is waited for; one nobody asked for yet is asked for now (autoLoad;
// without it, it is not waited for: a printed first paint waits only for what
// the page linked),
// through addStyle, which the Loader's own request then shares. A sheet that
// fails to load does not hold the element. Settles per tag, once.


SFLoaderPlugin.prototype.styleSheetsOfRule = function (requested, visited = new Set()) {
  const sheets = []; // The module the Loader itself would load under this name (setExistCookie).

  const name = requested ? (0,_utilityModuleAliases__WEBPACK_IMPORTED_MODULE_8__.resolveUtilityModule)(requested, _contracts_utility_module_aliases_v1_json__WEBPACK_IMPORTED_MODULE_4__.aliases, this.findPlugins, this.productionPlanActive) : requested;
  if (!name || visited.has(name)) return sheets;
  visited.add(name);
  const rule = this.findPlugins?.[name];
  if (!rule || typeof rule !== 'object') return sheets;
  const type = rule.type === 'smart' ? 'smart' : rule.type === 'component' || rule.type === 'attribute' ? 'component' : 'utility';

  if (rule.css === true || type === 'utility' && rule.css !== false) {
    const point = name.includes('/') ? name.split('/').pop() : 'default';
    const unit = type === 'utility' && !name.includes('/') ? `${name}/${point}` : name; // A sheet whose styles the page already holds is not a sheet to ask for:
    // the page said so (SF_PRELOADED.loadedPlugins, css: true -- a site that
    // merged the Framework sheets into its own, Docara's shell styles), or the
    // Loader's own request for it has loaded. Asked for by its path, a merged
    // sheet is linked a second time: eleven of the fifteen links the Loader
    // added to a Docara page were sheets its shell styles already held
    // (2026-11-08).

    const held = this.loadedPlugins?.[unit]?.css === true || this.loadedPlugins?.[name]?.css === true;
    const file = held ? null : this.pathPluginCss(unit, type, point);
    if (file) sheets.push(file);
  }

  const drawnWith = type === 'smart' ? (_template_utilities_generated_json__WEBPACK_IMPORTED_MODULE_6__[name] || []).map(key => ({
    name: key
  })) : [];
  [...(Array.isArray(rule.relation) ? rule.relation : []), ...drawnWith].forEach(relation => {
    if (!relation?.name || relation.lazy === true) return;
    const target = this.forwardedRule(relation.name) || relation.name;
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
  if (!rule || rule.jsOnCall !== true && !rule.jsWhen || this.ComponentRegistry?.[name]) return false;
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
}; // The element a name in SF.Loader.ensure() stands for: a tag a rule claims as
// it is, a short Framework name with sf- before it (context-menu), and a
// package's own hyphenated name as it is while its rules have not loaded.


function ensureTagName(input, rules) {
  const name = String(input || '').trim().toLowerCase();
  if (!name) return '';
  if (name.startsWith('sf-') || rules[name]) return name;
  if (rules[`sf-${name}`] || !name.includes('-')) return `sf-${name}`;
  return name;
} // SF.Loader.ensure(tags, {timeout}): what a component calls before it draws an
// element it did not have in its markup -- a menu it appends to the page, an
// editor a window shows. Each tag's code is asked for the way the page would
// ask for it (its rule, the rule's package and relations, a lazy relation at
// once), and the promise settles when every tag is defined or the timeout
// (3 s by default; a non-finite one waits) has passed, with the tags that are
// defined and those that are not: it never rejects, so a caller draws what it
// can and falls back for the rest. A tag already defined costs nothing. The
// fetch is asked for once per rule however many callers wait, and callers of
// one tag share one wait. This replaces "ask the Loader, race whenDefined
// against 3 s", copied at eleven call sites (reuse audit 2026-11-02, finding 4).


SFLoaderPlugin.prototype.ensure = function (tags, {
  timeout = 3000
} = {}) {
  const registry = globalThis.customElements;
  const rules = this.getCustomElementRules();
  const names = [...new Set((Array.isArray(tags) ? tags : [tags]).map(tag => ensureTagName(tag, rules)).filter(Boolean))];
  const pending = names.filter(tag => !registry?.get?.(tag));

  const report = () => ({
    ready: names.filter(tag => registry?.get?.(tag)),
    missing: names.filter(tag => !registry?.get?.(tag))
  });

  if (!pending.length || !registry?.whenDefined) return Promise.resolve(report());
  this.ensureWaits = this.ensureWaits || new Map();
  const waits = pending.map(tag => {
    const rule = this.getCustomElementRules()[tag];
    if (rule) this.ensurePlugin(rule);

    if (!this.ensureWaits.has(tag)) {
      this.ensureWaits.set(tag, registry.whenDefined(tag).finally(() => this.ensureWaits.delete(tag)));
    }

    return this.ensureWaits.get(tag);
  });
  const all = Promise.all(waits);
  if (!Number.isFinite(timeout)) return all.then(report);
  let timer = null;
  const expired = new Promise(settle => {
    timer = setTimeout(settle, Math.max(0, timeout));
  });
  return Promise.race([all, expired]).then(() => {
    clearTimeout(timer);
    return report();
  });
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


let fieldRenderersReady = null; // The set settles with its words (field orders FO-4): a host draws its fields
// once the set is here, and a field is no element that draws again when the
// page's language file arrives, so a page whose words core fetches (no
// core/lang/<code>.js) drew «Contains…» and «From» on a Russian page. The set
// asks for its part when it publishes itself; this waits for the parts on
// their way, at most languageWait ms (800 by default), as the scripts the
// Loader adds wait.

const withSetWords = set => {
  const hold = languageHold();
  return hold ? hold.then(() => set, () => set) : Promise.resolve(set);
};

SF.whenFieldRenderers = function whenFieldRenderers() {
  if (SF.fieldRenderers?.renderEditField) return withSetWords(SF.fieldRenderers);
  if (fieldRenderersReady) return fieldRenderersReady;
  fieldRenderersReady = new Promise((resolve, reject) => {
    const settle = () => {
      if (!SF.fieldRenderers?.renderEditField) return false;
      document.removeEventListener('sf-field-renderers-ready', settle);
      resolve(withSetWords(SF.fieldRenderers));
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

  tagName = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_7__.canonicalTag)(tagName);
  const tag = (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_11__.unsafeStatic)(tagName);
  return (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_11__.html)`<${tag} ...=${props}></${tag}>`;
};

SF.whenDefined = whenSmartDefined; // SF.whenDefine is the older name of SF.whenDefined: a dated alias of the same
// function until the sweep (journal global-sf-when-define). Enumerable, as it
// was, so a page that lists window.SF still sees it; a read is noted in
// SF.deprecations. The Framework's own code calls SF.whenDefined.

const WHEN_DEFINE_ALIAS = Object.freeze({
  since: '2026-11-11',
  remove_after: '2027-01-01'
});
Object.defineProperty(SF, 'whenDefine', {
  configurable: true,
  enumerable: true,

  get() {
    (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_13__.noteDeprecated)({
      kind: 'global',
      from: 'SF.whenDefine',
      to: 'SF.whenDefined',
      ...WHEN_DEFINE_ALIAS
    });
    return whenSmartDefined;
  },

  set(value) {
    Object.defineProperty(SF, 'whenDefine', {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  }

});

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

/***/ "cef5a448c23d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// The one table of retired class names (owner decision C187 (1),
// 2026-11-14), read by the Loader (utility-class-aliases.js), by the C187
// contract test and by the docs. Data only: it stays a plain module so the
// browser bundle and node read the same object.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "schema": "simai.framework.retired-classes",
  "schema_version": 1,
  "summary": "The one table of retired class names (owner decision C187 (1), 2026-11-14). A retired class keeps drawing what it drew until remove_after: its sheet stays in the distribution and in utility.full.css, and the Loader notes the first use of each name on a page in SF.deprecations (src/core/js/utility-class-aliases.js reads this table). Each record names its change-journal entry (contracts/changes/journal.json) and retires names (an exact class), patterns (a family of classes; to may refer to the pattern's groups as $1) or sheets (every class of a utility folder, at every breakpoint and state). A variant prefix (md:, hover:, focus-visible:) is kept on both sides. to is the name to write instead, or null where the job leaves the utilities (the record's note says where it went). extended lists the names that stay but are documented on one «extended» page instead of a page each. Nothing here is deleted before remove_after, and nothing is deleted without checking the built sheets, the ui-doc examples, the products and the Loader's Tailwind-name conversion.",
  "records": [{
    "journal": "class-table-sm-to-density",
    "decision": "C185 (2)",
    "component": "table",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "A table's row follows the density of its area: data-sf-density=\"compact\" on the table or an ancestor. table-sm and table-small keep drawing a row of the size-1/2 step until the date (utility.table 1.6.0).",
    "names": {
      "table-sm": "data-sf-density=\"compact\"",
      "table-small": "data-sf-density=\"compact\""
    }
  }, {
    "journal": "class-text-flow-utility-aliases",
    "decision": "C186 (8)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "One text-* family for how a line breaks.",
    "names": {
      "wrap-none": "text-nowrap",
      "text-break-word": "text-break",
      "text-break-all": "text-break",
      "t-ellipsis": "truncate",
      "t-clip": "truncate"
    }
  }, {
    "journal": "class-c212-text",
    "decision": "C212 (3)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One way per text job: text-N (size and line of step N), title-N (the same size on its title line), line-N, measure (+ -wide, -narrow) and three weights, weight-regular, weight-medium (the weight of headings and labels) and weight-bold on --sf-weight--*. These old names draw exactly what their new name draws: max-w-prose is measure (65ch), regular and weight-4 are weight-regular (400), weight-5 is weight-medium (500), bold and weight-7 are weight-bold (700), and the heading modifier beside text-N is title-N. They keep drawing until remove_after.",
    "names": {
      "max-w-prose": "measure",
      "regular": "weight-regular",
      "weight-4": "weight-regular",
      "weight-5": "weight-medium",
      "bold": "weight-bold",
      "weight-7": "weight-bold"
    },
    "modifiers": {
      "heading": {
        "with": "^text-(1[0-2]?|[2-9])$",
        "to": "title-$1"
      }
    }
  }, {
    "journal": "class-c212-text-nearest",
    "decision": "C212 (3)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "Names with no exact public twin: they keep drawing what they drew until remove_after, and the name to write is the nearest role, which looks different. weight-1, weight-2, weight-3 and lighter -> weight-regular; weight-6 -> weight-medium; weight-8, weight-9 and bolder -> weight-bold. line-tight, -snug, -normal, -relaxed, -loose and -none wrote a number of their own (1.25, 1.375, 1.5, 1.625, 2, 1) beside the line ladder: the line is line-N of the text's step N, which text-N and title-N already set.",
    "names": {
      "weight-1": "weight-regular",
      "weight-2": "weight-regular",
      "weight-3": "weight-regular",
      "lighter": "weight-regular",
      "weight-6": "weight-medium",
      "weight-8": "weight-bold",
      "weight-9": "weight-bold",
      "bolder": "weight-bold",
      "line-tight": "line-N",
      "line-snug": "line-N",
      "line-normal": "line-N",
      "line-relaxed": "line-N",
      "line-loose": "line-N",
      "line-none": "line-N"
    }
  }, {
    "journal": "utility-c187-retired-sheets",
    "decision": "C187 (2)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "The raw spacing ladders and the extended translate and background-size ladders: space comes from the space steps and the C105/C173 roles (m-*, p-*, gap-*, scroll-m-*, scroll-p-*, translate-* steps).",
    "sheets": {
      "margin-ext": null,
      "padding-ext": null,
      "scroll-margin-ext": null,
      "scroll-padding-ext": null,
      "background-size-ext": null,
      "transform-translate-ext": null
    }
  }, {
    "journal": "class-c212-length",
    "decision": "C212 (4)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "Lengths only in the system steps, one name per length. These old names draw exactly what their new name draws and keep drawing until remove_after: g-* is gap-* (g-x-* gap-x-*, g-y-* gap-y-*); a fraction is written in lowest terms (w-2/4, w-3/6 and w-6/12 are w-1/2; the same for basis-, h-, h-screen-, top-, bottom-, inline-start- and inline-end-), and 1/1 is full; w-20, w-25, w-40, w-50, w-60, w-75 and w-80 are the fractions w-1/5, w-1/4, w-2/5, w-1/2, w-3/5, w-3/4 and w-4/5. The same rule for the other spellings (C212 (4), dispatcher, 2026-11-16): col-gap-* and row-gap-* are gap-x-* and gap-y-* (under a cq- container condition they stay: query-layout has no gap-x/gap-y), basis-20, -25, -40, -50, -60, -75, -80 are basis-1/5 ... basis-4/5 and basis-100 is basis-full, h-content-min and h-content-max are h-min and h-max.",
    "names": {
      "w-1/1": "w-full",
      "w-10/12": "w-5/6",
      "w-2/12": "w-1/6",
      "w-2/4": "w-1/2",
      "w-2/6": "w-1/3",
      "w-3/12": "w-1/4",
      "w-3/6": "w-1/2",
      "w-4/12": "w-1/3",
      "w-4/6": "w-2/3",
      "w-6/12": "w-1/2",
      "w-8/12": "w-2/3",
      "w-9/12": "w-3/4",
      "basis-1/1": "basis-full",
      "basis-10/12": "basis-5/6",
      "basis-2/12": "basis-1/6",
      "basis-2/4": "basis-1/2",
      "basis-2/6": "basis-1/3",
      "basis-3/12": "basis-1/4",
      "basis-3/6": "basis-1/2",
      "basis-4/12": "basis-1/3",
      "basis-4/6": "basis-2/3",
      "basis-6/12": "basis-1/2",
      "basis-8/12": "basis-2/3",
      "basis-9/12": "basis-3/4",
      "h-2/4": "h-1/2",
      "h-2/6": "h-1/3",
      "h-3/6": "h-1/2",
      "h-4/6": "h-2/3",
      "h-screen-2/4": "h-screen-1/2",
      "top-10/12": "top-5/6",
      "top-2/12": "top-1/6",
      "top-2/4": "top-1/2",
      "top-2/6": "top-1/3",
      "top-3/12": "top-1/4",
      "top-3/6": "top-1/2",
      "top-4/12": "top-1/3",
      "top-4/6": "top-2/3",
      "top-6/12": "top-1/2",
      "top-8/12": "top-2/3",
      "top-9/12": "top-3/4",
      "bottom-10/12": "bottom-5/6",
      "bottom-2/12": "bottom-1/6",
      "bottom-2/4": "bottom-1/2",
      "bottom-2/6": "bottom-1/3",
      "bottom-3/12": "bottom-1/4",
      "bottom-3/6": "bottom-1/2",
      "bottom-4/12": "bottom-1/3",
      "bottom-4/6": "bottom-2/3",
      "bottom-6/12": "bottom-1/2",
      "bottom-8/12": "bottom-2/3",
      "bottom-9/12": "bottom-3/4",
      "inline-start-10/12": "inline-start-5/6",
      "inline-start-2/12": "inline-start-1/6",
      "inline-start-2/4": "inline-start-1/2",
      "inline-start-2/6": "inline-start-1/3",
      "inline-start-3/12": "inline-start-1/4",
      "inline-start-3/6": "inline-start-1/2",
      "inline-start-4/12": "inline-start-1/3",
      "inline-start-4/6": "inline-start-2/3",
      "inline-start-6/12": "inline-start-1/2",
      "inline-start-8/12": "inline-start-2/3",
      "inline-start-9/12": "inline-start-3/4",
      "inline-end-10/12": "inline-end-5/6",
      "inline-end-2/12": "inline-end-1/6",
      "inline-end-2/4": "inline-end-1/2",
      "inline-end-2/6": "inline-end-1/3",
      "inline-end-3/12": "inline-end-1/4",
      "inline-end-3/6": "inline-end-1/2",
      "inline-end-4/12": "inline-end-1/3",
      "inline-end-4/6": "inline-end-2/3",
      "inline-end-6/12": "inline-end-1/2",
      "inline-end-8/12": "inline-end-2/3",
      "inline-end-9/12": "inline-end-3/4",
      "g-0": "gap-0",
      "g-1": "gap-1",
      "g-1/2": "gap-1/2",
      "g-1/3": "gap-1/3",
      "g-1/4": "gap-1/4",
      "g-2": "gap-2",
      "g-3": "gap-3",
      "g-4": "gap-4",
      "g-5": "gap-5",
      "g-6": "gap-6",
      "g-7": "gap-7",
      "g-8": "gap-8",
      "g-x-0": "gap-x-0",
      "g-x-1": "gap-x-1",
      "g-x-1/2": "gap-x-1/2",
      "g-x-1/3": "gap-x-1/3",
      "g-x-1/4": "gap-x-1/4",
      "g-x-2": "gap-x-2",
      "g-x-3": "gap-x-3",
      "g-x-4": "gap-x-4",
      "g-x-5": "gap-x-5",
      "g-x-6": "gap-x-6",
      "g-x-7": "gap-x-7",
      "g-x-8": "gap-x-8",
      "g-y-0": "gap-y-0",
      "g-y-1": "gap-y-1",
      "g-y-1/2": "gap-y-1/2",
      "g-y-1/3": "gap-y-1/3",
      "g-y-1/4": "gap-y-1/4",
      "g-y-2": "gap-y-2",
      "g-y-3": "gap-y-3",
      "g-y-4": "gap-y-4",
      "g-y-5": "gap-y-5",
      "g-y-6": "gap-y-6",
      "g-y-7": "gap-y-7",
      "g-y-8": "gap-y-8",
      "w-20": "w-1/5",
      "w-25": "w-1/4",
      "w-40": "w-2/5",
      "w-50": "w-1/2",
      "w-60": "w-3/5",
      "w-75": "w-3/4",
      "w-80": "w-4/5",
      "basis-20": "basis-1/5",
      "basis-25": "basis-1/4",
      "basis-40": "basis-2/5",
      "basis-50": "basis-1/2",
      "basis-60": "basis-3/5",
      "basis-75": "basis-3/4",
      "basis-80": "basis-4/5",
      "basis-100": "basis-full",
      "h-content-min": "h-min",
      "h-content-max": "h-max"
    },
    "patterns": [{
      "from": "col-gap-*",
      "pattern": "^col-gap-(0|1\\/[234]|[1-8])$",
      "to": "gap-x-$1",
      "variants_except": "(?:^|:)cq-"
    }, {
      "from": "row-gap-*",
      "pattern": "^row-gap-(0|1\\/[234]|[1-8])$",
      "to": "gap-y-$1",
      "variants_except": "(?:^|:)cq-"
    }]
  }, {
    "journal": "class-c212-length-nearest",
    "decision": "C212 (4)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "Lengths with no exact twin in the system steps: they keep drawing what they drew until remove_after, and the name to write is the nearest, which looks different. w-1 ... w-99 (percent) -> the nearest fraction in lowest terms (w-33 -> w-1/3). space-x-N / space-y-N (margins on every child but the first) -> gap-x-N / gap-y-N on a flex or grid parent; space-x-reverse and space-y-reverse go with them (a gap needs no reverse). The raw rungs a0 ... i9 of margin-ext, padding-ext, scroll-margin-ext and scroll-padding-ext (retired by C187 (2)) -> the space step nearest to the rung on a desktop at the default root size (m-b6 -> m-1; a step is 4 ... 80 and follows the device, a rung does not); the scroll rungs name the C266 sides (scroll-mt-b6 -> scroll-m-top-1, scroll-p-inline-start-b6 -> scroll-p-inline-start-1); a negative scroll rung has no step. basis-1 ... basis-99 (percent, flex-basis-ext) -> the nearest fraction in lowest terms, as w-N (basis-33 -> basis-1/3).",
    "names": {
      "w-1": "w-1/12",
      "w-2": "w-1/12",
      "w-3": "w-1/12",
      "w-4": "w-1/12",
      "w-5": "w-1/12",
      "w-6": "w-1/12",
      "w-7": "w-1/12",
      "w-8": "w-1/12",
      "w-9": "w-1/12",
      "w-10": "w-1/12",
      "w-11": "w-1/12",
      "w-12": "w-1/12",
      "w-13": "w-1/6",
      "w-14": "w-1/6",
      "w-15": "w-1/6",
      "w-16": "w-1/6",
      "w-17": "w-1/6",
      "w-18": "w-1/6",
      "w-19": "w-1/5",
      "w-21": "w-1/5",
      "w-22": "w-1/5",
      "w-23": "w-1/4",
      "w-24": "w-1/4",
      "w-26": "w-1/4",
      "w-27": "w-1/4",
      "w-28": "w-1/4",
      "w-29": "w-1/4",
      "w-30": "w-1/3",
      "w-31": "w-1/3",
      "w-32": "w-1/3",
      "w-33": "w-1/3",
      "w-34": "w-1/3",
      "w-35": "w-1/3",
      "w-36": "w-1/3",
      "w-37": "w-2/5",
      "w-38": "w-2/5",
      "w-39": "w-2/5",
      "w-41": "w-5/12",
      "w-42": "w-5/12",
      "w-43": "w-5/12",
      "w-44": "w-5/12",
      "w-45": "w-5/12",
      "w-46": "w-1/2",
      "w-47": "w-1/2",
      "w-48": "w-1/2",
      "w-49": "w-1/2",
      "w-51": "w-1/2",
      "w-52": "w-1/2",
      "w-53": "w-1/2",
      "w-54": "w-1/2",
      "w-55": "w-7/12",
      "w-56": "w-7/12",
      "w-57": "w-7/12",
      "w-58": "w-7/12",
      "w-59": "w-7/12",
      "w-61": "w-3/5",
      "w-62": "w-3/5",
      "w-63": "w-3/5",
      "w-64": "w-2/3",
      "w-65": "w-2/3",
      "w-66": "w-2/3",
      "w-67": "w-2/3",
      "w-68": "w-2/3",
      "w-69": "w-2/3",
      "w-70": "w-2/3",
      "w-71": "w-3/4",
      "w-72": "w-3/4",
      "w-73": "w-3/4",
      "w-74": "w-3/4",
      "w-76": "w-3/4",
      "w-77": "w-3/4",
      "w-78": "w-4/5",
      "w-79": "w-4/5",
      "w-81": "w-4/5",
      "w-82": "w-5/6",
      "w-83": "w-5/6",
      "w-84": "w-5/6",
      "w-85": "w-5/6",
      "w-86": "w-5/6",
      "w-87": "w-5/6",
      "w-88": "w-11/12",
      "w-89": "w-11/12",
      "w-90": "w-11/12",
      "w-91": "w-11/12",
      "w-92": "w-11/12",
      "w-93": "w-11/12",
      "w-94": "w-11/12",
      "w-95": "w-11/12",
      "w-96": "w-full",
      "w-97": "w-full",
      "w-98": "w-full",
      "w-99": "w-full",
      "space-x-reverse": null,
      "space-y-reverse": null,
      "basis-1": "basis-1/12",
      "basis-2": "basis-1/12",
      "basis-3": "basis-1/12",
      "basis-4": "basis-1/12",
      "basis-5": "basis-1/12",
      "basis-6": "basis-1/12",
      "basis-7": "basis-1/12",
      "basis-8": "basis-1/12",
      "basis-9": "basis-1/12",
      "basis-10": "basis-1/12",
      "basis-11": "basis-1/12",
      "basis-12": "basis-1/12",
      "basis-13": "basis-1/6",
      "basis-14": "basis-1/6",
      "basis-15": "basis-1/6",
      "basis-16": "basis-1/6",
      "basis-17": "basis-1/6",
      "basis-18": "basis-1/6",
      "basis-19": "basis-1/5",
      "basis-21": "basis-1/5",
      "basis-22": "basis-1/5",
      "basis-23": "basis-1/4",
      "basis-24": "basis-1/4",
      "basis-26": "basis-1/4",
      "basis-27": "basis-1/4",
      "basis-28": "basis-1/4",
      "basis-29": "basis-1/4",
      "basis-30": "basis-1/3",
      "basis-31": "basis-1/3",
      "basis-32": "basis-1/3",
      "basis-33": "basis-1/3",
      "basis-34": "basis-1/3",
      "basis-35": "basis-1/3",
      "basis-36": "basis-1/3",
      "basis-37": "basis-2/5",
      "basis-38": "basis-2/5",
      "basis-39": "basis-2/5",
      "basis-41": "basis-5/12",
      "basis-42": "basis-5/12",
      "basis-43": "basis-5/12",
      "basis-44": "basis-5/12",
      "basis-45": "basis-5/12",
      "basis-46": "basis-1/2",
      "basis-47": "basis-1/2",
      "basis-48": "basis-1/2",
      "basis-49": "basis-1/2",
      "basis-51": "basis-1/2",
      "basis-52": "basis-1/2",
      "basis-53": "basis-1/2",
      "basis-54": "basis-1/2",
      "basis-55": "basis-7/12",
      "basis-56": "basis-7/12",
      "basis-57": "basis-7/12",
      "basis-58": "basis-7/12",
      "basis-59": "basis-7/12",
      "basis-61": "basis-3/5",
      "basis-62": "basis-3/5",
      "basis-63": "basis-3/5",
      "basis-64": "basis-2/3",
      "basis-65": "basis-2/3",
      "basis-66": "basis-2/3",
      "basis-67": "basis-2/3",
      "basis-68": "basis-2/3",
      "basis-69": "basis-2/3",
      "basis-70": "basis-2/3",
      "basis-71": "basis-3/4",
      "basis-72": "basis-3/4",
      "basis-73": "basis-3/4",
      "basis-74": "basis-3/4",
      "basis-76": "basis-3/4",
      "basis-77": "basis-3/4",
      "basis-78": "basis-4/5",
      "basis-79": "basis-4/5",
      "basis-81": "basis-4/5",
      "basis-82": "basis-5/6",
      "basis-83": "basis-5/6",
      "basis-84": "basis-5/6",
      "basis-85": "basis-5/6",
      "basis-86": "basis-5/6",
      "basis-87": "basis-5/6",
      "basis-88": "basis-11/12",
      "basis-89": "basis-11/12",
      "basis-90": "basis-11/12",
      "basis-91": "basis-11/12",
      "basis-92": "basis-11/12",
      "basis-93": "basis-11/12",
      "basis-94": "basis-11/12",
      "basis-95": "basis-11/12",
      "basis-96": "basis-full",
      "basis-97": "basis-full",
      "basis-98": "basis-full",
      "basis-99": "basis-full"
    },
    "patterns": [{
      "from": "space-x-*",
      "pattern": "^space-x-(0|1\\/[234]|[1-8])$",
      "to": "gap-x-$1"
    }, {
      "from": "space-y-*",
      "pattern": "^space-y-(0|1\\/[234]|[1-8])$",
      "to": "gap-y-$1"
    }, {
      "from": "m-, p-, scroll-m-, scroll-p- <a0-i9>",
      "pattern": "^(scroll-m-inline-start|scroll-p-inline-start|scroll-m-inline-end|scroll-p-inline-end|-m-inline-start|m-inline-start|p-inline-start|-m-inline-end|m-inline-end|p-inline-end|-m-bottom|scroll-mb|scroll-mt|scroll-pb|scroll-pt|m-bottom|p-bottom|scroll-m|scroll-p|-m-top|m-top|p-top|-m|m|p)-([a-i][0-9])$",
      "to": "$1-$2",
      "values": {
        "1": {
          "scroll-mt": "scroll-m-top",
          "scroll-mb": "scroll-m-bottom",
          "scroll-pt": "scroll-p-top",
          "scroll-pb": "scroll-p-bottom"
        },
        "2": {
          "a0": "0",
          "a1": "0",
          "a2": "1/4",
          "a3": "1/4",
          "a4": "1/4",
          "a5": "1/4",
          "a6": "1/3",
          "a7": "1/3",
          "a8": "1/3",
          "a9": "1/3",
          "b0": "1/2",
          "b1": "1/2",
          "b2": "1/2",
          "b3": "1/2",
          "b4": "1",
          "b5": "1",
          "b6": "1",
          "b7": "1",
          "b8": "2",
          "b9": "2",
          "c0": "2",
          "c1": "3",
          "c2": "3",
          "c3": "3",
          "c4": "4",
          "c5": "4",
          "c6": "4",
          "c7": "4",
          "c8": "5",
          "c9": "5",
          "d0": "5",
          "d1": "6",
          "d2": "6",
          "d3": "6",
          "d4": "7",
          "d5": "7",
          "d6": "7",
          "d7": "7",
          "d8": "8",
          "d9": "8",
          "e0": "8",
          "e1": "8",
          "e2": "8",
          "e3": "8",
          "e4": "8",
          "e5": "8",
          "e6": "8",
          "e7": "8",
          "e8": "8",
          "e9": "8",
          "f0": "8",
          "f1": "8",
          "f2": "8",
          "f3": "8",
          "f4": "8",
          "f5": "8",
          "f6": "8",
          "f7": "8",
          "f8": "8",
          "f9": "8",
          "g0": "8",
          "g1": "8",
          "g2": "8",
          "g3": "8",
          "g4": "8",
          "g5": "8",
          "g6": "8",
          "g7": "8",
          "g8": "8",
          "g9": "8",
          "h0": "8",
          "h1": "8",
          "h2": "8",
          "h3": "8",
          "h4": "8",
          "h5": "8",
          "h6": "8",
          "h7": "8",
          "h8": "8",
          "h9": "8",
          "i0": "8",
          "i1": "8",
          "i2": "8",
          "i3": "8",
          "i4": "8",
          "i5": "8",
          "i6": "8",
          "i7": "8",
          "i8": "8",
          "i9": "8"
        }
      }
    }, {
      "from": "-scroll-m-, -scroll-p- <a0-i9>",
      "pattern": "^(-scroll-m-inline-start|-scroll-p-inline-start|-scroll-m-inline-end|-scroll-p-inline-end|-scroll-mb|-scroll-mt|-scroll-pb|-scroll-pt|-scroll-m|-scroll-p)-([a-i][0-9])$",
      "to": null
    }]
  }, {
    "journal": "class-c187-utility-renames",
    "decision": "C187 (3)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "Ring widths are 0, 1, 2 (C173 (6)); the ring's colour is a role at full strength, not a tenth step of the alpha scale (C41).",
    "names": {
      "ring-3": "ring-2",
      "ring-4": "ring-2"
    }
  }, {
    "journal": "utility-c187-retired-sheets",
    "decision": "C187 (3)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "Ring widths are 0, 1, 2 (C173 (6)); the ring's colour is a role at full strength, not a tenth step of the alpha scale (C41).",
    "sheets": {
      "ring-opacity": null
    }
  }, {
    "journal": "utility-c187-divide-spelling",
    "decision": "C187 (4)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "One spelling of the row dividers, divide-* (the Tailwind spelling); the divider's colour is a role (divide-outline-variant), not a tenth step of the alpha scale.",
    "patterns": [{
      "from": "divider-*",
      "pattern": "^divider-((?:x|y)-(?:0|1|2|3|4|reverse)|solid|dashed|dotted|double|hidden|none|current|error|info|outline|outline-variant|primary|secondary|success|tertiary|transparent|warning)$",
      "to": "divide-$1"
    }]
  }, {
    "journal": "utility-c187-retired-sheets",
    "decision": "C187 (4)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "One spelling of the row dividers, divide-* (the Tailwind spelling); the divider's colour is a role (divide-outline-variant), not a tenth step of the alpha scale.",
    "sheets": {
      "divider-opacity": "divide-outline-variant"
    }
  }, {
    "journal": "utility-c16-background-names",
    "decision": "C212 (5)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One list of roles for every colour property (owner decision C212 (5)): bg, color, border, fill, stroke, ring, ring-offset, outline, divide, caret, accent, placeholder, decoration, drop-shadow and stripe take the same role words -- the places (surface-page, -area, -card, -popup, -inverse, -container, -container-strong, -veil, -disabled), the inks (on-surface, on-surface-variant, on-surface-disabled, on-surface-inverse), outline and outline-variant, and the seven accents with -container, -container-strong and, where the property draws text, on-<accent> and on-<accent>-container; a state is hover:/active: <role>-state. The C16 background names (2026-11-08) draw exactly what their role draws: bg-surface-0 is bg-surface-page, bg-surface-1 is bg-surface-area, bg-<colour>-transparent-select is bg-<colour>-state-select, bg-<colour>-transparent-overlay is bg-<colour>-container-strong, bg-disable is bg-surface-disabled. From C212 (5) the Loader notes them; they keep drawing until remove_after.",
    "names": {
      "bg-disable": "bg-surface-disabled",
      "bg-error-transparent-overlay": "bg-error-container-strong",
      "bg-error-transparent-select": "bg-error-state-select",
      "bg-primary-transparent-overlay": "bg-primary-container-strong",
      "bg-primary-transparent-select": "bg-primary-state-select",
      "bg-secondary-transparent-overlay": "bg-secondary-container-strong",
      "bg-secondary-transparent-select": "bg-secondary-state-select",
      "bg-success-transparent-overlay": "bg-success-container-strong",
      "bg-success-transparent-select": "bg-success-state-select",
      "bg-surface-0": "bg-surface-page",
      "bg-surface-1": "bg-surface-area",
      "bg-surface-transparent-overlay": "bg-surface-container-strong",
      "bg-surface-transparent-select": "bg-surface-state-select",
      "bg-tertiary-transparent-overlay": "bg-tertiary-container-strong",
      "bg-tertiary-transparent-select": "bg-tertiary-state-select",
      "bg-warning-transparent-overlay": "bg-warning-container-strong",
      "bg-warning-transparent-select": "bg-warning-state-select"
    }
  }, {
    "journal": "utility-c16-colour-family-names",
    "decision": "C212 (5)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One list of roles for every colour property (owner decision C212 (5)): bg, color, border, fill, stroke, ring, ring-offset, outline, divide, caret, accent, placeholder, decoration, drop-shadow and stripe take the same role words -- the places (surface-page, -area, -card, -popup, -inverse, -container, -container-strong, -veil, -disabled), the inks (on-surface, on-surface-variant, on-surface-disabled, on-surface-inverse), outline and outline-variant, and the seven accents with -container, -container-strong and, where the property draws text, on-<accent> and on-<accent>-container; a state is hover:/active: <role>-state. The C16 names of the other colour families (2026-11-08) draw exactly what their role draws: surface-0 is surface-page, surface-1 is surface-area, surface-overlay is surface-veil, <colour>-transparent-overlay is <colour>-container-strong, <colour>-transparent-select is <colour>-state-select, disable is surface-disabled and on-disable is on-surface-disabled, for border-, ring-, ring-offset-, drop-shadow-, fill-, stripe-, color- and placeholder-. From C212 (5) the Loader notes them; they keep drawing until remove_after.",
    "names": {
      "border-error-transparent-overlay": "border-error-container-strong",
      "border-primary-transparent-overlay": "border-primary-container-strong",
      "border-secondary-transparent-overlay": "border-secondary-container-strong",
      "border-success-transparent-overlay": "border-success-container-strong",
      "border-surface-0": "border-surface-page",
      "border-surface-1": "border-surface-area",
      "border-surface-overlay": "border-surface-veil",
      "border-surface-transparent-overlay": "border-surface-container-strong",
      "border-tertiary-transparent-overlay": "border-tertiary-container-strong",
      "border-warning-transparent-overlay": "border-warning-container-strong",
      "color-on-disable": "color-on-surface-disabled",
      "drop-shadow-error-transparent-overlay": "drop-shadow-error-container-strong",
      "drop-shadow-error-transparent-select": "drop-shadow-error-state-select",
      "drop-shadow-primary-transparent-overlay": "drop-shadow-primary-container-strong",
      "drop-shadow-primary-transparent-select": "drop-shadow-primary-state-select",
      "drop-shadow-secondary-transparent-overlay": "drop-shadow-secondary-container-strong",
      "drop-shadow-secondary-transparent-select": "drop-shadow-secondary-state-select",
      "drop-shadow-success-transparent-overlay": "drop-shadow-success-container-strong",
      "drop-shadow-success-transparent-select": "drop-shadow-success-state-select",
      "drop-shadow-surface-0": "drop-shadow-surface-page",
      "drop-shadow-surface-1": "drop-shadow-surface-area",
      "drop-shadow-tertiary-transparent-overlay": "drop-shadow-tertiary-container-strong",
      "drop-shadow-tertiary-transparent-select": "drop-shadow-tertiary-state-select",
      "drop-shadow-warning-transparent-overlay": "drop-shadow-warning-container-strong",
      "drop-shadow-warning-transparent-select": "drop-shadow-warning-state-select",
      "fill-disable": "fill-surface-disabled",
      "fill-error-transparent-overlay": "fill-error-container-strong",
      "fill-error-transparent-select": "fill-error-state-select",
      "fill-primary-transparent-overlay": "fill-primary-container-strong",
      "fill-primary-transparent-select": "fill-primary-state-select",
      "fill-secondary-transparent-overlay": "fill-secondary-container-strong",
      "fill-secondary-transparent-select": "fill-secondary-state-select",
      "fill-success-transparent-overlay": "fill-success-container-strong",
      "fill-success-transparent-select": "fill-success-state-select",
      "fill-surface-0": "fill-surface-page",
      "fill-surface-1": "fill-surface-area",
      "fill-surface-transparent-overlay": "fill-surface-container-strong",
      "fill-surface-transparent-select": "fill-surface-state-select",
      "fill-tertiary-transparent-overlay": "fill-tertiary-container-strong",
      "fill-tertiary-transparent-select": "fill-tertiary-state-select",
      "fill-warning-transparent-overlay": "fill-warning-container-strong",
      "fill-warning-transparent-select": "fill-warning-state-select",
      "placeholder-on-disable": "placeholder-on-surface-disabled",
      "ring-error-transparent-overlay": "ring-error-container-strong",
      "ring-offset-error-transparent-overlay": "ring-offset-error-container-strong",
      "ring-offset-primary-transparent-overlay": "ring-offset-primary-container-strong",
      "ring-offset-secondary-transparent-overlay": "ring-offset-secondary-container-strong",
      "ring-offset-success-transparent-overlay": "ring-offset-success-container-strong",
      "ring-offset-surface-0": "ring-offset-surface-page",
      "ring-offset-surface-1": "ring-offset-surface-area",
      "ring-offset-surface-overlay": "ring-offset-surface-veil",
      "ring-offset-surface-transparent-overlay": "ring-offset-surface-container-strong",
      "ring-offset-tertiary-transparent-overlay": "ring-offset-tertiary-container-strong",
      "ring-offset-warning-transparent-overlay": "ring-offset-warning-container-strong",
      "ring-primary-transparent-overlay": "ring-primary-container-strong",
      "ring-secondary-transparent-overlay": "ring-secondary-container-strong",
      "ring-success-transparent-overlay": "ring-success-container-strong",
      "ring-surface-0": "ring-surface-page",
      "ring-surface-1": "ring-surface-area",
      "ring-surface-overlay": "ring-surface-veil",
      "ring-surface-transparent-overlay": "ring-surface-container-strong",
      "ring-tertiary-transparent-overlay": "ring-tertiary-container-strong",
      "ring-warning-transparent-overlay": "ring-warning-container-strong",
      "stripe-surface-transparent-overlay": "stripe-surface-container-strong"
    }
  }, {
    "journal": "class-c212-colour",
    "decision": "C212 (5)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One list of roles for every colour property (owner decision C212 (5)): bg, color, border, fill, stroke, ring, ring-offset, outline, divide, caret, accent, placeholder, decoration, drop-shadow and stripe take the same role words -- the places (surface-page, -area, -card, -popup, -inverse, -container, -container-strong, -veil, -disabled), the inks (on-surface, on-surface-variant, on-surface-disabled, on-surface-inverse), outline and outline-variant, and the seven accents with -container, -container-strong and, where the property draws text, on-<accent> and on-<accent>-container; a state is hover:/active: <role>-state. These old spellings, which no C16 record lists, draw exactly what their role draws: the bare surface is surface-area (bg-, border-, ring-, ring-offset-, fill-, drop-shadow-), and bg-<colour>-transparent and fill-<colour>-transparent, built as hover: and active: only, are <colour>-state. They keep drawing until remove_after.",
    "names": {
      "bg-error-transparent": "bg-error-state",
      "bg-primary-transparent": "bg-primary-state",
      "bg-secondary-transparent": "bg-secondary-state",
      "bg-success-transparent": "bg-success-state",
      "bg-surface": "bg-surface-area",
      "bg-surface-transparent": "bg-surface-state",
      "bg-tertiary-transparent": "bg-tertiary-state",
      "bg-warning-transparent": "bg-warning-state",
      "border-surface": "border-surface-area",
      "drop-shadow-surface": "drop-shadow-surface-area",
      "fill-error-transparent": "fill-error-state",
      "fill-primary-transparent": "fill-primary-state",
      "fill-secondary-transparent": "fill-secondary-state",
      "fill-success-transparent": "fill-success-state",
      "fill-surface": "fill-surface-area",
      "fill-surface-transparent": "fill-surface-state",
      "fill-tertiary-transparent": "fill-tertiary-state",
      "fill-warning-transparent": "fill-warning-state",
      "ring-offset-surface": "ring-offset-surface-area",
      "ring-surface": "ring-surface-area"
    }
  }, {
    "journal": "utility-c17-legacy-palette-classes",
    "decision": "C212 (5)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "Palette tones are variables, not utilities (C212 (5), C17). The legacy palette classes color-, bg- and border-<hue>[-<0..9>] (the ten names of SF4's colour array) keep drawing the static tone they read until remove_after. The hint is the role nearest to that tone in the light theme among the roles of the hue's family: the neutral places and inks for the greys and the two extremes, and error, warning, success, primary or tertiary for the others (journal utility-c17-legacy-palette-classes names the family of each). A role follows the theme and a tone does not, so a person checks the look; a colour that must stay its hue is the hue role (sf-hue-<hue> color-hue) or the tone as a variable (var(--sf-<hue>-<tone>)).",
    "names": {
      "color-white": "color-on-surface-inverse",
      "color-black": "color-on-surface",
      "color-gray": "color-on-surface-variant",
      "color-gray-0": "color-on-surface-inverse",
      "color-gray-1": "color-on-surface-inverse",
      "color-gray-2": "color-on-surface-inverse",
      "color-gray-3": "color-on-surface-inverse",
      "color-gray-4": "color-on-surface-variant",
      "color-gray-5": "color-on-surface-variant",
      "color-gray-6": "color-on-surface-variant",
      "color-gray-7": "color-on-surface-variant",
      "color-gray-8": "color-on-surface",
      "color-gray-9": "color-on-surface",
      "color-red": "color-error",
      "color-red-0": "color-on-error",
      "color-red-1": "color-on-error",
      "color-red-2": "color-on-error",
      "color-red-3": "color-error",
      "color-red-4": "color-error",
      "color-red-5": "color-error",
      "color-red-6": "color-error",
      "color-red-7": "color-error",
      "color-red-8": "color-error",
      "color-red-9": "color-error",
      "color-orange": "color-warning",
      "color-orange-0": "color-on-warning",
      "color-orange-1": "color-on-warning",
      "color-orange-2": "color-on-warning",
      "color-orange-3": "color-on-warning",
      "color-orange-4": "color-warning",
      "color-orange-5": "color-warning",
      "color-orange-6": "color-warning",
      "color-orange-7": "color-warning",
      "color-orange-8": "color-warning",
      "color-orange-9": "color-warning",
      "color-yellow": "color-on-warning",
      "color-yellow-0": "color-on-warning",
      "color-yellow-1": "color-on-warning",
      "color-yellow-2": "color-on-warning",
      "color-yellow-3": "color-on-warning",
      "color-yellow-4": "color-on-warning",
      "color-yellow-5": "color-on-warning",
      "color-yellow-6": "color-on-warning",
      "color-yellow-7": "color-warning",
      "color-yellow-8": "color-warning",
      "color-yellow-9": "color-warning",
      "color-green": "color-success",
      "color-green-0": "color-on-success",
      "color-green-1": "color-on-success",
      "color-green-2": "color-on-success",
      "color-green-3": "color-on-success",
      "color-green-4": "color-success",
      "color-green-5": "color-success",
      "color-green-6": "color-success",
      "color-green-7": "color-success",
      "color-green-8": "color-success",
      "color-green-9": "color-on-success-container",
      "color-blue": "color-primary",
      "color-blue-0": "color-on-primary",
      "color-blue-1": "color-on-primary",
      "color-blue-2": "color-on-primary",
      "color-blue-3": "color-primary",
      "color-blue-4": "color-primary",
      "color-blue-5": "color-primary",
      "color-blue-6": "color-primary",
      "color-blue-7": "color-primary",
      "color-blue-8": "color-on-primary-container",
      "color-blue-9": "color-on-primary-container",
      "color-purple": "color-tertiary",
      "color-purple-0": "color-on-tertiary",
      "color-purple-1": "color-on-tertiary",
      "color-purple-2": "color-on-tertiary",
      "color-purple-3": "color-tertiary",
      "color-purple-4": "color-tertiary",
      "color-purple-5": "color-tertiary",
      "color-purple-6": "color-tertiary",
      "color-purple-7": "color-tertiary",
      "color-purple-8": "color-on-tertiary-container",
      "color-purple-9": "color-on-tertiary-container",
      "color-pink": "color-tertiary",
      "color-pink-0": "color-on-tertiary",
      "color-pink-1": "color-on-tertiary",
      "color-pink-2": "color-on-tertiary",
      "color-pink-3": "color-tertiary",
      "color-pink-4": "color-tertiary",
      "color-pink-5": "color-tertiary",
      "color-pink-6": "color-tertiary",
      "color-pink-7": "color-tertiary",
      "color-pink-8": "color-tertiary",
      "color-pink-9": "color-tertiary",
      "bg-white": "bg-surface-page",
      "bg-black": "bg-surface-inverse",
      "bg-gray": "bg-surface-inverse",
      "bg-gray-0": "bg-surface-area",
      "bg-gray-1": "bg-surface-area",
      "bg-gray-2": "bg-surface-container-strong",
      "bg-gray-3": "bg-surface-container-strong",
      "bg-gray-4": "bg-surface-container-strong",
      "bg-gray-5": "bg-surface-inverse",
      "bg-gray-6": "bg-surface-inverse",
      "bg-gray-7": "bg-surface-inverse",
      "bg-gray-8": "bg-surface-inverse",
      "bg-gray-9": "bg-surface-inverse",
      "bg-red": "bg-error",
      "bg-red-0": "bg-error-container",
      "bg-red-1": "bg-error-container-strong",
      "bg-red-2": "bg-error-container-strong",
      "bg-red-3": "bg-error-container-strong",
      "bg-red-4": "bg-error",
      "bg-red-5": "bg-error",
      "bg-red-6": "bg-error",
      "bg-red-7": "bg-error",
      "bg-red-8": "bg-error",
      "bg-red-9": "bg-error",
      "bg-orange": "bg-warning",
      "bg-orange-0": "bg-warning-container",
      "bg-orange-1": "bg-warning-container",
      "bg-orange-2": "bg-warning-container-strong",
      "bg-orange-3": "bg-warning-container-strong",
      "bg-orange-4": "bg-warning-container-strong",
      "bg-orange-5": "bg-warning",
      "bg-orange-6": "bg-warning",
      "bg-orange-7": "bg-warning",
      "bg-orange-8": "bg-warning",
      "bg-orange-9": "bg-warning",
      "bg-yellow": "bg-warning-container-strong",
      "bg-yellow-0": "bg-warning-container",
      "bg-yellow-1": "bg-warning-container",
      "bg-yellow-2": "bg-warning-container",
      "bg-yellow-3": "bg-warning-container-strong",
      "bg-yellow-4": "bg-warning-container-strong",
      "bg-yellow-5": "bg-warning-container-strong",
      "bg-yellow-6": "bg-warning-container-strong",
      "bg-yellow-7": "bg-warning-container-strong",
      "bg-yellow-8": "bg-warning",
      "bg-yellow-9": "bg-warning",
      "bg-green": "bg-success",
      "bg-green-0": "bg-success-container",
      "bg-green-1": "bg-success-container",
      "bg-green-2": "bg-success-container-strong",
      "bg-green-3": "bg-success-container-strong",
      "bg-green-4": "bg-success-container-strong",
      "bg-green-5": "bg-success",
      "bg-green-6": "bg-success",
      "bg-green-7": "bg-success",
      "bg-green-8": "bg-success",
      "bg-green-9": "bg-success",
      "bg-blue": "bg-primary",
      "bg-blue-0": "bg-primary-container",
      "bg-blue-1": "bg-primary-container",
      "bg-blue-2": "bg-primary-container-strong",
      "bg-blue-3": "bg-primary-container-strong",
      "bg-blue-4": "bg-primary",
      "bg-blue-5": "bg-primary",
      "bg-blue-6": "bg-primary",
      "bg-blue-7": "bg-primary",
      "bg-blue-8": "bg-primary",
      "bg-blue-9": "bg-primary",
      "bg-purple": "bg-tertiary",
      "bg-purple-0": "bg-tertiary-container",
      "bg-purple-1": "bg-tertiary-container-strong",
      "bg-purple-2": "bg-tertiary-container-strong",
      "bg-purple-3": "bg-tertiary-container-strong",
      "bg-purple-4": "bg-tertiary",
      "bg-purple-5": "bg-tertiary",
      "bg-purple-6": "bg-tertiary",
      "bg-purple-7": "bg-tertiary",
      "bg-purple-8": "bg-tertiary",
      "bg-purple-9": "bg-tertiary",
      "bg-pink": "bg-tertiary",
      "bg-pink-0": "bg-tertiary-container",
      "bg-pink-1": "bg-tertiary-container-strong",
      "bg-pink-2": "bg-tertiary-container-strong",
      "bg-pink-3": "bg-tertiary-container-strong",
      "bg-pink-4": "bg-tertiary",
      "bg-pink-5": "bg-tertiary",
      "bg-pink-6": "bg-tertiary",
      "bg-pink-7": "bg-tertiary",
      "bg-pink-8": "bg-tertiary",
      "bg-pink-9": "bg-tertiary",
      "border-white": "border-surface-page",
      "border-black": "border-on-surface",
      "border-gray": "border-on-surface-variant",
      "border-gray-0": "border-surface-page",
      "border-gray-1": "border-surface-page",
      "border-gray-2": "border-outline-variant",
      "border-gray-3": "border-outline-variant",
      "border-gray-4": "border-outline",
      "border-gray-5": "border-on-surface-variant",
      "border-gray-6": "border-on-surface-variant",
      "border-gray-7": "border-on-surface-variant",
      "border-gray-8": "border-on-surface",
      "border-gray-9": "border-on-surface",
      "border-red": "border-error",
      "border-red-0": "border-error-container",
      "border-red-1": "border-error-container-strong",
      "border-red-2": "border-error-container-strong",
      "border-red-3": "border-error-container-strong",
      "border-red-4": "border-error",
      "border-red-5": "border-error",
      "border-red-6": "border-error",
      "border-red-7": "border-error",
      "border-red-8": "border-error",
      "border-red-9": "border-error",
      "border-orange": "border-warning",
      "border-orange-0": "border-warning-container",
      "border-orange-1": "border-warning-container",
      "border-orange-2": "border-warning-container-strong",
      "border-orange-3": "border-warning-container-strong",
      "border-orange-4": "border-warning",
      "border-orange-5": "border-warning",
      "border-orange-6": "border-warning",
      "border-orange-7": "border-warning",
      "border-orange-8": "border-warning",
      "border-orange-9": "border-warning",
      "border-yellow": "border-warning-container-strong",
      "border-yellow-0": "border-warning-container",
      "border-yellow-1": "border-warning-container",
      "border-yellow-2": "border-warning-container",
      "border-yellow-3": "border-warning-container-strong",
      "border-yellow-4": "border-warning-container-strong",
      "border-yellow-5": "border-warning-container-strong",
      "border-yellow-6": "border-warning-container-strong",
      "border-yellow-7": "border-warning",
      "border-yellow-8": "border-warning",
      "border-yellow-9": "border-warning",
      "border-green": "border-success",
      "border-green-0": "border-success-container",
      "border-green-1": "border-success-container",
      "border-green-2": "border-success-container-strong",
      "border-green-3": "border-success-container-strong",
      "border-green-4": "border-success",
      "border-green-5": "border-success",
      "border-green-6": "border-success",
      "border-green-7": "border-success",
      "border-green-8": "border-success",
      "border-green-9": "border-success",
      "border-blue": "border-primary",
      "border-blue-0": "border-primary-container",
      "border-blue-1": "border-primary-container",
      "border-blue-2": "border-primary-container-strong",
      "border-blue-3": "border-primary-container-strong",
      "border-blue-4": "border-primary",
      "border-blue-5": "border-primary",
      "border-blue-6": "border-primary",
      "border-blue-7": "border-primary",
      "border-blue-8": "border-primary",
      "border-blue-9": "border-primary",
      "border-purple": "border-tertiary",
      "border-purple-0": "border-tertiary-container",
      "border-purple-1": "border-tertiary-container-strong",
      "border-purple-2": "border-tertiary-container-strong",
      "border-purple-3": "border-tertiary",
      "border-purple-4": "border-tertiary",
      "border-purple-5": "border-tertiary",
      "border-purple-6": "border-tertiary",
      "border-purple-7": "border-tertiary",
      "border-purple-8": "border-tertiary",
      "border-purple-9": "border-tertiary",
      "border-pink": "border-tertiary",
      "border-pink-0": "border-tertiary-container",
      "border-pink-1": "border-tertiary-container-strong",
      "border-pink-2": "border-tertiary-container-strong",
      "border-pink-3": "border-tertiary-container-strong",
      "border-pink-4": "border-tertiary",
      "border-pink-5": "border-tertiary",
      "border-pink-6": "border-tertiary",
      "border-pink-7": "border-tertiary",
      "border-pink-8": "border-tertiary",
      "border-pink-9": "border-tertiary"
    }
  }, {
    "journal": "class-c212-colour-nearest",
    "decision": "C212 (5)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "color-disable and placeholder-disable paint text in the disabled surface colour (--sf-surface-disabled), a fill, not an ink. The disabled ink is on-surface-disabled (color-on-surface-disabled, placeholder-on-surface-disabled); it looks different, so a person checks. The old names keep drawing until remove_after.",
    "names": {
      "placeholder-disable": "placeholder-on-surface-disabled",
      "color-disable": "color-on-surface-disabled"
    }
  }, {
    "journal": "utility-c187-retired-sheets",
    "decision": "C187 (5)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "Of the effects the utilities keep blur-*, backdrop-blur-* and opacity-*; filters, backdrop filters, masks and blend modes leave (no use in the Framework, the docs examples or the products, 2026-11-14).",
    "sheets": {
      "mix-blend-mode": null,
      "filter-brightness": null,
      "filter-contrast": null,
      "filter-grayscale": null,
      "filter-hue-rotate": null,
      "filter-invert": null,
      "filter-opacity": null,
      "filter-saturate": null,
      "filter-sepia": null,
      "backdrop-filer-hue-rotate": null,
      "backdrop-filter-brightness": null,
      "backdrop-filter-contrast": null,
      "backdrop-filter-grayscale": null,
      "backdrop-filter-invert": null,
      "backdrop-filter-opacity": null,
      "backdrop-filter-saturate": null,
      "backdrop-filter-sepia": null,
      "mask-clip": null,
      "mask-composite": null,
      "mask-mode": null,
      "mask-origin": null,
      "mask-position": null,
      "mask-repeat": null,
      "mask-size": null,
      "mask-type": null
    }
  }, {
    "journal": "class-c212-gradient",
    "decision": "C212 (1)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "Gradients (C212 (1)): the six C65 kinds by default; a free gradient only as bg-gradient-to-<side> with from-, via- and to-<role>. These old names draw exactly what their new name draws and keep drawing until remove_after: gr1-*, gr2-* and gr3-* set the same three stops as from-*, via-* and to-* (journal utility-c65-gradient-names), and the stop colours surface-0 and surface-1 are the places surface-page and surface-area.",
    "names": {
      "gr1-transparent": "from-transparent",
      "gr1-current": "from-current",
      "gr1-inherit": "from-inherit",
      "gr1-surface-0": "from-surface-page",
      "gr1-surface-page": "from-surface-page",
      "gr1-surface-1": "from-surface-area",
      "gr1-surface-area": "from-surface-area",
      "gr1-on-surface": "from-on-surface",
      "gr1-primary": "from-primary",
      "gr1-primary-container": "from-primary-container",
      "gr1-secondary": "from-secondary",
      "gr1-secondary-container": "from-secondary-container",
      "gr1-tertiary": "from-tertiary",
      "gr1-tertiary-container": "from-tertiary-container",
      "gr1-success": "from-success",
      "gr1-warning": "from-warning",
      "gr1-info": "from-info",
      "gr2-transparent": "via-transparent",
      "gr2-current": "via-current",
      "gr2-inherit": "via-inherit",
      "gr2-surface-0": "via-surface-page",
      "gr2-surface-page": "via-surface-page",
      "gr2-surface-1": "via-surface-area",
      "gr2-surface-area": "via-surface-area",
      "gr2-on-surface": "via-on-surface",
      "gr2-primary": "via-primary",
      "gr2-primary-container": "via-primary-container",
      "gr2-secondary": "via-secondary",
      "gr2-secondary-container": "via-secondary-container",
      "gr2-tertiary": "via-tertiary",
      "gr2-tertiary-container": "via-tertiary-container",
      "gr2-success": "via-success",
      "gr2-warning": "via-warning",
      "gr2-info": "via-info",
      "gr3-transparent": "to-transparent",
      "gr3-current": "to-current",
      "gr3-inherit": "to-inherit",
      "gr3-surface-0": "to-surface-page",
      "gr3-surface-page": "to-surface-page",
      "gr3-surface-1": "to-surface-area",
      "gr3-surface-area": "to-surface-area",
      "gr3-on-surface": "to-on-surface",
      "gr3-primary": "to-primary",
      "gr3-primary-container": "to-primary-container",
      "gr3-secondary": "to-secondary",
      "gr3-secondary-container": "to-secondary-container",
      "gr3-tertiary": "to-tertiary",
      "gr3-tertiary-container": "to-tertiary-container",
      "gr3-success": "to-success",
      "gr3-warning": "to-warning",
      "gr3-info": "to-info",
      "from-surface-0": "from-surface-page",
      "from-surface-1": "from-surface-area",
      "via-surface-0": "via-surface-page",
      "via-surface-1": "via-surface-area",
      "to-surface-0": "to-surface-page",
      "to-surface-1": "to-surface-area"
    }
  }, {
    "journal": "class-c212-gradient-nearest",
    "decision": "C212 (1)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "Gradients (C212 (1)) with no exact twin: they keep drawing what they drew until remove_after, and the name to write looks different. gr-line-2 and gr-line-3 (a line at --sf-gradient--angle, 90deg by default) -> bg-gradient-to-<side> with from-/via-/to-<role> (bg-gradient-to-r is the default angle); gr-radial-* -> a C65 kind (gradient-glow for a soft spot); gr-conic-* has no successor. A stop at a palette tone (from-teal-40, to-primary-90) -> a role stop for the theme palettes and statuses (from-primary), and for a static hue or neutral a C65 kind in that hue (gradient-color-<hue>, gradient-to-<hue> for the partner; neutral is gray). surface-2 (neutral 95, dark 15) has no place of the same colour in both themes: surface-area is the nearest.",
    "names": {
      "gr1-surface-2": "from-surface-area",
      "gr2-surface-2": "via-surface-area",
      "gr3-surface-2": "to-surface-area",
      "from-surface-2": "from-surface-area",
      "via-surface-2": "via-surface-area",
      "to-surface-2": "to-surface-area",
      "gr-line-2": "bg-gradient-to-r",
      "gr-line-3": "bg-gradient-to-r",
      "gr-radial-2": "gradient-glow",
      "gr-radial-3": "gradient-glow",
      "gr-conic-2": null,
      "gr-conic-3": null
    },
    "patterns": [{
      "from": "from-, via-, to-<role>-<tone>",
      "pattern": "^(from|via|to)-(primary|secondary|tertiary|error|warning|success|info)-(?:5|10|15|20|25|30|35|40|50|60|70|80|85|90|95|98)$",
      "to": "$1-$2"
    }, {
      "from": "from-, via-<hue>-<tone>",
      "pattern": "^(?:from|via)-(red|orange|amber|yellow|lime|green|teal|cyan|sky|blue|indigo|violet|purple|pink|brown|gray)-(?:5|10|15|20|25|30|35|40|50|60|70|80|85|90|95|98)$",
      "to": "gradient-color-$1"
    }, {
      "from": "to-<hue>-<tone>",
      "pattern": "^to-(red|orange|amber|yellow|lime|green|teal|cyan|sky|blue|indigo|violet|purple|pink|brown|gray)-(?:5|10|15|20|25|30|35|40|50|60|70|80|85|90|95|98)$",
      "to": "gradient-to-$1"
    }, {
      "from": "from-, via-neutral-<tone>",
      "pattern": "^(?:from|via)-neutral-(?:5|10|15|20|25|30|35|40|50|60|70|80|85|90|95|98)$",
      "to": "gradient-color-gray"
    }, {
      "from": "to-neutral-<tone>",
      "pattern": "^to-neutral-(?:5|10|15|20|25|30|35|40|50|60|70|80|85|90|95|98)$",
      "to": "gradient-to-gray"
    }]
  }, {
    "journal": "class-c187-utility-renames",
    "decision": "C187 (6)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "Motion by role: ease-enter, ease-exit, ease-move, ease-linear on --sf-ease-*. A delay lives inside the component that needs it (C130 (8)); will-change and the slide-in animations leave.",
    "names": {
      "ease-in": "ease-exit",
      "ease-out": "ease-enter",
      "ease-in-out": "ease-move"
    }
  }, {
    "journal": "class-c187-retired-classes",
    "decision": "C187 (6)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "Motion by role: ease-enter, ease-exit, ease-move, ease-linear on --sf-ease-*. A delay lives inside the component that needs it (C130 (8)); will-change and the slide-in animations leave.",
    "names": {
      "animation-from-bottom": null,
      "animation-from-left": null,
      "animation-from-right": null
    }
  }, {
    "journal": "utility-c187-retired-sheets",
    "decision": "C187 (6)",
    "component": "utility",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "Motion by role: ease-enter, ease-exit, ease-move, ease-linear on --sf-ease-*. A delay lives inside the component that needs it (C130 (8)); will-change and the slide-in animations leave.",
    "sheets": {
      "transition-delay": null,
      "will-change": null
    }
  }, {
    "journal": "class-c187-retired-parts",
    "decision": "C187 (8)",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "Small parts: the single legacy tab joins sf-tabs; emoji, the heading outline (its name clashes with the colour role --sf-outline) and hide-show leave.",
    "names": {
      "sf-tab": {
        "to": "sf-tabs",
        "component": "tab"
      },
      "sf-emoji": {
        "to": null,
        "component": "emoji"
      },
      "sf-outline": {
        "to": null,
        "component": "outline"
      },
      "sf-hide-show": {
        "to": null,
        "component": "hide-show"
      }
    }
  }, {
    "journal": "class-c212-alignment",
    "decision": "C212 (2)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "Alignment is written with the SIMAI Framework axis names: content-main-*, content-cross-*, items-main-*, items-cross-*, self-main-*, self-cross-*, and for both axes items-*, content-*, self-*. justify-* is the Tailwind spelling of content-main-*: the Loader converts it (Tailwind names work through the Loader conversion only), and the class keeps drawing for pages without the Loader until remove_after. The nine two-axis classes of flex-align (start-start ... end-end, main axis first) become two classes, content-main-<main> items-cross-<cross>; they wrote flex-start and flex-end on the cross axis where items-cross-* writes start and end (the same place except under flex-wrap: wrap-reverse).",
    "names": {
      "justify-start": "content-main-start",
      "justify-end": "content-main-end",
      "justify-center": "content-main-center",
      "justify-between": "content-main-between",
      "justify-around": "content-main-around",
      "justify-evenly": "content-main-evenly",
      "start-start": "content-main-start items-cross-start",
      "start-center": "content-main-start items-cross-center",
      "start-end": "content-main-start items-cross-end",
      "center-start": "content-main-center items-cross-start",
      "center-center": "content-main-center items-cross-center",
      "center-end": "content-main-center items-cross-end",
      "end-start": "content-main-end items-cross-start",
      "end-center": "content-main-end items-cross-center",
      "end-end": "content-main-end items-cross-end"
    }
  }, {
    "journal": "class-c187-doc-to-docara",
    "decision": "C187 (8)",
    "component": "doc",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "The documentation helpers (sample frame, pair, source, lead, code, checkerboard and stripes) belong to the documentation site: Docara draws them (D20 already holds the example frame). The Framework keeps the sheet until the date.",
    "names": {
      "sf-doc-example": null,
      "sf-doc-pair": null,
      "sf-doc-source": null,
      "sf-doc-lead": null,
      "sf-doc-code": null,
      "sf-doc-checkerboard": null,
      "sf-doc-stripes": null
    }
  }, {
    "journal": "class-editor-utility-retired",
    "decision": "C170",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "src/utility/editor held one rule, .editor--default.active on the popover layer, and no Loader rule or build ever shipped it. An editor's layers belong to sf-editor-overlay (C170); the folder leaves after the date.",
    "names": {
      "editor--default": "sf-editor-overlay"
    }
  }, {
    "journal": "class-c96-tabs-looks",
    "decision": "C96 (1)",
    "component": "sf-tabs",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "Two looks of the tabs: the line (default, no modifier) and the plate (sf-tabs--pills). sf-tabs--full draws the line with the tabs sharing the row equally until remove_after.",
    "names": {
      "sf-tabs--full": "sf-tabs"
    }
  }, {
    "journal": "class-steps-1-2-stages-retired",
    "decision": "C187 (1), C134, C101",
    "component": "step",
    "since": "2026-11-14",
    "remove_after": "2027-01-01",
    "note": "The sf-steps 1.2.0 markup: stage classes, the class selected (with aria-current=\"step\") on the current step and a «›» icon between steps. Until the date they draw the C101 look -- a numbered marker (the step's own icon for a done or failed step), the label, the line -- so the current step stays marked. Write sf-step--state-ahead (or sf-step--state-current for the selected step), -done, -error with an sf-step-body; the line is drawn by the list's layout.",
    "names": {
      "sf-step--stage-default": "sf-step--state-ahead",
      "sf-step--stage-completed": "sf-step--state-done",
      "sf-step--stage-error": "sf-step--state-error",
      "sf-steps-separator--directional": null
    }
  }, {
    "journal": "class-page-number-circle-retired",
    "decision": "C237",
    "component": "pagination",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One shape for a page number, the square of the button (sf-pagination has no round numbers, and the plain component follows it, C224); the dots and the picture counter belong to sf-gallery and sf-slider (C97 (7)). sf-page-number--circle draws the square until the date.",
    "names": {
      "sf-page-number--circle": "sf-page-number--square"
    }
  }, {
    "journal": "class-c238-menu-default-navigation",
    "decision": "C238",
    "component": "sf-menu",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "The navigation look is the menu's default (C23, C30): a .sf-menu without a look modifier draws it. sf-menu--framed draws the former default's framed rows until remove_after.",
    "names": {
      "sf-menu--framed": "sf-menu"
    }
  }, {
    "journal": "class-avatar-offline-point-retired",
    "decision": "C152 (5), C185 (8)",
    "component": "avatars",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "An avatar shows only «online» and, on request, «away»; offline is a word in the avatar's name. sf-online-indicator--offline draws nothing (component.avatars 1.11.0).",
    "names": {
      "sf-online-indicator--offline": null
    }
  }, {
    "journal": "class-avatar-group-overlap-by-size",
    "decision": "C152 (6)",
    "component": "avatars",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "The group's overlap follows the avatars' own size: 4 up to size 1, 8 at 2 and 3 (component.avatars 1.11.0). The overlap modifiers keep drawing what they drew until the date (xs, sm and md: journal class-avatar-group-overlap-size-names).",
    "names": {
      "sf-avatar-group--size-1/4": "sf-avatar-group",
      "sf-avatar-group--size-1/3": "sf-avatar-group",
      "sf-avatar-group--size-1/2": "sf-avatar-group"
    }
  }, {
    "journal": "class-avatar-card-portrait-9x16",
    "decision": "C230",
    "component": "avatars",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "The avatar card's portrait is 3:4, the one vertical ratio of the shared list (component.avatars 1.11.0). sf-avatar-card--portrait-9x16 keeps the former 9:16 until the date.",
    "names": {
      "sf-avatar-card--portrait-9x16": "sf-avatar-card--portrait"
    }
  }, {
    "journal": "class-c212-hide-print",
    "decision": "C212 (6)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One set to hide: hidden, invisible, sr-only (in the core sheet) and on paper print-hidden, print-only, print-invisible. print-block, print-inline, print-inline-block, print-flex, print-inline-flex and print-table hid an element on screen and set its display on paper: print-only hides it on screen and leaves the display its own classes give it on paper. print-visible-none is print-invisible (invisible on paper, its room kept). print-hidden removes the element on paper (display: none); use print-invisible to keep the space. The old names keep drawing what they drew until remove_after.",
    "names": {
      "print-block": "print-only",
      "print-inline": "print-only",
      "print-inline-block": "print-only",
      "print-flex": "print-only",
      "print-inline-flex": "print-only",
      "print-table": "print-only",
      "print-visible-none": "print-invisible"
    }
  }, {
    "journal": "class-ut1-layout-col-auto",
    "decision": "C212",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "layout-col-auto wrote column-count: auto; without a column width, which no utility gives, a block with it is always one column, so the class did nothing. Write layout-col-<n> for n columns. It keeps drawing what it drew until remove_after.",
    "names": {
      "layout-col-auto": null
    }
  }, {
    "journal": "class-ut1-grid-row",
    "decision": "C212",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One set per job (C212): rows are row-*, as columns are col-*. grid-row-auto and grid-row-span-* were one rule with row-auto and row-span-*. They keep drawing until remove_after.",
    "names": {
      "grid-row-auto": "row-auto",
      "grid-row-span-1": "row-span-1",
      "grid-row-span-2": "row-span-2",
      "grid-row-span-3": "row-span-3",
      "grid-row-span-4": "row-span-4",
      "grid-row-span-5": "row-span-5",
      "grid-row-span-6": "row-span-6",
      "grid-row-span-full": "row-span-full"
    }
  }, {
    "journal": "class-ut1-negative-auto",
    "decision": "IN-4 (RG-UT-L)",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "A negative margin takes a step away; auto has none. -m-auto, -m-top-auto and the other negative auto classes wrote calc(0rem - auto), which the browser drops, so they drew nothing; the sheets no longer write them (utility.margin 1.1.0). Remove the class, or write m-*-auto for an auto margin.",
    "names": {
      "-m-auto": null,
      "-m-top-auto": null,
      "-m-bottom-auto": null,
      "-m-inline-start-auto": null,
      "-m-inline-end-auto": null,
      "-m-inline-auto": null,
      "-m-block-auto": null
    }
  }, {
    "journal": "class-ut1-bg-position",
    "decision": "C212",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One set per job (C212): the background position is written with the logical sides, bg-inline-start* and bg-inline-end*, which follow dir=\"rtl\" (utility.background-position 1.1.0). bg-left, bg-right and their -top/-bottom forms keep drawing their physical side until remove_after; the Loader's Tailwind conversion already writes the logical names.",
    "names": {
      "bg-left": "bg-inline-start",
      "bg-left-top": "bg-inline-start-top",
      "bg-left-bottom": "bg-inline-start-bottom",
      "bg-right": "bg-inline-end",
      "bg-right-top": "bg-inline-end-top",
      "bg-right-bottom": "bg-inline-end-bottom"
    }
  }, {
    "journal": "class-ut1-blur",
    "decision": "C212",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One name per job (C212): blur and backdrop-blur drew the same 4 px as blur-medium and backdrop-blur-medium. They keep drawing until remove_after.",
    "names": {
      "blur": "blur-medium",
      "backdrop-blur": "backdrop-blur-medium"
    }
  }, {
    "journal": "class-ut1-radius-square",
    "decision": "C212",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "One name per job (C212): radius-square and its side forms drew the same 0 as radius-0 (--sf-radius-square is 0). They keep drawing until remove_after.",
    "names": {
      "radius-square": "radius-0",
      "radius-top-square": "radius-top-0",
      "radius-bottom-square": "radius-bottom-0",
      "radius-inline-start-square": "radius-inline-start-0",
      "radius-inline-end-square": "radius-inline-end-0",
      "radius-top-inline-start-square": "radius-top-inline-start-0",
      "radius-top-inline-end-square": "radius-top-inline-end-0",
      "radius-bottom-inline-start-square": "radius-bottom-inline-start-0",
      "radius-bottom-inline-end-square": "radius-bottom-inline-end-0"
    }
  }, {
    "journal": "class-ut1-tracking",
    "decision": "C212",
    "component": "utility",
    "since": "2026-11-16",
    "remove_after": "2027-01-01",
    "note": "tracking-normal is the name of the default letter spacing; tracking-no-tracking repeated the word and keeps drawing the same value until remove_after.",
    "names": {
      "tracking-no-tracking": "tracking-normal"
    }
  }, {
    "journal": "class-c264-aspect-list",
    "decision": "C264",
    "component": "utility",
    "since": "2026-11-17",
    "remove_after": "2027-01-01",
    "note": "One list of proportions for pictures, galleries, card images and the aspect-* utility (C188 (6), C230, C264): 1x1, 4x3, 3x2, 16x9, 21x9, 3x4, auto (aspect-21x9 and aspect-auto are new, utility.aspect-ratio 1.1.0). The six other names keep drawing their own ratio until remove_after; the name to write is the nearest of the list, which looks different (9x16, 1x2, 2x3 -> 3x4; 2x1 -> 16x9; 3x1, 4x1 -> 21x9).",
    "names": {
      "aspect-9x16": "aspect-3x4",
      "aspect-1x2": "aspect-3x4",
      "aspect-2x3": "aspect-3x4",
      "aspect-2x1": "aspect-16x9",
      "aspect-3x1": "aspect-21x9",
      "aspect-4x1": "aspect-21x9"
    }
  }, {
    "journal": "class-c266-scroll-side-names",
    "decision": "C266",
    "component": "utility",
    "since": "2026-11-17",
    "remove_after": "2027-01-01",
    "note": "The scroll margins and paddings name their sides as m-* and p-* do (C266): scroll-m-top, scroll-m-bottom, scroll-m-block, scroll-m-inline(-start/-end); scroll-p-top, scroll-p-bottom, scroll-p-inline-start, scroll-p-inline-end, scroll-p-x, scroll-p-y (utility.scroll-margin and utility.scroll-padding 1.1.0). The short letters (scroll-mt, scroll-pl ...; l and r meant the start and the end of the line, the other way under dir=\"rtl\") keep drawing until remove_after.",
    "patterns": [{
      "from": "scroll-mt-*",
      "pattern": "^scroll-mt-(0|1/[234]|[1-8])$",
      "to": "scroll-m-top-$1"
    }, {
      "from": "scroll-mb-*",
      "pattern": "^scroll-mb-(0|1/[234]|[1-8])$",
      "to": "scroll-m-bottom-$1"
    }, {
      "from": "scroll-my-*",
      "pattern": "^scroll-my-(0|1/[234]|[1-8])$",
      "to": "scroll-m-block-$1"
    }, {
      "from": "scroll-pt-*",
      "pattern": "^scroll-pt-(0|1/[234]|[1-8])$",
      "to": "scroll-p-top-$1"
    }, {
      "from": "scroll-pb-*",
      "pattern": "^scroll-pb-(0|1/[234]|[1-8])$",
      "to": "scroll-p-bottom-$1"
    }, {
      "from": "scroll-pl-*",
      "pattern": "^scroll-pl-(0|1/[234]|[1-8])$",
      "to": "scroll-p-inline-start-$1"
    }, {
      "from": "scroll-pr-*",
      "pattern": "^scroll-pr-(0|1/[234]|[1-8])$",
      "to": "scroll-p-inline-end-$1"
    }, {
      "from": "scroll-px-*",
      "pattern": "^scroll-px-(0|1/[234]|[1-8])$",
      "to": "scroll-p-x-$1"
    }, {
      "from": "scroll-py-*",
      "pattern": "^scroll-py-(0|1/[234]|[1-8])$",
      "to": "scroll-p-y-$1"
    }]
  }, {
    "journal": "class-c268-pointer-events",
    "decision": "C268",
    "component": "utility",
    "since": "2026-11-17",
    "remove_after": "2027-01-01",
    "note": "The class is named as the property (C268): pointer-events-none and pointer-events-auto (utility.pointer-events 1.1.0). pointer-event-none and pointer-event-auto keep drawing until remove_after; the Loader no longer converts the Tailwind name, which is now the class.",
    "patterns": [{
      "from": "pointer-event-*",
      "pattern": "^pointer-event-(none|auto)$",
      "to": "pointer-events-$1"
    }]
  }, {
    "journal": "class-c271-scale-percent",
    "decision": "C271",
    "component": "utility",
    "since": "2026-11-17",
    "remove_after": "2027-01-01",
    "note": "The scale says its percent (C271): scale-80, 90, 95, 100, 105, 110, 120 and their -x- and -y- forms (utility.transform-scale 1.1.0); scale-0 stays. The fraction and step names draw the same scale until remove_after.",
    "names": {
      "scale-1/4": "scale-80",
      "scale-1/3": "scale-90",
      "scale-1/2": "scale-95",
      "scale-1": "scale-100",
      "scale-2": "scale-105",
      "scale-3": "scale-110",
      "scale-4": "scale-120",
      "scale-x-1/4": "scale-x-80",
      "scale-x-1/3": "scale-x-90",
      "scale-x-1/2": "scale-x-95",
      "scale-x-1": "scale-x-100",
      "scale-x-2": "scale-x-105",
      "scale-x-3": "scale-x-110",
      "scale-x-4": "scale-x-120",
      "scale-y-1/4": "scale-y-80",
      "scale-y-1/3": "scale-y-90",
      "scale-y-1/2": "scale-y-95",
      "scale-y-1": "scale-y-100",
      "scale-y-2": "scale-y-105",
      "scale-y-3": "scale-y-110",
      "scale-y-4": "scale-y-120"
    }
  }, {
    "journal": "utility-c272-skew-retired",
    "decision": "C272",
    "component": "utility",
    "since": "2026-11-17",
    "remove_after": "2027-01-01",
    "note": "The slant leaves the utilities (C272): skew-x-* and skew-y-* (0, 1, 2, 3, 5, 15 degrees, and their hover: forms) were used by no Framework part, product or example; they keep drawing until remove_after. A slant a design needs belongs to the effects package (C57).",
    "sheets": {
      "transform-skew": null
    }
  }, {
    "journal": "class-c274-text-role-short-names",
    "decision": "C274",
    "component": "utility",
    "since": "2026-11-17",
    "remove_after": "2027-01-01",
    "note": "The text roles are written .sf-display-N, .sf-body-*, .sf-label-*, or with the text utilities of C212 (text-N) (C274). .d1-6 and .display1-6 are .sf-display-N under another name; .text, .text-small, .text-medium, .text-large, .label, .label-small, .label-medium and .label-large draw only the size and the line of a role, without its family and weight; .body-text, .body-text-small, .body-text-medium and .body-text-large are the same rules as .text, .text-small, .text-medium and .text-large under a longer name. They keep drawing until remove_after; the name to write draws the same (text-N, sf-display-N), except label-large, which has no text step: its role .sf-label-large also sets the family and the regular weight.",
    "names": {
      "d1": "sf-display-1",
      "display1": "sf-display-1",
      "d2": "sf-display-2",
      "display2": "sf-display-2",
      "d3": "sf-display-3",
      "display3": "sf-display-3",
      "d4": "sf-display-4",
      "display4": "sf-display-4",
      "d5": "sf-display-5",
      "display5": "sf-display-5",
      "d6": "sf-display-6",
      "display6": "sf-display-6",
      "text": "text-1",
      "text-medium": "text-1",
      "text-small": "text-1/2",
      "text-large": "text-2",
      "label": "text-1/3",
      "label-medium": "text-1/3",
      "label-small": "text-1/4",
      "label-large": "sf-label-large",
      "body-text": "text-1",
      "body-text-medium": "text-1",
      "body-text-small": "text-1/2",
      "body-text-large": "text-2"
    }
  }, {
    "journal": "utility-c208-scrollbar-retired-sheets",
    "decision": "C208 (2), (3)",
    "component": "utility",
    "since": "2026-11-15",
    "remove_after": "2027-01-01",
    "note": "The scrollbar has no palette and no thickness of its own: the thumb takes the place's boundary at rest and its text under the pointer, track 14 and thumb 6 at every density. The thumb colour utilities (scroll-primary ..., scroll-thumb-*), the thumb width utilities (scroll-0 ... scroll-4) and the track width utilities (scroll-bg-1 ... scroll-bg-4) leave; a quieter bar is scroll-subtle.",
    "sheets": {
      "scroll-slider-color": null,
      "scroll-slider-width": null,
      "scroll-backdrop-width": null
    }
  }, {
    "journal": "utility-c210-scrollbar-retired-sheets",
    "decision": "C210 (5)",
    "component": "utility",
    "since": "2026-11-15",
    "remove_after": "2027-01-01",
    "note": "One bar everywhere: it hides 1 s after it stops by itself, keeps its room, takes the place's boundary and rounds its ends. scroll-hover is the default now (remove it); scroll-subtle, the track colours scroll-bg-<colour> and the track and thumb roundings scroll-bg-radius-1 ... 4, scroll-radius-1 ... 4 and scroll-thumb-radius-1 ... 4 leave (remove them; a square bar is scrollbar-square). The modifiers are scrollbar-always, scrollbar-thin, scrollbar-flush, scrollbar-square, scrollbar-hidden.",
    "sheets": {
      "scroll-hover": null,
      "scroll-subtle": null,
      "scroll-backdrop-color": null,
      "scroll-backdrop-radius": null,
      "scroll-slider-radius": null
    }
  }, {
    "journal": "class-c210-scrollbar-class",
    "decision": "C210 (5)",
    "component": "scrollbar",
    "since": "2026-11-15",
    "remove_after": "2027-01-01",
    "note": "The legacy .scrollbar class (an 8 strip, named in no document) leaves: every scrolling area has the one bar without a class.",
    "names": {
      "scrollbar": null
    }
  }],
  "extended": {
    "decision": "C187 (2), (3); C270",
    "note": "Kept, documented together on one «extended» page, not a page per class. C270 (2026-11-17): the SVG stroke and the text decoration line follow the border widths, 0, 1, 2 on --sf-line--*; their wider steps join this page.",
    "sheets": ["width-ext", "height-ext", "max-width-ext", "max-height-ext", "flex-basis-ext", "element-position-ext"],
    "patterns": [{
      "family": "border-width 3-10",
      "pattern": "^border-(?:(?:top|bottom|x|y|inline-start|inline-end)-)?(?:[3-9]|10)$"
    }, {
      "family": "outline-width 3-4",
      "pattern": "^outline-[34]$"
    }, {
      "family": "outline-offset 3-4",
      "pattern": "^outline-offset-[34]$"
    }, {
      "family": "ring-offset-width 3-4",
      "pattern": "^ring-offset-[34]$"
    }, {
      "family": "divide widths 3-4",
      "pattern": "^divide-[xy]-[34]$"
    }, {
      "family": "stroke-width 3-10",
      "pattern": "^stroke-(?:[3-9]|10)$"
    }, {
      "family": "text-decoration-thickness 3-4",
      "pattern": "^decoration-[34]$"
    }, {
      "family": "ring-offset-color strong and overlay",
      "pattern": "^ring-offset-[a-z-]+-(?:container-strong|transparent-overlay)$"
    }]
  }
});

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
// A legacy alias is rewritten only when the whole class is a utility name:
// a family prefix followed by one of its values. A prefix alone is not
// enough -- an author's own class pr-row, mt-section, right-panel or
// grid-cols-wrap is a name, not a utility, and it stays as written (DEV,
// dropdown-panels study R193: pr-row became p-inline-end-row at load).
// The size ladder a0..i9 is a value too (pt-a5, -left-b2, mr-i9): the
// documentation names it, and the built sheets ship it for every side family.
const SIZE = String.raw`(?:\d+(?:\.\d+)?|\d+\/\d+|[a-i]\d|px|\[[^\]\s]+\])`;
const PADDING_VALUE = new RegExp(`^${SIZE}$`);
const MARGIN_VALUE = new RegExp(`^(?:${SIZE}|auto)$`);
const POSITION_VALUE = new RegExp(`^(?:${SIZE}|auto|full)$`);
const BORDER_SIDE_VALUE = /^(?:\d+|px|solid|dashed|dotted|double|hidden|none|inset|\[[^\]\s]+\])$/;
const GRID_COLS_VALUE = /^(?:\d+|none|subgrid|\[[^\]\s]+\])$/;

const sideValue = (mp, value) => (mp === 'p' ? PADDING_VALUE : MARGIN_VALUE).test(value);

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
    // RG-TW-4 (C212 (3)): a weight converts to a public role where it is the
    // same weight (font-normal 400, font-medium 500, font-bold 700). Thin,
    // light, semibold, extrabold and black have no role of their weight:
    // they keep their dated alias weight-1..9 (it draws the same weight) and
    // the Loader notes it with the role to write.
    'font-thin': 'weight-1',
    'font-extralight': 'weight-2',
    'font-light': 'weight-3',
    'font-normal': 'weight-regular',
    'font-medium': 'weight-medium',
    'font-semibold': 'weight-6',
    'font-bold': 'weight-bold',
    'font-extrabold': 'weight-8',
    'font-black': 'weight-9',
    'font-sans': 'sans',
    'font-serif': 'serif',
    'font-mono': 'mono',
    'flex-column': 'flex-col',
    'flex-center': 'center-center',
    't-left': 'text-start',
    't-right': 'text-end',
    'not-italic': 'italic-none',
    'normal-case': 'normalcase',
    'no-underline': 'decoration-none',
    // The current names, not the retired ones (C186 (8): t-ellipsis and
    // t-clip are truncate, wrap-none is text-nowrap; RG-UT-V TYP-2): a
    // converted page took a SF.deprecations entry for a name it never wrote.
    'text-ellipsis': 'truncate',
    'text-clip': 'truncate',
    'bg-no-repeat': 'bg-repeat-none',
    'whitespace-nowrap': 'text-nowrap',
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
    if (!sideValue(sideKey[0], value)) return null;
    if (negative && sideKey[0] === 'p') return null;
    return `${negative}${sideMap[sideKey]}-${value}`;
  }

  const legacySideMatch = base.match(/^(m|p)-(left|right)-(.+)$/);

  if (legacySideMatch) {
    const [, mp, side, value] = legacySideMatch;
    if (!sideValue(mp, value)) return null;
    if (negative && mp === 'p') return null;
    const mappedSide = side === 'left' ? 'inline-start' : 'inline-end';
    return `${negative}${mp}-${mappedSide}-${value}`;
  }

  const borderSideMatch = base.match(/^border-(l|r)-(.+)$/);

  if (borderSideMatch && BORDER_SIDE_VALUE.test(borderSideMatch[2])) {
    const side = borderSideMatch[1] === 'l' ? 'inline-start' : 'inline-end';
    return `border-${side}-${borderSideMatch[2]}`;
  }

  const borderSideLegacyMatch = base.match(/^border-(left|right)-(.+)$/);

  if (borderSideLegacyMatch && BORDER_SIDE_VALUE.test(borderSideLegacyMatch[2])) {
    const side = borderSideLegacyMatch[1] === 'left' ? 'inline-start' : 'inline-end';
    return `border-${side}-${borderSideLegacyMatch[2]}`;
  }

  const gridColsMatch = base.match(/^grid-cols-(.+)$/);

  if (gridColsMatch && GRID_COLS_VALUE.test(gridColsMatch[1])) {
    return `grid-col-${gridColsMatch[1]}`;
  } // Tailwind's columns-N is the Framework's layout-col-N (utility/column;
  // C187 (7), UT-7): multi-column text for print and documents.


  const columnsMatch = base.match(/^columns-(\d{1,2}|auto)$/);

  if (columnsMatch) {
    const value = columnsMatch[1];
    if (value === 'auto' || Number(value) >= 1 && Number(value) <= 12) return `layout-col-${value}`;
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
    if (value === 0) return 'z-0'; // The pair has one layer below the page, spelled z--1 (utility/z-index);
    // -z-1 is not a class it serves (RG-TW-1, 2026-11-16).

    if (negative) return 'z--1';

    if (value % 10 === 0 && value >= 10 && value <= 90) {
      return `z-${Math.round(value / 10)}`;
    }
  }

  const bgOriginMatch = base.match(/^bg-origin-(border|padding|content)$/);

  if (bgOriginMatch) {
    return `bg-origin-${bgOriginMatch[1]}`;
  }

  const bgClipMatch = base.match(/^bg-clip-(border|padding|content|text)$/);

  if (bgClipMatch) {
    return `bg-clip-${bgClipMatch[1]}`;
  } // RG-TW-4 (C212 (3)): leading-* keeps its target line-* (a dated alias).
  // A relative line has no public twin -- line-N is the fixed line of the
  // text step N -- so converting it to one would change the line; the Loader
  // notes line-* with the name to write.


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
  } // self-auto|start|end|center|stretch and content-start|end|center|between|
  // around|evenly|stretch are the Framework's own both-axes names (utility/
  // place-self, utility/place-content; C212 (2)). Rewriting them as Tailwind's
  // align-self/align-content made the pair's classes unreachable and converted
  // place-self-center twice, to self-cross-center (RG-TW-1, 2026-11-16). Only
  // self-baseline, which the Framework does not name, is Tailwind's.


  if (base === 'self-baseline') {
    return 'self-cross-baseline';
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
  } // mask-* positions convert into utility/mask-position, a sheet retired
  // until 2027-01-01 (C187 (5)); this conversion leaves with that sheet
  // (RG-UT-V MSK-3).


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

  if (positionMatch && POSITION_VALUE.test(positionMatch[2])) {
    const side = positionMatch[1] === 'left' ? 'inline-start' : 'inline-end'; // A negative offset keeps its sign: -left-b2 is the documented
    // left: calc(0rem - var(--sf-b2)), shipped as -inline-start-b2.

    return `${negative}${side}-${positionMatch[2]}`;
  }

  return null;
}
function convertTailwindClassToken(token) {
  if (!token) return token; // Tailwind's print:hidden hides an element on paper: the Framework's
  // print-hidden (utility/display-print; owner decision C187 (7)). Only
  // hidden: print-block and the other display-print classes also hide the
  // element on screen, which Tailwind's print:block does not.

  if (token === 'print:hidden') return 'print-hidden';
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
  if (!mapped) return token; // A negative value with a variant carries its sign before the variant, the
  // way the pair spells it: md:-mt-4 is -md:m-top-4 (RG-TW-2, 2026-11-16);
  // md:-m-top-4 is not a class the pair serves.

  if (variants.length && mapped.startsWith('-')) {
    return `-${variants.join(':')}:${mapped.slice(1)}`;
  }

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

/***/ "443d1792351d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RETIRED_CLASSES: () => (/* binding */ RETIRED_CLASSES),
/* harmony export */   UTILITY_CLASS_ALIASES: () => (/* binding */ UTILITY_CLASS_ALIASES),
/* harmony export */   UTILITY_CLASS_ALIAS_DATES: () => (/* binding */ UTILITY_CLASS_ALIAS_DATES),
/* harmony export */   noteRetiredModifiers: () => (/* binding */ noteRetiredModifiers),
/* harmony export */   noteRetiredUtilitySheets: () => (/* binding */ noteRetiredUtilitySheets),
/* harmony export */   noteUtilityClassAlias: () => (/* binding */ noteUtilityClassAlias),
/* harmony export */   retiredClassName: () => (/* binding */ retiredClassName)
/* harmony export */ });
/* harmony import */ var _retired_classes_table_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cef5a448c23d");
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("06e8cd089f28");
// Retired class names (owner decisions C185 (2), C186 (8) and C187 (1), 2026-11-14;
// C208 (2), (3), 2026-11-15; C212 (6), 2026-11-16; C208 (2),
// (3) and C210 (5), 2026-11-15; C208 (2), 2026-11-16), 2026-11-16; C264,
// C266, C268, C271, C272, C274, 2026-11-17).
// One table, core/js/retired-classes.table.js, lists every class
// the Framework retires: a name, a family (pattern) or a whole utility sheet.
// A retired class keeps drawing what it drew until remove_after, and the
// Loader notes each one once in SF.deprecations the first time a page uses it
// (a console line under data-sf-deprecations="warn", and after the date
// whatever the page opted into). Journals: class-table-sm-to-density,
// class-text-flow-utility-aliases,
// class-c187-retired-utilities, class-c187-retired-parts, class-c96-tabs-looks,
// utility-c208-scrollbar-retired-sheets, class-c187-doc-to-docara,
// class-editor-utility-retired, class-c212-hide-print,
// class-ut1-layout-col-auto, class-ut1-grid-row, class-ut1-negative-auto,
// class-ut1-bg-position, class-ut1-blur, class-ut1-radius-square,
// class-ut1-tracking, utility-c210-scrollbar-retired-sheets,
// class-c210-scrollbar-class, class-avatar-offline-point-retired,
// class-c238-menu-default-navigation, class-steps-1-2-stages-retired,
// class-c264-aspect-list, class-c266-scroll-side-names,
// class-c268-pointer-events, class-c271-scale-percent,
// utility-c272-skew-retired, class-c274-text-role-short-names.


const VARIANT = /^((?:[a-z-]+:)*)(.*)$/;

function entry(record, from, value) {
  const to = value && typeof value === 'object' ? value.to : value;
  const component = value && typeof value === 'object' && value.component || record.component || 'utility';
  return {
    component,
    from,
    to: to ?? null,
    since: record.since,
    remove_after: record.remove_after
  };
}

const NAMES = new Map();
const PATTERNS = [];
const SHEETS = new Map();
const MODIFIERS = [];

for (const record of _retired_classes_table_js__WEBPACK_IMPORTED_MODULE_0__["default"].records) {
  for (const [from, value] of Object.entries(record.names || {})) NAMES.set(from, entry(record, from, value));

  for (const item of record.patterns || []) PATTERNS.push({ ...entry(record, item.from, item.to),
    re: new RegExp(item.pattern),
    values: item.values,
    except: item.variants_except ? new RegExp(item.variants_except, 'u') : null
  });

  for (const [sheet, to] of Object.entries(record.sheets || {})) SHEETS.set(sheet, entry(record, sheet, to));

  for (const [name, item] of Object.entries(record.modifiers || {})) MODIFIERS.push({ ...entry(record, name, item.to),
    name,
    re: new RegExp(item.with)
  });
}

const TEXT_FLOW = _retired_classes_table_js__WEBPACK_IMPORTED_MODULE_0__["default"].records.find(record => record.journal === 'class-text-flow-utility-aliases'); // The C186 (8) text-flow names and their dates, as C186 published them.

const UTILITY_CLASS_ALIASES = Object.freeze({ ...TEXT_FLOW.names
});
const UTILITY_CLASS_ALIAS_DATES = Object.freeze({
  since: TEXT_FLOW.since,
  remove_after: TEXT_FLOW.remove_after
});
const RETIRED_CLASSES = _retired_classes_table_js__WEBPACK_IMPORTED_MODULE_0__["default"];

const expiredAt = (date, now) => now > Date.parse(`${date}T23:59:59.999Z`);

function note(found, from, to, now) {
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_1__.noteDeprecated)({
    component: found.component,
    kind: 'class',
    from,
    to,
    since: found.since,
    remove_after: found.remove_after,
    ...(expiredAt(found.remove_after, now) ? {
      expired: true
    } : {})
  });
}
/**
 * The retired name or family `token` belongs to, as {from, to} with the
 * variant prefix kept on both sides, or null. `to` is '' when the job leaves
 * the utilities.
 */


function retiredClassName(token) {
  if (typeof token !== 'string' || !token) return null;
  const [, variants, base] = token.match(VARIANT);
  let found = NAMES.get(base);
  let to = found?.to;

  if (!found) {
    for (const item of PATTERNS) {
      // variants_except names the prefixes under which the family keeps its
      // name (C212 (4): cq-md:col-gap-2 stays, query-layout has no gap-x-*).
      if (item.except?.test(variants)) continue;
      const match = base.match(item.re);
      if (!match) continue;
      found = item; // values maps a group to the name it stands for in `to` (C212 (4): the
      // rung m-b6 is written m-1, its nearest space step; journal
      // class-c212-length-nearest).

      to = item.to === null ? null : base.replace(item.re, item.values ? (...groups) => item.to.replace(/\$(\d)/gu, (ref, n) => item.values[n]?.[groups[n]] ?? groups[n]) : item.to);
      break;
    }
  }

  if (!found) return null; // A name may retire into two classes (C212 (2), journal class-c212-alignment:
  // md:center-center -> md:content-main-center md:items-cross-center); the
  // variant prefix goes on each of them.

  if (to === null) return {
    found,
    from: token,
    to: ''
  };
  return {
    found,
    from: token,
    to: to.split(' ').map(name => `${variants}${name}`).join(' ')
  };
}
/**
 * Notes `token` when it is a retired class name or belongs to a retired
 * family; returns the name to write instead ('' when there is none) or null.
 * The Loader calls it once per distinct class token of the page.
 */

function noteUtilityClassAlias(token, now = Date.now()) {
  const retired = retiredClassName(token);
  if (!retired) return null;
  note(retired.found, retired.from, retired.to || null, now);
  return retired.to;
}
/**
 * Notes `token` when every utility sheet it loads (`keys`, the Loader's rule
 * keys such as margin-ext/md) is a retired sheet; returns true when noted.
 */

function noteRetiredUtilitySheets(token, keys, now = Date.now()) {
  if (!keys || !keys.length) return false;
  let found = null;

  for (const key of keys) {
    const sheet = SHEETS.get(String(key).split('/')[0]);
    if (!sheet) return false;
    found = sheet;
  }

  const [, variants] = token.match(VARIANT);
  note(found, token, found.to ? `${variants}${found.to}` : null, now);
  return true;
}
/**
 * Notes a retired modifier class (C212 (3): heading beside text-N, which is
 * title-N) when `classList` holds it next to the class it modifies; returns
 * the class to write instead, or null. A modifier alone is an author's own
 * class (a site's .heading), not the Framework's, and is not noted.
 * Journals class-c212-text and class-c212-text-nearest (C212 (3)).
 */

function noteRetiredModifiers(classList, now = Date.now()) {
  if (!classList || !MODIFIERS.length) return null;

  for (const item of MODIFIERS) {
    if (!classList.contains(item.name)) continue;

    for (const token of classList) {
      const match = token.match(item.re);
      if (!match) continue;
      const to = item.to === null ? null : token.replace(item.re, item.to);
      note(item, `${token} ${item.name}`, to, now);
      return to;
    }
  }

  return null;
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

module.exports = /*#__PURE__*/JSON.parse('{"version":1,"$comment":"Former Smart bundle names the Loader still answers to. A forward is not a rule in the distribution (a rule of type smart is a Smart component to the registry, and a forward has no element); the Loader installs it at start as a rule with no tags, no assets and one relation, the new name, unless a rule of that name is already defined, and a relation that names a forward is taken as its target, so the element waits for the bundle itself. Each forward is dated and has a change journal record; remove it on remove_after. A forward may lead to a component package\'s rule (cl-table -> cl-view-table, package pro, rename plan R2): the Loader follows it once the package\'s rules are registered, and a package that still registers the former name itself (one built before the rename) keeps its own rule, which the forward then leaves alone.","forwards":{"cl-inputs":{"to":"cl-input","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-inputs-to-input"},"cl-buttons":{"to":"cl-button","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-buttons-to-button"},"cl-icon-buttons":{"to":"cl-button-icon","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-icon-buttons-to-icon-button"},"cl-icons":{"to":"cl-icon","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-icons-to-icon"},"cl-badges":{"to":"cl-badge","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-badges-to-badge"},"cl-tags":{"to":"cl-tag","since":"2026-10-27","remove_after":"2026-12-01","journal":"path-smart-tags-to-tag"},"cl-close":{"to":"cl-button-close","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-close-to-button-close"},"cl-avatars":{"to":"cl-avatar-group","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-avatars-to-avatar-group"},"cl-page-header":{"to":"cl-header-page","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-page-header-to-header-page"},"cl-site-header":{"to":"cl-header-site","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-site-header-to-header-site"},"cl-inline-editor":{"to":"cl-editor-inline","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-inline-editor-to-editor-inline"},"cl-copy-button":{"to":"cl-button-copy","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-copy-button-to-button-copy"},"cl-lookup":{"to":"cl-input-lookup","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-lookup-to-input-lookup"},"cl-code-input":{"to":"cl-input-code","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-code-input-to-input-code"},"cl-download-file":{"to":"cl-file-download","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-download-file-to-file-download"},"cl-image-field":{"to":"cl-input-image","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-image-field-to-input-image"},"cl-composition-overlay":{"to":"cl-editor-overlay","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-composition-overlay-to-editor-overlay"},"cl-rich-text":{"to":"cl-input-rich","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-rich-text-to-input-rich"},"cl-range-slider":{"to":"cl-slider-range","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-range-slider-to-slider-range"},"cl-datepicker":{"to":"cl-input-date","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-datepicker-to-input-date"},"cl-color":{"to":"cl-input-color","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-color-to-input-color"},"cl-country-code":{"to":"cl-input-country","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-country-code-to-input-country"},"cl-quantity":{"to":"cl-input-quantity","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-quantity-to-input-quantity"},"cl-textarea":{"to":"cl-input-textarea","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-textarea-to-input-textarea"},"cl-context-menu":{"to":"cl-menu-context","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-context-menu-to-menu-context"},"cl-icon-button":{"to":"cl-button-icon","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-icon-button-to-button-icon"},"cl-data-view":{"to":"cl-view","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-data-view-to-view"},"cl-table":{"to":"cl-view-table","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-table-to-view-table"},"cl-property-view":{"to":"cl-view-properties","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-property-view-to-view-properties"},"cl-content-editor":{"to":"cl-editor-content","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-content-editor-to-editor-content"},"cl-thread-list":{"to":"cl-chat-threads","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-thread-list-to-chat-threads"},"cl-change-confirm":{"to":"cl-confirm-change","since":"2026-11-03","remove_after":"2027-01-01","journal":"path-smart-change-confirm-to-confirm-change"},"cl-button-group":{"to":"cl-segmented","since":"2026-11-08","remove_after":"2027-01-01","journal":"path-smart-button-group-to-segmented"}}}');

/***/ },

/***/ "b3ed17287563"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"version":1,"aliases":{"column-gap/default":"gap/default","column-gap/sm":"gap/sm","column-gap/md":"gap/md","column-gap/lg":"gap/lg","column-gap/xl":"gap/xl","column-gap/xxl":"gap/xxl"}}');

/***/ },

/***/ "e7acc025fab1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"cl-accordion":["display/default","flex-direction/default","gap/default","position/default"],"cl-alert":["align-items/default","display/default","flex-direction/default","flex-wrap/default","flex/default","place-items/default"],"cl-alert-bar":["sr-only/default"],"cl-avatar":["align-items/default","display/default","element-position/default","flex-direction/default","flex/default","height/default","justify-content/default","overflow/default","place-items/default","position/default","text-overflow/default","transition-property/default","white-space/default","width/default"],"cl-avatar-group":["align-items/default","display/default","flex-direction/default"],"cl-badge":["display/default","flex-direction/default","flex-wrap/default","justify-content/default","place-items/default","sr-only/default"],"cl-breadcrumbs":["display/default"],"cl-bulk-actions":["display/default","sr-only/default","text-max-width/default","user-select/default","visibility/default"],"cl-button":["align-items/default","display/default","flex/default","pointer-events/default","sr-only/default","text-overflow/default"],"cl-button-close":["align-items/default","display/default","justify-content/default","place-items/default","pointer-events/default"],"cl-button-copy":["display/default"],"cl-button-icon":["align-items/default","display/default","pointer-events/default","sr-only/default"],"cl-change":["display/default","sr-only/default"],"cl-checkbox":["cursor/default","display/default"],"cl-confirm":["display/default"],"cl-confirm-change":["display/default"],"cl-contents":["display/default","position/default","width/default"],"cl-display-settings":["font-family/default","text-decoration/default"],"cl-drawer":["display/default","margin/default","position/default","resize/default","text-max-width/default","visibility/default"],"cl-dropdown":["align-items/default","background-color/default","cursor/default","display/default","flex-direction/default","flex-wrap/default","flex/default","place-items/default","position/default","transition-property/default"],"cl-empty-state":["display/default"],"cl-file-download":["cursor/default","display/default","transition-property/default"],"cl-file-preview":["display/default"],"cl-file-upload":["align-items/default","cursor/default","display/default","flex-direction/default","gap/default","grid-template-columns/default","width/default"],"cl-form":["display/default","position/default","visibility/default"],"cl-gallery":["display/default"],"cl-header-page":["align-items/default","display/default","flex-direction/default","flex-wrap/default","margin/default","min-width/default","position/default","text-overflow/default"],"cl-header-site":["container/default","margin/default","position/default","width/default"],"cl-help-mark":["display/default"],"cl-icon":["font-weight/default"],"cl-input":["align-items/default","display/default","flex-direction/default","transition-property/default"],"cl-input-choice":["align-items/default","cursor/default","display/default","flex-direction/default","justify-content/default","transition-property/default"],"cl-input-code":["sr-only/default"],"cl-input-color":["display/default","position/default"],"cl-input-country":["display/default","flex-direction/default","place-items/default","transition-property/default"],"cl-input-date":["display/default","position/default","sr-only/default"],"cl-input-image":["display/default"],"cl-input-lookup":["align-items/default","display/default","flex-direction/default","flex-wrap/default","flex/default","overflow/default"],"cl-input-quantity":["display/default","filter-blur/default","flex-direction/default","flex-wrap/default","justify-content/default","place-items/default","sr-only/default"],"cl-input-rich":["align-items/default","container/default","display/default","flex-direction/default","flex-wrap/default","font-style/default","font-weight/default"],"cl-input-textarea":["display/default","flex-direction/default","resize/default","transition-property/default"],"cl-language":["display/default"],"cl-list":["align-items/default","display/default","flex/default","justify-content/default","position/default","sr-only/default"],"cl-list-attention":["sr-only/default"],"cl-list-description":["display/default","font-family/default","sr-only/default","text-overflow/default"],"cl-list-feed":["display/default","sr-only/default"],"cl-list-item":["align-items/default","background-color/default","cursor/default","display/default","flex-direction/default","flex-wrap/default","flex/default","justify-content/default","place-items/default"],"cl-list-timeline":["display/default","position/default","sr-only/default"],"cl-menu":["display/default","position/default","visibility/default"],"cl-menu-context":["display/default","text-decoration/default"],"cl-modal":["align-items/default","backdrop-filter-blur/default","border-radius/default","border-width/default","display/default","element-position/default","filter-blur/default","flex-direction/default","flex-wrap/default","font-size/default","gap/default","height/default","justify-content/default","margin/default","min-width/default","overflow/default","padding/default","place-items/default","position/default","text-color/default","width/default","z-index/default"],"cl-pager":["align-items/default","display/default","sr-only/default"],"cl-pagination":["align-items/default","display/default","flex-direction/default","flex/default","justify-content/default","pointer-events/default","text-align/default"],"cl-popover":["display/default","position/default"],"cl-progress-bar":["align-items/default","display/default","flex-direction/default","transition-property/default"],"cl-progress-ring":["display/default"],"cl-progress-run":["sr-only/default","white-space/default"],"cl-progress-scale":["align-items/default","display/default","flex-direction/default","grid-template-columns/default","overflow/default"],"cl-radio":["align-items/default","display/default","justify-content/default"],"cl-reference-link":["align-items/default","display/default","flex-direction/default","justify-content/default","place-items/default"],"cl-resizer":["display/default","position/default","resize/default","text-max-width/default"],"cl-search":["display/default","sr-only/default"],"cl-segmented":["align-items/default","display/default","pointer-events/default","text-align/default"],"cl-settings":["display/default","position/default","text-decoration/default"],"cl-skeleton":["animation/default","display/default","flex/default"],"cl-slider":["background-color/default","border-radius/default","display/default","padding/default","text-color/default"],"cl-slider-range":["flex/default"],"cl-steps":["sr-only/default"],"cl-switch":["align-items/default","display/default","justify-content/default","transition-property/default"],"cl-tabs":["align-items/default","container/default","display/default","flex-direction/default","flex-wrap/default","justify-content/default","place-items/default","pointer-events/default","position/default","text-decoration/default","visibility/default"],"cl-tag":["display/default","flex-direction/default","flex-wrap/default","justify-content/default","min-width/default","place-items/default","pointer-events/default"],"cl-tag-group":["display/default"],"cl-tile-metric":["position/default","sr-only/default"],"cl-time":["display/default","position/default","sr-only/default"],"cl-toast":["align-items/default","display/default","flex-direction/default","flex/default","justify-content/default","place-items/default"],"cl-tooltip":["display/default","flex-direction/default","position/default"],"cl-tree":["display/default","flex-direction/default"],"cl-tree-item":["align-items/default","display/default","flex-direction/default","position/default"],"cl-wizard":["display/default","sr-only/default"]}');

/***/ }

}]);