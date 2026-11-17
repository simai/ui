/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/***/ "f253d6b93335"
() {

SF.__internal.send = async function (event, element) {
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
};
/* ============================= */


SF.Events = function () {
  /**
   * Метод send() - Отправляет событие
   * @param {*} event
   */
  this.send = function (event, element) {
    let e;

    if (document.createEvent) {
      e = document.createEvent('Events');
      e.initEvent(event, true, false);
    } else if (document.createEventObject()) {
      e = document.createEventObject();
    } else return;

    if (element.dispatchEvent) {
      element.dispatchEvent(e);
    } else if (element.fireEvent) element.fireEvent(event, e);
  };
  /**
   * Метод receive() - регистрирует обработчик события
   * @param {*} event
   * @param {*} handler
   */


  this.receive = function (event, el, handler) {
    if (window.addEventListener) {
      el.addEventListener(event, handler, false);
    } else if (window.attachEvent) {
      el.attachEvent(event, handler);
    }
  };
  /**
   * hotkey() - функция обработки нажатия нескольких клавиш и выполнения фукций обработчика
   * @param {*} handler - функтция обработчик события нажатия клавиш
   * @param {*} далее может следовать любое количество кодов сочетания клавиш в
   * кавычках ("17")
   */


  this.hotkey = function (handler) {
    const codes = [].slice.call(arguments, 1);
    let pressed = {};
    document.addEventListener('keydown', function (e) {
      e = e || window.event;
      pressed[e.keyCode] = true;

      for (let i = 0; i < codes.length; i++) {
        if (!pressed[codes[i]]) return;
      }

      pressed = {};
      handler();
    });
    document.addEventListener('keyup', function (e) {
      e = e || window.event;
      delete pressed[e.keyCode];
    });
  };
  /**
   * quickkey() - функция обработки нажатия клавиши и выполнения функции обработчика
   * @param {*} handler - функция обработчик события нажатия клавиши
   * @param {*} key - клавиша после нажатия которой срабатывает функция обрботчик
   */


  this.quickkey = function (handler, key) {
    addEventListener('keydown', function (e) {
      if (e.keyCode == key) {
        handler(e);
      }
    });
  };

  SF.Methods.call(this);
};

/***/ },

/***/ "35142b0e629d"
() {

/*============================= */
SF.Methods = function () {
  /**
   * extend() -
   * @param {*} defaults
   * @param {*} options
   */
  this.extend = function (defaults, options) {
    for (var key in options) if (Object.prototype.hasOwnProperty.call(options, key)) if (Object.prototype.toString.call(options[key]) == '[object Object]') this.extend(defaults[key], options[key]);else defaults[key] = options[key];

    return defaults;
  };
  /**
   * Поиск наивысшего z-index в документе
   */


  this.topZIndex = function () {
    var e = document.querySelectorAll('*'),
        z = 1,
        style = '';

    for (var k = 0; k < e.length; k++) {
      style = getComputedStyle(e[k]);
      if (parseInt(style.zIndex) > z) z = parseInt(style.zIndex);
    }

    return z;
  };

  this.topZIndexElement = function (el) {
    var z = 1,
        e = false,
        style = '';

    for (var k = 0; k < el.length; k++) {
      style = getComputedStyle(el[k]);

      if (parseInt(style.zIndex) > z) {
        z = parseInt(style.zIndex);
        e = el[k];
      }
    }

    return e;
  };
  /**
   *
   */


  this.includeScript = function (path) {
    var s = document.createElement('script');
    s.src = path;
    document.querySelector('head').appendChild(s);
  };

  this.addcss = function (path) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = path;
    document.querySelector('head').appendChild(l);
    return l;
  };
  /**
   *
   */


  this.cookies = {
    /**
     * get() - получить куки
     */
    get: function (name) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(name + '=');

        if (start != -1) {
          start = start + name.length + 1;
          var end = document.cookie.indexOf(';', start);
          if (end == -1) end = document.cookie.length;
          return encodeURI(document.cookie.substring(start, end));
        }
      }

      return '';
    },

    /**
     * set() - установить куки
     */
    set: function (name, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie = name + '=' + decodeURI(value) + (expiredays == null ? '' : '; expires=' + exdate.toUTCString()) + '; path=/';
    },

    /**
     * check() - Проверка установлен ли параметр куки
     */
    check: function (name) {
      name = this.cookie.get(name);
      if (name != null && name != '') return true;else return false;
    }
  };

  this.bytelength = function (str) {
    var count = 0,
        ch = 0;

    for (var k = 0; k < str.length; k++) {
      ch = str.charCodeAt(k);
      if (ch <= 127) count++;else if (ch <= 2047) count += 2;else if (ch <= 65535) count += 3;else if (ch <= 2097151) count += 4;else if (ch <= 67108863) count += 5;else count += 6;
    }

    return count;
  };

  this.bytelengthlimit = function (str, limit) {
    var count = 0,
        ch = 0,
        strlimit = '',
        flaglimit = false,
        result = [];

    for (var k = 0; k < str.length; k++) {
      ch = str.charCodeAt(k);

      if (count <= limit) {
        flaglimit = true;
      }

      strlimit += str[k];
      if (ch <= 127) count++;else if (ch <= 2047) count += 2;else if (ch <= 65535) count += 3;else if (ch <= 2097151) count += 4;else if (ch <= 67108863) count += 5;else count += 6;

      if (count > limit && flaglimit || flaglimit && k == str.length - 1) {
        //console.log(strlimit)
        result.push(strlimit);
        strlimit = '';
        count = 0;
        flaglimit = false;
      }
    } //console.log(result.length)


    if (result.length > 0) {
      //result.push(strlimit);
      return result;
    } else {
      result.push(strlimit);
      return result;
    }
  };
};

/***/ },

/***/ "1935cdb080e3"
() {

/**
 * Blocks - модуль распределения обязанностей
 */
SF.Blocks = function () {
  var _this = this;

  if (this.stack.ev('providerend')) {
    this.receive('providerend', window, function (e) {
      _this.send(e.target.event, e.target);
    });
    this.stack.events.push('providerend');
  }

  if (this.stack.ev('blocksstart')) {
    this.receive('blocksstart', window, function (e) {
      _this.send('providerstart', e.target);
    });
    this.stack.events.push('blocksstart');
  }
};

/***/ },

/***/ "a912dc962a61"
() {

SF.Controller = function () {
  // Constructor
  this.stack = SF.Controller.Stack;

  var _this = this; // Подключение модулей


  SF.Events.call(this);
  SF.Search.call(this);
  SF.Blocks.call(this);
  SF.Provider.call(this); //SF.Property.call(this);

  if (this.el) {
    this.send('blocksstart', this.el);
  } else {
    if (this.stack.ev('specialinit')) {
      this.receive('specialinit', window, function (e) {
        new SF.Special(e.target, e.target.params);
      });
      this.stack.events.push('specialinit');
    }

    if (this.stack.ev('searchend')) {
      this.receive('searchend', window, function (e) {
        _this.send('blocksstart', e.target);
      });
      this.send('searchstart', window);
      this.stack.events.push('searchend');
    }
  } // end Constructor

};

/***/ },

/***/ "5dcf727c65f8"
() {

SF.Parameters = function () {
  /**
   * newparams - генерация новых параметров
   */
  this.newparams = function () {
    return this.params;
  };
  /**
   * Обновление существующих параметров
   * @param {*} el
   */


  this.updateparams = function (el) {
    var par = el.params,
        mod = par.modifier,
        data = par.data;

    for (var key in mod) {
      mod[key] = el.hasAttribute(data[key]) ? mod[key] + ' ' + el.getAttribute(data[key]) : mod[key];
    }
  }; // ================ CONSTRUCTOR ================ //


  this.params = {
    ajax: {
      events: {
        init: 'ajaxinit',
        load: 'endcontentload'
      },
      method: 'GET',
      type: 'html',
      timeout: 0,
      async: true,
      emulateOnload: true,
      cache: true
    },
    controller: {},
    search: {},
    provider: {},
    blocks: {
      special: {
        cookies: {
          specialfont: 'default',
          specialstate: 'off',
          specialcolor: 'specialwhite',
          specialkegl: '16',
          specialinterval: '1',
          specialkerning: 'normal',
          specialimage: 'off',
          specialup: 'down',
          specialsound: 'off'
        },
        events: {
          init: 'specialinit',
          create: 'specialcreate',
          open: 'specialopen',
          close: 'specialoff',
          up: 'specialup',
          soundon: 'specialsoundon',
          soundoff: 'specialsoundoff',
          defaultsetting: 'specialdefaultsetting',
          // === События панели Special
          fontsans: 'specialfontsans',
          fontserif: 'specialfontserif',
          fontmono: 'specialfontmono',
          keglmore: 'specialkeglmore',
          keglless: 'specialkeglless',
          intervalone: 'specialintervalone',
          intervalhalf: 'specialintervalhalf',
          intervaltwo: 'specialintervaltwo',
          imageoff: 'specialimageoff',
          imageblack: 'specialimageblack',
          imagecolor: 'specialimagecolor',
          colorwhite: 'specialcolorwhite',
          colorblack: 'specialcolorblack',
          coloryellow: 'specialcoloryellow',
          colorblue: 'specialcolorblue',
          colorgreen: 'specialcolorgreen',
          kerningnormal: 'specialkerningnormal',
          kerningmiddle: 'specialkerningmiddle',
          kerningbig: 'specialkerningbig'
        },
        data: {
          init: 'sf-special',
          panel: 'sf-special-panel',
          kegl: 'sf-special-kegl',
          interval: 'sf-special-interval',
          color: 'sf-special-color',
          img: 'sf-special-img',
          on: 'sf-special-on'
        },
        attributes: {},
        modifier: {
          panel: 'special-panel flex items-cross-start content-main-center flex-wrap flex-row w-full',
          font: 'flex items-cross-center content-main-center flex-col',
          kegl: 'flex items-cross-center content-main-center flex-col',
          interval: "flex items-cross-center content-main-center flex-col",
          kerning: 'flex items-cross-center content-main-center flex-col',
          color: "flex items-cross-center content-main-center flex-col",
          img: "flex items-cross-center content-main-center flex-col",
          onoff: "flex items-cross-center content-main-center flex-col",
          sound: "flex items-cross-center content-main-center flex-col",
          black: 'sf-special-black',
          white: 'sf-special-white',
          yellow: 'sf-special-yellow',
          blue: 'sf-special-blue',
          green: 'sf-special-green',
          // Путь до стилей
          // specialwhite: '/simai/asset/simai.framework/sf4.master/plugin/special/css/white.min.css',
          // specialblack: '/simai/asset/simai.framework/sf4.master/plugin/special/css/black.min.css',
          // specialyellow: '/simai/asset/simai.framework/sf4.master/plugin/special/css/yellow.min.css',
          // specialblue: '/simai/asset/simai.framework/sf4.master/plugin/special/css/blue.min.css',
          // specialgreen: '/simai/asset/simai.framework/sf4.master/plugin/special/css/green.min.css',
          specialsoundscript: 'https://webasr.yandex.net/jsapi/v1/webspeechkit.js'
        }
      },

      /*
      modal: {
          load: '<div class="sf-progress"><div class="sf-progress-animation"></div></div>',
          events: {
              init: 'modalinit',
              create: "modalcreate",
              open: 'modalopen',
              close: 'modalclose',
          },
          data: {
              init: 'sf-modal',
              src: 'sf-src',
              modal: 'sf-modal-modifier',
              content: 'sf-content-modifier',
              close: "sf-close-modifier",
              overlay: 'sf-overlay-modifier',
              blur: 'sf-blur',
              iframe: 'sf-iframe',
          },
          attributes: {
              overlay: 'sf-modal-overlay',
              load: 'sf-modal-loadanimation',
              modal: 'sf-modal-area',
              content: 'sf-modal-content',
              close: 'sf-modal-close',
              number: 'sf-modal-number'
          },
          modifier: {
              src: '',
              service: 'sf-service-bottom-area',
              container: 'sf-modal-container',
              overlay: 'sf-modal-overlay',
              load: 'sf-modal-load',
              modal: 'sf-modal-area',
              content: 'sf-modal-content sf-scroll',
              close: 'sf-close',
              blur: 'blur',
              page: 'sf-pagewrap-area',
          },
      },
      */
      ajaxload: {
        load: '<div class="sf-progress"><div class="sf-progress-animation"></div></div>',
        events: {
          init: 'ajaxloadinit',
          cancel: 'ajaxloadcanceltrack',
          create: 'ajaxloadcreate'
        },
        data: {
          init: 'sf-ajaxload',
          src: 'sf-src',
          cancel: 'sf-canceltrack',
          loaded: 'sf-ajaxloaded'
        },
        attributes: {},
        modifier: {
          src: ''
        }
      }
    }
  }; // ================ END CONSTRUCTOR ================ //
};

/***/ },

