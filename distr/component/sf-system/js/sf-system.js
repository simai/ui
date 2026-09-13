/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/***/ "715d840bc035"
(__unused_webpack_module, exports) {

var sft = SF || window.SF;
var SF = SF || window.SF || {};
window.SF = SF || {};

if (sft) {
  Object.keys(sft).forEach(key => {
    window.SF[key] = sft[key];
    SF[key] = sft[key];
  });
}

exports = window.SF;
exports = SF;

/***/ },

/***/ "5311642f54c9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ajax: () => (/* binding */ Ajax)
/* harmony export */ });
/* harmony import */ var _core_js_stableHash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("af3c1d41479b");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


/**
 *
 * @param {*} param
 * @param {*} callback
 * @param {*} calbackAfter
 */

function Ajax(param, callback = function () {}, calbackAfter = function () {}) {
  this.controller = null;
  /**
   * @description Обновление параметров
   * @param {object} param - передаваемые параметры
   */

  this.updateparam = function (param) {
    for (var key in param) this.param[key] = param[key];
  };

  this.isFunction = function (item) {
    if (typeof item === 'function') {
      return true;
    }

    var type = Object.prototype.toString.call(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  };

  this.isString = function (v) {
    return typeof v === 'string';
  };

  this.isEmptySource = function (script, src, source = 'js') {
    for (var k = 0; k < script.length; k++) {
      switch (source) {
        case 'js':
          if (script[k].src.indexOf(src) !== -1) {
            return true;
          }

          break;

        case 'css':
          if (script[k].href.indexOf(src) !== -1) {
            return true;
          }

          break;

        case 'js-line':
          if (script[k].innerHTML.indexOf(src) !== -1) {
            return true;
          }

          break;
      }
    }

    return false;
  };

  this.processHTML = function (data) {
    var r = {
      script: /<script([^>]*)>/ig,
      script_end: /<\/script>/ig,
      script_src: /src=["\']([^"\']+)["\']/i,
      script_type: /type=["\']([^"\']+)["\']/i,
      space: /\s+/,
      ltrim: /^[\s\r\n]+/g,
      rtrim: /[\s\r\n]+$/g,
      style: /<link.*?(rel="stylesheet"|type="text\/css")[^>]*>/i,
      style_href: /href=["\']([^"\']+)["\']/i
    };
    var matchScript,
        matchStyle,
        matchSrc,
        matchHref,
        matchType,
        scripts = [],
        styles = [];
    var textIndexes = [];
    var lastIndex = r.script.lastIndex = r.script_end.lastIndex = 0;
    var allDocScript = document.querySelectorAll('script[src]'),
        allDocCSS = document.querySelectorAll('link[href]'),
        aDocScriptLine = document.querySelectorAll('script:not([src])');

    while ((matchScript = r.script.exec(data)) !== null) {
      r.script_end.lastIndex = r.script.lastIndex;
      var matchScriptEnd = r.script_end.exec(data);

      if (matchScriptEnd === null) {
        break;
      }

      var skipTag = false;

      if ((matchType = matchScript[1].match(r.script_type)) !== null) {
        if (matchType[1] == 'text/html' || matchType[1] == 'text/template') {
          skipTag = true;
        }
      }

      if (skipTag) {
        textIndexes.push([lastIndex, r.script_end.lastIndex - lastIndex]);
      } else {
        textIndexes.push([lastIndex, matchScript.index - lastIndex]);
        var runFirst = this.param.scriptsRunFirst || matchScript[1].indexOf('bxrunfirst') != '-1';

        if ((matchSrc = matchScript[1].match(r.script_src)) !== null) {
          if (!this.isEmptySource(allDocScript, matchSrc[1].substr(0, matchSrc[1].lastIndexOf('.js') + 3))) {
            scripts.push({
              "runFirst": runFirst,
              "isInternal": false,
              "JS": matchSrc[1]
            });
          }
        } else {
          var start = matchScript.index + matchScript[0].length,
              start2 = matchScript.index;
          data.substr(start2, matchScriptEnd.index - start2 + 9);
          var js = data.substr(start, matchScriptEnd.index - start);

          if (!this.isEmptySource(aDocScriptLine, js, 'js-line')) {
            scripts.push({
              "runFirst": runFirst,
              "isInternal": true,
              "JS": js
            });
          }
        }
      }

      lastIndex = matchScriptEnd.index + 9;
      r.script.lastIndex = lastIndex;
    }

    textIndexes.push([lastIndex, lastIndex === 0 ? data.length : data.length - lastIndex]);
    var pureData = "";

    for (var i = 0, length = textIndexes.length; i < length; i++) {
      if (this.isString(data) && this.isFunction(data.substr)) {
        pureData += data.substr(textIndexes[i][0], textIndexes[i][1]);
      }
    }

    while ((matchStyle = pureData.match(r.style)) !== null) {
      if ((matchHref = matchStyle[0].match(r.style_href)) !== null && matchStyle[0].indexOf('media="') < 0) {
        if (!this.isEmptySource(allDocCSS, matchHref[1].substr(0, matchHref[1].lastIndexOf('.css') + 4), 'css')) {
          styles.push(matchHref[1]);
        }
      }

      pureData = pureData.replace(matchStyle[0], '');
    } //pureData = pureData.replace(/\r?\n/g, "");


    return {
      'HTML': pureData,
      'SCRIPT': scripts,
      'STYLE': styles
    };
  };

  this.isInternalScript = function (script) {
    var num = 0;

    for (var k = 0; k < script.length; k++) {
      if (!script[k].isInternal) {
        num++;
      }
    }

    return num;
  };

  this.loadJSDoc = script => {
    for (let k = 0; k < script.length; k++) {
      const hash = (0,_core_js_stableHash__WEBPACK_IMPORTED_MODULE_0__["default"])(script[k].JS.trim()).substring(0, 16);

      if (SF.Loader.phpScriptsLoaded.indexOf(hash) !== -1) {
        continue;
      }

      if (script[k].isInternal) {
        const sDoc = document.createElement('script');

        sDoc.onerror = function (e) {
          console.warn('Script failed to load:', e);
        };

        sDoc.type = 'text/javascript';
        sDoc.setAttribute('modalInlineScript', _this.param.url);
        sDoc.text = script[k].JS;
        document.head.append(sDoc);
      }
    }
  };

  this.loadJS = function (script) {
    this.lengthJS = this.isInternalScript(script);
    let arr = [];

    for (var k = 0; k < script.length; k++) {
      const hash = (0,_core_js_stableHash__WEBPACK_IMPORTED_MODULE_0__["default"])(script[k].JS).substring(0, 16);

      if (SF.Loader.phpScriptsLoaded.indexOf(hash) !== -1) {
        _this.lengthJS--;
        continue;
      }

      if (!script[k].isInternal) {
        let s = document.createElement('script');
        s.src = script[k].JS;
        s.setAttribute('modal-script', _this.param.url);

        s.onerror = function (e) {
          console.warn('Script failed to load:', e);
        };

        s.async = true;
        arr.push(new Promise(resolve => {
          s.addEventListener('load', () => {
            _this.lengthJS--;
            resolve();
          });
        }));
        document.head.append(s);
      }
    }

    return arr;
  };

  this.loadCSS = function (css) {
    this.lengthCSS = css.length ? css.length : 0;
    let arr = [];

    for (let k = 0; k < css.length; k++) {
      const hash = (0,_core_js_stableHash__WEBPACK_IMPORTED_MODULE_0__["default"])(css[k]).substring(0, 16);

      if (SF.Loader.phpScriptsLoaded.indexOf(hash) !== -1) {
        _this.lengthCSS--;
        continue;
      }

      let c = document.createElement('link');
      c.href = css[k];
      c.rel = 'stylesheet';
      c.type = 'text/css';
      arr.push(new Promise(resolve => {
        c.addEventListener('load', () => {
          _this.lengthCSS--;
          resolve();
        });
      }));
      document.head.append(c);
    }

    return arr;
  };

  this.emulateOnLoad = function (DATA) {
    if (this.param.emulateOnload) {
      SF.receive('SFAjaxLoadedResouce', window, function () {
        if (_this.lengthCSS <= 0 && _this.lengthJS <= 0) {
          _this.loadJSDoc(DATA.SCRIPT);

          SF.send('DOMContentLoaded', window);
          SF.send('load', window);
        }
      });

      if (this.lengthCSS <= 0 && this.lengthJS <= 0) {
        this.loadJSDoc(DATA.SCRIPT);
        SF.send('DOMContentLoaded', window);
        SF.send('load', window);
      }
    }
  };

  this.body = function () {
    let data;
    this.param.body.sfLoaded = {
      'frameworks': window.loadedFrameworks,
      'assets': window.loadedSfAssets
    };

    if (this.param.dataType == 'json') {
      data = JSON.stringify(this.param.body);
    } else {
      data = new FormData();

      for (var key in this.param.body) {
        data.append(key, this.param.body[key]);
      }
    }

    return data;
  };

  this.promise = function () {
    const request = {
      method: this.param.method,
      mode: this.param.mode,
      cache: this.param.cache,
      headers: this.param.headers,
      redirect: this.param.redirect,
      referrerPolicy: this.param.referrerPolicy
    };

    if (this.param.method !== 'GET') {
      request.body = this.body();
    }

    this.controller = new AbortController();
    request.signal = this.controller.signal;
    fetch(this.param.url, request).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      if (_this.param.dataType === 'json') {
        return response.json();
      } else {
        return response.text();
      }
    }).then(function (data) {
      if (_this.param.dataType === 'json') {
        callback(data);
      } else {
        var DATA = _this.processHTML(data);

        _this.loadCSS(DATA.STYLE);

        callback(DATA.HTML);

        _this.loadJS(DATA.SCRIPT);

        _this.emulateOnLoad(DATA);
      }
    }).catch(function (error) {
      if (error && error.name !== 'AbortError') {
        console.warn('SF.Ajax promise failed:', error);
      }
    }).finally(function () {
      calbackAfter();
      _this.controller = null;
    });
  };

  this.async = async function () {
    let paramFetch = {
      method: this.param.method,
      mode: this.param.mode,
      cache: this.param.cache,
      headers: this.param.headers,
      redirect: this.param.redirect,
      referrerPolicy: this.param.referrerPolicy
    };

    if (this.param.method !== 'GET') {
      paramFetch.body = this.body();
    }

    this.controller = new AbortController();
    paramFetch.signal = this.controller.signal;

    try {
      var response = await fetch(this.param.url, paramFetch);

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      let data, DATA;

      if (this.param.dataType === 'json') {
        data = await response.json();
        callback(data);
      } else {
        data = await response.text(), DATA = this.processHTML(data);
        let resolver = [...this.loadCSS(DATA.STYLE), ...this.loadJS(DATA.SCRIPT)];
        Promise.all(resolver).then(() => {
          callback(DATA.HTML);
          this.emulateOnLoad(DATA);
          this.filterHash(DATA);
        });
      }
    } catch (error) {
      if (error && error.name !== 'AbortError') {
        console.warn('SF.Ajax async failed:', error);
      }
    } finally {
      calbackAfter();
      this.controller = null;
    }
  };

  this.abort = function () {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  };

  this.filterHash = items => {
    Object.keys(items).forEach(key => {
      if (['SCRIPT', 'STYLE'].indexOf(key) !== -1) {
        items[key].length && items[key].forEach(item => {
          const content = key === 'SCRIPT' ? item.JS : item;
          const hash = (0,_core_js_stableHash__WEBPACK_IMPORTED_MODULE_0__["default"])(content).substring(0, 16);

          if (SF.Loader.phpScriptsLoaded.indexOf(hash) === -1) {
            SF.Loader.phpScriptsLoaded.push(hash);
          }
        });
      }
    });
  };

  this.param = {
    url: false,
    method: 'GET',
    // *GET, POST, PUT, DELETE, etc.
    mode: 'same-origin',
    // no-cors, *cors, same-origin
    cache: 'no-cache',
    // *default, no-cache, reload, force-cache, only-if-cached
    redirect: 'follow',
    // manual, *follow, error
    referrerPolicy: 'no-referrer',
    // no-referrer, *client
    body: {},
    dataType: 'html',
    // type of data loading: xml, json, script, or html
    async: true,
    // whether request is asynchronous or not
    scriptsRunFirst: true,
    // whether to run _all_ found scripts before onsuccess call. script tag can have an attribute "bxrunfirst" to turn  this flag on only for itself
    emulateOnload: true,
    headers: {//'Content-Type': 'text/plain;charset=utf-8',
      //'Content-Type'  : 'text/html;charset=utf-8',
      //'Content-Type': 'application/json;charset=utf-8',
    } //timeout: 0, // request timeout in seconds. 0 for browser-default
    //processData     : true, // any data processing is disabled if false, only callback call
    //skipAuthCheck: false, // whether to check authorization failure (SHOUD be set to true for CORS requests)
    //start: true, // send request immediately (if false, request can be started manually via XMLHttpRequest object returned)
    //----cache: true, // whether NOT to add random addition to URL
    //preparePost: true, // whether set Content-Type x-www-form-urlencoded in POST
    //----headers: false, // add additional headers, example: [{'name': 'If-Modified-Since', 'value': 'Wed, 15 Aug 2012 08:59:08 GMT'}, {'name': 'If-None-Match', 'value': '0'}]
    //lsTimeout: 30, //local storage data TTL. useless without lsId.
    //lsForce: false, //wheter to force query instead of using localStorage data. useless without lsId.

  };

  var _this = this;

  this.lengthJS = 0;
  this.lengthCSS = 0;
  this.updateparam(param);
  if (this.param.dataType === 'json') this.param.headers['Content-Type'] = 'application/json';
  if (this.param.async) this.async();else this.promise();
}
SF.Ajax = Ajax;
Ajax.componentName = 'SF.Ajax';
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('SF.Ajax', Ajax);

/***/ },

/***/ "7921ad32f3b8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ cloneDeep)
/* harmony export */ });
function cloneDeep(target, object) {
  for (let key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (typeof object[key] == 'object' && object[key].nodeName == undefined) {
        if (!target[key]) {
          target[key] = {};
        }

        SF.cloneDeep(target[key], object[key]);
      } else {
        target[key] = object[key];
      }
    }
  }

  return target;
}
SF.cloneDeep = cloneDeep;

