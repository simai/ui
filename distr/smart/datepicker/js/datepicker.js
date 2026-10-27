/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
     * A component whose data comes another way (a port) overrides this.
     */


    sfAwaitingData() {
      if (!late.length || this.getAttribute('data-sf-first-paint') !== 'skeleton') return false;
      return late.some(member => {
        if (member.attribute && this.hasAttribute(member.attribute)) return false; // Read through the property: a component may keep the setting itself.

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

/***/ "78628e837a32"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   carryLayerOrigin: () => (/* binding */ carryLayerOrigin),
/* harmony export */   closeLayer: () => (/* binding */ closeLayer),
/* harmony export */   hasLayer: () => (/* binding */ hasLayer),
/* harmony export */   hasLayerAbove: () => (/* binding */ hasLayerAbove),
/* harmony export */   isOutsideTopLayer: () => (/* binding */ isOutsideTopLayer),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   landmarksAround: () => (/* binding */ landmarksAround),
/* harmony export */   layerIndex: () => (/* binding */ layerIndex),
/* harmony export */   layerZIndex: () => (/* binding */ layerZIndex),
/* harmony export */   layerZIndexAt: () => (/* binding */ layerZIndexAt),
/* harmony export */   openLayer: () => (/* binding */ openLayer),
/* harmony export */   openLayers: () => (/* binding */ openLayers),
/* harmony export */   raiseLayer: () => (/* binding */ raiseLayer),
/* harmony export */   returnLayerFocus: () => (/* binding */ returnLayerFocus),
/* harmony export */   topLayer: () => (/* binding */ topLayer),
/* harmony export */   tryFocus: () => (/* binding */ tryFocus),
/* harmony export */   updateLayer: () => (/* binding */ updateLayer)
/* harmony export */ });
// The one document layer stack (standard simai.smart-component 1.3.8 §19).
//
// Everything that draws above the page -- a modal, a drawer, a popover, a
// dropdown list, a menu, a calendar, the toast area -- registers here when it
// opens and leaves when it closes. The stack answers three questions the
// components used to answer each for itself, from three lists and two z-index
// bases:
//
//   - which layer is on top: the one opened last. Only that layer acts on
//     Escape, an outside press and Tab; a layer below stands back
//     (simai/ui-source#36: Escape over a modal opened from a drawer closed the
//     drawer, because each kept its own stack and the drawer listened first);
//   - how high each layer is drawn: one z-index scale in opening order, read
//     from the tokens --sf-z-index-layer and --sf-z-index-layer-step
//     (simai/ui-source#37: a drawer opened from a modal was drawn under it,
//     at 90 + 2i against the modal's 9000 + 2i);
//   - where focus goes when a layer closes: back to what was active when it
//     opened; if that is gone or outside the new top layer, into the new top
//     layer; else the nearest landmark; else the body. A layer that closes
//     while another stands above it moves no focus.
//
// Kept on a shared global, not in module scope: every Smart bundle carries its
// own copy of this module, and the modal's bundle has to see the drawer the
// drawer's bundle opened. Each document (an iframe too) has its own stack.
//
// A layer is any object: a custom element, or the root element of a component
// without one. One whose `isConnected` is false is passed over, so a layer
// removed without closing cannot hold every key on the page.
const STACK_KEY = Symbol.for('sf.layerStack'); // The scale's defaults, the same as core's tokens: 9000 is where the modal
// stack always started, so nothing a page draws below it changes place.

const LAYER_BASE = 9000;
const LAYER_STEP = 2;
const LANDMARKS = 'main, section, article, [role="main"], [role="region"]';

function stack() {
  const scope = globalThis;

  if (!scope[STACK_KEY]) {
    Object.defineProperty(scope, STACK_KEY, {
      value: {
        layers: [],
        bound: false,
        lease: null,
        pressTop: new WeakMap()
      },
      configurable: true
    });
  }

  return scope[STACK_KEY];
}

const isLive = entry => entry?.owner?.isConnected !== false; // A toast does not take keys or presses: the window under it keeps them.


const takesInput = entry => entry.kind !== 'toast';

function find(owner) {
  return stack().layers.find(entry => entry.owner === owner) || null;
}

function readToken(name, fallback) {
  const root = globalThis.document?.documentElement;
  if (!root || typeof globalThis.getComputedStyle !== 'function') return fallback;
  const value = parseInt(globalThis.getComputedStyle(root).getPropertyValue(name), 10);
  return Number.isFinite(value) ? value : fallback;
}
/** The z-index of the layer at a place in the stack, as a number. */


function layerZIndexAt(index) {
  if (index < 0) return '';
  return readToken('--sf-z-index-layer', LAYER_BASE) + index * readToken('--sf-z-index-layer-step', LAYER_STEP);
} // The page lock is one lease for the whole stack, taken by the first layer
// that locks the page and given back when no such layer is left -- whichever
// kind opened first and whichever closes last. A modal and a drawer held two
// locks before, and closing them out of order unlocked the page under an open
// window.

function syncPageLock() {
  const state = stack();
  const locker = state.layers.find(entry => entry.locksPage && isLive(entry));

  if (locker && !state.lease) {
    const release = locker.lockPage?.();
    state.lease = typeof release === 'function' ? release : () => {};
  } else if (!locker && state.lease) {
    const release = state.lease;
    state.lease = null;
    release();
  }
}

function sync() {
  const state = stack();
  const top = topLayer();
  state.layers.forEach((entry, index) => {
    entry.place?.({
      index,
      zIndex: layerZIndexAt(index),
      top: entry === top
    });
  });
  syncPageLock();
}
/** The layer on top: the last opened that takes keys and presses. */


function topLayer() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && takesInput(layers[at])) return layers[at];
  }

  return null;
}
/** Whether this owner is the top layer. One that is not open is top only when nothing is. */

function isTopLayer(owner) {
  const top = topLayer();
  return top ? top.owner === owner : !find(owner);
}
function hasLayer(owner) {
  return Boolean(find(owner));
}
/** Whether a layer of one of these kinds stands above this owner. */

function hasLayerAbove(owner, kinds = ['modal', 'panel']) {
  const {
    layers
  } = stack();
  const at = layers.findIndex(entry => entry.owner === owner);
  if (at < 0) return false;
  return layers.slice(at + 1).some(entry => isLive(entry) && kinds.includes(entry.kind));
}
/** The place of this owner in the stack, -1 when it is not open. */

function layerIndex(owner) {
  return stack().layers.findIndex(entry => entry.owner === owner);
}
/** This owner's z-index, '' when it is not open. */

function layerZIndex(owner) {
  return layerZIndexAt(layerIndex(owner));
}
/** The open layers, bottom first; of one kind when `kind` is given. */

function openLayers(kind = '') {
  return stack().layers.filter(entry => !kind || entry.kind === kind).map(entry => entry.owner);
}
/**
 * Registers a layer, or raises it to the top when it is already open.
 *
 * options:
 *   kind        'modal' | 'panel' | 'surface' | 'toast'
 *   locksPage   true to hold the page lock while open; lockPage() takes it and
 *               returns the function that gives it back
 *   trapsFocus  true to keep Tab inside and to return focus on close
 *   root()      the element the layer draws, for focus and outside presses
 *   onEscape(event)  closes the layer and answers true when it took the press
 *   onTab(event)     keeps focus inside
 *   focusIn()        moves focus inside
 *   place({index, zIndex, top})  draws the layer at its height
 *   returnTo    what was active at open (default: the active element now)
 */

function openLayer(owner, options = {}) {
  if (!owner) return null;
  const state = stack();
  bindKeys();
  let entry = find(owner);

  if (entry) {
    state.layers.splice(state.layers.indexOf(entry), 1);
    Object.assign(entry, options);
  } else {
    const returnTo = options.returnTo !== undefined ? options.returnTo : globalThis.document?.activeElement ?? null;
    entry = {
      kind: 'surface',
      locksPage: false,
      trapsFocus: false,
      ...options,
      owner,
      returnTo,
      returnAncestors: landmarksAround(returnTo)
    };
  }

  state.layers.push(entry);
  sync();
  return entry;
}
/** Changes what a layer declares without moving it in the stack. */

function updateLayer(owner, options = {}) {
  const entry = find(owner);
  if (!entry) return null;
  Object.assign(entry, options);
  sync();
  return entry;
}
/** Raises an open layer to the top. */

function raiseLayer(owner) {
  const entry = find(owner);
  if (!entry) return;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  layers.push(entry);
  sync();
}
/**
 * Removes a layer. Answers whether it was the top one. With `restoreFocus`
 * (the default) a top layer that traps focus gives focus back by §19.2.
 */

function closeLayer(owner, {
  restoreFocus = true
} = {}) {
  const entry = find(owner);
  if (!entry) return false;
  const wasTop = topLayer() === entry;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  sync();

  if (restoreFocus && wasTop && entry.trapsFocus) {
    returnLayerFocus(true, entry.returnTo, entry.returnAncestors);
  }

  return wasTop;
}
/** The landmarks around a node, nearest first: where focus falls back to. */

function landmarksAround(node) {
  const found = [];

  for (let parent = node?.parentElement; parent; parent = parent.parentElement) {
    if (parent.matches?.(LANDMARKS)) found.push(parent);
  }

  return found;
}
/** Focuses a node if a person could reach it; answers whether it took focus. */

function tryFocus(node, temporaryTabIndex = false) {
  if (!node?.isConnected || typeof node.focus !== 'function' || node.matches?.(':disabled') || node.closest?.('[inert], [hidden], [aria-hidden="true"]') || !node.getClientRects?.().length || node.ownerDocument.defaultView.getComputedStyle(node).visibility !== 'visible') {
    return false;
  }

  const addTabIndex = temporaryTabIndex && !node.hasAttribute('tabindex');
  let observer;

  const cleanup = () => {
    observer?.disconnect();
    node.removeEventListener('blur', cleanup); // Keep an author's own change to the temporary attribute.

    if (addTabIndex && node.getAttribute('tabindex') === '-1') node.removeAttribute('tabindex');
  };

  if (addTabIndex) {
    node.setAttribute('tabindex', '-1');
    node.addEventListener('blur', cleanup, {
      once: true
    });
    observer = new node.ownerDocument.defaultView.MutationObserver(() => {
      if (!node.isConnected) cleanup();
    });
    observer.observe(node.ownerDocument.documentElement, {
      childList: true,
      subtree: true
    });
  }

  let focused = false;

  try {
    node.focus({
      preventScroll: true
    });
    focused = node.ownerDocument.activeElement === node;
    return focused;
  } catch {
    return false;
  } finally {
    // Removing tabindex while a non-native target is focused blurs it.
    if (addTabIndex && !focused) cleanup();
  }
} // The layer that owns focus now: the topmost one that traps it. A docked
// panel or an open list under the window does not.

