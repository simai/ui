"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[29674760300161],{

/***/ "5c88e08d5986"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ldif)
/* harmony export */ });
/*
Language: LDIF
Contributors: Jacob Childress <jacobc@gmail.com>
Category: enterprise, config
Website: https://en.wikipedia.org/wiki/LDAP_Data_Interchange_Format
*/

/** @type LanguageFn */
function ldif(hljs) {
  return {
    name: 'LDIF',
    contains: [
      {
        className: 'attribute',
        match: '^dn(?=:)',
        relevance: 10
      },
      {
        className: 'attribute',
        match: '^\\w+(?=:)'
      },
      {
        className: 'literal',
        match: '^-'
      },
      hljs.HASH_COMMENT_MODE
    ]
  };
}




/***/ }

}]);