/***/ },

/***/ "8a72b9062657"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ curpos)
/* harmony export */ });
/**
 * Определение поциции текущего элемента
 * @param {*} e - элемент
 * @param {*} relative - проверять на position:relative
 */
function curpos(e, relative = false) {
  if (!e) {
    return new DOMRect().toJSON();
  }

  if (e.ownerDocument === document && !relative) {
    const clientRect = e.getBoundingClientRect();
    const root = document.documentElement;
    const {
      body
    } = document;
    return {
      top: Math.round(clientRect.top + (root.scrollTop || body.scrollTop)),
      left: Math.round(clientRect.left + (root.scrollLeft || body.scrollLeft)),
      width: Math.round(e.offsetWidth),
      //clientRect.right - clientRect.left),
      height: Math.round(e.offsetHeight),
      //clientRect.bottom - clientRect.top),
      right: Math.round(clientRect.right + (root.scrollLeft || body.scrollLeft)),
      bottom: Math.round(clientRect.bottom + (root.scrollTop || body.scrollTop))
    };
  }

  let x = 0;
  let y = 0;
  const w = e.offsetWidth;
  const h = e.offsetHeight;
  let first = true;

  for (; e != null; e = e.offsetParent) {
    if (!first && relative && getComputedStyle(e).position == 'relative') {
      break;
    }

    x += e.offsetLeft;
    y += e.offsetTop;

    if (first) {
      first = false;
      continue;
    }

    x += Text.toNumber(Dom.style(e, 'border-left-width'));
    y += Text.toNumber(Dom.style(e, 'border-top-width'));
  }

  return new DOMRect(x, y, w, h).toJSON();
}
SF.curpos = curpos;

