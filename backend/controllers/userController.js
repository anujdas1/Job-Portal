const User = require('../models/User');
const { clerkClient } = require('@clerk/express');

/**
 * GET /api/users/me
 * Get own profile
 */
exports.getProfile = async (req, res) => {
  res.json(req.dbUser);
};

/**
 * PUT /api/users/me
 * Update own profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = [
      'name', 'bio', 'skills', 'location', 'linkedin', 'github', 'portfolio',
      'company', 'companyLogo', 'companyWebsite', 'companySize', 'industry',
    ];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.dbUser._id, updates, { new: true, runValidators: true });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/me/resume
 * Upload / update resume URL
 */
exports.updateResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const resumeUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.dbUser._id, { resumeUrl }, { new: true });
    res.json({ resumeUrl: user.resumeUrl });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/set-role
 * Set role (candidate/recruiter) after registration
 */
exports.setRole = async (req, res, next) => {
  try {
    const { role, profileData = {} } = req.body;
    if (!['candidate', 'recruiter'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updates = { role };
    const allowed = [
      'name', 'bio', 'skills', 'location', 'linkedin', 'github', 'portfolio',
      'company', 'companyLogo', 'companyWebsite', 'companySize', 'industry'
    ];
    allowed.forEach((key) => {
      if (profileData[key] !== undefined) updates[key] = profileData[key];
    });

    const user = await User.findByIdAndUpdate(req.dbUser._id, updates, { new: true });

    // Sync role to Clerk public metadata
    await clerkClient.users.updateUserMetadata(req.dbUser.clerkId, {
      publicMetadata: { role },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id
 * Public - get any user's public profile
 */
exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-clerkId');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
