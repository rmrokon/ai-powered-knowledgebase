"use client"

import useHasMounted from "@/components/hooks/has-mounted";
import useLocalStorage from "@/components/hooks/store/use-local-storage";
import { useRouter } from "next/navigation";

export default function UnauthenticatedLayout({children}: {children: React.ReactNode;}){
    const hasMounted = useHasMounted();
    const [accessToken] = useLocalStorage('accessToken', '');
    const router = useRouter();
    if(!hasMounted) return null;
    if(accessToken){
        router.push("/articles");
        return;
    }
    return <>{children}</>
}