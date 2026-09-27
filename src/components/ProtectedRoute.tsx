import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  // BYPASS TEMPORAL - deja entrar a todos al admin
  return <>{children}</>;
}
