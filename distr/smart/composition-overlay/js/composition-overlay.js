/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "cae046a8699f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("dd1616d485c7");
/* harmony import */ var _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6b629b4c1b7e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("323a38a1c20d");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4fe3d0c72eda");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("339c075524d7");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d8e3a01243dc");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("6c735f321fd9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Smart entry for sf-composition-overlay, the editor canvas overlay. Library
// drags from sf-sortable land here through the shared drag session. A framed
// canvas (a same-origin iframe fed a flat node list) uses attachFrame and setNodes.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the overlay is defined over the class core/js/composition/manifest-host.mjs
// makes from it; it sends select, apply, insert, move and change by the
// vocabulary, the former -action and -edit following until 2026-12-01.







globalThis.SF = globalThis.SF || {};
globalThis.SF.CompositionOverlay = Object.freeze({
  OVERLAY_EVENTS: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.OVERLAY_EVENTS,
  OVERLAY_EVENTS_LEGACY: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.OVERLAY_EVENTS_LEGACY,
  checkOverlayActions: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.checkOverlayActions,
  checkOverlayNodes: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.checkOverlayNodes,
  overlayNodes: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.overlayNodes
});
(0,_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.defineCompositionOverlay)(globalThis.customElements, {
  base: (0,_core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__.manifestHost)(_component_json__WEBPACK_IMPORTED_MODULE_2__, {
    lang: {
      en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
      ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
    },
    source: 'ru',
    aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_3__
  })
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6c735f321fd9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "6f489cc65b77"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonical: () => (/* binding */ canonical),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   stableStringify: () => (/* binding */ stableStringify)
/* harmony export */ });
function isPlainObject(value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(canonical(value));
}




/***/ },

/***/ "6b629b4c1b7e"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   manifestHost: () => (/* binding */ manifestHost)
/* harmony export */ });
/* harmony import */ var _element_manifest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("28b603686dcc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// The editors' elements from their manifests (standard simai.smart-component
// 1.3.8 §3, §4, §8, §16.20).
//
// sf-sortable, sf-inline-editor and sf-composition-overlay are plain custom
// elements defined by the composition modules (core/js/composition): the
// overlay's bundle carries the drag module too, and a page may define them
// before any Smart base is loaded. They draw nothing through the Smart base
// and keep their own lifecycle. What the manifest gives every component --
// the settings' attributes and properties, sfEmit through the dated aliases,
// sfWord, the declared actions -- they take from elementFromManifest over a
// plain base that answers the two callbacks the generated class calls and
// installs the component's aliases.json once the element is placed.
//
//   const base = manifestHost(manifest, {lang: {en, ru}, source: 'ru', aliases});
//   defineSortable(registry, {base});



function manifestHost(manifest, options = {}) {
  const Html = globalThis.HTMLElement;
  if (typeof Html !== 'function') return null;

  class PlainHost extends Html {
    connectedCallback() {
      // Installed once and kept while the element is detached, as the Smart
      // base does: a page that moves the element keeps its old names.
      if (this.constructor.aliases && !this.__sfAliases) {
        this.__sfAliases = (0,_aliases_js__WEBPACK_IMPORTED_MODULE_1__.installAliases)(this, this.constructor.aliases, {
          tag: this.localName,
          adapters: this.sfAliasAdapters?.() ?? {},
        });
      }
    }

    disconnectedCallback() {}

    // The generated actions read the instance's scope (§7.7); a plain host's
    // ends when the page removes it.
    get sfScope() {
      if (!this.__sfScope || (this.__sfScope.signal.aborted && this.isConnected)) this.__sfScope = new AbortController();
      return this.__sfScope.signal;
    }
  }

  return (0,_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__.elementFromManifest)(manifest, { ...options, base: PlainHost });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ manifestHost });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "dd1616d485c7"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OVERLAY_EVENTS: () => (/* binding */ OVERLAY_EVENTS),
/* harmony export */   OVERLAY_EVENTS_LEGACY: () => (/* binding */ OVERLAY_EVENTS_LEGACY),
/* harmony export */   checkOverlayActions: () => (/* binding */ checkOverlayActions),
/* harmony export */   checkOverlayNodes: () => (/* binding */ checkOverlayNodes),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineCompositionOverlay: () => (/* binding */ defineCompositionOverlay),
/* harmony export */   flatOverlayNodes: () => (/* binding */ flatOverlayNodes),
/* harmony export */   frameRectToHost: () => (/* binding */ frameRectToHost),
/* harmony export */   frameViewport: () => (/* binding */ frameViewport),
/* harmony export */   overlayNodes: () => (/* binding */ overlayNodes)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _sortable_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7c1f9c2b36da");
/* harmony import */ var _open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("421676f72963");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_2__]);
([_page_language_js__WEBPACK_IMPORTED_MODULE_1__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





// Editor canvas overlay. It draws hover and selection frames, a floating
// action toolbar and insertion points over a rendered Composition Document
// without touching the canvas DOM: the published HTML stays byte-identical.
// The host supplies node descriptions and actions and performs every change.
//
// Framed mode (attachFrame + setNodes) draws the same chrome over a same-origin
// iframe fed a flat node list: frame coordinates are mapped to the host page
// through the iframe's position, borders, padding, scale and the frame's own
// scroll, and a plain-string inline edit happens on the element inside the frame.

// The names sf-composition-overlay's component.json declares (standard 1.3.8
// §8, vocabulary 1.1.5): select {ids, id}, apply {action, scope: entry, ids}
// (one entry's own action, §18.3), insert, move {ids, id, parent, position}
// (one manual move) and change {id, value, previous} for a plain-string edit.
// select, move and insert keep their names and add the vocabulary's fields to
// the former ones (node_id, parent_id stay for the composition host); apply
// and change are new names, followed by sf-composition-overlay-action and
// -edit with their former details until 2026-12-01 (aliases.json).
const OVERLAY_EVENTS = Object.freeze({
  select: 'sf-composition-overlay-select',
  action: 'sf-composition-overlay-apply',
  insert: 'sf-composition-overlay-insert',
  move: 'sf-composition-overlay-move',
  edit: 'sf-composition-overlay-change',
});

const OVERLAY_EVENTS_LEGACY = Object.freeze({
  action: 'sf-composition-overlay-action',
  edit: 'sf-composition-overlay-edit',
});

const LEGACY_DETAIL = {
  action: (detail) => ({ action_id: detail.action, node_id: detail.ids[0] ?? null }),
  edit: (detail) => ({ node_id: detail.id, value: detail.value, previous: detail.previous }),
};

const MESSAGES = {
  ru: { picked: 'Перемещение: {label}. Стрелки выбирают место, Enter — положить, Escape — отменить.', cancelled: 'Перемещение отменено.', tree: 'Структура страницы', toolbar: 'Действия', insert: 'Вставить', insertAt: 'Вставить в «{slot}», позиция {index}', position: '{index} из {total}', selected: 'Выбрано: {label}', editing: 'Редактирование: {label}. Enter — сохранить, Escape — отменить.' },
  en: { picked: 'Moving {label}. Arrows choose a place, Enter drops, Escape cancels.', cancelled: 'Move cancelled.', tree: 'Page structure', toolbar: 'Actions', insert: 'Insert', insertAt: 'Insert into “{slot}”, position {index}', position: '{index} of {total}', selected: 'Selected: {label}', editing: 'Editing {label}. Enter saves, Escape cancels.' },
};

const ACTION_ID = /^[a-z][a-z0-9-]{0,63}$/u;
const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));

/** Flattens a Document into overlay nodes in document order. */
function overlayNodes(document) {
  const nodes = [];
  const visit = (node, parent, slot, index, level) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node) || typeof node.id !== 'string') return;
    const entry = { id: node.id, type: node.type, parent, slot, index, level, slots: {} };
    nodes.push(entry);
    for (const [name, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (!Array.isArray(children)) continue;
      entry.slots[name] = children.map((child) => child?.id).filter((id) => typeof id === 'string');
      children.forEach((child, childIndex) => visit(child, node.id, name, childIndex, level + 1));
    }
  };
  visit(document?.root, null, null, 0, 1);
  return nodes;
}

function checkOverlayActions(actions) {
  if (!Array.isArray(actions) || actions.length > 16) throw new TypeError('Overlay actions must be a list of up to 16 entries');
  return actions.map((action) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(action) || !ACTION_ID.test(action.id || '') || typeof action.label !== 'string' || !action.label.trim()
      || Object.keys(action).some((key) => key !== 'id' && key !== 'label')) {
      throw new TypeError('Overlay actions have an opaque id and a label only');
    }
    return Object.freeze({ id: action.id, label: action.label });
  });
}

const NODE_KEYS = new Set(['id', 'kind', 'rect', 'element', 'label', 'parent', 'editable']);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
// Elements of the frame belong to another realm, so `instanceof Element` is false for them.
const isElement = (value) => Boolean(value) && typeof value === 'object' && value.nodeType === 1 && typeof value.getBoundingClientRect === 'function';

/**
 * Checks a framed canvas's flat node list: [{id, kind, rect? | element?, label?,
 * parent?, editable?}]. rect is in frame-document coordinates {x, y, width,
 * height}; element is a node inside the frame. Returns frozen entries.
 */
function checkOverlayNodes(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError('Overlay nodes must be a list');
  const seen = new Set();
  const list = nodes.map((node) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node) || Object.keys(node).some((key) => !NODE_KEYS.has(key))) {
      throw new TypeError('Overlay nodes have id, kind, rect or element, label, parent and editable only');
    }
    if (typeof node.id !== 'string' || !node.id || seen.has(node.id)) throw new TypeError('Overlay nodes have unique non-empty string ids');
    if (typeof node.kind !== 'string' || !node.kind) throw new TypeError(`Overlay node ${node.id} names its kind`);
    const { rect, element } = node;
    if (rect !== undefined && (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(rect) || !['x', 'y', 'width', 'height'].every((key) => finite(rect[key])) || rect.width < 0 || rect.height < 0)) {
      throw new TypeError(`Overlay node ${node.id} has a rect {x, y, width, height} of finite numbers`);
    }
    if (element !== undefined && !isElement(element)) throw new TypeError(`Overlay node ${node.id} has an element`);
    if (rect === undefined && element === undefined) throw new TypeError(`Overlay node ${node.id} has a rect or an element`);
    if (node.label !== undefined && typeof node.label !== 'string') throw new TypeError(`Overlay node ${node.id} has a string label`);
    if (node.parent !== undefined && node.parent !== null && (typeof node.parent !== 'string' || node.parent === node.id)) {
      throw new TypeError(`Overlay node ${node.id} names another node as its parent`);
    }
    if (node.editable !== undefined && typeof node.editable !== 'boolean') throw new TypeError(`Overlay node ${node.id} has a boolean editable`);
    if (node.editable && element === undefined) throw new TypeError(`Overlay node ${node.id} is editable only with an element`);
    seen.add(node.id);
    return Object.freeze({
      id: node.id,
      kind: node.kind,
      rect: rect === undefined ? null : Object.freeze({ x: rect.x, y: rect.y, width: rect.width, height: rect.height }),
      element: element ?? null,
      label: node.label ?? null,
      parent: node.parent ?? null,
      editable: node.editable === true,
    });
  });
  const byId = new Map(list.map((node) => [node.id, node]));
  for (const node of list) {
    const visited = new Set([node.id]);
    for (let parent = node.parent; parent !== null; parent = byId.get(parent).parent) {
      if (!byId.has(parent)) throw new TypeError(`Overlay node ${node.id} names a parent that is not in the list`);
      if (visited.has(parent)) throw new TypeError(`Overlay node ${node.id} is its own ancestor`);
      visited.add(parent);
    }
  }
  return Object.freeze(list);
}

/** Overlay entries for a checked flat list, in list order; the top level is parent null, slot "default". */
function flatOverlayNodes(list) {
  const entries = list.map((node) => ({ id: node.id, type: node.kind, kind: node.kind, label: node.label, parent: node.parent, slot: 'default', index: 0, level: 1, slots: {}, flat: node }));
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const counts = new Map();
  for (const entry of entries) {
    const key = entry.parent ?? '';
    entry.index = counts.get(key) || 0;
    counts.set(key, entry.index + 1);
    if (entry.parent) (byId.get(entry.parent).slots.default ||= []).push(entry.id);
    for (let parent = entry.parent; parent; parent = byId.get(parent).parent) entry.level += 1;
  }
  return entries;
}

/**
 * Where a frame's viewport lies on the host page. rect is the iframe's border box
 * on the host (after any transform or zoom), layout its untransformed border box
 * size (offsetWidth/offsetHeight), border and padding its own {top, right,
 * bottom, left} in CSS px, inner the frame's viewport size in its own px and
 * scroll the frame's scroll position. The scale is rect over layout; without a
 * layout size it is taken from the parts, which the viewport's whole-pixel size
 * makes less exact under zoom.
 */
