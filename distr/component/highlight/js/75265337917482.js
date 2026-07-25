"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[75265337917482],{

/***/ "07d9c9a26966"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ taggerscript)
/* harmony export */ });
/*
Language: Tagger Script
Author: Philipp Wolfer <ph.wolfer@gmail.com>
Description: Syntax Highlighting for the Tagger Script as used by MusicBrainz Picard.
Website: https://picard.musicbrainz.org
Category: scripting
 */
function taggerscript(hljs) {
  const NOOP = {
    className: 'comment',
    begin: /\$noop\(/,
    end: /\)/,
    contains: [
      { begin: /\\[()]/ },
      {
        begin: /\(/,
        end: /\)/,
        contains: [
          { begin: /\\[()]/ },
          'self'
        ]
      }
    ],
    relevance: 10
  };

  const FUNCTION = {
    className: 'keyword',
    begin: /\$[_a-zA-Z0-9]+(?=\()/
  };

  const VARIABLE = {
    className: 'variable',
    begin: /%[_a-zA-Z0-9:]+%/
  };

  const ESCAPE_SEQUENCE_UNICODE = {
    className: 'symbol',
    begin: /\\u[a-fA-F0-9]{4}/
  };

  const ESCAPE_SEQUENCE = {
    className: 'symbol',
    begin: /\\[\\nt$%,()]/
  };

  return {
    name: 'Tagger Script',
    contains: [
      NOOP,
      FUNCTION,
      VARIABLE,
      ESCAPE_SEQUENCE,
      ESCAPE_SEQUENCE_UNICODE
    ]
  };
}




/***/ }

}]);