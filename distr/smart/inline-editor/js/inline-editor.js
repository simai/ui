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

/***/ "dc7f7e1860ec"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f0e430451ca1");
/* harmony import */ var _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6b629b4c1b7e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f890c1d3caee");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("81636ab28da1");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("a3dcbb50765a");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("6b5b01c3d7a9");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d4ec85a12cc8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Smart entry for the inline text editor. The loader fetches this bundle when
// the page has an <sf-inline-editor> element; SF.Composition.startInlineEdit
// in Core delegates here once it is loaded.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the carrier is defined over the class core/js/composition/manifest-host.mjs
// makes from it; the edited element sends sf-inline-editor-input, -change and
// -cancel {id, content}, the former sf-inline-edit-* following until
// 2026-12-01.







globalThis.SF = globalThis.SF || {};
globalThis.SF.InlineEditor = Object.freeze({
  INLINE_EVENTS: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_EVENTS,
  INLINE_EVENTS_LEGACY: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_EVENTS_LEGACY,
  readInlineDom: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.readInlineDom,
  renderInlineDom: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.renderInlineDom,
  startInlineEdit: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.startInlineEdit,
  textOffset: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.textOffset
});
(0,_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.defineInlineEditor)(globalThis.customElements, {
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

/***/ "d4ec85a12cc8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "f0e430451ca1"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INLINE_EVENTS: () => (/* binding */ INLINE_EVENTS),
/* harmony export */   INLINE_EVENTS_LEGACY: () => (/* binding */ INLINE_EVENTS_LEGACY),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineInlineEditor: () => (/* binding */ defineInlineEditor),
/* harmony export */   readInlineDom: () => (/* binding */ readInlineDom),
/* harmony export */   renderInlineDom: () => (/* binding */ renderInlineDom),
/* harmony export */   startInlineEdit: () => (/* binding */ startInlineEdit),
/* harmony export */   textOffset: () => (/* binding */ textOffset)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e66d878fb4f8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];



// In-place editor for the Composition inline content model. The host starts
// it on a rendered heading or paragraph element; the editor exposes only
// normalized content (never HTML) through events. Cancel restores the exact
// original DOM; commit restores it too and lets the host re-render the saved
// value, so the canvas always returns to host-rendered HTML.

// The names sf-inline-editor's component.json declares (standard 1.3.8 §8,
// vocabulary 1.1.5): input while the text changes, change when it is
// committed, cancel when it is put back -- {id, content}, data only. The
// edited element is the host's, which carries no shim, so each event is
// followed here by its former name with its former detail ({node_id,
// content}) until 2026-12-01.
const INLINE_EVENTS = Object.freeze({
  input: 'sf-inline-editor-input',
  commit: 'sf-inline-editor-change',
  cancel: 'sf-inline-editor-cancel',
});

const INLINE_EVENTS_LEGACY = Object.freeze({
  input: 'sf-inline-edit-input',
  commit: 'sf-inline-edit-commit',
  cancel: 'sf-inline-edit-cancel',
});

function emitInline(element, key, id, content) {
  const detail = content === undefined ? { id } : { id, content };
  const legacy = content === undefined ? { node_id: id } : { node_id: id, content };
  element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS[key], { bubbles: true, composed: true, detail: Object.freeze(detail) }));
  element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS_LEGACY[key], { bubbles: true, composed: true, detail: Object.freeze(legacy) }));
}

const MESSAGES = {
  ru: { toolbar: 'Форматирование', strong: 'Полужирный', em: 'Курсив', code: 'Код', link: 'Ссылка', url: 'Адрес ссылки', apply: 'Применить', unlink: 'Убрать ссылку', editing: '{label}: редактирование. Enter — сохранить, Escape — отменить.', invalid: 'Недопустимый адрес ссылки' },
  en: { toolbar: 'Formatting', strong: 'Bold', em: 'Italic', code: 'Code', link: 'Link', url: 'Link address', apply: 'Apply', unlink: 'Remove link', editing: '{label}: editing. Enter saves, Escape cancels.', invalid: 'Invalid link address' },
};
const SHORTCUTS = { strong: 'b', em: 'i', code: 'e' };
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'HEAD', 'TITLE', 'META', 'LINK', 'IMG', 'SVG', 'OBJECT', 'IFRAME', 'NOSCRIPT']);
const BLOCK = new Set(['P', 'DIV', 'LI', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TR', 'TABLE', 'BLOCKQUOTE', 'SECTION', 'ARTICLE']);
const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
// Words in the page's language through pageText, as every component takes
// them: the editor read <html lang> alone and offered only English or Russian,
// so SF.language.use() and a product's own dictionary never reached it
// (documentation trial, 2026-10-12).
const words = (node) => Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, node, 'sf-inline-editor')]));

