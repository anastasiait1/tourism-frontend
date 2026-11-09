# GetAwayMap

Frontend туристической краудсорсинговой платформы для путешествий по Беларуси.

## Требования
- Node.js 20+
- npm 10+

## Установка
```bash
npm install
npx msw init public/ --save
```
Создай `.env` из `.env.example` и добавь действующий ключ Яндекс.Карт:
```env
VITE_API_BASE_URL=/api/v1
VITE_USE_MOCKS=true
VITE_YANDEX_MAPS_API_KEY=your_yandex_maps_api_key
```
Запуск: `npm run dev`.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

## Проверки
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Mock-аккаунт администратора
- Email: `admin@getawaymap.test`
- Пароль: `admin1234`

Другого пользователя можно зарегистрировать через форму. Mock-пользователи хранятся в памяти вкладки и сбрасываются после перезагрузки.

## Этапы
- 1: инициализация, layout, маршрутизация.
- 2: HTTP-клиент, ApiError, Zod, MSW, регистрация, вход/выход, guards.
- 3: Яндекс.Карты v3, геолокация, POI по bbox, маркеры и кластеризация, responsive bottom sheet.
- 4: карточка объекта, поиск/фильтры и добавление POI с медиа.
