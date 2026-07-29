/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "39863f24c52d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("92f78dcd2767");
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_public_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2f3e26953260");
/* harmony import */ var _line_numbers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c67f05508e63");
/* harmony import */ var _languages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8e4e61390880");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("58661bec99a6");





highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].componentName = 'hljs';
(0,_line_numbers__WEBPACK_IMPORTED_MODULE_2__.initLineNumbers)(highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"]);
const languagePromiseCache = new Map();
const highlightedNodes = new WeakSet();

if (typeof window !== 'undefined') {
  window.hljs = highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"];
}

function normalizeLanguage(lang) {
  if (!lang) return '';
  return _languages__WEBPACK_IMPORTED_MODULE_3__.LANGUAGE_ALIASES[lang] || lang;
}

function extractLanguagesFromDOM(root = document) {
  if (typeof document === 'undefined') return [];
  const languages = new Set();
  const codeBlocks = root.querySelectorAll('pre code');
  codeBlocks.forEach(el => {
    const dataLang = el.dataset ? el.dataset.lang : '';
    const classLang = el.className && el.className.match(/(?:language|lang)-([^\s]+)/) || [];
    const lang = normalizeLanguage((dataLang || classLang[1] || '').toLowerCase());

    if (lang) {
      languages.add(lang);
    }
  });
  return Array.from(languages);
}

async function ensureLanguagesRegistered(langs) {
  for (const lang of langs) {
    const normalized = normalizeLanguage(lang);
    if (!normalized || highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].getLanguage(normalized)) continue;
    const loader = _languages__WEBPACK_IMPORTED_MODULE_3__.CUSTOM_LANGUAGE_LOADERS[normalized] || _languages__WEBPACK_IMPORTED_MODULE_3__.LANGUAGE_LOADERS[normalized];
    if (!loader) continue;

    if (languagePromiseCache.has(normalized)) {
      await languagePromiseCache.get(normalized);
      continue;
    }

    const promise = loader().then(module => {
      const definition = module.default || module;

      if (typeof definition === 'function') {
        highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].registerLanguage(normalized, definition);
      }
    }).catch(() => {
      if (!highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].getLanguage('plaintext') && _languages__WEBPACK_IMPORTED_MODULE_3__.LANGUAGE_LOADERS.plaintext) {
        return _languages__WEBPACK_IMPORTED_MODULE_3__.LANGUAGE_LOADERS.plaintext().then(mod => {
          highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].registerLanguage('plaintext', mod.default || mod);
        });
      }

      return null;
    });
    languagePromiseCache.set(normalized, promise);
    await promise;
  }
}

highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].addPlugin({
  'before:highlightElement': ({
    el
  }) => {
    let source = el.closest('.source');
    el.wrap = document.createElement('div');
    el.wrap.classList.add('sf--highlight-wrap');
    const classLang = el.className && el.className.match(/(?:language|lang)-([^\s]+)/) || [];
    const requestedLang = (el.dataset?.lang || classLang[1] || '').toLowerCase();

    if (requestedLang) {
      el.dataset.requestedLang = requestedLang;
    }

    if (!source) {
      const parent = el.parentNode;
      const clone = parent.cloneNode();
      source = document.createElement('div');
      source.classList.add('source');
      clone.appendChild(el);
      source.append(el.wrap);
      el.wrap.append(clone);
      parent.replaceWith(source);
    }

    el.source = source;
    el.head = document.createElement('div');
    el.langText = document.createElement('span');
    el.langText.classList.add('flex', 'sf-text-1/3', 'weight-5');
    el.head.classList.add('sf--highlight-head', 'flex', 'content-main-between', 'border-outline-variant', 'items-center', 'bg-surface-overlay');
  },
  'after:highlightElement': ({
    el,
    result
  }) => {
    const {
      language
    } = result;
    const requestedLang = el.dataset?.requestedLang || '';
    const displayLang = requestedLang && language === 'xml' && (requestedLang === 'html' || requestedLang === 'xhtml') ? 'html' : requestedLang || language;
    const id = `copy_${randomId(10)}`;

    if (el && el.source) {
      if (!el.classList.contains('editor')) {
        el.source.prepend(el.head);
        el.head.append(el.langText);
        el.langText.textContent = displayLang;
        el.head.append(`[!Copy data-id=copy](size=1/3 scheme=on-surface type=link text=Copy done=Copied)#${id}`);
        el.head.style.visibility = 'hidden';

        const applyShortcodes = () => {
          let status = false;

          if (window.SF && window.SF.Loader) {
            status = true;
          }

          const ok = status ? SF.Loader.findShortCodes(el.head) : null;

          if (status) {
            el.head.style.visibility = '';
          }

          return ok;
        };

        if (!applyShortcodes()) {
          window.addEventListener('sf-loader-init', () => {
            el.head.style.visibility = '';
          }, {
            once: true
          });
        }
      }

      el.id = id;
      el.source.classList.add('init');
      highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].lineNumbersBlock(el, {
        singleLine: true
      });
    }
  }
});

function randomId(length = 8) {
  return Math.random().toString(36).substr(2, length);
}

function sanitizeCodeBlock(block) {
  if (!block || block.dataset.sfSanitized) return;

  if (block.children.length) {
    const raw = block.innerHTML.trim();
    block.textContent = raw;
    block.dataset.sfSanitized = '1';
  } else {
    block.textContent = block.textContent.trim();
  }
}

async function highlightAllLazy(root = document) {
  const languages = extractLanguagesFromDOM(root);
  await ensureLanguagesRegistered(languages);
  const blocks = root.querySelectorAll('pre code');
  blocks.forEach(block => {
    if (block.dataset?.highlighted) return;
    if (highlightedNodes.has(block)) return;

    try {
      sanitizeCodeBlock(block);
      highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].highlightElement(block);
      highlightedNodes.add(block);
    } catch (e) {
      console.warn('highlight.js failed for block', e);
    }
  });
}

async function initHighlight() {
  if (typeof document === 'undefined') return;
  await highlightAllLazy();
  highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].componentName = 'hljs';
}

initHighlight();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"]);

if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(async node => {
        if (!(node instanceof HTMLElement)) return;

        if (node.matches('pre code')) {
          await highlightAllLazy(node.parentElement || node);
        } else {
          const innerBlocks = node.querySelectorAll?.('pre code');

          if (innerBlocks && innerBlocks.length) {
            await highlightAllLazy(node);
          }
        }
      });
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_4__["default"])('hljs', highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ },

/***/ "8e4e61390880"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVAILABLE_LANGUAGES: () => (/* binding */ AVAILABLE_LANGUAGES),
/* harmony export */   CUSTOM_LANGUAGE_LOADERS: () => (/* binding */ CUSTOM_LANGUAGE_LOADERS),
/* harmony export */   LANGUAGE_ALIASES: () => (/* binding */ LANGUAGE_ALIASES),
/* harmony export */   LANGUAGE_LOADERS: () => (/* binding */ LANGUAGE_LOADERS)
/* harmony export */ });
const dotenvDefinition = function (hljsInstance) {
  return {
    name: 'Dotenv',
    aliases: ['env'],
    case_insensitive: true,
    contains: [hljsInstance.HASH_COMMENT_MODE, {
      begin: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*=)/,
      className: 'attr',
      relevance: 0
    }, {
      begin: /=/,
      end: /$/,
      excludeBegin: true,
      className: 'string'
    }]
  };
};

const bladeDefinition = (() => {
  'use strict';

  return e => ({
    name: 'Blade',
    aliases: ['blade'],
    case_insensitive: true,
    subLanguage: 'xml',
    contains: [e.COMMENT(/\{\{--/, /--}}/), {
      className: 'comment',
      begin: '\\{\\{--',
      end: '--\\}\\}'
    }, {
      className: 'template-variable',
      begin: '\\{\\{',
      starts: {
        end: '\\}\\}',
        returnEnd: true,
        subLanguage: 'php'
      }
    }, {
      className: 'template-variable',
      begin: '\\}\\}'
    }, {
      className: 'template-variable',
      begin: '\\{!!',
      starts: {
        end: '!!\\}',
        returnEnd: true,
        subLanguage: 'php'
      }
    }, {
      className: 'template-variable',
      begin: '!!\\}'
    }, {
      className: 'template-tag',
      begin: '@php',
      starts: {
        end: '@endphp',
        returnEnd: true,
        subLanguage: 'php'
      },
      relevance: 10
    }, {
      begin: '@[\\w]+',
      className: 'template-tag',
      relevance: 2,
      contains: [{
        begin: '\\(',
        end: '\\)',
        className: 'params-blade',
        excludeBegin: false,
        excludeEnd: false
      }]
    }]
  });
})();

