/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "d4ec85a12cc8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "f0e430451ca1"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INLINE_EVENTS: () => (/* binding */ INLINE_EVENTS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineInlineEditor: () => (/* binding */ defineInlineEditor),
/* harmony export */   readInlineDom: () => (/* binding */ readInlineDom),
/* harmony export */   renderInlineDom: () => (/* binding */ renderInlineDom),
/* harmony export */   startInlineEdit: () => (/* binding */ startInlineEdit),
/* harmony export */   textOffset: () => (/* binding */ textOffset)
/* harmony export */ });
/* harmony import */ var _inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e66d878fb4f8");


// In-place editor for the Composition inline content model. The host starts
// it on a rendered heading or paragraph element; the editor exposes only
// normalized content (never HTML) through events. Cancel restores the exact
// original DOM; commit restores it too and lets the host re-render the saved
// value, so the canvas always returns to host-rendered HTML.

const INLINE_EVENTS = Object.freeze({
  input: 'sf-inline-edit-input',
  commit: 'sf-inline-edit-commit',
  cancel: 'sf-inline-edit-cancel',
});

const MESSAGES = {
  ru: { toolbar: 'Форматирование', strong: 'Полужирный', em: 'Курсив', code: 'Код', link: 'Ссылка', url: 'Адрес ссылки', apply: 'Применить', unlink: 'Убрать ссылку', editing: '{label}: редактирование. Enter — сохранить, Escape — отменить.', invalid: 'Недопустимый адрес ссылки' },
  en: { toolbar: 'Formatting', strong: 'Bold', em: 'Italic', code: 'Code', link: 'Link', url: 'Link address', apply: 'Apply', unlink: 'Remove link', editing: '{label}: editing. Enter saves, Escape cancels.', invalid: 'Invalid link address' },
};
const SHORTCUTS = { strong: 'b', em: 'i', code: 'e' };
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'HEAD', 'TITLE', 'META', 'LINK', 'IMG', 'SVG', 'OBJECT', 'IFRAME', 'NOSCRIPT']);
const BLOCK = new Set(['P', 'DIV', 'LI', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TR', 'TABLE', 'BLOCKQUOTE', 'SECTION', 'ARTICLE']);
const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
const lang = () => ((globalThis.document?.documentElement.lang || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en');

/** Reads inline content from any DOM subtree; foreign markup and styles are dropped. */
function readInlineDom(root, { marks = _inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_MARKS, links = true, collapse = false } = {}) {
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
      if ((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.safeHref)(candidate)) nextHref = candidate;
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
  let content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.fromSegments)(segments.map((segment) => ({ ...segment, marks: segment.marks.filter((mark) => allowed.has(mark)), href: links ? segment.href : null })));
  if (collapse) {
    const flat = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.toSegments)(content);
    if (flat.length) {
      flat[0] = { ...flat[0], text: flat[0].text.replace(/^ +/u, '') };
      flat[flat.length - 1] = { ...flat.at(-1), text: flat.at(-1).text.replace(/ +$/u, '') };
    }
    content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.fromSegments)(flat);
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
  for (const entry of (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.normalizeInline)(content)) {
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
  const text = { ...MESSAGES[lang()], ...(options.messages || {}) };
  const marks = (options.marks || _inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_MARKS).filter((mark) => _inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_MARKS.includes(mark));
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
    if (!selection?.rangeCount || !element.contains(selection.anchorNode)) return [(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.inlineText)(read()).length, (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.inlineText)(read()).length];
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
  const emitInput = () => element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS.input, { bubbles: true, composed: true, detail: Object.freeze({ node_id: options.nodeId ?? null, content: read() }) }));
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
    const state = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.marksIn)(read(), start, end === start ? Math.max(0, start - 1) : end);
    for (const mark of marks) buttons.get(mark).setAttribute('aria-pressed', state.marks.includes(mark) ? 'true' : 'false');
    buttons.get('link')?.setAttribute('aria-pressed', state.href ? 'true' : 'false');
    positionToolbar();
  }

  function toggle(mark) {
    const [start, end] = selectionOffsets();
    if (start === end) return;
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.toggleMark)(read(), start, end, mark), start, end);
  }

  function openLink() {
    savedSelection = selectionOffsets();
    if (savedSelection[0] === savedSelection[1]) return;
    linkForm.hidden = false;
    linkError.textContent = '';
    linkInput.value = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.marksIn)(read(), ...savedSelection).href || '';
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
    if (href !== null && !(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.safeHref)(href)) {
      linkError.textContent = text.invalid;
      linkInput.setAttribute('aria-invalid', 'true');
      return;
    }
    linkInput.removeAttribute('aria-invalid');
    closeLink();
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.setLink)(read(), ...savedSelection, href), ...savedSelection);
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
    const content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.normalizeInline)(read());
    teardown();
    element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS.commit, { bubbles: true, composed: true, detail: Object.freeze({ node_id: options.nodeId ?? null, content }) }));
    return content;
  }

  function cancel() {
    if (finished) return;
    teardown();
    element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS.cancel, { bubbles: true, composed: true, detail: Object.freeze({ node_id: options.nodeId ?? null }) }));
  }

  // Start ------------------------------------------------------------------
  const initial = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.normalizeInline)(options.content ?? readInlineDom(element, { marks, links }));
  element.setAttribute('data-sf-inline-editing', '');
  element.setAttribute('contenteditable', 'true');
  element.setAttribute('role', 'textbox');
  element.setAttribute('aria-multiline', 'false');
  element.setAttribute('aria-label', format(text.editing, { label: options.label || '' }).replace(/^: /u, ''));
  element.replaceChildren(renderInlineDom(doc, initial));
  element.focus();
  setSelection(element, (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.inlineText)(initial).length);
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
    const inserted = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.toSegments)(parsed);
    const [start, end] = selectionOffsets();
    const length = inserted.reduce((sum, segment) => sum + segment.text.length, 0);
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.replaceRange)(read(), start, end, inserted), start + length, start + length);
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

  return Object.freeze({ element, commit, cancel, value: () => (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_0__.normalizeInline)(read()) });
}

/**
 * <sf-inline-editor> is the loadable carrier of the inline editor: placing it
 * on a page lets the Smart loader fetch this code on demand. It renders
 * nothing; edit(element, options) is startInlineEdit.
 */
function defineInlineEditor(registry = globalThis.customElements) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-inline-editor');
  if (existing) return existing;
  class SfInlineEditor extends globalThis.HTMLElement {
    connectedCallback() {
      this.hidden = true;
    }

    edit(element, options) {
      return startInlineEdit(element, options);
    }
  }
  registry.define('sf-inline-editor', SfInlineEditor);
  return SfInlineEditor;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ INLINE_EVENTS, defineInlineEditor, readInlineDom, renderInlineDom, startInlineEdit, textOffset });


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
/* harmony import */ var _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f0e430451ca1");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d4ec85a12cc8");
// Smart entry for the inline text editor. The loader fetches this bundle when
// the page has an <sf-inline-editor> element; SF.Composition.startInlineEdit
// in Core delegates here once it is loaded.


globalThis.SF = globalThis.SF || {};
globalThis.SF.InlineEditor = Object.freeze({
  INLINE_EVENTS: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_EVENTS,
  readInlineDom: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.readInlineDom,
  renderInlineDom: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.renderInlineDom,
  startInlineEdit: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.startInlineEdit,
  textOffset: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.textOffset
});
(0,_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.defineInlineEditor)();
})();

/******/ })()
;