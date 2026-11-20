/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a323dcfdc8c0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LABEL_MIN_EM: () => (/* binding */ LABEL_MIN_EM),
/* harmony export */   MIN_FOLD: () => (/* binding */ MIN_FOLD),
/* harmony export */   capRange: () => (/* binding */ capRange),
/* harmony export */   collapseRange: () => (/* binding */ collapseRange),
/* harmony export */   cutBelowMin: () => (/* binding */ cutBelowMin),
/* harmony export */   cutByRoom: () => (/* binding */ cutByRoom),
/* harmony export */   fitRange: () => (/* binding */ fitRange),
/* harmony export */   maxFitHidden: () => (/* binding */ maxFitHidden),
/* harmony export */   menuEntries: () => (/* binding */ menuEntries),
/* harmony export */   nextFit: () => (/* binding */ nextFit),
/* harmony export */   starvedFit: () => (/* binding */ starvedFit),
/* harmony export */   trailOverflows: () => (/* binding */ trailOverflows),
/* harmony export */   trailStarved: () => (/* binding */ trailStarved)
/* harmony export */ });
// Which crumbs of a trail are hidden behind «…» (R177 BC-06, BC-11).
//
// One answer for every runtime that collapses a trail: the ordinary script
// (breadcrumbs.js, the class markup a server prints) and sf-breadcrumbs, which
// imports this file into its own bundle. Before, each kept its own copy of the
// arithmetic and they drifted.
//
// A trail collapses for two reasons:
//
//   - a cap: max-items, when the page sets one (3 or more). It keeps the shape
//     it always had: floor((max - 1) / 2) crumbs at the start, the rest at the
//     end, «…» in between.
//   - room (owner decision C93 item 1): while the row has no room for its
//     crumbs (trailOverflows), one more crumb goes behind «…». The first crumb
//     goes last of the ancestors, and the tail is never hidden: the parent and
//     the current page (or, in a trail of parents only, the parent). At its
//     narrowest a trail reads «… › parent › current» (C93 item 2). Room is the
//     only reason on every ladder: a trail that fits the phone stays whole, and
//     no single crumb hides behind «…» (L1 of the C93 review). Past that
//     narrowest, a tail crumb cut below a few letters (cutBelowMin) folds too:
//     «… › current» (starvedFit).
//
// A range is {start, end}: the crumbs start .. end - 1 are hidden. null hides
// nothing.
// The crumbs a cap of max-items hides.
function capRange(count, maxItems) {
  const total = Math.max(0, Math.floor(Number(count) || 0));
  const max = Math.floor(Number(maxItems) || 0);
  if (max < 3 || total <= max) return null;
  const visible = max - 1;
  const leading = Math.floor(visible / 2);
  const trailing = visible - leading;
  if (total - leading - trailing <= 0) return null;
  return {
    start: leading,
    end: total - trailing
  };
} // Room hides two crumbs at least: one crumb behind «…» saves next to no width
// and costs a tap (L1 of the C93 review). A trail that cannot spare two keeps
// every crumb and cuts its names instead.

const MIN_FOLD = 2; // How many crumbs room can hide at most: everything but the tail, or nothing
// when that is less than MIN_FOLD.

function maxFitHidden(count, tail = 2) {
  const total = Math.max(0, Math.floor(Number(count) || 0));
  const kept = Math.max(1, Math.floor(Number(tail) || 0));
  const max = total - kept;
  return max >= MIN_FOLD ? max : 0;
} // The crumbs hidden when room hides `hidden` of them.

function fitRange(count, hidden, tail = 2) {
  const total = Math.max(0, Math.floor(Number(count) || 0));
  const kept = Math.max(1, Math.floor(Number(tail) || 0));
  const max = maxFitHidden(total, kept);
  const asked = Math.floor(Number(hidden) || 0);
  const wanted = Math.min(asked > 0 ? Math.max(asked, MIN_FOLD) : 0, max);
  if (wanted <= 0) return null; // While the first crumb can stay, the middle goes from its start.

  if (wanted <= total - 1 - kept) return {
    start: 1,
    end: 1 + wanted
  }; // Then the first one goes too: «… › parent › current».

  return {
    start: 0,
    end: total - kept
  };
} // The range shown: the cap's, until room asks for more than it hides.

function collapseRange(count, {
  maxItems = 0,
  fit = 0,
  tail = 2
} = {}) {
  const cap = capRange(count, maxItems);
  const capped = cap ? cap.end - cap.start : 0;
  const wanted = Math.floor(Number(fit) || 0);
  if (wanted <= capped) return cap;
  return fitRange(count, wanted, tail) || cap;
} // The next number of hidden crumbs to try when the trail does not fit, or
// null when nothing more can go.

function nextFit(count, {
  maxItems = 0,
  fit = 0,
  tail = 2
} = {}) {
  const range = collapseRange(count, {
    maxItems,
    fit,
    tail
  });
  const hidden = range ? range.end - range.start : 0;
  const next = Math.max(hidden + 1, MIN_FOLD);
  return next <= maxFitHidden(count, tail) ? next : null;
} // Whether a crumb's words are cut for want of room. An ancestor is cut at
// its own cap by design (--sf-breadcrumbs--label-max, C93 item 6), whatever
// the room; cut narrower than that cap, or a crumb with no cap cut at all
// (the page on the phone), means the row ran out of room.

function cutByRoom(crumb, view = globalThis) {
  const container = crumb?.querySelector?.(':scope > .sf-breadcrumbs-item-container');
  if (!container) return false;
  const label = container.querySelector(':scope > span') || container;
  if (!(label.scrollWidth > label.clientWidth + 1)) return false;
  const cap = Number.parseFloat(view.getComputedStyle?.(container)?.maxInlineSize);
  if (!(cap > 0)) return true;
  return container.getBoundingClientRect().width < cap - 1;
} // A cut name must still read: a crumb shown narrower than LABEL_MIN_EM of its
// own text size (three letters or so with the ellipsis, the least of a name
// one can tell apart) is no crumb at all (N1 of the nav-4b acceptance, after
// C93 item 6). Folded as far as room goes, such a crumb goes behind «…» too
// (starvedFit).

const LABEL_MIN_EM = 3; // Whether a crumb's words are cut to less than LABEL_MIN_EM for want of room.

function cutBelowMin(crumb, view = globalThis) {
  const container = crumb?.querySelector?.(':scope > .sf-breadcrumbs-item-container');
  if (!container) return false;
  const label = container.querySelector(':scope > span') || container;
  if (!(label.scrollWidth > label.clientWidth + 1)) return false;
  const size = Number.parseFloat(view.getComputedStyle?.(label)?.fontSize);
  const least = LABEL_MIN_EM * (size > 0 ? size : 16);
  return container.getBoundingClientRect().width < least - 0.5;
} // Whether a shown crumb of the trail is cut below the least that reads
// (cutBelowMin). Separators, «…» and the siblings button have no words to cut.

function trailStarved(entries = [], view = globalThis) {
  return entries.some(entry => {
    if (!entry || entry.hidden) return false;
    const crumbs = entry.matches?.('.sf-breadcrumbs-item') ? [entry] : Array.from(entry.querySelectorAll?.(':scope > .sf-breadcrumbs-item') || []);
    return crumbs.some(crumb => !crumb.hidden && !crumb.classList?.contains('sf-breadcrumbs-item--separator') && !crumb.hasAttribute?.('aria-expanded') && cutBelowMin(crumb, view));
  });
} // The last fold: room has hidden all it may (nextFit gave null) and a crumb of
// the tail is still cut below the least that reads. Then the parent goes too
// and the page stands alone after «…»: «… › current». Only a tail of two (the
// parent and the page) gives one up; a trail of parents keeps its parent.
// Returns the options to fold with ({tail, fit}), or null.

