import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Calendar, DollarSign, Award, CheckCircle2, 
  AlertCircle, Clock, QrCode, LogOut, IndianRupee, RefreshCw, Send, Check
} from 'lucide-react';

export default function StudentDashboard({ student, onLogout, paymentSettings, settings }) {
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);

  // UTR Form State
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [payMessage, setPayMessage] = useState('');
  const [payError, setPayError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/dashboard/${student.id}`);
      if (!res.ok) throw new Error("Failed to load student data.");
      const data = await res.json();
      setDashData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student?.id) {
      fetchDashboardData();
    }
  }, [student?.id]);

  const handlePayFeeSubmit = async (e) => {
    e.preventDefault();
    const cleanUtr = utrNumber.replace(/\D/g, '');
    if (cleanUtr.length !== 12) {
      setPayError("UTR Transaction Number is MANDATORY and must be exactly 12 numeric digits (e.g. 328190283401).");
      return;
    }

    setSubmitting(true);
    setPayError('');
    setPayMessage('');

    try {
      const res = await fetch('/api/student/pay-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          month: dashData?.currentMonthName,
          amount: dashData?.student?.monthlyFee || '₹1,000',
          utrNumber: utrNumber.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment submission failed.");

      setPayMessage("Payment UTR submitted successfully! Waiting for Admin verification.");
      setUtrNumber('');
      fetchDashboardData();
      setTimeout(() => {
        setShowPayModal(false);
        setPayMessage('');
      }, 2500);
    } catch (err) {
      setPayError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xl font-bold" style={{ padding: '60px 20px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading Student Portal...</div>;
  }

  if (!student && !dashData) {
    return (
      <div className="p-12 text-center" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Session Expired or Student Not Found</h2>
        <button onClick={onLogout} className="btn btn-primary-red mt-4" style={{ marginTop: '16px' }}>Return to Student Login</button>
      </div>
    );
  }

  const s = dashData?.student || student || {};
  const history = Array.isArray(dashData?.paymentHistory) ? dashData.paymentHistory : [];
  const latestPayment = history.length > 0 ? history[history.length - 1] : null;
  const status = dashData?.feeStatus || (latestPayment ? latestPayment.status : 'Pending');
  const rawMonth = dashData?.currentMonth || (latestPayment ? latestPayment.month : 'Registration Fee');
  const monthName = typeof rawMonth === 'string' ? rawMonth : 'Current Month';

  const qrDataText = `Official Student Identity Certificate
Academy: ${settings?.academyName || "D TAEKWONDO ACADEMY"}
Student ID: ${s.id || 'N/A'}
Student Name: ${s.studentName || 'N/A'}
Parent / Guardian: ${s.parentName || 'N/A'}
Mobile Contact: ${s.phone || 'N/A'}
Program: ${s.program || 'Kids Taekwondo'}
Belt Grade: ${s.belt || 'White Belt'}
Date Joined: ${s.joiningDate || 'Recent'}
Admission Status: Verified Active Student`;

  // Belt badge color mapping
  const beltClass = (s?.belt || '').toLowerCase().includes('black') ? 'badge-dark'
    : (s?.belt || '').toLowerCase().includes('red') ? 'badge-red'
    : (s?.belt || '').toLowerCase().includes('blue') ? 'badge-blue'
    : (s?.belt || '').toLowerCase().includes('green') ? 'badge-green'
    : (s?.belt || '').toLowerCase().includes('yellow') ? 'badge-gold'
    : 'badge-gold';

  return (
    <div className="student-dashboard-page">
      <div className="container" style={{ maxWidth: '1000px', padding: '40px 20px' }}>
        
        {/* Top Header & Logout */}
        <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <span className="badge badge-gold mb-1">{settings?.academyName || "D TAEKWONDO ACADEMY"}</span>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>STUDENT & PARENT PORTAL</h1>
          </div>
          <button onClick={onLogout} className="btn btn-outline-dark" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={16} /> LOGOUT
          </button>
        </div>

        {/* Official Digital Student ID Card */}
        <div className="card mb-8" style={{ padding: '0', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(15,23,42,0.3)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '32px' }}>
          
          {/* Header Accent Bar */}
          <div style={{ background: 'linear-gradient(90deg, #e52328 0%, #b91c1c 100%)', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.85rem' }}>
              <Shield size={16} /> OFFICIAL STUDENT IDENTITY CARD
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '12px', fontWeight: '600' }}>
              VERIFIED ADMISSION
            </span>
          </div>

          <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'center' }}>
            
            {/* Student Photo */}
            <div style={{ position: 'relative' }}>
              {s.photoUrl ? (
                <img 
                  src={s.photoUrl} 
                  alt={s.studentName} 
                  style={{ width: '90px', height: '90px', borderRadius: '16px', objectFit: 'cover', border: '3px solid #e52328', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}
                />
              ) : (
                <div style={{ width: '90px', height: '90px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                  <User size={44} />
                </div>
              )}
            </div>

            {/* Student Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>{s.studentName}</h2>
                <span className={`badge ${beltClass}`} style={{ fontSize: '0.85rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>
                  🥋 {s.belt || 'White Belt'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '12px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                <div>Student ID: <strong style={{ color: '#fef08a', fontFamily: 'monospace', fontSize: '1rem' }}>{s.id}</strong></div>
                <div>Parent / Guardian: <strong style={{ color: '#ffffff' }}>{s.parentName || 'N/A'}</strong></div>
                <div>Mobile: <strong style={{ color: '#ffffff' }}>{s.phone}</strong></div>
                <div>Program: <strong style={{ color: '#60a5fa' }}>{s.program}</strong></div>
                {s.dob && <div>DOB / Age: <strong style={{ color: '#ffffff' }}>{s.dob} ({s.age || 'Child'} yrs)</strong></div>}
                <div>Joined: <strong style={{ color: '#94a3b8' }}>{s.joiningDate}</strong></div>
              </div>
            </div>

            {/* Academy Stamp Seal / QR Code */}
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrDataText)}`} 
                alt="Student ID Verification QR" 
                style={{ width: '75px', height: '75px', borderRadius: '6px', margin: '0 auto 6px', background: '#ffffff', padding: '2px' }}
                title="Scan QR Code to verify full student identity & details"
              />
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{settings?.academyName || "D TAEKWONDO"}</div>
            </div>

          </div>
        </div>

        {/* Monthly Fee Due / Status Card */}
        <div className="card p-6 mb-8" style={{ padding: '28px', borderRadius: '16px', marginBottom: '32px', background: status === 'Paid' ? '#f0fdf4' : status === 'Pending' ? '#fffbeb' : status === 'Rejected' ? '#fef2f2' : '#fef2f2', border: `2px solid ${status === 'Paid' ? '#bbf7d0' : status === 'Pending' ? '#fde68a' : '#fecaca'}` }}>
          <div className="flex justify-between items-center flex-wrap gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', color: status === 'Paid' ? '#166534' : status === 'Pending' ? '#92400e' : '#991b1b', letterSpacing: '0.5px' }}>
                FEE STATUS FOR {monthName.toUpperCase()}
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                {status === 'Paid' ? (
                  <>
                    <CheckCircle2 size={28} style={{ color: '#16a34a' }} />
                    <h3 style={{ fontSize: '1.5rem', color: '#166534', margin: 0 }}>✓ FEE PAYMENT APPROVED & CLEARED</h3>
                  </>
                ) : status === 'Pending' ? (
                  <>
                    <Clock size={28} style={{ color: '#d97706' }} />
                    <h3 style={{ fontSize: '1.5rem', color: '#92400e', margin: 0 }}>⏳ PAYMENT UNDER ADMIN VERIFICATION</h3>
                  </>
                ) : status === 'Rejected' ? (
                  <>
                    <AlertCircle size={28} style={{ color: '#dc2626' }} />
                    <h3 style={{ fontSize: '1.5rem', color: '#dc2626', margin: 0 }}>❌ PAYMENT REJECTED BY ADMIN</h3>
                  </>
                ) : (
                  <>
                    <AlertCircle size={28} style={{ color: '#dc2626' }} />
                    <h3 style={{ fontSize: '1.5rem', color: '#991b1b', margin: 0 }}>MONTHLY FEE DUE: {s.monthlyFee || '₹1,000'}</h3>
                  </>
                )}
              </div>

              <p style={{ marginTop: '8px', color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                {status === 'Paid' 
                  ? `Thank you! Your monthly fee for ${monthName} has been verified and approved by the Admin.` 
                  : status === 'Pending' 
                  ? `Your UTR number (${dashData?.currentPayment?.utrNumber || 'Submitted'}) has been received and is currently being verified by the Academy Admin.`
                  : status === 'Rejected'
                  ? `Your submitted UTR could not be verified by the Admin. Please double check your payment details or resubmit a valid transaction UTR.`
                  : `Monthly fee is due by the 5th of ${monthName}. (Excluding uniform).`}
              </p>
            </div>

            <div>
              {status === 'Due' && (
                <button onClick={() => setShowPayModal(true)} className="btn btn-primary-red" style={{ padding: '14px 28px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IndianRupee size={18} /> PAY MONTHLY FEE NOW
                </button>
              )}
              {status === 'Rejected' && (
                <button onClick={() => setShowPayModal(true)} className="btn btn-primary-red" style={{ padding: '12px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', background: '#dc2626' }}>
                  <RefreshCw size={16} /> RESUBMIT VALID UTR
                </button>
              )}
              {status === 'Pending' && (
                <button onClick={() => setShowPayModal(true)} className="btn btn-outline-dark" style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
                  RESUBMIT UTR / QR CODE
                </button>
              )}
              {status === 'Paid' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 'bold' }}>
                  <Check size={20} /> Verified for {monthName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="card p-6" style={{ padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Fee Payment History</h3>
            <button onClick={fetchDashboardData} className="btn btn-sm btn-outline-dark" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
              <RefreshCw size={12} /> Refresh Status
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>Month</th>
                  <th style={{ padding: '12px 16px' }}>Amount</th>
                  <th style={{ padding: '12px 16px' }}>UTR / Transaction ID</th>
                  <th style={{ padding: '12px 16px' }}>Date Paid</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((p, idx) => {
                    if (!p) return null;
                    const itemKey = p.id || `pay_${idx}`;
                    const itemMonth = p.month || 'Registration Fee';
                    const itemAmount = p.amount || '₹500';
                    const itemUtr = p.utrNumber || 'N/A';
                    const itemDate = p.paymentDate || 'Today';
                    const itemStatus = p.status || 'Pending';
                    return (
                      <tr key={itemKey} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>{itemMonth}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--primary-red)', fontWeight: 'bold' }}>{itemAmount}</td>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '600' }}>{itemUtr}</td>
                        <td style={{ padding: '14px 16px', color: '#64748b' }}>{itemDate}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${itemStatus === 'Paid' ? 'badge-green' : itemStatus === 'Pending' ? 'badge-gold' : 'badge-red'}`} style={{ background: itemStatus === 'Paid' ? '#dcfce7' : '#fef3c7', color: itemStatus === 'Paid' ? '#15803d' : '#b45309', padding: '4px 10px', borderRadius: '12px' }}>
                            {itemStatus === 'Paid' ? '✓ Verified / Paid' : '⏳ Pending Approval'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                      No payment records found yet. Click "Pay Monthly Fee Now" to pay via UPI QR code.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pay Fee Modal */}
      {showPayModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card p-6" style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <button onClick={() => setShowPayModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}>✕</button>

            <div className="text-center mb-6" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span className="badge badge-gold mb-2">UPI DIRECT PAYMENT</span>
              <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Pay Monthly Fee ({dashData?.currentMonthName})</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>Amount: <strong style={{ color: 'var(--primary-red)' }}>{s.monthlyFee || '₹1,000'}</strong> (Excluding uniform)</p>
            </div>

            {/* QR Code */}
            <div style={{ textAlign: 'center', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <img 
                src={paymentSettings?.qrCodeImage || "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=dtaekwondo@upi"} 
                alt="Scan UPI QR Code" 
                style={{ width: '150px', height: '150px', margin: '0 auto', display: 'block', borderRadius: '8px' }} 
              />
              <p style={{ margin: '8px 0 0', fontWeight: 'bold', fontSize: '0.95rem' }}>Scan with PhonePe / Google Pay / Paytm</p>
              {paymentSettings?.upiId && <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>UPI ID: <code>{paymentSettings.upiId}</code></p>}
            </div>

            {payError && <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '12px', fontSize: '0.85rem' }}>{payError}</div>}
            {payMessage && <div style={{ padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', marginBottom: '12px', fontSize: '0.85rem' }}>{payMessage}</div>}

            <form onSubmit={handlePayFeeSubmit}>
              <div className="form-group mb-4" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem' }}>Enter 12-Digit UPI Transaction UTR Number *</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  pattern="[0-9]{12}"
                  maxLength={12}
                  required 
                  value={utrNumber} 
                  onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))} 
                  placeholder="e.g. 328190283401 (12 digits)" 
                  className="form-control" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', letterSpacing: '1px' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '4px' }}>Found on your UPI app payment confirmation screen.</span>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary-red w-full" style={{ width: '100%', padding: '12px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Send size={16} /> {submitting ? "SUBMITTING UTR..." : "SUBMIT PAYMENT UTR"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .student-dashboard-page {
          background: #f8fafc;
          min-height: 85vh;
        }
      `}</style>
    </div>
  );
}
