'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductClient({ product: initialProduct }: { product: any }) {
  const { products } = useStore();
  // Try to find the latest version of the product from the store (which might have Supabase data)
  const product = products.find(p => p.id === initialProduct.id) || initialProduct;
  
  const [mainImg, setMainImg] = useState(product.images?.[0] || 'https://picsum.photos/seed/placeholder/800/1000');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const { addToCart } = useCart();

  const salePrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
  const hasSale = (product.discount || 0) > 0;
  const related = products.filter(p => p.category === product.category && p.id !== product.id && p.tag !== 'ARCHIVED').slice(0, 4);
  const formatted = salePrice.toLocaleString('mn-MN') + '₮';

  function handleAdd() {
    if ((product.sizes?.length || 0) > 0 && !selectedSize) return;
    if ((product.colors?.length || 0) > 0 && !selectedColor) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      image: mainImg,
      size: selectedSize || 'FREE',
      color: selectedColor,
      qty: qty
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const handleColorSelect = (color: { name: string; image: string }) => {
    setSelectedColor(color.name);
    setMainImg(color.image);
  };

  return (
    <div style={{ background: '#fff', minHeight: '80vh' }}>
      
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div 
          onClick={() => setShowSizeChart(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', maxWidth: '600px', width: '100%', padding: '20px', position: 'relative' }}>
            <button onClick={() => setShowSizeChart(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', zIndex: 10 }}>×</button>
            <h3 style={{ fontFamily: 'var(--font-main)', fontSize: '14px', fontWeight: 800, letterSpacing: '2px', marginBottom: '20px', textAlign: 'center' }}>ХЭМЖЭЭНИЙ ХҮСНЭГТ</h3>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-main)' }}>
                <thead>
                  <tr style={{ background: '#000', color: '#fff', textAlign: 'left' }}>
                    <th style={{ padding: '16px', fontWeight: 800, letterSpacing: '1px' }}>РАЗМЕР</th>
                    <th style={{ padding: '16px', fontWeight: 800, letterSpacing: '1px' }}>ӨНДӨР</th>
                    <th style={{ padding: '16px', fontWeight: 800, letterSpacing: '1px' }}>ЖИН</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['S', '155–160cm', '50–58kg'],
                    ['M', '160–170cm', '58–65kg'],
                    ['L', '170–175cm', '65–72kg'],
                    ['XL', '175–180cm', '72–80kg'],
                    ['XXL', '180–185cm', '80–90kg'],
                    ['XXXL', '185–190cm', '90–100kg']
                  ].map((row, i) => (
                    <tr key={row[0]} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '16px', fontWeight: 800, color: '#000' }}>{row[0]}</td>
                      <td style={{ padding: '16px', color: '#555' }}>{row[1]}</td>
                      <td style={{ padding: '16px', color: '#555' }}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '16px', fontSize: '10px', color: '#666', textAlign: 'center' }}>* Биеийн онцлогоос хамаарч бага зэргийн зөрүү гарч болно.</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '12px 20px', borderBottom: '1px solid #eee' }}>
        <p style={{ fontFamily: 'var(--font-main)', fontSize: '9px', color: '#999', letterSpacing: '0.5px' }}>
          <Link href="/" style={{ color: '#999' }}>Нүүр</Link>
          {' / '}
          <Link href="/products" style={{ color: '#999' }}>Бараа</Link>
          {' / '}
          <span style={{ color: '#000' }}>{product.name}</span>
        </p>
      </div>

      {/* Main layout */}
      <div className="product-page-container section-padding" style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px' }}>
        <div className="product-page-layout">

          {/* Left: images */}
          <div className="product-images-section">
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111', marginBottom: '12px', position: 'relative' }}>
              <img src={mainImg} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
              {hasSale && (
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#f00', color: '#fff', padding: '4px 10px', fontSize: '10px', fontWeight: 900, letterSpacing: '1px' }}>
                  {`-${product.discount}% OFF`}
                </div>
              )}
            </div>
          </div>

          {/* Right: info */}
          <div className="product-info-section">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {product.tag && (
                <span style={{ fontFamily: 'var(--font-main)', fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px', background: '#000', color: '#fff', padding: '3px 8px' }}>
                  {product.tag}
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: 'var(--font-main)', fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 800, letterSpacing: '0.5px', color: '#000', marginBottom: '8px', lineHeight: 1.2 }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-main)', fontSize: '24px', fontWeight: 800, color: hasSale ? '#f00' : '#000' }}>
                {formatted}
              </span>
              {hasSale && (
                <span style={{ fontFamily: 'var(--font-main)', fontSize: '18px', fontWeight: 500, color: '#999', textDecoration: 'line-through' }}>
                  {product.price.toLocaleString()}₮
                </span>
              )}
            </div>

            {/* Color selector */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '10px', fontWeight: 800, color: '#999', marginBottom: '12px', letterSpacing: '1px' }}>ӨНГӨ СОНГОХ</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {product.colors.map((c: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => handleColorSelect(c)}
                      style={{
                        width: '44px',
                        height: '58px',
                        cursor: 'pointer',
                        border: selectedColor === c.name ? '2px solid #000' : '1px solid #eee',
                        overflow: 'hidden',
                        transition: 'all 0.2s'
                      }}
                    >
                      <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {(product.images?.length || 0) > 1 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '10px', fontWeight: 800, color: '#999', marginBottom: '12px', letterSpacing: '1px' }}>БАРААНЫ ӨНГИЙГ ЗУРГУУДААС СОНГОН УУ</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(product.images || []).map((img: string, i: number) => (
                    <div
                      key={i}
                      onClick={() => setMainImg(img)}
                      style={{
                        width: '50px',
                        flexShrink: 0,
                        aspectRatio: '3/4',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: mainImg === img ? '2px solid #000' : '1px solid #eee',
                        background: '#111',
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#999', letterSpacing: '1px' }}>ХЭМЖЭЭ СОНГОХ</p>
                  <button 
                    onClick={() => setShowSizeChart(true)}
                    style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: 800, color: '#000', textDecoration: 'underline', cursor: 'pointer', letterSpacing: '1px' }}>
                    SIZE CHART
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        minWidth: '50px',
                        height: '44px',
                        background: selectedSize === s ? '#000' : '#fff',
                        color: selectedSize === s ? '#fff' : '#000',
                        border: '1px solid #000',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty & Add to Cart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#555' }}>
                PRE-ORDER — Захиалсны дараа 5–8 хоногт хүргэгдэнэ
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', border: '1px solid #000', height: '54px', alignItems: 'center' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '44px', height: '100%', background: '#fff', border: 'none', fontSize: '18px', cursor: 'pointer' }}>−</button>
                  <span style={{ width: '44px', textAlign: 'center', fontWeight: 800, fontSize: '14px' }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ width: '44px', height: '100%', background: '#fff', border: 'none', fontSize: '18px', cursor: 'pointer' }}>+</button>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className="btn-3d"
                  style={{
                    flex: 1,
                    background: (selectedSize || (product.sizes?.length || 0) === 0) ? '#000' : '#e0e0e0',
                    color: (selectedSize || (product.sizes?.length || 0) === 0) ? '#fff' : '#999',
                    border: 'none',
                    height: '54px',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    cursor: (selectedSize || (product.sizes?.length || 0) === 0) ? 'pointer' : 'not-allowed'
                  }}
                >
                  {added ? 'САГСАНД НЭМЭГДЛЭЭ ✓' : ((product.sizes?.length || 0) > 0 && !selectedSize) ? 'ХЭМЖЭЭ СОНГОНО УУ' : 'САГСАНД НЭМЭХ'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
              <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line' }}>
                {product.description || 'Энэхүү барааны дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.'}
              </p>
            </div>

            {/* Additional Details */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '24px', marginTop: '24px' }}>
              {[
                { label: 'КАТЕГОРИ', val: (product.category || 'PRODUCT').toUpperCase() },
                { label: 'БРЭНД', val: 'SONE BRAND' },
                { label: 'СТАТУС', val: 'PRE-ORDER' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#999', letterSpacing: '1px' }}>{r.label}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#000' }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="section-padding" style={{ borderTop: '1px solid #eee', maxWidth: '1440px', margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{ fontFamily: 'var(--font-main)', fontSize: '12px', fontWeight: 800, letterSpacing: '3px', marginBottom: '32px', color: '#000', textAlign: 'center' }}>
            YOU MAY ALSO LIKE
          </h2>
          <div className="grid-4-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {related.map((p: any, i: number) => (
              <ProductCard key={p.id} product={p} animDelay={i * 60} />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .product-page-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
        }
        @media (max-width: 1024px) {
          .product-page-layout { gap: 32px; }
        }
        @media (max-width: 768px) {
          .product-page-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .product-images-section { 
            margin: 0;
            overflow: hidden;
            width: 100%;
          }
          .product-images-section img {
            max-width: 100%;
            width: 100%;
          }
          .product-page-container { padding: 16px !important; }
          .product-info-section { padding: 0; }
          .grid-4-col { grid-template-columns: repeat(2, 1fr) !important; gap: 15px !important; }
        }
        @media (max-width: 600px) {
          table th, table td { padding: 8px !important; font-size: 10px !important; }
        }
      `}</style>
    </div>
  );
}
