/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
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
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
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
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
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
    // A printed JSON island first (standard 1.3.8 §5.4): what is read below may be in it.
    this.sfReadIsland();
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
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

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

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

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tree","tag":"sf-tree","version":"2.0.5","kind":"leaf","settings":{"selection":{"type":"enum","values":["none","one","many"],"default":"none","summary":"What a press does: none opens the entry (or follows its link), one selects one entry, many toggles each"},"items":{"type":"list","default":[],"of":{"id":"id","label":"string","href":"string","target":"string","rel":"string","kind":{"type":"enum","values":["folder","file"]},"value":"string","open":"boolean","selected":"boolean","active":"boolean","disabled":"boolean","icon":"boolean","open-icon":"icon","closed-icon":"icon","chevron-open-icon":"icon","chevron-closed-icon":"icon","open-label":"string","close-label":"string","revision":"string","children":"list"},"entries":{"key":"id","changes":"content"},"summary":"The tree as data: entries with children; sf-tree-item children written inside are read once otherwise. An entry\'s id is id, else value, else its place"},"accept-records":{"type":"boolean","default":false,"summary":"An entry takes records dragged from a list (application/x-sf-records+json)"},"accept-files":{"type":"boolean","default":false,"summary":"An entry takes files dragged from the computer"}},"values":{"selected":{"type":"id","default":"","summary":"The current entry\'s id (§18.2); with selection many, the one pressed last"},"selected-ids":{"type":"list","default":[],"of":{"id":"id"},"summary":"The selected ids in entry order, with selection many (§18.2)"}},"events":{"open":{"carries":{"id":"id","value":"string"},"summary":"A press on an entry\'s name, or Enter on a leaf without a link (vocabulary 1.1.5 §5 open)"},"select":{"carries":{"ids":"list","id":"id","selected":"boolean"},"summary":"The selection changed: ids is the whole selection, id the entry pressed and selected whether it is now selected (vocabulary §5 select)"},"toggle":{"carries":{"id":"id","open":"boolean","value":"string"},"summary":"A branch opened or closed (vocabulary §5 toggle)"},"move":{"carries":{"ids":"list","parent":"id","before":{"type":"id","nullable":true},"source":"string"},"summary":"Records dragged from a list were dropped on an entry: the request to move them into it (vocabulary §5 move); the tree moves nothing itself"},"attach":{"carries":{"files":"list","parent":"id"},"summary":"Files were dropped on an entry: the request to attach them there (vocabulary §5 attach); the tree uploads nothing itself"},"window":{"carries":{"first":"number","last":"number"},"summary":"With more than 300 visible entries, which of them are drawn (§18.4)"}},"actions":{"expand":{"with":{"id":"id"},"x-outcomes":["applied","refused"],"summary":"Opens a branch; refused for an unknown id, a leaf or a disabled entry"},"collapse":{"with":{"id":"id"},"x-outcomes":["applied","refused"]},"focus-entry":{"with":{"id":"id"},"x-outcomes":["applied","refused"],"summary":"Moves the focus to an entry, drawing it first when the window holds it out"}},"presentation":{"skeleton":{"$comment":"The rows arrive as items after the first paint when the host loads them: the derived skeleton (static/default/<example>.skeleton.html) holds their box until they do (standard 1.3.8 §5.4).","late":["items"]}},"css-variables":{"--sf-tree-gap":{"type":"length","state":"default"},"--sf-tree-padding-inline":{"type":"length","state":"default"},"--sf-tree-indent":{"type":"length","state":"default"},"--sf-tree-radius":{"type":"length","state":"default"},"--sf-tree-color":{"type":"color","state":"default"},"--sf-tree-selected-background-color":{"type":"color","state":"selected"}}}');

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