/** Reads inline content from any DOM subtree; foreign markup and styles are dropped. */
function readInlineDom(root, { marks = _inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.INLINE_MARKS, links = true, collapse = false } = {}) {
  const segments = [];
  const visit = (node, active, href) => {
    if (node.nodeType === 3) {
      let text = node.nodeValue.replace(/\u00a0/gu, ' ').replace(/[\r\n\t\f\v]/gu, ' ');
      if (collapse) text = text.replace(/ {2,}/gu, ' ');
      if (text) segments.push({ text, marks: [...active], href });
      return;
    }
    if (node.nodeType !== 1 && node.nodeType !== 11) return;
    if (node.nodeType === 1 && SKIP.has(node.tagName.toUpperCase())) return;
    const tag = node.nodeType === 1 ? node.tagName.toUpperCase() : '';
    const next = new Set(active);
    let nextHref = href;
    if (tag === 'STRONG' || tag === 'B') next.add('strong');
    if (tag === 'EM' || tag === 'I') next.add('em');
    if (tag === 'CODE' || tag === 'KBD' || tag === 'SAMP') next.add('code');
    if (node.nodeType === 1 && node.style) {
      const weight = node.style.fontWeight;
      if (weight === 'bold' || weight === 'bolder' || Number(weight) >= 600) next.add('strong');
      if (node.style.fontStyle === 'italic') next.add('em');
    }
    if (tag === 'A' && !href && links) {
      const candidate = node.getAttribute('href');
      if ((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.safeHref)(candidate)) nextHref = candidate;
    }
    if (tag === 'BR') {
      // The placeholder <br> a browser leaves in an emptied editor is not content.
      if (node.parentNode === root && !node.nextSibling) return;
      segments.push({ text: ' ', marks: [...active], href });
      return;
    }
    for (const child of node.childNodes) visit(child, next, nextHref);
    // Nested blocks (pasted paragraphs) are separated by one space; the root is not.
    if (BLOCK.has(tag) && node !== root) segments.push({ text: ' ', marks: [], href: null });
  };
  visit(root, new Set(), null);
  const allowed = new Set(marks);
  let content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.fromSegments)(segments.map((segment) => ({ ...segment, marks: segment.marks.filter((mark) => allowed.has(mark)), href: links ? segment.href : null })));
  if (collapse) {
    const flat = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.toSegments)(content);
    if (flat.length) {
      flat[0] = { ...flat[0], text: flat[0].text.replace(/^ +/u, '') };
      flat[flat.length - 1] = { ...flat.at(-1), text: flat.at(-1).text.replace(/ +$/u, '') };
    }
    content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.fromSegments)(flat);
  }
  return content;
}

/** Renders inline content with the same element nesting as the Framework renderer. */
function renderInlineDom(doc, content) {
  const fragment = doc.createDocumentFragment();
  const run = (entry) => {
    let node = doc.createTextNode(entry.value);
    for (const mark of entry.marks || []) {
      const wrapper = doc.createElement(mark);
      wrapper.append(node);
      node = wrapper;
    }
    return node;
  };
  for (const entry of (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizeInline)(content)) {
    if (entry.type === 'link') {
      const anchor = doc.createElement('a');
      anchor.setAttribute('href', entry.href);
      for (const child of entry.children) anchor.append(run(child));
      fragment.append(anchor);
    } else fragment.append(run(entry));
  }
  return fragment;
}

