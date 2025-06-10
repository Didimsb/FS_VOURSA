import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import * as AdminService from '../services/AdminService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

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
      const loginError = localStorage.getItem('loginError');
      
     
      
      if (!token || !storedUser) {
        setUser(null);
        setLoading(false);
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
        localStorage.setItem('loginError', JSON.stringify({
          message: `Auth check failed: ${error.message}`,
          timestamp: new Date().toISOString()
        }));
        
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
        setLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, []);

  // Login fonksiyonu
  const login = async (username, password, role) => {
    try {
      setLoading(true);
      setError(null);
      
      // Clear previous error logs
      localStorage.removeItem('loginError');
      
      // Validate input
      if (!username || !password) {
        const errorMsg = 'الرجاء إدخال البريد الإلكتروني وكلمة المرور';
        localStorage.setItem('loginError', JSON.stringify({
          message: errorMsg,
          timestamp: new Date().toISOString()
        }));
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      let response;
      if (role === 'admin') {
        // Admin login
        response = await axiosInstance.post('/admin/login', {
          email: username,
          password: password
        });
        
        if (response.data.success) {
          const { token, admin } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(admin));
          setUser(admin);
          
          // Set auth header
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Redirect to admin dashboard
          navigate('/admin/dashboard', { replace: true });
          return { success: true };
        }
      } else if (role === 'seller') {
        // Seller login
        response = await axiosInstance.post('/users/login', {
          email: username,
          password: password
        });
        
        if (response.data.success) {
          const { token, user } = response.data;
          
          // Validate user data
          if (!user || !user.role) {
            throw new Error('Invalid user data received from server');
          }
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          
          // Set auth header
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Redirect to seller dashboard
          navigate('/seller-dashboard', { replace: true });
          return { success: true };
        }
      }

      // If we get here, login failed
      const errorMsg = response?.data?.message || 'فشل تسجيل الدخول';
      localStorage.setItem('loginError', JSON.stringify({
        message: `Login failed: ${errorMsg}`,
        response: response?.data,
        timestamp: new Date().toISOString()
      }));
      throw new Error(errorMsg);
      
    } catch (err) {
      let errorMessage;
      
      if (err.response) {
        errorMessage = err.response?.data?.message || 'فشل تسجيل الدخول - خطأ في الاستجابة';
        localStorage.setItem('loginError', JSON.stringify({
          message: `Response error: ${errorMessage}`,
          details: err.response.data,
          timestamp: new Date().toISOString()
        }));
      } else if (err.request) {
        errorMessage = 'فشل الاتصال بالخادم - يرجى التحقق من اتصالك بالإنترنت';
        localStorage.setItem('loginError', JSON.stringify({
          message: `Network error: ${errorMessage}`,
          timestamp: new Date().toISOString()
        }));
      } else {
        errorMessage = err.message || 'فشل تسجيل الدخول - خطأ غير معروف';
        localStorage.setItem('loginError', JSON.stringify({
          message: `Unknown error: ${errorMessage}`,
          timestamp: new Date().toISOString()
        }));
      }
      
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
    delete axiosInstance.defaults.headers.common['Authorization'];
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

  const approveSeller = async (userId) => {
    try {
      const response = await AdminService.approveSeller(userId);
      return response;
    } catch (error) {
      throw error;
    }
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
    getUsers,
    approveSeller
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;