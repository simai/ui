/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "39863f24c52d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   highlightAllLazy: () => (/* binding */ highlightAllLazy),
/* harmony export */   highlightBlock: () => (/* binding */ highlightBlock),
/* harmony export */   lineNumbersEnabled: () => (/* binding */ lineNumbersEnabled),
/* harmony export */   normalizeLanguage: () => (/* binding */ normalizeLanguage),
/* harmony export */   refresh: () => (/* binding */ refresh),
/* harmony export */   requestedLanguage: () => (/* binding */ requestedLanguage)
/* harmony export */ });
/* harmony import */ var _line_numbers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c67f05508e63");
/* harmony import */ var _languages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8e4e61390880");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8489d1f5bab4");



 // Every word this part says. A product adds a language with
// SF.language.register('sf-highlight', code, words); a ternary on «ru» allowed two
// and no more.

const HIGHLIGHT_TEXT = {
  en: {
    copy: 'Copy code',
    copied: 'Code copied'
  },
  ru: {
    copy: 'Копировать код',
    copied: 'Код скопирован'
  }
};
const CODE_SELECTOR = 'pre code';
const ROOT_SELECTOR = '.sf-highlight, .source';
const CHROME_MODES = new Set(['auto', 'none', 'static']);
const highlightedNodes = new WeakSet();
const sourceText = new WeakMap();
const plugins = [];
const supportedLanguages = new Set(_languages__WEBPACK_IMPORTED_MODULE_1__.AVAILABLE_LANGUAGES);
const languageAliases = { ..._languages__WEBPACK_IMPORTED_MODULE_1__.LANGUAGE_ALIASES
};
let codeId = 0;

function normalizeLanguage(language) {
  const normalized = String(language || '').trim().toLowerCase();
  return languageAliases[normalized] || normalized;
}

function requestedLanguage(block) {
  const className = [...block.classList].find(name => /^(?:language|lang)-/.test(name));
  return String(block.dataset.lang || className?.replace(/^(?:language|lang)-/, '') || '').trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[character]);
}

