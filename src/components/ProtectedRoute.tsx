import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{minHeight:'100vh', background:'#0a0a0a', color:'#ec4899', display:'flex', alignItems:'center', justifyContent:'center'}}>
        Cargando...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
