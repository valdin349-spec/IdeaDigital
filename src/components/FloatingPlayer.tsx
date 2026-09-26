import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface FloatingPlayerProps {
  src: string | null;
  title: string | null;
  artist: string | null;
  coverUrl: string | null;
  accentColor: string;
  autoPlay?: boolean;
}

export function FloatingPlayer({
  src,
  title,
  artist,
  coverUrl,
  accentColor,
  autoPlay = false,
}: FloatingPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    const onTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
      setCurrent(audio.currentTime);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  useEffect(() => {
    if (autoPlay && src && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [autoPlay, src]);

  if (!src) return null;

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

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
    setProgress(pct * 100);
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <div
        className="fixed bottom-4 right-4 z-50 transition-all duration-500"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div
          className="glass-rose rounded-2xl overflow-hidden glow-rose-sm transition-all duration-500"
          style={{
            width: expanded ? 300 : 56,
          }}
        >
          {/* Expanded view */}
          <div className={`transition-all duration-300 ${expanded ? 'block' : 'hidden'}`}>
            {coverUrl ? (
              <div className="relative h-32 overflow-hidden">
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir to-transparent" />
              </div>
            ) : (
              <div
                className="h-32 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${accentColor}33, transparent)` }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}22` }}>
                  <Play className="w-5 h-5" style={{ color: accentColor }} />
                </div>
              </div>
            )}
            <div className="p-3">
              <p className="text-xs font-medium text-white truncate">
                {title || 'Canción'}
              </p>
              <p className="text-[10px] text-gray-400 truncate mb-2">
                {artist || ''}
              </p>
              {/* Progress */}
              <div
                className="h-1 rounded-full bg-white/10 cursor-pointer mb-1"
                onClick={seek}
              >
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${progress}%`, backgroundColor: accentColor }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 mb-2">
                <span>{fmt(current)}</span>
                <span>{fmt(duration)}</span>
              </div>
              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={muted ? 'Activar sonido' : 'Silenciar'}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: accentColor }}
                  aria-label={playing ? 'Pausar' : 'Reproducir'}
                >
                  {playing ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Collapsed view */}
          <div className={`flex items-center justify-center h-14 ${expanded ? 'hidden' : 'flex'}`}>
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: accentColor }}
              aria-label={playing ? 'Pausar' : 'Reproducir'}
            >
              {playing ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
