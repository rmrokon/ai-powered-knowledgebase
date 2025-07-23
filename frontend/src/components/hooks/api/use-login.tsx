'use client'
import { authRepository } from "@/lib/api/repositories";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/use-auth-store";
import { UseMutationOptions } from "@tanstack/react-query";
import { api } from "@/lib/api/tanstack-adapter";
import { IAuth, ILogin } from "@/lib/api/repositories/auth-repository";
import toast from "react-hot-toast";

export const useLogin = (options?: UseMutationOptions<IAuth, unknown, ILogin, unknown> | undefined) => {
    const router = useRouter();
    const {login}= useAuthStore();
    return api.useMutation(authRepository.login.bind(authRepository), {
        onSuccess: (data) => {
            login(data.user);
            localStorage.setItem("accessToken", data?.accessToken);
            toast.success("Successfully logged in")
            router.push('/takeaway-menu')
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Login Failed')
        },
        ...options
    });
};
