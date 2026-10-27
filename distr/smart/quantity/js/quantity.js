/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e138a730fd7c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFieldContract: () => (/* binding */ createFieldContract),
/* harmony export */   syncFieldContract: () => (/* binding */ syncFieldContract)
/* harmony export */ });
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("695f21e50358");
 // A field's ids come from its instance's role path (standard 1.3.8 §7.1.1;
// simai/ui-source#41), never from a counter: core/js/instance-path.js.

const fieldIdentities = new WeakMap();

function nextIdentity(owner, prefix) {
  if (owner && fieldIdentities.has(owner)) return fieldIdentities.get(owner);
  const base = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.instancePath)(owner, {
    kind: prefix
  }));
  const identity = {
    base,
    controlId: `${base}--control`,
    messageId: `${base}--message`
  }; // An instance not yet in the page has no place in it: its path is settled
  // when it is, so it is not kept before.

  if (owner && (typeof owner === 'object' || typeof owner === 'function') && (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner)) {
    fieldIdentities.set(owner, identity);
  }

  return identity;
}

function mergeIdRefs(existing, additions) {
  return [...new Set([...String(existing || '').split(/\s+/).filter(Boolean), ...additions.filter(Boolean)])].join(' ');
}

function createFieldContract(owner, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  hint = '',
  errorMessage = ''
} = {}) {
  const identity = nextIdentity(owner, prefix);
  const normalizedInvalid = Boolean(invalid);
  const message = normalizedInvalid && errorMessage ? errorMessage : hint;
  return { ...identity,
    required: Boolean(required),
    invalid: normalizedInvalid,
    message,
    describedBy: message ? identity.messageId : '',
    errorMessageId: normalizedInvalid && errorMessage ? identity.messageId : ''
  };
}
function syncFieldContract(root, control, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  messageNode = null,
  labelNode = null,
  errorMessage = ''
} = {}) {
  if (!root || !control) return null;
  const hint = messageNode?.textContent?.trim() || '';
  const contract = createFieldContract(root, {
    prefix,
    required,
    invalid,
    hint,
    errorMessage
  });
  if (!control.id) control.id = contract.controlId;

  if (root.tagName === 'LABEL' && !root.hasAttribute('for')) {
    root.setAttribute('for', control.id);
  } // Name the field by its visible label, not every hint or adjacent button.
  // Author-provided accessible names remain authoritative.


  if (labelNode?.textContent?.trim() && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
    if (!labelNode.id) labelNode.id = `${control.id}-label`;
    control.setAttribute('aria-labelledby', labelNode.id);
  }

  control.required = contract.required;
  root.classList.toggle('error', contract.invalid);
  control.classList.toggle('error', contract.invalid);
  if (contract.invalid) control.setAttribute('aria-invalid', 'true');else control.removeAttribute('aria-invalid');

  if (messageNode) {
    if (!messageNode.id) messageNode.id = contract.messageId;
    control.setAttribute('aria-describedby', mergeIdRefs(control.getAttribute('aria-describedby'), [messageNode.id]));
  }

  if (contract.errorMessageId && messageNode) {
    control.setAttribute('aria-errormessage', messageNode.id);
  } else {
    control.removeAttribute('aria-errormessage');
  }

  return contract;
}

/***/ },

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.

const FIELD_SIZES = Object.freeze(['1/2', '1', '2']);
const RETIRED_FIELD_SIZES = Object.freeze({
  '1/3': '1/2',
  '3': '2'
});
const warned = new Set(); // A control placed inside something with the whole scale (a list item, say)
// takes the nearest form size, quietly: the list is not wrong to be 1/3.

function nearestFieldSize(value) {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;
  return Object.hasOwn(RETIRED_FIELD_SIZES, size) ? RETIRED_FIELD_SIZES[size] : '1';
}
function fieldSize(value, component = 'field', fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;

  if (Object.hasOwn(RETIRED_FIELD_SIZES, size)) {
    const kept = RETIRED_FIELD_SIZES[size];
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      kind: 'value',
      attribute: 'size',
      from: size,
      to: kept
    });
    const key = `${component}:${size}`;

    if (!warned.has(key) && typeof console !== 'undefined') {
      warned.add(key);
      console.warn(`[SIMAI Framework] ${component}: size ${size} is retired for form fields; rendering size ${kept}.`);
    }

    return kept;
  }

  return fallback;
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
}

/***/ },

/***/ "67eed2647f47"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindFormReset: () => (/* binding */ bindFormReset)
/* harmony export */ });
// Reset fires before the browser restores default values. Synchronize afterwards
// without synthesizing input/change events or retaining detached controls.
const subscriptions = new WeakMap();
const listeningDocuments = new WeakSet();
function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;

  if (!listeningDocuments.has(doc)) {
    doc.addEventListener('reset', event => {
      const form = event.target;
      if (form?.tagName !== 'FORM') return;
      const controls = Array.from(form.elements);
      setTimeout(() => {
        if (event.defaultPrevented) return;

        for (const control of controls) {
          if (!control.isConnected || control.form !== form) continue;

          for (const callback of subscriptions.get(control) || []) callback();
        }
      }, 0);
    }, true);
    listeningDocuments.add(doc);
  }

  let callbacks = subscriptions.get(input);
  if (!callbacks) subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  return () => callbacks.delete(synchronize);
}

/***/ },

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable)
/* harmony export */ });
// The dated alias table of one component (standard simai.smart-component
// 1.3.8 §16.20, vocabulary 1.1.5 §9): what the migration converter writes as
// <component>/aliases.json, read and checked here before core/js/aliases.js
// installs it on an element. Pure data, no DOM, so a build, a lint and the
// runtime share one reading of it.
//
// A table is a list of rows, or {tag, aliases: [rows]}. A row:
//
//   {from, to, kind, since, remove_after, mode?, when?, setting?, tag?}
//
//   kind      event | setting | attribute | action | value
//   since     the first day the new name exists, YYYY-MM-DD
//   remove_after
//             the last day the old name is promised, YYYY-MM-DD
//   mode      events only: same-detail (default) | detail-adds | split
//   when      events only, optional: {<detail field>: <value>}; the old name
//             is sent only for a new event whose detail matches (two old
//             names folded into one new name, as modal:after-hide and
//             modal:after-show into change)
//   setting   values only: the attribute the value belongs to
//
// A row that does not hold is refused with a reason, never thrown: the rest of
// the table still installs, and the refusals are reported.
const ALIAS_KINDS = Object.freeze(['event', 'setting', 'attribute', 'action', 'value']);
const ALIAS_MODES = Object.freeze(['same-detail', 'detail-adds', 'split']);
const DAY = 86400000;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const ATTRIBUTE = /^[a-z][a-z0-9-]*$/u;
const MEMBER = /^[A-Za-z_$][\w$]*$/u;

function dateOf(text) {
  if (typeof text !== 'string' || !DATE.test(text)) return NaN;
  const time = Date.parse(`${text}T00:00:00Z`); // 2026-02-30 parses in some engines; it must print back as itself.

  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== text ? NaN : time;
} // `remove_after` is the last promised day, whole, in UTC: the old name is
// open until the end of it and expired from the next midnight.


function aliasExpired(row, now = Date.now()) {
  const last = dateOf(row?.remove_after);
  return Number.isFinite(last) && now >= last + DAY;
} // kebab-case attribute -> camelCase property: backdrop-blur -> backdropBlur.

function propertyOf(attribute) {
  return String(attribute).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
}

function primitive(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function checkRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return 'not-an-object';
  const {
    from,
    to,
    kind,
    since,
    mode = 'same-detail',
    when,
    setting
  } = row;
  if (!ALIAS_KINDS.includes(kind)) return 'unknown-kind';
  if (typeof from !== 'string' || !from) return 'no-from';
  if (to === null || to === undefined || to === '') return 'no-new-name';
  if (typeof to !== 'string') return 'no-to';
  if (from === to) return 'same-name';
  const start = dateOf(since);
  const end = dateOf(row.remove_after);
  if (Number.isNaN(start)) return 'bad-since';
  if (Number.isNaN(end)) return 'bad-remove-after';
  if (end < start) return 'remove-after-before-since';
  if (!ALIAS_MODES.includes(mode)) return 'unknown-mode';
  if (kind !== 'event' && mode !== 'same-detail') return 'mode-on-non-event';

  if (when !== undefined) {
    if (kind !== 'event') return 'when-on-non-event';
    if (!when || typeof when !== 'object' || Array.isArray(when) || !Object.values(when).every(primitive)) return 'bad-when';
  }

  if (kind === 'setting' || kind === 'attribute') {
    if (!ATTRIBUTE.test(from) || !ATTRIBUTE.test(to)) return 'bad-attribute-name';
  }

  if (kind === 'action' && (!MEMBER.test(from) || !MEMBER.test(to))) return 'bad-member-name';

  if (kind === 'value') {
    if (typeof setting !== 'string' || !ATTRIBUTE.test(setting)) return 'value-needs-setting';
  } else if (setting !== undefined) {
    return 'setting-on-non-value';
  }

  return null;
}

function normal(row, tag) {
  const out = {
    kind: row.kind,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    tag: typeof row.tag === 'string' && row.tag ? row.tag : tag
  };

  if (row.kind === 'event') {
    out.mode = row.mode || 'same-detail';
    if (row.when) out.when = { ...row.when
    };
  }

  if (row.kind === 'value') out.setting = row.setting;
  return Object.freeze(out);
} // -> {tag, rows: [frozen rows], refused: [{index, from, to, kind, reason}]}


function readAliasTable(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];

  if (!Array.isArray(list)) {
    refused.push({
      index: -1,
      from: null,
      to: null,
      kind: null,
      reason: 'not-a-table'
    });
    return {
      tag: owner,
      rows,
      refused
    };
  }

  const refuse = (index, row, reason) => refused.push({
    index,
    from: row?.from ?? null,
    to: row?.to ?? null,
    kind: row?.kind ?? null,
    reason
  });

  const seen = new Map();
  list.forEach((row, index) => {
    const reason = checkRow(row);
    if (reason) return refuse(index, row, reason);
    const one = normal(row, owner); // An attribute, a property or a method has one new name; an event's old
    // name may be sent beside several new ones (split, folded names).

    const identity = one.kind === 'event' ? `event|${one.from}|${one.to}|${JSON.stringify(one.when ?? null)}` : one.kind === 'value' ? `value|${one.setting}|${one.from}` : `${one.kind === 'action' ? 'action' : 'name'}|${one.from}`;
    const before = seen.get(identity);
    if (before) return refuse(index, row, before.to === one.to ? 'duplicate' : 'conflict');
    seen.set(identity, one);
    rows.push({
      index,
      row: one
    });
  }); // Two old names folded into one new name by their detail: without `when`
  // each would be sent on every new event, the wrong one among them.

  const folded = new Map();

  for (const entry of rows) {
    const {
      row
    } = entry;
    if (row.kind !== 'event' || row.mode === 'same-detail' || row.when) continue;
    folded.set(row.to, [...(folded.get(row.to) ?? []), entry]);
  }

  const ambiguous = new Set();

  for (const group of folded.values()) if (group.length > 1) for (const entry of group) ambiguous.add(entry);

  const kept = [];

  for (const entry of rows) {
    if (ambiguous.has(entry)) refuse(entry.index, entry.row, 'needs-when');else kept.push(entry.row);
  }

  refused.sort((a, b) => a.index - b.index);
  return {
    tag: owner,
    rows: kept,
    refused
  };
}

/***/ },

/***/ "28b603686dcc"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aliasExpired: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired),
/* harmony export */   aliasesOf: () => (/* binding */ aliasesOf),
/* harmony export */   aliasesStrict: () => (/* binding */ aliasesStrict),
/* harmony export */   dispatchAliased: () => (/* binding */ dispatchAliased),
/* harmony export */   installAliases: () => (/* binding */ installAliases),
/* harmony export */   readAliasTable: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable),
/* harmony export */   setAliasClock: () => (/* binding */ setAliasClock),
/* harmony export */   uninstallAliases: () => (/* binding */ uninstallAliases)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
// Dated aliases on an element (standard simai.smart-component 1.3.8 §16.20,
// §8, §16 items 6, 7, 13, 26, 32, 41; vocabulary 1.1.5 §9). When a component
// renames an event, a setting, an attribute, an action or a value, the old
// name keeps working until its `remove_after` day, and each use of it is
// noted in SF.deprecations with its dates, so a person, a probe or an AI can
// read off a running page which old names it still leans on.
//
//   const handle = SF.aliases.install(element, table, {signal});
//   SF.aliases.dispatch(element, 'sf-menu-navigate', {detail, cancelable: true});
//   handle.uninstall();   // or abort `signal`
//
// The table is a component's aliases.json (core/js/alias-table.js reads it).
// What an installed element does:
//
// Events.
//   - One dispatch sends the new name first, then each open old name, with
//     the same `detail` object and the same bubbles / composed / cancelable.
//   - Cancel is shared: preventDefault() on any of them cancels all at once,
//     so a listener that runs later on the other name already sees
//     defaultPrevented, and the dispatch answers false.
//   - stopPropagation() is not shared: the names have different listeners.
//   - It works for today's components without a change in them: the element's
//     own dispatchEvent is wrapped, so a component that still sends the old
//     name (sf-accordion:toggle) sends the new one first through the shim, and
//     a component that sends the new name has the old ones follow. The event
//     object the component made is the one dispatched under its name, so a
//     component that reads its own event's defaultPrevented sees the shared
//     cancel.
//   - A use is a listener that touches the old event (its detail, target,
//     currentTarget, composedPath, preventDefault or the stop methods). It is
//     noted once per dispatch, into one record per name. An old event that
//     nobody listens to is not a use, so a page that moved is not reported.
//     No global prototype is patched to learn this.
//   - `detail-adds` sends the new, larger detail to the old name too: the old
//     fields are all there. `when` sends an old name only for a matching
//     detail (two old names folded into one new name). `split` needs an
//     adapter that makes the old detail from the new one; without it the row
//     is refused. A component that sends the old name of a `detail-adds` or
//     `split` row is not promoted: its old detail cannot make the new one.
//
// Settings and attributes. Writing the old attribute writes the new one (the
// component hears the new one); writing the new one updates the old one when
// the page still has it, so getAttribute(old) stays true. Equal values are
// never written again, which is what ends a round. A setting also gets its
// property: the old property reads and writes the new one.
//
// Actions. The old method calls the new one with the same arguments.
//
// Values. An attribute set to an old value is written with the new one.
//
// A name that the browser's own element owns (title, blur, spellcheck,
// remove, …) is not shadowed as a property or a method unless the component
// already overrides it: the attribute alias still works.
//
// Expiry (decision, §16.20 "after that date the old name is expired"). After
// `remove_after` an old name is `expired`: it is still delivered in 1.x, its
// record carries `expired: true` and a console warning is printed once
// whatever the page opted into. A date passing in a running page must not
// break it between two deploys, and dropping a name inside a major is the
// sweep's job: the release that deletes the row is the removal, under the
// change journal. A page or a host that wants to rehearse the sweep sets
// strict mode, <html data-sf-aliases="strict"> or SF.aliases.strict = true:
// an expired old name is then not delivered — its events are not sent, its
// attribute is not mapped, its property reads undefined, its method throws.
//
// Every bundle carries its own copy of this module, so all state lives on the
// shared global (SF.__aliases, not enumerable) and the first copy's API stays
// on SF.aliases; nothing else is added to the page. Per element state is in a
// WeakMap, the wrappers are own properties of the element and leave with
// uninstall(), and the only listener is on the caller's AbortSignal, itself
// removed by an AbortController of the install.



