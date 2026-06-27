'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DissolveImage({ src, alt, className = '', style = {} }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);
  const hovered = useRef(false);
  const animFrame = useRef<number>(0);
  const revealProgress = useRef(0);    // 0 → 1
  const waveOffset = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    const TILE = 12; // pixel tile size
    let tiles: { x: number; y: number; delay: number }[] = [];
    let cols = 0, rows = 0;

    const buildTiles = () => {
      cols = Math.ceil(canvas.width / TILE);
      rows = Math.ceil(canvas.height / TILE);
      tiles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          tiles.push({ x: c * TILE, y: r * TILE, delay: Math.random() });
        }
      }
      // Shuffle for dissolve order
      tiles.sort((a, b) => a.delay - b.delay);
    };

    const resize = () => {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      buildTiles();
      if (revealed.current) draw(1, 0);
    };

    const draw = (progress: number, wave: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!imgRef.current) return;

      if (hovered.current) {
        // Wave distortion effect
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tctx = tempCanvas.getContext('2d')!;
        tctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = tctx.getImageData(0, 0, canvas.width, canvas.height);
        const out = ctx.createImageData(canvas.width, canvas.height);
        const d = imageData.data;
        const o = out.data;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const waveX = Math.round(Math.sin((y / canvas.height * Math.PI * 4) + wave) * 6);
            const waveY = Math.round(Math.cos((x / canvas.width * Math.PI * 4) + wave) * 4);
            const sx = Math.max(0, Math.min(canvas.width - 1, x + waveX));
            const sy = Math.max(0, Math.min(canvas.height - 1, y + waveY));
            const si = (sy * canvas.width + sx) * 4;
            const di = (y * canvas.width + x) * 4;
            o[di] = d[si];
            o[di + 1] = d[si + 1];
            o[di + 2] = d[si + 2];
            o[di + 3] = d[si + 3];
          }
        }
        ctx.putImageData(out, 0, 0);
      } else {
        // Pixel dissolve reveal
        const threshold = progress;
        ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
        if (progress < 1) {
          ctx.fillStyle = '#f2f2f2';
          for (const tile of tiles) {
            if (tile.delay > threshold) {
              ctx.fillRect(tile.x, tile.y, TILE + 1, TILE + 1);
            }
          }
        }
      }
    };

    img.onload = () => {
      imgRef.current = img;
      resize();

      // IntersectionObserver for scroll reveal
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !revealed.current) {
            revealed.current = true;
            io.disconnect();

            // Animate reveal
            const start = performance.now();
            const dur = 900;
            const animate = (now: number) => {
              const p = Math.min(1, (now - start) / dur);
              // Ease in-out
              const ep = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
              revealProgress.current = ep;
              draw(ep, waveOffset.current);
              if (p < 1) animFrame.current = requestAnimationFrame(animate);
            };
            animFrame.current = requestAnimationFrame(animate);
          }
        });
      }, { threshold: 0.15 });
      io.observe(wrap);
    };

    // Hover wave loop
    const onEnter = () => {
      hovered.current = true;
      const loop = () => {
        if (!hovered.current) return;
        waveOffset.current += 0.04;
        draw(1, waveOffset.current);
        animFrame.current = requestAnimationFrame(loop);
      };
      animFrame.current = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      hovered.current = false;
      cancelAnimationFrame(animFrame.current);
      draw(1, 0);
    };
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener('resize', resize);
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [src]);

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
