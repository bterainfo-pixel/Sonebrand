'use client';
import { useState } from 'react';
import { useStore, Review } from '@/context/StoreContext';

export default function ReviewsSection() {
  const { settings, addReview } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toLocaleDateString(),
      status: 'pending' // Default to pending for admin approval
    };
    addReview(newReview);
    setFormData({ name: '', rating: 5, comment: '' });
    setIsFormOpen(false);
    alert('Таны сэтгэгдлийг хүлээн авлаа.');
  };

  const approvedReviews = settings.reviews?.filter(r => r.status === 'approved') || [];

  return (
    <section className="reviews-container" style={{ background: '#fff', padding: '100px 20px', borderTop: '1px solid #eee', fontFamily: 'var(--font-main)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="reviews-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <div>
            <h2 className="reviews-title" style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '2px', marginBottom: '16px' }}>REVIEWS</h2>
            <p style={{ fontSize: '12px', color: '#666', fontWeight: 600, letterSpacing: '1px' }}>ХЭРЭГЛЭГЧДИЙН СЭТГЭГДЭЛ</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn-3d"
            style={{ background: '#000', color: '#fff', border: 'none', padding: '16px 32px', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', cursor: 'pointer' }}
          >
            СЭТГЭГДЭЛ ҮЛДЭЭХ
          </button>
        </div>

        <div
          className="reviews-scroll-track"
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(2, auto)',
            gridAutoFlow: 'column',
            gridAutoColumns: '320px',
            gap: '24px',
            overflowX: 'auto',
            paddingBottom: '16px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch' as any,
          }}
        >
          {approvedReviews.map((review) => (
            <div
              key={review.id}
              className="review-card"
              style={{
                border: '1px solid #eee',
                padding: '32px 28px',
                transition: 'all 0.3s',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < review.rating ? '#000' : '#eee', fontSize: '14px' }}>★</span>
                ))}
              </div>
              <p style={{
                fontSize: '13px',
                lineHeight: '1.75',
                color: '#333',
                marginBottom: '20px',
                fontStyle: 'italic',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical' as any,
                overflow: 'hidden',
                flex: 1,
              }}>
                &ldquo;{review.comment}&rdquo;
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1px' }}>{review.name.toUpperCase()}</p>
                <p style={{ fontSize: '10px', color: '#999' }}>{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {isFormOpen && (
          <div className="review-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="review-modal-content" style={{ background: '#fff', width: '100%', maxWidth: '500px', padding: '40px', position: 'relative' }}>
              <button onClick={() => setIsFormOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
              <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '32px', letterSpacing: '1px' }}>СЭТГЭГДЭЛ ҮЛДЭЭХ</h3>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, marginBottom: '8px', display: 'block' }}>ТАНЫ НЭР</label>
                  <input 
                    required className="input-field" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '16px', border: '1px solid #eee', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, marginBottom: '8px', display: 'block' }}>ҮНЭЛГЭЭ</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} type="button" 
                        onClick={() => setFormData({...formData, rating: star})}
                        style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: star <= formData.rating ? '#000' : '#eee' }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, marginBottom: '8px', display: 'block' }}>СЭТГЭГДЭЛ</label>
                  <textarea 
                    required rows={4}
                    value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}
                    style={{ width: '100%', padding: '16px', border: '1px solid #eee', outline: 'none', resize: 'none' }}
                  />
                </div>
                <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '20px', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', cursor: 'pointer' }}>ИЛГЭЭХ</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .reviews-scroll-track::-webkit-scrollbar { height: 3px; }
        .reviews-scroll-track::-webkit-scrollbar-track { background: #f5f5f5; }
        .reviews-scroll-track::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
        .review-card:hover { border-color: #ccc !important; }
        @media (max-width: 768px) {
          .reviews-container { padding: 60px 16px !important; }
          .reviews-header { flex-direction: column !important; align-items: flex-start !important; gap: 20px; margin-bottom: 32px !important; }
          .reviews-title { font-size: 28px !important; }
          .reviews-scroll-track {
            grid-template-rows: repeat(1, auto) !important;
            grid-auto-columns: 82vw !important;
          }
          .review-card { padding: 24px 20px !important; }
          .review-modal-content { padding: 30px 20px !important; }
        }
      `}</style>
    </section>
  );
}