const VERSION = 1;
const WRAPPED = ['dispatchEvent', 'setAttribute', 'removeAttribute', 'toggleAttribute'];
const TOUCH_GETTERS = ['detail', 'target', 'currentTarget', 'srcElement'];
const TOUCH_METHODS = ['composedPath', 'preventDefault', 'stopPropagation', 'stopImmediatePropagation'];

function shared() {
  const SF = globalThis.SF = globalThis.SF || {};

  if (!SF.__aliases || typeof SF.__aliases !== 'object') {
    Object.defineProperty(SF, '__aliases', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: {
        elements: new WeakMap(),
        ours: new WeakSet(),
        now: () => Date.now()
      }
    });
  }

  return SF.__aliases;
} // A test or a sweep rehearsal sets the clock; null puts the real one back.


function setAliasClock(clock) {
  shared().now = typeof clock === 'function' ? clock : () => Date.now();
}
function aliasesStrict() {
  return globalThis.document?.documentElement?.dataset?.sfAliases === 'strict' || globalThis.SF?.aliases?.strict === true;
}

function life(row) {
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, shared().now());
  return {
    expired,
    usable: !expired || !aliasesStrict()
  };
}

function note(row, expired) {
  const attribute = row.kind === 'value' ? row.setting : row.kind === 'setting' || row.kind === 'attribute' ? row.from : '';
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.tag,
    tag: row.tag,
    kind: row.kind,
    attribute,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    ...(expired ? {
      expired: true
    } : {})
  });
} // --- events ---------------------------------------------------------------


const eventGet = name => Object.getOwnPropertyDescriptor(globalThis.Event.prototype, name)?.get;

const nativePrevent = () => globalThis.Event.prototype.preventDefault;

function flagsOf(event) {
  return {
    bubbles: eventGet('bubbles').call(event),
    cancelable: eventGet('cancelable').call(event),
    composed: eventGet('composed').call(event)
  };
}

function detailOf(event) {
  const get = globalThis.CustomEvent && Object.getOwnPropertyDescriptor(globalThis.CustomEvent.prototype, 'detail')?.get;
  return get && event instanceof globalThis.CustomEvent ? get.call(event) : null;
}

function matches(detail, when) {
  if (!when) return true;
  if (!detail || typeof detail !== 'object') return false;
  return Object.entries(when).every(([field, value]) => detail[field] === value);
}

function makeEvent(element, type, detail, flags) {
  const Custom = element.ownerDocument?.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  return new Custom(type, { ...flags,
    detail
  });
} // The first touch of an old event by a listener is a use of the old name.


function instrument(event, row, expired, detail) {
  let used = false;

  const use = () => {
    if (used) return;
    used = true;
    note(row, expired);
  };

  for (const name of TOUCH_GETTERS) {
    const get = name === 'detail' ? () => detail : eventGet(name);
    if (!get) continue;
    Object.defineProperty(event, name, {
      configurable: true,

      get() {
        use();
        return get.call(this);
      }

    });
  }

  for (const name of TOUCH_METHODS) {
    const method = event[name];
    if (typeof method !== 'function') continue;
    Object.defineProperty(event, name, {
      configurable: true,
      writable: true,

      value(...args) {
        use();
        return method.apply(this, args);
      }

    });
  }
}

function shareCancel(events) {
  const cancel = nativePrevent();

  for (const event of events) {
    Object.defineProperty(event, 'preventDefault', {
      configurable: true,
      writable: true,

      value() {
        for (const one of events) cancel.call(one);
      }

    });
  }
} // The old events that go with one new event: open (or expired outside strict)
// rows whose `when` matches, made from the same detail, or from the adapter's
// detail for a split row. `own` is the component's own event when it sent an
// old name: it is reused under that name.


function oldEventsFor(state, element, newType, detail, flags, own) {
  const out = [];
  const names = new Set();

  for (const row of state.byNew.get(newType) ?? []) {
    if (names.has(row.from) || !matches(detail, row.when)) continue;
    const {
      expired,
      usable
    } = life(row);
    if (!usable) continue;
    let oldDetail = detail;

    if (row.mode === 'split') {
      oldDetail = state.adapters[row.from]?.(detail, newType);
      if (oldDetail === undefined) continue;
    }

    names.add(row.from);
    const event = own && own.type === row.from && oldDetail === detail ? own : makeEvent(element, row.from, oldDetail, flags);
    out.push({
      event,
      row,
      expired,
      detail: oldDetail
    });
  }

  return out;
} // Sends the new event, then the old ones, with one cancel. The cancel is
// shared first and the old events instrumented after, so a listener's
// preventDefault() on an old name both cancels all and counts as a use.


function deliver(state, element, first, olds, alsoCancel = []) {
  const ours = shared().ours;
  const events = [first, ...olds.map(one => one.event)];
  const all = [...events, ...alsoCancel.filter(event => !events.includes(event))];
  if (all.some(event => eventGet('cancelable').call(event))) shareCancel(all);

  for (const one of olds) instrument(one.event, one.row, one.expired, one.detail);

  for (const event of events) {
    ours.add(event);
    state.native.dispatchEvent.call(element, event);
  }

  const prevented = eventGet('defaultPrevented');
  return !all.some(event => prevented.call(event));
}

function wrappedDispatch(state, element, event) {
  const native = state.native.dispatchEvent;
  if (!event || shared().ours.has(event)) return native.call(element, event);
  const type = event.type;

  if (state.byNew.has(type)) {
    const detail = detailOf(event);
    return deliver(state, element, event, oldEventsFor(state, element, type, detail, flagsOf(event), null));
  }

  const rows = state.byOld.get(type);
  if (!rows) return native.call(element, event);
  const detail = detailOf(event);
  const flags = flagsOf(event); // An old name with one plain new name is promoted: the new name first.

  const targets = new Set(rows.filter(row => row.mode === 'same-detail' && !row.when).map(row => row.to));

  if (targets.size === 1 && rows.every(row => row.mode === 'same-detail' && !row.when)) {
    const [to] = targets;
    const fresh = makeEvent(element, to, detail, flags);
    const olds = oldEventsFor(state, element, to, detail, flags, event); // A strict page whose old name expired still has the component's own
    // event in the cancel group, though it is not sent.

    return deliver(state, element, fresh, olds, [event]);
  } // Not promotable (detail-adds, split, folded): delivered as it is, a use
  // noted when touched.


  const {
    expired,
    usable
  } = life(rows[0]);
  if (!usable) return true;
  instrument(event, rows[0], expired, detail);
  shared().ours.add(event);
  return native.call(element, event);
} // --- attributes, values -----------------------------------------------------


function mapValue(state, attribute, value, {
  quiet = false
} = {}) {
  const row = state.values.get(attribute)?.get(String(value));
  if (!row) return value;
  const {
    expired,
    usable
  } = life(row);
  if (!quiet) note(row, expired);
  return usable ? row.to : value;
}

function writeIfDifferent(state, element, name, value) {
  const text = String(value);
  if (state.native.getAttribute.call(element, name) !== text) state.native.setAttribute.call(element, name, text);
}

function removeIfPresent(state, element, name) {
  if (state.native.hasAttribute.call(element, name)) state.native.removeAttribute.call(element, name);
}

function wrappedSet(state, element, name, value) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    state.native.setAttribute.call(element, attribute, value);
    if (usable) writeIfDifferent(state, element, row.to, mapValue(state, row.to, value));
    return;
  }

  const mapped = mapValue(state, attribute, value);
  state.native.setAttribute.call(element, attribute, mapped);

  for (const old of state.attrByNew.get(attribute) ?? []) {
    if (state.native.hasAttribute.call(element, old.from)) writeIfDifferent(state, element, old.from, mapped);
  }
}

function wrappedRemove(state, element, name) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);
  state.native.removeAttribute.call(element, attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable) removeIfPresent(state, element, row.to);
    return;
  }

  for (const old of state.attrByNew.get(attribute) ?? []) removeIfPresent(state, element, old.from);
}

function wrappedToggle(state, element, name, force) {
  const attribute = String(name).toLowerCase();
  const has = state.native.hasAttribute.call(element, attribute);
  const want = force === undefined ? !has : Boolean(force);
  if (want && !has) wrappedSet(state, element, attribute, '');
  if (!want && has) wrappedRemove(state, element, attribute);
  return want;
} // Changes that did not come through the element's own methods (the parser,
// an Attr node, a framework that calls the prototype): the later change of
// each name wins, and only differing values are written.


function reconcile(state, element, records) {
  const last = new Map();
  records.forEach((record, order) => last.set(record.attributeName, order));
  const names = [...last.keys()].sort((a, b) => last.get(a) - last.get(b));

  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const name of names) {
    const row = state.attrByOld.get(name);

    if (row) {
      const {
        expired,
        usable
      } = life(row);
      if (!usable) continue;

      if (has(name)) {
        if (get(row.to) !== mapValue(state, row.to, get(name), {
          quiet: true
        })) {
          note(row, expired);
          writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
        }
      } else {
        removeIfPresent(state, element, row.to);
      }

      continue;
    }

    if (state.values.has(name) && has(name)) {
      const mapped = mapValue(state, name, get(name));
      if (mapped !== get(name)) writeIfDifferent(state, element, name, mapped);
    }

    for (const old of state.attrByNew.get(name) ?? []) {
      // The old name changed after this one: its own turn decides.
      if (!has(old.from) || (last.get(old.from) ?? -1) > last.get(name)) continue;
      if (has(name)) writeIfDifferent(state, element, old.from, get(name));else state.native.removeAttribute.call(element, old.from);
    }
  }
} // What the markup already holds: an old attribute is a use and fills the new
// one when that is absent (a new one the page also wrote wins); an old value
// is rewritten.


function adopt(state, element) {
  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const [name, row] of state.attrByOld) {
    if (!has(name)) continue;
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable && !has(row.to)) writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
  }

  for (const name of state.values.keys()) {
    if (has(name)) writeIfDifferent(state, element, name, mapValue(state, name, get(name)));
  }
} // --- members -----------------------------------------------------------------


function nativePrototypes() {
  const protos = new Set([Object.prototype]);

  for (let proto = globalThis.HTMLElement?.prototype; proto; proto = Object.getPrototypeOf(proto)) protos.add(proto);

  if (globalThis.EventTarget) protos.add(globalThis.EventTarget.prototype);
  return protos;
} // May `name` be defined on the element? Not when the browser's element owns
// it and the component does not override it.


function ownableMember(element, name) {
  const natives = nativePrototypes();

  for (let proto = Object.getPrototypeOf(element); proto; proto = Object.getPrototypeOf(proto)) {
    if (Object.prototype.hasOwnProperty.call(proto, name)) return !natives.has(proto);
  }

  return true;
}

function defineOwn(state, element, name, descriptor) {
  const before = Object.getOwnPropertyDescriptor(element, name);
  state.restore.push(() => {
    delete element[name];
    if (before) Object.defineProperty(element, name, before);
  });
  Object.defineProperty(element, name, {
    configurable: true,
    enumerable: false,
    ...descriptor
  });
  return before;
}

function writable(element, name) {
  for (let object = element; object; object = Object.getPrototypeOf(object)) {
    const own = Object.getOwnPropertyDescriptor(object, name);
    if (own) return Boolean(own.set) || own.writable === true;
  }

  return true;
} // Today's Smart base exposes a setting as a read-only property over its
// attribute; such a setting is written through the attribute.


function writeSetting(state, element, row, property, value) {
  if (writable(element, property)) {
    element[property] = value;
  } else if (value === null || value === undefined || value === false) {
    removeIfPresent(state, element, row.to);
  } else {
    writeIfDifferent(state, element, row.to, value === true ? '' : typeof value === 'object' ? JSON.stringify(value) : value);
  }
}

function installProperty(state, element, row, refuse) {
  const from = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.from);
  const to = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.to);
  if (!ownableMember(element, from)) return refuse(row, 'native-member');
  if (!(to in element)) return refuse(row, 'no-new-property');
  const before = defineOwn(state, element, from, {
    get() {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      return usable ? element[to] : undefined;
    },

    set(value) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (usable) writeSetting(state, element, row, to, value);
    }

  }); // A value the page set before the element was installed moves to the new name.

  if (before && 'value' in before && before.value !== undefined) element[from] = before.value;
  return true;
}

function installAction(state, element, row, refuse) {
  if (!ownableMember(element, row.from)) return refuse(row, 'native-member');
  if (typeof element[row.to] !== 'function') return refuse(row, 'no-new-action');
  defineOwn(state, element, row.from, {
    writable: true,

    value(...args) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (!usable) throw new TypeError(`[SIMAI Framework] ${row.tag || element.localName}: ${row.from}() was removed after ${row.remove_after}; call ${row.to}().`);
      return element[row.to](...args);
    }

  });
  return true;
} // --- install ----------------------------------------------------------------


function uninstallAliases(element) {
  const store = shared();
  const state = element && store.elements.get(element);
  if (!state) return false;
  store.elements.delete(element);
  state.observer?.disconnect();
  state.controller.abort();

  for (const restore of state.restore.reverse()) restore();

  return true;
}
function installAliases(element, table, {
  signal,
  adapters = {},
  tag
} = {}) {
  if (!element || typeof element.dispatchEvent !== 'function') throw new TypeError('[SIMAI Framework] SF.aliases.install needs an element');
  uninstallAliases(element);
  const read = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable)(table, {
    tag: tag || element.localName || ''
  });
  const refused = [...read.refused];
  const handle = {
    installed: 0,
    refused,
    uninstall: () => uninstallAliases(element)
  };
  if (signal?.aborted) return handle;
  const state = {
    rows: read.rows,
    adapters,
    byNew: new Map(),
    byOld: new Map(),
    attrByOld: new Map(),
    attrByNew: new Map(),
    values: new Map(),
    restore: [],
    controller: new AbortController(),
    observer: null,
    native: {}
  };

  for (const name of [...WRAPPED, 'getAttribute', 'hasAttribute']) state.native[name] = element[name];

  const refuse = (row, reason) => {
    refused.push({
      index: -1,
      from: row.from,
      to: row.to,
      kind: row.kind,
      reason
    });
    return false;
  };

  const push = (map, key, row) => map.set(key, [...(map.get(key) ?? []), row]);

  for (const row of read.rows) {
    if (row.kind === 'event') {
      if (row.mode === 'split' && typeof adapters[row.from] !== 'function') {
        refuse(row, 'needs-adapter');
        continue;
      }

      push(state.byNew, row.to, row);
      push(state.byOld, row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'setting' || row.kind === 'attribute') {
      if (typeof state.native.setAttribute !== 'function') {
        refuse(row, 'no-attributes');
        continue;
      }

      state.attrByOld.set(row.from, row);
      push(state.attrByNew, row.to, row);
      handle.installed += 1;
      if (row.kind === 'setting') installProperty(state, element, row, refuse);
    } else if (row.kind === 'value') {
      if (!state.values.has(row.setting)) state.values.set(row.setting, new Map());
      state.values.get(row.setting).set(row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'action' && installAction(state, element, row, refuse)) {
      handle.installed += 1;
    }
  }

  if (state.byNew.size) {
    defineOwn(state, element, 'dispatchEvent', {
      writable: true,
      value: event => wrappedDispatch(state, element, event)
    });
  }

  const attributes = state.attrByOld.size || state.values.size;

  if (attributes) {
    defineOwn(state, element, 'setAttribute', {
      writable: true,
      value: (name, value) => wrappedSet(state, element, name, value)
    });
    defineOwn(state, element, 'removeAttribute', {
      writable: true,
      value: name => wrappedRemove(state, element, name)
    });

    if (typeof state.native.toggleAttribute === 'function') {
      defineOwn(state, element, 'toggleAttribute', {
        writable: true,
        value: (name, force) => wrappedToggle(state, element, name, force)
      });
    }

    adopt(state, element);
    const Observer = element.ownerDocument?.defaultView?.MutationObserver ?? globalThis.MutationObserver;

    if (typeof Observer === 'function') {
      const filter = [...new Set([...state.attrByOld.keys(), ...state.attrByNew.keys(), ...state.values.keys()])];
      state.observer = new Observer(records => reconcile(state, element, records));
      state.observer.observe(element, {
        attributes: true,
        attributeFilter: filter
      });
    }
  }

  shared().elements.set(element, state);
  signal?.addEventListener?.('abort', () => uninstallAliases(element), {
    once: true,
    signal: state.controller.signal
  });
  return handle;
} // For code that sends an event by name: through the element's aliases when
// it has them, a plain dispatch when it has none. Answers false when cancelled.

function dispatchAliased(element, name, {
  detail = null,
  bubbles = true,
  composed = true,
  cancelable = false
} = {}) {
  return element.dispatchEvent(makeEvent(element, name, detail, {
    bubbles,
    composed,
    cancelable
  }));
}
function aliasesOf(element) {
  return [...(shared().elements.get(element)?.rows ?? [])];
} // The first copy's API stays; every copy shares the state.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const current = globalThis.SF.aliases;

  if (!current || typeof current.install !== 'function') {
    globalThis.SF.aliases = {
      version: VERSION,
      strict: current?.strict === true,
      install: installAliases,
      uninstall: uninstallAliases,
      dispatch: dispatchAliased,
      of: aliasesOf,
      read: _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable,
      expired: (row, now) => (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, now ?? shared().now())
    };
  }
}

