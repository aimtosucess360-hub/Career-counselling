import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CHANNEL_URL = 'https://www.youtube.com/@Aim360-e3f';

const categoryColors = {
  'After 12th':  { bg: '#eff6ff', color: '#2563a8' },
  'After 10th':  { bg: '#f0fdf4', color: '#10b981' },
  'Government':  { bg: '#fef2f2', color: '#ef4444' },
  'Commerce':    { bg: '#fffbeb', color: '#f59e0b' },
  'Engineering': { bg: '#f5f3ff', color: '#8b5cf6' },
  'Medical':     { bg: '#fdf2f8', color: '#ec4899' },
  'Diploma/ITI': { bg: '#fff7ed', color: '#f97316' },
  'General':     { bg: '#f8fafc', color: '#64748b' },
};

const VIDEO_CATEGORIES = ['After 10th','After 12th','Engineering','Medical','Commerce','Government','Diploma/ITI','General'];

/* ── Admin: Add Video Form ────────────────────────────────────────── */
const AdminAddVideoForm = ({ onAdded }) => {
  const [form, setForm] = useState({ title: '', youtubeUrl: '', description: '', category: 'General', pinned: false });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setError(''); setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title.trim() || !form.youtubeUrl.trim()) {
      setError('Title and YouTube URL are required.'); return;
    }
    setLoading(true);
    try {
      await axios.post('/api/videos', form);
      setSuccess('Video added successfully!');
      setForm({ title: '', youtubeUrl: '', description: '', category: 'General', pinned: false });
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add video.');
    } finally { setLoading(false); }
  };

  return (
    <div className="profile-info-card mb-4" style={{ border: '2px solid #f59e0b' }}>
      <h6 className="fw-700 mb-3 d-flex align-items-center gap-2" style={{ color: '#d97706' }}>
        <i className="bi bi-shield-fill-check text-warning"></i> Admin — Add New Video
      </h6>
      {error   && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.85rem', borderRadius: 8 }}>{error}</div>}
      {success && <div className="alert alert-success py-2 mb-3" style={{ fontSize: '0.85rem', borderRadius: 8 }}>{success}</div>}

      <div className="row g-3">
        <div className="col-12">
          <label className="form-label fw-600" style={{ fontSize: '0.85rem' }}>Video Title *</label>
          <input type="text" name="title" className="form-control form-control-custom" placeholder="e.g. How to get into NIT after JEE Mains"
            value={form.title} onChange={handleChange} />
        </div>
        <div className="col-12">
          <label className="form-label fw-600" style={{ fontSize: '0.85rem' }}>YouTube URL *</label>
          <input type="text" name="youtubeUrl" className="form-control form-control-custom"
            placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
            value={form.youtubeUrl} onChange={handleChange} />
          <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-info-circle me-1"></i>Paste any YouTube video link — ID is extracted automatically.
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-600" style={{ fontSize: '0.85rem' }}>Category</label>
          <select name="category" className="form-control form-control-custom" value={form.category} onChange={handleChange}>
            {VIDEO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-600" style={{ fontSize: '0.85rem' }}>Description (optional)</label>
          <input type="text" name="description" className="form-control form-control-custom" placeholder="Brief description..."
            value={form.description} onChange={handleChange} />
        </div>
        <div className="col-12">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="pinned" id="pinnedCheck"
              checked={form.pinned} onChange={handleChange} />
            <label className="form-check-label fw-600" htmlFor="pinnedCheck" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-pin-angle me-1 text-warning"></i> Pin this video (shows first / featured)
            </label>
          </div>
        </div>
        <div className="col-12">
          <button onClick={handleSubmit} disabled={loading} className="btn fw-700"
            style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem 2rem' }}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Adding...</> : <><i className="bi bi-plus-circle me-2"></i>Add Video</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main YouTube Page ───────────────────────────────────────────── */
const YouTube = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  const [videos, setVideos]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [featured, setFeatured]         = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const [refresh, setRefresh]           = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/videos');
        const vids = res.data.videos || [];
        setVideos(vids);
        if (vids.length > 0) setFeatured(vids[0]);
      } catch { setVideos([]); }
      finally { setLoading(false); }
    };
    fetchVideos();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`/api/videos/${id}`);
      setRefresh(r => r + 1);
      if (featured?._id === id) setFeatured(null);
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete.'); }
  };

  const handlePin = async (id) => {
    try {
      await axios.patch(`/api/videos/${id}/pin`);
      setRefresh(r => r + 1);
    } catch (err) { alert('Failed to pin/unpin.'); }
  };

  const categories = ['All', ...new Set(videos.map(v => v.category))];
  const filtered = activeCategory === 'All' ? videos : videos.filter(v => v.category === activeCategory);

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--gradient-hero)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-8 text-center text-lg-start">
              <span className="hero-badge mb-3">
                <i className="bi bi-youtube me-1"></i> AIM 360° Channel
              </span>
              <h1 className="text-white fw-900 mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                Career Counselling Videos
              </h1>
              <p className="text-white-50 mb-0" style={{ fontSize: '1rem', maxWidth: 520 }}>
                Watch our expert videos on college selection, entrance exams and career guidance for students after 10th & 12th.
              </p>
            </div>
            <div className="col-lg-4 text-center text-lg-end">
              <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                className="btn fw-700 d-inline-flex align-items-center gap-2"
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 12, padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                <i className="bi bi-youtube" style={{ fontSize: '1.3rem' }}></i>
                Visit Our Channel
              </a>
              <p className="text-white-50 mt-2 mb-0" style={{ fontSize: '0.8rem' }}>youtube.com/@Aim360-e3f</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: '#f0f6ff', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Admin Add Video Form ───────────────────────────── */}
          {isAdmin && (
            <AdminAddVideoForm onAdded={() => setRefresh(r => r + 1)} />
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-custom mx-auto mb-3"></div>
              <p className="text-muted">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-camera-video-off display-1 text-muted d-block mb-3"></i>
              <h5 className="text-muted">No videos added yet.</h5>
              {isAdmin && <p className="text-muted">Use the form above to add videos from your YouTube channel.</p>}
              {!isAdmin && (
                <p className="text-muted">
                  Videos will appear here soon. Meanwhile,{' '}
                  <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', fontWeight: 600 }}>
                    visit our YouTube channel
                  </a>.
                </p>
              )}
            </div>
          ) : (
            <>
              {/* ── Featured Player ──────────────────────────── */}
              {featured && (
                <div className="mb-5">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-play-circle-fill text-danger"></i>
                    <h5 className="fw-700 mb-0" style={{ color: 'var(--primary)' }}>
                      {featured.pinned ? <><i className="bi bi-pin-angle-fill text-warning me-1"></i>Pinned Video</> : 'Now Playing'}
                    </h5>
                  </div>
                  <div className="row g-4 align-items-start">
                    <div className="col-lg-8">
                      <div className="video-card">
                        <div className="video-wrapper">
                          <iframe
                            src={`https://www.youtube.com/embed/${featured.videoId}?rel=0&modestbranding=1`}
                            title={featured.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen style={{ border: 'none' }}
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                            <h5 className="fw-700 mb-0">{featured.title}</h5>
                            <span className="badge flex-shrink-0" style={{
                              background: categoryColors[featured.category]?.bg || '#f8fafc',
                              color: categoryColors[featured.category]?.color || '#64748b',
                              fontWeight: 600, fontSize: '0.78rem', padding: '0.35rem 0.8rem', borderRadius: 50,
                            }}>{featured.category}</span>
                          </div>
                          {featured.description && (
                            <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{featured.description}</p>
                          )}
                          <div className="d-flex gap-4 flex-wrap" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            <a href={`https://youtube.com/watch?v=${featured.videoId}`} target="_blank" rel="noopener noreferrer"
                              style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>
                              <i className="bi bi-youtube me-1"></i>Watch on YouTube
                            </a>
                            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                              style={{ color: '#2563a8', textDecoration: 'none', fontWeight: 600 }}>
                              <i className="bi bi-collection-play me-1"></i>More Videos
                            </a>
                            {isAdmin && (
                              <>
                                <button onClick={() => handlePin(featured._id)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f59e0b', fontWeight: 600, padding: 0, fontSize: '0.85rem' }}>
                                  <i className={`bi bi-pin${featured.pinned ? '-angle-fill' : '-angle'} me-1`}></i>
                                  {featured.pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button onClick={() => handleDelete(featured._id)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 600, padding: 0, fontSize: '0.85rem' }}>
                                  <i className="bi bi-trash me-1"></i>Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Channel Info Panel */}
                    <div className="col-lg-4">
                      <div className="profile-info-card">
                        <h6 className="fw-700 mb-3" style={{ color: 'var(--primary)' }}>
                          <i className="bi bi-info-circle me-2"></i>About Our Channel
                        </h6>
                        <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3" style={{ background: '#fef2f2' }}>
                          <div style={{ width: 54, height: 54, borderRadius: 14, flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fecaca' }}>
                            <i className="bi bi-youtube" style={{ color: '#ef4444', fontSize: '1.8rem' }}></i>
                          </div>
                          <div>
                            <p className="fw-700 mb-0" style={{ fontSize: '0.95rem' }}>AIM 360</p>
                            <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>Career Counselling Channel</p>
                          </div>
                        </div>
                        {[
                          { icon: 'bi-play-circle', label: 'Total Videos', value: `${videos.length}` },
                          { icon: 'bi-people', label: 'Students Helped', value: '50K+' },
                          { icon: 'bi-translate', label: 'Language', value: 'Hindi + English' },
                          { icon: 'bi-broadcast', label: 'Topics', value: 'Eng, Pharma, ITI, Diploma' },
                        ].map(stat => (
                          <div key={stat.label} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                              <i className={`bi ${stat.icon} me-2`}></i>{stat.label}
                            </span>
                            <span className="fw-700" style={{ fontSize: '0.85rem' }}>{stat.value}</span>
                          </div>
                        ))}
                        <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                          className="btn w-100 mt-3 fw-700 d-flex align-items-center justify-content-center gap-2"
                          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem' }}>
                          <i className="bi bi-youtube"></i> Subscribe on YouTube
                        </a>
                        <a href="https://whatsapp.com/channel/0029Vb7eB5vJ3jupL4y6fE13" target="_blank" rel="noopener noreferrer"
                          className="btn w-100 mt-2 fw-700 d-flex align-items-center justify-content-center gap-2"
                          style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem' }}>
                          <i className="bi bi-whatsapp"></i> Join WhatsApp Channel
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Category Filter ───────────────────────────── */}
              <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
                <span className="fw-700" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>Filter:</span>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className="btn btn-sm fw-600"
                    style={{
                      borderRadius: 50, padding: '0.35rem 1rem', fontSize: '0.82rem', border: '2px solid',
                      borderColor: activeCategory === cat ? '#ef4444' : '#cbd5e1',
                      background: activeCategory === cat ? '#ef4444' : '#fff',
                      color: activeCategory === cat ? '#fff' : '#64748b', transition: 'all 0.2s',
                    }}>{cat}</button>
                ))}
              </div>

              {/* ── Video Grid ────────────────────────────────── */}
              <div className="row g-4">
                {filtered.map(video => (
                  <div key={video._id} className="col-md-6 col-xl-4">
                    <div className="video-card h-100" style={{ cursor: 'pointer', outline: featured?._id === video._id ? '3px solid #ef4444' : 'none' }}
                      onClick={() => { setFeatured(video); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                      {/* Thumbnail */}
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                          alt={video.title}
                          style={{ width: '100%', height: 185, objectFit: 'cover', display: 'block' }}
                          onError={e => { e.target.src = 'https://via.placeholder.com/320x185/1a3c5e/ffffff?text=AIM+360'; }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                          <i className="bi bi-play-circle-fill text-white" style={{ fontSize: '3rem' }}></i>
                        </div>
                        {video.pinned && (
                          <span style={{ position: 'absolute', top: 8, left: 8, background: '#f59e0b', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                            <i className="bi bi-pin-angle-fill me-1"></i>PINNED
                          </span>
                        )}
                        {featured?._id === video._id && (
                          <span style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                            ▶ PLAYING
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h6 className="fw-700 mb-1" style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>{video.title}</h6>
                        {video.description && (
                          <p className="text-muted mb-2" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                            {video.description.slice(0, 75)}{video.description.length > 75 ? '...' : ''}
                          </p>
                        )}
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <span className="badge" style={{
                            background: categoryColors[video.category]?.bg || '#f8fafc',
                            color: categoryColors[video.category]?.color || '#64748b',
                            fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.7rem', borderRadius: 50,
                          }}>{video.category}</span>
                          {isAdmin && (
                            <div className="d-flex gap-2" onClick={e => e.stopPropagation()}>
                              <button onClick={() => handlePin(video._id)} title={video.pinned ? 'Unpin' : 'Pin'}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f59e0b', padding: '2px 4px', fontSize: '0.95rem' }}>
                                <i className={`bi bi-pin${video.pinned ? '-angle-fill' : '-angle'}`}></i>
                              </button>
                              <button onClick={() => handleDelete(video._id)} title="Delete"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px 4px', fontSize: '0.95rem' }}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-camera-video display-1 text-muted d-block mb-3"></i>
                  <h5 className="text-muted">No videos in this category.</h5>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default YouTube;
