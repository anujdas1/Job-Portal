// server.js - entry point for the Job Portal backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Placeholder for future routes
app.use('/api', (req, res) => {
  res.status(501).json({ message: 'Routes not implemented yet' });
});

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
