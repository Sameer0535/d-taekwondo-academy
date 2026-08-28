import React, { useState } from 'react';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';

export default function JoinPage({ programs = [], setActivePage, settings }) {
  const [formData, setFormData] = useState({
    studentName: '',
    age: '',
    parentName: '',
    phone: '',
    email: '',
    program: 'Kids Taekwondo',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to submit enquiry");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send enquiry. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="join-page">
      <section className="page-header">
        <div className="container text-center">
          <span className="badge badge-gold mb-2">ONLINE ADMISSION ENQUIRY</span>
          <h1>JOIN {settings?.academyName || "D TAEKWONDO ACADEMY"}</h1>
          <p>Fill out the registration details below to reserve your slot or book a free trial class.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="join-form-wrapper card max-w-2xl mx-auto p-8" style={{ maxWidth: '680px', margin: '0 auto', padding: '40px' }}>
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 size={64} style={{ color: '#10B981', margin: '0 auto 16px' }} />
                <h2 className="text-3xl font-bold mb-3">Enquiry Submitted!</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Thank you! The academy will contact you shortly.
                </p>
                <div className="flex justify-center gap-4" style={{ display: 'flex', justifyCenter: 'center', gap: '16px' }}>
                  <button onClick={() => { setSubmitted(false); setFormData({ studentName: '', age: '', parentName: '', phone: '', email: '', program: 'Kids Taekwondo', message: '' }); }} className="btn btn-outline-dark">
                    SUBMIT ANOTHER
                  </button>
                  <button onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-primary-red">
                    RETURN TO HOME
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="form-head text-center mb-8">
                  <span className="badge badge-red mb-2"><ShieldCheck size={14} /> KUKKIWON CERTIFIED ACADEMY</span>
                  <h2 className="text-2xl font-bold">Student Registration & Trial Request</h2>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Student Name *</label>
                    <input 
                      type="text" 
                      name="studentName" 
                      value={formData.studentName} 
                      onChange={handleChange} 
                      required 
                      className="form-control" 
                      placeholder="Enter full name of student" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Student Age *</label>
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
                    <label>Program Interested In *</label>
                    <select name="program" value={formData.program} onChange={handleChange} className="form-control">
                      {programs && programs.length > 0 ? (
                        programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)
                      ) : (
                        <>
                          <option value="Kids Taekwondo">Kids Taekwondo (Ages 5-11)</option>
                          <option value="Beginners">Beginners Course (Ages 12+)</option>
                          <option value="Advanced Training">Advanced Black Belt Track</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message / Additional Details</label>
                    <textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      className="form-control" 
                      rows="4" 
                      placeholder="Any prior belt rank, physical health notes, or batch timing requests..."
                    ></textarea>
                  </div>

                  <button type="submit" disabled={submitting} className="btn btn-primary-red w-full mt-4" style={{ width: '100%' }}>
                    {submitting ? "Submitting..." : <>SUBMIT ENQUIRY <Send size={16} /></>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
