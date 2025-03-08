import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { get, post } from "./base";

interface User {
  id: number;
  name: string;
  email: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: (): Promise<User> => get("/api/auth/me"),
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      post("/api/auth/login", data),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
      router.push("/home");
    },
    [loginMutation, router]
  );

  return {
    user,
    isLoading,
    login: handleLogin,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
