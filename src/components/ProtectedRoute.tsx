import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, adminProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <div className="text-rose-intense animate-pulse font-serif text-2xl">
          Verificando acceso...
        </div>
      </div>
    );
  }

  if (!session || !adminProfile) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
