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
      if (result) {
        setData(result);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-rose-intense/30 border-t-rose-intense animate-spin" />
          <p className="text-rose-300 font-serif text-lg">Preparando tu experiencia...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full glass-rose flex items-center justify-center">
            <span className="text-3xl">💔</span>
          </div>
          <h1 className="font-serif text-3xl text-white font-light mb-3">
            Esta experiencia no está disponible
          </h1>
          <p className="text-gray-400">
            Puede que el enlace sea incorrecto o que la experiencia aún no haya sido publicada.
          </p>
        </div>
      </div>
    );
  }

  const { experience, photos, sections, storyItems } = data;
  const accentColor = experience.primary_color;
  const secondaryColor = experience.secondary_color;
  const bgColor = experience.background_color;
  const textColor = experience.text_color;

  const enabledSections = sections.filter((s) => s.enabled);

  const handleOpenGift = () => {
    setGiftOpened(true);
    // Scroll to the next section after hero
    const next = document.getElementById('section-1');
    if (next) {
      next.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {enabledSections.map((section, i) => (
        <div key={section.id} id={`section-${i}`}>
          <SectionRenderer
            experience={experience}
            section={section}
            photos={photos}
            storyItems={storyItems}
            onOpenGift={handleOpenGift}
            accentColor={accentColor}
            secondaryColor={secondaryColor}
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
        accentColor={accentColor}
        autoPlay={giftOpened}
      />
    </div>
  );
}
