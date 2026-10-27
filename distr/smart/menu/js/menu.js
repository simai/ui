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

/***/ "3267d93fb0d3"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSmartMenu: () => (/* binding */ SfSmartMenu)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("695f21e50358");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5c1dc214bb5e");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("421676f72963");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e29406217b0b");
/* harmony import */ var _items_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("7332c9a6d69c");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("831ef45545b2");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("e0fa46ed075f");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("97168578e30d");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("33262fd5308c");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("15d5a97ca4e8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_3__);
// sf-menu: site navigation built from data -- a site's sections, a cabinet's
// pages, a documentation tree -- drawn as the class menu (src/component/menu),
// so its styles apply and nothing of them is forked (owner, 2026-10-25). The
// items come from `items` (an array, or the same as JSON) or from a nested
// <ul><li><a> written inside the element.
//
// It is the WAI-ARIA disclosure navigation pattern, not an application menu:
// native links in a named <nav>, a branch's button with aria-expanded and
// aria-controls, the current page marked aria-current="page". Tab walks the
// links and the buttons; Enter and Space are the button's; Escape closes the
// innermost open panel only and gives the focus back to its button.
//
// The element draws the class markup and keeps its state itself: open
// branches, the current page, the panel a row that does not fit becomes. The
// markup carries data-sf-menu-owned, so the class runtime -- loaded beside it
// for the sheet -- leaves it alone and two owners never toggle one branch.











 // Prefer the helper Core published; an isolated bundle uses its own copy.

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default()); // From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8,
// §11): the settings are attributes and properties made by
// core/js/element-manifest.js, the button's word is lang/<locale>.json, the
// actions answer outcomes, and the old event names sf-menu:navigate and
// sf-menu:toggle are dated aliases of sf-menu-navigate and sf-menu-toggle.


const MenuElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__
}); // open('catalog') and open({id: 'catalog'}) both name an item (§4.4).

const itemArgument = value => value && typeof value === 'object' ? value.id : value;

