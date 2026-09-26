import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Eye, Upload, Trash2, GripVertical, Plus,
  Image as ImageIcon, Music, Video, FileText, Palette, Settings,
  Heart, Check, AlertCircle, Calendar,
} from 'lucide-react';
import { loadExperienceAdmin, type ExperienceData } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { Experience, ExperiencePhoto, ExperienceSection, StoryItem, SectionType, AnimationType } from '@/lib/types';
import { SECTION_LABELS, ANIMATION_LABELS } from '@/lib/types';

type Tab = 'content' | 'photos' | 'music' | 'video' | 'story' | 'sections' | 'colors' | 'message';

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: 'content', label: 'Contenido', icon: FileText },
  { id: 'photos', label: 'Fotografías', icon: ImageIcon },
  { id: 'music', label: 'Canción', icon: Music },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'story', label: 'Historia', icon: Calendar },
  { id: 'sections', label: 'Secciones', icon: Settings },
  { id: 'colors', label: 'Colores', icon: Palette },
];

export function AdminEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('content');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const loadData = useCallback(() => {
    if (!slug) return;
    loadExperienceAdmin(slug).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateExperience = (updates: Partial<Experience>) => {
    if (!data) return;
    setData({ ...data, experience: { ...data.experience, ...updates } });
  };

  const saveExperience = async () => {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase
      .from('experiences')
      .update({
        name: data.experience.name,
        title: data.experience.title,
        subtitle: data.experience.subtitle,
        message: data.experience.message,
        sender_name: data.experience.sender_name,
        occasion: data.experience.occasion,
        cover_image_url: data.experience.cover_image_url,
        music_url: data.experience.music_url,
        music_title: data.experience.music_title,
        music_artist: data.experience.music_artist,
        music_cover_url: data.experience.music_cover_url,
        video_url: data.experience.video_url,
        primary_color: data.experience.primary_color,
        secondary_color: data.experience.secondary_color,
        background_color: data.experience.background_color,
        text_color: data.experience.text_color,
        gallery_style: data.experience.gallery_style,
        published: data.experience.published,
      })
      .eq('id', data.experience.id);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  // Upload helpers
  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${data!.experience.id}/${Date.now()}.${ext}`;
    setUploadProgress(`Subiendo ${file.name}...`);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });

    setUploadProgress(null);

    if (error) {
      alert('Error al subir: ' + error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const deleteFile = async (url: string, bucket: string) => {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split(`/${bucket}/`)[1];
    if (path) {
      await supabase.storage.from(bucket).remove([path]);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-rose-intense/30 border-t-rose-intense animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir">
      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 z-40 bg-noir/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-serif text-lg text-white font-light">{data.experience.name}</h1>
              <p className="text-xs text-gray-500">/{data.experience.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/admin/preview/${data.experience.slug}`)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              Vista previa
            </button>
            <button
              onClick={saveExperience}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #E56FA3, #EFA3C4)' }}
            >
              {saving ? (
                'Guardando...'
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Guardado
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Upload progress */}
      {uploadProgress && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-rose rounded-full px-6 py-3 text-sm text-rose-200 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-rose-300/30 border-t-rose-300 animate-spin" />
          {uploadProgress}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-rose-intense/20 text-rose-200'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'content' && (
          <ContentTab data={data} updateExperience={updateExperience} uploadFile={uploadFile} deleteFile={deleteFile} />
        )}
        {tab === 'photos' && (
          <PhotosTab data={data} setData={setData} uploadFile={uploadFile} deleteFile={deleteFile} />
        )}
        {tab === 'music' && (
          <MusicTab data={data} updateExperience={updateExperience} uploadFile={uploadFile} deleteFile={deleteFile} />
        )}
        {tab === 'video' && (
          <VideoTab data={data} updateExperience={updateExperience} uploadFile={uploadFile} deleteFile={deleteFile} />
        )}
        {tab === 'story' && <StoryTab data={data} setData={setData} uploadFile={uploadFile} deleteFile={deleteFile} />}
        {tab === 'sections' && <SectionsTab data={data} setData={setData} />}
        {tab === 'colors' && <ColorsTab data={data} updateExperience={updateExperience} />}
      </div>
    </div>
  );
}