function textNodes(root) {
  const walker = root.ownerDocument.createTreeWalker(root, 4);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

/** Character offset of a DOM position inside root, counted over text nodes. */
function textOffset(root, container, offset) {
  const range = root.ownerDocument.createRange();
  range.setStart(root, 0);
  range.setEnd(container, offset);
  return range.toString().length;
}

function setSelection(root, start, end = start) {
  const selection = root.ownerDocument.getSelection();
  const nodes = textNodes(root);
  const locate = (offset) => {
    let total = 0;
    for (const node of nodes) {
      if (offset <= total + node.nodeValue.length) return [node, offset - total];
      total += node.nodeValue.length;
    }
    return nodes.length ? [nodes.at(-1), nodes.at(-1).nodeValue.length] : [root, 0];
  };
  const range = root.ownerDocument.createRange();
  const [startNode, startOffset] = locate(start);
  const [endNode, endOffset] = locate(end);
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Starts in-place editing of a rendered heading or paragraph element.
 * options: {content, nodeId, label, marks, links, messages}
 * Returns {commit(), cancel(), value(), element}.
 */
function startInlineEdit(element, options = {}) {
  if (!(element instanceof globalThis.Element)) throw new TypeError('Inline editing needs an element');
  if (element.hasAttribute('data-sf-inline-editing')) throw new TypeError('inline_edit_active');
  const doc = element.ownerDocument;
  const text = { ...words(element), ...(options.messages || {}) };
  const marks = (options.marks || _inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.INLINE_MARKS).filter((mark) => _inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.INLINE_MARKS.includes(mark));
  const links = options.links !== false;
  const original = { html: element.innerHTML, attributes: ['contenteditable', 'role', 'aria-multiline', 'aria-label', 'spellcheck', 'tabindex'].map((name) => [name, element.getAttribute(name)]) };
  const history = [];
  let historyIndex = -1;
  let composing = false;
  let lastTyping = 0;
  let finished = false;
  const connection = new AbortController();
  const signal = { signal: connection.signal };

  const read = () => readInlineDom(element, { marks, links });
  const selectionOffsets = () => {
    const selection = doc.getSelection();
    if (!selection?.rangeCount || !element.contains(selection.anchorNode)) return [(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.inlineText)(read()).length, (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.inlineText)(read()).length];
    const range = selection.getRangeAt(0);
    return [textOffset(element, range.startContainer, range.startOffset), textOffset(element, range.endContainer, range.endOffset)];
  };
  const draw = (content, start, end) => {
    element.replaceChildren(renderInlineDom(doc, content));
    setSelection(element, start, end);
  };
  const snapshot = (merge = false) => {
    const entry = { content: read(), selection: selectionOffsets() };
    if (merge && historyIndex === history.length - 1 && history[historyIndex].typing) history[historyIndex] = { ...entry, typing: true };
    else {
      history.splice(historyIndex + 1);
      history.push({ ...entry, typing: merge });
      historyIndex = history.length - 1;
    }
  };
  const emitInput = () => emitInline(element, 'input', options.nodeId ?? null, read());
  const apply = (content, start, end) => {
    draw(content, start, end);
    snapshot(false);
    emitInput();
    updateToolbar();
  };
  const restore = (index) => {
    historyIndex = index;
    const entry = history[index];
    draw(entry.content, ...entry.selection);
    emitInput();
    updateToolbar();
  };

  // Toolbar ----------------------------------------------------------------
  const toolbar = doc.createElement('div');
  toolbar.className = 'sf-inline-editor-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', text.toolbar);
  const buttons = new Map();
  for (const mark of marks) {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = `sf-inline-editor-button sf-inline-editor-button--${mark}`;
    button.dataset.mark = mark;
    button.textContent = text[mark];
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-keyshortcuts', `Control+${SHORTCUTS[mark].toUpperCase()} Meta+${SHORTCUTS[mark].toUpperCase()}`);
    buttons.set(mark, button);
    toolbar.append(button);
  }
  const linkForm = doc.createElement('div');
  linkForm.className = 'sf-inline-editor-link';
  linkForm.hidden = true;
  const linkInput = doc.createElement('input');
  linkInput.type = 'url';
  linkInput.className = 'sf-inline-editor-url';
  linkInput.setAttribute('aria-label', text.url);
  const linkApply = doc.createElement('button');
  linkApply.type = 'button';
  linkApply.className = 'sf-inline-editor-button';
  linkApply.textContent = text.apply;
  const linkRemove = doc.createElement('button');
  linkRemove.type = 'button';
  linkRemove.className = 'sf-inline-editor-button';
  linkRemove.textContent = text.unlink;
  const linkError = doc.createElement('span');
  linkError.className = 'sf-inline-editor-error';
  linkError.setAttribute('role', 'alert');
  linkForm.append(linkInput, linkApply, linkRemove, linkError);
  if (links) {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'sf-inline-editor-button sf-inline-editor-button--link';
    button.dataset.link = 'toggle';
    button.textContent = text.link;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
    buttons.set('link', button);
    toolbar.append(button, linkForm);
  }
  doc.body.append(toolbar);
  let savedSelection = [0, 0];

  function positionToolbar() {
    const box = element.getBoundingClientRect();
    const bar = toolbar.getBoundingClientRect();
    const rtl = globalThis.getComputedStyle(element).direction === 'rtl';
    const above = box.top - bar.height - 4;
    const top = above >= 0 ? above : Math.min(globalThis.innerHeight - bar.height, box.bottom + 4);
    const start = rtl ? box.right - bar.width : box.left;
    Object.assign(toolbar.style, { top: `${top}px`, left: `${Math.max(0, Math.min(start, globalThis.innerWidth - bar.width))}px` });
  }

  function updateToolbar() {
    const [start, end] = selectionOffsets();
    const state = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.marksIn)(read(), start, end === start ? Math.max(0, start - 1) : end);
    for (const mark of marks) buttons.get(mark).setAttribute('aria-pressed', state.marks.includes(mark) ? 'true' : 'false');
    buttons.get('link')?.setAttribute('aria-pressed', state.href ? 'true' : 'false');
    positionToolbar();
  }

  function toggle(mark) {
    const [start, end] = selectionOffsets();
    if (start === end) return;
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.toggleMark)(read(), start, end, mark), start, end);
  }

  function openLink() {
    savedSelection = selectionOffsets();
    if (savedSelection[0] === savedSelection[1]) return;
    linkForm.hidden = false;
    linkError.textContent = '';
    linkInput.value = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.marksIn)(read(), ...savedSelection).href || '';
    linkInput.focus();
    positionToolbar();
  }

  function closeLink(focusEditor = true) {
    linkForm.hidden = true;
    if (focusEditor) {
      element.focus();
      setSelection(element, ...savedSelection);
    }
  }

  function applyLink(href) {
    if (href !== null && !(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.safeHref)(href)) {
      linkError.textContent = text.invalid;
      linkInput.setAttribute('aria-invalid', 'true');
      return;
    }
    linkInput.removeAttribute('aria-invalid');
    closeLink();
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.setLink)(read(), ...savedSelection, href), ...savedSelection);
  }

  // Lifecycle --------------------------------------------------------------
  function teardown() {
    finished = true;
    connection.abort();
    toolbar.remove();
    element.innerHTML = original.html;
    for (const [name, value] of original.attributes) {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    }
    element.removeAttribute('data-sf-inline-editing');
  }

  function commit() {
    if (finished) return null;
    const content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizeInline)(read());
    teardown();
    emitInline(element, 'commit', options.nodeId ?? null, content);
    return content;
  }

  function cancel() {
    if (finished) return;
    teardown();
    emitInline(element, 'cancel', options.nodeId ?? null);
  }

  // Start ------------------------------------------------------------------
  const initial = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizeInline)(options.content ?? readInlineDom(element, { marks, links }));
  element.setAttribute('data-sf-inline-editing', '');
  element.setAttribute('contenteditable', 'true');
  element.setAttribute('role', 'textbox');
  element.setAttribute('aria-multiline', 'false');
  element.setAttribute('aria-label', format(text.editing, { label: options.label || '' }).replace(/^: /u, ''));
  element.replaceChildren(renderInlineDom(doc, initial));
  element.focus();
  setSelection(element, (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.inlineText)(initial).length);
  history.push({ content: initial, selection: selectionOffsets(), typing: false });
  historyIndex = 0;

  element.addEventListener('beforeinput', (event) => {
    if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
      event.preventDefault();
      if (event.inputType === 'historyUndo' && historyIndex > 0) restore(historyIndex - 1);
      if (event.inputType === 'historyRedo' && historyIndex < history.length - 1) restore(historyIndex + 1);
    } else if (event.inputType === 'insertParagraph' || event.inputType === 'insertLineBreak') {
      event.preventDefault();
    } else if (event.inputType.startsWith('format')) {
      event.preventDefault();
      const mark = { formatBold: 'strong', formatItalic: 'em' }[event.inputType];
      if (mark && marks.includes(mark)) toggle(mark);
    } else if (event.inputType === 'insertFromDrop') {
      event.preventDefault();
    }
  }, signal);
  element.addEventListener('input', () => {
    if (composing) return;
    const now = Date.now();
    snapshot(now - lastTyping < 700);
    lastTyping = now;
    emitInput();
    updateToolbar();
  }, signal);
  element.addEventListener('compositionstart', () => { composing = true; }, signal);
  element.addEventListener('compositionend', () => {
    composing = false;
    snapshot(false);
    emitInput();
  }, signal);
  element.addEventListener('paste', (event) => {
    event.preventDefault();
    const data = event.clipboardData;
    const html = data?.getData('text/html');
    const plain = data?.getData('text/plain') || '';
    const parsed = html
      ? readInlineDom(new globalThis.DOMParser().parseFromString(html, 'text/html').body, { marks, links, collapse: true })
      : [{ type: 'text', value: plain.replace(/\s+/gu, ' ').trim() }];
    const inserted = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.toSegments)(parsed);
    const [start, end] = selectionOffsets();
    const length = inserted.reduce((sum, segment) => sum + segment.text.length, 0);
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.replaceRange)(read(), start, end, inserted), start + length, start + length);
  }, signal);
  element.addEventListener('drop', (event) => event.preventDefault(), signal);
  element.addEventListener('keydown', (event) => {
    if (event.isComposing || composing) return;
    const modifier = event.ctrlKey || event.metaKey;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
    } else if (modifier && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) { if (historyIndex < history.length - 1) restore(historyIndex + 1); } else if (historyIndex > 0) restore(historyIndex - 1);
    } else if (modifier && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      if (historyIndex < history.length - 1) restore(historyIndex + 1);
    } else if (modifier && event.key.toLowerCase() === 'k' && links) {
      event.preventDefault();
      openLink();
    } else if (modifier) {
      const mark = Object.entries(SHORTCUTS).find(([, key]) => key === event.key.toLowerCase())?.[0];
      if (mark && marks.includes(mark)) {
        event.preventDefault();
        toggle(mark);
      }
    }
  }, signal);
  toolbar.addEventListener('mousedown', (event) => {
    // Keep the text selection while pressing toolbar buttons.
    if (event.target.closest('button')) event.preventDefault();
  }, signal);
  toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.mark) toggle(button.dataset.mark);
    else if (button.dataset.link) (linkForm.hidden ? openLink() : closeLink());
    else if (button === linkApply) applyLink(linkInput.value.trim());
    else if (button === linkRemove) applyLink(null);
  }, signal);
  linkInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); applyLink(linkInput.value.trim()); }
    if (event.key === 'Escape') { event.preventDefault(); closeLink(); }
  }, signal);
  const onFocusOut = (event) => {
    const next = event.relatedTarget;
    if (next && (element.contains(next) || toolbar.contains(next))) return;
    // Let a click inside the toolbar land before deciding to commit.
    globalThis.setTimeout(() => {
      if (!finished && !element.contains(doc.activeElement) && !toolbar.contains(doc.activeElement)) commit();
    }, 0);
  };
  element.addEventListener('focusout', onFocusOut, signal);
  toolbar.addEventListener('focusout', onFocusOut, signal);
  doc.addEventListener('selectionchange', () => { if (element.contains(doc.getSelection()?.anchorNode)) updateToolbar(); }, signal);
  globalThis.addEventListener('scroll', positionToolbar, { ...signal, passive: true, capture: true });
  globalThis.addEventListener('resize', positionToolbar, { ...signal, passive: true });
  updateToolbar();

  return Object.freeze({ element, commit, cancel, value: () => (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizeInline)(read()) });
}