function starvedFit(count, {
  tail = 2
} = {}) {
  const kept = Math.max(1, Math.floor(Number(tail) || 0));
  if (kept < 2) return null;
  const hidden = maxFitHidden(count, 1);
  return hidden > 0 ? {
    tail: 1,
    fit: hidden
  } : null;
} // Whether the trail has no room for its crumbs (BC-06, C93 item 1). The row
// never wraps (L2: a line never starts with «›»), so room runs out in one of
// three ways: the row is wider than its box, a crumb is cut for want of room
// (cutByRoom), or a page that wraps the row anyway (its own CSS) put an
// entry below the first. A page name that wraps by words in the rest of the
// row is not a want of room (C93 item 6). Hidden entries take no part.

function trailOverflows(row, entries = [], view = globalThis) {
  if (row && row.scrollWidth > row.clientWidth + 1) return true;
  const shown = entries.filter(entry => {
    if (!entry || entry.hidden) return false;
    const box = entry.getBoundingClientRect?.();
    return Boolean(box) && !(box.width === 0 && box.height === 0);
  });
  if (shown.length === 0) return false;
  const boxes = shown.map(entry => entry.getBoundingClientRect());
  const lowest = Math.min(...boxes.map(box => box.height));
  if (boxes.some(box => box.top - boxes[0].top >= lowest / 2)) return true;
  return shown.some(entry => {
    const crumbs = entry.matches?.('.sf-breadcrumbs-item') ? [entry] : Array.from(entry.querySelectorAll?.(':scope > .sf-breadcrumbs-item') || []);
    return crumbs.some(crumb => !crumb.classList?.contains('sf-breadcrumbs-item--separator') && cutByRoom(crumb, view));
  });
} // The menu entries of crumbs (sf-menu-context entries): hidden crumbs behind
// «…» (C93 item 1) or a crumb's siblings (item 3). The id is the crumb's place
// in the list given, so a choice finds its crumb again.

function menuEntries(crumbs = []) {
  return crumbs.map((crumb, index) => {
    const entry = {
      id: String(index),
      text: String(crumb?.label ?? '')
    };
    if (crumb?.href) entry.href = crumb.href;
    if (crumb?.icon) entry.icon = crumb.icon;
    if (crumb?.value) entry.value = String(crumb.value);
    if (crumb?.disabled) entry.disabled = true;

    if (crumb?.current) {
      entry.current = true;
      entry.checked = true;
    }

    return entry;
  });
}

/***/ },

/***/ "5b7a5658d78a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _trail__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a323dcfdc8c0");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7d43ef2368a1");

 // The words live in the component's language files (localization study LC-4):
// one place for every language, as the Smart components keep them.

 // The ordinary runtime of the class markup a server prints (nav.sf-breadcrumbs):
// it folds a long trail behind one «…» button and opens it again in place.
// Which crumbs fold is _trail.js, shared with sf-breadcrumbs (R177 BC-11): a
// cap (data-max-items, when the page sets one) and room (BC-06, owner decision
// C93 item 1) -- while the trail takes more than one line, one more crumb goes.
//
// Two forms of the markup are read:
//   - the list form (R177 BC-09): nav.sf-breadcrumbs > ol > li, each li one
//     crumb with the separator before it (none in the first);
//   - the flat form: nav.sf-breadcrumbs > crumb, separator, crumb ...

const ROOT_SELECTOR = '.sf-breadcrumbs';
const BREADCRUMBS_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_2__["default"];
const ITEM_SELECTOR = '.sf-breadcrumbs-item';
const GENERATED_SELECTOR = '[data-sf-breadcrumbs-generated="ellipsis"]';
const BOUND_KEY = '__sfBreadcrumbsBound';
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]';

function getMaxItems(root) {
  const value = root.getAttribute('data-max-items') || root.getAttribute('max-items') || root.dataset.maxItems;
  const maxItems = Number(value); // No cap unless the page sets one: a trail folds when it has no room
  // (owner decision C93 item 1), not by a count.

  return Number.isFinite(maxItems) ? Math.max(0, Math.floor(maxItems)) : 0;
}

function getExpandLabel(root) {
  return root.getAttribute('data-expand-label') || root.getAttribute('expand-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_0__.pageText)(BREADCRUMBS_TEXT, 'expandLabel', root, 'sf-breadcrumbs');
}

function getItemLabel(item) {
  return String(item.textContent || '').trim();
}

function isSeparator(item) {
  if (!(item instanceof HTMLElement)) {
    return false;
  }

  if (item.classList.contains('sf-breadcrumbs-item--separator') || item.dataset.sfBreadcrumbSeparator === 'true') {
    return true;
  }

  if (!item.classList.contains('sf-breadcrumbs-item--default')) {
    return false;
  }

  const label = getItemLabel(item);
  return label === 'chevron_right' || label === 'chevron_rightchevron_right';
}

function isGenerated(item) {
  return item?.matches?.(GENERATED_SELECTOR);
} // The list of the list form, or null for the flat form.


function getList(root) {
  return Array.from(root.children).find(child => child.tagName === 'OL' || child.tagName === 'UL') || null;
}

function getBreadcrumbNodes(root) {
  return Array.from(root.children).filter(child => child instanceof HTMLElement && child.matches(ITEM_SELECTOR) && !isGenerated(child));
} // The crumbs, in order: the list's entries, or the flat form's items.


function getContentItems(root) {
  const list = getList(root);

  if (list) {
    return Array.from(list.children).filter(child => child.tagName === 'LI' && !isGenerated(child));
  }

  return getBreadcrumbNodes(root).filter(item => !isSeparator(item));
} // What takes room in a line: the list's entries, or every flat child.


function getLineEntries(root) {
  const list = getList(root);
  return Array.from((list || root).children);
}

function getPreviousSeparator(item) {
  let current = item.previousElementSibling;

  while (current && isGenerated(current)) {
    current = current.previousElementSibling;
  }

  return isSeparator(current) ? current : null;
}

function clearGenerated(root) {
  root.querySelectorAll(GENERATED_SELECTOR).forEach(node => node.remove());
}

function setCollapsedState(root, collapsedItems = []) {
  const collapsedSet = new Set(collapsedItems);

  if (getList(root)) {
    getContentItems(root).forEach(entry => {
      entry.hidden = collapsedSet.has(entry);
    });
    return;
  }

  getBreadcrumbNodes(root).forEach(node => {
    const shouldHide = collapsedSet.has(node) || collapsedItems.some(item => getPreviousSeparator(item) === node);
    node.hidden = shouldHide;
  });
}

function createSeparator(tag = 'div') {
  const separator = document.createElement(tag);
  separator.className = 'sf-breadcrumbs-item sf-breadcrumbs-item--default sf-breadcrumbs-item--separator';
  separator.dataset.sfBreadcrumbsGenerated = 'ellipsis';
  separator.dataset.sfBreadcrumbSeparator = 'true';
  separator.setAttribute('aria-hidden', 'true');
  separator.innerHTML = '<span class="sf-breadcrumbs-item-container"><i class="sf-icon" aria-hidden="true">chevron_right</i></span>';
  return separator;
}

function createEllipsis(root, hiddenItems) {
  const ellipsis = document.createElement('button');
  ellipsis.type = 'button';
  ellipsis.className = 'sf-breadcrumbs-item sf-breadcrumbs-item--link sf-breadcrumbs-item--default';
  ellipsis.dataset.sfBreadcrumbsGenerated = 'ellipsis';
  ellipsis.dataset.sfBreadcrumbIndex = 'ellipsis';
  ellipsis.setAttribute('aria-label', getExpandLabel(root));
  ellipsis.setAttribute('aria-expanded', 'false'); // «…» opens its crumbs as a menu (owner decision C93 item 1; RG-NV 3): the
  // Loader brings sf-menu-context when the trail first folds (requestMenu).
  // Only a page with neither the element nor the Loader opens the trail in
  // place.

  if (menuReady() || menuReachable()) ellipsis.setAttribute('aria-haspopup', 'menu');
  ellipsis.innerHTML = '<span class="sf-breadcrumbs-item-container"><span aria-hidden="true">…</span></span>';
  ellipsis.addEventListener('click', async event => {
    const clickEvent = new CustomEvent('sf-breadcrumb-click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        root,
        item: {
          label: '...',
          ellipsis: true,
          hiddenItems
        },
        index: 'ellipsis',
        items: getContentItems(root),
        originalEvent: event
      }
    });
    root.dispatchEvent(clickEvent);

    if (clickEvent.defaultPrevented) {
      return;
    }

    if (menuReady() || (await requestMenu())) {
      if (ellipsis.isConnected) openHiddenMenu(root, ellipsis, hiddenItems);
      return;
    }

    expandBreadcrumbs(root, hiddenItems[0]);
  });
  return ellipsis;
}

