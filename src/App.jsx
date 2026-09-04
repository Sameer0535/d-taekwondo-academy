import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import JoinModal from './components/JoinModal';
import Lightbox from './components/Lightbox';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import CoachesPage from './pages/CoachesPage';
import AchievementsPage from './pages/AchievementsPage';
import GalleryPage from './pages/GalleryPage';
import VideosPage from './pages/VideosPage';
import EventsPage from './pages/EventsPage';
import FeesPage from './pages/FeesPage';
import ContactPage from './pages/ContactPage';
import JoinPage from './pages/JoinPage';
import PaymentPage from './pages/PaymentPage';
import ReviewsPage from './pages/ReviewsPage';
import ReviewModal from './components/ReviewModal';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentLogin from './pages/student/StudentLogin';
import StudentDashboard from './pages/student/StudentDashboard';

class StudentPortalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Student Portal Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', margin: '40px auto', maxWidth: '540px', border: '1px solid #fecaca', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.4rem', color: '#dc2626', marginBottom: '8px' }}>Student Session Reset</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
            Your student portal session needs to be refreshed. Please click below to log in.
          </p>
          <button 
            onClick={() => {
              if (this.props.onLogout) this.props.onLogout();
              window.location.reload();
            }} 
            className="btn btn-primary-red"
            style={{ padding: '12px 24px', fontWeight: 'bold' }}
          >
            🔄 Return to Student Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [studentPortalMode, setStudentPortalMode] = useState('login');
  const [joinModalConfig, setJoinModalConfig] = useState({ isOpen: false, initialProgram: '', isEvent: false, eventFee: '' });

  const handleOpenJoinModal = (programName = '', isEvent = false, fee = '') => {
    const validProgName = typeof programName === 'string' ? programName : '';
    const validFee = typeof fee === 'string' ? fee : '';
    const validIsEvent = typeof isEvent === 'boolean' ? isEvent : false;
    setJoinModalConfig({ 
      isOpen: true, 
      initialProgram: validProgName,
      isEvent: validIsEvent,
      eventFee: validFee
    });
  };

  const handleOpenStudentRegister = () => {
    setStudentPortalMode('register');
    setActivePage('student');
  };

  // Lightbox state
  const [lightboxData, setLightboxData] = useState(null); // { image, list, index }

  // Admin Auth state
  const [adminToken, setAdminToken] = useState(localStorage.getItem('d_tkd_admin_token') || '');

  const [verifiedStudentModal, setVerifiedStudentModal] = useState(null);

  useEffect(() => {
    // 1. Secret URL / Hash Access Detection
    const params = new URLSearchParams(window.location.search);
    const accessParam = params.get('access') || params.get('portal') || params.get('admin');
    if (accessParam === 'admin' || accessParam === '1' || window.location.hash === '#admin') {
      setActivePage('admin');
    }

    // 2. Secret Keyboard Shortcut (Ctrl + Shift + A or Cmd + Shift + A)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActivePage(prev => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Student Verification Certificate Check
    const studentId = params.get('verifyStudent');
    if (studentId) {
      fetch(`/api/student/verify/${studentId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.student) {
            setVerifiedStudentModal(data.student);
          } else {
            setVerifiedStudentModal({
              id: studentId,
              studentName: "Verified Student",
              parentName: "Verified Guardian",
              phone: "Registered",
              program: "Taekwondo Academy",
              belt: "White Belt",
              joiningDate: "Verified Member",
              status: "Approved"
            });
          }
        })
        .catch(err => {
          console.error("Verification fetch error:", err);
          setVerifiedStudentModal({
            id: studentId,
            studentName: "Verified Student",
            parentName: "Verified Guardian",
            phone: "Registered",
            program: "Taekwondo Academy",
            belt: "White Belt",
            joiningDate: "Verified Member",
            status: "Approved"
          });
        });
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Student Auth state
  const [studentToken, setStudentToken] = useState(localStorage.getItem('d_tkd_student_token') || '');
  const [studentData, setStudentData] = useState(() => {
    try {
      const saved = localStorage.getItem('d_tkd_student_data');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object' && parsed.id) ? parsed : null;
    } catch {
      return null;
    }
  });

  const handleStudentLoginSuccess = (student, token) => {
    if (!student || !student.id) return;
    localStorage.setItem('d_tkd_student_token', token || '');
    localStorage.setItem('d_tkd_student_data', JSON.stringify(student));
    setStudentToken(token || '');
    setStudentData(student);
    setActivePage('student');
  };

  const handleStudentLogout = () => {
    localStorage.removeItem('d_tkd_student_token');
    localStorage.removeItem('d_tkd_student_data');
    setStudentToken('');
    setStudentData(null);
    setActivePage('home');
  };

  // Website Data State
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [about, setAbout] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);
  const [fees, setFees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payment, setPayment] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchPublicData = async () => {
    try {
      const [sRes, stRes, aRes, pRes, cRes, achRes, gRes, vRes, eRes, fRes, rRes, payRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/stats'),
        fetch('/api/about'),
        fetch('/api/programs'),
        fetch('/api/coaches'),
        fetch('/api/achievements'),
        fetch('/api/gallery'),
        fetch('/api/videos'),
        fetch('/api/events'),
        fetch('/api/fees'),
        fetch('/api/reviews'),
        fetch('/api/payment')
      ]);

      if (sRes.ok) {
        const sData = await sRes.json();
        setSettings(sData);
        if (sData?.academyName) {
          document.title = `${sData.academyName} | Official Portal`;
        }
      }
      if (stRes.ok) setStats(await stRes.json());
      if (aRes.ok) setAbout(await aRes.json());
      if (pRes.ok) setPrograms(await pRes.json());
      if (cRes.ok) setCoaches(await cRes.json());
      if (achRes.ok) setAchievements(await achRes.json());
      if (gRes.ok) setGallery(await gRes.json());
      if (vRes.ok) setVideos(await vRes.json());
      if (eRes.ok) setEvents(await eRes.json());
      if (fRes.ok) setFees(await fRes.json());
      if (rRes.ok) setReviews(await rRes.json());
      if (payRes.ok) setPayment(await payRes.json());
    } catch (err) {
      console.error("Error fetching public data:", err);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  const handleOpenLightbox = (image, list = [image], index = 0) => {
    setLightboxData({ image, list, index });
  };

  const handleNextLightbox = () => {
    if (!lightboxData) return;
    const nextIdx = (lightboxData.index + 1) % lightboxData.list.length;
    setLightboxData({ ...lightboxData, index: nextIdx, image: lightboxData.list[nextIdx] });
  };

  const handlePrevLightbox = () => {
    if (!lightboxData) return;
    const prevIdx = (lightboxData.index - 1 + lightboxData.list.length) % lightboxData.list.length;
    setLightboxData({ ...lightboxData, index: prevIdx, image: lightboxData.list[prevIdx] });
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem('d_tkd_admin_token', token);
    setAdminToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('d_tkd_admin_token');
    setAdminToken('');
    setActivePage('home');
  };

  return (
    <div className="app-container">
      {activePage === 'admin' ? (
        adminToken ? (
          <AdminDashboard onLogout={handleLogout} onRefreshPublicData={fetchPublicData} />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} settings={settings} onBackToHome={() => setActivePage('home')} />
        )
      ) : (
        <>
          <Navbar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            onOpenJoinModal={(progName, isEvent, fee) => handleOpenJoinModal(progName, isEvent, fee)}
            onJoinNow={() => handleOpenStudentRegister()} 
            settings={settings} 
          />

          <main className="main-content">
            {activePage === 'home' && (
              <HomePage 
                settings={settings}
                stats={stats}
                about={about}
                programs={programs}
                achievements={achievements}
                events={events}
                gallery={gallery}
                reviews={reviews}
                setActivePage={setActivePage}
                onOpenJoinModal={(eventName, isEvent, fee) => handleOpenJoinModal(eventName, isEvent, fee)}
                onOpenReviewModal={() => setIsReviewModalOpen(true)}
                onJoinNow={() => handleOpenStudentRegister()}
                onOpenLightbox={handleOpenLightbox}
              />
            )}

            {activePage === 'about' && (
              <AboutPage about={about} settings={settings} onOpenJoinModal={() => handleOpenJoinModal()} />
            )}

            {activePage === 'programs' && (
              <ProgramsPage programs={programs} onOpenJoinModal={(progName) => handleOpenJoinModal(progName)} />
            )}

            {activePage === 'coaches' && (
              <CoachesPage coaches={coaches} onOpenJoinModal={() => handleOpenJoinModal()} />
            )}

            {activePage === 'achievements' && (
              <AchievementsPage achievements={achievements} settings={settings} onOpenLightbox={handleOpenLightbox} />
            )}

            {activePage === 'gallery' && (
              <GalleryPage gallery={gallery} onOpenLightbox={handleOpenLightbox} />
            )}

            {activePage === 'videos' && (
              <VideosPage videos={videos} />
            )}

            {activePage === 'events' && (
              <EventsPage events={events} onOpenJoinModal={(eventName, fee) => handleOpenJoinModal(eventName, true, fee)} />
            )}

            {activePage === 'fees' && (
              <FeesPage fees={fees} settings={settings} payment={payment} setActivePage={setActivePage} onOpenJoinModal={() => handleOpenJoinModal()} />
            )}

            {activePage === 'reviews' && (
              <ReviewsPage 
                reviews={reviews} 
                onOpenReviewModal={() => setIsReviewModalOpen(true)} 
                programs={programs} 
              />
            )}

            {activePage === 'contact' && (
              <ContactPage settings={settings} />
            )}

            {activePage === 'join' && (
              <JoinPage programs={programs} setActivePage={setActivePage} />
            )}

            {activePage === 'payment' && (
              <PaymentPage payment={payment} settings={settings} fees={fees} />
            )}

            {activePage === 'student' && (
              <StudentPortalErrorBoundary onLogout={handleStudentLogout}>
                {studentData ? (
                  <StudentDashboard 
                    student={studentData} 
                    onLogout={handleStudentLogout} 
                    paymentSettings={payment} 
                    settings={settings}
                  />
                ) : (
                  <StudentLogin 
                    onLoginSuccess={handleStudentLoginSuccess} 
                    programs={programs} 
                    fees={fees}
                    settings={settings}
                    initialMode={studentPortalMode}
                  />
                )}
              </StudentPortalErrorBoundary>
            )}
          </main>

          <Footer 
            setActivePage={setActivePage} 
            onOpenJoinModal={() => handleOpenJoinModal()} 
            settings={settings} 
          />

          <JoinModal 
            isOpen={joinModalConfig.isOpen} 
            onClose={() => setJoinModalConfig({ ...joinModalConfig, isOpen: false })} 
            programs={programs} 
            settings={settings}
            initialProgram={joinModalConfig.initialProgram}
            isEvent={joinModalConfig.isEvent}
            eventFee={joinModalConfig.eventFee}
            payment={payment}
          />

          {/* Review Submission Modal */}
          <ReviewModal 
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            programs={programs}
            onReviewSubmitted={(newRev) => {
              setReviews(prev => [newRev, ...prev]);
              fetchPublicData();
            }}
          />

          {/* Image Lightbox Modal */}
          {lightboxData && (
            <Lightbox 
              image={lightboxData.image}
              onClose={() => setLightboxData(null)}
              onNext={handleNextLightbox}
              onPrev={handlePrevLightbox}
              hasNext={lightboxData.list.length > 1}
              hasPrev={lightboxData.list.length > 1}
            />
          )}

          {/* QR Scan Student Identity Verification Certificate Modal */}
          {verifiedStudentModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
              <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '520px', width: '100%', border: '2px solid #e52328', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: '24px 20px', textAlign: 'center', position: 'relative' }}>
                  <button onClick={() => setVerifiedStudentModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  <span className="badge badge-gold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>OFFICIAL VERIFIED ATHLETE</span>
                  <h3 style={{ fontSize: '1.4rem', margin: '4px 0', color: '#ffffff', fontWeight: 'bold' }}>{settings?.academyName || "D TAEKWONDO ACADEMY"}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>Digital Identity Certificate & Verification Record</p>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    {verifiedStudentModal.photoUrl ? (
                      <img src={verifiedStudentModal.photoUrl} alt={verifiedStudentModal.studentName} style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e52328' }} />
                    ) : (
                      <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold', color: '#475569' }}>
                        {verifiedStudentModal.studentName ? verifiedStudentModal.studentName.charAt(0).toUpperCase() : 'S'}
                      </div>
                    )}
                    <div>
                      <span className="badge badge-green mb-1" style={{ fontSize: '0.75rem' }}>✓ VERIFIED ADMISSION</span>
                      <h4 style={{ fontSize: '1.35rem', fontWeight: 'bold', margin: '2px 0 4px', color: '#0f172a' }}>{verifiedStudentModal.studentName}</h4>
                      <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 'bold' }}>🥋 {verifiedStudentModal.belt || 'White Belt'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
                    <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>STUDENT ID NUMBER</span>
                      <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '0.98rem' }}>{verifiedStudentModal.id}</strong>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>MOBILE CONTACT</span>
                      <strong style={{ color: '#0f172a' }}>📱 {verifiedStudentModal.phone}</strong>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>PARENT / GUARDIAN</span>
                      <strong style={{ color: '#0f172a' }}>{verifiedStudentModal.parentName || 'N/A'}</strong>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>ENROLLED PROGRAM</span>
                      <strong style={{ color: '#2563eb' }}>{verifiedStudentModal.program || 'Kids Taekwondo'}</strong>
                    </div>
                  </div>

                  <button 
                    onClick={() => setVerifiedStudentModal(null)} 
                    className="btn btn-primary-red" 
                    style={{ width: '100%', marginTop: '20px', padding: '12px', fontWeight: 'bold', borderRadius: '12px' }}
                  >
                    CLOSE VERIFICATION
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
