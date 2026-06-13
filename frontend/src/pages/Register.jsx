import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Briefcase, Users, ArrowRight, Loader, ArrowLeft } from 'lucide-react';
import { setRole } from '@/api/users';
import './Register.css';

export default function Register() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState('');
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already has a role, redirect
  if (isLoaded && user?.publicMetadata?.role) {
    const role = user.publicMetadata.role;
    navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/feed', { replace: true });
    return null;
  }

  // If not signed in at all, redirect to sign-up
  if (isLoaded && !user) {
    navigate('/sign-up', { replace: true });
    return null;
  }

  const handleNext = () => {
    if (!selected) return;
    setStep(2);
  };

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      
      let formattedData = { ...profileData };
      if (selected === 'candidate' && typeof formattedData.skills === 'string') {
        formattedData.skills = formattedData.skills.split(',').map(s => s.trim()).filter(Boolean);
      }

      await setRole(selected, token, formattedData);
      await user.reload();
      navigate(selected === 'recruiter' ? '/recruiter/dashboard' : '/candidate/feed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="register-page">
      <div className="register-card card" style={{ position: 'relative' }}>
        <button 
          onClick={() => step === 2 ? setStep(1) : navigate('/')} 
          className="btn btn-ghost btn-sm" 
          style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={14} style={{ marginRight: '0.25rem' }} /> {step === 2 ? 'Back' : 'Home'}
        </button>
        
        <div className="register-header" style={{ marginTop: '2rem' }}>
          <div className="register-logo">
            <Briefcase size={24} />
            <span>TalentBridge</span>
          </div>
          <h1>{step === 1 ? 'How will you use TalentBridge?' : 'Complete your profile'}</h1>
          <p>{step === 1 ? 'Choose your role to get the right experience.' : 'Tell us a bit about yourself to get started.'}</p>
        </div>

        {step === 1 && (
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
        )}

        {step === 2 && selected === 'candidate' && (
          <div className="profile-form">
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Bio / Headline</label>
              <input type="text" name="bio" placeholder="e.g. Full Stack Developer looking for remote work" value={profileData.bio || ''} onChange={handleChange} className="input" />
            </div>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Top Skills (comma separated)</label>
              <input type="text" name="skills" placeholder="e.g. React, Node.js, Python" value={profileData.skills || ''} onChange={handleChange} className="input" />
            </div>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Location</label>
              <input type="text" name="location" placeholder="e.g. San Francisco, CA" value={profileData.location || ''} onChange={handleChange} className="input" />
            </div>
          </div>
        )}

        {step === 2 && selected === 'recruiter' && (
          <div className="profile-form">
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Company Name</label>
              <input type="text" name="company" placeholder="e.g. Acme Corp" value={profileData.company || ''} onChange={handleChange} className="input" />
            </div>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Industry</label>
              <input type="text" name="industry" placeholder="e.g. Software, Finance, Healthcare" value={profileData.industry || ''} onChange={handleChange} className="input" />
            </div>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Company Website</label>
              <input type="url" name="companyWebsite" placeholder="https://..." value={profileData.companyWebsite || ''} onChange={handleChange} className="input" />
            </div>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <button
          className="btn btn-primary"
          disabled={!selected || loading}
          onClick={step === 1 ? handleNext : handleContinue}
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '1.5rem' }}
        >
          {loading ? <><span className="spinner" />Saving…</> : step === 1 ? <>Continue <ArrowRight size={16} /></> : <>Complete Setup <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}
