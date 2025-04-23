const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['points_purchase', 'property_listing'],
    required: true
  },
  amount: {
    type: Number,
    required: function() {
      return this.type === 'points_purchase';
    }
  },
  points: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: function() {
      return this.type === 'points_purchase';
    }
  },
  screenshotUrl: {
    type: String,
    required: function() {
      return this.type === 'points_purchase';
    }
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema); 