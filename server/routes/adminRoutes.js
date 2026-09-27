const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminOpportunities } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, admin, getAdminStats);
router.route('/opportunities').get(protect, admin, getAdminOpportunities);

module.exports = router;
