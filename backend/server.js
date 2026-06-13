require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { clerkMiddleware } = require('@clerk/express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// ── Models (register with Mongoose) ──────────────────────────────────────────
require('./models/User');
require('./models/Job');
require('./models/Application');
require('./models/SavedJob');
require('./models/Notification');

// ── Routes ────────────────────────────────────────────────────────────────────
const jobRouter = require('./routes/jobRoutes');
const applicationRouter = require('./routes/applicationRoutes');
const savedJobRouter = require('./routes/savedJobRoutes');
const userRouter = require('./routes/userRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const aiWebhookRouter = require('./routes/aiWebhookRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// ── Health check (no auth needed — must be before clerkMiddleware) ────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), version: '2.0.0' });
});

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(clerkMiddleware());

// ── Static file serving (uploaded resumes) ────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Swagger ───────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Job Portal API', version: '2.0.0', description: 'Job Portal REST API' },
    servers: [{ url: `http://localhost:${PORT}/api` }],
  },
  apis: ['./routes/*.js'],
};
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/jobs', jobRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/saved-jobs', savedJobRouter);
app.use('/api/users', userRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/webhook', aiWebhookRouter);

// (Health check moved to before clerkMiddleware above)

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler);

// ── MongoDB & Server startup ──────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📄 API docs at http://localhost:${PORT}/api/docs`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
