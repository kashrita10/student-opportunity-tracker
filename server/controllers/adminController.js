const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const Application = require('../models/Application');

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalOpportunities = await Opportunity.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalApplications = await Application.countDocuments();

    const opportunities = await Opportunity.find();
    
    const opportunitiesByType = {
      Internship: opportunities.filter(o => o.type === 'Internship').length,
      Workshop: opportunities.filter(o => o.type === 'Workshop').length,
      Hackathon: opportunities.filter(o => o.type === 'Hackathon').length,
      Certification: opportunities.filter(o => o.type === 'Certification').length,
      Competition: opportunities.filter(o => o.type === 'Competition').length
    };

    res.json({
      success: true,
      data: {
        totalOpportunities,
        totalStudents,
        totalApplications,
        opportunitiesByType
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all opportunities for admin table
// @route   GET /api/admin/opportunities
// @access  Private/Admin
const getAdminOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });
    res.json({ success: true, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAdminOpportunities
};