/**
 * <sf-inline-editor> is the loadable carrier of the inline editor: placing it
 * on a page lets the Smart loader fetch this code on demand. It renders
 * nothing; edit(element, options) is startInlineEdit.
 */
//
// base: the class made from sf-inline-editor's component.json
// (manifest-host.mjs); without it the carrier is a plain element.
function defineInlineEditor(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-inline-editor');
  if (existing) return existing;
  class SfInlineEditor extends (base || globalThis.HTMLElement) {
    connectedCallback() {
      super.connectedCallback?.();
      this.hidden = true;
    }

    edit(element, options) {
      return startInlineEdit(element, options);
    }
  }
  registry.define('sf-inline-editor', SfInlineEditor);
  return SfInlineEditor;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ INLINE_EVENTS, INLINE_EVENTS_LEGACY, defineInlineEditor, readInlineDom, renderInlineDom, startInlineEdit, textOffset });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e66d878fb4f8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INLINE_LIMITS: () => (/* binding */ INLINE_LIMITS),
/* harmony export */   INLINE_MARKS: () => (/* binding */ INLINE_MARKS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fromSegments: () => (/* binding */ fromSegments),
/* harmony export */   inlineText: () => (/* binding */ inlineText),
/* harmony export */   marksIn: () => (/* binding */ marksIn),
/* harmony export */   normalizeInline: () => (/* binding */ normalizeInline),
/* harmony export */   replaceRange: () => (/* binding */ replaceRange),
/* harmony export */   safeHref: () => (/* binding */ safeHref),
/* harmony export */   setLink: () => (/* binding */ setLink),
/* harmony export */   toSegments: () => (/* binding */ toSegments),
/* harmony export */   toggleMark: () => (/* binding */ toggleMark)
/* harmony export */ });
// Pure operations on the Composition inline content model used by
// content.heading and content.paragraph: text runs with strong, em and code
// marks, and links whose children are text runs. No DOM access here.

