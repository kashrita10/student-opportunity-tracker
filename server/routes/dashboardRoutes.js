const express = require('express');
const router = express.Router();
const { getStudentDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/student').get(protect, getStudentDashboard);

module.exports = router;
