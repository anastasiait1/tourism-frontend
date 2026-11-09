import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { userFromToken } from "../model/token";
import { useAuthStore } from "../store/authStore";
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (result, input) => {
      const user = userFromToken(result.access_token, result.role);
      setSession({ ...user, email: user.email ?? input.email }, result.access_token);
    },
  });
}
export function useRegister() { return useMutation({ mutationFn: authApi.register }); }
