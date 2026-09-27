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
    setError(false);
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
          <p className="text-gray-500 mb-2">El enlace es incorrecto o aún no está publicada.</p>
          <p className="text-xs text-gray-400">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  const { experience, photos, sections, storyItems } = data;
  const enabledSections = sections.filter((s) => s.enabled);

  if (enabledSections.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 py-20 text-center"
        style={{ backgroundColor: experience.background_color || '#ffffff', color: experience.text_color || '#111827' }}
      >
        <div className="max-w-lg">
          <h1 className="font-serif text-5xl mb-4">{experience.title}</h1>
          {experience.subtitle && <p className="text-xl mb-6 opacity-80">{experience.subtitle}</p>}
          {experience.message && <p className="mb-8">{experience.message}</p>}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 text-left">
            <b>Fix aplicado:</b> Ya no es pantalla negra. Ve a <code>/admin</code> para editar contenido.
          </div>
        </div>
      </div>
    );
  }

  const bgColor = experience.background_color || '#ffffff';
  const textColor = experience.text_color || '#111827';

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
      {enabledSections.map((section, index) => (
        <div key={section.id} id={`section-${index}`}>
          <SectionRenderer
            experience={experience}
            section={section}
            photos={photos}
            storyItems={storyItems}
            onOpenGift={() => setGiftOpened(true)}
            accentColor={experience.primary_color}
            secondaryColor={experience.secondary_color}
            bgColor={bgColor}
            textColor={textColor}
          />
        </div>
      ))}
      <FloatingPlayer
        src={experience.music_url}
        title={experience.music_title}
        artist={experience.music_artist}
        coverUrl={experience.music_cover_url}
        accentColor={experience.primary_color}
        autoPlay={giftOpened}
      />
    </div>
  );
}
