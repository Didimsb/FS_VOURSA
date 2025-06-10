import axiosInstance from '../utils/axiosInstance';

// Create a new property
export const createProperty = async (propertyData) => {
  try {
    const response = await axiosInstance.post('/properties', propertyData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء إنشاء العقار');
  }
};

// Get all properties with pagination
export const getAllProperties = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/properties?page=${page}&limit=${limit}&select=+images`);
    return {
      properties: response.data?.properties || [],
      hasMore: response.data?.hasMore || false
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      properties: [],
      hasMore: false
    };
  }
};

// Get property by ID
export const getPropertyById = async (id) => {
  try {
    const response = await axiosInstance.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء جلب العقار');
  }
};

// Update property
export const updateProperty = async (id, propertyData) => {
  try {
    const response = await axiosInstance.put(`/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء تحديث العقار');
  }
};

// Delete property
export const deleteProperty = async (id) => {
  try {
    const response = await axiosInstance.delete(`/properties/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء حذف العقار');
  }
};

export const getProperty = async (id) => {
  try {
    // console.log('Fetching property with ID:', id);
    const response = await axiosInstance.get(`/properties/${id}`);
    // console.log('Property response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', {
      id,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء جلب بيانات العقار');
  }
}; 