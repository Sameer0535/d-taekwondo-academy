import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare, ShieldCheck, Send, Sparkles } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, onReviewSubmitted, programs = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Parent of Student',
    program: programs.length > 0 ? programs[0].name : 'Kids Taekwondo Training Program',
    rating: 5,
    title: '',
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (!formData.comment.trim()) {
      setError("Please write your review feedback.");
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to submit review");
      const data = await res.json();
      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted(data.review);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          name: '',
          role: 'Parent of Student',
          program: programs.length > 0 ? programs[0].name : 'Kids Taekwondo Training Program',
          rating: 5,
          title: '',
          comment: ''
        });
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Unable to submit review right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content review-modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '92%',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          border: '1px solid #fee2e2'
        }}
      >
        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '24px 28px', color: '#ffffff', position: 'relative' }}>
          <button 
            onClick={onClose} 
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', color: '#fbbf24', letterSpacing: '0.5px', marginBottom: '8px' }}>
            <Sparkles size={14} /> SHARE YOUR EXPERIENCE
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '4px 0 2px', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
            Write an Academy Review
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>
            Help future martial artists and parents by sharing your feedback.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
              <CheckCircle2 size={54} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#166534', margin: '0 0 6px' }}>
                Thank You for Your Review!
              </h4>
              <p style={{ color: '#15803d', fontSize: '0.9rem', margin: 0 }}>
                Your review has been successfully published to our testimonials.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '16px', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}

              {/* Interactive Star Rating Picker */}
              <div style={{ textAlign: 'center', marginBottom: '22px', background: '#fffbeb', padding: '16px', borderRadius: '14px', border: '1px solid #fef3c7' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Your Overall Rating *
                </label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || formData.rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          transition: 'transform 0.15s'
                        }}
                        className="star-btn"
                      >
                        <Star 
                          size={32} 
                          style={{
                            fill: isFilled ? '#f59e0b' : 'none',
                            color: isFilled ? '#f59e0b' : '#d1d5db',
                            transition: 'all 0.15s'
                          }} 
                        />
                      </button>
                    );
                  })}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b45309', marginTop: '6px', display: 'block' }}>
                  {formData.rating === 5 && "⭐⭐⭐⭐⭐ Outstanding (5.0 / 5)"}
                  {formData.rating === 4 && "⭐⭐⭐⭐ Great Experience (4.0 / 5)"}
                  {formData.rating === 3 && "⭐⭐⭐ Good (3.0 / 5)"}
                  {formData.rating === 2 && "⭐⭐ Fair (2.0 / 5)"}
                  {formData.rating === 1 && "⭐ Needs Improvement (1.0 / 5)"}
                </span>
              </div>

              {/* Name & Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                    Who Are You? *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="form-control"
                  >
                    <option value="Parent of Student">Parent of Student</option>
                    <option value="Current Student">Current Student</option>
                    <option value="Black Belt Athlete">Black Belt Athlete</option>
                    <option value="Adult Trainee">Adult Trainee</option>
                    <option value="Self Defense Student">Self Defense Trainee</option>
                    <option value="Alumni / Member">Alumni / Member</option>
                  </select>
                </div>
              </div>

              {/* Program Enrolled & Review Title */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                    Program Trained In
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="form-control"
                  >
                    {programs.length > 0 ? (
                      programs.map(p => <option key={p.id || p.name} value={p.name}>{p.name}</option>)
                    ) : (
                      <>
                        <option value="Kids Taekwondo Training Program">Kids Taekwondo</option>
                        <option value="Advanced Training Program">Advanced Training</option>
                        <option value="Competition Training">Competition Training</option>
                        <option value="Self Defense Training Program for Women">Self Defense</option>
                        <option value="VR Taekwondo Experience">VR Taekwondo</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                    Review Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Great discipline and coaches!"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Your Review & Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience regarding coaching quality, discipline, fitness improvements, or tournaments..."
                  className="form-control"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary-red"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px'
                }}
              >
                {submitting ? 'Submitting Review...' : <>SUBMIT REVIEW <Send size={16} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
