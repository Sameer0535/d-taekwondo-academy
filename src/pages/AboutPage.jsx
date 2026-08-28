import React from 'react';
import { Target, Eye, Shield, CheckCircle, Award, Dumbbell } from 'lucide-react';

export default function AboutPage({ about, settings, onOpenJoinModal }) {
  return (
    <div className="about-page">
      {/* Header Banner */}
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">OUR HERITAGE & MISSION</span>
          <h1>ABOUT {settings?.academyName || "D TAEKWONDO ACADEMY"}</h1>
          <p>Building character, confidence, and martial arts champions since 2016.</p>
        </div>
      </section>

      {/* Main Story & Philosophy */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="about-hero-grid">
            <div className="about-story-col">
              <span className="badge badge-red mb-2">ACADEMY STORY</span>
              <h2>A LEGACY OF DISCIPLINE & VICTORY</h2>
              <p className="lead-text">
                {about?.story || "Founded in 2016, D Taekwondo Academy has established itself as a premier martial arts training center..."}
              </p>
              
              <div className="philosophy-card mt-6">
                <div className="philosophy-header">
                  <Shield className="text-red" size={24} />
                  <h3>OUR TRAINING PHILOSOPHY</h3>
                </div>
                <p>
                  "{about?.philosophy || "We believe martial arts is more than physical combat—it is a path of self-discovery, respect, perseverance, and indomitable spirit."}"
                </p>
              </div>
            </div>

            <div className="about-img-col">
              <img 
                src={about?.mainImage || about?.facilities?.[0]?.image || "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80"} 
                alt="Academy Mat Training" 
                className="about-hero-img" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="card mv-card">
              <div className="mv-icon red"><Target size={36} /></div>
              <h3>OUR MISSION</h3>
              <p>{about?.mission || "To provide world-class World Taekwondo (WT) training in a disciplined, safe, and motivating environment."}</p>
            </div>

            <div className="card mv-card">
              <div className="mv-icon blue"><Eye size={36} /></div>
              <h3>OUR VISION</h3>
              <p>{about?.vision || "To become the nation's leading Taekwondo institution, inspiring athletic excellence and producing Olympic-level competitors."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-title">
            <span className="badge badge-gold">EXCELLENCE ASSURED</span>
            <h2>WHY CHOOSE D TAEKWONDO ACADEMY</h2>
            <p>Why hundreds of parents and martial arts practitioners choose our academy for their journey.</p>
          </div>

          <div className="why-grid">
            {about?.whyChooseUs?.map((reason, idx) => (
              <div key={idx} className="card why-card">
                <div className="why-check">
                  <CheckCircle size={24} style={{ color: 'var(--primary-red)' }} />
                </div>
                <div>
                  <h4>{reason}</h4>
                  <p className="text-sm text-gray-500 mt-1">Certified standards & individualized attention for guaranteed progression.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-title">
            <span className="badge badge-blue">INFRASTRUCTURE</span>
            <h2>OUR FACILITIES</h2>
            <p>Train in a safe, hygienic, and state-of-the-art sparring arena built to Kukkiwon specifications.</p>
          </div>

          <div className="facilities-grid">
            {about?.facilities?.map((fac, idx) => (
              <div key={idx} className="card facility-card">
                <div className="facility-img-wrap">
                  <img src={fac.image} alt={fac.name} />
                </div>
                <div className="facility-body">
                  <h4>{fac.name}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10" style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={onOpenJoinModal} className="btn btn-primary-red">
              BOOK A TRIAL VISIT
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .page-header {
          background: #111827;
          color: #ffffff;
          padding: 60px 0;
          border-bottom: 4px solid var(--primary-red);
        }
        .page-header h1 {
          color: #ffffff;
          font-size: 2.8rem;
          margin: 8px 0;
        }
        .page-header p {
          color: #9ca3af;
          font-size: 1.1rem;
        }
        .about-hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 50px;
          align-items: center;
        }
        .about-story-col h2 {
          font-size: 2.2rem;
          margin-bottom: 16px;
        }
        .lead-text {
          font-size: 1.1rem;
          color: #4b5563;
          line-height: 1.7;
        }
        .philosophy-card {
          background: #f8fafc;
          border-left: 4px solid var(--primary-red);
          padding: 20px 24px;
          border-radius: 0 12px 12px 0;
        }
        .philosophy-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .philosophy-header h3 {
          font-size: 1.05rem;
          color: var(--primary-red);
        }
        .philosophy-card p {
          font-size: 1rem;
          color: #374151;
          font-style: italic;
        }
        .about-hero-img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }
        .mission-vision-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .mv-card {
          padding: 36px;
          text-align: center;
        }
        .mv-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .mv-icon.red { background: var(--primary-red-light); color: var(--primary-red); }
        .mv-icon.blue { background: var(--secondary-blue-light); color: var(--secondary-blue); }

        .mv-card h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
        }
        .mv-card p {
          color: #4b5563;
          font-size: 1.05rem;
          line-height: 1.6;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .why-card {
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .why-check {
          flex-shrink: 0;
        }
        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .facility-card {
          overflow: hidden;
        }
        .facility-img-wrap {
          height: 180px;
        }
        .facility-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .facility-body {
          padding: 16px;
          text-align: center;
        }
        .facility-body h4 {
          font-size: 1rem;
          color: #1f2937;
        }

        @media (max-width: 1024px) {
          .about-hero-grid { grid-template-columns: 1fr; }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
          .facilities-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .mission-vision-grid { grid-template-columns: 1fr; }
          .why-grid { grid-template-columns: 1fr; }
          .facilities-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
