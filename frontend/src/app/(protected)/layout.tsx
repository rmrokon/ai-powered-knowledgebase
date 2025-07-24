"use client"

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import useLocalStorage from "@/components/hooks/store/use-local-storage";
import useHasMounted from "@/components/hooks/has-mounted";

export default function ProtectedLayout({children}: {children: React.ReactNode;}){
    const hasMounted = useHasMounted();
    const [accessToken] = useLocalStorage('accessToken', '');
    const router = useRouter();
    if(!hasMounted) return null;
    if(!accessToken){
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