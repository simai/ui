/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "4130d35a368a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeSlideContent: () => (/* binding */ normalizeSlideContent)
/* harmony export */ });
// Ignore source formatting, not authored slide boundaries. Non-Node values are
// retained for the existing Slider template context (including Lit results).
function normalizeSlideContent(content) {
  const items = Array.isArray(content) ? content : [content];
  return items.filter(item => {
    if (!(item instanceof Node)) return true;
    if (item.nodeType === Node.COMMENT_NODE) return false;
    return item.nodeType !== Node.TEXT_NODE || item.textContent.trim() !== '';
  });
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
/* harmony import */ var _page_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("51e3a200cf5f");
/* harmony import */ var _host_port_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f171c5ece4b4");
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
 *   actions   `{<action>(params, {signal}) => outcome}`, the actions' code.
 */


function elementFromManifest(manifest, {
  base,
  lang = {},
  source,
  aliases,
  actions = {}
} = {}) {
  const Base = base || globalThis.SF?.smart?.SfBaseElement;
  if (typeof Base !== 'function') throw new TypeError('elementFromManifest: a base class is required');
  const read = readManifest(manifest);
  const generatedProps = propsFromManifest(manifest);
  const words = Object.fromEntries(Object.entries(lang).map(([locale, file]) => [locale.toLowerCase(), { ...(file?.runtime || {})
  }]));
  const sourceLanguage = source || Object.keys(words)[0] || '';
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
      return (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(words, key, this, {
        component: this.localName,
        source: sourceLanguage,
        count,
        vars
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

  (0,_host_port_js__WEBPACK_IMPORTED_MODULE_3__.installPortAction)(ManifestElement.prototype);
  defineActions(ManifestElement.prototype, read.actions, actions, read.events); // data-sf-action="<id>.<action>" runs a declared action (§8 one page trigger).

  if (read.actions.length) (0,_page_actions_js__WEBPACK_IMPORTED_MODULE_2__.bindPageActions)();
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

/***/ "d0c0e64421b6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("56ae6cc9a5ec");
/* harmony import */ var _component_slider_js_slide_content__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4130d35a368a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a2bebed909d0");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("755770a8ce5c");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("281c6761571f");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("74650ab742c0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);








 // sf-gallery from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8): its settings, values and actions are made by
// core/js/element-manifest.js, and the old names -- title, blur, sf-change,
// sf-open, sf-close and the readers getModal(), getInlineSlider(),
// getLightboxSlider() -- are dated rows of aliases.json.

const GalleryElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
});

const applied = () => ({
  outcome: 'applied'
}); // What retires without a new name (aliases.json rows with `to: null`): kept
// until the date, and each call is noted with it.


function noteRetired(from) {
  (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
    component: 'sf-gallery',
    tag: 'sf-gallery',
    kind: 'action',
    from,
    to: null,
    since: _aliases_json__WEBPACK_IMPORTED_MODULE_6__.since,
    remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_6__.remove_after
  });
}

function normalizeSlotNodes(content) {
  if (!content || content === null || typeof content === 'undefined') {
    return [];
  }

  return (0,_component_slider_js_slide_content__WEBPACK_IMPORTED_MODULE_4__.normalizeSlideContent)(content).filter(node => node instanceof Node);
}

const GALLERY_TRIGGER_SELECTOR = '[data-sf-gallery]';
let delegatedGallery = null;
const DELEGATED_MODAL_DEFAULTS = {
  width: 'calc(100vw - var(--sf-space-3) * 2)',
  height: 'calc(100dvh - var(--sf-space-6) * 2)',
  overlay: 'true',
  'show-header': 'false',
  'show-close': 'true',
  'body-class': 'sf-gallery-lightbox-body h-full',
  'content-class': 'sf-gallery-lightbox-modal-content h-full min-h-0',
  'surface-class': 'p-0 border-0 radius-square bg-transparent shadow-0',
  'surface-padding': '0'
};
const DELEGATED_MODAL_ATTRIBUTES = ['heading', 'text', 'overlay', 'show-header', 'show-close', 'close-on-esc', 'close-on-overlay', 'preserve-scroll-gap', 'position', 'fullscreen', 'width', 'height', 'backdrop-blur', 'blur-type', 'overlay-class', 'close-class', 'surface-class', 'surface-padding', 'panel-class', 'header-class', 'body-class', 'content-class', 'footer-class'];
const DELEGATED_SLIDER_DEFAULTS = {
  arrows: 'true',
  dots: 'false',
  'lightbox-class': 'sf-gallery-lightbox-slider h-full'
};
const DELEGATED_SLIDER_ATTRIBUTES = ['arrows', 'dots', 'thumbs', 'loop', 'space-between', 'speed', 'button-type', 'button-size', 'dots-type', 'dots-size', 'thumbs-class', 'thumb-class', 'slide-class', 'lightbox-class']; // A trigger's data-sf-modal-title and data-sf-modal-blur still configure the
// lightbox: heading and backdrop-blur are their names since standard 1.3.8.

const DELEGATED_MODAL_ATTRIBUTE_ALIASES = {
  title: 'heading',
  blur: 'backdrop-blur'
};
const DELEGATED_SLIDER_ATTRIBUTE_ALIASES = {
  class: 'lightbox-class',
  'root-class': 'lightbox-class'
};
const LIGHTBOX_BACKGROUND_CLOSE_IGNORE_SELECTOR = ['a', 'button', 'input', 'select', 'textarea', 'label', 'summary', 'video', 'audio', 'iframe', 'img', 'picture', 'svg', '[role="button"]', '[data-sf-gallery-open]', '[data-sf-modal-close]', 'sf-button', 'sf-icon-button', '.sf-slider-controls', '.sf-slider-arrows', '.sf-slider-dots', '.sf-slider-pagination', '.sf-slider-thumbnails', '.sf-gallery-external-caption'].join(',');

function getDelegatedAttribute(trigger, items, attrNames) {
  for (const attrName of attrNames) {
    const directValue = trigger?.getAttribute?.(attrName);

    if (directValue !== null && typeof directValue !== 'undefined') {
      return directValue;
    }
  }

  for (const item of items) {
    for (const attrName of attrNames) {
      if (item.hasAttribute?.(attrName)) {
        return item.getAttribute(attrName);
      }
    }
  }

  return undefined;
}

function applyDelegatedAttribute(gallery, attrName, value, fallback) {
  const nextValue = typeof value !== 'undefined' ? value : fallback;

  if (typeof nextValue === 'undefined' || nextValue === null) {
    gallery.removeAttribute(attrName);
    return;
  }

  gallery.setAttribute(attrName, String(nextValue));
}

function applyDelegatedNamespaceOptions({
  gallery,
  trigger,
  items,
  namespace,
  attributes,
  defaults = {},
  aliases = {}
}) {
  attributes.forEach(attrName => {
    const sourceNames = [attrName, ...Object.entries(aliases).filter(([, targetName]) => targetName === attrName).map(([sourceName]) => sourceName)];
    const value = getDelegatedAttribute(trigger, items, sourceNames.flatMap(sourceName => [`data-sf-${namespace}-${sourceName}`, `data-sf-gallery-${sourceName}`]));
    applyDelegatedAttribute(gallery, attrName, value, defaults[attrName]);
  });
}

function getGalleryGroupValue(element) {
  return String(element?.getAttribute?.('data-sf-gallery') || '').trim();
}

function isUsableGalleryHref(value) {
  const normalized = String(value || '').trim();
  return normalized && normalized !== '#';
}

function getGalleryItemSource(element) {
  const image = element.matches?.('img') ? element : element.querySelector?.('img');
  const dataSource = element.getAttribute?.('data-sf-src') || element.getAttribute?.('data-src') || element.getAttribute?.('href') || element.getAttribute?.('src');

  if (isUsableGalleryHref(dataSource)) {
    return dataSource;
  }

  return image?.currentSrc || image?.src || '';
}

function getGalleryItemCaption(element) {
  const image = element.matches?.('img') ? element : element.querySelector?.('img');
  const figure = element.closest?.('figure');
  const figcaption = figure?.querySelector?.('figcaption');
  return element.getAttribute?.('data-caption') || element.getAttribute?.('title') || image?.getAttribute?.('alt') || figcaption?.textContent?.trim?.() || '';
}

function createDelegatedGallerySlide(element) {
  const source = getGalleryItemSource(element);

  if (!source) {
    return null;
  }

  const caption = getGalleryItemCaption(element);
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  figure.className = 'sf-gallery-external-slide flex flex-col gap-1 m-0';
  image.src = source;
  image.alt = caption;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.className = 'sf-gallery-external-image';
  figure.append(image);

  if (caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'sf-gallery-external-caption color-white';
    figcaption.textContent = caption;
    figure.append(figcaption);
  }

  return figure;
}

function getDelegatedGalleryItems(trigger) {
  const group = getGalleryGroupValue(trigger);

  if (!group) {
    return [trigger];
  }

  return Array.from(document.querySelectorAll(GALLERY_TRIGGER_SELECTOR)).filter(item => getGalleryGroupValue(item) === group);
}

function getDelegatedGallery() {
  if (delegatedGallery?.isConnected) {
    return delegatedGallery;
  }

  delegatedGallery = document.createElement('sf-gallery');
  delegatedGallery.setAttribute('data-sf-gallery-delegated', '');
  delegatedGallery.setAttribute('inline', 'false');
  delegatedGallery.setAttribute('lightbox', 'true');
  document.body.append(delegatedGallery);
  return delegatedGallery;
}

function configureDelegatedGallery(gallery, trigger, items) {
  applyDelegatedNamespaceOptions({
    gallery,
    trigger,
    items,
    namespace: 'modal',
    attributes: DELEGATED_MODAL_ATTRIBUTES,
    defaults: DELEGATED_MODAL_DEFAULTS,
    aliases: DELEGATED_MODAL_ATTRIBUTE_ALIASES
  });
  applyDelegatedNamespaceOptions({
    gallery,
    trigger,
    items,
    namespace: 'slider',
    attributes: DELEGATED_SLIDER_ATTRIBUTES,
    defaults: DELEGATED_SLIDER_DEFAULTS,
    aliases: DELEGATED_SLIDER_ATTRIBUTE_ALIASES
  });
}

let galleryUid = 0;

class SfGallery extends GalleryElement {
  static globalDelegationBound = false;

  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      rootClass: {
        default: ''
      }
    };
  }

  static bindGlobalDelegation() {
    if (SfGallery.globalDelegationBound) {
      return;
    }

    SfGallery.globalDelegationBound = true;
    document.addEventListener('click', SfGallery.handleDelegatedGalleryClick);
  }

  static handleDelegatedGalleryClick(event) {
    const trigger = event.target.closest?.(GALLERY_TRIGGER_SELECTOR);

    if (!trigger || trigger.closest('sf-gallery')) {
      return;
    }

    const items = getDelegatedGalleryItems(trigger);
    const slides = items.map(createDelegatedGallerySlide).filter(Boolean);

    if (!slides.length) {
      return;
    }

    const index = Math.max(items.indexOf(trigger), 0) + 1;
    event.preventDefault();
    const gallery = getDelegatedGallery();
    configureDelegatedGallery(gallery, trigger, items);
    gallery.setSlot('slide', ...slides);
    gallery.setAttribute('current', String(index));
    requestAnimationFrame(() => gallery.open(index));
  }

  constructor() {
    super();
    this._modalId = '';
    this._inlineSlider = null;
    this._lightboxSlider = null;
    this._modal = null;
    this._current = null;
    this._syncingCurrent = false;
    this._lightboxBackgroundPointerActive = false;
    this._pendingLightboxBackgroundClose = false;
    this._currentRenderMode = '';
    this._nestedDefinitionSyncQueued = false;
    this._handleGalleryClick = this._handleGalleryClick.bind(this);
    this._handleGalleryKeyDown = this._handleGalleryKeyDown.bind(this);
    this._handleInlineSlideChange = this._handleInlineSlideChange.bind(this);
    this._handleLightboxSlideChange = this._handleLightboxSlideChange.bind(this);
    this._handleLightboxBackgroundPointerDown = this._handleLightboxBackgroundPointerDown.bind(this);
    this._handleLightboxBackgroundPointerUp = this._handleLightboxBackgroundPointerUp.bind(this);
    this._handleLightboxBackgroundClick = this._handleLightboxBackgroundClick.bind(this);
    this._handleModalAfterOpen = this._handleModalAfterOpen.bind(this);
    this._handleModalAfterClose = this._handleModalAfterClose.bind(this);
    this._handleModalAfterRender = this._handleModalAfterRender.bind(this);
  }

  connectedCallback() {
    if (!this._modalId) {
      this._modalId = this.getAttribute('modal-id') || this.id || `sf-gallery-${++galleryUid}`;
    }

    super.connectedCallback();
    this.addEventListener('click', this._handleGalleryClick);
    this.addEventListener('keydown', this._handleGalleryKeyDown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleGalleryClick);
    this.removeEventListener('keydown', this._handleGalleryKeyDown);

    this._detachNestedListeners();

    super.disconnectedCallback();
  }

  get modalId() {
    return this.getAttribute('modal-id') || this._modalId || '';
  }

  get openState() {
    return this.getProp('open');
  }

  get slidesTotal() {
    const sliderTotal = this._getActiveSliderTotal();

    if (sliderTotal !== null) {
      return sliderTotal;
    }

    const slides = normalizeSlotNodes(this.getSlotContent('slide'));
    return slides.length || 0;
  }

  get current() {
    if (this._current !== null) {
      return this._normalizeCurrent(this._current);
    }

    const sliderIndex = this._getActiveSliderIndex();

    if (sliderIndex !== null) {
      return this._normalizeCurrent(sliderIndex + 1);
    }

    return this._getConfiguredCurrent();
  } // current is a value a page may also write (§4.3): the slide to show.


  set current(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('current');else this.setAttribute('current', String(value));
  }

  _getConfiguredCurrent() {
    return this._normalizeCurrent(this.getProp('current') || 1);
  }

  _normalizeCurrent(value) {
    const total = this.slidesTotal;
    const parsed = Number.parseInt(String(value || 1), 10);
    const safe = Number.isFinite(parsed) ? parsed : 1;

    if (!total) {
      return Math.max(safe, 1);
    }

    return Math.min(Math.max(safe, 1), total);
  }

  _setCurrent(index, source = 'api', options = {}) {
    const {
      emit = true,
      syncAttribute = false
    } = options;

    const next = this._normalizeCurrent(index); // The slide shown before this change: the gallery's own position, else the
    // configured one. Reading the slider here would read the new position on a
    // person's first swipe, which then sent no change at all.


    const previous = this._current !== null ? this._normalizeCurrent(this._current) : this._getConfiguredCurrent();

    if (next === previous && this._current === next) {
      return this;
    }

    this._current = next; // Keep the starting position for a pending nested Slider render, including
    // the Slider that originated this change (it must not be driven back).

    this._rememberSliderIndex(this._inlineSlider, next - 1);

    this._rememberSliderIndex(this._lightboxSlider, next - 1);

    if (syncAttribute) {
      this._syncingCurrent = true;
      this.setAttribute('current', String(next));
      this._syncingCurrent = false;
    }

    if (source !== 'inline') {
      this._syncSliderToIndex(this._inlineSlider, next - 1);
    }

    if (source !== 'lightbox') {
      this._syncSliderToIndex(this._lightboxSlider, next - 1);
    }

    if (emit && next !== previous) {
      // §8: data only; sf-change follows with the same detail until the date.
      this.sfEmit('change', {
        previous,
        current: next,
        total: this.slidesTotal,
        from: source
      });
    }

    return this;
  }

  _getActiveSliderElement() {
    if (this.openState && this._lightboxSlider) {
      return this._lightboxSlider;
    }

    return this._inlineSlider || this._lightboxSlider || null;
  }

  _getSliderIndex(sliderElement) {
    const slider = sliderElement?._boundSlider || null;

    if (!slider) {
      return null;
    }

    const index = typeof slider.realIndex === 'number' ? slider.realIndex : slider.activeIndex;
    return Number.isFinite(index) ? index : null;
  }

  _getActiveSliderIndex() {
    return this._getSliderIndex(this._getActiveSliderElement());
  }

  _getSliderTotal(sliderElement) {
    const slider = sliderElement?._boundSlider || null;

    if (!slider) {
      return null;
    }

    const indexedSlides = new Set();
    slider.slides?.forEach?.(slide => {
      const index = slide?.getAttribute?.('data-swiper-slide-index');

      if (index !== null && typeof index !== 'undefined') {
        indexedSlides.add(index);
      }
    });

    if (indexedSlides.size) {
      return indexedSlides.size;
    }

    const total = slider.slides?.length ?? sliderElement?.querySelectorAll?.('.swiper-slide')?.length ?? 0;
    return total > 0 ? total : null;
  }

  _getActiveSliderTotal() {
    return this._getSliderTotal(this._getActiveSliderElement());
  }

  get state() {
    const props = this.getPropsContext();
    return { ...props,
      modalId: this.modalId,
      open: this.openState,
      current: this.current,
      rootClass: this.getRootClass(),
      slidesTotal: this.slidesTotal
    };
  }

  templateContext() {
    return this.createTemplateContext({ ...this.state
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderGalleryTemplate)(this.templateContext());
  }

  afterRender() {
    this._detachNestedListeners();

    this._bindNestedComponents();

    this._syncSliderSlots();

    this._attachNestedListeners();

    this._syncSlidersToCurrent();

    this._queueNestedDefinitionSync();
  }

  resolveUpdateMode(changedAttributes = []) {
    if (changedAttributes.length > 0 && changedAttributes.every(name => name === 'current' || name === 'open')) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom(changedAttributes = []) {
    if (this.resolveUpdateMode(changedAttributes) !== 'dom') {
      return false;
    }

    const openChanged = changedAttributes.includes('open');
    const modalAction = this.openState ? 'open' : 'close';

    if (openChanged && typeof this._modal?.[modalAction] !== 'function') {
      return false;
    }

    if (changedAttributes.includes('current') && !this._syncingCurrent) {
      this._setCurrent(this.getProp('current'), 'api', {
        emit: false
      });
    } // Modal owns its transition. Re-rendering Gallery here would replace the
    // unchanged inline Slider during its pointer/keyboard event lifecycle.


    if (openChanged) {
      this._modal[modalAction]();
    }

    return true;
  }

  _bindNestedComponents() {
    this._inlineSlider = this.querySelector('[data-sf-gallery-slider="inline"]');
    this._modal = this.querySelector('[data-sf-gallery-modal]');
    this._lightboxSlider = this.querySelector('[data-sf-gallery-slider="lightbox"]') || this._modal?.modalRoot?.querySelector?.('[data-sf-gallery-slider="lightbox"]');
  }

  _attachNestedListeners() {
    this._modal?.addEventListener?.('sf-after-render', this._handleModalAfterRender);
    this._inlineSlider?.addEventListener?.('change', this._handleInlineSlideChange);
    this._lightboxSlider?.addEventListener?.('change', this._handleLightboxSlideChange);
    this._lightboxSlider?.addEventListener?.('pointerdown', this._handleLightboxBackgroundPointerDown, true);
    this._lightboxSlider?.addEventListener?.('pointerup', this._handleLightboxBackgroundPointerUp, true);
    this._lightboxSlider?.addEventListener?.('click', this._handleLightboxBackgroundClick, true);
    this._modal?.addEventListener?.('sf-modal-opened', this._handleModalAfterOpen);
    this._modal?.addEventListener?.('sf-modal-closed', this._handleModalAfterClose);
  }

  _detachNestedListeners() {
    this._modal?.removeEventListener?.('sf-after-render', this._handleModalAfterRender);
    this._inlineSlider?.removeEventListener?.('change', this._handleInlineSlideChange);
    this._lightboxSlider?.removeEventListener?.('change', this._handleLightboxSlideChange);
    this._lightboxSlider?.removeEventListener?.('pointerdown', this._handleLightboxBackgroundPointerDown, true);
    this._lightboxSlider?.removeEventListener?.('pointerup', this._handleLightboxBackgroundPointerUp, true);
    this._lightboxSlider?.removeEventListener?.('click', this._handleLightboxBackgroundClick, true);
    this._modal?.removeEventListener?.('sf-modal-opened', this._handleModalAfterOpen);
    this._modal?.removeEventListener?.('sf-modal-closed', this._handleModalAfterClose);
  }

  _syncSliderSlots() {
    this._syncSliderSlot(this._inlineSlider, 'inline');

    this._syncSliderSlot(this._lightboxSlider, 'lightbox');
  }

  _syncSliderSlot(sliderElement, mode) {
    if (!sliderElement?.setSlot) {
      return;
    }

    const slides = this._buildSliderSlideNodes(mode);

    if (!slides.length) {
      return;
    }

    this._rememberSliderIndex(sliderElement, this.current - 1);

    sliderElement.setSlot('slide', ...slides);
  }

  _queueNestedDefinitionSync() {
    if (this._nestedDefinitionSyncQueued) {
      return;
    }

    const needsSliderUpgrade = this._inlineSlider && !this._inlineSlider.setSlot || this._lightboxSlider && !this._lightboxSlider.setSlot;
    const needsLightboxRender = this.getProp('lightbox') && !this._lightboxSlider;
    const needsModalUpgrade = this._modal && !this._modal.open;

    if (!needsSliderUpgrade && !needsModalUpgrade && !needsLightboxRender) {
      return;
    }

    this._nestedDefinitionSyncQueued = true;
    const waits = [];

    if (needsSliderUpgrade && window.customElements?.whenDefined) {
      waits.push(window.customElements.whenDefined('sf-slider'));
    }

    if (needsModalUpgrade && window.customElements?.whenDefined) {
      waits.push(window.customElements.whenDefined('sf-modal'));
    }

    Promise.allSettled(waits).then(() => {
      requestAnimationFrame(() => {
        this._nestedDefinitionSyncQueued = false;

        if (!this.isConnected) {
          return;
        }

        this._detachNestedListeners();

        this._bindNestedComponents();

        this._syncSliderSlots();

        this._attachNestedListeners();

        this._syncSlidersToCurrent();

        if (this.openState) {
          this._modal?.open?.();
        }
      });
    });
  }

  _buildSliderSlideNodes(mode = 'inline') {
    const slides = normalizeSlotNodes(this.getSlotContent('slide'));
    return slides.map((slide, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'sf-gallery-slide flex content-main-center items-cross-center w-full min-w-0';
      wrapper.setAttribute('data-sf-gallery-index', String(index + 1));

      if (mode === 'inline' && this.getProp('lightbox')) {
        wrapper.setAttribute('data-sf-gallery-open', String(index + 1));
        wrapper.setAttribute('role', 'button');
        wrapper.setAttribute('tabindex', '0');
      }

      const content = slide.cloneNode(true);
      this.copyRuntimeData(slide, content);
      wrapper.append(content);
      return wrapper;
    });
  }

  _syncSlidersToCurrent() {
    const index = Math.max(this.current - 1, 0);

    this._syncSliderToIndex(this._inlineSlider, index);

    this._syncSliderToIndex(this._lightboxSlider, index);
  }

  _refreshLightboxSlider() {
    if (!this._lightboxSlider) {
      this._bindNestedComponents();
    }

    this._lightboxSlider?.refresh?.();
    const root = this._lightboxSlider?.querySelector?.('.sf-slider');

    if (root) {
      window.SF?.Slider?.refresh?.(root);
    }
  }

  _rememberSliderIndex(sliderElement, index) {
    if (!sliderElement?.setAttribute) {
      return;
    }

    const value = String(index);

    if (sliderElement.getAttribute('data-swiper-initial-slide') !== value) {
      sliderElement.setAttribute('data-swiper-initial-slide', value);
    }
  }

  _syncSliderToIndex(sliderElement, index) {
    this._rememberSliderIndex(sliderElement, index);

    const slider = sliderElement?._boundSlider || null;

    if (!slider || typeof index !== 'number' || index < 0) {
      return;
    }

    const currentIndex = typeof slider.realIndex === 'number' ? slider.realIndex : slider.activeIndex;

    if (currentIndex === index) {
      return;
    }

    if (slider.params?.loop && typeof slider.slideToLoop === 'function') {
      slider.slideToLoop(index, 0);
      return;
    }

    if (typeof slider.slideTo === 'function') {
      slider.slideTo(index, 0);
    }
  }

  _handleGalleryClick(event) {
    const trigger = event.target.closest?.('[data-sf-gallery-open]');

    if (!trigger || !this.getProp('lightbox')) {
      return;
    }

    const index = Number.parseInt(trigger.getAttribute('data-sf-gallery-open') || '1', 10);
    this.open(index);
  }

  _handleGalleryKeyDown(event) {
    const trigger = event.target.closest?.('[data-sf-gallery-open]');

    if (!trigger || !this.getProp('lightbox')) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    const index = Number.parseInt(trigger.getAttribute('data-sf-gallery-open') || '1', 10);
    this.open(index);
  } // A nested slider's change is the gallery's business: it becomes the
  // gallery's own change and stops here (§7.4: a part's events stop at the
  // component that holds it).


  _handleInlineSlideChange(event) {
    if (event.target !== this._inlineSlider) return;
    event.stopPropagation();

    this._syncCurrentFromEvent(event, false);
  }

  _handleLightboxSlideChange(event) {
    if (event.target !== this._lightboxSlider) return;
    event.stopPropagation();

    this._syncCurrentFromEvent(event, true);
  }

  _isLightboxBackgroundTarget(target) {
    if (!this.openState || !this.getProp('closeOnOverlay')) {
      return false;
    }

    if (!(target instanceof Element)) {
      return false;
    }

    if (target.closest(LIGHTBOX_BACKGROUND_CLOSE_IGNORE_SELECTOR)) {
      return false;
    }

    const activeSlide = target.closest('.swiper-slide-active');
    const gallerySlide = target.closest('.sf-gallery-slide');
    return Boolean(activeSlide || gallerySlide);
  }

  _stopLightboxBackgroundEvent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  _requestLightboxBackgroundClose() {
    if (this._pendingLightboxBackgroundClose) {
      return;
    }

    this._pendingLightboxBackgroundClose = true;
    requestAnimationFrame(() => {
      this._pendingLightboxBackgroundClose = false;
      this._lightboxBackgroundPointerActive = false;

      if (!this.openState) {
        return;
      }

      this.close();
    });
  }

  _handleLightboxBackgroundPointerDown(event) {
    if (!this._isLightboxBackgroundTarget(event.target)) {
      this._lightboxBackgroundPointerActive = false;
      return;
    }

    this._lightboxBackgroundPointerActive = true;

    this._stopLightboxBackgroundEvent(event);
  }

  _handleLightboxBackgroundPointerUp(event) {
    if (!this._lightboxBackgroundPointerActive && !this._isLightboxBackgroundTarget(event.target)) {
      return;
    }

    this._stopLightboxBackgroundEvent(event);

    this._requestLightboxBackgroundClose();
  }

  _handleLightboxBackgroundClick(event) {
    if (!this._isLightboxBackgroundTarget(event.target)) {
      return;
    }

    this._stopLightboxBackgroundEvent(event);

    this._requestLightboxBackgroundClose();
  }

  _handleModalAfterRender(event) {
    if (event.target !== this._modal) {
      return;
    }

    const slider = this._modal?.modalRoot?.querySelector?.('[data-sf-gallery-slider="lightbox"]');

    if (!slider || slider === this._lightboxSlider) {
      return;
    }

    this._detachNestedListeners();

    this._lightboxSlider = slider;

    this._attachNestedListeners();

    this._syncSliderSlot(slider, 'lightbox');

    this._syncSliderToIndex(slider, Math.max(this.current - 1, 0));

    this._queueNestedDefinitionSync();
  }

  _handleModalAfterOpen(event) {
    // Modal events bubble; ignore those of a modal nested in the lightbox.
    if (event?.target && event.target !== this._modal) return;
    const targetIndex = Math.max(this.current - 1, 0);

    if (!this.hasAttribute('open')) {
      this.setAttribute('open', '');
    }

    this._refreshLightboxSlider();

    this._syncSliderToIndex(this._lightboxSlider, targetIndex);

    requestAnimationFrame(() => {
      if (!this.openState) {
        return;
      }

      this._refreshLightboxSlider();

      this._syncSliderToIndex(this._lightboxSlider, targetIndex);
    });
    this.sfEmit('opened', {
      current: this.current,
      total: this.slidesTotal
    });
  }

  _handleModalAfterClose(event) {
    if (event?.target && event.target !== this._modal) return;

    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    }

    this.sfEmit('closed', {
      current: this.current,
      total: this.slidesTotal
    });
  }

  _syncCurrentFromEvent(event, fromLightbox = false) {
    const next = Number(event.detail?.realIndex ?? event.detail?.activeIndex ?? 0) + 1;

    if (!Number.isFinite(next) || this._syncingCurrent) {
      return;
    }

    this._syncingCurrent = true;

    this._setCurrent(next, fromLightbox ? 'lightbox' : 'inline');

    this._syncingCurrent = false;
  } // §4.4: readers retire; kept until the date and noted on each call.


  getModal() {
    noteRetired('getModal');
    return this._modal || null;
  }

  getInlineSlider() {
    noteRetired('getInlineSlider');
    return this._inlineSlider || null;
  }

  getLightboxSlider() {
    noteRetired('getLightboxSlider');
    return this._lightboxSlider || null;
  } // The actions (§4.4) answer outcomes. `index` comes as a number or as
  // {index}, the manifest's parameter object.


  open(index = null) {
    const at = index && typeof index === 'object' ? index.index : index;
    if (!this.getProp('lightbox')) return {
      outcome: 'refused',
      reason: 'no-lightbox'
    };

    if (at !== null && typeof at !== 'undefined') {
      this.goTo(at);
    }

    this.setAttribute('open', '');
    this._modal?.open?.();
    return applied();
  }

  close() {
    if (!this.openState) return {
      outcome: 'refused',
      reason: 'closed'
    };
    this.removeAttribute('open');
    this._modal?.close?.();
    return applied();
  }

  toggle(index = null) {
    if (this.openState) {
      return this.close();
    }

    return this.open(index);
  }

  goTo(index) {
    const at = index && typeof index === 'object' ? index.index : index;
    if (!Number.isFinite(Number.parseInt(String(at), 10))) return {
      outcome: 'refused',
      reason: 'invalid'
    };

    this._setCurrent(at, 'api', {
      syncAttribute: true
    });

    return applied();
  }

  next() {
    return this.goTo(this.current + 1);
  }

  prev() {
    return this.goTo(this.current - 1);
  }

}

