const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { attachUser } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/userController');

// All routes require auth
router.use(requireAuth(), attachUser);

router.get('/me', ctrl.getProfile);
router.put('/me', ctrl.updateProfile);
router.put('/me/resume', upload.single('resume'), ctrl.updateResume);
router.post('/set-role', ctrl.setRole);
router.get('/:id', ctrl.getPublicProfile);

module.exports = router;
