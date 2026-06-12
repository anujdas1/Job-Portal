// controllers/savedJobController.js
const SavedJob = require('../models/SavedJob');

// GET /api/saved-jobs?userId=... – list saved jobs for a user (must match token)
exports.listSavedJobs = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;
    if (userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized', statusCode: 403 });
    }
    const saved = await SavedJob.find({ userId }).populate('jobId', 'title location');
    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
};

// POST /api/saved-jobs – add a saved job (candidate only)
exports.addSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const saved = new SavedJob({ userId: req.user.id, jobId });
    await saved.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/saved-jobs/:id – remove a saved job (must belong to user)
exports.removeSavedJob = async (req, res, next) => {
  try {
    const saved = await SavedJob.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!saved) return res.status(404).json({ success: false, error: 'Saved job not found', statusCode: 404 });
    res.json({ success: true, message: 'Removed saved job' });
  } catch (err) {
    next(err);
  }
};