/***/ },

/***/ "2f801cd66f59"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   receive: () => (/* binding */ receive)
/* harmony export */ });
function receive(event, el, handler) {
  if (window.addEventListener) el.addEventListener(event, handler, false);else if (window.attachEvent) el.attachEvent(event, handler);
}
SF.receive = receive;

/***/ },

/***/ "0ae8d251b011"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   send: () => (/* binding */ send)
/* harmony export */ });
async function send(event, element) {
  return new Promise(resolve => {
    let e;

    if (document.createEvent) {
      e = new Event(event, {
        bubbles: true,
        cancelable: false
      });
    } else if (document.createEventObject()) {
      e = document.createEventObject();
    } else {
      resolve(true);
      return;
    }

    if (element.dispatchEvent) {
      element.dispatchEvent(e);
    } else if (element.fireEvent) element.fireEvent(event, e);

    resolve(true);
  });
}
SF.send = send;

/***/ },

/***/ "67ddc89de2b1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _01_namespace_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("715d840bc035");
/* harmony import */ var _01_namespace_namespace__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_01_namespace_namespace__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _param_param__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4aa63cadf785");
/* harmony import */ var _ajax_ajax__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5311642f54c9");
/* harmony import */ var _method__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("75982243b0b9");
/* harmony import */ var _search_search__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("9b273e005a89");
/* harmony import */ var _init_init__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2fe7271a6f46");
/* harmony import */ var _init_init__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_init_init__WEBPACK_IMPORTED_MODULE_5__);







