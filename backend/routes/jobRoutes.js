const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { attachUser, requireRole } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/jobController');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listings management
 */

// Public
router.get('/', ctrl.listJobs);
router.get('/my', requireAuth(), attachUser, requireRole('recruiter'), ctrl.myJobs);
router.get('/:id', ctrl.getJob);

// Recruiter only
router.post('/', requireAuth(), attachUser, requireRole('recruiter'), ctrl.createJob);
router.put('/:id', requireAuth(), attachUser, requireRole('recruiter'), ctrl.updateJob);
router.delete('/:id', requireAuth(), attachUser, requireRole('recruiter'), ctrl.deleteJob);

module.exports = router;