const KEYWORDS = new Set(['as', 'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'of', 'return', 'static', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'undefined', 'var', 'void', 'while', 'yield', 'echo', 'public', 'private', 'protected', 'fn', 'def', 'pass', 'elif', 'fi', 'then', 'select', 'insert', 'update', 'where', 'and', 'or', 'not', 'into', 'values']);

function tokenClass(token) {
  if (/^\/\//.test(token) || /^\/\*/.test(token) || /^#(?![0-9a-f]{3,8}\b)/i.test(token)) return 'comment';
  if (/^['"`]/.test(token)) return 'string';
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(token)) return 'number';
  if (KEYWORDS.has(token.toLowerCase())) return 'keyword';
  return '';
}

function highlightSource(source, language) {
  if (language === 'plaintext') return escapeHtml(source);
  const pattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|-?(?:\d+\.?\d*|\.\d+)|[A-Za-z_$][\w$-]*)/g;
  let output = '';
  let cursor = 0;

  for (const match of String(source).matchAll(pattern)) {
    output += escapeHtml(source.slice(cursor, match.index));
    const token = match[0];
    const kind = tokenClass(token);
    output += kind ? `<span class="hljs-${kind}">${escapeHtml(token)}</span>` : escapeHtml(token);
    cursor = match.index + token.length;
  }

  return output + escapeHtml(source.slice(cursor));
}

const hljs = {
  componentName: 'hljs',

  addPlugin(plugin) {
    plugins.push(plugin);
  },

  getLanguage(language) {
    return supportedLanguages.has(normalizeLanguage(language));
  },

  registerAliases(aliases, {
    languageName
  }) {
    aliases.forEach(alias => {
      languageAliases[alias] = languageName;
    });
  },

  registerLanguage(language) {
    supportedLanguages.add(normalizeLanguage(language));
  },

  highlight(source, {
    language = 'plaintext'
  } = {}) {
    const normalized = normalizeLanguage(language);
    return {
      language: normalized,
      relevance: 0,
      value: highlightSource(source, normalized)
    };
  },

  highlightElement(element) {
    const language = normalizeLanguage(requestedLanguage(element) || 'plaintext');
    plugins.forEach(plugin => plugin['before:highlightElement']?.({
      el: element
    }));
    const result = this.highlight(element.textContent, {
      language: this.getLanguage(language) ? language : 'plaintext'
    });
    element.innerHTML = result.value;
    element.classList.add('hljs');
    element.dataset.highlighted = 'yes';
    plugins.forEach(plugin => plugin['after:highlightElement']?.({
      el: element,
      result
    }));
    return result;
  }

};
(0,_line_numbers__WEBPACK_IMPORTED_MODULE_0__.initLineNumbers)(hljs);
if (typeof window !== 'undefined') window.hljs = hljs;

function chromeMode(block, root) {
  const value = block.dataset.chrome || root?.dataset.chrome || root?.dataset.sfHighlightChrome || 'auto';
  return CHROME_MODES.has(value) ? value : 'auto';
}

function lineNumbersEnabled(block) {
  if (block.hasAttribute('data-lines')) return block.dataset.lines !== 'false';
  return block.dataset.lineNumbers === 'true';
}

function ensureCodeId(block) {
  if (block.id) return block.id;

  do {
    codeId += 1;
    block.id = `sf-highlight-code-${codeId}`;
  } while (block.ownerDocument.getElementById(block.id) !== block);

  return block.id;
}

function localizedCopyStrings(block, root) {
  // The node the words are resolved from is `block`, not the host: a block
  // inside a region that names its own language takes that language. The host
  // is still asked first for a word it was given by hand.
  return {
    label: block.dataset.copyLabel || root?.dataset.copyLabel || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(HIGHLIGHT_TEXT, 'copy', block, 'sf-highlight'),
    success: block.dataset.copySuccess || root?.dataset.copySuccess || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(HIGHLIGHT_TEXT, 'copied', block, 'sf-highlight')
  };
}

function ensureCopyButton(block, root, head) {
  let button = head.querySelector(':scope > .sf-highlight__copy');
  if (button) return button;
  const strings = localizedCopyStrings(block, root);
  const codeElementId = ensureCodeId(block);
  let status = head.querySelector(':scope > .sf-highlight__status');

  if (!status) {
    status = block.ownerDocument.createElement('span');
    status.id = `${codeElementId}-copy-status`;
    status.className = 'sf-highlight__status sr-only';
    head.append(status);
  }

  button = block.ownerDocument.createElement('button');
  button.type = 'button';
  button.className = 'sf-highlight__copy sf-clipboard sf-icon-button sf-icon-button--size-1/2 sf-icon-button--icon sf-icon-button--link sf-icon-button--on-surface flex items-cross-center';
  button.dataset.target = `#${codeElementId}`;
  button.dataset.status = `#${status.id}`;
  button.dataset.success = strings.success;
  button.setAttribute('aria-label', strings.label);
  const icon = block.ownerDocument.createElement('span');
  icon.className = 'sf-icon';
  icon.textContent = 'content_copy';
  icon.setAttribute('aria-hidden', 'true');
  button.append(icon);
  head.append(button);
  return button;
}

function ensureStructure(block) {
  let root = block.closest(ROOT_SELECTOR);
  const mode = chromeMode(block, root);
  const pre = block.closest('pre');
  if (!pre) return {
    root: null,
    mode
  };

  if (!root) {
    root = block.ownerDocument.createElement('div');
    root.className = 'sf-highlight source';
    pre.replaceWith(root);
    root.append(pre);
  } else root.classList.add('sf-highlight');

  root.classList.add('sf-code-surface');
  pre.classList.add('sf-code-surface__scroll');

  if (mode !== 'static') {
    let wrap = pre.closest('.sf-highlight__wrap, .sf--highlight-wrap');

    if (!wrap || wrap.closest(ROOT_SELECTOR) !== root) {
      wrap = block.ownerDocument.createElement('div');
      wrap.className = 'sf-highlight__wrap sf--highlight-wrap sf-scrollbar';
      wrap.dataset.sfScrollbar = 'overlay';
      wrap.dataset.sfScrollbarAxis = 'horizontal';
      pre.replaceWith(wrap);
      wrap.append(pre);
    }

    pre.classList.add('sf-scrollbar__viewport');
  }

  let head = null;

  if (mode === 'auto') {
    head = root.querySelector(':scope > .sf-highlight__head, :scope > .sf--highlight-head');

    if (!head) {
      head = block.ownerDocument.createElement('div');
      head.className = 'sf-highlight__head sf--highlight-head flex content-main-between items-center border-outline-variant bg-surface-overlay';
      root.prepend(head);
    }
  }

  return {
    head,
    mode,
    root
  };
}

function updateChrome(block, result) {
  const {
    head,
    mode,
    root
  } = ensureStructure(block);
  if (!root) return;
  root.dataset.highlightState = block.dataset.highlightState;
  root.classList.add('init');
  if (mode !== 'auto' || !head) return;
  let language = head.querySelector(':scope > .sf-highlight__language');

  if (!language) {
    language = block.ownerDocument.createElement('span');
    language.className = 'sf-highlight__language sf-text-1/2 weight-5';
    head.prepend(language);
  }

  language.textContent = block.dataset.requestedLang || result.language || 'text';
  ensureCopyButton(block, root, head);
}

hljs.addPlugin({
  'before:highlightElement': ({
    el
  }) => ensureStructure(el),
  'after:highlightElement': ({
    el,
    result
  }) => {
    updateChrome(el, result);
    if (lineNumbersEnabled(el)) hljs.lineNumbersBlock(el);
  }
});

function codeBlocksIn(root = document) {
  const blocks = [];
  if (root instanceof Element && root.matches(CODE_SELECTOR)) blocks.push(root);
  root.querySelectorAll?.(CODE_SELECTOR).forEach(block => blocks.push(block));
  return blocks;
}

async function highlightBlock(block) {
  if (!(block instanceof HTMLElement)) return false;
  if (block.dataset.highlighted || highlightedNodes.has(block)) return true;
  block.textContent = block.textContent.trim();
  sourceText.set(block, block.textContent);
  const requested = requestedLanguage(block);
  const language = normalizeLanguage(requested || 'plaintext');
  block.dataset.requestedLang = requested;
  block.dataset.highlightState = hljs.getLanguage(language) ? 'ready' : 'unsupported';
  if (!hljs.getLanguage(language)) block.classList.add('language-plaintext');
  hljs.highlightElement(block);
  block.closest(ROOT_SELECTOR)?.setAttribute('data-highlight-state', block.dataset.highlightState);
  highlightedNodes.add(block);
  return true;
}

async function highlightAllLazy(root = document) {
  const blocks = codeBlocksIn(root);

  for (const block of blocks) await highlightBlock(block);

  return blocks;
}

async function refresh(target, nextSource) {
  const blocks = codeBlocksIn(target instanceof Element ? target : document);

  for (const block of blocks) {
    block.textContent = typeof nextSource === 'string' ? nextSource : sourceText.get(block) || block.textContent;
    delete block.dataset.highlighted;
    highlightedNodes.delete(block);
    await highlightBlock(block);
  }

  return blocks;
}

if (typeof document !== 'undefined') {
  highlightAllLazy();
  const observer = new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
    if (node instanceof Element) highlightAllLazy(node);
  })));
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Highlight = {
    highlight: highlightBlock,
    refresh
  };
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_2__["default"])('hljs', hljs);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hljs);

