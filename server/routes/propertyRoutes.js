const express = require('express');
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getLatestProperties,
  getSellerProperties,
  rejectProperty,
  markPropertyAsSold,
  getSellerCustomers,
  getSellerStats,
  markAsRented
} = require('../controllers/propertyController');
const { protect, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
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
  limits: { fileSize: 50000000 }, // 50MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and Videos Only!');
  }
}

// Public routes
router.get('/', getAllProperties);
router.get('/seller/properties', getSellerProperties);
router.get('/latest', getLatestProperties);
router.get('/:id', getProperty);

// Protected routes
router.post('/', protect, upload.fields([
  { name: 'mainPhoto', maxCount: 1 },
  { name: 'additionalMedia', maxCount: 10 }
]), createProperty);
router.put('/:id', protect, upload.fields([
  { name: 'mainPhoto', maxCount: 1 },
  { name: 'additionalMedia', maxCount: 10 }
]), updateProperty);
router.delete('/:id', protect, deleteProperty);
router.put('/:id/reject', protect, isAdmin, rejectProperty);
router.post('/:propertyId/sold', protect, markPropertyAsSold);
router.post('/:propertyId/rented', protect, markAsRented);
router.get('/seller/customers', protect, isAdmin, getSellerCustomers);
router.get('/seller/stats', protect, isAdmin, getSellerStats);

module.exports = router; 