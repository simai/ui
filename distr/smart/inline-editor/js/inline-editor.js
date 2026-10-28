/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "dc7f7e1860ec"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f0e430451ca1");
/* harmony import */ var _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6b629b4c1b7e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f890c1d3caee");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("81636ab28da1");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("a3dcbb50765a");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("6b5b01c3d7a9");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d4ec85a12cc8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Smart entry for the inline text editor. The loader fetches this bundle when
// the page has an <sf-inline-editor> element; SF.Composition.startInlineEdit
// in Core delegates here once it is loaded.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the carrier is defined over the class core/js/composition/manifest-host.mjs
// makes from it; the edited element sends sf-inline-editor-input, -change and
// -cancel {id, content}, the former sf-inline-edit-* following until
// 2026-12-01.







globalThis.SF = globalThis.SF || {};
globalThis.SF.InlineEditor = Object.freeze({
  INLINE_EVENTS: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_EVENTS,
  INLINE_EVENTS_LEGACY: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_EVENTS_LEGACY,
  readInlineDom: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.readInlineDom,
  renderInlineDom: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.renderInlineDom,
  startInlineEdit: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.startInlineEdit,
  textOffset: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.textOffset
});
(0,_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.defineInlineEditor)(globalThis.customElements, {
  base: (0,_core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__.manifestHost)(_component_json__WEBPACK_IMPORTED_MODULE_2__, {
    lang: {
      en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
      ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
    },
    source: 'ru',
    aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_3__
  })
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d4ec85a12cc8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "892a0da25239"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("aliases", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("aliases", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "f0e430451ca1"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INLINE_EVENTS: () => (/* binding */ INLINE_EVENTS),
/* harmony export */   INLINE_EVENTS_LEGACY: () => (/* binding */ INLINE_EVENTS_LEGACY),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineInlineEditor: () => (/* binding */ defineInlineEditor),
/* harmony export */   readInlineDom: () => (/* binding */ readInlineDom),
/* harmony export */   renderInlineDom: () => (/* binding */ renderInlineDom),
/* harmony export */   startInlineEdit: () => (/* binding */ startInlineEdit),
/* harmony export */   textOffset: () => (/* binding */ textOffset)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e66d878fb4f8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];



// In-place editor for the Composition inline content model. The host starts
// it on a rendered heading or paragraph element; the editor exposes only
// normalized content (never HTML) through events. Cancel restores the exact
// original DOM; commit restores it too and lets the host re-render the saved
// value, so the canvas always returns to host-rendered HTML.

// The names sf-inline-editor's component.json declares (standard 1.3.8 §8,
// vocabulary 1.1.5): input while the text changes, change when it is
// committed, cancel when it is put back -- {id, content}, data only. The
// edited element is the host's, which carries no shim, so each event is
// followed here by its former name with its former detail ({node_id,
// content}) until 2026-12-01.
const INLINE_EVENTS = Object.freeze({
  input: 'sf-inline-editor-input',
  commit: 'sf-inline-editor-change',
  cancel: 'sf-inline-editor-cancel',
});

const INLINE_EVENTS_LEGACY = Object.freeze({
  input: 'sf-inline-edit-input',
  commit: 'sf-inline-edit-commit',
  cancel: 'sf-inline-edit-cancel',
});

function emitInline(element, key, id, content) {
  const detail = content === undefined ? { id } : { id, content };
  const legacy = content === undefined ? { node_id: id } : { node_id: id, content };
  element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS[key], { bubbles: true, composed: true, detail: Object.freeze(detail) }));
  element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS_LEGACY[key], { bubbles: true, composed: true, detail: Object.freeze(legacy) }));
}

