const Bookmark = require('../models/Bookmark');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student
// @access  Private
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalBookmarks = await Bookmark.countDocuments({ user: userId });
    
    const applications = await Application.find({ user: userId }).populate('opportunity');
    const totalApplications = applications.length;

    const applicationsByStatus = {
      Interested: applications.filter(a => a.status === 'Interested').length,
      Applied: applications.filter(a => a.status === 'Applied').length,
      Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      Completed: applications.filter(a => a.status === 'Completed').length,
    };

    // Find upcoming deadlines from bookmarked and interested applications
    const opportunityIds = applications.map(a => a.opportunity._id);
    const bookmarks = await Bookmark.find({ user: userId });
    const bookmarkedIds = bookmarks.map(b => b.opportunity);

    const uniqueIds = [...new Set([...opportunityIds, ...bookmarkedIds])];

    const upcomingDeadlines = await Opportunity.find({
      _id: { $in: uniqueIds },
      deadline: { $gte: new Date() }
    }).sort({ deadline: 1 }).limit(5);

    const recentlyAdded = await Opportunity.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalBookmarks,
        totalApplications,
        applicationsByStatus,
        upcomingDeadlines,
        recentlyAdded
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudentDashboard
};
