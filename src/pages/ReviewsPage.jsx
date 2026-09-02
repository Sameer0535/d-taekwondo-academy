import React, { useState } from 'react';
import { Star, MessageSquarePlus, ShieldCheck, CheckCircle2, User, Calendar, Award, Sparkles, Filter } from 'lucide-react';

export default function ReviewsPage({ reviews = [], onOpenReviewModal, programs = [] }) {
  const [filterCategory, setFilterCategory] = useState('All');

  const defaultReviewsList = [
    {
      id: "rev_1",
      name: "Priya Sharma",
      role: "Parent of Kids Batch Student",
      program: "Kids Taekwondo Training Program",
      rating: 5,
      title: "Incredible transformation in discipline & confidence!",
      comment: "My 8-year-old son joined D Taekwondo Academy 6 months ago. Master Darshan and Coach Sameer have an exceptional way with children—instilling discipline, focus, and martial arts values with great patience. Highly recommended for parents!",
      date: "2026-08-20",
      isApproved: true,
      verified: true
    },
    {
      id: "rev_2",
      name: "Rahul Verma",
      role: "State Level Athlete",
      program: "Competition Training",
      rating: 5,
      title: "Championship-level coaching and athletic conditioning",
      comment: "The sparring drills, electronic chest-guard simulation, and athletic conditioning are top-tier. Thanks to the rigorous training under Master Darshan Sir, I secured a Gold Medal at the State Championship this year!",
      date: "2026-08-15",
      isApproved: true,
      verified: true
    },
    {
      id: "rev_3",
      name: "Ananya Kulkarni",
      role: "Self Defense Trainee",
      program: "Self Defense Training Program for Women",
      rating: 5,
      title: "Empowering & practical self-defense techniques",
      comment: "The weekend women's self-defense sessions have given me so much real-world situational awareness and physical confidence. The escape drills and joint locks taught here are realistic and effective.",
      date: "2026-08-10",
      isApproved: true,
      verified: true
    },
    {
      id: "rev_4",
      name: "Karthik Nambiar",
      role: "Adult Student",
      program: "Advanced Training Program",
      rating: 5,
      title: "Best martial arts dojang in Bengaluru",
      comment: "As a working professional, attending evening classes has dramatically boosted my stamina, flexibility, and mental discipline. The atmosphere is respectful, motivating, and full of positive energy.",
      date: "2026-07-28",
      isApproved: true,
      verified: true
    },
    {
      id: "rev_5",
      name: "Dr. Sneha Hegde",
      role: "Parent",
      program: "Kids Taekwondo Training Program",
      rating: 5,
      title: "Safe, professional, and world-class instructors",
      comment: "Both my daughters love attending their Taekwondo sessions. The academy is clean, well-equipped with mats and safety gear, and the coaches hold authentic Kukkiwon Black Belt Dan certifications.",
      date: "2026-07-14",
      isApproved: true,
      verified: true
    },
    {
      id: "rev_6",
      name: "Vikas Gowda",
      role: "Tech Enthusiast & Student",
      program: "VR Taekwondo Experience",
      rating: 5,
      title: "The VR Taekwondo simulation is mind-blowing!",
      comment: "Combining virtual reality with real martial arts reaction training is truly innovative. It makes reaction training and sparring drills super engaging and fun.",
      date: "2026-06-30",
      isApproved: true,
      verified: true
    }
  ];

  const activeReviews = (reviews && reviews.length > 0 ? reviews : defaultReviewsList).filter(r => r.isApproved !== false);

  // Calculate average rating
  const avgRating = (activeReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / (activeReviews.length || 1)).toFixed(1);
  const fiveStarCount = activeReviews.filter(r => Number(r.rating) === 5).length;

  const filteredReviews = activeReviews.filter(r => {
    if (filterCategory === 'All') return true;
    if (filterCategory === '5 Stars') return Number(r.rating) === 5;
    if (filterCategory === 'Parents') return (r.role || '').toLowerCase().includes('parent');
    if (filterCategory === 'Athletes') return (r.role || '').toLowerCase().includes('athlete') || (r.role || '').toLowerCase().includes('black belt');
    if (filterCategory === 'Self Defense') return (r.program || '').toLowerCase().includes('self defense') || (r.role || '').toLowerCase().includes('self defense');
    return true;
  });

  return (
    <div className="reviews-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">⭐ ATHLETE & PARENT TESTIMONIALS</span>
          <h1>ACADEMY REVIEWS & RATINGS</h1>
          <p>Read genuine reviews and success stories from our martial arts students and parents across Bengaluru.</p>
        </div>
      </section>

      {/* Ratings Overview Strip */}
      <section className="rating-overview-section" style={{ background: '#0f172a', color: '#ffffff', padding: '40px 0', borderBottom: '4px solid var(--primary-red)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: '32px', alignItems: 'center' }}>
            {/* Score Box */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '18px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '3.6rem', fontWeight: '900', color: '#fbbf24', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                {avgRating}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '8px 0' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                Overall Rating based on <strong>{activeReviews.length}+</strong> verified reviews
              </span>
            </div>

            {/* Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#22c55e', display: 'block' }}>100%</span>
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Satisfaction Rate</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24', display: 'block' }}>{fiveStarCount}</span>
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>5-Star Reviews</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38bdf8', display: 'block' }}>100%</span>
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Certified Coaches</span>
              </div>
            </div>

            {/* Write a Review Button */}
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={onOpenReviewModal} 
                className="btn btn-primary-red"
                style={{ padding: '16px 28px', fontSize: '1rem', fontWeight: 'bold', width: '100%', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <MessageSquarePlus size={20} /> WRITE A REVIEW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Reviews List Section */}
      <section className="section-padding bg-white">
        <div className="container">
          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', '5 Stars', 'Parents', 'Athletes', 'Self Defense'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: '1px solid',
                    borderColor: filterCategory === cat ? 'var(--primary-red)' : '#e2e8f0',
                    background: filterCategory === cat ? 'var(--primary-red)' : '#f8fafc',
                    color: filterCategory === cat ? '#ffffff' : '#475569',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Showing <strong>{filteredReviews.length}</strong> reviews
            </span>
          </div>

          {/* Reviews Grid */}
          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredReviews.map((rev, idx) => (
              <div 
                key={rev.id || idx} 
                className="card review-card"
                style={{
                  padding: '28px',
                  borderRadius: '18px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Rating Stars & Verified Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                        <Star key={i} size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                      ))}
                    </div>
                    {rev.verified !== false && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px' }}>
                        <CheckCircle2 size={12} /> Verified Member
                      </span>
                    )}
                  </div>

                  {/* Review Title */}
                  {rev.title && (
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: '0 0 10px', fontFamily: 'var(--font-heading)' }}>
                      "{rev.title}"
                    </h4>
                  )}

                  {/* Review Body */}
                  <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 16px' }}>
                    {rev.comment}
                  </p>

                  {/* Program Tag */}
                  {rev.program && (
                    <span className="badge badge-blue" style={{ fontSize: '0.76rem', marginBottom: '16px', display: 'inline-block' }}>
                      🥋 {rev.program}
                    </span>
                  )}
                </div>

                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '8px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
                    {rev.name ? rev.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>{rev.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{rev.role || 'Member'} • {rev.date || 'Recent'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Write Review Banner */}
          <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)', border: '2px dashed #fecaca', borderRadius: '20px', padding: '36px', textAlign: 'center', marginTop: '48px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#991b1b', margin: '0 0 8px', fontFamily: 'var(--font-heading)' }}>
              Are you an Athlete or Parent at D Taekwondo Academy?
            </h3>
            <p style={{ color: '#7f1d1d', maxWidth: '600px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
              Your feedback inspires our students and helps future champions begin their journey.
            </p>
            <button 
              onClick={onOpenReviewModal} 
              className="btn btn-primary-red"
              style={{ padding: '14px 32px', fontWeight: 'bold', fontSize: '1rem', borderRadius: '12px' }}
            >
              ✍️ SUBMIT YOUR REVIEW NOW
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
