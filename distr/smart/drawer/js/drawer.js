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

/***/ "5f0529568b98"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("695f21e50358");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("78628e837a32");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("0dc7c163a2e8");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d6e446f3d408");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("a3b41385ab12");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("ce0ca620b623");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("fefa0c5c3ed9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);









 // sf-drawer from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8, §19): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json (a product
// adds a language through SF.language.register("sf-drawer", code, words)),
// and the old names -- title and the drawer:* events -- are dated aliases.

const DrawerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
}); // The public variables the manifest declares; the panel drawn at the end of the
// body carries their values from where its host stands (§19.1).

const DRAWER_VARIABLES = Object.keys(_component_json__WEBPACK_IMPORTED_MODULE_6__["css-variables"] || {});
const OLD_EVENT_NAMES = ['drawer:before-open', 'drawer:after-open', 'drawer:before-close', 'drawer:after-close', 'drawer:snap']; // A lifecycle copy (drawer:ready, drawer:update) is still sent until its date;
// a listener that reads it is a use (vocabulary §5.1, §16.13).

function retiredEvent(type, detail) {
  const event = new CustomEvent(type, {
    bubbles: true,
    composed: true,
    detail
  });
  let used = false;
  Object.defineProperty(event, 'detail', {
    configurable: true,

    get() {
      if (!used) {
        used = true;
        (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__.noteDeprecated)({
          component: 'sf-drawer',
          tag: 'sf-drawer',
          kind: 'event',
          from: type,
          to: null,
          since: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.since,
          remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.remove_after
        });
      }

      return detail;
    }

  });
  return event;
}

const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
});


const DRAWER_SELECTOR = 'sf-drawer'; // Only the edge. A foot area was tried and taken out: lit inserts a node that
// appears later beside the markers of its siblings, and those markers move with
// any node the drawer has already projected -- so a bar that appeared when a
// record became editable landed inside the body, above everything. The panel
// scrolls now, so a bar can simply stick to its bottom where it is.

const DRAWER_AREAS = ['edge'];

const asksFor = (node, slot) => node.nodeType === 1 && node.getAttribute('slot') === slot;

const asksForArea = node => DRAWER_AREAS.some(slot => asksFor(node, slot));

const PORTAL_ATTRIBUTE = 'data-sf-drawer-portal'; // A box that holds its own overlays (sf-drawer, sf-modal); the drawer's own
// name came first and is read until the change journal retires it.

const OVERLAY_CONTAINER = '[data-sf-overlay-container], [data-sf-drawer-container]';
const FOCUSABLE_SELECTOR = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'].join(','); // The open drawers, in the order they opened: the panels of the one document
// layer stack (layer-stack.js, standard 1.3.8 §19.1). The drawer kept an array
// of its own, so a modal opened from a drawer did not know it was above it
// (simai/ui-source#36) and a drawer opened from a modal was drawn under it
// (simai/ui-source#37).

const openDrawers = () => (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.openLayers)('panel').filter(owner => owner?.localName === DRAWER_SELECTOR); // Below this width of the dock host (or of the window, when the page names no
// host) docked panels overlay the page instead of narrowing it, unless the
// drawer names its own (dock-breakpoint, or --sf-drawer-dock-breakpoint).


const DOCK_MIN_REM = 48;
const PLACEMENTS = ['left', 'right', 'inline-start', 'inline-end', 'bottom']; // The heights a bottom sheet rests at, smallest first: its content (auto, up
// to the room it has), half the room, and all of it.

const SNAPS = ['auto', 'half', 'full']; // A drag of the sheet farther than this share of its height, or faster than
// this, is a decision: down closes (or steps full down to half), up opens to full.

const SWIPE_SHARE = 0.25;
const SWIPE_SPEED = 0.5;

function joinClasses(...parts) {
  return parts.flat().filter(Boolean).join(' ');
} // A threshold in rem, em or px, in pixels. rem and em both read the root's
// font size: the threshold is the page's, not a box's.


function lengthToPixels(value) {
  const match = /^(\d*\.?\d+)(rem|em|px)$/u.exec(String(value).trim());
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  if (!match) return DOCK_MIN_REM * rem;
  return Number(match[1]) * (match[2] === 'px' ? 1 : rem);
}