class SfSmartMenu extends MenuElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      items: {
        default: []
      },
      orientation: {
        default: 'vertical',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_6__.MENU_ORIENTATIONS
      },
      appearance: {
        default: 'default',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_6__.MENU_APPEARANCES
      },
      current: {
        default: ''
      },
      currentFromLocation: {
        attribute: 'current-from-location',
        type: Boolean,
        default: false
      },
      collapse: {
        default: 'auto',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_6__.MENU_COLLAPSE
      },
      label: {
        default: ''
      },
      toggleLabel: {
        attribute: 'toggle-label',
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super(); // undefined: follow the attribute. Set by the property; an attribute
    // written later takes over again.

    this._items = undefined;
    this._childItems = [];
    this._childLabel = ''; // What the person or the host opened and closed, by item id, over the
    // open flag each item carries.

    this._openState = new Map();
    this._panelOpen = false; // A row that did not fit, and the width it needed: it comes back as a row
    // only when that width is there again, so it never flickers between both.

    this._autoCollapsed = false;
    this._neededWidth = 0;
    this._mode = '';
    this._domIds = new Map();
    this._anchors = new Map();
    this._holding = false;
    this._escapeTaken = false; // A value set as a property before the element was defined is an own
    // property that would hide the accessor; it is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'items')) {
      const early = this.items;
      delete this.items;
      this._items = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.normaliseItems)(early);
    }

    this.addEventListener('click', this.onClick);
    this.addEventListener('focusin', this.onFocusChange);
    this.addEventListener('focusout', this.onFocusOut);
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'items' && previous !== next) {
      this._items = undefined;
      this._autoCollapsed = false;
    }

    super.attributeChangedCallback(name, previous, next);
  } // A list written inside the element is the menu too: a <ul> (or a <nav>
  // holding one) of <li> with a link and, for a branch, a nested <ul>. Read
  // once, as slots are, and taken out of the light DOM; without the script it
  // stays a working list of links.


  captureSlotTemplates() {
    const first = !this._slotTemplatesCaptured;
    super.captureSlotTemplates();
    if (!first) return; // Static markup is a picture of the menu, not its items (§5.4).

    const children = Array.from(this.children).filter(child => !child.hasAttribute('data-sf-static'));
    const nav = children.find(child => child.localName === 'nav');
    const list = children.find(child => child.localName === 'ul') || nav?.querySelector(':scope > ul');
    if (!list) return;
    this._childItems = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.normaliseItems)((0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.itemsFromList)(list));
    this._childLabel = nav?.getAttribute('aria-label') || list.getAttribute('aria-label') || '';
    (list.parentElement === nav ? nav : list).remove();
  }

  onConnected() {
    this._onLocation = () => {
      if (this.currentFromLocation) this.requestComponentUpdate('location');
    };

    window.addEventListener('popstate', this._onLocation);
    window.addEventListener('hashchange', this._onLocation);
  }

  onDisconnected() {
    super.onDisconnected();
    window.removeEventListener('popstate', this._onLocation);
    window.removeEventListener('hashchange', this._onLocation);
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._observed = null;

    for (const submenu of [...this._anchors.keys()]) this.releaseAnchor(submenu);

    this.holdSurface(false);
  } // The items, from the property or the attribute, else from the markup.


  get items() {
    if (this._items !== undefined) return this._items;
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.normaliseItems)(this.getAttribute('items'));
  }

  set items(next) {
    this._items = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.normaliseItems)(next);
    this._autoCollapsed = false;
    this.requestComponentUpdate('items');
  }

  get menuItems() {
    const items = this.items;
    return items.length ? items : this._childItems;
  } // orientation, appearance, collapse, current-from-location and the words are
  // the manifest's accessors (attribute and property).
  // The documentation tree and the compact rail are columns.


  get horizontal() {
    return this.orientation === 'horizontal' && this.appearance === 'default';
  } // The row became a button that opens the same links as a column.


  get collapsed() {
    if (this.collapse === 'always') return true;
    return this.collapse === 'auto' && this.horizontal && this._autoCollapsed;
  } // Branches open as panels beside the row: a row that is shown as a row.


  get flyouts() {
    return this.horizontal && !this.collapsed;
  }

  get panelOpen() {
    return this.collapsed && this._panelOpen;
  } // The id of the item that is the current page, or null.


  get currentId() {
    const here = globalThis.location;
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.currentItemId)(this.menuItems, {
      current: this.getProp('current'),
      pathname: here?.pathname || '',
      base: here?.href || '',
      fromLocation: this.currentFromLocation
    });
  } // The ids of the open branches, outermost first.


  get openIds() {
    this.syncMode();
    return [...(0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.openBranches)(this.menuItems, this._openState, this.currentId, !this.flyouts)];
  }

  isOpen(id) {
    return this.openIds.includes(String(id));
  }

  item(id) {
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.findItem)(this.menuItems, id);
  } // The actions open, close and toggle {id} and close-all (§4.4): each
  // answers an outcome, applied or refused with a reason.


  open(id) {
    return this.setOpen(itemArgument(id), true, 'method');
  }

  close(id) {
    return this.setOpen(itemArgument(id), false, 'method');
  }

  toggle(id) {
    const key = itemArgument(id);
    return this.setOpen(key, !this.isOpen(key), 'method');
  } // Closes every open panel of a row and the panel of a collapsed menu; the
  // groups of a column keep their state.


  closeAll() {
    const flyouts = this.flyouts ? this.closeFlyouts('method') : false;
    const panel = this.setPanelOpen(false, 'method');
    return flyouts || panel ? {
      outcome: 'applied'
    } : {
      outcome: 'refused',
      reason: 'already'
    };
  } // A row's open panels are one chain: opening a branch closes every panel
  // that is not above it, closing one closes the panels inside it. A column's
  // groups open and close each on its own. A disabled branch is not opened or
  // closed by the person. Answers an outcome: applied, or refused with
  // unknown (no such branch), compact (no groups), disabled or already.


  setOpen(id, open, source = 'method') {
    const item = this.item(id);
    if (!item || !item.children.length) return {
      outcome: 'refused',
      reason: 'unknown'
    };
    if (this.appearance === 'compact') return {
      outcome: 'refused',
      reason: 'compact'
    };
    if (item.disabled && source === 'user') return {
      outcome: 'refused',
      reason: 'disabled'
    };
    const before = new Set(this.openIds);
    if (before.has(item.id) === Boolean(open)) return {
      outcome: 'refused',
      reason: 'already'
    };
    const after = new Set(before);

    if (this.flyouts) {
      const above = new Set((0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.pathTo)(this.menuItems, item.id) || []);

      for (const other of before) if (!above.has(other)) after.delete(other);

      if (open) after.add(item.id);
    } else if (open) {
      after.add(item.id);
    } else {
      after.delete(item.id);
    }

    return this.applyOpen(before, after, source, item.id) ? {
      outcome: 'applied'
    } : {
      outcome: 'refused',
      reason: 'already'
    };
  }

  closeFlyouts(source) {
    const before = new Set(this.openIds);
    if (!before.size) return false;
    return this.applyOpen(before, new Set(), source, null);
  }

  applyOpen(before, after, source, asked) {
    const changed = [];
    (0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.walkItems)(this.menuItems, one => {
      if (one.children.length && before.has(one.id) !== after.has(one.id)) changed.push(one);
    });
    if (!changed.length) return false;

    for (const one of changed) this._openState.set(one.id, after.has(one.id));

    this.requestComponentUpdate('open'); // The branch asked for first, then the ones it closed, innermost first.

    const depth = one => ((0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.pathTo)(this.menuItems, one.id) || []).length;

    changed.sort((a, b) => a.id === asked ? -1 : b.id === asked ? 1 : depth(b) - depth(a)); // sf-menu-toggle, then its old name sf-menu:toggle with the same detail
    // (aliases.json, until 2026-12-01).

    for (const one of changed) {
      this.sfEmit('toggle', {
        id: one.id,
        open: after.has(one.id),
        source,
        item: one
      });
    }

    return true;
  } // The panel of a menu shown as a button. Its event names no item: id null.


  setPanelOpen(open, source = 'method') {
    if (!this.collapsed || this._panelOpen === Boolean(open)) return false;
    this._panelOpen = Boolean(open);
    this.requestComponentUpdate('panel');
    this.sfEmit('toggle', {
      id: null,
      open: this._panelOpen,
      source,
      item: null
    });
    return true;
  } // A change between a row, a column and a button starts from closed panels:
  // a panel opened beside a row is not a group to keep open in a column.


  syncMode() {
    const mode = this.collapsed ? 'collapsed' : this.flyouts ? 'row' : 'column';
    if (mode === this._mode) return;

    if (this._mode) {
      this._openState.clear();

      this._panelOpen = false;
    }

    this._mode = mode;
  } // A stable element id for each item, whatever its own id holds.


  domId(id) {
    if (!this._domIds.has(id)) this._domIds.set(id, this._domIds.size + 1);
    return this._domIds.get(id);
  }

  ownControl(target, selector) {
    const control = target?.closest?.(selector);
    return control && control.closest('sf-menu') === this ? control : null;
  }

  rowItem(control) {
    return this.item(control?.closest('[data-sf-menu-item]')?.dataset.sfMenuItem);
  }

  onClick = event => {
    const panelToggle = this.ownControl(event.target, '[data-sf-menu-panel-toggle]');

    if (panelToggle) {
      this.setPanelOpen(!this._panelOpen, 'user');
      return;
    }

    const toggle = this.ownControl(event.target, '[data-sf-menu-toggle]');

    if (toggle) {
      if (!toggle.disabled) this.setOpen(toggle.dataset.sfMenuToggle, !this.isOpen(toggle.dataset.sfMenuToggle), 'user');
      return;
    }

    const link = this.ownControl(event.target, 'a[data-sf-menu-link]');
    if (link) this.onNavigate(event, link);
  }; // A link's own press: a cancellable sf-menu-navigate first (and its old name
  // sf-menu:navigate, one cancel for both), so a host that routes the page
  // itself prevents it and the browser does not go. A press that opens
  // another tab or window is the browser's alone.

  onNavigate(event, link) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if ((link.getAttribute('target') || '_self') !== '_self') return;
    const item = this.item(link.dataset.sfMenuLink);
    if (!item) return;
    const allowed = this.sfEmit('navigate', {
      id: item.id,
      href: item.href,
      item
    });
    if (!allowed) event.preventDefault(); // Gone to the page: nothing stays open over it.

    if (this.flyouts) this.closeFlyouts('user');
    this.setPanelOpen(false, 'user');
  }

  onFocusChange = () => {
    this.syncSurface();
  }; // Focus that leaves the element closes a row's panels (WAI-ARIA disclosure
  // navigation); focus that leaves the page keeps them.

  onFocusOut = event => {
    const next = event.relatedTarget;
    if (next instanceof Node && !this.contains(next) && this.flyouts) this.closeFlyouts('user');
    queueMicrotask(() => this.syncSurface());
  }; // A row's open panel is a surface over the page; the panel of a button is
  // one while the focus is in it. Either holds the shared open-surface mark,
  // so a drawer or a modal behind it stands back on Escape, and takes Escape
  // only as the innermost open layer.

  syncSurface() {
    const flyoutOpen = this.flyouts && this.openIds.length > 0;
    const panel = this.panelOpen && this.contains(document.activeElement);
    this.holdSurface(this.isConnected && (flyoutOpen || panel || this._escapeTaken));
  }

  holdSurface(hold) {
    if (hold === this._holding) return;
    this._holding = hold;
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.holdOpenSurfaceMark)(this, hold);

    if (hold) {
      document.addEventListener('keydown', this.onDocumentKeydown, true);
      document.addEventListener('pointerdown', this.onDocumentPointerDown, true);
    } else {
      document.removeEventListener('keydown', this.onDocumentKeydown, true);
      document.removeEventListener('pointerdown', this.onDocumentPointerDown, true);
    }
  } // Escape closes the innermost open panel only -- the deepest open panel of
  // a row, the one the focus is in first, else the panel of the button -- and
  // gives the focus back to the button that opened it.


  onDocumentKeydown = event => {
    if (event.key !== 'Escape' || event.defaultPrevented || !(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.isTopOpenSurface)(this)) return; // The mark stays up until the press has reached every listener: the
    // re-render after closing runs between two of them, and a drawer reading
    // only the mark would otherwise close on the press that closed the panel.

    this._escapeTaken = true;
    setTimeout(() => {
      this._escapeTaken = false;
      this.syncSurface();
    });
    const innermost = this.innermostOpen();

    if (innermost) {
      event.preventDefault();
      event.stopPropagation();
      this.setOpen(innermost.id, false, 'user');
      this.focusAfterRender(`[data-sf-menu-toggle="${CSS.escape(innermost.id)}"]`);
      return;
    }

    if (this.panelOpen) {
      event.preventDefault();
      event.stopPropagation();
      this.setPanelOpen(false, 'user');
      this.focusAfterRender('[data-sf-menu-panel-toggle]');
    }
  };
  onDocumentPointerDown = event => {
    if ((event.composedPath?.() ?? []).includes(this)) return;
    if (this.flyouts) this.closeFlyouts('user');
  };

  innermostOpen() {
    if (!this.flyouts) return null;
    const open = new Set(this.openIds);
    if (!open.size) return null;

    const depth = id => ((0,_items_mjs__WEBPACK_IMPORTED_MODULE_6__.pathTo)(this.menuItems, id) || []).length;

    const focused = document.activeElement;
    const ids = [...open].sort((a, b) => depth(b) - depth(a));
    const withFocus = ids.find(id => this.querySelector(`[data-sf-menu-item="${CSS.escape(id)}"]`)?.contains(focused)); // The deepest open panel the focus is in or under, else the deepest.

    const deepest = ids[0];
    const chosen = withFocus && depth(withFocus) >= depth(deepest) ? withFocus : deepest;
    return this.item(chosen);
  }

  focusAfterRender(selector) {
    this.whenRendered(() => this.querySelector(selector)?.focus(), {
      next: true
    });
  }

  focusDelegate() {
    return this.querySelector('[data-sf-menu-panel-toggle], a[href], button:not(:disabled)');
  } // A row's panels are placed by the Framework's geometry, as the class menu
  // places them: the first level below its item, deeper ones to the inline
  // end; both flip and shift inside the viewport instead of overflowing it.


  syncAnchors() {
    const wanted = new Set();

    if (this.flyouts) {
      for (const id of this.openIds) {
        const row = this.querySelector(`[data-sf-menu-item="${CSS.escape(id)}"]`);
        const submenu = row?.querySelector(':scope > ul.sf-menu');
        if (!submenu || submenu.hidden) continue;
        wanted.add(submenu);

        const current = this._anchors.get(submenu);

        if (current) {
          current.anchor.update();
          continue;
        }

        const saved = ['min-width', 'overflow-y'].map(name => [name, submenu.style.getPropertyValue(name), submenu.style.getPropertyPriority(name)]); // min-inline-size: 100% would resolve against the viewport once fixed.

        submenu.style.minWidth = `${row.getBoundingClientRect().width}px`;
        submenu.style.overflowY = 'auto';
        const anchor = positioning().anchor(row, submenu, {
          side: row.dataset.sfMenuLevel === '1' ? 'block-end' : 'inline-end',
          align: 'start',
          offset: 0,
          fitHeight: true
        });

        this._anchors.set(submenu, {
          anchor,
          saved
        });
      }
    }

    for (const submenu of [...this._anchors.keys()]) if (!wanted.has(submenu)) this.releaseAnchor(submenu);
  }

  releaseAnchor(submenu) {
    const current = this._anchors.get(submenu);

    if (!current) return;
    current.anchor.stop();

    for (const [name, value, priority] of current.saved) {
      if (value) submenu.style.setProperty(name, value, priority);else submenu.style.removeProperty(name);
    }

    this._anchors.delete(submenu);
  } // A row that does not fit the width it is given becomes the button; it is
  // a row again once the width it needed is there.


  observeWidth() {
    const nav = this.querySelector(':scope > nav.sf-smart-menu');
    if (!nav || typeof ResizeObserver === 'undefined') return;

    if (this._observed !== nav) {
      this._resizeObserver?.disconnect();
      this._resizeObserver = new ResizeObserver(() => this.measureFit());

      this._resizeObserver.observe(nav);

      this._observed = nav;
    }

    this.measureFit();
  }

  measureFit() {
    const nav = this._observed;
    if (!nav?.isConnected) return;

    if (this.collapse !== 'auto' || !this.horizontal) {
      if (this._autoCollapsed) {
        this._autoCollapsed = false;
        this.requestComponentUpdate('collapse');
      }

      return;
    }

    const width = nav.clientWidth;

    if (!this._autoCollapsed) {
      const list = nav.querySelector(':scope > ul.sf-menu');
      const needed = list ? list.scrollWidth : 0;

      if (needed > width + 1) {
        this._neededWidth = needed;
        this._autoCollapsed = true;
        this.requestComponentUpdate('collapse');
      }
    } else if (width >= this._neededWidth) {
      this._autoCollapsed = false;
      this.requestComponentUpdate('collapse');
    }
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this.syncAnchors();
    this.observeWidth();
    this.syncSurface();
    return undefined;
  }

  templateContext() {
    const props = this.getPropsContext();
    this.syncMode();
    const items = this.menuItems;
    return this.createTemplateContext({ ...props,
      component: this,
      // The host's path id (§7.1.1, simai/ui-source#41): <path>--list and
      // <path>--menu-<n>, n the item's place in this element's own map.
      id: (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
        kind: 'sf-menu'
      })),
      items,
      open: new Set(this.openIds),
      currentId: this.currentId,
      flyouts: this.flyouts,
      collapsed: this.collapsed,
      panelOpen: this.panelOpen,
      compact: this.appearance === 'compact',
      appearance: this.appearance,
      label: this.getAttribute('aria-label') || this.getProp('label') || this._childLabel,
      toggleLabel: this.getAttribute('toggle-label') || this.sfWord('toggle-label'),
      domId: id => this.domId(id),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderMenuTemplate)(this.templateContext());
  }

}

