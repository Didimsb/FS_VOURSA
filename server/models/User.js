const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'البريد الإلكتروني غير صحيح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    trim: true
  },
  whatsapp: {
    type: String,
    required: [true, 'رقم الواتساب مطلوب'],
    trim: true
  },
  avatar: {
    public_id: String,
    url: String
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin', 'seller'],
    default: 'seller'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  company: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  credits: {
    type: Number,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

// Method to add credits
userSchema.methods.addCredits = async function(amount) {
  this.credits += amount;
  await this.save();
};

// Method to deduct credits
userSchema.methods.deductCredits = async function(amount) {
  if (this.credits < amount) {
    throw new Error('رصيد غير كافٍ');
  }
  this.credits -= amount;
  await this.save();
};

userSchema.pre('remove', async function(next) {
  // 'this' refers to the user being removed
  await this.model('Transaction').deleteMany({ user: this._id });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User; 