import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/* ─── STATIC DATA ─────────────────────────────────────────────── */
const counsellingServices = [
  {
    icon: 'bi-cpu-fill', title: 'Engineering College Selection',
    desc: 'Get personalised guidance to choose the best engineering college based on your JEE rank, budget, branch and location. We compare government, private and deemed universities.',
    color: '#2563a8', bg: '#eff6ff', tag: 'After 12th PCM',
    points: ['IIT / NIT / IIIT Guidance', 'State CET Counselling', 'Branch & College Ranking', 'Fee & Scholarship Info'],
  },
  {
    icon: 'bi-capsule-pill', title: 'Pharmacy College Selection',
    desc: 'Complete counselling for B.Pharm and D.Pharm admissions. Know the best colleges for placements, GPAT coaching and pharma industry career scope.',
    color: '#10b981', bg: '#f0fdf4', tag: 'After 12th PCB / PCM',
    points: ['B.Pharm & D.Pharm Guidance', 'GPAT Exam Preparation', 'Pharma Industry Scope', 'Top College Comparison'],
  },
  {
    icon: 'bi-tools', title: 'Diploma / Polytechnic Colleges',
    desc: 'Expert guidance for polytechnic diploma admissions after 10th. Compare branches like Mechanical, Civil, Electrical, CS and find the best government polytechnic near you.',
    color: '#8b5cf6', bg: '#f5f3ff', tag: 'After 10th',
    points: ['Branch Selection Help', 'Govt vs Private Colleges', 'Lateral Entry to B.Tech', 'Hostel & Fee Details'],
  },
  {
    icon: 'bi-wrench-adjustable-circle-fill', title: 'ITI College Selection',
    desc: 'Find the best ITI college and trade for your interests and local job market. We guide you through government ITI admission and high-demand trades.',
    color: '#f97316', bg: '#fff7ed', tag: 'After 10th',
    points: ['Trade Selection Guidance', 'Govt ITI Admissions', 'NCVT vs SCVT Explained', 'Job & Apprenticeship Info'],
  },
  {
    icon: 'bi-mortarboard-fill', title: 'Guidance After 10th Standard',
    desc: 'Confused about Science, Commerce or Arts? We help 10th pass students choose the right stream and college based on interests, scores and long-term goals.',
    color: '#ef4444', bg: '#fef2f2', tag: 'After 10th',
    points: ['Stream Selection (PCM / PCB / Commerce / Arts)', 'Junior College Admission', 'ITI vs Diploma vs 11th-12th', 'Career Roadmap Planning'],
  },
  {
    icon: 'bi-whatsapp', title: 'Join Our WhatsApp Counselling',
    desc: 'Get free, real-time career guidance on WhatsApp. Daily tips, admission alerts, scholarship news and direct counsellor support.',
    color: '#25D366', bg: '#f0fdf4', tag: 'Free & Instant',
    points: ['Daily Admission Alerts', 'Free Counsellor Q&A', 'Scholarship Updates', 'Peer Community Support'],
    isWhatsapp: true,
  },
];

const features = [
  { icon: 'bi-compass',        title: 'Career Exploration',  desc: 'Explore career paths tailored for after 10th and 12th.',                          color: '#2563a8', bg: '#eff6ff' },
  { icon: 'bi-graph-up-arrow', title: 'Growth Roadmaps',     desc: 'Step-by-step roadmaps for every career — from admission to job placement.',       color: '#10b981', bg: '#f0fdf4' },
  { icon: 'bi-play-circle',    title: 'Video Counselling',   desc: 'Watch expert counselling videos on career choices, entrance exams and college selection.', color: '#ef4444', bg: '#fef2f2' },
  { icon: 'bi-shield-check',   title: 'Verified Guidance',   desc: 'All information verified by experienced counsellors and industry experts.',         color: '#f59e0b', bg: '#fffbeb' },
  { icon: 'bi-people',         title: 'Community Support',   desc: 'Connect with thousands of students and mentors who guide you through decisions.',   color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: 'bi-phone',          title: 'Mobile Friendly',     desc: 'Access career guidance anytime, anywhere on any device.',                          color: '#06b6d4', bg: '#f0fdff' },
];

