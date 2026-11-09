import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Compass, LogOut, Menu, UserRound } from "lucide-react";
import { useAuthStore } from "@domains/auth";
type Props = { onLogout: () => void };
const nav = [{ to: "/", label: "Главная" }, { to: "/objects", label: "Объекты" }, { to: "/routes", label: "Маршруты" }];
export function AppShell({ onLogout }: Props) {
  const user = useAuthStore((s) => s.user); const navigate = useNavigate();
  const logout = () => { onLogout(); navigate("/", { replace: true }); };
  return <div className="min-h-screen bg-canvas"><header className="app-header">
    <Link to="/" className="brand" aria-label="GetAwayMap — главная"><span className="brand-mark"><Compass size={21} /></span><span>GetAway<span className="brand-accent">Map</span></span></Link>
    <nav className="hidden items-center gap-8 md:flex" aria-label="Основная навигация">{nav.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>{item.label}</NavLink>)}</nav>
    <div className="header-actions">{user ? <><Link className="header-login" to="/profile"><UserRound size={15} />{user.username}</Link>{user.role === "admin" && <Link className="header-login hidden sm:inline-flex" to="/admin">Админ-панель</Link>}<button className="icon-button" type="button" onClick={logout} aria-label="Выйти"><LogOut size={19} /></button></> : <Link className="header-login hidden md:inline-flex" to="/login">Войти</Link>}<button className="icon-button md:hidden" aria-label="Открыть меню" type="button"><Menu size={22} /></button></div>
  </header><main><Outlet /></main></div>;
}
