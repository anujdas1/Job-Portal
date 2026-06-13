import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AuthPage.css';

export default function SignUp() {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={14} style={{ marginRight: '0.25rem' }} /> Back to Home
        </Link>
        <Link to="/" className="auth-logo">
          <Briefcase size={28} />
          <span>TalentBridge</span>
        </Link>
        <h1 className="auth-headline">Create an Account</h1>
        <p className="auth-sub">Sign up to start your journey.</p>
      </div>
      <ClerkSignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/register" />
    </div>
  );
}
