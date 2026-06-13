import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getProfile, updateProfile } from '@/api/users';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './ProfilePage.css';

export default function RecruiterProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setForm({ name: p.name, company: p.company, companyWebsite: p.companyWebsite, companySize: p.companySize, industry: p.industry, location: p.location });
    });
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await updateProfile(form);
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  if (!profile) return <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}><div className="spinner spinner-lg" /></div>;

  return (
    <div className="page-content page-enter">
      <div className="page-title-row">
        <div><h1>Recruiter Profile</h1><p>Update your company information.</p></div>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-avatar-card card">
            <img src={user?.imageUrl} alt={user?.fullName} className="profile-avatar" />
            <h3 style={{ textAlign: 'center' }}>{profile.name}</h3>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{profile.email}</p>
            <span className="badge badge-purple" style={{ alignSelf: 'center' }}>Recruiter</span>
            {profile.company && <p style={{ textAlign: 'center', fontWeight: 600, color: 'var(--primary)' }}>{profile.company}</p>}
          </div>
        </div>

        <form className="profile-form card" onSubmit={handleSave}>
          <div className="form-section">
            <h2 className="form-section-title">Personal Information</h2>
            <div className="form-grid-2">
              <div className="input-group"><label className="input-label">Full Name</label><input className="input" value={form.name || ''} onChange={(e) => set('name', e.target.value)} /></div>
              <div className="input-group"><label className="input-label">Location</label><input className="input" value={form.location || ''} onChange={(e) => set('location', e.target.value)} /></div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Company Information</h2>
            <div className="form-grid-2">
              <div className="input-group"><label className="input-label">Company Name</label><input className="input" value={form.company || ''} onChange={(e) => set('company', e.target.value)} /></div>
              <div className="input-group"><label className="input-label">Industry</label><input className="input" value={form.industry || ''} onChange={(e) => set('industry', e.target.value)} placeholder="e.g. Technology, Finance" /></div>
              <div className="input-group"><label className="input-label">Company Size</label><select className="input" value={form.companySize || ''} onChange={(e) => set('companySize', e.target.value)}><option value="">Select…</option><option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>500+</option></select></div>
              <div className="input-group"><label className="input-label">Website</label><input className="input" value={form.companyWebsite || ''} onChange={(e) => set('companyWebsite', e.target.value)} placeholder="https://yourcompany.com" /></div>
            </div>
          </div>

          {success && <div className="alert alert-success" style={{ margin: '0 var(--space-8)' }}><CheckCircle size={16} />{success}</div>}
          {error && <div className="alert alert-error" style={{ margin: '0 var(--space-8)' }}><AlertCircle size={16} />{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <><span className="spinner" />Saving…</> : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
