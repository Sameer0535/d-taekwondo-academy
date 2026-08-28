import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';

export default function Footer({ setActivePage, onOpenJoinModal, settings }) {
  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* Column 1: Brand Info */}
        <div className="footer-col brand-col">
          <div className="footer-logo-wrap" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
            <img 
              src={settings?.logoUrl || "/logo.png"} 
              alt="D Taekwondo Academy Logo" 
              className="footer-brand-logo" 
            />
          </div>
          <h3 className="footer-brand-title">{settings?.academyName || "D TAEKWONDO ACADEMY"}</h3>
          <p className="footer-description">
            {settings?.footerDescription || "Empowering athletes and martial artists with physical strength, mental discipline, and championship-level Taekwondo training."}
          </p>
          <div className="footer-socials">
            <a 
              href={settings?.instagram ? (settings.instagram.startsWith('http') ? settings.instagram : `https://${settings.instagram}`) : "https://instagram.com"} 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Instagram" 
              className="social-icon"
            >
              <InstagramIcon size={20} />
            </a>
            <a 
              href={settings?.whatsapp ? (settings.whatsapp.startsWith('http') ? settings.whatsapp : `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`) : 'https://wa.me/919876543210'} 
              target="_blank" 
              rel="noreferrer" 
              aria-label="WhatsApp" 
              className="social-icon whatsapp"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">QUICK LINKS</h4>
          <ul className="footer-links">
            <li><button onClick={() => handleNavClick('home')}>Home</button></li>
            <li><button onClick={() => handleNavClick('about')}>About Us</button></li>
            <li><button onClick={() => handleNavClick('programs')}>Training Programs</button></li>
            <li><button onClick={() => handleNavClick('achievements')}>Achievements & Medals</button></li>
            <li><button onClick={() => handleNavClick('gallery')}>Photo Gallery</button></li>
            <li><button onClick={() => handleNavClick('payment')}>Pay Online & Submit UTR</button></li>
            <li><button onClick={() => handleNavClick('contact')}>Contact Us</button></li>
          </ul>
        </div>

        {/* Column 3: Training & Programs */}
        <div className="footer-col">
          <h4 className="footer-col-title">PROGRAMS</h4>
          <ul className="footer-links">
            <li><button onClick={() => handleNavClick('programs')}>Kids Taekwondo</button></li>
            <li><button onClick={() => handleNavClick('programs')}>Beginner Martial Arts</button></li>
            <li><button onClick={() => handleNavClick('programs')}>Advanced Black Belt Track</button></li>
            <li><button onClick={() => handleNavClick('programs')}>Competition & Kyorugi</button></li>
            <li><button onClick={() => handleNavClick('programs')}>Adult Fitness Training</button></li>
            <li><button onClick={() => handleNavClick('programs')}>Self Defense Workshop</button></li>
          </ul>
        </div>

        {/* Column 4: Contact Information */}
        <div className="footer-col">
          <h4 className="footer-col-title">CONTACT US</h4>
          <div className="footer-contact-list">
            <div className="contact-item">
              <MapPin size={18} className="icon-red" />
              <span>{settings?.address || "123 Martial Arts Boulevard, Sports Complex Road, Bengaluru, Karnataka 560001"}</span>
            </div>
            <div className="contact-item">
              <Phone size={18} className="icon-red" />
              <a href={`tel:${settings?.phone}`}>{settings?.phone || "+91 98765 43210"}</a>
            </div>
            <div className="contact-item">
              <Mail size={18} className="icon-red" />
              <a href={`mailto:${settings?.email}`}>{settings?.email || "info@dtaekwondoacademy.com"}</a>
            </div>
          </div>
          <button onClick={onOpenJoinModal} className="btn btn-primary-red mt-4 w-full">
            ENQUIRE TODAY
          </button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>© {new Date().getFullYear()} {settings?.academyName || "D Taekwondo Academy"}. All Rights Reserved.</p>
          <div className="footer-bottom-links" style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => handleNavClick('payment')}>Pay Online / UTR</button>
            <button onClick={() => handleNavClick('student')}>Student Portal</button>
            <button onClick={() => handleNavClick('admin')}>Admin Login</button>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: #0b0f19;
          color: #9ca3af;
          padding-top: 70px;
          border-top: 4px solid var(--primary-red);
        }
        .footer-container {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
          gap: 40px;
          padding-bottom: 60px;
        }
        .footer-brand-logo {
          height: 88px;
          width: auto;
          object-fit: contain;
          margin-bottom: 12px;
          background: #ffffff;
          padding: 8px;
          border-radius: 12px;
        }
        .footer-brand-title {
          color: #ffffff;
          font-size: 1.3rem;
          margin-bottom: 12px;
        }
        .footer-description {
          line-height: 1.6;
          font-size: 0.92rem;
          margin-bottom: 20px;
        }
        .footer-socials {
          display: flex;
          gap: 10px;
        }
        .social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #1f2937;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .social-icon:hover {
          background: var(--primary-red);
          transform: translateY(-3px);
        }
        .social-icon.whatsapp:hover {
          background: #25D366;
        }
        .footer-col-title {
          color: #ffffff;
          font-size: 1.05rem;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        .footer-col-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 30px;
          height: 3px;
          background: var(--primary-red);
          border-radius: 2px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links button {
          background: transparent;
          border: none;
          color: #9ca3af;
          font-size: 0.93rem;
          font-family: inherit;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
          text-align: left;
        }
        .footer-links button:hover {
          color: #ffffff;
          padding-left: 4px;
        }
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.92rem;
        }
        .icon-red {
          color: var(--primary-red);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .footer-bottom {
          background: #030712;
          padding: 20px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 0.88rem;
        }
        .footer-bottom-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-bottom-links button {
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .footer-bottom-links button:hover {
          color: var(--primary-red);
        }

        @media (max-width: 1024px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 640px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
          .footer-bottom-container {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
