import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginSchema, type LoginInput } from "../model/auth.schemas";
import { useLogin } from "../hooks/useAuth";
export function LoginPage() {
  const navigate = useNavigate(); const [params] = useSearchParams(); const mutation = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const submit = handleSubmit(async (values) => {
    try { await mutation.mutateAsync(values); const next = params.get("next"); navigate(next?.startsWith("/") ? next : "/", { replace: true }); }
    catch { /* ошибка отображается из mutation.error */ }
  });
  return <section className="auth-page"><form className="auth-card" onSubmit={submit}>
    <p className="eyebrow">GETAWAYMAP</p><h1>С возвращением!</h1><p className="auth-subtitle">Войди, чтобы сохранять места и создавать маршруты.</p>
    <label className="form-label">Email<input className="form-input" type="email" autoComplete="email" {...register("email")} />{errors.email && <span className="field-error">{errors.email.message}</span>}</label>
    <label className="form-label">Пароль<input className="form-input" type="password" autoComplete="current-password" {...register("password")} />{errors.password && <span className="field-error">{errors.password.message}</span>}</label>
    {mutation.error && <p className="form-error" role="alert">{mutation.error.message}</p>}
    <button className="button button-primary" disabled={mutation.isPending}>{mutation.isPending ? "Входим..." : "Войти"}</button>
    <p className="auth-footer">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
  </form></section>;
}