/***/ "67345c14abf1"
() {

/**
 * ProviderDom - модуль создания блоков, другими словами поставщик блоков/компонентов
 */
SF.Provider = function () {
  this.special = function (e) {
    function selectcolor() {
      switch (_this.cookies.get('specialcolor')) {
        case 'specialwhite':
          return BX.message("SF_SPECIAL__SPECIAL_WHITE");

        case 'specialblack':
          return BX.message("SF_SPECIAL__SPECIAL_BLACK");

        case 'specialyellow':
          return BX.message("SF_SPECIAL__SPECIAL_YELLOW");

        case 'specialblue':
          return BX.message("SF_SPECIAL__SPECIAL_BLUE");

        case 'specialgreen':
          return BX.message("SF_SPECIAL__SPECIAL_GREEN");
      }

      return BX.message("SF_SPECIAL__SPECIAL_WHITE");
    }

    function selectkegl() {
      var v = _this.cookies.get('specialkegl');

      if (v != '') return v + BX.message("SF_SPECIAL__SPECIAL_KEGL");else return BX.message("SF_SPECIAL__KEGL_16");
    }

    this.selectkerning = () => {
      switch (this.cookies.get('specialkerning')) {
        case 'normal':
          return BX.message("SF_SPECIAL__KERNING_NORMAL");

        case 'middle':
          return BX.message("SF_SPECIAL__KERNING_MIDDLE");

        case 'big':
          return BX.message("SF_SPECIAL__KERNING_BIG");
      }

      return BX.message("SF_SPECIAL__KERNING_NORMAL");
    };

    function selectimg() {
      switch (_this.cookies.get('specialimage')) {
        case 'off':
          return BX.message("SF_SPECIAL__IMG_OFF");

        case 'onblack':
          return BX.message("SF_SPECIAL__IMG_ON_BLACK");

        case 'oncolor':
          return BX.message("SF_SPECIAL__IMG_ON_COLOR");
      }

      return BX.message("SF_SPECIAL__IMG_ON_COLOR");
    }

    this.changeStateAlt = state => {
      if (state == 'off') {
        document.querySelectorAll('.sf-special-hidden').forEach(elem => {
          elem.classList.remove('sf-special-hidden');
          elem.classList.add('sf-special-show');
        });
      } else if (state == 'onblack' || state == 'oncolor') {
        document.querySelectorAll('.sf-special-show').forEach(elem => {
          elem.classList.add('sf-special-hidden');
          elem.classList.remove('sf-special-show');
        });
      }
    };

    function selectinterval() {
      switch (_this.cookies.get('specialinterval')) {
        case '1':
          return BX.message("SF_SPECIAL__INTERVAL_1_0");

        case '1.5':
          return BX.message("SF_SPECIAL__INTERVAL_1_5");

        case '2.0':
          return BX.message("SF_SPECIAL__INTERVAL_2_0");
      }

      return BX.message("SF_SPECIAL__INTERVAL_1_0");
    }

    this.buttonColorStyle = (button, param) => {
      button.className = param.class;
      button.style.setProperty('background-color', param.backgroundColor ? param.backgroundColor : 'var(--sf-surface-popup)', 'important');
      button.style.setProperty('border-color', param.borderColor ? param.borderColor : 'var(--sf-outline-variant)', 'important');
      button.style.setProperty('color', param.color ? param.color : 'var(--sf-on-surface)', 'important');
      button.style.setProperty('line-height', 1, 'important');
      button.style.setProperty('letter-spacing', 'normal', 'important');
      button.style.fontSize = param.fontSize ? param.fontSize : '.875em';
      button.style.padding = '0.75em 1em';
      button.style.borderTopRightRadius = param.borderTopRightRadius ? param.borderTopRightRadius : 0;
      button.style.borderBottomRightRadius = param.borderBottomRightRadius ? param.borderBottomRightRadius : 0;
      button.style.borderTopLeftRadius = param.borderTopLeftRadius ? param.borderTopLeftRadius : 0;
      button.style.borderBottomLeftRadius = param.borderBottomLeftRadius ? param.borderBottomLeftRadius : 0;
      button.innerText = param.text;
      button.title = param.title;
      button.addEventListener('mouseover', () => {
        if (!button.classList.contains('sf-special-btn--noclick')) {
          button.style.boxShadow = 'var(--sf-ui-focus)';
          button.style.zIndex = 1;
          button.style.borderWidth = 0;
        }
      });
      button.addEventListener('mouseout', () => {
        if (!button.classList.contains('sf-special-btn--noclick')) {
          button.style.boxShadow = 'none';
          button.style.zIndex = 'auto';
        }
      });
      button.addEventListener('focus', () => {
        button.style.outline = 'none';
      });
    };

    this.addbtn = (btn, param) => {
      btn.className = param.class;
      btn.style.setProperty('background-color', param.backgroundColor ? param.backgroundColor : 'var(--sf-surface-popup)', 'important');
      btn.style.setProperty('border-color', param.borderColor ? param.borderColor : 'var(--sf-outline-variant)', 'important');
      btn.style.setProperty('line-height', 1, 'important');
      btn.style.setProperty('letter-spacing', 'normal', 'important');
      btn.addEventListener('mouseover', () => {
        if (!btn.classList.contains('sf-special-btn--noclick')) {
          btn.style.setProperty('background-color', param.backgroundColorHover ? param.backgroundColorHover : 'var(--sf-surface-container-hover)', 'important');
        }
      });
      btn.addEventListener('mouseout', () => {
        if (!btn.classList.contains('sf-special-btn--noclick')) {
          btn.style.setProperty('background-color', param.backgroundColor ? param.backgroundColor : 'var(--sf-surface-popup)', 'important');
        }
      });
      btn.addEventListener('focus', () => {
        btn.style.outline = 'none';
      });
      btn.style.setProperty('color', param.color ? param.color : 'var(--sf-on-surface)', 'important');
      btn.style.fontSize = param.fontSize ? param.fontSize : '.875em';
      btn.style.padding = '.75em 1em';
      btn.innerHTML = param.text;
      btn.title = param.title;
    };

    function selectfont() {
      //console.log(_this.cookies.get('specialfont'));
      switch (_this.cookies.get('specialfont')) {
        case 'default':
          return BX.message("SF_SPECIAL__FONT_DEFAULT");

        case 'sans':
          return BX.message("SF_SPECIAL__FONT_SANS");

        case 'serif':
          return BX.message("SF_SPECIAL__FONT_SERIF");

        case 'mono':
          return BX.message("SF_SPECIAL__FONT_MONO");
      }

      return BX.message("SF_SPECIAL__FONT_DEFAULT");
    }

    this.setLocalStatusStyle = (panel = false, className = false, status = () => {}) => {
      panel.status.className = className;
      panel.status.style.setProperty('margin-top', '0.75em', 'important');
      panel.status.style.setProperty('letter-spacing', 'normal', 'important');
      panel.status.style.setProperty('line-height', 1, 'important');
      panel.status.style.fontSize = '.875em';
      panel.status.style.setProperty('color', 'var(--sf-on-surface)', 'important');
      panel.status.innerText = status();
    };

    this.setLocalNameStyle = (panel = false, className = false, name = false) => {
      panel.name.className = className;
      panel.name.style.fontSize = '.875em';
      panel.name.style.setProperty('margin-bottom', '.75em', 'important');
      panel.name.style.setProperty('color', 'var(--sf-on-surface)', 'important');
      panel.name.style.setProperty('letter-spacing', 'normal', 'important');
      panel.name.style.setProperty('line-height', 1, 'important');
      panel.name.innerText = name;
    };

    var _this = this,
        par = e.target.params;

    var panel = {
      font: {
        name: {},
        content: {
          btnsans: {},
          // Arial
          btnserif: {},
          // Times New Roman
          btnmono: {} // Courier New

        },
        status: {}
      },
      kegl: {
        name: {},
        content: {
          btnmore: {},
          btnless: {}
        },
        status: {}
      },
      interval: {
        name: {},
        content: {
          btnone: {},
          btnhalf: {},
          btntwo: {}
        },
        status: {}
      },
      kerning: {
        name: {},
        content: {
          btnnormal: {},
          btnmiddle: {},
          btnbig: {}
        },
        status: {}
      },
      color: {
        name: {},
        content: {
          btnwhite: {},
          btnblack: {},
          btnyellow: {},
          btnblue: {},
          btngreen: {}
        },
        status: {}
      },
      img: {
        name: {},
        content: {
          btnoff: {},
          btnbw: {},
          btncolor: {}
        },
        status: {}
      },
      sound: {
        name: {},
        content: {
          btnon: {},
          btnoff: {}
        },
        status: {},
        play: {}
      },
      onoff: {
        name: {},
        content: {
          btnup: {},
          btndefault: {},
          btnonoff: {}
        },
        status: {}
      }
    };
    panel = document.createElement('nav');
    panel.className = par.modifier.panel;
    panel.style.setProperty('border-bottom', 'var(--sf-px) solid var(--sf-outline-variant)', 'important');
    panel.style.setProperty('font-size', '16px', 'important');
    panel.setAttribute('sf-special-panel', '');
    panel.classList.add('relative');
    panel.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
    panel.style.transition = 'margin-top 1s ease';
    panel.font = document.createElement('div');
    panel.font.className = par.modifier.font;
    panel.font.style.setProperty('padding', '1em', 'important');
    panel.font.name = document.createElement('div');
    panel.font.content = document.createElement('div');
    panel.font.status = document.createElement('div');
    this.setLocalNameStyle(panel.font, 'font-text', BX.message("SF_SPECIAL__FONT")); // panel.font.name.classList.add('font-text');
    // panel.font.name.style.fontSize = '.875em';
    // panel.font.name.style.setProperty('margin-bottom', '.75em','important');
    // panel.font.name.style.setProperty('color','#000','important');
    // panel.font.name.style.setProperty('letter-spacing', 1, 'important');
    // panel.font.name.style.setProperty('line-height', 1, 'important');
    // panel.font.name.innerHTML = BX.message("SF_SPECIAL__FONT");

    panel.font.appendChild(panel.font.name);
    panel.font.content.style.setProperty('border-color', 'var(--sf-outline-variant)', 'important');
    panel.font.content.classList.add('font-content', 'flex', 'border-1', 'radius-3', 'overflow-hidden');
    panel.font.content.btnsans = document.createElement('button');
    panel.font.content.btnserif = document.createElement('button');
    panel.font.content.btnmono = document.createElement('button');
    this.addbtn(panel.font.content.btnsans, {
      class: 'cursor-pointer line-none border-inline-end-1 focus:outline-0 appearance-none',
      text: 'Arial',
      title: BX.message("SF_SPECIAL__BTN_SANS_ARIAL")
    });
    panel.font.content.btnsans.addEventListener('click', function () {
      _this.send(par.events.fontsans, panel.font.content.btnsans);

      panel.font.status.innerText = BX.message("SF_SPECIAL__BTN_SANS");
    });
    this.addbtn(panel.font.content.btnserif, {
      class: 'cursor-pointer line-none border-inline-end-1 focus:outline-0 appearance-none',
      text: 'Times',
      title: BX.message("SF_SPECIAL__BTN_SERIF_TIMES")
    });
    panel.font.content.btnserif.addEventListener('click', function () {
      _this.send(par.events.fontserif, panel.font.content.btnserif);

      panel.font.status.innerHTML = BX.message("SF_SPECIAL__BTN_SERIF");
    });
    this.addbtn(panel.font.content.btnmono, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none',
      text: 'Courier',
      title: BX.message("SF_SPECIAL__BTN_MONO_COURIER")
    });
    panel.font.content.btnmono.addEventListener('click', function () {
      _this.send(par.events.fontmono, panel.font.content.btnmono);

      panel.font.status.innerHTML = BX.message("SF_SPECIAL__BTN_MONO");
    });
    this.setLocalStatusStyle(panel.font, 'status-text', selectfont); // panel.font.status.classList.add('status-text');
    // panel.font.status.style.fontSize = '.875em';
    // panel.font.status.style.setProperty('margin-top', '12px', 'important');
    // panel.font.status.style.setProperty('color','#000','important');
    // panel.font.status.style.setProperty('letter-spacing', 1, 'important');
    // panel.font.status.style.setProperty('line-height', 1, 'important');
    // panel.font.status.innerHTML = selectfont();

    panel.font.content.appendChild(panel.font.content.btnsans);
    panel.font.content.appendChild(panel.font.content.btnserif);
    panel.font.content.appendChild(panel.font.content.btnmono);
    panel.font.appendChild(panel.font.content);
    panel.font.appendChild(panel.font.status);
    panel.appendChild(panel.font); // #endregion Font
    // === Kegl ====== //

    panel.kegl = document.createElement('div');
    panel.kegl.className = par.modifier.kegl;
    panel.kegl.style.setProperty('padding', '1em', 'important');
    panel.kegl.name = document.createElement('div');
    panel.kegl.content = document.createElement('div');
    panel.kegl.status = document.createElement('div');
    panel.kegl.content.style.setProperty('border-color', 'var(--sf-outline-variant)', 'important');
    this.setLocalNameStyle(panel.kegl, 'kegl-text', BX.message("SF_SPECIAL__KEGL")); // panel.kegl.name.classList.add('kegl-text');
    // panel.kegl.name.style.setProperty('margin-bottom', '0.75em', 'important');
    // panel.kegl.name.style.fontSize = '.875em';
    // panel.kegl.name.style.setProperty('color','#000','important');
    // panel.kegl.name.style.setProperty('letter-spacing', 1, 'important');
    // panel.kegl.name.style.setProperty('line-height', 1, 'important');
    // panel.kegl.name.innerText = BX.message("SF_SPECIAL__KEGL");

    panel.kegl.appendChild(panel.kegl.name);
    panel.kegl.content.classList.add('kegl-content', 'flex', 'border-1', 'radius-3', 'overflow-hidden');
    panel.kegl.content.btnmore = document.createElement('button');
    panel.kegl.content.btnless = document.createElement('button');
    this.addbtn(panel.kegl.content.btnmore, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none border-inline-end-1',
      text: 'A-',
      title: BX.message("SF_SPECIAL__BTN_MORE")
    });
    panel.kegl.content.btnmore.addEventListener('click', function () {
      _this.send(par.events.keglmore, panel.kegl.content.btnmore);

      panel.kegl.status.innerText = selectkegl();
    });
    this.addbtn(panel.kegl.content.btnless, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none',
      text: 'A+',
      title: BX.message("SF_SPECIAL__BTN_LESS")
    });
    panel.kegl.content.btnless.addEventListener('click', function () {
      _this.send(par.events.keglless, panel.kegl.content.btnless);

      panel.kegl.status.innerText = selectkegl();
    }); // panel.kegl.status.classList.add('status-text');
    // panel.kegl.status.style.setProperty('margin-top', '0.75em', 'important');
    // panel.kegl.status.style.setProperty('letter-spacing', 1, 'important');
    // panel.kegl.status.style.setProperty('line-height', 1, 'important');
    // panel.kegl.status.style.fontSize = '.875em';
    // panel.kegl.status.style.setProperty('color', '#000', 'important');
    // panel.kegl.status.innerText = selectkegl();

    this.setLocalStatusStyle(panel.kegl, 'status-name', selectkegl);
    panel.kegl.content.appendChild(panel.kegl.content.btnmore);
    panel.kegl.content.appendChild(panel.kegl.content.btnless);
    panel.kegl.appendChild(panel.kegl.content);
    panel.kegl.appendChild(panel.kegl.status);
    panel.appendChild(panel.kegl); // === Kerning ======

    panel.kerning = document.createElement('div');
    panel.kerning.className = par.modifier.kerning;
    panel.kerning.style.setProperty('padding', '1em', 'important');
    panel.kerning.name = document.createElement('div');
    panel.kerning.content = document.createElement('div');
    panel.kerning.status = document.createElement('div');
    this.setLocalNameStyle(panel.kerning, 'name-text', BX.message("SF_SPECIAL__KERNING")); // panel.kerning.name.classList.add('name-text');
    // panel.kerning.name.style.setProperty('margin-bottom', '0.75em', 'important');
    // panel.kerning.name.style.setProperty('letter-spacing', 1, 'important');
    // panel.kerning.name.style.setProperty('line-height', 1, 'important');
    // panel.kerning.name.style.fontSize = '.875em';
    // panel.kerning.name.style.setProperty('color','#000','important');
    // panel.kerning.name.innerHTML = BX.message("SF_SPECIAL__KERNING");

    panel.kerning.appendChild(panel.kerning.name);
    panel.kerning.content.style.setProperty('border-color', 'var(--sf-outline-variant)', 'important');
    panel.kerning.content.classList.add('kerning-content', 'flex', 'border-1', 'radius-3', 'overflow-hidden');
    this.setLocalStatusStyle(panel.kerning, 'status-text', this.selectkerning); // panel.kerning.status.classList.add('status-text');
    // panel.kerning.status.style.setProperty('margin-top', '0.75em', 'important');
    // panel.kerning.status.style.setProperty('letter-spacing', 1, 'important');
    // panel.kerning.status.style.setProperty('line-height', 1, 'important');
    // panel.kerning.status.style.fontSize = '.875em';
    // panel.kerning.status.style.setProperty('color','#000','important');
    // panel.kerning.status.innerHTML = this.selectkerning();

    panel.kerning.content.btnnormal = document.createElement('button');
    panel.kerning.content.btnmiddle = document.createElement('button');
    panel.kerning.content.btnbig = document.createElement('button');
    this.addbtn(panel.kerning.content.btnnormal, {
      class: 'cursor-pointer focus:outline-0 appearance-none border-inline-end-1',
      text: '1.0',
      title: BX.message("SF_SPECIAL__BTN_NORMAL")
    });
    panel.kerning.content.btnnormal.addEventListener('click', function () {
      _this.send(par.events.kerningnormal, panel.kerning.content.btnnormal);

      panel.kerning.status.innerHTML = _this.selectkerning();
    });
    this.addbtn(panel.kerning.content.btnmiddle, {
      class: 'cursor-pointer focus:outline-0 appearance-none border-inline-end-1',
      text: '1.5',
      title: BX.message("SF_SPECIAL__BTN_MIDDLE")
    });
    panel.kerning.content.btnmiddle.addEventListener('click', function () {
      _this.send(par.events.kerningmiddle, panel.kerning.content.btnmiddle);

      panel.kerning.status.innerHTML = _this.selectkerning();
    });
    this.addbtn(panel.kerning.content.btnbig, {
      class: 'cursor-pointer focus:outline-0 appearance-none',
      text: '2.0',
      title: BX.message("SF_SPECIAL__BTN_BIG")
    });
    panel.kerning.content.btnbig.addEventListener('click', function () {
      _this.send(par.events.kerningbig, panel.kerning.content.btnbig);

      panel.kerning.status.innerHTML = _this.selectkerning();
    });
    panel.kerning.content.appendChild(panel.kerning.content.btnnormal);
    panel.kerning.content.appendChild(panel.kerning.content.btnmiddle);
    panel.kerning.content.appendChild(panel.kerning.content.btnbig);
    panel.kerning.appendChild(panel.kerning.content);
    panel.kerning.appendChild(panel.kerning.status);
    panel.appendChild(panel.kerning); // === End Kerning ====== #endregion
    // === Interval ======

    panel.interval = document.createElement('div');
    panel.interval.className = par.modifier.interval;
    panel.interval.style.setProperty('padding', '1em', 'important');
    panel.interval.name = document.createElement('div');
    this.setLocalNameStyle(panel.interval, 'kegl-text', BX.message("SF_SPECIAL__INTERVAL")); // panel.interval.name.classList.add('kegl-text');
    // panel.interval.name.style.setProperty('margin-bottom', '0.75em', 'important');
    // panel.interval.name.style.fontSize = '.875em';
    // panel.interval.name.style.setProperty('color','#000','important');
    // panel.interval.name.innerHTML = BX.message("SF_SPECIAL__INTERVAL");

    panel.interval.appendChild(panel.interval.name);
    panel.interval.content = document.createElement('div');
    panel.interval.status = document.createElement('div');
    panel.interval.content.style.setProperty('border-color', 'var(--sf-outline-variant)', 'important');
    panel.interval.content.classList.add('interval-content', 'flex', 'border-1', 'radius-3', 'overflow-hidden');
    panel.interval.content.btnone = document.createElement('button');
    panel.interval.content.btnhalf = document.createElement('button');
    panel.interval.content.btntwo = document.createElement('button');
    this.addbtn(panel.interval.content.btnone, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none border-inline-end-1',
      text: '1.0',
      title: BX.message("SF_SPECIAL__BTN_ONE")
    });
    panel.interval.content.btnone.addEventListener('click', function () {
      _this.send(par.events.intervalone, panel.interval.content.btnone);

      panel.interval.status.innerHTML = selectinterval();
    });
    this.addbtn(panel.interval.content.btnhalf, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none border-inline-end-1',
      text: '1.5',
      title: BX.message("SF_SPECIAL__BTN_HALF")
    });
    panel.interval.content.btnhalf.addEventListener('click', function () {
      _this.send(par.events.intervalhalf, panel.interval.content.btnhalf);

      panel.interval.status.innerHTML = selectinterval();
    });
    this.addbtn(panel.interval.content.btntwo, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none',
      text: '2.0',
      title: BX.message("SF_SPECIAL__BTN_TWO")
    });
    panel.interval.content.btntwo.addEventListener('click', function () {
      _this.send(par.events.intervaltwo, panel.interval.content.btntwo);

      panel.interval.status.innerHTML = selectinterval();
    });
    this.setLocalStatusStyle(panel.interval, 'status-text', selectinterval); // panel.interval.status.classList.add('status-text', 'm-top-2','line-none');
    // panel.interval.status.style.fontSize = '.875em';
    // panel.interval.status.style.setProperty('color','#000','important');
    // panel.interval.status.innerHTML = selectinterval();

    panel.interval.content.appendChild(panel.interval.content.btnone);
    panel.interval.content.appendChild(panel.interval.content.btnhalf);
    panel.interval.content.appendChild(panel.interval.content.btntwo);
    panel.interval.appendChild(panel.interval.content);
    panel.interval.appendChild(panel.interval.status);
    panel.appendChild(panel.interval); // === End Interval ======
    // === Color ======

    panel.color = document.createElement('div');
    panel.color.className = par.modifier.color;
    panel.color.style.setProperty('padding', '1em', 'important');
    panel.color.name = document.createElement('div');
    this.setLocalNameStyle(panel.color, 'color-text', BX.message("SF_SPECIAL__COLOR")); // panel.color.name.classList.add('color-text');
    // panel.color.name.style.setProperty('margin-bottom','0.75em', 'important');
    // panel.color.name.style.fontSize = '.875em';
    // panel.color.name.style.setProperty('color','#000','important');
    // panel.color.name.innerText = BX.message("SF_SPECIAL__COLOR");

    panel.color.appendChild(panel.color.name);
    panel.color.content = document.createElement('div');
    panel.color.status = document.createElement('div');
    panel.color.content.classList.add('color-content', 'flex'); // The scheme buttons stand on a plate: the raised place of the shadow
    // system (C20), not a shadow of its own.

    panel.color.content.style.boxShadow = 'var(--sf-shadow-raised)';
    panel.color.content.style.borderRadius = 'var(--sf-radius--ui)'; // panel.color.status.classList.add('status-text');
    // panel.color.status.style.setProperty('margin-top', '0.75em', 'important');
    // panel.color.status.style.fontSize = '.875em';
    // panel.color.status.style.setProperty('color','#000','important');

    this.setLocalStatusStyle(panel.color, 'status-text', selectcolor);
    panel.color.status.innerText = selectcolor() + BX.message("SF_SPECIAL__SCHEMA"); // === Color ====== Кнопки управления цветовой схемой

    panel.color.content.btnwhite = document.createElement('button');
    panel.color.content.btnblack = document.createElement('button');
    panel.color.content.btnyellow = document.createElement('button');
    panel.color.content.btnblue = document.createElement('button');
    panel.color.content.btngreen = document.createElement('button');
    this.buttonColorStyle(panel.color.content.btnwhite, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none border-0 transition-shadow',
      backgroundColor: 'var(--sf-special-white)',
      color: 'var(--sf-on-special-white)',
      borderTopLeftRadius: 'var(--sf-radius--ui)',
      borderBottomLeftRadius: 'var(--sf-radius--ui)',
      text: 'C',
      title: BX.message("SF_SPECIAL__BTN_WHITE")
    });

    this.setColorTheme = (color, button) => {
      if (this.cookies.get('specialcolor') != par.events[`color${color}`]) {
        this.send(par.events[`color${color}`], button);
        panel.color.status.innerText = selectcolor() + BX.message("SF_SPECIAL__SCHEMA");
      }
    };

    panel.color.content.btnwhite.addEventListener('click', this.setColorTheme.bind(this, 'white', panel.color.content.btnwhite)); // panel.color.content.btnwhite.addEventListener('click', function(e) {
    //     if(_this.cookies.get('specialcolor') != par.events.colorwhite) {
    //         _this.send(par.events.colorwhite, panel.color.content.btnwhite);
    //         panel.color.status.innerHTML = selectcolor() + BX.message("SF_SPECIAL__SCHEMA");
    //     }
    // });

    this.buttonColorStyle(panel.color.content.btnblack, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none border-0 transition',
      backgroundColor: 'var(--sf-special-black)',
      color: 'var(--sf-on-special-black)',
      borderColor: 'var(--sf-special-black)',
      text: 'C',
      title: BX.message("SF_SPECIAL__BTN_BLACK")
    });
    panel.color.content.btnblack.addEventListener('click', this.setColorTheme.bind(this, 'black', panel.color.content.btnblack)); // panel.color.content.btnblack.addEventListener('click', function(e) {
    //     if(_this.cookies.get('specialcolor') != par.events.colorblack) {
    //         _this.send(par.events.colorblack, e.target);
    //         panel.color.status.innerHTML = selectcolor() + BX.message("SF_SPECIAL__SCHEMA");
    //     }
    // });

    this.buttonColorStyle(panel.color.content.btnyellow, {
      class: 'cursor-pointer focus:outline-0 appearance-none border-0 transition-shadow',
      backgroundColor: 'var(--sf-special-yellow)',
      color: 'var(--sf-on-special-yellow)',
      borderColor: 'var(--sf-special-yellow)',
      text: 'C',
      title: BX.message("SF_SPECIAL__BTN_YELLOW")
    });
    panel.color.content.btnyellow.addEventListener('click', this.setColorTheme.bind(this, 'yellow', panel.color.content.btnyellow)); // panel.color.content.btnyellow.addEventListener('click', function(e) {
    //     if(_this.cookies.get('specialcolor') != par.events.coloryellow) {
    //         _this.send(par.events.coloryellow, e.target);
    //         panel.color.status.innerHTML = selectcolor() + BX.message("SF_SPECIAL__SCHEMA");
    //     }
    // });

    this.buttonColorStyle(panel.color.content.btnblue, {
      class: 'cursor-pointer focus:outline-0 appearance-none border-0 transition-shadow',
      backgroundColor: 'var(--sf-special-blue)',
      color: 'var(--sf-on-special-blue)',
      borderColor: 'var(--sf-special-blue)',
      text: 'C',
      title: BX.message("SF_SPECIAL__BTN_BLUE")
    });
    panel.color.content.btnblue.addEventListener('click', this.setColorTheme.bind(this, 'blue', panel.color.content.btnblue)); // panel.color.content.btnblue.addEventListener('click', function(e) {
    //     if(_this.cookies.get('specialcolor') != par.events.colorblue) {
    //         _this.send(par.events.colorblue, e.target);
    //         panel.color.status.innerHTML = selectcolor() + BX.message("SF_SPECIAL__SCHEMA");
    //     }
    // });

    this.buttonColorStyle(panel.color.content.btngreen, {
      class: 'cursor-pointer focus:outline-0 appearance-none border-0 transition-shadow',
      backgroundColor: 'var(--sf-on-special-green)',
      color: 'var(--sf-special-green)',
      borderColor: 'var(--sf-on-special-green)',
      borderTopRightRadius: 'var(--sf-radius--ui)',
      borderBottomRightRadius: 'var(--sf-radius--ui)',
      text: 'C',
      title: BX.message("SF_SPECIAL__BTN_GREEN")
    });
    panel.color.content.btngreen.addEventListener('click', this.setColorTheme.bind(this, 'green', panel.color.content.btngreen)); // panel.color.content.btngreen.addEventListener('click', function(e) {
    //     if(_this.cookies.get('specialcolor') != par.events.colorgreen) {
    //         _this.send(par.events.colorgreen, e.target);
    //         panel.color.status.innerHTML = selectcolor() + BX.message("SF_SPECIAL__SCHEMA");
    //     }
    // });

    panel.color.content.appendChild(panel.color.content.btnwhite);
    panel.color.content.appendChild(panel.color.content.btnblack);
    panel.color.content.appendChild(panel.color.content.btnyellow);
    panel.color.content.appendChild(panel.color.content.btnblue);
    panel.color.content.appendChild(panel.color.content.btngreen);
    panel.color.appendChild(panel.color.content);
    panel.color.appendChild(panel.color.status);
    panel.appendChild(panel.color); // === End Color ======
    // === Image ======

    panel.img = document.createElement('div');
    panel.img.className = par.modifier.img;
    panel.img.style.setProperty('padding', '1em', 'important');
    panel.img.name = document.createElement('div');
    this.setLocalNameStyle(panel.img, 'image-text', BX.message("SF_SPECIAL__IMG")); // panel.img.name.classList.add('color-text');
    // panel.img.name.style.setProperty('margin-bottom', '0.75em', 'important');
    // panel.img.name.style.fontSize = '.875em';
    // panel.img.name.style.setProperty('color','#000','important');
    // panel.img.name.innerHTML = BX.message("SF_SPECIAL__IMG");

    panel.img.appendChild(panel.img.name);
    panel.img.content = document.createElement('div');
    panel.img.status = document.createElement('div');
    this.setLocalStatusStyle(panel.img, 'status-text', selectimg); // panel.img.status.classList.add('status-text');
    // panel.img.status.style.setProperty('margin-top', '0.75em', 'important');
    // panel.img.status.style.fontSize = '.875em';
    // panel.img.status.style.setProperty('color','#000','important');
    // panel.img.status.innerHTML = selectimg();

    panel.img.content.style.setProperty('border-color', 'var(--sf-outline-variant)', 'important');
    panel.img.content.classList.add('img-content', 'flex', 'border-1', 'radius-3', 'overflow-hidden');
    panel.img.content.btnoff = document.createElement('button');
    panel.img.content.btnbw = document.createElement('button');
    panel.img.content.btncolor = document.createElement('button');
    this.addbtn(panel.img.content.btnoff, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none border-inline-end-1',
      text: BX.message("SF_SPECIAL__BTN_OFF_TEXT"),
      title: BX.message("SF_SPECIAL__BTN_OFF")
    });
    panel.img.content.btnoff.addEventListener('click', function () {
      _this.send(par.events.imageoff, panel.img.content.btnoff);

      panel.img.status.innerHTML = selectimg();

      _this.changeStateAlt('off');
    });
    this.addbtn(panel.img.content.btnbw, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none border-inline-end-1',
      text: BX.message("SF_SPECIAL__BTN_BW_TEXT"),
      title: BX.message("SF_SPECIAL__IMG_BTN_BW")
    });
    panel.img.content.btnbw.addEventListener('click', function () {
      _this.send(par.events.imageblack, panel.img.content.btnbw);

      panel.img.status.innerHTML = selectimg();

      _this.changeStateAlt('onblack');
    });
    this.addbtn(panel.img.content.btncolor, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none',
      text: BX.message("SF_SPECIAL__IMG_BTN_COLOR_TEXT"),
      title: BX.message("SF_SPECIAL__IMG_BTN_COLOR")
    });
    panel.img.content.btncolor.addEventListener('click', function () {
      _this.send(par.events.imagecolor, panel.img.content.btncolor);

      panel.img.status.innerHTML = selectimg();

      _this.changeStateAlt('oncolor');
    });
    panel.img.content.appendChild(panel.img.content.btnoff);
    panel.img.content.appendChild(panel.img.content.btnbw);
    panel.img.content.appendChild(panel.img.content.btncolor);
    panel.img.appendChild(panel.img.content);
    panel.img.appendChild(panel.img.status);
    panel.appendChild(panel.img); // =================================

    /*
        sound: {
            name: {},
            content: {
                btnon:{},
                btnoff: {},
            },
            status: {},
        },
    */

    /*if(_this.getproperty('special_speech') == 'Y') {
         panel.sound = document.createElement('div');
        panel.sound.className = par.modifier.sound;
         // ========== name
        panel.sound.name = document.createElement('div');
        panel.sound.name.classList.add('sound-text', 'm-bottom-2')
        panel.sound.name.style.setProperty('color','var(--sf-on-surface)','important');
        panel.sound.name.innerHTML = 'Звук';
         panel.sound.appendChild(panel.sound.name);
        // ===========
        panel.sound.content = document.createElement('div');
        panel.sound.content.classList.add('sound-content','flex','border-1','radius-3','overflow-hidden');
        panel.sound.content.btnon = document.createElement('button');
        panel.sound.content.btnoff = document.createElement('button');
         this.addbtn(
            panel.sound.content.btnon,
            {
                class: 'cursor-pointer line-none focus:outline-0 appearance-none',
                // background: 'white',
                // border: 'black',
                // font: '.875em',
                text: 'Вкл',
                title: "Включить озвучивание текста",
            }
        );
         panel.sound.content.btnon.addEventListener('click', function(e) {
            _this.send(par.events.soundon, panel);
            panel.sound.status.innerHTML = selectsound();
        });
         this.addbtn(
            panel.sound.content.btnoff,
            {
                class: 'cursor-pointer line-none focus:outline-0 appearance-none',
                // background: 'white',
                // border: 'black',
                // font: '.875em',
                text: 'Выкл',
                title: "Выключить озвучивание текста",
            }
        );
         panel.sound.content.btnoff.addEventListener('click', function(e) {
            _this.send(par.events.soundoff, panel);
            panel.sound.status.innerHTML = selectsound();
        });
         // ===========
        panel.sound.status = document.createElement('div');
        panel.sound.status.classList.add('status-text', 'm-top-2');
        panel.sound.status.style.setProperty('color','var(--sf-on-surface)','important');
        panel.sound.status.innerHTML = selectsound();
        // ===========
         panel.sound.content.appendChild(panel.sound.content.btnon);
        panel.sound.content.appendChild(panel.sound.content.btnoff);
         panel.sound.appendChild(panel.sound.content);
        panel.sound.appendChild(panel.sound.status);
        panel.appendChild(panel.sound);
         this.includeScript(par.modifier.specialsoundscript);
    }*/
    // =================================

    panel.onoff = document.createElement('div');
    panel.onoff.className = par.modifier.onoff;
    panel.onoff.style.setProperty('padding', '1em', 'important');
    panel.onoff.name = document.createElement('div');
    this.setLocalNameStyle(panel.onoff, 'onoff-text', BX.message("SF_SPECIAL__PANEL")); // panel.onoff.name.classList.add('onoff-text');
    // panel.onoff.name.style.setProperty('margin-bottom', '0.75em', 'important');
    // panel.onoff.name.style.fontSize = '.875em';
    // panel.onoff.name.style.setProperty('color','#000','important');
    // panel.onoff.name.innerHTML = BX.message("SF_SPECIAL__PANEL");

    panel.onoff.appendChild(panel.onoff.name);
    panel.onoff.content = document.createElement('div');
    panel.onoff.content.style.setProperty('border-color', 'var(--sf-outline-variant)', 'important');
    panel.onoff.content.classList.add('onoff-content', 'flex', 'border-1', 'radius-3', 'overflow-hidden');
    panel.onoff.content.btnup = document.createElement('button');
    panel.onoff.content.btndefault = document.createElement('button');
    panel.onoff.content.btnonoff = document.createElement('button');
    this.addbtn(panel.onoff.content.btndefault, {
      class: 'cursor-pointer line-none focus:outline-0 appearance-none border-inline-end-1',
      text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style="width:1em;height:1em"><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>',
      title: BX.message("SF_SPECIAL__BTN_DEFAULT")
    });
    panel.onoff.content.btndefault.addEventListener('click', function () {
      _this.send(par.events.defaultsetting, panel);
    });
    this.addbtn(panel.onoff.content.btnonoff, {
      class: 'cursor-pointer focus:outline-0 appearance-none',
      text: BX.message("SF_SPECIAL__BTN_OFF_TEXT"),
      title: BX.message("SF_SPECIAL__BTN_OFF")
    });
    panel.onoff.content.btnonoff.addEventListener('click', function () {
      _this.send(par.events.close, panel);

      _this.changeStateAlt('onblack');
    });
    this.addbtn(panel.onoff.content.btnup, {
      class: 'cursor-pointer focus:outline-0 appearance-none',
      text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style="width:1em;height:1em"><path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/></svg>',
      title: BX.message("SF_SPECIAL__BTN_UP")
    });
    panel.onoff.content.btnup.classList.add('absolute', 'bottom-0', 'inline-end-0', 'radius-none'); // panel.onoff.content.btnup.style.bottom = '0';
    // panel.onoff.content.btnup.style.right = '0';

    panel.onoff.content.btnup.style.borderBottom = '0 solid var(--sf-transparent)'; // panel.onoff.content.btnup.style.borderRadius = '0';

    if (_this.cookies.get('specialup') == 'down') {
      panel.style.marginTop = `-${panel.clientHeight}px`;
      panel.onoff.content.btnup.style.bottom = '-' + panel.onoff.content.btnup.clientHeight + 'px';
      panel.onoff.content.btnup.style.transform = 'rotate(180deg)';

      _this.cookies.set('specialup', 'up', 7);
    } else {
      panel.style.marginTop = '0';
      panel.onoff.content.btnup.style.bottom = '0';
      panel.onoff.content.btnup.style.transform = 'rotate(0deg)';

      _this.cookies.set('specialup', 'down', 7);
    }

    panel.onoff.content.btnup.addEventListener('click', this.send.bind(this, par.events.up, panel)); // function(e) {
    //     _this.send(par.events.up, panel);
    // });

    panel.onoff.content.appendChild(panel.onoff.content.btndefault);
    panel.onoff.content.appendChild(panel.onoff.content.btnonoff);
    panel.onoff.appendChild(panel.onoff.content);
    panel.appendChild(panel.onoff);
    panel.appendChild(panel.onoff.content.btnup); // #endregion =================================

    return panel;
  }; // #endregion Panel Special

  /**
   *
   * @param {*} e
   */

  /*
      this.modal = function(e) {
          var overlay = {
              load: {},
              area: {
                  content: {},
                  close: {},
              },
          },
          _this = this,
          par = e.target.params,
          page = document.body.querySelector('.sf-pagewrap-area'),
          el = e.target;
           overlay = document.createElement('div');
          overlay.load = document.createElement('div');
          overlay.load.innerHTML = par.load;
          overlay.area = document.createElement('div');
          overlay.area.content = document.createElement('div');
          overlay.area.close = document.createElement('button');
           overlay.load.setAttribute(par.attributes.load, '');
          overlay.className = par.modifier.overlay;
          overlay.style.display = 'flex';
          overlay.load.style.position = 'fixed';
          overlay.load.style.top = '0';
          overlay.load.style.left = '0';
          overlay.load.style.width = '100%';
          overlay.setAttribute(par.attributes.overlay, '');
           overlay.addEventListener('click', function(e) {
              if(e.target.hasAttribute(par.attributes.overlay))
                  _this.send(par.events.close, overlay);
          });
           overlay.classList = par.modifier.overlay;
          overlay.setAttribute(par.data.src, par.modifier.src);
          overlay.style.zIndex = this.topZIndex() + 1;
           overlay.area.setAttribute(par.attributes.modal, '');
          overlay.area.className = par.modifier.modal;
          overlay.area.content.setAttribute(par.attributes.content, '');
          overlay.area.content.className = par.modifier.content;
          overlay.area.style.opacity = '0';
          overlay.area.appendChild(overlay.area.content);
           overlay.area.close.addEventListener('click', function(e) {
              _this.send(par.events.close, overlay);
          });
           overlay.area.close.setAttribute(par.attributes.close, '');
          overlay.area.close.className = par.modifier.close;
          overlay.area.appendChild(overlay.area.close);
          overlay.appendChild(overlay.load);
          overlay.appendChild(overlay.area);
           // Событие происходит перед открытием окна
          this.receive(par.events.open, overlay, function(e) {
              overlay.style.display = 'flex';
              document.body.style.overflow = 'hidden';
               try {
                  if(el.hasAttribute(par.data.blur) || (par.attributes.blur != null && par.attributes.blur != undefined)) {
                      //console.log(page)
                      if(page !== null && page !== undefined) {
                          //console.log(par.modifier.blur)
                          page.classList.add(par.modifier.blur.replace(" ", ''));
                      }
                  }
              } catch(exp) {
               }
            });
           // Событие происходит перед закрытием окна
          this.receive(par.events.close, overlay, function(e) {
              if(overlay.parentNode != null) {
                  overlay.area.style.opacity = '0';
                  overlay.area.content.innerHTML = '';
                  overlay.load.style.display = 'flex';
                  overlay.parentNode.removeChild(overlay);
              }
              document.body.style.overflow = 'auto';
              try {
                  if(el.hasAttribute(par.data.blur) || (par.attributes.blur != null && par.attributes.blur != undefined))
                  if(page !== null && page !== undefined)
                      page.classList.remove(par.modifier.blur.replace(" ", ""));
              } catch(exp) {
               }
           });
           return overlay;
      }
       this.iframe = function(e) {
          var overlay = {
              load: {},
              area: {
                  content: {},
                  close: {},
              },
          },
          _this = this,
          par = e.target.params,
          page = document.body.querySelector('.sf-pagewrap-area'),
          el = e.target;
             overlay = document.createElement('div');
          overlay.load = document.createElement('div');
          overlay.load.innerHTML = par.load;
          overlay.area = document.createElement('div');
          overlay.area.content = document.createElement('iframe');
          overlay.area.content.src = par.modifier.src;
          overlay.area.close = document.createElement('button');
           overlay.load.setAttribute(par.attributes.load, '');
          overlay.load.className = par.modifier.load;
          overlay.load.style.position = 'fixed';
          overlay.load.style.top = '0';
          overlay.load.style.left = '0';
          overlay.load.style.width = '100%';
          overlay.setAttribute(par.attributes.overlay, '');
           overlay.addEventListener('click', function(e) {
              if(e.target.hasAttribute(par.attributes.overlay))
                  _this.send(par.events.close, overlay);
          });
           overlay.classList = par.modifier.overlay;
          overlay.setAttribute(par.data.src, par.modifier.src);
          overlay.style.zIndex = this.topZIndex() + 1;
           overlay.area.setAttribute(par.attributes.content, "");
          overlay.area.className = par.modifier.modal;
          overlay.area.content.setAttribute(par.attributes.content, "");
          overlay.area.content.className = par.modifier.content;
          overlay.area.style.opacity = "0";
          overlay.area.appendChild(overlay.area.content);
            overlay.area.close.addEventListener('click', function(e) {
              _this.send(par.events.close, overlay);
          });
            overlay.area.close.setAttribute(par.attributes.close, '');
          overlay.area.close.className = par.modifier.close;
          overlay.area.appendChild(overlay.area.close);
          overlay.appendChild(overlay.load);
          overlay.appendChild(overlay.area);
           this.receive(par.events.open, el || window, function(e) {
              overlay.style.opacity = 1;
              document.body.style.overflow = 'hidden';
              overlay.style.display = 'flex';
              if(el.hasAttribute(par.data.blur) || par.attributes.blur)
                  if(page !== null && page !== undefined)
                      page.classList.add(par.modifier.blur);
          });
           this.receive(par.events.close, overlay, function(e) {
              if(overlay.parentNode != null) {
                  overlay.area.style.opacity = '0';
                  overlay.area.content.innerHTML = '';
                  overlay.load.style.display = 'flex';
                  overlay.parentNode.removeChild(overlay);
              }
              document.body.style.overflow = 'auto';
              if(el.hasAttribute(par.data.blur) || par.attributes.blur)
                  if(page !== null && page !== undefined)
                      page.classList.add(par.modifier.blur);
          });
            this.send(par.events.open, el);
          return overlay;
      }
  */


  this.providercreate = function (e) {
    var b = e.target.blocks,
        el = e.target,
        par = el.params;

    switch (b) {
      /*
      case 'modal':
          el.modal = this.modal(e);
          el.event = par.events.init;
          this.send("providerend", el);
          break;
      */
      case "special":
        el.special = this.special(e);
        el.event = par.events.init;
        this.send('providerend', el);
        break;

      case 'ajaxload':
        el.event = par.events.init;
        this.send('providerend', el);
        break;
    }
  };

  var _this = this;

  if (this.stack.ev('providerstart')) {
    this.receive('providerstart', window, function (e) {
      _this.providercreate(e);
    });
    this.stack.events.push('providerstart');
  }
};

