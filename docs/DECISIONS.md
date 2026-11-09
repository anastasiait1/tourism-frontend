# Архитектурные решения

## Этап 1 — инициализация
- Vite + React 18 + TypeScript strict; Tailwind CSS 3.
- Domains First; алиасы `@app/*`, `@shared/*`, `@domains/*`, `@mocks/*`.
- UI ориентирован на мобильные экраны и WCAG 2.1 AA.

## Этап 2 — HTTP и авторизация
- Запросы выполняются через `shared/api/http.ts`; endpoint-функции — в `domains/*/api`.
- `ApiError` нормализует строковый FastAPI `detail` и массив 422.
- MSW включается `VITE_USE_MOCKS=true`.
- Zustand persist хранит сессию в localStorage; production-стратегию хранения токенов нужно согласовать с backend.
- Login отправляет `URLSearchParams`: `username=email`, `password`.
- Пока `/users/me` отсутствует, пользователь восстанавливается из роли login и доступных полей JWT.
- Mock JWT имеет фиктивную подпись и используется только для UI-демо.

## Этап 3 — карта и POI
- Карта реализована через Яндекс.Карты JavaScript API v3 и `@yandex/ymaps3-reactify`; React-компоненты и кластеризатор загружаются через `ymaps3.import`.
- `MapProvider`-совместимый слой расположен в `shared/map`; экран не зависит от деталей загрузки API.
- Географические координаты везде имеют порядок `[longitude, latitude]` (WGS84).
- `YMapListener.onUpdate` передаёт `location.bounds` в `boundsToBbox`; запрос `GET /pois?bbox=min_lon,min_lat,max_lon,max_lat` выполняется с debounce 300 мс через отложенный query key и отменяется через AbortSignal при смене области.
- Кластеризация использует `@yandex/ymaps3-clusterer` и `clusterByGrid`.
- В демо используются MSW-fixtures. Для реального API установи `VITE_USE_MOCKS=false` и укажи действительный `VITE_API_BASE_URL`.
- Яндекс.Карты требуют действующий API-ключ и доступ к API; карта показывает понятное состояние ошибки при отсутствии ключа.
- Не кешировать и не сохранять тайлы Яндекс.Карт. В PWA офлайн-режим должен показывать данные POI/маршрутов отдельно от подложки карты.
