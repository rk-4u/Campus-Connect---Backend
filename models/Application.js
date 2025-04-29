const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String, required: true },
  coverLetter: String,
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'shortlisted', 'rejected', 'hired'],
    default: 'submitted'
  },
  appliedAt: { type: Date, default: Date.now },
  feedback: String
});

// Add a unique compound index on job and student
ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