/***/ },

/***/ "8b84d027b9f0"
() {

/**
 * Search модуль поиска инициализаций т.е. поиска элементов вызывающих определенные блоки/компоненты
 */
SF.Search = function () {
  // this.stack = SF.Controller.Stack;
  // SF.Events.call(this);

  /**
   * Search uninitialized Modal Window
   * Поиск неинициализированных модальных окон
   */
  this.search = function () {
    var el = document.body.querySelectorAll('*'); // Поиск всех элементов в DOM-дереве

    for (var j = 0; j < el.length; j++) {
      // Обход найденых элементов
      var par = new SF.Parameters();
      var params = par.newparams(); // Новые параметры

      for (var key in params.blocks) {
        // Проверка
        var init = el[j],
            block = params.blocks[key];

        if (init.hasAttribute(block.data.init)) {
          // Проверяем есть ли у элемента инициализация блока
          var i = 0;

          for (var k = 0; k < this.stack.el.length; k++) // Проверяем был ли инициализированн текущий элемен ранее
          if (this.stack.el[k] == init) i++;

          if (i == 0) {
            init.blocks = key; // Записываем наименование блока

            init.params = block; // Присваиваем инициализатору список стандратных параметров

            par.updateparams(init);
            this.send('searchend', init); // Отправка сигнала (события) на элемент для дальнейшего построения
          }
        }
      }
    }
  };
  /*
      this.searchModal = function(element) {
          var el = element.querySelectorAll('[sf-modal]');   // Поиск всех элементов в DOM-дереве
          for(var j = 0; j < el.length; j++) {    // Обход найденых элементов
              var par = new SF.Parameters();
              var params = par.newparams();         // Новые параметры
              for(var key in params.blocks) {    // Проверка
                  var init = el[j],
                      block = params.blocks[key];
                  if(init.hasAttribute(block.data.init)) {    // Проверяем есть ли у элемента инициализация блока
                      var i = 0;
                      for(var k = 0; k < this.stack.el.length; k++)   // Проверяем был ли инициализированн текущий элемен ранее
                          if(this.stack.el[k] == init) i++;
                      if(i == 0) {
                          init.blocks = key;          // Записываем наименование блока
                          init.params = block;  // Присваиваем инициализатору список стандратных параметров
                          par.updateparams(init);
                          this.send('searchend', init); // Отправка сигнала (события) на элемент для дальнейшего построения
                      }
                  }
              }
          }
      }
  */


  this.searchdata = function (content) {
    var el = content.querySelectorAll('*'); // Поиск всех элементов в DOM-дереве

    for (var j = 0; j < el.length; j++) {
      // Обход найденых элементов
      var par = new SF.Parameters();
      var params = par.newparams(); // Новые параметры

      for (var key in params.blocks) {
        // Проверка
        var init = el[j],
            block = params.blocks[key];

        if (init.hasAttribute(block.data.init)) {
          // Проверяем есть ли у элемента инициализация блока
          var i = 0;

          for (var k = 0; k < this.stack.el.length; k++) // Проверяем был ли инициализированн текущий элемен ранее
          if (this.stack.el[k] == init) i++;

          if (i == 0) {
            init.blocks = key; // Записываем наименование блока

            init.params = block; // Присваиваем инициализатору список стандратных параметров

            par.updateparams(init);
            this.send('searchend', init); // Отправка сигнала (события) на элемент для дальнейшего построения
          }
        }
      }
    }
  }; // ================ CONSTRUCTOR ================ //


  var _this = this; // The module is normally mixed into a Controller, which owns the stack
  // and the event helpers. The loader also constructs it on its own once
  // the page is ready, and then there is no owner: borrow the shared
  // stack, and stay quiet if even that is missing. Throwing here stopped
  // the whole boot, so every component after it stayed uninitialised.


  if (!this.stack && SF.Controller) this.stack = SF.Controller.Stack;

  if (this.stack && typeof this.receive === 'function' && this.stack.ev('searchstart')) {
    this.receive('searchstart', window, function () {
      _this.search();
    });
    /*
        this.receive('searchstartmodal', window, function(e) {
            _this.searchModal(document);
        });
    */

    this.stack.events.push('searchstart');
  } // ================ END CONSTRUCTOR ================ //

};

/***/ },

