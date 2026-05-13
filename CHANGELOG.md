# Changelog

Все заметные изменения SIMAI UI Core фиксируются в этом файле.

Формат версий: `major.minor.patch`. Для ветки SIMAI Framework 5 мажорная версия начинается с `5`.

## [5.0.0] - 2026-05-13

Первый формальный релиз SIMAI UI Core как статического дистрибутива.

### Добавлено

- Зафиксирована релизная версия `5.0.0`.
- Описана установка через CDN с pinned tag `v5.0.0`.
- Описана локальная установка через каталог `distr/`.
- Добавлены release notes: [docs/releases/5.0.0.md](docs/releases/5.0.0.md).

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
