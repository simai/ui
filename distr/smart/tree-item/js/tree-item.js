/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "f3cba14ced8a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_KINDS: () => (/* binding */ FILE_KINDS),
/* harmony export */   fileKind: () => (/* binding */ fileKind),
/* harmony export */   fileKindIcon: () => (/* binding */ fileKindIcon),
/* harmony export */   fileKindOfName: () => (/* binding */ fileKindOfName),
/* harmony export */   fileType: () => (/* binding */ fileType)
/* harmony export */ });
/* harmony import */ var _file_types_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9bbeb11fb966");
// The type of an entry -- a file, a page, a folder -- and its icon, from one
// map (file-types.json; owner decision C102, 2026-11-12). Who chooses the icon,
// first word wins:
//
//   icon        a name the host gives (or false: no icon)
//   kind        one of the twelve words of the map (page, image, code, ...)
//   extension   of the name, when names say their type (file-types="name")
//   place       a folder (it has children, or kind="folder"), else a file
//
// No top-level side effects: a bundle that imports one function carries the
// map and nothing else. sf-tree draws its rows with it; sf-file-upload,
// sf-file-download and sf-view's file cells are to follow (C102 item 2).

const KINDS = _file_types_json__WEBPACK_IMPORTED_MODULE_0__.kinds;
/** The twelve kinds, in the map's order. */

const FILE_KINDS = /* @__PURE__ */Object.freeze(Object.keys(KINDS));

const BY_EXTENSION = /* @__PURE__ */(() => {
  const found = new Map();

  for (const [kind, spec] of Object.entries(KINDS)) for (const extension of spec.extensions ?? []) found.set(extension, kind);

  return found;
})();
/** A word of the map, or '' for anything else (an old or unknown word). */


function fileKind(word) {
  const kind = String(word ?? '').trim().toLowerCase();
  return Object.hasOwn(KINDS, kind) ? kind : '';
}
/** The kind a name's extension says («Смета.xlsx» → table), or ''. */

function fileKindOfName(name) {
  const found = /\.([a-z0-9]+)$/iu.exec(String(name ?? '').trim());
  return found ? BY_EXTENSION.get(found[1].toLowerCase()) ?? '' : '';
}
/** The icon of a kind; a folder open shows its open icon. */

function fileKindIcon(kind, {
  open = false
} = {}) {
  const spec = KINDS[fileKind(kind)];
  if (!spec) return KINDS.file.icon;
  return open && spec['open-icon'] ? spec['open-icon'] : spec.icon;
}
/**
 * The kind an entry is shown as and its icon.
 *
 *   fileType({icon, kind, name, folder, open, byName})
 *     icon     a name, or false for none ('' / true: choose)
 *     kind     a word of the map, or ''
 *     name     the entry's name, read for its extension when byName
 *     folder   the entry has children (or says it will have them)
 *     open     a folder that is open
 *     byName   the extension may say the kind (default true)
 *   → {kind, icon}   icon '' when the host said false
 */

function fileType({
  icon,
  kind,
  name,
  folder = false,
  open = false,
  byName = true
} = {}) {
  let shown = fileKind(kind); // A folder is a folder by its place; file is the word for "some file", which
  // the name may say more about.

  if (!shown || shown === 'file') {
    if (folder && !shown) shown = 'folder';else shown = byName && fileKindOfName(name) || shown || 'file';
  }

  if (icon === false || icon === 'false') return {
    kind: shown,
    icon: ''
  };
  if (typeof icon === 'string' && icon.trim() && icon !== 'true') return {
    kind: shown,
    icon: icon.trim()
  };
  return {
    kind: shown,
    icon: fileKindIcon(shown, {
      open
    })
  };
}

/***/ },

/***/ "11057d00e2b0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("26d4ed181d97");
/* harmony import */ var _js_node_data_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2fb8a633d966");
/* harmony import */ var _core_js_file_types_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f3cba14ced8a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38c83d62c9cb");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3caeafa9a937");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("873f949da61a");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("73a6f336a620");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// A node of a tree: a folder that opens a group of nodes, or a file or a link.
//
// Inside an sf-tree the node is read once as data and removed: the tree draws
// every entry's row itself (js/templates/row.js, simai/ui-source#43). Alone,
// the node draws its own row and, open, its children as nested nodes.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the settings are made by core/js/element-manifest.js; a press on the name
// sends sf-tree-item-open {id, value} (the old sf-tree-item-click its dated
// alias), the branch's change sf-tree-item-toggle {id, open, value}; text is
// label's alias and type kind's (aliases.json); the words are the language
// files'.









const TreeItemElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__,
  actions: {
    expand() {
      return this.setOpen(true);
    },

    collapse() {
      return this.setOpen(false);
    },

    'toggle-open'() {
      return this.setOpen(!this.open);
    },

    activate() {
      return this.runActivate();
    },

    'focus-item'() {
      const control = this.getTreeItemControl();
      if (!control) return {
        outcome: 'refused',
        reason: 'not-drawn'
      };
      control.focus();
      return {
        outcome: 'applied'
      };
    }

  }
});

class SfTreeItem extends TreeItemElement {
  static contentTemplateSlot = '__content';

  constructor() {
    super();
    this._itemObserver = null;
    this._itemsData = [];
    this._sourceData = null;
  }

  connectedCallback() {
    // A printed JSON island first (standard 1.3.8 §5.4): what is read below may be in it.
    this.sfReadIsland();

    if (!this.__treeItemSourceCaptured) {
      this.captureSourceData();
      this.captureInitialContent();
      this.captureInitialItems();
      this.__treeItemSourceCaptured = true;
    }

    this.observeChildItems();
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.disconnectItemObserver();
    super.disconnectedCallback();
  }

  observeChildItems() {
    if (this._itemObserver) return;
    this._itemObserver = new MutationObserver(mutations => {
      const hasNewItems = mutations.some(mutation => Array.from(mutation.addedNodes || []).some(_js_node_data_js__WEBPACK_IMPORTED_MODULE_3__.isTreeItemNode));
      if (!hasNewItems || !this.captureInitialItems(true)) return;
      this.requestComponentUpdate('children');
    });

    this._itemObserver.observe(this, {
      childList: true
    });
  }

  disconnectItemObserver() {
    this._itemObserver?.disconnect?.();
    this._itemObserver = null;
  }

  isContentNode(node) {
    if (!node || (0,_js_node_data_js__WEBPACK_IMPORTED_MODULE_3__.isTreeItemNode)(node)) return false;
    if (node.nodeType === Node.TEXT_NODE) return String(node.textContent || '').trim() !== '';
    return node.nodeType === Node.ELEMENT_NODE;
  }

  captureSourceData() {
    if (this._sourceData) return this._sourceData;
    this._sourceData = (0,_js_node_data_js__WEBPACK_IMPORTED_MODULE_3__.treeItemNodeToData)({ ...this,
      getAttribute: name => this.getAttribute(name),
      hasAttribute: name => this.hasAttribute(name),
      children: this.children,
      childNodes: this.childNodes
    });
    return this._sourceData;
  }

  captureInitialContent() {
    if (this._slotTemplates.has(this.constructor.contentTemplateSlot)) return false;
    return this.captureChildTemplates(this.constructor.contentTemplateSlot, node => this.isContentNode(node)).length > 0;
  }

  captureInitialItems(append = false) {
    const nodes = Array.from(this.childNodes || []).filter(_js_node_data_js__WEBPACK_IMPORTED_MODULE_3__.isTreeItemNode);
    if (!nodes.length) return false;
    const nextItems = nodes.map(_js_node_data_js__WEBPACK_IMPORTED_MODULE_3__.treeItemNodeToData);
    this._itemsData = append ? [...this._itemsData, ...nextItems] : nextItems;
    nodes.forEach(node => node.remove());
    return true;
  } // A branch: children, or has-children before they are loaded (TR-5).


  get isBranch() {
    return !this.isFile && (this.childItems.length > 0 || Boolean(this.hasChildren));
  }

  get content() {
    return this.getSlotContent(this.constructor.contentTemplateSlot);
  }

  get childItems() {
    if (this.isFile) return [];
    const propItems = this.itemsData;
    return Array.isArray(propItems) && propItems.length ? propItems : this._itemsData;
  }

  get label() {
    return this.getAttribute('label') || this._sourceData?.label || '';
  }

  set label(next) {
    super.label = next;
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.kind;
  }

  get isFile() {
    return this.kind === 'file';
  }

