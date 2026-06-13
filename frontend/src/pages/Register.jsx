import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Briefcase, Users, ArrowRight, Loader } from 'lucide-react';
import { setRole } from '@/api/users';
import './Register.css';

export default function Register() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already has a role, redirect
  if (isLoaded && user?.publicMetadata?.role) {
    const role = user.publicMetadata.role;
    navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/feed', { replace: true });
    return null;
  }

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await setRole(selected);
      // Reload Clerk session so publicMetadata updates
      await user.reload();
      navigate(selected === 'recruiter' ? '/recruiter/dashboard' : '/candidate/feed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card card">
        <div className="register-header">
          <div className="register-logo">
            <Briefcase size={24} />
            <span>TalentBridge</span>
          </div>
          <h1>How will you use TalentBridge?</h1>
          <p>Choose your role to get the right experience.</p>
        </div>

        <div className="role-options">
          <button
            className={`role-option${selected === 'candidate' ? ' selected' : ''}`}
            onClick={() => setSelected('candidate')}
          >
            <div className="role-icon role-icon-blue">
              <Users size={28} />
            </div>
            <div>
              <h3>Job Seeker</h3>
              <p>Browse jobs, apply, and track your applications</p>
            </div>
          </button>

          <button
            className={`role-option${selected === 'recruiter' ? ' selected' : ''}`}
            onClick={() => setSelected('recruiter')}
          >
            <div className="role-icon role-icon-purple">
              <Briefcase size={28} />
            </div>
            <div>
              <h3>Recruiter</h3>
              <p>Post jobs, review applications, manage hiring</p>
            </div>
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button
          className="btn btn-primary"
          disabled={!selected || loading}
          onClick={handleContinue}
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
        >
          {loading ? <><span className="spinner" />Setting up…</> : <>Continue as {selected || '…'} <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}
