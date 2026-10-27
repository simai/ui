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
  const generatedProps = propsFromManifest(manifest);
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
      super.connectedCallback(); // A leaf outside an assembly starts with the page (§7.2.1 `now`).

      this.toggleAttribute('data-sf-started', true);
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

/***/ "3ee997e7a076"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfImageField: () => (/* binding */ SfImageField)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("695f21e50358");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("4a9754c1c12d");
/* harmony import */ var _value_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("c22743d41d10");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("dc26a735709e");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("fc6dfddd4b04");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("b06ddaec70c1");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("7e6798b6eac7");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("83b84a25c0f9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);
// sf-image-field: a form field that holds one image (simai/ui-source#27). It
// shows the image as a thumbnail with its file name and size, offers
// «Заменить…» and «Убрать», and takes a file dropped anywhere on it -- the image
// well a page editor, a brand logo or an admin media field needs. ui-mail's
// polish audit (2026-10-22, B1) found the only part the Framework had for it was
// sf-file-upload, which is a drop zone with a list of transfers: after a choice
// it kept its whole zone, showed no image and had no way to replace one.
//
// It does what sf-file-upload does with a file and no more: it raises the File
// the person chose, in the events, and transfers no bytes. The host uploads it
// and writes back the stored value, with the address the image now has. Until
// then the thumbnail shows the chosen file from an object URL, so the person
// sees what they picked at once rather than after a round trip.
//
// The field half -- label, help text, error, required, disabled, read-only --
// is the one every Framework field has (component/field-contract.js), so the
// field reads, sizes and announces itself as sf-input and sf-textarea do.













 // Every word this component says is lang/<locale>.json runtime (standard
// 1.3.8 §11). `quoted` wraps a file name the way the language quotes: «…» in
// Russian, “…” in English.

const WORD_KEYS = Object.keys(_lang_en_json__WEBPACK_IMPORTED_MODULE_11__.runtime);

const camel = key => key.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());

const kebab = key => key.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);

const DEFAULT_ACCEPT = 'image/*'; // sf-image-field from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4, §8, §16.20, §17.1, §17.2): the settings are attributes
// and properties made by core/js/element-manifest.js, the actions answer an
// outcome, the events have their vocabulary names (the shim sends the colon
// names after them), and the host is the form control through
// ElementInternals.

const ImageFieldElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_11__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_12__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__,
  actions: {
    // Opens the platform's file dialog, as «Заменить…» and «Выбрать…» do.
    choose() {
      if (!this.interactive) return 'inactive';
      const input = this.input();
      if (!input) return 'not-drawn';
      input.click();
      return 'applied';
    },

    'take-file'({
      file,
      source = 'input'
    } = {}) {
      return this._takeFile(file, source || 'input');
    },

    'remove-image'() {
      return this._removeImage();
    },

    clear() {
      if (!this.value) return 'unchanged';
      this.setValue(null);
      return 'applied';
    },

    // §17.2: the message shows in place of the hint and the form does not
    // submit until it is cleared. It is the error-message and invalid
    // attributes, which is what a host writing them by hand gets too.
    'set-error'({
      message = ''
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
      return 'applied';
    }

  }
});

