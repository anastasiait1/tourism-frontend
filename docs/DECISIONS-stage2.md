# Решения этапа 2

- Все запросы проходят через `shared/api/http.ts`; endpoint-функции принадлежат домену.
- `ApiError` преобразует FastAPI `detail` (строку или массив 422) в единый тип.
- MSW включается через `VITE_USE_MOCKS=true`; worker генерируется `npx msw init public/ --save`.
- Zustand persist сохраняет сессию в localStorage. Для production необходимо согласовать безопасное хранение токенов с backend.
- Login отправляет `URLSearchParams`: `username=email`, `password`; content type `application/x-www-form-urlencoded`.
- Поскольку `/users/me` отсутствует, профиль сессии восстанавливается из роли ответа login и JWT claims.
- Mock JWT имеет фиктивную подпись и используется только для демонстрации интерфейса.
