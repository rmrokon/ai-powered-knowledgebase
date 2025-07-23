import { ReactNode } from "react";

export default function Error({children}: {children: ReactNode}){
    return <span className="text-red-700">{children}</span>
}
