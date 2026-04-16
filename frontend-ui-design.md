# Frontend UI Design — Принципы и референсы

Живой документ. Описывает подходы и стиль, которые мы считаем эталонными.
Не жёсткий стандарт — референс и отправная точка для новых проектов.

---

## Философия

**Источник вдохновения:** Apple Human Interface Guidelines + современный web.

Ключевые идеи:
- Интерфейс не должен кричать — он должен отступать, давая пространство контенту
- Глубина создаётся светом и прозрачностью, а не жирными рамками
- Анимации коммуницируют, а не украшают
- Мобильный и десктопный UI — разные паттерны, не одно и то же масштабированное

**Референсы:**
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) — главный источник
- [Apple Design Resources](https://developer.apple.com/design/resources/) — UI kit, шрифты, иконки
- [Refactoring UI](https://www.refactoringui.com/) — практические принципы без лишней теории
- [Material Design 3](https://m3.material.io/) — альтернативный подход, хорошая документация по motion

---

## Цветовая система

### Акцент
```css
--accent: #007AFF;  /* системный синий Apple, читается на светлом и тёмном */
```

### Текст — три уровня иерархии
```css
/* Light mode */
--t1: #1d1d1f;   /* основной текст, заголовки */
--t2: #6e6e73;   /* вторичный: подписи, метаданные */
--t3: #aeaeb2;   /* третичный: номера, даты, placeholder */

/* Dark mode */
--t1: #f5f5f7;
--t2: #98989d;
--t3: #636366;
```

Принцип: иерархию создаём цветом, а не только размером шрифта.

> **Соглашение по именованию:** допустимы оба варианта — `--t1/--t2/--t3` (семантически) и `--fg/--fg2/--fg3` (короче). В рамках одного проекта придерживаться одного стиля. Тёмный `--t3` в adaptive.html: `#48484a`.

### Фон
```css
/* Light */
--bg: #f2f2f7;   /* системный серый Apple, не чисто белый */

/* Dark */
--bg: #000000;   /* или #1c1c1e для немного мягче */
```

### Разделители и границы
```css
--sep: rgba(0,0,0,0.07);          /* light */
--sep: rgba(255,255,255,0.08);    /* dark */
```

### Семантические цвета бейджей
Принцип пары `[текст, фон]`: фон — бледный оттенок (~10% opacity) того же цвета.
```js
// Пример
'FinTech':    ['#0071E3', '#deeeff'],
'HRTech':     ['#00C7BE', '#dcfaf9'],
'Senior':     ['#6E56CF', '#eeebff'],
'Junior':     ['#28a745', '#eaf7ed'],
```

**Референсы:**
- [Radix Colors](https://www.radix-ui.com/colors) — готовая семантическая палитра с dark mode
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors) — удобная шкала оттенков

---

## Типографика

```css
--font: -apple-system, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
```

Системный шрифт: на macOS/iOS рендерится SF Pro, на Windows — Segoe UI (через Helvetica Neue/Arial). Не требует загрузки, мгновенно, нативно ощущается.

### Шкала размеров (web)
```css
10–11px  — лейблы, badge, вспомогательное
12–13px  — метаданные, подписи, фильтры
14–15px  — основной текст списков
16–17px  — заголовки карточек (мобайл)
20px     — заголовок topbar (мобайл)
22–28px  — H1 страницы
```

### Веса
- `400` — основной текст
- `500` — метаданные, подписи
- `600` — акцентный, кнопки, badge
- `700` — заголовки

### Числа: tabular-nums
Для дат, id, чисел — фиксированная ширина цифр:
```css
font-variant-numeric: tabular-nums;
```

**Референсы:**
- [Type Scale](https://typescale.com/) — генератор шкалы
- [Inter](https://rsms.me/inter/) — если нужен кастомный шрифт вместо системного

---

## Скругления и отступы

```css
--r:    14px;   /* карточки, панели */
--r-sm:  9px;   /* кнопки, select, input */
--r-xs:  6px;   /* мелкие элементы */
/* badge: border-radius: 20px — таблетка */
/* bottom sheet: 20px 20px 0 0 — только сверху */
```

Принцип: чем больше элемент — тем больше радиус.

---

## Glassmorphism

Главный визуальный приём для панелей, карточек, модальных окон.

```css
.glass {
  background: rgba(255,255,255,0.80);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(0,0,0,0.07);
  /* блик сверху — имитирует освещение */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.60),
    0 2px 8px rgba(0,0,0,0.05),
    0 6px 20px rgba(0,0,0,0.04);
}

/* Dark mode */
.glass-dark {
  background: rgba(28,28,30,0.80);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    0 2px 8px rgba(0,0,0,0.3),
    0 6px 20px rgba(0,0,0,0.25);
}
```

Три слоя эффекта:
1. **Полупрозрачность** — `rgba(..., 0.80)` — виден фон за элементом
2. **Blur + saturate** — размытие и насыщение фона, "матовое стекло"
3. **Inset-тень** — 1px блик сверху, имитирует рассеянный свет

⚠️ `backdrop-filter` даёт нагрузку на GPU. Не злоупотреблять на медленных устройствах. Для элементов, которых много на экране — можно заменить на `background: rgba(..., 0.95)`.

**Референсы:**
- [CSS backdrop-filter — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [Glassmorphism generator](https://css.glass/)

---

## Фоновый градиент

Многослойные radial-gradient создают глубину без тяжёлых изображений:

```css
body {
  background-color: #f2f2f7;
  background-image:
    radial-gradient(ellipse 60% 50% at 15% 15%, rgba(0,122,255,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 85% 80%, rgba(88,86,214,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 55% 5%,  rgba(52,199,89,0.05) 0%, transparent 50%);
  background-attachment: fixed; /* не скроллится вместе с контентом */
}
```

Opacity 5–8% — пятна еле заметны, создают ощущение, не отвлекают.
`background-attachment: fixed` — пятна остаются на месте при скролле, как будто светят сзади.

---

## Анимации и переходы

### Главная кривая
```css
/* Material Design "standard easing" — быстрый старт, мягкое торможение */
transition: ... 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```

### Expand-контент внутри карточки

Раскрывающийся блок — часть карточки, не вложенный блок. Отделяется только разделителем сверху:

```css
.item-expand-inner {
  padding: 12px 14px;
  border-top: 1px solid var(--sep);   /* разделитель, не рамка */
  font-size: 13px;
  line-height: 1.7;
  color: var(--t2);                   /* приглушённый текст */
  /* НЕ добавлять: background, border (full), border-radius — */
  /* создаёт "коробку в коробке", противоречит Apple HIG */
}
```

### Аккордеон без JS-измерений
Трюк с `grid-template-rows` — анимирует высоту без `height: auto`:
```css
.body {
  display: grid;
  grid-template-rows: 0fr;                              /* закрыто */
  transition: grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1);
}
.open .body { grid-template-rows: 1fr; }                /* открыто */
.body-inner { overflow: hidden; }                       /* обязателен
```

### Bottom sheet
```css
.sheet {
  transform: translateY(100%);                          /* за нижним краем */
  transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
}
.sheet.open { transform: translateY(0); }
```

### Оверлей
```css
.overlay { opacity: 0; pointer-events: none; transition: opacity 0.25s; }
.overlay.visible { opacity: 1; pointer-events: auto; }
```

JS только переключает классы — вся анимация на CSS.

**Референсы:**
- [Motion — Apple HIG](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Easing functions](https://easings.net/) — визуальный справочник кривых
- [cubic-bezier.com](https://cubic-bezier.com/) — интерактивный редактор

---

## Компоненты

### Badge / Тег
```css
.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2.5px 7px;
  border-radius: 20px;      /* таблетка */
  white-space: nowrap;
  letter-spacing: 0.05px;
  /* цвет задаётся inline через style="color:X;background:Y" */
}
```

### Select без нативного UI
```css
select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,..."); /* SVG-стрелка inline */
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 10px;
  padding-right: 30px;
}
```

### Кнопка — основная
```css
.btn-primary {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--r-sm);
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-primary:active { opacity: 0.85; }
```

### Кнопка — вторичная
```css
.btn-secondary {
  background: rgba(120,120,128,0.12);
  color: var(--t1);
  border: none;
  border-radius: var(--r-sm);
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-secondary:active { background: rgba(120,120,128,0.20); }
```

### Кнопка-призрак (ghost)
```css
.btn-ghost {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-ghost:hover { background: rgba(0,122,255,0.09); }
```

---

## Desktop-паттерны

### Максимальная ширина контента
```css
.container { max-width: 1120px; margin: 0 auto; }
```

### Строки-аккордеоны (таблица без `<table>`)
```css
.item-row {
  display: grid;
  grid-template-columns: 34px 1fr 112px 146px 74px 88px 30px;
  /* id | company | direction | profession | grade | date | chevron */
  align-items: center;
  column-gap: 12px;
  padding: 11px 14px;
  cursor: pointer;
}
```

### Шеврон-поворот при открытии
```css
.chev { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), color 0.15s; }
.open .chev { transform: rotate(90deg); color: var(--accent); }
```

---

## Mobile-паттерны

### Safe Area (iPhone notch / Dynamic Island)
```css
:root {
  --safe-t: env(safe-area-inset-top, 0px);
  --safe-b: env(safe-area-inset-bottom, 0px);
}
.topbar { padding-top: calc(var(--safe-t) + 14px); }
body    { padding-bottom: calc(80px + var(--safe-b)); }
```
На Android и десктопе `env(...)` возвращает `0px` — ничего не ломается.

### Sticky topbar (mobile)
```css
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg2);
  backdrop-filter: var(--blur);
}
```

### Sticky filter-bar (desktop)
```css
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: transparent;       /* без видимой подложки */
  backdrop-filter: var(--blur);   /* blur при скролле */
}
```
**Важно:** фон `transparent`, не `--bg` и не `--bg2` — иначе видна серая полоса на фоне страничного градиента.

### Touch-targets: минимум 44px
```css
.btn, .card-row, .chip { min-height: 44px; }  /* Apple HIG requirement */
```

### Bottom sheet (фильтры, меню, детали)
- Handle-индикатор сверху: `width:36px; height:4px; border-radius:2px`
- `max-height: 92dvh` + `overflow-y: auto` — чтобы не выходил за экран
- `border-radius: 20px 20px 0 0` — скруглён только сверху
- `-webkit-overflow-scrolling: touch` — плавный инерционный скролл на iOS

### Chips (активные фильтры)
```css
.chip {
  background: rgba(0,122,255,0.10);
  color: var(--accent);
  border-radius: 14px;
  padding: 0 10px;
  height: 28px;
  font-size: 12px;
  font-weight: 600;
}
```

### `dvh` вместо `vh`
```css
min-height: 100dvh;  /* учитывает динамическую адресную строку браузера */
```
`100vh` на мобиле даёт лишний скролл из-за адресной строки. `dvh` — правильно.

---

## Адаптивность

### Брейкпоинты
```css
/* Mobile first или Desktop first — оба подхода ок, главное не мешать */
@media (max-width: 768px)  { /* мобайл */ }
@media (min-width: 769px)  { /* десктоп */ }
@media (max-width: 900px)  { /* планшет / узкий десктоп */ }
```

### Детекция режима в JS (без userAgent)
```js
const mq = window.matchMedia('(max-width: 768px)');
const isMobile = () => mq.matches;
mq.addEventListener('change', () => render());  // реагирует на resize
```
`userAgent` — ненадёжен. `matchMedia` — синхронен с CSS.

### Скрытие элементов другого режима
```css
@media (min-width: 769px) { .mobile-only { display: none !important; } }
@media (max-width: 768px) { .desktop-only { display: none !important; } }
```

---

## Тёмная тема

### Подход: data-theme на `<html>` + localStorage

Управление полностью через JS — без `@media (prefers-color-scheme)` в CSS.
Это позволяет ручному выбору пользователя всегда побеждать системную настройку.

**Почему не `@media` в CSS:**
`@media (prefers-color-scheme: dark)` не позволяет переопределить системную тему без дополнительного селектора-исключения. Подход с `data-theme` чище: одно место для всех тёмных переменных.

### Антифлеш: inline script в `<head>`

Обязательно — иначе при системной тёмной теме страница мигает светлым фоном.
Скрипт запускается синхронно до любой отрисовки:

```html
<head>
<script>(function(){
  var t = localStorage.getItem('theme');
  var s = window.matchMedia('(prefers-color-scheme:dark)').matches;
  if (t === 'dark' || (t !== 'light' && s))
    document.documentElement.setAttribute('data-theme', 'dark');
})()</script>
<meta charset="UTF-8">
...
```

### CSS-переменные

```css
/* Light — default */
:root {
  --bg:         #f2f2f7;
  --glass:      rgba(255,255,255,0.80);
  --glass-hi:   rgba(255,255,255,0.60);
  --glass-bdr:  rgba(0,0,0,0.07);
  --accent:     #007AFF;
  --t1:         #1d1d1f;
  --t2:         #6e6e73;
  --t3:         #aeaeb2;
  --sep:        rgba(0,0,0,0.07);
}

/* Dark */
html[data-theme="dark"] {
  --bg:         #000000;
  --glass:      rgba(28,28,30,0.88);
  --glass-hi:   rgba(255,255,255,0.06);
  --glass-bdr:  rgba(255,255,255,0.09);
  --accent:     #0A84FF;          /* iOS dark blue — чуть ярче */
  --t1:         #f5f5f7;
  --t2:         #98989d;
  --t3:         #48484a;
  --sep:        rgba(255,255,255,0.08);
}
```

### Фоновый градиент в тёмной теме

```css
html[data-theme="dark"] body {
  background-image:
    radial-gradient(ellipse 60% 50% at 15% 15%, rgba(10,132,255,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 85% 80%, rgba(94,92,230,0.10)  0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 55% 5%,  rgba(52,199,89,0.06)  0%, transparent 50%);
}
```

Opacity чуть выше чем в светлой (0.07→0.12), чтобы пятна были заметны на чёрном.

### Что нужно переопределить явно

Некоторые значения захардкожены и не меняются через переменные:

```css
/* Ховеры с rgba(0,0,0,...) — невидимы на тёмном */
html[data-theme="dark"] .item-row:hover { background: rgba(255,255,255,0.04); }

/* SVG-стрелки select — перекодируем с новым цветом */
html[data-theme="dark"] .sel-wrap::after {
  background-image: url("data:image/svg+xml,...stroke='%2398989d'...");
}

/* Chip */
html[data-theme="dark"] .chip { background: rgba(10,132,255,0.18); }
```

### Переключатель тем

Кнопка с иконками луна/солнце. Иконки переключаются через CSS без JS:

```css
.btn-theme .icon-sun  { display: none;  }   /* в светлой — скрыто */
.btn-theme .icon-moon { display: block; }   /* в светлой — видна луна */

html[data-theme="dark"] .btn-theme .icon-sun  { display: block; }  /* в тёмной — солнце */
html[data-theme="dark"] .btn-theme .icon-moon { display: none;  }
```

```js
function toggleTheme() {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

Логика приоритетов:
1. `localStorage` → всегда побеждает
2. `prefers-color-scheme` → используется если нет сохранённого выбора
3. Дефолт → светлая тема

### Тени в тёмной теме

Светлые тени на тёмном фоне не видны — нужно усилить:

```css
/* Light */
--sh: 0 2px 8px rgba(0,0,0,0.05), 0 6px 20px rgba(0,0,0,0.04);

/* Dark */
--sh: 0 2px 8px rgba(0,0,0,0.35), 0 6px 20px rgba(0,0,0,0.25);
```

**Референсы:**
- [Radix Colors dark scales](https://www.radix-ui.com/colors) — готовые пары light/dark
- [Dark mode — Apple HIG](https://developer.apple.com/design/human-interface-guidelines/dark-mode)
- [prefers-color-scheme — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

## Иконки

Используем inline SVG — без зависимостей, мгновенная загрузка, легко перекрашиваются через `currentColor`:

```html
<svg viewBox="0 0 16 16" fill="none" width="16" height="16">
  <path d="..." stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

```css
.icon { color: var(--t3); }
.icon:hover { color: var(--accent); }
/* stroke наследует currentColor автоматически */
```

**Библиотеки иконок:**
- [Heroicons](https://heroicons.com/) — минималистичные, MIT
- [Lucide](https://lucide.dev/) — продолжение Feather, MIT, отличное качество
- [SF Symbols](https://developer.apple.com/sf-symbols/) — для iOS/macOS нативных приложений
- [Phosphor Icons](https://phosphoricons.com/) — большой выбор весов

---

## Библиотеки и инструменты

### Компоненты и дизайн-системы
- [shadcn/ui](https://ui.shadcn.com/) — React-компоненты, копируются в проект (не зависимость)
- [Radix UI](https://www.radix-ui.com/) — unstyled, доступные примитивы
- [Headless UI](https://headlessui.com/) — от Tailwind, unstyled компоненты

### CSS-утилиты
- [Tailwind CSS](https://tailwindcss.com/) — utility-first, хорошо для быстрого прототипирования
- [Open Props](https://open-props.style/) — CSS custom properties, хорошая шкала значений

### Вдохновение и референсы UI
- [Dribbble — iOS UI](https://dribbble.com/tags/ios-ui)
- [mobbin.com](https://mobbin.com/) — скриншоты реальных приложений iOS/Android
- [scrnshts.club](https://scrnshts.club/) — App Store скрины
- [land-book.com](https://land-book.com/) — лендинги

### Инструменты
- [Figma](https://www.figma.com/) — дизайн и прототипирование
- [cubic-bezier.com](https://cubic-bezier.com/) — редактор кривых анимаций
- [Coolors](https://coolors.co/) — подбор палитры
- [Accessible color matrix](https://accessible-colors.com/) — проверка контраста WCAG
