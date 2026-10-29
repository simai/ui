/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3dd6551de8f2"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfColor: () => (/* binding */ SfColor)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b16e9ecc75e4");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("9a1741f2071b");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("91a7989d7c1c");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("5e8168ed58c0");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("5145baaa7717");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);








 // A colour, for anywhere a colour is set: a theme, a site's own look, a label, a
// chart series. It was built because the property set had no colour at all while a
// running Larena site declares fourteen of them, but nothing here is about a
// property view -- it is a control like a switch or a date.
//
// Two things it does that a bare `<input type="color">` does not. It can be
// **unset**, which is the state the site actually uses: a colour inherited from the
// theme until somebody chooses one, and returnable to that. And it offers the
// colours a product already has, as swatches, so a person picks «the brand colour»
// rather than matching a hex by eye.
//
// Built from its component.json (standard simai.smart-component 1.3.8 §3, §4,
// §11, §16.20, §17.1): the settings are attributes and properties made by
// core/js/element-manifest.js, the words are lang/<locale>.json (the trait's
// words with them), and the host is the form control through ElementInternals.

const ColorElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default())),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__,
  actions: {
    // §4.4: an outcome. Nothing to clear is refused, not an error.
    clear() {
      return this.setValue("") ? "applied" : "unchanged";
    }

  }
}); // #abc, #aabbcc and #aabbccdd, which is what a person pastes and what a store
// keeps. Anything else is not a colour this control will claim to hold.

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/iu; // How long a moving colour rests before the page theme follows it.

const THEME_DEBOUNCE = 120;

const normalise = value => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const hash = text.startsWith("#") ? text : `#${text}`;
  return HEX.test(hash) ? hash.toLowerCase() : "";
};

