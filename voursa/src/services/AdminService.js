import axiosInstance from '../utils/axiosInstance';

// User Management
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/users');
    return { success: true, users: response.data.users };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء جلب المستخدمين' };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/admin/users', userData);
    return { success: true, user: response.data.user };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء إضافة المستخدم' };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return { success: true, user: response.data.user };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء تحديث المستخدم' };
  }
};

export const deleteUser = async (userId) => {
  try {
    await axiosInstance.delete(`/admin/users/${userId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء حذف المستخدم' };
  }
};

// Property Management
export const getAllProperties = async () => {
  try {
    const response = await axiosInstance.get('/admin/properties');
    return { success: true, properties: response.data.properties };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء جلب العقارات' };
  }
};

export const approveProperty = async (propertyId) => {
  try {
    const response = await axiosInstance.put(`/admin/properties/${propertyId}/approve`);
    return { success: true, property: response.data.property };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء الموافقة على العقار' };
  }
};

export const rejectProperty = async (propertyId, reason) => {
  try {
    const response = await axiosInstance.put(`/admin/properties/${propertyId}/reject`, { reason });
    return { success: true, property: response.data.property };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء رفض العقار' };
  }
};

// Transaction Management
export const getAllTransactions = async () => {
  try {
    const response = await axiosInstance.get('/admin/transactions');
    return { success: true, transactions: response.data.transactions };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء جلب المعاملات' };
  }
};

export const approveTransaction = async (transactionId) => {
  try {
    const response = await axiosInstance.put(`/admin/transactions/${transactionId}/approve`);
    return { success: true, transaction: response.data.transaction };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء الموافقة على المعاملة' };
  }
};

export const rejectTransaction = async (transactionId, reason) => {
  try {
    const response = await axiosInstance.put(`/admin/transactions/${transactionId}/reject`, { reason });
    return { success: true, transaction: response.data.transaction };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء رفض المعاملة' };
  }
};

// Points Management
export const getAllPointsTransactions = async () => {
  try {
    const response = await axiosInstance.get('/admin/points/transactions');
    return { success: true, transactions: response.data.transactions };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء جلب معاملات النقاط' };
  }
};

export const addPoints = async (userId, points, reason) => {
  try {
    const response = await axiosInstance.post('/admin/points/add', { userId, points, reason });
    return { success: true, transaction: response.data.transaction };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء إضافة النقاط' };
  }
};

export const deductPoints = async (userId, points, reason) => {
  try {
    const response = await axiosInstance.post('/admin/points/deduct', { userId, points, reason });
    return { success: true, transaction: response.data.transaction };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء خصم النقاط' };
  }
};

// Admin Profile
export const getAdminProfile = async () => {
  try {
    const response = await axiosInstance.get('/admin/profile');
    return { success: true, admin: response.data.admin };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء جلب الملف الشخصي' };
  }
};

export const updateAdminProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/admin/profile', profileData);
    return { success: true, admin: response.data.admin };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء تحديث الملف الشخصي' };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.put('/admin/change-password', { currentPassword, newPassword });
    return { success: true, message: response.data.message };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور' };
  }
};

export const approveSeller = async (userId) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}/approve-seller`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllProperties,
  approveProperty,
  rejectProperty,
  getAllTransactions,
  approveTransaction,
  rejectTransaction,
  getAllPointsTransactions,
  addPoints,
  deductPoints,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  approveSeller
};