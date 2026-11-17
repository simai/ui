/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "50d2a204ba4c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SPINNER_DEFAULT_LOOK: () => (/* binding */ SPINNER_DEFAULT_LOOK),
/* harmony export */   SPINNER_DOTS: () => (/* binding */ SPINNER_DOTS),
/* harmony export */   SPINNER_DOTS_FILLED: () => (/* binding */ SPINNER_DOTS_FILLED),
/* harmony export */   SPINNER_GRID: () => (/* binding */ SPINNER_GRID),
/* harmony export */   SPINNER_LIVE_AREA: () => (/* binding */ SPINNER_LIVE_AREA),
/* harmony export */   SPINNER_LOOKS: () => (/* binding */ SPINNER_LOOKS),
/* harmony export */   SPINNER_STROKE: () => (/* binding */ SPINNER_STROKE),
/* harmony export */   createInlineSpinner: () => (/* binding */ createInlineSpinner),
/* harmony export */   createLadderSpinnerSvg: () => (/* binding */ createLadderSpinnerSvg),
/* harmony export */   createSpinnerSvg: () => (/* binding */ createSpinnerSvg),
/* harmony export */   createSvgNode: () => (/* binding */ createSvgNode),
/* harmony export */   normalizeSpinnerLook: () => (/* binding */ normalizeSpinnerLook)
/* harmony export */ });
// The spinner's drawing, without the component's side effects (no registry, no
// observer), so a control that shows work in place of its icon -- a button, an
// icon button, a group's segment, a modal waiting for its content -- draws the
// one spinner of the Framework without loading or binding the spinner
// component (simai/ui-source#10).
//
// The ladder: a spinner is drawn on the icon grid. Material Symbols are drawn on
// 24 units and, at the regular weight the Framework's controls use, stroke 2 of
// them; a spinner on the same grid, scaled to the icon box of a step, strokes as
// the icons of that step do, and needs no stroke of its own per step.
//
// The ring is drawn inside the icon's live area, not across its box (docs
// review R027, owner decision C11, 2026-11-07): Material Symbols draw in 20 of
// their 24 units and leave 2 of air on every side, so a ring that filled the
// box stood larger than the icon beside it. On the grid the ring's outer edge
// is the live area -- radius 9 at stroke 2, 20 units across -- and the box
// stays the icon's box, so a control that swaps its icon for the spinner moves
// nothing. The proportion is the grid's, the same at every step.
//
// The looks (simai/ui-source#11): every spinner carries the four looks on the
// same ring -- the arc and the breathing arc (one circle, two motions), the
// comet and the dots -- and the spinner sheet shows the one the page asks for:
// data-sf-spinner on html, body or any block (the nearest wins), data-variant on
// the spinner itself above both. The choice is CSS alone, so a page that
// changes the attribute changes every spinner at once, drawn or not yet drawn.
// Without the spinner sheet only the arc is shown, still.
const SVG_NS = 'http://www.w3.org/2000/svg';
const SPINNER_GRID = 24;
const SPINNER_STROKE = 2;
const SPINNER_LIVE_AREA = 20;
const SPINNER_LOOKS = ['arc', 'breathing', 'comet', 'dots'];
const SPINNER_DEFAULT_LOOK = 'arc'; // The dots look on the grid: a ring of dots as big as the stroke allows, so at
// every step the dots are the step's and no attribute sizes them.

const SPINNER_DOTS = 8;
const SPINNER_DOTS_FILLED = 3; // The comet: a head and a tail a little under half the ring, in segments whose
// opacity falls towards the end of the tail. Segments rather than a gradient,
// because an SVG gradient cannot follow a circle and a CSS one would leave the
// ring and its stroke; each segment strokes in the current ink.

const COMET_SEGMENTS = 10;
const COMET_LENGTH = 40;
function normalizeSpinnerLook(value, fallback = SPINNER_DEFAULT_LOOK) {
  const look = String(value ?? '').trim().toLowerCase();
  return SPINNER_LOOKS.includes(look) ? look : fallback;
}
function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    node.setAttribute(key, String(value));
  });
  return node;
}

const round = value => Math.round(value * 1000) / 1000; // The four looks in one drawing. On the ladder it is the 24-unit grid with
// stroke 2, every look on the ring of the live area (`inset` 2 units from the
// edge of the box); a spinner still drawn in pixels (the deprecated attributes) passes
// its own width, height and stroke. The circles carry presentation attributes
// as well as their classes: the spinner sheet styles them (track colour, the
// motion of each look, the still frame under reduced motion), and until that
// sheet has arrived they draw a faint ring and the arc in the current ink
// rather than a filled black disc; the comet and the dots wait hidden. The arc
// is a fixed 30% of the ring (simai/ui-source#13): the sheet turns the drawing,
// the arc itself never changes length.


