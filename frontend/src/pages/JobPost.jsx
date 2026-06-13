import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '@/api/jobs';
import { AlertCircle, Plus, X } from 'lucide-react';
import './JobForm.css';

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship'];
const EXP_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];

const EMPTY_FORM = {
  title: '', company: '', location: '', type: 'full-time',
  experienceLevel: 'mid', description: '', requirements: [],
  skills: [], salaryMin: '', salaryMax: '', deadline: '',
};

export default function JobPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) set('skills', [...form.skills, s]);
    setSkillInput('');
  };
  const removeSkill = (s) => set('skills', form.skills.filter((x) => x !== s));

  const addReq = () => {
    const r = reqInput.trim();
    if (r) set('requirements', [...form.requirements, r]);
    setReqInput('');
  };
  const removeReq = (i) => set('requirements', form.requirements.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true); setError('');
    try {
      await createJob({ ...form, salaryMin: Number(form.salaryMin) || 0, salaryMax: Number(form.salaryMax) || 0 });
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content page-enter">
      <div className="page-title-row">
        <div>
          <h1>Post a Job</h1>
          <p>Fill in the details to attract the right candidates.</p>
        </div>
      </div>

      <form className="job-form card" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="form-section-title">Basic Information</h2>
          <div className="form-grid-2">
            <div className="input-group">
              <label className="input-label">Job Title *</label>
              <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Senior React Developer" required />
            </div>
            <div className="input-group">
              <label className="input-label">Company *</label>
              <input className="input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="e.g. Acme Corp" required />
            </div>
            <div className="input-group">
              <label className="input-label">Location *</label>
              <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. New York, NY or Remote" required />
            </div>
            <div className="input-group">
              <label className="input-label">Job Type</label>
              <select className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('-', ' ')}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Experience Level</label>
              <select className="input" value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}>
                {EXP_LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Application Deadline</label>
              <input className="input" type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Compensation</h2>
          <div className="form-grid-2">
            <div className="input-group">
              <label className="input-label">Min Salary (USD / year)</label>
              <input className="input" type="number" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} placeholder="e.g. 80000" />
            </div>
            <div className="input-group">
              <label className="input-label">Max Salary (USD / year)</label>
              <input className="input" type="number" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} placeholder="e.g. 130000" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Description & Requirements</h2>
          <div className="input-group">
            <label className="input-label">Job Description *</label>
            <textarea className="input" rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the role, responsibilities, and ideal candidate…" required />
          </div>
          <div className="input-group">
            <label className="input-label">Requirements</label>
            <div className="tag-input-row">
              <input className="input" value={reqInput} onChange={(e) => setReqInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addReq())} placeholder="Add a requirement and press Enter" />
              <button type="button" className="btn btn-secondary btn-icon" onClick={addReq}><Plus size={16} /></button>
            </div>
            {form.requirements.length > 0 && (
              <ul className="req-list">
                {form.requirements.map((r, i) => (
                  <li key={i} className="req-item">
                    <span>{r}</span>
                    <button type="button" className="btn btn-ghost btn-icon" onClick={() => removeReq(i)}><X size={12} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Skills</h2>
          <div className="input-group">
            <label className="input-label">Required Skills</label>
            <div className="tag-input-row">
              <input className="input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="e.g. React, Node.js — press Enter to add" />
              <button type="button" className="btn btn-secondary btn-icon" onClick={addSkill}><Plus size={16} /></button>
            </div>
            {form.skills.length > 0 && (
              <div className="skills-tags">
                {form.skills.map((s) => (
                  <span key={s} className="badge badge-blue skill-tag">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && <div className="alert alert-error"><AlertCircle size={16} />{error}</div>}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/recruiter/dashboard')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" />Posting…</> : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
