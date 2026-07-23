(self["webpackChunk"] = self["webpackChunk"] || []).push([[70605472562103],{

/***/ "71af1de15885"
(module) {

/*
Language: Node REPL
Requires: javascript.js
Author: Marat Nagayev <nagaevmt@yandex.ru>
Category: scripting
*/

/** @type LanguageFn */
function nodeRepl(hljs) {
  return {
    name: 'Node REPL',
    contains: [
      {
        className: 'meta.prompt',
        starts: {
          // a space separates the REPL prefix from the actual code
          // this is purely for cleaner HTML output
          end: / |$/,
          starts: {
            end: '$',
            subLanguage: 'javascript'
          }
        },
        variants: [
          { begin: /^>(?=[ ]|$)/ },
          { begin: /^\.\.\.(?=[ ]|$)/ }
        ]
      }
    ]
  };
}

module.exports = nodeRepl;


/***/ }

}]);