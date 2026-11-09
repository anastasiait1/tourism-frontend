import { http } from "@shared/api/http";
import { userSchema, type LoginInput, type RegisterInput, type User } from "../model/auth.schemas";
type RegisterResponse = { id: string | number; username: string; email: string; role: "guest" | "user" | "admin" };
type LoginResponse = { access_token: string; token_type: "bearer"; role: "guest" | "user" | "admin" };
export const authApi = {
  async register(input: RegisterInput): Promise<User> {
    const result = await http<RegisterResponse>("/auth/register", {
      method: "POST", auth: false,
      body: { username: input.username, email: input.email, password: input.password },
    });
    return userSchema.parse(result);
  },
  async login(input: LoginInput): Promise<LoginResponse> {
    const body = new URLSearchParams({ username: input.email, password: input.password });
    return http<LoginResponse>("/auth/login", {
      method: "POST", auth: false,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, body,
    });
  },
};
