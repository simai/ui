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

/***/ "2fb8a633d966"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isTreeItemNode: () => (/* binding */ isTreeItemNode),
/* harmony export */   treeItemNodeToData: () => (/* binding */ treeItemNodeToData)
/* harmony export */ });
// A node written in markup as the entry shape sf-tree reads (the camelCase
// fields are the shape both have always used). Shared by sf-tree and
// sf-tree-item without either bundle carrying the other's element.
function isTreeItemNode(node) {
  return node?.nodeType === Node.ELEMENT_NODE && node?.tagName?.toLowerCase?.() === 'sf-tree-item';
}

function getDirectLabel(node) {
  return Array.from(node?.childNodes || []).filter(child => !isTreeItemNode(child)).map(child => child.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
}

function treeItemNodeToData(node) {
  if (typeof node?.toTreeItemData === 'function') {
    return node.toTreeItemData();
  }

  const children = Array.from(node?.children || []).filter(isTreeItemNode).map(treeItemNodeToData);
  return {
    label: node.getAttribute('label') || node.getAttribute('text') || node.getAttribute('title') || getDirectLabel(node),
    href: node.getAttribute('href') || '',
    target: node.getAttribute('target') || '',
    rel: node.getAttribute('rel') || '',
    type: node.getAttribute('kind') || node.getAttribute('type') || '',
    value: node.getAttribute('value') || '',
    open: node.hasAttribute('open') && node.getAttribute('open') !== 'false',
    selected: node.hasAttribute('selected') && node.getAttribute('selected') !== 'false',
    active: node.hasAttribute('active') && node.getAttribute('active') !== 'false',
    disabled: node.hasAttribute('disabled') && node.getAttribute('disabled') !== 'false',
    openIcon: node.getAttribute('open-icon') || '',
    closedIcon: node.getAttribute('closed-icon') || '',
    icon: !node.hasAttribute('icon') || node.getAttribute('icon') !== 'false',
    chevronOpenIcon: node.getAttribute('chevron-open-icon') || '',
    chevronClosedIcon: node.getAttribute('chevron-closed-icon') || '',
    openLabel: node.getAttribute('open-label') || '',
    closeLabel: node.getAttribute('close-label') || '',
    children
  };
}

/***/ },

/***/ "72dd7fe72ad5"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderIcon: () => (/* binding */ renderIcon),
/* harmony export */   renderTreeRow: () => (/* binding */ renderTreeRow)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // One row of a tree: the treeitem box, its chevron (or the spacer that keeps
// the chevron's column), its icon and its name. sf-tree draws every entry with
// it and sf-tree-item draws itself with it, so the row is one markup.
//
// Class markup only (standard 1.3.8 §18.4: a part that only shows a value is
// class markup): the icons are the icon font's <i class="sf-icon">, not sf-icon
// elements. Drawn as sf-tree-item and sf-icon elements, a row of a 2 000-node
// tree cost three Smart elements, and the tree took 33 s to draw
// (simai/ui-source#43).
//
// row:
//   id, value, label, href, target, rel, kind, open, selected, active,
//   disabled, icon, openIcon, closedIcon, chevronOpenIcon, chevronClosedIcon,
//   openLabel, closeLabel, hasChildren
//   level, setsize, posinset   aria-level and the rest, for a flat tree
//   tabStop                    the one row Tab reaches
//   selection                  'none' leaves aria-selected out
//   rootClass, itemClass, containerClass, nameClass, rootStyle
//   content                    what a standalone item draws for its name
//   onToggle, onName           handlers of the chevron and the name
// `children` is a template the caller draws after the container (the nested
// group of a standalone item); a tree passes none.

function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // Regular, not filled. A filled glyph was how a tree's icons carried their
// weight while they were painted at a quarter strength; at full strength the
// fill is a solid block beside a regular name, which is heavier than anything
// else in the row (owner, 2026-10-08).


