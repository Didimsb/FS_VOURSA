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
        console.error('Login attempt with empty credentials');
        setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
        return { success: false, error: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' };
      }
      
      let isAdmin = false;
      
      // First try admin login
      try {
        console.log('Attempting admin login for:', username);
        const adminResponse = await axiosInstance.post('/admin/login', {
          email: username,
          password: password
        });
        
        console.log('Admin login response:', adminResponse.data);
        
        if (adminResponse.data.success) {
          const { token, admin } = adminResponse.data;
          
          // Check if user is admin or superadmin
          if (admin.role === 'admin' || admin.role === 'superadmin') {
            isAdmin = true;
            console.log('Storing admin data:', { token, admin });
            
            // Set token in axios headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(admin));
            
            // Update state
            setUser(admin);
            
            // Redirect to admin dashboard
            navigate('/admin/dashboard', { replace: true });
            return { success: true };
          } else {
            console.log('User is not admin or superadmin, continuing with seller login');
          }
        }
      } catch (adminError) {
        // Log admin login failure but don't throw error
        console.log('Admin login failed, continuing with seller login:', {
          message: adminError.message,
          response: adminError.response?.data
        });
      }
      
      // If not admin or superadmin, try seller login
      if (!isAdmin) {
        console.log('Attempting seller login for:', username);
        try {
          const sellerResponse = await axiosInstance.post('/users/login', {
            email: username,
            password: password
          });
          
          console.log('Seller login response:', sellerResponse.data);
          
          if (sellerResponse.data.success) {
            const { token, user } = sellerResponse.data;
            console.log('Received seller data:', { token, user });
            
            if (!token || !user) {
              console.error('Missing token or user data in response');
              throw new Error('Invalid login response');
            }
            
            // Set token in axios headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Set axios header with token');
            
            try {
              // Store token and user data
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              console.log('Stored data in localStorage');
              
              // Verify storage
              const storedToken = localStorage.getItem('token');
              const storedUser = JSON.parse(localStorage.getItem('user'));
              console.log('Verified stored data:', { storedToken, storedUser });
              
              if (!storedToken || !storedUser) {
                throw new Error('Failed to verify stored data');
              }
              
              // Update state
              setUser(user);
              console.log('Updated user state');
              
              // Wait for state update
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Final verification
              const finalToken = localStorage.getItem('token');
              const finalUser = JSON.parse(localStorage.getItem('user'));
              console.log('Final verification:', { finalToken, finalUser });
              
              if (!finalToken || !finalUser) {
                throw new Error('Data lost after state update');
              }
              
              // Redirect to seller dashboard
              navigate('/seller-dashboard', { replace: true });
              return { success: true };
            } catch (storageError) {
              console.error('Storage error:', storageError);
              throw new Error('Failed to store login data: ' + storageError.message);
            }
          } else {
            const errorMessage = sellerResponse.data.message || 'فشل تسجيل الدخول';
            console.error('Seller login failed:', errorMessage);
            setError(errorMessage);
            return { success: false, error: errorMessage };
          }
        } catch (sellerError) {
          console.error('Seller login error:', {
            message: sellerError.message,
            response: sellerError.response?.data,
            stack: sellerError.stack
          });
          
          let errorMessage;
          if (sellerError.response?.data?.message) {
            errorMessage = sellerError.response.data.message;
          } else if (sellerError.response?.data?.error) {
            errorMessage = sellerError.response.data.error;
          } else if (sellerError.message === 'Network Error') {
            errorMessage = 'فشل الاتصال بالخادم - يرجى التحقق من اتصالك بالإنترنت';
          } else {
            errorMessage = sellerError.message || 'فشل تسجيل الدخول - يرجى المحاولة مرة أخرى';
          }
          
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      }
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage;
      if (err.response) {
        errorMessage = err.response?.data?.message || 'فشل تسجيل الدخول - خطأ في الاستجابة';
      } else if (err.request) {
        errorMessage = 'فشل الاتصال بالخادم - يرجى التحقق من اتصالك بالإنترنت';
      } else {
        errorMessage = err.message || 'فشل تسجيل الدخول - خطأ غير معروف';
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