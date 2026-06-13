import { useState } from 'react';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, ArrowRight, Building2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { saveJob, unsaveJob } from '@/api/savedJobs';
import useApplicationStore from '@/store/useApplicationStore';
import './JobCard.css';

const TYPE_BADGE = {
  'full-time': 'badge-blue',
  'part-time': 'badge-yellow',
  remote: 'badge-green',
  contract: 'badge-purple',
  internship: 'badge-cyan',
};

const LEVEL_BADGE = {
  entry: 'badge-green',
  mid: 'badge-blue',
  senior: 'badge-purple',
  lead: 'badge-yellow',
  executive: 'badge-red',
};

function formatSalary(min, max, currency = 'USD') {
  if (!min && !max) return null;
  const fmt = (v) => v >= 1000 ? `${Math.round(v / 1000)}k` : v;
  if (min && max) return `${currency} ${fmt(min)} – ${fmt(max)}`;
  if (min) return `${currency} ${fmt(min)}+`;
  return `up to ${currency} ${fmt(max)}`;
}

export default function JobCard({ job, onApply }) {
  const { user } = useUser();
  const { savedJobIds, addSaved, removeSaved } = useApplicationStore();
  const isSaved = savedJobIds.has(job._id);
  const [saving, setSaving] = useState(false);

  const isCandidate = user?.publicMetadata?.role === 'candidate';

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!isCandidate || saving) return;
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(job._id);
        removeSaved(job._id);
      } else {
        await saveJob(job._id);
        addSaved(job._id);
      }
    } catch (_) {}
    setSaving(false);
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <article className="job-card card">
      {/* Header */}
      <div className="job-card-header">
        <div className="job-card-logo">
          {job.companyLogo || job.recruiter?.companyLogo ? (
            <img src={job.companyLogo || job.recruiter?.companyLogo} alt={job.company} />
          ) : (
            <Building2 size={22} color="var(--gray-400)" />
          )}
        </div>
        <div className="job-card-meta">
          <h3 className="job-card-title">{job.title}</h3>
          <p className="job-card-company">{job.company || job.recruiter?.company}</p>
        </div>
        {isCandidate && (
          <button
            className={`job-card-save btn btn-ghost btn-icon${isSaved ? ' saved' : ''}`}
            onClick={handleSave}
            disabled={saving}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="job-card-tags">
        <span className={`badge ${TYPE_BADGE[job.type] || 'badge-gray'}`}>
          {job.type?.replace('-', ' ')}
        </span>
        {job.experienceLevel && (
          <span className={`badge ${LEVEL_BADGE[job.experienceLevel] || 'badge-gray'}`}>
            {job.experienceLevel}
          </span>
        )}
        {job.status === 'closed' && <span className="badge badge-red">Closed</span>}
      </div>

      {/* Info row */}
      <div className="job-card-info">
        <span className="job-card-info-item">
          <MapPin size={13} />
          {job.location}
        </span>
        {salary && (
          <span className="job-card-info-item">
            <DollarSign size={13} />
            {salary}
          </span>
        )}
        {job.deadline && (
          <span className="job-card-info-item">
            <Clock size={13} />
            Closes {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="job-card-skills">
          {job.skills.slice(0, 4).map((s) => (
            <span key={s} className="badge badge-gray">{s}</span>
          ))}
          {job.skills.length > 4 && (
            <span className="badge badge-gray">+{job.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="job-card-footer">
        <span className="job-card-date">
          {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        {isCandidate && job.status === 'open' && (
          <button className="btn btn-primary btn-sm" onClick={() => onApply?.(job)}>
            Apply <ArrowRight size={13} />
          </button>
        )}
      </div>
    </article>
  );
}
