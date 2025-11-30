import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fs-voursa.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1800000, // 30 minutes timeout for large file uploads
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set longer timeout for file uploads
    if (config.data instanceof FormData) {
      config.timeout = 1800000; // 30 minutes for file uploads
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        // Redirect to appropriate login page based on current route
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/seller-login';
        }
      } else if (error.response.status === 500) {
        // Handle server errors
        console.error('Server Error:', error.response.data);
      } else if (error.response.status === 413) {
        // Handle file too large error
        console.error('File too large:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else if (error.code === 'ECONNABORTED') {
      // Handle timeout errors
      console.error('Request timeout:', error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;