function escapeSelector(value) {
  if (globalThis.CSS?.escape) return globalThis.CSS.escape(value);
  return String(value).replace(/["\\]/g, '\\$&');
}

const drawerManager = {
  globalBound: false,
  lockState: null,

  // Opening raises a drawer that is open already: it is the last opened.
  add(drawer) {
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.openLayer)(drawer, {
      kind: 'panel',
      ...this.declares(drawer),
      returnTo: drawer._lastActive ?? null,
      lockPage: () => {
        this.lockPage(drawer.preserveScrollGap);
        return () => this.unlockPage();
      },
      root: () => drawer.getDrawerRoot(),
      focusIn: () => drawer.focusFirst(),
      onEscape: event => drawer.onKeyDown(event),
      onTab: event => drawer.onKeyDown(event),
      place: ({
        index
      }) => drawer.applyStackPosition(index)
    });
    this.syncDock();
    drawer.syncSwitches();
  },

  // What the drawer declares to the stack (§19.1): a modal drawer locks the
  // page -- unless it stands in an overlay container, which it covers instead
  // -- and holds the focus.
  declares(drawer) {
    return {
      locksPage: drawer.modal && !drawer.closest(OVERLAY_CONTAINER),
      trapsFocus: drawer.modal
    };
  },

  // Answers whether the drawer was the top layer.
  remove(drawer) {
    const wasTop = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.closeLayer)(drawer, {
      restoreFocus: false
    });
    drawer.applyStackPosition(-1);
    this.sync();
    drawer.syncSwitches();
    return wasTop;
  },

  bringToFront(drawer) {
    if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerIndex)(drawer) < 0) return;
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.raiseLayer)(drawer);
    this.sync();
  },

  isTop(drawer) {
    return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.isTopLayer)(drawer);
  },

  sync() {
    for (const drawer of openDrawers()) drawer.applyStackPosition((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerIndex)(drawer));

    this.syncDock();
  },

  // Docked drawers reserve page space: the summed widths of open docked panels
  // per logical side are published as CSS custom properties on the root; any
  // element with data-sf-drawer-dock-host pads itself by them.
  // A docked drawer that has the room is a column of the page and says so on
  // its root (data-sf-drawer-column="true"): it takes the page's surface, not
  // the overlay's (simai/ui-source#26). Without the room it floats over the
  // page, and is drawn as a floating panel.
  syncDock() {
    const root = document.documentElement;
    if (!root) return;
    this.bindDockMedia();
    const sides = {
      start: 0,
      end: 0
    };

    for (const drawer of openDrawers()) {
      if (!drawer.openState || !drawer.docked) continue;
      const column = this.reservesDock(drawer);
      drawer.setDockColumn(column);
      if (!column) continue;
      const panel = drawer.getDrawerRoot()?.querySelector('[data-sf-drawer-panel]');
      const width = panel ? Math.round(panel.getBoundingClientRect().width) : 0;
      sides[drawer.dockSide] += width;
    }

    for (const side of ['start', 'end']) {
      const name = `--sf-drawer-dock-inline-${side}`;
      if (sides[side] > 0) root.style.setProperty(name, `${sides[side]}px`);else root.style.removeProperty(name);
    }
  },

  // The window's answer for a threshold, as a media query: a length in rem
  // reads the initial font size there, as every media query does.
  dockMedia(threshold) {
    if (typeof globalThis.matchMedia !== 'function') return null;
    this.dockMediaLists ??= new Map();
    let list = this.dockMediaLists.get(threshold);

    if (!list) {
      list = globalThis.matchMedia(`(min-width: ${threshold})`);
      list.addEventListener?.('change', () => this.syncDock());
      this.dockMediaLists.set(threshold, list);
    }

    return list;
  },

  // Redraws only when some open docked drawer's answer changed: syncDock pads
  // the host, and the padding must not wake the host's observer into a loop.
  syncDockIfChanged() {
    if (openDrawers().some(drawer => drawer.openState && drawer.docked && this.reservesDock(drawer) !== drawer.dockColumn)) {
      this.syncDock();
    }
  },

  bindDockMedia() {
    // The host's own width decides, when the page names a host: a docked
    // drawer inside an editor pane or a documentation example docks by the
    // room that box has, not by the window's (DEV, 2026-10-18).
    const host = document.querySelector('[data-sf-drawer-dock-host]');

    if (host !== this.dockHost) {
      this.dockHostObserver?.disconnect();
      this.dockHost = host;
      this.dockHostObserver = host && typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.syncDockIfChanged()) : null;
      this.dockHostObserver?.observe(host, {
        box: 'border-box'
      });
    }
  },

  // Whether a docked drawer takes room from the page: the dock host is at
  // least as wide as the drawer's threshold (48rem), or -- with no host on the
  // page -- the window is.
  reservesDock(drawer) {
    if (this.dockHost === undefined) this.bindDockMedia();
    const host = this.dockHost;
    const threshold = drawer.dockBreakpoint;

    if (host?.isConnected) {
      return host.getBoundingClientRect().width >= lengthToPixels(threshold);
    }

    const media = this.dockMedia(threshold);
    return media ? media.matches : true;
  },

  // The page lock is the layer stack's one lease, taken while any layer that
  // locks the page is open, a modal's too; a drawer whose `modal` or `docked`
  // changed while open says so again.
  syncPageLock() {
    for (const drawer of openDrawers()) (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.updateLayer)(drawer, this.declares(drawer));
  },

  lockPage(preserveScrollGap) {
    const htmlElement = document.documentElement;
    const body = document.body;
    if (!htmlElement || !body || this.lockState) return;
    const gap = Math.max(0, window.innerWidth - htmlElement.clientWidth);
    this.lockState = {
      htmlOverflow: htmlElement.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingInlineEnd: body.style.paddingInlineEnd
    };
    htmlElement.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (preserveScrollGap && gap > 0) body.style.paddingInlineEnd = `${gap}px`;
  },

  unlockPage() {
    if (!this.lockState) return;
    const htmlElement = document.documentElement;
    const body = document.body;
    htmlElement.style.overflow = this.lockState.htmlOverflow;
    body.style.overflow = this.lockState.bodyOverflow;
    body.style.paddingInlineEnd = this.lockState.bodyPaddingInlineEnd;
    this.lockState = null;
  },

  bindGlobalEvents() {
    if (this.globalBound || typeof document === 'undefined') return;
    document.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;
      const conciseTrigger = event.target.closest('[data-drawer]');
      const openTrigger = event.target.closest('[data-sf-drawer-open]');
      const toggleTrigger = event.target.closest('[data-sf-drawer-toggle]');
      const closeTrigger = event.target.closest('[data-sf-drawer-close]');
      const conciseOperation = conciseTrigger?.getAttribute('data-drawer') || '';
      const operation = ['open', 'toggle', 'close'].includes(conciseOperation) ? conciseOperation : openTrigger ? 'open' : toggleTrigger ? 'toggle' : closeTrigger ? 'close' : '';
      const trigger = conciseTrigger || openTrigger || toggleTrigger || closeTrigger;
      if (!operation || !trigger) return;
      const id = trigger.getAttribute('aria-controls') || trigger.getAttribute(`data-sf-drawer-${operation}`) || trigger.closest('[data-sf-drawer-id]')?.getAttribute('data-sf-drawer-id');
      if (!id) return;
      customElements.whenDefined(DRAWER_SELECTOR).then(() => {
        document.getElementById(id)?.[operation]?.();
      });
    });
    this.globalBound = true;
  }

};

