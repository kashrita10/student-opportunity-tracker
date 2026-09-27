const Application = require('../models/Application');

// @desc    Get user applications
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate('opportunity');
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add application (track)
// @route   POST /api/applications/:opportunityId
// @access  Private
const addApplication = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const exists = await Application.findOne({
      user: req.user._id,
      opportunity: req.params.opportunityId
    });

    if (exists) {
      return res.status(400).json({ success: false, message: 'Application already tracked' });
    }

    const application = await Application.create({
      user: req.user._id,
      opportunity: req.params.opportunityId,
      status: status || 'Interested',
      notes
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:opportunityId
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const { status, notes } = req.body;

    let application = await Application.findOne({
      user: req.user._id,
      opportunity: req.params.opportunityId
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status || application.status;
    application.notes = notes !== undefined ? notes : application.notes;

    await application.save();

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Remove application
// @route   DELETE /api/applications/:opportunityId
// @access  Private
const removeApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      user: req.user._id,
      opportunity: req.params.opportunityId
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getApplications,
  addApplication,
  updateApplication,
  removeApplication
};