function createSpinnerSvg({
  width = SPINNER_GRID,
  height = SPINNER_GRID,
  stroke = SPINNER_STROKE,
  dots = SPINNER_DOTS,
  filled = SPINNER_DOTS_FILLED,
  dotRadius = null,
  direction = 'clockwise',
  pixel = false,
  inset = 0
} = {}) {
  const cx = width / 2;
  const cy = height / 2; // The outer edge of every look: the track, the arc, the comet and the dots.

  const half = Math.max(stroke, Math.min(width, height) / 2 - inset);
  const radius = Math.max(1, half - stroke / 2);
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${width} ${height}`,
    width: pixel ? width : null,
    height: pixel ? height : null,
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const ring = {
    cx,
    cy,
    r: round(radius),
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': stroke
  };
  const track = createSvgNode('circle', {
    class: 'sf-loader-ring-filled',
    ...ring,
    opacity: '0.3'
  });
  const accent = createSvgNode('circle', {
    class: 'sf-loader-ring-accent',
    ...ring,
    'stroke-linecap': 'round',
    pathLength: 100,
    'stroke-dasharray': '30 70',
    transform: `rotate(90 ${cx} ${cy})`
  }); // The comet starts at the top and runs clockwise: segment 0 is the end of the
  // tail, the last one the head, drawn last and with a round cap.

  const comet = createSvgNode('g', {
    class: 'sf-loader-comet',
    display: 'none',
    transform: `rotate(-90 ${cx} ${cy})`
  });
  const segment = COMET_LENGTH / COMET_SEGMENTS;

  for (let index = 0; index < COMET_SEGMENTS; index += 1) {
    const head = index === COMET_SEGMENTS - 1;
    comet.append(createSvgNode('circle', {
      class: `sf-loader-comet-segment${head ? ' sf-loader-comet-head' : ''}`,
      ...ring,
      'stroke-linecap': head ? 'round' : 'butt',
      pathLength: 100,
      'stroke-dasharray': `${round(segment)} ${round(100 - segment)}`,
      'stroke-dashoffset': round(-segment * index),
      opacity: round(((index + 1) / COMET_SEGMENTS) ** 1.6)
    }));
  } // The dots sit on the same ring: a dot as wide as the stroke allows without
  // touching its neighbours, so fewer dots are bigger ones.


  const count = Math.max(3, Math.min(32, Math.floor(Number(dots) || SPINNER_DOTS)));
  const active = Math.max(1, Math.min(count, Math.floor(Number(filled) || SPINNER_DOTS_FILLED)));
  const fitted = Math.min(stroke, 0.7 * Math.PI * (half - stroke) / count);
  const dotR = dotRadius === null || dotRadius === undefined || dotRadius === '' ? fitted : Math.max(1, Math.min(Number(dotRadius) || fitted, half / 4));
  const orbit = Math.max(dotR, half - dotR);
  const dotsGroup = createSvgNode('g', {
    class: 'sf-loader-dots',
    display: 'none',
    style: `--sf-loader-dot-count:${count}; --sf-loader-dot-filled:${active};`
  });

  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 / count * index - Math.PI / 2;
    const step = direction === 'counterclockwise' ? index : (count - index) % count;
    dotsGroup.append(createSvgNode('circle', {
      class: `sf-loader-dot${index < active ? ' sf-loader-dot--active' : ''}`,
      cx: round(cx + orbit * Math.cos(angle)),
      cy: round(cy + orbit * Math.sin(angle)),
      r: round(dotR),
      fill: 'currentColor',
      style: `--sf-loader-dot-index:${index}; --sf-loader-dot-step:${step};`
    }));
  }

  svg.append(track, accent, comet, dotsGroup);
  return svg;
} // The drawing on the icon grid, the one every spinner on the ladder uses: the
// ring in the icon's live area, 20 of the 24 units.

function createLadderSpinnerSvg(options = {}) {
  return createSpinnerSvg({ ...options,
    width: SPINNER_GRID,
    height: SPINNER_GRID,
    stroke: SPINNER_STROKE,
    dotRadius: null,
    pixel: false,
    inset: (SPINNER_GRID - SPINNER_LIVE_AREA) / 2
  });
} // A spinner that stands in a control: endless, decorative (the control keeps
// its label and says aria-busy), and marked bound so the spinner component,
// when it is on the page, leaves it as drawn. `className` names the control's
// slot for it; `overlay` lays it over the control's hidden label instead of in
// the place of an icon. Its look is the page's, as every spinner's.

function createInlineSpinner({
  className = '',
  overlay = false
} = {}) {
  const root = document.createElement('span');
  root.className = ['sf-loader-container', 'sf-loader--infinite', className, className && overlay ? `${className}--overlay` : ''].filter(Boolean).join(' ');
  root.dataset.sfSpinnerBound = '1';
  root.dataset.infinite = 'true';
  root.setAttribute('aria-hidden', 'true');
  const indicator = document.createElement('span');
  indicator.className = 'sf-loader--loading-indicator';
  indicator.append(createLadderSpinnerSvg());
  root.append(indicator);
  return root;
}

/***/ },

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
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_file_types_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f3cba14ced8a");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("50d2a204ba4c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d9bd94b9a408");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("fb5cbd0ee7de");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("d31d60a77b96");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("9bfaaf7443b9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__);
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









 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// What a list writes when its rows are dragged: {ids, source}.

const RECORDS_TYPE = 'application/x-sf-records+json'; // Quality profile gate 17 (window_from_entries): a tree that may hold more
// entries than this draws only those in view.

const WINDOW_FROM = 300; // Rows drawn beyond the view on each side, and the height a row is taken to
// have before one has been measured.

const WINDOW_MARGIN = 20;
const ROW_GUESS = 48; // An entry id as the local part of an element id: every character outside
// [A-Za-z0-9_-] written as _<hex>, so two ids never meet in one.

const idWord = id => String(id).replace(/[^A-Za-z0-9_-]/gu, char => `_${char.codePointAt(0).toString(16)}`); // A branch: an entry with children, or one that says it has them before they
// are loaded (has-children). A file is never one.


const isBranch = entry => entry.kind !== 'file' && (entry.childIds.length > 0 || entry.hasChildren); // A folder: a branch, or an entry the host calls one with nothing in it
// (C102: no children is a leaf unless kind="folder").


const isFolder = entry => isBranch(entry) || entry.kind === 'folder'; // The rows a lazy branch shows under itself (C102 item 6) are keyed by its id.


const PLACEHOLDER = '\u0000';

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
    // `kind` is one of the twelve words of core file-types (C102); `type` the
    // legacy name. No kind: the entry's place says it -- children make a
    // folder, none a leaf whose name may say its type.
    kind: (0,_core_js_file_types_index_js__WEBPACK_IMPORTED_MODULE_4__.fileKind)(item.kind || item.type),
    open: Boolean(item.open),
    selected: Boolean(item.selected),
    active: Boolean(item.active),
    disabled: Boolean(item.disabled),
    // A branch whose children are not here yet (TR-5): it shows the chevron
    // and opens, and its toggle is the host's cue to load them.
    hasChildren: Boolean(pick(item, 'has-children', 'hasChildren')),
    // A name (C102), or false for none; empty or true: chosen by kind,
    // extension and place.
    icon: item.icon === false || item.icon === 'false' ? false : typeof item.icon === 'string' && item.icon !== 'true' ? item.icon : '',
    // A second text after the name, a highlighted line, the «…» line, a
    // hidden page, and a lazy branch whose children failed to load (C102).
    note: text(item.note),
    mark: Boolean(item.mark),
    more: Boolean(item.more),
    hidden: Boolean(item.hidden),
    error: Boolean(item.error),
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

const TreeElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  // The chevron's names (open-label, close-label) are the tree's own words
  // too, as sf-tree-item says them: a language file registers words under
  // one component's name (C282).
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_8__,
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

    'expand-all'() {
      return this.setAllOpen(true);
    },

    'collapse-all'() {
      return this.setAllOpen(false);
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
    this._frame = 0; // The drawn entries whose name the line cuts (TR-14): their rows carry a
    // tooltip with the whole name.

    this._cut = new Set();
    this._resize = null; // Lazy branches whose retry was pressed: they show «Загрузка…» again
    // until the host answers with a new items (C102 item 6).

    this._retrying = new Set();
    this._spinners = new Map();
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

    this._retrying.clear();

    for (const id of [...this._spinners.keys()]) if (!entries.has(id)) this._spinners.delete(id);

    const before = this.selectionIds();
    let next;
    if (said.length) next = this.multiple() ? said : [said.at(-1)];else next = before.filter(id => entries.has(id));
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

      const branch = isBranch(entry);
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
      if (open) visit(entry.childIds, level + 1); // An open lazy branch with nothing loaded yet: a «Загрузка…» row, or the
      // error row with its retry when the host said the load failed.

      if (open && !entry.childIds.length && entry.hasChildren) {
        const placeholder = entry.error && !this._retrying.has(id) ? 'error' : 'loading';
        rows.push({
          id: `${id}${PLACEHOLDER}${placeholder}`,
          placeholder,
          entry: {
            id: `${id}${PLACEHOLDER}`,
            parent: id,
            childIds: [],
            label: '',
            value: entry.value,
            disabled: placeholder === 'loading',
            placeholder
          },
          level: level + 1,
          setsize: 1,
          posinset: 1,
          branch: false,
          open: false
        });
      }
    });

    visit(this._roots || [], 1);
    this._rows = rows;
    this._hasBranches = rows.some(row => row.branch) || [...this._entries.values()].some(isBranch);
    return rows;
  } // ---- selection (§18.2) -------------------------------------------------
  // many and check keep a list of ids; one keeps one.


  multiple() {
    return this.selection === 'many' || this.selection === 'check';
  }

  selectionIds() {
    if (this.multiple()) return Array.isArray(this.selectedIds) ? this.selectedIds.map(text) : [];
    const one = text(this.selected);
    return one ? [one] : [];
  } // The selection as a set, kept while the value it is read from is the same
  // array (or id): a row asks whether it is selected on every drawing, and a
  // tree of 10 000 entries all checked scanned a 10 000-id list per row and
  // per entry -- 73 ms a change (simai/ui-source#43, tests/browser/tree-scale).


  selectionSet() {
    const source = this.multiple() ? this.selectedIds : text(this.selected);

    if (this._selectionSource !== source || !this._selectionSet) {
      this._selectionSource = source;
      this._selectionSet = new Set(this.selectionIds());
    }

    return this._selectionSet;
  }

  writeSelection(ids, {
    quiet = true
  } = {}) {
    const wanted = new Set(ids);
    const ordered = [...this._entries.keys()].filter(id => wanted.has(id));
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
    return this.selection !== 'none' && this.selectionSet().has(id);
  } // ---- checks (selection="check", C102 item 7) ---------------------------
  // Every entry's check: 'true', 'false' or 'mixed'. A branch is what its
  // children are -- all checked, none, or some (mixed); a branch in the list
  // whose children are not in it checks them (children that arrived after it
  // was checked, or a list that names only the parent).


  checkStates() {
    const set = this.selectionSet();
    const states = new Map();

    const visit = (id, inherited) => {
      const entry = this._entries.get(id);

      const own = inherited || set.has(id);

      if (!entry.childIds.length) {
        states.set(id, own ? 'true' : 'false');
        return;
      }

      for (const child of entry.childIds) visit(child, own);

      states.set(id, branchCheck(entry.childIds.map(child => states.get(child))));
    };

    for (const id of this._roots || []) visit(id, false);

    return states;
  } // A press or Space on a row: it and everything under it take the opposite
  // of its check, and every branch above it is what its children now are.


  checkRow(row) {
    const states = this.checkStates();
    const on = states.get(row.id) !== 'true';

    const mark = id => {
      states.set(id, on ? 'true' : 'false');

      for (const child of this._entries.get(id).childIds) mark(child);
    };

    mark(row.id);

    for (let parent = row.entry.parent; parent !== null && parent !== undefined; parent = this._entries.get(parent)?.parent) {
      const entry = this._entries.get(parent);

      if (!entry) break;
      states.set(parent, branchCheck(entry.childIds.map(child => states.get(child))));
    }

    const ordered = this.writeSelection([...states].filter(([, state]) => state === 'true').map(([id]) => id), {
      quiet: false
    });
    this.sfEmit('select', {
      ids: ordered,
      id: row.id,
      selected: on
    });
  }

  selectRow(row) {
    const mode = this.selection;
    if (row.placeholder) return;

    if (mode === 'check') {
      this.checkRow(row);
      return;
    }

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
    if (!isBranch(entry)) return {
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
  } // The actions expand-all and collapse-all, and * on a row (its siblings):
  // every branch named that is not disabled; a toggle for each that changed.


  setAllOpen(open, ids = null) {
    const changed = [];

    for (const entry of ids ? ids.map(id => this._entries.get(id)).filter(Boolean) : this._entries.values()) {
      if (!isBranch(entry) || entry.disabled || this._open.get(entry.id) === Boolean(open)) continue;

      this._open.set(entry.id, Boolean(open));

      changed.push(entry);
    }

    if (!changed.length) return {
      outcome: 'applied'
    };
    this._rowsDirty = true;
    this.requestComponentUpdate('open');

    for (const entry of changed) this.sfEmit('toggle', {
      id: entry.id,
      open: Boolean(open),
      value: entry.value
    });

    return {
      outcome: 'applied'
    };
  } // The error row's retry (C102 item 6): the branch shows «Загрузка…» again
  // and the host is asked to load it once more, retry {id, value}.


  retryEntry(id) {
    const entry = this._entries.get(text(id));

    if (!entry || !entry.error || this._retrying.has(entry.id)) return;

    this._retrying.add(entry.id);

    this._rowsDirty = true;
    this.requestComponentUpdate('retry');
    this.sfEmit('retry', {
      id: entry.id,
      value: entry.value
    });
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
  // records travel as application/x-sf-records+json, which sf-view-table writes.


  dropKind(event) {
    if (this.static) return null;
    if (this._dragId !== undefined && this.reorder) return 'entry';
    const types = [...(event.dataTransfer?.types ?? [])];
    if (this.acceptRecords && types.includes(RECORDS_TYPE)) return 'records';
    if (this.acceptFiles && types.includes('Files')) return 'files';
    return null;
  }

  dropNode(event) {
    const node = event.target?.closest?.('.sf-tree-item[data-sf-entry]');
    return node && this.contains(node) && node.getAttribute('aria-disabled') !== 'true' ? node : null;
  }

  markDropTarget(node, position = '') {
    if (this._dropTarget === node && this._dropPosition === position) return;
    this._dropTarget?.removeAttribute('data-sf-drop-target');
    this._dropTarget?.removeAttribute('data-sf-drop-position');
    this._dropTarget = node;
    this._dropPosition = position;
    if (node && position) node.setAttribute('data-sf-drop-position', position);
    if (node && (!position || position === 'inside')) node.setAttribute('data-sf-drop-target', '');
  } // ---- reorder inside the tree (C102 §7 item 11) -------------------------
  // Where a dragged entry lands on a row: the upper quarter puts it before
  // the row, the lower quarter after it, the middle into it -- only an entry
  // that can hold others (a folder, a page; not a file). Never into itself or
  // anything under it.


  dropPlace(event, node) {
    const dragged = this._entries.get(this._dragId);

    const target = this._entries.get(node.dataset.sfEntry);

    if (!dragged || !target) return null;

    for (let id = target.id; id !== null && id !== undefined; id = this._entries.get(id)?.parent) {
      if (id === dragged.id) return null;
    }

    const box = node.querySelector(':scope > .sf-tree-item-container')?.getBoundingClientRect() ?? node.getBoundingClientRect();
    const at = (event.clientY - box.top) / (box.height || 1);
    const holds = isFolder(target) || target.kind === 'page' || !target.kind && this.typeOf(target, false, false).kind === 'file';
    let position = at < 0.25 ? 'before' : at > 0.75 ? 'after' : holds ? 'inside' : at < 0.5 ? 'before' : 'after';
    if (position === 'inside') return {
      position,
      parent: target.id,
      before: null
    };
    const siblings = target.parent === null ? this._roots : this._entries.get(target.parent).childIds;
    let before = target.id;

    if (position === 'after') {
      const rest = siblings.slice(siblings.indexOf(target.id) + 1).filter(id => id !== dragged.id);
      before = rest[0] ?? null;
    }

    if (before === dragged.id) return null;
    return {
      position,
      parent: target.parent,
      before
    };
  }

  handleTreeDragStart = event => {
    const node = event.target?.closest?.('.sf-tree-item[data-sf-entry][draggable="true"]');
    if (!this.reorder || !node || !this.contains(node)) return;

    const entry = this._entries.get(node.dataset.sfEntry);

    if (!entry || entry.disabled) return;
    this._dragId = entry.id;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', entry.label);
  };
  handleTreeDragEnd = () => {
    this._dragId = undefined;
    this.markDropTarget(null);
  };
  handleTreeDragOver = event => {
    const kind = this.dropKind(event);
    const node = kind ? this.dropNode(event) : null;

    if (!node) {
      this.markDropTarget(null);
      return;
    }

    if (kind === 'entry') {
      const place = this.dropPlace(event, node);

      if (!place) {
        this.markDropTarget(null);
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      this.markDropTarget(node, place.position);
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

    if (kind === 'entry') {
      const place = node ? this.dropPlace(event, node) : null;
      const id = this._dragId;
      this.markDropTarget(null);
      this._dragId = undefined;
      if (!place) return;
      event.preventDefault(); // The tree moves nothing itself: the host moves the entry and gives a
      // new items. parent null is the tree's top level; before null, the end.

      this.sfEmit('move', {
        ids: [id],
        parent: place.parent,
        before: place.before,
        source: null
      });
      return;
    }

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
    this.addEventListener('dragstart', this.handleTreeDragStart);
    this.addEventListener('dragend', this.handleTreeDragEnd);
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
    this.removeEventListener('dragstart', this.handleTreeDragStart);
    this.removeEventListener('dragend', this.handleTreeDragEnd);
    this.markDropTarget(null);
    this.removeEventListener('keydown', this.handleTreeKeydown);
    this.removeEventListener('focusin', this.handleTreeFocusIn);
    this.removeEventListener('click', this.handleTreeClick);
    clearTimeout(this._typeaheadTimer);
    this._itemObserver?.disconnect();
    this._itemObserver = null;
    this.unwatchScroll();
    this._resize?.disconnect();
    this._resize = null;
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
    return !this.static && this._rows.length > WINDOW_FROM;
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

    const chosen = this._rows.findIndex(row => !row.placeholder && (this.isSelected(row.id) || row.entry.active));

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

    if (row.placeholder === 'error') {
      this.retryEntry(row.entry.parent);
      return;
    }

    if (row.entry.disabled || row.placeholder) return;
    if (this.selection === 'one' || this.selection === 'many' || this.selection === 'check') this.selectRow(row);
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
    if (row.placeholder === 'error') {
      this.retryEntry(row.entry.parent);
      return;
    }

    if (row.entry.disabled || row.placeholder) return;
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

      if (!this._rows[at].placeholder && this._rows[at].entry.label.trim().toLocaleLowerCase().startsWith(this._typeahead)) {
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
        if (row.branch && !row.open) this.setEntryOpen(row.id, true);else if (row.open && row.entry.childIds.length) target = index + 1;
        break;

      case 'ArrowLeft':
        if (row.branch && row.open) this.setEntryOpen(row.id, false);else if (row.entry.parent !== null) target = this._rows.findIndex(one => one.id === row.entry.parent);
        break;

      case 'Enter':
        if (row.branch) this.setEntryOpen(row.id, !row.open);else this.activateRow(row);
        break;

      case ' ':
        if (this.selection === 'none' || row.placeholder) this.activateRow(row);else if (!row.entry.disabled) this.selectRow(row);
        break;

      case '*':
        {
          // APG: every sibling branch of the row opens.
          const siblings = row.entry.parent === null || row.entry.parent === undefined ? this._roots : this._entries.get(row.entry.parent)?.childIds ?? [];
          this.setAllOpen(true, siblings);
          break;
        }

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
  // The kind and icon an entry is shown with (core file-types, C102): icon,
  // kind, the name's extension (file-types="name"), its place. The tree's
  // icons setting keeps them on every row, on folders only, or on none. An
  // entry's own open-icon / closed-icon still name its glyph (a section icon
  // a host passed that way before icon took a name).

  typeOf(entry, branch, open) {
    const folder = branch || entry.kind === 'folder';
    const custom = folder ? open ? entry.openIcon : entry.closedIcon : entry.closedIcon || entry.openIcon;
    return (0,_core_js_file_types_index_js__WEBPACK_IMPORTED_MODULE_4__.fileType)({
      icon: entry.icon === false ? false : entry.icon || custom || '',
      kind: entry.kind,
      name: entry.label,
      folder,
      open,
      byName: this.fileTypes !== 'none'
    });
  }

  iconOf(entry, branch, open) {
    const mode = this.icons;
    if (mode === 'none') return '';
    if (mode === 'branches' && !(branch || entry.kind === 'folder')) return '';
    return this.typeOf(entry, branch, open).icon;
  } // The spinner of a lazy branch's «Загрузка…» row: one element per branch,
  // so a redraw does not start it again.


  spinnerFor(id) {
    let spinner = this._spinners.get(id);

    if (!spinner) {
      spinner = (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_5__.createInlineSpinner)({
        className: 'sf-tree-item-spinner-ring'
      });

      this._spinners.set(id, spinner);
    }

    return spinner;
  } // Whether an entry's descendants hold the current page (an entry that is
  // active, aria-current="page").


  holdsCurrent(entry, seen = new Set()) {
    for (const id of entry?.childIds ?? []) {
      if (seen.has(id)) continue;
      seen.add(id);

      const child = this._entries.get(id);

      if (child?.active || this.holdsCurrent(child, seen)) return true;
    }

    return false;
  }

  rowContext(row, tabStopId) {
    const entry = row.entry;

    if (row.placeholder) {
      return {
        id: row.id,
        placeholder: row.placeholder,
        label: row.placeholder === 'error' ? this._words.error : this._words.loading,
        retryLabel: this._words.retry,
        spinner: row.placeholder === 'loading' ? this.spinnerFor(entry.parent) : null,
        onRetry: row.onRetry,
        level: row.level,
        tabStop: row.id === tabStopId
      };
    }

    const check = this.selection === 'check';
    const selected = !check && this.isSelected(row.id);
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
      nodeIcon: this.iconOf(entry, row.branch, row.open),
      folder: row.branch || entry.kind === 'folder',
      note: entry.note,
      mark: entry.mark,
      more: entry.more,
      pageHidden: entry.hidden,
      hiddenWord: this._words.hidden,
      check: check ? this._checks?.get(row.id) ?? 'false' : '',
      // The check box takes the tree's step (C109 point 3).
      checkSize: this.size,
      draggable: Boolean(this.reorder) && !entry.disabled,
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
      // A closed branch that holds the current page: a medium label, as the
      // menu column's (C129, R065 a; RG-NV 31h). The class markup finds it by
      // :has; the tree draws only the open rows, so it says it.
      itemClass: row.branch && !row.open && this.holdsCurrent(entry) ? 'sf-tree-item--holds-current' : '',
      tipId: this._cut.has(row.id) ? (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__.partId)(this._tipPath, `tip-${idWord(row.id)}`) : '',
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
        },
        onRetry: event => {
          event.preventDefault();
          event.stopPropagation();

          const row = this._rows.find(one => one.id === id);

          if (row?.placeholder === 'error') this.retryEntry(row.entry.parent);
        }
      };

      this._handlers.set(id, handlers);
    }

    return handlers;
  } // The static tree (C102 item 5): the entries as a nested list, all of
  // them, nothing to press.


  staticContext() {
    const node = id => {
      const entry = this._entries.get(id);

      const branch = entry.childIds.length > 0;
      return {
        entry,
        nodeIcon: this.iconOf(entry, isBranch(entry), branch),
        folder: isFolder(entry),
        hiddenWord: this._words.hidden,
        children: entry.childIds.map(node)
      };
    };

    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      nodes: (this._roots || []).map(node),
      ariaLabel: this.getAttribute('aria-label') || '',
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle()
    });
  }

  templateContext() {
    this._words = {
      open: this.sfWord('open-label'),
      close: this.sfWord('close-label'),
      loading: this.sfWord('loading'),
      error: this.sfWord('load-error'),
      retry: this.sfWord('retry'),
      hidden: this.sfWord('hidden')
    };

    if (this.static) {
      this._rows = [];
      this._rowsDirty = true;
      return this.staticContext();
    }

    const rows = this.flatten();

    for (const id of [...(this._handlers?.keys() ?? [])]) if (!this._entries.has(id.split(PLACEHOLDER)[0])) this._handlers.delete(id);

    this._checks = this.selection === 'check' ? this.checkStates() : null; // The tooltips' ids start with the tree's path (§7.1.1), read once a drawing.

    this._tipPath = this._cut.size ? (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__.instancePath)(this, {
      kind: 'sf-tree'
    }) : '';
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
    const context = this.templateContext();
    return this.static ? (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderStaticTreeTemplate)(context) : (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderTreeTemplate)(context);
  } // A row is measured after every drawing: the first one may be drawn before
  // the sheets arrive, taller than it will be. A height that changed places
  // the spacers again.


  afterRender(changedAttributes) {
    super.afterRender?.(changedAttributes);
    this.watchWidth();
    if (!this._rows.length) return;
    const before = this._rowHeight;
    this.measureRow();
    const cut = this.measureCut();
    if (cut || this.windowed() && Math.abs((this._rowHeight || 0) - (before || 0)) > 0.5) this.requestComponentUpdate(cut ? 'cut' : 'window');
  } // ---- long names (TR-14) ------------------------------------------------
  // A name is one line, cut with an ellipsis (the tree sheet); a drawn row
  // whose name does not fit gets the whole name as its tooltip and its
  // aria-label. Whether it fits is read from the drawn name: the column, the
  // font and the indent decide it, not the length of the text. True when the
  // set of cut rows changed and the rows are to be drawn again.


  measureCut() {
    let changed = false;

    for (const node of this.getRenderedItems()) {
      const name = node.querySelector(':scope > .sf-tree-item-container > .sf-tree-item-name');
      if (!name) continue;
      const id = node.dataset.sfEntry;
      const cut = name.scrollWidth - name.clientWidth > 0.5;
      if (cut === this._cut.has(id)) continue;
      if (cut) this._cut.add(id);else this._cut.delete(id);
      changed = true;
    }

    for (const id of [...this._cut]) if (!this._entries.has(id)) this._cut.delete(id);

    return changed;
  } // A column that narrows or widens cuts other names, and so does the sheet
  // that arrives after the first drawing (the names wrapped until then, and
  // nothing was cut): the tree's box changes either way, and is measured again.


  watchWidth() {
    const list = this.querySelector(':scope > .sf-tree');
    if (this._resize || !list || typeof ResizeObserver === 'undefined') return;
    this._resize = new ResizeObserver(() => {
      if (this.measureCut()) this.requestComponentUpdate('cut');
    });

    this._resize.observe(list);
  }

}

function same(a, b) {
  return a.length === b.length && a.every((one, index) => one === b[index]);
} // A branch's check from its children's: all checked, none, or some.


function branchCheck(states) {
  if (states.every(state => state === 'true')) return 'true';
  return states.some(state => state !== 'false') ? 'mixed' : 'false';
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
/* harmony export */   renderStaticTreeTemplate: () => (/* binding */ renderStaticTreeTemplate),
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
} // The tree's step on the size ladder (C109 point 3): 1 is the sheet's
// default and writes no class.


function sizeClass(size) {
  return size === '1/2' || size === '2' ? `sf-tree--size-${size}` : '';
} // The tree's entries, flat and keyed by id (standard 1.3.8 §18.4): a row that
// stays keeps its element, and only what changed in it is written. Over 300
// visible entries the rows outside the view are two spacers.


function renderTreeTemplate(context) {
  const rootClasses = joinClasses('sf-tree flex flex-col', sizeClass(context.size), context.rootClass);
  const rows = context.tabStopDrawn || !context.rows.length ? context.rows : [{ ...context.rows[0],
    tabStop: true
  }, ...context.rows.slice(1)];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="tree"
      data-sf-tree-flat=${context.hasBranches ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'true'}
      aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-multiselectable=${context.selection === 'many' || context.selection === 'check' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >${context.before ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tree-spacer" aria-hidden="true" style=${`block-size:${context.before}px`}></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(rows, row => row.id, row => (0,_tree_item_js_templates_row_js__WEBPACK_IMPORTED_MODULE_2__.renderTreeRow)(row))}${context.after ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tree-spacer" aria-hidden="true" style=${`block-size:${context.after}px`}></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>`;
} // The static tree (owner decision C102 item 5; research §7 item 7): a
// structure shown in text -- a project's files in documentation. The class
// markup .sf-tree--static that Docara writes too: nested ul/li (list
// semantics, not role tree), no Tab stop, no chevrons, every level shown; a
// row is a text line with the type icon, the name, its note (a comment), a
// highlighted line (mark) and the «…» line (more).

