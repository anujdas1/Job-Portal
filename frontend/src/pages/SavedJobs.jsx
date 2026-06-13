import { useEffect, useState } from 'react';
import { Bookmark, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { getSavedJobs, unsaveJob } from '@/api/savedJobs';
import ApplicationModal from '@/components/ApplicationModal';
import './SavedJobs.css';

export default function SavedJobs() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyJob, setApplyJob] = useState(null);

  const fetchSaved = async () => {
    try {
      const data = await getSavedJobs();
      setSaved(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchSaved(); }, []);

  const handleUnsave = async (jobId) => {
    await unsaveJob(jobId);
    setSaved((prev) => prev.filter((s) => s.job._id !== jobId));
  };

  if (loading) return <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}><div className="spinner spinner-lg" /></div>;

  return (
    <div className="page-content page-enter">
      <div className="page-title-row">
        <div>
          <h1>Saved Jobs</h1>
          <p>{saved.length} job{saved.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="empty-state">
          <Bookmark size={48} color="var(--gray-300)" />
          <h3>No saved jobs yet</h3>
          <p>Bookmark jobs from the feed to review them later.</p>
        </div>
      ) : (
        <div className="saved-list">
          {saved.map(({ job, createdAt }) => (
            <div key={job._id} className="saved-item card">
              <div className="saved-item-body">
                <div className="saved-item-info">
                  <h3 className="saved-item-title">{job.title}</h3>
                  <p className="saved-item-company">{job.company || job.recruiter?.company}</p>
                  <div className="saved-item-meta">
                    <span><MapPin size={12} /> {job.location}</span>
                    <span className={`badge ${job.status === 'open' ? 'badge-green' : 'badge-red'}`}>{job.status}</span>
                  </div>
                </div>
                <div className="saved-item-actions">
                  <span className="saved-date">Saved {new Date(createdAt).toLocaleDateString()}</span>
                  {job.status === 'open' && (
                    <button className="btn btn-primary btn-sm" onClick={() => setApplyJob(job)}>
                      Apply <ArrowRight size={13} />
                    </button>
                  )}
                  <button className="btn btn-ghost btn-icon" onClick={() => handleUnsave(job._id)} title="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {applyJob && <ApplicationModal job={applyJob} onClose={() => setApplyJob(null)} onSuccess={() => fetchSaved()} />}
    </div>
  );
}
