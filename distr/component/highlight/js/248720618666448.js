"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[248720618666448],{

/***/ "5a911b56b0e7"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ golo)
/* harmony export */ });
/*
Language: Golo
Author: Philippe Charriere <ph.charriere@gmail.com>
Description: a lightweight dynamic language for the JVM
Website: http://golo-lang.org/
Category: system
*/

function golo(hljs) {
  const KEYWORDS = [
    "println",
    "readln",
    "print",
    "import",
    "module",
    "function",
    "local",
    "return",
    "let",
    "var",
    "while",
    "for",
    "foreach",
    "times",
    "in",
    "case",
    "when",
    "match",
    "with",
    "break",
    "continue",
    "augment",
    "augmentation",
    "each",
    "find",
    "filter",
    "reduce",
    "if",
    "then",
    "else",
    "otherwise",
    "try",
    "catch",
    "finally",
    "raise",
    "throw",
    "orIfNull",
    "DynamicObject|10",
    "DynamicVariable",
    "struct",
    "Observable",
    "map",
    "set",
    "vector",
    "list",
    "array"
  ];

  return {
    name: 'Golo',
    keywords: {
      keyword: KEYWORDS,
      literal: [
        "true",
        "false",
        "null"
      ]
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'meta',
        begin: '@[A-Za-z]+'
      }
    ]
  };
}




/***/ }

}]);