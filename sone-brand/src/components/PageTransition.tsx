'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition() {
  const overlay = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      if (!overlay.current) return;
      // Sweep in then out
      gsap.fromTo(overlay.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 0.45,
          ease: 'cubic-bezier(0.77,0,0.18,1)',
          onComplete: () => {
            gsap.to(overlay.current!, {
              scaleX: 0,
              transformOrigin: 'right center',
              duration: 0.45,
              ease: 'cubic-bezier(0.77,0,0.18,1)',
              delay: 0.05,
            });
          }
        }
      );
    }
  }, [pathname]);

  return (
    <div
      ref={overlay}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#ffffffff',
        zIndex: 999995,
        pointerEvents: 'none',
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
      }}
    />
  );
}