function menuReady() {
  return Boolean(globalThis.customElements?.get?.('sf-menu-context'));
} // Whether the Loader can bring sf-menu-context (SF.Loader.ensure: asked for,
// waited for up to 3 s, never thrown), as the row engine's «Ещё» asks for it
// (core/js/overflow-row.js standardMenu).


function menuReachable() {
  return typeof globalThis.SF?.Loader?.ensure === 'function';
} // Asks the Loader for sf-menu-context; true once the element is defined.
// Asked when a trail folds, so the menu is there by the time «…» is pressed.


let menuRequest = null;

function requestMenu() {
  if (menuReady()) return Promise.resolve(true);
  if (!menuReachable()) return Promise.resolve(false);
  menuRequest ||= Promise.resolve().then(() => globalThis.SF.Loader.ensure(['sf-menu-context'])).catch(() => null).then(() => {
    const ready = menuReady();
    if (!ready) menuRequest = null;
    return ready;
  });
  return menuRequest;
} // A hidden crumb as a menu entry: its words and its address.
// A menu row says the crumb's name: its aria-label when it has one (an
// icon-only home crumb is named so), else its words without the icon's
// ligature; the icon goes along as the row's icon.


function crumbOf(entry) {
  const link = entry.matches?.('a[href]') ? entry : entry.querySelector?.('a[href]');
  const container = entry.querySelector?.('.sf-breadcrumbs-item-container') || entry;
  const icon = container.querySelector?.(':scope > :is(.sf-icon, sf-icon)');
  const named = (link || entry.querySelector?.('[aria-label]') || entry).getAttribute?.('aria-label');
  let words = '';
  container.childNodes.forEach(node => {
    if (node !== icon) words += node.textContent || '';
  });
  const crumb = {
    label: String(named || '').trim() || words.trim() || getItemLabel(container),
    href: link?.getAttribute('href') || ''
  };
  const glyph = String(icon?.getAttribute?.('name') || icon?.textContent || '').trim();
  if (glyph) crumb.icon = glyph;
  return crumb;
} // One menu per trail, after it; the menu owns aria-expanded on «…» and gives
// focus back to it when it closes.


function openHiddenMenu(root, anchor, hiddenItems) {
  let menu = root.__sfBreadcrumbsMenu;

  if (!menu?.isConnected) {
    menu = document.createElement('sf-menu-context');
    menu.setAttribute('popup', '');
    menu.dataset.sfBreadcrumbsGenerated = 'menu';
    root.after(menu);
    root.__sfBreadcrumbsMenu = menu;
  }

  menu.setAttribute('aria-label', getExpandLabel(root));
  menu.entries = (0,_trail__WEBPACK_IMPORTED_MODULE_1__.menuEntries)(hiddenItems.map(crumbOf));
  menu.toggleFor?.(anchor, {
    align: 'start'
  });
} // A crumb's name is a <span> in its container (RG-NV 1): the sheet cuts a
// long ancestor with an ellipsis (C93 item 6), keeps the page's name on one
// cut line on the phone (C93 item 2) and underlines a link's words under the
// pointer (C186 (1)) on that <span>. Markup that prints the name straight
// into the container (the docs' examples did) wrapped to two lines and lost
// all three; the runtime wraps such bare words, so both spellings draw alike.


const LABEL_MARK = 'sfBreadcrumbsLabel';

function wrapLabels(root) {
  root.querySelectorAll(`${ITEM_SELECTOR} > .sf-breadcrumbs-item-container`).forEach(container => {
    const runs = [];
    let run = [];
    container.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        run.push(node);
        return;
      }

      if (run.length) runs.push(run);
      run = [];
    });
    if (run.length) runs.push(run);
    runs.forEach(nodes => {
      const text = nodes.map(node => node.nodeValue).join('');
      if (!text.trim()) return;
      const label = document.createElement('span');
      label.dataset[LABEL_MARK] = '';
      nodes[0].before(label);
      nodes.forEach(node => label.append(node));

      if (label.firstChild?.nodeType === Node.TEXT_NODE) {
        label.firstChild.nodeValue = label.firstChild.nodeValue.replace(/^\s+/u, '');
      }

      if (label.lastChild?.nodeType === Node.TEXT_NODE) {
        label.lastChild.nodeValue = label.lastChild.nodeValue.replace(/\s+$/u, '');
      }
    });
  });
} // The runtime's own wrapping (a bare name put in a <span>) is no change of
// the trail: it does not fold the trail again.


function isLabelWrap(mutation) {
  if (mutation.type !== 'childList') return false;
  if (!mutation.target?.classList?.contains?.('sf-breadcrumbs-item-container')) return false;
  const added = Array.from(mutation.addedNodes);
  const removed = Array.from(mutation.removedNodes);
  return added.every(node => node instanceof HTMLElement && LABEL_MARK in node.dataset) && removed.every(node => node.nodeType === Node.TEXT_NODE);
} // A name cut with an ellipsis (C93 item 6) has its whole text as the
// crumb's tooltip.


function markCutLabels(root) {
  root.querySelectorAll(`${ITEM_SELECTOR}:not(.sf-breadcrumbs-item--separator)`).forEach(crumb => {
    const label = crumb.querySelector(':scope > .sf-breadcrumbs-item-container > span') || crumb.querySelector(':scope > .sf-breadcrumbs-item-container');
    const cut = Boolean(label && label.scrollWidth > label.clientWidth + 1);

    if (cut) {
      crumb.setAttribute('title', label.textContent.trim());
      crumb.dataset.sfBreadcrumbCut = '';
    } else if ('sfBreadcrumbCut' in crumb.dataset) {
      crumb.removeAttribute('title');
      delete crumb.dataset.sfBreadcrumbCut;
    }
  });
} // The «…» button left the page: focus goes to the first crumb it revealed
// (R177 BC-02), not to the body. A crumb that is text takes focus as a
// target only (tabindex -1), so the keyboard path goes on from there.


