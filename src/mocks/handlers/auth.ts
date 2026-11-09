import { http, HttpResponse } from "msw";
type NewUser = { username: string; email: string; password: string };
const users: Array<NewUser & { id: number; role: "user" | "admin" }> = [
  { id: 1, username: "admin", email: "admin@getawaymap.test", password: "admin1234", role: "admin" },
];
const encode = (v: object) => btoa(JSON.stringify(v)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const token = (username: string, email: string) => `${encode({ alg: "none", typ: "JWT" })}.${encode({ sub: username, username, email })}.mock-signature`;
export const authHandlers = [
  http.post("/api/v1/auth/register", async ({ request }) => {
    const body = await request.json() as NewUser;
    if (users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) return HttpResponse.json({ detail: "Пользователь с таким email уже существует" }, { status: 409 });
    const user = { ...body, id: Date.now(), role: "user" as const }; users.push(user);
    return HttpResponse.json({ id: user.id, username: user.username, email: user.email, role: user.role }, { status: 201 });
  }),
  http.post("/api/v1/auth/login", async ({ request }) => {
    const form = new URLSearchParams(await request.text()); const email = form.get("username") ?? ""; const password = form.get("password") ?? "";
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return HttpResponse.json({ detail: "Неверный email или пароль" }, { status: 401 });
    return HttpResponse.json({ access_token: token(user.username, user.email), token_type: "bearer", role: user.role });
  }),
];
