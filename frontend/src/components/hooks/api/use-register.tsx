'use client'
import { authRepository } from "@/lib/api/repositories";
import { useRouter } from "next/navigation";
import { UseMutationOptions } from "@tanstack/react-query";
import { api } from "@/lib/api/tanstack-adapter";
import { IRegister } from "@/lib/api/repositories/auth-repository";
import { IUser } from "@/lib/api/repositories/user-repository";
import toast from "react-hot-toast";

export const useRegistraion = (options?: UseMutationOptions<IUser, unknown, IRegister, unknown> | undefined) => {
    const router = useRouter();
    return api.useMutation(authRepository.register.bind(authRepository), {
        onSuccess: (data) => {
            toast.success("Registration successful");
            router.push('/login')
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Login Failed');
        },
        ...options
    });
};