const INLINE_MARKS = Object.freeze(['strong', 'em', 'code']);
const MARK_ORDER = new Map(INLINE_MARKS.map((mark, index) => [mark, index]));
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const INLINE_LIMITS = Object.freeze({ maxTextLength: 100000, maxHrefLength: 2048 });

/** Same link rule as Document validation: relative, fragment or http(s)/mailto/tel. */
function safeHref(value) {
  if (typeof value !== 'string' || value.length < 1 || value.length > INLINE_LIMITS.maxHrefLength) return false;
  // Browsers read "/\\host" like "//host": backslashes never form a local link.
  if (/^(?:\/|\.?\.\/|#)/u.test(value)) return !value.startsWith('//') && !value.includes('\\');
  try {
    return SAFE_SCHEMES.has(new globalThis.URL(value).protocol);
  } catch {
    return false;
  }
}

function sortMarks(marks) {
  return [...new Set(marks)].filter((mark) => MARK_ORDER.has(mark)).sort((left, right) => MARK_ORDER.get(left) - MARK_ORDER.get(right));
}

/** Flat segments: {text, marks: string[], href: string|null}. */
function toSegments(content) {
  const segments = [];
  const push = (run, href) => {
    if (run?.type !== 'text' || typeof run.value !== 'string' || !run.value) return;
    segments.push({ text: run.value, marks: sortMarks(Array.isArray(run.marks) ? run.marks : []), href });
  };
  for (const entry of Array.isArray(content) ? content : []) {
    if (entry?.type === 'link') {
      const href = safeHref(entry.href) ? entry.href : null;
      for (const child of Array.isArray(entry.children) ? entry.children : []) push(child, href);
    } else push(entry, null);
  }
  return segments;
}

const sameStyle = (left, right) => left.href === right.href && left.marks.join() === right.marks.join();

/** Builds normalized content: merged runs, canonical marks, no empty parts. */
function fromSegments(segments) {
  const merged = [];
  for (const segment of segments) {
    if (!segment.text) continue;
    const clean = { text: segment.text, marks: sortMarks(segment.marks || []), href: segment.href && safeHref(segment.href) ? segment.href : null };
    const previous = merged.at(-1);
    if (previous && sameStyle(previous, clean)) previous.text += clean.text;
    else merged.push(clean);
  }
  const content = [];
  for (const segment of merged) {
    const run = { type: 'text', value: segment.text, ...(segment.marks.length ? { marks: segment.marks } : {}) };
    const previous = content.at(-1);
    if (segment.href) {
      if (previous?.type === 'link' && previous.href === segment.href) previous.children.push(run);
      else content.push({ type: 'link', href: segment.href, children: [run] });
    } else content.push(run);
  }
  return content;
}

function normalizeInline(content) {
  return fromSegments(toSegments(content));
}

function inlineText(content) {
  return toSegments(content).map(({ text }) => text).join('');
}

function split(segments, offset) {
  const output = [];
  let position = 0;
  for (const segment of segments) {
    const end = position + segment.text.length;
    if (offset > position && offset < end) {
      output.push({ ...segment, text: segment.text.slice(0, offset - position) }, { ...segment, text: segment.text.slice(offset - position) });
    } else output.push(segment);
    position = end;
  }
  return output;
}

function range(content, start, end) {
  const segments = split(split(toSegments(content), start), end);
  let position = 0;
  return segments.map((segment) => {
    const from = position;
    position += segment.text.length;
    return { segment, inside: from >= start && position <= end && position > from };
  });
}

/** Marks and link shared by every character in [start, end). */
function marksIn(content, start, end) {
  const inside = range(content, Math.min(start, end), Math.max(start, end)).filter(({ inside: isInside }) => isInside).map(({ segment }) => segment);
  if (!inside.length) return { marks: [], href: null };
  const marks = INLINE_MARKS.filter((mark) => inside.every((segment) => segment.marks.includes(mark)));
  const href = inside.every((segment) => segment.href === inside[0].href) ? inside[0].href : null;
  return { marks, href };
}

/** Adds the mark to [start, end) unless every character already has it. */
function toggleMark(content, start, end, mark) {
  if (!MARK_ORDER.has(mark) || start === end) return normalizeInline(content);
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  const remove = marksIn(content, from, to).marks.includes(mark);
  return fromSegments(range(content, from, to).map(({ segment, inside }) => (inside
    ? { ...segment, marks: remove ? segment.marks.filter((entry) => entry !== mark) : [...segment.marks, mark] }
    : segment)));
}

/** Sets or removes (href null) a link on [start, end); unsafe links are refused. */
function setLink(content, start, end, href) {
  if (href !== null && !safeHref(href)) throw new TypeError('inline_link_unsafe');
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  if (from === to) return normalizeInline(content);
  return fromSegments(range(content, from, to).map(({ segment, inside }) => (inside ? { ...segment, href } : segment)));
}

/** Replaces [start, end) with segments (typing, paste or deletion). */
function replaceRange(content, start, end, inserted) {
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  const parts = range(content, from, to);
  const before = parts.filter((_, index) => parts.slice(0, index + 1).reduce((sum, part) => sum + part.segment.text.length, 0) <= from).map(({ segment }) => segment);
  let consumed = 0;
  const after = [];
  for (const { segment } of parts) {
    const segmentStart = consumed;
    consumed += segment.text.length;
    if (segmentStart >= to) after.push(segment);
  }
  return fromSegments([...before, ...inserted, ...after]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ INLINE_MARKS, fromSegments, inlineText, marksIn, normalizeInline, replaceRange, safeHref, setLink, toSegments, toggleMark });


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
      // Static markup printed for the first paint (standard 1.3.8 §5.4) goes
      // as the element connects: these elements draw in the same task.
      if (!this.__sfFirstPaintEnded) {
        this.__sfFirstPaintEnded = true;
        for (const child of Array.from(this.children)) {
          if (child.hasAttribute('data-sf-static') && !child.hasAttribute('slot')) child.remove();
          else child.removeAttribute('data-sf-held');
        }
        this.removeAttribute('data-sf-first-paint');
      }
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

/***/ "81636ab28da1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-inline-editor for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired. These events are sent on the edited element, which carries no shim: core/js/composition/inline-editor.mjs sends each former name itself, with its former detail.","component":"sf-inline-editor","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-inline-edit-input","to":"sf-inline-editor-input","kind":"event","component":"sf-inline-editor","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-input","to":"input"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id, content}"},{"from":"sf-inline-edit-commit","to":"sf-inline-editor-change","kind":"event","component":"sf-inline-editor","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-commit","to":"change"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id, content}"},{"from":"sf-inline-edit-cancel","to":"sf-inline-editor-cancel","kind":"event","component":"sf-inline-editor","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-cancel","to":"cancel"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id}"}]}');

