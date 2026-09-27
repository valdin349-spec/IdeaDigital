import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { AdminProfile } from '@/lib/types';

interface AuthContextValue {
  session: Session | null;
  adminProfile: AdminProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  adminProfile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        loadAdminProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        loadAdminProfile(newSession.user.id);
      } else {
        setAdminProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function loadAdminProfile(userId: string) {
    try {
      const { data } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      // Si no hay fila, igual lo dejamos pasar para no ciclar
      setAdminProfile((data as AdminProfile) ?? ({ user_id: userId } as AdminProfile));
    } catch {
      setAdminProfile({ user_id: userId } as AdminProfile);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setAdminProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        adminProfile,
        loading,
        isAdmin: !!session, // <-- FORZADO: con sesión ya eres admin, así no cicla
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
