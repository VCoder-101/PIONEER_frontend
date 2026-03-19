# PIONEER — Агрегатор услуг для транспортных средств

## Стек

- Next.js 14 (App Router)
- React 18
- JavaScript (JSX)
- Tailwind CSS

## Запуск проекта

```bash
npm install
npm run dev
```

Открыть в браузере: http://localhost:3000

## Продакшн сборка

```bash
npm run build
npm start
```

## Структура проекта

```
app/                   — экраны приложения
  select-role/         — выбор роли (10.1)
  login/               — вход по email + код
  register/            — регистрация по email + код (10.2)
  services/            — выбор услуги (10.3)
  organizations/       — поиск организации (10.4)
  service-details/     — состав услуги (10.5)
  booking-time/        — выбор времени (10.6)
  booking-confirm/     — подтверждение записи (10.7)
  privacy/             — политика конфиденциальности
  admin/requests/      — панель администратора (заглушка)
  org/connect/         — подключение организации (заглушка)

components/ui/         — переиспользуемые компоненты
api/                   — базовый HTTP клиент (Bearer токен, обработка 401)
services/              — запросы к API
hooks/                 — React хуки (useAuth)
lib/                   — константы и маршруты
```

## Демо режим

Пока бэкенд не подключён, авторизация работает в демо режиме.  
Ввести любой email — код подтверждения: **4444**

Для подключения бэкенда:
1. Создать `.env.local` по образцу `.env.local.example`
2. Установить `NEXT_PUBLIC_API_URL=http://адрес-бэкенда`
3. В `services/authService.js` установить `DEMO_MODE = false`
