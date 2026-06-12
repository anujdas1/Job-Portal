// routes/savedJobRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  listSavedJobs,
  addSavedJob,
  removeSavedJob,
} = require('../controllers/savedJobController');
const { verifyToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

// List saved jobs – any authenticated user (returns only their own)
router.get('/', verifyToken, listSavedJobs);

// Candidate adds a saved job
router.post(
  '/',
  verifyToken,
  requireRole('candidate'),
  [body('jobId').notEmpty()],
  addSavedJob
);

// Candidate removes a saved job
router.delete('/:id', verifyToken, requireRole('candidate'), removeSavedJob);

module.exports = router;
