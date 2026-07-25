"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[34393957451762],{

/***/ "f8ee0a343b1f"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ subunit)
/* harmony export */ });
/*
Language: SubUnit
Author: Sergey Bronnikov <sergeyb@bronevichok.ru>
Website: https://pypi.org/project/python-subunit/
Category: protocols
*/

function subunit(hljs) {
  const DETAILS = {
    className: 'string',
    begin: '\\[\n(multipart)?',
    end: '\\]\n'
  };
  const TIME = {
    className: 'string',
    begin: '\\d{4}-\\d{2}-\\d{2}(\\s+)\\d{2}:\\d{2}:\\d{2}\.\\d+Z'
  };
  const PROGRESSVALUE = {
    className: 'string',
    begin: '(\\+|-)\\d+'
  };
  const KEYWORDS = {
    className: 'keyword',
    relevance: 10,
    variants: [
      { begin: '^(test|testing|success|successful|failure|error|skip|xfail|uxsuccess)(:?)\\s+(test)?' },
      { begin: '^progress(:?)(\\s+)?(pop|push)?' },
      { begin: '^tags:' },
      { begin: '^time:' }
    ]
  };
  return {
    name: 'SubUnit',
    case_insensitive: true,
    contains: [
      DETAILS,
      TIME,
      PROGRESSVALUE,
      KEYWORDS
    ]
  };
}




/***/ }

}]);