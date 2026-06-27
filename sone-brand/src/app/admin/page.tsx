'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import { getTelegramUpdates } from '@/lib/telegram';

/* ═══════════════════════════════════════════════════════
   ADMIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

const ADMIN_PIN = '06210111'; // ТА ЭНД PIN-ИЙГ ЗАӨӨРЧИН ҮҮ!

export default function AdminPage() {
  const { 
    products, orders, settings, 
    addProduct, updateProduct, deleteProduct, 
    updateOrder, updateSettings, deleteReview, updateReview,
    addLook, updateLook, deleteLook,
    addSpecialDrop, updateSpecialDrop, deleteSpecialDrop
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'content' | 'archive' | 'reviews' | 'revenue' | 'looks' | 'drops'>('orders');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ── PIN Gate ──
  const [authed, setAuthed] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('sone_admin_auth') === 'yes') setAuthed(true);
  }, []);

  const handlePinSubmit = () => {
    if (locked) return;
    if (pinInput === ADMIN_PIN) {
      sessionStorage.setItem('sone_admin_auth', 'yes');
      setAuthed(true);
      setPinError(false);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setPinError(true);
      setPinInput('');
      if (next >= 5) {
        setLocked(true);
        setTimeout(() => { setLocked(false); setAttempts(0); setPinError(false); }, 60000);
      }
    }
  };

  if (!authed) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-main)' }}>
        <div style={{ width: '100%', maxWidth: '360px', padding: '20px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '6px', textAlign: 'center', marginBottom: '8px', color: '#fff' }}>SONE</h1>
          <p style={{ fontSize: '10px', color: '#444', textAlign: 'center', letterSpacing: '3px', marginBottom: '56px' }}>ADMIN PANEL</p>

          <div style={{ border: `1px solid ${pinError ? '#ef4444' : '#222'}`, padding: '40px 32px', borderRadius: '4px', transition: 'border-color 0.3s' }}>
            <p style={{ fontSize: '10px', color: '#666', letterSpacing: '2px', fontWeight: 800, marginBottom: '20px' }}>PIN КОД</p>
            <input
              id="admin-pin"
              type="password"
              value={pinInput}
              maxLength={20}
              disabled={locked}
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
              placeholder={locked ? 'ТАХИАЛТТАЙ (БУҮ...) ' : 'PIN оруулах'}
              style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${pinError ? '#ef4444' : '#333'}`, color: '#fff', padding: '18px 16px', fontSize: '18px', letterSpacing: '6px', outline: 'none', marginBottom: '16px', borderRadius: '4px', textAlign: 'center', boxSizing: 'border-box', fontFamily: 'monospace', transition: 'border-color 0.2s' }}
              autoFocus
            />
            {pinError && !locked && (
              <p style={{ fontSize: '11px', color: '#ef4444', textAlign: 'center', marginBottom: '12px', fontWeight: 700 }}>
                БУРУУ PIN! {attempts >= 3 && `(${5 - attempts} оролдлого үлдэсэн)`}
              </p>
            )}
            {locked && (
              <p style={{ fontSize: '11px', color: '#ef4444', textAlign: 'center', marginBottom: '12px', fontWeight: 700 }}>
                ТА 5 УДАА БУРУУ ОРуУЛСАН. 60 СЕКУНД ХҮЛЭЭРЭИЙ.
              </p>
            )}
            <button
              onClick={handlePinSubmit}
              disabled={locked || pinInput.length === 0}
              style={{ width: '100%', background: locked ? '#111' : '#fff', color: locked ? '#444' : '#000', border: 'none', padding: '18px', fontSize: '12px', fontWeight: 900, letterSpacing: '3px', cursor: locked ? 'not-allowed' : 'pointer', borderRadius: '4px', transition: 'all 0.2s' }}
            >
              {locked ? 'ХҮЛЭЭРЭИЙ...' : 'НЭВТРЭХ'}
            </button>
          </div>

          <p style={{ fontSize: '10px', color: '#222', textAlign: 'center', marginTop: '32px', letterSpacing: '1px' }}>SONE BRAND © 2025</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'var(--font-main)' }}>
      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 998 }} 
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ 
        width: '280px', 
        background: '#0a0a0a', 
        borderRight: '1px solid #1a1a1a', 
        position: 'fixed', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        zIndex: 999,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '40px 0'
      }}>
        <div style={{ padding: '0 32px 40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '4px', marginBottom: '8px' }}>SONE</h1>
          <p style={{ fontSize: '9px', color: '#444', fontWeight: 800, letterSpacing: '2px' }}>DASHBOARD V2.0</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'orders', label: 'ЗАХИАЛГУУД', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
            { id: 'archive', label: 'АРХИВ', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
            { id: 'revenue', label: 'ОРЛОГО', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'products', label: 'БАРААНУУД', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { id: 'looks', label: 'LOOK BOOK', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'drops', label: 'ОНЦГОЙ DROPS', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3' },
            { id: 'reviews', label: 'СЭТГЭГДЭЛ', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
            { id: 'content', label: 'КОНТЕНТ', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsEditing(null); setIsMobileMenuOpen(false); }}
              style={{
                padding: '16px 32px',
                textAlign: 'left',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? '#fff' : '#555',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s',
                borderLeft: activeTab === tab.id ? '3px solid #fff' : '3px solid transparent'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ position: 'absolute', bottom: '40px', left: '32px' }}>
          <Link href="/" style={{ fontSize: '10px', color: '#333', textDecoration: 'none', letterSpacing: '1px', fontWeight: 800 }}>← ГАРАХ</Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '280px', padding: '40px' }} className="admin-main">
        {/* Mobile Header */}
        <div className="mobile-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px' }}>☰</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '2px' }}>SONE ADMIN</h1>
          <div style={{ width: '24px' }}></div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === 'orders' && <OrdersTab orders={orders.filter(o => o.status !== 'delivered')} updateOrder={updateOrder} title="Идэвхтэй захиалгууд" />}
          {activeTab === 'archive' && <ArchiveTab orders={orders.filter(o => o.status === 'delivered')} updateOrder={updateOrder} />}
          {activeTab === 'revenue' && <RevenueTab orders={orders} />}
          {activeTab === 'products' && <ProductsTab 
            products={products} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            settings={settings}
          />}
          {activeTab === 'reviews' && <ReviewsTab settings={settings} updateReview={updateReview} deleteReview={deleteReview} />}
          {activeTab === 'content' && <ContentTab settings={settings} updateSettings={updateSettings} />}
          {activeTab === 'looks' && <LooksTab looks={settings.looks || []} products={products} addLook={addLook} updateLook={updateLook} deleteLook={deleteLook} />}
          {activeTab === 'drops' && <DropsTab drops={settings.specialDrops || []} products={products} addSpecialDrop={addSpecialDrop} updateSpecialDrop={updateSpecialDrop} deleteSpecialDrop={deleteSpecialDrop} />}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0 !important; padding: 24px !important; }
          .mobile-header { display: flex !important; }
        }
        .admin-card {
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          transition: border-color 0.2s;
        }
        .admin-card:hover { border-color: #333; }
        .input-dark {
          background: #111;
          border: 1px solid #222;
          color: #fff;
          padding: 12px 16px;
          font-size: 13px;
          outline: none;
          border-radius: 4px;
          transition: border-color 0.2s;
        }
        .input-dark:focus { border-color: #555; }
        .btn-primary {
          background: #fff;
          color: #000;
          border: none;
          padding: 14px 28px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
          border-radius: 4px;
        }
        .btn-3d {
          transition: transform 0.2s;
        }
        .btn-3d:active { transform: translateY(2px); }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   REVENUE TAB
   ═══════════════════════════════════════════════════════ */

function RevenueTab({ orders }: { orders: any[] }) {
  const [view, setView] = useState<'day' | 'month' | 'year'>('month');

  const MN_MONTHS = ['1-р сар','2-р сар','3-р сар','4-р сар','5-р сар','6-р сар','7-р сар','8-р сар','9-р сар','10-р сар','11-р сар','12-р сар'];

  // ── Aggregate helpers ──
  const aggregate = () => {
    const map: Record<string, { revenue: number; count: number }> = {};
    orders.forEach(o => {
      const d = new Date(o.date);
      if (isNaN(d.getTime())) return;
      let key = '';
      if (view === 'day') key = d.toLocaleDateString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      if (view === 'month') key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      if (view === 'year') key = String(d.getFullYear());
      if (!map[key]) map[key] = { revenue: 0, count: 0 };
      map[key].revenue += o.total || 0;
      map[key].count += 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({ key, ...val }));
  };

  const data = aggregate();
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  const formatKey = (key: string) => {
    if (view === 'month') {
      const [y, m] = key.split('-');
      return `${MN_MONTHS[parseInt(m)-1]} ${y}`;
    }
    return key;
  };

  const CHART_H = 180;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>ОРЛОГЫН ТАЙЛАН</h2>
          <p style={{ fontSize: '12px', color: '#555' }}>Бүх захиалгын нэгтгэсэн орлогын мэдээлэл</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['day','month','year'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '10px 20px', background: view === v ? '#fff' : '#111', color: view === v ? '#000' : '#888', border: '1px solid #333', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s' }}>
              {v === 'day' ? 'ӨДРӨӨР' : v === 'month' ? 'САРААР' : 'ЖИЛЭЭР'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
        {[
          { label: 'НИЙТ ОРЛОГО', value: totalRevenue.toLocaleString() + '₮', color: '#10b981' },
          { label: 'НИЙТ ЗАХИАЛГА', value: totalOrders.toLocaleString() + ' ш', color: '#f5a623' },
          { label: 'ДУНДАЖ ЗАХИАЛГА', value: avgOrder.toLocaleString() + '₮', color: '#60a5fa' },
          { label: 'ХҮРГЭГДСЭН', value: orders.filter(o => o.status === 'delivered').length + ' ш', color: '#a78bfa' },
        ].map(card => (
          <div key={card.label} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '4px', padding: '28px 24px' }}>
            <p style={{ fontSize: '10px', color: '#666', letterSpacing: '2px', marginBottom: '12px', fontWeight: 800 }}>{card.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 900, color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      {data.length > 0 ? (
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '4px', padding: '32px', marginBottom: '48px' }}>
          <p style={{ fontSize: '10px', color: '#666', letterSpacing: '2px', fontWeight: 800, marginBottom: '32px' }}>ОРЛОГЫН ГРАФИК ({view === 'day' ? 'ӨДРӨӨР' : view === 'month' ? 'САРААР' : 'ЖИЛЭЭР'})</p>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', minWidth: data.length * 60, height: CHART_H + 48, position: 'relative' }}>
              {/* Y-axis guide lines */}
              {[0,25,50,75,100].map(pct => (
                <div key={pct} style={{ position: 'absolute', bottom: 40 + CHART_H * pct / 100, left: 0, right: 0, borderTop: '1px solid #1a1a1a', zIndex: 0 }} />
              ))}
              {data.map((d, i) => {
                const barH = Math.max(4, Math.round((d.revenue / maxRevenue) * CHART_H));
                return (
                  <div key={d.key} style={{ flex: '1 0 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1, position: 'relative' }}>
                    <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 800, whiteSpace: 'nowrap' }}>
                      {(d.revenue / 1000).toFixed(0)}к
                    </span>
                    <div
                      title={`${formatKey(d.key)}: ${d.revenue.toLocaleString()}₮ (${d.count} захиалга)`}
                      style={{ width: '100%', maxWidth: '52px', height: barH, background: 'linear-gradient(180deg, #10b981, #059669)', borderRadius: '2px 2px 0 0', cursor: 'default', transition: 'opacity 0.2s', position: 'relative' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    />
                    <span style={{ fontSize: '8px', color: '#555', textAlign: 'center', lineHeight: 1.3, maxWidth: '52px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {formatKey(d.key)}
                    </span>
                    <span style={{ fontSize: '8px', color: '#444' }}>{d.count}ш</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px', color: '#555', background: '#0d0d0d', borderRadius: '4px', marginBottom: '48px' }}>
          Мэдээлэл байхгүй байна.
        </div>
      )}

      {/* Detailed Table */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #1a1a1a' }}>
          <p style={{ fontSize: '10px', color: '#666', letterSpacing: '2px', fontWeight: 800 }}>ДЭЛГЭРЭНГҮЙ ХҮСНЭГТ</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                {['ХУГАЦАА','ЗАХИАЛГА','НИЙТ ОРЛОГО','ДУНДАЖ','ХУВЬ'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '9px', color: '#555', fontWeight: 800, letterSpacing: '1px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d, i) => (
                <tr key={d.key} style={{ borderBottom: '1px solid #111', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>{formatKey(d.key)}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#f5a623', fontWeight: 700 }}>{d.count} ш</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 900, color: '#10b981' }}>{d.revenue.toLocaleString()}₮</td>
                  <td style={{ padding: '16px 20px', fontSize: '12px', color: '#aaa' }}>{d.count > 0 ? Math.round(d.revenue / d.count).toLocaleString() : 0}₮</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round((d.revenue / totalRevenue) * 100)}%`, height: '100%', background: '#10b981', borderRadius: '2px' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: '#555' }}>{Math.round((d.revenue / totalRevenue) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #333', background: '#111' }}>
                <td style={{ padding: '20px', fontSize: '12px', fontWeight: 900, letterSpacing: '1px' }}>НИЙТ ДҮН</td>
                <td style={{ padding: '20px', fontSize: '13px', fontWeight: 900, color: '#f5a623' }}>{totalOrders} ш</td>
                <td style={{ padding: '20px', fontSize: '16px', fontWeight: 900, color: '#10b981' }}>{totalRevenue.toLocaleString()}₮</td>
                <td style={{ padding: '20px', fontSize: '13px', color: '#aaa' }}>{avgOrder.toLocaleString()}₮</td>
                <td style={{ padding: '20px', fontSize: '12px', color: '#555' }}>100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   ARCHIVE TAB — Clean table view of delivered orders
   ═══════════════════════════════════════════════════════ */

const ARCHIVE_PAGE_SIZE = 30;

function ArchiveTab({ orders, updateOrder }: { orders: any[], updateOrder: any }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const formatDate = (raw: string) => {
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch { return raw; }
  };

  const filtered = orders.filter((o: any) => {
    return !search ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search) ||
      o.id?.toLowerCase().includes(search.toLowerCase());
  });

  // Sort newest first
  const sorted = [...filtered].sort((a: any, b: any) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (!isNaN(da) && !isNaN(db)) return db - da;
    return (b.id || '').localeCompare(a.id || '');
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / ARCHIVE_PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * ARCHIVE_PAGE_SIZE, page * ARCHIVE_PAGE_SIZE);

  const totalRevenue = sorted.reduce((s: number, o: any) => {
    const items = o.items?.reduce((acc: number, item: any) => acc + ((item.price || 0) * (item.qty || 1)), 0) || 0;
    const shipping = items >= 50000 ? 0 : 5000;
    return s + items + shipping;
  }, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>АРХИВ — ХҮРГЭГДСЭН</h2>
          <p style={{ fontSize: '12px', color: '#555' }}>
            Нийт <strong style={{ color: '#fff' }}>{orders.length}</strong> захиалга —{' '}
            Нийт орлого: <strong style={{ color: '#10b981' }}>{totalRevenue.toLocaleString()}₮</strong>
          </p>
        </div>
        <input
          type="text"
          placeholder="Нэр, утас, ID хайх..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px 16px', fontSize: '12px', outline: 'none', borderRadius: '4px', width: '220px', fontFamily: 'var(--font-main)' }}
        />
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'НИЙТ ЗАХИАЛГА', value: `${orders.length} ш`, color: '#f5a623' },
          { label: 'НИЙТ ОРЛОГО', value: `${totalRevenue.toLocaleString()}₮`, color: '#10b981' },
          { label: 'ДУНДАЖ ДҮН', value: orders.length > 0 ? `${Math.round(totalRevenue / orders.length).toLocaleString()}₮` : '0₮', color: '#60a5fa' },
        ].map(c => (
          <div key={c.label} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '4px', padding: '20px 16px' }}>
            <p style={{ fontSize: '9px', color: '#555', letterSpacing: '2px', fontWeight: 800, marginBottom: '8px' }}>{c.label}</p>
            <p style={{ fontSize: '20px', fontWeight: 900, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a', background: '#111' }}>
                {['#', 'ОГНОО', 'ХЭРЭГЛЭГЧ', 'УТАС', 'БАРААНЫ ТОО', 'НИЙТ ДҮН', 'ҮЙЛДЭЛ'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '9px', color: '#555', fontWeight: 800, letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#444', fontSize: '13px' }}>Хүргэгдсэн захиалга байхгүй байна.</td></tr>
              ) : paginated.map((o: any, i: number) => {
                const rowNum = (page - 1) * ARCHIVE_PAGE_SIZE + i + 1;
                const items = o.items?.reduce((acc: number, item: any) => acc + ((item.price || 0) * (item.qty || 1)), 0) || 0;
                const shipping = items >= 50000 ? 0 : 5000;
                const total = items + shipping;
                const itemCount = o.items?.reduce((acc: number, item: any) => acc + (item.qty || 1), 0) || 0;
                return (
                  <tr
                    key={o.id}
                    style={{
                      borderBottom: '1px solid #111',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#555', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      #{sorted.length - ((page - 1) * ARCHIVE_PAGE_SIZE + i)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>{formatDate(o.date)}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap' }}>{o.customerName}</td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>{o.phone}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f5a623', fontWeight: 700 }}>{itemCount} ш</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 900, color: '#10b981', whiteSpace: 'nowrap' }}>{total.toLocaleString()}₮</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button 
                        onClick={() => { if(confirm('Буцааж идэвхтэй захиалга руу сэргээх үү?')) updateOrder({...o, status: 'pending'}) }}
                        style={{ padding: '6px 12px', background: '#222', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        СЭРГЭЭХ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {paginated.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: '2px solid #222', background: '#111' }}>
                  <td colSpan={5} style={{ padding: '16px', fontSize: '11px', fontWeight: 900, letterSpacing: '1px', color: '#555' }}>
                    {sorted.length} захиалга харагдаж байна
                  </td>
                  <td colSpan={2} style={{ padding: '16px', fontSize: '15px', fontWeight: 900, color: '#10b981', whiteSpace: 'nowrap' }}>
                    {paginated.reduce((s: number, o: any) => {
                      const it = o.items?.reduce((acc: number, item: any) => acc + ((item.price || 0) * (item.qty || 1)), 0) || 0;
                      return s + it + (it >= 50000 ? 0 : 5000);
                    }, 0).toLocaleString()}₮
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px', flexWrap: 'wrap' }}>
          <button onClick={() => setPage(1)} disabled={page === 1} style={{ background: 'none', border: '1px solid #333', color: page === 1 ? '#444' : '#fff', padding: '8px 14px', fontSize: '11px', cursor: page === 1 ? 'default' : 'pointer', borderRadius: '4px' }}>«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'none', border: '1px solid #333', color: page === 1 ? '#444' : '#fff', padding: '8px 14px', fontSize: '11px', cursor: page === 1 ? 'default' : 'pointer', borderRadius: '4px' }}>‹ ӨМНӨХ</button>
          <span style={{ fontSize: '12px', color: '#666', padding: '0 16px' }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: 'none', border: '1px solid #333', color: page === totalPages ? '#444' : '#fff', padding: '8px 14px', fontSize: '11px', cursor: page === totalPages ? 'default' : 'pointer', borderRadius: '4px' }}>ДАРААХ ›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ background: 'none', border: '1px solid #333', color: page === totalPages ? '#444' : '#fff', padding: '8px 14px', fontSize: '11px', cursor: page === totalPages ? 'default' : 'pointer', borderRadius: '4px' }}>»</button>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, updateOrder }: { order: any, updateOrder: any }) {
  const [expanded, setExpanded] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const itemsTotal = order.items?.reduce((acc: number, item: any) => acc + ((item.price || 0) * (item.qty || 1)), 0) || 0;
  const isFreeShipping = itemsTotal >= 50000;
  const shippingFee = isFreeShipping ? 0 : 5000;
  const actualGrandTotal = itemsTotal + shippingFee;
  const paidAmount = order.total || 0;
  const isHalf = order.paymentType === 'half';
  const diffTime = new Date().getTime() - new Date(order.date).getTime();
  const daysPassed = isNaN(diffTime) ? 0 : Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const STATUS_MAP: any = {
    pending:          { label: 'ХҮЛЭЭГДЭЖ БАЙНА', color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
    transit:          { label: 'ТЭЭВЭРЛЭЛТ',       color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
    out_for_delivery: { label: '🚚 ХҮРГЭЛТЭНД',    color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    delivered:        { label: 'ХҮРГЭСЭН ✓',        color: '#555',    bg: 'transparent' },
  };
  const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const isUrgent = daysPassed >= 8 && order.status !== 'delivered';

  const formatDate = (raw: string) => {
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch { return raw; }
  };

  return (
    <div style={{
      marginBottom: '10px', borderRadius: '6px', overflow: 'hidden',
      border: `1px solid ${isUrgent ? '#ef444466' : expanded ? '#2a2a2a' : '#181818'}`,
      background: isUrgent ? 'rgba(239,68,68,0.03)' : '#0d0d0d',
      transition: 'border-color 0.2s',
    }}>
      {/* ── HEADER ── */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: '14px 18px', cursor: 'pointer', background: expanded ? '#141414' : 'transparent', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
      >
        {/* Status pill */}
        <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', background: st.bg, color: st.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {st.label}
        </span>

        {/* Name + phone */}
        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
          <span style={{ fontSize: '14px', fontWeight: 900 }}>{order.customerName}</span>
          <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>{order.phone}</span>
        </div>

        {/* Days + total */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {isUrgent
            ? <span style={{ fontSize: '11px', fontWeight: 900, color: '#ef4444' }}>⚠ {daysPassed}Х</span>
            : <span style={{ fontSize: '11px', color: '#444' }}>{daysPassed === 0 ? 'өнөөдөр' : `${daysPassed}х`}</span>
          }
          <span style={{ fontSize: '14px', fontWeight: 900, color: '#10b981' }}>{actualGrandTotal.toLocaleString()}₮</span>
          {isHalf && <span style={{ fontSize: '10px', color: '#f5a623', fontWeight: 700, background: 'rgba(245,166,35,0.1)', padding: '2px 8px', borderRadius: '4px' }}>50%</span>}
        </div>

        {/* Status select — stop propagation */}
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <select
            value={order.status}
            onChange={e => {
              const s = e.target.value;
              updateOrder(s === 'transit' ? { ...order, status: s, receiptImage: null } : { ...order, status: s });
            }}
            style={{ background: '#0a0a0a', color: st.color, border: `1px solid ${st.color}44`, padding: '7px 10px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', borderRadius: '4px', outline: 'none' }}
          >
            <option value="pending">ХҮЛЭЭГДЭЖ БАЙНА</option>
            <option value="transit">ТЭЭВЭРЛЭЛТ</option>
            <option value="out_for_delivery">ХҮРГЭЛТЭНД</option>
            <option value="delivered">ХҮРГЭСЭН</option>
          </select>
          <div style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1e1e', borderRadius: '50%', color: '#666', fontSize: '14px', cursor: 'pointer', flexShrink: 0 }}>
            {expanded ? '−' : '+'}
          </div>
        </div>
      </div>

      {/* ── EXPANDED ── */}
      {expanded && (
        <div style={{ borderTop: '1px solid #1e1e1e', padding: '16px 18px', background: '#090909', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Address + Receipt */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '6px', padding: '14px 16px' }}>
              <p style={{ fontSize: '9px', color: '#444', fontWeight: 800, letterSpacing: '2px', marginBottom: '10px' }}>ХҮРГЭЛТИЙН МЭДЭЭЛЭЛ</p>
              <p style={{ fontSize: '14px', fontWeight: 900, marginBottom: '4px' }}>{order.customerName}</p>
              <p style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 700, marginBottom: '8px' }}>📞 {order.phone}</p>
              <p style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.6, wordBreak: 'break-word' }}>📍 {order.address}</p>
            </div>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '6px', padding: '14px 16px' }}>
              <p style={{ fontSize: '9px', color: '#444', fontWeight: 800, letterSpacing: '2px', marginBottom: '10px' }}>ТӨЛБӨРИЙН БАРИМТ</p>
              {order.receiptImage ? (
                <div onClick={() => setZoomImg(order.receiptImage)} style={{ width: '90px', aspectRatio: '9/16', overflow: 'hidden', cursor: 'zoom-in', borderRadius: '4px', border: '1px solid #2a2a2a', position: 'relative' }}>
                  <img src={order.receiptImage} alt="Receipt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔍</div>
                </div>
              ) : (
                <div style={{ padding: '14px', background: '#160a0a', border: '1px dashed #ef444466', borderRadius: '4px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800 }}>БАРИМТ ОРСОНГҮЙ</p>
                </div>
              )}
              <p style={{ fontSize: '11px', marginTop: '10px', color: isHalf ? '#f5a623' : '#10b981', fontWeight: 800 }}>
                {isHalf ? `50% — ${paidAmount.toLocaleString()}₮` : `100% — ${paidAmount.toLocaleString()}₮`}
              </p>
            </div>
          </div>
          {/* Items */}
          <div>
            <p style={{ fontSize: '9px', color: '#444', fontWeight: 800, letterSpacing: '2px', marginBottom: '10px' }}>ЗАХИАЛСАН БАРАА ({order.items?.length || 0})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {order.items?.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#111', padding: '10px 12px', borderRadius: '6px', border: '1px solid #1a1a1a' }}>
                  <div onClick={() => setZoomImg(item.image)} style={{ width: '44px', height: '58px', background: '#000', cursor: 'zoom-in', overflow: 'hidden', borderRadius: '4px', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 800, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {item.size && <span style={{ fontSize: '11px', background: '#1e1e1e', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{item.size.toUpperCase()}</span>}
                      {item.color && <span style={{ fontSize: '11px', color: '#666' }}>{item.color.toUpperCase()}</span>}
                      <span style={{ fontSize: '11px', color: '#555' }}>×{item.qty}</span>
                      <span style={{ fontSize: '13px', fontWeight: 900, marginLeft: 'auto' }}>{(item.price * item.qty).toLocaleString()}₮</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '8px', background: '#111', borderRadius: '6px', border: '1px solid #1a1a1a', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#555' }}>Бараа: <b style={{ color: '#aaa' }}>{itemsTotal.toLocaleString()}₮</b></span>
                <span style={{ fontSize: '12px', color: isFreeShipping ? '#10b981' : '#555' }}>Хүргэлт: <b style={{ color: isFreeShipping ? '#10b981' : '#aaa' }}>{isFreeShipping ? 'ҮНЭГҮЙ' : `${shippingFee.toLocaleString()}₮`}</b></span>
              </div>
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#10b981' }}>НИЙТ: {actualGrandTotal.toLocaleString()}₮</span>
            </div>
          </div>
        </div>
      )}
      {zoomImg && (
        <div onClick={() => setZoomImg(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', cursor: 'zoom-out' }}>
          <img src={zoomImg} alt="Zoom" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          <button onClick={() => setZoomImg(null)} style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: '#fff', fontSize: '40px', cursor: 'pointer' }}>×</button>
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 20;

function OrdersTab({ orders, updateOrder, title }: any) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = orders.filter((o: any) => {
    const matchSearch = !search || 
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search) ||
      o.id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Sort newest first (by date desc, fallback by id desc)
  const sorted = [...filtered].sort((a: any, b: any) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (!isNaN(da) && !isNaN(db)) return db - da;
    // Fallback: compare id strings
    return (b.id || '').localeCompare(a.id || '');
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filter changes
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleFilter = (val: string) => { setStatusFilter(val); setPage(1); };

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>{title}</h2>
          <p style={{ fontSize: '12px', color: '#555' }}>Нийт <strong style={{ color: '#fff' }}>{orders.length}</strong> захиалга — харагдаж буй: <strong style={{ color: '#fff' }}>{filtered.length}</strong></p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Нэр, утас, ID хайх..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px 16px', fontSize: '12px', outline: 'none', borderRadius: '4px', width: '220px', fontFamily: 'var(--font-main)' }}
          />
          <select
            value={statusFilter}
            onChange={e => handleFilter(e.target.value)}
            style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px 14px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}
          >
            <option value="all">БҮХ ТӨЛӨВ</option>
            <option value="pending">ХҮЛЭЭГДЭЖ БАЙНА</option>
            <option value="transit">ТЭЭВЭРЛЭЛТ</option>
            <option value="out_for_delivery">ХҮРГЭЛТЭНД</option>
            <option value="delivered">ХҮРГЭСЭН</option>
          </select>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#555', fontSize: '14px' }}>
          Захиалга олдсонгүй.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {paginated.map((order: any) => (
            <OrderCard key={order.id} order={order} updateOrder={updateOrder} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            style={{ background: 'none', border: '1px solid #333', color: page === 1 ? '#444' : '#fff', padding: '8px 14px', fontSize: '11px', cursor: page === 1 ? 'default' : 'pointer', borderRadius: '4px' }}
          >«</button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ background: 'none', border: '1px solid #333', color: page === 1 ? '#444' : '#fff', padding: '8px 14px', fontSize: '11px', cursor: page === 1 ? 'default' : 'pointer', borderRadius: '4px' }}
          >‹ ӨМНӨХ</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce((acc: (number | string)[], p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) => p === '...' ? (
              <span key={`dots-${idx}`} style={{ color: '#555', padding: '0 4px' }}>…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                style={{ background: page === p ? '#fff' : 'none', border: '1px solid #333', color: page === p ? '#000' : '#fff', padding: '8px 14px', fontSize: '11px', fontWeight: page === p ? 900 : 400, cursor: 'pointer', borderRadius: '4px', minWidth: '40px' }}
              >{p}</button>
            ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ background: 'none', border: '1px solid #333', color: page === totalPages ? '#444' : '#fff', padding: '8px 14px', fontSize: '11px', cursor: page === totalPages ? 'default' : 'pointer', borderRadius: '4px' }}
          >ДАРААХ ›</button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            style={{ background: 'none', border: '1px solid #333', color: page === totalPages ? '#444' : '#fff', padding: '8px 14px', fontSize: '11px', cursor: page === totalPages ? 'default' : 'pointer', borderRadius: '4px' }}
          >»</button>
        </div>
      )}
    </div>
  );
}


function ProductsTab({ products, isEditing, setIsEditing, addProduct, updateProduct, deleteProduct, settings }: any) {
  const [formData, setFormData] = useState<any>(null);
  const [showArchived, setShowArchived] = useState(false);

  const SIZE_OPTIONS = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL',
    '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'
  ];

  const PRODUCT_CATEGORIES = settings.productCategories || ['HOODIE', 'SET', 'JACKET', 'PANTS', 'ЦҮНХ', 'БУСАД'];

  useEffect(() => {
    if (isEditing === 'new') {
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        name: '', price: 0, discount: 0,
        images: [''], description: '', category: PRODUCT_CATEGORIES[0], sizes: [], tag: ''
      });
    } else if (isEditing) {
      const p = products.find((x: any) => x.id === isEditing);
      if (p) setFormData({...p, sizes: p.sizes || []});
    }
  }, [isEditing, products]);

  const toggleSize = (size: string) => {
    const current = formData.sizes || [];
    if (current.includes(size)) {
      setFormData({ ...formData, sizes: current.filter((s: string) => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...current, size] });
    }
  };

  const salePrice = formData ? Math.round(formData.price * (1 - (formData.discount || 0) / 100)) : 0;

  if (isEditing) {
    return (
      <div style={{ maxWidth: '900px' }}>
        <button onClick={() => setIsEditing(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', marginBottom: '24px' }}>← БУЦАХ</button>
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          const finalData = { 
            ...formData, 
            images: typeof formData.images === 'string' ? (formData.images as string).split('\n').filter(x => x.trim()) : formData.images
          };
          isEditing === 'new' ? addProduct(finalData) : updateProduct(finalData); 
          setIsEditing(null); 
        }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '8px', display: 'block' }}>БАРААНЫ НЭР</label>
                <input className="input-dark" style={{ width: '100%' }} value={formData?.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Нэр" required />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '8px', display: 'block' }}>АНГИЛАЛ</label>
                <select className="input-dark" style={{ width: '100%' }} value={formData?.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {PRODUCT_CATEGORIES.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', background: '#0a0a0a', padding: '20px', borderRadius: '4px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '8px', display: 'block' }}>ҮНДСЭН ҮНЭ (₮)</label>
                <input className="input-dark" style={{ width: '100%' }} type="number" value={formData?.price || 0} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} required />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '8px', display: 'block' }}>ХЯМДРАЛ (%)</label>
                <input className="input-dark" style={{ width: '100%' }} type="number" value={formData?.discount || 0} onChange={e => setFormData({...formData, discount: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '8px', display: 'block' }}>ХЯМДАРСАН ҮНЭ</label>
                <div style={{ padding: '12px', fontSize: '16px', fontWeight: 900, color: '#0f0' }}>{salePrice.toLocaleString()}₮</div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '12px', display: 'block' }}>БОЛОМЖИТ РАЗМЕРУУД (ДАРЖ СОНГО)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px' }}>
                {SIZE_OPTIONS.map(size => (
                  <button
                    key={size} type="button"
                    onClick={() => toggleSize(size)}
                    style={{
                      padding: '10px',
                      background: formData?.sizes?.includes(size) ? '#fff' : '#111',
                      color: formData?.sizes?.includes(size) ? '#000' : '#444',
                      border: formData?.sizes?.includes(size) ? '1px solid #fff' : '1px solid #222',
                      fontSize: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '8px', display: 'block' }}>ЗУРГИЙН URL (МӨР БҮРТ НЭГ)</label>
              <textarea 
                className="input-dark" style={{ width: '100%', minHeight: '80px' }} 
                value={Array.isArray(formData?.images) ? formData.images.join('\n') : (formData?.images || '')} 
                onChange={e => setFormData({...formData, images: e.target.value})} 
              />
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '8px', display: 'block' }}>ТАЙЛБАР</label>
              <textarea className="input-dark" style={{ width: '100%', minHeight: '80px' }} value={formData?.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#444', marginBottom: '8px', display: 'block' }}>TAG (Жишээ: NEW)</label>
              <input className="input-dark" style={{ width: '100%' }} value={formData?.tag || ''} onChange={e => setFormData({...formData, tag: e.target.value})} />
            </div>

          </div>
          <button type="submit" className="btn-primary" style={{ padding: '20px', fontSize: '13px' }}>ХАДГАЛАХ</button>
        </form>
      </div>
    );
  }

  const filteredProducts = products.filter((p: any) => showArchived ? p.tag === 'ARCHIVED' : p.tag !== 'ARCHIVED');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Бараанууд</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setShowArchived(false)} style={{ background: 'none', border: 'none', color: !showArchived ? '#fff' : '#666', fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0 }}>ИДЭВХТЭЙ</button>
            <span style={{ color: '#333' }}>|</span>
            <button onClick={() => setShowArchived(true)} style={{ background: 'none', border: 'none', color: showArchived ? '#fff' : '#666', fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0 }}>АРХИВ</button>
          </div>
        </div>
        <button onClick={() => setIsEditing('new')} className="btn-primary">+ ШИНЭ БАРАА</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
        {filteredProducts.map((p: any) => (
          <div key={p.id} className="admin-card" style={{ overflow: 'hidden', opacity: showArchived ? 0.7 : 1 }}>
            <div style={{ position: 'relative' }}>
              <img src={p.images?.[0]} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              {(p.discount > 0) && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#f00', color: '#fff', padding: '4px 8px', fontSize: '10px', fontWeight: 900 }}>
                  {`-${p.discount}%`}
                </div>
              )}
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: 800, marginBottom: '4px' }}>{p.name}</p>
              <p style={{ fontSize: '11px', color: '#555' }}>{p.price.toLocaleString()}₮ {p.discount > 0 && `→ ${(p.price * (1 - p.discount/100)).toLocaleString()}₮`}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                <button onClick={() => setIsEditing(p.id)} style={{ flex: 1, padding: '10px', background: '#111', color: '#fff', border: '1px solid #333', fontSize: '10px', fontWeight: 700 }}>ЗАСАХ</button>
                <button 
                  onClick={() => { if(confirm(showArchived ? 'Сэргээх үү?' : 'Архивлах уу?')) updateProduct({...p, tag: showArchived ? '' : 'ARCHIVED'}) }} 
                  style={{ flex: 1, padding: '10px', background: '#222', color: '#fff', border: '1px solid #333', fontSize: '10px', fontWeight: 700 }}
                >
                  {showArchived ? 'СЭРГЭЭХ' : 'АРХИВЛАХ'}
                </button>
                <button onClick={() => { if(confirm('Бүр мөсөн устгах уу?')) deleteProduct(p.id)}} style={{ padding: '10px', color: '#f55', background: 'transparent', border: 'none', width: '100%', fontSize: '10px', fontWeight: 700 }}>УСТГАХ</button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#666' }}>
            {showArchived ? 'Архивлагдсан бараа байхгүй байна.' : 'Бараа байхгүй байна.'}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewsTab({ settings, updateReview, deleteReview }: any) {
  const reviews = settings.reviews || [];

  const handleStatusChange = (id: string, newStatus: string) => {
    const r = reviews.find((x: any) => x.id === id);
    if (r) {
      updateReview({ ...r, status: newStatus });
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '40px' }}>Сэтгэгдэлүүд</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map((rev: any) => (
          <div key={rev.id} className="admin-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>{rev.name} ({rev.rating}★)</h3>
                <p style={{ fontSize: '13px', color: '#aaa', marginTop: '8px' }}>{rev.comment}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select value={rev.status} onChange={(e) => handleStatusChange(rev.id, e.target.value)} style={{ background: '#111', color: '#fff', padding: '8px' }}>
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="approved">Нийтлэх</option>
                  <option value="hidden">Нуух</option>
                </select>
                <button onClick={() => { if(confirm('Устгах уу?')) deleteReview(rev.id)}} style={{ color: '#f55' }}>Устгах</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentTab({ settings, updateSettings }: any) {
  const [data, setData] = useState({ ...settings });
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    setData({ ...settings });
  }, [settings]);

  const checkUpdates = async () => {
    const res = await getTelegramUpdates();
    if (res?.result) setUpdates(res.result);
  };

  const handleHeroChange = (index: number, field: string, value: string) => {
    const newSlides = [...data.heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setData({ ...data, heroSlides: newSlides });
  };

  const handleBottomChange = (index: number, field: string, value: string) => {
    const newBanners = [...data.bottomBanners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setData({ ...data, bottomBanners: newBanners });
  };

  const handleCategoryChange = (index: number, field: string, value: string) => {
    const newCats = [...(data.categories || [])];
    newCats[index] = { ...newCats[index], [field]: value };
    setData({ ...data, categories: newCats });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const max_size = 1600;
        if (width > height && width > max_size) { height *= max_size / width; width = max_size; } 
        else if (height > max_size) { width *= max_size / height; height = max_size; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: '1000px', paddingBottom: '100px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '40px', letterSpacing: '2px' }}>КОНТЕНТ УДИРДАХ</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Announcement */}
        <section className="admin-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, marginBottom: '20px', letterSpacing: '1.5px', color: '#555' }}>МЭДЭЭЛЛИЙН ТЕКСТ (TOP BAR)</h3>
          <input 
            className="input-dark" 
            value={data.announcement} 
            onChange={e => setData({...data, announcement: e.target.value})} 
            style={{ width: '100%' }} 
          />
        </section>

        {/* Hero Slides */}
        <section className="admin-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', color: '#555', margin: 0 }}>НҮҮР ХУУДАСНЫ СЛАЙДЕР / ХАМГИЙН ЭХНИЙ БАННЕР</h3>
            <button onClick={() => setData({...data, heroSlides: [...(data.heroSlides || []), {bg:'', eye:'', title:'', sub:'', cta:'SHOP NOW', href:'/products'}]})} style={{ color: '#fff', fontSize: '10px', fontWeight: 800, textDecoration: 'underline' }}>+ НЭМЭХ</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {data.heroSlides?.map((slide: any, i: number) => (
              <div key={i} style={{ padding: '24px', background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#333', margin: 0 }}>СЛАЙД #{i+1}</p>
                  <button onClick={() => {
                    const newArr = [...data.heroSlides];
                    newArr.splice(i, 1);
                    const newData = {...data, heroSlides: newArr};
                    setData(newData);
                    updateSettings(newData);
                  }} style={{ color: '#ff3333', fontSize: '9px', fontWeight: 800 }}>УСТГАХ</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '9px', color: '#666' }}>БАННЕР ЗУРАГ (URL БУЮУ ФАЙЛ)</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input className="input-dark" value={slide.bg} onChange={e => handleHeroChange(i, 'bg', e.target.value)} style={{ flex: 1, minWidth: 0 }} placeholder="URL" />
                      <label style={{ background: '#333', color: '#fff', padding: '0 16px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', borderRadius: '4px' }}>
                        ФАЙЛ СОНГОХ
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, url => handleHeroChange(i, 'bg', url))} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: '#666' }}>НҮДНИЙ ДЭЭРХ ТЕКСТ</label>
                    <input className="input-dark" value={slide.eye} onChange={e => handleHeroChange(i, 'eye', e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: '#666' }}>ГАРЧИГ</label>
                    <textarea className="input-dark" value={slide.title} onChange={e => handleHeroChange(i, 'title', e.target.value)} style={{ width: '100%', marginTop: '4px', height: '60px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: '#666' }}>ДЭД ТЕКСТ</label>
                    <input className="input-dark" value={slide.sub} onChange={e => handleHeroChange(i, 'sub', e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="admin-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', color: '#555', margin: 0 }}>АНГИЛЛЫН ЗУРАГ (CATEGORIES)</h3>
            <button onClick={() => setData({...data, categories: [...(data.categories || []), {id: `cat-${Date.now()}`, name: '', image: ''}]})} style={{ color: '#fff', fontSize: '10px', fontWeight: 800, textDecoration: 'underline' }}>+ НЭМЭХ</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {data.categories?.map((cat: any, i: number) => (
              <div key={i} style={{ padding: '20px', background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#333', margin: 0 }}>{cat.name || `АНГИЛАЛ #${i+1}`}</p>
                  <button onClick={() => {
                    const newArr = [...data.categories];
                    newArr.splice(i, 1);
                    const newData = {...data, categories: newArr};
                    setData(newData);
                    updateSettings(newData);
                  }} style={{ color: '#ff3333', fontSize: '9px', fontWeight: 800 }}>УСТГАХ</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '9px', color: '#666' }}>ЗУРАГ (URL БУЮУ ФАЙЛ)</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input className="input-dark" value={cat.image} onChange={e => handleCategoryChange(i, 'image', e.target.value)} style={{ flex: 1, minWidth: 0 }} placeholder="URL" />
                      <label style={{ background: '#333', color: '#fff', padding: '0 16px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', borderRadius: '4px' }}>
                        ФАЙЛ
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, url => handleCategoryChange(i, 'image', url))} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: '#666' }}>НЭР</label>
                    <input className="input-dark" value={cat.name} onChange={e => handleCategoryChange(i, 'name', e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="admin-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, marginBottom: '24px', letterSpacing: '1.5px', color: '#555' }}>УРАМШУУЛЛЫН БАННЕР (PROMO BANNER)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '9px', color: '#666' }}>БАННЕР ЗУРАГ (URL БУЮУ ФАЙЛ)</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <input className="input-dark" value={data.promoBanner?.image} onChange={e => setData({...data, promoBanner: {...data.promoBanner, image: e.target.value}})} style={{ flex: 1, minWidth: 0 }} placeholder="URL" />
                <label style={{ background: '#333', color: '#fff', padding: '0 16px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', borderRadius: '4px' }}>
                  ФАЙЛ СОНГОХ
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, url => setData({...data, promoBanner: {...data.promoBanner, image: url}}))} />
                </label>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '9px', color: '#666' }}>ГАРЧИГ</label>
              <input className="input-dark" value={data.promoBanner?.title} onChange={e => setData({...data, promoBanner: {...data.promoBanner, title: e.target.value}})} style={{ width: '100%', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '9px', color: '#666' }}>ДЭД ТЕКСТ</label>
              <input className="input-dark" value={data.promoBanner?.sub} onChange={e => setData({...data, promoBanner: {...data.promoBanner, sub: e.target.value}})} style={{ width: '100%', marginTop: '4px' }} />
            </div>
          </div>
        </section>

        {/* Bottom Banners */}
        <section className="admin-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', color: '#555', margin: 0 }}>ДОӨД БАННЕРУУД (BOTTOM BANNERS)</h3>
            <button onClick={() => setData({...data, bottomBanners: [...(data.bottomBanners || []), {image: '', title: '', sub: ''}]})} style={{ color: '#fff', fontSize: '10px', fontWeight: 800, textDecoration: 'underline' }}>+ НЭМЭХ</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {data.bottomBanners?.map((banner: any, i: number) => (
              <div key={i} style={{ padding: '20px', background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#333', margin: 0 }}>БАННЕР #{i+1}</p>
                  <button onClick={() => {
                    const newArr = [...data.bottomBanners];
                    newArr.splice(i, 1);
                    const newData = {...data, bottomBanners: newArr};
                    setData(newData);
                    updateSettings(newData);
                  }} style={{ color: '#ff3333', fontSize: '9px', fontWeight: 800 }}>УСТГАХ</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '9px', color: '#666' }}>ЗУРАГ (URL БУЮУ ФАЙЛ)</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input className="input-dark" value={banner.image} onChange={e => handleBottomChange(i, 'image', e.target.value)} style={{ flex: 1, minWidth: 0 }} placeholder="URL" />
                      <label style={{ background: '#333', color: '#fff', padding: '0 16px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', borderRadius: '4px' }}>
                        ФАЙЛ
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, url => handleBottomChange(i, 'image', url))} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: '#666' }}>ГАРЧИГ</label>
                    <input className="input-dark" value={banner.title} onChange={e => handleBottomChange(i, 'title', e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Telegram Config */}
        <section className="admin-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, marginBottom: '16px', letterSpacing: '1.5px', color: '#555' }}>TELEGRAM CONFIG</h3>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '20px' }}>
            Шинэ захиалга ирэх үед мэдэгдэл авахын тулд Telegram Chat ID-г оруулна уу.<br/>
            <b>Chat ID авах заавар:</b> Ботоо эхлүүлээд (Start) нэг мессеж бичээд "ШИНЭЧЛЭЛ ШАЛГАХ" дарна уу.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input className="input-dark" value={data.telegramChatId || ''} onChange={e => setData({...data, telegramChatId: e.target.value})} style={{ flex: 1 }} placeholder="Chat ID (e.g. 12345678)" />
            <button onClick={checkUpdates} style={{ padding: '0 20px', background: '#111', color: '#fff', border: '1px solid #333', cursor: 'pointer', fontSize: '10px', fontWeight: 800, borderRadius: '4px' }}>ШИНЭЧЛЭЛ ШАЛГАХ</button>
          </div>

          {updates.length > 0 && (
            <div style={{ background: '#050505', padding: '16px', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
              <p style={{ fontSize: '10px', color: '#666', marginBottom: '12px', fontWeight: 800 }}>СҮҮЛИЙН МЕССЕЖҮҮД (CHAT ID ХАРАХ):</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {updates.slice(-5).reverse().map((u, i) => (
                  <div key={i} style={{ fontSize: '11px', padding: '8px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#aaa' }}>{u.message?.from?.first_name}: {u.message?.text}</span>
                    <code style={{ color: '#10b981', fontWeight: 800 }}>ID: {u.message?.chat?.id}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Coupon Config */}
        <section className="admin-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, marginBottom: '16px', letterSpacing: '1.5px', color: '#555' }}>CUPON CODES (10% DISCOUNT)</h3>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '20px' }}>
            Купон код нэмэх (Нэг купон нэг л удаа ашиглагдана).
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input 
              id="new-coupon"
              className="input-dark" 
              style={{ flex: 1 }} 
              placeholder="Шинэ купон код (Жишээ нь: SONE10)" 
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.toUpperCase().trim();
                  if (val) {
                    const newData = {...data, coupons: [...(data.coupons || []), val]};
                    setData(newData);
                    updateSettings(newData); // Save instantly
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <button 
              onClick={() => {
                const el = document.getElementById('new-coupon') as HTMLInputElement;
                const val = el.value.toUpperCase().trim();
                if (val) {
                  const newData = {...data, coupons: [...(data.coupons || []), val]};
                  setData(newData);
                  updateSettings(newData); // Save instantly
                  el.value = '';
                }
              }}
              style={{ padding: '0 20px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 800, borderRadius: '4px' }}
            >
              НЭМЭХ
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(data.coupons || []).map((c: string, i: number) => (
              <div key={i} style={{ background: '#111', border: '1px solid #333', padding: '8px 16px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '1px' }}>{c}</span>
                <button 
                  onClick={() => {
                    const newCoupons = [...data.coupons];
                    newCoupons.splice(i, 1);
                    const newData = {...data, coupons: newCoupons};
                    setData(newData);
                    updateSettings(newData); // Save instantly
                  }} 
                  style={{ color: '#ff3333', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 900 }}
                >
                  ×
                </button>
              </div>
            ))}
            {(!data.coupons || data.coupons.length === 0) && <p style={{ fontSize: '11px', color: '#444' }}>Идэвхтэй купон байхгүй байна.</p>}
          </div>
        </section>

        {/* Product Category Config */}
        <section className="admin-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, marginBottom: '16px', letterSpacing: '1.5px', color: '#555' }}>PRODUCT CATEGORIES</h3>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '20px' }}>
            Барааны ангиллууд нэмэх/хасах (Жишээ нь: HOODIE, PANTS).
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input 
              id="new-category"
              className="input-dark" 
              style={{ flex: 1 }} 
              placeholder="Шинэ ангилал нэмэх" 
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.toUpperCase().trim();
                  if (val) {
                    const currentCats = Array.isArray(data.productCategories) ? data.productCategories : [];
                    const newData = {...data, productCategories: [...currentCats, val]};
                    setData(newData);
                    updateSettings(newData);
                    (e.target as HTMLInputElement).value = '';
                    alert('Ангилал нэмэгдлээ: ' + val);
                  }
                }
              }}
            />
            <button 
              onClick={() => {
                const el = document.getElementById('new-category') as HTMLInputElement;
                const val = el.value.toUpperCase().trim();
                if (val) {
                  const currentCats = Array.isArray(data.productCategories) ? data.productCategories : [];
                  const newData = {...data, productCategories: [...currentCats, val]};
                  setData(newData);
                  updateSettings(newData);
                  el.value = '';
                  alert('Ангилал нэмэгдлээ: ' + val);
                }
              }}
              style={{ padding: '0 20px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 800, borderRadius: '4px' }}
            >
              НЭМЭХ
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(data.productCategories || []).map((c: string, i: number) => (
              <div key={i} style={{ background: '#111', border: '1px solid #333', padding: '8px 16px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '1px' }}>{c}</span>
                <button 
                  onClick={() => {
                    const newCats = [...data.productCategories];
                    newCats.splice(i, 1);
                    const newData = {...data, productCategories: newCats};
                    setData(newData);
                    updateSettings(newData);
                  }} 
                  style={{ color: '#ff3333', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 900 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={() => { updateSettings(data); alert('Амжилттай хадгалагдлаа!'); }} 
          className="btn-3d"
          style={{ position: 'fixed', bottom: '40px', right: '40px', padding: '16px 40px', background: '#fff', color: '#000', fontSize: '12px', fontWeight: 900, letterSpacing: '2px', border: 'none', cursor: 'pointer', zIndex: 1000 }}
        >
          ӨӨРЧЛӨЛТИЙГ ХАДГАЛАХ
        </button>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOOKS TAB
   ═══════════════════════════════════════════════════════ */
function LooksTab({ looks, products, addLook, updateLook, deleteLook }: {
  looks: any[];
  products: any[];
  addLook: (l: any) => void;
  updateLook: (l: any) => void;
  deleteLook: (id: string) => void;
}) {
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const emptyForm = () => ({
    id: Math.random().toString(36).substr(2, 9),
    title: '',
    description: '',
    image: '',
    productIds: [] as string[],
  });

  const startNew = () => { setEditing(emptyForm()); setIsNew(true); };
  const startEdit = (l: any) => { setEditing({ ...l, productIds: l.productIds || [] }); setIsNew(false); };
  const cancel = () => { setEditing(null); setIsNew(false); };

  const toggleProduct = (id: string) => {
    if (!editing) return;
    const cur = editing.productIds || [];
    setEditing({
      ...editing,
      productIds: cur.includes(id) ? cur.filter((x: string) => x !== id) : [...cur, id],
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const max_size = 1400;
        if (width > height && width > max_size) { height *= max_size / width; width = max_size; }
        else if (height > max_size) { width *= max_size / height; height = max_size; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.title.trim()) { alert('Гарчиг оруулна уу!'); return; }
    if (isNew) addLook(editing);
    else updateLook(editing);
    cancel();
  };

  const activeProducts = products.filter((p: any) => p.tag !== 'ARCHIVED');

  if (editing) {
    return (
      <div style={{ maxWidth: '800px' }}>
        <button onClick={cancel} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', marginBottom: '24px', fontFamily: 'var(--font-main)', fontSize: '12px' }}>← БУЦАХ</button>
        <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '32px' }}>{isNew ? 'ШИНЭ LOOK НЭМЭХ' : 'LOOK ЗАСАХ'}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Title */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#555', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>ГАРЧИГ</label>
            <input
              className="input-dark" style={{ width: '100%' }}
              value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
              placeholder="Look-ийн нэр (жишээ нь: SUMMER VIBE 2025)"
            />
          </div>

          {/* Description */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#555', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>ТАЙЛБАР (OPTIONAL)</label>
            <textarea
              className="input-dark" style={{ width: '100%', minHeight: '60px' }}
              value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })}
              placeholder="Look-ийн тухай богино тайлбар"
            />
          </div>

          {/* Image */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#555', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>LOOK ТОМ ЗУРАГ</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <input
                className="input-dark" style={{ flex: 1 }}
                value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })}
                placeholder="Зургийн URL"
              />
              <label style={{ background: '#333', color: '#fff', padding: '0 16px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', borderRadius: '4px' }}>
                ФАЙЛ СОНГОХ
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, url => setEditing({ ...editing, image: url }))} />
              </label>
            </div>
            {editing.image && (
              <img src={editing.image} alt="" style={{ height: '160px', objectFit: 'cover', border: '1px solid #222', borderRadius: '4px' }} />
            )}
          </div>

          {/* Products */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#555', letterSpacing: '2px' }}>
                БАРААНУУД ХОЛБОХ ({editing.productIds?.length || 0} сонгогдсон)
              </label>
              <button onClick={() => setEditing({ ...editing, productIds: [] })} style={{ fontSize: '10px', color: '#f55', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-main)' }}>
                БҮГДИЙГ АРИЛГАХ
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {activeProducts.map((p: any) => {
                const selected = (editing.productIds || []).includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    style={{
                      cursor: 'pointer',
                      border: `2px solid ${selected ? '#fff' : '#222'}`,
                      background: selected ? '#1a1a1a' : '#0d0d0d',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      transition: 'all 0.15s',
                      position: 'relative',
                    }}
                  >
                    <img src={p.images?.[0]} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', opacity: selected ? 1 : 0.5 }} />
                    {selected && (
                      <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#fff', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>✓</div>
                    )}
                    <div style={{ padding: '6px 8px' }}>
                      <p style={{ fontSize: '9px', fontWeight: 700, color: selected ? '#fff' : '#555', letterSpacing: '0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-main)' }}>{p.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} className="btn-primary" style={{ padding: '18px', fontSize: '13px' }}>
            {isNew ? '+ LOOK НЭМЭХ' : 'ХАДГАЛАХ'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>LOOK BOOK</h2>
          <p style={{ fontSize: '12px', color: '#555', fontFamily: 'var(--font-main)' }}>
            Хэрэглэгчид outfit санаа өгөх look зургуудыг удирдах
          </p>
        </div>
        <button onClick={startNew} className="btn-primary">+ ШИНЭ LOOK</button>
      </div>

      {looks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#555', background: '#0d0d0d', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px', fontFamily: 'var(--font-main)' }}>Look байхгүй байна.</p>
          <p style={{ fontSize: '11px', color: '#444', fontFamily: 'var(--font-main)' }}>+ ШИНЭ LOOK дарж нэмнэ үү</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {looks.map((look: any) => {
            const lookProducts = products.filter((p: any) => (look.productIds || []).includes(p.id));
            return (
              <div key={look.id} className="admin-card" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={look.image || 'https://via.placeholder.com/400x500?text=LOOK'}
                    alt={look.title}
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '3px 8px', fontFamily: 'var(--font-main)', letterSpacing: '1px' }}>
                    {lookProducts.length} БАРАА
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px', fontFamily: 'var(--font-main)', textTransform: 'uppercase' }}>{look.title}</p>
                  {look.description && <p style={{ fontSize: '11px', color: '#555', fontFamily: 'var(--font-main)', marginBottom: '12px' }}>{look.description}</p>}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => startEdit(look)} style={{ flex: 1, padding: '9px', background: '#111', color: '#fff', border: '1px solid #333', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-main)' }}>ЗАСАХ</button>
                    <button onClick={() => { if (confirm('Устгах уу?')) deleteLook(look.id); }} style={{ padding: '9px 14px', background: 'transparent', color: '#f55', border: 'none', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-main)' }}>УСТГАХ</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DropsTab({ drops, products, addSpecialDrop, updateSpecialDrop, deleteSpecialDrop }: {
  drops: any[];
  products: any[];
  addSpecialDrop: (d: any) => void;
  updateSpecialDrop: (d: any) => void;
  deleteSpecialDrop: (id: string) => void;
}) {
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const emptyForm = () => ({
    id: Math.random().toString(36).substr(2, 9),
    image: '',
    productId: '',
  });

  const startNew = () => {
    if (drops.length >= 4) {
      alert('Ихдээ 4 онцгой drop оруулах боломжтой!');
      return;
    }
    setEditing(emptyForm());
    setIsNew(true);
  };

  const startEdit = (d: any) => {
    setEditing({ ...d });
    setIsNew(false);
  };

  const cancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const max_size = 1400;
        if (width > height && width > max_size) { height *= max_size / width; width = max_size; }
        else if (height > max_size) { width *= max_size / height; height = max_size; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.image.trim()) { alert('Зураг оруулна уу!'); return; }
    if (!editing.productId) { alert('Бараа холбоно уу!'); return; }

    if (isNew) {
      addSpecialDrop(editing);
    } else {
      updateSpecialDrop(editing);
    }
    cancel();
  };

  const handleDelete = (id: string) => {
    if (confirm('Устгах уу?')) {
      deleteSpecialDrop(id);
    }
  };

  const activeProducts = products.filter((p: any) => p.tag !== 'ARCHIVED');

  if (editing) {
    const selectedProduct = activeProducts.find(p => p.id === editing.productId);
    return (
      <div style={{ maxWidth: '800px' }}>
        <button onClick={cancel} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', marginBottom: '24px', fontFamily: 'var(--font-main)', fontSize: '12px' }}>← БУЦАХ</button>
        <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '32px' }}>{isNew ? 'ШИНЭ DROP НЭМЭХ' : 'DROP ЗАСАХ'}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Image */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#555', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>DROP БОСОО ЗУРАГ (3:4 RATIO)</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <input
                className="input-dark" style={{ flex: 1 }}
                value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })}
                placeholder="Зургийн URL"
              />
              <label style={{ background: '#333', color: '#fff', padding: '0 16px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', borderRadius: '4px' }}>
                ФАЙЛ СОНГОХ
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, url => setEditing({ ...editing, image: url }))} />
              </label>
            </div>
            {editing.image && (
              <img src={editing.image} alt="" style={{ height: '200px', width: '150px', objectFit: 'cover', border: '1px solid #222', borderRadius: '4px' }} />
            )}
          </div>

          {/* Linked Product */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#555', letterSpacing: '2px' }}>
                ХОЛБОХ БАРАА СОНГОХ {selectedProduct ? `(Сонгогдсон: ${selectedProduct.name})` : ''}
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {activeProducts.map((p: any) => {
                const selected = editing.productId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setEditing({ ...editing, productId: p.id })}
                    style={{
                      cursor: 'pointer',
                      border: `2px solid ${selected ? '#fff' : '#222'}`,
                      background: selected ? '#1a1a1a' : '#0d0d0d',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      transition: 'all 0.15s',
                      position: 'relative',
                    }}
                  >
                    <img src={p.images?.[0]} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', opacity: selected ? 1 : 0.5 }} />
                    {selected && (
                      <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#fff', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>✓</div>
                    )}
                    <div style={{ padding: '6px 8px' }}>
                      <p style={{ fontSize: '9px', fontWeight: 700, color: selected ? '#fff' : '#555', letterSpacing: '0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-main)' }}>{p.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} className="btn-primary" style={{ padding: '18px', fontSize: '13px' }}>
            {isNew ? '+ DROP НЭМЭХ' : 'ХАДГАЛАХ'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>SPECIAL DROPS</h2>
          <p style={{ fontSize: '12px', color: '#555', fontFamily: 'var(--font-main)' }}>
            Нүүр хуудасны "SPECIAL DROPS" хэсэгт харагдах босоо зургууд болон тэдгээрт дарахад шууд орох бараануудыг удирдах (Ихдээ 4 drop)
          </p>
        </div>
        {drops.length < 4 && (
          <button onClick={startNew} className="btn-primary">+ ШИНЭ DROP</button>
        )}
      </div>

      {drops.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#555', background: '#0d0d0d', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px', fontFamily: 'var(--font-main)' }}>Drop байхгүй байна.</p>
          <p style={{ fontSize: '11px', color: '#444', fontFamily: 'var(--font-main)' }}>+ ШИНЭ DROP дарж нэмнэ үү. (Хоосон байвал автоматаар хамгийн сүүлийн 4 барааг харуулна)</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {drops.map((drop: any, idx: number) => {
            const product = products.find((p: any) => p.id === drop.productId);
            return (
              <div key={drop.id} className="admin-card" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={drop.image || 'https://via.placeholder.com/300x400?text=DROP'}
                    alt="Drop"
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '3px 8px', fontFamily: 'var(--font-main)', letterSpacing: '1px' }}>
                    DROP #{idx + 1}
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '4px', fontFamily: 'var(--font-main)', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product ? product.name : 'Холбоогүй бараа'}
                  </p>
                  <p style={{ fontSize: '10px', color: '#555', fontFamily: 'var(--font-main)', marginBottom: '12px' }}>
                    ID: {drop.productId}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => startEdit(drop)} style={{ flex: 1, padding: '9px', background: '#111', color: '#fff', border: '1px solid #333', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-main)' }}>ЗАСАХ</button>
                    <button onClick={() => handleDelete(drop.id)} style={{ padding: '9px 14px', background: 'transparent', color: '#f55', border: 'none', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-main)' }}>УСТГАХ</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
