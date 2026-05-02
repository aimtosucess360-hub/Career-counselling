// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, user } = useAuth();

//   // If already logged in, redirect to appropriate dashboard
//   useEffect(() => {
//     if (user) {
//       navigate(user.isAdmin ? '/admin' : '/dashboard', { replace: true });
//     }
//   }, [user, navigate]);

//   const [formData, setFormData]   = useState({ email: '', password: '' });
//   const [errors, setErrors]       = useState({});
//   const [apiError, setApiError]   = useState('');
//   const [loading, setLoading]     = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const validate = () => {
//     const e = {};
//     if (!formData.email.trim())     e.email    = 'Email is required.';
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = 'Enter a valid email address.';
//     if (!formData.password)         e.password = 'Password is required.';
//     return e;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(p => ({ ...p, [name]: value }));
//     if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
//     setApiError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError('');
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }

//     setLoading(true);
//     try {
//       const res = await axios.post('https://career-counselling-1.onrender.com/api/auth/login', {
//         email:    formData.email.trim(),
//         password: formData.password,
//       });
//       login(res.data.user, res.data.token);
//       navigate(res.data.user.isAdmin ? '/admin' : '/dashboard', { replace: true });
//     } catch (err) {
//       setApiError(err.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="auth-section">
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-lg-5 col-md-7">
//             <div className="auth-card">

//               <div className="auth-logo">
//                 <i className="bi bi-mortarboard-fill me-2" style={{ color: '#f59e0b' }}></i>
//                 AIM <span>360</span>
//               </div>
//               <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
//                 Welcome back! Sign in to your account
//               </p>

//               {apiError && (
//                 <div className="alert alert-danger alert-custom d-flex align-items-center gap-2 mb-4">
//                   <i className="bi bi-exclamation-triangle-fill"></i> {apiError}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} noValidate>
//                 {/* Email */}
//                 <div className="mb-3">
//                   <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
//                     <i className="bi bi-envelope me-1"></i> Email Address
//                   </label>
//                   <input type="email" name="email"
//                     className={`form-control form-control-custom ${errors.email ? 'is-invalid' : ''}`}
//                     placeholder="Enter your email address"
//                     value={formData.email} onChange={handleChange} autoComplete="email" />
//                   {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//                 </div>

//                 {/* Password */}
//                 <div className="mb-4">
//                   <div className="d-flex justify-content-between align-items-center mb-1">
//                     <label className="form-label fw-600 mb-0" style={{ fontSize: '0.9rem' }}>
//                       <i className="bi bi-lock me-1"></i> Password
//                     </label>
//                     <a href="#!" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
//                       Forgot password?
//                     </a>
//                   </div>
//                   <div className="input-group">
//                     <input type={showPassword ? 'text' : 'password'} name="password"
//                       className={`form-control form-control-custom ${errors.password ? 'is-invalid' : ''}`}
//                       style={{ borderRight: 'none' }}
//                       placeholder="Enter your password"
//                       value={formData.password} onChange={handleChange} autoComplete="current-password" />
//                     <button type="button" className="btn"
//                       style={{ border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: '#f8fafc' }}
//                       onClick={() => setShowPassword(!showPassword)}>
//                       <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
//                     </button>
//                     {errors.password && <div className="invalid-feedback">{errors.password}</div>}
//                   </div>
//                 </div>

//                 <button type="submit" className="btn-auth" disabled={loading}>
//                   {loading
//                     ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</>
//                     : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
//                 </button>
//               </form>

//               <div className="d-flex align-items-center gap-3 my-4">
//                 <hr className="flex-grow-1 m-0" />
//                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>OR</span>
//                 <hr className="flex-grow-1 m-0" />
//               </div>

//               <Link to="/register" className="btn w-100 fw-700 text-decoration-none d-flex align-items-center justify-content-center gap-2"
//                 style={{ border: '2px solid #e2e8f0', borderRadius: 12, padding: '0.75rem', color: 'var(--primary)', background: '#f8fafc' }}>
//                 <i className="bi bi-person-plus"></i> Create New Account
//               </Link>

