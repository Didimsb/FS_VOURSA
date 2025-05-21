import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import PropertyDetail from './pages/PropertyDetail';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SellerLogin from './pages/SellerLogin';
import Register from './pages/Register';
import theme from './theme';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';

// Layout Components
const Layout = ({ children }) => (
  <Box
    as={motion.div}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    minH="100vh"
    bg="gray.50"
  >
    <Navbar />
    <Box as="main" pt="16">
      {children}
    </Box>
  </Box>
);

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  // Kullanıcı yoksa login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı varsa rol kontrolü yap
  if (user) {
    // Admin route'u için kontrol
    if (role === 'admin' && (user.role === 'admin' || user.role === 'superadmin')) {
      return children;
    }
    
    // Seller route'u için kontrol - admin ve seller erişebilir
    if (role === 'seller' && (user.role === 'seller' || user.role === 'admin' || user.role === 'superadmin')) {
      return children;
    }

    // Rol uyuşmazlığı varsa ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<SellerLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/admin/login" element={<SellerLogin admin={true} />} />
            
            {/* Seller Routes */}
            <Route
              path="/seller-dashboard/*"
              element={
                <ProtectedRoute role="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
