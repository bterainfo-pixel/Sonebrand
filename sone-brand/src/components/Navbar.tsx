'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

const navLinks = [
  { label: 'НҮҮР', href: '/' },
  { label: 'БАРААНУУД', href: '/products' },
  { label: 'LOOK', href: '/looks' },
  { label: 'LOGISTIC', href: '/logistic' },
  { label: 'БИДНИЙ ТУХАЙ', href: '/about' },
];

// Pages where Back button should appear
const INNER_PAGES = ['/product', '/looks', '/cart', '/faq', '/about', '/logistic'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(0);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { settings } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const isInnerPage = INNER_PAGES.some(p => pathname?.startsWith(p));

  const handleLogoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    let newCount = 1;
    if (now - lastClick < 1000) {
      newCount = clickCount + 1;
    }
    setClickCount(newCount);
    setLastClick(now);

    if (newCount >= 5) {
      e.preventDefault();
      setShowPinModal(true);
      setClickCount(0);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '06210111') {
      sessionStorage.setItem('sone_admin_auth', 'yes');
      setShowPinModal(false);
      setPinInput('');
      router.push('/admin');
    } else {
      alert('БУРУУ КОД!');
      setPinInput('');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="header-container" style={{
        position: 'fixed',
        zIndex: 1000,
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          width: '100%',
          background: '#000',
          borderRadius: '0',
          pointerEvents: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {/* Announcement Bar */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            color: '#fff',
            padding: '5px 20px',
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'var(--font-main)',
          }}>
            <div className="nav-marquee-track" style={{ display: 'flex', width: 'max-content' }}>
              <div className="nav-marquee-content" style={{ display: 'flex', flexShrink: 0 }}>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
              </div>
              <div className="nav-marquee-content" style={{ display: 'flex', flexShrink: 0 }}>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
                <span style={{ marginRight: '40px' }}>{settings?.announcement || 'NEW DROP ONLINE NOW'}</span>
              </div>
            </div>
          </div>

          <nav style={{
            background: '#000',
            color: '#fff',
            padding: scrolled ? '10px 30px' : '12px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
          }}>
            
            {/* Left: Back button + Logo */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
              {isInnerPage && (
                <button
                  onClick={() => router.back()}
                  className="nav-back-btn"
                  aria-label="Буцах"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  <span className="nav-back-label">БУЦАХ</span>
                </button>
              )}
              <Link href="/" onClick={handleLogoClick} style={{ textDecoration: 'none' }} className="logo-container">
                <h1 className="logo" style={{ color: '#fff', fontSize: '24px', fontWeight: 900, letterSpacing: '4px', margin: 0, fontFamily: 'var(--font-display)' }}>SONE</h1>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="nav-desktop" style={{ display: 'flex', gap: '28px', flex: 2, justifyContent: 'center' }}>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="nav-link"
                  style={{ color: pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href)) ? '#fff' : '#888' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyContent: 'flex-end' }}>
              
              {/* Cart */}
              <Link href="/cart" className="nav-icon" style={{ color: '#fff', display: 'flex', alignItems: 'center', position: 'relative' }} aria-label="Сагс">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M9 10a3 3 0 0 1 6 0"/></svg>
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    background: '#fff',
                    color: '#000',
                    fontSize: '9px',
                    fontWeight: 900,
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>

            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        {navLinks.map((l) => {
          const isActive = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-bottom-nav-icon">
                {l.href === '/' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                )}
                {l.href === '/products' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M9 10a3 3 0 0 1 6 0"/></svg>
                )}
                {l.href === '/looks' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                )}
                {l.href === '/logistic' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                )}
                {l.href === '/about' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                )}
              </div>
              <span className="mobile-bottom-nav-label">{l.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Secret PIN Modal */}
      {showPinModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '3px', marginBottom: '32px', color: '#000', fontFamily: 'var(--font-main)' }}>АДМИН НЭВТРЭХ</h2>
            <form onSubmit={handlePinSubmit}>
              <input 
                type="password"
                autoFocus
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="КОД ОРУУЛНА УУ"
                style={{ width: '100%', border: '1px solid #000', padding: '16px', fontSize: '14px', textAlign: 'center', outline: 'none', marginBottom: '24px', letterSpacing: '4px', fontFamily: 'var(--font-main)' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowPinModal(false)} style={{ flex: 1, padding: '16px', background: '#eee', border: 'none', fontSize: '10px', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-main)' }}>ХААХ</button>
                <button type="submit" style={{ flex: 1, padding: '16px', background: '#000', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-main)' }}>ОРУУЛАХ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .header-container {
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
        }
        @keyframes nav-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .nav-marquee-track {
          display: flex;
          animation: nav-marquee 20s linear infinite;
        }
        .nav-link {
          font-family: var(--font-main);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #888;
          transition: color 0.2s;
          text-transform: uppercase;
          text-decoration: none;
        }
        .nav-link:hover { color: #fff; }
        .nav-back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          background: none;
          border: none;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          cursor: pointer;
          padding: 6px 0;
          flex-shrink: 0;
          font-family: var(--font-main);
          transition: opacity 0.2s, transform 0.2s;
          text-transform: uppercase;
        }
        .nav-back-btn:hover { opacity: 0.7; transform: translateX(-2px); }
        .nav-hamburger, .nav-icon {
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-hamburger:hover, .nav-icon:hover {
          transform: scale(1.15) rotate(3deg);
        }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: none !important; }
          .nav-back-label { display: none; }
        }
        .mobile-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .header-container {
            top: 0;
            left: 0;
            right: 0;
            padding-top: env(safe-area-inset-top);
          }
          .logo { font-size: 20px !important; letter-spacing: 2px !important; }
          .nav-hamburger {
            display: none !important;
          }
          body {
            padding-bottom: calc(74px + env(safe-area-inset-bottom)) !important;
          }
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            justify-content: space-around;
            align-items: center;
            padding-bottom: env(safe-area-inset-bottom);
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
          }
          .mobile-bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            height: 100%;
            color: #777;
            text-decoration: none;
            transition: color 0.15s ease;
          }
          .mobile-bottom-nav-item.active {
            color: #fff;
          }
          .mobile-bottom-nav-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2px;
          }
          .mobile-bottom-nav-label {
            font-family: var(--font-main);
            font-size: 7.5px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
        }
      `}</style>
    </>
  );
}
