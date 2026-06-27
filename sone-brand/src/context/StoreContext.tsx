'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { sendTelegramMessage } from '@/lib/telegram';

export interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number; 
  description?: string;
  images: string[];
  category: string;
  tag?: string;
  sizes?: string[];
  colors?: { name: string; image: string }[];
}

export interface Look {
  id: string;
  title: string;
  description?: string;
  image: string;
  productIds: string[];
}

export interface Order {
  id: string;
  date: string;
  deliveredAt?: string;
  customerName: string;
  phone: string;
  address: string;
  items: {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color?: string;
    qty: number;
  }[];
  total: number;
  paymentType: 'full' | 'half';
  status: 'pending' | 'transit' | 'out_for_delivery' | 'delivered';
  receiptImage?: string | null;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'hidden';
}

export interface SpecialDrop {
  id: string;
  image: string;
  productId: string;
}

export interface SiteSettings {
  announcement: string;
  heroSlides: {
    bg: string;
    eye: string;
    title: string;
    sub: string;
    cta: string;
    href: string;
  }[];
  promoBanner: {
    title: string;
    sub: string;
    image: string;
  };
  categories: {
    id: string;
    name: string;
    image: string;
  }[];
  bottomBanners: {
    image: string;
    title?: string;
    sub?: string;
  }[];
  telegramChatId?: string;
  coupons: string[];
  productCategories: string[];
  reviews: Review[];
  looks: Look[];
  specialDrops?: SpecialDrop[];
}

const initialSettings: SiteSettings = {
  announcement: '50,000₮-С ДЭЭШ ЗАХИАЛГАД ҮНЭГҮЙ ХҮРГЭЛТ',
  heroSlides: [
    {
      bg: 'https://picsum.photos/seed/hero01/1600/800',
      eye: 'NEW COLLECTION 2025',
      title: 'DARKNESS\nDEFINED.',
      sub: 'Зөвхөн SONE BRAND-д онцгойлон.',
      cta: 'SHOP NOW',
      href: '/products',
    },
    {
      bg: 'https://picsum.photos/seed/hero02/1600/800',
      eye: 'LIMITED DROP',
      title: 'SHADOWS\nWEAR.',
      sub: 'Pre-order болон онцгой дусал.',
      cta: 'VIEW DROP',
      href: '/new',
    },
    {
      bg: 'https://picsum.photos/seed/hero03/1600/800',
      eye: 'BEST SELLER',
      title: 'GRAPHIC\nTEES.',
      sub: 'Хязгаарлагдмал тоо, онцгой загвар.',
      cta: 'SHOP TEES',
      href: '/tshirt',
    },
  ],
  promoBanner: {
    title: 'GRAPHIC\nTEES',
    sub: 'WORLD EXCLUSIVE',
    image: 'https://picsum.photos/seed/promo01/900/540',
  },
  categories: [
    { id: 'hoodie',  name: 'HOODIE COLLECTION', image: 'https://picsum.photos/seed/cat01/800/600' },
    { id: 'tshirt',  name: 'GRAPHIC TEES',       image: 'https://picsum.photos/seed/cat02/800/600' },
    { id: 'pants',   name: 'PANTS',               image: 'https://picsum.photos/seed/cat03/800/600' },
    { id: 'jacket',  name: 'JACKETS',             image: 'https://picsum.photos/seed/cat04/800/600' },
  ],
  bottomBanners: [
    { image: 'https://picsum.photos/seed/bottom1/1600/600', title: 'SONE STYLE', sub: 'STREETWEAR CULTURE' },
    { image: 'https://picsum.photos/seed/bottom2/1600/600', title: 'NEW ERA', sub: 'ESTABLISHED 2024' },
  ],
  telegramChatId: '',
  reviews: [
    { id: '1', name: 'Bold', rating: 5, comment: 'Mash goy materialtai bn.', date: '2024.04.10', status: 'approved' },
    { id: '2', name: 'Sarnai', rating: 4, comment: 'Hurgelt jaahan udaan baisan ch baraa ni taalagdlaa.', date: '2024.04.12', status: 'approved' },
  ],
  coupons: [],
  productCategories: ['HOODIE', 'SET', 'JACKET', 'PANTS', 'ЦҮНХ', 'БУСАД'],
  looks: [],
  specialDrops: [],
};

