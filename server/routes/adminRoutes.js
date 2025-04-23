const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Public routes
router.post('/login', adminController.loginAdmin);

// Admin profile routes
router.get('/profile', protect, isAdmin, adminController.getAdminProfile);

// User management routes
router.get('/users', protect, isAdmin, adminController.getAllUsers);
router.post('/users', protect, isAdmin, adminController.createUser);
router.put('/users/:id', protect, isAdmin, adminController.updateUser);
router.delete('/users/:id', protect, isAdmin, adminController.deleteUser);

// Points transactions routes
router.get('/points-transactions', protect, isAdmin, adminController.getPointsTransactions);
router.put('/points-transactions/:id', protect, isAdmin, adminController.updatePointsTransaction);

// Add new route for admin statistics
router.get('/stats', protect, isAdmin, adminController.getStats);

module.exports = router; 