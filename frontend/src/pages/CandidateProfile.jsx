import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getProfile, updateProfile, updateResume } from '@/api/users';
import { User, Upload, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import './ProfilePage.css';

export default function CandidateProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setForm({ name: p.name, bio: p.bio, location: p.location, skills: p.skills || [], linkedin: p.linkedin, github: p.github, portfolio: p.portfolio });
    });
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !(form.skills || []).includes(s)) set('skills', [...(form.skills || []), s]);
    setSkillInput('');
  };
  const removeSkill = (s) => set('skills', (form.skills || []).filter((x) => x !== s));

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

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeLoading(true);
    try {
      const data = await updateResume(file);
      setProfile((p) => ({ ...p, resumeUrl: data.resumeUrl }));
      setSuccess('Resume uploaded!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
    setResumeLoading(false);
  };

  if (!profile) return <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}><div className="spinner spinner-lg" /></div>;

  return (
    <div className="page-content page-enter">
      <div className="page-title-row">
        <div><h1>My Profile</h1><p>Keep your profile up to date to improve your chances.</p></div>
      </div>

      <div className="profile-layout">
        {/* Avatar card */}
        <div className="profile-sidebar">
          <div className="profile-avatar-card card">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.fullName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-fallback"><User size={36} /></div>
            )}
            <h3 style={{ textAlign: 'center' }}>{profile.name || user?.fullName}</h3>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{profile.email}</p>
            <span className="badge badge-blue" style={{ alignSelf: 'center' }}>Candidate</span>
          </div>

          {/* Resume section */}
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h4 style={{ marginBottom: 'var(--space-3)' }}>Resume</h4>
            {profile.resumeUrl ? (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                View Resume
              </a>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No resume uploaded.</p>
            )}
            <label className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)', cursor: 'pointer' }}>
              {resumeLoading ? <><span className="spinner" />Uploading…</> : <><Upload size={14} />Upload New Resume</>}
              <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleResumeUpload} />
            </label>
          </div>
        </div>

        {/* Form */}
        <form className="profile-form card" onSubmit={handleSave}>
          <div className="form-section">
            <h2 className="form-section-title">Personal Information</h2>
            <div className="form-grid-2">
              <div className="input-group"><label className="input-label">Full Name</label><input className="input" value={form.name || ''} onChange={(e) => set('name', e.target.value)} /></div>
              <div className="input-group"><label className="input-label">Location</label><input className="input" value={form.location || ''} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" /></div>
            </div>
            <div className="input-group"><label className="input-label">Bio</label><textarea className="input" rows={3} value={form.bio || ''} onChange={(e) => set('bio', e.target.value)} placeholder="Tell recruiters about yourself…" /></div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Skills</h2>
            <div className="input-group">
              <div className="tag-input-row">
                <input className="input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill" />
                <button type="button" className="btn btn-secondary btn-icon" onClick={addSkill}><Plus size={16} /></button>
              </div>
              <div className="skills-tags">
                {(form.skills || []).map((s) => (
                  <span key={s} className="badge badge-blue skill-tag">{s}<button type="button" onClick={() => removeSkill(s)}><X size={11} /></button></span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Links</h2>
            <div className="form-grid-2">
              <div className="input-group"><label className="input-label">LinkedIn</label><input className="input" value={form.linkedin || ''} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" /></div>
              <div className="input-group"><label className="input-label">GitHub</label><input className="input" value={form.github || ''} onChange={(e) => set('github', e.target.value)} placeholder="https://github.com/…" /></div>
              <div className="input-group"><label className="input-label">Portfolio</label><input className="input" value={form.portfolio || ''} onChange={(e) => set('portfolio', e.target.value)} placeholder="https://yoursite.com" /></div>
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