function focusRevealed(root, first) {
  if (!first?.isConnected) return;
  const target = first.matches?.(FOCUSABLE) ? first : first.querySelector?.(FOCUSABLE) || first.querySelector?.(ITEM_SELECTOR) || first;
  if (!target.matches(FOCUSABLE)) target.setAttribute('tabindex', '-1');
  target.focus?.({
    preventScroll: true
  });
}

function expandBreadcrumbs(root, firstHidden = null) {
  const hadFocus = root.contains(document.activeElement);
  root.dataset.sfBreadcrumbsExpanded = 'true';
  clearGenerated(root);
  setCollapsedState(root, []);

  if (hadFocus || document.activeElement === document.body) {
    focusRevealed(root, firstHidden);
  }
}

function applyRange(root, items, range) {
  clearGenerated(root);
  setCollapsedState(root, []);
  if (!range) return;
  const hiddenItems = items.slice(range.start, range.end);
  if (!hiddenItems.length) return;
  setCollapsedState(root, hiddenItems);
  const list = getList(root);
  const firstHidden = hiddenItems[0];
  const ellipsis = createEllipsis(root, hiddenItems);
  requestMenu();

  if (list) {
    // One entry for «…», with the separator before it unless it opens the trail.
    const entry = document.createElement('li');
    entry.dataset.sfBreadcrumbsGenerated = 'ellipsis';
    if (range.start > 0) entry.append(createSeparator('span'));
    entry.append(ellipsis);
    list.insertBefore(entry, firstHidden);
    return;
  }

  const lastHidden = hiddenItems[hiddenItems.length - 1];
  const insertionTarget = lastHidden.nextElementSibling; // «…» opens the trail when the first crumb is hidden too: the separator of
  // the next visible crumb follows it, and none goes before it.

  if (range.start > 0) root.insertBefore(createSeparator(), firstHidden);
  root.insertBefore(ellipsis, insertionTarget);
} // Whether the last crumb is the page (it stays with its parent).


function getTail(items) {
  const last = items[items.length - 1];
  const current = last?.getAttribute?.('aria-current') === 'page' || Boolean(last?.querySelector?.('[aria-current="page"]'));
  return current ? 2 : 1;
}

function collapseBreadcrumbs(root) {
  const maxItems = getMaxItems(root);
  const items = getContentItems(root);
  wrapLabels(root);
  clearGenerated(root);
  setCollapsedState(root, []);

  if (root.dataset.sfBreadcrumbsExpanded === 'true') {
    return;
  }

  let tail = getTail(items); // Room only, on every ladder (C93 item 1; L1 of the C93 review): the whole
  // trail first, then one more crumb at a time while the row has no room.
  // Folded as far as that goes, a crumb cut below a few letters takes the
  // parent with it: «… › current» (starvedFit, N1 of the nav-4b acceptance).

  let fit = 0;
  applyRange(root, items, (0,_trail__WEBPACK_IMPORTED_MODULE_1__.collapseRange)(items.length, {
    maxItems,
    fit,
    tail
  }));

  while ((0,_trail__WEBPACK_IMPORTED_MODULE_1__.trailOverflows)(getList(root) || root, getLineEntries(root))) {
    const next = (0,_trail__WEBPACK_IMPORTED_MODULE_1__.nextFit)(items.length, {
      maxItems,
      fit,
      tail
    });

    if (next !== null) {
      fit = next;
    } else {
      const last = (0,_trail__WEBPACK_IMPORTED_MODULE_1__.trailStarved)(getLineEntries(root)) ? (0,_trail__WEBPACK_IMPORTED_MODULE_1__.starvedFit)(items.length, {
        tail
      }) : null;
      if (!last) break;
      ({
        tail,
        fit
      } = last);
    }

    applyRange(root, items, (0,_trail__WEBPACK_IMPORTED_MODULE_1__.collapseRange)(items.length, {
      maxItems,
      fit,
      tail
    }));
  }

  markCutLabels(root);
  root.__sfBreadcrumbsSettled = settledSize(root);
}

function settledSize(root) {
  const parent = root.parentElement;
  return {
    width: parent ? parent.getBoundingClientRect().width : 0,
    height: root.getBoundingClientRect().height
  };
} // A new width (or a font that came late and changed the words) folds the
// trail again; the trail's own change of size does not.


function observeRoom(root) {
  if (typeof ResizeObserver === 'undefined' || root.__sfBreadcrumbsRoom) return;
  let frame = 0;
  const observer = new ResizeObserver(() => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;

      if (!root.isConnected) {
        observer.disconnect();
        root.__sfBreadcrumbsRoom = null;
        return;
      }

      const before = root.__sfBreadcrumbsSettled;
      const now = settledSize(root);

      if (before && Math.abs(before.width - now.width) < 0.5 && Math.abs(before.height - now.height) < 0.5) {
        return;
      }

      collapseBreadcrumbs(root);
    });
  });
  observer.observe(root);
  if (root.parentElement) observer.observe(root.parentElement);
  root.__sfBreadcrumbsRoom = observer;
}

function bindBreadcrumbs(root) {
  if (!(root instanceof HTMLElement) || root[BOUND_KEY]) {
    return;
  } // sf-breadcrumbs draws its own trail and its own «…». Collapsing it here too
  // undid every expansion: the element expanded the trail, this script saw the
  // new items and folded them back behind a second «…» of its own.


  if (root.closest('sf-breadcrumbs')) {
    return;
  }

  root[BOUND_KEY] = true;
  collapseBreadcrumbs(root);
  observeRoom(root);
}

function initBreadcrumbs(target = document) {
  if (target instanceof HTMLElement && target.matches(ROOT_SELECTOR)) {
    bindBreadcrumbs(target);
  }

  target.querySelectorAll?.(ROOT_SELECTOR).forEach(bindBreadcrumbs);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initBreadcrumbs(document));
} else {
  initBreadcrumbs(document);
} // The trails a batch of changes touched are folded again once, in the next
// frame, before it is drawn. Folding measures the trail, and folding it for
// each record -- one per Smart icon in its separators as each draws its
// glyph -- made the browser work out the page's styles again every time
// (DF-9).


const pendingRoots = new Set();
let pendingFrame = 0;

function foldLater(root) {
  pendingRoots.add(root);
  if (pendingFrame) return;

  const run = () => {
    pendingFrame = 0;
    const roots = Array.from(pendingRoots);
    pendingRoots.clear();
    roots.forEach(one => {
      if (one.isConnected && one[BOUND_KEY]) collapseBreadcrumbs(one);
    });
  };

  if (typeof requestAnimationFrame === 'function') {
    pendingFrame = requestAnimationFrame(run);
  } else {
    pendingFrame = 1;
    Promise.resolve().then(run);
  }
}

if (typeof MutationObserver !== 'undefined') {
  new MutationObserver(mutations => {
    // A node added and gone again before the records arrive is a measuring
    // probe (core/js/position.js puts a span into the anchor's parent while a
    // menu opens for «…»): it is no crumb, and folding the trail again for it
    // took the anchor out from under the open menu.
    const transient = new Set();
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!node.isConnected) transient.add(node);
      });
    });
    mutations.forEach(mutation => {
      if (isLabelWrap(mutation)) return;

      if (mutation.type === 'attributes') {
        const root = mutation.target;

        if (root instanceof HTMLElement && root.matches(ROOT_SELECTOR) && root[BOUND_KEY]) {
          delete root.dataset.sfBreadcrumbsExpanded;
          foldLater(root);
        }

        return;
      }

      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement) || isGenerated(node) || transient.has(node)) {
          return;
        }

        initBreadcrumbs(node);
        const root = node.closest?.(ROOT_SELECTOR);

        if (root instanceof HTMLElement && root[BOUND_KEY]) {
          delete root.dataset.sfBreadcrumbsExpanded;
          foldLater(root);
        }
      });
      const changedByRemoval = Array.from(mutation.removedNodes).some(node => !isGenerated(node) && !transient.has(node));
      const mutationRoot = mutation.target.closest?.(ROOT_SELECTOR);

      if (changedByRemoval && mutationRoot instanceof HTMLElement && mutationRoot[BOUND_KEY]) {
        delete mutationRoot.dataset.sfBreadcrumbsExpanded;
        foldLater(mutationRoot);
      }
    });
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-max-items', 'max-items', 'data-expand-label', 'expand-label']
  });
}

