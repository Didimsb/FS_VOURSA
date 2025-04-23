const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const cloudinary = require('cloudinary').v2;
const Transaction = require('../models/Transaction');
const Property = require('../models/Property');
const Settings = require('../models/Settings');
const Customer = require('../models/Customer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists by email or username
    const user = await User.findOne({
      $or: [
        { email },
        { username: email }
      ]
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالوصول'
      });
    }

    // Update last login
    await user.updateLastLogin();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      admin: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        whatsapp: user.whatsapp
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول'
    });
  }
});

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
  res.json({
    success: true,
    admin: user
  });
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.whatsapp = req.body.whatsapp || user.whatsapp;

  // Handle avatar upload
  if (req.file) {
    // Delete old avatar if exists
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Upload new avatar
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'admin-avatars',
      width: 150,
      height: 150,
      crop: 'fill'
    });

    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url
    };
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    admin: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      whatsapp: updatedUser.whatsapp
    }
  });
});

// @desc    Change password
// @route   PUT /api/admin/change-password
// @access  Private/Admin
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('كلمة المرور الحالية غير صحيحة');
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'تم تغيير كلمة المرور بنجاح'
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $ne: 'superadmin' } }).select('-password');
  res.json({
    success: true,
    users
  });
});

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, whatsapp } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('البريد الإلكتروني مستخدم بالفعل');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    phone,
    whatsapp
  });

  if (user) {
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        whatsapp: user.whatsapp
      }
    });
  } else {
    res.status(400);
    throw new Error('بيانات المستخدم غير صالحة');
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.phone = req.body.phone || user.phone;
  user.whatsapp = req.body.whatsapp || user.whatsapp;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      whatsapp: updatedUser.whatsapp
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  await user.deleteOne();
  res.json({ 
    success: true,
    message: 'تم حذف المستخدم بنجاح' 
  });
});

// @desc    Get all points transactions
// @route   GET /api/admin/points-transactions
// @access  Private/Admin
const getPointsTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ type: 'points_purchase' })
    .populate('user', 'name email phone')
    .sort('-createdAt');

  res.json({
    success: true,
    transactions
  });
});

// @desc    Update points transaction status
// @route   PUT /api/admin/points-transactions/:id
// @access  Private/Admin
const updatePointsTransaction = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const transaction = await Transaction.findById(req.params.id).populate('user');

  if (!transaction) {
    res.status(404);
    throw new Error('المعاملة غير موجودة');
  }

  if (transaction.type !== 'points_purchase') {
    res.status(400);
    throw new Error('نوع المعاملة غير صحيح');
  }

  const oldStatus = transaction.status;
  transaction.status = status;
  await transaction.save();

  // If transaction is approved, credit points to user
  if (status === 'completed' && oldStatus !== 'completed') {
    const user = transaction.user;
    user.credits += transaction.points;
    await user.save();
  }
  // If transaction is rejected and was previously completed, deduct points
  else if (status === 'rejected' && oldStatus === 'completed') {
    const user = transaction.user;
    user.credits -= transaction.points;
    await user.save();
  }

  res.json({
    success: true,
    transaction
  });
});

// Get admin statistics
const getStats = async (req, res) => {
  try {
    // Get total users and active users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get total properties and active properties (status: للبيع)
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'للبيع' });

    // Get total views (from properties)
    const properties = await Property.find();
    const totalViews = properties.reduce((sum, property) => sum + (property.views || 0), 0);

    // Get total sales from customers
    const customers = await Customer.find();
    const totalSales = customers.length;
    const totalSalesAmount = customers.reduce((sum, customer) => sum + (customer.agreedPrice || 0), 0);

    // Get total credits and active sellers
    const totalCredits = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$credits' } } }
    ]);
    const activeSellers = await User.countDocuments({ 
      role: 'seller', 
      isActive: true 
    });

    // Get points per property (from settings)
    const { getSettings } = require('../models/Settings');
    const settings = await getSettings();
    const pointsPerProperty = settings.pointsPerProperty;

    // Get total transactions
    const totalTransactions = await Transaction.countDocuments({
      status: 'completed'
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalProperties,
        activeProperties,
        totalViews,
        totalSales,
        totalSalesAmount,
        totalCredits: totalCredits[0]?.total || 0,
        activeSellers,
        pointsPerProperty,
        totalTransactions
      }
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات'
    });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getPointsTransactions,
  updatePointsTransaction,
  getStats
}; 