/***/ },

/***/ "2fe7271a6f46"
() {

window.addEventListener('sf-loader-ready', () => {
  new SF.Search({
    modal: '[sf-modal]',
    gallery: '[sf-gallery]',
    overbox: '[sf-overbox]'
  }, {
    init: '[sf-modal]',
    overlay: 'fixed w-full h-full top-0 right-0 bottom-0 left-0 items-cross-center content-main-center bg-surface-transparent-overlay',
    area: 'relative w-10/12 sm:w-10/12 w-2/3 lg:w-1/2 xl:w-1/2',
    content: 'overflow-hidden border-0 radius-default p-2 bg-surface-1',
    close: {
      active: true,
      modifier: 'sf-close transition'
    }
  });
});

/***/ },

/***/ "75982243b0b9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _event_send_send__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0ae8d251b011");
/* harmony import */ var _event_receive_receive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2f801cd66f59");
/* harmony import */ var _ready_ready__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d55d5a9f332f");
/* harmony import */ var _cloneDeep_cloneDeep__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("7921ad32f3b8");
/* harmony import */ var _topZIndex_topZIndex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("3c20a622792e");
/* harmony import */ var _quickkey_quickkey__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("178f21c97b5d");
/* harmony import */ var _curpos_curpos__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("8a72b9062657");
// Event

 // DOM Load

 //






