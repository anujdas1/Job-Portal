const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyLogo: { type: String, default: '' },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'contract', 'internship'],
      required: true,
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: 'USD' },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open' },
    applicantCount: { type: Number, default: 0 },
    deadline: { type: Date },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      default: 'mid',
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', skills: 'text' });
jobSchema.index({ status: 1, type: 1, location: 1 });

module.exports = mongoose.model('Job', jobSchema);
