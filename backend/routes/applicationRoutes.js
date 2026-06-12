// routes/applicationRoutes.js
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  listApplications,
  createApplication,
  updateStatus,
} = require('../controllers/applicationController');
const { verifyToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Multer config – store PDFs locally in uploads/resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '..', 'uploads', 'resumes');
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => cb(null, file.mimetype === 'application/pdf'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB default
});

// Public list – any authenticated user can view applications
router.get('/', verifyToken, listApplications);

// Candidate creates an application (resume upload)
router.post(
  '/',
  verifyToken,
  requireRole('candidate'),
  upload.single('resume'),
  [body('jobId').notEmpty()],
  createApplication
);

// Recruiter updates application status
router.patch(
  '/:id/status',
  verifyToken,
  requireRole('recruiter'),
  [body('status').notEmpty()],
  updateStatus
);

module.exports = router;
