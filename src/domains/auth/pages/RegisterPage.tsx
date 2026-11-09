import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterInput } from "../model/auth.schemas";
import { useRegister } from "../hooks/useAuth";
export function RegisterPage() {
  const navigate = useNavigate(); const mutation = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const submit = handleSubmit(async (values) => { try { await mutation.mutateAsync(values); navigate("/login", { replace: true }); } catch { /* ошибка отображается ниже */ } });
  return <section className="auth-page"><form className="auth-card" onSubmit={submit}>
    <p className="eyebrow">GETAWAYMAP</p><h1>Создать аккаунт</h1><p className="auth-subtitle">Присоединяйся к сообществу исследователей Беларуси.</p>
    <label className="form-label">Имя пользователя<input className="form-input" autoComplete="username" {...register("username")} />{errors.username && <span className="field-error">{errors.username.message}</span>}</label>
    <label className="form-label">Email<input className="form-input" type="email" autoComplete="email" {...register("email")} />{errors.email && <span className="field-error">{errors.email.message}</span>}</label>
    <label className="form-label">Пароль<input className="form-input" type="password" autoComplete="new-password" {...register("password")} />{errors.password && <span className="field-error">{errors.password.message}</span>}</label>
    <label className="form-label">Повтори пароль<input className="form-input" type="password" autoComplete="new-password" {...register("confirmPassword")} />{errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}</label>
    {mutation.error && <p className="form-error" role="alert">{mutation.error.message}</p>}
    <button className="button button-primary" disabled={mutation.isPending}>{mutation.isPending ? "Создаём..." : "Зарегистрироваться"}</button>
    <p className="auth-footer">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
  </form></section>;
}
