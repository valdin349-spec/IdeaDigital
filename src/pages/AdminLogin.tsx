import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function AdminLogin() {
  const [email] = useState('jorge_300499@msn.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: 'jorge_300499@msn.com',
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // FIX: forzar redirección, no esperar a context
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-white text-center text-xl mb-6">Panel Administrativo</h1>
        <input value="jorge_300499@msn.com" disabled className="w-full p-3 rounded bg-zinc-800 text-white mb-3 opacity-60" />
        <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 rounded bg-zinc-800 text-white mb-4" required />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button disabled={loading} className="w-full p-3 rounded bg-pink-500 text-white">
          {loading? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
