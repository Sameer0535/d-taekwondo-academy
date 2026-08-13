import React, { useState } from 'react';
import { 
  User, Lock, Phone, UserCheck, ShieldCheck, ArrowRight, 
  BookOpen, GraduationCap, CheckCircle, Upload, FileText, Image as ImageIcon,
  QrCode, IndianRupee, Send, Calendar, Award
} from 'lucide-react';

export default function StudentLogin({ onLoginSuccess, programs = [], fees = [], initialMode = 'login' }) {
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');

  React.useEffect(() => {
    setIsRegisterMode(initialMode === 'register');
  }, [initialMode]);
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState('');
  const [error, setError] = useState('');

  // Login State
  const [phoneOrId, setPhoneOrId] = useState('9812345678');
  const [password, setPassword] = useState('password123');

  // New Kids Registration State
  const [regData, setRegData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    dob: '',
    age: '',
    address: '',
    password: '',
    confirmPassword: '',
    program: programs.length > 0 ? programs[0].name : 'Kids Taekwondo',
    photoUrl: '',
    birthCertUrl: '',
    aadharUrl: ''
  });

  // Post-Registration Fee Step Modal
  const [showRegPayModal, setShowRegPayModal] = useState(false);
  const [createdStudent, setCreatedStudent] = useState(null);
  const [createdToken, setCreatedToken] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleFileUpload = async (file, docType) => {
    setUploadingDoc(docType);
    setError('');

    // Generate instant local Base64 DataURL so image displays immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      setRegData(prev => ({ ...prev, [docType]: base64Url }));
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setRegData(prev => ({ ...prev, [docType]: data.url }));
      }
    } catch (err) {
      console.warn("Backend upload warning, relying on local base64:", err);
    } finally {
      setUploadingDoc('');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneOrId, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");

      onLoginSuccess(data.student, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!regData.photoUrl) {
      setError("Please upload passport size photo of the child.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");

      setCreatedStudent(data.student);
      setCreatedToken(data.token);
      setShowRegPayModal(true); // Open Fee Payment Modal Step
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegUtrSubmit = async (e) => {
    e.preventDefault();
    if (!createdStudent) return;

    if (!utrNumber || utrNumber.trim().length < 6) {
      setError("Please enter a valid 12-digit UTR transaction number.");
      return;
    }

    setSubmittingUtr(true);
    setError('');

    // Find registration fee safely
    const safeFees = Array.isArray(fees) ? fees : [];
    const selectedProgramFee = safeFees.find(f => f.programName === createdStudent.program) || safeFees[0] || {};
    const regFee = selectedProgramFee.regFee || '₹500';

    try {
      const res = await fetch('/api/student/pay-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: createdStudent.id,
          studentName: createdStudent.studentName,
          month: 'Registration Fee',
          amount: regFee,
          utrNumber: utrNumber.trim()
        })
      });
      if (!res.ok) throw new Error("Failed to submit payment UTR.");

      setRegistrationComplete(true);
      setTimeout(() => {
        onLoginSuccess(createdStudent, createdToken);
      }, 2000);
    } catch (err) {
      console.error("UTR Submit Error:", err);
      setError(err.message || "Failed to submit UTR.");
    } finally {
      setSubmittingUtr(false);
    }
  };

  return (
    <div className="student-login-page">
      <div className="card login-card" style={{ maxWidth: isRegisterMode ? '640px' : '480px' }}>
        
        {/* Sleek Top Banner */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #e52328 0%, #b91c1c 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(229, 35, 40, 0.3)' }}>
            <GraduationCap size={30} />
          </div>
          <span className="badge badge-gold" style={{ letterSpacing: '1px', fontSize: '0.75rem', padding: '4px 12px' }}>D TAEKWONDO ACADEMY</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '8px 0 4px', color: '#0f172a' }}>
            {isRegisterMode ? "New Kids Admission & Registration" : "Student & Parent Portal"}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
            {isRegisterMode 
              ? "Register new child student, upload documents (Photo, Birth Cert, Aadhar) & get Student ID Card."
              : "Log in to check monthly fee status, belt grade & submit payment UTR."}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
          <button 
            type="button" 
            onClick={() => { setIsRegisterMode(false); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: !isRegisterMode ? '#ffffff' : 'transparent',
              color: !isRegisterMode ? '#e52328' : '#64748b',
              boxShadow: !isRegisterMode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            onClick={() => { setIsRegisterMode(true); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: isRegisterMode ? '#ffffff' : 'transparent',
              color: isRegisterMode ? '#e52328' : '#64748b',
              boxShadow: isRegisterMode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🆕 New Kids Registration
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', marginBottom: '20px', fontSize: '0.88rem', fontWeight: '500' }}>
            ⚠️ {error}
          </div>
        )}

        {!isRegisterMode ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group mb-4">
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem', color: '#334155' }}>Mobile Number or Student ID *</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  value={phoneOrId} 
                  onChange={(e) => setPhoneOrId(e.target.value)} 
                  required 
                  className="form-control" 
                  style={{ paddingLeft: '44px', height: '46px', borderRadius: '10px', fontSize: '0.95rem' }}
                  placeholder="e.g. 9812345678 or STU1001" 
                />
              </div>
            </div>

            <div className="form-group mb-6">
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem', color: '#334155' }}>Password *</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="form-control" 
                  style={{ paddingLeft: '44px', height: '46px', borderRadius: '10px', fontSize: '0.95rem' }}
                  placeholder="Enter your password" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary-red w-full" 
              style={{ width: '100%', height: '48px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(229,35,40,0.3)' }}
            >
              {loading ? "LOGGING IN..." : "LOG IN TO STUDENT PORTAL →"}
            </button>

            {/* Quick Demo Credentials Banner */}
            <div style={{ marginTop: '24px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#475569' }}>
              <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} color="#16a34a" /> Demo Student Login:
              </div>
              <div>Mobile / ID: <strong style={{ fontFamily: 'monospace' }}>9812345678</strong> | Password: <strong style={{ fontFamily: 'monospace' }}>password123</strong></div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            
            {/* Section 1: Child & Parent Details */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', color: '#e52328', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} /> 1. Child & Parent Personal Details
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="mb-3">
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Child / Student Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={regData.studentName} 
                    onChange={(e) => setRegData({ ...regData, studentName: e.target.value })} 
                    placeholder="e.g. Aarav Sharma" 
                    className="form-control" 
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Parent / Guardian Name *</label>
                  <input 
                    type="text" 
                    required
                    value={regData.parentName} 
                    onChange={(e) => setRegData({ ...regData, parentName: e.target.value })} 
                    placeholder="e.g. Vikram Sharma" 
                    className="form-control" 
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }} className="mb-3">
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Date of Birth *</label>
                  <input 
                    type="date" 
                    required
                    value={regData.dob} 
                    onChange={(e) => setRegData({ ...regData, dob: e.target.value })} 
                    className="form-control" 
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Age *</label>
                  <input 
                    type="number" 
                    required
                    value={regData.age} 
                    onChange={(e) => setRegData({ ...regData, age: e.target.value })} 
                    placeholder="e.g. 7" 
                    className="form-control" 
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Mobile Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={regData.phone} 
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })} 
                    placeholder="10-digit mobile" 
                    className="form-control" 
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Enrolled Course / Program</label>
                <select 
                  value={regData.program} 
                  onChange={(e) => setRegData({ ...regData, program: e.target.value })} 
                  className="form-control"
                  style={{ height: '42px', borderRadius: '8px' }}
                >
                  {programs.length > 0 ? (
                    programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)
                  ) : (
                    <>
                      <option value="Kids Taekwondo">Kids Taekwondo (Ages 4-12)</option>
                      <option value="Beginners Martial Arts">Beginners Martial Arts</option>
                      <option value="Advanced Belt Training">Advanced Belt Training</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group mb-3">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Address / Apartment Name *</label>
                <input 
                  type="text" 
                  required 
                  value={regData.address} 
                  onChange={(e) => setRegData({ ...regData, address: e.target.value })} 
                  placeholder="Apartment name" 
                  className="form-control" 
                  style={{ height: '42px', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Create Password *</label>
                  <input 
                    type="password" 
                    required 
                    value={regData.password} 
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })} 
                    placeholder="Password" 
                    className="form-control" 
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>Confirm Password *</label>
                  <input 
                    type="password" 
                    required 
                    value={regData.confirmPassword} 
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })} 
                    placeholder="Re-enter password" 
                    className="form-control" 
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Upload Documents */}
            <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '12px', border: '1px solid #fed7d7', marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', color: '#c53030', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Upload size={16} /> 2. Upload Student Documents
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                
                {/* 1. Passport Size Photo */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: '#1e293b' }}>
                    📸 Passport Photo *
                  </label>
                  {regData.photoUrl ? (
                    <div>
                      <img src={regData.photoUrl} alt="Passport Photo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 6px', border: '2px solid #16a34a', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>✓ Photo Ready</span>
                        <button type="button" onClick={() => setRegData(prev => ({ ...prev, photoUrl: '' }))} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}>Change</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        accept="image/*"
                        id="photoInput"
                        style={{ display: 'none' }}
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'photoUrl')} 
                      />
                      <label htmlFor="photoInput" style={{ cursor: 'pointer', display: 'inline-block', background: '#e52328', color: '#ffffff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '6px' }}>
                        {uploadingDoc === 'photoUrl' ? 'Uploading...' : '📁 Select Photo File'}
                      </label>
                      <input 
                        type="text" 
                        placeholder="Or paste Photo URL" 
                        value={regData.photoUrl} 
                        onChange={(e) => setRegData(prev => ({ ...prev, photoUrl: e.target.value }))}
                        className="form-control"
                        style={{ height: '30px', fontSize: '0.75rem', borderRadius: '4px', textAlign: 'center' }}
                      />
                    </div>
                  )}
                </div>

                {/* 2. Birth Certificate */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: '#1e293b' }}>
                    📄 Birth Certificate
                  </label>
                  {regData.birthCertUrl ? (
                    <div>
                      <FileText size={24} style={{ color: '#16a34a', margin: '0 auto 6px' }} />
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold', display: 'block' }}>✓ Uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        id="birthCertInput"
                        style={{ display: 'none' }}
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'birthCertUrl')} 
                      />
                      <label htmlFor="birthCertInput" style={{ cursor: 'pointer', display: 'inline-block', background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {uploadingDoc === 'birthCertUrl' ? 'Uploading...' : 'Upload Doc'}
                      </label>
                    </div>
                  )}
                </div>

                {/* 3. Aadhar Card */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '6px', color: '#1e293b' }}>
                    🪪 Aadhar Card
                  </label>
                  {regData.aadharUrl ? (
                    <div>
                      <FileText size={24} style={{ color: '#16a34a', margin: '0 auto 6px' }} />
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold', display: 'block' }}>✓ Uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        id="aadharInput"
                        style={{ display: 'none' }}
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'aadharUrl')} 
                      />
                      <label htmlFor="aadharInput" style={{ cursor: 'pointer', display: 'inline-block', background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {uploadingDoc === 'aadharUrl' ? 'Uploading...' : 'Upload Doc'}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

              {error && (
                <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', marginBottom: '20px', fontSize: '0.88rem', fontWeight: '500' }}>
                  ⚠️ {error}
                </div>
              )}
              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary-red w-full" 
                style={{ width: '100%', minHeight: '52px', height: 'auto', padding: '12px 18px', borderRadius: '12px', fontSize: '0.96rem', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(229,35,40,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: '1.3' }}
              >
                {loading ? "REGISTERING STUDENT..." : "REGISTER STUDENT & PROCEED TO FEE PAYMENT →"}
              </button>
            </form>
          )}
      </div>

      {/* FEE PAYMENT POPUP MODAL AFTER REGISTRATION */}
      {showRegPayModal && createdStudent && (() => {
        const selectedProgramFee = fees.find(f => f.programName === createdStudent.program) || fees[0] || {};
        const displayRegFee = selectedProgramFee.regFee || '₹500 (One-time)';

        return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px 12px' }}>
          <div className="card p-6" style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '520px', width: '100%', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', padding: '24px 20px', maxHeight: '94vh', overflowY: 'auto' }}>
            
            {!registrationComplete ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <span className="badge badge-gold mb-2" style={{ fontSize: '0.8rem' }}>REGISTRATION SUCCESSFUL 🎉</span>
                  <h3 style={{ fontSize: '1.35rem', margin: '4px 0', fontWeight: 'bold' }}>Step 2: Pay Admission / Registration Fee</h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                    Student ID Generated: <strong style={{ color: '#e52328', fontFamily: 'monospace', fontSize: '1rem' }}>{createdStudent.id}</strong>
                  </p>
                </div>

                {/* QR Code & Payment Info */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '20px' }}>
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=dtaekwondo@upi" 
                    alt="UPI QR Code" 
                    style={{ width: '140px', height: '140px', margin: '0 auto 10px', display: 'block', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <h4 style={{ margin: '4px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 'bold' }}>
                    Registration Fee: {displayRegFee}
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Scan with PhonePe, Google Pay, Paytm or BHIM UPI
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    UPI ID: <code>dtaekwondo@upi</code>
                  </p>
                </div>

                {/* UTR Form */}
                {error && <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '14px', fontSize: '0.85rem' }}>{error}</div>}

                <form onSubmit={handleRegUtrSubmit}>
                  <div className="form-group mb-4" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.88rem' }}>
                      Enter 12-Digit UPI Transaction UTR Number *
                    </label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required 
                      value={utrNumber} 
                      onChange={(e) => setUtrNumber(e.target.value)} 
                      placeholder="e.g. 328190283401" 
                      className="form-control" 
                      style={{ height: '46px', borderRadius: '10px', fontSize: '16px', fontFamily: 'monospace', letterSpacing: '1px' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submittingUtr} 
                    className="btn btn-primary-red w-full" 
                    style={{ width: '100%', minHeight: '50px', height: 'auto', padding: '12px 16px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', lineHeight: '1.3', textAlign: 'center' }}
                  >
                    <Send size={16} /> {submittingUtr ? "SUBMITTING UTR..." : "SUBMIT UTR & GENERATE ID CARD →"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={60} style={{ color: '#16a34a', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.6rem', color: '#15803d', margin: '0 0 8px' }}>Registration & Payment Complete!</h3>
                <p style={{ fontSize: '0.95rem', color: '#475569' }}>
                  Student ID <strong style={{ fontFamily: 'monospace' }}>{createdStudent.id}</strong> has been generated. Redirecting to your Student Portal...
                </p>
              </div>
            )}

          </div>
        </div>
        );
      })()}

      <style>{`
        .student-login-page {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%);
        }
        .login-card {
          width: 100%;
          padding: 36px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 50px -15px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </div>
  );
}