interface StoreContextType {
  products: Product[];
  orders: Order[];
  settings: SiteSettings;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (o: Order) => void;
  updateOrder: (o: Order) => void;
  updateSettings: (s: SiteSettings) => void;
  addReview: (r: Review) => void;
  updateReview: (r: Review) => void;
  deleteReview: (id: string) => void;
  addLook: (l: Look) => void;
  updateLook: (l: Look) => void;
  deleteLook: (id: string) => void;
  addSpecialDrop: (d: SpecialDrop) => void;
  updateSpecialDrop: (d: SpecialDrop) => void;
  deleteSpecialDrop: (id: string) => void;
  isLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      console.log('SONE: Supabase-оос дата татаж байна...');
      try {
        const { data: pData, error: pErr } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        const { data: sData, error: sErr } = await supabase.from('settings').select('data').eq('id', 'global').single();
        const { data: rData, error: rErr } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        const { data: lData, error: lErr } = await supabase.from('looks').select('*').order('created_at', { ascending: false });
        const { data: sdData, error: sdErr } = await supabase.from('special_drops').select('*').order('sort_order', { ascending: true });
        if (lErr && lErr.code !== '42P01') console.error('Looks load error:', lErr);
        if (sdErr && sdErr.code !== '42P01') console.error('Special drops load error:', sdErr);

        if (pErr) console.error('Products load error:', pErr);
        if (sErr && sErr.code !== 'PGRST116') console.error('Settings load error:', sErr);
        if (rErr) console.error('Reviews load error:', rErr);

        // ── Batch-load orders to bypass 1000-row default limit ──
        let allOrders: any[] = [];
        let from = 0;
        const batchSize = 1000;
        while (true) {
          const { data: batch, error: bErr } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, from + batchSize - 1);
          if (bErr) { console.error('Orders batch error:', bErr); break; }
          if (!batch || batch.length === 0) break;
          allOrders = allOrders.concat(batch);
          if (batch.length < batchSize) break; // last page
          from += batchSize;
        }

        if (pData && pData.length > 0) {
          setProducts(pData);
        } else {
          setProducts(initialProducts);
        }

        if (allOrders.length > 0) {
          const mappedOrders = allOrders.map((o: any) => ({
            ...o,
            customerName: o.customer_name,
            paymentType: o.payment_type,
            receiptImage: o.receipt_image,
            date: o.date || (o.created_at ? new Date(o.created_at).toLocaleString() : '')
          }));
          setOrders(mappedOrders);
        }
        
        const mappedDrops = (sdData && sdData.length > 0)
          ? sdData.map((d: any) => ({ id: d.id, image: d.image, productId: d.product_id }))
          : null;
        const mappedLooks = (lData && lData.length > 0)
          ? lData.map((l: any) => ({ id: l.id, title: l.title, description: l.description, image: l.image, productIds: l.product_ids || [] }))
          : null;

