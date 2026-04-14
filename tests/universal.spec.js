// @ts-check
/**
 * universal.spec.js — E2E-тесты для universal-table.html
 *
 * Структура:
 *   Setup wizard         — настройка структуры таблицы (@desktop, 13 тестов)
 *   Данные: контакты     — CRUD, фильтры, сортировка (@desktop, 24 теста)
 *   Данные: задачи       — числа, expand/markdown, экспорт (@desktop, 14 тестов)
 *   Мобайл: контакты     — адаптив, sheet, chips (@mobile, 14 тестов)
 *   Тема и брейкпоинт    — dark/light, 768px/769px (@desktop, 8 тестов)
 *
 * Итого: 73 теста
 *
 * Фикстуры генерируются в tests/fixtures/ из universal-table.html
 * перед запуском тестов (test.beforeAll).
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');

// ── Пути ─────────────────────────────────────────────────────────────────────

const TEMPLATE_PATH  = path.resolve(__dirname, '../universal-table.html');
const FIXTURES_DIR   = path.resolve(__dirname, 'fixtures');
const SETUP_URL      = `file://${TEMPLATE_PATH}`;

// ── Генератор фикстур ─────────────────────────────────────────────────────────

function makeFixture(config, rows) {
  const tpl = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  return tpl
    .replace(/const CONFIG = null;/, 'const CONFIG = ' + JSON.stringify(config, null, 2) + ';')
    .replace(/const ROWS = \[\];/,   'const ROWS = '   + JSON.stringify(rows,   null, 2) + ';');
}

function writeFixture(filename, config, rows) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
  const p = path.join(FIXTURES_DIR, filename);
  fs.writeFileSync(p, makeFixture(config, rows), 'utf8');
  return `file://${p}`;
}

// ── Тестовые данные: Контакты ─────────────────────────────────────────────────

const CONTACTS_CFG = {
  title: 'Контакты',
  filename: 'contacts.html',
  columns: [
    { id: 'name',    label: 'Имя',      type: 'text',   filter: false, sort: true  },
    { id: 'company', label: 'Компания', type: 'text',   filter: true,  sort: true  },
    { id: 'role',    label: 'Роль',     type: 'select', filter: true,  sort: false,
      options: ['PM', 'Dev', 'Designer'], allowNew: false },
    { id: 'date',    label: 'Дата',     type: 'date',   filter: false, sort: true  },
    { id: 'level',   label: 'Уровень',  type: 'select', filter: true,  sort: false,
      options: ['Junior', 'Middle', 'Senior'], allowNew: false },
  ],
  expand: null,
};

const CONTACTS_ROWS = [
  { id:  1, name: 'Alice',  company: 'Acme',  role: 'PM',       date: '2024-03-15', level: 'Senior'  },
  { id:  2, name: 'Bob',    company: 'Beta',  role: 'Dev',      date: '2024-01-20', level: 'Middle'  },
  { id:  3, name: 'Carol',  company: 'Acme',  role: 'Designer', date: '2024-05-01', level: 'Junior'  },
  { id:  4, name: 'Dave',   company: 'Gamma', role: 'PM',       date: '2023-11-10', level: 'Middle'  },
  { id:  5, name: 'Eve',    company: 'Beta',  role: 'Dev',      date: '2024-02-28', level: 'Senior'  },
  { id:  6, name: 'Frank',  company: 'Gamma', role: 'PM',       date: '2024-06-15', level: 'Middle'  },
  { id:  7, name: 'Grace',  company: 'Delta', role: 'Designer', date: '2023-09-05', level: 'Junior'  },
  { id:  8, name: 'Heidi',  company: 'Acme',  role: 'Dev',      date: '2024-04-10', level: 'Middle'  },
  { id:  9, name: 'Ivan',   company: 'Delta', role: 'PM',       date: '2024-07-01', level: 'Senior'  },
  { id: 10, name: 'Julia',  company: 'Gamma', role: 'Designer', date: '2023-12-20', level: 'Junior'  },
];

// ── Тестовые данные: Задачи ───────────────────────────────────────────────────

const TASKS_CFG = {
  title: 'Задачи',
  filename: 'tasks.html',
  columns: [
    { id: 'title',    label: 'Задача',    type: 'text',   filter: false, sort: true  },
    { id: 'priority', label: 'Приоритет', type: 'select', filter: true,  sort: false,
      options: ['High', 'Medium', 'Low'], allowNew: false },
    { id: 'due',      label: 'Срок',      type: 'date',   filter: false, sort: true  },
    { id: 'status',   label: 'Статус',    type: 'select', filter: true,  sort: false,
      options: ['Open', 'In progress', 'Done'], allowNew: false },
    { id: 'points',   label: 'Очки',      type: 'number', filter: false, sort: true  },
  ],
  expand: { id: 'notes', label: 'Описание' },
};

const TASKS_ROWS = [
  { id: 1, title: 'Setup CI/CD',       priority: 'High',   due: '2024-03-01', status: 'Done',        points:  8, notes: 'Настроить GitHub Actions для автотестов' },
  { id: 2, title: 'Design system',     priority: 'Medium', due: '2024-04-15', status: 'In progress', points: 13, notes: 'Компонентная библиотека в **Figma**' },
  { id: 3, title: 'API docs',          priority: 'Low',    due: '2024-02-20', status: 'Done',        points:  3, notes: 'Документация REST API:\n- GET /users\n- POST /tasks' },
  { id: 4, title: 'User research',     priority: 'High',   due: '2024-05-10', status: 'Open',        points:  5, notes: 'Провести 10 интервью с пользователями' },
  { id: 5, title: 'Performance audit', priority: 'Medium', due: '2024-03-25', status: 'Open',        points:  8, notes: 'Core Web Vitals анализ' },
  { id: 6, title: 'Mobile app',        priority: 'High',   due: '2024-06-01', status: 'In progress', points: 21, notes: 'iOS и Android версии приложения' },
  { id: 7, title: 'Analytics setup',   priority: 'Low',    due: '2024-01-15', status: 'Done',        points:  5, notes: 'Настройка Mixpanel и дашбордов' },
  { id: 8, title: 'Security audit',    priority: 'High',   due: '2024-07-20', status: 'Open',        points: 13, notes: 'OWASP Top 10 проверка' },
];

// ── Тестовые данные: Пустая таблица ──────────────────────────────────────────

const EMPTY_CFG = {
  title: 'Пустая таблица',
  filename: 'empty.html',
  columns: [
    { id: 'name',     label: 'Название', type: 'text',   filter: false, sort: true  },
    { id: 'category', label: 'Категория', type: 'select', filter: true, sort: false,
      options: ['A', 'B', 'C'], allowNew: true },
    { id: 'amount',   label: 'Сумма',    type: 'number', filter: false, sort: true  },
  ],
  expand: { id: 'notes', label: 'Заметки' },
};

// ── URL фикстур (заполняются в beforeAll) ─────────────────────────────────────

let CONTACTS_URL, TASKS_URL, EMPTY_URL;

test.beforeAll(async () => {
  CONTACTS_URL = writeFixture('contacts.html', CONTACTS_CFG, CONTACTS_ROWS);
  TASKS_URL    = writeFixture('tasks.html',    TASKS_CFG,    TASKS_ROWS);
  EMPTY_URL    = writeFixture('empty.html',    EMPTY_CFG,    []);
});

// ── Вспомогательные функции ───────────────────────────────────────────────────

async function gotoAndWait(page, url) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  // Ждём JS-рендеринг: либо карточка столбца (setup), либо строки/empty (data)
  await page.waitForSelector('.col-card, #list .item, #list .card, #list .empty', { timeout: 8000 });
}

async function countItems(page) {
  return page.locator('#list .item, #list .card').count();
}

async function getCountText(page) {
  const isMobile = (await page.viewportSize())?.width <= 768;
  const id = isMobile ? '#m-count' : '#subtitle-count';
  return (await page.locator(id).textContent()).trim();
}

// ════════════════════════════════════════════════════════════════════════════
// 1. Setup wizard — настройка структуры @desktop
// ════════════════════════════════════════════════════════════════════════════

test.describe('Setup wizard @desktop', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page, SETUP_URL);
  });

  // ─── Отображение ───────────────────────────────────────────────────────────

  test('setup-page виден, app скрыт', async ({ page }) => {
    await expect(page.locator('#setup-page')).toBeVisible();
    await expect(page.locator('#app')).toBeHidden();
  });

  test('форма содержит поля title, filename, кнопку Создать', async ({ page }) => {
    await expect(page.locator('#setup-title')).toBeVisible();
    await expect(page.locator('#setup-filename')).toBeVisible();
    await expect(page.locator('#btn-create')).toBeVisible();
  });

  test('по умолчанию присутствует 1 карточка столбца', async ({ page }) => {
    const cards = page.locator('.col-card');
    await expect(cards).toHaveCount(1);
  });

  // ─── Управление столбцами ──────────────────────────────────────────────────

  test('можно добавить 4 столбца (итого 5)', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.click('#btn-add-col');
    }
    await expect(page.locator('.col-card')).toHaveCount(5);
  });

  test('кнопка «Добавить столбец» заблокирована при 5 столбцах', async ({ page }) => {
    for (let i = 0; i < 4; i++) await page.click('#btn-add-col');
    await expect(page.locator('#btn-add-col')).toBeDisabled();
  });

  test('кнопка удаления столбца убирает карточку', async ({ page }) => {
    await page.click('#btn-add-col');
    await expect(page.locator('.col-card')).toHaveCount(2);
    await page.locator('.col-card').first().locator('.btn-remove-col').click();
    await expect(page.locator('.col-card')).toHaveCount(1);
  });

  test('тип «Список» показывает textarea для вариантов', async ({ page }) => {
    await page.locator('.col-card').first().locator('.col-type-sel').selectOption('select');
    await expect(page.locator('.col-options-block').first()).toHaveClass(/show/);
    await expect(page.locator('.col-options-textarea').first()).toBeVisible();
  });

  test('тип «Дата» блокирует чекбокс Фильтр', async ({ page }) => {
    await page.locator('.col-card').first().locator('.col-type-sel').selectOption('date');
    const filterCb = page.locator('.col-card').first().locator('.col-filter');
    await expect(filterCb).toBeDisabled();
  });

  test('тип «Число» блокирует чекбокс Фильтр', async ({ page }) => {
    await page.locator('.col-card').first().locator('.col-type-sel').selectOption('number');
    await expect(page.locator('.col-card').first().locator('.col-filter')).toBeDisabled();
  });

  // ─── Валидация ─────────────────────────────────────────────────────────────

  test('пустой title — показывает ошибку', async ({ page }) => {
    await page.locator('.col-name').first().fill('Тест');
    await page.click('#btn-create');
    await expect(page.locator('#setup-error')).toHaveClass(/show/);
    await expect(page.locator('#setup-error')).toContainText('Укажите название');
  });

  test('пустое название столбца — показывает ошибку', async ({ page }) => {
    await page.fill('#setup-title', 'Моя таблица');
    // название столбца не заполнено
    await page.click('#btn-create');
    await expect(page.locator('#setup-error')).toHaveClass(/show/);
    await expect(page.locator('#setup-error')).toContainText('Заполните названия');
  });

  // ─── Expand-поле ───────────────────────────────────────────────────────────

  test('toggle expand-поля включает/отключает поле названия', async ({ page }) => {
    const input = page.locator('#setup-expand-label');
    await expect(input).toBeDisabled();
    await page.check('#setup-expand-on');
    await expect(input).toBeEnabled();
    await page.uncheck('#setup-expand-on');
    await expect(input).toBeDisabled();
  });

  // ─── Создание таблицы ──────────────────────────────────────────────────────

  test('заполненная форма скачивает файл с корректным CONFIG', async ({ page }) => {
    await page.fill('#setup-title', 'Тест Загрузки');
    await page.fill('#setup-filename', 'test-download.html');
    await page.locator('.col-name').first().fill('Название');
    await page.locator('.col-type-sel').first().selectOption('text');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#btn-create'),
    ]);

    expect(download.suggestedFilename()).toBe('test-download.html');

    const savedPath = await download.path();
    const html = fs.readFileSync(savedPath, 'utf8');
    expect(html).toContain('"title": "Тест Загрузки"');
    expect(html).toContain('"id": "col_1"'); // Кириллица → fallback ID
    expect(html).toContain('const ROWS = []');
    expect(html).not.toContain('const CONFIG = null');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Данные: Контакты @desktop
// ════════════════════════════════════════════════════════════════════════════

test.describe('Данные: контакты @desktop', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page, CONTACTS_URL);
  });

  // ─── Read ──────────────────────────────────────────────────────────────────

  test('app-page виден, setup скрыт', async ({ page }) => {
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#setup-page')).toBeHidden();
  });

  test('заголовок таблицы = «Контакты»', async ({ page }) => {
    await expect(page.locator('#app-title')).toHaveText('Контакты');
  });

  test('счётчик показывает 10 записей', async ({ page }) => {
    const text = await getCountText(page);
    expect(text).toMatch(/^10/);
  });

  test('отображается 10 строк в списке', async ({ page }) => {
    expect(await countItems(page)).toBe(10);
  });

  test('заголовки столбцов соответствуют CONFIG', async ({ page }) => {
    const cells = page.locator('#list-header .list-header-cell');
    const texts = await cells.allTextContents();
    expect(texts).toContain('Имя');
    expect(texts).toContain('Компания');
    expect(texts).toContain('Роль');
    expect(texts).toContain('Дата');
    expect(texts).toContain('Уровень');
  });

  test('первый столбец (Имя) имеет стиль primary (font-weight: 600)', async ({ page }) => {
    const firstCell = page.locator('#list .item').first().locator('.item-cell.primary');
    await expect(firstCell).toBeVisible();
    await expect(firstCell).toHaveCSS('font-weight', '600');
  });

  test('дата отображается в формате DD.MM.YYYY', async ({ page }) => {
    const dateCells = page.locator('#list .item .date-cell');
    const first = await dateCells.first().textContent();
    expect(first).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
  });

  test('кнопка Сбросить скрыта при отсутствии фильтров', async ({ page }) => {
    await expect(page.locator('#btn-clear')).toBeHidden();
  });

  // ─── Filter ────────────────────────────────────────────────────────────────

  test('фильтр по Компании сужает список', async ({ page }) => {
    await page.selectOption('#f-company', 'Acme');
    const n = await countItems(page);
    expect(n).toBe(3); // Alice, Carol, Heidi
    const count = await getCountText(page);
    expect(count).toMatch(/^3/);
  });

  test('фильтр по Роли (select) сужает список', async ({ page }) => {
    await page.selectOption('#f-role', 'PM');
    const n = await countItems(page);
    expect(n).toBe(4); // Alice, Dave, Frank, Ivan
  });

  test('два фильтра совместно', async ({ page }) => {
    await page.selectOption('#f-company', 'Acme');
    await page.selectOption('#f-role', 'PM');
    const n = await countItems(page);
    expect(n).toBe(1); // только Alice
  });

  test('нулевой результат показывает empty-state', async ({ page }) => {
    await page.selectOption('#f-company', 'Delta');
    await page.selectOption('#f-role', 'Dev');
    await expect(page.locator('#list .empty')).toBeVisible();
    const n = await countItems(page);
    expect(n).toBe(0);
  });

  test('кнопка Сбросить видна при активном фильтре', async ({ page }) => {
    await page.selectOption('#f-company', 'Acme');
    await expect(page.locator('#btn-clear')).toBeVisible();
  });

  test('кнопка Сбросить восстанавливает полный список', async ({ page }) => {
    await page.selectOption('#f-role', 'Designer');
    expect(await countItems(page)).toBeLessThan(10);
    await page.click('#btn-clear');
    expect(await countItems(page)).toBe(10);
  });

  test('после добавления новая компания появляется в фильтре', async ({ page }) => {
    await page.click('#btn-add-d');
    const m = page.locator('#crud-modal');
    await m.locator('#modal-name').fill('Zara');
    await m.locator('#modal-company').fill('NewCorp');
    await m.locator('#modal-role').selectOption('PM');
    await m.locator('#modal-date').fill('2024-08-01');
    await m.locator('#modal-level').selectOption('Middle');
    await page.click('#btn-modal-submit');

    // Новая компания появляется в дропдауне
    const opt = page.locator('#f-company option[value="NewCorp"]');
    await expect(opt).toBeAttached();
  });

  // ─── Sort ──────────────────────────────────────────────────────────────────

  test('сортировка «Имя: А–Я» — первая запись имеет наименьшее имя', async ({ page }) => {
    await page.selectOption('#f-sort', 'name-asc');
    const first = await page.locator('#list .item').first().locator('.item-cell.primary').textContent();
    expect(first?.trim()).toBe('Alice');
  });

  test('сортировка «Имя: Я–А» — первая запись имеет наибольшее имя', async ({ page }) => {
    await page.selectOption('#f-sort', 'name-desc');
    const first = await page.locator('#list .item').first().locator('.item-cell.primary').textContent();
    expect(first?.trim()).toBe('Julia');
  });

  test('сортировка «Дата: ↑ старые» — даты идут по возрастанию', async ({ page }) => {
    await page.selectOption('#f-sort', 'date-asc');
    const dateCells = page.locator('#list .item .date-cell');
    const texts = (await dateCells.allTextContents()).slice(0, 5);
    // DD.MM.YYYY → сравниваем как строки YYYY-MM-DD
    const asDates = texts.map(t => { const [d,m,y]=t.split('.'); return `${y}-${m}-${d}`; });
    for (let i = 1; i < asDates.length; i++) {
      expect(asDates[i] >= asDates[i-1]).toBe(true);
    }
  });

  test('сортировка «Дата: ↓ новые» (default) — даты идут по убыванию', async ({ page }) => {
    // default sort = date-desc (первый date-col desc)
    const dateCells = page.locator('#list .item .date-cell');
    const texts = (await dateCells.allTextContents()).slice(0, 5);
    const asDates = texts.map(t => { const [d,m,y]=t.split('.'); return `${y}-${m}-${d}`; });
    for (let i = 1; i < asDates.length; i++) {
      expect(asDates[i] <= asDates[i-1]).toBe(true);
    }
  });

  test('сортировка «Компания: А–Я» — весь список отсортирован', async ({ page }) => {
    await page.selectOption('#f-sort', 'company-asc');
    const items = page.locator('#list .item');
    const n = await items.count();
    const companyCells = [];
    for (let i = 0; i < n; i++) {
      const cells = items.nth(i).locator('.item-cell');
      companyCells.push((await cells.nth(1).textContent())?.trim() ?? '');
    }
    for (let i = 1; i < companyCells.length; i++) {
      expect(companyCells[i].localeCompare(companyCells[i-1], 'ru') >= 0).toBe(true);
    }
  });

  test('сортировка «По номеру ↑» — первая запись имеет data-id=1', async ({ page }) => {
    await page.selectOption('#f-sort', 'id-asc');
    const first = await page.locator('#list .item').first().getAttribute('data-id');
    expect(first).toBe('1');
  });

  // ─── CRUD: Create ──────────────────────────────────────────────────────────

  test('кнопка «+ Добавить» открывает модальный диалог', async ({ page }) => {
    await page.click('#btn-add-d');
    await expect(page.locator('#crud-modal')).toBeVisible();
    await expect(page.locator('#modal-title-text')).toHaveText('Добавить запись');
  });

  test('валидация: пустой primary-поле не закрывает модал', async ({ page }) => {
    await page.click('#btn-add-d');
    await page.click('#btn-modal-submit');
    await expect(page.locator('#crud-modal')).toBeVisible();
    await expect(page.locator('#modal-name')).toHaveClass(/error/);
  });

  test('успешное добавление: запись появляется, счётчик растёт', async ({ page }) => {
    await page.click('#btn-add-d');
    const m = page.locator('#crud-modal');
    await m.locator('#modal-name').fill('Новый контакт');
    await m.locator('#modal-company').fill('Acme');
    await m.locator('#modal-role').selectOption('Dev');
    await m.locator('#modal-date').fill('2024-09-01');
    await m.locator('#modal-level').selectOption('Junior');
    await page.click('#btn-modal-submit');

    await expect(page.locator('#crud-modal')).toBeHidden();
    expect(await countItems(page)).toBe(11);
    const text = await getCountText(page);
    expect(text).toMatch(/^11/);
  });

  test('после добавления появляется индикатор «Есть изменения»', async ({ page }) => {
    await page.click('#btn-add-d');
    const m = page.locator('#crud-modal');
    await m.locator('#modal-name').fill('X');
    await m.locator('#modal-date').fill('2024-01-01');
    await page.click('#btn-modal-submit');

    await expect(page.locator('#unsaved-group-d')).toBeVisible();
  });

  // ─── CRUD: Update ──────────────────────────────────────────────────────────

  test('кнопка карандаша открывает форму редактирования с данными', async ({ page }) => {
    await page.locator('#list .item').first().locator('.btn-icon-edit').click();
    await expect(page.locator('#crud-modal')).toBeVisible();
    await expect(page.locator('#modal-title-text')).toHaveText('Редактировать запись');
    // первичное поле предзаполнено
    const nameVal = await page.locator('#modal-name').inputValue();
    expect(nameVal.length).toBeGreaterThan(0);
  });

  test('редактирование имени обновляет список', async ({ page }) => {
    await page.locator('#list .item').first().locator('.btn-icon-edit').click();
    await page.locator('#modal-name').fill('Alice UPDATED');
    await page.click('#btn-modal-submit');
    await expect(page.locator('#list')).toContainText('Alice UPDATED');
    expect(await countItems(page)).toBe(10);
  });

  test('клик «Редактировать» не раскрывает аккордеон', async ({ page }) => {
    const item = page.locator('#list .item').first();
    await item.locator('.btn-icon-edit').click();
    await page.click('#btn-modal-cancel');
    await expect(item).not.toHaveClass(/open/);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Данные: Задачи @desktop
// ════════════════════════════════════════════════════════════════════════════

test.describe('Данные: задачи @desktop', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page, TASKS_URL);
  });

  // ─── Числовой столбец ──────────────────────────────────────────────────────

  test('числовой столбец «Очки» отображается', async ({ page }) => {
    const headers = await page.locator('#list-header .list-header-cell').allTextContents();
    expect(headers).toContain('Очки');
  });

  test('сортировка «Очки ↑» — числа идут по возрастанию', async ({ page }) => {
    await page.selectOption('#f-sort', 'points-asc');
    const items = page.locator('#list .item');
    const n = await items.count();
    const nums = [];
    for (let i = 0; i < n; i++) {
      // Очки — 5-й столбец (index 4), после title/priority/due/status
      const cells = items.nth(i).locator('.item-cell');
      const txt = (await cells.nth(4).textContent())?.trim() ?? '0';
      nums.push(Number(txt));
    }
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i]).toBeGreaterThanOrEqual(nums[i-1]);
    }
  });

  test('сортировка «Очки ↓» — числа идут по убыванию', async ({ page }) => {
    await page.selectOption('#f-sort', 'points-desc');
    const items = page.locator('#list .item');
    const n = await items.count();
    const nums = [];
    for (let i = 0; i < n; i++) {
      const cells = items.nth(i).locator('.item-cell');
      const txt = (await cells.nth(4).textContent())?.trim() ?? '0';
      nums.push(Number(txt));
    }
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i]).toBeLessThanOrEqual(nums[i-1]);
    }
  });

  // ─── Expand / Markdown ─────────────────────────────────────────────────────

  test('шеврон отображается в каждой строке (expand включён)', async ({ page }) => {
    const chevrons = page.locator('#list .item .chevron');
    const n = await chevrons.count();
    expect(n).toBe(TASKS_ROWS.length);
  });

  test('клик по строке раскрывает expand-контент', async ({ page }) => {
    const item = page.locator('#list .item').first();
    await expect(item).not.toHaveClass(/open/);
    await item.click();
    await expect(item).toHaveClass(/open/);
    await expect(item.locator('.item-expand')).toBeVisible();
  });

  test('Markdown рендерится в раскрытом блоке', async ({ page }) => {
    // Задача 2 содержит **Figma** → должен отрендериться в <strong>
    await page.selectOption('#f-sort', 'id-asc');
    const item = page.locator('#list .item').nth(1); // Design system
    await item.click();
    await expect(item.locator('.item-expand-inner strong')).toBeVisible();
  });

  test('список у задачи 3 рендерится как <li>', async ({ page }) => {
    await page.selectOption('#f-sort', 'id-asc');
    const item = page.locator('#list .item').nth(2); // API docs
    await item.click();
    await expect(item.locator('.item-expand-inner li')).toHaveCount(2);
  });

  test('повторный клик сворачивает строку', async ({ page }) => {
    const item = page.locator('#list .item').first();
    await item.click();
    await expect(item).toHaveClass(/open/);
    await item.click();
    await expect(item).not.toHaveClass(/open/);
  });

  // ─── Delete ────────────────────────────────────────────────────────────────

  test('первый клик по корзине переводит кнопку в confirm-режим', async ({ page }) => {
    const delBtn = page.locator('#list .item').first().locator('.btn-icon-delete');
    await delBtn.click();
    await expect(delBtn).toHaveClass(/confirm/);
  });

  test('второй клик удаляет запись, счётчик уменьшается', async ({ page }) => {
    const delBtn = page.locator('#list .item').first().locator('.btn-icon-delete');
    await delBtn.click();
    await delBtn.click();
    expect(await countItems(page)).toBe(TASKS_ROWS.length - 1);
    const text = await getCountText(page);
    expect(text).toMatch(new RegExp(`^${TASKS_ROWS.length - 1}`));
  });

  test('удаление активирует индикатор изменений', async ({ page }) => {
    const delBtn = page.locator('#list .item').first().locator('.btn-icon-delete');
    await delBtn.click();
    await delBtn.click();
    await expect(page.locator('#unsaved-group-d')).toBeVisible();
  });

  // ─── Filter ────────────────────────────────────────────────────────────────

  test('фильтр по Приоритету «High» оставляет только High-задачи', async ({ page }) => {
    await page.selectOption('#f-priority', 'High');
    const n = await countItems(page);
    // High: Setup CI/CD, User research, Mobile app, Security audit = 4
    expect(n).toBe(4);
  });

  test('фильтр по Статусу «Done» + Приоритету «Low»', async ({ page }) => {
    await page.selectOption('#f-status', 'Done');
    await page.selectOption('#f-priority', 'Low');
    // API docs (Low, Done) + Analytics setup (Low, Done) = 2
    expect(await countItems(page)).toBe(2);
  });

  // ─── XLSX Export ───────────────────────────────────────────────────────────

  test('кнопка xlsx скачивает .xlsx файл', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#btn-export-d'),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
    const size = (await fs.promises.stat(await download.path())).size;
    expect(size).toBeGreaterThan(1000); // не пустой файл
  });

  test('xlsx скачивается для отфильтрованного набора', async ({ page }) => {
    await page.selectOption('#f-priority', 'High');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#btn-export-d'),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
    const size = (await fs.promises.stat(await download.path())).size;
    expect(size).toBeGreaterThan(500);
  });

  // ─── allowNew select ───────────────────────────────────────────────────────

  test('пустая таблица — добавление через allowNew select', async ({ page }) => {
    // empty fixture has category select with allowNew
    await gotoAndWait(page, EMPTY_URL);
    await page.click('#btn-add-d');
    const m = page.locator('#crud-modal');
    await m.locator('#modal-name').fill('Продукт А');
    await m.locator('#modal-category').selectOption('__other__');
    await expect(m.locator('#modal-category-other')).toHaveClass(/show/);
    await m.locator('#modal-category-other').fill('CustomCat');
    await m.locator('#modal-amount').fill('999');
    await page.click('#btn-modal-submit');
    await expect(page.locator('#list')).toContainText('Продукт А');
    expect(await countItems(page)).toBe(1);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Мобайл: Контакты @mobile
// ════════════════════════════════════════════════════════════════════════════

test.describe('Мобайл: контакты @mobile', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page, CONTACTS_URL);
  });

  // ─── Layout ────────────────────────────────────────────────────────────────

  test('топбар виден, filter-bar скрыт на мобайле', async ({ page }) => {
    await expect(page.locator('.topbar')).toBeVisible();
    await expect(page.locator('.filter-bar')).toBeHidden();
  });

  test('список отображается в виде карточек', async ({ page }) => {
    const cards = page.locator('#list .card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBe(10);
  });

  test('заголовок карточки = значение primary-столбца (Имя)', async ({ page }) => {
    const titles = await page.locator('#list .card .card-title').allTextContents();
    // все имена из фикстуры должны присутствовать
    expect(titles).toContain('Alice');
    expect(titles).toContain('Bob');
  });

  test('раскрытие карточки показывает остальные поля', async ({ page }) => {
    const card = page.locator('#list .card').first();
    await card.click();
    await expect(card.locator('.card-body')).toBeVisible();
    await expect(card.locator('.card-field')).toHaveCount(4); // company, role, date, level
  });

  // ─── Filter sheet ──────────────────────────────────────────────────────────

  test('кнопка «Фильтры» открывает bottom sheet и overlay', async ({ page }) => {
    await page.click('#btn-filter');
    await expect(page.locator('#sheet')).toHaveClass(/open/);
    await expect(page.locator('#overlay')).toHaveClass(/open/);
  });

  test('sheet содержит select-ы для фильтруемых столбцов', async ({ page }) => {
    await page.click('#btn-filter');
    await expect(page.locator('#s-company')).toBeVisible();
    await expect(page.locator('#s-role')).toBeVisible();
    await expect(page.locator('#s-level')).toBeVisible();
  });

  test('«Применить» в sheet фильтрует список и закрывает sheet', async ({ page }) => {
    await page.click('#btn-filter');
    await page.selectOption('#s-role', 'Designer');
    await page.click('#btn-apply');
    await expect(page.locator('#sheet')).not.toHaveClass(/open/);
    const n = await page.locator('#list .card').count();
    expect(n).toBe(3); // Carol, Grace, Julia
  });

  test('«Сбросить» в sheet сбрасывает фильтр и закрывает sheet', async ({ page }) => {
    await page.click('#btn-filter');
    await page.selectOption('#s-role', 'PM');
    await page.click('#btn-reset');
    await expect(page.locator('#sheet')).not.toHaveClass(/open/);
    expect(await page.locator('#list .card').count()).toBe(10);
  });

  test('клик по overlay закрывает sheet', async ({ page }) => {
    await page.click('#btn-filter');
    await page.click('#overlay');
    await expect(page.locator('#sheet')).not.toHaveClass(/open/);
  });

  // ─── Chips ─────────────────────────────────────────────────────────────────

  test('активный фильтр отображает chip', async ({ page }) => {
    await page.click('#btn-filter');
    await page.selectOption('#s-company', 'Acme');
    await page.click('#btn-apply');
    await expect(page.locator('#chips-row .chip')).toHaveCount(1);
    await expect(page.locator('#chips-row .chip').first()).toContainText('Acme');
  });

  test('chip × снимает фильтр', async ({ page }) => {
    await page.click('#btn-filter');
    await page.selectOption('#s-company', 'Beta');
    await page.click('#btn-apply');
    // Chip находится под sticky-топбаром — кликаем через JS
    await page.evaluate(() => document.querySelector('#chips-row .chip-x').click());
    expect(await page.locator('#list .card').count()).toBe(10);
    expect(await page.locator('#chips-row .chip').count()).toBe(0);
  });

  test('filter-badge показывает количество активных фильтров', async ({ page }) => {
    await page.click('#btn-filter');
    await page.selectOption('#s-company', 'Acme');
    await page.selectOption('#s-role', 'PM');
    await page.click('#btn-apply');
    await expect(page.locator('#filter-badge')).toHaveClass(/active/);
    await expect(page.locator('#filter-badge')).toContainText('2');
  });

  // ─── CRUD mobile ───────────────────────────────────────────────────────────

  test('кнопка «Добавить» в топбаре открывает модал', async ({ page }) => {
    await page.click('#btn-add-m');
    await expect(page.locator('#crud-modal')).toBeVisible();
  });

  test('удаление со второго клика на мобайле убирает карточку', async ({ page }) => {
    const card = page.locator('#list .card').first();
    await card.click(); // раскрыть
    const delBtn = card.locator('.btn-card-action-delete');
    await delBtn.click();
    await expect(delBtn).toHaveClass(/confirm/);
    await delBtn.click();
    expect(await page.locator('#list .card').count()).toBe(9);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Тема и брейкпоинт @desktop
// ════════════════════════════════════════════════════════════════════════════

test.describe('Тема и брейкпоинт @desktop', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page, CONTACTS_URL);
  });

  test('клик на иконку темы переключает data-theme на «dark»', async ({ page }) => {
    await page.click('#btn-theme-d');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('повторный клик возвращает «light»', async ({ page }) => {
    await page.click('#btn-theme-d');
    await page.click('#btn-theme-d');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('иконки sun/moon переключаются вместе с темой', async ({ page }) => {
    // В light-режиме — moon видна, sun скрыта
    await expect(page.locator('#btn-theme-d .icon-moon')).toBeVisible();
    await expect(page.locator('#btn-theme-d .icon-sun')).toBeHidden();
    await page.click('#btn-theme-d');
    await expect(page.locator('#btn-theme-d .icon-moon')).toBeHidden();
    await expect(page.locator('#btn-theme-d .icon-sun')).toBeVisible();
  });

  test('тема сохраняется в localStorage и восстанавливается при перезагрузке', async ({ page }) => {
    await page.click('#btn-theme-d'); // → dark
    await page.reload();
    await page.waitForSelector('#list');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  // ─── Breakpoint ────────────────────────────────────────────────────────────

  test('viewport 769px → desktop layout (filter-bar виден)', async ({ page }) => {
    await page.setViewportSize({ width: 769, height: 800 });
    await expect(page.locator('.filter-bar')).toBeVisible();
    await expect(page.locator('.topbar')).toBeHidden();
  });

  test('viewport 768px → mobile layout (topbar виден)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 });
    await expect(page.locator('.topbar')).toBeVisible();
    await expect(page.locator('.filter-bar')).toBeHidden();
  });

  test('resize с desktop на mobile без перезагрузки', async ({ page }) => {
    await expect(page.locator('.filter-bar')).toBeVisible();
    await page.setViewportSize({ width: 768, height: 800 });
    await page.waitForTimeout(200); // debounce render
    await expect(page.locator('.topbar')).toBeVisible();
    await expect(page.locator('#list .card').first()).toBeVisible();
  });

  test('resize с mobile на desktop без перезагрузки', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 });
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(200);
    await expect(page.locator('.filter-bar')).toBeVisible();
    await expect(page.locator('#list .item').first()).toBeVisible();
  });
});