const MESSAGES = {
  ru: { toolbar: 'Форматирование', strong: 'Полужирный', em: 'Курсив', code: 'Код', link: 'Ссылка', url: 'Адрес ссылки', apply: 'Применить', unlink: 'Убрать ссылку', editing: '{label}: редактирование. Enter — сохранить, Escape — отменить.', invalid: 'Недопустимый адрес ссылки' },
  en: { toolbar: 'Formatting', strong: 'Bold', em: 'Italic', code: 'Code', link: 'Link', url: 'Link address', apply: 'Apply', unlink: 'Remove link', editing: '{label}: editing. Enter saves, Escape cancels.', invalid: 'Invalid link address' },
};
const SHORTCUTS = { strong: 'b', em: 'i', code: 'e' };
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'HEAD', 'TITLE', 'META', 'LINK', 'IMG', 'SVG', 'OBJECT', 'IFRAME', 'NOSCRIPT']);
const BLOCK = new Set(['P', 'DIV', 'LI', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TR', 'TABLE', 'BLOCKQUOTE', 'SECTION', 'ARTICLE']);
const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
// Words in the page's language through pageText, as every component takes
// them: the editor read <html lang> alone and offered only English or Russian,
// so SF.language.use() and a product's own dictionary never reached it
// (documentation trial, 2026-10-12).
const words = (node) => Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, node, 'sf-inline-editor')]));

/** Reads inline content from any DOM subtree; foreign markup and styles are dropped. */
function readInlineDom(root, { marks = _inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.INLINE_MARKS, links = true, collapse = false } = {}) {
  const segments = [];
  const visit = (node, active, href) => {
    if (node.nodeType === 3) {
      let text = node.nodeValue.replace(/\u00a0/gu, ' ').replace(/[\r\n\t\f\v]/gu, ' ');
      if (collapse) text = text.replace(/ {2,}/gu, ' ');
      if (text) segments.push({ text, marks: [...active], href });
      return;
    }
    if (node.nodeType !== 1 && node.nodeType !== 11) return;
    if (node.nodeType === 1 && SKIP.has(node.tagName.toUpperCase())) return;
    const tag = node.nodeType === 1 ? node.tagName.toUpperCase() : '';
    const next = new Set(active);
    let nextHref = href;
    if (tag === 'STRONG' || tag === 'B') next.add('strong');
    if (tag === 'EM' || tag === 'I') next.add('em');
    if (tag === 'CODE' || tag === 'KBD' || tag === 'SAMP') next.add('code');
    if (node.nodeType === 1 && node.style) {
      const weight = node.style.fontWeight;
      if (weight === 'bold' || weight === 'bolder' || Number(weight) >= 600) next.add('strong');
      if (node.style.fontStyle === 'italic') next.add('em');
    }
    if (tag === 'A' && !href && links) {
      const candidate = node.getAttribute('href');
      if ((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.safeHref)(candidate)) nextHref = candidate;
    }
    if (tag === 'BR') {
      // The placeholder <br> a browser leaves in an emptied editor is not content.
      if (node.parentNode === root && !node.nextSibling) return;
      segments.push({ text: ' ', marks: [...active], href });
      return;
    }
    for (const child of node.childNodes) visit(child, next, nextHref);
    // Nested blocks (pasted paragraphs) are separated by one space; the root is not.
    if (BLOCK.has(tag) && node !== root) segments.push({ text: ' ', marks: [], href: null });
  };
  visit(root, new Set(), null);
  const allowed = new Set(marks);
  let content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.fromSegments)(segments.map((segment) => ({ ...segment, marks: segment.marks.filter((mark) => allowed.has(mark)), href: links ? segment.href : null })));
  if (collapse) {
    const flat = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.toSegments)(content);
    if (flat.length) {
      flat[0] = { ...flat[0], text: flat[0].text.replace(/^ +/u, '') };
      flat[flat.length - 1] = { ...flat.at(-1), text: flat.at(-1).text.replace(/ +$/u, '') };
    }
    content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.fromSegments)(flat);
  }
  return content;
}

/** Renders inline content with the same element nesting as the Framework renderer. */
function renderInlineDom(doc, content) {
  const fragment = doc.createDocumentFragment();
  const run = (entry) => {
    let node = doc.createTextNode(entry.value);
    for (const mark of entry.marks || []) {
      const wrapper = doc.createElement(mark);
      wrapper.append(node);
      node = wrapper;
    }
    return node;
  };
  for (const entry of (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizeInline)(content)) {
    if (entry.type === 'link') {
      const anchor = doc.createElement('a');
      anchor.setAttribute('href', entry.href);
      for (const child of entry.children) anchor.append(run(child));
      fragment.append(anchor);
    } else fragment.append(run(entry));
  }
  return fragment;
}

