import React from 'react';
import { CheckCircle2, MessageCircle, HelpCircle } from 'lucide-react';

const defaultFeesList = [
  {
    id: "f1",
    programName: "Kids Taekwondo",
    monthly: "₹1,800",
    yearly: "₹10,000",
    regFee: "₹3500 (One-time)",
    notes: "Excluding uniform"
  },
  {
    id: "f2",
    programName: "Advanced Training",
    monthly: "₹1,800",
    yearly: "₹15,000",
    regFee: "₹3500 (One-time)",
    notes: "Excluding uniform"
  },
  {
    id: "f3",
    programName: "Competition Training",
    monthly: "₹2,000",
    yearly: "₹12,000",
    regFee: "₹3,500 (One-time)",
    notes: "Excluding uniform"
  },
  {
    id: "f4",
    programName: "Self Defense",
    monthly: "₹800",
    yearly: "₹12,000",
    regFee: "₹3,500 (One-time)",
    notes: "Excluding uniform"
  },
  {
    id: "f5",
    programName: "VR Taekwondo Experience",
    monthly: "₹3,000",
    yearly: "₹12,000",
    regFee: "₹3,500 (One-time)",
    notes: "Excluding uniform"
  }
];

export default function FeesPage({ fees = [], settings, payment, setActivePage, onOpenJoinModal }) {
  const whatsappNumber = settings?.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, '') : '919876543210';
  const activeFees = fees && fees.length > 0 ? fees : defaultFeesList;

  const cleanMonthly = (val) => (val || '').replace(/\s*\/\s*month/gi, '').trim();

  const deduplicatedFees = [];
  const seenPlans = new Set();
  for (const plan of activeFees) {
    const key = (plan.programName || '').toLowerCase().trim();
    if (!seenPlans.has(key)) {
      seenPlans.add(key);
      deduplicatedFees.push(plan);
    }
  }

  return (
    <div className="fees-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">TRANSPARENT PRICING</span>
          <h1>ACADEMY FEES & MEMBERSHIPS</h1>
          <p>Simple, flexible monthly and annual martial arts plans with no hidden charges.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="fees-grid">
            {deduplicatedFees.map((plan, idx) => (
              <div key={plan.id || idx} className={`card fee-card ${idx === 1 ? 'featured' : ''}`}>
                {idx === 1 && <div className="featured-banner">MOST POPULAR</div>}
                
                <div className="fee-header">
                  <span className="badge badge-blue mb-2">{plan.programName}</span>
                  <div className="fee-price-large">
                    {cleanMonthly(plan.monthly)} <span>/ month</span>
                  </div>
                  <p className="reg-fee-text">Registration Fee: <strong>{plan.regFee}</strong></p>
                </div>

                <div className="fee-body">
                  <div className="fee-tier-list">
                    <div className="fee-tier">
                      <span>Monthly Plan</span>
                      <strong>{cleanMonthly(plan.monthly)}</strong>
                    </div>
                    <div className="fee-tier gold">
                      <span>Yearly Plan</span>
                      <strong>{plan.yearly}</strong>
                    </div>
                  </div>

                  <div className="fee-notes" style={{ margin: '16px 0 20px', padding: '10px 14px', background: '#fff8f6', border: '1px solid #fee2e2', borderRadius: '8px', color: '#dc2626', fontWeight: '600', fontSize: '0.9rem', textAlign: 'center' }}>
                    <span>({plan.notes || 'Excluding uniform'})</span>
                  </div>

                  <div className="fee-actions">
                    <button onClick={() => onOpenJoinModal && onOpenJoinModal(plan.programName)} className="btn btn-primary-red w-full">
                      ENQUIRE NOW
                    </button>
                    <button 
                      onClick={() => setActivePage && setActivePage('payment')} 
                      className="btn w-full"
                      style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', fontWeight: '700', padding: '10px', fontSize: '0.9rem', borderRadius: '8px' }}
                    >
                      ₹ PAY & SUBMIT UTR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Payment Banner matching screenshot */}
          <div className="quick-payment-banner" style={{ background: '#0b192c', borderRadius: '20px', padding: '36px 40px', marginTop: '48px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <span className="badge badge-gold mb-2">QUICK PAYMENT</span>
              <h2 style={{ fontSize: '2.2rem', margin: '8px 0', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>Ready to Pay?</h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 20px', maxWidth: '500px', lineHeight: '1.5' }}>
                Scan our UPI QR code or use UPI ID to pay your fees instantly. Safe, fast, and hassle-free.
              </p>
              <button 
                onClick={() => setActivePage && setActivePage('payment')} 
                className="btn btn-primary-red" 
                style={{ padding: '14px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
              >
                ₹ PAY NOW →
              </button>
            </div>
            <div style={{ background: '#ffffff', padding: '16px 24px', borderRadius: '16px', textAlign: 'center', color: '#1e293b' }}>
              <img 
                src={payment?.qrCodeImage || "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=dtaekwondo@upi"} 
                alt="UPI QR Code" 
                style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '8px', display: 'block', margin: '0 auto' }} 
              />
              <p style={{ margin: '8px 0 0', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Scan with any UPI app</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .fees-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          align-items: stretch;
        }
        .fee-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-top: 4px solid var(--primary-red);
        }
        .fee-card.featured {
          border-top: 4px solid var(--accent-gold);
          box-shadow: var(--shadow-lg);
          transform: scale(1.03);
        }
        .featured-banner {
          background: var(--accent-gold);
          color: #ffffff;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 1px;
          text-align: center;
          padding: 4px 0;
        }
        .fee-header {
          padding: 32px 24px 20px;
          text-align: center;
          background: #f8fafc;
          border-bottom: 1px solid var(--border-color);
        }
        .fee-price-large {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--primary-red);
          line-height: 1;
          margin: 12px 0 4px;
        }
        .fee-price-large span {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 600;
        }
        .reg-fee-text {
          font-size: 0.85rem;
          color: #4b5563;
        }
        .fee-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .fee-tier-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .fee-tier {
          display: flex;
          justify-content: space-between;
          padding: 10px 14px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.9rem;
        }
        .fee-tier.highlight {
          background: var(--secondary-blue-light);
          color: var(--secondary-blue);
        }
        .fee-tier.gold {
          background: var(--accent-gold-light);
          color: var(--accent-gold-dark);
        }
        .fee-notes {
          font-size: 0.82rem;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
          font-style: italic;
        }
        .fee-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
          flex: 1;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: #374151;
          font-weight: 600;
        }
        .fee-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn-whatsapp {
          background: #25D366;
          color: #ffffff;
          border: none;
          font-family: var(--font-heading);
          font-weight: 700;
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-whatsapp:hover {
          background: #1eb956;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .fees-grid { grid-template-columns: repeat(2, 1fr); }
          .fee-card.featured { transform: none; }
        }
        @media (max-width: 640px) {
          .fees-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
