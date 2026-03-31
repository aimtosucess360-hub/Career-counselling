import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/* ── Stat Card ─────────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, color, bg }) => (
  <div className="col-6 col-lg-3">
    <div className="feature-card text-center">
      <div style={{ width: 60, height: 60, borderRadius: 16, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
        <i className={`bi ${icon}`} style={{ color, fontSize: '1.6rem' }}></i>
      </div>
      <h3 className="fw-900 mb-0" style={{ color, fontSize: '2rem' }}>{value ?? '—'}</h3>
      <p className="text-muted mb-0" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</p>
    </div>
  </div>
);

/* ── Class Badge ───────────────────────────────────────────────── */
const ClassBadge = ({ level }) => (
  <span className="badge" style={{
    background: level === 'after10th' ? '#eff6ff' : '#f0fdf4',
    color: level === 'after10th' ? '#2563a8' : '#10b981',
    fontWeight: 600, fontSize: '0.75rem', padding: '0.3rem 0.7rem', borderRadius: 50,
  }}>
    {level === 'after10th' ? 'After 10th' : 'After 12th'}
  </span>
);

/* ── Admin Dashboard ───────────────────────────────────────────── */
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [activeTab,  setActiveTab]  = useState('students');
  const [stats,      setStats]      = useState(null);
  const [students,   setStudents]   = useState([]);
  const [feedbacks,  setFeedbacks]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');

  // Guard: redirect non-admins
  useEffect(() => {
    if (user && !user.isAdmin) navigate('/', { replace: true });
  }, [user, navigate]);

  /* Fetch all data */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, studRes, fbRes] = await Promise.all([
        axios.get('https://career-counselling-td40.onrender.com/api/admin/dashboard'),
        axios.get('https://career-counselling-td40.onrender.com/api/admin/students'),
        axios.get('https://career-counselling-td40.onrender.com/api/admin/feedback'),
      ]);
      setStats(dashRes.data);
      setStudents(studRes.data.students || []);
      setFeedbacks(fbRes.data.feedbacks || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user?.isAdmin) fetchAll(); }, [user, fetchAll]);

  /* Export CSV */
  const handleExport = async () => {
    try {
      const res = await axios.get('https://career-counselling-td40.onrender.com/api/admin/students/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href = url; a.download = 'counselling_students.csv'; a.click();
      window.URL.revokeObjectURL(url);
    } catch { alert('Export failed.'); }
  };

  /* Toggle feedback approval */
  const toggleFeedback = async (id) => {
    try {
      const res = await axios.patch(`https://career-counselling-td40.onrender.com/api/admin/feedback/${id}`);
      setFeedbacks(prev => prev.map(f => f._id === id ? res.data.feedback : f));
    } catch { alert('Failed to update.'); }
  };

  /* Delete feedback */
  const deleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback permanently?')) return;
    try {
      await axios.delete(`/api/feedback/${id}`);
      setFeedbacks(prev => prev.filter(f => f._id !== id));
    } catch { alert('Failed to delete.'); }
  };

  /* Filtered students */
  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q)  ||
      s.email.toLowerCase().includes(q) ||
      (s.phone && s.phone.includes(q))  ||
      (s.city && s.city.toLowerCase().includes(q))
    );
  });

  if (!user?.isAdmin) return null;

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--gradient-hero)', padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <span className="hero-badge mb-2">
                <i className="bi bi-shield-fill-check me-1"></i> Admin Panel
              </span>
              <h1 className="text-white fw-900 mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
                Admin Dashboard
              </h1>
              <p className="text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>
                Logged in as <strong className="text-white">{user.name}</strong> · {user.email}
              </p>
            </div>
            <button onClick={fetchAll} className="btn fw-700"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '0.6rem 1.5rem' }}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: '#f0f6ff', minHeight: '80vh' }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-custom mx-auto mb-3"></div>
              <p className="text-muted">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* ── Stat Cards ──────────────────────────────────── */}
              <div className="row g-4 mb-4">
                <StatCard icon="bi-people-fill"     label="Total Users"          value={stats?.totalUsers}       color="#2563a8" bg="#eff6ff" />
                <StatCard icon="bi-person-check-fill" label="Counselling Enrolled" value={stats?.totalCounselling} color="#10b981" bg="#f0fdf4" />
                <StatCard icon="bi-chat-square-quote-fill" label="Feedback Received" value={stats?.totalFeedback}   color="#f59e0b" bg="#fffbeb" />
                <StatCard icon="bi-play-btn-fill"   label="Videos Added"         value={stats?.totalVideos}      color="#ef4444" bg="#fef2f2" />
              </div>

              {/* ── Tabs ────────────────────────────────────────── */}
              <div className="profile-info-card">
                <div className="d-flex gap-2 mb-4 flex-wrap">
                  {[
                    { id: 'students',  icon: 'bi-person-lines-fill',       label: `Students (${students.length})` },
                    { id: 'feedback',  icon: 'bi-chat-square-quote-fill',  label: `Feedback (${feedbacks.length})` },
                    { id: 'recent',    icon: 'bi-clock-history',            label: 'Recent Joins' },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className="btn fw-700 d-flex align-items-center gap-2"
                      style={{
                        borderRadius: 10, padding: '0.55rem 1.2rem', fontSize: '0.88rem', border: 'none',
                        background: activeTab === tab.id ? 'var(--gradient-hero)' : '#f1f5f9',
                        color:      activeTab === tab.id ? '#fff' : '#64748b',
                        transition: 'all 0.2s',
                      }}>
                      <i className={`bi ${tab.icon}`}></i>{tab.label}
                    </button>
                  ))}
                </div>

                {/* ── STUDENTS TAB ────────────────────────────── */}
                {activeTab === 'students' && (
                  <>
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-4 flex-wrap">
                      <div className="search-wrapper" style={{ maxWidth: 360, flex: 1 }}>
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control form-control-custom search-input"
                          placeholder="Search by name, email, phone or city..."
                          value={search} onChange={e => setSearch(e.target.value)} />
                      </div>
                      <button onClick={handleExport} className="btn fw-700 d-flex align-items-center gap-2"
                        style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem 1.4rem' }}>
                        <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV / Excel
                      </button>
                    </div>

                    {filteredStudents.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-people display-1 text-muted d-block mb-3"></i>
                        <p className="text-muted">{search ? 'No students match your search.' : 'No students have joined counselling yet.'}</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle" style={{ fontSize: '0.88rem' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              <th className="fw-700" style={{ color: '#475569', padding: '0.75rem 1rem' }}>#</th>
                              <th className="fw-700" style={{ color: '#475569' }}>Student</th>
                              <th className="fw-700" style={{ color: '#475569' }}>Phone</th>
                              <th className="fw-700" style={{ color: '#475569' }}>Class</th>
                              <th className="fw-700" style={{ color: '#475569' }}>City</th>
                              <th className="fw-700" style={{ color: '#475569' }}>WhatsApp</th>
                              <th className="fw-700" style={{ color: '#475569' }}>Joined On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((s, i) => {
                              const initials = s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                              const colors = ['#2563a8','#10b981','#f59e0b','#ef4444','#8b5cf6','#f97316'];
                              const col = colors[i % colors.length];
                              return (
                                <tr key={s._id}>
                                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>{i + 1}</td>
                                  <td>
                                    <div className="d-flex align-items-center gap-2">
                                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                                        {initials}
                                      </div>
                                      <div>
                                        <p className="fw-600 mb-0">{s.name}</p>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>{s.email}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="fw-600">{s.phone || '—'}</td>
                                  <td><ClassBadge level={s.classLevel} /></td>
                                  <td className="text-muted">{s.city || '—'}</td>
                                  <td>
                                    {s.whatsappJoined
                                      ? <span className="badge" style={{ background: '#f0fdf4', color: '#10b981', fontWeight: 600 }}><i className="bi bi-check-circle-fill me-1"></i>Yes</span>
                                      : <span className="badge" style={{ background: '#f8fafc', color: '#94a3b8', fontWeight: 600 }}><i className="bi bi-x-circle me-1"></i>No</span>}
                                  </td>
                                  <td className="text-muted">{new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-info-circle me-1"></i>
                      Showing {filteredStudents.length} of {students.length} enrolled students. Click "Export CSV / Excel" to download.
                    </p>
                  </>
                )}

                {/* ── FEEDBACK TAB ─────────────────────────────── */}
                {activeTab === 'feedback' && (
                  <>
                    {feedbacks.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-chat-square-quote display-1 text-muted d-block mb-3"></i>
                        <p className="text-muted">No feedback submitted yet.</p>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {feedbacks.map(fb => {
                          const stars = '★'.repeat(fb.rating) + '☆'.repeat(5 - fb.rating);
                          return (
                            <div key={fb._id} className="col-md-6">
                              <div className="p-3 rounded-3 h-100" style={{ background: fb.approved ? '#f8fafc' : '#fef2f2', border: `1px solid ${fb.approved ? '#e2e8f0' : '#fecaca'}` }}>
                                <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                                  <div>
                                    <p className="fw-700 mb-0" style={{ fontSize: '0.9rem' }}>{fb.name}</p>
                                    <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{fb.email}</p>
                                  </div>
                                  <div className="d-flex gap-1">
                                    <button onClick={() => toggleFeedback(fb._id)} title={fb.approved ? 'Hide' : 'Approve'}
                                      className="btn btn-sm" style={{ borderRadius: 6, padding: '0.25rem 0.5rem', background: fb.approved ? '#fffbeb' : '#f0fdf4', border: 'none', color: fb.approved ? '#d97706' : '#10b981', fontSize: '0.8rem' }}>
                                      <i className={`bi bi-eye${fb.approved ? '-slash' : ''}`}></i>
                                    </button>
                                    <button onClick={() => deleteFeedback(fb._id)} title="Delete"
                                      className="btn btn-sm" style={{ borderRadius: 6, padding: '0.25rem 0.5rem', background: '#fef2f2', border: 'none', color: '#ef4444', fontSize: '0.8rem' }}>
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="mb-2" style={{ color: '#f59e0b', fontSize: '0.95rem' }}>{stars}</div>
                                <p className="text-muted mb-2" style={{ fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.6 }}>"{fb.message}"</p>
                                <div className="d-flex align-items-center justify-content-between">
                                  <span className="badge" style={{ background: fb.approved ? '#f0fdf4' : '#fef2f2', color: fb.approved ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.72rem' }}>
                                    {fb.approved ? '✓ Visible' : '✗ Hidden'}
                                  </span>
                                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    {new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* ── RECENT TAB ───────────────────────────────── */}
                {activeTab === 'recent' && (
                  <>
                    <h6 className="fw-700 mb-3" style={{ color: 'var(--primary)' }}>
                      <i className="bi bi-clock-history me-2"></i>Last 10 Students Who Joined
                    </h6>
                    {stats?.recentStudents?.length === 0 ? (
                      <p className="text-muted">No recent joins.</p>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {(stats?.recentStudents || []).map((s, i) => {
                          const initials = s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                          const colors = ['#2563a8','#10b981','#f59e0b','#ef4444','#8b5cf6','#f97316'];
                          const col = colors[i % colors.length];
                          return (
                            <div key={s._id} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                              <div style={{ width: 44, height: 44, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                                {initials}
                              </div>
                              <div className="flex-grow-1">
                                <p className="fw-700 mb-0" style={{ fontSize: '0.9rem' }}>{s.name}</p>
                                <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{s.email} · {s.phone}</p>
                              </div>
                              <div className="text-end">
                                <ClassBadge level={s.classLevel} />
                                <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.75rem' }}>
                                  {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
