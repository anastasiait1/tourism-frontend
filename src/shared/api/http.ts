import { env } from "@shared/config/env";
import { ApiError } from "./ApiError";

type Options = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  auth?: boolean;
};

function accessToken(): string | null {
  try {
    const raw = localStorage.getItem("getawaymap-auth");
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || !("state" in parsed)) return null;
    const state = (parsed as { state?: { accessToken?: unknown } }).state;
    return typeof state?.accessToken === "string" ? state.accessToken : null;
  } catch { return null; }
}

export async function http<T>(path: string, options: Options = {}): Promise<T> {
  const { auth = true, headers: inputHeaders, body, ...init } = options;
  const headers = new Headers(inputHeaders);
  const token = auth ? accessToken() : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let requestBody: BodyInit | null | undefined;
  if (body instanceof FormData || body instanceof URLSearchParams || typeof body === "string") {
    requestBody = body;
  } else if (body != null) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  } else requestBody = body;
  const response = await fetch(`${env.apiBaseUrl}${path}`, { ...init, headers, body: requestBody });
  if (!response.ok) throw await ApiError.fromResponse(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
