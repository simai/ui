/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "d29271955a22"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("251572daff8d");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("91caf1e1e58a");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("8898abd551c7");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d5a87cc95e86");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("13d97237b26f");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("06be59085add");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-empty-state: what a list, a panel or a page says when it has nothing to
// show (owner-approved assignment, 2026-10-14). One component for the four
// reasons -- nothing yet, nothing found, no access, could not load -- each
// with its icon, a title that is a real heading at the page's level, a
// sentence and what the person can do next.







 // From its component.json (standard simai.smart-component 1.3.8 §3, §4,
// §7.4.1, §8): settings are attributes and properties made by
// core/js/element-manifest.js, the words are lang/<locale>.json (a product
// adds a language through SF.language.register("sf-empty-state", code,
// words)), and title is a dated alias of heading.

const EmptyStateElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
});
const ICONS = {
  'no-data': 'inbox',
  'nothing-found': 'search_off',
  'no-access': 'lock',
  error: 'error'
};
const TONES = {
  'no-data': 'neutral',
  'nothing-found': 'neutral',
  'no-access': 'warning',
  error: 'error'
};

class SfEmptyState extends EmptyStateElement {
  static get props() {
    return { ...super.props,
      rootClass: {
        default: ''
      }
    };
  } // [{id, text, appearance}]: drawn at the component's size; each sends
  // sf-empty-state-action {id}. Unset is null, so an error offers «Повторить».


  get actions() {
    return Array.isArray(this.__sfManifestData?.actions) ? this.__sfManifestData.actions : null;
  }

  set actions(value) {
    if (!this.__sfManifestData) this.__sfManifestData = {};
    this.__sfManifestData.actions = Array.isArray(value) ? value.filter(action => action && action.id !== undefined) : null;
    this.requestComponentUpdate('actions');
  } // inline: one line for a list inside a menu, a dropdown or a search -- a
  // small icon, the words and at most one link action, no heading. Size 1/3
  // is always inline (owner, 2026-10-14).


  get layout() {
    if (this.getAttribute('size') === '1/3') return 'inline';
    return this.getAttribute('layout') === 'inline' ? 'inline' : 'block';
  }

  set layout(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('layout');else this.setAttribute('layout', String(value));
  } // A heading at the page's level, 2..6; 3 when the attribute says otherwise.


  get headingLevel() {
    const value = Number(this.getAttribute('heading-level'));
    return Number.isInteger(value) && value >= 2 && value <= 6 ? value : 3;
  }

  set headingLevel(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('heading-level');else this.setAttribute('heading-level', String(value));
  } // auto: nothing-found and error are a polite status, the others say
  // nothing; alert: an error the person caused, such as a search that failed
  // as they typed; off: the host announces it itself.


  liveRole() {
    if (this.live === 'off') return null;
    if (this.live === 'alert') return 'alert';
    return this.kind === 'nothing-found' || this.kind === 'error' ? 'status' : null;
  }

  words(key) {
    return this.sfWord(key);
  } // The actions to draw: the host's, or «Повторить» for an error that has none.


  resolvedActions() {
    const actions = this.actions;
    if (actions) return actions;
    if (this.hasSlotContent?.('actions')) return [];
    return this.kind === 'error' ? [{
      id: 'retry',
      text: this.words('retry'),
      appearance: 'outline'
    }] : [];
  }

  act(id) {
    this.sfEmit('action', {
      id: String(id)
    });
  }

  templateContext() {
    const kind = this.kind;
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      kind,
      size: this.size,
      headingLevel: this.headingLevel,
      shownIcon: this.icon || ICONS[kind],
      tone: TONES[kind],
      shownTitle: this.heading || this.words(`${kind}-title`),
      shownText: this.text || this.words(`${kind}-text`),
      resolvedActions: this.resolvedActions(),
      layout: this.layout,
      liveRole: this.liveRole(),
      // The line of the inline form: the host's words, else the kind's title.
      shownLine: this.text || this.heading || this.words(`${kind}-title`),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderEmptyStateTemplate)(this.templateContext());
  }

}

SfEmptyState.define('sf-empty-state');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "251572daff8d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderEmptyStateTemplate: () => (/* binding */ renderEmptyStateTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ee5035470810");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The featured icon, title role and button a step up from the component's
// size: a state in a panel (1/2) is a size-1 icon, a page (2) a size-3 one.

const ICON_SIZE = {
  '1/2': '1',
  1: '2',
  2: '3'
};
const BUTTON_SIZE = {
  '1/2': '1/2',
  1: '1',
  2: '1'
}; // The inline form: one line, the icon at the text's size, the words and the
// first action as a link. No heading, so a list inside a menu or a dropdown
// gains no outline entry and no item.

