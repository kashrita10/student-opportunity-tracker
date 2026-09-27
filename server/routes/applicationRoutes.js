const express = require('express');
const router = express.Router();
const { 
  getApplications, 
  addApplication, 
  updateApplication, 
  removeApplication 
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getApplications);

router.route('/:opportunityId')
  .post(protect, addApplication)
  .put(protect, updateApplication)
  .delete(protect, removeApplication);

module.exports = router;
