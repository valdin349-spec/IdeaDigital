import { useAuth } from '@/lib/auth-context'

export default function AdminDashboard() {
  const { session, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-500 mb-4">Admin Dashboard - FUNCIONA</h1>
        <p className="mb-4">Sesión: {session?.user?.email}</p>
        <button 
          onClick={signOut}
          className="bg-pink-600 px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
        <div className="mt-8 p-4 bg-zinc-900 rounded">
          <p>Si ves esto, ya saliste del ciclo.</p>
          <p>Después restauramos tu dashboard bonito.</p>
        </div>
      </div>
    </div>
  )
}

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-500">Dashboard funcionando</h1>
        <p>Login OK</p>
      </div>
    </div>
  )
}
