const { clerkClient, getAuth } = require('@clerk/express');
const User = require('../models/User');

/**
 * Attaches the MongoDB User document to req.dbUser.
 * Must be used AFTER clerkMiddleware() so req.auth is populated.
 */
async function attachUser(req, res, next) {
  try {
    const authData = getAuth(req);
    const { userId } = authData || {};
    
    if (!userId) {
      const authHeader = req.headers.authorization ? `${req.headers.authorization.substring(0, 15)}...` : 'Missing';
      return res.status(401).json({ 
        error: `Unauthorized: Missing userId in req.auth. AuthHeader: ${authHeader}` 
      });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // First time — fetch profile from Clerk and create DB record
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        avatar: clerkUser.imageUrl || '',
        role: clerkUser.publicMetadata?.role || 'candidate',
      });
    }

    req.dbUser = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Requires the authenticated user to have a specific role.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.dbUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!roles.includes(req.dbUser.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

module.exports = { attachUser, requireRole };
