import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// ── DATA ──────────────────────────────────────────────────────────────────────

const after10th = [
  // Science / Maths path
  {
    id: 1, title: 'Science (PCM)', category: 'Science', icon: 'bi-calculator', color: '#2563a8', bg: '#eff6ff',
    duration: '2 Years (11th-12th)', description: 'Physics, Chemistry, Mathematics – gateway to Engineering, Architecture, Defence and more.',
    skills: ['Analytical thinking', 'Problem solving', 'Mathematics'],
    scope: 'Engineering, Architecture, Pilot, NDA',
    salary: '₹4L – ₹25L+',
    difficulty: 'High',
  },
  {
    id: 2, title: 'Science (PCB)', category: 'Science', icon: 'bi-heart-pulse', color: '#ef4444', bg: '#fef2f2',
    duration: '2 Years (11th-12th)', description: 'Physics, Chemistry, Biology – leads to Medical, Nursing, Pharmacy and allied health sciences.',
    skills: ['Biology', 'Chemistry', 'Lab work'],
    scope: 'MBBS, BDS, BAMS, Nursing, Pharmacy',
    salary: '₹5L – ₹30L+',
    difficulty: 'Very High',
  },
  {
    id: 3, title: 'Commerce', category: 'Commerce', icon: 'bi-graph-up-arrow', color: '#10b981', bg: '#f0fdf4',
    duration: '2 Years (11th-12th)', description: 'Accounts, Economics, Business Studies – perfect for future CAs, bankers, and entrepreneurs.',
    skills: ['Accounts', 'Finance basics', 'Business sense'],
    scope: 'CA, BBA, B.Com, Banking',
    salary: '₹3L – ₹20L+',
    difficulty: 'Medium',
  },
  {
    id: 4, title: 'Arts / Humanities', category: 'Arts', icon: 'bi-palette', color: '#f59e0b', bg: '#fffbeb',
    duration: '2 Years (11th-12th)', description: 'History, Political Science, Geography – excellent for UPSC, Journalism, Law, and Social Work.',
    skills: ['Writing', 'Critical thinking', 'Communication'],
    scope: 'IAS/IPS, Law, Journalism, Teaching',
    salary: '₹2.5L – ₹15L+',
    difficulty: 'Low-Medium',
  },
  // Diploma / ITI
  {
    id: 5, title: 'Polytechnic Diploma', category: 'Diploma', icon: 'bi-tools', color: '#8b5cf6', bg: '#f5f3ff',
    duration: '3 Years', description: 'Lateral-entry to engineering B.Tech (2nd year). Practical, industry-focused and job-ready.',
    skills: ['Practical skills', 'CAD/CAM', 'Workshop'],
    scope: 'Junior Engineer, Technician, B.Tech lateral',
    salary: '₹2L – ₹8L',
    difficulty: 'Medium',
  },
  {
    id: 6, title: 'ITI – Electrician', category: 'ITI', icon: 'bi-lightning-charge', color: '#f97316', bg: '#fff7ed',
    duration: '2 Years', description: 'Govt-recognised trade certificate. High demand in factories, construction and household services.',
    skills: ['Wiring', 'Safety protocols', 'Electrical circuits'],
    scope: 'Govt jobs, Self-employment, Abroad placements',
    salary: '₹1.5L – ₹6L',
    difficulty: 'Low',
  },
  {
    id: 7, title: 'ITI – Fitter / Turner', category: 'ITI', icon: 'bi-wrench', color: '#06b6d4', bg: '#f0fdff',
    duration: '2 Years', description: 'Machining trade with strong demand in manufacturing, automobile and defence sectors.',
    skills: ['Lathe operation', 'Fitting', 'Precision work'],
    scope: 'BHEL, HAL, Railways, Defence, Private Mfg',
    salary: '₹1.5L – ₹5L',
    difficulty: 'Low',
  },
  {
    id: 8, title: 'ITI – Computer Operator (COPA)', category: 'ITI', icon: 'bi-pc-display', color: '#64748b', bg: '#f8fafc',
    duration: '1 Year', description: 'Short, high-value IT trade covering MS Office, internet, data entry and basic programming.',
    skills: ['MS Office', 'Typing', 'Basic computers'],
    scope: 'Data entry, Govt offices, BPO, Banking',
    salary: '₹1.5L – ₹4L',
    difficulty: 'Low',
  },
  {
    id: 9, title: 'ITI – Welder', category: 'ITI', icon: 'bi-fire', color: '#dc2626', bg: '#fef2f2',
    duration: '1 Year', description: 'Welding is a globally demanded skill used in construction, shipbuilding and manufacturing.',
    skills: ['Arc welding', 'Gas welding', 'Blueprint reading'],
    scope: 'Abroad placement, Shipbuilding, Construction',
    salary: '₹2L – ₹8L',
    difficulty: 'Low-Medium',
  },
  {
    id: 10, title: 'Certificate in Fashion Design', category: 'Diploma', icon: 'bi-scissors', color: '#ec4899', bg: '#fdf2f8',
    duration: '1-2 Years', description: 'NIFT / private institutes offer certificate courses. Great entry into fashion industry.',
    skills: ['Sketching', 'Sewing', 'Fabric knowledge'],
    scope: 'Fashion designer, Boutique owner, Stylist',
    salary: '₹2L – ₹12L',
    difficulty: 'Medium',
  },
];

