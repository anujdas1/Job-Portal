// controllers/jobController.js
const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// GET /api/jobs - list with filters & pagination
exports.listJobs = async (req, res, next) => {
  try {
    const { location, tags, title, recruiterId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (location) filter.location = location;
    if (tags) filter.tags = { $all: tags.split(',') };
    if (title) filter.$text = { $search: title };
    if (recruiterId) filter.recruiterId = recruiterId;

    const jobs = await Job.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Job.countDocuments(filter);
    res.json({ success: true, data: jobs, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs/:id
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found', statusCode: 404 });
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// POST /api/jobs (recruiter only)
exports.createJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array(), statusCode: 400 });
  try {
    const job = new Job({ ...req.body, recruiterId: req.user.id });
    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// PUT /api/jobs/:id (recruiter only)
exports.updateJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array(), statusCode: 400 });
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ success: false, error: 'Job not found or not authorized', statusCode: 404 });
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/jobs/:id (recruiter only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiterId: req.user.id });
    if (!job) return res.status(404).json({ success: false, error: 'Job not found or not authorized', statusCode: 404 });
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};