/***/ },

/***/ "06e8cd089f28"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearDeprecations: () => (/* binding */ clearDeprecations),
/* harmony export */   listDeprecations: () => (/* binding */ listDeprecations),
/* harmony export */   noteDeprecated: () => (/* binding */ noteDeprecated)
/* harmony export */ });
// What a page still uses that the Framework keeps only for compatibility. Every
// legacy attribute, value or name a component resolves is noted here once, so a
// person, a probe or an AI upgrading a product can read the list off a running
// page (SF.deprecations.list()) instead of searching the source for it. The
// records behind the names are in contracts/changes/journal.json.
//
// Nothing is printed by default: a page opts in to console warnings with
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true. A dated
// alias (core/js/aliases.js, standard simai.smart-component §16.20) also
// records `tag`, `since` and `remove_after`; once its date has passed the
// record turns `expired` and that is printed once whatever the page opted
// into, because the name can leave with the next sweep.
//
// Every bundle carries its own copy of this module, so a Map of its own made one
// list per bundle, and SF.deprecations.list() answered with whichever bundle set
// it last -- [] on a page printing seven warnings from others. The notes live on
// one shared global instead, whichever copy writes or reads them.
function sharedNotes() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__deprecationNotes instanceof Map)) {
    Object.defineProperty(root, '__deprecationNotes', {
      value: new Map(),
      configurable: true
    });
  }

  return root.__deprecationNotes;
}

function warnEnabled() {
  const root = globalThis.document?.documentElement;
  return root?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
}

function noteDeprecated({
  component = '',
  kind = 'attribute',
  attribute = '',
  from,
  to = null,
  tag,
  since,
  remove_after: removeAfter,
  expired
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  let note = notes.get(key);
  const firstExpiry = expired === true && note?.expired !== true;

  if (note) {
    note.count += 1;
  } else {
    note = {
      component,
      kind,
      attribute,
      from,
      to,
      count: 1
    };
    notes.set(key, note);
  } // The dated fields are kept only when a caller knows them, so the records of
  // the Framework's undated aliases keep their shape.


  if (tag !== undefined) note.tag = tag;
  if (since !== undefined) note.since = since;
  if (removeAfter !== undefined) note.remove_after = removeAfter;
  if (expired === true) note.expired = true;

  if (firstExpiry) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} was due to leave after ${note.remove_after || 'its date'}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  } else if (note.count === 1 && warnEnabled()) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} is a legacy name${note.remove_after ? ` until ${note.remove_after}` : ''}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}

function describe({
  component,
  kind,
  attribute,
  from
}) {
  const where = component ? `${component}: ` : '';
  const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
  return `${where}${what}`;
}

function listDeprecations() {
  return [...sharedNotes().values()].map(note => ({ ...note
  }));
}
function clearDeprecations() {
  sharedNotes().clear();
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const api = globalThis.SF.deprecations || {};
  api.list = listDeprecations;
  api.clear = clearDeprecations;
  api.note = noteDeprecated;
  globalThis.SF.deprecations = api;
}

/***/ },

/***/ "59da34819c8b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   camelName: () => (/* binding */ camelName),
/* harmony export */   elementFromManifest: () => (/* binding */ elementFromManifest),
/* harmony export */   eventName: () => (/* binding */ eventName),
/* harmony export */   propsFromManifest: () => (/* binding */ propsFromManifest),
/* harmony export */   readManifest: () => (/* binding */ readManifest),
/* harmony export */   toOutcome: () => (/* binding */ toOutcome)
/* harmony export */ });
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("28b603686dcc");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _page_actions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("51e3a200cf5f");
/* harmony import */ var _host_port_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f171c5ece4b4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_1__);
// An element from its manifest (standard simai.smart-component 1.3.8 §3, §4,
// §4.1, §4.4, §7.7, §8, §11, §17.1).
//
// A component folder holds component.json, its language files and its
// aliases.json; the element's attribute and property code, the methods of its
// actions and the names of its events are not written by hand but made from
// them here:
//
//   import manifest from './component.json';
//   import en from './lang/en.json';
//   import ru from './lang/ru.json';
//   import aliases from './aliases.json';
//   const Base = elementFromManifest(manifest, {base: SfBaseElement, lang: {en, ru}, aliases, actions: {...}});
//   class SfThing extends Base { ...behaviour only... }
//
// Why at load and not in the build: ui-builder compiles a Smart component's
// index.js with webpack and babel and transforms nothing of its own, so the
// JSON files are bundled as they are (webpack reads JSON imports) and the
// plumbing is made once per class when the bundle runs. A build step can take
// this over later without a change in the components: the input is the same
// manifest.
//
// What the class gets:
//
// - settings (§4): an attribute and a property per setting, typed (`string`,
//   `enum`, `boolean`, `number`, `icon`, `date`, `id`; `list`, `object` and
//   `state` are properties only); a setting with `"default-from":
//   "runtime.<word>"` defaults to that word in the element's language;
// - values (§4, §4.3): a value with a default is also a setting of the same
//   name; the others are read-only properties that a component overrides with
//   its own getter;
// - events (§8): `sfEmit(verb, detail)` sends `<tag>-<verb>`, or the native
//   name for `change`, `input` and `"carries": "native"` (with the detail
//   when one is given), through the dated aliases, so the old names follow;
// - actions (§4.4): one method per action that takes its `with` parameters as
//   one object or in declared order and answers an outcome, `{outcome:
//   'applied'}` or `{outcome: 'refused', reason}`; `"emits"` sends its event
//   once first, and a page that cancels it makes the action refused; a
//   waiting action whose instance is removed answers `cancelled`;
// - the base action `connect-port {port}` (§4.1, §4.9): `connectPort(port)`,
//   `setHostPort` its alias, the port kept on the instance's scope and read
//   as `sfPort`, the component's `onPortConnected(port, {signal})` its hook
//   (core/js/host-port.js; the Smart base has it, another base gets it here);
// - the base values `shown` and `started` (§4.1) and the host state
//   `data-sf-started`; `sfHostState(name, on)` writes the declared
//   `host-states` (§5.3);
// - static `aliases` from aliases.json (§16.20), installed by the base;
// - words (§11, §11.1): `sfWord(key, {count, vars})`, with the element's own
//   word first, then the nearest [lang], the page's choice, <html lang>,
//   English, the source language and the key;
// - a form control (§17.1): `formAssociated` and ElementInternals where the
//   browser has them; `sfFormValue()` is what the form gets.
//
// Members the runtime adds start with `sf`, which no manifest name may
// (§3.1), so a generated setting or action never collides with them.





const RESERVED = new Set(['props', 'api', 'view', 'scope', 'parts', 'receive', 'render', 'connected', 'disconnected', 'updated', 'outside', 'data', 'template', 'root-class', 'root-style', 'focus', 'blur', 'connect-port', 'shown', 'started']);
const PROPERTY_ONLY = new Set(['list', 'object', 'state']); // core/js/smart-base.js toBoolean: what an attribute value means as true.

const TRUE_WORDS = new Set(['1', 'true', 'yes', 'on', 'checked', 'disabled', 'download', 'indeterminate', 'multiple']);
const camelName = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype; // The browser's own members (§3.1): read from the prototype, never from a copy.


function isNativeMember(property) {
  let proto = globalThis.HTMLElement?.prototype;

  while (proto) {
    if (Object.prototype.hasOwnProperty.call(proto, property)) return true;
    proto = Object.getPrototypeOf(proto);
  }

  return false;
} // The browser's own names a field reports under (§8, §17.3): a page listens
// for `change` and `input` on any form control, ours included, so they keep
// those names whatever they carry -- a detail when the component gives one,
// never `<tag>-change`. A component that holds other content and is no value
// control (sf-tabs, sf-steps, sf-pagination) declares `"x-native": false` on
// the event: it sends `<tag>-change`, so a field's change bubbling out of a
// panel is never taken for its own.


const NATIVE_EVENTS = new Set(['change', 'input']);
/** The DOM name of an event the manifest declares by its verb (§8). */

function eventName(manifest, verb) {
  const declared = manifest?.events?.[verb];
  if (declared?.carries === 'native') return verb;
  if (NATIVE_EVENTS.has(verb) && declared?.['x-native'] !== false) return verb;
  return `${manifest.tag}-${verb}`;
}
/** An action's answer as an outcome (§4.4, vocabulary §3.1). */

function toOutcome(result) {
  if (result === undefined || result === null || result === true) return {
    outcome: 'applied'
  };
  if (result === false) return {
    outcome: 'refused',
    reason: 'refused'
  };

  if (typeof result === 'string') {
    return ['applied', 'cancelled', 'conflict', 'unavailable'].includes(result) ? {
      outcome: result
    } : {
      outcome: 'refused',
      reason: result
    };
  }

  if (typeof result === 'object' && typeof result.outcome === 'string') return result;
  return {
    outcome: 'applied',
    value: result
  };
}

function typedDefault(spec) {
  if (Object.prototype.hasOwnProperty.call(spec, 'default')) return spec.default;

  switch (spec.type) {
    case 'boolean':
      return false;

    case 'number':
      return 0;

    case 'list':
      return [];

    case 'object':
    case 'state':
      return {};

    case 'enum':
      return spec.values?.[0] ?? '';

    default:
      return '';
  }
}

function runtimeWordOf(spec) {
  const from = spec?.['default-from'];
  return typeof from === 'string' && from.startsWith('runtime.') ? from.slice('runtime.'.length) : '';
}
/**
 * The members a manifest declares, read once: what the element exposes and
 * how each name is spelled on it.
 */


function readManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || !manifest.tag) {
    throw new TypeError('elementFromManifest: a manifest with a tag is required');
  }

  const members = [];
  const refused = [];

  const take = (part, name, spec, writable) => {
    const property = camelName(name);

    if (RESERVED.has(name) || name.startsWith('_') || name.startsWith('sf')) {
      refused.push({
        part,
        name,
        reason: 'reserved'
      });
      return;
    }

    members.push({
      part,
      name,
      property,
      type: spec.type || 'string',
      values: Array.isArray(spec.values) ? spec.values : null,
      default: typedDefault(spec),
      optional: spec.optional === true,
      attribute: PROPERTY_ONLY.has(spec.type) ? '' : name,
      writable,
      word: runtimeWordOf(spec),
      native: isNativeMember(property)
    });
  };

  for (const [name, spec] of Object.entries(manifest.settings || {})) take('settings', name, spec || {}, true);

  for (const [name, spec] of Object.entries(manifest.values || {})) {
    // A value a person changes is also writable as a setting (§4); one that
    // only shows (effective-*) is read.
    const writable = Object.prototype.hasOwnProperty.call(spec || {}, 'default') || Boolean(spec?.['default-from']);
    take('values', name, spec || {}, writable && !name.startsWith('effective-'));
  }

  const events = Object.fromEntries(Object.entries(manifest.events || {}).map(([verb, spec]) => [verb, {
    verb,
    name: eventName(manifest, verb),
    cancelable: spec?.cancelable === true,
    native: NATIVE_EVENTS.has(verb) || spec?.carries === 'native'
  }]));
  const actions = Object.entries(manifest.actions || {}).map(([name, spec]) => ({
    name,
    method: camelName(name),
    with: Object.keys(spec?.with || {}),
    emits: spec?.emits || ''
  }));
  return {
    tag: manifest.tag,
    members,
    events,
    actions,
    refused,
    hostStates: { ...(manifest['host-states'] || {})
    },
    form: manifest.form || null
  };
}
/** The base's `props` for the members that live in attributes or properties. */

function propsFromManifest(manifest) {
  const {
    members
  } = readManifest(manifest);
  const props = {};

  for (const member of members) {
    if (!member.writable) continue;
    const config = {
      default: member.default,
      attribute: member.attribute || false
    };
    if (member.type === 'boolean') config.type = Boolean;else if (member.type === 'number') config.type = Number;else if (member.type === 'list') config.type = Array;else if (PROPERTY_ONLY.has(member.type)) config.type = Object;
    if (member.values) config.values = member.values;

    if (PROPERTY_ONLY.has(member.type)) {
      config.parser = function readProperty(raw, fallback, element) {
        const store = element?.__sfManifestData;
        return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : fallback;
      };
    } else if (member.word) {
      config.parser = function readWord(raw, fallback, element) {
        return raw !== undefined && raw !== null ? raw : element.sfWord(member.word);
      };
    }

    props[member.property] = config;
  }

  return props;
}

function readAttribute(element, member) {
  const raw = element.getAttribute(member.attribute);

  if (member.type === 'boolean') {
    if (raw === null) return member.optional && member.default === undefined ? undefined : Boolean(member.default); // The base's reading, so the template and the property agree: present
    // and empty is true, then the words the base takes for true.

    return raw === '' || TRUE_WORDS.has(raw.toLowerCase());
  }

  if (raw === null) return member.word ? element.sfWord(member.word) : member.default;

  if (member.type === 'number') {
    const number = Number(raw);
    return raw.trim() !== '' && Number.isFinite(number) ? number : member.default;
  }

  if (member.values && !member.values.includes(raw)) return member.default;
  return raw;
}

function writeAttribute(element, member, value) {
  if (value === null || value === undefined) {
    element.removeAttribute(member.attribute);
    return;
  }

  if (member.type === 'boolean') {
    // An optional boolean keeps «off» as a value of its own (§4.2), and so
    // does one that is on by default: taking the attribute away would read
    // as the default, on (sf-pagination's count-known, total-exact).
    if (value) element.setAttribute(member.attribute, '');else if (member.optional || member.default === true) element.setAttribute(member.attribute, 'false');else element.removeAttribute(member.attribute);
    return;
  }

  element.setAttribute(member.attribute, String(value));
}

function defineMembers(target, members) {
  for (const member of members) {
    // The browser's own members stay the browser's (§3.1); a component that
    // must answer one writes its own accessor.
    if (member.native) continue;

    if (!member.writable) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          return member.default;
        }

      });
      continue;
    }

    if (!member.attribute) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          const store = this.__sfManifestData;
          return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : member.default;
        },

        set(value) {
          if (!this.__sfManifestData) this.__sfManifestData = {};
          this.__sfManifestData[member.name] = value;
          this.requestComponentUpdate?.(member.name);
        }

      });
      continue;
    }

    Object.defineProperty(target, member.property, {
      configurable: true,

      get() {
        return readAttribute(this, member);
      },

      set(value) {
        writeAttribute(this, member, value);
      }

    });
  }
}

