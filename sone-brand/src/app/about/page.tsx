import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Бидний Тухай — SONE BRAND',
  description: 'SONE BRAND-ийн тухай — манай хэн бэ, яагаад байгуулсан, юу зорьдог.',
};

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', minHeight: '80vh' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: '60vh', minHeight: '400px', background: '#000', overflow: 'hidden' }}>
        <img
          src="https://picsum.photos/seed/about01/1600/700"
          alt="About SONE BRAND"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 40px' }}>
          <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 600, letterSpacing: '4px', color: '#888', marginBottom: '16px' }}>
            МАНАЙ ТУХАЙ
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 80px)', color: '#fff', letterSpacing: '4px', lineHeight: 0.95 }}>
            SONE<br/>BRAND
          </h1>
        </div>
      </div>

      {/* Story */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#999', marginBottom: '16px' }}>
              OUR STORY
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '2px', color: '#000', marginBottom: '24px', lineHeight: 1.1 }}>
              МОНГОЛЫН<br/>STREETWEAR
            </h2>
            <p style={{ fontFamily: 'var(--font-main)', fontSize: '13px', color: '#555', lineHeight: 1.9, marginBottom: '16px' }}>
              SONE BRAND нь Монгол залуучуудын зориг, соёл, хотын амьдралаас урам авч төрсөн стритвэр брэнд. Бид хувцас зарахаас илүүтэй нэгдмэл дүр төрхийг бий болгохыг зорьдог.
            </p>
            <p style={{ fontFamily: 'var(--font-main)', fontSize: '13px', color: '#555', lineHeight: 1.9 }}>
              Хар цагаан эсрэгцэл, цэвэрхэн шугам, хүчтэй дүрслэл — манай загварын үндэс нь энгийн байдалд оршдог.
            </p>
          </div>
          <div style={{ background: '#111', aspectRatio: '4/5', overflow: 'hidden' }}>
            <img src="https://picsum.photos/seed/about02/600/750" alt="Brand" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: '#000', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#666', textAlign: 'center', marginBottom: '48px' }}>
            OUR VALUES
          </p>
          <div className="values-grid" style={{ display: 'grid', gap: '1px', background: '#1a1a1a' }}>
            {[
              { icon: '◼', title: 'AUTHENTICITY', desc: 'Жинхэнэ байдал — брэндийн мөн чанар. Загвар бүр бодит зорилготой.' },
              { icon: '◈', title: 'QUALITY', desc: 'Бүх бараа чанарын хатуу шалгуураар дайрагдана. Тоогоос чанарыг илүүд үзнэ.' },
              { icon: '◉', title: 'COMMUNITY', desc: 'SONE BRAND бол зүгээр нэг дэлгүүр биш — нэгдсэн хамт олон.' },
            ].map(v => (
              <div key={v.title} style={{ background: '#000', padding: '48px 36px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '20px', color: '#fff', opacity: 0.6 }}>{v.icon}</div>
                <div style={{ fontFamily: 'var(--font-main)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#fff', marginBottom: '14px' }}>{v.title}</div>
                <div style={{ fontFamily: 'var(--font-main)', fontSize: '12px', color: '#666', lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 600, letterSpacing: '3px', color: '#999', marginBottom: '16px' }}>
          PRE-ORDER ONLINE SHOP
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '3px', color: '#000', marginBottom: '32px' }}>
          COLLECTION ХАРАХ
        </h2>
        <a href="/products" style={{
          display: 'inline-block',
          background: '#000',
          color: '#fff',
          padding: '16px 48px',
          fontFamily: 'var(--font-main)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '3px',
          border: '1px solid #000',
          transition: 'background 0.2s, color 0.2s',
        }}>
          SHOP NOW
        </a>
      </div>
      <style>{`
        .values-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 768px) {
          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
