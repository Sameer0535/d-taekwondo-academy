import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Settings, Info, BookOpen, Users, Trophy, Image, 
  Calendar, DollarSign, Inbox, LogOut, Plus, Trash2, Edit3, 
  Upload, CheckCircle, X, Eye, EyeOff, Save, Video, QrCode, Clock, AlertCircle, Check, ShieldCheck, ClipboardList, Database, Download
} from 'lucide-react';
import { YoutubeIcon } from '../../components/SocialIcons';

export default function AdminDashboard({ onLogout, onRefreshPublicData }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Master Data State with non-null defaults to prevent render crashes
  const [settings, setSettings] = useState({
    academyName: "D TAEKWONDO ACADEMY",
    heroTitle: "DISCIPLINE, DEDICATION, EXCELLENCE",
    heroDescription: "Empowering minds and bodies through world-class Taekwondo martial arts training.",
    heroBgImage: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1920&q=80",
    phone: "+91 94827 97451",
    whatsapp: "+91 94827 97451",
    email: "info@dtaekwondoacademy.com",
    address: "Bengaluru Urban, Karnataka, India"
  });
  const [stats, setStats] = useState({
    yearsExperience: "15+",
    studentsTrained: "5000+",
    championships: "120+",
    medalsWon: "350+"
  });
  const [about, setAbout] = useState({
    history: '',
    mission: '',
    vision: '',
    values: []
  });
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);
  const [fees, setFees] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [payment, setPayment] = useState({
    upiId: 'dtaekwondo@upi',
    payeeName: 'D TAEKWONDO ACADEMY',
    accountNo: '998877665544',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    branch: 'Main Branch'
  });
  const [students, setStudents] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [enquiryFilter, setEnquiryFilter] = useState('All');

  // Admin Security Credentials State
  const [adminCreds, setAdminCreds] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [credSubmitting, setCredSubmitting] = useState(false);
  const [credMessage, setCredMessage] = useState('');
  const [credError, setCredError] = useState('');

  const handleChangeAdminCredentials = async (e) => {
    e.preventDefault();
    if (adminCreds.newPassword !== adminCreds.confirmPassword) {
      setCredError("New password and confirm password do not match.");
      return;
    }

    setCredSubmitting(true);
    setCredError('');
    setCredMessage('');

    try {
      const res = await fetch('/api/auth/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: adminCreds.currentPassword,
          newUsername: adminCreds.newUsername,
          newPassword: adminCreds.newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update admin credentials.");

      setCredMessage("Admin Username & Password updated successfully! Default login (admin / admin123) is now disabled.");
      setAdminCreds({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setCredError(err.message);
    } finally {
      setCredSubmitting(false);
    }
  };

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form States for Modals
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'program', 'coach', 'achievement', 'gallery', 'video', 'event', 'student'

  // Event Participant Details & Add Participant Modal States
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [addEventParticipantModal, setAddEventParticipantModal] = useState({ isOpen: false, eventName: '', eventFee: '' });
  const [addParticipantForm, setAddParticipantForm] = useState({
    studentName: '', age: '', parentName: '', phone: '', email: '', address: '', utrNumber: '', status: 'Approved'
  });
  const [submittingAddParticipant, setSubmittingAddParticipant] = useState(false);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, stRes, aRes, pRes, cRes, achRes, gRes, vRes, eRes, fRes, enqRes, paySettingsRes, allPayRes, studRes] = await Promise.all([
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
        fetch('/api/enquiries'),
        fetch('/api/payment'),
        fetch('/api/admin/payments'),
        fetch('/api/admin/students')
      ]);

      const sData = await sRes.json();
      const stData = await stRes.json();
      const aData = await aRes.json();
      if (sData && typeof sData === 'object') setSettings(prev => ({ ...prev, ...sData }));
      if (stData && typeof stData === 'object') setStats(prev => ({ ...prev, ...stData }));
      if (aData && typeof aData === 'object') setAbout(prev => ({ ...prev, ...aData }));
      setPrograms(await pRes.json());
      setCoaches(await cRes.json());
      setAchievements(await achRes.json());
      setGallery(await gRes.json());
      setVideos(await vRes.json());
      setEvents(await eRes.json());
      setFees(await fRes.json());
      setEnquiries(await enqRes.json());
      if (paySettingsRes.ok) setPayment(await paySettingsRes.json());
      if (allPayRes.ok) setAllPayments(await allPayRes.json());
      if (studRes.ok) setStudents(await studRes.json());
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const showNotification = (msg) => {
    setMessage(msg);
    if (onRefreshPublicData) onRefreshPublicData();
    setTimeout(() => setMessage(''), 4000);
  };

  // Upload Helper
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.url;
  };

  // Multi-file Upload Helper
  const handleMultiUpload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files', f));
    const res = await fetch('/api/upload-multiple', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.urls;
  };

  // SAVE SETTINGS
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    await fetch('/api/stats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    showNotification("Website settings & statistics updated successfully!");
  };

  // SAVE ABOUT
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(about)
    });
    showNotification("About section updated successfully!");
  };

  // SAVE PAYMENT SETTINGS
  const handleSavePayment = async (e) => {
    e.preventDefault();
    await fetch('/api/payment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment)
    });
    showNotification("UPI QR Code & Payment settings updated successfully!");
  };

  // DELETE HANDLERS
  const handleDeleteItem = async (endpoint, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
    showNotification("Item deleted successfully!");
    fetchAllAdminData();
  };

  // SAVE MODAL ENTITY (Program, Coach, Achievement, Gallery, Video, Event)
  const handleSaveEntity = async (e) => {
    e.preventDefault();

    // Handle student modal separately
    if (modalType === 'student') {
      const isEdit = Boolean(editingItem.id);
      const url = isEdit ? `/api/admin/students/${editingItem.id}` : '/api/admin/students';
      const method = isEdit ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });

      setModalType(null);
      setEditingItem(null);
      showNotification(`Student ${isEdit ? 'updated' : 'created'} successfully!`);
      fetchAllAdminData();
      return;
    }

    const endpoint = modalType === 'program' ? 'programs'
      : modalType === 'coach' ? 'coaches'
      : modalType === 'achievement' ? 'achievements'
      : modalType === 'gallery' ? 'gallery'
      : modalType === 'video' ? 'videos'
      : 'events';

    const isEdit = Boolean(editingItem.id);
    const url = isEdit ? `/api/${endpoint}/${editingItem.id}` : `/api/${endpoint}`;
    const method = isEdit ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });

    setModalType(null);
    setEditingItem(null);
    showNotification(`Item ${isEdit ? 'updated' : 'created'} successfully!`);
    fetchAllAdminData();
  };

  // BULK UPLOAD GALLERY PHOTOS
  const handleBulkGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const urls = await handleMultiUpload(files);
      for (const url of urls) {
        await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Photo ${new Date().toLocaleTimeString()}`,
            category: 'TRAINING',
            imageUrl: url,
            isPublished: true
          })
        });
      }
      showNotification(`${urls.length} Photos uploaded successfully!`);
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
      alert("Error uploading images.");
    }
  };

  // SAVE FEES
  const handleSaveFees = async (e) => {
    e.preventDefault();
    await fetch('/api/fees', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fees)
    });
    showNotification("Fee structures updated!");
  };

  // UPDATE ENQUIRY STATUS
  const handleEnquiryStatus = async (id, status) => {
    await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAllAdminData();
  };

  if (loading) {
    return <div className="p-12 text-center text-xl font-bold">Loading Admin Control Panel...</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const upcomingEventsCount = events.filter(e => e.date >= today).length;
  const newEnquiriesCount = (enquiries || []).filter(e => 
    (e.status === 'New' || e.status === 'Pending' || !e.status) && 
    !events.some(ev => ev.name === e.program)
  ).length;
  
  const newEventRegistrationsCount = (enquiries || []).filter(e => 
    (e.status === 'New' || e.status === 'Pending' || !e.status) && 
    events.some(ev => ev.name === e.program)
  ).length;

  const pendingPaymentsCount = (allPayments || []).filter(p => p.status === 'Pending').length;

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={settings?.logoUrl || "/logo.png"} alt={settings?.academyName || "Academy Logo"} className="admin-brand-logo" />
          <div>
            <h3>{settings?.academyName || "D TAEKWONDO"}</h3>
            <span className="admin-badge">ADMIN CMS</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button onClick={() => setActiveTab('overview')} className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <button onClick={() => setActiveTab('settings')} className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={18} /> Settings & Stats
          </button>
          <button onClick={() => setActiveTab('about')} className={`admin-nav-btn ${activeTab === 'about' ? 'active' : ''}`}>
            <Info size={18} /> About Page
          </button>
          <button onClick={() => setActiveTab('programs')} className={`admin-nav-btn ${activeTab === 'programs' ? 'active' : ''}`}>
            <BookOpen size={18} /> Programs ({programs.length})
          </button>
          <button onClick={() => setActiveTab('coaches')} className={`admin-nav-btn ${activeTab === 'coaches' ? 'active' : ''}`}>
            <Users size={18} /> Coaches ({coaches.length})
          </button>
          <button onClick={() => setActiveTab('achievements')} className={`admin-nav-btn ${activeTab === 'achievements' ? 'active' : ''}`}>
            <Trophy size={18} /> Achievements ({achievements.length})
          </button>
          <button onClick={() => setActiveTab('gallery')} className={`admin-nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}>
            <Image size={18} /> Gallery ({gallery.length})
          </button>
          <button onClick={() => setActiveTab('videos')} className={`admin-nav-btn ${activeTab === 'videos' ? 'active' : ''}`}>
            <Video size={18} /> Videos ({videos.length})
          </button>
          <button onClick={() => setActiveTab('events')} className={`admin-nav-btn ${activeTab === 'events' ? 'active' : ''}`}>
            <Calendar size={18} /> Events ({events.length})
          </button>
          <button onClick={() => setActiveTab('event-registrations')} className={`admin-nav-btn ${activeTab === 'event-registrations' ? 'active' : ''}`}>
            <ClipboardList size={18} /> Event Registrations {newEventRegistrationsCount > 0 && <span className="enq-count-badge">{newEventRegistrationsCount}</span>}
          </button>
          <button onClick={() => setActiveTab('fees')} className={`admin-nav-btn ${activeTab === 'fees' ? 'active' : ''}`}>
            <DollarSign size={18} /> Fees Structure
          </button>
          <button onClick={() => setActiveTab('payment')} className={`admin-nav-btn ${activeTab === 'payment' ? 'active' : ''}`}>
            <QrCode size={18} /> Payment QR & Bank
          </button>
          <button onClick={() => setActiveTab('students')} className={`admin-nav-btn ${activeTab === 'students' ? 'active' : ''}`}>
            <Users size={18} /> Student Directory ({students.length})
          </button>
          <button onClick={() => setActiveTab('fee-approvals')} className={`admin-nav-btn ${activeTab === 'fee-approvals' ? 'active' : ''}`}>
            <CheckCircle size={18} /> Fee Approvals {pendingPaymentsCount > 0 && <span className="enq-count-badge">{pendingPaymentsCount}</span>}
          </button>
          <button onClick={() => setActiveTab('enquiries')} className={`admin-nav-btn ${activeTab === 'enquiries' ? 'active' : ''}`}>
            <Inbox size={18} /> Enquiries {newEnquiriesCount > 0 && <span className="enq-count-badge">{newEnquiriesCount}</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="btn btn-outline-white w-full">
            <LogOut size={16} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Header Bar */}
        <header className="admin-topbar">
          <h2>Administrative Dashboard</h2>
          {message && <div className="admin-toast">{message}</div>}
        </header>

        {/* Mobile Nav Select Bar (Visible on phones & small screens) */}
        <div className="admin-mobile-nav-select" style={{ padding: '12px 16px', background: '#0f172a', borderBottom: '1px solid #334155' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            SELECT ADMIN MODULE:
          </label>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#1e293b', color: '#ffffff', border: '1px solid #475569', fontSize: '0.95rem', fontWeight: 'bold' }}
          >
            <option value="overview">📊 Overview Dashboard</option>
            <option value="settings">⚙️ Website Settings & Backup</option>
            <option value="about">📖 About Page</option>
            <option value="programs">🥋 Programs ({programs.length})</option>
            <option value="coaches">👨‍🏫 Coaches ({coaches.length})</option>
            <option value="achievements">🏆 Achievements ({achievements.length})</option>
            <option value="gallery">🖼️ Gallery ({gallery.length})</option>
            <option value="videos">🎬 Videos ({videos.length})</option>
            <option value="events">📅 Events ({events.length})</option>
            <option value="event-registrations">📋 Event Registrations ({newEventRegistrationsCount})</option>
            <option value="fees">💰 Fees Structure</option>
            <option value="payment">💳 Payment QR & Bank</option>
            <option value="students">👥 Student Directory ({students.length})</option>
            <option value="fee-approvals">✅ Fee Approvals ({pendingPaymentsCount})</option>
            <option value="enquiries">📩 Admission Enquiries ({newEnquiriesCount})</option>
          </select>
        </div>

        <div className="admin-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <h3 className="pane-title">Academy System Summary</h3>
              <div className="admin-stats-cards">
                <div className="card admin-stat-card">
                  <Image size={32} className="text-blue" />
                  <div>
                    <h4>{gallery.length}</h4>
                    <p>Total Photos</p>
                  </div>
                </div>

                <div className="card admin-stat-card">
                  <Video size={32} className="text-red" />
                  <div>
                    <h4>{videos.length}</h4>
                    <p>Total Videos</p>
                  </div>
                </div>

                <div className="card admin-stat-card">
                  <Trophy size={32} className="text-gold" />
                  <div>
                    <h4>{achievements.length}</h4>
                    <p>Achievements</p>
                  </div>
                </div>

                <div className="card admin-stat-card">
                  <Calendar size={32} className="text-blue" />
                  <div>
                    <h4>{upcomingEventsCount}</h4>
                    <p>Upcoming Events</p>
                  </div>
                </div>

                <div className="card admin-stat-card highlight">
                  <Inbox size={32} className="text-red" />
                  <div>
                    <h4>{newEnquiriesCount}</h4>
                    <p>New Student Enquiries</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6 mt-8" style={{ marginTop: '32px', padding: '24px' }}>
                <h4 className="font-bold text-lg mb-4" style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Quick Management Actions</h4>
                <div className="flex gap-4 flex-wrap" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button onClick={() => { setModalType('gallery'); setEditingItem({ title: '', category: 'TRAINING', imageUrl: '', description: '', isPublished: true }); }} className="btn btn-primary-red">
                    <Plus size={16} /> Add Photo
                  </button>
                  <button onClick={() => { setModalType('achievement'); setEditingItem({ athleteName: '', tournamentName: '', tournamentLevel: 'State Championship', year: '2026', category: 'Junior Kyorugi', weightCategory: 'Under 59 KG', medal: 'Gold', description: '', image: '' }); }} className="btn btn-secondary-blue">
                    <Plus size={16} /> Add Achievement
                  </button>
                  <button onClick={() => { setModalType('event'); setEditingItem({ name: '', date: new Date().toISOString().split('T')[0], time: '09:00 AM - 05:00 PM', location: '', description: '', posterUrl: '' }); }} className="btn btn-outline-dark">
                    <Plus size={16} /> Add Event
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SETTINGS & STATS */}
          {activeTab === 'settings' && (
            <div className="tab-pane">
              <h3 className="pane-title">Website Settings, Data Backup & Statistics</h3>

              {/* Data Backup & Export Card */}
              <div className="card p-6 mb-6" style={{ padding: '24px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0369a1' }}>
                  <Database size={22} />
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#0369a1' }}>💾 Backup & Export Academy Data</h4>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#0c4a6e', margin: '0 0 16px 0' }}>
                  Download a complete backup of all student records, event registrations, fee approvals, and academy settings to save on your PC, send via email, or upload to Google Drive.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a 
                    href="/api/admin/export-database" 
                    download 
                    className="btn" 
                    style={{ background: '#0284c7', color: '#ffffff', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={16} /> DOWNLOAD FULL DATABASE BACKUP (.JSON)
                  </a>
                  <a 
                    href="/api/admin/export-csv/students" 
                    download 
                    className="btn" 
                    style={{ background: '#16a34a', color: '#ffffff', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={16} /> EXPORT STUDENTS (EXCEL / CSV)
                  </a>
                  <a 
                    href="/api/admin/export-csv/enquiries" 
                    download 
                    className="btn" 
                    style={{ background: '#d97706', color: '#ffffff', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={16} /> EXPORT EVENT REGISTRATIONS (EXCEL / CSV)
                  </a>
                </div>
              </div>
              
              {/* Security & Credentials Card */}
              <div className="card p-6 mb-6" style={{ padding: '24px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#dc2626' }}>
                  <ShieldCheck size={22} />
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#dc2626' }}>🔐 Admin Credentials & Panel Security</h4>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#7f1d1d', margin: '0 0 16px 0' }}>
                  Update your Admin Username and Password below. <strong>Security Notice:</strong> Once updated, the default credentials (<code>admin</code> / <code>admin123</code>) will NO LONGER work and only your new credentials will be accepted.
                </p>

                {credError && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '16px', fontSize: '0.85rem' }}>⚠️ {credError}</div>}
                {credMessage && <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', marginBottom: '16px', fontSize: '0.85rem' }}>✓ {credMessage}</div>}

                <form onSubmit={handleChangeAdminCredentials}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }} className="mb-4">
                    <div className="form-group">
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem', color: '#7f1d1d' }}>Current Admin Password *</label>
                      <input 
                        type="password" 
                        required 
                        value={adminCreds.currentPassword} 
                        onChange={(e) => setAdminCreds({ ...adminCreds, currentPassword: e.target.value })} 
                        placeholder="Enter current password" 
                        className="form-control" 
                        style={{ height: '42px', borderRadius: '8px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem', color: '#7f1d1d' }}>New Admin Username *</label>
                      <input 
                        type="text" 
                        required 
                        value={adminCreds.newUsername} 
                        onChange={(e) => setAdminCreds({ ...adminCreds, newUsername: e.target.value })} 
                        placeholder="e.g. master_admin" 
                        className="form-control" 
                        style={{ height: '42px', borderRadius: '8px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem', color: '#7f1d1d' }}>New Admin Password *</label>
                      <input 
                        type="password" 
                        required 
                        value={adminCreds.newPassword} 
                        onChange={(e) => setAdminCreds({ ...adminCreds, newPassword: e.target.value })} 
                        placeholder="New strong password" 
                        className="form-control" 
                        style={{ height: '42px', borderRadius: '8px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem', color: '#7f1d1d' }}>Confirm New Password *</label>
                      <input 
                        type="password" 
                        required 
                        value={adminCreds.confirmPassword} 
                        onChange={(e) => setAdminCreds({ ...adminCreds, confirmPassword: e.target.value })} 
                        placeholder="Confirm new password" 
                        className="form-control" 
                        style={{ height: '42px', borderRadius: '8px' }}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={credSubmitting} 
                    className="btn btn-primary-red" 
                    style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    {credSubmitting ? "UPDATING CREDENTIALS..." : "UPDATE & SECURE ADMIN CREDENTIALS"}
                  </button>
                </form>
              </div>

              <form onSubmit={handleSaveSettings} className="card p-6" style={{ padding: '24px' }}>
                <h4 className="font-bold border-b pb-2 mb-4" style={{ fontSize: '1.1rem', color: '#e52328', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
                  🏷️ Academy Name & Brand Logo Configuration
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>Academy Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. D TAEKWONDO ACADEMY or Dragon Martial Arts" 
                      value={settings?.academyName || ''} 
                      onChange={(e) => setSettings({ ...(settings || {}), academyName: e.target.value })} 
                      className="form-control" 
                      style={{ fontWeight: 'bold' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      Appears in top navbar, footer, student portal, ID cards & certificates.
                    </span>
                  </div>

                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>Academy Logo (URL or Upload File)</label>
                    <input 
                      type="text" 
                      placeholder="/logo.png or image URL" 
                      value={settings?.logoUrl || ''} 
                      onChange={(e) => setSettings({ ...(settings || {}), logoUrl: e.target.value })} 
                      className="form-control mb-2" 
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        id="logoUploadInput" 
                        style={{ display: 'none' }}
                        onChange={async (e) => { 
                          if (e.target.files[0]) { 
                            const url = await handleFileUpload(e.target.files[0]); 
                            setSettings({ ...(settings || {}), logoUrl: url }); 
                          } 
                        }} 
                      />
                      <label htmlFor="logoUploadInput" className="btn btn-outline-dark btn-sm" style={{ cursor: 'pointer', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        📁 Upload Logo File
                      </label>
                      {settings?.logoUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <img src={settings.logoUrl} alt="Logo Preview" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>Active Logo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h4 className="font-bold border-b pb-2 mb-4 mt-4" style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
                  🖼️ Hero Banner Details
                </h4>

                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Hero Headline</label>
                  <input type="text" value={settings?.heroTitle || ''} onChange={(e) => setSettings({ ...(settings || {}), heroTitle: e.target.value })} className="form-control" />
                </div>

                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Hero Description</label>
                  <textarea value={settings?.heroDescription || ''} onChange={(e) => setSettings({ ...(settings || {}), heroDescription: e.target.value })} className="form-control" rows="2"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Hero Background Image URL</label>
                    <input type="text" value={settings?.heroBgImage || ''} onChange={(e) => setSettings({ ...(settings || {}), heroBgImage: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Upload New Hero BG</label>
                    <input type="file" onChange={async (e) => { if (e.target.files[0]) { const url = await handleFileUpload(e.target.files[0]); setSettings({ ...(settings || {}), heroBgImage: url }); } }} className="form-control" />
                  </div>
                </div>

                <h4 className="font-bold border-b pb-2 mb-4 mt-6" style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
                  📞 Top Info Bar & Contact Settings (Header & Footer)
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Header Top-Bar Phone Number *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +91 98765 43210" 
                      value={settings?.phone || ''} 
                      onChange={(e) => setSettings({ ...(settings || {}), phone: e.target.value })} 
                      className="form-control" 
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Header Top-Bar Location / City *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bengaluru" 
                      value={settings?.topBarLocation || settings?.location || ''} 
                      onChange={(e) => setSettings({ ...(settings || {}), topBarLocation: e.target.value, location: e.target.value })} 
                      className="form-control" 
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. info@dtaekwondo.com" 
                      value={settings?.email || ''} 
                      onChange={(e) => setSettings({ ...(settings || {}), email: e.target.value })} 
                      className="form-control" 
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Instagram URL</label>
                    <input 
                      type="text" 
                      placeholder="https://instagram.com/your_profile" 
                      value={settings?.instagram || ''} 
                      onChange={(e) => setSettings({ ...(settings || {}), instagram: e.target.value })} 
                      className="form-control" 
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>WhatsApp Mobile / Link</label>
                    <input 
                      type="text" 
                      placeholder="919876543210 or https://wa.me/..." 
                      value={settings?.whatsapp || ''} 
                      onChange={(e) => setSettings({ ...(settings || {}), whatsapp: e.target.value })} 
                      className="form-control" 
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Full Academy Address</label>
                    <input 
                      type="text" 
                      placeholder="Full training hall address" 
                      value={settings?.address || ''} 
                      onChange={(e) => setSettings({ ...(settings || {}), address: e.target.value })} 
                      className="form-control" 
                    />
                  </div>
                </div>

                <h4 className="font-bold border-b pb-2 mb-4 mt-6">Homepage Statistics Counters</h4>
                <div className="grid grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input type="text" value={stats?.yearsExperience || ''} onChange={(e) => setStats({ ...(stats || {}), yearsExperience: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Students Trained</label>
                    <input type="text" value={stats?.studentsTrained || ''} onChange={(e) => setStats({ ...(stats || {}), studentsTrained: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Championships</label>
                    <input type="text" value={stats?.championships || ''} onChange={(e) => setStats({ ...(stats || {}), championships: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Medals Won</label>
                    <input type="text" value={stats?.medalsWon || ''} onChange={(e) => setStats({ ...(stats || {}), medalsWon: e.target.value })} className="form-control" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary-red mt-4">
                  <Save size={16} /> SAVE SETTINGS & STATS
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ABOUT PAGE */}
          {activeTab === 'about' && (
            <div className="tab-pane">
              <h3 className="pane-title">Manage About Page Content & Images</h3>
              <form onSubmit={handleSaveAbout} className="card p-6" style={{ padding: '24px' }}>
                <h4 className="font-bold border-b pb-2 mb-4">📷 Main About Section Image</h4>
                <div className="grid grid-cols-2 gap-4 mb-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', alignItems: 'start' }}>
                  <div>
                    <div className="form-group">
                      <label>Main About Image URL</label>
                      <input 
                        type="text" 
                        placeholder="https://..." 
                        value={about?.mainImage || ''} 
                        onChange={(e) => setAbout({ ...about, mainImage: e.target.value })} 
                        className="form-control" 
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: '12px' }}>
                      <label>Upload New Main About Image from Computer</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => { 
                          if (e.target.files[0]) { 
                            const url = await handleFileUpload(e.target.files[0]); 
                            setAbout({ ...about, mainImage: url }); 
                          } 
                        }} 
                        className="form-control" 
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Current Image Preview</label>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <img 
                        src={about?.mainImage || about?.facilities?.[0]?.image || "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80"} 
                        alt="About Section Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  </div>
                </div>

                <h4 className="font-bold border-b pb-2 mb-4 mt-6">📝 Story, Mission & Philosophy</h4>
                <div className="form-group">
                  <label>Academy Story</label>
                  <textarea value={about?.story || ''} onChange={(e) => setAbout({ ...about, story: e.target.value })} className="form-control" rows="4"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Mission Statement</label>
                    <textarea value={about?.mission || ''} onChange={(e) => setAbout({ ...about, mission: e.target.value })} className="form-control" rows="3"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Vision Statement</label>
                    <textarea value={about?.vision || ''} onChange={(e) => setAbout({ ...about, vision: e.target.value })} className="form-control" rows="3"></textarea>
                  </div>
                </div>

                <div className="form-group">
                  <label>Training Philosophy</label>
                  <textarea value={about?.philosophy || ''} onChange={(e) => setAbout({ ...about, philosophy: e.target.value })} className="form-control" rows="3"></textarea>
                </div>

                <h4 className="font-bold border-b pb-2 mb-4 mt-6">🏢 Facility Photos & Descriptions</h4>
                <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {(about?.facilities || []).map((fac, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div className="form-group">
                        <label>Facility #{idx + 1} Name</label>
                        <input 
                          type="text" 
                          value={fac.name || ''} 
                          onChange={(e) => {
                            const newFacs = [...(about.facilities || [])];
                            newFacs[idx] = { ...newFacs[idx], name: e.target.value };
                            setAbout({ ...about, facilities: newFacs });
                          }} 
                          className="form-control" 
                        />
                      </div>
                      <div className="form-group" style={{ marginTop: '8px' }}>
                        <label>Image URL</label>
                        <input 
                          type="text" 
                          value={fac.image || ''} 
                          onChange={(e) => {
                            const newFacs = [...(about.facilities || [])];
                            newFacs[idx] = { ...newFacs[idx], image: e.target.value };
                            setAbout({ ...about, facilities: newFacs });
                          }} 
                          className="form-control" 
                        />
                      </div>
                      <div className="form-group" style={{ marginTop: '8px' }}>
                        <label>Upload New Photo</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              const newFacs = [...(about.facilities || [])];
                              newFacs[idx] = { ...newFacs[idx], image: url };
                              setAbout({ ...about, facilities: newFacs });
                            }
                          }} 
                          className="form-control" 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary-red mt-6" style={{ marginTop: '24px' }}>
                  <Save size={16} /> SAVE ABOUT CONTENT & IMAGES
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="tab-pane">
              <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="pane-title">Training Programs</h3>
                <button onClick={() => { setModalType('program'); setEditingItem({ name: '', description: '', image: '', ageGroup: 'Ages 5-11', days: 'Mon, Wed, Fri', time: '4:30 PM - 5:30 PM', duration: '60 mins', fee: '₹1,000 / month' }); }} className="btn btn-primary-red">
                  <Plus size={16} /> ADD NEW PROGRAM
                </button>
              </div>

              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Program Name</th>
                      <th>Age Group</th>
                      <th>Schedule</th>
                      <th>Fee</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programs.map(prog => (
                      <tr key={prog.id}>
                        <td><img src={prog.image} alt={prog.name} className="table-thumb" /></td>
                        <td><strong>{prog.name}</strong></td>
                        <td><span className="badge badge-blue">{prog.ageGroup}</span></td>
                        <td>{prog.days} ({prog.time})</td>
                        <td><strong className="text-red">{prog.fee}</strong></td>
                        <td>
                          <div className="action-btns">
                            <button onClick={() => { setModalType('program'); setEditingItem(prog); }} className="action-icon edit"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteItem('programs', prog.id)} className="action-icon delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COACHES */}
          {activeTab === 'coaches' && (
            <div className="tab-pane">
              <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="pane-title">Coaching Staff</h3>
                <button onClick={() => { setModalType('coach'); setEditingItem({ name: '', position: 'Instructor', beltDan: '3rd Dan Black Belt', experience: '5+ Years', bio: '', photo: '', certifications: [] }); }} className="btn btn-primary-red">
                  <Plus size={16} /> ADD NEW COACH
                </button>
              </div>

              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Coach Name</th>
                      <th>Position</th>
                      <th>Dan / Belt Rank</th>
                      <th>Experience</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coaches.map(c => (
                      <tr key={c.id}>
                        <td><img src={c.photo} alt={c.name} className="table-thumb" /></td>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.position}</td>
                        <td><span className="badge badge-gold">{c.beltDan}</span></td>
                        <td>{c.experience}</td>
                        <td>
                          <div className="action-btns">
                            <button onClick={() => { setModalType('coach'); setEditingItem(c); }} className="action-icon edit"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteItem('coaches', c.id)} className="action-icon delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="tab-pane">
              <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="pane-title">Achievements & Medals</h3>
                <button onClick={() => { setModalType('achievement'); setEditingItem({ athleteName: '', tournamentName: '', tournamentLevel: 'State Championship', year: '2026', category: 'Junior Kyorugi', weightCategory: 'Under 59 KG', medal: 'Gold', description: '', image: '' }); }} className="btn btn-primary-red">
                  <Plus size={16} /> ADD ACHIEVEMENT
                </button>
              </div>

              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Medal</th>
                      <th>Athlete Name</th>
                      <th>Tournament Name</th>
                      <th>Year</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.map(a => (
                      <tr key={a.id}>
                        <td>
                          <span className={`badge ${a.medal === 'Gold' ? 'badge-gold' : a.medal === 'Silver' ? 'badge-blue' : 'badge-red'}`}>
                            {a.medal}
                          </span>
                        </td>
                        <td><strong>{a.athleteName}</strong></td>
                        <td>{a.tournamentName}</td>
                        <td>{a.year}</td>
                        <td>{a.category}</td>
                        <td>
                          <div className="action-btns">
                            <button onClick={() => { setModalType('achievement'); setEditingItem(a); }} className="action-icon edit"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteItem('achievements', a.id)} className="action-icon delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="tab-pane">
              <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="pane-title">Photo Gallery Management</h3>
                <div className="flex gap-3" style={{ display: 'flex', gap: '12px' }}>
                  <label className="btn btn-secondary-blue cursor-pointer">
                    <Upload size={16} /> BULK UPLOAD PHOTOS
                    <input type="file" multiple accept="image/*" onChange={handleBulkGalleryUpload} className="hidden" style={{ display: 'none' }} />
                  </label>
                  <button onClick={() => { setModalType('gallery'); setEditingItem({ title: '', category: 'TRAINING', imageUrl: '', description: '', isPublished: true }); }} className="btn btn-primary-red">
                    <Plus size={16} /> ADD SINGLE PHOTO
                  </button>
                </div>
              </div>

              <div className="admin-gallery-grid">
                {gallery.map(img => (
                  <div key={img.id} className="card admin-gal-card">
                    <img src={img.imageUrl} alt={img.title} />
                    <div className="admin-gal-body">
                      <span className="badge badge-gold mb-1">{img.category}</span>
                      <h4>{img.title}</h4>
                      <div className="flex justify-between items-center mt-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <button onClick={async () => {
                          await fetch(`/api/gallery/${img.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...img, isPublished: !img.isPublished }) });
                          fetchAllAdminData();
                        }} className="btn btn-sm btn-outline-dark">
                          {img.isPublished ? <Eye size={14} /> : <EyeOff size={14} />} {img.isPublished ? 'Published' : 'Hidden'}
                        </button>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => { setModalType('gallery'); setEditingItem(img); }} className="action-icon edit" title="Edit Photo Details"><Edit3 size={16} /></button>
                          <button onClick={() => handleDeleteItem('gallery', img.id)} className="action-icon delete" title="Delete Photo"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: VIDEOS */}
          {activeTab === 'videos' && (
            <div className="tab-pane">
              <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="pane-title">Video Gallery Management</h3>
                <button onClick={() => { setModalType('video'); setEditingItem({ title: '', description: '', youtubeUrl: '', category: 'Training', isPublished: true }); }} className="btn btn-primary-red">
                  <Plus size={16} /> ADD YOUTUBE VIDEO
                </button>
              </div>

              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>YouTube URL</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map(v => (
                      <tr key={v.id}>
                        <td><strong>{v.title}</strong></td>
                        <td><span className="badge badge-blue">{v.category}</span></td>
                        <td><a href={v.youtubeUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">{v.youtubeUrl}</a></td>
                        <td>
                          <div className="action-btns">
                            <button onClick={() => { setModalType('video'); setEditingItem(v); }} className="action-icon edit"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteItem('videos', v.id)} className="action-icon delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: EVENTS */}
          {activeTab === 'events' && (
            <div className="tab-pane">
              <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="pane-title">Events Calendar</h3>
                <button onClick={() => { setModalType('event'); setEditingItem({ name: '', date: new Date().toISOString().split('T')[0], time: '09:00 AM - 05:00 PM', location: '', description: '', posterUrl: '' }); }} className="btn btn-primary-red">
                  <Plus size={16} /> ADD NEW EVENT
                </button>
              </div>

              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Poster</th>
                      <th>Event Name</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(e => (
                      <tr key={e.id}>
                        <td><img src={e.posterUrl} alt={e.name} className="table-thumb" /></td>
                        <td><strong>{e.name}</strong></td>
                        <td>{e.date}</td>
                        <td>{e.location}</td>
                        <td>
                          <span className={`badge ${e.date >= today ? 'badge-red' : 'badge-gold'}`}>
                            {e.date >= today ? 'Upcoming' : 'Past'}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button onClick={() => { setModalType('event'); setEditingItem(e); }} className="action-icon edit"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteItem('events', e.id)} className="action-icon delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9b: EVENT REGISTRATIONS */}
          {activeTab === 'event-registrations' && (
            <div className="tab-pane">
              <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 className="pane-title" style={{ margin: 0 }}>Event Registrations</h3>
                  <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>View and manage participants registered for specific events.</p>
                </div>
              </div>

              {events.length === 0 ? (
                <div className="card" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                  <p>No events available yet.</p>
                </div>
              ) : (
                events.map(event => {
                  const eventRegistrations = enquiries.filter(e => e.program === event.name);
                  
                  return (
                    <div key={event.id} className="card mb-6" style={{ marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={20} style={{ color: '#dc2626' }} /> {event.name}
                          </h4>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                            {eventRegistrations.length} Registrations
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {event.fee && <span className="badge badge-gold">Fee: {event.fee}</span>}
                          <button
                            onClick={() => {
                              setAddEventParticipantModal({ isOpen: true, eventName: event.name, eventFee: event.fee || '' });
                              setAddParticipantForm({ studentName: '', age: '', parentName: '', phone: '', email: '', address: '', utrNumber: '', status: 'Approved' });
                            }}
                            className="btn btn-sm"
                            style={{ background: '#dc2626', color: '#fff', padding: '6px 14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                          >
                            <Plus size={14} /> Add Student / Participant
                          </button>
                        </div>
                      </div>

                      {eventRegistrations.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                          No registrations for this event yet. Click "+ Add Student / Participant" to add manually.
                        </div>
                      ) : (
                        <div style={{ overflowX: 'auto', padding: '0 24px 24px 24px' }}>
                          <table className="admin-table" style={{ marginTop: '16px' }}>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Participant Details (Click for Full Info)</th>
                                <th>UTR / Payment Info</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {eventRegistrations.map(reg => (
                                <tr key={reg.id} style={{ cursor: 'pointer' }} title="Click to view full student details">
                                  <td style={{ fontSize: '0.85rem', color: '#64748b' }} onClick={() => setSelectedRegistration(reg)}>{reg.date || 'Recent'}</td>
                                  <td onClick={() => setSelectedRegistration(reg)}>
                                    <div style={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ color: '#2563eb', textDecoration: 'underline' }}>{reg.studentName}</span>
                                      <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px' }}>🔍 View Full Info</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>📱 {reg.phone}</div>
                                  </td>
                                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                    {reg.utrNumber ? (
                                      <span style={{ color: '#15803d' }}>{reg.utrNumber}</span>
                                    ) : (
                                      <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'normal' }}>No UTR (Free/Not Paid)</span>
                                    )}
                                  </td>
                                  <td>
                                    {reg.status === 'Approved' ? (
                                      <span className="badge badge-green">Approved</span>
                                    ) : reg.status === 'Rejected' ? (
                                      <span className="badge badge-red">Rejected</span>
                                    ) : (
                                      <span className="badge badge-yellow">Pending</span>
                                    )}
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                      {reg.status !== 'Approved' && (
                                        <button
                                          onClick={async () => {
                                            await fetch(`/api/enquiries/${reg.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Approved' }) });
                                            showNotification(`Registration Approved for ${reg.studentName}`);
                                            fetchAllAdminData();
                                          }}
                                          className="btn btn-sm"
                                          style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem' }}
                                        >
                                          Approve
                                        </button>
                                      )}
                                      {reg.status !== 'Rejected' && (
                                        <button
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            await fetch(`/api/enquiries/${reg.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Rejected' }) });
                                            showNotification(`Registration Rejected for ${reg.studentName}`);
                                            fetchAllAdminData();
                                          }}
                                          className="btn btn-sm"
                                          style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem' }}
                                        >
                                          Reject
                                        </button>
                                      )}
                                      <button
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          if (window.confirm(`Are you sure you want to delete registration for "${reg.studentName}"?`)) {
                                            await fetch(`/api/enquiries/${reg.id}`, { method: 'DELETE' });
                                            showNotification(`Deleted registration for ${reg.studentName}`);
                                            fetchAllAdminData();
                                          }
                                        }}
                                        className="btn btn-sm"
                                        style={{ background: '#7f1d1d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                                        title="Delete Registration"
                                      >
                                        <Trash2 size={13} /> Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 10: FEES */}
          {activeTab === 'fees' && (
            <div className="tab-pane">
              <h3 className="pane-title">Manage Fees & Pricing Tiers</h3>
              <form onSubmit={handleSaveFees} className="card p-6" style={{ padding: '24px' }}>
                {fees.map((fee, idx) => (
                  <div key={fee.id || idx} className="p-4 border rounded-md mb-4 bg-gray-50" style={{ padding: '16px', borderRadius: '8px', marginBottom: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <h4 className="font-bold text-lg mb-3 text-red" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#e52328', marginBottom: '12px' }}>{fee.programName}</h4>
                    <div className="grid grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      <div className="form-group">
                        <label>Monthly Fee</label>
                        <input type="text" value={fee.monthly} onChange={(e) => { const newFees = [...fees]; newFees[idx].monthly = e.target.value; setFees(newFees); }} className="form-control" />
                      </div>
                      <div className="form-group">
                        <label>Yearly Fee</label>
                        <input type="text" value={fee.yearly} onChange={(e) => { const newFees = [...fees]; newFees[idx].yearly = e.target.value; setFees(newFees); }} className="form-control" />
                      </div>
                      <div className="form-group">
                        <label>Reg Fee</label>
                        <input type="text" value={fee.regFee} onChange={(e) => { const newFees = [...fees]; newFees[idx].regFee = e.target.value; setFees(newFees); }} className="form-control" />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="submit" className="btn btn-primary-red mt-4">
                  <Save size={16} /> UPDATE FEES STRUCTURE
                </button>
              </form>
            </div>
          )}

          {/* Duplicate small enquiries table removed in favor of the detailed one below */}

          {/* TAB: FEE APPROVALS */}
          {activeTab === 'fee-approvals' && (
            <div className="tab-pane">
              <h3 className="pane-title">Fee Payment Approvals</h3>

              {(() => {
                const pendingPayments = (allPayments || []).filter(p => p && p.status === 'Pending');
                return pendingPayments.length > 0 ? (
                  <div className="card mb-6" style={{ padding: '24px', background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '12px', marginBottom: '24px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', margin: '0 0 16px 0', color: '#92400e' }}>
                      <Clock size={20} /> Pending Student Fee Approvals ({pendingPayments.length})
                    </h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Student ID</th>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>UTR Number</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingPayments.map(p => {
                            const parentStudent = students.find(s => s.id === p.studentId);
                            return (
                            <tr key={p.id}>
                              <td><strong>{p.studentName}</strong></td>
                              <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>{p.studentId}</code></td>
                              <td>{p.month}</td>
                              <td style={{ fontWeight: 'bold', color: '#e52328' }}>{p.amount}</td>
                              <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{p.utrNumber}</td>
                              <td>{p.paymentDate}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    onClick={async () => {
                                      await fetch(`/api/admin/payments/${p.id}/approve`, { method: 'PATCH' });
                                      showNotification(`Payment approved for ${p.studentName} (${p.month})`);
                                      fetchAllAdminData();
                                    }}
                                    className="btn btn-sm"
                                    style={{ background: '#16a34a', color: '#fff', padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Check size={14} /> Approve
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (parentStudent) {
                                        await fetch(`/api/admin/students/${parentStudent.id}/reject-payment`, { method: 'POST' });
                                        showNotification(`Payment Rejected for ${p.studentName}`);
                                        fetchAllAdminData();
                                      }
                                    }}
                                    className="btn btn-sm"
                                    style={{ background: '#dc2626', color: '#fff', padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <X size={14} /> Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="card" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                    <CheckCircle size={48} style={{ margin: '0 auto 16px', color: '#16a34a', opacity: 0.2 }} />
                    <h4 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: '#1e293b' }}>All caught up!</h4>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB: STUDENT DIRECTORY */}
          {activeTab === 'students' && (
            <div className="tab-pane">
              <h3 className="pane-title">Student Directory</h3>

              {/* Student Directory Table */}
              <div className="admin-table-wrap card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 16px' }}>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Registered students who created accounts via the Student Portal.</p>
                  <button
                    onClick={() => {
                      setEditingItem({ studentName: '', parentName: '', phone: '', password: '', program: programs.length > 0 ? programs[0].name : 'Kids Taekwondo', belt: 'White Belt', monthlyFee: '₹1,000', status: 'Active' });
                      setModalType('student');
                    }}
                    className="btn btn-sm"
                    style={{ background: '#e52328', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Add Student
                  </button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Parent</th>
                      <th>Phone</th>
                      <th>Program</th>
                      <th>Uploaded Documents</th>
                      <th>Belt</th>
                      <th>This Month Fee</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.filter(s => s.status !== 'Pending Enquiry').length > 0 ? students.filter(s => s.status !== 'Pending Enquiry').map(s => (
                      <tr key={s.id}>
                        <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>{s.id}</code></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {s.photoUrl ? (
                              <img src={s.photoUrl} alt={s.studentName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e52328' }} />
                            ) : (
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {s.studentName ? s.studentName.charAt(0).toUpperCase() : 'S'}
                              </div>
                            )}
                            <strong>{s.studentName}</strong>
                          </div>
                        </td>
                        <td>
                          <div>{s.parentName || '-'}</div>
                          {s.address && <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>🏠 {s.address}</div>}
                        </td>
                        <td><a href={`tel:${s.phone}`} className="text-blue">{s.phone}</a></td>
                        <td><span className="badge badge-blue" style={{ fontSize: '0.8rem' }}>{s.program}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {s.photoUrl && (
                              <a href={s.photoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
                                📸 Photo
                              </a>
                            )}
                            {s.birthCertUrl && (
                              <a href={s.birthCertUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
                                📄 Birth Cert
                              </a>
                            )}
                            {s.aadharUrl && (
                              <a href={s.aadharUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
                                🪪 Aadhar
                              </a>
                            )}
                            {!s.photoUrl && !s.birthCertUrl && !s.aadharUrl && (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>None</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <select
                            value={s.belt || 'White Belt'}
                            onChange={async (e) => {
                              await fetch(`/api/admin/students/${s.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ belt: e.target.value })
                              });
                              showNotification(`${s.studentName}'s belt updated to ${e.target.value}`);
                              fetchAllAdminData();
                            }}
                            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '0.85rem' }}
                          >
                            <option value="White Belt">⬜ White Belt</option>
                            <option value="Yellow Belt">🟡 Yellow Belt</option>
                            <option value="Green Belt">🟢 Green Belt</option>
                            <option value="Blue Belt">🔵 Blue Belt</option>
                            <option value="Red Belt">🔴 Red Belt</option>
                            <option value="Black Belt">⬛ Black Belt</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                            {s.currentMonthStatus === 'Paid' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                <CheckCircle size={12} /> Paid
                              </span>
                            ) : s.currentMonthStatus === 'Pending' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                <Clock size={12} /> Pending Approval
                              </span>
                            ) : s.currentMonthStatus === 'Rejected' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                <AlertCircle size={12} /> Rejected
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                Due
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setEditingItem({ ...s });
                              setModalType('student');
                            }}
                            className="action-icon edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete student ${s.studentName}?`)) {
                                await fetch(`/api/admin/students/${s.id}`, { method: 'DELETE' });
                                showNotification(`Student ${s.studentName} deleted`);
                                fetchAllAdminData();
                              }
                            }}
                            className="action-icon delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                          No registered students yet. Students can register via the Student Portal.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT / QR CODE SETTINGS */}
          {activeTab === 'payment' && payment && (
            <div className="tab-pane">
              <h3 className="pane-title" style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '24px' }}>Payment / QR Code Settings</h3>
              
              <form onSubmit={handleSavePayment} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Enable Checkbox */}
                <div style={{ background: '#ffffff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="checkbox" 
                    id="enablePayment" 
                    checked={payment.isEnabled !== false} 
                    onChange={(e) => setPayment({ ...payment, isEnabled: e.target.checked })} 
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="enablePayment" style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', margin: 0 }}>
                    Enable Payment Page on Website
                  </label>
                </div>

                {/* Primary UPI QR Code Card (Light Red) */}
                <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#dc2626' }}>
                    <QrCode size={20} />
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#dc2626' }}>Primary UPI QR Code</h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
                    {/* Left Column: Image URL + Upload + Preview */}
                    <div>
                      <div className="form-group mb-3">
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem' }}>QR Code Image</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input 
                            type="text" 
                            value={payment.qrCodeImage || ''} 
                            onChange={(e) => setPayment({ ...payment, qrCodeImage: e.target.value })} 
                            className="form-control" 
                            style={{ flex: 1 }}
                          />
                          <label className="btn btn-outline-dark" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>
                            <Upload size={14} /> UPLOAD
                            <input 
                              type="file" 
                              style={{ display: 'none' }}
                              onChange={async (e) => { 
                                if (e.target.files[0]) { 
                                  const url = await handleFileUpload(e.target.files[0]); 
                                  setPayment({ ...payment, qrCodeImage: url }); 
                                } 
                              }} 
                            />
                          </label>
                        </div>
                      </div>

                      {payment.qrCodeImage && (
                        <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #fecaca', display: 'inline-block', marginTop: '8px' }}>
                          <img src={payment.qrCodeImage} alt="Primary QR Preview" style={{ width: '160px', height: '160px', objectFit: 'contain', display: 'block', borderRadius: '6px' }} />
                        </div>
                      )}
                    </div>

                    {/* Right Column: Account Name + UPI ID */}
                    <div>
                      <div className="form-group mb-4">
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem' }}>Account / Business Name</label>
                        <input 
                          type="text" 
                          value={payment.accountName || ''} 
                          onChange={(e) => setPayment({ ...payment, accountName: e.target.value })} 
                          className="form-control" 
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem' }}>UPI ID</label>
                        <input 
                          type="text" 
                          value={payment.upiId || ''} 
                          onChange={(e) => setPayment({ ...payment, upiId: e.target.value })} 
                          className="form-control" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions / Note for Students Card */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.95rem' }}>Payment Instructions / Note for Students</label>
                    <textarea 
                      value={payment.paymentNote || ''} 
                      onChange={(e) => setPayment({ ...payment, paymentNote: e.target.value })} 
                      className="form-control" 
                      rows="3"
                      placeholder="Please mention student name and program while making payment."
                    ></textarea>
                  </div>
                </div>

                {/* Bank Transfer Details Card (Light Yellow) */}
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#92400e' }}>
                    <DollarSign size={20} />
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#92400e' }}>Bank Transfer Details (Optional)</h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem', color: '#78350f' }}>Account Holder Name</label>
                      <input 
                        type="text" 
                        value={payment.bankDetails?.accountHolder || ''} 
                        onChange={(e) => setPayment({ ...payment, bankDetails: { ...(payment.bankDetails || {}), accountHolder: e.target.value } })} 
                        className="form-control" 
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem', color: '#78350f' }}>Account Number</label>
                      <input 
                        type="text" 
                        value={payment.bankDetails?.accountNumber || ''} 
                        onChange={(e) => setPayment({ ...payment, bankDetails: { ...(payment.bankDetails || {}), accountNumber: e.target.value } })} 
                        className="form-control" 
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem', color: '#78350f' }}>IFSC Code</label>
                      <input 
                        type="text" 
                        value={payment.bankDetails?.ifscCode || ''} 
                        onChange={(e) => setPayment({ ...payment, bankDetails: { ...(payment.bankDetails || {}), ifscCode: e.target.value } })} 
                        className="form-control" 
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem', color: '#78350f' }}>Bank Name</label>
                      <input 
                        type="text" 
                        value={payment.bankDetails?.bankName || ''} 
                        onChange={(e) => setPayment({ ...payment, bankDetails: { ...(payment.bankDetails || {}), bankName: e.target.value } })} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                </div>

                {/* Additional QR Codes Card (Light Blue) */}
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
                      <QrCode size={20} />
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#0284c7' }}>Additional QR Codes (Optional)</h4>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const existing = payment.additionalQrCodes || [];
                        setPayment({
                          ...payment,
                          additionalQrCodes: [...existing, { label: 'UPI Option 2', imageUrl: '' }]
                        });
                      }}
                      className="btn btn-outline-dark"
                      style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: 'bold', background: '#ffffff' }}
                    >
                      + ADD QR CODE
                    </button>
                  </div>

                  {(payment.additionalQrCodes || []).length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {payment.additionalQrCodes.map((qr, idx) => (
                        <div key={idx} style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e0f2fe', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Label</label>
                            <input 
                              type="text" 
                              value={qr.label || ''} 
                              onChange={(e) => {
                                const list = [...payment.additionalQrCodes];
                                list[idx].label = e.target.value;
                                setPayment({ ...payment, additionalQrCodes: list });
                              }}
                              className="form-control" 
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Image URL</label>
                            <input 
                              type="text" 
                              value={qr.imageUrl || ''} 
                              onChange={(e) => {
                                const list = [...payment.additionalQrCodes];
                                list[idx].imageUrl = e.target.value;
                                setPayment({ ...payment, additionalQrCodes: list });
                              }}
                              className="form-control" 
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const list = payment.additionalQrCodes.filter((_, i) => i !== idx);
                              setPayment({ ...payment, additionalQrCodes: list });
                            }}
                            className="action-icon delete"
                            style={{ marginTop: '18px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Save Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary-red" 
                  style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}
                >
                  <Save size={18} /> SAVE PAYMENT SETTINGS
                </button>
              </form>
            </div>
          )}

          {/* TAB: ENQUIRIES & ADMISSION REQUESTS */}
          {activeTab === 'enquiries' && (
            <div className="tab-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 className="pane-title" style={{ margin: 0 }}>Admission Enquiries & Contact Requests</h3>
                  <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>Review, approve, or decline prospective student enquiries.</p>
                </div>
                
                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                  {['All', 'New', 'Approved', 'Rejected'].map(filter => {
                    const combinedEnquiries = [
                      ...enquiries.filter(e => !events.some(ev => ev.name === e.program)).map(e => ({ ...e, _type: 'enquiry' })),
                      ...students.filter(s => s.status === 'Pending Enquiry' || s.status === 'Rejected').map(s => ({
                        ...s,
                        _type: 'student_reg',
                        name: s.studentName,
                        message: 'New Student Registration submitted via Student Portal.',
                        date: s.joiningDate
                      }))
                    ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

                    const baseEnquiries = combinedEnquiries;
                    const count = filter === 'All' 
                      ? baseEnquiries.length 
                      : baseEnquiries.filter(e => filter === 'New' ? (e.status === 'New' || e.status === 'Pending' || e.status === 'Pending Enquiry' || !e.status) : e.status === filter).length;
                    
                    return (
                      <button
                        key={filter}
                        onClick={() => setEnquiryFilter(filter)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          background: enquiryFilter === filter ? '#dc2626' : 'transparent',
                          color: enquiryFilter === filter ? '#ffffff' : '#64748b',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {filter} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card p-6" style={{ padding: '0', overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student / Contact Details</th>
                      <th>Program Interested</th>
                      <th>Message / Inquiry</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const combinedEnquiries = [
                        ...enquiries.filter(e => !events.some(ev => ev.name === e.program)).map(e => ({ ...e, _type: 'enquiry' })),
                        ...students.filter(s => s.status === 'Pending Enquiry' || s.status === 'Rejected').map(s => ({
                          ...s,
                          _type: 'student_reg',
                          name: s.studentName,
                          message: 'New Student Registration submitted via Student Portal.',
                          date: s.joiningDate
                        }))
                      ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

                      const filteredEnquiries = combinedEnquiries.filter(e => {
                        if (enquiryFilter === 'All') return true;
                        if (enquiryFilter === 'New') return e.status === 'New' || e.status === 'Pending' || e.status === 'Pending Enquiry' || !e.status;
                        return e.status === enquiryFilter;
                      });

                      if (filteredEnquiries.length === 0) {
                        return (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                              No {enquiryFilter.toLowerCase()} enquiries found.
                            </td>
                          </tr>
                        );
                      }

                      return filteredEnquiries.map(e => (
                        <tr key={e.id} style={{ cursor: 'pointer' }} title="Click to view full details">
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#64748b' }} onClick={() => setSelectedRegistration(e)}>
                            {e.date || 'Recent'}
                          </td>
                          <td onClick={() => setSelectedRegistration(e)}>
                            <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#2563eb', textDecoration: 'underline' }}>{e.studentName || e.name || 'Anonymous'}</span>
                              <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px' }}>🔍 View Full Info</span>
                            </div>
                            {e.age && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Age: {e.age} yrs</div>}
                            {e.parentName && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Parent: {e.parentName}</div>}
                            <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '500', marginTop: '2px' }}>
                              {e.phone} {e.email && `| ${e.email}`}
                            </div>
                            {e.address && <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>🏠 {e.address}</div>}
                          </td>
                          <td>
                            <span className="badge badge-blue" style={{ fontSize: '0.8rem' }}>
                              {e.program || 'General Inquiry'}
                            </span>
                          </td>
                          <td style={{ maxWidth: '300px' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>
                              {e.message || 'No additional message provided.'}
                            </p>
                          </td>
                          <td>
                            {(e.status === 'New' || e.status === 'Pending' || e.status === 'Pending Enquiry' || !e.status) && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                <Clock size={12} /> New Request
                              </span>
                            )}
                            {e.status === 'Approved' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                <CheckCircle size={12} /> Approved
                              </span>
                            )}
                            {e.status === 'Rejected' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                <AlertCircle size={12} /> Rejected
                              </span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              {/* APPROVE BUTTON */}
                              {e.status !== 'Approved' && e.status !== 'Active' && (
                                <button
                                  onClick={async () => {
                                    if (e._type === 'student_reg') {
                                      await fetch(`/api/admin/students/${e.id}/approve-enquiry`, { method: 'PATCH' });
                                    } else {
                                      await fetch(`/api/enquiries/${e.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: 'Approved' })
                                      });
                                    }
                                    showNotification(`Registration/Enquiry from ${e.studentName || e.name || 'Student'} Approved!`);
                                    fetchAllAdminData();
                                  }}
                                  className="btn btn-sm"
                                  style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  title="Approve enquiry / admission request"
                                >
                                  <Check size={14} /> Approve
                                </button>
                              )}

                              {/* REJECT BUTTON */}
                              {e.status !== 'Rejected' && (
                                <button
                                  onClick={async () => {
                                    if (e._type === 'student_reg') {
                                      await fetch(`/api/admin/students/${e.id}/reject-enquiry`, { method: 'PATCH' });
                                    } else {
                                      await fetch(`/api/enquiries/${e.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: 'Rejected' })
                                      });
                                    }
                                    showNotification(`Registration/Enquiry from ${e.studentName || e.name || 'Student'} Rejected`);
                                    fetchAllAdminData();
                                  }}
                                  className="btn btn-sm"
                                  style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  title="Reject enquiry / admission request"
                                >
                                  <X size={14} /> Reject
                                </button>
                              )}

                              {/* DELETE BUTTON */}
                              <button
                                onClick={async () => {
                                  if (confirm(`Delete enquiry from ${e.studentName || 'Student'}?`)) {
                                    await fetch(`/api/enquiries/${e.id}`, { method: 'DELETE' });
                                    showNotification(`Enquiry deleted`);
                                    fetchAllAdminData();
                                  }
                                }}
                                className="action-icon delete"
                                title="Delete enquiry record"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* EDITING MODAL */}
      {modalType && editingItem && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalType(null)}><X size={20} /></button>

            <h3 className="text-xl font-bold mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>
              {editingItem.id ? 'Edit' : 'Add'} {modalType.toUpperCase()}
            </h3>

            <form onSubmit={handleSaveEntity}>
              {/* Program Fields */}
              {modalType === 'program' && (
                <>
                  <div className="form-group">
                    <label>Program Name</label>
                    <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} required className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} required className="form-control" rows="3"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Age Group</label>
                      <input type="text" value={editingItem.ageGroup} onChange={(e) => setEditingItem({ ...editingItem, ageGroup: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Fee</label>
                      <input type="text" value={editingItem.fee} onChange={(e) => setEditingItem({ ...editingItem, fee: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="text" value={editingItem.image} onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })} className="form-control" />
                    <input type="file" onChange={async (e) => { if (e.target.files[0]) { const url = await handleFileUpload(e.target.files[0]); setEditingItem({ ...editingItem, image: url }); } }} className="form-control mt-2" />
                  </div>
                </>
              )}

              {/* Coach Fields */}
              {modalType === 'coach' && (
                <>
                  <div className="form-group">
                    <label>Coach Name</label>
                    <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} required className="form-control" />
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Position</label>
                      <input type="text" value={editingItem.position} onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Belt / Dan Rank</label>
                      <input type="text" value={editingItem.beltDan} onChange={(e) => setEditingItem({ ...editingItem, beltDan: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Biography</label>
                    <textarea value={editingItem.bio} onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })} className="form-control" rows="3"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Photo URL</label>
                    <input type="text" value={editingItem.photo} onChange={(e) => setEditingItem({ ...editingItem, photo: e.target.value })} className="form-control" />
                    <input type="file" onChange={async (e) => { if (e.target.files[0]) { const url = await handleFileUpload(e.target.files[0]); setEditingItem({ ...editingItem, photo: url }); } }} className="form-control mt-2" />
                  </div>
                </>
              )}

              {/* Achievement Fields */}
              {modalType === 'achievement' && (
                <>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Athlete Name</label>
                      <input type="text" value={editingItem.athleteName} onChange={(e) => setEditingItem({ ...editingItem, athleteName: e.target.value })} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Medal / Result</label>
                      <select value={editingItem.medal} onChange={(e) => setEditingItem({ ...editingItem, medal: e.target.value })} className="form-control">
                        <option value="Gold">Gold Medal (🥇)</option>
                        <option value="Silver">Silver Medal (🥈)</option>
                        <option value="Bronze">Bronze Medal (🥉)</option>
                        <option value="Award">Best Academy Award (🏆)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tournament Name</label>
                    <input type="text" value={editingItem.tournamentName} onChange={(e) => setEditingItem({ ...editingItem, tournamentName: e.target.value })} required className="form-control" />
                  </div>
                  <div className="grid grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Year</label>
                      <input type="text" value={editingItem.year} onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input type="text" value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Weight Category</label>
                      <input type="text" value={editingItem.weightCategory} onChange={(e) => setEditingItem({ ...editingItem, weightCategory: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Achievement Image</label>
                    <input type="text" value={editingItem.image} onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })} className="form-control" />
                    <input type="file" onChange={async (e) => { if (e.target.files[0]) { const url = await handleFileUpload(e.target.files[0]); setEditingItem({ ...editingItem, image: url }); } }} className="form-control mt-2" />
                  </div>
                </>
              )}

              {/* Gallery Fields */}
              {modalType === 'gallery' && (
                <>
                  <div className="form-group">
                    <label>Photo Title</label>
                    <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} required className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="form-control">
                      <option value="TRAINING">TRAINING</option>
                      <option value="TOURNAMENTS">TOURNAMENTS</option>
                      <option value="CHAMPIONSHIPS">CHAMPIONSHIPS</option>
                      <option value="EVENTS">EVENTS</option>
                      <option value="BELT EXAMINATIONS">BELT EXAMINATIONS</option>
                      <option value="ACADEMY LIFE">ACADEMY LIFE</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="text" value={editingItem.imageUrl} onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })} className="form-control" />
                    <input type="file" onChange={async (e) => { if (e.target.files[0]) { const url = await handleFileUpload(e.target.files[0]); setEditingItem({ ...editingItem, imageUrl: url }); } }} className="form-control mt-2" />
                  </div>
                </>
              )}

              {/* Video Fields */}
              {modalType === 'video' && (
                <>
                  <div className="form-group">
                    <label>Video Title</label>
                    <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} required className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>YouTube URL</label>
                    <input type="text" value={editingItem.youtubeUrl} onChange={(e) => setEditingItem({ ...editingItem, youtubeUrl: e.target.value })} required className="form-control" placeholder="https://www.youtube.com/watch?v=..." />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="form-control">
                      <option value="Training">Training</option>
                      <option value="Tournaments">Tournaments</option>
                      <option value="Events">Events</option>
                      <option value="Achievements">Achievements</option>
                      <option value="Academy">Academy</option>
                    </select>
                  </div>
                </>
              )}

              {/* Event Fields */}
              {modalType === 'event' && (
                <>
                  <div className="form-group">
                    <label>Event Name</label>
                    <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} required className="form-control" />
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Date (YYYY-MM-DD)</label>
                      <input type="date" value={editingItem.date} onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Location / Venue</label>
                      <input type="text" value={editingItem.location} onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Event Registration Fee (₹)</label>
                    <input type="text" value={editingItem.fee || ''} onChange={(e) => setEditingItem({ ...editingItem, fee: e.target.value })} placeholder="e.g. ₹500 (Leave blank if free)" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="form-control" rows="3"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Poster Image</label>
                    <input type="text" value={editingItem.posterUrl} onChange={(e) => setEditingItem({ ...editingItem, posterUrl: e.target.value })} className="form-control" />
                    <input type="file" onChange={async (e) => { if (e.target.files[0]) { const url = await handleFileUpload(e.target.files[0]); setEditingItem({ ...editingItem, posterUrl: url }); } }} className="form-control mt-2" />
                  </div>
                </>
              )}

              {/* Student Fields */}
              {modalType === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Student Name *</label>
                      <input type="text" value={editingItem.studentName || ''} onChange={(e) => setEditingItem({ ...editingItem, studentName: e.target.value })} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Parent Name</label>
                      <input type="text" value={editingItem.parentName || ''} onChange={(e) => setEditingItem({ ...editingItem, parentName: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input type="tel" value={editingItem.phone || ''} onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Password *</label>
                      <input type="text" value={editingItem.password || ''} onChange={(e) => setEditingItem({ ...editingItem, password: e.target.value })} required className="form-control" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Program</label>
                      <select value={editingItem.program || ''} onChange={(e) => setEditingItem({ ...editingItem, program: e.target.value })} className="form-control">
                        {programs.length > 0 ? programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>) : (
                          <>
                            <option value="Kids Taekwondo">Kids Taekwondo</option>
                            <option value="Beginners Course">Beginners Course</option>
                            <option value="Advanced Training">Advanced Training</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Belt Rank</label>
                      <select value={editingItem.belt || 'White Belt'} onChange={(e) => setEditingItem({ ...editingItem, belt: e.target.value })} className="form-control">
                        <option value="White Belt">⬜ White Belt</option>
                        <option value="Yellow Belt">🟡 Yellow Belt</option>
                        <option value="Green Belt">🟢 Green Belt</option>
                        <option value="Blue Belt">🔵 Blue Belt</option>
                        <option value="Red Belt">🔴 Red Belt</option>
                        <option value="Black Belt">⬛ Black Belt</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Monthly Fee</label>
                      <input type="text" value={editingItem.monthlyFee || '₹1,000'} onChange={(e) => setEditingItem({ ...editingItem, monthlyFee: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select value={editingItem.status || 'Active'} onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })} className="form-control">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Student Fields */}
              {modalType === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Student Name *</label>
                      <input type="text" value={editingItem.studentName || ''} onChange={(e) => setEditingItem({ ...editingItem, studentName: e.target.value })} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Parent Name</label>
                      <input type="text" value={editingItem.parentName || ''} onChange={(e) => setEditingItem({ ...editingItem, parentName: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input type="tel" value={editingItem.phone || ''} onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Password *</label>
                      <input type="text" value={editingItem.password || ''} onChange={(e) => setEditingItem({ ...editingItem, password: e.target.value })} required className="form-control" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Program</label>
                      <select value={editingItem.program || ''} onChange={(e) => setEditingItem({ ...editingItem, program: e.target.value })} className="form-control">
                        {programs.length > 0 ? programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>) : (
                          <>
                            <option value="Kids Taekwondo">Kids Taekwondo</option>
                            <option value="Beginners Course">Beginners Course</option>
                            <option value="Advanced Training">Advanced Training</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Belt Rank</label>
                      <select value={editingItem.belt || 'White Belt'} onChange={(e) => setEditingItem({ ...editingItem, belt: e.target.value })} className="form-control">
                        <option value="White Belt">⬜ White Belt</option>
                        <option value="Yellow Belt">🟡 Yellow Belt</option>
                        <option value="Green Belt">🟢 Green Belt</option>
                        <option value="Blue Belt">🔵 Blue Belt</option>
                        <option value="Red Belt">🔴 Red Belt</option>
                        <option value="Black Belt">⬛ Black Belt</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Monthly Fee</label>
                      <input type="text" value={editingItem.monthlyFee || '₹1,000'} onChange={(e) => setEditingItem({ ...editingItem, monthlyFee: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select value={editingItem.status || 'Active'} onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })} className="form-control">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary-red w-full mt-4" style={{ width: '100%' }}>
                SAVE CHANGES
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Participant Full Details Popup Modal */}
      {selectedRegistration && (
        <div className="modal-overlay" onClick={() => setSelectedRegistration(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '28px', borderRadius: '16px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📋 Student / Participant Full Details
              </h3>
              <button onClick={() => setSelectedRegistration(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>STUDENT / PARTICIPANT NAME</label>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{selectedRegistration.studentName || selectedRegistration.name || 'N/A'}</strong>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>EVENT / PROGRAM</label>
                <span className="badge badge-blue" style={{ fontSize: '0.85rem' }}>{selectedRegistration.program || 'General Inquiry'}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>MOBILE NUMBER</label>
                <a href={`tel:${selectedRegistration.phone}`} style={{ color: '#2563eb', fontWeight: 'bold' }}>📱 {selectedRegistration.phone || 'N/A'}</a>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>EMAIL ADDRESS</label>
                <span>{selectedRegistration.email || 'N/A'}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>PARENT / GUARDIAN NAME</label>
                <span>{selectedRegistration.parentName || 'N/A'}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>AGE</label>
                <span>{selectedRegistration.age ? `${selectedRegistration.age} years old` : 'N/A'}</span>
              </div>

              <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>ADDRESS / APARTMENT NAME</label>
                <span style={{ fontWeight: '700', color: '#1e293b' }}>🏠 {selectedRegistration.address || 'No address specified'}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>UTR / PAYMENT REF</label>
                {selectedRegistration.utrNumber ? (
                  <code style={{ background: '#f0fdf4', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', color: '#15803d', fontFamily: 'monospace' }}>
                    {selectedRegistration.utrNumber}
                  </code>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No UTR number</span>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>REGISTRATION STATUS</label>
                <span className={`badge ${selectedRegistration.status === 'Approved' ? 'badge-green' : selectedRegistration.status === 'Rejected' ? 'badge-red' : 'badge-yellow'}`}>
                  {selectedRegistration.status || 'Pending'}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>REGISTRATION DATE</label>
                <span>{selectedRegistration.date || 'Recent'}</span>
              </div>

              {selectedRegistration.message && (
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>REMARKS / MESSAGE</label>
                  <p style={{ margin: 0, background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '0.88rem' }}>
                    {selectedRegistration.message}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              {selectedRegistration.status !== 'Approved' && (
                <button
                  onClick={async () => {
                    await fetch(`/api/enquiries/${selectedRegistration.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Approved' }) });
                    showNotification(`Registration Approved for ${selectedRegistration.studentName || selectedRegistration.name}`);
                    setSelectedRegistration(null);
                    fetchAllAdminData();
                  }}
                  className="btn btn-sm"
                  style={{ background: '#16a34a', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}
                >
                  ✓ APPROVE
                </button>
              )}
              {selectedRegistration.status !== 'Rejected' && (
                <button
                  onClick={async () => {
                    await fetch(`/api/enquiries/${selectedRegistration.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Rejected' }) });
                    showNotification(`Registration Rejected for ${selectedRegistration.studentName || selectedRegistration.name}`);
                    setSelectedRegistration(null);
                    fetchAllAdminData();
                  }}
                  className="btn btn-sm"
                  style={{ background: '#dc2626', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}
                >
                  ✕ REJECT
                </button>
              )}
              <button
                onClick={async () => {
                  if (window.confirm(`Delete registration for "${selectedRegistration.studentName || selectedRegistration.name}"?`)) {
                    await fetch(`/api/enquiries/${selectedRegistration.id}`, { method: 'DELETE' });
                    showNotification(`Deleted registration for ${selectedRegistration.studentName || selectedRegistration.name}`);
                    setSelectedRegistration(null);
                    fetchAllAdminData();
                  }
                }}
                className="btn btn-sm"
                style={{ background: '#7f1d1d', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={15} /> DELETE
              </button>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="btn btn-outline-dark btn-sm"
                style={{ padding: '8px 16px', borderRadius: '8px' }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant to Event Modal */}
      {addEventParticipantModal.isOpen && (
        <div className="modal-overlay" onClick={() => setAddEventParticipantModal({ isOpen: false, eventName: '', eventFee: '' })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: '28px', borderRadius: '16px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                  ➕ Add Student / Participant
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 'bold' }}>
                  Event: {addEventParticipantModal.eventName}
                </span>
              </div>
              <button onClick={() => setAddEventParticipantModal({ isOpen: false, eventName: '', eventFee: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const cleanPhone = (addParticipantForm.phone || '').replace(/\D/g, '');
              if (cleanPhone.length !== 10) {
                alert("Mobile Number MUST be exactly 10 digits (e.g. 9812345678).");
                return;
              }

              const cleanUtr = (addParticipantForm.utrNumber || '').replace(/\D/g, '');
              if (cleanUtr.length !== 12) {
                alert("UTR Transaction Number is MANDATORY and must be exactly 12 numeric digits (e.g. 328190283401).");
                return;
              }

              setSubmittingAddParticipant(true);
              try {
                const res = await fetch('/api/enquiries', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    studentName: addParticipantForm.studentName,
                    age: addParticipantForm.age,
                    parentName: addParticipantForm.parentName,
                    phone: cleanPhone,
                    email: addParticipantForm.email,
                    address: addParticipantForm.address,
                    program: addEventParticipantModal.eventName,
                    utrNumber: cleanUtr,
                    status: addParticipantForm.status || 'Approved',
                    message: '[Admin Manual Registration]'
                  })
                });
                if (!res.ok) throw new Error("Failed to add participant");
                showNotification(`Added ${addParticipantForm.studentName} to ${addEventParticipantModal.eventName}!`);
                setAddEventParticipantModal({ isOpen: false, eventName: '', eventFee: '' });
                fetchAllAdminData();
              } catch (err) {
                console.error(err);
                alert("Failed to add participant to event.");
              } finally {
                setSubmittingAddParticipant(false);
              }
            }}>
              <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Student / Participant Name *</label>
                  <input
                    type="text"
                    required
                    value={addParticipantForm.studentName}
                    onChange={(e) => setAddParticipantForm({ ...addParticipantForm, studentName: e.target.value })}
                    placeholder="Full Name"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Age *</label>
                  <input
                    type="number"
                    required
                    value={addParticipantForm.age}
                    onChange={(e) => setAddParticipantForm({ ...addParticipantForm, age: e.target.value })}
                    placeholder="e.g. 10"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    value={addParticipantForm.phone}
                    onChange={(e) => setAddParticipantForm({ ...addParticipantForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit mobile"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={addParticipantForm.parentName}
                    onChange={(e) => setAddParticipantForm({ ...addParticipantForm, parentName: e.target.value })}
                    placeholder="Parent name"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Address / Apartment Name *</label>
                <input
                  type="text"
                  required
                  value={addParticipantForm.address}
                  onChange={(e) => setAddParticipantForm({ ...addParticipantForm, address: e.target.value })}
                  placeholder="Apartment name"
                  className="form-control"
                />
              </div>

              <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>12-Digit UTR Number *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{12}"
                    maxLength={12}
                    required
                    value={addParticipantForm.utrNumber}
                    onChange={(e) => setAddParticipantForm({ ...addParticipantForm, utrNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                    placeholder="e.g. 328190283401"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Status</label>
                  <select
                    value={addParticipantForm.status}
                    onChange={(e) => setAddParticipantForm({ ...addParticipantForm, status: e.target.value })}
                    className="form-control"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setAddEventParticipantModal({ isOpen: false, eventName: '', eventFee: '' })}
                  className="btn btn-outline-dark btn-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submittingAddParticipant}
                  className="btn btn-primary-red btn-sm"
                  style={{ padding: '8px 20px', fontWeight: 'bold' }}
                >
                  {submittingAddParticipant ? "ADDING..." : "ADD PARTICIPANT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
        }
        .admin-sidebar {
          width: 260px;
          background: #0f172a;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .admin-brand {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .admin-brand-logo {
          height: 48px;
          width: auto;
          background: #ffffff;
          padding: 4px;
          border-radius: 8px;
        }
        .admin-brand h3 {
          color: #ffffff;
          font-size: 1.05rem;
          line-height: 1.1;
        }
        .admin-badge {
          font-size: 0.7rem;
          color: var(--accent-gold);
          font-weight: 800;
        }
        .admin-nav {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          overflow-y: auto;
        }
        .admin-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 14px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .admin-nav-btn:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.05);
        }
        .admin-nav-btn.active {
          color: #ffffff;
          background: var(--primary-red);
          font-weight: 700;
        }
        .enq-count-badge {
          background: #ef4444;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: auto;
        }
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .admin-topbar {
          background: #ffffff;
          padding: 20px 32px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-topbar h2 {
          font-size: 1.4rem;
        }
        .admin-toast {
          background: #10b981;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
        }
        .admin-body {
          padding: 32px;
          flex: 1;
        }
        .pane-title {
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .admin-stats-cards {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }
        .admin-stat-card {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .admin-stat-card.highlight {
          border-left: 4px solid var(--primary-red);
        }
        .admin-stat-card h4 {
          font-size: 1.8rem;
          line-height: 1;
        }
        .admin-stat-card p {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 600;
        }

        .admin-table-wrap {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .admin-table th {
          background: #f8fafc;
          padding: 12px 16px;
          color: #475569;
          font-weight: 700;
          border-bottom: 1px solid #e2e8f0;
        }
        .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .table-thumb {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 8px;
        }
        .action-btns {
          display: flex;
          gap: 8px;
        }
        .action-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-icon.edit:hover { background: #e0f2fe; color: #0284c7; }
        .action-icon.delete:hover { background: #fee2e2; color: #dc2626; }

        .admin-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .admin-gal-card img {
          height: 160px;
          width: 100%;
          object-fit: cover;
        }
        .admin-gal-body {
          padding: 14px;
        }
        .status-select {
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.8rem;
        }
        .status-select.new { background: #fee2e2; color: #dc2626; }
        .status-select.replied { background: #dcfce7; color: #16a34a; }

        @media (max-width: 1024px) {
          .admin-sidebar { width: 200px; }
          .admin-stats-cards { grid-template-columns: repeat(2, 1fr); }
          .admin-gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
