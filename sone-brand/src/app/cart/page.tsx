'use client';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState } from 'react';
import { sendTelegramMessage } from '@/lib/telegram';

export default function CartPage() {
  const { cart, total, updateQty, removeFromCart, clearCart } = useCart();
  const { addOrder, settings } = useStore();
  const [ordered, setOrdered] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: Info, 2: Payment
  const [orderId, setOrderId] = useState('');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<'full' | 'half'>('full');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const shippingFee = total >= 50000 ? 0 : 5000;
  const grandTotal = total + shippingFee;
  const halfAmount = Math.ceil(grandTotal / 2);

  // Coupon Logic: 10% discount for FULL payments only
  const discount = (appliedCoupon && paymentAmount === 'full') ? Math.floor(grandTotal * 0.1) : 0;
  const finalGrandTotal = grandTotal - discount;

  // Defined early to avoid ReferenceError before early returns
  const nowISO = new Date().toISOString();
  const displayDate = new Date().toLocaleDateString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `receipt_${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('receipts')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      setReceiptFile(urlData.publicUrl);
    } catch (err) {
      console.error('Receipt upload error:', err);
      alert('Зураг оруулахад алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Дансны дугаар хуулагдлаа: ' + text);
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.toUpperCase().trim();
    if (!code) return;
    
    setCouponError('Шалгаж байна...');
    
    try {
      // Fetch latest from Supabase to avoid stale local state
      const { data: sData } = await supabase.from('settings').select('data').eq('id', 'global').single();
      const latestCoupons = sData?.data?.coupons || [];
      
      if (latestCoupons.includes(code)) {
        setAppliedCoupon(code);
        setCouponError('');
      } else {
        setCouponError('БУРУУ ЭСВЭЛ АШИГЛАГДСАН КУПОН');
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error('Coupon check error:', err);
      setCouponError('Сүлжээний алдаа. Дахин оролдоно уу.');
    }
  };

  if (ordered && lastOrder) {
    return (
      <div style={{ background: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', fontFamily: 'var(--font-main)' }}>
        <div className="fade-up">
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '16px', letterSpacing: '2px' }}>ЗАХИАЛГА БАТАЛГААЖЛАА</h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
            Таны захиалгыг хүлээн авлаа. Бид төлбөр шалгагдсаны дараа 5-8 хоногийн дотор хүргэж өгөх болно.
          </p>
          <div id="receipt" style={{ background: '#f5f5f5', padding: '24px', border: '1px solid #eee', textAlign: 'left', marginBottom: '40px', maxWidth: '440px', margin: '0 auto 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '12px', marginBottom: '12px' }}>
               <h3 style={{ fontSize: '11px', fontWeight: 900 }}>SONE BRAND RECEIPT</h3>
               <span style={{ fontSize: '10px', color: '#999' }}>{displayDate}</span>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>Хэрэглэгч: {lastOrder.customerName}</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>Утас: {lastOrder.phone}</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>Төлбөр: {lastOrder.paymentType === 'full' ? 'Бүрэн төлөлт' : 'Урьдчилгаа 50%'}</p>
            
            <div style={{ borderTop: '1px dashed #ccc', paddingTop: '12px' }}>
               {lastOrder.items.map((item: any, i: number) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                   <span>{item.qty}x {item.name} ({item.size})</span>
                   <span>{(item.price * item.qty).toLocaleString()}₮</span>
                 </div>
               ))}
            </div>
            <div style={{ borderTop: '1px solid #000', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
               <span>НИЙТ ТӨЛӨХ:</span>
               <span>{lastOrder.total.toLocaleString()}₮</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => window.print()} style={{ background: '#fff', color: '#000', border: '1px solid #000', padding: '16px 30px', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>ХЭВЛЭХ</button>
            <Link href="/" className="btn-3d" style={{ background: '#000', color: '#fff', padding: '16px 40px', display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '2px' }}>НҮҮР ХУУДАС</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ background: '#fff', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'var(--font-main)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '24px', letterSpacing: '2px' }}>САГС ХООСОН БАЙНА</h1>
        <Link href="/products" className="btn-3d" style={{ background: '#000', color: '#fff', padding: '16px 44px', fontSize: '11px', fontWeight: 700, letterSpacing: '2px' }}>ДЭЛГҮҮР ХЭСЭХ</Link>
      </div>
    );
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderId(Math.random().toString(36).substr(2, 9).toUpperCase());
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async () => {
    const orderData: any = {
      id: orderId,
      date: nowISO,          // ISO format for reliable day-diff in admin
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      items: cart,
      total: paymentAmount === 'full' ? finalGrandTotal : halfAmount,
      paymentType: paymentAmount,
      status: 'pending',
      receiptImage: receiptFile
    };

    // Remove used coupon from settings if applied
    if (appliedCoupon && paymentAmount === 'full') {
      const remainingCoupons = settings.coupons.filter((c: string) => c !== appliedCoupon);
      const newSettings = { ...settings, coupons: remainingCoupons };
      await supabase.from('settings').update({ data: newSettings }).eq('id', 'global');
    }

    setLastOrder(orderData); // Save before clear
    await addOrder(orderData);

    // Telegram Notification
    const itemsList = cart.map(i => `• ${i.qty}x ${i.name} (${i.size})`).join('\n');
    const msg = `
<b>🛍 ШИНЭ ЗАХИАЛГА #${orderId}</b>

<b>Хэрэглэгч:</b> ${formData.name}
<b>Утас:</b> ${formData.phone}
<b>Хаяг:</b> ${formData.address}
<b>Төлбөр:</b> ${paymentAmount === 'full' ? 'Бүрэн' : '50%'} (${orderData.total.toLocaleString()}₮)
${appliedCoupon ? `<b>🎫 КУПОН:</b> ${appliedCoupon} (10% ХЯМДРАЛ)` : ''}

<b>Бараанууд:</b>
${itemsList}

<b>Нийт дүн:</b> ${grandTotal.toLocaleString()}₮
<b>Баримт:</b> ${receiptFile ? 'Хавсаргасан' : 'Байхгүй'}
    `.trim();

    await sendTelegramMessage(msg, settings.telegramChatId || '');

    setOrdered(true);
    clearCart();
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ background: '#fff', minHeight: '90vh', fontFamily: 'var(--font-main)' }}>
      {/* Header with Step Indicator */}
      <div style={{ background: '#000', color: '#fff', padding: '60px 40px 80px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '4px', marginBottom: '40px' }}>
            CHECKOUT
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '1px', background: '#333', zIndex: 1 }}></div>
            <div style={{ flex: 1, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 1 ? '#fff' : '#1a1a1a', color: step >= 1 ? '#000' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, border: '1px solid #333' }}>1</div>
              <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1px', color: step >= 1 ? '#fff' : '#666' }}>МЭДЭЭЛЭЛ</span>
            </div>
            <div style={{ flex: 1, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 2 ? '#fff' : '#1a1a1a', color: step >= 2 ? '#000' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, border: '1px solid #333' }}>2</div>
              <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1px', color: step >= 2 ? '#fff' : '#666' }}>ТӨЛБӨР</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cart-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 40px 100px' }}>
        <div className="cart-layout" style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
          
          {/* Left: Summary */}
          <div className="cart-summary-section" style={{ flex: '1.2' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '2px', marginBottom: '40px', borderBottom: '1px solid #000', paddingBottom: '20px' }}>
              {step === 1 ? `САГСАН ДАХЬ БАРААНУУД (${cart.length})` : 'ЗАХИАЛГЫН ХУРААНГУЙ'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cart.map(item => (
                <div key={`${item.id}-${item.size}-${item.color}`} style={{ display: 'flex', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid #f9f9f9' }}>
                  <div style={{ width: '80px', aspectRatio: '3/4', overflow: 'hidden', background: '#f5f5f5' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px' }}>{item.name}</h3>
                      <p style={{ fontSize: '13px', fontWeight: 800 }}>{(item.price * item.qty).toLocaleString()}₮</p>
                    </div>
                    <p style={{ fontSize: '10px', color: '#999', marginBottom: '12px', letterSpacing: '1px' }}>{item.size.toUpperCase()} / {item.color?.toUpperCase()}</p>
                    {step === 1 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', border: '1px solid #eee', alignItems: 'center' }}>
                          <button onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)} style={{ width: '32px', height: '32px', fontSize: '16px', background: '#fff', border: 'none' }}>−</button>
                          <span style={{ width: '36px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)} style={{ width: '32px', height: '32px', fontSize: '16px', background: '#fff', border: 'none' }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size, item.color)} style={{ fontSize: '9px', fontWeight: 700, color: '#999', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer', letterSpacing: '1px' }}>УСТГАХ</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '40px', background: '#fcfcfc', padding: '24px', border: '1px solid #f5f5f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Нийт дүн</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{total.toLocaleString()}₮</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Хүргэлт</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: shippingFee === 0 ? '#10b981' : '#000' }}>
                  {shippingFee === 0 ? 'ҮНЭГҮЙ' : `${shippingFee.toLocaleString()}₮`}
                </span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#10b981' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Купон хөнгөлөлт (10%)</span>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>-{discount.toLocaleString()}₮</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '1px' }}>ЭЦСИЙН ДҮН</span>
                <span style={{ fontSize: '20px', fontWeight: 900 }}>{(paymentAmount === 'full' ? finalGrandTotal : grandTotal).toLocaleString()}₮</span>
              </div>
            </div>
          </div>

          {/* Right: Steps Content */}
          <div className="cart-form-section" style={{ flex: '1' }}>

            {step === 1 ? (
              <form onSubmit={handleNextStep} style={{ background: '#fff', border: '1px solid #000', padding: '40px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '3px', marginBottom: '40px', textAlign: 'center' }}>ХҮРГЭЛТИЙН МЭДЭЭЛЭЛ</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#999', letterSpacing: '2px', marginBottom: '8px', display: 'block' }}>ОВОГ НЭР</label>
                    <input
                      type="text" required placeholder="Нэрээ оруулна уу"
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', background: '#f9f9f9', border: '1px solid #eee', padding: '16px', fontSize: '13px', fontWeight: 600, outline: 'none', borderRadius: '0', fontFamily: 'var(--font-main)' }}
                    />
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#999', letterSpacing: '2px', marginBottom: '8px', display: 'block' }}>УТАСНЫ ДУГААР</label>
                    <input
                      type="tel" required placeholder="8888-8888"
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', background: '#f9f9f9', border: '1px solid #eee', padding: '16px', fontSize: '13px', fontWeight: 600, outline: 'none', borderRadius: '0', fontFamily: 'var(--font-main)' }}
                    />
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#999', letterSpacing: '2px', marginBottom: '8px', display: 'block' }}>ХҮРГЭЛТИЙН ХАЯГ</label>
                    <textarea
                      required rows={3} placeholder="Дүүрэг, Хороо, Байр, Тоот..."
                      value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', background: '#f9f9f9', border: '1px solid #eee', padding: '16px', fontSize: '13px', fontWeight: 600, outline: 'none', borderRadius: '0', resize: 'none', fontFamily: 'var(--font-main)' }}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-3d" style={{ width: '100%', background: '#000', color: '#fff', padding: '20px', fontSize: '12px', fontWeight: 800, letterSpacing: '3px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-main)' }}>
                  ТӨЛБӨР РҮҮ ШИЛЖИХ →
                </button>
              </form>
            ) : (
              <div style={{ background: '#fff', border: '1px solid #000', padding: '40px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '3px', marginBottom: '40px', textAlign: 'center' }}>ТӨЛБӨРИЙН СОНГОЛТ</h2>

                {/* Coupon Input */}
                <div style={{ marginBottom: '32px', borderBottom: '1px solid #f0f0f0', paddingBottom: '32px' }}>
                  <label style={{ fontSize: '9px', fontWeight: 800, color: '#999', letterSpacing: '2px', marginBottom: '8px', display: 'block' }}>КУПОН КОД (10% ХЯМДРАЛ)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Жишээ: SONE10"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      style={{ flex: 1, background: '#f9f9f9', border: '1px solid #eee', padding: '14px', fontSize: '13px', fontWeight: 700, outline: 'none', textTransform: 'uppercase' }}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      style={{ padding: '0 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 800 }}
                    >
                      ШАЛГАХ
                    </button>
                  </div>
                  {couponError && <p style={{ fontSize: '10px', color: '#ef4444', marginTop: '8px', fontWeight: 700 }}>{couponError}</p>}
                  {appliedCoupon && <p style={{ fontSize: '10px', color: '#10b981', marginTop: '8px', fontWeight: 700 }}>✓ КУПОН АМЖИЛТТАЙ: {appliedCoupon}</p>}
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setPaymentAmount('full')}
                      style={{ flex: 1, padding: '20px', border: paymentAmount === 'full' ? '2px solid #000' : '1px solid #eee', background: paymentAmount === 'full' ? '#fcfcfc' : '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font-main)' }}
                    >
                      <p style={{ fontSize: '9px', fontWeight: 800, color: '#999', letterSpacing: '1px', marginBottom: '8px' }}>100% ТӨЛӨЛТ</p>
                      <p style={{ fontSize: '15px', fontWeight: 900 }}>{finalGrandTotal.toLocaleString()}₮</p>
                      {discount > 0 && <p style={{ fontSize: '9px', color: '#10b981', fontWeight: 800, marginTop: '4px' }}>-{discount.toLocaleString()}₮ хямдарсан</p>}
                    </button>
                    <button
                      onClick={() => setPaymentAmount('half')}
                      style={{ flex: 1, padding: '20px', border: paymentAmount === 'half' ? '2px solid #000' : '1px solid #eee', background: paymentAmount === 'half' ? '#fcfcfc' : '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font-main)' }}
                    >
                      <p style={{ fontSize: '9px', fontWeight: 800, color: '#999', letterSpacing: '1px', marginBottom: '8px' }}>50% УРЬДЧИЛГАА</p>
                      <p style={{ fontSize: '15px', fontWeight: 900 }}>{halfAmount.toLocaleString()}₮</p>
                      {appliedCoupon && <p style={{ fontSize: '9px', color: '#999', marginTop: '4px' }}>(Купон ашиглах боломжгүй)</p>}
                    </button>
                  </div>
                </div>

                <div style={{ background: '#000', color: '#fff', padding: '32px', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#555', marginBottom: '16px' }}>ШИЛЖҮҮЛЭХ ДАНС</p>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>БАНК</p>
                      <p style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '1px' }}>ГОЛОМТ БАНК</p>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>ДАНСНЫ ДУГААР (ДАРЖ ХУУЛАХ)</p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <p onClick={() => handleCopy('790015001165170620')} style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer', textDecoration: 'underline' }}>790015001165170620</p>
                        <p onClick={() => handleCopy('1165170620')} style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer', textDecoration: 'underline' }}>1165170620</p>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>ХҮЛЭЭН АВАГЧ</p>
                      <p style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '1px' }}>БАТБОЛД</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f9f9f9', padding: '20px', border: '1px solid #eee', marginBottom: '30px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 800, color: '#999', letterSpacing: '1px', marginBottom: '8px' }}>ГҮЙЛГЭЭНИЙ УТГА</p>
                  <p style={{ fontSize: '13px', fontWeight: 700 }}>{formData.phone}</p>
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#000', marginBottom: '12px', display: 'block', letterSpacing: '1px' }}>ГҮЙЛГЭЭНИЙ БАРИМТ ХАВУУЛАХ *</label>
                  <label style={{ display: 'block', background: '#f9f9f9', border: `1px dashed ${uploading ? '#f5a623' : receiptFile ? '#10b981' : '#ccc'}`, padding: '30px', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer', transition: 'border-color 0.2s' }}>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: uploading ? '#f5a623' : receiptFile ? '#10b981' : '#666' }}>
                      {uploading ? 'ОРУУЛЖ БАЙНА...' : receiptFile ? '✓ БАРИМТ ОРСОН (ДАРЖ СОЛИХ)' : 'ДАРЖ БАРИМТЫН ЗУРАГ ОРУУЛАХ'}
                    </span>
                  </label>
                  {!receiptFile && <p style={{ fontSize: '10px', color: '#f00', marginTop: '8px' }}>Баримт оруулаагүй бол захиалга баталгаажихгүй!</p>}
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={!receiptFile || uploading}
                  className="btn-3d"
                  style={{ width: '100%', background: receiptFile && !uploading ? '#000' : '#ccc', color: '#fff', padding: '24px', fontSize: '13px', fontWeight: 900, letterSpacing: '3px', border: 'none', cursor: receiptFile && !uploading ? 'pointer' : 'not-allowed' }}
                >
                  ТӨЛБӨР ТӨЛСӨН / ИЛГЭЭХ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .cart-layout { gap: 30px !important; }
        }
        @media (max-width: 768px) {
          .cart-container { padding: 0 20px 60px !important; }
          .cart-layout { flex-direction: column !important; }
          .cart-summary-section, .cart-form-section { flex: 1 !important; width: 100% !important; }
          .cart-summary-section { margin-bottom: 40px; }
          .cart-form-section > form, .cart-form-section > div { padding: 30px 20px !important; }
        }
      ` }} />
    </div>
  );
}