function parameters(action, args) {
  if (args.length === 1 && isPlainObject(args[0]) && (action.with.length !== 1 || Object.keys(args[0]).every(key => action.with.includes(key)))) {
    return { ...args[0]
    };
  }

  return Object.fromEntries(action.with.map((name, index) => [name, args[index]]));
}

function defineActions(target, actions, implementations, events) {
  for (const action of actions) {
    if (isNativeMember(action.method)) continue;
    const run = implementations?.[action.name];
    Object.defineProperty(target, action.method, {
      configurable: true,
      writable: true,
      value: function generatedAction(...args) {
        const params = parameters(action, args);

        if (action.emits) {
          const event = events[action.emits];
          const allowed = this.sfEmit(action.emits, params, {
            cancelable: event?.cancelable ?? true
          });
          if (!allowed) return {
            outcome: 'refused',
            reason: 'prevented'
          };
        }

        if (typeof run !== 'function') {
          globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: action ${action.name} has no code`);
          return {
            outcome: 'refused',
            reason: 'not-implemented'
          };
        }

        let result;

        try {
          result = run.call(this, params, {
            signal: this.sfScope
          });
        } catch (error) {
          this.reportComponentError?.(error, `action ${action.name}`);
          return {
            outcome: 'refused',
            reason: 'error'
          };
        }

        if (result && typeof result.then === 'function') {
          const signal = this.sfScope;
          return Promise.resolve(result).then(value => signal?.aborted ? {
            outcome: 'cancelled'
          } : toOutcome(value), error => {
            if (signal?.aborted || error?.name === 'AbortError') return {
              outcome: 'cancelled'
            };
            this.reportComponentError?.(error, `action ${action.name}`);
            return {
              outcome: 'refused',
              reason: 'error'
            };
          });
        }

        return toOutcome(result);
      }
    });
  }
} // The nearest closed container (§7.2.1): `hidden`, a closed <details> or
// <dialog>. What has no box in an opened container is not shown.


function isShown(element) {
  if (!element.isConnected) return false;

  for (let node = element; node && node.nodeType === 1; node = node.parentElement || node.getRootNode?.()?.host) {
    if (node.hidden) return false;
    const tag = node.localName;
    if (node !== element && (tag === 'details' || tag === 'dialog') && !node.open) return false;
  }

  return true;
}
/**
 * The class a component extends: its manifest's plumbing over `base`.
 *
 * options:
 *   base      the class to extend (the Smart base, or a trait over it);
 *   lang      `{<locale>: <lang file>}`; the `runtime` words are the element's;
 *   source    the language the component was written in (the fallback before
 *             the key; default the first file that `lang` names);
 *   aliases   the component's aliases.json;
 *   actions   `{<action>(params, {signal}) => outcome}`, the actions' code;
 *   formerWords
 *             `{since, remove_after, words: {<key>: <old key>}}`: the keys
 *             a product may still have registered its words under (the
 *             camelCase keys before §11's language files). A word registered
 *             under an old key is said until the day, noted once in
 *             SF.deprecations.
 */


function elementFromManifest(manifest, {
  base,
  lang = {},
  source,
  aliases,
  actions = {},
  formerWords
} = {}) {
  const Base = base || globalThis.SF?.smart?.SfBaseElement;
  if (typeof Base !== 'function') throw new TypeError('elementFromManifest: a base class is required');
  const read = readManifest(manifest);
  const generatedProps = propsFromManifest(manifest); // Settings that arrive after the first paint (§5.4): their skeleton holds
  // the box until they do.

  const late = [].concat(manifest.presentation?.skeleton?.late ?? []).map(name => read.members.find(member => member.name === name)).filter(Boolean);
  const words = Object.fromEntries(Object.entries(lang).map(([locale, file]) => [locale.toLowerCase(), { ...(file?.runtime || {})
  }]));
  const sourceLanguage = source || Object.keys(words)[0] || '';
  const formerKeys = formerWords?.words || {};
  const formAssociated = Boolean(read.form) && typeof globalThis.ElementInternals === 'function' && typeof globalThis.ElementInternals.prototype?.setFormValue === 'function';

  class ManifestElement extends Base {
    static get manifest() {
      return manifest;
    } // What SF.Assembly reads of a part it places (assembly/definition.mjs
    // interfaces.of): the same manifest, so a rule can ask its actions.


    static get sfInterface() {
      return manifest;
    }

    static get sfManifest() {
      return read;
    }

    static get sfWords() {
      return words;
    }

    static get formAssociated() {
      return formAssociated;
    }

    static get props() {
      return { ...super.props,
        ...generatedProps
      };
    }

    constructor() {
      super();
      this.sfInternals = formAssociated && typeof this.attachInternals === 'function' ? this.attachInternals() : null;
    }

    connectedCallback() {
      this.sfReadIsland();
      super.connectedCallback(); // A leaf outside an assembly starts with the page (§7.2.1 `now`).

      this.toggleAttribute('data-sf-started', true);
    }
    /**
     * The first values of the settings an attribute cannot hold, lists and
     * objects, from the JSON island a server prints in the host (§5.4):
     * `<script type="application/json" data-sf-settings>{"items": [...]}</script>`.
     * Read once, before the first render; an attribute or a property the page
     * set first wins. The island is taken out, so a component that reads its
     * children never meets it.
     */


    sfReadIsland() {
      const island = Array.from(this.children ?? []).find(child => child.localName === 'script' && child.hasAttribute('data-sf-settings') && /^application\/json$/iu.test(child.type));
      if (!island) return;
      island.remove();
      let data;

      try {
        data = JSON.parse(island.textContent || '{}');
      } catch (error) {
        globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: the data-sf-settings island is not JSON`, error);
        return;
      }

      for (const [name, value] of Object.entries(isPlainObject(data) ? data : {})) {
        const member = read.members.find(one => one.name === name);

        if (!member || !member.writable || member.native) {
          globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: the island's "${name}" is not a setting`);
          continue;
        }

        if (member.attribute ? this.hasAttribute(member.attribute) : Object.prototype.hasOwnProperty.call(this.__sfManifestData ?? {}, name)) continue;
        this[member.property] = value;
      }
    }
    /**
     * Whether the element keeps its printed skeleton (§5.4, §7.3 phase 3):
     * the host was printed with data-sf-first-paint="skeleton" and a setting
     * declared late (presentation.skeleton.late) has not arrived. The first
     * render waits for it, so the skeleton turns into content in one frame.
     * A list given explicitly, even empty, has arrived: an empty list is
     * data (the empty state), not data still to come. Only a list nobody set
     * -- its default -- keeps the skeleton waiting.
     * A component whose data comes another way (a port) overrides this.
     */


    sfAwaitingData() {
      if (!late.length || this.getAttribute('data-sf-first-paint') !== 'skeleton') return false;
      return late.some(member => {
        if (member.attribute && this.hasAttribute(member.attribute)) return false;
        const store = this.__sfManifestData;

        if (!member.attribute && store && Object.prototype.hasOwnProperty.call(store, member.name)) {
          const given = store[member.name];
          if (given !== undefined && given !== null) return false;
        } // Read through the property: a component may keep the setting itself.


        const value = this[member.property];
        return value === undefined || value === null || Array.isArray(value) && !value.length;
      });
    }
    /** §4.1: the element has a box in an opened container. */


    get shown() {
      return isShown(this);
    }
    /** §4.1: its assembly has started it (a leaf on a page, once connected). */


    get started() {
      return this.hasAttribute('data-sf-started');
    }
    /** The DOM name of a declared event (§8). */


    sfEventName(verb) {
      return read.events[verb]?.name ?? eventName(manifest, verb);
    }
    /**
     * Sends a declared event by its verb. Answers false when a listener
     * refused a cancelable one.
     */


    sfEmit(verb, detail = {}, {
      cancelable
    } = {}) {
      const event = read.events[verb];
      if (!event) globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: event ${verb} is not declared`);
      return (0,_aliases_js__WEBPACK_IMPORTED_MODULE_0__.dispatchAliased)(this, this.sfEventName(verb), {
        detail,
        bubbles: true,
        composed: true,
        cancelable: cancelable ?? event?.cancelable ?? false
      });
    }
    /** A word of the element's own, in its language (§11, §11.1). */


    sfWord(key, {
      count,
      vars
    } = {}) {
      const former = Object.hasOwn(formerKeys, key) ? formerKeys[key] : undefined;
      const onFormer = former === undefined ? undefined : old => (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
        component: this.localName,
        tag: this.localName,
        kind: 'word',
        from: old,
        to: key,
        since: formerWords.since,
        remove_after: formerWords.remove_after
      });
      return (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(words, key, this, {
        component: this.localName,
        source: sourceLanguage,
        count,
        vars,
        former,
        onFormer
      });
    }
    /** Writes a declared host state (§5.3). */


    sfHostState(name, value) {
      const type = read.hostStates[name];

      if (!type) {
        globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: host state ${name} is not declared`);
        return;
      }

      if (type === 'boolean') {
        if (value) this.setAttribute(name, 'true');else this.removeAttribute(name);
      } else if (value === null || value === undefined || value === '') {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, String(value));
      }
    }
    /**
     * What a form gets (§17.1): the value named by `form.submits` while the
     * value named by `form.value` holds, nothing while disabled. A boolean
     * value submits only when true. A component overrides it for a value of
     * its own shape.
     */


    sfFormValue() {
      const form = read.form;
      if (!form) return null;
      if (form.disabled && this[camelName(form.disabled)]) return null;
      const value = this[camelName(form.value)];

      if (form.submits && form.submits !== form.value) {
        if (!value) return null;
        const submitted = this[camelName(form.submits)];
        return submitted === undefined || submitted === null ? null : String(submitted);
      }

      if (value === undefined || value === null || value === false) return null;
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    /** Tells the form what the element holds now. */


    sfSyncForm() {
      if (!this.sfInternals) return;

      try {
        this.sfInternals.setFormValue(this.sfFormValue());
      } catch (error) {
        this.reportComponentError?.(error, 'form');
      }
    }

    get form() {
      return this.sfInternals?.form ?? null;
    }

    get labels() {
      return this.sfInternals?.labels ?? null;
    }

    get validity() {
      return this.sfInternals?.validity;
    }

    get validationMessage() {
      return this.sfInternals?.validationMessage ?? '';
    }

    get willValidate() {
      return this.sfInternals?.willValidate ?? false;
    }

    checkValidity() {
      return this.sfInternals ? this.sfInternals.checkValidity() : true;
    }

    reportValidity() {
      return this.sfInternals ? this.sfInternals.reportValidity() : true;
    }

    setCustomValidity(message = '') {
      if (!this.sfInternals) return;
      if (message) this.sfInternals.setValidity({
        customError: true
      }, String(message));else this.sfInternals.setValidity({});
    }

    formDisabledCallback(disabled) {
      this.sfFormDisabled = Boolean(disabled);
      this.requestComponentUpdate?.('form-disabled');
    }

  }

  defineMembers(ManifestElement.prototype, read.members); // connect-port is the base's (§4.1): a base without it gets it here.

  (0,_host_port_js__WEBPACK_IMPORTED_MODULE_4__.installPortAction)(ManifestElement.prototype);
  defineActions(ManifestElement.prototype, read.actions, actions, read.events); // data-sf-action="<id>.<action>" runs a declared action (§8 one page trigger).

  if (read.actions.length) (0,_page_actions_js__WEBPACK_IMPORTED_MODULE_3__.bindPageActions)();
  if (aliases) ManifestElement.aliases = aliases;
  return ManifestElement;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f171c5ece4b4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   connectPort: () => (/* binding */ connectPort),
/* harmony export */   installPortAction: () => (/* binding */ installPortAction),
/* harmony export */   portFromParams: () => (/* binding */ portFromParams),
/* harmony export */   portIdOf: () => (/* binding */ portIdOf),
/* harmony export */   portOf: () => (/* binding */ portOf)
/* harmony export */ });
// The base action connect-port {port} (standard simai.smart-component 1.3.8
// §4.1, §4.9): every element takes the host port it is handed, from the page
// or from the assembly it is a part of, by one method, `connectPort(port)`;
// `setHostPort(port)` is its alias.
//
// The port is kept on the instance, for its scope (§7.7): it lasts while the
// instance does and is let go when its scope ends, so an element taken out of
// the page holds no host. A component reacts through an optional hook,
// `onPortConnected(port, {signal})`, run after the port is kept; a component
// written before the base action, which overrides `setHostPort(port)` itself,
// has that override run as the hook, so it needs no change to be reached.
//
// Answers an outcome (§4.4): `{outcome: 'applied'}`; `refused` with
// `no-port` when nothing was handed, `other-port` when the port names an id
// other than the one the manifest declares, and `port-unsupported` when the
// hook throws -- the port is then not kept.
// A host adapter names its port by `id` (SF.Assembly, the port contracts) or
// by `port` (`{port, version, capabilities, raise}`, ui-pro's adapters).
function portIdOf(port) {
  if (!port || typeof port !== 'object') return '';
  if (typeof port.id === 'string' && port.id) return port.id;
  if (typeof port.port === 'string' && port.port) return port.port;
  return '';
} // connect-port takes its parameters as one object, `{port}`, or the port
// itself. An adapter whose `port` is its id (a string) is the port.

function portFromParams(params) {
  if (params && typeof params === 'object' && params.port && typeof params.port === 'object') return params.port;
  return params;
} // The port id the element's manifest declares, if any (§4.9).

function declaredPortId(element) {
  const declared = element?.constructor?.manifest?.port ?? element?.constructor?.sfInterface?.port;
  return portIdOf(declared);
}
/** The port an element holds now, or null. */


function portOf(element) {
  return element?.__sfPortEntry?.port ?? null;
}
/** connect-port {port} on `element`, with `alias` the base's own setHostPort. */

function connectPort(element, params, alias) {
  const port = portFromParams(params);
  if (!port || typeof port !== 'object') return {
    outcome: 'refused',
    reason: 'no-port'
  };
  const declared = declaredPortId(element);
  const given = portIdOf(port);
  if (declared && given && declared !== given) return {
    outcome: 'refused',
    reason: 'other-port'
  };
  const previous = element.__sfPortEntry ?? null; // Kept on the element, not in a module map: every bundle carries its own
  // copy of this module, and the element is what they share.

  const signal = element.sfScope;
  const entry = {
    port,
    signal
  };
  element.__sfPortEntry = entry; // The port lives as long as the scope it was handed in (§7.7).

  if (signal && typeof signal.addEventListener === 'function' && !signal.aborted) {
    signal.addEventListener('abort', () => {
      if (element.__sfPortEntry === entry) element.__sfPortEntry = null;
    }, {
      once: true
    });
  } // The hook. A component's own setHostPort (written before the base action)
  // is the hook when there is no onPortConnected; the guard lets such an
  // override call super.setHostPort without running itself again.


  if (element.__sfConnectingPort) return {
    outcome: 'applied'
  };
  element.__sfConnectingPort = true;

  try {
    if (typeof element.onPortConnected === 'function') {
      element.onPortConnected(port, {
        signal
      });
    } else if (typeof element.setHostPort === 'function' && element.setHostPort !== alias) {
      element.setHostPort(port);
    }
  } catch (error) {
    element.__sfPortEntry = previous;
    return {
      outcome: 'refused',
      reason: 'port-unsupported'
    };
  } finally {
    element.__sfConnectingPort = false;
  }

  element.requestComponentUpdate?.('port');
  return {
    outcome: 'applied'
  };
}
/**
 * Gives a class the base action where its base has none: `connectPort`,
 * `setHostPort` and the read-only `sfPort`.
 */

