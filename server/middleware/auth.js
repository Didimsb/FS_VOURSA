const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالوصول'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to find user first
    let user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
      return next();
    }

    // If user not found, try to find admin
    let admin = await Admin.findById(decoded.id);
    if (admin) {
      req.user = admin;
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'المستخدم غير موجود'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول',
      error: error.message
    });
  }
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول'
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'غير مصرح لك بالوصول'
    });
  }
  next();
};

module.exports = {
  protect,
  isAdmin
}; 