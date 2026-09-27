export default function AdminLogin() {
  // Bypass total - entra directo
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAdmin', 'true');
    // Si tu dashboard está en /admin/dashboard cámbialo aquí
    window.location.href = '/admin';
  }
  return <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Entrando al admin...</div>;
}
