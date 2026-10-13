/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "403726af3b51"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a57d260bd333");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);


 // Every word this pagination says, in the two languages the Framework speaks.
// The rule is the shared one in src/core/js/page-language; this component said
// only Russian, so an English page read «Всего:» and «Показать ещё» under a
// list that had switched (owner, 2026-10-10).

const PAGINATION_TEXT = {
  en: {
    ariaLabel: "Result pages",
    pagesLabel: "Pages:",
    pageLabel: "Page",
    previousLabel: "Previous page",
    nextLabel: "Next page",
    lastLabel: "Last",
    totalLabel: "Total:",
    selectedLabel: "Selected:",
    showMoreText: "Show more",
    pageSizeLabel: "Per page:",
    actionApplyText: "Apply",
    actionForAllLabel: "For all",
    actionsLabel: "Action for the selected records",
    actionChooseLabel: "Choose an action",
    actionsRegionLabel: "Actions for the selected",
    clearSelectionLabel: "Clear the selection",
    showCountLabel: "Show the number",
    countingLabel: "Counting",
    firstLabel: "First",
    pageFieldLabel: "Page:"
  },
  ru: {
    ariaLabel: "Страницы результатов",
    pagesLabel: "Страницы:",
    pageLabel: "Страница",
    previousLabel: "Предыдущая страница",
    nextLabel: "Следующая страница",
    lastLabel: "Последняя",
    totalLabel: "Всего:",
    selectedLabel: "Отмечено:",
    showMoreText: "Показать ещё",
    pageSizeLabel: "На странице:",
    actionApplyText: "Применить",
    actionForAllLabel: "Для всех",
    actionsLabel: "Действие с выбранными элементами",
    actionChooseLabel: "Выберите действие",
    actionsRegionLabel: "Действия с отмеченными",
    clearSelectionLabel: "Снять выделение",
    showCountLabel: "Показать количество",
    countingLabel: "Считаем",
    firstLabel: "В начало",
    pageFieldLabel: "Страница:"
  }
};

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
}

