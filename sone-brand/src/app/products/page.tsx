'use client';
import { useState, useEffect, Suspense } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
  const { products, settings } = useStore();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category')?.toUpperCase();

  const defaultCats = ['HOODIE', 'SET', 'JACKET', 'PANTS', 'ЦҮНХ', 'БУСАД'];
  const CATS = ['БҮГД', ...(settings.productCategories?.length ? settings.productCategories : defaultCats)];

  const [active, setActive] = useState('БҮГД');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (catParam && CATS.includes(catParam)) {
      setActive(catParam);
    }
  }, [catParam, settings.productCategories]);

  let filtered = products.filter(p => {
    const pCat = (p.category || '').toUpperCase();
    const pName = (p.name || '').toLowerCase();
    const matchesCat = active === 'БҮГД' || pCat === active;
    const matchesSearch = pName.includes(search.toLowerCase());
    return matchesCat && matchesSearch && p.tag !== 'ARCHIVED';
  });

  if (sort === 'priceLow') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === 'priceHigh') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div style={{ background: '#fff', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#000', color: '#fff', padding: '48px 40px 36px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 600, letterSpacing: '4px', color: '#666', marginBottom: '10px' }}>
            PRE-ORDER ONLINE SHOP
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 60px)', letterSpacing: '3px' }}>
            ALL PRODUCTS
          </h1>
        </div>
      </div>

      {/* Toolbar: Search & Sort */}
      <div style={{ borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
             <input 
               type="text" placeholder="Хайх..." 
               value={search} onChange={e => setSearch(e.target.value)}
               style={{ width: '100%', padding: '12px 16px', fontSize: '13px', background: '#f9f9f9', border: '1px solid #eee', outline: 'none' }}
             />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
             <span style={{ fontSize: '10px', fontWeight: 800, color: '#999' }}>ЭРЭМБЭЛЭХ:</span>
             <select 
               value={sort} onChange={e => setSort(e.target.value)}
               style={{ background: '#fff', border: '1px solid #eee', padding: '10px', fontSize: '11px', fontWeight: 700, outline: 'none' }}
             >
               <option value="newest">ШИНЭ НЬ ЭХЭНДЭЭ</option>
               <option value="priceLow">ҮНЭ ӨСӨХӨӨР</option>
               <option value="priceHigh">ҮНЭ БУУРАХААР</option>
             </select>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ borderBottom: '1px solid #e8e8e8', background: '#fff', position: 'sticky', top: '90px', zIndex: 50 }}>
        <div style={{ 
          maxWidth: '1440px', 
          margin: '0 auto', 
          padding: '0 20px', 
          display: 'flex', 
          gap: '0',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
        }}>
          {CATS.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                fontFamily: 'var(--font-main)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '2px',
                padding: '18px 24px',
                flexShrink: 0,
                color: active === cat ? '#000' : '#999',
                borderBottom: active === cat ? '2px solid #000' : '2px solid transparent',
                background: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
                marginBottom: '-1px',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="section-padding" style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-main)', fontSize: '11px', color: '#999', letterSpacing: '0.5px' }}>
            {filtered.length} бараа олдлоо
          </p>
        </div>
        <div className="grid-4-col">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} animDelay={i * 30} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ color: '#999', fontSize: '14px' }}>Ийм бараа олдсонгүй.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