const carouselSlides = [
  { icon: 'bi-trophy',           title: 'Engineering College Counselling',  subtitle: 'JEE rank to dream college — we guide every step',          bg: 'linear-gradient(135deg, #0f1f33, #2563a8)' },
  { icon: 'bi-mortarboard',      title: 'Guidance for All Students',   subtitle: 'Complete career counselling at absolutely no cost',          bg: 'linear-gradient(135deg, #064e3b, #10b981)' },
  { icon: 'bi-tools',            title: 'ITI & Diploma Admissions',         subtitle: 'Find the right trade and polytechnic college for you',       bg: 'linear-gradient(135deg, #78350f, #f97316)' },
  { icon: 'bi-capsule-pill',     title: 'Pharmacy College Selection',       subtitle: 'B.Pharm & D.Pharm admissions made simple',                  bg: 'linear-gradient(135deg, #064e3b, #0ea5e9)' },
  { icon: 'bi-lightning-charge', title: 'After 10th Guidance',              subtitle: 'Science, Commerce, Arts or Diploma — choose wisely',        bg: 'linear-gradient(135deg, #581c87, #8b5cf6)' },
];

const importancePoints = [
  { icon: 'bi-lightbulb',     text: 'Helps students make informed decisions based on their interests and abilities' },
  { icon: 'bi-target',        text: 'Reduces confusion and anxiety about future stream and college selection' },
  { icon: 'bi-currency-rupee',text: 'Ensures better earning potential by choosing the right field early' },
  { icon: 'bi-heart-pulse',   text: 'Leads to greater job satisfaction and personal fulfilment' },
  { icon: 'bi-clock-history', text: 'Saves years of time that might be wasted on wrong college or trade choices' },
  { icon: 'bi-globe',         text: 'Opens global opportunities by selecting competitive streams and colleges' },
];

const avatarColors = ['#2563a8','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899'];

/* ─── STAR DISPLAY ─────────────────────────────────────────────── */
const StarDisplay = ({ rating }) => (
  <span style={{ color: '#f59e0b', fontSize: '1rem' }}>
    {[1,2,3,4,5].map(s => <i key={s} className={`bi bi-star${s <= rating ? '-fill' : ''}`}></i>)}
  </span>
);

