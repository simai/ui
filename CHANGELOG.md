# Changelog

Все заметные изменения SIMAI UI Core фиксируются в этом файле.

Формат версий: `major.minor.patch`. Для ветки SIMAI Framework 5 мажорная версия начинается с `5`.

## [Unreleased]

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