function focusOwner() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && layers[at].trapsFocus) return layers[at];
  }

  return null;
}
/**
 * Gives focus back after a layer closed (§19.2): to `target` when it is still
 * there and inside the layer that now owns focus (or nothing does); else into
 * that layer; else the nearest landmark; else the body. Nothing moves when the
 * closed layer was not the top one.
 */


function returnLayerFocus(wasTop, target, ancestors = []) {
  if (!wasTop) return;
  const owner = focusOwner();
  const root = owner?.root?.();
  if ((!owner || root?.contains(target)) && tryFocus(target)) return;

  if (owner) {
    owner.focusIn?.();
    return;
  }

  const doc = globalThis.document;
  if (!doc) return;
  const candidates = new Set([...ancestors, ...doc.querySelectorAll('main, [role="main"]'), doc.body]);

  for (const candidate of candidates) {
    if (tryFocus(candidate, true)) return;
  }
} // One listener pair for the whole document, whichever bundle binds it first.
// The top layer is read when the press starts (window, capture -- before any
// component's listener) and acted on when it has passed through the page
// (window, bubble): a control inside that handled Escape keeps it, and a
// surface that closed itself on the way down does not hand the same press to
// the layer under it.

function bindKeys() {
  const state = stack();
  if (state.bound || typeof globalThis.addEventListener !== 'function') return;
  state.bound = true;
  globalThis.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'Tab') state.pressTop.set(event, topLayer());
  }, true);
  globalThis.addEventListener('keydown', event => {
    if (event.key !== 'Escape' && event.key !== 'Tab' || event.defaultPrevented) return;
    const top = state.pressTop.has(event) ? state.pressTop.get(event) : topLayer();
    if (!top || top !== topLayer()) return;

    if (event.key === 'Escape') {
      if (top.onEscape?.(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return;
    }

    top.onTab?.(event);
  });
} // A press outside the top layer, read in capture: what a layer below would
// call outside is ignored there.


function isOutsideTopLayer(event) {
  const top = topLayer();
  const root = top?.root?.();
  if (!root) return false;
  const path = event.composedPath?.() ?? [];
  return !path.includes(root) && !path.includes(top.owner);
}
const THEMES = ['theme-dark', 'theme-light'];
/**
 * A layer drawn outside its host (a portal) keeps where it came from (§19.1):
 * the host's resolved lang and dir, the theme of its nearest themed ancestor,
 * and the computed values of the host's variables that differ from those
 * where the portal stands -- `variables` by name, `prefixes` by the start of
 * the name. It looks and speaks as if it stood where its host stands.
 */

function carryLayerOrigin(portal, host, {
  variables = [],
  prefixes = []
} = {}) {
  if (!portal || !host?.isConnected) return;
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  const lang = host.closest('[lang]')?.getAttribute('lang') ?? doc.documentElement.getAttribute('lang') ?? '';
  if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
  const declared = host.closest('[dir]')?.getAttribute('dir');
  const dir = declared && declared !== 'auto' ? declared : view.getComputedStyle(host).direction;
  if (dir) portal.setAttribute('dir', dir); // The theme only when the host's differs from the portal's place: a page
  // that retunes tokens on html.theme-dark keeps them, as the class would
  // otherwise declare the core's values again on the portal.

  const parent = portal.parentElement;

  const theme = node => {
    const area = node?.closest?.(THEMES.map(name => `.${name}`).join(', '));
    return area ? THEMES.find(name => area.classList.contains(name)) : '';
  };

  const carried = portal.dataset.sfLayerTheme || '';
  const wanted = theme(host) !== theme(parent) ? theme(host) : '';
  if (carried && carried !== wanted) portal.classList.remove(carried);
  if (wanted) portal.classList.add(wanted);
  if (wanted) portal.dataset.sfLayerTheme = wanted;else delete portal.dataset.sfLayerTheme;
  if (!variables.length && !prefixes.length) return;
  const own = view.getComputedStyle(host);
  const there = parent ? view.getComputedStyle(parent) : null;
  const names = new Set(variables);

  if (prefixes.length) {
    for (const name of own) {
      if (prefixes.some(prefix => name.startsWith(prefix))) names.add(name);
    }
  }

  const previous = (portal.dataset.sfLayerVariables || '').split(' ').filter(Boolean);
  const kept = [];

  for (const name of names) {
    const value = own.getPropertyValue(name).trim();

    if (value && value !== there?.getPropertyValue(name).trim()) {
      portal.style.setProperty(name, value);
      kept.push(name);
    }
  }

  for (const name of previous) if (!kept.includes(name)) portal.style.removeProperty(name);

  if (kept.length) portal.dataset.sfLayerVariables = kept.join(' ');else delete portal.dataset.sfLayerVariables;
}

/***/ },

/***/ "421676f72963"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPEN_SURFACE_MARK: () => (/* binding */ OPEN_SURFACE_MARK),
/* harmony export */   holdOpenSurfaceMark: () => (/* binding */ holdOpenSurfaceMark),
/* harmony export */   isOpenSurfaceMarked: () => (/* binding */ isOpenSurfaceMarked),
/* harmony export */   isTopOpenSurface: () => (/* binding */ isTopOpenSurface)
/* harmony export */ });
/* harmony import */ var _layer_stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("78628e837a32");
// While a transient surface is open the root says so, and a component whose own
// Escape closes something larger -- a drawer, a modal, a record panel -- stands
// back. They all listen on the document in capture, where stopPropagation
// cannot reach a listener on the same node and the one registered first wins
// whatever it is: without a shared mark, one press closed the surface and the
// window behind it together.
//
// The mark started inside sf-popover, which made it that component's state
// instead of the protocol it is: a dropdown list is the same kind of surface and
// raised nothing, so Escape over an open list closed the record panel behind it
// (Larena storage QA, 2026-10-22) -- and a drawer and a modal read the same mark,
// so the same press closed those too. It lives here now, raised by every surface
// that owns Escape while it is open and read by every component that owns Escape
// for something larger.
//
// The attribute name is unchanged, because it is already the published protocol:
// `document.documentElement.dataset.sfPopoverOpen`.

const OPEN_MARK = 'sfPopoverOpen'; // A count, not a flag: two surfaces can be open at once -- a dropdown inside a
// popover -- and the first to close must not clear the mark the second needs.

const held = new WeakSet(); // The same holders are layers of the one document stack (layer-stack.js,
// standard 1.3.8 §19.1): the mark answers "is anything open", the stack answers
// "is it me" -- for a surface, and for the drawer and the modal under it. Two
// surfaces that both listen on the document in capture cannot settle it with
// stopPropagation, which does not reach a listener on the same node: a calendar
// opened inside a popover closed together with the popover, and a popover closed
// over a dropdown list it held and left the list open.
//
// The list a bundle of an older pair reads (sf.openSurfaceLayers) is kept as
// well, so a package built against it still sees the surfaces this one opens.

const LAYERS_KEY = Symbol.for('sf.openSurfaceLayers');

function legacyLayers() {
  const scope = globalThis;
  if (!Array.isArray(scope[LAYERS_KEY])) scope[LAYERS_KEY] = [];
  return scope[LAYERS_KEY];
}

function step(delta) {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  const next = Math.max(0, Number(root.dataset[OPEN_MARK] || 0) + delta);
  if (next) root.dataset[OPEN_MARK] = String(next);else delete root.dataset[OPEN_MARK];
} // Idempotent for one owner, so a component can call it from every update with
// its own open state and only a change moves the count. An owner that is removed
// while open releases it the same way, from wherever it tears down.


function holdOpenSurfaceMark(owner, open) {
  if (!owner) return;
  const wanted = Boolean(open);
  if (wanted === held.has(owner)) return;
  const layers = legacyLayers();

  if (wanted) {
    held.add(owner);
    layers.push(owner);
    (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.openLayer)(owner, {
      kind: 'surface'
    });
  } else {
    held.delete(owner);
    const at = layers.lastIndexOf(owner);
    if (at >= 0) layers.splice(at, 1); // A surface returns focus itself, to its own trigger.

    (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.closeLayer)(owner, {
      restoreFocus: false
    });
  }

  step(wanted ? 1 : -1);
} // What a surface asks before its own Escape closes it: whether it is the top
// layer of the document -- above a modal or a drawer as well as above another
// surface. A holder that left the document without releasing is passed over
// rather than allowed to hold every Escape on the page. An owner that holds
// nothing is the top only when nothing else is open.

function isTopOpenSurface(owner) {
  if (!(0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(owner)) return false; // A holder that only a bundle of an older pair registered -- it is in the
  // old list and not in the stack -- stands above whatever opened before it.

  const layers = legacyLayers();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    const layer = layers[at];
    if (layer?.isConnected === false) continue;
    return layer === owner || (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.hasLayer)(layer);
  }

  return true;
} // What a component asks before its own Escape closes something larger.

function isOpenSurfaceMarked() {
  return Boolean(globalThis.document?.documentElement?.dataset?.[OPEN_MARK]);
}
const OPEN_SURFACE_MARK = OPEN_MARK;

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

/***/ "b9b65955223a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("695f21e50358");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("77b2f4107e3b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("5c1dc214bb5e");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("ef6661f4d1bb");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("7cb84e1fa3a3");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("0b816e511c59");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("aa7064807ed2");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("421676f72963");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_7__);













const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const YEARS_PAGE_SIZE = 18;

function padDatePart(value) {
  return String(value).padStart(2, '0');
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function formatDateValue(date, format = 'YYYY.MM.DD') {
  if (!date) {
    return '';
  }

  const tokens = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MM: padDatePart(date.getMonth() + 1),
    DD: padDatePart(date.getDate())
  };
  return String(format || 'YYYY.MM.DD').replace(/YYYY|YY|MM|DD/g, token => tokens[token] || token);
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
} // A year has four digits: 1000 to 9999. Without the bound a glued paste such
// as «20.11.202630.10.2026» read as year 202630 and was stored as a date
// nobody meant.


const MIN_YEAR = 1000;
const MAX_YEAR = 9999;

function calendarDate(year, month, day) {
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return null;
  }

  const date = new Date(year, month - 1, day); // new Date reads years below 100 as 19xx; the bound above keeps them out.

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(ISO_DATE_RE);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return calendarDate(Number(year), Number(month), Number(day));
} // The declared format as an anchored pattern: YYYY is four digits, YY two,
// DD and MM one or two, and whatever stands between them in the format is a
// separator -- any of . / - , or a space, so «20/11/2026» lands in a
// DD.MM.YYYY field. The whole text has to be one date: it read every run of
// digits it found and took the first three, so two dates glued together, a
// date with something after it or a five-digit year all made a date.


const FORMAT_TOKEN_RE = /YYYY|YY|MM|DD/g;
const formatPatterns = new Map();