        if (sData) {
          setSettings({ 
            ...initialSettings, 
            ...sData.data, 
            heroSlides: sData.data.heroSlides || initialSettings.heroSlides,
            categories: sData.data.categories || initialSettings.categories,
            bottomBanners: sData.data.bottomBanners || initialSettings.bottomBanners,
            promoBanner: sData.data.promoBanner || initialSettings.promoBanner,
            coupons: sData.data.coupons || initialSettings.coupons,
            productCategories: sData.data.productCategories || initialSettings.productCategories,
            specialDrops: mappedDrops ?? (sData.data.specialDrops || []),
            looks: mappedLooks ?? (sData.data.looks || []),
            reviews: rData || [] 
          });
        } else {
          setSettings({ 
            ...initialSettings, 
            looks: mappedLooks ?? [],
            reviews: rData || [],
            specialDrops: mappedDrops ?? []
          });
        }
        console.log(`SONE: ${allOrders.length} захиалга татагдлаа.`);
      } catch (error) {
        console.error('Supabase load crash:', error);
        setProducts(initialProducts);
        setSettings(initialSettings);
      }
      
      // Minimum loading time for the "wow" animation
      const hasVisited = typeof window !== 'undefined' && sessionStorage.getItem('sone_visited');
      const minTime = hasVisited ? 500 : 1500;
      if (typeof window !== 'undefined' && !hasVisited) {
        sessionStorage.setItem('sone_visited', 'yes');
      }
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);
      
      setTimeout(() => {
        setIsLoaded(true);
      }, remaining);
    }
    const startTime = Date.now();
    loadData();
  }, []);


  const addProduct = async (p: Product) => {
    setProducts(prev => [p, ...prev]);
    const { error } = await supabase.from('products').insert([p]);
    if (error) {
      console.error('Add product error:', error);
    } else {
      // Notify VIP users
      fetch('/api/notify-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: p }),
      }).catch(err => console.error('Notification trigger error:', err));
    }
  };

  const updateProduct = async (p: Product) => {
    setProducts(prev => prev.map(item => item.id === p.id ? p : item));
    const { error } = await supabase.from('products').update(p).eq('id', p.id);
    if (error) console.error('Update product error:', error);
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(item => item.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const addOrder = async (o: Order) => {
    setOrders(prev => [o, ...prev]);
    const { error } = await supabase.from('orders').insert([{
      id: o.id,
      date: o.date,
      customer_name: o.customerName,
      phone: o.phone,
      address: o.address,
      items: o.items,
      total: o.total,
      payment_type: o.paymentType,
      status: o.status,
      receipt_image: (o as any).receiptImage
    }]);
    if (error) console.error('Add order error:', error);
    
    // Send Telegram Notification if Chat ID is configured
    if (settings.telegramChatId) {
      const itemsList = o.items.map(i => `${i.name} (x${i.qty})`).join(', ');
      const msg = `<b>📦 ШИНЭ ЗАХИАЛГА #${o.id}</b>\n\n` +
                  `👤 Хэрэглэгч: ${o.customerName}\n` +
                  `📞 Утас: ${o.phone}\n` +
                  `📍 Хаяг: ${o.address}\n` +
                  `💰 Нийт: ${o.total.toLocaleString()}₮\n` +
                  `💳 Төрөл: ${o.paymentType === 'full' ? 'Бүрэн' : 'Урьдчилгаа'}\n` +
                  `🛒 Бараанууд: ${itemsList}`;
      sendTelegramMessage(msg, settings.telegramChatId);
    }
  };

  const updateOrder = async (o: Order) => {
    setOrders(prev => prev.map(item => item.id === o.id ? o : item));

    // If status set to transit, delete receipt image from Storage
    let receiptToSave = (o as any).receiptImage;
    if (o.status === 'transit' && receiptToSave) {
      try {
        const url = new URL(receiptToSave);
        const pathParts = url.pathname.split('/object/public/receipts/');
        if (pathParts[1]) {
          await supabase.storage.from('receipts').remove([pathParts[1]]);
        }
      } catch (_) {}
      receiptToSave = null;
    }

    const { error } = await supabase.from('orders').update({
      customer_name: o.customerName,
      phone: o.phone,
      address: o.address,
      items: o.items,
      total: o.total,
      payment_type: o.paymentType,
      status: o.status,
      receipt_image: receiptToSave
    }).eq('id', o.id);
    if (error) console.error('Update order error:', error);
  };

  const updateSettings = async (s: SiteSettings) => {
    try {
      setSettings(s);
      const { reviews, ...otherSettings } = s;
      const { error } = await supabase.from('settings').upsert(
        { id: 'global', data: otherSettings },
        { onConflict: 'id' }
      );
      if (error) {
        console.error('Update settings error:', error);
        alert('Хадгалахад алдаа гарлаа: ' + error.message);
      } else {
        console.log('Settings successfully persisted to Supabase');
      }
    } catch (err) {
      console.error('Update settings crash:', err);
    }
  };
  
  const addReview = async (r: Review) => {
    setSettings(prev => ({ ...prev, reviews: [r, ...(prev.reviews || [])] }));
    await supabase.from('reviews').insert([{
      id: r.id,
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      status: r.status,
      date: r.date
    }]);
  };

  const updateReview = async (r: Review) => {
    setSettings(prev => ({ ...prev, reviews: prev.reviews.map(item => item.id === r.id ? r : item) }));
    await supabase.from('reviews').update({
      status: r.status
    }).eq('id', r.id);
  };

  const deleteReview = async (id: string) => {
    setSettings(prev => ({ ...prev, reviews: prev.reviews.filter(r => r.id !== id) }));
    await supabase.from('reviews').delete().eq('id', id);
  };

  const addLook = async (l: Look) => {
    setSettings(prev => ({ ...prev, looks: [l, ...(prev.looks || [])] }));
    const { error } = await supabase.from('looks').insert([{
      id: l.id,
      title: l.title,
      description: l.description || null,
      image: l.image,
      product_ids: l.productIds,
    }]);
    if (error) console.error('addLook error:', error);
  };

  const updateLook = async (l: Look) => {
    setSettings(prev => ({ ...prev, looks: (prev.looks || []).map(item => item.id === l.id ? l : item) }));
    const { error } = await supabase.from('looks').update({
      title: l.title,
      description: l.description || null,
      image: l.image,
      product_ids: l.productIds,
    }).eq('id', l.id);
    if (error) console.error('updateLook error:', error);
  };

  const deleteLook = async (id: string) => {
    setSettings(prev => ({ ...prev, looks: (prev.looks || []).filter(l => l.id !== id) }));
    const { error } = await supabase.from('looks').delete().eq('id', id);
    if (error) console.error('deleteLook error:', error);
  };

  const addSpecialDrop = async (d: SpecialDrop) => {
    const currentDrops = (settings.specialDrops || []);
    setSettings(prev => ({ ...prev, specialDrops: [...(prev.specialDrops || []), d] }));
    const { error } = await supabase.from('special_drops').insert([{
      id: d.id,
      image: d.image,
      product_id: d.productId,
      sort_order: currentDrops.length,
    }]);
    if (error) console.error('addSpecialDrop error:', error);
  };

  const updateSpecialDrop = async (d: SpecialDrop) => {
    setSettings(prev => ({ ...prev, specialDrops: (prev.specialDrops || []).map(item => item.id === d.id ? d : item) }));
    const { error } = await supabase.from('special_drops').update({
      image: d.image,
      product_id: d.productId,
    }).eq('id', d.id);
    if (error) console.error('updateSpecialDrop error:', error);
  };

  const deleteSpecialDrop = async (id: string) => {
    setSettings(prev => ({ ...prev, specialDrops: (prev.specialDrops || []).filter(d => d.id !== id) }));
    const { error } = await supabase.from('special_drops').delete().eq('id', id);
    if (error) console.error('deleteSpecialDrop error:', error);
  };

  const updateSettingsToDb = async (s: SiteSettings) => {
    try {
      const { reviews, looks, ...otherSettings } = s;
      await supabase.from('settings').upsert(
        { id: 'global', data: otherSettings },
        { onConflict: 'id' }
      );
    } catch (err) {
      console.error('updateSettingsToDb error:', err);
    }
  };

  return (
    <StoreContext.Provider value={{
      products, orders, settings,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrder, updateSettings,
      addReview, updateReview, deleteReview,
      addLook, updateLook, deleteLook,
      addSpecialDrop, updateSpecialDrop, deleteSpecialDrop,
      isLoaded
    }}>
      {!isLoaded ? (
        <Preloader />
      ) : children}
    </StoreContext.Provider>
  );
}

function Preloader() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: '#000', zIndex: 9999999, 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Solid Black Background - No grain to prevent flickering */}
      
      {/* Main Content */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        {/* Brand Text with Cinematic Reveal */}
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          color: '#fff', 
          fontSize: 'clamp(48px, 10vw, 100px)', 
          letterSpacing: '25px', 
          margin: 0,
          position: 'relative',
          animation: 'mainTextAnim 3.5s cubic-bezier(0.7, 0, 0.3, 1) forwards'
        }}>
          SONE
        </h1>

        {/* Technical Info */}
        <div style={{ marginTop: '30px', overflow: 'hidden', height: '14px' }}>
          <p style={{
            fontSize: '8px', color: '#444', letterSpacing: '4px', textTransform: 'uppercase',
            animation: 'textScroll 5s linear infinite'
          }}>
            INITIALIZING CULTURE — FETCHING ASSETS — ESTABLISHING CONNECTION — SONE BRAND 2025 —
          </p>
        </div>
      </div>

      {/* Modern Bottom Progress */}
      <div style={{
        position: 'absolute', bottom: '15vh', width: '160px', height: '1px', background: 'rgba(255,255,255,0.05)'
      }}>
        <div style={{ 
          height: '100%', background: '#fff', width: `${percent}%`, 
          boxShadow: '0 0 15px rgba(255,255,255,0.5)', transition: 'width 0.1s linear'
        }} />
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', fontSize: '8px', color: '#333', letterSpacing: '3px' }}>
          <span>{percent}%</span>
        </div>
      </div>

      <style>{`
        @keyframes mainTextAnim {
          0% { letter-spacing: -30px; opacity: 0; filter: blur(15px); transform: scale(0.9); }
          100% { letter-spacing: 25px; opacity: 1; filter: blur(0); transform: scale(1); }
        }
        @keyframes textScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}
