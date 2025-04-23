import axiosInstance from '../utils/axiosInstance';

// Get points balance
export const getPointsBalance = async () => {
  try {
    const response = await axiosInstance.get('/points/balance');
    return response.data;
  } catch (error) {
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