import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData]   = useState({ email: '', password: '' });
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.email.trim())     e.email    = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = 'Enter a valid email address.';
    if (!formData.password)         e.password = 'Password is required.';
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
      const res = await axios.post('https://career-counselling-1.onrender.com/api/auth/login', {
        email:    formData.email.trim(),
        password: formData.password,
      });
      login(res.data.user, res.data.token);
      navigate(res.data.user.isAdmin ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="auth-card">

              <div className="auth-logo">
                <i className="bi bi-mortarboard-fill me-2" style={{ color: '#f59e0b' }}></i>
                AIM <span>360</span>
              </div>
              <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                Welcome back! Sign in to your account
              </p>

              {apiError && (
                <div className="alert alert-danger alert-custom d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-exclamation-triangle-fill"></i> {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-envelope me-1"></i> Email Address
                  </label>
                  <input type="email" name="email"
                    className={`form-control form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email address"
                    value={formData.email} onChange={handleChange} autoComplete="email" />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-600 mb-0" style={{ fontSize: '0.9rem' }}>
                      <i className="bi bi-lock me-1"></i> Password
                    </label>
                    <a href="#!" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="input-group">
                    <input type={showPassword ? 'text' : 'password'} name="password"
                      className={`form-control form-control-custom ${errors.password ? 'is-invalid' : ''}`}
                      style={{ borderRight: 'none' }}
                      placeholder="Enter your password"
                      value={formData.password} onChange={handleChange} autoComplete="current-password" />
                    <button type="button" className="btn"
                      style={{ border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: '#f8fafc' }}
                      onClick={() => setShowPassword(!showPassword)}>
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                <button type="submit" className="btn-auth" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</>
                    : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
                </button>
              </form>

              <div className="d-flex align-items-center gap-3 my-4">
                <hr className="flex-grow-1 m-0" />
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>OR</span>
                <hr className="flex-grow-1 m-0" />
              </div>

              <Link to="/register" className="btn w-100 fw-700 text-decoration-none d-flex align-items-center justify-content-center gap-2"
                style={{ border: '2px solid #e2e8f0', borderRadius: 12, padding: '0.75rem', color: 'var(--primary)', background: '#f8fafc' }}>
                <i className="bi bi-person-plus"></i> Create New Account
              </Link>

              <p className="text-center mt-4 mb-0" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                By signing in you agree to our{' '}
                <a href="#!" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>Terms</a>
                {' & '}
                <a href="#!" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
