import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{minHeight:'100vh', background:'#000', color:'#ec4899', display:'flex', alignItems:'center', justifyContent:'center'}}>Cargando...</div>
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
