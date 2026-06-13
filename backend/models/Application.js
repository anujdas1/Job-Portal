const mongoose = require('mongoose');

const KANBAN_STAGES = ['applied', 'reviewing', 'interview', 'offered', 'rejected'];

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String, default: '' },
    status: {
      type: String,
      enum: KANBAN_STAGES,
      default: 'applied',
    },
    recruiterNotes: { type: String, default: '' },
    // For kanban ordering within a column
    kanbanOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
module.exports.KANBAN_STAGES = KANBAN_STAGES;