function installPortAction(proto) {
  if (!proto || typeof proto.connectPort === 'function') return;

  function setHostPort(port) {
    return connectPort(this, port, setHostPort);
  }

  Object.defineProperty(proto, 'connectPort', {
    configurable: true,
    writable: true,
    value: function connectPortAction(port) {
      return connectPort(this, port, setHostPort);
    }
  });

  if (typeof proto.setHostPort !== 'function') {
    Object.defineProperty(proto, 'setHostPort', {
      configurable: true,
      writable: true,
      value: setHostPort
    });
  }

  if (!Object.prototype.hasOwnProperty.call(proto, 'sfPort')) {
    Object.defineProperty(proto, 'sfPort', {
      configurable: true,

      get() {
        return portOf(this);
      }

    });
  }
}

/***/ },

/***/ "695f21e50358"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   instancePath: () => (/* binding */ instancePath),
/* harmony export */   partId: () => (/* binding */ partId),
/* harmony export */   pathIsSettled: () => (/* binding */ pathIsSettled)
/* harmony export */ });
// An instance's id is its role path (standard simai.smart-component 1.3.8
// §7.1.1; simai/ui-source#41).
//
//   - at the top of the page: `page/<host id or data-sf-role>`;
//   - a part with `data-sf-role` inside another instance:
//     `<parent path>/<role>`;
//   - neither: `<kind>[<n>]`, n counted in document order among the
//     instances of the same kind that have neither.
//
// Ids that templates write (`for`, `aria-controls`, `aria-labelledby`) are
// `<path with every non-word run as ->--<local name>`. A counter is never an
// id: the field ids used to come from a module-scope counter, and every
// bundle that carries the field code (eight of them) had its own, so a class
// sf-quantity and an <sf-quantity> on one page both took
// `sf-quantity-1-control` and a label pointed at the other field. Ids that
// follow creation order also swap when two instances swap, and server markup
// (§5.4) cannot repeat them. A path is read from the page, so every bundle
// gives the same answer.
//
// `kind` is the element's tag for a Smart element; class markup passes its
// root class and is told apart as `class.<root class>`.
const isElement = node => node && node.nodeType === 1 && typeof node.getAttribute === 'function';

const isCustom = node => isElement(node) && String(node.localName || '').includes('-');

function parentInstance(node) {
  for (let current = node.parentNode || node.host || null; current; current = current.parentNode || current.host || null) {
    if (isCustom(current)) return current;
  }

  return null;
}

function kindOf(owner, kind) {
  const tag = String(owner?.localName || '').toLowerCase();
  if (tag && tag.includes('-')) return tag;
  return `class.${kind || tag || 'element'}`;
}

function documentIndex(owner, kind) {
  const doc = owner?.ownerDocument;
  if (!owner?.isConnected || typeof doc?.querySelectorAll !== 'function') return 0;
  const selector = kind.startsWith('class.') ? `.${kind.slice('class.'.length)}` : kind;
  let index = 0;

  for (const one of doc.querySelectorAll(selector)) {
    if (kind.startsWith('class.') && isCustom(one)) continue;
    if (one.id || one.getAttribute('data-sf-role')) continue;
    index += 1;
    if (one === owner) return index;
  }

  return 0;
}
/** The role path of an instance (§7.1.1). */


function instancePath(owner, {
  kind = ''
} = {}) {
  const id = isElement(owner) ? String(owner.id || '').trim() : String(owner?.id || '').trim();
  if (id) return `page/${id}`;
  const role = isElement(owner) ? String(owner.getAttribute('data-sf-role') || '').trim() : '';

  if (role) {
    const parent = parentInstance(owner);
    return parent ? `${instancePath(parent, {
      kind: parent.localName
    })}/${role}` : `page/${role}`;
  }

  const resolved = kindOf(owner, kind);
  return `${resolved}[${documentIndex(owner, resolved)}]`;
}
/** An id a template writes for one of its parts: `<path as a word>--<local name>`. */

function partId(path, local) {
  const base = String(path).replace(/\W+/gu, '-').replace(/^-+|-+$/gu, '');
  return local ? `${base}--${local}` : base;
}
/** Whether the path is final: an instance in the page, or one with an id. */

function pathIsSettled(owner) {
  return Boolean(owner?.isConnected || String(owner?.id || '').trim());
}

/***/ },

/***/ "51e3a200cf5f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindPageActions: () => (/* binding */ bindPageActions),
/* harmony export */   readPageAction: () => (/* binding */ readPageAction),
/* harmony export */   runPageAction: () => (/* binding */ runPageAction)
/* harmony export */ });
// One page trigger (standard simai.smart-component 1.3.8 §8, §16.10, §19.4):
// `data-sf-action="<element id>.<action>"` on a page control runs that action
// of the element, the same method a script or a rule calls. It replaces the
// per-component triggers (`data-sf-modal-open`, `data-sf-drawer-close`, …),
// which stay as their aliases.
//
//   <button data-sf-action="confirm-delete.open">Delete</button>
//   <sf-modal id="confirm-delete">… <button data-sf-action="confirm-delete.confirm">Yes</button></sf-modal>
//
// Only an action the element's manifest declares is run: a page trigger can
// not reach the element's other methods. The action gets no parameters; a
// trigger that needs some is a script.
//
// One click listener for the document, on a shared global: every Smart bundle
// carries its own copy of this module, and a second listener would run each
// action twice.
const KEY = Symbol.for('sf.pageActions');

const camel = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
/** `<id>.<action>` -> {id, action}; the action is the part after the last dot. */


function readPageAction(text) {
  const value = String(text || '').trim();
  const at = value.lastIndexOf('.');
  if (at <= 0 || at === value.length - 1) return null;
  return {
    id: value.slice(0, at),
    action: value.slice(at + 1)
  };
}
/** Runs a page trigger; answers the action's outcome, or null when nothing ran. */

function runPageAction(trigger) {
  const read = readPageAction(trigger?.getAttribute?.('data-sf-action'));
  if (!read) return null; // The element's id, or its instance id: a part an assembly placed is named
  // by its role path (§7.1.1, data-sf-instance="page/form/dialog").

  const doc = trigger.ownerDocument;
  const element = doc?.getElementById(read.id) ?? [...(doc?.querySelectorAll('[data-sf-instance]') ?? [])].find(one => one.getAttribute('data-sf-instance') === read.id);
  const declared = element?.constructor?.sfManifest?.actions ?? [];
  if (!declared.some(action => action.name === read.action)) return null;
  const method = element[camel(read.action)];
  return typeof method === 'function' ? method.call(element, {}) : null;
}
function bindPageActions(doc = globalThis.document) {
  if (!doc || typeof doc.addEventListener !== 'function') return;
  const scope = globalThis;
  if (!scope[KEY]) Object.defineProperty(scope, KEY, {
    value: new WeakSet(),
    configurable: true
  });
  if (scope[KEY].has(doc)) return;
  scope[KEY].add(doc);
  doc.addEventListener('click', event => {
    const trigger = event.target?.closest?.('[data-sf-action]');
    if (!trigger || trigger.matches(':disabled, [aria-disabled="true"]')) return;
    runPageAction(trigger);
  });
}

/***/ },

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity)
/* harmony export */ });
// The form-control half of a field built from its component.json (standard
// simai.smart-component 1.3.8 §17.1, §17.2), shared by the field family.
//
// core/js/element-manifest.js makes the host form-associated and gives it
// ElementInternals, sfFormValue() and sfSyncForm(). What a field adds is the
// same in every member, so it is written once here:
//
// - validity (§17.2): the host reports what its inner native control knows
//   (value-missing, too-short, pattern-mismatch, ...) with the control as the
//   anchor, so reportValidity() points at the box the person types in; a
//   custom error set with setCustomValidity() or the action set-error wins
//   until it is cleared;
// - the inner controls stay out of the page's form (§17.1 item 6): they carry
//   no name while the host is the form control;
// - a field with no inner native control to read (a list of buttons, a
//   picker, a file area) says what it knows itself with `fieldValidity()`:
//   value-missing while `required` and the form value is empty by default,
//   and where the browser points;
// - form reset and fieldset[disabled] (§17.1 items 3, 4): `form.reset()`
//   calls the component's `fieldReset()` when it has one (its default back,
//   without events), and the host syncs its form value and validity after the
//   browser has reset its parts;
// - restore: `formStateRestoreCallback` hands the saved form value to
//   `fieldRestore(state)` when the component has one.
//
// Usage, over the element core/js/element-manifest.js gives:
//
//   const Element = elementFromManifest(manifest, {base: SfBaseElement, ...});
//   class SfThing extends FormField(Element) { ... }
//
// Without ElementInternals nothing here runs, and the named inner control
// submits as it always did (§16 item 11).
// ValidityState's own flags, in the order of §17.2's list.
const VALIDITY_FLAGS = Object.freeze(['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput']);
/** The name an inner native control carries: none while the host submits (§17.1 item 6). */

function innerControlName(component, name) {
  return component?.sfInternals ? '' : String(name || '');
}
/**
 * The host's validity from its inner control: the control's failed flags and
 * message, or the custom error the page set, or valid. `own` adds flags the
 * component reads itself, {flag: message} (a number field's range and step,
 * which its text box cannot know).
 */

function syncFieldValidity(component, control, own = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;

  try {
    const custom = component.sfCustomError || '';

    if (custom) {
      internals.setValidity({
        customError: true
      }, custom, control || undefined);
      return;
    }

    const validity = control?.validity;
    const flags = {};
    let message = '';

    if (validity && !validity.valid && control.willValidate !== false) {
      for (const flag of VALIDITY_FLAGS) if (validity[flag]) flags[flag] = true;

      message = control.validationMessage;
    }

    for (const [flag, text] of Object.entries(own || {})) {
      flags[flag] = true;
      message ||= String(text || '');
    }

    if (Object.keys(flags).length) internals.setValidity(flags, message || ' ', control || undefined);else internals.setValidity({});
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The host's validity from what the component says itself (fieldValidity()):
 * value-missing and the custom error the page set; `anchor`, when it is a part
 * of the host, is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  message = '',
  anchor = null
} = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;
  const custom = component.sfCustomError || '';
  const flags = {};
  let text = '';

  if (custom) {
    flags.customError = true;
    text = custom;
  }

  if (valueMissing) {
    flags.valueMissing = true;
    text ||= message || 'value-missing';
  }

  try {
    if (Object.keys(flags).length) {
      const target = anchor && component.contains?.(anchor) ? anchor : undefined;
      internals.setValidity(flags, text, target);
    } else {
      internals.setValidity({});
    }
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The field family's form plumbing over a manifest element. A component
 * names the control its validity comes from with `sfValidityAnchor()`
 * (default: getInputElement()).
 */

const FormField = Base => class extends Base {
  constructor() {
    super(); // A person's edit reaches the host as input/change; the form value and
    // validity follow it without a redraw.

    this.__sfFormSync = () => this.sfSyncFormState();

    this.addEventListener('input', this.__sfFormSync);
    this.addEventListener('change', this.__sfFormSync);
  }

  sfValidityAnchor() {
    return this.getInputElement?.() || null;
  }
  /**
   * What the component knows of its validity itself, {valueMissing, message,
   * anchor}, or null when an inner native control's ValidityState is the
   * answer (sfValidityAnchor()). With no such control: value-missing while
   * `required` and the form value is empty. A component overrides it.
   */


  fieldValidity() {
    if (this.sfValidityAnchor()) return null;
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const value = this.sfFormValue?.();
    return {
      valueMissing: required && !this.disabled && (value === null || value === undefined || value === ''),
      message: this.sfWord?.('value-missing') || 'value-missing',
      anchor: null
    };
  }
  /** The validity, now: the component's own account, or its inner control's. */


  sfSyncValidity() {
    const own = this.fieldValidity();
    if (own) syncOwnValidity(this, own);else syncFieldValidity(this, this.sfValidityAnchor());
  }
  /** The form value and the validity, now. */


  sfSyncFormState() {
    this.sfSyncForm?.();
    this.sfSyncValidity();
  }
  /** §17.2: a custom error keeps the form from submitting until it is cleared. */


  setCustomValidity(message = '') {
    this.sfCustomError = String(message ?? '');
    this.sfSyncValidity();
  } // fieldReset() puts the component's default back, without events. The
  // browser resets the parts after it calls this: the sync waits for them,
  // and once more for the parts that put their own default back a task later
  // (component/form-reset-helper.js: masks, the checkables' attributes).


  formResetCallback() {
    if (typeof this.fieldReset === 'function') {
      try {
        this.fieldReset();
      } catch (error) {
        this.reportComponentError?.(error, 'form reset');
      }
    }

    this.sfSyncFormState();
    Promise.resolve().then(() => this.sfSyncFormState());
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  formStateRestoreCallback(state) {
    if (typeof this.fieldRestore === 'function') this.fieldRestore(state);
    this.sfSyncFormState();
  }

};

/***/ },

/***/ "778671c79fa6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INHERITED_RESET_EVENT: () => (/* binding */ INHERITED_RESET_EVENT),
/* harmony export */   INHERITED_TEXT: () => (/* binding */ INHERITED_TEXT),
/* harmony export */   InheritedValueField: () => (/* binding */ InheritedValueField),
/* harmony export */   inheritedStepDown: () => (/* binding */ inheritedStepDown),
/* harmony export */   renderInheritedSlot: () => (/* binding */ renderInheritedSlot)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _inherited_value_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c6c9dfe31af4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);


 // An inherited value, for every field of the input family (simai/ui-source#28).
//
// A setting whose empty value means «use what the parent says» -- a letter's
// colour from the brand, a page's font from the theme -- has two states a field
// must tell apart: «not set, so the parent's value applies» and «set, to
// something that may even equal it». Only the first follows the parent when the
// parent changes. A placeholder alone draws the first as if it were a value
// (ui-mail polish audit B2, P-15), and there was no way back to it once a
// person had typed.
//
// So a field that opts in takes `inherited-value`: while it holds no value of
// its own it shows that value in the placeholder ink with a small «inherited»
// marker, and the form gets an empty value. Once it holds a value of its own,
// the marker gives way to a reset button that empties the field again. The
// record views of package larena already draw a field's `inheritedValue` this
// way (property-view port 1.8.0 and later); this is the same state on the
// controls themselves, so a record view can hand it down rather than draw it
// beside them.
//
// Written once here and opted into by each control, which says only what its
// own value is, how to empty it and what takes focus: sf-input, sf-textarea,
// sf-dropdown, sf-color and sf-switch.

const INHERITED_RESET_EVENT = 'sf-field:reset'; // The marker and the reset, in the page's language. A product names its own
// words with `inherited-text` and `reset-label`, or registers a language.

const INHERITED_TEXT = {
  en: {
    inherited: 'inherited',
    reset: 'Reset to inherited',
    described: 'Inherited: {value}'
  },
  ru: {
    inherited: 'наследуется',
    reset: 'Сбросить к наследуемому',
    described: 'Наследуется: {value}'
  }
}; // Each control declares the three in its own props -- inherited-value,
// inherited-text and reset-label -- written out rather than spread from here, so
// the manifest check that reads a component's props sees them.
// The marker and the reset are one step down the ladder from the field they
// sit in, so they fit inside its box: a size 1 field (40px) holds a size 1/2
// button (32px) with the same inset on every side.

const STEP_DOWN = Object.freeze({
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
});
const inheritedStepDown = size => STEP_DOWN[String(size)] || '1/2';
/**
 * The mixin a control opts in with. The control supplies:
 *   - `inheritedOwnValue()` -- its own value as a string, '' when it has none;
 *   - `clearOwnValue()` -- empties it, firing the control's own input/change;
 *   - `inheritedFocusTarget()` -- the element that takes focus after a reset;
 * and may override `inheritedDisplayValue()` (what the inherited value reads
 * as -- a dropdown shows the option's label, not its machine value).
 */

const InheritedValueField = Base => class extends Base {
  constructor() {
    super(); // Typing changes the state without a redraw: the native field holds the
    // text, and redrawing on every key would fight it.

    this.__sfInheritedSync = () => this.syncInheritedState();

    this.addEventListener('input', this.__sfInheritedSync);
    this.addEventListener('change', this.__sfInheritedSync);
  }

  get inheritedValue() {
    return this.getAttribute('inherited-value') || '';
  }

  set inheritedValue(next) {
    if (next === null || next === undefined || next === '') this.removeAttribute('inherited-value');else this.setAttribute('inherited-value', String(next));
  }

  get inheritedText() {
    return this.getAttribute('inherited-text') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'inherited', this);
  }

  get resetLabel() {
    return this.getAttribute('reset-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'reset', this);
  }

  get hasInheritedValue() {
    return this.inheritedValue !== '';
  } // True while the field holds nothing of its own and the inherited value
  // applies. False without an inherited value: an empty field is then empty.


  get isInherited() {
    return this.hasInheritedValue && this.inheritedOwnValue() === '';
  }

  inheritedOwnValue() {
    return String(this.value ?? '');
  }

  inheritedDisplayValue() {
    return this.inheritedValue;
  }

  inheritedFocusTarget() {
    return null;
  }

  clearOwnValue() {
    this.value = '';
  } // What a screen reader hears beside the name while the value is inherited.


  inheritedDescription() {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'described', this).replace('{value}', this.inheritedDisplayValue());
  }
  /**
   * Back to the inherited value. Fires `sf-field:reset` first, cancellable:
   * a host that must confirm or refuse calls preventDefault and nothing
   * changes. Returns whether the field was reset. The detail names the
   * element (`tag`), as a trait event does (standard 1.3.8 §20, trait
   * field-inherit@1: sf-field-reset {tag, value, inherited-value, name}): the
   * event comes from every field of the family, and a listener on a form
   * tells them apart by it.
   */


  resetToInherited() {
    if (!this.hasInheritedValue || this.inheritedOwnValue() === '') return false;
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return false;
    const event = new CustomEvent(INHERITED_RESET_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        tag: this.localName,
        value: this.inheritedOwnValue(),
        inheritedValue: this.inheritedValue,
        name: this.getAttribute('name') || ''
      }
    });
    if (!this.dispatchEvent(event)) return false;
    this.clearOwnValue();
    this.syncInheritedState(); // The button that was pressed is gone, so focus goes where the person
    // works: the control itself. Left on a hidden button, it would fall to the
    // page and a keyboard user would start over from the top.

    const focus = () => this.inheritedFocusTarget()?.focus?.({
      preventScroll: true
    });

    focus();
    if (!this.contains(document.activeElement)) requestAnimationFrame(focus);
    return true;
  } // The state, drawn without a redraw: the host says it, the marker and the
  // reset swap, and the control carries the description. Each control calls it
  // at the end of its own afterRender, which the controls override without
  // calling up, so the mixin cannot hook it for them.


  syncInheritedState() {
    if (!this.hasInheritedValue && !this.__sfInheritedDescribed) {
      this.removeAttribute('data-inherited');
      return;
    }

    const inherited = this.isInherited;
    const own = this.hasInheritedValue && !inherited;
    if (inherited) this.setAttribute('data-inherited', 'true');else this.removeAttribute('data-inherited');
    this.querySelectorAll(':scope [data-inherited-marker]').forEach(node => {
      node.hidden = !inherited;
    });
    this.querySelectorAll(':scope [data-inherited-reset]').forEach(node => {
      node.hidden = !own;
    });
    const control = this.inheritedFocusTarget();
    if (!control) return;

    if (inherited) {
      control.setAttribute('aria-description', this.inheritedDescription());
      this.__sfInheritedDescribed = control;
    } else if (this.__sfInheritedDescribed === control) {
      control.removeAttribute('aria-description');
      this.__sfInheritedDescribed = null;
    }
  }

};
/**
 * The marker and the reset, for a control's trailing slot. Nothing at all
 * without an inherited value, so a field that does not use it is unchanged.
 */

