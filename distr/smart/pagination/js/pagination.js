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

/***/ "403726af3b51"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a57d260bd333");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("344edfee8242");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("90fab10c70dd");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38d83a636029");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("96e8b718b20a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);






 // sf-pagination from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §11): its settings are attributes and properties made by
// core/js/element-manifest.js, every word it says is lang/<locale>.json (an
// English page used to read «Всего:» under a list that had switched, owner
// 2026-10-10), and its events take the vocabulary's names; the old ones --
// sf-page-change, sf-show-more, … -- follow with their old detail until
// 2026-12-01 (aliases.json).
//
// Its words had camelCase keys before the language files (totalLabel, …); a
// product that registered its own words under them through
// SF.language.register keeps them until 2026-12-01, each old key noted once
// in SF.deprecations (change journal option-pagination-word-keys-camel-to-kebab).

const camelKey = key => String(key).replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());

const PaginationElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__,
  formerWords: {
    since: "2026-10-27",
    remove_after: "2026-12-01",
    words: Object.fromEntries(Object.keys(_lang_en_json__WEBPACK_IMPORTED_MODULE_5__.runtime).map(key => [key, camelKey(key)]))
  }
}); // A word's key in the language files: pagesLabel → pages-label.

const wordKey = key => String(key).replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`); // An old event's detail (§16.20 split rows): the camelCase fields it had.


const camelDetail = detail => Object.fromEntries(Object.entries(detail).map(([key, value]) => [key.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase()), value]));

function parsePageSizes(value, fallback = [10, 20, 30, 40]) {
  const valid = size => Number.isInteger(size) && size > 0;

  if (Array.isArray(value)) {
    const sizes = value.map(Number).filter(valid);
    return sizes.length ? sizes : fallback;
  } // An absent attribute used to answer with a single size of zero rather than
  // the default: splitting "" yields one empty segment, Number("") is 0, and 0
  // is finite, so the list was never empty and the fallback was never reached.
  // A page size has to be a positive whole number, which is also what rules out
  // "20.5" and "-1".


  const parsed = String(value ?? "").split(",").map(item => item.trim()).filter(item => item !== "").map(Number).filter(valid);
  return parsed.length ? parsed : fallback;
}

function parseActions(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  const parsed = String(value || "").split("|").map(entry => entry.trim()).filter(Boolean).map(entry => {
    const [valueTextPart, flagsPart = ""] = entry.split("::");
    const [rawValue, ...rawText] = valueTextPart.split(":");
    const value = String(rawValue || "").trim();
    const text = rawText.join(":").trim() || value;
    const flags = flagsPart.split(",").map(flag => flag.trim().toLowerCase()).filter(Boolean);
    return {
      value,
      text,
      disabled: flags.includes("disabled"),
      selected: flags.includes("selected")
    };
  }).filter(item => item.value || item.text).map((item, index) => ({ ...item,
    value: item.value || `action-${index + 1}`
  }));
  return parsed.length ? parsed : fallback;
} // The boolean settings that are on by default (component.json).


const DEFAULT_ON = new Set(Object.entries(_component_json__WEBPACK_IMPORTED_MODULE_3__.settings).filter(([, spec]) => spec.type === "boolean" && spec.default === true).map(([name]) => name));

class SfPagination extends PaginationElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      },
      // The step of the size ladder its controls and labels take: 1, or the
      // dense 1/2 of an admin, where a page row stands beside 32px controls.
      size: {
        default: "1",
        values: ["1/2", "1"]
      },
      top: {
        type: Boolean,
        default: true
      },
      middle: {
        type: Boolean,
        default: true
      },
      bottom: {
        type: Boolean,
        default: true
      },
      topClass: {
        default: ""
      },
      mainClass: {
        default: ""
      },
      bottomClass: {
        default: ""
      },
      ariaLabel: {
        attribute: "aria-label",
        default: ""
      },
      pagesLabel: {
        attribute: "pages-label",
        default: ""
      },
      pageLabel: {
        attribute: "page-label",
        default: ""
      },
      previousLabel: {
        attribute: "previous-label",
        default: ""
      },
      nextLabel: {
        attribute: "next-label",
        default: ""
      },
      lastLabel: {
        attribute: "last-label",
        default: ""
      },
      firstLabel: {
        attribute: "first-label",
        default: ""
      },
      pageFieldLabel: {
        attribute: "page-field-label",
        default: ""
      },
      totalLabel: {
        attribute: "total-label",
        default: ""
      },
      selectedLabel: {
        attribute: "selected-label",
        default: ""
      },
      selectedCount: {
        attribute: "selected-count",
        type: Number,
        default: 0
      },
      showMoreText: {
        attribute: "show-more-text",
        default: ""
      },
      countKnown: {
        attribute: "count-known",
        type: Boolean,
        default: true
      },
      totalExact: {
        attribute: "total-exact",
        type: Boolean,
        default: true
      },
      canCount: {
        attribute: "can-count",
        type: Boolean,
        default: false
      },
      counting: {
        type: Boolean,
        default: false
      },
      hasNextPage: {
        attribute: "has-next",
        type: Boolean,
        default: false
      },
      showCountLabel: {
        attribute: "show-count-label",
        default: ""
      },
      countingLabel: {
        attribute: "counting-label",
        default: ""
      },
      showMoreBusy: {
        attribute: "show-more-busy",
        type: Boolean,
        default: false
      },
      current: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        default: 10
      },
      pageSize: {
        attribute: "page-size",
        type: Number,
        default: 10
      },
      pageSizes: {
        attribute: "page-sizes",
        default: [10, 20, 30, 40],

        parser(value, defaultValue) {
          return parsePageSizes(value, defaultValue);
        }

      },
      showPageSize: {
        attribute: "show-page-size",
        type: Boolean,
        default: true
      },
      pageSizeLabel: {
        attribute: "page-size-label",
        default: ""
      },
      showActions: {
        attribute: "show-actions",
        type: Boolean,
        default: true
      },
      actions: {
        default: [],

        parser(value, defaultValue) {
          return parseActions(value, defaultValue);
        }

      },
      action: {
        default: ""
      },
      actionApplyText: {
        attribute: "action-apply-text",
        default: ""
      },
      showActionForAll: {
        attribute: "show-action-for-all",
        type: Boolean,
        default: false
      },
      actionForAll: {
        attribute: "action-for-all",
        type: Boolean,
        default: false
      },
      actionForAllLabel: {
        attribute: "action-for-all-label",
        default: ""
      },
      actionChooseLabel: {
        attribute: "action-choose-label",
        default: ""
      },
      actionsRegionLabel: {
        attribute: "actions-region-label",
        default: ""
      },
      clearSelectionLabel: {
        attribute: "clear-selection-label",
        default: ""
      },
      actionsLabel: {
        attribute: "actions-label",
        default: ""
      }
    };
  }

  get top() {
    return this.getBooleanAttr("top", true);
  }

  get middle() {
    return this.getBooleanAttr("middle", true);
  }

  get bottom() {
    return this.getBooleanAttr("bottom", true);
  }

  get topClass() {
    return this.getAttribute("top-class") || "";
  }

  get mainClass() {
    return this.getAttribute("main-class") || "";
  }

  get bottomClass() {
    return this.getAttribute("bottom-class") || "";
  }

  get showMoreText() {
    return this.getAttribute("show-more-text") || this.sfWord("show-more-text");
  }

  get ariaLabel() {
    return this.getAttribute("aria-label") || this.sfWord("aria-label");
  }

  get pagesLabel() {
    return this.getAttribute("pages-label") || this.sfWord("pages-label");
  }

  get pageLabel() {
    return this.getAttribute("page-label") || this.sfWord("page-label");
  }

  get previousLabel() {
    return this.getAttribute("previous-label") || this.sfWord("previous-label");
  }

  get nextLabel() {
    return this.getAttribute("next-label") || this.sfWord("next-label");
  }

  get firstLabel() {
    return this.getAttribute("first-label") || this.sfWord("first-label");
  }

  get pageFieldLabel() {
    return this.getAttribute("page-field-label") || this.sfWord("page-field-label");
  }

  get lastLabel() {
    return this.getAttribute("last-label") || this.sfWord("last-label");
  }

  get totalLabel() {
    return this.getAttribute("total-label") || this.sfWord("total-label");
  }

  get selectedLabel() {
    return this.getAttribute("selected-label") || this.sfWord("selected-label");
  } // How many rows are marked. It is capped by the total only when there is a
  // total: with the count unknown the cap was zero, so a marked row read as
  // none and the panel of bulk controls never appeared at all.


  get selectedCount() {
    const parsed = Math.trunc(this.getNumberAttr("selected-count", 0));

    if (!Number.isFinite(parsed)) {
      return 0;
    }

    const atLeastNone = Math.max(parsed, 0);
    return this.countKnown && this.totalExact ? Math.min(atLeastNone, this.total) : atLeastNone;
  }

  get total() {
    const parsed = Math.trunc(this.getNumberAttr("total", 10));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 10;
  } // Whether the number of records is known at all. A host that does not count
  // every answer says so, and then the view shows a link in place of the number
  // and asks what is behind it only when someone wants it.


  get countKnown() {
    return this.getBooleanAttr("count-known", true);
  } // Whether the total is the number itself or an estimate (vocabulary 1.1.5
  // total-exact; standard 1.3.8 gate 29). sf-data-view says false from the
  // port's `total_exact`: the row then reads «~N», and neither the last page
  // nor the page count is offered as a fact; the count link asks for the
  // number when the host can count.


  get totalExact() {
    return this.getBooleanAttr("total-exact", true);
  } // The number is known and exact: the only case in which the view derives a
  // last page and a page count from it.


  get exactCount() {
    return this.countKnown && this.totalExact;
  } // The total as it is shown: «~450» for an estimate.


  get shownTotal() {
    return this.totalExact ? String(this.total) : `~${this.total}`;
  } // Whether the host can count when asked. Without it the view offers nothing:
  // a link that answers "unavailable" is worse than no link.


  get canCount() {
    return this.getBooleanAttr("can-count", false);
  }

  get counting() {
    return this.getBooleanAttr("counting", false);
  } // Said by the host when it sends no total. It is the only thing that moves
  // forward and Show more then, so the view never derives a page count it was
  // not given.


  get hasNextPage() {
    return this.getBooleanAttr("has-next", false);
  } // With an estimate the estimated page count says there is more, and so does
  // has_next: the estimate may be short of the truth.


  get hasNext() {
    if (this.exactCount) return this.current < this.pageCount;
    if (this.countKnown) return this.current < this.pageCount || this.hasNextPage;
    return this.hasNextPage;
  }

  get showCountLabel() {
    return this.getAttribute("show-count-label") || this.sfWord("show-count-label");
  } // The next portion is on its way. It is answered inside the button that asked
  // for it, not by a loader over the whole table: the rows on screen are not
  // going anywhere.


  get showMoreBusy() {
    return this.getBooleanAttr("show-more-busy", false);
  }

  get countingLabel() {
    return this.getAttribute("counting-label") || this.sfWord("counting-label");
  }

  get pageSize() {
    const parsed = Math.trunc(this.getNumberAttr("page-size", 10));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
  }

  set pageSize(value) {
    this.setAttribute("page-size", String(Math.trunc(Number(value)) || 10));
  }

  get pageCount() {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  get pageSizes() {
    return parsePageSizes(this.getAttribute("page-sizes"), [10, 20, 30, 40]);
  }

  get showPageSize() {
    return this.getBooleanAttr("show-page-size", true);
  }

  get pageSizeLabel() {
    return this.getAttribute("page-size-label") || this.sfWord("page-size-label");
  }

  get showActions() {
    return this.getBooleanAttr("show-actions", true);
  }

  get actions() {
    return parseActions(this.getAttribute("actions"), []);
  } // No action until one is chosen. This used to fall through to the first
  // enabled action in the list, which made Apply pressable the moment a row was
  // marked — and the first action in a host's list is as likely to be "delete
  // for ever" as anything else. A host that does want a starting action says so
  // with the attribute or by marking one selected.


  get action() {
    const attrValue = this.getAttribute("action") || "";

    if (attrValue) {
      return attrValue;
    }

    return this.actions.find(item => item.selected && !item.disabled)?.value || "";
  }

  get actionApplyText() {
    return this.getAttribute("action-apply-text") || this.sfWord("action-apply-text");
  }

  get showActionForAll() {
    return this.getBooleanAttr("show-action-for-all", false);
  }

  get actionForAll() {
    return this.getBooleanAttr("action-for-all", false);
  }

  get actionForAllLabel() {
    return this.getAttribute("action-for-all-label") || this.sfWord("action-for-all-label");
  }

  get actionsLabel() {
    return this.getAttribute("actions-label") || this.sfWord("actions-label");
  } // The labels are read through getters, like every other word this component
  // shows: the template context is built from `this.<name>`, so a declared prop
  // without a getter reaches the template as undefined. The first attempt at
  // the panel left the list's placeholder empty for exactly that reason.


  get actionChooseLabel() {
    return this.getAttribute("action-choose-label") || this.sfWord("action-choose-label");
  }

  get actionsRegionLabel() {
    return this.getAttribute("actions-region-label") || this.sfWord("actions-region-label");
  }

  get clearSelectionLabel() {
    return this.getAttribute("clear-selection-label") || this.sfWord("clear-selection-label");
  } // The page being read. It is held inside the page count only when there is a
  // count: without one the count is one page, and that clamp pinned every page
  // to the first — the switcher showed a single place on page three, and
  // nothing else could move.


  get current() {
    const parsed = Math.trunc(this.getNumberAttr("current", 1));

    if (!Number.isFinite(parsed)) {
      return 1;
    }

    const atLeastFirst = Math.max(parsed, 1);
    return this.exactCount ? Math.min(atLeastFirst, this.pageCount) : atLeastFirst;
  } // The page as a setting (§4.3): written from outside it is not reported (§8).


  set current(value) {
    this.setAttribute("current", String(Math.trunc(Number(value)) || 1));
  } // How many pages there are, when that is known at all. Said out loud rather
  // than reported as one page, so a host is not told a count the view does not
  // have.
  // An estimate gives no page count either: a count derived from «~450» would
  // be reported to the host as fact.


  get knownPageCount() {
    return this.exactCount ? this.pageCount : null;
  } // A window of at most five numbers around the page being read, the current one
  // in the middle where there is room for it.
  //
  // The scheme before this one showed 1, 2, a gap and the two pages behind the
  // current one, and the gap jumped into the middle of what it hid. The
  // consumer's owner replaced it on 2026-10-04: the ends are reached by the
  // first and last buttons, any page by the number field, and a window around
  // the current page is what a person actually reads. Pages ahead are shown only
  // when they exist — with a count that is arithmetic, and without one only the
  // next page is known to be there, from `has_next`.


  get pageItems() {
    // Without a count there is no empty-set case to answer: the host has said
    // there are records and whether more follow, and the window is built from
    // the page being read, so the row is the same in both modes.
    if (this.exactCount && this.total === 0) {
      return [];
    }

    const window = 5;
    const current = this.current; // The last page a number may name: the last one there is when it is known,
    // and otherwise the next one, which `has_next` says exists.
    // With an estimate, as far as the estimate reaches or the next page.

    const furthest = this.exactCount ? this.pageCount : this.countKnown ? Math.max(this.pageCount, current + (this.hasNextPage ? 1 : 0)) : current + (this.hasNextPage ? 1 : 0);
    const start = Math.max(1, Math.min(current - 2, furthest - window + 1));
    const end = Math.min(furthest, start + window - 1);
    return Array.from({
      length: Math.max(0, end - start + 1)
    }, (_, index) => ({
      type: "page",
      value: start + index,
      selected: start + index === current,
      edge: start + index === 1 || start + index === furthest
    }));
  }

  firstPage() {
    return this.goToPage(1);
  } // The field takes any page and is held to what exists: a number outside the
  // range is brought back to it rather than refused, because a person typing 99
  // into a view of twelve pages means the end.


  goToTypedPage(value) {
    const parsed = Number.parseInt(String(value ?? "").trim(), 10);

    if (!Number.isFinite(parsed)) {
      return this;
    }

    const furthest = this.exactCount ? this.pageCount : parsed;
    return this.goToPage(Math.min(Math.max(parsed, 1), Math.max(1, furthest)));
  } // The field grows with the number being typed. It is done to the element
  // rather than through the state on purpose: a re-render on every keystroke
  // would take the caret with it, which is a defect this component has had.


  fitPageField(input) {
    const field = input?.closest?.(".sf-pagination-page-field");
    if (!field) return this;
    const digits = String(input.value ?? "").replace(/\D/gu, "").length;
    field.style.setProperty("--sf-pagination-page-input--digits", String(Math.max(digits, 1)));
    return this;
  }
  /**
   * One of this pagination's words, in the page's language. An attribute wins
   * over both: a consumer who names a word has named it.
   */


  text(key, attribute) {
    return attribute && this.getAttribute(attribute) || this.sfWord(wordKey(key));
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      ariaLabel: this.text("ariaLabel", "aria-label"),
      pagesLabel: this.text("pagesLabel", "pages-label"),
      pageLabel: this.text("pageLabel", "page-label"),
      previousLabel: this.text("previousLabel", "previous-label"),
      nextLabel: this.text("nextLabel", "next-label"),
      lastLabel: this.text("lastLabel", "last-label"),
      totalLabel: this.text("totalLabel", "total-label"),
      selectedLabel: this.text("selectedLabel", "selected-label"),
      showMoreText: this.text("showMoreText", "show-more-text"),
      pageSizeLabel: this.text("pageSizeLabel", "page-size-label"),
      actionApplyText: this.text("actionApplyText", "action-apply-text"),
      actionForAllLabel: this.text("actionForAllLabel", "action-for-all-label"),
      actionsLabel: this.text("actionsLabel", "actions-label"),
      actionChooseLabel: this.text("actionChooseLabel", "action-choose-label"),
      actionsRegionLabel: this.text("actionsRegionLabel", "actions-region-label"),
      clearSelectionLabel: this.text("clearSelectionLabel", "clear-selection-label"),
      showCountLabel: this.text("showCountLabel", "show-count-label"),
      countingLabel: this.text("countingLabel", "counting-label"),
      firstLabel: this.text("firstLabel", "first-label"),
      pageFieldLabel: this.text("pageFieldLabel", "page-field-label"),
      rootClass: this.getRootClass(),
      ariaLabel: this.ariaLabel,
      pagesLabel: this.pagesLabel,
      pageLabel: this.pageLabel,
      previousLabel: this.previousLabel,
      nextLabel: this.nextLabel,
      lastLabel: this.lastLabel,
      firstLabel: this.firstLabel,
      pageFieldLabel: this.pageFieldLabel,
      totalLabel: this.totalLabel,
      selectedLabel: this.selectedLabel,
      selectedCount: this.selectedCount,
      showMoreText: this.showMoreText,
      current: this.current,
      total: this.total,
      pageCount: this.knownPageCount,
      hasPrev: this.current > 1,
      hasNext: this.hasNext,
      countKnown: this.countKnown,
      totalExact: this.totalExact,
      shownTotal: this.shownTotal,
      // The last page is a jump to a number: offered when the number is
      // exact, or when the host can count it first. Without a count at all
      // the button asks for one, as it always has.
      canJumpToLast: this.exactCount || this.canCount || !this.countKnown,
      canCount: this.canCount,
      counting: this.counting,
      showCountLabel: this.showCountLabel,
      countingLabel: this.countingLabel,
      showMoreBusy: this.showMoreBusy,
      pageItems: this.pageItems,
      pageSize: this.pageSize,
      pageSizes: this.pageSizes,
      showPageSize: this.showPageSize,
      pageSizeLabel: this.pageSizeLabel,
      showActions: this.showActions,
      actions: this.actions,
      action: this.action,
      actionApplyText: this.actionApplyText,
      showActionForAll: this.showActionForAll,
      actionForAll: this.actionForAll,
      actionForAllLabel: this.actionForAllLabel,
      actionsLabel: this.actionsLabel,
      actionChooseLabel: this.actionChooseLabel,
      actionsRegionLabel: this.actionsRegionLabel,
      clearSelectionLabel: this.clearSelectionLabel
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderPaginationTemplate)(this.templateContext());
  }

  getTopSection() {
    return this.querySelector(".sf-pagination-top");
  }

  getMainSection() {
    return this.querySelector(".sf-pagination-main");
  }

  getBottomSection() {
    return this.querySelector(".sf-pagination-bottom");
  } // The action go-to-page {page} (§4.4): answers an outcome. A page the person
  // asked for (a number, an arrow, the field) or a host finishing what a
  // person started (the last page once the count arrives) is reported as
  // sf-pagination-change.


  goToPage(page) {
    if (this.exactCount && this.total === 0) {
      return {
        outcome: "refused",
        reason: "empty"
      };
    }

    const parsed = Number.parseInt(String(page?.page ?? page ?? ""), 10);

    if (!Number.isFinite(parsed)) {
      return {
        outcome: "refused",
        reason: "invalid"
      };
    }

    const previous = this.current; // With no count there is no last page to clamp against. The host answers a
    // page that has run out with no records, which is honest; clamping to a
    // page count derived from nothing would not be.

    const next = this.exactCount ? Math.min(Math.max(parsed, 1), this.pageCount) : Math.max(parsed, 1);

    if (next === previous) {
      return {
        outcome: "refused",
        reason: "current"
      };
    }

    this.setState({
      current: next
    });
    this.sfEmit("change", {
      previous,
      current: next,
      total: this.total,
      "page-count": this.knownPageCount,
      "page-size": this.pageSize
    });
    return {
      outcome: "applied"
    };
  } // The last page needs a number, and without a count nobody has one yet. So
  // the number is asked for, and the jump happens when it arrives — which is
  // why the request carries the reason. Counting on every answer instead is
  // exactly what this mode exists to avoid.
  // An estimate is no number to jump to either: the jump waits for the count.


  lastPage() {
    if (!this.exactCount) {
      return this.requestCount("last-page");
    }

    return this.goToPage(this.pageCount);
  } // Asked when there is no number, or only an estimate of it.


  requestCount(reason = "total") {
    if (this.exactCount || !this.canCount || this.counting) {
      return this;
    }

    this.setState({
      counting: true
    });
    this.sfEmit("count", {
      reason,
      current: this.current,
      "page-size": this.pageSize
    });
    return this;
  } // The panel's cross drops the selection. The pagination does not hold it —
  // the rows do — so this is an announcement, not a mutation, and the view
  // passes it to the table.


  clearSelection() {
    this.sfEmit("selection-clear", {
      "selected-count": this.selectedCount,
      total: this.total
    });
    return this;
  } // The action show-more (§4.4), vocabulary §5 load-more {direction: after}.
  // The button the person pressed was `item`; it is no data (§8), so only
  // the old name sf-show-more still carries it.


  showMore(item = null) {
    this._showMoreItem = item;

    try {
      this.sfEmit("load-more", {
        direction: "after",
        current: this.current,
        total: this.total,
        "page-size": this.pageSize,
        "page-count": this.knownPageCount,
        "has-next": this.hasNext
      });
    } finally {
      this._showMoreItem = null;
    }

    return {
      outcome: "applied"
    };
  }

  setPageSize(size) {
    const parsed = Math.trunc(Number(size));

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return this;
    }

    const previous = this.pageSize;

    if (parsed === previous) {
      return this;
    }

    const pageCount = Math.max(1, Math.ceil(this.total / parsed));
    const current = this.exactCount ? Math.min(this.current, pageCount) : this.current;
    this.setState({
      pageSize: parsed,
      current
    });
    this.sfEmit("size-change", {
      previous,
      "page-size": parsed,
      current,
      total: this.total,
      "page-count": this.exactCount ? pageCount : null
    });
    return this;
  }

  setAction(action) {
    const previous = this.action;
    const value = String(action || "").trim(); // An empty value is the choice at the top of the list, so it has to be able
    // to put the chooser back where it started and take Apply out of reach
    // again; before, it was ignored and a chosen action could not be undone.

    if (value === previous) {
      return this;
    }

    this.setState({
      action: value
    });
    this.sfEmit("action-change", {
      previous,
      action: value
    });
    return this;
  }

  setActionForAll(value) {
    const previous = this.actionForAll;
    const next = Boolean(value);

    if (next === previous) {
      return this;
    }

    this.setState({
      actionForAll: next
    });
    this.sfEmit("action-for-all-change", {
      previous,
      "action-for-all": next
    }); // An action under the filter is applied against a confirmed total, so
    // marking the box is the moment the number is needed. Asking for it here
    // and not at Apply means the person sees what they are about to touch
    // before they press anything.

    if (next) {
      this.requestCount("action-for-all");
    }

    return this;
  }

  applyAction() {
    if (!this.action) {
      return this;
    } // vocabulary §5 apply: the scope is the marked rows, or everything under
    // the filter when «for all» is on.


    this.sfEmit("apply", {
      action: this.action,
      scope: this.actionForAll ? "filter" : "selection",
      current: this.current,
      total: this.total,
      "page-size": this.pageSize,
      "page-count": this.knownPageCount
    });
    return this;
  }

  get state() {
    return {
      topClass: this.topClass,
      mainClass: this.mainClass,
      bottomClass: this.bottomClass,
      top: this.top,
      middle: this.middle,
      bottom: this.bottom,
      rootClass: this.getRootClass(),
      ariaLabel: this.ariaLabel,
      pagesLabel: this.pagesLabel,
      pageLabel: this.pageLabel,
      previousLabel: this.previousLabel,
      nextLabel: this.nextLabel,
      lastLabel: this.lastLabel,
      totalLabel: this.totalLabel,
      selectedLabel: this.selectedLabel,
      selectedCount: this.selectedCount,
      showMoreText: this.showMoreText,
      current: this.current,
      total: this.total,
      totalExact: this.totalExact,
      pageCount: this.knownPageCount,
      pageSize: this.pageSize,
      pageSizes: this.pageSizes,
      showPageSize: this.showPageSize,
      pageSizeLabel: this.pageSizeLabel,
      showActions: this.showActions,
      actions: this.actions,
      action: this.action,
      actionApplyText: this.actionApplyText,
      showActionForAll: this.showActionForAll,
      actionForAll: this.actionForAll,
      actionForAllLabel: this.actionForAllLabel,
      actionsLabel: this.actionsLabel
    };
  }

  setState(nextState = {}) {
    Object.entries(nextState || {}).forEach(([key, value]) => {
      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toAttributeName)(key);

      if (!attr) {
        return;
      } // Off for a boolean that is on by default is written, not removed:
      // without the attribute it reads as on again. sf-data-view sends
      // countKnown and totalExact false this way.


      if (value === false && DEFAULT_ON.has(attr)) {
        this.setAttribute(attr, "false");
        return;
      }

      if (value === false || value === null || value === undefined || value === "") {
        this.removeAttribute(attr);
        return;
      }

      if (value === true) {
        this.setAttribute(attr, "");
        return;
      }

      this.setAttribute(attr, String(value));
    });
    return this;
  } // The old names keep their old detail (§16.20 split rows): the element, its
  // template and the camelCase fields were in it.


  sfAliasAdapters() {
    const old = detail => ({
      component: this,
      tagName: this.componentTagName,
      template: this.componentTemplateName,
      ...camelDetail(detail)
    });

    return {
      "sf-page-change": old,
      "sf-page-size-change": old,
      "sf-count-request": old,
      "sf-selection-clear": old,
      "sf-action-change": old,
      "sf-action-for-all-change": old,
      "sf-action-apply": detail => ({ ...old(detail),
        actionForAll: detail.scope === "filter"
      }),
      "sf-show-more": detail => ({ ...old(detail),
        item: this._showMoreItem ?? null
      })
    };
  }

  onPageChange(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener(this.sfEventName("change"), // The new detail, with the camelCase names a handler of the old one
      // read (pageSize, pageCount) beside the vocabulary's.
      event => {
        handler(event.detail?.current, { ...camelDetail(event.detail ?? {}),
          ...event.detail
        }, event);
      }, options);
    }

    return this;
  }

  onShowMore(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener(this.sfEventName("load-more"), event => {
        handler({ ...camelDetail(event.detail ?? {}),
          ...event.detail
        }, event);
      }, options);
    }

    return this;
  }

}

SfPagination.define("sf-pagination");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a57d260bd333"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPaginationTemplate: () => (/* binding */ renderPaginationTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(" ");
}

function renderPageItem(item, context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <li
      class=${joinClasses("sf-pagination-item", item.edge ? "sf-pagination-item--edge" : "", item.selected ? "sf-pagination-item--current" : "")}
    >
      <button
        type="button"
        class=${joinClasses("sf-page-number", "sf-page-number--square", item.selected ? "selected" : "")}
        data-page=${String(item.value)}
        aria-current=${item.selected ? "page" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${`${context.pageLabel} ${item.value}`}
        @click=${() => component.goToPage(item.value)}
      >
        ${item.value}
      </button>
    </li>
  `;
} // The page a person is on, and the way to any other. It used to sit beside the
// row of numbers with a label of its own; it stands between the arrows now, and
// the label is for a reader rather than a line of text in the footer.


