// scripts/seed_test_application.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

(async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    // Create a recruiter user
    const recruiter = new User({
      email: 'recruiter@example.com',
      passwordHash: 'hashed', // not used for auth in this seed
      name: 'Recruiter',
      role: 'recruiter',
    });
    await recruiter.save();

    // Create a candidate user
    const candidate = new User({
      email: 'candidate@example.com',
      passwordHash: 'hashed',
      name: 'Candidate',
      role: 'candidate',
    });
    await candidate.save();

    // Create a job posted by recruiter
    const job = new Job({
      title: 'Senior Engineer',
      description: 'Work on cutting‑edge AI systems.',
      recruiterId: recruiter._id,
      location: 'Remote',
      salaryRange: { min: 90000, max: 130000 },
      tags: ['AI', 'Node.js'],
    });
    await job.save();

    // Create an application by candidate
    const application = new Application({
      jobId: job._id,
      candidateId: candidate._id,
      status: 'Applied',
    });
    await application.save();

    console.log('Seed data created:');
    console.log('Recruiter ID:', recruiter._id.toString());
    console.log('Candidate ID:', candidate._id.toString());
    console.log('Job ID:', job._id.toString());
    console.log('Application ID:', application._id.toString());
    process.exit(0);
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
})();
