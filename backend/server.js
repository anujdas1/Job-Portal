// server.js - entry point for the Job Portal backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// middlewares and error handler imports
const mongoose = require('mongoose');

// Load authentication middlewares
const { verifyToken, requireRole } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
// Route imports
const jobRouter = require('./routes/jobRoutes');
const applicationRouter = require('./routes/applicationRoutes');
const savedJobRouter = require('./routes/savedJobRoutes');
const aiWebhookRouter = require('./routes/aiWebhookRoutes');
const userRouter = require('./routes/userRoutes');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');



// Example protected route
// Load models so they are registered with Mongoose
require('./models/User');
require('./models/Job');
require('./models/Application');
require('./models/SavedJob');



const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Security middlewares
app.use(helmet());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
app.use(morgan('combined'));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal API',
      version: '1.0.0',
      description: 'API documentation for the Job Portal backend',
    },
    servers: [{ url: `http://localhost:${PORT}/api` }],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount API routers after app initialization
app.use('/api/jobs', jobRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/saved-jobs', savedJobRouter);
app.use('/api/webhook', aiWebhookRouter);
app.use('/api/users', userRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});



// Example protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ success: true, message: `Hello ${req.user.email || 'user'}!` });
});

// Global error handler
app.use(errorHandler);


// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
