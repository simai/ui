/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e081a020262e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyText: () => (/* binding */ copyText),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Copying text, with the fallback (reuse audit 2026-11-02, finding 11). The
// clipboard class component and sf-copy-button each wrote this, and
// chat-message a third time; the order is theirs: the Clipboard API on a
// secure page, and execCommand('copy') over a hidden field where the API is
// absent or refused. A secure page whose clipboard permission is denied -- a
// policy, an embedded frame, a browser that asked and was answered no -- has
// the API and still refuses it; reading "present" as "allowed" left the
// fallback that exists for exactly this unreached (component/clipboard,
// 2026-10).

/**
 * Copies `text`. Settles with how it was copied, 'native' or 'legacy', or
 * rejects: Error('copy_unsupported') when the fallback copied nothing, or the
 * platform's own error (NotAllowedError, SecurityError) when it threw.
 * `document` is the document whose body holds the fallback field: the
 * element's own, for a component in another frame.
 */
async function copyText(text, {
  document: documentRef = globalThis.document
} = {}) {
  const value = String(text ?? '');
  const view = documentRef?.defaultView ?? globalThis;

  if (view.isSecureContext && view.navigator?.clipboard?.writeText) {
    try {
      await view.navigator.clipboard.writeText(value);
      return 'native';
    } catch {// Refused: the fallback is for exactly this.
    }
  }

  if (!documentRef?.body || typeof documentRef.execCommand !== 'function') throw new Error('copy_unsupported');
  const area = documentRef.createElement('textarea'); // The class is the clipboard component's (its sheet hides it); the inline
  // style keeps the field out of sight on a page without that sheet.

  area.className = 'sf-clipboard-fallback';
  area.value = value;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;inset-inline-start:-9999px;inset-block-start:0;opacity:0';
  documentRef.body.append(area);
  area.select(); // iOS selects nothing on select() alone.

  area.setSelectionRange?.(0, value.length);
  let copied = false;

  try {
    copied = documentRef.execCommand('copy');
  } finally {
    area.remove();
  }

  if (!copied) throw new Error('copy_unsupported');
  return 'legacy';
} // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it. SF.Clipboard (capital C)
// is the clipboard component's script API; this is the bare function.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.copyText) globalThis.SF.copyText = copyText;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copyText);

/***/ },

/***/ "1446153b1a96"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DURATION: () => (/* binding */ DURATION),
/* harmony export */   SOURCE_ERRORS: () => (/* binding */ SOURCE_ERRORS),
/* harmony export */   WORDS: () => (/* binding */ WORDS),
/* harmony export */   copyFeedback: () => (/* binding */ copyFeedback),
/* harmony export */   copyKeys: () => (/* binding */ copyKeys),
/* harmony export */   copyWord: () => (/* binding */ copyWord),
/* harmony export */   createCopyFeedback: () => (/* binding */ createCopyFeedback),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   readCopyText: () => (/* binding */ readCopyText),
/* harmony export */   selectCopySource: () => (/* binding */ selectCopySource)
/* harmony export */ });
/* harmony import */ var _clipboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e081a020262e");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_1__);
// What a copy says (owner decision C48, 2026-11-11): one feedback for every
// control that copies -- sf-button-copy, and any <button>, sf-button or
// sf-button-icon that carries data-sf-copy or data-sf-copy-target (the
// clipboard component's attribute route). Beside SF.copyText, which copies,
// this says how it went:
//
// - copied: the phase is success for two seconds (the icon a check), and the
//   word "Скопировано" is said politely;
// - refused by the browser (a policy, an embedded frame, a denied permission):
//   the source is selected -- a field's value, an element's text, or the value
//   itself in a hidden holder -- and the words say which keys copy it
//   ("Выделено — нажмите Ctrl+C"), so the copy is never simply lost;
// - nothing to copy (no source, a missing target, two sources): the phase is
//   error and the words say it could not copy.
//
// The helper keeps the phase, the timer and the words; the control draws them
// (sf-button-copy in its template, the attribute route in the page's markup).
// Core cannot import a Smart component's files, so the words are written here
// as sf-button-copy ships them and are read through the page's language under
// that component's name (a product that registers words for sf-button-copy is
// heard here too); tests/inline-code.contract.test.mjs and
// tests/copy-feedback.contract.test.mjs hold them equal to its language files.


const WORDS = {
  en: {
    copy: 'Copy',
    copied: 'Copied',
    failed: 'Could not copy',
    selected: 'Selected — press {keys}'
  },
  ru: {
    copy: 'Копировать',
    copied: 'Скопировано',
    failed: 'Не удалось скопировать',
    selected: 'Выделено — нажмите {keys}'
  }
};
/** How long a result stays, in ms, unless the control says otherwise. */

const DURATION = 2000;
/** The failures that are the source's, not the browser's: nothing is selected for them. */

const SOURCE_ERRORS = new Set(['ambiguous_source', 'empty_source', 'missing_source', 'missing_target']);
const HOLDER_STYLE = 'position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';

const isField = (element, View) => Boolean(element) && (View.HTMLInputElement && element instanceof View.HTMLInputElement || View.HTMLTextAreaElement && element instanceof View.HTMLTextAreaElement); // The keys copy what the button would have copied (acceptance L3,
// 2026-11-11): a selected element gives the browser its drawn text, and a
// numbered code block draws an empty line as a space, so the keys copied a
// space where the button copies an empty line. While the selection is the
// one made here, the copy event is given the text instead. One listener per
// document, on the document itself, so every bundle's copy of this module
// shares it.


function keepCopyText(doc, range, text) {
  doc.__sfCopySelection = {
    range,
    text
  };
  if (doc.__sfCopyListener) return;

  doc.__sfCopyListener = event => {
    const held = doc.__sfCopySelection;
    const selection = doc.defaultView?.getSelection?.();
    if (!held || !selection?.rangeCount) return;
    const now = selection.getRangeAt(0);
    const same = now.startContainer === held.range.startContainer && now.startOffset === held.range.startOffset && now.endContainer === held.range.endContainer && now.endOffset === held.range.endOffset;

    if (!same) {
      doc.__sfCopySelection = null;
      return;
    }

    event.clipboardData?.setData('text/plain', held.text);
    event.preventDefault();
  };

  doc.addEventListener('copy', doc.__sfCopyListener, true);
} // One result at a time on the page (acceptance L4): two neighbouring controls
// that fail within the result's two seconds drew their words on top of each
// other, both held to the window's edge. A control that shows a result tells
// the one before it to stop. On the page's SF, so every bundle shares it.


