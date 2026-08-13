import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Shield, GraduationCap } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenJoinModal, onJoinNow, settings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About Us', icon: '📖' },
    { id: 'programs', label: 'Programs & Training', icon: '🥋' },
    { id: 'coaches', label: 'Coaches & Instructors', icon: '👨‍🏫' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'gallery', label: 'Photo Gallery', icon: '🖼️' },
    { id: 'videos', label: 'Video Showcase', icon: '🎬' },
    { id: 'events', label: 'Upcoming Events', icon: '📅' },
    { id: 'fees', label: 'Fee Structure', icon: '💰' },
    { id: 'payment', label: 'Pay Online (UPI)', icon: '💳' },
    { id: 'contact', label: 'Contact Us', icon: '📞' },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky-nav ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Info Bar */}
      <div className="top-bar">
        <div className="container top-bar-container">
          <div className="top-info">
            <span><Phone size={14} /> {settings?.phone || "+91 98765 43210"}</span>
            <span className="divider">|</span>
            <span>📍 {settings?.address ? settings.address.split(',')[2] || "Bengaluru" : "Bengaluru"}</span>
          </div>
          <div className="admin-link" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={() => handleNavClick('student')} 
              style={{
                background: 'linear-gradient(135deg, #e52328 0%, #b91c1c 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '5px 14px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(229, 35, 40, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <GraduationCap size={15} /> Student Portal
            </button>
            <button onClick={() => handleNavClick('admin')} className="admin-access-btn">
              <Shield size={13} /> Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-nav-wrapper">
        <div className="container main-nav-container">
          {/* Logo Left */}
          <div className="nav-logo" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img 
              src={settings?.logoUrl || "/logo.png"} 
              alt="D Taekwondo Academy Official Logo" 
              className="official-brand-logo" 
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-menu">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`nav-link ${activePage === link.id ? 'active' : ''}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Button */}
          <div className="nav-actions">
            <button onClick={onJoinNow || onOpenJoinModal} className="btn btn-primary-red join-now-btn">
              JOIN NOW
            </button>
            
            {/* Mobile Hamburger / MENU Button */}
            <button 
              className="mobile-hamburger" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
            >
              {mobileMenuOpen ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#dc2626', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  <X size={18} /> CLOSE
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #e52328 0%, #b91c1c 100%)', color: '#ffffff', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.88rem', boxShadow: '0 2px 8px rgba(229,35,40,0.35)' }}>
                  <Menu size={18} /> MENU
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-inner container">
            <div style={{ padding: '8px 16px 12px 16px', fontWeight: '800', color: '#64748b', fontSize: '0.78rem', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0' }}>
              ALL WEBSITE SECTIONS
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`mobile-nav-link ${activePage === link.id ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span style={{ fontSize: '1.2rem' }}>{link.icon}</span> {link.label}
              </button>
            ))}
            <div className="mobile-drawer-cta" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #e2e8f0' }}>
              <button onClick={() => { setMobileMenuOpen(false); onJoinNow ? onJoinNow() : onOpenJoinModal(); }} className="btn btn-primary-red w-full">
                JOIN NOW
              </button>
              <button onClick={() => handleNavClick('student')} className="btn w-full mt-2" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <GraduationCap size={16} /> Student Portal
              </button>
              <button onClick={() => handleNavClick('admin')} className="btn btn-outline-dark w-full mt-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Shield size={16} /> Admin Portal
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .sticky-nav.scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }
        .top-bar {
          background: #111827;
          color: #9ca3af;
          font-size: 0.82rem;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .top-bar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .top-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .top-info span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .divider {
          color: #374151;
        }
        .admin-access-btn {
          background: transparent;
          border: none;
          color: #d1d5db;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .admin-access-btn:hover {
          color: var(--primary-red);
        }
        .main-nav-wrapper {
          padding: 8px 0;
        }
        .main-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .official-brand-logo {
          height: 96px;
          width: auto;
          object-fit: contain;
          display: block;
          transition: transform 0.2s ease;
        }
        .official-brand-logo:hover {
          transform: scale(1.04);
        }
        .desktop-menu {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link {
          background: transparent;
          border: none;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.96rem;
          color: #374151;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-link:hover {
          color: var(--primary-red);
          background: rgba(229, 35, 40, 0.06);
        }
        .nav-link.active {
          color: var(--primary-red);
          background: rgba(229, 35, 40, 0.1);
          font-weight: 800;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: #111827;
          cursor: pointer;
          padding: 4px;
        }
        .mobile-drawer {
          display: none;
          background: #ffffff;
          border-top: 1px solid var(--border-color);
          padding: 20px 0;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .mobile-nav-link {
          display: block;
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          background: transparent;
          border: none;
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
        }
        .mobile-nav-link.active {
          color: var(--primary-red);
          font-weight: 700;
          background: #fef2f2;
        }
        .mobile-drawer-cta {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (max-width: 1024px) {
          .desktop-menu {
            display: none;
          }
          .mobile-hamburger {
            display: block;
          }
          .mobile-drawer {
            display: block;
          }
          .join-now-btn {
            display: none;
          }
          .official-brand-logo {
            height: 72px;
          }
        }

        @media (max-width: 640px) {
          .top-bar-container {
            flex-direction: column;
            gap: 6px;
            text-align: center;
          }
          .top-info {
            font-size: 0.76rem;
            justify-content: center;
          }
          .official-brand-logo {
            height: 56px;
          }
        }
      `}</style>
    </header>
  );
}
