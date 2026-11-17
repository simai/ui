/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "4130d35a368a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeSlideContent: () => (/* binding */ normalizeSlideContent)
/* harmony export */ });
// Ignore source formatting, not authored slide boundaries. Non-Node values are
// retained for the existing Slider template context (including Lit results).
function normalizeSlideContent(content) {
  const items = Array.isArray(content) ? content : [content];
  return items.filter(item => {
    if (!(item instanceof Node)) return true;
    if (item.nodeType === Node.COMMENT_NODE) return false;
    return item.nodeType !== Node.TEXT_NODE || item.textContent.trim() !== '';
  });
}

/***/ },

/***/ "d0c0e64421b6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("56ae6cc9a5ec");
/* harmony import */ var _js_viewer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("2e94723fcf46");
/* harmony import */ var _js_masonry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("efe90eda63db");
/* harmony import */ var _component_slider_js_slide_content__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("4130d35a368a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a2bebed909d0");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("755770a8ce5c");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("281c6761571f");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("74650ab742c0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _js_viewer_js__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _js_viewer_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);










 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_9__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__.runtime
}; // sf-gallery 1.3.0 from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8), owner decision C150 (2026-11-14): a set of pictures is a
// grid of picture tiles by default, or the main picture with thumbnails, or
// masonry (C150 (11): each picture in its own shape, into the shortest
// column, js/masonry.js where the browser has no grid-lanes); a press opens the one full-screen viewer of the page (js/viewer.js, SF.Gallery,
// shared with sf-file-preview, C149 (6)); a media library chooses tiles with
// check boxes. The slider and the window it was built from (sf-slider,
// sf-modal) are gone: a row that scrolls is sf-slider (C143). Their settings
// are dated rows of aliases.json, read and ignored until the date.

const GalleryElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en,
    ru
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_8__
});
const viewer = (0,_js_viewer_js__WEBPACK_IMPORTED_MODULE_4__.installViewer)();
const LAYOUTS = ['grid', 'thumbnails', 'masonry'];
const RETIRE = {
  since: '2026-11-14',
  remove_after: '2027-01-01'
};
const RETIRED_SETTINGS = _aliases_json__WEBPACK_IMPORTED_MODULE_8__.aliases.filter(row => row.kind === 'setting' && row.to === null && row.since === RETIRE.since).map(row => row.from); // What retires without a new name (aliases.json rows with `to: null`): kept
// until the date, and each use is noted with it.

function noteRetired(from, kind = 'action', dates = _aliases_json__WEBPACK_IMPORTED_MODULE_8__) {
  (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
    component: 'sf-gallery',
    tag: 'sf-gallery',
    kind,
    attribute: kind === 'attribute' ? from : '',
    from,
    to: null,
    since: dates.since,
    remove_after: dates.remove_after
  });
}

function normalizeSlotNodes(content) {
  if (!content || content === null || typeof content === 'undefined') {
    return [];
  }

  return (0,_component_slider_js_slide_content__WEBPACK_IMPORTED_MODULE_6__.normalizeSlideContent)(content).filter(node => node instanceof Element);
} // A copy of a page's picture for a tile (GL-10, C150 (6)). A plain cloneNode
// cannot hold a picture back: a copied parser-made <img loading="lazy">
// starts its download at once (Chrome). The copy is made from the markup
// with the sources held back, and each picture gets its loading (the page's
// own, else lazy, or eager when asked) and decoding before its source. The
// picture's own object-position -- its focus point (C94 (3)) -- stays.


const SOURCE_ATTRIBUTES = ['srcset', 'src'];

function copyPicture(node, eager = false) {
  if (!(node instanceof Element)) return null;
  const template = document.createElement('template');
  template.innerHTML = node.outerHTML;
  const inert = template.content.firstElementChild;
  if (!inert) return node.cloneNode(true);
  const held = [];
  [inert, ...inert.querySelectorAll('img, source')].filter(one => one.matches('img, source')).forEach(one => {
    const sources = SOURCE_ATTRIBUTES.filter(name => one.hasAttribute(name)).map(name => [name, one.getAttribute(name)]);
    sources.forEach(([name]) => one.removeAttribute(name));
    held.push(sources);
  });
  const copy = document.importNode(inert, true);
  [copy, ...copy.querySelectorAll('img, source')].filter(one => one.matches('img, source')).forEach((one, index) => {
    if (one.localName === 'img') {
      if (!one.hasAttribute('loading') || eager) one.loading = eager ? 'eager' : 'lazy';
      if (!one.hasAttribute('decoding')) one.decoding = 'async';
      one.removeAttribute('slot');
      one.removeAttribute('title');
    }

    held[index].forEach(([name, value]) => one.setAttribute(name, value));
  });
  copy.removeAttribute('slot');
  return copy;
}

function usableHref(value) {
  const href = String(value || '').trim();
  return href && href !== '#' ? href : '';
} // What one child of the gallery is: an <img>, a <picture>, a <figure> with its
// caption, or a link to the large file around a small picture.


function readSlide(slide) {
  const image = slide.matches('img') ? slide : slide.querySelector('img');
  const picture = slide.matches('img, picture') ? slide : slide.querySelector('picture') || image;
  const link = slide.matches('a[href]') ? slide : slide.querySelector('a[href]');
  const figcaption = slide.querySelector('figcaption');
  const caption = slide.getAttribute('data-caption') || figcaption?.textContent?.trim() || slide.getAttribute('title') || image?.getAttribute('title') || '';
  const source = slide.getAttribute('data-src') || image?.getAttribute('data-src') || usableHref(link?.getAttribute('href')) || image?.getAttribute('src') || '';
  return {
    slide,
    picture,
    alt: image?.getAttribute('alt') || '',
    caption,
    item: {
      src: source,
      type: slide.getAttribute('data-type') || link?.getAttribute('type') || undefined,
      alt: image?.getAttribute('alt') || '',
      caption,
      width: Number(image?.getAttribute('width')) || undefined,
      height: Number(image?.getAttribute('height')) || undefined
    }
  };
}

const GALLERY_TRIGGER_SELECTOR = '[data-sf-gallery]'; // How long a finger holds a tile before it is chosen (C150 (9), a phone).

const LONG_PRESS_MS = 500;
const LONG_PRESS_SLOP = 10;

function galleryGroup(element) {
  return String(element?.getAttribute?.('data-sf-gallery') || '').trim();
} // A page's linked pictures: one data-sf-gallery group is one set (the same
// viewer). The large file is the link's address (or data-sf-src / data-src);
// the caption its data-caption, title or figure caption; the picture's alt
// stays the picture's.


function delegatedItem(element) {
  const image = element.matches?.('img') ? element : element.querySelector?.('img');
  const source = element.getAttribute?.('data-sf-src') || element.getAttribute?.('data-src') || usableHref(element.getAttribute?.('href')) || element.getAttribute?.('src') || image?.currentSrc || image?.src || '';
  if (!source) return null;
  const figcaption = element.closest?.('figure')?.querySelector?.('figcaption');
  return {
    src: source,
    type: element.getAttribute?.('data-type') || undefined,
    alt: image?.getAttribute?.('alt') || '',
    caption: element.getAttribute?.('data-caption') || element.getAttribute?.('title') || figcaption?.textContent?.trim?.() || ''
  };
}

function delegatedGroup(trigger) {
  const group = galleryGroup(trigger);
  if (!group) return [trigger];
  return Array.from(document.querySelectorAll(GALLERY_TRIGGER_SELECTOR)).filter(item => galleryGroup(item) === group);
}

function delegatedOption(trigger, items, names) {
  for (const element of [trigger, ...items]) {
    for (const name of names) {
      if (element?.hasAttribute?.(name)) return element.getAttribute(name);
    }
  }

  return null;
}

class SfGallery extends GalleryElement {
  static globalDelegationBound = false; // The page's pictures stay where they were until the first drawing takes
  // them, so the grid core.styles holds before the code (C150 (6)) is never
  // empty for a frame.

