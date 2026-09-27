const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  status: {
    type: String,
    enum: ['Interested', 'Applied', 'Shortlisted', 'Completed'],
    default: 'Interested'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Prevent duplicate applications for the same user and opportunity
applicationSchema.index({ user: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
