import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadExperience, type ExperienceData } from '@/lib/data';
import { SectionRenderer } from '@/components/sections';
import { FloatingPlayer } from '@/components/FloatingPlayer';

export function ExperiencePage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    loadExperience(slug).then((result) => {
      if (result) setData(result);
      else setError(true);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-rose-200 border-t-rose-500 animate-spin" />
          <p className="text-rose-500 font-serif text-lg">Preparando tu experiencia...</p>
        </div>
      </div>
    );
  }

  if (error ||!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-3xl text-gray-900 mb-3">No disponible</h1>
          <p className="text-gray-500">El enlace es incorrecto o aún no está publicada. Slug: {slug}</p>
        </div>
      </div>
    );
  }

  const { experience, photos, sections, storyItems } = data;
  const enabledSections = sections.filter((s) => s.enabled);

  // FIX ANTI-PANTALLA-NEGRA: si no hay secciones, muestra fallback
  if (enabledSections.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6" style={{ backgroundColor: experience.background_color, color: experience.text_color }}>
        <div className="text-center max-w-lg py-20">
          <h1 className="font-serif text-5xl mb-4">{experience.title}</h1>
          <p className="text-xl mb-2">{experience.subtitle}</p>
          <p className="mb-8">{experience.message}</p>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            Estás viendo esta pantalla porque <b>experience_sections está vacío</b> para {slug}. Ve a Supabase y crea las secciones. Ya corregí el código para que nunca más se quede en negro.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: experience.background_color, color: experience.text_color }}>
      {enabledSections.map((section, i) => (
        <div key={section.id} id={`section-${i}`}>
          <SectionRenderer experience={experience} section={section} photos={photos} storyItems={storyItems} onOpenGift={() => setGiftOpened(true)} accentColor={experience.primary_color} secondaryColor={experience.secondary_color} bgColor={experience.background_color} textColor={experience.text_color} />
        </div>
      ))}
      <FloatingPlayer src={experience.music_url} title={experience.music_title} artist={experience.music_artist} coverUrl={experience.music_cover_url} accentColor={experience.primary_color} autoPlay={giftOpened} />
    </div>
  );
}