function formatPattern(format) {
  const key = String(format || 'DD.MM.YYYY');
  if (formatPatterns.has(key)) return formatPatterns.get(key);
  const tokens = key.match(FORMAT_TOKEN_RE) || [];
  const digits = {
    YYYY: '(\\d{4})',
    YY: '(\\d{2})',
    MM: '(\\d{1,2})',
    DD: '(\\d{1,2})'
  };
  const source = key.split(FORMAT_TOKEN_RE).map(literal => literal ? '[\\s./,-]+' : '').reduce((pattern, literal, index) => pattern + literal + (index < tokens.length ? digits[tokens[index]] : ''), '');
  const usable = tokens.length === 3 && tokens.includes('MM') && tokens.includes('DD') && (tokens.includes('YYYY') || tokens.includes('YY'));
  const pattern = usable ? {
    re: new RegExp(`^${source}$`),
    tokens
  } : null;
  formatPatterns.set(key, pattern);
  return pattern;
}

function parseDateValue(value, format = 'DD.MM.YYYY') {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return isValidDate(value) ? new Date(value.getFullYear(), value.getMonth(), value.getDate()) : null;
  }

  const text = String(value).trim();

  if (ISO_DATE_RE.test(text)) {
    return parseDate(text);
  }

  const pattern = formatPattern(format);
  const match = pattern ? text.match(pattern.re) : null;

  if (!match) {
    return null;
  }

  const values = {};
  pattern.tokens.forEach((token, index) => {
    values[token] = Number(match[index + 1]);
  });
  const year = values.YYYY ?? values.YY + 2000;
  return calendarDate(year, values.MM, values.DD);
}

function normalizeMonth(value, fallback = 0) {
  const month = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(value, fallback);

  if (!Number.isFinite(month)) {
    return fallback;
  }

  return Math.max(0, Math.min(11, month));
}

function sameDay(first, second) {
  return first && second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function compareDates(first, second) {
  if (!first || !second) {
    return 0;
  }

  const firstTime = new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime();
  const secondTime = new Date(second.getFullYear(), second.getMonth(), second.getDate()).getTime();
  return firstTime - secondTime;
}

function shiftDateByMonth(date, direction) {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + direction, 1);
  const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
  targetMonth.setDate(Math.min(date.getDate(), lastDay));
  return targetMonth;
}

function isBetweenDates(date, startDate, endDate) {
  if (!date || !startDate || !endDate) {
    return false;
  }

  return compareDates(date, startDate) > 0 && compareDates(date, endDate) < 0;
}

function normalizeLocale(value = '', node = null) {
  const locale = String(value || '').trim();

  if (locale) {
    return locale;
  } // The nearest [lang] first, then the document's: the rule every component
  // follows, rather than this one's own reading of it. A date picker inside a
  // region marked `lang="en"` on a Russian page used to name its months in
  // Russian, because only the document was ever consulted.
  //
  // The region is kept -- `pageLocale`, not `pageLanguage` -- because this
  // value also goes to Intl, and `ru-RU` and `en-GB` name months and start
  // weeks differently from `ru` and `en`. Below this there used to be a fall
  // back to the browser's own language and then to `ru-RU`: unreachable
  // wherever a document exists, and a Russian default everywhere else, which
  // is the opposite of the rule (peer session, 2026-10-11).


  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_7__.pageLocale)(node ?? globalThis.document?.documentElement ?? null);
}

function capitalizeFirstLetter(value = '') {
  const text = String(value || '');

  if (!text) {
    return '';
  }

  return `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}`;
}

function getMonthLabel(month, locale) {
  try {
    return capitalizeFirstLetter(new Intl.DateTimeFormat(locale, {
      month: 'long'
    }).format(new Date(2026, month, 1)));
  } catch {
    return String(month + 1);
  }
}

function getDateLabel(date, locale) {
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return formatIsoDate(date);
  }
}

function getWeekdays(locale, weekStart = 1) {
  const sunday = new Date(2026, 0, 4);
  return Array.from({
    length: 7
  }, (_, index) => {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + (weekStart + index) % 7);

    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'short'
      }).format(day);
    } catch {
      return String((weekStart + index) % 7);
    }
  });
} // Quick ranges (owner, 2026-10-15). A relative one is resolved against today
// in the person's own time zone, every time it is drawn, so a host that stores
// «last 7 days» gets the last seven days tomorrow too. Weeks start where the
// grid starts them.


const RELATIVE_PRESETS = ['today', 'yesterday', 'last-7-days', 'last-30-days', 'this-week', 'this-month', 'last-month'];

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function resolveRelativePreset(id, today, weekStart = 1) {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  switch (id) {
    case 'today':
      return [day, day];

    case 'yesterday':
      return [addDays(day, -1), addDays(day, -1)];

    case 'last-7-days':
      return [addDays(day, -6), day];

    case 'last-30-days':
      return [addDays(day, -29), day];

    case 'this-week':
      return [addDays(day, -((day.getDay() - weekStart + 7) % 7)), day];

    case 'this-month':
      return [new Date(day.getFullYear(), day.getMonth(), 1), day];

    case 'last-month':
      return [new Date(day.getFullYear(), day.getMonth() - 1, 1), new Date(day.getFullYear(), day.getMonth(), 0)];

    default:
      return null;
  }
}

function presetTextKey(id) {
  return `preset_${String(id).replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase())}`;
} // Every word this picker says, in the languages it ships with. A product adds
// any other through SF.language.register('sf-datepicker', code, words) -- which
// an if/else on «ru» did not allow at all.
// Every word is lang/<locale>.json runtime (standard 1.3.8 §11); the code's
// camelCase keys read as the files' kebab-case ones.


const wordKey = key => String(key).replace(/_/gu, '-').replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);

function getLabels(node) {
  const keys = ['previousMonth', 'nextMonth', 'previousYears', 'nextYears', 'chooseMonth', 'chooseYear', 'presets', 'customRange'];
  return Object.fromEntries(keys.map(key => [key, node.sfWord(wordKey(key))]));
} // sf-datepicker from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §4.4, §7.1.1, §8, §11, §16.20, §17.1). It stays a leaf: the one
// interactive part it places is its own text box. The settings are attributes
// and properties made by core/js/element-manifest.js, the panel actions answer
// an outcome, change leaves once (the shim sends sf-datepicker-change and
// sf-change after it), and the host is the form control through
// ElementInternals.


const DatepickerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__,
  actions: {
    'open-panel'({
      options
    } = {}) {
      if (this.disabled) return 'disabled';

      this._openPanel(options || {});

      return 'applied';
    },

    'close-panel'({
      options
    } = {}) {
      if (!this.open) return 'unchanged';

      this._closePanel(options || {});

      return 'applied';
    },

    'toggle-panel'() {
      if (!this.open && this.disabled) return 'disabled';

      this._togglePanel();

      return 'applied';
    },

    'choose-preset'({
      item
    } = {}) {
      if (!item || item.disabled || !this.range) return 'unavailable-preset';

      this._choosePreset(item);

      return 'applied';
    },

    'choose-custom-range'() {
      if (!this.range) return 'not-a-range';

      this._chooseCustomRange();

      return 'applied';
    }

  }
});

class SfDatepicker extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_4__.FormField)(DatepickerElement) {
  constructor() {
    super();
    this._input = null;
    this._documentClickHandler = this.handleDocumentClick.bind(this);
    this._documentKeydownHandler = this.handleDocumentKeydown.bind(this);
    this._viewportHandler = this.positionPanel.bind(this);
    this._focusCalendarOnOpen = false;
    this._focusDateAfterRender = false;
    this.state = {
      openAbove: false,
      yearPageStart: null,
      activeDate: ''
    };
    this.refs = {
      input: this.createRef(),
      datePickerRoot: this.createRef(),
      datePickerPanel: this.createRef()
    };
  }

