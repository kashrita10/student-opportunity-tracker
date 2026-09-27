const express = require('express');
const router = express.Router();
const { 
  getOpportunities, 
  getOpportunityById, 
  createOpportunity, 
  updateOpportunity, 
  deleteOpportunity 
} = require('../controllers/opportunityController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getOpportunities)
  .post(protect, admin, createOpportunity);

router.route('/:id')
  .get(getOpportunityById)
  .put(protect, admin, updateOpportunity)
  .delete(protect, admin, deleteOpportunity);

module.exports = router;
