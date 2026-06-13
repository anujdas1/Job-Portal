import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { applyToJob } from '@/api/applications';
import './ApplicationModal.css';

export default function ApplicationModal({ job, onClose, onSuccess }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) setResumeFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) { setError('Please upload your resume'); return; }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('jobId', job._id);
      fd.append('resume', resumeFile);
      fd.append('coverLetter', coverLetter);
      await applyToJob(fd);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Apply to {job.title}</h2>
            <p className="modal-subtitle">{job.company || job.recruiter?.company} · {job.location}</p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Resume upload */}
          <div className="input-group">
            <label className="input-label">Resume *</label>
            <div {...getRootProps()} className={`dropzone${isDragActive ? ' active' : ''}${resumeFile ? ' has-file' : ''}`}>
              <input {...getInputProps()} />
              {resumeFile ? (
                <div className="dropzone-file">
                  <FileText size={20} color="var(--primary)" />
                  <span>{resumeFile.name}</span>
                  <button type="button" className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="dropzone-empty">
                  <Upload size={24} color="var(--gray-400)" />
                  <p><strong>Drop your resume here</strong> or click to browse</p>
                  <span>PDF, DOC, DOCX · Max 5 MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover letter */}
          <div className="input-group">
            <label className="input-label" htmlFor="coverLetter">Cover Letter <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              id="coverLetter"
              className="input"
              placeholder="Tell the recruiter why you're a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" />Submitting…</> : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
