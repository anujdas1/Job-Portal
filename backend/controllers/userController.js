// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Register a new user.
 * Expected body: { email, password, name, role }
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ success: false, error: 'Missing required fields', statusCode: 400 });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: 'User already exists', statusCode: 409 });
    }
    const user = new User({ email, name, role });
    await user.setPassword(password);
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, data: { token, user: { id: user._id, email: user.email, name: user.name, role: user.role } } });
  } catch (err) {
    next(err);
  }
};

/**
 * Login existing user.
 * Expected body: { email, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Missing email or password', statusCode: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials', statusCode: 401 });
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials', statusCode: 401 });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { token, user: { id: user._id, email: user.email, name: user.name, role: user.role } } });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user info.
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', statusCode: 404 });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
