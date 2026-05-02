import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token }  = useParams();
  const navigate   = useNavigate();

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [showCpw,         setShowCpw]         = useState(false);
  const [status,          setStatus]          = useState('idle'); // idle|loading|success|error
  const [message,         setMessage]         = useState('');

  const passwordStrength = () => {
    if (!password) return null;
    if (password.length < 6)                          return { label: 'Too short', color: '#ef4444', w: '20%' };
    if (password.length < 8)                          return { label: 'Weak',      color: '#f97316', w: '40%' };
    if (/[A-Z]/.test(password) && password.length < 10) return { label: 'Medium', color: '#f59e0b', w: '60%' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { label: 'Strong', color: '#10b981', w: '90%' };
    return { label: 'Good', color: '#2563a8', w: '70%' };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!password || password.length < 6) { setStatus('error'); setMessage('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword)      { setStatus('error'); setMessage('Passwords do not match.');                 return; }

    setStatus('loading');
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setStatus('success');
      setMessage(res.data.message || 'Password reset successful!');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Reset link is invalid or expired. Please request a new one.');
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="auth-card">
              <div className="auth-logo">
                <i className="bi bi-mortarboard-fill me-2" style={{ color: '#f59e0b' }}></i>
                AIM <span>360</span>
              </div>

              {status === 'success' ? (
                <div className="text-center mt-2">
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="fw-800 mb-2 text-success">Password Reset!</h5>
                  <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>{message}</p>
                  <Link to="/login" className="btn-auth d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-box-arrow-in-right"></i> Go to Login
                  </Link>
                </div>
              ) : (
                <>
                  <h5 className="fw-700 text-center mb-1" style={{ color: '#1a3c5e' }}>
                    <i className="bi bi-key-fill me-2 text-warning"></i>Set New Password
                  </h5>
                  <p className="text-center text-muted mb-4" style={{ fontSize: '0.88rem' }}>
                    Enter your new password below.
                  </p>

                  {status === 'error' && (
                    <div className="alert alert-danger py-2 mb-3 d-flex align-items-center gap-2"
                      style={{ borderRadius: 10, fontSize: '0.85rem', border: 'none' }}>
                      <i className="bi bi-exclamation-triangle-fill"></i>{message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    {/* New Password */}
                    <div className="mb-2">
                      <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                        <i className="bi bi-lock me-1"></i> New Password
                      </label>
                      <div className="input-group">
                        <input type={showPw ? 'text' : 'password'}
                          className="form-control form-control-custom"
                          style={{ borderRight: 'none' }}
                          placeholder="Create a new password"
                          value={password} onChange={e => setPassword(e.target.value)} />
                        <button type="button" className="btn"
                          style={{ border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: '#f8fafc' }}
                          onClick={() => setShowPw(!showPw)}>
                          <i className={`bi bi-eye${showPw ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* Password Strength */}
                    {strength && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <div style={{ flex: 1, height: 5, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: strength.w, height: '100%', background: strength.color, borderRadius: 4, transition: 'width 0.3s' }}></div>
                          </div>
                          <span style={{ fontSize: '0.73rem', color: strength.color, fontWeight: 700, minWidth: 52 }}>{strength.label}</span>
                        </div>
                      </div>
                    )}

                    {/* Confirm Password */}
                    <div className="mb-4">
                      <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                        <i className="bi bi-lock-fill me-1"></i> Confirm New Password
                      </label>
                      <div className="input-group">
                        <input type={showCpw ? 'text' : 'password'}
                          className={`form-control form-control-custom ${confirmPassword && confirmPassword !== password ? 'is-invalid' : confirmPassword && confirmPassword === password ? 'is-valid' : ''}`}
                          style={{ borderRight: 'none' }}
                          placeholder="Re-enter new password"
                          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        <button type="button" className="btn"
                          style={{ border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: '#f8fafc' }}
                          onClick={() => setShowCpw(!showCpw)}>
                          <i className={`bi bi-eye${showCpw ? '-slash' : ''}`}></i>
                        </button>
                        {confirmPassword && confirmPassword !== password && (
                          <div className="invalid-feedback">Passwords do not match.</div>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="btn-auth" disabled={status === 'loading'}>
                      {status === 'loading'
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Resetting...</>
                        : <><i className="bi bi-check-circle me-2"></i>Reset Password</>}
                    </button>
                  </form>

                  <p className="text-center mt-4 mb-0" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Remembered your password?{' '}
                    <Link to="/login" style={{ color: '#2563a8', fontWeight: 600, textDecoration: 'none' }}>
                      Back to Login
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
