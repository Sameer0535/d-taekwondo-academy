import React, { useState } from 'react';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, settings, onBackToHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card card">
        {onBackToHome && (
          <button 
            onClick={onBackToHome} 
            style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', padding: '10px 16px', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
          >
            ← Return to Main Website (All Sections)
          </button>
        )}
        <div className="login-header text-center">
          <img 
            src={settings?.logoUrl || "/logo.png"} 
            alt="D Taekwondo Academy Logo" 
            className="login-logo" 
          />
          <h2>{settings?.academyName || "D TAEKWONDO ACADEMY"}</h2>
          <p className="badge badge-red mt-2" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
            <ShieldCheck size={14} /> AUTHORIZED STAFF ONLY
          </p>
          <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#64748b' }}>
            Restricted Administrative Control Panel
          </p>
        </div>

        {error && <div className="login-error-alert" style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 'bold' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-icon-wrap">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="form-control with-icon" 
                placeholder="Enter admin username" 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="form-control with-icon" 
                placeholder="Enter password" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary-red w-full mt-4" style={{ width: '100%' }}>
            {loading ? "AUTHENTICATING..." : "LOG IN TO DASHBOARD"}
          </button>
        </form>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: #0f172a;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          background: #ffffff;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .login-logo {
          height: 75px;
          width: auto;
          margin: 0 auto 12px;
          object-fit: contain;
        }
        .login-header h2 {
          font-size: 1.4rem;
          color: #111827;
        }
        .login-error-alert {
          background: #fef2f2;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.88rem;
          margin: 20px 0;
          border-left: 4px solid #dc2626;
        }
        .login-form {
          margin-top: 24px;
        }
        .input-icon-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .form-control.with-icon {
          padding-left: 42px;
        }
        .login-footer-hint {
          color: #9ca3af;
          font-size: 0.8rem;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
