const express = require('express');
const router = express.Router();

/**
 * POST /api/webhook/ai
 * Stub endpoint for AI microservice callbacks
 */
router.post('/ai', (req, res) => {
  console.log('[AI Webhook] Received:', req.body);
  res.json({ received: true });
});

module.exports = router;