const LANGUAGE_ALIASES = {
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  text: 'plaintext',
  html: 'xml',
  yml: 'yaml',
  env: 'dotenv'
};
const AVAILABLE_LANGUAGES = ['1c', 'abnf', 'accesslog', 'actionscript', 'ada', 'angelscript', 'apache', 'applescript', 'arcade', 'arduino', 'armasm', 'asciidoc', 'aspectj', 'autohotkey', 'autoit', 'avrasm', 'awk', 'axapta', 'bash', 'basic', 'bnf', 'brainfuck', 'c', 'cal', 'capnproto', 'ceylon', 'clean', 'clojure-repl', 'clojure', 'cmake', 'coffeescript', 'coq', 'cos', 'cpp', 'crmsh', 'crystal', 'csharp', 'csp', 'css', 'd', 'dart', 'delphi', 'diff', 'django', 'dns', 'dockerfile', 'dos', 'dsconfig', 'dts', 'dust', 'ebnf', 'elixir', 'elm', 'erb', 'erlang-repl', 'erlang', 'excel', 'fix', 'flix', 'fortran', 'fsharp', 'gams', 'gauss', 'gcode', 'gherkin', 'glsl', 'gml', 'go', 'golo', 'gradle', 'graphql', 'groovy', 'haml', 'handlebars', 'haskell', 'haxe', 'hsp', 'http', 'hy', 'inform7', 'ini', 'irpf90', 'isbl', 'java', 'javascript', 'jboss-cli', 'json', 'julia-repl', 'julia', 'kotlin', 'lasso', 'latex', 'ldif', 'leaf', 'less', 'lisp', 'livecodeserver', 'livescript', 'llvm', 'lsl', 'lua', 'makefile', 'markdown', 'mathematica', 'matlab', 'maxima', 'mel', 'mercury', 'mipsasm', 'mizar', 'mojolicious', 'monkey', 'moonscript', 'n1ql', 'nestedtext', 'nginx', 'nim', 'nix', 'node-repl', 'nsis', 'objectivec', 'ocaml', 'openscad', 'oxygene', 'parser3', 'perl', 'pf', 'pgsql', 'php-template', 'php', 'plaintext', 'pony', 'powershell', 'processing', 'profile', 'prolog', 'properties', 'protobuf', 'puppet', 'purebasic', 'python-repl', 'python', 'q', 'qml', 'r', 'reasonml', 'rib', 'roboconf', 'routeros', 'rsl', 'ruby', 'ruleslanguage', 'rust', 'sas', 'scala', 'scheme', 'scilab', 'scss', 'shell', 'smali', 'smalltalk', 'sml', 'sqf', 'sql', 'stan', 'stata', 'step21', 'stylus', 'subunit', 'swift', 'taggerscript', 'tap', 'tcl', 'thrift', 'tp', 'twig', 'typescript', 'vala', 'vbnet', 'vbscript-html', 'vbscript', 'verilog', 'vhdl', 'vim', 'wasm', 'wren', 'x86asm', 'xl', 'xml', 'xquery', 'yaml', 'zephir', // кастомные
'dotenv', 'blade'];
const LANGUAGE_LOADERS = {
  '1c': () => __webpack_require__.e(/* import() */ 95937967843637).then(__webpack_require__.bind(__webpack_require__, "5dc95206a956")),
  abnf: () => __webpack_require__.e(/* import() */ 100351032323741).then(__webpack_require__.bind(__webpack_require__, "9dd1fc1361c4")),
  accesslog: () => __webpack_require__.e(/* import() */ 227417574163705).then(__webpack_require__.bind(__webpack_require__, "b5c19013549c")),
  actionscript: () => __webpack_require__.e(/* import() */ 155862399014402).then(__webpack_require__.bind(__webpack_require__, "54c022d20796")),
  ada: () => __webpack_require__.e(/* import() */ 130302740877057).then(__webpack_require__.bind(__webpack_require__, "8303c0f354fc")),
  angelscript: () => __webpack_require__.e(/* import() */ 195811035468589).then(__webpack_require__.bind(__webpack_require__, "af19ce7b0211")),
  apache: () => __webpack_require__.e(/* import() */ 26223262361425).then(__webpack_require__.bind(__webpack_require__, "1f3ef6efe10e")),
  applescript: () => __webpack_require__.e(/* import() */ 123455015412059).then(__webpack_require__.bind(__webpack_require__, "3b7805498a75")),
  arcade: () => __webpack_require__.e(/* import() */ 139513800748664).then(__webpack_require__.bind(__webpack_require__, "b62b4ef2b296")),
  arduino: () => __webpack_require__.e(/* import() */ 274042634585618).then(__webpack_require__.bind(__webpack_require__, "e4e8fa4da30d")),
  armasm: () => __webpack_require__.e(/* import() */ 253719182769351).then(__webpack_require__.bind(__webpack_require__, "d678d2fb30a4")),
  asciidoc: () => __webpack_require__.e(/* import() */ 202710839477761).then(__webpack_require__.bind(__webpack_require__, "826762ab84d5")),
  aspectj: () => __webpack_require__.e(/* import() */ 83256060644146).then(__webpack_require__.bind(__webpack_require__, "6dd57c35f0a4")),
  autohotkey: () => __webpack_require__.e(/* import() */ 123559808923799).then(__webpack_require__.bind(__webpack_require__, "64a0e32b5277")),
  autoit: () => __webpack_require__.e(/* import() */ 273063916614933).then(__webpack_require__.bind(__webpack_require__, "f2e2be759dee")),
  avrasm: () => __webpack_require__.e(/* import() */ 114806136147699).then(__webpack_require__.bind(__webpack_require__, "6f5f1000ea99")),
  awk: () => __webpack_require__.e(/* import() */ 192546220953038).then(__webpack_require__.bind(__webpack_require__, "6c4acd865505")),
  axapta: () => __webpack_require__.e(/* import() */ 136634492069609).then(__webpack_require__.bind(__webpack_require__, "da9365c60c6b")),
  bash: () => __webpack_require__.e(/* import() */ 156256801485311).then(__webpack_require__.bind(__webpack_require__, "5434786024c7")),
  basic: () => __webpack_require__.e(/* import() */ 85116565137089).then(__webpack_require__.bind(__webpack_require__, "096cfa97071b")),
  bnf: () => __webpack_require__.e(/* import() */ 29823131511270).then(__webpack_require__.bind(__webpack_require__, "a9df9b5b31b6")),
  brainfuck: () => __webpack_require__.e(/* import() */ 149408385788115).then(__webpack_require__.bind(__webpack_require__, "e91585a6f1da")),
  c: () => __webpack_require__.e(/* import() */ 274889971310088).then(__webpack_require__.bind(__webpack_require__, "e60e52366a7b")),
  cal: () => __webpack_require__.e(/* import() */ 65097921979484).then(__webpack_require__.bind(__webpack_require__, "89320c16aad6")),
  capnproto: () => __webpack_require__.e(/* import() */ 255173455456049).then(__webpack_require__.bind(__webpack_require__, "069e78a47074")),
  ceylon: () => __webpack_require__.e(/* import() */ 62991945997236).then(__webpack_require__.bind(__webpack_require__, "80a3086ee32b")),
  clean: () => __webpack_require__.e(/* import() */ 167871387110173).then(__webpack_require__.bind(__webpack_require__, "08915e6f9797")),
  'clojure-repl': () => __webpack_require__.e(/* import() */ 30397883978671).then(__webpack_require__.bind(__webpack_require__, "6ff4b42d925d")),
  clojure: () => __webpack_require__.e(/* import() */ 111701076479113).then(__webpack_require__.bind(__webpack_require__, "b740172900a8")),
  cmake: () => __webpack_require__.e(/* import() */ 250191088630322).then(__webpack_require__.bind(__webpack_require__, "92ac526dc85e")),
  coffeescript: () => __webpack_require__.e(/* import() */ 97371278426201).then(__webpack_require__.bind(__webpack_require__, "d9bf5c77d4fd")),
  coq: () => __webpack_require__.e(/* import() */ 122717211042783).then(__webpack_require__.bind(__webpack_require__, "1c77b67c4caf")),
  cos: () => __webpack_require__.e(/* import() */ 204871670521981).then(__webpack_require__.bind(__webpack_require__, "f7a5759a063d")),
  cpp: () => __webpack_require__.e(/* import() */ 89687180952472).then(__webpack_require__.bind(__webpack_require__, "6114b188bdb2")),
  crmsh: () => __webpack_require__.e(/* import() */ 111854329599859).then(__webpack_require__.bind(__webpack_require__, "370828de8023")),
  crystal: () => __webpack_require__.e(/* import() */ 235899805949353).then(__webpack_require__.bind(__webpack_require__, "0f116cdb4976")),
  csharp: () => __webpack_require__.e(/* import() */ 114362875517220).then(__webpack_require__.bind(__webpack_require__, "cd16381819ea")),
  csp: () => __webpack_require__.e(/* import() */ 126770186057785).then(__webpack_require__.bind(__webpack_require__, "fca05c72df07")),
  css: () => __webpack_require__.e(/* import() */ 189739203835381).then(__webpack_require__.bind(__webpack_require__, "9b2e9e74375b")),
  d: () => __webpack_require__.e(/* import() */ 172890727156818).then(__webpack_require__.bind(__webpack_require__, "ea978bcc82c5")),
  dart: () => __webpack_require__.e(/* import() */ 165328230697776).then(__webpack_require__.bind(__webpack_require__, "14914784120d")),
  delphi: () => __webpack_require__.e(/* import() */ 189143076888901).then(__webpack_require__.bind(__webpack_require__, "f6e6cfeefadf")),
  diff: () => __webpack_require__.e(/* import() */ 82613923876502).then(__webpack_require__.bind(__webpack_require__, "35a2d97c8a32")),
  django: () => __webpack_require__.e(/* import() */ 144584460988155).then(__webpack_require__.bind(__webpack_require__, "682280ff6956")),
  dns: () => __webpack_require__.e(/* import() */ 214515898169646).then(__webpack_require__.bind(__webpack_require__, "58cca6f1b994")),
  dockerfile: () => __webpack_require__.e(/* import() */ 273114123931973).then(__webpack_require__.bind(__webpack_require__, "e63ce7c4eb7d")),
  dos: () => __webpack_require__.e(/* import() */ 30509277996301).then(__webpack_require__.bind(__webpack_require__, "42d8f79a263a")),
  dsconfig: () => __webpack_require__.e(/* import() */ 139550116393560).then(__webpack_require__.bind(__webpack_require__, "e4b4ed63c7b5")),
  dts: () => __webpack_require__.e(/* import() */ 273009303884820).then(__webpack_require__.bind(__webpack_require__, "0fb1b0b19b2a")),
  dust: () => __webpack_require__.e(/* import() */ 99546358804018).then(__webpack_require__.bind(__webpack_require__, "dceb84e01c12")),
  ebnf: () => __webpack_require__.e(/* import() */ 203476357276805).then(__webpack_require__.bind(__webpack_require__, "4fea88ffdcfe")),
  elixir: () => __webpack_require__.e(/* import() */ 3787441959124).then(__webpack_require__.bind(__webpack_require__, "29cfc5b4ac6b")),
  elm: () => __webpack_require__.e(/* import() */ 147125353653742).then(__webpack_require__.bind(__webpack_require__, "04c8999db7bd")),
  erb: () => __webpack_require__.e(/* import() */ 216860789256580).then(__webpack_require__.bind(__webpack_require__, "c8dbb12e2e2e")),
  'erlang-repl': () => __webpack_require__.e(/* import() */ 70765190698179).then(__webpack_require__.bind(__webpack_require__, "4ab96cd04f61")),
  erlang: () => __webpack_require__.e(/* import() */ 73374492731954).then(__webpack_require__.bind(__webpack_require__, "3efa98e00bc3")),
  excel: () => __webpack_require__.e(/* import() */ 163470170021777).then(__webpack_require__.bind(__webpack_require__, "71dd5a7f163c")),
  fix: () => __webpack_require__.e(/* import() */ 257169591446053).then(__webpack_require__.bind(__webpack_require__, "af1175c0c37a")),
  flix: () => __webpack_require__.e(/* import() */ 38172782420688).then(__webpack_require__.bind(__webpack_require__, "b25f520d1939")),
  fortran: () => __webpack_require__.e(/* import() */ 84607717125916).then(__webpack_require__.bind(__webpack_require__, "736a59606c0d")),
  fsharp: () => __webpack_require__.e(/* import() */ 143433090790626).then(__webpack_require__.bind(__webpack_require__, "216c27947ab4")),
  gams: () => __webpack_require__.e(/* import() */ 48634131347297).then(__webpack_require__.bind(__webpack_require__, "39b472f61d24")),
  gauss: () => __webpack_require__.e(/* import() */ 172192995236545).then(__webpack_require__.bind(__webpack_require__, "3e27cb305af3")),
  gcode: () => __webpack_require__.e(/* import() */ 115244803226390).then(__webpack_require__.bind(__webpack_require__, "921fc79b590a")),
  gherkin: () => __webpack_require__.e(/* import() */ 235773094440279).then(__webpack_require__.bind(__webpack_require__, "08c2292c9937")),
  glsl: () => __webpack_require__.e(/* import() */ 176802002205033).then(__webpack_require__.bind(__webpack_require__, "e4129c9f99c7")),
  gml: () => __webpack_require__.e(/* import() */ 222988253419484).then(__webpack_require__.bind(__webpack_require__, "8c798669c2ee")),
  go: () => __webpack_require__.e(/* import() */ 159364498251411).then(__webpack_require__.bind(__webpack_require__, "fd6774bdcc98")),
  golo: () => __webpack_require__.e(/* import() */ 248720618666448).then(__webpack_require__.bind(__webpack_require__, "5a911b56b0e7")),
  gradle: () => __webpack_require__.e(/* import() */ 245390638853599).then(__webpack_require__.bind(__webpack_require__, "08eb5a11cbcd")),
  graphql: () => __webpack_require__.e(/* import() */ 7273509103348).then(__webpack_require__.bind(__webpack_require__, "3a4df804c871")),
  groovy: () => __webpack_require__.e(/* import() */ 96635325371230).then(__webpack_require__.bind(__webpack_require__, "0a13dcc7c194")),
  haml: () => __webpack_require__.e(/* import() */ 142188020148285).then(__webpack_require__.bind(__webpack_require__, "7cf69084c211")),
  handlebars: () => __webpack_require__.e(/* import() */ 263972479362080).then(__webpack_require__.bind(__webpack_require__, "ba2326950873")),
  haskell: () => __webpack_require__.e(/* import() */ 130941634456027).then(__webpack_require__.bind(__webpack_require__, "0e2c634c5a28")),
  haxe: () => __webpack_require__.e(/* import() */ 156612667208831).then(__webpack_require__.bind(__webpack_require__, "e2f8248b6d05")),
  hsp: () => __webpack_require__.e(/* import() */ 26343288342144).then(__webpack_require__.bind(__webpack_require__, "4839eb50223f")),
  http: () => __webpack_require__.e(/* import() */ 67305475426941).then(__webpack_require__.bind(__webpack_require__, "e9f96cfc9ad3")),
  hy: () => __webpack_require__.e(/* import() */ 254014062081272).then(__webpack_require__.bind(__webpack_require__, "ccd65282402b")),
  inform7: () => __webpack_require__.e(/* import() */ 166414349502100).then(__webpack_require__.bind(__webpack_require__, "39240aa7d154")),
  ini: () => __webpack_require__.e(/* import() */ 170470382040240).then(__webpack_require__.bind(__webpack_require__, "0a81b031c8e9")),
  irpf90: () => __webpack_require__.e(/* import() */ 253444359302909).then(__webpack_require__.bind(__webpack_require__, "95bb8a321cf8")),
  isbl: () => __webpack_require__.e(/* import() */ 140097722405607).then(__webpack_require__.bind(__webpack_require__, "9f8274fe6868")),
  java: () => __webpack_require__.e(/* import() */ 99484981608832).then(__webpack_require__.bind(__webpack_require__, "a462729ed4be")),
  javascript: () => __webpack_require__.e(/* import() */ 140718668072844).then(__webpack_require__.bind(__webpack_require__, "c88cef1b1e5b")),
  'jboss-cli': () => __webpack_require__.e(/* import() */ 125281920945916).then(__webpack_require__.bind(__webpack_require__, "d414de7cfc26")),
  json: () => __webpack_require__.e(/* import() */ 226880896384550).then(__webpack_require__.bind(__webpack_require__, "ec8c6d2bd857")),
  'julia-repl': () => __webpack_require__.e(/* import() */ 160492669795454).then(__webpack_require__.bind(__webpack_require__, "9460e6a988da")),
  julia: () => __webpack_require__.e(/* import() */ 120742577320511).then(__webpack_require__.bind(__webpack_require__, "87ba62d5a735")),
  kotlin: () => __webpack_require__.e(/* import() */ 36385027146146).then(__webpack_require__.bind(__webpack_require__, "3902e7971a79")),
  lasso: () => __webpack_require__.e(/* import() */ 71869720498957).then(__webpack_require__.bind(__webpack_require__, "99231daee4f1")),
  latex: () => __webpack_require__.e(/* import() */ 38967246559567).then(__webpack_require__.bind(__webpack_require__, "ef90be8a6a9f")),
  ldif: () => __webpack_require__.e(/* import() */ 67304411429262).then(__webpack_require__.bind(__webpack_require__, "b8eb2045e835")),
  leaf: () => __webpack_require__.e(/* import() */ 187088531725210).then(__webpack_require__.bind(__webpack_require__, "c94ac0ea6363")),
  less: () => __webpack_require__.e(/* import() */ 172139154355174).then(__webpack_require__.bind(__webpack_require__, "573caf72fceb")),
  lisp: () => __webpack_require__.e(/* import() */ 196396563326325).then(__webpack_require__.bind(__webpack_require__, "0d8bbcdace99")),
  livecodeserver: () => __webpack_require__.e(/* import() */ 206351173581376).then(__webpack_require__.bind(__webpack_require__, "d5a6da8d8631")),
  livescript: () => __webpack_require__.e(/* import() */ 205011152583785).then(__webpack_require__.bind(__webpack_require__, "8514bfd2433f")),
  llvm: () => __webpack_require__.e(/* import() */ 25470937122993).then(__webpack_require__.bind(__webpack_require__, "56b08ad1a50e")),
  lsl: () => __webpack_require__.e(/* import() */ 265592293278380).then(__webpack_require__.bind(__webpack_require__, "3a2cc6a2077e")),
  lua: () => __webpack_require__.e(/* import() */ 174039728907560).then(__webpack_require__.bind(__webpack_require__, "ee498727d884")),
  makefile: () => __webpack_require__.e(/* import() */ 225526844089967).then(__webpack_require__.bind(__webpack_require__, "5ba4f13ca5c1")),
  markdown: () => __webpack_require__.e(/* import() */ 148983579446384).then(__webpack_require__.bind(__webpack_require__, "dd08558faca1")),
  mathematica: () => __webpack_require__.e(/* import() */ 72820832867377).then(__webpack_require__.bind(__webpack_require__, "a91ced56d12e")),
  matlab: () => __webpack_require__.e(/* import() */ 118977917106850).then(__webpack_require__.bind(__webpack_require__, "2aee2fcc07ed")),
  maxima: () => __webpack_require__.e(/* import() */ 198006813064573).then(__webpack_require__.bind(__webpack_require__, "91e858b7dfc5")),
  mel: () => __webpack_require__.e(/* import() */ 4075775730422).then(__webpack_require__.bind(__webpack_require__, "72b7e2fa05de")),
  mercury: () => __webpack_require__.e(/* import() */ 70252804767523).then(__webpack_require__.bind(__webpack_require__, "0067316d6cf8")),
  mipsasm: () => __webpack_require__.e(/* import() */ 156298815907667).then(__webpack_require__.bind(__webpack_require__, "9d9377c5816f")),
  mizar: () => __webpack_require__.e(/* import() */ 144403546040455).then(__webpack_require__.bind(__webpack_require__, "f4555c919538")),
  mojolicious: () => __webpack_require__.e(/* import() */ 42350191251885).then(__webpack_require__.bind(__webpack_require__, "c3f48b930701")),
  monkey: () => __webpack_require__.e(/* import() */ 10414383691479).then(__webpack_require__.bind(__webpack_require__, "1804500df3e1")),
  moonscript: () => __webpack_require__.e(/* import() */ 115010822649423).then(__webpack_require__.bind(__webpack_require__, "7312a64b1e10")),
  n1ql: () => __webpack_require__.e(/* import() */ 64730344564197).then(__webpack_require__.bind(__webpack_require__, "38a72dbf2035")),
  nestedtext: () => __webpack_require__.e(/* import() */ 212252426180164).then(__webpack_require__.bind(__webpack_require__, "63c33f57ac37")),
  nginx: () => __webpack_require__.e(/* import() */ 147982243879751).then(__webpack_require__.bind(__webpack_require__, "02f22ab1c8e4")),
  nim: () => __webpack_require__.e(/* import() */ 57183545066611).then(__webpack_require__.bind(__webpack_require__, "84cf6fe392eb")),
  nix: () => __webpack_require__.e(/* import() */ 260367278145799).then(__webpack_require__.bind(__webpack_require__, "ee97811417f8")),
  'node-repl': () => __webpack_require__.e(/* import() */ 151412650933563).then(__webpack_require__.bind(__webpack_require__, "fa5dad379c17")),
  nsis: () => __webpack_require__.e(/* import() */ 72596867988895).then(__webpack_require__.bind(__webpack_require__, "9aef5ebc800b")),
  objectivec: () => __webpack_require__.e(/* import() */ 251612580802025).then(__webpack_require__.bind(__webpack_require__, "415462c773b7")),
  ocaml: () => __webpack_require__.e(/* import() */ 10484890378983).then(__webpack_require__.bind(__webpack_require__, "aa08d402bad8")),
  openscad: () => __webpack_require__.e(/* import() */ 269425266528315).then(__webpack_require__.bind(__webpack_require__, "ec0c6bee53a3")),
  oxygene: () => __webpack_require__.e(/* import() */ 169101424464774).then(__webpack_require__.bind(__webpack_require__, "f93b69e0fe47")),
  parser3: () => __webpack_require__.e(/* import() */ 82556565256042).then(__webpack_require__.bind(__webpack_require__, "a6462e0dcbbf")),
  perl: () => __webpack_require__.e(/* import() */ 24008490671684).then(__webpack_require__.bind(__webpack_require__, "9cee35be9adb")),
  pf: () => __webpack_require__.e(/* import() */ 263190103667559).then(__webpack_require__.bind(__webpack_require__, "19bf39fd655d")),
  pgsql: () => __webpack_require__.e(/* import() */ 32352903021712).then(__webpack_require__.bind(__webpack_require__, "4cccb6b7b407")),
  'php-template': () => __webpack_require__.e(/* import() */ 254904848274191).then(__webpack_require__.bind(__webpack_require__, "301f191fb901")),
  php: () => __webpack_require__.e(/* import() */ 262063062518108).then(__webpack_require__.bind(__webpack_require__, "be7f0d77f15c")),
  plaintext: () => __webpack_require__.e(/* import() */ 22635021162243).then(__webpack_require__.bind(__webpack_require__, "5d736b5a5ac3")),
  pony: () => __webpack_require__.e(/* import() */ 263066741028842).then(__webpack_require__.bind(__webpack_require__, "2c10cf1a0e17")),
  powershell: () => __webpack_require__.e(/* import() */ 77003880170005).then(__webpack_require__.bind(__webpack_require__, "4bc726dbe93c")),
  processing: () => __webpack_require__.e(/* import() */ 125716442015418).then(__webpack_require__.bind(__webpack_require__, "16df60de804f")),
  profile: () => __webpack_require__.e(/* import() */ 229310784309733).then(__webpack_require__.bind(__webpack_require__, "f90fc841cd86")),
  prolog: () => __webpack_require__.e(/* import() */ 72901349112524).then(__webpack_require__.bind(__webpack_require__, "0af455237d18")),
  properties: () => __webpack_require__.e(/* import() */ 232968285440742).then(__webpack_require__.bind(__webpack_require__, "b0cfd4b56c3b")),
  protobuf: () => __webpack_require__.e(/* import() */ 29907469112949).then(__webpack_require__.bind(__webpack_require__, "6d807e640c33")),
  puppet: () => __webpack_require__.e(/* import() */ 2608170257545).then(__webpack_require__.bind(__webpack_require__, "69176ce5418b")),
  purebasic: () => __webpack_require__.e(/* import() */ 115038311464101).then(__webpack_require__.bind(__webpack_require__, "b8c9a0b0b089")),
  'python-repl': () => __webpack_require__.e(/* import() */ 146312207507096).then(__webpack_require__.bind(__webpack_require__, "56cde79675bd")),
  python: () => __webpack_require__.e(/* import() */ 266172231897254).then(__webpack_require__.bind(__webpack_require__, "d1660f703c32")),
  q: () => __webpack_require__.e(/* import() */ 49123593392276).then(__webpack_require__.bind(__webpack_require__, "400c287b5ff5")),
  qml: () => __webpack_require__.e(/* import() */ 167437106912642).then(__webpack_require__.bind(__webpack_require__, "30e3643e0c2f")),
  r: () => __webpack_require__.e(/* import() */ 270191500943512).then(__webpack_require__.bind(__webpack_require__, "39a2907828a9")),
  reasonml: () => __webpack_require__.e(/* import() */ 268069111655272).then(__webpack_require__.bind(__webpack_require__, "999d6b6b1c90")),
  rib: () => __webpack_require__.e(/* import() */ 41589970384495).then(__webpack_require__.bind(__webpack_require__, "2a357b710fe2")),
  roboconf: () => __webpack_require__.e(/* import() */ 84021716169274).then(__webpack_require__.bind(__webpack_require__, "2ef5123e9d2e")),
  routeros: () => __webpack_require__.e(/* import() */ 248282398772325).then(__webpack_require__.bind(__webpack_require__, "c1396e67dc19")),
  rsl: () => __webpack_require__.e(/* import() */ 199165735997167).then(__webpack_require__.bind(__webpack_require__, "dab9cdac39a5")),
  ruby: () => __webpack_require__.e(/* import() */ 159110403563395).then(__webpack_require__.bind(__webpack_require__, "d705dd3abe0f")),
  ruleslanguage: () => __webpack_require__.e(/* import() */ 192910214474930).then(__webpack_require__.bind(__webpack_require__, "fce1d4dc4298")),
  rust: () => __webpack_require__.e(/* import() */ 264907327972035).then(__webpack_require__.bind(__webpack_require__, "bb414ff7c275")),
  sas: () => __webpack_require__.e(/* import() */ 168202372210377).then(__webpack_require__.bind(__webpack_require__, "9bdcab963cfa")),
  scala: () => __webpack_require__.e(/* import() */ 189912969608329).then(__webpack_require__.bind(__webpack_require__, "7d3a234781e7")),
  scheme: () => __webpack_require__.e(/* import() */ 195725912886615).then(__webpack_require__.bind(__webpack_require__, "996653ddfe7b")),
  scilab: () => __webpack_require__.e(/* import() */ 100478735452180).then(__webpack_require__.bind(__webpack_require__, "0063fd0fb82e")),
  scss: () => __webpack_require__.e(/* import() */ 158483992498012).then(__webpack_require__.bind(__webpack_require__, "24ddafe3d88b")),
  shell: () => __webpack_require__.e(/* import() */ 125602293898598).then(__webpack_require__.bind(__webpack_require__, "283a04c30a81")),
  smali: () => __webpack_require__.e(/* import() */ 2820634927018).then(__webpack_require__.bind(__webpack_require__, "28d9ee324e26")),
  smalltalk: () => __webpack_require__.e(/* import() */ 125475225814474).then(__webpack_require__.bind(__webpack_require__, "8aa9f448b1b6")),
  sml: () => __webpack_require__.e(/* import() */ 179418751343411).then(__webpack_require__.bind(__webpack_require__, "a519e2d50759")),
  sqf: () => __webpack_require__.e(/* import() */ 123586813552673).then(__webpack_require__.bind(__webpack_require__, "9e7ae7503eaa")),
  sql: () => __webpack_require__.e(/* import() */ 215543126597737).then(__webpack_require__.bind(__webpack_require__, "30a99390dd46")),
  stan: () => __webpack_require__.e(/* import() */ 249753900432072).then(__webpack_require__.bind(__webpack_require__, "b5d6caf40c0c")),
  stata: () => __webpack_require__.e(/* import() */ 210093861202561).then(__webpack_require__.bind(__webpack_require__, "3829301edcbd")),
  step21: () => __webpack_require__.e(/* import() */ 29972037862132).then(__webpack_require__.bind(__webpack_require__, "dd81a905b460")),
  stylus: () => __webpack_require__.e(/* import() */ 184635051105366).then(__webpack_require__.bind(__webpack_require__, "fd9bbcf89f28")),
  subunit: () => __webpack_require__.e(/* import() */ 34393957451762).then(__webpack_require__.bind(__webpack_require__, "f8ee0a343b1f")),
  swift: () => __webpack_require__.e(/* import() */ 80120399714337).then(__webpack_require__.bind(__webpack_require__, "7dcaaeb8ea07")),
  taggerscript: () => __webpack_require__.e(/* import() */ 75265337917482).then(__webpack_require__.bind(__webpack_require__, "07d9c9a26966")),
  tap: () => __webpack_require__.e(/* import() */ 208721429145150).then(__webpack_require__.bind(__webpack_require__, "c155765c5ded")),
  tcl: () => __webpack_require__.e(/* import() */ 165434347932105).then(__webpack_require__.bind(__webpack_require__, "94ba28f5b2f5")),
  thrift: () => __webpack_require__.e(/* import() */ 76703377478342).then(__webpack_require__.bind(__webpack_require__, "c7eb4667fcb3")),
  tp: () => __webpack_require__.e(/* import() */ 209092284958385).then(__webpack_require__.bind(__webpack_require__, "483369fdec57")),
  twig: () => __webpack_require__.e(/* import() */ 147285299031254).then(__webpack_require__.bind(__webpack_require__, "ac4c44e11f8f")),
  typescript: () => __webpack_require__.e(/* import() */ 166455749969468).then(__webpack_require__.bind(__webpack_require__, "60468c2bac0b")),
  vala: () => __webpack_require__.e(/* import() */ 132640951021083).then(__webpack_require__.bind(__webpack_require__, "ad9e7be0e01c")),
  vbnet: () => __webpack_require__.e(/* import() */ 60563380021785).then(__webpack_require__.bind(__webpack_require__, "22984d503cd1")),
  'vbscript-html': () => __webpack_require__.e(/* import() */ 80828963877549).then(__webpack_require__.bind(__webpack_require__, "cff5d2109b0a")),
  vbscript: () => __webpack_require__.e(/* import() */ 181599356274715).then(__webpack_require__.bind(__webpack_require__, "66bcfadf3f1b")),
  verilog: () => __webpack_require__.e(/* import() */ 72200369666298).then(__webpack_require__.bind(__webpack_require__, "200a1537ff0c")),
  vhdl: () => __webpack_require__.e(/* import() */ 61461964938443).then(__webpack_require__.bind(__webpack_require__, "bf16d09322cc")),
  vim: () => __webpack_require__.e(/* import() */ 83583776191636).then(__webpack_require__.bind(__webpack_require__, "fc2b70015bb8")),
  wasm: () => __webpack_require__.e(/* import() */ 142966148516416).then(__webpack_require__.bind(__webpack_require__, "0697f9ad4ee2")),
  wren: () => __webpack_require__.e(/* import() */ 173703800050334).then(__webpack_require__.bind(__webpack_require__, "8133547eea3e")),
  x86asm: () => __webpack_require__.e(/* import() */ 125057212066108).then(__webpack_require__.bind(__webpack_require__, "d9bdc17de782")),
  xl: () => __webpack_require__.e(/* import() */ 198694519796634).then(__webpack_require__.bind(__webpack_require__, "68c283acb52f")),
  xml: () => __webpack_require__.e(/* import() */ 160782789864396).then(__webpack_require__.bind(__webpack_require__, "07261672b26c")),
  xquery: () => __webpack_require__.e(/* import() */ 97344075279188).then(__webpack_require__.bind(__webpack_require__, "fc150fb1abc1")),
  yaml: () => __webpack_require__.e(/* import() */ 32062960470757).then(__webpack_require__.bind(__webpack_require__, "278558554fc2")),
  zephir: () => __webpack_require__.e(/* import() */ 13456346346186).then(__webpack_require__.bind(__webpack_require__, "602c2a44f436")),
  dotenv: () => Promise.resolve({
    default: dotenvDefinition
  }),
  blade: () => Promise.resolve({
    default: bladeDefinition
  })
};
const CUSTOM_LANGUAGE_LOADERS = {
  dotenv: () => Promise.resolve({
    default: dotenvDefinition
  }),
  blade: () => Promise.resolve({
    default: bladeDefinition
  })
};

