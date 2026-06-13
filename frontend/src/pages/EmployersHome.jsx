import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowRight, Search, Briefcase, Zap, Star, LayoutDashboard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import './Home.css';

const STATS = [
  { value: '200K+', label: 'Active Candidates' },
  { value: '14 Days', label: 'Avg. Time to Hire' },
  { value: '95%', label: 'Offer Acceptance Rate' },
  { value: '0$', label: 'To Get Started' },
];

const FEATURES = [
  {
    icon: <Search size={22} />,
    title: 'AI Candidate Matching',
    desc: 'Our proprietary algorithm scans thousands of profiles to find the exact match for your role requirements instantly.',
  },
  {
    icon: <LayoutDashboard size={22} />,
    title: 'Visual Kanban ATS',
    desc: 'Move candidates through your pipeline with our intuitive drag-and-drop tracking system.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Instant Outreach',
    desc: 'Connect directly with top-tier talent in real-time. No more waiting days for an email response.',
  },
];

export default function EmployersHome() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const dashboardLink = role === 'recruiter' ? '/recruiter/dashboard' : role === 'candidate' ? '/candidate/feed' : null;

  return (
    <div className="home-root">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={13} fill="currentColor" />
            <span>The #1 platform for tech hiring</span>
          </div>
          <h1 className="hero-headline">
            Hire Top Talent<br />
            <span className="hero-gradient">Faster Than Ever</span>
          </h1>
          <p className="hero-sub">
            Stop sorting through irrelevant resumes. TalentBridge connects you with verified, high-intent professionals using AI-powered matching and a visual ATS built for speed.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to={dashboardLink || '/register'} className="btn btn-primary btn-lg">
                {dashboardLink ? 'Go to Dashboard' : 'Complete Setup'} <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start Hiring for Free <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Floating visual */}
        <div className="hero-visual">
          <div className="hero-card card">
            <div className="hero-card-header">
              <div className="hero-card-dot" style={{ background: 'var(--success)' }} />
              <span className="hero-card-label">AI Match Detected</span>
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>Alexander Davis</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Senior Full Stack Engineer · 98% Match</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="badge badge-blue">React</span>
              <span className="badge badge-blue">Node.js</span>
              <span className="badge badge-purple">System Design</span>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <span className="btn btn-primary btn-sm">Message Candidate</span>
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
            <h2>Everything you need to scale your team</h2>
            <p>Powerful tools designed exclusively for modern recruiters and hiring managers.</p>
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