/***/ },

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   TAG_ALIAS_KIND: () => (/* binding */ TAG_ALIAS_KIND),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable),
/* harmony export */   readTagAliases: () => (/* binding */ readTagAliases)
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
//
// A `tag` row renames the element itself ({from: 'sf-close', to:
// 'sf-button-close', kind: 'tag', since, remove_after}). It is not installed on
// an element: the Smart base defines the old tag as a subclass when it defines
// the new one (core/js/tag-aliases.js), so readAliasTable leaves it out and
// readTagAliases reads it.
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
const TAG_ALIAS_KIND = 'tag'; // A custom element name of the Framework or of a package: lower case, a hyphen.

const ELEMENT = /^[a-z][a-z0-9]*-[a-z0-9-]+$/u;

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
    if (row?.kind === TAG_ALIAS_KIND) return;
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
} // The `tag` rows of a table: -> {tag, rows: [{from, to, since, remove_after}],
// refused: [{index, from, to, reason}]}. A row renames the table's own tag:
// its `to` is that tag when the table names one.

function readTagAliases(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.component === 'string' && table.component || !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];
  if (!Array.isArray(list)) return {
    tag: owner,
    rows,
    refused
  };
  const seen = new Set();
  list.forEach((row, index) => {
    if (row?.kind !== TAG_ALIAS_KIND) return;

    const refuse = reason => refused.push({
      index,
      from: row.from ?? null,
      to: row.to ?? null,
      reason
    });

    if (typeof row.from !== 'string' || !ELEMENT.test(row.from)) return refuse('bad-old-tag');
    if (typeof row.to !== 'string' || !ELEMENT.test(row.to)) return refuse('bad-new-tag');
    if (row.from === row.to) return refuse('same-name');
    if (owner && row.to !== owner) return refuse('not-this-tag');
    const start = dateOf(row.since);
    const end = dateOf(row.remove_after);
    if (Number.isNaN(start)) return refuse('bad-since');
    if (Number.isNaN(end)) return refuse('bad-remove-after');
    if (end < start) return refuse('remove-after-before-since');
    if (seen.has(row.from)) return refuse('duplicate');
    seen.add(row.from);
    rows.push(Object.freeze({
      from: row.from,
      to: row.to,
      since: row.since,
      remove_after: row.remove_after
    }));
  });
  return {
    tag: owner,
    rows,
    refused
  };
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
  expired,
  package: pkg
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
  if (removeAfter !== undefined) note.remove_after = removeAfter; // The component package that ships the new name, for a package's element.

  if (pkg) note.package = pkg;
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

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followLanguage: () => (/* binding */ followLanguage),
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   localeText: () => (/* binding */ localeText),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText),
/* harmony export */   pageWord: () => (/* binding */ pageWord),
/* harmony export */   refreshLanguage: () => (/* binding */ refreshLanguage),
/* harmony export */   registeredWord: () => (/* binding */ registeredWord)
/* harmony export */ });
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _lang_built_in_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("feccc97e5d7d");
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
 // The languages built into the bundles (owner decision C282): English; every
// other language, Russian too, is a language file (core/js/language-packs.js).



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
const REGISTERED = STORE.registered; // Language packs (owner decision C177, 2026-11-14; C282, 2026-11-17): every
// language but English, the one built in, is one file per language and
// delivery, fetched only by a page that speaks it (or included before core as
// its script form, core/lang/<code>.js). A pack's words go into the same registry as words registered one
// by one -- so a bundle built before packs existed reads them too -- a
// Framework pack's beneath what is there, any other pack's over it: a product
// overrides a Framework word whichever arrived first. The fetching is core's
// (core/js/language-packs.js); each bundle only asks for a language. A STORE
// made by an older bundle has no packs yet: they are added here.

const PACKS = STORE.packs ??= {
  loaded: new Map(),
  pending: new Map(),
  request: null
}; // The languages built into the bundles: English, and in a rollback build Russian
// too (src/core/lang/built-in.json, C282).
// Which registered words came from a Framework pack and nothing has said over
// since: name -> code -> Set of keys. A Framework pack is the Framework's own
// words in a file, so for a component that names itself by a dated alias of
// its record's tag (sf-message-log, the heir of sf-list-feed, both under
// sf-list-feed's record) they are the successor's words, not its own: the
// words that component ships win over them (ui-control evidence
// 2026-11-18-pro-over-1ed6: «Лента» instead of «Переписка» once the ru pack
// was fetched). A word a product registers, or a product pack, is still over
// everything. Kept beside the words, not instead of them, so a copy of this
// module from before it reads the registry as it did. A STORE made by an older
// bundle has none yet: added here.

const FLOOR = STORE.floor ??= new Map();

const floorOf = (name, code) => {
  if (!FLOOR.has(name)) FLOOR.set(name, new Map());
  const byLanguage = FLOOR.get(name);
  if (!byLanguage.has(code)) byLanguage.set(code, new Set());
  return byLanguage.get(code);
};

const notFloor = (name, code, keys) => {
  const marked = FLOOR.get(name)?.get(code);
  if (!marked) return;

  for (const key of keys) marked.delete(key);
}; // Whether the word registered for `key` stands for the successor of the
// component asking, so that its own shipped word is said instead: the asker
// names a dated alias (its tag is not its record's), and the registered word
// is a Framework pack's that no product has said over.


function successorWord(owner, candidate, key) {
  if (!owner) return false;
  const name = normalise(owner);
  const record = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(name);
  return record !== name && Boolean(FLOOR.get(record)?.get(candidate)?.has(key));
}

const isBuiltIn = code => code === 'en' || (_lang_built_in_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]?.built_in ?? []).includes(code);
/**
 * Ask core for the pack of a language this page speaks (nothing for a
 * built-in language), and for the part that holds `component`'s words: the Framework's pack
 * comes in parts by family (core/js/language-packs.js). A core from before
 * parts takes the language alone.
 */


function needPack(code, component) {
  const wanted = normalise(code);
  const base = wanted.split('-')[0];
  if (!base || isBuiltIn(base)) return;
  const name = component ? (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component) : undefined;

  if (typeof PACKS.request !== 'function') {
    // Core has not run yet: a Smart bundle placed before core.js (a Docara
    // page and its example frames load core last) draws before anyone can
    // fetch. The ask is kept and core makes it when it starts
    // (core/js/language-packs.js), so the family's part still comes.
    const early = PACKS.early ??= new Map();
    const named = aliasOf(wanted);

    for (const one of new Set([base, wanted, ...(named ? [named] : [])])) {
      if (!early.has(one)) early.set(one, new Set());
      early.get(one).add(name ?? '');
    }

    return;
  }

  PACKS.request(base, name);
  if (wanted !== base) PACKS.request(wanted, name);
  const named = aliasOf(wanted);
  if (named && named !== wanted && named !== base) PACKS.request(named, name);
} // Words are kept under a component's current tag: a product that registered
// them for a renamed tag (sf-datepicker, now sf-input-date) keeps its words
// while the old tag is a dated alias, whichever name the element was written
// with (core/js/tag-aliases.js).


