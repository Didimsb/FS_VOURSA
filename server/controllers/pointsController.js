const User = require('../models/User');
const { Settings, getSettings } = require('../models/Settings');
const Transaction = require('../models/Transaction');

// Get user's points balance
exports.getPointsBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('credits');
    res.json({ credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب رصيد النقاط' });
  }
};

// Purchase points
exports.purchasePoints = async (req, res) => {
  try {
    const { amount, paymentMethodId, screenshotUrl } = req.body;
    const settings = await getSettings();
    
    if (!settings) {
      return res.status(400).json({ 
        success: false,
        message: 'لم يتم العثور على إعدادات النظام' 
      });
    }

    // Validate amount against settings
    if (amount < settings.minPointsToBuy || amount > settings.maxPointsToBuy) {
      return res.status(400).json({ 
        success: false,
        message: `يجب أن يكون المبلغ بين ${settings.minPointsToBuy} و ${settings.maxPointsToBuy} نقطة` 
      });
    }

    // Validate payment method
    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'يرجى اختيار طريقة الدفع'
      });
    }

    // Validate screenshot
    if (!screenshotUrl) {
      return res.status(400).json({
        success: false,
        message: 'يرجى رفع صورة إثبات الدفع'
      });
    }

    const cost = amount * settings.pointCost;

    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      type: 'points_purchase',
      amount: cost,
      points: amount,
      status: 'pending', // Points will be credited after admin approval
      description: `شراء ${amount} نقطة`,
      paymentMethod: paymentMethodId,
      screenshotUrl: screenshotUrl
    });

    await transaction.save();

    // Add transaction to user's transactions array
    const user = await User.findById(req.user.id);
    user.transactions.push(transaction._id);
    await user.save();

    res.json({ 
      success: true,
      message: 'تم استلام طلب شراء النقاط بنجاح. سيتم مراجعة الطلب من قبل الإدارة.',
      transaction,
      newBalance: user.credits // Return current balance, not updated balance
    });
  } catch (error) {
    console.error('Error purchasing points:', error);
    res.status(500).json({ 
      success: false,
      message: 'خطأ في شراء النقاط' 
    });
  }
};

// Deduct points for property listing
exports.deductPointsForProperty = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على إعدادات النظام'
      });
    }

    const user = await User.findById(req.user.id);
    const requiredPoints = settings.pointsPerProperty;

    if (user.credits < requiredPoints) {
      return res.status(400).json({
        success: false,
        message: `رصيد غير كافٍ. مطلوب ${requiredPoints} نقطة لإضافة عقار جديد`
      });
    }

    await user.deductCredits(requiredPoints);

    // Create transaction record
    const transaction = new Transaction({
      user: user._id,
      type: 'property_listing',
      points: requiredPoints,
      status: 'completed',
      description: 'إضافة عقار جديد'
    });

    await transaction.save();

    // Add transaction to user's transactions array
    user.transactions.push(transaction._id);
    await user.save();

    res.status(200).json({
      success: true,
      remainingCredits: user.credits,
      transaction: {
        id: transaction._id,
        points: transaction.points,
        type: transaction.type,
        status: transaction.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء خصم النقاط',
      error: error.message
    });
  }
};

// Get user's points transactions
exports.getPointsTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Error fetching points transactions:', error);
    res.status(500).json({ 
      success: false,
      message: 'خطأ في جلب سجل المعاملات' 
    });
  }
}; 