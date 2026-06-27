'use client';
import { useEffect, useRef } from 'react';

interface Props {
  items: string[];
  className?: string;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  separator?: string;
}

export default function DraggableMarquee({ items, className = '', style = {}, itemStyle = {}, separator = '✦' }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const vel = useRef(1.2);        // pixels/frame base speed
  const drag = useRef(false);
  const lastX = useRef(0);
  const posX = useRef(0);
  const raf = useRef<number>(0);
  const width = useRef(0);        // single set width

  const rep = [...items, ...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    // Measure single-set width
    const observer = new ResizeObserver(() => {
      width.current = track.scrollWidth / 3;
    });
    observer.observe(track);

    // Animation loop
    const animate = () => {
      if (!drag.current) {
        // Decelerate drag velocity toward base speed
        vel.current += (1.2 - vel.current) * 0.04;
      }
      posX.current -= vel.current;

      // Loop reset
      if (width.current > 0) {
        if (Math.abs(posX.current) >= width.current) {
          posX.current += width.current;
        }
        if (posX.current > 0) {
          posX.current -= width.current;
        }
      }

      if (track) {
        track.style.transform = `translateX(${posX.current}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    // Drag handlers
    const onDown = (e: MouseEvent | TouchEvent) => {
      drag.current = true;
      lastX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
      vel.current = 0;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!drag.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const dx = x - lastX.current;
      vel.current = -dx * 0.4;
      posX.current += dx;
      lastX.current = x;
    };
    const onUp = () => { drag.current = false; };

    container.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    container.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    return () => {
      cancelAnimationFrame(raf.current);
      observer.disconnect();
      container.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      container.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'grab',
        ...style,
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {rep.map((item, i) => (
          <span key={i} style={{ ...itemStyle }}>
            {item}
            <span style={{ margin: '0 32px', opacity: 0.25 }}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