/* ─── FEEDBACK FORM ─────────────────────────────────────────────── */
const FeedbackForm = ({ onSubmitted }) => {
  const { user } = useAuth();
  const [rating,  setRating]  = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!rating)                       { setError('Please select a star rating.');              return; }
    if (message.trim().length < 10)    { setError('Feedback must be at least 10 characters.'); return; }
    setLoading(true);
    try {
      await axios.post('/api/feedback', { rating, message });
      setSuccess('Thank you! Your feedback has been submitted.');
      setRating(0); setMessage('');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally { setLoading(false); }
  };

  if (!user) {
    return (
      <div className="text-center py-4 px-3 rounded-3" style={{ background: '#f0f6ff', border: '2px dashed #cbd5e1' }}>
        <i className="bi bi-lock-fill d-block mb-2" style={{ fontSize: '2rem', color: '#94a3b8' }}></i>
        <p className="fw-600 mb-2" style={{ color: 'var(--primary)' }}>Login to share your feedback</p>
        <p className="text-muted mb-3" style={{ fontSize: '0.88rem' }}>Your experience helps future students make better decisions.</p>
        <Link to="/login" className="btn btn-sm fw-700"
          style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem' }}>
          <i className="bi bi-box-arrow-in-right me-1"></i> Login to Submit
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <h6 className="fw-700 mb-3" style={{ color: 'var(--primary)' }}>
        <i className="bi bi-pencil-square me-2"></i>Share Your Experience
      </h6>
      {error   && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.85rem', borderRadius: 8 }}>{error}</div>}
      {success && <div className="alert alert-success py-2 mb-3" style={{ fontSize: '0.85rem', borderRadius: 8 }}>{success}</div>}
      <div className="mb-3">
        <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>Your Rating *</label>
        <div className="d-flex gap-1 align-items-center">
          {[1,2,3,4,5].map(s => (
            <button key={s} type="button" onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
              style={{ background: 'none', border: 'none', padding: '0 2px', cursor: 'pointer', fontSize: '1.8rem',
                color: s <= (hovered || rating) ? '#f59e0b' : '#cbd5e1', transition: 'color 0.15s' }}>
              <i className="bi bi-star-fill"></i>
            </button>
          ))}
          {rating > 0 && (
            <span className="ms-2 fw-600" style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {['','Poor','Fair','Good','Very Good','Excellent'][rating]}
            </span>
          )}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>Your Feedback *</label>
        <textarea className="form-control" rows="3"
          placeholder="Tell us how AIM 360° helped you (min. 10 characters)..."
          value={message} onChange={e => setMessage(e.target.value)} maxLength={500}
          style={{ borderRadius: 10, border: '2px solid #e2e8f0', fontSize: '0.92rem' }} />
        <div className="text-end text-muted mt-1" style={{ fontSize: '0.75rem' }}>{message.length}/500</div>
      </div>
      <button onClick={handleSubmit} disabled={loading} className="btn fw-700"
        style={{ background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem 1.8rem' }}>
        {loading
          ? <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
          : <><i className="bi bi-send me-2"></i>Submit Feedback</>}
      </button>
    </div>
  );
};

/* ─── MAIN HOME COMPONENT ──────────────────────────────────────── */
const Home = () => {
  const { user } = useAuth();

  const [feedbacks, setFeedbacks] = useState([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [fbRefresh, setFbRefresh] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setFbLoading(true);
        const res = await axios.get('/api/feedback');
        setFeedbacks(res.data.feedbacks || []);
      } catch { setFeedbacks([]); }
      finally { setFbLoading(false); }
    })();
  }, [fbRefresh]);

  return (
    <>
      {/* ═══ HERO ════════════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 hero-content">
              <div className="hero-badge">
                <i className="bi bi-star-fill me-1"></i> India's #1 Career Counselling Platform
              </div>
              <h1 className="hero-title">
                Find Your <span>Perfect College</span> with Expert Guidance
              </h1>
              <p className="hero-subtitle">
                Confused about Engineering, Pharmacy, Diploma or ITI after 10th / 12th?
                Our expert counsellors help you choose the right college.
              </p>

              {/* ── CTA buttons — change based on login state ── */}
              <div className="d-flex flex-wrap gap-3">
                <Link to="/join-counselling" className="btn-primary-custom">
                  <i className="bi bi-people-fill"></i> Join Counselling
                </Link>
                {/* Only show Register / Get Started to guests */}
                {!user && (
                  <Link to="/register" className="btn-outline-custom">
                    <i className="bi bi-rocket-takeoff"></i> Get Started 
                  </Link>
                )}
                {/* Logged-in user sees Dashboard button instead */}
                {user && (
                  <Link to={user.isAdmin ? '/admin' : '/dashboard'} className="btn-outline-custom">
                    <i className="bi bi-grid"></i> My Dashboard
                  </Link>
                )}
              </div>

              <div className="hero-stats">
                {[
                  { number: '50K+', label: 'Students Guided' },
                  { number: '200+', label: 'Colleges Covered' },
                  { number: '100+', label: 'Expert Videos' },
                  { number: '98%',  label: 'Success Rate' },
                ].map(stat => (
                  <div key={stat.label} className="hero-stat">
                    <span className="number">{stat.number}</span>
                    <span className="label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="col-lg-6">
              <div className="hero-image-card">
                <p className="text-white fw-700 mb-3" style={{ fontSize: '1rem', opacity: 0.9 }}>
                  <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Our Counselling Services
                </p>
                <div className="row g-2">
                  {[
                    { icon: 'bi-cpu-fill',                       label: 'Engineering Colleges',  color: '#2563a8' },
                    { icon: 'bi-capsule-pill',                   label: 'Pharmacy Colleges',     color: '#10b981' },
                    { icon: 'bi-tools',                          label: 'Diploma / Polytechnic', color: '#8b5cf6' },
                    { icon: 'bi-wrench-adjustable-circle-fill',  label: 'ITI Colleges',          color: '#f97316' },
                    { icon: 'bi-mortarboard-fill',               label: 'After 10th Guidance',   color: '#ef4444' },
                    { icon: 'bi-whatsapp',                       label: 'WhatsApp Support',      color: '#25D366' },
                  ].map(s => (
                    <div key={s.label} className="col-4">
                      <div className="text-center p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>
                          <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '1.1rem' }}></i>
                        </div>
                        <p className="text-white mb-0" style={{ fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.3 }}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CAROUSEL ════════════════════════════════════════════ */}
      <section className="py-5" style={{ background: '#f0f6ff' }}>
        <div className="container">
          <div id="highlightCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3500">
            <div className="carousel-indicators">
              {carouselSlides.map((_, i) => (
                <button key={i} type="button" data-bs-target="#highlightCarousel" data-bs-slide-to={i} className={i === 0 ? 'active' : ''}></button>
              ))}
            </div>
            <div className="carousel-inner rounded-4 overflow-hidden">
              {carouselSlides.map((slide, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                  <div style={{ background: slide.bg, minHeight: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', textAlign: 'center', color: '#fff' }}>
                    <i className={`bi ${slide.icon} mb-3`} style={{ fontSize: '3rem', opacity: 0.9 }}></i>
                    <h3 className="fw-800 mb-2">{slide.title}</h3>
                    <p className="mb-0" style={{ opacity: 0.8, fontSize: '1rem' }}>{slide.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#highlightCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#highlightCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ OUR COUNSELLING SERVICES ════════════════════════════ */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our <span>Counselling Services</span></h2>
            <div className="section-divider"></div>
            <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
              We specialise in guiding students through college and career selection after 10th and 12th standard.
            </p>
          </div>
          <div className="row g-4">
            {counsellingServices.map((svc, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="feature-card h-100" style={{ borderTop: `4px solid ${svc.color}` }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: svc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi ${svc.icon}`} style={{ color: svc.color, fontSize: '1.5rem' }}></i>
                    </div>
                    <div>
                      <h5 className="fw-700 mb-0" style={{ fontSize: '0.97rem', lineHeight: 1.3 }}>{svc.title}</h5>
                      <span className="badge mt-1" style={{ background: svc.color + '18', color: svc.color, fontSize: '0.72rem', fontWeight: 600, borderRadius: 50, padding: '0.2rem 0.7rem' }}>{svc.tag}</span>
                    </div>
                  </div>
                  <p className="text-muted mb-3" style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>{svc.desc}</p>
                  <ul className="list-unstyled mb-3">
                    {svc.points.map((pt, j) => (
                      <li key={j} className="d-flex align-items-start gap-2 mb-1" style={{ fontSize: '0.82rem' }}>
                        <i className="bi bi-check-circle-fill mt-1" style={{ color: svc.color, flexShrink: 0, fontSize: '0.75rem' }}></i>
                        <span className="text-muted">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  {svc.isWhatsapp ? (
                    <a href="https://whatsapp.com/channel/0029Vb7eB5vJ3jupL4y6fE13" target="_blank" rel="noopener noreferrer"
                      className="btn btn-sm fw-700 w-100"
                      style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem' }}>
                      <i className="bi bi-whatsapp me-1"></i> Join WhatsApp Channel
                    </a>
                  ) : (
                    <Link to="/join-counselling" className="btn btn-sm fw-700 w-100"
                      style={{ background: svc.color, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem' }}>
                      <i className="bi bi-arrow-right-circle me-1"></i> Get Guidance
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ IMPORTANCE ══════════════════════════════════════════ */}
      <section className="py-5" style={{ background: '#f0f6ff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Why It Matters</span>
            <h2 className="section-title">Importance of <span>Career Guidance</span></h2>
            <div className="section-divider"></div>
          </div>
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="row g-3">
                {importancePoints.map((pt, i) => (
                  <div key={i} className="col-12">
                    <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: '#fff', border: '1px solid rgba(26,60,94,0.07)' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #1a3c5e, #2563a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`bi ${pt.icon} text-white`}></i>
                      </div>
                      <p className="mb-0 text-muted" style={{ lineHeight: 1.6, paddingTop: '0.4rem', fontSize: '0.92rem' }}>{pt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="p-4 rounded-4 text-center" style={{ background: 'var(--gradient-hero)' }}>
                <i className="bi bi-map display-1 text-warning mb-3 d-block"></i>
                <h3 className="text-white fw-700 mb-3">Your College Journey Starts Here</h3>

                <Link to="/join-counselling" className="btn-primary-custom">
                  <i className="bi bi-people-fill"></i> Join Counselling
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PLATFORM FEATURES ═══════════════════════════════════ */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Our Platform</span>
            <h2 className="section-title">Everything You Need to <span>Succeed</span></h2>
            <div className="section-divider"></div>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h5 className="fw-700 mb-2">{f.title}</h5>
                  <p className="text-muted mb-0" style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHATSAPP BANNER ═════════════════════════════════════ */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #064e3b, #10b981)' }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-4 flex-wrap">
                <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="bi bi-whatsapp text-white" style={{ fontSize: '2.2rem' }}></i>
                </div>
                <div>
                  <h3 className="text-white fw-800 mb-1">Join Our WhatsApp Counselling Channel</h3>
                  <p className="text-white-50 mb-0" style={{ fontSize: '0.95rem' }}>
                    Get daily admission alerts, scholarship updates and direct counsellor support — completely.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <a href="https://whatsapp.com/channel/0029Vb7eB5vJ3jupL4y6fE13" target="_blank" rel="noopener noreferrer"
                className="btn fw-700 d-inline-flex align-items-center gap-2"
                style={{ background: '#fff', color: '#10b981', border: 'none', borderRadius: 12, padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}>
                <i className="bi bi-whatsapp" style={{ fontSize: '1.2rem' }}></i> Join WhatsApp Channel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STUDENT FEEDBACK ════════════════════════════════════ */}
      <section className="py-5" style={{ background: '#f0f6ff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Student Reviews</span>
            <h2 className="section-title">What Our <span>Students Say</span></h2>
            <div className="section-divider"></div>
            <p className="text-muted">Real feedback from real students who used our counselling service.</p>
          </div>

          <div className="row g-4">
            {/* Feedback Cards */}
            <div className="col-lg-8">
              {fbLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-custom mx-auto mb-3"></div>
                  <p className="text-muted">Loading feedback...</p>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-chat-square-dots display-1 text-muted d-block mb-3"></i>
                  <h6 className="text-muted">No feedback yet — be the first!</h6>
                </div>
              ) : (
                <div className="row g-3">
                  {feedbacks.map((fb, i) => {
                    const initials = fb.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    const col = avatarColors[i % avatarColors.length];
                    return (
                      <div key={fb._id} className="col-md-6">
                        <div className="testimonial-card h-100">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <StarDisplay rating={fb.rating} />
                            <span className="badge" style={{ background: col + '18', color: col, fontSize: '0.72rem', fontWeight: 600, borderRadius: 50, padding: '0.25rem 0.7rem' }}>
                              {fb.careerPreference === 'after10th' ? 'After 10th' : 'After 12th'}
                            </span>
                          </div>
                          <p className="text-muted mb-3" style={{ lineHeight: 1.75, fontStyle: 'italic', fontSize: '0.9rem' }}>"{fb.message}"</p>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{ width: 42, height: 42, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>
                              {initials}
                            </div>
                            <div>
                              <p className="fw-700 mb-0" style={{ fontSize: '0.9rem' }}>{fb.name}</p>
                              <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>
                                {new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Feedback Form */}
            <div className="col-lg-4">
              <FeedbackForm onSubmitted={() => setFbRefresh(r => r + 1)} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA — only show Register button to guests ═══════════ */}
      <section className="py-5" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container text-center py-3">
          <h2 className="text-white fw-800 mb-3" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
            Ready to Find Your Dream College?
          </h2>
          <p className="text-white-50 mb-4" style={{ fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 1.5rem' }}>
            {user
              ? 'Welcome back! Continue your counselling journey.'
              : 'Join 50,000+ students who have already got  career counselling. Register today!'}
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/join-counselling" className="btn-primary-custom">
              <i className="bi bi-people-fill"></i> Join  Counselling
            </Link>
            {!user ? (
              <Link to="/register" className="btn-outline-custom">
                <i className="bi bi-person-plus-fill"></i> Create Account
              </Link>
            ) : (
              <Link to={user.isAdmin ? '/admin' : '/dashboard'} className="btn-outline-custom">
                <i className="bi bi-grid"></i> Go to My Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
