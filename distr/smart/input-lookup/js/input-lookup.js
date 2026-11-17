/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e138a730fd7c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFieldContract: () => (/* binding */ createFieldContract),
/* harmony export */   syncFieldContract: () => (/* binding */ syncFieldContract)
/* harmony export */ });
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e92fd2d1a38c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__);
 // A field's ids come from its instance's role path (standard 1.3.8 §7.1.1;
// simai/ui-source#41), never from a counter: core/js/instance-path.js.

const fieldIdentities = new WeakMap();

function nextIdentity(owner, prefix) {
  if (owner && fieldIdentities.has(owner)) return fieldIdentities.get(owner);
  const base = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.instancePath)(owner, {
    kind: prefix
  }));
  const identity = {
    base,
    controlId: `${base}--control`,
    messageId: `${base}--message`
  }; // An instance not yet in the page has no place in it: its path is settled
  // when it is, so it is not kept before.

  if (owner && (typeof owner === 'object' || typeof owner === 'function') && (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner)) {
    fieldIdentities.set(owner, identity);
  }

  return identity;
}

function mergeIdRefs(existing, additions) {
  return [...new Set([...String(existing || '').split(/\s+/).filter(Boolean), ...additions.filter(Boolean)])].join(' ');
}

function createFieldContract(owner, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  hint = '',
  errorMessage = ''
} = {}) {
  const identity = nextIdentity(owner, prefix);
  const normalizedInvalid = Boolean(invalid);
  const message = normalizedInvalid && errorMessage ? errorMessage : hint;
  return { ...identity,
    required: Boolean(required),
    invalid: normalizedInvalid,
    message,
    describedBy: message ? identity.messageId : '',
    errorMessageId: normalizedInvalid && errorMessage ? identity.messageId : ''
  };
}
function syncFieldContract(root, control, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  messageNode = null,
  labelNode = null,
  errorMessage = ''
} = {}) {
  if (!root || !control) return null;
  const hint = messageNode?.textContent?.trim() || '';
  const contract = createFieldContract(root, {
    prefix,
    required,
    invalid,
    hint,
    errorMessage
  });
  if (!control.id) control.id = contract.controlId;

  if (root.tagName === 'LABEL' && !root.hasAttribute('for')) {
    root.setAttribute('for', control.id);
  } // Name the field by its visible label, not every hint or adjacent button.
  // Author-provided accessible names remain authoritative.


  if (labelNode?.textContent?.trim() && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
    if (!labelNode.id) labelNode.id = `${control.id}-label`;
    control.setAttribute('aria-labelledby', labelNode.id);
  }

  control.required = contract.required;
  root.classList.toggle('error', contract.invalid);
  control.classList.toggle('error', contract.invalid);
  if (contract.invalid) control.setAttribute('aria-invalid', 'true');else control.removeAttribute('aria-invalid');

  if (messageNode) {
    if (!messageNode.id) messageNode.id = contract.messageId;
    control.setAttribute('aria-describedby', mergeIdRefs(control.getAttribute('aria-describedby'), [messageNode.id]));
  }

  if (contract.errorMessageId && messageNode) {
    control.setAttribute('aria-errormessage', messageNode.id);
  } else {
    control.removeAttribute('aria-errormessage');
  }

  return contract;
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
// (component/inputs/scss/_field-ladder.scss). The textarea and the rich text
// followed (2026-11-14), then the dropdown, the file upload area and the image
// field (queue #70, 2026-11-16): every field of the family stands on the
// ladder. FIELD_SIZES, fieldSize and retireFieldSizeClass stay for the lines
// of tags, badges and avatars and for a file's row, which keep three sizes.

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

/***/ "1373e294ec38"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   breakpointMedia: () => (/* binding */ breakpointMedia),
/* harmony export */   breakpointQuery: () => (/* binding */ breakpointQuery),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   matchesBreakpoint: () => (/* binding */ matchesBreakpoint)
/* harmony export */ });
// The Framework's breakpoints for scripts (reuse audit 2026-11-02, finding 6).
// The sheets switch at the steps of core/scss/vars/_sf_var__breakpoint.scss;
// a component that also decides in script (sf-contents, sf-site-header,
// sf-search) had copied the steps by hand, word for word, and nine such
// constants (48rem, 60rem, 1023px, 1024) had drifted apart elsewhere, so one
// admin screen switched at two points. The same values here, and
// tests/breakpoint-ladder.contract.test.mjs holds the two files equal.

/** The ladder: each name is the width it starts at, in rem as the sheets write it. */
const BREAKPOINTS = Object.freeze({
  xs: '0rem',
  sm: '32rem',
  // g6, 512px
  md: '44rem',
  // h1, 704px
  lg: '60rem',
  // h5, 960px
  xl: '72rem',
  // h8, 1152px
  xxl: '80rem' // i0, 1280px

}); // The step under a threshold, as the sheets' media-breakpoint-down writes it:
// one pixel less, in rem (_mix__breakpoint.scss breakpoint-max).

const PIXEL_REM = 1 / 16;
/**
 * The media query of a breakpoint: from its width up, or with `below: true`
 * the widths under it -- the two sides the sheets switch on. An unknown name
 * is null, so a typo is not a query that always matches.
 *
 *   breakpointQuery('md')                  (min-width: 44rem)
 *   breakpointQuery('md', {below: true})   (max-width: 43.9375rem)
 */

function breakpointQuery(name, {
  below = false
} = {}) {
  if (!Object.hasOwn(BREAKPOINTS, name)) return null;
  const rem = Number.parseFloat(BREAKPOINTS[name]);
  if (below) return rem > 0 ? `(max-width: ${rem - PIXEL_REM}rem)` : 'not all';
  return `(min-width: ${rem}rem)`;
}
/** The page's MediaQueryList for a breakpoint, to read and to follow; null without matchMedia or for an unknown name. */

function breakpointMedia(name, {
  below = false,
  view = globalThis
} = {}) {
  const query = breakpointQuery(name, {
    below
  });
  return query && typeof view?.matchMedia === 'function' ? view.matchMedia(query) : null;
}
/** Whether the page is at least as wide as the breakpoint now (or under it, with `below`). */

function matchesBreakpoint(name, options = {}) {
  return breakpointMedia(name, options)?.matches === true;
}
const Breakpoints = Object.freeze({
  ladder: BREAKPOINTS,
  query: breakpointQuery,
  media: breakpointMedia,
  matches: matchesBreakpoint
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.breakpoints) globalThis.SF.breakpoints = Breakpoints;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Breakpoints);

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

/***/ "908b7e4ebbac"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SEARCH_LINE_DELAY: () => (/* binding */ SEARCH_LINE_DELAY),
/* harmony export */   SHEET_BELOW: () => (/* binding */ SHEET_BELOW),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("18003344cff0");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_panel_scrollbar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("cb6d39a52a42");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("c4b543e9c79e");
/* harmony import */ var _js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("91c9715ba00a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("8bb18691f333");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("e99a820fffdb");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("d94fcb6a8f59");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("ea441b000040");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("1cabccb560d5");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6__, _component_field_size__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_10__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6__, _component_field_size__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6__);















 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_14__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_15__.runtime
};
 // sf-input-lookup: the people and object picker. A form field whose value is the
// field renderer's lookup value -- {value, label}, or a list of them when
// multiple -- chosen from a search the host answers through `provider`, or
// from a short list given whole (`options`).
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4, §8,
// §17): the settings are made by core/js/element-manifest.js; the field is the
// form control through ElementInternals and sends the values alone. A choice
// and a removed chip say input and change; a value set from code, a form reset
// and a restore say nothing.
//
// The search (js/lookup-model.mjs holds its pure parts): below min-length the
// list shows the hint and nothing is asked; after `debounce` the provider is
// called with {cursor, limit, signal}; a new call aborts the previous one and
// an answer for an older call is dropped; {status: 'unavailable'} is the
// neutral line, an error the line with Retry; nextCursor is Show more.

const LookupElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_12__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en,
    ru
  },
  source: 'en',
  // The old tag's event names (sf-lookup-create) until 2027-01-01.
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_13__
}); // Core publishes the helper; a bundle loaded without core.js positions with
// its own copy (as sf-dropdown's portal does).

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default()); // How long a search runs before the field says so (owner decision C130 (8):
// a spinner after 1 s, sf-spinner's own delay, C138). A faster answer replaces
// the rows without a flash; meanwhile the rows of the last answer stay (LS-5).
// It was the debounce alone: «Поиск…» 130-150 ms after a key, whatever the server.


const SEARCH_LINE_DELAY = 1000; // Under lg the list is a sheet over the page with the search on top, as
// sf-search's on a phone (owner decision C139 (7)): the step the sheets and
// core/js/breakpoints.js name.

const SHEET_BELOW = 'lg';

