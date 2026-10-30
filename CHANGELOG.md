# Changelog

Все заметные изменения SIMAI UI Core фиксируются в этом файле.

Формат версий: `major.minor.patch`. Для ветки SIMAI Framework 5 мажорная версия начинается с `5`.

## [Unreleased]

### Добавлено

- The larena package reference names sf-mail-library and sf-mail-letters, moved from simai/ui-mail to simai/ui-pro (D31). core.runtime 1.8.1.
- The workspace layout, core.styles 1.1.0 and core.runtime 1.8.0: rail, list, main and panel by the width of the container, never the viewport. Below the wide width the open panel is a drawer over main (inert regions, Escape, scrim, focus back to the opener), below the split width one region shows at a time with a back control. SF.workspace(element), the data-sf-workspace-* attributes, sf-workspace-view and sf-workspace-panel, six public variables.
- smart.badge 1.2.0: activity (running, waiting, done, stopped, failed; an icon or spinner and a word in the page language, activity wins over status) and compact (the icon alone, the word as the accessible name). component.badges 1.1.0.
- sf-tag 1.1.6: the remove button keeps to the label line. A removable tag is as tall as a plain one at every size (it was taller at 1/3, 1/2 and 2), the mark scales with the size, the hit target stays 24 by 24 px and clear of the label on interactive and checkbox tags. Visible on every page with removable tags. sf-lookup 1.0.2: chip rows keep their hit targets apart when they wrap.

- smart.lookup 1.0.0: sf-lookup, a form field that picks people or objects from a search the host answers through a provider function (query, {cursor, limit, signal}); rows with avatar, name and caption, chosen items as removable sf-tag chips, single and multiple, max-items with a visible refusal line, exclude, inline options searched in place; states hint, searching, nothing found, unavailable, error with retry; the combobox pattern. Frame identical to sf-input. simai.property-view-port 1.17.0: propertyType html is formatted text, edited with sf-rich-text and viewed cleaned (field renderers module 1.2.0). core.runtime 1.7.1.
- sf-contents 1.0.0: the page's table of contents. Layouts column, compact, rail and bar, plus auto (column on wide screens, compact below the collapse step). Collects headings from a target or takes server-printed links; scroll-spy with aria-current, smooth scroll respecting reduced motion, the hash follows. Event sf-contents-change.
- sf-settings-menu 1.0.0: universal compact settings, a context-menu surface. Default template drill (value under the name, choice lists open in place, switches inline, fixed 280 px width), template rows (controls on the right: switch, quiet pills, compact select), optional tiles block. Settings are data; events sf-settings-menu-change/-changed/-apply/-reset and the overlay open/close pair.
- sf-search 1.0.0: the site search window («spotlight»): pill field and results card, switchable blocks (scopes, recent, popular, actions, path, keys), X clears then closes, full-screen sheet on phones. Results from a provider property or a static JSON index; sf-search-navigate is cancelable.
- sf-pager 1.0.0: neighbouring page or step by meaning. Appearances cards, row, steps (cancelable sf-pager-navigate, «Готово» on the last step), course and counter; cards and row print plain links.
- sf-button 1.2.0: the shortcut setting draws the key combination at the end (⌘ K on Mac, Ctrl K elsewhere, one box on every platform) and shortcut-listen presses the button on that combination; scheme on-surface-variant for a quiet field-like trigger (component.buttons 1.1.0).
- The first-paint snapshot tool keeps a page's own slotted child as the page's, not as the component's drawing (core.runtime 1.7.0).

- smart.rich-text 1.0.0: sf-rich-text, a form field for formatted text. The value is HTML of p, h2, h3, h4, strong, em, a[href], ul, ol, li, blockquote and br; a link keeps https:, mailto:, tel: or a /path on the site. Toolbar for block level, bold, italic, link, lists, quote, undo and redo; paste and drop are cleaned to the same subset, and so is the incoming value. Form-associated like sf-textarea (name, value, required, disabled, readonly, input and change); keyboard only, light and dark, ru and en. core.runtime 1.6.3.

### Исправлено

- component.range-slider 1.0.1: a tooltip label reserves its own room at first paint, so a printed slider with a tooltip is 54 px tall like the adopted one, not 44 px growing to 54.
- A trait's event is declared like any other: "shared": "<trait>" gives sf-<verb>. sf-input, sf-textarea, sf-dropdown, sf-color, sf-switch and sf-quantity declare sf-field-reset as their current event; sf-field:reset stays as its dated alias until 2026-12-01.

- The change journal records the thirty-nine dated event names of the SIMAI Pro chat components (record event-chat-vocabulary-names, removed after 2026-12-01), so the chat components in their standard 1.4 form pass change-lifecycle over a package.
- simai.dataview-port 1.13.0: query.count names the event the pagination sends today.

- table-frame 1.0.1: a cell keeps its words whole. The base typography's `word-break: break-word` on `table` broke a header inside a word in a narrow column («Парамет-р»); the table inside the frame sets `word-break: normal` and `overflow-wrap: normal`, and the frame scrolls instead.

- New utility table-frame 1.0.0 (class `table-frame` on a wrapper around a `.table`): a hairline frame with the surface corner that scrolls sideways; separate borders, gridlines after and under each cell, a filled head in the container's dimmed-text role; public variables `--sf-table-frame-*` for the colours and the ladder paddings (`core.runtime` 1.6.1).
- Theme 1.1.1: a choice button (`.sf-theme-button[data-theme]`) on an sf-icon-button or sf-button host stays a choice after the host has started and handed `data-theme` to the button it draws: its glyph no longer flips with the page, and a click chooses the theme instead of toggling it. The active look reaches an inner sf-icon-button too.
- sf-datepicker 1.2.0: `hint` and `hint-icon` are its settings, forwarded to the inner sf-input (`text-end` stays unsupported).
- sf-pagination 1.1.2: the utility hint names the pagination root again, and the docs promise the row's box the stylesheet publishes.
- A dated event name says which event it is an alias of; the change journal records the seventy-seven dated event names; the generated contract registry carries the manifests it describes; `x-words` names a string setting of its own file.

- New Smart component sf-site-header 1.0.0: one top bar for SIMAI sites -- brand, navigation, actions and tools, collapsing into a side panel on a narrow screen (layer stack, focus kept, Escape closes); gutters from .container.
- sf-color 1.3.0, variant theme: an icon-only palette button that opens the platform colour picker and rebuilds the page theme from the colour (SF.ThemePalette), with a reset to the original colour.
- SF.ThemePalette loads on its own: component theme-palette (SF.Loader.ensurePlugin('theme-palette') or data-sf-theme-palette); SF.Loader.ready hands over an API object as well as a class.
- Highlight 1.1.0: a line-wrap toggle beside copy (data-wrap, data-wrap-control); a block in a grid row shows all its lines; a block whose text comes later is highlighted.
- Theme 1.1.0: a toggle shows the theme it switches to (moon on a light page, sun on a dark one).
- sf-dropdown 1.4.6: options printed as an attribute are data, and a changed attribute redraws the list.
- sf-icon 1.1.4 keeps classes others put on the glyph; sf-button-group 1.1.4 and sf-color carry the value-missing words, asked only when a value is missing; sf-page-header 1.1.6.
- First-paint snapshots: a forwarded page mark no longer prints a drawn control as a page node (a doubled button in the page and site headers).

- Background effects (simai.effect 1.2.0): in auto a light-only effect stays light on a dark page, its area light, as a dark-only effect already stayed dark on a light one. The reason light-only-on-dark is gone; a fixed mode the effect cannot draw is still hidden (mode-not-drawable).
- Container (utility.container 1.1.0): a public --sf-container-gutter sets the gutter of every container and breakpoint container at once; unset, each keeps its width step. container-flush takes the gutter off one container (a nested one), and a container inside it keeps its own.
- sf-empty-state 1.1.5: the no-data wording is a finished sentence (ru «Записей пока нет» / «Они появятся здесь, когда их добавят»; en «No records yet» / «They will appear here once added»).
- sf-button 1.1.4: an emptied text attribute empties the button instead of falling back to a label taken from text children.

- The `larena` package reference: `cl-table` requires `smart.file-preview` and `smart.reference-link`, which the ui-pro table now loads with its rows instead of lazily (`core.runtime` 1.0.6). A package built on an earlier pair is refused by its receipt check.