function renderPageField(context, component) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <label
      class="sf-pagination-page-field flex items-cross-center"
      style=${`--sf-pagination-page-input--digits: ${String(context.current).length}`}
    >
      <sf-input
        size=${context.size}
        appearance="bordered"
        root-class="sf-pagination-page-input"
        value=${String(context.current)}
        inputmode="numeric"
        aria-label=${context.pageFieldLabel}
        @input=${event => component.fitPageField(event.target)}
        @keydown=${event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    component.goToTypedPage(event.target?.value);
  }}
      ></sf-input>
    </label>
  `;
}

function renderDirection(context, {
  kind,
  icon,
  label,
  page
}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <li class="sf-pagination-item">
      <sf-icon-button
        class=${`sf-pagination-direction sf-pagination-direction--${kind}`}
        size=${context.size}
        appearance="link"
        scheme="on-surface"
        icon=${icon}
        title=${label}
        aria-label=${label}
        @click=${page}
      ></sf-icon-button>
    </li>
  `;
}

function renderPaginationTemplate(context) {
  const {
    component
  } = context;
  const rootClasses = joinClasses("sf-pagination", `sf-pagination--size-${context.size === "1/2" ? "1/2" : "1"}`, "flex", "flex-col", context.rootClass);
  const topClasses = joinClasses("sf-pagination-top", "flex", "content-main-center", context.topClass);
  const mainClasses = joinClasses("sf-pagination-main", "flex", "items-cross-center", "content-main-between", context.mainClass); // The row of bulk controls is a panel over the page while rows are marked,
  // not a row inside the pagination: the controls act on the selection, which
  // outlives the part of the page a person is looking at.
  // Only the band's own class: `sf-pagination-bottom` is the generic last row,
  // and it paints transparent at a higher specificity, so the band came out
  // see-through with the rows reading through it.

  const bottomClasses = joinClasses("sf-pagination-actions", "flex", "items-cross-center", context.bottomClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <nav
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${context.ariaLabel}
    >
      <!-- Show more had a row of its own above the footer. It is a page action
           like the arrows, so it stands in the footer beside them; the row it
           used to take was a line of empty space whenever there was nothing
           more to show. -->
      ${context.middle ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class=${mainClasses}>
              <!-- How many are marked is said by the band of bulk controls,
                   which only exists while something is marked. Saying it here
                   as well meant a footer counting a selection of none out of
                   the total at all times, and zero out of zero before the
                   first answer. -->
              <div class="sf-pagination-left flex items-cross-center">
                <!-- Three answers to "how many": the number, a short wait, or
                     an offer to find out. A host that cannot count is not
                     offered at all — a link that answers "unavailable" is worse
                     than no link. -->
                <div class="sf-pagination-total flex items-cross-center">
                  <!-- An estimate (total-exact false) reads «~N», and the
                       offer to find out stands beside it: the number is
                       there, but it is not one to act on. -->
                  ${context.countKnown ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-pagination-total-text flex items-cross-center">
                          ${context.totalLabel} ${context.shownTotal}
                          ${context.totalExact ? "" : context.counting ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-spinner size=${context.size} aria-label=${context.countingLabel}></sf-spinner>` : context.canCount ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                    <sf-button
                                      class="sf-pagination-count-request"
                                      size=${context.size}
                                      appearance="link"
                                      scheme="primary"
                                      text=${context.showCountLabel}
                                      @click=${() => component.requestCount("total")}
                                    ></sf-button>
                                  ` : ""}
                        </div>
                      ` : context.counting ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                          <div class="sf-pagination-total-text flex items-cross-center">
                            ${context.totalLabel}
                            <sf-spinner size=${context.size} aria-label=${context.countingLabel}></sf-spinner>
                          </div>
                        ` : context.canCount ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="sf-pagination-total-text flex items-cross-center">
                              ${context.totalLabel}
                              <sf-button
                                class="sf-pagination-count-request"
                                size=${context.size}
                                appearance="link"
                                scheme="primary"
                                text=${context.showCountLabel}
                                @click=${() => component.requestCount("total")}
                              ></sf-button>
                            </div>
                          ` : ""}
                </div>
              </div>

              ${!context.countKnown || context.total > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-pagination-container flex items-cross-center">
                      <span class="sf-pagination-pages-label">${context.pagesLabel}</span>
                      <ol class="sf-pagination-list flex items-cross-center">
                        ${context.hasPrev ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                              ${renderDirection(context, {
    kind: "first",
    icon: "first_page",
    label: context.firstLabel,
    page: () => component.firstPage()
  })}
                              ${renderDirection(context, {
    kind: "prev",
    icon: "keyboard_arrow_left",
    label: context.previousLabel,
    page: () => component.goToPage(context.current - 1)
  })}
                            ` : ""}
                        <!-- The field stands where the row of numbers stood: on
                             a page five of hundreds the numbers around it said
                             little, and the row they took changed width as the
                             person moved through the pages. -->
                        <li class="sf-pagination-item sf-pagination-item-field flex items-cross-center">
                          ${renderPageField(context, component)}
                        </li>
                        ${context.hasNext ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                              ${renderDirection(context, {
    kind: "next",
    icon: "keyboard_arrow_right",
    label: context.nextLabel,
    page: () => component.goToPage(context.current + 1)
  })}
                              ${context.canJumpToLast ? renderDirection(context, {
    kind: "last",
    icon: "last_page",
    label: context.lastLabel,
    page: () => component.lastPage()
  }) : ""}
                            ` : ""}
                      </ol>
                    </div>
                  ` : ""}

              ${context.top && context.hasNext ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-pagination-more flex items-cross-center">
                      <sf-button
                        size=${context.size}
                        appearance="outline"
                        scheme="primary"
                        ?loading=${context.showMoreBusy}
                        ?disabled=${context.showMoreBusy}
                        @click=${e => component.showMore(e.target)}
                        text="${context.showMoreText}"
                      ></sf-button>
                    </div>
                  ` : ""}

              ${context.showPageSize && (!context.countKnown || context.total > 0) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-pagination-count flex items-cross-center">
                      <span>${context.pageSizeLabel}</span>
                      <sf-dropdown
                        size=${context.size}
                        appearance="outlined"
                        search="false"
                        mode="select"
                        portal="true"
                        value=${String(context.pageSize)}
                        aria-label=${context.pageSizeLabel}
                        .options=${(context.pageSizes || []).map(size => ({
    type: "text",
    size: context.size,
    text: String(size),
    value: String(size),
    selected: Number(size) === Number(context.pageSize)
  }))}
                        @change=${event => component.setPageSize(Number(event.detail.value))}
                      ></sf-dropdown>
                    </div>
                  ` : ""}
            </div>
          ` : ""}
      <!-- A page row on its own still carries the band. Inside a data view the
           card carries it instead, and the view turns this block off: a band
           sticky inside the page row could travel no further than the row. -->
      ${context.bottom && context.showActions && context.actions?.length && context.selectedCount > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div
              class=${bottomClasses}
              role="region"
              aria-label=${context.actionsRegionLabel}
            >
              <span class="sf-pagination-actions-count">
                ${context.selectedLabel} ${context.selectedCount}
              </span>
              <span class="sf-pagination-actions-separator" aria-hidden="true"></span>
              <sf-dropdown
                size=${context.size}
                appearance="outlined"
                search="false"
                mode="select"
                value=${context.action}
                placeholder=${context.actionChooseLabel}
                aria-label=${context.actionsLabel}
                .options=${[// The list opens on a choice that is not an action. A select
  // that starts on the first real action makes Apply pressable
  // before anyone has chosen anything, and the first action in
  // the list is as likely to be "delete for ever" as anything
  // else.
  {
    type: "text",
    size: context.size,
    text: context.actionChooseLabel,
    value: "",
    selected: !context.action
  }, ...context.actions.map(action => ({
    type: "text",
    size: context.size,
    text: action.text,
    value: action.value,
    selected: action.value === context.action,
    disabled: Boolean(action.disabled)
  }))]}
                @change=${event => component.setAction(event.detail.value)}
              ></sf-dropdown>
              <sf-button
                size=${context.size}
                appearance="default"
                scheme="primary"
                text=${context.actionApplyText}
                ?disabled=${!context.action}
                @click=${() => component.applyAction()}
              ></sf-button>
              ${context.showActionForAll ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-pagination-actions-separator" aria-hidden="true"></span>
                    <sf-checkbox
                      label=${context.countKnown ? `${context.actionForAllLabel} (${context.shownTotal})` : context.actionForAllLabel}
                      ?checked=${Boolean(context.actionForAll)}
                      @change=${event => component.setActionForAll(Boolean(event.target?.checked))}
                    ></sf-checkbox>
                  ` : ""}
              <sf-icon-button
                class="sf-pagination-actions-clear"
                size=${context.size}
                appearance="link"
                scheme="on-surface"
                icon="close"
                title=${context.clearSelectionLabel}
                aria-label=${context.clearSelectionLabel}
                @click=${() => component.clearSelection()}
              ></sf-icon-button>
            </div>
          ` : ""}
    </nav>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "90fab10c70dd"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-pagination for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-page-change","to":"sf-pagination-change","kind":"event","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8","note":"the old detail adds component, tagName, template and the camelCase fields, which §8 and the vocabulary took out: the element\'s detail adapter makes it"},{"from":"sf-page-size-change","to":"sf-pagination-size-change","kind":"event","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8","note":"the old detail adds component, tagName, template and the camelCase fields, which §8 and the vocabulary took out: the element\'s detail adapter makes it"},{"from":"sf-count-request","to":"sf-pagination-count","kind":"event","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5 count","note":"the old detail adds component, tagName, template and the camelCase fields, which §8 and the vocabulary took out: the element\'s detail adapter makes it"},{"from":"sf-show-more","to":"sf-pagination-load-more","kind":"event","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5 load-more","note":"the old detail adds component, tagName, template and the camelCase fields, which §8 and the vocabulary took out: the element\'s detail adapter makes it"},{"from":"sf-selection-clear","to":"sf-pagination-selection-clear","kind":"event","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, an own verb","note":"the old detail adds component, tagName, template and the camelCase fields, which §8 and the vocabulary took out: the element\'s detail adapter makes it"},{"from":"sf-action-change","to":"sf-pagination-action-change","kind":"event","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8","note":"the old detail adds component, tagName, template and the camelCase fields, which §8 and the vocabulary took out: the element\'s detail adapter makes it"},{"from":"sf-action-for-all-change","to":"sf-pagination-action-for-all-change","kind":"event","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8","note":"the old detail adds component, tagName, template and the camelCase fields, which §8 and the vocabulary took out: the element\'s detail adapter makes it"},{"from":"sf-action-apply","to":"sf-pagination-apply","kind":"event","component":"sf-pagination","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5 apply","note":"the old detail adds component, tagName, template and the camelCase fields, which §8 and the vocabulary took out: the element\'s detail adapter makes it"}]}');

/***/ },

/***/ "344edfee8242"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-pagination\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/pagination (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.pagination","tag":"sf-pagination","version":"1.3.0","kind":"leaf","family":"pagination","settings":{"top":{"type":"boolean","default":true},"middle":{"type":"boolean","default":true},"bottom":{"type":"boolean","default":true},"top-class":{"type":"string","default":""},"main-class":{"type":"string","default":""},"bottom-class":{"type":"string","default":""},"pages-label":{"type":"string","default-from":"runtime.pages-label"},"page-label":{"type":"string","default-from":"runtime.page-label"},"previous-label":{"type":"string","default-from":"runtime.previous-label"},"next-label":{"type":"string","default-from":"runtime.next-label"},"last-label":{"type":"string","default-from":"runtime.last-label"},"total-label":{"type":"string","default-from":"runtime.total-label"},"selected-label":{"type":"string","default-from":"runtime.selected-label"},"selected-count":{"type":"number","integer":true,"min":0,"default":0},"show-more-text":{"type":"string","default-from":"runtime.show-more-text"},"total":{"type":"number","integer":true,"min":0,"default":10},"page-size":{"type":"number","integer":true,"min":1,"default":10},"page-sizes":{"type":"string","default":"10,20,30,40","x-markup":"comma-separated page sizes, positive whole numbers; the property also takes a list of numbers"},"show-page-size":{"type":"boolean","default":true},"page-size-label":{"type":"string","default-from":"runtime.page-size-label"},"show-actions":{"type":"boolean","default":true},"actions":{"type":"string","default":"","x-markup":"\\"value:text::flags|value:text\\"; the property also takes a list of {value, text, disabled?, selected?}"},"action":{"type":"string","default":""},"action-apply-text":{"type":"string","default-from":"runtime.action-apply-text"},"show-action-for-all":{"type":"boolean","default":false},"action-for-all":{"type":"boolean","default":false},"action-for-all-label":{"type":"string","default-from":"runtime.action-for-all-label"},"actions-label":{"type":"string","default-from":"runtime.actions-label"},"action-choose-label":{"type":"string","default-from":"runtime.action-choose-label"},"actions-region-label":{"type":"string","default-from":"runtime.actions-region-label"},"clear-selection-label":{"type":"string","default-from":"runtime.clear-selection-label"},"count-known":{"type":"boolean","default":true},"total-exact":{"type":"boolean","default":true,"summary":"false when total is an estimate: the row reads «~N», the last page and the page count are not offered as exact, and the count link asks for the number (vocabulary 1.1.5 total-exact; gate 29)"},"can-count":{"type":"boolean","default":false},"counting":{"type":"boolean","default":false},"has-next":{"type":"boolean","default":false},"show-count-label":{"type":"string","default-from":"runtime.show-count-label"},"counting-label":{"type":"string","default-from":"runtime.counting-label"},"first-label":{"type":"string","default-from":"runtime.first-label"},"page-field-label":{"type":"string","default-from":"runtime.page-field-label"},"show-more-busy":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1"],"default":"1"}},"values":{"current":{"type":"number","integer":true,"min":1,"default":1,"summary":"the page being read, from 1 (vocabulary 1.1.5 page)"}},"events":{"change":{"x-native":false,"carries":{"previous":"number","current":"number","total":"number","page-count":{"type":"number","nullable":true},"page-size":"number"}},"size-change":{"carries":{"previous":"number","page-size":"number","current":"number","total":"number","page-count":{"type":"number","nullable":true}}},"count":{"carries":{"reason":{"type":"enum","values":["total","last-page","action-for-all"]},"current":"number","page-size":"number"}},"load-more":{"carries":{"direction":{"type":"enum","values":["after"]},"current":"number","total":"number","page-size":"number","page-count":{"type":"number","nullable":true},"has-next":"boolean"}},"selection-clear":{"carries":{"selected-count":"number","total":"number"},"own-verb":true},"action-change":{"carries":{"previous":"string","action":"string"}},"action-for-all-change":{"carries":{"previous":"boolean","action-for-all":"boolean"}},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["selection","filter"]},"current":"number","total":"number","page-size":"number","page-count":{"type":"number","nullable":true}}}},"actions":{"go-to-page":{"with":{"page":"number"},"x-outcomes":["applied","refused"]},"show-more":{"x-outcomes":["applied"]}},"keyboard":{"host":{"Tab":"reach","Enter":"select","Space":"select"}},"templates":{"default":{"file":"js/templates/default.js","$comment":"The Lit template in JavaScript, the migration form of §5.2 (§16)."}},"examples":"examples.json","docs":"docs/docs.md","lang":"lang/","accessibility":{"role":"navigation","name":{"from":["aria-label","runtime.aria-label"]},"keys":{"Tab":"reach","Enter":"select","Space":"select"}},"css-variables":{"--sf-pagination-background-color":{"type":"color","state":"default"},"--sf-pagination-color":{"type":"color","state":"default"},"--sf-pagination-gap":{"type":"length","state":"default"},"--sf-pagination-divider-color":{"type":"color","state":"default"},"--sf-pagination-page-background-color":{"type":"color","state":"default"},"--sf-pagination-page-color":{"type":"color","state":"default"},"--sf-pagination-page-radius":{"type":"length","state":"default"},"--sf-pagination-current-background-color":{"type":"color","state":"current"},"--sf-pagination-current-color":{"type":"color","state":"current"},"--sf-pagination-block-size-1/2":{"type":"length","state":"default","x-published":"root","x-summary":"published on :root, set by the sheet, read by a page: the page row on one line at size 1/2 -- 2 x --sf-space-1 + --sf-ui-1\\\\/2--control-height + 1px (docs/docs.md, the row\'s box)"},"--sf-pagination-block-size-1":{"type":"length","state":"default","x-published":"root","x-summary":"published on :root, set by the sheet, read by a page: the page row on one line at size 1 -- 2 x --sf-space-1 + --sf-ui-1--control-height + 1px (docs/docs.md, the row\'s box)"}},"x-summary":"Source-driven navigation for a collection split into numbered pages.","x-source":{"package":"framework","folder":"pagination","manifest":"simai/ui-source@5100227 src/smart/pagination/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/pagination.component.json"},"x-words":["pages-label","page-label","previous-label","next-label","last-label","total-label","selected-label","show-more-text","page-size-label","action-apply-text","action-for-all-label","actions-label","action-choose-label","actions-region-label","clear-selection-label","show-count-label","counting-label","first-label","page-field-label"],"x-renamed":["events.sf-action-apply → apply (vocabulary §5 apply)","events.sf-action-change → action-change (the DOM name without sf-<tag>-)","events.sf-action-for-all-change → action-for-all-change (the DOM name without sf-<tag>-)","events.sf-count-request → count (vocabulary §5 count)","events.sf-page-change → change (the DOM name without sf-<tag>-)","events.sf-page-size-change → size-change (the DOM name without sf-<tag>-)","events.sf-selection-clear → selection-clear (the DOM name without sf-<tag>-)","events.sf-show-more → load-more (vocabulary §5 load-more)","events: every old name keeps its old detail (component, tagName, template and the camelCase fields) through a split row; the new details carry data only, in the vocabulary\'s kebab-case (page-size, page-count, has-next, selected-count, action-for-all)","events.apply: actionForAll → scope (selection | filter), vocabulary §5 apply","settings.page-size, total, selected-count: numbers with integer and min (vocabulary 1.1.5 page-size)"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"fixture","effects":"component","forbidden_client_responsibilities":["backend access decisions","host route invention"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile"]},"ai_guidance":{"use_when":"Use sf-pagination for a collection divided into numbered pages when the host owns data loading and reacts to pagination events.","do_not":["Do not copy generated ui-smart code","Do not move host data or access decisions into the component","Do not use Pagination for semantic steps or short content that can be shown at once","Do not make an ellipsis interactive or put the pagination row on multiple lines","Do not treat the optional batch-action section as the core pagination contract"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<sf-pagination aria-label=\\"Страницы результатов поиска\\" current=\\"2\\" total=\\"96\\" page-size=\\"10\\" top=\\"false\\" bottom=\\"false\\" show-page-size=\\"false\\"></sf-pagination>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["shape: leaf, with reasons. The checkbox, the dropdowns and the page field are drawn by its template as controls of the pagination\'s own settings (action-for-all, page-size, action, the typed page); no rule runs between them, so keys, roles and rules would restate the same three bindings. And the parts it would place (sf-checkbox, sf-dropdown, sf-input) are migrating in the field family\'s branches now: an assembly binds to their 1.3.8 interfaces, which this branch does not have (report.md order check: an assembly moves after its parts). The assembly is a later step once the field family has landed.","version: 1.0.1 → 1.1.0, a minor while the eight old event names hold dated aliases (§4.10). 1.1.0 → 1.2.0, a minor: the setting total-exact (an estimated total reads «~N», gate 29), and size-change\'s page-count is null when the count is not exact, as change, load-more and apply already say.","events: names by vocabulary 1.1.5 -- sf-page-change → sf-pagination-change {current, …}, sf-page-size-change → sf-pagination-size-change, sf-count-request → sf-pagination-count (§5 count), sf-show-more → sf-pagination-load-more {direction: after, …} (§5 load-more), sf-selection-clear → sf-pagination-selection-clear (an own verb), sf-action-change and sf-action-for-all-change → sf-pagination-action-change and -action-for-all-change, sf-action-apply → sf-pagination-apply {action, scope} (§5 apply). The migration\'s row to the bare `change` is corrected: a DOM change would also be heard from the page-size and action dropdowns inside.","detail-adapter: §8 takes the element out of detail, so each new name carries data only; each old name follows once with its old detail (component, tagName, template, camelCase fields; apply\'s actionForAll, load-more\'s item) through a split row and sfAliasAdapters. sf-data-view (ui-pro data-view index.js:1952-1982) listens to the old names and keeps working until it moves.","change reports a person (§8): the page buttons, the field, the arrows and the dropdowns are a person\'s; goToPage, lastPage and setPageSize keep sending their events when a host calls them, because the host calls them to finish what a person started -- sf-data-view jumps to the last page once the count it asked for arrives (data-view index.js:1878). Writing current or page-size as a setting sends nothing, as before.","x-target: page, has-more, selection and state are not added: current is the page (vocabulary 1.1.5 binds the key page to it), has-next says what has-more would, and the pagination holds no selection or data state (the rows do, selected-count is their count). query is not added: the source reads change and size-change. total-exact is added in 1.2.0 (gate 29): count-known says whether there is a number at all, total-exact whether the number is exact; sf-data-view sets it from the port\'s total_exact.","actions: go-to-page {page} answers an outcome (applied; refused empty, invalid, current) and show-more answers applied (§4.4); firstPage, lastPage, goToTypedPage, setPageSize, setAction, setActionForAll, applyAction, clearSelection and requestCount stay the element\'s helpers.","own-verb-words: selection-clear is a verb of the pagination alone (the panel\'s cross); its word is lang events.selection-clear.label.","item-shape: the list settings stay strings in markup (page-sizes \\"10,20\\", actions \\"value:text::flags|\\"), as the template and hosts write them; the page items it draws are {type: page, value, selected, edge}.","existing-aliases: compatibility.migrations holds a changelog line (1.0.0 → 1.0.1), no alias; nothing to fold.","key-effects: native buttons, links and the page field: Tab reaches each, Enter and Space press a button, Enter in the page field goes to the typed page (select).","a11y-name: aria-label on the host, else the language file\'s runtime word «Страницы результатов» / «Result pages».","template: templates.default names the Lit template js/templates/default.js, the migration form §5.2 allows.","examples: examples.json from studio.fixture.json and studio.scenario.json plus the unknown count, the half size and the bulk panel; probe.json drives Tab, Enter and Space (gate 16).","css-variables: nine public variables read by the class sheets (component/pagination) over the role tokens (§6): the fill, the words\' colour, the gap, the divider, a page number\'s fill, colour and radius, the current page\'s fill and colour. They are not in src/core/contracts/public-variables.v1.json yet: on the built bytes (tests/browser/public-variables.browser.mjs) only the fill, the words\' colour and the gap reach sf-pagination; the page number\'s and the current page\'s variables style .sf-page-number, which the template no longer draws (the page field took the row of numbers), and the divider styles .sf-pagination-top, which it does not draw either. They enter the contract when they are pointed at what the element draws.","side-effects: none.","docs: docs/docs.md, where the folder keeps it (as sf-tooltip).","version 1.2.2: the first-paint snapshots are retaken: the JSON island is printed once (no held copy), the icon font\'s state (sf-icon loaded, sf-icon-loaded) is left out, a closed surface prints closed and a size or place the code measured (a non-zero px width, height, inset, clip or transform) is left out, so a snapshot is the same on every run.","version 1.2.3: the first-paint sheet list names the utility sheets its templates draw with (core.runtime 1.0.7 asks for them before the element draws: the style gate).","version 1.3.0: the page row publishes its box (standard 1.3.10 §5.4, a component publishes its box): --sf-pagination-block-size-1\\\\/2 and -1 on :root, the control height of the step plus the row\'s padding above and below (--sf-space-1) and the line under it, from the tokens the row is drawn with; the row\'s min-block-size is the same sum, so a row of text alone is as tall as one with the arrows. They are outputs a page reads, not looks it sets (x-published), so the nine look variables stay the §6 count. The row measured 88 px at size 1 and 80 at 1/2 instead of 73 and 65 on a page that loaded a component sheet before core.css: the cascade layer order is the order a page first meets the names, and only core.css declared it (ui-builder fix/sheet-layer-order declares it in every sheet)."]}');

/***/ },

/***/ "38d83a636029"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Pagination","runtime":{"action-apply-text":"Apply","action-choose-label":"Choose an action","action-for-all-label":"For all","actions-label":"Action for the selected records","actions-region-label":"Actions for the selected","aria-label":"Result pages","clear-selection-label":"Clear the selection","counting-label":"Counting","first-label":"First","last-label":"Last","next-label":"Next page","page-field-label":"Page:","page-label":"Page","page-size-label":"Per page:","pages-label":"Pages:","previous-label":"Previous page","selected-label":"Selected:","show-count-label":"Show the number","show-more-text":"Show more","total-label":"Total:"},"events":{"selection-clear":{"label":"Selection cleared"}}}');

/***/ },

/***/ "96e8b718b20a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Пагинация","events":{"selection-clear":{"label":"Выделение снято"}},"runtime":{"action-apply-text":"Применить","action-choose-label":"Выберите действие","action-for-all-label":"Для всех","actions-label":"Действие с выбранными элементами","actions-region-label":"Действия с отмеченными","aria-label":"Страницы результатов","clear-selection-label":"Снять выделение","counting-label":"Считаем","first-label":"В начало","last-label":"Последняя","next-label":"Следующая страница","page-field-label":"Страница:","page-label":"Страница","page-size-label":"На странице:","pages-label":"Страницы:","previous-label":"Предыдущая страница","selected-label":"Отмечено:","show-count-label":"Показать количество","show-more-text":"Показать ещё","total-label":"Всего:"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("403726af3b51");
/******/
/******/ })()
;