const wordsOf = component => REGISTERED.get((0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component));

function normalise(value) {
  return String(value ?? '').trim().toLowerCase().replace('_', '-');
} // The pack a page language takes. Two tables, both from the localization
// registry (C278) and both on the shared store, so a bundle carries neither:
// core/lang/index.json `aliases` (the shipped packs: zh-cn, zh-sg and zh take
// zh-hans, pt takes pt-br; PACKS.aliases, set by core) and the registry's
// second names of every language (STORE.aliases, core/js/language-packs.js).
// A word registered for the alias itself still comes first; any other code
// is its own.


function packOf(code) {
  const one = PACKS?.aliases?.[code] ?? STORE?.aliases?.[code];
  return typeof one === 'string' && one ? one : code;
}

function aliasOf(code) {
  const named = packOf(code);
  return named !== code ? named : null;
}
/**
 * The languages to try, most specific first, English last: the language, the
 * pack it is an alias of, the language without its region and that one's
 * pack. zh-CN: zh-cn, zh-hans, zh, en; zh-TW: zh-tw, zh, zh-hans, en; pt-PT:
 * pt-pt, pt, pt-br, en. Until 2026-11-18 a zh-CN or pt page found no pack and
 * spoke English.
 */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, packOf(wanted), base, packOf(base), 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
}; // A layer drawn in a portal carries a copy of its host's language, stamped by
// carryLayerOrigin (§19.1). When that copy came from the page itself, it has
// to follow the page before the listeners draw: a word read inside a drawer
// during SF.language.use() answered the language the page had just left, and
// the portal was carried again only later, with nothing to draw it again
// (simai/ui-source#55, found by ui-mail). A portal whose host sits in a
// section with a language of its own is not touched: that section means it.


const carryPageLanguage = () => {
  const doc = globalThis.document;
  if (!doc?.querySelectorAll) return;
  const lang = doc.documentElement?.getAttribute('lang') || '';

  for (const portal of doc.querySelectorAll('[data-sf-layer-lang="page"]')) {
    if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
  }
};

