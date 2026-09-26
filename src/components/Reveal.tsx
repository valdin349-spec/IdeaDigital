import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade' | 'slide' | 'zoom' | 'reveal' | 'cinematic' | 'parallax' | 'none';
}

export function Reveal({ children, className = '', delay = 0, animation = 'fade' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || animation === 'none') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay]);

  if (animation === 'none') {
    return <div className={className}>{children}</div>;
  }

  const initial: Record<string, string> = {
    fade: 'opacity-0',
    slide: 'opacity-0 translate-y-12',
    zoom: 'opacity-0 scale-95',
    reveal: 'opacity-0 blur-md translate-y-8',
    cinematic: 'opacity-0 scale-110 blur-lg',
    parallax: 'opacity-0 translate-y-20',
  };

  const visibleClass: Record<string, string> = {
    fade: 'opacity-100',
    slide: 'opacity-100 translate-y-0',
    zoom: 'opacity-100 scale-100',
    reveal: 'opacity-100 blur-0 translate-y-0',
    cinematic: 'opacity-100 scale-100 blur-0',
    parallax: 'opacity-100 translate-y-0',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${visible ? visibleClass[animation] : initial[animation]} ${className}`}
    >
      {children}
    </div>
  );
}