class SfPagination extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
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
    return this.getAttribute("show-more-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "showMoreText", this);
  }

  get ariaLabel() {
    return this.getAttribute("aria-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "ariaLabel", this);
  }

  get pagesLabel() {
    return this.getAttribute("pages-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "pagesLabel", this);
  }

  get pageLabel() {
    return this.getAttribute("page-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "pageLabel", this);
  }

  get previousLabel() {
    return this.getAttribute("previous-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "previousLabel", this);
  }

  get nextLabel() {
    return this.getAttribute("next-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "nextLabel", this);
  }

  get firstLabel() {
    return this.getAttribute("first-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "firstLabel", this);
  }

  get pageFieldLabel() {
    return this.getAttribute("page-field-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "pageFieldLabel", this);
  }

  get lastLabel() {
    return this.getAttribute("last-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "lastLabel", this);
  }

  get totalLabel() {
    return this.getAttribute("total-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "totalLabel", this);
  }

  get selectedLabel() {
    return this.getAttribute("selected-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "selectedLabel", this);
  } // How many rows are marked. It is capped by the total only when there is a
  // total: with the count unknown the cap was zero, so a marked row read as
  // none and the panel of bulk controls never appeared at all.


  get selectedCount() {
    const parsed = Math.trunc(this.getNumberAttr("selected-count", 0));

    if (!Number.isFinite(parsed)) {
      return 0;
    }

    const atLeastNone = Math.max(parsed, 0);
    return this.countKnown ? Math.min(atLeastNone, this.total) : atLeastNone;
  }

  get total() {
    const parsed = Math.trunc(this.getNumberAttr("total", 10));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 10;
  } // Whether the number of records is known at all. A host that does not count
  // every answer says so, and then the view shows a link in place of the number
  // and asks what is behind it only when someone wants it.


  get countKnown() {
    return this.getBooleanAttr("count-known", true);
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
  }

  get hasNext() {
    return this.countKnown ? this.current < this.pageCount : this.hasNextPage;
  }

  get showCountLabel() {
    return this.getAttribute("show-count-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "showCountLabel", this);
  } // The next portion is on its way. It is answered inside the button that asked
  // for it, not by a loader over the whole table: the rows on screen are not
  // going anywhere.


  get showMoreBusy() {
    return this.getBooleanAttr("show-more-busy", false);
  }

  get countingLabel() {
    return this.getAttribute("counting-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "countingLabel", this);
  }

  get pageSize() {
    const parsed = Math.trunc(this.getNumberAttr("page-size", 10));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
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
    return this.getAttribute("page-size-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "pageSizeLabel", this);
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
    return this.getAttribute("action-apply-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "actionApplyText", this);
  }

  get showActionForAll() {
    return this.getBooleanAttr("show-action-for-all", false);
  }

  get actionForAll() {
    return this.getBooleanAttr("action-for-all", false);
  }

  get actionForAllLabel() {
    return this.getAttribute("action-for-all-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "actionForAllLabel", this);
  }

  get actionsLabel() {
    return this.getAttribute("actions-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "actionsLabel", this);
  } // The labels are read through getters, like every other word this component
  // shows: the template context is built from `this.<name>`, so a declared prop
  // without a getter reaches the template as undefined. The first attempt at
  // the panel left the list's placeholder empty for exactly that reason.


  get actionChooseLabel() {
    return this.getAttribute("action-choose-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "actionChooseLabel", this);
  }

  get actionsRegionLabel() {
    return this.getAttribute("actions-region-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "actionsRegionLabel", this);
  }

  get clearSelectionLabel() {
    return this.getAttribute("clear-selection-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, "clearSelectionLabel", this);
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
    return this.countKnown ? Math.min(atLeastFirst, this.pageCount) : atLeastFirst;
  } // How many pages there are, when that is known at all. Said out loud rather
  // than reported as one page, so a host is not told a count the view does not
  // have.


  get knownPageCount() {
    return this.countKnown ? this.pageCount : null;
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
    if (this.countKnown && this.total === 0) {
      return [];
    }

    const window = 5;
    const current = this.current; // The last page a number may name: the last one there is when it is known,
    // and otherwise the next one, which `has_next` says exists.

    const furthest = this.countKnown ? this.pageCount : current + (this.hasNextPage ? 1 : 0);
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

    const furthest = this.countKnown ? this.pageCount : parsed;
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
    return attribute && this.getAttribute(attribute) || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PAGINATION_TEXT, key, this);
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
  }

  goToPage(page) {
    if (this.countKnown && this.total === 0) {
      return this;
    }

    const parsed = Number.parseInt(String(page || ""), 10);

    if (!Number.isFinite(parsed)) {
      return this;
    }

    const previous = this.current; // With no count there is no last page to clamp against. The host answers a
    // page that has run out with no records, which is honest; clamping to a
    // page count derived from nothing would not be.

    const next = this.countKnown ? Math.min(Math.max(parsed, 1), this.pageCount) : Math.max(parsed, 1);

    if (next === previous) {
      return this;
    }

    this.setState({
      current: next
    });
    this.emitComponentEvent("page-change", {
      previous,
      current: next,
      total: this.total,
      pageCount: this.knownPageCount,
      pageSize: this.pageSize
    });
    return this;
  } // The last page needs a number, and without a count nobody has one yet. So
  // the number is asked for, and the jump happens when it arrives — which is
  // why the request carries the reason. Counting on every answer instead is
  // exactly what this mode exists to avoid.


  lastPage() {
    if (!this.countKnown) {
      return this.requestCount("last-page");
    }

    return this.goToPage(this.pageCount);
  }

  requestCount(reason = "total") {
    if (this.countKnown || !this.canCount || this.counting) {
      return this;
    }

    this.setState({
      counting: true
    });
    this.emitComponentEvent("count-request", {
      reason,
      current: this.current,
      pageSize: this.pageSize
    });
    return this;
  } // The panel's cross drops the selection. The pagination does not hold it —
  // the rows do — so this is an announcement, not a mutation, and the view
  // passes it to the table.


  clearSelection() {
    this.emitComponentEvent("selection-clear", {
      selectedCount: this.selectedCount,
      total: this.total
    });
    return this;
  }

  showMore(item = null) {
    this.emitComponentEvent("show-more", {
      current: this.current,
      total: this.total,
      pageSize: this.pageSize,
      pageCount: this.knownPageCount,
      hasNext: this.hasNext,
      item
    });
    return this;
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
    const current = Math.min(this.current, pageCount);
    this.setState({
      pageSize: parsed,
      current
    });
    this.emitComponentEvent("page-size-change", {
      previous,
      pageSize: parsed,
      current,
      total: this.total,
      pageCount
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
    this.emitComponentEvent("action-change", {
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
    this.emitComponentEvent("action-for-all-change", {
      previous,
      actionForAll: next
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
    }

    this.emitComponentEvent("action-apply", {
      action: this.action,
      actionForAll: this.actionForAll,
      current: this.current,
      total: this.total,
      pageSize: this.pageSize,
      pageCount: this.knownPageCount
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
  }

  onPageChange(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("sf-page-change", event => {
        handler(event.detail?.current, event.detail, event);
      }, options);
    }

    return this;
  }

  onShowMore(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("sf-show-more", event => {
        handler(event.detail, event);
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
                  ${context.countKnown ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-pagination-total-text">
                          ${context.totalLabel} ${context.total}
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
                              ${renderDirection(context, {
    kind: "last",
    icon: "last_page",
    label: context.lastLabel,
    page: () => component.lastPage()
  })}
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
                      label=${context.countKnown ? `${context.actionForAllLabel} (${context.total})` : context.actionForAllLabel}
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