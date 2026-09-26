import { useState, useRef, useEffect } from 'react';
import { Heart, Music, Play, ChevronDown, Share2, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { Bokeh } from '@/components/Bokeh';
import { PhotoViewer } from '@/components/PhotoViewer';
import type { ExperienceData } from '@/lib/data';
import type { ExperienceSection, SectionType } from '@/lib/types';

interface SectionProps {
  experience: ExperienceData['experience'];
  section: ExperienceSection;
  photos: ExperienceData['photos'];
  storyItems: ExperienceData['storyItems'];
  onOpenGift: () => void;
  accentColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
}

// ============ HERO ============
function HeroSection({ experience, section, onOpenGift, accentColor, bgColor }: SectionProps) {
  const [scrollY, setScrollY] = useState(0);
  const coverPhoto = experience.cover_image_url;
  const buttonText = section.content.buttonText || 'Abrir mi regalo';
  const overlayIntensity = section.content.overlayIntensity || 'medium';
  const blurAmount = parseFloat(section.content.blurAmount || '0');

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const overlayOpacity =
    overlayIntensity === 'light' ? 0.3 : overlayIntensity === 'medium' ? 0.55 : 0.75;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      {coverPhoto ? (
        <div
          className="absolute inset-0 animate-ken-burns"
          style={{
            backgroundImage: `url(${coverPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0003})`,
            filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
          }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: bgColor }}>
          <Bokeh count={8} color={accentColor} />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, ${accentColor}25 0%, transparent 60%)`,
            }}
          />
        </div>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(5,5,5,${overlayOpacity * 0.7}) 0%, rgba(5,5,5,${overlayOpacity}) 50%, rgba(5,5,5,${overlayOpacity * 0.9}) 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-rose-300 mb-6">
            {experience.occasion}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white text-glow-rose leading-tight">
            {section.title || experience.name}
          </h1>
          <p className="font-serif text-xl md:text-2xl text-rose-200 mt-4 italic font-light">
            {section.subtitle || experience.title}
          </p>
          {experience.message && (
            <p className="text-gray-400 mt-8 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              {experience.message}
            </p>
          )}

          <button
            onClick={onOpenGift}
            className="btn-premium mt-10 px-10 py-4 rounded-full font-medium text-white text-sm tracking-wider glow-rose transition-all hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            }}
          >
            <span className="flex items-center gap-2 justify-center">
              <Heart className="w-4 h-4" fill="currentColor" />
              {buttonText.toUpperCase()}
            </span>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white/40" />
      </motion.div>
    </section>
  );
}

// ============ INTRO ============
function IntroSection({ section, accentColor }: SectionProps) {
  const lines = [section.title, section.subtitle].filter(Boolean);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <Bokeh count={4} color={accentColor} />
      <div className="relative z-10 text-center max-w-2xl">
        {lines.map((line, i) => (
          <Reveal key={i} animation="reveal" delay={i * 800}>
            <p
              className={`font-serif ${
                i === 0
                  ? 'text-3xl md:text-5xl font-light text-white leading-relaxed mb-6'
                  : 'text-xl md:text-2xl text-gray-400 italic font-light'
              }`}
            >
              {line}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============ STORY ============
function StorySection({ section, storyItems, accentColor }: SectionProps) {
  if (storyItems.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <Reveal animation="fade" className="text-center max-w-xl">
          <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-4">
            {section.title}
          </h2>
          <p className="text-gray-400">{section.subtitle}</p>
          <p className="text-gray-600 text-sm mt-8 italic">
            Esta historia todavía está escribiéndose.
          </p>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal animation="fade" className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-6xl text-white font-light">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-gray-400 mt-3">{section.subtitle}</p>
          )}
        </Reveal>

        <div className="space-y-20">
          {storyItems.map((item, i) => (
            <Reveal
              key={item.id}
              animation={i % 2 === 0 ? 'slide' : 'fade'}
              delay={100}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
            >
              {item.image_url && (
                <div className="flex-1 relative group">
                  <div
                    className="absolute -inset-2 rounded-2xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: accentColor }}
                  />
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="relative rounded-2xl w-full object-cover max-h-[400px] light-sweep"
                    style={{ boxShadow: `0 10px 60px ${accentColor}20` }}
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                {item.date && (
                  <p className="text-sm tracking-wider uppercase mb-2" style={{ color: accentColor }}>
                    {item.date}
                  </p>
                )}
                <h3 className="font-serif text-3xl text-white mb-3 font-light">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ GALLERY ============
function GallerySection({ experience, section, photos, accentColor }: SectionProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const style = experience.gallery_style || 'editorial';

  if (photos.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <Reveal animation="fade" className="text-center max-w-xl">
          <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-4">
            {section.title}
          </h2>
          <p className="text-gray-400">{section.subtitle}</p>
          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-xl border border-white/5 flex items-center justify-center"
                style={{ background: `${accentColor}08` }}
              >
                <div className="w-8 h-8 rounded-full" style={{ background: `${accentColor}15` }} />
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-6 italic">
            Las fotografías aparecerán aquí pronto.
          </p>
        </Reveal>
      </section>
    );
  }

  if (style === 'masonry') {
    return (
      <section className="relative py-24 px-4">
        <Reveal animation="fade" className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-6xl text-white font-light">{section.title}</h2>
          {section.subtitle && <p className="text-gray-400 mt-3">{section.subtitle}</p>}
        </Reveal>
        <div className="columns-2 md:columns-3 gap-3 max-w-5xl mx-auto [&>*]:mb-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.id} animation="zoom" delay={i * 50}>
              <div
                onClick={() => setViewerIndex(i)}
                className="relative group cursor-pointer overflow-hidden rounded-xl break-inside-avoid"
              >
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-serif">{photo.title}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {viewerIndex !== null && (
          <PhotoViewer
            photos={photos}
            startIndex={viewerIndex}
            onClose={() => setViewerIndex(null)}
            accentColor={accentColor}
          />
        )}
      </section>
    );
  }

  // Editorial / cinematic / default
  return (
    <section className="relative py-24 px-4">
      <Reveal animation="fade" className="text-center mb-12">
        <h2 className="font-serif text-4xl md:text-6xl text-white font-light">{section.title}</h2>
        {section.subtitle && <p className="text-gray-400 mt-3">{section.subtitle}</p>}
      </Reveal>

      <div className="max-w-5xl mx-auto space-y-6">
        {photos.map((photo, i) => {
          const isLarge = i === 0 || (i % 4 === 0 && photos.length > 3);
          return (
            <Reveal
              key={photo.id}
              animation={i % 2 === 0 ? 'parallax' : 'zoom'}
              delay={i * 80}
            >
              <div
                onClick={() => setViewerIndex(i)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl mx-auto light-sweep"
                style={{
                  maxWidth: isLarge ? '100%' : '75%',
                  boxShadow: `0 10px 50px ${accentColor}15`,
                }}
              >
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    isLarge ? 'max-h-[600px]' : 'max-h-[400px]'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div>
                    {photo.title && (
                      <p className="text-white font-serif text-lg">{photo.title}</p>
                    )}
                    {photo.description && (
                      <p className="text-gray-300 text-sm mt-1">{photo.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {viewerIndex !== null && (
        <PhotoViewer
          photos={photos}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          accentColor={accentColor}
        />
      )}
    </section>
  );
}

// ============ SONG ============
function SongSection({ experience, section, accentColor }: SectionProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [bars] = useState(() => Array.from({ length: 40 }, () => 20 + Math.random() * 80));

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <Bokeh count={6} color={accentColor} />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${accentColor}15 0%, transparent 70%)` }}
      />

      <div className="relative z-10 text-center max-w-lg w-full">
        <Reveal animation="fade">
          <p className="text-sm tracking-[0.3em] uppercase text-rose-300 mb-6">
            Música
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-white font-light mb-12">
            {section.title}
          </h2>
        </Reveal>

        <Reveal animation="zoom" delay={200}>
          <div className="glass-rose rounded-3xl p-8 glow-rose">
            {/* Cover */}
            <div className="relative mx-auto w-48 h-48 mb-6">
              {experience.music_cover_url ? (
                <img
                  src={experience.music_cover_url}
                  alt=""
                  className={`w-full h-full object-cover rounded-2xl transition-transform duration-1000 ${
                    playing ? 'scale-105' : ''
                  }`}
                  style={{ boxShadow: `0 0 50px ${accentColor}40` }}
                />
              ) : (
                <div
                  className="w-full h-full rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)` }}
                >
                  <Music className="w-16 h-16" style={{ color: accentColor }} />
                </div>
              )}
              {/* Audio visualizer */}
              {playing && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-12">
                  {bars.slice(0, 20).map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full"
                      style={{ backgroundColor: accentColor }}
                      animate={{ height: [`${h * 0.3}px`, `${h}px`, `${h * 0.3}px`] }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Infinity,
                        delay: i * 0.03,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <p className="text-white font-serif text-xl mb-1">
              {experience.music_title || 'Canción personalizada'}
            </p>
            {experience.music_artist && (
              <p className="text-gray-400 text-sm mb-6">{experience.music_artist}</p>
            )}

            {/* Play button */}
            {experience.music_url ? (
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110 glow-rose"
                style={{ backgroundColor: accentColor }}
                aria-label={playing ? 'Pausar' : 'Reproducir'}
              >
                {playing ? (
                  <span className="flex gap-1">
                    <span className="w-1.5 h-5 bg-white rounded-sm" />
                    <span className="w-1.5 h-5 bg-white rounded-sm" />
                  </span>
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                )}
              </button>
            ) : (
              <div className="py-4 text-gray-500 text-sm italic">
                La canción se añadirá pronto
              </div>
            )}

            {section.subtitle && (
              <p className="text-gray-500 text-xs mt-6 italic">{section.subtitle}</p>
            )}

            {experience.music_url && (
              <audio ref={audioRef} src={experience.music_url} loop preload="none" />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============ VIDEO ============
function VideoSection({ experience, section, accentColor }: SectionProps) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${accentColor}10 0%, transparent 70%)` }}
      />

      <div className="relative z-10 text-center max-w-md w-full">
        <Reveal animation="fade">
          <p className="text-sm tracking-[0.3em] uppercase text-rose-300 mb-4">Video</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-8">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-gray-400 mb-8">{section.subtitle}</p>
          )}
        </Reveal>

        <Reveal animation="zoom" delay={200}>
          {experience.video_url ? (
            <div
              className="relative rounded-2xl overflow-hidden glow-rose cursor-pointer mx-auto"
              style={{ maxWidth: '320px', aspectRatio: '9/16' }}
              onClick={() => setFullscreen(true)}
            >
              <video
                src={experience.video_url}
                className="w-full h-full object-cover"
                playsInline
                muted
                loop
                autoPlay
              />
              <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl pointer-events-none" />
            </div>
          ) : (
            <div
              className="relative rounded-2xl overflow-hidden mx-auto flex items-center justify-center"
              style={{
                maxWidth: '320px',
                aspectRatio: '9/16',
                background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}05)`,
                border: `1px solid ${accentColor}20`,
              }}
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Play className="w-7 h-7" style={{ color: accentColor }} />
                </div>
                <p className="text-gray-500 text-sm">El video se añadirá pronto</p>
              </div>
            </div>
          )}
        </Reveal>
      </div>

      {/* Fullscreen video */}
      <AnimatePresence>
        {fullscreen && experience.video_url && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <video
              src={experience.video_url}
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
              controls
              autoPlay
              playsInline
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============ MESSAGE ============
function MessageSection({ experience, section, accentColor }: SectionProps) {
  const text = section.content.text || '';
  const fontFamily = section.content.fontFamily || 'serif';
  const align = section.content.align || 'center';
  const size = section.content.size || 'lg';

  const fontClass =
    fontFamily === 'script' ? 'font-script' : fontFamily === 'sans' ? 'font-sans-body' : 'font-serif';

  const sizeClass =
    size === 'sm' ? 'text-lg md:text-xl' : size === 'xl' ? 'text-2xl md:text-4xl' : 'text-xl md:text-3xl';

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <Bokeh count={3} color={accentColor} />
      <div className="relative z-10 max-w-2xl text-center">
        <Reveal animation="fade">
          <p
            className="text-sm tracking-[0.3em] uppercase mb-8"
            style={{ color: accentColor }}
          >
            {section.title}
          </p>
        </Reveal>
        <Reveal animation="reveal" delay={300}>
          <p
            className={`${fontClass} ${sizeClass} text-white leading-relaxed whitespace-pre-line`}
            style={{ textAlign: align as 'left' | 'center' | 'right' }}
          >
            {text || 'Este mensaje todavía está siendo escrito con cariño.'}
          </p>
        </Reveal>
        <Reveal animation="fade" delay={600}>
          <div
            className="w-16 h-px mx-auto mt-10"
            style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
          />
          <p className="font-script text-2xl text-white mt-6">
            {experience.sender_name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ============ SURPRISE ============
function SurpriseSection({ section, photos, accentColor }: SectionProps) {
  const [stage, setStage] = useState(0);
  const preText = section.content.preText || 'Todavía falta una cosa...';
  const midText = section.content.midText || 'Quiero que recuerdes algo.';
  const postText = section.content.postText || 'Eres una persona única.';

  const specialPhoto = photos.find((p) => p.is_cover) || photos[0];

  const stages = [preText, midText, postText];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden cursor-pointer"
      onClick={() => setStage((s) => Math.min(s + 1, stages.length - 1))}
    >
      <Bokeh count={5} color={accentColor} />
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accentColor}${stage === 2 ? '25' : '08'} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 text-center max-w-xl">
        <AnimatePresence mode="wait">
          {stage < 2 ? (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              transition={{ duration: 1 }}
            >
              <p className="font-serif text-3xl md:text-5xl text-white font-light leading-relaxed">
                {stages[stage]}
              </p>
              {stage < stages.length - 1 && (
                <p className="text-gray-500 text-xs mt-8 animate-pulse">
                  Toca para continuar
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              {specialPhoto?.image_url && (
                <motion.div
                  className="relative mx-auto mb-8 rounded-2xl overflow-hidden"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  style={{ boxShadow: `0 0 80px ${accentColor}40` }}
                >
                  <img
                    src={specialPhoto.image_url}
                    alt=""
                    className="max-w-xs max-h-80 object-cover"
                  />
                </motion.div>
              )}
              <p className="font-serif text-2xl md:text-4xl text-white font-light leading-relaxed">
                {postText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============ FINAL ============
function FinalSection({ experience, section, accentColor }: SectionProps) {
  const finalTitle = section.content.finalTitle || 'FELIZ CUMPLEAÑOS';
  const senderText = section.content.senderText || experience.sender_name || 'Con cariño';

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <Bokeh count={8} color={accentColor} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accentColor}20 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 text-center max-w-2xl">
        <Reveal animation="cinematic">
          <h1 className="font-serif text-5xl md:text-7xl text-white text-glow-rose font-light">
            {section.title || experience.name}
          </h1>
        </Reveal>

        <Reveal animation="fade" delay={400}>
          <p className="text-gray-400 mt-6 font-serif text-lg italic">
            {section.subtitle}
          </p>
        </Reveal>

        <Reveal animation="reveal" delay={800}>
          <div className="my-12">
            <p className="font-serif text-3xl md:text-5xl text-white font-light">
              {finalTitle}
            </p>
            <div className="flex justify-center mt-4">
              <Heart
                className="w-8 h-8"
                style={{ color: accentColor, fill: accentColor }}
              />
            </div>
          </div>
        </Reveal>

        <Reveal animation="fade" delay={1200}>
          <p className="font-script text-3xl text-rose-200">
            {senderText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ============ SHARE ============
function ShareSection({ experience, accentColor }: SectionProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareWhatsApp = () => {
    const text = `Te comparto una experiencia especial: ${experience.name}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl)}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: experience.name,
          text: experience.title,
          url: currentUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <Bokeh count={3} color={accentColor} />
      <div className="relative z-10 text-center max-w-md mx-auto">
        <Reveal animation="fade">
          <div className="inline-flex items-center gap-2 text-rose-300 text-sm tracking-wider uppercase mb-6">
            <Share2 className="w-4 h-4" />
            Comparte
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-light mb-8">
            ¿Quieres compartir esta experiencia?
          </h2>
        </Reveal>

        <Reveal animation="zoom" delay={200}>
          <div className="flex flex-col gap-3">
            <button
              onClick={shareWhatsApp}
              className="glass-rose rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-white hover:scale-105 transition-transform"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>

            <button
              onClick={shareNative}
              className="glass rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-white hover:scale-105 transition-transform"
            >
              <Share2 className="w-5 h-5" style={{ color: accentColor }} />
              Compartir
            </button>

            <button
              onClick={copyLink}
              className="glass rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-white hover:scale-105 transition-transform"
            >
              {copied ? (
                <span className="text-rose-300">¡Enlace copiado!</span>
              ) : (
                <>
                  <QrCode className="w-5 h-5" style={{ color: accentColor }} />
                  Copiar enlace
                </>
              )}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============ SECTION RENDERER ============
const SECTION_COMPONENTS: Record<SectionType, React.FC<SectionProps>> = {
  hero: HeroSection,
  intro: IntroSection,
  story: StorySection,
  gallery: GallerySection,
  song: SongSection,
  video: VideoSection,
  message: MessageSection,
  surprise: SurpriseSection,
  final: FinalSection,
  share: ShareSection,
};

export function SectionRenderer(props: SectionProps) {
  const Component = SECTION_COMPONENTS[props.section.type];
  if (!Component || !props.section.enabled) return null;
  return <Component {...props} />;
}