function renderInheritedSlot(component, {
  size = '1',
  disabled = false,
  className = ''
} = {}) {
  if (!component?.hasInheritedValue) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const step = inheritedStepDown(size);
  const inherited = component.isInherited;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-field-inherited-slot sf-field-inherited-slot--size-${size} flex items-cross-center ${className}">
      <span class="sf-field-inherited sf-field-inherited--size-${step}"
            data-inherited-marker
            aria-hidden="true"
            ?hidden=${!inherited}>${component.inheritedText}</span>
      <button
        type="button"
        class="sf-field-reset sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${step}"
        data-inherited-reset
        aria-label=${component.resetLabel}
        title=${component.resetLabel}
        ?hidden=${inherited}
        ?disabled=${disabled}
        @click=${event => {
    // Inside a field's <label>, a press would also reach the control the
    // label is for -- a dropdown would open, a switch would flip.
    event.preventDefault();
    event.stopPropagation();
    component.resetToInherited();
  }}
      ><i class="sf-icon" aria-hidden="true">restart_alt</i></button>
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9b9874fb7905"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfQuantity: () => (/* binding */ SfQuantity)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("da109711b1a3");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("96dc2481e417");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("bbc57add6c29");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("d2d1bec40650");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("de73e1d806c6");
/* harmony import */ var _value_mjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("26872bd9a5e9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_6__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_6__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);
// sf-quantity: a number field with «−» and «+» (owner, 2026-10-25). The class
// component `quantity` draws the stepper and a page could already write its
// markup by hand, but a form built from Smart elements -- the property view
// and the data view among them -- had no field for an integer that steps: an
// sf-input with inputmode="numeric" takes text and leaves the bounds, the
// steps and the keys to the host.
//
// It is a form field like sf-input and sf-textarea: label, hint, error,
// required, disabled, read-only, the three field sizes and the inherited value
// (helpers/inherited-value.js) are the ones every field has. It draws the class
// component's markup, so the quantity sheet is what it looks like; the
// behaviour is its own, and the class binder leaves a root inside sf-quantity
// alone, as the country code's binder leaves its Smart owner's.
//
// The control is the WAI-ARIA spinbutton: a text box with role="spinbutton"
// carrying aria-valuenow, -valuemin, -valuemax and -valuetext. Not a native
// number input, which takes neither the page's decimal comma nor grouped
// thousands and draws spinners of its own. The keys are the pattern's:
// ArrowUp/ArrowDown a step, PageUp/PageDown ten, Home/End the bounds. The two
// steppers are real buttons named «Уменьшить значение» / «Увеличить значение»,
// out of the tab order as the pattern has them -- the keys already do what they
// do -- disabled at the bounds, and a held stepper repeats.
//
// Typing is strict: a character that cannot be part of a number is refused as
// it is typed or pasted. The decimal mark is the page's language's (a comma in
// Russian; the other of «.» and «,» is taken as one too unless the language
// groups with it). The value is committed on Enter and when the field loses
// focus: then it is rounded to the field's digits, clamped to the bounds and
// written back in the page's format.
//
// Since standard simai.smart-component 1.3.8 it is built from its
// component.json (§3, §4, §17, §20): the settings are made by
// core/js/element-manifest.js, the words are lang/<locale>.json, clear,
// step-up, step-down and set-error are actions that answer an outcome (§4.4),
// `error` is a dated alias of `invalid` (§17.2) and sf-field:reset of
// sf-field-reset (aliases.json). The host is the form control through
// ElementInternals: it submits the number with a point (§17.1 item 2),
// reports value-missing, range and step validity, and says on itself when
// the value stands at a bound (data-at-min, data-at-max, §5.3,
// simai/ui-source#46 item 4).













 // A held stepper waits, then repeats: long enough that a click is one step,
// fast enough that a hundred steps take a few seconds.

const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 60; // PageUp and PageDown move this many steps unless the field names its own.

const PAGE_STEPS = 10; // The actions (§4.4): each answers an outcome, and none is a person's change,
// so none sends an event, as a native field's stepUp() does not.

const actions = {
  clear() {
    this.setValue(null);
  },

  'step-up'({
    count
  } = {}) {
    this.setValue((0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.stepFrom)(this.currentValue(), Number(count) || 1, this.stepOptions()));
  },

  'step-down'({
    count
  } = {}) {
    this.setValue((0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.stepFrom)(this.currentValue(), -(Number(count) || 1), this.stepOptions()));
  },

  // The error message shown in place of the hint, and a custom error the form
  // will not submit over (§17.2: it used to paint only). An empty message
  // clears both.
  'set-error'({
    message
  } = {}) {
    const text = String(message ?? '');

    if (text) {
      this.setAttribute('error-message', text);
      this.setAttribute('invalid', '');
    } else {
      this.removeAttribute('error-message');
      this.removeAttribute('invalid');
    }

    this.setCustomValidity(text);
  }

};
const QuantityElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_6__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default())),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_11__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_12__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__,
  actions
});

