"use client"

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";

export default function ProtectedLayout({children}: {children: React.ReactNode;}){
    const token = localStorage.getItem("accessToken");
    const router = useRouter();
    if(!token){
        router.push("/login");
        return;
    }
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}