const announce = () => {
  carryPageLanguage();

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
/**
 * Tell the page's components that words changed without a registration: the
 * composition editor words arrive in a chunk of their own (LC-1) and the
 * forms drawn before them draw again.
 */


function refreshLanguage() {
  announce();
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
  return localeText(dictionary, key, pageLocale(node), component ?? componentOf(node));
}
/**
 * Text for `key` in a named language, with no node to read it from: a server
 * fallback or a form drawn before it is placed. The same order as pageText --
 * words registered for `component`, then the shipped ones, for the language,
 * the language without its region and English -- and the key last.
 */

function localeText(dictionary, key, locale, component) {
  const order = chain(locale || 'en');
  needPack(order[0], component);

  for (const candidate of order) {
    let added = component ? wordsOf(component)?.get(candidate)?.[key] : undefined;
    if (added !== undefined && dictionary?.[candidate]?.[key] !== undefined && successorWord(component, candidate, key)) added = undefined;

    if (added !== undefined) {
      if (candidate === 'en' && added !== '') warnFallback(order, component, key);
      return added;
    }

    const shipped = dictionary?.[candidate]?.[key];

    if (shipped !== undefined) {
      if (candidate === 'en' && shipped !== '') warnFallback(order, component, key);
      return shipped;
    }
  }

  return key;
} // A language the Framework does not ship (owner decision C177 (4)) may come
// partly translated: a word it lacks is said in the fallback language,
// English, and that is shown, not silent (localization study LC-6). One
// warning per page and language (de-AT and de are one), naming the first word
// missed; every word missed is kept by language for SF.language.missing(),
// and the language files' coverage is scripts/language-coverage.mjs. Kept on
// the shared global, because every bundle carries this module.

function warnFallback(order, owner, key) {
  const wanted = packOf(String(order[0] || '').split('-')[0]); // While its pack is on its way the English is a moment, not a gap (the
  // registry name's pack too: zh-hans for a zh-CN page). Before core runs
  // nothing can be on its way yet: the word is asked again when the pack core
  // fetches arrives, and only a word still missing then is one (ui-view
  // example frames reported sf-pagination "of-pages", which the ru pack holds,
  // on loads where the bundle ran before core).

  if (!wanted || wanted === 'en' || typeof PACKS.request !== 'function' || order.some(code => code !== 'en' && PACKS.pending.has(code))) return;
  const root = globalThis;
  if (!(root.__sfMissingWords instanceof Map)) root.__sfMissingWords = new Map();
  const seen = root.__sfMissingWords;

  if (!seen.has(wanted)) {
    seen.set(wanted, new Set());
    root.console?.warn?.(`[SIMAI Framework] "${wanted}": words missing, said in English (first: ${owner || 'component'} "${key}"); SF.language.missing('${wanted}') lists them`);
  }

  seen.get(wanted).add(`${owner || 'component'}|${key}`);
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
 *
 * `former` names the key the same word had before a rename (one key or a
 * list): a product that registered its words under the old key keeps them
 * until the alias's day. For each language the word registered under the new
 * key wins, then one registered under an old key, then the shipped one; a
 * word taken by an old key is reported to `onFormer(oldKey)`, which notes the
 * deprecation.
 */


function pageWord(dictionary, key, node, {
  component,
  source = '',
  count,
  vars,
  former,
  onFormer
} = {}) {
  const owner = component ?? componentOf(node);
  const locale = pageLocale(node);
  const order = chain(locale);
  const sourceLanguage = normalise(source);
  if (sourceLanguage && !order.includes(sourceLanguage)) order.push(sourceLanguage);
  const formerKeys = former === undefined || former === null ? [] : [].concat(former);
  needPack(locale, owner);

  for (const candidate of order) {
    const registered = owner ? wordsOf(owner)?.get(candidate) : undefined;
    let added = registered?.[key];
    if (added !== undefined && dictionary?.[candidate]?.[key] !== undefined && successorWord(owner, candidate, key)) added = undefined;

    if (added === undefined && registered) {
      const old = formerKeys.find(name => registered[name] !== undefined && registered[name] !== null);

      if (old !== undefined) {
        added = registered[old];
        onFormer?.(old);
      }
    }

    const word = added !== undefined ? added : dictionary?.[candidate]?.[key];
    if (word === undefined || word === null) continue;
    if (candidate === sourceLanguage && !chain(locale).includes(candidate)) warnWord(owner, key, locale, candidate);
    if (candidate === 'en' && word !== '') warnFallback(chain(locale), owner, key);

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
/**
 * The word a product registered (SF.language.register, or a product pack)
 * under `key` for the node's language, its base language or English; the
 * words a component ships are not read. Undefined when none is registered.
 * A removed word key kept as a dated alias reads this: the old phrase is
 * said only while a product still writes the old key.
 */

function registeredWord(component, key, node) {
  const byLanguage = wordsOf(component ?? componentOf(node));
  if (!byLanguage) return undefined;

  for (const candidate of chain(pageLocale(node))) {
    const word = byLanguage.get(candidate)?.[key];
    if (word !== undefined && word !== null) return word;
  }

  return undefined;
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
    if (next) needPack(next); // The choice is the page's language: <html lang> says it too (§11.1), so
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
    const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component ?? '');
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);

    if (words === null) {
      byLanguage.delete(code);
      FLOOR.get(name)?.delete(code);
    } else {
      byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
        ...words
      });
      notFloor(name, code, Object.keys(words ?? {}));
    }

    announce();
    return this;
  },

  /**
   * A language pack (schema simai.language-pack, schema_version 1; schema
   * core/contracts/language-pack.v1.schema.json): every word of one language
   * for one delivery, by component. A Framework pack's words go beneath the
   * words already registered, any other pack's over them, as register() does.
   * The page draws again once. Answers what was taken, or null for something
   * that is not a pack.
   */
  registerPack(pack, url = null) {
    const code = normalise(pack?.lang);

    if (pack?.schema !== 'simai.language-pack' || pack.schema_version !== 1 || !code || !pack.words || typeof pack.words !== 'object') {
      globalThis.console?.warn?.(`[SIMAI Framework] not a language pack (simai.language-pack, schema_version 1)${url ? `: ${url}` : ''}`);
      return null;
    }

    const under = (pack.delivery ?? 'framework') === 'framework';
    let words = 0;

    for (const [component, byKey] of Object.entries(pack.words)) {
      if (!byKey || typeof byKey !== 'object') continue;
      const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component);
      if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
      const byLanguage = REGISTERED.get(name);
      const now = byLanguage.get(code) ?? {};
      byLanguage.set(code, under ? { ...byKey,
        ...now
      } : { ...now,
        ...byKey
      });

      if (under) {
        const marked = floorOf(name, code);

        for (const key of Object.keys(byKey)) if (!Object.prototype.hasOwnProperty.call(now, key) || marked.has(key)) marked.add(key);
      } else {
        notFloor(name, code, Object.keys(byKey));
      }

      words += Object.keys(byKey).length;
    }

    const info = {
      lang: code,
      delivery: pack.delivery ?? 'framework',
      status: pack.status ?? null,
      coverage: pack.coverage ?? null,
      words,
      url
    };
    PACKS.loaded.set(code, [...(PACKS.loaded.get(code) ?? []), info]); // Core registers the parts that arrived together and draws once
    // (PACKS.quiet while it does).

    if (!PACKS.quiet) announce();
    return info;
  },

  /**
   * Name a pack file to fetch when the page needs its language: one line for
   * a product or a page (also SF_BOOT_CONFIG.languages = {code: url}). Core
   * fetches it once, with the Framework's own pack of that language.
   */
  addPack(value, url) {
    return PACKS.add ? PACKS.add(normalise(value), url) : false;
  },

  /** Fetch the packs of a language now; resolves when they are registered. */
  load(value) {
    return PACKS.load ? PACKS.load(normalise(value)) : Promise.resolve([]);
  },

  /** The packs on the page: {code: [{lang, delivery, status, coverage, words, url}]}. */
  packs() {
    return Object.fromEntries([...PACKS.loaded].map(([code, list]) => [code, list.map(info => ({ ...info
    }))]));
  },

  /** One language across many components: `{ 'sf-input-date': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    return [...(wordsOf(component ?? '')?.keys() ?? [])];
  },

  /**
   * The words the page has said in English so far for want of one in
   * `value` (C177 (4): a language may ship partly; what it lacks is visible).
   * `['sf-pagination|pages-label', ...]`; every language's when none is named.
   */
  missing(value) {
    const seen = globalThis.__sfMissingWords instanceof Map ? globalThis.__sfMissingWords : new Map();
    if (value === undefined) return Object.fromEntries([...seen].map(([code, words]) => [code, [...words]]));
    return [...(seen.get(packOf(normalise(value).split('-')[0])) ?? [])];
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
    FLOOR.clear();
    PACKS.loaded.clear(); // The asks kept before core ran go too: they were for the words forgotten.

    PACKS.early?.clear?.();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {}; // Every bundle publishes its copy; they share one store, so any copy
  // answers alike -- except that a bundle built before language packs
  // (an older package on the page) has no registerPack, addPack, load or
  // packs. Once a copy with them is published, an older one does not
  // replace it (C177).

  const holder = window.SF;

  if (!Object.getOwnPropertyDescriptor(holder, 'language')?.set) {
    let published = holder.language;
    Object.defineProperty(holder, 'language', {
      configurable: true,
      enumerable: true,
      get: () => published,
      set: value => {
        if (typeof value?.registerPack === 'function' || typeof published?.registerPack !== 'function') published = value;
      }
    });
  }

  holder.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "f28a9d913ce0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated from the `tag` rows of src/smart/*/aliases.json and the element_aliases of
// src/core/contracts/packages/*.package.json by scripts/tag-alias-table.mjs; do not edit.
// The dated tag aliases of the Framework and of its component packages, read by core/js/tag-aliases.js.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze([Object.freeze({
  from: 'sf-avatars',
  to: 'sf-avatar-group',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-button-group',
  to: 'sf-segmented',
  since: '2026-11-08',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-change-confirm',
  to: 'sf-confirm-change',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-close',
  to: 'sf-button-close',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-code-input',
  to: 'sf-input-code',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-color',
  to: 'sf-input-color',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-composition-overlay',
  to: 'sf-editor-overlay',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-content-editor',
  to: 'sf-editor-content',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-context-menu',
  to: 'sf-menu-context',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-copy-button',
  to: 'sf-button-copy',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-country-code',
  to: 'sf-input-country',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-data-view',
  to: 'sf-view',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-datepicker',
  to: 'sf-input-date',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-download-file',
  to: 'sf-file-download',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-icon-button',
  to: 'sf-button-icon',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-image-field',
  to: 'sf-input-image',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-inline-editor',
  to: 'sf-editor-inline',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-lookup',
  to: 'sf-input-lookup',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-page-header',
  to: 'sf-header-page',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-property-view',
  to: 'sf-view-properties',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-quantity',
  to: 'sf-input-quantity',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-range-slider',
  to: 'sf-slider-range',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-rich-text',
  to: 'sf-input-rich',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-site-header',
  to: 'sf-header-site',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-table',
  to: 'sf-view-table',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
})]));

/***/ },

/***/ "4a85acfb05c1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonicalTag: () => (/* binding */ canonicalTag),
/* harmony export */   defineTagAliases: () => (/* binding */ defineTagAliases),
/* harmony export */   isTag: () => (/* binding */ isTag),
/* harmony export */   listTagAliases: () => (/* binding */ listTagAliases),
/* harmony export */   noteTagAlias: () => (/* binding */ noteTagAlias),
/* harmony export */   registerTagAliasRows: () => (/* binding */ registerTagAliasRows),
/* harmony export */   registerTagAliases: () => (/* binding */ registerTagAliases),
/* harmony export */   tagNames: () => (/* binding */ tagNames),
/* harmony export */   tagSelector: () => (/* binding */ tagSelector)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
// Dated tag aliases (rename plan R0, ui-control RENAME-PLAN-2026-11-03; change
// lifecycle: contracts/changes/journal.json, kind "tag"). When a Smart
// component takes a new tag, the old tag keeps working until its
// `remove_after` day:
//
// - Definition. defineTagAliases(Class, tag) defines each old tag as a trivial
//   subclass of the class that defines the new one (the Smart base calls it
//   from define()). The Loader's rule lists the old tag beside the new one, so
//   markup with the old tag alone loads the bundle.
// - Note. The first old-tag element a page connects is noted in
//   SF.deprecations (kind "tag") and named once on the console with the new tag
//   and the date, whatever the page opted into: an element name is the most
//   visible thing a page writes, and the old one is going.
// - Script. Code that finds a renamed element by name asks for both names
//   through one helper instead of a literal:
//
//     import {tagSelector, isTag} from '../../core/js/smart-base';
//     host.querySelector(`.sf-tag > ${tagSelector('sf-button-close')}`);
//     if (isTag(node, 'sf-button-close')) ...
//
// - Sheets. A selector that names the new tag names the old one beside it in
//   source, `:is(sf-button-close, sf-close)`, for as long as the alias lives
//   (scripts/rename-smart-tag.mjs writes it, --sweep takes it out; the
//   contract test tests/tag-aliases.contract.test.mjs holds both).
//
// The aliases are a static table (tag-aliases.generated.js, written by
// scripts/tag-alias-table.mjs from every component's aliases.json and from the
// element_aliases of the component package references,
// contracts/packages/*.package.json), so a lookup finds an old tag before the
// renamed component's bundle has run, a package's (sf-table, rename plan R2)
// as well as the Framework's. A package's component adds its rows again when it
// is defined, which matters only for a package the pair does not reference. Every copy of this
// module shares one state on the page (a global symbol); the Smart bundles
// reach it through the shared runtime (smart-base re-exports it).



