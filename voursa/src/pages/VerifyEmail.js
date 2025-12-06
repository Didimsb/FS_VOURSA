import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  Container,
  PinInput,
  PinInputField,
  Icon,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdEmail, MdRefresh } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال رمز التحقق المكون من 6 أرقام',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/verify-email', {
        email,
        code,
      });

      if (response.data.success) {
        toast({
          title: 'تم التحقق بنجاح',
          description: 'تم إنشاء حسابك بنجاح. يرجى انتظار موافقة المدير.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/seller-login');
      }
    } catch (error) {
      toast({
        title: 'خطأ في التحقق',
        description: error.response?.data?.message || 'رمز التحقق غير صحيح',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await axiosInstance.post('/users/resend-code', {
        email,
      });

      if (response.data.success) {
        toast({
          title: 'تم الإرسال',
          description: 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setCountdown(60);
        setCanResend(false);
        setCode('');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء إعادة الإرسال',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleCodeComplete = (value) => {
    setCode(value);
  };

  if (!email) {
    return null;
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Icon as={MdEmail} boxSize={16} color="blue.500" />

          <Heading size="lg">التحقق من البريد الإلكتروني</Heading>

          <Text color="gray.600" fontSize="md">
            تم إرسال رمز التحقق المكون من 6 أرقام إلى
          </Text>

          <Text fontWeight="bold" color="blue.600" fontSize="lg">
            {email}
          </Text>

          <Text color="gray.500" fontSize="sm">
            يرجى إدخال الرمز أدناه لتأكيد تسجيلك
          </Text>

          <HStack justify="center" mt={4}>
            <PinInput
              size="lg"
              value={code}
              onChange={handleCodeChange}
              onComplete={handleCodeComplete}
              otp
            >
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>

          <Button
            colorScheme="blue"
            size="lg"
            width="full"
            onClick={handleVerify}
            isLoading={loading}
            loadingText="جاري التحقق..."
            isDisabled={code.length !== 6}
          >
            تأكيد
          </Button>

          <VStack spacing={2}>
            <Text color="gray.500" fontSize="sm">
              لم تستلم الرمز؟
            </Text>

            {canResend ? (
              <Button
                variant="ghost"
                colorScheme="blue"
                leftIcon={<MdRefresh />}
                onClick={handleResend}
                isLoading={resendLoading}
                loadingText="جاري الإرسال..."
              >
                إعادة إرسال الرمز
              </Button>
            ) : (
              <Text color="gray.400" fontSize="sm">
                يمكنك إعادة الإرسال بعد {countdown} ثانية
              </Text>
            )}
          </VStack>

          <Button
            variant="link"
            colorScheme="gray"
            onClick={() => navigate('/register')}
          >
            العودة إلى التسجيل
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
