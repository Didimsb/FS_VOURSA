import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Icon,
  useToast,
  Flex,
  Image,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  CheckIcon,
  Badge,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Award, 
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);

const SellerLogin = ({ admin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'seller') {
        navigate('/seller-dashboard');
      }
    }
  }, [user, navigate]);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('primary.500', 'primary.300');
  const lightBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const inputTextColor = useColorModeValue('gray.800', 'white');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');
  const featureBg = useColorModeValue('primary.50', 'primary.900');
  const featureTextColor = useColorModeValue('primary.700', 'primary.200');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setError(result.error || 'فشل تسجيل الدخول');
      toast({
        title: "فشل تسجيل الدخول",
        description: result.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };
  
  const features = [
    {
      icon: Shield,
      title: 'حماية كاملة',
      description: 'نضمن حماية بياناتك وعملياتك',
    },
    {
      icon: Award,
      title: 'دعم احترافي',
      description: 'فريق دعم متخصص لمساعدتك',
    },
    {
      icon: Star,
      title: 'مميزات حصرية',
      description: 'وصول إلى أدوات متقدمة للبائعين',
    },
  ];
  
  return (
    <Box 
      bg={lightBg} 
      minH="100vh" 
      py={{ base: 10, md: 20 }}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.05,
        zIndex: 0,
      }}
    >
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
          {/* Left side - Features */}
          <MotionVStack
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            align="start"
            spacing={8}
            display={{ base: 'none', md: 'flex' }}
          >
            <VStack align="start" spacing={4}>
              <Badge colorScheme="primary" fontSize="md" px={3} py={1} rounded="full">
                لوحة التحكم
              </Badge>
              <Heading
                as="h1"
                size="2xl"
                color={headingColor}
                lineHeight="shorter"
              >
                مرحباً بك في لوحة التحكم
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="md">
                قم بإدارة عقاراتك وعملياتك بسهولة وأمان
              </Text>
            </VStack>
            
            <VStack spacing={6} align="start" w="full">
              {features.map((feature, index) => (
                <MotionFlex
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  align="center"
                  bg={featureBg}
                  p={4}
                  rounded="xl"
                  w="full"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "lg",
                    transition: "all 0.3s ease"
                  }}
                >
                  <Flex
                    bg="white"
                    p={3}
                    rounded="lg"
                    color={accentColor}
                    mr={4}
                    boxShadow="md"
                  >
                    <Icon as={feature.icon} w={6} h={6} />
                  </Flex>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={featureTextColor}>
                      {feature.title}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {feature.description}
                    </Text>
                  </VStack>
                </MotionFlex>
              ))}
            </VStack>
            
            <HStack spacing={4} mt={4}>
              <Icon as={CheckCircle} color="green.500" />
              <Text color={textColor}>
                أكثر من <Text as="span" fontWeight="bold" color={accentColor}>500+</Text> بائع نشط
              </Text>
            </HStack>
            <HStack spacing={4}>
              <Icon as={CheckCircle} color="green.500" />
              <Text color={textColor}>
                أكثر من <Text as="span" fontWeight="bold" color={accentColor}>10,000+</Text> عملية بيع ناجحة
              </Text>
            </HStack>
          </MotionVStack>
          
          {/* Right side - Login Form */}
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <VStack
              bg={cardBg}
              p={{ base: 6, md: 10 }}
              rounded="2xl"
              boxShadow="xl"
              borderWidth="1px"
              borderColor={borderColor}
              spacing={6}
              align="stretch"
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                bgGradient: "linear(to-r, primary.400, primary.600)",
              }}
            >
              <VStack spacing={2} textAlign="center" mb={4}>
                <Badge colorScheme="primary" fontSize="md" px={3} py={1} rounded="full" mb={2}>
                  تسجيل الدخول
                </Badge>
                <Heading size="xl" color={headingColor}>
                  مرحباً بعودتك!
                </Heading>
                <Text color={textColor}>
                  أدخل بيانات حسابك للوصول إلى لوحة التحكم
                </Text>
              </VStack>
              
              {error && (
                <Alert status="error" rounded="lg">
                  <AlertIcon />
                  <AlertTitle>خطأ!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel color={headingColor}>البريد الإلكتروني</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={User} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="أدخل البريد الإلكتروني"
                        bg={inputBg}
                        borderColor={inputBorderColor}
                        color={inputTextColor}
                        _placeholder={{ color: placeholderColor }}
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                        size="lg"
                        rounded="lg"
                      />
                    </InputGroup>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel color={headingColor}>كلمة المرور</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={Lock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        bg={inputBg}
                        borderColor={inputBorderColor}
                        color={inputTextColor}
                        _placeholder={{ color: placeholderColor }}
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                        size="lg"
                        rounded="lg"
                      />
                      <InputRightElement>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Icon as={EyeOff} /> : <Icon as={Eye} />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  
                  <Button
                    type="submit"
                    colorScheme="green"
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                    loadingText="جاري تسجيل الدخول..."
                    rightIcon={<ArrowRight size={24} />}
                    mt={4}
                    rounded="lg"
                    height="60px"
                    fontSize="lg"
                    fontWeight="bold"
                    bg="green.500"
                    color="white"
                    _hover={{
                      transform: "translateY(-3px)",
                      boxShadow: "lg",
                      bg: "green.600",
                    }}
                    _active={{
                      bg: "green.700",
                    }}
                    transition="all 0.3s ease"
                  >
                    تسجيل الدخول
                  </Button>
                </VStack>
              </form>
              
              <Divider my={6} />
              
              <Alert
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                rounded="lg"
                p={4}
                bg={lightBg}
              >
                <AlertIcon boxSize="24px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  ليس لديك حساب؟
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  قم بإنشاء حساب جديد للوصول إلى المنصة
                </AlertDescription>
                <Button
                  leftIcon={<User />}
                  colorScheme="blue"
                  size="md"
                  mt={4}
                  onClick={() => navigate('/register')}
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "md",
                  }}
                  transition="all 0.3s ease"
                  rounded="lg"
                >
                  إنشاء حساب جديد
                </Button>
              </Alert>
            </VStack>
          </MotionBox>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default SellerLogin; 