function takeResult(owner) {
  const SF = globalThis.SF = globalThis.SF || {};
  const before = SF.__copyResult;
  SF.__copyResult = owner;
  if (before && before !== owner) before.reset();
}

function leaveResult(owner) {
  if (globalThis.SF?.__copyResult === owner) globalThis.SF.__copyResult = null;
}
/** The keys that copy a selection on this platform. */


function copyKeys() {
  return /Mac|iPhone|iPad/u.test(globalThis.navigator?.platform ?? globalThis.navigator?.userAgent ?? '') ? '⌘C' : 'Ctrl+C';
}
/** A copy word in the language of `node` (sf-button-copy's words). */

function copyWord(key, node, vars) {
  return (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(WORDS, key, node, {
    component: 'sf-button-copy',
    source: 'ru',
    vars
  });
}
/**
 * The text an element gives to copy, whole: a field's value; a numbered code
 * block's code, one line per row and none of the numbers (Highlight
 * data-lines); else the element's text.
 */

function readCopyText(element) {
  if (!element) return '';
  const View = element.ownerDocument?.defaultView ?? globalThis;
  if (View.HTMLInputElement && element instanceof View.HTMLInputElement || View.HTMLTextAreaElement && element instanceof View.HTMLTextAreaElement) return element.value;
  const rows = element.querySelectorAll?.(':scope .sf-code-lines > .sf-code-line > .sf-code-line__content'); // An empty line is drawn as a space so its row keeps a height; it copies empty.

  if (rows?.length) return Array.from(rows, row => row.textContent === ' ' ? '' : row.textContent).join('\n');
  return element.textContent ?? '';
}
/**
 * Selects what was to be copied, so the person can press the keys: the field
 * (focused and selected), the element's contents, or -- for a value with no
 * element on the page -- `text` in a hidden holder inside `host`.
 */

function selectCopySource(element, {
  text = '',
  host = null,
  holderClass = 'sf-copy-holder',
  document: doc = element?.ownerDocument ?? host?.ownerDocument ?? globalThis.document
} = {}) {
  const View = doc?.defaultView ?? globalThis;

  if (isField(element, View)) {
    element.focus();
    element.select();
    return element;
  }

  const selection = View.getSelection?.();
  if (!selection || !doc) return null;
  let node = element;

  if (!node) {
    if (!host || !text) return null;
    node = [...host.children].find(child => child.classList?.contains(holderClass));

    if (!node) {
      node = doc.createElement('span');
      node.className = holderClass;
      node.style.cssText = HOLDER_STYLE;
      host.append(node);
    }

    node.textContent = text;
  }

  selection.removeAllRanges();
  const range = doc.createRange();
  range.selectNodeContents(node);
  selection.addRange(range);
  keepCopyText(doc, range, element ? readCopyText(element) : text);
  return node;
}
/**
 * One control's feedback. `onPhase(phase, message)` is told every change:
 * pending, success, error, and idle again after `duration` ms (a number or a
 * function answering one). `run()` copies and settles with the outcome:
 * {outcome: 'applied', text, method} or {outcome: 'refused', reason, error},
 * the reason one of SOURCE_ERRORS, 'denied' or 'busy'.
 */

function createCopyFeedback({
  onPhase = () => {},
  duration = DURATION
} = {}) {
  let timer = null;
  let pending = false;
  let api = null;

  const lasting = () => {
    const value = Number(typeof duration === 'function' ? duration() : duration);
    return Number.isFinite(value) && value >= 0 ? value : DURATION;
  };

  const set = (phase, message = '') => {
    clearTimeout(timer);
    timer = null;
    if (phase === 'success' || phase === 'error') takeResult(api);else if (phase === 'idle') leaveResult(api);
    onPhase(phase, message);

    if (phase === 'success' || phase === 'error') {
      timer = setTimeout(() => {
        timer = null;
        leaveResult(api);
        onPhase('idle', '');
      }, lasting());
    }
  };

  api = {
    get pending() {
      return pending;
    },

    /**
     * `read()` answers the text (or throws a SOURCE_ERRORS code); `element()`
     * answers the element to select on a refusal, or null; `host` holds the
     * hidden holder for a value; `node` is where the language is read;
     * `words(key, vars)` overrides the words, `messages` the copied and failed
     * text a control was given.
     */
    async run({
      read,
      element = () => null,
      host = null,
      holderClass,
      node = host,
      document: doc,
      words,
      messages = {}
    } = {}) {
      if (pending) return {
        outcome: 'refused',
        reason: 'busy'
      };
      pending = true;

      const say = words || ((key, vars) => copyWord(key, node, vars)); // The control the press came from: a refusal selects the source, and a
      // selection outside the focused control took the focus to the page, so
      // the next Tab started again at the top (acceptance M2).


      const page = doc ?? node?.ownerDocument ?? host?.ownerDocument ?? globalThis.document;
      const pressed = page?.activeElement && page.activeElement !== page.body ? page.activeElement : null;
      set('pending', '');
      let text = '';

      try {
        text = String(read?.() ?? '');
        if (!text) throw new Error('empty_source');
        const method = await (0,_clipboard_js__WEBPACK_IMPORTED_MODULE_0__.copyText)(text, {
          document: doc ?? node?.ownerDocument ?? globalThis.document
        });
        set('success', messages.copied || say('copied'));
        return {
          outcome: 'applied',
          text,
          method
        };
      } catch (error) {
        if (SOURCE_ERRORS.has(error?.message)) {
          set('error', messages.failed || say('failed'));
          return {
            outcome: 'refused',
            reason: error.message,
            error
          };
        } // Refused by the browser: the source is selected, so the keys copy it.


        const selected = selectCopySource(element?.() ?? null, {
          text,
          host,
          holderClass,
          document: doc
        }); // A field takes the focus to be copied from; anything else gives it
        // back to the control, the selection staying (the keys still copy it).

        const View = page?.defaultView ?? globalThis;
        if (pressed?.isConnected && !isField(selected, View) && page.activeElement !== pressed) pressed.focus({
          preventScroll: true
        });
        set('error', say('selected', {
          keys: copyKeys()
        }));
        return {
          outcome: 'refused',
          reason: 'denied',
          error
        };
      } finally {
        pending = false;
      }
    },

    /** Back to idle now, without waiting for the timer. */
    reset() {
      set('idle', '');
    },

    /** Stops the timer (the control is going away). */
    cancel() {
      clearTimeout(timer);
      timer = null;
      leaveResult(api);
    }

  };
  return api;
}
const copyFeedback = {
  create: createCopyFeedback,
  readText: readCopyText,
  select: selectCopySource,
  words: copyWord
}; // Core publishes it; a bundle that carries its own copy reuses the published one.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.copyFeedback) globalThis.SF.copyFeedback = copyFeedback;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCopyFeedback);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f28a9d913ce0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated from the `tag` rows of src/smart/*/aliases.json and the element_aliases of
// src/core/contracts/packages/*.package.json by scripts/tag-alias-table.mjs; do not edit.
// The dated tag aliases of the Framework and of its component packages, read by core/js/tag-aliases.js.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze([Object.freeze({
  from: 'sf-avatars',
  to: 'sf-avatar-group',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-button-group',
  to: 'sf-segmented',
  since: '2026-11-08',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-change-confirm',
  to: 'sf-confirm-change',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-close',
  to: 'sf-button-close',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-code-input',
  to: 'sf-input-code',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-color',
  to: 'sf-input-color',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-composition-overlay',
  to: 'sf-editor-overlay',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-content-editor',
  to: 'sf-editor-content',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-context-menu',
  to: 'sf-menu-context',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-copy-button',
  to: 'sf-button-copy',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-country-code',
  to: 'sf-input-country',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-data-view',
  to: 'sf-view',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-datepicker',
  to: 'sf-input-date',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-download-file',
  to: 'sf-file-download',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-icon-button',
  to: 'sf-button-icon',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-image-field',
  to: 'sf-input-image',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-inline-editor',
  to: 'sf-editor-inline',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-lookup',
  to: 'sf-input-lookup',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-page-header',
  to: 'sf-header-page',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-property-view',
  to: 'sf-view-properties',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-quantity',
  to: 'sf-input-quantity',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-range-slider',
  to: 'sf-slider-range',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-rich-text',
  to: 'sf-input-rich',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-site-header',
  to: 'sf-header-site',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-table',
  to: 'sf-view-table',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01'
})]));

