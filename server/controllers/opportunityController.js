const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities with filtering, search, pagination, and sorting
// @route   GET /api/opportunities
// @access  Public (or Private depending on requirements, let's keep it public/protected for students)
const getOpportunities = async (req, res) => {
  try {
    const { search, type, mode, skills, deadline, category, page = 1, limit = 10, sort } = req.query;
    
    let query = {};
    
    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by mode
    if (mode) {
      query.mode = mode;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray }; // Opportunities that have ANY of the requested skills
    }

    // Filter by deadline
    if (deadline === 'upcoming') {
      query.deadline = { $gte: new Date() };
    } else if (deadline === 'expired') {
      query.deadline = { $lt: new Date() };
    }

    // Sorting
    let sortObj = { createdAt: -1 }; // default newest
    if (sort === 'newest') {
      sortObj = { createdAt: -1 };
    } else if (sort === 'deadline-soonest') {
      sortObj = { deadline: 1 };
    }

    const limitNum = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * limitNum;

    const opportunities = await Opportunity.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Opportunity.countDocuments(query);

    res.json({
      success: true,
      count: opportunities.length,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limitNum),
      data: opportunities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Public
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }
    res.json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid ID or Server Error' });
  }
};

// @desc    Create new opportunity
// @route   POST /api/opportunities
// @access  Private/Admin
const createOpportunity = async (req, res) => {
  try {
    // Inject createdBy from logged in admin
    req.body.createdBy = req.user._id;

    const opportunity = await Opportunity.create(req.body);
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private/Admin
const updateOpportunity = async (req, res) => {
  try {
    let opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: opportunity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private/Admin
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    await opportunity.deleteOne();

    res.json({ success: true, message: 'Opportunity removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
};