class SfImageField extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_6__.FormField)(ImageFieldElement) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // The value is an object (§4.2); its attribute -- an address, or the
      // shape as JSON -- stays as the field had it.
      value: {
        default: ''
      },
      size: {
        default: '1',
        values: _component_field_size__WEBPACK_IMPORTED_MODULE_5__.FIELD_SIZES
      },
      // The group's name when no label is drawn: a field renderer's panel
      // prints the label beside the field, and a second, visible one inside it
      // would say it twice (the rule tests/field-control-accessible-name holds
      // for sf-input, sf-switch and the rest).
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super(); // undefined: follow the attribute. Set by the property, a chosen file or a
    // removal; an attribute written later takes over again.

    this._value = undefined; // A value set as a property before the element was defined -- a lit
    // `.value` binding on a tag the loader had not upgraded yet, which is how
    // the field renderers draw it -- is an own property that would hide the
    // accessor for good and skip the normalising. It is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      const early = this.value;
      delete this.value;
      this._value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseImageValue)(early);
    }

    this._objectUrl = '';
    this._dimensions = new Map();
    this._failed = new Set();
    this.dragging = false;
    this.announcement = '';
    this._focusAfterRender = '';
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'value' && previous !== next && !this._writingValue) {
      this._value = undefined;

      this._releaseObjectUrl();
    }

    super.attributeChangedCallback(name, previous, next);
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_5__.fieldSize)(this.getAttribute('size') || '1', 'sf-image-field');
  }

  get accept() {
    return this.hasAttribute('accept') ? this.getAttribute('accept') || '' : DEFAULT_ACCEPT;
  }

  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // The ids the template writes come from the instance path (§7.1.1), never
  // from a counter.


  get _id() {
    return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__.instancePath)(this, {
      kind: 'sf-image-field'
    }));
  } // The image the field holds, in the file shape, or null when it is empty.


  get value() {
    if (this._value !== undefined) return this._value;
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseImageValue)(this.getAttribute('value'));
  } // Set from code, the value is not a change: no event, as for a native field.


  set value(next) {
    this.setValue(next);
  }

  setValue(next) {
    const value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseImageValue)(next);
    if (value?.href !== this._objectUrl) this._releaseObjectUrl();
    this._value = value;
    this.requestComponentUpdate('value');
    this.sfSyncFormState();
    return this;
  } // What the form gets (§17.1): the File the person chose, or the stored
  // image's id (else its address); nothing while empty or disabled. Read-only
  // still submits.


  sfFormValue() {
    if (this.disabled) return null;
    const value = this.value;
    if (!value) return null;
    if (value.file && typeof File === 'function' && value.file instanceof File) return value.file;
    return String(value.value || value.href || '') || null;
  }

  fieldValidity() {
    return {
      valueMissing: this.required && !this.disabled && !this.value,
      message: this.sfWord('value-missing'),
      anchor: this.focusDelegate()
    };
  } // form.reset(): back to the image the field was written with, without
  // events (§17.1 item 4).


  fieldReset() {
    this._releaseObjectUrl();

    this._value = undefined;
    const input = this.input();
    if (input) input.value = '';
    this.requestComponentUpdate('value');
  }

  get interactive() {
    return !this.disabled && !this.readonly;
  }

  text(key) {
    return this.sfWord(kebab(key));
  }

  quote(name) {
    return this.text('quoted').replace('%s', name);
  } // A size as people read it, in the page's language: «2 КБ», «1,4 МБ». Text
  // the host already formatted is shown as it came.


  formatSize(size) {
    const units = ['bytes', 'kilobytes', 'megabytes', 'gigabytes'].map(key => this.text(key));
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_8__.formatFileSize)(size, units, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageLocale)(this));
  } // «450×300 · 2 КБ»: the image's own dimensions once it has loaded, then its
  // size. The host's `meta` replaces the line when it knows better.


  metaText(value) {
    if (this.meta) return this.meta;
    if (!value) return '';
    const dimensions = value.href ? this._dimensions.get(value.href) : null;
    return [dimensions ? `${dimensions.width}×${dimensions.height}` : '', this.formatSize(value.size)].filter(Boolean).join(' · ');
  }

  input() {
    return this.querySelector(':scope .sf-image-field-input');
  }

  focusDelegate() {
    return this.querySelector(':scope .sf-image-field-actions button:not([disabled])');
  } // The person chose a file: from the dialog (source input) or by dropping it
  // (source drop). The thumbnail shows it at once from an object URL; the host
  // hears of it in input, change and attach (sf-image-field:select after it),
  // each carrying the File, and uploads it. The action take-file answers
  // its outcome (§4.4).


  _takeFile(file, source = 'input') {
    if (!file) return 'no-file';
    if (!this.interactive) return 'inactive';

    if (!(0,_value_mjs__WEBPACK_IMPORTED_MODULE_8__.acceptsFile)(this.accept, file)) {
      this.reject([file], source);
      return 'rejected';
    }

    this._releaseObjectUrl();

    let href = '';

    try {
      href = URL.createObjectURL(file);
      this._objectUrl = href;
    } catch {
      href = '';
    }

    const value = {
      value: '',
      label: file.name,
      mime: file.type || '',
      size: file.size,
      href,
      file
    };
    this._value = value;
    this.announce(`${this.text('chosen')} ${this.quote(file.name)}`);
    this.requestComponentUpdate('value');

    this._emitValue({
      value,
      file,
      source
    });

    this.sfEmit('attach', {
      files: [file],
      file,
      source,
      value,
      name: this.name
    });
    return 'applied';
  } // The person removed the image. Focus goes to «Выбрать…», which is where the
  // removed button stood, so the keyboard does not fall back to the page. Not
  // called remove(): that is the element's own removal from the document.


  _removeImage() {
    const previous = this.value;
    if (!previous) return 'empty';
    if (!this.interactive) return 'inactive';

    this._releaseObjectUrl();

    this._value = null;
    const input = this.input();
    if (input) input.value = '';
    this._focusAfterRender = 'choose';
    this.announce(this.text('removed'));
    this.requestComponentUpdate('value');

    this._emitValue({
      value: null,
      file: null,
      source: 'remove'
    });

    this.sfEmit('detach', {
      value: previous,
      name: this.name
    });
    return 'applied';
  }

  reject(files, source) {
    const names = files.map(file => this.quote(file.name)).join(', ');
    this.announce(`${this.text('rejected')}: ${names}`);
    this.sfEmit('rejected', {
      files,
      accept: this.accept,
      source
    });
  } // Said in the polite status, as sf-help-mark and sf-copy-button say theirs.
  // Cleared first, so the same words twice are heard twice.


  announce(message) {
    this.announcement = '';
    this.requestComponentUpdate('announce-clear');
    clearTimeout(this._announceTimer);
    this._announceTimer = setTimeout(() => {
      this.announcement = message;
      this.requestComponentUpdate('announce');
    }, 50);
  } // `input` and `change` once each per choice or removal, as a native file
  // input sends them, on the host with the value, the File and the form name.


  _emitValue({
    value,
    file,
    source
  }) {
    this.sfSyncFormState();

    for (const type of ['input', 'change']) this.sfEmit(type, {
      value,
      file,
      source,
      name: this.name
    });
  }

  _releaseObjectUrl() {
    if (!this._objectUrl) return;

    try {
      URL.revokeObjectURL(this._objectUrl);
    } catch {// Nothing to release.
    }

    this._dimensions.delete(this._objectUrl);

    this._objectUrl = '';
  } // The dialog's own change. It also bubbles out of the host as a plain Event
  // with no detail -- a second change for the one this dispatches -- so it
  // stops here, as sf-color's does.


  onInputChange(event) {
    event.stopPropagation();
    const file = event.target?.files?.[0];
    if (file) this._takeFile(file, 'input');
  }

  onInputEvent(event) {
    event.stopPropagation();
  } // A file held over the field: the whole field is the target, and says so --
  // the border and fill of a selection and the words «Отпустите файл…». Only a
  // drag that carries files is taken, so text dragged across a form is not.


  onDragOver(event) {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) return;
    event.preventDefault();

    if (!this.interactive) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    event.dataTransfer.dropEffect = 'copy';

    if (!this.dragging) {
      this.dragging = true;
      this.sfHostState('data-dragged-over', true);
      this.requestComponentUpdate('drag');
    }
  }

  onDragLeave(event) {
    const well = event.currentTarget;
    if (event.relatedTarget && well.contains(event.relatedTarget)) return;
    if (!this.dragging) return;
    this.dragging = false;
    this.sfHostState('data-dragged-over', false);
    this.requestComponentUpdate('drag');
  }

  onDrop(event) {
    const types = Array.from(event.dataTransfer?.types || []);
    const files = Array.from(event.dataTransfer?.files || []);
    if (!files.length && !types.includes('Files')) return;
    event.preventDefault();

    if (this.dragging) {
      this.dragging = false;
      this.sfHostState('data-dragged-over', false);
      this.requestComponentUpdate('drag');
    }

    if (!this.interactive || !files.length) return; // One image: the first file the field accepts. The rest are reported, as
    // sf-file-upload reports a drop the accept list leaves out.

    const accepted = files.find(file => (0,_value_mjs__WEBPACK_IMPORTED_MODULE_8__.acceptsFile)(this.accept, file));
    const rejected = files.filter(file => !(0,_value_mjs__WEBPACK_IMPORTED_MODULE_8__.acceptsFile)(this.accept, file));
    if (rejected.length) this.reject(rejected, 'drop');
    if (!accepted) return; // The native input holds the dropped file too, so a form that submits
    // this field sends it under `name` as it sends a picked one.

    const input = this.input();

    if (input && typeof DataTransfer === 'function') {
      try {
        const transfer = new DataTransfer();
        transfer.items.add(accepted);
        input.files = transfer.files;
      } catch {// A browser without a settable FileList still raises the File.
      }
    }

    this._takeFile(accepted, 'drop');
  }

  onImageLoad(event, href) {
    const image = event.target;
    if (!href || !image?.naturalWidth) return;

    const known = this._dimensions.get(href);

    if (known && known.width === image.naturalWidth && known.height === image.naturalHeight) return;

    this._dimensions.set(href, {
      width: image.naturalWidth,
      height: image.naturalHeight
    });

    this.requestComponentUpdate('dimensions');
  }

  onImageError(href) {
    if (!href || this._failed.has(href)) return;

    this._failed.add(href);

    this.requestComponentUpdate('image-error');
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);

    if (this._focusAfterRender) {
      this._focusAfterRender = ''; // The sf-button host, not its inner button: a button drawn in this
      // render has not drawn its own yet, and the host's focus() waits for it.

      this.querySelector(':scope .sf-image-field-actions sf-button:not([disabled])')?.focus({
        preventScroll: true
      });
    }

    this.sfSyncFormState();
    return undefined;
  }

  onDisconnected() {
    clearTimeout(this._announceTimer);
  }

  templateContext() {
    const props = this.getPropsContext();
    const value = this.value;
    const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_4__.createFieldContract)(this, {
      prefix: 'sf-image-field',
      required: this.required,
      // error is a dated alias of invalid (§17.2, aliases.json).
      invalid: this.invalid || this.hasAttribute('error'),
      hint: this.hint,
      errorMessage: this.errorMessage
    });
    const errorContent = this.hasSlotContent?.('error') ? this.getSlotContent('error') : this.errorMessage;
    const hintContent = this.hasSlotContent?.('hint') ? this.getSlotContent('hint') : this.hint;
    const fileName = value?.label || '';
    const words = Object.fromEntries(WORD_KEYS.map(key => [camel(key), this.sfWord(key)]));
    return this.createTemplateContext({ ...props,
      component: this,
      id: this._id,
      field,
      value,
      size: this.size,
      accept: this.accept,
      fileName,
      metaText: this.metaText(value),
      broken: Boolean(value?.href && this._failed.has(value.href)),
      dragging: this.dragging && this.interactive,
      interactive: this.interactive,
      announcement: this.announcement,
      message: field.invalid && errorContent ? errorContent : hintContent,
      messageKind: field.invalid && errorContent ? 'error' : 'hint',
      words,
      names: {
        group: this.label || this.ariaLabel || words.group,
        choose: words.chooseName,
        replace: fileName ? `${words.replaceName} ${this.quote(fileName)}` : words.replaceName,
        remove: fileName ? `${words.removeName} ${this.quote(fileName)}` : words.removeName
      },
      rootClass: this.getRootClass(),
      // The host is the form control where the browser has ElementInternals,
      // so the native file input carries no name (§17.1 item 6).
      controlName: this.sfInternals ? '' : this.name
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderImageFieldTemplate)(this.templateContext());
  }

}