/***/ },

/***/ "4a85acfb05c1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonicalTag: () => (/* binding */ canonicalTag),
/* harmony export */   defineTagAliases: () => (/* binding */ defineTagAliases),
/* harmony export */   isTag: () => (/* binding */ isTag),
/* harmony export */   listTagAliases: () => (/* binding */ listTagAliases),
/* harmony export */   noteTagAlias: () => (/* binding */ noteTagAlias),
/* harmony export */   registerTagAliasRows: () => (/* binding */ registerTagAliasRows),
/* harmony export */   registerTagAliases: () => (/* binding */ registerTagAliases),
/* harmony export */   tagNames: () => (/* binding */ tagNames),
/* harmony export */   tagSelector: () => (/* binding */ tagSelector)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5dcef5de40cf");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__]);
([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alias_table_js__WEBPACK_IMPORTED_MODULE_1__);
// Dated tag aliases (rename plan R0, ui-control RENAME-PLAN-2026-11-03; change
// lifecycle: contracts/changes/journal.json, kind "tag"). When a Smart
// component takes a new tag, the old tag keeps working until its
// `remove_after` day:
//
// - Definition. defineTagAliases(Class, tag) defines each old tag as a trivial
//   subclass of the class that defines the new one (the Smart base calls it
//   from define()). The Loader's rule lists the old tag beside the new one, so
//   markup with the old tag alone loads the bundle.
// - Note. The first old-tag element a page connects is noted in
//   SF.deprecations (kind "tag") and named once on the console with the new tag
//   and the date, whatever the page opted into: an element name is the most
//   visible thing a page writes, and the old one is going.
// - Script. Code that finds a renamed element by name asks for both names
//   through one helper instead of a literal:
//
//     import {tagSelector, isTag} from '../../core/js/smart-base';
//     host.querySelector(`.sf-tag > ${tagSelector('sf-button-close')}`);
//     if (isTag(node, 'sf-button-close')) ...
//
// - Sheets. A selector that names the new tag names the old one beside it in
//   source, `:is(sf-button-close, sf-close)`, for as long as the alias lives
//   (scripts/rename-smart-tag.mjs writes it, --sweep takes it out; the
//   contract test tests/tag-aliases.contract.test.mjs holds both).
//
// The aliases are a static table (tag-aliases.generated.js, written by
// scripts/tag-alias-table.mjs from every component's aliases.json and from the
// element_aliases of the component package references,
// contracts/packages/*.package.json), so a lookup finds an old tag before the
// renamed component's bundle has run, a package's (sf-table, rename plan R2)
// as well as the Framework's. A package's component adds its rows again when it
// is defined, which matters only for a package the pair does not reference. Every copy of this
// module shares one state on the page (a global symbol); the Smart bundles
// reach it through the shared runtime (smart-base re-exports it).



const STATE = Symbol.for('simai.sf.tag-aliases');

function state() {
  if (!globalThis[STATE]) {
    const shared = {
      byOld: new Map(),
      byNew: new Map(),
      noted: new Set()
    };
    Object.defineProperty(globalThis, STATE, {
      value: shared,
      configurable: true
    });

    for (const row of _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__["default"]) addRow(shared, row);
  }

  return globalThis[STATE];
}

function addRow(shared, row) {
  if (shared.byOld.has(row.from)) return;
  shared.byOld.set(row.from, row);
  shared.byNew.set(row.to, [...(shared.byNew.get(row.to) ?? []), row.from]);
} // Rows from a component's aliases.json (its `tag` rows); the Framework's are
// already known, a package's are added here.


function registerTagAliases(table, tag) {
  const {
    rows
  } = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readTagAliases)(table, {
    tag
  });
  const shared = state();

  for (const row of rows) addRow(shared, row);

  return rows;
} // Rows a component set gives at runtime (SF.RuleLoader.registerPackage(name,
// {aliases})): {from, to, since, remove_after}, the set's own former tags, so
// SIMAI Framework needs no table row for a set it does not know. Answers the
// rows taken; a row whose old tag is already known keeps the first.