SfSmartMenu.define('sf-menu');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e29406217b0b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderMenuTemplate: () => (/* binding */ renderMenuTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d9131aa10ba");
/* harmony import */ var _items_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7332c9a6d69c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);




function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // The class menu's level classes: four levels, a deeper one drawn as the
// fourth.


const levelClass = level => `sf-menu-element--level-${Math.min(Math.max(level, 1), _items_mjs__WEBPACK_IMPORTED_MODULE_2__.LEVEL_LIMIT)}`; // The glyph the class runtime writes on a branch: a top-level panel of a row
// opens below it (down, up when open), every other branch opens to its inline
// end (right, down when open; mirrored in RTL by the class sheet).


function branchGlyph(context, level, open) {
  if (context.flyouts && level === 1) return open ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  return open ? 'keyboard_arrow_down' : 'chevron_right';
} // A count is the class counter: a .sf-badge with data-count, which the badges
// runtime caps at 99+, hides at 0 and names after the label. Any other badge
// is a short label in the same place.


function renderBadge(item) {
  if (!item.badge) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const count = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_2__.badgeCount)(item.badge);
  return count !== null ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-badge" data-count=${count}></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-badge">${item.badge}</span>`;
} // What a row holds, in the class order: an icon, the words, a counter.


function renderWrapContent(item) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${item.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-menu-element-icon" aria-hidden="true">${item.icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-menu-element-text">${item.label}</span>${renderBadge(item)}`;
}

