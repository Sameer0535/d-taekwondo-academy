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
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'programs', label: 'Programs' },
    { id: 'coaches', label: 'Coaches' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'videos', label: 'Videos' },
    { id: 'events', label: 'Events' },
    { id: 'fees', label: 'Fees' },
    { id: 'payment', label: 'Pay Now' },
    { id: 'contact', label: 'Contact' },
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
          {/* Logo Left - Prominent & Perfectly Aligned */}
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
            
            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-hamburger" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-inner container">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`mobile-nav-link ${activePage === link.id ? 'active' : ''}`}
              >
                {link.label}
              </button>
            ))}
            <div className="mobile-drawer-cta">
              <button onClick={() => { setMobileMenuOpen(false); onJoinNow ? onJoinNow() : onOpenJoinModal(); }} className="btn btn-primary-red w-full">
                JOIN NOW
              </button>
              <button onClick={() => handleNavClick('admin')} className="btn btn-outline-dark w-full mt-2">
                <Shield size={16} /> Admin Login
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
            height: 76px;
          }
        }
      `}</style>
    </header>
  );
}