function registerTagAliasRows(rows) {
  const shared = state();
  const taken = [];

  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row.from !== 'string' || typeof row.to !== 'string') continue;
    if (shared.byOld.has(row.from)) continue;
    const clean = Object.freeze({
      from: row.from,
      to: row.to,
      since: String(row.since ?? ''),
      remove_after: String(row.remove_after ?? '')
    });
    addRow(shared, clean);
    taken.push(clean);
  }

  return taken;
} // The open old names of a tag, its own first: ['sf-button-close', 'sf-close'].

function tagNames(tag) {
  const name = String(tag || '').toLowerCase();
  return [name, ...(state().byNew.get(name) ?? [])];
} // A selector for the tag that matches its old names too:
// ':is(sf-button-close, sf-close)', or the tag itself when it has none.

function tagSelector(tag) {
  const names = tagNames(tag);
  return names.length > 1 ? `:is(${names.join(', ')})` : names[0];
} // Whether an element is the tag, under its own or an old name.

function isTag(element, tag) {
  const name = element?.localName;
  return Boolean(name) && tagNames(tag).includes(name);
} // The current name of a tag: 'sf-button-close' for 'sf-close'. An old tag the
// page still has as an element of its own stays itself: a component package
// built before its rename (rules naming sf-table alone) beside a pair whose
// table already knows the new name, where the new tag would never upgrade.

function canonicalTag(tag) {
  const name = String(tag || '').toLowerCase();
  const row = state().byOld.get(name);
  if (!row) return name;
  const own = globalThis.customElements?.get?.(name);
  if (own && !own.sfTagAliasOf) return name;
  let rules = null;

  try {
    rules = globalThis.SF?.Loader?.getCustomElementRules?.() ?? null;
  } catch {
    rules = null;
  }

  if (rules && rules[name] && !rules[row.to]) return name;
  return row.to;
} // Every open row: [{from, to, since, remove_after}].

function listTagAliases() {
  return [...state().byOld.values()].map(row => ({ ...row
  }));
} // The page met an element under an old name: once per old tag.