/***/ "d604676a9b24"
() {

SF.Controller.Stack = {
  el: [],
  events: [],
  log: []
};
window.stack = SF.Controller.stack;

SF.Controller.Stack.extend = function (def, options) {
  var i = 0;

  for (var key in options) {
    if (def.length > 0) for (var k = 0; k < def.length; k++) if (def[k] == options[key]) i++;
    if (i == 0) def.push(options[key]);
    i = 0;
  }

  return def;
};

SF.Controller.Stack.addevents = function (events) {
  var e = this.stack.events,
      i = 0;

  for (var k = 0; k < e.length; k++) if (e[k] == events) i++;

  if (i == 0) e.push(events);
};

SF.Controller.Stack.ev = function (ev) {
  var e = this.events,
      i = 0;

  for (var k = 0; k < e.length; k++) if (e[k] == ev) i++;

  if (i === 0) return true;else return false;
};

/***/ },

/***/ "003c85f0f0fb"
() {

SF.Special = function (el, opt) {
  // #region Method
  this.updateparam = param => {
    for (var key in param) {
      if (_this.cookies.get(key)) {
        param[key] = _this.cookies.get(key);
      }
    }

    return param;
  }; // #endregion
  // ====== CONSTRUCTOR ====== //


  SF.Events.call(this); //SF.Property.call(this);

  this.el = el;

  var _this = this,
      par = new SF.Parameters(),
      param = par.newparams(),
      plugin = this.extend(param.blocks.special, opt);

  this.stack = SF.Controller.Stack;
  this.html = document.documentElement;
  var html = document.documentElement,
      body = document.body,
      service = document.querySelector('[data-name*="sf-service-top-area"]');

  if (this.el) {
    this.el.blocks = 'special';
    this.el.params = plugin;
  }

  plugin.cookies = this.updateparam(plugin.cookies); // The text size is the core display setting (C196 follow-up, module.special
  // 2.2.1): the panel writes its size as the class special-kegl-<n> beside its
  // other special-* classes, and the bridge (component/special/js/bridge.js)
  // reads it as data-sf-text-scale. No px of its own on <html> or <body>; the
  // panel's cookie stays as it was.

  var setKegl = kegl => {
    Array.from(html.classList).forEach(name => {
      if (/^special-kegl-\d+$/.test(name)) html.classList.remove(name);
    });
    var size = parseInt(kegl, 10);
    if (size > 0) html.classList.add('special-kegl-' + size);
  };

  this.close = () => {
    this.send(this.el.params.events.soundoff, window);
    this.send(this.el.params.events.defaultsetting, this.el);
    this.html.classList.remove('special');
    this.el.special.remove();
    this.cookies.set('specialstate', 'off', 7);
  };

  if (this.stack.ev(plugin.events.close)) {
    this.receive(this.el.params.events.close, window, this.close.bind(this)); // this.receive(plugin.events.close, window, function(e) {
    //     var panel = e.target;
    //     panel.remove();
    //     _this.send(plugin.events.soundoff, window);
    //     html.classList.remove('special');
    //     _this.cookies.set('specialstate', 'off', 7);
    // });

    this.stack.events.push(plugin.events.close);
  }

  if (this.stack.ev(plugin.events.open)) {
    this.receive(plugin.events.open, window, function (e) {
      _this.cookies.set('specialstate', 'on', 7);

      _this.updateparam(plugin.cookies);

      service.prepend(_this.el.special);
      html.classList.add('special');

      switch (plugin.cookies.specialfont) {
        case 'sans':
          _this.send(plugin.events.fontsans, e.target);

          break;

        case 'serif':
          _this.send(plugin.events.fontserif, e.target);

          break;

        case 'mono':
          _this.send(plugin.events.fontmono, e.target);

          break;
      }

      switch (plugin.cookies.specialkerning) {
        case 'normal':
          _this.send(plugin.events.kerningnormal, e.target);

          break;

        case 'middle':
          _this.send(plugin.events.kerningmiddle, e.target);

          break;

        case 'big':
          _this.send(plugin.events.kerningbig, e.target);

          break;

        default:
          _this.send(plugin.events.kerningnormal, e.target);

          break;
      }

      switch (plugin.cookies.specialinterval) {
        case '1':
          _this.send(plugin.events.intervalone, e.target);

          break;

        case '1.5':
          _this.send(plugin.events.intervalhalf, e.target);

          break;

        case '2.0':
          _this.send(plugin.events.intervaltwo, e.target);

          break;

        default:
          _this.send(plugin.events.intervalone, e.target);

          break;
      }

      switch (plugin.cookies.specialcolor) {
        case 'specialwhite':
          _this.send(plugin.events.colorwhite, el.special.color.content.btnwhite);

          break;

        case 'specialblack':
          _this.send(plugin.events.colorblack, el.special.color.content.btnblack);

          break;

        case 'specialyellow':
          _this.send(plugin.events.coloryellow, el.special.color.content.btnyellow);

          break;

        case 'specialblue':
          _this.send(plugin.events.colorblue, el.special.color.content.btnblue);

          break;

        case 'specialgreen':
          _this.send(plugin.events.colorgreen, el.special.color.content.btngreen);

          break;

        default:
          _this.send(plugin.events.colorwhite, el.special.color.content.btnwhite);

          break;
      }

      setKegl(plugin.cookies.specialkegl);

      switch (plugin.cookies.specialimage) {
        case 'off':
          _this.send(plugin.events.imageoff, e.target);

          break;

        case 'oncolor':
          _this.send(plugin.events.imagecolor, e.target);

          break;

        case 'onblack':
          _this.send(plugin.events.imageblack, e.target);

          break;
      }

      var stateImage = _this.cookies.get('specialimage');

      if (stateImage == 'off') {
        document.querySelectorAll('.sf-special-hidden').forEach(elem => {
          elem.classList.remove('sf-special-hidden');
          elem.classList.add('sf-special-show');
        });
      } else if (stateImage == 'onblack' || stateImage == 'oncolor') {
        document.querySelectorAll('.sf-special-show').forEach(elem => {
          elem.classList.add('sf-special-hidden');
          elem.classList.remove('sf-special-show');
        });
      }

      var panel = document.body.querySelector('[sf-special-panel]');

      if (plugin.cookies.specialsound == 'on') {
        _this.send(plugin.events.soundon, panel);
      }
    });
    this.stack.events.push(plugin.events.open);
  } // #region Font


  if (this.stack.ev(plugin.events.fontsans)) {
    this.receive(plugin.events.fontsans, window, () => {
      html.classList.add('special-font-sans');
      html.classList.remove('special-font-serif');
      html.classList.remove('special-font-mono');
      el.special.font.content.btnsans.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.font.content.btnserif.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.font.content.btnmono.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.font.content.btnsans.classList.add('sf-special-btn--noclick');
      el.special.font.content.btnserif.classList.remove('sf-special-btn--noclick');
      el.special.font.content.btnmono.classList.remove('sf-special-btn--noclick');

      _this.cookies.set('specialfont', 'sans', 7);
    });
    this.stack.events.push(plugin.events.fontsans);
  }

  if (this.stack.ev(plugin.events.fontserif)) {
    this.receive(plugin.events.fontserif, window, () => {
      html.classList.remove('special-font-sans');
      html.classList.add('special-font-serif');
      html.classList.remove('special-font-mono');
      el.special.font.content.btnsans.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.font.content.btnserif.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.font.content.btnmono.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.font.content.btnsans.classList.remove('sf-special-btn--noclick');
      el.special.font.content.btnserif.classList.add('sf-special-btn--noclick');
      el.special.font.content.btnmono.classList.remove('sf-special-btn--noclick');

      _this.cookies.set('specialfont', 'serif', 7);
    });
    this.stack.events.push(plugin.events.fontserif);
  }

  if (this.stack.ev(plugin.events.fontmono)) {
    this.receive(plugin.events.fontmono, window, function () {
      html.classList.remove('special-font-sans');
      html.classList.remove('special-font-serif');
      html.classList.add('special-font-mono');
      el.special.font.content.btnsans.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.font.content.btnserif.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.font.content.btnmono.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.font.content.btnsans.classList.remove('sf-special-btn--noclick');
      el.special.font.content.btnserif.classList.remove('sf-special-btn--noclick');
      el.special.font.content.btnmono.classList.add('sf-special-btn--noclick');

      _this.cookies.set('specialfont', 'mono', 7);
    });
    this.stack.events.push(plugin.events.fontmono);
  } // #endregion Font


  if (this.stack.ev(plugin.events.keglless)) {
    this.receive(plugin.events.keglless, window, function () {
      _this.updateparam(plugin.cookies);

      if (plugin.cookies.specialkegl < 24) {
        var kegl = Number(plugin.cookies.specialkegl);
        kegl++;
        setKegl(kegl);

        _this.cookies.set('specialkegl', kegl, 7);
      }
    });
    this.stack.events.push(plugin.events.keglless);
  }

  if (this.stack.ev(plugin.events.keglmore)) {
    this.receive(plugin.events.keglmore, window, function () {
      _this.updateparam(plugin.cookies);

      if (plugin.cookies.specialkegl > 14) {
        var kegl = Number(plugin.cookies.specialkegl);
        kegl--;
        setKegl(kegl);

        _this.cookies.set('specialkegl', kegl, 7);
      }
    });
    this.stack.events.push(plugin.events.keglmore);
  } // Kerning


  if (this.stack.ev(plugin.events.kerningnormal)) {
    this.receive(plugin.events.kerningnormal, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.remove('special-kerning-middle');
      html.classList.remove('special-kerning-big');
      el.special.kerning.content.btnnormal.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.kerning.content.btnmiddle.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.kerning.content.btnbig.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.kerning.content.btnnormal.classList.add('sf-special-btn--noclick');
      el.special.kerning.content.btnmiddle.classList.remove('sf-special-btn--noclick');
      el.special.kerning.content.btnbig.classList.remove('sf-special-btn--noclick');

      _this.cookies.set('specialkerning', 'normal', 7);
    });
    this.stack.events.push(plugin.events.kerningnormal);
  } //


  if (this.stack.ev(plugin.events.kerningmiddle)) {
    this.receive(plugin.events.kerningmiddle, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.add('special-kerning-middle');
      html.classList.remove('special-kerning-big');
      el.special.kerning.content.btnnormal.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.kerning.content.btnmiddle.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.kerning.content.btnbig.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.kerning.content.btnnormal.classList.remove('sf-special-btn--noclick');
      el.special.kerning.content.btnmiddle.classList.add('sf-special-btn--noclick');
      el.special.kerning.content.btnbig.classList.remove('sf-special-btn--noclick');

      _this.cookies.set('specialkerning', 'middle', 7);
    });
    this.stack.events.push(plugin.events.kerningmiddle);
  }

  if (this.stack.ev(plugin.events.kerningbig)) {
    this.receive(plugin.events.kerningbig, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.remove('special-kerning-middle');
      html.classList.add('special-kerning-big');
      el.special.kerning.content.btnnormal.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.kerning.content.btnmiddle.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.kerning.content.btnbig.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.kerning.content.btnnormal.classList.remove('sf-special-btn--noclick');
      el.special.kerning.content.btnmiddle.classList.remove('sf-special-btn--noclick');
      el.special.kerning.content.btnbig.classList.add('sf-special-btn--noclick');

      _this.cookies.set('specialkerning', 'big', 7);
    });
    this.stack.events.push(plugin.events.kerningbig);
  } //===========
  // Interval Увеличение интервала текста


  if (this.stack.ev(plugin.events.intervalone)) {
    this.receive(plugin.events.intervalone, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.remove('special-interval-15');
      html.classList.remove('special-interval-20');
      el.special.interval.content.btnone.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.interval.content.btnhalf.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.interval.content.btntwo.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.interval.content.btnone.classList.add('sf-special-btn--noclick');
      el.special.interval.content.btnhalf.classList.remove('sf-special-btn--noclick');
      el.special.interval.content.btntwo.classList.remove('sf-special-btn--noclick');

      _this.cookies.set('specialinterval', '1', 7);
    });
    this.stack.events.push(plugin.events.intervalone);
  }

  if (this.stack.ev(plugin.events.intervalhalf)) {
    this.receive(plugin.events.intervalhalf, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.add('special-interval-15');
      html.classList.remove('special-interval-20');
      el.special.interval.content.btnone.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.interval.content.btnhalf.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.interval.content.btntwo.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.interval.content.btnone.classList.remove('sf-special-btn--noclick');
      el.special.interval.content.btnhalf.classList.add('sf-special-btn--noclick');
      el.special.interval.content.btntwo.classList.remove('sf-special-btn--noclick');

      _this.cookies.set('specialinterval', '1.5', 7);
    });
    this.stack.events.push(plugin.events.intervalhalf);
  }

  if (this.stack.ev(plugin.events.intervaltwo)) {
    this.receive(plugin.events.intervaltwo, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.remove('special-interval-15');
      html.classList.add('special-interval-20');
      el.special.interval.content.btnone.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.interval.content.btnhalf.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.interval.content.btntwo.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.interval.content.btnone.classList.remove('sf-special-btn--noclick');
      el.special.interval.content.btnhalf.classList.remove('sf-special-btn--noclick');
      el.special.interval.content.btntwo.classList.add('sf-special-btn--noclick');

      _this.cookies.set('specialinterval', '2.0', 7);
    });
    this.stack.events.push(plugin.events.intervaltwo);
  } // =======================================================


  if (this.stack.ev(plugin.events.imagecolor)) {
    this.receive(plugin.events.imagecolor, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.remove('special-img-none');
      html.classList.remove('special-img-black');
      el.special.img.content.btnoff.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.img.content.btnbw.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.img.content.btncolor.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.img.content.btnoff.classList.remove('sf-special-btn--noclick');
      el.special.img.content.btnbw.classList.remove('sf-special-btn--noclick');
      el.special.img.content.btncolor.classList.add('sf-special-btn--noclick');

      _this.cookies.set('specialimage', 'oncolor', 7);
    });
    this.stack.events.push(plugin.events.imagecolor);
  }

  if (this.stack.ev(plugin.events.imageblack)) {
    this.receive(plugin.events.imageblack, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.remove('special-img-none');
      html.classList.add('special-img-black');
      el.special.img.content.btnoff.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.img.content.btnbw.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.img.content.btncolor.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.img.content.btnoff.classList.remove('sf-special-btn--noclick');
      el.special.img.content.btnbw.classList.add('sf-special-btn--noclick');
      el.special.img.content.btncolor.classList.remove('sf-special-btn--noclick');

      _this.cookies.set('specialimage', 'onblack', 7);
    });
    this.stack.events.push(plugin.events.imageblack);
  }

  if (this.stack.ev(plugin.events.imageoff)) {
    this.receive(plugin.events.imageoff, window, function () {
      _this.updateparam(plugin.cookies);

      html.classList.add('special-img-none');
      html.classList.remove('special-img-black');
      el.special.img.content.btnoff.style.setProperty('background-color', 'var(--sf-primary-container)', 'important');
      el.special.img.content.btnbw.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.img.content.btncolor.style.setProperty('background-color', 'var(--sf-surface-popup)', 'important');
      el.special.img.content.btnoff.classList.add('sf-special-btn--noclick');
      el.special.img.content.btnbw.classList.remove('sf-special-btn--noclick');
      el.special.img.content.btncolor.classList.remove('sf-special-btn--noclick');

      _this.cookies.set('specialimage', 'off', 7);
    });
    this.stack.events.push(plugin.events.imageoff);
  } // ============================================


  this.buttonColorNotActive = button => {
    button.classList.remove('sf-special-btn--noclick');
    button.style.boxShadow = 'none';
    button.style.zIndex = 'auto';
  };

  this.buttonColorActive = button => {
    button.classList.add('sf-special-btn--noclick');
    button.style.boxShadow = 'var(--sf-ui-focus)';
    button.style.zIndex = 1;
  };

  if (this.stack.ev(plugin.events.colorwhite)) {
    this.receive(plugin.events.colorwhite, window, () => {
      let button = el.special.color.content;

      _this.updateparam(plugin.cookies); // service.insertBefore(_this.el.special, service.firstChild);


      html.classList.add('special');
      body.classList.add('sf-special-white');
      body.classList.remove('sf-special-black', 'sf-special-yellow', 'sf-special-blue', 'sf-special-green'); // _this.el.linkcss.parentNode.removeChild(_this.el.linkcss);
      // _this.el.linkcss = _this.addcss(plugin.modifier.specialwhite);

      _this.buttonColorActive(button.btnwhite);

      _this.buttonColorNotActive(button.btnblack);

      _this.buttonColorNotActive(button.btnyellow);

      _this.buttonColorNotActive(button.btnblue);

      _this.buttonColorNotActive(button.btngreen);

      _this.cookies.set('specialcolor', 'specialwhite', 7);
    });
    this.stack.events.push(plugin.events.colorwhite);
  }

  if (this.stack.ev(plugin.events.colorblack)) {
    this.receive(plugin.events.colorblack, window, () => {
      let button = el.special.color.content; //var service = document.body.querySelector('.sf-service-top-area');
      // service.insertBefore(_this.el.special, service.firstChild);

      html.classList.add('special');
      body.classList.add('sf-special-black');
      body.classList.remove('sf-special-white', 'sf-special-yellow', 'sf-special-blue', 'sf-special-green'); // _this.el.linkcss.parentNode.removeChild(_this.el.linkcss);
      // _this.el.linkcss = _this.addcss(plugin.modifier.specialblack);

      _this.buttonColorActive(button.btnblack);

      _this.buttonColorNotActive(button.btnwhite);

      _this.buttonColorNotActive(button.btnyellow);

      _this.buttonColorNotActive(button.btnblue);

      _this.buttonColorNotActive(button.btngreen);

      _this.cookies.set('specialcolor', 'specialblack', 7);
    });
    this.stack.events.push(plugin.events.colorblack);
  }

  if (this.stack.ev(plugin.events.coloryellow)) {
    this.receive(plugin.events.coloryellow, window, () => {
      let button = el.special.color.content; //var service = document.body.querySelector('.sf-service-top-area');
      // service.insertBefore(_this.el.special, service.firstChild);

      html.classList.add('special');
      body.classList.add('sf-special-yellow');
      body.classList.remove('sf-special-white', 'sf-special-black', 'sf-special-blue', 'sf-special-green'); // _this.el.linkcss.parentNode.removeChild(_this.el.linkcss);
      // _this.el.linkcss = _this.addcss(plugin.modifier.specialyellow);

      _this.buttonColorActive(button.btnyellow);

      _this.buttonColorNotActive(button.btnwhite);

      _this.buttonColorNotActive(button.btnblack);

      _this.buttonColorNotActive(button.btnblue);

      _this.buttonColorNotActive(button.btngreen);

      _this.cookies.set('specialcolor', 'specialyellow', 7);
    });
    this.stack.events.push(plugin.events.coloryellow);
  }

  if (this.stack.ev(plugin.events.colorblue)) {
    this.receive(plugin.events.colorblue, window, () => {
      let button = el.special.color.content; //var service = document.body.querySelector('.sf-service-top-area');
      // service.insertBefore(_this.el.special, service.firstChild);

      html.classList.add('special');
      body.classList.add('sf-special-blue');
      body.classList.remove('sf-special-white', 'sf-special-black', 'sf-special-yellow', 'sf-special-green'); // _this.el.linkcss.parentNode.removeChild(_this.el.linkcss);
      // _this.el.linkcss = _this.addcss(plugin.modifier.specialblue);

      _this.buttonColorActive(button.btnblue);

      _this.buttonColorNotActive(button.btnwhite);

      _this.buttonColorNotActive(button.btnblack);

      _this.buttonColorNotActive(button.btnyellow);

      _this.buttonColorNotActive(button.btngreen);

      _this.cookies.set('specialcolor', 'specialblue', 7);
    });
    this.stack.events.push(plugin.events.colorblue);
  }

  if (this.stack.ev(plugin.events.colorgreen)) {
    this.receive(plugin.events.colorgreen, window, () => {
      let button = el.special.color.content; // service.insertBefore(_this.el.special, service.firstChild);

      html.classList.add('special');
      body.classList.add('sf-special-green');
      body.classList.remove('sf-special-white', 'sf-special-black', 'sf-special-yellow', 'sf-special-blue'); // _this.el.linkcss.parentNode.removeChild(_this.el.linkcss);
      // _this.el.linkcss = _this.addcss(plugin.modifier.specialgreen);

      _this.buttonColorActive(button.btngreen);

      _this.buttonColorNotActive(button.btnwhite);

      _this.buttonColorNotActive(button.btnblack);

      _this.buttonColorNotActive(button.btnyellow);

      _this.buttonColorNotActive(button.btnblue);

      _this.cookies.set('specialcolor', 'specialgreen', 7);
    });
    this.stack.events.push(plugin.events.colorgreen);
  }

  if (this.stack.ev(plugin.events.soundoff)) {
    this.receive(plugin.events.soundoff, window, () => {
      var btnplay = document.body.querySelectorAll('[sf-play]');

      for (var k = 0; k < btnplay.length; k++) {
        btnplay[k].parentNode.removeChild(btnplay[k]);
      }

      _this.cookies.set('specialsound', 'off', 7);
    });
    this.stack.events.push(plugin.events.soundoff);
  } // end Sound


  this.defaultSetting = () => {
    let defaultParams = new SF.Parameters().newparams().blocks.special;
    let panel = this.el.special;
    html.classList.remove('special-font-sans', 'special-font-serif', 'special-font-mono');
    this.cookies.set('specialfont', defaultParams.cookies.specialfont, 7);
    panel.font.status.innerText = BX.message("SF_SPECIAL__FONT_DEFAULT");
    setKegl(defaultParams.cookies.specialkegl);
    panel.kegl.status.innerText = `${defaultParams.cookies.specialkegl}${BX.message("SF_SPECIAL__SPECIAL_KEGL")}`;
    this.cookies.set('specialkegl', defaultParams.cookies.specialkegl, 7);
    html.classList.remove('special-kerning-middle', 'special-kerning-big');
    this.cookies.set('specialkerning', defaultParams.cookies.specialkerning, 7);
    this.send(defaultParams.events.kerningnormal, this.el.special.kerning.content.btnnormal);
    panel.kerning.status.innerText = BX.message("SF_SPECIAL__KERNING_NORMAL");
    html.classList.remove('special-interval-15', 'special-interval-20');
    this.cookies.set('specialinterval', '1', 7);
    this.send(defaultParams.events.intervalone, this.el.special.interval.content.btnone);
    panel.interval.status.innerText = BX.message("SF_SPECIAL__INTERVAL_1_0");
    console.log('defaultSettings');
    body.classList.remove('sf-special-white', 'sf-special-black', 'sf-special-yellow', 'sf-special-blue', 'sf-special-green');
    this.cookies.set('specialcolor', defaultParams.cookies.specialcolor);
    this.send(defaultParams.events.colorwhite, this.el.special.color.content.btnwhite);
    panel.color.status.innerText = BX.message("SF_SPECIAL__BTN_WHITE");
    panel.img.status.innerText = BX.message("SF_SPECIAL__IMG_ON_COLOR");
    html.classList.remove('special-img-none', 'special-img-black');
    this.cookies.set('specialimage', 'on', 7);
    this.send(defaultParams.events.imagecolor, this.el.special.img.content.btncolor);
  };

  if (this.stack.ev(plugin.events.defaultsetting)) {
    this.receive(plugin.events.defaultsetting, window, this.defaultSetting.bind(this)); // this.receive(plugin.events.defaultsetting, window, function(e) {
    //     var o  = new SF.Parameters().newparams(),
    //         p = o.blocks.special,
    //         panel = e.target;
    //     html.classList.remove('special-font-sans', 'special-font-serif', 'special-font-mono');
    //     _this.cookies.set('specialfont', p.cookies.specialfont, 7);
    //     panel.font.status.innerText = BX.message("SF_SPECIAL__FONT_DEFAULT");
    //     html.style.fontSize = p.cookies.specialkegl + 'px';
    //     panel.kegl.status.innerText = p.cookies.specialkegl + BX.message("SF_SPECIAL__SPECIAL_KEGL");
    //     _this.cookies.set('specialkegl', p.cookies.specialkegl, 7);
    //     html.classList.remove('special-kerning-middle', 'special-kerning-big');
    //     _this.cookies.set('specialkerning', p.cookies.specialkerning, 7);
    //     _this.send(plugin.events.kerningnormal, el.special.kerning.content.btnnormal);
    //     panel.kerning.status.innerText = BX.message("SF_SPECIAL__KERNING_NORMAL");
    //     html.classList.remove('special-interval-15', 'special-interval-20');
    //     _this.cookies.set('specialinterval', '1', 7);
    //     _this.send(plugin.events.intervalone, el.special.interval.content.btnone);
    //     panel.interval.status.innerText = BX.message("SF_SPECIAL__INTERVAL_1_0");
    //     body.classList.remove('sf-special-white', 'sf-special-black', 'sf-special-yellow', 'sf-special-blue', 'sf-special-green');
    //     _this.cookies.set('specialcolor', p.cookies.specialcolor);
    //     _this.send(plugin.events.colorwhite, el.special.color.content.btnwhite);
    //     panel.color.status.innerText = BX.message("SF_SPECIAL__BTN_WHITE");
    //     panel.img.status.innerText = BX.message("SF_SPECIAL__IMG_ON_COLOR");
    //     html.classList.remove('special-img-none','special-img-black');
    //     // html.classList.remove();
    //     _this.cookies.set('specialimage', 'on', 7);
    //     _this.send(plugin.events.imagecolor, el.special.img.content.btncolor);
    // });

    this.stack.events.push(plugin.events.defaultsetting);
  }

  if (this.stack.ev(plugin.events.up)) {
    this.receive(plugin.events.up, window, function (e) {
      var panel = e.target;

      if (_this.cookies.get('specialup') == 'down') {
        panel.style.marginTop = '-' + panel.clientHeight + 'px';
        panel.onoff.content.btnup.style.bottom = '-' + panel.onoff.content.btnup.clientHeight + 'px';
        panel.onoff.content.btnup.style.transform = 'rotate(180deg)';

        _this.cookies.set('specialup', 'up', 7);
      } else {
        panel.style.marginTop = '0';
        panel.onoff.content.btnup.style.bottom = '0';
        panel.onoff.content.btnup.style.transform = 'rotate(0deg)';

        _this.cookies.set('specialup', 'down', 7);
      }
    });
    this.stack.events.push(plugin.events.up);
  }

  this.actionButtonClick = e => {
    e.preventDefault();

    switch (this.cookies.get('specialstate')) {
      case 'off':
        this.send(this.el.params.events.open, this.el);
        break;

      case 'on':
        this.send(this.el.params.events.close, this.el);
        break;

      default:
        this.send(this.el.params.events.open, this.el);
        break;
    }
  }; // ============================================


  if (plugin.cookies.specialstate == 'off') {
    this.el.addEventListener('click', this.actionButtonClick.bind(this)); // _this.el.addEventListener('click', function(e) {
    //     e.preventDefault();
    //     switch(_this.cookies.get('specialstate'))
    //     {
    //         case 'off':
    //             _this.send(_this.el.params.events.open, _this.el);
    //             break;
    //         case 'on':
    //             // plugin.events.defaultsetting
    //             _this.send(_this.el.params.event.defaultsetting, _this.el);
    //             _this.el.special.remove();
    //             // panel.parentNode.removeChild(panel);
    //             // _this.el.linkcss.parentNode.removeChild(_this.el.linkcss);
    //             _this.cookies.set('specialstate', 'off', 7);
    //             break;
    //         default:
    //             _this.send(_this.el.params.events.open, _this.el);
    //             break;
    //     }
    // });
  } else {
    this.updateparam(plugin.cookies);
    this.send(plugin.events.open, this.el);
    this.el.addEventListener('click', this.actionButtonClick.bind(this)); // _this.el.addEventListener('click', function(e)
    // {
    //     switch(_this.cookies.get('specialstate'))
    //     {
    //         case 'off':
    //             _this.send(_this.el.params.events.open, _this.el);
    //             break;
    //         case 'on':
    //             _this.send(_this.el.params.event.defaultsetting, _this.el);
    //             _this.el.special.remove();
    //             // var panel = document.body.querySelector('[sf-special-panel]').remove();
    //             // panel.parentNode.removeChild(panel);
    //             // _this.el.linkcss.parentNode.removeChild(_this.el.linkcss);
    //             _this.cookies.set('specialstate', 'off', 7);
    //             break;
    //         default:
    //             _this.send(_this.el.params.events.open, _this.el);
    //             break;
    //     }
    // });
  } // ====== END CONSTRUCTOR ====== //

};

