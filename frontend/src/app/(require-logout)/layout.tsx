"use client"

import useLocalStorage from "@/components/hooks/store/use-local-storage";
import { useRouter } from "next/navigation";

export default function UnauthenticatedLayout({children}: {children: React.ReactNode;}){
    const [accessToken] = useLocalStorage('accessToken', '');
    const router = useRouter();
    if(accessToken){
        router.push("/articles");
        return;
    }
    return <>{children}</>
}