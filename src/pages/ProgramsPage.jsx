import React from 'react';
import { Calendar, Clock, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

const defaultProgramsList = [
  {
    id: "p1",
    name: "Kids Taekwondo Training Program",
    description: "Designed for young children to build discipline, physical coordination, confidence, focus, and fundamental martial arts movement in a fun, safe environment.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    ageGroup: "AGES 5 - 12",
    days: "Mon, Wed, Fri",
    time: "4:30 PM - 5:30 PM",
    duration: "60 mins per session",
    fee: "₹1,800 / month"
  },
  {
    id: "p2",
    name: "Advanced Training Program",
    description: "Intense regimen for color belt students aiming for Black Belt proficiency, mastering complex kicking combinations, advanced forms, and tactical sparring.",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
    ageGroup: "GREEN BELT & ABOVE",
    days: "Mon to Fri",
    time: "6:30 PM - 7:45 PM",
    duration: "75 mins per session",
    fee: "₹2,000 / month"
  },
  {
    id: "p3",
    name: "Competition Training",
    description: "Intensive training focused on advanced Kyorugi (Sparring) and Poomsae (Forms) techniques, competition strategies, speed, agility, precision, and fitness. Designed to prepare athletes for state, national, and international-level competitions.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
    ageGroup: "SELECTED ATHLETES",
    days: "Daily & Weekends",
    time: "6:00 AM - 8:00 AM",
    duration: "120 mins per session",
    fee: "₹2,000 / month"
  },
  {
    id: "p4",
    name: "Self Defense Training Program for Women",
    description: "Practical real-world self-defense techniques, situational awareness, escape tactics, and joint locks for safety and confidence.",
    image: "https://images.unsplash.com/photo-1564415300397-6a4a15998a69?auto=format&fit=crop&w=800&q=80",
    ageGroup: "ALL AGES",
    days: "Sat & Sun",
    time: "8:00 AM - 9:30 AM",
    duration: "90 mins per session",
    fee: "₹800 / month"
  },
  {
    id: "p5",
    name: "VR Taekwondo Experience",
    description: "Experience Taekwondo in an immersive virtual environment, combining modern VR technology with interactive training to make learning engaging, realistic, and exciting.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    ageGroup: "18+ YEARS",
    days: "Mon, Wed, Fri",
    time: "4:30 PM - 5:30 PM",
    duration: "60 mins",
    fee: "₹2,000 / month"
  }
];

export default function ProgramsPage({ programs = [], onOpenJoinModal }) {
  const displayPrograms = programs && programs.length > 0 ? programs : defaultProgramsList;

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
            {displayPrograms.map((prog, idx) => (
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