const renderWrap = item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-menu-element-wrap">${renderWrapContent(item)}</span>`; // The branch's disclosure glyph as the class draws it inside a button row: an
// icon-button box hidden from assistive technology, the button being the row.


const renderTrailing = glyph => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon-button" aria-hidden="true"><span class="sf-icon" aria-hidden="true">${glyph}</span></span>`;

function renderRow(context, item, level, branch, open, submenuId) {
  const current = context.currentId === item.id;
  const classes = joinClasses('sf-menu-element', levelClass(level), branch ? 'sf-menu-element--has-submenu' : '', open ? 'open' : '', item.disabled ? 'disabled' : '');
  const linked = Boolean(item.href) && !item.disabled;

  if (!branch) {
    // A destination is a link; an unavailable one keeps its place as a link
    // without an address, out of the tab order. A row without an address is
    // words in the row's place.
    if (linked) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${item.href} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                     data-sf-menu-link=${item.id}>${renderWrap(item)}</a>`;
    }

    if (item.disabled) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} aria-disabled="true">${renderWrap(item)}</a>`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${renderWrap(item)}</span>`;
  }

  const glyph = branchGlyph(context, level, open); // A branch that is also a destination: the link and the disclosure button
  // are siblings inside the row, as the class menu documents.

  if (item.href) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes}>
      ${linked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-menu-element-wrap" href=${item.href} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  data-sf-menu-link=${item.id}>${renderWrapContent(item)}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-menu-element-wrap" aria-disabled="true">${renderWrapContent(item)}</a>`}
      <button class="sf-icon-button" type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${submenuId}
              aria-label=${item.label} ?disabled=${item.disabled}
              data-sf-menu-toggle=${item.id}><span class="sf-icon" aria-hidden="true">${glyph}</span></button>
    </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class=${classes} type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${submenuId}
                      ?disabled=${item.disabled} data-sf-menu-toggle=${item.id}>${renderWrap(item)}${renderTrailing(glyph)}</button>`;
}

function renderItem(context, item, level) {
  // A compact rail opens no branch: its rows are the first level alone.
  const branch = item.children.length > 0 && !context.compact;
  const open = branch && context.open.has(item.id);
  const submenuId = `${context.id}--menu-${context.domId(item.id)}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <li class=${joinClasses('sf-menu-item', branch ? 'sf-menu-item--has-submenu' : '', open ? 'open' : '')}
        data-sf-menu-item=${item.id} data-sf-menu-level=${level}>
      ${renderRow(context, item, level, branch, open, submenuId)}
      ${branch ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-menu" id=${submenuId} ?hidden=${!open}>${renderItems(context, item.children, level + 1)}</ul>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </li>
  `;
}

function renderItems(context, items, level) {
  return (0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(items, item => item.id, item => renderItem(context, item, level));
} // The button a row that does not fit becomes: a class menu row (a size 1
// control, as every row), the menu glyph and its words, the disclosure glyph
// at its end.


function renderPanelToggle(context) {
  const open = context.panelOpen;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class=${joinClasses('sf-menu-element', 'sf-menu-element--level-1', 'sf-menu-element--has-submenu', 'sf-smart-menu-toggle', open ? 'open' : '')}
                      type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${`${context.id}--list`}
                      data-sf-menu-panel-toggle>
    <span class="sf-menu-element-wrap"><i class="sf-icon sf-menu-element-icon" aria-hidden="true">menu</i><span class="sf-menu-element-text">${context.toggleLabel}</span></span>
    ${renderTrailing(open ? 'keyboard_arrow_up' : 'keyboard_arrow_down')}
  </button>`;
} // The class markup inside a named <nav>: ul.sf-menu > li.sf-menu-item > the
// row and the nested ul.sf-menu. The whole of it carries data-sf-menu-owned,
// so the class runtime, loaded beside it for the sheet, leaves it to the
// element.


function renderMenuTemplate(context) {
  const listClasses = joinClasses('sf-menu', context.flyouts ? 'sf-menu--horizontal' : '', context.appearance !== 'default' ? `sf-menu--${context.appearance}` : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <nav class=${joinClasses('sf-smart-menu', context.collapsed ? 'sf-smart-menu--collapsed' : '', context.rootClass)}
         style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         data-orientation=${context.flyouts ? 'horizontal' : 'vertical'}
         data-sf-menu-owned>
      ${context.collapsed ? renderPanelToggle(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <ul class=${listClasses} id=${`${context.id}--list`} ?hidden=${context.collapsed && !context.panelOpen}>
        ${renderItems(context, context.items, 1)}
      </ul>
    </nav>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "831ef45545b2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "0d9131aa10ba"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit/directives/repeat.js")), { once: true })));

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