function textNodes(root) {
  const walker = root.ownerDocument.createTreeWalker(root, 4);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

/** Character offset of a DOM position inside root, counted over text nodes. */
function textOffset(root, container, offset) {
  const range = root.ownerDocument.createRange();
  range.setStart(root, 0);
  range.setEnd(container, offset);
  return range.toString().length;
}

function setSelection(root, start, end = start) {
  const selection = root.ownerDocument.getSelection();
  const nodes = textNodes(root);
  const locate = (offset) => {
    let total = 0;
    for (const node of nodes) {
      if (offset <= total + node.nodeValue.length) return [node, offset - total];
      total += node.nodeValue.length;
    }
    return nodes.length ? [nodes.at(-1), nodes.at(-1).nodeValue.length] : [root, 0];
  };
  const range = root.ownerDocument.createRange();
  const [startNode, startOffset] = locate(start);
  const [endNode, endOffset] = locate(end);
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Starts in-place editing of a rendered heading or paragraph element.
 * options: {content, nodeId, label, marks, links, messages}
 * Returns {commit(), cancel(), value(), element}.
 */
function startInlineEdit(element, options = {}) {
  if (!(element instanceof globalThis.Element)) throw new TypeError('Inline editing needs an element');
  if (element.hasAttribute('data-sf-inline-editing')) throw new TypeError('inline_edit_active');
  const doc = element.ownerDocument;
  const text = { ...words(element), ...(options.messages || {}) };
  const marks = (options.marks || _inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.INLINE_MARKS).filter((mark) => _inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.INLINE_MARKS.includes(mark));
  const links = options.links !== false;
  const original = { html: element.innerHTML, attributes: ['contenteditable', 'role', 'aria-multiline', 'aria-label', 'spellcheck', 'tabindex'].map((name) => [name, element.getAttribute(name)]) };
  const history = [];
  let historyIndex = -1;
  let composing = false;
  let lastTyping = 0;
  let finished = false;
  const connection = new AbortController();
  const signal = { signal: connection.signal };

  const read = () => readInlineDom(element, { marks, links });
  const selectionOffsets = () => {
    const selection = doc.getSelection();
    if (!selection?.rangeCount || !element.contains(selection.anchorNode)) return [(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.inlineText)(read()).length, (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.inlineText)(read()).length];
    const range = selection.getRangeAt(0);
    return [textOffset(element, range.startContainer, range.startOffset), textOffset(element, range.endContainer, range.endOffset)];
  };
  const draw = (content, start, end) => {
    element.replaceChildren(renderInlineDom(doc, content));
    setSelection(element, start, end);
  };
  const snapshot = (merge = false) => {
    const entry = { content: read(), selection: selectionOffsets() };
    if (merge && historyIndex === history.length - 1 && history[historyIndex].typing) history[historyIndex] = { ...entry, typing: true };
    else {
      history.splice(historyIndex + 1);
      history.push({ ...entry, typing: merge });
      historyIndex = history.length - 1;
    }
  };
  const emitInput = () => emitInline(element, 'input', options.nodeId ?? null, read());
  const apply = (content, start, end) => {
    draw(content, start, end);
    snapshot(false);
    emitInput();
    updateToolbar();
  };
  const restore = (index) => {
    historyIndex = index;
    const entry = history[index];
    draw(entry.content, ...entry.selection);
    emitInput();
    updateToolbar();
  };

  // Toolbar ----------------------------------------------------------------
  const toolbar = doc.createElement('div');
  toolbar.className = 'sf-inline-editor-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', text.toolbar);
  const buttons = new Map();
  for (const mark of marks) {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = `sf-inline-editor-button sf-inline-editor-button--${mark}`;
    button.dataset.mark = mark;
    button.textContent = text[mark];
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-keyshortcuts', `Control+${SHORTCUTS[mark].toUpperCase()} Meta+${SHORTCUTS[mark].toUpperCase()}`);
    buttons.set(mark, button);
    toolbar.append(button);
  }
  const linkForm = doc.createElement('div');
  linkForm.className = 'sf-inline-editor-link';
  linkForm.hidden = true;
  const linkInput = doc.createElement('input');
  linkInput.type = 'url';
  linkInput.className = 'sf-inline-editor-url';
  linkInput.setAttribute('aria-label', text.url);
  const linkApply = doc.createElement('button');
  linkApply.type = 'button';
  linkApply.className = 'sf-inline-editor-button';
  linkApply.textContent = text.apply;
  const linkRemove = doc.createElement('button');
  linkRemove.type = 'button';
  linkRemove.className = 'sf-inline-editor-button';
  linkRemove.textContent = text.unlink;
  const linkError = doc.createElement('span');
  linkError.className = 'sf-inline-editor-error';
  linkError.setAttribute('role', 'alert');
  linkForm.append(linkInput, linkApply, linkRemove, linkError);
  if (links) {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'sf-inline-editor-button sf-inline-editor-button--link';
    button.dataset.link = 'toggle';
    button.textContent = text.link;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
    buttons.set('link', button);
    toolbar.append(button, linkForm);
  }
  doc.body.append(toolbar);
  let savedSelection = [0, 0];

  function positionToolbar() {
    const box = element.getBoundingClientRect();
    const bar = toolbar.getBoundingClientRect();
    const rtl = globalThis.getComputedStyle(element).direction === 'rtl';
    const above = box.top - bar.height - 4;
    const top = above >= 0 ? above : Math.min(globalThis.innerHeight - bar.height, box.bottom + 4);
    const start = rtl ? box.right - bar.width : box.left;
    Object.assign(toolbar.style, { top: `${top}px`, left: `${Math.max(0, Math.min(start, globalThis.innerWidth - bar.width))}px` });
  }

  function updateToolbar() {
    const [start, end] = selectionOffsets();
    const state = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.marksIn)(read(), start, end === start ? Math.max(0, start - 1) : end);
    for (const mark of marks) buttons.get(mark).setAttribute('aria-pressed', state.marks.includes(mark) ? 'true' : 'false');
    buttons.get('link')?.setAttribute('aria-pressed', state.href ? 'true' : 'false');
    positionToolbar();
  }

  function toggle(mark) {
    const [start, end] = selectionOffsets();
    if (start === end) return;
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.toggleMark)(read(), start, end, mark), start, end);
  }

  function openLink() {
    savedSelection = selectionOffsets();
    if (savedSelection[0] === savedSelection[1]) return;
    linkForm.hidden = false;
    linkError.textContent = '';
    linkInput.value = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.marksIn)(read(), ...savedSelection).href || '';
    linkInput.focus();
    positionToolbar();
  }

  function closeLink(focusEditor = true) {
    linkForm.hidden = true;
    if (focusEditor) {
      element.focus();
      setSelection(element, ...savedSelection);
    }
  }

  function applyLink(href) {
    if (href !== null && !(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.safeHref)(href)) {
      linkError.textContent = text.invalid;
      linkInput.setAttribute('aria-invalid', 'true');
      return;
    }
    linkInput.removeAttribute('aria-invalid');
    closeLink();
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.setLink)(read(), ...savedSelection, href), ...savedSelection);
  }

  // Lifecycle --------------------------------------------------------------
  function teardown() {
    finished = true;
    connection.abort();
    toolbar.remove();
    element.innerHTML = original.html;
    for (const [name, value] of original.attributes) {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    }
    element.removeAttribute('data-sf-inline-editing');
  }

  function commit() {
    if (finished) return null;
    const content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizeInline)(read());
    teardown();
    emitInline(element, 'commit', options.nodeId ?? null, content);
    return content;
  }

  function cancel() {
    if (finished) return;
    teardown();
    emitInline(element, 'cancel', options.nodeId ?? null);
  }

  // Start ------------------------------------------------------------------
  const initial = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizeInline)(options.content ?? readInlineDom(element, { marks, links }));
  element.setAttribute('data-sf-inline-editing', '');
  element.setAttribute('contenteditable', 'true');
  element.setAttribute('role', 'textbox');
  element.setAttribute('aria-multiline', 'false');
  element.setAttribute('aria-label', format(text.editing, { label: options.label || '' }).replace(/^: /u, ''));
  element.replaceChildren(renderInlineDom(doc, initial));
  element.focus();
  setSelection(element, (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.inlineText)(initial).length);
  history.push({ content: initial, selection: selectionOffsets(), typing: false });
  historyIndex = 0;

  element.addEventListener('beforeinput', (event) => {
    if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
      event.preventDefault();
      if (event.inputType === 'historyUndo' && historyIndex > 0) restore(historyIndex - 1);
      if (event.inputType === 'historyRedo' && historyIndex < history.length - 1) restore(historyIndex + 1);
    } else if (event.inputType === 'insertParagraph' || event.inputType === 'insertLineBreak') {
      event.preventDefault();
    } else if (event.inputType.startsWith('format')) {
      event.preventDefault();
      const mark = { formatBold: 'strong', formatItalic: 'em' }[event.inputType];
      if (mark && marks.includes(mark)) toggle(mark);
    } else if (event.inputType === 'insertFromDrop') {
      event.preventDefault();
    }
  }, signal);
  element.addEventListener('input', () => {
    if (composing) return;
    const now = Date.now();
    snapshot(now - lastTyping < 700);
    lastTyping = now;
    emitInput();
    updateToolbar();
  }, signal);
  element.addEventListener('compositionstart', () => { composing = true; }, signal);
  element.addEventListener('compositionend', () => {
    composing = false;
    snapshot(false);
    emitInput();
  }, signal);
  element.addEventListener('paste', (event) => {
    event.preventDefault();
    const data = event.clipboardData;
    const html = data?.getData('text/html');
    const plain = data?.getData('text/plain') || '';
    const parsed = html
      ? readInlineDom(new globalThis.DOMParser().parseFromString(html, 'text/html').body, { marks, links, collapse: true })
      : [{ type: 'text', value: plain.replace(/\s+/gu, ' ').trim() }];
    const inserted = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.toSegments)(parsed);
    const [start, end] = selectionOffsets();
    const length = inserted.reduce((sum, segment) => sum + segment.text.length, 0);
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.replaceRange)(read(), start, end, inserted), start + length, start + length);
  }, signal);
  element.addEventListener('drop', (event) => event.preventDefault(), signal);
  element.addEventListener('keydown', (event) => {
    if (event.isComposing || composing) return;
    const modifier = event.ctrlKey || event.metaKey;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
    } else if (modifier && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) { if (historyIndex < history.length - 1) restore(historyIndex + 1); } else if (historyIndex > 0) restore(historyIndex - 1);
    } else if (modifier && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      if (historyIndex < history.length - 1) restore(historyIndex + 1);
    } else if (modifier && event.key.toLowerCase() === 'k' && links) {
      event.preventDefault();
      openLink();
    } else if (modifier) {
      const mark = Object.entries(SHORTCUTS).find(([, key]) => key === event.key.toLowerCase())?.[0];
      if (mark && marks.includes(mark)) {
        event.preventDefault();
        toggle(mark);
      }
    }
  }, signal);
  toolbar.addEventListener('mousedown', (event) => {
    // Keep the text selection while pressing toolbar buttons.
    if (event.target.closest('button')) event.preventDefault();
  }, signal);
  toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.mark) toggle(button.dataset.mark);
    else if (button.dataset.link) (linkForm.hidden ? openLink() : closeLink());
    else if (button === linkApply) applyLink(linkInput.value.trim());
    else if (button === linkRemove) applyLink(null);
  }, signal);
  linkInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); applyLink(linkInput.value.trim()); }
    if (event.key === 'Escape') { event.preventDefault(); closeLink(); }
  }, signal);
  const onFocusOut = (event) => {
    const next = event.relatedTarget;
    if (next && (element.contains(next) || toolbar.contains(next))) return;
    // Let a click inside the toolbar land before deciding to commit.
    globalThis.setTimeout(() => {
      if (!finished && !element.contains(doc.activeElement) && !toolbar.contains(doc.activeElement)) commit();
    }, 0);
  };
  element.addEventListener('focusout', onFocusOut, signal);
  toolbar.addEventListener('focusout', onFocusOut, signal);
  doc.addEventListener('selectionchange', () => { if (element.contains(doc.getSelection()?.anchorNode)) updateToolbar(); }, signal);
  globalThis.addEventListener('scroll', positionToolbar, { ...signal, passive: true, capture: true });
  globalThis.addEventListener('resize', positionToolbar, { ...signal, passive: true });
  updateToolbar();

  return Object.freeze({ element, commit, cancel, value: () => (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizeInline)(read()) });
}