function noteTagAlias(row) {
  const shared = state();
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row);
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.to,
    kind: 'tag',
    from: row.from,
    to: row.to,
    tag: row.to,
    since: row.since,
    remove_after: row.remove_after,
    expired
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return;
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>. See contracts/changes/journal.json.`);
} // Defines each old tag of `tag` as a subclass of `Base` (the class that
// defines `tag`), through `define(name, Class)`: the Smart base passes its
// definition queue, so both names are defined in the same batch. Returns the
// rows defined.

function defineTagAliases(Base, tag, {
  table = Base?.aliases,
  define
} = {}) {
  if (table) registerTagAliases(table, tag);
  const rows = (state().byNew.get(tag) ?? []).map(from => state().byOld.get(from));
  const registry = globalThis.customElements;
  const defined = [];

  for (const row of rows) {
    if (!registry || registry.get(row.from)) continue;

    class TagAlias extends Base {
      connectedCallback() {
        noteTagAlias(row);
        super.connectedCallback?.();
      }

    }

    Object.defineProperty(TagAlias, 'sfTagAliasOf', {
      value: row.to
    });
    (define ?? ((name, Class) => registry.define(name, Class)))(row.from, TagAlias);
    defined.push(row);
  }

  return defined;
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {}; // For scripts that are not Smart bundles (class components, a page):
  // SF.tags.selector('sf-button-close').

  if (!globalThis.SF.tags) {
    globalThis.SF.tags = Object.freeze({
      names: tagNames,
      selector: tagSelector,
      is: isTag,
      canonical: canonicalTag,
      list: listTagAliases
    });
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "604c3ec2da2d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_copy_feedback_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1446153b1a96");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("64feefebb417");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("4a6d31f10418");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("7eee0ce1da86");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("95fd5a964f9f");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("6cfb20b5910e");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("f4e4ea0915ae");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("0276298b5863");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_copy_feedback_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_copy_feedback_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_4__);
// sf-button-copy: copies a value and says so (owner-approved assignment,
// 2026-10-14). The icon turns to a check for a moment and the result is
// announced politely; when the browser refuses the clipboard (an embedded
// frame, a policy), the source is selected instead and the person is told to
// press Ctrl+C, so the copy is never simply lost.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the settings are made by core/js/element-manifest.js; copy is the action
// and answers an outcome; the facts are sf-button-copy-copied and
// sf-button-copy-copy-failed (sf-copy-button-* until 2027-01-01), the old sf-copy and sf-copy-error their dated
// aliases (aliases.json); the words are the language files'.

 // The copy and what it says are core's (core/js/copy-feedback.js over
// SF.copyText; decision C48, 2026-11-11), shared with the attribute route
// data-sf-copy of the clipboard component: one phase, timer and set of words.











 // Prefer the placement helper Core published; an isolated bundle uses its own copy.

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default());

const CopyButtonElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__,
  actions: {
    copy() {
      return this.runCopy();
    }

  }
});

class SfCopyButton extends CopyButtonElement {
  constructor() {
    super();
    this.state = {
      phase: 'idle',
      message: ''
    };
    this._feedback = (0,_core_js_copy_feedback_js__WEBPACK_IMPORTED_MODULE_2__.createCopyFeedback)({
      duration: () => this.duration,
      onPhase: (phase, message) => {
        this.state = {
          phase,
          message
        };
        this.requestComponentUpdate('phase');
      }
    });
  } // An absent duration is two seconds: read as Number(null) it was zero, and
  // the result was gone before anyone could hear it. A negative one is too.


  get duration() {
    const raw = this.getAttribute('duration');
    const value = Number(raw);
    return raw !== null && raw !== '' && Number.isFinite(value) && value >= 0 ? value : 2000;
  }

  set duration(next) {
    super.duration = next;
  }

  words(key, vars) {
    return this.sfWord(key, vars ? {
      vars
    } : {});
  }

  sourceElement() {
    const id = this.target.trim();
    if (!/^#[A-Za-z][\w:.-]*$/u.test(id)) return null;
    return this.ownerDocument.getElementById(id.slice(1));
  } // What is copied: the value, or the target's -- an input's value, an
  // element's text, a numbered code block's code without its numbers.


  source() {
    const hasValue = this.hasAttribute('value');
    const hasTarget = Boolean(this.target.trim());
    if (hasValue && hasTarget) throw new Error('ambiguous_source');
    if (hasValue) return this.value;
    if (!hasTarget) throw new Error('empty_source');
    const element = this.sourceElement();
    if (!element) throw new Error('missing_target');
    return (0,_core_js_copy_feedback_js__WEBPACK_IMPORTED_MODULE_2__.readCopyText)(element);
  } // The action copy (component.json): the generated method calls this and
  // answers its outcome; the press of the template calls the method.


  async runCopy() {
    const result = await this._feedback.run({
      read: () => this.source(),
      // Refused by the browser: the target is selected, or the value in a
      // hidden holder inside the host, so the person can copy it.
      element: () => this.sourceElement(),
      host: this,
      holderClass: 'sf-copy-button-holder',
      document: this.ownerDocument,
      words: (key, vars) => this.words(key, vars),
      messages: {
        copied: this.successText,
        failed: this.errorText
      }
    });

    if (result.outcome === 'applied') {
      this.sfEmit('copied', {
        text: result.text,
        method: result.method
      });
      return {
        outcome: 'applied',
        text: result.text,
        method: result.method
      };
    }

    if (result.reason === 'busy') return {
      outcome: 'refused',
      reason: 'busy'
    }; // The event's codes: the source's own, else denied (a refusal or no clipboard).

    const code = ['empty_source', 'missing_target', 'ambiguous_source'].includes(result.reason) ? result.reason : 'denied';
    this.sfEmit('copy-failed', {
      code
    });
    return {
      outcome: 'refused',
      reason: code
    };
  }

  disconnectedCallback() {
    this._feedback.cancel();

    this.stopResult();
    super.disconnectedCallback?.();
  } // The result glyphs are asked for with the first drawing, not when they are
  // first drawn: an icon the subset has not got draws nothing until a second
  // font arrives, and the error glyph came about a second after a refusal
  // (docs pre-check, copy anatomy finding 7).


  afterRender() {
    super.afterRender?.();
    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.preloadControlIcons)(this, [this.successIcon || 'check', 'error']);
    this.placeResult();
  } // The failed copy's words, shown above the control (the template draws the
  // surface; this places it with SF.Position while it shows, and lets it go).


  placeResult() {
    const result = this.querySelector(':scope .sf-copy-button-result'); // The drawn control, under its current tag or an old one in its window.

    const hosts = [(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-button'), (0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-button-icon')].join(', ');
    const control = this.querySelector(`:scope .sf-copy-button > :is(${hosts})`)?.querySelector('.sf-button, .sf-icon-button');

    if (!result || result.hidden || !control) {
      this.stopResult();
      return;
    }

    if (this._result?.box === result) return;
    this.stopResult();
    const placed = positioning().anchor(control, result, {
      side: 'block-start',
      align: 'center',
      fitHeight: false
    });
    this._result = {
      box: result,
      placed
    };
  }

  stopResult() {
    this._result?.placed?.stop?.();
    this._result = null;
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      size: this.size,
      appearance: this.appearance,
      text: this.text,
      icon: this.icon,
      successIcon: this.successIcon,
      // The name says what is copied when the host says so.
      name: this.label || this.text || this.words('copy'),
      nameTooltipId: (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_4__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_4__.instancePath)(this, {
        kind: 'sf-button-copy'
      }), 'name'),
      phase: this.state.phase,
      message: this.state.message,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderCopyButtonTemplate)(this.templateContext());
  }

}

SfCopyButton.define('sf-button-copy');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4a6d31f10418"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCopyButtonTemplate: () => (/* binding */ renderCopyButtonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The plain tooltip of the Framework (component.tooltip, class markup): the
// inverse surface at the small text step. Two of them stand beside the
// control, inside one .sf-tooltip-anchor:
// - the name, on an icon-only button: the tooltip controller shows it on hover
//   and on keyboard focus, and hides it on a press and on Escape (it was the
//   browser's title: hover only, late, the browser's look);
// - the result, while a copy has failed: the words the status says ("Выделено
//   -- нажмите Ctrl+C") shown above the control for the result's duration, so a
//   sighted person reads them too. The status still says them; the surface is
//   aria-hidden so they are not heard twice. The component places it
//   (SF.Position) and shows it; no controller owns it.

function surface(className, text, {
  id,
  hidden,
  ariaHidden
} = {}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${id || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} class=${`sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 ${className}`}
      aria-hidden=${ariaHidden ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} ?hidden=${hidden}><span class="sf-tooltip-content"><span class="sf-tooltip-text">${text}</span></span></span>`;
}

