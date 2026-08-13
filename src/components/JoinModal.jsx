import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Send, QrCode, Copy, CheckCircle2, Smartphone, Hash } from 'lucide-react';

export default function JoinModal({ isOpen, onClose, programs = [], initialProgram = '', isEvent = false, eventFee = '', payment = null, settings = null }) {
  const [formData, setFormData] = useState({
    studentName: '',
    age: '',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    program: 'Kids Taekwondo',
    message: '',
    utrNumber: ''
  });
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  
  // Step 2 UTR state
  const [step2Utr, setStep2Utr] = useState('');
  const [utrSubmitted, setUtrSubmitted] = useState(false);
  const [submittingUtr, setSubmittingUtr] = useState(false);

  useEffect(() => {
    if (initialProgram) {
      setFormData(prev => ({ ...prev, program: initialProgram }));
    }
  }, [initialProgram, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If payment option is enabled, wait until step 2 to submit everything atomically
    if (hasPaymentOption) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to submit registration");
      const data = await res.json();
      if (data?.enquiry?.id) {
        setSubmittedEnquiryId(data.enquiry.id);
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send registration. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2UtrSubmit = async (e) => {
    e.preventDefault();
    if (!step2Utr.trim()) return;
    setSubmittingUtr(true);

    try {
      // Create enquiry with UTR in one go
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, utrNumber: step2Utr.trim() })
      });
      if (!res.ok) throw new Error("Failed to submit registration with UTR");
      
      setUtrSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit payment. Please try again.");
    } finally {
      setSubmittingUtr(false);
    }
  };

  const handleCopyUpi = (upiId) => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setUtrSubmitted(false);
    setStep2Utr('');
    setSubmittedEnquiryId(null);
    setFormData({
      studentName: '',
      age: '',
      parentName: '',
      phone: '',
      email: '',
      address: '',
      program: initialProgram || 'Kids Taekwondo',
      message: '',
      utrNumber: ''
    });
    onClose();
  };

  const hasPaymentOption = payment?.isEnabled && (payment?.qrCodeImage || payment?.upiId);

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: submitted && hasPaymentOption ? '580px' : '520px' }}>
        <button className="modal-close" onClick={handleResetAndClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-4">
            <div className="text-center mb-4">
              {(!hasPaymentOption || utrSubmitted) ? (
                <>
                  <CheckCircle size={56} className="text-green-500 mx-auto mb-2" style={{ color: '#10B981', margin: '0 auto 8px' }} />
                  <h3 className="text-2xl font-bold" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Registration Submitted!</h3>
                  <p className="text-gray-600" style={{ fontSize: '0.95rem', color: '#4b5563' }}>
                    Thank you <strong>{formData.studentName}</strong>! Your registration for <strong>{formData.program}</strong> has been recorded.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold" style={{ fontSize: '1.5rem', marginBottom: '4px', color: '#1e3a8a' }}>Almost Done!</h3>
                  <p className="text-gray-600" style={{ fontSize: '0.95rem', color: '#4b5563' }}>
                    Please complete your payment below to finalize the registration for <strong>{formData.studentName}</strong>.
                  </p>
                  {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mt-2 text-sm">{error}</div>}
                </>
              )}
            </div>

            {/* In-Modal Payment & UTR Section */}
            {hasPaymentOption ? (
              <div className="modal-payment-box" style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '20px', margin: '16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <QrCode size={20} style={{ color: '#e52328' }} />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>
                    Pay Registration Fee & Submit UTR
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
                  {isEvent && eventFee 
                    ? `Scan the QR code or use the UPI ID below to pay the event fee of ${eventFee}, then enter your payment UTR.` 
                    : `Scan the QR code or use the UPI ID below to pay, then enter your payment UTR / Transaction ID.`}
                </p>

                {payment.qrCodeImage && (
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <img 
                      src={payment.qrCodeImage} 
                      alt="UPI Payment QR Code" 
                      style={{ maxWidth: '200px', width: '100%', borderRadius: '12px', border: '2px dashed #cbd5e1', padding: '8px', background: '#ffffff' }} 
                    />
                    {payment.accountName && (
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginTop: '6px' }}>
                        Pay to: {payment.accountName}
                      </div>
                    )}
                  </div>
                )}

                {payment.upiId && (
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Smartphone size={16} style={{ color: '#2563eb' }} />
                      <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b', fontFamily: 'monospace' }}>
                        {payment.upiId}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleCopyUpi(payment.upiId)}
                      style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedUpi ? <><CheckCircle2 size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                )}

                {/* UTR Input Section */}
                <div style={{ marginTop: '16px', background: '#ffffff', border: '2px solid #3b82f6', borderRadius: '12px', padding: '16px' }}>
                  {utrSubmitted ? (
                    <div style={{ textAlign: 'center', color: '#15803d', fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <CheckCircle2 size={20} /> Payment UTR Number Submitted Successfully! Admin will verify and approve.
                    </div>
                  ) : (
                    <form onSubmit={handleStep2UtrSubmit}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '6px' }}>
                        <Hash size={14} style={{ display: 'inline', marginRight: '4px' }} /> Enter Payment UTR Number / Transaction ID *
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={step2Utr}
                          onChange={(e) => setStep2Utr(e.target.value)}
                          placeholder="e.g. 423456789012 (12-digit Ref No)"
                          required
                          className="form-control"
                          style={{ flex: 1, fontFamily: 'monospace', fontWeight: '700' }}
                        />
                        <button 
                          type="submit" 
                          disabled={submittingUtr} 
                          className="btn btn-primary-red"
                          style={{ whiteSpace: 'nowrap', padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {submittingUtr ? 'Saving...' : 'SUBMIT UTR'}
                        </button>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '4px' }}>
                        Found in your GPay / PhonePe / Paytm payment receipt under "UPI Ref No" or "UTR".
                      </span>
                    </form>
                  )}
                </div>
              </div>
            ) : null}

            {(!hasPaymentOption || utrSubmitted) && (
              <button onClick={handleResetAndClose} className="btn btn-primary-red w-full mt-3" style={{ width: '100%' }}>
                DONE & CLOSE
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="modal-header text-center mb-6">
              <span className="badge badge-red mb-2">
                {initialProgram ? `REGISTER FOR ${initialProgram.toUpperCase()}` : 'JOIN D TAEKWONDO ACADEMY'}
              </span>
              <h2 className="text-2xl font-bold">
                {isEvent ? initialProgram : (initialProgram ? `Event / Program Registration` : 'Start Your Martial Arts Journey')}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isEvent ? `Fill in participant details to register for the event.` : (initialProgram ? `Fill in participant details to register for ${initialProgram}.` : 'Book a free trial class or submit an admission enquiry.')}
              </p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student / Participant Name *</label>
                <input 
                  type="text" 
                  name="studentName" 
                  value={formData.studentName} 
                  onChange={handleChange} 
                  required 
                  className="form-control" 
                  placeholder="Enter full name" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Age *</label>
                  <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    required 
                    className="form-control" 
                    placeholder="e.g. 10" 
                  />
                </div>
                <div className="form-group">
                  <label>Parent / Guardian Name</label>
                  <input 
                    type="text" 
                    name="parentName" 
                    value={formData.parentName} 
                    onChange={handleChange} 
                    className="form-control" 
                    placeholder="If student is minor" 
                  />
                </div>
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
                <label>Address / Apartment Name *</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  className="form-control" 
                  placeholder="Apartment name" 
                />
              </div>

              <div className="form-group">
                <label>Program / Event Name *</label>
                {isEvent ? (
                  <input 
                    type="text" 
                    name="program" 
                    value={formData.program} 
                    onChange={handleChange} 
                    required 
                    className="form-control" 
                    placeholder="Selected Event" 
                  />
                ) : (
                  <select 
                    name="program" 
                    value={formData.program} 
                    onChange={handleChange} 
                    className="form-control"
                    required
                  >
                    {programs.length > 0 ? (
                      programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)
                    ) : (
                      <option value={formData.program || "Kids Taekwondo"}>{formData.program || "Kids Taekwondo"}</option>
                    )}
                  </select>
                )}
              </div>



              <button type="submit" disabled={submitting} className="btn btn-primary-red w-full mt-2" style={{ width: '100%' }}>
                {submitting ? "Submitting..." : <>REGISTER & PROCEED <Send size={16} /></>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