/***/ "7332c9a6d69c"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LEVEL_LIMIT: () => (/* binding */ LEVEL_LIMIT),
/* harmony export */   MENU_APPEARANCES: () => (/* binding */ MENU_APPEARANCES),
/* harmony export */   MENU_COLLAPSE: () => (/* binding */ MENU_COLLAPSE),
/* harmony export */   MENU_ORIENTATIONS: () => (/* binding */ MENU_ORIENTATIONS),
/* harmony export */   badgeCount: () => (/* binding */ badgeCount),
/* harmony export */   currentItemId: () => (/* binding */ currentItemId),
/* harmony export */   findItem: () => (/* binding */ findItem),
/* harmony export */   itemsFromList: () => (/* binding */ itemsFromList),
/* harmony export */   normaliseItem: () => (/* binding */ normaliseItem),
/* harmony export */   normaliseItems: () => (/* binding */ normaliseItems),
/* harmony export */   normalisePath: () => (/* binding */ normalisePath),
/* harmony export */   openBranches: () => (/* binding */ openBranches),
/* harmony export */   pathTo: () => (/* binding */ pathTo),
/* harmony export */   walkItems: () => (/* binding */ walkItems)
/* harmony export */ });
// The parts of sf-menu that are about data, not the page: the shape an item
// takes, from the items a host gives or from the links written in the markup,
// which item is the current page, and which branches lead to it. Kept apart
// from the element so the contract tests can run them in Node, as
// sf-accordion's sections.mjs is.

