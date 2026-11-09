import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "@app/providers/AppProviders";
import { AppRouter } from "@app/router/AppRouter";
import { env } from "@shared/config/env";
import "@shared/ui/styles.css";
import "@shared/ui/auth.css";
async function start() {
  if (env.useMocks) { const { worker } = await import("@mocks/browser"); await worker.start({ onUnhandledRequest: "bypass" }); }
  ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><AppProviders><AppRouter /></AppProviders></React.StrictMode>);
}
void start();
