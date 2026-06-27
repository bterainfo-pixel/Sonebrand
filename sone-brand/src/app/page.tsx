'use client';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import ReviewsSection from '@/components/ReviewsSection';
import DraggableMarquee from '@/components/DraggableMarquee';

/* ═══════════════════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════════════════ */
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const hover = () => ring.current?.classList.add('hovered');
    const unhover = () => ring.current?.classList.remove('hovered');
    window.addEventListener('mousemove', move);
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', hover);
      el.addEventListener('mouseleave', unhover);
    });
    const animate = () => {
      if (dot.current) {
        dot.current.style.left = pos.current.x + 'px';
        dot.current.style.top = pos.current.y + 'px';
      }
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ring.current) {
        ring.current.style.left = ringPos.current.x + 'px';
        ring.current.style.top = ringPos.current.y + 'px';
      }
      raf.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-scale');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════
   HERO SLIDER
   ═══════════════════════════════════════════════════════ */
function Hero() {
  const { settings } = useStore();
  const [slide, setSlide] = useState(0);
  const slides = settings.heroSlides;

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides]);

  if (!slides || slides.length === 0) return null;
  const s = slides[slide];

  return (
    <section className="hero-section">
      {slides.map((sl, i) => (
        <img key={i} src={sl.bg} alt="" className={`hero-bg ${i === slide ? 'hero-bg-active' : ''}`} />
      ))}
      <div className="hero-overlay" />
      <div className="hero-content">
        <div key={slide} style={{ animation: 'fadeUp 0.6s ease forwards' }}>
          <p className="hero-eyebrow">{s.eye}</p>
          <h1 className="hero-title glitch" data-text={s.title} style={{ fontFamily: 'var(--font-display)' }}>
            {s.title}
          </h1>
          <p className="hero-sub">{s.sub}</p>
          <Link href={s.href} className="hero-cta btn-3d">{s.cta}</Link>
        </div>
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} className={`hero-dot ${i === slide ? 'hero-dot-active' : ''}`} />
        ))}
      </div>
      <div className="hero-slide-counter">{String(slide + 1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</div>
      <div className="hero-scroll-hint">
        <span className="hero-scroll-text">SCROLL</span>
        <div className="hero-scroll-line" />
      </div>

      <style>{`
        .hero-section {
          position: sticky;
          top: 0;
          height: 100vh;
          min-height: 520px;
          overflow: hidden;
          background: #000;
          z-index: 0;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1.2s ease;
          transform: scale(1.04);
        }
        .hero-bg-active { opacity: 0.6; transform: scale(1); transition: opacity 1.2s ease, transform 6s ease; }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.6) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 60px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 120px;
        }
        .hero-eyebrow {
          font-family: var(--font-main);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 6px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
          text-transform: uppercase;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-title {
          font-size: clamp(60px, 9vw, 130px);
          color: #fff;
          line-height: 0.88;
          letter-spacing: -1px;
          white-space: pre-line;
          margin-bottom: 28px;
          text-transform: uppercase;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .hero-sub {
          font-family: var(--font-main);
          font-size: 12px;
          font-weight: 300;
          color: rgba(255,255,255,0.55);
          letter-spacing: 2px;
          margin-bottom: 40px;
          animation: fadeUp 0.7s 0.3s ease both;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          color: #000;
          padding: 18px 48px;
          font-family: var(--font-main);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
          transition: all 0.3s ease;
          border: 1px solid #fff;
          animation: fadeUp 0.7s 0.4s ease both;
        }
        .hero-cta::after { content: '→'; font-size: 14px; transition: transform 0.3s ease; }
        .hero-cta:hover { background: transparent; color: #fff; }
        .hero-cta:hover::after { transform: translateX(6px); }
        .hero-scroll-hint {
          position: absolute;
          bottom: 40px;
          right: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 3;
          animation: fadeIn 1s 1s ease both;
        }
        .hero-scroll-line {
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, transparent, #fff);
          animation: scrollLine 1.5s ease infinite;
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .hero-scroll-text {
          font-family: var(--font-main);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.4);
          writing-mode: vertical-rl;
          text-transform: uppercase;
        }
        .hero-dots {
          position: absolute;
          bottom: 44px;
          left: 60px;
          display: flex;
          gap: 6px;
          z-index: 3;
          align-items: center;
        }
        .hero-dot {
          height: 2px;
          width: 20px;
          background: rgba(255,255,255,0.25);
          border: none;
          transition: width 0.4s ease, background 0.4s ease;
          padding: 0;
        }
        .hero-dot-active { width: 40px; background: #fff; }
        .hero-slide-counter {
          position: absolute;
          top: 50%;
          right: 60px;
          transform: translateY(-50%);
          font-family: var(--font-display);
          font-size: 11px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
          z-index: 3;
        }
        @media (max-width: 600px) {
          .hero-content { padding: 0 24px 100px; }
          .hero-scroll-hint { right: 24px; }
          .hero-dots { left: 24px; }
          .hero-slide-counter { display: none; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MARQUEE
   ═══════════════════════════════════════════════════════ */
function Marquee() {
  const items = ['NEW ARRIVALS', 'SONE BRAND', 'STREETWEAR', 'MONGOLIA', 'LIMITED DROP', 'BEST SELLER', 'PRE-ORDER', '✦'];
  const rep = [...items, ...items, ...items, ...items];
  return (
    <div style={{ background: '#000', color: '#fff', overflow: 'hidden', padding: '11px 0', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
      <div className="marquee-track" style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 600, letterSpacing: '3px' }}>
        {rep.map((item, i) => (
          <span key={i} style={{ marginRight: '56px', opacity: item === '✦' ? 0.4 : 1 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BRAND MARQUEE
   ═══════════════════════════════════════════════════════ */
function BrandMarquee() {
  const brands = ['NIKE', 'ADIDAS', 'BALENCIAGA', 'DENIM TEARS', 'CHROME HEARTS', 'CORTEIZ', 'VANS', 'OAKLEY', 'SP5DER', 'PUMA', 'MERTRA', 'SUVENE'];
  const rep1 = [...brands, ...brands, ...brands];
  const rep2 = [...brands].reverse();
  const rep2x = [...rep2, ...rep2, ...rep2];
  return (
    <div style={{ background: '#000', overflow: 'hidden', padding: '10px 0', borderTop: '1px solid #222', position: 'relative', zIndex: 5 }}>
      {/* Row 1 - left */}
      <div style={{ overflow: 'hidden', padding: '30px 0', borderBottom: '1px solid #111' }}>
        <div className="brand-marquee-track" style={{
          display: 'inline-flex', whiteSpace: 'nowrap',
          fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 3vw, 24px)', fontWeight: 900,
          letterSpacing: '5px', color: '#fff', lineHeight: '1.2',
        }}>
          {rep1.map((brand, i) => (
            <span key={i} style={{ marginRight: '80px', opacity: 0.9 }}>
              {brand} <span style={{ opacity: 0.2, marginRight: '0' }}>✦</span>
            </span>
          ))}
        </div>
      </div>
      {/* Row 2 - right */}
      <div style={{ overflow: 'hidden', padding: '30px 0' }}>
        <div className="brand-marquee-track-rev" style={{
          display: 'inline-flex', whiteSpace: 'nowrap',
          fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 3vw, 24px)', fontWeight: 900,
          letterSpacing: '5px', color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.5)',
          lineHeight: '1.2',
        }}>
          {rep2x.map((brand, i) => (
            <span key={i} style={{ marginRight: '80px' }}>
              {brand} <span style={{ opacity: 0.3 }}>◆</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes brand-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        @keyframes brand-scroll-rev { 0% { transform: translateX(-33.333%); } 100% { transform: translateX(0); } }
        .brand-marquee-track { animation: brand-scroll 60s linear infinite; }
        .brand-marquee-track-rev { animation: brand-scroll-rev 60s linear infinite; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════ */
function SectionHeader({ title, href, num }: { title: string; href: string; num?: string }) {
  return (
    <div style={{ marginBottom: '40px' }} className="reveal">
      {num && <div className="section-num">{num}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #000', paddingTop: '20px', marginTop: num ? '-20px' : '0' }}>
        <h2 className="glitch" data-text={title} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '2px', color: '#000', textTransform: 'uppercase', lineHeight: 1 }}>
          {title}
        </h2>
        <Link href={href} style={{
          fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 700, letterSpacing: '3px',
          color: '#000', textDecoration: 'none', borderBottom: '1px solid #000', paddingBottom: '2px',
          display: 'flex', alignItems: 'center', gap: '8px', transition: 'gap 0.3s ease'
        }}>
          SHOP ALL →
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LATEST DROPS
   ═══════════════════════════════════════════════════════ */
function LatestDrops() {
  const { products } = useStore();
  const activeProducts = products.filter(p => p.tag !== 'ARCHIVED');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const autoScrollTimer = useRef<number | null>(null);
  const isInteracting = useRef(false);
  const interactionTimeout = useRef<any>(null);

  // Duplicate items 3 times to make the scroll loop seamless
  const displayProducts = [...activeProducts, ...activeProducts, ...activeProducts];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayProducts.length === 0) return;

    // Start auto scroll loop
    const step = () => {
      if (!isInteracting.current && el) {
        el.scrollLeft += 0.8; // scroll speed
        const setWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= setWidth * 2) {
          el.scrollLeft -= setWidth;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += setWidth;
        }
      }
      autoScrollTimer.current = requestAnimationFrame(step);
    };

    // Center scroll position initially
    if (el.scrollWidth > el.clientWidth) {
      el.scrollLeft = el.scrollWidth / 3;
    }

    autoScrollTimer.current = requestAnimationFrame(step);

    return () => {
      if (autoScrollTimer.current) cancelAnimationFrame(autoScrollTimer.current);
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    };
  }, [displayProducts.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDown.current = true;
    isInteracting.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDown.current = false;
    const el = scrollRef.current;
    if (el) el.style.cursor = 'grab';
    
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 2000);
  };

  const handleTouchStart = () => {
    isInteracting.current = true;
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
  };

  const handleTouchEnd = () => {
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 2000);
  };

  if (activeProducts.length === 0) return null;

  return (
    <section className="section-padding" style={{ maxWidth: '100vw', overflow: 'hidden', background: '#fff' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 60px)' }}>
        <SectionHeader title="LATEST DROPS" href="/products" num="01" />
      </div>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          scrollBehavior: 'auto',
          cursor: 'grab',
          userSelect: 'none',
          padding: '20px clamp(20px, 5vw, 60px)',
          WebkitOverflowScrolling: 'touch',
        }}
        className="latest-drops-carousel"
      >
        {displayProducts.map((p, i) => (
          <div key={`${p.id}-${i}`} style={{ flex: '0 0 280px', minWidth: '280px' }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <style>{`
        .latest-drops-carousel::-webkit-scrollbar { display: none; }
        .latest-drops-carousel { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STATS BAR
   ═══════════════════════════════════════════════════════ */
function StatsBar() {
  const stats = [
    { num: '100+', label: 'PRODUCTS' },
    { num: '12K+', label: 'CUSTOMERS' },
    { num: '100%', label: 'AUTHENTIC' },
    { num: '24H', label: 'DELIVERY' },
  ];
  return (
    <div className="stats-bar reveal">
      {stats.map((s, i) => (
        <div key={i} className="stat-item" style={{ transitionDelay: `${i * 80}ms` }}>
          <div className="stat-num">{s.num}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   OUTFIT INSPIRATION — Look-уудыг нүүрний хуудсанд харуулах
   ═══════════════════════════════════════════════════════ */
function OutfitInspiration() {
  const { settings, products } = useStore();
  const { addToCart } = useCart();
  const looks = (settings.looks || []).slice(0, 4);
  const [activeLook, setActiveLook] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [sizeModal, setSizeModal] = useState<{ productId: string; sizes: string[] } | null>(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (activeLook) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeLook]);

  const activeLookData = looks.find(l => l.id === activeLook);
  const activeLookProducts = activeLookData
    ? products.filter(p => activeLookData.productIds.includes(p.id))
    : [];

  const handleAddToCart = (product: any, size?: string) => {
    const sizeToUse = size || (product.sizes?.length > 0 ? product.sizes[0] : 'ONE SIZE');
    addToCart({
      id: product.id, name: product.name,
      price: product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price,
      image: product.images?.[0] || '', size: sizeToUse, qty: 1,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleCartClick = (product: any) => {
    if (product.sizes && product.sizes.length > 0) {
      setSizeModal({ productId: product.id, sizes: product.sizes });
      setSelectedSize('');
    } else handleAddToCart(product);
  };

  const confirmSize = () => {
    if (!selectedSize || !sizeModal) return;
    const product = products.find(p => p.id === sizeModal.productId);
    if (product) handleAddToCart(product, selectedSize);
    setSizeModal(null); setSelectedSize('');
  };

  if (looks.length === 0) return null;

  return (
    <section style={{ background: '#000', color: '#fff', padding: 'clamp(60px, 10vw, 100px) 0', position: 'relative', overflow: 'hidden' }}>
      {/* Ghost text background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(80px, 22vw, 300px)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,255,255,0.03)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
        letterSpacing: '-8px', lineHeight: 1,
      }}>LOOK</div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 60px)' }}>
        {/* Header */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #222', paddingTop: '24px', marginBottom: '48px', zIndex: 1, position: 'relative' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 700, letterSpacing: '5px', color: 'rgba(255,255,255,0.35)', marginBottom: '12px', textTransform: 'uppercase' }}>OUTFIT INSPIRATION</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase', lineHeight: 1 }}>LOOK BOOK</h2>
            <p style={{ fontFamily: 'var(--font-main)', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 400, letterSpacing: '0.5px', marginTop: '10px', maxWidth: '360px' }}>Ямар хослол өмсөхөө мэдэхгүй байна уу? Манай бэлдсэн look-уудаас санаа авна уу.</p>
          </div>
          <Link href="/looks" style={{ fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', borderBottom: '1px solid #333', paddingBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s', whiteSpace: 'nowrap' }}>
            БҮГДИЙГ ХАРАХ →
          </Link>
        </div>

        {/* Look grid — Instagram 3:4 ratio, up to 4 */}
        <div className="reveal look-home-grid" style={{ position: 'relative', zIndex: 1 }}>
          {looks.map((look, i) => {
            const lookProds = products.filter(p => look.productIds.includes(p.id));
            return (
              <div
                key={look.id}
                onClick={() => setActiveLook(look.id)}
                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', background: '#111', transitionDelay: `${i * 80}ms` }}
                className="look-home-card"
              >
                {/* Instagram 3:4 image */}
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                  <img
                    src={look.image || 'https://picsum.photos/seed/look' + i + '/600/800'}
                    alt={look.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                    className="look-home-img"
                  />
                  {/* Overlay on hover */}
                  <div className="look-home-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.35s ease' }}>
                    <div className="look-home-cta" style={{ background: '#fff', color: '#000', padding: '11px 22px', fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0, transform: 'scale(0.88)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      LOOK ХАРАХ
                    </div>
                  </div>
                  {/* Product count badge */}
                  {lookProds.length > 0 && (
                    <div className="look-home-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.72)', color: '#fff', fontSize: '8px', fontWeight: 800, padding: '3px 9px', fontFamily: 'var(--font-main)', letterSpacing: '1px', backdropFilter: 'blur(4px)' }}>
                      {lookProds.length} БАРАА
                    </div>
                  )}
                  {/* Number label */}
                  <div className="look-home-num" style={{ position: 'absolute', bottom: '10px', right: '12px', fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 40px)', color: 'rgba(255,255,255,0.12)', lineHeight: 1, pointerEvents: 'none', fontWeight: 900 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                {/* Info strip */}
                <div className="look-home-info" style={{ padding: '12px 14px', background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
                  <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{look.title}</p>
                  {look.description && <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{look.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LOOK DETAIL MODAL ── */}
      {activeLook && activeLookData && (
        <div className="look-modal-backdrop" onClick={() => setActiveLook(null)}>
          <div className="look-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveLook(null)} className="look-modal-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <div className="look-modal-inner">
              <div className="look-modal-img-col">
                <img src={activeLookData.image} alt={activeLookData.title} className="look-modal-img" />
                <div style={{ padding: '16px 20px 16px', background: '#000' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 4vw, 28px)', color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>{activeLookData.title}</h2>
                  {activeLookData.description && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-main)', lineHeight: 1.6 }}>{activeLookData.description}</p>}
                </div>
              </div>
              <div className="look-modal-products-col">
                <div className="look-modal-products-header">
                  <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '3px', color: '#999', fontFamily: 'var(--font-main)' }}>LOOK ДОТОРХ БАРААНУУД — {activeLookProducts.length} ш</span>
                </div>
                {activeLookProducts.length === 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#bbb', fontSize: '13px', fontFamily: 'var(--font-main)' }}>Холбоотой бараа байхгүй байна.</div>
                )}
                <div className="look-modal-products-list">
                  {activeLookProducts.map(p => {
                    const salePrice = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
                    const isAdded = addedId === p.id;
                    return (
                      <div key={p.id} className="look-product-row">
                        <Link href={`/product?id=${p.id}`} className="look-product-img-wrap">
                          <img src={p.images?.[0] || ''} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Link>
                        <div className="look-product-info">
                          <Link href={`/product?id=${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <p className="look-product-name">{p.name}</p>
                          </Link>
                          <div className="look-product-price-row">
                            <span style={{ fontWeight: 800, color: p.discount ? '#e00' : '#000', fontSize: '14px', fontFamily: 'var(--font-main)' }}>{salePrice.toLocaleString()}₮</span>
                            {p.discount && <span style={{ fontSize: '11px', color: '#bbb', textDecoration: 'line-through', fontFamily: 'var(--font-main)' }}>{p.price.toLocaleString()}₮</span>}
                          </div>
                          <div className="look-product-actions">
                            <button onClick={() => handleCartClick(p)} className={`look-cart-btn ${isAdded ? 'look-cart-btn-added' : ''}`}>
                              {isAdded ? '✓ НЭМЭГДЛЭЭ' : '+ САГСАНД'}
                            </button>
                            <Link href={`/product?id=${p.id}`} className="look-detail-btn">ДЭЛГЭРЭНГҮЙ</Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Size Modal */}
      {sizeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setSizeModal(null)}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '480px', padding: '28px 24px 40px', borderRadius: '16px 16px 0 0' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '3px', marginBottom: '20px', fontFamily: 'var(--font-main)', textTransform: 'uppercase' }}>РАЗМЕР СОНГОХ</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {sizeModal.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-main)', background: selectedSize === s ? '#000' : '#f5f5f5', color: selectedSize === s ? '#fff' : '#000', border: `1px solid ${selectedSize === s ? '#000' : '#ddd'}`, cursor: 'pointer', borderRadius: '4px', transition: 'all 0.15s' }}>{s}</button>
              ))}
            </div>
            <button onClick={confirmSize} style={{ width: '100%', padding: '15px', background: selectedSize ? '#000' : '#ddd', color: selectedSize ? '#fff' : '#999', border: 'none', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', cursor: selectedSize ? 'pointer' : 'default', fontFamily: 'var(--font-main)', textTransform: 'uppercase', borderRadius: '4px', transition: 'all 0.2s' }}>
              {selectedSize ? 'САГСАНД НЭМЭХ' : 'РАЗМЕР СОНГОНО УУ'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .look-home-card:hover .look-home-img { transform: scale(1.06); }
        .look-home-card:hover .look-home-overlay { background: rgba(0,0,0,0.38) !important; }
        .look-home-card:hover .look-home-cta { opacity: 1 !important; transform: scale(1) !important; }
        .look-home-card { transition: transform 0.3s ease; }
        .look-home-card:hover { transform: translateY(-4px); }

        /* Modal styles (reused from looks page) */
        .look-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 9999; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px 60px; }
        .look-modal { background: #fff; width: 100%; max-width: 900px; position: relative; display: flex; flex-direction: column; border-radius: 4px; animation: modalIn 0.3s cubic-bezier(0.16,1,0.3,1); flex-shrink: 0; }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .look-modal-close { position: absolute; top: 12px; right: 12px; z-index: 10; background: rgba(0,0,0,0.5); color: #fff; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .look-modal-close:hover { background: rgba(0,0,0,0.8); }
        .look-modal-inner { display: flex; flex-direction: row; }
        .look-modal-img-col { width: 45%; flex-shrink: 0; background: #000; display: flex; flex-direction: column; }
        .look-modal-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
        .look-modal-products-col { flex: 1; display: flex; flex-direction: column; }
        .look-modal-products-header { padding: 20px 20px 12px; border-bottom: 1px solid #f0f0f0; background: #fff; }
        .look-modal-products-list { display: flex; flex-direction: column; gap: 0; }
        .look-product-row { display: flex; gap: 14px; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; align-items: flex-start; transition: background 0.15s; }
        .look-product-row:hover { background: #fafafa; }
        .look-product-img-wrap { width: 72px; height: 88px; flex-shrink: 0; overflow: hidden; background: #f0f0f0; display: block; }
        .look-product-info { flex: 1; min-width: 0; }
        .look-product-name { font-family: var(--font-main); font-size: 12px; font-weight: 700; color: #000; margin-bottom: 4px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .look-product-price-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .look-product-actions { display: flex; gap: 6px; }
        .look-cart-btn { flex: 1; padding: 8px 6px; font-family: var(--font-main); font-size: 9px; font-weight: 800; letter-spacing: 1.5px; background: #000; color: #fff; border: none; cursor: pointer; transition: background 0.2s; text-transform: uppercase; }
        .look-cart-btn:hover { background: #222; }
        .look-cart-btn-added { background: #10b981 !important; }
        .look-detail-btn { flex: 1; padding: 8px 6px; font-family: var(--font-main); font-size: 9px; font-weight: 800; letter-spacing: 1.5px; background: #f0f0f0; color: #000; border: none; cursor: pointer; text-align: center; transition: background 0.2s; text-transform: uppercase; text-decoration: none; display: flex; align-items: center; justify-content: center; }
        .look-detail-btn:hover { background: #e0e0e0; }

        .look-home-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .look-home-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .look-home-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .look-home-info,
          .look-home-badge,
          .look-home-num {
            display: none !important;
          }
        }
        @media (max-width: 680px) {
          .look-modal-backdrop { padding: 0; align-items: flex-start; overflow: hidden; }
          .look-modal { height: 100dvh; max-height: 100dvh; border-radius: 0; max-width: 100%; overflow-y: auto; }
          .look-modal-inner { flex-direction: column; }
          .look-modal-img-col { width: 100%; }
          .look-modal-img { width: 100%; aspect-ratio: 3/4; max-height: 65vh; object-fit: cover; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGISTICS SECTION
   ═══════════════════════════════════════════════════════ */
function LogisticsSection() {
  const features = [
    { icon: '⚡', title: 'ХУРДАН ХҮРГЭЛТ', sub: '24 цагт хотод хүргэнэ', desc: 'Захиалга баталгаажсанаас хойш ажлын 1 өдрийн дотор таны гарт хүрнэ.' },
    { icon: '✓', title: '100% ЖИНХЭНЭ', sub: 'Аутентик баталгаа', desc: 'Бүх барааны жинхэнэ эсэхийг мэргэжлийн баг шалгасан. Хуурамч байвал бүрэн буцаана.' },
    { icon: '↩', title: 'БУЦААЛТ', sub: '7 хоногийн дотор', desc: 'Барааны доголдол байвал 7 хоногийн дотор буцааж, бүрэн мөнгийг буцаана.' },
    { icon: '🔒', title: 'АЮУЛГҮЙ ТӨЛБӨР', sub: 'SSL шифрлэлт', desc: 'QPay, SocialPay болон банкны карт ашиглан найдвартай төлбөр төлнө.' },
  ];
  return (
    <section style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(20px,4vw,48px)' }}>
        {/* Header */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #000', paddingTop: '20px', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '2px', textTransform: 'uppercase', lineHeight: 1 }}>WHY SONE</h2>
          <span style={{ fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: '#999' }}>03</span>
        </div>
        {/* Grid */}
        <div className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0',
          borderTop: '1px solid #eee', borderLeft: '1px solid #eee',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: 'clamp(28px,4vw,48px) clamp(20px,3vw,36px)',
              borderRight: '1px solid #eee', borderBottom: '1px solid #eee',
              transition: 'background 0.3s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '16px', letterSpacing: '2px' }}>{f.icon}</div>
              <div style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 800, letterSpacing: '3px', color: '#000', textTransform: 'uppercase', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 500, letterSpacing: '2px', color: '#999', marginBottom: '16px', textTransform: 'uppercase' }}>{f.sub}</div>
              <p style={{ fontFamily: 'var(--font-main)', fontSize: '11px', fontWeight: 300, color: '#666', lineHeight: 1.7, letterSpacing: '0.2px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CATEGORY GRID
   ═══════════════════════════════════════════════════════ */
function CategoryGrid() {
  const { settings } = useStore();
  const cats = settings.categories || [];

  return (
    <section className="section-padding" style={{ paddingTop: 0, maxWidth: '1440px', margin: '0 auto' }}>
      <SectionHeader title="CATEGORIES" href="/products" num="02" />
      <div className="cat-layout">
        {cats.map((cat, i) => (
          <CategoryTile key={cat.id} cat={cat} big={i === 0} />
        ))}
      </div>
    </section>
  );
}

function CategoryTile({ cat, big }: { cat: any; big?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={`/products?category=${cat.id}`} className={`cat-tile ${big ? 'cat-tile-big' : ''}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <img src={cat.image} alt={cat.name} className={`cat-img ${hov ? 'cat-img-hov' : ''}`} />
      <div style={{
        position: 'absolute', inset: 0,
        background: hov
          ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 50%)',
        transition: 'background 0.4s ease',
      }} />
      <div className="cat-label" style={{ fontSize: big ? '28px' : '16px', letterSpacing: big ? '4px' : '3px' }}>{cat.name}</div>
      <div style={{
        position: 'absolute', top: '20px', right: '20px',
        fontFamily: 'var(--font-main)', fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
        color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
        opacity: hov ? 1 : 0, transition: 'opacity 0.3s ease',
      }}>VIEW COLLECTION</div>
      <div style={{
        position: 'absolute', bottom: '20px', right: '20px',
        width: hov ? '40px' : '0px', height: '1px', background: '#fff',
        transition: 'width 0.4s var(--ease-out-expo)',
      }} />
      <style>{`
        .cat-tile { position: relative; display: block; overflow: hidden; height: 100%; }
        .cat-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease; filter: brightness(0.55) saturate(0.9); }
        .cat-img-hov { transform: scale(1.07); filter: brightness(0.45) saturate(1.1); }
        .cat-label { position: absolute; bottom: 24px; left: 24px; font-family: var(--font-display); color: #fff; letter-spacing: 3px; text-transform: uppercase; line-height: 1; }
      `}</style>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   SPECIAL DROPS — Босоо Instagram хэмжээтэй бараануудыг харуулах
   ═══════════════════════════════════════════════════════ */
function SpecialDrops() {
  const { settings, products } = useStore();
  const drops = settings.specialDrops || [];

  // Fallback to active products if drops are empty
  const dropsToShow = drops.length > 0 
    ? drops.slice(0, 4) 
    : products.filter(p => p.tag !== 'ARCHIVED').slice(0, 4).map(p => ({
        id: p.id,
        image: p.images?.[0] || '',
        productId: p.id
      }));

  if (dropsToShow.length === 0) return null;

  return (
    <section style={{ background: '#000', padding: 'clamp(60px, 10vw, 100px) 0' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 60px)' }}>
        {/* Header */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #222', paddingTop: '24px', marginBottom: '40px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 700, letterSpacing: '5px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', textTransform: 'uppercase' }}>ХЯЗГААРЛАГДМАЛ</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase', lineHeight: 1 }}>SPECIAL DROPS</h2>
          </div>
          <Link href="/products" style={{ fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', borderBottom: '1px solid #333', paddingBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s', whiteSpace: 'nowrap' }}>
            SHOP ALL →
          </Link>
        </div>

        {/* Drops grid — 4 cards, portrait (Instagram ratio) */}
        <div className="reveal special-drops-grid">
          {dropsToShow.map((drop: any, i) => {
            const product = products.find(p => p.id === drop.productId);
            if (!product) return null;
            const salePrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
            return (
              <Link
                key={drop.id}
                href={`/product?id=${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                className="drop-card"
              >
                {/* Portrait image */}
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
                  <img
                    src={drop.image || product.images?.[0] || ''}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                    className="drop-card-img"
                  />
                  {/* Hover overlay */}
                  <div className="drop-card-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.35s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="drop-card-cta" style={{ background: '#fff', color: '#000', padding: '11px 22px', fontFamily: 'var(--font-main)', fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0, transform: 'scale(0.88)', transition: 'all 0.3s ease' }}>
                      ДЭЛГЭРЭНГҮЙ →
                    </div>
                  </div>
                  {/* Tag badge */}
                  {product.tag && product.tag !== 'ARCHIVED' && (
                    <div className="special-drop-tag" style={{ position: 'absolute', top: '10px', left: '10px', background: product.tag === 'NEW' ? '#fff' : product.tag === 'SALE' ? '#e00' : 'rgba(0,0,0,0.72)', color: product.tag === 'NEW' ? '#000' : '#fff', fontSize: '8px', fontWeight: 800, padding: '3px 9px', fontFamily: 'var(--font-main)', letterSpacing: '1.5px' }}>
                      {product.tag}
                    </div>
                  )}
                  {/* Discount badge */}
                  {product.discount && (
                    <div className="special-drop-discount" style={{ position: 'absolute', top: '10px', right: '10px', background: '#e00', color: '#fff', fontSize: '9px', fontWeight: 900, padding: '3px 9px', fontFamily: 'var(--font-main)', letterSpacing: '1px' }}>
                      -{product.discount}%
                    </div>
                  )}
                  {/* Index number */}
                  <div className="special-drop-num" style={{ position: 'absolute', bottom: '10px', right: '12px', fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 40px)', color: 'rgba(255,255,255,0.1)', lineHeight: 1, pointerEvents: 'none', fontWeight: 900 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                {/* Info strip */}
                <div className="special-drop-info" style={{ padding: '12px 0 0', background: 'transparent' }}>
                  <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-main)', fontSize: '12px', fontWeight: 900, color: product.discount ? '#e00' : 'rgba(255,255,255,0.8)' }}>{salePrice.toLocaleString()}₮</span>
                    {product.discount && <span style={{ fontFamily: 'var(--font-main)', fontSize: '10px', color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{product.price.toLocaleString()}₮</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .special-drops-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .drop-card:hover .drop-card-img { transform: scale(1.06); }
        .drop-card:hover .drop-card-overlay { background: rgba(0,0,0,0.38) !important; }
        .drop-card:hover .drop-card-cta { opacity: 1 !important; transform: scale(1) !important; }
        .drop-card { transition: transform 0.3s ease; }
        .drop-card:hover { transform: translateY(-4px); }
        @media (max-width: 900px) {
          .special-drops-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .special-drops-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .special-drop-tag,
          .special-drop-discount,
          .special-drop-num,
          .special-drop-info {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .drop-card { min-width: 0; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   BOTTOM BANNERS
   ═══════════════════════════════════════════════════════ */
function BottomBanners() {
  const { settings } = useStore();
  const banners = settings.bottomBanners || [];

  return (
    <section className="bottom-banners-grid">
      {banners.map((ban, i) => (
        <div key={i} className="bottom-banner-item" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={ban.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#fff', padding: '20px' }}>
            {ban.sub && <p className="bottom-banner-sub">{ban.sub}</p>}
            {ban.title && <h2 className="bottom-banner-title">{ban.title}</h2>}
            <Link href="/products" className="btn-3d" style={{ background: '#fff', color: '#000', padding: '14px 32px', fontSize: '10px', fontWeight: 800, textDecoration: 'none' }}>DISCOVER</Link>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function HomePage() {
  useReveal();
  return (
    <div style={{ background: '#000' }}>
      <CustomCursor />
      <Hero />

      {/* Draggable marquee — between hero and content */}
      <div style={{ position: 'relative', zIndex: 11 }}>
        <DraggableMarquee
          items={['NEW DROP', 'SONE BRAND', 'STREETWEAR', 'MONGOLIA', 'LIMITED EDITION', 'AUTHENTIC', 'PRE-ORDER']}
          style={{
            background: '#000',
            borderTop: '1px solid #111',
            borderBottom: '1px solid #111',
            padding: '14px 0',
          }}
          itemStyle={{
            fontFamily: 'var(--font-main)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '4px',
            color: '#fff',
            textTransform: 'uppercase',
          }}
          separator="✦"
        />
      </div>

      <div style={{
        position: 'relative', zIndex: 10,
        background: '#000',
        borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 -30px 80px rgba(0,0,0,0.8)'
      }}>
        <StatsBar />
        <div style={{ background: '#fff', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', overflow: 'hidden' }}>
          <LatestDrops />
        </div>
        <OutfitInspiration />
        <BrandMarquee />
        <SpecialDrops />
        <div style={{ background: '#fff' }}>
          <BottomBanners />
          <ReviewsSection />
          <HomeFAQ />
        </div>
      </div>
    </div>
  );
}

function HomeFAQ() {
  const faqs = [
    {
      q: 'Pre-order яаж ажилладаг вэ?',
      a: 'Pre-order нь бараа нь ирэхийн өмнө урьдчилан захиалах боломж юм. Та захиалгаа өгч, урьдчилгаа төлбөр хийснээр бараа ирмэгц автоматаар хүргэлтэнд явна. Хугацаа ихэвчлэн 5-8 хоног байна.',
    },
    {
      q: 'Хүргэлт хэрхэн ажилладаг вэ?',
      a: 'Таны захиалсан бараа ирсэн тохиолдолд Улаанбаатар хот дотор 1–2 хоногт хүргэнэ. Орон нутагт тэр өдөр нь унаанд тавьж өгнө.',
    },
    {
      q: 'Буцааж болох уу?',
      a: 'Буцаалт байхгүй тул та сонголтоо зөв хийнэ үү',
    },
    {
      q: 'Ямар хэмжээний бараа байдаг вэ?',
      a: 'XS, S, M, L, XL, XXL хэмжээ байдаг. Хэмжээний хүснэгтийг барааны хуудаснаас харж болно.',
    },
    {
      q: 'Төлбөрийн ямар аргуудыг хүлээж авдаг вэ?',
      a: 'Банкны шилжүүлгээр төлбөр хийх боломжтой.',
    },
    {
      q: 'Захиалгаа хэрхэн хянах вэ?',
      a: 'Таны захиалга амжилттай болсон тохиолдолд та утасны дугаараараа манай сайтын Logistic хэсгээс хянах боломжтой. Энд таны захиалсан бараа ирсэн эсэхийг мэдэх боломжтой.',
    },
    {
      q: 'Сошиал медиад хаана олдох вэ?',
      a: 'Instagram, TikTok, Facebook дээр @SONEBRAND нэрээр олдоно.',
    },
  ];

  return (
    <section className="section-padding" style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 20px', background: '#fff' }}>
      <div style={{ marginBottom: '40px', borderTop: '1px solid #000', paddingTop: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '2px', color: '#000', textTransform: 'uppercase', lineHeight: 1 }}>
          FAQ
        </h2>
        <p style={{ fontFamily: 'var(--font-main)', fontSize: '11px', color: '#666', marginTop: '10px' }}>
          Түгээмэл асуулт хариулт — захиалга, хүргэлт, pre-order, буцаалт.
        </p>
      </div>
      <div>
        {faqs.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} index={i} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  return (
    <>
      <details className="faq-item" style={{ borderBottom: '1px solid #e8e8e8', padding: '20px 0' }}>
        <summary className="faq-summary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', listStyle: 'none', gap: '20px' }}>
          <span style={{ fontFamily: 'var(--font-main)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.3px', color: '#000' }}>
            {String(index + 1).padStart(2, '0')}. {q}
          </span>
          <span className="faq-icon">+</span>
        </summary>
        <p style={{ fontFamily: 'var(--font-main)', fontSize: '12.5px', color: '#555', lineHeight: 1.7, paddingTop: '12px', letterSpacing: '0.2px' }}>
          {a}
        </p>
      </details>
      <style>{`
        .faq-item { list-style: none; cursor: pointer; }
        .faq-item[open] .faq-icon { transform: rotate(45deg); }
        .faq-summary::-webkit-details-marker { display: none; }
        .faq-icon {
          font-size: 20px;
          color: #000;
          transition: transform 0.25s;
          flex-shrink: 0;
          font-weight: 300;
        }
      `}</style>
    </>
  );
}
