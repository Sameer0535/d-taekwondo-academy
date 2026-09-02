import React from 'react';
import { Award, Users, Trophy, Medal, ChevronRight, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Star, MessageSquarePlus, Sparkles } from 'lucide-react';

export default function HomePage({ 
  settings, 
  stats, 
  about, 
  programs = [], 
  achievements = [], 
  events = [], 
  gallery = [], 
  reviews = [],
  setActivePage, 
  onOpenJoinModal, 
  onOpenReviewModal,
  onOpenLightbox,
  onJoinNow 
}) {
  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const defaultEventsList = [
    {
      id: "e1",
      name: "D Taekwondo Academy Belt Examination 2026",
      date: "2026-09-06",
      time: "09:00 AM - 05:00 PM",
      location: "Koramangala Indoor Stadium",
      description: "The D Taekwondo Academy Belt Examination is conducted to assess students' progress, technique, discipline, fitness, and understanding of Taekwondo. Each examination marks an important step in the student's martial arts journey and encourages them to continue developing with confidence and dedication",
      posterUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      fee: "2500"
    },
    {
      id: "e2",
      name: "Carpe Diem 3.0 – Interschool Taekwondo Tournament",
      date: "2026-09-11",
      time: "07:00 AM - 05:00 PM",
      location: "BGS National Public School, Hulimavu, Bengaluru",
      description: "Carpe Diem 3.0 is an Interschool Sports Tournament proudly presented by BGS National Public School, Hulimavu. The event brings together young athletes to compete in various sports, including Taekwondo. It aims to promote sportsmanship, discipline, teamwork, and competitive excellence among school students.",
      posterUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      fee: "2500"
    },
    {
      id: "e3",
      name: "Bangkok Open KPNP International Taekwondo Championships 2026",
      date: "2026-11-14",
      time: "08:00 AM - 06:00 PM",
      location: "Island Hall, 3rd Floor, Fashion Island Shopping Mall, Bangkok, Thailand",
      description: "Bangkok Open KPNP International Taekwondo Championships 2026 is an international Taekwondo championship bringing together elite athletes from around the world. The competition features Kyorugi (Individual), Poomsae (Individual, Mix & Team), Poomsae Freestyle, and Speed Kick categories. Inspired by Thailand's rich heritage and the historic Phra Sumen Fort, the championship celebrates excellence, resilience, sportsmanship, and the spirit of Taekwondo.",
      posterUrl: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      fee: "2500"
    }
  ];

  // Filter upcoming events
  const today = new Date().toISOString().split('T')[0];
  const activeEvents = events && events.length > 0 ? events : defaultEventsList;
  const upcomingEvents = activeEvents.filter(e => (e.date >= today || !e.date) && e.isPublished !== false).slice(0, 3);

  // Recent achievements preview
  const topAchievements = achievements.slice(0, 4);

  // Gallery preview
  const galleryPreview = gallery.slice(0, 6);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section" style={{ backgroundImage: `url(${settings?.heroBgImage || 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1920&q=80'})` }}>
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content">
            {/* Center-Aligned High-Res Logo Badge */}
            <div className="hero-logo-box">
              <img 
                src={settings?.logoUrl || "/logo.png"} 
                alt="D Taekwondo Academy Logo" 
                className="hero-brand-logo" 
              />
            </div>
            
            <div className="hero-subtext-badge">{settings?.academyName || "D TAEKWONDO ACADEMY"}</div>
            <h1 className="hero-headline">{settings?.heroTitle || "DISCIPLINE.\nDEDICATION.\nEXCELLENCE."}</h1>
            <p className="hero-description">
              "{settings?.heroDescription || "Train with discipline, build confidence and develop the skills to achieve your goals through Taekwondo."}"
            </p>

            <div className="hero-cta-buttons">
              <button onClick={() => onJoinNow ? onJoinNow() : onOpenJoinModal()} className="btn btn-primary-red btn-hero">
                JOIN NOW <ArrowRight size={18} />
              </button>
              <button onClick={() => onOpenJoinModal()} className="btn btn-outline-white btn-hero">
                BOOK A TRIAL CLASS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC STATISTICS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap blue"><Users size={32} /></div>
              <div className="stat-value">{stats?.yearsExperience || "10+"}</div>
              <div className="stat-label">Years of Experience</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap red"><Award size={32} /></div>
              <div className="stat-value">{stats?.studentsTrained || "500+"}</div>
              <div className="stat-label">Students Trained</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap gold"><Trophy size={32} /></div>
              <div className="stat-value">{stats?.championships || "50+"}</div>
              <div className="stat-label">Championships</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap dark"><Medal size={32} /></div>
              <div className="stat-value">{stats?.medalsWon || "100+"}</div>
              <div className="stat-label">Medals Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="about-preview-grid">
            <div className="about-image-wrap">
              <img 
                src={about?.mainImage || about?.facilities?.[0]?.image || "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80"} 
                alt="D Taekwondo Academy Arena" 
                className="about-main-img" 
              />
              <div className="about-badge-overlay">
                <ShieldCheck size={28} />
                <span>Kukkiwon World TKD Certified</span>
              </div>
            </div>

            <div className="about-content-wrap">
              <span className="badge badge-red mb-2">ABOUT OUR ACADEMY</span>
              <h2>ABOUT {settings?.academyName || "D TAEKWONDO ACADEMY"}</h2>
              <p className="about-lead">
                {about?.story || "Founded with a commitment to martial excellence, D Taekwondo Academy provides elite combat, fitness, and character building."}
              </p>

              <div className="philosophy-box">
                <h4>OUR TRAINING PHILOSOPHY</h4>
                <p>{about?.philosophy || "We believe martial arts is more than physical combat—it is a path of self-discovery, respect, perseverance, and indomitable spirit."}</p>
              </div>

              <div className="highlights-list mb-6">
                {about?.whyChooseUs?.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="highlight-item">
                    <CheckCircle2 size={18} className="text-red" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => handleNavClick('about')} className="btn btn-secondary-blue">
                LEARN MORE <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS PREVIEW */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-title">
            <span className="badge badge-blue">MARTIAL ARTS CURRICULUM</span>
            <h2>OUR PROGRAMS</h2>
            <p>From early youth discipline to elite championship sparring, we offer tailored martial arts programs for all age groups.</p>
          </div>

          {(() => {
            const displayPrograms = programs && programs.length > 0 ? programs : [
              {
                id: "p1",
                name: "Kids Taekwondo Training Program",
                description: "Designed for young children to build discipline, physical coordination, confidence, focus, and fundamental martial arts movement in a fun, safe environment.",
                image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                ageGroup: "AGES 5 - 12",
                days: "Mon, Wed, Fri",
                time: "4:30 PM - 5:30 PM",
                fee: "₹1,800 / month"
              },
              {
                id: "p2",
                name: "Advanced Training Program",
                description: "Intense regimen for color belt students aiming for Black Belt proficiency, mastering complex kicking combinations, advanced forms, and tactical sparring.",
                image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
                ageGroup: "GREEN BELT & ABOVE",
                days: "Mon to Fri",
                time: "6:30 PM - 7:45 PM",
                fee: "₹2,000 / month"
              },
              {
                id: "p3",
                name: "Competition Training",
                description: "Intensive training focused on advanced Kyorugi (Sparring) and Poomsae (Forms) techniques, competition strategies, speed, agility, precision, and fitness.",
                image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
                ageGroup: "SELECTED ATHLETES",
                days: "Daily & Weekends",
                time: "6:00 AM - 8:00 AM",
                fee: "₹2,000 / month"
              },
              {
                id: "p4",
                name: "Self Defense Training Program for Women",
                description: "Practical real-world self-defense techniques, situational awareness, escape tactics, and joint locks for safety and confidence.",
                image: "https://images.unsplash.com/photo-1564415300397-6a4a15998a69?auto=format&fit=crop&w=800&q=80",
                ageGroup: "ALL AGES",
                days: "Sat & Sun",
                time: "8:00 AM - 9:30 AM",
                fee: "₹800 / month"
              },
              {
                id: "p5",
                name: "VR Taekwondo Experience",
                description: "Experience Taekwondo in an immersive virtual environment, combining modern VR technology with interactive training to make learning engaging, realistic, and exciting.",
                image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
                ageGroup: "18+ YEARS",
                days: "Mon, Wed, Fri",
                time: "4:30 PM - 5:30 PM",
                fee: "₹3,000 / month"
              }
            ];

            return (
              <div className="programs-grid">
                {displayPrograms.slice(0, 6).map((prog) => (
                  <div key={prog.id} className="card program-card">
                    <div className="card-img-wrap">
                      <img src={prog.image} alt={prog.name} />
                      <span className="badge badge-gold card-badge">{prog.ageGroup}</span>
                    </div>
                    <div className="card-body">
                      <h3>{prog.name}</h3>
                      <p>{prog.description}</p>
                      <div className="program-meta">
                        <span>🗓 {prog.days}</span>
                        <span>⏱ {prog.time}</span>
                      </div>
                      <div className="card-footer-action">
                        <span className="fee-tag">{prog.fee}</span>
                        <button onClick={() => handleNavClick('programs')} className="btn btn-outline-dark btn-sm">
                          LEARN MORE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ACHIEVEMENTS PREVIEW */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-title">
            <span className="badge badge-gold">HALL OF FAME</span>
            <h2>OUR ACHIEVEMENTS</h2>
            <p>Celebrating the glory, gold medals, and victory of {settings?.academyName || "D Taekwondo Academy"} champions across state & national arenas.</p>
          </div>

          <div className="achievements-grid">
            {topAchievements.map((ach) => (
              <div key={ach.id} className="card achievement-card">
                <div className="ach-img-wrap">
                  <img src={ach.image} alt={ach.athleteName} />
                  <div className="medal-tag">
                    {ach.medal === 'Gold' && '🥇 GOLD MEDAL'}
                    {ach.medal === 'Silver' && '🥈 SILVER MEDAL'}
                    {ach.medal === 'Bronze' && '🥉 BRONZE MEDAL'}
                    {ach.medal === 'Award' && '🏆 BEST ACADEMY AWARD'}
                  </div>
                </div>
                <div className="ach-body">
                  <span className="ach-year">{ach.year} • {ach.tournamentLevel}</span>
                  <h3>{ach.athleteName}</h3>
                  <h4 className="ach-tournament">{ach.tournamentName}</h4>
                  <div className="ach-category-badge">{ach.category} | {ach.weightCategory}</div>
                  <p className="ach-desc">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10" style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={() => handleNavClick('achievements')} className="btn btn-primary-red">
              VIEW ALL ACHIEVEMENTS <Trophy size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-title">
            <span className="badge badge-blue">CALENDAR & TOURNAMENTS</span>
            <h2>UPCOMING EVENTS</h2>
            <p>Join us at upcoming belt examinations, championships, and high-intensity training workshops.</p>
          </div>

          <div className="events-grid">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((evt) => (
                <div key={evt.id} className="card event-card">
                  <div className="event-img-wrap">
                    <img src={evt.posterUrl} alt={evt.name} />
                    <div className="event-date-badge">
                      <Calendar size={14} /> {evt.date}
                    </div>
                  </div>
                  <div className="event-body">
                    <h3>{evt.name}</h3>
                    <p className="event-location">📍 {evt.location}</p>
                    <p className="event-desc">{evt.description}</p>
                    <button onClick={() => onOpenJoinModal(evt.name, true, evt.fee)} className="btn btn-secondary-blue btn-sm mt-3">
                      REGISTER INTEREST
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Check our events page for past and upcoming schedule.</p>
            )}
          </div>

          <div className="text-center mt-8" style={{ textAlign: 'center', marginTop: '30px' }}>
            <button onClick={() => handleNavClick('events')} className="btn btn-outline-dark">
              VIEW ALL EVENTS
            </button>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-title">
            <span className="badge badge-red">MOMENTS OF GLORY</span>
            <h2>PHOTO GALLERY</h2>
            <p>A glimpse into our high-energy training, championship wins, and vibrant academy life.</p>
          </div>

          <div className="gallery-preview-grid">
            {galleryPreview.map((item, index) => (
              <div 
                key={item.id} 
                className="gallery-preview-item" 
                onClick={() => onOpenLightbox(item, galleryPreview, index)}
              >
                <img src={item.imageUrl} alt={item.title} />
                <div className="gallery-preview-overlay">
                  <span className="badge badge-gold">{item.category}</span>
                  <h4>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10" style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={() => handleNavClick('gallery')} className="btn btn-secondary-blue">
              VIEW FULL GALLERY
            </button>
          </div>
        </div>
      </section>

      {/* STUDENT & PARENT REVIEWS SECTION */}
      <section className="section-padding reviews-home-section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '40px' }}>
            <span className="badge badge-gold mb-2">⭐ ATHLETE & PARENT TESTIMONIALS</span>
            <h2>WHAT OUR MARTIAL ARTS FAMILY SAYS</h2>
            <p className="section-subtitle">Real experiences of discipline, self-defense confidence, and championship achievements from our students and parents in Bengaluru.</p>
          </div>

          {/* Rating Summary Strip */}
          <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '18px', padding: '24px 32px', marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderLeft: '6px solid var(--primary-red)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#fbbf24', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>5.0</div>
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Rated 5.0/5.0 by 100% of Verified Students & Parents</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={onOpenReviewModal}
                className="btn btn-primary-red"
                style={{ padding: '10px 22px', fontSize: '0.9rem', fontWeight: 'bold', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <MessageSquarePlus size={16} /> WRITE A REVIEW
              </button>
              <button 
                onClick={() => handleNavClick('reviews')}
                className="btn btn-outline-white"
                style={{ padding: '10px 22px', fontSize: '0.9rem', fontWeight: 'bold', borderRadius: '10px' }}
              >
                VIEW ALL REVIEWS ({reviews.length > 0 ? reviews.length : '6'}+)
              </button>
            </div>
          </div>

          {/* Featured Top 3 Reviews */}
          <div className="home-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {(reviews && reviews.length > 0 ? reviews.slice(0, 3) : [
              {
                id: "rev_1",
                name: "Priya Sharma",
                role: "Parent of Kids Batch Student",
                program: "Kids Taekwondo Training Program",
                rating: 5,
                title: "Incredible transformation in discipline & confidence!",
                comment: "My 8-year-old son joined D Taekwondo Academy 6 months ago. Master Darshan and Coach Sameer have an exceptional way with children—instilling discipline, focus, and martial arts values with great patience. Highly recommended for parents!",
                date: "2026-08-20"
              },
              {
                id: "rev_2",
                name: "Rahul Verma",
                role: "State Level Athlete",
                program: "Competition Training",
                rating: 5,
                title: "Championship-level coaching and athletic conditioning",
                comment: "The sparring drills, electronic chest-guard simulation, and athletic conditioning are top-tier. Thanks to the rigorous training under Master Darshan Sir, I secured a Gold Medal at the State Championship this year!",
                date: "2026-08-15"
              },
              {
                id: "rev_3",
                name: "Ananya Kulkarni",
                role: "Self Defense Trainee",
                program: "Self Defense Training Program for Women",
                rating: 5,
                title: "Empowering & practical self-defense techniques",
                comment: "The weekend women's self-defense sessions have given me so much real-world situational awareness and physical confidence. The escape drills and joint locks taught here are realistic and effective.",
                date: "2026-08-10"
              }
            ]).map((rev, idx) => (
              <div 
                key={rev.id || idx} 
                className="card home-review-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                        <Star key={i} size={16} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                      ))}
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>
                      <CheckCircle2 size={11} /> Verified
                    </span>
                  </div>

                  {rev.title && (
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px', fontFamily: 'var(--font-heading)' }}>
                      "{rev.title}"
                    </h4>
                  )}

                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 14px' }}>
                    {rev.comment}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    {rev.name ? rev.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#1e293b', display: 'block' }}>{rev.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{rev.role || 'Member'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Review Link */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => handleNavClick('reviews')}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Read all verified reviews & submit yours <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="cta-banner">
        <div className="container cta-container">
          <div className="cta-content text-center">
            <span className="badge badge-gold mb-3">TAKE THE FIRST STEP</span>
            <h2>START YOUR TAEKWONDO JOURNEY TODAY</h2>
            <p className="cta-subtitle">Start your martial arts journey today. Classes available for all age groups.</p>
            <div className="cta-buttons">
              <button onClick={() => onJoinNow ? onJoinNow() : onOpenJoinModal()} className="btn btn-primary-red btn-lg">
                JOIN NOW
              </button>
              <button onClick={() => handleNavClick('contact')} className="btn btn-outline-white">
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 85vh;
          width: 100%;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          padding: 80px 20px;
          overflow: hidden;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.92) 100%);
          backdrop-filter: blur(2px);
        }
        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
        }
        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .hero-logo-box {
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 40px;
          border-radius: 24px;
          margin: 0 auto 24px auto;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          transition: transform 0.3s ease;
        }
        .hero-logo-box:hover {
          transform: scale(1.03);
        }
        .hero-brand-logo {
          height: 165px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .hero-subtext-badge {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          letter-spacing: 3px;
          color: var(--accent-gold);
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 16px;
          text-align: center;
        }
        .hero-headline {
          font-size: 3.8rem;
          color: #ffffff;
          text-transform: uppercase;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 24px;
          white-space: pre-line;
          text-align: center;
          text-shadow: 0 4px 25px rgba(0,0,0,0.6);
        }
        .hero-description {
          font-size: 1.25rem;
          color: #e5e7eb;
          max-width: 720px;
          margin: 0 auto 36px;
          line-height: 1.6;
          text-align: center;
        }
        .hero-cta-buttons {
          display: flex;
          justify-content: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .btn-hero {
          padding: 18px 40px;
          font-size: 1.1rem;
        }

        /* Stats Section */
        .stats-section {
          background: #111827;
          color: #ffffff;
          padding: 44px 0;
          border-bottom: 4px solid var(--primary-red);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-lg);
          padding: 24px;
          text-align: center;
          transition: transform 0.3s;
        }
        .stat-card:hover {
          transform: translateY(-4px);
        }
        .stat-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }
        .stat-icon-wrap.blue { background: rgba(15, 108, 189, 0.2); color: var(--secondary-blue); }
        .stat-icon-wrap.red { background: rgba(229, 35, 40, 0.2); color: var(--primary-red); }
        .stat-icon-wrap.gold { background: rgba(245, 158, 11, 0.2); color: var(--accent-gold); }
        .stat-icon-wrap.dark { background: rgba(255, 255, 255, 0.1); color: #ffffff; }

        .stat-value {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          color: #9ca3af;
          font-size: 0.95rem;
          font-weight: 600;
        }

        /* About Preview */
        .about-preview-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 50px;
          align-items: center;
        }
        .about-image-wrap {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .about-main-img {
          width: 100%;
          height: 440px;
          object-fit: cover;
        }
        .about-badge-overlay {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(17, 24, 39, 0.9);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          border-left: 4px solid var(--primary-red);
        }
        .about-content-wrap h2 {
          font-size: 2.2rem;
          margin: 10px 0 16px;
        }
        .about-lead {
          font-size: 1.1rem;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .philosophy-box {
          background: #f8fafc;
          border-left: 4px solid var(--secondary-blue);
          padding: 16px 20px;
          border-radius: 0 12px 12px 0;
          margin-bottom: 24px;
        }
        .philosophy-box h4 {
          font-size: 0.95rem;
          color: var(--secondary-blue);
          margin-bottom: 4px;
        }
        .philosophy-box p {
          font-size: 0.95rem;
          color: #374151;
          font-style: italic;
        }
        .highlights-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }
        .highlight-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.92rem;
          font-weight: 600;
          color: #1f2937;
        }
        .text-red { color: var(--primary-red); }

        /* Programs Grid */
        .bg-light { background: var(--bg-main); }
        .bg-white { background: #ffffff; }
        .programs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .program-card {
          display: flex;
          flex-direction: column;
        }
        .card-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .program-card:hover .card-img-wrap img {
          transform: scale(1.08);
        }
        .card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
        }
        .card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-body h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
        }
        .card-body p {
          color: #6b7280;
          font-size: 0.92rem;
          line-height: 1.5;
          margin-bottom: 16px;
          flex: 1;
        }
        .program-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #4b5563;
          font-weight: 600;
          padding: 10px 0;
          border-top: 1px solid var(--border-color);
          margin-bottom: 16px;
        }
        .card-footer-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .fee-tag {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--primary-red);
        }

        /* Achievements Grid */
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .achievement-card {
          border-top: 4px solid var(--accent-gold);
        }
        .ach-img-wrap {
          position: relative;
          height: 180px;
        }
        .ach-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .medal-tag {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(17, 24, 39, 0.9);
          color: var(--accent-gold);
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .ach-body {
          padding: 20px;
        }
        .ach-year {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 700;
          text-transform: uppercase;
        }
        .ach-body h3 {
          font-size: 1.2rem;
          color: var(--primary-red);
          margin: 4px 0;
        }
        .ach-tournament {
          font-size: 0.95rem;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .ach-category-badge {
          display: inline-block;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 8px;
        }
        .ach-desc {
          font-size: 0.88rem;
          color: #6b7280;
          line-height: 1.4;
        }

        /* Events Grid */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .event-card {
          display: flex;
          flex-direction: column;
        }
        .event-img-wrap {
          position: relative;
          height: 200px;
        }
        .event-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .event-date-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--primary-red);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .event-body {
          padding: 20px;
        }
        .event-body h3 {
          font-size: 1.2rem;
          margin-bottom: 6px;
        }
        .event-location {
          font-size: 0.88rem;
          color: var(--secondary-blue);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .event-desc {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.5;
        }

        /* Gallery Preview Grid */
        .gallery-preview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .gallery-preview-item {
          position: relative;
          height: 250px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }
        .gallery-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-preview-item:hover img {
          transform: scale(1.1);
        }
        .gallery-preview-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(17, 24, 39, 0.9) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: #ffffff;
          opacity: 0.9;
          transition: opacity 0.3s;
        }
        .gallery-preview-overlay h4 {
          color: #ffffff;
          font-size: 1.1rem;
          margin-top: 6px;
        }

        /* CTA Banner */
        .cta-banner {
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          color: #ffffff;
          padding: 80px 0;
          position: relative;
          border-top: 4px solid var(--accent-gold);
        }
        .cta-content h2 {
          color: #ffffff;
          font-size: 2.8rem;
          margin: 12px 0 16px;
        }
        .cta-content p {
          font-size: 1.2rem;
          color: #d1d5db;
          max-width: 650px;
          margin: 0 auto 32px;
          font-style: italic;
        }
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .about-preview-grid { grid-template-columns: 1fr; }
          .programs-grid { grid-template-columns: repeat(2, 1fr); }
          .achievements-grid { grid-template-columns: repeat(2, 1fr); }
          .events-grid { grid-template-columns: repeat(2, 1fr); }
          .gallery-preview-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-headline { font-size: 3rem; }
          .hero-brand-logo { height: 130px; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .programs-grid { grid-template-columns: 1fr; }
          .achievements-grid { grid-template-columns: 1fr; }
          .events-grid { grid-template-columns: 1fr; }
          .gallery-preview-grid { grid-template-columns: 1fr; }
          .hero-headline { font-size: 2.2rem; }
          .hero-brand-logo { height: 110px; }
          .cta-content h2 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}