class SfColor extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_3__.FormField)(ColorElement) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      },
      // The trait field-inherit@1 (§20.2): its settings until the build
      // merges a trait's interface.
      inheritedValue: {
        attribute: "inherited-value",
        default: ""
      },
      inheritedText: {
        attribute: "inherited-text",
        default: ""
      },
      resetLabel: {
        attribute: "reset-label",
        default: ""
      }
    };
  }

  static get observedAttributes() {
    return [...(super.observedAttributes ?? []), "value", "inherited-value", "swatches", "disabled"];
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous !== next && this.isConnected) this.requestComponentUpdate("attribute");
  }

  get value() {
    return normalise(this.getAttribute("value"));
  } // Written from code, the value is not a change: no event, as for a native
  // field (§8).


  set value(next) {
    const value = normalise(next);
    if (value) this.setAttribute("value", value);else this.removeAttribute("value");
    this._committed = value;
    this.requestComponentUpdate("value");
    this.sfSyncFormState();
  } // What the colour falls back to while nothing is chosen. Shown rather than
  // guessed: a control that drew the inherited colour as if it were the value
  // would make «not set» and «set to the same colour» look identical, and only
  // one of them follows the theme when the theme changes.


  get inheritedValue() {
    return normalise(this.getAttribute("inherited-value"));
  }

  get inheritedText() {
    return this.getAttribute("inherited-text") || this.sfWord("inherited");
  } // The reset back to the inherited colour is the shared one (simai/ui-source#28):
  // `reset-label` names it, and `clear-label`, its first name, still does.


  get resetLabel() {
    return this.getAttribute("reset-label") || this.getAttribute("clear-label") || this.sfWord("reset");
  } // What a screen reader hears beside the name while the value is inherited,
  // in the element's language (§11.1).


  inheritedDescription() {
    return this.sfWord("described", {
      vars: {
        value: this.inheritedDisplayValue()
      }
    });
  } // The inherited-value seam: the colour is the value, the platform picker's
  // input takes focus and carries the description.


  inheritedOwnValue() {
    return this.value;
  }

  inheritedFocusTarget() {
    return this.querySelector(".sf-color-input");
  } // clear() says it as input and change, the way a swatch does.


  clearOwnValue() {
    this.clear();
  }

  afterRender() {
    this.syncInheritedState();
    this.sfSyncFormState(); // A value written from code (a page restoring the colour it kept) takes
    // the theme silently; a drag waits for its debounce.

    if (this.isTheme && this._themeTimer == null) this._applyTheme();
  } // ---------------------------------------------------------- variant theme
  //
  // One icon button that opens the platform picker and rebuilds the page
  // theme from the colour while it moves (owner decision by delegation,
  // 2026-10-28: a variant of sf-color, not a separate component). The theme
  // is SF.ThemePalette, fetched through the Loader the first time a theme
  // control draws: it is larger than this control and a field-variant colour
  // has no use for it.


  get isTheme() {
    return this.variant === "theme";
  }

  get themeLabel() {
    return this.label || this.sfWord("theme");
  }

  get themeResetLabel() {
    return this.getAttribute("clear-label") || this.sfWord("theme-reset");
  }

  _palette() {
    const palette = globalThis.SF?.ThemePalette;
    if (palette?.applyTheme) return palette;

    if (!this._paletteAsked) {
      this._paletteAsked = true;

      const ready = () => {
        this._applyTheme();

        this.requestComponentUpdate("palette");
      };

      globalThis.addEventListener?.("theme-palette:ready", ready, {
        once: true
      });
      globalThis.SF?.Loader?.ensurePlugin?.("theme-palette");
    }

    return null;
  } // The colour on <html>: the previous application is taken off first, so the
  // restore that is kept always returns the page to what it had before this
  // control touched it. An empty value is that restore.


  _applyTheme() {
    const palette = this._palette();

    if (!palette) return;
    const color = this.value;
    if (color === this._appliedColor) return;
    this._restoreTheme?.();
    this._restoreTheme = null;

    if (color && palette.isThemeColor(color)) {
      this._restoreTheme = palette.applyTheme(palette.themeFromColor(color));
    }

    this._appliedColor = color;
  }

  _scheduleTheme(delay) {
    clearTimeout(this._themeTimer);
    this._themeTimer = null;

    if (!delay) {
      this._applyTheme();

      return;
    }

    this._themeTimer = setTimeout(() => {
      this._themeTimer = null;

      this._applyTheme();
    }, delay);
  } // The icon button opens the native input's picker. showPicker needs the
  // press's activation, which the click carries; without it, a click on the
  // input does the same.


  _openPicker() {
    const input = this.querySelector(".sf-color-input");
    if (!input || this.disabled) return;

    this._watchUncommitted();

    try {
      input.showPicker();
    } catch {
      input.click();
    }
  } // A colour that moved but was never committed (Escape, the picker's cancel)
  // goes back to the committed one: the browser usually puts the old value
  // back with an input of its own; if it does not, the next press or key on
  // the page -- the picker is closed by then -- reverts it. A change that
  // closes the picker on that same press wins: the check waits a moment.


  _watchUncommitted() {
    if (this._uncommittedWatch) return;
    const document = this.ownerDocument;

    const check = () => {
      document.removeEventListener("pointerdown", check, true);
      document.removeEventListener("keydown", check, true);
      this._uncommittedWatch = null;
      setTimeout(() => this._revertUncommitted(), 60);
    };

    this._uncommittedWatch = check;
    document.addEventListener("pointerdown", check, true);
    document.addEventListener("keydown", check, true);
  }

  _revertUncommitted() {
    const committed = this._committed ?? normalise(this._initialValue);
    if (this.value === committed) return;
    if (committed) this.setAttribute("value", committed);else this.removeAttribute("value");
    this.requestComponentUpdate("value");
    this.sfSyncFormState();

    this._emit("input");

    this._scheduleTheme(0);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.(); // The theme stays: the page chose it. Only the pending work goes.

    clearTimeout(this._themeTimer);
    this._themeTimer = null;

    if (this._uncommittedWatch) {
      this.ownerDocument.removeEventListener("pointerdown", this._uncommittedWatch, true);
      this.ownerDocument.removeEventListener("keydown", this._uncommittedWatch, true);
      this._uncommittedWatch = null;
    }
  }

  get customText() {
    return this.sfWord("custom");
  } // The colours a product already has. A comma separated list, each one a hex,
  // optionally `#hex|Name` so a swatch can say what it is. A name may hold
  // spaces («#1f6feb|Brand blue»): splitting on spaces too cut it into a swatch
  // named «Brand» and a word that is not a colour. A piece without a name may
  // still list several colours by spaces, as the first lists did.


  get swatchList() {
    return String(this.getAttribute("swatches") || "").split(",").flatMap(piece => piece.includes("|") ? [piece.trim()] : piece.trim().split(/\s+/u)).filter(Boolean).map(entry => {
      const [color, ...rest] = entry.split("|");
      const hex = normalise(color);
      const name = rest.join("|").trim();
      return hex ? {
        value: hex,
        name: name || hex
      } : null;
    }).filter(Boolean);
  } // What is painted now: the value when there is one, the inherited colour when
  // there is not (§4.3). It was `shown`, which is the base value of every
  // element now (§4.1): whether it has a box in an opened container.


  get effectiveValue() {
    return this.value || this.inheritedValue || "";
  } // What the form gets (§17.1): the hex, empty while the inherited colour
  // applies (§20.2), nothing while disabled.


  sfFormValue() {
    if (this.disabled) return null;
    return this.value;
  } // form.reset(): back to the colour the element was written with, without
  // events (§17.1 item 4).


  fieldReset() {
    const initial = normalise(this._initialValue);
    if (initial) this.setAttribute("value", initial);else this.removeAttribute("value");
    this._committed = initial;
    this.requestComponentUpdate("value");
    this.syncInheritedState();
  }

  get isSet() {
    return Boolean(this.value);
  }

  setValue(next) {
    const changed = this._write(next);

    this._commit();

    return changed;
  } // `input` while the value moves (a drag across the platform picker), `change`
  // once when it is committed. The picker fires its own input on every step of a
  // drag, so a change per input was a change per pixel.


  _write(next) {
    const value = normalise(next);
    if (value === this.value) return false;
    if (value) this.setAttribute("value", value);else this.removeAttribute("value");
    this.requestComponentUpdate("value");
    this.sfSyncFormState();

    this._emit("input");

    return true;
  }

  _commit() {
    const value = this.value;
    if (value === (this._committed ?? normalise(this._initialValue))) return;
    this._committed = value;

    this._emit("change");
  }

  _emit(type) {
    this.sfEmit(type, {
      value: this.value,
      name: this.name
    });
  }

  connectedCallback() {
    if (this._initialValue === undefined) this._initialValue = this.getAttribute("value") ?? "";
    super.connectedCallback?.();
  } // The platform picker's own events. Its input moves the value; its change
  // commits it. Its change also bubbles out of the host as a plain Event with no
  // detail, a second change for every one this dispatches, so it stops here.


  _pickerInput(event) {
    event.stopPropagation();

    this._write(event.target.value); // A drag across the picker sends an input per step; the theme is a
    // whole page of variables, rebuilt once the colour rests for 120 ms.


    if (this.isTheme) this._scheduleTheme(THEME_DEBOUNCE);
  }

  _pickerChange(event) {
    event.stopPropagation();

    this._write(event.target.value);

    if (this.isTheme) this._scheduleTheme(0);

    this._commit();
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      value: this.value,
      painted: this.effectiveValue,
      isSet: this.isSet,
      inheritedValue: this.inheritedValue,
      inheritedText: this.inheritedText,
      hasInheritedValue: this.hasInheritedValue,
      chooseLabel: this.chooseLabel,
      clearLabel: this.clearLabel,
      customText: this.customText,
      swatchList: this.swatchList,
      clearable: this.clearable,
      disabled: this.disabled,
      size: this.size,
      appearance: this.appearance,
      name: this.name,
      // The host is the form control where the browser has
      // ElementInternals; the hidden input is drawn only without them.
      hiddenName: this.sfInternals ? "" : this.name,
      label: this.label,
      variant: this.variant,
      themeLabel: this.themeLabel,
      themeResetLabel: this.themeResetLabel,
      // The picker opens on the theme's colour: the chosen one, else the
      // Framework's once the palette is here.
      pickerValue: this.value || this.inheritedValue || (this.isTheme ? globalThis.SF?.ThemePalette?.DEFAULT_THEME_COLOR : "") || ""
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderColorTemplate)(this.templateContext());
  }

}