- Smart base (`core.runtime` 1.0.5): a property set on an element before its class was defined now reaches the class's setter on the first connect. Before, the value stayed on the element and hid the setter, so a lazily registered child bound by a parent's template (`sf-profile-picker` inside `sf-property-view`'s configure bar) drew empty. A page that defined such components ahead of time as a workaround (`SF.createAsync` before the host renders, UI Chat q-a49e2045c1 item 1) can drop it.

- `sf-tree` 2.0.1: the manifest's `selection` enum is `none | one | many`, as the element takes since 2.0.0; `single` and `multiple` are declared former values until 2026-12-01, so the shared allowed-values check accepts `one`.
- `sf-pagination` 1.2.1: words a product registered under the old camelCase keys (`totalLabel`, …) through `SF.language.register` are said again until 2026-12-01, each old key noted once in `SF.deprecations`; register the kebab-case keys (`total-label`). Core: `pageWord` `former`, `elementFromManifest` `formerWords`.
- The former bundles `smart/inputs`, `buttons`, `icon-buttons`, `icons`, `badges` and `tags` load their element's new bundle until 2026-12-01 even when linked as a module script; link the new path or use the Loader.

- Studio fixtures give what their manifests declare (sf-badge appearance, sf-drawer size, sf-range-slider label, sf-accordion and sf-menu items as arrays), held by a contract test; every manifest's provenance names a public source revision (simai/ui-source#54).
- `sf-radio`: the selected mark is half its ring at every size (it was 12px at all three).

- Native (class-built) `checkbox` and `radio` apply the layout their stylesheets hint (utility maps, as buttons and inputs do): they draw like `sf-checkbox` and `sf-radio` — a 24×24 box and a selected mark on the line, an 8px gap — instead of a 2px ring and an empty mark (simai/ui-source#49, #50). Every `sf-checkbox` mark is its size's line at size 2 and 1/2 (#49).
- Native badge accepts `error` (`danger` stays as its former name) and is only as wide as its text, as `sf-badge` is (simai/ui-source#51).
- `sf-button-group` joins are 1px again: the join rules match `appearance` as well as the former `type` (simai/ui-source#52).
- The Native dropdown's search box no longer lets its own `change` out of the component (simai/ui-source#53).
- Scrollbar thumbs take one role and clear the 3:1 threshold.

- Fixed: taking an error back from `sf-input` (`invalid`, `error`, `setState({invalid})`) restores the valid border and removes `aria-invalid`; the shared field set's datetime editor marks and clears both of its fields.
- `sf-datepicker` takes `invalid` and `error-message`, and its calendar opens on the month of the value (a typed whole date is taken first; a range opens on its start; with no value, today's month; within min-date and max-date).
- The package reference for `larena`: the admin menu requires the empty state.

- Fixed: the package reference for `larena` declares that the property view requires `smart.help-mark` (a field hint opens on a press), so the package built against this release is accepted.

- Fixed four defects Larena's storage QA found (typed fields keep their own change, the closing modal is read correctly, and two more diagnosed from the sources).
- Fixed: a host data attribute (`data-*`) names one element, the one with a box, and that element can be focused; a change detail names its emitter.
- Fixed: the datepicker's template reads the read-only state the component resolves (a range field is always read-only).
- Fixed: with the icon subset disabled (`SF_BOOT_CONFIG.icons.enabled = false`), icons are drawn once the local font has loaded instead of staying invisible (simai/ui-source#15).

- Fixed: info is a status palette of #005bbe with a fixed hue and chroma, like error, warning and success, instead of a copy of the brand colour; under a red primary it read as danger. Every primary gives the same sixteen info tones (simai/ui-source#14).
- Fixed: `sf-resizer` takes its name and hint through the shared page language: it follows `SF.language.use()` live, reads words added with `SF.language.register('sf-resizer', …)`, and a name given in `label` stays the author's.
- Fixed: `sf-button` and `sf-icon-button` keep the `data-*` attributes written on the host (they are copied to the inner button, no longer moved), so `sf-button[data-…]` and `host.dataset` answer. A text child of `sf-button` is its label, after slot `text` and the `text` attribute.
- Fixed: `sf-sortable` puts its live region and instructions back when the host redraws the list, and after a keyboard drop returns focus to the moved item when it fell to the page.
- Docs: the `sf-file-upload` item shape and a browser-only import; what `type="pills"` paints and that a two-option switch is the segmented `sf-button-group`; how an app serves its own icons (`SF_BOOT_CONFIG.icons.enabled = false`). Reported by SIMAI Email Editor.

- Fixed: the Loader inserted a script once per plugin that named it, and every copy of the anchored-badge runtime ran its own observer, so a badge inside an aria-labelled link, button or avatar could append «, N непрочитанных» to its name without end until the tab stopped (ui-020f4a1acc31). Scripts and sheets now load once per URL through a registry shared by every bundle, the badge runtime runs once per page, and a name is written only when it changes.
- Fixed: the compact admin menu panel hides item words visually only, so items keep their names, and initials stay visible.

- Fixed: the `arc` spinner look is a fixed arc of 30% of the ring with round caps on the faint track, turning linearly once a second; its length never changes, which tells it from `breathing`. Reduced motion shows the same arc, still (simai/ui-source#13).

- The modal loading state speaks the page language: «Загрузка…» / "Loading…", and its load-error fallbacks are localised too, in both `sf-modal` and the component modal. The loading block is a status with that name. The English spinner label is "Loading…" with a real ellipsis.
- Fixed: a modal opened while its content was still preloading never showed the loading state, because the cancelled request cleared the new one's state.

- Fixed: without `window.sfPath` Core finds its `distr/` from the address of its own script (the npm package, a copy of `distr/` on the site), and the warning that remains for the rare case it cannot recommends the npm form (simai/ui-source#8). `?sf-debug` falls back to the minified form of any script that has no readable copy, so a page served from the npm package defines its Smart Components in debug.
- Fixed: the pagination wraps in a narrow column instead of putting «Показать ещё» over «Последняя».
- Changed: SIMAI is written in capitals in the live sources, schemas and messages.

- Fixed: a first visit sets bold Latin bold. The metric fallback `Inter Fallback`, used while Inter (`font-display: optional`) has not arrived, now has a bold face (Arial Bold at 550-1000) beside the regular one; bold Latin was drawn at 400 until Inter was cached.

- Fixed: `--sf-on-surface-container--variant` is neutral-35 (light) and neutral-80 (dark) and holds 4.5:1 on a container fill over any of the surfaces 0 to 3; the 40/70 pair fell to 4.25:1 over the brighter surfaces (simai/ui-source#3). The `bg-surface-container` utility switches the dimmed role over it, as `elevation-N` does.
- Fixed: initials in an avatar inside a tag take the primary role; two container fills stacked measured 3.6:1 in the dark theme (simai/ui-source#1).
- Fixed: `sf-quantity`'s steppers no longer flash the browser's grey button before the icon-button styles apply (simai/ui-source#2).

- Fixed: dimmed text on a container fill reads in the dark theme. A new role `--sf-on-surface-container--variant` (light neutral-40, dark neutral-70), and every component that lays `--sf-surface-container` under its content (avatar initials, tags, alerts, accordion, inputs, file preview, kbd and others) redefines `--sf-on-surface-variant` for it: neutral-60 there measured 4.0:1 over the page and 3.5:1 over surface-1, short of 4.5:1.
- Fixed: `sf-quantity` loads the icon-button styles of its steppers on a page planned from markup alone.

- Fixed: classes on inline SVG (`svg`, `g` and the shapes) load their utilities: `svg-*`, `fill-*`, `stroke-*`; the Loader used to skip `svg`, `path` and `g`.
- Fixed: a tonal error button (`sf-button--tonal sf-button--error`) takes the type and height of its size and the disabled look; `sf-button-state-loading` and `sf-icon-button-state-loading` draw the loading stripes.
- Fixed: `sf-button` reads `status="danger"` and `status="critical"` as `error` and notes them in `SF.deprecations`, as it now notes `icon-left`, `icon-right` and `tightness`.
- Fixed: `sf-datepicker` opens the week on any day, 0 (Sunday) to 6 (Saturday), by `week-start` or the page language (a Saturday-first locale got Monday).
- Fixed: an icon button sets a size class only for the sizes it draws (the closable tag's close is sized by `sf-close`).
- Changed: a role `--sf-surface-inverse-hover`; the carousel reads it instead of palette tones.
- Changed: the public JS API contract says when each name exists: the Loader's names (`SF.Loader`, `SF.create`, `SF.whenDefined`, `SF.loadSmartBase`, ...) at `sf-loader-init` (`core-loader`), not right after `core.js`. The `sfPath` warning names a released commit instead of a tag.

- Fixed: the composition modules shipped as source (`core/js/composition/*.mjs`) imported files the distribution did not hold (`schema-name.mjs`; `page-language.js` for inline-editor, overlay and sortable); they ship together now, and the build checks every such import. The runtime's own names on `window.SF` (`send`, `receive`, `runtimeModules`, `runtimeArrived`, `runtimeLoading`, `runtimeSettled`, `smartBaseAnnounced`, `litHtml`) live under `SF.__internal`, the old names noted as deprecated until 2026-12-01.

- A record field with many values (`choices`) wraps them, and no tag shrinks below its text.

- `simai.dataview-port` 1.12.0 pins the digest of its own conformance kit (44 cases); every port edition is now checked for it.

- Fixes from documentation trial 5: pinned `sf-tabs` stay first and cannot be dragged; the arrow keys reach «Ещё»; `sf-help-mark` does not make a field label row taller and has no duplicate title; the Loader keeps `items-*` as the Framework's place-items classes; `SF.Preferences` does not send an unchanged value to the host (the resizer no longer re-saves its width on load); the `sf-resizer` handle stands above a menu in its panel.

- The rest of documentation trial 4: `sf-datepicker` range `change` gives `date` and `isoValue` as the ISO interval `start/end`; `sf-copy-button` properties can be written; `sf-help-mark` no longer makes its label line taller; manifest examples use `status` instead of the deprecated `type`; the resizer manifest names its `sf-resizer/<key>` preference; `--sf-heading--font-*` are deprecated (read by no rule, compat until 2026-12-01).

- Fixes from documentation trial 4: theme buttons show the chosen mode; `cq-*:justify-*` works (the family is `cq-*:content-main-*`); `sf-resizer` keeps the remembered width after a stacked layout; `sf-tabs` lays «Ещё» out again on resize, hides an empty «Ещё» and keeps labels right after reordering; `sf-button appearance="ghost"` draws as `link` (compat name); the class tooltip does not repeat a trigger's name; `sf-datepicker`'s week follows the page's language when `week-start` is not set.

- A filter's option list says why it is empty («ничего не найдено» under a search, «нет данных» without one), and a list that could not load offers «Повторить», both as the inline `sf-empty-state`.

- A panel's head (`sf-context-menu` with tabs) is a row of its own — a control's height with space above it — and its line runs across the whole panel, under the close button too.

- The region skeleton (`[data-sf-region-loading]`) no longer pulses for a person who asked for reduced motion. Gzip files in the distribution are now the same bytes on every platform (ui-builder writes them with a fixed header and a pure-JavaScript deflate).

- The Loader works in a sandboxed iframe out of view (a documentation example below the fold): its work no longer waits for an animation frame that never comes, and it no longer stops on `localStorage` in a document sandboxed without `allow-same-origin` (it keeps its caches in memory there).

- The property registry lists only what the field renderers read, and they read all of it: `readonly` shows a field instead of a refusing control for every type; string and text take `placeholder`; date, choice, choices, the record picker and code take `required`. No longer listed: `multiple` for record, relation and user, `formats` for colour, `constraints` beyond a choice's options, `required` for a file. `SF.whenFieldRenderers()` loads the renderer set on demand and settles with `SF.fieldRenderers`.

- The Loader checks only the element whose attribute changed, not everything inside it: a list marking itself loading no longer makes the Loader walk all of its rows. Added nodes are deduplicated by walking up the parents. On the admin polygon a search spent about 56 ms in the Loader after the rows came; the probe `loader-attribute-scan` holds the rule.

- Field renderers: a text filter reads «Содержит…»; an options list in a filter window scrolls down only.

- `sf-tag` — no empty count element (and no band at the end of the tag) when there is no count.
- `sf-pagination` — «Показать ещё» stretches between the pages and the page size.

- `sf-datepicker` — a day caption (`sf-datepicker-day-info`) no longer lifts the number above the row; days of the neighbouring month are muted again (the colour now reaches the number), a neighbouring weekend is a muted red; the weekday row is a 1/2 control high.

- `sf-tabs` — the «Ещё (n)» trigger no longer wraps onto two lines and stands on the tab row like a tab, its bottom on the underline divider.

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

- A list's data can be asked for while its code is still loading (`core.runtime` 1.2.0, `SF.EarlyPort`). A page declares the list's port inside the element, as `<script type="application/json" data-sf-port>` with `port`, `version`, `url`, `capabilities` and `first: {intent, payload}`. Core sends that first call when it runs, before any component's code, and hands the element its port with `connect-port` when it is defined. The element's first matching call takes the answer, so there is one request. A call that differs (a page size kept in the browser, a search typed in the meantime) asks the host again; an early answer is never shown for another query. A malformed island is a console warning and changes nothing, and a page without one is unchanged. An island without `url` takes its port from `SF.EarlyPort.register(id, adapter)`; a product adapter with its own wire uses `SF.EarlyPort.take(…)` (`"connect": false`). The Loader asks for the list's parts first and the Smart base defines them in a batch of their own. sf-data-view 1.5.0 reads the same island for its capabilities and first query. See `docs/developer/early-port.md`.

- `simai.property-view-port` 1.16.0, backwards compatible with 1.15.0: optional field keys `mask` (the Framework mask grammar, as `sf-input` mask-pattern), `nullable` and `size` (`1/2`, `1`, `2`); choice fields take the variant `buttons`.
- `smart/field-renderers` 1.1.0: a string field with `mask` edits in `sf-input` with the mask, sends the value as shown, reports an incomplete value to its host and says «Заполните поле полностью» / "Complete the field"; a choice field with variant `buttons` edits as a segmented `sf-button-group` sized from `field.size`, cleared by pressing the chosen button again when not required.

- `SF.Assembly`, the assembly runtime of standard simai.smart-component 1.3.8 (§7, §9, §10, §11.2, §14): an assembly manifest runs as one element — keys with one writer and derived keys, roles bound to parts with constants, debounce, `if`/`hidden`, a role per entry and `start` now/visible/opened, layouts with `<x-role>`, rules with the closed steps, readings and conditions, turns with waiting steps, outcomes and `otherwise`, concurrency (parallel, queue, drop, latest), the cause chain limit, `connect-port` reaching parts at any depth, the instance's scope and a debug journal. Parts are any custom elements with a declared interface; today's components join through an adapter. Only a part's interface events stop at the assembly's frame; native `change` and `input` reach the page. The Loader defers code for an unstarted part (`[data-sf-start]:not([data-sf-started])`) the same way as for a closed container. The modules ship as source next to the core bundle (`distr/core/js/assembly/*.mjs`).

- New Smart components over existing class components, each with five to ten public CSS variables and nothing drawn differently: `sf-accordion` (sections from data or from `<details>`, single mode, sizes, WAI-ARIA accordion keyboard, `sf-accordion:toggle`), `sf-quantity` (a number field with steppers: spinbutton, locale-aware strict typing, bounds, hold to repeat, inherited value; the class quantity now sits on the size ladder; field-renderers variant `stepper`), `sf-code-input` (a one-time code over the class verification: one native input under the cells, paste and autofill, `sf-code-input:complete`), `sf-menu` (site navigation from data or nested links: vertical and horizontal, current page, collapse, disclosure keyboard, `sf-menu:navigate`, `sf-menu:toggle`).
- Package reference `larena` names `sf-message-log`, `sf-thread-list` and `sf-change-confirm`, the conversation components of simai/ui-pro.

- `sf-sortable` insertion point: with `inserter-items`, a «+» between rows (hover, focus, keyboard) opens a searchable inserter and fires a cancellable `sf-sortable-insert` with `{index, item, to}` (simai/ui-source#21).
- `sf-composition-overlay` framed mode: over a same-origin iframe canvas fed a flat node list (`frame`, `attachFrame`, `setNodes`), with hover and selection frames, a block toolbar, insertion points, plain-string inline editing (`sf-composition-overlay-edit`), scroll and resize sync and keyboard selection (simai/ui-source#22).
- New `sf-image-field`: one image in a form — thumbnail, name and size, «Заменить…», «Убрать», drag a file to replace — with ten public CSS variables; field-renderers edit a single `file` field with variant `image` through it (simai/ui-source#27).
- Inherited value across the input family (`sf-input`, `sf-textarea`, `sf-dropdown`, `sf-color`, `sf-switch`): `inherited-value` shows what the field falls back to, and a reset button fires a cancellable `sf-field:reset` (simai/ui-source#28).
- `sf-dropdown`'s trigger input carries the field's name from its label or the host's `aria-label`, `aria-labelledby` or `<label for>` (simai/ui-source#32).
- The selected segment of a segmented `sf-button-group` keeps `Highlight` / `HighlightText` in forced colours for every scheme (simai/ui-source#33).
- Authorship: the notice, the package author and the copyright in the distribution name Rim Zabarov as author and sole rightholder; the Core stylesheet header states the Apache License 2.0; `AUTHORS`, `CITATION.cff` and `REUSE.toml` in the source.

- Host port `simai.property-view-port` 1.14.0, backwards compatible with 1.13.0: a `lookup` field type (value `{value, label}`, a list when `multiple`; `field.source` names the host's reference source; inline `options` for short lists), `field.options` with optional `source` and `limit`, a save the host may ask to confirm (`refused` with reason `confirm_required` and `confirm: {summary, digest}`, re-sent with `confirm: "<digest>"`), and conditional fields `field.when` with `visible`, `required` and `enabled` condition trees.
- The renderer set `smart/field-renderers` draws `lookup` in view, table cell, edit and filter.

- A docked `sf-drawer` with room is a page column on `--sf-surface-0` without a shadow; when the host is too narrow it floats with the raised surface and a shadow. The docked-to-overlay point is set by `dock-breakpoint` or `--sf-drawer-dock-breakpoint` (default 48rem), and a `data-drawer="toggle"` button with `aria-controls` hides and shows a docked panel (simai/ui-source#26, #25).
- `sf-modal` footer actions sit at the end with `--sf-modal-footer-gap` between them (simai/ui-source#26).
- Paper state colours from the light scheme in both themes: `--sf-paper-primary`, `--sf-paper-outline`, `--sf-paper-hover`, `--sf-paper-select`; a single-section `sf-accordion` renders as a plain section (simai/ui-source#29).
- Layout tokens `--sf-layout-reading-width` (48rem) and `--sf-layout-floating-panel-width` / `-height` (400×680) (simai/ui-source#25).

- `sf-list-item` is the general list row: an optional supporting line, roving focus with one Tab stop (arrows, Home, End), rows that reorder inside `sf-sortable` and pinned rows without a handle (simai/ui-source#18, #29).
- `sf-drawer` opens as a bottom sheet, its panels stay under the app bar, and its close button yields to an outside switch that controls the panel (simai/ui-source#20, #29).
- Accessibility (simai/ui-source#25): field text is at least 16px on a touch phone, so iOS does not zoom on focus; default and tonal buttons keep an edge in forced colours; context-menu rows are 44px touch targets under a coarse pointer.

- `sf-accordion` sizes: `sf-accordion--size-1/3|1/2|1|2|3`, the header exactly the control height of the size, title, chevron and inline padding from the size (simai/ui-source#19).
- Theme roles `--sf-paper` / `--sf-on-paper` (the same in both themes, for an email or document canvas) and `--sf-surface-well` (a recessed surface behind a canvas) (simai/ui-source#24).
- Fixed: tab elements take their label's ink in both themes (no raw black/white); an `sf-input` value sits on the same line as `sf-textarea` and `sf-button` text at sizes 1/2 and 1 (simai/ui-source#23).
- Fixed: highlighted code no longer pulls the Doc component's styles, so its surface stays `--sf-surface-container` in the dark theme and plain identifiers are readable.
- Docs: `sf-file-upload` events are `:remove` / `:retry`; the dropdown `change` detail's `item` is the option's data.

- `sf-textarea` takes `appearance="flush"` (plain markup `sf-textarea--flush`): no border, fill, shadow, radius, inline padding or own focus ring, for a field inside a composite control whose wrapper draws the surface and shows focus with `:has(:focus-visible)`; auto-grow and the size ladder are unchanged (one row = the control height).
- The shared field set edits `datetime` fields as a day (`sf-datepicker`) and a time (`sf-input`, mask 00:00) on one row, labelled for assistive tech; ISO 8601 back, an untouched field writes nothing, partial input is a field error (`setFieldError`); `SF.fieldRenderers.dateTime` exposes split, compose and normalizeTime.
- Fixed: a `sf-datepicker` date given by the `value` attribute can be cleared (change with an empty value); typed dates must be one valid date in the field's format with a year of 1000–9999, so two glued dates are invalid input instead of a wrong date.

- `sf-textarea` can grow with its text: `auto-grow`, `min-rows`, `max-rows` (plain markup: `data-auto-grow`, `data-min-rows`, `data-max-rows`). One row is exactly the height of an input of the same size, each row adds that size's line height, the field scrolls inside past `max-rows` and shrinks back when text is deleted; CSS `field-sizing: content` where supported, a script fallback elsewhere; nothing changes during an IME composition (simai/ui-source#17).
- Fixed: Esc closes only the innermost open layer. With a datepicker calendar, a popover, a help mark, a context menu, a profile picker or the country-code list open inside a drawer, a modal or the property-view panel, Esc closes that popup and returns focus to its field; the next Esc closes the panel.

- `SF.ready` can be awaited: `await SF.ready` (or `SF.ready.then(fn)`) resolves with `window.SF` once the Loader has initialised (at `sf-loader-init`), so a module loaded after `core.js` finds `SF.loadSmartBase`; a late caller gets it already resolved. `SF.ready(fn)` keeps working and runs `fn` once the Loader is up and the document is parsed. Scripts that run before core queue a function with `(window.SF_ON_READY = window.SF_ON_READY || []).push(fn)`. One `SF.ready` per page however many core bundles load (simai/ui-source#16).

- Anchored badges: a count or a dot attached to an avatar, an icon, an icon button or any element wrapped in `.sf-badge-anchor`, placed by the SIMAI Framework at the top end — on the circle at 45° for a round anchor, at the corner for a square one — with a ring in the surface colour. The size follows the anchor (1/3 and 1/2 show a dot, 1–3 small, medium and large counts), `99+` by default (`data-cap`), `0` hides it, and the count joins the anchor's accessible name («Анна Белова, 3 непрочитанных»). `sf-avatar`, `sf-icon` and `sf-icon-button` take `badge-count`, `badge-dot`, `badge-cap` and `badge-label`; `sf-menu--compact` and the compact admin menu panel move an item's counter onto its icon (simai/ui-source#12).

- Added: `sf-button-group` takes `radius="default|square|rounded"` (in the segmented look the plate takes the button's radius and the track adds its padding; `--sf-button-group-radius`), `name` (the value is submitted with its form and restored on reset), and `theme-switch`: `<sf-button-group appearance="segmented" theme-switch>` draws three icon-only items (system, light, dark), shows the Loader's theme preference and sets it through `SF.Loader.setTheme`.
- Fixed: an effect area or window card that takes a theme also sets the text colour of that theme (`sf-effect-area`), so text over a dark effect on a light page is light (simai/ui-source#7). `SF.Effects.EFFECT_FORMAT` gives the effect format as a name and `schema_version`; `EFFECT_SCHEMA` is deprecated until 2026-12-01.

- Added: foreign background effects (an effect.json address outside the pinned catalogue, or a pair given by address) run in a sandboxed frame instead of being refused: an `<iframe sandbox="allow-scripts">` with an opaque origin and a strict content security policy (no network, no storage, no page or top access), the module delivered over a MessagePort and imported inside the frame, checked settings and palette tones passed by message. `SF_BOOT_CONFIG.effects.foreign = 'sandbox' | 'refuse'` (default `sandbox`); handles report `sandboxed`; `SF.Effects.foreignMode` and `SANDBOX_RUNNER_SHA256` (a page with its own CSP allows that hash and `blob:` in `script-src`). A catalogue effect's pair given by address runs in the sandbox, never inline. The effect kit takes `--sandbox`.

- Added: a write-only password field, `propertyType: "string"` with `variant: "password"`. Editing shows an empty password input (`autocomplete="new-password"`) with a show/hide button; viewing, a table cell and read-only show only «Задан / Не задан». The host sends `value: {set: true|false}` and never the password; an untouched field sends nothing, a typed one sends the new value.

- Added: `sf-button-group appearance="segmented"`: a sunken track, borderless segments and a selected plate (`plate="scheme|raised"`), a per-item `count`, icon-only items (`icon-only` with an accessible name), `full-width`, the button size ladder, and unselected text at 4.5:1 or more over the track on the surfaces 0 to 3 (simai/ui-source#4). The group keeps its radiogroup behaviour. Six public CSS variables (`--sf-button-group-background-color`, `-padding`, `-color`, `-plate-background-color`, `-plate-color`, `-count-color`).

- Added: `SF.Effects` places effects under the theme policy of `simai.effect` 1.1: `pageScheme`, `allowedModes` for editors, `resolveTheme` (the effect, its trusted pair, a dark-only effect kept dark, or hidden with a reason), `mountEffect` with `themeMode` and `pair` (the area takes the drawn theme and follows the page in `auto`), `mountWindows` (one effect drawn behind a group of `[data-sf-effect-window]` cards, seen through them), `loadEffect` (from a catalogue pinned in `SF_BOOT_CONFIG.effects.catalogue`, every file checked against the index's SHA-256 and the module run from the verified bytes) and `placeEffect`. A page may declare an effect with `data-sf-effect`, `data-sf-effect-settings`, `data-sf-effect-theme` and `data-sf-effect-windows`. An effect or a pair outside the catalogue is foreign and is refused (`sf-effect-refused`) until the sandbox runner ships. Every mount pauses while off screen.

- Added: the standard `simai.effect` 1.1.0 and its effect schema 1.2.0. A manifest may declare `schemes` (the themes it is drawn for, the first its home), a `pair` of the other scheme (a catalogue id, or an https URL that is foreign and runs only in the sandbox) and `capabilities: ["windows"]`. `SF.Effects` passes the scheme as `context.scheme` and switches it through `update`, and gains `effectSchemes` and `pairIsForeign`. The effect kit runs each declared scheme, the scheme switch, a windows check and a contrast check at the default settings: the primary text role at 4.5:1 and the dimmed role at 3:1, so dimmed text over an effect is large. 1.0.0 keeps its bytes under `contracts/standards/history`.

- Format names are read without their version (`simai.<name>` + `schema_version`) as well as with it; the change journal records the move. `sf-drawer` can live inside a `[data-sf-drawer-container]` and takes its height; a docked drawer reserves room by its host's width. `sf-theme-generator` also writes the translucent steps of the palettes, and its events are `sf-theme-generator-change`/`-apply`.

- `simai.property-view-port` 1.13.0: the view a person chooses is theirs, kept by the host per collection; `record.load` and `record.open` answer through it.

- `sf-theme-generator`: a whole theme from one colour (the eight palettes as the 128 primitives; `SF.ThemePalette`); `core/contracts/public-js-api.json`, the reference of `window.SF`; the standard `simai.ai-development` 1.0.0; a long `choices` field is edited as a checklist; format names are read in both forms (with and without a version).

- Public CSS variables for twelve more components (tag, icon-button, checkbox, radio-button, switch, textarea, toast, modal, tooltip, tabs, avatar, context-menu); the border variables of `sf-button` and `sf-icon-button` work on every appearance; a browser probe checks that every public variable takes effect.

- Every Smart component declares `presentation.skeleton`: the shape server markup writes before its code arrives (block, menu, line, or none for inline controls and overlays); a contract requires it.

- The Smart manifest schema 2.5.0 adds `persistence.view_preference`: the key, versioned shape and fields of a component's view preference, and which fields a server may seed for the first paint; `sf-resizer` declares its own.

- `simai.dataview-port` 1.12.0: the answer names its `sequence`; a conflict carries `current_revision` (and `columns` or `conflicts`) beside `answer`; `column_settings` is required only with column-settings capabilities; the kit's reset note is corrected and a sequence case added. `sf-tabs` keeps pinned tabs in a narrow row.

- Standards `simai.interaction-rules` 1.0.0 (how every Smart component loads, talks and draws) and `simai.effect` 1.0.0 (animated backgrounds: `effect.json`, `SF.Effects` with `mountEffect` and checked settings, and a kit, `scripts/effect-kit.mjs`, that checks an effect before it is listed).

- `simai.dataview-port` 1.11.0: capabilities `inline-edit` (`record.set`, a field written in its cell) and `row-reorder` (`record.reorder`, a flat list put in order by dragging), a record's `editable`, and three more conformance cases.

- The page host as an endpoint (`sf-page-host`, `SF.Composition.publishEffects`): effects a product's port answer carries go out on typed outputs and the page's routes deliver them. The fragment boundary (`sf-fragment`): a fragment that fails to draw or to load is replaced by the error state with «Повторить», and the rest of the page keeps working. A Smart component that throws while drawing now reports `sf-component-error`.

- Region navigation in the core, `SF.RegionNavigation`: a link inside the shell changes the content region instead of the page — the address goes into the history, Back and Forward work and Back returns the scroll, focus goes to the new heading, assets come once, and anything unexpected (another shell revision, a redirect, a failure) loads the page in full.

- The standard `simai.interface-fragment` 1.0.0: a page built from fragments that update one another through declared contracts, with a fragment descriptor (`interface-fragment.v1`, checked by `SF.Composition.checkFragmentDescriptor`) and seven new value types for composition routes: `record-changed.v1`, `record-removed.v1`, `collection-changed.v1`, `files-moved.v1`, `counter.v1`, `navigation.v1`, `preference-changed.v1`.

- `sf-context-menu` as a panel with tabs: `tabs`, `active-tab` and `closable` give a head (the tabs and a close button) that never scrolls, a body that does, a footer that stays, and a fixed width that does not follow what a tab holds. `sf-context-menu-tab` says which tab was chosen; `.sf-context-menu-row` is a panel's row.

- `sf-datepicker` quick ranges: `presets` in range mode puts ready ranges beside the grid (today, yesterday, last 7 and 30 days, this week, this and last month, or your own list). The `change` detail carries `preset`, so a host can store «last 7 days»; `preset` given back is resolved for today and emits nothing. Month, year and range buttons no longer draw a dark box on the panel in the dark theme.

- `sf-tree`: `accept-records` and `accept-files` — a node takes records dragged from a list or files from the computer and says so with `sf-tree-records-drop {value, ids, source}` / `sf-tree-files-drop {value, files}`.

- Field renderers: a file is filtered by its kind (images, documents, archives, other files), a colour by the field's palette; values go with the operator «in».

- `SF.fieldRenderers.registry`: the registry of universal properties — every type, its variants, the parameters it reads and its modes (view, edit, cell, filter: own or text).

- Placeholder shapes in core: an element not defined yet with `data-sf-skeleton="rows|record|menu|block|line"` takes its final room and shows skeleton bars until its code arrives. Manifest schema 2.4.0: `presentation.skeleton {shape, while_loading}`.

- `SF.Preferences` — one store for view preferences: read before the first paint, kept in the browser and, with `useHost()`, for the person on the server; `<script type="application/json" data-sf-preferences>` preloads the host's values. `sf-resizer` keeps its width there.

- `sf-empty-state` — `layout="inline"` (and `size="1/3"`): one line for a list inside a menu, a dropdown or a search, no heading, at most one link action; `live` = `auto` | `alert` | `off`.

- `sf-copy-button` — `appearance="tonal"`; `root-style` lands on the button itself, so a host can style it like its neighbours.

- `sf-copy-button` — `icon` sets the resting glyph (`content_copy` by default; `link`, `key`) and `success-icon` the glyph after a copy (`check` by default).

- `sf-help-mark` — a «?» beside a label that opens a short explanation on a press (a toggletip), announced politely; Escape, a second press or a click outside close it; an explanation with a link follows the button in the focus order.

- `sf-copy-button` — copies a `value` or a `target`'s text and says so: the icon turns to a check and «Скопировано» is announced; `label` names what is copied. A refused clipboard selects the text and announces «Выделено — нажмите Ctrl+C». Events `sf-copy` and `sf-copy-error {code}`; `copy()` from code.

- `sf-empty-state` — what a list, a panel or a page says when it has nothing to show: `kind="no-data|nothing-found|no-access|error"` with its icon, a heading at `heading-level`, a sentence in the page language and actions (slot `actions`, or the `actions` property raising `sf-empty-state-action`; «Повторить» for an error without its own). Sizes 1/2, 1, 2; nothing-found and error are a polite status.
- The `sf-sortable` manifest says a list that wraps into a grid opens the outline as one of its cells.

- `sf-tabs`: underline tabs carry no inline padding, with one gap between tabs by size (20, 24, 32px at 1/2, 1, 2), the control heights as the hit area and a 2, 2, 3px line; the tab's own font is its size's text role. `overflow="wrap|more"`: `more` moves the tabs that do not fit into a trailing «Ещё (n)» menu, the active one always staying. Items take `key`, `count`, `href` and `pinned`. `configurable` adds «Настроить вкладки»: a sortable list with a visibility checkbox per tab and «Сбросить», announced as `sf-tabs-settings-change {order, hidden}` / `sf-tabs-settings-reset` and given back with `setSettings`.

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

- The other twenty-nine Smart components are in the standard 1.4 form, so every Framework Smart component now is (component.json, examples.json, index.js, lang/, docs; the other files are generated from them): `sf-alert`, `sf-badge`, `sf-button`, `sf-button-group`, `sf-composition-overlay`, `sf-context-menu`, `sf-country-code`, `sf-drawer`, `sf-dropdown`, `sf-file-preview`, `sf-file-upload`, `sf-icon-button`, `sf-image-field`, `sf-input`, `sf-list-item`, `sf-modal`, `sf-pagination`, `sf-popover`, `sf-progress-bar`, `sf-progress-scale`, `sf-quantity`, `sf-skeleton`, `sf-spinner`, `sf-tag`, `sf-textarea`, `sf-toast`, `sf-toggle`, `sf-tooltip`, `sf-tree-item`, each a patch version up, and `sf-tabs` and `sf-profile-picker`, whose registry gains their object setting; the runtime is unchanged. Their `smart.manifest.json` is generated, so the registry (the Smart reference, ui-studio, IntelliSense) lists what the components declare and it lacked: `sf-button-press`; the open/close family of `sf-modal` and `sf-drawer`; the eight `sf-pagination-*` events; `opened`/`closed` of `sf-context-menu`, `sf-popover` and `sf-toast`; `sf-tag-close`; `open` of `sf-list-item` and `sf-tree-item`; the progress `chunk`, `sf-toast` `show`, `sf-modal` `minimize`/`expand`/`confirm`; the base settings; number settings as numbers with their range; the ARIA role. An event's detail is what the code sends, without the element; `sf-dropdown` and `sf-quantity` `change`/`input` describe their detail. Object settings are inputs (`sf-context-menu` `search`, `sf-image-field` `value`), and so are `sf-modal`'s dated `hide` and `unclose`. `sf-button` `type` and `appearance` no longer offer `ghost`, which reads as `link` (listed in `compatibility.aliases`). Names the code still reads stay described: `sf-tag` `type`, `sf-quantity` `value`, `role` of `sf-context-menu` and `sf-toast`. Retired attributes (`sf-file-preview` `avatar-size`, `open`; `sf-spinner` `width`, `height`, `stroke-width`, `dot-radius`) and host attributes (`sf-country-code` `form`, `sf-popover` `role`) leave the registry. `sf-button`'s composition type takes its current settings (`icon-start`, `icon-end`, `radius`, `segment`, `text-position`, `expanded`), never `root-class` or `root-style`. `sf-button-group`, `sf-country-code`, `sf-file-upload` and `sf-image-field` print a first-paint snapshot per example. Per component: ui-source docs/developer/component-files-1.4-phase-a-changes.md.

- Smart bundles embed less of their `component.json` (`core.runtime` 1.3.1, ui-builder `libs/componentManifestEmbed.js`): inside the keys the runtime reads, the words only the docs and the tools read are left out — `summary`, `description`, `examples`, `$comment` and `x-summary`, `x-returns`, `x-outcomes`, `x-detail`, `x-markup`, `x-note`, `x-shape` — listed in `core/contracts/shared-runtime.v1.json` as `component_manifest_drop`. A member named like one of them stays (the setting `settings.description` of `sf-avatar`). Over the 59 Smart components the embedded manifests go from 180.0 to 98.2 KB minified (60.7 to 28.6 KB gzip). `Ctor.manifest` and `sfInterface` no longer hold these words; a tool that read them from a running element reads the component's `component.json` instead.

- `sf-datepicker` 1.1.5: `disabled` reaches the whole panel. A panel a host holds open (the `open` attribute) or draws inline (`input="false"`) stayed clickable while the field was disabled; now every day, month and year, the month arrows and toggles, the quick ranges and «Свой период» are disabled, the panel carries `aria-disabled="true"`, and `choose-preset` / `choose-custom-range` answer `{outcome: "refused", reason: "disabled"}`, so no value changes through the panel. `readonly` keeps its meaning: no typing, the grid still chooses.
- `sf-datepicker` 1.1.5: the `value` property is declared as what it is, an ISO date string or `[start, end]` in range mode (`string | array`, at most two ISO strings), matching what its getter returns. The object `{start, end}` (also `startValue`/`endValue`/`date`) older callers pass is still read as that pair but is not part of the contract; any other shape (a number, a `Date`, an object without those keys) is read as before -- text, or cleared -- with one console warning per element.
- `sf-dropdown` 1.4.5: the reset back to the inherited value sends `sf-field-reset`, then `sf-field:reset` with the same detail, as `sf-input`, `sf-textarea` and `sf-quantity` do. The dropdown lacked the alias row, so the new name was never dispatched; `sf-field:reset` is a dated alias until 2026-12-01.

- New: `sf-progress-ring` 1.0.0 and the class component `progress-ring` (owner request 2026-10-28, UI Chat): a value from 0 to 100, or an unknown one (`indeterminate`, the spinner's arc), drawn as a ring on the control ladder. Sizes `1/2`, `1`, `2` are the box of an `sf-icon-button` or `sf-avatar` of the same size (`--sf-ui-<size>--control-height`, 36 px at 1 on a narrow screen); the line and the gap are 2 px. `status` takes the five shared words with sf-progress-bar's tokens and is always the page's (a quota's thresholds stay the host's); `meter` makes it role `meter` for an amount in a known range; `show-text` shows the percentage; slot `content` holds a picture: an `sf-avatar` a step smaller fills the middle exactly at sizes 1 and 2 and is fitted to it at every size, 2 px from the line. The role sits on the ring, so the avatar keeps its own name. `chunk({done, total})` as on sf-progress-bar. Six public variables: `--sf-progress-ring-size`, `-line-width`, `-gap`, `-fill-color`, `-track-color`, `-color`; a bare `0` is a valid line or gap. The class is CSS only: `style="--sf-progress-ring--value: 62"` on the root.

- The shared Smart runtime carries the element layer (`core.runtime` 1.1.0, every Smart component a patch). Smart and package bundles no longer bundle their own `element-manifest`, aliases, alias table, host port, deprecations, page actions, layer stack, open-surface mark or instance path: they ask the page's runtime (`core/js/smart-base.min.js`) with `SF.runtimeModule`. For the modules Core runs itself (aliases, the alias table, deprecations, page language, layer stack, positioning) every bundle gets Core's instance, so the page has one; the runtime keeps its own copies for a page without Core. Each bundle also embeds only the keys of its `component.json` the runtime reads (`x-registry`, `x-rule`, `x-decisions`, `relations`, `aliases` and `examples` stay in the source): 588 KB → 141 KB minified across the bundles. In all, the Smart bundles go from 1103 to 458 KB gzip; `smart-base.min.js` grows by 6.8 KB and `core.min.js` by 2.4 KB. Runtime ABI 1 (`core/contracts/shared-runtime.v1.json`): a bundle built for another ABI is refused with a console error instead of receiving `undefined`. A product package must be rebuilt over this pair with ui-builder from faed36f or later; its receipt records the runtime modules and names it uses and is checked against this release's contract. Core preloads the runtime as soon as the page holds an undefined `sf-` element, and loads it only once when the page also includes it by hand. Docs: ui-source `docs/developer/shared-runtime.md`.

- Thirty Smart components are in the standard 1.4 form (component.json, examples.json, index.js, lang/, docs; the other files are generated from them): `sf-accordion`, `sf-avatar`, `sf-avatars`, `sf-breadcrumbs`, `sf-checkbox`, `sf-close`, `sf-code-input`, `sf-color`, `sf-copy-button`, `sf-datepicker`, `sf-download-file`, `sf-empty-state`, `sf-gallery`, `sf-help-mark`, `sf-icon`, `sf-inline-editor`, `sf-menu`, `sf-page-header`, `sf-profile-picker`, `sf-radio`, `sf-range-slider`, `sf-reference-link`, `sf-resizer`, `sf-slider`, `sf-sortable`, `sf-steps`, `sf-switch`, `sf-tabs`, `sf-theme-generator`, `sf-tree`, each a patch version up; the runtime is unchanged. Their `smart.manifest.json` is generated, so the registry (the Smart reference, ui-studio, IntelliSense) now lists what the components declare and it lacked: events such as `sf-accordion-toggle`, `sf-breadcrumbs-press`, the `opened`/`closed` of `sf-help-mark` and `sf-gallery`, the six events and three actions of `sf-tree` 2.0; the base settings `root-class` and `root-style`; number settings as numbers with their range; the ARIA role; the version and title of the component. `composition.uses` is generated from the Loader relations. Per component: ui-source docs/developer/component-files-1.4-phase-a-changes.md.

- The Loader no longer links a sheet the page already links (`core.runtime` 1.0.9): a page that links its first paint's sheets in `<head>`, as standard 1.3.10 asks, had each sheet a part named linked a second time (62 of 73 on the admin's list), and every style recalculation of the opening read each rule twice. The Loader waits for the page's link of the same sheet, in either form. Rendered Smart elements are scanned for parts once per task, not once per element inside each other (stand 25: the admin's list is ready to ask for its data about 0.8 s earlier at 4× CPU).
- The Loader does not fetch a Smart part again when the page has already defined it (`core.runtime` 1.0.9): a page that loads a part's bundle itself (`<script defer>` in `<head>`) had the Loader fetch and run the same part from its own path (about 190 KB gzipped for the table and the data view on Larena's admin list). Its sheets and relations are asked for as before.

- `sf-pagination` 1.3.0 (`component.pagination` 1.1.0): the page row publishes its box on `:root`, `--sf-pagination-block-size-1\/2` and `--sf-pagination-block-size-1` (`2 × --sf-space-1` + the step's control height + 1px; 65px and 73px on a wide screen in the default theme), so a page can hold the room of a list and its pages before they draw. The row's minimum height is the same sum: a row of text alone is as tall as one with the arrows.
- `sf-copy-button` 1.1.3: the control sits in a line of text by its middle (`--sf-copy-button-vertical-align`, default `middle`, now on the wrapper; the host is `display: contents`). Aligned by the icon glyph's baseline it rode 1px lower until the icon runtime marked the icon loaded.

- The `larena` package reference names the chat components `sf-chat-window`, `sf-chat-message`, `sf-chat-composer` and `sf-chat-interlocutor` (ui-pro chat/1.3.9), each with its rule's relations as `requires` (`core.runtime` 1.0.8). A package that ships them is no longer refused by its receipt check.

- The admin opens faster and holds still (stand 25, the admin polygon; core.runtime 1.0.7, core.styles 1.0.1, component.skeleton 1.0.1). **The style gate holds:** `SF.Loader.ensureStylesReady(element)` is implemented: a Smart element draws visibly only once the sheets it draws with are applied (its own, its components', the utilities its templates use; not the lazy ones), a sheet already linked in `<head>` counts at once, and an element defined before the Loader (a page's `<script defer>`) waits for it instead of drawing its text unstyled; a printed first paint stays on screen until those sheets are in and is then replaced styled (no blank box), and the Loader asks for an element's gate sheets with its script. **The box before the code:** an undefined element no longer gets a shape invented by core: printed static markup is its box, otherwise it reserves the box the page declares (`block-size`, `min-block-size` or `--sf-skeleton-block-size`) and `rows`, `record` and `menu` draw nothing in it until the component's own skeleton (`--sf-skeleton-rows` alone no longer reserves room; `block` and `line` still draw their box as one bar). **One pulse per skeleton:** `.sf-skeleton--animation-pulse` pulses the group once (the bars with it), not each bar, and holds still for reduced motion. **No long Loader tasks:** whole-token utility rules are matched once per class name (indexed by their literal head) instead of once per attribute string; the window-load scan, the mutation batches and the shortcode walk are read in slices under 16 ms (scheduler.yield) or by the browser's own walker; `searchRegexp` writes only the 4 KB of markup it reads. **Definitions in batches:** Smart bundles that ran before the next frame are defined together in it (one style recalculation; `SF_BOOT_CONFIG.batchDefinitions = false` defines at once), and the sheets asked for in one task go into `<head>` together. Smart components whose first-paint sheet lists now name the utility sheets their templates draw with take a patch version.

- sf-drawer 1.8.0: a docked drawer without the room (dock host or window narrower than its `dock-breakpoint`) now floats as a modal panel — focus kept inside, scrim takes presses, page scroll locked, Escape closes, focus returns to the opener; with the room it stays a modeless column, and `modal="false"` keeps it modeless everywhere (q-a49e2045c1, asked by ui-chat).
- sf-drawer 1.8.0: a modal drawer's Tab cycle runs through the panel and then its edge, so the close, copy-link and open-full controls sf-property-view stands there are reachable by keyboard; a focus on the edge counts as inside.

- Host port `simai.chat-port` 1.0.0, the seam of `sf-chat-window` (sixteen `chat-port:` intents, eleven capabilities, a revision on every edit and delete, one `client_key` per write) with its fourteen-case kit; core publishes `SF.sanitizeHtml(html, {elements?, codeLanguage?, document?})` and `SF.safeHref(value)` (core.runtime 1.0.4; rules in docs/developer/sanitize-html.md).
- First-paint snapshots leave out an inline custom property holding a non-zero px length (a measured size such as `--sf-table--content-inline-size`), as they leave out geometry declarations; an authored size is written in rem or a token.
- The first-paint tools (snapshot and gate 24) freeze `Date` and `Date.now()` at `2026-10-27T12:00:00+03:00` before any page code runs, so a component that reads the date prints the same snapshot every day; an example overrides it with `"first-paint": {"now": "<ISO>"}`, a component package with a top-level `"now"` in its config.

- A removed Smart component leaves nothing behind (standard 1.3.9 gate 36, now a browser probe over every example): the Smart base starts nothing for an element whose connected callback runs after it left (a language listener per lightbox slider of `sf-gallery`), `sf-tabs` 1.1.2 stops its page-panel observer when taken out (and so `sf-context-menu`), `sf-profile-picker` 1.1.2 starts no outside-press listener, placement or layer for an open overtaken by a close or a removal, `sf-breadcrumbs` 1.1.2 opens its scope again when placed again; core.runtime 1.0.3.

- First-paint snapshots are deterministic and small (standard simai.smart-component 1.3.9 §5.4, gate 24): a JSON island is printed once; `sf-icon`'s `loaded` and the `sf-icon-loaded` class, and every inline size or place the code measured (a non-zero px width, height, inset, clip or transform), are left out of the static markup; a closed list, menu, popover or dialog prints as its empty element (`sf-country-code` 107 KB → 1.7 KB); snapshots are measured in Inter (pages keep `font-display: optional`) — two write runs give byte-identical files, and a snapshot over 8 KB fails unless its example declares `"first-paint": {"max-bytes", "why"}`. An explicitly empty late list is data: a printed skeleton leaves on it and none is written for it (core.runtime 1.0.2; 42 Smart components patch-bumped for their retaken snapshots). The snapshot tools take a package declaration (`--config=<file>`), a fake host port per example (`"port": {"answers": …}`, gate phase 3), and nested `skeleton.html` repeats with a default count.

- First paint and lazy start on a real screen (stand 24; standard simai.smart-component 1.3.9 §5.4, §7.2.1, gate 24; simai/ui-source#47): SF.Assembly no longer starts a part whose role's `if` is false, so its code is not fetched until the `if` first turns true; a printed `sf-button` keeps the Assembly's `data-sf-role`/`data-sf-instance` (and every runtime `data-sf-*` mark) on its host, so it is adopted instead of drawn again; `sf-page-header` 1.1.1 holds its line at the star's height whether the star is drawn or not; an adopted live host loses `data-sf-static` when it draws. Gate 24 now fails a printed part that is drawn anew.

- **Every Smart component has a first paint** (standard simai.smart-component 1.3.8 §5.4, §7.3, gate 24): each example of all 59 components is shipped as static markup (`smart/<name>/static/default/<example>.html`, a build snapshot, with `static/sheets.json`), components with late data (sf-tree, sf-menu, sf-profile-picker) also as a skeleton; the live element adopts the printed markup in its first render in one frame, reads list settings from a `data-sf-settings` JSON island, keeps a printed skeleton until its data arrives, and SF.Assembly takes a composed layout's printed parts into its live layout — boxes equal in all three phases at 1280 and 390 px.

- Changed: host port `simai.property-view-port` 1.15.0, backwards compatible with 1.14.0: capability `group-load` and intent `group.load {record_id, collection, section?, group, reason}` read one group of a record — the answer carries the record's head, its revision, the arrangement with every group's `field_count`, and that group's fields (`group: null` asks for the group the panel opens on; an unknown group is refused with `unknown-group`). The revision is the whole record's: `group.save` sends it back, and a save against an older one answers `conflict` with the current revision. A host without `group-load` is served by `record.load` once per revision (standard simai.smart-component 1.3.8 §4.9, items 25 and 35). Six new conformance cases (57).

- The editors and screens on their manifests (standard simai.smart-component 1.3.8, vocabulary 1.1.5): `sf-list-item`, `sf-tree-item`, `sf-tree`, `sf-sortable`, `sf-inline-editor`, `sf-composition-overlay`, `sf-page-header`, `sf-theme-generator`. `sf-tree` draws its entries flat and keyed by id, and only those in view over 300: 2 000 nodes draw in a frame where they took 14 s, a change in a frame where it took 7.5 s (simai/ui-source#43). Renamed events follow by their former names until 2026-12-01: `sf-tree-open`, `-select`, `-toggle`, `-move`, `-attach`; `sf-list-item-open`; `sf-tree-item-open`; `sf-sortable-move`; `sf-inline-editor-input`, `-change`, `-cancel`; `sf-composition-overlay-apply`, `-change`; `sf-page-header-toggle`; the theme generator's `change` and `sf-theme-generator-committed`.

- Changed: `sf-pagination` takes `total-exact` (default true). While the host says the total is an estimate, the page row reads «Всего: ~450», offers the count link to ask for the exact number, and neither the last page nor the page count is offered as exact (standard simai.smart-component 1.3.8 gate 29).
- Changed: every Smart element has the base action `connect-port {port}` — `connectPort(port)`, with `setHostPort` as its alias; the port is kept for the instance and read as `sfPort`, and `SF.Assembly` hands a port to the parts that declare it through that action.

- Display, group B, on its manifests (standard simai.smart-component 1.3.8 §4, §4.8, §8, §10.8): sf-alert, sf-empty-state, sf-spinner, sf-skeleton, sf-progress-bar, sf-progress-scale, sf-file-preview, sf-gallery, sf-slider, sf-resizer and sf-profile-picker are built from their `component.json` with words in two languages and a conformance probe each. Progress components take `chunk {done, total}` (`setProgress` is its dated alias) and carry `role="progressbar"` with `aria-valuenow`; sf-alert is a live region (`status` or `alert` by its status) and sends a cancelable `close` request; sf-file-preview reports `download` and `detach` (the colon names follow until 2026-12-01); sf-slider and sf-gallery report `change`, sf-gallery `opened`/`closed`; sf-resizer reports `sf-resizer-resize`; sf-profile-picker reports `sf-profile-picker-*` and ships a `skeleton.html`. Renamed settings (`title`, `type`, `variant`, `tone`) and the spinner's pixel attributes keep working as dated aliases until 2026-12-01.

- Actions and display, group A, on their manifests (standard simai.smart-component 1.3.8 §3, §4, §8, §21): sf-button, sf-icon-button, sf-icon, sf-badge, sf-tag, sf-close, sf-copy-button, sf-download-file, sf-reference-link, sf-help-mark, sf-avatar and sf-avatars are built from their `component.json` with words in two languages and a conformance probe each. Five folders take their tag's name — `buttons` → `button`, `icon-buttons` → `icon-button`, `icons` → `icon`, `badges` → `badge`, `tags` → `tag` — and their registry ids follow (`smart.button`…); the old paths and the Loader rule names `cl-buttons`, `cl-icon-buttons`, `cl-icons`, `cl-badges`, `cl-tags` forward until 2026-12-01. New `sf-button-press` (once per click, Enter or Space, never while disabled or loading) and `expanded`; sf-download-file's click is the cancelable `sf-download-file-download`; sf-copy-button reports `sf-copy-button-copied` / `-copy-failed`; sf-help-mark reports `-opened` / `-closed`; renamed settings (`type`, `variant`, `tightness`, `icon-left`/`icon-right`, `title` → `heading`, sf-avatars `data` → `fields`) and old event names keep working as dated aliases until 2026-12-01.

- The form-field family on its manifests (standard simai.smart-component 1.3.8 §4, §5.3, §6, §16, §17, §20): sf-toggle, sf-checkbox, sf-radio, sf-input, sf-textarea, sf-quantity, sf-code-input, sf-country-code, sf-color, sf-range-slider, sf-button-group, sf-image-field, sf-file-upload and sf-datepicker are built from their `component.json` with Russian and English words, examples and a conformance probe each. Every field submits from its host through ElementInternals (one shared form helper): the inner controls carry no `name`, the host's validity follows the inner control's or its own rules, form reset and disabled/read-only behave as native; checked controls without `value` submit `on`; sf-datepicker submits the ISO date. `change` and `input` keep their native names. Renamed events (`sf-field:reset` → `sf-field-reset` with `tag` in its detail, `sf-code-input:complete` → `sf-code-input-completed`, `sf-file-upload:*` → `attach`, `attached`, `detach`, `rejected`, `retry`, `completed`, `failed`, `finished`, `sf-image-field:*`, `sf-range-slider-change`, `sf-button-group-change`, `sf-datepicker-change`, `sf-change`) and settings (`error` → `invalid`, `type` → `kind`/`appearance`, `spellcheck` → `spell-check`, `prefix` → `prefix-text`, `left-icon`/`right-text` → `icon-start`/`text-end`) keep working as dated aliases until 2026-12-01. sf-quantity marks `data-at-min`/`data-at-max` and draws its focus ring from `:focus-visible`; file uploads report each file as a stream (`begun`, `chunk`, then `completed`, `failed` or `cancelled`). The sf-input folder moved from `smart/inputs/` to `smart/input/`; the old path forwards until 2026-12-01.
- The navigation family on its manifests (standard 1.3.8 §4, §4.8, §7.2.1, §8; simai/ui-source#44 item 2): sf-menu, sf-tabs, sf-accordion, sf-breadcrumbs, sf-steps and sf-pagination are built from their `component.json` with words in two languages and a conformance probe each; actions answer outcomes; ids come from the instance path. Renamed events keep working as dated aliases until 2026-12-01: `sf-accordion:toggle` → `sf-accordion-toggle`, `sf-menu:navigate`/`:toggle` → `sf-menu-navigate`/`-toggle`, `sf-tab-change` → `sf-tabs-change`, `sf-step-change` → `sf-steps-change`, `sf-breadcrumb-click` → `sf-breadcrumbs-press`, and eight pagination names → `sf-pagination-change`, `-size-change`, `-count`, `-load-more`, `-selection-clear`, `-action-change`, `-action-for-all-change`, `-apply`. Tabs, steps and pagination keep `sf-<tag>-change` (an event may declare `"x-native": false`), so a field's `change` inside a panel is not mistaken for a tab change. sf-menu declares Escape only where it acts. sf-tabs `items` is a list of `{id, label}` with a `selected` value, and a tab list over deferred panels uses manual activation.
- sf-input's registry id is `smart.input`, following its folder; `smart.inputs` and the Loader rule name `cl-inputs` forward to it until 2026-12-01.

- The overlay family on its manifests (standard simai.smart-component 1.3.8 §4, §8, §16.12–16.13, §19): sf-modal, sf-drawer, sf-popover, sf-dropdown, sf-context-menu, sf-toast and sf-tooltip are built from their `component.json` with Russian and English words. Their events follow `sf-<tag>-<verb>` (`sf-modal-open`, `sf-modal-closed`, `sf-drawer-snapped`…); the colon names (`modal:*`, `drawer:*`, `sf-dropdown:change`) and renamed settings (`title` → `heading`, `blur` → `backdrop-blur`, `hide` → `minimizable`, `type` → `status`/`appearance`, popover `role` → `surface-role`) and methods (`hide()`/`show()` → `minimize()`/`expand()`) keep working as dated aliases until 2026-12-01, recorded in `SF.deprecations`; `getModalRoot`, `getSlotHtml`, `modal:ready`, `modal:update`, `drawer:ready` and `drawer:update` retire with the same dates. Popover, context menu and toast send a cancelable `close` request `{reason, unsaved}` before their `closed` fact, so a listener on their close name now runs before the layer closes and may refuse it. A modal opened by an assembly's `ask` answers `{accepted, reason, value}` when it closes; `accepted` is true only through `confirm` (`data-sf-action="<id>.confirm"`). `data-sf-action="<id>.<action>"` on any page button runs an element's action; `data-sf-modal-*` and `data-sf-drawer-*` stay as its aliases. Portals carry the declared CSS variables; overlay ids come from the instance path.

- Smart elements from their manifest (standard simai.smart-component 1.3.8 §3, §4, §4.1, §7.7, §11; simai/ui-source#38, #41, #45). `elementFromManifest` builds an element's settings, values, actions (with the outcomes applied, refused, cancelled), events declared by verb, the base values `shown` and `started`, declared host states, the instance's scope and its form value through ElementInternals from the component's `component.json`; components without one are unchanged. Dated aliases (`SF.aliases`, §16.20) send a renamed event's new name first, then its old one, with one `detail` and one cancel, and record each use with its `since` and `remove_after` in `SF.deprecations`. The nearest `lang` attribute wins over `SF.language.use()`, a runtime `lang` change redraws the elements under it, and words fall back to English, the source language, then the key with a warning; plural forms come from `Intl.PluralRules`. Ids written by templates derive from the instance's path (`sf-quantity-1--control`, `page-<id>--control`), never a module counter, so a class and a Smart field no longer share an id. The boot preloader does not cover a page that carries static markup or skeletons. sf-switch is the first component on its manifest: without `value` it submits `on` like a native checkbox, its checked look comes from `:has(input:checked)`, and `sf-field:reset` is a dated alias of `sf-field-reset` until 2026-12-01.

- One document layer stack (standard simai.smart-component 1.3.8 §19.1–19.3; simai/ui-source#36, #37, #42). Modal, drawer, popover, dropdown, menu and the toast area register in one stack in core (`src/core/js/layer-stack.js`): layers are ordered on one z-index scale (`--sf-z-index-layer`, `--sf-z-index-layer-step`) in opening order, only the top layer handles Escape, Tab and an outside press, one page lock holds while any locking layer is open, and focus returns to the opener, then the new top layer, a landmark or the body. A drawer opened from a modal draws above it, and Escape over a modal opened from a drawer closes only the modal. sf-modal moves the page's own slot nodes into its portal and back, so their listeners, state and identity survive. Modal and drawer portals carry the host's `lang`, `dir` and theme class; close events carry `reason` (close, escape, outside, cancelled, api). `<sf-modal id>` no longer gives the window root the same id — find the window through its portal (`[data-sf-modal-portal]`). The static `baseZIndex` of the modals is no longer read.

- The first paint follows standard simai.smart-component 1.3.8 §5.4 (simai/ui-source#39, #40, #47). Core no longer hides the page (`body` opacity) until the Loader is ready: it hides only the undefined Smart elements the Loader is fetching that carry no `data-sf-static` markup and no `data-sf-skeleton` shape, keeps their box, and lets go of each tag when it is defined (or after 10 s, with a warning). A Smart element replaces its `data-sf-static` children in its first render, in the same task, so printed markup is never shown twice nor followed by a blank frame. The Loader fetches no code for a Smart element inside a closed container (`[hidden]`, `[inert]`, a closed `<details>` or `<dialog>`) until it opens, no longer prefetches lazy relations in idle time (`SF_BOOT_CONFIG.prefetchLazyRelations = true` restores it), and skeleton bars load their sheet only — the skeleton script loads when `[!skeleton]` or `SF.Loader.ensurePlugin('skeleton')` asks for it.

- One spinner, four looks on the #10 ladder: `arc` (default), `breathing`, `comet` and `dots`, chosen once for the page with `data-sf-spinner="<look>"` on `html` or `body` (or `SF_BOOT_CONFIG.spinner`), overridable on any block; a spinner's own `data-variant` / `kind` wins. Every spinner the SIMAI Framework draws follows it: `sf-spinner`, button, icon-button and button-group loading, the pagination count and the modal loading state. Each look keeps the button-icon box, the current ink and a still frame under reduced motion (simai/ui-source#11).
- `sf-spinner` without `kind` now follows the page (arc when nothing is set); dots default to 8 with 3 lit, sized from the step; the modal loading state draws the Framework spinner at step 3.

- The spinner is the one loading indicator, on the full size ladder (`1/3` added): at each step `sf-spinner` is exactly the icon of a button of that size, its stroke that of a regular-weight icon, its colour the current ink (`--sf-loader--color` overrides). Buttons in the `loading` state show it instead of the stripes: in place of the icon, over the label without changing the width, or in place of the icon of an icon-only button; `aria-busy` and the label stay, reduced motion shows a still arc. This covers `sf-button`, `sf-icon-button` and the buttons of `sf-button-group`, segmented included (simai/ui-source#10).
- Deprecated, removed after 2026-12-01: the spinner's pixel attributes (`data-width`, `data-height`, `data-stroke-width`, `data-dot-radius` and their short forms) and `--sf-button-loading-stripe` / `--sf-icon-button-loading-stripe`.
- The contract registry records why a reviewed entry is not suggested (`readiness.blockers`); `sf-button-group` is suggested, 172 of 345 entries. The documentation address is https://ui.simai.io/.

- Segmented `sf-button-group` and the theme switch stand on the button ladder: the track is as tall as an `sf-button` of the same size and spacing, and the segments inside take the compact step (simai/ui-source#9).
- The contract registry suggests 134 more entries (170 of 345), promoted by a written rule: documented with an example, exercised by a test, probe or the polygon, no open issue, not deprecated (`contracts/owners/PROMOTION.md`).

- Changed: composition value types are read without a version as well: `record-changed`, `record-removed`, `collection-changed`, `files-moved`, `counter`, `navigation`, `preference-changed`, `record-id`, `record-ids`, `text`, `boolean`, beside their `.v1` names (compat until 2026-12-01, journal `value-types-without-version`). A route between a bare name and its `.v1` label is one type; `sf-page-host` publishes a host's effect named either way. The routing contract is at 1.1.0, the fragment descriptor schema at 1.2.0, and `simai.interface-fragment` at 1.0.2; old-form digests are unchanged.

- Changed: the Composition Recipe contract is at 1.1.0: recipe, recipe manifest, inputs and the dependency receipt accept the format name without a version (`"schema": "simai.composition.recipe"` with `"schema_version": 1`) as well as the old label, and the canonical-JSON profile accepts `simai.recipe.canonical-json`. A recipe in the old form resolves to the same Document and digests as under 1.0.1. The standards that pin the contract follow with new editions, requirements unchanged: `simai.composite-component` 1.0.3, `simai.dynamic-composite-component` 1.0.3, `simai.composite-host-port` 1.0.4, `simai.interface-fragment` 1.0.1, `simai.component-package` 1.1.1.

- Changed: an inline `sf-modal` (`display="inline"`) is shown without `open`, as it stands in the page's flow; `close()` puts it away and `open()` brings it back. The script Modal already opened an inline window by itself.
- Changed: the standard `simai.component-package` is at 1.1.0 and pins the Smart component manifest schema 2.5.0; 1.0.0 keeps its bytes under `contracts/standards/history`.

- Changed: what is written inside `<sf-modal>` without a slot is the window's content, after anything slotted as `content`, as `sf-drawer` takes it; it used to be dropped, leaving an empty window.

- Changed: a modal made by script (the `Modal` component class) takes `param.container`, an element or a selector, and covers that box instead of the viewport; without one, a modal opened from inside a `data-sf-overlay-container` covers that box. The page stays scrollable in both cases, as for `sf-modal`.

- Changed: `sf-modal` inside an element with `data-sf-overlay-container` renders its backdrop and surface inside that element and covers it alone (the box gets `contain: layout`); the page is not scroll-locked. One attribute serves `sf-modal` and `sf-drawer`; `data-sf-drawer-container` is read until 2026-12-01. A modal drawer inside such a box no longer locks the page either.
- Fixed: in a sandboxed frame (opaque origin) the flag component no longer fetches its catalogue, a request that always failed with a console error; flags fall back by the image's own error as before.

- Changed: the Composition editor manifest registry (`core/contracts/composition-editor-manifests.v1.json`) names its format without a version, `"schema": "simai.composition.editor-manifest-registry"` with `"schema_version": 1`; Larena's backend reads both forms.

- Changed: the Framework writes data format names without a version, `"schema": "simai.<name>"` with `"schema_version": <major>` beside it: composition type, editor and port manifests, field kinds, the type and port registries, capability fixtures, the dependency receipt, the technology packet and the repository's own data files. Every reader takes both forms (since ui-1cb0739a8423). A Document resolved from a recipe keeps the recipe's form, so Recipe 1.0.1 digests do not move. Left in the old form until their strict readers take both: the editor-manifest registry's label, the Smart contract registry, host-port documents and kits, the capability and recipe contract locks, the Recipe 1.0.1 contract files, and the Studio fixtures and scenarios.

- Changed: the loader asks for the utility classes a Smart component's templates draw with in the same wave as the component, from a table generated from the templates (`core/js/template-utilities.generated.json`). They used to arrive in a last wave of their own after the component had drawn without them; a page with tabs, a help mark and a date picker now finishes loading in five waves instead of six (290 ms against 503 ms at 40 ms per answer).

- The Smart runtime shares `lit/directives/repeat.js`: a list that reorders moves its rows instead of drawing them again.

- The larena package reference: the record view requires `smart.empty-state`.

- The larena package reference: the table requires `smart.empty-state`.

- The larena package reference: the record view requires `smart.copy-button`.

- The larena package's admin menu and record view require `smart.profile-picker`.

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