/***/ },

/***/ "5a3bd713b45f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bridgeLegacySpecial: () => (/* binding */ bridgeLegacySpecial),
/* harmony export */   keglScale: () => (/* binding */ keglScale),
/* harmony export */   legacySettings: () => (/* binding */ legacySettings)
/* harmony export */ });
/* harmony import */ var _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4fa740738112");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("06e8cd089f28");
// The legacy low-vision version as an alias of the display settings (owner
// decision C196 (7), 2026-11-15; until 2027-01-01, journal
// display-settings-replaces-special).
//
// The SF4 panel of the Bitrix templates (sf-system _special.js) still writes
// its classes: html.special with special-img-*, special-interval-*,
// special-font-*, and body.sf-special-<colour>. Its own sheet reset every
// background, colour and edge with !important and lost buttons and focus
// rings (SP-1, SP-2, SP-7). The classes are read here and written as the
// core's root attributes instead (core/scss/_sf_css__display.scss), for the
// page only: the panel keeps its own cookies as before, nothing new is kept.
// Each legacy use is noted once in SF.deprecations.
//
// The panel's text size (kegl, 14-24 px, 16 by default) was its own px on
// <html> and <body>. Since module.special 2.2.1 the panel writes it as the
// class special-kegl-<n> and it is read here as the core text step
// (data-sf-text-scale), which multiplies the browser's own size: the nearest
// step of TEXT_SCALES to kegl / 16, never below the person's own size.


