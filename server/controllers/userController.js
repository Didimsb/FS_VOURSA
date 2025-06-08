const User = require('../models/User');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Register user
exports.registerUser = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password, phone, whatsapp } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      whatsapp,
      role: 'seller',
      isApproved: false
    });

    console.log('New user object before save:', user);

    try {
      await user.save();
      console.log('User saved successfully:', user);
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء التسجيل',
        error: saveError.message
      });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التسجيل',
      error: error.message
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.error('Login attempt with missing credentials');
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    // Check if user exists and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.error('Login failed: User not found:', email);
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Check if password exists
    if (!user.password) {
      console.error('Login failed: No password found for user:', email);
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error('Login failed: Password mismatch for user:', email);
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Check if user is approved (skip for admin and superadmin)
    if (user.role === 'seller' && !user.isApproved) {
      console.error('Login failed: Unapproved seller login attempt:', email);
      return res.status(403).json({
        success: false,
        message: 'حسابك قيد المراجعة. سيتم إعلامك عند الموافقة.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.error('Login failed: Inactive user login attempt:', email);
      return res.status(403).json({
        success: false,
        message: 'حسابك معطل. يرجى التواصل مع الإدارة.'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = user.generateAuthToken();
    console.log('Login successful for user:', {
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      isActive: user.isActive
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      email: req.body.email
    });
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول',
      error: error.message
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'properties',
        model: 'Property',
        select: 'title description price location propertyType status bedrooms bathrooms area features amenities images createdAt'
      })
      .populate({
        path: 'transactions',
        model: 'Transaction',
        select: 'type amount points status description paymentMethod screenshotUrl createdAt'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الملف الشخصي',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, whatsapp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (whatsapp) user.whatsapp = whatsapp;

    // Handle avatar upload
    if (req.file) {
      // Delete old avatar if exists
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      // Upload new avatar
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
        width: 150,
        height: 150,
        crop: 'fill'
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الملف الشخصي',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تغيير كلمة المرور',
      error: error.message
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('properties')
      .populate('transactions');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    const stats = {
      totalProperties: user.properties.length,
      activeProperties: user.properties.filter(p => p.status === 'active').length,
      totalTransactions: user.transactions.length,
      totalCredits: user.credits,
      lastLogin: user.lastLogin
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات',
      error: error.message
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate({
        path: 'properties',
        model: 'Property',
        select: 'title description price location propertyType status bedrooms bathrooms area features amenities images createdAt'
      })
      .populate({
        path: 'transactions',
        model: 'Transaction',
        select: 'type amount points status description paymentMethod screenshotUrl createdAt'
      });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المستخدمين',
      error: error.message
    });
  }
};

// Admin: Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, whatsapp, role, company, address } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      whatsapp,
      role,
      company,
      address
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        role: user.role,
        company: user.company,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء المستخدم',
      error: error.message
    });
  }
};

// Admin: Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, whatsapp, role, company, address } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (whatsapp) user.whatsapp = whatsapp;
    if (role) user.role = role;
    if (company) user.company = company;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        role: user.role,
        company: user.company,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث المستخدم',
      error: error.message
    });
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المستخدم',
      error: error.message
    });
  }
};

// Check if user exists and was added by admin
exports.checkAdminAdded = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Check if user exists with this email or phone
    const user = await User.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (user) {
      // Check if user was added by admin
      return res.json({
        exists: true,
        isAdminAdded: user.isAdminAdded || false
      });
    }

    return res.json({
      exists: false,
      isAdminAdded: false
    });
  } catch (error) {
    console.error('Error checking admin added user:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التحقق من المستخدم'
    });
  }
}; 