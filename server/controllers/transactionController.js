const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Property = require('../models/Property');

// Create transaction
exports.createTransaction = async (req, res) => {
  try {
    const { propertyId, type, amount, paymentMethod } = req.body;
    const userId = req.user.id;

    // Check if property exists and is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'العقار غير موجود'
      });
    }

    if (property.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'العقار غير متاح حالياً'
      });
    }

    // Check user credits
    const user = await User.findById(userId);
    if (user.credits < amount) {
      return res.status(400).json({
        success: false,
        message: 'رصيدك غير كاف لإتمام العملية'
      });
    }

    // Create transaction
    const transaction = new Transaction({
      user: userId,
      property: propertyId,
      type,
      amount,
      paymentMethod,
      status: 'pending'
    });

    await transaction.save();

    // Update property status
    property.status = 'reserved';
    await property.save();

    // Update user credits
    user.credits -= amount;
    await user.save();

    res.status(201).json({
      success: true,
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء العملية',
      error: error.message
    });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({
        path: 'user',
        select: 'name email',
        
        options: { lean: true },
        transform: (doc) => {
          if (!doc) {
            return {
              name: 'مستخدم محذوف',
              email: 'غير معروف'
            };
          }
          return doc;
        }
      });

    res.status(200).json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المعاملات',
      error: error.message
    });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('user', 'name email');
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'المعاملة غير موجودة'
      });
    }
    res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المعاملة',
      error: error.message
    });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { amount, type, description, status } = req.body;
    const transaction = await Transaction.findById(req.params.id).populate('user');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'المعاملة غير موجودة'
      });
    }

    const oldStatus = transaction.status;
    if (amount) transaction.amount = amount;
    if (type) transaction.type = type;
    if (description) transaction.description = description;
    if (status) transaction.status = status;

    await transaction.save();

    // Update user's points balance when transaction status changes
    if (status && status !== oldStatus) {
      const user = transaction.user;
      if (status === 'completed' && transaction.type === 'points_purchase') {
        // Add points for completed purchase
        user.credits += transaction.points;
      } else if (status === 'rejected' && oldStatus === 'completed' && transaction.type === 'points_purchase') {
        // Remove points if purchase is rejected after being completed
        user.credits -= transaction.points;
      }
      await user.save();
    }

    res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث المعاملة',
      error: error.message
    });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'المعاملة غير موجودة'
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف المعاملة بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المعاملة',
      error: error.message
    });
  }
}; 