class SfQuantity extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_7__.FormField)(QuantityElement) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // The value's attribute is its default (§4.3); observed, so writing it
      // moves the field. The manifest's value has no default (empty is no
      // number), so the generated props leave it out.
      value: {
        default: ''
      },
      // The control's name when no label is drawn: a field renderer's panel
      // prints the label beside the field (tests/field-control-accessible-name).
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      // What the field falls back to while it holds nothing (simai/ui-source#28).
      inheritedValue: {
        attribute: 'inherited-value',
        default: ''
      },
      inheritedText: {
        attribute: 'inherited-text',
        default: ''
      },
      resetLabel: {
        attribute: 'reset-label',
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super(); // undefined: follow the attribute. Set by the property, a step, a commit or
    // a reset; an attribute written later takes over again.

    this._value = undefined; // A value set as a property before the element was defined (a lit `.value`
    // binding on a tag the loader had not upgraded yet) is an own property that
    // would hide the accessor; it is taken through it, as sf-image-field does.

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      const early = this.value;
      delete this.value;
      this._value = this.readValue(early);
    } // The text being typed, until it is committed; null while nobody types.


    this._draft = null; // The last value `input` and `change` reported, so each fires once per
    // change: a commit that only reformats the text fires neither.

    this._reported = undefined;
    this._committed = undefined;
    this._hold = null;
    this._releaseReset = null;
    this._resetControl = null;

    this.__sfStopHold = () => this.stopHold();
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'value' && previous !== next) {
      this._value = undefined;
      this._draft = null;
      this._reported = undefined;
      this._committed = undefined;
    }

    super.attributeChangedCallback(name, previous, next);
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_4__.fieldSize)(this.getAttribute('size') || '1', 'sf-quantity');
  }

  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  }

  get locale() {
    return this.getAttribute('locale') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageLocale)(this);
  } // The bounds: a number, or null when the field has none on that side.


  get min() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.readNumber)(this.getAttribute('min'));
  }

  get max() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.readNumber)(this.getAttribute('max'));
  } // A step is positive; anything else is the default, one.


  get step() {
    const step = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.readNumber)(this.getAttribute('step'));
    return step !== null && step > 0 ? step : 1;
  }

  get pageStep() {
    const page = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.readNumber)(this.getAttribute('page-step'));
    return page !== null && page > 0 ? page : this.step * PAGE_STEPS;
  } // Digits after the decimal mark: the attribute, else what the step implies
  // (0.25 shows two). An integer field has none and refuses a decimal mark.


  get precision() {
    const own = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.readNumber)(this.getAttribute('precision'));
    if (own !== null && own >= 0) return Math.min(20, Math.floor(own));
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.inferPrecision)(this.getAttribute('step') || '1');
  }

  get interactive() {
    return !this.disabled && !this.readonly;
  } // A negative number may be typed when the field allows one: no lower bound,
  // or one below zero.


  get allowNegative() {
    const {
      min
    } = this;
    return min === null || min < 0;
  }

  get numberOptions() {
    return {
      locale: this.locale,
      allowDecimal: this.precision > 0,
      allowNegative: this.allowNegative,
      precision: this.precision,
      grouping: this.grouping
    };
  } // A value from code or an attribute: a number, numeric text written with a
  // point, or nothing. Anything else is nothing, as an unparseable value of a
  // native number field is.


  readValue(raw) {
    const number = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.readNumber)(raw);
    return number === null ? null : (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.roundTo)(number, this.precision);
  } // The number the field holds, or null when it is empty.


  get value() {
    if (this._value !== undefined) return this._value;
    return this.readValue(this.getAttribute('value'));
  } // Set from code, the value is not a change: no event, as for a native field.


  set value(next) {
    this.setValue(next);
  } // The value as the form submits it: a point, no grouping, the field's digits.


  get formValue() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.formValue)(this.value, this.precision);
  } // The value as the field writes it: the page's language and digits.


  get text() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.formatNumber)(this.value, this.numberOptions);
  }

  setValue(next) {
    this._value = this.readValue(next);
    this._draft = null;
    this._reported = this._value;
    this._committed = this._value;
    this.requestComponentUpdate('value');
    this.syncControlState();
    return this;
  } // ---- The form (§17.1, §17.2) ---------------------------------------------
  // The number with a point and no grouping, '' when empty; nothing while
  // disabled.


  sfFormValue() {
    if (this.disabled) return null;
    return this.formValue;
  } // value-missing is the box's own (required, and empty -- an inherited value
  // is a hint and does not count, §20.2); the range and the step are read off
  // the value, which a person may type past a bound until the commit clamps it.


  sfSyncFormState() {
    this.sfSyncForm();
    const value = this.value;
    const own = {};

    if (value !== null) {
      if (this.min !== null && value < this.min) own.rangeUnderflow = this.sfWord('range-underflow', {
        vars: {
          min: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.formatNumber)(this.min, this.numberOptions)
        }
      });
      if (this.max !== null && value > this.max) own.rangeOverflow = this.sfWord('range-overflow', {
        vars: {
          max: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.formatNumber)(this.max, this.numberOptions)
        }
      });
      const base = this.min ?? 0;
      const steps = (value - base) / this.step;
      if (Math.abs(steps - Math.round(steps)) > 1e-7) own.stepMismatch = this.sfWord('step-mismatch', {
        vars: {
          step: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.formatNumber)(this.step, this.numberOptions)
        }
      });
    }

    (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_7__.syncFieldValidity)(this, this.getInputElement(), own);
  } // The browser's restore of a form (back, reload): the submitted number.


  formStateRestoreCallback(state) {
    if (typeof state === 'string') this.setValue(state);
  }

  stepOptions() {
    return {
      step: this.step,
      min: this.min,
      max: this.max,
      precision: this.precision
    };
  }

  getInputElement() {
    return this.querySelector(':scope .sf-quantity-wrap input');
  }

  focusDelegate() {
    return this.getInputElement();
  }

  get state() {
    const input = this.getInputElement();
    return {
      value: this.value,
      text: input?.value ?? this.text,
      disabled: this.disabled,
      readonly: this.readonly,
      invalid: input?.getAttribute('aria-invalid') === 'true'
    };
  } // The value the field stands on now: a draft that reads as a number counts,
  // so a step taken while typing steps from what was typed.


  currentValue() {
    if (this._draft !== null) {
      const typed = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.parseNumber)(this._draft, this.numberOptions);
      if (typed === null) return null;
      if (Number.isFinite(typed)) return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.clamp)((0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.roundTo)(typed, this.precision), this.min, this.max);
    }

    return this.value;
  }

  atMin(value = this.value) {
    return value !== null && this.min !== null && value <= this.min;
  }

  atMax(value = this.value) {
    return value !== null && this.max !== null && value >= this.max;
  } // ---- The inherited-value seam -------------------------------------------


  inheritedOwnValue() {
    return this.value === null ? '' : String(this.value);
  }

  inheritedDisplayValue() {
    const number = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.readNumber)(this.inheritedValue);
    return number === null ? this.inheritedValue : (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.formatNumber)(number, this.numberOptions);
  }

  inheritedFocusTarget() {
    return this.getInputElement();
  } // A reset is a change the person made: input, then change.


  clearOwnValue() {
    this.writeValue(null, 'reset', {
      change: true
    });
  } // ---- Changes the person makes ---------------------------------------------
  // Writes a value the person chose and says so: `input` when it differs from
  // the last one reported, `change` (when asked) when it differs from the last
  // one committed. Returns whether the value moved.


  writeValue(next, source, {
    change = true
  } = {}) {
    const previous = this.value;
    this._value = next;
    this._draft = null; // The box, the numbers and the form value now, not at the next frame: Enter
    // commits and submits the form in one press, and the form must read the
    // committed number.

    this.syncInputText(true);
    this.syncControlState();
    this.requestComponentUpdate('value');

    if (next !== this._reportedValue()) {
      this._reported = next;

      this._emit('input', source);
    }

    if (change) this.commitChange(source);
    return next !== previous;
  }

  commitChange(source) {
    const value = this.value;
    if (value === this._committedValue()) return false;
    this._committed = value;

    this._emit('change', source);

    return true;
  }

  _reportedValue() {
    return this._reported === undefined ? this.readValue(this.getAttribute('value')) : this._reported;
  }

  _committedValue() {
    return this._committed === undefined ? this.readValue(this.getAttribute('value')) : this._committed;
  } // `input` and `change` on the host, as sf-image-field sends them: detail
  // carries the number (null when empty), the text the field shows, the form
  // name and what made the change -- typing, commit, button, keyboard or reset.


  _emit(type, source) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        text: this.text,
        name: this.name,
        source
      }
    }));
  } // A step by the steppers or the keys: from what is typed, if anything is.


  stepBy(count, source, {
    change = true
  } = {}) {
    if (!this.interactive) return false;
    const next = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.stepFrom)(this.currentValue(), count, this.stepOptions());

    if (next === this.value && this._draft === null) {
      if (change) this.commitChange(source);
      return false;
    }

    return this.writeValue(next, source, {
      change
    });
  } // The typed text, made the value: rounded, clamped, written back.


  commitDraft(source = 'commit') {
    if (this._draft === null) return false;
    const typed = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.parseNumber)(this._draft, this.numberOptions);
    const next = typed === null || !Number.isFinite(typed) ? typed === null ? null : this.value : (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.clamp)((0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.roundTo)(typed, this.precision), this.min, this.max);
    this.writeValue(next, source);
    return true;
  } // ---- Native events of the text box ---------------------------------------
  // The text box's own input and change bubble out as plain Events with no
  // detail -- a second event for each one this sends -- so they stop here, as
  // sf-image-field's and sf-color's do.


  onNativeInput(event) {
    event.stopPropagation();
    const input = event.target;
    this._draft = input.value;
    const typed = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.parseNumber)(this._draft, this.numberOptions);
    const value = typed === null ? null : Number.isFinite(typed) ? (0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.roundTo)(typed, this.precision) : undefined; // Text that is not a number yet («-», «1,») keeps the last value.

    if (value === undefined) return;
    this._value = value;
    this.syncControlState();

    if (value !== this._reportedValue()) {
      this._reported = value;

      this._emit('input', 'typing');
    }

    this.syncInheritedState();
  }

  onNativeChange(event) {
    event.stopPropagation();
    this.commitDraft('commit');
  } // Strict typing: what would leave the box holding text that can never be a
  // number is refused before it lands. A paste is taken whole or not at all.


  onBeforeInput(event) {
    if (!this.interactive) return;
    if (!event.inputType?.startsWith('insert')) return;
    const data = event.data ?? event.dataTransfer?.getData?.('text') ?? '';
    if (!data) return;
    const input = event.target;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const next = input.value.slice(0, start) + data + input.value.slice(end);
    if (!(0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.isEditableText)(next, this.numberOptions)) event.preventDefault();
  }

  onPaste(event) {
    if (!this.interactive) return;
    const text = (event.clipboardData?.getData('text') ?? '').trim();
    const input = event.target;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const next = input.value.slice(0, start) + text + input.value.slice(end);
    if (!text || !(0,_value_mjs__WEBPACK_IMPORTED_MODULE_13__.isEditableText)(next, this.numberOptions)) event.preventDefault();
  } // The spinbutton's keys (WAI-ARIA APG): a step, a page, the bounds. Enter
  // commits what is typed; Escape takes the typing back.


  onKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const keys = {
      ArrowUp: 1,
      ArrowDown: -1
    };

    if (event.key in keys) {
      event.preventDefault();
      this.stepBy(keys[event.key], 'keyboard');
      return;
    }

    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const pages = this.pageStep / this.step;
      this.stepBy(event.key === 'PageUp' ? pages : -pages, 'keyboard');
      return;
    } // Home and End go to the bounds only when there is one; otherwise they
    // stay the caret's keys.


    if (event.key === 'Home' && this.min !== null) {
      event.preventDefault();
      if (this.interactive) this.writeValue(this.min, 'keyboard');
      return;
    }

    if (event.key === 'End' && this.max !== null) {
      event.preventDefault();
      if (this.interactive) this.writeValue(this.max, 'keyboard');
      return;
    }

    if (event.key === 'Enter') {
      this.commitDraft('commit');
      return;
    }

    if (event.key === 'Escape' && this._draft !== null) {
      event.preventDefault();
      event.stopPropagation();
      this._draft = null;
      this._value = this._committedValue();
      this._reported = this._value;
      this.syncInputText(true);
      this.syncControlState();
    }
  } // ---- The steppers ---------------------------------------------------------
  // A pointer press steps at once and repeats while held; the click that
  // follows it is the same press and is left alone. A click with no pointer
  // behind it (Enter or Space on the button, a screen reader's activation,
  // button.click()) steps once.


  onStepPointerDown(event, direction) {
    if (event.button !== 0 || !this.interactive) return;
    if (event.currentTarget.disabled) return;
    this.stopHold();
    this.commitDraft('commit');
    this._hold = {
      direction,
      moved: false,
      timer: 0,
      interval: 0
    };
    this._hold.moved = this.stepBy(direction, 'button', {
      change: false
    });

    if (this.atBound(direction)) {
      this.stopHold();
      return;
    }

    this._hold.timer = setTimeout(() => {
      if (!this._hold) return;
      this._hold.interval = setInterval(() => {
        if (!this._hold) return;
        if (this.stepBy(direction, 'button', {
          change: false
        })) this._hold.moved = true;
        if (this.atBound(direction) || !this.interactive) this.stopHold();
      }, REPEAT_INTERVAL);
    }, REPEAT_DELAY);

    for (const type of ['pointerup', 'pointercancel', 'blur']) {
      globalThis.addEventListener?.(type, this.__sfStopHold, {
        once: true
      });
    }
  } // The button takes no focus from a pointer: the person keeps typing in the
  // box, and a button disabled at a bound has no focus to drop.


  onStepMouseDown(event) {
    event.preventDefault();
  }

  onStepClick(event, direction) {
    event.preventDefault();
    if (event.detail > 0) return;
    this.commitDraft('commit');
    this.stepBy(direction, 'button');
  }

  atBound(direction) {
    return direction > 0 ? this.atMax() : this.atMin();
  } // The end of a hold: one change for the whole run of steps.


  stopHold() {
    const hold = this._hold;
    if (!hold) return;
    this._hold = null;
    clearTimeout(hold.timer);
    clearInterval(hold.interval);

    for (const type of ['pointerup', 'pointercancel', 'blur']) {
      globalThis.removeEventListener?.(type, this.__sfStopHold);
    }

    this.commitChange('button');
  } // ---- Focus look -------------------------------------------------------------
  // The ring follows :focus-visible (standard 1.3.8 §5.3, §16 item 9): the
  // element writes no pointer-focus class. The class component's binder still
  // does, for markup written by hand.
  // ---- Drawing ----------------------------------------------------------------
  // The text box shows the draft while someone types, the value written in the
  // page's format otherwise. Written here, not bound in the template, so a
  // redraw while typing never moves the caret.


  syncInputText(force = false) {
    const input = this.getInputElement();
    if (!input) return;
    if (this._draft !== null && !force) return;
    const text = this._draft ?? this.text;
    if (input.value !== text) input.value = text;
  } // The spinbutton's numbers and the steppers' bounds, without a redraw.


  syncControlState() {
    const input = this.getInputElement();
    const value = this.value;

    if (input) {
      if (value === null) {
        input.removeAttribute('aria-valuenow');
        input.removeAttribute('aria-valuetext');
      } else {
        input.setAttribute('aria-valuenow', String(value));
        input.setAttribute('aria-valuetext', this.text);
      }
    }

    const [minus, plus] = this.querySelectorAll(':scope .sf-quantity-count');
    if (minus) minus.disabled = !this.interactive || this.atMin(value);
    if (plus) plus.disabled = !this.interactive || this.atMax(value); // At a bound, said on the host (§5.3, simai/ui-source#46 item 4).

    this.sfHostState('data-at-min', this.atMin(value));
    this.sfHostState('data-at-max', this.atMax(value));
    const hidden = this.querySelector(':scope .sf-quantity-value');
    if (hidden) hidden.value = this.formValue;
    this.sfSyncFormState();
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this.syncInputText();
    this.syncControlState();
    const input = this.getInputElement();

    if (input !== this._resetControl) {
      this._releaseReset?.();
      this._resetControl = input; // A form reset puts the attribute's value back, without events.

      this._releaseReset = input ? (0,_component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__.bindFormReset)(input, () => {
        this._value = undefined;
        this._draft = null;
        this._reported = undefined;
        this._committed = undefined;
        this.requestComponentUpdate('reset');
      }) : null;
    }

    this.syncInheritedState();
    return undefined;
  }

  onDisconnected() {
    this.stopHold();
    this._releaseReset?.();
    this._releaseReset = null;
    this._resetControl = null;
    super.onDisconnected();
  }

  templateContext() {
    const props = this.getPropsContext();
    const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_3__.createFieldContract)(this, {
      prefix: 'sf-quantity',
      required: this.required,
      invalid: this.invalid,
      hint: this.hint,
      errorMessage: this.errorMessage
    });
    const errorContent = this.hasSlotContent?.('error') ? this.getSlotContent('error') : this.errorMessage;
    const hintContent = this.hasSlotContent?.('hint') ? this.getSlotContent('hint') : this.hint;
    const value = this.value;
    return this.createTemplateContext({ ...props,
      component: this,
      id: field.base,
      field,
      value,
      text: this.text,
      formValue: this.formValue,
      size: this.size,
      // The host is the form control where the browser has ElementInternals:
      // no hidden input then (§17.1 item 6).
      controlName: (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_7__.innerControlName)(this, this.name),
      label: this.label,
      hint: this.hint,
      placeholder: this.placeholder,
      min: this.min,
      max: this.max,
      step: this.step,
      pageStep: this.pageStep,
      precision: this.precision,
      grouping: this.grouping,
      locale: this.locale,
      required: this.required,
      disabled: this.disabled,
      readonly: this.readonly,
      invalid: this.invalid,
      errorMessage: this.errorMessage,
      ariaLabel: this.ariaLabel,
      decrementLabel: this.decrementLabel,
      incrementLabel: this.incrementLabel,
      inheritedValue: this.inheritedValue,
      inheritedText: this.inheritedText,
      resetLabel: this.resetLabel,
      interactive: this.interactive,
      atMin: this.atMin(value),
      atMax: this.atMax(value),
      shownPlaceholder: this.hasInheritedValue ? this.inheritedDisplayValue() : this.placeholder,
      message: field.invalid && errorContent ? errorContent : hintContent,
      messageKind: field.invalid && errorContent ? 'error' : 'hint',
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_8__.renderQuantityTemplate)(this.templateContext());
  }

}