// ============ CONTENT TAB ============
function ContentTab({
  data,
  updateExperience,
  uploadFile,
  deleteFile,
}: {
  data: ExperienceData;
  updateExperience: (u: Partial<Experience>) => void;
  uploadFile: (f: File, b: string) => Promise<string | null>;
  deleteFile: (url: string, b: string) => Promise<void>;
}) {
  const { experience } = data;
  const [dragOver, setDragOver] = useState(false);

  const handleCoverUpload = async (file: File) => {
    const url = await uploadFile(file, 'covers');
    if (url) {
      if (experience.cover_image_url) await deleteFile(experience.cover_image_url, 'covers');
      updateExperience({ cover_image_url: url });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Nombre">
          <input
            type="text"
            value={experience.name}
            onChange={(e) => updateExperience({ name: e.target.value })}
            className="admin-input"
          />
        </Field>
        <Field label="Motivo">
          <input
            type="text"
            value={experience.occasion}
            onChange={(e) => updateExperience({ occasion: e.target.value })}
            className="admin-input"
          />
        </Field>
      </div>

      <Field label="Título principal">
        <input
          type="text"
          value={experience.title}
          onChange={(e) => updateExperience({ title: e.target.value })}
          className="admin-input"
        />
      </Field>

      <Field label="Subtítulo">
        <input
          type="text"
          value={experience.subtitle}
          onChange={(e) => updateExperience({ subtitle: e.target.value })}
          className="admin-input"
        />
      </Field>

      <Field label="Mensaje de apertura">
        <textarea
          value={experience.message}
          onChange={(e) => updateExperience({ message: e.target.value })}
          rows={3}
          className="admin-input resize-none"
        />
      </Field>

      <Field label="Remitente">
        <input
          type="text"
          value={experience.sender_name}
          onChange={(e) => updateExperience({ sender_name: e.target.value })}
          className="admin-input"
        />
      </Field>

      {/* Cover image */}
      <Field label="Imagen de portada">
        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 transition-colors ${
            dragOver ? 'border-rose-intense bg-rose-intense/5' : 'border-white/10'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files[0]) handleCoverUpload(e.dataTransfer.files[0]);
          }}
        >
          {experience.cover_image_url ? (
            <div className="relative group">
              <img
                src={experience.cover_image_url}
                alt="Cover"
                className="w-full max-h-64 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    deleteFile(experience.cover_image_url!, 'covers');
                    updateExperience({ cover_image_url: null });
                  }}
                  className="px-4 py-2 bg-red-500/80 rounded-lg text-white text-sm flex items-center gap-2 hover:bg-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer py-8">
              <Upload className="w-8 h-8 text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm">Arrastra una imagen o haz clic para subir</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
              />
            </label>
          )}
        </div>
      </Field>

      {/* Published toggle */}
      <div className="flex items-center justify-between glass rounded-xl p-4">
        <div>
          <p className="text-white font-medium">Publicada</p>
          <p className="text-gray-500 text-sm">Si está activa, será visible públicamente</p>
        </div>
        <button
          onClick={() => updateExperience({ published: !experience.published })}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            experience.published ? 'bg-rose-intense' : 'bg-gray-700'
          }`}
        >
          <div
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
              experience.published ? 'translate-x-7' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

// ============ PHOTOS TAB ============
function PhotosTab({
  data,
  setData,
  uploadFile,
  deleteFile,
}: {
  data: ExperienceData;
  setData: React.Dispatch<React.SetStateAction<ExperienceData | null>>;
  uploadFile: (f: File, b: string) => Promise<string | null>;
  deleteFile: (url: string, b: string) => Promise<void>;
}) {
  const [dragOver, setDragOver] = useState(false);
  const { experience, photos } = data;

  const handleUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, 'photos');
      if (url) {
        const { data: inserted, error } = await supabase
          .from('experience_photos')
          .insert({
            experience_id: experience.id,
            image_url: url,
            title: '',
            description: '',
            display_order: photos.length,
            is_cover: false,
          })
          .select()
          .single();

        if (!error && inserted) {
          setData((prev) =>
            prev ? { ...prev, photos: [...prev.photos, inserted as ExperiencePhoto] } : prev
          );
        }
      }
    }
  };

  const deletePhoto = async (photo: ExperiencePhoto) => {
    await deleteFile(photo.image_url, 'photos');
    await supabase.from('experience_photos').delete().eq('id', photo.id);
    setData((prev) =>
      prev ? { ...prev, photos: prev.photos.filter((p) => p.id !== photo.id) } : prev
    );
  };

  const updatePhoto = async (id: string, updates: Partial<ExperiencePhoto>) => {
    await supabase.from('experience_photos').update(updates).eq('id', id);
    setData((prev) =>
      prev
        ? {
            ...prev,
            photos: prev.photos.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          }
        : prev
    );
  };

  const setAsCover = async (photo: ExperiencePhoto) => {
    // Unset all covers
    await supabase
      .from('experience_photos')
      .update({ is_cover: false })
      .eq('experience_id', experience.id);
    // Set this one
    await supabase
      .from('experience_photos')
      .update({ is_cover: true })
      .eq('id', photo.id);
    // Also update experience cover
    await supabase
      .from('experiences')
      .update({ cover_image_url: photo.image_url })
      .eq('id', experience.id);

    setData((prev) =>
      prev
        ? {
            ...prev,
            photos: prev.photos.map((p) => ({
              ...p,
              is_cover: p.id === photo.id,
            })),
            experience: { ...prev.experience, cover_image_url: photo.image_url },
          }
        : prev
    );
  };

  const movePhoto = async (photo: ExperiencePhoto, direction: 'up' | 'down') => {
    const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((p) => p.id === photo.id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const swapPhoto = sorted[swapIdx];

    await supabase
      .from('experience_photos')
      .update({ display_order: swapPhoto.display_order })
      .eq('id', photo.id);
    await supabase
      .from('experience_photos')
      .update({ display_order: photo.display_order })
      .eq('id', swapPhoto.id);

    setData((prev) => {
      if (!prev) return prev;
      const newPhotos = prev.photos.map((p) => {
        if (p.id === photo.id) return { ...p, display_order: swapPhoto.display_order };
        if (p.id === swapPhoto.id) return { ...p, display_order: photo.display_order };
        return p;
      });
      return { ...prev, photos: newPhotos };
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 transition-colors ${
          dragOver ? 'border-rose-intense bg-rose-intense/5' : 'border-white/10'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
        }}
      >
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <Upload className="w-8 h-8 text-gray-500 mb-3" />
          <p className="text-gray-400 text-sm">Arrastra fotografías o haz clic para subir</p>
          <p className="text-gray-600 text-xs mt-1">Puedes subir múltiples imágenes</p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && e.target.files.length > 0 && handleUpload(e.target.files)}
          />
        </label>
      </div>

      {/* Gallery style selector */}
      <Field label="Estilo de galería">
        <select
          value={experience.gallery_style}
          onChange={(e) => {
            supabase
              .from('experiences')
              .update({ gallery_style: e.target.value })
              .eq('id', experience.id);
            setData((prev) =>
              prev ? { ...prev, experience: { ...prev.experience, gallery_style: e.target.value } } : prev
            );
          }}
          className="admin-input"
        >
          <option value="editorial">Editorial</option>
          <option value="masonry">Masonry</option>
          <option value="cinematic">Cinematográfico</option>
        </select>
      </Field>

      {/* Photos list */}
      <div className="space-y-4">
        {[...photos]
          .sort((a, b) => a.display_order - b.display_order)
          .map((photo, i, arr) => (
            <div key={photo.id} className="glass rounded-xl p-4 flex gap-4">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={photo.title}
                  onChange={(e) => updatePhoto(photo.id, { title: e.target.value })}
                  placeholder="Título"
                  className="admin-input-sm"
                />
                <input
                  type="text"
                  value={photo.description}
                  onChange={(e) => updatePhoto(photo.id, { description: e.target.value })}
                  placeholder="Descripción"
                  className="admin-input-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setAsCover(photo)}
                    className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                      photo.is_cover
                        ? 'bg-rose-intense/20 text-rose-200'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className="w-3 h-3" />
                    {photo.is_cover ? 'Portada' : 'Usar como portada'}
                  </button>
                  <button
                    onClick={() => movePhoto(photo, 'up')}
                    disabled={i === 0}
                    className="text-xs px-2 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => movePhoto(photo, 'down')}
                    disabled={i === arr.length - 1}
                    className="text-xs px-2 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deletePhoto(photo)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center gap-1.5 ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// ============ MUSIC TAB ============
function MusicTab({
  data,
  updateExperience,
  uploadFile,
  deleteFile,
}: {
  data: ExperienceData;
  updateExperience: (u: Partial<Experience>) => void;
  uploadFile: (f: File, b: string) => Promise<string | null>;
  deleteFile: (url: string, b: string) => Promise<void>;
}) {
  const { experience } = data;

  const handleMusicUpload = async (file: File) => {
    const url = await uploadFile(file, 'music');
    if (url) {
      if (experience.music_url) await deleteFile(experience.music_url, 'music');
      updateExperience({ music_url: url });
    }
  };

  const handleCoverUpload = async (file: File) => {
    const url = await uploadFile(file, 'covers');
    if (url) {
      if (experience.music_cover_url) await deleteFile(experience.music_cover_url, 'covers');
      updateExperience({ music_cover_url: url });
    }
  };

  return (
    <div className="space-y-6">
      <Field label="Título de la canción">
        <input
          type="text"
          value={experience.music_title || ''}
          onChange={(e) => updateExperience({ music_title: e.target.value })}
          className="admin-input"
          placeholder="Nombre de la canción"
        />
      </Field>

      <Field label="Artista / Texto personalizado">
        <input
          type="text"
          value={experience.music_artist || ''}
          onChange={(e) => updateExperience({ music_artist: e.target.value })}
          className="admin-input"
          placeholder="Artista o dedicatoria"
        />
      </Field>

      {/* Music file */}
      <Field label="Archivo de audio">
        {experience.music_url ? (
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <Music className="w-8 h-8 text-rose-intense" />
            <div className="flex-1">
              <p className="text-white text-sm">Canción cargada</p>
              <audio src={experience.music_url} controls className="mt-2 w-full h-8" />
            </div>
            <button
              onClick={() => {
                deleteFile(experience.music_url!, 'music');
                updateExperience({ music_url: null });
              }}
              className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <UploadZone onUpload={handleMusicUpload} accept="audio/*" label="Subir archivo de audio (MP3)" />
        )}
      </Field>

      {/* Music cover */}
      <Field label="Portada de la canción">
        {experience.music_cover_url ? (
          <div className="relative group">
            <img
              src={experience.music_cover_url}
              alt="Music cover"
              className="w-32 h-32 rounded-xl object-cover"
            />
            <button
              onClick={() => {
                deleteFile(experience.music_cover_url!, 'covers');
                updateExperience({ music_cover_url: null });
              }}
              className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>
        ) : (
          <UploadZone onUpload={handleCoverUpload} accept="image/*" label="Subir portada" />
        )}
      </Field>
    </div>
  );
}

// ============ VIDEO TAB ============
function VideoTab({
  data,
  updateExperience,
  uploadFile,
  deleteFile,
}: {
  data: ExperienceData;
  updateExperience: (u: Partial<Experience>) => void;
  uploadFile: (f: File, b: string) => Promise<string | null>;
  deleteFile: (url: string, b: string) => Promise<void>;
}) {
  const { experience } = data;

  const handleVideoUpload = async (file: File) => {
    const url = await uploadFile(file, 'videos');
    if (url) {
      if (experience.video_url) await deleteFile(experience.video_url, 'videos');
      updateExperience({ video_url: url });
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
        <p className="text-gray-400 text-sm">
          Se recomienda video en formato vertical (9:16) MP4. El video se mostrará en un marco premium con efectos de luz.
        </p>
      </div>

      <Field label="Archivo de video">
        {experience.video_url ? (
          <div className="glass rounded-xl p-4">
            <video
              src={experience.video_url}
              controls
              className="w-full max-h-80 rounded-lg"
              playsInline
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-white text-sm">Video cargado</p>
              <button
                onClick={() => {
                  deleteFile(experience.video_url!, 'videos');
                  updateExperience({ video_url: null });
                }}
                className="text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <UploadZone onUpload={handleVideoUpload} accept="video/mp4" label="Subir video (MP4, vertical recomendado)" />
        )}
      </Field>
    </div>
  );
}

// ============ STORY TAB ============
function StoryTab({
  data,
  setData,
  uploadFile,
  deleteFile,
}: {
  data: ExperienceData;
  setData: React.Dispatch<React.SetStateAction<ExperienceData | null>>;
  uploadFile: (f: File, b: string) => Promise<string | null>;
  deleteFile: (url: string, b: string) => Promise<void>;
}) {
  const { experience, storyItems } = data;

  const addItem = async () => {
    const { data: inserted, error } = await supabase
      .from('story_items')
      .insert({
        experience_id: experience.id,
        title: 'Nuevo momento',
        text: '',
        date: '',
        display_order: storyItems.length,
        enabled: true,
      })
      .select()
      .single();

    if (!error && inserted) {
      setData((prev) =>
        prev ? { ...prev, storyItems: [...prev.storyItems, inserted as StoryItem] } : prev
      );
    }
  };

  const updateItem = async (id: string, updates: Partial<StoryItem>) => {
    await supabase.from('story_items').update(updates).eq('id', id);
    setData((prev) =>
      prev
        ? {
            ...prev,
            storyItems: prev.storyItems.map((s) => (s.id === id ? { ...s, ...updates } : s)),
          }
        : prev
    );
  };

  const deleteItem = async (item: StoryItem) => {
    if (item.image_url) await deleteFile(item.image_url, 'photos');
    await supabase.from('story_items').delete().eq('id', item.id);
    setData((prev) =>
      prev ? { ...prev, storyItems: prev.storyItems.filter((s) => s.id !== item.id) } : prev
    );
  };

  const handleImageUpload = async (item: StoryItem, file: File) => {
    const url = await uploadFile(file, 'photos');
    if (url) {
      if (item.image_url) await deleteFile(item.image_url, 'photos');
      updateItem(item.id, { image_url: url });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">Momentos de la historia</p>
        <button
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white text-sm hover:bg-rose-intense/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir momento
        </button>
      </div>

      {[...storyItems]
        .sort((a, b) => a.display_order - b.display_order)
        .map((item) => (
          <div key={item.id} className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Momento</span>
              <button
                onClick={() => deleteItem(item)}
                className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(item.id, { title: e.target.value })}
              placeholder="Título"
              className="admin-input-sm"
            />
            <input
              type="text"
              value={item.date}
              onChange={(e) => updateItem(item.id, { date: e.target.value })}
              placeholder="Fecha o lugar"
              className="admin-input-sm"
            />
            <textarea
              value={item.text}
              onChange={(e) => updateItem(item.id, { text: e.target.value })}
              placeholder="Descripción del momento"
              rows={3}
              className="admin-input-sm resize-none"
            />
            {item.image_url ? (
              <div className="relative group">
                <img src={item.image_url} alt="" className="w-full max-h-40 rounded-lg object-cover" />
                <button
                  onClick={() => {
                    deleteFile(item.image_url!, 'photos');
                    updateItem(item.id, { image_url: null });
                  }}
                  className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            ) : (
              <UploadZone
                onUpload={(f) => handleImageUpload(item, f)}
                accept="image/*"
                label="Subir imagen"
                compact
              />
            )}
          </div>
        ))}
    </div>
  );
}

// ============ SECTIONS TAB ============
function SectionsTab({
  data,
  setData,
}: {
  data: ExperienceData;
  setData: React.Dispatch<React.SetStateAction<ExperienceData | null>>;
}) {
  const { sections } = data;

  const toggleSection = async (section: ExperienceSection) => {
    await supabase
      .from('experience_sections')
      .update({ enabled: !section.enabled })
      .eq('id', section.id);
    setData((prev) =>
      prev
        ? {
            ...prev,
            sections: prev.sections.map((s) =>
              s.id === section.id ? { ...s, enabled: !s.enabled } : s
            ),
          }
        : prev
    );
  };

  const updateSection = async (id: string, updates: Partial<ExperienceSection>) => {
    await supabase.from('experience_sections').update(updates).eq('id', id);
    setData((prev) =>
      prev
        ? {
            ...prev,
            sections: prev.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
          }
        : prev
    );
  };

  const moveSection = async (section: ExperienceSection, direction: 'up' | 'down') => {
    const sorted = [...sections].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((s) => s.id === section.id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const swapSection = sorted[swapIdx];

    await supabase
      .from('experience_sections')
      .update({ display_order: swapSection.display_order })
      .eq('id', section.id);
    await supabase
      .from('experience_sections')
      .update({ display_order: section.display_order })
      .eq('id', swapSection.id);

    setData((prev) => {
      if (!prev) return prev;
      const newSections = prev.sections.map((s) => {
        if (s.id === section.id) return { ...s, display_order: swapSection.display_order };
        if (s.id === swapSection.id) return { ...s, display_order: section.display_order };
        return s;
      });
      return { ...prev, sections: newSections };
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm mb-4">
        Activa, desactiva y reordena las secciones de la experiencia
      </p>

      {[...sections]
        .sort((a, b) => a.display_order - b.display_order)
        .map((section, i, arr) => (
          <div
            key={section.id}
            className={`glass rounded-xl p-4 flex items-center gap-4 transition-all ${
              !section.enabled ? 'opacity-50' : ''
            }`}
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveSection(section, 'up')}
                disabled={i === 0}
                className="text-gray-500 hover:text-white disabled:opacity-30 text-xs"
              >
                ↑
              </button>
              <GripVertical className="w-4 h-4 text-gray-600" />
              <button
                onClick={() => moveSection(section, 'down')}
                disabled={i === arr.length - 1}
                className="text-gray-500 hover:text-white disabled:opacity-30 text-xs"
              >
                ↓
              </button>
            </div>

            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                {SECTION_LABELS[section.type as SectionType] || section.type}
              </p>
              {section.title && (
                <p className="text-gray-500 text-xs truncate">{section.title}</p>
              )}
            </div>

            {/* Animation selector */}
            <select
              value={section.animation}
              onChange={(e) => updateSection(section.id, { animation: e.target.value as AnimationType })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-rose-intense/50"
            >
              {Object.entries(ANIMATION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {/* Toggle */}
            <button
              onClick={() => toggleSection(section)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                section.enabled ? 'bg-rose-intense' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  section.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}

      {/* Section-specific content editors */}
      <div className="mt-8 space-y-4">
        <h3 className="text-white font-serif text-lg font-light">Editar contenido de secciones</h3>
        {sections
          .filter((s) => s.type === 'hero' || s.type === 'message' || s.type === 'final' || s.type === 'surprise' || s.type === 'intro')
          .sort((a, b) => a.display_order - b.display_order)
          .map((section) => (
            <SectionContentEditor key={section.id} section={section} updateSection={updateSection} />
          ))}
      </div>
    </div>
  );
}

function SectionContentEditor({
  section,
  updateSection,
}: {
  section: ExperienceSection;
  updateSection: (id: string, updates: Partial<ExperienceSection>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const content = section.content || {};

  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-white text-sm font-medium">
          {SECTION_LABELS[section.type as SectionType] || section.type}
        </span>
        <span className="text-gray-500 text-xs">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-3">
          <Field label="Título">
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="admin-input-sm"
            />
          </Field>
          <Field label="Subtítulo">
            <input
              type="text"
              value={section.subtitle}
              onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
              className="admin-input-sm"
            />
          </Field>

          {section.type === 'hero' && (
            <Field label="Texto del botón">
              <input
                type="text"
                value={content.buttonText || ''}
                onChange={(e) =>
                  updateSection(section.id, {
                    content: { ...content, buttonText: e.target.value },
                  })
                }
                className="admin-input-sm"
              />
            </Field>
          )}

          {section.type === 'message' && (
            <>
              <Field label="Mensaje">
                <textarea
                  value={content.text || ''}
                  onChange={(e) =>
                    updateSection(section.id, {
                      content: { ...content, text: e.target.value },
                    })
                  }
                  rows={5}
                  className="admin-input-sm resize-none"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tipografía">
                  <select
                    value={content.fontFamily || 'serif'}
                    onChange={(e) =>
                      updateSection(section.id, {
                        content: { ...content, fontFamily: e.target.value },
                      })
                    }
                    className="admin-input-sm"
                  >
                    <option value="serif">Serif (Cormorant)</option>
                    <option value="script">Script (Dancing Script)</option>
                    <option value="sans">Sans (Inter)</option>
                  </select>
                </Field>
                <Field label="Alineación">
                  <select
                    value={content.align || 'center'}
                    onChange={(e) =>
                      updateSection(section.id, {
                        content: { ...content, align: e.target.value },
                      })
                    }
                    className="admin-input-sm"
                  >
                    <option value="center">Centrado</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                </Field>
              </div>
              <Field label="Tamaño">
                <select
                  value={content.size || 'lg'}
                  onChange={(e) =>
                    updateSection(section.id, {
                      content: { ...content, size: e.target.value },
                    })
                  }
                  className="admin-input-sm"
                >
                  <option value="sm">Pequeño</option>
                  <option value="lg">Grande</option>
                  <option value="xl">Extra grande</option>
                </select>
              </Field>
            </>
          )}

          {section.type === 'surprise' && (
            <>
              <Field label="Texto inicial">
                <input
                  type="text"
                  value={content.preText || ''}
                  onChange={(e) =>
                    updateSection(section.id, {
                      content: { ...content, preText: e.target.value },
                    })
                  }
                  className="admin-input-sm"
                />
              </Field>
              <Field label="Texto intermedio">
                <input
                  type="text"
                  value={content.midText || ''}
                  onChange={(e) =>
                    updateSection(section.id, {
                      content: { ...content, midText: e.target.value },
                    })
                  }
                  className="admin-input-sm"
                />
              </Field>
              <Field label="Texto final">
                <input
                  type="text"
                  value={content.postText || ''}
                  onChange={(e) =>
                    updateSection(section.id, {
                      content: { ...content, postText: e.target.value },
                    })
                  }
                  className="admin-input-sm"
                />
              </Field>
            </>
          )}

          {section.type === 'final' && (
            <>
              <Field label="Título final">
                <input
                  type="text"
                  value={content.finalTitle || ''}
                  onChange={(e) =>
                    updateSection(section.id, {
                      content: { ...content, finalTitle: e.target.value },
                    })
                  }
                  className="admin-input-sm"
                />
              </Field>
              <Field label="Texto del remitente">
                <input
                  type="text"
                  value={content.senderText || ''}
                  onChange={(e) =>
                    updateSection(section.id, {
                      content: { ...content, senderText: e.target.value },
                    })
                  }
                  className="admin-input-sm"
                />
              </Field>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============ COLORS TAB ============
function ColorsTab({
  data,
  updateExperience,
}: {
  data: ExperienceData;
  updateExperience: (u: Partial<Experience>) => void;
}) {
  const { experience } = data;

  const colors = [
    { key: 'primary_color', label: 'Color principal (acento)' },
    { key: 'secondary_color', label: 'Color secundario' },
    { key: 'background_color', label: 'Color de fondo' },
    { key: 'text_color', label: 'Color de texto' },
  ] as const;

  const presets = [
    { name: 'Gaby (Rosa + Negro)', primary: '#E56FA3', secondary: '#EFA3C4', bg: '#050505', text: '#FFFFFF' },
    { name: 'Azul Noche', primary: '#4A90D9', secondary: '#7AB8F0', bg: '#0A0E1A', text: '#FFFFFF' },
    { name: 'Esmeralda', primary: '#10B981', secondary: '#6EE7B7', bg: '#050F0A', text: '#FFFFFF' },
    { name: 'Dorado', primary: '#D4AF37', secondary: '#F0D77E', bg: '#0D0A05', text: '#FFFFFF' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-serif text-lg font-light mb-4">Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                updateExperience({
                  primary_color: preset.primary,
                  secondary_color: preset.secondary,
                  background_color: preset.bg,
                  text_color: preset.text,
                })
              }
              className="glass rounded-xl p-3 text-left hover:border-rose-intense/30 transition-all"
            >
              <div className="flex gap-1 mb-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.bg }} />
              </div>
              <p className="text-gray-300 text-xs">{preset.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-white font-serif text-lg font-light">Colores personalizados</h3>
        {colors.map((color) => (
          <div key={color.key} className="glass rounded-xl p-4 flex items-center gap-4">
            <input
              type="color"
              value={experience[color.key]}
              onChange={(e) => updateExperience({ [color.key]: e.target.value })}
              className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10"
            />
            <div className="flex-1">
              <p className="text-white text-sm">{color.label}</p>
              <p className="text-gray-500 text-xs font-mono">{experience[color.key]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-gray-500 text-xs mb-4">Vista previa</p>
        <div
          className="rounded-xl p-8"
          style={{ backgroundColor: experience.background_color }}
        >
          <h3
            className="font-serif text-2xl font-light mb-2"
            style={{ color: experience.text_color }}
          >
            {experience.name}
          </h3>
          <p className="text-sm" style={{ color: experience.primary_color }}>
            {experience.subtitle}
          </p>
          <button
            className="mt-4 px-6 py-2 rounded-full text-sm text-white"
            style={{ backgroundColor: experience.primary_color }}
          >
            Botón de ejemplo
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ SHARED COMPONENTS ============
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      {children}
    </div>
  );
}

function UploadZone({
  onUpload,
  accept,
  label,
  compact,
}: {
  onUpload: (f: File) => void;
  accept: string;
  label: string;
  compact?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`border-2 border-dashed rounded-xl transition-colors ${
        dragOver ? 'border-rose-intense bg-rose-intense/5' : 'border-white/10'
      } ${compact ? 'p-4' : 'p-6'}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
      }}
    >
      <label className="flex items-center justify-center cursor-pointer gap-2 text-gray-400 text-sm">
        <Upload className="w-5 h-5 text-gray-500" />
        {label}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        />
      </label>
    </div>
  );
}
