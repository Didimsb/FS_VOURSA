const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPointsBalance,
  purchasePoints,
  deductPointsForProperty,
  getPointsTransactions
} = require('../controllers/pointsController');

// Points routes
router.get('/balance', protect, getPointsBalance);
router.post('/purchase', protect, purchasePoints);
router.post('/deduct', protect, deductPointsForProperty);
router.get('/transactions', protect, getPointsTransactions);

module.exports = router; 