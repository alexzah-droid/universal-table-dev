# Universal Table — Developer

[![Status](https://img.shields.io/badge/status-active-16a34a)](.)
[![License](https://img.shields.io/badge/license-MIT-0ea5e9)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-81%20E2E-8b5cf6)](tests/TEST_COVERAGE.md)
[![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-f7df1e?logo=javascript)](.)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20tests-00d4ff?logo=playwright)](tests/TEST_COVERAGE.md)

Репозиторий для разработчиков. Содержит исходник, тесты, UI-соглашения и инструкции для AI-ассистента.

Пользовательская версия (только HTML): [universal-table](https://github.com/alexzah-droid/universal-table)

---

## Архитектура

Self-modifying HTML-шаблон без сервера и зависимостей. Вся логика, стили и данные хранятся в одном файле `universal-table.html`.

### Режимы
- **Setup wizard** (`CONFIG = null`) — форма настройки структуры, скачивает настроенный HTML
- **Data table** (`CONFIG = {...}`) — рабочий режим с данными

### Ключевые механизмы
- `buildHtml(cfg, rws)` — regex-замена `CONFIG` и `ROWS` в `document.documentElement.outerHTML`, сохранение через File System Access API или download-fallback
- `safeStringify()` — JSON escape `</script>` для безопасного сохранения
- `sanitizeHtml()` — XSS-защита при рендеринге Markdown
- `--grid-cols` — CSS-переменная динамической сетки, устанавливается из JS
- Markdown рендеринг — marked.js, встроен в шаблон (не внешняя зависимость)
- XLSX export/import — pure-JS OpenXML ZIP без зависимостей, roundtrip editing. Импорт полностью заменяет данные (с confirm-диалогом)

Подробнее — в [`CLAUDE.md`](CLAUDE.md).

---

## Тесты

81 E2E-тест на Playwright: Setup wizard, CRUD, Filter, Sort, Expand/Markdown, XLSX export/import, Security (XSS, script escape), allowNew, тема, брейкпоинты.

```bash
npm install

npm test                 # все тесты
npm run test:desktop     # только десктоп
npm run test:mobile      # только мобайл
npm run test:headed      # с открытым браузером
npx playwright test --ui # интерактивный UI
npm run test:report      # HTML-отчёт последнего запуска
```

Покрытие — [`tests/TEST_COVERAGE.md`](tests/TEST_COVERAGE.md).

---

## UI-соглашения

Принципы, компоненты и CSS-паттерны — в [`frontend-ui-design.md`](frontend-ui-design.md).

Источник вдохновения: Apple HIG + glassmorphism + Material Design motion.

---

## Структура файлов

```
universal-table.html   — единственный продуктовый файл
frontend-ui-design.md  — UI/CSS соглашения и референсы
CLAUDE.md              — инструкции для AI-ассистента
tests/
  universal.spec.js    — 81 E2E-тест
  TEST_COVERAGE.md     — описание покрытия
  fixtures/            — генерируемые тестовые HTML-файлы
```

---

## Лицензия

MIT
