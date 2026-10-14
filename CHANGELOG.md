# Changelog

Все заметные изменения SIMAI UI Core фиксируются в этом файле.

Формат версий: `major.minor.patch`. Для ветки SIMAI Framework 5 мажорная версия начинается с `5`.

## [Unreleased]

### Исправлено

- The larena package's table requires `smart.radio`: its filter window's templates are a radio list.

- `sf-sortable` opens the silhouette in a list that wraps into a grid as well: the outline is one of its cells, in reading order, instead of a line.

- A badge is as wide as its text: in a table cell it filled the column. A reference in a cell is a plain link without the card's arrow, and a person's name links to the profile when the host gives its href. Filter controls take the size of the list they filter. The page language is read past shadow roots, so a pagination inside a data view speaks the admin's language.

- The rest of the first documentation pass: `sf-popover` gives its role to the surface (`surface-role`; a `role` on the host is moved) and tells its trigger `aria-expanded` and `aria-haspopup`, and a window behind it leaves its Escape alone; anchored tooltips are as wide as their text, not 100px; `sf-color` sends `input` while the picker moves and one `change` when it commits, submits an empty value while the colour is inherited and keeps spaces in swatch names; `sf-range-slider` `onChange` binds `change` and `connect: false` draws no fill; the `Verification`, `VerificationForm` and `FileUpload` classes build their markup; a file drop keeps only accepted files and sends `change`; «Try again» speaks the page's language; emoji `skin`, a loading icon button, a file held over the drop area and a disabled step are drawn; `sf-avatars` draws from `sf-avatar`'s parts; `SF.DownloadFile` binds; a button with an unknown appearance is the default button; re-picking the chosen dropdown item sends no `change`; the datepicker's legacy `sf-change` carries the change detail.
- Manifests: real summaries, method signatures and event payloads for 38 components; Toggle is marked deprecated in favour of Switch; the misspelt `sf-modal--positon-*` class is recorded for removal.

- Components from the first documentation pass: `SF.Toast.show` takes neutral and info; breadcrumbs stay expanded; a carousel keeps its slides' names and its height; a slider's thumbnails are visible and move it; a menu item written expanded is open and an admin-menu panel opens; a tree name takes its row's colour; calendar days are no longer dark cells; the light tooltip is raised; a default button at scheme secondary is styled; `<kbd>`, `.sf-link`, `.sf-outline` and `.sf-file-preview` load their CSS; `SF.whenDefined` waits for a package element named short; a spinner with `label=""` says nothing and takes its size class; progress keeps the info status.
- Components built from code no longer default to «Label», «placeholder» and required; the toast's, window's, scrollbar's, quantity's, slider's and breadcrumbs' controls speak the page's language.
- `.border-none` means `border-style: none` everywhere; component lifecycle events carry the component's name; the carousel, slider, spinner and swiper styles are in the components layer; `SF.Flag` joins `SF.flag`.

- `sf-color` draws its chip and its clear button at its own size: at 1/2 the chip was the 40px square of step 1 and stood taller than the row it sat in.

- The Studio generator keeps what a manifest says: the component's props fill only what the manifest does not say yet, and inputs only the manifest names are kept. A regeneration now writes the committed manifests (eleven differed).
- `sf-upgrade` reports a class shared by two components' records once per use, not twice.
- `sf-modal`'s manifest names the untitled window «Dialog» in English, as the runtime does.

