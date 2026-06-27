'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';

export default function LogisticPage() {
  const { orders } = useStore();
  const [phone, setPhone] = useState('');
  const [foundOrders, setFoundOrders] = useState<any[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    const results = orders.filter(o => o.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
    setFoundOrders(results);
  };

  const getStatusInfo = (order: any) => {
    if (order.status === 'delivered') return { label: 'Хүргэгдсэн', step: 4, date: order.deliveredAt || order.date };
    if (order.status === 'cancelled') return { label: 'Цуцлагдсан', step: 0, date: null };

    // Calculate days passed since order
    const orderDate = new Date(order.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return { label: 'Захиалгыг бэлдэж байна', step: 1 };
    if (diffDays <= 4) return { label: 'Тээвэрлэгдэж байна хилээс гадна', step: 2 };
    if (diffDays <= 7) return { label: 'Тээвэрлэгдэж байна хил дотор', step: 3 };
    if (diffDays <= 10) return { label: 'Захиалгыг хүргэхэд бэлдэж байна', step: 4 };

    return { label: 'Хүргэлтийн шатанд', step: 4 };
  };

  return (
    <div style={{ background: '#fff', minHeight: '90vh', fontFamily: 'var(--font-main)' }}>
      {/* Header */}
      <div style={{ background: '#000', color: '#fff', padding: '80px 40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '4px', marginBottom: '20px' }}>
          LOGISTICS
        </h1>
        <p style={{ fontSize: '13px', color: '#666', letterSpacing: '2px', fontWeight: 600 }}>ЗАХИАЛГА ХЯНАХ</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '-40px auto 100px', padding: '0 20px' }}>
        {/* Search Box */}
        <div style={{ background: '#fff', border: '1px solid #000', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} className="search-card">
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#999', letterSpacing: '2px', textAlign: 'center' }}>УТАСНЫ ДУГААР ОРУУЛАХ</label>
            <div style={{ display: 'flex', gap: '10px' }} className="search-input-group">
              <input
                type="tel" placeholder="88888888" value={phone} onChange={e => setPhone(e.target.value)}
                style={{ flex: 1, background: '#f9f9f9', border: '1px solid #eee', padding: '16px', fontSize: '16px', fontWeight: 700, outline: 'none', minWidth: '0' }}
              />
              <button type="submit" style={{ background: '#000', color: '#fff', padding: '0 32px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', cursor: 'pointer', height: '54px' }} className="search-btn">ШҮҮХ</button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div style={{ marginTop: '60px' }}>
          {foundOrders === null ? null : foundOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>Захиалга олдсонгүй. Утасны дугаараа шалгана уу.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
              {foundOrders.map(order => {
                const info = getStatusInfo(order);
                return (
                  <div key={order.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 800, color: '#999', marginBottom: '8px' }}>ЗАХИАЛГЫН ДУГААР: #{order.id}</p>
                        <h2 style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1.2 }}>{info.label}</h2>
                      </div>
                      {info.date && (
                        <p style={{ fontSize: '11px', color: '#666', fontWeight: 600, background: '#f5f5f5', padding: '6px 12px' }}>{info.date}-нд хүргэгдсэн</p>
                      )}
                    </div>

                    {/* Progress Bar Container */}
                    <div style={{ padding: '0 10px' }}>
                      <div style={{ position: 'relative', height: '4px', background: '#f0f0f0', borderRadius: '2px', margin: '40px 0' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((info.step - 1) / 3) * 100}%`, background: '#000', transition: 'width 1s ease' }}></div>

                        {/* Points */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '-6px', left: 0, right: 0 }}>
                          {[1, 2, 3, 4].map(s => (
                            <div key={s} style={{
                              width: '16px', height: '16px', borderRadius: '50%',
                              background: info.step >= s ? '#000' : '#fff',
                              border: '2px solid #000',
                              transition: 'all 0.3s ease',
                              zIndex: 2
                            }}></div>
                          ))}
                        </div>
                      </div>

                      {/* Step Labels */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                        <p style={{ fontSize: '8px', fontWeight: 800, textAlign: 'center', color: info.step >= 1 ? '#000' : '#ccc', lineHeight: 1.3 }}>БЭЛТГЭГДЭЖ БУЙ</p>
                        <p style={{ fontSize: '8px', fontWeight: 800, textAlign: 'center', color: info.step >= 2 ? '#000' : '#ccc', lineHeight: 1.3 }}>ХИЛЭЭС ГАДНА</p>
                        <p style={{ fontSize: '8px', fontWeight: 800, textAlign: 'center', color: info.step >= 3 ? '#000' : '#ccc', lineHeight: 1.3 }}>ХИЛ ДОТОР</p>
                        <p style={{ fontSize: '8px', fontWeight: 800, textAlign: 'center', color: info.step >= 4 ? '#000' : '#ccc', lineHeight: 1.3 }}>ХҮРГЭЛТЭНД</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ marginTop: '40px', background: '#fcfcfc', padding: '24px', border: '1px solid #f5f5f5' }}>
                      <p style={{ fontSize: '9px', fontWeight: 800, color: '#999', marginBottom: '16px', letterSpacing: '1px' }}>ЗАХИАЛСАН БАРААНУУД</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {order.items.map((item: any, i: number) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: i === order.items.length - 1 ? 'none' : '1px solid #f0f0f0', paddingBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>{item.qty}x {item.name} <span style={{ color: '#999', fontSize: '11px' }}>({item.size})</span></span>
                            <span style={{ fontWeight: 800 }}>{(item.price * item.qty).toLocaleString()}₮</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .search-input-group { flex-direction: column; }
          .search-btn { width: 100%; }
          .search-card { padding: 24px !important; }
        }
      `}</style>
    </div>
  );
}