class SfLookup extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_9__.ShownRequired)((0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_9__.FormField)(LookupElement)) {
  static get props() {
    return { ...super.props,
      rootClass: {
        attribute: 'root-class',
        default: ''
      }
    };
  } // value is a property (an object or a list), but a page prints it as an
  // attribute too (JSON, or a bare value read against the options).


  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'value'])];
  }

  constructor() {
    super();
    this._value = undefined;
    this._query = '';
    this._dirty = false;
    this._open = false;
    this._state = 'closed';
    this._items = [];
    this._nextCursor = null;
    this._notice = '';
    this._active = -1;
    this._refusal = '';
    this._loadingMore = false;
    this._seq = 0;
    this._controller = null;
    this._timer = 0;
    this._last = null;
    this._anchor = null;
    this._anchorPanel = null;
    this._searching = false;
    this._waitShown = false;
    this._waitTimer = 0;
    this._chipsOpen = false;
    this._chipsShown = null;
    this._fitPasses = 0;
    this._fitObserver = null; // C139: the chip the arrows stand on (-1: the search box), the line a
    // screen reader is told, a create the host is answering, the sheet.

    this._chipActive = -1;
    this._announce = '';
    this._creating = false;
    this._sheet = false;
    this._sheetFocus = false;
    this._quietFocus = false;
    this._untabObserver = null;
    this._sheetMedia = null;

    this._onSheetMedia = () => {
      if (this._sheet && !this._sheetWanted()) this._close();
    };
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // The value attribute is the default a form reset returns to; written
    // again, it is the value again.
    if (name === 'value' && oldValue !== newValue) {
      this._value = undefined;
      this._dirty = false;
      this._query = '';
      this.sfSyncFormState?.();
    }

    if (name === 'disabled' || name === 'readonly') this._close();
    super.attributeChangedCallback(name, oldValue, newValue);
  } // ---------------------------------------------------------- settings


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_7__.ladderSize)(this.getAttribute('size'));
  }

  get effectiveDisabled() {
    return Boolean(this.disabled || this.sfFormDisabled);
  }

  get editable() {
    return !this.effectiveDisabled && !this.readonly;
  } // The search box the person types in: the sheet's while it is open, else
  // the field's own.


  get input() {
    return this._sheet && this.querySelector('.sf-lookup-sheet-input') || this.fieldInput;
  }

  get fieldInput() {
    return this.querySelector('.sf-lookup-input:not(.sf-lookup-sheet-input)');
  }

  _createKind() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.createKind)(this.getAttribute('create') ?? (this.create === true ? '' : this.create));
  } // The host answers an empty query (C139 (3)): suggest, or min-length 0.


  _suggests() {
    return Boolean(this.suggest) || this._minLength() === 0;
  } // The «Создать «…»» row (C139 (2)): last, with the host's `create`, while
  // the rows hold no exact match; not before a first answer came.


  _offer(chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value)) {
    const kind = this._createKind();

    if (!kind || !this.editable || !this._open) return null;
    if (!['results', 'empty'].includes(this._state)) return null;
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.createOffer)(this._query, {
      kind,
      items: this._items,
      chosen,
      locale: (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__.pageLocale)(this)
    });
  } // The rows the arrows walk: the items, then the create row.


  _rowCount() {
    return this._items.length + (this._offer() ? 1 : 0);
  }

  _sheetWanted() {
    this._sheetMedia ??= (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_5__.breakpointMedia)(SHEET_BELOW, {
      below: true
    });
    return this._sheetMedia?.matches === true;
  }

  _minLength() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.wholeNumber)(this.minLength, _js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.DEFAULTS.minLength);
  }

  _maxResults() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.wholeNumber)(this.maxResults, _js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.DEFAULTS.maxResults, {
      min: 1
    });
  }

  _debounce() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.wholeNumber)(this.debounce, _js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.DEFAULTS.debounce);
  }

  _maxItems() {
    return this.multiple ? (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.wholeNumber)(this.maxItems, 0) : 0;
  }

  _options() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.normaliseItems)(this.options);
  }

  _exclude() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.excludedKeys)(this.exclude);
  }

  _provider() {
    return typeof this.provider === 'function' ? this.provider : null;
  }
  /**
   * The value: single {value, label, caption?, avatar?} or null; multiple a
   * list in the order chosen ([] when nothing is).
   */


  get value() {
    const options = this.options;
    if (this._value !== undefined) return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.normaliseValue)(this._value, {
      multiple: Boolean(this.multiple),
      options
    });
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.normaliseValue)(this.getAttribute('value'), {
      multiple: Boolean(this.multiple),
      options
    });
  } // Set from code it is not a change: no event, as for a native field.
  // Kept as given and read against the options by the getter, so a bare value
  // set before the options arrive takes its option's label once they do (it
  // was resolved here, once, and kept the value as its label: «u1»).
  // The same value set again (a host that draws the field anew after every
  // change, as the field renderers' hosts do) keeps what is typed.


  set value(next) {
    const same = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.sameValue)((0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.normaliseValue)(next, {
      multiple: Boolean(this.multiple),
      options: this.options
    }), this.value);
    this._value = next;

    if (!same) {
      this._dirty = false;
      this._query = '';
    }

    this.requestComponentUpdate('value');
    this.sfSyncFormState();
  }

  isItemChosen(item) {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.isChosen)(this.value, item);
  }

  focusDelegate() {
    return this.fieldInput;
  } // ---------------------------------------------------------- form
  // The values alone: one entry, or one entry per chosen value under the
  // name (§17.1); nothing while disabled or empty.


  sfFormValue() {
    if (this.effectiveDisabled) return null;
    const entries = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.formEntries)(this.value);
    if (!entries.length) return null;
    if (!this.multiple) return entries[0];
    const name = this.name || '';
    if (!name || typeof FormData !== 'function') return entries.join(',');
    const data = new FormData();

    for (const entry of entries) data.append(name, entry);

    return data;
  }

  fieldValidity() {
    const missing = Boolean(this.required) && !this.effectiveDisabled && (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.formEntries)(this.value).length === 0;
    return {
      valueMissing: missing,
      message: missing ? this.sfWord('value-missing') : '',
      anchor: this.fieldInput
    };
  } // form.reset(): the value attribute back, without events.


  fieldReset() {
    this._value = undefined;
    this._dirty = false;
    this._query = '';
    this._refusal = '';

    this._close();

    this.requestComponentUpdate('reset');
  } // The form's saved entries: the values; their labels are what the options
  // know, else the values themselves.


  fieldRestore(state) {
    let values = state;
    if (typeof FormData === 'function' && state instanceof FormData) values = state.getAll(this.name || '').map(String);
    if (values === null || values === undefined) return;
    this._value = Array.isArray(values) ? values : [values].filter(one => one !== '');
    this.requestComponentUpdate('restore');
  } // ---------------------------------------------------------- drawing


  templateContext() {
    const props = this.getPropsContext();
    const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value);
    const multiple = Boolean(this.multiple);

    const offer = this._offer(chosen);

    return this.createTemplateContext({ ...props,
      size: this.size,
      appearance: this.appearance,
      label: this.label || '',
      hint: this.hint || '',
      placeholder: this.placeholder || '',
      // The page's error, or the required one a failed form check shows
      // (ShownRequired, C55 acceptance F1: as sf-dropdown 1.9.0).
      errorMessage: this.sfShownMessage(this.invalid, this.errorMessage || ''),
      name: this.name || '',
      multiple,
      required: Boolean(this.required),
      readonly: Boolean(this.readonly),
      invalid: this.sfShownInvalid(this.invalid),
      // The form's disabled fieldset counts too, so the drawn state is not the
      // `disabled` getter's: it travels under its own name.
      fieldDisabled: this.effectiveDisabled,
      editable: this.editable,
      // The resolved value, as the getter answers it (a list when multiple).
      value: this.value,
      chosen,
      // A single field shows its chosen label while the person is not searching.
      queryText: !multiple && !this._dirty && chosen[0] ? String(chosen[0].label) : this._query,
      queryMaxLength: (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.wholeNumber)(this.maxlength, 0),
      minChars: this._minLength(),
      listOpen: this._open,
      listState: this._state,
      items: this._items,
      activeIndex: this._active,
      nextCursor: this._nextCursor,
      notice: this._notice,
      loadingMore: this._loadingMore,
      refusal: this._refusal,
      ariaLabel: this.getAttribute('aria-label') || '',
      searching: this._searching,
      waitShown: this._waitShown,
      chipsMode: this._chipsMode(),
      // How many chips stand in the row while it is collapsed; null draws them all.
      chipsCollapsed: this._chipsCollapsed(),
      chipsShown: this._chipsCollapsed() ? this._chipsShown : null,
      // C139: the person is typing (a single value's picture leaves), the
      // create row, the query the inline options were searched with (their
      // matches are marked), the chip the arrows stand on, the line said.
      typing: this._dirty,
      offer,
      creating: this._creating,
      localQuery: this._state === 'results' && this._options().length ? this._query : '',
      locale: (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__.pageLocale)(this),
      chipActive: this._chipActive,
      announce: this._announce,
      sheet: this._sheet,
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_10__.renderLookupTemplate)(this.templateContext());
  }

  afterRender() {
    this._syncPanel();

    this._syncSheet();

    this._scrollActiveIntoView();

    this._watchChipRow();

    this._fitChips();

    this._untabChips();

    this.sfSyncFormState();
  }

  onConnected() {
    super.onConnected?.();

    this._sheetWanted();

    this._sheetMedia?.addEventListener?.('change', this._onSheetMedia);
  }

  onDisconnected() {
    this._close({
      render: false
    });

    this._syncPanel({
      force: false
    });

    this._syncSheet();

    this._scrollbar?.disconnect();
    this._fitObserver?.disconnect();
    this._fitObserver = null;
    this._untabObserver?.disconnect();
    this._untabObserver = null;
    this._sheetMedia?.removeEventListener?.('change', this._onSheetMedia);
    super.onDisconnected?.();
  } // ---------------------------------------------------------- one Tab stop
  // The field is one Tab stop (C139 (6), LS-9): a chip's remove button is
  // pressed with the mouse, or reached by the arrows from the search box and
  // removed with Delete; it is not a stop of its own. sf-tag draws it a
  // moment after the field does, so the field watches for it.


  _untabChips() {
    const root = this.querySelector('.sf-lookup');
    if (!root) return;

    for (const button of root.querySelectorAll('.sf-lookup-chip button')) {
      if (button.tabIndex !== -1) button.tabIndex = -1;
    }

    if (this._untabObserver || typeof MutationObserver !== 'function') return;
    this._untabObserver = new MutationObserver(() => this._untabChips());

    this._untabObserver.observe(this, {
      childList: true,
      subtree: true
    });
  } // ---------------------------------------------------------- one row of chips


  _chipsMode() {
    return this.multiple && String(this.getAttribute('chips') || '').trim().toLowerCase() === 'row' ? 'row' : 'wrap';
  } // Collapsed: row mode, chips chosen, the field not opened by a press or the focus.


  _chipsCollapsed() {
    return this._chipsMode() === 'row' && !this._chipsOpen && (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value).length > 0;
  }

  _watchChipRow() {
    const frame = this.querySelector('.sf-lookup-frame');
    const wanted = this._chipsMode() === 'row' ? frame : null;
    if (this._fitFrame === wanted) return;
    this._fitObserver?.disconnect();
    this._fitFrame = wanted;
    if (!wanted || typeof ResizeObserver !== 'function') return;
    this._fitObserver = new ResizeObserver(() => {
      this._fitPasses = 0;

      this._fitChips();
    });

    this._fitObserver.observe(wanted);
  } // How many chips the row holds, with «+N» after them and the search box's
  // least room: measured from the drawn chips (those past the row are drawn
  // out of the flow, so they keep their width). A new count draws again; a few
  // passes settle a «+N» whose width changed with its number.


  _fitChips() {
    if (!this._chipsCollapsed()) {
      this._chipsShown = null;
      return;
    }

    const frame = this.querySelector('.sf-lookup-frame');
    if (!frame || !frame.isConnected) return;
    const tags = [...frame.querySelectorAll(':scope > .sf-lookup-chip')].map(host => host.querySelector('.sf-tag') || host);
    const total = tags.length;
    if (!total) return;
    const style = getComputedStyle(frame);
    const room = frame.clientWidth - parseFloat(style.paddingInlineStart || 0) - parseFloat(style.paddingInlineEnd || 0);
    if (!(room > 0)) return;
    const gap = parseFloat(style.columnGap) || 0;
    const input = this.input;
    const least = input ? parseFloat(getComputedStyle(input).minInlineSize) || 0 : 0;
    const more = frame.querySelector(':scope > .sf-lookup-more-chips');
    const moreTag = more?.querySelector('.sf-tag') || more;
    const moreWidth = moreTag ? moreTag.getBoundingClientRect().width : 0;
    const widths = tags.map(tag => tag.getBoundingClientRect().width);
    let shown = 0;
    let used = 0;

    for (let index = 0; index < total; index += 1) {
      const next = used + widths[index] + gap;
      const rest = index + 1 < total ? moreWidth + gap : 0;
      if (next + rest + least > room + 0.5) break;
      used = next;
      shown = index + 1;
    } // The first chip always stands; a name too long for the row ends in an ellipsis.


    shown = Math.max(1, shown);
    if (shown === this._chipsShown) return;
    if (this._fitPasses > 3) return;
    this._fitPasses += 1;
    this._chipsShown = shown;
    this.requestComponentUpdate('chips-fit');
  }

  _openChips() {
    if (this._chipsMode() !== 'row' || this._chipsOpen) return;
    this._chipsOpen = true;
    this.requestComponentUpdate('chips-open');
  }

  onMoreChipsClick(event) {
    event.stopPropagation();
    if (this.effectiveDisabled) return;

    this._openChips();

    this.input?.focus({
      preventScroll: true
    });
  }

  onRootFocusIn() {
    this._openChips();
  } // The panel is a manual popover in the top layer, anchored under the frame;
  // it flips above when there is no room (SF.Position). It is at least the
  // frame and grows with its longest option up to the list's step or the
  // frame, whichever is wider (decision C32; the cap is the sheet's).


  _syncPanel({
    force
  } = {}) {
    const panel = this.querySelector('.sf-lookup-panel');
    const frame = this.querySelector('.sf-lookup-frame');
    const open = (force ?? this._open) && Boolean(panel && frame) && this.isConnected;

    if (open) {
      try {
        if (typeof panel.showPopover === 'function' && !panel.matches(':popover-open')) panel.showPopover();
      } catch {// No popover in this browser: the sheet shows the panel in place.
      }

      if (this._sheet) {
        // The sheet covers the page (its own stylesheet rule): nothing anchors
        // it, and stopping an anchor gives the panel its own style back.
        this._anchor?.stop();
        this._anchor = null;
        this._anchorPanel = null;
      } else if (!this._anchor || this._anchorPanel !== panel) {
        this._anchor?.stop();
        this._anchor = position().anchor(frame, panel, {
          side: 'block-end',
          align: 'start',
          matchWidth: 'min',
          fitHeight: true,
          autoUpdate: true
        });
        this._anchorPanel = panel;
      } else {
        this._anchor.update();
      }
    } else {
      this._anchor?.stop();
      this._anchor = null;
      this._anchorPanel = null;

      try {
        if (panel?.matches?.(':popover-open')) panel.hidePopover();
      } catch {// Nothing to hide.
      }
    } // The scrollbar stands in the panel's inline-end inset while it takes
    // room (owner C07, docs review R029).


    this._scrollbar ??= new _component_panel_scrollbar__WEBPACK_IMPORTED_MODULE_8__.PanelScrollbar();

    this._scrollbar.watch(open ? panel : null, 'sf-lookup-panel--scrollbar');

    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, open);
  }

  _scrollActiveIntoView() {
    if (!this._open || this._active < 0) return;
    const rows = this.querySelectorAll('.sf-lookup-option');
    rows[this._active]?.scrollIntoView?.({
      block: 'nearest'
    });
  } // ---------------------------------------------------------- the search


  _abort() {
    clearTimeout(this._timer);
    this._timer = 0;

    if (this._controller) {
      this._controller.abort();

      this._controller = null;
    } // Whatever was asked before is older than what comes next.


    this._seq += 1;
    this._loadingMore = false;

    this._stopWait();
  }

  _startWait() {
    clearTimeout(this._waitTimer);
    this._waitShown = false;
    this._waitTimer = setTimeout(() => {
      this._waitTimer = 0;
      if (!this._searching && !this._loadingMore) return;
      this._waitShown = true;
      this.requestComponentUpdate('searching');
    }, SEARCH_LINE_DELAY);
  }

  _stopWait() {
    clearTimeout(this._waitTimer);
    this._waitTimer = 0;
    this._waitShown = false;
    this._searching = false;
  }

  _openList() {
    if (!this.editable) return false;

    if (!this._open) {
      this._open = true;

      this._plan(this._dirty || this.multiple ? this._query : '', {
        immediate: true
      });
    }

    return true;
  }

  _close({
    render = true
  } = {}) {
    // The sheet's layer goes at once, so the focus may go back to the field
    // before the next drawing (the stack keeps Tab inside an open layer).
    this._sheet = false;
    this._sheetFocus = false;

    if (this._layerOpen) {
      this._layerOpen = false;
      (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6__.closeLayer)(this, {
        restoreFocus: false
      });
    }

    if (!this._open && this._state === 'closed' && !this._controller && !this._timer) return;

    this._abort();

    this._open = false;
    this._creating = false;
    this._state = 'closed';
    this._items = [];
    this._nextCursor = null;
    this._notice = '';
    this._active = -1;
    this._refusal = '';
    if (render) this.requestComponentUpdate('close');
  } // What a query shows: the inline options filtered in place, the hint, or a
  // call to the provider after the debounce (at once when `immediate`). An
  // empty query is asked of a host that answers one (suggest or min-length 0,
  // C139 (3)): its recent items.


  _plan(query, {
    immediate = false
  } = {}) {
    this._abort();

    this._refusal = '';
    this._creating = false;

    const options = this._options();

    const minLength = String(query ?? '').trim() === '' && this._suggests() ? 0 : this._minLength();
    const plan = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.searchPlan)(query, {
      minLength,
      hasOptions: options.length > 0,
      hasProvider: Boolean(this._provider())
    });
    this._nextCursor = null;
    this._notice = '';
    this._active = -1;

    if (plan === 'local') {
      this._items = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.filterOptions)(options, query, {
        exclude: this._exclude(),
        locale: (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__.pageLocale)(this)
      });
      this._state = this._items.length ? 'results' : 'empty';
    } else if (plan === 'hint') {
      this._items = [];
      this._state = 'hint';
    } else if (plan === 'none') {
      this._items = [];
      this._state = 'unavailable';
    } else {
      const delay = immediate ? 0 : this._debounce();
      if (delay > 0) this._timer = setTimeout(() => this._call(query, null), delay);else this._call(query, null);
    }

    this.requestComponentUpdate('search');
  }

  async _call(query, cursor) {
    this._timer = 0;

    const provider = this._provider();

    if (!provider || !this.isConnected) return;
    if (this._controller) this._controller.abort();
    const controller = new AbortController();
    this._controller = controller;
    this._seq += 1;
    const seq = this._seq;
    this._last = {
      query,
      cursor
    };

    const limit = this._maxResults(); // The rows of the last answer stay while this one runs (LS-5); the line
    // with the spinner comes after SEARCH_LINE_DELAY.


    if (cursor === null) {
      this._searching = true;
      this._nextCursor = null;
      this._notice = '';
    } else {
      this._loadingMore = true;
    }

    this._startWait();

    this.requestComponentUpdate('searching');
    let answer;
    let failed = false;

    try {
      answer = await Promise.resolve().then(() => provider.call(null, query, {
        cursor,
        limit,
        signal: controller.signal
      }));
    } catch (error) {
      failed = true;
      answer = error;
    } // A late answer -- of a call aborted or overtaken -- is dropped.


    if (seq !== this._seq || controller.signal.aborted || !this._open) return;
    this._controller = null;
    this._loadingMore = false;

    this._stopWait();

    const read = failed ? {
      state: 'error',
      items: [],
      nextCursor: null
    } : (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.readAnswer)(answer, {
      exclude: this._exclude(),
      limit
    });

    if (cursor === null) {
      this._items = read.items;
      this._state = read.state;
      this._active = -1;
    } else if (read.state === 'error' || read.state === 'unavailable') {
      this._state = read.state;
    } else {
      this._items = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.appendItems)(this._items, read.items);
      this._state = this._items.length ? 'results' : 'empty';
    } // Retry repeats the call that failed; a good page moves on.


    this._nextCursor = read.state === 'error' ? cursor : read.nextCursor;
    this._notice = read.notice ?? '';
    if (this._active >= this._items.length) this._active = this._items.length - 1;
    this.requestComponentUpdate('answer');
  }
  /** Searches a query at once, as typing does, opening the list. */


  search(query) {
    if (!this.editable) return false;
    this._query = String(query ?? '');
    this._dirty = true;
    this._open = true;

    this._plan(this._query, {
      immediate: true
    });

    return true;
  }
  /** Repeats the last call to the provider, with its query and cursor. */


  retry() {
    if (!this._last || !this._provider() || !this.editable) return false;
    this._open = true;

    this._abort();

    this._call(this._last.query, this._last.cursor);

    return true;
  }
  /** Asks the provider for the next page (Show more). */


  showMore() {
    if (this._nextCursor === null || this._state !== 'results' || !this._last) return false;

    this._abort();

    this._call(this._last.query, this._nextCursor);

    return true;
  }
  /** Closes the list (and the sheet) and drops a search still running; the query stays. */


  close() {
    const was = this._open;

    this._leave({
      refocus: this._sheet
    });

    return was;
  } // ---------------------------------------------------------- focus, the sheet
  // Focus in an empty field (C139 (3)): the host's recent items when it
  // answers an empty query, else the hint at once (a field searched by the
  // provider); a single field holding a value, a typed query, or chips
  // without suggest open nothing.


  _openOnFocus() {
    if (!this.editable || this._open || this._query) return false;
    const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value);
    if (!this.multiple && chosen.length) return false;
    const options = this._options().length > 0;

    if (this._suggests()) {
      this._open = true;

      this._plan('', {
        immediate: true
      });

      return true;
    }

    if (this._provider() && !options && !chosen.length) {
      this._open = true;

      this._plan('', {
        immediate: true
      });

      return true;
    }

    return false;
  } // Under lg the list opens as a sheet over the page, its own search box on
  // top (C139 (7)); the field's box keeps the value under it.


  _enterSheet() {
    if (this._sheet || !this.editable) return false;
    this._sheet = true;
    this._sheetFocus = true;

    if (!this._open) {
      this._open = true;

      this._plan(this._dirty || this.multiple ? this._query : '', {
        immediate: true
      });
    } else {
      this.requestComponentUpdate('sheet');
    }

    return true;
  } // The sheet's layer of the shared stack (standard §19): the page lock,
  // Tab kept inside, Escape. The panel is already in the top layer.


  _syncSheet() {
    const want = this._sheet && this._open && this.isConnected && Boolean(this.querySelector('.sf-lookup-panel'));

    if (want && !this._layerOpen) {
      this._layerOpen = true;
      (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6__.openLayer)(this, {
        kind: 'modal',
        locksPage: true,
        trapsFocus: true,
        returnTo: this.fieldInput,
        root: () => this.querySelector('.sf-lookup-panel'),
        focusIn: () => this.input?.focus({
          preventScroll: true
        }),
        onEscape: () => {
          this._leave({
            refocus: true
          });

          return true;
        },
        onTab: event => this._sheetTab(event)
      });
    } else if (!want && this._layerOpen) {
      this._layerOpen = false;
      (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6__.closeLayer)(this, {
        restoreFocus: false
      });
    }

    if (want && this._sheetFocus) {
      const input = this.querySelector('.sf-lookup-sheet-input');

      if (input) {
        this._sheetFocus = false;
        input.focus({
          preventScroll: true
        });
        if (!this.multiple && !this._dirty && input.value) input.select?.();
      }
    }
  }

  _sheetTab(event) {
    const root = this.querySelector('.sf-lookup-panel');
    const items = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_6__.focusablesIn)(root);
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    const active = document.activeElement;

    if (!root.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  } // Closes the list; out of the sheet the focus goes back to the field's box
  // without opening it again.


  _leave({
    refocus = false
  } = {}) {
    const was = this._sheet;

    this._close();

    if (was && refocus) {
      this._quietFocus = true;

      try {
        this.fieldInput?.focus({
          preventScroll: true
        });
      } finally {
        this._quietFocus = false;
      }
    }
  }
  /** «Готово»: the sheet closes, what was chosen stays. */


  onSheetDone(event) {
    event?.preventDefault?.();

    this._leave({
      refocus: true
    });
  } // ---------------------------------------------------------- choosing


  _say(detail) {
    this.sfEmit('input', detail);
    this.sfEmit('change', detail);
  }

  _write(next) {
    this._value = next;
    this.sfSyncFormState();
  }

  chooseIndex(index) {
    if (index === this._items.length && this._offer()) return this.createFromQuery();
    const item = this._items[index];
    if (!item || !this.editable) return false;
    const multiple = Boolean(this.multiple);
    const result = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.choose)(this.value, item, {
      multiple,
      maxItems: this._maxItems()
    });

    if (result.outcome === 'refused') {
      this._refusal = this.sfWord('max-items', {
        count: this._maxItems()
      });
      this._active = index;
      this.requestComponentUpdate('refused');
      return false;
    }

    this._refusal = '';

    if (result.outcome !== 'unchanged') {
      this._write(result.value);

      this._say({
        value: this.value,
        item: { ...item
        },
        action: result.outcome
      });
    }

    if (!multiple) {
      // A single choice commits and closes the list; the box shows its label.
      this._dirty = false;
      this._query = '';

      this._leave({
        refocus: this._sheet
      });
    } else {
      this._active = index;
    }

    this.requestComponentUpdate('choose');
    return true;
  }
  /**
   * Asks the host to create what is typed (C139 (2)): the event create with
   * {text, kind, respond}. The host answers through respond() -- at once or
   * later, with the new item or a promise of it -- or with {error}, an Error
   * or a message; the item is chosen as a row is, an error is the field's
   * visible polite line. Answers false when there is nothing to create.
   */


  createFromQuery() {
    const offer = this._offer();

    if (!offer || this._creating) return false;
    const multiple = Boolean(this.multiple);

    const maxItems = this._maxItems();

    if (multiple && maxItems > 0 && (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value).length >= maxItems) {
      this._refusal = this.sfWord('max-items', {
        count: maxItems
      });
      this.requestComponentUpdate('refused');
      return false;
    }

    this._creating = true;
    this._refusal = '';
    let settle;
    const answered = new Promise(resolve => {
      settle = resolve;
    });
    let said = false;

    const respond = answer => {
      if (said) return;
      said = true;
      settle(answer);
    };

    this.sfEmit('create', {
      text: offer.text,
      kind: offer.kind,
      respond
    });
    this.requestComponentUpdate('creating');
    Promise.resolve(answered).then(answer => answer, error => error ?? new Error('')).then(answer => this._created(offer, (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.readCreated)(answer)));
    return true;
  }

  _created(offer, read) {
    // A create the person moved on from (another query, the list closed)
    // still makes its item: the host has made the record.
    const current = this._creating && this._query.trim() === offer.text;
    this._creating = false;
    if (!this.isConnected || !this.editable) return;

    if (read.error !== undefined) {
      if (!current) return;
      this._refusal = read.error || this.sfWord('create-error');
      this.requestComponentUpdate('create-error');
      return;
    }

    const multiple = Boolean(this.multiple);
    const result = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.choose)(this.value, read.item, {
      multiple,
      maxItems: this._maxItems()
    });

    if (result.outcome === 'added' || result.outcome === 'replaced') {
      this._write(result.value);

      this._say({
        value: this.value,
        item: { ...read.item
        },
        action: result.outcome,
        created: true
      });
    }

    this._query = '';
    this._dirty = false;

    if (!multiple) {
      this._leave({
        refocus: this._sheet
      });
    } else if (this._open) {
      this._plan('', {
        immediate: true
      });
    }

    this.requestComponentUpdate('created');
  }

  _removeItem(item) {
    if (!this.editable) return false;
    const next = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.removeChosen)(this.value, item.value, {
      multiple: Boolean(this.multiple)
    });
    this._refusal = '';

    this._write(next);

    this._say({
      value: this.value,
      item: { ...item
      },
      action: 'removed'
    });

    this.requestComponentUpdate('remove');
    return true;
  } // ---------------------------------------------------------- the search box


  onQueryInput(event) {
    // The box's own input is not the field's: typing is not a change of value.
    event.stopPropagation();
    if (!this.editable) return;
    this._query = String(event.target?.value ?? '');
    this._dirty = true;

    this._setChip(-1); // A key typed into the field's own box under lg: the sheet opens with it.


    if (!this._sheet && this._sheetWanted() && !event.target?.classList?.contains('sf-lookup-sheet-input')) this._enterSheet();
    this._open = true;

    this._plan(this._query);
  }

  onQueryFocus(event) {
    if (event?.target?.classList?.contains('sf-lookup-sheet-input') || this._quietFocus) return;

    if (this.editable && this._sheetWanted()) {
      this._enterSheet();

      return;
    } // A single field's label is selected, so typing replaces it.


    const input = this.input;
    if (input && !this.multiple && !this._dirty && input.value) input.select?.();

    this._openOnFocus();
  } // ---------------------------------------------------------- chips by keys
  // ← from the start of the search box steps onto the last chip, ← / → walk
  // them, → past the last comes back to the box; Delete or Backspace removes
  // the chip stood on (C139 (6)). Each step is said: «Name, 1 of N, Delete
  // to remove». The focus stays in the box: the chip is marked, not focused.


  _setChip(index) {
    const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value);
    const next = index >= 0 && index < chosen.length ? index : -1;
    if (next === this._chipActive && (next < 0 || this._announce)) return;
    this._chipActive = next;
    this._announce = next < 0 ? '' : this.sfWord('chip-position', {
      vars: {
        label: String(chosen[next].label),
        position: next + 1,
        total: chosen.length
      }
    });
    this.requestComponentUpdate('chip-active');
  }

  _chipKeys(event) {
    if (!this.multiple) return false;
    const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value);
    const key = event.key;
    const rtl = getComputedStyle(this).direction === 'rtl';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    const ahead = rtl ? 'ArrowLeft' : 'ArrowRight';
    const input = event.target;
    const atStart = !input?.value || input.selectionStart === 0 && input.selectionEnd === 0;

    if (this._chipActive < 0) {
      if (key === back && chosen.length && atStart && !event.shiftKey) {
        event.preventDefault();

        this._setChip(chosen.length - 1);

        return true;
      }

      return false;
    }

    if (key === back) {
      event.preventDefault();

      this._setChip(Math.max(0, this._chipActive - 1));

      return true;
    }

    if (key === ahead) {
      event.preventDefault();

      this._setChip(this._chipActive + 1 < chosen.length ? this._chipActive + 1 : -1);

      return true;
    }

    if (key === 'Delete' || key === 'Backspace') {
      event.preventDefault();
      const index = this._chipActive;

      this._removeItem(chosen[index]);

      const left = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value).length;
      this._chipActive = -1;

      this._setChip(left ? Math.min(index, left - 1) : -1);

      return true;
    }

    if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      this._setChip(-1);

      return true;
    } // Any other key belongs to the box again.


    this._setChip(-1);

    return false;
  }

  onQueryKeydown(event) {
    if (event.isComposing || !this.editable) return;
    if (this._chipKeys(event)) return;
    const key = event.key;

    const rows = this._rowCount();

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();

      if (!this._open) {
        this._openList();

        return;
      }

      this._moveTo((0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.moveActive)(this._active, rows, key));

      return;
    }

    if ((key === 'Home' || key === 'End') && this._open && rows) {
      event.preventDefault();

      this._moveTo((0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.moveActive)(this._active, rows, key));

      return;
    }

    if (key === 'Enter') {
      if (this._open && this._active >= 0) {
        event.preventDefault();
        this.chooseIndex(this._active);
      } else if (this._open) {
        // The list is open: Enter belongs to it, not to the form.
        event.preventDefault();
      }

      return;
    }

    if (key === 'Escape') {
      if (this._sheet) {
        // The sheet, as sf-search's: a typed query is cleared first, then
        // the sheet closes.
        event.preventDefault();
        event.stopPropagation();

        if (this._query) {
          this._query = '';
          this._dirty = !this.multiple && (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value).length > 0;

          this._plan('', {
            immediate: true
          });
        } else {
          this._leave({
            refocus: true
          });
        }

        return;
      }

      if (this._open) {
        event.preventDefault();
        event.stopPropagation();

        this._close();

        return;
      }

      if (this._query || this._dirty) {
        event.preventDefault();
        event.stopPropagation();
        this._query = '';
        this._dirty = false;
        this.requestComponentUpdate('clear-query');
      }

      return;
    }

    if (key === 'Backspace' && this.multiple && !event.target?.value) {
      const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value);

      if (chosen.length) {
        event.preventDefault();

        this._removeItem(chosen[chosen.length - 1]);
      }
    }
  }

  _moveTo(index) {
    if (index === this._active) return;
    this._active = index;
    this.requestComponentUpdate('active');
  } // ---------------------------------------------------------- pointer


  onFrameClick(event) {
    if (event.target?.closest?.('sf-tag, button')) return;
    if (this.effectiveDisabled) return; // A press on the field's frame under lg opens the sheet, also when its
    // box kept the focus after the sheet closed.

    if (!event.target?.closest?.('.sf-lookup-panel') && this.editable && this._sheetWanted() && !this._sheet) {
      this._enterSheet();

      return;
    }

    this.input?.focus();
  } // A press anywhere in the list keeps the focus in the search box; Retry and
  // Show more still hear the click.


  onPanelMouseDown(event) {
    // The sheet's own search box takes the press (the caret goes where it is
    // pressed).
    if (event.target?.closest?.('input')) return;
    event.preventDefault();
  } // Retry and Show more go away while the call runs: the focus goes back to
  // the search box first, so a keyboard press on them does not leave the field.


  onRetryClick() {
    this.input?.focus({
      preventScroll: true
    });
    this.retry();
  }

  onShowMoreClick() {
    this.input?.focus({
      preventScroll: true
    });
    this.showMore();
  }

  onPanelClick(event) {
    const option = event.target?.closest?.('.sf-lookup-option');
    if (!option) return;
    event.preventDefault();
    this.chooseIndex(Number(option.dataset.sfIndex));
  }

  onChipClose(event, item) {
    event.stopPropagation();

    this._removeItem(item); // The chip goes with its button: the focus goes back to the search box.


    this.input?.focus({
      preventScroll: true
    });
  }

  onClearClick(event) {
    event.preventDefault();
    const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_11__.chosenList)(this.value);
    if (!chosen.length || !this.editable) return;

    this._removeItem(chosen[0]);

    this._dirty = false;
    this._query = '';
    this.input?.focus({
      preventScroll: true
    });
  }

  onRootPointerDown(event) {
    if (event.target?.closest?.('.sf-lookup-frame')) this.querySelector('.sf-lookup')?.classList.add('sf-lookup--pointer-focus');
  } // Leaving the field closes the list; a single field shows its label again.
  // The sheet is not left by a blur to nowhere (the phone's own keyboard
  // closing): only «Готово», Escape or a choice close it.


  onRootFocusOut(event) {
    const next = event.relatedTarget;
    if (next && this.contains(next)) return;
    if (this._sheet && !next) return;

    this._setChip(-1);

    this.querySelector('.sf-lookup')?.classList.remove('sf-lookup--pointer-focus');

    if (this._chipsOpen) {
      this._chipsOpen = false;
      this._chipsShown = null;
      this._fitPasses = 0;
    }

    if (!this.multiple && this._dirty) {
      this._dirty = false;
      this._query = '';
    }

    this._close({
      render: false
    });

    this.requestComponentUpdate('leave');
  }

}

