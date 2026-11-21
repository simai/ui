/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "9b3fc4e2e858"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d86e4db30b71");
/* harmony import */ var _js_items__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4af731b7c247");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("fce42b338f4d");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("6c14d599ff24");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("64757399a9d0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _js_items__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _js_items__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);






 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-steps from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8, §11): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json (a product adds
// another language through SF.language.register("sf-steps", code, words)), and
// the old event name sf-step-change is a dated alias of sf-steps-change.
//
// What it is (owner decision C101, 2026-11-12): where a person is in an
// ordered process of their own -- how many steps are behind and how many are
// ahead. A job the server runs is sf-progress-run; tasks done in any order are
// a task list, not steps. Passive by default: an ordered list, the current
// item aria-current=step, a state word in each item. navigation="visited" or
// "free" makes the steps a person may go to buttons, as in sf-wizard.

const StepsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__
});

class SfSteps extends StepsElement {
  // The manifest's settings, and what the steps read more closely: items from
  // the attribute's own forms or the property, the words from the language
  // files while the attribute is empty.
  static get props() {
    return { ...super.props,
      size: {
        default: '1'
      },
      items: {
        default: [],

        parser(value, fallback, element) {
          if (value !== undefined && value !== null) return (0,_js_items__WEBPACK_IMPORTED_MODULE_3__.parseItems)(value);
          return (0,_js_items__WEBPACK_IMPORTED_MODULE_3__.parseItems)(element?.__sfManifestData?.items ?? []);
        }

      },
      current: {
        type: Number,
        default: 0
      },
      marker: {
        default: 'number'
      },
      layout: {
        default: 'auto'
      },
      navigation: {
        default: ''
      },
      errorStep: {
        default: ''
      },
      separatorIcon: {
        default: ''
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      completedLabel: {
        default: ''
      },
      currentLabel: {
        default: ''
      },
      aheadLabel: {
        default: ''
      },
      errorLabel: {
        default: ''
      },
      skippedLabel: {
        default: ''
      },
      runningLabel: {
        default: ''
      },
      countLabel: {
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this.addEventListener('click', this.handleRootClick);
  }

  get size() {
    return this.getAttribute('size') === '1/2' ? '1/2' : '1';
  }

  get marker() {
    const value = this.getAttribute('marker');
    return _js_items__WEBPACK_IMPORTED_MODULE_3__.MARKERS.includes(value) ? value : 'number';
  }

  set marker(value) {
    this.setAttribute('marker', String(value));
  }

  get layout() {
    const value = this.getAttribute('layout');
    return _js_items__WEBPACK_IMPORTED_MODULE_3__.LAYOUTS.includes(value) ? value : 'auto';
  }

  set layout(value) {
    this.setAttribute('layout', String(value));
  }

  get navigation() {
    const value = this.getAttribute('navigation');
    return _js_items__WEBPACK_IMPORTED_MODULE_3__.NAVIGATION.includes(value) ? value : '';
  }

  set navigation(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('navigation');else this.setAttribute('navigation', String(value));
  }

  get items() {
    return this.getProp('items');
  } // A list setting is a property (§4): the list given here wins until the
  // attribute is written again.


  set items(value) {
    if (!this.__sfManifestData) this.__sfManifestData = {};
    this.__sfManifestData.items = value;
    if (this.hasAttribute('items')) this.removeAttribute('items');else this.requestComponentUpdate('items');
  } // current runs from 0 to the number of steps: equal to it, every step is
  // behind (all done, C101 ST-4).


  get current() {
    const count = this.items.length;
    return Math.min(Math.max(this.getNumberAttr('current', 0), 0), count);
  }

  set current(value) {
    this.setAttribute('current', String((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(value, 0)));
  }

  get done() {
    const count = this.items.length;
    return count > 0 && this.current >= count;
  } // The old way to mark one step failed (1.3 and before): an item's own
  // state error is today's.


  get errorStep() {
    const value = this.getAttribute('error-step');

    if (value === null || value === '') {
      return null;
    }

    const parsed = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(value, -1);
    if (parsed < 0) return null;
    (0,_js_items__WEBPACK_IMPORTED_MODULE_3__.noteOld)('attribute', 'error-step', 'error-step', 'items[i].state = "error"');
    return parsed;
  }

  get separatorIcon() {
    return this.getAttribute('separator-icon') || '';
  }

  get computedItems() {
    return (0,_js_items__WEBPACK_IMPORTED_MODULE_3__.resolveStates)(this.items, this.current, this.errorStep).map(item => ({ ...item,
      reachable: (0,_js_items__WEBPACK_IMPORTED_MODULE_3__.reachable)(item, this.navigation)
    }));
  }

  word(key, attribute) {
    return this.getAttribute(attribute) || this.sfWord(key);
  }

  get stateWords() {
    return {
      done: this.word('completed-label', 'completed-label'),
      current: this.word('current-label', 'current-label'),
      ahead: this.word('ahead-label', 'ahead-label'),
      error: this.word('error-label', 'error-label'),
      skipped: this.word('skipped-label', 'skipped-label'),
      running: this.word('running-label', 'running-label')
    };
  } // The layout drawn: an explicit one, or for auto what the list's own width
  // allows (checkFit, after each drawing): under 20rem the count line, under
  // 30rem a column, above that a row while it fits, else a column.


  get drawnLayout() {
    if (this.layout !== 'auto') return this.layout;
    return this._fit || 'row';
  }

  templateContext() {
    const props = this.getPropsContext();
    const items = this.computedItems;
    const count = items.length;
    const at = count ? Math.min(this.current, count - 1) : 0;
    const done = this.done;

    if (this.hasAttribute('separator-icon')) {
      (0,_js_items__WEBPACK_IMPORTED_MODULE_3__.noteOld)('attribute', 'separator-icon', 'separator-icon', null);
    }

    return this.createTemplateContext({ ...props,
      size: this.size,
      marker: this.marker,
      layout: this.layout,
      drawn: this.drawnLayout,
      navigation: this.navigation,
      ariaLabel: this.getAttribute('aria-label') || this.sfWord('aria-label'),
      words: this.stateWords,
      component: this,
      rootClass: this.getRootClass(),
      items,
      count,
      done,
      position: count ? {
        label: items[at]?.label ?? '',
        state: items[at]?.state ?? '',
        text: this.getAttribute('count-label') ? this.getAttribute('count-label').replace('{n}', String(at + 1)).replace('{count}', String(count)) : this.sfWord('count-label', {
          vars: {
            n: at + 1,
            count
          }
        }),
        value: done ? 100 : Math.round((at + 1) / count * 100)
      } : null
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderStepsTemplate)(this.templateContext());
  }

  get state() {
    return {
      size: this.size,
      current: this.current,
      marker: this.marker,
      layout: this.layout,
      navigation: this.navigation,
      ariaLabel: this.getAttribute('aria-label') || this.sfWord('aria-label'),
      completedLabel: this.word('completed-label', 'completed-label'),
      currentLabel: this.word('current-label', 'current-label'),
      aheadLabel: this.word('ahead-label', 'ahead-label'),
      errorLabel: this.word('error-label', 'error-label'),
      skippedLabel: this.word('skipped-label', 'skipped-label'),
      runningLabel: this.word('running-label', 'running-label'),
      items: this.items,
      rootClass: this.getRootClass()
    };
  } // Writes each key as its attribute; a list (items) is written as JSON, the
  // one list format (C101).


  setState(nextState = {}) {
    Object.entries(nextState || {}).forEach(([key, value]) => {
      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toAttributeName)(key);

      if (!attr) {
        return;
      }

      if (value === false || value === null || value === undefined || value === '') {
        this.removeAttribute(attr);
        return;
      }

      if (Array.isArray(value)) {
        this.setAttribute(attr, JSON.stringify(value.map(item => typeof item === 'string' ? {
          label: item
        } : item)));
        return;
      }

      if (value === true) {
        this.setAttribute(attr, '');
        return;
      }

      this.setAttribute(attr, String(value));
    });
    return this;
  } // The action go-to-step (§4.4): moves current and answers an outcome. It
  // reports nothing: `change` is what a person did (§8), which is the press
  // below. It moves whatever navigation says: navigation is what a person
  // may press, the host moves the steps itself.


  goToStep(index) {
    return this.moveToStep(index, {
      person: false
    });
  }

  moveToStep(index, {
    person = false
  } = {}) {
    const requested = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(index?.index ?? index, Number.NaN);
    if (!Number.isFinite(requested)) return {
      outcome: 'refused',
      reason: 'out-of-range'
    };
    const nextIndex = Math.min(Math.max(requested, 0), this.items.length - 1);
    const item = this.items[nextIndex];
    if (!item) return {
      outcome: 'refused',
      reason: 'out-of-range'
    };
    if (item.disabled) return {
      outcome: 'refused',
      reason: 'disabled'
    };
    if (nextIndex === this.current) return {
      outcome: 'refused',
      reason: 'current'
    };
    const previous = this.current;
    this.setAttribute('current', String(nextIndex));

    if (person) {
      this.sfEmit('change', {
        previous,
        current: nextIndex,
        item,
        items: this.items
      });
    }

    return {
      outcome: 'applied'
    };
  } // The old name keeps its old detail (§16.20 split row): the element and its
  // template were in it.


  sfAliasAdapters() {
    return {
      'sf-step-change': detail => ({
        component: this,
        tagName: this.componentTagName,
        template: this.componentTemplateName,
        ...detail
      })
    };
  }

  onStepChange(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener(this.sfEventName('change'), event => {
        handler(event.detail?.current, event.detail, event);
      }, options);
    }

    return this;
  } // Only a step drawn as a button is pressed (navigation): a passive list has
  // none.


  handleRootClick = event => {
    const control = event.target?.closest?.('.sf-step-control');

    if (!(control instanceof HTMLElement) || !this.contains(control) || control.disabled) {
      return;
    }

    const step = control.closest('[data-step-index]');
    const nextIndex = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(step?.dataset.stepIndex, this.current);
    const item = this.computedItems[nextIndex];
    if (!item || !item.reachable) return;
    this.moveToStep(nextIndex, {
      person: true
    });
  }; // ---------------------------------------------------------------- layout

  afterRender() {
    this.observeFit();
    this.checkFit();
  }

  onDisconnected() {
    this._fitObserver?.disconnect();
    super.onDisconnected();
  }

  observeFit() {
    if (typeof ResizeObserver === 'undefined') return;

    if (!this._fitObserver) {
      this._fitObserver = new ResizeObserver(() => this.checkFit());
      globalThis.document?.fonts?.ready?.then?.(() => this.checkFit());
    }

    this._fitObserver.disconnect();

    const root = this.querySelector(':scope > .sf-steps');
    if (root) this._fitObserver.observe(root);
  } // What the steps need on one row and what the list is given: the row is
  // laid out at its one-line width for a moment (data-sf-measure, in the same
  // task, never painted), whatever the list draws now.


  measureFit() {
    const root = this.querySelector(':scope > .sf-steps');
    const list = root?.querySelector(':scope > .sf-steps-container');
    if (!root || !list) return null;
    const room = root.getBoundingClientRect().width;
    root.setAttribute('data-sf-measure', '');
    const need = list.getBoundingClientRect().width;
    root.removeAttribute('data-sf-measure');
    const rem = parseFloat(globalThis.getComputedStyle?.(globalThis.document.documentElement).fontSize) || 16;
    return {
      need,
      room,
      rem
    };
  }

  checkFit() {
    if (!this.isConnected || this.layout !== 'auto') return;
    const fit = this.measureFit(); // Not laid out (a closed panel, display none): nothing to decide.

    if (!fit || !fit.room) return;
    let next = 'row';
    if (fit.room < _js_items__WEBPACK_IMPORTED_MODULE_3__.COUNT_BELOW_REM * fit.rem) next = 'count'; // Under 30rem a column, as the sheet draws it before this measure.
    else if (fit.room < _js_items__WEBPACK_IMPORTED_MODULE_3__.COLUMN_BELOW_REM * fit.rem) next = 'column'; // A pixel of slack: a row that fits exactly is a row.
    else if (fit.need > fit.room + 1) next = 'column';
    if (next === (this._fit || 'row')) return;
    this._fit = next;
    this.requestComponentUpdate?.('fit');
  }

}

SfSteps.define('sf-steps');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4af731b7c247"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLUMN_BELOW_REM: () => (/* binding */ COLUMN_BELOW_REM),
/* harmony export */   COUNT_BELOW_REM: () => (/* binding */ COUNT_BELOW_REM),
/* harmony export */   LAYOUTS: () => (/* binding */ LAYOUTS),
/* harmony export */   MARKERS: () => (/* binding */ MARKERS),
/* harmony export */   NAVIGATION: () => (/* binding */ NAVIGATION),
/* harmony export */   STATES: () => (/* binding */ STATES),
/* harmony export */   noteOld: () => (/* binding */ noteOld),
/* harmony export */   ownState: () => (/* binding */ ownState),
/* harmony export */   parseItems: () => (/* binding */ parseItems),
/* harmony export */   reachable: () => (/* binding */ reachable),
/* harmony export */   resolveStates: () => (/* binding */ resolveStates)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
// sf-steps' list and states (owner decision C101, 2026-11-12), apart from the
// element so that they can be tested without a page: the item state words,
// the one list format and the old forms it still reads, each step's drawn
// state and whether a person may go to it.
 // The state words of an item (C101). done, skipped, running and error are an
// item's own; current and ahead come from its place (an item may also say
// ahead itself: a step before current that was never done).

const STATES = ['done', 'current', 'ahead', 'error', 'skipped', 'running'];
const OWN = ['done', 'ahead', 'skipped', 'running', 'error'];
const MARKERS = ['number', 'dot'];
const LAYOUTS = ['auto', 'row', 'column', 'count'];
const NAVIGATION = ['', 'visited', 'free']; // Under this many rem of its own width an automatic list is the count line.

const COUNT_BELOW_REM = 20; // Under this many rem of its own width an automatic list is a column (DEV look
// answer 2026-11-20): the sheet draws it so before the code measures (a container
// query of _css__steps.scss), and the code agrees; above it a row while it fits.

const COLUMN_BELOW_REM = 30; // The old forms (sf-steps 1.3 and before) are read until 2027-01-01 and each
// use is noted in SF.deprecations with its dates: the item state words
// completed and default, the string form label::flag|label, error-step and
// separator-icon.

const SINCE = '2026-11-12';
const REMOVE_AFTER = '2027-01-01';
const FORMER_STATES = {
  completed: 'done',
  default: 'ahead'
};
function noteOld(kind, attribute, from, to) {
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: 'sf-steps',
    tag: 'sf-steps',
    kind,
    attribute,
    from,
    to,
    since: SINCE,
    remove_after: REMOVE_AFTER
  });
}
/** An item's own state in today's words; the former completed and default are read (noted once). */

function ownState(value) {
  const word = typeof value === 'string' ? value.trim().toLowerCase() : '';

  if (Object.hasOwn(FORMER_STATES, word)) {
    noteOld('value', 'items.state', word, FORMER_STATES[word]);
    return FORMER_STATES[word];
  }

  return OWN.includes(word) ? word : '';
}

const text = value => value === undefined || value === null ? '' : String(value).trim();

function normalizeItem(item) {
  if (typeof item === 'string') return {
    label: item.trim()
  };
  if (!item || typeof item !== 'object') return null;
  const label = text(item.label);
  const note = text(item.text);
  const state = ownState(item.state);
  return {
    label,
    ...(note ? {
      text: note
    } : {}),
    ...(item.disabled === true ? {
      disabled: true
    } : {}),
    ...(state ? {
      state
    } : {})
  };
}

function parseItems(items = '') {
  // The list as JSON in the attribute reads like the property.
  if (typeof items === 'string' && items.trim().startsWith('[')) {
    try {
      return parseItems(JSON.parse(items));
    } catch {// Not JSON: the old "label::flag|label" form below.
    }
  }

  if (Array.isArray(items)) {
    return items.map(normalizeItem).filter(Boolean);
  }

  const source = String(items || '').trim();
  if (!source) return []; // The old string form: "label::disabled,completed|label".

  noteOld('attribute', 'items', 'label::flag|label', 'items as JSON [{label, state}]');
  return source.split('|').map(item => item.trim()).filter(Boolean).map(entry => {
    const [labelPart, flagsPart = ''] = entry.split('::');
    const flags = flagsPart.split(',').map(flag => flag.trim().toLowerCase()).filter(Boolean);
    const word = flags.find(flag => OWN.includes(flag) || Object.hasOwn(FORMER_STATES, flag));
    const state = word ? ownState(word) : '';
    return {
      label: labelPart.trim(),
      ...(flags.includes('disabled') ? {
        disabled: true
      } : {}),
      ...(state ? {
        state
      } : {})
    };
  });
}
/**
 * Each item's drawn state from its own state, its place against current and
 * the old error-step. running and error win over the place (C73: a real
 * status is stronger); the step at current is current; before it a step is
 * done unless it says skipped or ahead; after it a step is ahead unless it says
 * done or skipped. current equal to the number of steps is «all done»: no
 * step is current.
 */

function resolveStates(items, current, errorStep = null) {
  return items.map((item, index) => {
    const own = item.state || '';
    let state;
    if (own === 'running' || own === 'error') state = own;else if (errorStep === index) state = 'error';else if (index === current) state = 'current';else if (own) state = own;else state = index < current ? 'done' : 'ahead';
    return { ...item,
      index,
      state,
      passed: index < current,
      current: index === current
    };
  });
}
/** Whether a person may go to this step: navigation visited (a step behind, or one done, skipped or failed) or free (any). */

function reachable(item, navigation) {
  if (item.disabled || item.current) return false;
  if (navigation === 'free') return true;
  if (navigation === 'visited') return item.passed || ['done', 'skipped', 'error'].includes(item.state);
  return false;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d86e4db30b71"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderStepsTemplate: () => (/* binding */ renderStepsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-steps' markup (component/step draws it; owner decision C101).
//
//   .sf-steps                     the root: size, marker, layout drawn
//     ol.sf-steps-container       the ordered list, named by aria-label
//       li.sf-step                one step: its state, data-step-index,
//                                 aria-current=step on the current one; the
//                                 line to the next step is the item's own
//         .sf-step-body           a span, or a button when a person may go
//                                 there (navigation, class sf-step-control)
//           .sf-step-marker       the number, a check, «!», a dot or the
//                                 Framework spinner -- the rung's text line
//           .sf-step-content      the label (.sf-step-container), the
//                                 second line in a column (.sf-step-text)
//                                 and the state word for a screen reader
//     .sf-steps-count             the count layout: «Шаг N из M · label» over
//                                 sf-progress-bar 1/3, as sf-wizard's compact
//                                 head

function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // A marker's glyph: done is a check, error an exclamation; the number of the
// step otherwise.


const MARK_ICONS = {
  done: 'check',
  error: 'priority_high'
};

function renderMarker(item, context) {
  if (item.state === 'running') {
    // The Framework spinner at the marker's own size (the spinner's ladder is
    // the text line of each rung), centred, with no ring of its own.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-step-marker" aria-hidden="true"><sf-spinner size=${context.size} ?infinite=${true} label=""></sf-spinner></span>`;
  }

  if (context.marker === 'dot') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-step-marker" aria-hidden="true"></span>`;
  }

  const icon = MARK_ICONS[item.state];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-step-marker" aria-hidden="true">${icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon">${icon}</i>` : String(item.index + 1)}</span>`;
}

function renderStep(item, context) {
  const classes = joinClasses('sf-step', `sf-step--size-${context.size}`, `sf-step--state-${item.state}`, item.passed ? 'sf-step--passed' : '', item.disabled ? 'sf-step--disabled' : '');
  const word = context.words[item.state] || '';
  const body = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderMarker(item, context)}<span class="sf-step-content"><span class="sf-step-container">${item.label}</span>${item.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-step-text">${item.text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${word ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only">, ${word}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li
    class=${classes}
    data-step-index=${String(item.index)}
    aria-current=${item.current ? 'step' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  >${item.reachable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-step-body sf-step-control">${body}</button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-step-body">${body}</span>`}</li>`;
}

function renderCount(context) {
  const {
    position,
    ariaLabel
  } = context;
  if (!position) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-steps-count">
    <p class="sf-steps-count-line"><span class="sf-steps-count-position">${position.text} ·</span> <span class=${joinClasses('sf-steps-count-label', `sf-step--state-${position.state}`)}>${position.label}</span></p>
    <sf-progress-bar size="1/3" value=${String(position.value)} label=${ariaLabel} value-text=${position.text}></sf-progress-bar>
  </div>`;
}

function renderStepsTemplate(context) {
  const rootClasses = joinClasses('sf-steps', `sf-steps--size-${context.size}`, `sf-steps--marker-${context.marker}`, `sf-steps--layout-${context.drawn}`, context.layout === 'auto' ? 'sf-steps--auto' : '', context.done ? 'sf-steps--done' : '', context.rootClass); // The steps are an ordered list (R185 ST-13): a screen reader says how many
  // there are and which one is current. role="list" is written out because a
  // list without its markers loses the role in WebKit. In the count layout the
  // list stays in the markup, out of view, so an automatic list can measure
  // whether a row fits again.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <ol
        class="sf-steps-container"
        role="list"
        aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      >${context.items.map(item => renderStep(item, context))}</ol>
      ${context.drawn === 'count' ? renderCount(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

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

/***/ "64757399a9d0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("892d49d25ed0");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "6c14d599ff24"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-steps for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-steps","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-step-change","to":"sf-steps-change","kind":"event","component":"sf-steps","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, §16 item 6","note":"the old detail adds component, tagName and template, which §8 takes out of the new one: the element\'s detail adapter makes it"}]}');

/***/ },

/***/ "fce42b338f4d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.steps","tag":"sf-steps","version":"1.5.1","kind":"leaf","settings":{"size":{"type":"enum","values":["1","1/2"],"default":"1"},"items":{"type":"list","default":[],"of":{"label":"string","text":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"state":{"type":"enum","values":["done","ahead","skipped","running","error","completed","default"],"optional":true}}},"marker":{"type":"enum","values":["number","dot"],"default":"number"},"layout":{"type":"enum","values":["auto","row","column","count"],"default":"auto"},"navigation":{"type":"enum","values":["","visited","free"],"default":""},"error-step":{"type":"number","integer":true,"min":0,"nullable":true,"default":null},"separator-icon":{"type":"icon","default":""},"completed-label":{"type":"string","default-from":"runtime.completed-label"},"current-label":{"type":"string","default-from":"runtime.current-label"},"ahead-label":{"type":"string","default-from":"runtime.ahead-label"},"error-label":{"type":"string","default-from":"runtime.error-label"},"skipped-label":{"type":"string","default-from":"runtime.skipped-label"},"running-label":{"type":"string","default-from":"runtime.running-label"},"count-label":{"type":"string","default-from":"runtime.count-label"}},"values":{"current":{"type":"number","integer":true,"min":0,"default":0}},"events":{"change":{"x-native":false,"carries":{"previous":"number","current":"number","item":"object","items":"list"}}},"actions":{"go-to-step":{"with":{"index":"number"}}},"css-variables":{"--sf-steps-gap":{"type":"length","state":"default"},"--sf-steps-separator-color":{"type":"color","state":"default"},"--sf-steps-step-color":{"type":"color","state":"default"},"--sf-steps-step-border-color":{"type":"color","state":"default"},"--sf-steps-step-radius":{"type":"length","state":"default"},"--sf-steps-current-border-color":{"type":"color","state":"current"},"--sf-steps-completed-icon-color":{"type":"color","state":"completed"}}}');

/***/ },

/***/ "892d49d25ed0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Steps","runtime":{"aria-label":"Steps","completed-label":"Completed","current-label":"Current","ahead-label":"Upcoming","error-label":"Error","skipped-label":"Skipped","running-label":"In progress","count-label":"Step {n} of {count}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("9b3fc4e2e858");
/******/
/******/ })()
;