SfGallery.define('sf-gallery');
SfGallery.bindGlobalDelegation();
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "56ae6cc9a5ec"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderGalleryTemplate: () => (/* binding */ renderGalleryTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a4ffdf799148");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ').trim();
}

function renderSliderNode(context, type = 'inline') {
  const isInline = type === 'inline';
  const sliderClass = isInline ? context.inlineClass : context.lightboxClass;
  const authoredSpaceBetween = context.component?.hasAttribute('space-between');
  const authoredSpeed = context.component?.hasAttribute('speed');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-slider
      data-sf-gallery-slider=${type}
      class=${sliderClass}
      button-type=${context.buttonType}
      button-size=${context.buttonSize}
      dots=${String(context.dots)}
      dots-type=${context.dotsType}
      dots-size=${context.dotsSize}
      thumbs=${String(context.thumbs)}
      thumbs-class=${context.thumbsClass}
      thumb-class=${context.thumbClass}
      arrows=${String(context.arrows)}
      loop=${String(context.loop)}
      space-between=${authoredSpaceBetween ? String(context.spaceBetween) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      speed=${authoredSpeed ? String(context.speed) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      slide-class=${context.slideClass}
    ></sf-slider>
  `;
}

function renderGalleryTemplate(context) {
  const showInline = context.inline || !context.lightbox;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${joinClasses('sf-gallery flex flex-col gap-1', context.rootClass)}>
      ${showInline ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-gallery-inline" data-sf-gallery-inline>
              ${renderSliderNode(context, 'inline')}
            </div>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${context.lightbox ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-modal
              data-sf-gallery-modal
              modal-id=${context.modalId}
              heading=${context.heading}
              text=${context.text}
              ?open=${context.open}
              overlay=${String(context.overlay)}
              show-header=${String(context.showHeader)}
              show-close=${String(context.showClose)}
              show-footer="false"
              close-on-esc=${String(context.closeOnEsc)}
              close-on-overlay=${String(context.closeOnOverlay)}
              preserve-scroll-gap=${String(context.preserveScrollGap)}
              position=${context.position}
              fullscreen=${String(context.fullscreen)}
              width=${context.width}
              height=${context.height}
              backdrop-blur=${String(context.backdropBlur)}
              blur-type=${context.blurType}
              overlay-class=${context.overlayClass}
              close-class=${context.closeClass}
              surface-class=${context.surfaceClass}
              surface-padding=${context.surfacePadding}
              panel-class=${joinClasses('sf-gallery-lightbox-panel min-w-0 max-w-full', context.panelClass)}
              header-class=${context.headerClass}
              body-class=${context.bodyClass}
              content-class=${context.contentClass}
              footer-class=${context.footerClass}
            >
              <div
                slot="content"
                class="sf-gallery-lightbox-content flex flex-col gap-1 h-full"
              >
                ${renderSliderNode(context, 'lightbox')}
              </div>
            </sf-modal>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a4ffdf799148"
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

/***/ "755770a8ce5c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-gallery for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26"},{"from":"blur","to":"backdrop-blur","kind":"setting","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26: blur is the base action blur"},{"from":"sf-change","to":"change","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8","note":"the detail is data only now: component, tagName and template leave it"},{"from":"sf-open","to":"sf-gallery-opened","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §4 (a fact)","note":"the detail is data only now"},{"from":"sf-close","to":"sf-gallery-closed","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §4 (a fact)","note":"the detail is data only now"},{"from":"getModal","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getInlineSlider","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getLightboxSlider","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"}]}');

/***/ },

/***/ "a2bebed909d0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-gallery\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/gallery (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.gallery","tag":"sf-gallery","version":"1.1.0","kind":"leaf","family":"gallery","settings":{"modal-id":{"type":"id","default":""},"heading":{"type":"string","default-from":"runtime.heading"},"text":{"type":"string","default":""},"inline":{"type":"boolean","default":true},"lightbox":{"type":"boolean","default":true},"arrows":{"type":"boolean","default":true},"dots":{"type":"boolean","default":false},"thumbs":{"type":"boolean","default":true},"loop":{"type":"boolean","default":false},"space-between":{"type":"number","default":12},"speed":{"type":"number","default":450},"button-type":{"type":"string","default":"primary"},"button-size":{"type":"string","default":"1"},"dots-type":{"type":"string","default":"primary-dark"},"dots-size":{"type":"string","default":"2"},"thumbs-class":{"type":"string","default":""},"thumb-class":{"type":"string","default":""},"slide-class":{"type":"string","default":""},"inline-class":{"type":"string","default":""},"lightbox-class":{"type":"string","default":""},"overlay":{"type":"boolean","default":true},"show-header":{"type":"boolean","default":true},"show-close":{"type":"boolean","default":true},"close-on-esc":{"type":"boolean","default":true},"close-on-overlay":{"type":"boolean","default":true},"preserve-scroll-gap":{"type":"boolean","default":true},"position":{"type":"enum","values":["center","left","right","top","bottom"],"default":"center"},"fullscreen":{"type":"boolean","default":false},"width":{"type":"string","default":""},"height":{"type":"string","default":""},"backdrop-blur":{"type":"boolean","default":false},"blur-type":{"type":"enum","values":["none","small","medium","large"],"default":"medium"},"overlay-class":{"type":"string","default":""},"close-class":{"type":"string","default":""},"surface-class":{"type":"string","default":""},"surface-padding":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"header-class":{"type":"string","default":""},"body-class":{"type":"string","default":""},"content-class":{"type":"string","default":""},"footer-class":{"type":"string","default":""}},"values":{"open":{"type":"boolean","default":false,"reflect":true},"current":{"type":"number","default":1,"integer":true,"min":1}},"events":{"change":{"carries":{"previous":"number","current":"number","total":"number","from":{"type":"enum","values":["api","inline","lightbox"]}},"x-summary":"The shown slide changed: by a person in the inline view or the lightbox, or by an action (from api)"},"opened":{"carries":{"current":"number","total":"number"}},"closed":{"carries":{"current":"number","total":"number"}}},"actions":{"open":{"with":{"index":{"type":"number","optional":true}},"x-outcomes":["applied","refused"],"x-summary":"Opens the lightbox, at index when given; refused (no-lightbox) without a lightbox"},"close":{"x-outcomes":["applied","refused"],"x-summary":"Closes the lightbox; refused (closed) when it is closed"},"toggle":{"with":{"index":{"type":"number","optional":true}},"x-outcomes":["applied","refused"]},"go-to":{"with":{"index":"number"},"x-outcomes":["applied","refused"],"x-summary":"Shows the slide at index (1-based, clamped to the slides)"},"next":{"x-outcomes":["applied","refused"]},"prev":{"x-outcomes":["applied","refused"]}},"slots":{"slide":{"$comment":"Each child of the host is a slide; the gallery places it in its inline slider and its lightbox (§4.5)."}},"side-effects":["portal"],"keyboard":{"host":{"Tab":"reach","Enter":"open","Space":"open"}},"templates":{"default":{"file":"js/templates/default.js","$comment":"The Lit template in JavaScript, the migration form of §5.2 (§16)."}},"styles":"js/templates/default.css","examples":"examples.json","docs":"docs/docs.md","lang":"lang/","accessibility":{"role":"none","name":{"from":["heading"]},"keys":{"Tab":"reach","Enter":"open","Space":"open"},"$comment":"The root has no role of its own: the inline view is sf-slider (its slides and arrows named by Swiper\'s a11y module) and the lightbox is sf-modal, a dialog named by heading that traps focus and closes on Escape. Enter and Space on a [data-sf-gallery-open] trigger open the lightbox."},"css-variables":{"--sf-gallery-min-inline-size":{"type":"length","state":"default"},"--sf-gallery-media-max-height":{"type":"length","state":"default"},"--sf-gallery-object-fit":{"type":"keyword","state":"default"},"--sf-gallery-slide-min-height":{"type":"length","state":"default"},"--sf-gallery-caption-color":{"type":"color","state":"default"}},"x-summary":"An ordered media collection shown in an inline Slider, with an optional Modal lightbox holding a second Slider. The gallery owns the one-based current slide and keeps both views on it.","x-source":{"package":"framework","folder":"gallery","manifest":"simai/ui-source@5100227 src/smart/gallery/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/gallery.component.json"},"x-words":["heading","text"],"x-renamed":["settings.title → heading: \\"title\\" is a property of HTMLElement.prototype (§3.1, §16 item 26), alias dated","settings.blur → backdrop-blur: \\"blur\\" is a property of HTMLElement.prototype (§3.1, §16 item 26), alias dated","events.change: 3 carried field(s) held the element, not data (§8)","events.sf-change → change (the DOM name without sf-<tag>-)","events.close: 3 carried field(s) held the element, not data (§8)","events.sf-close → close (the DOM name without sf-<tag>-)","events.open: 3 carried field(s) held the element, not data (§8)","events.sf-open → open (the DOM name without sf-<tag>-)","settings.button-size: type string with the numeral default \\"1\\" → number (§16 item 29)","settings.dots-size: type string with the numeral default \\"2\\" → number (§16 item 29)","events.open → opened and close → closed: they are sent after the lightbox opened or closed, so they are facts and take the past form (§8, vocabulary §4); the DOM names are sf-gallery-opened and sf-gallery-closed","methods.getModal, getInlineSlider, getLightboxSlider: readers retire (§4.4), kept and noted until the date"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"fixture","effects":"component","forbidden_client_responsibilities":["backend access decisions","host route invention"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile"],"skeleton":{"shape":"block","while_loading":"none"}},"ai_guidance":{"use_when":"Use sf-gallery for one ordered media collection with one-based current state, an inline Slider and optional Modal lightbox. Nested Sliders inherit token-driven spacing, reduced-motion behavior, autoplay pause and hidden-slide focus protection unless the author supplies explicit compatibility overrides.","do_not":["The rendered Gallery root permits shrinking in grid/flex via min-width:0. Do not hide document overflow or reset Slider instances to compensate for parent intrinsic sizing; explicit author widths remain the author\'s responsive-layout responsibility.","current/open-only updates preserve the existing inline Slider and use updateMode:dom. Observe sf-updated for these state changes, not sf-after-render. Actual configuration and slot changes still render; do not recreate unchanged slide content just to open Modal.","Load the Gallery composition CSS declared by cl-gallery. Do not overwrite projected figure/image/caption inline styles. Reuse Slider dimension/fit tokens, --sf-gallery-media--max-height and Modal scrolling for long content; width/height/fullscreen remain Modal options.","Gallery owns the selected position across inline/lightbox rendering. Use its one-based current/goTo/open API; do not maintain a second current index on nested Sliders or repair their position with delayed callbacks.","Slide counts and inline/lightbox indices use meaningful slot items, excluding formatting whitespace and comments. Keep composite cards inside one attributed root or one child of a bare slot container; do not treat each sibling heading or link as part of an inferred card.","Do not copy generated ui-smart code","Do not move host data or access decisions into the component"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<sf-gallery></sf-gallery>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["version: 1.0.0 → 1.1.0: title, blur, sf-change, sf-open, sf-close and the three readers are dated rows, the actions answer outcomes; a minor while the rows hold (§4.10).","events: change {previous, current, total, from} keeps the DOM name change (§8); the lightbox\'s facts are opened and closed {current, total} (sf-gallery-opened, -closed), sent after the modal opened or closed, so the past form. sf-change, sf-open and sf-close follow with the same detail until 2026-12-01; component, tagName and template leave the detail (§8). A nested slider\'s change stops at the gallery, which reports it as its own change.","a11y-role: none on the root. The inline view is sf-slider; the lightbox is sf-modal (role dialog, named by heading, traps focus, Escape closes when close-on-esc).","key-effects: Enter and Space on a [data-sf-gallery-open] trigger open the lightbox (open); Tab reaches the slider\'s and the modal\'s controls.","number-type: button-size and dots-size are steps of the size ladder (1/2, 1, 2) handed to sf-slider, not numbers; they stay strings. current is an integer from 1.","words: the lightbox\'s heading was the English «Gallery» on every page; it is the language file\'s word now (heading default-from runtime.heading: «Галерея», «Gallery»).","lightbox: the template hands sf-modal its own names, heading and backdrop-blur, so the modal\'s dated aliases are not used by the Framework itself; a trigger\'s data-sf-modal-title and data-sf-modal-blur keep configuring the delegated lightbox.","template: templates.default names the Lit template js/templates/default.js and styles its sheet js/templates/default.css, the migration form §5.2 allows.","examples: examples.json from studio.fixture.json and studio.scenario.json plus the lightbox and the actions; probe.json drives go-to, next, open, close and the aliases.","skeleton: none; the slides are the page\'s children, drawn before any code; the lightbox is closed at first paint (§5.4).","css-variables: five public variables read by the gallery\'s own sheet; the slider\'s and the modal\'s pass through (src/core/contracts/public-variables.v1.json)."]}');

/***/ },

/***/ "281c6761571f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Gallery","runtime":{"heading":"Gallery"}}');

/***/ },

/***/ "74650ab742c0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Галерея","runtime":{"heading":"Галерея"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d0c0e64421b6");
/******/
/******/ })()
;