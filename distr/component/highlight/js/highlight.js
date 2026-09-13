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
  const language = block.closest('[lang]')?.lang || block.ownerDocument.documentElement.lang || 'en';
  const isRussian = language.toLowerCase().startsWith('ru');
  return {
    label: block.dataset.copyLabel || root?.dataset.copyLabel || (isRussian ? 'Копировать код' : 'Copy code'),
    success: block.dataset.copySuccess || root?.dataset.copySuccess || (isRussian ? 'Код скопирован' : 'Code copied')
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