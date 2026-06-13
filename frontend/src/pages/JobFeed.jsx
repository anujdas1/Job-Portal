import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import useJobStore from '@/store/useJobStore';
import useApplicationStore from '@/store/useApplicationStore';
import { useUser } from '@clerk/clerk-react';
import JobCard from '@/components/JobCard';
import ApplicationModal from '@/components/ApplicationModal';
import './JobFeed.css';

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship'];
const EXP_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];

export default function JobFeed() {
  const { jobs, total, page, pages, loading, filters, fetchJobs, setFilter, resetFilters, setPage } = useJobStore();
  const { fetchSavedIds } = useApplicationStore();
  const { user } = useUser();
  const [applyJob, setApplyJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchSavedIds();
  }, [filters, page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchJobs(); };
  const handleApplySuccess = () => { setAppliedSuccess(true); setTimeout(() => setAppliedSuccess(false), 4000); };

  return (
    <div className="page-content page-enter">
      {/* Page header */}
      <div className="feed-header">
        <div>
          <h1>Find Your Next Role</h1>
          <p>{total} open positions available</p>
        </div>
      </div>

      {/* Search bar */}
      <form className="feed-search" onSubmit={handleSearch}>
        <div className="input-with-icon" style={{ flex: 1 }}>
          <Search size={16} className="input-icon" />
          <input
            className="input"
            placeholder="Search jobs, skills, companies…"
            value={filters.q}
            onChange={(e) => setFilter('q', e.target.value)}
          />
        </div>
        <div className="input-with-icon" style={{ width: 220 }}>
          <Search size={16} className="input-icon" style={{ opacity: 0 }} />
          <input
            className="input"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilter('location', e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-secondary btn-icon" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={16} />
        </button>
      </form>

      {/* Filters panel */}
      {showFilters && (
        <div className="feed-filters card">
          <div className="feed-filters-inner">
            <div className="input-group">
              <label className="input-label">Job Type</label>
              <div className="filter-chips">
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`filter-chip${filters.type === t ? ' active' : ''}`}
                    onClick={() => setFilter('type', filters.type === t ? '' : t)}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Experience Level</label>
              <div className="filter-chips">
                {EXP_LEVELS.map((l) => (
                  <button
                    key={l}
                    className={`filter-chip${filters.experienceLevel === l ? ' active' : ''}`}
                    onClick={() => setFilter('experienceLevel', filters.experienceLevel === l ? '' : l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-row">
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Min Salary (USD)</label>
                <input className="input" type="number" placeholder="e.g. 60000" value={filters.salaryMin} onChange={(e) => setFilter('salaryMin', e.target.value)} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Max Salary (USD)</label>
                <input className="input" type="number" placeholder="e.g. 150000" value={filters.salaryMax} onChange={(e) => setFilter('salaryMax', e.target.value)} />
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => { resetFilters(); }}>
              <X size={14} /> Reset filters
            </button>
          </div>
        </div>
      )}

      {/* Success banner */}
      {appliedSuccess && (
        <div className="alert alert-success">✅ Application submitted successfully! Good luck!</div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="feed-loading">
          <div className="spinner spinner-lg" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <Search size={48} color="var(--gray-300)" />
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters.</p>
          <button className="btn btn-secondary" onClick={resetFilters}>Clear filters</button>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onApply={setApplyJob} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="pagination-info">Page {page} of {pages}</span>
          <button className="btn btn-secondary btn-sm" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {/* Apply modal */}
      {applyJob && (
        <ApplicationModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
}
