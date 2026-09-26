import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ExperiencePhoto } from '@/lib/types';

interface PhotoViewerProps {
  photos: ExperiencePhoto[];
  startIndex: number;
  onClose: () => void;
  accentColor: string;
}

export function PhotoViewer({ photos, startIndex, onClose, accentColor }: PhotoViewerProps) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  const next = () => setIndex((i) => (i + 1) % photos.length);
  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);

  if (photos.length === 0) return null;

  const photo = photos[index];

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:scale-110 transition-transform"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Previous */}
      {photos.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-2 md:left-6 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:scale-110 transition-transform"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center" key={index}>
        <img
          src={photo.image_url}
          alt={photo.title || ''}
          className="max-w-full max-h-[78vh] object-contain rounded-lg"
          style={{ boxShadow: `0 0 60px ${accentColor}30` }}
        />
        {(photo.title || photo.description) && (
          <div className="text-center mt-4 px-4">
            {photo.title && (
              <p className="font-serif text-lg text-white">{photo.title}</p>
            )}
            {photo.description && (
              <p className="text-sm text-gray-400 mt-1">{photo.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={next}
          className="absolute right-2 md:right-6 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:scale-110 transition-transform"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-400">
          {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
