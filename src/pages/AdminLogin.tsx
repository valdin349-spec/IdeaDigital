import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export function AdminLogin() {
  const { session, adminProfile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session && adminProfile) {
      navigate('/admin');
    }
  }, [session, adminProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    // Auth context will handle redirect
  };

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rose-intense/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-rose/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-rose mb-4">
            <Heart className="w-7 h-7 text-rose-intense" fill="currentColor" />
          </div>
          <h1 className="font-serif text-3xl text-white font-light">Panel Administrativo</h1>
          <p className="text-gray-400 text-sm mt-2">Experiencias Premium</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Correo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-intense/50 transition-colors"
                placeholder="admin@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-intense/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-rose-300 text-sm text-center bg-rose-intense/10 rounded-lg py-2 px-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full py-3.5 rounded-xl font-medium text-white text-sm tracking-wider flex items-center justify-center gap-2 glow-rose-sm disabled:opacity-50 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #E56FA3, #EFA3C4)' }}
          >
            {loading ? (
              'Verificando...'
            ) : (
              <>
                INICIAR SESIÓN
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center">
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setError('Contacta al administrador del sistema para restablecer tu contraseña.');
              }}
              className="text-sm text-gray-500 hover:text-rose-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
