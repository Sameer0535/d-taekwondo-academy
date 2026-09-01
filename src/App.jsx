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
  const [payment, setPayment] = useState(null);

  const fetchPublicData = async () => {
    try {
      const [sRes, stRes, aRes, pRes, cRes, achRes, gRes, vRes, eRes, fRes, payRes] = await Promise.all([
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
                setActivePage={setActivePage}
                onOpenJoinModal={(eventName, isEvent, fee) => handleOpenJoinModal(eventName, isEvent, fee)}
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
            settings={settings}
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
        </>
      )}
    </div>
  );
}
