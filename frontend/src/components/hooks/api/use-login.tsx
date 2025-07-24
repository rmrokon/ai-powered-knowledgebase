'use client'
import { authRepository } from "@/lib/api/repositories";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/use-auth-store";
import { UseMutationOptions } from "@tanstack/react-query";
import { api } from "@/lib/api/tanstack-adapter";
import { IAuth, ILogin } from "@/lib/api/repositories/auth-repository";
import toast from "react-hot-toast";
import useLocalStorage from "../store/use-local-storage";

export const useLogin = (options?: UseMutationOptions<IAuth, unknown, ILogin, unknown> | undefined) => {
    const router = useRouter();
    const {login}= useAuthStore();
    const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');
    return api.useMutation(authRepository.login.bind(authRepository), {
        onSuccess: (data) => {
            login(data.user);
            setAccessToken(data?.accessToken);
            toast.success("Successfully logged in")
            router.push('/articles')
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Login Failed')
        },
        ...options
    });
};
