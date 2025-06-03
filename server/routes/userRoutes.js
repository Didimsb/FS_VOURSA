const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, isAdmin } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  checkAdminAdded
} = require('../controllers/userController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('يجب أن تكون الصورة بصيغة jpeg أو jpg أو png'));
    }
  }
});

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);
router.put('/change-password', protect, changePassword);
router.get('/stats', protect, getUserStats);

// Admin routes
router.get('/admin/users', protect, isAdmin, getAllUsers);
router.post('/admin/users', protect, isAdmin, createUser);
router.put('/admin/users/:id', protect, isAdmin, updateUser);
router.delete('/admin/users/:id', protect, isAdmin, deleteUser);

router.post('/check-admin-added', checkAdminAdded);

module.exports = router; 