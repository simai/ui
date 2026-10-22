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
SF.__internal.send = send;
function receive(event, el, handler) {
  if (window.addEventListener) {
    el.addEventListener(event, handler, false);
  } else if (window.attachEvent) {
    el.attachEvent(event, handler);
  }
}
SF.__internal.receive = receive;

/***/ },

/***/ "d55d5a9f332f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ readyCallback)
/* harmony export */ });
/* harmony import */ var _core_js_ready_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5effd0d9c238");
// The callback form of SF.ready, kept for the components that call it. SF.ready
// itself lives on the shared global, created once by whichever bundle runs
// first (core.js does, before this chunk): src/core/js/ready.js.

const ready = (0,_core_js_ready_js__WEBPACK_IMPORTED_MODULE_0__.installReady)();
function readyCallback(handler) {
  return (window.SF?.ready || ready)?.(handler);
}

/***/ }

}]);