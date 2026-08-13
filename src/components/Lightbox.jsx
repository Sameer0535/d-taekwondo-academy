import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ image, onClose, onNext, onPrev, hasNext, hasPrev }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!image) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close Lightbox">
          <X size={28} />
        </button>

        {hasPrev && (
          <button className="lightbox-nav prev" onClick={onPrev} aria-label="Previous image">
            <ChevronLeft size={36} />
          </button>
        )}

        {hasNext && (
          <button className="lightbox-nav next" onClick={onNext} aria-label="Next image">
            <ChevronRight size={36} />
          </button>
        )}

        <div className="lightbox-media-wrap">
          <img src={image.imageUrl || image.url} alt={image.title || "Gallery image"} className="lightbox-img" />
          {(image.title || image.description) && (
            <div className="lightbox-caption">
              {image.category && <span className="badge badge-gold mb-1">{image.category}</span>}
              {image.title && <h3>{image.title}</h3>}
              {image.description && <p>{image.description}</p>}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .lightbox-container {
          position: relative;
          max-width: 1000px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-close {
          position: absolute;
          top: -45px;
          right: 0;
          background: rgba(255,255,255,0.2);
          border: none;
          color: #ffffff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .lightbox-close:hover {
          background: var(--primary-red);
        }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.15);
          border: none;
          color: #ffffff;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }
        .lightbox-nav:hover {
          background: var(--primary-red);
        }
        .lightbox-nav.prev {
          left: -60px;
        }
        .lightbox-nav.next {
          right: -60px;
        }
        .lightbox-media-wrap {
          background: #111827;
          border-radius: 12px;
          overflow: hidden;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .lightbox-img {
          max-height: 70vh;
          width: auto;
          object-fit: contain;
        }
        .lightbox-caption {
          padding: 16px 24px;
          color: #ffffff;
          width: 100%;
          background: #1f2937;
          text-align: center;
        }
        .lightbox-caption h3 {
          color: #ffffff;
          font-size: 1.2rem;
          margin-bottom: 4px;
        }
        .lightbox-caption p {
          color: #9ca3af;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .lightbox-nav.prev { left: 10px; }
          .lightbox-nav.next { right: 10px; }
        }
      `}</style>
    </div>
  );
}
