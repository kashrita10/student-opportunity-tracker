const Bookmark = require('../models/Bookmark');

// @desc    Get user bookmarks
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate('opportunity');
    res.json({ success: true, data: bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add bookmark
// @route   POST /api/bookmarks/:opportunityId
// @access  Private
const addBookmark = async (req, res) => {
  try {
    const exists = await Bookmark.findOne({ 
      user: req.user._id, 
      opportunity: req.params.opportunityId 
    });

    if (exists) {
      return res.status(400).json({ success: false, message: 'Already bookmarked' });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      opportunity: req.params.opportunityId
    });

    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:opportunityId
// @access  Private
const removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      opportunity: req.params.opportunityId
    });

    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark
};