function renderIcon(icon, className = '') {
  if (!icon) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${joinClasses('sf-icon', className)} aria-hidden="true">${icon}</i>`;
}

function renderName(row) {
  if (row.label) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${row.label}</span>`;
  return row.content !== undefined && row.content !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? row.content : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderTreeRow(row, children = lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
  const isFile = row.kind === 'file';
  const canToggle = !isFile && Boolean(row.hasChildren);
  const open = canToggle && Boolean(row.open);
  const itemClasses = joinClasses('sf-tree-item flex flex-col', row.kind ? `sf-tree-item--${row.kind}` : '', open ? 'open' : '', canToggle ? 'has-children' : '', row.selected || row.active ? 'active' : '', row.disabled ? 'disabled' : '', row.rootClass, row.itemClass);
  const containerClasses = joinClasses('sf-tree-item-container flex items-cross-center relative', row.containerClass);
  const nameClasses = joinClasses('sf-tree-item-name', row.nameClass);
  const nodeIcon = isFile ? 'draft' : open ? row.openIcon : row.closedIcon;
  const chevronIcon = open ? row.chevronOpenIcon : row.chevronClosedIcon;
  const level = row.level ? String(row.level) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${itemClasses}
      style=${[row.rootStyle, row.level ? `--sf-tree-level:${row.level}` : ''].filter(Boolean).join(';') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="treeitem"
      tabindex=${row.tabStop ? '0' : '-1'}
      aria-level=${level}
      aria-setsize=${row.setsize ? String(row.setsize) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-posinset=${row.posinset ? String(row.posinset) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-expanded=${canToggle ? String(open) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-selected=${row.selection === 'none' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(Boolean(row.selected))}
      aria-current=${row.active ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${row.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-open-icon=${row.openIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-closed-icon=${row.closedIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${row.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-entry=${row.id ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-tree-level=${level}
    ><div class=${containerClasses}>${canToggle ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" tabindex="-1" class="sf-icon-button sf-tree-toggle" ?disabled=${row.disabled} aria-expanded=${String(open)} aria-label=${open ? row.closeLabel : row.openLabel} @click=${row.onToggle}>${renderIcon(chevronIcon, 'sf-tree-chevron')}</button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-toggle-spacer" aria-hidden="true"></span>`}${row.icon === false ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderIcon(nodeIcon, 'sf-tree-node-icon')}${row.href && !row.disabled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${nameClasses} href=${row.href} target=${row.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} rel=${row.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} tabindex="-1" @click=${row.onName}>${renderName(row)}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${nameClasses} @click=${row.onName}>${renderName(row)}</span>`}</div>${children}</div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "cea13a5dfcb6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfTree: () => (/* binding */ SfTree)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _tree_item_js_node_data_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2fb8a633d966");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d9bd94b9a408");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("fb5cbd0ee7de");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d31d60a77b96");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("11ff8dfc051b");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("b7834e0e48fd");
/* harmony import */ var _tree_item_lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("873f949da61a");
/* harmony import */ var _tree_item_lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("73a6f336a620");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
// A tree of entries: folders that open, files and links. One Tab stop walked
// with the arrows, an optional selection, and drops of records and files on an
// entry.
//
// The entries (standard simai.smart-component 1.3.8 §18; simai/ui-source#43).
// The tree draws them itself, flat, as rows of class markup -- the row
// sf-tree-item draws (../tree-item/js/templates/row.js) -- keyed by id, so a
// change of one entry rewrites that row in place and nothing else. Drawn as a
// nest of sf-tree-item elements, each with sf-icon elements in it, a tree of
// 2 000 nodes took 33 s to draw and 16.6 s for any change: every change built
// every element again, and every element that drew asked every other one for
// its tab stop. Over 300 visible entries only the rows in view of the nearest
// scroller are drawn, between two spacers (§18.4, `window`).
//
// From its component.json (§3, §4, §8): the settings are made by
// core/js/element-manifest.js; the events are open, select, toggle, move,
// attach and window, the old names their dated aliases (aliases.json).









 // What a list writes when its rows are dragged: {ids, source}.

const RECORDS_TYPE = 'application/x-sf-records+json'; // Quality profile gate 17 (window_from_entries): a tree that may hold more
// entries than this draws only those in view.

const WINDOW_FROM = 300; // Rows drawn beyond the view on each side, and the height a row is taken to
// have before one has been measured.

const WINDOW_MARGIN = 20;
const ROW_GUESS = 48;

const text = value => value === undefined || value === null ? '' : String(value);

const pick = (item, kebab, camel) => item[kebab] !== undefined ? item[kebab] : item[camel]; // One entry as the tree holds it: the fields of component.json's entry shape
// (kebab-case), read from the camelCase ones too, with its id (§18.1).


function normalizeEntry(item, place) {
  if (!item || typeof item !== 'object') return null;
  const value = text(item.value);
  const id = text(item.id ?? (value !== '' ? value : place));
  const children = Array.isArray(item.children) ? item.children : [];
  return {
    id,
    value,
    label: text(item.label ?? item.text ?? item.title),
    href: text(item.href),
    target: text(item.target),
    rel: text(item.rel),
    // `kind` is the axis; `type` the legacy name.
    kind: text(item.kind || item.type) === 'file' ? 'file' : 'folder',
    open: Boolean(item.open),
    selected: Boolean(item.selected),
    active: Boolean(item.active),
    disabled: Boolean(item.disabled),
    icon: item.icon !== false,
    openIcon: text(pick(item, 'open-icon', 'openIcon')),
    closedIcon: text(pick(item, 'closed-icon', 'closedIcon')),
    chevronOpenIcon: text(pick(item, 'chevron-open-icon', 'chevronOpenIcon')),
    chevronClosedIcon: text(pick(item, 'chevron-closed-icon', 'chevronClosedIcon')),
    openLabel: text(pick(item, 'open-label', 'openLabel')),
    closeLabel: text(pick(item, 'close-label', 'closeLabel')),
    revision: text(item.revision),
    children
  };
}

const TreeElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  // The chevron's names are sf-tree-item's words.
  lang: {
    en: { ..._lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
      runtime: { ..._tree_item_lang_en_json__WEBPACK_IMPORTED_MODULE_8__.runtime,
        ..._lang_en_json__WEBPACK_IMPORTED_MODULE_6__.runtime
      }
    },
    ru: { ..._lang_ru_json__WEBPACK_IMPORTED_MODULE_7__,
      runtime: { ..._tree_item_lang_ru_json__WEBPACK_IMPORTED_MODULE_9__.runtime,
        ..._lang_ru_json__WEBPACK_IMPORTED_MODULE_7__.runtime
      }
    }
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__,
  actions: {
    expand({
      id
    }) {
      return this.setEntryOpen(id, true);
    },

    collapse({
      id
    }) {
      return this.setEntryOpen(id, false);
    },

    'focus-entry'({
      id
    }) {
      const at = this._rows.findIndex(row => row.id === text(id));

      if (at < 0) return {
        outcome: 'refused',
        reason: 'unknown'
      };
      this.focusRow(at);
      return {
        outcome: 'applied'
      };
    }

  }
});

class SfTree extends TreeElement {
  constructor() {
    super();
    this._itemObserver = null;
    this._source = [];
    this._entries = new Map();
    this._open = new Map();
    this._rows = [];
    this._tabStop = null;
    this._typeahead = '';
    this._typeaheadTimer = null;
    this._window = {
      first: 0,
      last: -1
    };
    this._rowHeight = 0;
    this._scroller = null;
    this._frame = 0;
  } // ---- the entries -------------------------------------------------------
  // Entries may arrive as data or as sf-tree-item children. The children are
  // read once and removed, and the tree watches only for children appearing.


  get items() {
    return this._source;
  }

  set items(value) {
    this._source = Array.isArray(value) ? value : [];
    this.takeEntries(true);
    this.requestComponentUpdate('items');
  }

  captureInitialItems(append = false) {
    const nodes = Array.from(this.childNodes || []).filter(_tree_item_js_node_data_js__WEBPACK_IMPORTED_MODULE_2__.isTreeItemNode);
    if (!nodes.length) return false;
    const next = nodes.map(_tree_item_js_node_data_js__WEBPACK_IMPORTED_MODULE_2__.treeItemNodeToData);
    this._source = append ? [...this._source, ...next] : next;
    nodes.forEach(node => node.remove());
    this.takeEntries(false);
    return true;
  }

  observeItemChildren() {
    if (this._itemObserver) return;
    this._itemObserver = new MutationObserver(mutations => {
      const added = mutations.some(mutation => Array.from(mutation.addedNodes || []).some(_tree_item_js_node_data_js__WEBPACK_IMPORTED_MODULE_2__.isTreeItemNode));
      if (added && this.captureInitialItems(true)) this.requestComponentUpdate('items');
    });

    this._itemObserver.observe(this, {
      childList: true
    });
  } // Reads the source into entries by id. The open state of an id seen before
  // survives (§18.1 entry state); the selection keeps the ids still present,
  // or is set by the entries when they say selected (§18.2).


  takeEntries(fromData) {
    const entries = new Map();
    const said = [];

    const walk = (list, parent, prefix) => list.map((item, index) => {
      const entry = normalizeEntry(item, prefix ? `${prefix}/${index}` : String(index));
      if (!entry || entries.has(entry.id)) return null;
      entry.parent = parent;
      entries.set(entry.id, entry);
      if (!this._open.has(entry.id)) this._open.set(entry.id, entry.open);
      if (entry.selected) said.push(entry.id);
      entry.childIds = walk(entry.children, entry.id, entry.id).filter(Boolean);
      return entry.id;
    });

    this._roots = walk(this._source, null, '').filter(Boolean);
    this._rowsDirty = true;

    for (const id of [...this._open.keys()]) if (!entries.has(id)) this._open.delete(id);

    this._entries = entries;
    const before = this.selectionIds();
    let next;
    if (said.length) next = this.selection === 'many' ? said : [said.at(-1)];else next = before.filter(id => entries.has(id));
    this.writeSelection(next, {
      quiet: !fromData || same(before, next)
    });
  } // The visible entries in order, with their level and place among siblings.
  // Kept until the entries or an open state change: a scroll only moves the
  // window over the same rows.


  flatten() {
    if (!this._rowsDirty && this._rows) return this._rows;
    this._rowsDirty = false;
    const rows = [];

    const visit = (ids, level) => ids.forEach((id, index) => {
      const entry = this._entries.get(id);

      const branch = entry.kind !== 'file' && entry.childIds.length > 0;
      const open = branch && this._open.get(id) === true;
      rows.push({
        id,
        entry,
        level,
        setsize: ids.length,
        posinset: index + 1,
        branch,
        open
      });
      if (open) visit(entry.childIds, level + 1);
    });

    visit(this._roots || [], 1);
    this._rows = rows;
    this._hasBranches = rows.some(row => row.branch) || [...this._entries.values()].some(entry => entry.childIds.length);
    return rows;
  } // ---- selection (§18.2) -------------------------------------------------


  selectionIds() {
    if (this.selection === 'many') return Array.isArray(this.selectedIds) ? this.selectedIds.map(text) : [];
    const one = text(this.selected);
    return one ? [one] : [];
  }

  writeSelection(ids, {
    quiet = true
  } = {}) {
    const ordered = [...this._entries.keys()].filter(id => ids.includes(id));
    this.__sfManifestData = this.__sfManifestData || {};
    this.__sfManifestData['selected-ids'] = ordered;
    const current = ids.at(-1) ?? '';

    if (text(this.getAttribute('selected')) !== current) {
      if (current) this.setAttribute('selected', current);else this.removeAttribute('selected');
    }

    if (!quiet) this.requestComponentUpdate('selection');
    return ordered;
  }

  get selectedIds() {
    return this.__sfManifestData?.['selected-ids'] ?? [];
  }

  set selectedIds(value) {
    this.writeSelection((Array.isArray(value) ? value : []).map(text));
    this.requestComponentUpdate('selected-ids');
  }

  isSelected(id) {
    return this.selection !== 'none' && this.selectionIds().includes(id);
  }

  selectRow(row) {
    const mode = this.selection;
    if (mode !== 'one' && mode !== 'many') return;
    const ids = this.selectionIds();
    const on = mode === 'many' ? !ids.includes(row.id) : true;
    const next = mode === 'many' ? on ? [...ids, row.id] : ids.filter(id => id !== row.id) : [row.id];
    const ordered = this.writeSelection(next, {
      quiet: false
    });
    this.sfEmit('select', {
      ids: ordered,
      id: row.id,
      selected: on
    });
  } // ---- open state (§18.1) ------------------------------------------------


  setEntryOpen(id, open) {
    const entry = this._entries.get(text(id));

    if (!entry) return {
      outcome: 'refused',
      reason: 'unknown'
    };
    if (entry.kind === 'file' || !entry.childIds.length) return {
      outcome: 'refused',
      reason: 'leaf'
    };
    if (entry.disabled) return {
      outcome: 'refused',
      reason: 'disabled'
    };
    if (this._open.get(entry.id) === Boolean(open)) return {
      outcome: 'applied'
    };

    this._open.set(entry.id, Boolean(open));

    this._rowsDirty = true;
    this.requestComponentUpdate('open');
    this.sfEmit('toggle', {
      id: entry.id,
      open: Boolean(open),
      value: entry.value
    });
    return {
      outcome: 'applied'
    };
  } // ---- the old details (aliases.json) ------------------------------------


  rowElement(id) {
    if (id === undefined || id === null) return null;
    return this.querySelector(`.sf-tree-item[data-sf-entry="${CSS.escape(String(id))}"]`);
  }

  sfAliasAdapters() {
    const item = detail => this.rowElement(detail.id ?? detail.parent);

    return {
      'sf-tree-selection-change': detail => ({
        item: item(detail),
        selected: detail.selected,
        value: this._entries.get(detail.id)?.value ?? ''
      }),
      'sf-tree-item-click': detail => ({
        item: item(detail),
        value: detail.value,
        originalEvent: this._pressEvent ?? null
      }),
      'sf-tree-item-toggle': detail => ({
        item: item(detail),
        open: detail.open,
        value: detail.value
      }),
      'sf-tree-records-drop': detail => ({
        value: this._entries.get(detail.parent)?.value ?? '',
        ids: detail.ids,
        source: detail.source
      }),
      'sf-tree-files-drop': detail => ({
        value: this._entries.get(detail.parent)?.value ?? '',
        files: detail.files
      })
    };
  } // The helper the docs show: the row's element first, as the item was.


  onToggle(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-tree-toggle', event => handler(this.rowElement(event.detail?.id), event.detail, event), options);
    }

    return this;
  }

  getRenderedItems() {
    return Array.from(this.querySelectorAll('.sf-tree-item[data-sf-entry]'));
  }

  getVisibleItems() {
    return this.getRenderedItems();
  } // ---- drops (owner, 2026-10-15, the file manager) -----------------------
  // An entry takes records dragged from a list -- accept-records -- and files
  // from the computer -- accept-files. The tree moves and uploads nothing
  // itself; it asks: move {ids, parent} and attach {files, parent}. The
  // records travel as application/x-sf-records+json, which sf-table writes.


  dropKind(event) {
    const types = [...(event.dataTransfer?.types ?? [])];
    if (this.acceptRecords && types.includes(RECORDS_TYPE)) return 'records';
    if (this.acceptFiles && types.includes('Files')) return 'files';
    return null;
  }

  dropNode(event) {
    const node = event.target?.closest?.('.sf-tree-item[data-sf-entry]');
    return node && this.contains(node) && node.getAttribute('aria-disabled') !== 'true' ? node : null;
  }

  markDropTarget(node) {
    if (this._dropTarget === node) return;
    this._dropTarget?.removeAttribute('data-sf-drop-target');
    this._dropTarget = node;
    node?.setAttribute('data-sf-drop-target', '');
  }

  handleTreeDragOver = event => {
    const kind = this.dropKind(event);
    const node = kind ? this.dropNode(event) : null;

    if (!node) {
      this.markDropTarget(null);
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = kind === 'files' ? 'copy' : 'move';
    this.markDropTarget(node);
  };
  handleTreeDragLeave = event => {
    if (!this.contains(event.relatedTarget)) this.markDropTarget(null);
  };
  handleTreeDrop = event => {
    const kind = this.dropKind(event);
    const node = kind ? this.dropNode(event) : null;
    this.markDropTarget(null);
    if (!node) return;
    event.preventDefault();
    const parent = node.dataset.sfEntry;

    if (kind === 'files') {
      this.sfEmit('attach', {
        files: [...event.dataTransfer.files],
        parent
      });
      return;
    }

    let payload = {};

    try {
      payload = JSON.parse(event.dataTransfer.getData(RECORDS_TYPE) || '{}');
    } catch {
      payload = {};
    }

    const ids = Array.isArray(payload.ids) ? payload.ids.map(String) : [];
    if (!ids.length) return;
    this.sfEmit('move', {
      ids,
      parent,
      before: null,
      source: payload.source ?? null
    });
  }; // ---- lifecycle ---------------------------------------------------------

  connectedCallback() {
    this.addEventListener('dragover', this.handleTreeDragOver);
    this.addEventListener('dragleave', this.handleTreeDragLeave);
    this.addEventListener('drop', this.handleTreeDrop);
    this.addEventListener('keydown', this.handleTreeKeydown);
    this.addEventListener('focusin', this.handleTreeFocusIn);
    this.addEventListener('click', this.handleTreeClick);
    this.observeItemChildren();
    this.captureInitialItems();
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.removeEventListener('dragover', this.handleTreeDragOver);
    this.removeEventListener('dragleave', this.handleTreeDragLeave);
    this.removeEventListener('drop', this.handleTreeDrop);
    this.markDropTarget(null);
    this.removeEventListener('keydown', this.handleTreeKeydown);
    this.removeEventListener('focusin', this.handleTreeFocusIn);
    this.removeEventListener('click', this.handleTreeClick);
    clearTimeout(this._typeaheadTimer);
    this._itemObserver?.disconnect();
    this._itemObserver = null;
    this.unwatchScroll();
    super.disconnectedCallback();
  } // ---- the window (§18.4) ------------------------------------------------
  // The nearest ancestor that scrolls, or the page.


  scroller() {
    for (let node = this.parentElement; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
      const overflow = getComputedStyle(node).overflowY;
      if (overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay') return node;
    }

    return window;
  }

  watchScroll() {
    if (this._scroller) return;
    this._scroller = this.scroller();

    this._onScroll = () => {
      if (this._frame) return;
      this._frame = requestAnimationFrame(() => {
        this._frame = 0;
        if (this.windowed() && !same(this.windowRange(), [this._window.first, this._window.last])) this.requestComponentUpdate('window');
      });
    };

    this._scroller.addEventListener('scroll', this._onScroll, {
      passive: true
    });

    window.addEventListener('resize', this._onScroll, {
      passive: true
    });
  }

  unwatchScroll() {
    if (!this._scroller) return;

    this._scroller.removeEventListener('scroll', this._onScroll);

    window.removeEventListener('resize', this._onScroll);
    cancelAnimationFrame(this._frame);
    this._frame = 0;
    this._scroller = null;
  }

  windowed() {
    return this._rows.length > WINDOW_FROM;
  } // The rows in view of the scroller, plus the margin: [first, last].


  windowRange() {
    const count = this._rows.length;
    const height = this._rowHeight || ROW_GUESS;
    const list = this.querySelector(':scope > .sf-tree');
    if (!list || !this.isConnected) return [0, Math.min(count, 60) - 1];
    const top = list.getBoundingClientRect().top;
    let viewTop = 0;
    let viewBottom = window.innerHeight;

    if (this._scroller && this._scroller !== window) {
      const box = this._scroller.getBoundingClientRect();

      viewTop = Math.max(box.top, 0);
      viewBottom = Math.min(box.bottom, window.innerHeight);
    }

    let first = Math.floor((viewTop - top) / height) - WINDOW_MARGIN;
    let last = Math.ceil((viewBottom - top) / height) + WINDOW_MARGIN;
    first = Math.max(0, Math.min(first, count - 1));
    last = Math.max(first, Math.min(last, count - 1)); // A row the keyboard asked for is drawn even outside the view: the window
    // moves to it, the same size.

    const want = this._want;

    if (want !== undefined && want >= 0 && (want < first || want > last)) {
      const size = last - first;
      first = Math.max(0, Math.min(want - WINDOW_MARGIN, count - 1 - size));
      last = Math.min(count - 1, first + size);
    }

    return [first, last];
  }

  measureRow() {
    const row = this.querySelector(':scope > .sf-tree > .sf-tree-item');
    const list = row?.parentElement;
    if (!row || !list) return;
    const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
    const height = row.getBoundingClientRect().height + gap;

    if (height > 0) {
      this._rowHeight = height;
      this._gap = gap;
    }
  } // ---- focus: one Tab stop (roving tabindex) -----------------------------


  tabStopIndex() {
    const at = id => id ? this._rows.findIndex(row => row.id === id) : -1;

    const stop = at(this._tabStop);
    if (stop >= 0) return stop;

    const chosen = this._rows.findIndex(row => this.isSelected(row.id) || row.entry.active);

    return chosen >= 0 ? chosen : this._rows.length ? 0 : -1;
  } // Focus moves without a smooth scroll: a page that scrolls smoothly would
  // carry the row out of the window halfway and the focus with it.


  focusRow(index) {
    const row = this._rows[index];
    if (!row) return;
    this._tabStop = row.id;

    const show = element => {
      element.scrollIntoView?.({
        block: 'nearest',
        behavior: 'instant'
      });
      element.focus({
        preventScroll: true
      });
    };

    const drawn = this.rowElement(row.id);

    if (drawn) {
      this.syncTabStop();
      show(drawn);
      return;
    } // Outside the window: scroll to where it will be, draw it, then focus it.


    const list = this.querySelector(':scope > .sf-tree');
    const scroller = this._scroller || this.scroller();

    if (list) {
      const offset = index * (this._rowHeight || ROW_GUESS);

      if (scroller === window) {
        window.scrollTo({
          top: window.scrollY + list.getBoundingClientRect().top + offset - window.innerHeight / 2,
          behavior: 'instant'
        });
      } else {
        const top = scroller.scrollTop + list.getBoundingClientRect().top - scroller.getBoundingClientRect().top + offset - scroller.clientHeight / 2;
        scroller.scrollTo({
          top,
          behavior: 'instant'
        });
      }
    }

    this._want = index;
    this.requestComponentUpdate('focus');
    this.whenRendered?.(() => {
      this._want = undefined;
      const element = this.rowElement(row.id);
      if (element) show(element);
    }, {
      next: true
    });
  } // The drawn rows' tabindex, without a redraw: the tab stop, or the first
  // drawn row when the window holds the tab stop out.


  syncTabStop() {
    const rows = this.getRenderedItems();
    const stop = this._rows[this.tabStopIndex()]?.id;
    const target = rows.find(row => row.dataset.sfEntry === stop) || rows[0];

    for (const row of rows) row.tabIndex = row === target ? 0 : -1;
  }

  rowIndexOf(event) {
    const node = event.target?.closest?.('.sf-tree-item[data-sf-entry]');
    if (!node || !this.contains(node)) return -1;
    return this._rows.findIndex(row => row.id === node.dataset.sfEntry);
  }

  handleTreeFocusIn = event => {
    const at = this.rowIndexOf(event);
    if (at < 0) return;
    this._tabStop = this._rows[at].id;
    this.syncTabStop();
  }; // A press selects, the way the space bar does; the chevron stops its own
  // press, so opening a branch is still not choosing it.

  handleTreeClick = event => {
    const at = this.rowIndexOf(event);
    if (at < 0) return;
    const row = this._rows[at];
    this._tabStop = row.id;
    this.syncTabStop();
    if (row.entry.disabled) return;
    if (this.selection === 'one' || this.selection === 'many') this.selectRow(row);
  }; // A press on a name: the request open {id}. A link still follows itself.

  pressName(row, event) {
    if (row.entry.disabled) {
      event?.preventDefault();
      return;
    }

    this._pressEvent = event ?? null;
    this.sfEmit('open', {
      id: row.id,
      value: row.entry.value
    });
    this._pressEvent = null;
  }

  activateRow(row) {
    if (row.entry.disabled) return;
    const link = this.rowElement(row.id)?.querySelector(':scope > .sf-tree-item-container > a[href]');
    if (link) link.click();else this.pressName(row, null);
  }

  moveTypeahead(index, key) {
    clearTimeout(this._typeaheadTimer);
    this._typeahead += key.toLocaleLowerCase();
    this._typeaheadTimer = setTimeout(() => {
      this._typeahead = '';
    }, 500);
    const count = this._rows.length;

    for (let step = 1; step <= count; step += 1) {
      const at = (index + step) % count;

      if (this._rows[at].entry.label.trim().toLocaleLowerCase().startsWith(this._typeahead)) {
        this.focusRow(at);
        return;
      }
    }
  }

  handleTreeKeydown = event => {
    const index = this.rowIndexOf(event);
    if (index < 0 || event.target.closest('.sf-tree-item[data-sf-entry]') !== event.target) return;
    const row = this._rows[index];
    const last = this._rows.length - 1;
    let target = -1;
    let handled = true;

    switch (event.key) {
      case 'ArrowDown':
        target = Math.min(index + 1, last);
        break;

      case 'ArrowUp':
        target = Math.max(index - 1, 0);
        break;

      case 'Home':
        target = 0;
        break;

      case 'End':
        target = last;
        break;

      case 'ArrowRight':
        if (row.branch && !row.open) this.setEntryOpen(row.id, true);else if (row.open) target = index + 1;
        break;

      case 'ArrowLeft':
        if (row.branch && row.open) this.setEntryOpen(row.id, false);else if (row.entry.parent !== null) target = this._rows.findIndex(one => one.id === row.entry.parent);
        break;

      case 'Enter':
        if (row.branch) this.setEntryOpen(row.id, !row.open);else this.activateRow(row);
        break;

      case ' ':
        if (this.selection === 'none') this.activateRow(row);else if (!row.entry.disabled) this.selectRow(row);
        break;

      default:
        handled = false;
    }

    if (!handled && event.key.length === 1 && !event.altKey && !event.metaKey && !event.ctrlKey) {
      this.moveTypeahead(index, event.key);
      handled = true;
    }

    if (!handled) return;
    event.preventDefault();
    event.stopPropagation();
    if (target >= 0) this.focusRow(target);
  }; // ---- drawing -----------------------------------------------------------

  rowContext(row, tabStopId) {
    const entry = row.entry;
    const selected = this.isSelected(row.id);
    return {
      id: row.id,
      value: entry.value,
      label: entry.label,
      href: entry.href,
      target: entry.target,
      rel: entry.rel,
      kind: entry.kind,
      open: row.open,
      selected,
      active: entry.active,
      disabled: entry.disabled,
      icon: entry.icon,
      openIcon: entry.openIcon || 'folder_open',
      closedIcon: entry.closedIcon || 'folder',
      chevronOpenIcon: entry.chevronOpenIcon || 'keyboard_arrow_down',
      chevronClosedIcon: entry.chevronClosedIcon || 'chevron_right',
      openLabel: entry.openLabel || this._words.open,
      closeLabel: entry.closeLabel || this._words.close,
      hasChildren: row.branch,
      level: row.level,
      setsize: row.setsize,
      posinset: row.posinset,
      tabStop: row.id === tabStopId,
      selection: this.selection,
      onToggle: row.onToggle,
      onName: row.onName
    };
  } // Handlers made once per id, so a redraw binds the same functions and Lit
  // leaves the rows' listeners alone.


  handlersFor(id) {
    if (!this._handlers) this._handlers = new Map();

    let handlers = this._handlers.get(id);

    if (!handlers) {
      handlers = {
        onToggle: event => {
          event.preventDefault();
          event.stopPropagation();

          const row = this._rows.find(one => one.id === id);

          if (row && !row.entry.disabled) this.setEntryOpen(id, !row.open);
        },
        onName: event => {
          const row = this._rows.find(one => one.id === id);

          if (row) this.pressName(row, event);
        }
      };

      this._handlers.set(id, handlers);
    }

    return handlers;
  }

  templateContext() {
    const rows = this.flatten();

    for (const id of [...(this._handlers?.keys() ?? [])]) if (!this._entries.has(id)) this._handlers.delete(id);

    this._words = {
      open: this.sfWord('open-label'),
      close: this.sfWord('close-label')
    };
    const tabStopId = rows[this.tabStopIndex()]?.id;
    let first = 0;
    let last = rows.length - 1;

    if (this.windowed()) {
      this.watchScroll();
      [first, last] = this.windowRange();
    }

    const changed = first !== this._window.first || last !== this._window.last;
    this._window = {
      first,
      last
    };
    if (changed && this.windowed()) queueMicrotask(() => this.sfEmit('window', {
      first,
      last
    }));
    const height = this._rowHeight || ROW_GUESS;
    const drawn = rows.slice(first, last + 1).map(row => this.rowContext({ ...row,
      ...this.handlersFor(row.id)
    }, tabStopId));
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      rows: drawn,
      // The first drawn row stands in for the tab stop the window holds out.
      tabStopDrawn: drawn.some(row => row.tabStop),
      // A spacer stands for the rows it replaces; the list's gap after it is
      // one of theirs.
      before: this.windowed() && first > 0 ? Math.max(0, first * height - (this._gap || 0)) : 0,
      after: this.windowed() && last < rows.length - 1 ? Math.max(0, (rows.length - 1 - last) * height - (this._gap || 0)) : 0,
      hasBranches: this._hasBranches,
      selection: this.selection,
      ariaLabel: this.getAttribute('aria-label') || '',
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderTreeTemplate)(this.templateContext());
  } // A row is measured after every drawing: the first one may be drawn before
  // the sheets arrive, taller than it will be. A height that changed places
  // the spacers again.


  afterRender(changedAttributes) {
    super.afterRender?.(changedAttributes);
    if (!this._rows.length) return;
    const before = this._rowHeight;
    this.measureRow();
    if (this.windowed() && Math.abs((this._rowHeight || 0) - (before || 0)) > 0.5) this.requestComponentUpdate('window');
  }

}

function same(a, b) {
  return a.length === b.length && a.every((one, index) => one === b[index]);
}

SfTree.define('sf-tree');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d9bd94b9a408"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTreeTemplate: () => (/* binding */ renderTreeTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d9131aa10ba");
/* harmony import */ var _tree_item_js_templates_row_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("72dd7fe72ad5");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8a0d367d7d58");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__, _tree_item_js_templates_row_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__, _tree_item_js_templates_row_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);





function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // The tree's entries, flat and keyed by id (standard 1.3.8 §18.4): a row that
// stays keeps its element, and only what changed in it is written. Over 300
// visible entries the rows outside the view are two spacers.


function renderTreeTemplate(context) {
  const rootClasses = joinClasses('sf-tree flex flex-col', context.rootClass);
  const rows = context.tabStopDrawn || !context.rows.length ? context.rows : [{ ...context.rows[0],
    tabStop: true
  }, ...context.rows.slice(1)];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="tree"
      data-sf-tree-flat=${context.hasBranches ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'true'}
      aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-multiselectable=${context.selection === 'many' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >${context.before ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tree-spacer" aria-hidden="true" style=${`block-size:${context.before}px`}></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(rows, row => row.id, row => (0,_tree_item_js_templates_row_js__WEBPACK_IMPORTED_MODULE_2__.renderTreeRow)(row))}${context.after ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tree-spacer" aria-hidden="true" style=${`block-size:${context.after}px`}></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8a0d367d7d58"
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

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

/***/ },

/***/ "873f949da61a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tree item","runtime":{"open-label":"Open item","close-label":"Close item"}}');

/***/ },

/***/ "73a6f336a620"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Элемент дерева","runtime":{"open-label":"Развернуть","close-label":"Свернуть"}}');

/***/ },

/***/ "d31d60a77b96"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tree for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"role","to":null,"kind":"attribute","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"the tree is always role tree; no shim"},{"from":"single","to":"one","kind":"value","setting":"selection","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","section":"§18.2"},{"from":"multiple","to":"many","kind":"value","setting":"selection","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","section":"§18.2"},{"from":"sf-tree-selection-change","to":"sf-tree-select","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-selection-change","to":"select"},"section":"§8, vocabulary 1.1.5 §5","note":"the old detail {item, selected, value}, item the row\'s element"},{"from":"sf-tree-item-click","to":"sf-tree-open","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-item-click","to":"open"},"section":"§8, vocabulary 1.1.5 §5","note":"sent by the sf-tree-item elements the tree drew; detail {item, value, originalEvent}"},{"from":"sf-tree-item-toggle","to":"sf-tree-toggle","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-item-toggle","to":"toggle"},"section":"§8, vocabulary 1.1.5 §5","note":"sent by the sf-tree-item elements the tree drew; detail {item, open, value}"},{"from":"sf-tree-records-drop","to":"sf-tree-move","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-records-drop","to":"move"},"section":"§8, vocabulary 1.1.5 §5","note":"detail {value, ids, source}"},{"from":"sf-tree-files-drop","to":"sf-tree-attach","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-files-drop","to":"attach"},"section":"§8, vocabulary 1.1.5 §5","note":"detail {value, files}"}]}');

/***/ },

/***/ "fb5cbd0ee7de"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-tree\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/tree (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.tree","tag":"sf-tree","version":"2.0.1","kind":"leaf","family":"tree","settings":{"selection":{"type":"enum","values":["none","one","many"],"default":"none","summary":"What a press does: none opens the entry (or follows its link), one selects one entry, many toggles each"},"items":{"type":"list","default":[],"of":{"id":"id","label":"string","href":"string","target":"string","rel":"string","kind":{"type":"enum","values":["folder","file"]},"value":"string","open":"boolean","selected":"boolean","active":"boolean","disabled":"boolean","icon":"boolean","open-icon":"icon","closed-icon":"icon","chevron-open-icon":"icon","chevron-closed-icon":"icon","open-label":"string","close-label":"string","revision":"string","children":"list"},"entries":{"key":"id","changes":"content"},"summary":"The tree as data: entries with children; sf-tree-item children written inside are read once otherwise. An entry\'s id is id, else value, else its place"},"accept-records":{"type":"boolean","default":false,"summary":"An entry takes records dragged from a list (application/x-sf-records+json)"},"accept-files":{"type":"boolean","default":false,"summary":"An entry takes files dragged from the computer"}},"values":{"selected":{"type":"id","default":"","summary":"The current entry\'s id (§18.2); with selection many, the one pressed last"},"selected-ids":{"type":"list","default":[],"of":{"id":"id"},"summary":"The selected ids in entry order, with selection many (§18.2)"}},"selection":"many","entry-state":{"open":"boolean"},"window":true,"events":{"open":{"carries":{"id":"id","value":"string"},"summary":"A press on an entry\'s name, or Enter on a leaf without a link (vocabulary 1.1.5 §5 open)"},"select":{"carries":{"ids":"list","id":"id","selected":"boolean"},"summary":"The selection changed: ids is the whole selection, id the entry pressed and selected whether it is now selected (vocabulary §5 select)"},"toggle":{"carries":{"id":"id","open":"boolean","value":"string"},"summary":"A branch opened or closed (vocabulary §5 toggle)"},"move":{"carries":{"ids":"list","parent":"id","before":{"type":"id","nullable":true},"source":"string"},"summary":"Records dragged from a list were dropped on an entry: the request to move them into it (vocabulary §5 move); the tree moves nothing itself"},"attach":{"carries":{"files":"list","parent":"id"},"summary":"Files were dropped on an entry: the request to attach them there (vocabulary §5 attach); the tree uploads nothing itself"},"window":{"carries":{"first":"number","last":"number"},"summary":"With more than 300 visible entries, which of them are drawn (§18.4)"}},"actions":{"expand":{"with":{"id":"id"},"x-outcomes":["applied","refused"],"summary":"Opens a branch; refused for an unknown id, a leaf or a disabled entry"},"collapse":{"with":{"id":"id"},"x-outcomes":["applied","refused"]},"focus-entry":{"with":{"id":"id"},"x-outcomes":["applied","refused"],"summary":"Moves the focus to an entry, drawing it first when the window holds it out"}},"slots":{"default":{"default":true}},"keyboard":{"row":{"Tab":"reach","ArrowDown":"focus:next","ArrowUp":"focus:prev","Home":"focus:first","End":"focus:last","ArrowRight":"open","ArrowLeft":"close","Enter":"open","Space":"select"}},"templates":{"default":{"file":"js/templates/default.js","$comment":"The Lit template in JavaScript, the migration form of §5.2 (§16). The entries are rows of class markup drawn with sf-tree-item\'s js/templates/row.js, keyed by id."}},"examples":"examples.json","docs":"docs/docs.md","lang":"lang/","accessibility":{"$comment":"The tree is role tree, named by its aria-label; its entries are treeitems drawn flat with aria-level, aria-setsize and aria-posinset, one Tab stop that the arrows move (roving tabindex). ArrowRight opens a branch or goes to its first child, ArrowLeft closes it or goes to the parent, Enter opens a branch or the entry, Space selects; typing a letter moves to the next entry starting with it.","role":"tree","name":{"from":["aria-label","aria-labelledby"]},"keys":{"Tab":"reach","ArrowDown":"focus:next","ArrowUp":"focus:prev","Home":"focus:first","End":"focus:last","ArrowRight":"open","ArrowLeft":"close","Enter":"open","Space":"select"}},"css-variables":{"--sf-tree-gap":{"type":"length","state":"default"},"--sf-tree-padding-inline":{"type":"length","state":"default"},"--sf-tree-indent":{"type":"length","state":"default"},"--sf-tree-radius":{"type":"length","state":"default"},"--sf-tree-color":{"type":"color","state":"default"},"--sf-tree-selected-background-color":{"type":"color","state":"selected"}},"x-summary":"A tree of entries: folders that open, files and links; one Tab stop walked with the arrows, optional selection, drops of records and files on an entry. Thousands of entries: keyed rows, a window over more than 300.","x-source":{"package":"framework","folder":"tree","manifest":"simai/ui-source@5100227 src/smart/tree/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/tree.component.json"},"x-renamed":["settings.aria-label, settings.role: host attributes, read by the base, never settings (§3.1); role is always tree","settings.selection: single | multiple → one | many (§18.2); the old words are dated value aliases","events.sf-tree-selection-change {item, selected, value} → select {ids, id, selected} (vocabulary 1.1.5 §5.1: sf-tree:selection-change → sf-tree-select); a dated split alias","events.sf-tree-item-click (bubbling from the drawn sf-tree-item) → open {id, value} (vocabulary §5.1: sf-tree:activate → sf-tree-open); a dated split alias","events.sf-tree-item-toggle (bubbling from the drawn sf-tree-item) → toggle {id, open, value} (vocabulary §5.1: sf-tree:toggle → sf-tree-toggle); a dated split alias","events.sf-tree-records-drop {value, ids, source} → move {ids, parent, before: null, source} (vocabulary §5 move); a dated split alias","events.sf-tree-files-drop {value, files} → attach {files, parent} (vocabulary §5 attach); a dated split alias","the entries: sf-tree-item elements → rows of class markup (§18.4); the row markup (.sf-tree-item[role=treeitem][data-value], .sf-tree-item-container, .sf-tree-item-name) is the one sf-tree-item drew"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"fixture","effects":"component","forbidden_client_responsibilities":["backend access decisions","host route invention"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile"],"skeleton":{"shape":"menu","while_loading":"none"}},"ai_guidance":{"use_when":"Use sf-tree for file-like, taxonomy or navigation hierarchies that need composite keyboard navigation.","do_not":["Do not copy generated ui-smart code","Do not use Tree for a short independent disclosure list","Do not move host data, persistence or access decisions into the component"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<sf-tree aria-label=\\"Папки\\" selection=\\"one\\"><sf-tree-item label=\\"Документы\\" value=\\"docs\\" open><sf-tree-item label=\\"Договор.pdf\\" kind=\\"file\\" value=\\"contract\\"></sf-tree-item></sf-tree-item></sf-tree>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["§18.4 and simai/ui-source#43 (2 000 nodes: 33 s to draw, 16.6 s per change): the tree draws its entries itself, flat, as rows of class markup (sf-tree-item\'s js/templates/row.js) keyed by id with Lit\'s repeat; a change of one entry rewrites that row\'s changed parts in place. The rows hold no Smart element (the icons are the icon font\'s <i>, not sf-icon), about 20 DOM nodes a row. Over 300 visible entries (quality profile gate 17, window_from_entries) only the rows in view of the nearest scroller, plus a margin, are drawn between two spacers, and window {first, last} is reported; the keyboard and focus-entry draw an entry before they focus it. Measured before and after with stand 20\'s method (x-measured).","the entries are no longer sf-tree-item elements inside the tree: sf-tree-item children are read once as data and removed, as before, and the rows keep the markup the item drew (.sf-tree-item[role=treeitem][data-value] > .sf-tree-item-container > .sf-tree-item-name), so styling and drop targets still find them. A page that queried sf-tree-item elements inside a tree finds rows instead (ui-pro sf-property-view\'s tests count them: a handoff).","entry ids (§18.1): id, else value, else the entry\'s place (0/2/1); data-value stays the value. The entries\' fields are kebab-case (open-icon, …); the camelCase fields and type are still read.","entry-state open (§18.1): whether a branch is open is the tree\'s, keyed by id; an entry\'s open seeds it the first time its id is seen and it survives a new items; expand and collapse change it.","selection (§18.2): none | one | many, the old single | multiple dated value aliases. The value selected is the current entry\'s id and selected-ids the list for many, both writable; a new items keeps the ids still present. An items whose entries say selected: true sets the selection (a host that draws the selection into the data, as sf-property-view does). The setting already holds the mode, so the list is selected-ids, not selection.","events (vocabulary 1.1.5 §5, §5.1): open {id, value}, select {ids, id, selected}, toggle {id, open, value}, move {ids, parent, before: null, source} for records dropped on an entry and attach {files, parent} for files, window {first, last}. The old names follow as dated split aliases until 2026-12-01, their adapters giving the old details with the row\'s element as item: sf-tree-item-click, sf-tree-selection-change, sf-tree-item-toggle, sf-tree-records-drop, sf-tree-files-drop. The colon names of the alias table (sf-tree:activate, sf-tree:selection-change, sf-tree:toggle) were the class tree\'s (component/tree), never this element\'s: the class tree now sends sf-tree-open, sf-tree-select and sf-tree-toggle first, data only, and its colon names after them until the same day. onToggle(handler) still hands the row first.","own-verb-words: none left -- records-drop and files-drop are the vocabulary\'s move and attach.","actions expand, collapse and focus-entry take an id and answer outcomes.","key-effects (on the rows): Tab reach, the arrows focus:next/prev, Home and End focus:first/last, ArrowRight open (or the first child), ArrowLeft close (or the parent), Enter open, Space select; a letter moves to the next entry starting with it.","version 2.0.0: the entries changed from elements to rows (a page reaching into sf-tree-item elements inside a tree breaks), on top of the renames behind dated aliases.","template: templates.default names js/templates/default.js; the rows are sf-tree-item\'s js/templates/row.js.","examples: examples.json from studio.fixture.json (a section with a child) plus files, one and many selection, links and a large tree.","css-variables: six public variables of the tree class sheet (component/tree): the rows\' gap, the tree\'s inline padding, a level\'s indent, a row\'s radius and ink, a selected row\'s fill (a resting look and the selected state; hover stays the role token\'s). Listed in src/core/contracts/public-variables.v1.json."],"x-measured":{"$comment":"stand 20\'s method (control/smart-architecture/stands/20-performance/bench.mjs, lists): Playwright Chromium, headless, macOS, the time from setting items to a stable DOM confirmed by a frame; medians; the dev build of this branch against the build of b237d0e (ui-8a77add77500). The first change is the stand\'s: the whole items with one label changed.","before":{"stand20_2000_nodes_x1":{"first_ms":14077,"change_ms":7514},"stand20_2000_nodes_x4":{"first_ms":74855,"change_ms":37514},"flat_100_x4":{"first_ms":378,"change_ms":195},"dom_nodes_per_entry":38.4,"note":"three page errors «Maximum call stack size exceeded» while drawing 2 000 nodes"},"after":{"stand20_2000_nodes_x1":{"first_ms":15.8,"change_ms":15.6},"stand20_2000_nodes_x4":{"first_ms":15.7,"change_ms":14.4},"flat_100_x4":{"first_ms":16.3,"change_ms":14.5},"flat_300_x4":{"first_ms":35.8,"change_ms":11.8},"flat_1000_x4":{"first_ms":16,"change_ms":14.5},"flat_10000_x4":{"first_ms":26.4,"change_ms":17.8},"dom_nodes_per_entry":17.8,"drawn_of_2000":38},"gate_17_x4":{"first_render_100_entries_ms":"16.3 ≤ 1000","first_render_1000_entries_ms":"16.0 ≤ 1500","one_entry_changed_ms":"≤ 17.8 ≤ 50","dom_nodes_per_entry":"15–19 ≤ 30","entries_10000_vs_1000_ratio":"1.65 ≤ 2"}}}');

/***/ },

/***/ "11ff8dfc051b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tree","runtime":{}}');

/***/ },

/***/ "b7834e0e48fd"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Дерево","runtime":{}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("cea13a5dfcb6");
/******/
/******/ })()
;