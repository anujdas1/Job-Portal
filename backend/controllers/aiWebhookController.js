// controllers/aiWebhookController.js
const Application = require('../models/Application');

/**
 * POST /api/webhook/ai-score
 * Expected payload:
 *   {
 *     applicationId: String,
 *     aiMatchScore: Number (0-100),
 *     adaptiveInterviewLink: String (optional)
 *   }
 *
 * This endpoint is called by the AI microservice when it has processed a resume
 * and wants to store the resulting match score (and optionally a generated interview link).
 */
exports.handleScoreUpdate = async (req, res, next) => {
  const { applicationId, aiMatchScore, adaptiveInterviewLink } = req.body;
  if (!applicationId) {
    return res.status(400).json({ success: false, error: 'Missing applicationId', statusCode: 400 });
  }
  try {
    const app = await Application.findById(applicationId);
    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found', statusCode: 404 });
    }
    if (typeof aiMatchScore === 'number') app.aiMatchScore = aiMatchScore;
    if (adaptiveInterviewLink) app.adaptiveInterviewLink = adaptiveInterviewLink;
    await app.save();
    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
};
