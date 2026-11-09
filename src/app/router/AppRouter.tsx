import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@app/layout/AppShell";
import { HomeScreen } from "@app/screens/HomeScreen";
import { LoginPage, RegisterPage, RequireAuth, useAuthStore } from "@domains/auth";
import { PlaceholderPage } from "@shared/ui/PlaceholderPage";
import { ObjectsPage } from "@domains/poi/pages/ObjectsPage";
import { PoiDetailPage } from "@domains/poi/pages/PoiDetailPage";
import { CreatePoiPage } from "@domains/poi/pages/CreatePoiPage";
function ProfileRoute() { return <RequireAuth><PlaceholderPage title="Профиль" /></RequireAuth>; }
function AdminRoute() { return <RequireAuth roles={["admin"]}><PlaceholderPage title="Администрирование" /></RequireAuth>; }
export function AppRouter() {
  const logout = useAuthStore((s) => s.logout);
  return <BrowserRouter><Routes><Route element={<AppShell onLogout={logout} />}>
    <Route path="/" element={<HomeScreen />} /><Route path="/objects" element={<ObjectsPage />} />
    <Route path="/objects/new" element={<CreatePoiPage />} />
    <Route path="/objects/:id" element={<PoiDetailPage />} />
    <Route path="/routes" element={<PlaceholderPage title="Маршруты" />} /><Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} /><Route path="/profile" element={<ProfileRoute />} />
    <Route path="/admin" element={<AdminRoute />} /><Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes></BrowserRouter>;
}
