const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المشتري مطلوب'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'رقم هاتف المشتري مطلوب'],
    trim: true
  },
  agreedPrice: {
    type: Number,
    required: [true, 'السعر المتفق عليه مطلوب'],
    min: [0, 'السعر يجب أن يكون أكبر من صفر']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema); 