  toTreeItemData() {
    const sourceData = this.captureSourceData();
    return { ...sourceData,
      label: this.label,
      href: this.href || sourceData.href || '',
      target: this.target || sourceData.target || '',
      rel: this.rel || sourceData.rel || '',
      type: this.kind,
      value: this.value || sourceData.value || '',
      open: this.open || sourceData.open || false,
      selected: this.selected || sourceData.selected || false,
      active: this.active || sourceData.active || false,
      disabled: this.disabled || sourceData.disabled || false,
      hasChildren: Boolean(this.hasChildren) || sourceData.hasChildren || false,
      openIcon: this.getAttribute('open-icon') || sourceData.openIcon || '',
      closedIcon: this.getAttribute('closed-icon') || sourceData.closedIcon || '',
      icon: this.iconSetting(),
      chevronOpenIcon: this.getAttribute('chevron-open-icon') || sourceData.chevronOpenIcon || '',
      chevronClosedIcon: this.getAttribute('chevron-closed-icon') || sourceData.chevronClosedIcon || '',
      openLabel: this.getAttribute('open-label') || sourceData.openLabel || '',
      closeLabel: this.getAttribute('close-label') || sourceData.closeLabel || '',
      children: this.isFile ? [] : this.childItems.length ? this.childItems : sourceData.children || []
    };
  } // icon as the node says it: a name, false for none, '' to choose (C102).


  iconSetting() {
    const icon = this.icon;
    if (icon === false || icon === 'false') return false;
    return typeof icon === 'string' && icon !== 'true' ? icon : '';
  } // The node's icon (core file-types, C102): icon → kind → the name's
  // extension → folder or file. A node's own open-icon / closed-icon (the
  // attributes, not their defaults) still name its glyph.


  nodeIcon() {
    const folder = this.isBranch || this.kind === 'folder';
    const open = folder && this.isBranch && Boolean(this.open);
    const openIcon = this.getAttribute('open-icon') || '';
    const closedIcon = this.getAttribute('closed-icon') || '';
    const custom = folder ? open ? openIcon : closedIcon : closedIcon || openIcon;
    const icon = this.iconSetting();
    return (0,_core_js_file_types_index_js__WEBPACK_IMPORTED_MODULE_4__.fileType)({
      icon: icon === false ? false : icon || custom || '',
      kind: this.kind,
      name: this.label,
      folder,
      open
    }).icon;
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      value: this.value,
      label: this.label,
      content: this.content,
      kind: this.kind,
      type: this.kind,
      isFile: this.isFile,
      open: this.open,
      selected: this.selected,
      active: this.active,
      disabled: this.disabled,
      icon: this.iconSetting(),
      nodeIcon: this.nodeIcon(),
      folder: this.isBranch || this.kind === 'folder',
      openIcon: this.openIcon,
      closedIcon: this.closedIcon,
      chevronOpenIcon: this.chevronOpenIcon,
      chevronClosedIcon: this.chevronClosedIcon,
      openLabel: this.openLabel,
      closeLabel: this.closeLabel,
      itemClass: this.itemClass,
      containerClass: this.containerClass,
      nameClass: this.nameClass,
      children: this.childItems,
      hasChildren: this.isBranch,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      onToggle: this.handleToggle,
      onItemClick: this.handleItemClick
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderTreeItemTemplate)(this.templateContext());
  }

  getTreeItemControl() {
    return this.querySelector(':scope > .sf-tree-item[role="treeitem"]');
  }

  getRenderedChildItems() {
    return Array.from(this.querySelectorAll(':scope > .sf-tree-item > .sf-tree-group > sf-tree-item'));
  }

  setTabStop(active = false) {
    const control = this.getTreeItemControl();
    if (control) control.tabIndex = active ? 0 : -1;
    return this;
  } // The action activate: what Enter does on a leaf.


  runActivate() {
    if (this.disabled) return {
      outcome: 'refused',
      reason: 'disabled'
    };
    const link = this.querySelector(':scope > .sf-tree-item > .sf-tree-item-container > a[href]');

    if (link) {
      link.click();
      return {
        outcome: 'applied'
      };
    }

    this.sfEmit('open', {
      id: this.value,
      value: this.value
    });
    return {
      outcome: 'applied'
    };
  } // The actions expand, collapse and toggle-open.


  setOpen(open = true) {
    const next = Boolean(open);
    if (!this.isBranch) return {
      outcome: 'refused',
      reason: 'leaf'
    };
    if (this.disabled) return {
      outcome: 'refused',
      reason: 'disabled'
    };
    if (this.open === next) return {
      outcome: 'applied'
    };
    this.toggleAttribute('open', next);
    this.sfEmit('toggle', {
      id: this.value,
      open: next,
      value: this.value
    });
    return {
      outcome: 'applied'
    };
  } // The old sf-tree-item-click carried the element and the DOM event.


  sfAliasAdapters() {
    return {
      'sf-tree-item-click': detail => ({
        item: this,
        value: detail.value,
        originalEvent: this._pressEvent ?? null
      })
    };
  }

  onToggle(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-tree-item-toggle', event => handler(event.detail?.open, event.detail, event), options);
    }

    return this;
  }

  handleToggle = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setOpen(!this.open);
  };
  handleItemClick = event => {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    this._pressEvent = event;
    this.sfEmit('open', {
      id: this.value,
      value: this.value
    });
    this._pressEvent = null;
  };
}

