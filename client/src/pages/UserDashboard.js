import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb7eB5vJ3jupL4y6fE13';

const prefInfo = {
  after10th: { label: 'After 10th Standard', icon: 'bi-book',  color: '#2563a8', bg: '#eff6ff' },
  after12th: { label: 'After 12th Standard', icon: 'bi-award', color: '#10b981', bg: '#f0fdf4' },
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [counsellingStatus, setCounsellingStatus] = useState(null);
  const [videos, setVideos]     = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const pref    = prefInfo[user?.careerPreference] || {};
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [statusRes, videoRes, fbRes] = await Promise.all([
          axios.get('/api/counselling/status'),
          axios.get('/api/videos'),
          axios.get('/api/feedback'),
        ]);
        setCounsellingStatus(statusRes.data);
        setVideos((videoRes.data.videos || []).slice(0, 3));
        setFeedbacks((fbRes.data.feedbacks || []).slice(0, 2));
      } catch { /* ignore */ }
      finally { setLoadingData(false); }
    };
    loadAll();
  }, []);

  const quickLinks = [
    { icon: 'bi-briefcase',         label: 'Explore Careers',       link: '/careers',           color: '#2563a8', bg: '#eff6ff' },
    { icon: 'bi-youtube',           label: 'Watch Videos',          link: '/youtube',            color: '#ef4444', bg: '#fef2f2' },
    { icon: 'bi-people-fill',       label: 'Join Counselling',      link: '/join-counselling',   color: '#10b981', bg: '#f0fdf4' },
    { icon: 'bi-person-badge',      label: 'Edit Profile',          link: '/profile',            color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  return (
    <>
      {/* ── Header Banner ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--gradient-hero)', padding: '2.5rem 0' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--accent)', border: '3px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>{initials}</div>
            <div>
              <p className="text-white-50 mb-0" style={{ fontSize: '0.85rem' }}>Welcome back 👋</p>
              <h2 className="text-white fw-800 mb-1" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{user?.name}</h2>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.8rem', borderRadius: 50 }}>
                  <i className={`bi ${pref.icon} me-1`}></i>{pref.label}
                </span>
                {user?.phone && (
                  <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.8rem', borderRadius: 50 }}>
                    <i className="bi bi-telephone me-1"></i>{user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: '#f0f6ff', minHeight: '70vh' }}>
        <div className="container">
          <div className="row g-4">

            {/* ── LEFT COLUMN ─────────────────────────────────────── */}
            <div className="col-lg-4">

              {/* Counselling Status Card */}
              <div className="profile-info-card mb-4">
                <h6 className="fw-700 mb-3" style={{ color: 'var(--primary)' }}>
                  <i className="bi bi-people-fill me-2 text-success"></i>Counselling Status
                </h6>
                {loadingData ? (
                  <div className="text-center py-3"><div className="spinner-custom mx-auto"></div></div>
                ) : counsellingStatus?.joined ? (
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3" style={{ background: '#f0fdf4', border: '1px solid #a7f3d0' }}>
                      <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '1.8rem', flexShrink: 0 }}></i>
                      <div>
                        <p className="fw-700 mb-0" style={{ color: '#065f46' }}>Enrolled!</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>You are in our counselling programme</p>
                      </div>
                    </div>
                    {counsellingStatus.student && (
                      <div className="d-flex flex-column gap-2" style={{ fontSize: '0.82rem' }}>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Phone registered</span>
                          <span className="fw-600">{counsellingStatus.student.phone || '—'}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">WhatsApp joined</span>
                          <span className="fw-600" style={{ color: counsellingStatus.student.whatsappJoined ? '#10b981' : '#94a3b8' }}>
                            {counsellingStatus.student.whatsappJoined ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Enrolled on</span>
                          <span className="fw-600">{new Date(counsellingStatus.student.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    )}
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                      className="btn btn-sm fw-700 w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                      style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem' }}>
                      <i className="bi bi-whatsapp"></i> WhatsApp Channel
                    </a>
                  </div>
                ) : (
                  <div>
                    <div className="p-3 rounded-3 mb-3" style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}>
                      <p className="fw-600 mb-1" style={{ color: '#92400e', fontSize: '0.88rem' }}>Not yet enrolled</p>
                      <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Join our free counselling to get personalised guidance.</p>
                    </div>
                    <Link to="/join-counselling" className="btn btn-sm fw-700 w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem' }}>
                      <i className="bi bi-people-fill"></i> Join Free Counselling
                    </Link>
                  </div>
                )}
              </div>

              {/* Profile Quick View */}
              <div className="profile-info-card">
                <h6 className="fw-700 mb-3" style={{ color: 'var(--primary)' }}>
                  <i className="bi bi-person-circle me-2"></i>My Profile
                </h6>
                {[
                  { icon: 'bi-person',    label: 'Name',   value: user?.name },
                  { icon: 'bi-envelope',  label: 'Email',  value: user?.email },
                  { icon: 'bi-telephone', label: 'Phone',  value: user?.phone || 'Not provided' },
                  { icon: 'bi-geo-alt',   label: 'City',   value: user?.city  || 'Not provided' },
                ].map(f => (
                  <div key={f.label} className="d-flex align-items-center gap-3 py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <i className={`bi ${f.icon} text-muted`} style={{ fontSize: '0.9rem', width: 18 }}></i>
                    <span className="text-muted" style={{ fontSize: '0.8rem', minWidth: 44 }}>{f.label}</span>
                    <span className="fw-600 ms-auto text-end" style={{ fontSize: '0.82rem', color: f.value.includes('Not') ? '#94a3b8' : 'var(--text-dark)', maxWidth: '60%', wordBreak: 'break-all' }}>{f.value}</span>
                  </div>
                ))}
                <Link to="/profile" className="btn btn-sm fw-700 w-100 mt-3"
                  style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem' }}>
                  <i className="bi bi-pencil me-1"></i> Edit Profile
                </Link>
              </div>
            </div>

            {/* ── RIGHT COLUMN ────────────────────────────────────── */}
            <div className="col-lg-8">

              {/* Quick Links */}
              <div className="profile-info-card mb-4">
                <h6 className="fw-700 mb-3" style={{ color: 'var(--primary)' }}>
                  <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Quick Actions
                </h6>
                <div className="row g-3">
                  {quickLinks.map(ql => (
                    <div key={ql.label} className="col-6 col-md-3">
                      <Link to={ql.link} className="text-decoration-none">
                        <div className="text-center p-3 rounded-3 h-100" style={{ background: ql.bg, border: `1px solid ${ql.color}22`, transition: 'all 0.2s', cursor: 'pointer' }}>
                          <i className={`bi ${ql.icon} d-block mb-2`} style={{ color: ql.color, fontSize: '1.6rem' }}></i>
                          <p className="mb-0 fw-600" style={{ fontSize: '0.78rem', color: ql.color, lineHeight: 1.3 }}>{ql.label}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Videos */}
              <div className="profile-info-card mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-700 mb-0" style={{ color: 'var(--primary)' }}>
                    <i className="bi bi-youtube text-danger me-2"></i>Latest Videos
                  </h6>
                  <Link to="/youtube" className="text-decoration-none" style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                    View all <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                {loadingData ? (
                  <div className="text-center py-3"><div className="spinner-custom mx-auto"></div></div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-3">
                    <p className="text-muted mb-2" style={{ fontSize: '0.88rem' }}>No videos yet.</p>
                    <Link to="/youtube" className="btn btn-sm" style={{ color: '#ef4444', border: '1px solid #ef4444', borderRadius: 8 }}>Check YouTube Page</Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {videos.map(v => (
                      <div key={v._id} className="d-flex align-items-center gap-3 p-2 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <img src={`https://img.youtube.com/vi/${v.videoId}/default.jpg`} alt={v.title}
                          style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                          onError={e => { e.target.style.display = 'none'; }} />
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="fw-600 mb-0" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</p>
                          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{v.category}</p>
                        </div>
                        <Link to="/youtube" style={{ color: '#ef4444', flexShrink: 0 }}>
                          <i className="bi bi-play-circle-fill" style={{ fontSize: '1.3rem' }}></i>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* WhatsApp CTA */}
              <div className="p-4 rounded-4 text-white" style={{ background: 'linear-gradient(135deg, #075e54, #25D366)' }}>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <i className="bi bi-whatsapp" style={{ fontSize: '2.5rem', flexShrink: 0 }}></i>
                  <div className="flex-grow-1">
                    <h6 className="fw-800 mb-1">Join Our WhatsApp Counselling Channel</h6>
                    <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.85rem' }}>Daily admission alerts, scholarship updates and counsellor support.</p>
                  </div>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                    className="btn fw-700 flex-shrink-0"
                    style={{ background: '#fff', color: '#25D366', border: 'none', borderRadius: 10, padding: '0.6rem 1.4rem', fontSize: '0.88rem' }}>
                    <i className="bi bi-whatsapp me-1"></i> Join Now
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserDashboard;
