const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Internship', 'Workshop', 'Hackathon', 'Certification', 'Competition'],
    required: true
  },
  location: {
    type: String
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    required: true
  },
  applicationUrl: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  skills: {
    type: [String],
    default: []
  },
  eligibility: {
    type: String
  },
  stipend: {
    type: String
  },
  category: {
    type: String
  },
  imageUrl: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);