class SfDrawer extends DrawerElement {
  // The manifest's settings, and what the drawer reads more closely: the size
  // ladder's legacy words, the base's template name.
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      placement: {
        default: 'right',
        values: PLACEMENTS
      },
      // A bottom sheet's resting height (placement="bottom").
      snap: {
        default: 'auto',
        values: SNAPS
      },
      // An outside switch opens and closes the panel: the close button stands
      // down while that switch is on screen (simai/ui-source#29).
      controlled: {
        type: Boolean,
        default: false
      },
      // Where the panels start from the top: the height of an app bar they
      // must not cover (simai/ui-source#29). A length; empty for the
      // --sf-drawer-block-start variable, else 0.
      blockStart: {
        attribute: 'block-start',
        default: ''
      },
      overlay: {
        type: Boolean,
        default: true
      },
      modal: {
        type: Boolean,
        default: true
      },
      docked: {
        type: Boolean,
        default: false
      },
      // From what width of the dock host (or the window) a docked drawer is a
      // column of the page: a length in rem, em or px; empty for the
      // --sf-drawer-dock-breakpoint variable, else 48rem.
      dockBreakpoint: {
        attribute: 'dock-breakpoint',
        default: ''
      },
      // The shared size ladder. The words are legacy values, still accepted:
      // see contracts/public-api-axes.json. `full` is not a step of the ladder —
      // it means as wide as the viewport, and drops the radius with it.
      size: {
        default: '1',
        values: ['1/2', '1', '2', 'full'],
        valueAliases: {
          '1/2': ['small'],
          1: ['medium'],
          2: ['large']
        }
      },
      closeOnEsc: {
        attribute: 'close-on-esc',
        type: Boolean,
        default: true
      },
      closeOnOverlay: {
        attribute: 'close-on-overlay',
        type: Boolean,
        default: true
      },
      preserveScrollGap: {
        attribute: 'preserve-scroll-gap',
        type: Boolean,
        default: true
      },
      showClose: {
        attribute: 'show-close',
        type: Boolean,
        default: true
      },
      closePlacement: {
        attribute: 'close-placement',
        default: 'inside',
        values: ['inside', 'outside']
      },
      label: {
        default: ''
      },
      closeLabel: {
        attribute: 'close-label',
        default: ''
      },
      width: {
        default: ''
      },
      stackOffset: {
        attribute: 'stack-offset',
        default: ''
      },
      gutter: {
        default: ''
      },
      zIndex: {
        attribute: 'z-index',
        default: ''
      },
      overlayClass: {
        attribute: 'overlay-class',
        default: ''
      },
      panelClass: {
        attribute: 'panel-class',
        default: ''
      },
      // The panel is the drawer's own surface, and what colour it is belongs to
      // whoever opened it: a consumer painting its content a different colour
      // than the panel leaves the head and the gutters in the other one.
      panelStyle: {
        attribute: 'panel-style',
        default: ''
      },
      headerClass: {
        attribute: 'header-class',
        default: ''
      },
      bodyClass: {
        attribute: 'body-class',
        default: ''
      },
      closeClass: {
        attribute: 'close-class',
        default: ''
      }
    };
  }

  static get defaultTrueAttributes() {
    return new Set(['overlay', 'modal', 'close-on-esc', 'close-on-overlay', 'preserve-scroll-gap', 'show-close', 'dismissible']);
  }

  constructor() {
    super();
    this.drawerId = '';
    this._portalRoot = null;
    this._contentNodes = null;
    this._lastActive = null;
    this._syncingOpenAttribute = false;
    this._hasEmittedReady = false;
    this._stackIndex = -1;
    this._focusAfterRender = false;
    this._emitAfterOpen = false;
    this._dockObserver = null;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleRootClick = this.handleRootClick.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onSheetPointerDown = this.onSheetPointerDown.bind(this);
    this.onHandleKeyDown = this.onHandleKeyDown.bind(this);
    this._switchVisible = false;
    this._dockColumn = true;
  }

  connectedCallback() {
    // Static markup is a picture of the drawer, not its content (§5.4).
    if (!this._contentNodes) this._contentNodes = Array.from(this.childNodes).filter(node => !node.hasAttribute?.('data-sf-static'));
    this.drawerId = this.resolveDrawerId();
    super.connectedCallback();
    drawerManager.bindGlobalEvents();
    globalThis.addEventListener?.('resize', this.onWindowResize, {
      passive: true
    });

    if (this.openState) {
      this._focusAfterRender = this.modal;
      drawerManager.add(this);
    } // Switches written after the drawer in the page are there a frame later.


    globalThis.requestAnimationFrame?.(() => this.syncSwitches());
  }

  disconnectedCallback() {
    this._areaObserver?.disconnect();
    this._areaObserver = null;
    globalThis.removeEventListener?.('resize', this.onWindowResize);
    this._dockObserver?.disconnect();
    this._dockObserver = null;
    drawerManager.remove(this);
    this.clearPortal();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'open' && !this._syncingOpenAttribute && this._isMounted) {
      this.syncExternalOpenState(newValue !== null);
      return;
    }

    if ((name === 'modal' || name === 'docked') && this.openState) drawerManager.syncPageLock();

    if ((name === 'docked' || name === 'dock-breakpoint' || name === 'placement' || name === 'size' || name === 'width') && this.openState) {
      requestAnimationFrame(() => {
        drawerManager.syncDock();
        drawerManager.sync();
      });
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get openState() {
    return this.hasAttribute('open');
  }

  get sheet() {
    return this.placement === 'bottom';
  } // The switch outside the panel that names it in aria-controls, on screen:
  // while it is, it is the way to close the panel and the panel draws no
  // second one.


  hasVisibleSwitch() {
    const id = this.drawerId || this.id;
    if (!id || typeof document === 'undefined') return false;
    const root = this.getDrawerRoot();
    return [...document.querySelectorAll('[aria-controls]')].some(element => {
      if (!element.getAttribute('aria-controls').split(/\s+/u).includes(id)) return false;
      if (root?.contains(element) || this.contains(element)) return false;
      if (element.getClientRects().length === 0) return false;
      return getComputedStyle(element).visibility !== 'hidden';
    });
  }

  onWindowResize() {
    if (!this.controlled || !this._isMounted) return;
    const visible = this.hasVisibleSwitch();
    if (visible !== this._switchVisible) this.requestComponentUpdate('controlled');
  }

  get modal() {
    // A docked drawer is part of the page layout and is always modeless.
    return !this.docked && this.getBooleanAttr('modal', true);
  } // A bottom sheet floats over the page; it is never a column of it.


  get docked() {
    return this.getBooleanAttr('docked', false) && !this.sheet;
  } // The physical edge the panel opens from, so left and inline-start count as
  // one edge in a left-to-right page and as two in a right-to-left one.


  get stackEdge() {
    const placement = this.placement;
    if (!placement.startsWith('inline')) return placement;
    const rtl = (this.closest('[dir]')?.getAttribute('dir') || document.documentElement.dir) === 'rtl';
    return placement === 'inline-start' !== rtl ? 'left' : 'right';
  } // The width of the dock host (or of the window) from which this docked
  // drawer is a column of the page; narrower, it floats over the page. The
  // drawer's dock-breakpoint, else --sf-drawer-dock-breakpoint where it
  // stands, else 48rem (simai/ui-source#25: a chat's panel needs 64rem).


  get dockBreakpoint() {
    const own = (this.getAttribute('dock-breakpoint') || '').trim();
    if (own) return own;
    const themed = typeof getComputedStyle === 'function' && this.isConnected ? getComputedStyle(this).getPropertyValue('--sf-drawer-dock-breakpoint').trim() : '';
    return themed || `${DOCK_MIN_REM}rem`;
  } // A switch outside the panel that shows and hides it (data-drawer="toggle"
  // naming it in aria-controls, or data-sf-drawer-toggle) says whether the
  // panel is shown: aria-expanded follows the panel, so a button that hides a
  // docked column reads as pressed while the column is there
  // (simai/ui-source#25).


  syncSwitches() {
    const id = this.drawerId || this.id;
    if (!id || typeof document === 'undefined') return;
    const expanded = this.openState ? 'true' : 'false';

    for (const element of document.querySelectorAll('[data-drawer="toggle"][aria-controls], [data-sf-drawer-toggle]')) {
      const named = (element.getAttribute('aria-controls') || element.getAttribute('data-sf-drawer-toggle') || '').split(/\s+/u);
      if (named.includes(id)) element.setAttribute('aria-expanded', expanded);
    }
  } // Whether this docked drawer is, at the moment, a column of the page.


  get dockColumn() {
    return this._dockColumn;
  }

  setDockColumn(column) {
    this._dockColumn = column;
    this.getDrawerRoot()?.setAttribute('data-sf-drawer-column', column ? 'true' : 'false');
  }

  get dockSide() {
    const placement = this.placement;
    if (placement === 'inline-start') return 'start';
    if (placement === 'inline-end') return 'end';
    const rtl = globalThis.getComputedStyle?.(document.documentElement).direction === 'rtl';
    if (placement === 'left') return rtl ? 'end' : 'start';
    return rtl ? 'start' : 'end';
  }

  get size() {
    return this.getProp('size');
  }

  resolveDrawerId() {
    const existing = this.id || this.getAttribute('drawer-id');

    if (existing) {
      // A drawer-id the page wrote is also the element's id, as it was; the
      // path id the drawer made for itself is not.
      if (!this.id && existing !== this._generatedDrawerId) this.id = existing;
      return existing;
    } // Its path id (§7.1.1): sf-drawer-<n> in document order, not a random one
    // (simai/ui-source#41). It names the portal and the title, not the element:
    // an id written on the element would change the order the next drawer
    // without one counts in, and two drawers would share a path.


    const generated = (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.instancePath)(this));
    this._generatedDrawerId = generated;
    this.setAttribute('drawer-id', generated);
    return generated;
  }

  templateContext() {
    this._switchVisible = this.controlled && this.hasVisibleSwitch();
    if (this.docked && typeof document !== 'undefined') this._dockColumn = drawerManager.reservesDock(this);
    return this.createTemplateContext({
      drawerId: this.drawerId || this.resolveDrawerId(),
      // A path id (§7.1.1): <path>--title.
      titleId: (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.instancePath)(this), 'title'),
      open: this.openState,
      placement: this.placement,
      overlay: this.overlay,
      modal: this.modal,
      docked: this.docked,
      column: this.docked && this._dockColumn,
      size: this.size,
      showClose: this.showClose && !this._switchVisible,
      controlled: this.controlled,
      sheet: this.sheet,
      snap: this.snap,
      handleLabel: this.sfWord('handle-label'),
      blockStart: this.getAttribute('block-start') || '',
      closePlacement: this.closePlacement,
      title: this.getAttribute('heading') || '',
      // The name: label, else the heading the panel is labelled by (§4.8).
      label: this.getAttribute('label') || '',
      closeLabel: this.getAttribute('close-label') || this.defaultCloseLabel,
      width: this.getAttribute('width') || '',
      stackOffset: this.stackOffset,
      gutter: this.gutter,
      zIndex: this.drawerZIndex,
      overlayClass: this.getAttribute('overlay-class') || '',
      panelClass: this.getAttribute('panel-class') || '',
      panelStyle: this.getAttribute('panel-style') || '',
      headerClass: this.getAttribute('header-class') || '',
      bodyClass: this.getAttribute('body-class') || '',
      closeClass: this.getAttribute('close-class') || ''
    });
  } // The resolved z-index the panel is drawn at; the attribute replaces it.


  get zIndex() {
    return this.drawerZIndex;
  }

  set zIndex(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('z-index');else this.setAttribute('z-index', String(value));
  } // Its place in the one layer scale (--sf-z-index-layer, in opening order
  // with every other layer); a page's --sf-drawer-z-index moves the base, the
  // z-index attribute replaces it.


  get drawerZIndex() {
    const base = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerZIndexAt)(0);
    const rise = this._stackIndex > 0 ? (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerZIndexAt)(this._stackIndex) - base : 0;
    return this.getAttribute('z-index') || `calc(var(--sf-drawer-z-index, ${base}) + ${rise})`;
  } // The shared rule, not a second reading of it. This asked the document
  // directly, which misses a region that names its own language and leaves a
  // product unable to register a third -- the same two faults admin-menu had.


  get defaultCloseLabel() {
    return this.sfWord('close-label');
  }

  async renderComponent(changedAttributes = []) {
    const token = ++this._renderToken;
    const result = await this.resolveTemplateResult(changedAttributes);
    if (!this._isMounted || token !== this._renderToken) return;
    const portal = this.resolvePortalRoot(); // The portal stands at the end of the body; it speaks and looks as the
    // drawer does where it stands (standard 1.3.8 §19.1).

    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.carryLayerOrigin)(portal, this, {
      variables: DRAWER_VARIABLES
    }); // Static markup printed for the first paint goes as the drawer draws
    // (standard 1.3.8 §5.4); the panel itself is rendered in the portal.

    if (!this.__sfFirstPaintEnded) {
      this.__sfFirstPaintEnded = true;
      this.prepareRenderContainer();
    }

    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(result, portal);
    this.afterRender();
  } // The panel is rendered at the end of the body, above the page -- or, when the
  // drawer stands inside a [data-sf-overlay-container] (or the older
  // [data-sf-drawer-container]), at the end of that box,
  // which then frames it (contain: layout makes it the panel's containing
  // block): an editor pane or a documentation example holds its own drawer
  // without a stage of its own (DEV, 2026-10-18).


  resolvePortalRoot() {
    if (this._portalRoot?.isConnected) return this._portalRoot;
    const home = this.closest(OVERLAY_CONTAINER) || document.body;
    const selector = `[${PORTAL_ATTRIBUTE}="${escapeSelector(this.drawerId)}"]`;
    this._portalRoot = home.querySelector(selector) || document.createElement('div');

    this._portalRoot.setAttribute(PORTAL_ATTRIBUTE, this.drawerId);

    if (!this._portalRoot.isConnected) home.append(this._portalRoot);
    return this._portalRoot;
  } // A consumer's bar or edge control may appear long after the drawer connected
  // -- when a record becomes editable, say. The content is captured once, and
  // the drawer renders on its own schedule, so without watching for new children
  // such a node stands where the drawer's own children render: above everything.


  watchForAreaChildren() {
    if (this._areaObserver) return;
    this._areaObserver = new MutationObserver(() => {
      const root = this.getDrawerRoot();
      if (root) this.projectAreas(root);
    });

    this._areaObserver.observe(this, {
      childList: true
    });
  }

  projectAreas(root) {
    for (const [slot, selector] of [['edge', '[data-sf-drawer-edge]']]) {
      const area = root.querySelector(selector);
      if (!area) continue;
      const waiting = [...this._contentNodes.filter(node => asksFor(node, slot) && node.parentElement !== area), ...[...this.children].filter(node => asksFor(node, slot))];
      if (waiting.length) area.append(...new Set(waiting));
    }
  }

  afterRender() {
    const root = this.getDrawerRoot();
    if (!root) return; // A child may ask for the edge, which stands beside the panel, or for the
    // foot, which holds the bottom of it and does not scroll with the body.
    // Everything else is the drawer's content, as before.
    //
    // This runs on every render, not only on the first: the content is captured
    // once, when the element connects, and a consumer whose bar appears later --
    // when a record becomes editable, say -- would otherwise leave it standing
    // where the drawer's own children render, above everything.

    this.projectAreas(root);
    this.watchForAreaChildren();
    const body = root.querySelector('[data-sf-drawer-body]');

    if (body && body.dataset.sfDrawerContentReady !== '1') {
      // A child asking for the edge goes beside the panel, not into it. Every
      // other child is the drawer's content, as before.
      body.replaceChildren(...this._contentNodes.filter(node => !asksForArea(node)));
      body.dataset.sfDrawerContentReady = '1';
    }

    root.removeEventListener('click', this.handleRootClick);
    root.addEventListener('click', this.handleRootClick);
    const handle = root.querySelector('[data-sf-drawer-handle]');
    const head = root.querySelector('.sf-drawer-head');

    for (const grip of [handle, head]) {
      grip?.removeEventListener('pointerdown', this.onSheetPointerDown);
      grip?.addEventListener('pointerdown', this.onSheetPointerDown);
    }

    handle?.removeEventListener('keydown', this.onHandleKeyDown);
    handle?.addEventListener('keydown', this.onHandleKeyDown);
    this.applyStackPosition();
    this.observeDock(root); // Lifecycle copies retire (vocabulary §5.1, §16.13): still sent until their
    // date, and a listener that reads one is noted.

    const eventName = this._hasEmittedReady ? 'drawer:update' : 'drawer:ready';
    this.dispatchEvent(retiredEvent(eventName, {
      component: this,
      drawer: this,
      drawerId: this.drawerId,
      root
    }));
    this._hasEmittedReady = true;

    if (this._focusAfterRender || this._emitAfterOpen) {
      this._focusAfterRender = false;
      requestAnimationFrame(() => {
        if (this.openState && this.modal) this.focusFirst();
        if (this._emitAfterOpen) this.emitDrawerEvent('opened');
        this._emitAfterOpen = false;
      });
    }
  }

  template() {
    const context = this.templateContext();
    const closeButton = context.showClose ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
          type="button"
          class=${joinClasses('sf-icon-button sf-drawer-close sf-icon-button--close sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', context.closePlacement === 'outside' && 'sf-drawer-close--outside', context.closeClass)}
          aria-label=${context.closeLabel}
          data-drawer="close"
          data-sf-drawer-close=${context.drawerId}
        >
          <span class="sf-close sf-close--size-1/3 flex justify-center items-center" aria-hidden="true">
            <span class="sf-close-icon"></span>
          </span>
        </button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${joinClasses('sf-drawer', context.open && 'is-open', context.rootClass)}
      style=${`z-index:${context.zIndex};${context.width ? `--sf-drawer-width:${context.width};` : ''}${context.stackOffset ? `--sf-drawer-stack-offset:${context.stackOffset};` : ''}${context.blockStart ? `--sf-drawer-block-start:${context.blockStart};` : ''}${context.rootStyle || ''}`}
      data-sf-drawer-root
      data-sf-drawer-id=${context.drawerId}
      data-sf-drawer-placement=${context.placement}
      data-sf-drawer-size=${context.size}
      data-sf-drawer-modal=${context.modal ? 'true' : 'false'}
      data-sf-drawer-docked=${context.docked ? 'true' : 'false'}
      data-sf-drawer-column=${context.column ? 'true' : 'false'}
      data-sf-drawer-snap=${context.sheet ? context.snap : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-hidden=${context.open ? 'false' : 'true'}
    >
      <div class=${joinClasses('sf-drawer-overlay', context.overlayClass)} data-sf-drawer-overlay ?hidden=${!context.modal || !context.overlay}></div>
      <section
        class=${joinClasses('sf-drawer-panel', context.panelClass)}
        style=${`${context.width ? `--sf-drawer-width:${context.width};` : ''}${context.stackOffset ? `--sf-drawer-stack-offset:${context.stackOffset};` : ''}${context.gutter ? `--sf-drawer-gutter:${context.gutter};` : ''}${context.panelStyle || ''}`}
        role=${context.docked ? 'region' : 'dialog'}
        aria-modal=${context.modal ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-labelledby=${context.title ? context.titleId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        tabindex="-1"
        ?inert=${!context.open}
        data-sf-drawer-panel
      >
        ${context.sheet ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-drawer-handle" aria-label=${context.handleLabel}
            data-sf-drawer-handle><span class="sf-drawer-handle-bar" aria-hidden="true"></span></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.title || context.showClose && context.closePlacement === 'inside' || context.headerClass ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                  <header class=${joinClasses('sf-drawer-head', context.headerClass)}>
                    ${context.title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-drawer-title" id=${context.titleId}>${context.title}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${context.closePlacement === 'inside' ? closeButton : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  </header>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class=${joinClasses('sf-drawer-body', context.bodyClass)} data-sf-drawer-body></div>
      </section>
      <div class="sf-drawer-edge" data-sf-drawer-edge>
        ${context.closePlacement === 'outside' ? closeButton : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>`;
  } // Opens the panel, or raises an open one. Answers an outcome (§4.4):
  // refused when a listener prevents sf-drawer-open.


  open(options = {}) {
    options = options || {};

    if (this.openState) {
      drawerManager.bringToFront(this);
      return applied();
    }

    if (options.emit !== false && !this.emitDrawerEvent('open', true)) return refused('prevented');
    this._lastActive = document.activeElement;
    this._focusReturnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.landmarksAround)(this._lastActive);
    this.syncOpenAttribute(true);
    drawerManager.add(this);
    this._focusAfterRender = this.modal;
    this._emitAfterOpen = options.emit !== false;
    this.requestComponentUpdate('open');
    return applied();
  } // options.reason says why (standard 1.3.8 §19.3): close, escape, outside,
  // cancelled or api, the default.
  // A listener that prevents sf-drawer-close keeps it open, and the action
  // answers refused (§8); `unsaved` is the setting (§19.3).


  close(options = {}) {
    options = options || {};
    if (!this.openState) return refused('closed');
    const reason = typeof options.reason === 'string' ? options.reason : 'api';
    if (options.emit !== false && !this.emitDrawerEvent('close', true, {
      reason,
      unsaved: Boolean(this.unsaved)
    })) return refused('prevented');
    this.syncOpenAttribute(false);
    const wasTop = drawerManager.remove(this);
    this.requestComponentUpdate('close');
    this.returnFocus(wasTop);
    if (options.emit !== false) this.emitDrawerEvent('closed', false, {
      reason
    });
    return applied();
  } // A drawer that closes under another layer moves no focus (§19.2). A modal
  // drawer on top gives it back by the stack's rule; a modeless one to what
  // was active when it opened, as before.


  returnFocus(wasTop) {
    if (!wasTop) return;
    if (this.modal) (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.returnLayerFocus)(true, this._lastActive, this._focusReturnAncestors);else this.restoreFocus();
  }

  toggle() {
    return this.openState ? this.close() : this.open();
  }

  setState(state = {}) {
    if (state && typeof state === 'object' && Object.prototype.hasOwnProperty.call(state, 'open')) {
      const {
        open: requestedOpen,
        ...rest
      } = state;
      requestedOpen ? this.open() : this.close();
      return super.setState(rest);
    }

    return super.setState(state);
  }

  getState() {
    return { ...this.templateContext(),
      open: this.openState
    };
  }

  syncExternalOpenState(open) {
    if (open) {
      this._lastActive = document.activeElement;
      this._focusReturnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.landmarksAround)(this._lastActive);
      this._focusAfterRender = this.modal;
      drawerManager.add(this);
    } else {
      this.returnFocus(drawerManager.remove(this));
    }

    this.requestComponentUpdate(open ? 'open' : 'close');
  }

  syncOpenAttribute(open) {
    this._syncingOpenAttribute = true;
    this.toggleAttribute('open', open);
    this._syncingOpenAttribute = false;
  }

  getDrawerRoot() {
    return this._portalRoot?.querySelector('[data-sf-drawer-root]') || null;
  }

  observeDock(root) {
    const panel = root.querySelector('[data-sf-drawer-panel]');

    if (!this.docked || !panel || typeof ResizeObserver !== 'function') {
      this._dockObserver?.disconnect();
      this._dockObserver = null;
      if (this.docked) drawerManager.syncDock();
      return;
    }

    if (!this._dockObserver) this._dockObserver = new ResizeObserver(() => drawerManager.syncDock());

    this._dockObserver.disconnect();

    this._dockObserver.observe(panel);

    drawerManager.syncDock();
  }

  applyStackPosition(index = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerIndex)(this)) {
    this._stackIndex = index;
    const root = this.getDrawerRoot();

    if (root) {
      root.style.zIndex = this.drawerZIndex; // Depth is the number of open, undocked drawers below this one at the
      // same edge; the panel stands that many stack offsets in from the edge.

      const edge = this.stackEdge;
      const drawers = openDrawers();
      const depth = this.docked || index < 0 ? 0 : drawers.slice(0, Math.max(0, drawers.indexOf(this))).filter(drawer => drawer.openState && !drawer.docked && drawer.stackEdge === edge).length;
      root.style.setProperty('--sf-drawer-stack-depth', String(depth));
    }

    return this;
  } // The panel takes the focus, not the first control inside it. A modal has to
  // hold the focus, which is why this exists -- but handing it to whatever
  // control happens to be first put a focus ring on a star nobody had pressed,
  // and a person reading the panel saw a control announced instead of the panel.
  // A consumer that wants a field focused says so with `autofocus`.


  focusFirst() {
    const panel = this.getDrawerRoot()?.querySelector('[data-sf-drawer-panel]');
    const wanted = panel?.querySelector('[autofocus]');
    (wanted || panel)?.focus?.();
  }

  restoreFocus() {
    const target = this._lastActive;
    if (!(target instanceof HTMLElement) || !target.isConnected || target.matches(':disabled,[hidden],[inert]')) return;
    target.focus();
  } // The sheet's resting height. Set by the handle, a swipe or the attribute;
  // drawer:snap says where it came to rest.


  setSnap(snap) {
    if (!SNAPS.includes(snap) || snap === this.snap) return this;
    this.setAttribute('snap', snap);
    this.emitDrawerEvent('snapped', false, {
      snap
    });
    return this;
  } // The handle is a button: a press or Enter toggles half and full, the arrows
  // step up and down through the resting heights. Escape still closes.


  onHandleKeyDown(event) {
    const at = SNAPS.indexOf(this.snap);
    const step = {
      ArrowUp: 1,
      ArrowDown: -1
    }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    this.setSnap(SNAPS[Math.min(SNAPS.length - 1, Math.max(0, at + step))]);
  } // A swipe on the handle or the head: the sheet follows the finger down, and
  // on release either closes (or steps down from full), opens to full when
  // pushed up, or settles back. Controls inside the head keep their presses.


  onSheetPointerDown(event) {
    if (!this.sheet || !this.openState || event.button !== 0) return;
    const grip = event.currentTarget;
    if (grip.classList.contains('sf-drawer-head') && event.target.closest('button, a[href], input, select, textarea, [tabindex]')) return;
    const panel = this.getDrawerRoot()?.querySelector('[data-sf-drawer-panel]');
    if (!panel) return;
    const startY = event.clientY;
    const startTime = event.timeStamp;
    const height = panel.getBoundingClientRect().height || 1;
    let moved = false;
    let delta = 0;
    grip.setPointerCapture?.(event.pointerId);

    const move = moveEvent => {
      delta = moveEvent.clientY - startY;
      if (!moved && Math.abs(delta) < 4) return;
      moved = true;
      panel.classList.add('is-dragging');
      panel.style.setProperty('--sf-drawer-sheet-drag', `${Math.max(0, delta)}px`);
    };

    const end = endEvent => {
      grip.removeEventListener('pointermove', move);
      grip.removeEventListener('pointerup', end);
      grip.removeEventListener('pointercancel', end);
      panel.classList.remove('is-dragging');
      panel.style.removeProperty('--sf-drawer-sheet-drag');
      if (!moved || endEvent.type === 'pointercancel') return; // A drag that ends on the handle is not also a press of it.

      grip.addEventListener('click', clickEvent => clickEvent.stopImmediatePropagation(), {
        capture: true,
        once: true
      });
      const speed = delta / Math.max(1, endEvent.timeStamp - startTime);

      if (delta > height * SWIPE_SHARE || speed > SWIPE_SPEED) {
        if (this.snap === 'full') this.setSnap('half');else this.close();
      } else if (-delta > height * SWIPE_SHARE || speed < -SWIPE_SPEED) {
        this.setSnap('full');
      }
    };

    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
  }

  handleRootClick(event) {
    const root = this.getDrawerRoot();

    if (event.target instanceof Element && event.target.closest('[data-sf-drawer-handle]')) {
      this.setSnap(this.snap === 'full' ? 'half' : 'full');
      return;
    } // A press outside is the top layer's only.


    if (event.target === root?.querySelector('[data-sf-drawer-overlay]') && this.closeOnOverlay && this.dismissible && drawerManager.isTop(this)) {
      this.close({
        reason: 'outside'
      });
      return;
    }

    if (event.target instanceof Element && event.target.closest('[data-sf-drawer-close]')) {
      event.preventDefault();
      this.close({
        reason: 'close'
      });
    }
  } // The layer stack hands the drawer Escape and Tab while it is the top layer:
  // a modal, a list or a drawer opened from it takes them instead. Answers
  // true when it took Escape; the stack then stops the press.


  onKeyDown(event) {
    // An editor or drag operation that handled Escape keeps it.
    if (event.defaultPrevented || !this.openState || !drawerManager.isTop(this)) return false;

    if (event.key === 'Escape' && this.closeOnEsc && this.dismissible) {
      this.close({
        reason: 'escape'
      });
      return true;
    }

    if (!this.modal) return false;
    if (event.key !== 'Tab') return false;
    const panel = this.getDrawerRoot()?.querySelector('[data-sf-drawer-panel]');
    const focusable = Array.from(panel?.querySelectorAll(FOCUSABLE_SELECTOR) || []).filter(element => element.getClientRects().length > 0);

    if (focusable.length === 0) {
      event.preventDefault();
      panel?.focus();
      return false;
    }

    const first = focusable[0];
    const last = focusable.at(-1);

    if (!panel?.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }

    return false;
  } // Sends one of the drawer's events by its verb (§8): sf-drawer-<verb> first,
  // then its old drawer:* name with the old detail through the alias table.
  // Data only in detail; answers false when a listener refused it.


  emitDrawerEvent(verb, cancelable = false, extra = {}) {
    return this.sfEmit(verb, {
      drawerId: this.drawerId,
      ...extra
    }, {
      cancelable
    });
  } // The old drawer:* names keep their old detail (§16.20 split rows): the new
  // names carry data only (§8), the old ones also the element and its panel.


  sfAliasAdapters() {
    const add = detail => ({ ...detail,
      component: this,
      drawer: this,
      root: this.getDrawerRoot()
    });

    return Object.fromEntries(OLD_EVENT_NAMES.map(name => [name, add]));
  } // The on* helpers keep their original meaning: only this drawer's events,
  // not those bubbling up from a nested drawer; by their new names (§8).


  ownDrawerHandler(handler) {
    return event => {
      if (event.target === this) handler.call(this, event);
    };
  }

  onDrawerEvent(verb, handler, options) {
    if (typeof handler === 'function') this.addEventListener(this.sfEventName(verb), this.ownDrawerHandler(handler), options);
    return this;
  }

  onBeforeOpen(handler, options) {
    return this.onDrawerEvent('open', handler, options);
  }

  onAfterOpen(handler, options) {
    return this.onDrawerEvent('opened', handler, options);
  }

  onBeforeClose(handler, options) {
    return this.onDrawerEvent('close', handler, options);
  }

  onAfterClose(handler, options) {
    return this.onDrawerEvent('closed', handler, options);
  }

  clearPortal() {
    if (!this._portalRoot) return;
    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, this._portalRoot);

    this._portalRoot.remove();

    this._portalRoot = null;
  }

}

SfDrawer.define(DRAWER_SELECTOR);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "fefa0c5c3ed9"
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

/***/ "d6e446f3d408"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-drawer for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail, split (the old detail from the element\'s adapter), page-trigger (a page attribute the drawer reads, no shim), retired (no new name; kept and noted by the component until the date).","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26"},{"from":"drawer:before-open","to":"sf-drawer-open","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:after-open","to":"sf-drawer-opened","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:before-close","to":"sf-drawer-close","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:after-close","to":"sf-drawer-closed","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:snap","to":"sf-drawer-snapped","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:ready","to":null,"kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"vocabulary §5.1, §16.13","note":"a lifecycle copy; sf-after-render is the base\'s; still sent until the date, noted when a listener reads it"},{"from":"drawer:update","to":null,"kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"vocabulary §5.1, §16.13","note":"a lifecycle copy; still sent until the date, noted when a listener reads it"},{"from":"data-sf-drawer-open","to":"data-sf-action","kind":"attribute","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"page-trigger","section":"§8, §16.10","note":"a page trigger: data-sf-drawer-open=\\"<id>\\" is data-sf-action=\\"<id>.open\\"; read by the drawer, no shim (the shim maps an element\'s own attributes)"},{"from":"data-sf-drawer-close","to":"data-sf-action","kind":"attribute","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"page-trigger","section":"§8, §16.10","note":"data-sf-action=\\"<id>.close\\""},{"from":"data-sf-drawer-toggle","to":"data-sf-action","kind":"attribute","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"page-trigger","section":"§8, §16.10","note":"data-sf-action=\\"<id>.toggle\\""}]}');

/***/ },

/***/ "0dc7c163a2e8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-drawer\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/drawer (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.drawer","tag":"sf-drawer","version":"1.7.0","kind":"leaf","family":"drawer","settings":{"placement":{"type":"enum","values":["left","right","inline-start","inline-end","bottom"],"default":"right"},"snap":{"type":"enum","values":["auto","half","full"],"default":"auto"},"overlay":{"type":"boolean","default":true},"modal":{"type":"boolean","default":true},"docked":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1","2","full"],"default":"1"},"close-on-esc":{"type":"boolean","default":true},"close-on-overlay":{"type":"boolean","default":true},"preserve-scroll-gap":{"type":"boolean","default":true},"show-close":{"type":"boolean","default":true},"controlled":{"type":"boolean","default":false},"close-placement":{"type":"enum","values":["inside","outside"],"default":"inside"},"heading":{"type":"string","default":""},"label":{"type":"string","default":""},"close-label":{"type":"string","default-from":"runtime.close-label"},"width":{"type":"string","default":""},"stack-offset":{"type":"string","default":""},"dock-breakpoint":{"type":"string","default":""},"block-start":{"type":"string","default":""},"gutter":{"type":"string","default":""},"z-index":{"type":"string","default":""},"overlay-class":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"panel-style":{"type":"string","default":""},"header-class":{"type":"string","default":""},"body-class":{"type":"string","default":""},"close-class":{"type":"string","default":""},"unsaved":{"type":"boolean","default":false},"dismissible":{"type":"boolean","default":true}},"values":{"open":{"type":"boolean","default":false}},"events":{"open":{"carries":{"drawer-id":"string"},"cancelable":true},"opened":{"carries":{"drawer-id":"string"}},"close":{"carries":{"drawer-id":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"drawer-id":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"snapped":{"carries":{"drawer-id":"string","snap":{"type":"enum","values":["auto","half","full"]}}}},"actions":{"open":{"emits":"open","x-outcomes":["applied","refused"]},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"emits":"close","x-outcomes":["applied","refused"]},"toggle":{"x-outcomes":["applied","refused"]}},"slots":{"content":{"default":true},"edge":{}},"layer":{"kind":"panel","locks-page":true,"traps-focus":true},"side-effects":["locks-page","portal"],"keyboard":{"host":{"Tab":"reach","Shift+Tab":"reach","Escape":"close"}},"templates":{"default":{"file":"index.js","$comment":"The Lit template in JavaScript (SfDrawer.template()), the migration form of §5.2 (§16): the build does not compile template.html yet."}},"examples":"examples.json","docs":"docs.md","lang":"lang/","accessibility":{"role":"dialog","name":{"from":["label","heading"]},"keys":{"Tab":"reach","Shift+Tab":"reach","Escape":{"effect":"close","when":{"close-on-esc":true,"dismissible":true}}}},"css-variables":{"--sf-drawer-background":{"type":"color","state":"default"},"--sf-drawer-color":{"type":"color","state":"default"},"--sf-drawer-overlay-background":{"type":"color","state":"overlay"},"--sf-drawer-gutter":{"type":"length","state":"default"},"--sf-drawer-block-start":{"type":"length","state":"default"},"--sf-drawer-dock-breakpoint":{"type":"length","state":"docked"},"--sf-drawer-z-index":{"type":"number","state":"default"}},"x-summary":"Workspace side panel that keeps the page usable: docked column or modeless panel. Modal side panels belong to sf-modal; the modal Drawer mode is deprecated.","x-source":{"package":"framework","folder":"drawer","manifest":"simai/ui-source@5100227 src/smart/drawer/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/drawer.component.json"},"x-words":["label","close-label"],"x-renamed":["settings.title → heading: \\"title\\" is a property of HTMLElement.prototype (§3.1, §16 item 26), alias dated","events drawer:before-open/after-open/before-close/after-close → sf-drawer-open/-opened/-close/-closed (vocabulary §5, §7)","events drawer:snap → sf-drawer-snapped {snap} (vocabulary §5.1)","events drawer:ready, drawer:update retire (vocabulary §5.1, §16.13)"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"host","effects":"component","forbidden_client_responsibilities":["backend access decisions","host route invention"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile","ltr","rtl","reduced-motion","semantic-surface-radius","logical-placement"]},"ai_guidance":{"use_when":"Use sf-drawer for a workspace side panel next to a page that stays usable: docked (page content shifts, both sides at once) or modal=false (overlapping, no scrim, no focus trap). For a modal side panel use sf-modal with position=\\"inline-start|inline-end\\".","do_not":["Do not use a modal sf-drawer for new interfaces; use sf-modal with a side position","Do not copy generated ui-smart code","Do not move host data or access decisions into the component","Do not use overlay as a substitute for modal semantics","Do not pass literal design dimensions when a standard size or Framework token exists"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<div data-sf-drawer-dock-host>…</div><sf-drawer id=\\"blocks\\" docked open placement=\\"inline-start\\" size=\\"1/2\\" title=\\"Blocks\\"><p>Content</p></sf-drawer>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["alias-conflict: vocabulary §5.1 decides drawer:snap → sf-drawer-snapped, a fact of the component (the alias table\'s sf-drawer-snap is the bare verb of a request the drawer never waits on); the converter\'s sf-drawer-snap never shipped and gets no row.","detail-adapter: §8 takes page elements out of detail, so the new names carry {drawerId, …} only; each old drawer:* name keeps its old detail (component, drawer, root added) through a split row and the element\'s detail adapter (sfAliasAdapters). Larena and bx-simai.main listen to drawer:after-open and drawer:after-close (vocabulary §9.2).","version: 1.6.0 → 1.7.0, a minor while the renamed members hold dated aliases (§4.10); added unsaved, dismissible and the snapped detail field.","existing-aliases: compatibility.deprecations folds into aliases.json as documentation rows: the page triggers data-sf-drawer-open/-close/-toggle stay as aliases of data-sf-action (§16.10) and of data-drawer with aria-controls; the modal-like default without docked keeps its own deprecation in the change journal (no alias kind: it is a recommendation, not a name).","template: templates.default names the Lit template in index.js (template()), the migration form §5.2 allows; no template.html until the build compiles one.","examples: examples.json from studio.fixture.json and studio.scenario.json plus the docked column, the bottom sheet and the outside close button; probe.json drives Tab, Shift+Tab and Escape (gate 16).","css-variables: the seven variables docs.md and the sheet already promise (background, colour, overlay, gutter, block start, dock breakpoint, z-index); the portal carries their computed values from the host (§19.1). --sf-drawer-radius and --sf-drawer-width stay internal: the sheet sets them per size.","side-effects: the panel draws at the end of body or of its [data-sf-overlay-container] (portal) and, when modal and not docked, locks the page through the layer stack\'s one lease (locks-page).","layer: kind panel (§19.1); a modal drawer traps focus, a docked or modeless one does not (updateLayer re-declares it when modal or docked changes).","slots: the drawer places the page\'s own nodes (the content into its body, slot=\\"edge\\" beside the panel) and never copies them (§4.5); the converter\'s slot \\"default\\" is the content slot.","dismissing: the close request carries {reason, unsaved} (§19.3); dismissible=false removes escape and outside like close-on-esc and close-on-overlay, never an explicit action.","instance ids (§7.1.1, simai/ui-source#41): a drawer without id or drawer-id takes its path id (sf-drawer-<n> in document order) instead of a random one."]}');

/***/ },

/***/ "a3b41385ab12"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Drawer","runtime":{"close-label":"Close drawer","handle-label":"Resize the panel"}}');

/***/ },

/***/ "ce0ca620b623"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Панель","runtime":{"close-label":"Закрыть панель","handle-label":"Изменить высоту панели"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("5f0529568b98");
/******/
/******/ })()
;