SfLookup.define('sf-input-lookup');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfLookup);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c4b543e9c79e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderLookupTemplate: () => (/* binding */ renderLookupTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f39dc444b059");
/* harmony import */ var lit_directives_live_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2d6390ae26b0");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _lookup_model_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("91c9715ba00a");
/* harmony import */ var _avatar_js_picture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("c69a3dc158df");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _component_field_contract__WEBPACK_IMPORTED_MODULE_3__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_5__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _component_field_contract__WEBPACK_IMPORTED_MODULE_3__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);





 // The field: a label row, one frame holding the chips and the search box, the
// hint or error line under it, and the list panel -- a popover the component
// anchors under the frame. sf-input's parts, in its places.
//
// The search box is the combobox; the focus never leaves it while the arrows
// move the active row (aria-activedescendant). Rows are drawn here, not as
// elements: the class markup of an avatar (a photo or initials) beside the
// label and the caption. A chosen row is its fill alone, no check (owner
// decision C08).
// A row's picture is the field's text line, as a chip's is (the geometry
// standard: every picture of a size is its line; LK-06). The stylesheet sizes
// it; the class is the avatar ladder's smallest step, for its initials.

const AVATAR_CLASS_SIZE = '1/4'; // The clear is the field layer's action (owner decision C123, which takes
// C14's plain close further): a glyph without a plate, the size of the
// field's leading picture, its hit area the field's height.

