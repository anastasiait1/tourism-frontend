import { z } from "zod";
const schema = z.object({
  VITE_API_BASE_URL: z.string().default("/api/v1"),
  VITE_USE_MOCKS: z.enum(["true", "false"]).default("true"),
  VITE_YANDEX_MAPS_API_KEY: z.string().optional().default(""),
});
const result = schema.safeParse(import.meta.env);
if (!result.success) throw new Error(`Некорректный .env: ${result.error.message}`);
export const env = {
  apiBaseUrl: result.data.VITE_API_BASE_URL.replace(/\/$/, ""),
  useMocks: result.data.VITE_USE_MOCKS === "true",
  yandexMapsApiKey: result.data.VITE_YANDEX_MAPS_API_KEY,
};