SfImageField.define('sf-image-field');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4a9754c1c12d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderImageFieldTemplate: () => (/* binding */ renderImageFieldTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The buttons are one rung below the field, as a field's own trailing controls
// are: a size 1 field (a 40px control row) carries size 1/2 buttons.

const BUTTON_SIZE = {
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
}; // What stands in the thumbnail when there is no picture to show: an invitation
// while the field is empty, a broken image when the address did not load, and
// a plain image glyph for a value the host gave without an address.

function thumbIcon(context) {
  if (!context.value) return 'add_photo_alternate';
  if (context.broken) return 'broken_image';
  return 'image';
}

function renderThumb(context) {
  const {
    value,
    component
  } = context;
  const href = value?.href || '';

  if (href && !context.broken) {
    // The image is fitted, never stretched or cropped: a logo 900×300 stays a
    // logo. alt is the file's name, the one thing the field knows about it.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-image-field-image" src=${href} alt=${context.fileName}
                     @load=${event => component.onImageLoad(event, href)}
                     @error=${() => component.onImageError(href)}>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${thumbIcon(context)}</i>`;
}

function renderActions(context) {
  const {
    component,
    value,
    words,
    names,
    field
  } = context;
  if (context.readonly) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const size = BUTTON_SIZE[context.size] ?? '1/2';
  const describedBy = context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Real buttons with names that say what they act on: «Заменить изображение
  // «logo.png»», each beginning with its visible words so a voice command
  // naming what is seen still reaches it.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-image-field-actions">
      ${value ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button class="sf-image-field-replace" size=${size} appearance="outline" scheme="on-surface"
                     text=${words.replace} aria-label=${names.replace} aria-describedby=${describedBy}
                     ?disabled=${context.disabled}
                     @click=${() => component.choose()}></sf-button>
          <sf-button class="sf-image-field-remove" size=${size} appearance="link" scheme="on-surface"
                     text=${words.remove} aria-label=${names.remove}
                     ?disabled=${context.disabled}
                     @click=${() => component.removeImage()}></sf-button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button class="sf-image-field-choose" size=${size} appearance="outline" scheme="on-surface"
                     text=${words.choose} aria-label=${names.choose} aria-describedby=${describedBy}
                     ?disabled=${context.disabled}
                     @click=${() => component.choose()}></sf-button>`}
    </span>
  `;
}

function renderImageFieldTemplate(context) {
  const {
    component,
    field,
    value,
    words
  } = context;
  const labelId = `${context.id}-label`;
  const rootClasses = ['sf-image-field', `sf-image-field--size-${context.size}`, value ? 'sf-image-field--filled' : 'sf-image-field--empty', field.invalid ? 'error' : '', context.dragging ? 'dragover' : '', context.disabled ? 'disabled' : '', context.readonly ? 'readonly' : '', context.rootClass].filter(Boolean);
  const title = context.dragging ? words.drop : value ? context.fileName || words.group : context.emptyText || words.empty;
  const meta = context.dragging ? '' : value ? context.metaText : context.interactive ? words.emptyHint : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span class="sf-image-field-label" id=${labelId}>
            <span class="sf-image-field-label-text">${context.label}</span>
            ${field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-required">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <div class="sf-image-field-well"
           role="group"
           aria-labelledby=${context.label ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           aria-label=${context.label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.names.group}
           aria-describedby=${context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           @dragenter=${event => component.onDragOver(event)}
           @dragover=${event => component.onDragOver(event)}
           @dragleave=${event => component.onDragLeave(event)}
           @drop=${event => component.onDrop(event)}>
        <span class="sf-image-field-thumb">${renderThumb(context)}</span>
        <span class="sf-image-field-body">
          <span class="sf-image-field-name">${title}</span>
          ${meta ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-meta">${meta}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>
        ${renderActions(context)}
      </div>

      <input type="file"
             class="sf-image-field-input"
             id=${field.controlId}
             name=${context.controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             accept=${context.accept || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             tabindex="-1"
             aria-hidden="true"
             ?required=${field.required && !value}
             ?disabled=${context.disabled || context.readonly}
             @change=${event => component.onInputChange(event)}
             @input=${event => component.onInputEvent(event)}>

      ${context.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-image-field-message"
                     data-field-message=${context.messageKind}>${context.message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <span class="sf-image-field-live" role="status" aria-live="polite" aria-atomic="true">${context.announcement}</span>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "83b84a25c0f9"
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

/***/ "c22743d41d10"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   acceptsFile: () => (/* binding */ acceptsFile),
/* harmony export */   formatFileSize: () => (/* binding */ formatFileSize),
/* harmony export */   normaliseImageValue: () => (/* binding */ normaliseImageValue)
/* harmony export */ });
// The parts of sf-image-field that are about data, not the page: which files
// the field accepts, the shape its value takes and how a size reads. Kept
// apart from the element so the contract tests can run them in Node, as
// sf-resizer's engine.mjs is.

// Whether a file is one the accept list names: `.ext`, `type/*` or `type/sub`,
// as the platform dialog reads it. The dialog filters what a person may pick;
// a drop goes past it and would take any file at all. It is the rule
// sf-file-upload applies to a drop, written again here rather than imported:
// that module binds every .sf-file-upload on the page as it loads, which a
// page with only an image field has no use for.
function acceptsFile(accept, file) {
  const tokens = String(accept || '').split(',').map((token) => token.trim().toLowerCase()).filter(Boolean);
  if (!tokens.length) return true;
  const name = String(file?.name || '').toLowerCase();
  const type = String(file?.type || '').toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

function nameFromAddress(href) {
  const tail = String(href).split(/[?#]/u)[0].split('/').pop() || '';
  try {
    return decodeURIComponent(tail);
  } catch {
    return tail;
  }
}

// The value is the file shape the Framework already uses for a stored file --
// the property-view `file` type and the field renderers' file cell:
// {value, label, mime, size, href}. `value` is the host's id for the file,
// `label` its name, `size` bytes (a number) or text the host already
// formatted, `href` the address the image is shown from. A string is taken as
// the address alone, which is what a page with nothing but a URL has; JSON in
// the attribute is the whole shape. Anything else is no image: null.
function normaliseImageValue(input) {
  if (input === null || input === undefined || input === '') return null;
  let source = input;
  if (typeof source === 'string') {
    const text = source.trim();
    if (!text) return null;
    if (text.startsWith('{')) {
      try {
        source = JSON.parse(text);
      } catch {
        return null;
      }
    } else {
      source = {href: text};
    }
  }
  if (typeof source !== 'object' || Array.isArray(source)) return null;
  const href = source.href ? String(source.href) : '';
  const label = String(source.label ?? source.name ?? (href ? nameFromAddress(href) : ''));
  const id = source.value === undefined || source.value === null ? '' : String(source.value);
  if (!href && !label && !id) return null;
  const value = {
    value: id,
    label,
    mime: String(source.mime ?? source.mimeType ?? ''),
    size: typeof source.size === 'number' ? source.size : String(source.size ?? ''),
    href,
  };
  // A file chosen in this page and not stored yet carries the File itself.
  if (source.file) value.file = source.file;
  return value;
}

// A size as people read it: «2 КБ», «1,4 МБ». `units` are the four words in
// the page's language, `locale` its formatting. Text the host already
// formatted is returned as it came; anything that is not a size is ''.
function formatFileSize(size, units = ['B', 'KB', 'MB', 'GB'], locale = 'en') {
  if (typeof size === 'string') return size;
  const bytes = Number(size);
  if (size === null || size === undefined || !Number.isFinite(bytes) || bytes < 0) return '';
  let amount = bytes;
  let index = 0;
  while (amount >= 1024 && index < units.length - 1) {
    amount /= 1024;
    index += 1;
  }
  const digits = index === 0 || amount >= 10 ? 0 : 1;
  let number;
  try {
    number = new Intl.NumberFormat(locale, {maximumFractionDigits: digits}).format(amount);
  } catch {
    number = amount.toFixed(digits);
  }
  return `${number} ${units[index]}`;
}


/***/ },

/***/ "fc6dfddd4b04"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-image-field","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-image-field","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-image-field:select","to":"sf-image-field-attach","kind":"event","component":"sf-image-field","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"the detail keeps file, source, value and name and adds files: the old fields are all there"},{"from":"sf-image-field:remove","to":"sf-image-field-detach","kind":"event","component":"sf-image-field","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"same detail"},{"from":"sf-image-field:reject","to":"sf-image-field-rejected","kind":"event","component":"sf-image-field","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"same detail"},{"from":"error","to":"invalid","kind":"setting","component":"sf-image-field","since":"2026-10-27","remove_after":"2026-12-01","section":"§17.2","note":"error is a dated alias of invalid; the attribute and the property write invalid"}]}');

