/**
 * Global error handler middleware.
 * Must be registered last in Express (after all routes).
 */
function errorHandler(err, req, res, next) {
  console.error('[Error]', err.stack || err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ error: `Duplicate value for ${field}` });
  }

  // JWT / Clerk auth errors
  if (err.status === 401 || err.message?.toLowerCase().includes('unauthorized')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Generic server error
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