/***/ },

/***/ "f890c1d3caee"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-inline-editor\'s interface (core/js/element-manifest.js over core/js/composition/manifest-host.mjs). Taken from simai/ui-control control/smart-architecture/migration/out/inline-editor (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.inline-editor","tag":"sf-inline-editor","version":"1.1.1","kind":"leaf","family":"editor","settings":{},"values":{},"events":{"input":{"carries":{"id":{"type":"string","nullable":true},"content":{"type":"list","of":{"type":"string","value":"string","marks":"list","href":"string"}}},"x-native":false,"summary":"The text changed while it is edited; sent on the edited element"},"change":{"carries":{"id":{"type":"string","nullable":true},"content":{"type":"list","of":{"type":"string","value":"string","marks":"list","href":"string"}}},"x-native":false,"summary":"The edit was committed (Enter, or the focus left): the content to save; sent on the edited element"},"cancel":{"carries":{"id":{"type":"string","nullable":true}},"summary":"The edit was put back (Escape): the element shows its HTML from before; sent on the edited element"}},"actions":{"edit":{"with":{"element":"object","options":"object"},"x-returns":"the session {element, commit(), cancel(), value()}","summary":"Starts editing an element of the canvas (SF.Composition.startInlineEdit): options content, nodeId, label, marks, links, messages"}},"keyboard":{"host":{"Enter":"commit","Escape":"revert","Mod+B":"toggle:strong","Mod+I":"toggle:em","Mod+E":"toggle:code","Mod+K":"open","Mod+Z":"step:-1","Mod+Shift+Z":"step:+1","Mod+Y":"step:+1"}},"relations":[],"templates":{"default":{"file":"../../core/js/composition/inline-editor.mjs","$comment":"The carrier draws nothing: the edited element and the formatting toolbar are drawn by the composition module (core/js/composition/inline-editor.mjs) while an edit lasts."}},"examples":"examples.json","docs":"docs.md","lang":"lang/","accessibility":{"$comment":"The carrier is hidden and has no role. While an edit lasts the edited element is role textbox (aria-multiline false) named from the edit\'s label with the language file\'s runtime.editing («{label}: редактирование. Enter — сохранить, Escape — отменить.»), and the toolbar is role toolbar with aria-pressed buttons.","role":"none","name":{"from":["label"]},"keys":{"Enter":"commit","Escape":"revert","Mod+B":"toggle:strong","Mod+I":"toggle:em","Mod+E":"toggle:code","Mod+K":"open","Mod+Z":"step:-1","Mod+Shift+Z":"step:+1","Mod+Y":"step:+1"}},"css-variables":{"--sf-inline-editor-outline-color":{"type":"color","state":"editing"},"--sf-inline-editor-toolbar-background-color":{"type":"color","state":"editing"},"--sf-inline-editor-toolbar-radius":{"type":"length","state":"editing"},"--sf-inline-editor-toolbar-gap":{"type":"length","state":"editing"},"--sf-inline-editor-toolbar-padding":{"type":"length","state":"editing"}},"aliases":{"$comment":"Dated aliases of sf-inline-editor for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired. These events are sent on the edited element, which carries no shim: core/js/composition/inline-editor.mjs sends each former name itself, with its former detail.","since":"2026-10-27","remove-after":"2026-12-01","rows":[{"from":"sf-inline-edit-input","to":"sf-inline-editor-input","kind":"event","mode":"split","cancelable":false,"manifest":true,"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id, content}","summary":"Dated alias of sf-inline-editor-input until 2026-12-01: Live normalized content after a change. Dispatched on the edited element; bubbles to document."},{"from":"sf-inline-edit-commit","to":"sf-inline-editor-change","kind":"event","mode":"split","cancelable":false,"manifest":true,"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id, content}","summary":"Dated alias of sf-inline-editor-change until 2026-12-01: Editing finished with Enter or focus leaving; the host saves. Dispatched on the edited element; bubbles to document."},{"from":"sf-inline-edit-cancel","to":"sf-inline-editor-cancel","kind":"event","mode":"split","cancelable":false,"manifest":true,"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id}","summary":"Dated alias of sf-inline-editor-cancel until 2026-12-01: Editing was cancelled with Escape; the original HTML is restored. Dispatched on the edited element; bubbles to document."}]},"x-summary":"Edits a content.heading or content.paragraph in place on the canvas -- strong, em, code and links -- and gives the host the normalised content model, never HTML.","x-source":{"package":"framework","folder":"inline-editor","manifest":"simai/ui-source@5100227 src/smart/inline-editor/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/inline-editor.component.json"},"x-renamed":["events.sf-inline-edit-input {node_id, content} → input {id, content}: sf-inline-editor-input (x-native false: a CustomEvent input on a contenteditable element would be taken for the browser\'s own)","events.sf-inline-edit-commit {node_id, content} → change {id, content}: the committed value is a change (vocabulary 1.1.5 §5.1, as sf-theme-change → change); sf-inline-editor-change","events.sf-inline-edit-cancel {node_id} → cancel {id} (vocabulary §5 cancel); sf-inline-editor-cancel","lang runtime holds the words of the editor module (MESSAGES of core/js/composition/inline-editor.mjs)"],"x-decisions":["events (vocabulary 1.1.5): input while the text changes, change when the edit is committed (a value changed -- the verb the vocabulary gives sf-theme-change; not save, a write with a revision and a client key the editor does not hold), cancel when it is put back (§5 cancel). Details hold data only in the vocabulary\'s words: {id, content}, id being the edit\'s nodeId. input and change are not the browser\'s events (x-native false): they are sf-inline-editor-input and sf-inline-editor-change, since the edited element is contenteditable and the browser sends its own input there.","the host contract stays: the events are sent on the edited element, bubble to the document, and each is followed by its former name with its former detail -- sf-inline-edit-input, -commit {node_id, content}, -cancel {node_id} -- until 2026-12-01. The element is the host\'s and carries no shim, so the module sends both itself; aliases.json records the rows for the journal and the sweep. INLINE_EVENTS holds the new names, INLINE_EVENTS_LEGACY the former.","own-verb-words: none -- commit became the vocabulary\'s change.","edit is the carrier\'s one action and the host\'s port (SF.Composition.startInlineEdit): it answers the session {element, commit(), cancel(), value()} as before, not an outcome -- the port stays as the composition editor uses it.","element: the carrier stays the plain element the composition module defines; defineInlineEditor(registry, {base}) extends the class core/js/composition/manifest-host.mjs makes from this component.json (the aliases.json shim, sfWord).","a11y-role: none for the hidden carrier; the edited element is role textbox while an edit lasts, the toolbar role toolbar.","a11y-name: the edited element\'s name is the edit\'s label with the language file\'s runtime.editing (accessibility.name from label).","key-effects: Enter commit, Escape revert, Mod+B, Mod+I, Mod+E toggle:strong, toggle:em, toggle:code, Mod+K open (the link form), Mod+Z step:-1 and Mod+Shift+Z or Mod+Y step:+1 (a step through the edit\'s history).","words (§11): the language files hold the editor module\'s words; the module keeps its copy and reads them through the page\'s language, since SF.Composition.startInlineEdit draws with them.","version 1.1.0: the events renamed behind dated aliases (§4.10).","examples: examples.json -- the carrier alone, and an edit started on a paragraph and on a heading (the carrier has no settings; an edit\'s options are the action\'s).","css-variables: five public variables of its sheet, all of an edit in progress: the edited element\'s outline, the toolbar\'s fill, radius, gap and padding. Not in src/core/contracts/public-variables.v1.json: its probe measures a component at rest, where none of these parts exist."],"x-registry":{"capabilities":["interaction","keyboard","theme"],"persistence":{"mode":"none","source_of_truth":"host","network_owner":"none","revision_field":null},"readiness":{"level":"runnable","required_checks":["manifest","fixture","runtime-upgrade","scenario-smoke","keyboard","responsive","a11y"]},"tags":["composition","editor","inline","text"],"contracts":{"start":{"type":"object","description":"SF.Composition.startInlineEdit(element, {content, nodeId, label, marks, links, messages}) or element.edit(target, options) returns {element, commit(), cancel(), value()}. Before the component is loaded startInlineEdit throws inline_editor_not_loaded. Also exposed as SF.InlineEditor {INLINE_EVENTS, readInlineDom, renderInlineDom, startInlineEdit, textOffset}.","properties":{"marks":{"type":"array","items":{"enum":["strong","em","code"]}},"links":{"type":"boolean","default":true}}},"links":{"type":"object","description":"http, https, mailto, tel, relative and fragment links only; protocol-relative and backslash addresses are refused, as in Document validation."}},"state":{"machines":{"edit":["idle","editing","committed","cancelled"]},"visual_states":["default","active"]},"ownership":{"source":"simai/ui-source","data":"host","effects":"host","forbidden_client_responsibilities":["backend access decisions","host route invention","saving or reordering host data"]},"security":{"permissions_owner":"host","untrusted_inputs":["props","children"],"network_policy":"deny"},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile","ltr","rtl","reduced-motion"],"skeleton":{"shape":"block","while_loading":"none"}},"ai_guidance":{"use_when":"Use the inline editor for text of content.heading and content.paragraph on an editor page. Save the committed content through the host Property contract, validate the Document and re-render.","do_not":["Do not copy generated ui-smart code","Do not save HTML; events carry the content model","Do not offer lists; the content model has none","Do not call startInlineEdit before sf-inline-editor is defined"],"required_reads":["contracts","methods","events","ownership","provenance"],"minimal_example":"<sf-inline-editor></sf-inline-editor><script>await customElements.whenDefined(\'sf-inline-editor\'); SF.Composition.startInlineEdit(paragraph, {content, nodeId: \'p1\', label: \'Paragraph\'});</script>","owner_commands":["npm run contract:verify","npm test"]},"accessibility":{"accessible_name":"internal","keyboard":["Mod+B","Mod+I","Mod+E","Mod+K","Mod+Z","Mod+Shift+Z","Mod+Y","Enter","Escape"],"focus":"The sf-inline-editor carrier is hidden and has no role. While editing, the edited element becomes a labelled role=textbox with a visible outline; the formatting toolbar has aria-pressed states and aria-keyshortcuts. Enter commits, Escape cancels, focus leaving commits; IME composition is never interrupted."},"alias-events":{"sf-inline-edit-input":{"summary":"Dated alias of sf-inline-editor-input until 2026-12-01: Live normalized content after a change. Dispatched on the edited element; bubbles to document.","payload":{"type":"object","required":["node_id","content"],"properties":{"node_id":{"type":["string","null"]},"content":{"type":"array"}}}},"sf-inline-edit-commit":{"summary":"Dated alias of sf-inline-editor-change until 2026-12-01: Editing finished with Enter or focus leaving; the host saves. Dispatched on the edited element; bubbles to document.","payload":{"type":"object","required":["node_id","content"],"properties":{"node_id":{"type":["string","null"]},"content":{"type":"array"}}}},"sf-inline-edit-cancel":{"summary":"Dated alias of sf-inline-editor-cancel until 2026-12-01: Editing was cancelled with Escape; the original HTML is restored. Dispatched on the edited element; bubbles to document.","payload":{"type":"object","properties":{"node_id":{"type":["string","null"]}}}}}}}');

/***/ },

/***/ "a3dcbb50765a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Inline editor","runtime":{"apply":"Apply","code":"Code","editing":"{label}: editing. Enter saves, Escape cancels.","em":"Italic","invalid":"Invalid link address","link":"Link","strong":"Bold","toolbar":"Formatting","unlink":"Remove link","url":"Link address"}}');

/***/ },

/***/ "6b5b01c3d7a9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Редактор текста на холсте","runtime":{"apply":"Применить","code":"Код","editing":"{label}: редактирование. Enter — сохранить, Escape — отменить.","em":"Курсив","invalid":"Недопустимый адрес ссылки","link":"Ссылка","strong":"Полужирный","toolbar":"Форматирование","unlink":"Убрать ссылку","url":"Адрес ссылки"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("dc7f7e1860ec");
/******/
/******/ })()
;