import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    careerPreference: '',
  });

  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.name.trim())          e.name     = 'Full name is required.';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';

    if (!formData.email.trim())         e.email    = 'Email address is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = 'Please enter a valid email address.';

    if (!formData.phone.trim())         e.phone    = 'Phone number is required.';
    else if (!/^[0-9+\- ]{7,15}$/.test(formData.phone.trim())) e.phone = 'Enter a valid phone number (7–15 digits).';

    if (!formData.password)             e.password = 'Password is required.';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters.';

    if (!formData.confirmPassword)      e.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match.';

    if (!formData.careerPreference)     e.careerPreference = 'Please select your class level.';

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await axios.post('https://career-counselling-1.onrender.com/api/auth/register', {
        name:             formData.name.trim(),
        email:            formData.email.trim(),
        phone:            formData.phone.trim(),
        password:         formData.password,
        careerPreference: formData.careerPreference,
      });
      login(res.data.user, res.data.token);
      // Admin → admin dashboard, user → user dashboard
      navigate(res.data.user.isAdmin ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6)                           return { label: 'Too short', color: '#ef4444', width: '20%' };
    if (p.length < 8)                           return { label: 'Weak',      color: '#f97316', width: '40%' };
    if (p.length < 10 && /[A-Z]/.test(p))       return { label: 'Medium',   color: '#f59e0b', width: '60%' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p))    return { label: 'Strong',   color: '#10b981', width: '90%' };
    return { label: 'Good', color: '#2563a8', width: '70%' };
  };

  const strength = passwordStrength();

  return (
    <section className="auth-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-9">
            <div className="auth-card">

              <div className="auth-logo">
                <i className="bi bi-mortarboard-fill me-2" style={{ color: '#f59e0b' }}></i>
                AIM <span>360</span>
              </div>
              <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                Create your account and start exploring career paths
              </p>

              {apiError && (
                <div className="alert alert-danger alert-custom d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-exclamation-triangle-fill"></i> {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-person me-1"></i> Full Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="name"
                    className={`form-control form-control-custom ${errors.name ? 'is-invalid' : formData.name ? 'is-valid' : ''}`}
                    placeholder="Enter your full name"
                    value={formData.name} onChange={handleChange} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-envelope me-1"></i> Email Address <span className="text-danger">*</span>
                  </label>
                  <input type="email" name="email"
                    className={`form-control form-control-custom ${errors.email ? 'is-invalid' : formData.email && !errors.email ? 'is-valid' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email} onChange={handleChange} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Phone — REQUIRED */}
                <div className="mb-3">
                  <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-telephone me-1"></i> WhatsApp / Phone Number <span className="text-danger">*</span>
                  </label>
                  <input type="tel" name="phone"
                    className={`form-control form-control-custom ${errors.phone ? 'is-invalid' : formData.phone && !errors.phone ? 'is-valid' : ''}`}
                    placeholder="+91 98765 43210"
                    value={formData.phone} onChange={handleChange} />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  <div className="text-muted mt-1" style={{ fontSize: '0.76rem' }}>
                    <i className="bi bi-info-circle me-1"></i>Used only for counselling contact. Never shared.
                  </div>
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-lock me-1"></i> Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input type={showPassword ? 'text' : 'password'} name="password"
                      className={`form-control form-control-custom ${errors.password ? 'is-invalid' : ''}`}
                      style={{ borderRight: 'none' }}
                      placeholder="Create a strong password"
                      value={formData.password} onChange={handleChange} />
                    <button type="button" className="btn"
                      style={{ border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: '#f8fafc' }}
                      onClick={() => setShowPassword(!showPassword)}>
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                {/* Password Strength */}
                {strength && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: strength.width, height: '100%', background: strength.color, borderRadius: 4, transition: 'width 0.3s ease' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 700, minWidth: 60 }}>{strength.label}</span>
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-lock-fill me-1"></i> Confirm Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                      className={`form-control form-control-custom ${errors.confirmPassword ? 'is-invalid' : formData.confirmPassword && !errors.confirmPassword ? 'is-valid' : ''}`}
                      style={{ borderRight: 'none' }}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword} onChange={handleChange} />
                    <button type="button" className="btn"
                      style={{ border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: '#f8fafc' }}
                      onClick={() => setShowConfirm(!showConfirm)}>
                      <i className={`bi bi-eye${showConfirm ? '-slash' : ''}`}></i>
                    </button>
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>
                </div>

                {/* Career Preference */}
                <div className="mb-4">
                  <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-mortarboard me-1"></i> I am a student of <span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    {[
                      { value: 'after10th', label: 'After 10th', icon: 'bi-book', desc: 'Class 10 Passed' },
                      { value: 'after12th', label: 'After 12th', icon: 'bi-award', desc: 'Class 12 Passed / Appearing' },
                    ].map(opt => (
                      <div key={opt.value} className="col-6">
                        <div onClick={() => handleChange({ target: { name: 'careerPreference', value: opt.value } })}
                          className="p-3 rounded-3 text-center" style={{
                            border: `2px solid ${formData.careerPreference === opt.value ? 'var(--primary-light)' : '#e2e8f0'}`,
                            background: formData.careerPreference === opt.value ? '#eff6ff' : '#f8fafc',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}>
                          <i className={`bi ${opt.icon} d-block mb-1`} style={{
                            fontSize: '1.5rem',
                            color: formData.careerPreference === opt.value ? 'var(--primary-light)' : '#94a3b8',
                          }}></i>
                          <strong style={{ fontSize: '0.85rem', color: formData.careerPreference === opt.value ? 'var(--primary)' : '#475569' }}>
                            {opt.label}
                          </strong>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{opt.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.careerPreference && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                      <i className="bi bi-exclamation-circle me-1"></i>{errors.careerPreference}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-auth" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</>
                    : <><i className="bi bi-person-check me-2"></i>Create Account</>}
                </button>
              </form>

              <p className="text-center mt-4 mb-0" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>Sign In here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