  static get props() {
    // The manifest's settings, read as the component always read them:
    // its own entries win where they keep an attribute's old reading.
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      value: {
        default: ''
      },
      date: {
        default: ''
      },
      startValue: {
        attribute: 'start-value',
        default: ''
      },
      endValue: {
        attribute: 'end-value',
        default: ''
      },
      maxDate: {
        default: ''
      },
      minDate: {
        default: ''
      },
      range: {
        type: Boolean,
        default: false
      },
      month: {
        type: Number,
        default: null
      },
      year: {
        type: Number,
        default: null
      },
      context: {
        default: ''
      },
      // No default: the page's language says it (see get weekStart).
      weekStart: {
        type: Number,
        default: null
      },
      locale: {
        default: ''
      },
      format: {
        default: 'DD.MM.YYYY'
      },
      rootClass: {
        default: ''
      },
      closeOnSelect: {
        type: Boolean,
        default: true
      },
      input: {
        type: Boolean,
        default: true
      },
      open: {
        type: Boolean,
        default: false
      },
      portal: {
        type: Boolean,
        default: true
      },
      inputType: {
        attribute: 'input-type',
        default: 'bordered'
      },
      size: {
        default: '1'
      },
      inputSize: {
        attribute: 'input-size',
        default: '1'
      },
      inputName: {
        attribute: 'input-name',
        default: ''
      },
      // Read by inputName after input-name; declared so the manifest names it.
      name: {
        attribute: 'name',
        default: ''
      },
      placeholder: {
        default: ''
      },
      label: {
        default: ''
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      // A date can be typed; a host that wants the grid alone says so.
      readonly: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      // Said by the host and drawn by the field: the red border and
      // aria-invalid on the native input, and the message under it.
      // Removing it puts both back (Larena acceptance, 2026-10-22).
      invalid: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        attribute: 'error-message',
        default: ''
      },
      iconStart: {
        type: String,
        attribute: 'icon-start',
        default: null
      },
      leftIcon: {
        attribute: 'left-icon',
        default: 'calendar_today'
      },
      inputRootClass: {
        attribute: 'input-root-class',
        default: ''
      },
      mask: {
        type: Boolean,
        default: false
      },
      maskPattern: {
        attribute: 'mask-pattern',
        default: ''
      },
      maskLazy: {
        attribute: 'mask-lazy',
        default: false
      },
      maskPlaceholderChar: {
        attribute: 'mask-placeholder-char',
        default: '_'
      },
      maskOptions: {
        attribute: 'mask-options',
        default: ''
      },
      // Quick ranges, range mode only: built-in ids, comma separated, or
      // the property as [{id, label, relative} | {id, label, range: [from, to]}].
      presets: {
        default: ''
      },
      // The chosen quick range. Set by a host, it wins over start-value and
      // end-value: a stored «last-7-days» is resolved when drawn.
      preset: {
        default: ''
      }
    };
  } // The panel's id comes from the instance path (§7.1.1), never from a counter.


  get _panelId() {
    return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
      kind: 'sf-datepicker'
    }), 'panel');
  }

  connectedCallback() {
    // What a form reset returns to (§17.1 item 4): the value as written.
    if (!this._written) {
      this._written = Object.fromEntries(['date', 'start-value', 'end-value', 'preset'].map(name => [name, this.getAttribute(name)]));
    }

    this.upgradeProperty('value');
    this.upgradeProperty('presets');
    super.connectedCallback();
  }

  upgradeProperty(name) {
    if (!Object.prototype.hasOwnProperty.call(this, name)) {
      return;
    }

    const value = this[name];
    delete this[name];
    this[name] = value;
  }

  get componentName() {
    return 'datepicker';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get selectedDate() {
    return parseDateValue(this.date, this.format);
  }

  get primaryDate() {
    const preset = this.activePreset;
    if (preset) return preset.to;
    return this.selectedDate || this.startDate;
  }

  get presets() {
    return this._presetList ?? (this.getAttribute('presets') || '');
  }

  set presets(next) {
    if (Array.isArray(next)) {
      this._presetList = next;
      this.requestComponentUpdate('presets');
      return;
    }

    this._presetList = null;
    this.setState({
      presets: next ? String(next) : ''
    });
  }

  get preset() {
    return this.getAttribute('preset') || '';
  }

  set preset(next) {
    this.setState({
      preset: next ? String(next) : ''
    });
  } // Each quick range resolved for today: its dates, clamped to min and max,
  // and disabled when nothing of it is left.


  get presetItems() {
    if (!this.range) return [];
    const raw = Array.isArray(this.presets) ? this.presets : String(this.presets).split(/[\s,]+/).filter(Boolean);
    const today = new Date();
    const min = this.setMinDate();
    const max = this.setMaxDate();
    return raw.map(entry => {
      const item = typeof entry === 'string' ? {
        id: entry,
        relative: entry
      } : { ...entry
      };
      if (!item?.id) return null;
      let dates = null;
      if (item.relative) dates = resolveRelativePreset(item.relative, today, this.weekStart);else if (Array.isArray(item.range)) {
        const from = parseDateValue(item.range[0], this.format);
        const to = parseDateValue(item.range[1], this.format);
        if (from && to) dates = compareDates(from, to) <= 0 ? [from, to] : [to, from];
      }
      if (!dates) return null;
      let [from, to] = dates;
      if (min && compareDates(from, min) < 0) from = min;
      if (max && compareDates(to, max) > 0) to = max;
      const disabled = compareDates(from, to) > 0;
      const label = item.label || (RELATIVE_PRESETS.includes(item.id) ? this.sfWord(wordKey(presetTextKey(item.id))) : item.id);
      return {
        id: String(item.id),
        label,
        relative: item.relative || null,
        from,
        to,
        disabled,
        pressed: this.preset === String(item.id)
      };
    }).filter(Boolean);
  }

  get activePreset() {
    const id = this.preset;
    if (!id || !this.range) return null;
    const item = this.presetItems.find(one => one.id === id);
    return item && !item.disabled ? item : null;
  }

  get startDate() {
    return parseDateValue(this.startValue, this.format);
  }

  get endDate() {
    return parseDateValue(this.endValue, this.format);
  } // `value` is the initial value; `date` is the component's own. The getter
  // read `date || value`, so once a date set by the `value` attribute was
  // cleared -- the person emptied the field, or code set '' -- the attribute
  // came back and the old date with it: the value could not be cleared, and
  // the change said the old date (field renderers' date editor, ui-admin's
  // datetime). A present `date`, even empty, is the value now.


  get date() {
    if (this.hasAttribute('date')) return this.getAttribute('date') || '';
    return this.getAttribute('value') || '';
  } // An empty date removes the `date` attribute, which let `value` back in; a
  // cleared value over an initial one is kept as date="".


  setState(nextState = {}, callback = null) {
    super.setState(nextState, callback);

    const has = key => nextState && typeof nextState === 'object' && Object.prototype.hasOwnProperty.call(nextState, key);

    const clears = has('date') && !nextState.date;
    if (clears && this.hasAttribute('value')) this.setAttribute('date', ''); // The grid's month written by the component itself (a date chosen, an
    // arrow, the month list), not by a host: the next opening may move it.

    if (has('year') || has('month')) this._gridMoved = true;
    return this;
  } // The month a value is in, as the state that shows it; nothing for a value
  // that is not a date, so an emptied value leaves the grid where it was.


  monthOf(value) {
    const date = parseDateValue(value, this.format);
    return date ? {
      year: date.getFullYear(),
      month: date.getMonth()
    } : {};
  } // The day the grid opens on: the value's, or today's when there is none --
  // inside min-date and max-date either way.


  get anchorDate() {
    const candidate = this.primaryDate || new Date();
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(candidate, minDate) < 0) return minDate;
    if (maxDate && compareDates(candidate, maxDate) > 0) return maxDate;
    return candidate;
  } // The calendar opens on the month of the value it holds (Larena acceptance,
  // 2026-10-22: 15.11.2026 typed, the grid opened on August -- the month it
  // was left on). The grid kept the year and month it was last moved to, and
  // a value set by a property, by the attribute or by typing did not move it
  // unless the change came through the component's own selection path. So on
  // opening: text typed but not yet committed is committed first; then the
  // grid goes to the value's month, or -- with no value -- back to today's
  // when the component had moved it (a month a host set stays). Inside
  // min-date/max-date either way. The focused day follows.


  showValueMonth() {
    this.commitTypedText();
    const primaryDate = this.primaryDate;

    if (primaryDate) {
      const anchor = this.anchorDate;
      this.setState({
        year: anchor.getFullYear(),
        month: anchor.getMonth(),
        context: ''
      });
    } else if (this._gridMoved) {
      this.setState({
        year: '',
        month: '',
        context: ''
      });
    }

    this._gridMoved = false;
    this.set({
      activeDate: formatIsoDate(this.anchorDate)
    });
    return this;
  } // What stands in the field, read as a date if it is one. Opening the
  // calendar without leaving the field (a click on it, ArrowDown) fires no
  // change, so the typed date was not the value yet. Text that is not a date
  // is left as it is: the change on leaving the field decides about it.


  commitTypedText() {
    if (!this.typed || !this._input) return this;
    const text = String(this._input.value ?? '').trim();
    if (!text || text === this.displayValue || !parseDateValue(text, this.format)) return this;
    this.handleInputChange({
      target: this._input
    });
    return this;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue); // A host that changes the value attribute moves the grid to it: an
    // inline calendar is never opened, so opening cannot do it there.

    if (name === 'value' && oldValue !== null && oldValue !== newValue && this.primaryDate) {
      const date = this.primaryDate;
      this.setState({
        year: date.getFullYear(),
        month: date.getMonth()
      });
    }
  }

  get value() {
    return this.range ? [this.startValue, this.endValue] : this.date;
  }

  set value(nextValue) {
    if (Array.isArray(nextValue)) {
      const [startValue = '', endValue = ''] = nextValue;
      this.setState({
        date: startValue || '',
        startValue: startValue || '',
        endValue: endValue || '',
        ...this.monthOf(startValue || endValue)
      });
      return;
    }

    if (nextValue && typeof nextValue === 'object') {
      const startValue = nextValue.start || nextValue.startValue || nextValue.date || '';
      const endValue = nextValue.end || nextValue.endValue || '';
      this.setState({
        date: nextValue.date || startValue || '',
        startValue,
        endValue,
        ...this.monthOf(nextValue.date || startValue || endValue)
      });
      return;
    }

    this.setState({
      date: nextValue ? String(nextValue) : '',
      startValue: '',
      endValue: '',
      ...this.monthOf(nextValue)
    });
  }

  setMaxDate() {
    return parseDateValue(this.maxDate, this.format);
  }

  setMinDate() {
    return parseDateValue(this.minDate, this.format);
  }

  get maxDate() {
    return this.getAttribute('max-date') || '';
  }

  get minDate() {
    return this.getAttribute('min-date') || '';
  }

  set date(nextValue) {
    this.setState({
      date: nextValue ? String(nextValue) : '',
      ...this.monthOf(nextValue)
    });
  }

  get startValue() {
    const preset = this.activePreset;
    if (preset) return formatIsoDate(preset.from);
    return this.getAttribute('start-value') || '';
  }

  set startValue(nextValue) {
    this.setState({
      startValue: nextValue ? String(nextValue) : '',
      ...this.monthOf(nextValue)
    });
  }

  get endValue() {
    const preset = this.activePreset;
    if (preset) return formatIsoDate(preset.to);
    return this.getAttribute('end-value') || '';
  }

  set endValue(nextValue) {
    this.setState({
      endValue: nextValue ? String(nextValue) : ''
    });
  }

  get range() {
    return this.getBooleanAttr('range', false);
  }

  get input() {
    return this.getBooleanAttr('input', true);
  }

  get open() {
    return this.getBooleanAttr('open', false);
  }

  get portal() {
    return this.getBooleanAttr('portal', true);
  }

  get inputType() {
    return this.getAttribute('input-type') || 'bordered';
  } // `size` is the canonical name, as on every field; `input-size` is its
  // legacy name and still honoured. The canonical name wins when both are set.


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(this.getAttribute('size') || this.getAttribute('input-size') || '1', 'sf-datepicker');
  }

  get inputSize() {
    return this.size;
  }

  get inputName() {
    return this.getAttribute('input-name') || this.getAttribute('name') || '';
  }

  get placeholder() {
    return this.getAttribute('placeholder') || '';
  } // What the form gets (§17.1): the ISO date, never the display text; a
  // range as start/end (an ISO 8601 interval); nothing while disabled.


  sfFormValue() {
    if (this.disabled) return null;
    if (!this.range) return this.date || '';
    const {
      startValue,
      endValue
    } = this;
    if (startValue && endValue) return `${startValue}/${endValue}`;
    return startValue || '';
  }

  fieldValidity() {
    const empty = this.range ? !this.startValue : !this.date;
    return {
      valueMissing: this.required && !this.disabled && empty,
      message: this.sfWord('value-missing'),
      anchor: this._input || null
    };
  } // form.reset(): the value as written, without events (§17.1 item 4).


  fieldReset() {
    for (const [name, value] of Object.entries(this._written || {})) {
      if (value === null) this.removeAttribute(name);else this.setAttribute(name, value);
    }

    this.requestComponentUpdate('reset');
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get required() {
    return this.getBooleanAttr('required', false);
  }

  get invalid() {
    return this.getBooleanAttr('invalid', false);
  }

  get errorMessage() {
    return this.getAttribute('error-message') || '';
  }

  get closeOnSelect() {
    return this.getBooleanAttr('close-on-select', true);
  }

  get leftIcon() {
    if (this.hasAttribute('icon-start')) return this.getAttribute('icon-start');
    return this.getAttribute('left-icon') || 'calendar_today';
  }

  get iconStart() {
    return this.leftIcon;
  }

  get inputRootClass() {
    return this.getAttribute('input-root-class') || '';
  }

  get mask() {
    return this.getBooleanAttr('mask', false);
  }

  get maskPattern() {
    return this.getAttribute('mask-pattern') || this.formatToMask(this.format);
  }

  get maskLazy() {
    return this.hasAttribute('mask-lazy') ? this.getBooleanAttr('mask-lazy', false) : false;
  }

  get maskPlaceholderChar() {
    return this.getAttribute('mask-placeholder-char') || '_';
  }

  get maskOptions() {
    return this.getAttribute('mask-options') || '';
  }

  get year() {
    const fallback = this.anchorDate.getFullYear();
    return this.hasAttribute('year') ? this.getNumberAttr('year', fallback) : fallback;
  }

  set year(nextValue) {
    this.setState({
      year: nextValue === null || typeof nextValue === 'undefined' || nextValue === '' ? '' : String((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(nextValue, new Date().getFullYear()))
    });
    this._gridMoved = false;
  }

  get month() {
    const fallback = this.anchorDate.getMonth();
    return this.hasAttribute('month') ? normalizeMonth(this.getAttribute('month'), fallback) : fallback;
  }

  set month(nextValue) {
    this.setState({
      month: nextValue === null || typeof nextValue === 'undefined' || nextValue === '' ? '' : String(normalizeMonth(nextValue, new Date().getMonth()))
    });
    this._gridMoved = false;
  }

  get contextMode() {
    return this.getEnumAttr('context', ['month', 'year', ''], '');
  } // The week starts where the page's language starts it when the attribute
  // does not say: Monday for ru, Sunday for en-US (docs trial 4: a
  // Sunday-first locale needed a manual attribute).
  // Any day may open the week, 0 Sunday to 6 Saturday: the grid counts from
  // it modulo seven. Only Sunday and Monday were kept, so a Saturday-first
  // locale (ar-EG, fa-IR) got Monday (documentation trial 6, 2026-10-18).


  get weekStart() {
    if (this.hasAttribute('week-start')) {
      const day = this.getNumberAttr('week-start', 1);
      return Number.isInteger(day) && day >= 0 && day <= 7 ? day % 7 : 1;
    }

    try {
      const locale = new Intl.Locale(this.locale);
      const info = typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : locale.weekInfo;
      if (info?.firstDay) return info.firstDay % 7;
    } catch {// An unknown locale keeps the Monday the grid always had.
    }

    return 1;
  }

  get locale() {
    return normalizeLocale(this.getAttribute('locale'), this);
  }

  get format() {
    return this.getAttribute('format') || 'DD.MM.YYYY';
  } // The name for a field whose label is drawn outside it -- a record panel
  // prints the label itself, and passing it to the control printed it twice.


  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // Read-only as the field draws it, not just the attribute: a range is always
  // chosen on the grid (one field holding two dates has no single format to
  // read back), so `range` alone makes the field read-only. The template reads
  // this same value -- it once read `!this.typed`, which also counted
  // `disabled`, so a range or disabled field drew read-only while the
  // component said it was not.


  get readonly() {
    return this.range || this.getBooleanAttr('readonly', false);
  } // A date can be typed. The field was hard-readonly, so a host that edits a
  // date could only pick one on the grid -- and the mask properties beside it
  // reached a field nobody could type in (Larena storage QA, 2026-10-22).
  // A range is still chosen on the grid -- `readonly` already says so.


  get typed() {
    return !this.readonly && !this.disabled;
  }

  get formattedValue() {
    return formatDateValue(this.selectedDate, this.format);
  }

  get formattedStartValue() {
    return formatDateValue(this.startDate, this.format);
  }

  get formattedEndValue() {
    return formatDateValue(this.endDate, this.format);
  }

  get displayValue() {
    if (!this.range) {
      return this.formattedValue;
    }

    if (this.formattedStartValue && this.formattedEndValue) {
      return `${this.formattedStartValue} - ${this.formattedEndValue}`;
    }

    return this.formattedStartValue || this.formattedEndValue || '';
  }

  get displayDate() {
    return new Date(this.year, this.month, 1);
  }

  get isRtl() {
    return (this.closest('[dir]')?.getAttribute('dir') || document.documentElement?.dir) === 'rtl';
  }

  get labels() {
    return getLabels(this);
  }

  get weekdays() {
    return getWeekdays(this.locale, this.weekStart);
  }

  get calendarLabel() {
    try {
      return new Intl.DateTimeFormat(this.locale, {
        month: 'long',
        year: 'numeric'
      }).format(this.displayDate);
    } catch {
      return `${this.month + 1}.${this.year}`;
    }
  }

  get activeDate() {
    const candidate = parseDate(this.state.activeDate) || this.primaryDate || this.displayDate;
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(candidate, minDate) < 0) return minDate;
    if (maxDate && compareDates(candidate, maxDate) > 0) return maxDate;
    return candidate;
  }

  get normalizedRange() {
    const startDate = this.startDate;
    const endDate = this.endDate;

    if (!startDate || !endDate) {
      return {
        startDate,
        endDate
      };
    }

    if (compareDates(startDate, endDate) <= 0) {
      return {
        startDate,
        endDate
      };
    }

    return {
      startDate: endDate,
      endDate: startDate
    };
  }

  get days() {
    const firstDay = new Date(this.year, this.month, 1);
    const firstWeekDay = firstDay.getDay();
    const offset = (firstWeekDay - this.weekStart + 7) % 7;
    const gridStartDate = new Date(this.year, this.month, 1 - offset);
    const {
      startDate,
      endDate
    } = this.normalizedRange;
    const hasRangeEnd = Boolean(this.startValue && this.endValue);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const activeDate = this.activeDate;
    const today = new Date();
    return Array.from({
      length: 42
    }).map((_, index) => {
      const date = new Date(gridStartDate.getFullYear(), gridStartDate.getMonth(), gridStartDate.getDate() + index);
      const time = date.getTime();
      const disabled = Boolean(minDate && time < minDate.getTime() || maxDate && time > maxDate.getTime());
      return {
        date,
        value: formatIsoDate(date),
        formattedValue: formatDateValue(date, this.format),
        label: getDateLabel(date, this.locale),
        day: date.getDate(),
        today: sameDay(date, today),
        currentMonth: date.getMonth() === this.month,
        weekend: [0, 6].includes(date.getDay()),
        disabled: disabled,
        selected: this.range ? sameDay(date, startDate) || sameDay(date, endDate) : sameDay(date, this.selectedDate),
        rangeStart: this.range && hasRangeEnd && sameDay(date, startDate),
        rangeEnd: this.range && hasRangeEnd && sameDay(date, endDate),
        rangeSelected: this.range && hasRangeEnd && isBetweenDates(date, startDate, endDate),
        tabIndex: !disabled && sameDay(date, activeDate) ? 0 : -1
      };
    });
  }

  get months() {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const minMonth = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), 1) : null;
    const maxMonth = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), 1) : null;
    return Array.from({
      length: 12
    }).map((_, index) => {
      const date = new Date(this.year, index, 1);
      const time = date.getTime();
      const disabled = Boolean(minMonth && time < minMonth.getTime() || maxMonth && time > maxMonth.getTime());
      return {
        index,
        label: getMonthLabel(index, this.locale),
        selected: index === this.month,
        disabled
      };
    });
  }

  get years() {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const start = this.yearPageStart;
    return Array.from({
      length: YEARS_PAGE_SIZE
    }).map((_, index) => {
      const year = start + index;
      const disabled = Boolean(minDate && year < minDate.getFullYear() || maxDate && year > maxDate.getFullYear());
      return {
        year,
        disabled: disabled,
        selected: year === this.year
      };
    });
  }

  get yearPageStart() {
    return this.state.yearPageStart ?? this.getYearPageStart(this.year);
  }

  get yearPageEnd() {
    return this.yearPageStart + YEARS_PAGE_SIZE - 1;
  }

  getYearPageStart(year = this.year) {
    const normalizedYear = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(year, new Date().getFullYear());
    return normalizedYear - normalizedYear % YEARS_PAGE_SIZE;
  }

  formatToMask = format => {
    let mask = String(format).replace(/[A-Za-z]/g, '0');

    if (this.range) {
      mask += ` - ${mask}`;
    }

    return mask;
  };

  setContext(nextContext = '') {
    this.setState({
      context: nextContext || ''
    });
    return this;
  }

  toggleContext(nextContext) {
    const nextMode = this.contextMode === nextContext ? '' : nextContext;
    const nextState = {
      context: nextMode
    };

    if (nextMode === 'year') {
      nextState.yearPageStart = this.getYearPageStart(this.year);
    }

    this.setState(nextState);
    return this;
  }

  shiftYearPage(direction = 1) {
    this.set({
      yearPageStart: this.yearPageStart + YEARS_PAGE_SIZE * direction
    });
    return this;
  }

  shiftMonth(direction = 1) {
    const next = new Date(this.year, this.month + direction, 1);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && next < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) return this;
    if (maxDate && next > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) return this;
    this.setState({
      year: next.getFullYear(),
      month: next.getMonth(),
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(next)
    });
    return this;
  }

  setActiveDate(value) {
    const date = parseDate(value);
    if (!date || this.state.activeDate === value) return this;
    this.set({
      activeDate: formatIsoDate(date)
    });
    return this;
  }

  moveActiveDate(days) {
    const next = new Date(this.activeDate);
    next.setDate(next.getDate() + days);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(next, minDate) < 0) return this;
    if (maxDate && compareDates(next, maxDate) > 0) return this;
    this._focusDateAfterRender = true;
    this.setState({
      year: next.getFullYear(),
      month: next.getMonth(),
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(next)
    });
    return this;
  }

  _openPanel({
    focusCalendar = false
  } = {}) {
    if (this.disabled) return this;
    this._focusCalendarOnOpen = focusCalendar;
    if (!this.open) this.showValueMonth();else if (!this.state.activeDate) {
      this.set({
        activeDate: formatIsoDate(this.activeDate)
      });
    }

    if (this.open) {
      this.positionPanel();
      return this;
    }

    this.setState({
      open: true
    });
    return this;
  }

  _closePanel({
    restoreFocus = false
  } = {}) {
    if (!this.open) {
      return this;
    }

    this.setState({
      open: false,
      context: ''
    });
    if (restoreFocus) requestAnimationFrame(() => this._input?.focus?.());
    return this;
  }

  _togglePanel() {
    return this.open ? this._closePanel() : this._openPanel();
  } // What is typed is read through the declared format, so «14.10.2026» and
  // «2026-10-14» both land. Text that is not a date, or a date outside the
  // allowed range, puts the field back to the value it held: a half-typed date
  // must not clear a stored one. An emptied field clears the value, because
  // deleting the text is how a person says there is no date.


  handleInputChange(event) {
    if (!this.typed) return; // The field's own change belongs to the component, not to the page: it
    // carries the display text, and a host reading `event.target.value` on
    // it would store «14.10.2026» where it expects the ISO value. The
    // component says the change itself, once, through emitChange.

    if (event?.type === 'change') event.stopPropagation();
    const field = event?.target;
    const text = String(field?.value ?? '').trim();

    const restore = () => {
      const input = field?.querySelector?.('input') || field;
      if (input && 'value' in input) input.value = this.displayValue;
    };

    if (!text) {
      if (!this.date) return;
      this.setState({
        date: '',
        context: ''
      });
      this.emitChange();
      return;
    }

    const date = parseDateValue(text, this.format);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const outOfRange = Boolean(date) && (minDate && compareDates(date, minDate) < 0 || maxDate && compareDates(date, maxDate) > 0);

    if (!date || outOfRange) {
      restore();
      return;
    }

    const value = formatIsoDate(date);

    if (value === this.date) {
      restore();
      return;
    }

    this.setState({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: value,
      context: ''
    });
    this.set({
      activeDate: value
    });
    this.emitChange();
  } // Typing is not a change: the value is read when the field says it changed,
  // so the keystrokes stay inside the component too.


  handleInputInput(event) {
    if (this.typed) event?.stopPropagation?.();
  }

  handleInputClick(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    this._openPanel();
  }

  handleInputKeydown(event) {
    // In a field that can be typed in, Enter commits the text and the space
    // bar belongs to the text; ArrowDown still opens the grid.
    if (this.typed) {
      if (event.key !== 'ArrowDown' && event.key !== 'Enter') return;
      event.preventDefault();

      if (event.key === 'Enter') {
        this.handleInputChange(event);
        return;
      }

      this._openPanel({
        focusCalendar: true
      });

      return;
    }

    if (!['ArrowDown', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();

    this._openPanel({
      focusCalendar: true
    });
  }

  handleDayKeydown(event, day) {
    const horizontal = this.isRtl ? -1 : 1;
    const keySteps = {
      ArrowLeft: -horizontal,
      ArrowRight: horizontal,
      ArrowUp: -7,
      ArrowDown: 7
    };

    if (Object.prototype.hasOwnProperty.call(keySteps, event.key)) {
      event.preventDefault();
      this.moveActiveDate(keySteps[event.key]);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const date = day?.date || this.activeDate;
      const offset = (date.getDay() - this.weekStart + 7) % 7;
      this.moveActiveDate(event.key === 'Home' ? -offset : 6 - offset);
      return;
    }

    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const direction = event.key === 'PageUp' ? -1 : 1;
      let next = shiftDateByMonth(this.activeDate, direction);
      const minDate = this.setMinDate();
      const maxDate = this.setMaxDate();
      if (minDate && compareDates(next, minDate) < 0) next = minDate;
      if (maxDate && compareDates(next, maxDate) > 0) next = maxDate;
      this._focusDateAfterRender = true;
      this.setState({
        year: next.getFullYear(),
        month: next.getMonth()
      });
      this.set({
        activeDate: formatIsoDate(next)
      });
    }
  }

  handlePanelClick(event) {
    event?.stopPropagation?.();
  }

  handleDocumentClick(event) {
    if (!this.open) {
      return;
    }

    const target = event.target;

    if (this.contains(target) || this.refs.datePickerPanel.value?.contains?.(target)) {
      return;
    }

    this._closePanel();
  } // An open calendar owns Escape: the press closes the calendar, the focus goes
  // back to the field, and nothing behind it -- a drawer, a modal, a record
  // panel -- sees the press. It listened in the bubble phase and raised no
  // mark, so a drawer listening before it and a record panel listening in
  // capture both closed first, and the date typed into the field went with
  // the panel (Larena admin acceptance, 2026-10-22). Now it listens in capture
  // like every other surface that owns Escape, holds the shared open-surface
  // mark while open, and acts only as the innermost open layer, so a calendar
  // inside a popover closes before the popover does.


  handleDocumentKeydown(event) {
    if (!this.open || event.key !== 'Escape' || event.defaultPrevented) {
      return;
    }

    if (!(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__.isTopOpenSurface)(this)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.contextMode) {
      this.setContext('');
      return;
    }

    this._closePanel({
      restoreFocus: true
    });
  }

  syncOverlayListeners() {
    const open = Boolean(this.input && this.open);
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__.holdOpenSurfaceMark)(this, open);

    if (open) {
      document.addEventListener('click', this._documentClickHandler);
      document.addEventListener('keydown', this._documentKeydownHandler, true);
      return;
    }

    this.removeOverlayListeners();
  }

  removeOverlayListeners() {
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__.holdOpenSurfaceMark)(this, false);
    document.removeEventListener('click', this._documentClickHandler);
    document.removeEventListener('keydown', this._documentKeydownHandler, true);
    this.stopPanelPosition();
    window.removeEventListener('resize', this._viewportHandler);
    document.removeEventListener('scroll', this._viewportHandler, true);
    window.visualViewport?.removeEventListener('resize', this._viewportHandler);
    window.visualViewport?.removeEventListener('scroll', this._viewportHandler);
  }

  positionPanel() {
    const panel = this.refs.datePickerPanel.value; // Anchor to the visible field frame, not the bare text input inside it.

    const trigger = this._input?.closest('.sf-input-field') || this._input || this.querySelector('sf-input'); // A deferred call after disconnect must not start tracking detached nodes.

    if (!this.isConnected || !this.input || !this.portal || !this.open || !panel?.isConnected || !trigger) {
      this.stopPanelPosition();
      return;
    } // Shared Framework geometry (SF.Position on Floating UI): below the
    // field, flipped above when it does not fit, shifted and height-limited
    // inside the viewport, following scroll and resize on its own.


    if (!this._panelAnchor || this._panelAnchorPanel !== panel || this._panelAnchorTrigger !== trigger) {
      this.stopPanelPosition();
      Object.assign(panel.style, {
        overflowY: 'auto',
        zIndex: 'var(--sf-z-index-9)'
      });
      this._panelAnchorPanel = panel;
      this._panelAnchorTrigger = trigger;
      this._panelAnchor = (globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default())).anchor(trigger, panel, {
        side: 'block-end',
        align: 'start',
        onPosition: ({
          side
        }) => {
          const openAbove = side === 'block-start';
          if (Boolean(this.state.openAbove) !== openAbove) this.set({
            openAbove
          });
        }
      });
      return;
    }

    this._panelAnchor.update();
  }

  stopPanelPosition() {
    this._panelAnchor?.stop();
    this._panelAnchor = null;
    this._panelAnchorPanel = null;
    this._panelAnchorTrigger = null;
  }

  selectDate(day) {
    if (!day?.date || day.disabled) {
      return this;
    }

    if (this.range) {
      this.selectRangeDate(day);
      return this;
    }

    this.setState({
      year: day.date.getFullYear(),
      month: day.date.getMonth(),
      date: day.value,
      context: ''
    });
    this.set({
      activeDate: day.value
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  }

  selectRangeDate(day) {
    if (!this.startValue || this.startValue && this.endValue) {
      this.setState({
        year: day.date.getFullYear(),
        month: day.date.getMonth(),
        startValue: day.value,
        endValue: '',
        date: day.value,
        context: '',
        preset: ''
      });
      this.set({
        activeDate: day.value
      });
      this.emitChange();
      return this;
    }

    const startDate = this.startDate;
    const nextState = {
      year: day.date.getFullYear(),
      month: day.date.getMonth(),
      context: '',
      preset: ''
    };

    if (startDate && compareDates(day.date, startDate) < 0) {
      nextState.startValue = day.value;
      nextState.endValue = this.startValue;
      nextState.date = day.value;
    } else {
      nextState.endValue = day.value;
      nextState.date = this.startValue;
    }

    this.setState(nextState);
    this.set({
      activeDate: day.value
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  } // A quick range: its dates, the grid on the month it ends in, and the change
  // said once, by the person's choice -- never by a render.


  _choosePreset(item) {
    if (!item || item.disabled) return this;
    const from = formatIsoDate(item.from);
    const to = formatIsoDate(item.to);
    this.setState({
      preset: item.id,
      startValue: from,
      endValue: to,
      date: from,
      year: item.to.getFullYear(),
      month: item.to.getMonth(),
      context: ''
    });
    this.set({
      activeDate: to
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  } // «Свой период»: the quick range lets go and the person picks on the grid.


  _chooseCustomRange() {
    if (this.preset) this.setState({
      preset: '',
      startValue: '',
      endValue: '',
      date: ''
    });
    this._focusDateAfterRender = true;
    this.requestComponentUpdate('custom-range');
    return this;
  } // The list is one tab stop: arrows move along it, Tab goes on to the grid.


  handlePresetKeydown(event) {
    const keys = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1
    };
    if (!(event.key in keys) && event.key !== 'Home' && event.key !== 'End') return;
    const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled)')];
    if (!buttons.length) return;
    event.preventDefault();
    const index = buttons.indexOf(event.target);
    let next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : index + keys[event.key];
    if (this.isRtl && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) next = index - keys[event.key];
    next = (next + buttons.length) % buttons.length;
    buttons.forEach((button, at) => button.setAttribute('tabindex', at === next ? '0' : '-1'));
    buttons[next].focus();
  }

  selectMonth(month) {
    if (!month || month.disabled) {
      return this;
    }

    this.setState({
      month: month.index,
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(new Date(this.year, month.index, 1))
    });
    return this;
  }

  selectYear(year) {
    if (!year || year.disabled) {
      return this;
    }

    const nextState = {
      year: year.year,
      context: ''
    };
    const nextMonth = this.getClosestEnabledMonth(year.year, this.month);

    if (nextMonth !== this.month) {
      nextState.month = nextMonth;
    }

    this.setState(nextState);
    this.set({
      activeDate: formatIsoDate(new Date(year.year, nextMonth, 1))
    });
    return this;
  }

  getClosestEnabledMonth(year, month) {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();

    if (minDate && year === minDate.getFullYear() && month < minDate.getMonth()) {
      return minDate.getMonth();
    }

    if (maxDate && year === maxDate.getFullYear() && month > maxDate.getMonth()) {
      return maxDate.getMonth();
    }

    return month;
  }

  emitChange() {
    // date and isoValue mean one thing in both modes: the ISO value. For a
    // range that is the ISO 8601 interval start/end (the start alone while
    // the end is not chosen); they were the formatted range and the start
    // (docs trial 4).
    const interval = this.startValue && this.endValue ? `${this.startValue}/${this.endValue}` : this.startValue || '';
    const detail = this.range ? {
      value: [this.startValue, this.endValue],
      date: interval,
      startValue: this.startValue,
      endValue: this.endValue,
      formattedValue: this.displayValue,
      formattedStartValue: this.formattedStartValue,
      formattedEndValue: this.formattedEndValue,
      isoValue: interval,
      startIsoValue: this.startValue,
      endIsoValue: this.endValue,
      range: true,
      format: this.format,
      // The quick range chosen, so a host can store «last 7 days»
      // rather than the dates it meant today.
      preset: this.activePreset ? this.activePreset.relative ? {
        id: this.activePreset.id,
        relative: this.activePreset.relative
      } : {
        id: this.activePreset.id
      } : null
    } : {
      value: this.date,
      date: this.date,
      formattedValue: this.formattedValue,
      isoValue: this.date,
      range: false,
      format: this.format
    }; // Once, under its native name, without the element in its detail (§8);
    // the shim sends sf-datepicker-change and sf-change after it with the
    // same detail (aliases.json).

    this.sfSyncFormState();
    this.sfEmit('change', detail);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      date: this.date,
      formattedValue: this.formattedValue,
      displayValue: this.displayValue,
      startValue: this.startValue,
      formattedStartValue: this.formattedStartValue,
      endValue: this.endValue,
      formattedEndValue: this.formattedEndValue,
      range: this.range,
      format: this.format,
      selectedDate: this.selectedDate,
      startDate: this.startDate,
      endDate: this.endDate,
      year: this.year,
      month: this.month,
      monthLabel: getMonthLabel(this.month, this.locale),
      calendarLabel: this.calendarLabel,
      labels: this.labels,
      weekdays: this.weekdays,
      panelId: this._panelId,
      previousIcon: this.isRtl ? 'chevron_right' : 'chevron_left',
      nextIcon: this.isRtl ? 'chevron_left' : 'chevron_right',
      context: this.contextMode,
      locale: this.locale,
      days: this.days,
      presetItems: this.presetItems,
      months: this.months,
      years: this.years,
      yearPageStart: this.yearPageStart,
      yearPageEnd: this.yearPageEnd,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      openAbove: Boolean(this.state.openAbove),
      input: this.input,
      open: this.open,
      portal: this.portal,
      inputType: this.inputType,
      inputSize: this.inputSize,
      // The host is the form control where the browser has
      // ElementInternals, so the inner text box carries no name (§17.1
      // item 6); without them it is named, as before.
      inputName: this.inputName,
      boxName: this.sfInternals ? '' : this.inputName,
      placeholder: this.placeholder,
      label: this.label,
      ariaLabel: this.ariaLabel,
      readonly: this.readonly,
      disabled: this.disabled,
      required: this.required,
      invalid: this.invalid,
      errorMessage: this.errorMessage,
      leftIcon: this.leftIcon,
      iconStart: this.leftIcon,
      inputRootClass: this.inputRootClass,
      mask: this.mask,
      maskPattern: this.maskPattern,
      maskLazy: this.maskLazy,
      maskPlaceholderChar: this.maskPlaceholderChar,
      maskOptions: this.maskOptions
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderDatepickerTemplate)(this.templateContext());
  }

  afterRender() {
    this._input = this.refs.input?.value?.querySelector('input') || null;

    if (this._input) {
      this._input.setAttribute('aria-haspopup', 'dialog');

      this._input.setAttribute('aria-expanded', this.open ? 'true' : 'false');

      this._input.setAttribute('aria-controls', this._panelId);
    }

    const monthToggle = this.querySelector('.sf-datepicker-month-toggle button');
    const yearToggle = this.querySelector('.sf-datepicker-year-toggle button');
    monthToggle?.setAttribute('aria-expanded', this.contextMode === 'month' ? 'true' : 'false');
    yearToggle?.setAttribute('aria-expanded', this.contextMode === 'year' ? 'true' : 'false');
    this.syncOverlayListeners();
    this.sfSyncFormState();
    requestAnimationFrame(() => {
      this.positionPanel();

      if (this._focusCalendarOnOpen || this._focusDateAfterRender) {
        const active = this.querySelector(`.sf-datepicker-day[data-date="${formatIsoDate(this.activeDate)}"]`);
        active?.focus?.();
        this._focusCalendarOnOpen = false;
        this._focusDateAfterRender = false;
      }
    });
  }

  onDisconnected() {
    this.removeOverlayListeners();
    super.onDisconnected();
  }

  get data() {
    return {
      value: this.value,
      date: this.date,
      formattedValue: this.formattedValue,
      displayValue: this.displayValue,
      startValue: this.startValue,
      formattedStartValue: this.formattedStartValue,
      endValue: this.endValue,
      formattedEndValue: this.formattedEndValue,
      range: this.range,
      format: this.format,
      year: this.year,
      month: this.month,
      context: this.contextMode,
      maxDate: this.maxDate,
      minDate: this.minDate,
      locale: this.locale,
      input: this.input,
      open: this.open,
      portal: this.portal,
      mask: this.mask,
      maskPattern: this.maskPattern,
      maskOptions: this.maskOptions,
      presets: this.presetItems.map(({
        id,
        label,
        relative,
        disabled
      }) => ({
        id,
        label,
        relative,
        disabled
      })),
      preset: this.preset
    };
  }

}

SfDatepicker.define('sf-datepicker');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "77b2f4107e3b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderDatepickerTemplate: () => (/* binding */ renderDatepickerTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5a8eddcd589d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function renderYearTop(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-top flex content-main-between items-cross-center">
            <sf-icon-button appearance="link" scheme="on-surface" size="1"
                icon=${context.previousIcon} aria-label=${context.labels.previousYears}
                @click=${() => context.component.shiftYearPage(-1)}></sf-icon-button>
            <div class="sf-datepicker-range-title" aria-live="polite">
                ${context.yearPageStart}–${context.yearPageEnd}
            </div>
            <sf-icon-button appearance="link" scheme="on-surface" size="1"
                icon=${context.nextIcon} aria-label=${context.labels.nextYears}
                @click=${() => context.component.shiftYearPage(1)}></sf-icon-button>
        </div>`;
}

function renderTop(context) {
  if (context.context === 'year') return renderYearTop(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-top grid items-cross-center">
            <sf-icon-button appearance="link" scheme="on-surface" size="1"
                icon=${context.previousIcon} aria-label=${context.labels.previousMonth}
                @click=${() => context.component.shiftMonth(-1)}></sf-icon-button>
            <div class="sf-datepicker-period flex content-main-center items-cross-center gap-1/4">
                <sf-button class="sf-datepicker-month-toggle" appearance="link" scheme="on-surface" spacing="compact"
                    text=${context.monthLabel}
                    aria-expanded=${context.context === 'month' ? 'true' : 'false'}
                    @click=${() => context.component.toggleContext('month')}></sf-button>
                <sf-button class="sf-datepicker-year-toggle" appearance="link" scheme="on-surface" spacing="compact"
                    text=${String(context.year)}
                    aria-expanded="false"
                    @click=${() => context.component.toggleContext('year')}></sf-button>
            </div>
            <sf-icon-button appearance="link" scheme="on-surface" size="1"
                icon=${context.nextIcon} aria-label=${context.labels.nextMonth}
                @click=${() => context.component.shiftMonth(1)}></sf-icon-button>
        </div>`;
}

function renderMonthContext(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-context absolute top-0 bottom-0 inline-start-0 inline-end-0 grid grid-col-3 content-cross-start items-cross-start overflow-auto gap-1/4"
             aria-label=${context.labels.chooseMonth}>
            ${context.months.map(month => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text flex content-main-center items-cross-center', month.selected ? 'active' : '', month.disabled ? 'disabled' : '')}
                    ?disabled=${month.disabled} aria-pressed=${month.selected ? 'true' : 'false'}
                    type="button" @click=${() => context.component.selectMonth(month)}>
                    <span class="sf-datepicker-text-date">${month.label}</span>
                </button>`)}
        </div>`;
}

function renderYearContext(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-context absolute top-0 bottom-0 inline-start-0 inline-end-0 grid grid-col-3 content-cross-start items-cross-start overflow-auto gap-1/4"
             aria-label=${context.labels.chooseYear}>
            ${context.years.map(year => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text flex content-main-center items-cross-center', year.selected ? 'active' : '', year.disabled ? 'disabled' : '')}
                    type="button" ?disabled=${year.disabled} aria-pressed=${year.selected ? 'true' : 'false'}
                    @click=${() => context.component.selectYear(year)}>
                    <span class="sf-datepicker-text-date">${year.year}</span>
                </button>`)}
        </div>`;
}

function renderContext(context) {
  if (context.context === 'month') return renderMonthContext(context);
  if (context.context === 'year') return renderYearContext(context);
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderDatepickerInput(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input class="sf-datepicker-input" ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.input)}
            appearance=${context.inputType} size=${context.inputSize}
            label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} name=${context.boxName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-label=${context.label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            placeholder=${context.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} icon-start=${context.iconStart || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            root-class=${context.inputRootClass || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} value=${context.displayValue || ''}
            ?disabled=${context.disabled} ?required=${context.required} ?invalid=${context.invalid}
            error-message=${context.errorMessage || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} ?mask=${context.mask}
            mask-pattern=${context.maskPattern || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} mask-lazy=${String(context.maskLazy)}
            mask-placeholder-char=${context.maskPlaceholderChar || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            mask-options=${context.maskOptions || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} ?readonly=${context.readonly}
            @click=${event => context.component.handleInputClick(event)}
            @change=${event => context.component.handleInputChange(event)}
            @input=${event => context.component.handleInputInput(event)}
            @keydown=${event => context.component.handleInputKeydown(event)}></sf-input>`;
}

function renderDay(day, context) {
  const classes = joinClasses('sf-datepicker-day', day.weekend ? 'sf-datepicker-day-off' : '', day.selected ? 'active' : '', day.rangeStart ? 'sf-datepicker-day-start' : '', day.rangeSelected ? 'sf-datepicker-day-selected' : '', day.rangeEnd ? 'sf-datepicker-day-end' : '', day.currentMonth ? '' : 'sf-datepicker-another-month', day.disabled ? 'disabled' : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button class=${classes} type="button" ?disabled=${day.disabled}
            data-date=${day.value} aria-label=${day.label}
            aria-current=${day.today ? 'date' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-pressed=${day.selected ? 'true' : 'false'} tabindex=${day.tabIndex}
            @click=${() => context.component.selectDate(day)}
            @focus=${() => context.component.setActiveDate(day.value)}
            @keydown=${event => context.component.handleDayKeydown(event, day)}>
            <span class="sf-datepicker-day-date">${day.day}</span>
        </button>`;
}

function renderPresets(context) {
  const items = context.presetItems;
  if (!items.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One tab stop: the pressed range, or the first one that can be chosen.

  const focusable = items.find(item => item.pressed && !item.disabled) ?? items.find(item => !item.disabled); // «Свой период» is pressed for a range picked on the grid, not for no range.

  const custom = !items.some(item => item.pressed) && Boolean(context.startValue);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-presets flex flex-col gap-1/4" role="group" aria-label=${context.labels.presets}
            @keydown=${event => context.component.handlePresetKeydown(event)}>
            ${items.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text sf-datepicker-preset flex items-cross-center', item.pressed ? 'active' : '')}
                    type="button" ?disabled=${item.disabled} aria-pressed=${item.pressed ? 'true' : 'false'}
                    tabindex=${item === focusable ? '0' : '-1'} data-preset=${item.id}
                    @click=${() => context.component.choosePreset(item)}>${item.label}</button>`)}
            <button class=${joinClasses('sf-datepicker-text sf-datepicker-preset flex items-cross-center', custom ? 'active' : '')}
                type="button" aria-pressed=${custom ? 'true' : 'false'} tabindex=${focusable ? '-1' : '0'} data-preset=""
                @click=${() => context.component.chooseCustomRange()}>${context.labels.customRange}</button>
        </div>`;
}

function renderDatepickerPanel(context) {
  const rootClasses = joinClasses('sf-datepicker inline-flex', context.presetItems.length ? 'sf-datepicker--presets' : '', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.datePickerPanel)} id=${context.panelId}
            class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            role=${context.input ? 'dialog' : 'group'} aria-label=${context.calendarLabel}
            @click=${event => context.component.handlePanelClick(event)}>
            ${renderPresets(context)}
            <div class="sf-datepicker-container flex flex-col">
                ${renderTop(context)}
                <div class="sf-datepicker-weekdays grid grid-col-7" aria-hidden="true">
                    ${context.weekdays.map(weekday => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-datepicker-weekday">${weekday}</span>`)}
                </div>
                <div class="sf-datepicker-main relative">
                    ${renderContext(context)}
                    <div class="sf-datepicker-grid grid grid-col-7">
                        ${context.days.map(day => renderDay(day, context))}
                    </div>
                </div>
            </div>
        </div>`;
}

function renderDatepickerTemplate(context) {
  if (!context.input) return renderDatepickerPanel(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class=${joinClasses('sf-datepicker-wrap inline-flex flex-col relative', context.open ? 'is-open' : '', context.openAbove ? 'sf-datepicker-wrap--drop-up' : 'sf-datepicker-wrap--drop-down')}
            ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.datePickerRoot)} data-portal=${context.portal ? 'true' : 'false'}>
            ${renderDatepickerInput(context)}
            ${context.open ? renderDatepickerPanel(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "5a8eddcd589d"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/ref.js") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit/directives/ref.js")), { once: true })));

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "5c1dc214bb5e"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("position")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

/***/ },

/***/ "7cb84e1fa3a3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-datepicker","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-datepicker","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-datepicker-change","to":"change","kind":"event","component":"sf-datepicker","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail; the detail no longer carries the element (§8)"},{"from":"sf-change","to":"change","kind":"event","component":"sf-datepicker","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail; the detail no longer carries the element (§8)"}]}');

/***/ },

/***/ "ef6661f4d1bb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-datepicker\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/datepicker (migration/convert-1.3.8.mjs from simai/ui-source@5100227 src/smart/datepicker/smart.manifest.json); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Its x-todo are decided in x-decisions.","id":"smart.datepicker","tag":"sf-datepicker","version":"1.1.0","kind":"leaf","family":"field","settings":{"date":{"type":"string","default":""},"start-value":{"type":"string","default":""},"end-value":{"type":"string","default":""},"max-date":{"type":"string","default":""},"min-date":{"type":"string","default":""},"range":{"type":"boolean","default":false},"month":{"type":"number","optional":true,"integer":true,"min":0,"max":11},"year":{"type":"number","optional":true,"integer":true},"context":{"type":"enum","values":["","month","year"],"default":""},"week-start":{"type":"number","optional":true,"integer":true,"min":0,"max":6},"locale":{"type":"string","default":""},"format":{"type":"string","default":"DD.MM.YYYY"},"close-on-select":{"type":"boolean","default":true},"input":{"type":"boolean","default":true},"portal":{"type":"boolean","default":true},"input-type":{"type":"string","default":"bordered"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"input-size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"input-name":{"type":"string","default":""},"placeholder":{"type":"string","default":""},"label":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"required":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"icon-start":{"type":"icon","default":"calendar_today"},"left-icon":{"type":"icon","default":"calendar_today"},"input-root-class":{"type":"string","default":""},"mask":{"type":"boolean","default":false},"mask-pattern":{"type":"string","default":"00.00.0000"},"mask-lazy":{"type":"boolean","default":false},"mask-placeholder-char":{"type":"string","default":"_"},"mask-options":{"type":"string","default":""},"name":{"type":"string","default":""},"preset":{"type":"string","default":""},"readonly":{"type":"boolean","default":false},"presets":{"type":"list","default":[],"of":{"id":"id","label":{"type":"string","optional":true},"relative":{"type":"enum","values":["today","yesterday","last-7-days","last-30-days","this-week","this-month","last-month"],"optional":true},"range":{"type":"list","optional":true}},"summary":"Quick ranges, range mode only; the attribute keeps its comma list of built-in ids"}},"values":{"value":{"type":"string","default":""},"open":{"type":"boolean","default":false}},"events":{"change":{"carries":{"value":"object","date":"string","start-value":"string","end-value":"string","formatted-value":"string","iso-value":"string","range":"boolean","format":"string","preset":"object"}}},"actions":{"open-panel":{"with":{"options":"object"},"x-outcomes":["applied","refused"]},"close-panel":{"with":{"options":"object"},"x-outcomes":["applied","refused"]},"toggle-panel":{"x-outcomes":["applied","refused"]},"choose-preset":{"with":{"item":"object"},"x-outcomes":["applied","refused"]},"choose-custom-range":{"x-outcomes":["applied","refused"]}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"layer":{"kind":"surface","traps-focus":false},"keyboard":{"host":{"Tab":"reach","Shift+Tab":"reach","ArrowDown":"open","Escape":"close"},"panel":{"ArrowLeft":"focus:prev","ArrowRight":"focus:next","ArrowUp":"step:-7","ArrowDown":"step:+7","Home":"focus:first","End":"focus:last","PageUp":"step:-page","PageDown":"step:+page","Enter":"select","Space":"select","Escape":"close"}},"templates":{"default":{"file":"js/templates/default.js"}},"examples":"examples.json","docs":"docs.md","lang":"lang/","accessibility":{"role":"dialog","name":{"from":["label","aria-label"]},"keys":{"Tab":"reach","Shift+Tab":"reach","ArrowDown":"open","Escape":"close","ArrowLeft":"focus:prev","ArrowRight":"focus:next","ArrowUp":"step:-7","Home":"focus:first","End":"focus:last","PageUp":"step:-page","PageDown":"step:+page","Enter":"select","Space":"select"}},"css-variables":{"--sf-datepicker-background-color":{"type":"color","state":"open"},"--sf-datepicker-day-color":{"type":"color","state":"rest"},"--sf-datepicker-selected-background-color":{"type":"color","state":"selected"},"--sf-datepicker-selected-color":{"type":"color","state":"selected"},"--sf-datepicker-range-background-color":{"type":"color","state":"in-range"},"--sf-datepicker-weekday-color":{"type":"color","state":"rest"}},"x-summary":"Accessible date and date-range picker with popup and inline presentation, calendar navigation and host-owned values.","x-source":{"package":"framework","folder":"datepicker","manifest":"simai/ui-source@5100227 src/smart/datepicker/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/datepicker.component.json"},"x-words":["placeholder","label"],"x-renamed":["settings.aria-label: a host attribute, read by the base, never a setting (§3.1)"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source source and machine manifest","data":"host","effects":"component","forbidden_client_responsibilities":["timezone policy","business-day validation","persistence","backend access decisions","host route invention"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop-popup","mobile-popup","inline","visual-viewport-bounded-overlay"]},"ai_guidance":{"use_when":"Use sf-datepicker for a single date or date range that benefits from calendar navigation. Use a plain input when free-form entry is the primary task.","do_not":["Do not copy generated ui-smart code","Do not use color as the only selected or disabled signal","Do not encode timezone or business-date rules in the visual component","Do not move host data or access decisions into the component"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<sf-datepicker label=\\"Дата\\" value=\\"2026-09-03\\"></sf-datepicker>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["assembly: it stays a leaf. The one interactive Smart part it places is its own text box (sf-input), wired privately for typing, masks and focus; the grid, the month and year lists and the quick ranges are its own markup. An assembly would declare keys, roles and rules to wire a single text box no rule can reach better than the leaf does (the smaller mechanism)","version: 1.1.0 -- sf-datepicker-change and sf-change follow change behind dated aliases, presets becomes a list, the actions answer outcomes; a minor while the aliases hold (§4.10)","a11y-role: dialog while it opens from its text box; inline (input=false) the panel is a group. The role field takes one value in 1.3.8, so the inline case is written here","key-effects: the text box opens the calendar with ArrowDown and closes it with Escape; in the grid (panel) Left and Right move a day, Up and Down a week (step:-7/+7), Home and End to the week\'s first and last day, PageUp and PageDown a month, Enter and Space choose","type-union: presets is a list of {id, label?, relative?, range?}; the attribute keeps its comma list of built-in ids","item-shape: value is the date in the ISO form (YYYY-MM-DD); in range mode the property is [start-value, end-value] and the form submits start/end (ISO 8601 interval); the host owns the stored value","template: the default template stays the Lit module js/templates/default.js, the migration form §5.2 allows; template.html follows when the build compiles HTML templates","examples: examples.json from studio.fixture.json and the docs","css-variables: six public variables read by the class sheets with the role as fallback (§6)","side-effects: none -- with portal the panel is positioned as fixed in place; it is never moved to the end of body","form: the host is the form control through ElementInternals (§17.1): the ISO date (a range as start/end), never the display text; nothing while disabled; read-only submits; form.reset() returns the written value without events. The inner sf-input carries no name. value-missing while required and empty","actions: open-panel, close-panel, toggle-panel, choose-preset {item} and choose-custom-range answer outcomes (§4.4)","ids: the panel id comes from the instance path (§7.1.1), not a module counter"]}');

/***/ },

/***/ "0b816e511c59"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Datepicker","runtime":{"choose-month":"Choose a month","choose-year":"Choose a year","custom-range":"Custom range","next-month":"Next month","next-years":"Next years","preset-last-month":"Last month","preset-last30-days":"Last 30 days","preset-last7-days":"Last 7 days","preset-this-month":"This month","preset-this-week":"This week","preset-today":"Today","preset-yesterday":"Yesterday","presets":"Quick ranges","previous-month":"Previous month","previous-years":"Previous years","value-missing":"Choose a date."}}');

/***/ },

/***/ "aa7064807ed2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Календарь","runtime":{"choose-month":"Выберите месяц","choose-year":"Выберите год","custom-range":"Свой период","next-month":"Следующий месяц","next-years":"Следующие годы","preset-last-month":"Прошлый месяц","preset-last30-days":"Последние 30 дней","preset-last7-days":"Последние 7 дней","preset-this-month":"Этот месяц","preset-this-week":"Эта неделя","preset-today":"Сегодня","preset-yesterday":"Вчера","presets":"Быстрый выбор","previous-month":"Предыдущий месяц","previous-years":"Предыдущие годы","value-missing":"Выберите дату."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("b9b65955223a");
/******/
/******/ })()
;