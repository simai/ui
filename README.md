# SIMAI UI Core

SIMAI UI Core - статический дистрибутив SIMAI Framework UI для standalone-подключения без серверной сборки.

Репозиторий содержит уже собранные JS/CSS/JSON/font-артефакты в каталоге `distr/`. Рекомендуемый способ использования в проектах - подключать фиксированную версию по git tag, а не ветку `main`.

## Текущая версия

Текущая релизная версия: `5.6.1`.

См. также:

- [CHANGELOG.md](CHANGELOG.md)
- [docs/releases/5.6.1.md](docs/releases/5.6.1.md)
- [Documentation source contract](docs/documentation-source-contract.md)

## Установка через CDN

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui@<release-tag>/distr';
</script>

<script src="https://cdn.jsdelivr.net/gh/simai/ui@<release-tag>/distr/core/js/core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simai/ui@<release-tag>/distr/core/css/core.css">
```

Если используются smart-компоненты из отдельного пути, можно явно указать `window.sfSmartPath`:

```html
<script>
  window.sfPath = 'https://cdn.jsdelivr.net/gh/simai/ui@<ui-release-tag>/distr';
  window.sfSmartPath = 'https://cdn.jsdelivr.net/gh/simai/ui-smart@<smart-release-tag>';
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

Состав релиза `5.6.1`:

- всего файлов: `6773`;
- CSS-файлов: `1439`;
- JS-файлов: `1643`;
- gzip-артефактов: `3362`;
- JSON-файлов: `24`;
- общий размер: около `95 MiB`.

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

В версии `5.4.0` стандартный загрузчик использует компактную theme-safe
анимацию кандидата №2. Она не зависит от внешних ресурсов и остаётся статичной
при включённом `prefers-reduced-motion`.

## Production Asset Planner

Проекты со статической или серверной сборкой могут подготовить ресурсы первого
кадра командой `scripts/plan-framework-assets.py`. Планировщик анализирует
готовый HTML по тем же правилам `distr/rule/rule.json`, раскрывает зависимости
и возвращает детерминированный JSON со списком точных CSS/JS-файлов и данными
для `window.SF_PRELOADED`.

Это необязательное build-time улучшение: обычное подключение через `sfPath`,
`sfSmartPath`, `core.css` и `core.js` не меняется, а Loader продолжает
обслуживать компоненты, добавленные в DOM позднее. Редкий ресурс первого кадра,
который невозможно увидеть в итоговой разметке, можно объявить атрибутом
`data-sf-require="utility.<name>|component.<name>|smart.<name>"`.

Компоненты с серверной оболочкой могут пометить контейнер подсветки
`data-sf-highlight-chrome="static"`. В этом режиме Highlight сохраняет готовый
заголовок и размеры блока, добавляя только подсветку синтаксиса.

```bash
python3 scripts/plan-framework-assets.py \
  --html build/index.html \
  --ui-root . \
  --smart-root ../ui-smart
```

Когда страница передала `window.SF_PRELOADED`, Loader считает production-план
единственным источником готовности первого кадра и не восстанавливает список
модулей предыдущей страницы из `localStorage`. Это устраняет межстраничную
гонку ресурсов; динамическое обнаружение нового DOM после старта сохраняется.
В обычном режиме без production-плана прежний кеш Loader продолжает работать.

## CSS cascade layers

Utility-стили дистрибутива размещаются в слое `sf.utilities`. Это нужно, чтобы utility-классы участвовали в общей системе CSS cascade layers SF и не перекрывали компонентные стили вне ожидаемого порядка.

Рекомендуемый порядок слоев для проектов:

```css
@layer sf.reset, sf.tokens, sf.base, sf.utilities, sf.components, sf.states;
```

Если проект добавляет свои слои, их нужно объявлять осознанно относительно слоев SF, чтобы сохранить предсказуемый приоритет utilities, components и states.

## Изменения 5.3.0

- Обновлен собранный SF5-дистрибутив из sf5.webpack.
- Добавлены component assets для `file-preview` и `link`.
- Добавлен новый core runtime chunk `556`.
- Обновлены core loader/rules/runtime assets, правила загрузчика и metadata.
- Обновлены component assets для `avatars`, `country-code`, `dropdown`, `featured-icon`, `file-upload`, `inputs`, `toggle`.

## Изменения 5.3.1

- Добавлена единая promise-карта загрузок JS/CSS в SFLoader.
- Параллельные relation-цепочки smart-компонентов больше не добавляют
  одинаковые `script` и `link` повторно.
- Ошибочная загрузка удаляется из карты, поэтому явный повтор после network
  failure остаётся возможным.

## Изменения 5.2.0

- Обновлен собранный SF5-дистрибутив из sf5.webpack.
- Обновлены core/component/smart/utility assets и правила загрузчика.
- Сохранен фикс cl-table: без relation на несуществующий обычный 	able, CSS грузится из smart-слоя.

## Изменения 5.1.2

- Исправлено правило загрузки cl-table.
- Убрана relation на несуществующий обычный компонент 	able.
- CSS для sf-table теперь грузится через smart-правило cl-table.

## Изменения 5.1.0

- Добавлены собранные компоненты `admin-menu`, `datepicker`, `tree`, `tree-item`.
- Обновлены smart metadata, loader/runtime assets и правила загрузчика.
- Расширены utility-модули `flex`, `align-content`, `headers`, `transform-translate`, `transform-translate-ext`, `transition-property`.

## Рекомендации для проектов

- Используйте конкретный pinned tag из соответствующего release note.
- Не подключайте `@main` в production, чтобы избежать непредсказуемых обновлений.
- При обновлении версии очищайте кеш CDN/браузера, если проект использует долгоживущий cache.
- Для локальной поставки храните структуру `distr/` без переименования внутренних директорий.