const after12th = [
  // Engineering
  {
    id: 11, title: 'B.Tech / B.E. Engineering', category: 'Engineering', icon: 'bi-cpu', color: '#2563a8', bg: '#eff6ff',
    duration: '4 Years', description: 'India\'s most popular degree. JEE Main/Advanced for IITs/NITs. Branches: CS, Mechanical, Civil, Electronics, etc.',
    skills: ['Coding', 'Math', 'Technical problem solving'],
    scope: 'Software, Core Engineering, R&D, MBA',
    salary: '₹4L – ₹50L+',
    difficulty: 'High',
    exam: 'JEE Main / JEE Advanced',
  },
  {
    id: 12, title: 'B.Sc Computer Science', category: 'Engineering', icon: 'bi-code-slash', color: '#7c3aed', bg: '#f5f3ff',
    duration: '3 Years', description: 'Pure CS degree. Affordable, flexible and equally respected by top IT companies. No JEE needed.',
    skills: ['Programming', 'Data structures', 'Algorithms'],
    scope: 'Software Dev, Data Science, Cybersecurity',
    salary: '₹3.5L – ₹30L+',
    difficulty: 'Medium',
    exam: 'University entrance / Merit',
  },
  // Medical
  {
    id: 13, title: 'MBBS – Allopathy', category: 'Medical', icon: 'bi-hospital', color: '#ef4444', bg: '#fef2f2',
    duration: '5.5 Years (+ Internship)', description: 'The golden standard in medical education. NEET is mandatory. Secure, respected career with huge social impact.',
    skills: ['Biology', 'Patience', 'Empathy', 'Clinical skills'],
    scope: 'Doctor (Specialist), Hospital, Research, Abroad',
    salary: '₹8L – ₹60L+',
    difficulty: 'Very High',
    exam: 'NEET-UG',
  },
  {
    id: 14, title: 'BDS – Dental Surgery', category: 'Medical', icon: 'bi-tooth', color: '#f97316', bg: '#fff7ed',
    duration: '5 Years', description: 'Dental degree via NEET. Can open own clinic post MDS. Very high scope for self-employment.',
    skills: ['Manual dexterity', 'Biology', 'Patient care'],
    scope: 'Dentist, Oral Surgeon, Dental Clinic',
    salary: '₹5L – ₹25L+',
    difficulty: 'High',
    exam: 'NEET-UG',
  },
  {
    id: 15, title: 'B.Sc Nursing', category: 'Medical', icon: 'bi-bandaid', color: '#10b981', bg: '#f0fdf4',
    duration: '4 Years', description: 'Excellent career especially for female students. High demand in India, Gulf and abroad hospitals.',
    skills: ['Patient care', 'Biology', 'Communication'],
    scope: 'Hospital Nurse, ICU, Abroad placement',
    salary: '₹3L – ₹12L+',
    difficulty: 'Medium',
    exam: 'NEET / University entrance',
  },
  // Law
  {
    id: 16, title: 'LLB / BA LLB (Law)', category: 'Law', icon: 'bi-bank', color: '#1d4ed8', bg: '#eff6ff',
    duration: '3 Years (LLB) / 5 Years (Integrated)', description: 'CLAT for top NLUs. Law is booming with corporate, criminal, constitutional and IP specialisations.',
    skills: ['Reading', 'Argumentation', 'Research', 'Logic'],
    scope: 'Advocate, Corporate Lawyer, Judge, Civil Service',
    salary: '₹4L – ₹40L+',
    difficulty: 'High',
    exam: 'CLAT / AILET',
  },
  // Commerce
  {
    id: 17, title: 'Chartered Accountancy (CA)', category: 'Commerce', icon: 'bi-calculator-fill', color: '#10b981', bg: '#f0fdf4',
    duration: '4-5 Years', description: 'India\'s most prestigious finance qualification. ICAI exam-based, no college admission needed. Huge industry demand.',
    skills: ['Accounts', 'Taxation', 'Auditing', 'Finance'],
    scope: 'Big4 Firms, CFO, Bank, Own Practice',
    salary: '₹7L – ₹50L+',
    difficulty: 'Very High',
    exam: 'ICAI (Foundation → Intermediate → Final)',
  },
  {
    id: 18, title: 'BBA – Business Administration', category: 'Commerce', icon: 'bi-briefcase', color: '#f59e0b', bg: '#fffbeb',
    duration: '3 Years', description: 'Management foundation degree. Best when followed by MBA from top institute. Great for entrepreneurs.',
    skills: ['Management', 'Marketing', 'Leadership'],
    scope: 'Manager, Entrepreneur, MBA at IIM',
    salary: '₹3L – ₹15L+ (post-MBA ₹20L+)',
    difficulty: 'Low-Medium',
    exam: 'IPMAT (IIM) / University',
  },
  {
    id: 19, title: 'B.Com / B.Com (Hons)', category: 'Commerce', icon: 'bi-coin', color: '#64748b', bg: '#f8fafc',
    duration: '3 Years', description: 'Widely available commerce degree. Gateway to CA, CS, MBA, Banking and Finance careers.',
    skills: ['Accounting', 'Economics', 'Taxation'],
    scope: 'Banking, Finance, CA, MBA, Govt jobs',
    salary: '₹2.5L – ₹12L',
    difficulty: 'Low-Medium',
    exam: 'CUET / University merit',
  },
  // Arts / Humanities
  {
    id: 20, title: 'BA in Humanities', category: 'Arts', icon: 'bi-globe', color: '#8b5cf6', bg: '#f5f3ff',
    duration: '3 Years', description: 'History, Political Science, Sociology, Psychology, English. Best for UPSC, Law, Social Work, Journalism.',
    skills: ['Writing', 'Research', 'Analytical ability'],
    scope: 'IAS/IPS, Journalist, NGO, Teaching, Social Work',
    salary: '₹2.5L – ₹20L+',
    difficulty: 'Low-Medium',
    exam: 'CUET / University merit',
  },
  {
    id: 21, title: 'Mass Communication / Journalism', category: 'Arts', icon: 'bi-mic', color: '#ec4899', bg: '#fdf2f8',
    duration: '3 Years (BA) / 2 Years (PG)', description: 'Booming field with digital media, OTT and social media growth. Excellent creative career.',
    skills: ['Communication', 'Writing', 'Video production'],
    scope: 'Journalist, Content Creator, PR, OTT, Ad Agency',
    salary: '₹3L – ₹20L+',
    difficulty: 'Medium',
    exam: 'ACJ / IIMC / University',
  },
  // Government Exams
  {
    id: 22, title: 'UPSC Civil Services (IAS/IPS)', category: 'Government', icon: 'bi-award', color: '#dc2626', bg: '#fef2f2',
    duration: '1-3 Years prep after graduation', description: 'India\'s most prestigious exam. Start preparation during graduation. Dream of millions — achievable with the right strategy.',
    skills: ['Reading', 'Current affairs', 'Essay writing'],
    scope: 'IAS, IPS, IFS, IRS and 20+ services',
    salary: '₹7L – ₹22L+ (Govt perks extra)',
    difficulty: 'Extremely High',
    exam: 'UPSC CSE (Prelims → Mains → Interview)',
  },
  {
    id: 23, title: 'SSC CGL / CHSL', category: 'Government', icon: 'bi-building', color: '#f97316', bg: '#fff7ed',
    duration: '6-12 months prep', description: 'Staff Selection Commission exams for central Govt jobs. Lakhs of vacancies every year.',
    skills: ['Maths', 'English', 'Reasoning', 'GK'],
    scope: 'Income Tax Inspector, Audit Officer, Sub-Inspector',
    salary: '₹4L – ₹9L + Govt benefits',
    difficulty: 'Medium',
    exam: 'SSC CGL / CHSL (4-tier process)',
  },
  {
    id: 24, title: 'Banking – IBPS / SBI PO', category: 'Government', icon: 'bi-piggy-bank', color: '#06b6d4', bg: '#f0fdff',
    duration: '6-12 months prep', description: 'Most popular Govt job after graduation. IBPS and SBI conduct annual recruitment for PO and Clerk posts.',
    skills: ['Quantitative aptitude', 'Reasoning', 'English'],
    scope: 'Bank PO, Bank Clerk, RBI Grade B',
    salary: '₹4L – ₹12L + Govt benefits',
    difficulty: 'Medium',
    exam: 'IBPS PO/Clerk / SBI PO/Clerk',
  },
];

