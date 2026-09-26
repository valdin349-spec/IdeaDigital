import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react';
import { loadExperienceAdmin, type ExperienceData } from '@/lib/data';
import { SectionRenderer } from '@/components/sections';
import { FloatingPlayer } from '@/components/FloatingPlayer';

export function AdminPreview() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  useEffect(() => {
    if (!slug) return;
    loadExperienceAdmin(slug).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [slug]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-rose-intense/30 border-t-rose-intense animate-spin" />
      </div>
    );
  }

  const { experience, photos, sections, storyItems } = data;
  const enabledSections = sections.filter((s) => s.enabled);
  const accentColor = experience.primary_color;

  return (
    <div className="min-h-screen bg-noir flex flex-col">
      {/* Toolbar */}
      <header className="border-b border-white/5 sticky top-0 z-50 bg-noir/90 backdrop-blur-xl">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/edit/${slug}`)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-lg text-white font-light">Vista previa</h1>
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                device === 'mobile' ? 'bg-rose-intense/20 text-rose-200' : 'text-gray-400'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Móvil
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                device === 'desktop' ? 'bg-rose-intense/20 text-rose-200' : 'text-gray-400'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Escritorio
            </button>
          </div>
        </div>
      </header>

      {/* Preview area */}
      <div className="flex-1 flex justify-center items-start py-6 bg-noir-300 overflow-auto">
        <div
          className={`relative bg-noir transition-all duration-500 overflow-y-auto overflow-x-hidden ${
            device === 'mobile'
              ? 'w-[390px] h-[780px] rounded-[2.5rem] border-8 border-noir-100 shadow-2xl'
              : 'w-full max-w-6xl h-[780px] rounded-2xl'
          }`}
          style={{ backgroundColor: experience.background_color }}
        >
          {enabledSections.map((section, i) => (
            <div key={section.id} id={`preview-section-${i}`}>
              <SectionRenderer
                experience={experience}
                section={section}
                photos={photos}
                storyItems={storyItems}
                onOpenGift={() => {
                  const next = document.getElementById('preview-section-1');
                  if (next) next.scrollIntoView({ behavior: 'smooth' });
                }}
                accentColor={accentColor}
                secondaryColor={experience.secondary_color}
                bgColor={experience.background_color}
                textColor={experience.text_color}
              />
            </div>
          ))}

          <FloatingPlayer
            src={experience.music_url}
            title={experience.music_title}
            artist={experience.music_artist}
            coverUrl={experience.music_cover_url}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
}
