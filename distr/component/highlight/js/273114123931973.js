"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[273114123931973],{

/***/ "e63ce7c4eb7d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dockerfile)
/* harmony export */ });
/*
Language: Dockerfile
Requires: bash.js
Author: Alexis Hénaut <alexis@henaut.net>
Description: language definition for Dockerfile files
Website: https://docs.docker.com/engine/reference/builder/
Category: config
*/

/** @type LanguageFn */
function dockerfile(hljs) {
  const KEYWORDS = [
    "from",
    "maintainer",
    "expose",
    "env",
    "arg",
    "user",
    "onbuild",
    "stopsignal"
  ];
  return {
    name: 'Dockerfile',
    aliases: [ 'docker' ],
    case_insensitive: true,
    keywords: KEYWORDS,
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        beginKeywords: 'run cmd entrypoint volume add copy workdir label healthcheck shell',
        starts: {
          end: /[^\\]$/,
          subLanguage: 'bash'
        }
      }
    ],
    illegal: '</'
  };
}




/***/ }

}]);