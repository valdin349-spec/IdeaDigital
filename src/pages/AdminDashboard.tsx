import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  // TODOS LOS HOOKS ARRIBA - NUNCA DESPUES DE UN IF
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: 'Gaby Rosales',
    title: 'Digital Experience',
    bio: '',
    image_url: '',
    message: ''
  })
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profiles').select('*').limit(1).single()
      if (data) {
        setForm({
          name: data.name || 'Gaby Rosales',
          title: data.title || '',
          bio: data.bio || '',
          image_url: data.image_url || '',
          message: data.message || ''
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('profiles').upsert({ id: 1, ...form, updated_at: new Date() })
    setSaving(false)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  if (loading) {
    return (
      <div style={{minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899'}}>
        Cargando Gaby...
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh', background:'#0a0a0a', color:'#fff', fontFamily:'Inter, sans-serif', display:'flex'}}>
      {/* Preview Izquierda */}
      <div style={{flex:1, background:'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', padding:'40px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <div style={{width:'280px', height:'380px', borderRadius:'30px', overflow:'hidden', background:'#fff', boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
          {form.image_url ? <img src={form.image_url} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{width:'100%', height:'100%', background:'#fce7f3', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899', fontSize:'60px'}}>G</div>}
        </div>
        <h1 style={{marginTop:'30px', fontSize:'32px', fontWeight:'800'}}>{form.name}</h1>
        <p style={{opacity:0.9, marginTop:'5px'}}>{form.title}</p>
        <p style={{opacity:0.7, marginTop:'15px', textAlign:'center', maxWidth:'300px', fontSize:'14px'}}>{form.bio}</p>
      </div>

      {/* Editor Derecha */}
      <div style={{flex:1, background:'#18181b', padding:'40px', overflowY:'auto'}}>
        <h2 style={{fontSize:'24px', fontWeight:'700', marginBottom:'5px'}}>Editar Perfil</h2>
        <p style={{color:'#888', fontSize:'14px', marginBottom:'30px'}}>Cambios se guardan en Supabase</p>

        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
          <div>
            <label style={{fontSize:'12px', color:'#aaa', textTransform:'uppercase', letterSpacing:'1px'}}>Nombre</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={{width:'100%', marginTop:'8px', background:'#27272a', border:'1px solid #3f3f46', borderRadius:'12px', padding:'14px', color:'#fff', outline:'none'}} />
          </div>
          <div>
            <label style={{fontSize:'12px', color:'#aaa', textTransform:'uppercase', letterSpacing:'1px'}}>Título / Rol</label>
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{width:'100%', marginTop:'8px', background:'#27272a', border:'1px solid #3f3f46', borderRadius:'12px', padding:'14px', color:'#fff', outline:'none'}} />
          </div>
          <div>
            <label style={{fontSize:'12px', color:'#aaa', textTransform:'uppercase', letterSpacing:'1px'}}>Foto URL</label>
            <input value={form.image_url} onChange={e=>setForm({...form, image_url:e.target.value})} placeholder="https://..." style={{width:'100%', marginTop:'8px', background:'#27272a', border:'1px solid #3f3f46', borderRadius:'12px', padding:'14px', color:'#fff', outline:'none'}} />
          </div>
          <div>
            <label style={{fontSize:'12px', color:'#aaa', textTransform:'uppercase', letterSpacing:'1px'}}>Bio / Mensaje</label>
            <textarea value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} rows={4} style={{width:'100%', marginTop:'8px', background:'#27272a', border:'1px solid #3f3f46', borderRadius:'12px', padding:'14px', color:'#fff', outline:'none', resize:'none'}} />
          </div>

          <button onClick={handleSave} disabled={saving} style={{marginTop:'10px', background: showSaved ? '#22c55e' : '#ec4899', color:'#fff', border:'none', borderRadius:'12px', padding:'16px', fontWeight:'700', cursor:'pointer', transition:'all 0.2s'}}>
            {saving ? 'Guardando...' : showSaved ? '✅ Guardado!' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
