const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { attachUser, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/applicationController');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application management
 */

// Candidate routes
router.get('/my', requireAuth(), attachUser, requireRole('candidate'), ctrl.myApplications);
router.get('/check/:jobId', requireAuth(), attachUser, requireRole('candidate'), ctrl.checkApplication);
router.post('/', requireAuth(), attachUser, requireRole('candidate'), upload.single('resume'), ctrl.apply);
router.delete('/:id', requireAuth(), attachUser, requireRole('candidate'), ctrl.withdraw);

// Recruiter routes
router.get('/job/:jobId', requireAuth(), attachUser, requireRole('recruiter'), ctrl.jobApplications);
router.patch('/:id/status', requireAuth(), attachUser, requireRole('recruiter'), ctrl.updateStatus);

module.exports = router;
