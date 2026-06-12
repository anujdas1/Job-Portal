// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
    },
    tags: [{ type: String }],
    // future fields can be added later
  },
  { timestamps: true }
);

// Indexes for fast filtering
jobSchema.index({ location: 1, tags: 1 });
jobSchema.index({ title: 'text' });

module.exports = mongoose.model('Job', jobSchema);
