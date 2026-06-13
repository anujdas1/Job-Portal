const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

/**
 * GET /api/jobs
 * Public - list open jobs with search & filter
 */
exports.listJobs = async (req, res, next) => {
  try {
    const {
      q,
      type,
      location,
      salaryMin,
      salaryMax,
      experienceLevel,
      skills,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { status: 'open' };

    if (q) filter.$text = { $search: q };
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (salaryMin) filter.salaryMax = { $gte: Number(salaryMin) };
    if (salaryMax) filter.salaryMin = { ...(filter.salaryMin || {}), $lte: Number(salaryMax) };
    if (skills) {
      const skillArr = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillArr };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('recruiter', 'name company companyLogo'),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs/:id
 * Public - single job detail
 */
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company companyLogo avatar');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/jobs
 * Recruiter - create a job
 */
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, recruiter: req.dbUser._id });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/jobs/:id
 * Recruiter - update own job
 */
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.dbUser._id });
    if (!job) return res.status(404).json({ error: 'Job not found or not authorized' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/jobs/:id
 * Recruiter - delete own job
 */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.dbUser._id });
    if (!job) return res.status(404).json({ error: 'Job not found or not authorized' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs/my
 * Recruiter - list own posted jobs
 */
exports.myJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.dbUser._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};
