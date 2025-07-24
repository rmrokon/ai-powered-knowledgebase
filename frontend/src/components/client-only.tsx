// components/ClientOnly.tsx
'use client';

import useHasMounted from './hooks/has-mounted';
import React from 'react';

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;
  return <>{children}</>;
}
