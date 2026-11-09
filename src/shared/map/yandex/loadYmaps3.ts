import React from "react";
import ReactDOM from "react-dom";
import type { YandexReactComponents } from "./ymaps3";

const API_URL = "https://api-maps.yandex.ru/v3/";
let loadingPromise: Promise<YandexReactComponents> | null = null;

function loadScript(apiKey: string): Promise<void> {
  if (window.ymaps3) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-ymaps3="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Не удалось загрузить Яндекс.Карты")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `${API_URL}?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.async = true;
    script.dataset.ymaps3 = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Не удалось загрузить Яндекс.Карты. Проверь API-ключ и подключение к интернету."));
    document.head.append(script);
  });
}

export function loadYmaps3(apiKey: string): Promise<YandexReactComponents> {
  if (!apiKey) return Promise.reject(new Error("Добавь VITE_YANDEX_MAPS_API_KEY в файл .env"));
  if (!loadingPromise) {
    loadingPromise = (async () => {
      await loadScript(apiKey);
      const ymaps3 = window.ymaps3;
      if (!ymaps3) throw new Error("Скрипт загрузился, но объект ymaps3 не найден");
      await ymaps3.ready;

      ymaps3.import.registerCdn(
        'https://cdn.jsdelivr.net/npm/{package}',
        '@yandex/ymaps3-default-ui-theme@latest',
      );

      const [reactifyModule, clustererModule, themeModule] = await Promise.all([
        ymaps3.import("@yandex/ymaps3-reactify"),
        import("@yandex/ymaps3-clusterer"),
        ymaps3.import("@yandex/ymaps3-default-ui-theme"),
      ]);

      const reactify = (reactifyModule.reactify as { bindTo: (react: typeof React, reactDom: typeof ReactDOM) => { module: (module: Record<string, unknown>) => Record<string, unknown> } }).bindTo(React, ReactDOM);
      const core = reactify.module(ymaps3 as unknown as Record<string, unknown>);
      const cluster = reactify.module(clustererModule);
      const theme = reactify.module(themeModule);

      return {
        ...core,
        ...cluster,
        ...theme,
      } as unknown as YandexReactComponents;
    })().catch((error: unknown) => {
      loadingPromise = null;
      throw error;
    });
  }
  return loadingPromise;
}
