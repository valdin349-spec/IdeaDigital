export default function Admin() {
  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', padding:'40px', fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:'32px', color:'#ec4899'}}>✅ ¡Entraste!</h1>
      <p style={{marginTop:'10px'}}>El ProtectedRoute ya está arreglado. Este es un panel temporal.</p>
      <div style={{marginTop:'30px', background:'#18181b', padding:'20px', borderRadius:'15px'}}>
        <h2 style={{color:'#fff'}}>¿Qué quieres hacer con Gaby?</h2>
        <ul style={{marginTop:'15px', lineHeight:'30px'}}>
          <li>• Editar nombre / fotos</li>
          <li>• Cambiar mensaje</li>
          <li>• Ver base de datos</li>
        </ul>
      </div>
      <p style={{marginTop:'30px', color:'#888'}}>Mándame foto de que ves esto y te restauro el Admin bonito con seguridad.</p>
    </div>
  );
}