//               <p className="text-center mt-4 mb-0" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
//                 By signing in you agree to our{' '}
//                 <a href="#!" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>Terms</a>
//                 {' & '}
//                 <a href="#!" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>Privacy Policy</a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ── Forgot Password Modal ────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState('idle'); // idle | loading | sent | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    try {
      await axios.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      setStatus('sent');
      setMessage('Password reset link sent! Please check your email inbox (and spam folder).');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    // Backdrop
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Box */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: '2rem',
        width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h5 className="fw-800 mb-0" style={{ color: 'var(--primary, #1a3c5e)' }}>
              <i className="bi bi-key-fill me-2 text-warning"></i>Forgot Password?
            </h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.83rem' }}>
              Enter your email and we'll send a reset link
            </p>
          </div>
          <button onClick={onClose} style={{
            background: '#f1f5f9', border: 'none', borderRadius: 8,
            width: 36, height: 36, cursor: 'pointer', color: '#64748b', flexShrink: 0,
          }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Sent state */}
        {status === 'sent' ? (
          <div className="text-center py-2">
            <div style={{
              width: 70, height: 70, borderRadius: '50%', background: '#f0fdf4',
              border: '3px solid #10b981', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 1rem',
            }}>
              <i className="bi bi-envelope-check-fill" style={{ color: '#10b981', fontSize: '1.8rem' }}></i>
            </div>
            <h6 className="fw-700 mb-2 text-success">Email Sent!</h6>
            <p className="text-muted mb-4" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{message}</p>
            <button onClick={onClose} className="btn fw-700 w-100" style={{
              background: 'linear-gradient(135deg, #0f1f33 0%, #1a3c5e 50%, #2563a8 100%)',
              color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem',
            }}>
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {status === 'error' && (
              <div className="alert alert-danger py-2 mb-3 d-flex align-items-center gap-2"
                style={{ borderRadius: 10, fontSize: '0.85rem', border: 'none' }}>
                <i className="bi bi-exclamation-triangle-fill"></i>{message}
              </div>
            )}
            <div className="mb-4">
              <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-envelope me-1"></i> Registered Email Address
              </label>
              <input
                type="email"
                className="form-control"
                style={{
                  border: '2px solid #e2e8f0', borderRadius: 10, padding: '0.75rem 1rem',
                  fontSize: '0.95rem', background: '#f8fafc',
                }}
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                autoFocus
              />
              <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-info-circle me-1"></i>
                We'll send a secure password reset link to this email.
              </p>
            </div>
            <div className="d-flex gap-3">
              <button type="button" onClick={onClose} className="btn fw-600 flex-grow-1" style={{
                border: '2px solid #e2e8f0', borderRadius: 10, padding: '0.75rem',
                color: '#64748b', background: '#f8fafc',
              }}>
                Cancel
              </button>
              <button type="submit" disabled={status === 'loading'} className="btn fw-700 flex-grow-1" style={{
                background: 'linear-gradient(135deg, #0f1f33 0%, #1a3c5e 50%, #2563a8 100%)',
                color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem',
              }}>
                {status === 'loading'
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                  : <><i className="bi bi-send me-2"></i>Send Reset Link</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Login Page ───────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showForgot, setShowForgot] = useState(false);

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData]           = useState({ email: '', password: '' });
  const [errors, setErrors]               = useState({});
  const [apiError, setApiError]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [showPassword, setShowPassword]   = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.email.trim())   e.email    = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = 'Enter a valid email address.';
    if (!formData.password)       e.password = 'Password is required.';
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
      const res = await axios.post('/api/auth/login', {
        email: formData.email.trim(), password: formData.password,
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
    <>
      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5">
              <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                  <i className="bi bi-mortarboard-fill me-2" style={{ color: '#f59e0b' }}></i>
                  AIM <span>360</span>
                </div>
                <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                  Welcome back! Sign in to your account
                </p>

                {/* API Error */}
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
                    <input
                      type="email" name="email"
                      className={`form-control form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter your email address"
                      value={formData.email} onChange={handleChange} autoComplete="email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  {/* Password */}
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-600 mb-0" style={{ fontSize: '0.9rem' }}>
                        <i className="bi bi-lock me-1"></i> Password
                      </label>
                      {/* ── Forgot Password trigger ── */}
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        style={{
                          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                          fontSize: '0.82rem', color: '#2563a8', fontWeight: 600,
                          textDecoration: 'underline',
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'} name="password"
                        className={`form-control form-control-custom ${errors.password ? 'is-invalid' : ''}`}
                        style={{ borderRight: 'none' }}
                        placeholder="Enter your password"
                        value={formData.password} onChange={handleChange} autoComplete="current-password"
                      />
                      <button type="button" className="btn"
                        style={{ border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: '#f8fafc' }}
                        onClick={() => setShowPassword(!showPassword)}>
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>

                  <div className="mb-4"></div>

                  <button type="submit" className="btn-auth" disabled={loading}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</>
                      : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
                  </button>
                </form>

                <div className="d-flex align-items-center gap-3 my-4">
                  <hr className="flex-grow-1 m-0" />
                  <span className="text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>OR</span>
                  <hr className="flex-grow-1 m-0" />
                </div>

                <Link to="/register"
                  className="btn w-100 fw-700 text-decoration-none d-flex align-items-center justify-content-center gap-2"
                  style={{ border: '2px solid #e2e8f0', borderRadius: 12, padding: '0.75rem', color: '#1a3c5e', background: '#f8fafc' }}>
                  <i className="bi bi-person-plus"></i> Create New Account
                </Link>

                <p className="text-center mt-4 mb-0" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  By signing in you agree to our{' '}
                  <a href="#!" style={{ color: '#2563a8', textDecoration: 'none' }}>Terms</a>
                  {' & '}
                  <a href="#!" style={{ color: '#2563a8', textDecoration: 'none' }}>Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;


// export default Login;