function renderStaticNode(node) {
  const entry = node.entry;
  const classes = joinClasses('sf-tree-item flex flex-col', node.folder ? 'sf-tree-item--folder' : 'sf-tree-item--file', // Every level is shown: a group shows under an .open item only.
  node.children.length ? 'open' : '', entry.mark ? 'sf-tree-item--mark' : '', entry.more ? 'sf-tree-item--more' : '', entry.hidden ? 'sf-tree-item--hidden' : '');
  const icon = entry.more ? 'more_horiz' : node.nodeIcon;
  const name = entry.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-tree-item-name" href=${entry.href} target=${entry.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} rel=${entry.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${entry.label}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-item-name">${entry.label}</span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class=${classes} data-value=${entry.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}><div class="sf-tree-item-container flex">${(0,_tree_item_js_templates_row_js__WEBPACK_IMPORTED_MODULE_2__.renderIcon)(icon, 'sf-tree-node-icon')}${name}${entry.hidden && node.hiddenWord ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-item-note sf-tree-item-hidden-word">${node.hiddenWord}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${entry.note ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-item-note">${entry.note}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>${node.children.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-tree-group" role="list">${node.children.map(renderStaticNode)}</ul>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</li>`;
}

function renderStaticTreeTemplate(context) {
  const rootClasses = joinClasses('sf-tree sf-tree--static flex flex-col', sizeClass(context.size), context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}><ul
      class="sf-tree-group" role="list" aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${context.nodes.map(renderStaticNode)}</ul></div>`;
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

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

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

/***/ "9bfaaf7443b9"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("11ff8dfc051b");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "9bbeb11fb966"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The kinds of an entry and the extensions of a name that say them: one map for every SIMAI Framework part that shows a file or a page by its type -- sf-tree\'s rows today; sf-file-upload, sf-file-download and sf-view\'s file cells to follow; Docara\'s static tree, Larena\'s files and ui-mail read the same words (owner decision C102, 2026-11-12; research ui-control control/research/2026-11-12-tree.md section 7 items 2-3). A kind is one of twelve words; its icon is a Material Symbols name of the Framework\'s icon font. An extension is matched on the name\'s last dot, in lower case. A kind without extensions is said by the host (kind) or by the entry\'s place (folder: it has children). Keep the words: they are public (an entry\'s kind).","schema":"simai.framework.file-types","version":1,"kinds":{"folder":{"icon":"folder","open-icon":"folder_open","extensions":[]},"file":{"icon":"draft","extensions":[]},"page":{"icon":"article","extensions":[]},"document":{"icon":"description","extensions":["md","txt","doc","docx","pdf","rtf","odt"]},"image":{"icon":"image","extensions":["png","jpg","jpeg","gif","svg","webp","ico","avif"]},"code":{"icon":"code","extensions":["js","mjs","ts","css","scss","html","php","py","sh","vue"]},"data":{"icon":"data_object","extensions":["json","yml","yaml","xml","toml","lock","ini","env"]},"table":{"icon":"table_chart","extensions":["csv","xls","xlsx","ods"]},"archive":{"icon":"folder_zip","extensions":["zip","tar","gz","rar","7z"]},"video":{"icon":"movie","extensions":["mp4","mov","webm"]},"audio":{"icon":"audio_file","extensions":["mp3","wav","ogg","m4a"]},"link":{"icon":"link","extensions":[]}}}');

/***/ },

/***/ "d31d60a77b96"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tree for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"role","to":null,"kind":"attribute","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"the tree is always role tree; no shim"},{"from":"single","to":"one","kind":"value","setting":"selection","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","section":"§18.2"},{"from":"multiple","to":"many","kind":"value","setting":"selection","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","section":"§18.2"},{"from":"sf-tree-selection-change","to":"sf-tree-select","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-selection-change","to":"select"},"section":"§8, vocabulary 1.1.5 §5","note":"the old detail {item, selected, value}, item the row\'s element"},{"from":"sf-tree-item-click","to":"sf-tree-open","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-item-click","to":"open"},"section":"§8, vocabulary 1.1.5 §5","note":"sent by the sf-tree-item elements the tree drew; detail {item, value, originalEvent}"},{"from":"sf-tree-item-toggle","to":"sf-tree-toggle","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-item-toggle","to":"toggle"},"section":"§8, vocabulary 1.1.5 §5","note":"sent by the sf-tree-item elements the tree drew; detail {item, open, value}"},{"from":"sf-tree-records-drop","to":"sf-tree-move","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-records-drop","to":"move"},"section":"§8, vocabulary 1.1.5 §5","note":"detail {value, ids, source}"},{"from":"sf-tree-files-drop","to":"sf-tree-attach","kind":"event","component":"sf-tree","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-tree-files-drop","to":"attach"},"section":"§8, vocabulary 1.1.5 §5","note":"detail {value, files}"}]}');

/***/ },

/***/ "fb5cbd0ee7de"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tree","tag":"sf-tree","version":"2.4.1","kind":"leaf","settings":{"selection":{"type":"enum","values":["none","one","many","check"],"default":"none"},"icons":{"type":"enum","values":["all","branches","none"],"default":"all"},"file-types":{"type":"enum","values":["name","none"],"default":"name"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"static":{"type":"boolean","default":false},"reorder":{"type":"boolean","default":false},"items":{"type":"list","default":[],"of":{"id":"id","label":"string","href":"string","target":"string","rel":"string","kind":{"type":"enum","values":["folder","file","page","document","image","code","data","table","archive","video","audio","link"]},"value":"string","open":"boolean","selected":"boolean","active":"boolean","disabled":"boolean","has-children":"boolean","icon":{"anyOf":[{"type":"icon"},{"type":"boolean"}]},"open-icon":"icon","closed-icon":"icon","chevron-open-icon":"icon","chevron-closed-icon":"icon","open-label":"string","close-label":"string","note":{"type":"string"},"mark":{"type":"boolean"},"more":{"type":"boolean"},"hidden":{"type":"boolean"},"error":{"type":"boolean"},"revision":"string","children":"list"},"entries":{"key":"id","changes":"content"}},"accept-records":{"type":"boolean","default":false},"accept-files":{"type":"boolean","default":false}},"values":{"selected":{"type":"id","default":""},"selected-ids":{"type":"list","default":[],"of":{"id":"id"}}},"events":{"open":{"carries":{"id":"id","value":"string"}},"select":{"carries":{"ids":"list","id":"id","selected":"boolean"}},"toggle":{"carries":{"id":"id","open":"boolean","value":"string"}},"retry":{"carries":{"id":"id","value":"string"}},"move":{"carries":{"ids":"list","parent":{"type":"id","nullable":true},"before":{"type":"id","nullable":true},"source":"string"}},"attach":{"carries":{"files":"list","parent":"id"}},"window":{"carries":{"first":"number","last":"number"}}},"actions":{"expand":{"with":{"id":"id"}},"collapse":{"with":{"id":"id"}},"focus-entry":{"with":{"id":"id"}},"expand-all":{"with":{}},"collapse-all":{"with":{}}},"presentation":{"skeleton":{"late":["items"]}},"css-variables":{"--sf-tree-gap":{"type":"length","state":"default"},"--sf-tree-padding-inline":{"type":"length","state":"default"},"--sf-tree-indent":{"type":"length","state":"default"},"--sf-tree-radius":{"type":"length","state":"default"},"--sf-tree-color":{"type":"color","state":"default"},"--sf-tree-selected-background-color":{"type":"color","state":"selected"}}}');

/***/ },

/***/ "11ff8dfc051b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tree","runtime":{"loading":"Loading…","load-error":"Could not load","retry":"Retry","hidden":"hidden","open-label":"Open item","close-label":"Close item"}}');

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