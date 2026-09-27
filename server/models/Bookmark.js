const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  }
}, { timestamps: true });

// Prevent duplicate bookmarks for the same user and opportunity
bookmarkSchema.index({ user: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
