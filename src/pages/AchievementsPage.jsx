import React, { useState } from 'react';
import { Trophy, Filter } from 'lucide-react';

export default function AchievementsPage({ achievements = [], onOpenLightbox }) {
  const [selectedMedal, setSelectedMedal] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Extract unique years
  const years = ['All', ...new Set(achievements.map(a => a.year).filter(Boolean))].sort((a, b) => b - a);

  // Filter achievements
  const filtered = achievements.filter(ach => {
    const matchMedal = selectedMedal === 'All' || ach.medal === selectedMedal;
    const matchYear = selectedYear === 'All' || ach.year === selectedYear;
    return matchMedal && matchYear && ach.isPublished !== false;
  });

  return (
    <div className="achievements-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">VICTORY & MEDALS</span>
          <h1>OUR ACHIEVEMENTS & CHAMPIONS</h1>
          <p>Honoring the dedication, endurance, and podium finishes of D Taekwondo Academy athletes.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          {/* Filters Bar */}
          <div className="filters-bar card">
            <div className="filter-group">
              <span className="filter-label"><Filter size={16} /> Medal Filter:</span>
              <div className="filter-buttons">
                {['All', 'Gold', 'Silver', 'Bronze', 'Award'].map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedMedal(m)}
                    className={`filter-btn ${selectedMedal === m ? 'active' : ''}`}
                  >
                    {m === 'Gold' && '🥇 '}
                    {m === 'Silver' && '🥈 '}
                    {m === 'Bronze' && '🥉 '}
                    {m === 'Award' && '🏆 '}
                    {m === 'Award' ? 'Awards' : m}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Year:</span>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="year-select"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Achievements Grid */}
          {filtered.length > 0 ? (
            <div className="achievements-full-grid">
              {filtered.map((ach) => (
                <div key={ach.id} className="card ach-card-item">
                  <div className="ach-card-img" onClick={() => onOpenLightbox({ imageUrl: ach.image, title: ach.athleteName, description: `${ach.tournamentName} - ${ach.medal} Medal` })}>
                    <img src={ach.image} alt={ach.athleteName} />
                    <div className="ach-medal-badge">
                      {ach.medal === 'Gold' && '🥇 GOLD MEDAL'}
                      {ach.medal === 'Silver' && '🥈 SILVER MEDAL'}
                      {ach.medal === 'Bronze' && '🥉 BRONZE MEDAL'}
                      {ach.medal === 'Award' && '🏆 BEST ACADEMY AWARD'}
                    </div>
                  </div>

                  <div className="ach-card-body">
                    <div className="ach-top-meta">
                      <span className="badge badge-gold">{ach.year}</span>
                      <span className="ach-level">{ach.tournamentLevel}</span>
                    </div>

                    <h3>{ach.athleteName}</h3>
                    <h4 className="ach-title">{ach.tournamentName}</h4>

                    <div className="ach-detail-box">
                      <div><strong>Category:</strong> {ach.category}</div>
                      <div><strong>Weight:</strong> {ach.weightCategory}</div>
                    </div>

                    <p className="ach-text">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results text-center py-12">
              <Trophy size={48} className="mx-auto text-gray-300 mb-3" style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
              <h3>No achievements found matching criteria.</h3>
              <button onClick={() => { setSelectedMedal('All'); setSelectedYear('All'); }} className="btn btn-outline-dark mt-4">
                RESET FILTERS
              </button>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .filters-bar {
          padding: 16px 24px;
          margin-bottom: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #f8fafc;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .filter-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .filter-btn {
          background: #ffffff;
          border: 1px solid var(--border-color);
          padding: 8px 16px;
          border-radius: 20px;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold-dark);
        }
        .filter-btn.active {
          background: var(--accent-gold);
          color: #ffffff;
          border-color: var(--accent-gold);
          font-weight: 700;
        }
        .year-select {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
        }

        .achievements-full-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .ach-card-item {
          border-top: 4px solid var(--accent-gold);
        }
        .ach-card-img {
          position: relative;
          height: 220px;
          cursor: pointer;
        }
        .ach-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ach-medal-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(17, 24, 39, 0.9);
          color: var(--accent-gold);
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.85rem;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .ach-card-body {
          padding: 24px;
        }
        .ach-top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .ach-level {
          font-size: 0.82rem;
          color: #6b7280;
          font-weight: 700;
          text-transform: uppercase;
        }
        .ach-card-body h3 {
          font-size: 1.3rem;
          color: var(--primary-red);
          margin-bottom: 4px;
        }
        .ach-title {
          font-size: 1.05rem;
          color: #1f2937;
          margin-bottom: 12px;
        }
        .ach-detail-box {
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #4b5563;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ach-text {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .filters-bar { flex-direction: column; align-items: flex-start; }
          .achievements-full-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .achievements-full-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
