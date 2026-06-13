import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowRight, Briefcase, Users, Zap, Star, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import './Home.css';

const STATS = [
  { value: '50K+', label: 'Jobs Listed' },
  { value: '12K+', label: 'Companies' },
  { value: '200K+', label: 'Job Seekers' },
  { value: '95%', label: 'Placement Rate' },
];

const COMPANIES = [
  'Google', 'Microsoft', 'Apple', 'Meta', 'Amazon',
  'Jane Street', 'Two Sigma', 'Citadel', 'Optiver', 'Renaissance Technologies'
];

const FEATURES = [
  {
    icon: <Zap size={22} />,
    title: 'AI-Powered Matching',
    desc: 'Our algorithm matches your skills to the perfect roles instantly.',
  },
  {
    icon: <Briefcase size={22} />,
    title: 'Curated Opportunities',
    desc: 'Every listing is verified and updated in real time.',
  },
  {
    icon: <Users size={22} />,
    title: 'Direct Recruiter Access',
    desc: 'Connect directly with hiring managers, no middleman.',
  },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Software Engineer at Google', quote: 'Found my dream job in 2 weeks. The kanban tracking was so helpful!', avatar: 'SC' },
  { name: 'Marcus Webb', role: 'Product Manager at Stripe', quote: 'The AI matching saved me hours of scrolling through irrelevant listings.', avatar: 'MW' },
  { name: 'Priya Nair', role: 'UX Designer at Figma', quote: 'As a recruiter, the kanban board is a game changer for tracking applicants.', avatar: 'PN' },
];

export default function Home() {
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
            <span>Trusted by 200,000+ professionals</span>
          </div>
          <h1 className="hero-headline">
            Find Your Next<br />
            <span className="hero-gradient">Dream Career</span>
          </h1>
          <p className="hero-sub">
            TalentBridge is the modern platform connecting ambitious professionals with world-class companies using AI-powered job matching.
          </p>
          <div className="hero-cta" style={{ gap: '1rem' }}>
            <Link to="/employers" className="btn btn-secondary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
              I am an Employer
            </Link>
            <Link to="/candidates" className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
              I am a Candidate
            </Link>
          </div>
          <div className="hero-checks">
            {['No credit card required', 'Free for job seekers', 'Cancel anytime'].map((t) => (
              <span key={t} className="hero-check">
                <CheckCircle size={14} color="var(--success)" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating job card preview */}
        <div className="hero-visual">
          <div className="hero-card card">
            <div className="hero-card-header">
              <div className="hero-card-dot" style={{ background: '#2563eb' }} />
              <span className="hero-card-label">Latest Opening</span>
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>Senior Product Designer</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Airbnb · San Francisco, CA</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="badge badge-blue">Full-time</span>
              <span className="badge badge-green">Remote OK</span>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>$120k – $180k</span>
              <span className="btn btn-primary btn-sm">Apply Now</span>
            </div>
          </div>
          <div className="hero-float-badge">
            <span>🎉</span>
            <span>142 new jobs today</span>
          </div>
        </div>
      </section>

      {/* Company Carousel */}
      <section className="companies-section">
        <div className="container">
          <p className="companies-label">Trusted by top tech and quant firms</p>
          <div className="carousel-wrapper">
            <div className="carousel-track">
              {[...COMPANIES, ...COMPANIES].map((company, i) => (
                <div key={i} className="company-logo">
                  {company}
                </div>
              ))}
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
            <h2>Why TalentBridge?</h2>
            <p>Everything you need to find your next opportunity — or your next great hire.</p>
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

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Loved by professionals</h2>
            <p>Don't take our word for it — hear from the people who've landed great roles.</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card card">
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to find your next chapter?</h2>
            <p>Join thousands of professionals who found their dream role through TalentBridge.</p>
            {user ? (
              <Link to={dashboardLink || '/register'} className="btn btn-primary btn-lg">
                {dashboardLink ? 'Go to Dashboard' : 'Complete Setup'} <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg">
                Create free account <ArrowRight size={16} />
              </Link>
            )}
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