SfQuantity.define('sf-quantity');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "da109711b1a3"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderQuantityTemplate: () => (/* binding */ renderQuantityTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("778671c79fa6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The class component's markup (component/quantity), so its sheet draws the
// field: the root, the label row, the wrap with «−», the box and «+». The
// layout utilities are the ones the class constructor puts on each part from
// quantity.utility.json. The steppers stay size 1/3 icon buttons at every
// field size, as the class draws them; the sheet sizes their glyph to the field.

const LAYOUT = {
  root: 'flex flex-col flex-nowrap justify-start',
  label: 'flex flex-row flex-nowrap justify-start items-start',
  wrap: 'flex flex-row flex-nowrap justify-center items-center',
  count: 'flex flex-row flex-nowrap justify-start items-center',
  input: 'flex'
};
const STEPPER = 'sf-quantity-count sf-icon-button sf-icon-button--secondary sf-icon-button--tonal sf-icon-button--size-1/3';

function renderStepper(context, direction) {
  const {
    component,
    field
  } = context;
  const down = direction < 0;
  const reached = down ? context.atMin : context.atMax; // Out of the tab order, as the APG spinbutton has its buttons: the arrow
  // keys already do what they do, and two more stops per field would make a
  // form of numbers three times as long to cross. Still real buttons, named,
  // reachable by a pointer and a screen reader.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button type="button"
            class="${STEPPER} ${LAYOUT.count}"
            tabindex="-1"
            aria-label=${down ? context.decrementLabel : context.incrementLabel}
            aria-controls=${field.controlId}
            ?disabled=${!context.interactive || reached}
            @pointerdown=${event => component.onStepPointerDown(event, direction)}
            @mousedown=${event => component.onStepMouseDown(event)}
            @click=${event => component.onStepClick(event, direction)}
    ><i class="sf-icon" aria-hidden="true">${down ? 'remove' : 'add'}</i></button>
  `;
}

function renderQuantityTemplate(context) {
  const {
    component,
    field
  } = context;
  const labelId = `${context.id}--label`;
  const rootClasses = ['sf-quantity', `sf-quantity--size-${context.size}`, field.invalid ? 'error' : '', context.rootClass, LAYOUT.root].filter(Boolean);
  const labelContent = component?.hasSlotContent?.('label') ? component.getSlotContent('label') : context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-quantity-text" id=${labelId}>${context.label}</span>${field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-quantity-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}` // No label, no label row: the panel that prints the label beside the
  // field names the control through aria-label instead.
  : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const hasLabel = labelContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const named = Boolean(context.label) && !component?.hasSlotContent?.('label');
  const inheritedSlot = (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__.renderInheritedSlot)(component, {
    size: context.size,
    disabled: !context.interactive
  });
  const value = context.value;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')}
         style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${hasLabel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class="sf-quantity-label ${LAYOUT.label}" for=${field.controlId}>${labelContent}</label>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <span class="sf-quantity-wrap ${LAYOUT.wrap}">
        ${renderStepper(context, -1)}
        <input type="text"
               class=${`${LAYOUT.input}${field.invalid ? ' error' : ''}`}
               id=${field.controlId}
               role="spinbutton"
               inputmode=${context.precision > 0 ? 'decimal' : 'numeric'}
               autocomplete="off"
               spellcheck="false"
               placeholder=${context.shownPlaceholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-labelledby=${named ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-label=${!hasLabel && context.ariaLabel ? context.ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-valuemin=${context.min === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(context.min)}
               aria-valuemax=${context.max === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(context.max)}
               aria-valuenow=${value === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(value)}
               aria-valuetext=${value === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.text}
               aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-describedby=${context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-errormessage=${field.invalid && context.message && context.messageKind === 'error' ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               ?required=${field.required}
               ?disabled=${context.disabled}
               ?readonly=${context.readonly}
               @beforeinput=${event => component.onBeforeInput(event)}
               @paste=${event => component.onPaste(event)}
               @input=${event => component.onNativeInput(event)}
               @change=${event => component.onNativeChange(event)}
               @keydown=${event => component.onKeyDown(event)}
               @blur=${() => component.commitDraft('commit')}>
        ${inheritedSlot}
        ${renderStepper(context, 1)}
      </span>

      ${context.controlName // The form gets the number with a point and no grouping, whatever the
  // box shows; the box itself has no name.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input type="hidden" class="sf-quantity-value" name=${context.controlName} value=${context.formValue} ?disabled=${context.disabled}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      ${context.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-quantity-hint-text-wrap"
                     data-field-message=${context.messageKind}>${context.message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c6c9dfe31af4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

/***/ },

/***/ "26872bd9a5e9"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   formValue: () => (/* binding */ formValue),
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   inferPrecision: () => (/* binding */ inferPrecision),
/* harmony export */   isEditableText: () => (/* binding */ isEditableText),
/* harmony export */   numberSymbols: () => (/* binding */ numberSymbols),
/* harmony export */   parseNumber: () => (/* binding */ parseNumber),
/* harmony export */   readNumber: () => (/* binding */ readNumber),
/* harmony export */   roundTo: () => (/* binding */ roundTo),
/* harmony export */   stepFrom: () => (/* binding */ stepFrom)
/* harmony export */ });
// The parts of sf-quantity that are about numbers, not the page: how typed text
// reads in the page's language, how a value is written back, where a step
// lands and where the bounds hold it. Kept apart from the element so the
// contract tests run them in Node, as sf-image-field's value.mjs is.
//
// The class component (component/quantity) has its own parser, written for
// markup that may carry a mask and a soft typing mode. This one is strict: a
// character that cannot be part of a number is refused as it is typed, and the
// value is a number or nothing -- never the text that happened to be in the box.

const symbolCache = new Map();

// The decimal and group marks of a locale, from the platform's own formatter.
// An unknown locale falls back to en-US rather than throwing.
function numberSymbols(locale) {
  const key = String(locale || '');
  if (symbolCache.has(key)) return symbolCache.get(key);
  let formatter;
  try {
    formatter = new Intl.NumberFormat(key || undefined);
  } catch {
    formatter = new Intl.NumberFormat('en-US');
  }
  const parts = formatter.formatToParts(-12345.6);
  const symbols = {
    group: parts.find((part) => part.type === 'group')?.value || ',',
    decimal: parts.find((part) => part.type === 'decimal')?.value || '.',
    minus: parts.find((part) => part.type === 'minusSign')?.value || '-',
  };
  if (symbolCache.size >= 32) symbolCache.delete(symbolCache.keys().next().value);
  symbolCache.set(key, symbols);
  return symbols;
}

// Digits after the point a step implies: 0.25 has two, 1e-3 three, 5 none.
function inferPrecision(step) {
  const text = String(step ?? '').trim().toLowerCase();
  const number = Number(text);
  if (!text || !Number.isFinite(number) || number <= 0) return 0;
  const [coefficient, exponent = '0'] = text.split('e');
  const fraction = coefficient.split('.')[1]?.length || 0;
  return Math.max(0, fraction - Number(exponent));
}

// A bound or a step from an attribute: a finite number, or null when it is
// empty or not a number. Written the programmer's way, with a point.
function readNumber(raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const text = String(raw).trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function clamp(value, min, max) {
  let next = value;
  if (min !== null && Number.isFinite(min)) next = Math.max(next, min);
  if (max !== null && Number.isFinite(max)) next = Math.min(next, max);
  return next;
}

// Rounded to the digits the field shows, so 0.1 + 0.2 is 0.3 and a value never
// carries more than it can draw.
function roundTo(value, precision) {
  const digits = Math.min(20, Math.max(0, Number(precision) || 0));
  const scale = 10 ** digits;
  const scaled = Math.round(value * scale) / scale;
  return Object.is(scaled, -0) ? 0 : scaled;
}

// Typed text, normalised: the locale's own minus, its group marks and the
// spaces people type between thousands go; the locale's decimal mark, and the
// other of «.» and «,» when the locale does not group with it, become a point.
function normalise(text, locale) {
  const {group, decimal, minus} = numberSymbols(locale);
  let value = String(text ?? '').replace(/[\u061c\u200e\u200f]/gu, '');
  value = value.split(minus).join('-').replace(/[\s\u00a0\u202f]/gu, '');
  const groupMark = group.replace(/[\s\u00a0\u202f]/gu, '');
  if (groupMark && groupMark !== decimal) value = value.split(groupMark).join('');
  value = value.split(decimal).join('.');
  // The other mark of the two is a decimal too, unless the locale groups with it
  // (then it is gone already): a point typed on a Russian page is a comma.
  if (decimal !== ',' && groupMark !== ',') value = value.split(',').join('.');
  return value;
}

function pattern({allowDecimal, allowNegative}) {
  const sign = allowNegative ? '-?' : '';
  return allowDecimal ? new RegExp(`^${sign}\\d*(?:\\.\\d*)?$`, 'u') : new RegExp(`^${sign}\\d*$`, 'u');
}

// Whether text can still become a number as the person goes on typing: «-»,
// «1,» and an empty box can, «1,2,3» and «12a» cannot. The strict typing rule.
function isEditableText(text, {locale, allowDecimal = false, allowNegative = false} = {}) {
  return pattern({allowDecimal, allowNegative}).test(normalise(text, locale));
}

// The number typed text says: null for an empty box, NaN for text that is not
// a whole number yet («-», «.») or not a number at all.
function parseNumber(text, {locale, allowDecimal = false, allowNegative = false} = {}) {
  const value = normalise(text, locale);
  if (value === '') return null;
  if (!pattern({allowDecimal, allowNegative}).test(value) || !/\d/u.test(value)) return Number.NaN;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

// A value as the page's language writes it, with the field's digits.
function formatNumber(value, {locale, precision = 0, grouping = true} = {}) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '';
  const digits = Math.min(20, Math.max(0, Number(precision) || 0));
  try {
    return new Intl.NumberFormat(locale || undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      useGrouping: grouping,
    }).format(value);
  } catch {
    return value.toFixed(digits);
  }
}

// The value as a form submits it: a point, no grouping, the field's digits.
function formValue(value, precision = 0) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '';
  return roundTo(value, precision).toFixed(Math.min(20, Math.max(0, Number(precision) || 0)));
}

// Where `count` steps from the current value land (negative counts go down).
// An empty field counts from zero; when zero is outside the bounds, the first
// step lands on the nearer bound instead: «+» on an empty field with min 1
// gives 1, not 2.
function stepFrom(current, count, {step = 1, min = null, max = null, precision = 0} = {}) {
  const size = Number.isFinite(step) && step > 0 ? step : 1;
  if (current === null || current === undefined || !Number.isFinite(current)) {
    const start = clamp(0, min, max);
    return roundTo(start === 0 ? clamp(size * count, min, max) : start, precision);
  }
  return roundTo(clamp(current + size * count, min, max), precision);
}


/***/ },

/***/ "bbc57add6c29"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-quantity for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-quantity","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-quantity","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"error","to":"invalid","kind":"setting","section":"§17.2","note":"error is a dated alias of invalid; the shim maps the attribute and the property","component":"sf-quantity","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"sf-field:reset","to":"sf-field-reset","kind":"event","component":"sf-quantity","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, §20.2","note":"the event of the trait field-inherit@1; the trait code still sends the old name, the shim sends sf-field-reset first"}]}');

/***/ },

/***/ "96dc2481e417"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-quantity\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/quantity (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.quantity","tag":"sf-quantity","version":"1.1.1","kind":"leaf","family":"field","traits":["field-inherit@1"],"settings":{"name":{"type":"string","default":""},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"placeholder":{"type":"string","default":""},"min":{"type":"number","nullable":true},"max":{"type":"number","nullable":true},"step":{"type":"number","default":1},"page-step":{"type":"number","nullable":true},"precision":{"type":"number","integer":true,"min":0,"max":20,"nullable":true},"grouping":{"type":"boolean","default":true},"locale":{"type":"string","default":""},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"decrement-label":{"type":"string","default-from":"runtime.decrement"},"increment-label":{"type":"string","default-from":"runtime.increment"}},"values":{"value":{"type":"number","nullable":true}},"events":{"change":{"carries":"native","x-detail":{"value":{"type":"number","nullable":true},"text":"string","name":"string","source":{"type":"enum","values":["typing","commit","button","keyboard","reset"]}},"$comment":"Sent on the host as `change` with a detail: once per commit (Enter, leaving the box, a stepper press or a held run, a key) and for a reset to the inherited value (§17.3)."},"input":{"carries":"native","x-detail":{"value":{"type":"number","nullable":true},"text":"string","name":"string","source":{"type":"enum","values":["typing","commit","button","keyboard","reset"]}},"$comment":"Sent on the host as `input` with a detail each time the number moves; the text box\'s own input and change stop at the host."}},"actions":{"clear":{"x-outcomes":["applied","refused"]},"step-up":{"with":{"count":{"type":"number","optional":true}},"x-outcomes":["applied","refused"]},"step-down":{"with":{"count":{"type":"number","optional":true}},"x-outcomes":["applied","refused"]},"set-error":{"with":{"message":{"type":"string"}},"x-outcomes":["applied"]}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","range-underflow","range-overflow","step-mismatch","custom-error"]},"keyboard":{"host":{"Tab":"reach","ArrowUp":"step:+1","ArrowDown":"step:-1","PageUp":"step:+page","PageDown":"step:-page","Home":"to:min","End":"to:max","Enter":"commit","Escape":"revert"}},"templates":{"default":{"file":"js/templates/default.js","$comment":"The Lit template in JavaScript, the migration form of §5.2 (§16): the build does not compile template.html yet, so a second copy of the markup would only drift from the one that draws."}},"examples":"examples.json","docs":"docs.md","lang":"lang/","accessibility":{"role":"spinbutton","name":{"from":["label","slot:label","aria-label"]},"keys":{"Tab":"reach","ArrowUp":"step:+1","ArrowDown":"step:-1","PageUp":"step:+page","PageDown":"step:-page","Home":"to:min","End":"to:max","Enter":"commit","Escape":"revert"}},"host-states":{"data-at-min":"boolean","data-at-max":"boolean","data-inherited":"boolean"},"css-variables":{"--sf-quantity-background-color":{"type":"color","state":"default"},"--sf-quantity-border-color":{"type":"color","state":"default"},"--sf-quantity-border-width":{"type":"length","state":"default"},"--sf-quantity-radius":{"type":"length","state":"default"},"--sf-quantity-color":{"type":"color","state":"default"},"--sf-quantity-padding-inline":{"type":"length","state":"default"},"--sf-quantity-padding-block":{"type":"length","state":"default"},"--sf-quantity-gap":{"type":"length","state":"default"},"--sf-quantity-stepper-radius":{"type":"length","state":"default"},"--sf-quantity-invalid-border-color":{"type":"color","state":"invalid"}},"x-summary":"A number field with «−» and «+»: a WAI-ARIA spinbutton with bounds, a step and digits, strict typing in the page\'s language, ArrowUp/ArrowDown, PageUp/PageDown and Home/End, a held stepper repeats; label, help, error, required, disabled, read-only, the three field sizes and the inherited value as every field has them.","x-source":{"package":"framework","folder":"quantity","manifest":"simai/ui-source@5100227 src/smart/quantity/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/quantity.component.json"},"x-words":["label","hint","placeholder","decrement-label","increment-label"],"x-target":{"replaced":{"settings":["min","max","step"],"values":["value"],"events":["change"]}},"x-renamed":["settings.aria-label: a host attribute, read by the base, never a setting (§3.1)"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children","typed and pasted text"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"host","effects":"component","forbidden_client_responsibilities":["backend access decisions","validation beyond the bounds, the step and the digits"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile","ltr","rtl"]},"ai_guidance":{"use_when":"Use sf-quantity for a form value that is a number a person adjusts by steps -- an amount, a count, an integer property -- with bounds and digits.","do_not":["Do not copy generated ui-smart code","Do not use it for a range picked by dragging: that is sf-range-slider","Do not read the box\'s text as the value: read value (a number or null) or the submitted form value"],"required_reads":["inputs","events","methods","accessibility","provenance"],"minimal_example":"<sf-quantity label=\\"Количество\\" name=\\"count\\" value=\\"2\\" min=\\"0\\" max=\\"99\\"></sf-quantity>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["number-type: page-step and precision are numbers with nullable (no number = the default: ten steps, the step\'s digits); precision is an integer 0..20, as the code clamps.","trait-words: the field-inherit@1 words stay in lang x-trait-words beside the component words, as the sf-switch pilot keeps them; the running words are helpers/inherited-value.js INHERITED_TEXT until the trait has its own folder (Annex A item 13 is open).","trait field-inherit@1: host state data-inherited (§5.3, §20.2) and the trait event sf-field-reset with sf-field:reset as its dated same-detail alias (aliases.json), as the sf-switch pilot; an inherited value never satisfies required (§20.2).","template: templates.default names the Lit template js/templates/default.js, the migration form §5.2 allows; no template.html until the build compiles one (a copy nothing draws would drift).","examples: examples.json from studio.fixture.json (count 2 of 0..99) plus a price with two digits, a bound reached, invalid with a message, disabled, read-only, inherited and size 2.","css-variables: the nine public variables of public-variables.v1.json plus --sf-quantity-invalid-border-color for the invalid state: ten (§6).","host-states: data-at-min and data-at-max say on the host that the value stands at a bound (§5.3, simai/ui-source#46 item 4), beside the trait\'s data-inherited.","events: input and change keep their native names and carry a detail {value, text, name, source}; the manifest says carries native (the DOM name) and x-detail (the fields), since a declared carries object would derive sf-quantity-input (§8).","actions: clear, step-up, step-down and the new set-error {message} answer an outcome (§4.4: chaining is not part of the interface; they returned the element). set-error now also sets custom-error, so the form does not submit over it (§17.2; it used to paint only, stand 15 A2).","form.validity: value-missing from the box, range-underflow, range-overflow and step-mismatch read off the value (a person may type past a bound until the commit clamps it), and custom-error.","form: the host submits the number with a point through ElementInternals; the hidden input is not drawn then and the box has no name (§17.1 items 2, 6).","focus: the pointer-focus class is no longer written by the element; the ring follows :focus-visible (§5.3, §16 item 9). The class component\'s binder still writes it for hand-written markup.","words: decrement and increment are lang runtime words (settings default-from them); range-underflow, range-overflow and step-mismatch are new runtime words for the validity message.","version 1.1.0: set-error and the host states are added members, error is renamed behind a dated alias (§4.10).","version 1.1.1: the first-paint snapshots are retaken: the JSON island is printed once (no held copy), the icon font\'s state (sf-icon loaded, sf-icon-loaded) is left out, a closed surface prints closed and a size or place the code measured (a non-zero px width, height, inset, clip or transform) is left out, so a snapshot is the same on every run."]}');

/***/ },

/***/ "d2d1bec40650"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Quantity","runtime":{"decrement":"Decrease value","increment":"Increase value","range-underflow":"The value must be at least {min}","range-overflow":"The value must be at most {max}","step-mismatch":"The value must be a multiple of {step}"},"x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"inherited","reset":"Reset to inherited","described":"Inherited: {value}"}}}');

/***/ },

/***/ "de73e1d806c6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Количество","runtime":{"decrement":"Уменьшить значение","increment":"Увеличить значение","range-underflow":"Значение должно быть не меньше {min}","range-overflow":"Значение должно быть не больше {max}","step-mismatch":"Значение должно быть кратно {step}"},"x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"наследуется","reset":"Сбросить к наследуемому","described":"Наследуется: {value}"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("9b9874fb7905");
/******/
/******/ })()
;