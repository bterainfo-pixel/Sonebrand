import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — SONE BRAND',
  description: 'Түгээмэл асуулт хариулт — захиалга, хүргэлт, pre-order, буцаалт.',
};

const faqs = [
  {
    q: 'Pre-order гэж яаж ажилладаг вэ?',
    a: 'Pre-order нь бараа нь ирэхийн өмнө урьдчилан захиалах боломж юм. Та захиалгаа өгч, урьдчилгаа төлбөр хийснээр бараа ирмэгц автоматаар хүргэлтэнд явна. Хугацаа ихэвчлэн 7–14 хоног байна.',
  },
  {
    q: 'Хүргэлт хэрхэн ажилладаг вэ?',
    a: 'Улаанбаатар хот дотор 1–2 хоногт хүргэнэ. Орон нутагт 3–5 хоног. 80,000₮-с дээш захиалгад хүргэлт үнэгүй.',
  },
  {
    q: 'Буцааж болох уу?',
    a: 'Буцаалт байхгүй тул та сонголтоо зөв хийнэ үү',
  },
  {
    q: 'Ямар хэмжээний бараа байдаг вэ?',
    a: 'XS, S, M, L, XL, XXL хэмжээ байдаг. Хэмжээний хүснэгтийг барааны хуудаснаас харж болно.',
  },
  {
    q: 'Төлбөрийн ямар аргуудыг хүлээж авдаг вэ?',
    a: 'Банкны шилжүүлгээр төлбөр хийх боломжтой.',
  },
  {
    q: 'Захиалгаа хэрхэн хянах вэ?',
    a: 'Захиалга баталгаажсаны дараа и-мэйл болон утсандаа мэдэгдэл ирнэ. Захиалгын дугаараараа манай Logistic хэсгээс хянах боломжтой.',
  },
  {
    q: 'Сошиал медиад хаана олдох вэ?',
    a: 'Instagram, TikTok, Facebook дээр @SONEBRAND нэрээр олдоно.',
  },
];

export default function FAQPage() {
  return (
    <div style={{ background: '#fff', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#000', color: '#fff', padding: '64px 40px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-main)', fontSize: '10px', fontWeight: 600, letterSpacing: '4px', color: '#666', marginBottom: '12px' }}>
            HELP CENTER
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '3px', lineHeight: 1 }}>
            FAQ
          </h1>
        </div>
      </div>

      {/* FAQ list */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 40px' }}>
        {faqs.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: '#000', color: '#fff', padding: '60px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-main)', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', color: '#888', marginBottom: '14px' }}>
          ХАРИУЛТ ОЛДСОНГҮЙ?
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '2px', marginBottom: '28px' }}>
          БИДЭНТЭЙ ХОЛБОО БАРЬ
        </h2>
        <a href="/contact" style={{
          display: 'inline-block',
          border: '1px solid #fff',
          color: '#fff',
          padding: '14px 36px',
          fontFamily: 'var(--font-main)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '3px',
        }}>
          ХОЛБОО БАРИХ
        </a>
      </div>
    </div>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  return (
    <>
      <details className="faq-item" style={{ borderBottom: '1px solid #e8e8e8', padding: '24px 0' }}>
        <summary className="faq-summary">
          <span style={{ fontFamily: 'var(--font-main)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.3px', color: '#000' }}>
            {String(index + 1).padStart(2, '0')}. {q}
          </span>
          <span className="faq-icon">+</span>
        </summary>
        <p style={{ fontFamily: 'var(--font-main)', fontSize: '13px', color: '#555', lineHeight: 1.8, paddingTop: '16px', letterSpacing: '0.2px' }}>
          {a}
        </p>
      </details>
      <style>{`
        .faq-item { list-style: none; cursor: pointer; }
        .faq-item[open] .faq-icon { transform: rotate(45deg); }
        .faq-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          list-style: none;
          gap: 20px;
        }
        .faq-summary::-webkit-details-marker { display: none; }
        .faq-icon {
          font-size: 22px;
          color: #000;
          transition: transform 0.25s;
          flex-shrink: 0;
          font-weight: 300;
        }
      `}</style>
    </>
  );
}