const COLOURS = ['white', 'black', 'yellow', 'blue', 'green'];

function note(from, to) {
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__.noteDeprecated)({
    component: 'special',
    kind: 'class',
    from,
    to,
    since: _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_0__.LEGACY_SINCE,
    remove_after: _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_0__.LEGACY_REMOVE_AFTER
  });
} // The legacy panel's default text size, the size a text step multiplies.


const KEGL_BASE = 16;
const KEGL_CLASS = /^special-kegl-(\d{1,2})$/u;
/** The core text step of a legacy kegl: the nearest of TEXT_SCALES, a tie upwards, at least 100. */

function keglScale(kegl) {
  const share = Number(kegl) / KEGL_BASE * 100;
  if (!Number.isFinite(share) || share <= 100) return 100;
  return _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_0__.TEXT_SCALES.reduce((best, step) => Math.abs(step - share) <= Math.abs(best - share) ? step : best, 100);
}
/** The display settings the legacy classes ask for (null: the version is off). */

function legacySettings(html, body) {
  if (!html?.classList?.contains('special')) return null;

  const has = name => html.classList.contains(name);

  const colour = COLOURS.find(name => body?.classList?.contains(`sf-special-${name}`)) ?? '';
  const settings = {};

  if (colour) {
    settings.scheme = (0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_0__.schemeName)(colour);
    note(`sf-special-${colour}`, `<html data-sf-scheme="${settings.scheme}">`);
  }

  if (has('special-interval-15') || has('special-interval-20')) {
    settings.textSpacing = 'wide';
    note(has('special-interval-15') ? 'special-interval-15' : 'special-interval-20', '<html data-sf-text-spacing="wide">');
  }

  if (has('special-img-none')) {
    settings.images = 'hide';
    note('special-img-none', '<html data-sf-images="hide">');
  } else if (has('special-img-black')) {
    settings.images = 'grey';
    note('special-img-black', '<html data-sf-images="grey">');
  }

  const kegl = [...html.classList].map(name => KEGL_CLASS.exec(name)?.[1]).find(Boolean);

  if (kegl) {
    settings.textScale = keglScale(kegl);
    if (Number(kegl) !== KEGL_BASE) note(`special-kegl-${kegl}`, `<html data-sf-text-scale="${settings.textScale}">`);
  }

  if (has('special-font-sans')) settings.font = 'sans';
  if (has('special-font-serif')) settings.font = 'serif';
  return settings;
}
/** Follows the legacy classes on <html> and <body>; returns the stop. */

function bridgeLegacySpecial(doc = globalThis.document) {
  const html = doc?.documentElement;
  if (!html || doc.__sfSpecialBridge) return doc?.__sfSpecialBridge ?? null;
  let applied = false;

  const sync = () => {
    const settings = legacySettings(html, doc.body);

    if (settings) {
      (0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_0__.applySettings)(settings, html);
      applied = true;
    } else if (applied) {
      // The legacy panel turned the version off: back to the person's own choice.
      (0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_0__.applySettings)(globalThis.SF?.displaySettings?.read?.() ?? {}, html);
      applied = false;
    }
  };

  const Observer = doc.defaultView?.MutationObserver;
  const observer = Observer ? new Observer(sync) : null;

  const watch = () => {
    observer?.observe(html, {
      attributes: true,
      attributeFilter: ['class']
    });
    if (doc.body) observer?.observe(doc.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    sync();
  };

  if (doc.body) watch();else doc.addEventListener('DOMContentLoaded', watch, {
    once: true
  });

  const stop = () => {
    observer?.disconnect();
    delete doc.__sfSpecialBridge;
  };

  doc.__sfSpecialBridge = stop;
  return stop;
}

/***/ },

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   TAG_ALIAS_KIND: () => (/* binding */ TAG_ALIAS_KIND),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable),
/* harmony export */   readTagAliases: () => (/* binding */ readTagAliases)
/* harmony export */ });
// The dated alias table of one component (standard simai.smart-component
// 1.3.8 §16.20, vocabulary 1.1.5 §9): what the migration converter writes as
// <component>/aliases.json, read and checked here before core/js/aliases.js
// installs it on an element. Pure data, no DOM, so a build, a lint and the
// runtime share one reading of it.
//
// A table is a list of rows, or {tag, aliases: [rows]}. A row:
//
//   {from, to, kind, since, remove_after, mode?, when?, setting?, tag?}
//
//   kind      event | setting | attribute | action | value
//   since     the first day the new name exists, YYYY-MM-DD
//   remove_after
//             the last day the old name is promised, YYYY-MM-DD
//   mode      events only: same-detail (default) | detail-adds | split
//   when      events only, optional: {<detail field>: <value>}; the old name
//             is sent only for a new event whose detail matches (two old
//             names folded into one new name, as modal:after-hide and
//             modal:after-show into change)
//   setting   values only: the attribute the value belongs to
//
// A row that does not hold is refused with a reason, never thrown: the rest of
// the table still installs, and the refusals are reported.
//
// A `tag` row renames the element itself ({from: 'sf-close', to:
// 'sf-button-close', kind: 'tag', since, remove_after}). It is not installed on
// an element: the Smart base defines the old tag as a subclass when it defines
// the new one (core/js/tag-aliases.js), so readAliasTable leaves it out and
// readTagAliases reads it.
const ALIAS_KINDS = Object.freeze(['event', 'setting', 'attribute', 'action', 'value']);
const ALIAS_MODES = Object.freeze(['same-detail', 'detail-adds', 'split']);
const DAY = 86400000;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const ATTRIBUTE = /^[a-z][a-z0-9-]*$/u;
const MEMBER = /^[A-Za-z_$][\w$]*$/u;

function dateOf(text) {
  if (typeof text !== 'string' || !DATE.test(text)) return NaN;
  const time = Date.parse(`${text}T00:00:00Z`); // 2026-02-30 parses in some engines; it must print back as itself.

  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== text ? NaN : time;
} // `remove_after` is the last promised day, whole, in UTC: the old name is
// open until the end of it and expired from the next midnight.


function aliasExpired(row, now = Date.now()) {
  const last = dateOf(row?.remove_after);
  return Number.isFinite(last) && now >= last + DAY;
} // kebab-case attribute -> camelCase property: backdrop-blur -> backdropBlur.

function propertyOf(attribute) {
  return String(attribute).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
}
const TAG_ALIAS_KIND = 'tag'; // A custom element name of the Framework or of a package: lower case, a hyphen.

const ELEMENT = /^[a-z][a-z0-9]*-[a-z0-9-]+$/u;

function primitive(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function checkRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return 'not-an-object';
  const {
    from,
    to,
    kind,
    since,
    mode = 'same-detail',
    when,
    setting
  } = row;
  if (!ALIAS_KINDS.includes(kind)) return 'unknown-kind';
  if (typeof from !== 'string' || !from) return 'no-from';
  if (to === null || to === undefined || to === '') return 'no-new-name';
  if (typeof to !== 'string') return 'no-to';
  if (from === to) return 'same-name';
  const start = dateOf(since);
  const end = dateOf(row.remove_after);
  if (Number.isNaN(start)) return 'bad-since';
  if (Number.isNaN(end)) return 'bad-remove-after';
  if (end < start) return 'remove-after-before-since';
  if (!ALIAS_MODES.includes(mode)) return 'unknown-mode';
  if (kind !== 'event' && mode !== 'same-detail') return 'mode-on-non-event';

  if (when !== undefined) {
    if (kind !== 'event') return 'when-on-non-event';
    if (!when || typeof when !== 'object' || Array.isArray(when) || !Object.values(when).every(primitive)) return 'bad-when';
  }

  if (kind === 'setting' || kind === 'attribute') {
    if (!ATTRIBUTE.test(from) || !ATTRIBUTE.test(to)) return 'bad-attribute-name';
  }

  if (kind === 'action' && (!MEMBER.test(from) || !MEMBER.test(to))) return 'bad-member-name';

  if (kind === 'value') {
    if (typeof setting !== 'string' || !ATTRIBUTE.test(setting)) return 'value-needs-setting';
  } else if (setting !== undefined) {
    return 'setting-on-non-value';
  }

  return null;
}

function normal(row, tag) {
  const out = {
    kind: row.kind,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    tag: typeof row.tag === 'string' && row.tag ? row.tag : tag
  };

  if (row.kind === 'event') {
    out.mode = row.mode || 'same-detail';
    if (row.when) out.when = { ...row.when
    };
  }

  if (row.kind === 'value') out.setting = row.setting;
  return Object.freeze(out);
} // -> {tag, rows: [frozen rows], refused: [{index, from, to, kind, reason}]}


function readAliasTable(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];

  if (!Array.isArray(list)) {
    refused.push({
      index: -1,
      from: null,
      to: null,
      kind: null,
      reason: 'not-a-table'
    });
    return {
      tag: owner,
      rows,
      refused
    };
  }

  const refuse = (index, row, reason) => refused.push({
    index,
    from: row?.from ?? null,
    to: row?.to ?? null,
    kind: row?.kind ?? null,
    reason
  });

  const seen = new Map();
  list.forEach((row, index) => {
    if (row?.kind === TAG_ALIAS_KIND) return;
    const reason = checkRow(row);
    if (reason) return refuse(index, row, reason);
    const one = normal(row, owner); // An attribute, a property or a method has one new name; an event's old
    // name may be sent beside several new ones (split, folded names).

    const identity = one.kind === 'event' ? `event|${one.from}|${one.to}|${JSON.stringify(one.when ?? null)}` : one.kind === 'value' ? `value|${one.setting}|${one.from}` : `${one.kind === 'action' ? 'action' : 'name'}|${one.from}`;
    const before = seen.get(identity);
    if (before) return refuse(index, row, before.to === one.to ? 'duplicate' : 'conflict');
    seen.set(identity, one);
    rows.push({
      index,
      row: one
    });
  }); // Two old names folded into one new name by their detail: without `when`
  // each would be sent on every new event, the wrong one among them.

  const folded = new Map();

  for (const entry of rows) {
    const {
      row
    } = entry;
    if (row.kind !== 'event' || row.mode === 'same-detail' || row.when) continue;
    folded.set(row.to, [...(folded.get(row.to) ?? []), entry]);
  }

  const ambiguous = new Set();

  for (const group of folded.values()) if (group.length > 1) for (const entry of group) ambiguous.add(entry);

  const kept = [];

  for (const entry of rows) {
    if (ambiguous.has(entry)) refuse(entry.index, entry.row, 'needs-when');else kept.push(entry.row);
  }

  refused.sort((a, b) => a.index - b.index);
  return {
    tag: owner,
    rows: kept,
    refused
  };
} // The `tag` rows of a table: -> {tag, rows: [{from, to, since, remove_after}],
// refused: [{index, from, to, reason}]}. A row renames the table's own tag:
// its `to` is that tag when the table names one.

function readTagAliases(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.component === 'string' && table.component || !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];
  if (!Array.isArray(list)) return {
    tag: owner,
    rows,
    refused
  };
  const seen = new Set();
  list.forEach((row, index) => {
    if (row?.kind !== TAG_ALIAS_KIND) return;

    const refuse = reason => refused.push({
      index,
      from: row.from ?? null,
      to: row.to ?? null,
      reason
    });

    if (typeof row.from !== 'string' || !ELEMENT.test(row.from)) return refuse('bad-old-tag');
    if (typeof row.to !== 'string' || !ELEMENT.test(row.to)) return refuse('bad-new-tag');
    if (row.from === row.to) return refuse('same-name');
    if (owner && row.to !== owner) return refuse('not-this-tag');
    const start = dateOf(row.since);
    const end = dateOf(row.remove_after);
    if (Number.isNaN(start)) return refuse('bad-since');
    if (Number.isNaN(end)) return refuse('bad-remove-after');
    if (end < start) return refuse('remove-after-before-since');
    if (seen.has(row.from)) return refuse('duplicate');
    seen.add(row.from);
    rows.push(Object.freeze({
      from: row.from,
      to: row.to,
      since: row.since,
      remove_after: row.remove_after
    }));
  });
  return {
    tag: owner,
    rows,
    refused
  };
}

/***/ },

/***/ "06e8cd089f28"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearDeprecations: () => (/* binding */ clearDeprecations),
/* harmony export */   listDeprecations: () => (/* binding */ listDeprecations),
/* harmony export */   noteDeprecated: () => (/* binding */ noteDeprecated)
/* harmony export */ });
// What a page still uses that the Framework keeps only for compatibility. Every
// legacy attribute, value or name a component resolves is noted here once, so a
// person, a probe or an AI upgrading a product can read the list off a running
// page (SF.deprecations.list()) instead of searching the source for it. The
// records behind the names are in contracts/changes/journal.json.
//
// Nothing is printed by default: a page opts in to console warnings with
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true. A dated
// alias (core/js/aliases.js, standard simai.smart-component §16.20) also
// records `tag`, `since` and `remove_after`; once its date has passed the
// record turns `expired` and that is printed once whatever the page opted
// into, because the name can leave with the next sweep.
//
// Every bundle carries its own copy of this module, so a Map of its own made one
// list per bundle, and SF.deprecations.list() answered with whichever bundle set
// it last -- [] on a page printing seven warnings from others. The notes live on
// one shared global instead, whichever copy writes or reads them.
function sharedNotes() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__deprecationNotes instanceof Map)) {
    Object.defineProperty(root, '__deprecationNotes', {
      value: new Map(),
      configurable: true
    });
  }

  return root.__deprecationNotes;
}

function warnEnabled() {
  const root = globalThis.document?.documentElement;
  return root?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
}

function noteDeprecated({
  component = '',
  kind = 'attribute',
  attribute = '',
  from,
  to = null,
  tag,
  since,
  remove_after: removeAfter,
  expired,
  package: pkg
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  let note = notes.get(key);
  const firstExpiry = expired === true && note?.expired !== true;

  if (note) {
    note.count += 1;
  } else {
    note = {
      component,
      kind,
      attribute,
      from,
      to,
      count: 1
    };
    notes.set(key, note);
  } // The dated fields are kept only when a caller knows them, so the records of
  // the Framework's undated aliases keep their shape.


  if (tag !== undefined) note.tag = tag;
  if (since !== undefined) note.since = since;
  if (removeAfter !== undefined) note.remove_after = removeAfter; // The component package that ships the new name, for a package's element.

  if (pkg) note.package = pkg;
  if (expired === true) note.expired = true;

  if (firstExpiry) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} was due to leave after ${note.remove_after || 'its date'}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  } else if (note.count === 1 && warnEnabled()) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} is a legacy name${note.remove_after ? ` until ${note.remove_after}` : ''}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}

