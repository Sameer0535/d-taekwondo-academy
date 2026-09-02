import React from 'react';
import { Award, Shield, CheckCircle2 } from 'lucide-react';

const defaultCoachesList = [
  {
    id: "c1",
    name: "DARSHAN A",
    position: "Head Coach & Founder",
    beltDan: "1ST DAN BLACK BELT (KUKKIWON)",
    experience: "15+ Years Experience",
    certifications: [
      "National Certified Referee",
      "International WT Coach",
      "State Gold Medalist"
    ],
    bio: "About Me I'm Darshan, the Founder and Head Coach of D Taekwondo Academy. Taekwondo has been a big part of my life, and I'm passionate about sharing what I've learned with the next generation of students. Over the years, I've had the opportunity to train students of different age groups, prepare them for championships and belt examinations, and help them grow both in Taekwondo and in their personal lives. I'm proud to have guided my students to win medals at national-level championships and International level championship. For me, Taekwondo is not just about winning medals. It's about building discipline, confidence, fitness, respect and a strong mindset. Through D Taekwondo Academy, my goal is to create a positive training environment where every student can learn, improve and become the best version of themselves.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    displayOrder: 1
  },
  {
    id: "c2",
    name: "Sameer R",
    position: "Coach / Manager",
    beltDan: "1ST DAN BLACK BELT (KUKKIWON)",
    experience: "12+ Years Experience",
    certifications: [
      "Poomsae Specialist Certified",
      "Youth Athletic Trainer"
    ],
    bio: "Taekwondo has given me the opportunity to compete at both National and International levels, where I have proudly won medals and gained valuable competitive experience. As a Coach, I enjoy sharing what I've learned with younger students and helping them improve their skills, confidence and discipline. I believe every student has the potential to achieve great things with the right training, dedication and mindset. I'm continuously working to improve myself as an athlete and coach while inspiring the next generation of Taekwondo athletes. Expert in technical accuracy, flexibility, and Poomsae form mastery",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    displayOrder: 2
  }
];

export default function CoachesPage({ coaches = [], onOpenJoinModal }) {
  const activeCoaches = coaches && coaches.length > 0 ? coaches : defaultCoachesList;
  const sortedCoaches = [...activeCoaches].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="coaches-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">MASTERS & INSTRUCTORS</span>
          <h1>OUR COACHING TEAM</h1>
          <p>Learn from certified Kukkiwon World Taekwondo masters and national champions.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="coaches-grid">
            {sortedCoaches.map((coach) => (
              <div key={coach.id} className="card coach-card">
                <div className="coach-photo-wrap">
                  <img src={coach.photo} alt={coach.name} />
                  <span className="badge badge-red coach-dan-badge">{coach.beltDan}</span>
                </div>

                <div className="coach-body">
                  <h3>{coach.name}</h3>
                  <h4 className="coach-position">{coach.position}</h4>
                  
                  <div className="coach-exp-badge">
                    <Award size={16} /> {coach.experience}
                  </div>

                  <p className="coach-bio">{coach.bio}</p>

                  {coach.certifications && coach.certifications.length > 0 && (
                    <div className="coach-certs">
                      <h5>CERTIFICATIONS & HONORS:</h5>
                      <ul>
                        {coach.certifications.map((cert, idx) => (
                          <li key={idx}>
                            <CheckCircle2 size={14} className="text-red" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="coach-cta-box card mt-12 p-8 text-center" style={{ marginTop: '50px', padding: '40px', textAlign: 'center', background: '#f8fafc' }}>
            <h2>TRAIN UNDER CHAMPION MASTERS</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6 mt-2" style={{ maxWidth: '600px', margin: '8px auto 24px' }}>
              Whether you want to build personal fitness, learn practical self-defense, or compete at state and national championships, our masters are dedicated to your success.
            </p>
            <button onClick={onOpenJoinModal} className="btn btn-primary-red">
              JOIN A SESSION WITH OUR MASTERS
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .coaches-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .coach-card {
          display: flex;
          flex-direction: column;
        }
        .coach-photo-wrap {
          position: relative;
          height: 320px;
          overflow: hidden;
        }
        .coach-photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }
        .coach-dan-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
        }
        .coach-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .coach-body h3 {
          font-size: 1.4rem;
          color: #1f2937;
          margin-bottom: 4px;
        }
        .coach-position {
          font-size: 0.95rem;
          color: var(--primary-red);
          font-weight: 700;
          margin-bottom: 12px;
        }
        .coach-exp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f3f4f6;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4b5563;
          width: fit-content;
          margin-bottom: 16px;
        }
        .coach-bio {
          font-size: 0.92rem;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
        }
        .coach-certs {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }
        .coach-certs h5 {
          font-size: 0.78rem;
          color: #9ca3af;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        .coach-certs ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .coach-certs li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
        }

        @media (max-width: 1024px) {
          .coaches-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .coaches-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
