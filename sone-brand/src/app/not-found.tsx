import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px, 15vw, 180px)', color: '#111', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 44px)', letterSpacing: '3px', marginBottom: '16px', marginTop: '-20px' }}>
        PAGE NOT FOUND
      </h1>
      <p style={{ fontFamily: 'var(--font-main)', fontSize: '13px', color: '#666', letterSpacing: '1px', marginBottom: '36px' }}>
        Хайж байсан хуудас олдсонгүй.
      </p>
      <Link href="/" style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '14px 36px', fontFamily: 'var(--font-main)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px' }}>
        НҮҮР ХУУДАС РУУ БУЦАХ
      </Link>
    </div>
  );
}
