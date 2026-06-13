const SavedJob = require('../models/SavedJob');

/**
 * POST /api/saved-jobs/:jobId
 * Candidate - save a job
 */
exports.saveJob = async (req, res, next) => {
  try {
    const saved = await SavedJob.create({
      candidate: req.dbUser._id,
      job: req.params.jobId,
    });
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Already saved' });
    next(err);
  }
};

/**
 * DELETE /api/saved-jobs/:jobId
 * Candidate - unsave a job
 */
exports.unsaveJob = async (req, res, next) => {
  try {
    await SavedJob.findOneAndDelete({ candidate: req.dbUser._id, job: req.params.jobId });
    res.json({ message: 'Removed from saved' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/saved-jobs
 * Candidate - list saved jobs
 */
exports.listSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ candidate: req.dbUser._id })
      .populate({ path: 'job', populate: { path: 'recruiter', select: 'name company companyLogo' } })
      .sort({ createdAt: -1 });
    res.json(saved);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/saved-jobs/ids
 * Candidate - list saved job IDs (for quick lookup in feed)
 */
exports.savedJobIds = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ candidate: req.dbUser._id }).select('job');
    res.json(saved.map((s) => String(s.job)));
  } catch (err) {
    next(err);
  }
};