const BUTTON_SIZE = {
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/2',
  '2': '1',
  '3': '2'
}; // A chip is an inline tag one size down, its text a step under the field's
// (1/3 keeps the smallest tag). Its height is the field's less --sf-space-1/4
// above and below (owner decision C58): the stylesheet publishes it to the tag
// as its line (--sf-tag--line), so the chip, its avatar and its remove target
// are read from the field ladder at every size and density (LS-1..LS-3). It
// stood on the field's text line before (sf-tag line): 24 in a 40 field.

const CHIP_TAG_SIZE = {
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/2',
  '2': '1',
  '3': '2'
}; // sf-avatar's own drawing (js/picture.js, avatar study AV-8): the photo, else
// the initials, else the person glyph, with the row's geometry class.

function avatar(item, size, extraClass = '') {
  if (!item.avatar) return item.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon class=${`${extraClass} sf-lookup-icon flex-none`} icon=${item.icon} aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_5__.avatarPicture)({
    size,
    imageUrl: item.avatar.src,
    text: item.avatar.initials,
    name: item.label,
    lazy: true,
    extraClass: `overflow-hidden ${extraClass}`.trim()
  });
}

function chip(context, item, index) {
  const {
    component,
    size,
    editable,
    fieldDisabled,
    chipsShown,
    chipActive
  } = context;
  const label = String(item.label); // Row mode (chips="row"): the chips past the row stay drawn, out of the
  // flow and unseen, so the field can measure them; "+N" stands for them.

  const over = chipsShown !== null && index >= chipsShown; // The chip the arrows stand on (C139 (6)) wears the focus ring.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag
      class=${['sf-lookup-chip', over ? 'sf-lookup-chip--over' : '', index === chipActive ? 'sf-lookup-chip--active' : ''].filter(Boolean).join(' ')}
      kind=${item.avatar ? 'avatar' : 'default'}
      size=${CHIP_TAG_SIZE[size] || '1/2'}
      inline
      text=${label}
      title=${item.caption ? `${label} — ${item.caption}` : label}
      avatar-image-url=${item.avatar?.src || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      avatar-text=${item.avatar?.initials || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      closable=${editable ? '' : 'false'}
      close-label=${component.sfWord('remove', {
    vars: {
      label
    }
  })}
      ?disabled=${fieldDisabled}
      data-sf-value=${String(item.value)}
      @sf-tag-close=${event => component.onChipClose(event, item)}
      @close=${event => event.stopPropagation()}
    ></sf-tag>`;
} // The chips that do not fit one row (chips="row", final name, C174 (5); C58: one
// row and a «+N» to press in filters, tables and cards). A press, or the focus
// coming into the field, opens the field to every chip; leaving it closes it.


function moreChips(context) {
  const {
    component,
    size,
    chosen,
    chipsShown
  } = context;
  if (chipsShown === null || chipsShown >= chosen.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const rest = chosen.slice(chipsShown);
  const names = rest.map(item => String(item.label)).join(', ');
  const said = component.sfWord('more-chips', {
    count: rest.length,
    vars: {
      names
    }
  });
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag
      class="sf-lookup-more-chips"
      kind="default"
      size=${CHIP_TAG_SIZE[size] || '1/2'}
      inline
      text=${`+${rest.length}`}
      title=${said}
      aria-label=${said}
      closable="false"
      @click=${event => component.onMoreChipsClick(event)}
    ></sf-tag>`;
} // The part of a text the query matched, in the medium weight (owner decision
// C139 (8)): found by the field in the inline options, or the ranges a host
// returned with its answer (item.match); a server's answer without them is
// drawn plain.


function marked(text, ranges) {
  if (!ranges?.length) return text;
  return (0,_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_4__.splitByRanges)(text, ranges).map(part => part.match ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-match">${part.text}</span>` : part.text);
}

function rangesOf(context, item, part) {
  if (item.match?.[part]) return item.match[part];
  const text = part === 'label' ? item.label : item.caption;
  return context.localQuery ? (0,_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_4__.matchRanges)(text, context.localQuery, context.locale) : [];
}

function row(context, item, index) {
  const {
    component,
    ids,
    activeIndex
  } = context;
  const chosen = component.isItemChosen(item);
  const active = index === activeIndex;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${['sf-lookup-option', 'flex', 'items-cross-center', item.caption ? 'sf-lookup-option--caption' : '', chosen ? 'sf-lookup-option--chosen' : '', active ? 'sf-lookup-option--active' : ''].filter(Boolean).join(' ')}
      id=${`${ids.option}-${index}`}
      role="option"
      aria-selected=${chosen ? 'true' : 'false'}
      data-sf-index=${String(index)}
    >${avatar(item, AVATAR_CLASS_SIZE, 'sf-lookup-option-avatar')}<span class="sf-lookup-option-text flex flex-col">
        <span class="sf-lookup-option-label">${marked(item.label, rangesOf(context, item, 'label'))}</span>
        ${item.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-option-caption">${marked(item.caption, rangesOf(context, item, 'caption'))}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </span></div>`;
} // The create row, last (owner decision C139 (2)): the add icon in the
// picture's place, «Создать «…»» or, for addresses, «Добавить адрес …»; a
// hairline parts it from the rows above.


function createRow(context) {
  const {
    component,
    ids,
    activeIndex,
    items,
    offer,
    creating
  } = context;
  const index = items.length;
  const words = offer.kind === 'email' ? 'create-email' : 'create-item';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${items.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-lookup-divider" role="separator"></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<div
      class=${['sf-lookup-option', 'sf-lookup-option--create', 'flex', 'items-cross-center', index === activeIndex ? 'sf-lookup-option--active' : ''].filter(Boolean).join(' ')}
      id=${`${ids.option}-${index}`}
      role="option"
      aria-selected="false"
      aria-disabled=${creating ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-index=${String(index)}
    ><sf-icon class="sf-lookup-option-avatar sf-lookup-icon flex-none" icon="add" aria-hidden="true"></sf-icon><span class="sf-lookup-option-text flex flex-col">
        <span class="sf-lookup-option-label">${component.sfWord(words, {
    vars: {
      text: offer.text
    }
  })}</span>
      </span></div>`;
}

const SPINNER_SIZE = {
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/3',
  '2': '1/2',
  '3': '1'
}; // The line says the wait once, in its own words (LS-16): the spinner keeps its
// label for a screen reader only (label-hidden, C138), so no «Загрузка…» stands
// under it and the line is a row high. The line itself waits the spinner's
// delay before it is drawn (C130 (8)); the stylesheet lets the spinner show at
// once with it, not a second later.

function spinner(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-spinner class="sf-lookup-spinner flex-none" size=${SPINNER_SIZE[context.size] || '1/3'} label-hidden aria-hidden="true"></sf-spinner>`;
}

function stateLine(context) {
  const {
    component,
    listState,
    minChars,
    refusal,
    items,
    loadingMore,
    notice,
    searching,
    waitShown
  } = context;
  if (refusal) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${refusal}</span>`; // A search runs: the rows of the last answer stay; the line comes after the
  // delay, and an old line (the hint, Nothing found) goes at once.

  if (searching || loadingMore) {
    if (waitShown) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('searching')}</span>`;
    return listState === 'results' && !loadingMore ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-visually-hidden">${component.sfWord('results', {
      count: items.length
    })}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  switch (listState) {
    case 'hint':
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('hint-min-length', {
        count: minChars
      })}</span>`;

    case 'empty':
      // With the create row under it, Nothing found is said, not shown.
      return context.offer ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-visually-hidden">${component.sfWord('nothing-found')}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('nothing-found')}</span>`;

    case 'unavailable':
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('unavailable')}</span>`;

    case 'error':
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('error')}</span>`;

    case 'results':
      // Said, not shown: the rows are what a sighted person reads.
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${notice ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${notice}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-lookup-visually-hidden">${component.sfWord('results', {
        count: items.length
      })}</span>`;

    default:
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }
} // The picture of a single chosen value (owner decision C139 (5)): its avatar
// or icon before the name, the field's text line high, --sf-space-1/2 (C105
// H2) before the text; it goes while the person types. The caption is not in
// the field: it is the row's, and the box's tooltip.


function valuePicture(context) {
  const {
    multiple,
    chosen,
    typing
  } = context;
  const item = !multiple && !typing ? chosen[0] : null;
  if (!item || !item.avatar && !item.icon) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return avatar(item, AVATAR_CLASS_SIZE, 'sf-lookup-value-picture');
} // The frame: the chips and the search box (and a single value's picture and
// clear). The sheet draws its own (sheet: true), with its own box.


function frame(context, {
  sheet = false
} = {}) {
  const {
    component,
    multiple,
    chosen,
    placeholder,
    queryText,
    queryMaxLength,
    listOpen,
    items,
    activeIndex,
    editable,
    ariaLabel,
    fieldDisabled,
    readonly,
    label,
    typing,
    offer
  } = context;
  const {
    field,
    ids,
    message
  } = context.parts;
  const single = !multiple && chosen[0];
  const rows = items.length + (offer ? 1 : 0);
  const title = single && !typing && single.caption ? `${single.label} — ${single.caption}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${['sf-lookup-frame', sheet ? 'sf-lookup-sheet-frame' : '', 'flex', 'flex-wrap', 'items-cross-center'].filter(Boolean).join(' ')} @click=${event => component.onFrameClick(event)}>
        ${multiple ? chosen.map((item, index) => chip(context, item, index)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${multiple ? moreChips(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${valuePicture(context)}
        <input
          class=${['sf-lookup-input', sheet ? 'sf-lookup-sheet-input' : '', 'flex-1', queryText ? 'sf-lookup-input--typed' : ''].filter(Boolean).join(' ')}
          id=${sheet ? `${field.controlId}--sheet` : field.controlId}
          type="text"
          role="combobox"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          enterkeyhint=${sheet ? 'search' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded=${listOpen ? 'true' : 'false'}
          aria-controls=${ids.list}
          aria-activedescendant=${listOpen && activeIndex >= 0 && activeIndex < rows ? `${ids.option}-${activeIndex}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-labelledby=${label ? ids.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-label=${!label && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-describedby=${message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-errormessage=${field.invalid && context.errorMessage ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-required=${field.required ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-readonly=${readonly ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          title=${title}
          placeholder=${multiple && chosen.length || single ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          maxlength=${queryMaxLength > 0 ? String(queryMaxLength) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ?disabled=${fieldDisabled}
          ?readonly=${readonly}
          .value=${(0,lit_directives_live_js__WEBPACK_IMPORTED_MODULE_2__.live)(queryText)}
          @input=${event => component.onQueryInput(event)}
          @change=${event => event.stopPropagation()}
          @keydown=${event => component.onQueryKeydown(event)}
          @focus=${event => component.onQueryFocus(event)}
        >
        ${single && editable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button"
              class="sf-field-action sf-lookup-clear"
              aria-label=${component.sfWord('clear')}
              @click=${event => component.onClearClick(event)}
            ><sf-icon icon="close" aria-hidden="true"></sf-icon></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>`;
}

function renderLookupTemplate(context) {
  const {
    component,
    size,
    appearance,
    label,
    required,
    hint,
    errorMessage,
    invalid,
    fieldDisabled,
    readonly,
    multiple,
    chosen,
    listOpen,
    listState,
    items,
    nextCursor,
    loadingMore,
    refusal,
    searching,
    waitShown,
    chipsMode,
    chipsShown,
    offer,
    sheet,
    announce
  } = context;
  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_3__.createFieldContract)(component, {
    prefix: 'sf-lookup',
    required,
    invalid,
    hint,
    errorMessage
  });
  const ids = {
    label: `${field.base}--label`,
    panel: `${field.base}--panel`,
    list: `${field.base}--list`,
    status: `${field.base}--status`,
    option: `${field.base}--option`
  };
  const message = field.invalid && errorMessage ? errorMessage : hint;
  const rowContext = { ...context,
    ids,
    parts: {
      field,
      ids,
      message
    }
  };
  const showList = listOpen && (items.length > 0 || Boolean(offer)) && (!searching || listState === 'results' || Boolean(offer)); // The rows of the last answer while a new search runs, a step paler (C139 (4)).

  const stale = showList && searching && listState === 'results'; // Nothing to show yet (a first search inside the delay): the panel is not drawn.

  const stateShown = Boolean(refusal) || (searching || loadingMore ? waitShown : !['closed', 'results'].includes(listState) && !(listState === 'empty' && offer));
  const blank = listOpen && !sheet && !showList && !stateShown && listState !== 'error';
  const rootClasses = ['sf-lookup', `sf-lookup--size-${size}`, `sf-lookup--${appearance}`, multiple ? 'sf-lookup--multiple' : 'sf-lookup--single', multiple && chipsMode === 'row' ? 'sf-lookup--chips-row' : '', context.chipsCollapsed ? 'sf-lookup--chips-collapsed' : '', context.chipsCollapsed && chipsShown === 1 && chosen.length > 1 ? 'sf-lookup--chips-one' : '', listOpen ? 'sf-lookup--open' : '', sheet ? 'sf-lookup--sheet' : '', field.invalid ? 'error' : '', fieldDisabled ? 'sf-lookup--disabled' : '', readonly ? 'sf-lookup--readonly' : '', 'flex', 'flex-col', context.rootClass].filter(Boolean);
  const panelClasses = ['sf-lookup-panel', blank ? 'sf-lookup-panel--blank' : '', sheet ? 'sf-lookup-panel--sheet' : ''].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      @pointerdown=${event => component.onRootPointerDown(event)}
      @focusin=${() => component.onRootFocusIn()}
      @focusout=${event => component.onRootFocusOut(event)}>
      ${label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-label flex" id=${ids.label} @click=${() => component.focus()}>
            <span class="sf-lookup-text">${label}</span>
            ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-required" aria-hidden="true">*</span>` : ''}
            ${(0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_1__.renderFieldHelp)({
    help: context.help,
    label,
    size,
    className: 'sf-lookup-help',
    component
  })}
          </span>` : ''}
      ${frame(rowContext)}
      ${message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-lookup-hint-text-wrap"
            data-field-message=${field.invalid && errorMessage ? 'error' : 'hint'}>${message}</span>` : ''}
      <span class="sf-lookup-visually-hidden" role="status" aria-live="polite">${announce}</span>
      <div class=${panelClasses.join(' ')} id=${ids.panel} popover="manual"
        role=${sheet ? 'dialog' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-modal=${sheet ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${sheet ? label || context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        @mousedown=${event => component.onPanelMouseDown(event)}
        @click=${event => component.onPanelClick(event)}>
        ${sheet ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-lookup-sheet-head flex items-cross-center">
              <sf-button-icon class="sf-lookup-sheet-done" icon="arrow_back" size="1/2" appearance="ghost" scheme="on-surface"
                aria-label=${component.sfWord('done')} @click=${event => component.onSheetDone(event)}></sf-button-icon>
              ${frame(rowContext, {
    sheet: true
  })}
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class=${['sf-lookup-list', stale ? 'sf-lookup-list--stale' : ''].filter(Boolean).join(' ')} id=${ids.list} role="listbox"
          aria-labelledby=${label ? ids.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-label=${!label && context.ariaLabel ? context.ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-multiselectable=${multiple ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-busy=${stale ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ?hidden=${!showList}>${showList ? items.map((item, index) => row(rowContext, item, index)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${showList && offer ? createRow(rowContext) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
        <div class=${['sf-lookup-state', 'flex', 'items-cross-center', refusal ? 'sf-lookup-state--refusal' : '', listState === 'error' && !refusal ? 'sf-lookup-state--error' : ''].filter(Boolean).join(' ')}>
          ${listOpen && !refusal && (searching || loadingMore) && waitShown ? spinner(rowContext) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          <span class="sf-lookup-status" id=${ids.status} role="status" aria-live="polite">${listOpen ? stateLine(rowContext) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
        </div>
        ${listOpen && listState === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-lookup-actions flex"><sf-button class="sf-lookup-retry" size=${BUTTON_SIZE[size] || '1/2'} appearance="outline"
              @click=${() => component.onRetryClick()}>${component.sfWord('retry')}</sf-button></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${listOpen && listState === 'results' && nextCursor !== null && !loadingMore ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-lookup-actions flex"><sf-button class="sf-lookup-more" size=${BUTTON_SIZE[size] || '1/2'} appearance="outline"
              @click=${() => component.onShowMoreClick()}>${component.sfWord('show-more')}</sf-button></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1cabccb560d5"
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

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

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

/***/ "a5a956c9f619"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateResultType: () => (/* binding */ e),
/* harmony export */   clearPart: () => (/* binding */ j),
/* harmony export */   getCommittedValue: () => (/* binding */ M),
/* harmony export */   getDirectiveClass: () => (/* binding */ f),
/* harmony export */   insertPart: () => (/* binding */ v),
/* harmony export */   isCompiledTemplateResult: () => (/* binding */ d),
/* harmony export */   isDirectiveResult: () => (/* binding */ c),
/* harmony export */   isPrimitive: () => (/* binding */ n),
/* harmony export */   isSingleExpression: () => (/* binding */ r),
/* harmony export */   isTemplateResult: () => (/* binding */ l),
/* harmony export */   removePart: () => (/* binding */ h),
/* harmony export */   setChildPartValue: () => (/* binding */ u),
/* harmony export */   setCommittedValue: () => (/* binding */ p)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:t}=_lit_html_js__WEBPACK_IMPORTED_MODULE_0__._$LH,i=o=>o,n=o=>null===o||"object"!=typeof o&&"function"!=typeof o,e={HTML:1,SVG:2,MATHML:3},l=(o,t)=>void 0===t?void 0!==o?._$litType$:o?._$litType$===t,d=o=>null!=o?._$litType$?.h,c=o=>void 0!==o?._$litDirective$,f=o=>o?._$litDirective$,r=o=>void 0===o.strings,s=()=>document.createComment(""),v=(o,n,e)=>{const l=o._$AA.parentNode,d=void 0===n?o._$AB:n._$AA;if(void 0===e){const i=l.insertBefore(s(),d),n=l.insertBefore(s(),d);e=new t(i,n,o,o.options)}else{const t=e._$AB.nextSibling,n=e._$AM,c=n!==o;if(c){let t;e._$AQ?.(o),e._$AM=o,void 0!==e._$AP&&(t=o._$AU)!==n._$AU&&e._$AP(t)}if(t!==d||c){let o=e._$AA;for(;o!==t;){const t=i(o).nextSibling;i(l).insertBefore(o,d),o=t}}}return e},u=(o,t,i=o)=>(o._$AI(t,i),o),m={},p=(o,t=m)=>o._$AH=t,M=o=>o._$AH,h=o=>{o._$AR(),o._$AA.remove()},j=o=>{o._$AR()};
//# sourceMappingURL=directive-helpers.js.map


/***/ },

/***/ "0e2a9b296d0b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Directive: () => (/* binding */ i),
/* harmony export */   PartType: () => (/* binding */ t),
/* harmony export */   directive: () => (/* binding */ e)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
//# sourceMappingURL=directive.js.map


/***/ },

/***/ "42b0b8d71f19"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   live: () => (/* binding */ l)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0e2a9b296d0b");
/* harmony import */ var _directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a5a956c9f619");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=(0,_directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(class extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive{constructor(r){if(super(r),r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.PROPERTY&&r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ATTRIBUTE&&r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!(0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__.isSingleExpression)(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t]){if(t===_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange||t===_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.nothing)return t;const o=i.element,l=i.name;if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.PROPERTY){if(t===o[l])return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}else if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(l))return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}else if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ATTRIBUTE&&o.getAttribute(l)===t+"")return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange;return (0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__.setCommittedValue)(i),t}});
//# sourceMappingURL=live.js.map


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

/***/ "2d6390ae26b0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   live: () => (/* reexport safe */ lit_html_directives_live_js__WEBPACK_IMPORTED_MODULE_0__.live)
/* harmony export */ });
/* harmony import */ var lit_html_directives_live_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("42b0b8d71f19");

//# sourceMappingURL=live.js.map


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

/***/ "91c9715ba00a"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULTS: () => (/* binding */ DEFAULTS),
/* harmony export */   STATES: () => (/* binding */ STATES),
/* harmony export */   appendItems: () => (/* binding */ appendItems),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   chosenList: () => (/* binding */ chosenList),
/* harmony export */   createKind: () => (/* binding */ createKind),
/* harmony export */   createOffer: () => (/* binding */ createOffer),
/* harmony export */   excludedKeys: () => (/* binding */ excludedKeys),
/* harmony export */   filterOptions: () => (/* binding */ filterOptions),
/* harmony export */   foldText: () => (/* binding */ foldText),
/* harmony export */   formEntries: () => (/* binding */ formEntries),
/* harmony export */   isChosen: () => (/* binding */ isChosen),
/* harmony export */   isEmailAddress: () => (/* binding */ isEmailAddress),
/* harmony export */   keyOf: () => (/* binding */ keyOf),
/* harmony export */   matchRanges: () => (/* binding */ matchRanges),
/* harmony export */   moveActive: () => (/* binding */ moveActive),
/* harmony export */   normaliseAvatar: () => (/* binding */ normaliseAvatar),
/* harmony export */   normaliseIcon: () => (/* binding */ normaliseIcon),
/* harmony export */   normaliseItem: () => (/* binding */ normaliseItem),
/* harmony export */   normaliseItems: () => (/* binding */ normaliseItems),
/* harmony export */   normaliseMatch: () => (/* binding */ normaliseMatch),
/* harmony export */   normaliseRanges: () => (/* binding */ normaliseRanges),
/* harmony export */   normaliseValue: () => (/* binding */ normaliseValue),
/* harmony export */   readAnswer: () => (/* binding */ readAnswer),
/* harmony export */   readCreated: () => (/* binding */ readCreated),
/* harmony export */   removeChosen: () => (/* binding */ removeChosen),
/* harmony export */   safeImageSource: () => (/* binding */ safeImageSource),
/* harmony export */   sameValue: () => (/* binding */ sameValue),
/* harmony export */   searchPlan: () => (/* binding */ searchPlan),
/* harmony export */   splitByRanges: () => (/* binding */ splitByRanges),
/* harmony export */   wholeNumber: () => (/* binding */ wholeNumber),
/* harmony export */   withoutExcluded: () => (/* binding */ withoutExcluded),
/* harmony export */   withoutMatch: () => (/* binding */ withoutMatch)
/* harmony export */ });
// sf-input-lookup's model, without a document: the value, the items an answer
// brings, the list a query shows, a choice and the search's states. The
// element (../index.js) keeps the instance's state and draws it; everything
// here is a plain function of its arguments, so tests/lookup.contract.test.mjs
// runs it in Node and a server can read a submitted value the same way.
//
// The value is the field renderer's lookup value (src/smart/field-renderers,
// lookupItems): {value, label}, or a list of them when multiple. An item may
// carry caption and avatar ({src} or {initials}); they travel with the chosen
// item, so a chip and a row never need a second read.

const DEFAULTS = Object.freeze({minLength: 2, maxResults: 20, debounce: 120});

// The states of the list area, one line each (the design draft's table).
const STATES = Object.freeze(['closed', 'hint', 'searching', 'results', 'empty', 'unavailable', 'error']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const present = (value) => value !== null && value !== undefined && value !== '';

/** The key a value is compared by: its string, as a form sends it. */
const keyOf = (value) => String(value);

/** A whole number setting read leniently: a non-number or a negative is the fallback. */
function wholeNumber(value, fallback, {min = 0} = {}) {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) && number >= min ? number : fallback;
}

/**
 * An image address the avatar may show: http(s), a path on the site, a data
 * image or a blob. Nothing that leaves a CSS url() or an attribute (quotes,
 * brackets, back slashes, white space, control characters), so the address
 * reads the same wherever the picture is drawn.
 */
function safeImageSource(src) {
  const text = String(src ?? '').trim();
  if (!text || /[\s"'()\\<>]/u.test(text) || [...text].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return '';
  if (/^https?:\/\//iu.test(text)) return text;
  if (/^data:image\/(png|jpeg|gif|webp|avif);/iu.test(text)) return text;
  if (/^blob:/iu.test(text)) return text;
  if (text.startsWith('/') && !text.startsWith('//')) return text;
  return '';
}

/** An avatar as the model keeps it: {src}, {initials}, or null. */
function normaliseAvatar(avatar) {
  if (!isObject(avatar)) return null;
  const src = safeImageSource(avatar.src);
  if (src) return {src};
  const initials = String(avatar.initials ?? '').trim().slice(0, 3);
  return initials ? {initials} : null;
}

/**
 * One item of an answer, of the inline options or of the value:
 * {value, label, caption?, avatar?}, or null when it has no value. A label
 * missing is the value's text (a host that sends the value alone is still
 * shown something); `text` is read as the label too, as sf-dropdown's
 * options and the field renderer read it.
 */
function normaliseItem(raw) {
  if (!isObject(raw) || !present(raw.value)) return null;
  const value = typeof raw.value === 'number' || typeof raw.value === 'string' ? raw.value : keyOf(raw.value);
  const item = {value, label: String(raw.label ?? raw.text ?? value)};
  const caption = raw.caption === null || raw.caption === undefined ? '' : String(raw.caption);
  if (caption) item.caption = caption;
  const avatar = normaliseAvatar(raw.avatar);
  if (avatar) item.avatar = avatar;
  // An icon stands where an avatar would (a record's kind, a page): the
  // avatar wins when both come (owner decision C139 (5)).
  const icon = avatar ? '' : normaliseIcon(raw.icon);
  if (icon) item.icon = icon;
  // The host's match ranges (C139 (8)): only an answer of the host's carries
  // them; a chosen item leaves them behind (choose()).
  const match = normaliseMatch(raw.match, item);
  if (match) item.match = match;
  return item;
}

/** An icon of the icon font by its name (letters, digits, _ and -), or ''. */
function normaliseIcon(icon) {
  const name = String(icon ?? '').trim();
  return /^[a-z0-9_-]{1,64}$/u.test(name) ? name : '';
}

/**
 * Ranges [start, end) in a text: whole numbers inside it, sorted, the ones
 * that touch or overlap joined; anything else is dropped.
 */
function normaliseRanges(raw, length) {
  if (!Array.isArray(raw)) return [];
  const ranges = raw
    .filter((one) => Array.isArray(one) && one.length === 2)
    .map(([start, end]) => [Math.trunc(Number(start)), Math.trunc(Number(end))])
    .filter(([start, end]) => Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end > start && end <= length)
    .sort((a, b) => a[0] - b[0]);
  const joined = [];
  for (const range of ranges) {
    const last = joined.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else joined.push([...range]);
  }
  return joined;
}

/**
 * The match ranges a host returned with an item: {label: [[start, end]],
 * caption: [[start, end]]}, or a list of ranges for the label alone; offsets
 * in UTF-16 code units of the text as sent. null when none is usable.
 */
function normaliseMatch(raw, item) {
  if (raw === null || raw === undefined) return null;
  const given = Array.isArray(raw) ? {label: raw} : isObject(raw) ? raw : {};
  const label = normaliseRanges(given.label, item.label.length);
  const caption = item.caption ? normaliseRanges(given.caption, item.caption.length) : [];
  if (!label.length && !caption.length) return null;
  return {...(label.length ? {label} : {}), ...(caption.length ? {caption} : {})};
}

/**
 * Where a query stands in a text, folded as filterOptions folds it (case,
 * accents, ё): [[start, end]] in the text's own offsets, the first place
 * only; [] when it is not there.
 */
function matchRanges(text, query, locale) {
  const needle = foldText(query, locale);
  const source = String(text ?? '');
  if (!needle || !source) return [];
  let folded = '';
  const starts = [];
  const ends = [];
  let offset = 0;
  for (const char of source) {
    for (const unit of foldChar(char, locale)) {
      folded += unit;
      starts.push(offset);
      ends.push(offset + char.length);
    }
    offset += char.length;
  }
  const at = folded.indexOf(needle);
  if (at < 0) return [];
  return [[starts[at], ends[at + needle.length - 1]]];
}

function foldChar(char, locale) {
  let lower;
  try {
    lower = char.toLocaleLowerCase(locale || undefined);
  } catch {
    lower = char.toLowerCase();
  }
  return lower.normalize('NFD').replace(/[\u0300-\u036f]/gu, '').replace(/ё/gu, 'е');
}

/** The text cut into plain and matched parts: [{text, match}], in order. */
function splitByRanges(text, ranges) {
  const source = String(text ?? '');
  const parts = [];
  let at = 0;
  for (const [start, end] of ranges ?? []) {
    if (start > at) parts.push({text: source.slice(at, start), match: false});
    parts.push({text: source.slice(start, end), match: true});
    at = end;
  }
  if (at < source.length) parts.push({text: source.slice(at), match: false});
  return parts;
}

/** A list of items: each normalised, the ones without a value and the repeats dropped. */
function normaliseItems(list) {
  const seen = new Set();
  const items = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const item = normaliseItem(raw);
    if (!item || seen.has(keyOf(item.value))) continue;
    seen.add(keyOf(item.value));
    items.push(item);
  }
  return items;
}

function parseMaybeJson(raw) {
  if (typeof raw !== 'string') return raw;
  const text = raw.trim();
  if (!text) return null;
  if (!/^[[{"]/u.test(text)) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * The value as the element holds it: single {value, label, ...} or null;
 * multiple a list in the order chosen, [] when nothing is. Read from a
 * property or from the value attribute (JSON). A bare value (a string or a
 * number) is read against the inline options for its label, as the field
 * renderer reads it; a list given to a single field keeps its first item,
 * one item given to a multiple field is a list of one.
 */
function normaliseValue(raw, {multiple = false, options = []} = {}) {
  const parsed = parseMaybeJson(raw);
  const list = Array.isArray(parsed) ? parsed : present(parsed) ? [parsed] : [];
  const known = normaliseItems(options);
  const items = normaliseItems(list.map((one) => {
    if (isObject(one)) return one;
    if (!present(one)) return null;
    const option = known.find((candidate) => keyOf(candidate.value) === keyOf(one));
    return option ?? {value: one, label: String(one)};
  }));
  if (multiple) return items;
  return items[0] ?? null;
}

/** The chosen items as a list, whatever the mode. */
const chosenList = (value) => (Array.isArray(value) ? value : value ? [value] : []);

/** The values alone, as the form sends them: one entry per chosen item. */
function formEntries(value) {
  return chosenList(value).map((item) => keyOf(item.value));
}

/** Two values are the same when they hold the same values in the same order. */
function sameValue(a, b) {
  const left = formEntries(a);
  const right = formEntries(b);
  return left.length === right.length && left.every((one, index) => one === right[index]);
}

/** The keys of `exclude`: a list of values, or of items carrying them. */
function excludedKeys(exclude) {
  const parsed = parseMaybeJson(exclude);
  const list = Array.isArray(parsed) ? parsed : present(parsed) ? [parsed] : [];
  return new Set(list.map((one) => (isObject(one) ? one.value : one)).filter(present).map(keyOf));
}

/** The items left once the excluded values are taken out (every answer goes through it). */
function withoutExcluded(items, exclude) {
  const keys = exclude instanceof Set ? exclude : excludedKeys(exclude);
  if (!keys.size) return items;
  return items.filter((item) => !keys.has(keyOf(item.value)));
}

/**
 * The inline options a query shows: the label or the caption holds the query,
 * case and accents of the page's language aside. An empty query shows them
 * all: the list in hand is the whole set.
 */
function filterOptions(options, query, {exclude, locale} = {}) {
  const items = withoutExcluded(normaliseItems(options), exclude);
  const needle = foldText(query, locale);
  if (!needle) return items;
  return items.filter((item) => foldText(item.label, locale).includes(needle) || foldText(item.caption ?? '', locale).includes(needle));
}

/** Text compared without case and accents (ё is е, as a Russian reader types it). */
function foldText(text, locale) {
  let lower;
  try {
    lower = String(text ?? '').toLocaleLowerCase(locale || undefined);
  } catch {
    lower = String(text ?? '').toLowerCase();
  }
  return lower.normalize('NFD').replace(/[̀-ͯ]/gu, '').replace(/ё/gu, 'е').trim();
}

/**
 * What a query asks for: 'local' with inline options (searched in place,
 * any length), 'hint' below min-length (nothing is asked), 'search' when the
 * provider is asked, 'none' with neither options nor a provider.
 */
function searchPlan(query, {minLength = DEFAULTS.minLength, hasOptions = false, hasProvider = false} = {}) {
  if (hasOptions) return 'local';
  if (!hasProvider) return 'none';
  return String(query ?? '').trim().length < minLength ? 'hint' : 'search';
}

/**
 * A provider's answer read into the list's state:
 * {status: 'unavailable'} -> unavailable; {items, nextCursor} -> results or
 * empty, the excluded values taken out and at most `limit` items; anything
 * else (no object, items not a list) -> error. `nextCursor` is kept only when
 * it is given: without it there is no "Show more", however many items came.
 */
function readAnswer(answer, {exclude, limit = DEFAULTS.maxResults} = {}) {
  if (!isObject(answer)) return {state: 'error', items: [], nextCursor: null};
  if (answer.status === 'unavailable') return {state: 'unavailable', items: [], nextCursor: null};
  if (!Array.isArray(answer.items)) return {state: 'error', items: [], nextCursor: null};
  const items = withoutExcluded(normaliseItems(answer.items).slice(0, Math.max(0, limit)), exclude);
  const nextCursor = present(answer.nextCursor) ? answer.nextCursor : null;
  const read = {state: items.length || nextCursor !== null ? 'results' : 'empty', items, nextCursor};
  // A line of the host's own under the rows: «first 20 shown, narrow your search».
  const notice = typeof answer.notice === 'string' ? answer.notice.trim() : '';
  return notice ? {...read, notice} : read;
}

/** A page of more results joined to what is shown: in order, no item twice. */
function appendItems(shown, more) {
  const seen = new Set(shown.map((item) => keyOf(item.value)));
  return [...shown, ...more.filter((item) => !seen.has(keyOf(item.value)))];
}

/**
 * A choice: the value it makes and what happened.
 *   single:   the item is the value ('replaced'), or 'unchanged' when it was it;
 *   multiple: a chosen item leaves ('removed'); a new one joins at the end
 *             ('added'), or is 'refused' when max-items are chosen already.
 * `maxItems` 0 is no cap.
 */
function choose(value, raw, {multiple = false, maxItems = 0} = {}) {
  const item = withoutMatch(normaliseItem(raw));
  if (!item) return {value, outcome: 'unchanged'};
  if (!multiple) {
    if (value && keyOf(value.value) === keyOf(item.value)) return {value, outcome: 'unchanged'};
    return {value: item, outcome: 'replaced'};
  }
  const list = chosenList(value);
  if (list.some((one) => keyOf(one.value) === keyOf(item.value))) {
    return {value: list.filter((one) => keyOf(one.value) !== keyOf(item.value)), outcome: 'removed'};
  }
  if (maxItems > 0 && list.length >= maxItems) return {value: list, outcome: 'refused'};
  return {value: [...list, item], outcome: 'added'};
}

/** An item without the ranges of the answer it came in: a value never keeps them. */
function withoutMatch(item) {
  if (!item || !item.match) return item;
  const rest = {...item};
  delete rest.match;
  return rest;
}

// ---------------------------------------------------------------- create

/**
 * What `create` asks for (owner decision C139 (2)): '' off (the attribute
 * absent or "false"), 'email' an address, 'item' anything else.
 */
function createKind(raw) {
  if (raw === null || raw === undefined || raw === false) return '';
  const text = String(raw).trim().toLowerCase();
  if (text === 'false') return '';
  return text === 'email' ? 'email' : 'item';
}

/** A mail address as a person types one: name@host.zone, no spaces or brackets. */
function isEmailAddress(text) {
  return /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(\.[^\s@<>()[\]\\,;:".]+)*\.[^\s@<>()[\]\\,;:".\d]{2,}$/u.test(String(text ?? ''));
}

/**
 * The «Создать «…»» row a query offers, last in the list: {text, kind}, or
 * null -- create off, an empty query, an exact match among the rows or the
 * chosen (label or caption; an address also by value), or a text that is no
 * address when an address is asked for.
 */
function createOffer(query, {kind = '', items = [], chosen = [], locale} = {}) {
  if (!kind) return null;
  const text = String(query ?? '').trim();
  if (!text) return null;
  const needle = foldText(text, locale);
  const same = (item) => [item.label, item.caption, kind === 'email' ? item.value : undefined]
    .some((one) => one !== undefined && one !== null && foldText(String(one), locale) === needle);
  if ([...items, ...chosen].some(same)) return null;
  if (kind === 'email' && !isEmailAddress(text)) return null;
  return {text, kind};
}

/**
 * The host's answer to a create: an item ({value, label, ...}, or {item})
 * becomes {item}; {error: message}, an Error or a string is {error}; anything
 * else is {error: ''} (the field says its own word).
 */
function readCreated(answer) {
  if (answer instanceof Error) return {error: String(answer.message ?? '')};
  if (typeof answer === 'string') return {error: answer};
  if (isObject(answer) && 'error' in answer) return {error: answer.error === true ? '' : String(answer.error ?? '')};
  const item = withoutMatch(normaliseItem(isObject(answer) && isObject(answer.item) ? answer.item : answer));
  return item ? {item} : {error: ''};
}

/** The value without one chosen item (a chip's remove button, Backspace). */
function removeChosen(value, key, {multiple = false} = {}) {
  if (!multiple) return value && keyOf(value.value) === keyOf(key) ? null : value;
  return chosenList(value).filter((one) => keyOf(one.value) !== keyOf(key));
}

/** Whether an item is among the chosen. */
function isChosen(value, item) {
  return chosenList(value).some((one) => keyOf(one.value) === keyOf(item.value));
}

/**
 * The next active row for a key, or -1 for none: ArrowDown and ArrowUp step
 * and stop at the ends, Home and End go to them. From no row, ArrowDown is
 * the first and ArrowUp the last.
 */
function moveActive(index, count, key) {
  if (count <= 0) return -1;
  switch (key) {
    case 'ArrowDown': return index < 0 ? 0 : Math.min(count - 1, index + 1);
    case 'ArrowUp': return index < 0 ? count - 1 : Math.max(0, index - 1);
    case 'Home': return 0;
    case 'End': return count - 1;
    default: return index;
  }
}


/***/ },

/***/ "e99a820fffdb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-input-lookup, generated from component.json \\"aliases\\" by scripts/generate-component-files.mjs; read by core/js/alias-table.js and the shim. Do not edit.","component":"sf-input-lookup","since":"2026-11-03","remove_after":"2027-01-01","aliases":[{"from":"sf-lookup","to":"sf-input-lookup","kind":"tag","component":"sf-input-lookup","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-input-lookup; sf-lookup is a subclass defined beside it until the date"},{"from":"sf-lookup-create","to":"sf-input-lookup-create","kind":"event","component":"sf-input-lookup","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag; the event is new in 1.10.0 (owner decision C139 (2)), its old-tag name kept with the tag\'s until the date"}]}');

/***/ },

/***/ "8bb18691f333"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-lookup","tag":"sf-input-lookup","version":"1.16.1","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"appearance":{"type":"enum","values":["bordered","filled"],"default":"bordered"},"label":{"type":"string","default":""},"placeholder":{"type":"string","default":""},"hint":{"type":"string","default":""},"help":{"type":"string","default":""},"name":{"type":"string","default":""},"multiple":{"type":"boolean","default":false},"chips":{"type":"enum","values":["wrap","row"],"default":"wrap"},"max-items":{"type":"number","default":0},"min-length":{"type":"number","default":2},"suggest":{"type":"boolean","default":false},"max-results":{"type":"number","default":20},"debounce":{"type":"number","default":120},"maxlength":{"type":"number","default":0},"options":{"type":"list","default":[]},"exclude":{"type":"list","default":[]},"provider":{"type":"object","default":null},"create":{"type":"string","default":null},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"object","nullable":true,"default":null}},"events":{"input":{"carries":"native"},"change":{"carries":"native"},"create":{"carries":{"text":{"type":"string"},"kind":{"type":"enum","values":["item","email"]},"respond":{"type":"function"}}}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"css-variables":{"--sf-lookup-background-color":{"type":"color","state":"default"},"--sf-lookup-border-color":{"type":"color","state":"default"},"--sf-lookup-color":{"type":"color","state":"default"},"--sf-lookup-radius":{"type":"length","state":"default"},"--sf-lookup-padding-inline":{"type":"length","state":"default"},"--sf-lookup-padding-block":{"type":"length","state":"default"},"--sf-lookup-invalid-border-color":{"type":"color","state":"invalid"},"--sf-lookup-list-background-color":{"type":"color","state":"open"}}}');

/***/ },

/***/ "d94fcb6a8f59"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Lookup","runtime":{"hint-min-length":{"one":"Type at least {n} character","other":"Type at least {n} characters"},"searching":"Searching…","nothing-found":"Nothing found","unavailable":"Search is unavailable","error":"Search failed","retry":"Retry","show-more":"Show more","max-items":"No more than {n}","remove":"Remove {label}","clear":"Clear","results":{"one":"{n} result","other":"{n} results"},"value-missing":"Choose a value","more-chips":{"one":"{n} more: {names}","other":"{n} more: {names}"},"create-item":"Create «{text}»","create-email":"Add the address {text}","create-error":"Could not create it","chip-position":"{label}, {position} of {total}, Delete to remove","done":"Done","help":"More about: {label}"}}');

/***/ },

/***/ "ea441b000040"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Поиск и выбор","runtime":{"hint-min-length":{"one":"Введите хотя бы {n} символ","few":"Введите хотя бы {n} символа","many":"Введите хотя бы {n} символов","other":"Введите хотя бы {n} символа"},"searching":"Поиск…","nothing-found":"Ничего не найдено","unavailable":"Поиск недоступен","error":"Не удалось выполнить поиск","retry":"Повторить","show-more":"Показать ещё","max-items":"Не больше {n}","remove":"Удалить {label}","clear":"Очистить","results":{"one":"{n} результат","few":"{n} результата","many":"{n} результатов","other":"{n} результата"},"value-missing":"Выберите значение","more-chips":{"one":"Ещё {n}: {names}","few":"Ещё {n}: {names}","many":"Ещё {n}: {names}","other":"Ещё {n}: {names}"},"create-item":"Создать «{text}»","create-email":"Добавить адрес {text}","create-error":"Не удалось создать","chip-position":"{label}, {position} из {total}, Delete — убрать","done":"Готово","help":"Подробнее: {label}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("908b7e4ebbac");
/******/
/******/ })()
;