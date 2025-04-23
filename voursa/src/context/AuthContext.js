import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as AdminService from '../services/AdminService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Token kontrolü ve yönlendirme
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      console.log('Token:', token);
      console.log('Stored User:', storedUser);
      
      if (!token || !storedUser) {
        console.log('No token or stored user found');
        setUser(null);
        setLoading(false); // Set loading to false if no token or user
        return;
      }
      
      try {
        // Set the token in axios headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Check user profile based on role
        let response;
        if (storedUser.role === 'admin' || storedUser.role === 'superadmin') {
          // Admin profile check
          response = await axiosInstance.get('/admin/profile');
          if (response.data.success) {
            setUser(response.data.admin);
            if (window.location.pathname === '/admin/login' || window.location.pathname === '/seller-login') {
              navigate('/admin/dashboard', { replace: true });
            }
          }
        } else if (storedUser.role === 'seller') {
          // Seller profile check
          response = await axiosInstance.get('/users/profile');
          if (response.data.success) {
            setUser(response.data.user);
            if (window.location.pathname === '/admin/login' || window.location.pathname === '/seller-login') {
              navigate('/seller-dashboard', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        
        // Redirect to login if on a protected route
        const protectedPaths = ['/admin/dashboard', '/seller-dashboard', '/profile'];
        if (protectedPaths.some(path => window.location.pathname.startsWith(path))) {
          if (window.location.pathname.startsWith('/admin')) {
            navigate('/admin/login', { replace: true });
          } else {
            navigate('/seller-login', { replace: true });
          }
        }
      } finally {
        // Set loading to false after a short delay to prevent flashing
        setTimeout(() => {
        setLoading(false);
        }, 500);
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Login fonksiyonu
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate input
      if (!username || !password) {
        setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
        return { success: false, error: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' };
      }
      
      // First try admin login
      try {
        const adminResponse = await axiosInstance.post('/admin/login', {
          email: username,
          password: password
        });
        
        console.log('Admin login response:', adminResponse.data);
        
        if (adminResponse.data.success) {
          const { token, admin } = adminResponse.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(admin));
          setUser(admin);
          
          // Redirect based on role
          if (admin.role === 'admin' || admin.role === 'superadmin') {
            navigate('/admin/dashboard', { replace: true });
          }
        return { success: true };
        }
      } catch (adminError) {
        console.log('Admin login failed, trying seller login');
        // Don't throw here, continue to seller login
      }
      
      // If admin login fails, try seller login
      try {
        const sellerResponse = await axiosInstance.post('/users/login', {
          email: username,
          password: password
        });
        
        console.log('Seller login response:', sellerResponse.data);
        
        if (sellerResponse.data.success) {
          const { token, user } = sellerResponse.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          
          // Redirect seller to their dashboard
          if (user.role === 'seller') {
            navigate('/seller-dashboard', { replace: true });
          }
          return { success: true };
        } else {
          throw new Error(sellerResponse.data.message || 'فشل تسجيل الدخول');
        }
      } catch (sellerError) {
        console.error('Seller login error:', sellerError);
        throw sellerError;
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'فشل تسجيل الدخول';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout fonksiyonu
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login', { replace: true });
  };

  // Kullanıcı bilgilerini güncelle
  const updateUserProfile = async (updatedData) => {
    try {
      setLoading(true);
      const response = await AdminService.updateAdminProfile(updatedData);
      if (response.success) {
        const updatedUser = response.admin;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل تحديث البيانات';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Şifre değiştirme
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const response = await AdminService.changePassword(currentPassword, newPassword);
      if (response.success) {
      return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل تغيير كلمة المرور';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı yönetimi için fonksiyonlar
  const addUser = async (userData) => {
    return await AdminService.createUser(userData);
  };

  const updateUser = async (userId, userData) => {
    return await AdminService.updateUser(userId, userData);
  };

  const deleteUser = async (userId) => {
    return await AdminService.deleteUser(userId);
  };

  const getUsers = async () => {
    return await AdminService.getAllUsers();
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUserProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    isSeller: user?.role === 'seller',
    // Kullanıcı yönetimi fonksiyonları
    addUser,
    updateUser,
    deleteUser,
    getUsers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 