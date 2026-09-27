import { useAuth } from '@/lib/auth-context'
export default function AdminDashboard() {
  const { session, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-500 mb-4">FUNCIONA - YA SALISTE DEL CICLO</h1>
        <p>Sesión: {session?.user?.email}</p>
        <button onClick={() => signOut()} className="mt-4 bg-pink-600 px-4 py-2 rounded">Cerrar sesión</button>
      </div>
    </div>
  )
}
