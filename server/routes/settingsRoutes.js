const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { Settings, getSettings } = require('../models/Settings');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error in GET /settings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإعدادات',
      error: error.message
    });
  }
});

// Update settings
router.put('/', protect, isAdmin, async (req, res) => {
  try {
    // Get current settings or create new one
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      // Update each field from req.body
      Object.keys(req.body).forEach(key => {
        settings[key] = req.body[key];
      });
    }
    
    // Save the updated settings
    await settings.save();
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error in PUT /settings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الإعدادات',
      error: error.message
    });
  }
});

module.exports = router; 