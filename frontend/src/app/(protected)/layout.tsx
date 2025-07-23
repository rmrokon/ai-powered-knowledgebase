"use client"

import { useRouter } from "next/navigation";

export default function UnauthenticatedLayout({children}: {children: React.ReactNode;}){
    const token = localStorage.getItem("accessToken");
    const router = useRouter()
    if(!token){
        router.push("/login");
        return;
    }
    return <>{children}</>
}