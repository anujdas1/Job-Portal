const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { attachUser } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/notificationController');

router.use(requireAuth(), attachUser);

router.get('/', ctrl.listNotifications);
router.patch('/mark-all-read', ctrl.markAllRead);
router.patch('/:id/read', ctrl.markRead);
router.delete('/:id', ctrl.deleteNotification);

module.exports = router;
