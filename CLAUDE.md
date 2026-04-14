# CLAUDE.md — Universal Table

## Что это за проект

Self-modifying HTML-шаблон (`universal-table.html`) без сервера. Данные и конфигурация хранятся внутри файла; при сохранении `buildHtml()` заменяет их через regex и перезаписывает файл через File System Access API или download-fallback.

---

## Команды

```bash
npm test                   # все тесты (79 Playwright E2E)
npm run test:desktop       # только десктоп
npm run test:mobile        # только мобайл
npm run test:headed        # с открытым браузером
```

---

## Архитектура universal-table.html

### Режимы
- **Setup wizard** (`CONFIG = null`): форма настройки структуры → скачивает настроенный HTML
- **Data table** (`CONFIG = {...}`): рабочий режим с данными

### Данные
- `const CONFIG = null | {...}` — конфигурация (null = setup режим)
- `const ROWS = []` — read-only источник данных
- `let rows = ROWS.map(r=>({...r}))` — мутабельная рабочая копия
- `buildHtml(cfg, rws)` — regex-замена CONFIG и ROWS в HTML_TEMPLATE

### CONFIG.columns — структура столбца
```javascript
{
  id: 'field_id',    // slugified, JS-safe
  label: 'Название', // отображается в UI
  type: 'text|select|date|number',
  filter: true|false, // только text и select
  sort: true|false,
  options: [...],    // только type=select
  allowNew: false,   // select с вариантом «Другое...»
}
```

### CONFIG.expand
```javascript
expand: { id: 'notes', label: 'Описание' }  // Markdown-поле
expand: null  // нет expand
```

### slugify
Cyrillic → `col_1`, `col_2` (по позиции). ASCII → нормализация, уникализация суффиксом.

### Sort key
Формат `{colId}-asc` / `{colId}-desc`. Парсинг: `parts.split('-'); dir = parts.pop(); key = parts.join('-')`.

### CSS переменная --grid-cols
Устанавливается из JS: `document.documentElement.style.setProperty('--grid-cols', template)`. Используется и в `.list-header`, и в `.item`.

### Даты
- Хранятся в ISO: `YYYY-MM-DD`
- Отображаются через `fmtDate(s)`: `DD.MM.YYYY`
- Поле формы: `<input type="date">` — нативно принимает и отдаёт ISO

### XLSX export
Pure-JS OpenXML ZIP без зависимостей. Динамические заголовки из `CONFIG.columns`. Экспортирует текущую отфильтрованную выборку.

---

## Ловушки (уже исправленные, не повторять)

### 1. CSS specificity и hidden/dialog
```css
/* ОБЯЗАТЕЛЬНО — иначе CSS-класс переопределяет browser default */
.unsaved-group[hidden] { display:none !important; }
dialog.crud-modal:not([open]) { display:none !important; }
```

### 2. rows = ROWS.map arrow function
Обязательно: `rows=ROWS.map(r=>({...r}));` — скобки вокруг `{...r}` обязательны, иначе парсер читает как блок.

### 3. Клик по карточке
Клик-хэндлер должен быть `if(item)`, не `if(item && CONFIG.expand)` — иначе карточки без expand не раскрываются.

### 4. Scoped locators в тестах
```javascript
const m = page.locator('#crud-modal');
await m.locator('[name=priority]').selectOption('High');
// НЕ: await page.locator('[name=priority]')  ← найдёт и фильтр тоже
```

### 5. chip-x под sticky-топбаром (mobile тесты)
```javascript
// force:true недостаточно — использовать JS-level click:
await page.evaluate(() => document.querySelector('#chips-row .chip-x').click());
```

### 6. gotoAndWait в тестах фикстур
```javascript
// НЕ: '#list, #setup-page' — найдёт скрытый #setup-page в data-фикстурах
// ДА: ждать JS-рендеринг контента:
await page.waitForSelector('.col-card, #list .item, #list .card, #list .empty', { timeout: 8000 });
```

### 7. Кнопка удаления — confirm-состояние
При переходе в confirm на `.item` добавляется класс `has-confirm`:
```css
.item.has-confirm .item-actions { opacity:1 !important; }
```

### 8. ID записи скрыт из UI
Доступен через `el.dataset.id` (`data-id` атрибут). В тестах: `page.locator('#list .item').first().getAttribute('data-id')`.

---

## Генерация таблицы с данными

`table-template.md` — шаблон для заполнения пользователем. По нему генерируется готовый HTML через Python-скрипт.

### Скрипт генерации (Python)

```python
import json, re

# config — объект CONFIG, rows — список строк
with open('universal-table.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'const CONFIG = [\s\S]*?;(\s*\n)', 'const CONFIG = ' + json.dumps(config, ...) + ';\n', html, count=1)
html = re.sub(r'const ROWS = \[[\s\S]*?\];', 'const ROWS = ' + json.dumps(rows, ...) + ';', html, count=1)
```

### Ловушки генерации

**`count=1` обязателен** — без него `re.sub` заменяет `const CONFIG =` и внутри regex-паттерна в `buildHtml`, ломая его (ошибка `Invalid regular expression: missing /`).

**`id` обязателен в каждой строке ROWS** — без него `row.id === undefined`, expand не открывается, сортировка/удаление сломаны. Всегда добавлять `{"id": 1, ...}`, `{"id": 2, ...}` и т.д.

### Файлы, не публикуемые в git

- `table-template.md` — шаблон для генерации
- `Cases.html` и другие сгенерированные таблицы с данными
- `frontend-ui-design.md` — внутренние соглашения по UI
- `CLAUDE.md` — инструкции для AI

---

## Тесты

79 E2E-тестов в `tests/universal.spec.js`. Подробности — в `tests/TEST_COVERAGE.md`.

Фикстуры генерируются в `tests/fixtures/` в `beforeAll` — три предметные области (контакты, задачи, пустая таблица).
