import React from 'react';
import { Calendar, Clock, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ProgramsPage({ programs = [], onOpenJoinModal }) {
  return (
    <div className="programs-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">WORLD TAEKWONDO CURRICULUM</span>
          <h1>OUR TRAINING PROGRAMS</h1>
          <p>Structured belt levels, age-appropriate conditioning, and Olympic sparring tracks.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="programs-detail-list">
            {programs.map((prog, idx) => (
              <div key={prog.id} className={`card program-detail-card ${idx % 2 === 1 ? 'reverse' : ''}`}>
                <div className="prog-detail-img">
                  <img src={prog.image} alt={prog.name} />
                  <span className="badge badge-gold prog-age-badge">{prog.ageGroup}</span>
                </div>

                <div className="prog-detail-content">
                  <span className="badge badge-blue mb-2">MODULE {idx + 1}</span>
                  <h2>{prog.name}</h2>
                  <p className="prog-description">{prog.description}</p>

                  <div className="prog-specs-grid">
                    <div className="spec-item">
                      <Calendar size={18} className="text-red" />
                      <div>
                        <strong>Days:</strong>
                        <span>{prog.days}</span>
                      </div>
                    </div>

                    <div className="spec-item">
                      <Clock size={18} className="text-red" />
                      <div>
                        <strong>Time:</strong>
                        <span>{prog.time}</span>
                      </div>
                    </div>

                    <div className="spec-item">
                      <UserCheck size={18} className="text-red" />
                      <div>
                        <strong>Duration:</strong>
                        <span>{prog.duration}</span>
                      </div>
                    </div>

                    <div className="spec-item">
                      <ShieldCheck size={18} className="text-red" />
                      <div>
                        <strong>Fee:</strong>
                        <span className="fee-highlight">{prog.fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="prog-actions">
                    <button onClick={() => onOpenJoinModal && onOpenJoinModal(prog.name)} className="btn btn-primary-red">
                      ENQUIRE NOW <ArrowRight size={16} />
                    </button>
                    <button onClick={() => onOpenJoinModal && onOpenJoinModal(prog.name)} className="btn btn-outline-dark">
                      BOOK A FREE TRIAL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .programs-detail-list {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .program-detail-card {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 0;
          overflow: hidden;
        }
        .program-detail-card.reverse {
          grid-template-columns: 1.2fr 1fr;
        }
        .program-detail-card.reverse .prog-detail-img {
          order: 2;
        }
        .prog-detail-img {
          position: relative;
          height: 100%;
          min-height: 340px;
        }
        .prog-detail-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .prog-age-badge {
          position: absolute;
          top: 16px;
          left: 16px;
        }
        .prog-detail-content {
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .prog-detail-content h2 {
          font-size: 2rem;
          margin-bottom: 12px;
        }
        .prog-description {
          font-size: 1.05rem;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .prog-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #f8fafc;
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 28px;
        }
        .spec-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .spec-item strong {
          display: block;
          font-size: 0.82rem;
          color: #6b7280;
          text-transform: uppercase;
        }
        .spec-item span {
          font-size: 0.95rem;
          color: #1f2937;
          font-weight: 600;
        }
        .fee-highlight {
          color: var(--primary-red) !important;
          font-weight: 800 !important;
        }
        .prog-actions {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 900px) {
          .program-detail-card, .program-detail-card.reverse {
            grid-template-columns: 1fr;
          }
          .program-detail-card.reverse .prog-detail-img {
            order: 0;
          }
          .prog-detail-content {
            padding: 28px;
          }
        }
        @media (max-width: 640px) {
          .prog-specs-grid {
            grid-template-columns: 1fr;
          }
          .prog-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
