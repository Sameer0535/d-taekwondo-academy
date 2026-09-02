import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

const defaultEventsList = [
  {
    id: "e1",
    name: "D Taekwondo Academy Belt Examination 2026",
    date: "2026-09-06",
    time: "09:00 AM - 05:00 PM",
    location: "Koramangala Indoor Stadium",
    description: "The D Taekwondo Academy Belt Examination is conducted to assess students' progress, technique, discipline, fitness, and understanding of Taekwondo. Each examination marks an important step in the student's martial arts journey and encourages them to continue developing with confidence and dedication",
    posterUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
    isPublished: true,
    fee: "2500"
  },
  {
    id: "e2",
    name: "Carpe Diem 3.0 – Interschool Taekwondo Tournament",
    date: "2026-09-11",
    time: "07:00 AM - 05:00 PM",
    location: "BGS National Public School, Hulimavu, Bengaluru",
    description: "Carpe Diem 3.0 is an Interschool Sports Tournament proudly presented by BGS National Public School, Hulimavu. The event brings together young athletes to compete in various sports, including Taekwondo. It aims to promote sportsmanship, discipline, teamwork, and competitive excellence among school students.",
    posterUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
    isPublished: true,
    fee: "2500"
  },
  {
    id: "e3",
    name: "Bangkok Open KPNP International Taekwondo Championships 2026",
    date: "2026-11-14",
    time: "08:00 AM - 06:00 PM",
    location: "Island Hall, 3rd Floor, Fashion Island Shopping Mall, Bangkok, Thailand",
    description: "Bangkok Open KPNP International Taekwondo Championships 2026 is an international Taekwondo championship bringing together elite athletes from around the world. The competition features Kyorugi (Individual), Poomsae (Individual, Mix & Team), Poomsae Freestyle, and Speed Kick categories. Inspired by Thailand's rich heritage and the historic Phra Sumen Fort, the championship celebrates excellence, resilience, sportsmanship, and the spirit of Taekwondo.",
    posterUrl: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
    isPublished: true,
    fee: "2500"
  }
];

export default function EventsPage({ events = [], onOpenJoinModal }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  const activeEvents = events && events.length > 0 ? events : defaultEventsList;
  const today = new Date().toISOString().split('T')[0];

  const upcoming = activeEvents.filter(e => (e.date >= today || !e.date) && e.isPublished !== false).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const past = activeEvents.filter(e => e.date && e.date < today && e.isPublished !== false).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const currentEvents = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="events-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">CALENDAR & COMPETITIONS</span>
          <h1>ACADEMY EVENTS</h1>
          <p>Upcoming state tournaments, belt promotion exams, and training camps.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          {/* Tab Selection */}
          <div className="events-tabs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`event-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            >
              UPCOMING EVENTS ({upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`event-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            >
              PAST EVENTS ({past.length})
            </button>
          </div>

          {/* Events List */}
          {currentEvents.length > 0 ? (
            <div className="events-full-list">
              {currentEvents.map((evt) => (
                <div key={evt.id} className="card event-full-card">
                  <div className="event-full-poster">
                    <img src={evt.posterUrl} alt={evt.name} />
                    <div className="event-badge-overlay">
                      {activeTab === 'upcoming' ? (
                        <span className="badge badge-red">UPCOMING</span>
                      ) : (
                        <span className="badge badge-gold">COMPLETED</span>
                      )}
                    </div>
                  </div>

                  <div className="event-full-content">
                    <h2>{evt.name}</h2>
                    
                    <div className="event-meta-bar">
                      <span><Calendar size={16} className="text-red" /> <strong>Date:</strong> {evt.date}</span>
                      {evt.time && <span><Clock size={16} className="text-red" /> <strong>Time:</strong> {evt.time}</span>}
                      <span><MapPin size={16} className="text-red" /> <strong>Venue:</strong> {evt.location}</span>
                    </div>

                    <p className="event-description">{evt.description}</p>

                    <div className="event-card-actions">
                      {activeTab === 'upcoming' ? (
                        <button onClick={() => onOpenJoinModal(evt.name, evt.fee)} className="btn btn-primary-red">
                          REGISTER / PARTICIPATE
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm font-semibold flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
                          <CheckCircle2 size={16} style={{ color: '#10B981' }} /> Concluded Successfully
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
              <h3>No {activeTab} events scheduled at this moment.</h3>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .events-tabs {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
        }
        .event-tab-btn {
          background: #f3f4f6;
          border: none;
          padding: 12px 28px;
          border-radius: 30px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }
        .event-tab-btn.active {
          background: var(--primary-red);
          color: #ffffff;
          box-shadow: var(--shadow-red);
        }

        .events-full-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .event-full-card {
          display: grid;
          grid-template-columns: 320px 1fr;
          overflow: hidden;
        }
        .event-full-poster {
          position: relative;
          height: 100%;
          min-height: 240px;
        }
        .event-full-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .event-badge-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
        }
        .event-full-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .event-full-content h2 {
          font-size: 1.8rem;
          margin-bottom: 12px;
        }
        .event-meta-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 16px;
        }
        .event-description {
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        @media (max-width: 900px) {
          .event-full-card { grid-template-columns: 1fr; }
          .event-full-poster { height: 220px; }
        }
      `}</style>
    </div>
  );
}
