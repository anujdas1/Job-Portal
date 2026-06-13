import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowRight, Briefcase, Sparkles, Building, Star, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMyApplications } from '@/api/applications';
import Navbar from '@/components/Navbar';
import './Home.css';

const STATS = [
  { value: '50K+', label: 'Premium Tech Jobs' },
  { value: '12K+', label: 'Hiring Companies' },
  { value: '85%', label: 'Response Rate' },
  { value: 'Free', label: 'For Job Seekers' },
];

const FEATURES = [
  {
    icon: <Sparkles size={22} />,
    title: 'Get Discovered',
    desc: 'Top recruiters use our AI to actively search for candidates with your exact skill set. Let the jobs come to you.',
  },
  {
    icon: <Building size={22} />,
    title: 'Top Tier Companies',
    desc: 'From fast-growing startups to Fortune 500 tech giants, access exclusive roles you won\'t find elsewhere.',
  },
  {
    icon: <Briefcase size={22} />,
    title: 'One-Click Apply',
    desc: 'Create your profile once and apply to hundreds of highly-curated roles instantly without filling out tedious forms.',
  },
];

export default function CandidatesHome() {
  const { user } = useUser();
  const [latestApp, setLatestApp] = useState(null);
  const role = user?.publicMetadata?.role;
  const dashboardLink = role === 'recruiter' ? '/recruiter/dashboard' : role === 'candidate' ? '/candidate/feed' : null;

  useEffect(() => {
    if (user && role === 'candidate') {
      getMyApplications()
        .then((data) => {
          if (data && data.length > 0) {
            // Assume the first one is the latest or sort if necessary
            setLatestApp(data[0]);
          }
        })
        .catch(() => {});
    }
  }, [user, role]);

  return (
    <div className="home-root">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={13} fill="currentColor" />
            <span>Loved by 200,000+ professionals</span>
          </div>
          <h1 className="hero-headline">
            Land Your Next<br />
            <span className="hero-gradient">Dream Role</span>
          </h1>
          <p className="hero-sub">
            Your career deserves better than a black hole resume drop. Get directly in front of hiring managers and easily track your applications.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to={dashboardLink || '/register'} className="btn btn-primary btn-lg">
                {dashboardLink ? 'Go to Job Feed' : 'Complete Setup'} <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create your free profile <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
          <div className="hero-checks">
            {['No premium paywalls', 'Direct recruiter access', 'Real-time alerts'].map((t) => (
              <span key={t} className="hero-check">
                <CheckCircle size={14} color="var(--success)" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating visual */}
        <div className="hero-visual">
          <div className="hero-card card">
            <div className="hero-card-header">
              <div className="hero-card-dot" style={{ background: 'var(--primary)' }} />
              <span className="hero-card-label">Application Update</span>
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>{latestApp ? latestApp.job?.company : 'Stripe'}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{latestApp ? latestApp.job?.title : 'Frontend Engineer'}</p>
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>Your application was moved to:</p>
              <span className="badge badge-blue" style={{ marginTop: '0.25rem', textTransform: 'capitalize' }}>{latestApp ? latestApp.status : 'Interviewing'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Take control of your job search</h2>
            <p>Everything you need to stand out and get hired faster.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-inner">
            <span className="navbar-logo" style={{ fontSize: '1rem' }}>
              <Briefcase size={18} />
              TalentBridge
            </span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} TalentBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
