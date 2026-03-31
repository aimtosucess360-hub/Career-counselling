import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb7eB5vJ3jupL4y6fE13';

const services = [
  { icon: 'bi-cpu-fill',                      label: 'Engineering College Selection', color: '#2563a8' },
  { icon: 'bi-capsule-pill',                  label: 'Pharmacy College Selection',    color: '#10b981' },
  { icon: 'bi-tools',                         label: 'Diploma / Polytechnic',          color: '#8b5cf6' },
  { icon: 'bi-wrench-adjustable-circle-fill', label: 'ITI College Selection',          color: '#f97316' },
  { icon: 'bi-mortarboard-fill',              label: 'After 10th Guidance',            color: '#ef4444' },
  { icon: 'bi-whatsapp',                      label: 'WhatsApp Counselling',           color: '#25D366' },
];

const JoinCounselling = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [checkLoading, setCheckLoading]   = useState(true);
  const [form, setForm] = useState({
    phone: user?.phone || '',
    city: user?.city || '',
    whatsappJoined: false,
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  // If logged in, check whether already joined
  useEffect(() => {
    if (!user) { setCheckLoading(false); return; }
    (async () => {
      try {
        const res = await axios.get('https://career-counselling-td40.onrender.com/api/counselling/status');
        setAlreadyJoined(res.data.joined);
      } catch { /* ignore */ }
      finally { setCheckLoading(false); }
    })();
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^[0-9+\- ]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) { navigate('/register'); return; }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true); setApiError('');
    try {
      await axios.post('/api/counselling/join', form);
      setSuccess(true);
      setAlreadyJoined(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to join. Please try again.');
    } finally { setLoading(false); }
  };

  // Loading state
  if (checkLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-custom"></div>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--gradient-hero)', padding: '4rem 0 3rem' }}>
        <div className="container text-center">
          <span className="hero-badge mb-3">
            <i className="bi bi-people-fill me-1"></i> Counselling Programme
          </span>
          <h1 className="text-white fw-900 mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Join Our Career Counselling
          </h1>
          <p className="text-white-50 mb-0" style={{ fontSize: '1rem', maxWidth: 540, margin: '0 auto' }}>
            Get personalised, expert guidance for Engineering, Pharmacy, Diploma and ITI college admissions.
          </p>
        </div>
      </section>

      <section style={{ background: '#f0f6ff', padding: '3rem 0 4rem' }}>
        <div className="container">
          <div className="row g-5 align-items-start justify-content-center">

            {/* ── LEFT: What you get ─────────────────────────── */}
            <div className="col-lg-5">
              <div className="profile-info-card mb-4">
                <h5 className="fw-700 mb-4" style={{ color: 'var(--primary)' }}>
                  <i className="bi bi-gift me-2 text-warning"></i>What You Get
                </h5>
                <div className="d-flex flex-column gap-3">
                  {services.map((s, i) => (
                    <div key={i} className="d-flex align-items-center gap-3 p-2 rounded-3" style={{ background: '#f8fafc' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '1.1rem' }}></i>
                      </div>
                      <span className="fw-600" style={{ fontSize: '0.9rem' }}>{s.label}</span>
                      <i className="bi bi-check-circle-fill ms-auto" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Banner */}
              <div className="p-4 rounded-4 text-white" style={{ background: 'linear-gradient(135deg, #075e54, #25D366)' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <i className="bi bi-whatsapp" style={{ fontSize: '2.5rem' }}></i>
                  <div>
                    <h5 className="fw-800 mb-0">Join Our WhatsApp Channel</h5>
                    <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.85rem' }}>Get daily updates, alerts & support</p>
                  </div>
                </div>
                <p className="mb-3" style={{ opacity: 0.85, fontSize: '0.88rem', lineHeight: 1.6 }}>
                  Daily admission alerts · Scholarship news · Counsellor Q&A · Peer community
                </p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="btn fw-700 w-100"
                  style={{ background: '#fff', color: '#25D366', border: 'none', borderRadius: 10, padding: '0.7rem' }}>
                  <i className="bi bi-whatsapp me-2"></i>Join WhatsApp Channel
                </a>
              </div>
            </div>

            {/* ── RIGHT: Form ────────────────────────────────── */}
            <div className="col-lg-6">
              {/* Already joined */}
              {alreadyJoined && !success && (
                <div className="auth-card text-center">
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0fdf4', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '2.5rem' }}></i>
                  </div>
                  <h4 className="fw-800 mb-2" style={{ color: 'var(--primary)' }}>You're Already Enrolled!</h4>
                  <p className="text-muted mb-4">You have already joined our counselling programme. Our team will reach out to you.</p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn fw-700"
                      style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem' }}>
                      <i className="bi bi-whatsapp me-2"></i>WhatsApp Channel
                    </a>
                    <Link to="/profile" className="btn fw-700"
                      style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem' }}>
                      <i className="bi bi-person-circle me-2"></i>View Profile
                    </Link>
                  </div>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="auth-card text-center">
                  <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#f0fdf4', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="fw-800 mb-2 text-success">Successfully Joined!</h4>
                  <p className="text-muted mb-3">Welcome to AIM 360° Counselling! Our team will contact you soon.</p>
                  <div className="p-3 rounded-3 mb-4" style={{ background: '#f0fdf4', border: '1px solid #a7f3d0' }}>
                    <p className="fw-600 mb-2" style={{ color: '#065f46', fontSize: '0.9rem' }}>Next Steps:</p>
                    <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>✅ Join our WhatsApp channel for instant updates</p>
                    <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>✅ Watch our YouTube videos for guidance</p>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>✅ Our counsellor will call you within 24–48 hours</p>
                  </div>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                      className="btn fw-700" style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem' }}>
                      <i className="bi bi-whatsapp me-2"></i>Join WhatsApp
                    </a>
                    <Link to="/youtube" className="btn fw-700"
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem' }}>
                      <i className="bi bi-youtube me-2"></i>Watch Videos
                    </Link>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              {!alreadyJoined && !success && (
                <div className="auth-card">
                  <div className="auth-logo mb-2">
                    <i className="bi bi-mortarboard-fill me-2" style={{ color: '#f59e0b' }}></i>
                    AIM <span>360</span>
                  </div>
                  <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                    {user ? 'Complete your counselling registration below.' : 'Create an account or login first to join the counselling programme.'}
                  </p>

                  {!user && (
                    <div className="mb-4">
                      <div className="alert alert-info py-3" style={{ borderRadius: 12, fontSize: '0.88rem' }}>
                        <i className="bi bi-info-circle-fill me-2"></i>
                        You need an account to join counselling.
                      </div>
                      <div className="d-flex gap-3">
                        <Link to="/register" state={{ from: '/join-counselling' }} className="btn fw-700 flex-grow-1"
                          style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem' }}>
                          <i className="bi bi-person-plus me-2"></i>Register
                        </Link>
                        <Link to="/login" state={{ from: '/join-counselling' }} className="btn fw-600 flex-grow-1"
                          style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: '0.75rem', color: '#64748b', background: '#f8fafc' }}>
                          <i className="bi bi-box-arrow-in-right me-2"></i>Login
                        </Link>
                      </div>
                    </div>
                  )}

                  {user && (
                    <>
                      {apiError && (
                        <div className="alert alert-danger alert-custom d-flex align-items-center gap-2 mb-4">
                          <i className="bi bi-exclamation-triangle-fill"></i>{apiError}
                        </div>
                      )}

                      <div className="row g-3 mb-3 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div className="col-12">
                          <p className="fw-700 mb-1" style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registering As</p>
                          <p className="fw-700 mb-0" style={{ color: 'var(--primary)' }}>{user.name}
                            <span className="text-muted fw-400 ms-2" style={{ fontSize: '0.85rem' }}>({user.email})</span>
                          </p>
                        </div>
                        <div className="col-12">
                          <p className="fw-700 mb-1" style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class Level</p>
                          <span className="badge" style={{ background: '#eff6ff', color: '#2563a8', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: 50, fontSize: '0.85rem' }}>
                            <i className="bi bi-mortarboard me-1"></i>
                            {user.careerPreference === 'after10th' ? 'After 10th Standard' : 'After 12th Standard'}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                          <i className="bi bi-telephone me-1"></i> WhatsApp / Phone Number *
                        </label>
                        <input type="tel" name="phone" className={`form-control form-control-custom ${errors.phone ? 'is-invalid' : ''}`}
                          placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        <div className="text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                          <i className="bi bi-info-circle me-1"></i>Our counsellor will call on this number.
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-600" style={{ fontSize: '0.9rem' }}>
                          <i className="bi bi-geo-alt me-1"></i> City (optional)
                        </label>
                        <input type="text" name="city" className="form-control form-control-custom"
                          placeholder="Mumbai, Pune, Delhi..." value={form.city} onChange={handleChange} />
                      </div>

                      <div className="mb-4 p-3 rounded-3" style={{ background: '#f0fdf4', border: '1px solid #a7f3d0' }}>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="whatsappJoined" id="waCheck"
                            checked={form.whatsappJoined} onChange={handleChange} />
                          <label className="form-check-label fw-600" htmlFor="waCheck" style={{ fontSize: '0.88rem', color: '#065f46' }}>
                            <i className="bi bi-whatsapp me-1" style={{ color: '#25D366' }}></i>
                            I have joined the WhatsApp channel
                          </label>
                        </div>
                        <div className="mt-2">
                          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                            className="btn btn-sm fw-700" style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.35rem 1rem', fontSize: '0.82rem' }}>
                            <i className="bi bi-whatsapp me-1"></i>Join Channel First
                          </a>
                        </div>
                      </div>

                      <button onClick={handleSubmit} disabled={loading} className="btn-auth">
                        {loading
                          ? <><span className="spinner-border spinner-border-sm me-2"></span>Registering...</>
                          : <><i className="bi bi-check-circle me-2"></i>Confirm & Join Counselling</>}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JoinCounselling;
