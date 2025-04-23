const { Settings, getSettings } = require('../models/Settings');

// Get all settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإعدادات'
    });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    
    // Update all fields from request body
    Object.keys(req.body).forEach(key => {
      if (settings[key] !== undefined) {
        settings[key] = req.body[key];
      }
    });
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
      settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الإعدادات'
    });
  }
};

// Update payment methods
exports.updatePaymentMethods = async (req, res) => {
  try {
    const settings = await getSettings();
    settings.paymentMethods = req.body.paymentMethods;
    await settings.save();
    
    res.json({
      success: true,
      message: 'تم تحديث طرق الدفع بنجاح',
      paymentMethods: settings.paymentMethods
    });
  } catch (error) {
    console.error('Error updating payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث طرق الدفع'
    });
  }
}; 