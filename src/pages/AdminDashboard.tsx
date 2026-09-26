import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Eye, Edit3, QrCode, Heart, Image as ImageIcon, Music, Video, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { loadAllExperiences } from '@/lib/data';
import type { Experience } from '@/lib/types';
import QRCode from 'qrcode';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut, adminProfile } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrExperience, setQrExperience] = useState<string | null>(null);

  useEffect(() => {
    loadAllExperiences().then((data) => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  const generateQR = async (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: '#050505', light: '#FFFFFF' },
    });
    setQrUrl(dataUrl);
    setQrExperience(slug);
  };

  const downloadQR = () => {
    if (!qrUrl || !qrExperience) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `qr-${qrExperience}.png`;
    a.click();
  };

  const stats = (exp: Experience) => {
    // We'd need to fetch counts, but for dashboard display we can show basic info
    return [
      { icon: ImageIcon, label: 'Fotos', has: !!exp.cover_image_url },
      { icon: Music, label: 'Canción', has: !!exp.music_url },
      { icon: Video, label: 'Video', has: !!exp.video_url },
    ];
  };

  return (
    <div className="min-h-screen bg-noir">
      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 z-40 bg-noir/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass-rose flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-intense" fill="currentColor" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-white font-light">Panel Administrativo</h1>
              <p className="text-xs text-gray-500">{adminProfile?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-gray-400 hover:text-rose-300 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-serif text-3xl text-white font-light mb-2">Mis Experiencias</h2>
        <p className="text-gray-500 text-sm mb-10">Gestiona tus experiencias digitales personalizadas</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-rose-intense/30 border-t-rose-intense animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="glass rounded-2xl overflow-hidden group hover:border-rose-intense/20 transition-all"
              >
                {/* Cover preview */}
                <div className="relative h-40 overflow-hidden">
                  {exp.cover_image_url ? (
                    <img
                      src={exp.cover_image_url}
                      alt={exp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #E56FA318, #0D0D0F)' }}
                    >
                      <Heart className="w-10 h-10 text-rose-intense/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        exp.published
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {exp.published ? 'Publicada' : 'Oculta'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif text-xl text-white mb-1">{exp.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">/{exp.slug}</p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-5">
                    {stats(exp).map((stat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <stat.icon
                          className={`w-4 h-4 ${stat.has ? 'text-rose-300' : 'text-gray-600'}`}
                        />
                        <span className={stat.has ? 'text-gray-300' : 'text-gray-600'}>
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Updated date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(exp.updated_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/edit/${exp.slug}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white/5 hover:bg-rose-intense/20 text-gray-300 hover:text-white text-sm transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar
                    </button>
                    <a
                      href={`/${exp.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </a>
                    <button
                      onClick={() => generateQR(exp.slug)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm transition-all"
                      aria-label="QR"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Modal */}
      {qrUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => {
            setQrUrl(null);
            setQrExperience(null);
          }}
        >
          <div
            className="glass rounded-3xl p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl text-white mb-2">Código QR</h3>
            <p className="text-gray-400 text-sm mb-6">/{qrExperience}</p>
            <div className="bg-white rounded-2xl p-4 mx-auto w-fit mb-6">
              <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
            </div>
            <button
              onClick={downloadQR}
              className="btn-premium w-full py-3 rounded-xl font-medium text-white text-sm tracking-wider glow-rose-sm"
              style={{ background: 'linear-gradient(135deg, #E56FA3, #EFA3C4)' }}
            >
              DESCARGAR PNG
            </button>
            <button
              onClick={() => {
                setQrUrl(null);
                setQrExperience(null);
              }}
              className="w-full mt-3 py-2.5 rounded-xl text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
