const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

// Public routes
router.get('/', protect, transactionController.getAllTransactions);
router.get('/:id', protect, transactionController.getTransactionById);

// Protected routes
router.post('/', protect, transactionController.createTransaction);
router.put('/:id', protect, transactionController.updateTransaction);
router.delete('/:id', protect, transactionController.deleteTransaction);

module.exports = router; 