SfColor.define("sf-color");

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b16e9ecc75e4"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderColorTemplate: () => (/* binding */ renderColorTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("53bac87b41ad");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // The control is a swatch that opens the browser's own colour picker, with the
// product's own colours beside it and a way back to the inherited one. The native
// input is what opens the picker: every platform has one, it is reachable from the
// keyboard, and reimplementing a colour wheel would be a worse version of a thing
// the system already does well.

function renderColorTemplate(context) {
  if (context.variant === 'theme') return renderThemeTemplate(context);
  const {
    painted,
    isSet,
    disabled,
    size,
    appearance
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color sf-color--${appearance} sf-color--size-${size}"
             data-set=${isSet ? 'true' : 'false'}>
            <label class="sf-color-swatch" title=${context.chooseLabel}>
                <span class="sf-color-chip"
                      style=${painted ? `--sf-color-chip: ${painted}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                      data-empty=${painted ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'true'}
                      aria-hidden="true"></span>
                <input
                        type="color"
                        class="sf-color-input"
                        .value=${painted || '#000000'}
                        ?disabled=${disabled}
                        aria-label=${context.label || context.chooseLabel}
                        @input=${event => context.component._pickerInput(event)}
                        @change=${event => context.component._pickerChange(event)}
                >
            </label>
            ${context.hiddenName // Without ElementInternals the form gets the value from a
  // hidden input, empty while the inherited colour applies. The
  // colour input cannot hold «nothing»: named, it submitted
  // #000000 for every colour nobody had chosen.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input type="hidden" name=${context.hiddenName} .value=${context.value}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

            <span class="sf-color-text">
                ${isSet ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<code>${context.value}</code>` // With an inherited colour the shared slot says «inherited»
  // (simai/ui-source#28); without one the words stay here.
  : context.hasInheritedValue ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-color-inherited">${context.inheritedText}</span>`}
            </span>

            ${context.swatchList.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <span class="sf-color-swatches" role="group" aria-label=${context.chooseLabel}>
                            ${context.swatchList.map(swatch => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <button
                                        type="button"
                                        class="sf-color-preset"
                                        style=${`--sf-color-chip: ${swatch.value}`}
                                        title=${swatch.name}
                                        aria-label=${swatch.name}
                                        aria-pressed=${context.value === swatch.value ? 'true' : 'false'}
                                        ?disabled=${disabled}
                                        @click=${() => context.component.setValue(swatch.value)}
                                ></button>
                            `)}
                        </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

            ${context.hasInheritedValue // The marker while the inherited colour applies, the reset
  // once a colour is chosen: the same slot every field uses.
  ? (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__.renderInheritedSlot)(context.component, {
    size,
    disabled,
    className: 'sf-color-inherited-slot'
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

            ${context.clearable && isSet && !context.hasInheritedValue ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-icon-button
                                appearance="link"
                                size=${size}
                                icon="restart_alt"
                                data-action="clear"
                                aria-label=${context.clearLabel}
                                ?disabled=${disabled}
                                @click=${() => context.component.clear()}
                        ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // variant theme: one icon-only primary button that opens the same native
// picker. The input stays in the tree under the button -- transparent, out of
// the focus order and out of the accessibility tree -- so the picker opens
// where the button is; the button is what a keyboard reaches and what a screen
// reader names («Цвет темы», «Theme colour»).

function renderThemeTemplate(context) {
  const {
    isSet,
    disabled,
    size
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color sf-color--theme sf-color--size-${size}"
             data-set=${isSet ? 'true' : 'false'}>
            <span class="sf-color-theme">
                <input
                        type="color"
                        class="sf-color-input"
                        tabindex="-1"
                        aria-hidden="true"
                        .value=${context.pickerValue || '#000000'}
                        ?disabled=${disabled}
                        @input=${event => context.component._pickerInput(event)}
                        @change=${event => context.component._pickerChange(event)}
                >
                <sf-icon-button
                        size=${size}
                        icon="palette"
                        data-action="theme"
                        aria-label=${context.themeLabel}
                        title=${context.themeLabel}
                        ?disabled=${disabled}
                        @click=${() => context.component._openPicker()}
                ></sf-icon-button>
            </span>
            ${context.hiddenName ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input type="hidden" name=${context.hiddenName} .value=${context.value}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.clearable && isSet ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-icon-button
                                appearance="link"
                                size=${size}
                                icon="restart_alt"
                                data-action="clear"
                                aria-label=${context.themeResetLabel}
                                title=${context.themeResetLabel}
                                ?disabled=${disabled}
                                @click=${() => context.component.clear()}
                        ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity)
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
 * value-missing and the custom error the page set; `anchor`, when it is a part
 * of the host, is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
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

};

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

/***/ "53bac87b41ad"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "c6c9dfe31af4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

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

/***/ "91a7989d7c1c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-color","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-field:reset","to":"sf-field-reset","kind":"event","component":"sf-color","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, §20.2","note":"the event of the trait field-inherit@1, declared in component.json as the shared event field-reset; the field sends sf-field-reset and the shim follows it with this dated name, same detail, one cancel"},{"from":"shown","to":"effective-value","kind":"value","component":"sf-color","since":"2026-10-27","remove_after":"2026-12-01","section":"§4.1, §4.3","note":"the getter shown returned the painted colour; shown is now the base value (a boolean) on every element, so the old meaning cannot be served beside it: read effectiveValue","shim":"none"}]}');

/***/ },

/***/ "9a1741f2071b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.color","tag":"sf-color","version":"1.4.0","kind":"leaf","traits":["field-inherit@1"],"settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"appearance":{"type":"enum","values":["bordered","outlined","plain"],"default":"bordered"},"variant":{"type":"enum","values":["field","theme"],"default":"field"},"swatches":{"type":"string","default":""},"clearable":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"name":{"type":"string","default":""},"label":{"type":"string","default":""},"choose-label":{"type":"string","default-from":"runtime.choose"},"clear-label":{"type":"string","default-from":"runtime.clear"}},"values":{"value":{"type":"string","default":""},"effective-value":{"type":"string"}},"events":{"change":{"carries":{"value":"string","name":"string"}},"input":{"carries":{"value":"string","name":"string"}},"field-reset":{"shared":"field-inherit@1","cancelable":true,"carries":{"tag":{"type":"string"},"value":{"type":"string"},"inherited-value":{"type":"string"},"name":{"type":"string"}}}},"actions":{"clear":{}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","disabled":"disabled","validity":["custom-error"]},"host-states":{"data-inherited":"boolean"},"css-variables":{"--sf-color-gap":{"type":"length"},"--sf-color-chip-radius":{"type":"length"},"--sf-color-chip-border-color":{"type":"color","state":"rest"},"--sf-color-swatches-gap":{"type":"length"},"--sf-color-inherited-color":{"type":"color","state":"inherited"}}}');

/***/ },

/***/ "5e8168ed58c0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Color","runtime":{"choose":"Choose a colour","clear":"Use the inherited colour","custom":"Custom","inherited":"inherited","reset":"Reset to inherited","described":"Inherited: {value}","value-missing":"Choose a colour.","theme":"Theme colour","theme-reset":"Use the original theme colour"}}');

/***/ },

/***/ "5145baaa7717"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Цвет","runtime":{"choose":"Выбрать цвет","clear":"Вернуть унаследованный","custom":"Свой","inherited":"наследуется","reset":"Сбросить к наследуемому","described":"Наследуется: {value}","value-missing":"Выберите цвет.","theme":"Цвет темы","theme-reset":"Вернуть исходный цвет темы"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("3dd6551de8f2");
/******/
/******/ })()
;