/***/ },

/***/ "4aa63cadf785"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Param)
/* harmony export */ });
function Param() {}
SF.Param = Param;

/***/ },

/***/ "178f21c97b5d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   quickkey: () => (/* binding */ quickkey)
/* harmony export */ });
/**
 * quickkey() - функция обработки нажатия клавиши и выполнения функции обработчика
 * @param {*} handler - функция обработчик события нажатия клавиши
 * @param {*} key - клавиша после нажатия которой срабатывает функция обрботчик
 */
function quickkey(handler, key) {
  addEventListener('keydown', function (e) {
    if (e.code == key) handler(e);
  });
}
SF.quickkey = quickkey;

/***/ },

/***/ "d55d5a9f332f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ready),
/* harmony export */   isReady: () => (/* binding */ isReady)
/* harmony export */ });
let stack = [];
let isReady = false;
function ready(handler = function () {}) {
  switch (document.readyState) {
    case 'loading':
      stack.push(handler);
      break;

    case 'interactive':
    case 'complete':
      if (typeof handler == 'function') {
        handler();
      }

      isReady = true;
      break;

    default:
      break;
  }
}
document.addEventListener('readystatechange', () => {
  if (!isReady) {
    stack.forEach(ready);
    stack = [];
  }
});
SF.ready = ready;

/***/ },

/***/ "9b273e005a89"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Search: () => (/* binding */ Search)
/* harmony export */ });
/**
 *  Modal search module
 * @description Модуль поиска и обнаружения модальных окон
 * @param {*} e - массив атрибутов элементов для поиска в DOM дереве
 * @param {*} param
 */
