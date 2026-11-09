import type { UserRole } from "./auth.schemas";
type JwtPayload = { sub?: string; username?: string; email?: string };
export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="))) as JwtPayload;
  } catch { return null; }
}
export function userFromToken(token: string, role: UserRole) {
  const payload = parseJwtPayload(token);
  return { username: payload?.username ?? payload?.sub ?? "Пользователь", email: payload?.email, role };
}
