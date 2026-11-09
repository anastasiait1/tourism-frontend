# Патч этапа 2

Скопируй содержимое папки `src` поверх `src` проекта этапа 1 с заменой файлов. Обнови `package.json` по инструкции ниже, установи зависимости и создай service worker MSW.

## Зависимости

```bash
npm install @tanstack/react-query zod react-hook-form @hookform/resolvers msw
npx msw init public/ --save
```

В `package.json` измени скрипт typecheck на `tsc -b`.

В `.env`:

```env
VITE_API_BASE_URL=/api/v1
VITE_USE_MOCKS=true
```

Тестовый admin: `admin@getawaymap.test` / `admin1234`.

В `package.json` добавь зависимости:

```json
{
  "@tanstack/react-query": "^5.62.11",
  "zod": "^3.24.1",
  "react-hook-form": "^7.54.2",
  "@hookform/resolvers": "^3.9.1",
  "msw": "^2.7.0"
}
```

И замени `typecheck` на `tsc -b`.
