import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsapp: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format WhatsApp number if it's the whatsapp field
    if (name === 'whatsapp') {
      // console.log('Original WhatsApp value:', value);
      // Remove any non-digit characters
      let cleaned = value.replace(/\D/g, '');
      // console.log('Cleaned WhatsApp value:', cleaned);
      
      // If the number starts with 222, keep it
      if (cleaned.startsWith('222')) {
        cleaned = '+' + cleaned;
      } else {
        // Otherwise, add 222 prefix
        cleaned = '+222' + cleaned;
      }
      // console.log('Formatted WhatsApp value:', cleaned);
      
      // Limit the length to 12 digits (including country code)
      if (cleaned.length > 12) {
        cleaned = cleaned.slice(0, 12);
      }
      // console.log('Final WhatsApp value:', cleaned);
      
      setFormData(prev => ({
        ...prev,
        [name]: cleaned
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'رقم الواتساب مطلوب';
    } else if (!formData.whatsapp.startsWith('+222')) {
      newErrors.whatsapp = 'يجب أن يبدأ رقم الواتساب بـ +222';
    } else if (formData.whatsapp.length < 12) {
      newErrors.whatsapp = 'رقم الواتساب غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Check if user exists and was added by admin
      const checkResponse = await axiosInstance.post('/users/check-admin-added', {
        email: formData.email,
        phone: formData.phone
      });

      if (checkResponse.data.exists && checkResponse.data.isAdminAdded) {
        // If user exists and was added by admin, proceed with registration
        const response = await axiosInstance.post('/users/register', {
          ...formData,
          isAdminAdded: true
        });

        if (response.data.success) {
          toast({
            title: "تم التسجيل بنجاح",
            description: "يرجى انتظار موافقة المدير",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate('/seller-login');
        }
      } else {
        // Normal registration flow
        const response = await axiosInstance.post('/users/register', formData);
        
        if (response.data.success) {
          toast({
            title: "تم التسجيل بنجاح",
            description: "يرجى انتظار موافقة المدير",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate('/seller-login');
        }
      }
    } catch (error) {
      toast({
        title: "خطأ في التسجيل",
        description: error.response?.data?.message || "حدث خطأ أثناء التسجيل",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center" mb={6}>تسجيل حساب جديد</Heading>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.name}>
                <FormLabel>الاسم</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.email}>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="أدخل بريدك الإلكتروني"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.phone}>
                <FormLabel>رقم الهاتف</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="أدخل رقم هاتفك"
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.whatsapp}>
                <FormLabel>رقم الواتساب</FormLabel>
                <Input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+22212345678"
                />
                <FormErrorMessage>{errors.whatsapp}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.password}>
                <FormLabel>كلمة المرور</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="أدخل كلمة المرور"
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.confirmPassword}>
                <FormLabel>تأكيد كلمة المرور</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="أعد إدخال كلمة المرور"
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                mt={4}
                isLoading={loading}
              >
                تسجيل
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" mt={4}>
            لديك حساب بالفعل؟{' '}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate('/login')}
            >
              تسجيل الدخول
            </Button>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register; 