const STATE = Symbol.for('simai.sf.tag-aliases');

function state() {
  if (!globalThis[STATE]) {
    const shared = {
      byOld: new Map(),
      byNew: new Map(),
      noted: new Set()
    };
    Object.defineProperty(globalThis, STATE, {
      value: shared,
      configurable: true
    });

    for (const row of _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__["default"]) addRow(shared, row);
  }

  return globalThis[STATE];
}

function addRow(shared, row) {
  if (shared.byOld.has(row.from)) return;
  shared.byOld.set(row.from, row);
  shared.byNew.set(row.to, [...(shared.byNew.get(row.to) ?? []), row.from]);
} // Rows from a component's aliases.json (its `tag` rows); the Framework's are
// already known, a package's are added here.


function registerTagAliases(table, tag) {
  const {
    rows
  } = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readTagAliases)(table, {
    tag
  });
  const shared = state();

  for (const row of rows) addRow(shared, row);

  return rows;
} // Rows a component set gives at runtime (SF.RuleLoader.registerPackage(name,
// {aliases})): {from, to, since, remove_after}, the set's own former tags, so
// SIMAI Framework needs no table row for a set it does not know. Answers the
// rows taken; a row whose old tag is already known keeps the first.

function registerTagAliasRows(rows) {
  const shared = state();
  const taken = [];

  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row.from !== 'string' || typeof row.to !== 'string') continue;
    if (shared.byOld.has(row.from)) continue;
    const clean = Object.freeze({
      from: row.from,
      to: row.to,
      since: String(row.since ?? ''),
      remove_after: String(row.remove_after ?? ''),
      ...(typeof row.package === 'string' && row.package ? {
        package: row.package
      } : {})
    });
    addRow(shared, clean);
    taken.push(clean);
  }

  return taken;
} // The open old names of a tag, its own first: ['sf-button-close', 'sf-close'].

function tagNames(tag) {
  const name = String(tag || '').toLowerCase();
  return [name, ...(state().byNew.get(name) ?? [])];
} // A selector for the tag that matches its old names too:
// ':is(sf-button-close, sf-close)', or the tag itself when it has none.

function tagSelector(tag) {
  const names = tagNames(tag);
  return names.length > 1 ? `:is(${names.join(', ')})` : names[0];
} // Whether an element is the tag, under its own or an old name.

function isTag(element, tag) {
  const name = element?.localName;
  return Boolean(name) && tagNames(tag).includes(name);
} // The current name of a tag: 'sf-button-close' for 'sf-close'. An old tag the
// page still has as an element of its own stays itself: a component package
// built before its rename (rules naming sf-table alone) beside a pair whose
// table already knows the new name, where the new tag would never upgrade.

function canonicalTag(tag) {
  const name = String(tag || '').toLowerCase();
  const row = state().byOld.get(name);
  if (!row) return name;
  const own = globalThis.customElements?.get?.(name);
  if (own && !own.sfTagAliasOf) return name;
  let rules = null;

  try {
    rules = globalThis.SF?.Loader?.getCustomElementRules?.() ?? null;
  } catch {
    rules = null;
  }

  if (rules && rules[name] && !rules[row.to]) return name;
  return row.to;
} // Every open row: [{from, to, since, remove_after}].

function listTagAliases() {
  return [...state().byOld.values()].map(row => ({ ...row
  }));
} // The page met an element under an old name: once per old tag.

function noteTagAlias(row) {
  const shared = state();
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row);
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.to,
    kind: 'tag',
    from: row.from,
    to: row.to,
    tag: row.to,
    since: row.since,
    remove_after: row.remove_after,
    expired,
    package: row.package
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return; // A package's element says which package ships it now (C174 NM-3).

  const where = row.package ? ` from the component package ${row.package}` : '';
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>${where}. See contracts/changes/journal.json.`);
} // Defines each old tag of `tag` as a subclass of `Base` (the class that
// defines `tag`), through `define(name, Class)`: the Smart base passes its
// definition queue, so both names are defined in the same batch. Returns the
// rows defined.

function defineTagAliases(Base, tag, {
  table = Base?.aliases,
  define
} = {}) {
  if (table) registerTagAliases(table, tag);
  const rows = (state().byNew.get(tag) ?? []).map(from => state().byOld.get(from));
  const registry = globalThis.customElements;
  const defined = [];

  for (const row of rows) {
    if (!registry || registry.get(row.from)) continue;

    class TagAlias extends Base {
      connectedCallback() {
        noteTagAlias(row);
        super.connectedCallback?.();
      }

    }

    Object.defineProperty(TagAlias, 'sfTagAliasOf', {
      value: row.to
    });
    (define ?? ((name, Class) => registry.define(name, Class)))(row.from, TagAlias);
    defined.push(row);
  }

  return defined;
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {}; // For scripts that are not Smart bundles (class components, a page):
  // SF.tags.selector('sf-button-close').

  if (!globalThis.SF.tags) {
    globalThis.SF.tags = Object.freeze({
      names: tagNames,
      selector: tagSelector,
      is: isTag,
      canonical: canonicalTag,
      list: listTagAliases
    });
  }
}

/***/ },

/***/ "61b2b2e52939"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "7d43ef2368a1"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a4cd7612e503");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "feccc97e5d7d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _built_in_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6a56aa4367e4");
// The languages built into the component bundles (owner decision C282),
// for page-language.js: built-in.json, the build switch
// scripts/build-language-packs.mjs reads too. A module, as lang/index.mjs, so
// the bundle and Node read the JSON alike.


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_built_in_json__WEBPACK_IMPORTED_MODULE_0__);


/***/ },

/***/ "a4cd7612e503"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"expandLabel":"Show hidden breadcrumbs"}}');

/***/ },

/***/ "6a56aa4367e4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"schema":"simai.language-built-in","schema_version":1,"$comment":"The languages built into the component bundles (owner decision C282, 2026-11-17): English only. Russian and every other language ship as language files (core/lang/<code>.js before core.js, or the parts core/lang/<code>/<family>.json core fetches). complete: the languages that must say every word (scripts/language-coverage.mjs exits 1 on a gap). Rollback: built_in [\\"en\\", \\"ru\\"], then node scripts/build-language-packs.mjs and a rebuild put Russian back into the bundles (the language files still ship, so a page that includes ru.js stays right).","built_in":["en"],"complete":["en","ru"]}');

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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("61b2b2e52939");
/* harmony import */ var _js_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7a5658d78a");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* BREADCRUMBS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;