function frameViewport({ rect, layout = null, border, padding, inner, scroll = { x: 0, y: 0 } }) {
  const outerWidth = layout?.width > 0 ? layout.width : border.left + padding.left + inner.width + padding.right + border.right;
  const outerHeight = layout?.height > 0 ? layout.height : border.top + padding.top + inner.height + padding.bottom + border.bottom;
  const scaleX = outerWidth > 0 && rect.width > 0 ? rect.width / outerWidth : 1;
  const scaleY = outerHeight > 0 && rect.height > 0 ? rect.height / outerHeight : 1;
  return {
    left: rect.left + (border.left + padding.left) * scaleX,
    top: rect.top + (border.top + padding.top) * scaleY,
    width: inner.width * scaleX,
    height: inner.height * scaleY,
    scaleX,
    scaleY,
    scrollX: scroll.x,
    scrollY: scroll.y,
  };
}

/** A box in the frame's viewport coordinates {x, y, width, height}, mapped to the host page. */
function frameRectToHost(box, view) {
  const left = view.left + box.x * view.scaleX;
  const top = view.top + box.y * view.scaleY;
  const width = box.width * view.scaleX;
  const height = box.height * view.scaleY;
  return { x: left, y: top, left, top, width, height, right: left + width, bottom: top + height };
}

const plainText = (element) => (element.textContent || '').replace(/\s+/gu, ' ').trim();
const px = (value) => Number.parseFloat(value) || 0;
const intersect = (a, b) => ({ left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) });

// One manual move (vocabulary 1.1.5 §5 move, {id, parent, position}) in the
// vocabulary's words beside the composition host's.
function moveDetail(id, descriptor) {
  return { node_id: id, ...descriptor, ids: [id], id, parent: descriptor.parent_id ?? null, position: descriptor.index };
}

