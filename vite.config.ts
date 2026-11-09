import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: {
    "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
    "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
    "@domains": fileURLToPath(new URL("./src/domains", import.meta.url)),
    "@mocks": fileURLToPath(new URL("./src/mocks", import.meta.url)),
  }},
  server: { proxy: { "/api": { target: "http://localhost:8000", changeOrigin: true } } },
  build: {
    target: 'esnext', // или 'es2022'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext', // Разрешаем top-level await на этапе оптимизации
    },
  },
});
