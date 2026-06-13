import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AuthPage.css';

export default function SignIn() {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/" className="auth-logo">
          <Briefcase size={28} />
          <span>TalentBridge</span>
        </Link>
        <h1 className="auth-headline">Welcome back</h1>
        <p className="auth-sub">Sign in to continue your job search.</p>
      </div>
      <ClerkSignIn routing="path" path="/sign-in" redirectUrl="/register" />
    </div>
  );
}
