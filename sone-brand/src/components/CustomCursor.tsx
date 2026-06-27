'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isAdmin) return;
    setMounted(true);
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };
    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    const handleLinkHoverEvents = () => {
      const links = document.querySelectorAll('a, button, input, textarea, .nav-icon');
      links.forEach(el => {
        el.addEventListener('mouseenter', () => setLinkHovered(true));
        el.addEventListener('mouseleave', () => setLinkHovered(false));
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    
    handleLinkHoverEvents();

    if (!isAdmin) {
      document.body.classList.add('custom-cursor-active');
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isAdmin]);

  if (!mounted || isAdmin) return null;

  // Simple mobile check
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);
  if (isMobile) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          background: 'white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0) scale(${linkHovered ? 2.5 : clicked ? 0.8 : 1})`,
          transition: 'transform 0.15s ease-out, opacity 0.3s ease',
          opacity: hidden ? 0 : 1,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          background: 'white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
          mixBlendMode: 'difference',
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
          opacity: hidden ? 0 : 1,
        }}
      />
      <style jsx global>{`
        @media (pointer: fine) {
          body, a, button, input, select, textarea {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