//SF.Search = function(e = {modal:'[sf-modal]'}, param) {
function Search(e = {
  modal: '[sf-modal]'
}, param) {
  var _s = this;

  var searchLiveStart = false;
  /**
   * @description Обновление параметров
   * @param {object} param - передаваемые параметры
   */

  _s.updateparam = function (param) {
    for (let key in param) {
      _s.param[key] = param[key];
    }
  };

  _s.uParam = function (param, prev) {
    for (let key in param) {
      prev[key] = param[key];
    }

    return prev;
  };

  _s.noCloneInit = function (e, key) {
    for (let k = 0; k < _s.init[key]['el'].length; k++) {
      if (_s.init[key]['el'][k] == e) {
        return false;
      }
    }

    return true;
  };

  _s.attrParamUpdate = function (e) {
    let param = {},
        value = '';
    Object.assign(param, _s.param);

    for (let kParam in _s.param.data) {
      if (e.hasAttribute(_s.param.data[kParam])) {
        value = e.getAttribute(_s.param.data[kParam]);

        switch (kParam) {
          case 'hide':
            param[kParam].active = true;
            param[kParam].modifier = value ? value : param[kParam].modifier;
            break;

          case 'close':
            param[kParam].active = true;
            param[kParam].modifier = value ? value : param[kParam].modifier;
            break;

          case 'close-modifier':
            param['close'].active = true;
            param['close'].modifier = value ? value : param['close'].modifier;
            break;

          case 'load':
            param[kParam].active = true;
            break;

          case 'tooltip':
            {
              let overlay = e.getAttribute(_s.param.data.overlay),
                  area = e.getAttribute(_s.param.data.area),
                  content = e.getAttribute(_s.param.data.content);
              param[kParam].active = true;
              param[kParam].position = value ? value : param[kParam].position;
              param[kParam].overlay = overlay ? overlay : param[kParam].overlay;
              param[kParam].area = area ? area : param[kParam].area;
              param[kParam].content = content ? content : param[kParam].content;
              break;
            }

          case 'pointer':
            param[kParam].active = value !== 'false';

            if (value !== 'true' && value !== 'false' && value !== true && value) {
              param[kParam].modifier = value ? value : param[kParam].modifier;
            }

            break;

          default:
            param[kParam] = value ? value : true;
            break;
        }
      } else {
        param[kParam] = _s.param[kParam];
      }
    }

    return param;
  };

  _s.collection = function (map, key, e) {
    let obGallery = {};

    if (map.has(key) && key != '') {
      obGallery = map.get(key);
      obGallery.elements.push(e);
      map.set(key, obGallery);
      obGallery.container.append(obGallery.item(e));
    } else {
      obGallery = new SF.Gallery(e.e, [e], _s.attrParamUpdate(e.e));
      obGallery.elements = [e];
      map.set(key, obGallery);
    }
  };
  /**
   *
   * @param {*} e
   * @param {*} mod
   */


  _s.commonInit = function (e, mod) {
    switch (mod) {
      case 'modal':
        _s.init.modal.el.push(e);

        if (SF) {
          if (SF.Modal) {
            new SF.Modal(e, _s.attrParamUpdate(e));
          }
        }

        break;

      case 'gallery':
        {
          let atr = _s.eSearch[mod].replace(/[\[\]]/g, ''),
              // Пересмотреть
          aV = e.getAttribute(atr),
              src = e.getAttribute('href') ? e.getAttribute('href') : e.getAttribute('src'),
              mode = e.getAttribute('sf-mode') ? e.getAttribute('sf-mode') : 'image';

          _s.init.gallery.el.push(e);

          let obj = {
            e: e,
            param: _s.attrParamUpdate(e),
            src: src,
            mode: mode,
            gallery: aV
          };

          _s.collection(_s.init.gallery.map, aV, obj);

          break;
        }

      case 'overbox':
        _s.init.overbox.el.push(e);

        if (SF) {
          if (SF.Overbox) {
            new SF.Overbox(e, _s.attrParamUpdate(e));
          }
        }

        break;
    }
  };

  _s.searchInit = function () {
    for (let key in _s.eSearch) {
      let element = document.querySelectorAll(_s.eSearch[key]);

      if (element) {
        element.forEach(item => {
          if (_s.noCloneInit(item, key)) {
            _s.commonInit(item, key);
          }
        });
      }
    }

    searchLiveStart = true;
  };

  _s.search = function () {
    let callback = function (change) {
      change.map(function (e) {
        if (searchLiveStart) {
          for (let key in _s.eSearch) {
            let mTarget = e.target.matches(_s.eSearch[key]);

            if (mTarget) {
              if (_s.noCloneInit(e.target, key)) {
                _s.commonInit(e.target, key);
              }
            }

            let mChildTarget = e.target.querySelectorAll(_s.eSearch[key]);

            if (mChildTarget.length > 0) {
              for (let k = 0; k < mChildTarget.length; k++) {
                if (_s.noCloneInit(mChildTarget[k], key)) {
                  _s.commonInit(mChildTarget[k], key);
                }
              }
            }
          }
        }
      });
    },
        watchDOM = new MutationObserver(callback),
        options = {
      childList: true,
      subtree: true,
      attributeFilter: ['sf-modal', 'sf-gallery', 'sf-overbox']
    };

    watchDOM.observe(document, options);
  };

  _s.init = {
    modal: {
      el: []
    },
    gallery: {
      el: [],
      map: new Map()
    },
    overbox: {
      el: []
    }
  };
  _s.eSearch = {
    modal: '[sf-modal]',
    gallery: '[sf-gallery]',
    overbox: '[sf-overbox]'
  };
  _s.param = {
    loadtimeout: '1000',
    // Отсрочка загрузки до появления контента в ms
    width: 'auto',
    // Ширина
    height: 'auto',
    // Высота
    name: false,
    // Наименование
    src: false,
    // Путь до загрузжаемого файла - по умолчанию пусто
    iframe: false,
    // Модальное в виде фрейма
    blur: false,
    // Размытие контента
    // Предварительная загрузка контента - три режима - hide-скрыто (default),
    // - show-открыто, - collapsed-свернуто,
    autoload: false,
    unclose: false,
    // Принудительный кэш данных
    action: 'click',
    // Показывать при клике (click) или при наведении (hover)
    mode: 'ajax',
    // Режим загрузки данных (параметр src, атрибут sf-src) по умолчанию ajax, также inline - объект по селлектору, и gallery - фотогалерея
    init: '[sf-modal]',
    // Селектор инициализации модального окна
    service: '[data-name*="sf-service-bottom-area"]',
    // Контейнер для вставки
    page: '[data-name*="sf-pagewrap-area"]',
    // Основная область страницы для blur
    container: '.sf-modal-container',
    // Модификаторы подложки модального окна
    overlay: 'sf-modal-overlay fixed w-full h-full top-0 inline-end-0 bottom-0 inline-start-0 items-cross-center content-main-center bg-surface-transparent-overlay',
    'overlay-close': false,
    area: 'sf-modal-area relative w-10/12 sm:w-10/12 w-2/3 lg:w-1/2 xl:w-1/2',
    // Модификаторы контейнера контентной части
    // Модификаторы контентной части
    content: 'sf-modal-content overflow-auto border-0 bg-surface-1 p-6',
    html: false,
    beforeCreateWindow: function () {},
    // Перед созданием
    beforeContentUpload: function () {},
    // Перед загрузкой контента
    afterContentUpload: function () {},
    // После загрузки контента
    beforeOpenWindow: function () {},
    // Перед открытием
    afterOpenWindow: function () {},
    // После открытия
    beforeHideWindow: function () {},
    // Перед тем как свернуть
    beforeShowWindow: function () {},
    // Перед тем как развернуть
    // Перед закрытием
    beforeCloseWindow: function () {},
    // Модальное окно в виде подсказки. Позиция top, right, bottom,
    // left по отношению инициализатора и auto - адаптивный, значение по
    // умолчанию
    tooltip: {
      active: false,
      // Активность
      position: 'bottom',
      // Положение
      overlay: 'absolute flex-col items-cross-start',
      area: 'w-full bg-surface-0 overflow-auto p-4 shadow-3 border-1 radius-3 border-gray-3',
      content: 'w-full'
    },
    load: {
      active: true,
      // Добавляем | убираем анимацию загрузки контента
      html: '<div class="sf-progress"><div class="sf-progress-animation"></div></div>' // Верстка анимации загрузки контента

    },
    pointer: {
      active: false,
      html: ''
    },
    close: {
      active: true,
      modifier: 'sf-close transition' // Модификаторы кнопки закрыть модальное окно

    },
    hide: {
      active: false,
      modifier: 'cursor-pointer absolute top-b6 inline-end-d0 w-b6 h-b6 z-1 opacity-4 transition border-0 bg-transparent before:content-empty before:absolute before:inline-start-0 before:h-a2 before:w-full before:bg-gray-9'
    },
    event: {
      // Перед созданием
      beforeCreateWindow: 'SFModalBeforeCreateWindow',
      // Перед загрузкой контента
      beforeContentUpload: 'SFModalBeforeContentUpload',
      afterContentUpload: 'SFModalAfterContentUpload',
      // После загрузки контента
      beforeOpenWindow: 'SFModalBeforeOpenWindow',
      // Перед открытием
      afterOpenWindow: 'SFModalAfterOpenWindow',
      // После открытия
      beforeHideWindow: 'SFModalBeforeHideWindow',
      // Перед тем как свернуть
      beforeShowWindow: 'SFModalBeforeShowWindow',
      // Перед тем как развернуть
      beforeCloseWindow: 'SFModalBeforeCloseWindow',
      // Перед закрытием
      animationLoadHidden: 'SFModalAnimationLoadHidden',
      // Скрыть анимацию загрузки
      animationLoadShow: 'SFModalAnimationLoadShow' // Показать анимацию загрузки

    },
    data: {
      action: 'sf-action',
      pointer: 'sf-pointer',
      width: 'sf-width',
      height: 'sf-height',
      name: 'sf-name',
      src: 'sf-src',
      overlay: 'sf-overlay-modifier',
      // overlay
      'overlay-close': 'sf-overlay-close',
      area: 'sf-modal-modifier',
      // area
      content: 'sf-content-modifier',
      // content
      close: 'sf-close',
      'close-modifier': 'sf-close-modifier',
      // close
      hide: 'sf-hide',
      'hide-modifier': 'sf-hide-modifier',
      blur: 'sf-blur',
      autoload: 'sf-autoload',
      // Предварительная загрузка контента
      unclose: 'sf-unclose',
      // Принудительный кэш данных
      tooltip: 'sf-tooltip',
      overbox: 'sf-overbox',
      mode: 'sf-mode',
      iframe: 'sf-iframe'
    }
  }; //_s.overbox = {};
  //SF.extend(_s.param, SF.Param.Modal);
  //SF.extend(_s.overbox, SF.Param.Overbox);

  /*_s.param.data = {
      action              : 'sf-action',
      width               : 'sf-width',
      height              : 'sf-height',
      name                : 'sf-name',
      src		            : 'sf-src',
      overlay	            : 'sf-overlay-modifier',    // overlay
      area	            : 'sf-modal-modifier',      // area
      content	            : 'sf-content-modifier',    // content
      close               : 'sf-close',
      'close-modifier'    : 'sf-close-modifier',      // close
      hide                : 'sf-hide',
      'hide-modifier'     : 'sf-hide-modifier',
      blur	            : 'sf-blur',
      autoload            : 'sf-autoload',        // Предварительная загрузка контента
      unclose             : 'sf-unclose',        // Принудительный кэш данных
      tooltip             : 'sf-tooltip',
      overbox             : 'sf-overbox',
      mode                : 'sf-mode',
      iframe	            : 'sf-iframe',
  };*/

  SF.cloneDeep(_s.param, param); //_s.updateparam(param);
  //_s.uParam(e, _s.eSearch);

  Object.assign(e, _s.eSearch);
  Object.freeze(_s.param);
  Object.freeze(_s.eSearch);

  if (document) {
    _s.search();

    document.addEventListener('DOMContentLoaded', () => {
      searchLiveStart = true;
    });
    document.addEventListener('load', () => {
      searchLiveStart = true;
    });

    _s.searchInit();
  }
}
SF.Search = Search;

/***/ },

/***/ "3c20a622792e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   topZIndex: () => (/* binding */ topZIndex)
/* harmony export */ });
function topZIndex() {
  let maxZ = 0;
  document.querySelectorAll('body *').forEach(el => {
    const z = Number(window.getComputedStyle(el).zIndex);

    if (!isNaN(z)) {
      maxZ = Math.max(maxZ, Number(z));
    }
  });
  return maxZ;
}
SF.topZIndex = topZIndex;

/***/ },

/***/ "af3c1d41479b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("67ddc89de2b1");

})();

/******/ })()
;