/***/ },

/***/ "8e4e61390880"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVAILABLE_LANGUAGES: () => (/* binding */ AVAILABLE_LANGUAGES),
/* harmony export */   CUSTOM_LANGUAGE_LOADERS: () => (/* binding */ CUSTOM_LANGUAGE_LOADERS),
/* harmony export */   LANGUAGE_ALIASES: () => (/* binding */ LANGUAGE_ALIASES),
/* harmony export */   LANGUAGE_LOADERS: () => (/* binding */ LANGUAGE_LOADERS)
/* harmony export */ });
const LANGUAGE_ALIASES = Object.freeze({
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  text: 'plaintext',
  html: 'xml',
  yml: 'yaml',
  env: 'dotenv',
  md: 'markdown'
});
const AVAILABLE_LANGUAGES = Object.freeze(['plaintext', 'xml', 'css', 'scss', 'javascript', 'typescript', 'json', 'bash', 'php', 'python', 'sql', 'yaml', 'markdown', 'blade', 'dotenv', '1c']);
const LANGUAGE_LOADERS = Object.freeze({});
const CUSTOM_LANGUAGE_LOADERS = Object.freeze({});

/***/ },

/***/ "c67f05508e63"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initLineNumbers: () => (/* binding */ initLineNumbers)
/* harmony export */ });
function initLineNumbers(engine) {
  function lineNumbersBlock(element) {
    if (!element || element.querySelector(':scope > .sf-code-lines')) return;
    const lines = element.innerHTML.split(/\r?\n/);
    const table = element.ownerDocument.createElement('span');
    table.className = 'sf-code-lines';
    table.setAttribute('role', 'presentation');
    lines.forEach((line, index) => {
      const row = element.ownerDocument.createElement('span');
      row.className = 'sf-code-line';
      const number = element.ownerDocument.createElement('span');
      number.className = 'sf-code-line__number';
      number.textContent = String(index + 1);
      number.setAttribute('aria-hidden', 'true');
      const code = element.ownerDocument.createElement('span');
      code.className = 'sf-code-line__content';
      code.innerHTML = line || ' ';
      row.append(number, code);
      table.append(row);
    });
    element.replaceChildren(table);
  }

  engine.lineNumbersBlock = lineNumbersBlock;
  engine.lineNumbersBlockSync = lineNumbersBlock;

  engine.initLineNumbersOnLoad = () => {};

  return engine;
}