/***/ },

/***/ "dc26a735709e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-image-field\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/image-field (migration/convert-1.3.8.mjs from simai/ui-source@5100227 src/smart/image-field/smart.manifest.json); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Its x-todo are decided in x-decisions.","id":"smart.image-field","tag":"sf-image-field","version":"1.1.0","kind":"leaf","family":"field","settings":{"name":{"type":"string","default":""},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"accept":{"type":"string","default":"image/*"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"meta":{"type":"string","default":""},"empty-text":{"type":"string","default":""},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"object","nullable":true,"default":null,"summary":"The image in the file shape {value, label, mime, size, href, file?}, or null; the attribute takes an address or the shape as JSON"}},"events":{"change":{"carries":{"value":"object","file":"object","source":{"type":"enum","values":["input","drop","remove"]},"name":"string"}},"input":{"carries":{"value":"object","file":"object","source":{"type":"enum","values":["input","drop","remove"]},"name":"string"}},"attach":{"carries":{"files":"list","file":"object","source":{"type":"enum","values":["input","drop"]},"value":"object","name":"string"}},"detach":{"carries":{"value":"object","name":"string"}},"rejected":{"carries":{"files":"list","accept":"string","source":"string"}}},"actions":{"clear":{"x-outcomes":["applied","refused"]},"choose":{"x-outcomes":["applied","refused"]},"remove-image":{"x-outcomes":["applied","refused"]},"take-file":{"with":{"file":"object","source":{"type":"string","optional":true}},"x-outcomes":["applied","refused"]},"set-error":{"with":{"message":"string"},"x-outcomes":["applied"]}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"keyboard":{"host":{"Tab":"reach","Enter":"open","Space":"open"}},"templates":{"default":{"file":"js/templates/default.js"}},"examples":"examples.json","docs":"docs.md","lang":"lang/","accessibility":{"role":"group","name":{"from":["label","aria-label","runtime.group"]},"keys":{"Tab":"reach","Enter":"open","Space":"open"}},"host-states":{"data-dragged-over":"boolean"},"css-variables":{"--sf-image-field-background-color":{"type":"color","state":"rest"},"--sf-image-field-border-color":{"type":"color","state":"rest"},"--sf-image-field-border-width":{"type":"length"},"--sf-image-field-radius":{"type":"length"},"--sf-image-field-padding-inline":{"type":"length"},"--sf-image-field-padding-block":{"type":"length"},"--sf-image-field-gap":{"type":"length"},"--sf-image-field-thumbnail-size":{"type":"length"},"--sf-image-field-thumbnail-radius":{"type":"length"},"--sf-image-field-thumbnail-background-color":{"type":"color","state":"rest"}},"x-summary":"A form field for one image: a thumbnail with the file name and size, «Заменить…» and «Убрать», a file dropped anywhere on it replaces the image; label, help, error, required, disabled and read-only as every field has them. It raises the chosen File; the host uploads it.","x-source":{"package":"framework","folder":"image-field","manifest":"simai/ui-source@5100227 src/smart/image-field/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/image-field.component.json"},"x-words":["label","hint","empty-text"],"x-renamed":["settings.aria-label: a host attribute, read by the base, never a setting (§3.1)","events.sf-image-field-remove → detach (vocabulary §5.1)","events.sf-image-field-reject → rejected (vocabulary §5.1)","events.sf-image-field:select -> attach (vocabulary §5 attach {files}: the File the person chose, which the host uploads)","settings.error -> invalid (§17.2: error is a dated alias of invalid)"],"x-kept":{"security":{"permissions_owner":"host","untrusted_inputs":["props","children","dropped files"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"host","effects":"host","forbidden_client_responsibilities":["backend access decisions","uploading the file","choosing where the file is stored"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile","ltr","rtl"],"skeleton":{"shape":"block","while_loading":"none"}},"ai_guidance":{"use_when":"Use sf-image-field for a form value that is one image -- a logo, a cover, a picture in a block -- shown, replaced and removed in place.","do_not":["Do not copy generated ui-smart code","Do not use it for several files or a transfer list: that is sf-file-upload","Do not expect it to upload: it raises the File and the host uploads it"],"required_reads":["inputs","events","methods","accessibility","ownership","provenance"],"minimal_example":"<sf-image-field label=\\"Логотип\\" name=\\"logo\\" value=\'{\\"value\\":\\"42\\",\\"label\\":\\"logo.png\\",\\"mime\\":\\"image/png\\",\\"size\\":2048,\\"href\\":\\"/upload/logo.png\\"}\'></sf-image-field>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["alias-conflict: vocabulary 1.1.5 §9.1 decides -- sf-image-field:remove is sf-image-field-detach and sf-image-field:reject is sf-image-field-rejected; stand 18\'s planned sf-image-field-remove and -reject never shipped, so they get no alias","sf-image-field:select is sf-image-field-attach (vocabulary §5 attach {files}); its detail keeps file, source, value and name and adds files","version: 1.1.0 -- three events and the setting error move behind dated aliases, set-error is added; a minor while the aliases hold (§4.10)","key-effects: Enter and Space on «Выбрать…» or «Заменить…» open the platform file dialog; on «Убрать» they remove the image (a button\'s own press)","template: the default template stays the Lit module js/templates/default.js, the migration form §5.2 allows; template.html follows when the build compiles HTML templates","examples: examples.json from studio.fixture.json and docs.md","css-variables: the ten public variables the field already had (2026-10-24), now declared in the manifest","value: an object, nullable (§4.2): the file shape; the attribute stays as the class adds it -- an address or the shape as JSON","form: the host is the form control through ElementInternals (§17.1): the chosen File, or the stored image\'s id (else its address); nothing while empty or disabled, and while read-only it still submits; the native file input carries no name","validity: value-missing while required and empty; set-error {message} sets custom-error, so the form does not submit (§17.2)","actions answer outcomes (§4.4): choose, remove-image, take-file and clear are applied or refused (inactive, empty, rejected, unchanged); set-error is applied","host-states: data-dragged-over while a file is held over the field (§5.3)","ids: the part ids come from the instance path (§7.1.1), not a module counter","empty-text: default \\"\\" -- a host-written text wins, and without one the template says the language file\'s runtime.empty itself; a setting that defaulted to the word would differ from what the template reads (the template-context probe)"]}');

/***/ },

/***/ "b06ddaec70c1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Image field","runtime":{"bytes":"B","choose":"Choose…","choose-name":"Choose an image","chosen":"Image chosen","drop":"Drop the file to use it","empty":"No image chosen","empty-hint":"Drop a file here or choose one","gigabytes":"GB","group":"Image","kilobytes":"KB","megabytes":"MB","quoted":"“%s”","rejected":"This file is not accepted","remove":"Remove","remove-name":"Remove the image","removed":"Image removed","replace":"Replace…","replace-name":"Replace the image","value-missing":"Choose an image."}}');

/***/ },

/***/ "7e6798b6eac7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Поле изображения","runtime":{"bytes":"Б","choose":"Выбрать…","choose-name":"Выбрать изображение","chosen":"Выбрано изображение","drop":"Отпустите файл, чтобы поставить его","empty":"Изображение не выбрано","empty-hint":"Перетащите файл сюда или выберите его","gigabytes":"ГБ","group":"Изображение","kilobytes":"КБ","megabytes":"МБ","quoted":"«%s»","rejected":"Этот файл не подходит","remove":"Убрать","remove-name":"Убрать изображение","removed":"Изображение убрано","replace":"Заменить…","replace-name":"Заменить изображение","value-missing":"Выберите изображение."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("3ee997e7a076");
/******/
/******/ })()
;