// The class menu's orientations: a column for a side panel, a row for a page
// header (sf-menu--horizontal, the first level only).
const MENU_ORIENTATIONS = Object.freeze(['vertical', 'horizontal']);
// The class menu's presentations by name: default, the documentation tree
// (sf-menu--documentation-tree) and the compact rail (sf-menu--compact). The
// tree and the rail are columns: with them the menu is vertical.
const MENU_APPEARANCES = Object.freeze(['default', 'documentation-tree', 'compact']);
// When a row of links that does not fit becomes a button that opens them as a
// column: when it does not fit, always, or never.
const MENU_COLLAPSE = Object.freeze(['auto', 'always', 'none']);
// The class menu draws four levels; a deeper one is drawn as the fourth.
const LEVEL_LIMIT = 4;

const text = (value) => (value === null || value === undefined ? '' : String(value));

// One item, as the element draws it, with its children. `label` is text, never
// markup; `badge` is a count (drawn by the class counter: capped at 99+,
// hidden at 0, its phrase ends the link's name) or a short label.
function normaliseItem(item, index = 0, parentId = '', seen = new Set()) {
  if (typeof item === 'string') item = {label: item};
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
  const own = text(item.id ?? item.key).trim();
  const id = own || (parentId ? `${parentId}-${index + 1}` : `item-${index + 1}`);
  if (seen.has(id)) return null;
  seen.add(id);
  const children = [];
  (Array.isArray(item.children) ? item.children : []).forEach((child, at) => {
    const normalised = normaliseItem(child, at, id, seen);
    if (normalised) children.push(normalised);
  });
  return {
    id,
    label: text(item.label ?? item.text ?? item.title),
    href: text(item.href).trim(),
    icon: text(item.icon).trim(),
    badge: text(item.badge).trim(),
    current: Boolean(item.current),
    disabled: Boolean(item.disabled),
    open: Boolean(item.open),
    children,
  };
}

// The items from what a host gave: an array, or the same array as JSON in the
// `items` attribute. An item whose id repeats an earlier one, anywhere in the
// tree, is left out with its children, as one id must name one item.
function normaliseItems(items) {
  let list = items;
  if (typeof list === 'string') {
    const raw = list.trim();
    if (!raw) return [];
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const result = [];
  list.forEach((item, index) => {
    const normalised = normaliseItem(item, index, '', seen);
    if (normalised) result.push(normalised);
  });
  return result;
}

// A badge that is a whole number is a count; anything else is a label.
function badgeCount(badge) {
  return /^\d+$/u.test(text(badge).trim()) ? text(badge).trim() : null;
}

// Every item, depth first, with the ids of the branches above it.
function walkItems(items, visit, path = []) {
  for (const item of items) {
    visit(item, path);
    if (item.children.length) walkItems(item.children, visit, [...path, item.id]);
  }
}

function findItem(items, id) {
  let found = null;
  walkItems(items, (item) => {
    if (!found && item.id === String(id)) found = item;
  });
  return found;
}

// The ids of the branches above an item, outermost first; null when no item
// has that id.
function pathTo(items, id) {
  let found = null;
  walkItems(items, (item, path) => {
    if (!found && item.id === String(id)) found = path;
  });
  return found;
}

// A path as the menu compares it: no trailing slash but the root's, and no
// index document name.
function normalisePath(path) {
  let value = text(path).split(/[?#]/u)[0] || '/';
  value = value.replace(/\/index\.html?$/u, '/');
  if (value.length > 1) value = value.replace(/\/+$/u, '');
  return value || '/';
}

// The item that is the current page: the one the element's `current` names,
// else -- when the menu follows the location -- the item whose link leads to
// this path (the first, depth first), else the first item marked current.
// `base` resolves relative links, as the browser would.
function currentItemId(items, {current = '', pathname = '', base = '', fromLocation = false} = {}) {
  const named = text(current).trim();
  if (named && findItem(items, named)) return named;
  if (fromLocation && pathname) {
    const here = normalisePath(pathname);
    let found = null;
    walkItems(items, (item) => {
      if (found || !item.href || item.disabled) return;
      let target;
      try {
        target = new globalThis.URL(item.href, base || 'http://localhost/');
      } catch {
        return;
      }
      if (base && new globalThis.URL(base).origin !== target.origin) return;
      if (normalisePath(target.pathname) === here) found = item.id;
    });
    if (found) return found;
  }
  let flagged = null;
  walkItems(items, (item) => {
    if (!flagged && item.current) flagged = item.id;
  });
  return flagged;
}

// Which branches are open: what the person or the host set, else -- in a
// column -- what the item says, and the branches above the current page, so
// it can be seen. A row's panels open only when asked: none is open when the
// page starts.
function openBranches(items, overrides = new Map(), currentId = null, inColumn = true) {
  const reveal = new Set(inColumn && currentId ? pathTo(items, currentId) || [] : []);
  const open = new Set();
  walkItems(items, (item) => {
    if (!item.children.length) return;
    const fallback = inColumn && (item.open || reveal.has(item.id));
    const state = overrides.has(item.id) ? overrides.get(item.id) : fallback;
    if (state) open.add(item.id);
  });
  return open;
}

// A list written in the markup, read as items: each <li> is an item, its
// direct <a> the link (href, aria-current, the label from its words), its
// direct <ul> the children. data-id (or id), data-icon, data-badge,
// data-open and data-disabled give the other fields; a row the class menu has
// already drawn is read too (its .sf-menu-element-icon, .sf-menu-element-text
// and counter). Icon glyphs, counters and what is hidden from assistive
// technology are not words of the label. Works on any DOM-like node with
// children, childNodes and attributes.
const NOT_WORDS = /(?:^|\s)(?:sf-icon|sf-icon-button|sf-badge|sf-badge-anchored-text)(?:\s|$)/u;

function wordsOf(node) {
  if (!node) return '';
  if (node.nodeType === 3) return text(node.textContent);
  if (node.nodeType !== 1) return '';
  if (node.localName === 'ul' || NOT_WORDS.test(text(node.getAttribute?.('class')))
    || node.getAttribute?.('aria-hidden') === 'true') return '';
  return Array.from(node.childNodes || []).map(wordsOf).join(' ');
}

const squeeze = (value) => text(value).replace(/\s+/gu, ' ').trim();

function itemsFromList(list) {
  if (!list) return [];
  const own = (node, name) => Array.from(node.children || []).find((child) => child.localName === name) || null;
  const attr = (node, name) => (node?.getAttribute ? node.getAttribute(name) : null);
  const has = (node, name) => Boolean(node?.hasAttribute?.(name));
  const find = (node, selector) => node?.querySelector?.(selector) || null;
  return Array.from(list.children || [])
    .filter((child) => child.localName === 'li')
    .map((li) => {
      const link = own(li, 'a') || find(li, ':scope > .sf-menu-element > a[href]');
      const row = link || find(li, ':scope > .sf-menu-element') || li;
      const nested = own(li, 'ul');
      const currentAttr = attr(link, 'aria-current');
      const drawnText = find(row, '.sf-menu-element-text');
      const drawnIcon = find(row, '.sf-menu-element-icon');
      const drawnCount = find(row, '.sf-badge[data-count]');
      return {
        id: attr(li, 'data-id') || attr(link, 'data-id') || attr(li, 'id') || undefined,
        label: squeeze(drawnText ? drawnText.textContent : wordsOf(row)),
        href: link ? attr(link, 'href') || '' : '',
        icon: attr(li, 'data-icon') || attr(link, 'data-icon') || squeeze(drawnIcon?.textContent),
        badge: attr(li, 'data-badge') || attr(link, 'data-badge') || attr(drawnCount, 'data-count') || '',
        current: (currentAttr !== null && currentAttr !== 'false') || has(li, 'data-current'),
        disabled: has(li, 'data-disabled') || has(li, 'disabled') || attr(link, 'aria-disabled') === 'true',
        open: has(li, 'data-open') || Boolean(li.classList?.contains?.('open')),
        children: nested ? itemsFromList(nested) : [],
      };
    });
}


/***/ },

/***/ "97168578e30d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-menu for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-menu","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-menu:navigate","to":"sf-menu-navigate","kind":"event","component":"sf-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":true,"section":"§8, §16 item 6, vocabulary §5.1","note":"{id, href, item} is data only; one cancel for both names"},{"from":"sf-menu:toggle","to":"sf-menu-toggle","kind":"event","component":"sf-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 6","note":"{id, open, source, item} is data only"}]}');

