import axiosInstance from '../utils/axiosInstance';

// Create a new property with progress tracking
export const createProperty = async (propertyData, onProgress) => {
  try {
    const response = await axiosInstance.post('/properties', propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء إنشاء العقار');
  }
};

// Upload file with progress tracking
export const uploadFileWithProgress = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/upload/cloudinary-progress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء رفع الملف');
  }
};

// Upload file without progress tracking
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/upload/cloudinary', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'حدث خطأ أثناء رفع الملف');
  }
};

// Get all properties with pagination
export const getAllProperties = async (page = 1, limit = 12, filters = {}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    // Add filter parameters
    if (filters.propertyType) {
      params.append('propertyType', filters.propertyType);
    }
    if (filters.province) {
      params.append('province', filters.province);
    }
    if (filters.district) {
      params.append('district', filters.district);
    }
    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters.bedrooms) {
      params.append('bedrooms', filters.bedrooms.toString());
    }
    if (filters.bathrooms) {
      params.append('bathrooms', filters.bathrooms.toString());
    }
    if (filters.sortBy) {
      params.append('sort', filters.sortBy);
    }

    const response = await axiosInstance.get(`/properties?${params.toString()}&select=+images`);
    return {
      properties: response.data?.properties || [],
      hasMore: response.data?.hasMore || false,
      totalPages: response.data?.totalPages || 1,
      currentPage: response.data?.currentPage || page,
      totalProperties: response.data?.totalProperties || 0
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      properties: [],
      hasMore: false,
      totalPages: 1,
      currentPage: page,
      totalProperties: 0
    };
  }
};

// Get all property types
export const getAllPropertyTypes = async () => {
  try {
    const response = await axiosInstance.get('/properties/types');
    return response.data?.propertyTypes || [];
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
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