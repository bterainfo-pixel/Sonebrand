'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const helpLinks = [
    { label: 'FAQ',          href: '/faq' },
    { label: 'Logistic',     href: '/logistic' },
    { label: 'Pre-Order',    href: '/preorder' },
    { label: 'Хүргэлт',     href: '/logistic' },
  ];
  const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/sone_mongolia/' },
    { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=100076260361397' },
    { label: '+976 91812101', href: 'tel:+97691812101' },
  ];

  const handleSubscribe = async () => {
    console.log('SONE: VIP бүртгэл эхэллээ...', email);
    if (!email) {
      setMessage('И-мэйл хаягаа оруулна уу.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([{ email, phone }]);

      if (error) {
        console.error('SONE: Supabase error:', error);
        if (error.code === '23505') {
          setMessage('Энэ и-мэйл аль хэдийн бүртгэгдсэн байна.');
        } else {
          setMessage('Алдаа гарлаа: ' + error.message);
        }
        setStatus('error');
      } else {
        console.log('SONE: Supabase-д амжилттай хадгалагдлаа');
        setMessage('Амжилттай бүртгэгдлээ! Танд баярлалаа.');
        setStatus('success');
        
        // Welcome email илгээх
        fetch('/api/welcome-vip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }).then(() => console.log('SONE: Welcome email sent'))
          .catch(err => console.error('SONE: Welcome email failed', err));

        setEmail('');
        setPhone('');
      }
    } catch (err: any) {
      console.error('SONE: Network/System error:', err);
      setMessage('Сүлжээний алдаа гарлаа: ' + (err.message || 'unknown'));
      setStatus('error');
    }
  };

  return (
    <footer className="site-footer">

      {/* ── Main grid (VIP & Links) ── */}
      <div className="footer-main-grid">
        {/* VIP signup */}
        <div className="footer-vip">
          <div className="footer-section-title">VIP БОЛОХ</div>
          <p className="footer-vip-sub">
            PRE-ORDER БОЛОН ОНЦГОЙ САНАЛ, ШИНЭ ДУСАЛД ЭРТ ХАНДАХ
          </p>
          <div className="footer-input-group">
            <input 
              type="email" 
              placeholder="И-мэйл хаяг" 
              className="footer-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
            <input 
              type="text" 
              placeholder="Утас (Сонголттой)" 
              className="footer-input" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <button 
            className="footer-signup-btn btn-3d"
            onClick={handleSubscribe}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'ТҮР ХҮЛЭЭНЭ ҮҮ...' : status === 'success' ? 'БҮРТГЭГДЛЭЭ' : 'БҮРТГҮҮЛЭХ'}
          </button>
          {message && (
            <p style={{ 
              fontSize: '10px', 
              marginTop: '12px', 
              color: status === 'success' ? '#10b981' : '#ef4444',
              fontWeight: 700,
              letterSpacing: '1px'
            }}>
              {message.toUpperCase()}
            </p>
          )}
        </div>

        {/* Links Grid */}
        <div className="footer-links-wrapper">
          <div className="footer-link-col">
            <div className="footer-col-head">HELP</div>
            {helpLinks.map(l => (
              <Link key={l.label} href={l.href} className="footer-col-link">{l.label.toUpperCase()}</Link>
            ))}
          </div>
          <div className="footer-link-col">
            <div className="footer-col-head">SOCIAL</div>
            {socialLinks.map(l => (
              <Link key={l.label} href={l.href} className="footer-col-link">{l.label.toUpperCase()}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #000;
          color: #fff;
          font-family: var(--font-main);
          border-top: 1px solid #1a1a1a;
        }

        /* Main Grid (VIP & Links) */
        .footer-main-grid {
          max-width: 1440px;
          margin: 0 auto;
          padding: 60px 40px;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 80px;
        }

        /* VIP */
        .footer-section-title {
          font-family: var(--font-display);
          font-size: 32px;
          letter-spacing: 2px;
          margin-bottom: 12px;
          color: #fff;
        }
        .footer-vip-sub {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: #fff;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .footer-input-group {
          border: 1px solid #fff;
          margin-bottom: 16px;
        }
        .footer-input {
          display: block;
          width: 100%;
          background: transparent;
          border: none;
          color: #fff;
          padding: 14px 16px;
          font-family: var(--font-main);
          font-size: 11px;
          outline: none;
        }
        .footer-input:first-child {
          border-bottom: 1px solid #fff;
        }
        .footer-input::placeholder { color: #888; }
        .footer-signup-btn {
          width: auto;
          background: #222;
          color: #fff;
          padding: 14px 40px;
          font-family: var(--font-main);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        .footer-signup-btn:hover { background: #333; }

        /* Links */
        .footer-links-wrapper {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .footer-col-head {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #fff;
          margin-bottom: 24px;
        }
        .footer-col-link {
          display: block;
          font-size: 10px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          transition: color 0.2s;
        }
        .footer-col-link:hover { color: #999; }

        /* Mobile Layout Adjustments */
        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
            gap: 60px;
            padding: 40px 24px;
          }
          .footer-links-wrapper {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </footer>
  );
}
