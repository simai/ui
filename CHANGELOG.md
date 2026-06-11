# Changelog

Все заметные изменения SIMAI UI Core фиксируются в этом файле.

Формат версий: `major.minor.patch`. Для ветки SIMAI Framework 5 мажорная версия начинается с `5`.

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

Состав релиза: `2583` файлов, `711` CSS, `939` JS, `630` gzip-артефактов, `18` JSON, около `39.34 MB`.

### Установка

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui-core@v5.1.0/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui-core@v5.1.0/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui-core@v5.1.0/distr/core/css/core.css">
```
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
