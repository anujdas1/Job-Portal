import { useEffect, useState } from 'react';
import { FileText, MapPin, Trash2, ExternalLink } from 'lucide-react';
import { getMyApplications, withdrawApplication } from '@/api/applications';
import './MyApplications.css';

const STATUS_BADGE = {
  applied: 'badge-gray',
  reviewing: 'badge-blue',
  interview: 'badge-purple',
  offered: 'badge-green',
  rejected: 'badge-red',
};

const STATUS_LABEL = {
  applied: 'Applied',
  reviewing: 'Under Review',
  interview: 'Interview',
  offered: '🎉 Offered',
  rejected: 'Not Selected',
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  const fetch = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application? This cannot be undone.')) return;
    setWithdrawing(id);
    try {
      await withdrawApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (_) {}
    setWithdrawing(null);
  };

  if (loading) return <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}><div className="spinner spinner-lg" /></div>;

  return (
    <div className="page-content page-enter">
      <div className="page-title-row">
        <div>
          <h1>My Applications</h1>
          <p>{applications.length} application{applications.length !== 1 ? 's' : ''} sent</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} color="var(--gray-300)" />
          <h3>No applications yet</h3>
          <p>Start applying to jobs in the feed.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className={`app-item card${app.status === 'offered' ? ' offered' : ''}`}>
              <div className="app-item-inner">
                <div className="app-info">
                  <div className="app-status-dot" data-status={app.status} />
                  <div>
                    <h3 className="app-job-title">{app.job?.title}</h3>
                    <p className="app-company">{app.job?.company}</p>
                    <div className="app-meta">
                      <span><MapPin size={12} /> {app.job?.location}</span>
                      <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="app-actions">
                  <span className={`badge ${STATUS_BADGE[app.status]}`}>{STATUS_LABEL[app.status]}</span>
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon" title="View resume">
                      <ExternalLink size={15} />
                    </a>
                  )}
                  {app.status === 'applied' && (
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => handleWithdraw(app._id)}
                      disabled={withdrawing === app._id}
                      title="Withdraw"
                    >
                      {withdrawing === app._id ? <span className="spinner" /> : <Trash2 size={15} />}
                    </button>
                  )}
                </div>
              </div>
              {app.recruiterNotes && (
                <div className="app-notes">
                  <strong>Recruiter note:</strong> {app.recruiterNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
