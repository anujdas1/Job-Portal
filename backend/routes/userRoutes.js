// routes/userRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Register new user
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
    body('role').isIn(['candidate', 'recruiter']),
  ],
  register
);

// Login existing user
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  login
);

// Get current authenticated user info
router.get('/me', verifyToken, getMe);

module.exports = router;
