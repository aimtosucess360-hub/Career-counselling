import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const prefInfo = {
  after10th: { label: 'After 10th Standard', icon: 'bi-book',  color: '#2563a8', bg: '#eff6ff' },
  after12th: { label: 'After 12th Standard', icon: 'bi-award', color: '#10b981', bg: '#f0fdf4' },
};

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [editing,    setEditing]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg,   setErrorMsg]   = useState('');

  const [formData, setFormData] = useState({
    name:             user?.name             || '',
    careerPreference: user?.careerPreference || '',
    bio:              user?.bio              || '',
    phone:            user?.phone            || '',
    city:             user?.city             || '',
  });

  const pref     = prefInfo[user?.careerPreference] || {};
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setErrorMsg(''); setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setErrorMsg('Name cannot be empty.'); return; }
    setLoading(true); setErrorMsg(''); setSuccessMsg('');
    try {
      const res = await axios.put('https://career-counselling-td40.onrender.com/api/user/profile', formData);
      updateUser(res.data.user);
      setSuccessMsg('Profile updated successfully!');
      setEditing(false);
      const u = res.data.user;
      setFormData({ name: u.name||'', careerPreference: u.careerPreference||'', bio: u.bio||'', phone: u.phone||'', city: u.city||'' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally { setLoading(false); }
  };

  const cancelEdit = () => {
    setEditing(false); setErrorMsg(''); setSuccessMsg('');
    setFormData({ name: user?.name||'', careerPreference: user?.careerPreference||'', bio: user?.bio||'', phone: user?.phone||'', city: user?.city||'' });
  };

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--gradient-hero)', padding: '2.5rem 0' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-4">
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)',
              border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>{initials}</div>
            <div>
              <h2 className="text-white fw-800 mb-1" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{user?.name}</h2>
              <p className="text-white-50 mb-0" style={{ fontSize: '0.88rem' }}>
                <i className="bi bi-envelope me-1"></i>{user?.email}
                {user?.city && <><span className="mx-2">·</span><i className="bi bi-geo-alt me-1"></i>{user.city}</>}
              </p>
            </div>
            <Link to="/dashboard" className="btn ms-auto fw-600"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}>
              <i className="bi bi-grid me-1"></i> Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────────────── */}
      <section className="py-5" style={{ background: '#f0f6ff', minHeight: '70vh' }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-8">

              {successMsg && (
                <div className="alert alert-success alert-custom d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-check-circle-fill"></i> {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="alert alert-danger alert-custom d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-exclamation-triangle-fill"></i> {errorMsg}
                </div>
              )}

              {/* ── Profile Card ────────────────────────────────── */}
              <div className="profile-info-card">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="fw-800 mb-0" style={{ color: 'var(--primary)' }}>
                    <i className="bi bi-person-badge me-2"></i>
                    {editing ? 'Edit Profile' : 'Profile Information'}
                  </h5>
                  {!editing && (
                    <button className="btn btn-sm fw-600" onClick={() => setEditing(true)}
                      style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.4rem 1rem' }}>
                      <i className="bi bi-pencil me-1"></i> Edit Profile
                    </button>
                  )}
                </div>

                {editing ? (
                  /* ── EDIT FORM ────────────────────────────────── */
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>
                          <i className="bi bi-person me-1"></i> Full Name *
                        </label>
                        <input type="text" name="name" className="form-control form-control-custom"
                          value={formData.name} onChange={handleChange} placeholder="Your full name" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>
                          <i className="bi bi-telephone me-1"></i> Phone Number *
                        </label>
                        <input type="tel" name="phone" className="form-control form-control-custom"
                          value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>
                          <i className="bi bi-geo-alt me-1"></i> City
                        </label>
                        <input type="text" name="city" className="form-control form-control-custom"
                          value={formData.city} onChange={handleChange} placeholder="Mumbai, Delhi, Pune..." />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>
                          <i className="bi bi-mortarboard me-1"></i> Class Level
                        </label>
                        <select name="careerPreference" className="form-control form-control-custom"
                          value={formData.careerPreference} onChange={handleChange}>
                          <option value="after10th">After 10th Standard</option>
                          <option value="after12th">After 12th Standard</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>
                          <i className="bi bi-chat-text me-1"></i> Bio
                          <span className="text-muted fw-400 ms-1">(max 200 characters)</span>
                        </label>
                        <textarea name="bio" className="form-control form-control-custom" rows="3"
                          value={formData.bio} onChange={handleChange} maxLength={200}
                          placeholder="Tell us about yourself, your interests, aspirations..." />
                        <div className="text-end text-muted mt-1" style={{ fontSize: '0.78rem' }}>{formData.bio.length}/200</div>
                      </div>

                      <div className="col-12 d-flex gap-3">
                        <button type="submit" className="btn fw-700" disabled={loading}
                          style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 2rem' }}>
                          {loading
                            ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                            : <><i className="bi bi-check-circle me-2"></i>Save Changes</>}
                        </button>
                        <button type="button" className="btn fw-600" onClick={cancelEdit}
                          style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: '0.7rem 1.5rem', color: '#64748b', background: '#f8fafc' }}>
                          <i className="bi bi-x-circle me-1"></i> Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* ── VIEW MODE ────────────────────────────────── */
                  <div className="row g-3">
                    {[
                      { icon: 'bi-person',    label: 'Full Name',     value: user?.name },
                      { icon: 'bi-envelope',  label: 'Email Address', value: user?.email },
                      { icon: 'bi-telephone', label: 'Phone Number',  value: user?.phone || 'Not provided' },
                      { icon: 'bi-geo-alt',   label: 'City',          value: user?.city  || 'Not provided' },
                    ].map(field => (
                      <div key={field.label} className="col-md-6">
                        <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                          <p className="mb-1" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <i className={`bi ${field.icon} me-1`}></i>{field.label}
                          </p>
                          <p className="mb-0 fw-600" style={{ color: field.value?.includes?.('Not') ? '#94a3b8' : 'var(--text-dark)', fontSize: '0.92rem' }}>
                            {field.value}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Career Preference */}
                    <div className="col-md-6">
                      <div className="p-3 rounded-3" style={{ background: pref.bg || '#f8fafc', border: `1px solid ${pref.color || '#e2e8f0'}22` }}>
                        <p className="mb-1" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <i className="bi bi-mortarboard me-1"></i>Career Focus
                        </p>
                        <p className="mb-0 fw-700" style={{ color: pref.color }}>
                          <i className={`bi ${pref.icon} me-1`}></i>{pref.label}
                        </p>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="col-md-6">
                      <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <p className="mb-1" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <i className="bi bi-calendar me-1"></i>Member Since
                        </p>
                        <p className="mb-0 fw-600" style={{ fontSize: '0.92rem' }}>
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                            : 'Recently joined'}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="col-12">
                      <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <p className="mb-1" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <i className="bi bi-chat-text me-1"></i>Bio
                        </p>
                        <p className="mb-0" style={{ color: user?.bio ? 'var(--text-dark)' : '#94a3b8', lineHeight: 1.7, fontSize: '0.92rem' }}>
                          {user?.bio || 'No bio added yet. Click Edit Profile to add one.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Quick Navigation ────────────────────────────── */}
              <div className="profile-info-card mt-4">
                <h6 className="fw-700 mb-3" style={{ color: 'var(--primary)' }}>
                  <i className="bi bi-compass me-2"></i>Explore More
                </h6>
                <div className="row g-3">
                  {[
                    { icon: 'bi-grid',         title: 'My Dashboard',      desc: 'View your counselling status & activity',  link: '/dashboard',        color: '#2563a8' },
                    { icon: 'bi-briefcase',    title: 'Explore Careers',   desc: 'Browse 500+ career options',               link: '/careers',          color: '#8b5cf6' },
                    { icon: 'bi-youtube',      title: 'Watch Videos',      desc: 'Expert career counselling videos',          link: '/youtube',          color: '#ef4444' },
                    { icon: 'bi-people-fill',  title: 'Join Counselling',  desc: 'Get personalised expert guidance',         link: '/join-counselling', color: '#10b981' },
                  ].map(item => (
                    <div key={item.title} className="col-md-6">
                      <Link to={item.link} className="d-flex align-items-start gap-3 p-3 rounded-3 text-decoration-none"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: '1.1rem' }}></i>
                        </div>
                        <div>
                          <p className="mb-0 fw-700" style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>{item.title}</p>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.78rem' }}>{item.desc}</p>
                        </div>
                        <i className="bi bi-arrow-right ms-auto text-muted" style={{ paddingTop: '0.5rem' }}></i>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