function describe({
  component,
  kind,
  attribute,
  from
}) {
  const where = component ? `${component}: ` : '';
  const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
  return `${where}${what}`;
}

function listDeprecations() {
  return [...sharedNotes().values()].map(note => ({ ...note
  }));
}
function clearDeprecations() {
  sharedNotes().clear();
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const api = globalThis.SF.deprecations || {};
  api.list = listDeprecations;
  api.clear = clearDeprecations;
  api.note = noteDeprecated;
  globalThis.SF.deprecations = api;
}

/***/ },

/***/ "4fa740738112"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULTS: () => (/* binding */ DEFAULTS),
/* harmony export */   FONTS: () => (/* binding */ FONTS),
/* harmony export */   IMAGES: () => (/* binding */ IMAGES),
/* harmony export */   LEGACY_REMOVE_AFTER: () => (/* binding */ LEGACY_REMOVE_AFTER),
/* harmony export */   LEGACY_SCHEMES: () => (/* binding */ LEGACY_SCHEMES),
/* harmony export */   LEGACY_SINCE: () => (/* binding */ LEGACY_SINCE),
/* harmony export */   SCHEMES: () => (/* binding */ SCHEMES),
/* harmony export */   STORAGE_KEY: () => (/* binding */ STORAGE_KEY),
/* harmony export */   TEXT_SCALES: () => (/* binding */ TEXT_SCALES),
/* harmony export */   WORDS: () => (/* binding */ WORDS),
/* harmony export */   applySettings: () => (/* binding */ applySettings),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forcedColors: () => (/* binding */ forcedColors),
/* harmony export */   fromRoot: () => (/* binding */ fromRoot),
/* harmony export */   installSkipLink: () => (/* binding */ installSkipLink),
/* harmony export */   isDefault: () => (/* binding */ isDefault),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   readStored: () => (/* binding */ readStored),
/* harmony export */   reducedMotion: () => (/* reexport safe */ _motion_js__WEBPACK_IMPORTED_MODULE_2__.reducedMotion),
/* harmony export */   resetSettings: () => (/* binding */ resetSettings),
/* harmony export */   schemeName: () => (/* binding */ schemeName),
/* harmony export */   writeSettings: () => (/* binding */ writeSettings)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _motion_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2ee7a47e9b10");
// SF.displaySettings: how a person asked this site to be shown (owner decision
// C196, 2026-11-15; research ui-control
// control/research/2026-11-15-accessibility-worldwide.md).
//
// The settings are root attributes the core sheet reads
// (core/scss/_sf_css__display.scss): data-sf-scheme, data-sf-text-scale,
// data-sf-text-spacing, data-sf-images, data-sf-motion, data-sf-font and
// data-sf-links. Core applies the person's choice on every page of the site,
// whether the page carries the sf-display-settings panel or not; the panel
// only writes it.
//
// - The device first: a text step multiplies the browser's own size; under
//   forced-colors the colours are the system's (the panel's colour group is
//   off); reducedMotion() is true when the device or the person asks.
// - The choice is kept in this browser only: localStorage
//   `sf-display-settings`, no cookie, nothing sent to a server (C196 (5)).
//   A browser that refuses storage keeps it for the page.
// - Nothing here claims that a site meets a standard (C196 (6)).
//
// Also the link «Перейти к содержимому» / «Skip to content» (C196, core on
// every site): written first in <body> when the page has a main region and no
// such link of its own; <html data-sf-skip-link="off"> leaves it out.
//
// The state is on the shared global: every bundle carries its own copy of
// this module.



const STORAGE_KEY = 'sf-display-settings';
const SCHEMES = Object.freeze(['black-on-white', 'white-on-black', 'yellow-on-black', 'blue-on-sky', 'brown-on-cream']);
const TEXT_SCALES = Object.freeze([100, 125, 150, 175, 200]);
const IMAGES = Object.freeze(['colour', 'grey', 'hide']);
const FONTS = Object.freeze(['site', 'sans', 'serif']); // The legacy low-vision version's scheme names (src/component/special, SF4
// cookies `specialcolor`), each to the nearest new scheme until 2027-01-01
// (C196 (3), (7); journal display-settings-replaces-special).

const LEGACY_SCHEMES = Object.freeze({
  white: 'black-on-white',
  black: 'white-on-black',
  yellow: 'yellow-on-black',
  blue: 'blue-on-sky',
  green: 'yellow-on-black'
});
const LEGACY_SINCE = '2026-11-15';
const LEGACY_REMOVE_AFTER = '2027-01-01'; // The words core says itself; the same as sf-display-settings' language files
// (tests/display-settings.contract.test.mjs holds them equal).

const WORDS = {
  en: {
    'skip-link-text': 'Skip to content'
  },
  ru: {
    'skip-link-text': 'Перейти к содержимому'
  }
};
const DEFAULTS = Object.freeze({
  scheme: '',
  textScale: 100,
  textSpacing: 'normal',
  images: 'colour',
  motion: 'system',
  font: 'site',
  links: 'site'
});
const ATTRIBUTES = Object.freeze({
  scheme: 'data-sf-scheme',
  textScale: 'data-sf-text-scale',
  textSpacing: 'data-sf-text-spacing',
  images: 'data-sf-images',
  motion: 'data-sf-motion',
  font: 'data-sf-font',
  links: 'data-sf-links'
});
const CAPTION = 'sf-image-caption';

function state() {
  const SF = globalThis.SF = globalThis.SF || {};
  const internal = SF.__internal || (SF.__internal = {});
  return internal.displaySettings ||= {
    listeners: new Set(),
    memory: null,
    observer: null,
    skipClick: false
  };
}

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
/** A scheme name as core knows it: a new name, a legacy name aliased, else ''. */


function schemeName(value) {
  const name = String(value ?? '').trim().toLowerCase().replace(/^special/u, '');
  if (SCHEMES.includes(name)) return name;
  const to = LEGACY_SCHEMES[name];
  if (!to) return '';
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: 'sf-display-settings',
    kind: 'value',
    attribute: 'scheme',
    from: String(value),
    to,
    since: LEGACY_SINCE,
    remove_after: LEGACY_REMOVE_AFTER,
    expired: Date.now() > Date.parse(`${LEGACY_REMOVE_AFTER}T23:59:59Z`)
  });
  return to;
}
/** The settings made safe: every field one of its values, unknown fields gone. */

function normalize(value) {
  const given = value && typeof value === 'object' ? value : {};
  const scale = Number(given.textScale);
  return {
    scheme: schemeName(given.scheme),
    textScale: TEXT_SCALES.includes(scale) ? scale : 100,
    textSpacing: given.textSpacing === 'wide' ? 'wide' : 'normal',
    images: IMAGES.includes(given.images) ? given.images : given.images === 'gray' ? 'grey' : 'colour',
    motion: given.motion === 'reduce' ? 'reduce' : 'system',
    font: FONTS.includes(given.font) ? given.font : 'site',
    links: given.links === 'underline' ? 'underline' : 'site'
  };
}
/** Whether nothing is changed. */

function isDefault(settings) {
  const value = normalize(settings);
  return Object.keys(DEFAULTS).every(key => value[key] === DEFAULTS[key]);
} // The root attribute of each field; a default is no attribute.

function attributeValue(key, value) {
  if (value === DEFAULTS[key]) return null;
  return String(value);
}
/** The settings the root shows now (a page or a server may have set them). */


function fromRoot(root = globalThis.document?.documentElement) {
  if (!root?.getAttribute) return normalize({});

  const read = key => root.getAttribute(ATTRIBUTES[key]);

  return normalize({
    scheme: read('scheme'),
    textScale: read('textScale') ?? 100,
    textSpacing: read('textSpacing'),
    images: read('images'),
    motion: read('motion'),
    font: read('font'),
    links: read('links')
  });
}
/** The person's choice kept in this browser, or null. */

function readStored() {
  const store = storage();

  if (store) {
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (raw !== null) return normalize(JSON.parse(raw));
    } catch {// Not JSON, or storage refused: as if nothing was kept.
    }
  }

  return state().memory ? normalize(state().memory) : null;
}

function captionImages(doc) {
  for (const image of doc.querySelectorAll('img[alt], svg[role="img"][aria-label]')) {
    const text = (image.getAttribute('alt') ?? image.getAttribute('aria-label') ?? '').trim();
    if (!text) continue;
    const anchor = image.parentElement?.localName === 'picture' ? image.parentElement : image;
    const next = anchor.nextElementSibling;

    if (next?.classList.contains(CAPTION)) {
      if (next.textContent !== text) next.textContent = text;
      continue;
    }

    const caption = doc.createElement('span');
    caption.className = CAPTION;
    caption.textContent = text;
    anchor.after(caption);
  }
}

function followImages(doc, hide) {
  const held = state();

  if (!hide) {
    held.observer?.disconnect();
    held.observer = null;
    return;
  }

  if (doc.body) captionImages(doc);
  if (held.observer || !doc.defaultView?.MutationObserver || !doc.documentElement) return;
  let queued = false;
  held.observer = new doc.defaultView.MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      captionImages(doc);
    });
  });
  held.observer.observe(doc.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['alt', 'aria-label']
  });
}
/** Writes the settings on the root (no storage). */


function applySettings(settings, root = globalThis.document?.documentElement) {
  if (!root?.setAttribute) return normalize(settings);
  const value = normalize(settings);

  for (const [key, name] of Object.entries(ATTRIBUTES)) {
    const next = attributeValue(key, value[key]);
    if (next === null) root.removeAttribute(name);else if (root.getAttribute(name) !== next) root.setAttribute(name, next);
  }

  if (root.ownerDocument) followImages(root.ownerDocument, value.images === 'hide');
  return value;
}

function announce(value, root) {
  for (const listener of state().listeners) {
    try {
      listener({ ...value
      });
    } catch (error) {
      console.error('SF.displaySettings listener failed', error);
    }
  }

  const View = root?.ownerDocument?.defaultView;
  if (View?.CustomEvent) root.ownerDocument.dispatchEvent(new View.CustomEvent('sf-display-change', {
    detail: { ...value
    }
  }));
}
/** Keeps the choice in this browser and shows it. */


function writeSettings(settings, root = globalThis.document?.documentElement) {
  const value = normalize(settings);
  const store = storage();
  const plain = isDefault(value) ? null : value;
  state().memory = plain;

  if (store) {
    try {
      if (plain) store.setItem(STORAGE_KEY, JSON.stringify(plain));else store.removeItem(STORAGE_KEY);
    } catch {// A full or refused storage keeps the choice for this page only.
    }
  }

  applySettings(value, root);
  announce(value, root);
  return value;
}
/** «Обычная версия»: everything back to the site's own look. */

function resetSettings(root = globalThis.document?.documentElement) {
  return writeSettings(DEFAULTS, root);
}

function matches(query) {
  try {
    return Boolean(globalThis.matchMedia?.(query).matches);
  } catch {
    return false;
  }
}
/** True when the device asks for less motion or the person stopped it here. */



/** True when the system sets the colours (Windows contrast themes). */

function forcedColors() {
  return matches('(forced-colors: active)');
} // ---------------------------------------------------------------------------
// «Перейти к содержимому»
// ---------------------------------------------------------------------------

function focusable(element) {
  return element.matches?.('a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]');
}

function skipTarget(link) {
  const hash = link.getAttribute('href') ?? '';
  if (!hash.startsWith('#') || hash.length < 2) return null;

  try {
    return link.ownerDocument.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
} // The keyboard follows the link: the target takes the focus (Safari and some
// screen readers leave it where it was on a jump to a non-focusable element).


function followSkip(event) {
  const link = event.target?.closest?.('a.sf-skip-link');
  if (!link) return;
  const target = skipTarget(link);
  if (!target) return;
  if (!focusable(target)) target.setAttribute('tabindex', '-1');
  target.focus({
    preventScroll: false
  });
}
/** Writes the skip link when the page has a main region and none of its own. */


function installSkipLink(doc = globalThis.document) {
  if (!doc?.body || !doc.documentElement) return null;
  const held = state();

  if (!held.skipClick) {
    held.skipClick = true;
    doc.addEventListener('click', followSkip);
  }

  if (doc.documentElement.getAttribute('data-sf-skip-link') === 'off') return null;
  if (doc.querySelector('a.sf-skip-link, a[data-sf-skip-link]')) return null;
  const main = doc.querySelector('main, [role="main"]');
  if (!main) return null;

  if (!main.id) {
    let id = 'sf-main';

    for (let n = 2; doc.getElementById(id); n += 1) id = `sf-main-${n}`;

    main.id = id;
  }

  const link = doc.createElement('a');
  link.className = 'sf-skip-link';
  link.href = `#${main.id}`;
  link.setAttribute('data-sf-skip-link', 'core');
  link.textContent = (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(WORDS, 'skip-link-text', doc.documentElement, {
    component: 'sf-display-settings',
    source: 'ru'
  });
  doc.body.prepend(link);
  return link;
} // ---------------------------------------------------------------------------

function subscribe(listener) {
  if (typeof listener !== 'function') return () => {};
  state().listeners.add(listener);
  return () => state().listeners.delete(listener);
}

function start() {
  const doc = globalThis.document;
  const root = doc?.documentElement;
  if (!root) return; // The person's choice, before the page draws what core draws. A setting the
  // page printed on the root itself stays when the person chose nothing.

  const stored = readStored();
  if (stored) applySettings(stored, root);else if (root.getAttribute(ATTRIBUTES.images) === 'hide') followImages(doc, true);

  const ready = () => {
    installSkipLink(doc);
    if (root.getAttribute(ATTRIBUTES.images) === 'hide') followImages(doc, true);
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', ready, {
    once: true
  });else ready(); // Another tab of the site changed the choice.

  globalThis.addEventListener?.('storage', event => {
    if (event.key !== STORAGE_KEY || event.storageArea !== storage()) return;
    let next = null;

    try {
      next = event.newValue === null ? null : JSON.parse(event.newValue);
    } catch {
      next = null;
    }

    announce(applySettings(next ?? DEFAULTS, root), root);
  });
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};

  if (!globalThis.SF.displaySettings) {
    globalThis.SF.displaySettings = Object.freeze({
      storageKey: STORAGE_KEY,
      schemes: SCHEMES,
      textScales: TEXT_SCALES,
      defaults: DEFAULTS,
      read: () => readStored() ?? fromRoot(),
      current: () => fromRoot(),
      write: settings => writeSettings(settings),
      reset: () => resetSettings(),
      subscribe,
      reducedMotion: () => (0,_motion_js__WEBPACK_IMPORTED_MODULE_2__.reducedMotion)(),
      forcedColors: () => forcedColors(),
      installSkipLink: doc => installSkipLink(doc)
    });
    start();
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (globalThis.SF?.displaySettings);

/***/ },

/***/ "2ee7a47e9b10"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MOTION_ATTRIBUTE: () => (/* binding */ MOTION_ATTRIBUTE),
/* harmony export */   MOTION_CHANGE: () => (/* binding */ MOTION_CHANGE),
/* harmony export */   reducedMotion: () => (/* binding */ reducedMotion),
/* harmony export */   watchMotion: () => (/* binding */ watchMotion)
/* harmony export */ });
// Whether to keep things still: the device asks for less motion
// (prefers-reduced-motion: reduce), or the person stopped motion on this site
// (<html data-sf-motion="reduce">, written by the sf-display-settings panel
// through SF.displaySettings; owner decision C196, 2026-11-15). Core's own
// scripts read this one function; the core sheet stops CSS animations and
// transitions under the same mark (core/scss/_sf_css__display.scss).
//
// No state and no side effect, so every bundle may carry it.
const MOTION_ATTRIBUTE = 'data-sf-motion';
const MOTION_CHANGE = 'sf-display-change';
function reducedMotion(root = globalThis.document?.documentElement, win = globalThis) {
  try {
    if (win.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
  } catch {// No media queries here: only the page's own mark.
  }

  return root?.getAttribute?.(MOTION_ATTRIBUTE) === 'reduce';
} // Calls `listener` when either source changes; returns the stop.

function watchMotion(listener, win = globalThis) {
  const media = win.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
  const doc = win.document;
  media?.addEventListener?.('change', listener);
  doc?.addEventListener?.(MOTION_CHANGE, listener);
  return () => {
    media?.removeEventListener?.('change', listener);
    doc?.removeEventListener?.(MOTION_CHANGE, listener);
  };
}

/***/ },

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followLanguage: () => (/* binding */ followLanguage),
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   localeText: () => (/* binding */ localeText),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText),
/* harmony export */   pageWord: () => (/* binding */ pageWord),
/* harmony export */   refreshLanguage: () => (/* binding */ refreshLanguage),
/* harmony export */   registeredWord: () => (/* binding */ registeredWord)
/* harmony export */ });
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
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
const REGISTERED = STORE.registered; // Language packs (owner decision C177, 2026-11-14): every language but the two
// built in is one file per language and delivery, fetched only by a page that
// speaks it. A pack's words go into the same registry as words registered one
// by one -- so a bundle built before packs existed reads them too -- a
// Framework pack's beneath what is there, any other pack's over it: a product
// overrides a Framework word whichever arrived first. The fetching is core's
// (core/js/language-packs.js); each bundle only asks for a language. A STORE
// made by an older bundle has no packs yet: they are added here.

const PACKS = STORE.packs ??= {
  loaded: new Map(),
  pending: new Map(),
  request: null
};

const isBuiltIn = code => code === 'ru' || code === 'en';
/**
 * Ask core for the pack of a language this page speaks (nothing for ru and
 * en), and for the part that holds `component`'s words: the Framework's pack
 * comes in parts by family (core/js/language-packs.js). A core from before
 * parts takes the language alone.
 */