function renderInline(context) {
  const size = context.size === '1' ? '1' : '1-2';
  const [action] = context.resolvedActions ?? [];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-empty-state', 'sf-empty-state--inline', `sf-empty-state--size-${size}`, `sf-empty-state--${context.kind}`, context.rootClass].filter(Boolean).join(' ')}
         role=${context.liveRole ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <i class="sf-icon sf-empty-state-icon" aria-hidden="true">${context.shownIcon}</i>
      <span class="sf-empty-state-line">${context.shownLine}</span>
      ${action ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-empty-state-link" size=${size === '1' ? '1' : '1/2'} appearance="link" scheme="primary" spacing="compact"
                 text=${action.text ?? ''} data-action=${String(action.id)}
                 @click=${() => context.component.act(action.id)}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}

function renderEmptyStateTemplate(context) {
  if (context.layout === 'inline') return renderInline(context);
  const tag = (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStatic)(`h${context.headingLevel}`);
  const size = String(context.size).replace('/', '-');
  const actions = context.resolvedActions ?? [];
  const slotted = context.component?.hasSlotContent?.('actions') ? context.component.getSlotContent('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-empty-state', `sf-empty-state--size-${size}`, `sf-empty-state--${context.kind}`, context.rootClass].filter(Boolean).join(' ')}
         role=${context.liveRole ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <span class=${`sf-featured-icon sf-featured-icon--size-${ICON_SIZE[context.size] ?? '2'} sf-featured-icon--${context.tone} sf-featured-icon--soft sf-empty-state-icon`}
            aria-hidden="true"><i class="sf-icon">${context.shownIcon}</i></span>
      ${(0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__.html)`<${tag} class="sf-empty-state-title">${context.shownTitle}</${tag}>`}
      ${context.shownText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-empty-state-text">${context.shownText}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${actions.length || slotted !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-empty-state-actions">
            ${slotted}
            ${actions.map(action => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${BUTTON_SIZE[context.size] ?? '1'} appearance=${action.appearance ?? 'default'}
                scheme=${action.scheme ?? (action.appearance === 'outline' ? 'on-surface' : 'primary')}
                text=${action.text ?? ''} data-action=${String(action.id)}
                @click=${() => context.component.act(action.id)}></sf-button>`)}
          </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "06be59085add"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "f550d360fd36"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ j),
/* harmony export */   html: () => (/* binding */ b),
/* harmony export */   mathml: () => (/* binding */ T),
/* harmony export */   noChange: () => (/* binding */ E),
/* harmony export */   nothing: () => (/* binding */ A),
/* harmony export */   render: () => (/* binding */ D),
/* harmony export */   svg: () => (/* binding */ w)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t=>t,s=t.trustedTypes,e=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),T=x(3),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o+x):s+o+(-2===d?i:x)}return[V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t)}else t.startsWith(o)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o),i=t.length-1;if(i>0){r.textContent=s?s.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c())}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else{let t=-1;for(;-1!==(t=r.data.indexOf(o,t+1));)d.push({type:7,index:l}),t+=o.length-1}l++}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n]}o!==r?.index&&(h=P.nextNode(),o++)}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i(t).nextSibling;i(t).remove(),t=s}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r}o&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class I extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class L extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const j={M:h,P:o,A:n,C:1,L:N,R,D:d,V:M,I:k,H,N:L,U:z,B:I,F:Z},B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{})}return h._$AI(t),h};
//# sourceMappingURL=lit-html.js.map


/***/ },

/***/ "ba5a8db95d92"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* binding */ u),
/* harmony export */   literal: () => (/* binding */ i),
/* harmony export */   mathml: () => (/* binding */ $),
/* harmony export */   svg: () => (/* binding */ c),
/* harmony export */   unsafeStatic: () => (/* binding */ s),
/* harmony export */   withStatic: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const a=Symbol.for(""),o=t=>{if(t?.r===a)return t?._$litStatic$},s=t=>({_$litStatic$:t,r:a}),i=(t,...r)=>({_$litStatic$:r.reduce((r,e,a)=>r+(t=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(e)+t[a+1],t[0]),r:a}),l=new Map,n=t=>(r,...e)=>{const a=e.length;let s,i;const n=[],u=[];let c,$=0,f=!1;for(;$<a;){for(c=r[$];$<a&&void 0!==(i=e[$],s=o(i));)c+=s+r[++$],f=!0;$!==a&&u.push(i),n.push(c),$++}if($===a&&n.push(r[a]),f){const t=n.join("$$lit$$");void 0===(r=l.get(t))&&(n.raw=n,l.set(t,r=n)),e=u}return t(r,...e)},u=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.html),c=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.svg),$=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.mathml);
//# sourceMappingURL=static.js.map


/***/ },

/***/ "ee5035470810"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.html),
/* harmony export */   literal: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.literal),
/* harmony export */   mathml: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.mathml),
/* harmony export */   svg: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.svg),
/* harmony export */   unsafeStatic: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.unsafeStatic),
/* harmony export */   withStatic: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.withStatic)
/* harmony export */ });
/* harmony import */ var lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ba5a8db95d92");

//# sourceMappingURL=static-html.js.map


/***/ },

/***/ "8898abd551c7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-empty-state for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-empty-state","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-empty-state","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26"},{"from":"sf-empty-state-action","to":null,"kind":"event","component":"sf-empty-state","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§8","note":"the DOM name and the detail {id} stay; the manifest declares the verb action"}]}');

/***/ },

/***/ "91caf1e1e58a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.empty-state","tag":"sf-empty-state","version":"1.1.5","kind":"leaf","settings":{"kind":{"type":"enum","values":["no-data","nothing-found","no-access","error"],"default":"no-data","summary":"The reason, which picks the default icon, title and text, and for error a «Повторить» action."},"size":{"type":"enum","values":["1/3","1/2","1","2"],"default":"1","summary":"1/3 is always the inline form; 1/2 inside a table or panel, 2 for a whole page: the icon, title role, text and gaps follow."},"icon":{"type":"icon","default":""},"heading":{"type":"string","default":""},"text":{"type":"string","default":""},"heading-level":{"type":"number","default":3,"integer":true,"min":2,"max":6,"summary":"The title\'s outline level; its look follows the size."},"layout":{"type":"enum","values":["block","inline"],"default":"block","summary":"inline: one line for a list inside a menu, a dropdown or a search -- a small icon, the words and at most one link action, no heading."},"live":{"type":"enum","values":["auto","alert","off"],"default":"auto","summary":"auto: nothing-found and error are a polite status, the others say nothing; alert: an error the person caused; off: the host announces it."},"actions":{"type":"list","of":{"id":"id","text":"string","appearance":"string"},"x-summary":"The buttons to draw, each sending action {id}; unset, an error offers «Повторить» (id retry)"}},"values":{},"events":{"action":{"carries":{"id":"string"},"own-verb":true,"summary":"The person pressed one of the actions (retry for an error without actions of its own)."}},"actions":{},"css-variables":{"--sf-empty-state-max-inline-size":{"type":"length","state":"default"},"--sf-empty-state-color":{"type":"color","state":"default"},"--sf-empty-state-text-color":{"type":"color","state":"default"},"--sf-empty-state-gap":{"type":"length","state":"default"},"--sf-empty-state-padding-block":{"type":"length","state":"default"},"--sf-empty-state-actions-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "d5a87cc95e86"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Empty state","runtime":{"error-text":"Try again","error-title":"Could not load","no-access-text":"Ask an administrator for access","no-access-title":"No access","no-data-text":"They will appear here once added","no-data-title":"No records yet","nothing-found-text":"Try another query or other filters","nothing-found-title":"Nothing found","retry":"Try again"},"events":{"action":{"label":"Do the empty state\'s action"}}}');

/***/ },

/***/ "13d97237b26f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Пустое состояние","runtime":{"error-text":"Попробуйте ещё раз","error-title":"Не удалось загрузить","no-access-text":"Обратитесь к администратору","no-access-title":"Нет доступа","no-data-text":"Они появятся здесь, когда их добавят","no-data-title":"Записей пока нет","nothing-found-text":"Попробуйте изменить запрос или фильтры","nothing-found-title":"Ничего не найдено","retry":"Повторить"},"events":{"action":{"label":"Выполнить действие пустого состояния"}}}');

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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		const hasSymbol = typeof Symbol === "function";
/******/ 		const webpackQueues = hasSymbol ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		const webpackExports = hasSymbol ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		const webpackError = hasSymbol ? Symbol("webpack error") : "__webpack_error__";
/******/
/******/ 		const resolveQueue = (queue) => {
/******/ 			if(queue?.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		const wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					const queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					const obj = {};
/******/
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			const ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			let queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			const depQueues = new Set();
/******/ 			const exports = module.exports;
/******/ 			let currentDeps;
/******/ 			let outerResolve;
/******/ 			let reject;
/******/ 			const promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			const handle = (deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				let fn;
/******/ 				const getResult = () => (currentDeps.map((d) => {
/******/
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				const promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					const fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}
/******/ 			const done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 			body(handle, done);
/******/ 			queue?.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/
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
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	let __webpack_exports__ = __webpack_require__("d29271955a22");
/******/
/******/ })()
;