/***/ },

/***/ "c67f05508e63"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initLineNumbers: () => (/* binding */ initLineNumbers)
/* harmony export */ });
function initLineNumbers(hljs) {
  var TABLE_NAME = 'hljs-ln',
      LINE_NAME = 'hljs-ln-line',
      CODE_BLOCK_NAME = 'hljs-ln-code',
      NUMBERS_BLOCK_NAME = 'hljs-ln-numbers',
      NUMBER_LINE_NAME = 'hljs-ln-n',
      DATA_ATTR_NAME = 'data-line-number',
      BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

  if (hljs) {
    hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
    hljs.lineNumbersBlock = lineNumbersBlock;
    hljs.lineNumbersBlockSync = lineNumbersBlockSync;
    hljs.lineNumbersValue = lineNumbersValue;
  } else {
    console.error('highlight.js not detected!');
  }

  function isHljsLnCodeDescendant(domElt) {
    var curElt = domElt;

    while (curElt) {
      if (curElt.className && curElt.className.indexOf('hljs-ln-code') !== -1) {
        return true;
      }

      curElt = curElt.parentNode;
    }

    return false;
  }

  function getHljsLnTable(hljsLnDomElt) {
    var curElt = hljsLnDomElt;

    while (curElt.nodeName !== 'TABLE') {
      curElt = curElt.parentNode;
    }

    return curElt;
  } // Function to workaround a copy issue with Microsoft Edge.
  // Due to hljs-ln wrapping the lines of code inside a <table> element,
  // itself wrapped inside a <pre> element, window.getSelection().toString()
  // does not contain any line breaks. So we need to get them back using the
  // rendered code in the DOM as reference.


  function edgeGetSelectedCodeLines(selection) {
    // current selected text without line breaks
    var selectionText = selection.toString(); // get the <td> element wrapping the first line of selected code

    var tdAnchor = selection.anchorNode;

    while (tdAnchor.nodeName !== 'TD') {
      tdAnchor = tdAnchor.parentNode;
    } // get the <td> element wrapping the last line of selected code


    var tdFocus = selection.focusNode;

    while (tdFocus.nodeName !== 'TD') {
      tdFocus = tdFocus.parentNode;
    } // extract line numbers


    var firstLineNumber = parseInt(tdAnchor.dataset.lineNumber);
    var lastLineNumber = parseInt(tdFocus.dataset.lineNumber); // multi-lines copied case

    if (firstLineNumber != lastLineNumber) {
      var firstLineText = tdAnchor.textContent;
      var lastLineText = tdFocus.textContent; // if the selection was made backward, swap values

      if (firstLineNumber > lastLineNumber) {
        var tmp = firstLineNumber;
        firstLineNumber = lastLineNumber;
        lastLineNumber = tmp;
        tmp = firstLineText;
        firstLineText = lastLineText;
        lastLineText = tmp;
      } // discard not copied characters in first line


      while (selectionText.indexOf(firstLineText) !== 0) {
        firstLineText = firstLineText.slice(1);
      } // discard not copied characters in last line


      while (selectionText.lastIndexOf(lastLineText) === -1) {
        lastLineText = lastLineText.slice(0, -1);
      } // reconstruct and return the real copied text


      var selectedText = firstLineText;
      var hljsLnTable = getHljsLnTable(tdAnchor);

      for (var i = firstLineNumber + 1; i < lastLineNumber; ++i) {
        var codeLineSel = format('.{0}[{1}="{2}"]', [CODE_BLOCK_NAME, DATA_ATTR_NAME, i]);
        var codeLineElt = hljsLnTable.querySelector(codeLineSel);
        selectedText += '\n' + codeLineElt.textContent;
      }

      selectedText += '\n' + lastLineText;
      return selectedText; // single copied line case
    } else {
      return selectionText;
    }
  } // ensure consistent code copy/paste behavior across all browsers
  // (see https://github.com/yauhenipakala/highlightjs-line-numbers.js/issues/51)


  document.addEventListener('copy', function (e) {
    // get current selection
    var selection = window.getSelection(); // override behavior when one wants to copy line of codes

    if (isHljsLnCodeDescendant(selection.anchorNode)) {
      var selectionText; // workaround an issue with Microsoft Edge as copied line breaks
      // are removed otherwise from the selection string

      if (window.navigator.userAgent.indexOf('Edge') !== -1) {
        selectionText = edgeGetSelectedCodeLines(selection);
      } else {
        // other browsers can directly use the selection string
        selectionText = selection.toString();
      }

      e.clipboardData.setData('text/plain', selectionText);
      e.preventDefault();
    }
  });

  function initLineNumbersOnLoad(options) {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      documentReady(options);
    } else {
      window.addEventListener('DOMContentLoaded', function () {
        documentReady(options);
      });
    }
  }

  function documentReady(options) {
    try {
      var blocks = document.querySelectorAll('code.hljs,code.nohighlight');

      for (var i in blocks) {
        if (Object.prototype.hasOwnProperty.call(blocks, i)) {
          if (!isPluginDisabledForBlock(blocks[i])) {
            lineNumbersBlock(blocks[i], options);
          }
        }
      }
    } catch (e) {
      console.error('LineNumbers error: ', e);
    }
  }

  function isPluginDisabledForBlock(element) {
    return element.classList.contains('nohljsln');
  }

  function lineNumbersBlock(element, options) {
    if (typeof element !== 'object') return;
    async(function () {
      element.innerHTML = lineNumbersInternal(element, options);
    });
  }

  function lineNumbersBlockSync(element, options) {
    if (typeof element !== 'object') return;
    element.innerHTML = lineNumbersInternal(element, options);
  }

  function lineNumbersValue(value, options) {
    if (typeof value !== 'string') return;
    var element = document.createElement('code');
    element.innerHTML = value;
    return lineNumbersInternal(element, options);
  }

  function lineNumbersInternal(element, options) {
    var internalOptions = mapOptions(element, options);
    duplicateMultilineNodes(element);
    return addLineNumbersBlockFor(element, internalOptions);
  }

  function addLineNumbersBlockFor(element, options) {
    const {
      area
    } = element.dataset;
    const inputHtml = element.innerHTML;
    let lines = getLines(inputHtml); // Drop a trailing empty line produced by a closing newline in the source.

    while (lines.length > 1 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }

    if (lines.length > 1 || options.singleLine) {
      let html = '';
      let startFrom = options.startFrom || 1;
      let maxLineNumber = startFrom + lines.length - 1;
      let digits = String(maxLineNumber).length;
      let remSize = `1.5rem`;

      switch (digits) {
        case 1:
          remSize = `1.5rem`;
          break;

        case 2:
          remSize = `2rem`;
          break;

        case 3:
          remSize = `2.5rem`;
          break;
      }

      let widthStyle = `style="inline-size:${remSize}"`;

      for (let i = 0, l = lines.length; i < l; i++) {
        html += format('<tr>' + '<td class="{0} {1}"{7} {3}="{5}">' + '<div class="{2}"{3}="{5}"></div>' + '</td>' + '<td class="{0} {4}" {3}="{5}">' + '{6}' + '</td>' + '</tr>', [LINE_NAME, NUMBERS_BLOCK_NAME, NUMBER_LINE_NAME, DATA_ATTR_NAME, CODE_BLOCK_NAME, i + startFrom, lines[i].length > 0 ? lines[i] : ' ', widthStyle]);
      }

      if (area) {
        const textarea = document.getElementById(area);

        if (textarea) {
          textarea.style.paddingLeft = `calc(${remSize} + var(--sf-space-1) + var(--sf-b0))`;
        }
      }

      return format('<table class="{0}">{1}</table>', [TABLE_NAME, html]);
    }

    return inputHtml;
  }
  /**
   * @param {HTMLElement} element Code block.
   * @param {Object} options External API options.
   * @returns {Object} Internal API options.
   */


  function mapOptions(element, options) {
    options = options || {};
    return {
      singleLine: getSingleLineOption(options),
      startFrom: getStartFromOption(element, options)
    };
  }

  function getSingleLineOption(options) {
    var defaultValue = false;

    if (options.singleLine) {
      return options.singleLine;
    }

    return defaultValue;
  }

  function getStartFromOption(element, options) {
    var defaultValue = 1;
    var startFrom = defaultValue;

    if (isFinite(options.startFrom)) {
      startFrom = options.startFrom;
    } // can be overridden because local option is priority


    var value = getAttribute(element, 'data-ln-start-from');

    if (value !== null) {
      startFrom = toNumber(value, defaultValue);
    }

    return startFrom;
  }
  /**
   * Recursive method for fix multi-line elements implementation in highlight.js
   * Doing deep passage on child nodes.
   * @param {HTMLElement} element
   */


  function duplicateMultilineNodes(element) {
    var nodes = element.childNodes;

    for (var node in nodes) {
      if (Object.prototype.hasOwnProperty.call(nodes, node)) {
        var child = nodes[node];

        if (getLinesCount(child.textContent) > 0) {
          if (child.childNodes.length > 0) {
            duplicateMultilineNodes(child);
          } else {
            duplicateMultilineNode(child.parentNode);
          }
        }
      }
    }
  }
  /**
   * Method for fix multi-line elements implementation in highlight.js
   * @param {HTMLElement} element
   */


  function duplicateMultilineNode(element) {
    var className = element.className;
    if (!/hljs-/.test(className)) return;
    var lines = getLines(element.innerHTML);

    for (var i = 0, result = ''; i < lines.length; i++) {
      var lineText = lines[i].length > 0 ? lines[i] : ' ';
      result += format('<span class="{0}">{1}</span>\n', [className, lineText]);
    }

    element.innerHTML = result.trim();
  }

  function getLines(text) {
    if (text.length === 0) return [];
    return text.split(BREAK_LINE_REGEXP);
  }

  function getLinesCount(text) {
    return (text.trim().match(BREAK_LINE_REGEXP) || []).length;
  } ///
  /// HELPERS
  ///


  function async(func) {
    window.setTimeout(func, 0);
  }
  /**
   * {@link https://wcoder.github.io/notes/string-format-for-string-formating-in-javascript}
   * @param {string} format
   * @param {array} args
   */


  function format(format, args) {
    return format.replace(/\{(\d+)\}/g, function (m, n) {
      return args[n] !== undefined ? args[n] : m;
    });
  }
  /**
   * @param {HTMLElement} element Code block.
   * @param {String} attrName Attribute name.
   * @returns {String} Attribute value or empty.
   */


  function getAttribute(element, attrName) {
    return element.hasAttribute(attrName) ? element.getAttribute(attrName) : null;
  }
  /**
   * @param {String} str Source string.
   * @param {Number} fallback Fallback value.
   * @returns Parsed number or fallback value.
   */


  function toNumber(str, fallback) {
    if (!str) return fallback;
    var number = Number(str);
    return isFinite(number) ? number : fallback;
  }
}

