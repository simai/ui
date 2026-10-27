/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

"use strict";
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

"use strict";
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

/***/ "4f52f56c9555"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EFFECT_FORMAT: () => (/* binding */ EFFECT_FORMAT),
/* harmony export */   EFFECT_SCHEMA: () => (/* binding */ EFFECT_SCHEMA),
/* harmony export */   FRAME_RUNNER: () => (/* binding */ FRAME_RUNNER),
/* harmony export */   FRAME_RUNNER_SHA256: () => (/* binding */ FRAME_RUNNER_SHA256),
/* harmony export */   allowedModes: () => (/* binding */ allowedModes),
/* harmony export */   checkEffectManifest: () => (/* binding */ checkEffectManifest),
/* harmony export */   checkSetting: () => (/* binding */ checkSetting),
/* harmony export */   effectSchemes: () => (/* binding */ effectSchemes),
/* harmony export */   effectSettings: () => (/* binding */ effectSettings),
/* harmony export */   foreignMode: () => (/* binding */ foreignMode),
/* harmony export */   loadEffect: () => (/* binding */ loadEffect),
/* harmony export */   mountEffect: () => (/* binding */ mountEffect),
/* harmony export */   mountWindows: () => (/* binding */ mountWindows),
/* harmony export */   pageScheme: () => (/* binding */ pageScheme),
/* harmony export */   pairIsForeign: () => (/* binding */ pairIsForeign),
/* harmony export */   placeEffect: () => (/* binding */ placeEffect),
/* harmony export */   resolveTheme: () => (/* binding */ resolveTheme)
/* harmony export */ });
/* harmony import */ var _composition_schema_name_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ac24888e7d3e");
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("06e8cd089f28");
// Background effects (simai.effect 1.1.0; Larena's design of 2026-10-14,
// larena-specs docs/architecture/2026-10-14-background-effects.md). An effect
// is an animated background drawn into one area of a page; its manifest
// (effect.json) says everything a product needs to list and configure it
// without running its code, and its module exports mount(host, settings,
// context) -> {update, pause, resume, destroy}.
//
// Since 1.1 a manifest may declare the schemes it draws (dark, light; none
// means both), the pair of the other scheme, and the windows capability. The
// effect learns the scheme it draws in as context.scheme, and a switch reaches
// it as update(settings, context) without a remount. A placement has a theme
// mode (auto, dark, light): resolveTheme picks the effect, its pair or
// nothing, allowedModes says what an editor may offer, and the area takes the
// drawn theme's class. mountWindows draws one scene behind a group of window
// cards. loadEffect and placeEffect take an effect from the pinned catalogue
// (simai/ui-effects), every file checked against the index's SHA-256, and
// data-sf-effect / data-sf-effect-windows place one from markup.
//
// What lives here is the part every product would otherwise write again:
// checking a manifest, turning stored values into checked settings with the
// defaults filled, and mounting an effect under the rules -- one still frame
// for a person who asked for less motion, nothing drawn while the tab is
// hidden, the host out of the accessibility tree and out of the pointer's
// way, and everything gone after destroy. A foreign effect -- one not in the
// pinned catalogue, or a pair given as an address -- never runs in the page:
// it runs in a sandboxed frame of its own (an opaque origin under a strict
// content security policy, its checked settings sent by message), or, with
// SF_BOOT_CONFIG.effects.foreign = 'refuse', not at all.

 // The fields a writer of an effect.json emits: the format named without a
// version, with schema_version beside it (format-names-without-version). A
// reader takes either form: schema-name.mjs.

const EFFECT_FORMAT = Object.freeze((0,_composition_schema_name_mjs__WEBPACK_IMPORTED_MODULE_0__.schemaFields)('simai.effect', 1)); // The older label of the same format, which readers still take until the
// journal retires it (global-effect-schema-constant). Its value stays: a
// writer that put it alone in "schema" would otherwise emit a name with no
// schema_version.

const EFFECT_SCHEMA = 'simai.effect.v1';
const SETTING_TYPES = new Set(['choice', 'integer', 'number', 'boolean', 'string', 'text', 'color', 'file']);
const ID = /^[a-z][a-z0-9-]{1,40}$/u;
const VERSION = /^[0-9]+\.[0-9]+\.[0-9]+$/u;
const KEY = /^[a-zA-Z][a-zA-Z0-9]{0,40}$/u;
const FILE = /^[a-z0-9][a-z0-9._-]*$/u;
const COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/iu;
const SCHEMES = ['dark', 'light'];
const CAPABILITIES = new Set(['windows']);
const PAIR_URL = /^https:\/\/[^\s?#]+\/effect\.json$/u;

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const isText = value => isObject(value) && Object.keys(value).length > 0 && Object.entries(value).every(([lang, text]) => /^[a-z]{2}(-[A-Z]{2})?$/u.test(lang) && typeof text === 'string' && text.length > 0); // The problems of a manifest, empty when it holds.


function checkEffectManifest(manifest) {
  if (!isObject(manifest)) return ['manifest: not an object'];
  const problems = [];
  const allowed = ['schema', 'schema_version', 'id', 'version', 'label', 'author', 'entry', 'styles', 'preview', 'surfaces', 'schemes', 'pair', 'capabilities', 'settings', 'needs'];

  for (const key of Object.keys(manifest)) if (!allowed.includes(key)) problems.push(`${key}: undeclared`);

  if (!(0,_composition_schema_name_mjs__WEBPACK_IMPORTED_MODULE_0__.isSchema)(manifest, 'simai.effect', 1)) problems.push('schema: not simai.effect, schema_version 1');
  if (typeof manifest.id !== 'string' || !ID.test(manifest.id)) problems.push('id');
  if (typeof manifest.version !== 'string' || !VERSION.test(manifest.version)) problems.push('version');
  if (!isText(manifest.label)) problems.push('label');
  if (typeof manifest.entry !== 'string' || !FILE.test(manifest.entry) || !/\.m?js$/u.test(manifest.entry)) problems.push('entry: one module file');
  if (manifest.styles !== undefined && (!Array.isArray(manifest.styles) || !manifest.styles.every(file => typeof file === 'string' && FILE.test(file) && file.endsWith('.css')))) problems.push('styles');
  if (!Array.isArray(manifest.surfaces) || !manifest.surfaces.length) problems.push('surfaces'); // simai.effect 1.1: the schemes it draws, the pair of the other scheme, what it is safe for.

  const schemes = manifest.schemes;
  if (schemes !== undefined && (!Array.isArray(schemes) || !schemes.length || schemes.length > 2 || !schemes.every(scheme => SCHEMES.includes(scheme)) || new Set(schemes).size !== schemes.length)) problems.push('schemes: one or both of dark, light');

  if (manifest.pair !== undefined) {
    if (typeof manifest.pair !== 'string' || !(ID.test(manifest.pair) || PAIR_URL.test(manifest.pair) && manifest.pair.length <= 2048)) problems.push('pair: a catalogue id or the https URL of an effect.json');
    if (!Array.isArray(schemes) || schemes.length !== 1) problems.push('pair: only a single-scheme effect names a pair');
  }

  if (manifest.capabilities !== undefined && (!Array.isArray(manifest.capabilities) || !manifest.capabilities.every(name => CAPABILITIES.has(name)) || new Set(manifest.capabilities).size !== manifest.capabilities.length)) problems.push('capabilities: known names, each once');
  if (!isObject(manifest.needs) || manifest.needs.network !== false || Object.keys(manifest.needs).length !== 1) problems.push('needs: {network: false}');

  if (!Array.isArray(manifest.settings)) {
    problems.push('settings');
    return problems;
  }

  const keys = new Set();
  manifest.settings.forEach((setting, index) => {
    const at = `settings[${index}]`;

    if (!isObject(setting)) {
      problems.push(`${at}: not an object`);
      return;
    }

    if (typeof setting.key !== 'string' || !KEY.test(setting.key)) problems.push(`${at}: key`);else if (keys.has(setting.key)) problems.push(`${at}: key ${setting.key} twice`);
    keys.add(setting.key);
    if (!SETTING_TYPES.has(setting.type)) problems.push(`${at}: type`);
    if (!isText(setting.label)) problems.push(`${at}: label`);
    if (!('default' in setting)) problems.push(`${at}: default`);
    if (setting.type === 'choice' && (!Array.isArray(setting.options) || !setting.options.length)) problems.push(`${at}: a choice names its options`);
    if (['integer', 'number'].includes(setting.type) && (typeof setting.min !== 'number' || typeof setting.max !== 'number')) problems.push(`${at}: a number states min and max`);
    if (['string', 'text'].includes(setting.type) && typeof setting.max !== 'number') problems.push(`${at}: a string states its max length`);

    if ('default' in setting && SETTING_TYPES.has(setting.type)) {
      const checked = checkSetting(setting, setting.default);
      if (!checked.ok) problems.push(`${at}: default is not a valid value`);
    }
  });
  return problems;
} // One value against its setting: {ok, value}. Nothing is coerced beyond what a
// stored value plainly means (a numeric string for a number, «1»/«0» for a
// boolean), and a value out of bounds is not clamped -- it is invalid.

function checkSetting(setting, raw) {
  const fail = {
    ok: false,
    value: undefined
  };

  switch (setting.type) {
    case 'boolean':
      {
        if (typeof raw === 'boolean') return {
          ok: true,
          value: raw
        };
        if (raw === '1' || raw === 'true') return {
          ok: true,
          value: true
        };
        if (raw === '0' || raw === 'false') return {
          ok: true,
          value: false
        };
        return fail;
      }

    case 'integer':
    case 'number':
      {
        const value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw;
        if (typeof value !== 'number' || !Number.isFinite(value)) return fail;
        if (setting.type === 'integer' && !Number.isInteger(value)) return fail;
        if (value < setting.min || value > setting.max) return fail;
        return {
          ok: true,
          value
        };
      }

    case 'choice':
      {
        const option = (setting.options ?? []).find(entry => String(entry.value) === String(raw));
        return option ? {
          ok: true,
          value: option.value
        } : fail;
      }

    case 'string':
    case 'text':
      {
        if (typeof raw !== 'string' || raw.length > setting.max) return fail;
        if (setting.type === 'string' && /[\r\n]/u.test(raw)) return fail;
        return {
          ok: true,
          value: raw
        };
      }

    case 'color':
      return typeof raw === 'string' && COLOR.test(raw) ? {
        ok: true,
        value: raw.toLowerCase()
      } : fail;

    case 'file':
      // A file is the product's: an address or an identity of one of the site's
      // own files, which the product resolved and checked before this point.
      return raw === null || raw === '' || typeof raw === 'string' && raw.length <= 2048 ? {
        ok: true,
        value: raw || null
      } : fail;

    default:
      return fail;
  }
} // Stored values -> the settings an effect gets: every key of the manifest, the
// stored value where it is valid, the default where it is absent or not.
// `invalid` names the keys whose stored value was dropped.

function effectSettings(manifest, stored = {}) {
  const settings = {};
  const invalid = [];

  for (const setting of manifest.settings ?? []) {
    if (Object.hasOwn(stored ?? {}, setting.key)) {
      const checked = checkSetting(setting, stored[setting.key]);

      if (checked.ok) {
        settings[setting.key] = checked.value;
        continue;
      }

      invalid.push(setting.key);
    }

    settings[setting.key] = checkSetting(setting, setting.default).value;
  }

  return {
    settings: Object.freeze(settings),
    invalid
  };
} // The schemes an effect draws: as declared, or both when it declares none (1.0).

function effectSchemes(manifest) {
  return Array.isArray(manifest?.schemes) && manifest.schemes.length ? [...manifest.schemes] : [...SCHEMES];
} // A pair given as a URL is outside the catalogue that holds the effect: it is
// foreign, and runs only in a sandbox (pair-under-the-same-trust).

const pairIsForeign = manifest => typeof manifest?.pair === 'string' && PAIR_URL.test(manifest.pair);

const reducedMotion = () => Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

const capabilities = manifest => Array.isArray(manifest?.capabilities) ? manifest.capabilities : [];

const STATE = 'data-sf-effect-state';
const REASON = 'data-sf-effect-reason';
const WINDOW = '[data-sf-effect-window]'; // Foreign effects in a sandbox (foreign-effects-sandboxed) ------------------
//
// An effect from outside the pinned catalogue has no index to check it
// against, so nothing vouches for its code: the trust boundary is the frame
// it runs in. The frame is sandboxed with allow-scripts alone -- no
// allow-same-origin, so its origin is opaque and it reaches neither the
// page, its cookies nor its storage; no allow-top-navigation, allow-popups,
// allow-forms or allow-modals. Its document is written here (srcdoc) under a
// content security policy that lets in one script, the frame's own runner
// (by its SHA-256), and the module it is handed (a Blob URL made inside the
// frame); it may connect nowhere and load no image but data: and blob:. A
// hash, not a nonce: a module imported by a nonced script inherits the nonce
// for its own import(), which would let an effect import from anywhere. The
// module's text was fetched once by the page and is delivered by message,
// with the settings already checked against the manifest; the frame then
// hears of its size, scheme, palette tones, pause, resume, update and
// destroy the same way.

const SANDBOXED = new WeakSet();

function effectsConfig() {
  return globalThis.SF_BOOT_CONFIG?.effects ?? {};
} // SF_BOOT_CONFIG.effects.foreign: 'sandbox' (the default) or 'refuse'. Any
// other value refuses: a switch mistyped fails closed.


function foreignMode(value = effectsConfig().foreign) {
  return value === undefined || value === 'sandbox' ? 'sandbox' : 'refuse';
}

const FRAME_POLICY = () => ["default-src 'none'", `script-src 'sha256-${FRAME_RUNNER_SHA256}' blob:`, "style-src 'unsafe-inline'", 'img-src data: blob:', 'media-src data: blob:', 'font-src data:', "connect-src 'none'", "worker-src 'none'", "frame-src 'none'", "child-src 'none'", "object-src 'none'", "manifest-src 'none'", "form-action 'none'", "base-uri 'none'"].join('; '); // The runner inside the frame. A plain string, so no build step rewrites it:
// it takes one port from the page and nothing else, imports the module from
// a Blob URL of the text it is sent, and answers only "mounted" and "error".


const FRAME_RUNNER = String.raw`(() => {
  'use strict';
  const root = document.documentElement;
  const host = document.getElementById('host');
  let port = null;
  let handle = null;
  let queue = Promise.resolve();
  const send = (message) => { try { port.postMessage(message); } catch (error) { /* closed */ } };
  const fail = (phase, error) => send({type: 'error', phase, message: String((error && error.message) || error).slice(0, 500)});
  const call = (name, ...args) => {
    try { if (handle && typeof handle[name] === 'function') handle[name](...args); } catch (error) { fail(name, error); }
  };
  const look = (scheme, tones) => {
    const light = scheme === 'light';
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add(light ? 'theme-light' : 'theme-dark');
    root.style.colorScheme = light ? 'light' : 'dark';
    for (const [name, value] of Object.entries(tones || {})) root.style.setProperty(name, value);
  };
  const size = (box) => {
    if (!box) return;
    host.style.inlineSize = box.width + 'px';
    host.style.blockSize = box.height + 'px';
  };
  const handlers = {
    async mount(data) {
      look(data.context.scheme, data.tones);
      size(data.size);
      for (const css of data.styles) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.append(style);
      }
      const url = URL.createObjectURL(new Blob([data.source], {type: 'text/javascript'}));
      let module;
      try { module = await import(url); } catch (error) { fail('module', error); return; } finally { URL.revokeObjectURL(url); }
      if (!module || typeof module.mount !== 'function') { fail('module', 'no mount export'); return; }
      try { handle = module.mount(host, data.settings, Object.freeze(data.context)) || {}; } catch (error) { fail('mount', error); return; }
      send({type: 'mounted'});
    },
    update(data) {
      look(data.context.scheme, data.tones);
      call('update', data.settings, Object.freeze(data.context));
    },
    pause() { call('pause'); },
    resume() { call('resume'); },
    size(data) { size(data.size); },
    destroy() {
      call('destroy');
      handle = null;
      host.replaceChildren();
      port.close();
    },
  };
  addEventListener('message', function first(event) {
    if (event.source !== parent || event.data !== 'sf-effect-sandbox' || !event.ports[0]) return;
    removeEventListener('message', first);
    port = event.ports[0];
    port.onmessage = ({data}) => {
      const run = data && Object.hasOwn(handlers, data.type) ? handlers[data.type] : null;
      if (run) queue = queue.then(() => run(data)).catch((error) => fail(data.type, error));
    };
  });
})();`; // The runner's SHA-256 (base64), the one script the frame's policy admits by
// content. The contract test effect-manifest recomputes it from the text.

const FRAME_RUNNER_SHA256 = 'VOLJzSJh85fxDvhl9WytjdmjtDAUN8JT5veHYwFCVPA=';

function frameDocument() {
  return '<!doctype html><html><head><meta charset="utf-8">' + `<meta http-equiv="Content-Security-Policy" content="${FRAME_POLICY()}">` + '<style>html,body{margin:0;block-size:100%;overflow:hidden;background:transparent}#host{position:absolute;inset:0;overflow:hidden}</style>' + `</head><body><div id="host"></div><script>${FRAME_RUNNER}</script></body></html>`;
} // The palette tones as the page resolves them at the host (fixed across
// themes, drawn-with-palette-tones), handed to the frame, which has no sheet.


const PALETTES = ['primary', 'secondary', 'tertiary', 'neutral', 'neutral-variant', 'error', 'warning', 'success', 'info'];

function paletteTones(host) {
  const style = globalThis.getComputedStyle(host);
  const tones = {};

  for (const palette of PALETTES) {
    for (let tone = 0; tone <= 100; tone += 1) {
      const name = `--sf-${palette}-${tone}`;
      const value = style.getPropertyValue(name).trim();
      if (value && value.length <= 200) tones[name] = value;
    }
  }

  return tones;
} // A module whose mount draws the effect in a sandboxed frame filling the
// host. It is mounted like any module, so every rule of mountModule (still
// frame, hidden tab, off screen, aria-hidden, destroy) holds for it too.


function sandboxModule({
  id,
  source,
  styles = []
}) {
  const module = Object.freeze({
    mount(host, settings, context) {
      const document = host.ownerDocument;
      const frame = document.createElement('iframe');
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.setAttribute('referrerpolicy', 'no-referrer');
      frame.setAttribute('tabindex', '-1');
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('title', '');
      frame.setAttribute('data-sf-effect-sandbox', 'loading');
      frame.style.cssText = 'position:absolute;inset:0;inline-size:100%;block-size:100%;border:0;margin:0;padding:0;display:block;pointer-events:none;background:transparent';
      frame.srcdoc = frameDocument();
      const channel = new globalThis.MessageChannel();
      const port = channel.port1;
      const pending = [];
      let ready = false;
      let loads = 0;
      let destroyed = false;

      const box = () => {
        const rect = host.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height
        };
      };

      const post = message => {
        if (destroyed) return;
        if (ready) port.postMessage(message);else pending.push(message);
      };

      const failed = (phase, message) => host.dispatchEvent(new globalThis.CustomEvent('sf-effect-error', {
        bubbles: true,
        detail: {
          effect: id,
          phase,
          message,
          sandboxed: true
        }
      }));

      const sizes = globalThis.ResizeObserver ? new globalThis.ResizeObserver(() => post({
        type: 'size',
        size: box()
      })) : null;

      const teardown = () => {
        destroyed = true;
        sizes?.disconnect();
        port.close();
        frame.remove();
      }; // What the frame says is data: two kinds of message, strings cut short.


      port.onmessage = ({
        data
      }) => {
        if (destroyed || !isObject(data)) return;
        if (data.type === 'mounted') frame.setAttribute('data-sf-effect-sandbox', 'mounted');else if (data.type === 'error') failed(String(data.phase).slice(0, 40), String(data.message).slice(0, 500));
      };

      port.start();
      frame.addEventListener('load', () => {
        if (destroyed) return;
        loads += 1; // The frame's document is the one written here, once. A second load
        // means the frame went somewhere else: it is no longer the runner.

        if (loads > 1) {
          failed('sandbox', 'the sandbox frame navigated away and was removed');
          teardown();
          return;
        }

        frame.contentWindow?.postMessage('sf-effect-sandbox', '*', [channel.port2]);
        ready = true;

        for (const message of pending.splice(0)) port.postMessage(message);
      });
      post({
        type: 'mount',
        source,
        styles: [...styles],
        settings: { ...settings
        },
        context: { ...context
        },
        tones: paletteTones(host),
        size: box()
      });
      host.append(frame);
      sizes?.observe(host);
      return {
        update(next, nextContext) {
          post({
            type: 'update',
            settings: { ...next
            },
            context: { ...nextContext
            },
            tones: paletteTones(host)
          });
        },

        pause() {
          post({
            type: 'pause'
          });
        },

        resume() {
          post({
            type: 'resume'
          });
        },

        destroy() {
          if (destroyed) return;
          post({
            type: 'destroy'
          });
          teardown();
        }

      };
    }

  });
  SANDBOXED.add(module);
  return module;
} // Whether a module handed to SF.Effects is one the core made to run in the sandbox.


const isSandboxed = module => Boolean(module) && SANDBOXED.has(module); // One effect's module in one host under the 1.0 rules: one still frame for a
// person who asked for less motion, nothing drawn while the tab is hidden or
// the host is off screen, the host out of the accessibility tree and out of
// the pointer's way, and everything gone after destroy. The handle's methods
// are safe to call in any order and more than once.


function mountModule(host, {
  manifest,
  module,
  stored = {},
  locale,
  scheme
} = {}) {
  if (!(host instanceof globalThis.Element)) throw new TypeError('An effect mounts into an element');
  const problems = checkEffectManifest(manifest);
  if (problems.length) throw new TypeError(`Effect manifest is invalid: ${problems.join('; ')}`);
  const mount = typeof module === 'function' ? module : module?.mount;
  if (typeof mount !== 'function') throw new TypeError('An effect module exports mount(host, settings, context)'); // The host stands under the page: read by nobody, touched by no pointer.

  host.setAttribute('aria-hidden', 'true');
  host.style.pointerEvents = 'none';
  const ownsName = !host.hasAttribute('data-sf-effect');
  if (ownsName) host.setAttribute('data-sf-effect', manifest.id); // A mounted host is never taken for a declared placement still to mount.

  const ownsState = !host.hasAttribute(STATE);
  if (ownsState) host.setAttribute(STATE, 'running');
  const document = host.ownerDocument;
  let {
    settings
  } = effectSettings(manifest, stored); // The scheme it draws in: one it declares, its home scheme otherwise.

  const drawable = effectSchemes(manifest);

  const pick = wanted => drawable.includes(wanted) ? wanted : drawable[0];

  let drawn = pick(scheme);

  const context = () => Object.freeze({
    reducedMotion: reducedMotion(),
    locale: locale ?? (document.documentElement.getAttribute('lang') || 'en'),
    scheme: drawn
  });

  let handle = mount(host, settings, context()) ?? {};
  let running = true;
  let held = false;
  let offscreen = false;
  let destroyed = false;

  const call = (name, ...args) => {
    try {
      handle?.[name]?.(...args);
    } catch (error) {
      host.dispatchEvent(new globalThis.CustomEvent('sf-effect-error', {
        bubbles: true,
        detail: {
          effect: manifest.id,
          phase: name,
          message: String(error?.message ?? error)
        }
      }));
    }
  }; // It runs while nobody paused it, the tab is shown and the host is on screen.


  const sync = () => {
    if (destroyed) return;
    const wanted = !held && !document.hidden && !offscreen;
    if (wanted === running) return;
    running = wanted;
    call(wanted ? 'resume' : 'pause');
  };

  document.addEventListener('visibilitychange', sync); // A person who turns reduced motion on is given a still frame at once: the
  // effect is mounted again with the context that says so.

  const motion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');

  const onMotion = () => {
    if (destroyed) return;
    call('destroy');
    host.replaceChildren();
    handle = mount(host, settings, context()) ?? {};
    running = true;
    sync();
  };

  motion?.addEventListener?.('change', onMotion); // Off screen it asks for no frames either.

  const Sight = globalThis.IntersectionObserver;
  const sight = Sight ? new Sight(entries => {
    offscreen = !entries[entries.length - 1].isIntersecting;
    sync();
  }) : null;
  sight?.observe(host);
  sync();
  return Object.freeze({
    // New settings, and with {scheme} a switch of the scheme it draws in --
    // both without a remount.
    update(stored, {
      scheme: next
    } = {}) {
      if (destroyed) return;
      settings = effectSettings(manifest, stored).settings;
      if (next !== undefined) drawn = pick(next);
      call('update', settings, context());
    },

    get scheme() {
      return drawn;
    },

    // Whether it runs in the sandbox (a foreign effect) rather than in the page.
    get sandboxed() {
      return isSandboxed(module);
    },

    pause() {
      held = true;
      sync();
    },

    resume() {
      held = false;
      sync();
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      document.removeEventListener('visibilitychange', sync);
      motion?.removeEventListener?.('change', onMotion);
      sight?.disconnect();
      call('destroy'); // Whatever the effect left behind goes with it.

      host.replaceChildren();
      if (ownsName) host.removeAttribute('data-sf-effect');
      if (ownsState) host.removeAttribute(STATE);
    }

  });
} // Theme policy (simai.effect 1.1, theme-follows-the-placement) ---------------


const THEME_MODES = ['auto', 'dark', 'light'];
const THEME_CLASSES = ['theme-dark', 'theme-light']; // The page's scheme as the Framework sets it: the theme class on <html> (the
// Loader's checkTheme), the reader's system preference where there is none.

function pageScheme(document = globalThis.document) {
  const root = document?.documentElement;
  if (root?.classList.contains('theme-dark')) return 'dark';
  if (root?.classList.contains('theme-light')) return 'light';
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
} // A pair that can be drawn: one by catalogue id, or one by address while
// foreign effects run in the sandbox.

const drawablePair = (manifest, foreign) => typeof manifest?.pair === 'string' && (!pairIsForeign(manifest) || foreignMode(foreign) === 'sandbox'); // The theme modes an editor may offer for a placement: auto always, a fixed
// mode only when the effect -- or its pair, a catalogue pair or a foreign one
// run in the sandbox -- draws that scheme. `pair` is the pair's manifest when
// it is known; without it a pair is taken to draw the other scheme, as a pair
// does. `foreign` overrides SF_BOOT_CONFIG.effects.foreign.


function allowedModes(manifest, {
  pair,
  foreign
} = {}) {
  const drawn = new Set(effectSchemes(manifest));
  if (drawablePair(manifest, foreign)) for (const scheme of pair ? effectSchemes(pair) : SCHEMES) drawn.add(scheme);
  return ['auto', ...SCHEMES.filter(scheme => drawn.has(scheme))];
} // Which effect a placement draws, and in which scheme: {effect: 'self' |
// 'pair', scheme} or {hidden: true, reason}. The order: the effect in the
// target scheme; its pair in the target scheme; in auto, a dark-only effect
// kept dark on a light page; nothing -- a light-only effect is not shown on a
// dark target. A pair given as an address is foreign: it is drawn only in the
// sandbox (sandboxed: true), and with foreign effects refused the placement
// is hidden.

function resolveTheme(manifest, {
  pageScheme: page,
  themeMode = 'auto',
  pair,
  foreign
} = {}) {
  if (!THEME_MODES.includes(themeMode)) return Object.freeze({
    hidden: true,
    reason: 'unknown-theme-mode'
  });
  const target = themeMode === 'auto' ? (page ?? pageScheme()) === 'dark' ? 'dark' : 'light' : themeMode;
  const own = effectSchemes(manifest);
  if (own.includes(target)) return Object.freeze({
    effect: 'self',
    scheme: target
  });

  if (typeof manifest?.pair === 'string') {
    const outside = pairIsForeign(manifest);
    if (outside && foreignMode(foreign) !== 'sandbox') return Object.freeze({
      hidden: true,
      reason: 'foreign-pair-needs-sandbox'
    });

    if (!pair || effectSchemes(pair).includes(target)) {
      return Object.freeze(outside ? {
        effect: 'pair',
        scheme: target,
        pair: manifest.pair,
        sandboxed: true
      } : {
        effect: 'pair',
        scheme: target,
        pair: manifest.pair
      });
    }
  }

  if (themeMode === 'auto' && target === 'light' && own.includes('dark')) return Object.freeze({
    effect: 'self',
    scheme: 'dark'
  });
  return Object.freeze({
    hidden: true,
    reason: themeMode === 'auto' ? 'light-only-on-dark' : 'mode-not-drawable'
  });
} // The areas a placement draws under take the theme it is drawn in
// (area-takes-the-drawn-theme); what they had before comes back after. A
// theme class changes the tokens but not the ink the area inherited from the
// page, so an area also takes AREA_CLASS, which core's sheet gives the drawn
// theme's text colour (color: var(--sf-on-surface), in sf.base, so an
// author's colour utility on the area still wins).

const AREA_CLASS = 'sf-effect-area';

function themeAreas() {
  const before = new Map();

  const restore = (element, had) => {
    element.classList.remove(...THEME_CLASSES, AREA_CLASS);
    if (had.length) element.classList.add(...had);
  };

  return {
    set(elements, scheme) {
      const wanted = `theme-${scheme}`;

      for (const element of elements) {
        if (!before.has(element)) before.set(element, [...THEME_CLASSES, AREA_CLASS].filter(name => element.classList.contains(name)));
        if (!element.classList.contains(AREA_CLASS)) element.classList.add(AREA_CLASS); // Touched only when it changes, so an observer of the class sees no churn.

        const other = THEME_CLASSES.find(name => name !== wanted);
        if (element.classList.contains(other)) element.classList.remove(other);
        if (!element.classList.contains(wanted)) element.classList.add(wanted);
      }

      for (const [element, had] of before) {
        if (elements.includes(element)) continue;
        restore(element, had);
        before.delete(element);
      }
    },

    restore() {
      for (const [element, had] of before) restore(element, had);

      before.clear();
    }

  };
} // The page's theme, followed: the class the Loader sets on <html>, its
// sf-theme-change event, and the system preference a page without a class
// follows. One watch for every placement in auto.


const followers = new Set();
let unwatch = null;

function followPage(listener) {
  followers.add(listener);
  const document = globalThis.document;

  if (!unwatch && document?.documentElement) {
    const notify = () => {
      for (const follower of [...followers]) follower();
    };

    const classes = new globalThis.MutationObserver(notify);
    classes.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    const media = globalThis.matchMedia?.('(prefers-color-scheme: dark)');
    media?.addEventListener?.('change', notify);
    globalThis.addEventListener?.('sf-theme-change', notify);

    unwatch = () => {
      classes.disconnect();
      media?.removeEventListener?.('change', notify);
      globalThis.removeEventListener?.('sf-theme-change', notify);
    };
  }

  return () => {
    followers.delete(listener);

    if (!followers.size && unwatch) {
      unwatch();
      unwatch = null;
    }
  };
} // Refusals that are a matter of trust are reported, not only hidden.


const TRUST = new Set(['foreign-pair-needs-sandbox', 'pair-refused']);

function report(element, effect, reason, detail = {}) {
  globalThis.console?.warn?.(`SF.Effects: ${effect} is not run (${reason})`, detail);
  element.dispatchEvent(new globalThis.CustomEvent('sf-effect-refused', {
    bubbles: true,
    detail: {
      effect,
      reason,
      ...detail
    }
  }));
} // A placement: the effect or its pair drawn into `host` as the theme policy
// says, the `areas` in the drawn theme, the state on `element`; followed
// through page theme changes while its mode is auto.


function place({
  element,
  host,
  areas,
  manifest,
  module,
  pair,
  pairRefused,
  stored = {},
  locale,
  themeMode = 'auto',
  windows = false,
  foreign
}) {
  const problems = checkEffectManifest(manifest);
  if (problems.length) throw new TypeError(`Effect manifest is invalid: ${problems.join('; ')}`); // A trusted effect never pulls an untrusted pair inline: a pair by catalogue
  // id is the one it names; a pair by address runs only as the sandbox module
  // the core made for it (loadEffect), never as a module handed in.

  const outside = pairIsForeign(manifest);
  const usable = pair && isObject(pair.manifest) && !checkEffectManifest(pair.manifest).length && (outside ? isSandboxed(pair.module) : pair.manifest.id === manifest.pair) ? pair : null;
  const theme = themeAreas();
  let mode = themeMode;
  let values = stored;
  let current = null;
  let resolution = null;
  let held = false;
  let destroyed = false;
  element.setAttribute(STATE, 'running');

  const choose = () => {
    const page = pageScheme(host.ownerDocument);
    let next = resolveTheme(manifest, {
      pageScheme: page,
      themeMode: mode,
      pair: usable?.manifest,
      foreign
    });

    if (next.effect === 'pair' && !usable) {
      const reason = outside && pair ? 'foreign-pair-needs-sandbox' : pairRefused ? 'pair-refused' : 'pair-not-loaded';
      next = {
        hidden: true,
        reason
      };
    } else if (next.effect === 'pair' && windows && !capabilities(usable.manifest).includes('windows')) next = {
      hidden: true,
      reason: 'pair-without-windows'
    };

    const target = mode === 'dark' || mode === 'light' ? mode : page;
    return {
      next: Object.freeze(next),
      drawn: next.hidden ? target : next.scheme
    };
  };

  const apply = () => {
    if (destroyed) return false;
    const {
      next,
      drawn
    } = choose();
    theme.set(areas(), drawn);
    const which = next.hidden ? null : next.effect;
    const was = resolution ? resolution.hidden ? null : resolution.effect : undefined;
    const changed = !resolution || resolution.hidden !== next.hidden || resolution.reason !== next.reason || resolution.scheme !== next.scheme || resolution.effect !== next.effect;
    resolution = next;
    let updated = false;

    if (was === which && current) {
      if (current.scheme !== drawn) {
        current.update(values, {
          scheme: drawn
        });
        updated = true;
      }
    } else if (was !== which) {
      current?.destroy();
      current = null;

      if (which) {
        const chosen = which === 'self' ? {
          manifest,
          module
        } : usable;
        current = mountModule(host, {
          manifest: chosen.manifest,
          module: chosen.module,
          stored: values,
          locale,
          scheme: drawn
        });
        if (held) current.pause();
        updated = true;
      }
    }

    if (changed) {
      element.setAttribute(STATE, next.hidden ? 'hidden' : 'running');
      if (next.hidden) element.setAttribute(REASON, next.reason);else element.removeAttribute(REASON);
      if (next.hidden && TRUST.has(next.reason)) report(element, manifest.pair ?? manifest.id, next.reason, {
        pairOf: manifest.id
      });
    }

    return updated;
  };

  const unfollow = followPage(() => {
    if (mode === 'auto') apply();
  });

  try {
    apply();
  } catch (error) {
    unfollow();
    theme.restore();
    element.removeAttribute(STATE);
    throw error;
  }

  const handle = Object.freeze({
    // New settings (the pair takes those of its own keys that are valid for
    // it), and with {themeMode} another mode -- each without a remount when
    // the same effect stays.
    update(stored = values, {
      themeMode: nextMode
    } = {}) {
      if (destroyed) return;
      values = stored;
      if (nextMode !== undefined) mode = nextMode;
      if (!apply()) current?.update(values, {
        scheme: current.scheme
      });
    },

    pause() {
      held = true;
      current?.pause();
    },

    resume() {
      held = false;
      current?.resume();
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      unfollow();
      current?.destroy();
      current = null;
      theme.restore();
      element.removeAttribute(STATE);
      element.removeAttribute(REASON);
    },

    get scheme() {
      return current?.scheme ?? null;
    },

    get effect() {
      return resolution.hidden ? null : resolution.effect;
    },

    get resolution() {
      return resolution;
    },

    get themeMode() {
      return mode;
    },

    get sandboxed() {
      return current?.sandboxed ?? false;
    }

  });
  return {
    handle,
    apply: () => apply()
  };
} // A layer under an element's content for the effect to draw in: the element
// becomes a positioned, isolated box, and the layer sits under its children.


function makeLayer(element) {
  const host = element.ownerDocument.createElement('div');
  host.setAttribute('data-sf-effect-layer', '');
  host.style.cssText = 'position:absolute;inset:0;z-index:-1;overflow:hidden;border-radius:inherit;pointer-events:none';
  const kept = {
    position: element.style.position,
    isolation: element.style.isolation
  };
  if (globalThis.getComputedStyle(element).position === 'static') element.style.position = 'relative';
  element.style.isolation = 'isolate';
  element.prepend(host);
  return {
    host,

    remove() {
      host.remove();
      element.style.position = kept.position;
      element.style.isolation = kept.isolation;
    }

  };
} // Mount an effect's module under the rules. `module` is the imported entry
// (or its mount function). Without `themeMode` it draws in `scheme` (its home
// scheme when it cannot), as in 1.0. With `themeMode` (auto, dark, light) it
// is a placement: the theme policy picks the effect, its `pair` ({manifest,
// module}, a catalogue pair already loaded) or nothing, `area` (the host by
// default) takes the drawn theme's class, and auto follows the page's theme.


function mountEffect(host, options = {}) {
  if (options.themeMode === undefined) return mountModule(host, options);
  if (!(host instanceof globalThis.Element)) throw new TypeError('An effect mounts into an element');
  const area = options.area instanceof globalThis.Element ? options.area : host;
  const {
    manifest,
    module,
    pair,
    stored,
    locale,
    themeMode,
    foreign
  } = options;
  return place({
    element: area,
    host,
    areas: () => [area],
    manifest,
    module,
    pair,
    stored,
    locale,
    themeMode,
    foreign
  }).handle;
} // Windows mode (windows-are-mask-safe) -------------------------------------

const px = (value, size) => {
  const text = String(value).trim().split(/\s+/u)[0];
  const number = Number.parseFloat(text);
  if (!Number.isFinite(number)) return 0;
  return text.endsWith('%') ? number / 100 * size : number;
};

const fixed = value => Number(value.toFixed(2)); // A rounded rectangle as a path, corner by corner.


function roundedRect(x, y, w, h, style) {
  const limit = Math.min(w, h) / 2;
  const [tl, tr, br, bl] = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'].map(name => fixed(Math.min(px(style[name], Math.min(w, h)), limit)));
  [x, y, w, h] = [x, y, w, h].map(fixed);
  return `M${fixed(x + tl)} ${y}H${fixed(x + w - tr)}A${tr} ${tr} 0 0 1 ${fixed(x + w)} ${fixed(y + tr)}` + `V${fixed(y + h - br)}A${br} ${br} 0 0 1 ${fixed(x + w - br)} ${fixed(y + h)}` + `H${fixed(x + bl)}A${bl} ${bl} 0 0 1 ${x} ${fixed(y + h - bl)}V${fixed(y + tl)}A${tl} ${tl} 0 0 1 ${fixed(x + tl)} ${y}Z`;
}

function placeWindows(group, {
  windows = WINDOW,
  ...options
}) {
  if (!(group instanceof globalThis.Element)) throw new TypeError('A windows group is an element');
  const problems = checkEffectManifest(options.manifest);
  if (problems.length) throw new TypeError(`Effect manifest is invalid: ${problems.join('; ')}`);
  if (!capabilities(options.manifest).includes('windows')) throw new TypeError('The effect does not declare the windows capability');
  const selector = typeof windows === 'string' && windows ? windows : WINDOW;

  const cards = () => [...group.querySelectorAll(selector)];

  const layer = makeLayer(group);
  let placed;

  try {
    placed = place({ ...options,
      element: group,
      host: layer.host,
      areas: cards,
      windows: true
    });
  } catch (error) {
    layer.remove();
    throw error;
  } // The scene is one, the size of the group; only the windows show it.


  let frame = 0;

  const build = () => {
    frame = 0;
    const origin = layer.host.getBoundingClientRect();
    const shapes = cards().map(card => {
      const box = card.getBoundingClientRect();
      if (!box.width || !box.height) return '';
      return roundedRect(box.left - origin.left, box.top - origin.top, box.width, box.height, globalThis.getComputedStyle(card));
    }).filter(Boolean);
    layer.host.style.clipPath = shapes.length ? `path('${shapes.join(' ')}')` : 'inset(50%)';
  };

  const schedule = () => {
    if (!frame) frame = globalThis.requestAnimationFrame(build);
  };

  const Resize = globalThis.ResizeObserver;
  const sizes = Resize ? new Resize(schedule) : null;

  const watchCards = () => {
    if (!sizes) return;
    sizes.disconnect();
    sizes.observe(group);

    for (const card of cards()) sizes.observe(card);
  }; // Cards that come and go: the effect's own nodes in the layer are not news.


  const changes = new globalThis.MutationObserver(records => {
    if (records.every(record => layer.host.contains(record.target))) return;
    watchCards();
    placed.apply();
    schedule();
  });
  changes.observe(group, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-sf-effect-window']
  });
  globalThis.addEventListener('scroll', schedule, {
    passive: true,
    capture: true
  });
  globalThis.addEventListener('resize', schedule, {
    passive: true
  });
  watchCards();
  build();
  const {
    handle
  } = placed;
  return Object.freeze({
    update: handle.update,
    pause: handle.pause,
    resume: handle.resume,

    // The windows were changed by other means than the DOM (a custom selector's class).
    refresh() {
      watchCards();
      placed.apply();
      schedule();
    },

    destroy() {
      if (frame) globalThis.cancelAnimationFrame(frame);
      frame = 0;
      sizes?.disconnect();
      changes.disconnect();
      globalThis.removeEventListener('scroll', schedule, {
        capture: true
      });
      globalThis.removeEventListener('resize', schedule);
      handle.destroy();
      layer.remove();
    },

    get scheme() {
      return handle.scheme;
    },

    get effect() {
      return handle.effect;
    },

    get resolution() {
      return handle.resolution;
    },

    get themeMode() {
      return handle.themeMode;
    },

    get sandboxed() {
      return handle.sandboxed;
    }

  });
} // One effect drawn once behind a group (simai.effect 1.1, windows): seen only
// through the group's window cards (`windows`, a selector, default
// [data-sf-effect-window]), one continuous scene across them. Only for an
// effect declaring capabilities ["windows"]. Options as mountEffect's with a
// theme mode (auto by default); the window cards take the drawn theme, the
// other cards keep the page's.


function mountWindows(group, options = {}) {
  const {
    manifest,
    module,
    pair,
    stored,
    locale,
    themeMode = 'auto',
    windows,
    foreign
  } = options;
  return placeWindows(group, {
    manifest,
    module,
    pair,
    stored,
    locale,
    themeMode,
    windows,
    foreign
  });
} // Catalogue loading with integrity (pair-under-the-same-trust) --------------

class EffectRefused extends Error {
  constructor(reason, detail = {}) {
    super(reason);
    this.name = 'EffectRefused';
    this.reason = reason;
    this.detail = detail;
  }

}

const decode = bytes => new globalThis.TextDecoder().decode(bytes);

const pageAddress = () => globalThis.document?.baseURI ?? globalThis.location?.href; // The catalogue base, an absolute address ending in a slash; null without one.


function catalogueBase(catalogue) {
  const value = catalogue ?? effectsConfig().catalogue;
  if (typeof value !== 'string' || !value) return null;

  try {
    const url = new URL(value, pageAddress());
    url.search = '';
    url.hash = '';
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    return url.href;
  } catch {
    return null;
  }
}

async function sha256(bytes) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new EffectRefused('no-integrity-check');
  const hash = new Uint8Array(await subtle.digest('SHA-256', bytes));
  return [...hash].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function fetchBytes(url) {
  let response;

  try {
    response = await globalThis.fetch(url, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer'
    });
  } catch {
    throw new EffectRefused('fetch-failed', {
      url
    });
  }

  if (!response.ok) throw new EffectRefused('fetch-failed', {
    url,
    status: response.status
  });
  return new Uint8Array(await response.arrayBuffer());
}

const indexes = new Map();

function catalogueIndex(base) {
  if (!indexes.has(base)) {
    const loading = (async () => {
      const config = effectsConfig();
      const own = catalogueBase() === base;
      const file = own && config.index || 'catalogue/index.json';
      const bytes = await fetchBytes(new URL(file, base).href);
      if (own && config.indexSha256 && (await sha256(bytes)) !== config.indexSha256) throw new EffectRefused('integrity', {
        file
      });
      let index;

      try {
        index = JSON.parse(decode(bytes));
      } catch {
        throw new EffectRefused('invalid-index', {
          file
        });
      }

      if (index?.schema !== 'simai.ui-effects.catalogue' || !Array.isArray(index.effects)) throw new EffectRefused('invalid-index', {
        file
      });
      return index;
    })();

    loading.catch(() => indexes.delete(base));
    indexes.set(base, loading);
  }

  return indexes.get(base);
} // The module runs from the bytes that were verified, never from a second fetch.


async function importVerified(bytes) {
  const url = globalThis.URL.createObjectURL(new globalThis.Blob([bytes], {
    type: 'text/javascript'
  }));

  try {
    return await import(
    /* webpackIgnore: true */
    url);
  } catch (error) {
    throw new EffectRefused('module-failed', {
      message: String(error?.message ?? error)
    });
  } finally {
    globalThis.URL.revokeObjectURL(url);
  }
}

async function loadVerified(base, id) {
  const index = await catalogueIndex(base);
  const entry = index.effects.find(candidate => candidate?.id === id);
  if (!entry) throw new EffectRefused('not-in-catalogue', {
    id
  });
  if (typeof entry.path !== 'string' || !/^effects\/[a-z][a-z0-9-]{1,40}\/$/u.test(entry.path)) throw new EffectRefused('invalid-index', {
    id
  });
  const folder = new URL(entry.path, base).href;
  const digests = new Map((Array.isArray(entry.files) ? entry.files : []).map(file => [file?.path, file?.sha256]));

  const verified = async name => {
    const expected = digests.get(name);
    if (typeof expected !== 'string') throw new EffectRefused('file-not-in-index', {
      id,
      file: name
    });
    const bytes = await fetchBytes(new URL(name, folder).href);
    if ((await sha256(bytes)) !== expected.toLowerCase()) throw new EffectRefused('integrity', {
      id,
      file: name
    });
    return bytes;
  };

  const manifestBytes = await verified('effect.json');
  let manifest;

  try {
    manifest = JSON.parse(decode(manifestBytes));
  } catch {
    throw new EffectRefused('invalid-manifest', {
      id
    });
  }

  const problems = checkEffectManifest(manifest);
  if (problems.length) throw new EffectRefused('invalid-manifest', {
    id,
    problems
  });
  if (manifest.id !== id) throw new EffectRefused('manifest-mismatch', {
    id
  }); // Every file is verified before any of it runs.

  const entryBytes = await verified(manifest.entry);
  const styles = [];

  for (const name of manifest.styles ?? []) styles.push(decode(await verified(name)));

  const module = await importVerified(entryBytes);
  if (typeof module?.mount !== 'function') throw new EffectRefused('module-failed', {
    id,
    message: 'no mount export'
  });
  return Object.freeze({
    id,
    url: `${folder}effect.json`,
    manifest,
    module,
    styles: Object.freeze(styles),
    sandboxed: false
  });
} // A foreign effect: its manifest and files fetched once, with no index to
// check them against -- the sandbox is the trust boundary. The manifest must
// still hold; the module never runs in the page, only in its frame.


async function loadForeign(url) {
  const manifestBytes = await fetchBytes(url);
  let manifest;

  try {
    manifest = JSON.parse(decode(manifestBytes));
  } catch {
    throw new EffectRefused('invalid-manifest', {
      url
    });
  }

  const problems = checkEffectManifest(manifest);
  if (problems.length) throw new EffectRefused('invalid-manifest', {
    url,
    problems
  });
  const source = decode(await fetchBytes(new URL(manifest.entry, url).href));
  const styles = [];

  for (const name of manifest.styles ?? []) styles.push(decode(await fetchBytes(new URL(name, url).href)));

  const module = sandboxModule({
    id: manifest.id,
    source,
    styles
  });
  return Object.freeze({
    id: manifest.id,
    url,
    manifest,
    module,
    styles: Object.freeze([]),
    sandboxed: true
  });
} // The address of a foreign effect.json: https, or the page's own origin.


function foreignAddress(url) {
  const address = new URL(url);
  const own = new URL(pageAddress()).origin;
  if (address.protocol !== 'https:' && address.origin !== own || !address.pathname.endsWith('/effect.json') || address.username || address.password) return null;
  address.hash = '';
  return address.href;
} // Where a reference points: {id} of the pinned catalogue (an id, or the
// address of an effect.json under its base), or {foreign: url} for any other
// effect.json, which runs only in the sandbox.


async function locate(reference, base, foreign) {
  if (typeof reference !== 'string' || !reference.trim()) throw new EffectRefused('no-effect');
  const value = reference.trim();

  if (ID.test(value)) {
    if (!base) throw new EffectRefused('no-catalogue', {
      id: value
    });
    return {
      id: value
    };
  }

  const sandbox = foreignMode(foreign) === 'sandbox';
  let url;

  try {
    url = new URL(value, pageAddress()).href;
  } catch {
    throw new EffectRefused(sandbox ? 'invalid-reference' : 'foreign-effect-needs-sandbox', {
      url: value
    });
  }

  if (!base || !url.startsWith(base)) {
    if (!sandbox) throw new EffectRefused('foreign-effect-needs-sandbox', {
      url
    });
    const address = foreignAddress(url);
    if (!address) throw new EffectRefused('invalid-reference', {
      url
    });
    return {
      foreign: address
    };
  }

  const index = await catalogueIndex(base);
  const entry = index.effects.find(candidate => typeof candidate?.path === 'string' && new URL(`${candidate.path}effect.json`, base).href === url);
  if (!entry) throw new EffectRefused('not-in-catalogue', {
    url
  });
  return {
    id: entry.id
  };
}

const loaded = new Map(); // Load an effect: from the pinned catalogue by its id, or by the address of
// its effect.json under the catalogue base (`catalogue`, or
// SF_BOOT_CONFIG.effects.catalogue), every file checked against the index's
// SHA-256 before anything runs; or, by any other https address of an
// effect.json, as a foreign effect whose module runs only in the sandbox
// (sandboxed: true) -- unless foreign effects are refused (`foreign`, or
// SF_BOOT_CONFIG.effects.foreign = 'refuse'). Answers {id, url, manifest,
// module, styles, sandboxed}; rejects with an error whose `reason` names the
// refusal.

function loadEffect(reference, {
  catalogue,
  foreign
} = {}) {
  const base = catalogueBase(catalogue);
  return (async () => {
    const where = await locate(reference, base, foreign);
    const key = where.foreign ? `foreign\n${where.foreign}` : `${base}\n${where.id}`;

    if (!loaded.has(key)) {
      const loading = where.foreign ? loadForeign(where.foreign) : loadVerified(base, where.id);
      loading.catch(() => loaded.delete(key));
      loaded.set(key, loading);
    }

    return loaded.get(key);
  })();
} // An effect's own styles, verified with it, in the page while it is placed.

const styleUses = new Map();

function useStyles(effect, document) {
  if (!effect?.styles?.length) return () => {};
  let use = styleUses.get(effect.url);

  if (!use) {
    const nodes = effect.styles.map(css => {
      const style = document.createElement('style');
      style.setAttribute('data-sf-effect-style', effect.id);
      style.textContent = css;
      document.head.append(style);
      return style;
    });
    use = {
      nodes,
      count: 0
    };
    styleUses.set(effect.url, use);
  }

  use.count += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    use.count -= 1;
    if (use.count) return;

    for (const node of use.nodes) node.remove();

    styleUses.delete(effect.url);
  };
}

const placements = new Map(); // Place an effect from the catalogue on an element: load it (and its pair,
// when the pair is a catalogue id) with integrity, then draw it in a layer
// under the element's content -- or, with `windows` (true or a selector),
// behind the element's window cards. Answers the placement's handle, or null
// when it was refused (the element's data-sf-effect-state is then "refused",
// data-sf-effect-reason says why, and sf-effect-refused is dispatched).

async function placeEffect(element, options = {}) {
  if (!(element instanceof globalThis.Element)) throw new TypeError('An effect is placed on an element');
  const {
    effect: reference,
    settings = {},
    themeMode = 'auto',
    windows = false,
    catalogue,
    locale,
    foreign
  } = options;
  placements.get(element)?.destroy();
  element.setAttribute(STATE, 'loading');
  element.removeAttribute(REASON);

  try {
    const main = await loadEffect(reference, {
      catalogue,
      foreign
    });
    if (windows && !capabilities(main.manifest).includes('windows')) throw new EffectRefused('windows-not-declared', {
      id: main.id
    });
    let pair = null;
    let pairRefused = null;

    if (typeof main.manifest.pair === 'string') {
      // A pair by address is foreign, loaded for the sandbox (or not at all
      // when foreign effects are refused); a pair by id is the catalogue's,
      // and a foreign effect's id names nothing in this catalogue.
      const outside = pairIsForeign(main.manifest);

      if (!outside && main.sandboxed) {
        pairRefused = 'pair-of-foreign-effect';
        report(element, main.manifest.pair, pairRefused, {
          pairOf: main.id
        });
      } else if (!outside || foreignMode(foreign) === 'sandbox') {
        try {
          pair = await loadEffect(main.manifest.pair, {
            catalogue,
            foreign
          });
        } catch (error) {
          pairRefused = error?.reason ?? 'pair-failed';
          report(element, main.manifest.pair, pairRefused, {
            pairOf: main.id,
            ...(error?.detail ?? {})
          });
        }
      }
    }

    if (element.getAttribute(STATE) !== 'loading') return null;

    if (!element.isConnected) {
      // Taken off the page while it loaded: found again if it comes back.
      element.removeAttribute(STATE);
      return null;
    }

    const releases = [useStyles(main, element.ownerDocument), useStyles(pair, element.ownerDocument)];
    const common = {
      manifest: main.manifest,
      module: main.module,
      pair: pair ? {
        manifest: pair.manifest,
        module: pair.module
      } : undefined,
      pairRefused,
      stored: settings,
      locale,
      themeMode,
      foreign
    };
    let handle;
    let layer = null;

    try {
      if (windows) {
        handle = placeWindows(element, { ...common,
          windows
        });
      } else {
        layer = makeLayer(element);
        handle = place({ ...common,
          element,
          host: layer.host,
          areas: () => [element]
        }).handle;
      }
    } catch (error) {
      layer?.remove();

      for (const release of releases) release();

      throw error;
    }

    const placed = Object.freeze({
      update: handle.update,
      pause: handle.pause,
      resume: handle.resume,

      destroy() {
        if (placements.get(element) === placed) placements.delete(element);
        handle.destroy();
        layer?.remove();

        for (const release of releases) release();
      },

      get scheme() {
        return handle.scheme;
      },

      get effect() {
        return handle.effect;
      },

      get resolution() {
        return handle.resolution;
      },

      get themeMode() {
        return handle.themeMode;
      },

      get sandboxed() {
        return handle.sandboxed;
      }

    });
    placements.set(element, placed);
    return placed;
  } catch (error) {
    if (error instanceof EffectRefused) {
      element.setAttribute(STATE, 'refused');
      element.setAttribute(REASON, error.reason);
      report(element, reference, error.reason, error.detail);
    } else {
      element.setAttribute(STATE, 'failed');
      element.removeAttribute(REASON);
      element.dispatchEvent(new globalThis.CustomEvent('sf-effect-error', {
        bubbles: true,
        detail: {
          effect: reference,
          phase: 'mount',
          message: String(error?.message ?? error)
        }
      }));
    }

    return null;
  }
} // Declarative mount ----------------------------------------------------------
//
//   <section data-sf-effect="<catalogue id or effect.json address>"
//            data-sf-effect-settings='{"speed": 80}' data-sf-effect-theme="auto">
//   <div data-sf-effect-windows="<id or address>" ...>
//     <article data-sf-effect-window>...</article> ...
//
// Found once the page has loaded, and in content added later.

const DECLARED = `[data-sf-effect]:not([${STATE}]), [data-sf-effect-windows]:not([${STATE}])`;

function placeDeclared(element) {
  const windows = element.hasAttribute('data-sf-effect-windows');
  const reference = element.getAttribute(windows ? 'data-sf-effect-windows' : 'data-sf-effect');
  let settings = {};
  const raw = element.getAttribute('data-sf-effect-settings');

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (!isObject(parsed)) throw new TypeError('not an object');
      settings = parsed;
    } catch {
      globalThis.console?.warn?.(`SF.Effects: data-sf-effect-settings of ${reference} is not a JSON object; the defaults are used`);
    }
  }

  const themeMode = element.getAttribute('data-sf-effect-theme') || 'auto';
  return placeEffect(element, {
    effect: reference,
    settings,
    themeMode,
    windows
  });
}

function scan(root) {
  const found = root instanceof globalThis.Element && root.matches(DECLARED) ? [root] : [];
  found.push(...(root.querySelectorAll?.(DECLARED) ?? []));

  for (const element of found) placeDeclared(element);
}

function watchDeclared(document) {
  const declared = document.querySelector(DECLARED);
  scan(document); // A page that configures no catalogue and declares no effect when it loads
  // is not watched on every change: a foreign effect it adds later is placed
  // with placeEffect.

  if (!effectsConfig().catalogue && !declared) return;
  new globalThis.MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) if (node.nodeType === 1) scan(node);

      if (record.removedNodes.length) {
        for (const [element, placed] of placements) if (!element.isConnected) placed.destroy();
      }
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Effects = Object.freeze({
    checkEffectManifest,
    checkSetting,
    effectSettings,
    effectSchemes,
    pairIsForeign,
    foreignMode,
    allowedModes,
    resolveTheme,
    pageScheme,
    mountEffect,
    mountWindows,
    loadEffect,
    placeEffect,
    EFFECT_FORMAT,
    SANDBOX_RUNNER_SHA256: FRAME_RUNNER_SHA256,

    get EFFECT_SCHEMA() {
      (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_1__.noteDeprecated)({
        kind: 'global',
        from: 'SF.Effects.EFFECT_SCHEMA',
        to: 'SF.Effects.EFFECT_FORMAT'
      });
      return EFFECT_SCHEMA;
    }

  });

  if (typeof document !== 'undefined' && document.documentElement) {
    // After the page has loaded: an effect is never what the page waits for.
    const start = () => watchDeclared(document);

    if (document.readyState === 'complete') globalThis.setTimeout(start, 0);else window.addEventListener('load', start, {
      once: true
    });
  }
}

/***/ },

/***/ "c7a5006ae2e0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3924cca3566b");
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_public_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _internal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("364eb185ca94");
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("28b603686dcc");
/* harmony import */ var _rule__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("987c832cfe13");
/* harmony import */ var _rule__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_rule__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mask__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("9770341d4bfa");
/* harmony import */ var _composition_index_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("32dfc4431a24");
/* harmony import */ var _assembly_index_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ff34a74152a4");
/* harmony import */ var _position_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("2e9112dbdda9");
/* harmony import */ var _preferences_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _region_navigation_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("9edc14a11fec");
/* harmony import */ var _effects_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("4f52f56c9555");
/* harmony import */ var _notify_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("b4bff8456ce0");
/* harmony import */ var _ready_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("5effd0d9c238");
/* harmony import */ var _pending_tags_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("3c79afd07eeb");
/* harmony import */ var _preloader__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("6c7f357fe960");














 // The shared Smart runtime: core/js/smart-base.js, a script of its own beside
// core.js, holding the modules the Smart bundles are built against (they carry
// no lit or smart-base of their own). Asked for by the bundles and by the
// Loader as soon as it queues a Smart element. A page that included the script
// by hand already has it.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  const SF = window.SF; // SF.ready, before the Loader chunk is even asked for (simai/ui-source#16).

  (0,_ready_js__WEBPACK_IMPORTED_MODULE_12__.installReady)(window);

  if (!SF.loadRuntime) {
    let loading = null;

    const coreScript = () => [...document.scripts].find(script => /\/core\/js\/core(?:\.min)?\.js(?:[?#]|$)/u.test(script.src));

    SF.loadRuntime = () => {
      if (loading) return loading;

      if (SF.__internal.runtimeModules) {
        SF.__internal.runtimeSettled = true;
        loading = Promise.resolve(SF.__internal.runtimeModules);
      } else {
        loading = new Promise((resolve, reject) => {
          SF.__internal.runtimeArrived = modules => {
            SF.__internal.runtimeSettled = true;
            resolve(modules);
          };

          const core = coreScript();
          if (!core) return; // included by hand: it calls runtimeArrived when it runs

          const script = document.createElement('script'); // The same form as Core's own file, beside it.

          script.src = core.src.replace(/core(\.min)?\.js(?=[?#]|$)/u, (match, min) => `smart-base${min || ''}.js`);
          script.async = true;
          script.addEventListener('error', () => reject(new Error(`SF runtime: ${script.src} did not load`)));
          document.head.append(script);
        });
      }

      SF.__internal.runtimeLoading = loading;
      return loading;
    };

    SF.runtimeModule = id => SF.loadRuntime().then(modules => {
      if (!modules[id]) throw new Error(`SF runtime: no shared module "${id}"`);
      return modules[id];
    });
  }
} // Icons wait for the subset font. The icons stylesheet declares the full
// Material Symbols font so a page without the runtime still draws its icons,
// and a browser fetches a declared font for any text set in it -- an icon at
// font-size 0, waiting for its glyph, included. So every first visit paid for
// the full font (409 KB) that the subset replaces a moment later, and the
// subset's own wait for document.fonts.ready waited on it too. While the
// attribute stands, icons are set in the subset family instead; the loader
// lifts it once the subset font or the full-font fallback is in place, and a
// timer lifts it on a page where neither ever comes.


if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const configValue = window.SF_BOOT_CONFIG?.icons?.enabled;
  const globalValue = window.SF_ICON_SUBSET_ENABLED;
  const subsetEnabled = typeof configValue === 'boolean' ? configValue : typeof globalValue === 'boolean' ? globalValue : true;
  const root = document.documentElement;

  if (subsetEnabled && root && !root.hasAttribute('data-sf-icons')) {
    root.setAttribute('data-sf-icons', 'subset-pending');
    setTimeout(() => {
      if (root.getAttribute('data-sf-icons') === 'subset-pending') {
        root.removeAttribute('data-sf-icons');
      }
    }, 6000);
  } // The subset is asked for once the page is ready; opening the connection
  // now takes its DNS, TCP and TLS (some 350 ms to icons.simai.io) off that
  // request. The fetch and the font are both anonymous CORS requests, which
  // is the connection a crossorigin preconnect opens.


  if (subsetEnabled && document.head) {
    try {
      const host = new URL(window.SF_BOOT_CONFIG?.icons?.subsetHost || window.SF_ICON_SUBSET_HOST || 'https://icons.simai.io', document.baseURI).origin;

      if (host !== window.location.origin && !document.head.querySelector(`link[rel="preconnect"][href="${host}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = host;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    } catch {
      /* A host that is not a URL is the request's problem, not the hint's. */
    }
  }
}

(() => {
  const PLACEHOLDER_MARK = 'sf-shortcode ';
  const CDN_FALLBACK = 'https://cdn.jsdelivr.net/gh/simai/ui@main/distr/';

  if (!window.SF_BOOT_CONFIG) {
    window.SF_BOOT_CONFIG = {};
  }

  if (typeof window.SF_BOOT_CONFIG.preloader === 'undefined') {
    window.SF_BOOT_CONFIG.preloader = {
      wrap: null,
      preloaderActive: false
    };
  } // The page's spinner look (simai/ui-source#11): SF_BOOT_CONFIG.spinner names
  // it as data-sf-spinner on html would, and is written there unless the page
  // has written its own. The spinner sheet does the rest.


  const spinnerLook = window.SF_BOOT_CONFIG.spinner;

  if (typeof spinnerLook === 'string' && spinnerLook.trim() && document.documentElement && !document.documentElement.hasAttribute('data-sf-spinner')) {
    document.documentElement.setAttribute('data-sf-spinner', spinnerLook.trim().toLowerCase());
  }

  const applyInitialTheme = () => {
    if (window.SF_BOOT_CONFIG?.theme === false) return;
    const classes = ['theme-dark', 'theme-light'];
    const doc = document.documentElement;
    if (!doc) return;
    let themeCookie;

    try {
      themeCookie = document.cookie.split('; ').find(c => c.startsWith('sf-theme='));
    } catch {
      themeCookie = undefined;
    }

    let savedTheme = '';

    if (themeCookie) {
      try {
        savedTheme = decodeURIComponent(themeCookie.split('=')[1]);
      } catch {
        savedTheme = '';
      }
    }

    const preference = ['light', 'dark'].includes(savedTheme) ? savedTheme : 'system';
    const isDark = preference === 'dark' || preference === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const targetClass = isDark ? classes[0] : classes[1];
    doc.classList.remove(...classes);
    doc.classList.add(targetClass);
  };

  applyInitialTheme();

  if (!window.sfPath) {
    window.sfPath = CDN_FALLBACK;
  }

  const ensureDirAttribute = () => {
    const root = document.documentElement;
    if (!root || root.getAttribute('dir')) return;
    const computedDir = window.getComputedStyle && root ? window.getComputedStyle(root).direction : '';
    root.setAttribute('dir', computedDir === 'rtl' ? 'rtl' : 'ltr');
  };

  ensureDirAttribute(); // The page is never hidden (simai/ui-source#39): what the server printed
  // is the first paint. Only the undefined Smart elements that have nothing
  // to show until their code arrives are, each in its own box (pending-tags.js).
  // A page that ships its modules preloaded (SF_PRELOADED, Docara) defines
  // them at once and is left alone, as it was.

  const holdUndefinedUntilDefined = () => {
    if (window.SF_PRELOADED && Object.keys(window.SF_PRELOADED.modules || {}).length) {
      return;
    }

    (0,_pending_tags_js__WEBPACK_IMPORTED_MODULE_13__.installPendingTags)(window);
    (0,_pending_tags_js__WEBPACK_IMPORTED_MODULE_13__.holdUndefinedElements)(window);
  };

  holdUndefinedUntilDefined();

  const mountPreloader = () => {
    const cfg = {
      enabled: true,
      background: (0,_preloader__WEBPACK_IMPORTED_MODULE_14__.getPreloaderBackground)(),
      modifier: 'loader-default',
      tempStyles: 'inset: 0;position: fixed;width: 100%;height: 100vh;opacity: 1;z-index: 1000;background-color: var(--sf-color--surface-highest, var(--sf-surface-0, #fff));text-align: center;',
      color: (0,_preloader__WEBPACK_IMPORTED_MODULE_14__.getPreloaderColor)(),
      width: _preloader__WEBPACK_IMPORTED_MODULE_14__.DEFAULT_PRELOADER.width,
      height: _preloader__WEBPACK_IMPORTED_MODULE_14__.DEFAULT_PRELOADER.height,
      content: '',
      delay: 300,
      ...(window.SF_BOOT_CONFIG?.preloader || {})
    };
    if (cfg.enabled === false || document.querySelector('.sf-loader')) return;
    const svgContent = cfg.content || (0,_preloader__WEBPACK_IMPORTED_MODULE_14__.createPreloaderContent)(cfg);
    let wrap = null;
    let preloaderWrap = null;
    let preloaderRun = false;
    let delayTimer = null;

    const hide = () => {
      if (wrap) {
        wrap.classList.add('hidden');
      }
    };

    const stopAnimation = () => {
      if (preloaderWrap) {
        (0,_preloader__WEBPACK_IMPORTED_MODULE_14__.stopPreloaderMotion)(preloaderWrap);
      }
    };

    const buildPreloader = () => {
      if (preloaderRun || document.querySelector('.sf-loader')) return; // A page with static markup or skeletons shows them, never the
      // preloader over them (§5.4). Read when the preloader would show, after
      // its delay, when the server's markup has been parsed.

      if ((0,_preloader__WEBPACK_IMPORTED_MODULE_14__.pageHasFirstPaint)(document)) return;
      wrap = document.createElement('div');
      const inner = document.createElement('div');
      wrap.classList.add('sf-loader', cfg.modifier);
      wrap.setAttribute('data-sf-observer', 'ignore');
      wrap.setAttribute('style', cfg.tempStyles);

      if (cfg.background) {
        wrap.style.background = cfg.background;
      }

      inner.classList.add('sf-loader-block', 'sf-loader-boot');
      inner.setAttribute('style', 'display:flex; width: 100%;height: 100%;align-items: center;justify-content: center; transition: .2s all ease-in-out;');
      inner.innerHTML = svgContent;
      wrap.append(inner);
      document.documentElement.append(wrap);
      preloaderWrap = inner;
      preloaderRun = true;
      window.SF_BOOT_CONFIG.preloader = {
        wrap: wrap,
        preloaderActive: true
      };
      (0,_preloader__WEBPACK_IMPORTED_MODULE_14__.startPreloaderMotion)(preloaderWrap, () => preloaderRun, cfg);
    };

    const cancelBuild = () => {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
        preloaderWrap && preloaderWrap.classList.add('hidden');
      }
    };

    window.addEventListener('sf-loader-init', () => {
      if (!preloaderWrap?.classList?.contains('sf-loader-boot')) return;
      preloaderRun = false;
      stopAnimation();
    }, {
      once: true
    });
    window.addEventListener('sf-loader-ready', () => {
      cancelBuild();
      preloaderRun = false;
      stopAnimation();
      hide();
    }, {
      once: true
    });

    if (cfg.delay > 0) {
      delayTimer = setTimeout(buildPreloader, cfg.delay);
    } else {
      buildPreloader();
    } // A preloader asked for at once, before the body was parsed, gives way
    // when the parsed page turns out to carry its own first paint.


    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (!(0,_preloader__WEBPACK_IMPORTED_MODULE_14__.pageHasFirstPaint)(document)) return;
        cancelBuild();
        preloaderRun = false;
        stopAnimation();
        hide();
      }, {
        once: true
      });
    }
  };

  mountPreloader();

  const hideShortCodes = root => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const toReplace = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue || !node.nodeValue.includes('[!')) continue;
      toReplace.push(node);
    }

    toReplace.forEach(textNode => {
      const text = textNode.nodeValue;
      const regex = /\[!([a-zA-Z0-9_-]+)(?:\s+[^\](]+?)?](?:\([^)]*\))?(?:#[a-zA-Z0-9_-]+)?/g;
      let lastIndex = 0;
      const frag = document.createDocumentFragment();

      for (const match of text.matchAll(regex)) {
        const start = match.index ?? text.indexOf(match[0], lastIndex);
        const end = start + match[0].length;

        if (start > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
        }

        const comment = document.createComment(PLACEHOLDER_MARK + match[0]);
        (window.SF_BOOT_SHORTCODES = window.SF_BOOT_SHORTCODES || []).push(comment);
        frag.appendChild(comment);
        lastIndex = end;
      }

      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      textNode.replaceWith(frag);
    });
  };

  const isObserverIgnored = node => {
    const host = node instanceof Element ? node : node?.parentElement || null;
    return Boolean(host?.closest?.('[data-sf-observer="ignore"]'));
  };

  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes && m.addedNodes.forEach(n => {
      if (isObserverIgnored(n)) return;

      if (n.nodeType === Node.TEXT_NODE || n instanceof Text) {
        if (n.nodeValue?.includes('[!')) hideShortCodes(n.parentNode);
      } else if (n instanceof HTMLElement) {
        hideShortCodes(n);
      }
    }));
  });
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  window.addEventListener('sf-loader-init', () => mo.disconnect(), {
    once: true
  });
})(); // Core's own chunks are evaluated in order -- the rules, then the system
// events, then the Loader, which reads the rules as it starts -- but nothing
// makes them wait for each other on the wire. They were fetched one after
// another, each after the previous had run: on a 10 Mbit/s line the Loader
// started 160 ms after Core's rules had arrived (2026-10-13). The browser is
// told about all three at once; each import then finds its file fetched.


const preloadCoreChunks = () => {
  const core = [...document.scripts].find(script => /\/core\/js\/core(?:\.min)?\.js(?:[?#]|$)/u.test(script.src));
  if (!core || typeof document.createElement !== 'function') return;

  for (const name of ['core-rules', 'core-system', 'core-loader']) {
    const href = core.src.replace(/core(\.min)?\.js(?=[?#]|$)/u, (match, min) => `${name}${min || ''}.js`);
    if (document.querySelector(`link[rel="preload"][href="${href}"]`)) continue;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = href;
    document.head.append(link);
  }
};

(async () => {
  preloadCoreChunks();
  await __webpack_require__.e(/* import() | core-rules */ 80841737880868).then(__webpack_require__.bind(__webpack_require__, "a216dbc16e89"));
  await __webpack_require__.e(/* import() | core-system */ 88616323197113).then(__webpack_require__.bind(__webpack_require__, "d55d5a9f332f"));
  await __webpack_require__.e(/* import() | core-system */ 88616323197113).then(__webpack_require__.bind(__webpack_require__, "fedbedd6b87f"));
  await __webpack_require__.e(/* import() | core-loader */ 66700837013363).then(__webpack_require__.bind(__webpack_require__, "eb03d104e275"));
})();

/***/ },

/***/ "364eb185ca94"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INTERNAL_NAMES: () => (/* binding */ INTERNAL_NAMES),
/* harmony export */   installInternal: () => (/* binding */ installInternal)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
// The runtime's own names on window.SF moved under SF.__internal (week audit,
// 2026-10-18; journal global-sf-internal). They were never a promise to a page
// -- the message bus (send, receive), the runtime module registry's own state
// (runtimeModules, runtimeArrived, runtimeLoading, runtimeSettled), the Smart
// base's announcement (smartBaseAnnounced) and litHtml -- but they stood beside
// the public API (core/contracts/
// public-js-api.json marks them internal) and a page could lean on them.
//
// The old names keep working until the journal's sweep: each is an accessor on
// window.SF that reads and writes SF.__internal, and a read through it is
// noted as a deprecation (SF.deprecations.list(), a console warning under
// <html data-sf-deprecations="warn">). The Framework's own code uses
// SF.__internal. Every bundle carries a copy of this module; the store and the
// accessors live on the shared global, so the first copy installs them and the
// rest find them in place.
 // SF.loadSmartBase, SF.smart, SF.smartBaseReady, SF.loadRuntime and
// SF.runtimeModule stay where they are: the documentation promises them to a
// page (a project's own Smart component extends SF.smart.SfBaseElement after
// `await SF.loadSmartBase()`), so they are public, not the runtime's.

const INTERNAL_NAMES = Object.freeze(['send', 'receive', 'runtimeModules', 'runtimeArrived', 'runtimeLoading', 'runtimeSettled', 'smartBaseAnnounced', 'litHtml']);
function installInternal(root = globalThis) {
  const SF = root.SF = root.SF || {};

  if (!SF.__internal || typeof SF.__internal !== 'object') {
    Object.defineProperty(SF, '__internal', {
      value: {},
      configurable: true,
      enumerable: false,
      writable: false
    });
  }

  const store = SF.__internal;

  for (const name of INTERNAL_NAMES) {
    const own = Object.getOwnPropertyDescriptor(SF, name);
    if (own?.get?.sfInternalAlias) continue; // A value a page or an older bundle put there first is kept.

    if (own && 'value' in own && !(name in store)) store[name] = own.value;

    const get = () => {
      (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
        kind: 'global',
        from: `SF.${name}`,
        to: `SF.__internal.${name}`
      });
      return store[name];
    };

    get.sfInternalAlias = true;
    Object.defineProperty(SF, name, {
      configurable: true,
      enumerable: false,
      get,

      set(value) {
        store[name] = value;
      }

    });
  }

  return store;
}
if (typeof globalThis !== 'undefined') installInternal(globalThis);

/***/ },

/***/ "78628e837a32"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ "9770341d4bfa"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyPattern: () => (/* binding */ applyPattern),
/* harmony export */   createNativeMask: () => (/* binding */ createNativeMask),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   format: () => (/* binding */ format)
/* harmony export */ });
function getGlobalRoot() {
  if (!window.SF) window.SF = {};
  return window.SF;
}

function resolveElement(target) {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  if (typeof target === 'string') return document.querySelector(target);
  return null;
}

function digits(value) {
  return String(value ?? '').replace(/\D+/g, '');
} // The pattern grammar the fields document, IMask's: `0` a digit, `a` a letter,
// `*` any character, `{...}` a fixed part that belongs to the value (`+{7}`),
// `[` `]` mark an optional tail and are dropped, `\` escapes the next character,
// and every other character is a fixed part that is only shown. The pattern
// used to be read one way only -- `0` a digit, everything else printed -- and
// the formatter then re-read the digits of its own fixed parts as input, so
// `+{7} (000)` printed its braces and turned `916` into `(777)`.


const SLOT_TESTS = {
  0: character => /\d/u.test(character),
  a: character => /\p{L}/u.test(character),
  '*': () => true
};

function parsePattern(pattern) {
  const tokens = [];
  let unmasked = false;

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];

    if (character === '\\') {
      index += 1;
      if (index < pattern.length) tokens.push({
        fixed: pattern[index],
        unmasked
      });
    } else if (character === '{') {
      unmasked = true;
    } else if (character === '}') {
      unmasked = false;
    } else if (character === '[' || character === ']') {// Optional sections: every slot is optional while lazy anyway.
    } else if (SLOT_TESTS[character]) {
      tokens.push({
        test: SLOT_TESTS[character]
      });
    } else {
      tokens.push({
        fixed: character,
        unmasked
      });
    }
  }

  return tokens;
} // What the person typed, read against the pattern position by position: a
// character that matches the fixed part the pattern expects there is that
// fixed part, a placeholder in a slot is an empty slot, and anything else is
// input for the next slot that accepts it. `before` counts the input taken
// from the first `caret` characters, so the caret can be put back after it.


function extractInput(value, tokens, options = {}, caret = -1) {
  const placeholder = options.placeholderChar || '_';
  const source = String(value ?? '');
  const slots = tokens.filter(token => token.test);
  const accepted = [];
  let before = 0;
  let pointer = 0;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    while (pointer < tokens.length && tokens[pointer].fixed !== undefined && tokens[pointer].fixed !== character) {
      pointer += 1;
    }

    if (pointer >= tokens.length) {
      // Typed past the end of a shown template -- a caret left after the
      // placeholders: the character fills the first empty slot, not nothing.
      if (options.lazy === false && accepted.length < slots.length && slots[accepted.length].test(character)) {
        accepted.push(character);
        if (index < caret) before = accepted.length;
      }

      continue;
    }

    const token = tokens[pointer];

    if (token.fixed !== undefined) {
      pointer += 1;
    } else if (options.lazy === false && character === placeholder) {
      pointer += 1;
    } else if (token.test(character)) {
      accepted.push(character);
      if (index < caret) before = accepted.length;
      pointer += 1;
    }
  }

  return {
    accepted,
    before
  };
}

function renderPattern(input, tokens, options = {}) {
  const placeholder = options.placeholderChar || '_';
  const full = options.lazy === false;
  let display = '';
  let unmasked = '';
  const caretAfter = [];
  let firstSlot = -1;
  let cursor = 0;

  for (const token of tokens) {
    if (token.fixed !== undefined) {
      if (cursor >= input.length && !full) break;
      display += token.fixed;
      if (token.unmasked && cursor < input.length) unmasked += token.fixed;
    } else if (cursor < input.length) {
      if (cursor === 0) firstSlot = display.length;
      display += input[cursor];
      unmasked += input[cursor];
      cursor += 1;
      caretAfter[cursor] = display.length;
    } else if (full) {
      display += placeholder;
    } else {
      break;
    }
  }

  if (!full && cursor === 0) display = '';
  if (firstSlot >= 0) caretAfter[0] = firstSlot;else caretAfter[0] = full && display.includes(placeholder) ? display.indexOf(placeholder) : display.length;
  return {
    display,
    unmasked,
    caretAfter
  };
}

function applyPattern(value, pattern, options = {}) {
  if (typeof pattern !== 'string' || pattern === '') return String(value ?? '');
  const tokens = parsePattern(pattern);
  return renderPattern(extractInput(value, tokens, options).accepted, tokens, options).display;
} // Number itself, the string from JSON options, or Number from another realm --
// a documentation example runs in a frame of its own.


function isNumberMask(options) {
  const {
    mask
  } = options;
  return mask === Number || mask === 'Number' || typeof mask === 'function' && mask.name === 'Number' && mask(' 1 ') === 1;
}

function numberRadix(options) {
  return options.radix || ',';
}

function parseNumber(value, options = {}) {
  let candidate = String(value ?? '');
  if (options.thousandsSeparator) candidate = candidate.replaceAll(options.thousandsSeparator, '');
  candidate = candidate.replace(/\s+/gu, '');
  const radix = numberRadix(options);
  if (radix !== '.') candidate = candidate.replace(radix, '.');
  if (candidate === '' || candidate === '-' || candidate === '.') return null;
  const number = Number(candidate);
  return Number.isFinite(number) ? number : null;
}

function groupInteger(integer, separator) {
  if (!separator) return integer;
  return integer.replace(/\B(?=(\d{3})+(?!\d))/gu, separator);
} // A number while it is typed: digits, one radix (either mark typed becomes the
// radix), a leading minus when negatives are allowed, no more fraction digits
// than the scale -- grouped, but not clamped or padded, so `12,` and `-` stay
// on the way to a number. `typedBefore` counts what was kept before the caret
// -- digits, the radix, the minus -- so the caret goes back after the same.


function typingNumber(value, options = {}, caret = -1) {
  const radix = numberRadix(options);
  const marks = new Set([radix, ...(options.mapToRadix || ['.', ','])]);
  const scale = Math.max(0, Number(options.scale ?? 2) || 0);
  const signed = options.signed === true || Number.isFinite(options.min) && options.min < 0;
  let negative = false;
  let integer = '';
  let fraction = '';
  let hasRadix = false;
  let typedBefore = 0;
  const source = String(value ?? '');

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const counted = index < caret;

    if (/\d/u.test(character)) {
      if (hasRadix) {
        if (fraction.length >= scale) continue;
        fraction += character;
      } else {
        integer += character;
      }

      if (counted) typedBefore += 1;
    } else if (character === '-' && signed && !negative && !integer && !hasRadix) {
      negative = true;
      if (counted) typedBefore += 1;
    } else if (marks.has(character) && character !== options.thousandsSeparator && scale > 0 && !hasRadix) {
      hasRadix = true;
      if (counted) typedBefore += 1;
    }
  }

  if (options.normalizeZeros !== false) integer = integer.replace(/^0+(?=\d)/u, '');
  if (hasRadix && !integer) integer = '0';
  const display = `${negative ? '-' : ''}${groupInteger(integer, options.thousandsSeparator)}` + (hasRadix ? `${radix}${fraction}` : '');
  return {
    display,
    typedBefore
  };
} // The number committed: clamped to min and max, the scale applied and, when
// asked, the fraction padded. This is what typedValue, value and pipe write.


function formatNumber(value, options = {}) {
  if (value === '' || value === null || value === undefined) return '';
  const number = typeof value === 'number' ? value : parseNumber(typingNumber(value, options).display, options);
  if (number === null || !Number.isFinite(number)) return '';
  const minimum = Number.isFinite(options.min) ? options.min : number;
  const maximum = Number.isFinite(options.max) ? options.max : number;
  const normalized = Math.min(maximum, Math.max(minimum, number));
  const precision = Math.max(0, Number(options.scale ?? 2) || 0);
  const fixed = normalized.toFixed(precision);
  const [integer, fraction = ''] = (options.padFractionalZeros ? fixed : String(Number(fixed))).split('.');
  const sign = integer.startsWith('-') ? '-' : '';
  const grouped = groupInteger(integer.replace('-', ''), options.thousandsSeparator);
  return `${sign}${grouped}${fraction ? `${numberRadix(options)}${fraction}` : ''}`;
}

function format(value, options = {}) {
  if (isNumberMask(options)) return formatNumber(value, options);
  if (typeof options.mask === 'function') return String(options.mask(value));

  if (options.mask instanceof RegExp) {
    const candidate = String(value ?? '');
    return options.mask.test(candidate) ? candidate : candidate.slice(0, -1);
  }

  return applyPattern(value, options.mask, options);
}

function caretOf(element) {
  try {
    return typeof element.selectionStart === 'number' ? element.selectionStart : -1;
  } catch {
    return -1;
  }
}

function placeCaret(element, position) {
  if (position < 0 || typeof element.setSelectionRange !== 'function') return;
  if (element.ownerDocument?.activeElement !== element) return;

  try {
    element.setSelectionRange(position, position);
  } catch {
    /* Inputs of some types refuse a selection; the value is what matters. */
  }
}

function createNativeMask(element, options) {
  const state = {
    destroyed: false
  };
  const tokens = typeof options.mask === 'string' && !isNumberMask(options) ? parsePattern(options.mask) : null;

  const show = (next, caret) => {
    if (next !== element.value) element.value = next;
    placeCaret(element, caret);
  };

  const sync = () => {
    if (state.destroyed) return;
    const caret = caretOf(element);

    if (tokens) {
      const {
        accepted,
        before
      } = extractInput(element.value, tokens, options, caret);
      const rendered = renderPattern(accepted, tokens, options);
      show(rendered.display, caret < 0 ? -1 : rendered.caretAfter[before] ?? rendered.display.length);
    } else if (isNumberMask(options)) {
      const {
        display,
        typedBefore
      } = typingNumber(element.value, options, caret);
      let position = display.length;

      if (caret >= 0) {
        let seen = 0;
        position = 0;
        const radix = numberRadix(options);

        while (position < display.length && seen < typedBefore) {
          const character = display[position];
          if (/\d/u.test(character) || character === radix || character === '-') seen += 1;
          position += 1;
        }
      }

      show(display, caret < 0 ? -1 : position);
    } else {
      show(format(element.value, options), -1);
    }
  }; // A number is committed when the field is left: clamped, scaled, padded.


  const commit = () => {
    if (state.destroyed || !isNumberMask(options)) return;
    const next = formatNumber(element.value, options);
    if (next !== element.value) element.value = next;
  }; // With the template shown, a click lands anywhere in it -- usually past the
  // placeholders, where a typed character falls off the end of the pattern.
  // The caret goes to the first empty slot instead, as IMask puts it.
  // A click has placed the caret by the time it fires; a focus from the
  // keyboard or a pointer places it a moment later.


  const settleCaretNow = () => {
    if (state.destroyed || !tokens || options.lazy !== false) return;
    const caret = caretOf(element);
    const end = typeof element.selectionEnd === 'number' ? element.selectionEnd : caret;
    if (caret < 0 || caret !== end) return;
    const {
      accepted
    } = extractInput(element.value, tokens, options);
    const rendered = renderPattern(accepted, tokens, options);
    const filled = rendered.caretAfter[accepted.length] ?? rendered.display.length;
    if (caret > filled) placeCaret(element, filled);
  };

  const settleCaret = () => {
    if (state.destroyed || !tokens || options.lazy !== false) return;
    setTimeout(settleCaretNow, 0);
  };

  element.addEventListener('input', sync);
  element.addEventListener('blur', commit);
  element.addEventListener('focus', settleCaret);
  element.addEventListener('click', settleCaretNow);

  if (isNumberMask(options)) {
    if (element.value !== '') element.value = formatNumber(element.value, options);
  } else {
    sync();
  }

  const unmasked = () => {
    if (tokens) {
      return renderPattern(extractInput(element.value, tokens, options).accepted, tokens, options).unmasked;
    }

    if (isNumberMask(options)) {
      const number = parseNumber(element.value, options);
      return number === null ? '' : String(number);
    }

    return digits(element.value);
  };

  return {
    get value() {
      return element.value;
    },

    set value(value) {
      element.value = format(value, options);
    },

    get unmaskedValue() {
      return unmasked();
    },

    // Readable and writable, like the two next to it. A consumer that holds a
    // raw number and wants it shown through the mask -- the country code field
    // does exactly that with a value the page arrived with -- writes it here;
    // a getter alone turns that assignment into a throw under strict mode,
    // which modules are.
    set unmaskedValue(value) {
      element.value = format(tokens ? String(value ?? '') : digits(value), options);
    },

    get typedValue() {
      if (!isNumberMask(options) || element.value.trim() === '') return null;
      return parseNumber(element.value, options);
    },

    set typedValue(value) {
      element.value = format(value, options);
    },

    updateValue: sync,

    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      element.removeEventListener('input', sync);
      element.removeEventListener('blur', commit);
      element.removeEventListener('focus', settleCaret);
      element.removeEventListener('click', settleCaretNow);
    }

  };
}

const Mask = {
  async load() {
    return createNativeMask;
  },

  async create(target, options) {
    const element = resolveElement(target);
    if (!element || !options) return null;
    return createNativeMask(element, options);
  },

  async pipe(value, masked) {
    return format(value, typeof masked === 'object' ? masked : {
      mask: masked
    });
  },

  destroy(instance) {
    instance?.destroy?.();
  }

};
getGlobalRoot().Mask = Mask; // Fields whose scripts ran before Core wait for this (component/mask-service).

if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
  window.dispatchEvent(new CustomEvent('sf-mask-ready'));
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Mask);

/***/ },

/***/ "b4bff8456ce0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   configureNotifications: () => (/* binding */ configureNotifications),
/* harmony export */   notify: () => (/* binding */ notify)
/* harmony export */ });
/* harmony import */ var _page_language__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _layer_stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("78628e837a32");
// One way to tell a person something happened: SF.notify. Every component and
// every product used to raise its own toast where it stood -- over a card, in a
// corner of its own, for its own time -- so messages turned up anywhere and
// one on top of another (owner, 2026-10-13). Now there is one place for them.
//
// SF.notify({status, title, text, action, duration, source, key}) shows a toast
// in the page's notification area and says so with the `sf-notification` event
// on the document, which a notification centre (Larena's) records. The area
// lives in the top layer, at one edge of the window; messages stack with a gap,
// at most four at a time and the rest waiting their turn; the same message
// shown again counts up instead of stacking twice; a timer pauses while the
// pointer or the focus is on its toast; an error is announced at once, the rest
// politely. The toast is the toast component, fetched the first time.


const NOTIFY_TEXT = {
  en: {
    region: 'Notifications'
  },
  ru: {
    region: 'Уведомления'
  }
};
const STATUSES = new Set(['neutral', 'info', 'success', 'warning', 'error']);
const ICONS = {
  success: 'check_circle',
  info: 'info',
  warning: 'warning',
  error: 'error',
  neutral: ''
}; // Long enough to read a sentence; an error stays a little longer. 0 keeps a
// message until it is closed.

const DURATIONS = {
  neutral: 5000,
  info: 5000,
  success: 5000,
  warning: 8000,
  error: 10000
};
const PLACEMENTS = new Set(['top-start', 'top-end', 'bottom-start', 'bottom-end']);
const state = {
  region: null,
  shown: [],
  waiting: [],
  history: [],
  max: 4,
  placement: 'bottom-end',
  counter: 0
};

function toastApi() {
  return globalThis.SF?.Toast?.create ? globalThis.SF.Toast : null;
} // The toast component, fetched once: its rule is the Loader's 'toast'.


function whenToast() {
  if (toastApi()) return Promise.resolve(toastApi());
  globalThis.SF?.Loader?.ensurePlugin?.('toast');
  return new Promise(resolve => {
    const done = () => {
      globalThis.removeEventListener('Toast:ready', done);
      resolve(toastApi());
    };

    globalThis.addEventListener('Toast:ready', done); // A page without the Loader that includes the toast script by hand.

    const poll = tries => {
      if (toastApi()) return done();
      if (tries > 0) setTimeout(() => poll(tries - 1), 100);
    };

    poll(50);
  });
}

function region() {
  if (state.region?.isConnected) return state.region;
  const area = document.createElement('section');
  area.className = 'sf-notifications';
  area.dataset.placement = state.placement;
  area.setAttribute('aria-label', (0,_page_language__WEBPACK_IMPORTED_MODULE_0__.pageText)(NOTIFY_TEXT, 'region', document.documentElement));
  if (typeof area.showPopover === 'function') area.setAttribute('popover', 'manual');
  area.addEventListener('sf-toast-close', event => {
    const entry = state.shown.find(item => item.toast === event.target);
    if (entry) release(entry);
  });
  area.addEventListener('sf-toast-action', event => {
    const entry = state.shown.find(item => item.toast === event.detail?.toast);
    if (!entry) return;
    entry.options.action?.onSelect?.(entry.record);
    globalThis.SF?.Toast?.dismiss?.(entry.toast);
  });
  document.body.append(area);
  state.region = area;
  return area;
}

function showRegion() {
  const area = region();

  if (typeof area.showPopover === 'function' && !area.matches(':popover-open')) {
    try {
      area.showPopover();
    } catch {
      /* not in a document yet */
    }
  } // A layer of the one document stack (standard 1.3.8 §19.1), the kind that
  // takes no keys: Escape and Tab stay with the window under it. Its height
  // counts where the browser has no top layer.


  (0,_layer_stack__WEBPACK_IMPORTED_MODULE_1__.openLayer)(area, {
    kind: 'toast',
    returnTo: null,
    place: ({
      zIndex
    }) => {
      area.style.zIndex = String(zIndex);
    }
  });
}

function hideRegionWhenEmpty() {
  const area = state.region;
  if (!area || state.shown.length || state.waiting.length) return;
  if (typeof area.hidePopover === 'function' && area.matches(':popover-open')) area.hidePopover();
  (0,_layer_stack__WEBPACK_IMPORTED_MODULE_1__.closeLayer)(area, {
    restoreFocus: false
  });
}

function release(entry) {
  state.shown = state.shown.filter(item => item !== entry);
  const next = state.waiting.shift();
  if (next) display(next);else setTimeout(hideRegionWhenEmpty, 0);
} // The slot is taken at once and the toast drawn when its component is there:
// taken after the fetch, every message raised meanwhile found the area empty
// and all of them were shown, the same one twice.


async function display(entry) {
  state.shown.push(entry);
  const api = await whenToast();
  if (!api || !state.shown.includes(entry)) return;
  const {
    record,
    options
  } = entry;
  const toast = api.create({
    status: record.status,
    icon: options.icon ?? ICONS[record.status],
    title: record.title,
    supportingText: record.text,
    actionText: options.action?.label ?? '',
    action: options.action ? options.action.id ?? 'action' : '',
    closable: true,
    duration: options.duration,
    role: record.status === 'error' ? 'alert' : 'status'
  });
  toast.dataset.sfNotification = record.id;
  if (entry.count > 1) toast.dataset.count = String(entry.count);
  entry.toast = toast;
  showRegion(); // The newest at the edge the area grows from: nearest the edge it sits on.

  const area = region();
  if (state.placement.startsWith('top')) area.prepend(toast);else area.append(toast);
}

function normalise(options) {
  const status = STATUSES.has(options.status) ? options.status : 'neutral';
  const title = String(options.title ?? '').trim();
  const text = String(options.text ?? '').trim();
  const duration = Number.isFinite(Number(options.duration)) ? Math.max(0, Number(options.duration)) : DURATIONS[status];
  return {
    status,
    title,
    text,
    duration
  };
}
/**
 * Shows a message in the page's notification area and announces it with the
 * `sf-notification` event. Returns {id, close()}; null when nothing was given.
 */


function notify(options = {}) {
  if (typeof document === 'undefined') return null;
  const {
    status,
    title,
    text,
    duration
  } = normalise(options);
  if (!title && !text) return null;
  state.counter += 1;
  const record = Object.freeze({
    id: `n${Date.now().toString(36)}${state.counter}`,
    status,
    title,
    text,
    source: String(options.source ?? ''),
    time: new Date().toISOString()
  });
  const key = String(options.key ?? `${status}|${title}|${text}`); // Said to whoever records messages first: a notification centre keeps it
  // whether or not it is shown, and may take the showing over by cancelling.

  const announced = document.dispatchEvent(new CustomEvent('sf-notification', {
    bubbles: true,
    cancelable: true,
    detail: record
  }));
  state.history = [record, ...state.history].slice(0, 50);
  const handle = {
    id: record.id,
    close: () => close(record.id)
  };
  if (!announced || options.silent) return handle; // The same message again counts up on the toast already shown.

  const repeated = [...state.shown, ...state.waiting].find(entry => entry.key === key);

  if (repeated) {
    repeated.count = (repeated.count ?? 1) + 1;

    if (repeated.toast) {
      repeated.toast.dataset.count = String(repeated.count);
      globalThis.SF?.Toast?.unbind?.(repeated.toast);
      globalThis.SF?.Toast?.bind?.(repeated.toast);
    }

    return {
      id: repeated.record.id,
      close: () => close(repeated.record.id)
    };
  }

  const entry = {
    record,
    key,
    options: { ...options,
      duration
    },
    count: 1,
    toast: null
  };
  if (state.shown.length >= state.max) state.waiting.push(entry);else display(entry);
  return handle;
}

function close(id) {
  const waiting = state.waiting.findIndex(entry => entry.record.id === id);

  if (waiting !== -1) {
    state.waiting.splice(waiting, 1);
    return true;
  }

  const entry = state.shown.find(item => item.record.id === id);
  if (!entry) return false;

  if (!entry.toast) {
    release(entry);
    return true;
  }

  return globalThis.SF?.Toast?.dismiss?.(entry.toast) ?? false;
}
/** Where the area sits and how many messages it shows at once. */


function configureNotifications({
  placement,
  max
} = {}) {
  if (PLACEMENTS.has(placement)) {
    state.placement = placement;
    if (state.region) state.region.dataset.placement = placement;
  }

  if (Number.isInteger(max) && max > 0) state.max = max;
  return {
    placement: state.placement,
    max: state.max
  };
}

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};

  if (!window.SF.notify) {
    window.SF.notify = notify;
    window.SF.notifications = {
      configure: configureNotifications,
      close,
      // The last fifty messages of this page, newest first: a page without a
      // notification centre can still show what it said.
      history: () => state.history.slice()
    };
  }
}

/***/ },

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followLanguage: () => (/* binding */ followLanguage),
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText),
/* harmony export */   pageWord: () => (/* binding */ pageWord)
/* harmony export */ });
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered;

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
};

const announce = () => {
  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
}; // The nearest element that says its language, looking past shadow roots: a
// pagination drawn inside a data view's shadow root found no [lang] there,
// fell back to <html lang> and spoke English inside a Russian admin whose
// language was set on the shell around it.


function langOwner(node) {
  let current = node;

  while (current) {
    const owner = typeof current.closest === 'function' ? current.closest('[lang]') : null;
    if (owner) return owner;
    const root = typeof current.getRootNode === 'function' ? current.getRootNode() : null;
    current = root && root !== current && root.host ? root.host : null;
  }

  return null;
} // The language of a part of the page wins over the language chosen for the
// whole page (owner, 2026-10-26; standard simai.smart-component 1.3.8 §11.1):
//   1. a word given on the element itself (the component's own attribute);
//   2. the nearest [lang] below <html>;
//   3. the page's choice, SF.language.use(), which also sets <html lang>;
//   4. <html lang>;
//   5. English.
// Until 2026-10-27 the choice won over a section's [lang], so an English
// section inside a Russian page that had called use('ru') spoke Russian.


function languageSource(node) {
  const owner = langOwner(node);
  const root = globalThis.document?.documentElement ?? null;
  if (owner && owner !== root) return owner.getAttribute('lang');
  if (STORE.chosen) return STORE.chosen;
  return owner?.getAttribute('lang') || root?.lang || 'en';
}
/**
 * The page's language for this node: the nearest [lang] below <html>, else
 * the language the page chose, else <html lang>, else English.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  return normalise(languageSource(node)).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  return normalise(languageSource(node)) || 'en';
}
/**
 * Follows `lang` in the document (§11.1 «changes are followed»): one observer
 * for the page, whichever bundle starts it, and the elements under a changed
 * [lang] draw again. `element.requestComponentUpdate('language')` is what a
 * Smart element does; anything else passes its own `redraw`. Returns the way
 * to stop following.
 */

function followLanguage(element, redraw = () => element.requestComponentUpdate?.('language')) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const doc = element?.ownerDocument ?? root.document;
  const Observer = doc?.defaultView?.MutationObserver ?? root.MutationObserver;
  if (!doc?.documentElement || typeof Observer !== 'function') return () => {};

  if (!root.__sfLanguageWatch || root.__sfLanguageWatch.document !== doc) {
    const watch = {
      document: doc,
      elements: new Map(),
      observer: null
    };
    watch.observer = new Observer(records => {
      const changed = [...new Set(records.map(record => record.target))];

      for (const [one, again] of [...watch.elements]) {
        if (changed.some(target => within(target, one))) {
          try {
            again();
          } catch {// One element that fails to draw does not keep the others in the
            // old language.
          }
        }
      }
    });
    watch.observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
      subtree: true
    });
    root.__sfLanguageWatch = watch;
  }

  const watch = root.__sfLanguageWatch;
  watch.elements.set(element, redraw);
  return () => watch.elements.delete(element);
} // Whether `node` is `target` or below it, across shadow roots.

function within(target, node) {
  for (let current = node; current;) {
    if (current === target) return true;
    current = current.parentNode || current.host || null;
  }

  return false;
}

function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  const owner = component ?? componentOf(node);

  for (const candidate of chain(pageLocale(node))) {
    const added = owner ? REGISTERED.get(owner)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
} // Missing words are said once per component, word and language: a page that
// draws a hundred rows must not print a hundred warnings. The marks are kept on
// the shared global, because every bundle carries this module.

function warnWord(owner, key, locale, said) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfWordWarnings instanceof Set)) root.__sfWordWarnings = new Set();
  const mark = `${owner}|${key}|${locale}|${said}`;
  if (root.__sfWordWarnings.has(mark)) return;

  root.__sfWordWarnings.add(mark);

  globalThis.console?.warn?.(`[SIMAI Framework] ${owner || 'component'}: no word "${key}" for ${locale}${said === 'key' ? '; the key is shown' : `; said in ${said}`}`);
}

function fill(text, locale, count, vars) {
  return String(text).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => {
    if (name === 'n' && count !== undefined) {
      try {
        return new Intl.NumberFormat(locale).format(count);
      } catch {
        return String(count);
      }
    }

    return vars && Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole;
  });
}
/**
 * A component's own word (standard simai.smart-component 1.3.8 §11, §11.1).
 *
 * `dictionary` is `{<locale>: {<key>: word}}` from the component's language
 * files. A word given on the element itself is the caller's to prefer; this
 * resolves the rest: words registered for the element's language, then the
 * shipped ones, the language without its region, English, the component's
 * source language and, last, the key. The last two warn once. A word that
 * takes a number is an object of plural forms chosen by Intl.PluralRules of
 * the language the word was found in; `{n}` is the number in that language's
 * format and `{name}` takes `vars.name`.
 */


function pageWord(dictionary, key, node, {
  component,
  source = '',
  count,
  vars
} = {}) {
  const owner = component ?? componentOf(node);
  const locale = pageLocale(node);
  const order = chain(locale);
  const sourceLanguage = normalise(source);
  if (sourceLanguage && !order.includes(sourceLanguage)) order.push(sourceLanguage);

  for (const candidate of order) {
    const added = owner ? REGISTERED.get(owner)?.get(candidate)?.[key] : undefined;
    const word = added !== undefined ? added : dictionary?.[candidate]?.[key];
    if (word === undefined || word === null) continue;
    if (candidate === sourceLanguage && !chain(locale).includes(candidate)) warnWord(owner, key, locale, candidate);

    if (typeof word === 'object') {
      let form = 'other';

      if (count !== undefined) {
        try {
          form = new Intl.PluralRules(candidate).select(Number(count));
        } catch {
          form = 'other';
        }
      }

      const picked = word[form] ?? word.other;
      if (picked === undefined) continue;
      return fill(picked, candidate, count, vars);
    }

    return fill(word, candidate, count, vars);
  }

  warnWord(owner, key, locale, 'key');
  return key;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next; // The choice is the page's language: <html lang> says it too (§11.1), so
    // the browser, a screen reader and CSS :lang() agree with the words.
    // use(null) gives the markup's own language back.

    const root = globalThis.document?.documentElement;

    if (root) {
      const holder = globalThis;

      if (next) {
        if (holder.__sfMarkupLanguage === undefined) holder.__sfMarkupLanguage = root.getAttribute('lang');
        if (root.getAttribute('lang') !== next) root.setAttribute('lang', next);
      } else if (holder.__sfMarkupLanguage !== undefined) {
        if (holder.__sfMarkupLanguage === null) root.removeAttribute('lang');else root.setAttribute('lang', holder.__sfMarkupLanguage);
        holder.__sfMarkupLanguage = undefined;
      }
    }

    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = String(component ?? '').toLowerCase();
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
  },

  /** One language across many components: `{ 'sf-datepicker': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    const name = String(component ?? '').toLowerCase();
    return [...(REGISTERED.get(name)?.keys() ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "3c79afd07eeb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PENDING_TAGS_ID: () => (/* binding */ PENDING_TAGS_ID),
/* harmony export */   PENDING_TAG_TIMEOUT_MS: () => (/* binding */ PENDING_TAG_TIMEOUT_MS),
/* harmony export */   holdUndefinedElements: () => (/* binding */ holdUndefinedElements),
/* harmony export */   installPendingTags: () => (/* binding */ installPendingTags),
/* harmony export */   pendingTagRule: () => (/* binding */ pendingTagRule)
/* harmony export */ });
// Undefined Smart elements, kept invisible until their code arrives
// (standard simai.smart-component 1.3.8 §5.4; simai/ui-source#39).
//
// Core used to set the body's opacity to 0 until sf-loader-ready, so whatever
// the server had printed -- class markup, text, the static markup of a Smart
// element, the core skeleton shapes -- was never seen before the Loader was
// done: on a slow line a composed skeleton that was in at 2 s stayed invisible
// until 4.8 s (stand 22). The page is never hidden now. What is hidden is an
// element whose code is coming and that has nothing to show in the meantime:
// an undefined element of a tag held here, with no static child
// (`data-sf-static`) and no core skeleton shape on the host (`data-sf-skeleton`).
// `visibility` keeps its box, so nothing moves when it is defined.
//
// One stylesheet, one rule per held tag. A tag is held by Core while the page
// is parsed (every undefined sf- element it meets) and by the Loader when it
// asks for the tag's module; it is let go when the tag is defined, and in any
// case after a timeout, so a module that fails to load leaves its elements
// shown as they are rather than hidden for ever. A hold the Loader asked for
// says so on the console when it times out.
//
// Every bundle carries a copy of this module; the first one puts the store on
// the shared global, and the rest find it there.
const PENDING_TAGS_ID = 'sf-pending-tags';
const PENDING_TAG_TIMEOUT_MS = 10000;
const TAG_NAME = /^[a-z][a-z0-9]*-[a-z0-9._-]*$/u; // :has() in a browser without it drops the rule, and the element is shown:
// the failure is towards showing, never towards hiding.

function pendingTagRule(tag) {
  return `${tag}:not(:defined):not([data-sf-skeleton]):not(:has(> [data-sf-static])){visibility:hidden}`;
}
function installPendingTags(win = typeof window !== 'undefined' ? window : undefined) {
  if (!win) return undefined;
  win.SF = win.SF || {};
  const SF = win.SF; // SF.__internal is read-only (internal.js); made the same way where that
  // has not run yet.

  if (!SF.__internal || typeof SF.__internal !== 'object') {
    Object.defineProperty(SF, '__internal', {
      value: {},
      configurable: true,
      enumerable: false,
      writable: false
    });
  }

  const internal = SF.__internal;
  if (internal.pendingTags) return internal.pendingTags;
  const doc = win.document;
  const registry = win.customElements; // tag -> {timer, asked}

  const held = new Map();
  let sheet = null;

  const write = () => {
    if (!doc) return;

    if (!held.size) {
      sheet?.remove();
      sheet = null;
      return;
    }

    if (!sheet) {
      sheet = doc.createElement('style');
      sheet.id = PENDING_TAGS_ID;
      sheet.setAttribute('data-sf-observer', 'ignore');
      (doc.head || doc.documentElement).append(sheet);
    }

    sheet.textContent = [...held.keys()].map(pendingTagRule).join('\n');
  };

  const release = tag => {
    const entry = held.get(tag);
    if (!entry) return false;
    clearTimeout(entry.timer);
    held.delete(tag);
    write();
    return true;
  };

  const expire = (tag, timeout) => {
    const entry = held.get(tag);
    if (!entry) return;
    release(tag);

    if (entry.asked && !registry?.get(tag)) {
      console.warn(`SF: <${tag}> was not defined within ${timeout} ms; its elements are shown as they are`);
    }
  }; // asked: the Loader has asked for the tag's module. Its timer starts again
  // then, so a tag Core held while the page was parsed has the whole timeout
  // for its module, not what was left of it.


  const hold = (name, {
    asked = false,
    timeout = PENDING_TAG_TIMEOUT_MS
  } = {}) => {
    const tag = String(name || '').trim().toLowerCase();
    if (!TAG_NAME.test(tag) || registry?.get(tag)) return false;
    const entry = held.get(tag);
    if (entry && (!asked || entry.asked)) return true;
    if (entry) clearTimeout(entry.timer);
    held.set(tag, {
      asked: asked || Boolean(entry?.asked),
      timer: setTimeout(() => expire(tag, timeout), timeout)
    });

    if (!entry) {
      write();
      registry?.whenDefined?.(tag).then(() => release(tag));
    }

    return true;
  }; // The holds nobody asked a module for: tags no rule claims, or elements the
  // Loader leaves for later (inside a closed container). Let go once the
  // Loader is ready; the Loader holds them again when it asks.


  const releaseUnasked = () => {
    [...held].filter(([, entry]) => !entry.asked).forEach(([tag]) => release(tag));
  };

  const api = {
    hold,
    release,
    releaseUnasked,
    isHeld: tag => held.has(String(tag || '').toLowerCase()),
    held: () => [...held.keys()]
  };
  internal.pendingTags = api;
  return api;
} // Core's part: every undefined sf- element met while the page is parsed is
// held, from the first element on, so nothing that waits for its code shows
// its raw children before the Loader has even read the page. Stops at
// sf-loader-ready; from then on the Loader holds what it asks for.

function holdUndefinedElements(win = typeof window !== 'undefined' ? window : undefined) {
  const doc = win?.document;
  const pending = win?.SF?.__internal?.pendingTags;

  if (!doc?.documentElement || !pending || typeof win.MutationObserver !== 'function') {
    return null;
  }

  const holdIn = root => {
    if (root.nodeType !== 1) return;
    if (root.localName.startsWith('sf-')) pending.hold(root.localName);
    root.querySelectorAll(':not(:defined)').forEach(el => {
      if (el.localName.startsWith('sf-')) pending.hold(el.localName);
    });
  };

  holdIn(doc.documentElement);
  const observer = new win.MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(holdIn));
  });
  observer.observe(doc.documentElement, {
    childList: true,
    subtree: true
  });
  win.addEventListener('sf-loader-ready', () => {
    observer.disconnect();
    pending.releaseUnasked();
  }, {
    once: true
  });
  return observer;
}

/***/ },

/***/ "14baf2d02711"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logicalSide: () => (/* binding */ logicalSide),
/* harmony export */   physicalPlacement: () => (/* binding */ physicalPlacement)
/* harmony export */ });
// Pure logical ⇄ physical placement mapping for SF.Position. No DOM and no
// dependencies, so it is testable without Floating UI installed.
const SIDES = ['block-start', 'block-end', 'inline-start', 'inline-end'];
const ALIGNS = ['start', 'center', 'end'];
/** Maps a logical side and alignment to a Floating UI placement. */

function physicalPlacement(side = 'block-end', align = 'start', rtl = false) {
  if (!SIDES.includes(side)) throw new TypeError(`Unknown placement side: ${side}`);
  if (!ALIGNS.includes(align)) throw new TypeError(`Unknown placement alignment: ${align}`);
  const physical = side === 'block-start' ? 'top' : side === 'block-end' ? 'bottom' : side === 'inline-start' ? rtl ? 'right' : 'left' : rtl ? 'left' : 'right'; // Floating UI mirrors start/end alignment itself for right-to-left elements.

  return align === 'center' ? physical : `${physical}-${align}`;
}
/** Maps a Floating UI placement back to the logical side. */

function logicalSide(placement, rtl = false) {
  const physical = String(placement).split('-')[0];
  if (physical === 'top') return 'block-start';
  if (physical === 'bottom') return 'block-end';
  if (physical === 'left') return rtl ? 'inline-end' : 'inline-start';
  return rtl ? 'inline-start' : 'inline-end';
}

/***/ },

/***/ "2e9112dbdda9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   anchor: () => (/* binding */ anchor),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   resolveLength: () => (/* binding */ resolveLength)
/* harmony export */ });
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6d338aa773af");
/* harmony import */ var _position_placement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("14baf2d02711");
// One anchored-positioning contract for Framework floating surfaces (dropdown
// lists, date panels, menus, tooltips). Geometry comes from Floating UI; this
// module adds logical placements, Framework token lengths and the author's
// size caps, so every component opens, flips and shifts the same way.



function isRtl(element) {
  return getComputedStyle(element).direction === 'rtl';
}
/** Resolves a number or CSS length (tokens included) to pixels in context. */


function resolveLength(value, context = document.body) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string' || value.trim() === '') return 0;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;block-size:0;padding:0;border:0';
  probe.style.inlineSize = value;
  (context?.isConnected ? context : document.body).append(probe);
  const pixels = parseFloat(getComputedStyle(probe).width) || 0;
  probe.remove();
  return pixels;
}
/**
 * Keeps `floating` anchored to `reference`.
 * options: {side, align, offset, alignmentOffset, padding, flip, shift,
 *           matchWidth, fitHeight, autoUpdate, onPosition({side, placement, x, y})}
 * Returns {update(): Promise, stop(), side}.
 */

function anchor(reference, floating, options = {}) {
  if (!(reference instanceof Element) || !(floating instanceof HTMLElement)) {
    throw new TypeError('Anchored positioning needs a reference element and a floating element');
  }

  const settings = {
    side: 'block-end',
    align: 'start',
    offset: 'var(--sf-space-1\\/4)',
    alignmentOffset: 0,
    padding: 'var(--sf-space-1\\/2)',
    flip: true,
    shift: true,
    matchWidth: false,
    fitHeight: true,
    autoUpdate: true,
    onPosition: null,
    ...options
  }; // Inline styles this helper writes are restored on stop(); the author's caps
  // are kept, so viewport fitting may only tighten them.

  const written = ['position', 'left', 'top', 'right', 'bottom', 'margin', 'max-height', 'max-width', ...(settings.matchWidth ? ['width'] : [])];
  const saved = written.map(name => [name, floating.style.getPropertyValue(name), floating.style.getPropertyPriority(name)]);
  const authored = {
    maxHeight: floating.style.getPropertyValue('max-height')
  }; // Stylesheet caps (max-height, max-width) are read before this helper writes
  // inline values, so fitting the viewport never loosens them.
  // A percentage cap is kept as written by getComputedStyle; read as pixels,
  // max-inline-size: 100% made every tooltip 100px wide. The panel is fixed, so
  // a percentage is of the viewport.

  const floatingStyle = getComputedStyle(floating);

  const cap = (value, whole) => {
    const number = parseFloat(value);
    if (!Number.isFinite(number)) return Infinity;
    return String(value).trim().endsWith('%') ? number / 100 * whole : number;
  };

  const heightCap = cap(floatingStyle.maxHeight, document.documentElement.clientHeight);
  const widthCap = cap(floatingStyle.maxWidth, document.documentElement.clientWidth);
  const controller = {
    side: settings.side,
    stopped: false
  };
  let running = null;
  let pending = false;

  const run = async () => {
    const rtl = isRtl(reference);
    const gap = resolveLength(settings.offset, reference.parentElement);
    const padding = resolveLength(settings.padding, reference.parentElement); // Measure the natural size so flipping compares the real panel height.

    if (settings.fitHeight) floating.style.maxHeight = authored.maxHeight || ''; // alignmentOffset moves a start/end-aligned panel along its edge (mirrored
    // for end), e.g. so a tail points at the middle of a small trigger.
    // The panel keeps its distance from the viewport's inline edges, but never
    // more than its field keeps. With a flat padding a field closer to the edge
    // than the padding -- every field in a documentation example, which starts
    // at the frame's edge -- had its panel pushed inward by the difference and
    // hanging past the field on the other side. The edge a field reaches is an
    // edge its own panel may reach too.

    const box = reference.getBoundingClientRect();
    const clientWidth = document.documentElement.clientWidth;
    const edges = {
      top: padding,
      bottom: padding,
      left: Math.min(padding, Math.max(0, box.left)),
      right: Math.min(padding, Math.max(0, clientWidth - box.right))
    };
    const middleware = [(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.offset)({
      mainAxis: gap,
      alignmentAxis: resolveLength(settings.alignmentOffset, reference.parentElement)
    })];
    if (settings.flip) middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.flip)({
      padding,
      crossAxis: false
    })); // Shift before size: a panel near the inline edge moves inside the viewport
    // instead of being squeezed to the space left of its field.

    if (settings.shift) middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.shift)({
      padding: edges,
      crossAxis: false
    }));
    middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.size)({
      padding: edges,

      apply({
        availableWidth,
        availableHeight,
        rects,
        elements
      }) {
        if (controller.stopped) return;
        const viewportWidth = clientWidth - edges.left - edges.right;
        if (settings.matchWidth) elements.floating.style.width = `${Math.max(0, Math.min(rects.reference.width, viewportWidth))}px`;
        elements.floating.style.maxWidth = `${Math.max(0, Math.min(availableWidth, viewportWidth, widthCap))}px`;
        if (settings.fitHeight) elements.floating.style.maxHeight = `${Math.max(0, Math.min(availableHeight, heightCap))}px`;
      }

    }));
    const result = await (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
      strategy: 'fixed',
      placement: (0,_position_placement_js__WEBPACK_IMPORTED_MODULE_1__.physicalPlacement)(settings.side, settings.align, rtl),
      middleware
    });
    if (controller.stopped) return result; // right/bottom are cleared so logical insets from the component stylesheet
    // (for example inset-inline-start in RTL) cannot over-constrain the box.

    Object.assign(floating.style, {
      position: 'fixed',
      left: `${result.x}px`,
      top: `${result.y}px`,
      right: 'auto',
      bottom: 'auto',
      margin: '0'
    });
    controller.side = (0,_position_placement_js__WEBPACK_IMPORTED_MODULE_1__.logicalSide)(result.placement, rtl);
    floating.dataset.sfSide = controller.side;
    settings.onPosition?.({
      side: controller.side,
      placement: result.placement,
      x: result.x,
      y: result.y
    });
    return result;
  }; // Coalesce bursts (scroll, resize, observers) into one computation at a time.


  controller.update = () => {
    if (controller.stopped) return Promise.resolve(null);

    if (running) {
      pending = true;
      return running;
    }

    running = run().finally(() => {
      running = null;

      if (pending && !controller.stopped) {
        pending = false;
        controller.update();
      }
    });
    return running;
  };

  const cleanup = settings.autoUpdate ? (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoUpdate)(reference, floating, controller.update) : null;

  controller.stop = () => {
    controller.stopped = true;
    cleanup?.();
    delete floating.dataset.sfSide;

    for (const [name, value, priority] of saved) {
      if (value) floating.style.setProperty(name, value, priority);else floating.style.removeProperty(name);
    }
  };

  if (!settings.autoUpdate) controller.update();
  return controller;
}
const Position = Object.freeze({
  anchor,
  logicalSide: _position_placement_js__WEBPACK_IMPORTED_MODULE_1__.logicalSide,
  physicalPlacement: _position_placement_js__WEBPACK_IMPORTED_MODULE_1__.physicalPlacement,
  resolveLength
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Position) globalThis.SF.Position = Position;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Position);

/***/ },

/***/ "51250bf01ab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPreferences: () => (/* binding */ createPreferences),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// SF.Preferences: what a person changes about how a thing looks -- column
// order, widths, sort, density, a menu's column widths -- kept one way for
// every component (owner, 2026-10-14; ui-control
// control/designs/2026-10-14-view-preferences.md).
//
// - A preference is a plain JSON value under a key `<component>/<instance>`,
//   e.g. `sf-table/cms.solutions`. No key, nothing is kept.
// - It is read synchronously, so a component applies it before its first
//   paint: the skeleton is already in the person's order.
// - The browser keeps a copy always (localStorage `sf-pref:<key>`), the cache
//   a first paint can read. A host that keeps preferences for its user
//   (Larena) plugs in with useHost(); its values win over the cache, and every
//   write goes to it as well, debounced per key.
// - A page can preload the host's values: preload({key: value}), or a
//   <script type="application/json" data-sf-preferences> (or id
//   "sf-preferences") in the page, read before the first value is.
//
// The registry lives on globalThis.SF: every bundle carries its own copy of
// this module, and two copies with two caches would disagree.
const PREFIX = 'sf-pref:';
const DELAY = 400;
const KEY = /^[\w.*:-]+(?:\/[\w.*:/-]+)?$/u;

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function validKey(key) {
  return typeof key === 'string' && key.length > 0 && key.length <= 200 && KEY.test(key);
}

function same(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function plain(value) {
  return value === null || value === undefined ? null : JSON.parse(JSON.stringify(value));
}

function createPreferences() {
  const host = {
    adapter: null,
    values: new Map()
  };
  const listeners = new Map();
  const timers = new Map(); // The page's own block of the host's values, read once, before the first
  // read: a component may connect before this module's start-up ran.

  let inlineRead = false;

  const readInline = () => {
    if (inlineRead) return;
    const node = globalThis.document?.querySelector?.('script[type="application/json"][data-sf-preferences], script#sf-preferences[type="application/json"]');
    if (!node) return;
    inlineRead = true;

    try {
      api.preload(JSON.parse(node.textContent || '{}'));
    } catch {
      /* not JSON: ignored */
    }
  };

  const notify = (key, value) => {
    for (const listener of listeners.get(key) ?? []) {
      try {
        listener(plain(value), key);
      } catch (error) {
        console.error('SF.Preferences listener failed', key, error);
      }
    }
  };

  const readCache = key => {
    const store = storage();
    if (!store) return null;

    try {
      const raw = store.getItem(PREFIX + key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeCache = (key, value) => {
    const store = storage();
    if (!store) return;

    try {
      if (value === null) store.removeItem(PREFIX + key);else store.setItem(PREFIX + key, JSON.stringify(value));
    } catch {// A full or refused storage keeps the value for this page only.
    }
  };

  const saveToHost = key => {
    clearTimeout(timers.get(key));
    timers.delete(key);
    const adapter = host.adapter;
    if (!adapter) return;
    const value = host.values.has(key) ? host.values.get(key) : readCache(key);

    try {
      const answer = value === null ? adapter.remove?.(key) : adapter.save?.(key, plain(value));
      Promise.resolve(answer).catch(error => console.warn('SF.Preferences: the host did not keep', key, error));
    } catch (error) {
      console.warn('SF.Preferences: the host did not keep', key, error);
    }
  };

  const schedule = key => {
    if (!host.adapter) return;
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(() => saveToHost(key), DELAY));
  };

  const api = {
    // The value for a key: the host's when it gave one, else this browser's.
    read(key) {
      if (!validKey(key)) return null;
      readInline();
      if (host.values.has(key)) return plain(host.values.get(key));
      return plain(readCache(key));
    },

    // Several keys from the most general to the most particular, merged field
    // by field: `sf-table/*` (the person's tables) under `sf-table/<instance>`.
    readMerged(...keys) {
      const merged = {};
      let found = false;

      for (const key of keys.flat()) {
        const value = api.read(key);

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(merged, value);
          found = true;
        }
      }

      return found ? merged : null;
    },

    write(key, value) {
      if (!validKey(key)) return false;
      const next = plain(value); // The value already kept is not written again: a component restoring
      // what the host gave it (sf-resizer's value) sent it back to the host on
      // every load (docs trial 5).

      if (JSON.stringify(api.read(key)) === JSON.stringify(next)) return true;
      if (host.values.has(key)) host.values.set(key, next);
      writeCache(key, next);
      schedule(key);
      return true;
    },

    // «Сбросить вид»: gone from both.
    remove(key) {
      if (!validKey(key)) return false;
      if (host.values.has(key)) host.values.set(key, null);
      writeCache(key, null);
      schedule(key);
      notify(key, null);
      return true;
    },

    subscribe(key, listener) {
      if (!validKey(key) || typeof listener !== 'function') return () => {};
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(listener);
      return () => listeners.get(key)?.delete(listener);
    },

    // The host's values for this person. Each that differs from this
    // browser's copy replaces it and is announced, so a component re-applies.
    preload(values) {
      if (!values || typeof values !== 'object') return;

      for (const [key, value] of Object.entries(values)) {
        if (!validKey(key)) continue;
        const next = plain(value);
        const before = api.read(key);
        host.values.set(key, next);
        writeCache(key, next);
        if (!same(before, next)) notify(key, next);
      }
    },

    // {save(key, value), remove(key), load?(keys) → Promise<{key: value}>}.
    useHost(adapter) {
      if (!adapter || typeof adapter.save !== 'function') throw new TypeError('A preferences host saves: {save(key, value)}');
      host.adapter = adapter;
      return api;
    },

    // Asks the host for keys it has not given yet (a component that appears
    // after the page loaded).
    async load(keys) {
      const wanted = [].concat(keys).filter(key => validKey(key) && !host.values.has(key));
      if (!wanted.length || typeof host.adapter?.load !== 'function') return;

      try {
        api.preload(await host.adapter.load(wanted));
      } catch (error) {
        console.warn('SF.Preferences: the host did not answer', wanted, error);
      }
    },

    get hosted() {
      return Boolean(host.adapter);
    },

    // Writes still waiting go now (a page that is leaving).
    flush() {
      for (const key of [...timers.keys()]) saveToHost(key);
    }

  }; // Another tab changed a preference.

  globalThis.addEventListener?.('storage', event => {
    if (!event.key?.startsWith(PREFIX) || event.storageArea !== storage()) return;
    const key = event.key.slice(PREFIX.length);
    if (host.values.has(key)) return;
    let value = null;

    try {
      value = event.newValue === null ? null : JSON.parse(event.newValue);
    } catch {
      value = null;
    }

    notify(key, value);
  });
  globalThis.addEventListener?.('pagehide', () => api.flush());
  readInline();
  return Object.freeze(api);
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Preferences) globalThis.SF.Preferences = createPreferences();
}

const Preferences = globalThis.SF?.Preferences;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Preferences);


/***/ },

/***/ "6c7f357fe960"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_PRELOADER: () => (/* binding */ DEFAULT_PRELOADER),
/* harmony export */   FIRST_PAINT_SELECTOR: () => (/* binding */ FIRST_PAINT_SELECTOR),
/* harmony export */   createPreloaderContent: () => (/* binding */ createPreloaderContent),
/* harmony export */   getPreloaderBackground: () => (/* binding */ getPreloaderBackground),
/* harmony export */   getPreloaderColor: () => (/* binding */ getPreloaderColor),
/* harmony export */   pageHasFirstPaint: () => (/* binding */ pageHasFirstPaint),
/* harmony export */   startPreloaderMotion: () => (/* binding */ startPreloaderMotion),
/* harmony export */   stopPreloaderMotion: () => (/* binding */ stopPreloaderMotion)
/* harmony export */ });
const DEFAULT_PRELOADER = Object.freeze({
  width: 31.68,
  height: 48,
  distance: 6,
  cycle: 1800,
  rotateAt: 1458,
  rotationStep: 90,
  transition: 300,
  easing: 'cubic-bezier(0.3, 1.85, 0.55, 1)'
});
const MOTION_HANDLE = '__sfPreloaderMotion'; // What the server printed is the first paint (standard simai.smart-component
// 1.3.8 §5.4): static markup of a Smart element (`data-sf-static`) or a core
// skeleton shape (`data-sf-skeleton`). A page that carries either is not
// covered by the boot preloader; a bare page, with nothing to show until the
// Loader is ready, still is.

const FIRST_PAINT_SELECTOR = '[data-sf-static], [data-sf-skeleton]';
function pageHasFirstPaint(doc = globalThis.document) {
  return Boolean(doc?.querySelector?.(FIRST_PAINT_SELECTOR));
}
function getPreloaderColor(root = document.documentElement) {
  const fallback = root?.classList?.contains('theme-dark') ? '#e3e2e7' : '#1a1b1f';
  return `var(--sf-on-surface, ${fallback})`;
}
function getPreloaderBackground(root = document.documentElement) {
  const fallback = root?.classList?.contains('theme-dark') ? '#0f1115' : '#ffffff';
  return `var(--sf-color--surface-highest, var(--sf-surface-0, ${fallback}))`;
}
function createPreloaderContent(preloader = {}) {
  const config = { ...DEFAULT_PRELOADER,
    ...preloader
  };
  return `<svg data-sf-preloader-mark id="sv_li_1" xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 66 100" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 50.0013L49.812 0L66 16.2495L32.3722 50.0051L65.9938 83.7543L49.8097 100L0 50.0013Z" fill="${config.color}"/>
</svg>
<svg data-sf-preloader-mark id="sv_li_2" xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 66 100" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M66 50.0013L16.188 0L0 16.2495L33.6278 50.0051L0.00615692 83.7543L16.1903 100L66 50.0013Z" fill="${config.color}"/>
</svg>`;
}
function stopPreloaderMotion(container) {
  container?.[MOTION_HANDLE]?.();
}
function startPreloaderMotion(container, isActive = () => true, options = {}) {
  if (!container) return () => {};
  stopPreloaderMotion(container);
  const config = { ...DEFAULT_PRELOADER,
    ...options
  };
  const marks = Array.from(container.querySelectorAll('[data-sf-preloader-mark]'));

  if (marks.length !== 2 || typeof marks[0].animate !== 'function') {
    return () => {};
  }

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    container.style.transition = 'none';
    container.style.transform = 'rotate(0deg)';
    marks.forEach(mark => {
      mark.style.transform = 'none';
    });

    const stop = () => {
      if (container[MOTION_HANDLE] === stop) {
        delete container[MOTION_HANDLE];
      }
    };

    container[MOTION_HANDLE] = stop;
    return stop;
  }

  container.style.transition = `${config.transition}ms transform ease-in-out`;
  let rotationAngle = 0;
  let rotationTimer = null;
  let stopped = false;
  const animations = marks.map((mark, index) => {
    const distance = index === 0 ? -config.distance : config.distance;
    return mark.animate([{
      transform: 'translateX(0)',
      offset: 0,
      easing: config.easing
    }, {
      transform: `translateX(${distance}px)`,
      offset: 0.36,
      easing: config.easing
    }, {
      transform: `translateX(${distance}px)`,
      offset: 0.48,
      easing: config.easing
    }, {
      transform: 'translateX(0)',
      offset: 0.84,
      easing: config.easing
    }, {
      transform: 'translateX(0)',
      offset: 1
    }], {
      duration: config.cycle,
      iterations: Number.POSITIVE_INFINITY
    });
  });

  const rotate = () => {
    if (stopped || !isActive()) return;
    rotationAngle += config.rotationStep;
    container.style.transform = `rotate(${rotationAngle}deg)`;
    rotationTimer = window.setTimeout(rotate, config.cycle);
  };

  rotationTimer = window.setTimeout(rotate, config.rotateAt);

  const stop = () => {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(rotationTimer);
    animations.forEach(animation => animation.cancel());
    container.style.transform = 'rotate(0deg)';
    marks.forEach(mark => {
      mark.style.transform = 'none';
    });

    if (container[MOTION_HANDLE] === stop) {
      delete container[MOTION_HANDLE];
    }
  };

  container[MOTION_HANDLE] = stop;
  return stop;
}

/***/ },

/***/ "3924cca3566b"
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* global __webpack_public_path__: writable */
(() => {
  const cdnDefault = 'https://cdn.jsdelivr.net/gh/simai/ui@main/distr/';
  if (typeof window === 'undefined') return; // The script that is running is Core itself: its URL names the distr/ it
  // came from. document.currentScript holds it while Core evaluates; failing
  // that (a module, a deferred evaluation), the last <script> whose path ends
  // in core/js/core.js or core/js/core.min.js stands in.

  const corePath = /\/core\/js\/core(?:\.min)?\.js$/u;

  const isCoreScript = script => {
    if (!script?.src) return false;

    try {
      return corePath.test(new URL(script.src, document.baseURI).pathname);
    } catch {
      return false;
    }
  };

  const findCoreScript = () => {
    if (typeof document === 'undefined') return null;
    if (isCoreScript(document.currentScript)) return document.currentScript;
    return Array.from(document.scripts || []).reverse().find(isCoreScript) || null;
  };

  const ownScript = findCoreScript(); // A page that never set sfPath loads the rest of the runtime from where Core
  // itself came from: an npm-loaded core.js finds its siblings in the same
  // package version, a self-hosted one in the same copy.

  if (!window.sfPath && ownScript) {
    try {
      window.sfPath = new URL('../../', new URL(ownScript.src, document.baseURI)).href;
    } catch {
      /* An unreadable script URL leaves the fallback below to speak. */
    }
  } // Without a Core script to read, the fallback is an unpinned branch: the
  // project then serves whatever sits on main today instead of the build it
  // shipped, and nothing on screen says so. The fallback stays — a page with no
  // configuration still has to run — but it says out loud what it just did and
  // what to write instead.


  if (!window.sfPath) {
    window.sfPath = cdnDefault;

    try {
      console.warn('SIMAI Framework: window.sfPath is not set and Core could not tell where ' + `it was loaded from, so the runtime is loading from ${cdnDefault} — an ` + 'unpinned branch that changes without notice. Set window.sfPath, before ' + 'core.js, to your own copy of distr/ or to a released package: ' + 'https://cdn.jsdelivr.net/npm/@simai-studio/ui@<version>/distr/ .');
    } catch {
      /* A console is not something a runtime may insist on. */
    }
  } // A relative sfPath is resolved against the document's base, not against the
  // window's location. Inside a srcdoc frame — which is how documentation
  // renders its live examples — location.href is `about:srcdoc`, an opaque base
  // that cannot resolve a relative reference at all, and the whole runtime used
  // to die here before a single component registered. document.baseURI is a
  // real absolute URL there, and it honours a <base> tag, which is what a
  // relative path is supposed to follow anyway.


  const documentBase = typeof document === 'undefined' ? '' : document.baseURI;

  const resolveRoot = base => {
    try {
      return new URL(window.sfPath, base || undefined);
    } catch {
      return null;
    }
  };

  const frameworkRoot = resolveRoot(documentBase) || resolveRoot(window.location?.href) || new URL(cdnDefault);

  if (!frameworkRoot.pathname.endsWith('/')) {
    frameworkRoot.pathname += '/';
  }

  const configuredCoreRoot = frameworkRoot.pathname.endsWith('/core/') ? frameworkRoot : new URL('core/', frameworkRoot);
  const coreScript = ownScript;
  const coreRoot = coreScript ? new URL('../', new URL(coreScript.src, document.baseURI)) : configuredCoreRoot;

  if (__webpack_require__.p !== coreRoot.href) {
    __webpack_require__.p = coreRoot.href;
  }
})();

/***/ },

/***/ "5effd0d9c238"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   installReady: () => (/* binding */ installReady)
/* harmony export */ });
// SF.ready: the Loader's readiness, for a script that runs after core.js
// (simai/ui-source#16).
//
// SF.Loader, SF.loadSmartBase and the other Loader names arrive with the
// Loader, which core.js imports as a chunk of its own: they are on window.SF
// at the window event sf-loader-init, not when core.js has run. A script that
// waited for that event itself waited for ever when it ran after the event
// had been sent. SF.ready is on window.SF as soon as core.js has run:
//
//   await SF.ready;                 // settles with window.SF at sf-loader-init
//   SF.ready.then((SF) => ...);     // the same, already settled once it was sent
//   SF.ready(fn);                   // fn() once the Loader is up and the
//                                   // document has been parsed (the old
//                                   // callback form, kept)
//
// A script that runs before core.js queues a function instead:
//   (window.SF_ON_READY ||= []).push((SF) => ...);
//
// Every bundle carries its own copy of this module (core, the core-system
// chunk, the sf-system component, a second core.js on the page): the first one
// to run puts SF.ready on the shared global, marked, and each later copy finds
// the mark and keeps it. The property has a setter that ignores what it is
// given, so an older bundle that still assigns SF.ready = ready cannot replace
// it either.
const MARK = Symbol.for('simai.sf.ready');
function installReady(win = typeof window !== 'undefined' ? window : undefined) {
  if (!win) return undefined;
  win.SF = win.SF || {};
  const SF = win.SF;
  if (SF.ready && SF.ready[MARK]) return SF.ready;
  const doc = win.document;
  let settled = false;
  let resolveLoader;
  const loaderReady = new Promise(resolve => {
    resolveLoader = resolve;
  });

  const settle = () => {
    if (settled) return;
    settled = true;
    resolveLoader(win.SF);
  };

  const parsed = () => !doc || doc.readyState !== 'loading';

  let waiting = [];

  const flush = () => {
    if (!settled || !parsed() || !waiting.length) return;
    const run = waiting;
    waiting = [];
    run.forEach(handler => handler());
  };

  function ready(handler) {
    if (typeof handler !== 'function') return; // Synchronously when both have happened, as the callback form always ran.

    if (settled && parsed()) {
      handler();
      return;
    }

    waiting.push(handler);
  }

  Object.defineProperty(ready, MARK, {
    value: true
  });

  ready.then = (onResolved, onRejected) => loaderReady.then(onResolved, onRejected);

  ready.catch = onRejected => loaderReady.catch(onRejected);

  ready.finally = onFinally => loaderReady.finally(onFinally);

  win.addEventListener('sf-loader-init', () => {
    settle();
    flush();
  }, {
    once: true
  });
  doc?.addEventListener('readystatechange', flush); // Installed after the Loader started (a bundle that did not find the mark,
  // say): the event has been sent, so the names are the evidence.

  if (SF.Loader && typeof SF.loadSmartBase === 'function') settle();
  Object.defineProperty(SF, 'ready', {
    configurable: false,
    enumerable: true,
    get: () => ready,
    set: () => {}
  }); // Functions a script queued before core.js ran; later pushes chain at once.

  const queued = Array.isArray(win.SF_ON_READY) ? win.SF_ON_READY : [];

  const take = fn => {
    if (typeof fn === 'function') ready.then(fn);
  };

  win.SF_ON_READY = {
    push: (...fns) => {
      fns.forEach(take);
      return 0;
    }
  };
  queued.forEach(take);
  return ready;
}

/***/ },

/***/ "9edc14a11fec"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disable: () => (/* binding */ disable),
/* harmony export */   enable: () => (/* binding */ enable),
/* harmony export */   navigate: () => (/* binding */ navigate)
/* harmony export */ });
// Region navigation (simai.interface-fragment 1.0.0, region-navigation and
// full-load-fallback; Larena handoff 2026-10-15). A link inside the shell
// changes one region of the page instead of the page: the shell (a menu, a
// profile) stays, and only the content is asked for, swapped and announced.
//
// The product names its own contract when it turns this on; nothing here is a
// product's name:
//
//   SF.RegionNavigation.enable({
//     region: 'content',                       // the region asked for
//     root: '#larena-admin-content',           // where it stands on the page
//     header: 'X-Larena-Region',               // the request header that asks for it
//     revisionMeta: 'larena-shell-revision',   // <meta name> holding the shell's revision
//     scope: '/admin',                         // only addresses under this path
//   });
//
// The answer the host gives is JSON: {region, html, title, assets: [{key,
// href, kind: 'css' | 'javascript'}], shell_revision, url}. Anything else --
// another status, a redirect, HTML, another region, a shell revision that is
// not the page's own, a failure -- and the page is loaded in full instead. A
// half-swapped page is never left on screen.
//
// What is kept true: Back and Forward work and bring the scroll back; focus
// goes to the new heading; an asset already on the page is not asked for
// again, whether it came in `assets` or as a <link>/<script src> in the html;
// the elements that leave are disconnected, so their routes and listeners go
// with them.
const SKELETON_DELAY_MS = 150;
const TIMEOUT_MS = 15000;
let config = null;
let controller = null;
let sequence = 0;
const assetRequests = new Map();

const absolute = href => {
  try {
    return new URL(href, globalThis.location.href).href;
  } catch {
    return null;
  }
};

function rootElement() {
  if (!config) return null;
  return typeof config.root === 'string' ? globalThis.document.querySelector(config.root) : config.root;
}

function shellRevision() {
  return globalThis.document.querySelector(`meta[name="${config.revisionMeta}"]`)?.getAttribute('content') ?? null;
} // A link this navigator may take: a plain left click on an address of this
// site, under the scope, not a download, not another window, not a jump on
// the same page, and not marked for a full load.


function takenLink(event) {
  if (!config || event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const link = event.composedPath().find(node => node instanceof globalThis.Element && node.matches('a[href]'));
  if (!link) return null;
  if (link.closest('[data-full-load]') || link.hasAttribute('download')) return null;
  const target = link.getAttribute('target');
  if (target && target !== '_self') return null;
  const url = new URL(link.href, globalThis.location.href);
  const here = new URL(globalThis.location.href);
  if (url.origin !== here.origin) return null;
  if (!url.pathname.startsWith(config.scope)) return null;
  if (url.hash && url.pathname === here.pathname && url.search === here.search) return null;
  return url.href;
}

function onClick(event) {
  const url = takenLink(event);
  if (!url) return;
  event.preventDefault();
  navigate(url);
}

function onPopState(event) {
  const state = event.state;
  if (!config || !state?.sfRegion) return;
  navigate(globalThis.location.href, {
    history: 'none',
    scroll: state.scroll ?? 0
  });
} // The scroll of the entry being left, so Back brings it back.


function rememberScroll() {
  const state = globalThis.history.state ?? {};
  globalThis.history.replaceState({ ...state,
    sfRegion: true,
    scroll: globalThis.scrollY
  }, '');
}

function fullLoad(url, reason) {
  globalThis.document.dispatchEvent(new CustomEvent('sf-region-fallback', {
    detail: {
      url,
      reason
    }
  }));

  if (config?.onFullLoad) {
    config.onFullLoad(url, reason);
    return;
  }

  if (url === globalThis.location.href) globalThis.location.reload();else globalThis.location.assign(url);
}

function isPresent(url, kind) {
  const document = globalThis.document;
  const nodes = kind === 'css' ? document.querySelectorAll('link[rel~="stylesheet"][href]') : document.querySelectorAll('script[src]');
  return [...nodes].some(node => absolute(node.getAttribute(kind === 'css' ? 'href' : 'src')) === url);
} // One request per asset for the life of the page: a second region that needs
// the same file waits on the first request, it does not make another.


function loadAsset({
  href,
  kind,
  key
}) {
  const url = absolute(href);
  if (!url || !['css', 'javascript'].includes(kind)) return Promise.resolve();
  if (assetRequests.has(url)) return assetRequests.get(url);

  if (isPresent(url, kind)) {
    assetRequests.set(url, Promise.resolve());
    return assetRequests.get(url);
  }

  const document = globalThis.document;
  const node = document.createElement(kind === 'css' ? 'link' : 'script');

  if (kind === 'css') {
    node.rel = 'stylesheet';
    node.href = url;
  } else {
    node.src = url;
    node.async = false;
  }

  if (key) node.setAttribute('data-sf-asset', key);
  const loaded = new Promise(resolve => {
    node.addEventListener('load', () => resolve(), {
      once: true
    }); // A file that does not come is the region's loss, not the page's: the
    // region is shown, and the component that needed it reports its own state.

    node.addEventListener('error', () => resolve(), {
      once: true
    });
  });
  document.head.append(node);
  assetRequests.set(url, loaded);
  return loaded;
} // The region's html, parsed but not yet placed: its stylesheets and scripts
// are taken out and loaded as assets (a script set by innerHTML never runs).


function parseRegion(html) {
  const template = globalThis.document.createElement('template');
  template.innerHTML = String(html ?? '');
  const assets = [];

  for (const link of template.content.querySelectorAll('link[rel~="stylesheet"][href]')) {
    assets.push({
      href: link.getAttribute('href'),
      kind: 'css'
    });
    link.remove();
  }

  for (const script of template.content.querySelectorAll('script')) {
    if (script.getAttribute('src')) assets.push({
      href: script.getAttribute('src'),
      kind: 'javascript'
    });
    script.remove();
  }

  return {
    content: template.content,
    assets
  };
}

function validAnswer(answer, revision) {
  return answer && typeof answer === 'object' && answer.region === config.region && typeof answer.html === 'string' && typeof answer.shell_revision === 'string' && answer.shell_revision === revision && (answer.assets === undefined || Array.isArray(answer.assets));
}

async function navigate(url, {
  history = 'push',
  scroll = 0
} = {}) {
  if (!config) {
    globalThis.location.assign(url);
    return false;
  }

  const root = rootElement();
  const revision = shellRevision();

  if (!root || !revision) {
    fullLoad(url, 'no-region');
    return false;
  }

  const allowed = globalThis.document.dispatchEvent(new CustomEvent('sf-region-navigate', {
    cancelable: true,
    detail: {
      url,
      region: config.region
    }
  }));
  if (!allowed) return false;
  controller?.abort();
  controller = new AbortController();
  const mine = ++sequence;
  const skeleton = setTimeout(() => {
    if (mine !== sequence) return;
    root.setAttribute('aria-busy', 'true');
    root.setAttribute('data-sf-region-loading', '');
  }, SKELETON_DELAY_MS);
  const timeout = setTimeout(() => controller?.abort(), TIMEOUT_MS);
  let answer;

  try {
    const response = await globalThis.fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        [config.header]: config.region,
        Accept: 'application/json'
      },
      signal: controller.signal
    });

    if (response.redirected || response.status !== 200 || !/application\/json/u.test(response.headers.get('content-type') ?? '')) {
      throw new Error(`region answer ${response.status}${response.redirected ? ' redirected' : ''}`);
    }

    answer = await response.json();
    if (!validAnswer(answer, revision)) throw new Error(answer?.shell_revision !== revision ? 'shell-revision' : 'region-answer');
  } catch (error) {
    clearTimeout(skeleton);
    clearTimeout(timeout);
    if (mine !== sequence) return false;
    root.removeAttribute('aria-busy');
    root.removeAttribute('data-sf-region-loading');

    if (error?.name === 'AbortError' && controller?.signal.aborted && mine === sequence) {
      fullLoad(url, 'timeout');
      return false;
    }

    fullLoad(url, String(error?.message ?? error));
    return false;
  }

  clearTimeout(timeout);
  if (mine !== sequence) return false;
  const address = typeof answer.url === 'string' && absolute(answer.url)?.startsWith(globalThis.location.origin) ? absolute(answer.url) : url;
  const parsed = parseRegion(answer.html);
  const assets = [...(answer.assets ?? []), ...parsed.assets]; // Stylesheets before the swap, so the new content never shows unstyled;
  // scripts after, so the elements they define upgrade in place.

  await Promise.all(assets.filter(asset => asset.kind === 'css').map(loadAsset));
  if (mine !== sequence) return false;

  if (history === 'push') {
    rememberScroll();
    globalThis.history.pushState({
      sfRegion: true,
      scroll: 0
    }, '', address);
  } else if (history === 'replace') {
    globalThis.history.replaceState({
      sfRegion: true,
      scroll: 0
    }, '', address);
  }

  const swap = () => {
    clearTimeout(skeleton); // Replacing the children disconnects the elements that leave: each one
    // releases its routes, listeners and timers in its own disconnect.

    root.replaceChildren(parsed.content);
    root.removeAttribute('aria-busy');
    root.removeAttribute('data-sf-region-loading');
    if (typeof answer.title === 'string' && answer.title) globalThis.document.title = answer.title;
  };

  const transition = typeof globalThis.document.startViewTransition === 'function' && !globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? globalThis.document.startViewTransition(swap) : null;
  if (transition) await transition.updateCallbackDone.catch(() => {});else swap();

  for (const asset of assets.filter(entry => entry.kind === 'javascript')) await loadAsset(asset);

  globalThis.scrollTo(0, history === 'none' ? scroll : 0);
  const heading = root.querySelector('h1');

  if (heading) {
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({
      preventScroll: true
    });
  }

  globalThis.document.dispatchEvent(new CustomEvent('sf-region-load', {
    detail: {
      url: address,
      region: config.region,
      title: globalThis.document.title
    }
  }));
  return true;
}
function enable(options = {}) {
  const next = {
    region: options.region ?? 'content',
    root: options.root,
    header: options.header,
    revisionMeta: options.revisionMeta,
    scope: options.scope ?? '/',
    onFullLoad: typeof options.onFullLoad === 'function' ? options.onFullLoad : null
  };
  if (!next.root || !next.header || !next.revisionMeta) throw new TypeError('region navigation needs root, header and revisionMeta');
  if (config) disable();
  config = next;
  globalThis.document.addEventListener('click', onClick);
  globalThis.addEventListener('popstate', onPopState);
  if ('scrollRestoration' in globalThis.history) globalThis.history.scrollRestoration = 'manual'; // The entry the page opened on takes part in Back like any other.

  const state = globalThis.history.state ?? {};
  globalThis.history.replaceState({ ...state,
    sfRegion: true,
    scroll: state.scroll ?? globalThis.scrollY
  }, '');
  return true;
}
function disable() {
  if (!config) return;
  globalThis.document.removeEventListener('click', onClick);
  globalThis.removeEventListener('popstate', onPopState);
  controller?.abort();
  config = null;
}

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.RegionNavigation = Object.freeze({
    enable,
    disable,
    navigate,

    get enabled() {
      return Boolean(config);
    }

  });
}

/***/ },

/***/ "987c832cfe13"
() {

window.SF = window.SF || {};
SF.RuleLoader = {};

/***/ },

/***/ "6d5e21314f8e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "b4b2e395e4eb"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("56345afd9e11");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  if (alignment) {
    coords[alignmentAxis] += commonAlign * (alignment === 'end' ? 1 : -1) * (rtl && isVertical ? -1 : 1);
  }
  return coords;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) && (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

// Maximum number of resets that can occur before bailing to avoid infinite reset loops.
const MAX_RESET_COUNT = 50;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const platformWithDetectOverflow = platform.detectOverflow ? platform : {
    ...platform,
    detectOverflow
  };
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData[name] = {
      ...middlewareData[name],
      ...data
    };
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(minPadding, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects,
        platform
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);

      // No rects (e.g. a hidden or detached reference, or a collapsed range) —
      // keep the existing reference rect rather than resetting to an invalid
      // one with non-finite values.
      if (!nativeClientRects.length) {
        return {};
      }
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && (clientRects[0].left > clientRects[1].right || clientRects[1].left > clientRects[0].right) && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
              x: left,
              y: top,
              width: right - left,
              height: bottom - top
            });
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
            x: minLeft,
            y: top,
            width: maxRight - minLeft,
            height: bottom - top
          });
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const clampCoord = (axis, coord) => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(coord + overflow[axis === 'y' ? 'top' : 'left'], coord, coord - overflow[axis === 'y' ? 'bottom' : 'right']);
      if (checkMainAxis) {
        mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
      }
      if (checkCrossAxis) {
        crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      var _rawOffset$mainAxis, _rawOffset$crossAxis;
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
        crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

// Method syntax keeps callback parameters bivariant, but expressing the
// explicit `| undefined` required by `exactOptionalPropertyTypes` needs
// property syntax, which is contravariant under `strictFunctionTypes`.
// Extracting the function from a method position restores that bivariance so
// consumers can still assign callbacks with narrower parameter types.

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const shiftData = state.middlewareData.shift;
      const noShift = !shiftData;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (shiftData != null && shiftData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if (shiftData != null && shiftData.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        if (isYAxis) {
          availableWidth = width - 2 * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right);
        } else {
          availableHeight = height - 2 * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom);
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ },

/***/ "6d338aa773af"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* empty/unused harmony star reexport */
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b4b2e395e4eb");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("56345afd9e11");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d7f28916ed76");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(width) !== offsetWidth || (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  return !!floatingOffsetParent && isFixed && floatingOffsetParent === (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement && offsetParent) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(domElement);
    const offsetWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    while (currentIFrame && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return element.getClientRects ? Array.from(element.getClientRects()) : [];
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(html) {
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(html);
  const body = html.ownerDocument.body;
  const width = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(html);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
  if (rootBoundary === void 0) {
    rootBoundary = 'viewport';
  }
  const isLayoutViewport = rootBoundary === 'layoutViewport';
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    // Client coordinates are relative to the layout viewport, except in
    // WebKit with an `absolute` strategy, where they are relative to the
    // visual viewport.
    const layoutRelativeClientCoords = !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || strategy === 'fixed';
    if (isLayoutViewport) {
      if (!layoutRelativeClientCoords) {
        x = -visualViewport.offsetLeft;
        y = -visualViewport.offsetTop;
      }
    } else {
      width = visualViewport.width;
      height = visualViewport.height;
      if (layoutRelativeClientCoords) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  // `scrollbar-gutter: stable` on the <html> reserves gutter space that shrinks
  // the visual width but isn't reflected in `html.clientWidth`, so subtract it.
  // Only the inline-end (right) gutter can hold the scrollbar; `both-edges` also
  // reserves an empty inline-start gutter that clips nothing, so exclude just
  // the one scrollbar-side gutter — halve the measured (two-gutter) total. A
  // left-side scrollbar (`windowScrollbarX > 0`) is already handled by
  // `getHTMLOffset`/`visualViewport.width`; skip it here.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    const gutter = getComputedStyle(html).scrollbarGutter === 'stable both-edges' ? reservedWidth / 2 : reservedWidth;
    if (gutter <= SCROLLBAR_MAX) {
      width -= gutter;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = getScale(element);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport' || clippingAncestor === 'layoutViewport') {
    rect = getViewportRect(element, strategy, clippingAncestor);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)(rect);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(el) !== 'body');
  let lastKeptComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(currentNode);
    // Position of the containing block chain below the current node. A fixed
    // element whose containing block hasn't been found yet is a fixed chain.
    const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? 'fixed' : '';

    // A non-containing ancestor does not clip the element when the chain
    // below it escapes it: a fixed chain escapes all ancestors up to the
    // next containing block, an absolute chain escapes static ancestors.
    const shouldDropCurrentNode = !currentNodeIsContaining && (lastPosition === 'fixed' || lastPosition === 'absolute' && computedStyle.position === 'static');
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // The kept node carries the chain position for the next iteration.
      lastKeptComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.top, top);
    right = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.right, right);
    bottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.bottom, bottom);
    left = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  if (isOffsetParentAnElement || !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  if (!isOffsetParentAnElement && documentElement) {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove, ancestorResize) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(top);
    const insetRight = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(0, (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;

      // The entry is a snapshot, so the reference may have moved since the
      // intersection was computed (under performance constraints, or between
      // consecutive frames of a multi-frame layout shift). The reported ratio
      // and the observed area are stale in that case and cannot be trusted to
      // detect subsequent movement, so refresh regardless of the ratio.
      if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        return refresh();
      }
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped in place, the ratio is 0. Throttle
          // the refresh to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  // The window is a resize ancestor, so when `ancestorResize` is enabled its
  // listener already runs the update on resize. Here we only need to rebuild
  // the `IntersectionObserver` for the new root size, skipping a redundant
  // update. When `ancestorResize` is disabled, this becomes the sole update.
  const handleResize = () => refresh(ancestorResize);
  win.addEventListener('resize', handleResize);
  refresh(true);
  return () => {
    win.removeEventListener('resize', handleResize);
    cleanup();
  };
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(referenceEl) : []), ...(floating ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(floating) : [])] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update);
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    if (floating) {
      resizeObserver.observe(floating);
    }
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = options != null ? options : {};
  const platformWithCache = {
    ...platform,
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ },

/***/ "d7f28916ed76"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== 'inline' && display !== 'contents';
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(':popover-open')) {
      return true;
    }
  } catch (_e) {
    // no-op
  }
  try {
    return element.matches(':modal');
  } catch (_e) {
    return false;
  }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = value => !!value && value !== 'none';
let isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || '') || containRe.test(css.contain || '');
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none');
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return (node.ownerDocument || node).body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ },

/***/ "56345afd9e11"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === 't' || firstChar === 'b' ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes('start') ? placement.replace('start', 'end') : placement.replace('end', 'start');
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  var _padding$top, _padding$right, _padding$bottom, _padding$left;
  return {
    top: (_padding$top = padding.top) != null ? _padding$top : 0,
    right: (_padding$right = padding.right) != null ? _padding$right : 0,
    bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
    left: (_padding$left = padding.left) != null ? _padding$left : 0
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




/***/ },

/***/ "b60c1434b0be"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssemblyCore: () => (/* binding */ AssemblyCore),
/* harmony export */   activity: () => (/* binding */ activity),
/* harmony export */   headlessView: () => (/* binding */ headlessView),
/* harmony export */   whenIdle: () => (/* binding */ whenIdle)
/* harmony export */ });
/* harmony import */ var _definition_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9ee717a9c619");
/* harmony import */ var _link_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("dfdb640e668b");
/* harmony import */ var _journal_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6d4272a67a74");
/* harmony import */ var _logic_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("eb7fe3498c26");
/* harmony import */ var _words_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("ff707ab72ad6");
/* harmony import */ var _values_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("8cf8ac8cb59d");
// The bus of one assembly instance (standard simai.smart-component 1.3.8 §7,
// §9, §10): keys with one writer, derived keys, parts in roles and their
// bindings, rules and turns. It knows nothing of the DOM: what it needs of the
// page — a part's element, a layout, the address — it asks of its view
// (host.mjs on a page; a plain object in tests and in Node).
//
// A part joins through a link (link.mjs): set a setting, read a value, ask an
// action, hand a port, start, dispose. The part answers through its context:
// report its values, emit its events, say its words. A nested assembly is a
// part like any other: its frame is its parent's context.








const ACTIVITY = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfAssemblyActivity';
  if (!root[key]) root[key] = {turns: 0, waiting: 0, timers: 0, seq: 0, idle: new Set()};
  return root[key];
})();

/** What the buses of the page are doing: turns running, steps waiting, debounce timers pending. */
const activity = () => ({turns: ACTIVITY.turns, waiting: ACTIVITY.waiting, timers: ACTIVITY.timers});

const settleIdle = () => {
  if (ACTIVITY.turns || ACTIVITY.waiting || ACTIVITY.timers) return;
  for (const resolve of [...ACTIVITY.idle]) resolve(true);
  ACTIVITY.idle.clear();
};
const count = (field, by) => {
  ACTIVITY[field] += by;
  if (by < 0) settleIdle();
};

/** A promise that settles when no bus has a turn, a wait or a timer (tests, probes, the Studio). */
function whenIdle() {
  if (!ACTIVITY.turns && !ACTIVITY.waiting && !ACTIVITY.timers) return Promise.resolve(true);
  return new Promise((resolve) => ACTIVITY.idle.add(resolve));
}

const thenable = (value) => value !== null && typeof value === 'object' && typeof value.then === 'function';
const then = (value, next) => (thenable(value) ? value.then(next) : next(value));
const STREAM_FACTS = new Set(['begun', 'chunk', 'completed', 'failed', 'cancelled']);
const STREAM_ENDS = new Set(['completed', 'failed', 'cancelled']);

/** A controller aborted with any of the given signals, and on its own. */
function linked(...signals) {
  const controller = new globalThis.AbortController();
  const parents = signals.filter(Boolean);
  for (const parent of parents) if (parent.aborted) { controller.abort(parent.reason); return {controller, signal: controller.signal}; }
  if (typeof globalThis.AbortSignal.any === 'function') return {controller, signal: globalThis.AbortSignal.any([controller.signal, ...parents])};
  const abort = (event) => controller.abort(event?.target?.reason);
  for (const parent of parents) parent.addEventListener('abort', abort, {once: true, signal: controller.signal});
  return {controller, signal: controller.signal};
}

/** An answer, raced against an abort (cancelled) and a timeout (unavailable, reason timeout) (§10.3, §10.7). */
function race(promise, signal, timeout, onLate) {
  return new Promise((resolve) => {
    let done = false;
    let timer = null;
    const finish = (outcome) => {
      if (done) return;
      done = true;
      if (timer) globalThis.clearTimeout(timer);
      signal.removeEventListener('abort', aborted);
      resolve(outcome);
    };
    const aborted = () => finish({answer: 'cancelled', reason: String(signal.reason?.message ?? signal.reason ?? 'aborted')});
    if (signal.aborted) { aborted(); return; }
    signal.addEventListener('abort', aborted, {once: true});
    if (timeout > 0) timer = globalThis.setTimeout(() => finish({answer: 'unavailable', reason: 'timeout', message: ''}), timeout);
    Promise.resolve(promise).then(
      (value) => { if (done) onLate?.((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.outcomeOf)(value)); else finish((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.outcomeOf)(value)); },
      (error) => { if (done) onLate?.({answer: 'refused', reason: 'error'}); else finish({answer: 'refused', reason: 'error', message: String(error?.message ?? error)}); },
    );
  });
}

const sleep = (ms, signal) => new Promise((resolve) => {
  if (signal.aborted) { resolve(false); return; }
  const timer = globalThis.setTimeout(() => { signal.removeEventListener('abort', stop); resolve(true); }, ms);
  const stop = () => { globalThis.clearTimeout(timer); resolve(false); };
  signal.addEventListener('abort', stop, {once: true});
});

/**
 * A view that has no page (Node, tests, a worker): a leaf's link comes from
 * `createLink(rec, context)`; a nested assembly whose definition is in
 * `definitions` runs as a headless bus of its own.
 */
function headlessView({createLink = null, definitions = null, locale = 'en'} = {}) {
  const view = {
    interfaceOf: (tag) => _definition_mjs__WEBPACK_IMPORTED_MODULE_0__.interfaces.of(tag),
    isAssembly: (tag) => Boolean(definitions?.has(tag)),
    roleFlags: () => [],
    locale: () => locale,
    createPart(rec, context) {
      const child = definitions?.get(rec.def.tag);
      if (!child) return createLink?.(rec, context) ?? null;
      const core = new AssemblyCore(child, {
        instanceId: rec.instanceId, signal: context.signal, view: headlessView({createLink, definitions, locale}),
        frame: {report: (values) => context.report(values), emit: (verb, detail, options) => context.emit(verb, detail, options)},
      });
      rec.child = core;
      return (0,_link_mjs__WEBPACK_IMPORTED_MODULE_1__.assemblyLink)(core);
    },
  };
  return view;
}

class AssemblyCore {
  /**
   * @param definition compiled manifest (definition.mjs)
   * @param options.instanceId  the instance's role path (§7.1.1)
   * @param options.frame       what is outside: `report(values, {origin})`, `emit(verb, detail, {chain})`
   * @param options.view        the page side (host.mjs) or headlessView()
   * @param options.signal      the scope of the parent, if any (§7.7)
   * @param options.settings    the first values of the settings (writer parent)
   */
  constructor(definition, options = {}) {
    this.def = definition;
    this.id = options.instanceId ?? `page/${definition.tag}`;
    this.frame = options.frame ?? {report() {}, emit() {}};
    this.view = options.view ?? headlessView({createLink: options.createLink, definitions: options.definitions});
    this.chainLimit = options.chainLimit ?? _values_mjs__WEBPACK_IMPORTED_MODULE_5__.CAUSE_CHAIN_DEPTH;
    this.scope = linked(options.signal);
    this.keys = Object.create(null);
    this.out = Object.create(null);
    this.roles = new Map(); // role → {role, parts: Map(entry id | '' → rec), flags: [...]}
    this.ports = new Map();
    this.runs = new Map(); // rule id → {active: Set(run), tail}
    this.calls = new Map(); // outside action → {active: Set, tail}
    this.turns = 0;
    this.waiting = 0;
    this.running = false;
    this.disposed = false;
    this.initialSettings = options.settings ?? {};
  }

  // ---------- the journal and errors ----------
  log(kind, text, data, level) { return (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_2__.record)(this.id, kind, text, data, level); }
  error(kind, text, data = {}) {
    (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_2__.record)(this.id, kind, text, data, 'error');
    this.view.error?.(kind, text, data);
  }

  // ---------- start (§7, §7.2.1) ----------
  start() {
    if (this.running || this.disposed) return this;
    this.running = true;
    for (const problem of this.def.problems) this.error('definition', `${problem.section}: ${problem.text}`, problem);
    for (const note of this.def.notes ?? []) this.log('warn', `${note.section}: ${note.text}`, note, 'warn');
    for (const [name, def] of this.def.keys) {
      if (def.writer === 'logic') this.keys[name] = this.def.initial(name);
      else if (def.writer === 'parent') {
        const given = this.initialSettings[name];
        const value = given !== undefined ? given : (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.clone)(this.def.manifest.settings?.[name]?.default ?? null);
        this.keys[name] = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fits)(def, value) ? value : null;
        if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fits)(def, value)) this.error('type', `setting "${name}" (${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def)}) refused ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(value)}`);
      } else this.keys[name] = null;
    }
    this.view.build?.(this);
    for (const [name, value] of this.view.restore?.(this.def.persisted) ?? []) {
      if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fits)(this.def.keys.get(name), value)) this.keys[name] = value;
    }
    for (const [name, role] of this.def.roles) {
      this.roles.set(name, {role, parts: new Map(), flags: [role.if, ...(this.view.roleFlags?.(name) ?? [])].filter(Boolean)});
    }
    this.computeDerived(null);
    this.computeAggregates();
    this.log('start', `${this.def.tag} starts as ${this.id}`, {tag: this.def.tag});
    for (const [name, state] of this.roles) {
      if (state.role.each) this.syncEach(name);
      else this.placePart(state, null);
    }
    this.syncShown(null);
    this.computeAggregates();
    const first = {};
    for (const [name, key] of this.def.values) {
      this.out[name] = this.keys[key];
      if (this.keys[key] !== null) first[name] = this.keys[key];
    }
    if (Object.keys(first).length) this.frame.report(first, {origin: 'start'});
    this.view.started?.(this);
    return this;
  }

  // ---------- parts (§7.2) ----------
  placePart(state, entry) {
    const {role} = state;
    const entryId = entry ? String(entry.id) : '';
    const instanceId = `${this.id}/${role.name}${entry ? `[${entryId}]` : ''}`;
    const iface = this.view.interfaceOf?.(role.tag) ?? null;
    const refusal = (0,_definition_mjs__WEBPACK_IMPORTED_MODULE_0__.checkRole)(this.def, role, iface);
    if (refusal) {
      this.error('refused', `role "${role.name}" refuses its part: ${refusal.text}`, {role: role.name, reason: refusal.reason});
      this.view.refuse?.(role.name, refusal.reason, refusal.text);
      return null;
    }
    const scope = linked(this.scope.signal);
    const rec = {
      role: role.name, def: role, entry, entryId, instanceId, iface, scope, link: null,
      started: false, closed: false, passed: new Map(), pending: new Map(), timers: new Map(),
      calls: new Map(), causes: [], streams: new Map(), isAssembly: Boolean(this.view.isAssembly?.(role.tag)),
    };
    const core = this;
    rec.context = {
      get instanceId() { return rec.instanceId; },
      role: role.name,
      get entry() { return rec.entry; },
      signal: scope.signal,
      iface,
      get started() { return rec.started; },
      report: (values, options) => core.reportFromPart(rec, values, options),
      emit: (verb, detail, options) => core.emitFromPart(rec, verb, detail, options),
      word: (path, n) => core.word(rec, path, n),
      journal: (kind, text, data, level) => (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_2__.record)(rec.instanceId, kind, text, data, level),
      id: (local) => `${rec.instanceId.replace(/\W+/g, '-')}--${local}`,
    };
    rec.link = this.view.createPart(rec, rec.context);
    if (!rec.link) {
      this.error('part', `role "${role.name}": part ${role.tag} could not be placed`, {role: role.name});
      scope.controller.abort('not placed');
      return null;
    }
    state.parts.set(entryId, rec);
    if (entry) this.log('entry', `${role.name}[${entryId}] placed`, {role: role.name, entry: entryId});
    if (role.start === 'now') this.startPart(rec, 'now');
    else this.view.awaitStart?.(rec, role.start);
    return rec;
  }

  /** The assembly starts a part, never the part itself (§7.2.1). */
  startPart(rec, why = 'now') {
    if (rec.started || this.disposed || rec.scope.signal.aborted) return;
    rec.started = true;
    (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_2__.record)(rec.instanceId, 'start', `${rec.instanceId} starts${why !== 'now' ? ` (${why})` : ''}`, {role: rec.role, mode: rec.def.start, why});
    this.view.startPart?.(rec);
    rec.pending.clear(); // superseded: the part reads the current values now
    this.pushAll(rec);
    for (const port of this.ports.values()) if (rec.isAssembly || rec.iface.port?.id === port.id) rec.link.connectPort?.(port);
    rec.link.start?.();
  }

  /** Everything a part reads: its constants, its words, its entry and its keys. */
  pushAll(rec) {
    const {def: role} = rec;
    for (const [name, value] of Object.entries(role.constants)) this.pushSetting(rec, name, this.withListWords(rec, name, value));
    for (const [name, value] of this.wordSettings(rec)) this.pushSetting(rec, name, value);
    for (const binding of role.entryBinds) this.pushSetting(rec, binding.member, rec.entry?.[binding.entryField] ?? null);
    for (const binding of role.binds) {
      if (this.keys[binding.key] === null) continue; // unset is not passed to a new part
      this.pushSetting(rec, binding.member, this.keys[binding.key]);
    }
  }

  /** The constant word settings of a role from the language file: `roles.<role>.settings.<setting>` (§7.2, §11). */
  wordSettings(rec) {
    const out = [];
    const locale = this.view.locale?.(rec) ?? 'en';
    const settings = this.def.words.find(locale, `roles.${rec.role}.settings`).word;
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(settings)) return out;
    for (const [name, word] of Object.entries(settings)) {
      if (!(name in rec.iface.settings)) continue; // a word the part does not take: the part asks it by word()
      if (typeof word === 'string') out.push([name, word]);
    }
    return out;
  }

  /** The words of a constant list's entries: `roles.<role>.items.<value>`, `roles.<role>.columns.<key>` (§11.3). */
  withListWords(rec, name, value) {
    if (!Array.isArray(value) || !value.some(_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)) return value;
    const locale = this.view.locale?.(rec) ?? 'en';
    const field = rec.iface.settings[name]?.of?.text !== undefined && rec.iface.settings[name]?.of?.label === undefined ? 'text' : 'label';
    const columns = name === 'columns';
    return value.map((entry) => {
      if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(entry) || entry[field] !== undefined) return entry;
      const id = columns ? entry.key : (entry.value ?? entry.id);
      if (id === undefined) return entry;
      const word = this.def.words.text(locale, `roles.${rec.role}.${columns ? 'columns' : 'items'}.${id}`);
      return word === null ? entry : {...entry, [field]: word};
    });
  }

  /** The language changed: constant words are given again (§11.1). */
  relanguage() {
    for (const state of this.roles.values()) for (const rec of state.parts.values()) {
      if (!rec.started) continue;
      for (const [name, value] of Object.entries(rec.def.constants)) this.pushSetting(rec, name, this.withListWords(rec, name, value));
      for (const [name, value] of this.wordSettings(rec)) this.pushSetting(rec, name, value);
    }
  }

  /** A setting carried to a part (§7.2): checked, debounced, deferred, and never passed twice. */
  pushSetting(rec, member, value, debounce = 0) {
    if (rec.scope.signal.aborted) return;
    if (debounce > 0) {
      if (rec.timers.has(member)) { globalThis.clearTimeout(rec.timers.get(member)); count('timers', -1); }
      count('timers', 1);
      rec.timers.set(member, globalThis.setTimeout(() => {
        rec.timers.delete(member);
        count('timers', -1);
        this.pushSetting(rec, member, value, 0);
      }, debounce));
      return;
    }
    const def = rec.iface.settings[member] ?? rec.iface.values[member];
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fits)(def, value)) { this.error('type', `${rec.instanceId}: setting "${member}" (${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def)}) refused ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(value)}`, {role: rec.role}); return; }
    if (!rec.started || rec.closed) { // §7.2.1: not started yet, or its container is closed: one read when it opens
      if (rec.started && (!rec.passed.has(member) || !(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.same)(rec.passed.get(member), value))) {
        rec.pending.set(member, value);
        this.view.busy?.(rec, true);
      } else if (!rec.started) rec.pending.set(member, value);
      else rec.pending.delete(member);
      return;
    }
    if (rec.passed.has(member) && (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.same)(rec.passed.get(member), value)) return;
    rec.passed.set(member, value);
    rec.link.set(member, value);
    return true;
  }

  /** A started part's container closed or opened again (§7.2.1): reads wait until it opens. */
  setClosed(rec, closed) {
    if (rec.closed === closed) return;
    rec.closed = closed;
    if (closed || !rec.started) {
      if (closed) this.log('defer', `${rec.instanceId}: its container closed; the reads its bindings cause wait`, {role: rec.role});
      return;
    }
    const pending = [...rec.pending];
    rec.pending.clear();
    if (pending.length) this.log('defer', `${rec.instanceId}: its container opened; one read with ${pending.map(([name]) => name).join(', ')}`, {role: rec.role});
    for (const [member, value] of pending) this.pushSetting(rec, member, value);
    this.view.busy?.(rec, false);
  }

  /** Keys read back from where they persist (the address after Back, §7.5): one turn of writes. */
  restore(values) {
    const turn = this.newTurn('persist', {}, {fromAddress: true});
    for (const [name, value] of values) {
      const def = this.def.keys.get(name);
      if (def && (def.writer === 'logic' || def.writer === 'parent')) turn.writes.set(name, {value, writer: def.writer});
    }
    this.log('turn', `turn ${turn.n} · the address changed: ${[...turn.writes.keys()].join(', ') || 'nothing'}`, {turn: turn.n, on: 'persist'});
    return this.endTurn(turn);
  }

  partsOf(name) { return [...(this.roles.get(name)?.parts.values() ?? [])]; }

  /** A key read as a flag, `<key>` or `!<key>` (§7.2.2). */
  flag(name) {
    const negate = name.startsWith('!');
    const value = this.keys[name.slice(negate ? 1 : 0)] === true;
    return negate ? !value : value;
  }
  present(name) {
    const state = this.roles.get(name);
    return !state || state.flags.every((flag) => this.flag(flag));
  }
  hidden(name) {
    const hidden = this.roles.get(name)?.role.hidden;
    return typeof hidden === 'string' ? this.flag(hidden) : false;
  }

  /** `if` and `hidden` of every role reading a changed key (§7.2.2). */
  syncShown(changed) {
    for (const [name, state] of this.roles) {
      const flags = [...state.flags, state.role.hidden].filter(Boolean).map((flag) => flag.replace(/^!/, ''));
      if (!flags.length || (changed && !flags.some((key) => changed.has(key)))) continue;
      const present = this.present(name);
      const hidden = this.hidden(name);
      if (state.shownAs && state.shownAs.present === present && state.shownAs.hidden === hidden) continue;
      if (state.shownAs) this.log('shown', `${name} ${!present ? 'leaves the DOM, the form value and the validity' : hidden ? 'is hidden, its controls disabled' : 'is shown'}`, {role: name, present, hidden});
      state.shownAs = {present, hidden};
      this.view.show?.(name, present, hidden);
    }
  }

  /** A role per entry: one part per entry, kept by id, in entry order (§7.2.3). */
  syncEach(name) {
    const state = this.roles.get(name);
    const list = Array.isArray(this.keys[state.role.each]) ? this.keys[state.role.each] : [];
    const seen = new Set();
    const ordered = [];
    for (const entry of list) {
      if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(entry) || entry.id === undefined || entry.id === null) { this.error('each', `an entry of ${state.role.each} has no id`, {role: name}); continue; }
      const id = String(entry.id);
      if (seen.has(id)) { this.error('each', `two entries of ${state.role.each} have the id ${id}`, {role: name}); continue; }
      seen.add(id);
      let rec = state.parts.get(id);
      if (!rec) rec = this.placePart(state, entry);
      else if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.same)(rec.entry, entry)) {
        rec.entry = entry;
        for (const binding of rec.def.entryBinds) this.pushSetting(rec, binding.member, entry[binding.entryField] ?? null);
      }
      if (rec) ordered.push(rec);
    }
    for (const [id, rec] of state.parts) if (!seen.has(id)) {
      state.parts.delete(id);
      this.disposePart(rec);
      this.log('entry', `${name}[${id}] removed; its scope ends`, {role: name, entry: id});
    }
    this.view.order?.(name, ordered);
  }

  disposePart(rec) {
    for (const [id, state] of rec.streams) if (state === 'open') this.log('stream', `${rec.instanceId}: stream ${id} ends cancelled with its scope`, {role: rec.role});
    for (const timer of rec.timers.values()) { globalThis.clearTimeout(timer); count('timers', -1); }
    rec.timers.clear();
    rec.scope.controller.abort('removed');
    try { rec.link.dispose?.(); } catch (error) { this.error('part', `${rec.instanceId}: dispose failed: ${error?.message ?? error}`); }
    this.view.removePart?.(rec);
  }

  // ---------- derived keys and aggregates (§7.1.2, §17.4) ----------
  computeDerived(dirty) {
    const changed = [];
    if (!this.def.derived.length) return changed;
    const reader = (0,_logic_mjs__WEBPACK_IMPORTED_MODULE_3__.createReader)({key: (name) => this.keys[name], from: {}, fail: (text) => this.error('reading', text)});
    const due = dirty ? new Set() : null;
    if (dirty) for (const key of dirty) for (const name of this.def.dependents.get(key) ?? []) due.add(name);
    for (const name of this.def.derived) {
      if (due && !due.has(name)) continue;
      const def = this.def.keys.get(name);
      const value = reader.read(def.from) ?? null;
      if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fits)(def, value)) { this.error('type', `derived "${name}" (${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def)}) computed ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(value)}`); continue; }
      if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.same)(this.keys[name], value)) continue;
      changed.push([name, this.keys[name]]);
      this.keys[name] = value;
      if (due) for (const next of this.def.dependents.get(name) ?? []) due.add(next);
    }
    return changed;
  }

  computeAggregates() {
    const changed = [];
    if (!this.def.aggregates.length) return changed;
    const value = {};
    let valid = true;
    for (const [name, state] of this.roles) {
      if (!this.present(name) || this.hidden(name)) continue;
      for (const rec of state.parts.values()) {
        const values = rec.iface.values;
        if (!('value' in values) && !('checked' in values)) continue; // not a form control
        if (rec.link.valid?.() === false) valid = false;
        value[rec.entry ? `${name}[${rec.entryId}]` : name] = rec.link.get?.('value' in values ? 'value' : 'checked') ?? null;
      }
    }
    for (const [name, which] of this.def.aggregates) {
      const next = which === 'valid' ? valid : value;
      if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.same)(this.keys[name], next)) continue;
      changed.push([name, this.keys[name]]);
      this.keys[name] = next;
    }
    return changed;
  }

  // ---------- turns (§10) ----------
  newTurn(on, payload, options = {}) {
    const parent = options.signal ?? this.scope.signal;
    return {
      n: ++ACTIVITY.seq, on, payload: payload ?? {}, chain: options.chain ?? [], entry: options.entry ?? null,
      source: options.source ?? null, writes: new Map((options.preset ?? []).map(([key, value, writer]) => [key, {value, writer}])),
      after: [], refused: null, outcome: null, cancel: options.cancel ?? null, origin: options.origin ?? null, parentSignal: parent, ownScope: null,
      get scope() { return this.ownScope ?? (this.ownScope = linked(this.parentSignal)); },
      fromAddress: Boolean(options.fromAddress),
    };
  }

  /**
   * One turn: one event and every rule hearing it, in list order; the writes
   * apply together at its end (§10.1, §10.2). Runs synchronously until the
   * first step that waits, so a `refuse` reaches a cancelable request in time.
   */
  fire(on, payload = {}, options = {}) {
    if (this.disposed) return Promise.resolve(null);
    const turn = this.newTurn(on, payload, options);
    const rules = this.def.byTrigger.get(on) ?? [];
    this.log('turn', `turn ${turn.n} · ${on}${Object.keys(turn.payload).length ? ` ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(turn.payload)}` : ''}${rules.length ? '' : ' — no rules'}`, {turn: turn.n, on, chain: turn.chain.length});
    if (turn.chain.length >= this.chainLimit) {
      this.error('cut', `the cause chain is cut at depth ${this.chainLimit} in ${this.id} (§10.5)`, {turn: turn.n, chain: turn.chain});
      return Promise.resolve(turn);
    }
    const [head] = (0,_definition_mjs__WEBPACK_IMPORTED_MODULE_0__.splitTrigger)(on);
    if (rules.length && this.roles.has(head) && !this.present(head)) {
      this.log('skip', `${head} is out under if; its rules do not run`, {turn: turn.n});
      return this.endTurn(turn);
    }
    if (this.waiting > 0) this.log('overlap', `turn ${turn.n} starts while ${this.waiting} step(s) of this bus wait`, {turn: turn.n});
    this.turns += 1;
    count('turns', 1);
    let result;
    try {
      result = this.runRules(turn, rules, 0);
    } catch (error) {
      this.error('turn', `turn ${turn.n} failed: ${error?.message ?? error}`);
    }
    const finish = () => {
      this.turns -= 1;
      count('turns', -1);
      return this.endTurn(turn);
    };
    return thenable(result)
      ? result.catch((error) => this.error('turn', `turn ${turn.n} failed: ${error?.message ?? error}`)).then(finish)
      : finish();
  }

  endTurn(turn) {
    this.commit(turn);
    turn.ownScope?.controller.abort('turn ended');
    const after = turn.after.splice(0);
    let chain = null;
    for (const next of after) chain = chain ? chain.then(next) : then(null, next);
    return Promise.resolve(chain).then(() => turn, (error) => { this.error('turn', `after turn ${turn.n}: ${error?.message ?? error}`); return turn; });
  }

  runRules(turn, rules, index) {
    for (let i = index; i < rules.length; i += 1) {
      const result = this.runRule(turn, rules[i]);
      if (thenable(result)) return result.then(() => this.runRules(turn, rules, i + 1));
    }
    return null;
  }

  readerFor(turn, run) {
    return (0,_logic_mjs__WEBPACK_IMPORTED_MODULE_3__.createReader)({
      key: (name) => (turn.writes.has(name) ? turn.writes.get(name).value : this.keys[name]),
      from: turn.payload,
      entry: turn.entry,
      get outcome() { return run?.inOtherwise ? run.outcome : null; },
      fail: (text) => this.error('reading', `${run?.rule.id ?? 'rule'}: ${text}`, {turn: turn.n}),
    });
  }

  runRule(turn, rule) {
    const tag = `${this.id}:${rule.id}`;
    if (turn.chain.includes(tag)) { this.error('cut', `${rule.id} already ran for this cause (a loop, §10.5)`, {turn: turn.n, rule: rule.id}); return null; }
    if (turn.chain.length + 1 > this.chainLimit) { this.error('cut', `the cause chain is cut at depth ${this.chainLimit} at ${tag} (§10.5)`, {turn: turn.n, rule: rule.id}); return null; }
    if (rule.if && !this.readerFor(turn, null).test(rule.if)) { this.log('skip', `${rule.id}: if does not hold`, {turn: turn.n, rule: rule.id}); return null; }
    const policy = rule.concurrency ?? 'parallel';
    let state = this.runs.get(rule.id);
    if (!state) { state = {active: new Set(), tail: null}; this.runs.set(rule.id, state); }
    if (state.active.size) {
      if (policy === 'drop') {
        this.log('concurrency', `${rule.id}: dropped while a run waits (drop)`, {turn: turn.n, rule: rule.id, policy});
        if (!turn.refused) { turn.refused = 'busy'; turn.cancel?.('busy'); }
        return null;
      }
      if (policy === 'latest') {
        this.log('concurrency', `${rule.id}: replaces the run that waits (latest); its step answers cancelled`, {turn: turn.n, rule: rule.id, policy});
        for (const earlier of state.active) earlier.scope.controller.abort('latest');
      }
      if (policy === 'queue') this.log('concurrency', `${rule.id}: queued behind the run that waits (queue)`, {turn: turn.n, rule: rule.id, policy});
      if (policy === 'parallel') this.log('concurrency', `${rule.id}: runs beside the run that waits (parallel)`, {turn: turn.n, rule: rule.id, policy});
    }
    const run = {rule, cause: [...turn.chain, tag], scope: linked(turn.scope.signal), waited: false, outcome: null, inOtherwise: false};
    run.read = this.readerFor(turn, run);
    const go = () => {
      this.log('rule', `${rule.id} runs`, {turn: turn.n, rule: rule.id, tag: this.def.tag});
      let result;
      try {
        result = this.runSteps(run, turn, rule.steps ?? [], 0);
      } catch (error) {
        this.error('rule', `${rule.id} failed: ${error?.message ?? error}`, {rule: rule.id});
        result = 'stop';
      }
      return then(result, (ended) => {
        if (run.outcome && !turn.outcome) turn.outcome = run.outcome; // the rule ended without applied: its outcome
        if (ended !== 'fail' || !Array.isArray(rule.otherwise)) return ended;
        run.inOtherwise = true;
        this.log('otherwise', `${rule.id}: otherwise runs (${run.outcome?.answer})`, {turn: turn.n, rule: rule.id, tag: this.def.tag});
        return this.runSteps(run, turn, rule.otherwise, 0);
      });
    };
    const settle = () => { state.active.delete(run); run.scope.controller.abort('run ended'); };
    let result;
    if (state.active.size && policy === 'queue') {
      const before = state.tail;
      result = Promise.resolve(before).then(go);
    } else {
      result = go();
    }
    state.active.add(run);
    if (!thenable(result)) { settle(); return null; }
    const tail = result.catch((error) => this.error('rule', `${rule.id} failed: ${error?.message ?? error}`)).then(settle);
    state.tail = tail;
    return tail;
  }

  runSteps(run, turn, steps, index) {
    for (let i = index; i < steps.length; i += 1) {
      const step = steps[i];
      const result = this.step(run, turn, step);
      if (thenable(result)) {
        return result.then((answer) => {
          this.log('stepped', run.rule.id, {rule: run.rule.id, tag: this.def.tag, step: stepKind(step), otherwise: run.inOtherwise});
          return answer === 'go' ? this.runSteps(run, turn, steps, i + 1) : answer;
        });
      }
      this.log('stepped', run.rule.id, {rule: run.rule.id, tag: this.def.tag, step: stepKind(step), otherwise: run.inOtherwise});
      if (result !== 'go') return result;
    }
    return 'go';
  }

  /** One step: 'go' on, 'stop' (a check failed, cancelled, an error) or 'fail' (otherwise runs) (§9, §10.3). */
  step(run, turn, step) {
    const {rule} = run;
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(step)) { this.error('step', `${rule.id}: ${JSON.stringify(step)} is not a step`); return 'stop'; }
    const read = run.read.read;
    if ('set' in step) return this.writeLogic(turn, step.set, read(step.to), rule, run.cause);
    if ('add' in step) return this.addLogic(turn, step.add, Number(read(step.by) ?? 0), rule, run.cause);
    if ('reset' in step) return this.writeLogic(turn, step.reset, this.def.initial(step.reset), rule, run.cause);
    if ('append' in step) {
      const list = read({key: step.append});
      const item = read(step.item);
      if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(item) || item.id === undefined || item.id === null) { this.error('append', `${rule.id}: the appended entry has no id`); return 'stop'; }
      return this.writeLogic(turn, step.append, [...(Array.isArray(list) ? list : []), item], rule, run.cause);
    }
    if ('remove' in step) {
      const list = read({key: step.remove});
      const id = read(step.id);
      return this.writeLogic(turn, step.remove, (Array.isArray(list) ? list : []).filter((one) => String(one?.id) !== String(id)), rule, run.cause);
    }
    if ('emit' in step) return this.emitStep(run, turn, step);
    if ('check' in step) {
      if (run.read.test(step.check)) return 'go';
      this.log('check', `${rule.id}: a check does not hold; the rule ends`, {turn: turn.n, rule: rule.id});
      return 'stop';
    }
    if ('refuse' in step) {
      if (run.waited) { this.error('refuse', `${rule.id}: refuse after a wait reaches no request (§9)`, {rule: rule.id}); return 'stop'; }
      const reason = read(step.refuse?.reason ?? {value: ''});
      turn.refused = reason ?? '';
      this.log('refuse', `${rule.id} refuses: ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(turn.refused)}`, {turn: turn.n, rule: rule.id});
      turn.cancel?.(turn.refused);
      return 'go';
    }
    if ('do' in step || 'ask' in step) return this.callStep(run, turn, step);
    this.error('step', `${rule.id}: ${JSON.stringify(step)} is not a step (gate 5)`);
    return 'stop';
  }

  argsOf(run, step) {
    const args = {};
    for (const [name, reading] of (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.own)(step.with)) args[name] = run.read.read(reading);
    return args;
  }

  writeLogic(turn, key, value, rule, cause = null) {
    const def = this.def.keys.get(key);
    if (!def) { this.error('write', `${rule.id} writes the undeclared key "${key}"`, {rule: rule.id}); return 'stop'; }
    if (def.writer !== 'logic') { this.error('write', `${rule.id} writes "${key}", whose writer is ${def.writer}`, {rule: rule.id}); return 'stop'; }
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fits)(def, value)) { this.error('type', `${rule.id}: "${key}" (${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def)}) refused ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(value)}`, {rule: rule.id}); return 'stop'; }
    turn.writes.set(key, {value, writer: 'logic', cause});
    return 'go';
  }

  /**
   * `add` (§9) applies against the key's value at apply time, not at the time
   * the step ran: two runs of a rule under `parallel` that both add are never
   * lost to each other (dispatcher decision 2026-10-27). Within one turn an
   * add on top of a value the turn already wrote adds to that value.
   */
  addLogic(turn, key, by, rule, cause = null) {
    const def = this.def.keys.get(key);
    if (!def) { this.error('write', `${rule.id} writes the undeclared key "${key}"`, {rule: rule.id}); return 'stop'; }
    if (def.writer !== 'logic') { this.error('write', `${rule.id} writes "${key}", whose writer is ${def.writer}`, {rule: rule.id}); return 'stop'; }
    if (!Number.isFinite(by)) { this.error('type', `${rule.id}: add ${key} by ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(by)}, not a number`, {rule: rule.id}); return 'stop'; }
    const written = turn.writes.get(key);
    if (written && written.add === undefined) return this.writeLogic(turn, key, Number(written.value ?? 0) + by, rule, cause);
    const add = (written?.add ?? 0) + by;
    const keys = this.keys;
    turn.writes.set(key, {add, writer: 'logic', cause, get value() { return Number(keys[key] ?? 0) + this.add; }});
    return 'go';
  }

  emitStep(run, turn, step) {
    const {rule} = run;
    const event = this.def.manifest.events?.[step.emit];
    if (!event) { this.error('emit', `${rule.id} emits "${step.emit}", not an event of ${this.def.tag}`, {rule: rule.id}); return 'stop'; }
    const args = this.argsOf(run, step);
    if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(event.carries)) for (const field of Object.keys(event.carries)) if (!(field in args)) this.error('emit', `${rule.id}: ${step.emit} does not carry "${field}"`, {rule: rule.id});
    const cause = run.cause;
    turn.after.push(() => {
      this.log('cross', `⇡ event ${step.emit} goes out of ${this.id}`, {emit: step.emit});
      return this.frame.emit(step.emit, args, {chain: cause});
    });
    return 'go';
  }

  /** The part of a role a step asks: a role per entry is asked through the entry that sent the event (§7.2.3). */
  partFor(name, turn) {
    const state = this.roles.get(name);
    if (!state) return {problem: `"${name}" is not a role`};
    if (!state.role.each) return {rec: state.parts.get('') ?? null};
    const [head] = (0,_definition_mjs__WEBPACK_IMPORTED_MODULE_0__.splitTrigger)(turn.on);
    if (head === name && turn.source) return {rec: turn.source};
    return {problem: `"${name}" is a role per entry; only an event of one of its parts says which entry to ask`};
  }

  callStep(run, turn, step) {
    const {rule} = run;
    const asking = 'ask' in step;
    const target = String(asking ? step.ask : step.do);
    const dot = target.indexOf('.');
    const roleName = target.slice(0, dot);
    const action = target.slice(dot + 1);
    const found = this.partFor(roleName, turn);
    if (found.problem) { this.error('do', `${rule.id}: ${found.problem}`, {rule: rule.id}); return 'stop'; }
    const rec = found.rec;
    const fail = (answer, reason) => {
      run.outcome = {answer, reason, message: ''};
      this.log('answer', `${target} → ${answer} (${reason})`, {turn: turn.n, rule: rule.id, answer, reason});
      return 'fail';
    };
    if (!rec) return fail('unavailable', 'part-refused');
    if (!this.present(roleName)) return fail('unavailable', 'not-present');
    const def = rec.iface.actions[action] ?? (_values_mjs__WEBPACK_IMPORTED_MODULE_5__.BASE_ACTIONS.has(action) ? {} : null);
    if (!def) { this.error('do', `${rule.id}: ${rec.def.tag} has no action "${action}"`, {rule: rule.id}); return fail('refused', 'no-action'); }
    const args = this.argsOf(run, step);
    const timeout = Number(def.timeout ?? rule.timeout) || 0;
    const retry = def.retry ?? rule.retry ?? null;
    const waits = asking || rec.isAssembly || Boolean(def.waits) || _values_mjs__WEBPACK_IMPORTED_MODULE_5__.WRITE_VERBS.has(action) || Boolean(rec.iface.port) || Boolean(def.concurrency) || timeout > 0;
    if (waits && turn.writes.size) { // §10.2: a waiting step first applies the writes made so far
      this.log('step', `${rule.id}: applies the turn's writes before it waits`, {turn: turn.n, rule: rule.id});
      this.commit(turn);
    }
    if (rec.iface.port && action !== 'connect-port' && !this.ports.has(rec.iface.port.id)) return fail('unavailable', 'port-not-connected');
    if (!rec.started) { // a step asks a part that has not started: it starts first, then is asked (dispatcher decision 2026-10-27)
      this.log('start', `${rule.id}: ${target} asks a part that has not started; it starts first`, {rule: rule.id, role: rec.role});
      this.startPart(rec, 'asked');
    }
    if (waits) run.waited = true;
    this.log('step', `${rule.id}: ${asking ? 'ask' : 'do'} ${target} ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(args)}`, {turn: turn.n, rule: rule.id});
    const answer = this.invoke(rec, action, args, {run, def, timeout, retry});
    return then(answer, (outcome) => this.settle(run, turn, step, target, outcome));
  }

  settle(run, turn, step, target, outcome) {
    const {rule} = run;
    if (outcome.answer === 'cancelled') {
      run.outcome = {answer: 'cancelled', reason: outcome.reason ?? '', message: outcome.message ?? ''};
      this.log('answer', `${target} → cancelled: an act, not a failure; no otherwise (§10.3)`, {turn: turn.n, rule: rule.id, answer: 'cancelled'});
      return 'stop';
    }
    if (outcome.answer !== 'applied') {
      run.outcome = {answer: outcome.answer, reason: outcome.reason ?? '', message: outcome.message ?? ''};
      this.log('answer', `${target} → ${outcome.answer}${outcome.reason ? ` (${outcome.reason})` : ''}${outcome.message ? `: ${outcome.message}` : ''}`, {turn: turn.n, rule: rule.id, answer: outcome.answer, reason: outcome.reason ?? ''});
      return 'fail';
    }
    if ('ask' in step) {
      if (!step.answer) return 'go';
      return this.writeLogic(turn, step.answer, outcome.value ?? null, rule, run.cause);
    }
    return 'go';
  }

  /** Ask a part's action under its policy: concurrency, timeout, retry (§10.7). */
  invoke(rec, action, args, {run, def, timeout, retry}) {
    const policy = def.concurrency ?? 'parallel';
    let state = rec.calls.get(action);
    if (!state) { state = {active: new Set(), tail: null}; rec.calls.set(action, state); }
    if (state.active.size) {
      if (policy === 'drop') { this.log('concurrency', `${rec.instanceId}.${action}: dropped while a call waits (drop)`, {role: rec.role}); return {answer: 'refused', reason: 'busy', message: ''}; }
      if (policy === 'latest') {
        this.log('concurrency', `${rec.instanceId}.${action}: replaces the call that waits (latest)`, {role: rec.role});
        for (const earlier of state.active) earlier.controller.abort('latest');
      }
    }
    const call = linked(run.scope.signal, rec.scope.signal);
    state.active.add(call);
    const write = _values_mjs__WEBPACK_IMPORTED_MODULE_5__.WRITE_VERBS.has(action);
    const attempt = (left) => then(this.callOnce(rec, action, args, call.signal, timeout, run.cause), (outcome) => {
      const repeatable = outcome.answer === 'unavailable' && left > 0 && (!write || args['client-key'] !== undefined);
      if (!repeatable) return outcome;
      this.log('retry', `${rec.instanceId}.${action}: unavailable; tries again (${left} left)`, {role: rec.role});
      count('waiting', 1);
      return sleep(Number(retry?.delay) || 0, call.signal).then((slept) => {
        count('waiting', -1);
        return slept ? attempt(left - 1) : {answer: 'cancelled', reason: 'aborted'};
      });
    });
    const go = () => attempt(Number(retry?.times) || 0);
    const done = (outcome) => { state.active.delete(call); call.controller.abort('call ended'); return outcome; };
    const result = state.active.size > 1 && policy === 'queue' ? Promise.resolve(state.tail).then(go) : go();
    if (!thenable(result)) return done(result);
    const tail = result.then(done, (error) => done({answer: 'refused', reason: 'error', message: String(error?.message ?? error)}));
    state.tail = tail;
    return tail;
  }

  callOnce(rec, action, args, signal, timeout, chain) {
    rec.causes.push(chain);
    const release = () => { const at = rec.causes.lastIndexOf(chain); if (at >= 0) rec.causes.splice(at, 1); };
    let raw;
    try {
      raw = rec.link.act(action, args, {signal, chain});
    } catch (error) {
      release();
      this.error('action', `${rec.instanceId}.${action} threw: ${error?.message ?? error}`, {role: rec.role});
      return {answer: 'refused', reason: 'error', message: String(error?.message ?? error)};
    }
    if (!thenable(raw)) { release(); return (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.outcomeOf)(raw); }
    this.waiting += 1;
    count('waiting', 1);
    return race(raw, signal, timeout, (late) => this.log('late', `${rec.instanceId}.${action}: a late answer ${late.answer} is dropped`, {role: rec.role})).then((outcome) => {
      release();
      this.waiting -= 1;
      count('waiting', -1);
      return outcome;
    });
  }

  // ---------- what parts say (§7.2, §8, §10.6, §10.8) ----------
  /** A part's values changed: written by its role, one turn of writes (§7.1). */
  reportFromPart(rec, values, options = {}) {
    if (this.disposed || rec.scope.signal.aborted || !(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(values)) return;
    const turn = this.newTurn(`${rec.role}.values`, {}, {origin: options.origin ?? null});
    const first = options.origin === 'start';
    for (const [name, given] of Object.entries(values)) {
      if (!(name in rec.iface.values)) { this.error('value', `${rec.instanceId}: ${rec.def.tag} has no value "${name}"`, {role: rec.role}); continue; }
      // A part's first value with no declared default reaches its key as null, not "" (dispatcher decision 2026-10-27).
      const value = first && given === '' && rec.iface.values[name]?.default === undefined ? null : given;
      const key = rec.def.valueBinds.get(name);
      if (key) turn.writes.set(key, {value, writer: rec.role});
    }
    if (!turn.writes.size && !this.def.aggregates.length) return;
    this.endTurn(turn);
  }

  /** A part's event: a turn of this bus; it stops at the frame (§7.4). */
  emitFromPart(rec, verb, detail = {}, options = {}) {
    if (this.disposed || rec.scope.signal.aborted) return Promise.resolve({refused: null});
    const event = rec.iface.events[verb];
    if (!event) { this.error('event', `${rec.instanceId}: ${rec.def.tag} has no event "${verb}"`, {role: rec.role}); return Promise.resolve({refused: null}); }
    if (!rec.started) { this.log('skip', `${rec.instanceId} has not started; its event ${verb} is not queued (§7.2.1)`, {role: rec.role}); return Promise.resolve({refused: null}); }
    const payload = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(detail) ? detail : {};
    if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(event.carries)) for (const field of Object.keys(event.carries)) if (!(field in payload)) this.error('event', `${rec.instanceId}: ${verb} does not carry "${field}"`, {role: rec.role});
    if (STREAM_FACTS.has(verb) && payload.id !== undefined) this.watchStream(rec, verb, String(payload.id));
    const chain = options.chain ?? rec.causes.at(-1) ?? []; // an answer carries the chain of the turn that asked (§10.6)
    return this.fire(`${rec.role}.${verb}`, payload, {chain, entry: rec.entry, source: rec, cancel: options.cancel ?? null})
      .then((turn) => ({refused: turn?.refused ?? null}));
  }

  /** The lifecycle of a stream: begun, chunks, exactly one end (§10.8). */
  watchStream(rec, fact, id) {
    const now = rec.streams.get(id);
    if (fact === 'begun') {
      if (now === 'open') this.error('stream', `${rec.instanceId}: stream ${id} began twice`, {role: rec.role});
      rec.streams.set(id, 'open');
      return;
    }
    if (now !== 'open') { this.error('stream', `${rec.instanceId}: ${fact} of stream ${id}, which ${now ? 'has ended' : 'never began'}`, {role: rec.role}); return; }
    if (STREAM_ENDS.has(fact)) rec.streams.set(id, 'ended');
    if (rec.streams.size > 256) for (const [key, state] of rec.streams) { if (state === 'ended') rec.streams.delete(key); if (rec.streams.size <= 128) break; }
  }

  /** A word of the assembly's language file for a part (§11.2). */
  word(rec, path, n) {
    const locale = this.view.locale?.(rec) ?? 'en';
    const full = `roles.${rec.role}.${path}`;
    const found = this.def.words.find(locale, full);
    if (found.word === null) { this.log('warn', `no word ${full} in the language files of ${this.def.tag}`, {role: rec.role}, 'warn'); return null; }
    if (found.fallback) this.log('warn', `${full} falls back to ${found.from}`, {role: rec.role}, 'warn');
    return (0,_words_mjs__WEBPACK_IMPORTED_MODULE_4__.say)(found.word, n, locale);
  }

  // ---------- commit (§10.2) ----------
  commit(turn) {
    const changed = [];
    const causes = new Map();
    for (const [key, {value, writer, cause}] of turn.writes) {
      const def = this.def.keys.get(key);
      if (!def) { this.error('write', `a write of the undeclared key "${key}"`, {turn: turn.n}); continue; }
      if (def.writer !== writer) { this.error('write', `${writer} writes "${key}", whose writer is ${def.writer}`, {turn: turn.n}); continue; }
      if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fits)(def, value)) { this.error('type', `"${key}" (${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def)}) refused ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(value)}`, {turn: turn.n}); continue; }
      if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.same)(this.keys[key], value)) continue;
      changed.push([key, this.keys[key]]);
      if (cause) causes.set(key, cause);
      this.keys[key] = value;
    }
    turn.writes = new Map();
    const dirty = new Set(changed.map(([key]) => key));
    const derived = this.computeDerived(dirty);
    for (const [key] of derived) dirty.add(key);
    if (dirty.size) {
      for (const [name, state] of this.roles) if (state.role.each && dirty.has(state.role.each)) this.syncEach(name);
      this.syncShown(dirty);
    }
    const aggregated = this.computeAggregates();
    for (const [key] of aggregated) dirty.add(key);
    const all = [...changed, ...derived, ...aggregated];
    if (!all.length) return;
    this.log('commit', `applied ${all.map(([key]) => `${key} = ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(this.keys[key])}`).join(', ')}`, {
      turn: turn.n, keys: all.map(([key]) => key), derived: [...derived, ...aggregated].map(([key]) => key), tag: this.def.tag,
      snapshot: (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_2__.journalOn)() ? JSON.stringify(this.keys) : undefined,
    });
    this.view.persist?.(this, dirty, turn.fromAddress);
    const carried = [];
    for (const key of dirty) {
      let parts = 0;
      for (const reader of this.def.readers.get(key) ?? []) {
        for (const rec of this.roles.get(reader.role)?.parts.values() ?? []) if (this.pushSetting(rec, reader.member, this.keys[key], reader.debounce)) parts += 1;
      }
      if (parts) carried.push(`${key} → ${parts}`);
    }
    if (carried.length) this.log('carry', `bindings carry ${carried.join(', ')} part(s)`, {turn: turn.n});
    this.view.keysChanged?.(this, dirty);
    const out = {};
    let any = false;
    for (const [name, key] of this.def.values) {
      if (!dirty.has(key)) continue;
      this.out[name] = this.keys[key];
      out[name] = this.keys[key];
      any = true;
    }
    if (any) {
      this.log('cross', `⇡ values ${Object.keys(out).join(', ')} go out of ${this.id}`, {values: Object.keys(out)});
      this.frame.report(out, {origin: turn.origin});
    }
    for (const [key, previous] of all) {
      if (this.def.keys.get(key).writer === 'parent') continue;
      const on = `data.${key}`;
      if (!this.def.byTrigger.has(on)) continue;
      const value = this.keys[key];
      // the turn of data.<key> carries the chain of the rule that wrote the key, or of a derived key's turn (§10.5)
      const chain = causes.get(key) ?? (derived.some(([name]) => name === key) ? [...new Set([...turn.chain, ...causes.values()].flat())] : turn.chain);
      turn.after.push(() => this.fire(on, {value, previous}, {chain}));
    }
  }

  // ---------- the frame: settings, values, actions, ports (§7.4, §4.9) ----------
  setSetting(name, value) {
    const def = this.def.keys.get(name);
    if (!def || def.writer !== 'parent') { this.error('setting', `${this.def.tag} has no setting "${name}"`); return Promise.resolve(null); }
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fits)(def, value)) { this.error('type', `setting "${name}" (${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def)}) refused ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(value)}`); return Promise.resolve(null); }
    if (!this.running) { this.initialSettings[name] = value; return Promise.resolve(null); }
    if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.same)(this.keys[name], value)) return Promise.resolve(null);
    this.log('cross', `⇣ setting ${name} = ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.show)(value)} comes into ${this.id}`, {setting: name});
    return this.fire(`outside.${name}`, {value, previous: this.keys[name]}, {preset: [[name, value, 'parent']], origin: 'outside'});
  }

  value(name) { return this.out[name]; }

  /** An action asked from outside: only rules handle it; an unhandled one is reported, not passed up (§7.4). */
  act(action, args = {}, options = {}) {
    if (action === 'connect-port') return this.connectPort(args?.port ?? args);
    if (action === 'focus' || action === 'blur') { this.view.focus?.(action); return {answer: 'applied'}; }
    const on = `outside.${action}`;
    const handled = this.def.byTrigger.has(on);
    if (!handled && this.def.aggregates.length && (action === 'check-validity' || action === 'reset')) {
      if (action === 'check-validity') return this.keys.valid === false ? {answer: 'refused', reason: 'invalid'} : {answer: 'applied'};
      return {answer: 'applied'};
    }
    const def = this.def.manifest.actions?.[action];
    if (!def) { this.error('action', `${this.def.tag} has no action "${action}"`); return {answer: 'refused', reason: 'no-action'}; }
    if (!handled) { this.error('unhandled', `action "${action}" is handled by no rule: reported, not passed up (§7.4)`); return {answer: 'refused', reason: 'unhandled'}; }
    const policy = def.concurrency ?? 'parallel';
    let state = this.calls.get(action);
    if (!state) { state = {active: new Set(), tail: null}; this.calls.set(action, state); }
    if (state.active.size && policy === 'drop') { this.log('concurrency', `outside.${action}: dropped while it runs (drop)`); return {answer: 'refused', reason: 'busy'}; }
    if (state.active.size && policy === 'latest') for (const earlier of state.active) earlier.controller.abort('latest');
    const scope = linked(options.signal ?? this.scope.signal);
    state.active.add(scope);
    this.log('cross', `⇣ action ${action} comes into ${this.id}`, {action});
    const go = () => this.fire(on, (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(args) ? args : {}, {chain: options.chain ?? [], origin: 'outside', signal: scope.signal});
    const turn = state.active.size > 1 && policy === 'queue' ? Promise.resolve(state.tail).then(go) : go();
    const result = turn.then((ended) => {
      state.active.delete(scope);
      scope.controller.abort('done');
      if (ended?.refused !== null && ended?.refused !== undefined) return {answer: 'refused', reason: ended.refused};
      // A rule that ended without applied answers its outcome (dispatcher decision 2026-10-27).
      if (ended?.outcome) return {...ended.outcome};
      return {answer: 'applied'};
    });
    state.tail = result;
    return result;
  }

  /** `connect-port`: kept, and handed to every part that declares the port, at any depth, later ones too (§4.9). */
  connectPort(port) {
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(port) || !port.id) { this.error('port', 'connect-port needs a port with an id'); return {answer: 'refused', reason: 'no-port'}; }
    this.ports.set(port.id, port);
    let handed = 0;
    for (const state of this.roles.values()) for (const rec of state.parts.values()) {
      if (!rec.started) continue;
      if (rec.isAssembly || rec.iface.port?.id === port.id) { rec.link.connectPort?.(port); if (!rec.isAssembly) handed += 1; }
    }
    this.log('port', `connect-port ${port.id}: handed to ${handed} part(s) of ${this.id}`, {port: port.id, handed});
    return {answer: 'applied'};
  }

  /** The keys, their writers and readers (§14 «a map of keys»). */
  keyMap() {
    const map = {};
    for (const [name, def] of this.def.keys) {
      map[name] = {writer: def.writer, type: def.type, value: this.keys[name], readers: (this.def.readers.get(name) ?? []).map((one) => `${one.role}.${one.member}`)};
    }
    return map;
  }

  /** The scope ends: everything the instance started is cancelled at once (§7.7). */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const state of this.roles.values()) for (const rec of state.parts.values()) this.disposePart(rec);
    this.roles.clear();
    this.scope.controller.abort('removed');
    this.view.dispose?.(this);
    this.log('dispose', `${this.id} is removed; its scope ends`);
  }
}

const stepKind = (step) => ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(step) ? Object.keys(step).find((field) => field !== 'with' && field !== '$comment') : 'step');



/***/ },

/***/ "9ee717a9c619"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkRole: () => (/* binding */ checkRole),
/* harmony export */   compile: () => (/* binding */ compile),
/* harmony export */   interfaces: () => (/* binding */ interfaces),
/* harmony export */   normaliseInterface: () => (/* binding */ normaliseInterface),
/* harmony export */   ruleWrites: () => (/* binding */ ruleWrites),
/* harmony export */   splitTrigger: () => (/* binding */ splitTrigger)
/* harmony export */ });
/* harmony import */ var _logic_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("eb7fe3498c26");
/* harmony import */ var _values_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8cf8ac8cb59d");
/* harmony import */ var _words_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ff707ab72ad6");
// An assembly's manifest compiled once per tag (standard simai.smart-component
// 1.3.8 §7, §9): its keys with their one writer and the order of its derived
// keys, its roles and their bindings, its rules indexed by what they hear, its
// layouts and its words. Problems found here are the load-time half of gates 4
// and 5: they are reported, and what they touch does not run.
//
// The interfaces of the parts are kept in one registry on the shared global:
// a part's interface is what the runtime checks a role against, wires and
// asks, whatever class the element is (§4).





const REGISTRY = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfAssemblyInterfaces';
  if (!root[key]) root[key] = {parts: new Map(), traits: new Map(), assemblies: new Map()};
  return root[key];
})();

const PARTS = ['settings', 'values', 'events', 'actions'];

/** An interface in one shape: `{tag, version, settings, values, events, actions, port, implements, layer}`. */
function normaliseInterface(tag, source = {}) {
  const iface = {tag, version: source.version ?? null, port: source.port ?? null, layer: source.layer ?? null,
    implements: [...(source.implements ?? [])], traits: [...(source.traits ?? [])], words: [...(source.words ?? [])]};
  for (const part of PARTS) iface[part] = Object.fromEntries((0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(source[part]));
  // A part's word settings are listed apart, by name (§15.1): they are string settings all the same (§7.2).
  for (const name of iface.words) if (!(name in iface.settings)) iface.settings[name] = {type: 'string', word: true};
  for (const trait of iface.traits) {
    const brought = REGISTRY.traits.get(trait);
    if (!brought) continue;
    for (const part of PARTS) for (const [name, def] of (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(brought[part])) if (!(name in iface[part])) iface[part][name] = def;
  }
  return iface;
}

const interfaces = {
  /** Register a part's interface: its manifest, or the registry entry the build writes (§4). */
  register(tag, source) {
    const name = String(tag).toLowerCase();
    REGISTRY.parts.set(name, normaliseInterface(name, source));
    return this;
  },
  registerAll(map = {}) {
    for (const [tag, source] of (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(map)) this.register(tag, source);
    return this;
  },
  /** Register a trait's interface slice, `<name>@<major>` (§20). */
  registerTrait(name, source) {
    REGISTRY.traits.set(String(name), source);
    return this;
  },
  /** The interface of a tag: registered, declared by its class, or an assembly's own (§7.4). */
  of(tag) {
    const name = String(tag).toLowerCase();
    if (REGISTRY.parts.has(name)) return REGISTRY.parts.get(name);
    if (REGISTRY.assemblies.has(name)) return REGISTRY.assemblies.get(name);
    const declared = globalThis.customElements?.get?.(name)?.sfInterface;
    if (declared) {
      const iface = normaliseInterface(name, declared);
      REGISTRY.parts.set(name, iface);
      return iface;
    }
    return null;
  },
  has(tag) { return Boolean(this.of(tag)); },
  forget(tag) {
    if (tag) REGISTRY.parts.delete(String(tag).toLowerCase());
    else REGISTRY.parts.clear();
    return this;
  },
};

/** A trigger `<head>.<rest>`: `outside.x`, `data.x` or `<role>.<event>`. */
function splitTrigger(on) {
  const text = String(on);
  const dot = text.indexOf('.');
  return dot < 0 ? [text, ''] : [text.slice(0, dot), text.slice(dot + 1)];
}

const triggersOf = (rule) => (Array.isArray(rule.on) ? rule.on : [rule.on]).filter((on) => typeof on === 'string');

/** Every `from` reading of a rule, first field only: what its triggers must carry (§9, gate 5). */
function fromFields(node, into = new Set()) {
  if (Array.isArray(node)) { for (const one of node) fromFields(one, into); return into; }
  if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(node)) return into;
  if (typeof node.from === 'string') into.add(node.from.split('.')[0]);
  for (const [field, inner] of Object.entries(node)) if (field !== 'value' && typeof inner === 'object') fromFields(inner, into);
  return into;
}

function bindingOf(left, target) {
  const [side, ...rest] = String(left).split('.');
  const member = rest.join('.');
  const key = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(target) ? target.key : target;
  const debounce = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(target) ? Number(target.debounce) || 0 : 0;
  if (typeof key !== 'string') return null;
  if (key.startsWith('entry.')) return {side, member, entryField: key.slice(6), debounce};
  return {side, member, key, debounce};
}

const flagKey = (flag) => (typeof flag === 'string' ? flag.replace(/^!/, '') : null);

/**
 * Compile a manifest. `options.layouts` maps a layout name to its HTML,
 * `options.lang` a locale to its language file.
 */
function compile(manifest, options = {}) {
  const problems = [];
  const notes = [];
  const problem = (section, text, data = {}) => problems.push({section, text, ...data});
  const slots = new Map((0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(manifest.slots));
  const tag = String(manifest?.tag ?? '').toLowerCase();
  if (!tag.includes('-')) throw new TypeError(`an assembly needs a custom element tag, got "${manifest?.tag}"`);

  // Keys (§7.1), with what form.aggregates adds (§17.4).
  const keys = new Map((0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(manifest.keys).map(([name, def]) => [name, {...def}]));
  // `undoable` (an undo/redo history per key) is postponed (dispatcher decision 2026-10-27): the key works without it.
  for (const [name, def] of keys) if (def.undoable) notes.push({section: '§7.5', text: `key "${name}" is undoable: undo is postponed in this runtime; the key keeps its current value only`});
  if (manifest.form?.aggregates === true) {
    if (!keys.has('valid')) keys.set('valid', {type: 'boolean', writer: 'derived', aggregate: 'valid'});
    if (!keys.has('value')) keys.set('value', {type: 'object', writer: 'derived', aggregate: 'value'});
  }
  const roles = new Map((0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(manifest.roles));
  for (const [name, def] of keys) {
    if (!def.writer) problem('§7.1', `key "${name}" has no writer`);
    else if (!['parent', 'logic', 'derived'].includes(def.writer) && !roles.has(def.writer)) problem('§7.1', `key "${name}" is written by "${def.writer}", which is not a role`);
    if (def.writer === 'logic' && !('initial' in def)) problem('§7.1', `key "${name}" (writer logic) has no initial value`);
    if (def.writer === 'logic' && 'initial' in def && !(0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.fits)(def, def.initial)) problem('§7.1', `the initial value of "${name}" is not a ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.typeOf)(def)}`);
    if (def.writer === 'derived' && !def.from && !def.aggregate) problem('§7.1.2', `derived key "${name}" has no from`);
  }

  // Derived keys in the order they are computed; a cycle fails gate 4 (§7.1.2).
  const deps = new Map();
  for (const [name, def] of keys) if (def.writer === 'derived' && def.from) deps.set(name, [...(0,_logic_mjs__WEBPACK_IMPORTED_MODULE_0__.keysOf)(def.from)].filter((key) => keys.has(key)));
  const order = [];
  const state = new Map();
  const cycle = new Set();
  const visit = (name, trail) => {
    if (state.get(name) === 'done') return;
    if (state.get(name) === 'busy') { for (const one of trail.slice(trail.indexOf(name))) cycle.add(one); return; }
    state.set(name, 'busy');
    for (const dep of deps.get(name) ?? []) if (deps.has(dep)) visit(dep, [...trail, name]);
    state.set(name, 'done');
    order.push(name);
  };
  for (const name of deps.keys()) visit(name, []);
  if (cycle.size) problem('§7.1.2', `derived keys form a cycle: ${[...cycle].join(' → ')}`, {gate: 4});
  const derived = order.filter((name) => !cycle.has(name));
  const dependents = new Map(); // key → derived keys reading it, in computing order
  for (const name of derived) for (const dep of deps.get(name)) {
    if (!dependents.has(dep)) dependents.set(dep, []);
    dependents.get(dep).push(name);
  }
  const aggregates = [...keys].filter(([, def]) => def.writer === 'derived' && def.aggregate).map(([name, def]) => [name, def.aggregate]);

  // Roles and bindings (§7.2).
  const compiledRoles = new Map();
  const readers = new Map(); // key → [{role, member, debounce}]
  for (const [name, def] of roles) {
    const [partTag, major] = String(def.part ?? '').split('@');
    const role = {name, def, tag: partTag.toLowerCase(), major: major ? Number(major) : null, accepts: def.accepts ?? null,
      each: def.each ?? null, start: def.start ?? 'now', if: def.if ?? null, hidden: def.hidden ?? null,
      constants: Object.fromEntries((0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(def.settings)), binds: [], entryBinds: [], valueBinds: new Map()};
    if (!role.tag) problem('§7.2', `role "${name}" names no part`);
    if (!['now', 'visible', 'opened'].includes(role.start)) problem('§7.2.1', `role "${name}" has start "${role.start}"`);
    if (role.each) {
      const list = keys.get(role.each);
      if (!list) problem('§7.2.3', `role "${name}" repeats per "${role.each}", which is not a key`);
      else if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.typeOf)(list) !== 'list') problem('§7.2.3', `role "${name}" repeats per "${role.each}", which is not a list`);
    }
    for (const flag of [role.if, role.hidden]) {
      const key = flagKey(flag);
      if (key && (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.typeOf)(keys.get(key)) !== 'boolean') problem('§7.2.2', `role "${name}" reads "${flag}", which is not a boolean key`);
    }
    for (const [left, target] of (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(def.bind)) {
      const binding = bindingOf(left, target);
      if (!binding || !['settings', 'values'].includes(binding.side)) { problem('§7.2', `role "${name}": "${left}" is not a binding`); continue; }
      if (binding.entryField !== undefined) {
        if (binding.side !== 'settings' || !role.each) problem('§7.2.3', `role "${name}": "${left}" reads an entry, but the role is not per entry`);
        else role.entryBinds.push(binding);
        continue;
      }
      if (!keys.has(binding.key)) { problem('§7.2', `role "${name}" binds "${left}" to "${binding.key}", which is not a key`); continue; }
      if (binding.side === 'values') {
        const owner = keys.get(binding.key).writer;
        if (owner !== name) problem('§7.1', `role "${name}" writes "${binding.key}", whose writer is ${owner}`);
        role.valueBinds.set(binding.member, binding.key);
        continue;
      }
      role.binds.push(binding);
      if (!readers.has(binding.key)) readers.set(binding.key, []);
      readers.get(binding.key).push({role: name, member: binding.member, debounce: binding.debounce});
    }
    compiledRoles.set(name, role);
  }

  // Rules (§9), indexed by what they hear; a rule hears each trigger once.
  const rules = [];
  const byTrigger = new Map();
  const ids = new Set();
  for (const rule of Array.isArray(manifest.rules) ? manifest.rules : []) {
    if (!rule || typeof rule !== 'object') continue;
    if (!rule.id) problem('§9', 'a rule has no id');
    else if (ids.has(rule.id)) problem('§9', `two rules have the id "${rule.id}"`);
    ids.add(rule.id);
    const triggers = triggersOf(rule);
    if (!triggers.length) problem('§9', `rule "${rule.id}" hears nothing`);
    if (new Set(triggers).size !== triggers.length) problem('§9', `rule "${rule.id}" names a trigger twice`);
    if (rule.concurrency === 'latest' && ruleWrites(rule)) problem('§10.7', `rule "${rule.id}" waits on a write and may not be latest`, {gate: 5});
    const compiled = {...rule, triggers, reads: fromFields([rule.if, rule.steps, rule.otherwise])};
    rules.push(compiled);
    for (const on of new Set(triggers)) {
      const [head, rest] = splitTrigger(on);
      if (head === 'outside') {
        if (!(rest in (manifest.actions ?? {})) && keys.get(rest)?.writer !== 'parent') problem('§9', `rule "${rule.id}" hears ${on}: not an action or a setting of the assembly`, {gate: 5});
      } else if (head === 'data') {
        if (!keys.has(rest)) problem('§9', `rule "${rule.id}" hears ${on}: not a key`, {gate: 5});
        else if (keys.get(rest).writer === 'parent') problem('§9', `rule "${rule.id}" hears ${on}: a parent's key is heard as outside.${rest}`, {gate: 5});
      } else if (slots.get(head)?.accepts) {
        notes.push({section: '§4.5.1', text: `rule "${rule.id}" hears ${on}: a part in slot "${head}" is not wired by this runtime`});
      } else if (!compiledRoles.has(head)) problem('§9', `rule "${rule.id}" hears ${on}: "${head}" is not a role`, {gate: 5});
      if (!byTrigger.has(on)) byTrigger.set(on, []);
      byTrigger.get(on).push(compiled);
    }
  }

  // The assembly's own interface (§7.4): what a parent sees.
  const values = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(manifest.values).map(([name, def]) => [name, def.value]);
  for (const [name, key] of values) if (!keys.has(key)) problem('§7.4', `value "${name}" names "${key}", which is not a key`);
  for (const [name] of (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(manifest.settings)) if (keys.get(name)?.writer !== 'parent') problem('§7.4', `setting "${name}" has no key with writer parent`);
  const iface = normaliseInterface(tag, {...manifest, events: manifest.events, actions: manifest.actions});
  REGISTRY.assemblies.set(tag, iface);

  return {
    tag, manifest, problems, notes, keys, derived, dependents, aggregates, roles: compiledRoles, readers, rules, byTrigger, values, iface,
    layouts: {...(options.layouts ?? {})},
    words: (0,_words_mjs__WEBPACK_IMPORTED_MODULE_2__.createWords)(options.lang ?? {}, options.sourceLocale ?? null),
    persisted: [...keys].filter(([, def]) => def.persist).map(([name, def]) => [name, def.persist]),
    settingProps: (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.own)(manifest.settings).map(([name, def]) => ({name, def, prop: (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.camel)(name)})),
    initial(name) { return (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.clone)(keys.get(name)?.initial ?? null); },
  };
}

/** Whether a rule waits on a write (vocabulary §5.3): such a rule is never `latest` (§10.7). */
function ruleWrites(rule) {
  const writes = new Set(['save', 'delete', 'create', 'rename', 'archive', 'restore', 'move', 'apply', 'submit', 'retry', 'attach', 'detach', 'answer', 'rate', 'read']);
  return [...(rule.steps ?? []), ...(rule.otherwise ?? [])].some((step) => typeof step?.do === 'string' && writes.has(step.do.split('.').pop()));
}

/**
 * Check a role against the interface of the part placed in it (§7.2, §4.10
 * gate 5 at load). Answers `null` when it fits, else `{reason, text}` with a
 * reason of §4.5.1.
 */
function checkRole(definition, role, iface) {
  if (!iface) return {reason: 'no-interface', text: `${role.tag} has no interface registered`};
  const major = (version) => (version ? Number(String(version).split('.')[0]) : null);
  if (role.major !== null && iface.version && major(iface.version) !== role.major) {
    return {reason: 'major-mismatch', text: `role "${role.name}" asks ${role.tag}@${role.major}, the part is ${iface.version}`};
  }
  if (role.accepts) {
    const [name, wanted] = String(role.accepts).split('@');
    const offered = iface.implements.find((one) => one.split('@')[0] === name);
    if (!offered) return {reason: iface.implements.length ? 'other-interface' : 'no-interface', text: `${role.tag} does not implement ${role.accepts}`};
    if (offered.split('@')[1] !== wanted) return {reason: 'major-mismatch', text: `${role.tag} implements ${offered}, the role asks ${role.accepts}`};
  }
  for (const binding of [...role.binds, ...role.entryBinds]) {
    if (!(binding.member in iface.settings) && !(binding.member in iface.values)) return {reason: 'missing-setting', text: `${role.tag} has no setting "${binding.member}" (role "${role.name}")`};
  }
  for (const member of role.valueBinds.keys()) {
    if (!(member in iface.values)) return {reason: 'missing-setting', text: `${role.tag} has no value "${member}" (role "${role.name}")`};
  }
  for (const [name, value] of Object.entries(role.constants)) {
    const def = iface.settings[name] ?? iface.values[name];
    if (!def) return {reason: 'missing-setting', text: `${role.tag} has no setting "${name}" (role "${role.name}", a constant)`};
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.fits)(def, value)) return {reason: 'carries-mismatch', text: `the constant ${name} of role "${role.name}" is not a ${(0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.typeOf)(def)}`};
  }
  for (const rule of definition.rules) {
    const heard = rule.triggers.filter((on) => splitTrigger(on)[0] === role.name);
    for (const on of heard) {
      const event = iface.events[splitTrigger(on)[1]];
      if (!event) return {reason: 'missing-event', text: `rule "${rule.id}" hears ${on}, but ${role.tag} has no event "${splitTrigger(on)[1]}"`};
      if (event.carries === 'native' || !rule.reads.size) continue;
      const carries = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(event.carries) ? event.carries : {};
      for (const field of rule.reads) {
        if (!(field in carries)) return {reason: 'carries-mismatch', text: `rule "${rule.id}" reads "${field}" from ${on}, which does not carry it`};
      }
    }
  }
  return null;
}


/***/ },

/***/ "8258b7112fb6"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HostView: () => (/* binding */ HostView),
/* harmony export */   OWNED: () => (/* binding */ OWNED),
/* harmony export */   PART_LINK: () => (/* reexport safe */ _link_mjs__WEBPACK_IMPORTED_MODULE_4__.PART_LINK),
/* harmony export */   definitions: () => (/* binding */ definitions),
/* harmony export */   elementClass: () => (/* binding */ elementClass),
/* harmony export */   instances: () => (/* binding */ instances)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _core_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("b60c1434b0be");
/* harmony import */ var _definition_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9ee717a9c619");
/* harmony import */ var _journal_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6d4272a67a74");
/* harmony import */ var _link_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("dfdb640e668b");
/* harmony import */ var _values_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("8cf8ac8cb59d");
// The page side of an assembly (standard simai.smart-component 1.3.8 §7):
// the custom element an assembly's tag defines, and the view its bus asks for
// what lives in the DOM — the layout and its `<x-role>` places (§7.3), a
// panel repeated per entry (§7.2.3), `if` and `hidden` (§7.2.2), when a part
// starts and when a closed container defers its reads (§7.2.1), keys kept in
// the address (§7.5), the live region (§7.4.1), and errors as the base event
// `sf-component-error` (§4.1).
//
// CSP: no eval, no inline handlers, no style attributes; a layout is parsed by
// a <template> and only text is written from keys.








const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfAssemblyHosts';
  if (!root[key]) root[key] = {definitions: new Map(), instances: new Map()};
  return root[key];
})();

/** The definitions of the page's assembly tags and the running instances by path (§7.1.1). */
const definitions = STORE.definitions;
const instances = STORE.instances;

const OWNED = Symbol.for('sf.assembly.owned');
const EARLY = Symbol('sf.assembly.early');
const CONTROLS = 'input, select, textarea, button, fieldset';
const PANELS = '[role="tabpanel"], details, [data-sf-panel]';
const nextFrame = (fn) => (typeof globalThis.requestAnimationFrame === 'function' ? globalThis.requestAnimationFrame(() => fn()) : globalThis.setTimeout(fn, 0));

/** The default way a part's module is fetched when the part starts (§7.2.1): the Loader's. */
/** DOM events a part's form controls send as any control does: they reach the page. */
const NATIVE_EVENTS = new Set(['change', 'input']);

function loadByLoader(tag) {
  const loader = globalThis.SF?.Loader;
  if (typeof loader?.ensureSmartElementLoaded === 'function') loader.ensureSmartElementLoaded(tag);
}

class HostView {
  constructor(host, definition, options = {}) {
    this.host = host;
    this.def = definition;
    this.loadPart = options.loadPart ?? loadByLoader;
    this.places = new Map();
    this.repeats = new Map();
    this.ifs = [];
    this.texts = new Map();
    this.deferred = new Set();
    this.watched = new Set();
    this.stopped = new Set();
    this.disabled = new Map();
    this.checkQueued = false;
    this.top = !host[OWNED];
  }

  // ---------- the layout (§7.3) ----------
  build(core) {
    this.core = core;
    const {host} = this;
    host.setAttribute('data-sf-assembly', this.def.tag);
    host.setAttribute('data-sf-instance', core.id);
    const names = Object.keys(this.def.layouts);
    const wanted = host.getAttribute('layout');
    const name = wanted && this.def.layouts[wanted] !== undefined ? wanted : (this.def.layouts.default !== undefined ? 'default' : names[0]);
    if (wanted && name !== wanted) core.error('layout', `${this.def.tag} has no layout "${wanted}"`);
    this.layoutName = name ?? null;
    this.box = this.parse(name);
    this.findPlaces(this.box, Boolean(name));
    this.mountAnnouncer();
    host.append(this.box);
    this.unlanguage = _page_language_js__WEBPACK_IMPORTED_MODULE_0__.language.onChange(() => core.relanguage());
    core.scope.signal.addEventListener('abort', () => this.unlanguage?.(), {once: true});
  }

  parse(name) {
    const box = globalThis.document.createElement('div');
    box.setAttribute('data-sf-layout', name ?? '');
    const html = name ? this.def.layouts[name] : '';
    if (html) {
      const template = globalThis.document.createElement('template');
      template.innerHTML = html;
      box.append(template.content.cloneNode(true));
    }
    return box;
  }

  findPlaces(box, hasLayout) {
    const all = [...box.querySelectorAll('x-role')];
    for (const [roleName, role] of this.def.roles) {
      let place = all.find((one) => one.getAttribute('name') === roleName);
      if (!place) {
        place = globalThis.document.createElement('x-role');
        place.setAttribute('name', roleName);
        box.append(place);
        if (hasLayout) this.core.log('warn', `the layout has no <x-role name="${roleName}">; the part is placed at the end`, {}, 'warn');
      }
      place.setAttribute('data-sf-place', roleName);
      this.places.set(roleName, place);
      if (role.each) {
        const panel = place.parentElement?.closest(PANELS);
        if (panel && box.contains(panel)) { // §7.2.3: the panel around <x-role> repeats per entry
          const marker = globalThis.document.createComment(`sf-repeat ${roleName}`);
          panel.replaceWith(marker);
          this.repeats.set(roleName, {template: panel, marker});
        }
      }
    }
    for (const element of box.querySelectorAll('[if]')) {
      if (element.localName === 'x-role') continue;
      this.ifs.push({element, flag: element.getAttribute('if'), marker: globalThis.document.createComment(`sf-if ${element.getAttribute('if')}`)});
    }
    this.bindTexts(box);
  }

  /** `{{key}}` in a layout's text: the key's value as text, nothing else (§7.3). */
  bindTexts(box) {
    const walker = globalThis.document.createTreeWalker(box, globalThis.NodeFilter.SHOW_TEXT);
    const found = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.data.includes('{{')) found.push(node);
    for (const node of found) {
      const parts = node.data.split(/(\{\{\s*[\w-]+\s*\}\})/);
      const nodes = parts.map((part) => {
        const match = /^\{\{\s*([\w-]+)\s*\}\}$/.exec(part);
        const text = globalThis.document.createTextNode(match ? '' : part);
        if (match) {
          if (!this.def.keys.has(match[1])) this.core.error('layout', `the layout shows {{${match[1]}}}, which is not a key`);
          if (!this.texts.has(match[1])) this.texts.set(match[1], []);
          this.texts.get(match[1]).push(text);
        }
        return text;
      });
      node.replaceWith(...nodes);
    }
  }

  roleFlags(roleName) {
    const place = this.places.get(roleName);
    return this.ifs.filter(({element}) => element.contains(place)).map(({flag}) => flag);
  }

  mountAnnouncer() {
    const announces = this.def.manifest.accessibility?.announces ?? this.def.manifest.announces;
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.isObject)(announces)) return;
    this.announces = Object.fromEntries((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.own)(announces));
    this.live = globalThis.document.createElement('div');
    this.live.className = 'sr-only';
    this.live.setAttribute('data-sf-announce', '');
    this.live.setAttribute('aria-live', Object.values(this.announces).includes('assertive') ? 'assertive' : 'polite');
    this.box.append(this.live);
  }

  /** Switching a layout moves the parts with their state (§7.3). */
  useLayout(name) {
    if (this.def.layouts[name] === undefined) { this.core.error('layout', `${this.def.tag} has no layout "${name}"`); return false; }
    const parts = [];
    for (const state of this.core.roles.values()) for (const rec of state.parts.values()) parts.push(rec);
    const oldBox = this.box;
    const oldPlaces = new Map(this.places);
    this.places.clear();
    this.repeats.clear();
    this.ifs = [];
    this.texts.clear();
    this.layoutName = name;
    this.box = this.parse(name);
    this.findPlaces(this.box, true);
    if (this.live) this.box.append(this.live);
    for (const rec of parts) {
      const repeat = this.repeats.get(rec.role);
      if (repeat && rec.entry) {
        const panel = rec.panel ?? this.panelFor(rec, repeat);
        repeat.marker.before(panel);
      } else {
        this.places.get(rec.role).append(rec.element);
        rec.panel?.remove();
        rec.panel = null;
      }
      const old = oldPlaces.get(rec.role);
      if (old?.hidden) this.places.get(rec.role).hidden = true;
    }
    oldBox.replaceWith(this.box);
    for (const [roleName] of this.def.roles) {
      const state = this.core.roles.get(roleName);
      if (state) state.flags = [state.role.if, ...this.roleFlags(roleName)].filter(Boolean);
    }
    this.core.syncShown(null);
    this.keysChanged(this.core, new Set(this.def.keys.keys()));
    this.host.setAttribute('layout', name);
    this.queueCheck();
    return true;
  }

  // ---------- parts ----------
  interfaceOf(tag) { return _definition_mjs__WEBPACK_IMPORTED_MODULE_2__.interfaces.of(tag); }
  isAssembly(tag) { return definitions.has(tag); }

  panelFor(rec, repeat) {
    const panel = repeat.template.cloneNode(true);
    panel.setAttribute('data-entry', rec.entryId);
    if (panel.localName === 'details') panel.open = false; else panel.hidden = true;
    const place = [...panel.querySelectorAll('x-role')].find((one) => one.getAttribute('name') === rec.role) ?? panel;
    place.append(rec.element);
    rec.panel = panel;
    return panel;
  }

  createPart(rec, context) {
    const tag = rec.def.tag;
    const element = globalThis.document.createElement(tag);
    rec.element = element;
    element[OWNED] = true;
    element.setAttribute('data-sf-role', rec.entry ? `${rec.role}[${rec.entryId}]` : rec.role);
    element.setAttribute('data-sf-instance', rec.instanceId);
    if (rec.def.start !== 'now') {
      element.setAttribute('data-sf-start', rec.def.start);
      element.setAttribute('aria-busy', 'true');
    }
    this.stopAtFrame(rec.iface, tag);
    const repeat = this.repeats.get(rec.role);
    if (repeat && rec.entry) repeat.marker.before(this.panelFor(rec, repeat));
    else {
      const place = this.places.get(rec.role);
      if (!rec.entry && place.firstChild) element.append(...place.childNodes); // a container's panels from the layout
      place.append(element);
    }
    if (definitions.has(tag)) {
      const child = adopt(element, definitions.get(tag), {
        instanceId: rec.instanceId,
        signal: context.signal,
        frame: {
          report: (values, options) => context.report(values, options),
          emit: (verb, detail, options) => context.emit(verb, detail, options),
        },
      });
      return child ? (0,_link_mjs__WEBPACK_IMPORTED_MODULE_4__.assemblyLink)(child) : null;
    }
    return (0,_link_mjs__WEBPACK_IMPORTED_MODULE_4__.createLink)(element, rec.iface, context);
  }

  /**
   * A part's interface events stop at the assembly: the page sees the
   * assembly's own events (§7.4). A native event of a form control inside
   * (`change`, `input`, `click`, ...) is the page's DOM event, not an
   * interface event, and goes on (dispatcher decision 2026-10-27).
   */
  stopAtFrame(iface, tag) {
    for (const [verb, def] of Object.entries(iface.events ?? {})) {
      for (const name of (0,_link_mjs__WEBPACK_IMPORTED_MODULE_4__.domNames)(tag, verb, def)) {
        if (def.carries === 'native' || NATIVE_EVENTS.has(name)) continue;
        if (this.stopped.has(name)) continue;
        this.stopped.add(name);
        this.host.addEventListener(name, (event) => { if (event.target !== this.host) event.stopPropagation(); }, {signal: this.core.scope.signal});
      }
    }
  }

  // ---------- when a part starts (§7.2.1) ----------
  awaitStart(rec, mode) {
    this.deferred.add(rec);
    if (mode === 'visible' && !this.visible && typeof globalThis.IntersectionObserver === 'function') {
      this.visible = new globalThis.IntersectionObserver((seen) => {
        for (const one of seen) {
          if (!one.isIntersecting) continue;
          const rec = [...this.deferred].find((candidate) => candidate.element === one.target);
          this.visible.unobserve(one.target);
          if (rec && !this.closed(rec.element)) this.core.startPart(rec, 'visible');
        }
      });
    }
    this.observe();
    this.queueCheck();
  }

  observe() {
    if (this.mutations || typeof globalThis.MutationObserver !== 'function') return;
    this.mutations = new globalThis.MutationObserver(() => this.queueCheck());
    this.mutations.observe(this.host, {subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'inert', 'open', 'aria-expanded']});
  }

  queueCheck() {
    if (this.checkQueued) return;
    this.checkQueued = true;
    globalThis.queueMicrotask(() => { this.checkQueued = false; this.check(); });
  }

  /** Whether something between the part and the assembly host is closed (§7.2.1). */
  closed(element) {
    if (!element?.isConnected || !this.host.isConnected) return true;
    for (let node = element.parentElement; node && node !== this.host; node = node.parentElement) {
      if (node.hidden || node.inert || node.getAttribute('aria-expanded') === 'false') return true;
      if ((node.localName === 'details' || node.localName === 'dialog') && !node.open) return true;
    }
    return false;
  }

  check() {
    if (!this.core || this.core.disposed) return;
    for (const rec of [...this.deferred]) {
      if (rec.started) { this.deferred.delete(rec); this.watched.add(rec); continue; }
      if (rec.scope.signal.aborted) { this.deferred.delete(rec); continue; }
      if (rec.def.start === 'opened' && !this.closed(rec.element)) {
        this.deferred.delete(rec);
        this.watched.add(rec);
        this.core.startPart(rec, 'opened');
      } else if (rec.def.start === 'visible' && this.visible && !rec.observed && !this.closed(rec.element)) {
        rec.observed = true;
        this.visible.observe(rec.element);
      }
    }
    for (const rec of [...this.watched]) {
      if (rec.scope.signal.aborted) { this.watched.delete(rec); continue; }
      if (rec.element?.isConnected || !this.host.isConnected) this.core.setClosed(rec, this.closed(rec.element));
    }
  }

  startPart(rec) {
    const element = rec.element;
    element.removeAttribute('aria-busy');
    element.setAttribute('data-sf-started', '');
    if (rec.def.start !== 'now') this.watched.add(rec);
    if (!definitions.has(rec.def.tag) && !globalThis.customElements?.get(rec.def.tag)) this.loadPart(rec.def.tag);
  }

  busy(rec, on) {
    if (on) rec.element?.setAttribute('aria-busy', 'true');
    else rec.element?.removeAttribute('aria-busy');
  }

  // ---------- if, hidden, entries (§7.2.2, §7.2.3) ----------
  show(roleName, present, hidden) {
    const place = this.places.get(roleName);
    if (!place) return;
    place.sfMarker ??= globalThis.document.createComment(`sf-if ${roleName}`);
    if (!present && place.parentNode) place.replaceWith(place.sfMarker);
    if (present && !place.parentNode && place.sfMarker.parentNode) place.sfMarker.replaceWith(place);
    if (place.hidden !== hidden) {
      place.hidden = hidden;
      this.disableControls(roleName, place, hidden);
    }
    this.queueCheck();
  }

  /** A part hidden by `hidden` submits nothing and does not block the submit (§7.2.2). */
  disableControls(roleName, place, hidden) {
    if (hidden) {
      const changed = [];
      for (const control of place.querySelectorAll('*')) {
        const formControl = control.matches(CONTROLS) || control.constructor?.formAssociated === true;
        if (formControl && 'disabled' in control && !control.disabled) { control.disabled = true; changed.push(control); }
      }
      this.disabled.set(roleName, changed);
    } else {
      for (const control of this.disabled.get(roleName) ?? []) control.disabled = false;
      this.disabled.delete(roleName);
    }
  }

  order(roleName, recs) {
    const repeat = this.repeats.get(roleName);
    const nodes = recs.map((rec) => (repeat ? rec.panel : rec.element)).filter(Boolean);
    if (!nodes.length) return;
    const parent = repeat ? repeat.marker.parentNode : this.places.get(roleName);
    if (!parent) return;
    const present = [...parent.childNodes].filter((node) => nodes.includes(node));
    if (present.length === nodes.length && present.every((node, i) => node === nodes[i])) return; // moving a part reconnects it: only when needed
    for (const node of nodes) {
      if (repeat) repeat.marker.before(node);
      else parent.append(node);
    }
  }

  removePart(rec) {
    this.deferred.delete(rec);
    this.watched.delete(rec);
    if (rec.element && this.visible) this.visible.unobserve(rec.element);
    (rec.panel ?? rec.element)?.remove();
  }

  refuse(roleName, reason) {
    const place = this.places.get(roleName);
    place?.setAttribute('data-sf-refused', reason);
  }

  // ---------- keys shown, kept, announced ----------
  keysChanged(core, dirty) {
    for (const key of dirty) {
      for (const node of this.texts.get(key) ?? []) {
        const value = core.keys[key];
        node.data = value === null || value === undefined ? '' : (typeof value === 'object' ? '' : String(value));
      }
    }
    for (const one of this.ifs) {
      const key = one.flag.replace(/^!/, '');
      if (!dirty.has(key) && one.applied !== undefined) continue;
      const on = core.flag(one.flag);
      one.applied = on;
      if (!on && one.element.parentNode) one.element.replaceWith(one.marker);
      if (on && !one.element.parentNode && one.marker.parentNode) one.marker.replaceWith(one.element);
    }
    if (this.announces) this.announce(core, dirty);
    if (this.ifs.length) this.queueCheck();
  }

  announce(core, dirty) {
    const locale = (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(this.host);
    const said = [];
    for (const [name, key] of core.def.values) {
      if (!this.announces[name] || !dirty.has(key)) continue;
      const value = core.keys[key];
      if (value === null || value === undefined) continue;
      const label = core.def.words.text(locale, `values.${name}`);
      const shown = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(core.def.keys.get(key)) === 'state' ? core.def.words.text(locale, `runtime.states.${value}`) : String(value);
      if (shown === null) continue; // a data state is never announced as is (§7.4.1)
      said.push(label ? `${label}: ${shown}` : shown);
    }
    if (said.length) this.live.textContent = said.join('. ');
  }

  /** Keys kept in the address or in the browser (§7.5); read once at start. */
  restore(persisted) {
    const out = [];
    if (!persisted.length) return out;
    if (!this.top) { (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_3__.record)(this.core.id, 'warn', 'persist is kept by the top assembly only; a nested one keeps its keys in memory', {}, 'warn'); return out; }
    this.persisted = persisted;
    const url = persisted.filter(([, where]) => where === 'url').map(([name]) => name);
    const local = persisted.filter(([, where]) => where === 'local').map(([name]) => name);
    for (const [name, where] of persisted) if (where !== 'url' && where !== 'local') (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_3__.record)(this.core.id, 'warn', `persist "${where}" of "${name}" needs the host; kept in memory`, {}, 'warn');
    out.push(...this.readAddress(url));
    for (const name of local) {
      try {
        const raw = globalThis.localStorage?.getItem(this.storageKey(name));
        if (raw !== null && raw !== undefined) out.push([name, JSON.parse(raw)]);
      } catch {
        // storage blocked: the key starts from its initial value
      }
    }
    this.urlKeys = url;
    if (url.length && typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('popstate', () => { // Back and Forward bring the keys back (§7.5)
        const changed = this.readAddress(url, true);
        if (changed.length) this.core.restore(changed);
      }, {signal: this.core.scope.signal});
    }
    return out;
  }

  storageKey(name) { return `sf-assembly:${this.core.id}:${name}`; }

  readAddress(names, all = false) {
    const out = [];
    if (!names.length) return out;
    let query;
    try { query = new globalThis.URLSearchParams(globalThis.location?.search ?? ''); } catch { return out; }
    for (const name of names) {
      const def = this.def.keys.get(name);
      const raw = query.get(name);
      if (raw === null) { if (all) out.push([name, this.def.initial(name)]); continue; }
      const value = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def) === 'list' || (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def) === 'object' ? safeJson(raw) : (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fromAttribute)(def, raw);
      out.push([name, value]);
    }
    return out;
  }

  persist(core, dirty, fromAddress) {
    if (!this.persisted || !this.top) return;
    let address = false;
    for (const [name, where] of this.persisted) {
      if (!dirty.has(name)) continue;
      if (where === 'url') address = true;
      if (where === 'local') {
        try { globalThis.localStorage?.setItem(this.storageKey(name), JSON.stringify(core.keys[name])); } catch { /* storage blocked */ }
      }
    }
    if (!address || fromAddress || !globalThis.history?.pushState) return;
    const query = new globalThis.URLSearchParams(globalThis.location.search);
    for (const name of this.urlKeys ?? []) {
      const value = core.keys[name];
      const initial = this.def.keys.get(name).initial ?? null;
      if (value === null || value === undefined || JSON.stringify(value) === JSON.stringify(initial)) query.delete(name);
      else query.set(name, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
    const text = query.toString();
    const next = `${globalThis.location.pathname}${text ? `?${text}` : ''}${globalThis.location.hash}`;
    if (next !== `${globalThis.location.pathname}${globalThis.location.search}${globalThis.location.hash}`) {
      globalThis.history.pushState(globalThis.history.state, '', next);
      core.log('address', `the address is ${next}`);
    }
  }

  // ---------- the rest ----------
  locale(rec) { return (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(rec?.element?.isConnected ? rec.element : this.host); }

  error(kind, text, data = {}) {
    this.host.dispatchEvent(new globalThis.CustomEvent('sf-component-error', {bubbles: true, composed: true, detail: {kind, text, instance: this.core?.id ?? null, ...pick(data)}}));
  }

  focus(which) { this.host[which]?.(); }

  started(core) {
    this.keysChanged(core, new Set(this.def.keys.keys())); // the layout's {{key}} and if from the first values
    this.queueCheck();
  }

  dispose() {
    this.mutations?.disconnect();
    this.visible?.disconnect();
    this.deferred.clear();
    this.watched.clear();
    this.unlanguage?.();
  }
}

const pick = (data) => Object.fromEntries(Object.entries(data).filter(([, value]) => value === null || typeof value !== 'object'));
const safeJson = (raw) => { try { return JSON.parse(raw); } catch { return null; } };

/** Start an assembly element that a parent placed: its parent runs it and ends it (§7.7). */
function adopt(element, definition, options) {
  const registry = globalThis.customElements;
  if (registry && !registry.get(definition.tag)) return null;
  registry?.upgrade?.(element);
  if (typeof element.sfAdopt !== 'function') return null;
  return element.sfAdopt(options);
}

/** The custom element class of an assembly tag (§7.4: an assembly has the same interface as a leaf). */
function elementClass(definition, options = {}) {
  const Base = globalThis.HTMLElement;
  const scalar = definition.settingProps.filter(({def}) => !['list', 'object'].includes((0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.typeOf)(def)));
  const attributes = new Map(scalar.map((one) => [one.name, one]));

  class SfAssembly extends Base {
    static get observedAttributes() { return [...attributes.keys()]; }
    static sfDefinition = definition;
    static sfInterface = definition.iface;

    #core = null;
    #leaving = false;

    get [EARLY]() { return (this._sfEarly ??= Object.create(null)); }

    get sfCore() { return this.#core; }

    connectedCallback() {
      if (this[OWNED]) return; // its parent runs it
      if (this.#core && !this.#core.disposed) { this.#leaving = false; return; }
      this.#startTop();
    }

    disconnectedCallback() {
      if (this[OWNED] || !this.#core) return;
      this.#leaving = true;
      nextFrame(() => { // taken out and not placed again in the same frame: its scope ends (§7.7)
        if (!this.#leaving || this.isConnected) return;
        this.#leaving = false;
        this.#end();
      });
    }

    attributeChangedCallback(name, previous, value) {
      const one = attributes.get(name);
      if (!one || previous === value) return;
      const parsed = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fromAttribute)(one.def, value);
      if (this.#core) this.#core.setSetting(name, parsed);
      else this[EARLY][name] = parsed;
    }

    /** The parent placed this element in a role: it runs the instance (§7.1.1, §7.4). */
    sfAdopt({instanceId, frame, signal}) {
      if (this.#core) return this.#core;
      this[OWNED] = true;
      const view = new HostView(this, definition, options);
      this.#core = new _core_mjs__WEBPACK_IMPORTED_MODULE_1__.AssemblyCore(definition, {instanceId, frame, view, signal, settings: {...this[EARLY]}});
      if (instances.has(instanceId)) this.#core.error('instance', `two instances have the path ${instanceId}`);
      instances.set(instanceId, this.#core);
      signal?.addEventListener('abort', () => { if (instances.get(instanceId) === this.#core) instances.delete(instanceId); }, {once: true});
      return this.#core;
    }

    #startTop() {
      let role = this.getAttribute('data-sf-role') || this.id;
      if (!role) {
        const same = [...globalThis.document.querySelectorAll(this.localName)].filter((one) => !one[OWNED]);
        role = `${this.localName}[${same.indexOf(this) + 1}]`;
        (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_3__.record)(`page/${role}`, 'warn', `an instance with neither an id nor data-sf-role takes ${role} (§7.1.1)`, {}, 'warn');
      }
      const instanceId = `page/${role}`;
      if (instances.has(instanceId) && instances.get(instanceId) !== this.#core) {
        (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_3__.record)(instanceId, 'instance', `two instances have the path ${instanceId}; the second does not start (§7.1.1)`, {}, 'error');
        this.dispatchEvent(new globalThis.CustomEvent('sf-component-error', {bubbles: true, composed: true, detail: {kind: 'instance', text: `two instances have the path ${instanceId}`, instance: instanceId}}));
        return;
      }
      const settings = {...this[EARLY]};
      for (const [name, one] of attributes) if (this.hasAttribute(name)) settings[name] = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.fromAttribute)(one.def, this.getAttribute(name));
      const host = this;
      const frame = {
        report(values, {origin} = {}) {
          if (origin === 'outside' || origin === 'start') return;
          host.dispatchEvent(new globalThis.CustomEvent('change', {bubbles: true, detail: Object.fromEntries(Object.entries(values).map(([name, value]) => [(0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.camel)(name), value]))}));
        },
        emit(verb, detail) {
          host.dispatchEvent(new globalThis.CustomEvent(`${definition.tag}-${verb}`, {bubbles: true, composed: true, detail: {...detail}}));
        },
      };
      this.#core = new _core_mjs__WEBPACK_IMPORTED_MODULE_1__.AssemblyCore(definition, {instanceId, frame, view: new HostView(this, definition, options), settings});
      instances.set(instanceId, this.#core);
      this.#core.start();
    }

    #end() {
      const core = this.#core;
      if (!core) return;
      if (instances.get(core.id) === core) instances.delete(core.id);
      core.dispose();
      this.#core = null;
      this.replaceChildren();
    }

    /** Run an action of the assembly (§4.4): `with` arrives as one object. */
    sfAct(action, args = {}) {
      if (!this.#core) return Promise.resolve({answer: 'unavailable', reason: 'not-started'});
      return Promise.resolve(this.#core.act(action, args));
    }

    act(action, args) { return this.sfAct(action, args); }
    connectPort(port) { return this.sfAct('connect-port', {port}); }
    /** The alias of connect-port (§4.1). */
    setHostPort(port) { return this.connectPort(port); }

    get layout() { return this.getAttribute('layout') ?? 'default'; }
    set layout(name) { this.#core?.view.useLayout(name); }

    /** The keys, their writers and readers (§14). */
    sfKeyMap() { return this.#core?.keyMap() ?? null; }
  }

  // Settings, values and actions as properties and methods (§4.2): camelCase, never over a native member.
  const taken = (name) => name in Base.prototype || name in SfAssembly.prototype;
  for (const {name, def, prop} of definition.settingProps) {
    if (taken(prop)) { (0,_journal_mjs__WEBPACK_IMPORTED_MODULE_3__.record)(definition.tag, 'warn', `setting "${name}" is no property: ${prop} is a member of HTMLElement`, {}, 'warn'); continue; }
    Object.defineProperty(SfAssembly.prototype, prop, {
      configurable: true,
      get() { return this.sfCore ? this.sfCore.keys[name] : (this[EARLY][name] ?? def.default ?? null); },
      set(value) {
        if (this.sfCore) this.sfCore.setSetting(name, value);
        else this[EARLY][name] = value; // read when the instance starts
      },
    });
  }
  for (const [name] of (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.own)(definition.manifest.values)) {
    const prop = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.camel)(name);
    if (taken(prop)) continue;
    Object.defineProperty(SfAssembly.prototype, prop, {configurable: true, get() { return this.sfCore?.value(name); }});
  }
  for (const [name] of (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.own)(definition.manifest.actions)) {
    const prop = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_5__.camel)(name);
    if (taken(prop)) continue;
    Object.defineProperty(SfAssembly.prototype, prop, {configurable: true, writable: true, value(args = {}) { return this.sfAct(name, args); }});
  }
  return SfAssembly;
}




/***/ },

/***/ "ff34a74152a4"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Assembly: () => (/* binding */ Assembly),
/* harmony export */   AssemblyCore: () => (/* reexport safe */ _core_mjs__WEBPACK_IMPORTED_MODULE_0__.AssemblyCore),
/* harmony export */   PART_LINK: () => (/* reexport safe */ _link_mjs__WEBPACK_IMPORTED_MODULE_4__.PART_LINK),
/* harmony export */   activity: () => (/* reexport safe */ _core_mjs__WEBPACK_IMPORTED_MODULE_0__.activity),
/* harmony export */   adaptElement: () => (/* reexport safe */ _link_mjs__WEBPACK_IMPORTED_MODULE_4__.adaptElement),
/* harmony export */   compile: () => (/* reexport safe */ _definition_mjs__WEBPACK_IMPORTED_MODULE_1__.compile),
/* harmony export */   createLink: () => (/* reexport safe */ _link_mjs__WEBPACK_IMPORTED_MODULE_4__.createLink),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   define: () => (/* binding */ define),
/* harmony export */   headlessView: () => (/* reexport safe */ _core_mjs__WEBPACK_IMPORTED_MODULE_0__.headlessView),
/* harmony export */   interfaces: () => (/* reexport safe */ _definition_mjs__WEBPACK_IMPORTED_MODULE_1__.interfaces),
/* harmony export */   journal: () => (/* reexport safe */ _journal_mjs__WEBPACK_IMPORTED_MODULE_3__.journal),
/* harmony export */   whenIdle: () => (/* reexport safe */ _core_mjs__WEBPACK_IMPORTED_MODULE_0__.whenIdle)
/* harmony export */ });
/* harmony import */ var _core_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b60c1434b0be");
/* harmony import */ var _definition_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9ee717a9c619");
/* harmony import */ var _host_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8258b7112fb6");
/* harmony import */ var _journal_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6d4272a67a74");
/* harmony import */ var _link_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("dfdb640e668b");
// SF.Assembly: the assembly runtime of standard simai.smart-component 1.3.8
// (§7 assemblies, §9 rules, §10 execution, §11.2 words a rule picks, §14 the
// journal). An assembly is defined by its manifest alone — no code of its own:
//
//   SF.Assembly.interfaces.registerAll(registry.parts);   // the parts' interfaces
//   SF.Assembly.define(manifest, {layouts: {default: html}, lang: {ru: words}});
//   document.body.append(document.createElement(manifest.tag));
//
// Its parts are any custom elements with a declared interface: the runtime
// does not depend on the Smart base class (link.mjs). The state that must be
// one per page — definitions, instances, interfaces, the journal, activity —
// lives on the shared global, so every bundle that carries this module meets
// the same registry.







/**
 * Define an assembly from its manifest. `options.layouts` maps a layout name
 * to its HTML; `options.lang` a locale to its language file; `options.loadPart`
 * fetches a part's module when the part starts (the Loader by default).
 */
function define(manifest, options = {}) {
  const tag = String(manifest?.tag ?? '').toLowerCase();
  if (_host_mjs__WEBPACK_IMPORTED_MODULE_2__.definitions.has(tag)) return _host_mjs__WEBPACK_IMPORTED_MODULE_2__.definitions.get(tag);
  const definition = (0,_definition_mjs__WEBPACK_IMPORTED_MODULE_1__.compile)(manifest, options);
  _host_mjs__WEBPACK_IMPORTED_MODULE_2__.definitions.set(tag, definition);
  const registry = globalThis.customElements;
  if (registry && typeof globalThis.HTMLElement === 'function' && !registry.get(tag)) registry.define(tag, (0,_host_mjs__WEBPACK_IMPORTED_MODULE_2__.elementClass)(definition, options));
  return definition;
}

const Assembly = Object.freeze({
  define,
  defined: (tag) => _host_mjs__WEBPACK_IMPORTED_MODULE_2__.definitions.get(String(tag).toLowerCase()) ?? null,
  interfaces: _definition_mjs__WEBPACK_IMPORTED_MODULE_1__.interfaces,
  journal: _journal_mjs__WEBPACK_IMPORTED_MODULE_3__.journal,
  /** Turn the journal on or off whatever the page says (§14); `null` follows the page. */
  debug: (on = true) => { _journal_mjs__WEBPACK_IMPORTED_MODULE_3__.journal.force(on); return _journal_mjs__WEBPACK_IMPORTED_MODULE_3__.journal.on; },
  activity: _core_mjs__WEBPACK_IMPORTED_MODULE_0__.activity,
  whenIdle: _core_mjs__WEBPACK_IMPORTED_MODULE_0__.whenIdle,
  /** A running instance by its role path (§7.1.1). */
  instance: (path) => _host_mjs__WEBPACK_IMPORTED_MODULE_2__.instances.get(path) ?? null,
  instances: () => [..._host_mjs__WEBPACK_IMPORTED_MODULE_2__.instances.keys()],
  PART_LINK: _link_mjs__WEBPACK_IMPORTED_MODULE_4__.PART_LINK,
  adaptElement: _link_mjs__WEBPACK_IMPORTED_MODULE_4__.adaptElement,
  createLink: _link_mjs__WEBPACK_IMPORTED_MODULE_4__.createLink,
  compile: _definition_mjs__WEBPACK_IMPORTED_MODULE_1__.compile,
  AssemblyCore: _core_mjs__WEBPACK_IMPORTED_MODULE_0__.AssemblyCore,
  headlessView: _core_mjs__WEBPACK_IMPORTED_MODULE_0__.headlessView,
});

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Assembly) globalThis.SF.Assembly = Assembly;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Assembly);



/***/ },

/***/ "6d4272a67a74"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   journal: () => (/* binding */ journal),
/* harmony export */   journalOn: () => (/* binding */ journalOn),
/* harmony export */   record: () => (/* binding */ record)
/* harmony export */ });
// The debugging journal of every bus (standard simai.smart-component 1.3.8
// §14). In development mode — `?sf-debug` in the address, `data-sf-debug` on
// <html> (the Loader's switch) or `SF_BOOT_CONFIG.debug.scope` — every turn,
// rule, step, host answer, write and crossing of the frame is recorded as one
// entry. Nothing is recorded in production; errors still reach the page as the
// base event `sf-component-error` on the host that met them (§4.1).
//
// The store lives on the shared global, like SF.language's: every bundle that
// carries a copy of this module records into the one journal.

const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfAssemblyJournal';
  if (!root[key]) root[key] = {entries: [], listeners: new Set(), seq: 0, forced: null, limit: 5000};
  return root[key];
})();

/** Whether the journal records: development mode only (§14). */
function journalOn() {
  if (STORE.forced !== null) return STORE.forced;
  const root = globalThis;
  if (root.SF_BOOT_CONFIG?.debug?.scope) return true;
  try {
    if (new globalThis.URLSearchParams(root.location?.search || '').has('sf-debug')) return true;
  } catch {
    // no address: Node, a worker
  }
  return Boolean(root.document?.documentElement?.hasAttribute?.('data-sf-debug'));
}

/**
 * Record one entry: `{seq, time, instance, kind, level, text, …data}`.
 * Returns the entry, or null when the journal is off.
 */
function record(instance, kind, text, data = {}, level = 'info') {
  if (!journalOn()) return null;
  const entry = {seq: ++STORE.seq, time: Date.now(), instance: instance ?? 'page', kind, level, text, ...data};
  STORE.entries.push(entry);
  if (STORE.entries.length > STORE.limit) STORE.entries.splice(0, STORE.entries.length - STORE.limit);
  for (const listener of [...STORE.listeners]) {
    try {
      listener(entry);
    } catch {
      // a listener that throws does not stop the journal
    }
  }
  return entry;
}

const journal = {
  /** Turn the journal on or off whatever the page says; `null` follows the page again. */
  force(on) { STORE.forced = on === null || on === undefined ? null : Boolean(on); return this; },
  get on() { return journalOn(); },
  /** The entries, optionally of one instance (its path, or a path prefix ending with `/`). */
  entries(instance) {
    if (!instance) return [...STORE.entries];
    return STORE.entries.filter((entry) => entry.instance === instance || (instance.endsWith('/') && entry.instance.startsWith(instance)));
  },
  /** The journal as JSON (§14 «exports as JSON»). */
  export(instance) { return JSON.stringify(this.entries(instance)); },
  /** The keys of an instance as they were after a journal entry: the time machine (§14). */
  keysAt(instance, seq) {
    let found = null;
    for (const entry of STORE.entries) {
      if (entry.seq > seq) break;
      if (entry.instance === instance && entry.kind === 'commit' && entry.snapshot) found = entry.snapshot;
    }
    return found ? JSON.parse(found) : null;
  },
  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    STORE.listeners.add(listener);
    return () => STORE.listeners.delete(listener);
  },
  clear() { STORE.entries.length = 0; return this; },
  /** How many entries are kept before the oldest are dropped. */
  limit(count) { STORE.limit = Math.max(100, Number(count) || 5000); return this; },
};


/***/ },

/***/ "dfdb640e668b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFINITION_WAIT_MS: () => (/* binding */ DEFINITION_WAIT_MS),
/* harmony export */   PART_LINK: () => (/* binding */ PART_LINK),
/* harmony export */   adaptElement: () => (/* binding */ adaptElement),
/* harmony export */   assemblyLink: () => (/* binding */ assemblyLink),
/* harmony export */   createLink: () => (/* binding */ createLink),
/* harmony export */   domNames: () => (/* binding */ domNames)
/* harmony export */ });
/* harmony import */ var _values_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8cf8ac8cb59d");
// How a part joins an assembly (standard simai.smart-component 1.3.8 §4, §7.2).
//
// The runtime never depends on a part's base class. It talks to a part through
// a link with six members:
//
//   set(name, value)                 a setting, or a value writable as one (§4)
//   get(name)                        a value the part holds
//   act(action, args, {signal})      an action; answers an outcome (§4.4)
//   connectPort(port)                the port it declares (§4.9)
//   start()                          the assembly started it (§7.2.1)
//   dispose()                        its scope ended (§7.7)
//
// and the part answers through the context the runtime gives it: `report`
// for its values, `emit` for its events, `word` for its words, `signal` for its
// scope.
//
// A part that speaks this protocol itself returns its link from
// `element[PART_LINK](context)`. Every other element — the SIMAI Framework's
// components today — is wired by `adaptElement` from its declared interface:
// settings as properties (lists and objects) or attributes, values read from
// its properties, events as DOM events (`<tag>-<verb>`, or the native name for
// a native event, §8), actions as its methods.



const PART_LINK = Symbol.for('sf.assembly.part-link');

/** How long an action waits for a part whose module has not arrived (the quality profile's slot wait, §4.5.1). */
const DEFINITION_WAIT_MS = 1500;

const RE_READ = ['change', 'input', 'sf-props-change'];

/** The DOM names of a declared event: the native name, or `<tag>-<verb>` and its dated aliases (§8). */
function domNames(tag, verb, def = {}) {
  if (def.carries === 'native') return [verb];
  return [def.dom ?? `${tag}-${verb}`, ...(Array.isArray(def.aliases) ? def.aliases : [])];
}

/** A link for any element: its own, or one adapted from its interface; deferred until its tag is defined. */
function createLink(element, iface, context) {
  const registry = globalThis.customElements;
  const tag = element.localName;
  if (!registry || registry.get(tag)) return linkOf(element, iface, context);
  return lateLink(element, iface, context, registry);
}

function linkOf(element, iface, context) {
  if (typeof element[PART_LINK] === 'function') return element[PART_LINK](context);
  return adaptElement(element, iface, context);
}

/** A link that queues what it is told until the part's module arrives (§7.2.1: the module is fetched on start). */
function lateLink(element, iface, context, registry) {
  let real = null;
  let started = false;
  let port = null;
  const settings = new Map();
  const tag = element.localName;
  const ready = registry.whenDefined(tag).then(() => {
    if (context.signal.aborted) return null;
    registry.upgrade?.(element);
    real = linkOf(element, iface, context);
    for (const [name, value] of settings) real.set(name, value);
    settings.clear();
    if (port) real.connectPort?.(port);
    if (started) real.start?.();
    return real;
  });
  return {
    set(name, value) { if (real) real.set(name, value); else settings.set(name, value); },
    get(name) { return real ? real.get(name) : undefined; },
    valid() { return real?.valid?.(); },
    act(action, args, options = {}) {
      if (real) return real.act(action, args, options);
      return new Promise((resolve) => {
        const timer = globalThis.setTimeout(() => resolve({answer: 'unavailable', reason: 'not-defined', message: ''}), DEFINITION_WAIT_MS);
        ready.then((link) => {
          globalThis.clearTimeout(timer);
          resolve(link ? link.act(action, args, options) : {answer: 'cancelled', reason: 'removed'});
        });
      });
    },
    connectPort(given) { if (real) real.connectPort?.(given); else port = given; },
    start() { if (real) real.start?.(); else started = true; },
    dispose() { real?.dispose?.(); },
  };
}

/** The interface adapter for today's components (§4): attributes, properties, DOM events, methods. */
function adaptElement(element, iface, context) {
  const signal = context.signal;
  const known = new Map();
  const values = Object.keys(iface.values ?? {});
  const tag = element.localName;

  const readValues = (origin = null) => {
    let changes = null;
    for (const name of values) {
      const value = element[(0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.camel)(name)];
      if (value === undefined || (known.has(name) && (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.same)(known.get(name), value))) continue;
      known.set(name, value);
      (changes ??= {})[name] = value;
    }
    if (changes) context.report(changes, {origin});
  };

  const heard = new Set();
  for (const [verb, def] of Object.entries(iface.events ?? {})) {
    for (const name of domNames(tag, verb, def)) {
      heard.add(name);
      element.addEventListener(name, (event) => {
        if (event.target !== element) return; // an event of a component inside the part is not the part's
        readValues();
        const detail = def.carries === 'native' || !(0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.isObject)(event.detail) ? {} : event.detail;
        context.emit(verb, detail, {cancel: event.cancelable ? () => event.preventDefault() : null});
      }, {signal});
    }
  }
  if (values.length) {
    for (const name of RE_READ) {
      if (heard.has(name)) continue;
      element.addEventListener(name, (event) => { if (event.target === element) readValues(); }, {signal});
    }
  }

  const write = (name, value) => {
    const def = iface.settings?.[name] ?? iface.values?.[name];
    const prop = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.camel)(name);
    const type = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.typeOf)(def);
    if (name in (iface.values ?? {})) known.set(name, value); // a value set from outside is not reported back (§8)
    if (type === 'list' || type === 'object' || prop in element) { element[prop] = value; return; }
    if (value === null || value === undefined) { element.removeAttribute(name); return; }
    if (type === 'boolean') {
      if (value === true) element.setAttribute(name, '');
      else if (def?.optional) element.setAttribute(name, 'false');
      else element.removeAttribute(name);
      return;
    }
    element.setAttribute(name, String(value));
  };

  return {
    set: write,
    get: (name) => element[(0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.camel)(name)],
    valid: () => (element.validity ? element.validity.valid : undefined),
    act(action, args = {}, options = {}) {
      if (action === 'connect-port') { this.connectPort(args?.port ?? args); return {answer: 'applied'}; }
      const method = element[(0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.camel)(action)];
      if (typeof method !== 'function') {
        if (action === 'focus' || action === 'blur') { element[action]?.(); return {answer: 'applied'}; }
        return {answer: 'refused', reason: 'no-action', message: ''};
      }
      let given = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.isObject)(args) ? args : {};
      // §11.2: a part asked with a code says the assembly's word for it; today's components take text.
      // The word by code wins over the host's message; the message is said only when the code has no word
      // (dispatcher decision 2026-10-27).
      if (typeof given.code === 'string') {
        const word = context.word(`words.${given.code}`, given.count);
        if (word !== null) given = {...given, text: word};
      }
      const answer = method.call(element, given, {signal: options.signal});
      return answer && typeof answer.then === 'function' ? answer.then(_values_mjs__WEBPACK_IMPORTED_MODULE_0__.outcomeOf) : (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.outcomeOf)(answer);
    },
    connectPort(port) {
      const connect = element.connectPort ?? element.setHostPort;
      if (typeof connect === 'function') connect.call(element, port);
    },
    start: () => readValues('start'), // the part's first values are not a person's change (§8)
    dispose() {},
  };
}

/** The link to a nested assembly: an ordinary part (§7.4). */
function assemblyLink(core) {
  return {
    set: (name, value) => { core.setSetting(name, value); },
    get: (name) => core.value(name),
    valid: () => (core.keys.valid === false ? false : undefined),
    act: (action, args, options = {}) => core.act(action, args, options),
    connectPort: (port) => { core.connectPort(port); },
    start: () => { core.start(); },
    dispose: () => { core.dispose(); },
  };
}


/***/ },

/***/ "eb7fe3498c26"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPERATIONS: () => (/* binding */ OPERATIONS),
/* harmony export */   OUTCOME_FIELDS: () => (/* binding */ OUTCOME_FIELDS),
/* harmony export */   READINGS: () => (/* binding */ READINGS),
/* harmony export */   createReader: () => (/* binding */ createReader),
/* harmony export */   isCondition: () => (/* binding */ isCondition),
/* harmony export */   keysOf: () => (/* binding */ keysOf)
/* harmony export */ });
/* harmony import */ var _values_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8cf8ac8cb59d");
// Readings and conditions of a rule (standard simai.smart-component 1.3.8
// §9): the closed lists a rule, a derived key (§7.1.2) and a role's `if`
// are built from. There are no expressions, no string building and no
// functions: a reading is data, and this file only walks it.



const READINGS = Object.freeze(['from', 'key', 'value', 'entry', 'new', 'object', 'sum', 'difference', 'product', 'count', 'choose', 'outcome']);
const OPERATIONS = Object.freeze(['eq', 'ne', 'gt', 'lt', 'has', 'filled', 'empty', 'yes', 'no']);
const OUTCOME_FIELDS = Object.freeze(['answer', 'reason', 'message']);

const isCondition = (node) => (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.isObject)(node) && ('op' in node || 'all' in node || 'any' in node);

const filled = (value) => !(value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0));

/**
 * A reader over one context. The context gives what a reading may look at:
 *   key(name)       a key, the turn's pending writes first (§10.2)
 *   from            what the event carries
 *   entry           the entry whose part sent the event (§7.2.3)
 *   outcome         the outcome that ended the rule, inside `otherwise` only
 *   fail(text)      a reading that is not one
 * and returns `read(reading)` and `test(condition)`.
 */
function createReader(context) {
  const fail = context.fail ?? (() => {});
  const numbers = (list) => {
    if (!Array.isArray(list)) { fail(`${JSON.stringify(list)} is not a list of readings`); return null; }
    const got = list.map(read);
    if (got.some((n) => n === null || n === undefined)) return null; // an unset operand gives null (§9)
    const numeric = got.map(Number);
    return numeric.some((n) => !Number.isFinite(n)) ? null : numeric;
  };

  function read(reading) {
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.isObject)(reading)) { fail(`${JSON.stringify(reading)} is not a reading`); return undefined; }
    if (isCondition(reading)) return test(reading); // a condition stands wherever a boolean is read
    if ('value' in reading) return reading.value;
    if ('key' in reading) {
      const [head, ...path] = String(reading.key).split('.');
      const value = context.key(head);
      return path.length ? (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.at)(value, path.join('.')) : value;
    }
    if ('from' in reading) return (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.at)(context.from, reading.from);
    if ('entry' in reading) return context.entry ? (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.at)(context.entry, reading.entry) : undefined;
    if ('new' in reading) return (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.freshId)();
    if ('object' in reading) {
      const out = {};
      for (const [field, inner] of Object.entries(reading.object ?? {})) if (field !== '$comment') out[field] = read(inner);
      return out;
    }
    if ('sum' in reading) { const n = numbers(reading.sum); return n && n.reduce((a, b) => a + b, 0); }
    if ('product' in reading) { const n = numbers(reading.product); return n && n.reduce((a, b) => a * b, 1); }
    if ('difference' in reading) {
      const n = numbers(reading.difference);
      if (n && n.length !== 2) { fail('difference takes two readings'); return null; }
      return n && n[0] - n[1];
    }
    if ('count' in reading) { const list = read(reading.count); return Array.isArray(list) ? list.length : 0; }
    if ('choose' in reading) return test(reading.choose) ? read(reading.then) : read(reading.else);
    if ('outcome' in reading) {
      if (!context.outcome) { fail(`{"outcome": "${reading.outcome}"} is read outside otherwise`); return undefined; }
      if (!OUTCOME_FIELDS.includes(reading.outcome)) { fail(`"${reading.outcome}" is not a field of an outcome`); return undefined; }
      return context.outcome[reading.outcome] ?? '';
    }
    fail(`${JSON.stringify(reading)} is not a reading`);
    return undefined;
  }

  function test(condition) {
    if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.isObject)(condition)) { fail(`${JSON.stringify(condition)} is not a condition`); return false; }
    if (Array.isArray(condition.all)) return condition.all.every(test);
    if (Array.isArray(condition.any)) return condition.any.some(test);
    const left = read(condition.left);
    const right = condition.right === undefined ? undefined : read(condition.right);
    switch (condition.op) {
      case 'eq': return (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.same)(left ?? null, right ?? null);
      case 'ne': return !(0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.same)(left ?? null, right ?? null);
      case 'gt': return left !== null && left !== undefined && right !== null && right !== undefined && left > right;
      case 'lt': return left !== null && left !== undefined && right !== null && right !== undefined && left < right;
      case 'has':
        if (Array.isArray(left)) return left.some((one) => (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.same)(one, right));
        return typeof left === 'string' && right !== null && right !== undefined && left.includes(String(right));
      case 'filled': return filled(left);
      case 'empty': return !filled(left);
      case 'yes': return left === true;
      case 'no': return left === false;
      default: fail(`op "${condition.op}" is not an operation`); return false;
    }
  }

  return {read, test};
}

/** The keys a reading or a condition reads: the dependencies of a derived key (§7.1.2). */
function keysOf(node, into = new Set()) {
  if (Array.isArray(node)) { for (const one of node) keysOf(one, into); return into; }
  if (!(0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.isObject)(node)) return into;
  if (Array.isArray(node.all) || Array.isArray(node.any)) return keysOf(node.all ?? node.any, into);
  if ('op' in node) return keysOf([node.left, node.right], into);
  if ('value' in node) return into; // a constant reads nothing
  if (typeof node.key === 'string') into.add(node.key.split('.')[0]);
  else if ((0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.isObject)(node.object)) keysOf(Object.values(node.object), into);
  else if ('choose' in node) keysOf([node.choose, node.then, node.else], into);
  else for (const kind of ['sum', 'difference', 'product', 'count']) if (kind in node) keysOf(node[kind], into);
  return into;
}


/***/ },

/***/ "8cf8ac8cb59d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANSWERS: () => (/* binding */ ANSWERS),
/* harmony export */   BASE_ACTIONS: () => (/* binding */ BASE_ACTIONS),
/* harmony export */   CAUSE_CHAIN_DEPTH: () => (/* binding */ CAUSE_CHAIN_DEPTH),
/* harmony export */   STATES: () => (/* binding */ STATES),
/* harmony export */   WRITE_VERBS: () => (/* binding */ WRITE_VERBS),
/* harmony export */   at: () => (/* binding */ at),
/* harmony export */   camel: () => (/* binding */ camel),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   fits: () => (/* binding */ fits),
/* harmony export */   freshId: () => (/* binding */ freshId),
/* harmony export */   fromAttribute: () => (/* binding */ fromAttribute),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   outcomeOf: () => (/* binding */ outcomeOf),
/* harmony export */   own: () => (/* binding */ own),
/* harmony export */   same: () => (/* binding */ same),
/* harmony export */   show: () => (/* binding */ show),
/* harmony export */   typeOf: () => (/* binding */ typeOf)
/* harmony export */ });
// The values an assembly holds: the types of standard simai.smart-component
// 1.3.8 §4.2 and §7.1, and the small helpers every other module of the
// assembly runtime shares. No DOM here: the whole file runs in Node as well.

/** The data states a key of type `state` holds (§7.1). */
const STATES = Object.freeze(['idle', 'loading', 'ready', 'empty', 'error', 'refused', 'unavailable']);

/** The verbs that write to the host (vocabulary 1.1.5 §5.3). */
const WRITE_VERBS = new Set([
  'save', 'delete', 'create', 'rename', 'archive', 'restore', 'move', 'apply',
  'submit', 'retry', 'attach', 'detach', 'answer', 'rate', 'read',
]);

/** The answers a waiting step can give (§10.3, vocabulary §3.1). */
const ANSWERS = Object.freeze(['applied', 'conflict', 'refused', 'unavailable', 'cancelled']);

/** The cause chain limit of the quality profile (`runtime.cause_chain_depth`, §10.5). */
const CAUSE_CHAIN_DEPTH = 32;

/** The base actions every element has (§4.1). */
const BASE_ACTIONS = new Set(['focus', 'blur', 'connect-port']);

const typeOf = (def) => (typeof def === 'string' ? def : def?.type);

/** `page-size` → `pageSize`: the property of a setting or a value (§4.2). */
const camel = (name) => String(name).replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** The entries of a manifest object, without `$comment` and the tools' `x-` fields (§3.3). */
function own(object) {
  if (!object || typeof object !== 'object') return [];
  return Object.entries(object).filter(([name]) => name !== '$comment' && !name.startsWith('x-'));
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/** Whether a value fits a declared type; unset (null, undefined) always fits (§4.2). */
function fits(def, value) {
  if (value === null || value === undefined) return true;
  const type = typeOf(def);
  switch (type) {
    case 'string': case 'icon': case 'date': return typeof value === 'string';
    case 'id': return typeof value === 'string' || Number.isInteger(value);
    case 'enum': return !def?.values || def.values.includes(value);
    case 'boolean': return typeof value === 'boolean';
    case 'number': return typeof value === 'number' && Number.isFinite(value);
    case 'list': return Array.isArray(value);
    case 'object': return isObject(value);
    case 'state': return STATES.includes(value);
    default: return true;
  }
}

/** Structural equality of data: «an equal value is not passed again» (§7.2, §10.5). */
function same(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return Number.isNaN(a) && Number.isNaN(b);
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) if (!same(a[i], b[i])) return false;
    return true;
  }
  if (Array.isArray(b)) return false;
  const left = Object.keys(a);
  if (left.length !== Object.keys(b).length) return false;
  for (const name of left) if (!Object.prototype.hasOwnProperty.call(b, name) || !same(a[name], b[name])) return false;
  return true;
}

/** A copy of data, so a key's initial value is never shared between instances. */
function clone(value) {
  if (value === null || typeof value !== 'object') return value;
  return typeof globalThis.structuredClone === 'function' ? globalThis.structuredClone(value) : JSON.parse(JSON.stringify(value));
}

/** A field of a value along a dotted path (`answer.accepted`, `query.search`). */
function at(value, path) {
  let current = value;
  for (const step of String(path).split('.')) {
    if (current === null || current === undefined) return undefined;
    current = current[step];
  }
  return current;
}

/** A short form of a value for the journal. */
function show(value) {
  if (Array.isArray(value)) return `[${value.length}]`;
  if (value === undefined) return 'undefined';
  try {
    const text = JSON.stringify(value);
    return text.length > 80 ? `${text.slice(0, 77)}…` : text;
  } catch {
    return String(value);
  }
}

/** The value of an attribute read as a declared type (§4.2: the attribute form of a boolean is absent / present / "false"). */
function fromAttribute(def, raw) {
  if (raw === null) return typeOf(def) === 'boolean' && !def?.optional ? false : null;
  switch (typeOf(def)) {
    case 'boolean': return raw !== 'false';
    case 'number': {
      if (raw.trim() === '') return null;
      const number = Number(raw);
      return Number.isFinite(number) ? number : null;
    }
    default: return raw;
  }
}

/** A fresh id for a new entry: unique on the page, never a counter (§9 `new`, §7.1.1). */
function freshId() {
  const crypto = globalThis.crypto;
  if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto?.getRandomValues === 'function') crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** An outcome in its one shape `{answer, reason, message, …}` (§4.4, vocabulary §3.1). */
function outcomeOf(value) {
  if (value === undefined || value === null || value === true) return {answer: 'applied'};
  if (value === false) return {answer: 'refused', reason: '', message: ''};
  if (typeof value === 'string') return ANSWERS.includes(value) ? {answer: value} : {answer: 'applied'};
  if (isObject(value) && typeof value.answer === 'string') {
    return ANSWERS.includes(value.answer) ? value : {...value, answer: 'refused', reason: value.reason ?? 'unknown-answer'};
  }
  return {answer: 'applied'};
}


/***/ },

/***/ "ff707ab72ad6"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createWords: () => (/* binding */ createWords),
/* harmony export */   say: () => (/* binding */ say)
/* harmony export */ });
/* harmony import */ var _values_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8cf8ac8cb59d");
// The words of an assembly (standard simai.smart-component 1.3.8 §11): its
// language files, `lang/<locale>.json`, keyed by locale. A rule passes codes
// and numbers, never words (§9); the words a part says because of a rule are
// `roles.<role>.words.<code>`, a word or plural forms with `{n}` (§11.2); a
// role's constant word settings are `roles.<role>.settings.<setting>` (§7.2);
// the words of a constant list's entries are `roles.<role>.items.<value>` and
// `roles.<role>.columns.<key>` (§11.3).
//
// Missing words fall back to English, then to the source language, then to
// nothing; the last two are reported (§11.1).



const PLURALS = new Map();
const NUMBERS = new Map();

const normalise = (locale) => String(locale ?? '').trim().toLowerCase().replace('_', '-');

function plural(locale) {
  if (!PLURALS.has(locale)) {
    let rules = null;
    try { rules = new Intl.PluralRules(locale); } catch { rules = new Intl.PluralRules('en'); }
    PLURALS.set(locale, rules);
  }
  return PLURALS.get(locale);
}

function number(locale, n) {
  if (!NUMBERS.has(locale)) {
    let format = null;
    try { format = new Intl.NumberFormat(locale); } catch { format = new Intl.NumberFormat('en'); }
    NUMBERS.set(locale, format);
  }
  return NUMBERS.get(locale).format(n);
}

/** A word, or plural forms chosen by `n` in `locale`, with `{n}` in the page's number format (§11.1, §11.2). */
function say(word, n, locale = 'en') {
  if (word === null || word === undefined) return null;
  let text = word;
  if (typeof word === 'object') {
    const count = Number(n ?? 0);
    const form = n === 0 && word.zero !== undefined ? 'zero' : plural(locale).select(Number.isFinite(count) ? count : 0);
    text = word[form] ?? word.other;
    if (text === undefined) return null;
  }
  text = String(text);
  if (n === undefined || n === null || !text.includes('{n}')) return text;
  const count = Number(n);
  return text.split('{n}').join(Number.isFinite(count) ? number(locale, count) : String(n));
}

/**
 * The words of one assembly. `files` is `{<locale>: <language file>}`;
 * `source` is the language the assembly was written in (its first file when
 * not given).
 */
function createWords(files = {}, source = null) {
  const byLocale = new Map(Object.entries(files ?? {}).map(([locale, file]) => [normalise(locale), file]));
  const sourceLocale = normalise(source ?? byLocale.keys().next().value ?? 'en');

  /** `{word, from}` for a dotted path: `from` is the locale it came from, or null. */
  function find(locale, path) {
    const wanted = normalise(locale) || 'en';
    const order = [];
    for (const candidate of [wanted, wanted.split('-')[0], 'en', sourceLocale]) if (candidate && !order.includes(candidate)) order.push(candidate);
    for (const candidate of order) {
      const word = (0,_values_mjs__WEBPACK_IMPORTED_MODULE_0__.at)(byLocale.get(candidate), path);
      if (word !== undefined && word !== null) return {word, from: candidate, fallback: candidate !== wanted && candidate !== wanted.split('-')[0] && candidate !== 'en'};
    }
    return {word: null, from: null, fallback: true};
  }

  return {
    locales: () => [...byLocale.keys()],
    source: sourceLocale,
    find,
    /** The word at `path` said in `locale` with the number `n`; null when there is none. */
    text(locale, path, n) {
      const {word} = find(locale, path);
      return say(word, n, normalise(locale) || 'en');
    },
  };
}


/***/ },

/***/ "08e5033c490a"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_EDITOR_MANIFESTS: () => (/* binding */ BUILTIN_EDITOR_MANIFESTS),
/* harmony export */   BUILTIN_PORT_MANIFESTS: () => (/* binding */ BUILTIN_PORT_MANIFESTS),
/* harmony export */   BUILTIN_TYPE_MANIFESTS: () => (/* binding */ BUILTIN_TYPE_MANIFESTS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("68efac8c1b57");
/* harmony import */ var _schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ac24888e7d3e");



const inlineContentSchema = {
  type: 'array',
  items: {
    oneOf: [
      {
        type: 'object',
        required: ['type', 'value'],
        additionalProperties: false,
        properties: {
          type: { const: 'text' },
          value: { type: 'string', maxLength: 100000 },
          marks: {
            type: 'array',
            uniqueItems: true,
            items: { enum: ['strong', 'em', 'code'] },
          },
        },
      },
      {
        type: 'object',
        required: ['type', 'href', 'children'],
        additionalProperties: false,
        properties: {
          type: { const: 'link' },
          href: { type: 'string', minLength: 1, maxLength: 2048 },
          children: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['type', 'value'],
              additionalProperties: false,
              properties: {
                type: { const: 'text' },
                value: { type: 'string', maxLength: 100000 },
                marks: {
                  type: 'array',
                  uniqueItems: true,
                  items: { enum: ['strong', 'em', 'code'] },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const routeEnd = {
          type: 'object',
          required: ['endpoint', 'port'],
          additionalProperties: false,
          properties: {
            endpoint: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,31}$' },
            port: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,31}$' },
          },
        };

const emptyObjectSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {},
};

const BUILTIN_TYPE_MANIFESTS = Object.freeze([
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.type-manifest', 1),
    type: 'layout.page',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: emptyObjectSchema,
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {
      default: { min: 0, max: 500, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.page' },
    assets: [],
    capabilities: ['html'],
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.type-manifest', 1),
    type: 'layout.section',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: emptyObjectSchema,
    presentation: {
      views: ['default'],
      presets: ['surface', 'contrast'],
      modifiers: ['contained', 'spacious'],
    },
    slots: {
      default: { min: 0, max: 500, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.section' },
    assets: [],
    capabilities: ['html'],
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.type-manifest', 1),
    type: 'layout.columns',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        columns: { type: 'integer', minimum: 1, maximum: 12 },
      },
    },
    presentation: { views: ['default'], presets: [], modifiers: ['equal', 'responsive'] },
    slots: {
      columns: { min: 1, max: 12, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.columns' },
    assets: ['composition/layout'],
    capabilities: ['html'],
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.type-manifest', 1),
    type: 'content.heading',
    version: '1.0.0',
    category: 'content',
    mode: 'leaf',
    profiles: ['ui-layout', 'structured-content'],
    data_schema: {
      type: 'object',
      required: ['content'],
      additionalProperties: false,
      properties: {
        level: { type: 'integer', minimum: 1, maximum: 6 },
        content: inlineContentSchema,
      },
    },
    props_schema: emptyObjectSchema,
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {},
    renderer: { kind: 'builtin', name: 'content.heading' },
    assets: [],
    capabilities: ['html', 'rich-text'],
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.type-manifest', 1),
    type: 'content.paragraph',
    version: '1.0.0',
    category: 'content',
    mode: 'leaf',
    profiles: ['ui-layout', 'structured-content'],
    data_schema: {
      type: 'object',
      required: ['content'],
      additionalProperties: false,
      properties: { content: inlineContentSchema },
    },
    props_schema: emptyObjectSchema,
    presentation: { views: ['default'], presets: [], modifiers: ['lead', 'muted'] },
    slots: {},
    renderer: { kind: 'builtin', name: 'content.paragraph' },
    assets: [],
    capabilities: ['html', 'rich-text'],
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.type-manifest', 1),
    type: 'layout.regions',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: emptyObjectSchema,
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {
      regions: { min: 1, max: 12, types: ['layout.region'] },
    },
    renderer: { kind: 'builtin', name: 'layout.regions' },
    assets: [],
    capabilities: ['html', 'regions'],
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.type-manifest', 1),
    type: 'layout.region',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: {
      type: 'object',
      required: ['name', 'landmark'],
      additionalProperties: false,
      properties: {
        name: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,31}$' },
        landmark: { enum: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_LANDMARKS] },
        placement: { enum: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_PLACEMENTS] },
        label: { type: 'string', minLength: 1, maxLength: 120 },
        sticky: { type: 'boolean' },
        accepts: { type: 'array', minItems: 1, uniqueItems: true, items: { enum: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_ACCEPTS] } },
        min_items: { type: 'integer', minimum: 0, maximum: 500 },
        max_items: { type: 'integer', minimum: 0, maximum: 500 },
      },
    },
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {
      default: { min: 0, max: 500, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.region' },
    assets: [],
    capabilities: ['html', 'regions'],
  },  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.type-manifest', 1),
    type: 'layout.scope',
    version: '1.0.0',
    category: 'layout',
    mode: 'composite',
    profiles: ['ui-layout'],
    data_schema: emptyObjectSchema,
    props_schema: {
      type: 'object',
      required: ['routes'],
      additionalProperties: false,
      properties: {
        routes: {
          type: 'array',
          minItems: 1,
          maxItems: 32,
          items: {
            type: 'object',
            required: ['id', 'from', 'to'],
            additionalProperties: false,
            properties: {
              id: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,63}$' },
              from: routeEnd,
              to: routeEnd,
            },
          },
        },
      },
    },
    presentation: { views: ['default'], presets: [], modifiers: [] },
    slots: {
      default: { min: 1, max: 500, categories: ['layout', 'content', 'smart'] },
    },
    renderer: { kind: 'builtin', name: 'layout.scope' },
    assets: [],
    capabilities: ['html', 'hydration', 'routing'],
  },
]);

// Published typed ports. Framework owns the element protocol; the product owns
// what a request means, data access and authorization.
//
// sf-table answers this port and lives with Larena, its owner, since 2026-10-11
// (the component folder in simai/larena-ui, package larena). The port stays
// here: it is a public contract of the free Framework (composition-ports.v1.json,
// the routing contract lock), and the package's tests read it from this file in
// their overlay of ui-source.
const BUILTIN_PORT_MANIFESTS = Object.freeze([
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.port-manifest', 1),
    element: 'sf-table',
    version: '1.0.0',
    component: 'smart.data-view',
    component_version: '1.2.0',
    outputs: {
      selection: {
        value: 'record-ids.v1',
        summary: 'Explicit current-result selection of this instance, emitted once per change, including clearing.',
      },
    },
    inputs: {
      context: {
        value: 'record-ids.v1',
        effect: 'request',
        summary: 'Restricts this collection to records related to the given identities. The table clears its selection, enters loading and emits sf-table-query-intent with the route sequence; the host resolves the relation and access and answers with applyQueryResult.',
        request_event: 'sf-table-query-intent',
        result_method: 'applyQueryResult',
      },
    },
  },
]);



const BUILTIN_EDITOR_MANIFESTS = Object.freeze([
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-manifest', 1),
    type: 'layout.section',
    type_version: '1.0.0',
    fields: [
      {
        key: 'surface',
        plane: 'presentation',
        target: 'preset',
        property: { type: 'string', version: 2 },
        constraints: { min_length: 1, max_length: 32 },
        group: 'preset',
        visibility: 'visible',
        choices: ['surface', 'contrast'],
        default: 'surface',
        label_key: 'sf.composition.layout_section.surface',
        help_key: 'sf.composition.layout_section.surface_help',
        capability_hints: ['composition.presentation.preset'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
    ],
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-manifest', 1),
    type: 'layout.columns',
    type_version: '1.0.0',
    fields: [
      {
        key: 'columns',
        plane: 'props',
        target: 'columns',
        property: { type: 'integer', version: 1 },
        constraints: { min: 1, max: 12 },
        group: 'basic',
        visibility: 'visible',
        default: 2,
        label_key: 'sf.composition.layout_columns.columns',
        help_key: 'sf.composition.layout_columns.columns_help',
        capability_hints: ['composition.props.columns'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
    ],
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-manifest', 1),
    type: 'content.heading',
    type_version: '1.0.0',
    fields: [
      {
        key: 'level',
        plane: 'data',
        target: 'level',
        property: { type: 'integer', version: 1 },
        constraints: { min: 1, max: 6 },
        group: 'advanced',
        visibility: 'collapsed',
        default: 2,
        label_key: 'sf.composition.content_heading.level',
        help_key: 'sf.composition.content_heading.level_help',
        capability_hints: ['composition.data.level'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
    ],
  },  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-manifest', 1),
    type: 'layout.region',
    type_version: '1.0.0',
    fields: [
      {
        key: 'placement',
        plane: 'props',
        target: 'placement',
        property: { type: 'string', version: 2 },
        constraints: { min_length: 1, max_length: 16 },
        group: 'basic',
        visibility: 'visible',
        choices: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_PLACEMENTS],
        default: 'block',
        label_key: 'sf.composition.layout_region.placement',
        help_key: 'sf.composition.layout_region.placement_help',
        capability_hints: ['composition.props.placement'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
      {
        key: 'label',
        plane: 'props',
        target: 'label',
        property: { type: 'string', version: 2 },
        constraints: { min_length: 1, max_length: 120 },
        group: 'basic',
        visibility: 'visible',
        label_key: 'sf.composition.layout_region.label',
        help_key: 'sf.composition.layout_region.label_help',
        capability_hints: ['composition.props.label'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
      {
        key: 'landmark',
        plane: 'props',
        target: 'landmark',
        property: { type: 'string', version: 2 },
        constraints: { min_length: 1, max_length: 16 },
        group: 'advanced',
        visibility: 'collapsed',
        choices: [..._regions_mjs__WEBPACK_IMPORTED_MODULE_0__.REGION_LANDMARKS],
        label_key: 'sf.composition.layout_region.landmark',
        help_key: 'sf.composition.layout_region.landmark_help',
        capability_hints: ['composition.props.landmark'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
      {
        key: 'sticky',
        plane: 'props',
        target: 'sticky',
        property: { type: 'boolean', version: 1 },
        constraints: {},
        group: 'advanced',
        visibility: 'collapsed',
        default: false,
        label_key: 'sf.composition.layout_region.sticky',
        help_key: 'sf.composition.layout_region.sticky_help',
        capability_hints: ['composition.props.sticky'],
        permission_hints: ['composition.node.update'],
        owner: 'simai/framework',
      },
    ],
  },
]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUILTIN_TYPE_MANIFESTS);


/***/ },

/***/ "6f489cc65b77"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ "3765e2c966fd"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   projectDocumentEditorFields: () => (/* binding */ projectDocumentEditorFields),
/* harmony export */   projectEditorFields: () => (/* binding */ projectEditorFields),
/* harmony export */   validateEditorManifest: () => (/* binding */ validateEditorManifest)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ac24888e7d3e");



const SCHEMA = 'simai.composition.editor-manifest.v1';
const MANIFEST_FIELDS = new Set(['schema', 'schema_version', 'type', 'type_version', 'applies_to', 'fields']);
const APPLIES_FIELDS = new Set(['views', 'presets', 'modifiers']);
const FIELD_FIELDS = new Set([
  'key', 'plane', 'target', 'property', 'constraints', 'group', 'visibility',
  'choices', 'default', 'label_key', 'help_key', 'capability_hints',
  'permission_hints', 'owner',
]);
const PROPERTY_FIELDS = new Set(['type', 'version']);
const PLANES = new Set(['props', 'data', 'presentation']);
const GROUPS = new Set(['preset', 'basic', 'advanced']);
const VISIBILITIES = new Set(['visible', 'collapsed', 'hidden']);
const PRESENTATION_TARGETS = new Set(['view', 'preset']);
const FORBIDDEN_KEYS = new Set([
  'actor', 'authorization', 'class', 'classname', 'cookie', 'endpoint', 'eval',
  'expression', 'function', 'handler', 'html', 'innerhtml', 'javascript', 'method',
  'password', 'php', 'query', 'request', 'script', 'secret', 'sql', 'token',
]);

const diagnostic = (code, path, message) => ({ code, path, message });
const stableKey = (value) => typeof value === 'string' && /^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)*$/u.test(value);
const componentType = (value) => typeof value === 'string' && /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/u.test(value);
const version = (value) => typeof value === 'string' && /^[0-9]+\.[0-9]+\.[0-9]+$/u.test(value);
const owner = (value) => typeof value === 'string' && /^[a-z][a-z0-9.-]*\/[a-z][a-z0-9.-]*$/u.test(value);
const scalar = (value) => value === null
  || typeof value === 'string'
  || typeof value === 'boolean'
  || (typeof value === 'number' && Number.isFinite(value));
const forbiddenIdentity = (value) => typeof value === 'string'
  && value.split('.').some((part) => FORBIDDEN_KEYS.has(part.toLowerCase().replaceAll('-', '').replaceAll('_', '')));

function unknownFields(value, allowed, path, diagnostics) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) diagnostics.push(diagnostic('editor_unknown_field', `${path}.${key}`, `Unknown editor field ${key}`));
  }
}

function scanForbidden(value, path, diagnostics) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanForbidden(entry, `${path}[${index}]`, diagnostics));
    return;
  }
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    const normalized = key.toLowerCase().replaceAll('-', '').replaceAll('_', '');
    if (FORBIDDEN_KEYS.has(normalized)) {
      diagnostics.push(diagnostic('editor_executable_or_secret_field_forbidden', `${path}.${key}`, `Field ${key} is not portable editor metadata`));
    }
    scanForbidden(entry, `${path}.${key}`, diagnostics);
  }
}

function propertyIdentities(propertyTypes) {
  if (propertyTypes === undefined) return null;
  const identities = new Set();
  for (const entry of propertyTypes) {
    if (typeof entry === 'string') identities.add(entry);
    else if ((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(entry)) identities.add(`${entry.type}@${entry.version}`);
  }
  return identities;
}

function validateHintList(value, path, diagnostics) {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.length > 50 || value.some((entry) => !stableKey(entry)) || new Set(value).size !== value.length) {
    diagnostics.push(diagnostic('editor_hint_list_invalid', path, 'Hints must be a bounded unique stable-key list'));
  }
}

function selectionValues(typeManifest, target) {
  if (target === 'view') return typeManifest.presentation?.views || [];
  if (target === 'preset') return typeManifest.presentation?.presets || [];
  return [];
}

function validateAppliesTo(value, typeManifest, diagnostics) {
  if (value === undefined) return;
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) {
    diagnostics.push(diagnostic('editor_applies_to_invalid', '$.applies_to', 'applies_to must be an object'));
    return;
  }
  unknownFields(value, APPLIES_FIELDS, '$.applies_to', diagnostics);
  for (const [key, registeredKey] of [['views', 'views'], ['presets', 'presets'], ['modifiers', 'modifiers']]) {
    if (value[key] === undefined) continue;
    if (!Array.isArray(value[key]) || value[key].length === 0 || value[key].some((entry) => typeof entry !== 'string') || new Set(value[key]).size !== value[key].length) {
      diagnostics.push(diagnostic('editor_applies_to_invalid', `$.applies_to.${key}`, `${key} must be a non-empty unique string list`));
      continue;
    }
    const registered = new Set(typeManifest.presentation?.[registeredKey] || []);
    for (const entry of value[key]) {
      if (!registered.has(entry)) diagnostics.push(diagnostic('editor_presentation_choice_unknown', `$.applies_to.${key}`, `${entry} is not registered by the type manifest`));
    }
  }
}

function validateEditorManifest(editorManifest, typeManifest, options = {}) {
  const diagnostics = [];
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(editorManifest)) return { valid: false, diagnostics: [diagnostic('editor_manifest_invalid', '$', 'Editor manifest must be an object')] };
  unknownFields(editorManifest, MANIFEST_FIELDS, '$', diagnostics);
  scanForbidden(editorManifest, '$', diagnostics);
  if (!(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.isSchema)(editorManifest, 'simai.composition.editor-manifest', 1)) diagnostics.push(diagnostic('editor_schema_unknown', '$.schema', `Expected ${SCHEMA}, or simai.composition.editor-manifest with schema_version 1`));
  if (!componentType(editorManifest.type)) diagnostics.push(diagnostic('editor_type_invalid', '$.type', 'Component type is invalid'));
  if (!version(editorManifest.type_version)) diagnostics.push(diagnostic('editor_type_version_invalid', '$.type_version', 'Component type version is invalid'));
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(typeManifest) || typeManifest.type !== editorManifest.type || typeManifest.version !== editorManifest.type_version) {
    diagnostics.push(diagnostic('editor_type_registration_mismatch', '$.type', 'Editor manifest must bind one exact registered type revision'));
  }
  validateAppliesTo(editorManifest.applies_to, typeManifest || {}, diagnostics);
  if (!Array.isArray(editorManifest.fields) || editorManifest.fields.length > 200) {
    diagnostics.push(diagnostic('editor_fields_invalid', '$.fields', 'fields must be a bounded array'));
    return { valid: false, diagnostics };
  }

  const keys = new Set();
  const destinations = new Set();
  const availablePropertyTypes = propertyIdentities(options.propertyTypes);
  editorManifest.fields.forEach((field, index) => {
    const path = `$.fields[${index}]`;
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field)) {
      diagnostics.push(diagnostic('editor_field_invalid', path, 'Editor field must be an object'));
      return;
    }
    unknownFields(field, FIELD_FIELDS, path, diagnostics);
    if (!stableKey(field.key)) diagnostics.push(diagnostic('editor_field_key_invalid', `${path}.key`, 'Field key must be stable'));
    else if (keys.has(field.key)) diagnostics.push(diagnostic('editor_field_key_duplicate', `${path}.key`, `Duplicate field key ${field.key}`));
    else keys.add(field.key);
    if (!PLANES.has(field.plane)) diagnostics.push(diagnostic('editor_plane_unknown', `${path}.plane`, 'Field plane is unknown'));
    if (!stableKey(field.target)) diagnostics.push(diagnostic('editor_target_invalid', `${path}.target`, 'Field target must be stable'));
    if (forbiddenIdentity(field.key)) diagnostics.push(diagnostic('editor_executable_or_secret_field_forbidden', `${path}.key`, 'Field key names executable or secret data'));
    if (forbiddenIdentity(field.target)) diagnostics.push(diagnostic('editor_executable_or_secret_field_forbidden', `${path}.target`, 'Field target names executable or secret data'));
    const destination = `${field.plane}.${field.target}`;
    if (destinations.has(destination)) diagnostics.push(diagnostic('editor_destination_duplicate', `${path}.target`, `Duplicate destination ${destination}`));
    else destinations.add(destination);
    if (!GROUPS.has(field.group)) diagnostics.push(diagnostic('editor_group_unknown', `${path}.group`, 'Field group is unknown'));
    if (!VISIBILITIES.has(field.visibility)) diagnostics.push(diagnostic('editor_visibility_unknown', `${path}.visibility`, 'Field visibility is unknown'));
    if (!stableKey(field.label_key)) diagnostics.push(diagnostic('editor_label_key_invalid', `${path}.label_key`, 'Localization key must be stable'));
    if (field.help_key !== undefined && !stableKey(field.help_key)) diagnostics.push(diagnostic('editor_help_key_invalid', `${path}.help_key`, 'Help localization key must be stable'));
    validateHintList(field.capability_hints, `${path}.capability_hints`, diagnostics);
    validateHintList(field.permission_hints, `${path}.permission_hints`, diagnostics);
    if (!owner(field.owner)) diagnostics.push(diagnostic('editor_owner_invalid', `${path}.owner`, 'Owner must be a portable owner id'));
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field.constraints)) diagnostics.push(diagnostic('editor_constraints_invalid', `${path}.constraints`, 'Constraints must be an object'));

    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field.property)) diagnostics.push(diagnostic('editor_property_invalid', `${path}.property`, 'Property identity must be an object'));
    else {
      unknownFields(field.property, PROPERTY_FIELDS, `${path}.property`, diagnostics);
      if (!stableKey(field.property.type)) diagnostics.push(diagnostic('editor_property_type_invalid', `${path}.property.type`, 'Property type must be stable'));
      if (!Number.isInteger(field.property.version) || field.property.version < 1) diagnostics.push(diagnostic('editor_property_version_invalid', `${path}.property.version`, 'Property version must be positive'));
      if (availablePropertyTypes && !availablePropertyTypes.has(`${field.property.type}@${field.property.version}`)) {
        diagnostics.push(diagnostic('editor_property_registration_unknown', `${path}.property`, 'Property type and version are not registered by the host'));
      }
    }

    if (field.choices !== undefined && (!Array.isArray(field.choices) || field.choices.length === 0 || field.choices.length > 200 || field.choices.some((entry) => !scalar(entry)) || new Set(field.choices.map(_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)).size !== field.choices.length)) {
      diagnostics.push(diagnostic('editor_choices_invalid', `${path}.choices`, 'Choices must be a bounded unique scalar list'));
    }
    if ('default' in field && !scalar(field.default)) diagnostics.push(diagnostic('editor_default_invalid', `${path}.default`, 'Default must be scalar'));
    if ('default' in field && Array.isArray(field.choices) && !field.choices.some((choice) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(choice) === (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(field.default))) {
      diagnostics.push(diagnostic('editor_default_choice_unknown', `${path}.default`, 'Default must be one of the allowed choices'));
    }

    if (field.plane === 'presentation') {
      if (!PRESENTATION_TARGETS.has(field.target)) diagnostics.push(diagnostic('editor_presentation_target_unsupported', `${path}.target`, 'Only view and preset are scalar editable presentation targets'));
      const registered = new Set(selectionValues(typeManifest || {}, field.target));
      for (const choice of field.choices || []) {
        if (typeof choice !== 'string' || !registered.has(choice)) diagnostics.push(diagnostic('editor_presentation_choice_unknown', `${path}.choices`, `${String(choice)} is not registered by the type manifest`));
      }
    } else if (PLANES.has(field.plane) && (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(typeManifest)) {
      const schema = field.plane === 'props' ? typeManifest.props_schema : typeManifest.data_schema;
      if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(schema?.properties) || !(field.target in schema.properties)) diagnostics.push(diagnostic('editor_destination_unknown', `${path}.target`, `${destination} is not declared by the type manifest`));
    }
  });
  return { valid: diagnostics.length === 0, diagnostics };
}

function nodeValue(node, field) {
  const plane = node?.[field.plane];
  if ((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(plane) && field.target in plane) return { value: plane[field.target], source: 'node' };
  if ('default' in field) return { value: field.default, source: 'default' };
  return { value: null, source: 'unset' };
}

function projectEditorFields(editorManifest, typeManifest, node, options = {}) {
  const checked = validateEditorManifest(editorManifest, typeManifest, options);
  if (!checked.valid) return { valid: false, fields: [], diagnostics: checked.diagnostics };
  const diagnostics = [];
  const fields = editorManifest.fields.map((field) => {
    const current = nodeValue(node, field);
    if (current.source !== 'unset' && field.choices && !field.choices.some((choice) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(choice) === (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(current.value))) {
      diagnostics.push(diagnostic('editor_choice_unknown', `node:${node?.id || ''}.${field.plane}.${field.target}`, 'Current value is not an allowed choice'));
    }
    return (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)({ ...field, destination: `${field.plane}.${field.target}`, ...current });
  });
  return { valid: diagnostics.length === 0, fields, diagnostics };
}

function projectDocumentEditorFields(document, typeRegistry, editorManifests, options = {}) {
  const byType = new Map();
  for (const manifest of editorManifests || []) {
    const identity = `${manifest.type}@${manifest.type_version}`;
    if (byType.has(identity)) return { valid: false, instances: [], diagnostics: [diagnostic('editor_manifest_duplicate', '$', `Duplicate editor manifest ${identity}`)] };
    byType.set(identity, manifest);
  }
  const instances = [];
  const diagnostics = [];
  const visit = (node) => {
    const typeManifest = typeRegistry?.types instanceof Map ? typeRegistry.types.get(node.type) : undefined;
    if (typeManifest) {
      const editorManifest = byType.get(`${typeManifest.type}@${typeManifest.version}`);
      if (editorManifest) {
        const projected = projectEditorFields(editorManifest, typeManifest, node, options);
        diagnostics.push(...projected.diagnostics.map((entry) => ({ ...entry, instance: node.id })));
        instances.push({ id: node.id, type: node.type, fields: projected.fields });
      }
    }
    for (const children of Object.values(node.slots || {})) for (const child of children) visit(child);
  };
  if (document?.root) visit(document.root);
  return { valid: diagnostics.length === 0, instances, diagnostics };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ projectDocumentEditorFields, projectEditorFields, validateEditorManifest });


/***/ },

/***/ "4e6fc63bed81"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_FIELD_KINDS: () => (/* binding */ BUILTIN_FIELD_KINDS),
/* harmony export */   applyFieldValue: () => (/* binding */ applyFieldValue),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fieldKindRegistry: () => (/* binding */ fieldKindRegistry),
/* harmony export */   parseFieldSubmission: () => (/* binding */ parseFieldSubmission),
/* harmony export */   renderFieldFallback: () => (/* binding */ renderFieldFallback),
/* harmony export */   resolveFieldKind: () => (/* binding */ resolveFieldKind),
/* harmony export */   validateFieldKinds: () => (/* binding */ validateFieldKinds),
/* harmony export */   validateFieldValue: () => (/* binding */ validateFieldValue)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ac24888e7d3e");



// Editor field kinds. A kind is derived from the exact host Property identity
// and the presence of choices in a simai.composition.editor-manifest.v1 field;
// the editor manifest schema is unchanged. Each kind fixes value schema,
// default, normalization, validation, accessibility, themes, localization and
// the server-rendered fallback control. Hosts keep persistence and access.

const STABLE_SEGMENT = /^[a-z][a-z0-9_]*$/u;
const INTEGER_TEXT = /^-?(?:0|[1-9][0-9]*)$/u;

const BUILTIN_FIELD_KINDS = Object.freeze([
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-field-kind', 1),
    kind: 'choice',
    version: 1,
    status: 'formalized-existing',
    match: { property: [{ type: 'string', version: 1 }, { type: 'string', version: 2 }], choices: 'required' },
    value_schema: { type: 'string', minLength: 1 },
    default: { kind: null, field: 'must-be-a-choice' },
    constraints: { allowed: ['min_length', 'max_length'] },
    normalization: { form: 'exact-string', unset: 'absent-field', stored: 'value' },
    validation: ['choice-member'],
    accessibility: { control: 'select', role: 'combobox', name: 'label_key', description: 'help_key via aria-describedby', keyboard: ['Tab', 'ArrowUp', 'ArrowDown', 'Enter', 'Space', 'Escape'] },
    themes: { modes: ['light', 'dark'], tokens: ['--sf-surface-1', '--sf-on-surface', '--sf-outline', '--sf-primary'], contrast: 'WCAG 2.2 AA' },
    localization: { label: 'label_key', help: 'help_key', value_labels: '<label_key>.<choice> when the choice is a stable segment, otherwise the raw choice', direction: 'logical' },
    server_fallback: { element: 'select', value: 'option value', enhanced_control: 'sf-dropdown' },
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-field-kind', 1),
    kind: 'integer',
    version: 1,
    status: 'formalized-existing',
    match: { property: [{ type: 'integer', version: 1 }], choices: 'forbidden' },
    value_schema: { type: 'integer', minimum: -9007199254740991, maximum: 9007199254740991 },
    default: { kind: null, field: 'must-satisfy-constraints' },
    constraints: { allowed: ['min', 'max'], required: ['min', 'max'] },
    normalization: { form: 'decimal-integer-text', unset: 'empty-text', stored: 'safe-integer' },
    validation: ['integer-text', 'range'],
    accessibility: { control: 'input[type=number]', role: 'spinbutton', name: 'label_key', description: 'help_key via aria-describedby', keyboard: ['Tab', 'ArrowUp', 'ArrowDown', 'digits'] },
    themes: { modes: ['light', 'dark'], tokens: ['--sf-surface-1', '--sf-on-surface', '--sf-outline', '--sf-primary'], contrast: 'WCAG 2.2 AA' },
    localization: { label: 'label_key', help: 'help_key', value_labels: 'none', direction: 'logical', digits: 'ASCII decimal' },
    server_fallback: { element: 'input', type: 'number', attributes: ['min', 'max', 'step=1', 'inputmode=numeric'], enhanced_control: 'sf-input' },
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-field-kind', 1),
    kind: 'text',
    version: 1,
    status: 'new',
    match: { property: [{ type: 'string', version: 2 }], choices: 'forbidden' },
    value_schema: { type: 'string', minLength: 1, maxLength: 2000 },
    default: { kind: null, field: 'must-satisfy-constraints' },
    constraints: { allowed: ['min_length', 'max_length'], required: ['max_length'] },
    normalization: { form: 'exact-string-no-trim-no-unicode-normalization', unset: 'empty-text', stored: 'value' },
    validation: ['code-point-length', 'no-control-characters', 'well-formed-unicode'],
    accessibility: { control: 'input[type=text]', role: 'textbox', name: 'label_key', description: 'help_key via aria-describedby', keyboard: ['Tab', 'text entry'], attributes: ['dir=auto', 'maxlength'] },
    themes: { modes: ['light', 'dark'], tokens: ['--sf-surface-1', '--sf-on-surface', '--sf-outline', '--sf-primary'], contrast: 'WCAG 2.2 AA' },
    localization: { label: 'label_key', help: 'help_key', value_labels: 'none', direction: 'dir=auto per value; value is author content in the Document locale' },
    server_fallback: { element: 'input', type: 'text', attributes: ['maxlength', 'dir=auto'], enhanced_control: 'sf-input' },
  },
  {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-field-kind', 1),
    kind: 'toggle',
    version: 1,
    status: 'new',
    match: { property: [{ type: 'boolean', version: 1 }], choices: 'forbidden' },
    value_schema: { type: 'boolean' },
    default: { kind: false, field: 'false-or-absent' },
    constraints: { allowed: [] },
    normalization: { form: 'present-true-absent-false', unset: 'false', stored: 'true only; false removes the key' },
    validation: ['strict-boolean'],
    accessibility: { control: 'input[type=checkbox][role=switch]', role: 'switch', name: 'label_key', description: 'help_key via aria-describedby', keyboard: ['Tab', 'Space'], states: ['checked'] },
    themes: { modes: ['light', 'dark'], tokens: ['--sf-surface-1', '--sf-on-surface', '--sf-outline', '--sf-primary'], contrast: 'WCAG 2.2 AA' },
    localization: { label: 'label_key', help: 'help_key', value_labels: 'none', direction: 'logical' },
    server_fallback: { element: 'input', type: 'checkbox', attributes: ['role=switch', 'value=true'], enhanced_control: 'sf-switch' },
  },
]);

const diagnostic = (code, path, message) => ({ code, path, message });

function codePoints(value) {
  return [...value].length;
}

function wellFormed(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return false;
    }
  }
  return true;
}

function hasControl(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 32 || code === 127) return true;
  }
  return false;
}

/** Returns the kind manifest that governs an editor field, or null. */
function resolveFieldKind(field, kinds = BUILTIN_FIELD_KINDS) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field?.property)) return null;
  const hasChoices = Array.isArray(field.choices);
  const matches = kinds.filter((kind) => kind.match.property.some((property) => property.type === field.property.type && property.version === field.property.version)
    && (kind.match.choices === 'required' ? hasChoices : !hasChoices));
  return matches.length === 1 ? matches[0] : null;
}

/** Checks one normalized value against its field; returns diagnostics. */
function validateFieldValue(field, value, path = '$') {
  const kind = resolveFieldKind(field);
  if (!kind) return [diagnostic('field_kind_unknown', path, 'The field does not map to exactly one published kind')];
  const constraints = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field.constraints) ? field.constraints : {};
  const problems = [];
  if (kind.kind === 'choice') {
    if (typeof value !== 'string' || !field.choices.includes(value)) problems.push(diagnostic('field_value_choice', path, 'Value is not an allowed choice'));
  } else if (kind.kind === 'integer') {
    if (!Number.isSafeInteger(value)) problems.push(diagnostic('field_value_type', path, 'Value must be a safe integer'));
    else if ((Number.isInteger(constraints.min) && value < constraints.min) || (Number.isInteger(constraints.max) && value > constraints.max)) problems.push(diagnostic('field_value_range', path, 'Value is outside the allowed range'));
  } else if (kind.kind === 'text') {
    if (typeof value !== 'string') problems.push(diagnostic('field_value_type', path, 'Value must be a string'));
    else if (!wellFormed(value)) problems.push(diagnostic('field_value_unicode', path, 'Value must be well-formed Unicode'));
    else if (hasControl(value)) problems.push(diagnostic('field_value_control', path, 'Value cannot contain control characters'));
    else {
      const length = codePoints(value);
      const min = Math.max(1, Number.isInteger(constraints.min_length) ? constraints.min_length : 1);
      const max = Math.min(2000, Number.isInteger(constraints.max_length) ? constraints.max_length : 2000);
      if (length < min || length > max) problems.push(diagnostic('field_value_length', path, 'Value length is outside the allowed range'));
    }
  } else if (kind.kind === 'toggle' && typeof value !== 'boolean') {
    problems.push(diagnostic('field_value_type', path, 'Value must be a boolean'));
  }
  return problems;
}

/** Kind-specific manifest rules added on top of validateEditorManifest. */
function validateFieldKinds(editorManifest) {
  const problems = [];
  (Array.isArray(editorManifest?.fields) ? editorManifest.fields : []).forEach((field, index) => {
    const path = `$.fields[${index}]`;
    const kind = resolveFieldKind(field);
    if (!kind) {
      problems.push(diagnostic('field_kind_unknown', path, 'The field does not map to exactly one published kind'));
      return;
    }
    const constraints = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(field.constraints) ? field.constraints : {};
    for (const key of Object.keys(constraints)) {
      if (!kind.constraints.allowed.includes(key)) problems.push(diagnostic('field_constraint_unknown', `${path}.constraints.${key}`, `${key} is not a ${kind.kind} constraint`));
    }
    for (const key of kind.constraints.required || []) {
      if (!Number.isInteger(constraints[key])) problems.push(diagnostic('field_constraint_required', `${path}.constraints.${key}`, `${kind.kind} requires ${key}`));
    }
    if (kind.kind === 'choice') {
      const min = Number.isInteger(constraints.min_length) ? constraints.min_length : 0;
      const max = Number.isInteger(constraints.max_length) ? constraints.max_length : Infinity;
      if (min > max) problems.push(diagnostic('field_constraint_invalid', `${path}.constraints`, 'min_length must not exceed max_length'));
      for (const choice of field.choices) {
        if (typeof choice !== 'string' || codePoints(choice) < min || codePoints(choice) > max) problems.push(diagnostic('field_choice_invalid', `${path}.choices`, `${String(choice)} violates the choice constraints`));
      }
    }
    if (kind.kind === 'integer' && Number.isInteger(constraints.min) && Number.isInteger(constraints.max) && constraints.min > constraints.max) {
      problems.push(diagnostic('field_constraint_invalid', `${path}.constraints`, 'min must not exceed max'));
    }
    if (kind.kind === 'text' && Number.isInteger(constraints.min_length) && Number.isInteger(constraints.max_length) && constraints.min_length > constraints.max_length) {
      problems.push(diagnostic('field_constraint_invalid', `${path}.constraints`, 'min_length must not exceed max_length'));
    }
    if (kind.kind === 'toggle' && 'default' in field && field.default !== false) problems.push(diagnostic('field_default_invalid', `${path}.default`, 'A toggle default must be false or absent'));
    if (kind.kind !== 'toggle' && 'default' in field) problems.push(...validateFieldValue(field, field.default, `${path}.default`).map((entry) => ({ ...entry, code: 'field_default_invalid' })));
  });
  return problems;
}

/**
 * Normalizes one submitted form value. raw is the submitted string, or null
 * when the control sent nothing. Returns {value} or {unset: true} or {error}.
 */
function parseFieldSubmission(field, raw) {
  const kind = resolveFieldKind(field);
  if (!kind) return { error: diagnostic('field_kind_unknown', '$', 'The field does not map to exactly one published kind') };
  if (raw !== null && typeof raw !== 'string') return { error: diagnostic('field_submission_invalid', '$', 'A submission must be a string or absent') };
  let value;
  if (kind.kind === 'toggle') {
    if (raw !== null && raw !== 'true') return { error: diagnostic('field_submission_invalid', '$', 'A toggle submits only true') };
    return raw === 'true' ? { value: true } : { unset: true };
  }
  if (raw === null || raw === '') return { unset: true };
  if (kind.kind === 'integer') {
    if (!INTEGER_TEXT.test(raw)) return { error: diagnostic('field_value_type', '$', 'Value must be a decimal integer') };
    value = Number(raw);
  } else {
    value = raw;
  }
  const problems = validateFieldValue(field, value);
  return problems.length ? { error: problems[0] } : { value };
}

/** Returns a new node with the field value set, or the key removed when unset. */
function applyFieldValue(node, field, result) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(result) || result.error || (result.unset !== true && !('value' in result))) {
    throw new TypeError('applyFieldValue requires a successful parseFieldSubmission result');
  }
  const next = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)(JSON.parse(JSON.stringify(node)));
  const plane = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(next[field.plane]) ? { ...next[field.plane] } : {};
  if (result.unset || (resolveFieldKind(field)?.kind === 'toggle' && result.value === false)) delete plane[field.target];
  else plane[field.target] = result.value;
  if (Object.keys(plane).length) next[field.plane] = plane;
  else delete next[field.plane];
  return (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)(next);
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function controlId(instance, field) {
  return `sf-field-${instance}-${field.key}`.replace(/[^A-Za-z0-9_-]/gu, '-');
}

/**
 * Server-rendered fallback control for one projected field (the output of
 * projectEditorFields plus its instance id). Works without JavaScript; the
 * submitted name is "<instance>.<destination>". Missing translations fall back
 * to the stable key text.
 */
function renderFieldFallback(field, { instance, messages = {} } = {}) {
  const kind = resolveFieldKind(field);
  if (!kind) throw new TypeError('field_kind_unknown');
  // Hidden fields are not rendered; a form handler must skip them so that
  // their stored values stay unchanged.
  if (field.visibility === 'hidden') return '';
  const id = controlId(instance, field);
  const name = escapeHtml(`${instance}.${field.plane}.${field.target}`);
  const label = escapeHtml(messages[field.label_key] ?? field.label_key);
  const helpId = field.help_key ? `${id}-help` : null;
  const described = helpId ? ` aria-describedby="${helpId}"` : '';
  const help = helpId ? `<small class="sf-editor-field-help" id="${helpId}">${escapeHtml(messages[field.help_key] ?? field.help_key)}</small>` : '';
  const value = field.value ?? field.default ?? null;
  const constraints = field.constraints || {};
  let control;
  if (kind.kind === 'toggle') {
    control = `<input class="sf-editor-field-control" type="checkbox" role="switch" id="${id}" name="${name}" value="true"${value === true ? ' checked' : ''}${described}><label for="${id}">${label}</label>`;
  } else if (kind.kind === 'choice') {
    const options = field.choices.map((choice) => {
      const text = STABLE_SEGMENT.test(choice) ? (messages[`${field.label_key}.${choice}`] ?? choice) : choice;
      return `<option value="${escapeHtml(choice)}"${choice === value ? ' selected' : ''}>${escapeHtml(text)}</option>`;
    }).join('');
    control = `<label for="${id}">${label}</label><select class="sf-editor-field-control" id="${id}" name="${name}"${described}>${value === null ? '<option value="" selected></option>' : ''}${options}</select>`;
  } else if (kind.kind === 'integer') {
    const bounds = `${Number.isInteger(constraints.min) ? ` min="${constraints.min}"` : ''}${Number.isInteger(constraints.max) ? ` max="${constraints.max}"` : ''}`;
    control = `<label for="${id}">${label}</label><input class="sf-editor-field-control" type="number" inputmode="numeric" step="1"${bounds} id="${id}" name="${name}" value="${value === null ? '' : escapeHtml(value)}"${described}>`;
  } else {
    const max = Math.min(2000, Number.isInteger(constraints.max_length) ? constraints.max_length : 2000);
    control = `<label for="${id}">${label}</label><input class="sf-editor-field-control" type="text" dir="auto" maxlength="${max}" id="${id}" name="${name}" value="${value === null ? '' : escapeHtml(value)}"${described}>`;
  }
  const html = `<div class="sf-editor-field" data-sf-field-kind="${kind.kind}" data-sf-field-group="${escapeHtml(field.group)}">${control}${help}</div>`;
  return field.visibility === 'collapsed'
    ? `<details class="sf-editor-field-disclosure"><summary>${label}</summary>${html}</details>`
    : html;
}

function fieldKindRegistry() {
  return JSON.parse((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)({ ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.editor-field-kind-registry', 1), entries: BUILTIN_FIELD_KINDS }));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ BUILTIN_FIELD_KINDS, applyFieldValue, parseFieldSubmission, renderFieldFallback, resolveFieldKind, validateFieldKinds, validateFieldValue });


/***/ },

/***/ "c2e3ed8498dc"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FRAGMENT_DESCRIPTOR_SCHEMA: () => (/* binding */ FRAGMENT_DESCRIPTOR_SCHEMA),
/* harmony export */   checkFragmentDescriptor: () => (/* binding */ checkFragmentDescriptor),
/* harmony export */   defineFragmentBoundary: () => (/* binding */ defineFragmentBoundary),
/* harmony export */   definePageHost: () => (/* binding */ definePageHost),
/* harmony export */   publishEffects: () => (/* binding */ publishEffects)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ac24888e7d3e");
/* harmony import */ var _routing_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("4aea5d6d49c7");




// The interface fragment descriptor (simai.interface-fragment 1.0.0): checked
// here so a package gate, a page and a test read one rule. Returns the list of
// problems, empty when the descriptor holds; never coerces.
const FRAGMENT_DESCRIPTOR_SCHEMA = 'simai.interface-fragment.v1';

const FIELDS = ['schema', 'id', 'element', 'regions', 'port', 'outputs', 'inputs', 'operation', 'url_state', 'budget'];
const ID = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/u;
const ELEMENT = /^[a-z][a-z0-9]*-[a-z0-9-]+$/u;
const NAME = /^[a-z][a-z0-9-]{0,31}$/u;
const STANDARD = /^[a-z][a-z0-9.-]*$/u;
const VERSION = /^[0-9]+\.[0-9]+\.[0-9]+$/u;
const OPERATION = /^[a-z][a-z0-9._:-]{0,127}$/u;
const URL_KEY = /^[a-z][a-z0-9_-]{0,63}$/u;

const closed = (value, allowed) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value) && Object.keys(value).every((key) => allowed.includes(key));
const uniqueList = (value, max, test) => Array.isArray(value) && value.length <= max
  && new Set(value).size === value.length && value.every(test);

function portProblems(ports, where) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(ports)) return [`${where}: not an object`];
  const names = Object.keys(ports);
  const problems = names.length > 16 ? [`${where}: more than 16 ports`] : [];
  for (const name of names) {
    const port = ports[name];
    if (!NAME.test(name)) problems.push(`${where}.${name}: name`);
    if (!closed(port, ['value', 'summary'])) { problems.push(`${where}.${name}: undeclared keys`); continue; }
    if ((0,_routing_mjs__WEBPACK_IMPORTED_MODULE_2__.valueTypeName)(port.value) === null) problems.push(`${where}.${name}: unknown value type ${port.value}`);
    if (typeof port.summary !== 'string' || !port.summary.trim() || port.summary.length > 1000) problems.push(`${where}.${name}: summary`);
  }
  return problems;
}

function checkFragmentDescriptor(descriptor) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(descriptor)) return ['descriptor: not an object'];
  const problems = [];
  const keys = Object.keys(descriptor);
  for (const field of FIELDS) if (!keys.includes(field)) problems.push(`${field}: required`);
  for (const key of keys) if (!FIELDS.includes(key) && key !== 'schema_version') problems.push(`${key}: undeclared`);
  // Either form of the format name: simai.interface-fragment.v1, or
  // simai.interface-fragment with schema_version 1 (schema-name.mjs).
  if (!(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.isSchema)(descriptor, 'simai.interface-fragment', 1)) problems.push('schema: not simai.interface-fragment, schema_version 1');
  if (typeof descriptor.id !== 'string' || !ID.test(descriptor.id)) problems.push('id: a dotted identity');
  if (typeof descriptor.element !== 'string' || !ELEMENT.test(descriptor.element)) problems.push('element: a custom element name');
  if (!uniqueList(descriptor.regions, 8, (region) => typeof region === 'string' && NAME.test(region)) || !descriptor.regions.length) problems.push('regions: one to eight region names');
  const port = descriptor.port;
  if (!closed(port, ['standard', 'version']) || !STANDARD.test(port?.standard ?? '') || !VERSION.test(port?.version ?? '')) problems.push('port: {standard, version}');
  if ('outputs' in descriptor) problems.push(...portProblems(descriptor.outputs, 'outputs'));
  if ('inputs' in descriptor) problems.push(...portProblems(descriptor.inputs, 'inputs'));
  if (typeof descriptor.operation !== 'string' || !OPERATION.test(descriptor.operation)) problems.push('operation: an access operation token');
  if (!uniqueList(descriptor.url_state, 16, (key) => typeof key === 'string' && URL_KEY.test(key))) problems.push('url_state: up to sixteen query keys');
  const budget = descriptor.budget;
  if (!closed(budget, ['kb', 'first_answer_ms'])
    || !Number.isSafeInteger(budget.kb) || budget.kb < 0 || budget.kb > 2048
    || !Number.isSafeInteger(budget.first_answer_ms) || budget.first_answer_ms < 0 || budget.first_answer_ms > 10000) problems.push('budget: {kb 0-2048, first_answer_ms 0-10000}');
  return problems;
}

// The page host as an endpoint (simai.interface-fragment, host-is-an-endpoint).
// A product's port answers carry `effects` -- [{type: 'record-changed',
// value}, ...] -- and the page publishes them on this element's outputs, one
// output per value type, named by the type without its version
// (record-changed, files-moved ...). The routes the page declares deliver them
// to the fragments that listen; the host never calls a fragment itself. An
// effect's type is read in either form, the bare name or the older label with
// the version (record-changed.v1), until the change journal retires the older
// one (value-types-without-version); both publish the same value on the same
// output. The host's own declared outputs keep the older labels.
//
//   <sf-composition-scope data-sf-routes='[{"id": "files-refresh",
//       "from": {"endpoint": "host", "port": "collection-changed", "value": "collection-changed.v1"},
//       "to": {"endpoint": "files", "port": "changed", "value": "collection-changed.v1"}}]'>
//     <sf-page-host data-sf-endpoint="host"></sf-page-host>
//     ...
//   </sf-composition-scope>
const PAGE_EFFECT_TYPES = ['record-changed.v1', 'record-removed.v1', 'collection-changed.v1', 'files-moved.v1', 'counter.v1', 'navigation.v1', 'preference-changed.v1'];
const effectPort = (type) => (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_2__.valueTypeName)(type);
const PAGE_EFFECT_PORTS = PAGE_EFFECT_TYPES.map(effectPort);

function definePageHost(registry = globalThis.customElements) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-page-host');
  if (existing) return existing;
  class SfPageHost extends globalThis.HTMLElement {
    static sfPorts = Object.freeze({
      outputs: Object.freeze(Object.fromEntries(PAGE_EFFECT_TYPES.map((type) => [effectPort(type), type]))),
      inputs: Object.freeze({}),
    });

    connectedCallback() {
      this.hidden = true;
    }

    // The host takes nothing in: what it says, it says from the product.
    sfPortInput() {
      throw new TypeError('sf-page-host has no inputs');
    }

    // Each effect is checked against its value type and published; one that
    // fails its check, or names a type the host does not publish, is refused
    // and reported, and the others still go.
    publish(effects = []) {
      const published = [];
      const refused = [];
      for (const effect of Array.isArray(effects) ? effects : []) {
        const type = effect?.type;
        if (!PAGE_EFFECT_PORTS.includes((0,_routing_mjs__WEBPACK_IMPORTED_MODULE_2__.valueTypeName)(type))) {
          refused.push({type: type ?? null, reason: 'type_not_published'});
          continue;
        }
        let value;
        try {
          value = (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_2__.valueTypeEntry)(type).check(effect.value);
        } catch (error) {
          refused.push({type, reason: 'value_invalid', message: String(error?.message ?? error)});
          continue;
        }
        this.dispatchEvent(new globalThis.CustomEvent('sf-port-output', {bubbles: true, detail: {port: effectPort(type), value}}));
        published.push(type);
      }
      if (refused.length) this.dispatchEvent(new globalThis.CustomEvent('sf-page-host-refused', {bubbles: true, detail: {refused}}));
      return {published, refused};
    }
  }
  registry.define('sf-page-host', SfPageHost);
  return SfPageHost;
}

// Effects from wherever an answer arrived: the page host of the scope the
// origin stands in, or the page's only host when the origin stands in none.
function publishEffects(effects, {origin = null} = {}) {
  if (!Array.isArray(effects) || !effects.length) return {published: [], refused: []};
  const document = globalThis.document;
  const scope = origin?.closest?.('sf-composition-scope');
  const hosts = scope
    ? [...scope.querySelectorAll('sf-page-host')].filter((host) => host.parentElement?.closest('sf-composition-scope') === scope)
    : [...(document?.querySelectorAll('sf-page-host') ?? [])];
  const host = hosts.length === 1 ? hosts[0] : null;
  if (!host || typeof host.publish !== 'function') return {published: [], refused: effects.map((effect) => ({type: effect?.type ?? null, reason: 'no_page_host'}))};
  return host.publish(effects);
}

// The fragment boundary (simai.interface-fragment, failure-is-contained). A
// fragment that throws while it draws (sf-component-error), or whose element
// does not arrive within its load time, is replaced in its place by the error
// state with a retry; the rest of the page and its routes keep working.
// Retry puts the fragment's own markup back and lets it start again.
//
//   <sf-fragment data-sf-fragment="larena.file-manager" load-timeout="10000">
//     <sf-file-manager ...></sf-file-manager>
//   </sf-fragment>
const FRAGMENT_TEXT = {
  ru: {heading: 'Не удалось показать этот блок'},
  en: {heading: 'This block could not be shown'},
};

function defineFragmentBoundary(registry = globalThis.customElements) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-fragment');
  if (existing) return existing;
  class SfFragment extends globalThis.HTMLElement {
    constructor() {
      super();
      this.markup = null;
      this.failed = null;
      this.timer = null;
      this.onError = (event) => {
        if (this.failed) return;
        event.stopPropagation();
        this.fail(event.detail?.phase ?? 'render', event.detail?.message ?? '');
      };
      this.onAction = (event) => {
        if (!this.failed || event.detail?.id !== 'retry') return;
        event.stopPropagation();
        this.retry();
      };
    }

    connectedCallback() {
      if (this.markup === null) this.markup = this.innerHTML;
      this.addEventListener('sf-component-error', this.onError);
      this.addEventListener('sf-empty-state-action', this.onAction);
      if (!this.failed) this.watchLoad();
    }

    disconnectedCallback() {
      clearTimeout(this.timer);
      this.removeEventListener('sf-component-error', this.onError);
      this.removeEventListener('sf-empty-state-action', this.onAction);
    }

    // The fragment's own element: the first custom element it holds.
    get fragmentElement() {
      return [...this.children].find((child) => child.localName.includes('-')) ?? null;
    }

    watchLoad() {
      clearTimeout(this.timer);
      const element = this.fragmentElement;
      if (!element || globalThis.customElements.get(element.localName)) return;
      const limit = Number(this.getAttribute('load-timeout')) || 10000;
      this.timer = setTimeout(() => {
        if (!globalThis.customElements.get(element.localName) && element.isConnected) this.fail('load', `${element.localName} did not load`);
      }, limit);
    }

    text(key) {
      const lang = (this.closest('[lang]')?.getAttribute('lang') || 'en').slice(0, 2);
      return (FRAGMENT_TEXT[lang] ?? FRAGMENT_TEXT.en)[key];
    }

    fail(phase, message) {
      clearTimeout(this.timer);
      this.failed = {phase, message};
      this.setAttribute('data-sf-fragment-state', 'error');
      // The fragment leaves: its elements are disconnected, so its routes and
      // listeners go with it, and what stands in its place is the error state.
      const state = globalThis.document.createElement('sf-empty-state');
      state.setAttribute('kind', 'error');
      state.setAttribute('title', this.text('heading'));
      this.replaceChildren(state);
      this.dispatchEvent(new globalThis.CustomEvent('sf-fragment-error', {
        bubbles: true, composed: true,
        detail: {fragment: this.getAttribute('data-sf-fragment'), phase, message},
      }));
    }

    retry() {
      this.failed = null;
      this.removeAttribute('data-sf-fragment-state');
      this.innerHTML = this.markup ?? '';
      this.watchLoad();
      this.dispatchEvent(new globalThis.CustomEvent('sf-fragment-retry', {bubbles: true, composed: true, detail: {fragment: this.getAttribute('data-sf-fragment')}}));
    }
  }
  registry.define('sf-fragment', SfFragment);
  return SfFragment;
}


/***/ },

/***/ "32dfc4431a24"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_EDITOR_MANIFESTS: () => (/* reexport safe */ _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_EDITOR_MANIFESTS),
/* harmony export */   BUILTIN_FIELD_KINDS: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.BUILTIN_FIELD_KINDS),
/* harmony export */   BUILTIN_PORT_MANIFESTS: () => (/* reexport safe */ _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_PORT_MANIFESTS),
/* harmony export */   BUILTIN_TYPE_MANIFESTS: () => (/* reexport safe */ _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_TYPE_MANIFESTS),
/* harmony export */   Composition: () => (/* binding */ Composition),
/* harmony export */   FRAGMENT_DESCRIPTOR_SCHEMA: () => (/* reexport safe */ _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.FRAGMENT_DESCRIPTOR_SCHEMA),
/* harmony export */   INLINE_MARKS: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.INLINE_MARKS),
/* harmony export */   Recipe: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__.Recipe),
/* harmony export */   VALUE_TYPES: () => (/* reexport safe */ _routing_mjs__WEBPACK_IMPORTED_MODULE_8__.VALUE_TYPES),
/* harmony export */   applyFieldValue: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.applyFieldValue),
/* harmony export */   checkFragmentDescriptor: () => (/* reexport safe */ _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.checkFragmentDescriptor),
/* harmony export */   checkPortValue: () => (/* reexport safe */ _routing_mjs__WEBPACK_IMPORTED_MODULE_8__.checkPortValue),
/* harmony export */   compositionTypeFromSmartManifest: () => (/* binding */ compositionTypeFromSmartManifest),
/* harmony export */   createPortRegistry: () => (/* reexport safe */ _routing_mjs__WEBPACK_IMPORTED_MODULE_8__.createPortRegistry),
/* harmony export */   createRegistry: () => (/* binding */ createRegistry),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineCompositionScope: () => (/* reexport safe */ _routing_mjs__WEBPACK_IMPORTED_MODULE_8__.defineCompositionScope),
/* harmony export */   defineFragmentBoundary: () => (/* reexport safe */ _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.defineFragmentBoundary),
/* harmony export */   definePageHost: () => (/* reexport safe */ _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.definePageHost),
/* harmony export */   describeRegions: () => (/* reexport safe */ _regions_mjs__WEBPACK_IMPORTED_MODULE_6__.describeRegions),
/* harmony export */   extendRegistry: () => (/* binding */ extendRegistry),
/* harmony export */   inlineText: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.inlineText),
/* harmony export */   marksIn: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.marksIn),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   normalizeInline: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.normalizeInline),
/* harmony export */   parseFieldSubmission: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.parseFieldSubmission),
/* harmony export */   parseRecipeJson: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__.parseRecipeJson),
/* harmony export */   projectDocumentEditorFields: () => (/* reexport safe */ _editor_mjs__WEBPACK_IMPORTED_MODULE_3__.projectDocumentEditorFields),
/* harmony export */   projectEditorFields: () => (/* reexport safe */ _editor_mjs__WEBPACK_IMPORTED_MODULE_3__.projectEditorFields),
/* harmony export */   publishEffects: () => (/* reexport safe */ _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.publishEffects),
/* harmony export */   recipeDigest: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__.recipeDigest),
/* harmony export */   recipeNodeId: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__.recipeNodeId),
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   renderFieldFallback: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.renderFieldFallback),
/* harmony export */   replaceRange: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.replaceRange),
/* harmony export */   resolveFieldKind: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.resolveFieldKind),
/* harmony export */   resolveRecipe: () => (/* reexport safe */ _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__.resolveRecipe),
/* harmony export */   setLink: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.setLink),
/* harmony export */   stableStringify: () => (/* reexport safe */ _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify),
/* harmony export */   startInlineEdit: () => (/* binding */ startInlineEdit),
/* harmony export */   toggleMark: () => (/* reexport safe */ _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.toggleMark),
/* harmony export */   validate: () => (/* binding */ validate),
/* harmony export */   validateEditorManifest: () => (/* reexport safe */ _editor_mjs__WEBPACK_IMPORTED_MODULE_3__.validateEditorManifest),
/* harmony export */   validateFieldKinds: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.validateFieldKinds),
/* harmony export */   validateFieldValue: () => (/* reexport safe */ _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.validateFieldValue)
/* harmony export */ });
/* harmony import */ var _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("08e5033c490a");
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _schema_name_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ac24888e7d3e");
/* harmony import */ var _editor_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("3765e2c966fd");
/* harmony import */ var _fields_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4e6fc63bed81");
/* harmony import */ var _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("6770fb69bd04");
/* harmony import */ var _regions_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("68efac8c1b57");
/* harmony import */ var _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e66d878fb4f8");
/* harmony import */ var _routing_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("4aea5d6d49c7");
/* harmony import */ var _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("c2e3ed8498dc");











const DOCUMENT_SCHEMA = 'simai.composition.document.v1';

// The editor surfaces (sf-composition-overlay, sf-sortable, sf-inline-editor)
// are Smart components loaded on demand, so pages that only render stay small.
// startInlineEdit keeps its Core name and delegates to the loaded editor.
function startInlineEdit(element, options) {
  const editor = globalThis.SF?.InlineEditor;
  if (typeof editor?.startInlineEdit !== 'function') throw new TypeError('inline_editor_not_loaded');
  return editor.startInlineEdit(element, options);
}
const PROFILES = new Set(['ui-layout', 'structured-content']);
const DOCUMENT_FIELDS = new Set(['schema', 'schema_version', 'id', 'profile', 'locale', 'root', 'extensions']);
const NODE_FIELDS = new Set(['id', 'type', 'data', 'props', 'slots', 'presentation', 'bindings', 'extensions']);
const PRESENTATION_FIELDS = new Set(['view', 'preset', 'modifiers']);
const BINDING_FIELDS = new Set(['owner', 'ref', 'target', 'revision']);
const FORBIDDEN_KEYS = new Set([
  'html', 'innerhtml', 'script', 'javascript', 'php', 'eval', 'function',
  'expression', 'query', 'sql', 'graphql', 'class', 'classname', 'rootclass',
  'cssclass', 'secret', 'password', 'token', 'cookie', 'authorization', 'request',
]);
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const DEFAULT_LIMITS = Object.freeze({
  maxDocumentBytes: 1024 * 1024,
  maxDepth: 32,
  maxNodes: 2000,
  maxChildrenPerSlot: 500,
});

function diagnostic(code, path, message, details = {}) {
  return { code, path, message, ...details };
}

async function sha256(value) {
  if (!globalThis.crypto?.subtle) throw new Error('composition_crypto_unavailable');
  const bytes = new globalThis.TextEncoder().encode(value);
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function pushUnknownFields(value, allowed, path, diagnostics) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) diagnostics.push(diagnostic('unknown_field', `${path}.${key}`, `Unknown field ${key}`));
  }
}

function scanForbiddenKeys(value, path, diagnostics) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanForbiddenKeys(entry, `${path}[${index}]`, diagnostics));
    return;
  }
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    const normalized = key.toLowerCase().replaceAll('-', '');
    if (FORBIDDEN_KEYS.has(normalized)) {
      diagnostics.push(diagnostic('executable_or_secret_field_forbidden', `${path}.${key}`, `Field ${key} is not portable composition data`));
    }
    scanForbiddenKeys(entry, `${path}.${key}`, diagnostics);
  }
}

function validateExtensions(value, path, diagnostics, supported = new Set()) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) {
    diagnostics.push(diagnostic('extensions_invalid', path, 'Extensions must be an object'));
    return;
  }
  for (const key of Object.keys(value)) {
    if (!/^[a-z][a-z0-9.-]*:[a-z][a-z0-9._-]*$/u.test(key)) {
      diagnostics.push(diagnostic('extension_name_invalid', `${path}.${key}`, 'Extension keys must be namespaced'));
    }
    if ((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value[key]) && value[key].required === true && !supported.has(key)) {
      diagnostics.push(diagnostic('extension_required_unknown', `${path}.${key}`, `Required extension ${key} is not supported`));
    }
  }
}

function validateJsonSchema(value, schema, path, diagnostics) {
  if (!schema) return;
  if (schema.oneOf) {
    const matches = schema.oneOf.filter((candidate) => {
      const local = [];
      validateJsonSchema(value, candidate, path, local);
      return local.length === 0;
    });
    if (matches.length !== 1) diagnostics.push(diagnostic('schema_one_of', path, 'Value must match exactly one allowed shape'));
    return;
  }
  if (schema.const !== undefined && value !== schema.const) {
    diagnostics.push(diagnostic('schema_const', path, `Value must equal ${schema.const}`));
    return;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    diagnostics.push(diagnostic('schema_enum', path, 'Value is not in the allowed list'));
    return;
  }
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (schema.type) {
    const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value === 'number' ? 'number' : typeof value;
    if (!types.includes(actual) && !(actual === 'integer' && types.includes('number')) && !(actual === 'object' && !(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value))) {
      diagnostics.push(diagnostic('schema_type', path, `Expected ${types.join(' or ')}`));
      return;
    }
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) diagnostics.push(diagnostic('schema_min_length', path, 'String is too short'));
    if (schema.maxLength !== undefined && value.length > schema.maxLength) diagnostics.push(diagnostic('schema_max_length', path, 'String is too long'));
    if (schema.pattern && !(new RegExp(schema.pattern, 'u')).test(value)) diagnostics.push(diagnostic('schema_pattern', path, 'String has an invalid format'));
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) diagnostics.push(diagnostic('schema_minimum', path, 'Number is too small'));
    if (schema.maximum !== undefined && value > schema.maximum) diagnostics.push(diagnostic('schema_maximum', path, 'Number is too large'));
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) diagnostics.push(diagnostic('schema_min_items', path, 'Array has too few items'));
    if (schema.maxItems !== undefined && value.length > schema.maxItems) diagnostics.push(diagnostic('schema_max_items', path, 'Array has too many items'));
    if (schema.uniqueItems && new Set(value.map(_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify)).size !== value.length) diagnostics.push(diagnostic('schema_unique_items', path, 'Array items must be unique'));
    if (schema.items) value.forEach((entry, index) => validateJsonSchema(entry, schema.items, `${path}[${index}]`, diagnostics));
  }
  if ((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) {
    for (const key of schema.required || []) {
      if (!(key in value)) diagnostics.push(diagnostic('schema_required', `${path}.${key}`, `Required field ${key} is missing`));
    }
    if (schema.additionalProperties === false) {
      const properties = schema.properties || {};
      for (const key of Object.keys(value)) {
        if (!(key in properties)) diagnostics.push(diagnostic('schema_additional_property', `${path}.${key}`, `Field ${key} is not allowed`));
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties || {})) {
      if (key in value) validateJsonSchema(value[key], childSchema, `${path}.${key}`, diagnostics);
    }
  }
}

function validUrl(value) {
  // Browsers read "/\\host" like "//host": backslashes never form a local link.
  if (/^(?:\/|\.?\.\/|#)/u.test(value)) return !value.startsWith('//') && !value.includes('\\');
  try {
    return SAFE_SCHEMES.has(new globalThis.URL(value).protocol);
  } catch {
    return false;
  }
}

function validateInlineContent(value, path, diagnostics) {
  if (!Array.isArray(value)) return;
  for (let index = 0; index < value.length; index += 1) {
    const inline = value[index];
    if (inline?.type === 'link' && !validUrl(inline.href)) {
      diagnostics.push(diagnostic('unsafe_url', `${path}[${index}].href`, 'Link protocol is not allowed'));
    }
  }
}

let defaultPorts = null;

function normalizePorts(ports) {
  if (ports?.elements instanceof Map) return ports;
  if (Array.isArray(ports)) return (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.createPortRegistry)(ports);
  if (ports && Array.isArray(ports.manifests)) return (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.createPortRegistry)(ports.manifests, { bindings: ports.bindings });
  defaultPorts = defaultPorts || (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.createPortRegistry)(_builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_PORT_MANIFESTS);
  return defaultPorts;
}

function normalizeRegistry(registry) {
  if (registry?.types instanceof Map) return registry;
  return createRegistry(Array.isArray(registry) ? registry : _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_TYPE_MANIFESTS);
}

function createRegistry(manifests = _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_TYPE_MANIFESTS, renderers = {}) {
  const types = new Map();
  for (const manifest of manifests) {
    // Either form of the format name (schema-name.mjs).
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(manifest) || !(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_2__.isSchema)(manifest, 'simai.composition.type-manifest', 1)) throw new TypeError('composition_manifest_invalid');
    if (types.has(manifest.type)) throw new TypeError(`composition_manifest_duplicate:${manifest.type}`);
    types.set(manifest.type, (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.canonical)(manifest));
  }
  return { types, renderers: new Map(Object.entries(renderers)) };
}

// A registry of the built-in types plus a product's own. createRegistry(list)
// takes the list as the whole registry, which is what a test of one type wants
// and what a product adding a type does not: the built-in layout types were
// gone from every registry made from a product's list alone, and they were not
// exported to add back (documentation trial, 2026-10-12).
function extendRegistry(manifests = [], renderers = {}) {
  return createRegistry([..._builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_TYPE_MANIFESTS, ...manifests], renderers);
}

function compositionTypeFromSmartManifest(manifest) {
  const declaration = manifest?.composition?.declarative;
  if (!declaration) return null;
  const inputs = manifest.inputs?.properties || {};
  // Structure and request-bound data travel in separate channels: props are the
  // structure a document holds, data is what a host answers with. Both are
  // closed and both come from the component's own declared inputs.
  const pick = (names) => Object.fromEntries(Object.entries(inputs).filter(([key]) => new Set(names || []).has(key)));
  // Request-bound data is described by the component's own declared contracts,
  // not by attributes: rows and columns arrive from a host, not from markup.
  const dataProperties = Object.fromEntries(Object.entries(declaration.data || {}).map(([key, binding]) => {
    const schema = manifest.contracts?.[binding.contract];
    if (!schema) throw new TypeError(`composition_data_contract_missing:${declaration.type}:${key}`);
    return [key, schema];
  }));
  const events = Object.fromEntries((declaration.events || [])
    .filter((name) => manifest.events?.[name])
    .map((name) => [name, { summary: manifest.events[name].summary, payload: manifest.events[name].payload }]));
  const persistence = manifest.persistence
    ? {
      mode: manifest.persistence.mode,
      source_of_truth: manifest.persistence.source_of_truth,
      network_owner: manifest.persistence.network_owner,
      settings_key_prop: declaration.persistence?.settings_key_prop ?? null,
      revision_prop: declaration.persistence?.revision_prop ?? null,
    }
    : undefined;
  return {
    ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_2__.schemaFields)('simai.composition.type-manifest', 1),
    type: declaration.type,
    version: manifest.version,
    category: 'smart',
    mode: declaration.mode,
    profiles: declaration.profiles,
    data_schema: { type: 'object', additionalProperties: false, properties: dataProperties },
    props_schema: { type: 'object', additionalProperties: false, properties: pick(declaration.props) },
    presentation: declaration.presentation || { views: ['default'], presets: [], modifiers: [] },
    slots: declaration.slots || {},
    renderer: declaration.renderer,
    assets: declaration.assets || [],
    capabilities: ['html', 'hydration'],
    ...(Object.keys(events).length ? { events } : {}),
    ...(persistence ? { persistence } : {}),
  };
}

function validate(document, registry = undefined, options = {}) {
  const diagnostics = [];
  const resolvedRegistry = normalizeRegistry(registry);
  const limits = { ...DEFAULT_LIMITS, ...(options.limits || {}) };
  const supportedExtensions = new Set([_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.ENDPOINT_EXTENSION, ...(options.supportedExtensions || [])]);
  let serialized;
  try {
    serialized = JSON.stringify(document);
  } catch {
    return { valid: false, diagnostics: [diagnostic('document_not_json', '$', 'Document must be JSON serializable')] };
  }
  if (new globalThis.TextEncoder().encode(serialized).byteLength > limits.maxDocumentBytes) diagnostics.push(diagnostic('document_too_large', '$', 'Document exceeds the byte limit'));
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(document)) return { valid: false, diagnostics: [diagnostic('document_invalid', '$', 'Document must be an object')] };
  pushUnknownFields(document, DOCUMENT_FIELDS, '$', diagnostics);
  if (!(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_2__.isSchema)(document, 'simai.composition.document', 1)) diagnostics.push(diagnostic('schema_unknown', '$.schema', `Expected ${DOCUMENT_SCHEMA}, or simai.composition.document with schema_version 1`));
  if (typeof document.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,119}$/u.test(document.id)) diagnostics.push(diagnostic('document_id_invalid', '$.id', 'Document id is invalid'));
  if (!PROFILES.has(document.profile)) diagnostics.push(diagnostic('profile_unknown', '$.profile', 'Profile is not supported'));
  if (document.locale !== undefined && (typeof document.locale !== 'string' || !/^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/u.test(document.locale))) diagnostics.push(diagnostic('locale_invalid', '$.locale', 'Locale is invalid'));
  if (document.extensions !== undefined) validateExtensions(document.extensions, '$.extensions', diagnostics, supportedExtensions);
  scanForbiddenKeys(document, '$', diagnostics);

  const ids = new Set();
  let nodeCount = 0;
  const visit = (node, path, depth) => {
    nodeCount += 1;
    if (nodeCount > limits.maxNodes) return;
    if (depth > limits.maxDepth) diagnostics.push(diagnostic('depth_limit', path, 'Composition is too deeply nested'));
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(node)) {
      diagnostics.push(diagnostic('node_invalid', path, 'Node must be an object'));
      return;
    }
    pushUnknownFields(node, NODE_FIELDS, path, diagnostics);
    if (typeof node.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,119}$/u.test(node.id)) diagnostics.push(diagnostic('node_id_invalid', `${path}.id`, 'Node id is invalid'));
    else if (ids.has(node.id)) diagnostics.push(diagnostic('node_id_duplicate', `${path}.id`, `Duplicate node id ${node.id}`));
    else ids.add(node.id);
    const manifest = resolvedRegistry.types.get(node.type);
    if (!manifest) {
      diagnostics.push(diagnostic('type_unknown', `${path}.type`, `Unknown type ${node.type || ''}`));
      return;
    }
    if (!manifest.profiles.includes(document.profile)) diagnostics.push(diagnostic('type_profile_unsupported', `${path}.type`, `${node.type} does not support ${document.profile}`));
    validateJsonSchema(node.data || {}, manifest.data_schema, `${path}.data`, diagnostics);
    validateJsonSchema(node.props || {}, manifest.props_schema, `${path}.props`, diagnostics);
    if (node.type === 'content.heading' || node.type === 'content.paragraph') validateInlineContent(node.data?.content, `${path}.data.content`, diagnostics);
    if (node.presentation !== undefined) {
      if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(node.presentation)) diagnostics.push(diagnostic('presentation_invalid', `${path}.presentation`, 'Presentation must be an object'));
      else {
        pushUnknownFields(node.presentation, PRESENTATION_FIELDS, `${path}.presentation`, diagnostics);
        const contract = manifest.presentation || {};
        if (node.presentation.view && !(contract.views || []).includes(node.presentation.view)) diagnostics.push(diagnostic('view_unknown', `${path}.presentation.view`, 'View is not registered'));
        if (node.presentation.preset && !(contract.presets || []).includes(node.presentation.preset)) diagnostics.push(diagnostic('preset_unknown', `${path}.presentation.preset`, 'Preset is not registered'));
        if (node.presentation.modifiers !== undefined) {
          if (!Array.isArray(node.presentation.modifiers)) diagnostics.push(diagnostic('modifiers_invalid', `${path}.presentation.modifiers`, 'Modifiers must be an array'));
          else for (const modifier of node.presentation.modifiers) if (!(contract.modifiers || []).includes(modifier)) diagnostics.push(diagnostic('modifier_unknown', `${path}.presentation.modifiers`, `Modifier ${modifier} is not registered`));
        }
      }
    }
    if (node.extensions !== undefined) validateExtensions(node.extensions, `${path}.extensions`, diagnostics, supportedExtensions);
    if (node.bindings !== undefined) {
      if (!Array.isArray(node.bindings)) diagnostics.push(diagnostic('bindings_invalid', `${path}.bindings`, 'Bindings must be an array'));
      else node.bindings.forEach((binding, index) => {
        const bindingPath = `${path}.bindings[${index}]`;
        if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(binding)) diagnostics.push(diagnostic('binding_invalid', bindingPath, 'Binding must be an object'));
        else {
          pushUnknownFields(binding, BINDING_FIELDS, bindingPath, diagnostics);
          for (const key of ['owner', 'ref', 'target']) if (typeof binding[key] !== 'string' || !binding[key]) diagnostics.push(diagnostic('binding_field_invalid', `${bindingPath}.${key}`, `${key} is required`));
          if (binding.revision !== undefined && (typeof binding.revision !== 'string' || !binding.revision)) diagnostics.push(diagnostic('binding_revision_invalid', `${bindingPath}.revision`, 'Revision must be a non-empty string'));
        }
      });
    }
    const slots = node.slots || {};
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(slots)) {
      diagnostics.push(diagnostic('slots_invalid', `${path}.slots`, 'Slots must be an object'));
      return;
    }
    if (manifest.mode === 'leaf' && Object.keys(slots).length) diagnostics.push(diagnostic('leaf_slots_forbidden', `${path}.slots`, 'Leaf type cannot contain slots'));
    for (const [slotName, children] of Object.entries(slots)) {
      const slot = manifest.slots?.[slotName];
      if (!slot) {
        diagnostics.push(diagnostic('slot_unknown', `${path}.slots.${slotName}`, `Slot ${slotName} is not registered`));
        continue;
      }
      if (!Array.isArray(children)) {
        diagnostics.push(diagnostic('slot_children_invalid', `${path}.slots.${slotName}`, 'Slot children must be an array'));
        continue;
      }
      if (children.length > limits.maxChildrenPerSlot || children.length > slot.max || children.length < slot.min) diagnostics.push(diagnostic('slot_cardinality', `${path}.slots.${slotName}`, 'Slot child count is outside the allowed range'));
      children.forEach((child, index) => {
        const childManifest = resolvedRegistry.types.get(child?.type);
        if (childManifest && slot.types && !slot.types.includes(child.type)) diagnostics.push(diagnostic('slot_child_type_forbidden', `${path}.slots.${slotName}[${index}]`, `${child.type} is not allowed in this slot`));
        if (childManifest && slot.categories && !slot.categories.includes(childManifest.category)) diagnostics.push(diagnostic('slot_child_category_forbidden', `${path}.slots.${slotName}[${index}]`, `${childManifest.category} is not allowed in this slot`));
        visit(child, `${path}.slots.${slotName}[${index}]`, depth + 1);
      });
    }
    for (const [slotName, slot] of Object.entries(manifest.slots || {})) {
      if (slot.min > 0 && !(slotName in slots)) diagnostics.push(diagnostic('slot_required', `${path}.slots.${slotName}`, `Slot ${slotName} is required`));
    }
  };
  visit(document.root, '$.root', 1);
  if (nodeCount > limits.maxNodes) diagnostics.push(diagnostic('node_limit', '$.root', 'Composition has too many nodes'));
  else {
    (0,_regions_mjs__WEBPACK_IMPORTED_MODULE_6__.validateRegionRules)(document.root, resolvedRegistry, diagnostics);
    (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.resolveRoutes)(document.root, resolvedRegistry, normalizePorts(options.ports), diagnostics);
  }
  return { valid: diagnostics.length === 0, diagnostics };
}

function collectDependencies(node, manifest, output) {
  for (const asset of manifest.assets || []) output.assets.add(asset);
  for (const binding of node.bindings || []) output.bindings.set(`${binding.owner}:${binding.ref}:${binding.target}:${binding.revision || ''}`, (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.canonical)(binding));
}

async function normalize(document, registry = undefined, options = {}) {
  const resolvedRegistry = normalizeRegistry(registry);
  const result = validate(document, resolvedRegistry, options);
  if (!result.valid) return { document: null, digest: null, dependencies: { assets: [], bindings: [] }, diagnostics: result.diagnostics };
  const normalized = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.canonical)(JSON.parse(JSON.stringify(document)));
  const dependencies = { assets: new Set(), bindings: new Map() };
  const visit = (node) => {
    collectDependencies(node, resolvedRegistry.types.get(node.type), dependencies);
    Object.values(node.slots || {}).flat().forEach(visit);
  };
  visit(normalized.root);
  return {
    document: normalized,
    digest: await sha256((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify)(normalized)),
    dependencies: {
      assets: [...dependencies.assets].sort(),
      bindings: [...dependencies.bindings.values()].sort((left, right) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify)(left).localeCompare((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify)(right))),
    },
    diagnostics: [],
  };
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function renderInline(content) {
  return (content || []).map((inline) => {
    if (inline.type === 'link') return `<a href="${escapeHtml(inline.href)}">${renderInline(inline.children)}</a>`;
    let output = escapeHtml(inline.value);
    for (const mark of inline.marks || []) output = mark === 'strong' ? `<strong>${output}</strong>` : mark === 'em' ? `<em>${output}</em>` : `<code>${output}</code>`;
    return output;
  }).join('');
}

const BUILTIN_RENDERERS = {
  'layout.page': ({ node, slots }) => `<main data-sf-composition-id="${escapeHtml(node.id)}">${slots.default || ''}</main>`,
  'layout.section': ({ node, slots }) => `<section data-sf-composition-id="${escapeHtml(node.id)}">${slots.default || ''}</section>`,
  'layout.columns': ({ node, slots }) => {
    const columns = Number.isInteger(node.props?.columns) ? ` data-composition-columns="${node.props.columns}"` : '';
    return `<div class="sf-composition-columns" data-sf-composition-id="${escapeHtml(node.id)}"${columns}>${(slots.columnsList || []).map((child) => `<div class="sf-composition-column">${child}</div>`).join('')}</div>`;
  },
  'content.heading': ({ node }) => `<h${node.data.level || 2} data-sf-composition-id="${escapeHtml(node.id)}">${renderInline(node.data.content)}</h${node.data.level || 2}>`,
  'content.paragraph': ({ node }) => `<p data-sf-composition-id="${escapeHtml(node.id)}">${renderInline(node.data.content)}</p>`,
  'layout.regions': ({ node, slots }) => `<div class="sf-composition-regions" data-sf-composition-id="${escapeHtml(node.id)}"><div class="sf-composition-regions-grid">${slots.regions || ''}</div></div>`,
  'layout.region': ({ node, slots }) => {
    const props = node.props;
    const element = _regions_mjs__WEBPACK_IMPORTED_MODULE_6__.REGION_ELEMENTS[props.landmark];
    const sticky = props.sticky === true ? ' data-sf-region-sticky=""' : '';
    const label = props.label !== undefined ? ` aria-label="${escapeHtml(props.label)}"` : '';
    return `<${element} class="sf-composition-region" data-sf-composition-id="${escapeHtml(node.id)}" data-sf-region="${escapeHtml(props.name)}" data-sf-region-placement="${escapeHtml(props.placement ?? 'block')}"${sticky}${label}>${slots.default || ''}</${element}>`;
  },
  'layout.scope': ({ node, slots, routes }) => `<sf-composition-scope data-sf-composition-id="${escapeHtml(node.id)}" data-sf-routes="${escapeHtml((0,_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.routesAttribute)(routes || []))}">${slots.default || ''}</sf-composition-scope>`,
};

async function render(document, context = {}) {
  const registry = normalizeRegistry(context.registry);
  const normalized = await normalize(document, registry, context.options || {});
  if (!normalized.document) return { html: '', assets: [], hydration: [], diagnostics: normalized.diagnostics, digest: null };
  const diagnostics = [];
  const hydration = [];
  const routes = (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.resolveRoutes)(normalized.document.root, registry, normalizePorts(context.options?.ports), []);
  const renderNode = async (node) => {
    const manifest = registry.types.get(node.type);
    const slots = {};
    for (const [name, children] of Object.entries(node.slots || {})) {
      const rendered = [];
      for (const child of children) rendered.push(await renderNode(child));
      slots[name] = rendered.join('');
      slots[`${name}List`] = rendered;
    }
    const resolvedBindings = {};
    for (const binding of node.bindings || []) {
      if (context.resolveBinding) resolvedBindings[binding.target] = await context.resolveBinding(binding, { document: normalized.document, node });
    }
    let renderer = registry.renderers.get(manifest.renderer.name) || BUILTIN_RENDERERS[manifest.renderer.name];
    if (!renderer && manifest.renderer.kind === 'custom-element' && manifest.renderer.name) {
      renderer = ({ node: current, slots: currentSlots, endpoint }) => {
        const endpointAttribute = endpoint ? ` data-sf-endpoint="${escapeHtml(endpoint)}"` : '';
        const attributes = Object.entries(current.props || {}).map(([key, value]) => ` ${escapeHtml(key)}="${escapeHtml(value)}"`).join('') + endpointAttribute;
        hydration.push({ id: current.id, type: current.type, element: manifest.renderer.name });
        return `<${manifest.renderer.name}${attributes}>${Object.values(currentSlots).filter((value) => typeof value === 'string').join('')}</${manifest.renderer.name}>`;
      };
    }
    if (!renderer) {
      diagnostics.push(diagnostic('renderer_unavailable', `node:${node.id}`, `Renderer ${manifest.renderer.name} is unavailable`));
      return '';
    }
    if (node.type === 'layout.scope') hydration.push({ id: node.id, type: node.type, element: 'sf-composition-scope' });
    return renderer({ node, slots, context, resolvedBindings, manifest, routes: routes.get(node.id), endpoint: (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.endpointName)(node) });
  };
  const html = await renderNode(normalized.document.root);
  return { html, assets: normalized.dependencies.assets, hydration, diagnostics, digest: normalized.digest };
}

const Composition = Object.freeze({
  BUILTIN_EDITOR_MANIFESTS: _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_EDITOR_MANIFESTS,
  BUILTIN_FIELD_KINDS: _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.BUILTIN_FIELD_KINDS,
  BUILTIN_PORT_MANIFESTS: _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_PORT_MANIFESTS,
  Recipe: _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__.Recipe,
  applyFieldValue: _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.applyFieldValue,
  parseFieldSubmission: _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.parseFieldSubmission,
  renderFieldFallback: _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.renderFieldFallback,
  resolveFieldKind: _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.resolveFieldKind,
  validateFieldKinds: _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.validateFieldKinds,
  validateFieldValue: _fields_mjs__WEBPACK_IMPORTED_MODULE_4__.validateFieldValue,
  VALUE_TYPES: _routing_mjs__WEBPACK_IMPORTED_MODULE_8__.VALUE_TYPES,
  checkPortValue: _routing_mjs__WEBPACK_IMPORTED_MODULE_8__.checkPortValue,
  checkFragmentDescriptor: _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.checkFragmentDescriptor,
  FRAGMENT_DESCRIPTOR_SCHEMA: _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.FRAGMENT_DESCRIPTOR_SCHEMA,
  publishEffects: _fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.publishEffects,
  createPortRegistry: _routing_mjs__WEBPACK_IMPORTED_MODULE_8__.createPortRegistry,
  defineCompositionScope: _routing_mjs__WEBPACK_IMPORTED_MODULE_8__.defineCompositionScope,
  startInlineEdit,
  normalizeInline: _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.normalizeInline,
  inlineText: _inline_model_mjs__WEBPACK_IMPORTED_MODULE_7__.inlineText,
  BUILTIN_TYPE_MANIFESTS: _builtins_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILTIN_TYPE_MANIFESTS,
  createRegistry,
  extendRegistry,
  compositionTypeFromSmartManifest,
  describeRegions: _regions_mjs__WEBPACK_IMPORTED_MODULE_6__.describeRegions,
  normalize,
  projectDocumentEditorFields: _editor_mjs__WEBPACK_IMPORTED_MODULE_3__.projectDocumentEditorFields,
  projectEditorFields: _editor_mjs__WEBPACK_IMPORTED_MODULE_3__.projectEditorFields,
  render,
  resolveRecipe: _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__.resolveRecipe,
  parseRecipeJson: _recipe_mjs__WEBPACK_IMPORTED_MODULE_5__.parseRecipeJson,
  stableStringify: _canonical_mjs__WEBPACK_IMPORTED_MODULE_1__.stableStringify,
  validate,
  validateEditorManifest: _editor_mjs__WEBPACK_IMPORTED_MODULE_3__.validateEditorManifest,
});

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  globalThis.SF.Composition = Composition;
  (0,_routing_mjs__WEBPACK_IMPORTED_MODULE_8__.defineCompositionScope)();
  (0,_fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.definePageHost)();
  (0,_fragments_mjs__WEBPACK_IMPORTED_MODULE_9__.defineFragmentBoundary)();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Composition);











/***/ },

/***/ "e66d878fb4f8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ "6770fb69bd04"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RECIPE_DEFAULT_LIMITS: () => (/* binding */ RECIPE_DEFAULT_LIMITS),
/* harmony export */   Recipe: () => (/* binding */ Recipe),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   parseRecipeJson: () => (/* binding */ parseRecipeJson),
/* harmony export */   recipeDigest: () => (/* binding */ recipeDigest),
/* harmony export */   recipeNodeId: () => (/* binding */ recipeNodeId),
/* harmony export */   resolveRecipe: () => (/* binding */ resolveRecipe)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ac24888e7d3e");



// Readers take either form of a format name (simai.composition.recipe.v1, or
// simai.composition.recipe with schema_version 1): schema-name.mjs. Writers
// emit the new form. The resolved Document and its dependency receipt take
// the form of the recipe they came from: a recipe in the older form resolves
// to a simai.composition.document.v1 Document and a
// simai.composition.dependencies.v1 receipt, as Recipe 1.0.1 fixes
// (fixtures/header-switch.json, whose expected Document, receipt and
// documentDigest are published bytes); a recipe named without a version
// resolves to a Document and a receipt named without one.
// The canonicalization profile has one algorithm under two names since Recipe
// 1.1.0: simai.recipe.canonical-json.v1 and simai.recipe.canonical-json. An
// execution contract may name either; the receipt keeps the name it was given,
// and the older one when none is, so the bytes Recipe 1.0.1 fixes stay as
// they were.
const CANONICALIZATION = 'simai.recipe.canonical-json.v1';
const CANONICALIZATION_NAMES = new Set([CANONICALIZATION, 'simai.recipe.canonical-json']);

function namedLike(recipe, name) {
  return (0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.readSchema)(recipe)?.form === 'name' ? (0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)(name, 1) : { schema: `${name}.v1` };
}

const documentSchemaFor = (recipe) => namedLike(recipe, 'simai.composition.document');
const SAFE_INTEGER_MIN = -9007199254740991;
const SAFE_INTEGER_MAX = 9007199254740991;

const RECIPE_DEFAULT_LIMITS = Object.freeze({
  maxRecipeBytes: 1048576,
  maxSourceBytes: 1048576,
  maxTotalSourceBytes: 8388608,
  maxInputBytes: 1048576,
  maxTotalInputBytes: 4194304,
  maxUniqueReferences: 128,
  maxInputs: 256,
  maxReferenceDepth: 16,
  maxExpansionSteps: 10000,
  maxIntermediateBytes: 4194304,
  maxOutputBytes: 1048576,
  maxOutputNodes: 2000,
  maxOutputDepth: 32,
  maxChildrenPerSlot: 500,
  maxSelectCases: 64,
});

const HARD_LIMITS = RECIPE_DEFAULT_LIMITS;
const ENTRY_FIELDS = {
  node: new Set(['id', 'node']),
  ref: new Set(['id', 'ref', 'params', 'slots', 'extensions']),
  select: new Set(['id', 'select']),
  insertSlot: new Set(['id', 'insertSlot']),
};
const NODE_FIELDS = new Set(['type', 'data', 'props', 'presentation', 'slots', 'bindings', 'extensions']);
const RECIPE_FIELDS = new Set(['schema', 'schema_version', 'id', 'profile', 'locale', 'inputs', 'root', 'extensions']);
const INPUT_ENVELOPE_FIELDS = new Set(['schema', 'schema_version', 'scope', 'values', 'extensions']);
const MANIFEST_FIELDS = new Set(['schema', 'schema_version', 'id', 'parameters', 'slots', 'body', 'extensions']);
const INPUT_DECLARATION_FIELDS = new Set(['kind', 'schema', 'default', 'expectedOrigin', 'extensions']);
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/u;

function isObject(value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function utf8Size(value) {
  return new globalThis.TextEncoder().encode(typeof value === 'string' ? value : JSON.stringify(value)).byteLength;
}

function parseRecipeJson(text) {
  if (typeof text !== 'string' || text.charCodeAt(0) === 0xfeff) throw Object.assign(new SyntaxError('Invalid JSON input'), { code: 'invalid_json', sourcePath: '$' });
  let position = 0;
  const whitespace = () => { while (/\s/u.test(text[position] || '') && !['\u00a0'].includes(text[position])) position += 1; };
  const stringToken = () => {
    if (text[position] !== '"') throw new SyntaxError('Expected string');
    const start = position++;
    while (position < text.length) {
      const code = text.charCodeAt(position);
      if (code === 34) {
        position += 1;
        const value = JSON.parse(text.slice(start, position));
        for (let index = 0; index < value.length; index += 1) {
          const unit = value.charCodeAt(index);
          if (unit >= 0xd800 && unit <= 0xdbff) {
            const next = value.charCodeAt(index + 1);
            if (!(next >= 0xdc00 && next <= 0xdfff)) throw new SyntaxError('Unpaired surrogate');
            index += 1;
          } else if (unit >= 0xdc00 && unit <= 0xdfff) throw new SyntaxError('Unpaired surrogate');
        }
        return value;
      }
      if (code < 0x20) throw new SyntaxError('Control character in string');
      if (code === 92) {
        position += 1;
        if (text[position] === 'u') {
          if (!/^[0-9a-fA-F]{4}$/u.test(text.slice(position + 1, position + 5))) throw new SyntaxError('Invalid Unicode escape');
          position += 5;
          continue;
        }
        if (!/["\\/bfnrt]/u.test(text[position] || '')) throw new SyntaxError('Invalid escape');
      }
      position += 1;
    }
    throw new SyntaxError('Unterminated string');
  };
  const valueToken = () => {
    whitespace();
    if (text[position] === '{') {
      position += 1;
      whitespace();
      const keys = new Set();
      if (text[position] === '}') { position += 1; return; }
      while (position < text.length) {
        whitespace();
        const key = stringToken();
        if (keys.has(key)) throw new SyntaxError(`Duplicate key ${key}`);
        keys.add(key);
        whitespace();
        if (text[position++] !== ':') throw new SyntaxError('Expected colon');
        valueToken();
        whitespace();
        if (text[position] === '}') { position += 1; return; }
        if (text[position++] !== ',') throw new SyntaxError('Expected comma');
      }
      throw new SyntaxError('Unterminated object');
    }
    if (text[position] === '[') {
      position += 1;
      whitespace();
      if (text[position] === ']') { position += 1; return; }
      while (position < text.length) {
        valueToken();
        whitespace();
        if (text[position] === ']') { position += 1; return; }
        if (text[position++] !== ',') throw new SyntaxError('Expected comma');
      }
      throw new SyntaxError('Unterminated array');
    }
    if (text[position] === '"') { stringToken(); return; }
    const literal = /^(?:true|false|null|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/u.exec(text.slice(position));
    if (!literal) throw new SyntaxError('Invalid JSON value');
    position += literal[0].length;
  };
  try {
    valueToken();
    whitespace();
    if (position !== text.length) throw new SyntaxError('Trailing JSON data');
    const value = JSON.parse(text);
    assertCanonicalValue(value);
    return value;
  } catch (error) {
    if (error?.code === 'invalid_value') throw error;
    throw Object.assign(new SyntaxError(error.message), { code: 'invalid_json', sourcePath: '$' });
  }
}

async function hashBytes(value) {
  if (!globalThis.crypto?.subtle) throw new Error('composition_crypto_unavailable');
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new globalThis.TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function recipeDigest(value) {
  assertCanonicalValue(value);
  return `sha256:${await hashBytes((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(value))}`;
}

async function recipeNodeId(recipeId, segments) {
  return `n-${await hashBytes((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(['sf-composition-node-v1', recipeId, segments]))}`;
}

function assertCanonicalValue(value, path = '$', seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value < SAFE_INTEGER_MIN || value > SAFE_INTEGER_MAX) {
      throw Object.assign(new TypeError('invalid canonical number'), { code: 'invalid_value', sourcePath: path });
    }
    return;
  }
  if (typeof value !== 'object' || (!Array.isArray(value) && !isObject(value)) || seen.has(value)) {
    throw Object.assign(new TypeError('value is not canonical JSON'), { code: 'invalid_json', sourcePath: path });
  }
  seen.add(value);
  if (Array.isArray(value)) value.forEach((entry, index) => assertCanonicalValue(entry, `${path}/${index}`, seen));
  else Object.entries(value).forEach(([key, entry]) => {
    if (/^[0-9]+$/u.test(key) && Number(key) > 4294967294) {
      // It remains a normal string key; the check intentionally documents the boundary.
    }
    assertCanonicalValue(entry, `${path}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`, seen);
  });
  seen.delete(value);
}

function failure(code, sourcePath, message, referenceChain = []) {
  return { code, sourcePath, referenceChain: [...referenceChain], message };
}

function normalizeLimits(overrides = {}) {
  const limits = {};
  for (const [name, hardMaximum] of Object.entries(HARD_LIMITS)) {
    const value = overrides[name] ?? hardMaximum;
    if (!Number.isInteger(value) || value <= 0) {
      throw Object.assign(new RangeError(`Invalid limit ${name}`), { code: 'invalid_value', sourcePath: `/limits/${name}` });
    }
    if (value > hardMaximum) {
      throw Object.assign(new RangeError(`Limit ${name} exceeds the hard maximum`), { code: 'limit_exceeded', sourcePath: `/limits/${name}` });
    }
    limits[name] = value;
  }
  return limits;
}

function assertFields(value, allowed, path) {
  if (!isObject(value)) throw Object.assign(new TypeError('Expected object'), { code: 'invalid_value', sourcePath: path });
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw Object.assign(new TypeError(`Unknown field ${key}`), { code: 'unknown_field', sourcePath: `${path}/${key}` });
  }
}

function assertExtensions(extensions, path, supportedExtensions) {
  if (extensions === undefined) return;
  if (!isObject(extensions)) throw Object.assign(new TypeError('Extensions must be an object'), { code: 'invalid_value', sourcePath: path });
  for (const [name, value] of Object.entries(extensions)) {
    if (!/^[a-z][a-z0-9.-]*:[a-z][a-z0-9._-]*$/u.test(name)) throw Object.assign(new TypeError('Extension name must be namespaced'), { code: 'invalid_value', sourcePath: `${path}/${name}` });
    if (isObject(value) && value.required === true && !supportedExtensions.has(name)) throw Object.assign(new Error(`Required extension ${name} is unsupported`), { code: 'unsupported_extension', sourcePath: `${path}/${name}` });
  }
}

function assertValueExpression(expression, path) {
  if (!isObject(expression)) throw Object.assign(new TypeError('Value wrapper is required'), { code: 'invalid_value', sourcePath: path });
  const forms = ['literal', 'input', 'parameter'].filter((name) => Object.hasOwn(expression, name));
  if (forms.length !== 1 || Object.keys(expression).length !== 1) throw Object.assign(new TypeError('Value must have exactly one form'), { code: 'invalid_value', sourcePath: path });
  if (forms[0] !== 'literal' && !ID.test(expression[forms[0]] || '')) throw Object.assign(new TypeError('Value reference is invalid'), { code: 'invalid_value', sourcePath: path });
}

function entryKind(entry) {
  const kinds = ['node', 'ref', 'select', 'insertSlot'].filter((key) => Object.hasOwn(entry || {}, key));
  if (kinds.length !== 1) throw Object.assign(new TypeError('Entry must contain one form'), { code: 'invalid_value' });
  return kinds[0];
}

function validateEntrySyntax(entry, path, { insertionAllowed = false, localIds = new Set(), maxSelectCases = HARD_LIMITS.maxSelectCases, supportedExtensions = new Set() } = {}) {
  if (!isObject(entry) || !ID.test(entry.id || '')) throw Object.assign(new TypeError('Invalid entry id'), { code: 'invalid_value', sourcePath: `${path}/id` });
  const kind = entryKind(entry);
  if (kind === 'insertSlot' && !insertionAllowed) throw Object.assign(new TypeError('Insertion is only valid inside a slot'), { code: 'invalid_value', sourcePath: path });
  assertFields(entry, ENTRY_FIELDS[kind], path);
  if (localIds.has(entry.id)) throw Object.assign(new TypeError('Duplicate local id'), { code: 'duplicate_id', sourcePath: `${path}/id` });
  localIds.add(entry.id);
  if (kind === 'node') {
    assertFields(entry.node, NODE_FIELDS, `${path}/node`);
    if (!/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/u.test(entry.node.type || '')) throw Object.assign(new TypeError('Node type is invalid'), { code: 'unknown_type', sourcePath: `${path}/node/type` });
    for (const [field, expressions] of Object.entries({ data: entry.node.data, props: entry.node.props, presentation: entry.node.presentation })) {
      for (const [name, expression] of Object.entries(expressions || {})) assertValueExpression(expression, `${path}/node/${field}/${name}`);
    }
    for (const [index, binding] of (entry.node.bindings || []).entries()) {
      assertFields(binding, new Set(['input', 'target']), `${path}/node/bindings/${index}`);
      if (!ID.test(binding.input || '') || !ID.test(binding.target || '')) throw Object.assign(new TypeError('Binding is invalid'), { code: 'invalid_value', sourcePath: `${path}/node/bindings/${index}` });
    }
    assertExtensions(entry.node.extensions, `${path}/node/extensions`, supportedExtensions);
    for (const [slot, children] of Object.entries(entry.node.slots || {})) {
      if (!Array.isArray(children)) throw Object.assign(new TypeError('Slot must be an array'), { code: 'invalid_value', sourcePath: `${path}/node/slots/${slot}` });
      children.forEach((child, index) => validateEntrySyntax(child, `${path}/node/slots/${slot}/${index}`, { insertionAllowed: true, localIds, maxSelectCases, supportedExtensions }));
    }
  } else if (kind === 'ref') {
    if (!isObject(entry.ref)) throw Object.assign(new TypeError('Reference is invalid'), { code: 'invalid_value', sourcePath: `${path}/ref` });
    const referenceFields = entry.ref.policy === 'pinned'
      ? new Set(['kind', 'owner', 'ref', 'policy', 'revision', 'extensions'])
      : new Set(['kind', 'owner', 'ref', 'policy', 'pointer', 'extensions']);
    assertFields(entry.ref, referenceFields, `${path}/ref`);
    if (!['template', 'fragment'].includes(entry.ref.kind) || !['pinned', 'follow-published'].includes(entry.ref.policy)) throw Object.assign(new TypeError('Reference kind or policy is invalid'), { code: 'invalid_value', sourcePath: `${path}/ref` });
    const selector = entry.ref.policy === 'pinned' ? entry.ref.revision : entry.ref.pointer;
    if (![entry.ref.owner, entry.ref.ref, selector].every((value) => typeof value === 'string' && value)) throw Object.assign(new TypeError('Reference identity is incomplete'), { code: 'invalid_value', sourcePath: `${path}/ref` });
    for (const [name, expression] of Object.entries(entry.params || {})) assertValueExpression(expression, `${path}/params/${name}`);
    assertExtensions(entry.ref.extensions, `${path}/ref/extensions`, supportedExtensions);
    assertExtensions(entry.extensions, `${path}/extensions`, supportedExtensions);
    for (const [slot, children] of Object.entries(entry.slots || {})) {
      if (!Array.isArray(children)) throw Object.assign(new TypeError('Slot must be an array'), { code: 'invalid_value', sourcePath: `${path}/slots/${slot}` });
      children.forEach((child, index) => validateEntrySyntax(child, `${path}/slots/${slot}/${index}`, { insertionAllowed: false, localIds, maxSelectCases, supportedExtensions }));
    }
  } else if (kind === 'select') {
    assertFields(entry.select, new Set(['value', 'cases', 'missingCase']), `${path}/select`);
    assertValueExpression(entry.select.value, `${path}/select/value`);
    const cases = entry.select?.cases;
    if (!isObject(cases) || Object.keys(cases).length === 0) throw Object.assign(new TypeError('Select needs cases'), { code: 'invalid_value', sourcePath: `${path}/select/cases` });
    if (Object.keys(cases).length > maxSelectCases) throw Object.assign(new RangeError('Select case limit exceeded'), { code: 'limit_exceeded', sourcePath: `${path}/select/cases` });
    if (entry.select.missingCase !== undefined && !Object.hasOwn(cases, entry.select.missingCase)) throw Object.assign(new TypeError('Missing case must name an existing case'), { code: 'invalid_value', sourcePath: `${path}/select/missingCase` });
    for (const [key, child] of Object.entries(cases)) validateEntrySyntax(child, `${path}/select/cases/${key}`, { localIds: new Set(), maxSelectCases, supportedExtensions });
  } else if (!ID.test(entry.insertSlot || '')) {
    throw Object.assign(new TypeError('Insertion slot is invalid'), { code: 'unknown_slot', sourcePath: `${path}/insertSlot` });
  }
  return kind;
}

function checkValue(value, schema, path) {
  const errors = [];
  const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value;
  if (schema.type && schema.type !== actual) errors.push(`expected ${schema.type}`);
  if (schema.const !== undefined && (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(schema.const) !== (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(value)) errors.push('const mismatch');
  if (schema.enum && !schema.enum.some((item) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(item) === (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(value))) errors.push('enum mismatch');
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push('string too short');
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push('string too long');
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push('number too small');
    if (schema.maximum !== undefined && value > schema.maximum) errors.push('number too large');
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push('array too short');
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push('array too long');
    if (schema.items) value.forEach((item, index) => checkValue(item, schema.items, `${path}/${index}`));
  }
  if (isObject(value)) {
    for (const name of schema.required || []) if (!Object.hasOwn(value, name)) errors.push(`missing ${name}`);
    if (schema.additionalProperties === false) for (const name of Object.keys(value)) if (!Object.hasOwn(schema.properties || {}, name)) errors.push(`unknown ${name}`);
    for (const [name, child] of Object.entries(schema.properties || {})) if (Object.hasOwn(value, name)) checkValue(value[name], child, `${path}/${name}`);
  }
  if (errors.length) throw Object.assign(new TypeError(errors[0]), { code: 'invalid_value', sourcePath: path });
}

function copyExtensions(value) {
  return value === undefined ? undefined : clone(value);
}

async function resolveRecipe(recipe, context = {}) {
  const trace = [];
  const diagnostics = [];
  const referenceChain = [];
  try {
    const limits = normalizeLimits(context.limits);
    assertCanonicalValue(recipe);
    if (utf8Size(recipe) > limits.maxRecipeBytes) throw Object.assign(new RangeError('Recipe byte limit exceeded'), { code: 'limit_exceeded', sourcePath: '$' });
    if (!isObject(recipe) || !(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.isSchema)(recipe, 'simai.composition.recipe', 1)) throw Object.assign(new TypeError('Unsupported recipe schema'), { code: 'invalid_value', sourcePath: '/schema' });
    assertFields(recipe, RECIPE_FIELDS, '');
    if (!ID.test(recipe.id || '') || !['ui-layout', 'structured-content'].includes(recipe.profile)) throw Object.assign(new TypeError('Recipe identity or profile is invalid'), { code: 'invalid_value', sourcePath: '/' });
    const supportedExtensions = new Set(context.supportedExtensions || []);
    for (const [name, declaration] of Object.entries(recipe.inputs || {})) {
      assertFields(declaration, INPUT_DECLARATION_FIELDS, `/inputs/${name}`);
      if (!['parameter', 'setting', 'content'].includes(declaration.kind) || !isObject(declaration.schema)) throw Object.assign(new TypeError('Input declaration is invalid'), { code: 'invalid_value', sourcePath: `/inputs/${name}` });
      if (declaration.default) assertValueExpression(declaration.default, `/inputs/${name}/default`);
      if (declaration.default && !Object.hasOwn(declaration.default, 'literal')) throw Object.assign(new TypeError('Input default must be literal'), { code: 'invalid_value', sourcePath: `/inputs/${name}/default` });
      if (declaration.kind === 'content' && (!declaration.expectedOrigin?.owner || !declaration.expectedOrigin?.ref)) throw Object.assign(new TypeError('Content origin is required'), { code: 'input_origin_mismatch', sourcePath: `/inputs/${name}/expectedOrigin` });
      assertExtensions(declaration.extensions, `/inputs/${name}/extensions`, supportedExtensions);
    }
    assertExtensions(recipe.extensions, '/extensions', supportedExtensions);
    validateEntrySyntax(recipe.root, '/root', { localIds: new Set(), maxSelectCases: limits.maxSelectCases, supportedExtensions });
    if (Object.keys(recipe.inputs || {}).length > limits.maxInputs) throw Object.assign(new RangeError('Input limit exceeded'), { code: 'limit_exceeded', sourcePath: '/inputs' });
    const scope = context.trustedContext?.scope;
    if (typeof scope !== 'string' || !scope) throw Object.assign(new TypeError('Trusted scope is required'), { code: 'invalid_value', sourcePath: '/trustedContext/scope' });
    const inputsEnvelope = context.inputs || { ...(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.schemaFields)('simai.composition.inputs', 1), scope, values: {} };
    assertCanonicalValue(inputsEnvelope, '/inputs');
    assertFields(inputsEnvelope, INPUT_ENVELOPE_FIELDS, '/inputs');
    if (!(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.isSchema)(inputsEnvelope, 'simai.composition.inputs', 1) || inputsEnvelope.scope !== scope) throw Object.assign(new TypeError('Input scope mismatch'), { code: 'input_origin_mismatch', sourcePath: '/inputs' });

    const recipeHash = await recipeDigest(recipe);
    const limitsState = { steps: 0, sourceBytes: 0, inputBytes: 0, nodes: 0, intermediateBytes: 0 };
    const usedIds = new Set();
    const referenceCache = new Map();
    const inputCache = new Map();
    const references = [];
    const inputReceipts = [];
    const logicalPointers = [];

    const step = (sourcePath) => {
      limitsState.steps += 1;
      if (limitsState.steps > limits.maxExpansionSteps) throw Object.assign(new RangeError('Expansion step limit exceeded'), { code: 'limit_exceeded', sourcePath });
    };

    const readInput = async (name, sourcePath) => {
      step(sourcePath);
      if (inputCache.has(name)) return inputCache.get(name);
      const declaration = recipe.inputs?.[name];
      if (!declaration) throw Object.assign(new TypeError(`Unknown input ${name}`), { code: 'missing_input', sourcePath });
      trace.push({ operation: 'read-input', name, sourcePath });
      let supplied = inputsEnvelope.values?.[name];
      if (supplied === undefined && context.ports?.readInput) supplied = await context.ports.readInput(name, declaration, { scope });
      if (supplied?.status === 'denied') throw Object.assign(new Error('Input access denied'), { code: 'access_denied', sourcePath });
      if (supplied?.status === 'error') throw Object.assign(new Error('Input source failed'), { code: 'source_error', sourcePath });
      let result;
      if (supplied === undefined || supplied?.status === 'missing') {
        if (!declaration.default) throw Object.assign(new Error(`Input ${name} is missing`), { code: 'missing_input', sourcePath });
        const value = clone(declaration.default.literal);
        checkValue(value, declaration.schema, sourcePath);
        const valueDigest = await recipeDigest(value);
        const missingSource = supplied?.missingSource || (declaration.kind === 'parameter' ? undefined : { scope, owner: declaration.expectedOrigin?.owner, ref: declaration.expectedOrigin?.ref });
        if (declaration.kind !== 'parameter' && (!missingSource?.owner || !missingSource?.ref)) throw Object.assign(new Error('Missing source identity is required'), { code: 'input_origin_mismatch', sourcePath });
        result = { value, receipt: { name, kind: declaration.kind, valueDigest, ...(missingSource ? { missingSource } : {}), resolution: 'default' } };
      } else {
        limitsState.inputBytes += utf8Size(supplied);
        if (utf8Size(supplied) > limits.maxInputBytes || limitsState.inputBytes > limits.maxTotalInputBytes) throw Object.assign(new RangeError('Input byte limit exceeded'), { code: 'limit_exceeded', sourcePath });
        if (supplied.kind !== declaration.kind) throw Object.assign(new Error('Input kind mismatch'), { code: 'input_origin_mismatch', sourcePath });
        checkValue(supplied.value, declaration.schema, sourcePath);
        const valueDigest = await recipeDigest(supplied.value);
        if (valueDigest !== supplied.valueDigest) throw Object.assign(new Error('Input digest mismatch'), { code: 'input_digest_mismatch', sourcePath });
        const expected = declaration.expectedOrigin;
        if (declaration.kind !== 'parameter') {
          if (!supplied.origin || supplied.origin.scope !== scope || expected?.owner !== supplied.origin.owner || expected?.ref !== supplied.origin.ref || (expected?.revision && expected.revision !== supplied.origin.revision)) {
            throw Object.assign(new Error('Input origin mismatch'), { code: 'input_origin_mismatch', sourcePath });
          }
        }
        result = { value: clone(supplied.value), receipt: { name, kind: declaration.kind, valueDigest, ...(supplied.origin ? { origin: clone(supplied.origin) } : {}), resolution: 'provided' } };
      }
      inputCache.set(name, result);
      inputReceipts.push(result.receipt);
      return result;
    };

    const resolveValue = async (expression, parameters, sourcePath) => {
      step(sourcePath);
      if (!isObject(expression)) throw Object.assign(new TypeError('Value wrapper is required'), { code: 'invalid_value', sourcePath });
      if (Object.hasOwn(expression, 'literal')) return clone(expression.literal);
      if (Object.hasOwn(expression, 'input')) return (await readInput(expression.input, sourcePath)).value;
      if (Object.hasOwn(expression, 'parameter')) {
        if (!parameters.has(expression.parameter)) throw Object.assign(new Error(`Parameter ${expression.parameter} is missing`), { code: 'unknown_parameter', sourcePath });
        return clone(parameters.get(expression.parameter));
      }
      throw Object.assign(new TypeError('Unknown value wrapper'), { code: 'invalid_value', sourcePath });
    };

    const readReference = async (reference, sourcePath) => {
      step(sourcePath);
      const revisionKey = reference.policy === 'pinned' ? reference.revision : `pointer:${reference.pointer}`;
      const cacheKey = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)([scope, reference.kind, reference.owner, reference.ref, revisionKey]);
      if (referenceCache.has(cacheKey)) return referenceCache.get(cacheKey);
      if (referenceCache.size >= limits.maxUniqueReferences) throw Object.assign(new RangeError('Reference limit exceeded'), { code: 'limit_exceeded', sourcePath });
      if (!context.ports?.readReference) throw Object.assign(new Error('Reference port is unavailable'), { code: 'missing_reference', sourcePath });
      trace.push({ operation: 'read-reference', kind: reference.kind, owner: reference.owner, ref: reference.ref, revision: reference.revision, pointer: reference.pointer, sourcePath });
      const response = await context.ports.readReference(reference, { scope, maxBytes: limits.maxSourceBytes });
      if (response?.status === 'denied') throw Object.assign(new Error('Reference access denied'), { code: 'access_denied', sourcePath });
      if (response?.status === 'error') throw Object.assign(new Error('Reference source failed'), { code: 'source_error', sourcePath });
      if (!response?.source) throw Object.assign(new Error('Reference not found'), { code: 'missing_reference', sourcePath });
      const revision = response.revision;
      if (reference.policy === 'pinned' && revision !== reference.revision) throw Object.assign(new Error('Reference revision mismatch'), { code: 'revision_mismatch', sourcePath });
      const bytes = utf8Size(response.source);
      limitsState.sourceBytes += bytes;
      if (bytes > limits.maxSourceBytes || limitsState.sourceBytes > limits.maxTotalSourceBytes) throw Object.assign(new RangeError('Source byte limit exceeded'), { code: 'limit_exceeded', sourcePath });
      const digest = await recipeDigest(response.source);
      if (response.digest && response.digest !== digest) throw Object.assign(new Error('Reference digest mismatch'), { code: 'revision_mismatch', sourcePath });
      const result = { source: clone(response.source), revision, digest };
      referenceCache.set(cacheKey, result);
      references.push({ kind: reference.kind, owner: reference.owner, ref: reference.ref, revision, digest, scope });
      if (reference.policy === 'follow-published') logicalPointers.push({ kind: reference.kind, owner: reference.owner, ref: reference.ref, pointer: reference.pointer, generation: response.generation, resolvedRevision: revision, scope });
      return result;
    };

    const expand = async (entry, state, sourcePath) => {
      step(sourcePath);
      const kind = entryKind(entry);
      if (kind === 'select') {
        const selected = await resolveValue(entry.select.value, state.parameters, `${sourcePath}/select/value`);
        if (typeof selected !== 'string') throw Object.assign(new Error('Select value must be a string'), { code: 'invalid_value', sourcePath: `${sourcePath}/select/value` });
        let caseName = String(selected);
        if (!Object.hasOwn(entry.select.cases, caseName)) caseName = entry.select.missingCase;
        if (!caseName || !Object.hasOwn(entry.select.cases, caseName)) throw Object.assign(new Error('Select value has no case'), { code: 'invalid_value', sourcePath });
        return expand(entry.select.cases[caseName], { ...state, segments: [...state.segments, ['select', entry.id], ['case', caseName]] }, `${sourcePath}/select/cases/${caseName}`);
      }
      if (kind === 'insertSlot') {
        const entries = state.callSlots?.[entry.insertSlot] ?? state.slotDefaults?.[entry.insertSlot] ?? [];
        const output = [];
        for (let index = 0; index < entries.length; index += 1) {
          output.push(await expand(entries[index], { ...state, segments: [...state.segments, ['insertion', entry.id], ['argument-slot', entry.insertSlot]] }, `${sourcePath}/inserted/${entry.insertSlot}/${index}`));
        }
        const expanded = output.flat();
        const slot = state.slotSpecs?.[entry.insertSlot];
        if (!slot) throw Object.assign(new Error(`Unknown insertion slot ${entry.insertSlot}`), { code: 'unknown_slot', sourcePath });
        if (expanded.length < slot.min || expanded.length > slot.max) throw Object.assign(new Error(`Slot ${entry.insertSlot} has invalid cardinality`), { code: 'invalid_value', sourcePath });
        if (slot.types?.length && expanded.some((node) => !slot.types.includes(node.type))) throw Object.assign(new Error(`Slot ${entry.insertSlot} contains a forbidden type`), { code: 'unknown_type', sourcePath });
        state.usedCallSlots?.add(entry.insertSlot);
        return expanded;
      }
      if (kind === 'ref') {
        if (referenceChain.length >= limits.maxReferenceDepth) throw Object.assign(new RangeError('Reference depth exceeded'), { code: 'limit_exceeded', sourcePath });
        const refKey = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)([scope, entry.ref.kind, entry.ref.owner, entry.ref.ref, entry.ref.revision || entry.ref.pointer]);
        if (referenceChain.includes(refKey)) throw Object.assign(new Error('Reference cycle'), { code: 'reference_cycle', sourcePath });
        const resolved = await readReference(entry.ref, sourcePath);
        referenceChain.push(refKey);
        try {
          if (entry.ref.kind === 'fragment') {
            if (entry.params || entry.slots) throw Object.assign(new Error('Fragment cannot receive parameters or slots'), { code: 'invalid_value', sourcePath });
            validateEntrySyntax(resolved.source, `${sourcePath}/source`, { localIds: new Set(), maxSelectCases: limits.maxSelectCases, supportedExtensions });
            return await expand(resolved.source, { ...state, segments: [...state.segments, ['placement', entry.id]] }, `${sourcePath}/source`);
          }
          if (!(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.isSchema)(resolved.source, 'simai.composition.recipe-manifest', 1)) throw Object.assign(new Error('Template manifest is invalid'), { code: 'invalid_value', sourcePath });
          assertFields(resolved.source, MANIFEST_FIELDS, `${sourcePath}/source`);
          assertExtensions(resolved.source.extensions, `${sourcePath}/source/extensions`, supportedExtensions);
          validateEntrySyntax(resolved.source.body, `${sourcePath}/source/body`, { localIds: new Set(), maxSelectCases: limits.maxSelectCases, supportedExtensions });
          const parameters = new Map();
          for (const [name, schema] of Object.entries(resolved.source.parameters || {})) {
            const expression = entry.params?.[name] ?? schema.default;
            if (!expression) throw Object.assign(new Error(`Parameter ${name} is missing`), { code: 'unknown_parameter', sourcePath });
            const value = await resolveValue(expression, state.parameters, `${sourcePath}/params/${name}`);
            checkValue(value, schema, `${sourcePath}/params/${name}`);
            parameters.set(name, value);
          }
          for (const name of Object.keys(entry.params || {})) if (!Object.hasOwn(resolved.source.parameters || {}, name)) throw Object.assign(new Error(`Unknown parameter ${name}`), { code: 'unknown_parameter', sourcePath: `${sourcePath}/params/${name}` });
          for (const name of Object.keys(entry.slots || {})) if (!Object.hasOwn(resolved.source.slots || {}, name)) throw Object.assign(new Error(`Unknown slot ${name}`), { code: 'unknown_slot', sourcePath: `${sourcePath}/slots/${name}` });
          const defaults = Object.fromEntries(Object.entries(resolved.source.slots || {}).map(([name, spec]) => [name, spec.defaults || []]));
          for (const [name, spec] of Object.entries(resolved.source.slots || {})) {
            assertFields(spec, new Set(['min', 'max', 'types', 'defaults']), `${sourcePath}/source/slots/${name}`);
            if (!Number.isInteger(spec.min) || !Number.isInteger(spec.max) || spec.min < 0 || spec.max > limits.maxChildrenPerSlot || spec.min > spec.max) throw Object.assign(new Error(`Slot ${name} has invalid limits`), { code: 'invalid_value', sourcePath });
          }
          const usedCallSlots = new Set();
          const expanded = await expand(resolved.source.body, { ...state, parameters, callSlots: entry.slots || {}, slotDefaults: defaults, slotSpecs: resolved.source.slots || {}, usedCallSlots, segments: [...state.segments, ['placement', entry.id]] }, `${sourcePath}/source/body`);
          for (const name of Object.keys(entry.slots || {})) if (!usedCallSlots.has(name)) throw Object.assign(new Error(`Slot ${name} was not inserted`), { code: 'unknown_slot', sourcePath: `${sourcePath}/slots/${name}` });
          return expanded;
        } catch (error) {
          if (!error.referenceChain) error.referenceChain = [...referenceChain];
          throw error;
        } finally {
          referenceChain.pop();
        }
      }

      const nodePath = [...state.segments, ['node', entry.id]];
      const node = { id: await recipeNodeId(recipe.id, nodePath), type: entry.node.type };
      if (usedIds.has(node.id)) throw Object.assign(new Error('Duplicate resolved identity'), { code: 'duplicate_id', sourcePath });
      usedIds.add(node.id);
      for (const field of ['data', 'props']) {
        if (entry.node[field]) {
          node[field] = {};
          for (const [name, expression] of Object.entries(entry.node[field])) node[field][name] = await resolveValue(expression, state.parameters, `${sourcePath}/node/${field}/${name}`);
        }
      }
      if (entry.node.presentation) {
        node.presentation = {};
        for (const [name, expression] of Object.entries(entry.node.presentation)) node.presentation[name] = await resolveValue(expression, state.parameters, `${sourcePath}/node/presentation/${name}`);
      }
      if (entry.node.bindings) {
        node.bindings = [];
        for (const binding of entry.node.bindings) {
          const declaration = recipe.inputs?.[binding.input];
          if (declaration?.kind !== 'content' || !entry.node.data?.[binding.target] || entry.node.data[binding.target].input !== binding.input) throw Object.assign(new Error('Binding must match content data input'), { code: 'invalid_value', sourcePath });
          const input = await readInput(binding.input, `${sourcePath}/node/bindings/${binding.target}`);
          node.bindings.push({ owner: input.receipt.origin.owner, ref: input.receipt.origin.ref, target: binding.target, revision: input.receipt.origin.revision });
        }
      }
      if (entry.node.extensions) node.extensions = copyExtensions(entry.node.extensions);
      if (entry.node.slots) {
        node.slots = {};
        for (const [slotName, entries] of Object.entries(entry.node.slots)) {
          const children = [];
          for (let index = 0; index < entries.length; index += 1) children.push(await expand(entries[index], { ...state, segments: [...nodePath, ['slot', slotName]] }, `${sourcePath}/node/slots/${slotName}/${index}`));
          node.slots[slotName] = children.flat();
          if (node.slots[slotName].length > limits.maxChildrenPerSlot) throw Object.assign(new RangeError('Slot child limit exceeded'), { code: 'limit_exceeded', sourcePath });
        }
      }
      limitsState.nodes += 1;
      if (limitsState.nodes > limits.maxOutputNodes) throw Object.assign(new RangeError('Output node limit exceeded'), { code: 'limit_exceeded', sourcePath });
      limitsState.intermediateBytes += utf8Size(node);
      if (limitsState.intermediateBytes > limits.maxIntermediateBytes) throw Object.assign(new RangeError('Intermediate byte limit exceeded'), { code: 'limit_exceeded', sourcePath });
      return node;
    };

    const root = await expand(recipe.root, { parameters: new Map(), callSlots: {}, slotDefaults: {}, segments: [] }, '/root');
    if (Array.isArray(root)) throw Object.assign(new Error('Root must resolve to one node'), { code: 'invalid_resolved_document', sourcePath: '/root' });
    const document = { ...documentSchemaFor(recipe), id: recipe.id, profile: recipe.profile, ...(recipe.locale ? { locale: recipe.locale } : {}), root };
    const outputDepth = (node) => 1 + Math.max(0, ...Object.values(node.slots || {}).flat().map(outputDepth));
    if (outputDepth(root) > limits.maxOutputDepth) throw Object.assign(new RangeError('Output depth limit exceeded'), { code: 'limit_exceeded', sourcePath: '/root' });
    const outputBytes = utf8Size(document);
    if (outputBytes > limits.maxOutputBytes) throw Object.assign(new RangeError('Output byte limit exceeded'), { code: 'limit_exceeded', sourcePath: '/root' });
    const { normalize } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "32dfc4431a24"));
    const normalized = await normalize(document, context.registry, { limits: { maxDocumentBytes: limits.maxOutputBytes, maxDepth: limits.maxOutputDepth, maxNodes: limits.maxOutputNodes, maxChildrenPerSlot: limits.maxChildrenPerSlot }, supportedExtensions: context.supportedExtensions, ports: context.compositionPorts });
    if (!normalized.document) throw Object.assign(new Error('Resolved document is invalid'), { code: 'invalid_resolved_document', sourcePath: '/root', details: normalized.diagnostics });
    const executionContract = context.executionContract;
    if (!executionContract?.contractDigest || !executionContract?.registryDigest || !executionContract?.rendererDigest) throw Object.assign(new Error('Execution contract is required'), { code: 'invalid_value', sourcePath: '/executionContract' });
    const canonicalization = executionContract.canonicalization ?? CANONICALIZATION;
    if (!CANONICALIZATION_NAMES.has(canonicalization)) throw Object.assign(new Error('Unsupported canonicalization profile'), { code: 'incompatible_profile', sourcePath: '/executionContract/canonicalization' });
    const dependencyReceipt = {
      ...namedLike(recipe, 'simai.composition.dependencies'),
      scope,
      recipeDigest: recipeHash,
      documentDigest: `sha256:${normalized.digest}`,
      references,
      inputs: inputReceipts,
      logicalPointers,
      executionContract: { ...clone(executionContract), canonicalization },
    };
    return { document: normalized.document, dependencyReceipt, trace, diagnostics };
  } catch (error) {
    diagnostics.push(failure(error.code || 'source_error', error.sourcePath || '$', error.message || 'Recipe resolution failed', error.referenceChain || referenceChain));
    if (error.details) diagnostics.push(...error.details.map((entry) => ({ ...entry, sourcePath: entry.path || error.sourcePath || '$' })));
    return { document: null, dependencyReceipt: null, trace, diagnostics };
  }
}

const Recipe = Object.freeze({
  defaultLimits: RECIPE_DEFAULT_LIMITS,
  digest: recipeDigest,
  nodeId: recipeNodeId,
  parseJson: parseRecipeJson,
  resolve: resolveRecipe,
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Recipe);


/***/ },

/***/ "68efac8c1b57"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REGION_ACCEPTS: () => (/* binding */ REGION_ACCEPTS),
/* harmony export */   REGION_ELEMENTS: () => (/* binding */ REGION_ELEMENTS),
/* harmony export */   REGION_LANDMARKS: () => (/* binding */ REGION_LANDMARKS),
/* harmony export */   REGION_LIMITS: () => (/* binding */ REGION_LIMITS),
/* harmony export */   REGION_PLACEMENTS: () => (/* binding */ REGION_PLACEMENTS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   describeRegions: () => (/* binding */ describeRegions),
/* harmony export */   validateRegionRules: () => (/* binding */ validateRegionRules)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");


// Declared-region layout rules. Region names are chosen by the document author;
// Framework owns only landmark semantics, placement, cardinality and nesting.
const REGION_LANDMARKS = Object.freeze(['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'none']);
const REGION_PLACEMENTS = Object.freeze(['block', 'start', 'center', 'end']);
const REGION_ACCEPTS = Object.freeze(['layout', 'content', 'smart']);
const REGION_LIMITS = Object.freeze({ maxRegionsPerLayout: 12, maxRegionLayoutNesting: 4 });
const REGION_ELEMENTS = Object.freeze({
  banner: 'header',
  navigation: 'nav',
  main: 'main',
  complementary: 'aside',
  contentinfo: 'footer',
  region: 'section',
  none: 'div',
});

const DOCUMENT_LEVEL_LANDMARKS = new Set(['banner', 'main', 'contentinfo']);
const PLACEMENT_RANK = { start: 0, center: 1, end: 2 };

const diagnostic = (code, path, message) => ({ code, path, message });

function landmarkOf(node) {
  return node?.type === 'layout.region' && typeof node.props?.landmark === 'string' ? node.props.landmark : null;
}

function validateRegionList(node, path, diagnostics) {
  const regions = Array.isArray(node.slots?.regions) ? node.slots.regions : [];
  const names = new Set();
  let bandRank = -1;
  regions.forEach((region, index) => {
    const regionPath = `${path}.slots.regions[${index}]`;
    if (region?.type !== 'layout.region') return;
    const name = region.props?.name;
    if (typeof name === 'string') {
      if (names.has(name)) diagnostics.push(diagnostic('region_name_duplicate', `${regionPath}.props.name`, `Region ${name} is declared twice in one layout`));
      names.add(name);
    }
    const placement = region.props?.placement ?? 'block';
    if (placement === 'block') {
      bandRank = -1;
      return;
    }
    const rank = PLACEMENT_RANK[placement];
    if (rank === undefined) return;
    if (rank < bandRank) diagnostics.push(diagnostic('region_order_invalid', `${regionPath}.props.placement`, 'Side-by-side regions must be declared in start, center, end order'));
    bandRank = Math.max(bandRank, rank);
  });
}

function validateRegionNode(node, path, context, diagnostics) {
  const props = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.props) ? node.props : {};
  const landmark = landmarkOf(node);
  if (landmark && DOCUMENT_LEVEL_LANDMARKS.has(landmark) && (context.insideLandmark || context.insidePage)) {
    diagnostics.push(diagnostic('region_landmark_context', `${path}.props.landmark`, `${landmark} is only allowed outside other landmarks and layout.page`));
  }
  if (landmark === 'region' && props.label === undefined) {
    diagnostics.push(diagnostic('region_label_required', `${path}.props.label`, 'A region landmark requires an accessible label'));
  }
  if (landmark === 'none' && props.label !== undefined) {
    diagnostics.push(diagnostic('region_label_forbidden', `${path}.props.label`, 'A region without a landmark cannot carry an accessible label'));
  }
  const children = Array.isArray(node.slots?.default) ? node.slots.default : [];
  const min = Number.isInteger(props.min_items) ? props.min_items : 0;
  const max = Number.isInteger(props.max_items) ? props.max_items : 500;
  if (min > max) diagnostics.push(diagnostic('region_bounds_invalid', `${path}.props`, 'min_items must not exceed max_items'));
  else if (children.length < min || children.length > max) diagnostics.push(diagnostic('region_cardinality', `${path}.slots.default`, 'Region child count is outside its declared range'));
  if (Array.isArray(props.accepts)) {
    const accepted = new Set(props.accepts);
    children.forEach((child, index) => {
      const manifest = context.registry.types.get(child?.type);
      if (manifest && !accepted.has(manifest.category)) {
        diagnostics.push(diagnostic('region_child_category_forbidden', `${path}.slots.default[${index}]`, `${manifest.category} is not accepted by this region`));
      }
    });
  }
}

/**
 * Applies declared-region rules to a structurally valid Document root.
 * The generic validator has already checked manifests, props and slot types.
 */
function validateRegionRules(root, registry, diagnostics) {
  const landmarkUse = new Map();
  const visit = (node, path, context) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node)) return;
    if (node.type === 'layout.region' && context.parentType !== 'layout.regions') {
      diagnostics.push(diagnostic('region_parent_invalid', path, 'layout.region must be a direct child of layout.regions'));
    }
    let next = { ...context, parentType: node.type };
    if (node.type === 'layout.page') next.insidePage = true;
    if (node.type === 'layout.regions') {
      next.regionDepth = context.regionDepth + 1;
      if (next.regionDepth > REGION_LIMITS.maxRegionLayoutNesting) diagnostics.push(diagnostic('region_nesting_limit', path, 'Region layouts are nested too deeply'));
      validateRegionList(node, path, diagnostics);
    }
    if (node.type === 'layout.region') {
      validateRegionNode(node, path, { ...context, registry }, diagnostics);
      const landmark = landmarkOf(node);
      if (landmark && landmark !== 'none') {
        if (!landmarkUse.has(landmark)) landmarkUse.set(landmark, []);
        landmarkUse.get(landmark).push({ path, label: node.props?.label });
        next = { ...next, insideLandmark: true };
      }
    }
    for (const [slotName, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (!Array.isArray(children)) continue;
      children.forEach((child, index) => visit(child, `${path}.slots.${slotName}[${index}]`, next));
    }
  };
  visit(root, '$.root', { parentType: null, insidePage: false, insideLandmark: false, regionDepth: 0 });
  for (const [landmark, uses] of landmarkUse) {
    if (landmark === 'main' && uses.length > 1) {
      for (const use of uses.slice(1)) diagnostics.push(diagnostic('region_landmark_duplicate', `${use.path}.props.landmark`, 'A document can contain only one main region'));
      continue;
    }
    if (uses.length < 2) continue;
    const labels = new Set();
    for (const use of uses) {
      if (use.label === undefined) {
        // A region landmark without a label is already reported once above.
        if (landmark !== 'region') diagnostics.push(diagnostic('region_label_required', `${use.path}.props.label`, `Repeated ${landmark} regions require distinct labels`));
        continue;
      }
      if (labels.has(use.label)) diagnostics.push(diagnostic('region_label_duplicate', `${use.path}.props.label`, `Repeated ${landmark} regions require distinct labels`));
      else labels.add(use.label);
    }
  }
}

async function sha256(value) {
  const bytes = new globalThis.TextEncoder().encode(value);
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Lists every declared region of an already normalized Document with a
 * digest of its canonical subtree. Products use the digest to invalidate only
 * outputs that depend on a changed region; the list order is document order.
 */
async function describeRegions(document) {
  const regions = [];
  const visit = async (node, path, layout) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node)) return;
    if (node.type === 'layout.region' && layout) {
      const props = node.props || {};
      regions.push({
        layout,
        node: node.id,
        name: props.name,
        landmark: props.landmark,
        placement: props.placement ?? 'block',
        path,
        digest: `sha256:${await sha256((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)(node)))}`,
      });
    }
    const nextLayout = node.type === 'layout.regions' ? node.id : null;
    for (const [slotName, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (!Array.isArray(children)) continue;
      for (let index = 0; index < children.length; index += 1) await visit(children[index], `${path}.slots.${slotName}[${index}]`, nextLayout);
    }
  };
  await visit(document?.root, '$.root', null);
  return regions;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ describeRegions, validateRegionRules });


/***/ },

/***/ "4aea5d6d49c7"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CompositionRouteController: () => (/* binding */ CompositionRouteController),
/* harmony export */   ENDPOINT_EXTENSION: () => (/* binding */ ENDPOINT_EXTENSION),
/* harmony export */   PORT_OUTPUT_EVENT: () => (/* binding */ PORT_OUTPUT_EVENT),
/* harmony export */   ROUTE_STATE_EVENT: () => (/* binding */ ROUTE_STATE_EVENT),
/* harmony export */   ROUTING_LIMITS: () => (/* binding */ ROUTING_LIMITS),
/* harmony export */   VALUE_TYPES: () => (/* binding */ VALUE_TYPES),
/* harmony export */   checkPortValue: () => (/* binding */ checkPortValue),
/* harmony export */   createPortRegistry: () => (/* binding */ createPortRegistry),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineCompositionScope: () => (/* binding */ defineCompositionScope),
/* harmony export */   endpointName: () => (/* binding */ endpointName),
/* harmony export */   parseRoutesAttribute: () => (/* binding */ parseRoutesAttribute),
/* harmony export */   portsForType: () => (/* binding */ portsForType),
/* harmony export */   resolveRoutes: () => (/* binding */ resolveRoutes),
/* harmony export */   routesAttribute: () => (/* binding */ routesAttribute),
/* harmony export */   sameValueType: () => (/* binding */ sameValueType),
/* harmony export */   valueTypeEntry: () => (/* binding */ valueTypeEntry),
/* harmony export */   valueTypeName: () => (/* binding */ valueTypeName)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ac24888e7d3e");



// Generic cross-composite routing. A layout.scope node is the common parent
// that declares typed routes between endpoint descendants. Routes name only
// endpoints and published ports; they never carry endpoints, methods, actions,
// expressions or transformations. Products keep data access and authorization.

const ENDPOINT_EXTENSION = 'simai.composition:endpoint';
const PORT_OUTPUT_EVENT = 'sf-port-output';
const ROUTE_STATE_EVENT = 'sf-composition-route-state';
const ROUTING_LIMITS = Object.freeze({
  maxRoutesPerScope: 32,
  maxEndpointsPerScope: 64,
  maxFanOut: 8,
  maxScopeNesting: 4,
  maxReentrancy: 8,
  maxValueBytes: 65536,
});

const NAME_PATTERN = /^[a-z][a-z0-9-]{0,31}$/u;
const ROUTE_ID_PATTERN = /^[a-z][a-z0-9-]{0,63}$/u;
const CONTROL = /[\u0000-\u001f\u007f]/u;

const diagnostic = (code, path, message) => ({ code, path, message });

function checkedRecordId(value) {
  if (typeof value === 'string') return value.length > 0 && value.length <= 256 && !CONTROL.test(value);
  return Number.isSafeInteger(value);
}

function freezeList(list) {
  return Object.freeze([...list]);
}

// The page-level value types (interface fragments, 2026-10-15) are closed
// objects: a key a type does not name is refused, never carried through.
function closedObject(value, required, optional, type) {
  if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) throw new TypeError(`${type} value is not an object`);
  const keys = Object.keys(value);
  if (!required.every((key) => keys.includes(key))) throw new TypeError(`${type} value misses a required key`);
  if (!keys.every((key) => required.includes(key) || optional.includes(key))) throw new TypeError(`${type} value has an undeclared key`);
}

const TOKEN = /^[a-z][a-z0-9._:-]{0,127}$/u;
const isToken = (value) => typeof value === 'string' && TOKEN.test(value);
const isCollection = (value) => typeof value === 'string' && value.length > 0 && value.length <= 128 && !CONTROL.test(value);
const isRevision = (value) => (typeof value === 'string' && value.length > 0 && value.length <= 128 && !CONTROL.test(value)) || Number.isSafeInteger(value);
const PREFERENCE_KEY = /^[\w.*:-]+(?:\/[\w.*:/-]+)?$/u;
// An address inside the same site: a path, never a scheme of its own, never
// another origin's protocol-relative form.
const isLocalUrl = (value) => typeof value === 'string' && value.length > 0 && value.length <= 2048
  && !CONTROL.test(value) && value.startsWith('/') && !value.startsWith('//');
const COLLECTION_SCHEMA = { type: 'string', minLength: 1, maxLength: 128 };
const RECORD_ID_SCHEMA = { oneOf: [{ type: 'string', minLength: 1, maxLength: 256 }, { type: 'integer', minimum: -9007199254740991, maximum: 9007199254740991 }] };
const REVISION_SCHEMA = { oneOf: [{ type: 'string', minLength: 1, maxLength: 128 }, { type: 'integer', minimum: -9007199254740991, maximum: 9007199254740991 }] };
const TOKEN_SCHEMA = { type: 'string', pattern: '^[a-z][a-z0-9._:-]{0,127}$' };

// Closed value-type vocabulary. Each validator returns an immutable copy or
// throws TypeError; there is no coercion between types.
const VALUE_TYPES = Object.freeze({
  'record-ids.v1': Object.freeze({
    summary: 'Ordered unique opaque record identities: nonempty strings up to 256 code units without control characters, or safe integers. Up to 1000 items; empty means no selection.',
    schema: {
      type: 'array',
      maxItems: 1000,
      uniqueItems: true,
      items: { oneOf: [{ type: 'string', minLength: 1, maxLength: 256 }, { type: 'integer', minimum: -9007199254740991, maximum: 9007199254740991 }] },
    },
    check(value) {
      if (!Array.isArray(value) || value.length > 1000 || !value.every(checkedRecordId)) throw new TypeError('record-ids.v1 value is invalid');
      const seen = new Set(value.map((entry) => `${typeof entry}:${entry}`));
      if (seen.size !== value.length) throw new TypeError('record-ids.v1 value has duplicates');
      return freezeList(value);
    },
  }),
  'record-id.v1': Object.freeze({
    summary: 'One opaque record identity or null for none.',
    schema: { oneOf: [{ type: 'null' }, { type: 'string', minLength: 1, maxLength: 256 }, { type: 'integer', minimum: -9007199254740991, maximum: 9007199254740991 }] },
    check(value) {
      if (value !== null && !checkedRecordId(value)) throw new TypeError('record-id.v1 value is invalid');
      return value;
    },
  }),
  'text.v1': Object.freeze({
    summary: 'Plain text up to 2000 code units; never interpreted as markup or a query language.',
    schema: { type: 'string', maxLength: 2000 },
    check(value) {
      if (typeof value !== 'string' || value.length > 2000) throw new TypeError('text.v1 value is invalid');
      return value;
    },
  }),
  'boolean.v1': Object.freeze({
    summary: 'A strict boolean.',
    schema: { type: 'boolean' },
    check(value) {
      if (typeof value !== 'boolean') throw new TypeError('boolean.v1 value is invalid');
      return value;
    },
  }),
  'record-changed.v1': Object.freeze({
    summary: 'A record changed: its collection, identity and new revision, and optionally the keys of the fields that changed (up to 256). Says what changed, never the values.',
    schema: {
      type: 'object', additionalProperties: false, required: ['collection', 'id', 'revision'],
      properties: {
        collection: COLLECTION_SCHEMA, id: RECORD_ID_SCHEMA, revision: REVISION_SCHEMA,
        fields: { type: 'array', maxItems: 256, uniqueItems: true, items: { type: 'string', minLength: 1, maxLength: 128 } },
      },
    },
    check(value) {
      closedObject(value, ['collection', 'id', 'revision'], ['fields'], 'record-changed.v1');
      if (!isCollection(value.collection) || !checkedRecordId(value.id) || !isRevision(value.revision)) throw new TypeError('record-changed.v1 value is invalid');
      const out = { collection: value.collection, id: value.id, revision: value.revision };
      if (value.fields !== undefined) {
        const fields = value.fields;
        if (!Array.isArray(fields) || fields.length > 256 || !fields.every(isCollection) || new Set(fields).size !== fields.length) throw new TypeError('record-changed.v1 fields are invalid');
        out.fields = freezeList(fields);
      }
      return Object.freeze(out);
    },
  }),
  'record-removed.v1': Object.freeze({
    summary: 'A record was removed from its collection.',
    schema: { type: 'object', additionalProperties: false, required: ['collection', 'id'], properties: { collection: COLLECTION_SCHEMA, id: RECORD_ID_SCHEMA } },
    check(value) {
      closedObject(value, ['collection', 'id'], [], 'record-removed.v1');
      if (!isCollection(value.collection) || !checkedRecordId(value.id)) throw new TypeError('record-removed.v1 value is invalid');
      return Object.freeze({ collection: value.collection, id: value.id });
    },
  }),
  'collection-changed.v1': Object.freeze({
    summary: 'Something in a collection changed that a list should read again; reason is a short token (created, imported, reordered, settings ...).',
    schema: { type: 'object', additionalProperties: false, required: ['collection', 'reason'], properties: { collection: COLLECTION_SCHEMA, reason: TOKEN_SCHEMA } },
    check(value) {
      closedObject(value, ['collection', 'reason'], [], 'collection-changed.v1');
      if (!isCollection(value.collection) || !isToken(value.reason)) throw new TypeError('collection-changed.v1 value is invalid');
      return Object.freeze({ collection: value.collection, reason: value.reason });
    },
  }),
  'files-moved.v1': Object.freeze({
    summary: 'Files moved between folders: their identities (1 to 1000, unique), the folder they left and the one they went to; null is the root.',
    schema: {
      type: 'object', additionalProperties: false, required: ['ids', 'from', 'to'],
      properties: {
        ids: { type: 'array', minItems: 1, maxItems: 1000, uniqueItems: true, items: RECORD_ID_SCHEMA },
        from: { oneOf: [{ type: 'null' }, ...RECORD_ID_SCHEMA.oneOf] },
        to: { oneOf: [{ type: 'null' }, ...RECORD_ID_SCHEMA.oneOf] },
      },
    },
    check(value) {
      closedObject(value, ['ids', 'from', 'to'], [], 'files-moved.v1');
      const ids = value.ids;
      if (!Array.isArray(ids) || ids.length === 0 || ids.length > 1000 || !ids.every(checkedRecordId)) throw new TypeError('files-moved.v1 ids are invalid');
      if (new Set(ids.map((entry) => `${typeof entry}:${entry}`)).size !== ids.length) throw new TypeError('files-moved.v1 ids have duplicates');
      const folder = (entry) => entry === null || checkedRecordId(entry);
      if (!folder(value.from) || !folder(value.to)) throw new TypeError('files-moved.v1 folder is invalid');
      return Object.freeze({ ids: freezeList(ids), from: value.from, to: value.to });
    },
  }),
  'counter.v1': Object.freeze({
    summary: 'A named count changed: key is a token (notifications, requests.new ...), value a non-negative safe integer.',
    schema: { type: 'object', additionalProperties: false, required: ['key', 'value'], properties: { key: TOKEN_SCHEMA, value: { type: 'integer', minimum: 0, maximum: 9007199254740991 } } },
    check(value) {
      closedObject(value, ['key', 'value'], [], 'counter.v1');
      if (!isToken(value.key) || !Number.isSafeInteger(value.value) || value.value < 0) throw new TypeError('counter.v1 value is invalid');
      return Object.freeze({ key: value.key, value: value.value });
    },
  }),
  'navigation.v1': Object.freeze({
    summary: 'Go to an address of the same site, in a named region: url is a path (starting with one slash, up to 2048 code units), region a region name.',
    schema: { type: 'object', additionalProperties: false, required: ['url', 'region'], properties: { url: { type: 'string', minLength: 1, maxLength: 2048, pattern: '^/(?!/)' }, region: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,31}$' } } },
    check(value) {
      closedObject(value, ['url', 'region'], [], 'navigation.v1');
      if (!isLocalUrl(value.url) || typeof value.region !== 'string' || !NAME_PATTERN.test(value.region)) throw new TypeError('navigation.v1 value is invalid');
      return Object.freeze({ url: value.url, region: value.region });
    },
  }),
  'preference-changed.v1': Object.freeze({
    summary: 'A person changed a view preference: the SF.Preferences key (sf-table/<key>, sf-table/*, sf-admin-menu/main ...). Says which, never the value.',
    schema: { type: 'object', additionalProperties: false, required: ['key'], properties: { key: { type: 'string', minLength: 1, maxLength: 256, pattern: '^[\\w.*:-]+(?:/[\\w.*:/-]+)?$' } } },
    check(value) {
      closedObject(value, ['key'], [], 'preference-changed.v1');
      if (typeof value.key !== 'string' || value.key.length > 256 || !PREFERENCE_KEY.test(value.key)) throw new TypeError('preference-changed.v1 value is invalid');
      return Object.freeze({ key: value.key });
    },
  }),
});

const own = (object, key) => (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(object) && typeof key === 'string' && Object.hasOwn(object, key);

// Names carry no version (owner, 2026-10-19; journal record
// value-types-without-version). A value type is read by its bare name
// (record-removed) or by the older label with the version (record-removed.v1)
// until the change journal retires the older one. VALUE_TYPES and the
// registries keep the older labels as keys, so published bytes and digests do
// not move; this is the one place that reads either form.
const VALUE_TYPE_LABELS = Object.freeze(Object.assign(Object.create(null),
  Object.fromEntries(Object.keys(VALUE_TYPES).map((label) => [label.replace(/\.v1$/u, ''), label]))));

/** The bare name of a value type given in either form, or null when the vocabulary has no such type. */
function valueTypeName(name) {
  if (typeof name !== 'string') return null;
  if (Object.hasOwn(VALUE_TYPE_LABELS, name)) return name;
  if (Object.hasOwn(VALUE_TYPES, name)) return name.replace(/\.v1$/u, '');
  return null;
}

/** Whether two value types are the same type, whichever form each is named in. */
function sameValueType(left, right) {
  const name = valueTypeName(left);
  return name !== null && name === valueTypeName(right);
}

/** The vocabulary entry {summary, schema, check} of a value type named in either form, or null. */
function valueTypeEntry(name) {
  const bare = valueTypeName(name);
  return bare === null ? null : VALUE_TYPES[VALUE_TYPE_LABELS[bare]];
}

const knownValueType = (name) => valueTypeName(name) !== null;

function checkPortValue(valueType, value) {
  if (!knownValueType(valueType)) throw new TypeError(`Unknown value type ${valueType}`);
  const type = valueTypeEntry(valueType);
  const checked = type.check(value);
  if (new globalThis.TextEncoder().encode(JSON.stringify(checked)).byteLength > ROUTING_LIMITS.maxValueBytes) throw new TypeError('Port value is too large');
  return checked;
}

function createPortRegistry(manifests = [], options = {}) {
  const elements = new Map();
  for (const manifest of manifests) {
    // Either form of the format name (schema-name.mjs).
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(manifest) || !(0,_schema_name_mjs__WEBPACK_IMPORTED_MODULE_1__.isSchema)(manifest, 'simai.composition.port-manifest', 1)) throw new TypeError('composition_port_manifest_invalid');
    if (elements.has(manifest.element)) throw new TypeError(`composition_port_manifest_duplicate:${manifest.element}`);
    for (const port of [...Object.values(manifest.outputs || {}), ...Object.values(manifest.inputs || {})]) {
      if (!knownValueType(port.value)) throw new TypeError(`composition_port_value_type_unknown:${port.value}`);
    }
    elements.set(manifest.element, (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.canonical)(manifest));
  }
  const bindings = new Map(Object.entries(options.bindings || {}));
  for (const [type, element] of bindings) {
    if (!elements.has(element)) throw new TypeError(`composition_port_binding_unknown:${type}`);
  }
  return { elements, bindings };
}

function portsForType(typeManifest, ports) {
  if (!typeManifest || !ports) return null;
  const bound = ports.bindings.get(typeManifest.type);
  if (bound) return ports.elements.get(bound) || null;
  if (typeManifest.renderer?.kind === 'custom-element') return ports.elements.get(typeManifest.renderer.name) || null;
  return null;
}

function validEndpointExtension(extension) {
  return (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(extension) && Object.keys(extension).length === 1
    && typeof extension.name === 'string' && NAME_PATTERN.test(extension.name);
}

function endpointName(node) {
  const extension = own(node?.extensions, ENDPOINT_EXTENSION) ? node.extensions[ENDPOINT_EXTENSION] : undefined;
  return validEndpointExtension(extension) ? extension.name : undefined;
}

function collectScope(scopeNode, path) {
  const endpoints = new Map();
  const problems = [];
  const visit = (node, nodePath, nested) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node)) return;
    if (node !== scopeNode) {
      const extension = own(node.extensions, ENDPOINT_EXTENSION) ? node.extensions[ENDPOINT_EXTENSION] : undefined;
      // Shape errors are reported once for every node by resolveRoutes.
      if (validEndpointExtension(extension) && !nested) {
        if (endpoints.has(extension.name)) {
          problems.push(diagnostic('route_endpoint_duplicate', `${nodePath}.extensions.${ENDPOINT_EXTENSION}`, `Endpoint ${extension.name} is declared twice in one scope`));
        } else {
          endpoints.set(extension.name, { node, path: nodePath });
        }
      }
      // A nested scope encapsulates its own endpoints.
      if (node.type === 'layout.scope') nested = true;
    }
    for (const [slotName, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (Array.isArray(children)) children.forEach((child, index) => visit(child, `${nodePath}.slots.${slotName}[${index}]`, nested));
    }
  };
  visit(scopeNode, path, false);
  return { endpoints, problems };
}

function findCycle(edges) {
  const graph = new Map();
  for (const [from, to] of edges) {
    if (!graph.has(from)) graph.set(from, new Set());
    graph.get(from).add(to);
  }
  const state = new Map();
  const walk = (node) => {
    state.set(node, 'active');
    for (const next of graph.get(node) || []) {
      if (state.get(next) === 'active') return true;
      if (!state.has(next) && walk(next)) return true;
    }
    state.set(node, 'done');
    return false;
  };
  return [...graph.keys()].some((node) => !state.has(node) && walk(node));
}

/**
 * Resolves and validates every layout.scope in a Document. Returns a map of
 * scope node id to typed routes; problems are appended to diagnostics.
 */
function resolveRoutes(root, registry, ports, diagnostics = []) {
  const resolved = new Map();
  const visit = (node, path, scopeDepth) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node)) return;
    if (own(node.extensions, ENDPOINT_EXTENSION) && !validEndpointExtension(node.extensions[ENDPOINT_EXTENSION])) {
      diagnostics.push(diagnostic('route_endpoint_invalid', `${path}.extensions.${ENDPOINT_EXTENSION}`, 'Endpoint extension must contain only a valid name'));
    }
    let depth = scopeDepth;
    if (node.type === 'layout.scope') {
      depth += 1;
      if (depth > ROUTING_LIMITS.maxScopeNesting) diagnostics.push(diagnostic('scope_nesting_limit', path, 'Routing scopes are nested too deeply'));
      const routes = Array.isArray(node.props?.routes) ? node.props.routes : [];
      const { endpoints, problems } = collectScope(node, path);
      diagnostics.push(...problems);
      if (endpoints.size > ROUTING_LIMITS.maxEndpointsPerScope) diagnostics.push(diagnostic('route_limit', path, 'Scope declares too many endpoints'));
      const ids = new Set();
      const inputs = new Set();
      const fanOut = new Map();
      const edges = [];
      const typed = [];
      routes.forEach((route, index) => {
        const routePath = `${path}.props.routes[${index}]`;
        if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(route) || !(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(route.from) || !(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(route.to)) return;
        if (ids.has(route.id)) diagnostics.push(diagnostic('route_id_duplicate', `${routePath}.id`, `Route ${route.id} is declared twice`));
        ids.add(route.id);
        const ends = {};
        for (const side of ['from', 'to']) {
          const endpoint = typeof route[side].endpoint === 'string' ? endpoints.get(route[side].endpoint) : undefined;
          if (!endpoint) {
            diagnostics.push(diagnostic('route_endpoint_unknown', `${routePath}.${side}.endpoint`, `Endpoint ${route[side].endpoint} is not declared in this scope`));
            continue;
          }
          const portManifest = portsForType(registry.types.get(endpoint.node.type), ports);
          const direction = side === 'from' ? 'outputs' : 'inputs';
          const opposite = side === 'from' ? 'inputs' : 'outputs';
          const port = own(portManifest?.[direction], route[side].port) ? portManifest[direction][route[side].port] : undefined;
          if (!port) {
            const wrongDirection = own(portManifest?.[opposite], route[side].port);
            diagnostics.push(wrongDirection
              ? diagnostic('route_port_direction', `${routePath}.${side}.port`, `${route[side].port} is not ${side === 'from' ? 'an output' : 'an input'}`)
              : diagnostic('route_port_unknown', `${routePath}.${side}.port`, `${endpoint.node.type} publishes no ${side === 'from' ? 'output' : 'input'} ${route[side].port}`));
            continue;
          }
          ends[side] = { endpoint: route[side].endpoint, port: route[side].port, value: port.value, element: portManifest.element };
        }
        if (route.from.endpoint === route.to.endpoint) diagnostics.push(diagnostic('route_self', routePath, 'A route cannot connect an endpoint to itself'));
        const inputKey = `${route.to.endpoint}.${route.to.port}`;
        if (inputs.has(inputKey)) diagnostics.push(diagnostic('route_input_conflict', `${routePath}.to`, `Input ${inputKey} already has a route`));
        inputs.add(inputKey);
        const outputKey = `${route.from.endpoint}.${route.from.port}`;
        fanOut.set(outputKey, (fanOut.get(outputKey) || 0) + 1);
        if (fanOut.get(outputKey) > ROUTING_LIMITS.maxFanOut) diagnostics.push(diagnostic('route_fanout_limit', `${routePath}.from`, `Output ${outputKey} feeds too many routes`));
        edges.push([route.from.endpoint, route.to.endpoint]);
        if (ends.from && ends.to) {
          if (!sameValueType(ends.from.value, ends.to.value)) diagnostics.push(diagnostic('route_type_mismatch', routePath, `${ends.from.value} cannot feed ${ends.to.value}`));
          else typed.push({ id: route.id, from: ends.from, to: ends.to });
        }
      });
      if (findCycle(edges.filter(([from, to]) => from !== to))) diagnostics.push(diagnostic('route_cycle', `${path}.props.routes`, 'Routes form a cycle between endpoints'));
      resolved.set(node.id, typed);
    }
    for (const [slotName, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (Array.isArray(children)) children.forEach((child, index) => visit(child, `${path}.slots.${slotName}[${index}]`, depth));
    }
  };
  visit(root, '$.root', 0);
  return resolved;
}

/**
 * DOM-independent route controller used by sf-composition-scope. The host is
 * any EventTarget; endpoints are resolved lazily on every delivery so that
 * removed and remounted children never keep stale references.
 */
class CompositionRouteController {
  constructor(host, routes, options = {}) {
    this.host = host;
    this.routes = Object.freeze(routes.map((route) => Object.freeze({ ...route, from: Object.freeze({ ...route.from }), to: Object.freeze({ ...route.to }) })));
    this.options = options;
    this.sequence = 0;
    this.depth = 0;
    this.states = new Map();
    this.pending = new Map();
    this.counters = { outputs: 0, deliveries: 0, settled: 0, stale: 0, rejected: 0 };
    this.connection = null;
    this.onOutput = this.onOutput.bind(this);
  }

  get connected() {
    return this.connection !== null;
  }

  connect() {
    if (this.connection) return false;
    this.connection = new AbortController();
    this.host.addEventListener(PORT_OUTPUT_EVENT, this.onOutput, { signal: this.connection.signal });
    for (const route of this.routes) this.setState(route.id, { status: 'idle', sequence: 0 });
    return true;
  }

  disconnect() {
    if (!this.connection) return false;
    this.connection.abort();
    this.connection = null;
    for (const controller of this.pending.values()) controller.abort();
    this.pending.clear();
    for (const route of this.routes) this.setState(route.id, { status: 'disposed', sequence: this.states.get(route.id)?.sequence || 0 });
    return true;
  }

  getState(routeId) {
    const state = this.states.get(routeId);
    return state ? { ...state } : null;
  }

  setState(routeId, state) {
    const next = Object.freeze({ route: routeId, ...state });
    this.states.set(routeId, next);
    this.options.onState?.(next);
  }

  onOutput(event) {
    const source = this.options.sourceEndpoint?.(event);
    if (!source) return;
    const detail = event.detail;
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(detail) || typeof detail.port !== 'string') return;
    this.counters.outputs += 1;
    for (const route of this.routes) {
      if (route.from.endpoint !== source || route.from.port !== detail.port) continue;
      let value;
      try {
        value = checkPortValue(route.from.value, detail.value);
      } catch {
        // The newest output wins even when invalid: an older pending delivery
        // for this route becomes stale and cannot settle afterwards.
        this.counters.rejected += 1;
        this.pending.get(route.id)?.abort();
        this.pending.delete(route.id);
        this.setState(route.id, { status: 'error', error: 'value_invalid', sequence: ++this.sequence });
        continue;
      }
      this.deliver(route, value);
    }
  }

  deliver(route, value) {
    if (!this.connection) return;
    const sequence = ++this.sequence;
    this.pending.get(route.id)?.abort();
    const abort = new AbortController();
    this.pending.set(route.id, abort);
    this.setState(route.id, { status: 'pending', sequence });
    const isLatest = () => this.connection !== null && !abort.signal.aborted && this.states.get(route.id)?.sequence === sequence;
    const meta = Object.freeze({ route: route.id, sequence, signal: abort.signal, isLatest });
    const attempt = () => {
      if (!isLatest()) return;
      const target = this.options.targetEndpoint?.(route.to.endpoint);
      if (!target) {
        this.setState(route.id, { status: 'error', error: 'endpoint_unresolved', sequence });
        return;
      }
      if (typeof target.sfPortInput !== 'function') {
        const ready = this.options.whenReady?.(target);
        if (ready) {
          this.setState(route.id, { status: 'waiting', sequence });
          ready.then(attempt, () => this.setState(route.id, { status: 'error', error: 'endpoint_unavailable', sequence }));
        } else {
          this.setState(route.id, { status: 'error', error: 'port_unsupported', sequence });
        }
        return;
      }
      const declared = target.constructor?.sfPorts?.inputs?.[route.to.port];
      if (!sameValueType(declared, route.to.value)) {
        this.counters.rejected += 1;
        this.setState(route.id, { status: 'error', error: 'port_mismatch', sequence });
        return;
      }
      if (this.depth >= ROUTING_LIMITS.maxReentrancy) {
        this.counters.rejected += 1;
        this.setState(route.id, { status: 'error', error: 'reentrancy_limit', sequence });
        return;
      }
      this.depth += 1;
      let result;
      try {
        this.counters.deliveries += 1;
        result = target.sfPortInput(route.to.port, value, meta);
      } catch {
        this.depth -= 1;
        this.counters.rejected += 1;
        this.setState(route.id, { status: 'error', error: 'port_rejected', sequence });
        return;
      }
      this.depth -= 1;
      if (result && typeof result.then === 'function') {
        this.setState(route.id, { status: 'pending', sequence });
        result.then(() => {
          if (!isLatest()) { this.counters.stale += 1; return; }
          this.counters.settled += 1;
          this.pending.delete(route.id);
          this.setState(route.id, { status: 'settled', sequence });
        }, () => {
          if (!isLatest()) { this.counters.stale += 1; return; }
          this.setState(route.id, { status: 'error', error: 'port_rejected', sequence });
        });
      } else {
        this.counters.settled += 1;
        this.pending.delete(route.id);
        this.setState(route.id, { status: 'settled', sequence });
      }
    };
    attempt();
  }
}

function nearestScope(element) {
  return element?.parentElement?.closest?.('sf-composition-scope') || null;
}

const isCustom = (element) => typeof element?.localName === 'string' && element.localName.includes('-');
const upgradePending = (element) => isCustom(element) && !globalThis.customElements?.get(element.localName);

// The endpoint element either implements the port protocol itself or wraps
// exactly one port element that belongs to the same scope.
function portElement(endpointElement, scope) {
  if (typeof endpointElement.sfPortInput === 'function' || upgradePending(endpointElement)) return endpointElement;
  const candidates = [...endpointElement.querySelectorAll('*')]
    .filter((element) => isCustom(element) && element.localName !== 'sf-composition-scope' && nearestScope(element) === scope);
  const implemented = candidates.filter((element) => typeof element.sfPortInput === 'function');
  if (implemented.length === 1) return implemented[0];
  const pending = candidates.filter(upgradePending);
  return implemented.length === 0 && pending.length === 1 ? pending[0] : null;
}

function parseRoutesAttribute(value) {
  let parsed;
  try { parsed = JSON.parse(value || '[]'); } catch { return null; }
  if (!Array.isArray(parsed) || parsed.length > ROUTING_LIMITS.maxRoutesPerScope) return null;
  const ids = new Set();
  for (const route of parsed) {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(route) || typeof route.id !== 'string' || !ROUTE_ID_PATTERN.test(route.id)) return null;
    for (const side of ['from', 'to']) {
      const end = route[side];
      if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(end) || typeof end.endpoint !== 'string' || typeof end.port !== 'string'
        || !NAME_PATTERN.test(end.endpoint) || !NAME_PATTERN.test(end.port) || !knownValueType(end.value)) return null;
    }
    if (!sameValueType(route.from.value, route.to.value) || ids.has(route.id)) return null;
    ids.add(route.id);
  }
  return parsed;
}

function defineCompositionScope(registry = globalThis.customElements) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-composition-scope');
  if (existing) return existing;
  class SfCompositionScope extends globalThis.HTMLElement {
    constructor() {
      super();
      this.routeController = null;
      this.routeDiagnostics = [];
    }

    connectedCallback() {
      if (!this.routeController) {
        const routes = parseRoutesAttribute(this.getAttribute('data-sf-routes'));
        if (!routes) {
          this.routeDiagnostics = [{ code: 'routes_invalid', path: 'data-sf-routes', message: 'Rendered routes are invalid' }];
          this.setAttribute('data-sf-routing', 'error');
          return;
        }
        this.routeController = new CompositionRouteController(this, routes, {
          sourceEndpoint: (event) => {
            const origin = event.target?.closest?.('[data-sf-endpoint]');
            if (!origin || nearestScope(origin) !== this || portElement(origin, this) !== event.target) return null;
            return origin.getAttribute('data-sf-endpoint');
          },
          targetEndpoint: (name) => {
            const matches = [...this.querySelectorAll('[data-sf-endpoint]')]
              .filter((element) => element.getAttribute('data-sf-endpoint') === name && nearestScope(element) === this);
            return matches.length === 1 ? portElement(matches[0], this) : null;
          },
          whenReady: (element) => (element.localName?.includes('-') && globalThis.customElements
            ? globalThis.customElements.whenDefined(element.localName)
            : null),
          onState: (state) => this.dispatchEvent(new globalThis.CustomEvent(ROUTE_STATE_EVENT, { detail: state })),
        });
      }
      this.routeController.connect();
      this.setAttribute('data-sf-routing', 'connected');
    }

    disconnectedCallback() {
      this.routeController?.disconnect();
      if (this.routeController) this.setAttribute('data-sf-routing', 'disposed');
    }

    getRouteState(routeId) {
      return this.routeController?.getState(routeId) || null;
    }

    getRoutingCounters() {
      return this.routeController ? { ...this.routeController.counters } : null;
    }
  }
  registry.define('sf-composition-scope', SfCompositionScope);
  return SfCompositionScope;
}

function routesAttribute(routes) {
  return (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.stableStringify)(routes.map((route) => ({
    id: route.id,
    from: { endpoint: route.from.endpoint, port: route.from.port, value: route.from.value },
    to: { endpoint: route.to.endpoint, port: route.to.port, value: route.to.value },
  })));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ CompositionRouteController, checkPortValue, createPortRegistry, defineCompositionScope, resolveRoutes });


/***/ },

/***/ "ac24888e7d3e"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isSchema: () => (/* binding */ isSchema),
/* harmony export */   readSchema: () => (/* binding */ readSchema),
/* harmony export */   schemaFields: () => (/* binding */ schemaFields),
/* harmony export */   withUnversionedSchema: () => (/* binding */ withUnversionedSchema)
/* harmony export */ });
// Names carry no version (owner, 2026-10-11; ui-control
// control/NAMES-WITHOUT-VERSIONS-DECISION-2026-10-11.md). A data format is
// `"schema": "simai.<name>"` with `"schema_version": <major>` beside it; the
// older form put the major in the name, `"simai.<name>.v<major>"`. Through the
// change journal's compatibility window every reader accepts both, and writers
// emit the new one. This is the one place that reads them.

const VERSIONED = /^(.+)\.v([0-9]+)$/u;

/**
 * The format a document declares, in either form: {name, version}, or null
 * when it declares none. `version` is the major, an integer; null when the
 * new form leaves schema_version out.
 */
function readSchema(document) {
  const label = document?.schema ?? document?.schema_id;
  if (typeof label !== 'string' || !label) return null;
  const versioned = label.match(VERSIONED);
  if (versioned) return {name: versioned[1], version: Number(versioned[2]), form: 'versioned-name'};
  const version = document?.schema_version;
  return {name: label, version: Number.isInteger(version) ? version : null, form: 'name'};
}

/**
 * Whether a document is the format `name` at major `version`, in either form.
 * A schema_version beside the older label must agree with it.
 */
function isSchema(document, name, version) {
  const read = readSchema(document);
  if (!read || read.name !== name || read.version !== version) return false;
  return document.schema_version === undefined || document.schema_version === version;
}

/** The new form of a format's fields, for a writer: {schema, schema_version}. */
function schemaFields(name, version) {
  if (VERSIONED.test(name)) throw new TypeError(`A format name carries no version: ${name}`);
  if (!Number.isInteger(version) || version < 1) throw new TypeError(`A format's version is a whole major: ${version}`);
  return {schema: name, schema_version: version};
}

/** A document's format moved to the new form, everything else as it was. */
function withUnversionedSchema(document) {
  const read = readSchema(document);
  if (!read || read.form === 'name') return document;
  const {schema, schema_id, schema_version, ...rest} = document;
  return {...schemaFields(read.name, read.version), ...rest};
}


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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/
/************************************************************************/
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "js/" + {"80841737880868":"core-rules","88616323197113":"core-system","66700837013363":"core-loader"}[chunkId] + ".js";
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "css/core.css";
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		const inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			let script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					const s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/
/******/
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			const onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				const doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode?.removeChild(script);
/******/ 				doneFns?.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			const timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		let scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		const document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript?.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					let i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			20514231357218: 0
/******/ 		};
/******/
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				let installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							const promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/
/******/ 							// start chunk loading
/******/ 							const url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							const error = new Error();
/******/ 							const loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										const errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										const realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/
/******/ 		// no prefetching
/******/
/******/ 		// no preloaded
/******/
/******/ 		// no HMR
/******/
/******/ 		// no HMR manifest
/******/
/******/ 		// no on chunks loaded
/******/
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/
/******/ 		}
/******/
/******/ 		const chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c7a5006ae2e0");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6d5e21314f8e");


})();

/******/ })()
;