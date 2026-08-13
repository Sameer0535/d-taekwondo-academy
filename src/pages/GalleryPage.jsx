import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function GalleryPage({ gallery = [], onOpenLightbox }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'TRAINING',
    'TOURNAMENTS',
    'CHAMPIONSHIPS',
    'EVENTS',
    'BELT EXAMINATIONS',
    'ACADEMY LIFE'
  ];

  const filtered = gallery.filter(item => {
    if (item.isPublished === false) return false;
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="gallery-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">PHOTO ARCHIVE</span>
          <h1>ACADEMY GALLERY</h1>
          <p>Explore moments from our training sessions, tournaments, and belt grading ceremonies.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          {/* Category Tabs */}
          <div className="gallery-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`gallery-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filtered.length > 0 ? (
            <div className="gallery-grid">
              {filtered.map((item, index) => (
                <div 
                  key={item.id} 
                  className="gallery-grid-item card" 
                  onClick={() => onOpenLightbox(item, filtered, index)}
                >
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="gallery-item-overlay">
                    <span className="badge badge-gold">{item.category}</span>
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-gallery text-center py-12">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
              <h3>No photos found in this category.</h3>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .gallery-tabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .gallery-tab-btn {
          background: #f3f4f6;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.88rem;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gallery-tab-btn:hover {
          background: #e5e7eb;
          color: var(--primary-red);
        }
        .gallery-tab-btn.active {
          background: var(--primary-red);
          color: #ffffff;
          box-shadow: var(--shadow-red);
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .gallery-grid-item {
          position: relative;
          height: 280px;
          cursor: pointer;
          overflow: hidden;
        }
        .gallery-grid-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-grid-item:hover img {
          transform: scale(1.1);
        }
        .gallery-item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(17, 24, 39, 0.92) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: #ffffff;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .gallery-grid-item:hover .gallery-item-overlay {
          opacity: 1;
        }
        .gallery-item-overlay h3 {
          color: #ffffff;
          font-size: 1.15rem;
          margin-top: 6px;
          margin-bottom: 2px;
        }
        .gallery-item-overlay p {
          color: #d1d5db;
          font-size: 0.85rem;
        }

        @media (max-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .gallery-grid { grid-template-columns: 1fr; }
          .gallery-item-overlay { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
