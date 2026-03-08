PIONEER — Агрегатор услуг для транспортных средств

Стек :

Next.js 14 (App Router)
React 18
JavaScript (JSX)
CSS Tailwind

Запуск проекта :

npm install
npm run dev

Открыть в браузере: http://localhost:3000

Структура проекта :

app/                    - экраны приложения
  select-role/          - выбор роли
  login/                - вход по email + код
  register/             - регистрация
  services/             - выбор услуги
  organizations/        - поиск организации
  service-details/      - состав услуги
  booking-time/         - выбор времени
  booking-confirm/      - подтверждение записи

components/ui/          - переиспользуемые компоненты
api/                    - базовый HTTP клиент
services/               - запросы к API
hooks/                  - React хуки
lib/                    - константы и утилиты

Демо режим
Пока бэкенд не подключён, авторизация работает в демо режиме.
Ввести любой email - код подтверждения: 4444