// middlewares/errorHandler.js
/**
 * Centralized error‑handling middleware for Express.
 * Captures both synchronous errors (thrown) and asynchronous ones (rejected promises passed to next()).
 * Returns a JSON response in the shape { success: false, error: <msg>, statusCode: <code> }.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    error: message,
    statusCode: status,
  });
};

module.exports = errorHandler;
