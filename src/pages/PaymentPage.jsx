import React, { useState } from 'react';
import { QrCode, Smartphone, CreditCard, Copy, CheckCircle2, AlertCircle, ArrowRight, Shield, IndianRupee, Hash, Send } from 'lucide-react';

export default function PaymentPage({ payment, settings, fees = [] }) {
  const [copiedField, setCopiedField] = useState('');
  
  // UTR Submission Form State
  const [utrForm, setUtrForm] = useState({
    studentName: '',
    phone: '',
    program: fees.length > 0 ? fees[0].programName : 'Academy Fee',
    utrNumber: '',
    message: ''
  });
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [utrSuccess, setUtrSuccess] = useState(false);
  const [utrError, setUtrError] = useState('');

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleUtrSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = (utrForm.phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setUtrError("Mobile Number MUST be exactly 10 digits (e.g. 9812345678).");
      return;
    }

    const cleanUtr = (utrForm.utrNumber || '').replace(/\D/g, '');
    if (cleanUtr.length !== 12) {
      setUtrError("UTR Transaction Number is MANDATORY and must be exactly 12 numeric digits (e.g. 328190283401).");
      return;
    }

    setSubmittingUtr(true);
    setUtrError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...utrForm,
          phone: cleanPhone,
          utrNumber: cleanUtr,
          age: 'N/A',
          message: `[PAYMENT UTR SUBMISSION] UTR: ${cleanUtr} | ${utrForm.message}`
        })
      });

      if (!res.ok) throw new Error("Failed to submit UTR");
      setUtrSuccess(true);
      setUtrForm({
        studentName: '',
        phone: '',
        program: fees.length > 0 ? fees[0].programName : 'Academy Fee',
        utrNumber: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      setUtrError("Failed to submit UTR number. Please try again or call us.");
    } finally {
      setSubmittingUtr(false);
    }
  };

  const hasQrCode = payment?.qrCodeImage;
  const hasUpiId = payment?.upiId;
  const hasBankDetails = payment?.bankDetails?.accountNumber;

  return (
    <div className="payment-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">SECURE PAYMENTS</span>
          <h1>PAY NOW & SUBMIT UTR</h1>
          <p>Scan the UPI QR code or use UPI ID to pay, then submit your 12-digit payment UTR number below.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="payment-layout">
            {/* Left Side - QR Code, Payment Methods & UTR Submission Form */}
            <div className="payment-main">
              {/* QR Code Section */}
              {hasQrCode && (
                <div className="card payment-qr-card">
                  <div className="qr-header">
                    <div className="qr-icon-circle">
                      <QrCode size={28} />
                    </div>
                    <div>
                      <h3>Scan & Pay</h3>
                      <p>Scan this QR code with any UPI app</p>
                    </div>
                  </div>
                  <div className="qr-image-container">
                    <img src={payment.qrCodeImage} alt="UPI QR Code for Payment" className="qr-image" />
                    <div className="qr-overlay-badge">
                      <Shield size={14} /> Secure Payment
                    </div>
                  </div>
                  {payment.accountName && (
                    <div className="qr-account-name">
                      <IndianRupee size={16} />
                      <span>Pay to: <strong>{payment.accountName}</strong></span>
                    </div>
                  )}
                  <div className="qr-apps-strip">
                    <span>Works with:</span>
                    <div className="app-badges">
                      <span className="app-badge gpay">Google Pay</span>
                      <span className="app-badge phonepe">PhonePe</span>
                      <span className="app-badge paytm">Paytm</span>
                      <span className="app-badge bhim">BHIM</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional QR Codes */}
              {payment?.additionalQrCodes?.length > 0 && (
                <div className="additional-qr-grid">
                  {payment.additionalQrCodes.map((qr, idx) => (
                    <div key={idx} className="card payment-qr-card mini">
                      <h4>{qr.label || `Payment Option ${idx + 2}`}</h4>
                      <div className="qr-image-container mini">
                        <img src={qr.imageUrl} alt={qr.label || 'QR Code'} className="qr-image" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* UPI ID Section */}
              {hasUpiId && (
                <div className="card payment-upi-card">
                  <div className="upi-header">
                    <Smartphone size={22} className="text-blue" />
                    <h3>Pay via UPI ID</h3>
                  </div>
                  <div className="upi-id-box">
                    <div className="upi-id-value">
                      <span>{payment.upiId}</span>
                      <button 
                        onClick={() => handleCopy(payment.upiId, 'upi')}
                        className="copy-btn"
                      >
                        {copiedField === 'upi' ? <><CheckCircle2 size={15} /> Copied!</> : <><Copy size={15} /> Copy</>}
                      </button>
                    </div>
                  </div>
                  <div className="upi-steps">
                    <div className="step"><span className="step-num">1</span> Open any UPI app (GPay, PhonePe, Paytm)</div>
                    <div className="step"><span className="step-num">2</span> Select "Pay to UPI ID"</div>
                    <div className="step"><span className="step-num">3</span> Enter the UPI ID above & pay</div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Section */}
              {hasBankDetails && (
                <div className="card payment-bank-card">
                  <div className="bank-header">
                    <CreditCard size={22} className="text-gold" />
                    <h3>Bank Transfer</h3>
                  </div>
                  <div className="bank-details-grid">
                    <div className="bank-field">
                      <span className="bank-label">Account Holder</span>
                      <div className="bank-value-row">
                        <span>{payment.bankDetails.accountHolder}</span>
                        <button onClick={() => handleCopy(payment.bankDetails.accountHolder, 'holder')} className="copy-btn-sm">
                          {copiedField === 'holder' ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                    <div className="bank-field">
                      <span className="bank-label">Account Number</span>
                      <div className="bank-value-row">
                        <span>{payment.bankDetails.accountNumber}</span>
                        <button onClick={() => handleCopy(payment.bankDetails.accountNumber, 'account')} className="copy-btn-sm">
                          {copiedField === 'account' ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                    <div className="bank-field">
                      <span className="bank-label">IFSC Code</span>
                      <div className="bank-value-row">
                        <span>{payment.bankDetails.ifscCode}</span>
                        <button onClick={() => handleCopy(payment.bankDetails.ifscCode, 'ifsc')} className="copy-btn-sm">
                          {copiedField === 'ifsc' ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                    <div className="bank-field">
                      <span className="bank-label">Bank Name</span>
                      <span className="bank-value">{payment.bankDetails.bankName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* UTR Submission Form Card */}
              <div className="card payment-utr-form-card" style={{ padding: '32px', borderTop: '4px solid var(--primary-red)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.4rem' }}>Submit Payment UTR Number</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '2px 0 0' }}>Submit your 12-digit transaction ID after completing UPI payment for verification.</p>
                  </div>
                </div>

                {utrSuccess ? (
                  <div style={{ background: '#dcfce7', border: '1px solid #86efac', padding: '20px', borderRadius: '12px', textAlign: 'center', color: '#15803d' }}>
                    <CheckCircle2 size={48} style={{ margin: '0 auto 10px', color: '#16a34a' }} />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 6px' }}>UTR Number Submitted Successfully!</h4>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>Thank you! The academy admin will verify your payment UTR number and confirm your registration.</p>
                    <button 
                      onClick={() => setUtrSuccess(false)}
                      className="btn btn-primary-red"
                      style={{ marginTop: '16px', padding: '8px 20px', fontSize: '0.85rem' }}
                    >
                      Submit Another UTR
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUtrSubmit}>
                    {utrError && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>{utrError}</div>}

                    <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label>Student / Payer Name *</label>
                        <input 
                          type="text" 
                          value={utrForm.studentName}
                          onChange={(e) => setUtrForm({ ...utrForm, studentName: e.target.value })}
                          required 
                          className="form-control"
                          placeholder="Full name of student" 
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number (10 Digits) *</label>
                        <input 
                          type="tel" 
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={utrForm.phone}
                          onChange={(e) => setUtrForm({ ...utrForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          required 
                          className="form-control"
                          placeholder="10-digit mobile number" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label>Program / Event Paid For *</label>
                        <input 
                          type="text" 
                          value={utrForm.program}
                          onChange={(e) => setUtrForm({ ...utrForm, program: e.target.value })}
                          required 
                          className="form-control"
                          placeholder="e.g. Kids Taekwondo or Event Name" 
                        />
                      </div>
                      <div className="form-group">
                        <label>12-Digit UTR Number / Transaction ID *</label>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          pattern="[0-9]{12}"
                          maxLength={12}
                          value={utrForm.utrNumber}
                          onChange={(e) => setUtrForm({ ...utrForm, utrNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                          required 
                          className="form-control"
                          placeholder="e.g. 328190283401 (12 digits)" 
                          style={{ fontFamily: 'monospace', fontWeight: '700' }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Additional Notes / Remarks</label>
                      <textarea
                        value={utrForm.message}
                        onChange={(e) => setUtrForm({ ...utrForm, message: e.target.value })}
                        className="form-control"
                        rows="2"
                        placeholder="Any additional details about payment date or time..."
                      ></textarea>
                    </div>

                    <button type="submit" disabled={submittingUtr} className="btn btn-primary-red w-full" style={{ width: '100%', marginTop: '8px' }}>
                      {submittingUtr ? 'Submitting...' : <>SUBMIT PAYMENT UTR NUMBER <Send size={16} /></>}
                    </button>
                  </form>
                )}
              </div>

              {/* No Payment Method Configured */}
              {!hasQrCode && !hasUpiId && !hasBankDetails && (
                <div className="card payment-empty">
                  <AlertCircle size={48} className="text-gray-300" />
                  <h3>Payment Methods Coming Soon</h3>
                  <p>Payment options are being set up. Please contact us directly for fee payment.</p>
                  {settings?.phone && (
                    <a href={`tel:${settings.phone}`} className="btn btn-primary-red" style={{ marginTop: 16 }}>
                      Call Us: {settings.phone}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Side - Instructions & Fee Summary */}
            <div className="payment-sidebar">
              {/* Important Note */}
              {payment?.paymentNote && (
                <div className="card payment-note-card">
                  <div className="note-header">
                    <AlertCircle size={18} className="text-red" />
                    <h4>Important</h4>
                  </div>
                  <p>{payment.paymentNote}</p>
                </div>
              )}

              {/* Fee Reference */}
              {fees.length > 0 && (
                <div className="card payment-fees-ref">
                  <h4><IndianRupee size={16} /> Fee Reference</h4>
                  <div className="fee-ref-list">
                    {fees.map((fee, idx) => (
                      <div key={fee.id || idx} className="fee-ref-item">
                        <span className="fee-ref-name">{fee.programName}</span>
                        <span className="fee-ref-price">{fee.monthly}/mo</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How It Works */}
              <div className="card payment-howto">
                <h4>How to Pay</h4>
                <div className="howto-steps">
                  <div className="howto-step">
                    <div className="howto-num">1</div>
                    <div>
                      <strong>Select Amount</strong>
                      <p>Check the fee for your program</p>
                    </div>
                  </div>
                  <div className="howto-step">
                    <div className="howto-num">2</div>
                    <div>
                      <strong>Scan QR / Enter UPI ID</strong>
                      <p>Use any UPI app to make payment</p>
                    </div>
                  </div>
                  <div className="howto-step">
                    <div className="howto-num">3</div>
                    <div>
                      <strong>Submit UTR Number</strong>
                      <p>Fill your 12-digit UTR ref ID for verification</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="card payment-contact">
                <h4>Need Help?</h4>
                <p>Contact us for any payment related queries.</p>
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="payment-phone-link">
                    📞 {settings.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .payment-layout {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .payment-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .payment-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 120px;
        }

        /* QR Card */
        .payment-qr-card {
          text-align: center;
          padding: 32px;
          border-top: 4px solid var(--primary-red);
        }
        .payment-qr-card.mini {
          padding: 20px;
          border-top: 3px solid var(--secondary-blue);
        }
        .payment-qr-card.mini h4 {
          font-family: var(--font-heading);
          font-size: 1rem;
          margin-bottom: 12px;
          color: var(--secondary-blue);
        }
        .qr-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          text-align: left;
        }
        .qr-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-red), #ff4444);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .qr-header h3 {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          margin: 0;
        }
        .qr-header p {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 2px 0 0;
        }
        .qr-image-container {
          position: relative;
          display: inline-block;
          padding: 16px;
          background: #fff;
          border: 3px dashed #e5e7eb;
          border-radius: 20px;
          margin-bottom: 16px;
        }
        .qr-image-container.mini {
          padding: 12px;
          border-radius: 14px;
        }
        .qr-image {
          max-width: 280px;
          width: 100%;
          height: auto;
          border-radius: 12px;
        }
        .qr-image-container.mini .qr-image {
          max-width: 200px;
        }
        .qr-overlay-badge {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #22c55e;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 4px 14px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }
        .qr-account-name {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1rem;
          color: #374151;
          margin: 16px 0 8px;
          font-weight: 600;
        }
        .qr-apps-strip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
          font-size: 0.8rem;
          color: #9ca3af;
        }
        .app-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .app-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.3px;
        }
        .app-badge.gpay {
          background: #e8f5e9;
          color: #1b8c3a;
        }
        .app-badge.phonepe {
          background: #ede7f6;
          color: #5f2ec7;
        }
        .app-badge.paytm {
          background: #e3f2fd;
          color: #002970;
        }
        .app-badge.bhim {
          background: #fff3e0;
          color: #e65100;
        }

        .additional-qr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        /* UPI Card */
        .payment-upi-card {
          padding: 28px;
          border-top: 4px solid var(--secondary-blue);
        }
        .upi-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .upi-header h3 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          margin: 0;
        }
        .upi-id-box {
          background: #f0f7ff;
          border: 2px solid var(--secondary-blue);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 20px;
        }
        .upi-id-value {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .upi-id-value span {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--secondary-blue);
          letter-spacing: 0.5px;
        }
        .copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--secondary-blue);
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .copy-btn:hover {
          background: #1a5bb5;
          transform: translateY(-1px);
        }
        .upi-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          color: #374151;
        }
        .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--secondary-blue);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        /* Bank Card */
        .payment-bank-card {
          padding: 28px;
          border-top: 4px solid var(--accent-gold);
        }
        .bank-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .bank-header h3 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          margin: 0;
        }
        .bank-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .bank-field {
          background: #fffbeb;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #fde68a;
        }
        .bank-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #92400e;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .bank-value-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .bank-value-row span {
          font-weight: 700;
          font-size: 0.95rem;
          color: #1f2937;
        }
        .bank-value {
          font-weight: 700;
          font-size: 0.95rem;
          color: #1f2937;
        }
        .copy-btn-sm {
          background: none;
          border: 1px solid #d97706;
          color: #d97706;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .copy-btn-sm:hover {
          background: #d97706;
          color: #fff;
        }

        /* Empty State */
        .payment-empty {
          text-align: center;
          padding: 60px 32px;
          color: #9ca3af;
        }
        .payment-empty h3 {
          font-family: var(--font-heading);
          margin: 16px 0 8px;
          color: #6b7280;
        }

        /* Sidebar Cards */
        .payment-note-card {
          padding: 20px;
          background: #fef3f2;
          border: 1px solid #fecaca;
          border-left: 4px solid var(--primary-red);
        }
        .note-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .note-header h4 {
          font-family: var(--font-heading);
          font-size: 1rem;
          margin: 0;
          color: var(--primary-red);
        }
        .payment-note-card p {
          font-size: 0.88rem;
          color: #7f1d1d;
          line-height: 1.5;
          margin: 0;
        }

        .payment-fees-ref {
          padding: 20px;
        }
        .payment-fees-ref h4 {
          font-family: var(--font-heading);
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }
        .fee-ref-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .fee-ref-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.85rem;
        }
        .fee-ref-name {
          font-weight: 600;
          color: #374151;
        }
        .fee-ref-price {
          font-weight: 800;
          color: var(--primary-red);
          font-family: var(--font-heading);
        }

        .payment-howto {
          padding: 20px;
        }
        .payment-howto h4 {
          font-family: var(--font-heading);
          font-size: 1rem;
          margin-bottom: 16px;
        }
        .howto-steps {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .howto-step {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .howto-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-red);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .howto-step strong {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 2px;
        }
        .howto-step p {
          font-size: 0.8rem;
          color: #6b7280;
          margin: 0;
        }

        .payment-contact {
          padding: 20px;
          text-align: center;
          background: #f0f7ff;
          border: 1px solid #bfdbfe;
        }
        .payment-contact h4 {
          font-family: var(--font-heading);
          margin-bottom: 6px;
        }
        .payment-contact p {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .payment-phone-link {
          display: inline-block;
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--secondary-blue);
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .payment-layout {
            grid-template-columns: 1fr;
          }
          .payment-sidebar {
            position: static;
          }
          .bank-details-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .upi-id-value {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .qr-image {
            max-width: 220px;
          }
        }
      `}</style>
    </div>
  );
}
