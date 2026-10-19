/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true.
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
  to = null
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  const existing = notes.get(key);

  if (existing) {
    existing.count += 1;
    return;
  }

  notes.set(key, {
    component,
    kind,
    attribute,
    from,
    to,
    count: 1
  });

  if (warnEnabled()) {
    const where = component ? `${component}: ` : '';
    const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
    globalThis.console?.warn?.(`[Simai Framework] ${where}${what} is a legacy name${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
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
 // The label a writer emits. A reader takes either form of the format name
// (simai.effect.v1, or simai.effect with schema_version 1): schema-name.mjs.

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
// (area-takes-the-drawn-theme); what they had before comes back after.

function themeAreas() {
  const before = new Map();

  const restore = (element, had) => {
    element.classList.remove(...THEME_CLASSES);
    if (had.length) element.classList.add(...had);
  };

  return {
    set(elements, scheme) {
      const wanted = `theme-${scheme}`;

      for (const element of elements) {
        if (!before.has(element)) before.set(element, THEME_CLASSES.filter(name => element.classList.contains(name))); // Touched only when it changes, so an observer of the class sees no churn.

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
    EFFECT_SCHEMA,
    SANDBOX_RUNNER_SHA256: FRAME_RUNNER_SHA256
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
/* harmony import */ var _rule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("987c832cfe13");
/* harmony import */ var _rule__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_rule__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("9770341d4bfa");
/* harmony import */ var _composition_index_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("32dfc4431a24");
/* harmony import */ var _position_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2e9112dbdda9");
/* harmony import */ var _preferences_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _region_navigation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("9edc14a11fec");
/* harmony import */ var _effects_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("4f52f56c9555");
/* harmony import */ var _notify_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("b4bff8456ce0");
/* harmony import */ var _preloader__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("6c7f357fe960");










 // The shared Smart runtime: core/js/smart-base.js, a script of its own beside
// core.js, holding the modules the Smart bundles are built against (they carry
// no lit or smart-base of their own). Asked for by the bundles and by the
// Loader as soon as it queues a Smart element. A page that included the script
// by hand already has it.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  const SF = window.SF;

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

  ensureDirAttribute();

  const hideBodyUntilReady = () => {
    if (window.SF_PRELOADED && Object.keys(window.SF_PRELOADED.modules || {}).length) {
      return;
    }

    const setHidden = () => {
      if (!document.body) return false;
      document.body.style.opacity = '0';
      return true;
    };

    if (!setHidden()) {
      const mo = new MutationObserver((muts, obs) => {
        if (setHidden()) obs.disconnect();
      });
      mo.observe(document.documentElement, {
        childList: true
      });
    }

    window.addEventListener('sf-loader-ready', () => {
      if (document.body) document.body.style.opacity = '1';
    }, {
      once: true
    });
  };

  hideBodyUntilReady();

  const mountPreloader = () => {
    const cfg = {
      enabled: true,
      background: (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.getPreloaderBackground)(),
      modifier: 'loader-default',
      tempStyles: 'inset: 0;position: fixed;width: 100%;height: 100vh;opacity: 1;z-index: 1000;background-color: var(--sf-color--surface-highest, var(--sf-surface-0, #fff));text-align: center;',
      color: (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.getPreloaderColor)(),
      width: _preloader__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_PRELOADER.width,
      height: _preloader__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_PRELOADER.height,
      content: '',
      delay: 300,
      ...(window.SF_BOOT_CONFIG?.preloader || {})
    };
    if (cfg.enabled === false || document.querySelector('.sf-loader')) return;
    const svgContent = cfg.content || (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.createPreloaderContent)(cfg);
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
        (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.stopPreloaderMotion)(preloaderWrap);
      }
    };

    const buildPreloader = () => {
      if (preloaderRun || document.querySelector('.sf-loader')) return;
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
      (0,_preloader__WEBPACK_IMPORTED_MODULE_10__.startPreloaderMotion)(preloaderWrap, () => preloaderRun, cfg);
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
  }
}

function hideRegionWhenEmpty() {
  const area = state.region;
  if (!area || state.shown.length || state.waiting.length) return;
  if (typeof area.hidePopover === 'function' && area.matches(':popover-open')) area.hidePopover();
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
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText)
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
}
/**
 * The page's language for this node: the nearest [lang], else the document's,
 * else English — unless a product has chosen one explicitly.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  if (STORE.chosen) return STORE.chosen.split('-')[0];
  const owner = langOwner(node);
  const value = owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en';
  return normalise(value).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = langOwner(node);
  return normalise(owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en');
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
    STORE.chosen = next;
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
/* harmony export */   createPreloaderContent: () => (/* binding */ createPreloaderContent),
/* harmony export */   getPreloaderBackground: () => (/* binding */ getPreloaderBackground),
/* harmony export */   getPreloaderColor: () => (/* binding */ getPreloaderColor),
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
const MOTION_HANDLE = '__sfPreloaderMotion';
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
  if (typeof window === 'undefined') return; // A page that never set sfPath used to fall back here in silence, and the
  // fallback is an unpinned branch: the project then serves whatever sits on
  // main today instead of the build it shipped, and nothing on screen says so.
  // The fallback stays — a page with no configuration still has to run — but it
  // says out loud what it just did and what to write instead.

  if (!window.sfPath) {
    window.sfPath = cdnDefault;

    try {
      console.warn('SIMAI Framework: window.sfPath is not set, so the runtime is loading ' + `from ${cdnDefault} — an unpinned branch that changes without notice. ` + 'Set window.sfPath to your own copy of distr/, before core.js, ' // A release is a commit of simai/ui (ui-<12 hex>); there are no tags.
      + 'or to a released commit: https://cdn.jsdelivr.net/gh/simai/ui@<commit>/distr/ .');
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
  const coreScript = typeof document === 'undefined' ? null : Array.from(document.scripts).reverse().find(script => {
    if (!script.src) return false;

    try {
      return /\/core\/js\/core(?:\.min)?\.js$/.test(new URL(script.src, document.baseURI).pathname);
    } catch {
      return false;
    }
  });
  const coreRoot = coreScript ? new URL('../', new URL(coreScript.src, document.baseURI)) : configuredCoreRoot;

  if (__webpack_require__.p !== coreRoot.href) {
    __webpack_require__.p = coreRoot.href;
  }
})();

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