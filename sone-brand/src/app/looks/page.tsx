'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';

export default function LooksPage() {
  const { settings, products } = useStore();
  const { addToCart } = useCart();
  const looks = settings.looks || [];
  const [activeLook, setActiveLook] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [sizeModal, setSizeModal] = useState<{ productId: string; sizes: string[] } | null>(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (activeLook) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeLook]);

  const openLook = (id: string) => setActiveLook(id);
  const closeLook = () => setActiveLook(null);

  const activeLookData = looks.find(l => l.id === activeLook);
  const activeLookProducts = activeLookData
    ? products.filter(p => activeLookData.productIds.includes(p.id))
    : [];

  const handleAddToCart = (product: any, size?: string) => {
    const sizeToUse = size || (product.sizes?.length > 0 ? product.sizes[0] : 'ONE SIZE');
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price,
      image: product.images?.[0] || '',
      size: sizeToUse,
      qty: 1,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleCartClick = (product: any) => {
    if (product.sizes && product.sizes.length > 0) {
      setSizeModal({ productId: product.id, sizes: product.sizes });
      setSelectedSize('');
    } else {
      handleAddToCart(product);
    }
  };

  const confirmSize = () => {
    if (!selectedSize || !sizeModal) return;
    const product = products.find(p => p.id === sizeModal.productId);
    if (product) handleAddToCart(product, selectedSize);
    setSizeModal(null);
    setSelectedSize('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-main)' }}>

      {/* ─── PAGE HEADER ─── */}
      <div style={{
        background: '#000', color: '#fff',
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px) clamp(30px, 6vw, 60px)',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '5px',
          color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase',
          fontFamily: 'var(--font-main)',
        }}>
          OUTFIT INSPIRATION
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 10vw, 100px)',
          letterSpacing: '4px',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          LOOK BOOK
        </h1>
        <p style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 400,
          letterSpacing: '1px', maxWidth: '400px', margin: '0 auto',
          fontFamily: 'var(--font-main)',
        }}>
          Ямар хослол өмсөхөө мэдэхгүй байна уу? Манай бэлдсэн look-уудаас санаа авна уу.
        </p>
      </div>

      {/* ─── LOOKS GRID ─── */}
      {looks.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '40vh', gap: '16px', color: '#999',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p style={{ fontSize: '14px', fontFamily: 'var(--font-main)' }}>Одоогоор look байхгүй байна.</p>
          <p style={{ fontSize: '11px', color: '#bbb', fontFamily: 'var(--font-main)' }}>Удахгүй шинэ look-ууд нэмэгдэнэ.</p>
        </div>
      ) : (
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: 'clamp(28px,5vw,60px) clamp(16px,4vw,48px)',
        }}>
          <div className="looks-grid">
            {looks.map((look, i) => {
              const lookProducts = products.filter(p => look.productIds.includes(p.id));
              return (
                <div
                  key={look.id}
                  className="look-card"
                  onClick={() => openLook(look.id)}
                >
                  {/* Main look image */}
                  <div className="look-card-img-wrap">
                    <img
                      src={look.image || 'https://via.placeholder.com/600x800?text=LOOK'}
                      alt={look.title}
                      className="look-card-img"
                    />
                    <div className="look-card-overlay">
                      <div className="look-card-cta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        LOOK ХАРАХ
                      </div>
                    </div>
                    {/* Product count badge */}
                    <div className="look-product-count">
                      {lookProducts.length} БАРАА
                    </div>
                  </div>

                  {/* Look info */}
                  <div className="look-card-info">
                    <h3 className="look-card-title">{look.title}</h3>
                    {look.description && (
                      <p className="look-card-desc">{look.description}</p>
                    )}
                    {/* Product thumbnails */}
                    {lookProducts.length > 0 && (
                      <div className="look-thumb-row">
                        {lookProducts.slice(0, 4).map(p => (
                          <div key={p.id} className="look-thumb">
                            <img
                              src={p.images?.[0] || ''}
                              alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                        {lookProducts.length > 4 && (
                          <div className="look-thumb look-thumb-more">
                            +{lookProducts.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── LOOK DETAIL MODAL ─── */}
      {activeLook && activeLookData && (
        <div
          className="look-modal-backdrop"
          onClick={closeLook}
        >
          <div
            className="look-modal"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button onClick={closeLook} className="look-modal-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* ── MOBILE: Look image top, products bottom ── */}
            {/* ── DESKTOP: Look image left, products right ── */}
            <div className="look-modal-inner">

              {/* Look image */}
              <div className="look-modal-img-col">
                <img
                  src={activeLookData.image}
                  alt={activeLookData.title}
                  className="look-modal-img"
                />
                <div style={{ padding: '16px 20px 16px', background: '#000' }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(18px, 4vw, 28px)',
                    color: '#fff',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}>{activeLookData.title}</h2>
                  {activeLookData.description && (
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-main)', lineHeight: 1.6 }}>
                      {activeLookData.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Products list */}
              <div className="look-modal-products-col">
                <div className="look-modal-products-header">
                  <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '3px', color: '#999', fontFamily: 'var(--font-main)' }}>
                    LOOK ДОТОРХ БАРААНУУД — {activeLookProducts.length} ш
                  </span>
                </div>

                {activeLookProducts.length === 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#bbb', fontSize: '13px', fontFamily: 'var(--font-main)' }}>
                    Холбоотой бараа байхгүй байна.
                  </div>
                )}

                <div className="look-modal-products-list">
                  {activeLookProducts.map(p => {
                    const salePrice = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
                    const isAdded = addedId === p.id;
                    return (
                      <div key={p.id} className="look-product-row">
                        {/* Product image */}
                        <Link href={`/product?id=${p.id}`} className="look-product-img-wrap">
                          <img
                            src={p.images?.[0] || ''}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Link>

                        {/* Info */}
                        <div className="look-product-info">
                          <Link href={`/product?id=${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <p className="look-product-name">{p.name}</p>
                          </Link>
                          <div className="look-product-price-row">
                            <span style={{ fontWeight: 800, color: p.discount ? '#e00' : '#000', fontSize: '14px', fontFamily: 'var(--font-main)' }}>
                              {salePrice.toLocaleString()}₮
                            </span>
                            {p.discount ? (
                              <span style={{ fontSize: '11px', color: '#bbb', textDecoration: 'line-through', fontFamily: 'var(--font-main)' }}>
                                {p.price.toLocaleString()}₮
                              </span>
                            ) : null}
                          </div>
                          {/* Action buttons */}
                          <div className="look-product-actions">
                            <button
                              onClick={() => handleCartClick(p)}
                              className={`look-cart-btn ${isAdded ? 'look-cart-btn-added' : ''}`}
                            >
                              {isAdded ? '✓ НЭМЭГДЛЭЭ' : '+ САГСАНД'}
                            </button>
                            <Link href={`/product?id=${p.id}`} className="look-detail-btn">
                              ДЭЛГЭРЭНГҮЙ
                            </Link>
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

      {/* Size selection modal */}
      {sizeModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 99999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
          onClick={() => setSizeModal(null)}
        >
          <div
            style={{ background: '#fff', width: '100%', maxWidth: '480px', padding: '28px 24px 40px', borderRadius: '16px 16px 0 0' }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '3px', marginBottom: '20px', fontFamily: 'var(--font-main)', textTransform: 'uppercase' }}>
              РАЗМЕР СОНГОХ
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {sizeModal.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    padding: '10px 16px',
                    fontSize: '12px', fontWeight: 700,
                    fontFamily: 'var(--font-main)',
                    background: selectedSize === s ? '#000' : '#f5f5f5',
                    color: selectedSize === s ? '#fff' : '#000',
                    border: `1px solid ${selectedSize === s ? '#000' : '#ddd'}`,
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={confirmSize}
              style={{
                width: '100%', padding: '15px',
                background: selectedSize ? '#000' : '#ddd',
                color: selectedSize ? '#fff' : '#999',
                border: 'none', fontSize: '12px', fontWeight: 800,
                letterSpacing: '2px', cursor: selectedSize ? 'pointer' : 'default',
                fontFamily: 'var(--font-main)', textTransform: 'uppercase',
                borderRadius: '4px', transition: 'all 0.2s',
              }}
            >
              {selectedSize ? 'САГСАНД НЭМЭХ' : 'РАЗМЕР СОНГОНО УУ'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* ─── LOOK GRID ─── */
        .looks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .look-card {
          cursor: pointer;
          transition: transform 0.3s ease;
          background: #fff;
          border: 1px solid #ebebeb;
          overflow: hidden;
        }
        .look-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
        .look-card-img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #111;
        }
        .look-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .look-card:hover .look-card-img { transform: scale(1.05); }
        .look-card-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s ease;
        }
        .look-card:hover .look-card-overlay { background: rgba(0,0,0,0.3); }
        .look-card-cta {
          display: flex; align-items: center; gap: 8px;
          background: #fff; color: #000;
          padding: 12px 24px;
          font-family: var(--font-main);
          font-size: 10px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0; transform: scale(0.9);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .look-card:hover .look-card-cta { opacity: 1; transform: scale(1); }
        .look-product-count {
          position: absolute; top: 12px; left: 12px;
          background: rgba(0,0,0,0.75); color: #fff;
          font-size: 9px; font-weight: 800; letter-spacing: 2px;
          padding: 4px 10px;
          font-family: var(--font-main);
          text-transform: uppercase;
        }
        .look-card-info {
          padding: 16px;
        }
        .look-card-title {
          font-family: var(--font-main);
          font-size: 13px; font-weight: 800;
          letter-spacing: 1px; color: #000;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .look-card-desc {
          font-family: var(--font-main);
          font-size: 11px; color: #888;
          line-height: 1.5; margin-bottom: 12px;
        }
        .look-thumb-row {
          display: flex; gap: 6px;
        }
        .look-thumb {
          width: 44px; height: 44px;
          overflow: hidden; background: #f0f0f0;
          flex-shrink: 0;
        }
        .look-thumb-more {
          display: flex; align-items: center; justify-content: center;
          background: #111; color: #fff;
          font-size: 10px; font-weight: 800;
          font-family: var(--font-main);
        }

        /* ─── MODAL ─── */
        .look-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          z-index: 9999;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px 60px;
        }
        .look-modal {
          background: #fff;
          width: 100%; max-width: 900px;
          position: relative;
          display: flex; flex-direction: column;
          border-radius: 4px;
          animation: modalIn 0.3s cubic-bezier(0.16,1,0.3,1);
          flex-shrink: 0;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .look-modal-close {
          position: absolute; top: 12px; right: 12px;
          z-index: 10;
          background: rgba(0,0,0,0.5); color: #fff;
          border: none; width: 36px; height: 36px;
          border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .look-modal-close:hover { background: rgba(0,0,0,0.8); }
        .look-modal-inner {
          display: flex;
          flex-direction: row;
        }
        .look-modal-img-col {
          width: 45%;
          flex-shrink: 0;
          background: #000;
          display: flex; flex-direction: column;
        }
        .look-modal-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          display: block;
        }
        .look-modal-products-col {
          flex: 1;
          display: flex; flex-direction: column;
        }
        .look-modal-products-header {
          padding: 20px 20px 12px;
          border-bottom: 1px solid #f0f0f0;
          background: #fff;
        }
        .look-modal-products-list {
          display: flex; flex-direction: column;
          gap: 0;
        }
        .look-product-row {
          display: flex; gap: 14px;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          align-items: flex-start;
          transition: background 0.15s;
        }
        .look-product-row:hover { background: #fafafa; }
        .look-product-img-wrap {
          width: 72px; height: 88px;
          flex-shrink: 0; overflow: hidden; background: #f0f0f0;
          display: block;
        }
        .look-product-info { flex: 1; min-width: 0; }
        .look-product-name {
          font-family: var(--font-main);
          font-size: 12px; font-weight: 700;
          color: #000; margin-bottom: 4px;
          text-transform: uppercase;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .look-product-price-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 10px;
        }
        .look-product-actions {
          display: flex; gap: 6px;
        }
        .look-cart-btn {
          flex: 1; padding: 8px 6px;
          font-family: var(--font-main);
          font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
          background: #000; color: #fff;
          border: none; cursor: pointer;
          transition: background 0.2s;
          text-transform: uppercase;
        }
        .look-cart-btn:hover { background: #222; }
        .look-cart-btn-added { background: #10b981 !important; }
        .look-detail-btn {
          flex: 1; padding: 8px 6px;
          font-family: var(--font-main);
          font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
          background: #f0f0f0; color: #000;
          border: none; cursor: pointer;
          text-align: center;
          transition: background 0.2s;
          text-transform: uppercase;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center;
        }
        .look-detail-btn:hover { background: #e0e0e0; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .looks-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 560px) {
          .looks-grid { grid-template-columns: 1fr; gap: 16px; }
          .look-card-img-wrap { aspect-ratio: 4/5; }
        }

        /* ─── MODAL MOBILE ─── */
        @media (max-width: 680px) {
          .look-modal-backdrop {
            padding: 0;
            align-items: flex-start;
            overflow: hidden;
          }
          .look-modal {
            height: 100dvh;
            max-height: 100dvh;
            border-radius: 0;
            max-width: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          .look-modal-inner {
            flex-direction: column;
          }
          .look-modal-img-col {
            width: 100%;
            flex-shrink: 0;
            flex-direction: column;
          }
          .look-modal-img {
            width: 100%;
            aspect-ratio: 3/4;
            max-height: 65vh;
            object-fit: cover;
          }
          .look-modal-products-col {
            overflow-y: visible;
          }
          .look-product-img-wrap {
            width: 60px; height: 72px;
          }
        }

        @media (max-width: 400px) {
          .look-modal-img { max-height: 55vh; }
        }
      `}</style>
    </div>
  );
}