function renderCopyButtonTemplate(context) {
  const icon = {
    success: context.successIcon,
    error: 'error'
  }[context.phase] ?? context.icon; // The glyph is the quiet neutral (decision C15): on-surface-variant, which
  // darkens under the pointer. ghost is the look without a fill; link, its
  // former name, reaches here as ghost (the alias shim rewrites it).

  const common = {
    size: context.size,
    appearance: context.appearance === 'link' ? 'ghost' : context.appearance,
    scheme: 'on-surface-variant'
  };
  const showResult = context.phase === 'error' && Boolean(context.message); // The root style is the control's: the wrapper only frames the control and
  // its status, so a host styling the button reaches it.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class=${['sf-copy-button', 'sf-tooltip-anchor', `sf-copy-button--${context.phase}`, context.rootClass].filter(Boolean).join(' ')}>
      ${context.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${common.size} appearance=${common.appearance} scheme=${common.scheme}
                 icon-start=${icon} text=${context.text} aria-label=${context.name}
                 root-style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 aria-disabled=${context.phase === 'pending' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 @click=${() => context.component.copy()}></sf-button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon size=${common.size} appearance=${common.appearance} scheme=${common.scheme}
                 icon=${icon} aria-label=${context.name} data-tooltip=${context.nameTooltipId}
                 root-style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 aria-disabled=${context.phase === 'pending' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 @click=${() => context.component.copy()}></sf-button-icon>`}
      ${context.text ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : surface('sf-copy-button-name', context.name, {
    id: context.nameTooltipId,
    hidden: true
  })}
      ${surface('sf-copy-button-result', showResult ? context.message : '', {
    hidden: !showResult,
    ariaHidden: true
  })}
      <span class="sf-copy-button-status" role="status" aria-live="polite" aria-atomic="true">${context.message}</span>
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "64feefebb417"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ICONS: () => (/* binding */ THEME_ICONS),
/* harmony export */   cycleItems: () => (/* binding */ cycleItems),
/* harmony export */   cycleState: () => (/* binding */ cycleState),
/* harmony export */   hasCycle: () => (/* binding */ hasCycle),
/* harmony export */   loaderOwnsTheme: () => (/* binding */ loaderOwnsTheme),
/* harmony export */   nextTheme: () => (/* binding */ nextTheme),
/* harmony export */   parseCycle: () => (/* binding */ parseCycle),
/* harmony export */   preloadControlIcons: () => (/* binding */ preloadControlIcons),
/* harmony export */   preloadSwitchIcons: () => (/* binding */ preloadSwitchIcons),
/* harmony export */   pressCycle: () => (/* binding */ pressCycle),
/* harmony export */   switchIconEntries: () => (/* binding */ switchIconEntries),
/* harmony export */   themeCycleFollow: () => (/* binding */ themeCycleFollow),
/* harmony export */   themeCycleValues: () => (/* binding */ themeCycleValues),
/* harmony export */   themePreference: () => (/* binding */ themePreference),
/* harmony export */   visibleTheme: () => (/* binding */ visibleTheme),
/* harmony export */   warnCycleToggle: () => (/* binding */ warnCycleToggle),
/* harmony export */   warnThemeNotOwned: () => (/* binding */ warnThemeNotOwned)
/* harmony export */ });
// One button, several values (docs review R039, owner decision D11d;
// research ui-control control/research/2026-11-08-cycle-button.md).
//
// sf-button and sf-button-icon share this: the `cycle` setting is a list of
// items shaped like sf-segmented's items ({value, label, icon} and an
// optional `pressed`, which draws the item with the pressed look), `value`
// is the current item, and a press moves to the next item and wraps. The
// `theme-cycle` setting draws a ready theme switch over SF.Loader's theme
// (the same contract as sf-segmented's theme-switch: themePreference,
// setTheme, sf-theme-change).
//
// The name and the icon say the current value («Тема: тёмная»), the tooltip
// says the current and the next («Тема: тёмная. Нажмите — как в системе»),
// and a polite live region says the new value after a press. A cycle is a
// plain button: it carries no aria-pressed, so pressed, label-pressed and
// text-pressed are ignored beside it (with one console warning).
const THEME_VALUES = ['system', 'light', 'dark']; // «Как в системе» in a cycle is the half-dark, half-light circle (D11d): a
// monitor alone does not say a theme.

const THEME_ICONS = Object.freeze({
  system: 'contrast',
  light: 'light_mode',
  dark: 'dark_mode'
});

function parseList(source) {
  if (Array.isArray(source)) return source;
  const text = String(source ?? '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  } // value::label::flags|… as sf-segmented's items take it; a flag icon=<name>
  // names the icon, pressed draws the pressed look.


  return text.split('|').map(entry => {
    const [value, label = value, flags = ''] = entry.split('::');
    const list = flags.split(',').map(flag => flag.trim()).filter(Boolean);
    const icon = list.find(flag => flag.startsWith('icon='));
    return {
      value: value.trim(),
      label: label.trim(),
      icon: icon ? icon.slice(5) : '',
      pressed: list.includes('pressed')
    };
  });
}
/** The cycle's items, normalised: a value each, once, in the given order. */

/** Reads the attribute's JSON or value::label::flags form; a list stays a list. */


function parseCycle(value) {
  return parseList(value);
}
function cycleItems(source) {
  const seen = new Set();
  return parseList(source).map((item, index) => {
    const one = typeof item === 'string' ? {
      value: item,
      label: item
    } : item;
    if (!one || typeof one !== 'object') return null;
    const value = String(one.value ?? one.id ?? index).trim();
    if (!value || seen.has(value)) return null;
    seen.add(value);
    return {
      value,
      label: String(one.label ?? one.text ?? value),
      icon: String(one.icon || ''),
      lang: String(one.lang || '').trim(),
      pressed: Boolean(one.pressed)
    };
  }).filter(Boolean);
}
/** The themes a theme-cycle offers: all three, or the two it names. */

function themeCycleValues(attribute) {
  const named = String(attribute ?? '').trim().toLowerCase().split(/[\s,]+/u).map(word => word === 'auto' ? 'system' : word).filter(word => THEME_VALUES.includes(word));
  const unique = [...new Set(named)]; // Two themes without «as the system» flip the visible theme; anything else
  // (empty, one word, all three) is the full cycle.

  if (unique.length === 2 && !unique.includes('system')) return ['light', 'dark'];
  return THEME_VALUES;
}

const opposite = theme => theme === 'dark' ? 'light' : 'dark';

function loader() {
  return globalThis.SF?.Loader;
}
/**
 * False when the page's host draws the theme itself and started the Loader
 * with `theme: false` (SF_BOOT_CONFIG.theme): the Loader then neither reads
 * nor sets a theme, and its `theme` stays at the value it began with.
 */


function loaderOwnsTheme() {
  return loader()?.themeEnabled !== false;
}
/**
 * The theme drawn now (light or dark), whatever the preference. The Loader's
 * own value counts only while the Loader owns the theme; under a host that
 * owns it (R076: a Docara example frame) the document says what is drawn.
 */

function visibleTheme() {
  const theme = loaderOwnsTheme() ? loader()?.theme : undefined;
  if (theme === 'dark' || theme === 'light') return theme;
  const root = globalThis.document?.documentElement;
  if (root?.classList?.contains('theme-dark')) return 'dark';
  if (root?.classList?.contains('theme-light')) return 'light';
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}
/** What the person chose: system, light or dark. */

function themePreference() {
  const preference = loader()?.themePreference;
  return THEME_VALUES.includes(preference) ? preference : 'system';
}
/**
 * The owner's order (D11d): first the theme opposite to the visible one,
 * then the other, then «as the system». It needs the value before the
 * current one: from an explicit theme reached from the other explicit theme
 * the next is system; from system, or from a theme the page loaded with, the
 * opposite theme. Two themes: always the opposite of the visible theme.
 */

function nextTheme({
  values,
  current,
  previous
}) {
  if (!values.includes('system')) return opposite(visibleTheme());
  if (current === 'system') return opposite(visibleTheme());
  if (previous && previous !== 'system' && previous === opposite(current)) return 'system';
  return opposite(current);
}
/**
 * The cycle state the template reads: {items, item, next, index, name,
 * tooltip}. `words(key, vars)` gives the element's words; `base` is the
 * button's own name (aria-label, or the text of an sf-button).
 */

function hasCycle(host) {
  if (host.hasAttribute('theme-cycle')) return true;
  const own = host.getProp?.('cycle');
  return Boolean(host.hasAttribute('cycle') || Array.isArray(own) && own.length);
}
function cycleState(host, {
  base = '',
  words
}) {
  if (host.hasAttribute('theme-cycle')) {
    const values = themeCycleValues(host.getAttribute('theme-cycle'));
    const two = !values.includes('system');
    const current = two ? visibleTheme() : themePreference();

    const label = value => words(`theme-${value}`);

    const items = values.map(value => ({
      value,
      label: label(value),
      icon: THEME_ICONS[value],
      lang: '',
      pressed: false
    }));
    const item = items.find(one => one.value === current) ?? items[0];
    const nextValue = nextTheme({
      values,
      current: item.value,
      previous: host.__sfCyclePrevious
    });
    const next = items.find(one => one.value === nextValue) ?? items[0];
    const title = base || words('theme');
    const now = item.value === 'system' ? words('theme-system-now', {
      vars: {
        theme: label(visibleTheme())
      }
    }) : item.label;
    const name = `${title}: ${now}`;
    return {
      theme: true,
      items,
      item,
      next,
      name,
      tooltip: words('cycle-next', {
        vars: {
          name,
          next: next.label
        }
      })
    };
  }

  const items = cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle'));
  if (!items.length) return null;
  const at = Math.max(0, items.findIndex(one => one.value === (host.getAttribute('value') ?? '')));
  const item = items[at];
  const next = items[(at + 1) % items.length];
  const name = base ? `${base}: ${item.label}` : item.label;
  return {
    theme: false,
    items,
    item,
    next,
    name,
    tooltip: words('cycle-next', {
      vars: {
        name,
        next: next.label
      }
    })
  };
}
/** A cycle beside a toggle's settings: the toggle's are ignored, said once. */

function warnCycleToggle(host, names) {
  const given = names.filter(name => host.hasAttribute(name));
  if (!given.length || host.__sfCycleWarned) return;
  host.__sfCycleWarned = true;
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName}: cycle and theme-cycle are not toggles; ${given.join(', ')} ignored.`);
}
/**
 * A theme cycle whose press cannot move the theme says why, once per
 * element (R076): a host that owns the theme (the Loader started with
 * `theme: false`), or no Loader at all. The button stays where it is and
 * sends no change.
 */

function warnThemeNotOwned(host) {
  if (host.__sfThemeWarned) return;
  host.__sfThemeWarned = true;
  const reason = loader() ? 'the page\'s theme belongs to its host (the Loader runs with theme: false); a host that hands the theme to the Loader makes it work (a Docara example: theme_switch=true)' : 'SF.Loader is absent';
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName} theme-cycle: the press changes nothing: ${reason}.`);
}
/**
 * A person's press of a cycle: the next value, the change event and the
 * announcement. Answers true when it moved.
 */

function pressCycle(host, state) {
  if (!state) return false;
  const previous = state.item.value;
  const value = state.next.value; // Said after the drawing that follows: the flag first, as the drawing may
  // come at once.

  const before = host.__sfCyclePrevious;
  host.__sfCycleAnnounce = true;
  host.__sfCyclePrevious = previous;

  if (state.theme) {
    // The Loader moves the page first, so a listener of change finds the
    // page in the theme it chose; a Loader that cannot (absent, or the
    // theme switched off) leaves the cycle where it is.
    host.__sfCycleExpect = value;

    if (loader()?.setTheme?.(value) !== true) {
      warnThemeNotOwned(host);
      host.__sfCycleAnnounce = false;
      host.__sfCyclePrevious = before;
      host.__sfCycleExpect = undefined;
      return false;
    }
  } else {
    host.setAttribute('value', value);
  }

  host.requestComponentUpdate?.('value');
  const item = state.items.find(one => one.value === value) ?? null;
  host.sfEmit('change', {
    previous,
    value,
    item: item ? { ...item
    } : null
  });
  return true;
}
/**
 * sf-theme-change for a theme cycle: a theme set elsewhere (another switch,
 * SF.Loader.setTheme) starts the order afresh from what is shown.
 */

function themeCycleFollow(host) {
  if (!host.hasAttribute('theme-cycle')) return;
  const values = themeCycleValues(host.getAttribute('theme-cycle'));
  const now = values.includes('system') ? themePreference() : visibleTheme();
  if (host.__sfCycleExpect !== now) host.__sfCyclePrevious = undefined;
  host.__sfCycleExpect = undefined;
  host.requestComponentUpdate?.('theme-cycle');
} // The icons a control can switch to, asked for before it switches (R074).
// Only the icon on screen was tracked, so the first press that showed another
// one asked the subset service for a grown font on the click, and the new
// icon stayed blank while the service built it (up to ~30 s when it was busy).
// Asked for when the control is drawn, the names join the page's first icon
// request (held until the Loader is ready); a control added later costs one
// grown font off the click.

/**
 * The icon entries ({icon, filled}) a cycle, a theme cycle or a toggle can
 * show. `icons` are a toggle's own icon names: with `pressed` present they
 * are drawn filled while on, so both forms are asked for. `filled` is the
 * control's own filled setting (every form filled).
 */

function switchIconEntries(host, {
  icons = [],
  filled = false
} = {}) {
  const entries = [];

  const add = (icon, fill) => {
    const name = String(icon || '').trim();
    if (name) entries.push({
      icon: name,
      filled: Boolean(fill || filled)
    });
  };

  if (host.hasAttribute('theme-cycle')) {
    themeCycleValues(host.getAttribute('theme-cycle')).forEach(value => add(THEME_ICONS[value], false));
  } else if (hasCycle(host)) {
    cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle')).forEach(item => add(item.icon, item.pressed));
  } else if (host.hasAttribute('pressed')) {
    icons.forEach(icon => {
      add(icon, false);
      add(icon, true);
    });
  }

  const seen = new Set();
  return entries.filter(entry => {
    const key = `${entry.icon}|${entry.filled}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
/**
 * Asks the Loader for these icon entries once per distinct list (a render
 * that draws the same items asks nothing). Answers the number of new names.
 */

function preloadControlIcons(host, entries) {
  if (!Array.isArray(entries) || !entries.length) return 0;
  const key = JSON.stringify(entries);
  if (host.__sfPreloadedIcons === key) return 0;
  const preload = loader()?.preloadIcons;
  if (typeof preload !== 'function') return 0;
  host.__sfPreloadedIcons = key;
  return preload.call(loader(), entries) || 0;
}
/** switchIconEntries, asked for. */

function preloadSwitchIcons(host, options = {}) {
  return preloadControlIcons(host, switchIconEntries(host, options));
}

/***/ },

/***/ "0276298b5863"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5dcef5de40cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("alias-table", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("alias-table", 1).then(resolve, reject), { once: true })));

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

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

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

