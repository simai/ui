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

SF.send = async function (event, element) {
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
      button.style.setProperty('background-color', param.backgroundColor ? param.backgroundColor : '#FFF', 'important');
      button.style.setProperty('border-color', param.borderColor ? param.borderColor : '#d1d5da', 'important');
      button.style.setProperty('color', param.color ? param.color : '#000', 'important');
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
          button.style.boxShadow = `0 0px 0px 4px ${param.boxShadowColor ? param.boxShadowColor : 'lightgrey'}`;
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
      btn.style.setProperty('background-color', param.backgroundColor ? param.backgroundColor : '#FFF', 'important');
      btn.style.setProperty('border-color', param.borderColor ? param.borderColor : '#d1d5da', 'important');
      btn.style.setProperty('line-height', 1, 'important');
      btn.style.setProperty('letter-spacing', 'normal', 'important');
      btn.addEventListener('mouseover', () => {
        if (!btn.classList.contains('sf-special-btn--noclick')) {
          btn.style.setProperty('background-color', param.backgroundColorHover ? param.backgroundColorHover : '#d1d5da', 'important');
        }
      });
      btn.addEventListener('mouseout', () => {
        if (!btn.classList.contains('sf-special-btn--noclick')) {
          btn.style.setProperty('background-color', param.backgroundColor ? param.backgroundColor : '#FFF', 'important');
        }
      });
      btn.addEventListener('focus', () => {
        btn.style.outline = 'none';
      });
      btn.style.setProperty('color', param.color ? param.color : '#000', 'important');
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
      panel.status.style.setProperty('color', '#000', 'important');
      panel.status.innerText = status();
    };

    this.setLocalNameStyle = (panel = false, className = false, name = false) => {
      panel.name.className = className;
      panel.name.style.fontSize = '.875em';
      panel.name.style.setProperty('margin-bottom', '.75em', 'important');
      panel.name.style.setProperty('color', '#000', 'important');
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
    panel.style.setProperty('border-bottom', '1px solid #D1D5DA', 'important');
    panel.style.setProperty('font-size', '16px', 'important');
    panel.setAttribute('sf-special-panel', '');
    panel.classList.add('relative');
    panel.style.setProperty('background-color', '#fff', 'important');
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
    panel.font.content.style.setProperty('border-color', '#d1d5da', 'important');
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
    panel.kegl.content.style.setProperty('border-color', '#d1d5da', 'important');
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
    panel.kerning.content.style.setProperty('border-color', '#d1d5da', 'important');
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
    panel.interval.content.style.setProperty('border-color', '#d1d5da', 'important');
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
    panel.color.content.classList.add('color-content', 'flex');
    panel.color.content.style.boxShadow = '0 1px 2px 1px rgb(0,0,0,0.1)';
    panel.color.content.style.borderRadius = '6px'; // panel.color.status.classList.add('status-text');
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
      backgroundColor: '#FFF',
      color: '#000',
      padding: '12px',
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '6px',
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
      backgroundColor: '#000',
      color: '#FFF',
      borderColor: '#000',
      padding: '12px',
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
      backgroundColor: '#FF0',
      // boxShadowColor: '#FF0',
      color: '#000',
      borderColor: '#FF0',
      padding: '12px',
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
      backgroundColor: '#9fd7ff',
      color: '#000',
      borderColor: '#9fd7ff',
      padding: '12px',
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
      backgroundColor: '#a9dd38',
      color: '#000',
      borderColor: '#a9dd38',
      padding: '12px',
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '6px',
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

    panel.img.content.style.setProperty('border-color', '#d1d5da', 'important');
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
        panel.sound.name.style.setProperty('color','#000','important');
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
        panel.sound.status.style.setProperty('color','#000','important');
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
    panel.onoff.content.style.setProperty('border-color', '#d1d5da', 'important');
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

    panel.onoff.content.btnup.style.borderBottom = '0 solid black'; // panel.onoff.content.btnup.style.borderRadius = '0';

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


  var _this = this;

  if (this.stack.ev('searchstart')) {
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

  plugin.cookies = this.updateparam(plugin.cookies);

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

      html.style.fontSize = plugin.cookies.specialkegl + 'px';
      body.style.fontSize = plugin.cookies.specialkegl + 'px';

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
      el.special.font.content.btnsans.style.setProperty('background-color', '#d1d5da', 'important');
      el.special.font.content.btnserif.style.setProperty('background-color', '#FFF', 'important');
      el.special.font.content.btnmono.style.setProperty('background-color', '#FFF', 'important');
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
      el.special.font.content.btnsans.style.setProperty('background-color', '#FFF', 'important');
      el.special.font.content.btnserif.style.setProperty('background-color', '#d1d5da', 'important');
      el.special.font.content.btnmono.style.setProperty('background-color', '#FFF', 'important');
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
      el.special.font.content.btnsans.style.setProperty('background-color', '#FFF', 'important');
      el.special.font.content.btnserif.style.setProperty('background-color', '#FFF', 'important');
      el.special.font.content.btnmono.style.setProperty('background-color', '#d1d5da', 'important');
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
        html.style.fontSize = kegl + 'px';
        body.style.fontSize = kegl + 'px';

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
        html.style.fontSize = kegl + 'px';
        body.style.fontSize = kegl + 'px';

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
      el.special.kerning.content.btnnormal.style.setProperty('background-color', '#d1d5da', 'important');
      el.special.kerning.content.btnmiddle.style.setProperty('background-color', '#FFF', 'important');
      el.special.kerning.content.btnbig.style.setProperty('background-color', '#FFF', 'important');
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
      el.special.kerning.content.btnnormal.style.setProperty('background-color', '#FFF', 'important');
      el.special.kerning.content.btnmiddle.style.setProperty('background-color', '#d1d5da', 'important');
      el.special.kerning.content.btnbig.style.setProperty('background-color', '#FFF', 'important');
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
      el.special.kerning.content.btnnormal.style.setProperty('background-color', '#FFF', 'important');
      el.special.kerning.content.btnmiddle.style.setProperty('background-color', '#FFF', 'important');
      el.special.kerning.content.btnbig.style.setProperty('background-color', '#d1d5da', 'important');
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
      el.special.interval.content.btnone.style.setProperty('background-color', '#d1d5da', 'important');
      el.special.interval.content.btnhalf.style.setProperty('background-color', '#FFF', 'important');
      el.special.interval.content.btntwo.style.setProperty('background-color', '#FFF', 'important');
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
      el.special.interval.content.btnone.style.setProperty('background-color', '#FFF', 'important');
      el.special.interval.content.btnhalf.style.setProperty('background-color', '#d1d5da', 'important');
      el.special.interval.content.btntwo.style.setProperty('background-color', '#FFF', 'important');
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
      el.special.interval.content.btnone.style.setProperty('background-color', '#FFF', 'important');
      el.special.interval.content.btnhalf.style.setProperty('background-color', '#FFF', 'important');
      el.special.interval.content.btntwo.style.setProperty('background-color', '#d1d5da', 'important');
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
      el.special.img.content.btnoff.style.setProperty('background-color', '#FFF', 'important');
      el.special.img.content.btnbw.style.setProperty('background-color', '#FFF', 'important');
      el.special.img.content.btncolor.style.setProperty('background-color', '#d1d5da', 'important');
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
      el.special.img.content.btnoff.style.setProperty('background-color', '#FFF', 'important');
      el.special.img.content.btnbw.style.setProperty('background-color', '#d1d5da', 'important');
      el.special.img.content.btncolor.style.setProperty('background-color', '#FFF', 'important');
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
      el.special.img.content.btnoff.style.setProperty('background-color', '#d1d5da', 'important');
      el.special.img.content.btnbw.style.setProperty('background-color', '#FFF', 'important');
      el.special.img.content.btncolor.style.setProperty('background-color', '#FFF', 'important');
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
    button.style.boxShadow = '0 0px 0px 4px lightgrey';
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
    html.style.fontSize = `${defaultParams.cookies.specialkegl}px`;
    body.style.fontSize = `${defaultParams.cookies.specialkegl}px`;
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










 // document.addEventListener('DOMContentLoaded', (e) => {

new SF.Controller(); // });
})();

/******/ })()
;