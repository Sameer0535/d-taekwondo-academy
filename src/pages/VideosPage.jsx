import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { YoutubeIcon } from '../components/SocialIcons';

export default function VideosPage({ videos = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Training', 'Tournaments', 'Events', 'Achievements', 'Academy'];

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const filtered = videos.filter(v => {
    if (v.isPublished === false) return false;
    if (selectedCategory === 'All') return true;
    return v.category === selectedCategory;
  });

  return (
    <div className="videos-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">VIDEO HIGHLIGHTS</span>
          <h1>VIDEO GALLERY</h1>
          <p>Watch match action, kick tutorials, and championship demonstrations.</p>
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

          {/* Videos Grid */}
          {filtered.length > 0 ? (
            <div className="videos-grid">
              {filtered.map((vid) => (
                <div key={vid.id} className="card video-card">
                  <div className="video-player-wrap">
                    <iframe
                      src={getYoutubeEmbedUrl(vid.youtubeUrl)}
                      title={vid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="video-iframe"
                    ></iframe>
                  </div>

                  <div className="video-body">
                    <span className="badge badge-red mb-2">{vid.category}</span>
                    <h3>{vid.title}</h3>
                    {vid.description && <p>{vid.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-videos text-center py-12">
              <YoutubeIcon size={48} className="mx-auto text-gray-300 mb-3" style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
              <h3>No videos available in this category.</h3>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }
        .video-card {
          overflow: hidden;
        }
        .video-player-wrap {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background: #000000;
        }
        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .video-body {
          padding: 20px;
        }
        .video-body h3 {
          font-size: 1.2rem;
          margin-bottom: 6px;
        }
        .video-body p {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .videos-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
