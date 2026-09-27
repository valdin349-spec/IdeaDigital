import { useState } from 'react';

export default function AdminLogin() {
  const [pass, setPass] = useState('');
  return (
    <div style={{minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <form onSubmit={(e)=>{
        e.preventDefault();
        if(pass==='gaby123'){
          localStorage.setItem('admin_ok','1');
          window.location.href='/admin';
        } else {
          alert('Clave es: gaby123');
        }
      }} style={{background:'#18181b',padding:'30px',borderRadius:'20px',width:'340px'}}>
        <h1 style={{color:'white',textAlign:'center',marginBottom:'20px'}}>Panel Administrativo</h1>
        <input value="jorge_300499@msn.com" disabled style={{width:'100%',padding:'12px',borderRadius:'10px',background:'#27272a',color:'white',marginBottom:'10px',border:'none'}} />
        <input type="password" placeholder="Clave: gaby123" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'10px',background:'#27272a',color:'white',marginBottom:'15px',border:'none'}} autoFocus />
        <button style={{width:'100%',padding:'12px',borderRadius:'10px',background:'#ec4899',color:'white',fontWeight:'bold',border:'none',cursor:'pointer'}}>Entrar</button>
      </form>
    </div>
  );
}
