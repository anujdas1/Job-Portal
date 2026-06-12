// routes/aiWebhookRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { handleScoreUpdate } = require('../controllers/aiWebhookController');
const { verifyToken } = require('../middlewares/auth'); // optional auth if you want

const router = express.Router();

// POST /api/webhook/ai-score – receives AI score updates
router.post(
  '/ai-score',
  // Uncomment verifyToken if the webhook should be protected
  // verifyToken,
  [
    body('applicationId').notEmpty(),
    body('aiMatchScore').optional().isFloat({ min: 0, max: 100 }),
    body('adaptiveInterviewLink').optional().isString(),
  ],
  handleScoreUpdate
);

module.exports = router;
