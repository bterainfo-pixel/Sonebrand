'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
  animDelay?: number;
}

export default function ProductCard({ product, animDelay = 0 }: Props) {
  const [hovered, setHovered] = useState(false);
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const salePrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
  const hasSale = (product.discount || 0) > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasSizes && !selectedSize) {
      setShowSizePanel(true);
      return;
    }
    const size = selectedSize || (hasSizes ? product.sizes![0] : 'ONE SIZE');
    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      image: product.images?.[0] || '',
      size,
      qty: 1,
    });
    setAddedFeedback(true);
    setShowSizePanel(false);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleSizeConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      image: product.images?.[0] || '',
      size: selectedSize,
      qty: 1,
    });
    setAddedFeedback(true);
    setShowSizePanel(false);
    setSelectedSize('');
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product?id=${product.id}`);
  };

  return (
    <Link
      href={`/product?id=${product.id}`}
      style={{
        display: 'block',
        position: 'relative',
        animationDelay: `${animDelay}ms`,
        background: '#fff',
        textDecoration: 'none',
      }}
      className="fade-up product-card-link"
      onMouseEnter={() => { setHovered(true); }}
      onMouseLeave={() => { setHovered(false); if (!addedFeedback) setShowSizePanel(false); }}
    >
      {/* Image area */}
      <div style={{ display: 'block', position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
        {/* Image 1 */}
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/600x800?text=No+Image'}
          alt={product.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.55s ease',
          }}
        />
        {/* Image 2 — hover swap */}
        {product.images && product.images.length > 1 && (
          <img
            src={product.images[1]}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        )}

        {/* Tag badge (Left) */}
        {product.tag && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: '#000',
            color: '#fff',
            fontSize: '9px',
            letterSpacing: '1.5px',
            padding: '3px 8px',
            fontFamily: 'var(--font-main)',
            fontWeight: 700,
            zIndex: 2,
          }}>
            {product.tag}
          </div>
        )}

        {/* Sale Tag (Right) */}
        {hasSale && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#ff0000',
            color: '#fff',
            fontSize: '9px',
            letterSpacing: '1.5px',
            padding: '3px 8px',
            fontFamily: 'var(--font-main)',
            fontWeight: 900,
            zIndex: 2,
            boxShadow: '0 4px 10px rgba(255,0,0,0.3)'
          }}>
            {`-${product.discount}%`}
          </div>
        )}

        {/* Size panel (shows on hover or when triggered on mobile) */}
        {showSizePanel && hasSizes && (
          <div
            onClick={e => e.preventDefault()}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.92)',
              padding: '12px',
              zIndex: 5,
              backdropFilter: 'blur(4px)',
            }}
          >
            <p style={{ fontSize: '9px', color: '#aaa', fontWeight: 700, letterSpacing: '2px', marginBottom: '8px', fontFamily: 'var(--font-main)', textTransform: 'uppercase' }}>
              РАЗМЕР СОНГОХ
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
              {product.sizes!.map(s => (
                <button
                  key={s}
                  onClick={e => handleSizeSelect(e, s)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-main)',
                    background: selectedSize === s ? '#fff' : 'transparent',
                    color: selectedSize === s ? '#000' : '#fff',
                    border: `1px solid ${selectedSize === s ? '#fff' : '#555'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    letterSpacing: '1px',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={handleSizeConfirm}
              style={{
                width: '100%',
                padding: '9px',
                background: selectedSize ? '#fff' : '#333',
                color: selectedSize ? '#000' : '#666',
                border: 'none',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '2px',
                cursor: selectedSize ? 'pointer' : 'default',
                fontFamily: 'var(--font-main)',
                transition: 'all 0.2s',
              }}
            >
              {selectedSize ? 'САГСАНД НЭМЭХ ✓' : 'РАЗМЕР СОНГОНО УУ'}
            </button>
          </div>
        )}

        {/* Action overlay — visible always on mobile, hover on desktop */}
        {!showSizePanel && (
          <div className="pc-action-overlay" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            zIndex: 4,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}>
            <button
              onClick={addedFeedback ? undefined : handleAddToCart}
              style={{
                width: '100%',
                padding: '11px',
                background: addedFeedback ? '#10b981' : 'rgba(0,0,0,0.88)',
                color: '#fff',
                border: 'none',
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '2px',
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                transition: 'background 0.3s',
                textTransform: 'uppercase',
                backdropFilter: 'blur(4px)',
              }}
            >
              {addedFeedback ? '✓ НЭМЭГДЛЭЭ' : '+ САГСАНД НЭМЭХ'}
            </button>
            <button
              onClick={handleOrder}
              style={{
                width: '100%',
                padding: '11px',
                background: 'rgba(255,255,255,0.92)',
                color: '#000',
                border: 'none',
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '2px',
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                textTransform: 'uppercase',
              }}
            >
              ЗАХИАЛАХ →
            </button>
          </div>
        )}
      </div>

      {/* Info: name + price */}
      <div className="product-card-info" style={{ 
        position: 'relative', 
        padding: '14px 14px 18px', 
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div className="product-card-title" style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#000',
          fontFamily: 'var(--font-main)',
          lineHeight: 1.4,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0,
        }}>
          {product.name}
        </div>
        <div className="product-card-price" style={{ 
          display: 'flex', 
          gap: '8px', 
          alignItems: 'center',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: 'var(--font-main)',
          color: '#000',
        }}>
          <span style={{ color: hasSale ? '#ff0000' : 'inherit' }}>{salePrice.toLocaleString()}₮</span>
          {hasSale && (
            <span style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through', fontWeight: 400 }}>
              {product.price.toLocaleString()}₮
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