/***/ "95fd5a964f9f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-button-copy for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-button-copy","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-copy","to":"sf-copy-button-copied","kind":"event","component":"sf-button-copy","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-copy","to":"sf-copy-button-copied"},"section":"§8, vocabulary 1.1.5 §5.1"},{"from":"sf-copy-error","to":"sf-copy-button-copy-failed","kind":"event","component":"sf-button-copy","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-copy-error","to":"sf-copy-button-copy-failed"},"section":"§8, vocabulary 1.1.5 §5.1"},{"from":"sf-copy-button","to":"sf-button-copy","kind":"tag","component":"sf-button-copy","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-button-copy; sf-copy-button is a subclass defined beside it until the date"},{"from":"sf-copy-button-copied","to":"sf-button-copy-copied","kind":"event","component":"sf-button-copy","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-copy-button-copy-failed","to":"sf-button-copy-copy-failed","kind":"event","component":"sf-button-copy","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"link","to":"ghost","kind":"value","setting":"appearance","component":"sf-button-copy","since":"2026-11-09","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-button-copy-link-to-ghost (decision C15): ghost is the name, link its former one; they drew the same"}]}');

/***/ },

/***/ "7eee0ce1da86"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.button-copy","tag":"sf-button-copy","version":"1.4.0","kind":"leaf","settings":{"value":{"type":"string","default":""},"target":{"type":"string","default":""},"text":{"type":"string","default":""},"label":{"type":"string","default":""},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1","x-scale":"control"},"appearance":{"type":"enum","values":["ghost","outline","tonal"],"default":"ghost"},"icon":{"type":"icon","default":"content_copy"},"success-icon":{"type":"icon","default":"check"},"success-text":{"type":"string","default":""},"error-text":{"type":"string","default":""},"duration":{"type":"number","integer":true,"min":0,"default":2000}},"values":{},"events":{"copied":{"carries":{"text":"string","method":{"type":"enum","values":["native","legacy"]}},"own-verb":true},"copy-failed":{"carries":{"code":{"type":"enum","values":["empty_source","missing_target","ambiguous_source","denied"]}},"own-verb":true}},"actions":{"copy":{"waits":true}},"css-variables":{"--sf-copy-button-display":{"type":"keyword","state":"default"},"--sf-copy-button-vertical-align":{"type":"keyword","state":"default"},"--sf-copy-button-pending-opacity":{"type":"number","state":"pending"},"--sf-copy-button-success-color":{"type":"color","state":"success"},"--sf-copy-button-error-color":{"type":"color","state":"error"}}}');

/***/ },

/***/ "6cfb20b5910e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Copy button","runtime":{"copied":"Copied","copy":"Copy","failed":"Could not copy","selected":"Selected — press {keys}"},"events":{"copied":{"label":"Copied"},"copy-failed":{"label":"Could not copy"}}}');

/***/ },

/***/ "f4e4ea0915ae"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Кнопка копирования","runtime":{"copied":"Скопировано","copy":"Копировать","failed":"Не удалось скопировать","selected":"Выделено — нажмите {keys}"},"events":{"copied":{"label":"Скопировано"},"copy-failed":{"label":"Не удалось скопировать"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("604c3ec2da2d");
/******/
/******/ })()
;