/***/ },

/***/ "92f78dcd2767"
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* global __webpack_public_path__: writable */
(() => {
  if (typeof window === 'undefined' || !window.sfPath) return;
  const frameworkRoot = new URL(window.sfPath, window.location?.href || document.baseURI);

  if (!frameworkRoot.pathname.endsWith('/')) {
    frameworkRoot.pathname += '/';
  }

  const highlightScript = typeof document === 'undefined' ? null : Array.from(document.scripts).reverse().find(script => {
    if (!script.src) return false;

    try {
      return /\/component\/highlight\/js\/highlight(?:\.min)?\.js$/.test(new URL(script.src, document.baseURI).pathname);
    } catch {
      return false;
    }
  });
  const highlightRoot = highlightScript ? new URL('../', new URL(highlightScript.src, document.baseURI)) : new URL('component/highlight/', frameworkRoot);

  if (__webpack_require__.p !== highlightRoot.href) {
    __webpack_require__.p = highlightRoot.href;
  }
})();

/***/ },

/***/ "58661bec99a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "93831af7a993"
(module) {

/* eslint-disable no-multi-assign */

function deepFreeze(obj) {
  if (obj instanceof Map) {
    obj.clear =
      obj.delete =
      obj.set =
        function () {
          throw new Error('map is read-only');
        };
  } else if (obj instanceof Set) {
    obj.add =
      obj.clear =
      obj.delete =
        function () {
          throw new Error('set is read-only');
        };
  }

  // Freeze self
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((name) => {
    const prop = obj[name];
    const type = typeof prop;

    // Freeze prop if it is an object or function and also not already frozen
    if ((type === 'object' || type === 'function') && !Object.isFrozen(prop)) {
      deepFreeze(prop);
    }
  });

  return obj;
}

/** @typedef {import('highlight.js').CallbackResponse} CallbackResponse */
/** @typedef {import('highlight.js').CompiledMode} CompiledMode */
/** @implements CallbackResponse */

class Response {
  /**
   * @param {CompiledMode} mode
   */
  constructor(mode) {
    // eslint-disable-next-line no-undefined
    if (mode.data === undefined) mode.data = {};

    this.data = mode.data;
    this.isMatchIgnored = false;
  }

  ignoreMatch() {
    this.isMatchIgnored = true;
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * performs a shallow merge of multiple objects into one
 *
 * @template T
 * @param {T} original
 * @param {Record<string,any>[]} objects
 * @returns {T} a single new object
 */
function inherit$1(original, ...objects) {
  /** @type Record<string,any> */
  const result = Object.create(null);

  for (const key in original) {
    result[key] = original[key];
  }
  objects.forEach(function(obj) {
    for (const key in obj) {
      result[key] = obj[key];
    }
  });
  return /** @type {T} */ (result);
}

/**
 * @typedef {object} Renderer
 * @property {(text: string) => void} addText
 * @property {(node: Node) => void} openNode
 * @property {(node: Node) => void} closeNode
 * @property {() => string} value
 */

/** @typedef {{scope?: string, language?: string, sublanguage?: boolean}} Node */
/** @typedef {{walk: (r: Renderer) => void}} Tree */
/** */

const SPAN_CLOSE = '</span>';

/**
 * Determines if a node needs to be wrapped in <span>
 *
 * @param {Node} node */
const emitsWrappingTags = (node) => {
  // rarely we can have a sublanguage where language is undefined
  // TODO: track down why
  return !!node.scope;
};

/**
 *
 * @param {string} name
 * @param {{prefix:string}} options
 */
const scopeToCSSClass = (name, { prefix }) => {
  // sub-language
  if (name.startsWith("language:")) {
    return name.replace("language:", "language-");
  }
  // tiered scope: comment.line
  if (name.includes(".")) {
    const pieces = name.split(".");
    return [
      `${prefix}${pieces.shift()}`,
      ...(pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`))
    ].join(" ");
  }
  // simple scope
  return `${prefix}${name}`;
};

/** @type {Renderer} */
class HTMLRenderer {
  /**
   * Creates a new HTMLRenderer
   *
   * @param {Tree} parseTree - the parse tree (must support `walk` API)
   * @param {{classPrefix: string}} options
   */
  constructor(parseTree, options) {
    this.buffer = "";
    this.classPrefix = options.classPrefix;
    parseTree.walk(this);
  }

  /**
   * Adds texts to the output stream
   *
   * @param {string} text */
  addText(text) {
    this.buffer += escapeHTML(text);
  }

  /**
   * Adds a node open to the output stream (if needed)
   *
   * @param {Node} node */
  openNode(node) {
    if (!emitsWrappingTags(node)) return;

    const className = scopeToCSSClass(node.scope,
      { prefix: this.classPrefix });
    this.span(className);
  }

  /**
   * Adds a node close to the output stream (if needed)
   *
   * @param {Node} node */
  closeNode(node) {
    if (!emitsWrappingTags(node)) return;

    this.buffer += SPAN_CLOSE;
  }

  /**
   * returns the accumulated buffer
  */
  value() {
    return this.buffer;
  }

  // helpers

  /**
   * Builds a span element
   *
   * @param {string} className */
  span(className) {
    this.buffer += `<span class="${className}">`;
  }
}

/** @typedef {{scope?: string, language?: string, children: Node[]} | string} Node */
/** @typedef {{scope?: string, language?: string, children: Node[]} } DataNode */
/** @typedef {import('highlight.js').Emitter} Emitter */
/**  */

/** @returns {DataNode} */
const newNode = (opts = {}) => {
  /** @type DataNode */
  const result = { children: [] };
  Object.assign(result, opts);
  return result;
};

class TokenTree {
  constructor() {
    /** @type DataNode */
    this.rootNode = newNode();
    this.stack = [this.rootNode];
  }

  get top() {
    return this.stack[this.stack.length - 1];
  }

  get root() { return this.rootNode; }

  /** @param {Node} node */
  add(node) {
    this.top.children.push(node);
  }

  /** @param {string} scope */
  openNode(scope) {
    /** @type Node */
    const node = newNode({ scope });
    this.add(node);
    this.stack.push(node);
  }

  closeNode() {
    if (this.stack.length > 1) {
      return this.stack.pop();
    }
    // eslint-disable-next-line no-undefined
    return undefined;
  }

  closeAllNodes() {
    while (this.closeNode());
  }

  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }

  /**
   * @typedef { import("./html_renderer").Renderer } Renderer
   * @param {Renderer} builder
   */
  walk(builder) {
    // this does not
    return this.constructor._walk(builder, this.rootNode);
    // this works
    // return TokenTree._walk(builder, this.rootNode);
  }

  /**
   * @param {Renderer} builder
   * @param {Node} node
   */
  static _walk(builder, node) {
    if (typeof node === "string") {
      builder.addText(node);
    } else if (node.children) {
      builder.openNode(node);
      node.children.forEach((child) => this._walk(builder, child));
      builder.closeNode(node);
    }
    return builder;
  }

  /**
   * @param {Node} node
   */
  static _collapse(node) {
    if (typeof node === "string") return;
    if (!node.children) return;

    if (node.children.every(el => typeof el === "string")) {
      // node.text = node.children.join("");
      // delete node.children;
      node.children = [node.children.join("")];
    } else {
      node.children.forEach((child) => {
        TokenTree._collapse(child);
      });
    }
  }
}

/**
  Currently this is all private API, but this is the minimal API necessary
  that an Emitter must implement to fully support the parser.

  Minimal interface:

  - addText(text)
  - __addSublanguage(emitter, subLanguageName)
  - startScope(scope)
  - endScope()
  - finalize()
  - toHTML()

*/

/**
 * @implements {Emitter}
 */
class TokenTreeEmitter extends TokenTree {
  /**
   * @param {*} options
   */
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * @param {string} text
   */
  addText(text) {
    if (text === "") { return; }

    this.add(text);
  }

  /** @param {string} scope */
  startScope(scope) {
    this.openNode(scope);
  }

  endScope() {
    this.closeNode();
  }

  /**
   * @param {Emitter & {root: DataNode}} emitter
   * @param {string} name
   */
  __addSublanguage(emitter, name) {
    /** @type DataNode */
    const node = emitter.root;
    if (name) node.scope = `language:${name}`;

    this.add(node);
  }

  toHTML() {
    const renderer = new HTMLRenderer(this, this.options);
    return renderer.value();
  }

  finalize() {
    this.closeAllNodes();
    return true;
  }
}

/**
 * @param {string} value
 * @returns {RegExp}
 * */

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function source(re) {
  if (!re) return null;
  if (typeof re === "string") return re;

  return re.source;
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function lookahead(re) {
  return concat('(?=', re, ')');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function anyNumberOfTimes(re) {
  return concat('(?:', re, ')*');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function optional(re) {
  return concat('(?:', re, ')?');
}

/**
 * @param {...(RegExp | string) } args
 * @returns {string}
 */
function concat(...args) {
  const joined = args.map((x) => source(x)).join("");
  return joined;
}

/**
 * @param { Array<string | RegExp | Object> } args
 * @returns {object}
 */
function stripOptionsFromArgs(args) {
  const opts = args[args.length - 1];

  if (typeof opts === 'object' && opts.constructor === Object) {
    args.splice(args.length - 1, 1);
    return opts;
  } else {
    return {};
  }
}

/** @typedef { {capture?: boolean} } RegexEitherOptions */

/**
 * Any of the passed expresssions may match
 *
 * Creates a huge this | this | that | that match
 * @param {(RegExp | string)[] | [...(RegExp | string)[], RegexEitherOptions]} args
 * @returns {string}
 */
function either(...args) {
  /** @type { object & {capture?: boolean} }  */
  const opts = stripOptionsFromArgs(args);
  const joined = '('
    + (opts.capture ? "" : "?:")
    + args.map((x) => source(x)).join("|") + ")";
  return joined;
}

/**
 * @param {RegExp | string} re
 * @returns {number}
 */
function countMatchGroups(re) {
  return (new RegExp(re.toString() + '|')).exec('').length - 1;
}

/**
 * Does lexeme start with a regular expression match at the beginning
 * @param {RegExp} re
 * @param {string} lexeme
 */
function startsWith(re, lexeme) {
  const match = re && re.exec(lexeme);
  return match && match.index === 0;
}

// BACKREF_RE matches an open parenthesis or backreference. To avoid
// an incorrect parse, it additionally matches the following:
// - [...] elements, where the meaning of parentheses and escapes change
// - other escape sequences, so we do not misparse escape sequences as
//   interesting elements
// - non-matching or lookahead parentheses, which do not capture. These
//   follow the '(' with a '?'.
const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

// **INTERNAL** Not intended for outside usage
// join logically computes regexps.join(separator), but fixes the
// backreferences so they continue to match.
// it also places each individual regular expression into it's own
// match group, keeping track of the sequencing of those match groups
// is currently an exercise for the caller. :-)
/**
 * @param {(string | RegExp)[]} regexps
 * @param {{joinWith: string}} opts
 * @returns {string}
 */
function _rewriteBackreferences(regexps, { joinWith }) {
  let numCaptures = 0;

  return regexps.map((regex) => {
    numCaptures += 1;
    const offset = numCaptures;
    let re = source(regex);
    let out = '';

    while (re.length > 0) {
      const match = BACKREF_RE.exec(re);
      if (!match) {
        out += re;
        break;
      }
      out += re.substring(0, match.index);
      re = re.substring(match.index + match[0].length);
      if (match[0][0] === '\\' && match[1]) {
        // Adjust the backreference.
        out += '\\' + String(Number(match[1]) + offset);
      } else {
        out += match[0];
        if (match[0] === '(') {
          numCaptures++;
        }
      }
    }
    return out;
  }).map(re => `(${re})`).join(joinWith);
}

/** @typedef {import('highlight.js').Mode} Mode */
/** @typedef {import('highlight.js').ModeCallback} ModeCallback */

// Common regexps
const MATCH_NOTHING_RE = /\b\B/;
const IDENT_RE = '[a-zA-Z]\\w*';
const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
const BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

/**
* @param { Partial<Mode> & {binary?: string | RegExp} } opts
*/
const SHEBANG = (opts = {}) => {
  const beginShebang = /^#![ ]*\//;
  if (opts.binary) {
    opts.begin = concat(
      beginShebang,
      /.*\b/,
      opts.binary,
      /\b.*/);
  }
  return inherit$1({
    scope: 'meta',
    begin: beginShebang,
    end: /$/,
    relevance: 0,
    /** @type {ModeCallback} */
    "on:begin": (m, resp) => {
      if (m.index !== 0) resp.ignoreMatch();
    }
  }, opts);
};

// Common modes
const BACKSLASH_ESCAPE = {
  begin: '\\\\[\\s\\S]', relevance: 0
};
const APOS_STRING_MODE = {
  scope: 'string',
  begin: '\'',
  end: '\'',
  illegal: '\\n',
  contains: [BACKSLASH_ESCAPE]
};
const QUOTE_STRING_MODE = {
  scope: 'string',
  begin: '"',
  end: '"',
  illegal: '\\n',
  contains: [BACKSLASH_ESCAPE]
};
const PHRASAL_WORDS_MODE = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
};
/**
 * Creates a comment mode
 *
 * @param {string | RegExp} begin
 * @param {string | RegExp} end
 * @param {Mode | {}} [modeOptions]
 * @returns {Partial<Mode>}
 */
const COMMENT = function(begin, end, modeOptions = {}) {
  const mode = inherit$1(
    {
      scope: 'comment',
      begin,
      end,
      contains: []
    },
    modeOptions
  );
  mode.contains.push({
    scope: 'doctag',
    // hack to avoid the space from being included. the space is necessary to
    // match here to prevent the plain text rule below from gobbling up doctags
    begin: '[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)',
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: true,
    relevance: 0
  });
  const ENGLISH_WORD = either(
    // list of common 1 and 2 letter words in English
    "I",
    "a",
    "is",
    "so",
    "us",
    "to",
    "at",
    "if",
    "in",
    "it",
    "on",
    // note: this is not an exhaustive list of contractions, just popular ones
    /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, // contractions - can't we'd they're let's, etc
    /[A-Za-z]+[-][a-z]+/, // `no-way`, etc.
    /[A-Za-z][a-z]{2,}/ // allow capitalized words at beginning of sentences
  );
  // looking like plain text, more likely to be a comment
  mode.contains.push(
    {
      // TODO: how to include ", (, ) without breaking grammars that use these for
      // comment delimiters?
      // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
      // ---

      // this tries to find sequences of 3 english words in a row (without any
      // "programming" type syntax) this gives us a strong signal that we've
      // TRULY found a comment - vs perhaps scanning with the wrong language.
      // It's possible to find something that LOOKS like the start of the
      // comment - but then if there is no readable text - good chance it is a
      // false match and not a comment.
      //
      // for a visual example please see:
      // https://github.com/highlightjs/highlight.js/issues/2827

      begin: concat(
        /[ ]+/, // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
        '(',
        ENGLISH_WORD,
        /[.]?[:]?([.][ ]|[ ])/,
        '){3}') // look for 3 words in a row
    }
  );
  return mode;
};
const C_LINE_COMMENT_MODE = COMMENT('//', '$');
const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
const HASH_COMMENT_MODE = COMMENT('#', '$');
const NUMBER_MODE = {
  scope: 'number',
  begin: NUMBER_RE,
  relevance: 0
};
const C_NUMBER_MODE = {
  scope: 'number',
  begin: C_NUMBER_RE,
  relevance: 0
};
const BINARY_NUMBER_MODE = {
  scope: 'number',
  begin: BINARY_NUMBER_RE,
  relevance: 0
};
const REGEXP_MODE = {
  scope: "regexp",
  begin: /\/(?=[^/\n]*\/)/,
  end: /\/[gimuy]*/,
  contains: [
    BACKSLASH_ESCAPE,
    {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [BACKSLASH_ESCAPE]
    }
  ]
};
const TITLE_MODE = {
  scope: 'title',
  begin: IDENT_RE,
  relevance: 0
};
const UNDERSCORE_TITLE_MODE = {
  scope: 'title',
  begin: UNDERSCORE_IDENT_RE,
  relevance: 0
};
const METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
  relevance: 0
};

/**
 * Adds end same as begin mechanics to a mode
 *
 * Your mode must include at least a single () match group as that first match
 * group is what is used for comparison
 * @param {Partial<Mode>} mode
 */
const END_SAME_AS_BEGIN = function(mode) {
  return Object.assign(mode,
    {
      /** @type {ModeCallback} */
      'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
      /** @type {ModeCallback} */
      'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1]) resp.ignoreMatch(); }
    });
};

var MODES = /*#__PURE__*/Object.freeze({
  __proto__: null,
  APOS_STRING_MODE: APOS_STRING_MODE,
  BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
  BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
  BINARY_NUMBER_RE: BINARY_NUMBER_RE,
  COMMENT: COMMENT,
  C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
  C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
  C_NUMBER_MODE: C_NUMBER_MODE,
  C_NUMBER_RE: C_NUMBER_RE,
  END_SAME_AS_BEGIN: END_SAME_AS_BEGIN,
  HASH_COMMENT_MODE: HASH_COMMENT_MODE,
  IDENT_RE: IDENT_RE,
  MATCH_NOTHING_RE: MATCH_NOTHING_RE,
  METHOD_GUARD: METHOD_GUARD,
  NUMBER_MODE: NUMBER_MODE,
  NUMBER_RE: NUMBER_RE,
  PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
  QUOTE_STRING_MODE: QUOTE_STRING_MODE,
  REGEXP_MODE: REGEXP_MODE,
  RE_STARTERS_RE: RE_STARTERS_RE,
  SHEBANG: SHEBANG,
  TITLE_MODE: TITLE_MODE,
  UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
  UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE
});

/**
@typedef {import('highlight.js').CallbackResponse} CallbackResponse
@typedef {import('highlight.js').CompilerExt} CompilerExt
*/

// Grammar extensions / plugins
// See: https://github.com/highlightjs/highlight.js/issues/2833

// Grammar extensions allow "syntactic sugar" to be added to the grammar modes
// without requiring any underlying changes to the compiler internals.

// `compileMatch` being the perfect small example of now allowing a grammar
// author to write `match` when they desire to match a single expression rather
// than being forced to use `begin`.  The extension then just moves `match` into
// `begin` when it runs.  Ie, no features have been added, but we've just made
// the experience of writing (and reading grammars) a little bit nicer.

// ------

// TODO: We need negative look-behind support to do this properly
/**
 * Skip a match if it has a preceding dot
 *
 * This is used for `beginKeywords` to prevent matching expressions such as
 * `bob.keyword.do()`. The mode compiler automatically wires this up as a
 * special _internal_ 'on:begin' callback for modes with `beginKeywords`
 * @param {RegExpMatchArray} match
 * @param {CallbackResponse} response
 */
function skipIfHasPrecedingDot(match, response) {
  const before = match.input[match.index - 1];
  if (before === ".") {
    response.ignoreMatch();
  }
}

/**
 *
 * @type {CompilerExt}
 */
function scopeClassName(mode, _parent) {
  // eslint-disable-next-line no-undefined
  if (mode.className !== undefined) {
    mode.scope = mode.className;
    delete mode.className;
  }
}

/**
 * `beginKeywords` syntactic sugar
 * @type {CompilerExt}
 */
function beginKeywords(mode, parent) {
  if (!parent) return;
  if (!mode.beginKeywords) return;

  // for languages with keywords that include non-word characters checking for
  // a word boundary is not sufficient, so instead we check for a word boundary
  // or whitespace - this does no harm in any case since our keyword engine
  // doesn't allow spaces in keywords anyways and we still check for the boundary
  // first
  mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
  mode.__beforeBegin = skipIfHasPrecedingDot;
  mode.keywords = mode.keywords || mode.beginKeywords;
  delete mode.beginKeywords;

  // prevents double relevance, the keywords themselves provide
  // relevance, the mode doesn't need to double it
  // eslint-disable-next-line no-undefined
  if (mode.relevance === undefined) mode.relevance = 0;
}

/**
 * Allow `illegal` to contain an array of illegal values
 * @type {CompilerExt}
 */
function compileIllegal(mode, _parent) {
  if (!Array.isArray(mode.illegal)) return;

  mode.illegal = either(...mode.illegal);
}

/**
 * `match` to match a single expression for readability
 * @type {CompilerExt}
 */
function compileMatch(mode, _parent) {
  if (!mode.match) return;
  if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");

  mode.begin = mode.match;
  delete mode.match;
}

/**
 * provides the default 1 relevance to all modes
 * @type {CompilerExt}
 */
function compileRelevance(mode, _parent) {
  // eslint-disable-next-line no-undefined
  if (mode.relevance === undefined) mode.relevance = 1;
}

// allow beforeMatch to act as a "qualifier" for the match
// the full match begin must be [beforeMatch][begin]
const beforeMatchExt = (mode, parent) => {
  if (!mode.beforeMatch) return;
  // starts conflicts with endsParent which we need to make sure the child
  // rule is not matched multiple times
  if (mode.starts) throw new Error("beforeMatch cannot be used with starts");

  const originalMode = Object.assign({}, mode);
  Object.keys(mode).forEach((key) => { delete mode[key]; });

  mode.keywords = originalMode.keywords;
  mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
  mode.starts = {
    relevance: 0,
    contains: [
      Object.assign(originalMode, { endsParent: true })
    ]
  };
  mode.relevance = 0;

  delete originalMode.beforeMatch;
};

// keywords that should have no default relevance value
const COMMON_KEYWORDS = [
  'of',
  'and',
  'for',
  'in',
  'not',
  'or',
  'if',
  'then',
  'parent', // common variable name
  'list', // common variable name
  'value' // common variable name
];

const DEFAULT_KEYWORD_SCOPE = "keyword";

/**
 * Given raw keywords from a language definition, compile them.
 *
 * @param {string | Record<string,string|string[]> | Array<string>} rawKeywords
 * @param {boolean} caseInsensitive
 */
function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
  /** @type {import("highlight.js/private").KeywordDict} */
  const compiledKeywords = Object.create(null);

  // input can be a string of keywords, an array of keywords, or a object with
  // named keys representing scopeName (which can then point to a string or array)
  if (typeof rawKeywords === 'string') {
    compileList(scopeName, rawKeywords.split(" "));
  } else if (Array.isArray(rawKeywords)) {
    compileList(scopeName, rawKeywords);
  } else {
    Object.keys(rawKeywords).forEach(function(scopeName) {
      // collapse all our objects back into the parent object
      Object.assign(
        compiledKeywords,
        compileKeywords(rawKeywords[scopeName], caseInsensitive, scopeName)
      );
    });
  }
  return compiledKeywords;

  // ---

  /**
   * Compiles an individual list of keywords
   *
   * Ex: "for if when while|5"
   *
   * @param {string} scopeName
   * @param {Array<string>} keywordList
   */
  function compileList(scopeName, keywordList) {
    if (caseInsensitive) {
      keywordList = keywordList.map(x => x.toLowerCase());
    }
    keywordList.forEach(function(keyword) {
      const pair = keyword.split('|');
      compiledKeywords[pair[0]] = [scopeName, scoreForKeyword(pair[0], pair[1])];
    });
  }
}

/**
 * Returns the proper score for a given keyword
 *
 * Also takes into account comment keywords, which will be scored 0 UNLESS
 * another score has been manually assigned.
 * @param {string} keyword
 * @param {string} [providedScore]
 */
function scoreForKeyword(keyword, providedScore) {
  // manual scores always win over common keywords
  // so you can force a score of 1 if you really insist
  if (providedScore) {
    return Number(providedScore);
  }

  return commonKeyword(keyword) ? 0 : 1;
}

/**
 * Determines if a given keyword is common or not
 *
 * @param {string} keyword */
function commonKeyword(keyword) {
  return COMMON_KEYWORDS.includes(keyword.toLowerCase());
}

/*

For the reasoning behind this please see:
https://github.com/highlightjs/highlight.js/issues/2880#issuecomment-747275419

*/

/**
 * @type {Record<string, boolean>}
 */
const seenDeprecations = {};

/**
 * @param {string} message
 */
const error = (message) => {
  console.error(message);
};

/**
 * @param {string} message
 * @param {any} args
 */
const warn = (message, ...args) => {
  console.log(`WARN: ${message}`, ...args);
};

/**
 * @param {string} version
 * @param {string} message
 */
const deprecated = (version, message) => {
  if (seenDeprecations[`${version}/${message}`]) return;

  console.log(`Deprecated as of ${version}. ${message}`);
  seenDeprecations[`${version}/${message}`] = true;
};

/* eslint-disable no-throw-literal */

/**
@typedef {import('highlight.js').CompiledMode} CompiledMode
*/

const MultiClassError = new Error();

/**
 * Renumbers labeled scope names to account for additional inner match
 * groups that otherwise would break everything.
 *
 * Lets say we 3 match scopes:
 *
 *   { 1 => ..., 2 => ..., 3 => ... }
 *
 * So what we need is a clean match like this:
 *
 *   (a)(b)(c) => [ "a", "b", "c" ]
 *
 * But this falls apart with inner match groups:
 *
 * (a)(((b)))(c) => ["a", "b", "b", "b", "c" ]
 *
 * Our scopes are now "out of alignment" and we're repeating `b` 3 times.
 * What needs to happen is the numbers are remapped:
 *
 *   { 1 => ..., 2 => ..., 5 => ... }
 *
 * We also need to know that the ONLY groups that should be output
 * are 1, 2, and 5.  This function handles this behavior.
 *
 * @param {CompiledMode} mode
 * @param {Array<RegExp | string>} regexes
 * @param {{key: "beginScope"|"endScope"}} opts
 */
function remapScopeNames(mode, regexes, { key }) {
  let offset = 0;
  const scopeNames = mode[key];
  /** @type Record<number,boolean> */
  const emit = {};
  /** @type Record<number,string> */
  const positions = {};

  for (let i = 1; i <= regexes.length; i++) {
    positions[i + offset] = scopeNames[i];
    emit[i + offset] = true;
    offset += countMatchGroups(regexes[i - 1]);
  }
  // we use _emit to keep track of which match groups are "top-level" to avoid double
  // output from inside match groups
  mode[key] = positions;
  mode[key]._emit = emit;
  mode[key]._multi = true;
}

/**
 * @param {CompiledMode} mode
 */
function beginMultiClass(mode) {
  if (!Array.isArray(mode.begin)) return;

  if (mode.skip || mode.excludeBegin || mode.returnBegin) {
    error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
    throw MultiClassError;
  }

  if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
    error("beginScope must be object");
    throw MultiClassError;
  }

  remapScopeNames(mode, mode.begin, { key: "beginScope" });
  mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
}

/**
 * @param {CompiledMode} mode
 */
function endMultiClass(mode) {
  if (!Array.isArray(mode.end)) return;

  if (mode.skip || mode.excludeEnd || mode.returnEnd) {
    error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
    throw MultiClassError;
  }

  if (typeof mode.endScope !== "object" || mode.endScope === null) {
    error("endScope must be object");
    throw MultiClassError;
  }

  remapScopeNames(mode, mode.end, { key: "endScope" });
  mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
}

/**
 * this exists only to allow `scope: {}` to be used beside `match:`
 * Otherwise `beginScope` would necessary and that would look weird

  {
    match: [ /def/, /\w+/ ]
    scope: { 1: "keyword" , 2: "title" }
  }

 * @param {CompiledMode} mode
 */
function scopeSugar(mode) {
  if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
    mode.beginScope = mode.scope;
    delete mode.scope;
  }
}

/**
 * @param {CompiledMode} mode
 */
function MultiClass(mode) {
  scopeSugar(mode);

  if (typeof mode.beginScope === "string") {
    mode.beginScope = { _wrap: mode.beginScope };
  }
  if (typeof mode.endScope === "string") {
    mode.endScope = { _wrap: mode.endScope };
  }

  beginMultiClass(mode);
  endMultiClass(mode);
}

/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').CompiledMode} CompiledMode
@typedef {import('highlight.js').Language} Language
@typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
@typedef {import('highlight.js').CompiledLanguage} CompiledLanguage
*/

// compilation

/**
 * Compiles a language definition result
 *
 * Given the raw result of a language definition (Language), compiles this so
 * that it is ready for highlighting code.
 * @param {Language} language
 * @returns {CompiledLanguage}
 */
function compileLanguage(language) {
  /**
   * Builds a regex with the case sensitivity of the current language
   *
   * @param {RegExp | string} value
   * @param {boolean} [global]
   */
  function langRe(value, global) {
    return new RegExp(
      source(value),
      'm'
      + (language.case_insensitive ? 'i' : '')
      + (language.unicodeRegex ? 'u' : '')
      + (global ? 'g' : '')
    );
  }

  /**
    Stores multiple regular expressions and allows you to quickly search for
    them all in a string simultaneously - returning the first match.  It does
    this by creating a huge (a|b|c) regex - each individual item wrapped with ()
    and joined by `|` - using match groups to track position.  When a match is
    found checking which position in the array has content allows us to figure
    out which of the original regexes / match groups triggered the match.

    The match object itself (the result of `Regex.exec`) is returned but also
    enhanced by merging in any meta-data that was registered with the regex.
    This is how we keep track of which mode matched, and what type of rule
    (`illegal`, `begin`, end, etc).
  */
  class MultiRegex {
    constructor() {
      this.matchIndexes = {};
      // @ts-ignore
      this.regexes = [];
      this.matchAt = 1;
      this.position = 0;
    }

    // @ts-ignore
    addRule(re, opts) {
      opts.position = this.position++;
      // @ts-ignore
      this.matchIndexes[this.matchAt] = opts;
      this.regexes.push([opts, re]);
      this.matchAt += countMatchGroups(re) + 1;
    }

    compile() {
      if (this.regexes.length === 0) {
        // avoids the need to check length every time exec is called
        // @ts-ignore
        this.exec = () => null;
      }
      const terminators = this.regexes.map(el => el[1]);
      this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: '|' }), true);
      this.lastIndex = 0;
    }

    /** @param {string} s */
    exec(s) {
      this.matcherRe.lastIndex = this.lastIndex;
      const match = this.matcherRe.exec(s);
      if (!match) { return null; }

      // eslint-disable-next-line no-undefined
      const i = match.findIndex((el, i) => i > 0 && el !== undefined);
      // @ts-ignore
      const matchData = this.matchIndexes[i];
      // trim off any earlier non-relevant match groups (ie, the other regex
      // match groups that make up the multi-matcher)
      match.splice(0, i);

      return Object.assign(match, matchData);
    }
  }

  /*
    Created to solve the key deficiently with MultiRegex - there is no way to
    test for multiple matches at a single location.  Why would we need to do
    that?  In the future a more dynamic engine will allow certain matches to be
    ignored.  An example: if we matched say the 3rd regex in a large group but
    decided to ignore it - we'd need to started testing again at the 4th
    regex... but MultiRegex itself gives us no real way to do that.

    So what this class creates MultiRegexs on the fly for whatever search
    position they are needed.

    NOTE: These additional MultiRegex objects are created dynamically.  For most
    grammars most of the time we will never actually need anything more than the
    first MultiRegex - so this shouldn't have too much overhead.

    Say this is our search group, and we match regex3, but wish to ignore it.

      regex1 | regex2 | regex3 | regex4 | regex5    ' ie, startAt = 0

    What we need is a new MultiRegex that only includes the remaining
    possibilities:

      regex4 | regex5                               ' ie, startAt = 3

    This class wraps all that complexity up in a simple API... `startAt` decides
    where in the array of expressions to start doing the matching. It
    auto-increments, so if a match is found at position 2, then startAt will be
    set to 3.  If the end is reached startAt will return to 0.

    MOST of the time the parser will be setting startAt manually to 0.
  */
  class ResumableMultiRegex {
    constructor() {
      // @ts-ignore
      this.rules = [];
      // @ts-ignore
      this.multiRegexes = [];
      this.count = 0;

      this.lastIndex = 0;
      this.regexIndex = 0;
    }

    // @ts-ignore
    getMatcher(index) {
      if (this.multiRegexes[index]) return this.multiRegexes[index];

      const matcher = new MultiRegex();
      this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
      matcher.compile();
      this.multiRegexes[index] = matcher;
      return matcher;
    }

    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }

    considerAll() {
      this.regexIndex = 0;
    }

    // @ts-ignore
    addRule(re, opts) {
      this.rules.push([re, opts]);
      if (opts.type === "begin") this.count++;
    }

    /** @param {string} s */
    exec(s) {
      const m = this.getMatcher(this.regexIndex);
      m.lastIndex = this.lastIndex;
      let result = m.exec(s);

      // The following is because we have no easy way to say "resume scanning at the
      // existing position but also skip the current rule ONLY". What happens is
      // all prior rules are also skipped which can result in matching the wrong
      // thing. Example of matching "booger":

      // our matcher is [string, "booger", number]
      //
      // ....booger....

      // if "booger" is ignored then we'd really need a regex to scan from the
      // SAME position for only: [string, number] but ignoring "booger" (if it
      // was the first match), a simple resume would scan ahead who knows how
      // far looking only for "number", ignoring potential string matches (or
      // future "booger" matches that might be valid.)

      // So what we do: We execute two matchers, one resuming at the same
      // position, but the second full matcher starting at the position after:

      //     /--- resume first regex match here (for [number])
      //     |/---- full match here for [string, "booger", number]
      //     vv
      // ....booger....

      // Which ever results in a match first is then used. So this 3-4 step
      // process essentially allows us to say "match at this position, excluding
      // a prior rule that was ignored".
      //
      // 1. Match "booger" first, ignore. Also proves that [string] does non match.
      // 2. Resume matching for [number]
      // 3. Match at index + 1 for [string, "booger", number]
      // 4. If #2 and #3 result in matches, which came first?
      if (this.resumingScanAtSamePosition()) {
        if (result && result.index === this.lastIndex) ; else { // use the second matcher result
          const m2 = this.getMatcher(0);
          m2.lastIndex = this.lastIndex + 1;
          result = m2.exec(s);
        }
      }

      if (result) {
        this.regexIndex += result.position + 1;
        if (this.regexIndex === this.count) {
          // wrap-around to considering all matches again
          this.considerAll();
        }
      }

      return result;
    }
  }

  /**
   * Given a mode, builds a huge ResumableMultiRegex that can be used to walk
   * the content and find matches.
   *
   * @param {CompiledMode} mode
   * @returns {ResumableMultiRegex}
   */
  function buildModeRegex(mode) {
    const mm = new ResumableMultiRegex();

    mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));

    if (mode.terminatorEnd) {
      mm.addRule(mode.terminatorEnd, { type: "end" });
    }
    if (mode.illegal) {
      mm.addRule(mode.illegal, { type: "illegal" });
    }

    return mm;
  }

  /** skip vs abort vs ignore
   *
   * @skip   - The mode is still entered and exited normally (and contains rules apply),
   *           but all content is held and added to the parent buffer rather than being
   *           output when the mode ends.  Mostly used with `sublanguage` to build up
   *           a single large buffer than can be parsed by sublanguage.
   *
   *             - The mode begin ands ends normally.
   *             - Content matched is added to the parent mode buffer.
   *             - The parser cursor is moved forward normally.
   *
   * @abort  - A hack placeholder until we have ignore.  Aborts the mode (as if it
   *           never matched) but DOES NOT continue to match subsequent `contains`
   *           modes.  Abort is bad/suboptimal because it can result in modes
   *           farther down not getting applied because an earlier rule eats the
   *           content but then aborts.
   *
   *             - The mode does not begin.
   *             - Content matched by `begin` is added to the mode buffer.
   *             - The parser cursor is moved forward accordingly.
   *
   * @ignore - Ignores the mode (as if it never matched) and continues to match any
   *           subsequent `contains` modes.  Ignore isn't technically possible with
   *           the current parser implementation.
   *
   *             - The mode does not begin.
   *             - Content matched by `begin` is ignored.
   *             - The parser cursor is not moved forward.
   */

  /**
   * Compiles an individual mode
   *
   * This can raise an error if the mode contains certain detectable known logic
   * issues.
   * @param {Mode} mode
   * @param {CompiledMode | null} [parent]
   * @returns {CompiledMode | never}
   */
  function compileMode(mode, parent) {
    const cmode = /** @type CompiledMode */ (mode);
    if (mode.isCompiled) return cmode;

    [
      scopeClassName,
      // do this early so compiler extensions generally don't have to worry about
      // the distinction between match/begin
      compileMatch,
      MultiClass,
      beforeMatchExt
    ].forEach(ext => ext(mode, parent));

    language.compilerExtensions.forEach(ext => ext(mode, parent));

    // __beforeBegin is considered private API, internal use only
    mode.__beforeBegin = null;

    [
      beginKeywords,
      // do this later so compiler extensions that come earlier have access to the
      // raw array if they wanted to perhaps manipulate it, etc.
      compileIllegal,
      // default to 1 relevance if not specified
      compileRelevance
    ].forEach(ext => ext(mode, parent));

    mode.isCompiled = true;

    let keywordPattern = null;
    if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
      // we need a copy because keywords might be compiled multiple times
      // so we can't go deleting $pattern from the original on the first
      // pass
      mode.keywords = Object.assign({}, mode.keywords);
      keywordPattern = mode.keywords.$pattern;
      delete mode.keywords.$pattern;
    }
    keywordPattern = keywordPattern || /\w+/;

    if (mode.keywords) {
      mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
    }

    cmode.keywordPatternRe = langRe(keywordPattern, true);

    if (parent) {
      if (!mode.begin) mode.begin = /\B|\b/;
      cmode.beginRe = langRe(cmode.begin);
      if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
      if (mode.end) cmode.endRe = langRe(cmode.end);
      cmode.terminatorEnd = source(cmode.end) || '';
      if (mode.endsWithParent && parent.terminatorEnd) {
        cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
      }
    }
    if (mode.illegal) cmode.illegalRe = langRe(/** @type {RegExp | string} */ (mode.illegal));
    if (!mode.contains) mode.contains = [];

    mode.contains = [].concat(...mode.contains.map(function(c) {
      return expandOrCloneMode(c === 'self' ? mode : c);
    }));
    mode.contains.forEach(function(c) { compileMode(/** @type Mode */ (c), cmode); });

    if (mode.starts) {
      compileMode(mode.starts, parent);
    }

    cmode.matcher = buildModeRegex(cmode);
    return cmode;
  }

  if (!language.compilerExtensions) language.compilerExtensions = [];

  // self is not valid at the top-level
  if (language.contains && language.contains.includes('self')) {
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  }

  // we need a null object, which inherit will guarantee
  language.classNameAliases = inherit$1(language.classNameAliases || {});

  return compileMode(/** @type Mode */ (language));
}

/**
 * Determines if a mode has a dependency on it's parent or not
 *
 * If a mode does have a parent dependency then often we need to clone it if
 * it's used in multiple places so that each copy points to the correct parent,
 * where-as modes without a parent can often safely be re-used at the bottom of
 * a mode chain.
 *
 * @param {Mode | null} mode
 * @returns {boolean} - is there a dependency on the parent?
 * */
function dependencyOnParent(mode) {
  if (!mode) return false;

  return mode.endsWithParent || dependencyOnParent(mode.starts);
}

/**
 * Expands a mode or clones it if necessary
 *
 * This is necessary for modes with parental dependenceis (see notes on
 * `dependencyOnParent`) and for nodes that have `variants` - which must then be
 * exploded into their own individual modes at compile time.
 *
 * @param {Mode} mode
 * @returns {Mode | Mode[]}
 * */
function expandOrCloneMode(mode) {
  if (mode.variants && !mode.cachedVariants) {
    mode.cachedVariants = mode.variants.map(function(variant) {
      return inherit$1(mode, { variants: null }, variant);
    });
  }

  // EXPAND
  // if we have variants then essentially "replace" the mode with the variants
  // this happens in compileMode, where this function is called from
  if (mode.cachedVariants) {
    return mode.cachedVariants;
  }

  // CLONE
  // if we have dependencies on parents then we need a unique
  // instance of ourselves, so we can be reused with many
  // different parents without issue
  if (dependencyOnParent(mode)) {
    return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
  }

  if (Object.isFrozen(mode)) {
    return inherit$1(mode);
  }

  // no special dependency issues, just return ourselves
  return mode;
}

var version = "11.11.1";

class HTMLInjectionError extends Error {
  constructor(reason, html) {
    super(reason);
    this.name = "HTMLInjectionError";
    this.html = html;
  }
}

/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/



/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').CompiledMode} CompiledMode
@typedef {import('highlight.js').CompiledScope} CompiledScope
@typedef {import('highlight.js').Language} Language
@typedef {import('highlight.js').HLJSApi} HLJSApi
@typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
@typedef {import('highlight.js').PluginEvent} PluginEvent
@typedef {import('highlight.js').HLJSOptions} HLJSOptions
@typedef {import('highlight.js').LanguageFn} LanguageFn
@typedef {import('highlight.js').HighlightedHTMLElement} HighlightedHTMLElement
@typedef {import('highlight.js').BeforeHighlightContext} BeforeHighlightContext
@typedef {import('highlight.js/private').MatchType} MatchType
@typedef {import('highlight.js/private').KeywordData} KeywordData
@typedef {import('highlight.js/private').EnhancedMatch} EnhancedMatch
@typedef {import('highlight.js/private').AnnotatedError} AnnotatedError
@typedef {import('highlight.js').AutoHighlightResult} AutoHighlightResult
@typedef {import('highlight.js').HighlightOptions} HighlightOptions
@typedef {import('highlight.js').HighlightResult} HighlightResult
*/


const escape = escapeHTML;
const inherit = inherit$1;
const NO_MATCH = Symbol("nomatch");
const MAX_KEYWORD_HITS = 7;

/**
 * @param {any} hljs - object that is extended (legacy)
 * @returns {HLJSApi}
 */
const HLJS = function(hljs) {
  // Global internal variables used within the highlight.js library.
  /** @type {Record<string, Language>} */
  const languages = Object.create(null);
  /** @type {Record<string, string>} */
  const aliases = Object.create(null);
  /** @type {HLJSPlugin[]} */
  const plugins = [];

  // safe/production mode - swallows more errors, tries to keep running
  // even if a single syntax or parse hits a fatal error
  let SAFE_MODE = true;
  const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
  /** @type {Language} */
  const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  /** @type HLJSOptions */
  let options = {
    ignoreUnescapedHTML: false,
    throwUnescapedHTML: false,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: 'hljs-',
    cssSelector: 'pre code',
    languages: null,
    // beta configuration options, subject to change, welcome to discuss
    // https://github.com/highlightjs/highlight.js/issues/1086
    __emitter: TokenTreeEmitter
  };

  /* Utility functions */

  /**
   * Tests a language name to see if highlighting should be skipped
   * @param {string} languageName
   */
  function shouldNotHighlight(languageName) {
    return options.noHighlightRe.test(languageName);
  }

  /**
   * @param {HighlightedHTMLElement} block - the HTML element to determine language for
   */
  function blockLanguage(block) {
    let classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    const match = options.languageDetectRe.exec(classes);
    if (match) {
      const language = getLanguage(match[1]);
      if (!language) {
        warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
        warn("Falling back to no-highlight mode for this block.", block);
      }
      return language ? match[1] : 'no-highlight';
    }

    return classes
      .split(/\s+/)
      .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
  }

  /**
   * Core highlighting function.
   *
   * OLD API
   * highlight(lang, code, ignoreIllegals, continuation)
   *
   * NEW API
   * highlight(code, {lang, ignoreIllegals})
   *
   * @param {string} codeOrLanguageName - the language to use for highlighting
   * @param {string | HighlightOptions} optionsOrCode - the code to highlight
   * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   *
   * @returns {HighlightResult} Result - an object that represents the result
   * @property {string} language - the language name
   * @property {number} relevance - the relevance score
   * @property {string} value - the highlighted HTML code
   * @property {string} code - the original raw code
   * @property {CompiledMode} top - top of the current mode stack
   * @property {boolean} illegal - indicates whether any illegal matches were found
  */
  function highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
    let code = "";
    let languageName = "";
    if (typeof optionsOrCode === "object") {
      code = codeOrLanguageName;
      ignoreIllegals = optionsOrCode.ignoreIllegals;
      languageName = optionsOrCode.language;
    } else {
      // old API
      deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
      deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
      languageName = codeOrLanguageName;
      code = optionsOrCode;
    }

    // https://github.com/highlightjs/highlight.js/issues/3149
    // eslint-disable-next-line no-undefined
    if (ignoreIllegals === undefined) { ignoreIllegals = true; }

    /** @type {BeforeHighlightContext} */
    const context = {
      code,
      language: languageName
    };
    // the plugin can change the desired language or the code to be highlighted
    // just be changing the object it was passed
    fire("before:highlight", context);

    // a before plugin can usurp the result completely by providing it's own
    // in which case we don't even need to call highlight
    const result = context.result
      ? context.result
      : _highlight(context.language, context.code, ignoreIllegals);

    result.code = context.code;
    // the plugin can change anything in result to suite it
    fire("after:highlight", result);

    return result;
  }

  /**
   * private highlight that's used internally and does not fire callbacks
   *
   * @param {string} languageName - the language to use for highlighting
   * @param {string} codeToHighlight - the code to highlight
   * @param {boolean?} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   * @param {CompiledMode?} [continuation] - current continuation mode, if any
   * @returns {HighlightResult} - result of the highlight operation
  */
  function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
    const keywordHits = Object.create(null);

    /**
     * Return keyword data if a match is a keyword
     * @param {CompiledMode} mode - current mode
     * @param {string} matchText - the textual match
     * @returns {KeywordData | false}
     */
    function keywordData(mode, matchText) {
      return mode.keywords[matchText];
    }

    function processKeywords() {
      if (!top.keywords) {
        emitter.addText(modeBuffer);
        return;
      }

      let lastIndex = 0;
      top.keywordPatternRe.lastIndex = 0;
      let match = top.keywordPatternRe.exec(modeBuffer);
      let buf = "";

      while (match) {
        buf += modeBuffer.substring(lastIndex, match.index);
        const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
        const data = keywordData(top, word);
        if (data) {
          const [kind, keywordRelevance] = data;
          emitter.addText(buf);
          buf = "";

          keywordHits[word] = (keywordHits[word] || 0) + 1;
          if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
          if (kind.startsWith("_")) {
            // _ implied for relevance only, do not highlight
            // by applying a class name
            buf += match[0];
          } else {
            const cssClass = language.classNameAliases[kind] || kind;
            emitKeyword(match[0], cssClass);
          }
        } else {
          buf += match[0];
        }
        lastIndex = top.keywordPatternRe.lastIndex;
        match = top.keywordPatternRe.exec(modeBuffer);
      }
      buf += modeBuffer.substring(lastIndex);
      emitter.addText(buf);
    }

    function processSubLanguage() {
      if (modeBuffer === "") return;
      /** @type HighlightResult */
      let result = null;

      if (typeof top.subLanguage === 'string') {
        if (!languages[top.subLanguage]) {
          emitter.addText(modeBuffer);
          return;
        }
        result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
        continuations[top.subLanguage] = /** @type {CompiledMode} */ (result._top);
      } else {
        result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
      }

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Use case in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      emitter.__addSublanguage(result._emitter, result.language);
    }

    function processBuffer() {
      if (top.subLanguage != null) {
        processSubLanguage();
      } else {
        processKeywords();
      }
      modeBuffer = '';
    }

    /**
     * @param {string} text
     * @param {string} scope
     */
    function emitKeyword(keyword, scope) {
      if (keyword === "") return;

      emitter.startScope(scope);
      emitter.addText(keyword);
      emitter.endScope();
    }

    /**
     * @param {CompiledScope} scope
     * @param {RegExpMatchArray} match
     */
    function emitMultiClass(scope, match) {
      let i = 1;
      const max = match.length - 1;
      while (i <= max) {
        if (!scope._emit[i]) { i++; continue; }
        const klass = language.classNameAliases[scope[i]] || scope[i];
        const text = match[i];
        if (klass) {
          emitKeyword(text, klass);
        } else {
          modeBuffer = text;
          processKeywords();
          modeBuffer = "";
        }
        i++;
      }
    }

    /**
     * @param {CompiledMode} mode - new mode to start
     * @param {RegExpMatchArray} match
     */
    function startNewMode(mode, match) {
      if (mode.scope && typeof mode.scope === "string") {
        emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
      }
      if (mode.beginScope) {
        // beginScope just wraps the begin match itself in a scope
        if (mode.beginScope._wrap) {
          emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
          modeBuffer = "";
        } else if (mode.beginScope._multi) {
          // at this point modeBuffer should just be the match
          emitMultiClass(mode.beginScope, match);
          modeBuffer = "";
        }
      }

      top = Object.create(mode, { parent: { value: top } });
      return top;
    }

    /**
     * @param {CompiledMode } mode - the mode to potentially end
     * @param {RegExpMatchArray} match - the latest match
     * @param {string} matchPlusRemainder - match plus remainder of content
     * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
     */
    function endOfMode(mode, match, matchPlusRemainder) {
      let matched = startsWith(mode.endRe, matchPlusRemainder);

      if (matched) {
        if (mode["on:end"]) {
          const resp = new Response(mode);
          mode["on:end"](match, resp);
          if (resp.isMatchIgnored) matched = false;
        }

        if (matched) {
          while (mode.endsParent && mode.parent) {
            mode = mode.parent;
          }
          return mode;
        }
      }
      // even if on:end fires an `ignore` it's still possible
      // that we might trigger the end node because of a parent mode
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, match, matchPlusRemainder);
      }
    }

    /**
     * Handle matching but then ignoring a sequence of text
     *
     * @param {string} lexeme - string containing full match text
     */
    function doIgnore(lexeme) {
      if (top.matcher.regexIndex === 0) {
        // no more regexes to potentially match here, so we move the cursor forward one
        // space
        modeBuffer += lexeme[0];
        return 1;
      } else {
        // no need to move the cursor, we still have additional regexes to try and
        // match at this very spot
        resumeScanAtSamePosition = true;
        return 0;
      }
    }

    /**
     * Handle the start of a new potential mode match
     *
     * @param {EnhancedMatch} match - the current match
     * @returns {number} how far to advance the parse cursor
     */
    function doBeginMatch(match) {
      const lexeme = match[0];
      const newMode = match.rule;

      const resp = new Response(newMode);
      // first internal before callbacks, then the public ones
      const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
      for (const cb of beforeCallbacks) {
        if (!cb) continue;
        cb(match, resp);
        if (resp.isMatchIgnored) return doIgnore(lexeme);
      }

      if (newMode.skip) {
        modeBuffer += lexeme;
      } else {
        if (newMode.excludeBegin) {
          modeBuffer += lexeme;
        }
        processBuffer();
        if (!newMode.returnBegin && !newMode.excludeBegin) {
          modeBuffer = lexeme;
        }
      }
      startNewMode(newMode, match);
      return newMode.returnBegin ? 0 : lexeme.length;
    }

    /**
     * Handle the potential end of mode
     *
     * @param {RegExpMatchArray} match - the current match
     */
    function doEndMatch(match) {
      const lexeme = match[0];
      const matchPlusRemainder = codeToHighlight.substring(match.index);

      const endMode = endOfMode(top, match, matchPlusRemainder);
      if (!endMode) { return NO_MATCH; }

      const origin = top;
      if (top.endScope && top.endScope._wrap) {
        processBuffer();
        emitKeyword(lexeme, top.endScope._wrap);
      } else if (top.endScope && top.endScope._multi) {
        processBuffer();
        emitMultiClass(top.endScope, match);
      } else if (origin.skip) {
        modeBuffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          modeBuffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          modeBuffer = lexeme;
        }
      }
      do {
        if (top.scope) {
          emitter.closeNode();
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== endMode.parent);
      if (endMode.starts) {
        startNewMode(endMode.starts, match);
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    function processContinuations() {
      const list = [];
      for (let current = top; current !== language; current = current.parent) {
        if (current.scope) {
          list.unshift(current.scope);
        }
      }
      list.forEach(item => emitter.openNode(item));
    }

    /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */
    let lastMatch = {};

    /**
     *  Process an individual match
     *
     * @param {string} textBeforeMatch - text preceding the match (since the last match)
     * @param {EnhancedMatch} [match] - the match itself
     */
    function processLexeme(textBeforeMatch, match) {
      const lexeme = match && match[0];

      // add non-matched text to the current mode buffer
      modeBuffer += textBeforeMatch;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      // we've found a 0 width match and we're stuck, so we need to advance
      // this happens when we have badly behaved rules that have optional matchers to the degree that
      // sometimes they can end up matching nothing at all
      // Ref: https://github.com/highlightjs/highlight.js/issues/2140
      if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
        // spit the "skipped" character that our regex choked on back into the output sequence
        modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
        if (!SAFE_MODE) {
          /** @type {AnnotatedError} */
          const err = new Error(`0 width match regex (${languageName})`);
          err.languageName = languageName;
          err.badRule = lastMatch.rule;
          throw err;
        }
        return 1;
      }
      lastMatch = match;

      if (match.type === "begin") {
        return doBeginMatch(match);
      } else if (match.type === "illegal" && !ignoreIllegals) {
        // illegal match, we do not continue processing
        /** @type {AnnotatedError} */
        const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || '<unnamed>') + '"');
        err.mode = top;
        throw err;
      } else if (match.type === "end") {
        const processed = doEndMatch(match);
        if (processed !== NO_MATCH) {
          return processed;
        }
      }

      // edge case for when illegal matches $ (end of line) which is technically
      // a 0 width match but not a begin/end match so it's not caught by the
      // first handler (when ignoreIllegals is true)
      if (match.type === "illegal" && lexeme === "") {
        // advance so we aren't stuck in an infinite loop
        modeBuffer += "\n";
        return 1;
      }

      // infinite loops are BAD, this is a last ditch catch all. if we have a
      // decent number of iterations yet our index (cursor position in our
      // parsing) still 3x behind our index then something is very wrong
      // so we bail
      if (iterations > 100000 && iterations > match.index * 3) {
        const err = new Error('potential infinite loop, way more iterations than matches');
        throw err;
      }

      /*
      Why might be find ourselves here?  An potential end match that was
      triggered but could not be completed.  IE, `doEndMatch` returned NO_MATCH.
      (this could be because a callback requests the match be ignored, etc)

      This causes no real harm other than stopping a few times too many.
      */

      modeBuffer += lexeme;
      return lexeme.length;
    }

    const language = getLanguage(languageName);
    if (!language) {
      error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
      throw new Error('Unknown language: "' + languageName + '"');
    }

    const md = compileLanguage(language);
    let result = '';
    /** @type {CompiledMode} */
    let top = continuation || md;
    /** @type Record<string,CompiledMode> */
    const continuations = {}; // keep continuations for sub-languages
    const emitter = new options.__emitter(options);
    processContinuations();
    let modeBuffer = '';
    let relevance = 0;
    let index = 0;
    let iterations = 0;
    let resumeScanAtSamePosition = false;

    try {
      if (!language.__emitTokens) {
        top.matcher.considerAll();

        for (;;) {
          iterations++;
          if (resumeScanAtSamePosition) {
            // only regexes not matched previously will now be
            // considered for a potential match
            resumeScanAtSamePosition = false;
          } else {
            top.matcher.considerAll();
          }
          top.matcher.lastIndex = index;

          const match = top.matcher.exec(codeToHighlight);
          // console.log("match", match[0], match.rule && match.rule.begin)

          if (!match) break;

          const beforeMatch = codeToHighlight.substring(index, match.index);
          const processedCount = processLexeme(beforeMatch, match);
          index = match.index + processedCount;
        }
        processLexeme(codeToHighlight.substring(index));
      } else {
        language.__emitTokens(codeToHighlight, emitter);
      }

      emitter.finalize();
      result = emitter.toHTML();

      return {
        language: languageName,
        value: result,
        relevance,
        illegal: false,
        _emitter: emitter,
        _top: top
      };
    } catch (err) {
      if (err.message && err.message.includes('Illegal')) {
        return {
          language: languageName,
          value: escape(codeToHighlight),
          illegal: true,
          relevance: 0,
          _illegalBy: {
            message: err.message,
            index,
            context: codeToHighlight.slice(index - 100, index + 100),
            mode: err.mode,
            resultSoFar: result
          },
          _emitter: emitter
        };
      } else if (SAFE_MODE) {
        return {
          language: languageName,
          value: escape(codeToHighlight),
          illegal: false,
          relevance: 0,
          errorRaised: err,
          _emitter: emitter,
          _top: top
        };
      } else {
        throw err;
      }
    }
  }

  /**
   * returns a valid highlight result, without actually doing any actual work,
   * auto highlight starts with this and it's possible for small snippets that
   * auto-detection may not find a better match
   * @param {string} code
   * @returns {HighlightResult}
   */
  function justTextHighlightResult(code) {
    const result = {
      value: escape(code),
      illegal: false,
      relevance: 0,
      _top: PLAINTEXT_LANGUAGE,
      _emitter: new options.__emitter(options)
    };
    result._emitter.addText(code);
    return result;
  }

  /**
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - secondBest (object with the same structure for second-best heuristically
    detected language, may be absent)

    @param {string} code
    @param {Array<string>} [languageSubset]
    @returns {AutoHighlightResult}
  */
  function highlightAuto(code, languageSubset) {
    languageSubset = languageSubset || options.languages || Object.keys(languages);
    const plaintext = justTextHighlightResult(code);

    const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name =>
      _highlight(name, code, false)
    );
    results.unshift(plaintext); // plaintext is always an option

    const sorted = results.sort((a, b) => {
      // sort base on relevance
      if (a.relevance !== b.relevance) return b.relevance - a.relevance;

      // always award the tie to the base language
      // ie if C++ and Arduino are tied, it's more likely to be C++
      if (a.language && b.language) {
        if (getLanguage(a.language).supersetOf === b.language) {
          return 1;
        } else if (getLanguage(b.language).supersetOf === a.language) {
          return -1;
        }
      }

      // otherwise say they are equal, which has the effect of sorting on
      // relevance while preserving the original ordering - which is how ties
      // have historically been settled, ie the language that comes first always
      // wins in the case of a tie
      return 0;
    });

    const [best, secondBest] = sorted;

    /** @type {AutoHighlightResult} */
    const result = best;
    result.secondBest = secondBest;

    return result;
  }

  /**
   * Builds new class name for block given the language name
   *
   * @param {HTMLElement} element
   * @param {string} [currentLang]
   * @param {string} [resultLang]
   */
  function updateClassName(element, currentLang, resultLang) {
    const language = (currentLang && aliases[currentLang]) || resultLang;

    element.classList.add("hljs");
    element.classList.add(`language-${language}`);
  }

  /**
   * Applies highlighting to a DOM node containing code.
   *
   * @param {HighlightedHTMLElement} element - the HTML element to highlight
  */
  function highlightElement(element) {
    /** @type HTMLElement */
    let node = null;
    const language = blockLanguage(element);

    if (shouldNotHighlight(language)) return;

    fire("before:highlightElement",
      { el: element, language });

    if (element.dataset.highlighted) {
      console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
      return;
    }

    // we should be all text, no child nodes (unescaped HTML) - this is possibly
    // an HTML injection attack - it's likely too late if this is already in
    // production (the code has likely already done its damage by the time
    // we're seeing it)... but we yell loudly about this so that hopefully it's
    // more likely to be caught in development before making it to production
    if (element.children.length > 0) {
      if (!options.ignoreUnescapedHTML) {
        console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
        console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
        console.warn("The element with unescaped HTML:");
        console.warn(element);
      }
      if (options.throwUnescapedHTML) {
        const err = new HTMLInjectionError(
          "One of your code blocks includes unescaped HTML.",
          element.innerHTML
        );
        throw err;
      }
    }

    node = element;
    const text = node.textContent;
    const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);

    element.innerHTML = result.value;
    element.dataset.highlighted = "yes";
    updateClassName(element, language, result.language);
    element.result = {
      language: result.language,
      // TODO: remove with version 11.0
      re: result.relevance,
      relevance: result.relevance
    };
    if (result.secondBest) {
      element.secondBest = {
        language: result.secondBest.language,
        relevance: result.secondBest.relevance
      };
    }

    fire("after:highlightElement", { el: element, result, text });
  }

  /**
   * Updates highlight.js global options with the passed options
   *
   * @param {Partial<HLJSOptions>} userOptions
   */
  function configure(userOptions) {
    options = inherit(options, userOptions);
  }

  // TODO: remove v12, deprecated
  const initHighlighting = () => {
    highlightAll();
    deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  };

  // TODO: remove v12, deprecated
  function initHighlightingOnLoad() {
    highlightAll();
    deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }

  let wantsHighlight = false;

  /**
   * auto-highlights all pre>code elements on the page
   */
  function highlightAll() {
    function boot() {
      // if a highlight was requested before DOM was loaded, do now
      highlightAll();
    }

    // if we are called too early in the loading process
    if (document.readyState === "loading") {
      // make sure the event listener is only added once
      if (!wantsHighlight) {
        window.addEventListener('DOMContentLoaded', boot, false);
      }
      wantsHighlight = true;
      return;
    }

    const blocks = document.querySelectorAll(options.cssSelector);
    blocks.forEach(highlightElement);
  }

  /**
   * Register a language grammar module
   *
   * @param {string} languageName
   * @param {LanguageFn} languageDefinition
   */
  function registerLanguage(languageName, languageDefinition) {
    let lang = null;
    try {
      lang = languageDefinition(hljs);
    } catch (error$1) {
      error("Language definition for '{}' could not be registered.".replace("{}", languageName));
      // hard or soft error
      if (!SAFE_MODE) { throw error$1; } else { error(error$1); }
      // languages that have serious errors are replaced with essentially a
      // "plaintext" stand-in so that the code blocks will still get normal
      // css classes applied to them - and one bad language won't break the
      // entire highlighter
      lang = PLAINTEXT_LANGUAGE;
    }
    // give it a temporary name if it doesn't have one in the meta-data
    if (!lang.name) lang.name = languageName;
    languages[languageName] = lang;
    lang.rawDefinition = languageDefinition.bind(null, hljs);

    if (lang.aliases) {
      registerAliases(lang.aliases, { languageName });
    }
  }

  /**
   * Remove a language grammar module
   *
   * @param {string} languageName
   */
  function unregisterLanguage(languageName) {
    delete languages[languageName];
    for (const alias of Object.keys(aliases)) {
      if (aliases[alias] === languageName) {
        delete aliases[alias];
      }
    }
  }

  /**
   * @returns {string[]} List of language internal names
   */
  function listLanguages() {
    return Object.keys(languages);
  }

  /**
   * @param {string} name - name of the language to retrieve
   * @returns {Language | undefined}
   */
  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  /**
   *
   * @param {string|string[]} aliasList - single alias or list of aliases
   * @param {{languageName: string}} opts
   */
  function registerAliases(aliasList, { languageName }) {
    if (typeof aliasList === 'string') {
      aliasList = [aliasList];
    }
    aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
  }

  /**
   * Determines if a given language has auto-detection enabled
   * @param {string} name - name of the language
   */
  function autoDetection(name) {
    const lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }

  /**
   * Upgrades the old highlightBlock plugins to the new
   * highlightElement API
   * @param {HLJSPlugin} plugin
   */
  function upgradePluginAPI(plugin) {
    // TODO: remove with v12
    if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
      plugin["before:highlightElement"] = (data) => {
        plugin["before:highlightBlock"](
          Object.assign({ block: data.el }, data)
        );
      };
    }
    if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
      plugin["after:highlightElement"] = (data) => {
        plugin["after:highlightBlock"](
          Object.assign({ block: data.el }, data)
        );
      };
    }
  }

  /**
   * @param {HLJSPlugin} plugin
   */
  function addPlugin(plugin) {
    upgradePluginAPI(plugin);
    plugins.push(plugin);
  }

  /**
   * @param {HLJSPlugin} plugin
   */
  function removePlugin(plugin) {
    const index = plugins.indexOf(plugin);
    if (index !== -1) {
      plugins.splice(index, 1);
    }
  }

  /**
   *
   * @param {PluginEvent} event
   * @param {any} args
   */
  function fire(event, args) {
    const cb = event;
    plugins.forEach(function(plugin) {
      if (plugin[cb]) {
        plugin[cb](args);
      }
    });
  }

  /**
   * DEPRECATED
   * @param {HighlightedHTMLElement} el
   */
  function deprecateHighlightBlock(el) {
    deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
    deprecated("10.7.0", "Please use highlightElement now.");

    return highlightElement(el);
  }

  /* Interface definition */
  Object.assign(hljs, {
    highlight,
    highlightAuto,
    highlightAll,
    highlightElement,
    // TODO: Remove with v12 API
    highlightBlock: deprecateHighlightBlock,
    configure,
    initHighlighting,
    initHighlightingOnLoad,
    registerLanguage,
    unregisterLanguage,
    listLanguages,
    getLanguage,
    registerAliases,
    autoDetection,
    inherit,
    addPlugin,
    removePlugin
  });

  hljs.debugMode = function() { SAFE_MODE = false; };
  hljs.safeMode = function() { SAFE_MODE = true; };
  hljs.versionString = version;

  hljs.regex = {
    concat: concat,
    lookahead: lookahead,
    either: either,
    optional: optional,
    anyNumberOfTimes: anyNumberOfTimes
  };

  for (const key in MODES) {
    // @ts-ignore
    if (typeof MODES[key] === "object") {
      // @ts-ignore
      deepFreeze(MODES[key]);
    }
  }

  // merge all the modes/regexes into our main object
  Object.assign(hljs, MODES);

  return hljs;
};

// Other names for the variable may break build script
const highlight = HLJS({});

// returns a new instance of the highlighter to be used for extensions
// check https://github.com/wooorm/lowlight/issues/47
highlight.newInstance = () => HLJS({});

module.exports = highlight;
highlight.HighlightJS = highlight;
highlight.default = highlight;


/***/ },

/***/ "2f3e26953260"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HighlightJS: () => (/* reexport default export from named module */ _lib_core_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("93831af7a993");
// https://nodejs.org/api/packages.html#packages_writing_dual_packages_while_avoiding_or_minimizing_hazards


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lib_core_js__WEBPACK_IMPORTED_MODULE_0__);


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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/
/************************************************************************/
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "js/" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "css/highlight.css";
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		const inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			let script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					const s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/
/******/
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			const onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				const doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode?.removeChild(script);
/******/ 				doneFns?.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			const timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		let scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		const document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript?.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					let i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			278704497785231: 0
/******/ 		};
/******/
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				let installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							const promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/
/******/ 							// start chunk loading
/******/ 							const url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							const error = new Error();
/******/ 							const loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										const errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										const realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/
/******/ 		// no prefetching
/******/
/******/ 		// no preloaded
/******/
/******/ 		// no HMR
/******/
/******/ 		// no HMR manifest
/******/
/******/ 		// no on chunks loaded
/******/
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/
/******/ 		}
/******/
/******/ 		const chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5f6c219571fc");
/* harmony import */ var _js_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("39863f24c52d");


})();

/******/ })()
;