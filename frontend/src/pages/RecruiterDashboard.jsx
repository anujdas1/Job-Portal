import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Users, BarChart2, Eye, Pencil, Trash2, Kanban, CheckCircle, XCircle } from 'lucide-react';
import { getMyJobs, deleteJob, updateJob } from '@/api/jobs';
import './RecruiterDashboard.css';

const STATUS_BADGE = { open: 'badge-green', closed: 'badge-red', draft: 'badge-gray' };

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchJobs = async () => {
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting? This will also remove all applications.')) return;
    setDeleting(id);
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (_) {}
    setDeleting(null);
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      const updated = await updateJob(job._id, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? updated : j)));
    } catch (_) {}
  };

  const totalApplicants = jobs.reduce((s, j) => s + (j.applicantCount || 0), 0);
  const openJobs = jobs.filter((j) => j.status === 'open').length;

  if (loading) return <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}><div className="spinner spinner-lg" /></div>;

  return (
    <div className="page-content page-enter">
      <div className="dashboard-header">
        <div>
          <h1>Recruiter Dashboard</h1>
          <p>Manage your job postings and review applicants</p>
        </div>
        <Link to="/recruiter/post" className="btn btn-primary">
          <Plus size={16} /> Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card card">
          <div className="stat-card-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><Briefcase size={20} /></div>
          <div><p className="stat-card-label">Total Postings</p><p className="stat-card-value">{jobs.length}</p></div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-icon" style={{ background: '#ecfdf5', color: '#059669' }}><CheckCircle size={20} /></div>
          <div><p className="stat-card-label">Open Jobs</p><p className="stat-card-value">{openJobs}</p></div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}><Users size={20} /></div>
          <div><p className="stat-card-label">Total Applicants</p><p className="stat-card-value">{totalApplicants}</p></div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-icon" style={{ background: '#fff7ed', color: '#c2410c' }}><BarChart2 size={20} /></div>
          <div><p className="stat-card-label">Avg. per Job</p><p className="stat-card-value">{jobs.length ? Math.round(totalApplicants / jobs.length) : 0}</p></div>
        </div>
      </div>

      {/* Job listings table */}
      <div className="dashboard-section">
        <h2 className="section-title">Your Job Postings</h2>
        {jobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} color="var(--gray-300)" />
            <h3>No jobs posted yet</h3>
            <p>Create your first job listing to start receiving applications.</p>
            <Link to="/recruiter/post" className="btn btn-primary"><Plus size={16} /> Post a Job</Link>
          </div>
        ) : (
          <div className="jobs-table-wrap card">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <p className="table-job-title">{job.title}</p>
                      <p className="table-job-location">{job.location}</p>
                    </td>
                    <td><span className="badge badge-blue">{job.type?.replace('-', ' ')}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} color="var(--text-muted)" />
                        <strong>{job.applicantCount || 0}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[job.status]}`}>{job.status}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/recruiter/kanban/${job._id}`} className="btn btn-ghost btn-icon" title="Kanban">
                          <Kanban size={15} />
                        </Link>
                        <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn btn-ghost btn-icon" title="Edit">
                          <Pencil size={15} />
                        </Link>
                        <button className="btn btn-ghost btn-icon" onClick={() => toggleStatus(job)} title={job.status === 'open' ? 'Close job' : 'Reopen job'}>
                          {job.status === 'open' ? <XCircle size={15} color="var(--danger)" /> : <CheckCircle size={15} color="var(--success)" />}
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(job._id)} disabled={deleting === job._id} title="Delete">
                          {deleting === job._id ? <span className="spinner" /> : <Trash2 size={15} color="var(--danger)" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