// base: the class made from sf-composition-overlay's component.json
// (manifest-host.mjs); without it the overlay is a plain element.
function defineCompositionOverlay(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-composition-overlay');
  if (existing) return existing;

  class SfCompositionOverlay extends (base || globalThis.HTMLElement) {
    constructor() {
      super();
      this.canvas = null;
      this.nodes = [];
      this.byId = new Map();
      this.describe = () => ({});
      this._actions = [];
      this.selectedId = null;
      this.hoverId = null;
      this._insertionTarget = null;
      this.connection = null;
      this.frameRequest = 0;
      this.resizeObserver = null;
      this.layer = null;
      this.dropFilter = () => true;
      this.moving = null;
      this.unregisterDrop = null;
      this.dropHint = null;
      this.iframe = null;
      this.frameDoc = null;
      this.frameConnection = null;
      this.view = null;
      this.elementIds = new Map();
      this.rectNodes = [];
      this.editing = null;
    }

    // actions, messages and insertion-target are settings of the manifest
    // (properties); a write goes through the same checks as the host port's
    // setActions, setMessages and setInsertionTarget, which stay.
    get actions() {
      return this._actions;
    }

    set actions(value) {
      this.setActions(value ?? []);
    }

    get insertionTarget() {
      return this._insertionTarget;
    }

    set insertionTarget(value) {
      this.setInsertionTarget(value ?? null);
    }

    set messages(value) {
      this.setMessages(value);
    }

    get messages() {
      // In the page's language through pageText, as every component's words are.
      const words = Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageText)(MESSAGES, key, this, 'sf-composition-overlay')]));
      return { ...words, ...(this.customMessages || {}) };
    }

    connectedCallback() {
      super.connectedCallback?.();
      if (!this.layer) this.buildLayer();
      const canvasId = this.getAttribute('for');
      const frameId = this.getAttribute('frame');
      if (frameId && !this.canvas && !this.iframe) {
        const iframe = globalThis.document.getElementById(frameId);
        if (iframe) this.attachFrame(iframe);
      } else if (canvasId && !this.canvas && !this.iframe) {
        const canvas = globalThis.document.getElementById(canvasId);
        if (canvas) this.attach(canvas);
      } else if (this.canvas || this.iframe) {
        this.bind();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.unbind();
    }

    buildLayer() {
      const doc = globalThis.document;
      this.classList.add('sf-composition-overlay');
      this.layer = doc.createElement('div');
      this.layer.className = 'sf-composition-overlay-layer';
      this.layer.setAttribute('aria-hidden', 'true');
      this.hoverFrame = this.frame('hover');
      this.selectedFrame = this.frame('selected');
      this.insertionLayer = doc.createElement('div');
      this.insertionLayer.className = 'sf-composition-overlay-insertions';
      this.toolbar = doc.createElement('div');
      this.toolbar.className = 'sf-composition-overlay-toolbar';
      this.toolbar.setAttribute('role', 'toolbar');
      this.toolbar.hidden = true;
      this.tree = doc.createElement('div');
      this.tree.className = 'sf-composition-overlay-tree';
      this.tree.setAttribute('role', 'tree');
      this.tree.tabIndex = 0;
      this.live = doc.createElement('div');
      this.live.className = 'sf-composition-overlay-live';
      this.live.setAttribute('aria-live', 'polite');
      this.append(this.tree, this.toolbar, this.insertionLayer, this.layer, this.live);
      this.layer.append(this.hoverFrame, this.selectedFrame);
    }

    frame(kind) {
      const frame = globalThis.document.createElement('div');
      frame.className = `sf-composition-overlay-frame sf-composition-overlay-frame--${kind}`;
      frame.hidden = true;
      const label = globalThis.document.createElement('span');
      label.className = 'sf-composition-overlay-label';
      frame.append(label);
      return frame;
    }

    /** Binds the overlay to a rendered canvas; the canvas is never modified. */
    attach(canvas) {
      if (!(canvas instanceof globalThis.Element)) throw new TypeError('Overlay canvas must be an element');
      if (!this.layer) this.buildLayer();
      this.unbind();
      this.canvas = canvas;
      this.iframe = null;
      this.removeAttribute('data-sf-overlay-mode');
      this.layer.style.clipPath = '';
      this.insertionLayer.style.clipPath = '';
      if (this.isConnected) this.bind();
      return this;
    }

    /** Binds the overlay to a same-origin iframe canvas fed by setNodes; the frame's HTML is never modified by the overlay. */
    attachFrame(iframe) {
      if (!isElement(iframe) || iframe.localName !== 'iframe') throw new TypeError('Overlay frame must be an iframe element');
      if (!this.layer) this.buildLayer();
      this.unbind();
      this.canvas = null;
      this.iframe = iframe;
      this.setAttribute('data-sf-overlay-mode', 'frame');
      if (this.isConnected) this.bind();
      return this;
    }

    bind() {
      if (this.connection || (!this.canvas && !this.iframe)) return;
      this.connection = new AbortController();
      const options = { signal: this.connection.signal };
      const passive = { ...options, passive: true };
      if (this.iframe) {
        // A new letter (srcdoc, navigation) is a new document: listen to it again.
        this.iframe.addEventListener('load', () => this.bindFrameDocument(), options);
        this.iframe.addEventListener('pointerleave', () => this.setHover(null), passive);
      } else {
        this.canvas.addEventListener('pointermove', (event) => this.onPointerMove(event), passive);
        this.canvas.addEventListener('pointerleave', () => this.setHover(null), passive);
        this.canvas.addEventListener('click', (event) => this.onCanvasClick(event), { ...options, capture: true });
      }
      this.tree.addEventListener('keydown', (event) => this.onTreeKey(event), options);
      this.tree.addEventListener('focus', () => {
        this.setAttribute('data-sf-overlay-focus', '');
        if (!this.selectedId && this.nodes.length) this.select(this.nodes[0].id);
      }, options);
      this.tree.addEventListener('blur', () => this.removeAttribute('data-sf-overlay-focus'), options);
      this.toolbar.addEventListener('click', (event) => this.onToolbarClick(event), options);
      this.toolbar.addEventListener('keydown', (event) => this.onToolbarKey(event), options);
      this.insertionLayer.addEventListener('click', (event) => this.onInsertionClick(event), options);
      globalThis.addEventListener('scroll', () => this.schedule(), { ...passive, capture: true });
      globalThis.addEventListener('resize', () => this.schedule(), passive);
      if (typeof globalThis.ResizeObserver === 'function') {
        this.resizeObserver = new globalThis.ResizeObserver(() => this.schedule());
        this.resizeObserver.observe(this.canvas || this.iframe);
      }
      this.unregisterDrop = (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_2__.registerSortableDropTarget)({
        resolve: (x, y, dragSession) => (this.acceptsDrag(dragSession) ? this.resolveDrop(x, y, null) : null),
        keyboardTargets: (dragSession) => (this.acceptsDrag(dragSession) ? this.dropTargets(null) : []),
        drop: (dragSession, descriptor) => this.emit(OVERLAY_EVENTS.insert, { ...descriptor, parent: descriptor.parent_id ?? null, item: dragSession.item, from: dragSession.from, mode: dragSession.mode }),
        leave: () => this.showDropHint(null),
      });
      this.selectedFrame.firstChild.addEventListener('pointerdown', (event) => this.onHandleDown(event), options);
      this.setAttribute('data-sf-overlay', 'connected');
      this.renderTree();
      if (this.iframe) this.bindFrameDocument();
      this.schedule();
    }

    /** Listens to the frame's current document and window; called on bind and on every frame load. */
    bindFrameDocument() {
      if (this.editing) this.finishEdit(false);
      this.frameConnection?.abort();
      this.frameConnection = null;
      let doc = null;
      try {
        doc = this.iframe.contentDocument;
      } catch {
        doc = null;
      }
      const win = doc?.defaultView || null;
      this.frameDoc = win ? doc : null;
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver.observe(this.iframe);
      }
      if (!this.frameDoc) {
        // A cross-origin or not yet available frame: nothing is drawn over it.
        this.setAttribute('data-sf-overlay-frame', 'unreachable');
        this.schedule();
        return;
      }
      this.removeAttribute('data-sf-overlay-frame');
      this.frameConnection = new AbortController();
      const options = { signal: this.frameConnection.signal };
      const passive = { ...options, passive: true };
      doc.addEventListener('pointermove', (event) => this.setHover(this.frameNodeAt(event)), passive);
      doc.addEventListener('pointerout', (event) => { if (!event.relatedTarget) this.setHover(null); }, passive);
      doc.addEventListener('click', (event) => this.onFrameClick(event), { ...options, capture: true });
      doc.addEventListener('dblclick', (event) => this.onFrameDoubleClick(event), { ...options, capture: true });
      doc.addEventListener('keydown', (event) => this.onFrameKey(event), { ...options, capture: true });
      win.addEventListener('scroll', () => this.schedule(), { ...passive, capture: true });
      win.addEventListener('resize', () => this.schedule(), passive);
      if (this.resizeObserver) {
        if (doc.documentElement) this.resizeObserver.observe(doc.documentElement);
        if (doc.body) this.resizeObserver.observe(doc.body);
      }
      this.schedule();
    }

    unbind() {
      this.finishEdit(false);
      this.frameConnection?.abort();
      this.frameConnection = null;
      this.frameDoc = null;
      this.pointerDrag?.abort();
      this.pointerDrag = null;
      this.unregisterDrop?.();
      this.unregisterDrop = null;
      this.moving = null;
      this.connection?.abort();
      this.connection = null;
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      if (this.frameRequest) globalThis.cancelAnimationFrame(this.frameRequest);
      this.frameRequest = 0;
      if (this.canvas || this.iframe) this.setAttribute('data-sf-overlay', 'disposed');
    }

    /** Supplies the Document structure and a describe(node) → {label, badges}. */
    setDocument(document, { describe } = {}) {
      this.elementIds = new Map();
      this.rectNodes = [];
      this.replaceNodes(overlayNodes(document), describe);
      return this;
    }

    /**
     * Supplies a framed canvas's flat node list [{id, kind, rect? | element?,
     * label?, parent?, editable?}] in selection order, and an optional
     * describe(node) → {label, badges}; without it the label is node.label or its kind.
     */
    setNodes(nodes, { describe } = {}) {
      const list = checkOverlayNodes(nodes);
      this.elementIds = new Map(list.filter((node) => node.element).map((node) => [node.element, node.id]));
      const entries = flatOverlayNodes(list);
      this.rectNodes = entries.filter((entry) => entry.flat.rect && !entry.flat.element);
      if (this.editing) {
        const next = list.find((node) => node.id === this.editing.id);
        if (!next || next.element !== this.editing.element || !next.editable) this.finishEdit(false);
      }
      this.replaceNodes(entries, typeof describe === 'function' ? describe : (node) => ({ label: node.label || node.kind }));
      return this;
    }

    replaceNodes(nodes, describe) {
      const previous = this.selectedId ? this.byId.get(this.selectedId) : null;
      const active = globalThis.document.activeElement;
      const focused = Boolean(active) && (this.toolbar?.contains(active) || this.insertionLayer?.contains(active));
      this.nodes = nodes;
      this.byId = new Map(this.nodes.map((node) => [node.id, node]));
      if (typeof describe === 'function') this.describe = describe;
      this.renderTree();
      // A selected node the host removed is deselected (and announced), so its
      // toolbar and insertion places do not stay on screen. When keyboard focus
      // was on a disappearing button, the parent (or first node) is selected and
      // focus moves to the tree instead of dropping onto the page body.
      if (this.selectedId !== null && !this.byId.has(this.selectedId)) {
        const fallback = previous?.parent && this.byId.has(previous.parent) ? previous.parent : this.nodes[0]?.id ?? null;
        this.select(focused ? fallback : null, { focus: focused });
      }
      this.schedule();
    }

    /** Re-measures on the next frame, after a change no observer reports (a transform on an ancestor of the canvas). */
    refresh() {
      this.schedule();
      return this;
    }

    setActions(actions) {
      this._actions = checkOverlayActions(actions);
      this.renderToolbar();
      this.schedule();
      return this;
    }

    setMessages(messages) {
      this.customMessages = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(messages) ? { ...messages } : null;
      this.renderTree();
      return this;
    }

    /** filter({parent_id, slot, index}, item) → boolean hides invalid places. */
    setDropFilter(filter) {
      this.dropFilter = typeof filter === 'function' ? filter : () => true;
      return this;
    }

    // Named so, not accepts: that is the setting's property (component.json).
    acceptsDrag(dragSession) {
      const groups = (this.getAttribute('accepts') || '').split(/\s+/u).filter(Boolean);
      return Boolean(dragSession && groups.includes(dragSession.group));
    }

    emit(type, detail) {
      this.dispatchEvent(new globalThis.CustomEvent(type, { bubbles: true, composed: true, detail: Object.freeze(detail) }));
    }

    // A renamed event: the overlay's aliases.json sends the former name after
    // it (the adapters below); an overlay defined without its manifest sends
    // both here. Answers false when a listener cancelled either.
    sendRenamed(key, detail, cancelable = false) {
      const event = new globalThis.CustomEvent(OVERLAY_EVENTS[key], { bubbles: true, composed: true, cancelable, detail: Object.freeze(detail) });
      let allowed = this.dispatchEvent(event);
      if (!this.__sfAliases) {
        const legacy = new globalThis.CustomEvent(OVERLAY_EVENTS_LEGACY[key], { bubbles: true, composed: true, cancelable, detail: Object.freeze(LEGACY_DETAIL[key](detail)) });
        allowed = this.dispatchEvent(legacy) && allowed;
      }
      return allowed && !event.defaultPrevented;
    }

    sfAliasAdapters() {
      return {
        [OVERLAY_EVENTS_LEGACY.action]: LEGACY_DETAIL.action,
        [OVERLAY_EVENTS_LEGACY.edit]: LEGACY_DETAIL.edit,
      };
    }

    /** Every valid insertion place in document order; moving excludes its own subtree and no-op places. */
    dropTargets(moving) {
      const excluded = new Set();
      if (moving) {
        const stack = [moving];
        while (stack.length) {
          const id = stack.pop();
          excluded.add(id);
          for (const children of Object.values(this.byId.get(id)?.slots || {})) stack.push(...children);
        }
      }
      const places = [];
      for (const node of this.nodes) {
        if (excluded.has(node.id)) continue;
        for (const [slot, children] of Object.entries(node.slots)) {
          const remaining = moving ? children.filter((id) => id !== moving) : children;
          for (let index = 0; index <= remaining.length; index += 1) {
            if (moving) {
              const source = this.byId.get(moving);
              if (source.parent === node.id && source.slot === slot && index === source.index) continue;
            }
            const descriptor = { parent_id: node.id, slot, index };
            if (!this.dropFilter(descriptor, moving ? { node_id: moving } : (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_2__.activeSortableSession)())) continue;
            const rect = this.placeRect(node.id, slot, index, remaining);
            if (rect) places.push({ descriptor, rect, label: format(this.messages.insertAt, { slot, index: index + 1 }) });
          }
        }
      }
      return places;
    }

    placeRect(parentId, slot, index, children) {
      const before = this.element(children[index]);
      const after = this.element(children[index - 1]);
      const parent = this.element(parentId);
      const anchor = before || after || parent;
      if (!anchor) return null;
      const box = anchor.getBoundingClientRect();
      const y = before ? box.top : box.bottom;
      return { left: box.left, top: y - 1, width: box.width, height: 3 };
    }

    resolveDrop(x, y, moving) {
      if (!this.canvas) return null;
      const under = globalThis.document.elementsFromPoint(x, y).find((element) => this.canvas.contains(element));
      let id = under ? this.nodeAt(under) : null;
      const allowedPlaces = moving ? this.dropTargets(moving) : null;
      const allowed = (descriptor) => (moving
        ? allowedPlaces.some((place) => JSON.stringify(place.descriptor) === JSON.stringify(descriptor))
        : this.dropFilter(descriptor, (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_2__.activeSortableSession)()));
      // Over the moving node or its subtree there is no target.
      if (moving) {
        for (let cursor = id; cursor; cursor = this.byId.get(cursor)?.parent) {
          if (cursor === moving) {
            this.showDropHint(null);
            return null;
          }
        }
      }
      while (id) {
        const node = this.byId.get(id);
        // An empty slot of the container under the pointer is a target too.
        for (const [slot, children] of Object.entries(node.slots)) {
          const remaining = moving ? children.filter((entry) => entry !== moving) : children;
          const descriptor = { parent_id: node.id, slot, index: 0 };
          if (remaining.length === 0 && allowed(descriptor)) {
            const rect = this.placeRect(node.id, slot, 0, remaining);
            this.showDropHint(rect);
            return { descriptor, rect, label: format(this.messages.insertAt, { slot, index: 1 }) };
          }
        }
        if (!node.parent) break;
        const element = this.element(id);
        const box = element.getBoundingClientRect();
        const siblings = this.byId.get(node.parent).slots[node.slot];
        const remaining = moving ? siblings.filter((entry) => entry !== moving) : siblings;
        const position = remaining.indexOf(id);
        if (position >= 0) {
          const index = y > box.top + box.height / 2 ? position + 1 : position;
          const descriptor = { parent_id: node.parent, slot: node.slot, index };
          if (allowed(descriptor)) {
            const rect = this.placeRect(node.parent, node.slot, index, remaining);
            this.showDropHint(rect);
            return { descriptor, rect, label: format(this.messages.insertAt, { slot: node.slot, index: index + 1 }) };
          }
        }
        id = node.parent;
      }
      this.showDropHint(null);
      return null;
    }

    showDropHint(rect) {
      if (!this.dropHint) {
        this.dropHint = globalThis.document.createElement('div');
        this.dropHint.className = 'sf-composition-overlay-drop';
        this.layer?.append(this.dropHint);
      }
      this.dropHint.hidden = !rect;
      if (rect) Object.assign(this.dropHint.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    }

    // Moving a canvas node: pointer via the selected label, keyboard via the tree.
    onHandleDown(event) {
      if (this.iframe) return;
      if (event.button !== 0 || !this.selectedId || !this.byId.get(this.selectedId)?.parent) return;
      event.preventDefault();
      const moving = this.selectedId;
      this.pointerDrag?.abort();
      const pending = new AbortController();
      this.pointerDrag = pending;
      let place = null;
      globalThis.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.key !== 'Escape') return;
        keyEvent.preventDefault();
        pending.abort();
        this.showDropHint(null);
      }, { signal: pending.signal, capture: true });
      globalThis.addEventListener('pointermove', (moveEvent) => {
        place = this.resolveDrop(moveEvent.clientX, moveEvent.clientY, moving);
      }, { signal: pending.signal });
      globalThis.addEventListener('pointerup', () => {
        pending.abort();
        this.showDropHint(null);
        if (place) this.emit(OVERLAY_EVENTS.move, moveDetail(moving, place.descriptor));
      }, { signal: pending.signal });
      globalThis.addEventListener('pointercancel', () => { pending.abort(); this.showDropHint(null); }, { signal: pending.signal });
    }

    startKeyboardMove() {
      const node = this.byId.get(this.selectedId);
      if (!node?.parent) return;
      const places = this.dropTargets(node.id);
      if (!places.length) return;
      this.moving = { node: node.id, places, index: 0 };
      this.live.textContent = format(this.messages.picked, { label: this.info(node).label });
      this.showKeyboardPlace();
    }

    showKeyboardPlace() {
      const place = this.moving.places[this.moving.index];
      this.showDropHint(place.rect);
      this.live.textContent = place.label;
    }

    onMoveKey(event) {
      const moving = this.moving;
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        this.moving = null;
        this.showDropHint(null);
        this.live.textContent = this.messages.cancelled;
        return true;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const place = moving.places[moving.index];
        this.moving = null;
        this.showDropHint(null);
        this.emit(OVERLAY_EVENTS.move, moveDetail(moving.node, place.descriptor));
        return true;
      }
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (step === undefined) return true;
      event.preventDefault();
      moving.index = Math.max(0, Math.min(moving.places.length - 1, moving.index + step));
      this.showKeyboardPlace();
      return true;
    }

    setInsertionTarget(target) {
      this._insertionTarget = target && typeof target.parent_id === 'string' && typeof target.slot === 'string' && Number.isSafeInteger(target.index)
        ? Object.freeze({ parent_id: target.parent_id, slot: target.slot, index: target.index }) : null;
      this.schedule();
      return this;
    }

    element(id) {
      if (!this.canvas || typeof id !== 'string') return null;
      for (const element of this.canvas.querySelectorAll('[data-sf-composition-id]')) {
        if (element.getAttribute('data-sf-composition-id') === id) return element;
      }
      return null;
    }

    info(node) {
      const described = this.describe(node) || {};
      const label = typeof described.label === 'string' && described.label.trim() ? described.label : node.id;
      const badges = Array.isArray(described.badges) ? described.badges.filter((badge) => typeof badge === 'string' && badge.trim()).slice(0, 4) : [];
      return { label, badges };
    }

    select(id, { focus = false, emit = true } = {}) {
      if (id !== null && !this.byId.has(id)) return this;
      if (this.editing && this.editing.id !== id) this.finishEdit(true);
      if (this.selectedId === id) return this;
      this.selectedId = id;
      this.renderTreeSelection();
      this.renderToolbar();
      this.schedule();
      if (id !== null) {
        const node = this.byId.get(id);
        const siblings = this.nodes.filter((entry) => entry.parent === node.parent && entry.slot === node.slot);
        const { label } = this.info(node);
        this.live.textContent = `${format(this.messages.selected, { label })}, ${format(this.messages.position, { index: siblings.indexOf(node) + 1, total: siblings.length })}`;
      }
      if (focus) this.tree.focus();
      if (emit) this.dispatchEvent(new globalThis.CustomEvent(OVERLAY_EVENTS.select, { bubbles: true, composed: true, detail: Object.freeze({ ids: id === null ? [] : [id], id, node_id: id }) }));
      return this;
    }

    setHover(id) {
      if (this.hoverId === id) return;
      this.hoverId = id;
      this.schedule();
    }

    nodeAt(target) {
      let element = target instanceof globalThis.Element ? target.closest('[data-sf-composition-id]') : null;
      while (element && this.canvas.contains(element)) {
        const id = element.getAttribute('data-sf-composition-id');
        if (this.byId.has(id)) return id;
        element = element.parentElement?.closest('[data-sf-composition-id]') || null;
      }
      return null;
    }

    onPointerMove(event) {
      this.setHover(this.nodeAt(event.target));
    }

    onCanvasClick(event) {
      const id = this.nodeAt(event.target);
      if (!id) return;
      // In the editor a click selects; it never follows links or submits.
      event.preventDefault();
      event.stopPropagation();
      this.select(id);
    }

    onTreeKey(event) {
      if (this.moving && this.onMoveKey(event)) return;
      if (event.key === ' ' && this.selectedId && !this.iframe) {
        event.preventDefault();
        this.startKeyboardMove();
        return;
      }
      const index = this.nodes.findIndex((node) => node.id === this.selectedId);
      const current = this.nodes[index];
      let next = null;
      if (event.key === 'ArrowDown') next = this.nodes[Math.min(this.nodes.length - 1, index + 1)];
      else if (event.key === 'ArrowUp') next = this.nodes[Math.max(0, index - 1)];
      else if (event.key === 'Home') next = this.nodes[0];
      else if (event.key === 'End') next = this.nodes.at(-1);
      else if (event.key === 'ArrowLeft' && current?.parent) next = this.byId.get(current.parent);
      else if (event.key === 'ArrowRight' && current) next = this.nodes.find((node) => node.parent === current.id) || null;
      else if (event.key === 'Escape' && this.selectedId !== null && (!this.iframe || (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__.isTopOpenSurface)(this))) {
        event.preventDefault();
        this.select(null);
        return;
      } else if (event.key === 'Enter' && this.iframe && current?.flat?.editable) {
        event.preventDefault();
        this.edit(current.id);
        return;
      } else if (event.key === 'Enter' && this.toolbar.querySelector('button')) {
        event.preventDefault();
        this.toolbar.querySelector('button').focus();
        return;
      } else return;
      event.preventDefault();
      if (next) this.select(next.id);
    }

    onToolbarKey(event) {
      const buttons = [...this.toolbar.querySelectorAll('button')];
      const index = buttons.indexOf(globalThis.document.activeElement);
      if (event.key === 'Escape') {
        event.preventDefault();
        this.tree.focus();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const step = (event.key === 'ArrowRight') === (globalThis.getComputedStyle(this).direction !== 'rtl') ? 1 : -1;
        buttons[(index + step + buttons.length) % buttons.length]?.focus();
      }
    }

    onToolbarClick(event) {
      const button = event.target instanceof globalThis.Element ? event.target.closest('button[data-action]') : null;
      if (!button || !this.selectedId) return;
      this.sendRenamed('action', { action: button.dataset.action, scope: 'entry', ids: [this.selectedId] });
    }

    onInsertionClick(event) {
      const button = event.target instanceof globalThis.Element ? event.target.closest('button[data-parent]') : null;
      if (!button) return;
      const target = { parent_id: button.dataset.parent, slot: button.dataset.slot, index: Number(button.dataset.index) };
      this.setInsertionTarget(target);
      this.positionInsertions();
      this.dispatchEvent(new globalThis.CustomEvent(OVERLAY_EVENTS.insert, { bubbles: true, composed: true, detail: Object.freeze({ ...target, parent: target.parent_id }) }));
    }

    renderTree() {
      if (!this.tree) return;
      this.tree.setAttribute('aria-label', this.getAttribute('label') || this.messages.tree);
      this.tree.replaceChildren(...this.nodes.map((node) => {
        const item = globalThis.document.createElement('div');
        const siblings = this.nodes.filter((entry) => entry.parent === node.parent && entry.slot === node.slot);
        const { label, badges } = this.info(node);
        item.id = `${this.id || 'sf-overlay'}-item-${node.id}`.replace(/[^A-Za-z0-9_-]/gu, '-');
        item.setAttribute('role', 'treeitem');
        item.setAttribute('aria-level', String(node.level));
        item.setAttribute('aria-setsize', String(siblings.length));
        item.setAttribute('aria-posinset', String(siblings.indexOf(node) + 1));
        item.setAttribute('aria-label', badges.length ? `${label} (${badges.join(', ')})` : label);
        item.dataset.nodeId = node.id;
        return item;
      }));
      this.renderTreeSelection();
    }

    renderTreeSelection() {
      let active = null;
      for (const item of this.tree?.children || []) {
        const selected = item.dataset.nodeId === this.selectedId;
        item.setAttribute('aria-selected', selected ? 'true' : 'false');
        if (selected) active = item.id;
      }
      if (active) this.tree.setAttribute('aria-activedescendant', active);
      else this.tree?.removeAttribute('aria-activedescendant');
    }

    renderToolbar() {
      if (!this.toolbar) return;
      this.toolbar.setAttribute('aria-label', this.messages.toolbar);
      this.toolbar.replaceChildren(...this.actions.map((action) => {
        const button = globalThis.document.createElement('button');
        button.type = 'button';
        button.className = 'sf-composition-overlay-action';
        button.dataset.action = action.id;
        button.textContent = action.label;
        return button;
      }));
      this.toolbar.hidden = !this.selectedId || this.actions.length === 0;
    }

    schedule() {
      if (this.frameRequest || !this.connection) return;
      this.frameRequest = globalThis.requestAnimationFrame(() => {
        this.frameRequest = 0;
        this.position();
      });
    }

    /** A node's box on the host page: its element's rect, or in framed mode its frame box mapped out of the frame. */
    nodeBox(id) {
      const node = typeof id === 'string' ? this.byId.get(id) : null;
      if (!node) return null;
      if (!node.flat) return this.element(id)?.getBoundingClientRect() ?? null;
      const view = this.view;
      if (!view || !this.frameDoc) return null;
      const { element, rect } = node.flat;
      if (element) {
        if (!element.isConnected || element.ownerDocument !== this.frameDoc) return null;
        const box = element.getBoundingClientRect();
        if (!box.width && !box.height) return null;
        return frameRectToHost({ x: box.left, y: box.top, width: box.width, height: box.height }, view);
      }
      return frameRectToHost({ x: rect.x - view.scrollX, y: rect.y - view.scrollY, width: rect.width, height: rect.height }, view);
    }

    place(frame, id) {
      const box = id ? this.nodeBox(id) : null;
      if (!box) {
        frame.hidden = true;
        return null;
      }
      frame.hidden = false;
      frame.style.insetInlineStart = '';
      Object.assign(frame.style, { left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px` });
      const { label, badges } = this.info(this.byId.get(id));
      frame.firstChild.textContent = badges.length ? `${label} · ${badges.join(' · ')}` : label;
      return box;
    }

    position() {
      if (!this.canvas && !this.iframe) return;
      if (this.iframe) {
        this.view = this.frameMetrics();
        this.applyClip(this.view?.clip ?? null);
      }
      this.place(this.hoverFrame, this.hoverId && this.hoverId !== this.selectedId ? this.hoverId : null);
      const box = this.place(this.selectedFrame, this.selectedId);
      if (this.iframe) {
        this.positionFrameToolbar(box);
        this.positionInsertions();
        return;
      }
      // No toolbar without a drawn selection, e.g. while the host re-renders,
      // unless it holds keyboard focus.
      if (box) this.toolbar.hidden = this.actions.length === 0;
      else if (!this.toolbar.contains(globalThis.document.activeElement)) this.toolbar.hidden = true;
      if (box && !this.toolbar.hidden) {
        const bar = this.toolbar.getBoundingClientRect();
        const above = box.top - bar.height - 4;
        const top = above >= 0 ? above : Math.min(globalThis.innerHeight - bar.height, box.bottom + 4);
        const rtl = globalThis.getComputedStyle(this).direction === 'rtl';
        const start = rtl ? box.right - bar.width : box.left;
        const left = Math.max(0, Math.min(start, globalThis.innerWidth - bar.width));
        Object.assign(this.toolbar.style, { top: `${top}px`, left: `${left}px` });
      }
      this.positionInsertions();
    }

    positionInsertions() {
      const selected = this.selectedId ? this.byId.get(this.selectedId) : null;
      const points = selected?.flat ? this.flatInsertionPoints(selected) : [];
      if (selected?.parent && !selected.flat) {
        const parent = this.byId.get(selected.parent);
        const siblings = parent.slots[selected.slot] || [];
        for (let index = 0; index <= siblings.length; index += 1) points.push({ parent: parent.id, slot: selected.slot, index, before: siblings[index], after: siblings[index - 1] });
      }
      if (selected && !selected.flat) {
        for (const [slot, children] of Object.entries(selected.slots)) points.push({ parent: selected.id, slot, index: children.length, after: children.at(-1), end: true });
      }
      const target = this.insertionTarget;
      // Buttons are reused by key so keyboard focus and marks survive repositioning.
      const existing = new Map([...this.insertionLayer.children].map((button) => [button.dataset.key, button]));
      const keep = new Set();
      for (const point of points) {
        const box = this.nodeBox(point.before) || this.nodeBox(point.after) || this.nodeBox(point.parent);
        if (!box) continue;
        const key = `${point.parent}|${point.slot}|${point.index}`;
        keep.add(key);
        let button = existing.get(key);
        if (!button) {
          button = globalThis.document.createElement('button');
          button.type = 'button';
          button.className = 'sf-composition-overlay-insert';
          button.dataset.key = key;
          button.dataset.parent = point.parent;
          button.dataset.slot = point.slot;
          button.dataset.index = String(point.index);
          const mark = globalThis.document.createElement('span');
          mark.className = 'sf-composition-overlay-insert-mark';
          mark.setAttribute('aria-hidden', 'true');
          mark.textContent = '+';
          button.append(mark);
          this.insertionLayer.append(button);
        }
        const top = point.before && !point.end ? box.top : box.bottom;
        const marked = Boolean(target && target.parent_id === point.parent && target.slot === point.slot && target.index === point.index);
        button.setAttribute('aria-pressed', marked ? 'true' : 'false');
        button.setAttribute('aria-label', format(this.messages.insertAt, { slot: point.slot, index: point.index + 1 }));
        Object.assign(button.style, { left: `${box.left}px`, top: `${top}px`, width: `${box.width}px` });
      }
      for (const [key, button] of existing) if (!keep.has(key)) button.remove();
    }

    // Framed mode: insertion places among the selected node's siblings (the top
    // level is parent_id ""), and at the end of its own children; setDropFilter hides places.
    flatInsertionPoints(selected) {
      const siblings = this.nodes.filter((node) => node.parent === selected.parent).map((node) => node.id);
      const parent = selected.parent ?? '';
      const points = [];
      for (let index = 0; index <= siblings.length; index += 1) points.push({ parent, slot: 'default', index, before: siblings[index], after: siblings[index - 1] });
      const children = selected.slots.default || [];
      if (children.length) points.push({ parent: selected.id, slot: 'default', index: children.length, after: children.at(-1), end: true });
      return points.filter((point) => this.dropFilter({ parent_id: point.parent, slot: point.slot, index: point.index }, null));
    }

    /** The frame's viewport on the host page and the part of it that is visible (clip). */
    frameMetrics() {
      const iframe = this.iframe;
      const win = this.frameDoc?.defaultView;
      if (!iframe?.isConnected || !win) return null;
      const rect = iframe.getBoundingClientRect();
      if (!rect.width && !rect.height) return null;
      const style = globalThis.getComputedStyle(iframe);
      const sides = (name, suffix = '') => ({ top: px(style[`${name}Top${suffix}`]), right: px(style[`${name}Right${suffix}`]), bottom: px(style[`${name}Bottom${suffix}`]), left: px(style[`${name}Left${suffix}`]) });
      const view = frameViewport({ rect, layout: { width: iframe.offsetWidth, height: iframe.offsetHeight }, border: sides('border', 'Width'), padding: sides('padding'), inner: { width: win.innerWidth, height: win.innerHeight }, scroll: { x: win.scrollX, y: win.scrollY } });
      let clip = { left: view.left, top: view.top, right: view.left + view.width, bottom: view.top + view.height };
      // Scrolling ancestors hide what lies outside them, and so does the window.
      const root = globalThis.document.documentElement;
      for (let element = iframe.parentElement; element && element !== root && element !== globalThis.document.body; element = element.parentElement) {
        const own = globalThis.getComputedStyle(element);
        if (own.overflowX === 'visible' && own.overflowY === 'visible') continue;
        const box = element.getBoundingClientRect();
        const left = box.left + element.clientLeft;
        const top = box.top + element.clientTop;
        clip = intersect(clip, { left, top, right: left + element.clientWidth, bottom: top + element.clientHeight });
      }
      view.clip = intersect(clip, { left: 0, top: 0, right: root.clientWidth, bottom: root.clientHeight });
      return view;
    }

    applyClip(clip) {
      const layer = this.layer.getBoundingClientRect();
      const value = !clip || clip.right <= clip.left || clip.bottom <= clip.top
        ? 'inset(50%)'
        : `inset(${Math.max(0, clip.top - layer.top)}px ${Math.max(0, layer.right - clip.right)}px ${Math.max(0, layer.bottom - clip.bottom)}px ${Math.max(0, clip.left - layer.left)}px)`;
      this.layer.style.clipPath = value;
      this.insertionLayer.style.clipPath = value;
    }

    positionFrameToolbar(box) {
      const clip = this.view?.clip;
      const visible = Boolean(box && clip && box.right > clip.left && box.left < clip.right && box.bottom > clip.top && box.top < clip.bottom);
      if (visible) this.toolbar.hidden = this.actions.length === 0;
      else if (!this.toolbar.contains(globalThis.document.activeElement)) this.toolbar.hidden = true;
      if (!visible || this.toolbar.hidden) return;
      const bar = this.toolbar.getBoundingClientRect();
      // Above the node, else below it, and always inside the visible part of the frame.
      const above = box.top - bar.height - 4;
      let top = above >= clip.top ? above : box.bottom + 4;
      top = Math.max(clip.top, Math.min(top, clip.bottom - bar.height));
      const rtl = globalThis.getComputedStyle(this).direction === 'rtl';
      const start = rtl ? box.right - bar.width : box.left;
      const left = Math.max(0, Math.min(start, globalThis.document.documentElement.clientWidth - bar.width));
      Object.assign(this.toolbar.style, { top: `${top}px`, left: `${left}px` });
    }

    /** The innermost node under a pointer event in the frame: the smallest element or rect node that holds it. */
    frameNodeAt(event) {
      let best = null;
      let area = Infinity;
      const consider = (id, width, height) => {
        if (width * height < area) {
          best = id;
          area = width * height;
        }
      };
      for (let element = isElement(event.target) ? event.target : event.target?.parentElement; element; element = element.parentElement) {
        const id = this.elementIds.get(element);
        if (id === undefined || !this.byId.has(id)) continue;
        const box = element.getBoundingClientRect();
        consider(id, box.width, box.height);
      }
      const win = this.frameDoc?.defaultView;
      if (win && this.rectNodes.length && finite(event.clientX)) {
        const x = event.clientX + win.scrollX;
        const y = event.clientY + win.scrollY;
        for (const { id, flat: { rect } } of this.rectNodes) {
          if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) consider(id, rect.width, rect.height);
        }
      }
      return best;
    }

    onFrameClick(event) {
      if (this.editing && this.editing.element.contains(event.target)) return;
      // In the editor a click selects; it never follows links or submits. A
      // click on no node goes back to no selection (the letter itself).
      event.preventDefault();
      const id = this.frameNodeAt(event);
      if (id) event.stopPropagation();
      this.select(id);
    }

    onFrameDoubleClick(event) {
      if (this.editing) return;
      const id = this.frameNodeAt(event);
      if (!id || !this.byId.get(id).flat?.editable) return;
      event.preventDefault();
      this.edit(id);
    }

    onFrameKey(event) {
      if (this.editing) {
        if (event.isComposing) return;
        if (event.key === 'Enter' || event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          this.finishEdit(event.key === 'Enter');
        }
        return;
      }
      if (!event.defaultPrevented) this.onTreeKey(event);
    }

    /** Starts plain-string editing of an editable node inside the frame; returns whether it started. */
    edit(id) {
      const node = typeof id === 'string' ? this.byId.get(id) : null;
      const element = node?.flat?.editable ? node.flat.element : null;
      if (!element || !this.frameDoc || !element.isConnected || element.ownerDocument !== this.frameDoc) return false;
      if (this.editing?.id === id) return true;
      if (this.editing) this.finishEdit(true);
      const returnFocus = globalThis.document.activeElement === this.tree;
      this.select(id);
      const doc = element.ownerDocument;
      const attribute = element.getAttribute('contenteditable');
      element.setAttribute('contenteditable', 'plaintext-only');
      // Where plaintext-only is unknown, rich editing is narrowed to plain text by hand.
      const plain = element.contentEditable === 'plaintext-only';
      if (!plain) element.setAttribute('contenteditable', 'true');
      const connection = new AbortController();
      const options = { signal: connection.signal };
      element.addEventListener('blur', () => this.finishEdit(true), options);
      element.addEventListener('input', () => this.schedule(), options);
      element.addEventListener('beforeinput', (event) => {
        const type = event.inputType || '';
        if (type === 'insertParagraph' || type === 'insertLineBreak' || (!plain && type.startsWith('format'))) event.preventDefault();
      }, options);
      if (!plain) {
        element.addEventListener('paste', (event) => {
          event.preventDefault();
          doc.execCommand('insertText', false, (event.clipboardData?.getData('text/plain') || '').replace(/\s+/gu, ' '));
        }, options);
      }
      this.editing = { id, element, saved: element.cloneNode(true), previous: plainText(element), attribute, connection, returnFocus };
      (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, true);
      this.setAttribute('data-sf-overlay-editing', '');
      element.focus({ preventScroll: true });
      const selection = doc.defaultView?.getSelection();
      if (selection) {
        const range = doc.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      this.live.textContent = format(this.messages.editing, { label: this.info(node).label });
      this.schedule();
      return true;
    }

    /** Ends the inline edit: commit emits sf-composition-overlay-edit (cancelable) when the text changed; cancel restores it. */
    finishEdit(commit) {
      const editing = this.editing;
      if (!editing) return;
      this.editing = null;
      editing.connection.abort();
      (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, false);
      this.removeAttribute('data-sf-overlay-editing');
      const { element } = editing;
      if (editing.attribute === null) element.removeAttribute('contenteditable');
      else element.setAttribute('contenteditable', editing.attribute);
      const restore = () => {
        if (element.isConnected) element.replaceChildren(...editing.saved.childNodes);
      };
      const value = plainText(element);
      if (!commit) restore();
      else if (value !== editing.previous) {
        // The host refused the value: the letter shows what it showed before.
        if (!this.sendRenamed('edit', { id: editing.id, value, previous: editing.previous }, true)) restore();
      }
      if (editing.returnFocus && this.isConnected) this.tree.focus({ preventScroll: true });
      this.schedule();
    }
  }

  registry.define('sf-composition-overlay', SfCompositionOverlay);
  return SfCompositionOverlay;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ OVERLAY_EVENTS, OVERLAY_EVENTS_LEGACY, checkOverlayActions, checkOverlayNodes, defineCompositionOverlay, flatOverlayNodes, frameRectToHost, frameViewport, overlayNodes });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7c1f9c2b36da"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SORTABLE_INTENT_EVENT: () => (/* binding */ SORTABLE_INTENT_EVENT),
/* harmony export */   SORTABLE_MOVE_EVENT: () => (/* binding */ SORTABLE_MOVE_EVENT),
/* harmony export */   SORTABLE_STATE_EVENT: () => (/* binding */ SORTABLE_STATE_EVENT),
/* harmony export */   activeSortableSession: () => (/* binding */ activeSortableSession),
/* harmony export */   attachSortable: () => (/* binding */ attachSortable),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineSortable: () => (/* binding */ defineSortable),
/* harmony export */   registerSortableDropTarget: () => (/* binding */ registerSortableDropTarget),
/* harmony export */   sortableIndexAt: () => (/* binding */ sortableIndexAt)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Sortable drag-and-drop primitive. <sf-sortable> lists and registered
// external drop targets share one drag session. Pointer (mouse, pen, touch via
// handles), keyboard and screen-reader paths all end in the same intent event;
// the component never moves host DOM or data. The host applies the change.


// The request to move an item (simai.smart-vocabulary 1.1.5 §5 move): the
// name sf-sortable's component.json declares. The former sf-sortable-intent
// follows it with the same detail until 2026-12-01.
const SORTABLE_MOVE_EVENT = 'sf-sortable-move';
const SORTABLE_INTENT_EVENT = 'sf-sortable-intent';
const SORTABLE_STATE_EVENT = 'sf-sortable-state';

const ITEM = '[data-sf-sortable-item]';
const HANDLE = '[data-sf-sortable-handle]';
const INTERACTIVE = 'a[href],button,input,select,textarea,summary,[contenteditable]:not([contenteditable="false"])';
const NAME = /^[a-z][a-z0-9-]{0,31}$/u;
const DRAG_THRESHOLD = 4;
const EDGE = 32;

const MESSAGES = {
  ru: {
    instructions: 'Пробел или Enter — взять, стрелки — переместить, Пробел или Enter — положить, Escape — отменить.',
    picked: 'Взято: {item}. Позиция {index} из {total} в «{list}».',
    moved: 'Позиция {index} из {total} в «{list}».',
    dropped: 'Положено: {item}, позиция {index} в «{list}».',
    cancelled: 'Перемещение отменено.',
    target: 'Цель: {target}.',
  },
  en: {
    instructions: 'Space or Enter to pick up, arrows to move, Space or Enter to drop, Escape to cancel.',
    picked: 'Picked up {item}. Position {index} of {total} in “{list}”.',
    moved: 'Position {index} of {total} in “{list}”.',
    dropped: 'Dropped {item} at position {index} in “{list}”.',
    cancelled: 'Move cancelled.',
    target: 'Target: {target}.',
  },
};

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
// In the page's language through pageText, as every component's words are;
// <html lang> alone left SF.language.use() unheard (documentation trial).
const messages = () => Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, undefined, 'sf-sortable')]));
// Separate Smart bundles (sf-sortable, sf-composition-overlay) each carry a copy
// of this module; the drag session and external targets live on one global
// record so a library drag can land on the overlay. The key carries the record
// version, so bundles with another record shape never share it.
const shared = globalThis.__sfSortableSharedV1 || (globalThis.__sfSortableSharedV1 = { targets: new Set(), session: null });
const externalTargets = shared.targets;

/** The active drag session (read-only view), or null. */
function activeSortableSession() {
  return shared.session ? Object.freeze({ item: shared.session.item, from: shared.session.from, group: shared.session.group, mode: shared.session.mode, input: shared.session.input }) : null;
}

/**
 * Registers a non-list drop target such as the editor overlay.
 * resolve(x, y, session) returns {descriptor, rect, label} or null;
 * drop(session, descriptor) performs the intent emission.
 */
function registerSortableDropTarget(target) {
  if (!target || typeof target.resolve !== 'function' || typeof target.drop !== 'function') throw new TypeError('Drop target needs resolve and drop');
  externalTargets.add(target);
  return () => externalTargets.delete(target);
}

// Visible text of an item without decorative (aria-hidden) parts.
function itemLabel(item) {
  if (item.getAttribute('aria-label')) return item.getAttribute('aria-label');
  const clone = item.cloneNode(true);
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return clone.textContent.replace(/\s+/gu, ' ').trim();
}

function listName(list) {
  return list.getAttribute('label') || list.getAttribute('aria-label') || list.getAttribute('group') || '';
}

function items(list) {
  return [...list.querySelectorAll(ITEM)].filter((item) => item.closest('sf-sortable') === list);
}

function accepts(list, group) {
  if (!list || list.getAttribute('mode') === 'copy') return false;
  const own = list.getAttribute('group');
  const extra = (list.getAttribute('accepts') || '').split(/\s+/u).filter(Boolean);
  return group === own || extra.includes(group);
}

function scrollContainer(element) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const style = globalThis.getComputedStyle(node);
    if (/(auto|scroll)/u.test(style.overflowY) && node.scrollHeight > node.clientHeight) return node;
  }
  return globalThis.document.scrollingElement;
}

function indicator() {
  let line = globalThis.document.querySelector('.sf-sortable-indicator');
  if (!line) {
    line = globalThis.document.createElement('div');
    line.className = 'sf-sortable-indicator';
    line.setAttribute('aria-hidden', 'true');
    globalThis.document.body.append(line);
  }
  return line;
}

function showIndicator(rect) {
  const line = indicator();
  if (!rect) {
    line.hidden = true;
    return;
  }
  line.hidden = false;
  Object.assign(line.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
}

// The silhouette: while a pointer drags, the place the item would take opens in
// the list as an empty outline of its size, and the list moves to make room --
// a line two pixels thick said where, but not how the list would look, and the
// owner could not tell where a row would land before letting go (2026-10-13).
// The item itself leaves the flow while it is dragged; its copy follows the
// pointer. A list that wraps into a grid opens the place among its cells, in
// reading order (owner, 2026-10-14: the fields of a record view arranged in two
// columns moved with a line nobody could follow). Keyboard moves, external
// targets and a list written preview="line" keep the line.
function silhouetteFor(list) {
  return list.getAttribute('preview') !== 'line';
}

function placeholder(session) {
  if (session.placeholder) return session.placeholder;
  const box = session.sourceBox;
  const element = globalThis.document.createElement('div');
  element.className = 'sf-sortable-placeholder';
  element.setAttribute('aria-hidden', 'true');
  Object.assign(element.style, { inlineSize: `${box.width}px`, blockSize: `${box.height}px` });
  session.placeholder = element;
  return element;
}

// Where the outline goes, and the final index it stands for: counted among the
// items still in the flow -- not the dragged one -- so it is the index the item
// will have once it is moved.
function placeSilhouette(session, list, x, y) {
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  const visible = items(list).filter((item) => item !== session.source);
  // A grid is read row by row; the outline is one of its cells. Whether the
  // list wraps is asked of the items left in the flow, the dragged one being
  // out of it, or remembered from when the drag began.
  const wrapped = !horizontal && (isWrapped(visible) || session.wrappedLists?.has(list));
  let index;
  if (wrapped) {
    index = wrappedIndexAt(visible, x, y);
  } else {
    const boxes = visible.map((item) => {
      const box = item.getBoundingClientRect();
      return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
    });
    index = sortableIndexAt(boxes, horizontal ? x : y);
  }
  const element = placeholder(session);
  const before = visible[index];
  if (before) {
    if (element.nextElementSibling !== before) before.before(element);
  } else if (visible.length) {
    const last = visible[visible.length - 1];
    if (last.nextElementSibling !== element) last.after(element);
  } else if (element.parentElement !== list) {
    list.append(element);
  }
  return index;
}

/** Index where an item would land in a list for a pointer position. */
function sortableIndexAt(boxes, coordinate, exclude = -1) {
  let index = 0;
  for (let position = 0; position < boxes.length; position += 1) {
    if (position === exclude) continue;
    const box = boxes[position];
    if (coordinate > box.start + (box.end - box.start) / 2) index = position + 1;
  }
  return index;
}

/**
 * Whether the list flows in both axes -- two items standing side by side on one
 * row. A list like that is neither vertical nor horizontal, and asking only the
 * vertical axis cannot tell the left half of a row from the right half.
 */
function isWrapped(all) {
  for (let position = 1; position < all.length; position += 1) {
    const previous = all[position - 1].getBoundingClientRect();
    const current = all[position].getBoundingClientRect();
    if (current.top < previous.bottom - 1 && current.left >= previous.right - 1) return true;
  }
  return false;
}

/** Index where an item would land in a list that wraps, in reading order. */
function wrappedIndexAt(all, x, y) {
  let index = 0;
  for (let position = 0; position < all.length; position += 1) {
    const box = all[position].getBoundingClientRect();
    const past = y > box.bottom ? true : y < box.top ? false : x > box.left + box.width / 2;
    if (past) index = position + 1;
  }
  return index;
}

function listTarget(list, x, y) {
  const all = items(list);
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  if (!horizontal && isWrapped(all)) {
    const index = wrappedIndexAt(all, x, y);
    return { list, index, rect: wrappedIndicatorRect(list, all, index) };
  }
  const boxes = all.map((item) => {
    const box = item.getBoundingClientRect();
    return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
  });
  const index = sortableIndexAt(boxes, horizontal ? x : y);
  return { list, index, rect: listIndicatorRect(list, all, index, horizontal) };
}

/**
 * A line down the side of the place the item would take, not across the whole
 * row: in a two-column list a full-width line cannot say which of the two halves
 * the item is about to land in.
 */
function wrappedIndicatorRect(list, all, index) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (before) {
    const target = before.getBoundingClientRect();
    return { left: target.left - 1, top: target.top, width: 2, height: target.height };
  }
  if (after) {
    const target = after.getBoundingClientRect();
    return { left: target.right - 1, top: target.top, width: 2, height: target.height };
  }
  return { left: box.left, top: box.top, width: 2, height: box.height };
}

function listIndicatorRect(list, all, index, horizontal) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (horizontal) {
    const x = before ? before.getBoundingClientRect().left : after ? after.getBoundingClientRect().right : box.left;
    return { left: x - 1, top: box.top, width: 2, height: box.height };
  }
  const y = before ? before.getBoundingClientRect().top : after ? after.getBoundingClientRect().bottom : box.top;
  return { left: box.left, top: y - 1, width: box.width, height: 2 };
}

// An sf-sortable list sends the new name and its aliases.json sends the old
// one after it; a container the column mode attached to, or a list defined
// without its manifest, sends both here.
function emitIntent(target, detail) {
  const frozen = Object.freeze(detail);
  target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_MOVE_EVENT, { bubbles: true, composed: true, detail: frozen }));
  if (!target.__sfAliases) target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_INTENT_EVENT, { bubbles: true, composed: true, detail: frozen }));
}

// A keyboard move ends with the person's focus on the item they moved. The
// host applies the intent by redrawing its list, and a redraw that replaces
// the dragged element drops focus to the body: the keyboard user lost their
// place in the page and had to tab back from the top (consumer case
// ui-mail.sortable-editor-recipe, 2026-10-21). Two frames after the drop --
// the host has redrawn by then -- the item with the same id takes focus back,
// in whichever list it landed. A host that restores focus itself keeps it:
// focus is only moved when it fell to the body or out of the document.
function restoreFocusAfterDrop(ended) {
  const document_ = globalThis.document;
  const id = ended.item;
  if (!id || !document_) return;
  const place = () => {
    const active = document_.activeElement;
    if (active && active !== document_.body && document_.contains(active)) return;
    const scope = ended.list && document_.contains(ended.list) ? ended.list : document_;
    const item = scope.querySelector(`[data-sf-sortable-item="${globalThis.CSS?.escape ? globalThis.CSS.escape(id) : id}"]`);
    item?.focus?.({ preventScroll: false });
  };
  if (typeof globalThis.requestAnimationFrame !== 'function') { place(); return; }
  globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(place));
}

function finish(list, reason) {
  if (!shared.session) return;
  const ended = shared.session;
  shared.session = null;
  ended.cleanup?.abort();
  if (ended.scrollFrame) globalThis.cancelAnimationFrame(ended.scrollFrame);
  ended.source?.removeAttribute('data-sf-sortable-dragging');
  ended.source?.removeAttribute('data-sf-sortable-lifted');
  ended.placeholder?.remove();
  ended.ghost?.remove();
  showIndicator(null);
  for (const target of externalTargets) target.leave?.();
  globalThis.document.documentElement.removeAttribute('data-sf-sortable-active');
  list.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: reason, item: ended.item }) }));
  if (reason === 'dropped' && ended.input === 'keyboard') restoreFocusAfterDrop(ended);
}

// base: the class made from sf-sortable's component.json (manifest-host.mjs);
// without it the list is a plain element, as the overlay's bundle defines it.
function defineSortable(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-sortable');
  if (existing) return existing;

  class SfSortable extends (base || globalThis.HTMLElement) {
    constructor() {
      super();
      this.connection = null;
      this.live = null;
      this.instructions = null;
    }

    connectedCallback() {
      super.connectedCallback?.();
      if (this.connection) return;
      this.connection = new AbortController();
      const options = { signal: this.connection.signal };
      if (!this.live) {
        this.live = globalThis.document.createElement('div');
        this.live.className = 'sf-sortable-live';
        // Pick-up, move and drop are routine steps the person caused; polite
        // waits for the reader instead of cutting across what it was saying.
        this.live.setAttribute('aria-live', 'polite');
        this.instructions = globalThis.document.createElement('div');
        this.instructions.className = 'sf-sortable-live';
        this.instructions.id = `sf-sortable-help-${Math.random().toString(36).slice(2, 10)}`;
      }
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
      this.addEventListener('pointerdown', (event) => this.onPointerDown(event), options);
      this.addEventListener('keydown', (event) => this.onKeyDown(event), options);
      this.addEventListener('focusin', (event) => this.prepareItem(event.target.closest?.(ITEM)), options);
      for (const item of items(this)) this.prepareItem(item);
      // Items the host adds later become focusable and draggable as well.
      this.observer = new globalThis.MutationObserver(() => { this.ensureAccessibilityNodes(); for (const item of items(this)) this.prepareItem(item); });
      this.observer.observe(this, { childList: true, subtree: true });
      this.setAttribute('data-sf-sortable', 'connected');
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.observer?.disconnect();
      this.observer = null;
      this.connection?.abort();
      this.connection = null;
      if (shared.session?.fromList === this || shared.session?.list === this) finish(this, 'cancelled');
      this.setAttribute('data-sf-sortable', 'disposed');
    }

    prepareItem(item) {
      if (!item || item.closest('sf-sortable') !== this) return;
      if (!item.hasAttribute('tabindex') && !item.matches(INTERACTIVE)) item.tabIndex = 0;
      const described = (item.getAttribute('aria-describedby') || '').split(/\s+/u);
      if (this.instructions && !described.includes(this.instructions.id)) item.setAttribute('aria-describedby', [...described.filter(Boolean), this.instructions.id].join(' '));
      if (!item.querySelector(HANDLE)) item.style.touchAction = 'none';
    }

    // The list keeps its live region and its instructions among its own
    // children, so a host that redraws the list with replaceChildren() takes
    // them out: announcements then went to a detached node, and items said
    // nothing (consumer case ui-mail.sortable-editor-recipe, 2026-10-21). The
    // component owns these two nodes and puts them back, with the same
    // instructions id the items point at through aria-describedby.
    ensureAccessibilityNodes() {
      if (!this.live || !this.instructions) return;
      if (this.live.parentNode === this && this.instructions.parentNode === this) return;
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
    }

    announce(text) {
      this.ensureAccessibilityNodes();
      if (this.live) this.live.textContent = text;
    }

    get group() {
      const value = this.getAttribute('group') || '';
      return NAME.test(value) ? value : '';
    }

    get mode() {
      return this.getAttribute('mode') === 'copy' ? 'copy' : 'move';
    }

    begin(item, input) {
      const id = item.getAttribute('data-sf-sortable-item');
      if (!id || !this.group || shared.session) return false;
      const all = items(this);
      const sourceBox = item.getBoundingClientRect();
      shared.session = {
        sourceBox,
        item: id, from: this.getAttribute('id') || this.group, group: this.group, mode: this.mode, input,
        source: item, fromList: this, sourceIndex: all.indexOf(item), list: this.mode === 'copy' ? null : this,
        index: all.indexOf(item), external: null, cleanup: new AbortController(),
      };
      item.setAttribute('data-sf-sortable-dragging', '');
      globalThis.document.documentElement.setAttribute('data-sf-sortable-active', '');
      this.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: 'picked', item: id }) }));
      return true;
    }

    // Pointer path ---------------------------------------------------------
    onPointerDown(event) {
      if (event.button !== 0 || shared.session) return;
      const item = event.target.closest?.(ITEM);
      if (!item || item.closest('sf-sortable') !== this) return;
      const handle = item.querySelector(HANDLE);
      if (handle && !handle.contains(event.target)) return;
      if (!handle && event.target.closest(INTERACTIVE) && event.target.closest(INTERACTIVE) !== item) return;
      const start = { x: event.clientX, y: event.clientY };
      const pointer = event.pointerId;
      let started = false;
      const pending = new AbortController();
      const move = (moveEvent) => {
        if (moveEvent.pointerId !== pointer) return;
        if (!started) {
          if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < DRAG_THRESHOLD) return;
          if (!this.begin(item, moveEvent.pointerType || 'mouse')) { pending.abort(); return; }
          started = true;
          item.setPointerCapture?.(pointer);
          shared.session.ghost = this.ghost(item, moveEvent);
          // The item leaves the flow only once its copy is on screen; a copy
          // library (mode copy) keeps its item where it is.
          if (silhouetteFor(this) && this.mode !== 'copy') {
            shared.session.silhouette = true;
            // Asked before the item leaves the flow: with it gone, a grid of
            // two cells is one cell and does not look like a grid.
            shared.session.wrappedLists = new Set(isWrapped(items(this)) ? [this] : []);
            item.setAttribute('data-sf-sortable-lifted', '');
            this.retarget(moveEvent.clientX, moveEvent.clientY);
          }
        }
        moveEvent.preventDefault();
        this.track(moveEvent.clientX, moveEvent.clientY);
      };
      const up = (upEvent) => {
        if (upEvent.pointerId !== pointer) return;
        pending.abort();
        if (started) this.drop();
      };
      const cancel = () => {
        pending.abort();
        if (started) finish(this, 'cancelled');
      };
      globalThis.addEventListener('pointermove', move, { signal: pending.signal, passive: false });
      globalThis.addEventListener('pointerup', up, { signal: pending.signal });
      globalThis.addEventListener('pointercancel', cancel, { signal: pending.signal });
      // Capture phase: cancel the drag before page-level Escape handlers run.
      globalThis.addEventListener('keydown', (keyEvent) => { if (keyEvent.key === 'Escape' && started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); cancel(); } }, { signal: pending.signal, capture: true });
    }

    ghost(item, event) {
      const box = item.getBoundingClientRect();
      const ghost = item.cloneNode(true);
      ghost.removeAttribute('id');
      for (const element of ghost.querySelectorAll('[id]')) element.removeAttribute('id');
      ghost.classList.add('sf-sortable-ghost');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.inert = true;
      Object.assign(ghost.style, { width: `${box.width}px`, left: `${box.left}px`, top: `${box.top}px` });
      shared.session.offset = { x: event.clientX - box.left, y: event.clientY - box.top };
      globalThis.document.body.append(ghost);
      return ghost;
    }

    track(x, y) {
      if (!shared.session) return;
      shared.session.pointer = { x, y };
      if (shared.session.ghost) Object.assign(shared.session.ghost.style, { left: `${x - shared.session.offset.x}px`, top: `${y - shared.session.offset.y}px` });
      this.retarget(x, y);
      this.startAutoScroll();
    }

    retarget(x, y) {
      const under = globalThis.document.elementFromPoint(x, y);
      const list = under?.closest?.('sf-sortable');
      for (const target of externalTargets) {
        const resolved = target.resolve(x, y, activeSortableSession());
        if (resolved) {
          shared.session.list = null;
          shared.session.external = { target, ...resolved };
          showIndicator(resolved.rect);
          return;
        }
      }
      shared.session.external = null;
      if (list && accepts(list, shared.session.group)
          && shared.session.silhouette && silhouetteFor(list)) {
        shared.session.list = list;
        shared.session.index = placeSilhouette(shared.session, list, x, y);
        showIndicator(null);
        return;
      }
      shared.session.placeholder?.remove();
      if (list && accepts(list, shared.session.group)) {
        const resolved = listTarget(list, x, y);
        shared.session.list = list;
        // Store the final index: positions after the source shift by one.
        shared.session.index = list === shared.session.fromList && shared.session.mode === 'move' && resolved.index > shared.session.sourceIndex ? resolved.index - 1 : resolved.index;
        showIndicator(resolved.rect);
      } else {
        shared.session.list = null;
        showIndicator(null);
      }
    }

    // Scrolls the nearest scroll container every frame while the pointer
    // stays in its edge zone, including when the pointer is held still.
    startAutoScroll() {
      if (!shared.session || shared.session.scrollFrame) return;
      const step = () => {
        if (!shared.session?.pointer) return;
        shared.session.scrollFrame = 0;
        const { x, y } = shared.session.pointer;
        const container = scrollContainer(globalThis.document.elementFromPoint(x, y));
        if (!container) return;
        const box = container === globalThis.document.scrollingElement
          ? { top: 0, bottom: globalThis.innerHeight }
          : container.getBoundingClientRect();
        const max = container.scrollHeight - container.clientHeight;
        let delta = 0;
        if (y < box.top + EDGE && container.scrollTop > 0) delta = -Math.ceil((box.top + EDGE - y) / 4);
        else if (y > box.bottom - EDGE && container.scrollTop < max) delta = Math.ceil((y - box.bottom + EDGE) / 4);
        if (delta) {
          // Instant even under scroll-behavior: smooth, so every frame advances.
          container.scrollBy({ top: delta, behavior: 'instant' });
          this.retarget(x, y);
          shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
        }
      };
      shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
    }

    drop() {
      if (!shared.session) return;
      const current = shared.session;
      if (current.external) {
        current.external.target.drop(activeSortableSession(), current.external.descriptor);
        finish(this, 'dropped');
        return;
      }
      if (current.list) {
        const index = current.index;
        const unchanged = current.list === current.fromList && index === current.sourceIndex;
        if (!unchanged) {
          emitIntent(current.list, {
            item: current.item, from: current.from, to: current.list.getAttribute('id') || current.list.group,
            index, mode: current.mode,
          });
          current.list.announce?.(format(messages().dropped, { item: itemLabel(current.source), index: index + 1, list: listName(current.list) }));
          finish(this, 'dropped');
          return;
        }
      }
      finish(this, 'cancelled');
    }

    // Keyboard path --------------------------------------------------------
    keyboardTargets() {
      return [...globalThis.document.querySelectorAll('sf-sortable')].filter((list) => list === shared.session?.fromList ? shared.session.mode === 'move' : accepts(list, shared.session?.group));
    }

    describeKeyboard(announce = true) {
      if (!shared.session) return;
      if (shared.session.external) {
        showIndicator(shared.session.external.rect);
        if (announce) this.announce(format(messages().target, { target: shared.session.external.label || '' }));
        return;
      }
      const list = shared.session.list;
      const full = items(list);
      const sameList = list === shared.session.fromList && shared.session.mode === 'move';
      const positions = full.length + (sameList ? 0 : 1);
      const physical = sameList && shared.session.index > shared.session.sourceIndex ? shared.session.index + 1 : shared.session.index;
      showIndicator(listIndicatorRect(list, full, Math.min(physical, full.length), list.getAttribute('orientation') === 'horizontal'));
      if (announce) this.announce(format(messages().moved, { index: shared.session.index + 1, total: positions, list: listName(list) }));
    }

    onKeyDown(event) {
      const item = event.target.closest?.(ITEM);
      if (!shared.session) {
        if (!item || item.closest('sf-sortable') !== this || event.target !== item) return;
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault();
        if (!this.begin(item, 'keyboard')) return;
        // An abandoned keyboard move is cancelled when focus or a click leaves the list.
        const abandon = () => { if (shared.session?.fromList === this) { this.announce(messages().cancelled); finish(this, 'cancelled'); } };
        const cleanup = { signal: shared.session.cleanup.signal };
        this.addEventListener('focusout', (focusEvent) => {
          if (focusEvent.relatedTarget && this.contains(focusEvent.relatedTarget)) return;
          globalThis.setTimeout(() => { if (!this.contains(globalThis.document.activeElement)) abandon(); }, 0);
        }, cleanup);
        globalThis.document.addEventListener('pointerdown', (pointerEvent) => { if (!this.contains(pointerEvent.target)) abandon(); }, { ...cleanup, capture: true });
        if (shared.session.mode === 'copy') {
          const [first] = this.keyboardTargets();
          const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
          if (first) {
            shared.session.list = first;
            shared.session.index = items(first).length;
          } else if (external.length) {
            shared.session.external = external[0];
          } else {
            finish(this, 'cancelled');
            return;
          }
        }
        if (shared.session.external) {
          this.describeKeyboard(false);
          this.announce(`${format(messages().picked, { item: itemLabel(item), index: 1, total: 1, list: '' }).split('.')[0]}. ${format(messages().target, { target: shared.session.external.label || '' })}`);
          return;
        }
        const all = items(shared.session.list);
        this.describeKeyboard(false);
        this.announce(format(messages().picked, { item: itemLabel(item), index: shared.session.index + 1, total: all.length, list: listName(shared.session.list) }));
        return;
      }
      if (shared.session.input !== 'keyboard' || shared.session.fromList !== this) return;
      const lists = this.keyboardTargets();
      const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        this.announce(messages().cancelled);
        finish(this, 'cancelled');
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.drop();
        return;
      }
      const vertical = { ArrowUp: -1, ArrowDown: 1 }[event.key];
      const across = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (vertical === undefined && across === undefined) return;
      event.preventDefault();
      if (shared.session.external) {
        const position = external.findIndex((entry) => entry.target === shared.session.external.target && JSON.stringify(entry.descriptor) === JSON.stringify(shared.session.external.descriptor));
        const next = external[position + (vertical ?? across)];
        if (next) shared.session.external = next;
        else if ((vertical ?? across) < 0 && lists.length) {
          shared.session.external = null;
          shared.session.list = lists.at(-1);
          shared.session.index = items(shared.session.list).length - (shared.session.list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
        }
        this.describeKeyboard();
        return;
      }
      const list = shared.session.list;
      const count = items(list).length - (list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
      if (vertical !== undefined) {
        const next = shared.session.index + vertical;
        if (next >= 0 && next <= count) shared.session.index = next;
        else if (next > count && across === undefined && external.length && lists.indexOf(list) === lists.length - 1) shared.session.external = external[0];
      } else {
        const next = lists[lists.indexOf(list) + across];
        if (next) {
          shared.session.list = next;
          shared.session.index = Math.min(shared.session.index, items(next).length - (next === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0));
        } else if (across > 0 && external.length) {
          shared.session.external = external[0];
        }
      }
      this.describeKeyboard();
    }
  }

  registry.define('sf-sortable', SfSortable);
  return SfSortable;
}

/**
 * sf-sortable's pointer behaviour on any container, without the element: a
 * table's head row cannot hold a custom element around its cells, and its
 * columns move with every cell under them (owner, 2026-10-13). The container
 * keeps its markup; the controller listens on it.
 *
 * options:
 *   items        selector of the movable children (required)
 *   canStart     (event, item) => boolean -- a press that may begin a drag
 *   groupOf      (item) => string -- an item moves among items of its group
 *   preview      'column' (default) | 'line'
 *   extent       the element a column spans (a table); default the container
 *   cellsOf      (item) => elements to mark as the moving column (its cells)
 *   label        the list's name for the announcement
 *   onIntent     ({item, from, index, group}) -- index among the group's items
 *                without the dragged one, the place it is to take
 * Returns detach().
 *
 * Keyboard reordering stays where a list is: a table's column settings are an
 * sf-sortable list with every key path. A click that ends a drag is swallowed,
 * so a heading that sorts on click does not sort on a drop.
 */
function attachSortable(container, options = {}) {
  if (!(container instanceof globalThis.Element) || typeof options.items !== 'string') {
    throw new TypeError('attachSortable needs a container and an items selector');
  }
  const doc = globalThis.document;
  const preview = options.preview === 'line' ? 'line' : 'column';
  const groupOf = typeof options.groupOf === 'function' ? options.groupOf : () => '';
  const canStart = typeof options.canStart === 'function' ? options.canStart : () => true;
  const cellsOf = typeof options.cellsOf === 'function' ? options.cellsOf : (item) => [item];
  const extentOf = () => options.extent?.isConnected ? options.extent : container;
  const live = doc.createElement('div');
  live.className = 'sf-sortable-live';
  live.setAttribute('aria-live', 'polite');
  doc.body.append(live);
  const abort = new AbortController();
  let session = null;

  const members = (group) => [...container.querySelectorAll(options.items)].filter((item) => groupOf(item) === group);
  const outline = () => {
    if (session.outline) return session.outline;
    const box = doc.createElement('div');
    box.className = preview === 'column' ? 'sf-sortable-column-outline' : 'sf-sortable-indicator';
    box.setAttribute('aria-hidden', 'true');
    doc.body.append(box);
    session.outline = box;
    return box;
  };

  const place = (x) => {
    const peers = members(session.group).filter((item) => item !== session.item);
    const boxes = peers.map((item) => item.getBoundingClientRect());
    let index = boxes.length;
    for (let at = 0; at < boxes.length; at += 1) {
      if (x < boxes[at].left + boxes[at].width / 2) { index = at; break; }
    }
    session.index = index;
    const extent = extentOf().getBoundingClientRect();
    const width = session.width;
    const before = boxes[index];
    const after = boxes[index - 1];
    let left;
    if (preview === 'column') {
      // The outline stands where the column will be. Moving towards the start
      // it takes the place of the column it goes before (that one moves on);
      // moving towards the end it ends where the column it goes after ends.
      if (index > session.originalIndex && after) left = after.right - width;
      else left = before ? before.left : (after ? after.right - width : extent.left);
    } else {
      left = (before ? before.left : after ? after.right : extent.left) - 1;
    }
    Object.assign(outline().style, {
      left: `${left}px`, top: `${extent.top}px`,
      width: preview === 'column' ? `${width}px` : '2px', height: `${extent.height}px`,
    });
  };

  const autoScroll = (x) => {
    for (let node = container.parentElement; node; node = node.parentElement) {
      const style = globalThis.getComputedStyle(node);
      if (!/(auto|scroll)/u.test(style.overflowX) || node.scrollWidth <= node.clientWidth) continue;
      const box = node.getBoundingClientRect();
      if (x < box.left + EDGE) node.scrollBy({left: -Math.ceil((box.left + EDGE - x) / 4), behavior: 'instant'});
      else if (x > box.right - EDGE) node.scrollBy({left: Math.ceil((x - box.right + EDGE) / 4), behavior: 'instant'});
      return;
    }
  };

  const end = (dropped) => {
    const ended = session;
    session = null;
    if (!ended) return;
    ended.pending.abort();
    ended.ghost?.remove();
    ended.outline?.remove();
    for (const cell of ended.cells) cell.removeAttribute('data-sf-sortable-column-source');
    doc.documentElement.removeAttribute('data-sf-sortable-active');
    if (!ended.started) return;
    // The click a drop ends with is not a click on the heading. It comes in the
    // same task as the pointerup, so the guard is gone by the next one and a
    // later click is a click again.
    const swallow = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
    container.addEventListener('click', swallow, {capture: true, once: true});
    globalThis.setTimeout(() => container.removeEventListener('click', swallow, {capture: true}), 0);
    if (!dropped) {
      live.textContent = messages().cancelled;
      return;
    }
    if (ended.index === undefined || ended.index === ended.originalIndex) return;
    const id = ended.item.getAttribute('data-sf-sortable-item') || ended.item.dataset.key || '';
    live.textContent = format(messages().dropped, {item: itemLabel(ended.item), index: ended.index + 1, list: options.label || ''});
    options.onIntent?.({item: id, from: ended.group, index: ended.index, group: ended.group});
  };

  container.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || session || shared.session) return;
    const item = event.target.closest?.(options.items);
    if (!item || !container.contains(item) || !canStart(event, item)) return;
    const group = groupOf(item);
    const peers = members(group);
    if (peers.length < 2) return;
    const start = {x: event.clientX, y: event.clientY};
    const pending = new AbortController();
    const box = item.getBoundingClientRect();
    session = {item, group, pending, started: false, cells: [], width: box.width, originalIndex: peers.indexOf(item)};
    const move = (moveEvent) => {
      if (moveEvent.pointerId !== event.pointerId || !session) return;
      if (!session.started) {
        if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < DRAG_THRESHOLD) return;
        session.started = true;
        doc.documentElement.setAttribute('data-sf-sortable-active', '');
        const ghost = item.cloneNode(true);
        ghost.removeAttribute('id');
        for (const element of ghost.querySelectorAll('[id]')) element.removeAttribute('id');
        ghost.classList.add('sf-sortable-ghost');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.inert = true;
        Object.assign(ghost.style, {width: `${box.width}px`, height: `${box.height}px`, left: `${box.left}px`, top: `${box.top}px`});
        doc.body.append(ghost);
        session.ghost = ghost;
        session.offset = {x: start.x - box.left, y: start.y - box.top};
        session.cells = cellsOf(item).filter(Boolean);
        for (const cell of session.cells) cell.setAttribute('data-sf-sortable-column-source', '');
      }
      moveEvent.preventDefault();
      Object.assign(session.ghost.style, {left: `${moveEvent.clientX - session.offset.x}px`, top: `${moveEvent.clientY - session.offset.y}px`});
      autoScroll(moveEvent.clientX);
      place(moveEvent.clientX);
    };
    globalThis.addEventListener('pointermove', move, {signal: pending.signal, passive: false});
    globalThis.addEventListener('pointerup', (upEvent) => { if (upEvent.pointerId === event.pointerId) end(true); }, {signal: pending.signal});
    globalThis.addEventListener('pointercancel', () => end(false), {signal: pending.signal});
    globalThis.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Escape' && session?.started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); end(false); }
    }, {signal: pending.signal, capture: true});
  }, {signal: abort.signal});

  return () => {
    end(false);
    abort.abort();
    live.remove();
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ SORTABLE_MOVE_EVENT, activeSortableSession, attachSortable, defineSortable, registerSortableDropTarget, sortableIndexAt });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4fe3d0c72eda"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-composition-overlay for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-composition-overlay-action","to":"sf-composition-overlay-apply","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-composition-overlay-action","to":"apply"},"section":"§8, vocabulary 1.1.5","note":"the old detail {action_id, node_id} is made by the element\'s adapter"},{"from":"sf-composition-overlay-edit","to":"sf-composition-overlay-change","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"manifest":{"from":"sf-composition-overlay-edit","to":"change"},"section":"§8, vocabulary 1.1.5","note":"the old detail {node_id, value, previous} is made by the element\'s adapter; the cancel is shared"},{"from":"sf-composition-overlay-select","to":"select","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the DOM name is unchanged; the detail adds ids and id beside node_id"},{"from":"sf-composition-overlay-move","to":"move","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the DOM name is unchanged; the detail adds ids, id, parent and position beside node_id, parent_id and index"},{"from":"sf-composition-overlay-insert","to":"insert","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the manifest declares the verb; the DOM name is unchanged; the detail adds parent beside parent_id"}]}');

/***/ },

/***/ "323a38a1c20d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-composition-overlay\'s interface (core/js/element-manifest.js over core/js/composition/manifest-host.mjs). Taken from simai/ui-control control/smart-architecture/migration/out/composition-overlay (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.composition-overlay","tag":"sf-composition-overlay","version":"1.2.0","kind":"leaf","family":"editor","settings":{"for":{"type":"string","default":"","summary":"The id of the canvas element the overlay draws over"},"frame":{"type":"string","default":"","summary":"The id of a same-origin iframe canvas (framed mode, fed by setNodes)"},"accepts":{"type":"string","default":"","summary":"sf-sortable groups whose items may be dropped on the canvas, separated by spaces"},"label":{"type":"string","default":"","summary":"The structure tree\'s name; the language file\'s runtime.tree otherwise"},"actions":{"type":"list","default":[],"of":{"id":"string","label":"string"},"summary":"The selected node\'s actions: up to 16 {id, label}; written through the same check as setActions"},"messages":{"type":"object","default":{},"summary":"The host\'s own words over the language file\'s; written through setMessages"},"insertion-target":{"type":"object","default":{},"summary":"The insertion place the host keeps marked {parent_id, slot, index}; written through setInsertionTarget"}},"values":{},"events":{"select":{"carries":{"ids":"list","id":{"type":"id","nullable":true}},"summary":"A node was selected (or the selection cleared): vocabulary 1.1.5 §5 select; the detail keeps node_id for the composition host"},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["entry"]},"ids":"list"},"summary":"An action of the toolbar was chosen for the selected node: one entry\'s own action (vocabulary §5 apply, standard §18.3)"},"insert":{"carries":{"parent":"id","slot":"string","index":"number","item":"string","from":"string","mode":{"type":"enum","values":["move","copy"]}},"own-verb":true,"summary":"An insertion point was chosen, or a library item dropped on the canvas: the place {parent, slot, index} and the item when one was dragged; the detail keeps parent_id for the composition host"},"move":{"carries":{"ids":"list","id":"id","parent":"id","position":"number","slot":"string"},"summary":"A node was moved to a place by pointer or keyboard: one manual move (vocabulary §5 move, {id, parent, position}); the detail keeps node_id, parent_id and index for the composition host"},"change":{"carries":{"id":"id","value":"string","previous":"string"},"cancelable":true,"x-native":false,"summary":"A plain-string edit was committed; cancelled, the text shows what it showed before"}},"actions":{"attach":{"with":{"canvas":"object"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Draws over a canvas element; the canvas is never modified"},"attach-frame":{"with":{"iframe":"object"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Draws over a same-origin iframe canvas fed by set-nodes"},"set-document":{"with":{"document":"object","options":"object"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Reads a Composition Document\'s nodes"},"set-nodes":{"with":{"nodes":{"type":"list","of":{"id":"id","kind":"string","label":"string","parent":"id","editable":"boolean","rect":"object","element":"object"}},"options":"object"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Reads a flat node list (framed mode)"},"set-drop-filter":{"with":{"filter":"object"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"filter({parent_id, slot, index}, item) hides the places a drop may not take"},"set-actions":{"with":{"actions":"list"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Writes the selected node\'s actions (the actions setting)"},"set-messages":{"with":{"messages":"object"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Writes the host\'s own words (the messages setting)"},"set-insertion-target":{"with":{"target":"object"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Writes the marked insertion place (the insertion-target setting)"},"select":{"with":{"id":"object","options":"object"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Selects a node; {focus, emit}"},"edit":{"with":{"id":"string"},"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Starts a plain-string edit of an editable node"},"refresh":{"x-returns":"the element, for chaining (the composition host\'s port)","summary":"Measures the canvas again"}},"keyboard":{"host":{"ArrowUp":"focus:prev","ArrowDown":"focus:next","ArrowLeft":"focus:prev","ArrowRight":"focus:next","Home":"focus:first","End":"focus:last","Enter":"select","Space":"select","Escape":"close","Tab":"reach"}},"templates":{"default":{"file":"../../core/js/composition/overlay.mjs","$comment":"The overlay draws its frames, toolbar, insertion points and structure tree itself (core/js/composition/overlay.mjs); the canvas is the host\'s and is never changed."}},"examples":"examples.json","docs":"docs.md","lang":"lang/","accessibility":{"$comment":"The structure tree is the overlay\'s keyboard surface: role tree, named by label (the language file\'s «Структура страницы» otherwise), one Tab stop; the arrows walk the nodes, Enter or Space selects, Escape closes a move or an edit; the toolbar is role toolbar; each step is said in a polite live region.","role":"tree","name":{"from":["label","runtime.tree"]},"keys":{"ArrowUp":"focus:prev","ArrowDown":"focus:next","ArrowLeft":"focus:prev","ArrowRight":"focus:next","Home":"focus:first","End":"focus:last","Enter":"select","Space":"select","Escape":"close","Tab":"reach"}},"css-variables":{"--sf-composition-overlay-frame-color":{"type":"color","state":"default"},"--sf-composition-overlay-z-index":{"type":"number","state":"default"},"--sf-composition-overlay-toolbar-background-color":{"type":"color","state":"selected"},"--sf-composition-overlay-toolbar-radius":{"type":"length","state":"selected"},"--sf-composition-overlay-toolbar-gap":{"type":"length","state":"selected"}},"x-summary":"The editor\'s layer over a rendered Composition Document: hover and selection frames, a toolbar of the node\'s actions, insertion places, moves by pointer and keyboard and a structure tree; the canvas is never changed and the host performs every change.","x-source":{"package":"framework","folder":"composition-overlay","manifest":"simai/ui-source@5100227 src/smart/composition-overlay/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/composition-overlay.component.json"},"x-words":["label"],"x-renamed":["events.sf-composition-overlay-action {action_id, node_id} → apply {action, scope: entry, ids}: one entry\'s own action (vocabulary 1.1.5 §5 apply, standard §18.3); sf-composition-overlay-apply, the old name a dated split alias","events.sf-composition-overlay-edit {node_id, value, previous} → change {id, value, previous}, cancelable: a committed value (vocabulary §5.1, as sf-inline-edit-commit and sf-theme-change); sf-composition-overlay-change, the old name a dated split alias sharing the cancel","events select and move keep their DOM names (vocabulary §5 select, move) and add the vocabulary\'s fields (ids, id; ids, id, parent, position) beside node_id, parent_id and index","methods setActions, setMessages, setInsertionTarget: also the settings actions, messages and insertion-target (properties)","lang runtime holds the words of the overlay module (MESSAGES of core/js/composition/overlay.mjs)"],"x-kept":{"security":{"permissions_owner":"host","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"host","effects":"host","forbidden_client_responsibilities":["backend access decisions","host route invention","saving or reordering host data"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile","ltr","rtl","reduced-motion"],"skeleton":{"shape":"none","while_loading":"none"}},"ai_guidance":{"use_when":"Use sf-composition-overlay on an editor page over SF.Composition.render output. Treat every event as intent: the host changes the Document, saves it with an expected revision, validates and re-renders. For a canvas isolated in a same-origin iframe (a mail letter), use attachFrame (or frame=\\"id\\") and setNodes with a flat node list; edits arrive as sf-composition-overlay-edit.","do_not":["Do not copy generated ui-smart code","Do not write editor markup into the canvas HTML","Do not treat setDropFilter as validation; Document validation stays authoritative","Do not put the overlay after the canvas in Tab order","Do not expect the overlay to keep an edited text: it raises the intent, the host updates its model and re-renders the frame","Do not point the framed mode at a cross-origin frame"],"required_reads":["inputs","contracts","methods","events","ownership","provenance"],"minimal_example":"<sf-composition-overlay id=\\"overlay\\" for=\\"canvas\\" accepts=\\"blocks\\"></sf-composition-overlay><div id=\\"canvas\\"></div>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["events (vocabulary 1.1.5): select {ids, id}, apply {action, scope: entry, ids} for the toolbar\'s action, insert (the component\'s own verb: a place chosen or a library item dropped -- a move or a copy, not §5 create), move {ids, id, parent, position} -- one manual move -- and change {id, value, previous}, cancelable, for a plain-string edit (x-native false: sf-composition-overlay-change).","the composition host\'s contract stays (larena composition-editor-next listens to -select, -action, -move and -insert): select, move and insert keep their DOM names and keep node_id, parent_id and index in the detail beside the vocabulary\'s fields; action and edit are followed by sf-composition-overlay-action {action_id, node_id} and -edit {node_id, value, previous} until 2026-12-01 through the overlay\'s aliases.json and the element\'s adapters, the cancel of the edit shared. An overlay defined without its manifest sends both itself. OVERLAY_EVENTS holds the new names, OVERLAY_EVENTS_LEGACY the former.","own-verb-words: insert -- its word is events.insert.label of the language files («Вставить», \\"Insert\\"); action became apply, edit became change.","setter: actions, messages and insertion-target are writable settings, properties written through the same checks as setActions, setMessages and setInsertionTarget, which stay the host\'s port.","the methods attach, attach-frame, set-document, set-nodes, set-drop-filter, set-actions, set-messages, set-insertion-target, select, edit and refresh are the composition host\'s port (simai.composition editor): they keep answering the element, for chaining, not an outcome (x-returns); the port stays as the composition editor uses it.","item-shape: actions name their fields with of ({id, label}, checkOverlayActions); set-nodes takes a list of nodes {id, kind, label, parent, editable, rect | element} (checkOverlayNodes).","element: the overlay stays the plain element the composition module defines; defineCompositionOverlay(registry, {base}) extends the class core/js/composition/manifest-host.mjs makes from this component.json (the settings\' properties, the aliases.json shim, sfWord).","words (§11): the language files hold the overlay module\'s words; the module keeps its copy and reads them through the page\'s language; messages overrides them per instance.","version 1.2.0: events renamed behind dated aliases and detail fields added (§4.10).","examples: examples.json from studio.fixture.json (an overlay for a canvas) plus a framed canvas, a library that drops on the canvas and actions.","css-variables: five public variables of its sheet: the frames\' and insertion points\' colour (read into the overlay\'s own --sf-composition-overlay-color), the layer\'s z-index, the toolbar\'s fill, radius and gap. Not in src/core/contracts/public-variables.v1.json: the parts they colour exist only over a canvas with a selection, which its probe does not draw.","source-drift: the shipped manifest differs from 5100227 in the framed mode (frame, attach-frame, set-nodes, simai/ui-source#22) and the plain-string edit (sf-composition-overlay-edit); they are carried here by hand."]}');

/***/ },

/***/ "339c075524d7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Composition overlay","runtime":{"cancelled":"Move cancelled.","editing":"Editing {label}. Enter saves, Escape cancels.","insert":"Insert","insert-at":"Insert into “{slot}”, position {index}","picked":"Moving {label}. Arrows choose a place, Enter drops, Escape cancels.","position":"{index} of {total}","selected":"Selected: {label}","toolbar":"Actions","tree":"Page structure"},"events":{"insert":{"label":"Insert"}}}');

/***/ },

/***/ "d8e3a01243dc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Слой редактора","runtime":{"cancelled":"Перемещение отменено.","editing":"Редактирование: {label}. Enter — сохранить, Escape — отменить.","insert":"Вставить","insert-at":"Вставить в «{slot}», позиция {index}","picked":"Перемещение: {label}. Стрелки выбирают место, Enter — положить, Escape — отменить.","position":"{index} из {total}","selected":"Выбрано: {label}","toolbar":"Действия","tree":"Структура страницы"},"events":{"insert":{"label":"Вставить"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("cae046a8699f");
/******/
/******/ })()
;