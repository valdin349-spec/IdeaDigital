interface BokehProps {
  count?: number;
  color?: string;
}

export function Bokeh({ count = 5, color = '#E56FA3' }: BokehProps) {
  const particles = Array.from({ length: count }, (_, i) => {
    const size = 60 + Math.random() * 200;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 5;

    return (
      <div
        key={i}
        className="bokeh animate-float"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          backgroundColor: color,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity: 0.08 + Math.random() * 0.12,
        }}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{particles}</div>;
}
