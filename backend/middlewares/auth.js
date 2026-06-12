// middlewares/auth.js
const jwt = require('jsonwebtoken');

/**
 * verifyToken – validates JWT from the Authorization header.
 * If valid, attaches `req.user` (decoded token) and calls `next()`.
 * Otherwise, responds with 401 Unauthorized.
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Missing token', statusCode: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ success: false, error: 'Invalid token', statusCode: 401 });
  }
};

/**
 * requireRole – higher‑order middleware that enforces a specific role.
 * Usage: app.use('/api/recruiter', verifyToken, requireRole('recruiter'));
 */
const requireRole = (roleName) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ success: false, error: 'User role missing', statusCode: 403 });
  }
  if (req.user.role !== roleName) {
    return res.status(403).json({ success: false, error: `Requires ${roleName} role`, statusCode: 403 });
  }
  next();
};

module.exports = { verifyToken, requireRole };