// Unique categories
const categories10 = ['All', ...new Set(after10th.map(c => c.category))];
const categories12 = ['All', ...new Set(after12th.map(c => c.category))];

const difficultyColor = {
  'Low': 'success', 'Low-Medium': 'info', 'Medium': 'primary',
  'High': 'warning', 'Very High': 'danger', 'Extremely High': 'danger',
};

// ── SINGLE CAREER CARD ────────────────────────────────────────────────────────
const CareerCard = ({ career }) => (
  <div className="col-md-6 col-xl-4">
    <div className="career-card h-100">
      <div className="career-card-header">
        <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: career.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i className={`bi ${career.icon}`} style={{ color: career.color, fontSize: '1.3rem' }}></i>
          </div>
          <span className={`badge bg-${difficultyColor[career.difficulty] || 'secondary'} career-badge`}>
            {career.difficulty}
          </span>
        </div>
        <h5 className="fw-700 mb-1" style={{ fontSize: '1rem' }}>{career.title}</h5>
        <span className="badge" style={{
          background: career.color + '18', color: career.color, fontSize: '0.75rem',
          fontWeight: 600, padding: '0.25rem 0.7rem', borderRadius: 50,
        }}>{career.category}</span>
      </div>

      <div className="career-card-body">
        <p className="text-muted mb-3" style={{ fontSize: '0.88rem', lineHeight: 1.65 }}>{career.description}</p>

        <div className="d-flex flex-column gap-2 mb-3">
          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
            <i className="bi bi-clock text-muted"></i>
            <span className="text-muted">Duration:</span>
            <span className="fw-600">{career.duration}</span>
          </div>
          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
            <i className="bi bi-currency-rupee text-success"></i>
            <span className="text-muted">Avg Salary:</span>
            <span className="fw-600 text-success">{career.salary}</span>
          </div>
          {career.exam && (
            <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
              <i className="bi bi-file-text text-warning"></i>
              <span className="text-muted">Exam:</span>
              <span className="fw-600">{career.exam}</span>
            </div>
          )}
        </div>

        <div className="mb-3">
          <p className="mb-1" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Skills</p>
          <div className="d-flex flex-wrap gap-1">
            {career.skills.map(s => (
              <span key={s} className="badge" style={{
                background: '#f1f5f9', color: '#475569',
                fontSize: '0.75rem', fontWeight: 500, padding: '0.3rem 0.6rem', borderRadius: 6,
              }}>{s}</span>
            ))}
          </div>
        </div>

        <div className="p-2 rounded-2" style={{ background: '#f8fafc', fontSize: '0.82rem' }}>
          <i className="bi bi-arrow-right-circle me-1" style={{ color: career.color }}></i>
          <strong>Career Scope:</strong> {career.scope}
        </div>
      </div>
    </div>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const Careers = () => {
  const [activeTab, setActiveTab] = useState('10th');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const data = activeTab === '10th' ? after10th : after12th;
  const categories = activeTab === '10th' ? categories10 : categories12;

  // Reset category when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory('All');
    setSearch('');
  };

  const filtered = useMemo(() => {
    return data.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [data, search, selectedCategory]);

  return (
    <>
      {/* Page Header */}
      <section style={{ background: 'var(--gradient-hero)', padding: '4rem 0 3rem' }}>
        <div className="container text-center">
          <span className="hero-badge mb-3">
            <i className="bi bi-compass me-1"></i> Career Explorer
          </span>
          <h1 className="text-white fw-900 mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Explore Career Options
          </h1>
          <p className="text-white-50 mb-0" style={{ fontSize: '1.1rem', maxWidth: 550, margin: '0 auto' }}>
            Detailed information on every career path available after 10th and 12th standard.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5" style={{ background: '#f0f6ff', minHeight: '80vh' }}>
        <div className="container">

          {/* Tab Switcher */}
          <div className="d-flex justify-content-center mb-4">
            <div className="p-1 rounded-3" style={{ background: '#e2e8f0', display: 'inline-flex', gap: 4 }}>
              {['10th', '12th'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className="btn fw-700"
                  style={{
                    borderRadius: 10, padding: '0.6rem 2rem', fontSize: '0.95rem', border: 'none',
                    background: activeTab === tab ? 'var(--gradient-hero)' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <i className={`bi bi-${tab === '10th' ? 'book' : 'award'} me-2`}></i>
                  After {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-6">
              <div className="search-wrapper">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control form-control-custom search-input"
                  placeholder={`Search careers after ${activeTab}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="btn btn-sm fw-600"
                    style={{
                      borderRadius: 50, padding: '0.35rem 1rem', fontSize: '0.82rem',
                      border: '2px solid',
                      borderColor: selectedCategory === cat ? 'var(--primary)' : '#cbd5e1',
                      background: selectedCategory === cat ? 'var(--primary)' : '#fff',
                      color: selectedCategory === cat ? '#fff' : '#64748b',
                      transition: 'all 0.2s',
                    }}
                  >{cat}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 d-flex align-items-center gap-2">
            <span className="fw-700" style={{ color: 'var(--primary)' }}>{filtered.length}</span>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              career path{filtered.length !== 1 ? 's' : ''} found after {activeTab}
              {selectedCategory !== 'All' && <> in <strong>{selectedCategory}</strong></>}
            </span>
          </div>

          {/* Cards Grid */}
          {filtered.length > 0 ? (
            <div className="row g-4">
              {filtered.map(career => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">No careers found matching your search.</h5>
              <p className="text-muted">Try a different keyword or reset the filter.</p>
              <button className="btn btn-outline-primary mt-2" onClick={() => { setSearch(''); setSelectedCategory('All'); }}>
                Reset Filters
              </button>
            </div>
          )}

          {/* CTA Banner */}
          <div className="mt-5 p-4 rounded-4 text-center text-white" style={{ background: 'var(--gradient-hero)' }}>
            <h4 className="fw-800 mb-2">Still confused? Get Personalised Guidance!</h4>
            <p className="mb-3 text-white-50">Create a free account and save your favourite career paths.</p>
            <Link to="/register" className="btn-primary-custom">
              <i className="bi bi-person-plus-fill"></i> Register 
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Careers;
