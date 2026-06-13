import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJob } from '@/api/jobs';
import { getJobApplications, updateApplicationStatus } from '@/api/applications';
import { ArrowLeft, ExternalLink, ChevronDown, User, Loader } from 'lucide-react';
import './KanbanBoard.css';

const STAGES = [
  { id: 'applied',   label: 'Applied',        color: '#6b7280' },
  { id: 'reviewing', label: 'Reviewing',       color: '#0ea5e9' },
  { id: 'interview', label: 'Interview',       color: '#6366f1' },
  { id: 'offered',   label: 'Offered',         color: '#10b981' },
  { id: 'rejected',  label: 'Rejected',        color: '#ef4444' },
];

function ApplicantCard({ app, onMove, moving }) {
  const [showNotes, setShowNotes] = useState(false);
  const [note, setNote] = useState(app.recruiterNotes || '');

  const handleMove = (newStage) => {
    onMove(app._id, newStage, note);
  };

  const otherStages = STAGES.filter((s) => s.id !== app.status);

  return (
    <div className="kanban-card card">
      <div className="kanban-card-header">
        {app.candidate?.avatar ? (
          <img src={app.candidate.avatar} alt={app.candidate.name} className="kanban-avatar" />
        ) : (
          <div className="kanban-avatar kanban-avatar-fallback">
            <User size={16} />
          </div>
        )}
        <div className="kanban-card-info">
          <p className="kanban-name">{app.candidate?.name || 'Candidate'}</p>
          <p className="kanban-email">{app.candidate?.email}</p>
        </div>
        {moving === app._id && <span className="spinner" />}
      </div>

      {/* Skills */}
      {app.candidate?.skills?.length > 0 && (
        <div className="kanban-skills">
          {app.candidate.skills.slice(0, 3).map((s) => (
            <span key={s} className="badge badge-gray">{s}</span>
          ))}
          {app.candidate.skills.length > 3 && <span className="badge badge-gray">+{app.candidate.skills.length - 3}</span>}
        </div>
      )}

      <div className="kanban-card-meta">
        <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
        {app.resumeUrl && (
          <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="kanban-resume-link">
            <ExternalLink size={12} /> Resume
          </a>
        )}
      </div>

      {/* Recruiter notes */}
      <div className="kanban-notes">
        <textarea
          className="input kanban-notes-input"
          placeholder="Add a note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
      </div>

      {/* Move dropdown */}
      <div className="kanban-move">
        <span className="kanban-move-label">Move to:</span>
        {otherStages.map((stage) => (
          <button
            key={stage.id}
            className="kanban-move-btn"
            style={{ '--stage-color': stage.color }}
            onClick={() => handleMove(stage.id)}
            disabled={moving === app._id}
          >
            {stage.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState(null);

  useEffect(() => {
    Promise.all([getJob(jobId), getJobApplications(jobId)])
      .then(([j, apps]) => { setJob(j); setApplications(apps); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleMove = async (appId, newStatus, recruiterNotes) => {
    setMoving(appId);
    try {
      const updated = await updateApplicationStatus(appId, { status: newStatus, recruiterNotes });
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status: newStatus, recruiterNotes } : a)));
    } catch (_) {}
    setMoving(null);
  };

  const columns = STAGES.map((stage) => ({
    ...stage,
    cards: applications.filter((a) => a.status === stage.id),
  }));

  if (loading) return <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}><div className="spinner spinner-lg" /></div>;

  return (
    <div className="kanban-page">
      {/* Header */}
      <div className="kanban-header">
        <Link to="/recruiter/dashboard" className="btn btn-ghost btn-sm">
          <ArrowLeft size={15} /> Dashboard
        </Link>
        <div>
          <h1 className="kanban-title">{job?.title}</h1>
          <p className="kanban-subtitle">{job?.company} · {job?.location} · {applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Board */}
      <div className="kanban-board">
        {columns.map((col) => (
          <div key={col.id} className="kanban-column">
            <div className="kanban-col-header" style={{ '--col-color': col.color }}>
              <div className="kanban-col-dot" />
              <span className="kanban-col-label">{col.label}</span>
              <span className="kanban-col-count">{col.cards.length}</span>
            </div>
            <div className="kanban-col-body">
              {col.cards.length === 0 ? (
                <div className="kanban-empty">No applicants</div>
              ) : (
                col.cards.map((app) => (
                  <ApplicantCard key={app._id} app={app} onMove={handleMove} moving={moving} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
