/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "11057d00e2b0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("26d4ed181d97");
/* harmony import */ var _js_node_data_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2fb8a633d966");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("38c83d62c9cb");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("3caeafa9a937");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("873f949da61a");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("73a6f336a620");
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








const TreeItemElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__,
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
  }

  get hasChildren() {
    return !this.isFile && this.childItems.length > 0;
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
      openIcon: this.getAttribute('open-icon') || sourceData.openIcon || '',
      closedIcon: this.getAttribute('closed-icon') || sourceData.closedIcon || '',
      icon: this.icon,
      chevronOpenIcon: this.getAttribute('chevron-open-icon') || sourceData.chevronOpenIcon || '',
      chevronClosedIcon: this.getAttribute('chevron-closed-icon') || sourceData.chevronClosedIcon || '',
      openLabel: this.getAttribute('open-label') || sourceData.openLabel || '',
      closeLabel: this.getAttribute('close-label') || sourceData.closeLabel || '',
      children: this.isFile ? [] : this.childItems.length ? this.childItems : sourceData.children || []
    };
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
      icon: this.icon,
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
      hasChildren: this.hasChildren,
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
    if (this.isFile || !this.hasChildren) return {
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
      icon=${item.icon === false ? 'false' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?open=${Boolean(item.open)}
      ?selected=${Boolean(item.selected)}
      ?active=${Boolean(item.active)}
      ?disabled=${Boolean(item.disabled)}
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
    icon: context.icon,
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

/***/ "3caeafa9a937"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tree-item for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"text","to":"label","kind":"setting","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"one name for the node\'s name; label wins when both are given"},{"from":"type","to":"kind","kind":"setting","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"sf-tree-item-click","to":"sf-tree-item-open","kind":"event","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-item-click","to":"open"},"section":"§3.1, §8, vocabulary 1.1.5 §5 open","note":"the old detail {item, value, originalEvent} is made by the element\'s adapter"},{"from":"sf-tree-item-toggle","to":"toggle","kind":"event","component":"sf-tree-item","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","manifest":{"from":"sf-tree-item-toggle","to":"toggle"},"note":"the manifest declares the verb; the DOM name is unchanged, so the shim has nothing to send"}]}');

/***/ },

/***/ "38c83d62c9cb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tree-item","tag":"sf-tree-item","version":"1.1.2","kind":"leaf","settings":{"label":{"type":"string","default":"","summary":"The node\'s name; without it the node\'s own text is"},"href":{"type":"string","default":""},"target":{"type":"string","default":""},"rel":{"type":"string","default":""},"kind":{"type":"enum","values":["folder","file"],"default":"folder"},"value":{"type":"string","default":"","summary":"The node\'s id: data-value of its row, the id its events carry"},"disabled":{"type":"boolean","default":false},"items-data":{"type":"list","default":[],"of":{"id":"id","label":"string","href":"string","target":"string","rel":"string","kind":{"type":"enum","values":["folder","file"]},"value":"string","open":"boolean","selected":"boolean","active":"boolean","disabled":"boolean","icon":"boolean","open-icon":"icon","closed-icon":"icon","chevron-open-icon":"icon","chevron-closed-icon":"icon","open-label":"string","close-label":"string","revision":"string","children":"list"},"entries":{"key":"id","changes":"content"},"summary":"The node\'s children as data (sf-tree\'s entry shape); children written inside are read once otherwise"},"open-icon":{"type":"icon","default":"folder_open"},"closed-icon":{"type":"icon","default":"folder"},"icon":{"type":"boolean","default":true,"summary":"false hides the folder or file icon"},"chevron-open-icon":{"type":"icon","default":"keyboard_arrow_down"},"chevron-closed-icon":{"type":"icon","default":"chevron_right"},"open-label":{"type":"string","default-from":"runtime.open-label","summary":"The chevron\'s name while the branch is closed"},"close-label":{"type":"string","default-from":"runtime.close-label","summary":"The chevron\'s name while the branch is open"},"item-class":{"type":"string","default":"","summary":"Classes for the row\'s box"},"container-class":{"type":"string","default":"","summary":"Classes for the row\'s line"},"name-class":{"type":"string","default":"","summary":"Classes for the row\'s name"}},"values":{"open":{"type":"boolean","default":false,"summary":"The branch is open"},"selected":{"type":"boolean","default":false},"active":{"type":"boolean","default":false,"summary":"The node is the current page: aria-current"}},"events":{"open":{"carries":{"id":"string","value":"string"},"summary":"A press on the name, or Enter on a leaf without a link: open {id} of vocabulary 1.1.5 §5"},"toggle":{"carries":{"id":"string","open":"boolean","value":"string"},"summary":"The branch opened or closed (vocabulary §5 toggle); the DOM name sf-tree-item-toggle is unchanged"}},"actions":{"expand":{"x-outcomes":["applied","refused"],"summary":"Opens the branch; refused for a file, a leaf or a disabled node"},"collapse":{"x-outcomes":["applied","refused"],"summary":"Closes the branch"},"toggle-open":{"x-outcomes":["applied","refused"],"summary":"Opens a closed branch, closes an open one"},"activate":{"x-outcomes":["applied","refused"],"summary":"What Enter does on a leaf: follows its link, or sends open"},"focus-item":{"x-outcomes":["applied","refused"],"summary":"Moves the focus to the node\'s row"}},"css-variables":{"--sf-tree-item-gap":{"type":"length","state":"default"},"--sf-tree-item-name-color":{"type":"color","state":"default"},"--sf-tree-item-icon-color":{"type":"color","state":"default"},"--sf-tree-item-drop-background-color":{"type":"color","state":"drop-target"},"--sf-tree-item-drop-outline-color":{"type":"color","state":"drop-target"}}}');

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