// Contact page component - Updated with improved mobile responsiveness
// Last modified: 24/04/2024
import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Button,
  useColorModeValue,
  Avatar,
  Badge,
  Flex,
  Divider,
  useToast,
  Tooltip,
  Image,
  IconButton,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Clock,
  Globe,
  Building,
  User,
  CheckCircle,
  Star,
  Award,
  Shield,
  Heart,
  ThumbsUp,
  Users,
  Briefcase,
  Target,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Contact = () => {
  const { settings, loading } = useSettings();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('primary.500', 'primary.300');
  const lightBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');
  const tabBg = useColorModeValue('gray.100', 'gray.700');
  const testimonialBg = useColorModeValue('gray.50', 'gray.900');
  const tabSelectedBg = useColorModeValue('primary.500', 'primary.400');
  const tabSelectedColor = useColorModeValue('white', 'white');
  const tabColor = useColorModeValue('gray.700', 'gray.300');
  const tabBorderColor = useColorModeValue('primary.500', 'primary.400');
  
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const teamMembers = [
    {
      name: 'أحمد محمد',
      role: 'مدير المبيعات',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      whatsapp: '+22212345678',
      email: 'ahmed@voursa.com',
      bio: 'خبرة 8 سنوات في مجال العقارات',
      expertise: ['عقارات سكنية', 'عقارات تجارية', 'استثمار عقاري'],
      rating: 4.9,
      clients: 120,
    },
    {
      name: 'فاطمة الزهراء',
      role: 'مستشارة عقارية',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      whatsapp: '+22212345679',
      email: 'fatima@voursa.com',
      bio: 'خبرة 5 سنوات في الاستشارات العقارية',
      expertise: ['تقييم العقارات', 'تحليل السوق', 'إدارة العقارات'],
      rating: 4.8,
      clients: 85,
    },
    {
      name: 'عبد الرحمن سعيد',
      role: 'مدير التسويق',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      whatsapp: '+22212345680',
      email: 'abdulrahman@voursa.com',
      bio: 'خبرة 7 سنوات في التسويق العقاري',
      expertise: ['تسويق رقمي', 'تصوير عقاري', 'إعلانات'],
      rating: 4.7,
      clients: 95,
    },
    {
      name: 'أسماء محمد',
      role: 'مستشارة عقارية',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      whatsapp: '+22212345681',
      email: 'asma@voursa.com',
      bio: 'خبرة 4 سنوات في الاستشارات العقارية',
      expertise: ['عقارات فاخرة', 'تطوير عقاري', 'إدارة المشاريع'],
      rating: 4.9,
      clients: 75,
    },
  ];
  
  const testimonials = [
    {
      name: 'محمد علي',
      role: 'مستثمر عقاري',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'خدمة ممتازة وفريق عمل محترف. ساعدوني في العثور على أفضل الفرص الاستثمارية في السوق.',
      rating: 5,
    },
    {
      name: 'فاطمة أحمد',
      role: 'مالكة منزل',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'تجربة رائعة في شراء منزلي الأول. الفريق كان متعاوناً جداً وقدم لي كل المعلومات التي أحتاجها.',
      rating: 5,
    },
    {
      name: 'عبد الله سعيد',
      role: 'مطور عقاري',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      text: 'شركة موثوقة وذات سمعة طيبة في السوق. أنصح الجميع بالتعامل معهم.',
      rating: 4,
    },
  ];
  
  const handleWhatsAppClick = (phone) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };
  
  const renderStars = (rating) => {
    return Array(5).fill('').map((_, i) => (
      <Icon 
        key={i} 
        as={Star} 
        color={i < rating ? 'yellow.400' : 'gray.300'} 
        w={4} 
        h={4} 
      />
    ));
  };
  
  // Debug logging for settings
  useEffect(() => {
    console.log('=== Contact Page Settings Debug ===');
    console.log('Full Settings Object:', settings);
    console.log('Contact Page Settings:', settings?.contactPage);
    console.log('Banners:', settings?.banners);
    console.log('Contact Info:', {
      phone: settings?.contactPhone,
      whatsapp: settings?.whatsappNumber,
      email: settings?.contactEmail,
      address: settings?.contactPage?.address,
      socialMedia: settings?.socialMedia,
      mapUrl: settings?.mapEmbedUrl
    });
  }, [settings]);
  
  return (
    <Box bg={bgColor} overflow="hidden">
      {/* Hero Section with Parallax */}
      <Box 
        bg={lightBg} 
        py={{ base: 16, md: 24 }} 
        position="relative" 
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('${settings?.banners?.contact?.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: 0,
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 6 }}>
          <MotionFlex 
            direction="column" 
            align="center" 
            textAlign="center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Heading
              as="h1"
              size={{ base: "xl", md: "2xl" }}
              mb={4}
              textShadow="2px 2px 4px rgba(0,0,0,0.5)"
            >
              {settings?.banners?.contact?.title || 'تواصل معنا'}
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} maxW="3xl" mx="auto" textShadow="1px 1px 2px rgba(0,0,0,0.5)">
              {settings?.banners?.contact?.description || 'نحن هنا لمساعدتك في جميع احتياجاتك العقارية'}
            </Text>
            <HStack spacing={4} mt={6} flexWrap={{ base: "wrap", md: "nowrap" }} justify="center">
              <Button
                size={{ base: "md", md: "lg" }}
                colorScheme="green"
                leftIcon={<Phone />}
                as="a"
                href={`tel:${settings?.contactPhone || '+22212345678'}`}
                _hover={{
                  transform: "translateY(-3px)",
                  boxShadow: "xl",
                }}
                transition="all 0.3s ease"
                mb={{ base: 2, md: 0 }}
              >
                اتصل الآن
              </Button>
              <Button
                size={{ base: "md", md: "lg" }}
                variant="outline"
                colorScheme="primary"
                leftIcon={<MessageCircle />}
                onClick={() => handleWhatsAppClick(settings?.contactPhone || '+22212345678')}
                _hover={{
                  transform: "translateY(-3px)",
                  boxShadow: "xl",
                }}
                transition="all 0.3s ease"
              >
                واتساب
              </Button>
            </HStack>
          </MotionFlex>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Box py={16} bg={cardBg}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <VStack
                bg={lightBg}
                p={8}
                rounded="xl"
                boxShadow="lg"
                borderWidth="1px"
                borderColor={borderColor}
                spacing={4}
                align="center"
                h="full"
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
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "xl",
                  transition: "all 0.3s ease"
                }}
              >
                <Icon as={Award} w={10} h={10} color={accentColor} />
                <Heading size="xl" color={headingColor}>500+</Heading>
                <Text color={textColor} textAlign="center" fontWeight="medium">
                  عقار تم بيعه
                </Text>
              </VStack>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <VStack
                bg={lightBg}
                p={8}
                rounded="xl"
                boxShadow="lg"
                borderWidth="1px"
                borderColor={borderColor}
                spacing={4}
                align="center"
                h="full"
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
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "xl",
                  transition: "all 0.3s ease"
                }}
              >
                <Icon as={Users} w={10} h={10} color={accentColor} />
                <Heading size="xl" color={headingColor}>1000+</Heading>
                <Text color={textColor} textAlign="center" fontWeight="medium">
                  عميل راضٍ
                </Text>
              </VStack>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <VStack
                bg={lightBg}
                p={8}
                rounded="xl"
                boxShadow="lg"
                borderWidth="1px"
                borderColor={borderColor}
                spacing={4}
                align="center"
                h="full"
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
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "xl",
                  transition: "all 0.3s ease"
                }}
              >
                <Icon as={Briefcase} w={10} h={10} color={accentColor} />
                <Heading size="xl" color={headingColor}>10+</Heading>
                <Text color={textColor} textAlign="center" fontWeight="medium">
                  سنوات خبرة
                </Text>
              </VStack>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <VStack
                bg={lightBg}
                p={8}
                rounded="xl"
                boxShadow="lg"
                borderWidth="1px"
                borderColor={borderColor}
                spacing={4}
                align="center"
                h="full"
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
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "xl",
                  transition: "all 0.3s ease"
                }}
              >
                <Icon as={Building} w={10} h={10} color={accentColor} />
                <Heading size="xl" color={headingColor}>3</Heading>
                <Text color={textColor} textAlign="center" fontWeight="medium">
                  مكاتب
                </Text>
              </VStack>
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Team Members Section */}
      <Box py={16} px={4}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              color={textColor}
            >
              فريقنا
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {settings?.teamMembers?.map((member) => (
                <Box
                  key={member._id}
                bg={cardBg}
                  borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                  transition="transform 0.2s"
                  _hover={{ transform: 'translateY(-5px)' }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    w="100%"
                    h="300px"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <Heading as="h3" size="md" mb={2} color={textColor}>
                      {member.name}
            </Heading>
                    <Text color={textColor} mb={4}>
                      {member.position}
            </Text>
                    <Text color={textColor} mb={4}>
                      {member.bio}
                    </Text>
                    <HStack spacing={4} justify="center">
                      {member.social?.facebook && (
                        <Link href={member.social.facebook} isExternal>
                          <IconButton
                            aria-label="Facebook"
                            icon={<FaFacebook />}
                            size="md"
                            colorScheme="facebook"
                            variant="ghost"
                          />
                        </Link>
                      )}
                      {member.social?.twitter && (
                        <Link href={member.social.twitter} isExternal>
                          <IconButton
                            aria-label="Twitter"
                            icon={<FaTwitter />}
                            size="md"
                            colorScheme="twitter"
                            variant="ghost"
                          />
                        </Link>
                      )}
                      {member.social?.instagram && (
                        <Link href={member.social.instagram} isExternal>
                          <IconButton
                            aria-label="Instagram"
                            icon={<FaInstagram />}
                            size="md"
                            colorScheme="pink"
                            variant="ghost"
                          />
                        </Link>
                      )}
                      {member.social?.linkedin && (
                        <Link href={member.social.linkedin} isExternal>
                          <IconButton
                            aria-label="LinkedIn"
                            icon={<FaLinkedin />}
                            size="md"
                            colorScheme="linkedin"
                            variant="ghost"
                          />
                        </Link>
                      )}
                  </HStack>
                  </Box>
                </Box>
            ))}
          </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* Contact Info Section */}
      <Box py={16} bg={lightBg}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            textAlign="center"
            mb={12}
          >
            <Heading
              as="h2"
              size="xl"
              mb={4}
              color={headingColor}
            >
              معلومات الاتصال
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="3xl" mx="auto">
              تواصل معنا عبر أي من الوسائل التالية
            </Text>
          </MotionBox>
          
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            <GridItem>
              <VStack spacing={8} align="start">
                <VStack spacing={6} align="start" w="full">
                  <HStack spacing={4}>
                    <Icon as={Phone} color={accentColor} boxSize={6} />
                    <Text color={textColor}>{settings?.contactPage?.phone || settings?.contactPhone || ''}</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <Icon as={Mail} color={accentColor} boxSize={6} />
                    <Text color={textColor}>{settings?.contactPage?.email || settings?.contactEmail || ''}</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <Icon as={MapPin} color={accentColor} boxSize={6} />
                    <Text color={textColor}>{settings?.contactPage?.address || ''}</Text>
                  </HStack>
                </VStack>
                <VStack spacing={4} align="start">
                  <Heading size="md" color={headingColor}>
                    تابعنا على
                  </Heading>
                  <HStack spacing={4}>
                    {settings?.socialMedia?.facebook && (
                      <Link href={settings.socialMedia.facebook} isExternal>
                        <Icon as={FaFacebook} color={accentColor} boxSize={6} />
                      </Link>
                    )}
                    {settings?.socialMedia?.twitter && (
                      <Link href={settings.socialMedia.twitter} isExternal>
                        <Icon as={FaTwitter} color={accentColor} boxSize={6} />
                      </Link>
                    )}
                    {settings?.socialMedia?.instagram && (
                      <Link href={settings.socialMedia.instagram} isExternal>
                        <Icon as={FaInstagram} color={accentColor} boxSize={6} />
                      </Link>
                    )}
                  </HStack>
                </VStack>
              </VStack>
            </GridItem>
            <GridItem>
              {settings?.contactPage?.mapEmbedUrl && (
                <Box 
                  h={{ base: "300px", md: "400px" }} 
                  rounded="xl" 
                  overflow="hidden"
                  position="relative"
                  w="100%"
                  maxW="100%"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    dangerouslySetInnerHTML={{ 
                      __html: settings.contactPage.mapEmbedUrl.replace('width="600"', 'width="100%"').replace('height="450"', 'height="100%"') 
                    }} 
                  />
                </Box>
              )}
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact; 