# Labunets Condition — Telegram Mini App

Первый этап MVP: каркас приложения, который запускается локально и готов к выкладке на Vercel. Данные пока живут в памяти (мок), без оплаты и без сложной backend-архитектуры.

Лендинг школы остаётся в корне репозитория. Mini App — в этой папке.

## Как устроено

```
Telegram
  └─ Mini App (этот React SPA на Vercel)
       ├─ Telegram WebApp API  → кто открыл приложение
       ├─ сейчас: MockRepository (локальное состояние)
       └─ дальше: Supabase (Postgres + RLS)
```

Один фронтенд, два режима:

- ученик: профиль, абонемент, расписание, запись, отмена, история;
- админ: ученики, создание тренировок, записавшиеся, посещаемость, остаток тренировок.

Роль админа задаётся списком Telegram ID в `VITE_ADMIN_TELEGRAM_IDS`.

Слой данных скрыт за интерфейсом `AppRepository`. Сейчас подключен мок. На следующем этапе за ним появится Supabase, страницы менять не нужно.

## Структура

```
mini-app/
  src/
    app/                 # оболочка, роутинг, сессия Telegram
    pages/student/       # экраны ученика
    pages/admin/         # админ-панель
    data/                # репозиторий и мок-данные
    shared/lib/          # Telegram, Supabase-клиент, даты, env
    shared/ui/           # кнопки, карточки, таббар
    types/               # доменные типы
    styles/
  supabase/schema.draft.sql   # черновик таблиц, пока не применяем
  .env.example
  vercel.json
```

## Запуск локально

Нужен Node.js 20+.

```bash
cd mini-app
copy .env.example .env
npm install
npm run dev
```

В браузере:

- ученик: [http://localhost:5173](http://localhost:5173)
- админ: [http://localhost:5173/?admin=1](http://localhost:5173/?admin=1)

Внутри Telegram пользователь возьмётся из `window.Telegram.WebApp.initDataUnsafe.user`. В браузере подставляется тестовый пользователь, пока `VITE_DEV_MOCK_USER=1`.

## Vercel

1. Импортируйте этот репозиторий.
2. Root Directory: `mini-app`.
3. Build Command: `npm run build`.
4. Output: `dist`.
5. Добавьте те же `VITE_*` переменные, что в `.env.example`.
6. Для продакшена выключите `VITE_DEV_MOCK_USER`.

`vercel.json` уже отдаёт все маршруты в `index.html`.

## Что уже можно проверить

- профиль и текущий абонемент;
- остаток тренировок;
- расписание, запись и отмена;
- история;
- админка: ученики, создание тренировки, посещаемость, `+ / −` по абонементу.

Данные сбрасываются после перезагрузки страницы — это ожидаемо для мока.

## Следующий этап — только после подтверждения

1. Создать проект Supabase и применить схему.
2. Подключить реальный репозиторий вместо мока.
3. Создать Telegram-бота и привязать Mini App к HTTPS-URL с Vercel.
4. Позже: проверка `initData` на сервере (Edge Function). Пока не делаем.