- A field's mask binds when Core arrives after the field's script (SF_PRELOADED, Docara's pages and example frames): it gave up for good when SF.Mask was not there yet. Core announces the service with `sf-mask-ready`.
- Smart elements speak the page's language by default: an untitled `sf-modal` is «Окно» / «Dialog», not «Modal»; the `sf-dropdown` search reads «Поиск» / «Search», not «Placeholder». Manifests no longer state English text defaults the runtime never used.
- `sf-dropdown` no longer lets its search field's native `change` reach listeners on the element.
- `SF.Input.setState({invalid: false, errorMessage: hint})` restores a hint as a hint.
- `SF.deprecations.list()` lists the notes of every bundle on the page, not of the last one loaded.
- The Framework's own templates write `appearance`, `kind`, `spacing`, `icon-start` and `icon-end` on the elements they draw, so a page using nothing legacy no longer collects the Framework's own deprecation notes; tree and dropdown items read `kind` before `type`.
- Manifests declare `sf-modal`'s before/after events, the full `change` detail of `sf-datepicker` and `sf-dropdown`, and `sf-datepicker`'s `name`; the change journal records the status class aliases and the `tightness-*` classes.

- The input mask reads the documented grammar: `0` digit, `a` letter, `*` any, `{...}` a fixed part that belongs to the value, `\` escape. `+{7} (000) 000-00-00` printed its braces and re-read its own 7 as input; `mask-lazy="false"` and `mask-placeholder-char` were ignored; `"mask": "Number"` from JSON printed the word. A Number mask now groups thousands while it is typed and clamps, scales and pads when the field is left. `SF.Mask` is unchanged.
- The Loader loads elements inserted after the page has loaded. When it prepared after the window's load (its chunk arrives on its own) or after a Turbo visit, its search never ended and later elements waited in a queue nothing read.
- `sf-quantity` keeps focus on the value when a focused step button reaches the limit; it fell to `<body>`.
- The `template` input of Smart manifests is no longer limited to the shipped templates (any name loads from the external template base), and the button's composition type accepts `appearance` and `tightness`.

- A menu has no tail: it never read as one piece with the panel. `position` and `tooltip` are deprecated and draw nothing; markup that writes a tail has it hidden.
- A menu returns the focus where it was, or to its anchor's own control when it was nowhere -- an `sf-button` anchor left it on the page body.
- Copying a Highlight block with line numbers copies the code, one line per row, without the numbers.

- Standard menu rows keep their height in a short window and the list scrolls; a caption no longer runs into the next row. A searchable submenu opened by a pointer opens on its field, so the letters go into the search and Escape closes the submenu, not the whole menu.

- Highlight line numbers (`data-lines`) are laid out one row per line, with the number in a column of its own; all the lines used to run into one.

- Compact text density no longer moves rem: on `<html>` it sets `--sf-text--size` and `--sf-text--height` only and body reads them. Setting a font size on the root shrank every step of the ladder (body read 12.25px instead of 14px).
- `hidden` hides a Smart element. A Smart host carries an inline `display: contents`, which outranked the user agent's `[hidden]` rule; the base preset now declares `[hidden] { display: none !important }`.

- `sf-toast` stands on the third elevation surface with its status tint laid over it. It sat on a translucent container tone and could not be read over a table.

- `sf-badge` loads the visually hidden label with itself, so a badge with an accessible name no longer reads it beside its text where the Loader's scan does not reach («Элементы: 7 7»).

- A port column option's `scheme` colours its badge; only a filter option's `color` was read, so every port column's badges were neutral.

- The JavaScript API keeps the promises it makes. A class component's object (`SF.Toast`, `SF.Input`, `SF.ProgressBar` and the other 14) exists when `component:ready` says it is ready; it used to arrive just after. `SF.Toast.dismiss(null)` answers `false` instead of throwing. `SF.Toast.show` and `create` take `status`, and `SF.ProgressBar` and `SF.ProgressScale` take and report `status`; the retired `type` and `tone` are still read until their journal records leave. `SF.smartBaseReady` settles with the Smart base however it arrives, and the base announces `sf-smart-base-ready` once per page. `sf-loader-ready` carries the time it was sent. The inline editor, the composition overlay and sortable follow `SF.language.use()` and a product's dictionaries. Legacy `[sf-gallery]` markup no longer reaches a gallery no build publishes.

- A component package's elements load under its owner's prefix (`lr-records-list`), as the package standard asks of a new element; the Loader used to skip every tag outside `sf-`. Only a rule a package registered may claim a tag outside `sf-`, so the Framework's names stay its own, and the package's rule file is where its tags are listed — there is no separate prefix setting. `SF.create` keeps a package element's full name.

- Five defects the documentation trial confirmed in a browser. `radius-ui`, `radius-surface` and `radius-4` load: the Loader's rule for the radius utility had not been updated when they were added, and the same drift had stopped the grid rows (`row-span-*`, `row-start-*`, `row-end-*`), `isolation-auto`, four diagonal cursors, `color-current`, `placeholder-current`, `will-change-scroll-position` and the divider and transparent hover backgrounds from ever loading; `elevation-*` had no rule at all. A contract now audits every utility sheet against its rule. `sf-dropdown.value` is the selected value, a string, and setting it selects; it returned every template setting as an object. Composition exports its built-in types and adds `extendRegistry(types)`, so a product adding a type keeps the layout types. A checkbox tag with `closable` gets a remove action beside its toggle instead of none. `sf-modal` names its close and minimize actions in the page's language.

- Every Smart manifest is valid against the manifest schema. `sf-contract` checked only part of the schema, so 21 manifests that passed it broke ui-studio, which validates the whole schema; it now validates strictly and refuses a keyword it does not implement. Schema 2.3.0 lets a `change` event be marked `canonical` and an older name `alias_of` it, which thirteen manifests already wrote. The visual-state list stays closed: `sf-page-header`'s starred state is `selected`. `sf-color` and `sf-popover` declare their methods with arguments and results, and slots are described in `contracts.slots`.

- `sf-page-header` and `sf-file-preview` load. Both were in the generated rule list and in the distribution, but Core never registered their rules, so the Loader did not know the tags: `ui-9fb0297bb5c2` drew no page header, and `sf-file-preview` had not loaded on its own since the component foundation was consolidated. A contract now requires every Smart component's rule to be registered when Core starts.

- Defects found while checking the unified guide against the source. `focus-visible:` utility classes are fetched by the Loader (it walked every condition but that one, so they worked only from the full utility sheet). `sm:` to `xxl:container` fill the window and stop at their step instead of overflowing it between the media query and the step (a 600px window held a 704px `sm:container`). The focus ring is drawn in pixels, 2px with a 1px gap, and no longer grows with the root font size. The dark side of `--sf-info-hover` comes from the info palette, not primary. `theme/default` no longer names five themes no stylesheet defines. The `core.css` header states the MIT licence.
- The text steps `1/7`, `1/6` and `1/5` (and the skeleton sizes built on them) enter compatibility until 2026-12-01: they have no line height and no text role. Older `change` event names last as long as the change journal keeps them, not «until a major release».

- The open search panel of `sf-admin-menu` stands over the menu. It read
  `translateX(100%)` and stood one menu width to the side, where the menu's own
  overflow clipped it away: the state said open, the field had a box, and a
  person saw nothing on any screen above the small breakpoint. A submenu has
  always been `translateX(0)` when open, and the panel opens like a submenu.

### Добавлено

- `sf-profile-picker` — one place to choose, make, rename, remove and reset a profile (the admin menu's profiles, a record's views). Folded it is a field-like button naming the profile in use; open, its panel lists the profiles with the current one checked, rename and remove on the row (a lock where the person may not change one), a new profile made inline as a copy of the current one, personal or for everyone, and a reset at the foot. The host keeps the profiles and the rights; the component raises `sf-profile-select`, `-create`, `-rename`, `-delete` and `-reset`.

- `simai.property-view-port` 1.12.0: the record's `actions` name `record.edit` (the fields may be changed) beside the lifecycle acts, so a reader is sent nothing to change; `record.load` with `mode: create` answers an empty object of the collection laid out by its arrangement; `record.create` makes it; `record.save` saves the whole object as one revision. Six new conformance cases (42).

- `SF.Resizer.attach(root, {handles, session})` — the resize gesture of `sf-resizer` for any edge a page draws itself, such as a table's column edges: the same drag, keys (arrows, Shift, Home, End, PageUp, PageDown; Enter and Space reset), double click, page-wide cursor and separator value, with the caller saying what the width belongs to and where it is kept.
- `sf-resizer` takes `value`, a width the host keeps for the person; it wins over the browser's memory.

- `sf-resizer` — a handle on a panel's edge that changes its width by a drag, the arrow keys (Shift: four steps; Home and End: the limits) or a double click back to the stylesheet's width, between `min` and `max`. The width is written to the custom property named in `property`, or to the panel's `inline-size`; with `storage-key` it is remembered in the browser. It is a separator with its value in pixels; `sf-resize {width, phase}` reports `move`, `end` and `reset`.

- `sf-context-menu` comes in two sizes: `size="1/2"` (the default, 32px rows) and `size="1"` (40px rows), with text, icons, search, headings, notes and footer to match; a submenu takes its parent's size. `openFor(anchor, {width})` and the `width` attribute open it as wide as its content, exactly as wide as the trigger (`trigger`), or at a CSS length. A slotted `footer` of actions stays under the rows, its buttons sharing the width; `.sf-context-menu-top` and `.sf-context-menu-body` are the parts of a window built in the menu.
- `sf-dropdown` grid cells follow the dropdown's size, and a grid behind a supplied trigger is as wide as its columns instead of 18rem.
- A skeleton text bar is as tall as the text size in the middle of a line of that size (`--sf-skeleton-text--height`, `--sf-skeleton-text--line`), with no gap between lines, so a loading block is as tall as the text it stands for.
- `renderViewField` / `renderEditField` take `{size: '1/2'}`; a viewed person links to its `href`.

- `SF.Sortable.attach(container, options)` — the column mode of sf-sortable. Any row of items (a table's heading row) is made draggable in place: a ghost follows the pointer, the dragged column's cells are dimmed and a dashed outline the column's width and the table's height shows where it will land. Items move only within their group (`groupOf`), a drag can be refused (`canStart`), the row scrolls sideways near its edges, Escape cancels, and the click a drop ends with is swallowed. Nothing in the DOM is moved: `onIntent({item, from, index, group})` asks the host to reorder.

- `SF.notify` raises a message in the page's one notification area: in the top layer at an edge of the window, four at a time with the rest queued, the same message counting up, a timer that pauses under the pointer or the focus, errors announced at once. Every message is announced as `sf-notification` for a notification centre; `SF.notifications.history()` keeps the last fifty.
- `sf-sortable` shows where a dragged item lands: the item lifts out and an outline of its size opens at its new place (`preview="silhouette"`, the default; `preview="line"` keeps the line).
- Public variables: badge, button, input and alert offer five to eight CSS variables each (`core/contracts/public-variables.v1.json`) for colours, border, radius, padding and gap; states still show over them. Other `--sf-<block>--*` variables are internal.
- A radio's hover marks its ring alone, as a checkbox does.
- This is the first release built from the public `simai/ui-source`; earlier releases name commits of the private `simai/ui-source-history`.

- `sf-pagination` takes `size`: `1` (default) or `1/2`, the dense step of an admin. At 1/2 its fields, buttons and menus draw at 32px and its labels and page numbers take the step's 14/20 text and control height.

- Data view host port 1.10.0: creating a record and saving personal column settings are capabilities a host announces (`create-record`, `personal-column-settings`); a host that declares an earlier version keeps both as before. The port describes the host's answer (`answer`, `reason`, `data`) and what each intent's data carries. Property view host port 1.11.0 describes its answer, whose fields sit beside `answer`; it changes nothing a host does. The host port schema takes the optional `answer` and `answer_data`.

- `SF_BOOT_CONFIG.icons.preload` declares icons a page will draw before it draws them -- the ones that come with data -- so they go in the first subset request instead of costing a second whole font. Entries are names or `{icon, weight, filled, grade, opticalSize, type}`; a component that learns its icons at run time calls `SF.Loader.preloadIcons([...])`.
- A plain `.sf-icon` is no longer tracked as filled. An unset `--sf-icon--fill` was read as a bare flag, so the subset was asked for the FILL axis it never drew (385 KB instead of 250 KB on the admin), and icons scanned after the first request forced a second one.

- A rule's relation may be marked `lazy: true`: the element does not wait for it and the page does not hold its first paint for it. The Loader fetches lazy relations after `sf-loader-ready`, a few at a time in idle time, and at once when asked (`SF.Loader.ensurePlugin(name)`) or when the element appears in the document.

- The standard menu's rows take a picture in the lead (`avatar`, or `initials` without one), and `search: {remote: true}` makes a list the host searches: the menu raises `sf-context-menu-search` with the query and shows the entries the host sets.
- A menu is as wide as its content, from an e8 floor up to g2; a host raises the floor with `--sf-context-menu--min-inline-size`.

- The standard menu carries a profile menu: a `header` entry for the person (name, lines under it, picture or initials), a `choice` row of options side by side (the theme), marked at once while the menu stays open, a `note` line, and `search` on a menu or a submenu entry -- a field that narrows the rows by label, caption and keywords. A row takes `lang` for a language list written in each language's own name.

- The standard action menu: `sf-context-menu` takes `entries` -- icon, label, caption, value, shortcut, check and radio rows, danger, disabled, link rows, submenus, separators and group headings -- and opens through `openFor(anchor)` / `toggleFor(anchor)` into the top layer, below its control and start-aligned, with no tail. Opened that way it owns its lifecycle: Escape closes a level, Tab and a press outside close the menu, a letter moves to the next item it starts, and a choice (`sf-context-menu-select`, at any depth) closes it and returns the focus. Its surface is the third elevation step with a hairline border. A menu the host renders and opens itself keeps the previous contract.
- Highlight numbers lines from `data-start`.

- Compact text density: `data-sf-density="compact"` on `<html>` or on a region keeps the phone's body step on desktop (14px on a 20px line). A dense application -- an admin panel, a table page -- asks for it by attribute instead of overriding `--sf-text--size` with a pixel value of its own.

- The data view host port 1.9.0: a tree node may name its icon (`icon`, and `icon_expanded` for an open node that looks different), drawn beside its open/close button. The host chooses it -- a page with pages under it is still a page; a host that names none gets a folder for a node with children and a document for a leaf.

- The data view host port 1.8.0: a list can be a tree. The host answers one level at a time (`tree.expand`), says where a node may move (`node.targets`, with labels, since most targets are not on screen) and moves it (`node.move`, at an index when reordering is allowed). A write it wants confirmed is answered `refused` with reason `confirm_required` and `data.confirm {summary, digest}`, and applied when raised again with the digest. `view.create_record` may carry a parent, and `data.row_actions` labels the host's own actions and groups them into submenus. Capabilities `tree` and `tree-move`; the kit has 37 cases. Larena's Groups and Site pages are the first hosts.
- A choices column with `variant: "badges"` is a row of tonal badges coloured by each option's scheme, and a value may carry its own text. A file column the host says holds images draws `sf-file-preview` with the new `compact`: the thumbnail, or the extension in a tile, as tall as a list row.

- Admin navigation port and the page header. `simai.admin-navigation-port` 1.0.0, agreed with Larena, with a conformance kit of 37 cases: the host seam of the admin menu that replaces an admin's top bar — sites, the tree with site and install levels, favourites as places, profiles with layouts and revisions, the person and their preferences, the ⌘K palette and notifications. `sf-page-header` is a new free Smart component: the path, heading, record count, favourite star, install mark and main action of an admin page, in Framework utilities only; the star is a cancelable `sf-page-header-star` intent the host answers.
- Component packages are a published standard, `simai.component-package` 1.0.0: a component lives with its owner, and the Framework is extended through packages. SIMAI Framework Pro is dropped; `sf-table`, `sf-data-view`, `sf-property-view` and `sf-admin-menu` are the package `larena` (simai/larena-ui, Apache-2.0). A page declares `SF_BOOT_CONFIG.packages.larena` instead of `packages.pro`; the change journal records the move (`component-larena-package-move`) and `sf-upgrade` reports only each component's last move. `distr/core/contracts/packages/larena.package.json` replaces `pro.package.json` until the free recipe `recipe.admin.collection` leaves with it. `simai/ui-smart` is no longer published.
- `pageLanguage()` returns the language without its region however it was chosen: `SF.language.use('pt-BR')` gave `pt-br`.

- Component packages. A page declares extra packages in `window.SF_BOOT_CONFIG.packages = {name: {base, rule?}}`; the Loader fetches each package's `rule.js` (default `<base>/rule.js`) before its first scan, the package registers its rules with `SF.RuleLoader.registerPackage(name, {rules})`, and the files of those components load from the package base. A package registered after load rescans the page. Failures warn once, naming the tag and the package, and never fall back to the Smart base; the missing-file cache keys package entries as `<package>::<rule>`. `sfSmartPath` is optional: with only `sfPath` set, Smart resolves to `<sfPath>/smart`. Language state stays on one shared global for every bundle, held by contract. See `docs/developer/component-packages.md`.

- Tags get five sizes, density and an inline mode. Sizes `1/3`, `2` and `3`
  join `1/2` and `1` (text 12, 14, 16, 20 and 24px); every size publishes its
  text on the root as `--sf-tag--font-size` and `--sf-tag--line-height`.
  `spacing-compact`, `spacing-comfortable` and `spacing-spacious` move the block
  padding with the names the buttons use. `sf-tag--inline` sets a tag on
  another control's text line: no block padding, a flush label, and a remove
  button the height of the line with its mark at 0.7 of the label; a host may
  publish the line as `--sf-tag--line`. Sizes 1 and 1/2 look as before. The
  dropdown now renders its tags inline one size below the field and only
  publishes `--sf-tag--line`, instead of overriding the tag's padding, label
  font and close size; the field looks as before. The Smart tag takes
  `size` 1/3..3, `spacing` and `inline`.
- `search-title` names the search panel beside the back arrow, defaulting to the
  component's own word. `search-label` stays the magnifier's accessible name,
  which is usually a sentence with the shortcut in it.

### Изменено

- The `larena` package reference lets the table relate to `sf-sortable` and the admin menu to `sf-dropdown`: the table's windows reorder their lists with `sf-sortable`, and the menu's edit mode chooses a row's glyph with the grid dropdown. The public source's CI reads ui-doc's main and the published distribution.

- The breakpoints are steps of the size ladder, in rem, and `--sf-breakpoint-*` name the same steps: sm 32rem (512px), md 44rem (704px), lg 60rem (960px), xl 72rem (1152px), xxl 80rem (1280px). They were 520/720/960/1140/1320px against variables of 704/768/960/1152/1536px. Layouts that switch at sm, md, xl or xxl now switch up to 40px earlier or later.
- The Framework is licensed under the Apache License 2.0 (LICENSE, NOTICE); releases before this one remain available under the MIT License.

- The core runtime opens the connection to the icon subset host (`SF_BOOT_CONFIG.icons.subsetHost`, by default `https://icons.simai.io`) as it starts, with a crossorigin preconnect, so the subset request that follows the page's ready does not pay for DNS, TCP and TLS. A page with the subset off gets no hint.

- Icons no longer download the full Material Symbols font (409 KB) while the subset font is on its way. A browser fetched the declared font for every icon waiting at font-size 0, and the subset's own wait for `document.fonts.ready` waited on it. The core runtime marks the root `data-sf-icons="subset-pending"` until the subset, a cached manifest or the full-font fallback is in place; a page with `SF_BOOT_CONFIG.icons.enabled = false` is not marked. The first subset request now waits for `sf-loader-ready` and carries every icon scanned by then, instead of asking for one glyph and making the rest wait for that whole font.

- The Loader also fetches an element that waits on another element while that one loads (a data view and its table), instead of after it has run.

- The Loader fetches an element's script while the element's relations load, instead of after they have run; the script still runs after them.

- Core tells the browser about its own chunks -- the rules, the system events, the Loader -- as it starts, so they are fetched at once instead of one after another; they still run in order.

- The shared Smart runtime: lit, smart-base and page-language are loaded once per page, from `core/js/smart-base.js` beside `core.js`, and the Smart bundles no longer carry a copy each (a bundle such as `close.min.js` went from 52 KB to 2.6 KB; the runtime is 78 KB, 25 KB gzipped, once). Core fetches the runtime the first time a Smart element is queued; a page that assembles its scripts by hand includes `core/js/smart-base.js` after `core.js` (or before Smart bundles when it has no Core).

- The Loader fetches the minified twin of every component and Smart script and of every stylesheet, about 40 % of the readable size; a page being debugged asks for the readable files with `SF_BOOT_CONFIG.minified = false`, `?sf-debug` in its address or `data-sf-debug` on `<html>`. A bundle built without a minified twin falls back to its readable file once. Pages should include `core.min.js` and `core.min.css`, which load the minified core chunks.

- The package reference that names SIMAI Framework Pro's components ships in the runtime as `distr/core/contracts/packages/pro.package.json`, beside the ports, so a consumer holding only the distribution can tell which elements need the Pro package. The change journal records the move (`component-pro-package-move`), and `sf-upgrade` reports a Pro tag in a project that declares no Pro package. `sf-upgrade` had stopped on every project since 2026-10-09 (a journal pattern the `u` flag rejects, and an attribute retired without a replacement); both are fixed, and the gate now compiles every journal pattern the way `sf-upgrade` does.

- One release, one place. Smart components are published in `ui` as `distr/smart`, beside `distr/core`, from the same build commit; a release is one `ui` commit with the id `ui-<12>` and the lock v2 `contracts/releases/ui-<12>.lock.json`. `ui-smart` still receives the same Smart bytes as a mirror while consumers move, and a v1 alias lock `ui-<12>-smart-<12>` is written beside each v2 lock for readers of the pair id. The Smart owner manifest lives in `contracts/owners/`. No runtime byte changes in this release: `distr/smart` is byte-identical to `ui-smart/smart`.

- Legacy leaves on a calendar. A public name kept for compatibility is recorded in `contracts/changes/journal.json` (37 records, 130 old forms) with what to write instead, the date it was deprecated and the sweep day it goes; sweeps are on the 1st of a month for whatever has spent 30 days in compat (`contracts/lifecycle-policy.json`, standard `simai.change-lifecycle` 1.0.0). Pages note every legacy name they use in `SF.deprecations.list()`, silently unless `<html data-sf-deprecations="warn">`. `scripts/sf-upgrade.mjs` upgrades a product from the journal. First sweeps: 2026-11-01 (`sf-toggle`, `font-size-ext`, `--sf-radius-round`, `--sf-radius-default`) and 2026-12-01 (the rest). The loader's messages are unchanged; no runtime behaviour changes.
- `sf-drawer` gains `gutter` (a length, empty for the drawer's own space-1): the head and the body share one inline gutter, so a title and the content start on one axis. A theme may set `--sf-drawer-gutter`. Composites that want a wider reading gutter set it on the drawer instead of insetting their own content inside the body.
- `sf-drawer` gains `stack-offset` (a length, empty by default: drawers lie flush as before). Drawers open at one edge stand depth × offset in from it and keep their width, so the drawer below shows past the one above; the drawer counts its own depth from the open, undocked drawers at the same physical edge.
- Fixed: in a right-to-left page a drawer at `inline-start` or `inline-end` opened off-screen, because the closed transform under `:dir(rtl)` outranked `.is-open`.
- `sf-file-upload` names no formats it cannot know: the formats line is empty unless `formats` is given or derived from `accept` (it said "SVG, PNG, JPG or GIF" on every field).
- The Framework speaks English by default and Russian on a Russian page: the nearest `[lang]`, else the document's, else English (`src/core/js/page-language.js`). `sf-admin-menu`, `sf-tag` (remove label Remove / Удалить) and `sf-country-code` (field words and country names) used to fall back to Russian on a page with no lang; swiper's slide bullets and the Core admin menu spoke only Russian. Texts a host passes are shown as given. The loader's console messages are English (`Failed to load styles: …`, `Failed to load script: …`).
- Every manifest default now says what the component does with the attribute absent, held by a browser test over 757 defaults and a node contract. Corrected: `sf-dropdown` appearance `outlined` (it never drew filled by default); `sf-admin-menu` labels are the Russian ones it renders; `sf-datepicker` icon-start `calendar_today` and mask-pattern `00.00.0000`; `sf-file-preview` aria-label `File`; `sf-file-upload` formats and supporting-text. No runtime behaviour changes.
- Input controls rest on a calmer boundary: a new role, `--sf-outline-control`, is `--sf-outline` at the opacity that gives exactly WCAG 1.4.11's 3:1 on surface-0 (80% light, 64% dark; 3.10:1 and 3.12:1, against 4.47:1 and 5.95:1 before). Bordered inputs, textarea, outlined dropdown, country-code, checkbox, radio, switch, quantity, file-upload and outline buttons take it at rest; hover still turns the line to the primary hover colour and focus to its focus colour. A product that wants the old line sets `--sf-outline-control: var(--sf-outline)`.
- A list row's divider is inside its control height: the bottom padding gives the border back. A standalone `sf-list-item` with its divider stood one pixel taller than the control at every size (33/41/49 against 32/40/48); it now matches, content on the row's centre.
- Height is one semantic: `--sf-elevation-1..5--shadow` stands beside `--sf-elevation-N--surface`, and whatever floats above the page takes both. `elevation-N` sets the pair; `shadow-N` stays a shadow alone. Each step's shadow ends in `--sf-shadow--rim`, a layer a theme may switch on to outline raised panels; it is off. In the dark theme the datepicker body and the pagination band used to be the page's colour and the overbox pointer and the sf-system dialogs were white; they now stand on their step's surface (datepicker 3, pagination band 2, editor toolbars 2, elevated modal 3, overbox 4). In the light theme the elevated modal and the editor toolbars move from surface-1 to the step surface (surface-0).
- Smart templates read the values their components resolve: a new browser test renders every Smart component across its manifest values and requires each context key the template reads to equal the component's getter of that name (exemptions with reasons in `contracts/template-context.json`). Fixed by it: `sf-list-item` with `kind`/`type="checkbox"` now draws its checkbox; `sf-input appearance="hidden"` renders a hidden input; `sf-textarea minlength`/`maxlength` with a non-number no longer renders `maxlength=0`; `sf-modal blur="false"` no longer turns the blur on, and `el.blur` is true for `blur="small"`; the start/end icon names and the legacy `type`/`variant` names reach the templates of `sf-button`, `sf-badge`, `sf-input`, `sf-icon-button`, `sf-skeleton`, `sf-textarea`, `sf-toast` and `sf-toggle` resolved.
- Every form value control reports a committed change as `change` on its host, once per change the user makes. sf-button-group and the range slider now emit it; the older names (`sf-button-group-change`, `sf-datepicker-change`, `sf-change`, `sf-dropdown:change`, `sf-range-slider-change`, `onSliderChange`) are still emitted with the same detail. Manifests mark `change` with `canonical: true` and each older name with `alias_of: "change"`; the table is in `contracts/public-api-axes.json` (`change_event`). A range-slider value set from code does not emit `change`, as for a native control.
- `sf-tag kind="checkbox"` is interactive: the template received the raw `type` and rendered an inert box.
- sf-tag gains `line` (1/2, 1, 2): in a table cell it is rendered inline, one size down, on the text line of that form size, so a choices cell keeps the row's control height.
- sf-badge, sf-progress-scale and sf-reference-link gain `line` (1/2, 1, 2): in a table cell or a row of fields they take the text line of that form size, so the row keeps its control height (a size 1/2 badge was 28px and a scale 26px against a 20px line).
- Buttons and icon buttons keep every border inside their control height: outline, surface, segmented and grouped buttons are no longer 2px taller than their size. The side border widths are registered as lengths, so a bare 0 written by a group, tab row or host still works.
- Tabs and pagination on the control height: every tab variant is a size 1 control with its indicator inside the height; a page number is a size 1 control like the arrows beside it (it was 28px on mobile).
- Inputs for the field renderer set: sf-datepicker `size` (input-size stays as its legacy name), sf-reference-link `size` (1/2, 1, 2), sf-avatar `line` (1/2, 1, 2); sf-file-preview `size` documented as the legacy name for `file-size`; sf-input, sf-textarea, sf-checkbox, sf-switch and sf-file-upload declare the events they emit.
- New browser probe tests/browser/navigation-composition.cli.js.
- Tags on the button's ladder: a text-only label is centred; a picture-to-label step is the text step; icons, colour dots, avatars and counts take the size's line and text; a remove mark is always drawn (0.7 of the label's font size, also in plain markup without a close size class) with a 24px target.
- New browser probe tests/browser/action-composition.cli.js.
- Checkbox, radio and switch: the label follows the mark at the size's text step (7/8/10 on desktop, 6/6/8 on mobile), the step a dropdown option keeps after its picture.
- Context menu: Smart items rendered inside sf-button hosts take the start-aligned row and the panel axis too.
- New browser probe tests/browser/choice-composition.cli.js.
- Menus on the panel axis and the control height: context menu items start their content where a dropdown list's options do (the axis is published as --sf-context-menu--item-inset-*-S and --sf-context-menu--label-inset-S); items are start-aligned rows whatever their markup (short items were centred); a navigation menu row is a 40px size 1 control (it was 42); a Smart text field's leading icon takes the ladder.
- New browser probe tests/browser/panel-composition.cli.js.
- Form fields on one ladder and one set of axes: a text field's leading icon takes the line at every size; a textarea starts its text where a text field does; a dropdown stands 4px under its label like the other fields; the phone field's flag is three quarters of the line like a dropdown flag, and its country list has rows as tall as the field with the field's flag on the field flag's axis.
- New browser probe tests/browser/field-composition.cli.js (96 cases, zero tolerance).
- Dropdown: the field and its open list are one composition. Field pictures take the whole text line (24px at size 1 on desktop, as in the list) and the block padding gives up the border, so heights are unchanged; options compensate the list inset, so the picture, the label and the check sit on the field's picture, value and chevron axes; flags are three quarters of the line in both; a mobile size 1/2 field is 28px like a text field.
- New standard docs/foundation-composition-geometry.md and the browser probe tests/browser/dropdown-alignment.cli.js (72 cases, zero tolerance).
- Checkbox, radio and switch: the hit area reaches at least 24×24 px around a smaller mark (WCAG 2.2, 2.5.8); the mark itself does not change.
- Country code: the field is as tall as other fields (32/40/48 instead of 34/42/50).
- List options: colour options keep their row height and drop the tag padding at sizes 2 and 3; avatar options take the line height, so their rows are as tall as text rows.
- Checkbox, radio and switch: the hit area reaches at least 24×24 px around a smaller mark (WCAG 2.2, 2.5.8); the mark itself does not change.
- Country code: the field is as tall as other fields (32/40/48 instead of 34/42/50).
- List options: colour options keep their row height and drop the tag padding at sizes 2 and 3; avatar options take the line height, so their rows are as tall as text rows.
- Checkbox, radio and switch: the hit area reaches at least 24×24 px around a smaller mark (WCAG 2.2, 2.5.8); the mark itself does not change.
- Country code: the field is as tall as other fields (32/40/48 instead of 34/42/50).
- List options: colour options keep their row height and drop the tag padding at sizes 2 and 3; avatar options take the line height, so their rows are as tall as text rows.
- Checkbox, radio and switch have size 1/2 next to 1 and 2, the same three sizes as form fields (16px on mobile, 20px on desktop).
- A list item's checkbox takes the nearest form size of the list: a size 1/2 list gets a 1/2 checkbox (it asked for a 1/3 class that never existed), a size 2 list a size 2 checkbox.
- Form fields (input, textarea, dropdown, quantity, verification, country code, file upload) have three sizes: 1/2, 1 and 2. Sizes 1/3 and 3 are retired; a retired value renders at the nearest kept size (1/3 → 1/2, 3 → 2) and warns once in the console. Buttons, icon buttons, tags, badges and list items keep their full scale.
- Dropdown field: a flag takes the line height and no field picture can grow the field; a tag stays on one line with an ellipsis; avatar initials fit; a long value ends in an ellipsis.
- List items: flags and colour dots keep their shape when a label wraps.
- A chosen avatar in the dropdown field is line-sized again, like the icon,
  colour dot and flag, with the ordinary field padding.
- A filled field turns into the ordinary field while focus is inside: input,
  textarea, dropdown (also while its list is open) and code field take the
  bordered surface (`--sf-surface-0`) and a visible boundary, and the fill
  returns when focus leaves; error, disabled and read-only fields keep their
  look. A filled code field now marks the current cell, which its fill rule had
  hidden. A dropdown shows the picture of a single choice — flag, icon, colour
  dot or avatar — in front of its label in the field. From size 1 up a dropdown
  holding tags carries compact chips of its own size (32px with 16px text at
  size 1) with 3px around them, still as tall as a text field; sizes 1/2 and 1/3
  keep the smaller inline tag. Tags gain the inline and compact pairing.
- A colour option in a dropdown list is a dot and a label, like an icon
  option, instead of a tag pill inside the option; its dot, and an avatar in a
  label group, also reach the field as the picture of the choice.
- From size 1 up a chosen avatar shows at chip size in the field (32px at size
  1) with compact field padding, like tags; other pictures stay within the
  field line. A list item's wrap lays out its own row, so the selected mark sits
  at the end even in markup without the flex utilities.
- A dropdown tag's remove mark follows its label: 0.7 of the label's font size
  (about 10px in a size 1 field, 14px in size 3) instead of the generic 12px
  close mark, which read larger than the letters beside it. The remove button
  keeps the whole line, so the target does not shrink.
- A dropdown tag's label is one text step below the field's text (14px in a
  size 1 field, 16px in size 2, 20px in size 3, 12px in sizes 1/2 and 1/3), on
  the same line box, and the gap before its remove button is `--sf-space-1/3`.
  At the field's own size a selected tag read as heavy as a text value and
  crowded its remove button; the field height is unchanged. Because each tag
  is narrower, fields wrap later: at size 3 two short tags that used to take
  two lines now fit one. The height per line is unchanged (one line is the
  height of a text field), so a page that reserved a second line for a fixed
  set of tags may show a gap.
- A dropdown field holding tags is as tall as one holding text. A selected tag
  was a free-standing size 1 tag (40px) with its inline space counted twice, and
  the in-line chevron stood 32px tall, so a size 1 field with one tag measured
  56px against 40 and two short names wrapped to 106px. Inside the field a tag
  now fits the field's text line for every size (the line is published on the
  dropdown root as `--sf-dropdown-tag-line--*`), the remove button and the
  chevron are no taller than that line, and a size 1/3 tag field takes the size
  1/3 padding. Measured after the change: 32, 40 and 48px for sizes 1/2, 1 and
  2, the same as text fields, and unchanged after a tag is removed or added.
- The button loading stripes are calm and seamless. A loading button is
  disabled, so it wears the grey disabled fill, while the stripes had been
  coloured for the enabled one — near-opaque primary bars over grey. Every
  emphasis now uses one neutral alpha step (`--sf-alpha-8`) over transparent,
  quiet in both themes. The loop jerked because it travelled `--sf-space-1`
  while the 135° stripes repeat every `--sf-space-1 × √2` along x; one loop now
  travels exactly that period and lasts one second. The per-variant
  `--sf-button-loading-stripe-1/2` properties are gone.
- A Framework element declared in data — a column's or a row's
  `{type, props}` — keeps the place it was rendered in. It used to be created
  anew on every render and handed to lit as a new node, so every cell that is an
  element was rebuilt whenever anything in the table changed, taking whatever
  control a person was interacting with with it. A directive holds it now, and a
  render writes only what differs: an attribute when its value changed, a
  listener when the function changed, and an attribute the props no longer carry
  is taken back off. Measured on ten rows: a full re-query went from 280 nodes
  added, 40 removed and 542 attribute writes to 0, 0 and 82; a one-row change
  from 140, 20 and 250 to 0, 0 and 20. A marked row stays marked, and the focus
  stays in a cell's control through a render. `createSmartElement` is there for
  a caller that wants the element rather than a position in a template.

### Добавлено

- Readable density classes for buttons and icon buttons: `spacing-compact`,
  `spacing-comfortable` and `spacing-spacious` (less, more and most inner
  space). They apply the same steps as `tightness-low`, `tightness-high` and
  `tightness-highest`, whose names read backwards — `low` is the least space —
  and stay as compatibility names. The names match the Smart `spacing`
  attribute. The constructors accept a `spacing` option; when both are given,
  `spacing` wins, as on the Smart element.
- The column width is taken by the line between two headers. There is no handle
  to find first: an invisible strip stands astride the separator, 8–12px wide,
  with the `col-resize` cursor, and it is still a button, so the keyboard keeps
  the name «Изменить ширину столбца: …» and the arrows. The guide line through
  the rows is placed again in the same frame the edge moves in.
- The band of bulk controls carries the surface radius, and the page field is as
  wide as the number it holds, growing as the number is typed. The width is set
  on the input through a selector that outranks the inputs sheet in any load
  order — set on the field it had to guess the chrome inside it and guessed
  short, clipping two digits into about eleven pixels. The width counts the
  input's own padding and declares a border box, so an unlayered
  `* { box-sizing: border-box }` in a host shell, which beats every layered
  declaration whatever its specificity, agrees with the rule instead of clipping
  the number.
- An item in a context menu is one line. A menu opened from a control near the
  window's edge used to be capped to the free space beside that control and its
  labels broke in two; it is moved inside the viewport instead, and an anchored
  menu is placed again once `document.fonts` is ready, because the first cap is
  measured before the webfont arrives.
- The row with «Показать ещё» leaves below it what the card leaves above it:
  `pagination.css` grows from 34 828 to 36 308 bytes. A demo panel that stood in
  every table, closed and empty, took the space there and is gone.

- The admin menu has a search panel, and its submenu has a header that says
  where you are. `admin-menu.css` grows from 61 826 to 76 050 bytes: the panel,
  its field with the `Esc` key hint, result groups with the matched part marked,
  loading skeletons that honour reduced motion, and the keys row under the list.
  The submenu header keeps the main header's height — the height is measured and
  published as `--sf-admin-menu-head--measured-height` instead of being guessed
  by a token — and the back row is an item, so its arrow stands in the same
  column as every other icon in the menu. The waiting rows read `--sf-d0`, the
  size of the result they stand in for.
- Inter Variable ships with Core again. The family tokens have named Inter
  since the fontsource dependency was dropped, but nothing shipped the font, so
  a page got Inter only where the reader had it installed. `core.css` now
  declares seven Inter Variable faces — one per script, with `unicode-range`
  and `font-display: optional` — and the local `Inter Fallback` face (Arial
  with metric overrides) that holds the geometry of a cold first paint.
  `--sf-text--family`, `--sf-heading--family` and `--sf-display--family` lead
  with them and end in the system stack. Seven hashed woff2 files (218 512
  bytes) sit next to `css/`; a Latin and Cyrillic page loads two of them,
  67 004 bytes. `core.css` grows from 108 209 to 110 544 bytes. Inter 5.3.0
  from fontsource, OFL-1.1; the licence is in the third-party notices.
- `sf-flag` — флаг страны картинкой, а не эмодзи. Набор поставляется дважды:
  прямоугольный 28×20 и круглый 24×24, по 247 кодов в каждом — составы
  совпадают, и телефонное поле целиком закрыто картинками. Круглый не обрезан из прямоугольного, а перерисован, поэтому форма
  выбирается классом `sf-flag--rect` или `sf-flag--circle`; если запрошенной
  формы у кода нет, отдаётся вторая. Тридцать семь кодов построены из
  flag-icons (MIT) и приведены к палитре набора; `flags/index.json` несёт
  уведомление об авторстве. Скругление и рамка живут в CSS
  (`--sf-flag--radius`, `--sf-flag--outline-color`) и следуют темам и шкале
  радиусов. Файл подгружается при подходе к экрану; путь по умолчанию берётся
  из рантайма, свой набор задаётся `data-flag-base`.
- `--sf-neutral-50--alfa-80` — чернила выключенного элемента в светлой теме.
  Шкала прозрачностей идёт шагом по четыре и заканчивается на 44; этот шаг стоит
  отдельно, потому что он не подложка, а текст. Промежуточных значений нет.
- `--sf-on-elevation-1--variant` … `--sf-on-elevation-5--variant` — приглушённый
  текст под каждую ступень высоты. Класс `elevation-N` подставляет нужное
  значение сам, переопределяя у себя `--sf-on-surface-variant`, поэтому в
  компонентах ничего не меняется.
- `radius-4` — четвёртая ступень скругления. Токен `--sf-radius-4` был объявлен
  с самого начала, а класса к нему не было, поэтому внешний уровень правила
  вложенности написать было нечем.
- `--sf-surface-5` — ступень поверхности над `--sf-surface-4`.
- `elevation-1` … `elevation-5` — утилита высоты: одним классом и поверхность
  ступени, и её тень. `shadow-N` ставит только тень, и в тёмной теме панель
  остаётся плоской; на светлом экране этого не видно.
- `--sf-elevation-1--surface` … `--sf-elevation-5--surface` — поверхность
  ступени. В светлой теме высоту несёт тень, в тёмной — светлеющая подложка.
- `divide-outline-variant` — роль, которой положено рисовать линию внутри
  области; у утилиты разделителей её не было.
- `--sf-radius--surface` — радиус крупного блока рядом с `--sf-radius--ui` для
  мелкого контрола. `--sf-radius-default` сохранён как алиас.
- Переключатель несёт варианты `sf-switch--short` и `sf-switch--icon`, включая
  пару значков на состояние: `sf-switch-icon--off` и `sf-switch-icon--on`.
- Ступень `--size-2` у флажка, радио и переключателя.
- Общий формат `simai.composition.document.v1` для проверяемого описания страниц и структурированного текста.
- Браузерный API `SF.Composition` для проверки, нормализации и безопасного HTML-рендеринга.
- Типизированные области содержимого, смысловые варианты оформления, внешние ссылки на данные и минимальный rich text без сохранения HTML.

### Устарело

- `sf-toggle` заменён переключателем: он рисовал тот же контрол и его размеры
  стояли между ступенями лестницы. Компонент остаётся рабочим, карта переноса —
  в его документации. Уедет в следующей мажорной версии.

### Изменено

- Each button emphasis has its own look. Measured in both themes, two pairs
  were one choice under two names. `--ghost` was identical to `--link` at rest
  and differed only by a hover tint of 8% instead of 16%; it now reads as
  `--link` on `sf-button` and `sf-icon-button` and stays as a compatibility
  name until the next major version. `tonal secondary` sat on a palette close
  to neutral and read as the same grey as `tonal on-surface`, so `tonal primary`
  is new: a fill on the primary container roles, and an on-primary-container
  label. `tonal secondary` is unchanged. Five emphases remain — default, tonal,
  outline, surface, link — each in an accent and a neutral scheme.
- Component sheets read only tokens the theme declares. A bare `var()` of an
  undeclared token silently drops the property to its initial value:
  `--sf-surface` is not a token (the scale is `--sf-surface-0` … `-5`), so
  `sf-download-file` and `sf-reference-link` were transparent — they now say
  `transparent`, and hover and press keep the container overlay. Carousel
  hover states read roles the theme never had: the secondary-container control
  keeps `--sf-on-secondary-container`, the surface-zero control steps to
  `--sf-surface-1`, the inverse control takes the five-tone hover step. The
  spinner's `var(--sf-space-1/2)` did not parse and is escaped. The Smart table
  and data view read `--sf-ui-shadow-3` instead of `--sf-shadow-3`, so the
  dragged column ghost and the dragged settings item get their shadow. The
  declared-tokens contract now walks every built component and Smart sheet.

- Всплывающий список выпадающего меню выглядит как контекстное меню: без
  разделителей между вариантами, подсветка скруглена ролью контрола и отступает
  от краёв, панель — поверхность второй ступени высоты с тенью вместо рамки.
  Ограничено `.sf-dropdown`, элементы списка вне выпадающего меню не меняются.
  Строку варианта раскладывает сам компонент: галочка выбранного пункта больше
  не падает под подпись, если в разметке нет класса `flex`.
  Тень панели задаётся через `--sf-list--box-shadow`: прежнее правило ставило её
  только при классе `.open`, которого скрипт не ставит, поэтому тени у списка не
  было никогда.

- Дни соседнего месяца в календаре — роль приглушённого текста
  (`--sf-on-surface-variant`, около 6,4:1) вместо половинной прозрачности
  (3,3:1). Их можно выбрать, поэтому число — это текст и должно читаться на
  4,5:1.
- Полоса прокрутки: остановкой Tab стала сама прокручиваемая область
  (`tabindex="0"`, при подписи — `role="region"`), стрелки прокручивают её
  средствами браузера. Бегунок вышел из порядка Tab и остался для мыши.
- В блоке исходного кода компонента doc вложенный `code` наследует светлый
  цвет блока, а не тёмный цвет основного текста (было 1,3:1).

- Фоновое видео `viewbox` проявляется за `--sf-duration-slow` (0,5 с) вместо
  секунды: прежнее значение было вдвое длиннее верхней ступени шкалы и ни к
  одной ступени не относилось.

- Утилита `transition` встала на шкалу движения: вместо 150 мс и чужой кривой
  теперь `--sf-duration-normal` (0,3 с) и `--sf-ease-move`. Она стоит почти на
  каждом контроле, поэтому там, где длительность задавала только она, движение
  стало вдвое спокойнее. Компонент со своей длительностью не затронут.

- У поставки появилась собственная лицензия: MIT, как у исходника. Файл
  `LICENSE` лежит в корне, а те же условия едут внутри
  `core/contracts/third-party-notices.v1.json` — рядом с условиями чужого кода.

- Компонент `icon` с набором Font Awesome Pro убран из поставки. Его лицензия
  коммерческая и не разрешает перераспространять файлы, а этот репозиторий
  публичный. Компонент не значился в реестре, загрузчик о нём не знал и ни один
  потребитель им не пользовался. Иконки Framework — это компонент `icons`.
- Поставка несёт уведомления о стороннем коде: `core/contracts/third-party-notices.v1.json`
  называет Lit, Floating UI, шрифты Material и flag-icons с версиями,
  копирайтами и текстами лицензий. Читаемая версия — `THIRD-PARTY-NOTICES.md`
  в корне репозитория.

- Крупные поверхности округляются заметнее: диалог, выезжающая панель, меню,
  выпадающий список, календарь, зона загрузки, оповещение, всплывающее
  сообщение, панель аккордеона, блок кода и админ-меню перешли с 4 на 8 px.
  Роли `--sf-radius--ui` и `--sf-radius--surface` завели ради этого различия, но
  до сих пор поверхность не читал никто, и обе роли на экране совпадали. Мелкие
  элементы — скелет, ссылка-сноска, ссылка на файл, превью файла и подсказка —
  остались на 4 px. Имя `--sf-radius-default` ещё работает и уезжает в мажорной
  версии.

- Поле кода страны рисует флаги картинками, а не эмодзи. Механика для этого в
  нём была всегда — `data-flag-base`, ленивая загрузка, запасной вариант, — но
  путь по умолчанию был пустой строкой, поэтому каждое поле падало в запасной
  вариант и выводило `flagEmoji` системным шрифтом. Отсюда и разный вид:
  развевающийся флаг на macOS, плоский на Android и две буквы вместо флага на
  Windows, где в Segoe UI Emoji флагов стран нет. Теперь путь разрешается от
  корня рантайма; свой набор по-прежнему задаётся `data-flag-base`, эмодзи
  остаётся запасным вариантом.
- Клик мышью больше не переносит кольцо фокуса на голый контрол. Поле,
  многострочное поле и количество отличают клавиатуру от указателя — их JS
  вешает на корень модификатор `--pointer-focus`, и правила фокуса стоят за
  `:not(…)`. Но текстовый контрол подходит под `:focus-visible` и при клике
  мышью, поэтому глобальное правило ядра продолжало рисовать: кольцо не
  исчезало, а переезжало с поля на `input` внутри него — тугой прямоугольник
  внутри скруглённого поля. Теперь у поля и количества голый контрол не носит
  кольцо никогда, а многострочное поле гасит своё только под модификатором.
- Полоса прогресса снова движется. Она читала `--sf-duration-default` — роли с
  таким именем нет, шкала состоит из `fast`, `normal` и `slow`. Объявление с
  неразрешимой переменной браузер отбрасывает целиком, поэтому перехода не было
  вовсе и ширина прыгала; на выпущенном рантайме замерено
  `transition-duration: 0s`. Теперь `--sf-duration-normal`: ширина заполнения
  проходит заметный путь, и быстрая ступень читается как скачок.
- Значок, слайдер и видеоблок уважают `prefers-reduced-motion`. Из двадцати
  шести подвижных компонентов это были единственные три, которые не спрашивали
  систему. Важнее всего значок: `fa-spin 2s infinite` и `fa-pulse 1s infinite`
  — бесконечное вращение, которое нельзя было остановить настройкой.
- `--sf-on-disable` в светлой теме поднят с 24% до 80% нейтрального. Было
  1,34 : 1 к странице против 4,12 : 1 в тёмной теме; стало 3,10 : 1. В светлой
  теме пропадала не только выключенность, но и значение: у отмеченного
  заблокированного флажка галочка давала 1,31 : 1. Прозрачностью мельче это не
  закрывалось — `neutral-50` на белом даёт 4,47 : 1 даже сплошным.
  `--sf-outline-disable` поднят туда же: у включённого контрола граница
  действительно светлее текста, но разрыв между `--sf-outline` и
  `--sf-on-surface` несопоставимо уже, чем между 24% и 80%, и обведённое
  выключенное поле оставалось без видимого контура.
- Выключенный элемент больше не красит свой текст ролью заливки. `--sf-disable`
  — это двенадцать процентов нейтрального, подложка вместо фона; `--sf-on-disable`
  — чернила на ней. Тринадцать объявлений у флажка, радио, переключателя и
  тумблера брали подложку для подписи, описания и глифа. На выпущенном рантайме
  подпись выключенного флажка давала 1,15 : 1 к светлой странице: это не
  приглушённый текст, а отсутствующий.
- Отмеченный и при этом выключенный элемент теперь выглядит выключенным.
  Правило включённого состояния у флажка и радио ничем не ограничивалось, и
  заблокированная отметка рисовалась полным `--sf-primary`: на обеих темах она
  была неотличима от той, которую можно снять. У переключателя такое
  ограничение было с самого начала — флажок и радио теперь делают то же.
  Точка радио остаётся круглой в любом состоянии: форма принадлежит выбору,
  цвет — состоянию. Каждое состояние подписи держит свою ветку правила:
  объединённое `:has(input:disabled)` весит на класс меньше соседнего правила
  покоя и проигрывает ему.
- `--sf-label-large` зафиксирован на 14/20 в обоих режимах. Прежде он стоял на
  адаптивной ступени и рос как абзац — 12/16 на узком экране, 14/20 на широком,
  из-за чего совпадал с утилитой `text-small` и выпадал из собственного
  семейства. Подпись привязана к контролу, а контрол своего размера от ширины
  экрана не меняет. На узком экране подпись стала крупнее.
- Интерлиньяж заголовков: три ступени из двенадцати стояли вплотную к кеглю —
  `title-2` 16/16 в мобильном режиме, `title-1` 16/16 в десктопном, `title-5`
  22/24. При таком отношении выносные элементы переносимого заголовка задевают
  следующую строку. Все три подняты в общую полосу 1.11–1.20, остальные не
  тронуты.
- Приглушённый текст на поднятой поверхности больше не берёт одно значение на
  все ступени: в тёмной теме оно давало 4.14:1 на второй ступени и 2.93:1 на
  четвёртой при требуемых 4.5. В светлой теме ничего не изменилось — там
  поднятая поверхность остаётся обычной.
- Подпись и плейсхолдер выпадающего списка, а также подпись шкалы прогресса
  переведены с `--sf-on-surface-muted` на `--sf-on-surface-variant`. Прежняя
  роль даёт 3.18:1 в светлой теме и 2.92:1 в тёмной при требуемых WCAG 1.4.3
  четырёх с половиной; у соседнего поля ввода те же элементы уже брали
  проходящую роль.
- Значок ошибки в поле ввода красится ролью ошибки, а не приглушённо-серым:
  рамка, подпись и маркер обязательности уже были красными.
- Верх шкалы скруглений подогнан под лестницу отступов: `--sf-radius-2`
  12/16px, `--sf-radius-3` 16/24px, `--sf-radius-4` 24/32px (моб./десктоп).
  Прежние 10/12, 20/24 и 36/48 удваивались за шаг, тогда как отступы росли
  ровно, и `p-N radius-N` выглядело совпадением, а не одним решением. Угол
  ничего не обрезал и раньше: геометрия допускает радиус до 3.4× отступа.
- Радиусы по умолчанию подняты на ступень: контрол с `--sf-radius-1\/3` на
  `--sf-radius-1\/2` (2px → 4px), блок с `--sf-radius-default` на
  `--sf-radius-1` (4px → 8px). Контрол остаётся вдвое мельче блока. Роли стоят
  на ступенях шкалы, а не на примитивах, поэтому перенастройка шкалы их несёт.
  `--sf-radius-default` не менялся и радиусу блока больше не равен.
- Smart-элементы `sf-checkbox`, `sf-radio` и `sf-switch` принимают размеры `1`
  и `2` — те же, что рисуют стили. Прежний закрытый список `1/3` и `1` расходился
  с лестницей: `size="1/3"` давал класс, которого нет ни в одном стиле, и
  контрол молча садился на базовый размер, а `size="2"` отвергался.
- Страница без `window.sfPath` по-прежнему берёт файлы из
  `cdn.jsdelivr.net/gh/simai/ui@main`, но теперь пишет об этом в консоль. Ветка
  незакреплённая: проект в этот момент показывает не ту сборку, которую
  выпустил, и по экрану это не отличить.
- Рантайм поднимается внутри `srcdoc`-фрейма. Путь `sfPath` разрешался
  относительно `window.location.href`, а там это `about:srcdoc` — база, к
  которой относительная ссылка не приводится. Первая же строка рантайма падала,
  и ни один компонент не регистрировался: живые примеры документации рисовали
  любое состояние, которое ставит JS, в состоянии покоя.
- Ступени высоты в тёмной теме сдвинуты на одну вверх. Первая стояла на
  `--sf-surface-1`, а это 1.10:1 к странице: на большой залитой площади подъём
  не читался. Теперь первая стоит на `--sf-surface-2` (1.25:1), четвёртая — на
  `--sf-surface-5`, и каждая ступень выше предыдущей.
- Граница контрола везде сплошная `--sf-outline`. Поле ввода, многострочное
  поле, выпадающий список, счётчик и телефон брали полупрозрачную роль, которая
  даёт 1.34:1 к светлой поверхности при требуемых WCAG 1.4.11 трёх.
- Полупрозрачная `--sf-outline-variant` остаётся краю области и линиям внутри
  неё, где опознавать нечего.
- Толщина границы везде `--sf-px`. В одиннадцати файлах стояла `--sf-a1` в
  `rem`, и такая рамка толстела вместе с кеглем. Ещё десять объявлений в
  выпадающем списке, загрузке файла и точках слайдера прятались в запасном
  значении вида `var(--sf-thing--width, var(--sf-a1))` — правило их не
  охватывало, теперь охватывает.
- Кольцо фокуса: сплошной цвет вместо 24% прозрачности, два пикселя вместо
  четырёх и пиксель зазора вместо нуля. Прежнее кольцо давало 1.4:1 к светлой
  поверхности при нужных 3:1, а вплотную тонуло в заливке того же цвета.
- Залитый элемент рисует внутри вторую линию чернилами своей подписи: цветом
  кольца, выбранным под поверхность, от светлой заливки не отделиться.
- Компонент, который рисует кольцо на видимой обёртке, снимает его с контрола
  внутри. Поле ввода, телефон и выпадающий список рисовали по два кольца.
- Бегунок переключателя едет сдвигом, а не сменой выравнивания, которую браузер
  не анимирует: раньше он прыгал, пока заливка плавно перетекала.
- Дорожка переключателя ростом со строку своего размера и длиной вдвое — как
  коробка флажка; мобильная геометрия выводится из режима.
- Ручка ползунка диапазона встаёт на значение, которое показывает: она стояла
  на сто процентов правее при любом значении.
- Обычный runtime Framework переведён на собственный JavaScript без внешних библиотек.
- Подсветка кода, маски, диапазоны и движок слайдера сохраняют публичные сценарии на собственной реализации.
- Lit остаётся единственной runtime-зависимостью и используется только Smart-компонентами.

### Удалено

- `sf-table`, `sf-data-view`, `sf-property-view` and `sf-admin-menu` leave the free Framework for SIMAI Framework Pro (`simai/ui-pro`), a separate distribution a page declares as the package `pro` (`SF_BOOT_CONFIG.packages.pro = {base}`), released against a named free release. Their folders and rules are no longer in `distr/smart` or `distr/rule`; `contracts/packages/pro.package.json` names them. The public ports and conformance kits stay free and move to `distr/core/contracts/ports/<port>/<version>/`. The field renderer set and the composition editor parts stay free; `option-badge.js` moved into the free renderer set.

- Ступень `--size-1/3` у флажка, радио и переключателя: в мобильном режиме она
  совпадает с соседней, а ступень мелкого контрола нужна, чтобы совпадать с
  полями и кнопками в той же форме. Замена — `--size-1` или `--size-2`.
- Встроенные сторонние runtime-файлы, SVG-флаги и комплект шрифта Inter; проекты могут подключать собственные флаги и шрифты.

## [5.7.0] - 2026-09-10

### Добавлено

- Канонические `justify-start`, `justify-end`, `justify-center`,
  `justify-between`, `justify-around` и `justify-evenly` с сохранением
  совместимых `content-main-*`.
- Канонические `gap-*`, `row-gap-*`, `col-gap-*`, `h-min`, `h-max` и
  `isolation-auto`; ранее опубликованные псевдонимы остаются совместимыми.
- Контракты адаптивной размерной системы, UI Heights, семантического ритма
  контента, container queries и логических сторон.
- Автоматическая матрица CSS ↔ Loader для base, responsive, state и
  отрицательных форм.

### Изменено

- Все 643 Utility rules сопоставляются по целому class-token и не срабатывают
  по части постороннего имени.
- Отрицательные responsive/state-модификаторы используют единый порядок вида
  `md:-m-1` и `hover:-translate-x-1`.
- Размеры компонентов и Smart Components приведены к rem/token-only контракту;
  физический пиксель остаётся единственным системным примитивом hairline.
- Production Asset Planner использует ту же точную token-based семантику, что
  и браузерный Loader.

### Совместимость

- Проверены 472 legacy-записи; публичные пути и совместимые имена сохранены.
- Совместимая Smart-поставка — `simai/ui-smart` `v5.5.0`.

## [5.6.2] - 2026-09-06

### Изменено

- Admin Menu использует содержательную навигационную структуру и растёт по
  содержимому, если высота контейнера явно не ограничена.
- Context Menu получил согласованное позиционирование, focus-visible и
  RTL-поведение для контекстных действий Admin Menu.
- Smart-зависимости Admin Menu и Context Menu закреплены в release-contract.

### Исправлено

- Floating panels (dropdown lists, menus, tooltips, date panels) stay aligned
  with a field that sits near the viewport edge. Positioning kept a flat 12px
  away from the inline edges, so a field closer than that had its panel pushed
  inward and overhanging it on the other side; every documentation example
  showed it. A panel may now reach the edge its field reaches.

- Скрипт дерева грузится, когда `sf-tree` стоит первым классом. Правила `tree` и
  `tree-item` искали класс после пробела или `^`, а `^` без флага `m` — начало
  всей разметки, а не значения атрибута, поэтому `class="sf-tree"` и
  `class="sf-tree flex"` не совпадали. С июня дерево в такой разметке не
  раскрывалось с клавиатуры и не получало ролей групп.

- Доступность по итогам проверки axe всех примеров компонентов (WCAG 2.1 A/AA):
  выпадающий список больше не пишет `aria-expanded` и `aria-disabled` на
  корневой `div` — состояние живёт на триггере; поле кода страны с одной
  страной не оставляет подпись и `aria-disabled` на элементе без роли;
  полосы загрузки файлов называются по файлу; флажки выбора в Smart-таблице
  получили имена («Выбрать все строки», «Выбрать строку: …»), а `sf-checkbox` —
  свойство `ariaLabel`; у вкладок-иконок имя перешло с хоста на внутреннюю
  кнопку; узлы дерева, вложенные прямо в узел, собираются в группу с ролью
  `group` и отступом.

- Утилиты типа градиента (`gr-line-2`, `gr-radial-3`, `gr-conic-2` и т. п.)
  больше не тянут за собой группу `gradient-color-ext`, удалённую в феврале
  2024 года. Каждая страница с такими классами получала два ответа 404 и
  предупреждение загрузчика о стилях в консоли.

- Маску можно записать сырыми цифрами: `unmaskedValue` получил сеттер. Поле кода
  страны отдаёт маске цифры значения, с которым пришла страница; присваивание
  уходило в исключение — модули строгие, — и дальше по тому же `try` пропадали
  переформатирование и сверка обязательности. В консоли это было видно как
  `SF.CountryCode mask init failed`.

- Устранено ложное ограничение высоты и впечатление «сломанного» меню в
  обычном потоке страницы.
- В публичном Loader сохранено обнаружение компонентов `file-preview` и
  `link`, входящих в compatibility-контур поставки.

### Совместимость

- Публичные классы Admin Menu и Context Menu, Loader API, `sfPath` и
  `sfSmartPath` сохранены.
- Совместимая Smart-поставка — `simai/ui-smart` `v5.4.1`.

## [5.6.1] - 2026-09-02

### Изменено

- Accordion и его панель используют базовую типографику интерфейса
  без локального уменьшения текста.
- Клавиатурный focus для Accordion и Button Group строится из общего
  `--sf-ui-focus-inset` и не ломает геометрию состыкованных элементов.
- Для индикатора состояния добавлен вариант «плюс/минус».

### Исправлено

- Focus-ring появляется только при `:focus-visible`, а не после обычного
  клика мышью; forced-colors имеет отдельный контур.
- Режим одного открытого раздела принимает короткий `data-mode="single"`;
  прежний атрибут сохранён как адаптер совместимости.

### Совместимость

- Публичные пути, Loader API, `sfPath`, `sfSmartPath`, Core и состав
  дистрибутива не изменились.
- Совместимая Smart-поставка остаётся `simai/ui-smart` `v5.4.0`.

## [5.6.0] - 2026-09-02

### Добавлено

- Аккордеон поддерживает независимое раскрытие и режим одного открытого
  раздела через `data-sf-accordion-mode="single"`.
- Добавлены заполненная, контурная `sf-accordion--outline` и встроенная
  `sf-accordion--flush` поверхности с единым семантическим контрактом.

### Изменено

- Заголовок аккордеона использует отдельную нативную кнопку, а содержимое
  связано с ней через `aria-controls` и `aria-labelledby`.
- Один шеврон показывает состояние по модели вправо → вниз; RTL, focus-visible
  и `prefers-reduced-motion` обрабатываются без отдельной разметки.
- Заголовок и раскрытая панель разделены постоянной границей, а внутренние
  отступы, типографика, цвета и радиусы используют семантические токены
  Framework.

### Совместимость

- Прежняя разметка без `.sf-accordion-trigger` продолжает работать через
  ограниченный legacy-адаптер.
- Loader, `sfPath`, `sfSmartPath` и пути существующих ресурсов не изменены.
- Совместимая Smart-поставка остаётся `simai/ui-smart` `v5.4.0`.

## [5.5.0] - 2026-09-01

### Добавлено

- Production-сборка может поставлять хешированные подмножества Material Icons,
  сформированные общим генератором Framework из фактически используемых
  иконок.
- Для семейств `rounded` и `sharp` добавлены точные локальные fallback-шрифты;
  `outlined` продолжает использовать локальный
  `MaterialSymbols-Outlined.woff2`.

### Изменено

- Loader ведёт отдельный совокупный набор для каждого семейства иконок и
  атомарно заменяет шрифт только после проверки нового manifest и `FontFace`.
- `localStorage` остаётся ускоряющим кешем, но не источником корректности.

### Исправлено

- Удалён сетевой fallback на `@latest`: при недоступности сервиса Loader один
  раз сообщает диагностику и использует полный шрифт из точной локальной
  поставки Framework.

### Совместимость

- Обычная разметка, `sfPath`, необязательный `sfSmartPath`, `core.css`,
  `core.js` и динамический режим Loader не изменены.
- Проекты без production Asset Planner продолжают работать по прежней схеме.
- Существующие runtime-пути сохранены через проверенный legacy-контракт
  `v5.4.1`.

## [5.4.1] - 2026-08-30

### Добавлено

- Авторитетный registry builder формирует нейтральный
  `contracts/generated/documentation-source.json` для контроля документации
  Core, utilities, компонентов и Smart Components без второй ручной базы.
- В публичном контракте дизайн-токенов закреплены разные зоны применения
  `--sf-radius--ui` и `--sf-radius-default`.

### Исправлено

- Компоненты `file-preview` и `link`, уже присутствующие в distribution,
  включены в loader registry и машинный документационный контракт.

## [5.4.0] - 2026-08-28

### Добавлено

- Необязательный production Asset Planner анализирует готовый HTML через
  существующий `distr/rule/rule.json`, раскрывает зависимости и формирует
  точный детерминированный список ресурсов первого кадра.
- План содержит совместимый handoff для `window.SF_PRELOADED`; динамический
  Loader и привычные `sfPath`/`sfSmartPath` остаются без изменений.
- Для недоступного статическому анализу ресурса первого кадра поддержан
  необязательный `data-sf-require`.
- Добавлены fail-closed проверки traversal, symlink, hardlink, UTF-8, размера,
  конфликтов регистра и неизвестных зависимостей.
- При активном `SF_PRELOADED` Loader больше не подмешивает кеш списка модулей
  предыдущей страницы из `localStorage`; no-build режим и позднее динамическое
  обнаружение DOM остаются совместимыми.
- Добавлен метрически совместимый локальный fallback для Inter. Он сохраняет
  естественную высоту и ширину текста до готовности webfont и предотвращает
  перестроение шапки и навигации без фиксированных размеров или скрытия body.
- Inter использует `font-display: optional`: холодная страница не выполняет
  позднюю подмену шрифта, а следующие страницы используют уже кешированный
  Inter без изменения привычного подключения Framework.
- Highlight поддерживает необязательный `data-sf-highlight-chrome="static"`:
  если приложение заранее отрисовало оболочку блока кода, Framework добавляет
  только подсветку синтаксиса и не перестраивает геометрию блока.
- Неопределённый `sf-icon` резервирует итоговый размер до регистрации, а Menu
  переносит существующие серверные иконку и подпись в рабочую оболочку без
  добавочного flex-зазора. Гидратация сохраняет геометрию первого кадра.
- Добавлены обычный и Smart Button Group, общий доступный контракт для Input и
  Textarea, а также актуальные Studio manifests и fixtures.
- Стандартный загрузчик заменён компактным theme-safe кандидатом №2: размер
  `48px`, цикл `1800ms`, размах `6px`, поворот `90°` и поддержка
  `prefers-reduced-motion`.

### Совместимость

- Привычные `sfPath`, `sfSmartPath`, `core.css` и `core.js` сохранены.
- Проекты без production-сборки продолжают использовать динамический Loader.
- 484 исторических runtime-файла сохранены через проверенный digest-bound
  compatibility contract.

## [5.3.2] - 2026-07-11

Patch-релиз локальной и детерминированной поставки шрифтов.

### Исправлено

- Удалён внешний `@import` Google Fonts из `component/doc/css/doc.css`.
- Документация и source-примеры используют локальный SF5 token
  `--sf-mono`, поставляемый вместе с runtime.
- SF5 больше не выполняет внешний запрос к `fonts.googleapis.com` при
  загрузке компонента `doc`.

### Собранные файлы

- Обновлены `distr/component/doc/css/doc.css` и воспроизводимый
  `distr/component/doc/css/doc.css.gz`.

### Совместимость

- Публичные CSS-классы и пути не изменены.
- Совместим с `simai/ui-smart` `v5.3.0`.

## [5.3.1] - 2026-07-11

Patch-релиз SFLoader для конкурентной загрузки зависимостей smart-компонентов.

### Исправлено

- `addScript()` и `addStyle()` возвращают одну общую promise для одинакового
  versioned URL вместо повторного добавления DOM-узла.
- Ошибка загрузки очищает promise-карту и не блокирует последующий retry.
- `sf-table` с параллельными relation-цепочками не создаёт дублирующиеся
  `script[src]` и `link[href]`.

### Собранные файлы

- Обновлены `distr/core/js/core-loader.js` и
  `distr/core/js/core-loader.js.gz`.

### Совместимость

- Совместим с `simai/ui-smart` `v5.3.0`.
- API и структура public paths не изменены.

## [5.3.0] - 2026-07-01

Minor-релиз SIMAI UI Core с обновлением собранного SF5-дистрибутива из `sf5.webpack`.

### Добавлено

- Добавлены component assets для `file-preview`.
- Добавлены component assets для `link`.
- Добавлен новый core runtime chunk `distr/core/js/556.js`.

### Изменено

- Обновлены core runtime assets: `core.js`, `core-loader.js`, `core-rules.js`, `smart-base.js`.
- Обновлены правила загрузчика: `distr/rule/rule.json`, `distr/rule/js/rule.js`.
- Обновлены component assets для `avatars`, `country-code`, `dropdown`, `featured-icon`, `file-upload`, `inputs`, `toggle`.
- Обновлен `distr/monaco-css-vars.json`.

### Собранные файлы

- Состав дистрибутива: `2725` файлов, `714` CSS, `995` JS, `689` gzip-артефактов, `27` JSON, около `379 MB`.
- Добавлены/обновлены файлы в `distr/core/`, `distr/component/`, `distr/rule/`.

### Установка

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui@v5.3.0/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui@v5.3.0/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui@v5.3.0/distr/core/css/core.css">
```

## [5.2.0] - 2026-06-20

Minor-релиз SIMAI UI Core с обновлением собранного SF5-дистрибутива из `sf5.webpack`.

### Добавлено

- Добавлены новые runtime chunks и обновленные smart/component assets для текущей ветки SF5.
- Добавлена поставка smart-editor/editor assets и обновленные assets для textarea/editor сценариев.
- Обновлены metadata и правила загрузчика для smart-компонентов, включая `sf-table`, `sf-datepicker`, `sf-dropdown`, `sf-list-item`, `sf-range-slider` и связанные зависимости.

### Изменено

- Обновлены собранные CSS/JS core, component, smart-component и utility assets.
- Обновлены стили и поведение модальных окон, dropdown/context-menu portal-сценариев, таблицы, datepicker, range-slider, avatar/list-item/checkbox цепочки и theme-builder.
- Обновлены utility-правила и CSS assets, включая transition/translate/position/neutral/theme-related изменения.
- Обновлен `distr/monaco-css-vars.json`.

### Исправлено

- Сохранено корректное правило `cl-table`: smart-компонент `sf-table` грузит CSS из smart-слоя и не содержит relation на несуществующий обычный компонент `table`.
- Обновленные правила загрузчика не должны возвращать лишний запрос к `distr/component/table/css/table.css`.

### Собранные файлы

- Состав дистрибутива: `2693` файлов, `712` CSS, `989` JS, `682` gzip-артефактов, `18` JSON, около `49 MB`.
- Добавлены/обновлены файлы в `distr/core/`, `distr/component/`, `distr/utility/`, `distr/rule/`, `distr/fonts/`, `distr/source/`.

### Установка

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui@v5.2.0/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui@v5.2.0/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui@v5.2.0/distr/core/css/core.css">
```
## [5.1.2] - 2026-06-11

Patch-релиз SIMAI UI Core с исправлением правила загрузки smart-компонента таблицы.

### Исправлено

- У `cl-table` удалена ошибочная relation на несуществующий обычный компонент `table`.
- Для `cl-table` включен явный `css: true`, чтобы CSS таблицы загружался из smart-слоя.
- Исправлен лишний запрос к `distr/component/table/css/table.css` при использовании `sf-table`.

### Собранные файлы

- Обновлены `distr/rule/rule.json`, `distr/rule/js/rule.js` и `distr/rule/js/rule.js.gz`.

### Установка

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui@v5.1.2/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui@v5.1.2/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui@v5.1.2/distr/core/css/core.css">
```

## [5.1.1] - 2026-06-11

Patch-релиз SIMAI UI Core с исправлением загрузки CSS для smart-компонентов в standalone loader.

### Исправлено

- Для `type: "smart"` и `mode: "smart"` CSS больше не грузится по умолчанию.
- Smart CSS теперь загружается только при явном `css: true` в rule/module metadata.
- Исправлены лишние 404-запросы к `/smart/<component>/css/<component>.css` и `/smart/<component>/css/<component>.min.css` для smart-компонентов, у которых CSS находится в обычном component layer.

### Собранные файлы

- Обновлены `distr/core/js/core-loader.js` и `distr/core/js/core-loader.js.gz`.
- Состав дистрибутива не изменился: `2693` файлов, `712` CSS, `989` JS, `682` gzip-артефактов, `18` JSON, около `49 MB`.

### Установка

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui@v5.1.1/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui@v5.1.1/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui@v5.1.1/distr/core/css/core.css">
```
## [5.1.0] - 2026-06-11

Minor-релиз SIMAI UI Core с новыми smart/component assets, обновленным loader/runtime и расширенными utility-модулями.

### Добавлено

- Зафиксирована релизная версия `5.1.0`.
- Добавлены собранные компоненты `admin-menu`, `datepicker`, `tree`, `tree-item`.
- Добавлены новые core chunks: `distr/core/js/358.js`, `distr/core/js/438.js`, `distr/core/js/904.js`.
- Обновлены smart metadata и runtime assets: `distr/smart-component-meta.json`, `distr/core/js/smart-base.js`, `distr/core/js/core-loader.js`, `distr/core/js/core-rules.js`.
- Добавлены release notes: [docs/releases/5.1.0.md](docs/releases/5.1.0.md).

### Изменено

- Обновлены собранные CSS/JS обычных компонентов, включая buttons, checkbox, context-menu, dropdown, inputs, modal, pagination, range-slider, slider, tabs и tags.
- Расширены utility-модули `flex`, `align-content`, `headers`, `transform-translate`, `transform-translate-ext`, `transition-property`.
- Обновлены `distr/core/css/core.css`, `distr/core/css/utility.full.css`, `distr/rule/rule.json`, `distr/monaco-css-vars.json`.

### Собранные файлы

- `distr/core/` - core runtime, loader, smart runtime assets и базовые стили.
- `distr/component/` - обычные UI-компоненты и component assets, включая компоненты, используемые smart-слоем.
- `distr/utility/` - utility CSS/JS модули.
- `distr/rule/` - правила загрузчика.
- `distr/fonts/` - шрифты и font assets.
- `distr/source/` - служебные source/meta assets.

Состав релиза: `2693` файлов, `712` CSS, `989` JS, `682` gzip-артефактов, `18` JSON, около `49 MB`.

### Установка

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui-core@v5.1.0/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui-core@v5.1.0/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui-core@v5.1.0/distr/core/css/core.css">
`

## [5.0.0] - 2026-05-13

Первый формальный релиз SIMAI UI Core как статического дистрибутива.

### Добавлено

- Зафиксирована релизная версия `5.0.0`.
- Описана установка через CDN с pinned tag `v5.0.0`.
- Описана локальная установка через каталог `distr/`.
- Добавлены release notes: [docs/releases/5.0.0.md](docs/releases/5.0.0.md).
- Utility-стили помещены в CSS cascade layer `sf.utilities`, чтобы утилиты участвовали в общей системе слоев SF и не перекрывали компонентные стили вне ожидаемого порядка cascade.

### Собранные файлы

- `distr/core/` - core runtime, loader и базовые стили.
- `distr/component/` - обычные UI-компоненты.
- `distr/utility/` - utility CSS/JS модули.
- `distr/rule/` - правила загрузчика.
- `distr/fonts/` - шрифты и font assets.
- `distr/source/` - служебные source/meta assets.



### Установка

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui-core@v5.0.0/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui-core@v5.0.0/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui-core@v5.0.0/distr/core/css/core.css">
```