/**
 * <sf-inline-editor> is the loadable carrier of the inline editor: placing it
 * on a page lets the Smart loader fetch this code on demand. It renders
 * nothing; edit(element, options) is startInlineEdit.
 */
//
// base: the class made from sf-inline-editor's component.json
// (manifest-host.mjs); without it the carrier is a plain element.
function defineInlineEditor(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-inline-editor');
  if (existing) return existing;
  class SfInlineEditor extends (base || globalThis.HTMLElement) {
    connectedCallback() {
      super.connectedCallback?.();
      this.hidden = true;
    }

    edit(element, options) {
      return startInlineEdit(element, options);
    }
  }
  registry.define('sf-inline-editor', SfInlineEditor);
  return SfInlineEditor;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ INLINE_EVENTS, INLINE_EVENTS_LEGACY, defineInlineEditor, readInlineDom, renderInlineDom, startInlineEdit, textOffset });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e66d878fb4f8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INLINE_LIMITS: () => (/* binding */ INLINE_LIMITS),
/* harmony export */   INLINE_MARKS: () => (/* binding */ INLINE_MARKS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fromSegments: () => (/* binding */ fromSegments),
/* harmony export */   inlineText: () => (/* binding */ inlineText),
/* harmony export */   marksIn: () => (/* binding */ marksIn),
/* harmony export */   normalizeInline: () => (/* binding */ normalizeInline),
/* harmony export */   replaceRange: () => (/* binding */ replaceRange),
/* harmony export */   safeHref: () => (/* binding */ safeHref),
/* harmony export */   setLink: () => (/* binding */ setLink),
/* harmony export */   toSegments: () => (/* binding */ toSegments),
/* harmony export */   toggleMark: () => (/* binding */ toggleMark)
/* harmony export */ });
// Pure operations on the Composition inline content model used by
// content.heading and content.paragraph: text runs with strong, em and code
// marks, and links whose children are text runs. No DOM access here.

