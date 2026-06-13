const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['candidate', 'recruiter'], default: 'candidate' },

    // Candidate-specific
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    resumeUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },

    // Recruiter-specific
    company: { type: String, default: '' },
    companyLogo: { type: String, default: '' },
    companyWebsite: { type: String, default: '' },
    companySize: { type: String, default: '' },
    industry: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
