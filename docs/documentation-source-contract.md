# Documentation source contract

`scripts/build-framework-registry.py` формирует два согласованных результата из
одних owner manifests, loader rules и Framework Contract Registry:

- `contracts/generated/framework-contract-registry.json` — внутренний
  агрегированный контракт Framework;
- `contracts/generated/documentation-source.json` — нейтральную проекцию
  `docara.documentation_source.v1` для документационных систем.

Второй файл не редактируется вручную. В него входят только стабильный ключ,
тип сущности, публичный runtime-контракт, зависимости, обязательные варианты
примеров и точный provenance. Readiness, ссылки на конкретную документацию и
другие внутренние поля registry не участвуют в отпечатке документации.

Основные типы: `core`, `utility`, `component`, `smart_component`. Другие
source-owned типы, например `recipe`, сохраняются без потери смысла. Utility
rules уже сгруппированы owner registry в документируемые семейства.

При публикации Framework release lock размещает оба generated-файла в одном
закреплённом `contracts/generated` tree. В существующем
`framework_registry.documentation_source` указываются только относительный
путь и SHA-256 нейтрального файла; источник, commit и tree уже заданы самим
`framework_registry` и второй раз не копируются. Старые locks без этого
указателя продолжают работать через read-only compatibility adapter Docara с
диагностикой ограниченной точности.

## Семантика радиусов

- `--sf-radius--ui` — default для компактных контролов: кнопок, inputs,
  dropdown и подобных элементов;
- `--sf-radius-default` — default для карточек, панелей, блоков и других крупных
  поверхностей;
- `square` и `rounded` — явные overrides.

Значения токенов извлекаются из `distr/core/css/core.css`; зоны применения
являются частью публичного семантического контракта. Поэтому внутренний
рефакторинг не меняет документационный отпечаток, а смена назначения токена —
меняет.

## Проверка

```bash
SIMAI_UI_SMART_MANIFEST=/path/to/ui-smart/contracts/owners/smart-component.manifest.json \
  python3 scripts/build-framework-registry.py --check
```

Команда fail closed проверяет оба generated-файла. Для воспроизводимой пары
используйте owner manifest, закреплённый release lock текущего registry.
