import axiosInstance from '../utils/axiosInstance';

// Get points balance
export const getPointsBalance = async () => {
  try {
    const response = await axiosInstance.get('/points/balance');
    console.log('Points balance API response:', response.data); // Debug log
    
    // Handle both response formats
    if (response.data) {
      if (response.data.success !== undefined) {
        // If response has success property
        return {
          credits: response.data.credits || 0,
          success: response.data.success
        };
      } else if (response.data.credits !== undefined) {
        // If response directly contains credits
        return {
          credits: response.data.credits,
          success: true
        };
      }
    }
    
    throw new Error('تنسيق البيانات غير صالح');
  } catch (error) {
    console.error('Points balance error:', error);
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء جلب رصيد النقاط');
  }
};

// Purchase points
export const purchasePoints = async ({ amount, paymentMethodId, screenshotUrl }) => {
  if (!paymentMethodId) {
    throw new Error('يرجى اختيار طريقة الدفع');
  }
  
  try {
    const response = await axiosInstance.post('/points/purchase', { 
      amount, 
      paymentMethodId, 
      screenshotUrl 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء شراء النقاط');
  }
};

// Deduct points for property
export const deductPointsForProperty = async () => {
  try {
    const response = await axiosInstance.post('/points/deduct');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء خصم النقاط');
  }
};

// Get points transactions
export const getPointsTransactions = async () => {
  try {
    const response = await axiosInstance.get('/points/transactions');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء جلب سجل النقاط');
  }
}; 