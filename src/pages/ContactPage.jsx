import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';

export default function ContactPage({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = settings?.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, '') : '919876543210';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          program: 'General Contact'
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">GET IN TOUCH</span>
          <h1>CONTACT {settings?.academyName || "D TAEKWONDO ACADEMY"}</h1>
          <p>We are here to answer your questions and welcome you to our martial arts family.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="contact-grid">
            {/* Left Column: Contact Cards */}
            <div className="contact-info-col">
              <div className="card contact-info-card">
                <h3>ACADEMY HEADQUARTERS</h3>
                <p className="subtitle">Visit us or call our admissions team directly.</p>

                <div className="contact-detail-list">
                  <div className="contact-detail-item">
                    <div className="icon-box red"><MapPin size={22} /></div>
                    <div>
                      <strong>Academy Address:</strong>
                      <p>{settings?.address || "123 Martial Arts Boulevard, Sports Complex Road, Bengaluru, Karnataka 560001"}</p>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="icon-box red"><Phone size={22} /></div>
                    <div>
                      <strong>Phone Number:</strong>
                      <p><a href={`tel:${settings?.phone}`}>{settings?.phone || "+91 98765 43210"}</a></p>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="icon-box red"><Mail size={22} /></div>
                    <div>
                      <strong>Email Address:</strong>
                      <p><a href={`mailto:${settings?.email}`}>{settings?.email || "info@dtaekwondoacademy.com"}</a></p>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="icon-box blue"><Clock size={22} /></div>
                    <div>
                      <strong>Training Timings:</strong>
                      <p>Morning Batch: 06:00 AM - 08:00 AM<br />Evening Batch: 04:30 PM - 08:45 PM<br />Weekends: 08:00 AM - 11:30 AM</p>
                    </div>
                  </div>
                </div>

                <div className="contact-actions-row">
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=Hi%20D%20Taekwondo%20Academy,%20I%20have%20an%20enquiry.`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-whatsapp w-full"
                  >
                    <MessageCircle size={20} /> CHAT ON WHATSAPP
                  </a>
                </div>

                <div className="social-links-block">
                  <span>Follow Our Champions:</span>
                  <div className="social-icons-row">
                    <a 
                      href={settings?.instagram ? (settings.instagram.startsWith('http') ? settings.instagram : `https://${settings.instagram}`) : "https://instagram.com"} 
                      target="_blank" 
                      rel="noreferrer" 
                      aria-label="Instagram"
                    >
                      <InstagramIcon size={20} />
                    </a>
                    <a 
                      href={settings?.whatsapp ? (settings.whatsapp.startsWith('http') ? settings.whatsapp : `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`) : 'https://wa.me/919876543210'} 
                      target="_blank" 
                      rel="noreferrer" 
                      aria-label="WhatsApp"
                    >
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact-form-col">
              <div className="card contact-form-card">
                <h2>SEND US A MESSAGE</h2>
                <p className="text-gray-500 text-sm mb-6">Fill out the form below and our staff will respond within 24 hours.</p>

                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={56} style={{ color: '#10B981', margin: '0 auto 16px' }} />
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for reaching out. We will call or email you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="form-control" 
                        placeholder="Enter full name" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          required 
                          className="form-control" 
                          placeholder="+91 98765 43210" 
                        />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          className="form-control" 
                          placeholder="yourname@example.com" 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Your Message *</label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        required 
                        className="form-control" 
                        rows="4" 
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary-red w-full" style={{ width: '100%' }}>
                      {submitting ? "Sending..." : <>SEND MESSAGE <Send size={16} /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="google-map-wrap card mt-12">
            <h3 className="p-4 bg-gray-50 border-b text-lg font-bold" style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>FIND US ON GOOGLE MAPS</h3>
            <iframe 
              title="D Taekwondo Academy Location" 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9712534567!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf832049e29a39f69!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              width="100%" 
              height="380" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .contact-info-card, .contact-form-card {
          padding: 36px;
        }
        .contact-info-card h3 {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 0.95rem;
          margin-bottom: 24px;
        }
        .contact-detail-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 28px;
        }
        .contact-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-box.red { background: var(--primary-red-light); color: var(--primary-red); }
        .icon-box.blue { background: var(--secondary-blue-light); color: var(--secondary-blue); }

        .contact-detail-item strong {
          display: block;
          font-size: 0.85rem;
          color: #6b7280;
          text-transform: uppercase;
        }
        .contact-detail-item p {
          font-size: 0.98rem;
          color: #1f2937;
          font-weight: 600;
        }
        .social-links-block {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .social-icons-row {
          display: flex;
          gap: 10px;
        }
        .social-icons-row a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f3f4f6;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .social-icons-row a:hover {
          background: var(--primary-red);
          color: #ffffff;
        }
        .google-map-wrap {
          margin-top: 40px;
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
