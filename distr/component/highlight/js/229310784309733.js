"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[229310784309733],{

/***/ "f90fc841cd86"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ profile)
/* harmony export */ });
/*
Language: Python profiler
Description: Python profiler results
Author: Brian Beck <exogen@gmail.com>
*/

function profile(hljs) {
  return {
    name: 'Python profiler',
    contains: [
      hljs.C_NUMBER_MODE,
      {
        begin: '[a-zA-Z_][\\da-zA-Z_]+\\.[\\da-zA-Z_]{1,3}',
        end: ':',
        excludeEnd: true
      },
      {
        begin: '(ncalls|tottime|cumtime)',
        end: '$',
        keywords: 'ncalls tottime|10 cumtime|10 filename',
        relevance: 10
      },
      {
        begin: 'function calls',
        end: '$',
        contains: [ hljs.C_NUMBER_MODE ],
        relevance: 10
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\\(',
        end: '\\)$',
        excludeBegin: true,
        excludeEnd: true,
        relevance: 0
      }
    ]
  };
}




/***/ }

}]);