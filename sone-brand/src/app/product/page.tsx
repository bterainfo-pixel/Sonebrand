'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import ProductClient from './ProductClient';

function ProductFetcher() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { products, isLoaded } = useStore();
  
  if (!isLoaded) {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Уншиж байна...</div>;
  }

  if (!id) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>АЛДАА</h1>
        <p>Бүтээгдэхүүний ID олдсонгүй.</p>
      </div>
    );
  }

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>404</h1>
        <p>Бүтээгдэхүүн олдсонгүй.</p>
      </div>
    );
  }

  return <ProductClient product={product} />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Уншиж байна...</div>}>
      <ProductFetcher />
    </Suspense>
  );
}
