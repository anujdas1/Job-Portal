const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

/**
 * POST /api/applications
 * Candidate - apply to a job
 */
exports.apply = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : req.body.resumeUrl;

    if (!resumeUrl) return res.status(400).json({ error: 'Resume is required' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'open') return res.status(400).json({ error: 'Job is no longer accepting applications' });

    const application = await Application.create({
      job: jobId,
      candidate: req.dbUser._id,
      resumeUrl,
      coverLetter: coverLetter || '',
    });

    // Increment applicant count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    // Notify recruiter
    await Notification.create({
      user: job.recruiter,
      type: 'application_received',
      title: 'New Application',
      message: `${req.dbUser.name || 'A candidate'} applied to "${job.title}"`,
      meta: { jobId: job._id, applicationId: application._id },
    });

    const populated = await application.populate([
      { path: 'job', select: 'title company location type' },
      { path: 'candidate', select: 'name email avatar' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/my
 * Candidate - get own applications
 */
exports.myApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.dbUser._id })
      .populate('job', 'title company location type salaryMin salaryMax companyLogo')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/job/:jobId
 * Recruiter - get all applications for a job (kanban)
 */
exports.jobApplications = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.dbUser._id });
    if (!job) return res.status(404).json({ error: 'Job not found or not authorized' });

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email avatar skills resumeUrl bio')
      .sort({ kanbanOrder: 1 });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/applications/:id/status
 * Recruiter - update application status (kanban move)
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, recruiterNotes } = req.body;

    const application = await Application.findById(req.params.id).populate('job candidate');
    if (!application) return res.status(404).json({ error: 'Application not found' });

    // Ensure recruiter owns the job
    if (String(application.job.recruiter) !== String(req.dbUser._id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const oldStatus = application.status;
    application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;
    await application.save();

    // Notify candidate of status change
    if (oldStatus !== status) {
      const statusLabels = {
        reviewing: 'Your application is being reviewed',
        interview: 'You have been selected for an interview!',
        offered: 'Congratulations! You have received an offer!',
        rejected: 'Your application was not selected this time',
      };
      if (statusLabels[status]) {
        await Notification.create({
          user: application.candidate._id,
          type: 'status_changed',
          title: 'Application Update',
          message: `${statusLabels[status]} — ${application.job.title} at ${application.job.company}`,
          meta: { jobId: application.job._id, applicationId: application._id },
        });
      }
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/applications/:id
 * Candidate - withdraw application
 */
exports.withdraw = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      candidate: req.dbUser._id,
    });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    await Job.findByIdAndUpdate(application.job, { $inc: { applicantCount: -1 } });
    res.json({ message: 'Application withdrawn' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/check/:jobId
 * Candidate - check if already applied
 */
exports.checkApplication = async (req, res, next) => {
  try {
    const existing = await Application.findOne({
      job: req.params.jobId,
      candidate: req.dbUser._id,
    });
    res.json({ applied: !!existing, application: existing });
  } catch (err) {
    next(err);
  }
};
