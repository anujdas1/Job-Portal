// routes/jobRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { verifyToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Public read routes
router.get('/', listJobs);
router.get('/:id', getJob);

// Recruiter‑only write routes
router.post(
  '/',
  verifyToken,
  requireRole('recruiter'),
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('location').notEmpty(),
    // optional salaryRange, tags can be validated as needed
  ],
  createJob
);
router.put(
  '/:id',
  verifyToken,
  requireRole('recruiter'),
  [
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('location').optional().notEmpty(),
  ],
  updateJob
);
router.delete('/:id', verifyToken, requireRole('recruiter'), deleteJob);

module.exports = router;