/***/ },

/***/ "58661bec99a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   registerComponent: () => (/* binding */ registerComponent)
/* harmony export */ });
// Simple helper to register a component in one call.
// Usage inside component bundle:
//   import register from './register-helper';
//   register('Buttons', Buttons);
function registerComponent(name, cls) {
  if (!name || !cls) return;

  if (typeof window !== 'undefined' && typeof window.registerSfComponent === 'function') {
    window.registerSfComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined' && window.SF?.Loader?.registerComponent) {
    window.SF.Loader.registerComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined') {
    const pending = window.SF_PENDING_COMPONENTS = window.SF_PENDING_COMPONENTS || [];
    pending.push([name, cls]);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerComponent);

/***/ },

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText)
/* harmony export */ });
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered;

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
};

const announce = () => {
  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
};
/**
 * The page's language for this node: the nearest [lang], else the document's,
 * else English — unless a product has chosen one explicitly.
 */


function pageLanguage(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = node && typeof node.closest === 'function' ? node.closest('[lang]') : null;
  const value = owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en';
  return normalise(value).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = node && typeof node.closest === 'function' ? node.closest('[lang]') : null;
  return normalise(owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en');
}
function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  const owner = component ?? componentOf(node);

  for (const candidate of chain(pageLocale(node))) {
    const added = owner ? REGISTERED.get(owner)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next;
    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = String(component ?? '').toLowerCase();
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
  },

  /** One language across many components: `{ 'sf-table': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    const name = String(component ?? '').toLowerCase();
    return [...(REGISTERED.get(name)?.keys() ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "5f6c219571fc"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5f6c219571fc");
/* harmony import */ var _js_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("39863f24c52d");


})();

/******/ })()
;