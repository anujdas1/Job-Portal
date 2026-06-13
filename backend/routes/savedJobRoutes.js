const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { attachUser, requireRole } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/savedJobController');

router.use(requireAuth(), attachUser, requireRole('candidate'));

router.get('/', ctrl.listSavedJobs);
router.get('/ids', ctrl.savedJobIds);
router.post('/:jobId', ctrl.saveJob);
router.delete('/:jobId', ctrl.unsaveJob);

module.exports = router;