SfTreeItem.define('sf-tree-item');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

function readIcon(value) {
  if (value === 'false') return false;
  return value && value !== 'true' ? value : '';
}

function readFlag(node, name) {
  return node.hasAttribute(name) && node.getAttribute(name) !== 'false';
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
    hasChildren: node.hasAttribute('has-children') && node.getAttribute('has-children') !== 'false',
    openIcon: node.getAttribute('open-icon') || '',
    closedIcon: node.getAttribute('closed-icon') || '',
    // A name, or false for none (C102); absent or true: chosen.
    icon: readIcon(node.getAttribute('icon')),
    note: node.getAttribute('note') || '',
    mark: readFlag(node, 'mark'),
    more: readFlag(node, 'more'),
    hidden: readFlag(node, 'hidden'),
    error: readFlag(node, 'error'),
    chevronOpenIcon: node.getAttribute('chevron-open-icon') || '',
    chevronClosedIcon: node.getAttribute('chevron-closed-icon') || '',
    openLabel: node.getAttribute('open-label') || '',
    closeLabel: node.getAttribute('close-label') || '',
    children
  };
}

/***/ },

/***/ "26d4ed181d97"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderIcon: () => (/* reexport safe */ _row_js__WEBPACK_IMPORTED_MODULE_1__.renderIcon),
/* harmony export */   renderTreeItemTemplate: () => (/* binding */ renderTreeItemTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _row_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("72dd7fe72ad5");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _row_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _row_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // A standalone sf-tree-item: its own row (the row sf-tree draws every entry
// with), then, open, its children as sf-tree-item elements in a group. Inside
// an sf-tree the item is only read: the tree draws the rows itself.

function renderTreeItemData(item = {}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-tree-item
      label=${item.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      href=${item.href || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      target=${item.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      rel=${item.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      kind=${item.type || item.kind || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      value=${item.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      open-icon=${item.openIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      closed-icon=${item.closedIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      chevron-open-icon=${item.chevronOpenIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      chevron-closed-icon=${item.chevronClosedIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      open-label=${item.openLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      close-label=${item.closeLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      icon=${item.icon === false ? 'false' : item.icon && item.icon !== true ? item.icon : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?open=${Boolean(item.open)}
      ?selected=${Boolean(item.selected)}
      ?active=${Boolean(item.active)}
      ?disabled=${Boolean(item.disabled)}
      ?has-children=${Boolean(item.hasChildren ?? item['has-children'])}
      .itemsData=${item.children || []}
    ></sf-tree-item>
  `;
}

function renderTreeItemTemplate(context) {
  const canToggle = !context.isFile && context.hasChildren;
  const group = context.open && canToggle ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tree-group flex flex-col" role="group">${(context.children || []).map(item => renderTreeItemData(item))}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,_row_js__WEBPACK_IMPORTED_MODULE_1__.renderTreeRow)({
    value: context.value,
    label: context.label,
    content: context.content,
    href: context.href,
    target: context.target,
    rel: context.rel,
    kind: context.kind,
    open: context.open,
    selected: context.selected,
    active: context.active,
    disabled: context.disabled,
    nodeIcon: context.nodeIcon,
    folder: context.folder,
    openIcon: context.openIcon,
    closedIcon: context.closedIcon,
    chevronOpenIcon: context.chevronOpenIcon,
    chevronClosedIcon: context.chevronClosedIcon,
    openLabel: context.openLabel,
    closeLabel: context.closeLabel,
    hasChildren: context.hasChildren,
    rootClass: context.rootClass,
    rootStyle: context.rootStyle,
    itemClass: context.itemClass,
    containerClass: context.containerClass,
    nameClass: context.nameClass,
    onToggle: context.onToggle,
    onName: context.onItemClick
  }, group);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
//   id, value, label, href, target, rel, open, selected, active, disabled,
//   openIcon, closedIcon, chevronOpenIcon, chevronClosedIcon, openLabel,
//   closeLabel, hasChildren
//   nodeIcon                   the type icon the caller chose (core
//                              file-types: icon, kind, extension, place);
//                              '' draws none (C102)
//   folder                     a branch or an empty folder: the row's class
//   note                       a second text after the name: a comment, a
//                              count, a size (C102 §7 items 7-8)
//   mark, more                 a highlighted line; the «…» line
//   pageHidden, hiddenWord     a hidden page, greyed, with its word (C102 8)
//   check                      'true' | 'false' | 'mixed': a check box in the
//                              row and aria-checked (selection="check")
//   checkSize                  the check box's step: the tree's size (C109)
//   placeholder, spinner       'loading' | 'error': the row a lazy branch
//                              shows while its children load or failed
//                              (C102 6); spinner is the Framework's spinner
//   retryLabel, onRetry        the error row's button
//   level, setsize, posinset   aria-level and the rest, for a flat tree
//   tabStop                    the one row Tab reaches
//   tipId                      a name cut to one line (TR-14): the id of the
//                              Framework tooltip that holds the whole name
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
} // The whole name of a row whose name the line cuts (TR-14): the Framework's
// tooltip surface (component.tooltip), hidden in the markup and shown by its
// controller on hover and keyboard focus of the row, which names it with
// data-tooltip. No tail (C59). The row's aria-label is the same name, so the
// controller does not make the tooltip a description that repeats it.

function renderTip(row) {
  if (!row.tipId || !row.label) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-tree-item-tip" id=${row.tipId} hidden><span
      class="sf-tooltip-content"><span class="sf-tooltip-text">${row.label}</span></span></span>`;
}

function renderName(row) {
  if (row.label) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${row.label}</span>`;
  return row.content !== undefined && row.content !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? row.content : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // A check box of the Framework's class markup (component.checkbox): its box
// and mark only -- the row is the label, the press and the keys are the
// tree's, so the box is hidden from assistive technology and the treeitem
// says aria-checked.


function renderCheck(row) {
  if (!row.check) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const on = row.check === 'true';
  const mixed = row.check === 'mixed';
  const size = row.checkSize === '1/2' || row.checkSize === '2' ? row.checkSize : '1';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-checkbox sf-checkbox--size-${size} sf-tree-check flex`} aria-hidden="true"><span class="sf-checkbox-box flex"><input
      type="checkbox" tabindex="-1" .checked=${on} .indeterminate=${mixed} ?disabled=${row.disabled}><i class="sf-icon" aria-hidden="true">${mixed ? 'remove' : on ? 'check' : ''}</i></span></span>`;
}

function renderNote(row) {
  const word = row.pageHidden && row.hiddenWord ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-item-note sf-tree-item-hidden-word">${row.hiddenWord}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const note = row.note ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-item-note">${row.note}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${word}${note}`;
} // The row a lazy branch shows under itself: «Загрузка…» with the spinner, or
// the error with its retry button (C102 item 6).


function renderPlaceholder(row) {
  const level = row.level ? String(row.level) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const error = row.placeholder === 'error';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${joinClasses('sf-tree-item flex flex-col', `sf-tree-item--${row.placeholder}`)}
      style=${row.level ? `--sf-tree-level:${row.level}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="treeitem"
      tabindex=${row.tabStop ? '0' : '-1'}
      aria-level=${level}
      aria-setsize="1"
      aria-posinset="1"
      aria-busy=${error ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'true'}
      aria-disabled=${error ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'true'}
      data-sf-entry=${row.id}
      data-sf-tree-level=${level}
    ><div class="sf-tree-item-container flex items-cross-center relative"><span class="sf-tree-toggle-spacer" aria-hidden="true"></span>${error ? renderIcon('error', 'sf-tree-node-icon') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-node-icon sf-tree-item-spinner" aria-hidden="true">${row.spinner ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`}<span class="sf-tree-item-name">${row.label}</span>${error ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" tabindex="-1" class="sf-tree-item-retry" @click=${row.onRetry}>${row.retryLabel}</button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div></div>`;
}

function renderTreeRow(row, children = lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
  if (row.placeholder) return renderPlaceholder(row);
  const isFile = row.kind === 'file';
  const canToggle = !isFile && Boolean(row.hasChildren);
  const open = canToggle && Boolean(row.open);
  const folder = row.folder ?? canToggle;
  const itemClasses = joinClasses('sf-tree-item flex flex-col', folder ? 'sf-tree-item--folder' : 'sf-tree-item--file', open ? 'open' : '', canToggle ? 'has-children' : '', row.selected || row.active ? 'active' : '', row.disabled ? 'disabled' : '', row.mark ? 'sf-tree-item--mark' : '', row.more ? 'sf-tree-item--more' : '', row.pageHidden ? 'sf-tree-item--hidden' : '', row.rootClass, row.itemClass);
  const containerClasses = joinClasses('sf-tree-item-container flex items-cross-center relative', row.containerClass);
  const nameClasses = joinClasses('sf-tree-item-name', row.nameClass);
  const nodeIcon = row.more ? 'more_horiz' : row.nodeIcon;
  const chevronIcon = open ? row.chevronOpenIcon : row.chevronClosedIcon;
  const level = row.level ? String(row.level) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const checked = row.check ? row.check : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${itemClasses}
      style=${[row.rootStyle, row.level ? `--sf-tree-level:${row.level}` : ''].filter(Boolean).join(';') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="treeitem"
      tabindex=${row.tabStop ? '0' : '-1'}
      aria-level=${level}
      aria-setsize=${row.setsize ? String(row.setsize) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-posinset=${row.posinset ? String(row.posinset) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-expanded=${canToggle ? String(open) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-selected=${row.selection === 'none' || row.check ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(Boolean(row.selected))}
      aria-checked=${checked}
      aria-current=${row.active ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${row.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${row.tipId && row.label ? row.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-tooltip=${row.tipId && row.label ? row.tipId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-open-icon=${folder ? row.openIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-closed-icon=${folder ? row.closedIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${row.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-entry=${row.id ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-tree-level=${level}
      draggable=${row.draggable ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ><div class=${containerClasses}>${canToggle ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" tabindex="-1" class="sf-icon-button sf-tree-toggle" ?disabled=${row.disabled} aria-expanded=${String(open)} aria-label=${open ? row.closeLabel : row.openLabel} @click=${row.onToggle}>${renderIcon(chevronIcon, 'sf-tree-chevron')}</button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-toggle-spacer" aria-hidden="true"></span>`}${renderCheck(row)}${renderIcon(nodeIcon, 'sf-tree-node-icon')}${row.href && !row.disabled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${nameClasses} href=${row.href} target=${row.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} rel=${row.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} tabindex="-1" @click=${row.onName}>${renderName(row)}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${nameClasses} @click=${row.onName}>${renderName(row)}</span>`}${renderNote(row)}${renderTip(row)}</div>${children}</div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "9bbeb11fb966"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The kinds of an entry and the extensions of a name that say them: one map for every SIMAI Framework part that shows a file or a page by its type -- sf-tree\'s rows today; sf-file-upload, sf-file-download and sf-view\'s file cells to follow; Docara\'s static tree, Larena\'s files and ui-mail read the same words (owner decision C102, 2026-11-12; research ui-control control/research/2026-11-12-tree.md section 7 items 2-3). A kind is one of twelve words; its icon is a Material Symbols name of the Framework\'s icon font. An extension is matched on the name\'s last dot, in lower case. A kind without extensions is said by the host (kind) or by the entry\'s place (folder: it has children). Keep the words: they are public (an entry\'s kind).","schema":"simai.framework.file-types","version":1,"kinds":{"folder":{"icon":"folder","open-icon":"folder_open","extensions":[]},"file":{"icon":"draft","extensions":[]},"page":{"icon":"article","extensions":[]},"document":{"icon":"description","extensions":["md","txt","doc","docx","pdf","rtf","odt"]},"image":{"icon":"image","extensions":["png","jpg","jpeg","gif","svg","webp","ico","avif"]},"code":{"icon":"code","extensions":["js","mjs","ts","css","scss","html","php","py","sh","vue"]},"data":{"icon":"data_object","extensions":["json","yml","yaml","xml","toml","lock","ini","env"]},"table":{"icon":"table_chart","extensions":["csv","xls","xlsx","ods"]},"archive":{"icon":"folder_zip","extensions":["zip","tar","gz","rar","7z"]},"video":{"icon":"movie","extensions":["mp4","mov","webm"]},"audio":{"icon":"audio_file","extensions":["mp3","wav","ogg","m4a"]},"link":{"icon":"link","extensions":[]}}}');

/***/ },

/***/ "3caeafa9a937"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tree-item for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"text","to":"label","kind":"setting","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"one name for the node\'s name; label wins when both are given"},{"from":"type","to":"kind","kind":"setting","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"sf-tree-item-click","to":"sf-tree-item-open","kind":"event","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-item-click","to":"open"},"section":"§3.1, §8, vocabulary 1.1.5 §5 open","note":"the old detail {item, value, originalEvent} is made by the element\'s adapter"},{"from":"sf-tree-item-toggle","to":"toggle","kind":"event","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","manifest":{"from":"sf-tree-item-toggle","to":"toggle"},"note":"the manifest declares the verb; the DOM name is unchanged, so the shim has nothing to send"}]}');

/***/ },

/***/ "38c83d62c9cb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tree-item","tag":"sf-tree-item","version":"1.3.1","kind":"leaf","settings":{"label":{"type":"string","default":""},"href":{"type":"string","default":""},"target":{"type":"string","default":""},"rel":{"type":"string","default":""},"kind":{"type":"enum","values":["folder","file","page","document","image","code","data","table","archive","video","audio","link"],"default":""},"value":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"has-children":{"type":"boolean","default":false},"items-data":{"type":"list","default":[],"of":{"id":"id","label":"string","href":"string","target":"string","rel":"string","kind":{"type":"enum","values":["folder","file","page","document","image","code","data","table","archive","video","audio","link"]},"value":"string","open":"boolean","selected":"boolean","active":"boolean","disabled":"boolean","has-children":"boolean","icon":{"anyOf":[{"type":"icon"},{"type":"boolean"}]},"open-icon":"icon","closed-icon":"icon","chevron-open-icon":"icon","chevron-closed-icon":"icon","open-label":"string","close-label":"string","revision":"string","children":"list"},"entries":{"key":"id","changes":"content"}},"open-icon":{"type":"icon","default":"folder_open"},"closed-icon":{"type":"icon","default":"folder"},"icon":{"type":"string","default":""},"chevron-open-icon":{"type":"icon","default":"keyboard_arrow_down"},"chevron-closed-icon":{"type":"icon","default":"chevron_right"},"open-label":{"type":"string","default-from":"runtime.open-label"},"close-label":{"type":"string","default-from":"runtime.close-label"},"item-class":{"type":"string","default":""},"container-class":{"type":"string","default":""},"name-class":{"type":"string","default":""}},"values":{"open":{"type":"boolean","default":false},"selected":{"type":"boolean","default":false},"active":{"type":"boolean","default":false}},"events":{"open":{"carries":{"id":"string","value":"string"}},"toggle":{"carries":{"id":"string","open":"boolean","value":"string"}}},"actions":{"expand":{},"collapse":{},"toggle-open":{},"activate":{},"focus-item":{}},"css-variables":{"--sf-tree-item-gap":{"type":"length","state":"default"},"--sf-tree-item-name-color":{"type":"color","state":"default"},"--sf-tree-item-icon-color":{"type":"color","state":"default"},"--sf-tree-item-drop-background-color":{"type":"color","state":"drop-target"},"--sf-tree-item-drop-outline-color":{"type":"color","state":"drop-target"}}}');

/***/ },

/***/ "873f949da61a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tree item","runtime":{"open-label":"Open item","close-label":"Close item"}}');

/***/ },

/***/ "73a6f336a620"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Элемент дерева","runtime":{"open-label":"Развернуть","close-label":"Свернуть"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("11057d00e2b0");
/******/
/******/ })()
;