function needPack(code, component) {
  const wanted = normalise(code);
  const base = wanted.split('-')[0];
  if (!base || isBuiltIn(base) || typeof PACKS.request !== 'function') return;
  const name = component ? (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component) : undefined;
  PACKS.request(base, name);
  if (wanted !== base) PACKS.request(wanted, name);
} // Words are kept under a component's current tag: a product that registered
// them for a renamed tag (sf-datepicker, now sf-input-date) keeps its words
// while the old tag is a dated alias, whichever name the element was written
// with (core/js/tag-aliases.js).


const wordsOf = component => REGISTERED.get((0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component));

function normalise(value) {
  return String(value ?? '').trim().toLowerCase().replace('_', '-');
}
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
}; // A layer drawn in a portal carries a copy of its host's language, stamped by
// carryLayerOrigin (§19.1). When that copy came from the page itself, it has
// to follow the page before the listeners draw: a word read inside a drawer
// during SF.language.use() answered the language the page had just left, and
// the portal was carried again only later, with nothing to draw it again
// (simai/ui-source#55, found by ui-mail). A portal whose host sits in a
// section with a language of its own is not touched: that section means it.


const carryPageLanguage = () => {
  const doc = globalThis.document;
  if (!doc?.querySelectorAll) return;
  const lang = doc.documentElement?.getAttribute('lang') || '';

  for (const portal of doc.querySelectorAll('[data-sf-layer-lang="page"]')) {
    if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
  }
};

const announce = () => {
  carryPageLanguage();

  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
}; // The nearest element that says its language, looking past shadow roots: a
// pagination drawn inside a data view's shadow root found no [lang] there,
// fell back to <html lang> and spoke English inside a Russian admin whose
// language was set on the shell around it.


function langOwner(node) {
  let current = node;

  while (current) {
    const owner = typeof current.closest === 'function' ? current.closest('[lang]') : null;
    if (owner) return owner;
    const root = typeof current.getRootNode === 'function' ? current.getRootNode() : null;
    current = root && root !== current && root.host ? root.host : null;
  }

  return null;
} // The language of a part of the page wins over the language chosen for the
// whole page (owner, 2026-10-26; standard simai.smart-component 1.3.8 §11.1):
//   1. a word given on the element itself (the component's own attribute);
//   2. the nearest [lang] below <html>;
//   3. the page's choice, SF.language.use(), which also sets <html lang>;
//   4. <html lang>;
//   5. English.
// Until 2026-10-27 the choice won over a section's [lang], so an English
// section inside a Russian page that had called use('ru') spoke Russian.


function languageSource(node) {
  const owner = langOwner(node);
  const root = globalThis.document?.documentElement ?? null;
  if (owner && owner !== root) return owner.getAttribute('lang');
  if (STORE.chosen) return STORE.chosen;
  return owner?.getAttribute('lang') || root?.lang || 'en';
}
/**
 * The page's language for this node: the nearest [lang] below <html>, else
 * the language the page chose, else <html lang>, else English.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  return normalise(languageSource(node)).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  return normalise(languageSource(node)) || 'en';
}
/**
 * Follows `lang` in the document (§11.1 «changes are followed»): one observer
 * for the page, whichever bundle starts it, and the elements under a changed
 * [lang] draw again. `element.requestComponentUpdate('language')` is what a
 * Smart element does; anything else passes its own `redraw`. Returns the way
 * to stop following.
 */

function followLanguage(element, redraw = () => element.requestComponentUpdate?.('language')) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const doc = element?.ownerDocument ?? root.document;
  const Observer = doc?.defaultView?.MutationObserver ?? root.MutationObserver;
  if (!doc?.documentElement || typeof Observer !== 'function') return () => {};

  if (!root.__sfLanguageWatch || root.__sfLanguageWatch.document !== doc) {
    const watch = {
      document: doc,
      elements: new Map(),
      observer: null
    };
    watch.observer = new Observer(records => {
      const changed = [...new Set(records.map(record => record.target))];

      for (const [one, again] of [...watch.elements]) {
        if (changed.some(target => within(target, one))) {
          try {
            again();
          } catch {// One element that fails to draw does not keep the others in the
            // old language.
          }
        }
      }
    });
    watch.observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
      subtree: true
    });
    root.__sfLanguageWatch = watch;
  }

  const watch = root.__sfLanguageWatch;
  watch.elements.set(element, redraw);
  return () => watch.elements.delete(element);
} // Whether `node` is `target` or below it, across shadow roots.

function within(target, node) {
  for (let current = node; current;) {
    if (current === target) return true;
    current = current.parentNode || current.host || null;
  }

  return false;
}
/**
 * Tell the page's components that words changed without a registration: the
 * composition editor words arrive in a chunk of their own (LC-1) and the
 * forms drawn before them draw again.
 */


function refreshLanguage() {
  announce();
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
  return localeText(dictionary, key, pageLocale(node), component ?? componentOf(node));
}
/**
 * Text for `key` in a named language, with no node to read it from: a server
 * fallback or a form drawn before it is placed. The same order as pageText --
 * words registered for `component`, then the shipped ones, for the language,
 * the language without its region and English -- and the key last.
 */

function localeText(dictionary, key, locale, component) {
  const order = chain(locale || 'en');
  needPack(order[0], component);

  for (const candidate of order) {
    const added = component ? wordsOf(component)?.get(candidate)?.[key] : undefined;

    if (added !== undefined) {
      if (candidate === 'en' && added !== '') warnFallback(order, component, key);
      return added;
    }

    const shipped = dictionary?.[candidate]?.[key];

    if (shipped !== undefined) {
      if (candidate === 'en' && shipped !== '') warnFallback(order, component, key);
      return shipped;
    }
  }

  return key;
} // A language the Framework does not ship (owner decision C177 (4)) may come
// partly translated: a word it lacks is said in the fallback language,
// English, and that is shown, not silent (localization study LC-6). One
// warning per page and language (de-AT and de are one), naming the first word
// missed; every word missed is kept by language for SF.language.missing(),
// and the language files' coverage is scripts/language-coverage.mjs. Kept on
// the shared global, because every bundle carries this module.

function warnFallback(order, owner, key) {
  const wanted = String(order[0] || '').split('-')[0]; // While its pack is on its way the English is a moment, not a gap.

  if (!wanted || wanted === 'en' || PACKS.pending.has(wanted)) return;
  const root = globalThis;
  if (!(root.__sfMissingWords instanceof Map)) root.__sfMissingWords = new Map();
  const seen = root.__sfMissingWords;

  if (!seen.has(wanted)) {
    seen.set(wanted, new Set());
    root.console?.warn?.(`[SIMAI Framework] "${wanted}": words missing, said in English (first: ${owner || 'component'} "${key}"); SF.language.missing('${wanted}') lists them`);
  }

  seen.get(wanted).add(`${owner || 'component'}|${key}`);
} // Missing words are said once per component, word and language: a page that
// draws a hundred rows must not print a hundred warnings. The marks are kept on
// the shared global, because every bundle carries this module.


function warnWord(owner, key, locale, said) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfWordWarnings instanceof Set)) root.__sfWordWarnings = new Set();
  const mark = `${owner}|${key}|${locale}|${said}`;
  if (root.__sfWordWarnings.has(mark)) return;

  root.__sfWordWarnings.add(mark);

  globalThis.console?.warn?.(`[SIMAI Framework] ${owner || 'component'}: no word "${key}" for ${locale}${said === 'key' ? '; the key is shown' : `; said in ${said}`}`);
}

function fill(text, locale, count, vars) {
  return String(text).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => {
    if (name === 'n' && count !== undefined) {
      try {
        return new Intl.NumberFormat(locale).format(count);
      } catch {
        return String(count);
      }
    }

    return vars && Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole;
  });
}
/**
 * A component's own word (standard simai.smart-component 1.3.8 §11, §11.1).
 *
 * `dictionary` is `{<locale>: {<key>: word}}` from the component's language
 * files. A word given on the element itself is the caller's to prefer; this
 * resolves the rest: words registered for the element's language, then the
 * shipped ones, the language without its region, English, the component's
 * source language and, last, the key. The last two warn once. A word that
 * takes a number is an object of plural forms chosen by Intl.PluralRules of
 * the language the word was found in; `{n}` is the number in that language's
 * format and `{name}` takes `vars.name`.
 *
 * `former` names the key the same word had before a rename (one key or a
 * list): a product that registered its words under the old key keeps them
 * until the alias's day. For each language the word registered under the new
 * key wins, then one registered under an old key, then the shipped one; a
 * word taken by an old key is reported to `onFormer(oldKey)`, which notes the
 * deprecation.
 */


function pageWord(dictionary, key, node, {
  component,
  source = '',
  count,
  vars,
  former,
  onFormer
} = {}) {
  const owner = component ?? componentOf(node);
  const locale = pageLocale(node);
  const order = chain(locale);
  const sourceLanguage = normalise(source);
  if (sourceLanguage && !order.includes(sourceLanguage)) order.push(sourceLanguage);
  const formerKeys = former === undefined || former === null ? [] : [].concat(former);
  needPack(locale, owner);

  for (const candidate of order) {
    const registered = owner ? wordsOf(owner)?.get(candidate) : undefined;
    let added = registered?.[key];

    if (added === undefined && registered) {
      const old = formerKeys.find(name => registered[name] !== undefined && registered[name] !== null);

      if (old !== undefined) {
        added = registered[old];
        onFormer?.(old);
      }
    }

    const word = added !== undefined ? added : dictionary?.[candidate]?.[key];
    if (word === undefined || word === null) continue;
    if (candidate === sourceLanguage && !chain(locale).includes(candidate)) warnWord(owner, key, locale, candidate);
    if (candidate === 'en' && word !== '') warnFallback(chain(locale), owner, key);

    if (typeof word === 'object') {
      let form = 'other';

      if (count !== undefined) {
        try {
          form = new Intl.PluralRules(candidate).select(Number(count));
        } catch {
          form = 'other';
        }
      }

      const picked = word[form] ?? word.other;
      if (picked === undefined) continue;
      return fill(picked, candidate, count, vars);
    }

    return fill(word, candidate, count, vars);
  }

  warnWord(owner, key, locale, 'key');
  return key;
}
/**
 * The word a product registered (SF.language.register, or a product pack)
 * under `key` for the node's language, its base language or English; the
 * words a component ships are not read. Undefined when none is registered.
 * A removed word key kept as a dated alias reads this: the old phrase is
 * said only while a product still writes the old key.
 */

function registeredWord(component, key, node) {
  const byLanguage = wordsOf(component ?? componentOf(node));
  if (!byLanguage) return undefined;

  for (const candidate of chain(pageLocale(node))) {
    const word = byLanguage.get(candidate)?.[key];
    if (word !== undefined && word !== null) return word;
  }

  return undefined;
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
    if (next) needPack(next); // The choice is the page's language: <html lang> says it too (§11.1), so
    // the browser, a screen reader and CSS :lang() agree with the words.
    // use(null) gives the markup's own language back.

    const root = globalThis.document?.documentElement;

    if (root) {
      const holder = globalThis;

      if (next) {
        if (holder.__sfMarkupLanguage === undefined) holder.__sfMarkupLanguage = root.getAttribute('lang');
        if (root.getAttribute('lang') !== next) root.setAttribute('lang', next);
      } else if (holder.__sfMarkupLanguage !== undefined) {
        if (holder.__sfMarkupLanguage === null) root.removeAttribute('lang');else root.setAttribute('lang', holder.__sfMarkupLanguage);
        holder.__sfMarkupLanguage = undefined;
      }
    }

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
    const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component ?? '');
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

  /**
   * A language pack (schema simai.language-pack, schema_version 1; schema
   * core/contracts/language-pack.v1.schema.json): every word of one language
   * for one delivery, by component. A Framework pack's words go beneath the
   * words already registered, any other pack's over them, as register() does.
   * The page draws again once. Answers what was taken, or null for something
   * that is not a pack.
   */
  registerPack(pack, url = null) {
    const code = normalise(pack?.lang);

    if (pack?.schema !== 'simai.language-pack' || pack.schema_version !== 1 || !code || !pack.words || typeof pack.words !== 'object') {
      globalThis.console?.warn?.(`[SIMAI Framework] not a language pack (simai.language-pack, schema_version 1)${url ? `: ${url}` : ''}`);
      return null;
    }

    const under = (pack.delivery ?? 'framework') === 'framework';
    let words = 0;

    for (const [component, byKey] of Object.entries(pack.words)) {
      if (!byKey || typeof byKey !== 'object') continue;
      const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component);
      if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
      const byLanguage = REGISTERED.get(name);
      const now = byLanguage.get(code) ?? {};
      byLanguage.set(code, under ? { ...byKey,
        ...now
      } : { ...now,
        ...byKey
      });
      words += Object.keys(byKey).length;
    }

    const info = {
      lang: code,
      delivery: pack.delivery ?? 'framework',
      status: pack.status ?? null,
      coverage: pack.coverage ?? null,
      words,
      url
    };
    PACKS.loaded.set(code, [...(PACKS.loaded.get(code) ?? []), info]); // Core registers the parts that arrived together and draws once
    // (PACKS.quiet while it does).

    if (!PACKS.quiet) announce();
    return info;
  },

  /**
   * Name a pack file to fetch when the page needs its language: one line for
   * a product or a page (also SF_BOOT_CONFIG.languages = {code: url}). Core
   * fetches it once, with the Framework's own pack of that language.
   */
  addPack(value, url) {
    return PACKS.add ? PACKS.add(normalise(value), url) : false;
  },

  /** Fetch the packs of a language now; resolves when they are registered. */
  load(value) {
    return PACKS.load ? PACKS.load(normalise(value)) : Promise.resolve([]);
  },

  /** The packs on the page: {code: [{lang, delivery, status, coverage, words, url}]}. */
  packs() {
    return Object.fromEntries([...PACKS.loaded].map(([code, list]) => [code, list.map(info => ({ ...info
    }))]));
  },

  /** One language across many components: `{ 'sf-input-date': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    return [...(wordsOf(component ?? '')?.keys() ?? [])];
  },

  /**
   * The words the page has said in English so far for want of one in
   * `value` (C177 (4): a language may ship partly; what it lacks is visible).
   * `['sf-pagination|pages-label', ...]`; every language's when none is named.
   */
  missing(value) {
    const seen = globalThis.__sfMissingWords instanceof Map ? globalThis.__sfMissingWords : new Map();
    if (value === undefined) return Object.fromEntries([...seen].map(([code, words]) => [code, [...words]]));
    return [...(seen.get(normalise(value).split('-')[0]) ?? [])];
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
    PACKS.loaded.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {}; // Every bundle publishes its copy; they share one store, so any copy
  // answers alike -- except that a bundle built before language packs
  // (an older package on the page) has no registerPack, addPack, load or
  // packs. Once a copy with them is published, an older one does not
  // replace it (C177).

  const holder = window.SF;

  if (!Object.getOwnPropertyDescriptor(holder, 'language')?.set) {
    let published = holder.language;
    Object.defineProperty(holder, 'language', {
      configurable: true,
      enumerable: true,
      get: () => published,
      set: value => {
        if (typeof value?.registerPack === 'function' || typeof published?.registerPack !== 'function') published = value;
      }
    });
  }

  holder.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "f28a9d913ce0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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
  remove_after: '2027-01-01',
  package: 'pro'
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
  remove_after: '2027-01-01',
  package: 'pro'
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
  remove_after: '2027-01-01',
  package: 'pro'
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
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
})]));

/***/ },

/***/ "4a85acfb05c1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
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
      remove_after: String(row.remove_after ?? ''),
      ...(typeof row.package === 'string' && row.package ? {
        package: row.package
      } : {})
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
    expired,
    package: row.package
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return; // A package's element says which package ships it now (C174 NM-3).

  const where = row.package ? ` from the component package ${row.package}` : '';
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>${where}. See contracts/changes/journal.json.`);
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

/***/ },

/***/ "966768cd0def"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("966768cd0def");
/* harmony import */ var _sf_system_js_01_namespace_namespace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("715d840bc035");
/* harmony import */ var _sf_system_js_01_namespace_namespace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_01_namespace_namespace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _sf_system_js_02_methods_methods_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("35142b0e629d");
/* harmony import */ var _sf_system_js_02_methods_methods_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_02_methods_methods_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _sf_system_js_02_methods_events_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f253d6b93335");
/* harmony import */ var _sf_system_js_02_methods_events_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_02_methods_events_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _sf_system_js_03_system_parameters_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("5dcf727c65f8");
/* harmony import */ var _sf_system_js_03_system_parameters_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_03_system_parameters_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _sf_system_js_03_system_controller_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a912dc962a61");
/* harmony import */ var _sf_system_js_03_system_controller_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_03_system_controller_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _sf_system_js_03_system_search_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("8b84d027b9f0");
/* harmony import */ var _sf_system_js_03_system_search_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_03_system_search_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _sf_system_js_03_system_blocks_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("1935cdb080e3");
/* harmony import */ var _sf_system_js_03_system_blocks_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_03_system_blocks_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _sf_system_js_03_system_provider_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("67345c14abf1");
/* harmony import */ var _sf_system_js_03_system_provider_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_03_system_provider_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _sf_system_js_04_blocks_special_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("003c85f0f0fb");
/* harmony import */ var _sf_system_js_04_blocks_special_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_04_blocks_special_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _sf_system_js_03_system_stack_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("d604676a9b24");
/* harmony import */ var _sf_system_js_03_system_stack_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_sf_system_js_03_system_stack_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _js_bridge_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("5a3bd713b45f");










 // The panel's classes become the core display settings (owner decision C196
// (7), until 2027-01-01): js/bridge.js.

 // document.addEventListener('DOMContentLoaded', (e) => {

new SF.Controller(); // });

(0,_js_bridge_js__WEBPACK_IMPORTED_MODULE_11__.bridgeLegacySpecial)();
})();

/******/ })()
;