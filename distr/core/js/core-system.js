"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[88616323197113],{

/***/ "fedbedd6b87f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   receive: () => (/* binding */ receive),
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
function receive(event, el, handler) {
  if (window.addEventListener) {
    el.addEventListener(event, handler, false);
  } else if (window.attachEvent) {
    el.attachEvent(event, handler);
  }
}
SF.receive = receive;

/***/ },

/***/ "d55d5a9f332f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

/***/ }

}]);