const INLINE_MARKS = Object.freeze(['strong', 'em', 'code']);
const MARK_ORDER = new Map(INLINE_MARKS.map((mark, index) => [mark, index]));
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const INLINE_LIMITS = Object.freeze({ maxTextLength: 100000, maxHrefLength: 2048 });

/** Same link rule as Document validation: relative, fragment or http(s)/mailto/tel. */
function safeHref(value) {
  if (typeof value !== 'string' || value.length < 1 || value.length > INLINE_LIMITS.maxHrefLength) return false;
  // Browsers read "/\\host" like "//host": backslashes never form a local link.
  if (/^(?:\/|\.?\.\/|#)/u.test(value)) return !value.startsWith('//') && !value.includes('\\');
  try {
    return SAFE_SCHEMES.has(new globalThis.URL(value).protocol);
  } catch {
    return false;
  }
}

function sortMarks(marks) {
  return [...new Set(marks)].filter((mark) => MARK_ORDER.has(mark)).sort((left, right) => MARK_ORDER.get(left) - MARK_ORDER.get(right));
}

/** Flat segments: {text, marks: string[], href: string|null}. */
function toSegments(content) {
  const segments = [];
  const push = (run, href) => {
    if (run?.type !== 'text' || typeof run.value !== 'string' || !run.value) return;
    segments.push({ text: run.value, marks: sortMarks(Array.isArray(run.marks) ? run.marks : []), href });
  };
  for (const entry of Array.isArray(content) ? content : []) {
    if (entry?.type === 'link') {
      const href = safeHref(entry.href) ? entry.href : null;
      for (const child of Array.isArray(entry.children) ? entry.children : []) push(child, href);
    } else push(entry, null);
  }
  return segments;
}

const sameStyle = (left, right) => left.href === right.href && left.marks.join() === right.marks.join();

/** Builds normalized content: merged runs, canonical marks, no empty parts. */
function fromSegments(segments) {
  const merged = [];
  for (const segment of segments) {
    if (!segment.text) continue;
    const clean = { text: segment.text, marks: sortMarks(segment.marks || []), href: segment.href && safeHref(segment.href) ? segment.href : null };
    const previous = merged.at(-1);
    if (previous && sameStyle(previous, clean)) previous.text += clean.text;
    else merged.push(clean);
  }
  const content = [];
  for (const segment of merged) {
    const run = { type: 'text', value: segment.text, ...(segment.marks.length ? { marks: segment.marks } : {}) };
    const previous = content.at(-1);
    if (segment.href) {
      if (previous?.type === 'link' && previous.href === segment.href) previous.children.push(run);
      else content.push({ type: 'link', href: segment.href, children: [run] });
    } else content.push(run);
  }
  return content;
}

function normalizeInline(content) {
  return fromSegments(toSegments(content));
}

function inlineText(content) {
  return toSegments(content).map(({ text }) => text).join('');
}

function split(segments, offset) {
  const output = [];
  let position = 0;
  for (const segment of segments) {
    const end = position + segment.text.length;
    if (offset > position && offset < end) {
      output.push({ ...segment, text: segment.text.slice(0, offset - position) }, { ...segment, text: segment.text.slice(offset - position) });
    } else output.push(segment);
    position = end;
  }
  return output;
}

function range(content, start, end) {
  const segments = split(split(toSegments(content), start), end);
  let position = 0;
  return segments.map((segment) => {
    const from = position;
    position += segment.text.length;
    return { segment, inside: from >= start && position <= end && position > from };
  });
}

/** Marks and link shared by every character in [start, end). */
function marksIn(content, start, end) {
  const inside = range(content, Math.min(start, end), Math.max(start, end)).filter(({ inside: isInside }) => isInside).map(({ segment }) => segment);
  if (!inside.length) return { marks: [], href: null };
  const marks = INLINE_MARKS.filter((mark) => inside.every((segment) => segment.marks.includes(mark)));
  const href = inside.every((segment) => segment.href === inside[0].href) ? inside[0].href : null;
  return { marks, href };
}

/** Adds the mark to [start, end) unless every character already has it. */
function toggleMark(content, start, end, mark) {
  if (!MARK_ORDER.has(mark) || start === end) return normalizeInline(content);
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  const remove = marksIn(content, from, to).marks.includes(mark);
  return fromSegments(range(content, from, to).map(({ segment, inside }) => (inside
    ? { ...segment, marks: remove ? segment.marks.filter((entry) => entry !== mark) : [...segment.marks, mark] }
    : segment)));
}

/** Sets or removes (href null) a link on [start, end); unsafe links are refused. */
function setLink(content, start, end, href) {
  if (href !== null && !safeHref(href)) throw new TypeError('inline_link_unsafe');
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  if (from === to) return normalizeInline(content);
  return fromSegments(range(content, from, to).map(({ segment, inside }) => (inside ? { ...segment, href } : segment)));
}

/** Replaces [start, end) with segments (typing, paste or deletion). */
function replaceRange(content, start, end, inserted) {
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  const parts = range(content, from, to);
  const before = parts.filter((_, index) => parts.slice(0, index + 1).reduce((sum, part) => sum + part.segment.text.length, 0) <= from).map(({ segment }) => segment);
  let consumed = 0;
  const after = [];
  for (const { segment } of parts) {
    const segmentStart = consumed;
    consumed += segment.text.length;
    if (segmentStart >= to) after.push(segment);
  }
  return fromSegments([...before, ...inserted, ...after]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ INLINE_MARKS, fromSegments, inlineText, marksIn, normalizeInline, replaceRange, safeHref, setLink, toSegments, toggleMark });


/***/ },

/***/ "6b629b4c1b7e"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   manifestHost: () => (/* binding */ manifestHost)
/* harmony export */ });
/* harmony import */ var _element_manifest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("892a0da25239");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__, _aliases_js__WEBPACK_IMPORTED_MODULE_1__]);
([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__, _aliases_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The editors' elements from their manifests (standard simai.smart-component
// 1.3.8 §3, §4, §8, §16.20).
//
// sf-sortable, sf-inline-editor and sf-composition-overlay are plain custom
// elements defined by the composition modules (core/js/composition): the
// overlay's bundle carries the drag module too, and a page may define them
// before any Smart base is loaded. They draw nothing through the Smart base
// and keep their own lifecycle. What the manifest gives every component --
// the settings' attributes and properties, sfEmit through the dated aliases,
// sfWord, the declared actions -- they take from elementFromManifest over a
// plain base that answers the two callbacks the generated class calls and
// installs the component's aliases.json once the element is placed.
//
//   const base = manifestHost(manifest, {lang: {en, ru}, source: 'ru', aliases});
//   defineSortable(registry, {base});



function manifestHost(manifest, options = {}) {
  const Html = globalThis.HTMLElement;
  if (typeof Html !== 'function') return null;

  class PlainHost extends Html {
    connectedCallback() {
      // Static markup printed for the first paint (standard 1.3.8 §5.4) goes
      // as the element connects: these elements draw in the same task.
      if (!this.__sfFirstPaintEnded) {
        this.__sfFirstPaintEnded = true;
        for (const child of Array.from(this.children)) {
          if (child.hasAttribute('data-sf-static') && !child.hasAttribute('slot')) child.remove();
          else child.removeAttribute('data-sf-held');
        }
        this.removeAttribute('data-sf-first-paint');
      }
      // Installed once and kept while the element is detached, as the Smart
      // base does: a page that moves the element keeps its old names.
      if (this.constructor.aliases && !this.__sfAliases) {
        this.__sfAliases = (0,_aliases_js__WEBPACK_IMPORTED_MODULE_1__.installAliases)(this, this.constructor.aliases, {
          tag: this.localName,
          adapters: this.sfAliasAdapters?.() ?? {},
        });
      }
    }

    disconnectedCallback() {}

    // The generated actions read the instance's scope (§7.7); a plain host's
    // ends when the page removes it.
    get sfScope() {
      if (!this.__sfScope || (this.__sfScope.signal.aborted && this.isConnected)) this.__sfScope = new AbortController();
      return this.__sfScope.signal;
    }
  }

  return (0,_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__.elementFromManifest)(manifest, { ...options, base: PlainHost });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ manifestHost });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "81636ab28da1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-inline-editor for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired. These events are sent on the edited element, which carries no shim: core/js/composition/inline-editor.mjs sends each former name itself, with its former detail.","component":"sf-inline-editor","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-inline-edit-input","to":"sf-inline-editor-input","kind":"event","component":"sf-inline-editor","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-input","to":"input"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id, content}"},{"from":"sf-inline-edit-commit","to":"sf-inline-editor-change","kind":"event","component":"sf-inline-editor","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-commit","to":"change"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id, content}"},{"from":"sf-inline-edit-cancel","to":"sf-inline-editor-cancel","kind":"event","component":"sf-inline-editor","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-cancel","to":"cancel"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id}"}]}');

