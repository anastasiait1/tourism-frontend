import { z } from "zod";
export const userRoleSchema = z.enum(["guest", "user", "admin"]);
export const userSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  username: z.string(), email: z.string().email().optional(), role: userRoleSchema,
});
export const registerSchema = z.object({
  username: z.string().min(3, "Минимум 3 символа").max(40, "Максимум 40 символов"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Минимум 8 символов")
    .regex(/[A-Za-z]/, "Добавьте букву").regex(/[0-9]/, "Добавьте цифру"),
  confirmPassword: z.string(),
}).refine((v) => v.password === v.confirmPassword, {
  message: "Пароли не совпадают", path: ["confirmPassword"],
});
export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});
export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
