# SIMAI UI Core

SIMAI UI Core - статический дистрибутив SIMAI Framework UI для standalone-подключения без серверной сборки.

Репозиторий содержит уже собранные JS/CSS/JSON/font-артефакты в каталоге `distr/`. Рекомендуемый способ использования в проектах - подключать фиксированную версию по git tag, а не ветку `main`.

## Текущая версия

Текущая релизная версия: `5.1.2`.

См. также:

- [CHANGELOG.md](CHANGELOG.md)
- [docs/releases/5.1.2.md](docs/releases/5.1.2.md)

## Установка через CDN

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui@v5.1.2/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui@v5.1.2/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui@v5.1.2/distr/core/css/core.css">
```

Если используются smart-компоненты из отдельного пути, можно явно указать `window.sfSmartPath`:

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui@v5.1.2/distr';
  window.sfSmartPath = 'https://cdn.jsdelivr.net/gh/simai/ui-smart@v5.1.0';
</script>
```

## Локальная установка

1. Скопируйте каталог `distr/` в публичную директорию проекта.
2. Укажите базовый путь до дистрибутива.
3. Подключите core JS и core CSS.

```html
<script>
  window.sfPath = '/distr';
</script>

<script src="/distr/core/js/core.js"></script>
<link rel="stylesheet" href="/distr/core/css/core.css">
```

## Что входит в дистрибутив

Основные директории:

- `distr/core/` - базовый runtime, loader, core CSS и smart runtime assets.
- `distr/component/` - обычные UI-компоненты и component assets, включая компоненты, используемые smart-слоем.
- `distr/utility/` - utility CSS/JS модули.
- `distr/rule/` - правила загрузчика.
- `distr/fonts/` - шрифты и font assets.
- `distr/source/` - служебные source/meta assets.

Smart-компоненты поставляются через `distr/smart-component-meta.json`, `distr/rule/` и core runtime assets.

Состав релиза `5.1.2`:

- всего файлов: `2583`;
- CSS-файлов: `711`;
- JS-файлов: `939`;
- gzip-артефактов: `630`;
- JSON-файлов: `18`;
- общий размер: около `39.34 MB`.

## Пример HTML

```html
<nav class="sf-breadcrumbs flex">
  <a class="sf-breadcrumbs-item sf-breadcrumbs-item--text flex items-center" href="/">
    Главная
  </a>
</nav>

<sf-button type="default" scheme="primary" text="Сохранить"></sf-button>
```

Loader автоматически находит используемые компоненты и utility-классы в DOM, загружает нужные JS/CSS-файлы из `window.sfPath` и инициализирует компоненты.

## CSS cascade layers

Utility-стили дистрибутива размещаются в слое `sf.utilities`. Это нужно, чтобы utility-классы участвовали в общей системе CSS cascade layers SF и не перекрывали компонентные стили вне ожидаемого порядка.

Рекомендуемый порядок слоев для проектов:

```css
@layer sf.reset, sf.tokens, sf.base, sf.utilities, sf.components, sf.states;
```

Если проект добавляет свои слои, их нужно объявлять осознанно относительно слоев SF, чтобы сохранить предсказуемый приоритет utilities, components и states.

## Изменения 5.1.2

- Исправлено правило загрузки `cl-table`.
- Убрана relation на несуществующий обычный компонент `table`.
- CSS для `sf-table` теперь грузится через smart-правило `cl-table`.

## Изменения 5.1.0

- Добавлены собранные компоненты `admin-menu`, `datepicker`, `tree`, `tree-item`.
- Обновлены smart metadata, loader/runtime assets и правила загрузчика.
- Расширены utility-модули `flex`, `align-content`, `headers`, `transform-translate`, `transform-translate-ext`, `transition-property`.

## Рекомендации для проектов

- Используйте pinned tag: `@v5.1.2`.
- Не подключайте `@main` в production, чтобы избежать непредсказуемых обновлений.
- При обновлении версии очищайте кеш CDN/браузера, если проект использует долгоживущий cache.
- Для локальной поставки храните структуру `distr/` без переименования внутренних директорий.

