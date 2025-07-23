"use client";

import { PropsWithChildren } from "react";
import TanstackProvider from "./tanstack-provider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <TanstackProvider>
        {children}
    </TanstackProvider>
  )
}
