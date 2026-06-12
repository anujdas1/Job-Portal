// controllers/applicationController.js
const Application = require('../models/Application');
const { validationResult } = require('express-validator');
const path = require('path');

// GET /api/applications - list with optional filters & pagination
exports.listApplications = async (req, res, next) => {
  try {
    const { jobId, status, candidateId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;
    if (candidateId) filter.candidateId = candidateId;

    const apps = await Application.find(filter)
      .populate('jobId', 'title')
      .populate('candidateId', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Application.countDocuments(filter);
    res.json({ success: true, data: apps, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    next(err);
  }
};

// POST /api/applications - candidate creates an application with resume upload
exports.createApplication = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array(), statusCode: 400 });
  try {
    const { jobId } = req.body;
    const resumeUrl = req.file ? `/uploads/resumes/${path.basename(req.file.path)}` : undefined;
    const application = new Application({
      jobId,
      candidateId: req.user.id,
      resumeUrl,
    });
    await application.save();

    // Fire-and-forget: Call AI microservice to process the resume
    // We do this asynchronously so we don't block the API response.
    // The AI service will call our webhook when it finishes.
    if (req.file) {
      const FormData = require('form-data');
      const fs = require('fs');
      const axios = require('axios');
      
      const form = new FormData();
      form.append('applicationId', application._id.toString());
      form.append('file', fs.createReadStream(req.file.path));

      axios.post('http://localhost:8000/process-resume', form, {
        headers: form.getHeaders(),
      }).catch(err => {
        console.error('Failed to trigger AI microservice:', err.message);
      });
    }

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/applications/:id/status - recruiter updates status
exports.updateStatus = async (req, res, next) => {
  const { status } = req.body;
  const valid = ['Applied', 'Interviewing', 'Rejected', 'Offer'];
  if (!valid.includes(status)) return res.status(400).json({ success: false, error: 'Invalid status', statusCode: 400 });

  try {
    const app = await Application.findById(req.params.id).populate('jobId');
    if (!app) return res.status(404).json({ success: false, error: 'Application not found', statusCode: 404 });
    // Ensure the recruiter owns the job linked to the application
    if (app.jobId.recruiterId.toString() !== req.user.id)
      return res.status(403).json({ success: false, error: 'Not authorized', statusCode: 403 });

    app.status = status;
    await app.save();
    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
};