/***/ },

/***/ "f890c1d3caee"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.inline-editor","tag":"sf-inline-editor","version":"1.1.2","kind":"leaf","settings":{},"values":{},"events":{"input":{"carries":{"id":{"type":"string","nullable":true},"content":{"type":"list","of":{"type":"string","value":"string","marks":"list","href":"string"}}},"x-native":false},"change":{"carries":{"id":{"type":"string","nullable":true},"content":{"type":"list","of":{"type":"string","value":"string","marks":"list","href":"string"}}},"x-native":false},"cancel":{"carries":{"id":{"type":"string","nullable":true}}}},"actions":{"edit":{"with":{"element":"object","options":"object"}}},"css-variables":{"--sf-inline-editor-outline-color":{"type":"color","state":"editing"},"--sf-inline-editor-toolbar-background-color":{"type":"color","state":"editing"},"--sf-inline-editor-toolbar-radius":{"type":"length","state":"editing"},"--sf-inline-editor-toolbar-gap":{"type":"length","state":"editing"},"--sf-inline-editor-toolbar-padding":{"type":"length","state":"editing"}}}');

/***/ },

/***/ "a3dcbb50765a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Inline editor","runtime":{"apply":"Apply","code":"Code","editing":"{label}: editing. Enter saves, Escape cancels.","em":"Italic","invalid":"Invalid link address","link":"Link","strong":"Bold","toolbar":"Formatting","unlink":"Remove link","url":"Link address"}}');

/***/ },

/***/ "6b5b01c3d7a9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Редактор текста на холсте","runtime":{"apply":"Применить","code":"Код","editing":"{label}: редактирование. Enter — сохранить, Escape — отменить.","em":"Курсив","invalid":"Недопустимый адрес ссылки","link":"Ссылка","strong":"Полужирный","toolbar":"Форматирование","unlink":"Убрать ссылку","url":"Адрес ссылки"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("dc7f7e1860ec");
/******/
/******/ })()
;