/***/ },

/***/ "e0fa46ed075f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-menu\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/menu (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.menu","tag":"sf-menu","version":"1.1.1","kind":"leaf","family":"menu","settings":{"items":{"type":"list","default":[],"of":{"id":"id","label":"string","href":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"badge":{"type":"string","optional":true},"current":{"type":"boolean","optional":true},"disabled":{"type":"boolean","optional":true},"open":{"type":"boolean","optional":true},"children":{"type":"list","optional":true}},"x-markup":"the attribute takes the same list as JSON; without it a nested <ul><li><a> written inside is the menu; children has the same shape"},"orientation":{"type":"enum","values":["vertical","horizontal"],"default":"vertical"},"appearance":{"type":"enum","values":["default","documentation-tree","compact"],"default":"default"},"current-from-location":{"type":"boolean","default":false},"collapse":{"type":"enum","values":["auto","always","none"],"default":"auto"},"label":{"type":"string","default":""},"toggle-label":{"type":"string","default-from":"runtime.toggle-label"}},"values":{"current":{"type":"string","default":"","summary":"the id of the current page\'s item; with current-from-location the location decides"}},"events":{"navigate":{"carries":{"id":"id","href":"string","item":"object"},"cancelable":true},"toggle":{"carries":{"id":{"type":"id","nullable":true},"open":"boolean","source":{"type":"enum","values":["user","method"]},"item":{"type":"object","nullable":true}}}},"actions":{"open":{"with":{"id":"id"},"x-outcomes":["applied","refused"]},"close":{"with":{"id":"id"},"x-outcomes":["applied","refused"]},"toggle":{"with":{"id":"id"},"x-outcomes":["applied","refused"]},"close-all":{"x-outcomes":["applied","refused"]}},"keyboard":{"host":{"Tab":"reach","Enter":"select","Space":"select"},"panel":{"Escape":"close"}},"templates":{"default":{"file":"js/templates/default.js","$comment":"The Lit template in JavaScript, the migration form of §5.2 (§16)."}},"presentation":{"skeleton":{"$comment":"The items arrive after the first paint when the host loads them: the derived skeleton (static/default/<example>.skeleton.html) holds their box until they do (standard 1.3.8 §5.4).","late":["items"]}},"examples":"examples.json","docs":"docs.md","lang":"lang/","accessibility":{"role":"navigation","name":{"from":["aria-label","label","slot:nav[aria-label]"]},"keys":{"Tab":"reach","Enter":"select","Space":"select","Escape":{"effect":"close","when":[{"orientation":"horizontal","appearance":"default"},{"collapse":"always"}],"x-when":"any of: a row\'s open panel, or the panel of the menu drawn as a button; a column\'s groups are no surface and keep Escape for the page"}}},"css-variables":{"--sf-menu-background-color":{"type":"color","state":"default"},"--sf-menu-gap":{"type":"length","state":"default"},"--sf-menu-item-color":{"type":"color","state":"default"},"--sf-menu-item-background-color":{"type":"color","state":"default"},"--sf-menu-item-border-color":{"type":"color","state":"default"},"--sf-menu-item-radius":{"type":"length","state":"default"},"--sf-menu-submenu-background-color":{"type":"color","state":"open"},"--sf-menu-submenu-border-color":{"type":"color","state":"open"},"--sf-menu-submenu-radius":{"type":"length","state":"open"}},"x-summary":"Site navigation built from data -- nested sections, the current page, groups that open and close -- or from a nested list of links in the markup, drawn as the class menu: a column whose branches open in place, or a row whose branches open as panels placed by SF.Position, which becomes a button opening the same links when it does not fit. The WAI-ARIA disclosure navigation pattern, not an application menu.","x-source":{"package":"framework","folder":"menu","manifest":"simai/ui-source@5100227 src/smart/menu/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/menu.component.json"},"x-words":["label","toggle-label"],"x-renamed":["events.sf-menu:navigate → navigate: vocabulary §5 navigate, the DOM name sf-menu-navigate; the colon name a dated same-detail alias","events.sf-menu:toggle → toggle: the DOM name sf-menu-toggle (§8, §16 item 6); the colon name a dated same-detail alias"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"host","effects":"component","forbidden_client_responsibilities":["backend access decisions","parsing item text as markup","routing the page"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile","ltr","rtl"]},"ai_guidance":{"use_when":"Use sf-menu for site, section or cabinet navigation that comes from data or from a nested list of links: a header row, a side panel, a documentation tree.","do_not":["Do not copy generated ui-smart code","Do not use it for actions on a selected object: that is sf-context-menu","Do not add role=menu: it is navigation, a list of links","Do not put markup in label: it is shown as text","Do not restyle its rows: they are the class menu\'s, set its public variables","Do not use sf-admin-menu for site navigation: it is the Pro admin menu"],"required_reads":["inputs","item_contract","events","methods","accessibility","provenance"],"minimal_example":"<sf-menu label=\\"Разделы\\" orientation=\\"horizontal\\" items=\'[{\\"id\\":\\"about\\",\\"label\\":\\"О компании\\",\\"href\\":\\"/about/\\"},{\\"id\\":\\"catalog\\",\\"label\\":\\"Каталог\\",\\"children\\":[{\\"id\\":\\"solutions\\",\\"label\\":\\"Решения\\",\\"href\\":\\"/catalog/solutions/\\"}]}]\'></sf-menu>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["version: 1.0.0 → 1.1.0, a minor while sf-menu:navigate and sf-menu:toggle hold dated aliases (§4.10).","events: sf-menu:navigate → sf-menu-navigate (vocabulary §5 navigate {id, href}) and sf-menu:toggle → sf-menu-toggle, by the alias table; their details hold data only (item is the menu\'s own entry, never an element), so both rows are same-detail, and navigate\'s cancel is shared: a page that refuses either name keeps the browser where it is.","toggle reports a person (source user) and a call (source method), as before: it is a branch\'s fact, not `change` (§8). The panel of the menu drawn as a button reports id null and item null.","actions: open, close and toggle {id} and close-all answer an outcome (applied; refused unknown, compact, disabled, already) instead of true/false (§4.4).","keyboard (simai/ui-source#44 item 2): Escape is declared where it acts -- on a panel (keyboard.panel), and in accessibility.keys with `when`, any of a row\'s layout (orientation horizontal, appearance default) or the menu drawn as a button (collapse always; collapse auto draws one only from a row). A column\'s groups are no surface, so Escape stays the page\'s there, as the browser probe has asserted since the menu shipped.","key-effects: links and branch buttons are native: Tab reaches them, Enter follows a link or toggles a branch, Space toggles a branch (select); no arrow keys -- the WAI-ARIA disclosure navigation pattern, not an application menu.","a11y-name: aria-label on the host, then label, then the aria-label of a <nav> or <ul> written inside.","instance ids (§7.1.1, simai/ui-source#41): the list and panel ids came from a module counter (sf-smart-menu-<n>); they are the host\'s path id and a local name now, <path>--list and <path>--menu-<n>, n the item\'s place in this element\'s own map; the class menu\'s submenu ids are its path id and --submenu.","item-shape: items name their fields with `of` (id, label, href, icon, badge, current, disabled, open, children); label is text, never markup.","template: templates.default names the Lit template js/templates/default.js, the migration form §5.2 allows.","examples: examples.json from studio.fixture.json and studio.scenario.json plus a row, the documentation tree and the menu drawn as a button; probe.json drives Tab, Enter, Space and Escape in a row and in a column (gate 16).","css-variables: the nine public variables the sheet already reads (src/core/contracts/public-variables.v1.json).","layer: none declared. A row\'s open panel and the button\'s panel hold the shared open-surface mark (core/js/open-surface-mark), so a drawer or modal behind stands back on Escape; they are placed by SF.Position in place, not moved to the end of body (side-effects: none).","version 1.1.1: the first-paint snapshots are retaken: the JSON island is printed once (no held copy), the icon font\'s state (sf-icon loaded, sf-icon-loaded) is left out, a closed surface prints closed and a size or place the code measured (a non-zero px width, height, inset, clip or transform) is left out, so a snapshot is the same on every run."]}');

/***/ },

/***/ "33262fd5308c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Menu","runtime":{"toggle-label":"Menu"}}');

/***/ },

/***/ "15d5a97ca4e8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Меню","runtime":{"toggle-label":"Меню"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("3267d93fb0d3");
/******/
/******/ })()
;