  static holdsSlotNodesUntilDrawn = true;

  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      rootClass: {
        default: ''
      }
    };
  }

  static bindGlobalDelegation() {
    if (SfGallery.globalDelegationBound) return;
    SfGallery.globalDelegationBound = true;
    document.addEventListener('click', SfGallery.handleDelegatedGalleryClick);
  }

  static handleDelegatedGalleryClick(event) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const trigger = event.target.closest?.(GALLERY_TRIGGER_SELECTOR);
    if (!trigger || trigger.closest('sf-gallery')) return;
    const elements = delegatedGroup(trigger);
    const items = elements.map(delegatedItem);
    const at = elements.indexOf(trigger);
    if (!items[at]) return;
    const listed = items.filter(Boolean);
    event.preventDefault();
    const loop = delegatedOption(trigger, elements, ['data-sf-gallery-loop', 'data-sf-slider-loop']);
    viewer.view(listed, {
      start: listed.indexOf(items[at]) + 1,
      opener: trigger,
      label: delegatedOption(trigger, elements, ['data-sf-modal-heading', 'data-sf-modal-title', 'data-sf-gallery-title']) || undefined,
      loop: loop !== null && loop !== 'false'
    });
  }

  constructor() {
    super();
    this._current = null;
    this._selected = new Set();
    this._lastPicked = null;
    this._tileCache = {
      nodes: [],
      tiles: []
    };
    this._viewing = false;
    this._syncing = false;
    this._press = null;
    this._swallowClick = false;
    this._masonry = new _js_masonry_js__WEBPACK_IMPORTED_MODULE_5__.MasonryPlacement();
    this._handleClick = this._handleClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handlePointerDown = this._handlePointerDown.bind(this);
    this._handlePointerEnd = this._handlePointerEnd.bind(this);
  }

  connectedCallback() {
    // Every child is a picture of the set (§4.5): a child the page did not
    // name joins the slide slot.
    Array.from(this.children).forEach(child => {
      if (!child.hasAttribute('slot') && !child.hasAttribute('data-sf-static') && child.localName !== 'script' && child.localName !== 'template') {
        child.setAttribute('slot', 'slide');
      }
    });
    RETIRED_SETTINGS.filter(name => this.hasAttribute(name)).forEach(name => noteRetired(name, 'attribute', RETIRE));
    super.connectedCallback(); // Moved on the page: a drawn masonry grid is placed again.

    const masonry = this._hasRendered && this._layout() === 'masonry' ? this.querySelector('.sf-figure-grid--masonry') : null;
    if (masonry) this._masonry.attach(masonry);
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('change', this._handleChange);
    this.addEventListener('pointerdown', this._handlePointerDown);
    this.addEventListener('pointerup', this._handlePointerEnd);
    this.addEventListener('pointercancel', this._handlePointerEnd);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('change', this._handleChange);
    this.removeEventListener('pointerdown', this._handlePointerDown);
    this.removeEventListener('pointerup', this._handlePointerEnd);
    this.removeEventListener('pointercancel', this._handlePointerEnd);
    clearTimeout(this._press?.timer);

    this._masonry.detach();

    if (this._viewing) viewer.close();
    super.disconnectedCallback();
  } // ── the set ──


  _slides() {
    return normalizeSlotNodes(this.getSlotContent('slide'));
  } // The tiles are built once per set of children: a change of the current
  // picture or of the choice draws the same nodes again.


  _tiles() {
    const nodes = this._slides();

    const cache = this._tileCache;
    if (nodes.length === cache.nodes.length && nodes.every((node, index) => node === cache.nodes[index])) return cache.tiles; // Each copy is made when a look first draws it: a copy of the first
    // picture made eager for the main frame would load even in the grid.

    const tiles = nodes.map((node, index) => {
      const read = readSlide(node);
      const copies = {};

      const copy = (name, eager = false) => {
        if (!(name in copies)) {
          copies[name] = copyPicture(read.picture, eager);
          if (copies[name]) this.copyRuntimeData(read.picture, copies[name]);
        }

        return copies[name];
      };

      return { ...read,
        index: index + 1,
        tilePicture: () => copy('tile'),
        mainPicture: () => copy('main', index === 0),
        thumbPicture: () => copy('thumb')
      };
    });
    this._tileCache = {
      nodes,
      tiles
    };
    return tiles;
  }

  get slidesTotal() {
    return this._slides().length;
  }

  get openState() {
    return this.getProp('open');
  }

  get current() {
    if (this._current !== null) return this._normalizeCurrent(this._current);
    return this._normalizeCurrent(this.getProp('current') || 1);
  } // current is a value a page may also write (§4.3): the picture to show.


  set current(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('current');else this.setAttribute('current', String(value));
  }

  _normalizeCurrent(value) {
    const total = this.slidesTotal;
    const parsed = Number.parseInt(String(value || 1), 10);
    const safe = Number.isFinite(parsed) ? parsed : 1;
    return total ? Math.min(Math.max(safe, 1), total) : Math.max(safe, 1);
  }

  _setCurrent(index, source = 'api', {
    emit = true
  } = {}) {
    const next = this._normalizeCurrent(index);

    const previous = this.current;
    this._current = next;

    if (String(this.getAttribute('current') ?? '') !== String(next)) {
      this._syncing = true;
      this.setAttribute('current', String(next));
      this._syncing = false;
    }

    if (source !== 'lightbox' && this._viewing) viewer.view(this._viewerItems(), { ...this._viewerOptions(),
      start: next
    }); // The thumbnails look draws the shown picture: a drawing, not a DOM update.

    if (this.getProp('layout') === 'thumbnails') this.requestComponentUpdate('shown');

    if (emit && next !== previous) {
      // §8: data only; sf-change follows with the same detail until the date.
      this.sfEmit('change', {
        previous,
        current: next,
        total: this.slidesTotal,
        from: source
      });
    }

    return next;
  } // ── selection (C150 (9)) ──


  get selected() {
    return [...this._selected].sort((a, b) => a - b);
  }

  set selected(value) {
    const list = Array.isArray(value) ? value : String(value ?? '').split(/[\s,]+/u);
    const total = this.slidesTotal;
    this._selected = new Set(list.map(one => Number.parseInt(String(one), 10)).filter(one => Number.isFinite(one) && one >= 1 && (!total || one <= total)));
    this.requestComponentUpdate('selected');
  }

  get _selecting() {
    return this.getProp('selection') === 'many';
  }

  _toggleSelected(index, range = false) {
    if (!this._selecting) return;

    if (range && this._lastPicked !== null) {
      const [from, to] = [Math.min(this._lastPicked, index), Math.max(this._lastPicked, index)];

      for (let one = from; one <= to; one += 1) this._selected.add(one);
    } else if (this._selected.has(index)) {
      this._selected.delete(index);
    } else {
      this._selected.add(index);
    }

    this._lastPicked = index;

    this._selectionChanged();
  }

  _selectionChanged() {
    this.requestComponentUpdate('selected');
    this.sfEmit('select', {
      selected: this.selected,
      count: this._selected.size,
      total: this.slidesTotal
    });
  } // ── drawing ──


  get state() {
    const props = this.getPropsContext();
    return { ...props,
      open: this.openState,
      current: this.current,
      rootClass: this.getRootClass(),
      slidesTotal: this.slidesTotal
    };
  }

  _word(key, vars, count) {
    return this.sfWord(key, {
      vars,
      count
    });
  }

  templateContext() {
    const tiles = this._tiles();

    const total = tiles.length;
    const selecting = this._selecting;
    const selectedCount = selecting ? this._selected.size : 0;
    const ratio = ['1/1', '4/3', '16/9', 'auto'].includes(this.getProp('ratio')) ? this.getProp('ratio') : '1/1';
    const [w, h] = this.hasAttribute('ratio') && ratio !== 'auto' ? ratio.split('/') : [];

    const label = this.getAttribute('heading') || this.getAttribute('aria-label') || this._word('heading');

    return this.createTemplateContext({ ...this.state,
      label,
      ratio,
      mainRatio: w && h ? `${w} / ${h}` : '',
      layout: this._layout(),
      tileSize: ['s', 'm', 'l'].includes(this.getProp('tileSize')) ? this.getProp('tileSize') : 'm',
      caption: this.getProp('caption') === 'under' ? 'under' : 'viewer',
      inline: this.getProp('inline') !== false,
      lightbox: this.getProp('lightbox') !== false,
      selecting,
      selectedCount,
      selectedText: this._word('selected-count', {
        count: selectedCount
      }, selectedCount),
      barLabel: this._word('selection'),
      clearLabel: this._word('clear-selection'),
      actions: this.hasSlotContent('actions') ? this.getSlotContent('actions') : '',
      countText: this._word('count', {
        n: this.current,
        total
      }),
      tiles: tiles.map(tile => {
        const vars = {
          n: tile.index,
          total,
          alt: tile.alt
        };
        const thumbnails = this.getProp('layout') === 'thumbnails';
        return {
          index: tile.index,
          caption: tile.caption,
          picture: thumbnails ? null : tile.tilePicture(),
          mainPicture: thumbnails && tile.index === this.current ? tile.mainPicture() : null,
          thumbPicture: thumbnails && total > 1 ? tile.thumbPicture() : null,
          selected: selecting && this._selected.has(tile.index),
          openLabel: this._word(tile.alt ? 'open-picture-named' : 'open-picture', vars),
          thumbLabel: this._word(tile.alt ? 'show-picture-named' : 'show-picture', vars),
          pickLabel: this._word(tile.alt ? 'pick-picture-named' : 'pick-picture', vars)
        };
      })
    });
  }

  _layout() {
    return LAYOUTS.includes(this.getProp('layout')) ? this.getProp('layout') : 'grid';
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderGalleryTemplate)(this.templateContext());
  }

  resolveUpdateMode(changedAttributes = []) {
    if (changedAttributes.length > 0 && changedAttributes.every(name => name === 'open' || name === 'current')) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom(changedAttributes = []) {
    if (this.resolveUpdateMode(changedAttributes) !== 'dom') return false;
    if (this._syncing) return true;
    if (changedAttributes.includes('current')) this._setCurrent(this.getProp('current'), 'api', {
      emit: false
    });

    if (changedAttributes.includes('open')) {
      if (this.openState && !this._viewing) this.open();else if (!this.openState && this._viewing) viewer.close();
    }

    return true;
  }

  afterRender() {
    // Masonry (C150 (11)): where the browser has no grid-lanes, each tile is
    // placed into the shortest column once it has drawn, and again whenever a
    // tile's height changes.
    if (this._layout() === 'masonry' && this.getProp('inline') !== false) this._masonry.attach(this.querySelector('.sf-figure-grid--masonry'));else this._masonry.detach(); // A gallery the page opened in its markup (open) opens once it has drawn.

    if (this.openState && !this._viewing && this.isConnected) requestAnimationFrame(() => this.openState && !this._viewing && this.open());
  } // ── the viewer ──


  _viewerItems() {
    return this._tiles().map(tile => tile.item);
  }

  _viewerOptions() {
    return {
      label: this.getAttribute('heading') || this._word('heading'),
      loop: this.getProp('loop') === true,
      onChange: ({
        current
      }) => this._setCurrent(current, 'lightbox'),
      onClose: ({
        current
      }) => this._viewerClosed(current)
    };
  } // Where the focus goes when the viewer closes (GL-5, C150 (7)): the tile of
  // the picture the person ended on (or the main picture), else whatever
  // opened the viewer.


  _returnTarget(opener) {
    return current => {
      const tile = this.querySelector(`[data-sf-gallery-open="${current}"]`) || this.querySelector('.sf-gallery-main [data-sf-gallery-open]');
      if (tile instanceof HTMLElement && tile.isConnected && tile.getClientRects().length) return tile;
      return opener;
    };
  }

  _viewerClosed(current) {
    this._viewing = false;

    if (this.hasAttribute('open')) {
      this._syncing = true;
      this.removeAttribute('open');
      this._syncing = false;
    }

    this.sfEmit('closed', {
      current,
      total: this.slidesTotal
    });
  } // The actions (§4.4) answer outcomes. `index` comes as a number or as
  // {index}, the manifest's parameter object.


  open(index = null) {
    const at = index && typeof index === 'object' ? index.index : index;
    if (this.getProp('lightbox') === false) return {
      outcome: 'refused',
      reason: 'no-lightbox'
    };

    const items = this._viewerItems();

    if (!items.length) return {
      outcome: 'refused',
      reason: 'empty'
    };
    if (at !== null && typeof at !== 'undefined') this._setCurrent(at, 'api');
    const active = document.activeElement;
    const opener = active && active !== document.body ? active : null;
    this._viewing = true;
    viewer.view(items, { ...this._viewerOptions(),
      start: this.current,
      opener: this._returnTarget(opener)
    });

    if (!this.hasAttribute('open')) {
      this._syncing = true;
      this.setAttribute('open', '');
      this._syncing = false;
    }

    this.sfEmit('opened', {
      current: this.current,
      total: items.length
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  close() {
    if (!this._viewing && !this.openState) return {
      outcome: 'refused',
      reason: 'closed'
    };
    if (this._viewing) viewer.close();else this.removeAttribute('open');
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  toggle(index = null) {
    return this._viewing ? this.close() : this.open(index);
  }

  goTo(index) {
    const at = index && typeof index === 'object' ? index.index : index;
    if (!Number.isFinite(Number.parseInt(String(at), 10))) return {
      outcome: 'refused',
      reason: 'invalid'
    };

    this._setCurrent(at, 'api');

    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  next() {
    const total = this.slidesTotal;
    const next = this.getProp('loop') === true && this.current >= total ? 1 : this.current + 1;
    return this.goTo(next);
  }

  prev() {
    const total = this.slidesTotal;
    const prev = this.getProp('loop') === true && this.current <= 1 ? total : this.current - 1;
    return this.goTo(prev);
  }

  clearSelection() {
    if (!this._selected.size) return {
      outcome: 'refused',
      reason: 'empty'
    };

    this._selected.clear();

    this._lastPicked = null;

    this._selectionChanged();

    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // §4.4: the readers of the slider and the window retire; kept until the
  // date and noted on each call. There is no slider or window to give.


  getModal() {
    noteRetired('getModal');
    return null;
  }

  getInlineSlider() {
    noteRetired('getInlineSlider');
    return null;
  }

  getLightboxSlider() {
    noteRetired('getLightboxSlider');
    return null;
  } // ── the person ──


  _handleClick(event) {
    if (this._swallowClick) {
      this._swallowClick = false;
      event.preventDefault();
      return;
    }

    const clear = event.target.closest?.('[data-sf-gallery-clear]');

    if (clear) {
      this.clearSelection();
      this.querySelector('[data-sf-gallery-open]')?.focus?.();
      return;
    }

    if (event.target.closest?.('.sf-figure-pick')) return;
    const thumb = event.target.closest?.('[data-sf-gallery-thumb]');

    if (thumb) {
      this._setCurrent(Number(thumb.getAttribute('data-sf-gallery-thumb')), 'inline');

      return;
    }

    const trigger = event.target.closest?.('[data-sf-gallery-open]');
    if (!trigger) return;
    const index = Number.parseInt(trigger.getAttribute('data-sf-gallery-open') || '1', 10); // Once anything is chosen, a press on a tile chooses; Shift a range.

    if (this._selecting && (this._selected.size || event.shiftKey)) {
      event.preventDefault();

      this._toggleSelected(index, event.shiftKey);

      return;
    }

    if (this.getProp('lightbox') === false) return;
    this.open(index);
  }

  _handleChange(event) {
    const box = event.target.closest?.('[data-sf-gallery-pick]');
    if (!box) return; // The check box's change is the gallery's select, not the page's change.

    event.stopPropagation();

    this._toggleSelected(Number(box.getAttribute('data-sf-gallery-pick')), Boolean(this._shiftPick));

    this._shiftPick = false;
  }

  _handleKeyDown(event) {
    if (event.target.closest?.('[data-sf-gallery-pick]')) this._shiftPick = event.shiftKey;

    if (event.key === 'Escape' && this._selecting && this._selected.size && !event.defaultPrevented) {
      event.preventDefault();
      this.clearSelection();
      return;
    }

    const thumb = event.target.closest?.('[data-sf-gallery-thumb]');
    if (!thumb || event.altKey || event.ctrlKey || event.metaKey) return;
    const total = this.slidesTotal;
    const rtl = getComputedStyle(thumb).direction === 'rtl';
    const step = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1
    }[event.key];
    let next;
    if (step) next = this.current + step;else if (event.key === 'Home') next = 1;else if (event.key === 'End') next = total;else return;
    event.preventDefault();
    next = Math.min(Math.max(next, 1), total);

    this._setCurrent(next, 'inline');

    requestAnimationFrame(() => this.querySelector(`[data-sf-gallery-thumb="${next}"]`)?.focus());
  } // A phone has no hover: a long press on a tile chooses it, and then the
  // check boxes show on every tile (C150 (9)).


  _handlePointerDown(event) {
    if (event.target.closest?.('[data-sf-gallery-pick]')) this._shiftPick = event.shiftKey;
    if (!this._selecting || event.pointerType !== 'touch') return;
    const trigger = event.target.closest?.('[data-sf-gallery-open]');
    if (!trigger) return;
    clearTimeout(this._press?.timer);
    const press = {
      x: event.clientX,
      y: event.clientY
    };
    press.timer = setTimeout(() => {
      this._press = null;
      this._swallowClick = true;

      this._toggleSelected(Number(trigger.getAttribute('data-sf-gallery-open')));
    }, LONG_PRESS_MS);

    press.move = moveEvent => {
      if (Math.hypot(moveEvent.clientX - press.x, moveEvent.clientY - press.y) > LONG_PRESS_SLOP) this._handlePointerEnd();
    };

    this.addEventListener('pointermove', press.move);
    this._press = press;
  }

  _handlePointerEnd() {
    const press = this._press;
    if (!press) return;
    clearTimeout(press.timer);
    this.removeEventListener('pointermove', press.move);
    this._press = null;
  }

}

SfGallery.define('sf-gallery');
SfGallery.bindGlobalDelegation();
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "efe90eda63db"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MasonryPlacement: () => (/* binding */ MasonryPlacement),
/* harmony export */   masonryIsNative: () => (/* binding */ masonryIsNative)
/* harmony export */ });
// The masonry look's placement (owner decision C150 (11), 2026-11-14) where
// the browser has no display: grid-lanes. The grid (component.figure,
// .sf-figure-grid--masonry) keeps its columns -- the same auto-fill tracks and
// gap as the grid look -- and the tiles stand in it, each at the top of its
// row, until they are placed: each tile, in order, goes into the shortest
// column (a tie to the start one), so every tile stands no higher than the one
// before it and reading and Tab go by rows, left to right and only down. A
// placed tile keeps its column (--sf-figure-grid--lane, read by the grid as
// grid-column N / span 1: an absolute grid item with both lines takes that
// column's width, and the grid mirrors it in RTL) and its block offset; the grid gets the height
// of its longest column. The shape of each tile comes from the picture's width
// and height, so nothing waits for a picture to arrive; a tile whose height
// changes (a picture without sizes arriving, a caption wrapping, a column
// count changing with the width) is placed again before the next frame.
// The mark data-sf-masonry="placed" is the runtime's: a printed first paint
// leaves it out, so printed markup stands as the unplaced grid.
// Only the tiles are observed: the grid's own height changes as they are
// placed, and a change of its width reaches every tile's width.
const NATIVE = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('display', 'grid-lanes'); // Two heights within half a pixel are one: the start column takes the tile.

const TIE = 0.5;
function masonryIsNative() {
  return NATIVE;
}
class MasonryPlacement {
  constructor() {
    this.grid = null;
    this.observer = null;
    this.tiles = [];
    this.place = this.place.bind(this);
  } // Called after every drawing of the masonry look with its grid.


  attach(grid) {
    if (NATIVE || !(grid instanceof HTMLElement)) {
      this.detach();
      return;
    }

    if (grid !== this.grid) {
      this.detach();
      this.grid = grid;
    }

    if (!this.observer && typeof ResizeObserver === 'function') this.observer = new ResizeObserver(this.place);
    const tiles = Array.from(grid.children);
    this.tiles.filter(tile => !tiles.includes(tile)).forEach(tile => {
      this.observer?.unobserve(tile);
      clearTile(tile);
    });
    tiles.filter(tile => !this.tiles.includes(tile)).forEach(tile => this.observer?.observe(tile));
    this.tiles = tiles;
    this.place();
  } // Another look, or the element left the page: the grid stands as drawn.


  detach() {
    this.observer?.disconnect();
    this.observer = null;
    this.tiles.forEach(clearTile);
    this.tiles = [];

    if (this.grid) {
      this.grid.removeAttribute('data-sf-masonry');
      this.grid.style.removeProperty('block-size');
    }

    this.grid = null;
  }

  place() {
    const grid = this.grid;
    if (!grid || !grid.isConnected) return;
    const style = getComputedStyle(grid); // The resolved tracks: one length per column (none while hidden).

    const columns = style.gridTemplateColumns.split(/\s+/u).map(Number.parseFloat).filter(Number.isFinite).length;
    if (!columns) return;
    const gap = Number.parseFloat(style.rowGap) || 0;
    const tiles = Array.from(grid.children); // Read every height first, then write: one layout, not one per tile.

    const heights = tiles.map(tile => tile.getBoundingClientRect().height);
    const ends = new Array(columns).fill(0);
    const places = heights.map(height => {
      let column = 0;

      for (let next = 1; next < columns; next += 1) if (ends[next] < ends[column] - TIE) column = next;

      const top = ends[column];
      ends[column] += height + gap;
      return [column, top];
    });
    grid.setAttribute('data-sf-masonry', 'placed');
    tiles.forEach((tile, index) => {
      const [column, top] = places[index];
      tile.style.setProperty('--sf-figure-grid--lane', String(column + 1));
      tile.style.insetBlockStart = `${Math.round(top * 100) / 100}px`;
    });
    const height = Math.max(0, ...ends.map(end => end - gap));
    grid.style.blockSize = `${Math.round(height * 100) / 100}px`;
  }

}

function clearTile(tile) {
  tile.style.removeProperty('--sf-figure-grid--lane');
  tile.style.removeProperty('inset-block-start');
}

/***/ },

/***/ "56ae6cc9a5ec"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderGalleryTemplate: () => (/* binding */ renderGalleryTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("77ff37ad859f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // sf-gallery draws its pictures as the one picture tile of the Framework
// (component.figure 1.3.0: .sf-figure--tile in a .sf-figure-grid, owner
// decision C150 (10)); the full-screen viewer is its own part (js/viewer.js).

function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ').trim();
}

const RATIO_CLASS = {
  '1/1': 'sf-figure--ratio-1x1',
  '4/3': 'sf-figure--ratio-4x3',
  '16/9': 'sf-figure--ratio-16x9',
  auto: ''
};

function pick(context, tile) {
  if (!context.selecting) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <label class="sf-figure-pick sf-checkbox sf-checkbox--size-1 flex">
      <span class="sf-checkbox-box flex">
        <input type="checkbox" .checked=${tile.selected} data-sf-gallery-pick=${tile.index}
          aria-label=${tile.pickLabel}>
        <span class="sf-icon" aria-hidden="true"></span>
      </span>
    </label>
  `;
}

function media(context, tile) {
  if (!context.lightbox && !context.selecting) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-figure-media">${tile.picture}</div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button type="button" class="sf-figure-media" data-sf-gallery-open=${tile.index}
      aria-label=${tile.openLabel} aria-haspopup=${context.lightbox ? 'dialog' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${tile.picture}</button>
  `;
} // The grid, and its masonry look (C150 (11)): the same columns and gap, every
// picture in its own shape (ratio auto), each tile into the shortest column
// (component.figure .sf-figure-grid--masonry: grid-lanes where the browser has
// it, else js/masonry.js places the tiles after the drawing).


function renderGrid(context) {
  const masonry = context.layout === 'masonry';
  const ratio = masonry ? 'auto' : context.ratio;
  const ratioClass = RATIO_CLASS[ratio] ?? RATIO_CLASS['1/1'];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${renderBar(context)}
    <div class=${joinClasses('sf-gallery', masonry ? 'sf-gallery--masonry' : 'sf-gallery--grid', 'sf-figure-grid', masonry ? 'sf-figure-grid--masonry' : '', `sf-figure-grid--${context.tileSize}`, context.selectedCount ? 'sf-figure-grid--selecting' : '', context.rootClass)}
      role="list" aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${context.tiles.map(tile => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <figure role="listitem" data-sf-gallery-index=${tile.index}
          class=${joinClasses('sf-figure sf-figure--tile', ratioClass, ratio === 'auto' ? 'sf-figure--ratio-auto' : '', tile.selected ? 'sf-figure--selected' : '')}>
          ${media(context, tile)}
          ${context.caption === 'under' && tile.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<figcaption class="sf-figure-caption">${tile.caption}</figcaption>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ${pick(context, tile)}
        </figure>
      `)}
    </div>
  `;
} // The second look (C150 (1)): the main picture, whole in its frame, and a row
// of thumbnails under it -- a product card. The thumbnails are one Tab stop,
// paged by the arrow keys (as sf-slider's, GL-2).


function renderThumbnails(context) {
  const shown = context.tiles[context.current - 1] || context.tiles[0];
  if (!shown) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${joinClasses('sf-gallery sf-gallery--thumbnails', context.rootClass)}></div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${joinClasses('sf-gallery sf-gallery--thumbnails', context.rootClass)}
      style=${context.mainRatio ? `--sf-gallery--ratio: ${context.mainRatio}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <figure class="sf-figure sf-figure--contain sf-gallery-main">
        ${context.lightbox ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-figure-media" data-sf-gallery-open=${shown.index}
              aria-label=${shown.openLabel} aria-haspopup="dialog">${shown.mainPicture}</button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-figure-media">${shown.mainPicture}</div>`}
      </figure>
      ${context.tiles.length > 1 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-gallery-thumbs" role="group" aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
          ${context.tiles.map(tile => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <button type="button" class="sf-figure-media sf-gallery-thumb"
              data-sf-gallery-thumb=${tile.index} tabindex=${tile.index === shown.index ? '0' : '-1'}
              aria-current=${tile.index === shown.index ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${tile.thumbLabel}>${tile.thumbPicture}</button>
          `)}
        </div>
        <span class="sf-gallery-count" aria-live="polite">${context.countText}</span>
      ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
} // «Выбрано N» with the page's actions and «Снять выбор» (C150 (9)).


function renderBar(context) {
  if (!context.selecting) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="sf-gallery-bar" ?hidden=${!context.selectedCount} role="region" aria-label=${context.barLabel}>
      <span class="sf-gallery-bar-count" aria-live="polite">${context.selectedText}</span>
      <span class="sf-gallery-bar-actions">${context.actions}</span>
      <sf-button-icon data-sf-gallery-clear appearance="ghost" scheme="on-surface" size="1/2" icon="close"
        aria-label=${context.clearLabel}></sf-button-icon>
    </div>
  `;
}

function renderGalleryTemplate(context) {
  if (!context.inline) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${joinClasses('sf-gallery', context.rootClass)} hidden></div>`;
  return context.layout === 'thumbnails' ? renderThumbnails(context) : renderGrid(context);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2e94723fcf46"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   installViewer: () => (/* binding */ installViewer),
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("281c6761571f");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("74650ab742c0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_1__);
// The full-screen viewer of SIMAI Framework (owner decisions C150 (7), (8) and
// C149 (6)): one viewer per page for pictures, videos and PDF files, shared by
// sf-gallery, the page's data-sf-gallery links, sf-file-preview and any page
// code. It is sf-gallery's part, not a component of its own (C149 (6)), and
// its script API is SF.Gallery:
//
//   SF.Gallery.view(items, options) -> handle
//     items    a list of {src, type?, alt?, caption?, name?, meta?, width?,
//              height?, download?, open?}; a single item or a string (an
//              address) is a list of one. type is image (the default), video
//              or pdf; without it the address's extension or mime says.
//     options  {start = 1, opener, label, counter: 'slash' | 'words', loop,
//              zoom = true, labels: {previous, next}, onChange, onClose}
//     handle   {close(), goTo(n), next(), prev(), current, total, open}
//   SF.Gallery.close()
//
// start and current are one-based, as sf-gallery's current. Black in both
// themes (the pictures are judged on black); the bar «3 / 12» at its start,
// the actions at its end 8 apart, the arrows at the sides (none on a phone:
// swipe), the caption under the picture; ← → (mirrored right to left), Home,
// End, + and −, Escape; double click or double tap zooms to the picture's own
// pixels at that point and back, a drag pans, a pinch zooms on a phone; a
// swipe down closes. Closing gives the focus back to the opener: an element,
// or a function of the current one-based position that returns one.
//
// One copy per page: every bundle that imports this module asks the shared
// global first (memory: bundles each carry their own module copy), so a second
// copy never draws a second viewer.




const WORDS = {
  en: _lang_en_json__WEBPACK_IMPORTED_MODULE_2__.runtime || {},
  ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_3__.runtime || {}
};
const VIDEO = /\.(?:mp4|m4v|webm|ogv|ogg|mov)(?:[?#]|$)/iu;
const PDF = /\.pdf(?:[?#]|$)/iu; // A move shorter than this is a press, not a swipe (CSS px).

const SLOP = 10; // A horizontal swipe pages past this, a downward one closes past that.

const PAGE_SWIPE = 48;
const CLOSE_SWIPE = 96; // Two taps this close in time and place are a double tap.

const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_SLOP = 24; // The zoom of a picture already shown at its own pixels or larger.

const MIN_ZOOM_STEP = 2;

function word(key, node, vars) {
  return (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(WORDS, key, node || globalThis.document?.documentElement, {
    component: 'sf-gallery',
    source: 'ru',
    vars
  });
}

function kindOf(item) {
  const type = String(item.type || '').toLowerCase();
  if (type === 'image' || type === 'video' || type === 'pdf') return type;
  const mime = String(item.mime || '').toLowerCase();
  if (mime.startsWith('video/')) return 'video';
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'image';
  const src = String(item.src || item.href || '');
  if (VIDEO.test(src)) return 'video';
  if (PDF.test(src)) return 'pdf';
  return 'image';
}

function normalizeItems(items) {
  const list = Array.isArray(items) ? items : items === undefined || items === null ? [] : [items];
  return list.map(raw => {
    const item = typeof raw === 'string' ? {
      src: raw
    } : { ...(raw || {})
    };
    item.src = String(item.src || item.href || '');
    item.kind = kindOf(item);
    return item;
  }).filter(item => item.src);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

class Viewer {
  constructor() {
    this.items = [];
    this.index = 0;
    this.options = {};
    this.dialog = null;
    this.zoom = {
      scale: 1,
      x: 0,
      y: 0
    };
    this.pointers = new Map();
    this.gesture = null;
    this.lastTap = null;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
  }

  get open() {
    return Boolean(this.dialog?.open);
  }

  get current() {
    return this.items.length ? this.index + 1 : 0;
  }

  get total() {
    return this.items.length;
  }

  _ensureDialog() {
    if (this.dialog?.isConnected) return this.dialog;
    const dialog = document.createElement('dialog');
    dialog.className = 'sf-gallery-viewer sf-surface-media';
    dialog.setAttribute('data-sf-gallery-viewer', '');
    dialog.addEventListener('keydown', this._onKeyDown);
    dialog.addEventListener('close', this._onClose);
    dialog.addEventListener('cancel', this._onCancel);
    document.body.append(dialog);
    this.dialog = dialog;
    return dialog;
  }

  view(items, options = {}) {
    const list = normalizeItems(items);
    if (!list.length || typeof document === 'undefined') return null;

    const dialog = this._ensureDialog();

    const wasOpen = dialog.open;

    if (!wasOpen) {
      const active = document.activeElement;
      this.returnTo = options.opener ?? (active && active !== document.body ? active : null);
    } else if (options.opener) {
      this.returnTo = options.opener;
    }

    this.items = list;
    this.options = options;
    const start = Number.parseInt(String(options.start ?? 1), 10);
    this.index = clamp(Number.isFinite(start) ? start - 1 : 0, 0, list.length - 1);

    this._resetZoom();

    dialog.setAttribute('aria-label', options.label || word('viewer-label', this.returnTo));

    this._draw();

    if (!wasOpen) {
      dialog.showModal(); // The close button takes the focus: the keys work from the first moment
      // and Enter or Space never pages by surprise.

      this._focusClose();
    }

    this._preload();

    return this.handle();
  }

  handle() {
    const viewer = this;
    return {
      close: () => viewer.close(),
      goTo: n => viewer.goTo(n),
      next: () => viewer.goTo(viewer.current + 1),
      prev: () => viewer.goTo(viewer.current - 1),

      get current() {
        return viewer.current;
      },

      get total() {
        return viewer.total;
      },

      get open() {
        return viewer.open;
      }

    };
  }

  _focusClose() {
    // sf-button-close's host draws no box (display: contents): the focus
    // goes to its button, which exists once the element has drawn.
    const close = this.dialog?.querySelector('[data-sf-gallery-viewer-close]');

    const button = () => close?.querySelector('button');

    const focus = () => (button() || close)?.focus?.({
      preventScroll: true
    });

    const idle = () => document.activeElement === this.dialog || !this.dialog.contains(document.activeElement);

    focus();

    if (close && !button()) {
      customElements.whenDefined(close.localName).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
        if (this.open && idle()) focus();
      })));
    }
  }

  close() {
    if (!this.open) return false;
    this.dialog.close();
    return true;
  }

  goTo(n) {
    const total = this.items.length;
    if (!total || !this.open) return false;
    let next = Number.parseInt(String(n), 10) - 1;
    if (!Number.isFinite(next)) return false;
    if (this.options.loop) next = (next % total + total) % total;
    next = clamp(next, 0, total - 1);
    if (next === this.index) return false;
    const previous = this.index + 1;
    this.index = next;

    this._resetZoom();

    this._draw();

    this._preload();

    this.options.onChange?.({
      current: next + 1,
      previous,
      total
    });
    return true;
  }

  _onCancel(event) {
    // Escape: a zoomed picture first goes back to the screen, then the viewer closes.
    if (this.zoom.scale > 1) {
      event.preventDefault();

      this._resetZoom();

      this._applyZoom();
    }
  }

  _onClose() {
    this.dialog?.querySelectorAll('video').forEach(video => video.pause?.());
    const current = this.current;
    const target = typeof this.returnTo === 'function' ? this.returnTo(current) : this.returnTo;
    this.returnTo = null;
    this.pointers.clear();
    this.gesture = null;
    const onClose = this.options.onClose;
    this.options = { ...this.options,
      onClose: undefined,
      onChange: undefined
    };
    if (target instanceof HTMLElement && target.isConnected) target.focus({
      preventScroll: true
    });
    onClose?.({
      current,
      total: this.items.length
    });
  }

  _rtl() {
    return getComputedStyle(this.dialog).direction === 'rtl';
  }

  _onKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target instanceof Element ? event.target : null; // A video's or a frame's own keys stay theirs.

    if (target?.closest?.('video, iframe, input, textarea, select')) return;

    const rtl = this._rtl();

    const step = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1
    }[event.key];

    if (step && this.zoom.scale > 1) {
      this._pan(-step * this._panStep(), 0);
    } else if (step) {
      this.goTo(this.current + step);
    } else if (event.key === 'ArrowUp' && this.zoom.scale > 1) {
      this._pan(0, this._panStep());
    } else if (event.key === 'ArrowDown' && this.zoom.scale > 1) {
      this._pan(0, -this._panStep());
    } else if (event.key === 'Home') {
      this.goTo(1);
    } else if (event.key === 'End') {
      this.goTo(this.items.length);
    } else if (event.key === '+' || event.key === '=') {
      this._zoomTo(true);
    } else if (event.key === '-' || event.key === '_') {
      this._zoomTo(false);
    } else {
      return;
    }

    event.preventDefault();
  } // ── zoom and pan ──


  _picture() {
    return this.dialog?.querySelector('.sf-gallery-viewer-media > img') || null;
  }

  _canZoom() {
    return this.options.zoom !== false && this.items[this.index]?.kind === 'image';
  } // The scale of the picture's own pixels, at least two steps.


  _fullScale(img) {
    const shown = img?.offsetWidth || 0;
    const own = img?.naturalWidth || Number(this.items[this.index]?.width) || 0;
    return Math.max(shown && own ? own / shown : 0, MIN_ZOOM_STEP);
  }

  _resetZoom() {
    this.zoom = {
      scale: 1,
      x: 0,
      y: 0
    };
  }

  _limit() {
    const img = this._picture();

    const stage = this.dialog?.querySelector('.sf-gallery-viewer-stage');
    if (!img || !stage) return {
      x: 0,
      y: 0
    };
    const {
      scale
    } = this.zoom;
    return {
      x: Math.max((img.offsetWidth * scale - stage.clientWidth) / 2, 0),
      y: Math.max((img.offsetHeight * scale - stage.clientHeight) / 2, 0)
    };
  }

  _applyZoom() {
    const img = this._picture();

    const stage = this.dialog?.querySelector('.sf-gallery-viewer-stage');
    if (!img || !stage) return;

    const limit = this._limit();

    this.zoom.x = clamp(this.zoom.x, -limit.x, limit.x);
    this.zoom.y = clamp(this.zoom.y, -limit.y, limit.y);
    const zoomed = this.zoom.scale > 1;
    stage.toggleAttribute('data-zoomed', zoomed);
    stage.style.setProperty('--sf-gallery-viewer--scale', String(this.zoom.scale));
    stage.style.setProperty('--sf-gallery-viewer--x', `${this.zoom.x}px`);
    stage.style.setProperty('--sf-gallery-viewer--y', `${this.zoom.y}px`);

    this._drawBar();
  } // At a point (client coordinates) or at the centre.


  _zoomTo(on, clientX, clientY) {
    if (!this._canZoom()) return;

    const img = this._picture();

    if (!img) return;

    if (!on) {
      this._resetZoom();

      this._applyZoom();

      return;
    }

    const scale = this._fullScale(img); // The picture's box at rest is centred in the media box, which never moves.


    const box = img.parentElement.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const px = clientX === undefined ? cx : clientX;
    const py = clientY === undefined ? cy : clientY; // The point under the pointer stays under it: (p - c)(1 - s).

    this.zoom = {
      scale,
      x: (px - cx) * (1 - scale),
      y: (py - cy) * (1 - scale)
    };

    this._applyZoom();
  }

  _panStep() {
    return (this._picture()?.offsetWidth || 0) / 8;
  }

  _pan(dx, dy) {
    this.zoom.x += dx;
    this.zoom.y += dy;

    this._applyZoom();
  }

  _onPointerDown(event) {
    if (event.target.closest?.('.sf-gallery-viewer-side, video, iframe')) return;
    this.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });
    event.currentTarget.setPointerCapture?.(event.pointerId);

    if (this.pointers.size === 2 && this._canZoom()) {
      const [a, b] = [...this.pointers.values()];
      this.gesture = {
        pinch: true,
        distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        scale: this.zoom.scale
      };
      return;
    }

    if (this.pointers.size === 1) {
      this.gesture = {
        x: event.clientX,
        y: event.clientY,
        zx: this.zoom.x,
        zy: this.zoom.y,
        onPicture: event.target.localName === 'img',
        moved: false
      };
    }
  }

  _onPointerMove(event) {
    if (!this.pointers.has(event.pointerId) || !this.gesture) return;
    this.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });
    const gesture = this.gesture;

    if (gesture.pinch) {
      const [a, b] = [...this.pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y) || 1;

      const img = this._picture();

      this.zoom.scale = clamp(gesture.scale * (distance / gesture.distance), 1, Math.max(this._fullScale(img), MIN_ZOOM_STEP));
      if (this.zoom.scale === 1) this.zoom.x = this.zoom.y = 0;

      this._applyZoom();

      return;
    }

    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (Math.hypot(dx, dy) > SLOP) gesture.moved = true;

    if (this.zoom.scale > 1) {
      this.zoom.x = gesture.zx + dx;
      this.zoom.y = gesture.zy + dy;

      this._applyZoom();

      return;
    } // Not zoomed: the picture follows a downward swipe a little, so the
    // close reads as a gesture.


    const stage = this.dialog.querySelector('.sf-gallery-viewer-stage');
    stage?.style.setProperty('--sf-gallery-viewer--drag', `${Math.max(dy, 0) / 2}px`);
  }

  _onPointerUp(event) {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.delete(event.pointerId);
    const gesture = this.gesture;
    const stage = this.dialog?.querySelector('.sf-gallery-viewer-stage');
    stage?.style.removeProperty('--sf-gallery-viewer--drag');
    if (!gesture) return;

    if (gesture.pinch) {
      if (!this.pointers.size) this.gesture = null;
      return;
    }

    this.gesture = null;
    if (event.type === 'pointercancel') return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;

    if (this.zoom.scale > 1) {
      if (!gesture.moved) this._tap(event, gesture);
      return;
    }

    if (Math.abs(dx) > PAGE_SWIPE && Math.abs(dx) > Math.abs(dy)) {
      const forward = this._rtl() ? dx > 0 : dx < 0;
      this.goTo(this.current + (forward ? 1 : -1));
      return;
    }

    if (dy > CLOSE_SWIPE && dy > Math.abs(dx)) {
      this.close();
      return;
    }

    if (!gesture.moved) this._tap(event, gesture);
  } // A press: two presses on the picture close in time and place -- a double
  // click or a double tap, read from the pointer for both, since a touch also
  // fires the browser's dblclick -- zoom in and back; a press on the empty
  // field around the picture closes.


  _tap(event, gesture) {
    if (gesture.onPicture) {
      const last = this.lastTap;
      const now = event.timeStamp;

      if (last && now - last.time < DOUBLE_TAP_MS && Math.hypot(event.clientX - last.x, event.clientY - last.y) < DOUBLE_TAP_SLOP) {
        this.lastTap = null;

        this._zoomTo(this.zoom.scale === 1, event.clientX, event.clientY);

        return;
      }

      this.lastTap = {
        time: now,
        x: event.clientX,
        y: event.clientY
      };
      return;
    } // The empty field: the stage or the media box around the picture itself.


    if (!gesture.onPicture && this.zoom.scale === 1 && event.target.matches?.('.sf-gallery-viewer-stage, .sf-gallery-viewer-media')) {
      this.close();
    }
  } // ── drawing ──


  _preload() {
    [this.index - 1, this.index + 1].forEach(at => {
      const item = this.items[at];

      if (item?.kind === 'image') {
        const picture = new Image();
        picture.decoding = 'async';
        picture.src = item.src;
      }
    });
  }

  _counter() {
    const vars = {
      n: this.current,
      total: this.items.length
    };
    return this.options.counter === 'words' ? word('viewer-count-words', this.returnTo, vars) : word('viewer-count', this.returnTo, vars);
  }

  _drawBar() {
    const bar = this.dialog?.querySelector('.sf-gallery-viewer-bar');
    if (!bar) return;
    const item = this.items[this.index] || {};
    const node = this.returnTo instanceof Node ? this.returnTo : undefined;
    const zoomed = this.zoom.scale > 1;
    const named = Boolean(item.name);
    const downloadName = typeof item.download === 'string' ? item.download : '';
    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="sf-gallery-viewer-title">
        ${named ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-gallery-viewer-name">${item.name}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <span class="sf-gallery-viewer-count" aria-live="polite">${item.meta ? `${item.meta} · ` : ''}${this._counter()}</span>
      </div>
      <div class="sf-gallery-viewer-actions">
        ${this._canZoom() ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-gallery-viewer-control" data-sf-gallery-viewer-zoom appearance="ghost" scheme="on-surface"
          icon=${zoomed ? 'zoom_out' : 'zoom_in'} aria-label=${word(zoomed ? 'viewer-zoom-out' : 'viewer-zoom-in', node)}
          @click=${() => this._zoomTo(!zoomed)}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${item.download ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-gallery-viewer-control" data-sf-gallery-viewer-download appearance="ghost" scheme="on-surface"
          icon="download" href=${item.href || item.src} download=${downloadName}
          aria-label=${word('viewer-download', node, {
      name: item.name || downloadName || ''
    }).trim()}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${item.open ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-gallery-viewer-control" data-sf-gallery-viewer-open appearance="ghost" scheme="on-surface"
          icon="open_in_new" href=${item.href || item.src} target="_blank" rel="noopener"
          aria-label=${word('viewer-open-tab', node)}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <sf-button-close class="sf-gallery-viewer-control" data-sf-gallery-viewer-close appearance="media" size="1"
          aria-label=${word('viewer-close', node)} @click=${() => this.close()}></sf-button-close>
      </div>
    `, bar);
  }

  _media(item) {
    if (item.kind === 'video') {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<video class="sf-gallery-viewer-video" src=${item.src} controls preload="metadata" playsinline
        aria-label=${item.alt || item.name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></video>`;
    }

    if (item.kind === 'pdf') {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<iframe class="sf-gallery-viewer-frame" src=${item.src} title=${item.name || item.alt || word('viewer-document', this.returnTo)}></iframe>`;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img src=${item.src} alt=${item.alt ?? ''} width=${item.width || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} height=${item.height || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      decoding="async" draggable="false">`;
  }

  _draw() {
    const dialog = this.dialog;
    if (!dialog) return;
    const item = this.items[this.index];
    const node = this.returnTo instanceof Node ? this.returnTo : undefined;
    const labels = this.options.labels || {};
    const many = this.items.length > 1;
    const loop = Boolean(this.options.loop);
    const first = !loop && this.index === 0;
    const last = !loop && this.index === this.items.length - 1;
    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="sf-gallery-viewer-bar"></div>
      <div class="sf-gallery-viewer-stage"
        @pointerdown=${this._onPointerDown} @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
        ${many ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-gallery-viewer-side sf-gallery-viewer-side--previous">
          <sf-button-icon class="sf-gallery-viewer-control" data-sf-gallery-viewer-previous appearance="ghost" scheme="on-surface" icon="chevron_left"
            ?disabled=${first} aria-label=${labels.previous || word('viewer-previous', node)}
            @click=${() => this.goTo(this.current - 1)}></sf-button-icon></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class="sf-gallery-viewer-media" data-kind=${item.kind}>${this._media(item)}</div>
        ${many ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-gallery-viewer-side sf-gallery-viewer-side--next">
          <sf-button-icon class="sf-gallery-viewer-control" data-sf-gallery-viewer-next appearance="ghost" scheme="on-surface" icon="chevron_right"
            ?disabled=${last} aria-label=${labels.next || word('viewer-next', node)}
            @click=${() => this.goTo(this.current + 1)}></sf-button-icon></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
      <div class="sf-gallery-viewer-caption">${item.caption || ''}</div>
    `, dialog);

    this._drawBar();

    this._applyZoom();
  }

} // The one viewer of the page, on the shared global.


function installViewer() {
  const root = globalThis.SF = globalThis.SF || {};
  if (root.Gallery?.view) return root.Gallery;
  const viewer = new Viewer();
  const api = {
    view: (items, options) => viewer.view(items, options),
    close: () => viewer.close()
  };
  Object.defineProperty(api, 'current', {
    get: () => viewer.current,
    enumerable: true
  });
  Object.defineProperty(api, 'open', {
    get: () => viewer.open,
    enumerable: true
  });
  root.Gallery = api;
  return api;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "77ff37ad859f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "755770a8ce5c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-gallery for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26"},{"from":"blur","to":"backdrop-blur","kind":"setting","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26: blur is the base action blur"},{"from":"sf-change","to":"change","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8","note":"the detail is data only now: component, tagName and template leave it"},{"from":"sf-open","to":"sf-gallery-opened","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §4 (a fact)","note":"the detail is data only now"},{"from":"sf-close","to":"sf-gallery-closed","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §4 (a fact)","note":"the detail is data only now"},{"from":"getModal","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getInlineSlider","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getLightboxSlider","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"},{"from":"primary-dark","to":"primary-container","kind":"value","setting":"dots-type","component":"sf-gallery","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role; handed to the gallery\'s sliders"},{"from":"primary-light","to":"primary","kind":"value","setting":"dots-type","component":"sf-gallery","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role; handed to the gallery\'s sliders"},{"from":"light","to":"surface-container","kind":"value","setting":"dots-type","component":"sf-gallery","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role; handed to the gallery\'s sliders"},{"from":"clear","to":"surface-container","kind":"value","setting":"dots-type","component":"sf-gallery","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role; handed to the gallery\'s sliders"},{"from":"dark","to":"surface-inverse","kind":"value","setting":"dots-type","component":"sf-gallery","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-slider-dots-type-to-roles (docs precheck Q4): the dots\' words name the plate\'s colour role; handed to the gallery\'s sliders"},{"from":"modal-id","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"text","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"arrows","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"dots","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"thumbs","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"space-between","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"speed","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"button-type","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"button-size","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"dots-type","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"dots-size","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"thumbs-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"thumb-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"slide-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"inline-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"lightbox-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"overlay","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"show-header","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"show-close","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"close-on-esc","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"close-on-overlay","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"preserve-scroll-gap","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"position","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"fullscreen","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"width","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"height","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"backdrop-blur","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"blur-type","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"overlay-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"close-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"surface-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"surface-padding","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"panel-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"header-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"body-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"content-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"},{"from":"footer-class","to":null,"kind":"setting","component":"sf-gallery","since":"2026-11-14","remove_after":"2027-01-01","mode":"retired","section":"owner decision C150 (1), (7)","note":"a setting of the slider and the window the gallery was built from; read and noted until the date, it draws nothing"}]}');

/***/ },

/***/ "a2bebed909d0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.gallery","tag":"sf-gallery","version":"1.4.3","kind":"leaf","settings":{"layout":{"type":"enum","values":["grid","thumbnails","masonry"],"default":"grid"},"tile-size":{"type":"enum","values":["s","m","l"],"default":"m"},"ratio":{"type":"enum","values":["1/1","4/3","16/9","auto"],"default":"1/1"},"caption":{"type":"enum","values":["viewer","under"],"default":"viewer"},"selection":{"type":"enum","values":["none","many"],"default":"none"},"heading":{"type":"string","default-from":"runtime.heading"},"inline":{"type":"boolean","default":true},"lightbox":{"type":"boolean","default":true},"loop":{"type":"boolean","default":false},"modal-id":{"type":"id","default":""},"text":{"type":"string","default":""},"arrows":{"type":"boolean","default":true},"dots":{"type":"boolean","default":true},"thumbs":{"type":"boolean","default":true},"space-between":{"type":"number","default":null},"speed":{"type":"number","default":450},"button-type":{"type":"string","default":"secondary"},"button-size":{"type":"string","default":"1"},"dots-type":{"type":"string","default":"primary-container"},"dots-size":{"type":"string","default":"2"},"thumbs-class":{"type":"string","default":""},"thumb-class":{"type":"string","default":""},"slide-class":{"type":"string","default":""},"inline-class":{"type":"string","default":""},"lightbox-class":{"type":"string","default":""},"overlay":{"type":"boolean","default":true},"show-header":{"type":"boolean","default":true},"show-close":{"type":"boolean","default":true},"close-on-esc":{"type":"boolean","default":true},"close-on-overlay":{"type":"boolean","default":true},"preserve-scroll-gap":{"type":"boolean","default":true},"position":{"type":"enum","values":["center","left","right","top","bottom"],"default":"center"},"fullscreen":{"type":"boolean","default":false},"width":{"type":"string","default":""},"height":{"type":"string","default":""},"backdrop-blur":{"type":"boolean","default":false},"blur-type":{"type":"enum","values":["none","small","medium","large"],"default":"medium"},"overlay-class":{"type":"string","default":""},"close-class":{"type":"string","default":""},"surface-class":{"type":"string","default":""},"surface-padding":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"header-class":{"type":"string","default":""},"body-class":{"type":"string","default":""},"content-class":{"type":"string","default":""},"footer-class":{"type":"string","default":""}},"values":{"open":{"type":"boolean","default":false,"reflect":true},"current":{"type":"number","default":1,"integer":true,"min":1},"selected":{"type":"list","default":[],"of":"number"}},"events":{"change":{"carries":{"previous":"number","current":"number","total":"number","from":{"type":"enum","values":["api","inline","lightbox"]}}},"opened":{"carries":{"current":"number","total":"number"}},"closed":{"carries":{"current":"number","total":"number"}},"select":{"carries":{"selected":{"type":"list","of":"number"},"count":"number","total":"number"}}},"actions":{"open":{"with":{"index":{"type":"number","optional":true}}},"close":{},"toggle":{"with":{"index":{"type":"number","optional":true}}},"go-to":{"with":{"index":"number"}},"next":{},"prev":{},"clear-selection":{}},"css-variables":{"--sf-gallery-min-inline-size":{"type":"length","state":"default"},"--sf-gallery-object-fit":{"type":"keyword","state":"default"},"--sf-gallery-media-max-height":{"type":"length","state":"default"},"--sf-gallery-slide-min-height":{"type":"length","state":"default"},"--sf-gallery-caption-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "281c6761571f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Gallery","runtime":{"heading":"Gallery","open-picture":"Open picture {n} of {total}","open-picture-named":"Open picture {n} of {total}: {alt}","show-picture":"Show picture {n}","show-picture-named":"Show picture {n}: {alt}","pick-picture":"Select picture {n}","pick-picture-named":"Select picture {n}: {alt}","count":"{n} / {total}","selection":"Selection","selected-count":"{count} selected","clear-selection":"Clear selection","viewer-label":"Viewer","viewer-count":"{n} / {total}","viewer-count-words":"{n} of {total}","viewer-zoom-in":"Zoom in","viewer-zoom-out":"Zoom out","viewer-close":"Close","viewer-previous":"Previous picture","viewer-next":"Next picture","viewer-download":"Download {name}","viewer-open-tab":"Open in a new tab","viewer-document":"Document"}}');

/***/ },

/***/ "74650ab742c0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Галерея","runtime":{"heading":"Галерея","open-picture":"Открыть фото {n} из {total}","open-picture-named":"Открыть фото {n} из {total}: {alt}","show-picture":"Показать фото {n}","show-picture-named":"Показать фото {n}: {alt}","pick-picture":"Выбрать фото {n}","pick-picture-named":"Выбрать фото {n}: {alt}","count":"{n} / {total}","selection":"Выбор","selected-count":"Выбрано {count}","clear-selection":"Снять выбор","viewer-label":"Просмотр","viewer-count":"{n} / {total}","viewer-count-words":"{n} из {total}","viewer-zoom-in":"Увеличить","viewer-zoom-out":"Уменьшить","viewer-close":"Закрыть","viewer-previous":"Предыдущее фото","viewer-next":"Следующее фото","viewer-download":"Скачать {name}","viewer-open-tab":"Открыть в новой вкладке","viewer-document":"Документ"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d0c0e64421b6");
/******/
/******/ })()
;